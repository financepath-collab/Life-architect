import React, { useState } from "react";
import { 
  FinanceTransaction, 
  FinanceBudget, 
  StockEntry, 
  FinanceEpargne, 
  Abonnement,
  FinanceSalaire
} from "../types";
import CategoryDetailModal from "./CategoryDetailModal";
import SubscriptionScatterChartCard from "./SubscriptionScatterChartCard";
import { 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  Wallet, 
  PieChart as PieIcon, 
  CheckCircle2, 
  AlertCircle,
  BarChart3,
  Utensils,
  Laptop,
  Cloud,
  Megaphone,
  Car,
  Sparkles,
  Tag,
  AlertTriangle,
  Gauge,
  Calendar
} from "lucide-react";

function getCategoryIcon(catName: string) {
  const name = (catName || "").toLowerCase();
  if (name.includes("aliment") || name.includes("nourriture") || name.includes("resto")) return Utensils;
  if (name.includes("équip") || name.includes("matériel") || name.includes("tech")) return Laptop;
  if (name.includes("logiciel") || name.includes("saas") || name.includes("cloud")) return Cloud;
  if (name.includes("market") || name.includes("pub") || name.includes("promo")) return Megaphone;
  if (name.includes("transport") || name.includes("carburant") || name.includes("auto")) return Car;
  if (name.includes("loisir") || name.includes("sortie") || name.includes("divertiss")) return Sparkles;
  return Tag;
}
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";

