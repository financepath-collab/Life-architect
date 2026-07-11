import React, { useState, useEffect } from "react";
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
  MediaItem, 
  Account, 
  ResourceLink, 
  ChannelInfo
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
  INITIAL_MEDIA_ITEMS, 
  INITIAL_ACCOUNTS, 
  INITIAL_RESOURCELINKS, 
  INITIAL_CHANNELS 
} from "./initialData";

import InteractiveModuleTable, { TableColumn } from "./components/InteractiveModuleTable";
import FinanceCharts from "./components/FinanceCharts";
import FocusSport from "./components/FocusSport";
import AlertsBanner from "./components/AlertsBanner";

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
  Dumbbell
} from "lucide-react";

export default function App() {
  // --- RESPONSIVE SIDEBAR & NAVIGATION STATES ---
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>("dashboard"); // "dashboard", or "submodule_id"
  const [dashboardTab, setDashboardTab] = useState<"routines" | "charts" | "launchpad">("routines");
  const [expandedCategories, setExpandedCategories] = useState<{ [key: string]: boolean }>({
    finance: true,
    productivity: true,
    health: false,
    purchases: false,
    formation: false,
    accounts: false
  });

  // --- CORE SYSTEM STATES (Persistent via LocalStorage) ---
  const [dailyHabits, setDailyHabits] = useState<DailyHabit[]>(() => {
    const saved = localStorage.getItem("mp_habits_v2");
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

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

  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem("mp_media_v2");
    return saved ? JSON.parse(saved) : INITIAL_MEDIA_ITEMS;
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

  // Stats / Streaks
  const [streakCount, setStreakCount] = useState<number>(() => {
    const saved = localStorage.getItem("mp_streak_count_v2");
    return saved ? parseInt(saved) : 7;
  });

  // --- LOCALSTORAGE SYNC EFFECT ---
  useEffect(() => {
    localStorage.setItem("mp_habits_v2", JSON.stringify(dailyHabits));
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

  useEffect(() => {
    localStorage.setItem("mp_meal_v2", JSON.stringify(mealPlanners));
  }, [mealPlanners]);

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
    localStorage.setItem("mp_media_v2", JSON.stringify(mediaItems));
  }, [mediaItems]);

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
    localStorage.setItem("mp_streak_count_v2", streakCount.toString());
  }, [streakCount]);


  // --- UTILITY ACTION HANDLERS ---

  // Habit toggling
  const toggleHabit = (id: string) => {
    setDailyHabits(prev => prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h));
  };

  // Weekly objective handlers
  const [newObjectiveText, setNewObjectiveText] = useState("");
  const handleAddObjectiveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjectiveText.trim()) return;
    const newObj: WeeklyObjective = {
      id: "obj_" + Date.now(),
      text: newObjectiveText.trim(),
      completed: false
    };
    setWeeklyObjectives(prev => [...prev, newObj]);
    setNewObjectiveText("");
  };

  const toggleWeeklyObjective = (id: string) => {
    setWeeklyObjectives(prev => prev.map(o => o.id === id ? { ...o, completed: !o.completed } : o));
  };

  const deleteWeeklyObjective = (id: string) => {
    setWeeklyObjectives(prev => prev.filter(o => o.id !== id));
  };

  // Reset daily routines
  const resetDailyRoutines = () => {
    setDailyHabits(prev => prev.map(h => ({ ...h, completed: false })));
    setStreakCount(prev => prev + 1);
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
        { id: "goals", label: "Possibilités & Goals", icon: Award, desc: "Planification de vos buts de vie majeurs." }
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
      label: "Achats & SaaS",
      icon: ShoppingCart,
      items: [
        { id: "achats", label: "Achats Mensuels", icon: ShoppingCart, desc: "Liste de shopping, matériel pro et fournitures." },
        { id: "abonnements", label: "Abonnements", icon: Bell, desc: "Contrôle de vos dépenses récurrentes SaaS et hébergement." }
      ]
    },
    {
      id: "formation",
      label: "Formation & Culture",
      icon: BookOpen,
      items: [
        { id: "formations", label: "Formations Udemy/Pro", icon: GraduationCap, desc: "Progression de vos cours et épisodes Udemy." },
        { id: "media", label: "Média Library", icon: Film, desc: "Suivi de vos lectures de développement et divertissement." }
      ]
    },
    {
      id: "accounts",
      label: "Comptes & Liens",
      icon: Landmark,
      items: [
        { id: "comptes", label: "Comptes Bancaires", icon: Landmark, desc: "Gestion des comptes pro, perso et liquidités." },
        { id: "links", label: "Liens Favoris", icon: Link2, desc: "Signets rapides vers vos ressources de marché bourse." },
        { id: "channels", label: "Chaînes & Médias", icon: Tv, desc: "Abonnés et fréquence de publication de vos chaînes." }
      ]
    }
  ];

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
          title: "Abonnements & Logiciels",
          description: "Suivez vos charges récurrentes SaaS et annulez les services inutilisés.",
          data: abonnements,
          onAdd: (item: any) => setAbonnements(prev => [item, ...prev]),
          onEdit: (id: string, updated: any) => setAbonnements(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setAbonnements(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setAbonnements(prev => [...items, ...prev]),
          columns: [
            { key: "serviceName", label: "Nom du Service SaaS", type: "text", required: true },
            { key: "costMonthly", label: "Coût Mensuel (MAD)", type: "number", required: true },
            { key: "billingPeriod", label: "Période Facturation", type: "select", options: ["Mensuel", "Annuel"] },
            { key: "nextBillingDate", label: "Prochain Prélèvement", type: "date" },
            { key: "status", label: "État", type: "select", options: ["Actif", "Suspendu"] }
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

      case "media":
        return {
          title: "Bibliothèque de Divertissement (Films, Séries, Livres)",
          description: "Conservez un journal de vos lectures de développement et d'inspiration.",
          data: mediaItems,
          onAdd: (item: any) => setMediaItems(prev => [...prev, item]),
          onEdit: (id: string, updated: any) => setMediaItems(prev => prev.map(x => x.id === id ? updated : x)),
          onDelete: (id: string) => setMediaItems(prev => prev.filter(x => x.id !== id)),
          onImport: (items: any[]) => setMediaItems(prev => [...prev, ...items]),
          columns: [
            { key: "title", label: "Titre de l'Œuvre", type: "text", required: true },
            { key: "type", label: "Type", type: "select", options: ["Film", "Série", "Livre"] },
            { key: "authorOrDirector", label: "Auteur / Réalisateur", type: "text" },
            { key: "progress", label: "Avancement (Page, Ep...)", type: "text" },
            { key: "rating", label: "Note Personnelle", type: "rating" },
            { key: "status", label: "Statut", type: "select", options: ["À voir/lire", "En cours", "Terminé"] }
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

    const savedSportExercises = localStorage.getItem("mp_sport_exercises");
    const sportExercisesCount = savedSportExercises ? JSON.parse(savedSportExercises).length : 6;

    switch (catId) {
      case "finance":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Entrées Totales</span>
                <span className="text-base font-extrabold font-mono text-emerald-600 block">+{totalInflow.toLocaleString("fr-FR")} MAD</span>
              </div>
              <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600"><TrendingUp className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Sorties Totales</span>
                <span className="text-base font-extrabold font-mono text-rose-600 block">-{totalOutflow.toLocaleString("fr-FR")} MAD</span>
              </div>
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><TrendingDown className="w-4 h-4" /></div>
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
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">SaaS Actifs</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{abonnements.filter(a => a.status === "Actif").length} Licences</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Bell className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Frais Récurrents</span>
                <span className="text-base font-extrabold font-mono text-rose-600 block">-{totalMonthlyAbonnements.toLocaleString("fr-FR")} MAD / m</span>
              </div>
              <div className="p-2 bg-rose-50 rounded-lg text-rose-600"><TrendingDown className="w-4 h-4" /></div>
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
        const averageProgress = formations.length > 0 
          ? Math.round(formations.reduce((sum, f) => sum + f.progressPercent, 0) / formations.length) 
          : 0;
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Formations Enregistrées</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{formations.length} Cours</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><GraduationCap className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block font-sans">Progression Moyenne</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{averageProgress}% Complete</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><TrendingUp className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Médiathèque</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{mediaItems.length} Titres</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Film className="w-4 h-4" /></div>
            </div>
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block font-sans">Livres Terminés</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{mediaItems.filter(m => m.type === "Livre" && m.status === "Terminé").length} Ouvrages</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><BookOpen className="w-4 h-4" /></div>
            </div>
          </div>
        );

      case "accounts":
        return (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in duration-300">
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
            <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Chaînes Youtube/Insta</span>
                <span className="text-base font-extrabold font-mono text-neutral-900 block">{channels.length} Plateformes</span>
              </div>
              <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Tv className="w-4 h-4" /></div>
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

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-neutral-800 flex flex-col font-sans antialiased">
      
      {/* UNIFIED STICKY TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-neutral-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Brand (Left) */}
          <div 
            onClick={() => handleMenuClick("dashboard")}
            className="flex items-center gap-2.5 cursor-pointer shrink-0 select-none"
          >
            <div className="w-9 h-9 bg-neutral-900 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-xs font-display">
              MC
            </div>
            <div>
              <span className="text-[9px] font-bold text-neutral-400 block tracking-wider uppercase font-mono leading-none">CREATOR WORKSPACE</span>
              <span className="text-xs font-black text-neutral-900 block leading-tight mt-0.5">Moroccan Planner</span>
            </div>
          </div>

          {/* Horizontal Navigation Menus (Center - Desktop only) */}
          <nav className="hidden lg:flex items-center gap-1.5 h-full">
            
            {/* Dashboard Link */}
            <button
              onClick={() => handleMenuClick("dashboard")}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-extrabold tracking-wide transition-all cursor-pointer select-none ${
                activeMenu === "dashboard"
                  ? "bg-neutral-900 text-white shadow-xs"
                  : "text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50"
              }`}
            >
              <LayoutDashboard className={`w-4 h-4 shrink-0 ${activeMenu === "dashboard" ? "text-amber-400" : "text-neutral-400"}`} />
              <span>TABLEAU DE BORD</span>
            </button>

            {/* Categories Hover Dropdowns */}
            {categories.map(cat => {
              const CatIcon = cat.icon;
              const isCatActive = activeCategoryObj?.id === cat.id;
              return (
                <div key={cat.id} className="relative group h-full flex items-center">
                  <button
                    onClick={() => handleCategoryClick(cat.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer select-none ${
                      isCatActive
                        ? "bg-neutral-100 text-neutral-950 font-extrabold"
                        : "text-neutral-500 hover:text-neutral-950 hover:bg-neutral-50"
                    }`}
                  >
                    <CatIcon className={`w-3.5 h-3.5 shrink-0 ${isCatActive ? "text-neutral-900" : "text-neutral-400"}`} />
                    <span className="uppercase">{cat.label}</span>
                    <ChevronDown className="w-3 h-3 text-neutral-400 opacity-60 group-hover:rotate-180 transition-transform duration-200" />
                  </button>

                  {/* Floating Sub-items Menu Card */}
                  <div className="absolute top-12 left-0 mt-1 hidden group-hover:block bg-white border border-neutral-200/80 rounded-2xl shadow-lg p-2 min-w-[240px] z-50 animate-in fade-in slide-in-from-top-2 duration-150">
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
                            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-semibold text-left transition-all cursor-pointer ${
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
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Discipline Streak Count */}
            <div className="hidden sm:flex items-center gap-2 bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-800">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 shrink-0" />
              <span className="font-mono">{streakCount} Jours</span>
            </div>

            {/* Total Patrimoine Estimate */}
            <div className="hidden md:flex items-center gap-2 bg-neutral-50 border border-neutral-200 px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-800">
              <span className="text-neutral-400 text-[10px] tracking-wider uppercase font-mono">Patrimoine:</span>
              <span className="font-mono text-neutral-900">{dashboardStats.netWorth.toLocaleString("fr-FR")} MAD</span>
            </div>

            {/* Daily Reset Routine Button */}
            <button
              onClick={resetDailyRoutines}
              className="text-xs bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-xl font-bold transition-all shadow-2xs cursor-pointer select-none"
            >
              Nouveau Jour
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
                  <Flame className="w-4 h-4 text-orange-500 fill-orange-500 shrink-0 animate-pulse" />
                  <div>
                    <span className="text-[8px] text-neutral-400 font-bold uppercase tracking-wider block font-mono">DISCIPLINE</span>
                    <span className="text-xs font-black text-neutral-900 block leading-none">{streakCount} Jours</span>
                  </div>
                </div>
                <div className="bg-neutral-50 border border-neutral-200/80 p-3.5 rounded-xl flex items-center gap-2.5">
                  <Coins className="w-4 h-4 text-emerald-500 shrink-0" />
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

                {/* Collapsible Sectors */}
                <div className="space-y-2">
                  {categories.map(cat => {
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
              <div className="space-y-1">
                <h1 className="text-2xl font-black text-neutral-900 tracking-tight font-sans">
                  Bonjour ! Prêt à créer aujourd'hui ?
                </h1>
                <p className="text-xs text-neutral-500 max-w-2xl">
                  Suivi de vos 3 chaînes de contenu (<span className="font-semibold">The Moroccan Analyst</span>, <span className="font-semibold">The Moroccan CFO</span>, <span className="font-semibold">The Moroccan Economist</span>) et de votre santé financière.
                </p>
              </div>

              {/* Notifications & Visual Alerts Center */}
              <AlertsBanner
                abonnements={abonnements}
                profilAmeliorations={profilAmeliorations}
                epargnes={epargnes}
                onNavigateToModule={handleNavigateToModule}
              />

              {/* General Statistics Cards */}
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

              {/* INTERACTIVE DASHBOARD SECTION TABS */}
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
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500 shrink-0" />
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

              {/* TAB CONTENT RENDERING */}
              <AnimatePresence mode="wait">
                {dashboardTab === "routines" && (
                  <motion.div
                    key="routines"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6"
                  >
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
                        <input
                          type="text"
                          value={newObjectiveText}
                          onChange={(e) => setNewObjectiveText(e.target.value)}
                          placeholder="Ex: Écrire 3 articles LinkedIn, Préparer l'intro..."
                          className="flex-1 bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all font-medium"
                        />
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
                          weeklyObjectives.map((obj) => (
                            <div
                              key={obj.id}
                              className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                                obj.completed
                                  ? "bg-neutral-50/50 border-neutral-200 text-neutral-400"
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
                                    <Square className="w-4 h-4 text-neutral-300" />
                                  )}
                                </div>
                                <span className={`text-xs font-semibold leading-snug ${obj.completed ? "line-through text-neutral-400" : "text-neutral-800"}`}>
                                  {obj.text}
                                </span>
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
                  </motion.div>
                )}

                {dashboardTab === "launchpad" && (
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
                      {categories.map(cat => {
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

                {dashboardTab === "charts" && (
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
                      <div className="pb-4 border-b border-neutral-100">
                        <h3 className="text-base font-bold text-neutral-900 mb-1">Graphiques de performance Financière</h3>
                        <p className="text-xs text-neutral-400">Analyse complète de vos flux de trésorerie, d'épargne, de vos budgets et positions boursières en BVC.</p>
                      </div>

                      <FinanceCharts
                        transactions={transactions}
                        budgets={budgets}
                        stocks={stocks}
                        epargnes={epargnes}
                        abonnements={abonnements}
                      />
                    </div>
                  ) : activeMenu === "sport" ? (
                    <FocusSport />
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

    </div>
  );
}
