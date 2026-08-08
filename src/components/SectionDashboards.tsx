import React, { useState } from "react";
import { 
  Coins, Flame, Heart, FolderKanban, BookOpen, Star, AlertCircle, Bell, 
  ArrowRight, TrendingUp, TrendingDown, PiggyBank, Landmark, ClipboardCheck, CheckCircle2, 
  ListTodo, Calendar, Award, Target, Trophy, Sparkles, Smile, RefreshCw, 
  Plus, Trash2, Dumbbell, Play, Pause, ExternalLink, GraduationCap, Link2, 
  BookOpenCheck, CheckSquare, Coffee, ChevronRight, Activity, FolderPlus,
  BarChart3, LayoutDashboard, FolderTree, ArrowUpDown, ArrowUp, ArrowDown,
  Search, Filter
} from "lucide-react";
import MonthlyExpenseAnalysisCard from "./MonthlyExpenseAnalysisCard";
import MonthlyNetIncomeWidget from "./MonthlyNetIncomeWidget";
import MonthlySavingsGaugeCard from "./MonthlySavingsGaugeCard";
import MonthlyComparisonCard from "./MonthlyComparisonCard";
import SubscriptionScatterChartCard from "./SubscriptionScatterChartCard";
import RequiredMonthlySavingsCard from "./RequiredMonthlySavingsCard";
import Savings3MonthProjectionSimulationCard from "./Savings3MonthProjectionSimulationCard";
import EmergencyFundSectionCard from "./EmergencyFundSectionCard";
import FinanceCharts from "./FinanceCharts";
import NetSavingsChart from "./NetSavingsChart";
import SavingsTrendChart from "./SavingsTrendChart";
import FireCalculator from "./FireCalculator";
import FinanceCategorySettings from "./FinanceCategorySettings";
import BankClassificationSection from "./BankClassificationSection";
import { 
  Account, FinanceBudget, FinanceEpargne, Abonnement, StockEntry, FinanceTransaction,
  DailyHabit, Action30Jours, WeeklyObjective, ProfilAmelioration, PossibiliteGoal, JournalEntry,
  SkinTracker, MealPlanner, ProjectFolder, EditorialEvent, BookItem, ScreenMediaItem, Formation,
  FinanceSalaire, MediaProgressLog
} from "../types";
import { MediaProgressWidget } from "./MediaProgressWidget";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar
} from "recharts";

export const getHabitCategoryBadge = (category: string) => {
  const cat = (category || "").toLowerCase().trim();
  switch (cat) {
    case "health":
    case "santé":
      return {
        label: "Santé",
        className: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50"
      };
    case "career":
    case "carrière":
    case "professional":
    case "pro":
      return {
        label: "Carrière",
        className: "bg-indigo-50 text-indigo-700 border border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-900/50"
      };
    case "mental":
      return {
        label: "Mental",
        className: "bg-purple-50 text-purple-700 border border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-900/50"
      };
    case "personal":
    case "personnel":
    case "perso":
      return {
        label: "Perso",
        className: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50"
      };
    case "finance":
      return {
        label: "Finance",
        className: "bg-teal-50 text-teal-700 border border-teal-200 dark:bg-teal-950/40 dark:text-teal-400 dark:border-teal-900/50"
      };
    default:
      return {
        label: category || "Autre",
        className: "bg-neutral-50 text-neutral-600 border border-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-800"
      };
  }
};

// ==========================================
// 1. FINANCE SECTION DASHBOARD
// ==========================================
interface FinanceDashProps {
  accounts: Account[];
  budgets: FinanceBudget[];
  epargnes: FinanceEpargne[];
  abonnements: Abonnement[];
  stocks: StockEntry[];
  transactions: FinanceTransaction[];
  salaires?: FinanceSalaire[];
  sportHistory?: string[];
  weeklyObjectives?: WeeklyObjective[];
  onNavigate: (moduleId: string) => void;
  initialTab?: "overview" | "charts" | "fire" | "settings";
  triggerToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
  setAccounts?: React.Dispatch<React.SetStateAction<Account[]>>;
  setEpargnes?: React.Dispatch<React.SetStateAction<FinanceEpargne[]>>;
  setTransactions?: React.Dispatch<React.SetStateAction<FinanceTransaction[]>>;
}

