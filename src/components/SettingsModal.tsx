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
  FileSpreadsheet,
  Github
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

  // GitHub backup props
  githubAutoSync?: boolean;
  githubToken?: string;
  githubGistId?: string;
  githubUsername?: string;
  githubAvatar?: string;
  githubLastSynced?: Date | null;
  githubIsLoading?: boolean;
  onConnectGithub?: (token: string) => Promise<boolean>;
  onDisconnectGithub?: () => void;
  onToggleGithubAutoSync?: (enabled: boolean) => void;
  onBackupToGithub?: () => Promise<void>;
  onRestoreFromGithub?: () => Promise<void>;
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
  journalEntries = [],
  githubAutoSync = false,
  githubToken = "",
  githubGistId = "",
  githubUsername = "",
  githubAvatar = "",
  githubLastSynced = null,
  githubIsLoading = false,
  onConnectGithub = async () => false,
  onDisconnectGithub = () => {},
  onToggleGithubAutoSync = () => {},
  onBackupToGithub = async () => {},
  onRestoreFromGithub = async () => {}
}: SettingsModalProps) {
  
  if (!isOpen) return null;

  const isIframe = typeof window !== "undefined" && window.self !== window.top;
  const [authError, setAuthError] = useState<{ code: string; message: string; hostname: string } | null>(null);

  // CSV Export states & logic
  const [selectedExportModule, setSelectedExportModule] = useState<string>("accounts");
  const [exportFeedback, setExportFeedback] = useState<string | null>(null);

  const [inputToken, setInputToken] = useState("");
  const [githubError, setGithubError] = useState<string | null>(null);

  const handleConnectGithubClick = async () => {
    setGithubError(null);
    if (!inputToken.trim()) {
      setGithubError("Veuillez saisir votre Personal Access Token.");
      return;
    }
    const success = await onConnectGithub(inputToken.trim());
    if (success) {
      setInputToken("");
    } else {
      setGithubError("Échec de la connexion. Vérifiez la validité de votre jeton et ses permissions (scope 'gist').");
    }
  };

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
    console.log("[Firebase Auth] Beginning signInWithPopup with Google provider...");
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log("[Firebase Auth] signInWithPopup successfully completed! User:", result.user?.email);
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

                {authError && (
                  <div className="p-4 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/30 rounded-2xl text-left space-y-3 mt-3 animate-in fade-in slide-in-from-top-1 duration-200">
                    <div className="flex items-start gap-2 text-rose-800 dark:text-rose-400">
                      <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider font-mono">
                          {authError.code === "auth/unauthorized-domain" ? "Domaine Non Autorisé" : "Configuration Manquante"}
                        </p>
                        <p className="text-[10.5px] mt-1 leading-normal text-rose-700 dark:text-rose-300">
                          {authError.code === "auth/unauthorized-domain" 
                            ? `Le domaine "${authError.hostname}" n'est pas autorisé dans la console Firebase.`
                            : `L'authentification Google n'est pas configurée dans la console Firebase.`}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-white dark:bg-zinc-950 rounded-xl border border-rose-100 dark:border-rose-950 text-[10px] text-neutral-600 dark:text-neutral-400 space-y-2 leading-relaxed">
                      <p className="font-extrabold text-neutral-800 dark:text-neutral-200">Comment résoudre ce problème :</p>
                      <ol className="list-decimal list-inside space-y-1.5 font-sans">
                        <li>Allez sur la <a href="https://console.firebase.google.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline font-bold">Console Firebase</a></li>
                        <li>Ouvrez le projet : <strong className="font-mono text-rose-600 dark:text-rose-400 font-bold bg-neutral-100 dark:bg-zinc-900 px-1 py-0.5 rounded">gen-lang-client-0385167527</strong></li>
                        <li>Dans le menu latéral, cliquez sur <strong className="font-bold">Authentication</strong></li>
                        {authError.code === "auth/unauthorized-domain" ? (
                          <>
                            <li>Allez dans l'onglet <strong className="font-bold">Paramètres</strong> (ou <i>Settings</i>)</li>
                            <li>Sélectionnez <strong className="font-bold">Domaines autorisés</strong> dans la liste</li>
                            <li>Cliquez sur <strong className="font-bold">Ajouter un domaine</strong> et ajoutez : <code className="font-mono bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold select-all">{authError.hostname}</code></li>
                          </>
                        ) : (
                          <>
                            <li>Allez dans l'onglet <strong className="font-bold">Sign-in method</strong></li>
                            <li>Cliquez sur <strong className="font-bold">Ajouter un fournisseur</strong> et sélectionnez <strong className="font-bold">Google</strong></li>
                            <li>Activez Google, renseignez l'adresse e-mail d'assistance et enregistrez</li>
                          </>
                        )}
                        <li>Actualisez la page et reconnectez-vous !</li>
                      </ol>
                    </div>
                  </div>
                )}

                {isIframe && (
                  <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/30 rounded-xl text-left mt-2 animate-in fade-in slide-in-from-bottom-1 duration-200">
                    <p className="text-[10px] text-amber-700 dark:text-amber-400 leading-normal font-bold">
                      ⚠️ **Note importante :** L'application est actuellement intégrée dans un cadre (iframe) de prévisualisation. Les navigateurs bloquent la communication des popups de connexion dans ce mode. 
                    </p>
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 leading-normal font-medium mt-1">
                      Pour vous connecter, cliquez sur le bouton **« Ouvrir dans un nouvel onglet »** (en haut à droite de l'aperçu) ou utilisez le lien direct de l'application.
                    </p>
                  </div>
                )}
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

          {/* Section: Google Drive Storage & Backup */}
          <div className="space-y-3">
            <span className="text-[9px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider block font-mono">
              3. Stockage Google Drive (Fichiers de Sauvegarde)
            </span>
            
            <div className="p-4 bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-amber-500" />
                    Sauvegarde sur Google Drive
                  </span>
                  <p className="text-[10px] text-neutral-400 max-w-[220px] leading-relaxed">
                    Stockez, importez ou exportez vos données directement sous forme de fichier JSON sécurisé dans votre Google Drive.
                  </p>
                </div>
                
                {isDriveConnected ? (
                  <button
                    onClick={onDisconnectDrive}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40 rounded-xl text-[10px] font-bold transition-all cursor-pointer select-none"
                  >
                    Déconnecter
                  </button>
                ) : (
                  <button
                    disabled={isDriveLoading}
                    onClick={onConnectDrive}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer select-none"
                  >
                    Connecter Drive
                  </button>
                )}
              </div>

              {isDriveConnected && (
                <div className="pt-3 border-t border-neutral-200/50 dark:border-neutral-800 space-y-3">
                  <div className="flex gap-2">
                    <button
                      disabled={isDriveLoading}
                      onClick={onBackupToDrive}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer select-none"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isDriveLoading ? "animate-spin" : ""}`} />
                      Exporter vers Drive
                    </button>
                    <button
                      disabled={isDriveLoading}
                      onClick={onRestoreFromDrive}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-neutral-800 dark:text-neutral-100 rounded-xl text-[10px] font-bold transition-all cursor-pointer border border-neutral-200/50 dark:border-neutral-800 select-none"
                    >
                      Importer depuis Drive
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      DRIVE CONNECTÉ
                    </span>
                    {driveLastSynced && (
                      <span className="text-neutral-400">
                        Sauvegarde : {driveLastSynced.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section: Stockage GitHub Gist */}
          <div className="space-y-3">
            <span className="text-[9px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider block font-mono">
              3.5. Sauvegarde Automatique sur GitHub Gist
            </span>
            
            <div className="p-4 bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                    <Github className="w-4 h-4 text-zinc-800 dark:text-zinc-200" />
                    Synchronisation GitHub Gist
                  </span>
                  <p className="text-[10px] text-neutral-400 max-w-[220px] leading-relaxed">
                    Sauvegardez automatiquement vos données dans un Gist secret pour un stockage sécurisé et sans effort.
                  </p>
                </div>
                
                {githubToken ? (
                  <button
                    onClick={onDisconnectGithub}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-900/30 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/40 rounded-xl text-[10px] font-bold transition-all cursor-pointer select-none"
                  >
                    Déconnecter
                  </button>
                ) : null}
              </div>

              {!githubToken ? (
                <div className="space-y-3 pt-2 border-t border-neutral-200/40 dark:border-neutral-800/60">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider font-mono">
                      Personal Access Token (classic) :
                    </label>
                    <input
                      type="password"
                      value={inputToken}
                      onChange={(e) => setInputToken(e.target.value)}
                      placeholder="Saisissez votre jeton ghp_..."
                      className="w-full bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-neutral-300 focus:ring-1 focus:ring-neutral-200"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      disabled={githubIsLoading}
                      onClick={handleConnectGithubClick}
                      className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer select-none"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${githubIsLoading ? "animate-spin" : ""}`} />
                      Connecter GitHub
                    </button>

                    <a
                      href="https://github.com/settings/tokens/new?scopes=gist&description=Second%20Brain%20Backup"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[9.5px] font-bold text-blue-500 hover:underline text-center font-mono"
                    >
                      👉 Générer un jeton avec le scope "gist"
                    </a>
                  </div>

                  {githubError && (
                    <div className="p-2 bg-rose-50 dark:bg-rose-950/20 border border-rose-200/50 rounded-xl text-[10px] text-rose-700 dark:text-rose-300 font-mono text-center">
                      {githubError}
                    </div>
                  )}
                </div>
              ) : (
                <div className="pt-3 border-t border-neutral-200/50 dark:border-neutral-800 space-y-4">
                  {/* Account detail */}
                  <div className="flex items-center gap-2.5 p-2.5 bg-neutral-100/60 dark:bg-zinc-950/40 rounded-xl border border-neutral-200/30 dark:border-neutral-800/40">
                    {githubAvatar ? (
                      <img
                        src={githubAvatar}
                        alt="GitHub Avatar"
                        className="w-7 h-7 rounded-full border border-neutral-200 dark:border-neutral-700"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-7 h-7 bg-neutral-800 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        G
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-black text-neutral-800 dark:text-neutral-200 block truncate">
                        @{githubUsername}
                      </span>
                      <span className="text-[8.5px] text-neutral-400 block truncate font-mono select-all">
                        gist: {githubGistId}
                      </span>
                    </div>
                  </div>

                  {/* Toggle auto-sync */}
                  <div className="flex items-center justify-between p-2.5 bg-neutral-100/40 dark:bg-zinc-950/20 rounded-xl border border-neutral-200/20 dark:border-neutral-800/20">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 block">
                        Sauvegarde Automatique
                      </span>
                      <span className="text-[9.5px] text-neutral-400 block leading-tight">
                        Sauvegarde en tâche de fond 12s après chaque modification.
                      </span>
                    </div>
                    <button
                      onClick={() => onToggleGithubAutoSync(!githubAutoSync)}
                      className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer focus:outline-none ${
                        githubAutoSync ? "bg-emerald-500" : "bg-neutral-300 dark:bg-zinc-700"
                      }`}
                    >
                      <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${githubAutoSync ? "translate-x-5" : "translate-x-0"}`} />
                    </button>
                  </div>

                  {/* Manual trigger buttons */}
                  <div className="flex gap-2">
                    <button
                      disabled={githubIsLoading}
                      onClick={onBackupToGithub}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white rounded-xl text-[10px] font-bold transition-all cursor-pointer select-none"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${githubIsLoading ? "animate-spin" : ""}`} />
                      Sauvegarder
                    </button>
                    <button
                      disabled={githubIsLoading}
                      onClick={onRestoreFromGithub}
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-neutral-800 dark:text-neutral-100 rounded-xl text-[10px] font-bold transition-all cursor-pointer border border-neutral-200/50 dark:border-neutral-800 select-none"
                    >
                      Restaurer / Importer
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                    <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                      <CheckCircle className="w-3.5 h-3.5" />
                      GITHUB SYNC ACTIF
                    </span>
                    {githubLastSynced && (
                      <span className="text-neutral-400">
                        Dernière : {githubLastSynced.toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Section: Mode Sombre Automatique */}
          <div className="space-y-3">
            <span className="text-[9px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider block font-mono">
              4. Mode Sombre Automatique (Heure Locale)
            </span>
            
            <div className="p-4 bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-0.5">
                  <span className="text-xs font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                    {autoDarkTheme ? (
                      <Moon className="w-4 h-4 text-indigo-500" />
                    ) : (
                      <Sun className="w-4 h-4 text-neutral-400" />
                    )}
                    Thème Sombre Automatique
                  </span>
                  <p className="text-[10px] text-neutral-400 max-w-[220px] leading-relaxed">
                    Active le mode sombre automatiquement entre 19h00 et 7h00 en fonction de votre heure locale.
                  </p>
                </div>
                
                {/* Custom Toggle Switch */}
                <button
                  onClick={() => onToggleAutoDarkTheme(!autoDarkTheme)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer focus:outline-none ${
                    autoDarkTheme ? "bg-indigo-500" : "bg-neutral-300 dark:bg-zinc-700"
                  }`}
                >
                  <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${autoDarkTheme ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Section: Export CSV des Modules */}
          <div className="space-y-3">
            <span className="text-[9px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider block font-mono">
              5. Centre d'Exportation CSV des Modules
            </span>
            
            <div className="p-4 bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  Exporter les données au format CSV
                </span>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  Générez et téléchargez instantanément un fichier CSV formaté pour n'importe quel module de votre Second Brain afin de réaliser des analyses externes ou sauvegardes rapides.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center">
                <select
                  value={selectedExportModule}
                  onChange={(e) => setSelectedExportModule(e.target.value)}
                  className="flex-1 bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs font-semibold text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-neutral-300 focus:ring-1 focus:ring-neutral-200"
                >
                  <option value="accounts">Comptes Bancaires ({accounts.length})</option>
                  <option value="transactions">Transactions Financières ({transactions.length})</option>
                  <option value="dailyHabits">Habitudes Quotidiennes ({dailyHabits.length})</option>
                  <option value="weeklyObjectives">Objectifs Hebdomadaires ({weeklyObjectives.length})</option>
                  <option value="budgets">Budgets & Limites ({budgets.length})</option>
                  <option value="epargnes">Objectifs d'Épargne ({epargnes.length})</option>
                  <option value="abonnements">Abonnements Actifs ({abonnements.length})</option>
                  <option value="stocks">Portefeuille Actions ({stocks.length})</option>
                  <option value="journalEntries">Journal de Bord (Second Brain) ({journalEntries.length})</option>
                </select>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  Exporter en CSV
                </button>
              </div>

              {exportFeedback && (
                <div className="text-[10px] font-bold font-mono text-center p-2 bg-neutral-100 dark:bg-zinc-900 border border-neutral-200/50 dark:border-neutral-800 rounded-xl text-neutral-600 dark:text-neutral-300 animate-in fade-in duration-250">
                  {exportFeedback}
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
