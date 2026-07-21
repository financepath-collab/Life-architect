// Web Worker for asynchronous background backups to Google Drive and GitHub Gist

interface WorkerConfig {
  githubToken: string;
  githubGistId: string;
  driveToken: string | null;
  githubAutoSync: boolean;
  driveAutoSync: boolean;
}

let config: WorkerConfig = {
  githubToken: "",
  githubGistId: "",
  driveToken: null,
  githubAutoSync: false,
  driveAutoSync: false
};

let latestPayload: any = null;
let githubTimeoutId: any = null;
let driveTimeoutId: any = null;

const BACKUP_FILENAME = "SecondBrain_Backup.json";

function mergePayloads(local: any, remote: any): { mergedPayload: any; mergedModules: string[] } {
  if (!local) return { mergedPayload: remote, mergedModules: ["all"] };
  if (!remote) return { mergedPayload: local, mergedModules: [] };

  const localTimestamps = local.moduleTimestamps || {};
  const remoteTimestamps = remote.moduleTimestamps || {};

  const mergedPayload: any = {};
  const mergedTimestamps: Record<string, string> = {};
  const mergedModules: string[] = [];

  const keys = [
    "dailyHabits",
    "habitHistory",
    "weeklyObjectives",
    "transactions",
    "stocks",
    "budgets",
    "salaires",
    "epargnes",
    "actions30Jours",
    "profilAmeliorations",
    "possibilitesGoals",
    "skinTrackers",
    "sportExercises",
    "sportHistory",
    "mealPlanners",
    "focusMode",
    "achatsMensuels",
    "abonnements",
    "formations",
    "books",
    "screenMedia",
    "accounts",
    "links",
    "channels",
    "wishList",
    "achatsCouteux",
    "streakCount",
    "monthlyGoals",
    "editorialEvents",
    "folders",
    "journalEntries",
    "notificationInterval"
  ];

  keys.forEach(key => {
    const localTime = localTimestamps[key] ? new Date(localTimestamps[key]).getTime() : 0;
    const remoteTime = remoteTimestamps[key] ? new Date(remoteTimestamps[key]).getTime() : 0;

    if (remoteTime > localTime) {
      mergedPayload[key] = remote[key] !== undefined ? remote[key] : local[key];
      mergedTimestamps[key] = remoteTimestamps[key];
      mergedModules.push(key);
    } else {
      mergedPayload[key] = local[key] !== undefined ? local[key] : remote[key];
      if (localTimestamps[key]) {
        mergedTimestamps[key] = localTimestamps[key];
      } else if (remoteTimestamps[key]) {
        mergedTimestamps[key] = remoteTimestamps[key];
      }
    }
  });

  mergedPayload.moduleTimestamps = mergedTimestamps;
  return { mergedPayload, mergedModules };
}

self.onmessage = async (e: MessageEvent) => {
  const { type, data } = e.data;

  if (type === "CONFIGURE") {
    config = { ...config, ...data };
    
    // Clear scheduled tasks if sync gets disabled
    if (!config.githubAutoSync && githubTimeoutId) {
      clearTimeout(githubTimeoutId);
      githubTimeoutId = null;
    }
    if (!config.driveAutoSync && driveTimeoutId) {
      clearTimeout(driveTimeoutId);
      driveTimeoutId = null;
    }
  } else if (type === "UPDATE_PAYLOAD") {
    latestPayload = data;

    // Schedule GitHub Gist auto-sync if active
    if (config.githubAutoSync && config.githubToken && config.githubGistId) {
      if (githubTimeoutId) clearTimeout(githubTimeoutId);
      githubTimeoutId = setTimeout(() => {
        executeBackup("github", true);
      }, 12000); // 12 seconds debounce
    }

    // Schedule Google Drive auto-sync if active
    if (config.driveAutoSync && config.driveToken) {
      if (driveTimeoutId) clearTimeout(driveTimeoutId);
      driveTimeoutId = setTimeout(() => {
        executeBackup("drive", true);
      }, 15000); // 15 seconds debounce
    }
  } else if (type === "FORCE_BACKUP") {
    const { target } = data;
    executeBackup(target, false);
  }
};

