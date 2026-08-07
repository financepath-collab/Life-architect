import React, { useState, useMemo } from "react";
import { FinanceTransaction, Abonnement } from "../types";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  ChevronDown, 
  ChevronUp, 
  Wallet,
  PieChart,
  BarChart3,
  List
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from "recharts";

const CHART_COLORS = [
  "#4f46e5", // Indigo
  "#0f766e", // Teal
  "#ea580c", // Saffron / Orange
  "#e11d48", // Rose / Crimson
  "#2563eb", // Royal Blue
  "#7c3aed", // Violet
  "#d97706", // Amber
  "#059669", // Emerald
  "#b91c1c", // Red
];

const CustomChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-neutral-900 dark:bg-zinc-950 border border-neutral-800 p-3 rounded-xl shadow-xl">
        <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Catégorie</p>
        <p className="text-xs font-bold text-white mt-0.5">{payload[0].payload.name}</p>
        <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mt-2">Dépenses</p>
        <p className="text-sm font-black font-mono text-indigo-400 mt-0.5">
          {payload[0].value.toLocaleString("fr-FR")} MAD
        </p>
      </div>
    );
  }
  return null;
};

interface MonthlyPerformanceCardProps {
  transactions: FinanceTransaction[];
  abonnements?: Abonnement[];
}

