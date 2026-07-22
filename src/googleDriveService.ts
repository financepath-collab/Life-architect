import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from "firebase/auth";
import { auth, getSharedGoogleAccessToken, setSharedGoogleAccessToken } from "./firebase";

const provider = new GoogleAuthProvider();
// Add required Google Calendar and Google Drive scopes
provider.addScope("https://www.googleapis.com/auth/calendar");
provider.addScope("https://www.googleapis.com/auth/calendar.events");
provider.addScope("https://www.googleapis.com/auth/drive.file");
provider.addScope("https://www.googleapis.com/auth/drive");

let isSigningIn = false;

export const initDriveAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      const token = getSharedGoogleAccessToken();
      if (token) {
        if (onAuthSuccess) onAuthSuccess(user, token);
      } else if (!isSigningIn) {
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      setSharedGoogleAccessToken(null);
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const driveSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Impossible d'obtenir le jeton d'accès Google Drive.");
    }
    setSharedGoogleAccessToken(credential.accessToken);
    return { user: result.user, accessToken: credential.accessToken };
  } catch (error: any) {
    console.error("Error signing in to Google Drive:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getDriveAccessToken = (): string | null => {
  return getSharedGoogleAccessToken();
};

export const setDriveAccessToken = (token: string | null) => {
  setSharedGoogleAccessToken(token);
};

export const logoutDrive = () => {
  setSharedGoogleAccessToken(null);
};

const BACKUP_FILENAME = "SecondBrain_Backup.json";

// Find existing backup file in Google Drive
export const findBackupFile = async (accessToken: string): Promise<string | null> => {
  try {
    const q = encodeURIComponent(`name = '${BACKUP_FILENAME}' and trashed = false`);
    const url = `https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id,name)`;
    
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to search Google Drive: ${response.statusText}`);
    }

    const data = await response.json();
    const files = data.files || [];
    if (files.length > 0) {
      return files[0].id;
    }
    return null;
  } catch (error) {
    console.error("Error in findBackupFile:", error);
    throw error;
  }
};

// Create a new backup file and save data
export const createBackupFile = async (accessToken: string, payload: any): Promise<string> => {
  try {
    // 1. Create file metadata
    const metaUrl = "https://www.googleapis.com/drive/v3/files";
    const metaResponse = await fetch(metaUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: BACKUP_FILENAME,
        mimeType: "application/json",
      }),
    });

    if (!metaResponse.ok) {
      throw new Error(`Failed to create file metadata: ${metaResponse.statusText}`);
    }

    const fileMeta = await metaResponse.json();
    const fileId = fileMeta.id;

    // 2. Upload file content
    await updateBackupFileContent(accessToken, fileId, payload);
    return fileId;
  } catch (error) {
    console.error("Error in createBackupFile:", error);
    throw error;
  }
};

// Update existing file content
export const updateBackupFileContent = async (accessToken: string, fileId: string, payload: any): Promise<void> => {
  try {
    const uploadUrl = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`;
    const response = await fetch(uploadUrl, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Failed to update file content: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error in updateBackupFileContent:", error);
    throw error;
  }
};

// Read content from file
export const readBackupFileContent = async (accessToken: string, fileId: string): Promise<any> => {
  try {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to read file content: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in readBackupFileContent:", error);
    throw error;
  }
};

// Save data wrapper (Create or Update)
export const saveToDrive = async (accessToken: string, payload: any): Promise<string> => {
  const existingFileId = await findBackupFile(accessToken);
  if (existingFileId) {
    await updateBackupFileContent(accessToken, existingFileId, payload);
    return existingFileId;
  } else {
    return await createBackupFile(accessToken, payload);
  }
};

// Load data wrapper
export const loadFromDrive = async (accessToken: string): Promise<any | null> => {
  const existingFileId = await findBackupFile(accessToken);
  if (existingFileId) {
    return await readBackupFileContent(accessToken, existingFileId);
  }
  return null;
};
