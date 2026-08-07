import React, { useState, useMemo } from "react";
import { FinanceTransaction, Abonnement, FinanceSalaire } from "../types";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  ChevronDown,
  Scale,
  Percent
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

interface MonthlyComparisonCardProps {
  transactions: FinanceTransaction[];
  abonnements?: Abonnement[];
  salaires?: FinanceSalaire[];
}

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl shadow-lg font-sans">
        <p className="text-xs font-black text-neutral-900 dark:text-neutral-50 uppercase tracking-wider mb-2">{label}</p>
        {payload.map((item: any, idx: number) => (
          <div key={idx} className="flex items-center justify-between gap-4 mt-1">
            <span className="text-[10px] font-bold text-neutral-500" style={{ color: item.color }}>
              {item.name} :
            </span>
            <span className="text-xs font-black font-mono text-neutral-900 dark:text-neutral-100">
              {item.value.toLocaleString("fr-FR")} MAD
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function MonthlyComparisonCard({
  transactions = [],
  abonnements = [],
  salaires = []
}: MonthlyComparisonCardProps) {
  // Find all unique months available in transactions & salaires
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    const now = new Date();
    const currentM = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    monthsSet.add(currentM);

    transactions.forEach(t => {
      if (t.date && t.date.length >= 7) {
        monthsSet.add(t.date.substring(0, 7));
      }
    });

    salaires.forEach(s => {
      if (s.date && s.date.length >= 7) {
        monthsSet.add(s.date.substring(0, 7));
      }
    });

    return Array.from(monthsSet).sort().reverse();
  }, [transactions, salaires]);

  // Selected month state
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    return availableMonths[0] || "2026-07";
  });

  // Calculate stats for a given month helper
  const getMonthStats = (monthStr: string) => {
    let totalRevenue = 0;
    let totalExpense = 0;

    // A) Salaires for this month
    const monthSalaires = salaires.filter(s => s.date && s.date.startsWith(monthStr));
    if (monthSalaires.length > 0) {
      totalRevenue += monthSalaires.reduce((acc, s) => acc + (s.netAmount || 0), 0);
    } else if (salaires.length > 0 && monthStr === availableMonths[0]) {
      // Fallback: if salaires exist without date matching, count for active current month
      totalRevenue += salaires.reduce((acc, s) => acc + (s.netAmount || 0), 0);
    }

    // B) Transactions for this month
    const monthTransactions = transactions.filter(t => t.date && t.date.startsWith(monthStr));

    monthTransactions.forEach(t => {
      const amt = t.amount || 0;
      if (t.type === "Revenue") {
        totalRevenue += amt;
      } else if (t.type === "Dépense") {
        totalExpense += amt;
      }
    });

    // C) Active Subscriptions (abonnements)
    const activeSubCost = abonnements
      .filter(a => a.status === "Actif")
      .reduce((sum, a) => sum + (a.billingPeriod === "Mensuel" ? a.costMonthly : a.costMonthly / 12), 0);

    // Only add subscription costs if there are actual transactions/salaries in this month,
    // OR if it is the current selected top month.
    // This prevents empty unpopulated past months from artificially echoing current month expenses.
    if (activeSubCost > 0) {
      if (monthTransactions.length > 0 || monthSalaires.length > 0 || monthStr === availableMonths[0]) {
        totalExpense += activeSubCost;
      }
    }

    const netSavings = totalRevenue - totalExpense;
    return { totalRevenue, totalExpense, netSavings };
  };

  // Find index of selected month to find the previous one chronologically
  const comparisonData = useMemo(() => {
    const currentStats = getMonthStats(selectedMonth);

    const currentIndex = availableMonths.indexOf(selectedMonth);
    const prevMonth = currentIndex + 1 < availableMonths.length ? availableMonths[currentIndex + 1] : null;

    let prevStats = { totalRevenue: 0, totalExpense: 0, netSavings: 0 };
    if (prevMonth) {
      prevStats = getMonthStats(prevMonth);
    } else {
      // If there is no previous month in available list, estimate one based on baseline or minus 1 month logic
      const [year, month] = selectedMonth.split("-");
      let prevM = parseInt(month) - 1;
      let prevY = parseInt(year);
      if (prevM === 0) {
        prevM = 12;
        prevY -= 1;
      }
      const prevMonthStr = `${prevY}-${prevM.toString().padStart(2, "0")}`;
      prevStats = getMonthStats(prevMonthStr);
    }

    // Calculations of Deltas & Percentages
    const calcDeltaAndPct = (curr: number, prev: number) => {
      const delta = curr - prev;
      let percentage = 0;
      if (prev !== 0) {
        percentage = (delta / Math.abs(prev)) * 100;
      } else if (curr !== 0) {
        percentage = 100;
      }
      return { delta, percentage };
    };

    const revDelta = calcDeltaAndPct(currentStats.totalRevenue, prevStats.totalRevenue);
    const expDelta = calcDeltaAndPct(currentStats.totalExpense, prevStats.totalExpense);
    const netDelta = calcDeltaAndPct(currentStats.netSavings, prevStats.netSavings);

    // Prepare chart data
    const chartData = [
      {
        name: "Revenus",
        "Mois Précédent": prevStats.totalRevenue,
        "Mois Actuel": currentStats.totalRevenue
      },
      {
        name: "Dépenses",
        "Mois Précédent": prevStats.totalExpense,
        "Mois Actuel": currentStats.totalExpense
      },
      {
        name: "Solde Net",
        "Mois Précédent": prevStats.netSavings,
        "Mois Actuel": currentStats.netSavings
      }
    ];

    return {
      currentStats,
      prevStats,
      prevMonthLabel: prevMonth,
      revDelta,
      expDelta,
      netDelta,
      chartData
    };
  }, [selectedMonth, transactions, abonnements, availableMonths]);

  // Format month to display (e.g., "Juillet 2026")
  const formatMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const label = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  const getPercentageColor = (pct: number, type: "revenue" | "expense" | "savings") => {
    if (pct === 0) return "text-neutral-400 bg-neutral-100 dark:bg-zinc-800";
    if (type === "revenue" || type === "savings") {
      return pct > 0 
        ? "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400" 
        : "text-rose-600 bg-rose-500/10 dark:text-rose-400";
    } else {
      // For expenses, higher expense is usually bad (red), lower is good (emerald)
      return pct > 0 
        ? "text-rose-600 bg-rose-500/10 dark:text-rose-400" 
        : "text-emerald-600 bg-emerald-500/10 dark:text-emerald-400";
    }
  };

  const getDeltaLabel = (delta: number, type: "revenue" | "expense" | "savings") => {
    const sign = delta >= 0 ? "+" : "";
    const formatted = `${sign}${Math.round(delta).toLocaleString("fr-FR")} MAD`;
    return formatted;
  };

  return (
    <div id="monthly-progress-comparison-analysis" className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 shadow-2xs hover:shadow-sm transition-all duration-300 space-y-6">
      
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-neutral-900 text-white dark:bg-zinc-800 dark:text-neutral-50 rounded-2xl shrink-0">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-50 uppercase tracking-wider font-display">
              Historique Mensuel & Progression
            </h3>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">
              Comparaison de performance avec le mois précédent
            </p>
          </div>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-neutral-400" />
          <div className="relative">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 px-3.5 py-1.5 pr-8 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer focus:outline-none transition-all"
            >
              {availableMonths.map(m => (
                <option key={m} value={m}>
                  {formatMonthLabel(m)}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* THREE COMPARISON METRIC BLOCKS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* REVENUE COMPARISON */}
        <div className="bg-neutral-50/50 dark:bg-zinc-950/40 border border-neutral-200/50 dark:border-neutral-800 rounded-2xl p-4 space-y-3">
          <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">Revenus Comparés</span>
          
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-neutral-400">Ce mois</span>
              <span className="text-sm font-bold font-mono text-neutral-800 dark:text-neutral-100">
                {Math.round(comparisonData.currentStats.totalRevenue).toLocaleString("fr-FR")} MAD
              </span>
            </div>
            <div className="flex items-baseline justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
              <span>Mois préc.</span>
              <span className="font-mono">
                {Math.round(comparisonData.prevStats.totalRevenue).toLocaleString("fr-FR")} MAD
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Évolution</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono ${getPercentageColor(comparisonData.revDelta.percentage, "revenue")}`}>
              {comparisonData.revDelta.percentage > 0 ? (
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
              )}
              {comparisonData.revDelta.percentage.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* EXPENSE COMPARISON */}
        <div className="bg-neutral-50/50 dark:bg-zinc-950/40 border border-neutral-200/50 dark:border-neutral-800 rounded-2xl p-4 space-y-3">
          <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">Dépenses Comparées</span>
          
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-neutral-400">Ce mois</span>
              <span className="text-sm font-bold font-mono text-neutral-800 dark:text-neutral-100">
                {Math.round(comparisonData.currentStats.totalExpense).toLocaleString("fr-FR")} MAD
              </span>
            </div>
            <div className="flex items-baseline justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
              <span>Mois préc.</span>
              <span className="font-mono">
                {Math.round(comparisonData.prevStats.totalExpense).toLocaleString("fr-FR")} MAD
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Évolution</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono ${getPercentageColor(comparisonData.expDelta.percentage, "expense")}`}>
              {comparisonData.expDelta.percentage > 0 ? (
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
              )}
              {comparisonData.expDelta.percentage.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* NET SAVINGS COMPARISON */}
        <div className="bg-neutral-50/50 dark:bg-zinc-950/40 border border-neutral-200/50 dark:border-neutral-800 rounded-2xl p-4 space-y-3">
          <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">Solde Net Comparé</span>
          
          <div className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-neutral-400">Ce mois</span>
              <span className={`text-sm font-black font-mono ${comparisonData.currentStats.netSavings >= 0 ? "text-neutral-800 dark:text-neutral-100" : "text-rose-500"}`}>
                {Math.round(comparisonData.currentStats.netSavings).toLocaleString("fr-FR")} MAD
              </span>
            </div>
            <div className="flex items-baseline justify-between text-[11px] text-neutral-400 dark:text-neutral-500">
              <span>Mois préc.</span>
              <span className="font-mono">
                {Math.round(comparisonData.prevStats.netSavings).toLocaleString("fr-FR")} MAD
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
            <span className="text-[10px] text-neutral-400 font-bold uppercase">Évolution</span>
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono ${getPercentageColor(comparisonData.netDelta.percentage, "savings")}`}>
              {comparisonData.netDelta.percentage > 0 ? (
                <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
              ) : (
                <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
              )}
              {comparisonData.netDelta.percentage.toFixed(1)}%
            </span>
          </div>
        </div>

      </div>

      {/* DUAL BAR COMPARISON CHART */}
      <div className="bg-neutral-50/30 dark:bg-zinc-950/20 border border-neutral-200/40 dark:border-neutral-800/40 rounded-2xl p-4 space-y-3">
        <div className="text-center">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
            Visualisation Comparative de l'Évolution Financière (MAD)
          </span>
        </div>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData.chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" className="opacity-40 dark:opacity-10" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#888888', fontSize: 10, fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                tick={{ fill: '#888888', fontSize: 9, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(val) => `${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
              />
              <Tooltip content={<CustomChartTooltip />} />
              <Legend 
                verticalAlign="bottom" 
                height={32}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}
              />
              <Bar 
                dataKey="Mois Précédent" 
                fill="#a3a3a3" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={24}
              />
              <Bar 
                dataKey="Mois Actuel" 
                fill="#171717" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CONCRETE TEXT INSIGHT */}
      <div className="bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-200/50 dark:border-neutral-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-400 rounded-xl">
            <Percent className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block">
              Synthèse de Progression Globale
            </span>
            <p className="text-xs text-neutral-700 dark:text-neutral-300 font-semibold mt-0.5">
              Le solde net a progressé de <strong className="text-neutral-900 dark:text-white font-bold">{getDeltaLabel(comparisonData.netDelta.delta, "savings")}</strong> par rapport au mois de {comparisonData.prevMonthLabel ? formatMonthLabel(comparisonData.prevMonthLabel) : "précédent"}.
            </p>
          </div>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[9px] text-neutral-400 uppercase tracking-widest block font-bold">Variation Solde Net</span>
          <span className={`text-sm font-black font-mono ${comparisonData.netDelta.delta >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            {comparisonData.netDelta.percentage >= 0 ? "+" : ""}{comparisonData.netDelta.percentage.toFixed(1)}%
          </span>
        </div>
      </div>

    </div>
  );
}
