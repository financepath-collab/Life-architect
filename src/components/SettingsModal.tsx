import React, { useState } from "react";
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
  HelpCircle,
  Moon,
  Sun,
  Download,
  FileSpreadsheet
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User as FirebaseUser, signInWithPopup, signOut } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { 
  Account, 
  FinanceTransaction, 
  DailyHabit, 
  WeeklyObjective, 
  FinanceBudget, 
  FinanceEpargne, 
  Abonnement, 
  StockEntry, 
  JournalEntry 
} from "../types";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  cloudSyncEnabled: boolean;
  onToggleCloudSync: (enabled: boolean) => Promise<void> | void;
  firebaseUser: FirebaseUser | null;
  syncStatus: "synced" | "syncing" | "local" | "error";
  lastSyncedTime: Date | null;
  isSyncing: boolean;
  onForceSync: () => Promise<void> | void;
  isDriveConnected: boolean;
  isDriveLoading: boolean;
  onConnectDrive: () => Promise<void> | void;
  onDisconnectDrive: () => void;
  onBackupToDrive: () => Promise<void> | void;
  onRestoreFromDrive: () => Promise<void> | void;
  driveLastSynced: Date | null;
  driveAutoSync?: boolean;
  onToggleDriveAutoSync?: (enabled: boolean) => void;
  autoDarkTheme: boolean;
  onToggleAutoDarkTheme: (enabled: boolean) => void;
  
  // Data props for CSV Export
  accounts?: Account[];
  transactions?: FinanceTransaction[];
  dailyHabits?: DailyHabit[];
  weeklyObjectives?: WeeklyObjective[];
  budgets?: FinanceBudget[];
  epargnes?: FinanceEpargne[];
  abonnements?: Abonnement[];
  stocks?: StockEntry[];
  journalEntries?: JournalEntry[];
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
  onForceSync,
  isDriveConnected,
  isDriveLoading,
  onConnectDrive,
  onDisconnectDrive,
  onBackupToDrive,
  onRestoreFromDrive,
  driveLastSynced,
  driveAutoSync = false,
  onToggleDriveAutoSync = () => {},
  autoDarkTheme,
  onToggleAutoDarkTheme,
  accounts = [],
  transactions = [],
  dailyHabits = [],
  weeklyObjectives = [],
  budgets = [],
  epargnes = [],
  abonnements = [],
  stocks = [],
  journalEntries = []
}: SettingsModalProps) {
  
  if (!isOpen) return null;

  const isIframe = typeof window !== "undefined" && window.self !== window.top;
  const [authError, setAuthError] = useState<{ code: string; message: string; hostname: string } | null>(null);

  // CSV Export states & logic
  const [selectedExportModule, setSelectedExportModule] = useState<string>("accounts");
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const handleExportCSV = () => {
    let dataToExport: any[] = [];
    let filename = "";

    switch (selectedExportModule) {
      case "accounts":
        dataToExport = accounts;
        filename = `comptes_bancaires_${new Date().toISOString().slice(0, 10)}.csv`;
        break;
      case "transactions":
        dataToExport = transactions;
        filename = `transactions_${new Date().toISOString().slice(0, 10)}.csv`;
        break;
      case "dailyHabits":
        dataToExport = dailyHabits;
        filename = `habitudes_quotidiennes_${new Date().toISOString().slice(0, 10)}.csv`;
        break;
      case "weeklyObjectives":
        dataToExport = weeklyObjectives;
        filename = `objectifs_hebdomadaires_${new Date().toISOString().slice(0, 10)}.csv`;
        break;
      case "budgets":
        dataToExport = budgets;
        filename = `budgets_et_limites_${new Date().toISOString().slice(0, 10)}.csv`;
        break;
      case "epargnes":
        dataToExport = epargnes;
        filename = `objectifs_epargne_${new Date().toISOString().slice(0, 10)}.csv`;
        break;
      case "abonnements":
        dataToExport = abonnements;
        filename = `abonnements_${new Date().toISOString().slice(0, 10)}.csv`;
        break;
      case "stocks":
        dataToExport = stocks;
        filename = `portefeuille_actions_${new Date().toISOString().slice(0, 10)}.csv`;
        break;
      case "journalEntries":
        dataToExport = journalEntries;
        filename = `journal_de_bord_${new Date().toISOString().slice(0, 10)}.csv`;
        break;
      default:
        break;
    }

    if (!dataToExport || dataToExport.length === 0) {
      setExportFeedback("Aucune donnée disponible à exporter dans ce module.");
      setTimeout(() => setExportFeedback(null), 4000);
      return;
    }

    try {
      // Build a beautiful CSV with robust escaping
      const headers = Object.keys(dataToExport[0]);
      const csvRows = [
        headers.join(","),
        ...dataToExport.map(row => 
          headers.map(fieldName => {
            const val = row[fieldName];
            let cellStr = "";
            if (val === null || val === undefined) {
              cellStr = "";
            } else if (typeof val === "object") {
              cellStr = JSON.stringify(val);
            } else {
              cellStr = String(val);
            }
            // Escape double quotes and surround with double quotes
            return `"${cellStr.replace(/"/g, '""')}"`;
          }).join(",")
        )
      ];

      const csvContent = csvRows.join("\r\n");
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setExportFeedback(`Export réussi ! ${dataToExport.length} lignes téléchargées.`);
      setTimeout(() => setExportFeedback(null), 4000);
    } catch (err: any) {
      console.error("Export error:", err);
      setExportFeedback("Une erreur est survenue lors de l'exportation.");
      setTimeout(() => setExportFeedback(null), 4000);
    }
  };

  const handleLoginClick = async () => {
    setAuthError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e: any) {
      const errCode = e.code || "";
      const errMessage = e.message || "";
      const currentHostname = typeof window !== "undefined" ? window.location.hostname : "";
      
      console.group("[Firebase Auth] Google Sign-In Error Diagnostics");
      console.error("Error Object:", e);
      console.error("Error Code:", errCode);
      console.error("Error Message:", errMessage);
      console.error("Current Domain (window.location.hostname):", currentHostname);
      console.error("Is embedded in Iframe:", isIframe);
      console.groupEnd();

      if (errCode === "auth/unauthorized-domain" || errMessage.includes("unauthorized-domain")) {
        console.warn("[Firebase Auth] Detected auth/unauthorized-domain error! Displaying helpful user diagnostic panel.");
        setAuthError({
          code: "auth/unauthorized-domain",
          message: errMessage,
          hostname: currentHostname
        });
      } else if (errCode === "auth/configuration-not-found" || errMessage.includes("configuration-not-found")) {
        console.warn("[Firebase Auth] Detected auth/configuration-not-found error! Displaying helpful user diagnostic panel.");
        setAuthError({
          code: "auth/configuration-not-found",
          message: errMessage,
          hostname: currentHostname
        });
      } else {
        if (isIframe) {
          alert("La connexion a échoué. Les navigateurs bloquent l'authentification Google au sein des cadres (iframes) de prévisualisation. Veuillez ouvrir l'application dans un nouvel onglet en cliquant sur le bouton en haut à droite avant de vous connecter.");
        } else {
          alert("La connexion Google a échoué : " + (errMessage || e));
        }
      }
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
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          
          {/* Section: Firebase Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-500/30 rounded-md text-[10px] font-black uppercase font-mono tracking-wider">
                1. Compte Identité
              </span>
            </div>
            
            {firebaseUser ? (
              <div className="flex items-center justify-between p-4 bg-zinc-950/80 dark:bg-zinc-950 border border-zinc-800 rounded-2xl shadow-inner">
                <div className="flex items-center gap-3">
                  {firebaseUser.photoURL ? (
                    <img 
                      src={firebaseUser.photoURL} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full border-2 border-emerald-500/40 shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black text-sm shadow-sm">
                      {firebaseUser.displayName?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="min-w-0">
                    <span className="text-xs font-black text-white block truncate">
                      {firebaseUser.displayName || "Utilisateur Cloud"}
                    </span>
                    <span className="text-[11px] text-zinc-300 block truncate font-mono">
                      {firebaseUser.email}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleLogoutClick}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer select-none border border-rose-500/30"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Quitter
                </button>
              </div>
            ) : (
              <div className="p-5 text-center bg-zinc-950/80 dark:bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
                <div className="w-11 h-11 bg-zinc-900 border border-zinc-700/60 rounded-2xl flex items-center justify-center mx-auto text-zinc-300">
                  <User className="w-5.5 h-5.5" />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-white">
                    Aucun compte cloud connecté
                  </p>
                  <p className="text-[11px] text-zinc-300 max-w-[280px] mx-auto leading-relaxed">
                    Connectez-vous pour sécuriser vos données sur votre espace personnel Firebase.
                  </p>
                </div>
                <button
                  onClick={handleLoginClick}
                  className="w-full max-w-[200px] mx-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer select-none shadow-md"
                >
                  <Cloud className="w-4 h-4 text-white" />
                  Connexion Google
                </button>

                {authError && (
                  <div className="p-4 bg-rose-950/40 border border-rose-800/60 rounded-2xl text-left space-y-3 mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-start gap-2 text-rose-300">
                      <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider font-mono text-rose-300">
                          {authError.code === "auth/unauthorized-domain" ? "Domaine Non Autorisé" : "Configuration Manquante"}
                        </p>
                        <p className="text-[11px] mt-1 leading-normal text-rose-200">
                          {authError.code === "auth/unauthorized-domain" 
                            ? `Le domaine "${authError.hostname}" n'est pas autorisé dans la console Firebase.`
                            : `L'authentification Google n'est pas configurée dans la console Firebase.`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-zinc-950 rounded-xl border border-rose-900/40 text-[10.5px] text-zinc-300 space-y-2 leading-relaxed">
                      <p className="font-extrabold text-white">Comment résoudre ce problème :</p>
                      <ol className="list-decimal list-inside space-y-1.5 font-sans">
                        <li>Allez sur la <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline font-bold">Console Firebase</a></li>
                        <li>Ouvrez le projet : <strong className="font-mono text-rose-400 font-bold bg-zinc-900 px-1 py-0.5 rounded">gen-lang-client-0385167527</strong></li>
                        <li>Dans le menu latéral, cliquez sur <strong className="font-bold text-white">Authentication</strong></li>
                        {authError.code === "auth/unauthorized-domain" ? (
                          <>
                            <li>Allez dans l'onglet <strong className="font-bold text-white">Paramètres</strong></li>
                            <li>Sélectionnez <strong className="font-bold text-white">Domaines autorisés</strong></li>
                            <li>Ajoutez : <code className="font-mono bg-amber-950/60 text-amber-300 px-1.5 py-0.5 rounded font-bold select-all border border-amber-800/40">{authError.hostname}</code></li>
                          </>
                        ) : (
                          <>
                            <li>Allez dans l'onglet <strong className="font-bold text-white">Sign-in method</strong></li>
                            <li>Activez le fournisseur <strong className="font-bold text-white">Google</strong></li>
                          </>
                        )}
                      </ol>
                    </div>
                  </div>
                )}

                {isIframe && (
                  <div className="p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-left mt-2 animate-in fade-in duration-200">
                    <p className="text-[10.5px] text-amber-300 font-bold leading-relaxed">
                      ⚠️ Note : Les cadres (iframe) peuvent bloquer la popup Google. Ouvrez l'application dans un nouvel onglet pour vous connecter.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Section: Cloud Sync Toggle */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-md text-[10px] font-black uppercase font-mono tracking-wider">
                2. Synchronisation en Temps Réel
              </span>
            </div>
            
            <div className="p-4 bg-zinc-950/80 dark:bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-white flex items-center gap-2">
                    {cloudSyncEnabled ? (
                      <Cloud className="w-4 h-4 text-emerald-400 animate-pulse" />
                    ) : (
                      <CloudOff className="w-4 h-4 text-zinc-400" />
                    )}
                    Synchronisation Firestore Cloud
                  </span>
                  <p className="text-[11px] text-zinc-300 max-w-[240px] leading-relaxed">
                    Sauvegarde automatique instantanée de vos données dans votre Firestore.
                  </p>
                </div>
                
                {/* Toggle Switch */}
                <button
                  disabled={!firebaseUser}
                  onClick={() => onToggleCloudSync(!cloudSyncEnabled)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-200 cursor-pointer focus:outline-none ${
                    !firebaseUser ? "opacity-40 cursor-not-allowed bg-zinc-800" :
                    cloudSyncEnabled ? "bg-emerald-500" : "bg-zinc-700"
                  }`}
                  title={!firebaseUser ? "Veuillez vous connecter d'abord" : ""}
                >
                  <div className={`bg-white w-4.5 h-4.5 rounded-full shadow-md transform transition-transform duration-200 ${cloudSyncEnabled ? "translate-x-5.5" : "translate-x-0"}`} />
                </button>
              </div>

              {/* Sync Status Info */}
              {cloudSyncEnabled && firebaseUser && (
                <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-1.5">
                    {isSyncing ? (
                      <RefreshCw className="w-3.5 h-3.5 text-emerald-400 animate-spin" />
                    ) : syncStatus === "synced" ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5 text-zinc-400" />
                    )}
                    <span className="text-emerald-400 font-bold">
                      {isSyncing ? "SYNCHRONISATION..." : syncStatus === "synced" ? "À JOUR" : "EN ATTENTE"}
                    </span>
                  </div>
                  
                  {lastSyncedTime && (
                    <span className="text-zinc-400">
                      Dernière : {lastSyncedTime.toLocaleTimeString()}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Section: Google Drive Storage & Auto-Import */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-md text-[10px] font-black uppercase font-mono tracking-wider">
                3. Stockage & Auto-Importation Google Drive
              </span>
            </div>
            
            <div className="p-4 bg-zinc-950/80 dark:bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-amber-400" />
                    Sauvegarde & Importation Drive
                  </span>
                  <p className="text-[11px] text-zinc-300 max-w-[240px] leading-relaxed">
                    Importation automatique au lancement du site. Fichier JSON sécurisé stocké dans Google Drive.
                  </p>
                </div>
                
                {isDriveConnected ? (
                  <button
                    onClick={onDisconnectDrive}
                    className="flex items-center gap-1 px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 rounded-xl text-[11px] font-bold transition-all cursor-pointer select-none shrink-0"
                  >
                    Déconnecter
                  </button>
                ) : (
                  <button
                    disabled={isDriveLoading}
                    onClick={onConnectDrive}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black rounded-xl text-[11px] uppercase tracking-wider transition-all cursor-pointer select-none shrink-0 shadow-sm"
                  >
                    Connecter Drive
                  </button>
                )}
              </div>

              {/* Status Badges for Auto Import & Midnight Refresh */}
              <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-zinc-200 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Importation Automatique au Lancement
                  </span>
                  <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-800/60 rounded text-[10px] font-mono font-bold uppercase">
                    ACTIF (AUTOMATIQUE)
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-tight">
                  Chaque fois que vous accédez au site web, l'application importe et applique automatiquement vos dernières données enregistrées.
                </p>
              </div>

              {isDriveConnected && (
                <div className="pt-3 border-t border-zinc-800 space-y-3">
                  {/* Toggle auto-sync for Drive */}
                  <div className="flex items-center justify-between p-3 bg-zinc-900 rounded-xl border border-zinc-800">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-extrabold text-white block">
                        Sauvegarde Automatique Drive
                      </span>
                      <span className="text-[10px] text-zinc-300 block leading-tight">
                        Sauvegarde en arrière-plan 15s après chaque modification.
                      </span>
                    </div>
                    <button
                      onClick={() => onToggleDriveAutoSync(!driveAutoSync)}
                      className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer focus:outline-none ${
                        driveAutoSync ? "bg-amber-500" : "bg-zinc-700"
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${driveAutoSync ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      disabled={isDriveLoading}
                      onClick={onBackupToDrive}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer select-none border border-zinc-700"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isDriveLoading ? "animate-spin" : ""}`} />
                      Sauvegarder vers Drive
                    </button>
                    <button
                      disabled={isDriveLoading}
                      onClick={onRestoreFromDrive}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-amber-500/40 select-none"
                    >
                      Importer depuis Drive
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      DRIVE CONNECTÉ & SYNCHRONISÉ
                    </span>
                    {driveLastSynced && (
                      <span className="text-zinc-400">
                        Dernier backup : {driveLastSynced.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section: Mode Sombre Automatique */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-md text-[10px] font-black uppercase font-mono tracking-wider">
                4. Mode Sombre Automatique
              </span>
            </div>
            
            <div className="p-4 bg-zinc-950/80 dark:bg-zinc-950 border border-zinc-800 rounded-2xl">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-white flex items-center gap-2">
                    {autoDarkTheme ? (
                      <Moon className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Sun className="w-4 h-4 text-zinc-400" />
                    )}
                    Thème Sombre Automatique (Heure Locale)
                  </span>
                  <p className="text-[11px] text-zinc-300 max-w-[240px] leading-relaxed">
                    Bascule automatiquement entre 19h00 et 07h00.
                  </p>
                </div>
                
                <button
                  onClick={() => onToggleAutoDarkTheme(!autoDarkTheme)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer focus:outline-none ${
                    autoDarkTheme ? "bg-purple-600" : "bg-zinc-700"
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${autoDarkTheme ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Section: Export CSV des Modules */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-md text-[10px] font-black uppercase font-mono tracking-wider">
                5. Centre d'Exportation CSV
              </span>
            </div>
            
            <div className="p-4 bg-zinc-950/80 dark:bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-black text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  Exporter vos modules en fichier CSV
                </span>
                <p className="text-[11px] text-zinc-300 leading-relaxed">
                  Générez un fichier CSV lisible sous Excel ou Google Sheets pour n'importe quel module de l'application.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                <select
                  value={selectedExportModule}
                  onChange={(e) => setSelectedExportModule(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs font-bold text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="accounts">Comptes Bancaires ({accounts.length})</option>
                  <option value="transactions">Transactions Financières ({transactions.length})</option>
                  <option value="dailyHabits">Habitudes Quotidiennes ({dailyHabits.length})</option>
                  <option value="weeklyObjectives">Objectifs Hebdomadaires ({weeklyObjectives.length})</option>
                  <option value="budgets">Budgets & Limites ({budgets.length})</option>
                  <option value="epargnes">Objectifs d'Épargne ({epargnes.length})</option>
                  <option value="abonnements">Abonnements Actifs ({abonnements.length})</option>
                  <option value="stocks">Portefeuille Actions ({stocks.length})</option>
                  <option value="journalEntries">Journal de Bord ({journalEntries.length})</option>
                </select>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  Exporter CSV
                </button>
              </div>

              {exportFeedback && (
                <div className="text-[11px] font-bold font-mono text-center p-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-emerald-400 animate-in fade-in duration-250">
                  {exportFeedback}
                </div>
              )}
            </div>
          </div>

          {/* Section: Midnight Refresh & Storage Status */}
          <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-2xl space-y-3">
            <div className="flex items-start gap-2.5 text-zinc-300">
              <Database className="w-4.5 h-4.5 shrink-0 mt-0.5 text-amber-400" />
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-white">
                    Actualisation Automatique à Minuit & Persistance
                  </span>
                  <span className="px-2 py-0.5 bg-amber-950 text-amber-300 border border-amber-800/60 rounded text-[9.5px] font-mono font-bold">
                    00:00 AM
                  </span>
                </div>
                <p className="text-[11px] leading-relaxed text-zinc-300">
                  <strong className="text-white">Actualisation quotidienne :</strong> Chaque jour après minuit, le site web rafraîchit automatiquement vos habitudes et synchronise vos données sans intervention.
                </p>
                <p className="text-[11px] leading-relaxed text-zinc-300">
                  <strong className="text-white">Session Permanente :</strong> Vous restez connecté et déverrouillé automatiquement à chaque ouverture du site web.
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