export default function MonthlyPerformanceCard({ transactions = [], abonnements = [] }: MonthlyPerformanceCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [breakdownView, setBreakdownView] = useState<"chart" | "list">("chart");
  
  // Find all unique months available in transactions
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

    return Array.from(monthsSet).sort().reverse();
  }, [transactions]);

  // Selected month state
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    return availableMonths[0] || "2026-07";
  });

  // Calculate stats for the selected month
  const stats = useMemo(() => {
    let totalRevenue = 0;
    let totalExpense = 0;
    const categoryBreakdown: { [cat: string]: { revenue: number; expense: number } } = {};

    const activeSubCost = abonnements
      .filter(a => a.status === "Actif")
      .reduce((sum, a) => sum + (a.billingPeriod === "Mensuel" ? a.costMonthly : a.costMonthly / 12), 0);

    const monthTransactions = transactions.filter(t => t.date && t.date.startsWith(selectedMonth));

    monthTransactions.forEach(t => {
      const amt = t.amount || 0;
      const cat = t.category || "Autre";
      if (!categoryBreakdown[cat]) {
        categoryBreakdown[cat] = { revenue: 0, expense: 0 };
      }

      if (t.type === "Revenue") {
        totalRevenue += amt;
        categoryBreakdown[cat].revenue += amt;
      } else if (t.type === "Dépense") {
        totalExpense += amt;
        categoryBreakdown[cat].expense += amt;
      }
    });

    if (activeSubCost > 0) {
      totalExpense += activeSubCost;
      if (!categoryBreakdown["Abonnements & Charges"]) {
        categoryBreakdown["Abonnements & Charges"] = { revenue: 0, expense: 0 };
      }
      categoryBreakdown["Abonnements & Charges"].expense += activeSubCost;
    }

    const netSavings = totalRevenue - totalExpense;
    const savingsRate = totalRevenue > 0 ? (netSavings / totalRevenue) * 100 : 0;
    const isGrowth = netSavings >= 0;

    // Calculate relative growth compared to previous month
    const prevMonthIndex = availableMonths.indexOf(selectedMonth) + 1;
    let growthPercent = 0;
    if (prevMonthIndex < availableMonths.length) {
      const prevMonth = availableMonths[prevMonthIndex];
      const prevTx = transactions.filter(t => t.date && t.date.startsWith(prevMonth));
      let prevRev = 0;
      let prevExp = 0;
      prevTx.forEach(t => {
        if (t.type === "Revenue") prevRev += (t.amount || 0);
        if (t.type === "Dépense") prevExp += (t.amount || 0);
      });
      const prevNet = prevRev - prevExp - activeSubCost;
      if (prevNet !== 0) {
        growthPercent = ((netSavings - prevNet) / Math.abs(prevNet)) * 100;
      }
    }

    return {
      totalRevenue,
      totalExpense,
      netSavings,
      savingsRate: Math.max(0, Math.round(savingsRate)),
      isGrowth,
      growthPercent: parseFloat(growthPercent.toFixed(1)),
      categoryBreakdown: Object.entries(categoryBreakdown).map(([name, val]) => ({
        name,
        revenue: val.revenue,
        expense: val.expense,
        total: val.revenue + val.expense
      })).sort((a, b) => b.total - a.total)
    };
  }, [selectedMonth, transactions, availableMonths]);

  // Format month to display (e.g., "Juillet 2026")
  const formatMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const label = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 shadow-2xs hover:shadow-sm transition-all duration-300 space-y-6">
      
      {/* HEADER WITH MONTH SELECTOR AND GROWTH ICON */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-2xl ${stats.isGrowth ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400" : "bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400"} transition-colors duration-300`}>
            {stats.isGrowth ? (
              <TrendingUp className="w-6 h-6 animate-pulse" />
            ) : (
              <TrendingDown className="w-6 h-6" />
            )}
          </div>
          <div>
            <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block font-mono">Performance Mensuelle</span>
            <div className="flex items-center gap-2 mt-0.5">
              <h4 className="text-lg font-black text-neutral-900 dark:text-neutral-50 font-display">
                Solde Net : {stats.netSavings.toLocaleString("fr-FR")} MAD
              </h4>
              <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black ${
                stats.isGrowth 
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" 
                  : "bg-rose-500/10 text-rose-600 dark:text-rose-400"
              }`}>
                {stats.isGrowth ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stats.growthPercent >= 0 ? "+" : ""}{stats.growthPercent}%
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Month Selector Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
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

      {/* CORE PERFORMANCE METRICS COMPARISON BAR */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Stats Columns */}
        <div className="md:col-span-5 grid grid-cols-2 gap-4">
          <div className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/50 dark:border-neutral-800/80 rounded-2xl p-4 space-y-1">
            <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">Entrées / Revenus</span>
            <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">
              +{stats.totalRevenue.toLocaleString("fr-FR")} MAD
            </div>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">Encaissements</span>
          </div>

          <div className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/50 dark:border-neutral-800/80 rounded-2xl p-4 space-y-1">
            <span className="text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">Sorties / Dépenses</span>
            <div className="text-base font-black text-neutral-500 dark:text-neutral-400 font-mono">
              -{stats.totalExpense.toLocaleString("fr-FR")} MAD
            </div>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">Paiements effectifs</span>
          </div>
        </div>

        {/* Right Comparison Visualizer */}
        <div className="md:col-span-7 space-y-3.5 bg-neutral-50 dark:bg-zinc-950/50 border border-neutral-200/40 dark:border-neutral-800/40 rounded-2xl p-4.5">
          <div className="flex justify-between items-center text-xs font-bold text-neutral-600 dark:text-neutral-400">
            <span className="flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-indigo-500" />
              Ratio d'utilisation du revenu
            </span>
            <span className="font-mono text-neutral-900 dark:text-neutral-50">
              {stats.totalRevenue > 0 ? ((stats.totalExpense / stats.totalRevenue) * 100).toFixed(0) : 0}% des revenus dépensés
            </span>
          </div>

          {/* Progress gauge comparing income vs expense */}
          <div className="relative w-full h-3 bg-neutral-200/70 dark:bg-neutral-800 rounded-full overflow-hidden">
            <div 
              style={{ width: `${Math.min(100, stats.totalRevenue > 0 ? (stats.totalExpense / stats.totalRevenue) * 100 : 0)}%` }}
              className={`h-full transition-all duration-500 ease-out rounded-full ${
                stats.savingsRate >= 30 ? "bg-indigo-500" : stats.savingsRate >= 10 ? "bg-amber-500" : "bg-rose-500"
              }`}
            />
          </div>

          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-neutral-400">
            <span>Taux d'Épargne Réalisé : <strong className="text-emerald-600 dark:text-emerald-400 font-mono font-black">{stats.savingsRate}%</strong></span>
            <span>Objectif recommandé : 30%</span>
          </div>
        </div>
      </div>

      {/* COLLAPSIBLE BREAKDOWN BY CATEGORY */}
      <div className="border-t border-neutral-100 dark:border-neutral-800/80 pt-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between text-xs font-black text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 uppercase tracking-widest py-1 cursor-pointer select-none"
        >
          <span className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-indigo-500" />
            <span>{isOpen ? "Masquer la ventilation détaillée" : "Afficher la ventilation détaillée par catégorie"}</span>
          </span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {isOpen && (
          <div className="space-y-4 animate-in slide-in-from-top-2 duration-200 mt-4">
            {/* View Selector Controls */}
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">
                Visualisation {selectedMonth}
              </span>
              <div className="flex bg-neutral-100 dark:bg-zinc-950 p-1 rounded-xl border border-neutral-200/50 dark:border-neutral-800/80">
                <button
                  onClick={() => setBreakdownView("chart")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                    breakdownView === "chart"
                      ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                  }`}
                >
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Graphique</span>
                </button>
                <button
                  onClick={() => setBreakdownView("list")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer select-none ${
                    breakdownView === "list"
                      ? "bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-400 shadow-2xs"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
                  }`}
                >
                  <List className="w-3.5 h-3.5" />
                  <span>Détails</span>
                </button>
              </div>
            </div>

            {breakdownView === "chart" ? (
              (() => {
                const expenseChartData = stats.categoryBreakdown
                  .filter(cat => cat.expense > 0)
                  .map(cat => ({
                    name: cat.name,
                    value: cat.expense
                  }));

                if (expenseChartData.length === 0) {
                  return (
                    <div className="text-center py-12 text-neutral-400 dark:text-neutral-500 italic text-xs">
                      Aucune dépense enregistrée pour ce mois-ci.
                    </div>
                  );
                }

                // Calculate dynamic height based on the number of categories to avoid squishing
                const chartHeight = Math.max(180, expenseChartData.length * 40);

                return (
                  <div className="w-full bg-neutral-50/50 dark:bg-zinc-950/30 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-4">
                    <div className="text-center mb-3">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Répartition des Dépenses (MAD)</span>
                    </div>
                    <div style={{ height: `${chartHeight}px` }} className="w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={expenseChartData}
                          layout="vertical"
                          margin={{ top: 5, right: 15, left: 5, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e5e5" className="opacity-30 dark:opacity-10" />
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="name" 
                            type="category" 
                            tick={{ fill: '#737373', fontSize: 10, fontWeight: 600 }}
                            width={130}
                            axisLine={false}
                            tickLine={false}
                          />
                          <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(0, 0, 0, 0.02)' }} />
                          <Bar 
                            dataKey="value" 
                            radius={[0, 4, 4, 0]}
                            barSize={12}
                          >
                            {expenseChartData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                );
              })()
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {stats.categoryBreakdown.map((cat, idx) => {
                  const maxAmt = Math.max(cat.revenue, cat.expense);
                  return (
                    <div 
                      key={idx} 
                      className="bg-neutral-50/50 dark:bg-zinc-950 border border-neutral-200/50 dark:border-neutral-800 rounded-2xl p-3.5 flex flex-col justify-between hover:border-indigo-500/30 transition-colors"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 truncate">{cat.name}</span>
                        <span className="text-[10px] font-mono font-semibold text-neutral-400 shrink-0">
                          {((maxAmt / (stats.totalRevenue || 1)) * 100).toFixed(0)}% du total
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-dashed border-neutral-200/50 dark:border-neutral-800">
                        <div className="space-y-0.5">
                          <span className="text-[9px] text-neutral-400 font-semibold uppercase block">Encaissement</span>
                          <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">
                            {cat.revenue > 0 ? `+${cat.revenue.toLocaleString()} MAD` : "—"}
                          </span>
                        </div>

                        <div className="space-y-0.5 text-right">
                          <span className="text-[9px] text-neutral-400 font-semibold uppercase block">Décaissement</span>
                          <span className="text-xs font-black font-mono text-neutral-500 dark:text-neutral-400">
                            {cat.expense > 0 ? `-${cat.expense.toLocaleString()} MAD` : "—"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
