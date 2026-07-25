import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  DailyHabit, 
  WeeklyObjective,
  FinanceTransaction, 
  StockEntry, 
  FinanceBudget, 
  FinanceSalaire, 
  FinanceEpargne, 
  Action30Jours, 
  ProfilAmelioration, 
  PossibiliteGoal, 
  SkinTracker, 
  MealPlanner, 
  AchatMensuel, 
  Abonnement, 
  Formation, 
  BookItem,
  ScreenMediaItem, 
  Account, 
  ResourceLink, 
  ChannelInfo,
  WishListItem,
  AchatCouteuxItem,
  MonthlyGoal,
  EditorialEvent,
  ProjectFolder,
  JournalEntry
} from "./types";



import { 
  INITIAL_HABITS, 
  INITIAL_WEEKLY_OBJECTIVES,
  INITIAL_TRANSACTIONS, 
  INITIAL_STOCKS, 
  INITIAL_BUDGETS, 
  INITIAL_SALAIRES, 
  INITIAL_EPARGNES, 
  INITIAL_ACTIONS_30_JOURS, 
  INITIAL_PROFIL_AMELIORATIONS, 
  INITIAL_POSSIBILITES_GOALS, 
  INITIAL_SKIN_TRACKERS, 
  INITIAL_MEAL_PLANNERS, 
  INITIAL_ACHATS_MENSUELS, 
  INITIAL_ABONNEMENTS, 
  INITIAL_FORMATIONS, 
  INITIAL_BOOKS, 
  INITIAL_SCREENMEDIA, 
  INITIAL_ACCOUNTS, 
  INITIAL_RESOURCELINKS, 
  INITIAL_CHANNELS,
  INITIAL_WISHLIST,
  INITIAL_ACHATS_COUTEUX,
  INITIAL_MONTHLY_GOALS,
  INITIAL_EDITORIAL_EVENTS,
  INITIAL_PROJECT_FOLDERS
} from "./initialData";

import InteractiveModuleTable, { TableColumn } from "./components/InteractiveModuleTable";
import FinanceCharts from "./components/FinanceCharts";
import NetSavingsChart from "./components/NetSavingsChart";
import SavingsTrendChart from "./components/SavingsTrendChart";
import FocusSport from "./components/FocusSport";
import SkinTrackerSection from "./components/SkinTrackerSection";
import MealPlannerSection from "./components/MealPlannerSection";
import PerformanceCorrelations from "./components/PerformanceCorrelations";
import MediaHubSection from "./components/MediaHubSection";
import FormationsSection from "./components/FormationsSection";
import MediaAndAcademySection from "./components/MediaAndAcademySection";
import CareerSection from "./components/CareerSection";
import ProjectFoldersSection from "./components/ProjectFoldersSection";
import AlertsBanner from "./components/AlertsBanner";
import { HabitsSummaryCard } from "./components/HabitsSummaryCard";
import CriticalSubscriptionsAlert from "./components/CriticalSubscriptionsAlert";
import MonthlyPerformanceCard from "./components/MonthlyPerformanceCard";
import MonthlyExpenseAnalysisCard from "./components/MonthlyExpenseAnalysisCard";
import MonthlyComparisonCard from "./components/MonthlyComparisonCard";
import MonthlyGoalsSection from "./components/MonthlyGoalsSection";
import EditorialCalendarSection from "./components/EditorialCalendarSection";
import CentralCalendar from "./components/CentralCalendar";
import DashboardUnifiedCalendar from "./components/DashboardUnifiedCalendar";
import WeeklyCategoryStatsCard from "./components/WeeklyCategoryStatsCard";
import WeatherWidget from "./components/WeatherWidget";
import DisciplineHeatmap from "./components/DisciplineHeatmap";
import Actions30JoursSection from "./components/Actions30JoursSection";
import FireCalculator from "./components/FireCalculator";
import JournalSection from "./components/JournalSection";
import ExcelSyncToolbar from "./components/ExcelSyncToolbar";
import QuickCaptureInbox from "./components/QuickCaptureInbox";
import CommandCenterModal from "./components/CommandCenterModal";
import BudgetOptimizer from "./components/BudgetOptimizer";
import SettingsModal from "./components/SettingsModal";
import ThemeSelectorModal, { ThemePresetId, THEME_PRESETS } from "./components/ThemeSelectorModal";
import UnifiedFinancialEntrySection from "./components/UnifiedFinancialEntrySection";
import {
  initDriveAuth,
  driveSignIn,
  getDriveAccessToken,
  saveToDrive,
  loadFromDrive,
  logoutDrive
} from "./googleDriveService";
import { dbStore } from "./indexedDBStore";
import { mergePayloads } from "./utils/syncUtils";
import { autoCategorizeTransaction, bulkAutoCategorizeTransactions } from "./utils/transactionCategorizer";
import { auth, db, handleFirestoreError, OperationType, isOfflineError } from "./firebase";
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged, User as FirebaseUser } from "firebase/auth";
import { 
  FinanceSectionDashboard, 
  ProductivitySectionDashboard, 
  HealthSectionDashboard, 
  LecturesSectionDashboard 
} from "./components/SectionDashboards";




// Icons imports
import { 
  LayoutDashboard, 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Briefcase, 
  PiggyBank, 
  Landmark, 
  BarChart3, 
  CheckSquare, 
  Calendar, 
  User, 
  Award, 
  Sparkles, 
  Flame, 
  Heart, 
  Layers, 
  BookOpen, 
  ShoppingCart, 
  Bell, 
  GraduationCap, 
  Film, 
  Link2, 
  Compass,
  Tv, 
  ChevronDown, 
  ChevronRight, 
  ChevronLeft,
  GripVertical,
  Menu, 
  X,
  Plus,
  Trash2,
  CheckCircle,
  Square,
  RefreshCw,
  Clock,
  ExternalLink,
  ArrowLeft,
  Dumbbell,
  Eye,
  EyeOff,
  Lock,
  AlertCircle,
  Gift,
  Hourglass,
  Sun,
  Moon,
  Globe,
  Folder,
  FolderOpen,
  FolderPlus,
  FolderKanban,
  Target,
  ClipboardCheck,
  CalendarDays,
  Star,
  Settings,
  Save,
  Cloud,
  CloudOff,
  AlertTriangle,
  Database,
  Palette
} from "lucide-react";

function Logo({ className = "w-8 h-8 text-indigo-500" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M9 3v18" strokeDasharray="2 2" strokeWidth="1.5" />
      <path d="M3 9h18" strokeDasharray="2 2" strokeWidth="1.5" />
      <path d="M14 9l4 4-4 4" strokeWidth="2.5" />
    </svg>
  );
}