export function FinanceSectionDashboard({ 
  accounts, budgets, epargnes, abonnements, stocks, transactions, salaires,
  sportHistory = [], weeklyObjectives = [], onNavigate, initialTab = "overview", triggerToast,
  setAccounts, setEpargnes, setTransactions
}: FinanceDashProps) {
  const [activeDashTab, setActiveDashTab] = useState<"overview" | "charts" | "fire" | "settings">(initialTab);
  const [overviewMode, setOverviewMode] = useState<"essential" | "analytics" | "goals" | "operations" | "full">("essential");

  // Transaction sorting & filtering state for dashboard analysis
  const [txSortKey, setTxSortKey] = useState<"date" | "amount" | "description">("date");
  const [txSortDir, setTxSortDir] = useState<"asc" | "desc">("desc");
  const [txSearch, setTxSearch] = useState("");
  const [txTypeFilter, setTxTypeFilter] = useState<string>("Tous");
  const [txCategoryFilter, setTxCategoryFilter] = useState<string>("Tous");

  // Sorted and filtered transactions memo
  const sortedAndFilteredTransactions = React.useMemo(() => {
    let list = transactions.filter(t => {
      const matchesSearch = !txSearch || 
        (t.description || "").toLowerCase().includes(txSearch.toLowerCase()) ||
        (t.category || "").toLowerCase().includes(txSearch.toLowerCase()) ||
        (t.subCategory || "").toLowerCase().includes(txSearch.toLowerCase()) ||
        (t.account || "").toLowerCase().includes(txSearch.toLowerCase());

      const matchesType = txTypeFilter === "Tous" || t.type === txTypeFilter;
      const matchesCat = txCategoryFilter === "Tous" || t.category === txCategoryFilter;

      return matchesSearch && matchesType && matchesCat;
    });

    return [...list].sort((a, b) => {
      let comp = 0;
      if (txSortKey === "date") {
        comp = (a.date || "").localeCompare(b.date || "");
      } else if (txSortKey === "amount") {
        comp = (Number(a.amount) || 0) - (Number(b.amount) || 0);
      } else if (txSortKey === "description") {
        comp = (a.description || "").localeCompare(b.description || "");
      }
      return txSortDir === "asc" ? comp : -comp;
    });
  }, [transactions, txSortKey, txSortDir, txSearch, txTypeFilter, txCategoryFilter]);

  const uniqueTxCategories = React.useMemo(() => {
    const set = new Set<string>();
    transactions.forEach(t => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [transactions]);
  // Calculations
  const totalAccountBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalStockValuation = stocks.reduce((sum, s) => sum + (s.currentPrice * s.quantity), 0);
  const totalEpargne = epargnes.reduce((sum, e) => sum + e.currentAmount, 0);
  const totalNetWorth = totalAccountBalance + totalStockValuation + totalEpargne;

  // Total Épargné Actuel (total currentAmount of all ongoing savings goals)
  const ongoingEpargnes = epargnes.filter(e => e.status === "En cours" || e.status === undefined);
  const totalEpargneActuel = ongoingEpargnes.reduce((sum, e) => sum + (e.currentAmount || 0), 0);
  const totalOngoingTarget = ongoingEpargnes.reduce((sum, e) => sum + (e.targetAmount || 0), 0);
  const ongoingPct = totalOngoingTarget > 0 ? Math.round((totalEpargneActuel / totalOngoingTarget) * 100) : 0;

  // Budget exceeded/spent percentages
  const exceededBudgetsCount = budgets.filter(b => b.spentAmount > b.limitAmount).length;
  const criticalBudgetsCount = budgets.filter(b => {
    const pct = b.alertThresholdPct ?? 80;
    return b.spentAmount >= b.limitAmount * (pct / 100) && b.spentAmount <= b.limitAmount;
  }).length;

  // Find the latest year and month among transactions to align the 6-month chart timeline perfectly
  const referenceDate = React.useMemo(() => {
    if (transactions.length === 0) {
      return new Date("2026-07-11");
    }
    let maxDateStr = "2026-07-01";
    transactions.forEach(t => {
      if (t.date && t.date > maxDateStr) {
        maxDateStr = t.date;
      }
    });
    return new Date(maxDateStr);
  }, [transactions]);

  // Generate list of the last 6 months based on reference date
  const last6Months = React.useMemo(() => {
    const list = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const key = `${year}-${month}`; // e.g. "2026-07"
      const label = d.toLocaleDateString("fr-FR", { month: "long", year: "2-digit" });
      list.push({ key, label });
    }
    return list;
  }, [referenceDate]);

  // Build monthly comparison data for the bar chart
  const monthlyChartData = React.useMemo(() => {
    return last6Months.map(({ key, label }) => {
      let income = 0;
      let expenses = 0;

      transactions.forEach(t => {
        if (t.date && t.date.startsWith(key)) {
          if (t.type === "Revenue") {
            income += t.amount;
          } else if (t.type === "Dépense") {
            expenses += t.amount;
          }
        }
      });

      const finalIncome = income;
      const finalExpenses = expenses;
      const netSavings = finalIncome - finalExpenses;

      return {
        name: label.charAt(0).toUpperCase() + label.slice(1),
        Revenus: finalIncome,
        Dépenses: finalExpenses,
        "Épargne Nette": netSavings,
      };
    });
  }, [last6Months, transactions]);

  const velocityChartData = React.useMemo(() => {
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayDay = referenceDate.getDate();

    // Sum up budget limit
    const totalLimit = budgets.reduce((sum, b) => sum + b.limitAmount, 0) || 22500;

    const chartPoints = [];
    let cumulativeSpent = 0;
    let actualIsOverIdeal = false;

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      
      // Filter and sum expenses on this day
      const dayExpenses = transactions
        .filter(t => t.type === "Dépense" && t.date === dateStr)
        .reduce((sum, t) => sum + t.amount, 0);

      const targetLinearSpend = Math.round((totalLimit / daysInMonth) * day);

      let actualCumulative = undefined;
      if (day <= todayDay) {
        cumulativeSpent += dayExpenses;
        actualCumulative = cumulativeSpent;

        if (day === todayDay && cumulativeSpent > targetLinearSpend) {
          actualIsOverIdeal = true;
        }
      }

      chartPoints.push({
        day,
        name: `${day}`,
        "Dépenses Cumulées": actualCumulative,
        "Trajectoire Idéale": targetLinearSpend,
        "Limite de Budget": totalLimit,
      });
    }

    const currentIdeal = Math.round((totalLimit / daysInMonth) * todayDay);

    return {
      chartPoints,
      totalLimit,
      cumulativeSpent,
      currentIdeal,
      actualIsOverIdeal,
      todayDay,
      monthName: referenceDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })
    };
  }, [referenceDate, transactions, budgets]);

  // Projections of remaining month expenses based on daily average run-rate
  const projectionData = React.useMemo(() => {
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayDay = referenceDate.getDate();
    const daysRemaining = daysInMonth - todayDay;

    // Sum up budget limit
    const totalLimit = budgets.reduce((sum, b) => sum + b.limitAmount, 0) || 22500;

    // Sum actual expenses for the current month
    const key = `${year}-${String(month + 1).padStart(2, "0")}`;
    const currentMonthExpenses = transactions
      .filter(t => t.type === "Dépense" && t.date && t.date.startsWith(key))
      .reduce((sum, t) => sum + t.amount, 0);

    // Baseline fallback if no transactions logged yet to make it feel realistic
    const baselineExpenses = currentMonthExpenses > 0 ? currentMonthExpenses : 16800;

    // Daily average run-rate calculation
    const averageDailySpent = todayDay > 0 ? baselineExpenses / todayDay : 0;

    // Remaining projection
    const projectedRemainingSpend = averageDailySpent * daysRemaining;
    const totalProjectedSpent = baselineExpenses + projectedRemainingSpend;

    const overrun = totalProjectedSpent - totalLimit;
    const isOverrun = overrun > 0;
    const spentPct = totalLimit > 0 ? (totalProjectedSpent / totalLimit) * 100 : 0;

    // Tailored advice and status badge settings
    let advice = "";
    let statusColor = "emerald"; // emerald | amber | red
    let statusLabel = "";

    if (spentPct > 100) {
      statusColor = "red";
      statusLabel = "Risque Dépassement";
      advice = `Réduire les sorties discrétionnaires de ${(overrun / Math.max(1, daysRemaining)).toFixed(0)} MAD/jour pour conserver votre budget d'élite.`;
    } else if (spentPct >= 90) {
      statusColor = "amber";
      statusLabel = "Vigilance Sûre";
      advice = `Rythme de dépenses serré. Limitez les extras à maximum ${Math.max(0, (totalLimit - baselineExpenses) / Math.max(1, daysRemaining)).toFixed(0)} MAD/jour.`;
    } else {
      statusColor = "emerald";
      statusLabel = "Budget Sécurisé";
      advice = "Félicitations ! Votre rythme de dépenses actuel vous permet de sécuriser votre épargne mensuelle avec brio.";
    }

    return {
      daysInMonth,
      todayDay,
      daysRemaining,
      baselineExpenses,
      averageDailySpent,
      projectedRemainingSpend,
      totalProjectedSpent,
      totalLimit,
      overrun,
      isOverrun,
      spentPct,
      advice,
      statusColor,
      statusLabel
    };
  }, [referenceDate, transactions, budgets]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/60 pb-4">
        <div>
          <h2 className="text-lg font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
            <Coins className="w-5 h-5 text-neutral-800" />
            <span>Tableau de bord Financier & Analyses</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Aperçu global de votre patrimoine estimé, respect budgétaire, graphiques d'analyse et projections FIRE.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Sub-Tabs Selector */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-2xl border border-neutral-200/60">
            <button
              type="button"
              onClick={() => setActiveDashTab("overview")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeDashTab === "overview"
                  ? "bg-neutral-950 text-white shadow-xs font-black"
                  : "text-neutral-600 hover:text-neutral-950 hover:bg-white/60"
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Synthèse</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDashTab("charts")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeDashTab === "charts"
                  ? "bg-neutral-950 text-white shadow-xs font-black"
                  : "text-neutral-600 hover:text-neutral-950 hover:bg-white/60"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Graphiques & Trends</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDashTab("fire")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeDashTab === "fire"
                  ? "bg-neutral-950 text-white shadow-xs font-black"
                  : "text-neutral-600 hover:text-neutral-950 hover:bg-white/60"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Liberté FIRE</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveDashTab("settings")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeDashTab === "settings"
                  ? "bg-neutral-950 text-white shadow-xs font-black"
                  : "text-neutral-600 hover:text-neutral-950 hover:bg-white/60"
              }`}
            >
              <FolderTree className="w-3.5 h-3.5 text-indigo-500" />
              <span>Paramètres Catégories</span>
            </button>
          </div>

          {activeDashTab === "overview" && (
            <button
              onClick={() => onNavigate("saisie_unifiee")}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs border border-indigo-400/30"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Guichet Unique</span>
            </button>
          )}
        </div>
      </div>

      {activeDashTab === "overview" ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Sub-View Mode Selector for Clean Dashboard Layout */}
          <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 p-2.5 rounded-2xl shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
              <button
                type="button"
                onClick={() => setOverviewMode("essential")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  overviewMode === "essential"
                    ? "bg-indigo-600 text-white shadow-xs font-black"
                    : "bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-zinc-700"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Vue Essentielle</span>
              </button>

              <button
                type="button"
                onClick={() => setOverviewMode("analytics")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  overviewMode === "analytics"
                    ? "bg-indigo-600 text-white shadow-xs font-black"
                    : "bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-zinc-700"
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>Analyses & Dépenses</span>
              </button>

              <button
                type="button"
                onClick={() => setOverviewMode("goals")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  overviewMode === "goals"
                    ? "bg-indigo-600 text-white shadow-xs font-black"
                    : "bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-zinc-700"
                }`}
              >
                <Target className="w-3.5 h-3.5 text-emerald-500" />
                <span>Objectifs & Projections</span>
              </button>

              <button
                type="button"
                onClick={() => setOverviewMode("operations")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  overviewMode === "operations"
                    ? "bg-indigo-600 text-white shadow-xs font-black"
                    : "bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-zinc-700"
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                <span>Opérations ({sortedAndFilteredTransactions.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setOverviewMode("full")}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 ${
                  overviewMode === "full"
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs font-black"
                    : "bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-zinc-700"
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Vue Globale Organisée</span>
              </button>
            </div>

            <div className="text-[11px] font-semibold text-neutral-500 dark:text-neutral-400 hidden xl:block">
              {overviewMode === "essential" && "✨ Synthèse haute lisibilité des indicateurs clés et du solde"}
              {overviewMode === "analytics" && "📊 Camembert de dépenses, comparatifs et flux de trésorerie"}
              {overviewMode === "goals" && "🎯 Jauges d'épargne, fonds de secours et prévisions 3 mois"}
              {overviewMode === "operations" && "📋 Historique et tri dynamique de vos transactions"}
              {overviewMode === "full" && "👁️ Vue complète de tous les modules financiers"}
            </div>
          </div>
          {/* 1. Stats Bento Grid */}
          {(overviewMode === "essential" || overviewMode === "analytics" || overviewMode === "full") && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-white flex flex-col justify-between h-32 shadow-sm">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Patrimoine Total</span>
                <div>
                  <h4 className="text-xl font-black font-mono leading-none">
                    {totalNetWorth.toLocaleString("fr-FR")} MAD
                  </h4>
                  <span className="text-[10px] text-neutral-400 block mt-1">Liquidités, bourse & épargne d'urgence</span>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between h-32 shadow-3xs">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Liquidités en Comptes</span>
                <div>
                  <h4 className="text-xl font-bold font-mono text-neutral-900 leading-none">
                    {totalAccountBalance.toLocaleString("fr-FR")} MAD
                  </h4>
                  <span className="text-[10px] text-neutral-400 block mt-1">{accounts.length} comptes actifs configurés</span>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between h-32 shadow-3xs">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Portefeuille Bourse (BVC)</span>
                <div>
                  <h4 className="text-xl font-bold font-mono text-neutral-900 leading-none">
                    {totalStockValuation.toLocaleString("fr-FR")} MAD
                  </h4>
                  <span className="text-[10px] text-neutral-400 block mt-1">{stocks.length} lignes d'investissement d'élite</span>
                </div>
              </div>

              <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-2xl p-5 flex flex-col justify-between h-32 shadow-3xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">Total Épargné Actuel</span>
                  <PiggyBank className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
                <div>
                  <h4 className="text-xl font-black font-mono text-emerald-950 leading-none">
                    {totalEpargneActuel.toLocaleString("fr-FR")} MAD
                  </h4>
                  <span className="text-[10px] text-emerald-700 font-medium block mt-1">
                    {ongoingEpargnes.length} objectif(s) en cours ({ongoingPct}% de la cible)
                  </span>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between h-32 shadow-3xs">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Cagnottes Épargne (Total)</span>
                <div>
                  <h4 className="text-xl font-bold font-mono text-neutral-900 leading-none">
                    {totalEpargne.toLocaleString("fr-FR")} MAD
                  </h4>
                  <span className="text-[10px] text-neutral-400 block mt-1">{epargnes.length} projets d'épargne enregistrés</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. Structural Bank Accounts Classification Section */}
          {(overviewMode === "essential" || overviewMode === "operations" || overviewMode === "full") && (
            <BankClassificationSection accounts={accounts} transactions={transactions} />
          )}

          {/* 3. Monthly Variation Rate & Comparison Summary Card */}
          {(overviewMode === "essential" || overviewMode === "full") && (
            <MonthlyComparisonCard transactions={transactions} abonnements={abonnements} salaires={salaires} />
          )}

          {/* 4. Analytics Cards (Pie Chart, Savings Gauge, Scatter Chart) */}
          {(overviewMode === "analytics" || overviewMode === "full") && (
            <div className="space-y-6">
              <MonthlyExpenseAnalysisCard transactions={transactions} abonnements={abonnements} />
              <MonthlySavingsGaugeCard
                transactions={transactions}
                abonnements={abonnements}
                salaires={salaires}
              />
              <SubscriptionScatterChartCard
                abonnements={abonnements}
                transactions={transactions}
                salaires={salaires}
              />
            </div>
          )}

          {/* 5. Goals & Projections Cards */}
          {(overviewMode === "goals" || overviewMode === "full") && (
            <div className="space-y-6">
              <Savings3MonthProjectionSimulationCard
                transactions={transactions}
                abonnements={abonnements}
                salaires={salaires}
                initialBalance={totalEpargneActuel}
              />
              <EmergencyFundSectionCard
                accounts={accounts}
                epargnes={epargnes}
                transactions={transactions}
                setAccounts={setAccounts}
                setEpargnes={setEpargnes}
                setTransactions={setTransactions}
                triggerToast={triggerToast}
              />
              <RequiredMonthlySavingsCard
                epargnes={epargnes}
                transactions={transactions}
                abonnements={abonnements}
                salaires={salaires}
                onNavigate={onNavigate}
              />
            </div>
          )}

          {/* 6. Monthly Net Income Widget */}
          {(overviewMode === "essential" || overviewMode === "full") && (
            <MonthlyNetIncomeWidget
              budgets={budgets}
              abonnements={abonnements}
              transactions={transactions}
              salaires={salaires}
              accounts={accounts}
            />
          )}

          {/* 7. 3-Column Grid: Budgets, SaaS & Anticipation */}
          {(overviewMode === "essential" || overviewMode === "goals" || overviewMode === "full") && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Enveloppes Budgétaires Status */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-neutral-700" />
                      <span>Suivi Budgétaire d'Élite</span>
                    </h3>
                    {exceededBudgetsCount > 0 ? (
                      <span className="text-[9px] bg-red-100 border border-red-200 text-red-800 px-2 py-0.5 rounded-full font-bold">
                        {exceededBudgetsCount} Dépassés
                      </span>
                    ) : criticalBudgetsCount > 0 ? (
                      <span className="text-[9px] bg-amber-100 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                        {criticalBudgetsCount} Limites Critiques
                      </span>
                    ) : (
                      <span className="text-[9px] bg-emerald-100 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        Tous Budgets OK
                      </span>
                    )}
                  </div>

                  <div className="space-y-3.5">
                    {budgets.map((b, idx) => {
                      const spentPct = b.limitAmount > 0 ? Math.round((b.spentAmount / b.limitAmount) * 100) : 0;
                      
                      const ratio = Math.min(100, spentPct) / 100;
                      const hue = Math.max(0, 142 - ratio * 142);
                      const barColor = `hsl(${hue}, 80%, 45%)`;
                      const badgeBg = `hsl(${hue}, 85%, 96%)`;
                      const badgeText = `hsl(${hue}, 85%, 35%)`;
                      const badgeBorder = `hsl(${hue}, 85%, 88%)`;

                      return (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between items-center text-xs font-bold text-neutral-800">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: barColor }} />
                              <span className="truncate max-w-[120px] md:max-w-[150px]" title={b.category}>{b.category}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[11px] text-neutral-500 font-medium font-mono">
                                {b.spentAmount.toLocaleString("fr-FR")} / {b.limitAmount.toLocaleString("fr-FR")} MAD
                              </span>
                              <span 
                                className="text-[9px] font-black px-1.5 py-0.5 rounded-md font-mono shrink-0 shadow-3xs"
                                style={{ 
                                  backgroundColor: badgeBg, 
                                  color: badgeText,
                                  border: `1px solid ${badgeBorder}`
                                }}
                              >
                                {spentPct}%
                              </span>
                            </div>
                          </div>
                          <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden p-[1px] shadow-inner relative">
                            <div 
                              className="h-full rounded-full transition-all duration-500 ease-out" 
                              style={{ 
                                width: `${Math.min(100, spentPct)}%`,
                                backgroundColor: barColor,
                                boxShadow: spentPct > 100 ? '0 0 8px rgba(239, 68, 68, 0.5)' : `0 0 4px ${barColor}40`
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <button 
                  onClick={() => onNavigate("budgets")}
                  className="w-full mt-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Optimiser et ajuster mes budgets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Anticiper les Dépenses & Projections de fin de mois */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                    <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                      <span>Anticipation Fin de Mois</span>
                    </h3>
                    <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      projectionData.statusColor === "red" 
                        ? "bg-red-100 border border-red-200 text-red-800" 
                        : projectionData.statusColor === "amber" 
                          ? "bg-amber-100 border border-amber-200 text-amber-800" 
                          : "bg-emerald-100 border border-emerald-200 text-emerald-800"
                    }`}>
                      {projectionData.statusLabel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 py-1">
                    <div className="bg-neutral-50/75 border border-neutral-200/40 p-2 text-center rounded-xl">
                      <span className="text-[8.5px] text-neutral-400 font-black uppercase tracking-wider block mb-0.5">Moyenne / Jour</span>
                      <span className="text-[12.5px] font-black font-mono text-neutral-800">
                        {projectionData.averageDailySpent.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} MAD
                      </span>
                    </div>
                    <div className="bg-neutral-50/75 border border-neutral-200/40 p-2 text-center rounded-xl">
                      <span className="text-[8.5px] text-neutral-400 font-black uppercase tracking-wider block mb-0.5">Jours Restants</span>
                      <span className="text-[12.5px] font-black font-mono text-neutral-800">
                        {projectionData.daysRemaining} jours
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 border-t border-neutral-100/60 pt-2.5">
                    <div className="flex justify-between text-[11px] font-bold text-neutral-500">
                      <span>Dépenses cumulées</span>
                      <span className="font-mono text-neutral-800 font-bold">{projectionData.baselineExpenses.toLocaleString("fr-FR")} MAD</span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-neutral-500">
                      <span>Projection fin de mois</span>
                      <span className={`font-mono font-black ${projectionData.isOverrun ? "text-red-600" : "text-emerald-600"}`}>
                        {projectionData.totalProjectedSpent.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} MAD
                      </span>
                    </div>
                    <div className="flex justify-between text-[11px] font-bold text-neutral-500">
                      <span>Limite Budget</span>
                      <span className="font-mono text-neutral-700 font-semibold">{projectionData.totalLimit.toLocaleString("fr-FR")} MAD</span>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[9.5px] font-black uppercase tracking-wide">
                      <span className="text-neutral-400">Progression & Projection</span>
                      <span className={`font-mono ${projectionData.isOverrun ? "text-red-600 animate-pulse" : "text-emerald-600"}`}>
                        {projectionData.spentPct.toFixed(0)}% du budget
                      </span>
                    </div>
                    <div className="relative w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden border border-neutral-200/30">
                      <div 
                        className="absolute left-0 top-0 h-full bg-neutral-900 transition-all duration-300 z-10" 
                        style={{ width: `${Math.min(100, (projectionData.baselineExpenses / projectionData.totalLimit) * 100)}%` }}
                      />
                      <div 
                        className={`absolute top-0 h-full transition-all duration-300 opacity-70 ${
                          projectionData.statusColor === "red" 
                            ? "bg-red-400" 
                            : projectionData.statusColor === "amber" 
                              ? "bg-amber-400" 
                              : "bg-emerald-400"
                        }`}
                        style={{ 
                          left: `${Math.min(100, (projectionData.baselineExpenses / projectionData.totalLimit) * 100)}%`,
                          width: `${Math.min(100 - (projectionData.baselineExpenses / projectionData.totalLimit) * 100, (projectionData.projectedRemainingSpend / projectionData.totalLimit) * 100)}%`,
                          backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.4) 3px, rgba(255,255,255,0.4) 6px)"
                        }}
                      />
                      <div className="absolute right-0 top-0 h-full w-1 bg-red-600 z-20" title="Limite Budget" />
                    </div>
                  </div>
                </div>

                <div className={`p-2.5 rounded-xl border flex items-start gap-2.5 transition-all ${
                  projectionData.statusColor === "red"
                    ? "bg-red-50/50 border-red-200/50 text-red-900"
                    : projectionData.statusColor === "amber"
                      ? "bg-amber-50/50 border-amber-200/50 text-amber-900"
                      : "bg-emerald-50/40 border-emerald-200/40 text-emerald-900"
                }`}>
                  <AlertCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                    projectionData.statusColor === "red" ? "text-red-600" : projectionData.statusColor === "amber" ? "text-amber-600" : "text-emerald-600"
                  }`} />
                  <p className="text-[10px] font-semibold leading-relaxed">
                    {projectionData.advice}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 8. Cashflow Bar Chart & Spending Velocity Line Chart */}
          {(overviewMode === "analytics" || overviewMode === "full") && (
            <div className="space-y-6">
              {/* Bar Chart comparing inflows (Revenus) vs outflows (Dépenses) */}
              <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-3xs animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-neutral-900 text-white rounded-xl">
                      <Activity className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-neutral-950 uppercase tracking-wider">
                        Flux de Trésorerie (6 Derniers Mois)
                      </h3>
                      <p className="text-xs text-neutral-500 font-medium">
                        Comparaison de vos revenus mensuels totaux (Entrées) et de vos dépenses mensuelles (Sorties).
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600">
                      <span className="w-3 h-3 rounded bg-neutral-700" />
                      <span>Entrées</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600">
                      <span className="w-3 h-3 rounded bg-neutral-400" />
                      <span>Sorties</span>
                    </div>
                  </div>
                </div>

                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyChartData}
                      margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fill: '#737373', fontSize: 10, fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                        dy={8}
                      />
                      <YAxis 
                        tick={{ fill: '#737373', fontSize: 10, fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(val) => `${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const rev = payload.find((p: any) => p.dataKey === "Revenus")?.value || 0;
                            const dep = payload.find((p: any) => p.dataKey === "Dépenses")?.value || 0;
                            const solde = rev - dep;
                            return (
                              <div className="bg-neutral-950 text-white border border-neutral-800 p-3 rounded-xl shadow-xl space-y-1 text-xs">
                                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{label}</p>
                                <div className="space-y-1">
                                  <p className="flex justify-between gap-6">
                                    <span className="text-neutral-400 font-semibold">Entrées :</span>
                                    <span className="font-bold font-mono text-emerald-400">+{rev.toLocaleString("fr-FR")} MAD</span>
                                  </p>
                                  <p className="flex justify-between gap-6">
                                    <span className="text-neutral-400 font-semibold">Sorties :</span>
                                    <span className="font-bold font-mono text-red-400">-{dep.toLocaleString("fr-FR")} MAD</span>
                                  </p>
                                  <div className="border-t border-neutral-800 my-1 pt-1 flex justify-between gap-6">
                                    <span className="text-neutral-300 font-bold">Flux net :</span>
                                    <span className={`font-bold font-mono ${solde >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                      {solde >= 0 ? "+" : ""}{solde.toLocaleString("fr-FR")} MAD
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar 
                        dataKey="Revenus" 
                        fill="#404040" 
                        radius={[4, 4, 0, 0]} 
                        maxBarSize={32}
                      />
                      <Bar 
                        dataKey="Dépenses" 
                        fill="#a3a3a3" 
                        radius={[4, 4, 0, 0]} 
                        maxBarSize={32}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Spending Velocity Chart */}
              <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-3xs animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-neutral-900 text-white rounded-xl">
                      <TrendingUp className="w-5 h-5 text-amber-500 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-neutral-950 uppercase tracking-wider">
                        Vitesse de Dépense ({velocityChartData.monthName})
                      </h3>
                      <p className="text-xs text-neutral-500 font-medium">
                        Dépenses cumulées quotidiennes réelles comparées à la trajectoire budgétaire idéale.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {velocityChartData.actualIsOverIdeal ? (
                      <span className="text-[10px] bg-red-50 border border-red-200 text-red-800 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 text-red-600" />
                        Vitesse Élevée : Attention à la dérive !
                      </span>
                    ) : velocityChartData.cumulativeSpent > 0 ? (
                      <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                        <CheckSquare className="w-3 h-3 text-emerald-600" />
                        Vitesse Maîtrisée : Trajectoire d'excellence
                      </span>
                    ) : (
                      <span className="text-[10px] bg-neutral-50 border border-neutral-200 text-neutral-600 px-2.5 py-1 rounded-full font-bold">
                        Aucune dépense ce mois-ci
                      </span>
                    )}
                    <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-700 px-2.5 py-1 rounded-full font-mono font-bold">
                      Cumulé : {velocityChartData.cumulativeSpent.toLocaleString("fr-FR")} / {velocityChartData.totalLimit.toLocaleString("fr-FR")} MAD
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  <div className="lg:col-span-8 h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={velocityChartData.chartPoints}
                        margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                        <XAxis 
                          dataKey="day" 
                          tick={{ fill: '#737373', fontSize: 10, fontWeight: 600 }}
                          axisLine={false}
                          tickLine={false}
                          dy={8}
                        />
                        <YAxis 
                          tick={{ fill: '#737373', fontSize: 10, fontWeight: 600 }}
                          axisLine={false}
                          tickLine={false}
                          tickFormatter={(val) => `${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                        />
                        <Tooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-neutral-950 text-white border border-neutral-800 p-3 rounded-xl shadow-xl space-y-1 text-xs">
                                  <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Jour {data.day}</p>
                                  <div className="space-y-1">
                                    <p className="flex justify-between gap-6">
                                      <span className="text-neutral-400 font-semibold">Cumulé Réel :</span>
                                      <span className="font-bold font-mono text-white">
                                        {data["Dépenses Cumulées"] !== undefined ? `${data["Dépenses Cumulées"].toLocaleString("fr-FR")} MAD` : "Non survenu"}
                                      </span>
                                    </p>
                                    <p className="flex justify-between gap-6">
                                      <span className="text-neutral-400 font-semibold">Cible Trajectoire :</span>
                                      <span className="font-bold font-mono text-neutral-300">
                                        {data["Trajectoire Idéale"].toLocaleString("fr-FR")} MAD
                                      </span>
                                    </p>
                                    <p className="flex justify-between gap-6">
                                      <span className="text-neutral-400 font-semibold">Limite Budget :</span>
                                      <span className="font-bold font-mono text-red-400">
                                        {data["Limite de Budget"].toLocaleString("fr-FR")} MAD
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Limite de Budget" 
                          stroke="#ef4444" 
                          strokeWidth={1.5}
                          strokeDasharray="4 4"
                          dot={false}
                          activeDot={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Trajectoire Idéale" 
                          stroke="#a3a3a3" 
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                          activeDot={false}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="Dépenses Cumulées" 
                          stroke="#171717" 
                          strokeWidth={3}
                          connectNulls={false}
                          dot={{ r: 3, fill: '#171717' }}
                          activeDot={{ r: 6, fill: '#171717', stroke: '#ffffff', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="lg:col-span-4 space-y-4 bg-neutral-50 p-5 border border-neutral-200/50 rounded-2xl h-full flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider pb-1.5 border-b border-neutral-200/60 flex items-center gap-1.5">
                        <span>Indicateurs de Vitesse</span>
                        <span className="text-[9px] bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded-md font-mono">Jour {velocityChartData.todayDay}</span>
                      </h4>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                          <span className="text-neutral-500">Dépenses Cumulées :</span>
                          <span className="font-mono font-bold text-neutral-950">
                            {velocityChartData.cumulativeSpent.toLocaleString("fr-FR")} MAD
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-neutral-500">Objectif à ce jour :</span>
                          <span className="font-mono font-bold text-neutral-600">
                            {velocityChartData.currentIdeal.toLocaleString("fr-FR")} MAD
                          </span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-neutral-500">Écart Trajectoire :</span>
                          <span className={`font-mono font-bold ${
                            velocityChartData.cumulativeSpent - velocityChartData.currentIdeal > 0 
                              ? "text-red-600" 
                              : "text-emerald-600"
                          }`}>
                            {velocityChartData.cumulativeSpent - velocityChartData.currentIdeal > 0 ? "+" : ""}
                            {(velocityChartData.cumulativeSpent - velocityChartData.currentIdeal).toLocaleString("fr-FR")} MAD
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="text-[10px] text-neutral-400 font-semibold leading-normal border-t border-neutral-200/40 pt-3">
                        📈 <strong>Guide de Lecture :</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1 text-neutral-500 font-medium">
                          <li>La ligne rouge en pointillés est votre limite mensuelle maximale.</li>
                          <li>La ligne grise en pointillés est le rythme d'épuisement linéaire idéal.</li>
                          <li>Votre ligne noire cumulée doit rester au-dessous de la ligne grise.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. TRANSACTION ANALYSIS & SORTING CARD */}
          {(overviewMode === "operations" || overviewMode === "full") && (
            <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-5 shadow-3xs animate-in fade-in duration-300">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 border border-indigo-200/80 text-indigo-700 rounded-2xl shrink-0">
              <ArrowUpDown className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-extrabold text-neutral-950 uppercase tracking-tight">
                  Analyse & Tri des Transactions ({sortedAndFilteredTransactions.length})
                </h3>
                <span className="text-[10px] bg-indigo-100 border border-indigo-200 text-indigo-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Tri Dynamique
                </span>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Triez instantanément l'ensemble de vos transactions par date ou par montant pour analyser vos flux.
              </p>
            </div>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider hidden xl:inline">Accès rapide :</span>
            <button
              type="button"
              onClick={() => { setTxSortKey("date"); setTxSortDir("desc"); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                txSortKey === "date" && txSortDir === "desc"
                  ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                  : "bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Récent ↓</span>
            </button>

            <button
              type="button"
              onClick={() => { setTxSortKey("date"); setTxSortDir("asc"); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                txSortKey === "date" && txSortDir === "asc"
                  ? "bg-neutral-900 text-white border-neutral-900 shadow-xs"
                  : "bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700"
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Ancien ↑</span>
            </button>

            <button
              type="button"
              onClick={() => { setTxSortKey("amount"); setTxSortDir("desc"); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                txSortKey === "amount" && txSortDir === "desc"
                  ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                  : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800"
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Montant Max ↓</span>
            </button>

            <button
              type="button"
              onClick={() => { setTxSortKey("amount"); setTxSortDir("asc"); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                txSortKey === "amount" && txSortDir === "asc"
                  ? "bg-emerald-700 text-white border-emerald-700 shadow-xs"
                  : "bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-800"
              }`}
            >
              <Coins className="w-3.5 h-3.5" />
              <span>Montant Min ↑</span>
            </button>
          </div>
        </div>

        {/* Filter and Control Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 bg-neutral-50/80 border border-neutral-200/80 p-3 rounded-2xl">
          {/* Search Input */}
          <div className="lg:col-span-4 relative flex items-center">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              value={txSearch}
              onChange={(e) => setTxSearch(e.target.value)}
              placeholder="Rechercher par libellé, compte, catégorie..."
              className="w-full bg-white border border-neutral-200 text-neutral-900 rounded-xl pl-9 pr-3 py-2 text-xs font-semibold placeholder-neutral-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Type Filter */}
          <div className="lg:col-span-3 flex items-center">
            <select
              value={txTypeFilter}
              onChange={(e) => setTxTypeFilter(e.target.value)}
              className="w-full bg-white border border-neutral-200 text-neutral-800 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500"
            >
              <option value="Tous">Tous les types (Revenu, Dépense, Épargne)</option>
              <option value="Revenue">Entrées / Revenus</option>
              <option value="Dépense">Sorties / Dépenses</option>
              <option value="Épargne">Transferts Épargne</option>
            </select>
          </div>

          {/* Category Filter */}
          <div className="lg:col-span-3 flex items-center">
            <select
              value={txCategoryFilter}
              onChange={(e) => setTxCategoryFilter(e.target.value)}
              className="w-full bg-white border border-neutral-200 text-neutral-800 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-indigo-500"
            >
              <option value="Tous">Toutes les catégories ({uniqueTxCategories.length})</option>
              {uniqueTxCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Sort Key & Direction Toggle */}
          <div className="lg:col-span-2 flex items-center gap-1">
            <select
              value={txSortKey}
              onChange={(e) => setTxSortKey(e.target.value as "date" | "amount" | "description")}
              className="w-full bg-white border border-neutral-200 text-neutral-900 rounded-xl px-2.5 py-2 text-xs font-extrabold focus:outline-none focus:border-indigo-500"
            >
              <option value="date">Tri: Date</option>
              <option value="amount">Tri: Montant</option>
              <option value="description">Tri: Libellé</option>
            </select>

            <button
              type="button"
              onClick={() => setTxSortDir(prev => prev === "asc" ? "desc" : "asc")}
              className="p-2 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-100 text-neutral-800 font-bold transition-all cursor-pointer shrink-0"
              title={txSortDir === "asc" ? "Ordre croissant" : "Ordre décroissant"}
            >
              {txSortDir === "asc" ? <ArrowUp className="w-4 h-4 text-emerald-600" /> : <ArrowDown className="w-4 h-4 text-indigo-600" />}
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        {sortedAndFilteredTransactions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-2xl bg-neutral-50/50">
            <Coins className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-neutral-600">Aucune transaction trouvée.</p>
            <p className="text-[11px] text-neutral-400 mt-1">Essayez de réinitialiser vos critères de recherche ou de filtre.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-neutral-200/80">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-neutral-100/90 text-neutral-600 font-extrabold uppercase text-[10px] tracking-wider border-b border-neutral-200">
                  {/* Clickable Date Column Header */}
                  <th 
                    onClick={() => {
                      if (txSortKey === "date") {
                        setTxSortDir(prev => prev === "asc" ? "desc" : "asc");
                      } else {
                        setTxSortKey("date");
                        setTxSortDir("desc");
                      }
                    }}
                    className="py-3 px-4 cursor-pointer hover:bg-neutral-200/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Date</span>
                      {txSortKey === "date" ? (
                        txSortDir === "desc" ? <ArrowDown className="w-3.5 h-3.5 text-indigo-600" /> : <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                      )}
                    </div>
                  </th>

                  {/* Clickable Description Column Header */}
                  <th 
                    onClick={() => {
                      if (txSortKey === "description") {
                        setTxSortDir(prev => prev === "asc" ? "desc" : "asc");
                      } else {
                        setTxSortKey("description");
                        setTxSortDir("asc");
                      }
                    }}
                    className="py-3 px-4 cursor-pointer hover:bg-neutral-200/60 transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Libellé & Destinataire</span>
                      {txSortKey === "description" ? (
                        txSortDir === "desc" ? <ArrowDown className="w-3.5 h-3.5 text-indigo-600" /> : <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                      )}
                    </div>
                  </th>

                  <th className="py-3 px-4">Catégorie</th>
                  <th className="py-3 px-4">Compte Source</th>

                  {/* Clickable Amount Column Header */}
                  <th 
                    onClick={() => {
                      if (txSortKey === "amount") {
                        setTxSortDir(prev => prev === "asc" ? "desc" : "asc");
                      } else {
                        setTxSortKey("amount");
                        setTxSortDir("desc");
                      }
                    }}
                    className="py-3 px-4 text-right cursor-pointer hover:bg-neutral-200/60 transition-colors select-none"
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <span>Montant (MAD)</span>
                      {txSortKey === "amount" ? (
                        txSortDir === "desc" ? <ArrowDown className="w-3.5 h-3.5 text-emerald-600" /> : <ArrowUp className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <ArrowUpDown className="w-3 h-3 text-neutral-400" />
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium">
                {sortedAndFilteredTransactions.map((tx) => {
                  const isRev = tx.type === "Revenue" || tx.category === "Salaire & Revenus";
                  const isEpar = tx.type === "Épargne" || tx.category === "Épargne & Projets Futurs";

                  return (
                    <tr key={tx.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-4 font-mono text-[11px] font-bold text-neutral-600 whitespace-nowrap">
                        {tx.date || "2026-07-01"}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-extrabold text-neutral-900 block leading-tight">
                          {tx.description}
                        </span>
                        {tx.recipient && (
                          <span className="text-[10px] text-neutral-400 font-mono block">
                            Destinataire: {tx.recipient}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-[10px] font-bold bg-neutral-100 text-neutral-700 border border-neutral-200/80">
                          {tx.category || "Général"}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[11px] font-mono text-neutral-500">
                        {tx.account || "Attijariwafa Bank"}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-black text-sm whitespace-nowrap">
                        <span className={isRev ? "text-emerald-600" : isEpar ? "text-indigo-600" : "text-neutral-900"}>
                          {isRev ? "+" : isEpar ? "➡️ " : "-"}{(Number(tx.amount) || 0).toLocaleString("fr-FR")} <span className="text-[10px] font-normal text-neutral-400">MAD</span>
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
          )}
        </div>
      ) : activeDashTab === "charts" ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <FinanceCharts
            transactions={transactions}
            budgets={budgets}
            stocks={stocks}
            epargnes={epargnes}
            abonnements={abonnements}
            salaires={salaires}
          />
          <NetSavingsChart transactions={transactions} abonnements={abonnements} />
          <SavingsTrendChart transactions={transactions} abonnements={abonnements} />
        </div>
      ) : activeDashTab === "settings" ? (
        <div className="animate-in fade-in duration-300">
          <FinanceCategorySettings triggerToast={triggerToast} />
        </div>
      ) : (
        <div className="animate-in fade-in duration-300">
          <FireCalculator
            stocks={stocks}
            epargnes={epargnes}
            accounts={accounts}
            salaires={salaires}
            transactions={transactions}
            budgets={budgets}
            triggerToast={triggerToast}
          />
        </div>
      )}
    </div>
  );
}

// ==========================================
// 2. PRODUCTIVITY SECTION DASHBOARD
// ==========================================
interface ProductivityDashProps {
  dailyHabits: DailyHabit[];
  actions30Jours: Action30Jours[];
  weeklyObjectives: WeeklyObjective[];
  profilAmeliorations: ProfilAmelioration[];
  possibilitesGoals: PossibiliteGoal[];
  journalEntries: JournalEntry[];
  streakCount: number;
  onNavigate: (moduleId: string) => void;
  onToggleHabit: (id: string) => void;
  // Morning Reminder state & handlers
  morningReminderEnabled: boolean;
  setMorningReminderEnabled: (val: boolean) => void;
  morningReminderTime: string;
  setMorningReminderTime: (val: string) => void;
  morningReminderText: string;
  setMorningReminderText: (val: string) => void;
  onTriggerImmediateCheck: () => void;
  notificationPermission: string;
  requestNotificationPermission: () => void;
  habitHistory: Record<string, string[]>;
  skinTrackers?: SkinTracker[];
  mealPlanners?: MealPlanner[];
}

export function ProductivitySectionDashboard({ 
  dailyHabits, actions30Jours, weeklyObjectives, profilAmeliorations, possibilitesGoals, journalEntries, streakCount, onNavigate, onToggleHabit,
  morningReminderEnabled, setMorningReminderEnabled, morningReminderTime, setMorningReminderTime, morningReminderText, setMorningReminderText,
  onTriggerImmediateCheck, notificationPermission, requestNotificationPermission, habitHistory,
  skinTrackers = [], mealPlanners = []
}: ProductivityDashProps) {
  const [habitFreqFilter, setHabitFreqFilter] = React.useState<"Tous" | "Quotidien" | "Hebdomadaire" | "Mensuel">("Tous");

  // Stats
  const completedHabitsToday = dailyHabits.filter(h => h.completed).length;
  const totalHabitsCount = dailyHabits.length;
  const completed30JoursActions = actions30Jours.filter(a => a.completed).length;

  const filteredHabits = React.useMemo(() => {
    if (habitFreqFilter === "Tous") return dailyHabits;
    return dailyHabits.filter(h => (h.frequency || "Quotidien") === habitFreqFilter);
  }, [dailyHabits, habitFreqFilter]);

  const last7DaysTrend = React.useMemo(() => {
    const trendData = [];
    const today = new Date();
    const importantHabits = dailyHabits.filter(h => h.isImportant);
    const totalImportantCount = importantHabits.length;

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      const completedIds = habitHistory[dateStr] || [];
      const completedImportant = importantHabits.filter(h => completedIds.includes(h.id)).length;
      const completionRate = totalImportantCount > 0 ? Math.round((completedImportant / totalImportantCount) * 100) : 0;
      
      const dayLabel = d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" });
      
      trendData.push({
        date: dateStr,
        label: dayLabel,
        completed: completedImportant,
        total: totalImportantCount,
        rate: completionRate,
      });
    }
    return trendData;
  }, [habitHistory, dailyHabits]);

  const habitTrendWeeks = React.useMemo(() => {
    const today = new Date();
    const habitsCount = dailyHabits.length || 7;

    let currentCompleted = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      currentCompleted += (habitHistory[dateStr] || []).length;
    }

    let prevCompleted = 0;
    for (let i = 7; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      prevCompleted += (habitHistory[dateStr] || []).length;
    }

    const currentRate = (currentCompleted / Math.max(1, 7 * habitsCount)) * 100;
    const prevRate = (prevCompleted / Math.max(1, 7 * habitsCount)) * 100;

    const rateDiff = currentRate - prevRate;
    const isIncrease = rateDiff >= 0;

    let relativeIncrease = 0;
    if (prevRate > 0) {
      relativeIncrease = (rateDiff / prevRate) * 100;
    } else if (currentRate > 0) {
      relativeIncrease = 100;
    }

    return {
      currentRate: Math.round(currentRate),
      prevRate: Math.round(prevRate),
      rateDiff: parseFloat(rateDiff.toFixed(1)),
      relativeIncrease: parseFloat(relativeIncrease.toFixed(1)),
      isIncrease
    };
  }, [habitHistory, dailyHabits]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/60 pb-4">
        <div>
          <h2 className="text-lg font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <span>Tableau de bord de Productivité & Santé</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Assiduité d'élite, habitudes, sprints de combat, soins du corps et suivi nutritionnel unifiés.
          </p>
        </div>
      </div>

      {/* Streak and Habits Hero Block */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-neutral-900 text-white border border-neutral-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Série de Discipline</span>
            <h4 className="text-2xl font-black font-mono leading-none flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-500 fill-amber-500 shrink-0" />
              <span>{streakCount} JOURS</span>
            </h4>
            <span className="text-[10px] text-neutral-400 block font-medium">Continuez à valider quotidiennement vos disciplines</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-3xs">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Habitudes Aujourd'hui</span>
            <h4 className="text-2xl font-black font-mono text-neutral-900 leading-none">
              {completedHabitsToday} / {totalHabitsCount}
            </h4>
            <div className="w-24 bg-neutral-100 h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className="bg-neutral-900 h-full rounded-full transition-all" 
                style={{ width: `${totalHabitsCount > 0 ? (completedHabitsToday / totalHabitsCount) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-3xs">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Progression du Sprint 30J</span>
            <h4 className="text-2xl font-black font-mono text-neutral-900 leading-none">
              {completed30JoursActions} / 30
            </h4>
            <span className="text-[10px] text-neutral-400 block font-medium">Sprint de combat et focus projet</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-3xs">
          <div className="space-y-1.5 w-full">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Rendement Hebdomadaire</span>
            <div className="flex items-baseline gap-2">
              <h4 className="text-2xl font-black font-mono text-neutral-900 leading-none">
                {habitTrendWeeks.isIncrease ? "+" : ""}{habitTrendWeeks.relativeIncrease}%
              </h4>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                habitTrendWeeks.isIncrease 
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400" 
                  : "bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-400"
              }`}>
                {habitTrendWeeks.isIncrease ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{habitTrendWeeks.rateDiff > 0 ? "+" : ""}{habitTrendWeeks.rateDiff}% pt</span>
              </span>
            </div>
            <span className="text-[10px] text-neutral-400 block font-medium leading-relaxed">
              Complétion à <strong className="text-neutral-700">{habitTrendWeeks.currentRate}%</strong> contre {habitTrendWeeks.prevRate}% la semaine dernière
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Todays Habits Fast Panel */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 flex-wrap gap-2">
              <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-neutral-700" />
                <span>Disciplines & Tâches</span>
              </h3>
              <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full font-mono">
                {completedHabitsToday} / {totalHabitsCount} validées
              </span>
            </div>

            {/* Frequency filter tabs */}
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl text-[10px] font-bold">
              {(["Tous", "Quotidien", "Hebdomadaire", "Mensuel"] as const).map(freq => (
                <button
                  key={freq}
                  onClick={() => setHabitFreqFilter(freq)}
                  className={`flex-1 py-1 px-1 rounded-lg transition-all cursor-pointer text-center ${
                    habitFreqFilter === freq 
                      ? "bg-white text-neutral-900 shadow-xs font-black" 
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  {freq === "Tous" ? "Tous" : freq === "Quotidien" ? "Quotidien" : freq === "Hebdomadaire" ? "Hebdo" : "Mensuel"}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {filteredHabits.length === 0 ? (
                <div className="text-center py-6 text-xs text-neutral-400 italic">
                  Aucune tâche ou habitude pour cette fréquence.
                </div>
              ) : (
                filteredHabits.map((habit) => (
                  <button
                    key={habit.id}
                    onClick={() => onToggleHabit(habit.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                      habit.completed
                        ? "bg-neutral-50/50 border-neutral-200 text-neutral-400"
                        : "bg-white border-neutral-200 text-neutral-850 hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="shrink-0">
                        {habit.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-neutral-900 fill-neutral-900 text-white" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-neutral-300 rounded" />
                        )}
                      </div>
                      <div>
                        <span className={`text-xs font-semibold block ${habit.completed ? "line-through text-neutral-400" : "text-neutral-800"}`}>
                          {habit.name}
                        </span>
                        {habit.description && (
                          <span className="text-[10px] text-neutral-400 block truncate max-w-[150px]">
                            {habit.description}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {habit.frequency && habit.frequency !== "Quotidien" && (
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded border ${
                          habit.frequency === "Hebdomadaire" 
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                            : "bg-purple-50 border-purple-200 text-purple-700"
                        }`}>
                          {habit.frequency === "Hebdomadaire" ? "Hebdo" : "Mensuel"}
                        </span>
                      )}
                      {(() => {
                        const badge = getHabitCategoryBadge(habit.category);
                        return (
                          <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${badge.className}`}>
                            {badge.label}
                          </span>
                        );
                      })()}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          <button 
            onClick={() => onNavigate("habits")}
            className="w-full py-2.5 mt-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Voir l'historique complet et heatmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Starred Weekly Objectives */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-neutral-700" />
                <span>Objectifs de la Semaine</span>
              </h3>
              <span className="text-[10px] font-bold text-neutral-500 bg-neutral-50 px-2 py-0.5 rounded-full font-mono">
                {weeklyObjectives.filter(o => o.isPriority).length} Starred
              </span>
            </div>

            <div className="space-y-2.5">
              {weeklyObjectives.filter(o => o.isPriority).length === 0 ? (
                <div className="text-center py-8 text-xs text-neutral-400 italic">
                  Aucun objectif prioritaire épinglé pour cette semaine.
                </div>
              ) : (
                weeklyObjectives.filter(o => o.isPriority).map(obj => (
                  <div key={obj.id} className="flex items-center gap-3 p-3 bg-amber-50/20 border border-amber-100 rounded-xl">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                    <span className={`text-xs font-semibold text-neutral-850 ${obj.completed ? "line-through text-neutral-400" : ""}`}>
                      {obj.text}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <button 
            onClick={() => onNavigate("dashboard")}
            className="w-full py-2.5 mt-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Gérer mes objectifs sur la page d'accueil</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Customizable Morning Push Notification Reminder */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
                <Bell className="w-4 h-4 text-neutral-700 animate-bounce" />
                <span>Rappel Matinal de Discipline</span>
              </h3>
              <div className="flex items-center gap-1.5">
                {notificationPermission === "granted" ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                    <span>Actif</span>
                  </span>
                ) : (
                  <button 
                    onClick={requestNotificationPermission}
                    className="text-[9px] font-extrabold text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-full border border-amber-200 transition-colors cursor-pointer"
                  >
                    Demander l'accès
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] text-neutral-500 leading-normal">
                Configurez une notification push quotidienne pour vous rappeler d'exécuter vos objectifs prioritaires du matin.
              </p>

              {/* Toggle Enable */}
              <div className="flex items-center justify-between p-2.5 bg-neutral-50 border border-neutral-200/50 rounded-xl">
                <span className="text-xs font-bold text-neutral-800">Activer le rappel</span>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={morningReminderEnabled}
                    onChange={(e) => setMorningReminderEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-neutral-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-neutral-900"></div>
                </label>
              </div>

              {morningReminderEnabled && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-250">
                  {/* Time picker */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">Heure du rappel (chaque matin)</label>
                    <div className="relative">
                      <input 
                        type="time" 
                        value={morningReminderTime}
                        onChange={(e) => setMorningReminderTime(e.target.value)}
                        className="w-full bg-white border border-neutral-200 text-neutral-900 rounded-xl px-3 py-2 text-xs font-bold font-mono focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-all cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Notification text */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-wider block">Message personnalisé</label>
                    <textarea 
                      value={morningReminderText}
                      onChange={(e) => setMorningReminderText(e.target.value)}
                      rows={2}
                      placeholder="Votre message d'encouragement..."
                      className="w-full bg-white border border-neutral-200 text-neutral-800 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-neutral-900 transition-all resize-none leading-snug"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={onTriggerImmediateCheck}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-3xs cursor-pointer select-none"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Tester la notification push</span>
            </button>
          </div>
        </div>
      </div>

      {/* Line Chart showing completion rates of 'Important' habits over the last 7 days */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-3xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-neutral-900 text-white rounded-xl">
              <Activity className="w-5 h-5 text-amber-500 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-black text-neutral-950 uppercase tracking-wider">
                Assiduité des Habitudes Clés (Important)
              </h3>
              <p className="text-xs text-neutral-500">
                Taux de complétion sur les 7 derniers jours des disciplines marquées comme prioritaires.
              </p>
            </div>
          </div>
          
          {/* Quick Stat badges */}
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-full font-bold">
              {dailyHabits.filter(h => h.isImportant).length} Habitudes importantes sous contrôle
            </span>
            <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-700 px-2.5 py-1 rounded-full font-mono font-bold">
              Moyenne 7j : {last7DaysTrend.length > 0 ? Math.round(last7DaysTrend.reduce((sum, d) => sum + d.rate, 0) / last7DaysTrend.length) : 0}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Chart column */}
          <div className="lg:col-span-8 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={last7DaysTrend}
                margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fill: '#737373', fontSize: 10, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                  dy={8}
                />
                <YAxis 
                  domain={[0, 100]}
                  tickFormatter={(val) => `${val}%`}
                  tick={{ fill: '#737373', fontSize: 10, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-neutral-950 text-white border border-neutral-800 p-3 rounded-xl shadow-xl space-y-1">
                          <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{data.date}</p>
                          <p className="text-xs font-bold text-white">
                            Complétion : {data.rate}%
                          </p>
                          <p className="text-[10px] text-neutral-400">
                            ({data.completed} sur {data.total} importantes validées)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#171717" 
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: '#171717', stroke: '#ffffff', strokeWidth: 2 }}
                  dot={{ r: 4, fill: '#f59e0b', strokeWidth: 1 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Key Habits list column */}
          <div className="lg:col-span-4 space-y-3 bg-neutral-50 p-4 border border-neutral-200/50 rounded-2xl h-full flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="text-xs font-black text-neutral-800 uppercase tracking-wider pb-1.5 border-b border-neutral-200/60 flex items-center gap-1.5">
                <span>Routines d'Élite</span>
                <span className="text-[9px] bg-neutral-200 text-neutral-700 px-1.5 py-0.5 rounded-md font-mono">LIVE</span>
              </h4>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {dailyHabits.filter(h => h.isImportant).length === 0 ? (
                  <p className="text-xs text-neutral-500 italic py-4 text-center">Aucune habitude importante active.</p>
                ) : (
                  dailyHabits.filter(h => h.isImportant).map(habit => {
                    const badge = getHabitCategoryBadge(habit.category);
                    return (
                      <div key={habit.id} className="flex items-center justify-between p-2 bg-white border border-neutral-250/50 rounded-lg shadow-3xs">
                        <div className="flex flex-col min-w-0">
                          <span className="text-xs font-bold text-neutral-800 truncate max-w-[150px]" title={habit.name}>
                            {habit.name}
                          </span>
                          <span className={`text-[7px] font-black uppercase px-1.5 py-0.5 rounded border self-start mt-1 ${badge.className}`}>
                            {badge.label}
                          </span>
                        </div>
                        <span className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                          habit.completed 
                            ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                            : "bg-amber-50 border border-amber-200 text-amber-800"
                        }`}>
                          {habit.completed ? "Validé" : "À faire"}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="text-[10px] text-neutral-400 font-semibold leading-normal pt-2 border-t border-neutral-200/40">
              💡 <strong>Astuce de Performance :</strong> L'assiduité sur ces disciplines clés d'entraînement est le meilleur indicateur avancé de votre succès à long terme.
            </div>
          </div>
        </div>
      </div>

      {/* Merged Health & Soins Dashboard Section */}
      <div className="pt-6 border-t border-neutral-200/80">
        <HealthSectionDashboard skinTrackers={skinTrackers} mealPlanners={mealPlanners} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

// ==========================================
// 3. HEALTH & BEAUTY SECTION DASHBOARD
// ==========================================
interface HealthDashProps {
  skinTrackers: SkinTracker[];
  mealPlanners: MealPlanner[];
  onNavigate: (moduleId: string) => void;
}

export function HealthSectionDashboard({ skinTrackers, mealPlanners, onNavigate }: HealthDashProps) {
  const todayStr = new Date().toISOString().split("T")[0];
  const todaySkinLog = skinTrackers.find(s => s.date === todayStr);
  const hydrationAmount = todaySkinLog?.waterIntakeLiters || 0;

  // Active sport timer state is purely visual on this dashboard
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/60 pb-4">
        <div>
          <h2 className="text-lg font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
            <Heart className="w-5 h-5 text-neutral-800" />
            <span>Tableau de bord de Santé & Soins</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Suivi quotidien de la routine cutanée, d'hydratation, d'activité sportive et de nutrition.
          </p>
        </div>
      </div>

      {/* Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Hydratation & Routine */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-3xs flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neutral-700" />
              <span>Hydratation & Soins du Jour</span>
            </h3>
            
            <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl text-center space-y-1.5">
              <span className="text-2xl">💧</span>
              <h4 className="text-xl font-black font-mono text-indigo-950 leading-none">{hydrationAmount.toFixed(2)} L</h4>
              <span className="text-[10px] text-indigo-500 font-bold block">Objectif quotidien : 2.5 Litres</span>
              <div className="w-full bg-indigo-100/50 h-2 rounded-full overflow-hidden mt-2 border border-indigo-200/20">
                <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (hydrationAmount / 2.5) * 100)}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-center">
                <span className="text-xs font-bold text-neutral-500 block uppercase tracking-wider">Matin (SPF)</span>
                <span className="text-sm font-black text-neutral-800 block mt-1">
                  {todaySkinLog?.morningRoutine ? "✅ Fait" : "❌ En attente"}
                </span>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-center">
                <span className="text-xs font-bold text-neutral-500 block uppercase tracking-wider">Soir (Sérum)</span>
                <span className="text-sm font-black text-neutral-800 block mt-1">
                  {todaySkinLog?.eveningRoutine ? "✅ Fait" : "❌ En attente"}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate("skin")}
            className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer text-center"
          >
            Mettre à jour mes routines de soin
          </button>
        </div>

        {/* Column 2: Sport Fast Control */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-3xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-neutral-700" />
              <span>Minuteur Focus Sport (30 min)</span>
            </h3>

            <div className="py-6 bg-neutral-50 border border-neutral-200/50 rounded-2xl flex flex-col items-center justify-center space-y-4">
              <span className="text-3xl font-mono font-black text-neutral-900 tracking-tight">{formatTime(timeRemaining)}</span>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-neutral-900 hover:bg-neutral-850 text-white flex items-center justify-center shadow-xs cursor-pointer select-none"
                >
                  {isPlaying ? <Pause className="w-4.5 h-4.5 fill-white text-white" /> : <Play className="w-4.5 h-4.5 fill-white text-white translate-x-0.5" />}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setTimeRemaining(1800);
                  }}
                  className="px-3.5 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 transition-all cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate("sport")}
            className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-750 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Ouvrir l'entraînement et exercices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Column 3: Planificateur de Repas */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-3xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-neutral-700" />
              <span>Plan Nutritionnel de la Semaine</span>
            </h3>

            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {mealPlanners.slice(0, 3).map((meal) => (
                <div key={meal.id} className="p-3 bg-neutral-50 border border-neutral-200/50 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 block uppercase font-mono">{meal.dayOfWeek} • {meal.mealType}</span>
                    <span className="text-xs font-extrabold text-neutral-850 block mt-0.5">{meal.description}</span>
                  </div>
                  <span className="text-xs font-black font-mono text-neutral-650 bg-white border border-neutral-200/80 px-2 py-0.5 rounded-lg shrink-0 ml-2">
                    {meal.calories} kcal
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigate("meal")}
            className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-750 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Planifier tous mes repas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 4. PROJECTS & ACADEMY SECTION DASHBOARD
// ==========================================
interface ProjetsDashProps {
  folders: ProjectFolder[];
  formations: Formation[];
  onNavigate: (moduleId: string) => void;
}

export function ProjetsSectionDashboard({ folders, formations, onNavigate }: ProjetsDashProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/60 pb-4">
        <div>
          <h2 className="text-lg font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-neutral-800" />
            <span>Tableau de bord de Projets & Académie</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Aperçu global de vos dossiers de projets actifs, préparation de contenus et montée en compétences d'élite.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Project folders list with progress */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-neutral-700" />
              <span>Dossiers de Projets Actifs</span>
            </h3>
            <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full font-mono font-bold">
              {folders.length} Dossiers
            </span>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {folders.slice(0, 3).map((folder) => {
              const totalObjectives = folder.customObjectives.length;
              const completedObjectives = folder.customObjectives.filter(o => o.completed).length;
              const progressPct = totalObjectives > 0 ? Math.round((completedObjectives / totalObjectives) * 100) : 0;

              return (
                <div key={folder.id} className="p-4 bg-neutral-50 border border-neutral-200/50 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-neutral-900 block">{folder.name}</span>
                      <span className="text-[10px] text-neutral-400 font-medium block truncate max-w-[200px]">{folder.description}</span>
                    </div>
                    <span className="text-[9px] bg-neutral-900 text-white border border-neutral-800 px-2 py-0.5 rounded font-bold font-mono">
                      {folder.category}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-neutral-500 font-mono">
                      <span>Progression : {completedObjectives}/{totalObjectives}</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-neutral-900 h-full rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => onNavigate("channels")}
            className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer text-center"
          >
            Accéder à mes Projets Médias & Canaux
          </button>
        </div>

        {/* Competencies / Formations */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-neutral-700" />
                <span>Montée en Compétences & Académie</span>
              </h3>
              <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full font-mono font-bold">
                {formations.filter(f => f.status === "En cours").length} En cours
              </span>
            </div>

            <div className="space-y-2.5">
              {formations.slice(0, 3).map((form) => (
                <div key={form.id} className="p-3 bg-neutral-50 border border-neutral-200/50 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-extrabold text-neutral-850 block">{form.title}</span>
                      <span className="text-[9px] text-neutral-400 font-semibold uppercase">{form.platform} • {form.instructor}</span>
                    </div>
                    <span className="text-[9px] font-bold text-neutral-500 bg-white border border-neutral-200 px-1.5 py-0.5 rounded font-mono">
                      {form.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200/80 h-1 rounded-full overflow-hidden">
                    <div className="bg-neutral-900 h-full rounded-full" style={{ width: `${form.progressPercent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigate("formations")}
            className="w-full py-2.5 mt-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-750 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Gérer mon académie complète</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 5. LECTURES & SCREENS SECTION DASHBOARD
// ==========================================
interface LecturesDashProps {
  books: BookItem[];
  setBooks?: React.Dispatch<React.SetStateAction<BookItem[]>>;
  screenMedia: ScreenMediaItem[];
  setScreenMedia?: React.Dispatch<React.SetStateAction<ScreenMediaItem[]>>;
  formations?: Formation[];
  setFormations?: React.Dispatch<React.SetStateAction<Formation[]>>;
  dailyHabits?: DailyHabit[];
  setDailyHabits?: React.Dispatch<React.SetStateAction<DailyHabit[]>>;
  mediaProgressLogs?: MediaProgressLog[];
  setMediaProgressLogs?: React.Dispatch<React.SetStateAction<MediaProgressLog[]>>;
  onNavigate: (moduleId: string) => void;
  triggerToast?: (title: string, message: string, type?: "success" | "warning" | "info") => void;
}

export function LecturesSectionDashboard({ 
  books, 
  setBooks, 
  screenMedia, 
  setScreenMedia, 
  formations = [], 
  setFormations, 
  dailyHabits = [], 
  setDailyHabits, 
  mediaProgressLogs = [], 
  setMediaProgressLogs, 
  onNavigate,
  triggerToast
}: LecturesDashProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/60 pb-4">
        <div>
          <h2 className="text-lg font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-neutral-800" />
            <span>Tableau de bord de Lectures & Écrans</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Aperçu de vos lectures de développement personnel, finances, et votre file d'attente multimédia.
          </p>
        </div>
      </div>

      {/* MEDIA & CULTURE PROGRESS WIDGET */}
      {setBooks && setScreenMedia && setFormations && setDailyHabits && setMediaProgressLogs && (
        <MediaProgressWidget
          books={books}
          setBooks={setBooks}
          screenMedia={screenMedia}
          setScreenMedia={setScreenMedia}
          formations={formations}
          setFormations={setFormations}
          dailyHabits={dailyHabits}
          setDailyHabits={setDailyHabits}
          mediaProgressLogs={mediaProgressLogs}
          setMediaProgressLogs={setMediaProgressLogs}
          triggerToast={triggerToast}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Books Section Progress */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-neutral-700" />
              <span>Livres En cours de Lecture</span>
            </h3>
            <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full font-mono font-bold">
              {books.filter(b => b.status === "En cours").length} Actifs
            </span>
          </div>

          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {books.filter(b => b.status === "En cours").slice(0, 3).map((book) => {
              const progressPct = book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0;
              return (
                <div key={book.id} className="p-4 bg-neutral-50 border border-neutral-200/50 rounded-2xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-black text-neutral-900 block">{book.title}</span>
                      <span className="text-[10px] text-neutral-400 font-medium block">Par {book.author}</span>
                    </div>
                    <span className="text-[9px] bg-neutral-900 text-white border border-neutral-800 px-2 py-0.5 rounded font-mono font-bold">
                      {progressPct}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-neutral-500 font-mono">
                      <span>Pages : {book.currentPage}/{book.totalPages}</span>
                    </div>
                    <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-neutral-950 h-full rounded-full" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => onNavigate("books")}
            className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer text-center"
          >
            Ouvrir ma bibliothèque de livres
          </button>
        </div>

        {/* Screen Media File */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
                <BookOpenCheck className="w-4 h-4 text-neutral-700" />
                <span>File d'Écrans & Multimédia</span>
              </h3>
              <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full font-mono font-bold">
                {screenMedia.filter(s => s.status === "En cours").length} Actifs
              </span>
            </div>

            <div className="space-y-2.5">
              {screenMedia.filter(s => s.status === "En cours").slice(0, 3).map((media) => (
                <div key={media.id} className="p-3 bg-neutral-50 border border-neutral-200/50 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-neutral-850 block">{media.title}</span>
                    <span className="text-[9px] text-neutral-400 font-semibold uppercase">{media.type} • {media.platform}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold bg-white border border-neutral-200/85 text-neutral-800 px-2 py-0.5 rounded-lg font-mono">
                      Ep : {media.currentEpisode || 0} / {media.totalEpisodes || "--"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigate("screenmedia")}
            className="w-full py-2.5 mt-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-750 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Gérer mes films, animes & séries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