async function executeBackup(target: "github" | "drive", isSilent: boolean) {
  if (!latestPayload) {
    self.postMessage({
      type: "SYNC_ERROR",
      target,
      error: "No state payload available to save.",
      isSilent
    });
    return;
  }

  self.postMessage({ type: "SYNC_START", target, isSilent });

  try {
    let finalPayload = latestPayload;
    let mergedModulesList: string[] = [];

    if (target === "github") {
      if (!config.githubToken || !config.githubGistId) {
        throw new Error("Configuration GitHub incomplète.");
      }

      // Fetch existing Gist first to merge
      let remotePayload: any = null;
      try {
        const gistRes = await fetch(`https://api.github.com/gists/${config.githubGistId}`, {
          headers: {
            "Authorization": `token ${config.githubToken}`,
            "Accept": "application/vnd.github.v3+json"
          }
        });
        if (gistRes.ok) {
          const gistData = await gistRes.json();
          const backupFile = gistData.files?.["second_brain_backup.json"];
          if (backupFile && backupFile.content) {
            remotePayload = JSON.parse(backupFile.content);
          }
        }
      } catch (e) {
        console.warn("Could not fetch remote Gist for merging, proceeding with override...", e);
      }

      if (remotePayload) {
        const { mergedPayload, mergedModules } = mergePayloads(latestPayload, remotePayload);
        finalPayload = mergedPayload;
        mergedModulesList = mergedModules;
      }

      // Large JSON stringify in the background worker thread (non-blocking)
      const content = JSON.stringify(finalPayload, null, 2);

      const res = await fetch(`https://api.github.com/gists/${config.githubGistId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `token ${config.githubToken}`,
          "Content-Type": "application/json",
          "Accept": "application/vnd.github.v3+json"
        },
        body: JSON.stringify({
          description: "Backup Second Brain - FinancePath (Merged)",
          files: {
            "second_brain_backup.json": {
              content
            }
          }
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Erreur API GitHub Gist: ${res.statusText || ""} ${errorText}`);
      }
    } else if (target === "drive") {
      if (!config.driveToken) {
        throw new Error("Jeton d'accès Google Drive absent.");
      }

      // 1. Search for existing backup file
      const q = encodeURIComponent(`name = '${BACKUP_FILENAME}' and trashed = false`);
      const searchUrl = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`;
      
      const searchRes = await fetch(searchUrl, {
        headers: {
          Authorization: `Bearer ${config.driveToken}`
        }
      });

      if (!searchRes.ok) {
        throw new Error(`Recherche Google Drive échouée: ${searchRes.statusText}`);
      }

      const searchData = await searchRes.json();
      const files = searchData.files || [];
      let fileId = files.length > 0 ? files[0].id : null;

      // Fetch existing Google Drive file content for smart merge
      let remotePayload: any = null;
      if (fileId) {
        try {
          const getUrl = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
          const getRes = await fetch(getUrl, {
            headers: {
              Authorization: `Bearer ${config.driveToken}`
            }
          });
          if (getRes.ok) {
            remotePayload = await getRes.json();
          }
        } catch (e) {
          console.warn("Could not fetch remote Drive file for merging, proceeding with override...", e);
        }
      }

      if (remotePayload) {
        const { mergedPayload, mergedModules } = mergePayloads(latestPayload, remotePayload);
        finalPayload = mergedPayload;
        mergedModulesList = mergedModules;
      }

      // 2. Create metadata if file doesn't exist yet
      if (!fileId) {
        const metaRes = await fetch("https://www.googleapis.com/drive/v3/files", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${config.driveToken}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: BACKUP_FILENAME,
            mimeType: "application/json"
          })
        });

        if (!metaRes.ok) {
          throw new Error(`Création des métadonnées Drive échouée: ${metaRes.statusText}`);
        }

        const fileMeta = await metaRes.json();
        fileId = fileMeta.id;
      }

      // 3. Upload JSON content
      const content = JSON.stringify(finalPayload);
      const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
      
      const uploadRes = await fetch(uploadUrl, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${config.driveToken}`,
          "Content-Type": "application/json"
        },
        body: content
      });

      if (!uploadRes.ok) {
        throw new Error(`Envoi du fichier vers Google Drive échoué: ${uploadRes.statusText}`);
      }
    }

    self.postMessage({
      type: "SYNC_SUCCESS",
      target,
      timestamp: new Date().toISOString(),
      isSilent,
      mergedPayload: finalPayload,
      mergedModules: mergedModulesList
    });
  } catch (error: any) {
    self.postMessage({
      type: "SYNC_ERROR",
      target,
      error: error.message || String(error),
      isSilent
    });
  }
}
