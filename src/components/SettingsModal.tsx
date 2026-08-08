import React, { useState } from "react";
import { 
  X, 
  Settings, 
  Cloud, 
  User, 
  LogOut, 
  RefreshCw, 
  Shield, 
  Database,
  CheckCircle,
  Moon,
  Sun,
  Download,
  FileSpreadsheet,
  ChevronRight,
  Sliders,
  Check,
  HardDrive,
  Palette,
  Sparkles,
  AlertTriangle,
  AlertCircle,
  Target
} from "lucide-react";
import { ThemePresetId, THEME_PRESETS } from "./ThemeSelectorModal";
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
  driveSyncState?: "synced" | "syncing" | "error" | "offline";
  driveSyncError?: string | null;
  autoDarkTheme: boolean;
  onToggleAutoDarkTheme: (enabled: boolean) => void;
  currentTheme?: ThemePresetId;
  onSelectTheme?: (theme: ThemePresetId) => void;
  onOpenThemeModal?: () => void;
  
  // Data props for CSV Export & Budget Thresholds
  accounts?: Account[];
  transactions?: FinanceTransaction[];
  dailyHabits?: DailyHabit[];
  weeklyObjectives?: WeeklyObjective[];
  budgets?: FinanceBudget[];
  epargnes?: FinanceEpargne[];
  abonnements?: Abonnement[];
  stocks?: StockEntry[];
  journalEntries?: JournalEntry[];
  
  // Callback to update budget threshold configurations
  onUpdateBudgets?: (updatedBudgets: FinanceBudget[]) => void;
}

type TabType = "account" | "cloud_sync" | "drive_backup" | "appearance" | "budget_thresholds" | "export";

interface TabItem {
  id: TabType;
  label: string;
  description: string;
  icon: React.ElementType;
}

