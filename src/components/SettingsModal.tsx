import React from "react";
import { 
  X, 
  Settings, 
  Cloud, 
  CloudOff, 
  User, 
  LogOut, 
  RefreshCw, 
  Shield, 
  Database,
  CheckCircle,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User as FirebaseUser, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cloudSyncEnabled: boolean;
  onToggleCloudSync: (enabled: boolean) => Promise<void>;
  firebaseUser: FirebaseUser | null;
  syncStatus: "synced" | "syncing" | "local" | "error";
  lastSyncedTime: Date | null;
  isSyncing: boolean;
  onForceSync: () => Promise<void>;
}

export default function SettingsModal({
  isOpen,
  onClose,
  cloudSyncEnabled,
  onToggleCloudSync,
  firebaseUser,
  syncStatus,
  lastSyncedTime,
  isSyncing,
  onForceSync
}: SettingsModalProps) {
  
  if (!isOpen) return null;

  const handleLoginClick = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      console.error("Login failed:", e);
    }
  };

  const handleLogoutClick = async () => {
    try {
      await signOut(auth);
      await onToggleCloudSync(false); // Disable cloud sync when logging out
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  return (
    <div id="settings-modal" className="fixed inset-0 z-100 flex items-center justify-center p-4 select-none">
      
      {/* Backdrop */}
      <div 
        id="settings-modal-backdrop"
        className="fixed inset-0 bg-neutral-950/40 dark:bg-neutral-950/65 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div 
        id="settings-modal-card"
        className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150"
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-neutral-100 dark:bg-zinc-800 rounded-lg text-neutral-800 dark:text-neutral-200">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider font-sans">
                Paramètres Système
              </h3>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5 uppercase tracking-wide">
                CONFIGURATION & ARCHIVAGE CLOUD
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-xl text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          
          {/* Section: Firebase Identity */}
          <div className="space-y-3">
            <span className="text-[9px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider block font-mono">
              1. Compte Identité
            </span>
            
            {firebaseUser ? (
              <div className="flex items-center justify-between p-3.5 bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  {firebaseUser.photoURL ? (
                    <img 
                      src={firebaseUser.photoURL} 
                      alt="Profile" 
                      className="w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-700"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-9 h-9 bg-neutral-900 dark:bg-zinc-800 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {firebaseUser.displayName?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="text-xs font-black text-neutral-900 dark:text-neutral-100 block truncate">
                      {firebaseUser.displayName || "Utilisateur Cloud"}
                    </span>
                    <span className="text-[10px] text-neutral-400 block truncate font-mono">
                      {firebaseUser.email}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-neutral-700 dark:text-neutral-200 rounded-xl text-[10px] font-bold transition-all cursor-pointer select-none border border-neutral-200/50 dark:border-neutral-700"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Quitter
                </button>
              </div>
            ) : (
              <div className="p-5 text-center bg-neutral-50 dark:bg-zinc-950/30 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl space-y-3">
                <div className="w-10 h-10 bg-neutral-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto text-neutral-500">
                  <User className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200">
                    Aucun compte cloud connecté
                  </p>
                  <p className="text-[10px] text-neutral-400 max-w-[280px] mx-auto leading-relaxed">
                    Connectez-vous pour sécuriser vos données sur votre espace personnel Firebase.
                  </p>
                </div>
                <button
                  onClick={handleLoginClick}
                  className="w-full max-w-[180px] mx-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer select-none shadow-sm"
                >
                  <Cloud className="w-4 h-4 text-emerald-400" />
                  Connexion Google
                </button>
              </div>
            )}
          </div>

          {/* Section: Cloud Sync Toggle */}
          <div className="space-y-3">
            <span className="text-[9px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider block font-mono">
              2. Synchronisation en Temps Réel
            </span>
            
            <div className="p-4 bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                    {cloudSyncEnabled ? (
                      <Cloud className="w-4 h-4 text-emerald-500 animate-pulse" />
                    ) : (
                      <CloudOff className="w-4 h-4 text-neutral-400" />
                    )}
                    Synchronisation Cloud
                  </span>
                  <p className="text-[10px] text-neutral-400 max-w-[220px] leading-relaxed">
                    Sauvegarde automatique et instantanée de vos données dans Firestore.
                  </p>
                </div>
                
                {/* Custom Toggle Switch */}
                <button
                  disabled={!firebaseUser}
                  onClick={() => onToggleCloudSync(!cloudSyncEnabled)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer focus:outline-none ${
                    !firebaseUser ? "opacity-40 cursor-not-allowed bg-neutral-200 dark:bg-zinc-800" :
                    cloudSyncEnabled ? "bg-emerald-500" : "bg-neutral-300 dark:bg-zinc-700"
                  }`}
                  title={!firebaseUser ? "Veuillez vous connecter d'abord" : ""}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${cloudSyncEnabled ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Sync Status Info */}
              {cloudSyncEnabled && firebaseUser && (
                <div className="pt-3 border-t border-neutral-200/50 dark:border-neutral-800 flex items-center justify-between text-[10px] font-mono text-neutral-500">
                  <div className="flex items-center gap-1.5">
                    {isSyncing ? (
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-500 animate-spin" />
                    ) : syncStatus === "synced" ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                    ) : syncStatus === "error" ? (
                      <CloudOff className="w-3.5 h-3.5 text-rose-500" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                    <span>
                      {isSyncing ? "SYNCHRONISATION..." : syncStatus === "synced" ? "À JOUR" : syncStatus === "error" ? "ERREUR" : "EN ATTENTE"}
                    </span>
                  </div>
                  
                  {lastSyncedTime && (
                    <span className="text-neutral-400">
                      Synchro : {lastSyncedTime.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Fallback & Storage Status Explanation */}
          <div className="p-4 bg-neutral-100/50 dark:bg-zinc-950/20 rounded-2xl space-y-2">
            <div className="flex gap-2 text-neutral-500 dark:text-neutral-400">
              <Database className="w-4 h-4 shrink-0 mt-0.5 text-neutral-600 dark:text-neutral-300" />
              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase tracking-wider block leading-none">
                  Sauvegarde & Sécurité
                </span>
                <p className="text-[10px] leading-relaxed">
                  <strong>Fallback LocalStorage :</strong> Vos modifications sont toujours enregistrées en local. Si vous perdez votre connexion ou désactivez le cloud, votre Second Brain reste 100% accessible et utilisable.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Action Button Footer */}
        <div className="bg-neutral-50 dark:bg-zinc-950/30 p-4 border-t border-neutral-100 dark:border-neutral-800/80 flex justify-between gap-3">
          {cloudSyncEnabled && firebaseUser ? (
            <button
              disabled={isSyncing}
              onClick={onForceSync}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer select-none"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
              Synchroniser maintenant
            </button>
          ) : (
            <div className="flex-1 text-[10px] text-neutral-400 font-mono flex items-center justify-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              PERSISTANCE LOCALE ACTIVE PAR DÉFAUT
            </div>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-neutral-200 hover:bg-neutral-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-neutral-800 dark:text-neutral-100 rounded-xl text-xs font-bold transition-all cursor-pointer select-none"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
}
