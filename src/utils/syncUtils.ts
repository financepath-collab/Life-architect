// Synchronization and conflict resolution helper utilities for module-level merging.

export function mergePayloads(local: any, remote: any): { mergedPayload: any; mergedModules: string[] } {
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
    // Treat undefined as 0 (not modified yet)
    const localTime = localTimestamps[key] ? new Date(localTimestamps[key]).getTime() : 0;
    const remoteTime = remoteTimestamps[key] ? new Date(remoteTimestamps[key]).getTime() : 0;

    if (remoteTime > localTime) {
      // Remote is newer, take remote data
      mergedPayload[key] = remote[key] !== undefined ? remote[key] : local[key];
      mergedTimestamps[key] = remoteTimestamps[key];
      mergedModules.push(key);
    } else {
      // Local is newer or equal, keep local data
      mergedPayload[key] = local[key] !== undefined ? local[key] : remote[key];
      if (localTimestamps[key]) {
        mergedTimestamps[key] = localTimestamps[key];
      } else if (remoteTimestamps[key]) {
        // Fallback if local lacks timestamp but remote has it
        mergedTimestamps[key] = remoteTimestamps[key];
      }
    }
  });

  // Preserve any other parameters
  mergedPayload.moduleTimestamps = mergedTimestamps;

  return { mergedPayload, mergedModules };
}