const CATEGORY_COLORS = [
  "#171717", // Charcoal / Carbon
  "#404040", // Medium Slate
  "#737373", // Neutral Gray
  "#a3a3a3", // Soft Gray
  "#0f766e", // Teal / Deep Emerald
  "#d97706", // Amber / Saffron
  "#2563eb", // Royal Indigo Blue
  "#4f46e5", // Indigo
  "#c026d3", // Fuchsia
  "#ea580c", // Morocco Orange
  "#e11d48", // Crimson Rose
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const rev = payload.find((p: any) => p.name === "Revenus")?.value || 0;
    const dep = payload.find((p: any) => p.name === "Dépenses")?.value || 0;
    const net = payload.find((p: any) => p.name === "Épargne Nette")?.value ?? (rev - dep);
    const rate = rev > 0 ? Math.round((net / rev) * 100) : 0;
    
    return (
      <div className="bg-white border border-neutral-200/90 p-4 rounded-xl shadow-lg space-y-2.5 min-w-[220px] font-sans">
        <p className="text-xs font-black text-neutral-900 border-b border-neutral-100 pb-1.5 uppercase tracking-wider">{label}</p>
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-xs gap-4">
            <span className="text-neutral-500 font-semibold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-700" />
              Revenus :
            </span>
            <span className="font-bold font-mono text-neutral-800">+{rev.toLocaleString("fr-FR")} MAD</span>
          </div>
          <div className="flex justify-between items-center text-xs gap-4">
            <span className="text-neutral-500 font-semibold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-400" />
              Dépenses :
            </span>
            <span className="font-bold font-mono text-neutral-500">-{dep.toLocaleString("fr-FR")} MAD</span>
          </div>
          <div className="border-t border-dashed border-neutral-200/60 pt-1.5 mt-1.5 flex justify-between items-center text-xs gap-4">
            <span className="text-neutral-800 font-black flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-neutral-900" />
              Épargne Nette :
            </span>
            <span className="font-bold font-mono text-neutral-900">
              {net >= 0 ? "+" : ""}{net.toLocaleString("fr-FR")} MAD
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] gap-4">
            <span className="text-neutral-400 font-semibold">Taux d'Épargne :</span>
            <span className="font-bold font-mono px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700">
              {rate}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

interface FinanceChartsProps {
  transactions: FinanceTransaction[];
  budgets: FinanceBudget[];
  stocks: StockEntry[];
  epargnes: FinanceEpargne[];
  abonnements: Abonnement[];
  salaires?: FinanceSalaire[];
}

export default function FinanceCharts({
  transactions = [],
  budgets = [],
  stocks = [],
  epargnes = [],
  abonnements = [],
  salaires = []
}: FinanceChartsProps) {
  // 0. Find the latest year and month among transactions to align the 6-month chart timeline perfectly
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

  // Build high-fidelity monthly comparison data for the bar chart
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
      const savingsRate = finalIncome > 0 ? (netSavings / finalIncome) * 100 : 0;

      return {
        name: label.charAt(0).toUpperCase() + label.slice(1),
        Revenus: finalIncome,
        Dépenses: finalExpenses,
        "Épargne Nette": netSavings,
        "Taux d'Épargne (%)": Math.round(savingsRate),
      };
    });
  }, [last6Months, transactions]);

  // 1. Calculate general numbers
  const totalInflow = transactions
    .filter(t => t.type === "Revenue")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = transactions
    .filter(t => t.type === "Dépense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalInflow - totalOutflow;

  const stockPortfolioCost = stocks.reduce((acc, s) => acc + s.buyPrice * s.quantity, 0);
  const stockPortfolioValue = stocks.reduce((acc, s) => acc + s.currentPrice * s.quantity, 0);
  const stockProfitLoss = stockPortfolioValue - stockPortfolioCost;

  const totalMonthlyAbonnements = abonnements
    .filter(a => a.status === "Actif")
    .reduce((sum, a) => {
      return sum + (a.billingPeriod === "Mensuel" ? a.costMonthly : a.costMonthly / 12);
    }, 0);

  // Selected period state for the pie chart ("all", "month:2026-07", "quarter:2026-Q3", etc.)
  const [selectedPiePeriod, setSelectedPiePeriod] = useState<string>("all");

  const availablePieMonths = React.useMemo(() => {
    const monthsSet = new Set<string>();
    monthsSet.add("2026-07");
    monthsSet.add("2026-06");
    monthsSet.add("2026-05");
    monthsSet.add("2026-04");
    transactions.forEach(t => {
      if (t.date && t.date.length >= 7) {
        monthsSet.add(t.date.substring(0, 7));
      }
    });
    return Array.from(monthsSet).sort().reverse();
  }, [transactions]);

  const availablePieQuarters = React.useMemo(() => {
    const qSet = new Set<string>();
    qSet.add("2026-Q3");
    qSet.add("2026-Q2");
    qSet.add("2026-Q1");
    transactions.forEach(t => {
      if (t.date && t.date.length >= 7) {
        const year = t.date.substring(0, 4);
        const m = parseInt(t.date.substring(5, 7), 10);
        let q = 1;
        if (m >= 4 && m <= 6) q = 2;
        else if (m >= 7 && m <= 9) q = 3;
        else if (m >= 10 && m <= 12) q = 4;
        qSet.add(`${year}-Q${q}`);
      }
    });
    return Array.from(qSet).sort().reverse();
  }, [transactions]);

  const matchesPiePeriod = React.useCallback((dateStr: string | undefined, periodKey: string) => {
    if (!dateStr || dateStr.length < 7) return false;
    if (periodKey === "all") return true;
    if (periodKey.startsWith("month:")) {
      const m = periodKey.replace("month:", "");
      return dateStr.startsWith(m);
    }
    if (periodKey.startsWith("quarter:")) {
      const [year, qStr] = periodKey.replace("quarter:", "").split("-Q");
      const q = parseInt(qStr, 10);
      const dateYear = dateStr.substring(0, 4);
      const dateMonth = parseInt(dateStr.substring(5, 7), 10);
      if (dateYear !== year) return false;
      if (q === 1) return dateMonth >= 1 && dateMonth <= 3;
      if (q === 2) return dateMonth >= 4 && dateMonth <= 6;
      if (q === 3) return dateMonth >= 7 && dateMonth <= 9;
      if (q === 4) return dateMonth >= 10 && dateMonth <= 12;
    }
    return dateStr.startsWith(periodKey);
  }, []);

  const formatPieMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const label = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  const formatPieQuarterLabel = (qKey: string) => {
    const [year, qStr] = qKey.split("-Q");
    const q = parseInt(qStr, 10);
    const qMap: { [key: number]: string } = {
      1: "T1 (Jan - Mars)",
      2: "T2 (Avr - Juin)",
      3: "T3 (Juil - Sept)",
      4: "T4 (Oct - Déc)"
    };
    return `${qMap[q] || `Trimestre ${q}`} ${year}`;
  };

  // 2. Build Category Aggregations for expenditures
  const expensesByCategory = React.useMemo(() => {
    const map: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === "Dépense" && matchesPiePeriod(t.date, selectedPiePeriod))
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [transactions, selectedPiePeriod, matchesPiePeriod]);

  const pieChartData = React.useMemo(() => {
    return expensesByCategory.map(([category, amount]) => ({
      name: category,
      value: amount,
    }));
  }, [expensesByCategory]);

  const maxExpenseCategoryAmount = expensesByCategory[0]?.[1] || 1;

  // 3. Build monthly budgets overview
  const [budgetCategoryFilter, setBudgetCategoryFilter] = useState<"all" | "warning">("all");
  const [pieMode, setPieMode] = useState<"pie" | "donut">("pie");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [modalCategory, setModalCategory] = useState<string | null>(null);

  const currentMonthKey = React.useMemo(() => {
    return `${referenceDate.getFullYear()}-${String(referenceDate.getMonth() + 1).padStart(2, "0")}`;
  }, [referenceDate]);

  const categoryActualSpentMap = React.useMemo(() => {
    const map: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === "Dépense" && t.date && t.date.startsWith(currentMonthKey))
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return map;
  }, [transactions, currentMonthKey]);

  const processedBudgets = React.useMemo(() => {
    return budgets.map(b => {
      const actualSpent = (categoryActualSpentMap[b.category] !== undefined && categoryActualSpentMap[b.category] > 0)
        ? categoryActualSpentMap[b.category]
        : b.spentAmount;
      const limit = b.limitAmount || 1;
      const rate = Math.round((actualSpent / limit) * 100);
      const remaining = limit - actualSpent;
      const thresholdPct = b.alertThresholdPct || 80;
      const isOver = actualSpent > limit;
      const isWarning = rate >= thresholdPct && !isOver;
      return {
        ...b,
        actualSpent,
        rate,
        remaining,
        thresholdPct,
        isOver,
        isWarning
      };
    });
  }, [budgets, categoryActualSpentMap]);

  const totalBudgetLimit = processedBudgets.reduce((sum, b) => sum + b.limitAmount, 0);
  const totalBudgetSpent = processedBudgets.reduce((sum, b) => sum + b.actualSpent, 0);
  const budgetUtilizationRate = totalBudgetLimit > 0 ? (totalBudgetSpent / totalBudgetLimit) * 100 : 0;

  const filteredBudgets = React.useMemo(() => {
    if (budgetCategoryFilter === "warning") {
      return processedBudgets.filter(b => b.isWarning || b.isOver);
    }
    return processedBudgets;
  }, [processedBudgets, budgetCategoryFilter]);

  return (
    <div className="space-y-6">
      
      {/* 4 Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenues */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Entrées</span>
            <h4 className="text-xl font-bold font-mono text-neutral-900">
              +{totalInflow.toLocaleString("fr-FR")} MAD
            </h4>
            <span className="text-[10px] text-neutral-400 font-medium">Revenus et virements reçus</span>
          </div>
          <div className="p-3 bg-neutral-100 rounded-xl text-neutral-700 border border-neutral-200">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Dépenses</span>
            <h4 className="text-xl font-bold font-mono text-neutral-700">
              -{totalOutflow.toLocaleString("fr-FR")} MAD
            </h4>
            <span className="text-[10px] text-neutral-400 font-medium">Dépenses réelles comptabilisées</span>
          </div>
          <div className="p-3 bg-neutral-100 rounded-xl text-neutral-700 border border-neutral-200">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        {/* Net Savings Cash Flow */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Trésorerie Nette</span>
            <h4 className="text-xl font-bold font-mono text-neutral-900">
              {netSavings >= 0 ? "+" : ""}{netSavings.toLocaleString("fr-FR")} MAD
            </h4>
            <span className="text-[10px] text-neutral-400 font-medium">Flux net disponible de la période</span>
          </div>
          <div className="p-3 bg-neutral-100 rounded-xl text-neutral-900 border border-neutral-200">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        {/* Portfolio Valuation */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Portefeuille Actions</span>
            <h4 className="text-xl font-bold font-mono text-neutral-900">
              {stockPortfolioValue.toLocaleString("fr-FR")} MAD
            </h4>
            <span className="text-[10px] font-semibold text-neutral-500">
              {stockProfitLoss >= 0 ? "▲" : "▼"} {stockProfitLoss >= 0 ? "+" : ""}{stockProfitLoss.toLocaleString("fr-FR")} MAD
            </span>
          </div>
          <div className="p-3 bg-neutral-100 rounded-xl text-neutral-900 border border-neutral-200">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* NEW SECTION: COMPARATIVE MONTHLY INCOME VS EXPENSES (LAST 6 MONTHS) */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-neutral-100 pb-4 border-dashed">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-neutral-900 flex items-center gap-2 font-display uppercase tracking-wider">
              <BarChart3 className="w-4.5 h-4.5 text-neutral-900" />
              <span>Revenus vs Dépenses (6 Derniers Mois)</span>
            </h3>
            <p className="text-xs text-neutral-400 font-medium">
              Comparatif mensuel du flux de trésorerie et progression de votre épargne nette.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 bg-neutral-50 border border-neutral-200/50 px-3.5 py-1.5 rounded-xl text-[10px] font-bold text-neutral-600 self-start md:self-auto uppercase tracking-wide">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-neutral-700" />
              <span>Entrées</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-neutral-400" />
              <span>Dépenses</span>
            </div>
            <div className="flex items-center gap-1.5 border-l border-neutral-200 pl-3">
              <span className="w-3 h-0.5 bg-neutral-900 relative flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-900 absolute" />
              </span>
              <span>Épargne Nette</span>
            </div>
          </div>
        </div>

        {/* Recharts Container */}
        <div className="w-full h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={monthlyChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#737373', fontSize: 10, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#737373', fontSize: 10, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245, 245, 245, 0.4)' }} />
              <Bar 
                name="Revenus"
                dataKey="Revenus" 
                fill="#404040" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={32}
              />
              <Bar 
                name="Dépenses"
                dataKey="Dépenses" 
                fill="#a3a3a3" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={32}
              />
              <Line 
                name="Épargne Nette"
                type="monotone" 
                dataKey="Épargne Nette" 
                stroke="#171717" 
                strokeWidth={2.5}
                dot={{ r: 4, fill: '#171717', strokeWidth: 1 }}
                activeDot={{ r: 6 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* High-fidelity summary stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
          <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-4 space-y-1">
            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Entrées Moyennes</span>
            <div className="text-base font-black text-neutral-900 font-mono">
              {Math.round(
                monthlyChartData.reduce((acc, curr) => acc + curr.Revenus, 0) / monthlyChartData.length
              ).toLocaleString("fr-FR")} MAD
            </div>
            <span className="text-[10px] text-neutral-400 block">Moyenne mensuelle sur 6 mois</span>
          </div>

          <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-4 space-y-1">
            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Dépenses Moyennes</span>
            <div className="text-base font-black text-neutral-900 font-mono">
              {Math.round(
                monthlyChartData.reduce((acc, curr) => acc + curr.Dépenses, 0) / monthlyChartData.length
              ).toLocaleString("fr-FR")} MAD
            </div>
            <span className="text-[10px] text-neutral-400 block">Moyenne mensuelle sur 6 mois</span>
          </div>

          <div className="bg-neutral-50 border border-neutral-200/80 rounded-xl p-4 space-y-1">
            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-wider block">Épargne Cumulée Estimée</span>
            <div className="text-base font-black text-neutral-900 font-mono">
              {monthlyChartData.reduce((acc, curr) => acc + curr["Épargne Nette"], 0).toLocaleString("fr-FR")} MAD
            </div>
            <span className="text-[10px] text-neutral-400 block">Surplus de capital sur la période</span>
          </div>
        </div>
      </div>

      {/* NEW SECTION: ÉVOLUTION ÉPARGNE NETTE */}
      <div className="bg-white border border-neutral-200/90 rounded-2xl p-6 shadow-xs space-y-5 animate-in fade-in duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-neutral-100 pb-4 border-dashed">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-neutral-900 flex items-center gap-2 font-display uppercase tracking-wider">
              <BarChart3 className="w-4.5 h-4.5 text-neutral-900" />
              <span>Évolution Épargne Nette</span>
            </h3>
            <p className="text-xs text-neutral-400 font-medium">
              Comparaison de vos revenus mensuels totaux et de vos dépenses mensuelles totales sur les 6 derniers mois.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4 bg-neutral-50 border border-neutral-200/50 px-3.5 py-1.5 rounded-xl text-[10px] font-bold text-neutral-600 self-start md:self-auto uppercase tracking-wide">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-neutral-700" />
              <span>Revenus Totaux</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-neutral-400" />
              <span>Dépenses Totales</span>
            </div>
          </div>
        </div>

        {/* Recharts Bar Chart Container */}
        <div className="w-full h-80 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={monthlyChartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#737373', fontSize: 10, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#737373', fontSize: 10, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const rev = payload.find((p: any) => p.name === "Revenus")?.value || 0;
                    const dep = payload.find((p: any) => p.name === "Dépenses")?.value || 0;
                    const net = rev - dep;
                    const rate = rev > 0 ? Math.round((net / rev) * 100) : 0;
                    return (
                      <div className="bg-white border border-neutral-200/90 p-4 rounded-xl shadow-lg space-y-2.5 min-w-[200px] font-sans">
                        <p className="text-xs font-black text-neutral-900 border-b border-neutral-100 pb-1.5 uppercase tracking-wider">{label}</p>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-500 font-semibold flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-xs bg-neutral-700" />
                              Revenus :
                            </span>
                            <span className="font-mono font-bold text-neutral-900">{rev.toLocaleString("fr-FR")} MAD</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-neutral-500 font-semibold flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-xs bg-neutral-400" />
                              Dépenses :
                            </span>
                            <span className="font-mono font-bold text-neutral-900">{dep.toLocaleString("fr-FR")} MAD</span>
                          </div>
                          <div className="border-t border-dashed border-neutral-100 pt-1.5 mt-1.5 flex justify-between items-center">
                            <span className="text-neutral-600 font-bold">Épargne Nette :</span>
                            <span className="font-mono font-black text-neutral-900">
                              {net >= 0 ? "+" : ""}{net.toLocaleString("fr-FR")} MAD
                            </span>
                          </div>
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-neutral-400 font-medium">Taux d'Épargne :</span>
                            <span className="font-mono font-bold text-neutral-600">
                              {rate}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }} 
                cursor={{ fill: 'rgba(245, 245, 245, 0.4)' }} 
              />
              <Bar 
                name="Revenus"
                dataKey="Revenus" 
                fill="#404040" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={28}
              />
              <Bar 
                name="Dépenses"
                dataKey="Dépenses" 
                fill="#a3a3a3" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={28}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* High-fidelity summary stats detailing the evolution */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-1">
          {monthlyChartData.map((m, idx) => {
            const net = m.Revenus - m.Dépenses;
            return (
              <div key={idx} className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-3 space-y-1 text-center shadow-3xs">
                <span className="text-[10px] font-bold text-neutral-500 block uppercase tracking-wider">{m.name}</span>
                <div className="text-xs font-black font-mono text-neutral-800">
                  {net >= 0 ? "+" : ""}{net.toLocaleString("fr-FR")} MAD
                </div>
                <span className="text-[8px] text-neutral-400 block">Épargne Nette</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid of charts and metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left column: Budget and Savings goals */}
        <div className="space-y-6">
          {/* Global Budget Health */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-neutral-800" />
                <span>Utilisation des Budgets Mensuels</span>
              </h3>
              <span className={`text-xs font-semibold font-mono px-2.5 py-0.5 rounded-full border ${
                budgetUtilizationRate > 85 
                  ? "bg-rose-50 border-rose-100 text-rose-700" 
                  : "bg-emerald-50 border-emerald-100 text-emerald-700"
              }`}>
                {budgetUtilizationRate.toFixed(1)}% Consommé
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    budgetUtilizationRate > 85 ? "bg-rose-600" : "bg-neutral-900"
                  }`}
                  style={{ width: `${Math.min(100, budgetUtilizationRate)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <span className="text-neutral-400 text-[9px] block font-sans font-bold">TOTAL ALLOUÉ</span>
                  <span className="text-neutral-800 font-bold">{totalBudgetLimit.toLocaleString("fr-FR")} MAD</span>
                </div>
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <span className="text-neutral-400 text-[9px] block font-sans font-bold">TOTAL DÉPENSÉ</span>
                  <span className="text-neutral-800 font-bold">{totalBudgetSpent.toLocaleString("fr-FR")} MAD</span>
                </div>
              </div>

              {/* Individual budget breakdown */}
              <div className="space-y-3.5 pt-2 border-t border-dashed border-neutral-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                    Suivi des Plafonds Budgétaires
                  </span>
                  
                  {/* Filter Pills */}
                  <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setBudgetCategoryFilter("all")}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all ${
                        budgetCategoryFilter === "all"
                          ? "bg-white text-neutral-900 shadow-3xs"
                          : "text-neutral-500 hover:text-neutral-900"
                      }`}
                    >
                      Tous ({processedBudgets.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setBudgetCategoryFilter("warning")}
                      className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1 ${
                        budgetCategoryFilter === "warning"
                          ? "bg-amber-500 text-white shadow-3xs"
                          : "text-amber-700 hover:text-amber-900"
                      }`}
                    >
                      <AlertTriangle className="w-3 h-3" />
                      Alertes ({processedBudgets.filter(b => b.isWarning || b.isOver).length})
                    </button>
                  </div>
                </div>

                {filteredBudgets.length === 0 ? (
                  <div className="text-center py-6 text-xs text-neutral-400 italic">
                    Aucune catégorie budgétaire ne nécessite d'attention particulière pour le moment.
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {filteredBudgets.map(b => {
                      const IconComp = getCategoryIcon(b.category);
                      
                      // Progress Bar Color Logic
                      let barColor = "bg-emerald-600";
                      let badgeBg = "bg-emerald-50 text-emerald-700 border-emerald-200";
                      let statusText = "Sous plafond";

                      if (b.isOver) {
                        barColor = "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.4)]";
                        badgeBg = "bg-rose-50 text-rose-700 border-rose-200";
                        statusText = "Plafond dépassé";
                      } else if (b.isWarning) {
                        barColor = "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.3)]";
                        badgeBg = "bg-amber-50 text-amber-700 border-amber-200";
                        statusText = `Seuil >${b.thresholdPct}%`;
                      }

                      return (
                        <div key={b.id} className="bg-neutral-50/70 border border-neutral-200/80 rounded-xl p-3 space-y-2 hover:border-neutral-300 transition-all">
                          {/* Top Row: Category Info & Amount */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="p-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-700 shrink-0">
                                <IconComp className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-neutral-900">{b.category}</span>
                                  <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full border ${badgeBg}`}>
                                    {statusText}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="text-right font-mono text-xs">
                              <div className="font-bold text-neutral-900">
                                {b.actualSpent.toLocaleString("fr-FR")}{" "}
                                <span className="text-neutral-400 font-normal">/ {b.limitAmount.toLocaleString("fr-FR")} MAD</span>
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar Container */}
                          <div className="space-y-1">
                            <div className="relative w-full bg-neutral-200/80 dark:bg-zinc-800 h-2.5 rounded-full overflow-hidden p-[1px]">
                              {/* 80% Threshold Indicator Line */}
                              <div 
                                className="absolute top-0 bottom-0 w-[2px] bg-neutral-400/60 z-10 pointer-events-none"
                                style={{ left: `${b.thresholdPct}%` }}
                                title={`Seuil d'alerte à ${b.thresholdPct}%`}
                              />
                              
                              {/* Animated Progress Bar Fill */}
                              <div 
                                className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`} 
                                style={{ width: `${Math.min(100, b.rate)}%` }}
                              />
                            </div>

                            {/* Sub-row: Remaining allowance & percentage */}
                            <div className="flex justify-between items-center text-[10px] text-neutral-500 font-mono pt-0.5">
                              <span className={b.isOver ? "text-rose-600 font-bold" : b.isWarning ? "text-amber-700 font-bold" : "text-neutral-500"}>
                                {b.isOver 
                                  ? `Excédent de +${Math.abs(b.remaining).toLocaleString("fr-FR")} MAD` 
                                  : `Reste ${b.remaining.toLocaleString("fr-FR")} MAD disponible`
                                }
                              </span>
                              <span className="font-bold text-neutral-800 bg-white border border-neutral-200 px-1.5 py-0.2 rounded">
                                {b.rate}% consommé
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Savings Goals performance */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs">
            {(() => {
              const ongoingGoals = epargnes.filter(e => e.status === "En cours" || e.status === undefined);
              const totalEpargneActuel = ongoingGoals.reduce((sum, e) => sum + (e.currentAmount || 0), 0);
              
              // Calculate total required monthly savings
              const now = new Date();
              const totalMonthlyReq = ongoingGoals.reduce((sum, goal) => {
                const remaining = Math.max(0, (goal.targetAmount || 0) - (goal.currentAmount || 0));
                if (remaining <= 0) return sum;
                let months = 12;
                if (goal.deadline) {
                  const dDate = new Date(goal.deadline);
                  if (!isNaN(dDate.getTime())) {
                    const daysDiff = Math.ceil((dDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    months = daysDiff <= 0 ? 0.5 : Math.max(0.5, daysDiff / 30.4375);
                  }
                }
                return sum + Math.round(remaining / months);
              }, 0);

              return (
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-2">
                  <h3 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-neutral-800" />
                    <span>Progression de l'Épargne & Objectifs</span>
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold text-indigo-900 bg-indigo-50 border border-indigo-200/80 px-2.5 py-1 rounded-lg">
                      Requise : {totalMonthlyReq.toLocaleString("fr-FR")} MAD/mois
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
                      Total Actuel : {totalEpargneActuel.toLocaleString("fr-FR")} MAD
                    </span>
                  </div>
                </div>
              );
            })()}

            <div className="space-y-3">
              {epargnes.map(goal => {
                const rate = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
                let monthlyReq = 0;
                if (remaining > 0 && goal.deadline) {
                  const dDate = new Date(goal.deadline);
                  if (!isNaN(dDate.getTime())) {
                    const daysDiff = Math.ceil((dDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                    const months = daysDiff <= 0 ? 0.5 : Math.max(0.5, daysDiff / 30.4375);
                    monthlyReq = Math.round(remaining / months);
                  }
                }

                return (
                  <div key={goal.id} className="bg-neutral-50/50 border border-neutral-200 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-neutral-800">{goal.name}</span>
                        <div className="flex items-center gap-2 text-[9px] text-neutral-400 font-mono">
                          <span>Échéance : {goal.deadline}</span>
                          {monthlyReq > 0 && (
                            <span className="text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100">
                              + {monthlyReq.toLocaleString("fr-FR")} MAD/mois
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-900 text-white">
                        {rate.toFixed(0)}%
                      </span>
                    </div>

                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-neutral-900 h-full rounded-full transition-all duration-700" 
                        style={{ width: `${Math.min(100, rate)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                      <span>Cumulé : {goal.currentAmount.toLocaleString("fr-FR")} MAD</span>
                      <span>Cible : {goal.targetAmount.toLocaleString("fr-FR")} MAD</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Expenditures breakdown & Monthly Subscriptions */}
        <div className="space-y-6">
          
          {/* Expenditures by Category Chart */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-rose-500" />
                <span>Dépenses par Catégorie</span>
              </h3>
              
              <div className="flex flex-wrap items-center gap-2">
                {/* Dropdown menu for filtering by Month or Quarter */}
                <div className="flex items-center gap-1.5 bg-neutral-50 border border-neutral-200/80 px-2.5 py-1 rounded-xl text-xs font-bold text-neutral-700 shadow-2xs">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                  <select
                    value={selectedPiePeriod}
                    onChange={(e) => setSelectedPiePeriod(e.target.value)}
                    className="bg-transparent border-none text-xs font-bold text-neutral-800 focus:outline-none cursor-pointer pr-1"
                  >
                    <option value="all">🌐 Tout le cumul (Global)</option>
                    <optgroup label="📅 Filtrer par Mois">
                      {availablePieMonths.map(m => (
                        <option key={m} value={`month:${m}`}>
                          Mois : {formatPieMonthLabel(m)}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="📊 Filtrer par Trimestre">
                      {availablePieQuarters.map(q => (
                        <option key={q} value={`quarter:${q}`}>
                          Trimestre : {formatPieQuarterLabel(q)}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                {/* Pie / Donut Toggle */}
                <div className="flex bg-neutral-100 p-1 rounded-xl text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setPieMode("pie")}
                    className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                      pieMode === "pie" ? "bg-white text-neutral-900 shadow-3xs" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    Circulaire
                  </button>
                  <button
                    type="button"
                    onClick={() => setPieMode("donut")}
                    className={`px-2 py-0.5 rounded-lg transition-all cursor-pointer ${
                      pieMode === "donut" ? "bg-white text-neutral-900 shadow-3xs" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    Anneau
                  </button>
                </div>
              </div>
            </div>

            {expensesByCategory.length === 0 ? (
              <div className="text-xs text-neutral-400 italic text-center py-12">
                Aucune dépense enregistrée pour afficher la répartition.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                
                {/* Left side: Circular Pie/Donut Chart */}
                <div className="md:col-span-5 relative flex items-center justify-center min-h-[220px]">
                  <ResponsiveContainer width="100%" height={220}>
                    <RechartsPieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={pieMode === "donut" ? 60 : 0}
                        outerRadius={88}
                        paddingAngle={pieMode === "donut" ? 2.5 : 1}
                        dataKey="value"
                        onClick={(entry) => {
                          setSelectedCategory(entry.name);
                          setModalCategory(entry.name);
                        }}
                        cursor="pointer"
                      >
                        {pieChartData.map((entry, index) => {
                          const isSelected = selectedCategory === entry.name;
                          return (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} 
                              stroke={isSelected ? "#ffffff" : "transparent"}
                              strokeWidth={isSelected ? 3 : 0}
                              style={{
                                filter: selectedCategory && !isSelected ? "opacity(0.4)" : "opacity(1)",
                                transition: "all 0.3s ease"
                              }}
                            />
                          );
                        })}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`${value.toLocaleString("fr-FR")} MAD`, "Dépenses"]}
                        contentStyle={{
                          backgroundColor: "#ffffff",
                          border: "1px solid #e5e5e5",
                          borderRadius: "12px",
                          fontSize: "11px",
                          fontWeight: "bold",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                        }}
                      />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                  
                  {/* Center Totals Label for Donut Mode */}
                  {pieMode === "donut" && (
                    <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">Total</span>
                      <span className="text-base font-black font-mono text-neutral-950 leading-none py-0.5">
                        {totalOutflow.toLocaleString("fr-FR")}
                      </span>
                      <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider">MAD</span>
                    </div>
                  )}
                </div>

                {/* Right side: Color-coded progress list */}
                <div className="md:col-span-7 space-y-3">
                  <div className="flex items-center justify-between pb-1">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                      Répartition par Poste
                    </span>
                    {selectedCategory && (
                      <button
                        type="button"
                        onClick={() => setSelectedCategory(null)}
                        className="text-[9px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded font-bold cursor-pointer transition-all"
                      >
                        Réinitialiser
                      </button>
                    )}
                  </div>
                  {expensesByCategory.map(([cat, amount], index) => {
                    const percentage = totalOutflow > 0 ? (amount / totalOutflow) * 100 : 0;
                    const ratio = (amount / maxExpenseCategoryAmount) * 100;
                    const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
                    const isSelected = selectedCategory === cat;
                    
                    return (
                      <div 
                        key={cat} 
                        onClick={() => {
                          setSelectedCategory(cat);
                          setModalCategory(cat);
                        }}
                        title="Cliquez pour afficher le détail des transactions"
                        className={`space-y-1 p-1 rounded-xl transition-all cursor-pointer border ${
                          isSelected ? "bg-indigo-50 border-indigo-200" : "border-transparent hover:bg-neutral-50"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-2.5 h-2.5 rounded-xs shrink-0 transition-colors" 
                              style={{ backgroundColor: color }}
                            />
                            <span className={`font-semibold ${isSelected ? "text-indigo-900 font-extrabold" : "text-neutral-700"}`}>{cat}</span>
                          </div>
                          <div className="font-mono text-right">
                            <span className="text-neutral-950 font-bold">
                              {amount.toLocaleString("fr-FR")} MAD
                            </span>
                            <span className="text-neutral-400 text-[10px] ml-1.5 font-bold">
                              ({percentage.toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                          <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ width: `${ratio}%`, backgroundColor: color }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}
          </div>

          {/* Subscriptions cost impact */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-neutral-800" />
                <span>Impact de vos Abonnements</span>
              </h3>
              <span className="text-xs font-mono text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-200 font-bold">
                {totalMonthlyAbonnements.toLocaleString("fr-FR")} MAD / mois
              </span>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              Vos abonnements actifs récurrents s'élèvent à un total mensuel estimé de <span className="text-neutral-800 font-semibold">{totalMonthlyAbonnements.toFixed(0)} MAD</span>, soit environ <span className="text-neutral-800 font-semibold">{(totalMonthlyAbonnements * 12).toLocaleString("fr-FR")} MAD par an</span>.
            </p>

            <div className="space-y-2">
              {abonnements.filter(a => a.status === "Actif").slice(0, 4).map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-neutral-800">{sub.serviceName}</span>
                    <span className="text-[9px] text-neutral-400 block">Prochain prélèvement : {sub.nextBillingDate}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-700">
                    {sub.costMonthly} MAD / {sub.billingPeriod === "Mensuel" ? "mois" : "an"}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* NEW SCATTER CHART: Abonnements vs Taux d'Épargne */}
        <SubscriptionScatterChartCard
          abonnements={abonnements}
          transactions={transactions}
          salaires={salaires}
        />

      </div>

      {/* DETAILED CATEGORY TRANSACTIONS MODAL */}
      <CategoryDetailModal
        isOpen={!!modalCategory}
        onClose={() => setModalCategory(null)}
        categoryName={modalCategory}
        periodKey={selectedPiePeriod}
        transactions={transactions}
        abonnements={abonnements}
      />

    </div>
  );
}
