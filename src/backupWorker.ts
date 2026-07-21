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
    if (target === "github") {
      if (!config.githubToken || !config.githubGistId) {
        throw new Error("Configuration GitHub incomplète.");
      }

      // Large JSON stringify in the background worker thread (non-blocking)
      const content = JSON.stringify(latestPayload, null, 2);

      const res = await fetch(`https://api.github.com/gists/${config.githubGistId}`, {
        method: "PATCH",
        headers: {
          "Authorization": `token ${config.githubToken}`,
          "Content-Type": "application/json",
          "Accept": "application/vnd.github.v3+json"
        },
        body: JSON.stringify({
          description: "Backup Second Brain - FinancePath",
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
      const content = JSON.stringify(latestPayload);
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
      isSilent
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
