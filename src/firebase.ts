import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged, 
  setPersistence, 
  browserLocalPersistence, 
  User 
} from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import firebaseConfig from "../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId); /* CRITICAL: The app will break without this line */
export const auth = getAuth(app);

// Explicitly enable browserLocalPersistence to prevent mobile auth session drops when exiting or switching apps
if (typeof window !== "undefined") {
  setPersistence(auth, browserLocalPersistence).catch((err) => {
    console.warn("⚠️ [Firebase Auth] Failed to enable browserLocalPersistence:", err);
  });
}

export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function isOfflineError(error: unknown): boolean {
  if (typeof window !== "undefined" && !navigator.onLine) {
    return true;
  }
  const errMsg = error instanceof Error ? error.message.toLowerCase() : String(error).toLowerCase();
  return (
    errMsg.includes("offline") ||
    errMsg.includes("network") ||
    errMsg.includes("unreachable") ||
    errMsg.includes("internet") ||
    errMsg.includes("failed-precondition") ||
    errMsg.includes("unavailable") ||
    errMsg.includes("could not connect")
  );
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errMsg = error instanceof Error ? error.message : String(error);
  const errInfo: FirestoreErrorInfo = {
    error: errMsg,
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  if (isOfflineError(error)) {
    console.warn("🌱 [Firestore] Opération suspendue en raison d'un état hors-ligne ou d'une indisponibilité du réseau :", errMsg);
    const offlineErr = new Error("OFFLINE");
    (offlineErr as any).isOffline = true;
    throw offlineErr;
  }

  console.error("Firestore Error: ", JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helper to check connection when needed
export async function testConnection() {
  try {
    const testDocRef = doc(db, "test", "connection");
    await getDoc(testDocRef);
  } catch (error) {
    // Gracefully handle connection check without console spam
    console.debug("Firestore connection check info:", error);
  }
}

let cachedGoogleAccessToken: string | null = typeof window !== "undefined" ? localStorage.getItem("la_google_access_token") : null;

export const getSharedGoogleAccessToken = (): string | null => {
  if (cachedGoogleAccessToken) return cachedGoogleAccessToken;
  if (typeof window !== "undefined") {
    return localStorage.getItem("la_google_access_token");
  }
  return null;
};

export const setSharedGoogleAccessToken = (token: string | null) => {
  cachedGoogleAccessToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem("la_google_access_token", token);
    } else {
      localStorage.removeItem("la_google_access_token");
    }
  }
};

