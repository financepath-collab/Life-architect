import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  DailyHabit, 
  WeeklyObjective,
  FinanceTransaction, 
  FinanceVirement, 
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
  EditorialEvent
} from "./types";



import { 
  INITIAL_HABITS, 
  INITIAL_WEEKLY_OBJECTIVES,
  INITIAL_TRANSACTIONS, 
  INITIAL_VIREMENTS, 
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
  INITIAL_EDITORIAL_EVENTS
} from "./initialData";

import InteractiveModuleTable, { TableColumn } from "./components/InteractiveModuleTable";
import FinanceCharts from "./components/FinanceCharts";
import NetSavingsChart from "./components/NetSavingsChart";
import FocusSport from "./components/FocusSport";
import SkinTrackerSection from "./components/SkinTrackerSection";
import PerformanceCorrelations from "./components/PerformanceCorrelations";
import BooksSection from "./components/BooksSection";
import ScreenMediaSection from "./components/ScreenMediaSection";
import FormationsSection from "./components/FormationsSection";
import ProjectFoldersSection from "./components/ProjectFoldersSection";
import AlertsBanner from "./components/AlertsBanner";
import CriticalSubscriptionsAlert from "./components/CriticalSubscriptionsAlert";
import MonthlyPerformanceCard from "./components/MonthlyPerformanceCard";
import MonthlyGoalsSection from "./components/MonthlyGoalsSection";
import EditorialCalendarSection from "./components/EditorialCalendarSection";
import WeatherWidget from "./components/WeatherWidget";
import DisciplineHeatmap from "./components/DisciplineHeatmap";
import FireCalculator from "./components/FireCalculator";



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
  Tv, 
  ChevronDown, 
  ChevronRight, 
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
  Star
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
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem("la_theme") === "dark";
  });
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem("la_is_unlocked") === "true";
  });

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
    finance: true,
    productivity: true,
    health: false,
    purchases: false,
    projets: true,
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
          return {
            ...h,
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

  const [overdueHabitsAlert, setOverdueHabitsAlert] = useState<DailyHabit[]>([]);
  const [showOverdueModal, setShowOverdueModal] = useState<boolean>(false);

  const [weeklyObjectives, setWeeklyObjectives] = useState<WeeklyObjective[]>(() => {
    const saved = localStorage.getItem("mp_weekly_objectives_v2");
    return saved ? JSON.parse(saved) : INITIAL_WEEKLY_OBJECTIVES;
  });

  const [transactions, setTransactions] = useState<FinanceTransaction[]>(() => {
    const saved = localStorage.getItem("mp_transactions_v2");
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [virements, setVirements] = useState<FinanceVirement[]>(() => {
    const saved = localStorage.getItem("mp_virements_v2");
    return saved ? JSON.parse(saved) : INITIAL_VIREMENTS;
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
    return saved ? JSON.parse(saved) : INITIAL_EPARGNES;
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
    localStorage.setItem("mp_sport_history", JSON.stringify(sportHistory));
  }, [sportHistory]);

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
    return saved ? JSON.parse(saved) : INITIAL_CHANNELS;
  });

  const [wishList, setWishList] = useState<WishListItem[]>(() => {
    const saved = localStorage.getItem("mp_wishlist_v2");
    return saved ? JSON.parse(saved) : INITIAL_WISHLIST;
  });

  const [achatsCouteux, setAchatsCouteux] = useState<AchatCouteuxItem[]>(() => {
    const saved = localStorage.getItem("mp_achats_couteux_v2");
    return saved ? JSON.parse(saved) : INITIAL_ACHATS_COUTEUX;
  });

  const [monthlyGoals, setMonthlyGoals] = useState<MonthlyGoal[]>(() => {
    const saved = localStorage.getItem("mp_monthly_goals_v2");
    return saved ? JSON.parse(saved) : INITIAL_MONTHLY_GOALS;
  });

  const [editorialEvents, setEditorialEvents] = useState<EditorialEvent[]>(() => {
    const saved = localStorage.getItem("mp_editorial_events_v2");
    return saved ? JSON.parse(saved) : INITIAL_EDITORIAL_EVENTS;
  });



  // Stats / Streaks
  const [streakCount, setStreakCount] = useState<number>(() => {
    const saved = localStorage.getItem("mp_streak_count_v2");
    return saved ? parseInt(saved) : 7;
  });

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

  // --- LOCALSTORAGE SYNC EFFECT ---
  useEffect(() => {
    localStorage.setItem("mp_habits_v2", JSON.stringify(dailyHabits));
  }, [dailyHabits]);

  useEffect(() => {
    localStorage.setItem("mp_habit_history_v2", JSON.stringify(habitHistory));
  }, [habitHistory]);

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
    localStorage.setItem("mp_weekly_objectives_v2", JSON.stringify(weeklyObjectives));
  }, [weeklyObjectives]);

  useEffect(() => {
    localStorage.setItem("mp_transactions_v2", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("mp_virements_v2", JSON.stringify(virements));
  }, [virements]);

  useEffect(() => {
    localStorage.setItem("mp_stocks_v2", JSON.stringify(stocks));
  }, [stocks]);

  useEffect(() => {
    localStorage.setItem("mp_budgets_v2", JSON.stringify(budgets));
  }, [budgets]);

  useEffect(() => {
    localStorage.setItem("mp_salaires_v2", JSON.stringify(salaires));
  }, [salaires]);

  useEffect(() => {
    localStorage.setItem("mp_epargnes_v2", JSON.stringify(epargnes));
  }, [epargnes]);

  useEffect(() => {
    localStorage.setItem("mp_actions30_v2", JSON.stringify(actions30Jours));
  }, [actions30Jours]);

  useEffect(() => {
    localStorage.setItem("mp_profil_v2", JSON.stringify(profilAmeliorations));
  }, [profilAmeliorations]);

  useEffect(() => {
    localStorage.setItem("mp_possibilites_v2", JSON.stringify(possibilitesGoals));
  }, [possibilitesGoals]);

  useEffect(() => {
    localStorage.setItem("mp_skin_v2", JSON.stringify(skinTrackers));
  }, [skinTrackers]);

  // Synchronisation bidirectionnelle : Skin Tracker -> Habit Tracker
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayEntry = skinTrackers.find(entry => entry.date === todayStr);
    const isDoneToday = todayEntry ? (todayEntry.morningRoutine || todayEntry.eveningRoutine) : false;
    
    setDailyHabits(prev => {
      const targetHabit = prev.find(h => h.id === "h5" || h.name.toLowerCase().includes("skin care") || h.name.toLowerCase().includes("routine de soins"));
      if (targetHabit && targetHabit.completed !== isDoneToday) {
        return prev.map(h => (h.id === targetHabit.id) ? { ...h, completed: isDoneToday } : h);
      }
      return prev;
    });
  }, [skinTrackers]);

  // Synchronisation bidirectionnelle : Habit Tracker -> Skin Tracker
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const skinHabit = dailyHabits.find(h => h.id === "h5" || h.name.toLowerCase().includes("skin care") || h.name.toLowerCase().includes("routine de soins"));
    if (!skinHabit) return;
    
    const isHabitCompleted = skinHabit.completed;
    const todayEntry = skinTrackers.find(entry => entry.date === todayStr);
    const isSkinCompleted = todayEntry ? (todayEntry.morningRoutine || todayEntry.eveningRoutine) : false;
    
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
  }, [dailyHabits]);

  // Synchronisation bidirectionnelle : Sport Exercises -> Habit Tracker
  useEffect(() => {
    const isAnyExerciseDone = sportExercises.some(ex => ex.completed);
    
    setDailyHabits(prev => {
      const targetHabit = prev.find(h => h.id === "h3" || h.name.toLowerCase().includes("sport"));
      if (targetHabit && targetHabit.completed !== isAnyExerciseDone) {
        return prev.map(h => (h.id === targetHabit.id) ? { ...h, completed: isAnyExerciseDone } : h);
      }
      return prev;
    });
  }, [sportExercises]);

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

  // Synchronisation bidirectionnelle : Habit Tracker -> Sport Exercises
  useEffect(() => {
    const sportHabit = dailyHabits.find(h => h.id === "h3" || h.name.toLowerCase().includes("sport"));
    if (!sportHabit) return;
    
    const isHabitCompleted = sportHabit.completed;
    const isAnyExerciseDone = sportExercises.some(ex => ex.completed);
    
    if (isHabitCompleted !== isAnyExerciseDone) {
      if (isHabitCompleted) {
        setSportExercises(prev => prev.map(ex => ({ ...ex, completed: true })));
      } else {
        setSportExercises(prev => prev.map(ex => ({ ...ex, completed: false })));
      }
    }
  }, [dailyHabits]);

  useEffect(() => {
    localStorage.setItem("mp_sport_exercises", JSON.stringify(sportExercises));
  }, [sportExercises]);

  useEffect(() => {
    localStorage.setItem("mp_meal_v2", JSON.stringify(mealPlanners));
  }, [mealPlanners]);

  useEffect(() => {
    localStorage.setItem("la_focus_mode", String(focusMode));
  }, [focusMode]);

  useEffect(() => {
    localStorage.setItem("mp_achats_v2", JSON.stringify(achatsMensuels));
  }, [achatsMensuels]);

  useEffect(() => {
    localStorage.setItem("mp_abonnements_v2", JSON.stringify(abonnements));
  }, [abonnements]);

  useEffect(() => {
    localStorage.setItem("mp_formations_v2", JSON.stringify(formations));
  }, [formations]);

  useEffect(() => {
    localStorage.setItem("mp_books_v3", JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem("mp_screenmedia_v3", JSON.stringify(screenMedia));
  }, [screenMedia]);

  useEffect(() => {
    localStorage.setItem("mp_accounts_v2", JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem("mp_links_v2", JSON.stringify(links));
  }, [links]);

  useEffect(() => {
    localStorage.setItem("mp_channels_v2", JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem("mp_wishlist_v2", JSON.stringify(wishList));
  }, [wishList]);

  useEffect(() => {
    localStorage.setItem("mp_achats_couteux_v2", JSON.stringify(achatsCouteux));
  }, [achatsCouteux]);

  useEffect(() => {
    localStorage.setItem("mp_streak_count_v2", streakCount.toString());
  }, [streakCount]);

  useEffect(() => {
    localStorage.setItem("mp_monthly_goals_v2", JSON.stringify(monthlyGoals));
  }, [monthlyGoals]);

  useEffect(() => {
    localStorage.setItem("mp_editorial_events_v2", JSON.stringify(editorialEvents));
  }, [editorialEvents]);




  // --- UTILITY ACTION HANDLERS ---

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

  // Focus Mode Toggle handler with redirect and state check
  const handleToggleFocusMode = () => {
    const nextVal = !focusMode;
    setFocusMode(nextVal);
    if (nextVal) {
      setDashboardTab("routines");
      const distractingMenuIds = [
        "comptes", "transactions", "virements", "stocks", "budgets", "salaires", "epargnes", "charts",
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


  // --- DYNAMIC MODULE RENDERING SCHEMA & CONTROLLER MAP ---

  const categories = [
    {
      id: "finance",
      label: "Finance",
      icon: Coins,
      items: [
        { id: "comptes", label: "Comptes Bancaires", icon: Landmark, desc: "Gestion des comptes pro, perso et liquidités." },
        { id: "transactions", label: "Transactions", icon: Briefcase, desc: "Historique complet de vos entrées d'argent et dépenses." },
        { id: "virements", label: "Virements", icon: RefreshCw, desc: "Planification et suivi des virements inter-comptes." },
        { id: "stocks", label: "Portefeuille Bourse", icon: Wallet, desc: "Suivi de vos investissements en BVC." },
        { id: "budgets", label: "Budgets Mensuels", icon: Landmark, desc: "Gestion de vos plafonds de dépenses par enveloppe." },
        { id: "salaires", label: "Salaires & Revenus", icon: TrendingUp, desc: "Suivi de vos rentrées professionnelles et AdSense." },
        { id: "epargnes", label: "Objectifs Épargne", icon: PiggyBank, desc: "Progression vers vos projets immobiliers ou d'équipements." },
        { id: "charts", label: "Graphiques & Analyses", icon: BarChart3, desc: "Visualisation complète de votre santé financière." }
      ]
    },
    {
      id: "productivity",
      label: "Productivité",
      icon: CheckSquare,
      items: [
        { id: "habits", label: "Habits Tracker", icon: Flame, desc: "Discipline de vie quotidienne et routines créatives." },
        { id: "actions30", label: "Actions 30 Jours", icon: Calendar, desc: "Sprint de combat de 30 jours pour projets créateurs." },
        { id: "profil", label: "Profil & Compétences", icon: User, desc: "Montée en compétences ciblée pour vos friction areas." },
        { id: "goals", label: "Possibilités & Goals", icon: Award, desc: "Planification de vos buts de vie majeurs." },
        { id: "monthly_goals", label: "Objectifs Mensuels", icon: Target, desc: "Cibles de revenus et de progression pour chaque chaîne de contenu." }
      ]
    },
    {
      id: "health",
      label: "Santé & Soins",
      icon: Heart,
      items: [
        { id: "skin", label: "Skin Tracker", icon: Sparkles, desc: "Consistance beauté, SPF et routine cutanée journalière." },
        { id: "meal", label: "Meal Planner", icon: Layers, desc: "Planification des menus, calories et dîners de demain." },
        { id: "sport", label: "Focus Sport", icon: Dumbbell, desc: "Minuterie de 30 min, exercices de sport et playlist d'entraînement." }
      ]
    },
    {
      id: "purchases",
      label: "Achats",
      icon: ShoppingCart,
      items: [
        { id: "achats", label: "Achats Mensuels", icon: ShoppingCart, desc: "Liste de shopping, matériel pro et fournitures." },
        { id: "abonnements", label: "Abonnements & Charges", icon: Bell, desc: "Contrôle de vos dépenses récurrentes et hébergement." },
        { id: "wishlist", label: "Wish List", icon: Gift, desc: "Objets de désir et grands projets d'achat à long terme." },
        { id: "achats_couteux", label: "Achats Coûteux", icon: Hourglass, desc: "Achats importants de moyenne échelle prévus à moyen terme." }
      ]
    },
    {
      id: "projets",
      label: "Projets & Académie",
      icon: FolderKanban,
      items: [
        { id: "project_folders", label: "Dossiers de Projets", icon: FolderOpen, desc: "Organisez vos formations, objectifs de croissance et ressources par projet créateur ou d'académie." },
        { id: "formations", label: "Carrière & Formations", icon: GraduationCap, desc: "Suivi complet de vos formations, compétences ciblées et opportunités de recrutement." },
        { id: "macircle", label: "Académie \"The MA Circle\"", icon: Globe, desc: "Monétisation de vos canaux YouTube, formations produites et ventes de produits digitaux." },
        { id: "channels", label: "Chaînes & Médias", icon: Tv, desc: "Abonnés et fréquence de publication de vos chaînes." },
        { id: "editorial_calendar", label: "Calendrier Éditorial", icon: Calendar, desc: "Visualisez sous forme de calendrier les dates de publication prévues pour vos 3 chaînes YouTube et autres plateformes." },
        { id: "links", label: "Liens Favoris", icon: Link2, desc: "Signets rapides vers vos ressources de marché bourse." }
      ]
    },
    {
      id: "formation",
      label: "Lectures & Écrans",
      icon: BookOpen,
      items: [
        { id: "books", label: "Lectures & Livres", icon: BookOpen, desc: "Suivi détaillé de vos lectures en cours, terminées et wishlist." },
        { id: "screenmedia", label: "Séries, Animes & Films", icon: Film, desc: "File de visionnage et progression d'épisodes de vos écrans." }
      ]
    }
  ];

  const visibleCategories = useMemo(() => {
    if (!focusMode) return categories;
    // Masquer les flux financiers et de divertissement (Finance, Achats, Lectures & Écrans)
    return categories.filter(cat => cat.id !== "finance" && cat.id !== "purchases" && cat.id !== "formation");
  }, [focusMode, categories]);

  const getModuleConfig = (moduleId: string) => {
    switch (moduleId) {
      case "transactions":
        return {
          title: "Transactions Réelles",
          description: "Historique complet de vos entrées d'argent et vos dépenses courantes.",
          data: transactions,
          onAdd: (item: any) => setTransactions(prev => [item, ...prev]),
          onEdit: (id: string, updated: any) => setTransactions(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setTransactions(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setTransactions(prev => [...items, ...prev]),
          columns: [
            { key: "date", label: "Date", type: "date", required: true },
            { key: "description", label: "Description", type: "text", required: true },
            { 
              key: "category", 
              label: "Catégorie", 
              type: "select", 
              options: ["Revenus Pro", "Sponsor", "AdSense", "Équipement", "Repas", "Logiciels", "Alimentation", "Transport", "Loisirs", "Autres"] 
            },
            { key: "type", label: "Type", type: "select", options: ["Revenue", "Dépense"] },
            { key: "amount", label: "Montant (MAD)", type: "number", required: true },
            { key: "account", label: "Compte", type: "text" }
          ] as TableColumn[]
        };

      case "virements":
        return {
          title: "Virements & Transferts",
          description: "Planification et suivi des virements de compte à compte ou d'épargne.",
          data: virements,
          onAdd: (item: any) => setVirements(prev => [item, ...prev]),
          onEdit: (id: string, updated: any) => setVirements(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setVirements(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setVirements(prev => [...items, ...prev]),
          columns: [
            { key: "date", label: "Date", type: "date", required: true },
            { key: "description", label: "Description", type: "text", required: true },
            { key: "sourceAccount", label: "Compte Source", type: "text", required: true },
            { key: "targetAccount", label: "Compte Cible", type: "text", required: true },
            { key: "amount", label: "Montant (MAD)", type: "number", required: true },
            { key: "status", label: "Statut", type: "select", options: ["Planifié", "Exécuté", "Annulé"] }
          ] as TableColumn[]
        };

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
          title: "Habits Tracker (Habitudes)",
          description: "Cochez vos disciplines journalières pour maintenir votre niveau d'excellence.",
          data: dailyHabits,
          onAdd: (item: any) => setDailyHabits(prev => [...prev, item]),
          onEdit: (id: string, updated: any) => setDailyHabits(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setDailyHabits(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setDailyHabits(prev => [...prev, ...items]),
          columns: [
            { key: "name", label: "Habitude", type: "text", required: true },
            { key: "description", label: "Description / Fréquence", type: "text" },
            { key: "category", label: "Catégorie", type: "select", options: ["personal", "professional"] },
            { key: "isImportant", label: "Importante", type: "boolean" },
            { key: "dueTime", label: "Heure Limite (ex: 12:00)", type: "text" },
            { key: "completed", label: "Fait Aujourd'hui", type: "boolean" }
          ] as TableColumn[]
        };

      case "actions30":
        return {
          title: "Actions 30 Jours (Sprint)",
          description: "Plan d'attaque quotidien intensif de 30 jours pour lancer un projet créateur.",
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

      case "goals":
        return {
          title: "Possibilités & Goals (Objectifs de Vie)",
          description: "Réglez vos objectifs stratégiques à court, moyen et long terme.",
          data: possibilitesGoals,
          onAdd: (item: any) => setPossibilitesGoals(prev => [...prev, item]),
          onEdit: (id: string, updated: any) => setPossibilitesGoals(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setPossibilitesGoals(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setPossibilitesGoals(prev => [...prev, ...items]),
          columns: [
            { key: "title", label: "Intitulé du Goal", type: "text", required: true },
            { key: "type", label: "Période", type: "select", options: ["Court Terme", "Moyen Terme", "Long Terme"] },
            { key: "targetYear", label: "Année Cible", type: "text", required: true },
            { key: "description", label: "Pourquoi & Comment", type: "text" },
            { key: "completed", label: "Atteint", type: "boolean" }
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
          title: "Suivi des Chaînes & Médias du Créateur",
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

    return {
      netWorth,
      habitsRate,
      activeEpargnes,
      activeSubscribers,
      habitsCompleted
    };
  }, [accounts, stocks, dailyHabits, epargnes, abonnements]);

  const activeCategoryObj = React.useMemo(() => {
    return categories.find(cat => cat.items.some(item => item.id === activeMenu));
  }, [activeMenu, categories]);

  // Handle clicking a category row
  const handleCategoryClick = (catId: string) => {
    // Expand category
    setExpandedCategories(prev => ({
      ...prev,
      [catId]: true
    }));
    // Navigate to the first sub-item of that category
    const cat = categories.find(c => c.id === catId);
    if (cat && cat.items.length > 0) {
      handleMenuClick(cat.items[0].id);
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

      case "purchases":
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
      sessionStorage.setItem("la_is_unlocked", "true");
      setLoginError("");
    } else {
      setLoginError("Identifiant ou mot de passe incorrect.");
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

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-3.5">
            
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
              className="w-full bg-white hover:bg-neutral-100 text-neutral-950 font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer select-none"
            >
              Se connecter
            </button>

          </form>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 flex flex-col font-sans antialiased">
      
      {/* UNIFIED STICKY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 xl:gap-4">
          
          {/* Logo & Brand (Left) */}
          <div 
            onClick={() => handleMenuClick("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none"
          >
            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center shadow-sm shrink-0 border border-neutral-800">
              <Logo className="w-5 h-5 text-white" />
            </div>
            <div className="hidden 2xl:block">
              <span className="text-[8px] font-bold text-neutral-400 block tracking-widest uppercase font-mono leading-none">SYSTEM INTEGRATION</span>
              <span className="text-xs font-black text-neutral-900 block leading-tight mt-0.5">LIFE ARCHITECT</span>
            </div>
          </div>

          {/* Horizontal Navigation Menus (Center - Desktop only) */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 h-full overflow-visible">
            
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
              <span className="hidden 2xl:inline">Tableau de Bord</span>
              <span className="2xl:hidden">Dashboard</span>
            </button>

            {/* Categories Hover Dropdowns */}
            {visibleCategories.map(cat => {
              const CatIcon = cat.icon;
              const isCatActive = activeCategoryObj?.id === cat.id;
              
              // Responsive label to prevent overflow on medium screens
              const displayLabel = 
                cat.label === "Projets & Académie" ? (
                  <>
                    <span className="hidden 2xl:inline">Projets & Académie</span>
                    <span className="2xl:hidden">Projets</span>
                  </>
                ) : cat.label === "Lectures & Écrans" ? (
                  <>
                    <span className="hidden 2xl:inline">Lectures & Écrans</span>
                    <span className="2xl:hidden">Lectures</span>
                  </>
                ) : cat.label === "Banque" ? (
                  <>
                    <span className="hidden 2xl:inline">Banque</span>
                    <span className="2xl:hidden">Banque</span>
                  </>
                ) : cat.label === "Santé & Soins" ? (
                  <>
                    <span className="hidden 2xl:inline">Santé & Soins</span>
                    <span className="2xl:hidden">Santé</span>
                  </>
                ) : cat.label === "Productivité" ? (
                  <>
                    <span className="hidden 2xl:inline">Productivité</span>
                    <span className="2xl:hidden">Prod.</span>
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
              <span className="hidden 2xl:inline">Nouveau Jour</span>
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
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
              className="lg:hidden p-2 bg-neutral-50 hover:bg-neutral-100 rounded-xl border border-neutral-200 text-neutral-800 focus:outline-none cursor-pointer"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

        </div>

        {/* MOBILE DROPDOWN DRAWER OVERLAY */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-x-0 top-16 bottom-0 z-45 bg-white border-t border-neutral-200 overflow-y-auto animate-in slide-in-from-top duration-300">
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
        <main className="flex-1 p-8 overflow-y-auto space-y-8 max-w-7xl w-full mx-auto">

          
          {/* TAB 1: TABLEAU DE BORD (MAIN HOME CONTROLLER) */}
          {activeMenu === "dashboard" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* Minimalist Intro Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-neutral-200/60">
                <div className="space-y-1">
                  <h1 className="text-2xl font-black text-neutral-900 tracking-tight font-sans">
                    Bonjour ! Prêt à créer aujourd'hui ?
                  </h1>
                  <p className="text-xs text-neutral-500 max-w-2xl">
                    {focusMode ? (
                      <span className="inline-flex items-center gap-1.5 font-semibold text-neutral-800 bg-neutral-100 py-1 px-2.5 rounded-lg border border-neutral-200/50">
                        <Flame className="w-3.5 h-3.5 text-neutral-800 fill-neutral-400 animate-pulse shrink-0" />
                        Mode Concentration activé. Vos statistiques financières sont masquées pour vous focaliser sur vos disciplines et objectifs.
                      </span>
                    ) : (
                      <>
                        Suivi de vos 3 chaînes de contenu (<span className="font-semibold">The Moroccan Analyst</span>, <span className="font-semibold">The Moroccan CFO</span>, <span className="font-semibold">The Moroccan Economist</span>) et de votre santé financière.
                      </>
                    )}
                  </p>
                </div>
                
                {/* Actions Group */}
                <div className="flex items-center gap-2.5 shrink-0 self-start md:self-center">
                  {/* Weather Toggle */}
                  <button
                    onClick={() => setShowWeather(!showWeather)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer select-none font-sans text-xs font-bold ${
                      showWeather
                        ? "bg-neutral-900 border-neutral-900 text-white shadow-xs hover:bg-neutral-800"
                        : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                    }`}
                    title="Afficher la météo inspirante du Maroc"
                  >
                    <span className="text-sm">⛅</span>
                    <span className="whitespace-nowrap uppercase tracking-wider text-[10px]">
                      {showWeather ? "Masquer Météo" : "Météo Inspirante"}
                    </span>
                  </button>

                  {/* Focus Mode Toggle */}
                  <button
                    onClick={() => {
                      setFocusMode(!focusMode);
                      if (!focusMode) {
                        setDashboardTab("routines");
                      }
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all cursor-pointer select-none font-sans text-xs font-bold ${
                      focusMode
                        ? "bg-neutral-900 border-neutral-900 text-white shadow-xs hover:bg-neutral-800"
                        : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                    }`}
                    title="Masquer le financier et se concentrer sur les disciplines quotidiennes"
                  >
                    <div className="relative w-7 h-4 rounded-full bg-neutral-200 transition-colors shrink-0">
                      <div className={`absolute top-0.5 left-0.5 w-3 h-3 rounded-full bg-white shadow-xs transition-transform duration-205 ${
                        focusMode ? "translate-x-3 bg-neutral-900" : "bg-neutral-400"
                      }`} />
                    </div>
                    <span className="whitespace-nowrap uppercase tracking-wider text-[10px]">
                      {focusMode ? "Concentration Active" : "Mode Concentration"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Weather Widget (Collapsible) */}
              {showWeather && (
                <div className="animate-in slide-in-from-top duration-250">
                  <WeatherWidget />
                </div>
              )}

              {/* Critical Subscriptions Alert (Prélèvements imminents < 3 jours) */}
              {!focusMode && (
                <CriticalSubscriptionsAlert
                  abonnements={abonnements}
                  onNavigateToModule={handleNavigateToModule}
                />
              )}

              {/* Notifications & Visual Alerts Center */}
              {!focusMode && (
                <AlertsBanner
                  abonnements={abonnements}
                  profilAmeliorations={profilAmeliorations}
                  epargnes={epargnes}
                  dailyHabits={dailyHabits}
                  onNavigateToModule={handleNavigateToModule}
                />
              )}

              {/* General Statistics Cards */}
              {!focusMode ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Net Worth */}
                    <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 flex items-center justify-between shadow-2xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Patrimoine Est.</span>
                        <h4 className="text-xl font-bold font-mono text-neutral-900">
                          {dashboardStats.netWorth.toLocaleString("fr-FR")} MAD
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-medium">BVC + Soldes bancaires</span>
                      </div>
                      <div className="p-3 bg-neutral-100 rounded-xl text-neutral-900 border border-neutral-200">
                        <Coins className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Habits Completion */}
                    <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 flex items-center justify-between shadow-2xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Discipline du jour</span>
                        <h4 className="text-xl font-bold font-mono text-neutral-900">
                          {dashboardStats.habitsRate.toFixed(0)}%
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-medium">
                          {dashboardStats.habitsCompleted} / {dailyHabits.length} habitudes validées
                        </span>
                      </div>
                      <div className="p-3 bg-neutral-100 rounded-xl text-neutral-900 border border-neutral-200">
                        <Flame className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Savings goals */}
                    <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 flex items-center justify-between shadow-2xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Objectifs Épargne</span>
                        <h4 className="text-xl font-bold font-mono text-neutral-900">
                          {dashboardStats.activeEpargnes} En cours
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-medium">Projets immobiliers & tech</span>
                      </div>
                      <div className="p-3 bg-neutral-100 rounded-xl text-neutral-900 border border-neutral-200">
                        <PiggyBank className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Active SaaS Subscriptions */}
                    <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 flex items-center justify-between shadow-2xs">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">SaaS & Abonnements</span>
                        <h4 className="text-xl font-bold font-mono text-neutral-900">
                          {dashboardStats.activeSubscribers} Actifs
                        </h4>
                        <span className="text-[10px] text-neutral-400 font-medium">Logiciels pro & serveurs</span>
                      </div>
                      <div className="p-3 bg-neutral-100 rounded-xl text-neutral-900 border border-neutral-200">
                        <Bell className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Interactive Monthly Net Performance Card */}
                  <MonthlyPerformanceCard transactions={transactions} />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Habits Completion (Discipline) - Expanded and stylized */}
                  <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex items-center justify-between shadow-md text-white">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-neutral-300 uppercase tracking-widest block">Discipline du Jour</span>
                      <h4 className="text-3xl font-black font-mono">
                        {dashboardStats.habitsRate.toFixed(0)}%
                      </h4>
                      <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                        {dashboardStats.habitsCompleted} de vos {dailyHabits.length} habitudes quotidiennes validées. Continuez ainsi !
                      </p>
                    </div>
                    <div className="p-4 bg-neutral-800 rounded-2xl text-neutral-300 border border-neutral-700 shrink-0">
                      <Flame className="w-8 h-8 animate-pulse fill-neutral-300" />
                    </div>
                  </div>

                  {/* Active 30-Day Sprint Stats Card */}
                  <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 flex items-center justify-between shadow-2xs">
                    <div className="space-y-2">
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block">Sprints de Combat Actifs</span>
                      <h4 className="text-3xl font-black font-mono text-neutral-900">
                        {actions30Jours.length} Sprints
                      </h4>
                      <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                        Vos plans d'action à 30 jours pour rester focalisé sur le long terme de vos projets.
                      </p>
                    </div>
                    <div className="p-4 bg-neutral-100 rounded-2xl text-neutral-800 border border-neutral-200 shrink-0">
                      <Award className="w-8 h-8 text-neutral-700" />
                    </div>
                  </div>
                </div>
              )}

              {/* INTERACTIVE DASHBOARD SECTION TABS */}
              {!focusMode && (
                <div className="border-b border-neutral-200/80 pt-2">
                  <div className="flex items-center gap-1 overflow-x-auto pb-px scrollbar-none">
                    <button
                      onClick={() => setDashboardTab("routines")}
                      className={`flex items-center gap-2 px-5 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px cursor-pointer select-none ${
                        dashboardTab === "routines"
                          ? "border-neutral-900 text-neutral-900 font-extrabold"
                          : "border-transparent text-neutral-400 hover:text-neutral-950 hover:border-neutral-200"
                      }`}
                    >
                      <Flame className="w-4 h-4 text-neutral-800 fill-neutral-400 shrink-0" />
                      <span>🎯 DISCIPLINES & OBJECTIFS</span>
                    </button>

                    <button
                      onClick={() => setDashboardTab("charts")}
                      className={`flex items-center gap-2 px-5 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px cursor-pointer select-none ${
                        dashboardTab === "charts"
                          ? "border-neutral-900 text-neutral-900 font-extrabold"
                          : "border-transparent text-neutral-400 hover:text-neutral-950 hover:border-neutral-200"
                      }`}
                    >
                      <BarChart3 className="w-4 h-4 text-neutral-400" />
                      <span>📊 RAPPORT FINANCIER SYNTHÉTIQUE</span>
                    </button>

                    <button
                      onClick={() => setDashboardTab("launchpad")}
                      className={`flex items-center gap-2 px-5 py-3 text-xs font-bold whitespace-nowrap transition-all border-b-2 -mb-px cursor-pointer select-none ${
                        dashboardTab === "launchpad"
                          ? "border-neutral-900 text-neutral-900 font-extrabold"
                          : "border-transparent text-neutral-400 hover:text-neutral-950 hover:border-neutral-200"
                      }`}
                    >
                      <Layers className="w-4 h-4 text-neutral-400" />
                      <span>🔌 CONSOLE DE LANCEMENT (MODULES)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB CONTENT RENDERING */}
              <AnimatePresence mode="wait">
                {(dashboardTab === "routines" || focusMode) && (
                  <motion.div
                    key="routines"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Bilan des Performances de la Semaine */}
                    {(() => {
                      const metrics = getWeeklyPerformanceMetrics();
                      return (
                        <div className="bg-neutral-50/60 border border-neutral-200/80 rounded-2xl p-5 shadow-3xs space-y-4">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                              <span className="p-1.5 bg-neutral-900 text-white rounded-lg">
                                <TrendingUp className="w-4 h-4" />
                              </span>
                              <div>
                                <h3 className="text-xs font-black text-neutral-950 uppercase tracking-tight block">
                                  Bilan des Performances de la Semaine
                                </h3>
                                <p className="text-[10px] text-neutral-400 font-medium">
                                  Suivi de votre discipline quotidienne et objectifs de la semaine
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-bold text-neutral-500 bg-white border border-neutral-200 px-2.5 py-1 rounded-full font-mono shadow-3xs self-start sm:self-center">
                              Semaine du {getWeekRangeLabel()}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Card 1: Habits Completion vs Missed */}
                            <div className="bg-white border border-neutral-200/60 rounded-xl p-4 shadow-3xs flex flex-col justify-between space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                                  Discipline Quotidienne
                                </span>
                                <span className="p-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg">
                                  <Flame className="w-3.5 h-3.5" />
                                </span>
                              </div>
                              <div>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-xl font-black font-mono text-neutral-950">
                                    {metrics.completedHabits}
                                  </span>
                                  <span className="text-xs text-neutral-400 font-bold">
                                    /{metrics.expectedHabits}
                                  </span>
                                  <span className="text-[10px] text-neutral-400 font-bold ml-1">
                                    réalisées
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 mt-1 text-[10px] font-bold">
                                  <span className="text-emerald-600 bg-emerald-50/50 border border-emerald-100 px-1.5 py-0.5 rounded">
                                    {metrics.completionRate}% Assiduité
                                  </span>
                                  <span className="text-neutral-400">
                                    • {metrics.missedHabits} manquée(s)
                                  </span>
                                </div>
                              </div>
                              <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-neutral-900 h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${metrics.completionRate}%` }}
                                />
                              </div>
                            </div>

                            {/* Card 2: Priority Objectives Reached */}
                            <div className="bg-white border border-neutral-200/60 rounded-xl p-4 shadow-3xs flex flex-col justify-between space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                                  Objectifs Prioritaires
                                </span>
                                <span className="p-1 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg">
                                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                                </span>
                              </div>
                              <div>
                                {metrics.priorityTotal === 0 ? (
                                  <div className="text-[11px] text-neutral-400 italic py-1 font-medium">
                                    Aucun objectif prioritaire défini
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-baseline gap-1.5">
                                      <span className="text-xl font-black font-mono text-neutral-950">
                                        {metrics.priorityCompleted}
                                      </span>
                                      <span className="text-xs text-neutral-400 font-bold">
                                        /{metrics.priorityTotal}
                                      </span>
                                      <span className="text-[10px] text-neutral-400 font-bold ml-1">
                                        atteints
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-[10px] font-bold">
                                      <span className="text-amber-600 bg-amber-50/50 border border-amber-100 px-1.5 py-0.5 rounded">
                                        {metrics.priorityTotal > 0 
                                          ? `${Math.round((metrics.priorityCompleted / metrics.priorityTotal) * 100)}% Atteint`
                                          : "À définir"
                                        }
                                      </span>
                                      <span className="text-neutral-400">
                                        • {metrics.priorityTotal - metrics.priorityCompleted} restants
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                              <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-amber-500 h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${metrics.priorityTotal > 0 ? (metrics.priorityCompleted / metrics.priorityTotal) * 100 : 0}%` }}
                                />
                              </div>
                            </div>

                            {/* Card 3: Overall Goal Progress */}
                            <div className="bg-white border border-neutral-200/60 rounded-xl p-4 shadow-3xs flex flex-col justify-between space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                                  Tous les Objectifs Hebdo
                                </span>
                                <span className="p-1 bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-lg">
                                  <Award className="w-3.5 h-3.5" />
                                </span>
                              </div>
                              <div>
                                {metrics.totalObjectives === 0 ? (
                                  <div className="text-[11px] text-neutral-400 italic py-1 font-medium">
                                    Aucun objectif défini
                                  </div>
                                ) : (
                                  <>
                                    <div className="flex items-baseline gap-1.5">
                                      <span className="text-xl font-black font-mono text-neutral-950">
                                        {metrics.totalCompletedObjectives}
                                      </span>
                                      <span className="text-xs text-neutral-400 font-bold">
                                        /{metrics.totalObjectives}
                                      </span>
                                      <span className="text-[10px] text-neutral-400 font-bold ml-1">
                                        complétés
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2 mt-1 text-[10px] font-bold">
                                      <span className="text-neutral-700 bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 rounded">
                                        {metrics.totalObjectives > 0 ? Math.round((metrics.totalCompletedObjectives / metrics.totalObjectives) * 100) : 0}% Global
                                      </span>
                                      <span className="text-neutral-400">
                                        • {metrics.totalObjectives - metrics.totalCompletedObjectives} restants
                                      </span>
                                    </div>
                                  </>
                                )}
                              </div>
                              <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                  className="bg-neutral-950 h-full rounded-full transition-all duration-500" 
                                  style={{ width: `${metrics.totalObjectives > 0 ? (metrics.totalCompletedObjectives / metrics.totalObjectives) * 100 : 0}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Active trackers columns */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* 1. Daily Habits discipline tracker */}
                    <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4.5 h-4.5 text-neutral-900 animate-pulse" />
                          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-tight">Discipline Quotidienne</h3>
                        </div>
                        <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-800 px-2.5 py-1 rounded-full font-mono font-bold">
                          {dailyHabits.filter(h => h.completed).length} / {dailyHabits.length} terminées
                        </span>
                      </div>

                      <p className="text-xs text-neutral-400">
                        Cochez vos disciplines quotidiennes d'hygiène de vie, de sport et d'apprentissage pour renforcer votre série.
                      </p>

                      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                        {dailyHabits.map(habit => (
                          <button
                            key={habit.id}
                            onClick={() => toggleHabit(habit.id)}
                            className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left cursor-pointer ${
                              habit.completed
                                ? "bg-neutral-50/50 border-neutral-200 text-neutral-400"
                                : "bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="shrink-0">
                                {habit.completed ? (
                                  <CheckCircle className="w-4.5 h-4.5 text-neutral-900 fill-neutral-900 text-white" />
                                ) : (
                                  <Square className="w-4.5 h-4.5 text-neutral-300" />
                                )}
                              </div>
                              <div>
                                <span className={`text-xs font-semibold block ${habit.completed ? "line-through text-neutral-400" : "text-neutral-800"}`}>
                                  {habit.name}
                                </span>
                                {habit.description && (
                                  <span className="text-[9px] text-neutral-400 block mt-0.5">{habit.description}</span>
                                )}
                              </div>
                            </div>

                            <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border font-mono shrink-0 ml-2 ${
                              habit.category === "professional"
                                ? "bg-neutral-100 border-neutral-200 text-neutral-700"
                                : "bg-neutral-100 border-neutral-200 text-neutral-700"
                            }`}>
                              {habit.category === "professional" ? "Pro" : "Perso"}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. Weekly goals tracker */}
                    <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-2xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="w-4.5 h-4.5 text-neutral-900" />
                          <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-tight">Objectifs de la Semaine</h3>
                        </div>
                        <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-800 px-2.5 py-1 rounded-full font-mono font-bold">
                          {weeklyObjectives.filter(o => o.completed).length} / {weeklyObjectives.length} terminés
                        </span>
                      </div>

                      {/* Add weekly objective Form */}
                      <form onSubmit={handleAddObjectiveSubmit} className="flex gap-2">
                        <div className="relative flex-1">
                          <input
                            type="text"
                            value={newObjectiveText}
                            onChange={(e) => setNewObjectiveText(e.target.value)}
                            placeholder="Ex: Écrire 3 articles LinkedIn, Préparer l'intro..."
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-3.5 pr-10 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => setNewObjectiveIsPriority(!newObjectiveIsPriority)}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-md transition-colors cursor-pointer ${
                              newObjectiveIsPriority 
                                ? "text-amber-500 hover:text-amber-600 bg-amber-50" 
                                : "text-neutral-300 hover:text-neutral-500"
                            }`}
                            title={newObjectiveIsPriority ? "Prioritaire" : "Marquer comme prioritaire"}
                          >
                            <Star className={`w-4 h-4 ${newObjectiveIsPriority ? "fill-amber-500" : ""}`} />
                          </button>
                        </div>
                        <button
                          type="submit"
                          className="bg-neutral-950 hover:bg-neutral-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center justify-center shadow-xs"
                        >
                          <Plus className="w-4.5 h-4.5" />
                        </button>
                      </form>

                      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                        {weeklyObjectives.length === 0 ? (
                          <div className="text-xs text-neutral-400 italic py-8 text-center bg-neutral-50/50 rounded-xl border border-dashed border-neutral-200">
                            Aucun objectif hebdomadaire pour l'instant. Saisissez-en un ci-dessus !
                          </div>
                        ) : (
                          [...weeklyObjectives].sort((a, b) => {
                            if (a.completed && !b.completed) return 1;
                            if (!a.completed && b.completed) return -1;
                            if (a.isPriority && !b.isPriority) return -1;
                            if (!a.isPriority && b.isPriority) return 1;
                            return 0;
                          }).map((obj) => (
                            <div
                              key={obj.id}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                obj.completed
                                  ? "bg-neutral-50/50 border-neutral-200 text-neutral-400"
                                  : obj.isPriority
                                    ? "bg-amber-50/30 border-amber-200 text-neutral-800 hover:bg-amber-50/50"
                                    : "bg-white border-neutral-200 text-neutral-800 hover:bg-neutral-50"
                              }`}
                            >
                              <button
                                type="button"
                                onClick={() => toggleWeeklyObjective(obj.id)}
                                className="flex-1 flex items-center gap-2.5 text-left cursor-pointer"
                              >
                                <div className="shrink-0">
                                  {obj.completed ? (
                                    <CheckCircle className="w-4 h-4 text-neutral-900 fill-neutral-900 text-white" />
                                  ) : (
                                    <Square className={`w-4 h-4 ${obj.isPriority ? "text-amber-400" : "text-neutral-300"}`} />
                                  )}
                                </div>
                                <span className={`text-xs font-semibold leading-snug flex items-center gap-1.5 ${obj.completed ? "line-through text-neutral-400" : "text-neutral-800"}`}>
                                  {obj.isPriority && !obj.completed && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
                                  {obj.text}
                                </span>
                              </button>
                              
                              <button
                                type="button"
                                onClick={() => toggleWeeklyObjectivePriority(obj.id)}
                                className={`p-1 rounded-lg transition-colors shrink-0 ml-2 cursor-pointer ${
                                  obj.isPriority
                                    ? "text-amber-500 hover:text-amber-600 bg-amber-50/60"
                                    : "text-neutral-300 hover:text-neutral-500 hover:bg-neutral-50"
                                }`}
                                title={obj.isPriority ? "Retirer la priorité" : "Marquer comme prioritaire"}
                              >
                                <Star className={`w-3.5 h-3.5 ${obj.isPriority ? "fill-amber-500" : ""}`} />
                              </button>

                              <button
                                type="button"
                                onClick={() => deleteWeeklyObjective(obj.id)}
                                className="text-neutral-400 hover:text-red-500 p-1 rounded-lg hover:bg-neutral-100 transition-colors shrink-0 ml-2 cursor-pointer"
                                title="Supprimer l'objectif"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                    </div>
                  </motion.div>
                )}

                {dashboardTab === "launchpad" && !focusMode && (
                  <motion.div
                    key="launchpad"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">
                        Console de Lancement : Modules Applicatifs
                      </h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {visibleCategories.map(cat => {
                        const CatIcon = cat.icon;
                        return (
                          <div 
                            key={cat.id} 
                            className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs"
                          >
                            <div className="flex items-center gap-2 pb-2.5 border-b border-neutral-100">
                              <div className="p-1.5 bg-neutral-100 rounded-lg text-neutral-800">
                                <CatIcon className="w-4 h-4" />
                              </div>
                              <span className="text-xs font-extrabold uppercase tracking-widest text-neutral-900">
                                {cat.label}
                              </span>
                            </div>

                            <div className="space-y-1.5">
                              {cat.items.map(sub => {
                                const SubIcon = sub.icon;
                                return (
                                  <button
                                    key={sub.id}
                                    onClick={() => handleMenuClick(sub.id)}
                                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-neutral-50 transition-all text-left border border-transparent hover:border-neutral-200 cursor-pointer group"
                                  >
                                    <div className="flex items-center gap-2.5 min-w-0">
                                      <SubIcon className="w-3.5 h-3.5 text-neutral-400 group-hover:text-neutral-900 shrink-0" />
                                      <div className="min-w-0">
                                        <span className="text-xs font-bold text-neutral-800 block leading-none">
                                          {sub.label}
                                        </span>
                                        <span className="text-[10px] text-neutral-400 block truncate mt-1">
                                          {sub.desc}
                                        </span>
                                      </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {dashboardTab === "charts" && !focusMode && (
                  <motion.div
                    key="charts"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-4 shadow-2xs"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-tight flex items-center gap-2">
                        <BarChart3 className="w-4.5 h-4.5 text-neutral-800" />
                        <span>Rapport Financier Synthétique</span>
                      </h3>
                      <button
                        onClick={() => handleMenuClick("charts")}
                        className="text-xs text-neutral-900 hover:text-neutral-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Ouvrir l'Analyse Avancée</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    
                    <FinanceCharts
                      transactions={transactions}
                      budgets={budgets}
                      stocks={stocks}
                      epargnes={epargnes}
                      abonnements={abonnements}
                    />
                    
                    <NetSavingsChart transactions={transactions} />
                  </motion.div>
                )}
              </AnimatePresence>

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
                    <span>ESPACE CRÉATEUR</span>
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
                    Naviguez à travers les différents modules du secteur {activeCategoryObj.label.toLowerCase()} pour piloter vos activités de création de contenu et d'organisation personnelle.
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

                {/* Interactive Content Card */}
                <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs min-h-[420px]">
                  {activeMenu === "charts" ? (
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
                          <NetSavingsChart transactions={transactions} />
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
                  ) : activeMenu === "books" ? (
                    <BooksSection books={books} setBooks={setBooks} />
                  ) : activeMenu === "screenmedia" ? (
                    <ScreenMediaSection screenMedia={screenMedia} setScreenMedia={setScreenMedia} />
                  ) : activeMenu === "project_folders" ? (
                    <ProjectFoldersSection
                      formations={formations}
                      setFormations={setFormations}
                      links={links}
                      setLinks={setLinks}
                      monthlyGoals={monthlyGoals}
                      setMonthlyGoals={setMonthlyGoals}
                    />
                  ) : activeMenu === "formations" ? (
                    <FormationsSection formations={formations} setFormations={setFormations} activeTab="carriere_pro" hideTabs={true} />
                  ) : activeMenu === "macircle" ? (
                    <FormationsSection formations={formations} setFormations={setFormations} activeTab="ma_circle" hideTabs={true} />
                  ) : activeMenu === "monthly_goals" ? (
                    <MonthlyGoalsSection 
                      goals={monthlyGoals} 
                      setGoals={setMonthlyGoals} 
                      availableChannels={channels.map(c => c.name)}
                    />
                  ) : activeMenu === "editorial_calendar" ? (
                    <EditorialCalendarSection
                      events={editorialEvents}
                      setEvents={setEditorialEvents}
                      availableChannels={channels.map(c => c.name)}
                    />
                  ) : activeMenu === "habits" ? (
                    <DisciplineHeatmap
                      habitHistory={habitHistory}
                      setHabitHistory={setHabitHistory}
                      dailyHabitsList={dailyHabits}
                      streakCount={streakCount}
                    />
                  ) : (
                    <div>
                      {(() => {
                        const config = getModuleConfig(activeMenu);
                        if (!config) return (
                          <div className="text-center py-20 text-neutral-400 italic">
                            Module "{activeMenu}" en cours de déploiement dans l'espace créateur.
                          </div>
                        );

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
          <div className="max-w-7xl mx-auto px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p>© 2026 Moroccan Content Creator Planner. Tous droits réservés.</p>
            <div className="flex gap-4 text-neutral-500 font-semibold font-mono text-[9px]">
              <span>THE MOROCCAN ANALYST</span>
              <span>•</span>
              <span>THE MOROCCAN CFO</span>
              <span>•</span>
              <span>THE MOROCCAN ECONOMIST</span>
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

    </div>
  );
}