export default function App() {
  // --- RESPONSIVE SIDEBAR & NAVIGATION STATES ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>("dashboard"); // "dashboard", or "submodule_id"
  const [dashboardTab, setDashboardTab] = useState<"routines" | "charts" | "launchpad">("routines");
  const [activeChartsSubTab, setActiveChartsSubTab] = useState<"finance" | "correlations" | "fire">("finance");
  const [focusMode, setFocusMode] = useState<boolean>(() => {
    return localStorage.getItem("la_focus_mode") === "true";
  });
  const [showWeather, setShowWeather] = useState<boolean>(false);
  const [dashboardViewMode, setDashboardViewMode] = useState<"minimal" | "complete">(() => {
    const saved = localStorage.getItem("la_dashboard_view_mode");
    return (saved as "minimal" | "complete") || "minimal";
  });
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("la_theme") === "dark";
  });
  const [themePreset, setThemePreset] = useState<ThemePresetId>(() => {
    return (localStorage.getItem("la_theme_preset") as ThemePresetId) || "indigo";
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [autoDarkTheme, setAutoDarkTheme] = useState<boolean>(() => {
    return localStorage.getItem("la_auto_dark_theme") === "true";
  });
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return localStorage.getItem("la_is_unlocked") === "true" || sessionStorage.getItem("la_is_unlocked") === "true";
  });
  const [isDbLoaded, setIsDbLoaded] = useState<boolean>(false);

  // --- CLOUD SYNC & SETTINGS STATES ---
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [cloudSyncEnabled, setCloudSyncEnabled] = useState<boolean>(() => {
    return localStorage.getItem("la_cloud_sync_enabled") === "true";
  });
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [syncStatus, setSyncStatus] = useState<"synced" | "syncing" | "local" | "error">("local");
  const [lastSyncedTime, setLastSyncedTime] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  // --- GOOGLE DRIVE STATES & HANDLERS ---
  const [driveAccessToken, setDriveAccessTokenState] = useState<string | null>(null);
  const [isDriveLoading, setIsDriveLoading] = useState<boolean>(false);
  const [driveLastSynced, setDriveLastSynced] = useState<Date | null>(() => {
    const saved = localStorage.getItem("mp_drive_last_synced");
    return saved ? new Date(saved) : null;
  });
  const [driveAutoSync, setDriveAutoSync] = useState<boolean>(() => {
    return localStorage.getItem("la_drive_auto_sync") === "true";
  });

  // Web Worker for non-blocking backup processes
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Instantiate background Web Worker with Vite-compatible ES module syntax
    const worker = new Worker(new URL("./backupWorker.ts", import.meta.url), {
      type: "module",
    });
    workerRef.current = worker;

    worker.onmessage = (e: MessageEvent) => {
      const { type, target, timestamp, error, isSilent } = e.data;

      if (type === "SYNC_START") {
        if (!isSilent) {
          if (target === "drive") setIsDriveLoading(true);
        }
      } else if (type === "SYNC_SUCCESS") {
        if (target === "drive") {
          setIsDriveLoading(false);
          const date = new Date(timestamp);
          setDriveLastSynced(date);
          localStorage.setItem("mp_drive_last_synced", date.toISOString());
          if (!isSilent) {
            triggerToast("📁 Données sauvegardées avec succès sur votre Google Drive !", "success");
          }
        }
      } else if (type === "SYNC_ERROR") {
        if (target === "drive") {
          setIsDriveLoading(false);
          if (!isSilent) {
            triggerToast(`❌ Échec de la sauvegarde Google Drive : ${error}`, "error");
          }
        }
      }
    };

    // Keep the worker configuration in sync initially
    worker.postMessage({
      type: "CONFIGURE",
      data: {
        driveToken: driveAccessToken || getDriveAccessToken(),
        driveAutoSync,
      },
    });

    return () => {
      worker.terminate();
    };
  }, []);



  // Flag to block la_last_local_update_time updates during initialization or cloud downloads
  const isInternalStateUpdateRef = useRef(true);

  // Synchronization conflict state
  const [syncConflict, setSyncConflict] = useState<{
    localTime: Date;
    cloudTime: Date;
    localPayload: any;
    cloudPayload: any;
    onResolve: (choice: "local" | "cloud") => void;
  } | null>(null);

  // Initialize and load all datasets asynchronously from IndexedDB, migrating from localStorage if needed
  useEffect(() => {
    const loadAllData = async () => {
      isInternalStateUpdateRef.current = true;
      try {
        async function fetchAndMigrate<T>(key: string, defaultValue: T, isNumber = false, isBoolean = false): Promise<T> {
          const value = await dbStore.getItem<T>(key);
          if (value !== null) {
            return value;
          }
          const localVal = localStorage.getItem(key);
          if (localVal !== null) {
            try {
              let parsed: any;
              if (isBoolean) {
                parsed = localVal === "true";
              } else if (isNumber) {
                parsed = parseInt(localVal, 10);
              } else {
                parsed = JSON.parse(localVal);
              }
              await dbStore.setItem(key, parsed);
              return parsed as T;
            } catch (e) {
              console.warn(`Failed to migrate key "${key}" from localStorage:`, e);
            }
          }
          return defaultValue;
        }

        const habits = await fetchAndMigrate<DailyHabit[]>("mp_habits_v2", INITIAL_HABITS);
        const history = await fetchAndMigrate<Record<string, string[]>>("mp_habit_history_v2", {});
        const objectives = await fetchAndMigrate<WeeklyObjective[]>("mp_weekly_objectives_v2", INITIAL_WEEKLY_OBJECTIVES);
        const trans = await fetchAndMigrate<FinanceTransaction[]>("mp_transactions_v2", INITIAL_TRANSACTIONS);
        const stk = await fetchAndMigrate<StockEntry[]>("mp_stocks_v2", INITIAL_STOCKS);
        const bdg = await fetchAndMigrate<FinanceBudget[]>("mp_budgets_v2", INITIAL_BUDGETS);
        const sal = await fetchAndMigrate<FinanceSalaire[]>("mp_salaires_v2", INITIAL_SALAIRES);
        const epa = await fetchAndMigrate<FinanceEpargne[]>("mp_epargnes_v2", INITIAL_EPARGNES);
        const acts30 = await fetchAndMigrate<Action30Jours[]>("mp_actions30_v2", INITIAL_ACTIONS_30_JOURS);
        const prof = await fetchAndMigrate<ProfilAmelioration[]>("mp_profil_v2", INITIAL_PROFIL_AMELIORATIONS);
        const poss = await fetchAndMigrate<PossibiliteGoal[]>("mp_possibilites_v2", INITIAL_POSSIBILITES_GOALS);
        const skins = await fetchAndMigrate<SkinTracker[]>("mp_skin_v2", INITIAL_SKIN_TRACKERS);
        const meals = await fetchAndMigrate<MealPlanner[]>("mp_meal_v2", INITIAL_MEAL_PLANNERS);
        
        const defaultExercises = [
          { id: "ex_1", name: "Échauffement Articulaire & Cardio", desc: "Rotations des bras, genoux hauts et jumping jacks doux.", duration: "5 min", completed: false },
          { id: "ex_2", name: "Squats de l'Atlas", desc: "Descente contrôlée, fesses en arrière, poids sur les talons.", duration: "5 min (3 séries x 15)", completed: false },
          { id: "ex_3", name: "Pompes Solides (Push-ups)", desc: "Gainage parfait, coudes à 45 degrés. Sur les genoux si besoin.", duration: "5 min (3 séries x 12)", completed: false },
          { id: "ex_4", name: "Fentes Alternées", desc: "Fente avant droite puis gauche, angle de 90° pour chaque genou.", duration: "5 min (3 séries x 10/jambe)", completed: false },
          { id: "ex_5", name: "Gainage Planche Royale", desc: "Appui sur les avant-bras, coudes alignés, abdos et fessiers contractés.", duration: "5 min (4 x 45s de travail)", completed: false },
          { id: "ex_6", name: "Étirements & Retour au Calme", desc: "Respiration profonde, étirement des quadriceps, du dos et des épaules.", duration: "5 min", completed: false },
        ];
        const exercises = await fetchAndMigrate<any[]>("mp_sport_exercises", defaultExercises);
        const sportHist = await fetchAndMigrate<string[]>("mp_sport_history", ["2026-07-01", "2026-07-03", "2026-07-05", "2026-07-08", "2026-07-10"]);
        
        const achats = await fetchAndMigrate<AchatMensuel[]>("mp_achats_v2", INITIAL_ACHATS_MENSUELS);
        const abons = await fetchAndMigrate<Abonnement[]>("mp_abonnements_v2", INITIAL_ABONNEMENTS);
        const forms = await fetchAndMigrate<Formation[]>("mp_formations_v2", INITIAL_FORMATIONS);
        const bk = await fetchAndMigrate<BookItem[]>("mp_books_v3", INITIAL_BOOKS);
        const media = await fetchAndMigrate<ScreenMediaItem[]>("mp_screenmedia_v3", INITIAL_SCREENMEDIA);
        const acc = await fetchAndMigrate<Account[]>("mp_accounts_v2", INITIAL_ACCOUNTS);
        const lk = await fetchAndMigrate<ResourceLink[]>("mp_links_v2", INITIAL_RESOURCELINKS);
        const chan = await fetchAndMigrate<ChannelInfo[]>("mp_channels_v2", INITIAL_CHANNELS);
        const wish = await fetchAndMigrate<WishListItem[]>("mp_wishlist_v2", INITIAL_WISHLIST);
        const couteux = await fetchAndMigrate<AchatCouteuxItem[]>("mp_achats_couteux_v2", INITIAL_ACHATS_COUTEUX);
        const mGoals = await fetchAndMigrate<MonthlyGoal[]>("mp_monthly_goals_v2", INITIAL_MONTHLY_GOALS);
        const edEvents = await fetchAndMigrate<EditorialEvent[]>("mp_editorial_events_v2", INITIAL_EDITORIAL_EVENTS);
        const fold = await fetchAndMigrate<ProjectFolder[]>("mp_project_folders_v1", INITIAL_PROJECT_FOLDERS);
        const snooze = await fetchAndMigrate<Record<string, number>>("mp_snoozed_alerts_v2", {});
        
        const defaultJournal: JournalEntry[] = [
          {
            id: "j_1",
            date: "2026-07-16",
            title: "Lancement de la nouvelle structure de vie",
            content: "Aujourd'hui, j'ai optimisé mes trackers de discipline et de projets. Je me sens motivé à bloc. Les finances sont sous contrôle, j'ai budgétisé toutes les charges du mois. L'objectif de la semaine est d'être hyper constant sur ma routine de sport.",
            mood: "Excellent",
            tags: "Discipline, Finances, Organisation"
          },
          {
            id: "j_2",
            date: "2026-07-15",
            title: "Session de révisions & Analyse de marché",
            content: "Excellente progression sur la formation en production cinématographique. J'ai aussi analysé le comportement du cours de bourse sur la BVC. Patience et rigueur sont les maîtres mots de cette transition.",
            mood: "Bon",
            tags: "Apprentissage, Bourse"
          }
        ];
        const journal = await fetchAndMigrate<JournalEntry[]>("life_architect_journal", defaultJournal);
        const streak = await fetchAndMigrate<number>("mp_streak_count_v2", 7, true);
        
        const reminderEnabled = await fetchAndMigrate<boolean>("mp_morning_reminder_enabled", true, false, true);
        const reminderTime = await fetchAndMigrate<string>("mp_morning_reminder_time", "09:00");
        const reminderText = await fetchAndMigrate<string>("mp_morning_reminder_text", "C'est l'heure de consulter vos objectifs hebdomadaires prioritaires pour démarrer votre journée en force !");
        const notifInterval = await fetchAndMigrate<number>("mp_notification_interval", 15, true);
        const notifiedH = await fetchAndMigrate<Record<string, string>>("mp_notified_habits", {});

        // Now update state with all fetched values
        setDailyHabits(habits);
        setHabitHistory(history);
        setWeeklyObjectives(objectives);
        setTransactions(trans);
        setStocks(stk);
        setBudgets(bdg);
        setSalaires(sal);
        setEpargnes(epa);
        setActions30Jours(acts30);
        setProfilAmeliorations(prof);
        setPossibilitesGoals(poss);
        setSkinTrackers(skins);
        setMealPlanners(meals);
        setSportExercises(exercises);
        setSportHistory(sportHist);
        setAchatsMensuels(achats);
        setAbonnements(abons);
        setFormations(forms);
        setBooks(bk);
        setScreenMedia(media);
        setAccounts(acc);
        setLinks(lk);
        setChannels(chan);
        setWishList(wish);
        setAchatsCouteux(couteux);
        setMonthlyGoals(mGoals);
        setEditorialEvents(edEvents);
        setFolders(fold);
        setSnoozedAlerts(snooze);
        setJournalEntries(journal);
        setStreakCount(streak);
        
        setMorningReminderEnabled(reminderEnabled);
        setMorningReminderTime(reminderTime);
        setMorningReminderText(reminderText);
        setNotificationInterval(notifInterval);
        
        notifiedHabitsRef.current = notifiedH;
        setNotifiedHabits(notifiedH);

        // All data is successfully loaded from IndexedDB
        setIsDbLoaded(true);
        isInternalStateUpdateRef.current = false;
      } catch (error) {
        console.error("IndexedDB critical boot load failed:", error);
        setIsDbLoaded(true); // Fallback
        isInternalStateUpdateRef.current = false;
      }
    };

    loadAllData();
  }, []);

  // --- SECOND BRAIN COMMAND CENTER SHORTCUTS ---
  const [commandCenterOpen, setCommandCenterOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setCommandCenterOpen(prev => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleQuickAddWeeklyObjective = (text: string, isPriority = false) => {
    const newObj = {
      id: "obj_" + Date.now(),
      text,
      completed: false,
      isPriority
    };
    setWeeklyObjectives(prev => [...prev, newObj]);
  };

  const handleQuickAddTransaction = (tx: any) => {
    const categoryOptions = ["Revenus Pro", "Sponsor", "AdSense", "Équipement", "Repas", "Logiciels", "Alimentation", "Transport", "Loisirs", "Autres"];
    const autoRes = autoCategorizeTransaction(tx.description || "", tx.type, tx.category, categoryOptions);
    const newTx = {
      ...tx,
      category: autoRes.category || "Autres",
      id: "tr_" + Date.now()
    };
    setTransactions(prev => [newTx, ...prev]);
    if (autoRes.isSuggested && autoRes.matchedKeyword) {
      triggerToast(`🪄 Catégorie "${autoRes.category}" attribuée d'après "${autoRes.matchedKeyword}" !`, "info");
    }
  };

  const handleQuickAddJournalEntry = (title: string, content: string, mood: any) => {
    const newEntry = {
      id: "jr_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      title,
      content,
      mood,
      tags: "quick-capture"
    };
    setJournalEntries(prev => [newEntry, ...prev]);
  };

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // --- DASHBOARD CARDS DRAG & DROP REORDERING STATE ---
  const [dashboardCardOrder, setDashboardCardOrder] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("mp_dashboard_card_order_v1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.length === 3 &&
          parsed.includes("project_tasks") &&
          parsed.includes("skin_routine") &&
          parsed.includes("alerts")
        ) {
          return parsed;
        }
      }
    } catch (e) {
      // ignore error
    }
    return ["project_tasks", "skin_routine", "alerts"];
  });

  const [draggedCardId, setDraggedCardId] = useState<string | null>(null);
  const [dragOverCardId, setDragOverCardId] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem("mp_dashboard_card_order_v1", JSON.stringify(dashboardCardOrder));
    } catch (e) {
      // ignore error
    }
  }, [dashboardCardOrder]);

  const handleCardDragStart = (e: React.DragEvent, cardId: string) => {
    e.dataTransfer.setData("text/plain", cardId);
    e.dataTransfer.effectAllowed = "move";
    setDraggedCardId(cardId);
  };

  const handleCardDragOver = (e: React.DragEvent, cardId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverCardId !== cardId) {
      setDragOverCardId(cardId);
    }
  };

  const handleCardDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleCardDrop = (e: React.DragEvent, targetCardId: string) => {
    e.preventDefault();
    const sourceCardId = e.dataTransfer.getData("text/plain") || draggedCardId;
    if (sourceCardId && sourceCardId !== targetCardId) {
      setDashboardCardOrder(prev => {
        const oldIndex = prev.indexOf(sourceCardId);
        const newIndex = prev.indexOf(targetCardId);
        if (oldIndex === -1 || newIndex === -1) return prev;
        const newOrder = [...prev];
        newOrder.splice(oldIndex, 1);
        newOrder.splice(newIndex, 0, sourceCardId);
        return newOrder;
      });
      triggerToast("Ordre des cartes mis à jour !", "success");
    }
    setDraggedCardId(null);
    setDragOverCardId(null);
  };

  const handleCardDragEnd = () => {
    setDraggedCardId(null);
    setDragOverCardId(null);
  };

  const moveCardInOrder = (cardId: string, direction: "left" | "right") => {
    setDashboardCardOrder(prev => {
      const idx = prev.indexOf(cardId);
      if (idx === -1) return prev;
      const targetIdx = direction === "left" ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;
      const newOrder = [...prev];
      const [moved] = newOrder.splice(idx, 1);
      newOrder.splice(targetIdx, 0, moved);
      return newOrder;
    });
    triggerToast("Disposition mise à jour !", "info");
  };

  const resetDashboardCardOrder = () => {
    setDashboardCardOrder(["project_tasks", "skin_routine", "alerts"]);
    triggerToast("Ordre des cartes réinitialisé !", "info");
  };

  // --- HABIT HISTORY (HEATMAP TRACKER) ---
  const [habitHistory, setHabitHistory] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem("mp_habit_history_v2");
    if (saved) return JSON.parse(saved);

    // Seed realistic daily routine completions for the year 2026 (Jan 1, 2026 to July 14, 2026)
    const seed: Record<string, string[]> = {};
    const startDate = new Date(2026, 0, 1);
    const endDate = new Date(2026, 6, 14); // July 14, 2026
    const habitIds = ["h1", "h2", "h3", "h4", "h5", "h6", "h7"];

    let current = new Date(startDate);
    while (current <= endDate) {
      const dateStr = current.toISOString().split("T")[0];
      const rand = Math.random();
      
      let completedCount = 0;
      if (rand < 0.15) {
        completedCount = Math.floor(Math.random() * 3); // Low completion days
      } else if (rand < 0.45) {
        completedCount = 3 + Math.floor(Math.random() * 3); // Normal days
      } else {
        completedCount = 6 + Math.floor(Math.random() * 2); // Perfect/near-perfect days (Gold or forest greens!)
      }

      // Random subset of completed habits
      const shuffled = [...habitIds].sort(() => 0.5 - Math.random());
      seed[dateStr] = shuffled.slice(0, completedCount);

      current.setDate(current.getDate() + 1);
    }
    return seed;
  });
  const [usernameInput, setUsernameInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string>("");
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    finance: false,
    productivity: false,
    health: false,
    projets: false,
    career_cat: false,
    formation: false,
    accounts: false
  });

  // --- CORE SYSTEM STATES (Persistent via LocalStorage) ---
  const [dailyHabits, setDailyHabits] = useState<DailyHabit[]>(() => {
    const saved = localStorage.getItem("mp_habits_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DailyHabit[];
        return parsed.map(h => {
          const initial = INITIAL_HABITS.find(ih => ih.id === h.id);
          let cat = h.category;
          if (cat === "personal" || !cat) cat = "Personal";
          if (cat === "professional") cat = "Career";
          return {
            ...h,
            category: cat,
            isImportant: h.isImportant !== undefined ? h.isImportant : (initial?.isImportant ?? false),
            dueTime: h.dueTime !== undefined ? h.dueTime : (initial?.dueTime ?? "")
          };
        });
      } catch (err) {
        return INITIAL_HABITS;
      }
    }
    return INITIAL_HABITS;
  });

  const [weeklyObjectives, setWeeklyObjectives] = useState<WeeklyObjective[]>(() => {
    const saved = localStorage.getItem("mp_weekly_objectives_v2");
    return saved ? JSON.parse(saved) : INITIAL_WEEKLY_OBJECTIVES;
  });

  const weeklyObjectivesRef = useRef(weeklyObjectives);
  useEffect(() => {
    weeklyObjectivesRef.current = weeklyObjectives;
  }, [weeklyObjectives]);

  const [overdueHabitsAlert, setOverdueHabitsAlert] = useState<DailyHabit[]>([]);
  const [showOverdueModal, setShowOverdueModal] = useState<boolean>(false);

  // --- BROWSER NOTIFICATIONS FOR IMPORTANT HABITS & WEEKLY REMINDER ---
  const notifiedHabitsRef = useRef<Record<string, string>>({});
  const [notifiedHabits, setNotifiedHabits] = useState<Record<string, string>>({});

  const [morningReminderEnabled, setMorningReminderEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("mp_morning_reminder_enabled");
      return saved !== null ? saved === "true" : true;
    } catch (e) {
      return true;
    }
  });

  const [morningReminderTime, setMorningReminderTime] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("mp_morning_reminder_time");
      return saved || "09:00";
    } catch (e) {
      return "09:00";
    }
  });

  const [morningReminderText, setMorningReminderText] = useState<string>(() => {
    try {
      const saved = localStorage.getItem("mp_morning_reminder_text");
      return saved || "C'est l'heure de consulter vos objectifs hebdomadaires prioritaires pour démarrer votre journée en force !";
    } catch (e) {
      return "C'est l'heure de consulter vos objectifs hebdomadaires prioritaires pour démarrer votre journée en force !";
    }
  });

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_morning_reminder_enabled", morningReminderEnabled);
    }
  }, [morningReminderEnabled, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_morning_reminder_time", morningReminderTime);
    }
  }, [morningReminderTime, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_morning_reminder_text", morningReminderText);
    }
  }, [morningReminderText, isDbLoaded]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("mp_notified_habits");
      if (saved) {
        const parsed = JSON.parse(saved);
        notifiedHabitsRef.current = parsed;
        setNotifiedHabits(parsed);
      }
    } catch (e) {
      // ignore
    }
  }, []);

  const [notificationPermission, setNotificationPermission] = useState<string>(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "default";
  });

  const requestNotificationPermission = () => {
    if (typeof window !== "undefined" && "Notification" in window) {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
      });
    }
  };

  const dailyHabitsRef = useRef(dailyHabits);
  useEffect(() => {
    dailyHabitsRef.current = dailyHabits;
  }, [dailyHabits]);

  const [notificationInterval, setNotificationInterval] = useState<number>(() => {
    try {
      const saved = localStorage.getItem("mp_notification_interval");
      return saved ? parseInt(saved, 10) : 15; // default 15 seconds
    } catch (e) {
      return 15;
    }
  });

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_notification_interval", notificationInterval);
    }
  }, [notificationInterval, isDbLoaded]);

  const [manualCheckFeedback, setManualCheckFeedback] = useState<string | null>(null);

  const runNotificationCheck = (isManual = false) => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      if (isManual) {
        setManualCheckFeedback("Les notifications ne sont pas prises en charge.");
        setTimeout(() => setManualCheckFeedback(null), 3000);
      }
      return;
    }
    if (Notification.permission !== "granted") {
      if (isManual) {
        setManualCheckFeedback("Autorisation de notification manquante.");
        setTimeout(() => setManualCheckFeedback(null), 3000);
      }
      return;
    }

    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    // 1. Habits Check
    const habitsToNotify = dailyHabitsRef.current.filter(h => {
      if (!h.isImportant || h.completed || !h.dueTime) return false;

      // Check if already notified today
      const lastNotifiedDate = notifiedHabitsRef.current[h.id];
      if (lastNotifiedDate === todayStr) return false;

      // Parse dueTime (format "HH:MM")
      const parts = h.dueTime.split(":");
      if (parts.length !== 2) return false;
      const dueHour = parseInt(parts[0], 10);
      const dueMin = parseInt(parts[1], 10);
      if (isNaN(dueHour) || isNaN(dueMin)) return false;

      // Has current time reached or passed due time?
      const isDue = (currentHour > dueHour) || (currentHour === dueHour && currentMin >= dueMin);
      return isDue;
    });

    if (habitsToNotify.length > 0) {
      habitsToNotify.forEach(h => {
        try {
          new Notification("⏰ Habitude Importante !", {
            body: `Il est temps d'effectuer : "${h.name}" (Heure limite : ${h.dueTime})`,
            icon: "/favicon.ico",
            tag: `habit-due-${h.id}-${todayStr}`,
            requireInteraction: true
          });

          // Mark as notified
          notifiedHabitsRef.current[h.id] = todayStr;
          localStorage.setItem("mp_notified_habits", JSON.stringify(notifiedHabitsRef.current));
        } catch (err) {
          console.error("Erreur notification :", err);
        }
      });
      // Sync state to trigger re-renders
      setNotifiedHabits({ ...notifiedHabitsRef.current });
      if (isManual) {
        setManualCheckFeedback(`Succès ! ${habitsToNotify.length} rappel(s) envoyé(s).`);
        setTimeout(() => setManualCheckFeedback(null), 3500);
      }
    } else {
      if (isManual) {
        setManualCheckFeedback("Aucune habitude importante en retard détectée.");
        setTimeout(() => setManualCheckFeedback(null), 3000);
      }
    }

    // 2. Morning Reminder for Priority Weekly Objectives Check
    if (morningReminderEnabled) {
      try {
        const lastReminderDate = localStorage.getItem("mp_morning_reminder_last_date") || "";
        if (lastReminderDate !== todayStr) {
          const timeParts = morningReminderTime.split(":");
          if (timeParts.length === 2) {
            const targetHour = parseInt(timeParts[0], 10);
            const targetMin = parseInt(timeParts[1], 10);
            
            if (!isNaN(targetHour) && !isNaN(targetMin)) {
              const isTimeReached = (currentHour > targetHour) || (currentHour === targetHour && currentMin >= targetMin);
              
              if (isTimeReached) {
                const priorityObjectives = weeklyObjectivesRef.current.filter(o => o.isPriority && !o.completed);
                if (priorityObjectives.length > 0) {
                  new Notification("⏰ Objectifs Prioritaires", {
                    body: morningReminderText || `Vous avez ${priorityObjectives.length} objectif(s) prioritaire(s) à accomplir aujourd'hui. Démarrons la journée en force !`,
                    icon: "/favicon.ico",
                    tag: `morning-reminder-${todayStr}`,
                    requireInteraction: true
                  });
                  localStorage.setItem("mp_morning_reminder_last_date", todayStr);
                }
              }
            }
          }
        }
      } catch (err) {
        console.error("Erreur notification matinale :", err);
      }
    }
  };

  const testMorningReminder = () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      triggerToast("Les notifications ne sont pas prises en charge par votre navigateur.", "error");
      return;
    }
    if (Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
        if (permission === "granted") {
          triggerMorningNotificationDirectly();
        } else {
          triggerToast("Veuillez autoriser les notifications dans votre navigateur.", "error");
        }
      });
      return;
    }
    triggerMorningNotificationDirectly();
  };

  const triggerMorningNotificationDirectly = () => {
    try {
      const priorityCount = weeklyObjectives.filter(o => o.isPriority && !o.completed).length;
      new Notification("⏰ Objectifs Prioritaires (Test) !", {
        body: morningReminderText || `Rappel : Vous avez ${priorityCount} objectif(s) prioritaire(s) à consulter aujourd'hui.`,
        icon: "/favicon.ico",
        requireInteraction: true
      });
      triggerToast("🔔 Notification de test envoyée !", "success");
    } catch (err) {
      console.error(err);
      triggerToast("Échec de l'envoi de la notification.", "error");
    }
  };

  const triggerImmediateCheck = () => {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setManualCheckFeedback("Notifications non supportées par ce navigateur.");
      setTimeout(() => setManualCheckFeedback(null), 3000);
      return;
    }

    if (Notification.permission !== "granted") {
      Notification.requestPermission().then(permission => {
        setNotificationPermission(permission);
        if (permission === "granted") {
          runNotificationCheck(true);
        } else {
          setManualCheckFeedback("Veuillez d'abord autoriser les notifications.");
          setTimeout(() => setManualCheckFeedback(null), 3000);
        }
      });
      return;
    }

    runNotificationCheck(true);
  };

  useEffect(() => {
    // Run an initial check shortly after mounting / interval changes
    const initialTimeout = setTimeout(() => {
      runNotificationCheck(false);
    }, 1000);

    const intervalId = setInterval(() => {
      runNotificationCheck(false);
    }, notificationInterval * 1000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(intervalId);
    };
  }, [notificationInterval, morningReminderEnabled, morningReminderTime, morningReminderText]);

  const [transactions, setTransactions] = useState<FinanceTransaction[]>(() => {
    const saved = localStorage.getItem("mp_transactions_v2");
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [stocks, setStocks] = useState<StockEntry[]>(() => {
    const saved = localStorage.getItem("mp_stocks_v2");
    return saved ? JSON.parse(saved) : INITIAL_STOCKS;
  });

  const [budgets, setBudgets] = useState<FinanceBudget[]>(() => {
    const saved = localStorage.getItem("mp_budgets_v2");
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [salaires, setSalaires] = useState<FinanceSalaire[]>(() => {
    const saved = localStorage.getItem("mp_salaires_v2");
    return saved ? JSON.parse(saved) : INITIAL_SALAIRES;
  });

  const [epargnes, setEpargnes] = useState<FinanceEpargne[]>(() => {
    const saved = localStorage.getItem("mp_epargnes_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && (parsed.length === 0 || parsed.some(e => e.name === "Achat Appartement Casablanca"))) {
          return INITIAL_EPARGNES;
        }
        return parsed;
      } catch (e) {
        return INITIAL_EPARGNES;
      }
    }
    return INITIAL_EPARGNES;
  });

  const [actions30Jours, setActions30Jours] = useState<Action30Jours[]>(() => {
    const saved = localStorage.getItem("mp_actions30_v2");
    return saved ? JSON.parse(saved) : INITIAL_ACTIONS_30_JOURS;
  });

  const [profilAmeliorations, setProfilAmeliorations] = useState<ProfilAmelioration[]>(() => {
    const saved = localStorage.getItem("mp_profil_v2");
    return saved ? JSON.parse(saved) : INITIAL_PROFIL_AMELIORATIONS;
  });

  const [possibilitesGoals, setPossibilitesGoals] = useState<PossibiliteGoal[]>(() => {
    const saved = localStorage.getItem("mp_possibilites_v2");
    return saved ? JSON.parse(saved) : INITIAL_POSSIBILITES_GOALS;
  });

  const [skinTrackers, setSkinTrackers] = useState<SkinTracker[]>(() => {
    const saved = localStorage.getItem("mp_skin_v2");
    return saved ? JSON.parse(saved) : INITIAL_SKIN_TRACKERS;
  });

  const [sportExercises, setSportExercises] = useState<any[]>(() => {
    const saved = localStorage.getItem("mp_sport_exercises");
    if (saved) return JSON.parse(saved);
    return [
      { id: "ex_1", name: "Échauffement Articulaire & Cardio", desc: "Rotations des bras, genoux hauts et jumping jacks doux.", duration: "5 min", completed: false },
      { id: "ex_2", name: "Squats de l'Atlas", desc: "Descente contrôlée, fesses en arrière, poids sur les talons.", duration: "5 min (3 séries x 15)", completed: false },
      { id: "ex_3", name: "Pompes Solides (Push-ups)", desc: "Gainage parfait, coudes à 45 degrés. Sur les genoux si besoin.", duration: "5 min (3 séries x 12)", completed: false },
      { id: "ex_4", name: "Fentes Alternées", desc: "Fente avant droite puis gauche, angle de 90° pour chaque genou.", duration: "5 min (3 séries x 10/jambe)", completed: false },
      { id: "ex_5", name: "Gainage Planche Royale", desc: "Appui sur les avant-bras, corps aligné, abdos et fessiers contractés.", duration: "5 min (4 x 45s de travail)", completed: false },
      { id: "ex_6", name: "Étirements & Retour au Calme", desc: "Respiration profonde, étirement des quadriceps, du dos et des épaules.", duration: "5 min", completed: false },
    ];
  });

  const [sportHistory, setSportHistory] = useState<string[]>(() => {
    const saved = localStorage.getItem("mp_sport_history");
    if (saved) return JSON.parse(saved);
    // Seed with beautiful past completions in current/recent weeks
    return ["2026-07-01", "2026-07-03", "2026-07-05", "2026-07-08", "2026-07-10"];
  });

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_sport_history", sportHistory);
    }
  }, [sportHistory, isDbLoaded]);

  const toggleSportDay = (dateStr: string) => {
    const todayStr = new Date().toISOString().split('T')[0];
    setSportHistory(prev => {
      const isCompleted = prev.includes(dateStr);
      const newHistory = isCompleted ? prev.filter(d => d !== dateStr) : [...prev, dateStr];
      
      // If we are toggling today's date, also update today's exercises
      if (dateStr === todayStr) {
        const nextState = !isCompleted;
        setSportExercises(exs => exs.map(e => ({ ...e, completed: nextState })));
      }
      
      return newHistory;
    });
  };

  const [mealPlanners, setMealPlanners] = useState<MealPlanner[]>(() => {
    const saved = localStorage.getItem("mp_meal_v2");
    return saved ? JSON.parse(saved) : INITIAL_MEAL_PLANNERS;
  });

  const [achatsMensuels, setAchatsMensuels] = useState<AchatMensuel[]>(() => {
    const saved = localStorage.getItem("mp_achats_v2");
    return saved ? JSON.parse(saved) : INITIAL_ACHATS_MENSUELS;
  });

  const [abonnements, setAbonnements] = useState<Abonnement[]>(() => {
    const saved = localStorage.getItem("mp_abonnements_v2");
    return saved ? JSON.parse(saved) : INITIAL_ABONNEMENTS;
  });

  const [formations, setFormations] = useState<Formation[]>(() => {
    const saved = localStorage.getItem("mp_formations_v2");
    return saved ? JSON.parse(saved) : INITIAL_FORMATIONS;
  });

  const [books, setBooks] = useState<BookItem[]>(() => {
    const saved = localStorage.getItem("mp_books_v3");
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [screenMedia, setScreenMedia] = useState<ScreenMediaItem[]>(() => {
    const saved = localStorage.getItem("mp_screenmedia_v3");
    return saved ? JSON.parse(saved) : INITIAL_SCREENMEDIA;
  });

  const [accounts, setAccounts] = useState<Account[]>(() => {
    const saved = localStorage.getItem("mp_accounts_v2");
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [links, setLinks] = useState<ResourceLink[]>(() => {
    const saved = localStorage.getItem("mp_links_v2");
    return saved ? JSON.parse(saved) : INITIAL_RESOURCELINKS;
  });

  const [channels, setChannels] = useState<ChannelInfo[]>(() => {
    const saved = localStorage.getItem("mp_channels_v2");
    if (saved) {
      const parsed: ChannelInfo[] = JSON.parse(saved);
      // Merge initial ideas into existing channels like "The Moroccan CFO"
      return parsed.map(c => {
        const initChan = INITIAL_CHANNELS.find(ic => ic.name === c.name || ic.id === c.id);
        if (initChan && initChan.ideas) {
          const currentIdeas = c.ideas || [];
          const missingIdeas = initChan.ideas.filter(
            initIdea => !currentIdeas.some(i => i.id === initIdea.id || i.title.toLowerCase() === initIdea.title.toLowerCase())
          );
          if (missingIdeas.length > 0) {
            return { ...c, ideas: [...currentIdeas, ...missingIdeas] };
          }
        }
        return c;
      });
    }
    return INITIAL_CHANNELS;
  });

  const [wishList, setWishList] = useState<WishListItem[]>(() => {
    const saved = localStorage.getItem("mp_wishlist_v2");
    if (saved) {
      const parsed: WishListItem[] = JSON.parse(saved);
      const merged = [...parsed];
      INITIAL_WISHLIST.forEach(initItem => {
        const alreadyExists = parsed.some(
          x => x.id === initItem.id || x.itemName.toLowerCase() === initItem.itemName.toLowerCase()
        );
        if (!alreadyExists) {
          merged.push(initItem);
        }
      });
      return merged;
    }
    return INITIAL_WISHLIST;
  });

  const [achatsCouteux, setAchatsCouteux] = useState<AchatCouteuxItem[]>(() => {
    const saved = localStorage.getItem("mp_achats_couteux_v2");
    if (saved) {
      const parsed = JSON.parse(saved);
      // If template items are present or MacBook is missing, override to show the user's expensive purchases
      if (parsed.some((x: any) => x.id === "acc1" || x.id === "acc2") || !parsed.some((x: any) => x.id === "acc-macbook")) {
        return INITIAL_ACHATS_COUTEUX;
      }
      return parsed;
    }
    return INITIAL_ACHATS_COUTEUX;
  });

  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoal[]>(() => {
    const saved = localStorage.getItem("mp_monthly_goals_v2");
    return saved ? JSON.parse(saved) : INITIAL_MONTHLY_GOALS;
  });

  const [editorialEvents, setEditorialEvents] = useState<EditorialEvent[]>(() => {
    const saved = localStorage.getItem("mp_editorial_events_v2");
    if (saved) {
      const parsed: EditorialEvent[] = JSON.parse(saved);
      const merged = [...parsed];
      INITIAL_EDITORIAL_EVENTS.forEach(initEv => {
        const exists = parsed.some(e => e.id === initEv.id || e.title.toLowerCase() === initEv.title.toLowerCase());
        if (!exists) {
          merged.push(initEv);
        }
      });
      return merged;
    }
    return INITIAL_EDITORIAL_EVENTS;
  });

  const [folders, setFolders] = useState<ProjectFolder[]>(() => {
    const saved = localStorage.getItem("mp_project_folders_v1");
    return saved ? JSON.parse(saved) : INITIAL_PROJECT_FOLDERS;
  });

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_project_folders_v1", folders);
    }
  }, [folders, isDbLoaded]);

  const [snoozedAlerts, setSnoozedAlerts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("mp_snoozed_alerts_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const now = Date.now();
        const filtered: Record<string, number> = {};
        for (const [id, expiresAt] of Object.entries(parsed)) {
          if (typeof expiresAt === "number" && expiresAt > now) {
            filtered[id] = expiresAt;
          }
        }
        return filtered;
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_snoozed_alerts_v2", snoozedAlerts);
    }
  }, [snoozedAlerts, isDbLoaded]);

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem("life_architect_journal");
      return saved ? JSON.parse(saved) : [
        {
          id: "j_1",
          date: "2026-07-16",
          title: "Lancement de la nouvelle structure de vie",
          content: "Aujourd'hui, j'ai optimisé mes trackers de discipline et de projets. Je me sens motivé à bloc. Les finances sont sous contrôle, j'ai budgétisé toutes les charges du mois. L'objectif de la semaine est d'être hyper constant sur ma routine de sport.",
          mood: "Excellent",
          tags: "Discipline, Finances, Organisation"
        },
        {
          id: "j_2",
          date: "2026-07-15",
          title: "Session de révisions & Analyse de marché",
          content: "Excellente progression sur la formation en production cinématographique. J'ai aussi analysé le comportement du cours de bourse sur la BVC. Patience et rigueur sont les maîtres mots de cette transition.",
          mood: "Bon",
          tags: "Apprentissage, Bourse"
        }
      ];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("life_architect_journal", journalEntries);
    }
  }, [journalEntries, isDbLoaded]);



  // Stats / Streaks
  const [streakCount, setStreakCount] = useState<number>(() => {
    const saved = localStorage.getItem("mp_streak_count_v2");
    return saved ? parseInt(saved) : 7;
  });

  // --- EXCEL DATA SYNCHRONIZATION UTILITIES ---
  const getSyncDataAndHandler = (moduleId: string) => {
    switch (moduleId) {
      case "comptes":
        return {
          data: accounts,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setAccounts(prev => mode === "replace" ? parsedData : [...prev, ...parsedData]);
          }
        };
      case "transactions":
        return {
          data: transactions,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setTransactions(prev => mode === "replace" ? parsedData : [...parsedData, ...prev]);
          }
        };
      case "stocks":
        return {
          data: stocks,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setStocks(prev => mode === "replace" ? parsedData : [...parsedData, ...prev]);
          }
        };
      case "budgets":
        return {
          data: budgets,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setBudgets(prev => mode === "replace" ? parsedData : [...parsedData, ...prev]);
          }
        };
      case "salaires":
        return {
          data: salaires,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setSalaires(prev => mode === "replace" ? parsedData : [...parsedData, ...prev]);
          }
        };
      case "epargnes":
        return {
          data: epargnes,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setEpargnes(prev => mode === "replace" ? parsedData : [...parsedData, ...prev]);
          }
        };
      case "achats":
        return {
          data: achatsMensuels,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setAchatsMensuels(prev => mode === "replace" ? parsedData : [...prev, ...parsedData]);
          }
        };
      case "abonnements":
        return {
          data: abonnements,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setAbonnements(prev => mode === "replace" ? parsedData : [...prev, ...parsedData]);
          }
        };
      case "wishlist":
        return {
          data: wishList,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setWishList(prev => mode === "replace" ? parsedData : [...prev, ...parsedData]);
          }
        };
      case "achats_couteux":
        return {
          data: achatsCouteux,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setAchatsCouteux(prev => mode === "replace" ? parsedData : [...prev, ...parsedData]);
          }
        };
      case "habits":
        return {
          data: dailyHabits,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setDailyHabits(prev => mode === "replace" ? parsedData : [...prev, ...parsedData]);
          }
        };
      case "actions30":
        return {
          data: actions30Jours,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setActions30Jours(prev => mode === "replace" ? parsedData : [...prev, ...parsedData]);
          }
        };
      case "profil":
        return {
          data: profilAmeliorations,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setProfilAmeliorations(prev => mode === "replace" ? parsedData : [...prev, ...parsedData]);
          }
        };
      case "monthly_goals":
        return {
          data: monthlyGoals,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setMonthlyGoals(prev => mode === "replace" ? parsedData : [...prev, ...parsedData]);
          }
        };
      case "journal":
        return {
          data: journalEntries,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setJournalEntries(prev => mode === "replace" ? parsedData : [...parsedData, ...prev]);
          }
        };
      case "skin":
        return {
          data: skinTrackers,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setSkinTrackers(prev => mode === "replace" ? parsedData : [...prev, ...parsedData]);
          }
        };
      case "meal":
        return {
          data: mealPlanners,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setMealPlanners(prev => mode === "replace" ? parsedData : [...prev, ...parsedData]);
          }
        };
      case "sport":
        return {
          data: sportExercises,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setSportExercises(prev => mode === "replace" ? parsedData : [...prev, ...parsedData]);
          }
        };
      case "project_folders":
        return {
          data: folders,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setFolders(prev => mode === "replace" ? parsedData : [...prev, ...parsedData]);
          }
        };
      case "formations":
        return {
          data: formations,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setFormations(prev => mode === "replace" ? parsedData : [...prev, ...parsedData]);
          }
        };
      case "channels":
        return {
          data: channels,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setChannels(prev => mode === "replace" ? parsedData : [...prev, ...parsedData]);
          }
        };
      case "editorial_calendar":
        return {
          data: editorialEvents,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setEditorialEvents(prev => mode === "replace" ? parsedData : [...prev, ...parsedData]);
          }
        };
      case "links":
        return {
          data: links,
          onImport: (parsedData: any[], mode: "append" | "replace") => {
            setLinks(prev => mode === "replace" ? parsedData : [...prev, ...parsedData]);
          }
        };
      default:
        return null;
    }
  };

  // --- VERIFICATION DES HABITUDES EN RETARD AU CHARGEMENT ---
  useEffect(() => {
    if (!isUnlocked) return;

    const alreadyAlerted = sessionStorage.getItem("la_overdue_alert_shown") === "true";
    if (alreadyAlerted) return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    const late = dailyHabits.filter(h => {
      if (!h.isImportant || h.completed || !h.dueTime) return false;

      const parts = h.dueTime.split(":");
      if (parts.length !== 2) return false;

      const dueHour = parseInt(parts[0], 10);
      const dueMin = parseInt(parts[1], 10);

      if (isNaN(dueHour) || isNaN(dueMin)) return false;

      return (currentHour > dueHour) || (currentHour === dueHour && currentMin >= dueMin);
    });

    if (late.length > 0) {
      setOverdueHabitsAlert(late);
      setShowOverdueModal(true);
      sessionStorage.setItem("la_overdue_alert_shown", "true");
    }
  }, [isUnlocked, dailyHabits]);

  // --- THEME SYNC EFFECT ---
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("la_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("la_theme", "light");
    }
  }, [isDarkMode]);

  // --- THEME PRESET PALETTE SYNC ---
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", themePreset);
    localStorage.setItem("la_theme_preset", themePreset);
  }, [themePreset]);

  // Save autoDarkTheme setting to localStorage
  useEffect(() => {
    localStorage.setItem("la_auto_dark_theme", autoDarkTheme ? "true" : "false");
  }, [autoDarkTheme]);

  // Local Time check for Auto Dark Mode
  useEffect(() => {
    if (!autoDarkTheme) return;

    const checkLocalTimeAndSetTheme = () => {
      const currentHour = new Date().getHours();
      // Auto dark mode between 19h (7 PM) and 7h (7 AM)
      const isNight = currentHour >= 19 || currentHour < 7;
      if (isDarkMode !== isNight) {
        setIsDarkMode(isNight);
      }
    };

    checkLocalTimeAndSetTheme();
    const interval = setInterval(checkLocalTimeAndSetTheme, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [autoDarkTheme, isDarkMode]);

  const prevModulesRef = useRef<any>({});

  // Monitor local state changes and record last updated timestamp
  useEffect(() => {
    const current = {
      dailyHabits, habitHistory, weeklyObjectives, transactions, stocks, budgets, salaires,
      epargnes, actions30Jours, profilAmeliorations, skinTrackers, mealPlanners,
      achatsMensuels, abonnements, formations, books, screenMedia, accounts,
      links, channels, wishList, achatsCouteux, folders, journalEntries,
      streakCount, monthlyGoals, editorialEvents, notificationInterval
    };

    if (isInternalStateUpdateRef.current) {
      prevModulesRef.current = current;
      return;
    }

    const now = new Date().toISOString();
    const savedTimestampsStr = localStorage.getItem("la_module_timestamps") || "{}";
    const savedTimestamps = JSON.parse(savedTimestampsStr);
    let updated = false;

    Object.keys(current).forEach((key) => {
      const prevVal = prevModulesRef.current[key];
      const currVal = (current as any)[key];
      
      if (prevVal !== undefined && JSON.stringify(prevVal) !== JSON.stringify(currVal)) {
        savedTimestamps[key] = now;
        updated = true;
      }
    });

    if (updated) {
      localStorage.setItem("la_module_timestamps", JSON.stringify(savedTimestamps));
      localStorage.setItem("la_last_local_update_time", now);
    } else if (!localStorage.getItem("la_module_timestamps")) {
      localStorage.setItem("la_module_timestamps", JSON.stringify(savedTimestamps));
    }

    prevModulesRef.current = current;
  }, [
    dailyHabits, habitHistory, weeklyObjectives, transactions, stocks, budgets, salaires,
    epargnes, actions30Jours, profilAmeliorations, skinTrackers, mealPlanners,
    achatsMensuels, abonnements, formations, books, screenMedia, accounts,
    links, channels, wishList, achatsCouteux, folders, journalEntries,
    streakCount, monthlyGoals, editorialEvents, notificationInterval
  ]);

  // --- INDEXEDDB SYNC EFFECTS ---
  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_habits_v2", dailyHabits);
    }
  }, [dailyHabits, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_habit_history_v2", habitHistory);
    }
  }, [habitHistory, isDbLoaded]);

  // Sync today's active habits state to the persistent habitHistory
  useEffect(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const completedIds = dailyHabits.filter(h => h.completed).map(h => h.id);
    setHabitHistory(prev => {
      const currentToday = prev[todayStr] || [];
      if (JSON.stringify([...currentToday].sort()) === JSON.stringify([...completedIds].sort())) {
        return prev;
      }
      return {
        ...prev,
        [todayStr]: completedIds
      };
    });
  }, [dailyHabits]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_weekly_objectives_v2", weeklyObjectives);
    }
  }, [weeklyObjectives, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_transactions_v2", transactions);
    }
  }, [transactions, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_stocks_v2", stocks);
    }
  }, [stocks, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_budgets_v2", budgets);
    }
  }, [budgets, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_salaires_v2", salaires);
    }
  }, [salaires, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_epargnes_v2", epargnes);
    }
  }, [epargnes, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_actions30_v2", actions30Jours);
    }
  }, [actions30Jours, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_profil_v2", profilAmeliorations);
    }
  }, [profilAmeliorations, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_possibilites_v2", possibilitesGoals);
    }
  }, [possibilitesGoals, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_skin_v2", skinTrackers);
    }
  }, [skinTrackers, isDbLoaded]);

  // Sync state configurations to the Web Worker whenever settings change
  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "CONFIGURE",
        data: {
          driveToken: driveAccessToken || getDriveAccessToken(),
          driveAutoSync,
        },
      });
    }
  }, [driveAccessToken, driveAutoSync]);

  // Send state updates to the Web Worker for background debouncing and serialization
  useEffect(() => {
    if (isInternalStateUpdateRef.current || !workerRef.current) {
      return;
    }
    const payload = getCurrentStatePayload();
    workerRef.current.postMessage({
      type: "UPDATE_PAYLOAD",
      data: payload,
    });
  }, [
    dailyHabits, weeklyObjectives, transactions, stocks, budgets, salaires,
    epargnes, actions30Jours, profilAmeliorations, skinTrackers, mealPlanners,
    achatsMensuels, abonnements, formations, books, screenMedia, accounts,
    links, channels, wishList, achatsCouteux, folders, journalEntries,
    streakCount, monthlyGoals, editorialEvents, notificationInterval
  ]);

  // Refs for tracking previous states to prevent bidirectional sync infinite loops
  const prevSportExercisesRef = useRef(sportExercises);
  const prevSportDailyHabitsRef = useRef(dailyHabits);
  const prevSkinTrackersRef = useRef(skinTrackers);
  const prevSkinDailyHabitsRef = useRef(dailyHabits);

  // Synchronisation bidirectionnelle : Skin Tracker <-> Habit Tracker
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    const skinHabit = dailyHabits.find(h => h.id === "h5" || h.name.toLowerCase().includes("skin care") || h.name.toLowerCase().includes("routine de soins"));
    const prevSkinHabit = prevSkinDailyHabitsRef.current.find(h => h.id === "h5" || h.name.toLowerCase().includes("skin care") || h.name.toLowerCase().includes("routine de soins"));

    const isHabitCompleted = skinHabit?.completed ?? false;
    const wasHabitCompleted = prevSkinHabit?.completed ?? false;

    const todayEntry = skinTrackers.find(entry => entry.date === todayStr);
    const prevTodayEntry = prevSkinTrackersRef.current.find(entry => entry.date === todayStr);

    const isSkinCompleted = todayEntry ? (todayEntry.morningRoutine || todayEntry.eveningRoutine) : false;
    const wasSkinCompleted = prevTodayEntry ? (prevTodayEntry.morningRoutine || prevTodayEntry.eveningRoutine) : false;

    const skinTrackersChanged = JSON.stringify(skinTrackers) !== JSON.stringify(prevSkinTrackersRef.current);
    const habitChanged = isHabitCompleted !== wasHabitCompleted;

    if (skinTrackersChanged && !habitChanged) {
      // User interacted with skin tracker, sync to habit
      if (skinHabit && isHabitCompleted !== isSkinCompleted) {
        setDailyHabits(prev => prev.map(h => h.id === skinHabit.id ? { ...h, completed: isSkinCompleted } : h));
      }
    } else if (habitChanged && !skinTrackersChanged) {
      // User interacted with habit, sync to skin tracker
      if (isHabitCompleted !== isSkinCompleted) {
        if (isHabitCompleted) {
          setSkinTrackers(prev => {
            const existing = prev.find(e => e.date === todayStr);
            if (existing) {
              if (!existing.morningRoutine && !existing.eveningRoutine) {
                return prev.map(e => e.date === todayStr ? { ...e, morningRoutine: true } : e);
              }
              return prev;
            } else {
              const newEntry = {
                id: "sk_" + Date.now(),
                date: todayStr,
                morningRoutine: true,
                eveningRoutine: false,
                skinCondition: "Bonne" as const,
                productsUsed: "Routine soins (Auto-sync)",
                waterIntakeLiters: 1.5
              };
              return [newEntry, ...prev];
            }
          });
        } else {
          setSkinTrackers(prev => {
            const existing = prev.find(e => e.date === todayStr);
            if (existing && (existing.morningRoutine || existing.eveningRoutine)) {
              return prev.map(e => e.date === todayStr ? { ...e, morningRoutine: false, eveningRoutine: false } : e);
            }
            return prev;
          });
        }
      }
    }

    prevSkinTrackersRef.current = skinTrackers;
    prevSkinDailyHabitsRef.current = dailyHabits;
  }, [skinTrackers, dailyHabits]);

  // Synchronisation bidirectionnelle : Sport Exercises <-> Habit Tracker
  useEffect(() => {
    const sportHabit = dailyHabits.find(h => h.id === "h3" || h.name.toLowerCase().includes("sport"));
    const prevSportHabit = prevSportDailyHabitsRef.current.find(h => h.id === "h3" || h.name.toLowerCase().includes("sport"));

    const isHabitCompleted = sportHabit?.completed ?? false;
    const wasHabitCompleted = prevSportHabit?.completed ?? false;

    const isAnyExerciseDone = sportExercises.some(ex => ex.completed);
    const wasAnyExerciseDone = prevSportExercisesRef.current.some(ex => ex.completed);

    const exercisesChanged = JSON.stringify(sportExercises) !== JSON.stringify(prevSportExercisesRef.current);
    const habitChanged = isHabitCompleted !== wasHabitCompleted;

    if (exercisesChanged && !habitChanged) {
      // User interacted with exercises, sync to habit
      if (sportHabit && isHabitCompleted !== isAnyExerciseDone) {
        setDailyHabits(prev => prev.map(h => h.id === sportHabit.id ? { ...h, completed: isAnyExerciseDone } : h));
      }
    } else if (habitChanged && !exercisesChanged) {
      // User interacted with habit, sync to exercises
      if (isHabitCompleted !== isAnyExerciseDone) {
        setSportExercises(prev => prev.map(ex => ({ ...ex, completed: isHabitCompleted })));
      }
    }

    prevSportExercisesRef.current = sportExercises;
    prevSportDailyHabitsRef.current = dailyHabits;
  }, [sportExercises, dailyHabits]);

  // Synchronisation : Sport Exercises -> Sport History pour aujourd'hui
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const isTodayActive = sportExercises.some(ex => ex.completed);
    
    setSportHistory(prev => {
      const exists = prev.includes(todayStr);
      if (isTodayActive && !exists) {
        return [...prev, todayStr];
      } else if (!isTodayActive && exists) {
        return prev.filter(d => d !== todayStr);
      }
      return prev;
    });
  }, [sportExercises]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_sport_exercises", sportExercises);
    }
  }, [sportExercises, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_meal_v2", mealPlanners);
    }
  }, [mealPlanners, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("la_focus_mode", focusMode);
    }
  }, [focusMode, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_achats_v2", achatsMensuels);
    }
  }, [achatsMensuels, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_abonnements_v2", abonnements);
    }
  }, [abonnements, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_formations_v2", formations);
    }
  }, [formations, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_books_v3", books);
    }
  }, [books, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_screenmedia_v3", screenMedia);
    }
  }, [screenMedia, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_accounts_v2", accounts);
    }
  }, [accounts, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_links_v2", links);
    }
  }, [links, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_channels_v2", channels);
    }
  }, [channels, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_wishlist_v2", wishList);
    }
  }, [wishList, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_achats_couteux_v2", achatsCouteux);
    }
  }, [achatsCouteux, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_streak_count_v2", streakCount);
    }
  }, [streakCount, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_monthly_goals_v2", monthlyGoals);
    }
  }, [monthlyGoals, isDbLoaded]);

  useEffect(() => {
    if (isDbLoaded && !isInternalStateUpdateRef.current) {
      dbStore.setItem("mp_editorial_events_v2", editorialEvents);
    }
  }, [editorialEvents, isDbLoaded]);




  // --- UTILITY ACTION HANDLERS ---

  const forceManualBackup = async () => {
    try {
      await Promise.all([
        dbStore.setItem("mp_habits_v2", dailyHabits),
        dbStore.setItem("mp_habit_history_v2", habitHistory),
        dbStore.setItem("mp_weekly_objectives_v2", weeklyObjectives),
        dbStore.setItem("mp_transactions_v2", transactions),
        dbStore.setItem("mp_stocks_v2", stocks),
        dbStore.setItem("mp_budgets_v2", budgets),
        dbStore.setItem("mp_salaires_v2", salaires),
        dbStore.setItem("mp_epargnes_v2", epargnes),
        dbStore.setItem("mp_actions30_v2", actions30Jours),
        dbStore.setItem("mp_profil_v2", profilAmeliorations),
        dbStore.setItem("mp_possibilites_v2", possibilitesGoals),
        dbStore.setItem("mp_skin_v2", skinTrackers),
        dbStore.setItem("mp_sport_exercises", sportExercises),
        dbStore.setItem("mp_sport_history", sportHistory),
        dbStore.setItem("mp_meal_v2", mealPlanners),
        dbStore.setItem("la_focus_mode", focusMode),
        dbStore.setItem("mp_achats_v2", achatsMensuels),
        dbStore.setItem("mp_abonnements_v2", abonnements),
        dbStore.setItem("mp_formations_v2", formations),
        dbStore.setItem("mp_books_v3", books),
        dbStore.setItem("mp_screenmedia_v3", screenMedia),
        dbStore.setItem("mp_accounts_v2", accounts),
        dbStore.setItem("mp_links_v2", links),
        dbStore.setItem("mp_channels_v2", channels),
        dbStore.setItem("mp_wishlist_v2", wishList),
        dbStore.setItem("mp_achats_couteux_v2", achatsCouteux),
        dbStore.setItem("mp_streak_count_v2", streakCount),
        dbStore.setItem("mp_monthly_goals_v2", monthlyGoals),
        dbStore.setItem("mp_editorial_events_v2", editorialEvents),
        dbStore.setItem("mp_project_folders_v1", folders),
        dbStore.setItem("mp_notified_habits", notifiedHabitsRef.current),
        dbStore.setItem("mp_notification_interval", notificationInterval)
      ]);
      
      triggerToast("📁 Toutes les données ont été sauvegardées dans IndexedDB avec succès !", "success");
    } catch (error) {
      console.error("Manual backup failed:", error);
      triggerToast("❌ Échec de la sauvegarde locale des données.", "error");
    }
  };

  // --- CLOUD SYNC ENGINE (FIREBASE PERSISTENCE WITH LOCALSTORAGE FALLBACK) ---
  const getCurrentStatePayload = () => {
    const savedTimestampsStr = localStorage.getItem("la_module_timestamps") || "{}";
    const moduleTimestamps = JSON.parse(savedTimestampsStr);
    return {
      dailyHabits,
      habitHistory,
      weeklyObjectives,
      transactions,
      stocks,
      budgets,
      salaires,
      epargnes,
      actions30Jours,
      profilAmeliorations,
      possibilitesGoals,
      skinTrackers,
      sportExercises,
      sportHistory,
      mealPlanners,
      focusMode,
      achatsMensuels,
      abonnements,
      formations,
      books,
      screenMedia,
      accounts,
      links,
      channels,
      wishList,
      achatsCouteux,
      streakCount,
      monthlyGoals,
      editorialEvents,
      folders,
      journalEntries,
      notificationInterval,
      moduleTimestamps
    };
  };

  const loadStatePayload = (payload: any) => {
    if (!payload) return;
    isInternalStateUpdateRef.current = true;
    try {
      if (payload.moduleTimestamps) {
        localStorage.setItem("la_module_timestamps", JSON.stringify(payload.moduleTimestamps));
      }
      if (payload.dailyHabits) setDailyHabits(payload.dailyHabits);
      if (payload.habitHistory) setHabitHistory(payload.habitHistory);
      if (payload.weeklyObjectives) setWeeklyObjectives(payload.weeklyObjectives);
      if (payload.transactions) setTransactions(payload.transactions);
      if (payload.stocks) setStocks(payload.stocks);
      if (payload.budgets) setBudgets(payload.budgets);
      if (payload.salaires) setSalaires(payload.salaires);
      if (payload.epargnes) setEpargnes(payload.epargnes);
      if (payload.actions30Jours) setActions30Jours(payload.actions30Jours);
      if (payload.profilAmeliorations) setProfilAmeliorations(payload.profilAmeliorations);
      if (payload.possibilitesGoals) setPossibilitesGoals(payload.possibilitesGoals);
      if (payload.skinTrackers) setSkinTrackers(payload.skinTrackers);
      if (payload.sportExercises) setSportExercises(payload.sportExercises);
      if (payload.sportHistory) setSportHistory(payload.sportHistory);
      if (payload.mealPlanners) setMealPlanners(payload.mealPlanners);
      if (payload.focusMode !== undefined) setFocusMode(payload.focusMode);
      if (payload.achatsMensuels) setAchatsMensuels(payload.achatsMensuels);
      if (payload.abonnements) setAbonnements(payload.abonnements);
      if (payload.formations) setFormations(payload.formations);
      if (payload.books) setBooks(payload.books);
      if (payload.screenMedia) setScreenMedia(payload.screenMedia);
      if (payload.accounts) setAccounts(payload.accounts);
      if (payload.links) setLinks(payload.links);
      if (payload.channels) setChannels(payload.channels);
      if (payload.wishList) setWishList(payload.wishList);
      if (payload.achatsCouteux) setAchatsCouteux(payload.achatsCouteux);
      if (payload.streakCount !== undefined) setStreakCount(payload.streakCount);
      if (payload.monthlyGoals) setMonthlyGoals(payload.monthlyGoals);
      if (payload.editorialEvents) setEditorialEvents(payload.editorialEvents);
      if (payload.folders) setFolders(payload.folders);
      if (payload.journalEntries) setJournalEntries(payload.journalEntries);
      if (payload.notificationInterval !== undefined) setNotificationInterval(payload.notificationInterval);
    } catch (err) {
      console.error("Failed to unpack cloud sync payload:", err);
    } finally {
      setTimeout(() => {
        isInternalStateUpdateRef.current = false;
      }, 1000);
    }
  };

  const checkIfHasLocalUserData = () => {
    const keysToCheck = [
      "mp_habits_v2",
      "mp_transactions_v2",
      "mp_weekly_objectives_v2",
      "mp_stocks_v2",
      "mp_budgets_v2",
      "mp_salaires_v2",
      "mp_epargnes_v2",
      "mp_actions30_v2",
      "mp_profil_v2",
      "mp_possibilites_v2",
      "mp_skin_v2",
      "mp_sport_exercises",
      "mp_meal_v2",
      "mp_achats_v2",
      "mp_abonnements_v2",
      "mp_formations_v2",
      "mp_books_v3",
      "mp_screenmedia_v3",
      "mp_accounts_v2",
      "mp_links_v2",
      "mp_channels_v2",
      "mp_wishlist_v2",
      "mp_achats_couteux_v2",
      "mp_monthly_goals_v2",
      "mp_project_folders_v1",
      "life_architect_journal"
    ];
    return keysToCheck.some(key => {
      const val = localStorage.getItem(key);
      return val !== null && val !== "" && val !== "[]" && val !== "{}";
    });
  };

  // Auth State Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      if (user) {
        const syncPref = localStorage.getItem("la_cloud_sync_enabled");
        const shouldEnable = syncPref !== "false"; // Default to true if not explicitly turned off
        
        if (shouldEnable) {
          setCloudSyncEnabled(true);
          localStorage.setItem("la_cloud_sync_enabled", "true");
        } else {
          setSyncStatus("local");
        }
      } else {
        setSyncStatus("local");
      }
    }, (error) => {
      console.error("🚨 [onAuthStateChanged - Firebase Auth Error] :", error);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Realtime Firestore Listener for cross-browser & multi-device synchronization
  useEffect(() => {
    if (!firebaseUser || !cloudSyncEnabled) return;

    setSyncStatus("syncing");
    const docRef = doc(db, "user_sync", firebaseUser.uid);
    let isFirstSnapshot = true;

    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      // Ignore local optimistic writes (changes originating from setDoc on this client)
      if (docSnap.metadata.hasPendingWrites) {
        return;
      }

      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && data.payload) {
          const firebaseTime = data.updatedAt?.toDate?.() || new Date();

          if (isFirstSnapshot) {
            isFirstSnapshot = false;
            const hasLocalData = checkIfHasLocalUserData();
            const localTimeStr = localStorage.getItem("la_last_local_update_time");
            const localTime = (hasLocalData && localTimeStr) ? new Date(localTimeStr) : null;

            // Conflict check: Only if local device has offline changes strictly newer than Cloud by > 5 seconds
            if (localTime && firebaseTime && localTime.getTime() > firebaseTime.getTime() + 5000) {
              const localPayload = getCurrentStatePayload();
              setSyncConflict({
                localTime,
                cloudTime: firebaseTime,
                localPayload,
                cloudPayload: data.payload,
                onResolve: (choice) => {
                  if (choice === "merge") {
                    const { mergedPayload, mergedModules } = mergePayloads(localPayload, data.payload);
                    loadStatePayload(mergedPayload);
                    setSyncStatus("syncing");
                    setDoc(docRef, {
                      userId: firebaseUser.uid,
                      updatedAt: new Date(),
                      payload: mergedPayload
                    }).then(() => {
                      setLastSyncedTime(new Date());
                      setSyncStatus("synced");
                      triggerToast(`🔄 Fusion réussie ! ${mergedModules.length} modules mis à jour depuis le Cloud.`, "success");
                    }).catch(err => {
                      console.error("❌ Échec de la sauvegarde fusionnée vers le Cloud :", err);
                      setSyncStatus("error");
                    });
                  } else if (choice === "cloud") {
                    loadStatePayload(data.payload);
                    setLastSyncedTime(firebaseTime);
                    setSyncStatus("synced");
                    triggerToast("☁️ Données du Cloud chargées avec succès !", "success");
                  } else {
                    setSyncStatus("syncing");
                    setDoc(docRef, {
                      userId: firebaseUser.uid,
                      updatedAt: new Date(),
                      payload: localPayload
                    }).then(() => {
                      setLastSyncedTime(new Date());
                      setSyncStatus("synced");
                      triggerToast("☁️ Données locales envoyées sur le Cloud !", "success");
                    }).catch(err => {
                      console.error("❌ Échec lors de la résolution du conflit vers le Cloud :", err);
                      setSyncStatus("error");
                    });
                  }
                  setSyncConflict(null);
                }
              });
              return;
            }
          }

          loadStatePayload(data.payload);
          setLastSyncedTime(firebaseTime);
          setSyncStatus("synced");
        }
      } else {
        // Doc does not exist on Cloud yet -> Upload initial local state
        if (isFirstSnapshot) {
          isFirstSnapshot = false;
          const payload = getCurrentStatePayload();
          setDoc(docRef, {
            userId: firebaseUser.uid,
            updatedAt: new Date(),
            payload: payload
          }).then(() => {
            setLastSyncedTime(new Date());
            setSyncStatus("synced");
            triggerToast("☁️ Compte cloud configuré et synchronisé avec succès !", "success");
          }).catch(err => {
            console.error("❌ Initial cloud document creation failed:", err);
            setSyncStatus("error");
          });
        }
      }
    }, (error) => {
      if (isOfflineError(error)) {
        setSyncStatus("local");
      } else {
        console.error("❌ [onSnapshot Sync Error] :", error);
        setSyncStatus("error");
      }
    });

    return () => {
      unsubscribe();
    };
  }, [firebaseUser, cloudSyncEnabled]);

  // Save Data to Firebase Firestore
  const saveDataToFirebase = async () => {
    if (!auth.currentUser) return;
    setIsSyncing(true);
    setSyncStatus("syncing");
    try {
      const payload = getCurrentStatePayload();
      const docRef = doc(db, "user_sync", auth.currentUser.uid);
      await setDoc(docRef, {
        userId: auth.currentUser.uid,
        updatedAt: new Date(),
        payload: payload
      });
      setLastSyncedTime(new Date());
      setSyncStatus("synced");
    } catch (error: any) {
      if (isOfflineError(error)) {
        console.warn("⚠️ Échec de la sauvegarde cloud (hors-ligne). Sauvegarde locale active.");
        setSyncStatus("local");
        triggerToast("🌐 Hors-ligne : Sauvegardé en local.", "info");
      } else {
        console.error("Firebase auto-sync failed:", error);
        setSyncStatus("error");
        try {
          handleFirestoreError(error, OperationType.WRITE, `user_sync/${auth.currentUser?.uid}`);
        } catch (e) {}
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // Debounced auto-sync hook on state mutations
  useEffect(() => {
    // CRITICAL: Prevent auto-sync only during initial state loading, internal updates, or if we are actively syncing
    if (!cloudSyncEnabled || !firebaseUser || syncStatus === "syncing" || isInternalStateUpdateRef.current) return;
    
    const delayDebounceFn = setTimeout(() => {
      saveDataToFirebase();
    }, 3000); // 3 seconds debounce
    
    return () => clearTimeout(delayDebounceFn);
  }, [
    dailyHabits, weeklyObjectives, transactions, stocks, budgets, salaires,
    epargnes, actions30Jours, profilAmeliorations, skinTrackers, mealPlanners,
    achatsMensuels, abonnements, formations, books, screenMedia, accounts,
    links, channels, wishList, achatsCouteux, folders, journalEntries,
    cloudSyncEnabled, firebaseUser
  ]);

  // Online / Reconnection Auto-Sync listener
  useEffect(() => {
    const handleOnline = () => {
      console.log("🌐 [Firebase Sync] Connexion réseau restaurée ! Tentative de synchronisation des données...");
      if (firebaseUser && cloudSyncEnabled) {
        saveDataToFirebase();
      }
    };
    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, [firebaseUser, cloudSyncEnabled]);
  const handleToggleCloudSync = async (enabled: boolean) => {
    if (enabled) {
      try {
        let currentUser = firebaseUser;
        if (currentUser) {
          setIsSyncing(true);
          setSyncStatus("syncing");
          const docRef = doc(db, "user_sync", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data && data.payload) {
              const firebaseTime = data.updatedAt?.toDate() || new Date();
              
              // Only detect conflict if this device actually contains user data
              const hasLocalData = checkIfHasLocalUserData();
              const localTimeStr = localStorage.getItem("la_last_local_update_time");
              const localTime = (hasLocalData && localTimeStr) ? new Date(localTimeStr) : null;

              // Check version compatibility and conflicts
              if (localTime && firebaseTime && localTime.getTime() > firebaseTime.getTime() + 5000) {
                const localPayload = getCurrentStatePayload();
                setSyncConflict({
                  localTime,
                  cloudTime: firebaseTime,
                  localPayload,
                  cloudPayload: data.payload,
                  onResolve: (choice) => {
                    if (choice === "merge") {
                      const { mergedPayload, mergedModules } = mergePayloads(localPayload, data.payload);
                      loadStatePayload(mergedPayload);
                      setSyncStatus("syncing");
                      setDoc(docRef, {
                        userId: currentUser.uid,
                        updatedAt: new Date(),
                        payload: mergedPayload
                      }).then(() => {
                        setLastSyncedTime(new Date());
                        setCloudSyncEnabled(true);
                        localStorage.setItem("la_cloud_sync_enabled", "true");
                        setSyncStatus("synced");
                        triggerToast(`🔄 Fusion réussie ! ${mergedModules.length} modules mis à jour.`, "success");
                      }).catch(err => {
                        console.error("Conflict resolve merge upload failed:", err);
                        setSyncStatus("error");
                      });
                    } else if (choice === "cloud") {
                      loadStatePayload(data.payload);
                      setLastSyncedTime(firebaseTime);
                      setCloudSyncEnabled(true);
                      localStorage.setItem("la_cloud_sync_enabled", "true");
                      setSyncStatus("synced");
                      triggerToast("☁️ Synchronisation activée. Données chargées depuis le cloud !", "success");
                    } else {
                      // Keep local and overwrite the cloud with it
                      setSyncStatus("syncing");
                      setDoc(docRef, {
                        userId: currentUser.uid,
                        updatedAt: new Date(),
                        payload: localPayload
                      }).then(() => {
                        setLastSyncedTime(new Date());
                        setCloudSyncEnabled(true);
                        localStorage.setItem("la_cloud_sync_enabled", "true");
                        setSyncStatus("synced");
                        triggerToast("☁️ Synchronisation activée. Données locales envoyées sur le cloud !", "success");
                      }).catch(err => {
                        console.error("Conflict resolve local upload failed:", err);
                        setSyncStatus("error");
                      });
                    }
                    setSyncConflict(null);
                  }
                });
              } else {
                loadStatePayload(data.payload);
                setLastSyncedTime(firebaseTime);
                setCloudSyncEnabled(true);
                localStorage.setItem("la_cloud_sync_enabled", "true");
                setSyncStatus("synced");
                triggerToast("☁️ Synchronisation activée. Données chargées depuis le cloud !", "success");
              }
            }
          } else {
            // New user on cloud, push local data as base
            const payload = getCurrentStatePayload();
            await setDoc(docRef, {
              userId: currentUser.uid,
              updatedAt: new Date(),
              payload: payload
            });
            setLastSyncedTime(new Date());
            setCloudSyncEnabled(true);
            localStorage.setItem("la_cloud_sync_enabled", "true");
            setSyncStatus("synced");
            triggerToast("☁️ Synchronisation activée. Données locales envoyées sur le cloud !", "success");
          }
        }
      } catch (error: any) {
        if (isOfflineError(error)) {
          console.warn("⚠️ Impossible d'activer la synchronisation en mode hors-ligne.");
          triggerToast("🌐 Hors-ligne : Connexion réseau requise pour activer la synchronisation.", "error");
          setSyncStatus("local");
        } else {
          console.error("Enabling cloud sync failed:", error);
          triggerToast("❌ Impossible d'activer la synchronisation.", "error");
          setSyncStatus("error");
          try {
            handleFirestoreError(error, OperationType.WRITE, `user_sync/${firebaseUser?.uid}`);
          } catch (e) {}
        }
      } finally {
        setIsSyncing(false);
      }
    } else {
      setCloudSyncEnabled(false);
      localStorage.setItem("la_cloud_sync_enabled", "false");
      triggerToast("📁 Synchronisation désactivée. Sauvegarde locale active.", "info");
      setSyncStatus("local");
    }
  };

  // Manual Force Sync handler
  const handleForceSync = async () => {
    if (!firebaseUser) {
      triggerToast("⚠️ Veuillez connecter votre compte d'abord.", "info");
      return;
    }
    setIsSyncing(true);
    setSyncStatus("syncing");
    try {
      await saveDataToFirebase();
      triggerToast("☁️ Données synchronisées avec succès sur Firebase !", "success");
    } catch (error: any) {
      if (isOfflineError(error)) {
        console.warn("⚠️ Échec de la synchronisation forcée (hors-ligne).");
        triggerToast("🌐 Hors-ligne : Impossible de forcer la synchronisation.", "error");
        setSyncStatus("local");
      } else {
        console.error("Force sync failed:", error);
        triggerToast("❌ Échec de la synchronisation cloud forcée.", "error");
        setSyncStatus("error");
      }
    } finally {
      setIsSyncing(false);
    }
  };

  // --- GOOGLE DRIVE SYNC ENGINE HANDLERS ---
  const handleConnectDrive = async () => {
    setIsDriveLoading(true);
    try {
      const result = await driveSignIn();
      if (result) {
        setDriveAccessTokenState(result.accessToken);
        triggerToast("✅ Google Drive connecté avec succès !", "success");
      }
    } catch (error) {
      console.error("Failed to connect Drive:", error);
      triggerToast("❌ Échec de la connexion à Google Drive. Veuillez ouvrir l'application dans un nouvel onglet si vous êtes dans un iframe.", "error");
    } finally {
      setIsDriveLoading(false);
    }
  };

  const handleDisconnectDrive = () => {
    logoutDrive();
    setDriveAccessTokenState(null);
    setDriveAutoSync(false);
    localStorage.removeItem("la_drive_auto_sync");
    triggerToast("ℹ️ Google Drive déconnecté.", "info");
  };

  const handleToggleDriveAutoSync = (enabled: boolean) => {
    setDriveAutoSync(enabled);
    localStorage.setItem("la_drive_auto_sync", enabled ? "true" : "false");
    triggerToast(
      enabled 
        ? "🚀 Synchronisation automatique Google Drive activée (sauvegarde toutes les 15s après modifs) !" 
        : "ℹ️ Synchronisation automatique Google Drive désactivée.", 
      "info"
    );
  };

  const handleBackupToDrive = async (isSilent = false) => {
    const token = driveAccessToken || getDriveAccessToken();
    if (!token) {
      if (!isSilent) {
        triggerToast("⚠️ Veuillez connecter votre Google Drive d'abord.", "error");
      }
      return;
    }
    
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: "FORCE_BACKUP",
        data: { target: "drive" }
      });
    }
  };

  const handleRestoreFromDrive = async () => {
    const token = driveAccessToken || getDriveAccessToken();
    if (!token) {
      triggerToast("⚠️ Veuillez connecter votre Google Drive d'abord.", "error");
      return;
    }
    
    const confirmRestore = window.confirm(
      "Êtes-vous sûr de vouloir restaurer les données depuis Google Drive ? Vos données actuelles seront remplacées par la version de sauvegarde de votre Google Drive."
    );
    if (!confirmRestore) return;

    setIsDriveLoading(true);
    try {
      const payload = await loadFromDrive(token);
      if (payload) {
        loadStatePayload(payload);
        triggerToast("🔄 Données restaurées avec succès depuis Google Drive !", "success");
      } else {
        triggerToast("ℹ️ Aucun fichier de sauvegarde trouvé sur votre Google Drive.", "error");
      }
    } catch (error) {
      console.error("Restore from Google Drive failed:", error);
      triggerToast("❌ Échec de la restauration depuis Google Drive.", "error");
    } finally {
      setIsDriveLoading(false);
    }
  };

  // Listen to Google Drive auth changes
  useEffect(() => {
    const unsubscribe = initDriveAuth(
      (user, token) => {
        setDriveAccessTokenState(token);
      },
      () => {
        setDriveAccessTokenState(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // --- AUTOMATIC IMPORT ON SITE ACCESS & MIDNIGHT REFRESH ---
  const autoImportRanRef = useRef(false);

  // 1. Auto-import from Google Drive immediately upon accessing the app
  useEffect(() => {
    if (!isDbLoaded || !isUnlocked || autoImportRanRef.current) return;
    
    const token = driveAccessToken || getDriveAccessToken();
    if (token) {
      autoImportRanRef.current = true;
      setIsDriveLoading(true);
      loadFromDrive(token)
        .then((payload) => {
          if (payload) {
            loadStatePayload(payload);
            triggerToast("⚡ Importation & Synchronisation automatique Google Drive au lancement !", "success");
          }
        })
        .catch((err) => {
          console.warn("Auto-import from Google Drive on startup failed or skipped:", err);
        })
        .finally(() => {
          setIsDriveLoading(false);
        });
    }
  }, [isDbLoaded, isUnlocked, driveAccessToken]);

  // 2. Midnight Refresh & Sync (runs every day after 00:00:00)
  useEffect(() => {
    if (!isDbLoaded || !isUnlocked) return;

    const performMidnightRefresh = async () => {
      const todayStr = new Date().toISOString().slice(0, 10);
      const lastRefresh = localStorage.getItem("la_last_midnight_refresh_date");

      if (lastRefresh && lastRefresh !== todayStr) {
        console.log("🌙 Midnight date rollover detected! Executing daily auto-refresh...");
        localStorage.setItem("la_last_midnight_refresh_date", todayStr);

        const token = driveAccessToken || getDriveAccessToken();
        if (token) {
          try {
            const payload = await loadFromDrive(token);
            if (payload) {
              loadStatePayload(payload);
              triggerToast("🌙 Nouveau jour : Données réactualisées automatiquement depuis Google Drive !", "success");
            }
          } catch (err) {
            console.warn("Midnight Drive auto-refresh failed:", err);
          }
        } else {
          triggerToast("🌙 Nouveau jour : Bienvenue ! Actualisation automatique du tableau de bord effectuée.", "info");
        }
      } else if (!lastRefresh) {
        localStorage.setItem("la_last_midnight_refresh_date", todayStr);
      }
    };

    performMidnightRefresh();

    // Schedule next midnight trigger
    const now = new Date();
    const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 2);
    const msToMidnight = nextMidnight.getTime() - now.getTime();

    const midnightTimer = setTimeout(() => {
      performMidnightRefresh();
    }, msToMidnight);

    return () => clearTimeout(midnightTimer);
  }, [isDbLoaded, isUnlocked, driveAccessToken]);



  // Habit toggling
  const toggleHabit = (id: string) => {
    setDailyHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  // Weekly objective handlers
  const [newObjectiveText, setNewObjectiveText] = useState("");
  const [newObjectiveIsPriority, setNewObjectiveIsPriority] = useState(false);
  
  const handleAddObjectiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjectiveText.trim()) return;
    const newObj: WeeklyObjective = {
      id: "obj_" + Date.now(),
      text: newObjectiveText.trim(),
      completed: false,
      isPriority: newObjectiveIsPriority
    };
    setWeeklyObjectives(prev => [...prev, newObj]);
    setNewObjectiveText("");
    setNewObjectiveIsPriority(false);
  };

  const toggleWeeklyObjective = (id: string) => {
    setWeeklyObjectives(prev => prev.map(o => o.id === id ? { ...o, completed: !o.completed } : o));
  };

  const toggleWeeklyObjectivePriority = (id: string) => {
    setWeeklyObjectives(prev => prev.map(o => o.id === id ? { ...o, isPriority: !o.isPriority } : o));
  };

  const deleteWeeklyObjective = (id: string) => {
    setWeeklyObjectives(prev => prev.filter(o => o.id !== id));
  };

  // Reset daily routines
  const resetDailyRoutines = () => {
    setDailyHabits(prev => prev.map(h => ({ ...h, completed: false })));
    setStreakCount(prev => prev + 1);
  };

  // Handler for Calendar Habit Toggle for any Date
  const handleToggleHabitForDate = (habitId: string, dateStr: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (dateStr === todayStr) {
      setDailyHabits(prev => prev.map(h => h.id === habitId ? { ...h, completed: !h.completed } : h));
    } else {
      setHabitHistory(prev => {
        const existing = prev[dateStr] || [];
        const isDone = existing.includes(habitId);
        const next = isDone ? existing.filter(id => id !== habitId) : [...existing, habitId];
        return { ...prev, [dateStr]: next };
      });
    }
  };

  // Handler for Calendar Skincare Routine Toggle for any Date
  const handleToggleSkinRoutineForDate = (dateStr: string, timeOfDay: "morning" | "evening") => {
    setSkinTrackers(prev => {
      const existing = prev.find(s => s.date === dateStr);
      if (existing) {
        return prev.map(s => s.date === dateStr ? {
          ...s,
          morningRoutine: timeOfDay === "morning" ? !s.morningRoutine : s.morningRoutine,
          eveningRoutine: timeOfDay === "evening" ? !s.eveningRoutine : s.eveningRoutine
        } : s);
      } else {
        const newEntry: SkinTracker = {
          id: Math.random().toString(36).substr(2, 9),
          date: dateStr,
          morningRoutine: timeOfDay === "morning",
          eveningRoutine: timeOfDay === "evening",
          skinCondition: "Bonne",
          productsUsed: "",
          waterIntakeLiters: 0
        };
        return [newEntry, ...prev];
      }
    });
  };

  // Handler for Folder Objective Toggle
  const handleToggleFolderObjective = (folderId: string, objId: string) => {
    setFolders(prev => prev.map(f => f.id === folderId ? {
      ...f,
      customObjectives: f.customObjectives.map(o => o.id === objId ? { ...o, completed: !o.completed } : o)
    } : f));
  };

  // Handler for Action30Jours Toggle
  const handleToggleAction30Jours = (id: string) => {
    setActions30Jours(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  // Handler for Achat Status Toggle
  const handleToggleAchatStatus = (id: string) => {
    setAchatsMensuels(prev => prev.map(a => a.id === id ? { ...a, status: a.status === "Acheté" ? "À acheter" : "Acheté" } : a));
  };

  // Focus Mode Toggle handler with redirect and state check
  const handleToggleFocusMode = () => {
    const nextVal = !focusMode;
    setFocusMode(nextVal);
    if (nextVal) {
      setDashboardTab("routines");
      const distractingMenuIds = [
        "comptes", "transactions", "stocks", "budgets", "salaires", "epargnes", "charts",
        "achats", "abonnements", "wishlist", "achats_couteux",
        "books", "screenmedia"
      ];
      if (distractingMenuIds.includes(activeMenu)) {
        setActiveMenu("dashboard");
      }
    }
  };

  // Toggle Category Collapsibles
  const toggleCategoryExpand = (catId: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  // Toggle project custom objectives from the main simplified dashboard
  const handleToggleProjectObjective = (folderId: string, objId: string) => {
    setFolders(prev => prev.map(f => {
      if (f.id === folderId) {
        return {
          ...f,
          customObjectives: f.customObjectives.map(o => o.id === objId ? { ...o, completed: !o.completed } : o)
        };
      }
      return f;
    }));
    triggerToast("Tâche de projet mise à jour !", "success");
  };

  // Toggle today's skin routine from main dashboard
  const handleToggleTodaySkinRoutine = (type: "morning" | "evening") => {
    const todayStr = new Date().toISOString().split("T")[0];
    setSkinTrackers(prev => {
      const existing = prev.find(s => s.date === todayStr);
      if (existing) {
        return prev.map(s => s.date === todayStr ? {
          ...s,
          morningRoutine: type === "morning" ? !s.morningRoutine : s.morningRoutine,
          eveningRoutine: type === "evening" ? !s.eveningRoutine : s.eveningRoutine,
        } : s);
      } else {
        const newRecord: SkinTracker = {
          id: Math.random().toString(36).substr(2, 9),
          date: todayStr,
          morningRoutine: type === "morning",
          eveningRoutine: type === "evening",
          skinCondition: "Bonne",
          productsUsed: "",
          waterIntakeLiters: 1.5
        };
        return [newRecord, ...prev];
      }
    });
    triggerToast("Routine de soin mise à jour !", "success");
  };


  // --- DYNAMIC MODULE RENDERING SCHEMA & CONTROLLER MAP ---

  const categories = [
    {
      id: "finance",
      label: "Finance",
      icon: Coins,
      items: [
        { id: "saisie_unifiee", label: "Saisie Unifiée des Flux", icon: Layers, desc: "Guichet unique de saisie avec catégories & sous-catégories détaillées, dispatch automatique vers salaires, abonnements, charges et comptes." },
        { id: "finance_dash", label: "Dashboard Finance", icon: LayoutDashboard, desc: "Indicateurs financiers clés, budgets et analyses." },
        { id: "comptes", label: "Comptes Bancaires", icon: Landmark, desc: "Gestion des comptes pro, perso et liquidités." },
        { id: "budgets", label: "Budgets Mensuels", icon: Landmark, desc: "Gestion de vos plafonds de dépenses par enveloppe." },
        { id: "epargnes", label: "Objectifs Épargne", icon: PiggyBank, desc: "Progression vers vos projets immobiliers ou d'équipements." },
        { id: "stocks", label: "Portefeuille Bourse", icon: Wallet, desc: "Suivi de vos investissements en BVC." },
        { id: "charts", label: "Graphiques & Analyses", icon: BarChart3, desc: "Visualisation complète de votre santé financière." },
        { id: "wishlist", label: "Wish List", icon: Gift, desc: "Objets de désir et grands projets d'achat à long terme." },
        { id: "achats_couteux", label: "Achats Coûteux", icon: Hourglass, desc: "Achats importants de moyenne échelle prévus à moyen terme." }
      ]
    },
    {
      id: "productivity",
      label: "Productivité",
      icon: CheckSquare,
      items: [
        { id: "productivity_dash", label: "Dashboard Productivité", icon: LayoutDashboard, desc: "État de vos habitudes, sprints de combat et objectifs stratégiques." },
        { id: "central_calendar", label: "Calendrier Central", icon: Calendar, desc: "Planning mensuel unifié des tâches, habitudes et rappels financiers." },
        { id: "habits", label: "Habits Tracker", icon: Flame, desc: "Discipline de vie quotidienne et routines d'élite." },
        { id: "actions30", label: "Actions 30 Jours", icon: Calendar, desc: "Sprint de combat de 30 jours pour vos projets pro et perso." },
        { id: "profil", label: "Profil & Compétences", icon: User, desc: "Montée en compétences ciblée pour vos friction areas." },
        { id: "monthly_goals", label: "Objectifs Mensuels", icon: Target, desc: "Cibles de progression mensuelle pour vos finances, projets et vie pro/perso." },
        { id: "journal", label: "Journal de Bord", icon: BookOpen, desc: "Réflexions quotidiennes, pensées et notes de progrès." }
      ]
    },
    {
      id: "health",
      label: "Santé & Soins",
      icon: Heart,
      items: [
        { id: "health_dash", label: "Dashboard Santé & Soins", icon: LayoutDashboard, desc: "Planificateur de repas, routine beauté et sport." },
        { id: "skin", label: "Skin Tracker", icon: Sparkles, desc: "Consistance beauté, SPF et routine cutanée journalière." },
        { id: "meal", label: "Meal Planner", icon: Layers, desc: "Planification des menus, calories et dîners de demain." },
        { id: "sport", label: "Focus Sport", icon: Dumbbell, desc: "Minuterie de 30 min, exercices de sport et playlist d'entraînement." }
      ]
    },
    {
      id: "projets",
      label: "Projets Médias & Digitaux",
      icon: Tv,
      items: [
        { id: "channels", label: "Projets Médias & Digitaux", icon: Tv, desc: "Cours Udemy, produits digitaux, chaînes médias, identifiants, sujets et deadlines." },
        { id: "editorial_calendar", label: "Calendrier de Projets", icon: Calendar, desc: "Calendrier de vos événements, projets de communication et publications." }
      ]
    },
    {
      id: "career_cat",
      label: "Carrière Professionnelle",
      icon: Award,
      items: [
        { id: "career_dash", label: "Dashboard Carrière", icon: LayoutDashboard, desc: "Indicateurs clés de carrière, taux de succès et suivi global." },
        { id: "career_mobility", label: "Mobilité & EPM (Tour de Contrôle)", icon: Compass, desc: "Suivi multi-pays, seuils visa 2026, roadmap et dossiers de mobilité internationale." },
        { id: "career_companies", label: "Entreprises Cibles", icon: Target, desc: "Cartographie et classement des entreprises d'élite visées." },
        { id: "career_sites", label: "Portails Recrutement", icon: Globe, desc: "Plateformes de marché et profils professionnels suivis." },
        { id: "career_skills", label: "Compétences & Dev", icon: Sparkles, desc: "Journal de montée en compétences critiques." },
        { id: "career_certificates", label: "Certificats & Diplômes", icon: CheckCircle, desc: "Suivi des certifications financières et académiques d'élite." }
      ]
    },
    {
      id: "formation",
      label: "Lectures & Écrans",
      icon: BookOpen,
      items: [
        { id: "formation_dash", label: "Dashboard Lectures & Écrans", icon: LayoutDashboard, desc: "Vos lectures en cours et files multimédias." },
        { id: "books", label: "Lectures & Livres", icon: BookOpen, desc: "Suivi détaillé de vos lectures en cours, terminées et wishlist." },
        { id: "screenmedia", label: "Séries, Animes & Films", icon: Film, desc: "File de visionnage et progression d'épisodes de vos écrans." }
      ]
    }
  ];

  const visibleCategories = useMemo(() => {
    if (!focusMode) return categories;
    // Masquer les flux financiers (Finance & Achats) et de divertissement (Lectures & Écrans)
    return categories.filter(cat => cat.id !== "finance" && cat.id !== "formation");
  }, [focusMode, categories]);

  const handleTransferEpargneToAchat = (item: any) => {
    const newAchat: any = {
      id: "gen_" + Date.now() + Math.random().toString(36).substr(2, 5),
      itemName: item.name || "Achat sans nom",
      store: "",
      estimatedPrice: item.targetAmount || 0,
      targetDate: item.deadline || new Date().toISOString().split("T")[0],
      priority: "Secondaire",
      status: item.status === "Atteint" ? "Acheté" : "Économise"
    };

    setAchatsCouteux(prev => [newAchat, ...prev]);
    setEpargnes(prev => prev.filter(e => e.id !== item.id));
    triggerToast(`"${newAchat.itemName}" a été converti en Achat Coûteux avec succès !`, "success");
  };

  const handleTransferAchatToEpargne = (item: any) => {
    const newEpargne: any = {
      id: "gen_" + Date.now() + Math.random().toString(36).substr(2, 5),
      name: item.itemName || "Projet sans nom",
      targetAmount: item.estimatedPrice || 0,
      currentAmount: item.status === "Acheté" ? (item.estimatedPrice || 0) : 0,
      deadline: item.targetDate || new Date().toISOString().split("T")[0],
      status: item.status === "Acheté" ? "Atteint" : "En cours"
    };

    setEpargnes(prev => [newEpargne, ...prev]);
    setAchatsCouteux(prev => prev.filter(a => a.id !== item.id));
    triggerToast(`"${newEpargne.name}" a été converti en Objectif d'Épargne avec succès !`, "success");
  };

  const getModuleConfig = (moduleId: string) => {
    switch (moduleId) {
      case "transactions": {
        const categoryOptions = ["Revenus Pro", "Sponsor", "AdSense", "Équipement", "Repas", "Logiciels", "Alimentation", "Transport", "Loisirs", "Autres"];
        return {
          title: "Transactions Réelles",
          description: "Historique complet de vos entrées d'argent et vos dépenses courantes.",
          data: transactions,
          onAdd: (item: any) => {
            const autoRes = autoCategorizeTransaction(item.description || "", item.type, item.category, categoryOptions);
            const newItem = {
              ...item,
              category: autoRes.category || "Autres"
            };
            setTransactions(prev => [newItem, ...prev]);
            if (autoRes.isSuggested && autoRes.matchedKeyword) {
              triggerToast(`🪄 Catégorie "${autoRes.category}" attribuée d'après "${autoRes.matchedKeyword}" !`, "info");
            }
          },
          onEdit: (id: string, updated: any) => setTransactions(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setTransactions(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => {
            const { updatedTransactions, updatedCount } = bulkAutoCategorizeTransactions(items, categoryOptions);
            setTransactions(prev => [...updatedTransactions, ...prev]);
            if (updatedCount > 0) {
              triggerToast(`🪄 ${updatedCount} transaction(s) ont été catégorisées automatiquement !`, "success");
            }
          },
          columns: [
            { key: "date", label: "Date", type: "date", required: true },
            { key: "description", label: "Description", type: "text", required: true },
            { 
              key: "category", 
              label: "Catégorie", 
              type: "select", 
              options: categoryOptions 
            },
            { key: "type", label: "Type", type: "select", options: ["Revenue", "Dépense"] },
            { key: "amount", label: "Montant (MAD)", type: "number", required: true },
            { key: "account", label: "Compte", type: "text" }
          ] as TableColumn[]
        };
      }

      case "stocks":
        return {
          title: "Portefeuille Actions (BVC)",
          description: "Suivez vos actifs financiers en direct sur la Bourse de Casablanca.",
          data: stocks,
          onAdd: (item: any) => setStocks(prev => [item, ...prev]),
          onEdit: (id: string, updated: any) => setStocks(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setStocks(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setStocks(prev => [...items, ...prev]),
          columns: [
            { key: "symbol", label: "Symbole", type: "text", required: true },
            { key: "name", label: "Nom Action", type: "text", required: true },
            { key: "buyPrice", label: "Prix d'Achat", type: "number", required: true },
            { key: "currentPrice", label: "Prix Actuel", type: "number", required: true },
            { key: "quantity", label: "Quantité", type: "number", required: true },
            { key: "lastUpdated", label: "Mise à jour", type: "date" }
          ] as TableColumn[]
        };

      case "budgets":
        return {
          title: "Budgets par Catégorie",
          description: "Limitez vos dépenses mensuelles par enveloppes budgétaires.",
          data: budgets,
          onAdd: (item: any) => setBudgets(prev => [item, ...prev]),
          onEdit: (id: string, updated: any) => setBudgets(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setBudgets(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setBudgets(prev => [...items, ...prev]),
          columns: [
            { 
              key: "category", 
              label: "Catégorie", 
              type: "select", 
              options: ["Alimentation", "Équipement & Matériel", "Logiciels & SaaS", "Marketing & Publicité", "Transport & Carburant", "Loisirs & Sorties", "Autres"] 
            },
            { key: "limitAmount", label: "Budget Limite (MAD)", type: "number", required: true },
            { key: "spentAmount", label: "Dépensé Réel", type: "number", required: true },
            { key: "period", label: "Période", type: "select", options: ["Mensuel", "Annuel"] }
          ] as TableColumn[]
        };

      case "salaires":
        return {
          title: "Salaire, Revenus & Factures",
          description: "Suivi des revenus professionnels, dividendes et rentrées d'argent.",
          data: salaires,
          onAdd: (item: any) => setSalaires(prev => [item, ...prev]),
          onEdit: (id: string, updated: any) => setSalaires(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setSalaires(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setSalaires(prev => [...items, ...prev]),
          columns: [
            { key: "date", label: "Date de Réception", type: "date", required: true },
            { key: "source", label: "Source / Employeur", type: "text", required: true },
            { key: "grossAmount", label: "Montant Brut", type: "number", required: true },
            { key: "netAmount", label: "Montant Net Reçu", type: "number", required: true },
            { key: "status", label: "Statut", type: "select", options: ["Reçu", "En attente"] }
          ] as TableColumn[]
        };

      case "epargnes":
        return {
          title: "Objectifs d'Épargne",
          description: "Prévoyez vos grands projets de vie (Immobilier, Voyage, Matériel).",
          data: epargnes,
          onAdd: (item: any) => setEpargnes(prev => [item, ...prev]),
          onEdit: (id: string, updated: any) => setEpargnes(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setEpargnes(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setEpargnes(prev => [...items, ...prev]),
          columns: [
            { key: "name", label: "Intitulé du Projet", type: "text", required: true },
            { key: "targetAmount", label: "Montant Cible (MAD)", type: "number", required: true },
            { key: "currentAmount", label: "Montant Actuel", type: "number", required: true },
            { key: "deadline", label: "Échéance Cible", type: "date", required: true },
            { key: "status", label: "Statut", type: "select", options: ["En cours", "Atteint"] }
          ] as TableColumn[]
        };

      case "habits":
        return {
          title: "Tracker de Disciplines & Tâches (Habitudes)",
          description: "Gérez et cochez vos routines journalières, hebdomadaires et mensuelles.",
          data: dailyHabits,
          onAdd: (item: any) => setDailyHabits(prev => [...prev, item]),
          onEdit: (id: string, updated: any) => setDailyHabits(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setDailyHabits(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setDailyHabits(prev => [...prev, ...items]),
          columns: [
            { key: "name", label: "Habitude / Tâche", type: "text", required: true },
            { key: "frequency", label: "Fréquence", type: "select", options: ["Quotidien", "Hebdomadaire", "Mensuel"] },
            { key: "description", label: "Description / Détails", type: "text" },
            { key: "category", label: "Catégorie", type: "select", options: ["Health", "Career", "Mental", "Personal", "Finance"] },
            { key: "isImportant", label: "Importante", type: "boolean" },
            { key: "dueTime", label: "Heure Limite (ex: 12:00)", type: "text" },
            { key: "completed", label: "Fait Aujourd'hui", type: "boolean" }
          ] as TableColumn[]
        };

      case "actions30":
        return {
          title: "Actions 30 Jours (Sprint)",
          description: "Plan d'attaque quotidien intensif de 30 jours pour lancer un projet professionnel ou personnel majeur.",
          data: actions30Jours,
          onAdd: (item: any) => setActions30Jours(prev => [...prev, item]),
          onEdit: (id: string, updated: any) => setActions30Jours(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setActions30Jours(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setActions30Jours(prev => [...prev, ...items]),
          columns: [
            { key: "dayNumber", label: "Jour de Sprint", type: "number", required: true },
            { key: "taskDescription", label: "Tâche de Combat", type: "text", required: true },
            { key: "completed", label: "Terminé", type: "boolean" },
            { key: "note", label: "Livrable / Note", type: "text" }
          ] as TableColumn[]
        };

      case "profil":
        return {
          title: "Profil & Améliorations de Compétences",
          description: "Formez-vous de façon structurée sur vos points de friction.",
          data: profilAmeliorations,
          onAdd: (item: any) => setProfilAmeliorations(prev => [...prev, item]),
          onEdit: (id: string, updated: any) => setProfilAmeliorations(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setProfilAmeliorations(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setProfilAmeliorations(prev => [...prev, ...items]),
          columns: [
            { key: "focusArea", label: "Compétence Visée", type: "text", required: true },
            { key: "status", label: "Statut Actuel", type: "select", options: ["À travailler", "En cours", "Maîtrisé"] },
            { key: "targetDate", label: "Date de Maîtrise", type: "date" },
            { key: "actionPlan", label: "Plan d'Action / Exercices", type: "text" }
          ] as TableColumn[]
        };

      case "skin":
        return {
          title: "Skin Tracker (Routine Beauté & Santé)",
          description: "Vérifiez la consistance de votre routine de soins et l'état de votre peau.",
          data: skinTrackers,
          onAdd: (item: any) => setSkinTrackers(prev => [item, ...prev]),
          onEdit: (id: string, updated: any) => setSkinTrackers(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setSkinTrackers(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setSkinTrackers(prev => [...items, ...prev]),
          columns: [
            { key: "date", label: "Date", type: "date", required: true },
            { key: "morningRoutine", label: "Routine Matin (SPF)", type: "boolean" },
            { key: "eveningRoutine", label: "Routine Soir (Sérum)", type: "boolean" },
            { key: "skinCondition", label: "État Cutané", type: "select", options: ["Excellente", "Bonne", "Sensible", "Acné/Irritée"] },
            { key: "productsUsed", label: "Produits Appliqués", type: "text" },
            { key: "waterIntakeLiters", label: "Eau Bue (Litres)", type: "number" }
          ] as TableColumn[]
        };

      case "meal":
        return {
          title: "Meal Planner (Planificateur de Repas)",
          description: "Mangez sainement, prévoyez vos recettes et suivez les calories.",
          data: mealPlanners,
          onAdd: (item: any) => setMealPlanners(prev => [...prev, item]),
          onEdit: (id: string, updated: any) => setMealPlanners(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setMealPlanners(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setMealPlanners(prev => [...prev, ...items]),
          columns: [
            { key: "dayOfWeek", label: "Jour", type: "select", options: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"] },
            { key: "mealType", label: "Repas", type: "select", options: ["Petit Déjeuner", "Déjeuner", "Dîner", "Collation"] },
            { key: "description", label: "Menu Recette", type: "text", required: true },
            { key: "calories", label: "Calories Estimées", type: "number" },
            { key: "prepared", label: "Préparé", type: "boolean" }
          ] as TableColumn[]
        };

      case "achats":
        return {
          title: "Achats Mensuels (Shopping)",
          description: "Évitez les achats compulsifs. Planifiez le matériel nécessaire pour vos projets.",
          data: achatsMensuels,
          onAdd: (item: any) => setAchatsMensuels(prev => [item, ...prev]),
          onEdit: (id: string, updated: any) => setAchatsMensuels(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setAchatsMensuels(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setAchatsMensuels(prev => [...items, ...prev]),
          columns: [
            { key: "date", label: "Date de Planification", type: "date" },
            { key: "itemName", label: "Nom de l'Article", type: "text", required: true },
            { key: "store", label: "Boutique / Site", type: "text" },
            { key: "category", label: "Catégorie", type: "select", options: ["Matériel", "Logiciel", "Mobilier", "Bureau", "Perso", "Autres"] },
            { key: "amount", label: "Prix Estimé (MAD)", type: "number", required: true },
            { key: "priority", label: "Priorité", type: "select", options: ["Élevée", "Moyenne", "Faible"] },
            { key: "status", label: "Statut", type: "select", options: ["Acheté", "À acheter"] }
          ] as TableColumn[]
        };

      case "abonnements":
        return {
          title: "Abonnements & Charges Récurrentes",
          description: "Suivez vos charges récurrentes et annulez les services inutilisés.",
          data: abonnements,
          onAdd: (item: any) => setAbonnements(prev => [item, ...prev]),
          onEdit: (id: string, updated: any) => setAbonnements(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setAbonnements(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setAbonnements(prev => [...items, ...prev]),
          columns: [
            { key: "serviceName", label: "Nom du Service", type: "text", required: true },
            { key: "costMonthly", label: "Coût Mensuel (MAD)", type: "number", required: true },
            { key: "billingPeriod", label: "Période Facturation", type: "select", options: ["Mensuel", "Annuel"] },
            { key: "nextBillingDate", label: "Prochain Prélèvement", type: "date" },
            { key: "status", label: "État", type: "select", options: ["Actif", "Suspendu"] }
          ] as TableColumn[]
        };

      case "wishlist":
        return {
          title: "Wish List (Liste d'envies)",
          description: "Vos rêves et grands projets d'achats à long terme de valeur importante.",
          data: wishList,
          onAdd: (item: any) => setWishList(prev => [item, ...prev]),
          onEdit: (id: string, updated: any) => setWishList(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setWishList(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setWishList(prev => [...items, ...prev]),
          columns: [
            { key: "itemName", label: "Nom de l'Article", type: "text", required: true },
            { key: "store", label: "Boutique / Site", type: "text" },
            { key: "estimatedPrice", label: "Prix Estimé (MAD)", type: "number", required: true },
            { key: "priority", label: "Priorité", type: "select", options: ["Rêve", "Peut-être", "Bientôt"] },
            { key: "link", label: "Lien URL", type: "text" },
            { key: "note", label: "Notes / Détails", type: "text" }
          ] as TableColumn[]
        };

      case "achats_couteux":
        return {
          title: "Achats Coûteux (Moyen Terme)",
          description: "Achats importants que vous prévoyez d'acquérir à moyen terme, mais pas immédiatement.",
          data: achatsCouteux,
          onAdd: (item: any) => setAchatsCouteux(prev => [item, ...prev]),
          onEdit: (id: string, updated: any) => setAchatsCouteux(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setAchatsCouteux(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setAchatsCouteux(prev => [...items, ...prev]),
          columns: [
            { key: "itemName", label: "Nom de l'Article", type: "text", required: true },
            { key: "store", label: "Boutique / Site", type: "text" },
            { key: "estimatedPrice", label: "Prix Estimé (MAD)", type: "number", required: true },
            { key: "targetDate", label: "Date Cible Prévue", type: "date" },
            { key: "priority", label: "Priorité", type: "select", options: ["Prioritaire", "Secondaire", "Faible"] },
            { key: "status", label: "Statut", type: "select", options: ["Planifié", "Économise", "Acheté"] }
          ] as TableColumn[]
        };

      case "formations":
        return {
          title: "Formations & Cours",
          description: "Mesurez votre progression de montée en compétences professionnelles.",
          data: formations,
          onAdd: (item: any) => setFormations(prev => [...prev, item]),
          onEdit: (id: string, updated: any) => setFormations(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setFormations(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setFormations(prev => [...prev, ...items]),
          columns: [
            { key: "title", label: "Intitulé du Cours", type: "text", required: true },
            { key: "instructor", label: "Formateur / Expert", type: "text" },
            { key: "platform", label: "Plateforme (Udemy...)", type: "text" },
            { key: "durationHours", label: "Durée (Heures)", type: "number" },
            { key: "progressPercent", label: "Avancement (%)", type: "progress" },
            { key: "status", label: "Statut", type: "select", options: ["Non commencé", "En cours", "Terminé"] }
          ] as TableColumn[]
        };

      case "books":
        return {
          title: "Lectures & Bibliothèque de Livres",
          description: "Conservez un journal de vos lectures de développement, d'inspiration et d'apprentissage.",
          data: books,
          onAdd: (item: any) => setBooks(prev => [...prev, item]),
          onEdit: (id: string, updated: any) => setBooks(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setBooks(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setBooks(prev => [...prev, ...items]),
          columns: [
            { key: "title", label: "Titre du Livre", type: "text", required: true },
            { key: "author", label: "Auteur / Écrivain", type: "text", required: true },
            { key: "genre", label: "Genre / Thématique", type: "text" },
            { key: "currentPage", label: "Page Actuelle", type: "number" },
            { key: "totalPages", label: "Pages Totales", type: "number" },
            { key: "rating", label: "Note Personnelle", type: "rating" },
            { key: "status", label: "Statut", type: "select", options: ["À lire", "En cours", "Terminé"] },
            { key: "notes", label: "Commentaires / Résumé", type: "text" }
          ] as TableColumn[]
        };

      case "screenmedia":
        return {
          title: "Séries, Animes & Films",
          description: "Organisez votre file de visionnage pour vos films, séries TV et animes préférés.",
          data: screenMedia,
          onAdd: (item: any) => setScreenMedia(prev => [...prev, item]),
          onEdit: (id: string, updated: any) => setScreenMedia(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setScreenMedia(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setScreenMedia(prev => [...prev, ...items]),
          columns: [
            { key: "title", label: "Titre de l'Œuvre", type: "text", required: true },
            { key: "type", label: "Type", type: "select", options: ["Film", "Série", "Anime"] },
            { key: "platform", label: "Plateforme (Netflix, Crunchyroll...)", type: "text" },
            { key: "currentEpisode", label: "Épisode Actuel", type: "number" },
            { key: "totalEpisodes", label: "Épisodes Totaux", type: "number" },
            { key: "rating", label: "Note Personnelle", type: "rating" },
            { key: "status", label: "Statut", type: "select", options: ["À regarder", "En cours", "Terminé"] },
            { key: "notes", label: "Notes / Commentaires", type: "text" }
          ] as TableColumn[]
        };

      case "comptes":
        return {
          title: "Comptes Bancaires & Trésorerie",
          description: "La balance globale en temps réel de tous vos portefeuilles et comptes.",
          data: accounts,
          onAdd: (item: any) => setAccounts(prev => [item, ...prev]),
          onEdit: (id: string, updated: any) => setAccounts(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setAccounts(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setAccounts(prev => [...items, ...prev]),
          columns: [
            { key: "name", label: "Nom du Compte / Banque", type: "text", required: true },
            { key: "type", label: "Catégorie de Compte", type: "select", options: ["Bancaire", "Espèces", "Crypto"] },
            { key: "balance", label: "Solde", type: "number", required: true },
            { key: "currency", label: "Devise", type: "select", options: ["MAD", "EUR", "USD"] }
          ] as TableColumn[]
        };

      case "links":
        return {
          title: "Liens Utiles & Outils favoris",
          description: "Sauvegardez vos plateformes favorites de ressources de marché ou de bourse.",
          data: links,
          onAdd: (item: any) => setLinks(prev => [...prev, item]),
          onEdit: (id: string, updated: any) => setLinks(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setLinks(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setLinks(prev => [...prev, ...items]),
          columns: [
            { key: "title", label: "Nom du Lien / Outil", type: "text", required: true },
            { key: "url", label: "Adresse URL (Lien)", type: "text", required: true },
            { key: "category", label: "Catégorie", type: "select", options: ["Outils", "Ressources", "Inspiration", "Autres"] },
            { key: "rating", label: "Utilité", type: "rating" }
          ] as TableColumn[]
        };

      case "channels":
        return {
          title: "Suivi des Canaux de Communication & Médias",
          description: "Mesurez vos statistiques de croissance et fréquences de publication.",
          data: channels,
          onAdd: (item: any) => setChannels(prev => [...prev, item]),
          onEdit: (id: string, updated: any) => setChannels(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setChannels(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setChannels(prev => [...prev, ...items]),
          columns: [
            { key: "name", label: "Nom de la Chaîne", type: "text", required: true },
            { key: "platform", label: "Réseau Social", type: "select", options: ["YouTube", "TikTok", "LinkedIn", "Instagram", "Spotify"] },
            { key: "subscriberCount", label: "Abonnés / Followers", type: "number", required: true },
            { key: "niche", label: "Niche Éditioriale", type: "text" },
            { key: "frequency", label: "Fréquence de Publication", type: "text" }
          ] as TableColumn[]
        };

      case "career_dash":
        return { title: "Dashboard de Carrière", description: "Aperçu de vos candidatures, certifications obtenues et compétences cibles.", data: [], onAdd: () => {}, onEdit: () => {}, onDelete: () => {}, onImport: () => {}, columns: [] };
      case "career_mobility":
        return { title: "Tour de Contrôle - Mobilité Internationale EPM", description: "Plan de carrière Serrou Mohammed : suivi multi-pays, seuils salariaux visa 2026, feuille de route et documents.", data: [], onAdd: () => {}, onEdit: () => {}, onDelete: () => {}, onImport: () => {}, columns: [] };
      case "career_pipeline":
        return { title: "Pipeline & Offres d'Emploi", description: "Suivi détaillé de vos opportunités d'emploi, processus de recrutement et candidatures.", data: [], onAdd: () => {}, onEdit: () => {}, onDelete: () => {}, onImport: () => {}, columns: [] };
      case "career_companies":
        return { title: "Entreprises Cibles", description: "Classement et cartographie des structures professionnelles et financières cibles.", data: [], onAdd: () => {}, onEdit: () => {}, onDelete: () => {}, onImport: () => {}, columns: [] };
      case "career_sites":
        return { title: "Portails Recrutement & Profils", description: "Raccourcis vers vos plateformes de recrutement, cabinets et profils en ligne.", data: [], onAdd: () => {}, onEdit: () => {}, onDelete: () => {}, onImport: () => {}, columns: [] };
      case "career_skills":
        return { title: "Compétences & Développement", description: "Journal de montée en compétences professionnelles et plans d'action.", data: [], onAdd: () => {}, onEdit: () => {}, onDelete: () => {}, onImport: () => {}, columns: [] };
      case "career_certificates":
        return { title: "Certificats & Diplômes", description: "Gestion de vos diplômes académiques, CFA, certifications AMMC et FMVA.", data: [], onAdd: () => {}, onEdit: () => {}, onDelete: () => {}, onImport: () => {}, columns: [] };

      default:
        return null;
    }
  };

  // --- STATS COMPUTATION FOR DASHBOARD OVERVIEW ---
  const dashboardStats = React.useMemo(() => {
    const totalBankBalance = accounts.reduce((sum, acc) => {
      let rate = 1;
      if (acc.currency === "USD") rate = 10.1;
      else if (acc.currency === "EUR") rate = 10.9;
      return sum + acc.balance * rate;
    }, 0);

    const totalStockValue = stocks.reduce((sum, s) => sum + s.currentPrice * s.quantity, 0);
    const netWorth = totalBankBalance + totalStockValue;

    const habitsCompleted = dailyHabits.filter(h => h.completed).length;
    const habitsRate = dailyHabits.length > 0 ? (habitsCompleted / dailyHabits.length) * 100 : 0;

    const activeEpargnes = epargnes.filter(e => e.status === "En cours").length;
    const activeSubscribers = abonnements.filter(a => a.status === "Actif").length;

    // Notified habits stats
    const todayStr = new Date().toISOString().split("T")[0];
    const notifiedImportantHabits = dailyHabits.filter(h => h.isImportant && h.dueTime && notifiedHabits[h.id] === todayStr);
    const notifiedImportantCompleted = notifiedImportantHabits.filter(h => h.completed).length;
    const notifiedImportantTotal = notifiedImportantHabits.length;
    const notifiedSuccessRate = notifiedImportantTotal > 0 ? (notifiedImportantCompleted / notifiedImportantTotal) * 100 : 0;

    return {
      netWorth,
      habitsRate,
      activeEpargnes,
      activeSubscribers,
      habitsCompleted,
      notifiedImportantCompleted,
      notifiedImportantTotal,
      notifiedSuccessRate
    };
  }, [accounts, stocks, dailyHabits, epargnes, abonnements, notifiedHabits]);

  const activeCategoryObj = React.useMemo(() => {
    return categories.find(cat => cat.items.some(item => item.id === activeMenu));
  }, [activeMenu, categories]);

  // Handle clicking a category row
  const handleCategoryClick = (catId: string) => {
    const isCurrentlyExpanded = !!expandedCategories[catId];
    // Toggle expand
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: !isCurrentlyExpanded
    }));
    // Navigate to the first sub-item of that category only if expanding
    if (!isCurrentlyExpanded) {
      const cat = categories.find(c => c.id === catId);
      if (cat && cat.items.length > 0) {
        handleMenuClick(cat.items[0].id);
      }
    }
  };

  // Handle clicking a menu item
  const handleMenuClick = (itemId: string) => {
    setActiveMenu(itemId);
    setSidebarOpen(false); // Close responsive drawer on mobile
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Safe navigation directly from the notifications panel
  const handleNavigateToModule = (moduleId: string) => {
    const category = categories.find(cat => cat.items.some(item => item.id === moduleId));
    if (category) {
      setExpandedCategories(prev => ({ ...prev, [category.id]: true }));
    }
    setActiveMenu(moduleId);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSnoozeAlert = (alertId: string) => {
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    setSnoozedAlerts(prev => ({
      ...prev,
      [alertId]: expiresAt
    }));
    triggerToast("Alerte masquée pour 24h !", "success");
  };

  const getWeekRangeLabel = () => {
    const today = new Date();
    const day = today.getDay();
    // Adjust so Monday is index 0 and Sunday is 6
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    
    const formatDate = (d: Date) => {
      return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
    };
    return `${formatDate(monday)} au ${formatDate(sunday)}`;
  };

  const getWeeklyPerformanceMetrics = () => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    const day = today.getDay();
    // Adjust so Monday of this week is index 0
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(today.getTime());
    monday.setDate(diff);
    monday.setHours(0, 0, 0, 0);

    // Generate date strings from Monday to Today
    const datesThisWeek: string[] = [];
    const tempDate = new Date(monday.getTime());
    
    const startOfToday = new Date(today.getTime());
    startOfToday.setHours(0, 0, 0, 0);

    while (tempDate <= startOfToday) {
      const dateStr = tempDate.toISOString().split("T")[0];
      datesThisWeek.push(dateStr);
      tempDate.setDate(tempDate.getDate() + 1);
    }

    let totalCompletedHabits = 0;
    let totalExpectedHabits = 0;

    datesThisWeek.forEach(dateStr => {
      if (dateStr === todayStr) {
        totalCompletedHabits += dailyHabits.filter(h => h.completed).length;
      } else {
        const completedOnDay = habitHistory[dateStr] || [];
        const validCompletedCount = completedOnDay.filter(id => dailyHabits.some(h => h.id === id)).length;
        totalCompletedHabits += validCompletedCount;
      }
      totalExpectedHabits += dailyHabits.length;
    });

    const totalMissedHabits = Math.max(0, totalExpectedHabits - totalCompletedHabits);
    const completionRate = totalExpectedHabits > 0 
      ? Math.round((totalCompletedHabits / totalExpectedHabits) * 100) 
      : 0;

    // Weekly objectives metrics
    const priorityObjectives = weeklyObjectives.filter(o => o.isPriority);
    const completedPriority = priorityObjectives.filter(o => o.completed).length;

    const standardObjectives = weeklyObjectives.filter(o => !o.isPriority);
    const completedStandard = standardObjectives.filter(o => o.completed).length;

    const totalObjectives = weeklyObjectives.length;
    const totalCompletedObjectives = weeklyObjectives.filter(o => o.completed).length;

    return {
      completedHabits: totalCompletedHabits,
      missedHabits: totalMissedHabits,
      expectedHabits: totalExpectedHabits,
      completionRate,
      priorityTotal: priorityObjectives.length,
      priorityCompleted: completedPriority,
      standardTotal: standardObjectives.length,
      standardCompleted: completedStandard,
      totalObjectives,
      totalCompletedObjectives
    };
  };

  // Dynamic Metrics helper for Category Hubs
  const renderCategoryMetrics = (catId: string) => {
    const totalInflow = transactions
      .filter(t => t.type === "Revenue")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalOutflow = transactions
      .filter(t => t.type === "Dépense")
      .reduce((sum, t) => sum + t.amount, 0);

    const stockPortfolioValue = stocks.reduce((acc, s) => acc + s.currentPrice * s.quantity, 0);

    const totalMonthlyAbonnements = abonnements
      .filter(a => a.status === "Actif")
      .reduce((sum, a) => sum + (a.billingPeriod === "Mensuel" ? a.costMonthly : a.costMonthly / 12), 0);

    const habitsCompleted = dailyHabits.filter(h => h.completed).length;

    const totalBankBalance = accounts.reduce((sum, acc) => {
      let rate = 1;
      if (acc.currency === "USD") rate = 10.1;
      else if (acc.currency === "EUR") rate = 10.9;
      return sum + acc.balance * rate;
    }, 0);

    const sportExercisesCount = sportExercises.length;

    switch (catId) {
      case "finance":
        if (["achats", "abonnements", "wishlist", "achats_couteux"].includes(activeMenu)) {
          return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Achats Mensuels</span>
                  <span className="text-base font-extrabold font-mono text-neutral-900 block">{achatsMensuels.length} Commandes</span>
                </div>
                <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><ShoppingCart className="w-4 h-4" /></div>
              </div>
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Abonnements Actifs</span>
                  <span className="text-base font-extrabold font-mono text-neutral-900 block">{abonnements.filter(a => a.status === "Actif").length} Services</span>
                </div>
                <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Bell className="w-4 h-4" /></div>
              </div>
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Frais Récurrents</span>
                  <span className="text-base font-extrabold font-mono text-neutral-800 block">-{totalMonthlyAbonnements.toLocaleString("fr-FR")} MAD / m</span>
                </div>
                <div className="p-2 bg-neutral-100 rounded-lg text-neutral-700 border border-neutral-200"><TrendingDown className="w-4 h-4" /></div>
              </div>
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Frais Annuels</span>
                  <span className="text-base font-extrabold font-mono text-neutral-900 block">{(totalMonthlyAbonnements * 12).toLocaleString("fr-FR")} MAD / an</span>
                </div>
                <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Coins className="w-4 h-4" /></div>
              </div>
            </div>
          );
        }
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Entrées Totales</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">+{totalInflow.toLocaleString("fr-FR")} MAD</span>
              </div>
              <div className="p-2 bg-neutral-100 rounded-lg text-neutral-700 border border-neutral-200"><TrendingUp className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Sorties Totales</span>
                <span className="text-base font-extrabold font-mono text-neutral-800 block">-{totalOutflow.toLocaleString("fr-FR")} MAD</span>
              </div>
              <div className="p-2 bg-neutral-100 rounded-lg text-neutral-700 border border-neutral-200"><TrendingDown className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Trésorerie Nette</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{(totalInflow - totalOutflow).toLocaleString("fr-FR")} MAD</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Coins className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Portefeuille Actions</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{stockPortfolioValue.toLocaleString("fr-FR")} MAD</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Wallet className="w-4 h-4" /></div>
            </div>
          </div>
        );

      case "productivity":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Série de Discipline</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{streakCount} Jours</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Flame className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Routines Validées</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{habitsCompleted} / {dailyHabits.length}</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><CheckCircle className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Sprints de Combat (30J)</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{actions30Jours.length} Actifs</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Calendar className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Grands Goals de Vie</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{possibilitesGoals.length} Buts</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Award className="w-4 h-4" /></div>
            </div>
          </div>
        );

      case "health":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Entraînements de Sport</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{sportExercisesCount} Exercices</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Dumbbell className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Repas Planifiés</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{mealPlanners.length} Menus</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Layers className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Suivis de Peau (Skin)</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{skinTrackers.length} Enregistrés</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Sparkles className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Hydratation Cible</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block font-semibold text-neutral-700">2.5 Litres / jour</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Heart className="w-4 h-4" /></div>
            </div>
          </div>
        );

      case "formation":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl animate-in fade-in duration-300">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Lectures & Livres</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{books.length} Livres ({books.filter(b => b.status === "En cours").length} en cours)</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><BookOpen className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block font-sans">Séries & Films</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{screenMedia.length} Éléments ({screenMedia.filter(s => s.status === "En cours").length} en cours)</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Film className="w-4 h-4" /></div>
            </div>
          </div>
        );

      case "projets":
        const avgProjProgress = formations.length > 0 
          ? Math.round(formations.reduce((sum, f) => sum + f.progressPercent, 0) / formations.length) 
          : 0;
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Formations & Progrès</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{formations.length} Cours ({avgProjProgress}%)</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><GraduationCap className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block font-sans">Chaînes & Médias</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{channels.length} Plateformes</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Tv className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Calendrier Éditorial</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{editorialEvents.length} Vidéos/Posts</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Calendar className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Liens Favoris</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{links.length} Raccourcis</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Link2 className="w-4 h-4" /></div>
            </div>
          </div>
        );

      case "accounts":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl animate-in fade-in duration-300">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Comptes Bancaires</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{accounts.length} Entités</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Landmark className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block font-sans">Soldes Bancaires MAD</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{totalBankBalance.toLocaleString()} MAD</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Coins className="w-4 h-4" /></div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUser = usernameInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    if (!cleanUser || !cleanPass) {
      setLoginError("Veuillez remplir tous les champs requis.");
      return;
    }

    // Accepting both "admin" and the user's actual workspace email "financepath@hotmail.com"
    if (
      (cleanUser === "admin" || cleanUser === "financepath@hotmail.com") && 
      cleanPass === "architect"
    ) {
      setIsUnlocked(true);
      localStorage.setItem("la_is_unlocked", "true");
      sessionStorage.setItem("la_is_unlocked", "true");
      setLoginError("");
    } else {
      setLoginError("Identifiant ou mot de passe incorrect.");
    }
  };

  const handleGoogleLoginLockScreen = async () => {
    setIsDriveLoading(true);
    setLoginError("");
    try {
      const result = await driveSignIn();
      if (result) {
        setDriveAccessTokenState(result.accessToken);
        setIsUnlocked(true);
        sessionStorage.setItem("la_is_unlocked", "true");
        triggerToast("✅ Connecté avec succès via Google & Google Drive !", "success");
      }
    } catch (err: any) {
      console.error("Lockscreen Google login failed:", err);
      const errCode = err?.code || "";
      const errMessage = err?.message || "";
      const isIframe = typeof window !== "undefined" && window.self !== window.top;
      
      if (isIframe) {
        setLoginError("Les cadres de prévisualisation (iframe) peuvent bloquer la fenêtre de connexion Google. Veuillez ouvrir l'application dans un nouvel onglet.");
      } else if (errCode === "auth/popup-closed-by-user") {
        setLoginError("Connexion annulée par l'utilisateur.");
      } else {
        setLoginError("Échec de la connexion Google : " + (errMessage || err));
      }
    } finally {
      setIsDriveLoading(false);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center p-6 relative font-sans select-none selection:bg-neutral-800 selection:text-white">
        <div className="max-w-xs w-full space-y-8 animate-in fade-in duration-500">
          
          {/* Logo and Slogan */}
          <div className="flex flex-col items-center text-center space-y-5">
            <div className="w-14 h-14 bg-neutral-900 border border-neutral-800 rounded-2xl flex items-center justify-center shadow-xs">
              <Logo className="w-7 h-7 text-white" />
            </div>
            <p className="text-xs font-black text-neutral-300 tracking-wider uppercase font-mono">
              L'Art de concevoir votre destin
            </p>
          </div>

          <div className="space-y-4">
            {/* Primary Google & Drive Sign In Button */}
            <button
              type="button"
              disabled={isDriveLoading}
              onClick={handleGoogleLoginLockScreen}
              className="w-full bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs py-3.5 px-4 rounded-xl transition-all cursor-pointer select-none flex items-center justify-center gap-2.5 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {isDriveLoading ? (
                <RefreshCw className="w-4 h-4 text-neutral-900 animate-spin" />
              ) : (
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              )}
              <span>{isDriveLoading ? "Connexion Google..." : "Se connecter avec Google"}</span>
            </button>

            {/* If Firebase user is already active */}
            {firebaseUser && (
              <button
                type="button"
                onClick={() => {
                  setIsUnlocked(true);
                  sessionStorage.setItem("la_is_unlocked", "true");
                }}
                className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-200 font-semibold text-xs py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <span className="truncate">Continuer : <strong className="text-white">{firebaseUser.email}</strong></span>
              </button>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 my-3">
              <div className="h-px bg-neutral-800 flex-1" />
              <span className="text-[9.5px] font-mono text-neutral-500 uppercase tracking-widest">ou identifiant</span>
              <div className="h-px bg-neutral-800 flex-1" />
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-3">
              
              {/* Email Field */}
              <div>
                <input
                  type="text"
                  required
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    setLoginError("");
                  }}
                  placeholder="Email"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-700 rounded-xl py-3 px-4 text-xs font-medium text-white placeholder-neutral-500 outline-hidden transition-all"
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setLoginError("");
                  }}
                  placeholder="Mot de passe"
                  className="w-full bg-neutral-900 border border-neutral-800 focus:border-neutral-700 rounded-xl py-3 pl-4 pr-10 text-xs font-medium text-white placeholder-neutral-500 outline-hidden transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-neutral-500 hover:text-neutral-400 transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Error Banner */}
              {loginError && (
                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-center text-xs text-rose-400 font-medium leading-relaxed animate-in fade-in duration-200">
                  <span>{loginError}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer select-none"
              >
                Se connecter
              </button>

            </form>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 flex flex-col font-sans antialiased overflow-x-hidden w-full max-w-full">
      
      {/* UNIFIED STICKY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200/80 shadow-xs">
        <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 xl:gap-4">
          
          {/* Logo & Brand (Left) */}
          <div 
            onClick={() => handleMenuClick("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none"
          >
            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center shadow-sm shrink-0 border border-neutral-800">
              <Logo className="w-5 h-5 text-white" />
            </div>
            <div className="hidden min-[1650px]:block">
              <span className="text-[8px] font-bold text-neutral-400 block tracking-widest uppercase font-mono leading-none">SYSTEM INTEGRATION</span>
              <span className="text-xs font-black text-neutral-900 block leading-tight mt-0.5">LIFE ARCHITECT</span>
            </div>
          </div>

          {/* Horizontal Navigation Menus (Center - Desktop only) */}
          <nav className="hidden xl:flex items-center gap-0.5 xl:gap-1 h-full overflow-visible">
            
            {/* Dashboard Link */}
            <button
              onClick={() => handleMenuClick("dashboard")}
              className={`flex items-center gap-1 xl:gap-1.5 px-1.5 xl:px-2 py-1.5 rounded-lg text-[9.5px] xl:text-[10px] 2xl:text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer select-none whitespace-nowrap shrink-0 ${
                activeMenu === "dashboard"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50"
              }`}
            >
              <LayoutDashboard className={`w-3.5 h-3.5 shrink-0 ${activeMenu === "dashboard" ? "text-white" : "text-neutral-400"}`} />
              <span className="hidden min-[1650px]:inline">Tableau de Bord</span>
              <span className="min-[1650px]:hidden">Dashboard</span>
            </button>

            {/* Central Calendar Link */}
            <button
              onClick={() => handleMenuClick("central_calendar")}
              className={`flex items-center gap-1 xl:gap-1.5 px-1.5 xl:px-2 py-1.5 rounded-lg text-[9.5px] xl:text-[10px] 2xl:text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer select-none whitespace-nowrap shrink-0 ${
                activeMenu === "central_calendar"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50"
              }`}
            >
              <Calendar className={`w-3.5 h-3.5 shrink-0 ${activeMenu === "central_calendar" ? "text-white" : "text-neutral-400"}`} />
              <span>Calendrier</span>
            </button>

            {/* Categories Hover Dropdowns */}
            {visibleCategories.map(cat => {
              const CatIcon = cat.icon;
              const isCatActive = activeCategoryObj?.id === cat.id;
              
              // Responsive label to prevent overflow on medium screens
              const displayLabel = 
                cat.label === "Projets Médias & Digitaux" ? (
                  <>
                    <span className="hidden min-[1650px]:inline">Projets Médias & Digitaux</span>
                    <span className="min-[1650px]:hidden">Projets</span>
                  </>
                ) : cat.label === "Lectures & Écrans" ? (
                  <>
                    <span className="hidden min-[1650px]:inline">Lectures & Écrans</span>
                    <span className="min-[1650px]:hidden">Lectures</span>
                  </>
                ) : cat.label === "Banque" ? (
                  <>
                    <span className="hidden min-[1650px]:inline">Banque</span>
                    <span className="min-[1650px]:hidden">Banque</span>
                  </>
                ) : cat.label === "Santé & Soins" ? (
                  <>
                    <span className="hidden min-[1650px]:inline">Santé & Soins</span>
                    <span className="min-[1650px]:hidden">Santé</span>
                  </>
                ) : cat.label === "Productivité" ? (
                  <>
                    <span className="hidden min-[1650px]:inline">Productivité</span>
                    <span className="min-[1650px]:hidden">Prod.</span>
                  </>
                ) : (
                  cat.label
                );

              return (
                <div key={cat.id} className="relative group h-full flex items-center">
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`flex items-center gap-0.5 xl:gap-1 px-1 xl:px-1.5 py-1.5 rounded-lg text-[9.5px] xl:text-[10px] 2xl:text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer select-none whitespace-nowrap shrink-0 ${
                      isCatActive
                        ? "bg-neutral-100 text-neutral-950 font-black"
                        : "text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50"
                    }`}
                  >
                    <CatIcon className={`w-3.5 h-3.5 shrink-0 mr-0.5 ${isCatActive ? "text-neutral-900" : "text-neutral-400"}`} />
                    <span>{displayLabel}</span>
                    <ChevronDown className="w-3 h-3 text-neutral-400 opacity-60 group-hover:rotate-180 transition-transform duration-200 shrink-0 ml-0.5" />
                  </button>

                  {/* Floating Sub-items Menu Card */}
                  <div className="absolute top-13 left-0 mt-0.5 hidden group-hover:block bg-white border border-neutral-200/80 rounded-2xl shadow-lg p-2 min-w-[240px] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-[9px] font-black text-neutral-400 tracking-wider uppercase px-3 py-2 border-b border-neutral-50 mb-1">
                      Secteur {cat.label}
                    </div>
                    <div className="space-y-0.5">
                      {cat.items.map(subItem => {
                        const SubIcon = subItem.icon;
                        const isSubActive = activeMenu === subItem.id;
                        return (
                          <button
                            key={subItem.id}
                            onClick={() => {
                              setExpandedCategories(prev => ({ ...prev, [cat.id]: true }));
                              handleMenuClick(subItem.id);
                            }}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer ${
                              isSubActive
                                ? "bg-neutral-50 text-neutral-950 font-extrabold"
                                : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50/70"
                            }`}
                          >
                            <SubIcon className={`w-3.5 h-3.5 shrink-0 ${isSubActive ? "text-neutral-950" : "text-neutral-400"}`} />
                            <span className="truncate">{subItem.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Quick Metrics & Actions (Right) */}
          <div className="flex items-center gap-1 xl:gap-2.5 shrink-0">
            
            {/* Discipline Streak Count */}
            <div 
              className="hidden xl:flex items-center gap-1 bg-neutral-100 border border-neutral-200 px-2 py-1 rounded-lg text-[9.5px] 2xl:text-[11px] font-bold text-neutral-800 shadow-3xs"
              title="Votre série de discipline quotidienne"
            >
              <Flame className="w-3.5 h-3.5 text-neutral-800 fill-neutral-400 shrink-0" />
              <span className="font-mono whitespace-nowrap">{streakCount}j</span>
            </div>

            {/* Total Patrimoine Estimate */}
            <div 
              className="hidden xl:flex items-center gap-1 bg-neutral-50 border border-neutral-200/80 px-2 py-1 rounded-lg text-[9.5px] 2xl:text-[11px] font-bold text-neutral-800 shadow-3xs"
              title={focusMode ? "Patrimoine masqué en mode Concentration" : "Estimation totale du Patrimoine (Comptes + Actions)"}
            >
              <Coins className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
              {focusMode ? (
                <span className="font-mono text-[9px] tracking-widest text-neutral-400 select-none">•••••• MAD</span>
              ) : (
                <span className="font-mono whitespace-nowrap">{dashboardStats.netWorth.toLocaleString("fr-FR")} MAD</span>
              )}
            </div>

            {/* Focus Mode Toggle (Main Menu) */}
            <button
              onClick={handleToggleFocusMode}
              className={`text-[9.5px] 2xl:text-[11px] px-2 xl:px-2.5 py-1.5 rounded-lg font-bold transition-all shadow-2xs cursor-pointer select-none whitespace-nowrap flex items-center gap-1.5 border ${
                focusMode
                  ? "bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-sm animate-pulse"
                  : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
              }`}
              title="Activer/Désactiver le mode concentration pour masquer les flux financiers et écrans de divertissement"
            >
              <Flame className={`w-3.5 h-3.5 shrink-0 ${focusMode ? "text-white fill-white" : "text-neutral-500"}`} />
              <span>{focusMode ? "Focus Actif" : "Mode Focus"}</span>
            </button>

            {/* Daily Reset Routine Button */}
            <button
              onClick={resetDailyRoutines}
              className="text-[9.5px] 2xl:text-[11px] bg-neutral-900 hover:bg-neutral-800 text-white px-2 xl:px-2.5 py-1.5 rounded-lg font-bold transition-all shadow-2xs cursor-pointer select-none whitespace-nowrap flex items-center gap-1"
              title="Réinitialiser les routines quotidiennes pour un nouveau jour"
            >
              <RefreshCw className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden min-[1650px]:inline">Nouveau Jour</span>
            </button>

            {/* Manual Save Button */}
            <button
              onClick={forceManualBackup}
              className="text-[9.5px] 2xl:text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-2 xl:px-2.5 py-1.5 rounded-lg font-bold transition-all shadow-2xs cursor-pointer select-none whitespace-nowrap flex items-center gap-1"
              title="Forcer la sauvegarde manuelle et la synchronisation locale de toutes les données"
            >
              <Save className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden min-[1650px]:inline">Sauvegarder</span>
            </button>

            {/* System Settings Button */}
            <button
              onClick={() => setSettingsModalOpen(true)}
              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all cursor-pointer shrink-0 relative"
              title="Paramètres de synchronisation et du système"
            >
              <Settings className="w-3.5 h-3.5" />
              {cloudSyncEnabled && syncStatus === "synced" && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-emerald-500 rounded-full border border-white animate-pulse" />
              )}
            </button>


            {/* Theme Toggle Button */}
            <button
              onClick={() => {
                if (autoDarkTheme) {
                  setAutoDarkTheme(false);
                  triggerToast("Mode automatique désactivé suite à un changement manuel", "info");
                }
                setIsDarkMode(!isDarkMode);
              }}
              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all cursor-pointer shrink-0"
              title={isDarkMode ? "Passer au mode clair" : "Passer au mode sombre professionnel"}
            >
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-500 fill-amber-300" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-neutral-600 fill-neutral-200" />
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={() => {
                setIsUnlocked(false);
                localStorage.removeItem("la_is_unlocked");
                sessionStorage.removeItem("la_is_unlocked");
              }}
              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-900 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-all cursor-pointer shrink-0"
              title="Se déconnecter de la session"
            >
              <Lock className="w-3.5 h-3.5" />
            </button>

            {/* Responsive Mobile Menu Button */}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="xl:hidden p-2 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 text-neutral-800 focus:outline-none cursor-pointer"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* MOBILE DROPDOWN DRAWER OVERLAY */}
        {sidebarOpen && (
          <div className="xl:hidden fixed inset-x-0 top-16 bottom-0 z-45 bg-white border-t border-neutral-200 overflow-y-auto animate-in slide-in-from-top duration-300">
            <div className="p-6 space-y-6">
              
              {/* Quick Mobile Indicators */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-neutral-50 border border-neutral-200/80 p-3.5 rounded-xl flex items-center gap-2.5">
                  <Flame className="w-4 h-4 text-neutral-800 fill-neutral-400 shrink-0" />
                  <div>
                    <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider block font-mono">DISCIPLINE</span>
                    <span className="text-xs font-black text-neutral-900 block leading-none">{streakCount} Jours</span>
                  </div>
                </div>
                <div className="bg-neutral-50 border border-neutral-200/80 p-3.5 rounded-xl flex items-center gap-2.5">
                  <Coins className="w-4 h-4 text-neutral-800 shrink-0" />
                  <div>
                    <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider block font-mono">PATRIMOINE</span>
                    <span className="text-xs font-black text-neutral-900 block leading-none truncate">{dashboardStats.netWorth.toLocaleString("fr-FR")} MAD</span>
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="space-y-4">
                <button
                  onClick={() => handleMenuClick("dashboard")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-extrabold tracking-wide transition-all cursor-pointer ${
                    activeMenu === "dashboard"
                      ? "bg-neutral-900 text-white font-extrabold shadow-md"
                      : "text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>TABLEAU DE BORD</span>
                </button>

                {/* Focus Mode Toggle Mobile */}
                <button
                  onClick={() => {
                    handleToggleFocusMode();
                  }}
                  className={`w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border font-black text-xs uppercase tracking-wider transition-all cursor-pointer select-none ${
                    focusMode
                      ? "bg-red-600 border-red-600 text-white shadow-md animate-pulse"
                      : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                  }`}
                >
                  <Flame className={`w-4 h-4 shrink-0 ${focusMode ? "text-white fill-white" : "text-neutral-500"}`} />
                  <span>{focusMode ? "CONCENTRATION ACTIVE" : "ACTIVER LE MODE FOCUS"}</span>
                </button>

                {/* Collapsible Sectors */}
                <div className="space-y-2">
                  {visibleCategories.map(cat => {
                    const isExpanded = !!expandedCategories[cat.id];
                    const CatIcon = cat.icon;
                    const isCatActive = activeCategoryObj?.id === cat.id;

                    return (
                      <div key={cat.id} className="space-y-1">
                        <button
                          onClick={() => handleCategoryClick(cat.id)}
                          className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-left transition-all cursor-pointer ${
                            isCatActive
                              ? "bg-neutral-900 text-white shadow-xs"
                              : "text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <CatIcon className="w-4 h-4" />
                            <span>{cat.label}</span>
                          </div>
                          {isExpanded ? <ChevronDown className="w-3.5 h-3.5 opacity-80" /> : <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
                        </button>

                        {isExpanded && (
                          <div className="space-y-1 pl-3 border-l border-neutral-200 ml-5 mt-1">
                            {cat.items.map(sub => {
                              const SubIcon = sub.icon;
                              const isSubActive = activeMenu === sub.id;

                              return (
                                <button
                                  key={sub.id}
                                  onClick={() => handleMenuClick(sub.id)}
                                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all text-left cursor-pointer ${
                                    isSubActive
                                      ? "bg-neutral-100 text-neutral-900 font-extrabold"
                                      : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50/50"
                                  }`}
                                >
                                  <SubIcon className="w-3.5 h-3.5 text-neutral-400" />
                                  <span className="truncate">{sub.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* MAIN CONTENT WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* WORKSPACE CONTENT SCROLL */}
        <main className="flex-1 p-8 overflow-y-auto space-y-8 w-full px-4 sm:px-6 lg:px-8">

          {/* Cloud Sync Status Banner */}
          {!cloudSyncEnabled ? (
            <div id="cloud-sync-warning-banner" className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-top-4 duration-300">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-xl text-amber-800 dark:text-amber-200 shrink-0">
                  <CloudOff className="w-5 h-5 animate-bounce duration-1000" />
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-amber-900 dark:text-amber-200 uppercase tracking-wide">
                    Sauvegarde locale uniquement — Accès multi-appareil non configuré
                  </h4>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300 leading-relaxed max-w-3xl">
                    Vos modifications sont actuellement limitées à ce navigateur. Pour accéder à vos données depuis **n'importe quel appareil (smartphone, ordinateur)** ou navigateur en temps réel et éviter toute perte accidentelle, connectez votre compte Google et activez la synchronisation cloud.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSettingsModalOpen(true)}
                className="px-4 py-2 bg-amber-900 hover:bg-amber-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-neutral-950 rounded-xl text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap self-start md:self-center shadow-xs flex items-center gap-1.5"
              >
                <Cloud className="w-3.5 h-3.5 text-amber-400 dark:text-neutral-900" />
                Activer la Synchro Cloud
              </button>
            </div>
          ) : firebaseUser && syncStatus === "synced" ? (
            <div id="cloud-sync-success-banner" className="bg-emerald-50/40 dark:bg-emerald-950/10 border border-emerald-200/40 dark:border-emerald-900/20 rounded-2xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl text-emerald-800 dark:text-emerald-300 shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    Synchronisation cloud active en temps réel
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                  </span>
                  <span className="text-[10px] text-neutral-400 block font-mono">
                    Compte : {firebaseUser.email} (Vos données sont disponibles sur tous vos appareils en vous connectant)
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 self-end sm:self-center">
                <div className="text-[10px] font-mono text-neutral-400 text-right">
                  Dernier enregistrement : {lastSyncedTime ? lastSyncedTime.toLocaleTimeString() : new Date().toLocaleTimeString()}
                </div>
                <button
                  onClick={() => setSettingsModalOpen(true)}
                  className="px-2.5 py-1 text-[10px] font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 bg-neutral-150/40 hover:bg-neutral-150 rounded-lg border border-neutral-200/50 transition-all cursor-pointer whitespace-nowrap"
                >
                  Gérer
                </button>
              </div>
            </div>
          ) : null}

          {/* TAB 1: TABLEAU DE BORD (MAIN HOME CONTROLLER) - SIMPLIFIED RAPPELS & TACHES */}
          {activeMenu === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Elegant Minimalist Header */}
              <div className="pb-5 border-b border-neutral-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-black text-neutral-900 tracking-tight font-sans">
                    Rappels & Actions Prioritaires
                  </h1>
                  <p className="text-xs text-neutral-500 max-w-2xl">
                    Votre centre de contrôle et d'action directe : suivi de vos tâches de projets, routines beauté et alertes budgétaires.
                  </p>
                </div>
                <div className="text-xs font-bold text-neutral-500 bg-neutral-100 border border-neutral-200/50 px-3.5 py-1.5 rounded-xl shadow-3xs self-start sm:self-auto font-mono">
                  {new Date().toLocaleDateString("fr-FR", { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
              </div>

              {/* Integrated Alert & Notification Hub */}
              <AlertsBanner
                abonnements={abonnements}
                profilAmeliorations={profilAmeliorations}
                epargnes={epargnes}
                dailyHabits={dailyHabits}
                onNavigateToModule={handleNavigateToModule}
              />

              {/* UNIFIED INTERACTIVE CALENDAR ON MAIN DASHBOARD */}
              <DashboardUnifiedCalendar
                dailyHabits={dailyHabits}
                habitHistory={habitHistory}
                onToggleHabitForDate={handleToggleHabitForDate}
                weeklyObjectives={weeklyObjectives}
                onToggleWeeklyObjective={toggleWeeklyObjective}
                actions30Jours={actions30Jours}
                onToggleAction30Jours={handleToggleAction30Jours}
                folders={folders}
                onToggleFolderObjective={handleToggleFolderObjective}
                skinTrackers={skinTrackers}
                onToggleSkinRoutineForDate={handleToggleSkinRoutineForDate}
                abonnements={abonnements}
                achatsMensuels={achatsMensuels}
                onToggleAchatStatus={handleToggleAchatStatus}
                transactions={transactions}
                epargnes={epargnes}
                onNavigateToModule={handleNavigateToModule}
                triggerToast={triggerToast}
              />

              {/* Reorderable 3-Column Responsive Bento-style Grid */}
              <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-1 text-xs text-neutral-500">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-neutral-400 shrink-0" />
                    <span className="font-semibold text-neutral-600 dark:text-neutral-400">
                      Agencement réordonnable : glissez-déposez les cartes par leur poignée ou utilisez les flèches pour personnaliser l'ordre.
                    </span>
                  </div>
                  {JSON.stringify(dashboardCardOrder) !== JSON.stringify(["project_tasks", "skin_routine", "alerts"]) && (
                    <button
                      onClick={resetDashboardCardOrder}
                      className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 underline cursor-pointer self-start sm:self-auto transition-colors"
                    >
                      Réinitialiser l'ordre
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {dashboardCardOrder.map((cardKey, cardIndex) => {
                    // 1. PROJECT TASKS CARD
                    if (cardKey === "project_tasks") {
                      return (
                        <div
                          key="project_tasks"
                          draggable
                          onDragStart={(e) => handleCardDragStart(e, "project_tasks")}
                          onDragOver={(e) => handleCardDragOver(e, "project_tasks")}
                          onDragLeave={handleCardDragLeave}
                          onDrop={(e) => handleCardDrop(e, "project_tasks")}
                          onDragEnd={handleCardDragEnd}
                          className={`bg-white dark:bg-neutral-900 border rounded-3xl p-6 shadow-xs space-y-6 flex flex-col justify-between transition-all duration-200 ${
                            draggedCardId === "project_tasks"
                              ? "opacity-30 border-amber-400 border-dashed scale-[0.98] bg-amber-50/20"
                              : "border-neutral-200/80 hover:border-neutral-300"
                          } ${
                            dragOverCardId === "project_tasks" && draggedCardId !== "project_tasks"
                              ? "ring-2 ring-neutral-900 border-neutral-900 shadow-lg scale-[1.01]"
                              : ""
                          }`}
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className="cursor-grab active:cursor-grabbing p-1 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors flex items-center shrink-0"
                                  title="Maintenir et glisser pour réordonner cette carte"
                                >
                                  <GripVertical className="w-4 h-4" />
                                </div>
                                <span className="p-1.5 bg-neutral-900 text-white rounded-lg">
                                  <FolderKanban className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-neutral-950 uppercase tracking-tight">
                                  Objectifs de Projets
                                </h3>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-0.5 mr-1">
                                  <button
                                    onClick={() => moveCardInOrder("project_tasks", "left")}
                                    disabled={cardIndex === 0}
                                    title="Déplacer vers la gauche"
                                    className="p-1 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                  >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => moveCardInOrder("project_tasks", "right")}
                                    disabled={cardIndex === dashboardCardOrder.length - 1}
                                    title="Déplacer vers la droite"
                                    className="p-1 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                  >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <span className="text-[10px] font-bold text-neutral-500 bg-neutral-50 border border-neutral-150 px-2 py-0.5 rounded-full font-mono">
                                  {folders.reduce((acc, f) => acc + f.customObjectives.filter(o => !o.completed).length, 0)} en attente
                                </span>
                              </div>
                            </div>

                            {/* Task checklist */}
                            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                              {(() => {
                                const pendingTasks = folders.flatMap(f => 
                                  f.customObjectives.filter(o => !o.completed).map(o => ({
                                    folderId: f.id,
                                    folderName: f.name,
                                    folderCategory: f.category,
                                    ...o
                                  }))
                                );

                                if (pendingTasks.length === 0) {
                                  return (
                                    <div className="flex flex-col items-center justify-center text-center py-8 px-4 space-y-3 bg-neutral-50/50 border border-neutral-150/60 rounded-2xl">
                                      <div className="relative w-16 h-16 flex items-center justify-center">
                                        <div className="absolute inset-0 rounded-full bg-neutral-100/70 border border-neutral-200/50 scale-95" />
                                        <svg 
                                          id="svg-empty-tasks"
                                          className="w-10 h-10 text-neutral-400 relative z-10" 
                                          viewBox="0 0 24 24" 
                                          fill="none" 
                                          stroke="currentColor" 
                                          strokeWidth="1.5" 
                                          strokeLinecap="round" 
                                          strokeLinejoin="round"
                                        >
                                          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" className="stroke-neutral-200" />
                                          <path d="m9 12 2 2 4-4" className="stroke-neutral-400" strokeWidth="2" />
                                          <path d="M8 6h8" className="stroke-neutral-200/50" />
                                          <path d="M8 18h8" className="stroke-neutral-200/50" />
                                        </svg>
                                        <div className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        <div className="absolute bottom-2 left-1 w-1 h-1 rounded-full bg-neutral-300" />
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-xs font-black text-neutral-800 uppercase tracking-wider">Aucun objectif en attente</p>
                                        <p className="text-[10px] text-neutral-500 font-medium max-w-[200px] mx-auto leading-relaxed">
                                          Tous vos objectifs de projets ont été complétés ! Ajoutez-en de nouveaux dans vos dossiers.
                                        </p>
                                      </div>
                                    </div>
                                  );
                                }

                                return pendingTasks.map(task => (
                                  <div 
                                    key={task.id} 
                                    onClick={() => handleToggleProjectObjective(task.folderId, task.id)}
                                    className="flex items-start gap-3 p-3 bg-neutral-50 hover:bg-neutral-100/75 border border-neutral-200/50 rounded-xl transition-all cursor-pointer group"
                                  >
                                    <button className="mt-0.5 text-neutral-400 group-hover:text-neutral-900 transition-colors">
                                      <Square className="w-4 h-4" />
                                    </button>
                                    <div className="space-y-1">
                                      <span className="inline-block text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-white text-neutral-700 border border-neutral-200">
                                        {task.folderName}
                                      </span>
                                      <p className="text-xs font-semibold text-neutral-800 leading-tight">
                                        {task.text}
                                      </p>
                                    </div>
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>

                          <button
                            onClick={() => handleNavigateToModule("project_folders")}
                            className="w-full py-2.5 mt-4 text-center bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer"
                          >
                            Gérer mes dossiers de projets
                          </button>
                        </div>
                      );
                    }

                    // 2. SKIN ROUTINE CARD
                    if (cardKey === "skin_routine") {
                      return (
                        <div
                          key="skin_routine"
                          draggable
                          onDragStart={(e) => handleCardDragStart(e, "skin_routine")}
                          onDragOver={(e) => handleCardDragOver(e, "skin_routine")}
                          onDragLeave={handleCardDragLeave}
                          onDrop={(e) => handleCardDrop(e, "skin_routine")}
                          onDragEnd={handleCardDragEnd}
                          className={`bg-white dark:bg-neutral-900 border rounded-3xl p-6 shadow-xs space-y-6 flex flex-col justify-between transition-all duration-200 ${
                            draggedCardId === "skin_routine"
                              ? "opacity-30 border-amber-400 border-dashed scale-[0.98] bg-amber-50/20"
                              : "border-neutral-200/80 hover:border-neutral-300"
                          } ${
                            dragOverCardId === "skin_routine" && draggedCardId !== "skin_routine"
                              ? "ring-2 ring-neutral-900 border-neutral-900 shadow-lg scale-[1.01]"
                              : ""
                          }`}
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className="cursor-grab active:cursor-grabbing p-1 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors flex items-center shrink-0"
                                  title="Maintenir et glisser pour réordonner cette carte"
                                >
                                  <GripVertical className="w-4 h-4" />
                                </div>
                                <span className="p-1.5 bg-neutral-900 text-white rounded-lg">
                                  <Sparkles className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-neutral-950 uppercase tracking-tight">
                                  Routines Skin Care
                                </h3>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-0.5 mr-1">
                                  <button
                                    onClick={() => moveCardInOrder("skin_routine", "left")}
                                    disabled={cardIndex === 0}
                                    title="Déplacer vers la gauche"
                                    className="p-1 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                  >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => moveCardInOrder("skin_routine", "right")}
                                    disabled={cardIndex === dashboardCardOrder.length - 1}
                                    title="Déplacer vers la droite"
                                    className="p-1 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                  >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <span className="text-[10px] font-bold text-neutral-500 bg-neutral-50 border border-neutral-150 px-2 py-0.5 rounded-full font-mono">
                                  Aujourd'hui
                                </span>
                              </div>
                            </div>

                            {/* Skin Routine togglers */}
                            {(() => {
                              const todayStr = new Date().toISOString().split("T")[0];
                              const todayLog = skinTrackers.find(s => s.date === todayStr);
                              const isMorningDone = todayLog?.morningRoutine || false;
                              const isEveningDone = todayLog?.eveningRoutine || false;

                              return (
                                <div className="space-y-4">
                                  <div className="p-4 bg-neutral-50 border border-neutral-200/50 rounded-2xl space-y-3">
                                    <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">État des routines</h4>
                                    
                                    {/* Morning */}
                                    <div 
                                      onClick={() => handleToggleTodaySkinRoutine("morning")}
                                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                                        isMorningDone 
                                          ? "bg-emerald-50/50 border-emerald-200 text-emerald-950" 
                                          : "bg-white border-neutral-200 text-neutral-800 hover:border-neutral-300"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <span className="text-lg">☀️</span>
                                        <div className="space-y-0.5">
                                          <span className="text-xs font-extrabold block">Routine Matin (SPF)</span>
                                          <span className="text-[10px] text-neutral-400 font-medium">Protection solaire anti-UV</span>
                                        </div>
                                      </div>
                                      {isMorningDone ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                                      ) : (
                                        <Square className="w-5 h-5 text-neutral-300 shrink-0" />
                                      )}
                                    </div>

                                    {/* Evening */}
                                    <div 
                                      onClick={() => handleToggleTodaySkinRoutine("evening")}
                                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                                        isEveningDone 
                                          ? "bg-emerald-50/50 border-emerald-200 text-emerald-950" 
                                          : "bg-white border-neutral-200 text-neutral-800 hover:border-neutral-300"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5">
                                        <span className="text-lg">🌙</span>
                                        <div className="space-y-0.5">
                                          <span className="text-xs font-extrabold block">Routine Soir (Sérum)</span>
                                          <span className="text-[10px] text-neutral-400 font-medium">Hydratation profonde & soin</span>
                                        </div>
                                      </div>
                                      {isEveningDone ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                                      ) : (
                                        <Square className="w-5 h-5 text-neutral-300 shrink-0" />
                                      )}
                                    </div>
                                  </div>

                                  {/* Water intake shortcut */}
                                  <div className="p-4 bg-neutral-50 border border-neutral-200/50 rounded-2xl flex items-center justify-between">
                                    <div className="space-y-1">
                                      <span className="text-xs font-extrabold block text-neutral-800">Hydratation (L)</span>
                                      <span className="text-[10px] text-neutral-400 block font-medium">Objectif quotidien : 2.5 L</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <button 
                                        onClick={() => {
                                          setSkinTrackers(prev => {
                                            const log = prev.find(s => s.date === todayStr);
                                            if (log) {
                                              return prev.map(s => s.date === todayStr ? { ...s, waterIntakeLiters: Math.max(0, (s.waterIntakeLiters || 0) - 0.25) } : s);
                                            } else {
                                              return [{ id: Math.random().toString(36).substr(2, 9), date: todayStr, morningRoutine: false, eveningRoutine: false, skinCondition: "Bonne", productsUsed: "", waterIntakeLiters: 0 }, ...prev];
                                            }
                                          });
                                          triggerToast("Eau bue diminuée !", "info");
                                        }}
                                        className="w-8 h-8 rounded-lg bg-white border border-neutral-200 hover:bg-neutral-50 flex items-center justify-center font-bold text-neutral-600 select-none cursor-pointer"
                                      >
                                        -
                                      </button>
                                      <span className="text-sm font-mono font-black text-neutral-900">
                                        {(todayLog?.waterIntakeLiters || 0).toFixed(2)}
                                      </span>
                                      <button 
                                        onClick={() => {
                                          setSkinTrackers(prev => {
                                            const log = prev.find(s => s.date === todayStr);
                                            if (log) {
                                              return prev.map(s => s.date === todayStr ? { ...s, waterIntakeLiters: (s.waterIntakeLiters || 0) + 0.25 } : s);
                                            } else {
                                              return [{ id: Math.random().toString(36).substr(2, 9), date: todayStr, morningRoutine: false, eveningRoutine: false, skinCondition: "Bonne", productsUsed: "", waterIntakeLiters: 0.25 }, ...prev];
                                            }
                                          });
                                          triggerToast("Eau bue augmentée !", "success");
                                        }}
                                        className="w-8 h-8 rounded-lg bg-neutral-900 hover:bg-neutral-800 flex items-center justify-center font-bold text-white select-none cursor-pointer"
                                      >
                                        +
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>

                          <button
                            onClick={() => handleNavigateToModule("skin")}
                            className="w-full py-2.5 mt-4 text-center bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer"
                          >
                            Ouvrir le suivi de peau complet
                          </button>
                        </div>
                      );
                    }

                    // 3. ALERTS CARD
                    if (cardKey === "alerts") {
                      return (
                        <div
                          key="alerts"
                          draggable
                          onDragStart={(e) => handleCardDragStart(e, "alerts")}
                          onDragOver={(e) => handleCardDragOver(e, "alerts")}
                          onDragLeave={handleCardDragLeave}
                          onDrop={(e) => handleCardDrop(e, "alerts")}
                          onDragEnd={handleCardDragEnd}
                          className={`bg-white dark:bg-neutral-900 border rounded-3xl p-6 shadow-xs space-y-6 flex flex-col justify-between transition-all duration-200 ${
                            draggedCardId === "alerts"
                              ? "opacity-30 border-amber-400 border-dashed scale-[0.98] bg-amber-50/20"
                              : "border-neutral-200/80 hover:border-neutral-300"
                          } ${
                            dragOverCardId === "alerts" && draggedCardId !== "alerts"
                              ? "ring-2 ring-neutral-900 border-neutral-900 shadow-lg scale-[1.01]"
                              : ""
                          }`}
                        >
                          <div className="space-y-4">
                            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                              <div className="flex items-center gap-2">
                                <div
                                  className="cursor-grab active:cursor-grabbing p-1 hover:bg-neutral-100 rounded-lg text-neutral-400 hover:text-neutral-700 transition-colors flex items-center shrink-0"
                                  title="Maintenir et glisser pour réordonner cette carte"
                                >
                                  <GripVertical className="w-4 h-4" />
                                </div>
                                <span className="p-1.5 bg-neutral-900 text-white rounded-lg">
                                  <Coins className="w-4 h-4" />
                                </span>
                                <h3 className="text-sm font-black text-neutral-950 uppercase tracking-tight">
                                  Alertes de Finance
                                </h3>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-0.5 mr-1">
                                  <button
                                    onClick={() => moveCardInOrder("alerts", "left")}
                                    disabled={cardIndex === 0}
                                    title="Déplacer vers la gauche"
                                    className="p-1 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                  >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => moveCardInOrder("alerts", "right")}
                                    disabled={cardIndex === dashboardCardOrder.length - 1}
                                    title="Déplacer vers la droite"
                                    className="p-1 rounded hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 disabled:opacity-20 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                  >
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                {Object.keys(snoozedAlerts).length > 0 && (
                                  <button
                                    onClick={() => {
                                      setSnoozedAlerts({});
                                      triggerToast("Toutes les alertes ont été réactivées !", "success");
                                    }}
                                    className="text-[9px] text-indigo-600 hover:text-indigo-800 font-bold underline cursor-pointer transition-all"
                                    title="Réactiver toutes les alertes masquées temporairement"
                                  >
                                    Réactiver ({Object.keys(snoozedAlerts).length})
                                  </button>
                                )}
                                <span className="text-[10px] font-bold text-neutral-500 bg-neutral-50 border border-neutral-150 px-2 py-0.5 rounded-full font-mono">
                                  Attention
                                </span>
                              </div>
                            </div>

                            {/* Real-time Alerts */}
                            <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                              {(() => {
                                const alerts: React.ReactNode[] = [];
                                const nowMs = Date.now();

                                // 1. Low balances
                                accounts.forEach(acc => {
                                  const alertId = `acc-alert-${acc.id}`;
                                  if (snoozedAlerts[alertId] && snoozedAlerts[alertId] > nowMs) return;

                                  if (acc.balance < 1000) {
                                    alerts.push(
                                      <div 
                                        key={alertId}
                                        onClick={() => handleNavigateToModule("comptes")}
                                        className="group relative p-3 bg-red-50 border border-red-100 rounded-xl flex items-center justify-between gap-2.5 cursor-pointer hover:bg-red-50/80 transition-all"
                                      >
                                        <div className="flex gap-2.5">
                                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                                          <div className="space-y-0.5">
                                            <span className="text-[10px] font-black text-red-800 uppercase block tracking-wider font-mono">Trésorerie Basse</span>
                                            <p className="text-xs font-bold text-neutral-850">
                                              Compte {acc.name} est à {acc.balance.toLocaleString("fr-FR")} {acc.currency}.
                                            </p>
                                          </div>
                                        </div>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSnoozeAlert(alertId);
                                          }}
                                          title="Masquer pendant 24h"
                                          className="p-1 rounded-lg bg-white border border-neutral-200 text-neutral-400 hover:text-red-600 hover:border-red-200 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0"
                                        >
                                          <Clock className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    );
                                  }
                                });

                                // 2. Exceeded Budgets
                                budgets.forEach((b, index) => {
                                  if (b.spentAmount > b.limitAmount) {
                                    const alertId = `budget-alert-${b.category}`;
                                    if (snoozedAlerts[alertId] && snoozedAlerts[alertId] > nowMs) return;

                                    alerts.push(
                                      <motion.div 
                                        key={alertId}
                                        onClick={() => handleNavigateToModule("budgets")}
                                        className="group relative p-3 bg-red-50/70 border border-red-200 rounded-xl flex items-center justify-between gap-2.5 cursor-pointer hover:bg-red-55/90 transition-all shadow-3xs"
                                        animate={{
                                          scale: [1, 1.015, 1],
                                          boxShadow: [
                                            "0px 0px 0px rgba(239, 68, 68, 0)",
                                            "0px 0px 8px rgba(239, 68, 68, 0.25)",
                                            "0px 0px 0px rgba(239, 68, 68, 0)"
                                          ]
                                        }}
                                        transition={{
                                          duration: 2,
                                          repeat: Infinity,
                                          ease: "easeInOut"
                                        }}
                                      >
                                        <div className="flex gap-2.5">
                                          <div className="relative shrink-0 mt-0.5">
                                            <AlertCircle className="w-4 h-4 text-red-600" />
                                            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-red-600" />
                                          </div>
                                          <div className="space-y-0.5">
                                            <span className="text-[10px] font-black text-red-800 uppercase block tracking-wider font-mono">Budget Dépassé</span>
                                            <p className="text-xs font-bold text-neutral-850 leading-snug">
                                              Enveloppe {b.category} : dépensé {b.spentAmount} MAD / limite {b.limitAmount} MAD.
                                            </p>
                                          </div>
                                        </div>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleSnoozeAlert(alertId);
                                          }}
                                          title="Masquer pendant 24h"
                                          className="p-1 rounded-lg bg-white border border-neutral-200 text-neutral-400 hover:text-red-600 hover:border-red-200 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0"
                                        >
                                          <Clock className="w-3.5 h-3.5" />
                                        </button>
                                      </motion.div>
                                    );
                                  } else {
                                    const thresholdPct = b.alertThresholdPct ?? 80;
                                    const thresholdRatio = thresholdPct / 100;
                                    if (b.spentAmount >= b.limitAmount * thresholdRatio) {
                                      const alertId = `budget-alert-warning-${b.category}`;
                                      if (snoozedAlerts[alertId] && snoozedAlerts[alertId] > nowMs) return;

                                      alerts.push(
                                        <motion.div 
                                          key={alertId}
                                          onClick={() => handleNavigateToModule("budgets")}
                                          className="group relative p-3 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between gap-2.5 cursor-pointer hover:bg-amber-55/90 transition-all shadow-3xs"
                                          animate={{
                                            scale: [1, 1.015, 1],
                                            boxShadow: [
                                              "0px 0px 0px rgba(245, 158, 11, 0)",
                                              "0px 0px 8px rgba(245, 158, 11, 0.25)",
                                              "0px 0px 0px rgba(245, 158, 11, 0)"
                                            ]
                                          }}
                                          transition={{
                                            duration: 2.2,
                                            repeat: Infinity,
                                            ease: "easeInOut"
                                          }}
                                        >
                                          <div className="flex gap-2.5">
                                            <div className="relative shrink-0 mt-0.5">
                                              <AlertCircle className="w-4 h-4 text-amber-600" />
                                              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                                              <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-600" />
                                            </div>
                                            <div className="space-y-0.5">
                                              <span className="text-[10px] font-black text-amber-800 uppercase block tracking-wider font-mono">Budget Critique ({thresholdPct}%)</span>
                                              <p className="text-xs font-bold text-neutral-850 leading-snug">
                                                Enveloppe {b.category} à {thresholdPct}%+ : dépensé {b.spentAmount.toLocaleString("fr-FR")} MAD / limite {b.limitAmount.toLocaleString("fr-FR")} MAD.
                                              </p>
                                            </div>
                                          </div>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleSnoozeAlert(alertId);
                                            }}
                                            title="Snoozer pendant 24h"
                                            className="p-1 rounded-lg bg-white border border-neutral-200 text-neutral-400 hover:text-indigo-600 hover:border-indigo-250 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0 animate-in fade-in"
                                          >
                                            <Clock className="w-3.5 h-3.5" />
                                          </button>
                                        </motion.div>
                                      );
                                    }
                                  }
                                });

                                // 3. Imminent Subscriptions
                                const today = new Date();
                                abonnements.forEach(ab => {
                                  const alertId = `sub_${ab.id}`;
                                  if (snoozedAlerts[alertId] && snoozedAlerts[alertId] > nowMs) return;

                                  if (ab.status === "Actif" && ab.nextBillingDate) {
                                    const bDate = new Date(ab.nextBillingDate);
                                    const diffDays = Math.ceil((bDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
                                    if (diffDays >= 0 && diffDays <= 7) {
                                      alerts.push(
                                        <div 
                                          key={alertId}
                                          onClick={() => handleNavigateToModule("abonnements")}
                                          className="group relative p-3 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl flex items-center justify-between gap-2.5 cursor-pointer transition-all"
                                        >
                                          <div className="flex gap-2.5">
                                            <Bell className="w-4 h-4 text-neutral-600 shrink-0 mt-0.5" />
                                            <div className="space-y-0.5">
                                              <span className="text-[10px] font-black text-neutral-500 uppercase block tracking-wider font-mono">Facture Imminente</span>
                                              <p className="text-xs font-bold text-neutral-850 leading-snug">
                                                {ab.serviceName} prélevé de {ab.costMonthly} MAD dans {diffDays} jours.
                                              </p>
                                            </div>
                                          </div>
                                          <button
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleSnoozeAlert(alertId);
                                            }}
                                            title="Snoozer pendant 24h"
                                            className="p-1 rounded-lg bg-white border border-neutral-200 text-neutral-400 hover:text-indigo-600 hover:border-indigo-250 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0 animate-in fade-in"
                                          >
                                            <Clock className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      );
                                    }
                                  }
                                });

                                if (alerts.length === 0) {
                                  return (
                                    <div className="flex flex-col items-center justify-center text-center py-8 px-4 space-y-3 bg-emerald-50/20 border border-emerald-100/60 rounded-2xl">
                                      <div className="relative w-16 h-16 flex items-center justify-center">
                                        <div className="absolute inset-0 rounded-full bg-emerald-50 border border-emerald-100/50 scale-95" />
                                        <svg 
                                          id="svg-empty-alerts"
                                          className="w-10 h-10 text-emerald-600 relative z-10" 
                                          viewBox="0 0 24 24" 
                                          fill="none" 
                                          stroke="currentColor" 
                                          strokeWidth="1.5" 
                                          strokeLinecap="round" 
                                          strokeLinejoin="round"
                                        >
                                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="stroke-emerald-200" fill="url(#shieldGrad)" />
                                          <path d="m9 12 2 2 4-4" className="stroke-emerald-500" strokeWidth="2.5" />
                                          <defs>
                                            <linearGradient id="shieldGrad" x1="0" y1="0" x2="0" y2="1">
                                              <stop offset="0%" stopColor="#ecfdf5" stopOpacity="0.4" />
                                              <stop offset="100%" stopColor="#d1fae5" stopOpacity="0.8" />
                                            </linearGradient>
                                          </defs>
                                        </svg>
                                        <div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                      </div>
                                      <div className="space-y-1">
                                        <p className="text-xs font-black text-emerald-950 uppercase tracking-wider">Tout est au vert !</p>
                                        <p className="text-[10px] text-emerald-600 font-medium max-w-[200px] mx-auto leading-relaxed">
                                          Aucun budget dépassé ou facture urgente détectée. Votre santé financière est optimale.
                                        </p>
                                      </div>
                                    </div>
                                  );
                                }

                                return alerts;
                              })()}
                            </div>
                          </div>

                          <button
                            onClick={() => handleNavigateToModule("finance_dash")}
                            className="w-full py-2.5 mt-4 text-center bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer"
                          >
                            Ouvrir le Tableau de bord Financier
                          </button>
                        </div>
                      );
                    }

                    return null;
                  })}
                </div>
              </div>

              {/* Weekly Category Habits Stats Gauges */}
              <WeeklyCategoryStatsCard 
                dailyHabits={dailyHabits} 
                habitHistory={habitHistory} 
                onNavigateToHabits={() => handleNavigateToModule("habits")}
              />

              {/* Habits Weekly Visual Summary Card */}
              <HabitsSummaryCard 
                dailyHabits={dailyHabits} 
                habitHistory={habitHistory} 
              />

            </div>
          )}

          {/* TAB 2: ANIMATED OVERLAY SUBPAGES ("Des pages qui s'ouvre") */}
          <AnimatePresence mode="wait">
            {activeMenu !== "dashboard" && activeCategoryObj && (
              <motion.div
                key={activeMenu}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="bg-transparent space-y-6"
              >
                
                {/* Back button and navigation breadcrumb */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white border border-neutral-200 p-4 rounded-2xl gap-3 shadow-3xs">
                  <button
                    onClick={() => handleMenuClick("dashboard")}
                    className="flex items-center gap-2 bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer w-fit"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Retour au Tableau de Bord</span>
                  </button>

                  <div className="text-xs font-bold text-neutral-400 font-mono flex items-center gap-1.5 flex-wrap">
                    <span>LIFE OS & PRO</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
                    <span className="text-neutral-500 uppercase">{activeCategoryObj.label}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
                    <span className="text-neutral-950">
                      {activeMenu === "charts" 
                        ? "GRAPHIQUES & ANALYSE" 
                        : activeMenu === "sport" 
                          ? "FOCUS SPORT" 
                          : getModuleConfig(activeMenu)?.title.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Category Header and Description */}
                <div className="bg-white border border-neutral-200/85 rounded-3xl p-6 shadow-2xs space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-neutral-900 text-white text-[10px] font-bold font-mono px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Espace {activeCategoryObj.label}
                    </span>
                  </div>
                  <h1 className="text-xl font-black text-neutral-900 tracking-tight font-sans uppercase">
                    {activeCategoryObj.label}
                  </h1>
                  <p className="text-xs text-neutral-500 max-w-2xl leading-relaxed">
                    Naviguez à travers les différents modules du secteur {activeCategoryObj.label.toLowerCase()} pour piloter vos projets professionnels, personnels et votre organisation quotidienne.
                  </p>
                </div>

                {/* Dynamic Category Metrics Panel */}
                {renderCategoryMetrics(activeCategoryObj.id)}

                {/* Horizontal scrollable sub-tabs */}
                <div className="border-b border-neutral-200/85">
                  <div className="flex items-center gap-2 overflow-x-auto pb-px scrollbar-thin scrollbar-thumb-neutral-200">
                    {activeCategoryObj.items.map(subItem => {
                      const SubIcon = subItem.icon;
                      const isTabActive = activeMenu === subItem.id;
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleMenuClick(subItem.id)}
                          className={`flex items-center gap-2 px-5 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px cursor-pointer ${
                            isTabActive
                              ? "border-neutral-900 text-neutral-900 font-extrabold"
                              : "border-transparent text-neutral-400 hover:text-neutral-950 hover:border-neutral-200"
                          }`}
                        >
                          <SubIcon className={`w-4 h-4 ${isTabActive ? "text-neutral-900" : "text-neutral-400"}`} />
                          <span>{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Excel Sync Toolbar (Renders conditionally for pages configured in MODULE_SCHEMAS) */}
                {(() => {
                  const sync = getSyncDataAndHandler(activeMenu);
                  if (sync) {
                    return (
                      <ExcelSyncToolbar
                        activeMenu={activeMenu}
                        data={sync.data}
                        onImport={sync.onImport}
                        triggerToast={triggerToast}
                      />
                    );
                  }
                  return null;
                })()}

                {/* Interactive Content Card */}
                <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs min-h-[420px]">
                  {(activeMenu === "saisie_unifiee" || activeMenu === "transactions" || activeMenu === "salaires" || activeMenu === "abonnements" || activeMenu === "achats") ? (
                    <UnifiedFinancialEntrySection
                      transactions={transactions}
                      setTransactions={setTransactions}
                      salaires={salaires}
                      setSalaires={setSalaires}
                      abonnements={abonnements}
                      setAbonnements={setAbonnements}
                      achatsMensuels={achatsMensuels}
                      setAchatsMensuels={setAchatsMensuels}
                      accounts={accounts}
                      setAccounts={setAccounts}
                      budgets={budgets}
                      setBudgets={setBudgets}
                      epargnes={epargnes}
                      setEpargnes={setEpargnes}
                      triggerToast={triggerToast}
                    />
                  ) : activeMenu === "finance_dash" ? (
                    <FinanceSectionDashboard
                      accounts={accounts}
                      budgets={budgets}
                      epargnes={epargnes}
                      abonnements={abonnements}
                      stocks={stocks}
                      transactions={transactions}
                      salaires={salaires}
                      onNavigate={handleMenuClick}
                    />
                  ) : activeMenu === "productivity_dash" ? (
                    <ProductivitySectionDashboard
                      dailyHabits={dailyHabits}
                      actions30Jours={actions30Jours}
                      weeklyObjectives={weeklyObjectives}
                      profilAmeliorations={profilAmeliorations}
                      possibilitesGoals={possibilitesGoals}
                      journalEntries={journalEntries}
                      streakCount={streakCount}
                      onNavigate={handleMenuClick}
                      onToggleHabit={toggleHabit}
                      morningReminderEnabled={morningReminderEnabled}
                      setMorningReminderEnabled={setMorningReminderEnabled}
                      morningReminderTime={morningReminderTime}
                      setMorningReminderTime={setMorningReminderTime}
                      morningReminderText={morningReminderText}
                      setMorningReminderText={setMorningReminderText}
                      onTriggerImmediateCheck={testMorningReminder}
                      notificationPermission={notificationPermission}
                      requestNotificationPermission={requestNotificationPermission}
                      habitHistory={habitHistory}
                    />
                  ) : activeMenu === "health_dash" ? (
                    <HealthSectionDashboard
                      skinTrackers={skinTrackers}
                      mealPlanners={mealPlanners}
                      onNavigate={handleMenuClick}
                    />
                  ) : activeMenu === "formation_dash" ? (
                    <LecturesSectionDashboard
                      books={books}
                      screenMedia={screenMedia}
                      onNavigate={handleMenuClick}
                    />
                  ) : activeMenu === "charts" ? (
                    <div className="space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                        <div className="space-y-1">
                          <h3 className="text-base font-extrabold text-neutral-900 tracking-tight">Graphiques & Analyses Croisées</h3>
                          <p className="text-xs text-neutral-400">Analyse de vos flux financiers croisée avec vos indices d'effort et d'autodiscipline.</p>
                        </div>
                        
                        {/* CHART SUB-TABS SELECTOR */}
                        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl self-start">
                          <button
                            onClick={() => setActiveChartsSubTab("finance")}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              activeChartsSubTab === "finance"
                                ? "bg-white text-neutral-950 shadow-3xs"
                                : "text-neutral-500 hover:text-neutral-900"
                            }`}
                          >
                            Analyses Financières
                          </button>
                          <button
                            onClick={() => setActiveChartsSubTab("correlations")}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              activeChartsSubTab === "correlations"
                                ? "bg-white text-neutral-950 shadow-3xs"
                                : "text-neutral-500 hover:text-neutral-900"
                            }`}
                          >
                            Corrélations Bien-être
                          </button>
                          <button
                            onClick={() => setActiveChartsSubTab("fire")}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              activeChartsSubTab === "fire"
                                ? "bg-white text-neutral-950 shadow-3xs"
                                : "text-neutral-500 hover:text-neutral-900"
                            }`}
                          >
                            Liberté Financière (FIRE)
                          </button>
                        </div>
                      </div>

                      {activeChartsSubTab === "finance" ? (
                        <div className="space-y-6 animate-in fade-in duration-300">
                          <FinanceCharts
                            transactions={transactions}
                            budgets={budgets}
                            stocks={stocks}
                            epargnes={epargnes}
                            abonnements={abonnements}
                          />
                          <NetSavingsChart transactions={transactions} abonnements={abonnements} />
                          <SavingsTrendChart transactions={transactions} abonnements={abonnements} />
                        </div>
                      ) : activeChartsSubTab === "correlations" ? (
                        <PerformanceCorrelations
                          sportHistory={sportHistory}
                          weeklyObjectives={weeklyObjectives}
                          transactions={transactions}
                        />
                      ) : (
                        <FireCalculator />
                      )}
                    </div>
                                    ) : activeMenu === "sport" ? (
                    <FocusSport 
                      exercises={sportExercises} 
                      setExercises={setSportExercises} 
                      sportHistory={sportHistory}
                      onToggleSportDay={toggleSportDay}
                    />
                  ) : activeMenu === "skin" ? (
                    <SkinTrackerSection skinTrackers={skinTrackers} setSkinTrackers={setSkinTrackers} />
                  ) : activeMenu === "meal" ? (
                    <MealPlannerSection mealPlanners={mealPlanners} setMealPlanners={setMealPlanners} />
                  ) : activeMenu === "books" ? (
                    <MediaHubSection key="books" books={books} setBooks={setBooks} screenMedia={screenMedia} setScreenMedia={setScreenMedia} initialFormatFilter="Livre" />
                  ) : activeMenu === "screenmedia" ? (
                    <MediaHubSection key="screenmedia" books={books} setBooks={setBooks} screenMedia={screenMedia} setScreenMedia={setScreenMedia} initialFormatFilter="Série" />
                  ) : activeMenu === "project_folders" ? (
                    <ProjectFoldersSection
                      folders={folders}
                      setFolders={setFolders}
                      formations={formations}
                      setFormations={setFormations}
                      links={links}
                      setLinks={setLinks}
                      monthlyGoals={monthlyGoals}
                      setMonthlyGoals={setMonthlyGoals}
                      events={editorialEvents}
                      setEvents={setEditorialEvents}
                    />
                  ) : ["career_dash", "career_mobility", "career_sites", "career_companies", "career_skills", "career_certificates"].includes(activeMenu) ? (
                    <CareerSection activeTab={activeMenu.replace("career_", "") as any} onNavigate={handleMenuClick} />
                  ) : (activeMenu === "channels" || activeMenu === "formations") ? (
                    <MediaAndAcademySection
                      channels={channels}
                      setChannels={setChannels}
                    />
                  ) : activeMenu === "monthly_goals" ? (
                    <MonthlyGoalsSection 
                      goals={monthlyGoals} 
                      setGoals={setMonthlyGoals} 
                      folders={folders}
                      setFolders={setFolders}
                      availableChannels={channels.map(c => c.name)}
                    />
                  ) : activeMenu === "central_calendar" ? (
                    <CentralCalendar
                      dailyHabits={dailyHabits}
                      onToggleHabit={(id) => setDailyHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h))}
                      weeklyObjectives={weeklyObjectives}
                      actions30Jours={actions30Jours}
                      abonnements={abonnements}
                      achatsMensuels={achatsMensuels}
                      achatsCouteux={achatsCouteux}
                      epargnes={epargnes}
                      salaires={salaires}
                      transactions={transactions}
                      editorialEvents={editorialEvents}
                      monthlyGoals={monthlyGoals}
                    />
                  ) : activeMenu === "editorial_calendar" ? (
                    <EditorialCalendarSection
                      events={editorialEvents}
                      setEvents={setEditorialEvents}
                      folders={folders}
                      setFolders={setFolders}
                      availableChannels={channels.map(c => c.name)}
                    />
                  ) : activeMenu === "habits" ? (
                    <DisciplineHeatmap
                      habitHistory={habitHistory}
                      setHabitHistory={setHabitHistory}
                      dailyHabitsList={dailyHabits}
                      streakCount={streakCount}
                    />
                  ) : activeMenu === "actions30" ? (
                    <Actions30JoursSection
                      actions30Jours={actions30Jours}
                      setActions30Jours={setActions30Jours}
                    />
                  ) : activeMenu === "journal" ? (
                    <JournalSection entries={journalEntries} setEntries={setJournalEntries} />
                  ) : activeMenu === "budgets" ? (
                    <div className="space-y-6">
                      <BudgetOptimizer
                        transactions={transactions}
                        budgets={budgets}
                        onUpdateBudgetLimit={(category, newLimit) => {
                          setBudgets(prev => prev.map(b => b.category === category ? { ...b, limitAmount: newLimit } : b));
                        }}
                        onUpdateAllBudgets={(updatedBudgets) => {
                          setBudgets(updatedBudgets);
                        }}
                        triggerToast={triggerToast}
                      />
                      
                      {(() => {
                        const config = getModuleConfig("budgets");
                        if (!config) return null;
                        return (
                          <InteractiveModuleTable
                            title={config.title}
                            description={config.description}
                            columns={config.columns}
                            data={config.data}
                            onAdd={config.onAdd}
                            onEdit={config.onEdit}
                            onDelete={config.onDelete}
                            onImport={config.onImport}
                            currencySymbol="MAD"
                            placeholderText="Rechercher dans les budgets par catégorie..."
                          />
                        );
                      })()}
                    </div>
                  ) : (
                    <div>
                      {(() => {
                        const config = getModuleConfig(activeMenu);
                        if (!config) return (
                          <div className="text-center py-20 text-neutral-400 italic">
                            Module "{activeMenu}" en cours de déploiement dans votre espace personnel & professionnel.
                          </div>
                        );

                        const isEpargne = activeMenu === "epargnes";
                        const isAchatCouteux = activeMenu === "achats_couteux";
                        const onTransfer = isEpargne 
                          ? handleTransferEpargneToAchat 
                          : isAchatCouteux 
                            ? handleTransferAchatToEpargne 
                            : undefined;
                        const transferLabel = isEpargne 
                          ? "Vers Achat" 
                          : isAchatCouteux 
                            ? "Vers Épargne" 
                            : undefined;

                        return (
                          <InteractiveModuleTable
                            title={config.title}
                            description={config.description}
                            columns={config.columns}
                            data={config.data}
                            onAdd={config.onAdd}
                            onEdit={config.onEdit}
                            onDelete={config.onDelete}
                            onImport={config.onImport}
                            currencySymbol="MAD"
                            placeholderText={`Rechercher dans ${config.title.toLowerCase()}...`}
                            onTransfer={onTransfer}
                            transferLabel={transferLabel}
                          />
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* Footer Back navigation banner */}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => handleMenuClick("dashboard")}
                    className="text-xs text-neutral-500 hover:text-neutral-900 font-bold flex items-center gap-1 cursor-pointer bg-white border border-neutral-200 px-5 py-2.5 rounded-xl shadow-3xs hover:shadow-2xs transition-all"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Fermer la page et revenir à l'accueil</span>
                  </button>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </main>

        {/* Global Footer info banner */}
        <footer className="border-t border-neutral-200 bg-white py-6 text-center text-xs text-neutral-400 shrink-0 mt-12">
          <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 LIFE ARCHITECT • Second Brain Personnel & Professionnel. Tous droits réservés.</p>
            <div className="flex gap-4 text-neutral-500 font-semibold font-mono text-[9px]">
              <span>FINANCES</span>
              <span>•</span>
              <span>JOB & CARRIÈRE</span>
              <span>•</span>
              <span>CRÉATIONS</span>
              <span>•</span>
              <span>HABITUDE & DISCIPLINE</span>
            </div>
          </div>
        </footer>

      </div>

      {/* OVERDUE HABITS ALERTS MODAL */}
      <AnimatePresence>
        {showOverdueModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOverdueModal(false)}
              className="absolute inset-0 bg-neutral-950/60 backdrop-blur-xs"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-md bg-white border border-neutral-200 shadow-xl rounded-3xl overflow-hidden p-6 space-y-6 text-neutral-800 animate-in fade-in zoom-in duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-600 shrink-0 animate-bounce">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 block">Rappel de Discipline</span>
                  <h3 className="text-base font-black text-neutral-900 leading-tight">Habitudes importantes en retard !</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">
                    Certaines de vos disciplines d'élite indispensables à votre réussite n'ont pas encore été complétées aujourd'hui et l'heure limite est dépassée.
                  </p>
                </div>
              </div>

              {/* Overdue habits list */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {overdueHabitsAlert.map(h => (
                  <div 
                    key={h.id}
                    className="flex items-center justify-between p-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl shadow-3xs"
                  >
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-neutral-900 block">{h.name}</span>
                      {h.description && (
                        <span className="text-[10px] text-neutral-400 block">{h.description}</span>
                      )}
                    </div>
                    <span className="text-[9px] bg-amber-100 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-full font-bold font-mono shrink-0">
                      Limite: {h.dueTime}
                    </span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const idsToComplete = overdueHabitsAlert.map(h => h.id);
                    setDailyHabits(prev => prev.map(h => idsToComplete.includes(h.id) ? { ...h, completed: true } : h));
                    setShowOverdueModal(false);
                  }}
                  className="flex-1 bg-neutral-950 hover:bg-neutral-800 text-white font-bold text-xs uppercase tracking-wider py-3 px-4 rounded-xl transition-all cursor-pointer shadow-xs text-center"
                >
                  Tout marquer comme complété
                </button>
                <button
                  type="button"
                  onClick={() => setShowOverdueModal(false)}
                  className="bg-white hover:bg-neutral-50 text-neutral-700 border border-neutral-200 font-bold text-xs uppercase tracking-wider py-3 px-5 rounded-xl transition-all cursor-pointer text-center"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SECOND BRAIN COMMAND CENTER MODAL */}
      <CommandCenterModal
        isOpen={commandCenterOpen}
        onClose={() => setCommandCenterOpen(false)}
        setActiveMenu={setActiveMenu}
        categories={categories}
        focusMode={focusMode}
        toggleFocusMode={handleToggleFocusMode}
        resetRoutines={resetDailyRoutines}
        forceBackup={() => triggerToast("Données du Second Brain sauvegardées localement avec succès !", "success")}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* SYSTEM SETTINGS MODAL */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        cloudSyncEnabled={cloudSyncEnabled}
        onToggleCloudSync={handleToggleCloudSync}
        firebaseUser={firebaseUser}
        syncStatus={syncStatus}
        lastSyncedTime={lastSyncedTime}
        isSyncing={isSyncing}
        onForceSync={handleForceSync}
        isDriveConnected={!!driveAccessToken}
        isDriveLoading={isDriveLoading}
        onConnectDrive={handleConnectDrive}
        onDisconnectDrive={handleDisconnectDrive}
        onBackupToDrive={handleBackupToDrive}
        onRestoreFromDrive={handleRestoreFromDrive}
        driveLastSynced={driveLastSynced}
        driveAutoSync={driveAutoSync}
        onToggleDriveAutoSync={handleToggleDriveAutoSync}
        autoDarkTheme={autoDarkTheme}
        onToggleAutoDarkTheme={(enabled: boolean) => {
          setAutoDarkTheme(enabled);
          if (enabled) {
            triggerToast("Mode sombre automatique activé (19h00 - 7h00)", "success");
            const currentHour = new Date().getHours();
            setIsDarkMode(currentHour >= 19 || currentHour < 7);
          } else {
            triggerToast("Mode sombre automatique désactivé", "info");
          }
        }}
        currentTheme={themePreset}
        onSelectTheme={(preset) => {
          setThemePreset(preset);
          triggerToast("Thème visuel mis à jour", "success");
        }}
        onOpenThemeModal={() => setIsThemeModalOpen(true)}
        accounts={accounts}
        transactions={transactions}
        dailyHabits={dailyHabits}
        weeklyObjectives={weeklyObjectives}
        budgets={budgets}
        onUpdateBudgets={(updated) => setBudgets(updated)}
        epargnes={epargnes}
        abonnements={abonnements}
        stocks={stocks}
        journalEntries={journalEntries}
      />

      {/* THEME & COLOR PALETTE SELECTION MODAL */}
      <ThemeSelectorModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={(dark) => {
          if (autoDarkTheme) setAutoDarkTheme(false);
          setIsDarkMode(dark);
        }}
        currentTheme={themePreset}
        onSelectTheme={(preset) => {
          setThemePreset(preset);
          triggerToast("Thème visuel appliqué avec succès !", "success");
        }}
      />

      {/* SYNC CONFLICT RESOLUTION MODAL */}
      <AnimatePresence>
        {syncConflict && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                // Clicking outside does NOT dismiss, as resolution is required
              }}
              className="absolute inset-0 bg-neutral-950/75 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative w-full max-w-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-2xl rounded-3xl overflow-hidden p-6 space-y-6 text-neutral-800 dark:text-neutral-200 animate-in fade-in zoom-in duration-200"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-900/30 text-amber-600 dark:text-amber-400 shrink-0">
                  <AlertTriangle className="w-6 h-6 animate-pulse" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 block font-mono">Conflit de Synchronisation Multi-Appareil</span>
                  <h3 className="text-lg font-black text-neutral-900 dark:text-white leading-tight">Différence de versions détectée</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                    Vos données locales sur ce navigateur ont des modifications plus récentes que celles stockées sur votre espace Cloud. Choisissez quelle version conserver pour éviter d'écraser vos modifications récentes.
                  </p>
                </div>
              </div>

              {/* Premium Reconciliation Fusion Card */}
              <div className="p-4 rounded-2xl border border-emerald-500/30 dark:border-emerald-800/40 bg-emerald-50/10 dark:bg-emerald-950/10 space-y-3 relative flex flex-col justify-between">
                <span className="absolute top-3 right-3 text-[9px] bg-emerald-600 text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-200" /> Recommandé
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-neutral-900 dark:text-white pt-2">
                    <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
                    <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">Fusionner Intelligemment (Reconciliation)</span>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
                  Fusionne les données par module. Si vous avez modifié vos transactions financières sur un appareil et vos tâches sur un autre, <strong>les deux sont conservées et fusionnées</strong> au lieu de s'écraser.
                </p>
                <button
                  onClick={() => syncConflict.onResolve("merge")}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer text-center"
                >
                  Fusionner et Harmoniser les Appareils
                </button>
              </div>

              {/* Grid comparing local vs cloud versions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Local Version Card */}
                <div className="p-4 rounded-2xl border-2 border-indigo-500/20 bg-indigo-50/10 dark:bg-indigo-950/10 space-y-3 relative flex flex-col justify-between">
                  <span className="absolute top-3 right-3 text-[9px] bg-indigo-600 text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Local (Plus Récent)
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-neutral-900 dark:text-white pt-4">
                      <Settings className="w-4 h-4 text-indigo-500" />
                      <span className="text-xs font-black">Navigateur Actuel</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block font-mono">
                      Dernière modification : {syncConflict.localTime.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Conserve les données de cet appareil et met à jour le Cloud avec celles-ci. Recommandé si vous venez d'apporter des modifications.
                  </p>
                  <button
                    onClick={() => syncConflict.onResolve("local")}
                    className="w-full mt-2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-xs transition-all cursor-pointer text-center"
                  >
                    Conserver Version Locale
                  </button>
                </div>

                {/* Cloud Version Card */}
                <div className="p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/30 space-y-3 relative flex flex-col justify-between">
                  <span className="absolute top-3 right-3 text-[9px] bg-neutral-500 text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Cloud
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-neutral-900 dark:text-white pt-4">
                      <Database className="w-4 h-4 text-neutral-500" />
                      <span className="text-xs font-black">Espace Firebase Cloud</span>
                    </div>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block font-mono">
                      Dernière modification : {syncConflict.cloudTime.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    Remplace les données de cet appareil par celles stockées sur votre espace Cloud. Attention, les modifications non enregistrées de cet appareil seront perdues.
                  </p>
                  <button
                    onClick={() => syncConflict.onResolve("cloud")}
                    className="w-full mt-2 py-2 px-4 bg-neutral-150 hover:bg-neutral-250 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-750 dark:text-neutral-300 text-xs font-bold uppercase tracking-wider rounded-xl transition-all cursor-pointer text-center"
                  >
                    Charger Version Cloud
                  </button>
                </div>
              </div>

              <div className="text-center">
                <span className="text-[10px] text-neutral-400 font-mono">
                  LIFE ARCHITECT • Version Engine V2.1
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GLOBAL TOAST NOTIFICATION CONTAINER */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-6 right-6 z-[200] max-w-sm bg-neutral-900 text-white border border-neutral-800 shadow-2xl rounded-2xl overflow-hidden p-4 flex items-center gap-3.5"
          >
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20 shrink-0">
              <ClipboardCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black text-white font-sans uppercase tracking-wide">Système de Planification</p>
              <p className="text-[11px] text-neutral-300 font-medium leading-normal mt-0.5">{toast.message}</p>
            </div>
            <button 
              onClick={() => setToast(null)}
              className="p-1 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-all cursor-pointer shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