const TABS: TabItem[] = [
  {
    id: "account",
    label: "Compte Cloud",
    description: "Google & Identité Firebase",
    icon: User,
  },
  {
    id: "cloud_sync",
    label: "Synchronisation",
    description: "Firestore en temps réel",
    icon: Cloud,
  },
  {
    id: "drive_backup",
    label: "Synchronisation Drive",
    description: "Multi-appareils & Auto-Sync",
    icon: Database,
  },
  {
    id: "appearance",
    label: "Apparence",
    description: "Thème sombre automatique",
    icon: Sliders,
  },
  {
    id: "budget_thresholds",
    label: "Seuils d'Alerte",
    description: "Alertes budget par catégorie",
    icon: AlertTriangle,
  },
  {
    id: "export",
    label: "Exportation CSV",
    description: "Téléchargement des données",
    icon: FileSpreadsheet,
  },
];

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
  driveSyncState = "offline",
  driveSyncError = null,
  autoDarkTheme,
  onToggleAutoDarkTheme,
  currentTheme = "indigo",
  onSelectTheme,
  onOpenThemeModal,
  accounts = [],
  transactions = [],
  dailyHabits = [],
  weeklyObjectives = [],
  budgets = [],
  epargnes = [],
  abonnements = [],
  stocks = [],
  journalEntries = [],
  onUpdateBudgets
}: SettingsModalProps) {
  
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<TabType>("account");
  const isIframe = typeof window !== "undefined" && window.self !== window.top;
  const [authError, setAuthError] = useState<{ code: string; message: string; hostname: string } | null>(null);

  // Budget thresholds state
  const [thresholdSaveFeedback, setThresholdSaveFeedback] = useState<string | null>(null);

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
        setAuthError({
          code: "auth/unauthorized-domain",
          message: errMessage,
          hostname: currentHostname
        });
      } else if (errCode === "auth/configuration-not-found" || errMessage.includes("configuration-not-found")) {
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
      await onToggleCloudSync(false);
    } catch (e) {
      console.error("Logout failed:", e);
    }
  };

  // Helper for badge rendering in sidebar tabs
  const renderTabBadge = (tabId: TabType) => {
    switch (tabId) {
      case "account":
        return firebaseUser ? (
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs" title="Connecté" />
        ) : (
          <span className="w-2 h-2 rounded-full bg-neutral-300 dark:bg-zinc-700" title="Non connecté" />
        );
      case "cloud_sync":
        return cloudSyncEnabled && firebaseUser ? (
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-xs animate-pulse" title="Sync actif" />
        ) : null;
      case "drive_backup":
        return isDriveConnected ? (
          <span className="w-2 h-2 rounded-full bg-amber-500 shadow-xs" title="Drive connecté" />
        ) : null;
      case "appearance":
        return autoDarkTheme ? (
          <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 rounded">
            Auto
          </span>
        ) : null;
      case "budget_thresholds": {
        const alertsActive = budgets.filter(b => {
          const pct = b.alertThresholdPct ?? 80;
          return b.limitAmount > 0 && b.spentAmount >= (b.limitAmount * pct / 100);
        }).length;
        return alertsActive > 0 ? (
          <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded" title={`${alertsActive} alerte(s) active(s)`}>
            {alertsActive} ⚠️
          </span>
        ) : (
          <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-neutral-200 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-400 rounded">
            {budgets.length}
          </span>
        );
      }
      case "export":
        const totalRecords = accounts.length + transactions.length + dailyHabits.length + weeklyObjectives.length + budgets.length + epargnes.length + abonnements.length + stocks.length + journalEntries.length;
        return (
          <span className="text-[10px] font-bold font-mono px-1.5 py-0.5 bg-neutral-200 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-400 rounded">
            {totalRecords}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div id="settings-modal" className="fixed inset-0 z-100 flex items-center justify-center p-3 sm:p-6 select-none">
      
      {/* Backdrop */}
      <div 
        id="settings-modal-backdrop"
        className="fixed inset-0 bg-neutral-950/50 dark:bg-neutral-950/70 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Main Modal Card with Sidebar Layout */}
      <div 
        id="settings-modal-card"
        className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-4xl h-[88vh] max-h-[680px] flex flex-col overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-200"
      >
        
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200/80 dark:border-zinc-800 bg-neutral-50/80 dark:bg-zinc-950/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-100 dark:border-indigo-900/50 shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                Paramètres Système
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Préférences de synchronisation, sauvegardes et exportation de données
              </p>
            </div>
          </div>
          
          <button 
            onClick={onClose}
            className="p-2 hover:bg-neutral-200/70 dark:hover:bg-zinc-800 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-all cursor-pointer"
            title="Fermer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body: Sidebar Tabs + Content Area */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          
          {/* Sidebar Tabs Navigation */}
          <div className="w-full md:w-64 lg:w-72 border-b md:border-b-0 md:border-r border-neutral-200/80 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-950/40 p-2.5 sm:p-3 flex md:flex-col gap-1.5 overflow-x-auto md:overflow-y-auto shrink-0 custom-scrollbar">
            <div className="px-3 py-1.5 hidden md:block">
              <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500 font-mono">
                Catégories
              </span>
            </div>

            {TABS.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center justify-between p-2.5 sm:p-3 rounded-2xl transition-all cursor-pointer text-left shrink-0 md:shrink border ${
                    isActive 
                      ? "bg-white dark:bg-zinc-800 border-neutral-200 dark:border-zinc-700 shadow-sm text-neutral-900 dark:text-white" 
                      : "border-transparent text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100/80 dark:hover:bg-zinc-800/60 hover:text-neutral-900 dark:hover:text-neutral-200"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl transition-colors ${
                      isActive 
                        ? "bg-indigo-600 text-white" 
                        : "bg-neutral-200/70 dark:bg-zinc-800 text-neutral-500 dark:text-neutral-400"
                    }`}>
                      <Icon className="w-4 h-4 shrink-0" />
                    </div>
                    <div className="min-w-0 hidden sm:block md:block">
                      <p className="text-xs font-bold truncate">
                        {tab.label}
                      </p>
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 truncate hidden md:block">
                        {tab.description}
                      </p>
                    </div>
                    {/* Short text for small screen tabs */}
                    <span className="text-xs font-bold sm:hidden md:hidden truncate">
                      {tab.label}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 ml-2">
                    {renderTabBadge(tab.id)}
                    <ChevronRight className={`w-3.5 h-3.5 hidden md:block transition-transform ${
                      isActive ? "text-indigo-500 translate-x-0.5" : "text-neutral-300 dark:text-zinc-700"
                    }`} />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Main Content View Container */}
          <div className="flex-1 p-5 sm:p-6 overflow-y-auto custom-scrollbar bg-white dark:bg-zinc-900">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.18 }}
                className="space-y-5"
              >

                {/* TAB 1: ACCOUNT & AUTHENTICATION */}
                {activeTab === "account" && (
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <User className="w-4 h-4 text-indigo-500" />
                        Compte Cloud Firebase
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Gérez votre session utilisateur et votre identité Google pour la synchronisation.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-50 dark:bg-zinc-800/40 border border-neutral-200/80 dark:border-zinc-700/60 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                          Statut de l'Authentification
                        </span>
                        {firebaseUser ? (
                          <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-full text-xs font-bold flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Session Active
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-neutral-200 dark:bg-zinc-700 text-neutral-700 dark:text-neutral-300 rounded-full text-xs font-bold">
                            Déconnecté
                          </span>
                        )}
                      </div>

                      {firebaseUser ? (
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 rounded-xl space-y-4 shadow-xs">
                          <div className="flex items-center gap-3.5">
                            {firebaseUser.photoURL ? (
                              <img 
                                src={firebaseUser.photoURL} 
                                alt="Profile" 
                                className="w-12 h-12 rounded-full border-2 border-indigo-500 shrink-0 shadow-xs"
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black text-lg shrink-0 shadow-xs">
                                {firebaseUser.displayName?.charAt(0) || "U"}
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                                {firebaseUser.displayName || "Utilisateur Cloud"}
                              </p>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate mt-0.5">
                                {firebaseUser.email}
                              </p>
                            </div>
                          </div>

                          <div className="pt-3 border-t border-neutral-100 dark:border-zinc-800/80 flex items-center justify-between gap-3">
                            <span className="text-xs text-neutral-500 dark:text-neutral-400">
                              Base de données liée au compte
                            </span>
                            <button
                              onClick={handleLogoutClick}
                              className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/30 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer border border-rose-200/60 dark:border-rose-900/40 shrink-0"
                            >
                              <LogOut className="w-3.5 h-3.5" />
                              Se déconnecter
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-5 bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 rounded-xl space-y-3.5 text-center shadow-xs">
                          <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto">
                            <User className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                              Connectez votre Compte Google
                            </p>
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
                              Activez la sauvegarde sécurisée en temps réel et accédez à vos données financières depuis n'importe quel appareil.
                            </p>
                          </div>

                          <button
                            onClick={handleLoginClick}
                            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-xs"
                          >
                            <Cloud className="w-4 h-4" />
                            Se connecter avec Google
                          </button>

                          {authError && (
                            <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-left space-y-1.5 mt-3">
                              <div className="flex items-start gap-2 text-rose-700 dark:text-rose-300">
                                <Shield className="w-4 h-4 shrink-0 mt-0.5" />
                                <div>
                                  <p className="text-xs font-bold">
                                    {authError.code === "auth/unauthorized-domain" ? "Domaine Non Autorisé" : "Configuration Manquante"}
                                  </p>
                                  <p className="text-[11px] mt-0.5 text-rose-600 dark:text-rose-300">
                                    {authError.code === "auth/unauthorized-domain" 
                                      ? `Ajoutez le domaine "${authError.hostname}" dans les domaines autorisés de votre console Firebase.`
                                      : `L'authentification Google n'est pas activée dans votre console Firebase.`}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {isIframe && (
                            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">
                              ⚠️ Si la fenêtre de connexion ne s'ouvre pas, ouvrez l'application dans un nouvel onglet.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: FIRESTORE CLOUD SYNC */}
                {activeTab === "cloud_sync" && (
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <Cloud className="w-4 h-4 text-emerald-500" />
                        Synchronisation Firestore Cloud
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Synchronisez vos modifications instantanément dans la base de données cloud Firestore.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-50 dark:bg-zinc-800/40 border border-neutral-200/80 dark:border-zinc-700/60 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                            Abonnement & Sync Automatique
                          </span>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            Sauvegarde en tâche de fond à chaque modification.
                          </p>
                        </div>
                        
                        <button
                          disabled={!firebaseUser}
                          onClick={() => onToggleCloudSync(!cloudSyncEnabled)}
                          className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer shrink-0 ${
                            !firebaseUser ? "opacity-40 cursor-not-allowed bg-neutral-300 dark:bg-zinc-700" :
                            cloudSyncEnabled ? "bg-emerald-500" : "bg-neutral-300 dark:bg-zinc-700"
                          }`}
                          title={!firebaseUser ? "Veuillez d'abord vous connecter" : ""}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${cloudSyncEnabled ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                      </div>

                      {!firebaseUser && (
                        <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 rounded-xl text-xs text-amber-800 dark:text-amber-300 flex items-center gap-2">
                          <Shield className="w-4 h-4 shrink-0 text-amber-600" />
                          <span>Connexion Google requise pour activer la synchronisation cloud.</span>
                        </div>
                      )}

                      {cloudSyncEnabled && firebaseUser && (
                        <div className="p-4 bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 rounded-xl space-y-3 shadow-xs">
                          <div className="flex items-center justify-between text-xs">
                            <span className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold">
                              <CheckCircle className="w-4 h-4" />
                              {isSyncing ? "Synchronisation en cours..." : "Cloud à jour & opérationnel"}
                            </span>
                            {lastSyncedTime && (
                              <span className="text-neutral-500 dark:text-neutral-400 text-xs font-mono">
                                Dernier sync : {lastSyncedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </span>
                            )}
                          </div>

                          <div className="pt-2 border-t border-neutral-100 dark:border-zinc-800 flex justify-end">
                            <button
                              disabled={isSyncing}
                              onClick={onForceSync}
                              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs"
                            >
                              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                              Forcer la synchronisation maintenant
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 3: GOOGLE DRIVE BACKUP & AUTO SYNC */}
                {activeTab === "drive_backup" && (
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <Database className="w-4 h-4 text-amber-500" />
                        Synchronisation Google Drive
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Synchronisez vos données (habitudes, transactions, budgets, tâches) automatiquement entre tous vos appareils via votre espace Google Drive.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-50 dark:bg-zinc-800/40 border border-neutral-200/80 dark:border-zinc-700/60 rounded-2xl space-y-4">
                      {/* Connection Status Box */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 rounded-xl shadow-xs">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                              Statut de connexion :
                            </span>
                            {isDriveConnected && driveSyncState !== "error" ? (
                              <span className="px-2.5 py-0.5 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-full text-xs font-bold flex items-center gap-1.5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                                Connecté à Google Drive
                              </span>
                            ) : driveSyncState === "error" ? (
                              <span className="px-2.5 py-0.5 bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 rounded-full text-xs font-bold flex items-center gap-1.5 animate-pulse">
                                <span className="w-2 h-2 rounded-full bg-rose-500" />
                                Session expirée ou erreur
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 bg-neutral-200 dark:bg-zinc-700 text-neutral-700 dark:text-neutral-300 rounded-full text-xs font-bold">
                                Non connecté
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            {isDriveConnected 
                              ? "Espace de sauvegarde privé configuré dans votre Google Drive." 
                              : "Connectez votre compte Google pour autoriser la synchronisation automatique."}
                          </p>
                        </div>

                        {isDriveConnected && driveSyncState !== "error" ? (
                          <button
                            onClick={onDisconnectDrive}
                            className="px-3.5 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-neutral-700 dark:text-neutral-200 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 border border-neutral-200 dark:border-zinc-700"
                          >
                            Se déconnecter
                          </button>
                        ) : (
                          <button
                            disabled={isDriveLoading}
                            onClick={onConnectDrive}
                            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 shadow-xs flex items-center gap-2"
                          >
                            <HardDrive className="w-4 h-4" />
                            {driveSyncState === "error" ? "Se reconnecter à Google Drive" : "Se connecter à Google Drive"}
                          </button>
                        )}
                      </div>

                      {/* Expired Token Error Alert */}
                      {driveSyncState === "error" && (
                        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-800 dark:text-rose-200 space-y-1">
                          <p className="font-bold flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                            Erreur de synchronisation Google Drive
                          </p>
                          <p className="text-[11px] text-rose-700 dark:text-rose-300">
                            {driveSyncError || "Le jeton d'accès a expiré ou est invalide. Veuillez cliquer sur 'Se reconnecter à Google Drive' ci-dessus."}
                          </p>
                        </div>
                      )}

                      {/* Last Successful Sync Indicator Box */}
                      <div className="p-4 bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 rounded-xl space-y-2 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                            <RefreshCw className={`w-3.5 h-3.5 text-indigo-500 ${isDriveLoading ? "animate-spin" : ""}`} />
                            Dernière synchronisation réussie
                          </span>
                          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-1 rounded-md border border-indigo-200 dark:border-indigo-900/50">
                            {driveLastSynced 
                              ? driveLastSynced.toLocaleString([], { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
                              : "Aucune synchronisation récente"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400 pt-1 border-t border-neutral-100 dark:border-zinc-800">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>
                            Synchronisation automatique active : chaque modification importante est sauvegardée automatiquement et fusionnée en tâche de fond.
                          </span>
                        </div>
                      </div>

                      {/* Manual Trigger Buttons */}
                      {isDriveConnected && (
                        <div className="flex gap-2.5 pt-1">
                          <button
                            disabled={isDriveLoading}
                            onClick={onBackupToDrive}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isDriveLoading ? "animate-spin" : ""}`} />
                            Synchroniser maintenant (Push + Merge)
                          </button>
                          <button
                            disabled={isDriveLoading}
                            onClick={onRestoreFromDrive}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 text-amber-800 dark:text-amber-200 border border-amber-200/80 dark:border-amber-900/50 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                          >
                            Importer de Drive
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: APPEARANCE & AUTO DARK THEME */}
                {activeTab === "appearance" && (
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <Sliders className="w-4 h-4 text-indigo-500" />
                        Apparence & Thème Automatique
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Ajustez l'affichage visuel et le basculement automatique du thème jour/nuit.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-50 dark:bg-zinc-800/40 border border-neutral-200/80 dark:border-zinc-700/60 rounded-2xl space-y-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-0.5">
                          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-2">
                            {autoDarkTheme ? (
                              <Moon className="w-4 h-4 text-indigo-500" />
                            ) : (
                              <Sun className="w-4 h-4 text-amber-500" />
                            )}
                            Mode Sombre Automatique
                          </span>
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                            S'active automatiquement entre 19h00 et 07h00 selon votre horloge système.
                          </p>
                        </div>

                        <button
                          onClick={() => onToggleAutoDarkTheme(!autoDarkTheme)}
                          className={`w-11 h-6 rounded-full p-1 transition-colors duration-200 cursor-pointer shrink-0 ${
                            autoDarkTheme ? "bg-indigo-600" : "bg-neutral-300 dark:bg-zinc-700"
                          }`}
                        >
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${autoDarkTheme ? "translate-x-5" : "translate-x-0"}`} />
                        </button>
                      </div>

                      <div className="p-4 bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 rounded-xl space-y-2 shadow-xs">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-neutral-600 dark:text-neutral-400 font-mono">
                            ⏰ Horloge locale : <strong className="text-neutral-900 dark:text-white font-bold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</strong>
                          </span>
                          <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">
                            {autoDarkTheme ? "Automatique Actif" : "Configuration Manuelle"}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
                          Vous pouvez également basculer manuellement le thème sombre à tout moment via le bouton en haut de l'application.
                        </p>
                      </div>

                      {/* Theme Presets Quick Selector */}
                      <div className="pt-3 border-t border-neutral-200/60 dark:border-zinc-700/60 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                            <Palette className="w-4 h-4 text-indigo-500" />
                            Sélecteur de Thèmes Visuels
                          </span>
                          {onOpenThemeModal && (
                            <button
                              onClick={() => {
                                onClose();
                                onOpenThemeModal();
                              }}
                              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold flex items-center gap-1"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                              Galerie complète
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                          {THEME_PRESETS.map((p) => {
                            const isSelected = currentTheme === p.id;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => onSelectTheme && onSelectTheme(p.id)}
                                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                                  isSelected
                                    ? "bg-indigo-50 dark:bg-indigo-950/80 border-indigo-600 dark:border-indigo-500 shadow-2xs"
                                    : "bg-white dark:bg-zinc-900 border-neutral-200 dark:border-zinc-800 hover:border-neutral-300"
                                }`}
                              >
                                <span
                                  className="w-3.5 h-3.5 rounded-full shrink-0 border border-black/10 shadow-2xs"
                                  style={{ backgroundColor: p.primaryColor }}
                                />
                                <div className="min-w-0 flex-1">
                                  <span className={`text-[11px] font-bold block truncate ${isSelected ? "text-indigo-900 dark:text-indigo-200" : "text-neutral-800 dark:text-neutral-200"}`}>
                                    {p.name.split(" ")[0]}
                                  </span>
                                </div>
                                {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB: BUDGET ALERT THRESHOLDS */}
                {activeTab === "budget_thresholds" && (
                  <div className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          Seuils d'Alerte Personnalisés par Catégorie
                        </h4>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          Configurez le pourcentage d'utilisation à partir duquel une alerte visuelle s'affiche pour chaque enveloppe budgétaire.
                        </p>
                      </div>
                    </div>

                    {/* Global Preset Actions */}
                    <div className="p-4 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                          Appliquer un seuil global à toutes les catégories
                        </span>
                        <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-400">
                          {budgets.length} catégories
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        {[50, 70, 80, 85, 90, 95].map((pct) => (
                          <button
                            key={pct}
                            type="button"
                            onClick={() => {
                              const updated = budgets.map(b => ({ ...b, alertThresholdPct: pct }));
                              if (onUpdateBudgets) onUpdateBudgets(updated);
                              setThresholdSaveFeedback(`Seuil de ${pct}% appliqué à toutes les catégories !`);
                              setTimeout(() => setThresholdSaveFeedback(null), 3500);
                            }}
                            className="px-3 py-1.5 bg-white dark:bg-zinc-900 hover:bg-amber-100 dark:hover:bg-amber-900/50 border border-amber-200 dark:border-amber-800 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200 transition-all cursor-pointer shadow-2xs flex items-center gap-1"
                          >
                            <span>{pct}%</span>
                            {pct === 80 && <span className="text-[9px] text-amber-600 font-normal">(défaut)</span>}
                          </button>
                        ))}
                      </div>
                    </div>

                    {thresholdSaveFeedback && (
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>{thresholdSaveFeedback}</span>
                      </div>
                    )}

                    {/* Category List Cards */}
                    <div className="space-y-3">
                      {budgets.length === 0 ? (
                        <div className="p-8 text-center text-xs text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-zinc-800/30 rounded-2xl border border-neutral-200 dark:border-zinc-800">
                          Aucune catégorie de budget n'est disponible.
                        </div>
                      ) : (
                        budgets.map((b) => {
                          const currentPct = b.alertThresholdPct ?? 80;
                          const limit = b.limitAmount || 1;
                          const spent = b.spentAmount || 0;
                          const spentRatio = Math.min(100, Math.round((spent / limit) * 100));
                          const alertTriggerAmount = Math.round((limit * currentPct) / 100);
                          const isOverBudget = spent > limit;
                          const isAlertTriggered = !isOverBudget && spent >= alertTriggerAmount;

                          return (
                            <div
                              key={b.id}
                              className={`p-4 rounded-2xl border transition-all shadow-2xs ${
                                isOverBudget
                                  ? "bg-rose-50/50 dark:bg-rose-950/20 border-rose-200/90 dark:border-rose-900/50"
                                  : isAlertTriggered
                                  ? "bg-amber-50/50 dark:bg-amber-950/20 border-amber-200/90 dark:border-amber-900/50"
                                  : "bg-neutral-50 dark:bg-zinc-800/40 border-neutral-200/80 dark:border-zinc-700/60"
                              }`}
                            >
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2.5">
                                  <div className={`w-3 h-3 rounded-full shrink-0 ${
                                    isOverBudget ? "bg-rose-500 animate-ping" : isAlertTriggered ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                                  }`} />
                                  <div>
                                    <h5 className="text-xs font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                                      {b.category}
                                      <span className="text-[10px] font-mono text-neutral-400 font-normal">
                                        ({b.period})
                                      </span>
                                    </h5>
                                    <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                                      Plafond : <strong className="text-neutral-800 dark:text-neutral-200">{limit.toLocaleString("fr-FR")} MAD</strong> — Dépensé : <strong className="text-neutral-800 dark:text-neutral-200">{spent.toLocaleString("fr-FR")} MAD</strong> ({spentRatio}%)
                                    </p>
                                  </div>
                                </div>

                                {/* Status badge */}
                                <div className="self-start sm:self-center">
                                  {isOverBudget ? (
                                    <span className="px-2.5 py-1 bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/60 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                      <AlertCircle className="w-3 h-3" />
                                      Dépassé ({spentRatio}%)
                                    </span>
                                  ) : isAlertTriggered ? (
                                    <span className="px-2.5 py-1 bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3" />
                                      Alerte Activée
                                    </span>
                                  ) : (
                                    <span className="px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3" />
                                      Normal ({spentRatio}%)
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Visual progress bar with threshold line */}
                              <div className="relative w-full h-3 bg-neutral-200 dark:bg-zinc-700 rounded-full overflow-hidden mb-3">
                                <div
                                  className={`h-full transition-all duration-300 ${
                                    isOverBudget ? "bg-rose-500" : isAlertTriggered ? "bg-amber-500" : "bg-emerald-500"
                                  }`}
                                  style={{ width: `${Math.min(100, spentRatio)}%` }}
                                />
                                {/* Threshold marker */}
                                <div
                                  className="absolute top-0 bottom-0 w-1 bg-neutral-900 dark:bg-white z-10 rounded-full shadow-xs"
                                  style={{ left: `${currentPct}%` }}
                                  title={`Seuil d'alerte configuré à ${currentPct}% (${alertTriggerAmount.toLocaleString("fr-FR")} MAD)`}
                                />
                              </div>

                              {/* Threshold controls */}
                              <div className="pt-2 border-t border-neutral-200/60 dark:border-zinc-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <div className="flex items-center gap-3 flex-1">
                                  <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 whitespace-nowrap min-w-[70px]">
                                    Seuil : <strong className="text-indigo-600 dark:text-indigo-400 font-mono text-sm">{currentPct}%</strong>
                                  </span>
                                  <input
                                    type="range"
                                    min="30"
                                    max="100"
                                    step="5"
                                    value={currentPct}
                                    onChange={(e) => {
                                      const val = Number(e.target.value);
                                      const updated = budgets.map(x => x.id === b.id ? { ...x, alertThresholdPct: val } : x);
                                      if (onUpdateBudgets) onUpdateBudgets(updated);
                                    }}
                                    className="flex-1 h-2 bg-neutral-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                  />
                                </div>

                                <div className="flex items-center gap-2 justify-between sm:justify-end">
                                  <span className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400">
                                    Déclenchement à <strong className="text-neutral-800 dark:text-neutral-200 font-bold">{alertTriggerAmount.toLocaleString("fr-FR")} MAD</strong>
                                  </span>
                                  {currentPct !== 80 && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = budgets.map(x => x.id === b.id ? { ...x, alertThresholdPct: 80 } : x);
                                        if (onUpdateBudgets) onUpdateBudgets(updated);
                                      }}
                                      className="text-[10px] font-bold text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 underline cursor-pointer"
                                    >
                                      Reset (80%)
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 5: CSV EXPORT */}
                {activeTab === "export" && (
                  <div className="space-y-5">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                        Exportation CSV des Modules
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Téléchargez des données structurées et compatibles avec Excel, Google Sheets ou vos outils d'analyse.
                      </p>
                    </div>

                    <div className="p-5 bg-neutral-50 dark:bg-zinc-800/40 border border-neutral-200/80 dark:border-zinc-700/60 rounded-2xl space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 block">
                          Sélectionnez le module à exporter
                        </label>
                        <select
                          value={selectedExportModule}
                          onChange={(e) => setSelectedExportModule(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-700 rounded-xl p-3 text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xs cursor-pointer"
                        >
                          <option value="accounts">Comptes Bancaires ({accounts.length} enregistrements)</option>
                          <option value="transactions">Transactions Financières ({transactions.length} enregistrements)</option>
                          <option value="dailyHabits">Habitudes Quotidiennes ({dailyHabits.length} enregistrements)</option>
                          <option value="weeklyObjectives">Objectifs Hebdomadaires ({weeklyObjectives.length} enregistrements)</option>
                          <option value="budgets">Budgets & Limites ({budgets.length} enregistrements)</option>
                          <option value="epargnes">Objectifs d'Épargne ({epargnes.length} enregistrements)</option>
                          <option value="abonnements">Abonnements Actifs ({abonnements.length} enregistrements)</option>
                          <option value="stocks">Portefeuille Actions ({stocks.length} enregistrements)</option>
                        </select>
                      </div>

                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={handleExportCSV}
                          className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                        >
                          <Download className="w-4 h-4" />
                          Générer & Télécharger le CSV
                        </button>
                      </div>

                      {exportFeedback && (
                        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-xs font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
                          <Check className="w-4 h-4 shrink-0" />
                          <span>{exportFeedback}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="bg-neutral-50 dark:bg-zinc-950/50 px-6 py-3.5 border-t border-neutral-200/80 dark:border-zinc-800 flex items-center justify-between gap-3 shrink-0">
          <div className="text-[11px] text-neutral-500 dark:text-neutral-400 font-mono flex items-center gap-1.5 truncate">
            <Shield className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">PERSISTANCE HYBRIDE (LOCALE + CLOUD)</span>
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2 bg-neutral-200 hover:bg-neutral-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-neutral-800 dark:text-neutral-100 rounded-xl text-xs font-bold transition-all cursor-pointer select-none shrink-0"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
}
