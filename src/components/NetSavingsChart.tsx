import React, { useMemo } from "react";
import { FinanceTransaction, Abonnement } from "../types";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import { PiggyBank, TrendingUp, ArrowUpRight, Coins, Percent, Landmark } from "lucide-react";

interface NetSavingsChartProps {
  transactions: FinanceTransaction[];
  abonnements?: Abonnement[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPositive = data["Épargne Nette"] >= 0;
    return (
      <div className="bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 p-4 rounded-xl shadow-lg space-y-2.5 min-w-[220px] font-sans">
        <p className="text-xs font-black text-neutral-950 dark:text-neutral-50 border-b border-neutral-100 dark:border-neutral-800 pb-1.5 uppercase tracking-wider">
          {label}
        </p>
        <div className="space-y-1.5 text-xs">
          <div className="flex justify-between items-center gap-4">
            <span className="text-neutral-500 dark:text-neutral-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Revenus :
            </span>
            <span className="font-bold font-mono text-neutral-800 dark:text-neutral-200">
              +{data.Revenus.toLocaleString("fr-FR")} MAD
            </span>
          </div>
          <div className="flex justify-between items-center gap-4">
            <span className="text-neutral-500 dark:text-neutral-400 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Dépenses :
            </span>
            <span className="font-bold font-mono text-neutral-500 dark:text-neutral-400">
              -{data.Dépenses.toLocaleString("fr-FR")} MAD
            </span>
          </div>
          <div className="border-t border-dashed border-neutral-200 dark:border-neutral-800 pt-1.5 mt-1.5 flex justify-between items-center gap-4">
            <span className="text-neutral-800 dark:text-neutral-100 font-black flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isPositive ? 'bg-emerald-600' : 'bg-rose-600'}`} />
              Épargne Nette :
            </span>
            <span className={`font-mono font-black ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              {isPositive ? "+" : ""}{data["Épargne Nette"].toLocaleString("fr-FR")} MAD
            </span>
          </div>
          <div className="flex justify-between items-center text-[10px] gap-4">
            <span className="text-neutral-400 dark:text-neutral-500 font-semibold">Taux d'Épargne :</span>
            <span className={`font-bold font-mono px-1.5 py-0.5 rounded-md ${
              isPositive 
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400' 
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400'
            }`}>
              {data["Taux d'Épargne (%)"]}%
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function NetSavingsChart({ transactions = [], abonnements = [] }: NetSavingsChartProps) {
  // Find the latest transaction date to align the timeline
  const referenceDate = useMemo(() => {
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

  // Generate list of the last 6 months
  const last6Months = useMemo(() => {
    const list = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const key = `${year}-${month}`;
      const label = d.toLocaleDateString("fr-FR", { month: "long", year: "2-digit" });
      list.push({ key, label });
    }
    return list;
  }, [referenceDate]);

  // Build the detailed chart data
  const chartData = useMemo(() => {
    const baselineDefaults: { [key: string]: { income: number; expenses: number } } = {
      "2026-02": { income: 24500, expenses: 16800 },
      "2026-03": { income: 28000, expenses: 19500 },
      "2026-04": { income: 26200, expenses: 15400 },
      "2026-05": { income: 31000, expenses: 21000 },
      "2026-06": { income: 29500, expenses: 22800 },
      "2026-07": { income: 0, expenses: 0 }
    };

    const activeSubCost = abonnements
      .filter(a => a.status === "Actif")
      .reduce((sum, a) => sum + (a.billingPeriod === "Mensuel" ? a.costMonthly : a.costMonthly / 12), 0);

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

      const baseVal = baselineDefaults[key] || { income: 25000, expenses: 18000 };
      const finalIncome = income > 0 ? income : baseVal.income;
      let finalExpenses = expenses > 0 ? expenses : baseVal.expenses;
      
      // Auto-add active subscriptions/charges
      if (activeSubCost > 0) {
        finalExpenses += activeSubCost;
      }

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
  }, [last6Months, transactions, abonnements]);

  // General Statistics based on the 6 months
  const stats = useMemo(() => {
    const totalSavings = chartData.reduce((acc, curr) => acc + curr["Épargne Nette"], 0);
    const avgSavings = totalSavings / chartData.length;
    const avgSavingsRate = chartData.reduce((acc, curr) => acc + curr["Taux d'Épargne (%)"], 0) / chartData.length;
    
    // Find the month with the highest net savings
    let bestMonth = chartData[0];
    chartData.forEach(m => {
      if (m["Épargne Nette"] > bestMonth["Épargne Nette"]) {
        bestMonth = m;
      }
    });

    return {
      totalSavings,
      avgSavings,
      avgSavingsRate: Math.round(avgSavingsRate),
      bestMonthName: bestMonth.name,
      bestMonthValue: bestMonth["Épargne Nette"]
    };
  }, [chartData]);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4 border-dashed">
        <div className="space-y-1">
          <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-50 flex items-center gap-2 font-display uppercase tracking-wider">
            <PiggyBank className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Suivi d'Épargne Nette Évolutive (NetSavingsChart)</span>
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
            Visualisation de l'évolution de votre épargne nette mensuelle sur les 6 derniers mois (Revenus vs Dépenses).
          </p>
        </div>
        
        {/* Legends / Legend Items */}
        <div className="flex flex-wrap items-center gap-4 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/50 dark:border-neutral-800 px-3.5 py-1.5 rounded-xl text-[10px] font-bold text-neutral-600 dark:text-neutral-400 self-start md:self-auto uppercase tracking-wide">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-emerald-500/80" />
            <span>Revenus</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-rose-500/80" />
            <span>Dépenses</span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-neutral-200 dark:border-neutral-800 pl-3">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <span>Épargne Nette (MAD)</span>
          </div>
        </div>
      </div>

      {/* Chart Section */}
      <div className="w-full h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="savingsColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-neutral-100 dark:text-neutral-800" />
            <XAxis 
              dataKey="name" 
              tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 600 }}
              className="text-neutral-400 dark:text-neutral-500"
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 500 }}
              className="text-neutral-400 dark:text-neutral-500"
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(245, 245, 245, 0.4)' }} />
            
            {/* Background comparative Columns */}
            <Bar 
              name="Revenus"
              dataKey="Revenus" 
              fill="#10b981" 
              opacity={0.15}
              radius={[3, 3, 0, 0]} 
              maxBarSize={20}
            />
            <Bar 
              name="Dépenses"
              dataKey="Dépenses" 
              fill="#ef4444" 
              opacity={0.15}
              radius={[3, 3, 0, 0]} 
              maxBarSize={20}
            />
            
            {/* Area line representing the net savings with custom gradient */}
            <Area 
              name="Épargne Nette"
              type="monotone" 
              dataKey="Épargne Nette" 
              stroke="#6366f1" 
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#savingsColor)"
              dot={{ r: 4, stroke: "#6366f1", strokeWidth: 2, fill: "#ffffff" }}
              activeDot={{ r: 6, stroke: "#6366f1", strokeWidth: 2, fill: "#ffffff" }}
            />
            
            {/* Zero reference line */}
            <ReferenceLine y={0} stroke="#cbd5e1" strokeDasharray="3 3" />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Summary statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/60 dark:border-neutral-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5 text-indigo-500" />
            <span>Épargne Nette Moyenne</span>
          </div>
          <div className="text-base font-black text-neutral-900 dark:text-neutral-50 font-mono">
            {Math.round(stats.avgSavings).toLocaleString("fr-FR")} MAD
          </div>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">Surplus mensuel moyen</span>
        </div>

        <div className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/60 dark:border-neutral-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            <Percent className="w-3.5 h-3.5 text-emerald-500" />
            <span>Taux d'Épargne Moyen</span>
          </div>
          <div className="text-base font-black text-neutral-900 dark:text-neutral-50 font-mono">
            {stats.avgSavingsRate}%
          </div>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">Proportion du revenu épargnée</span>
        </div>

        <div className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-1">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            <Landmark className="w-3.5 h-3.5 text-amber-500" />
            <span>Meilleur Mois de d'Épargne</span>
          </div>
          <div className="text-base font-black text-neutral-900 dark:text-neutral-50 font-mono flex items-center justify-between">
            <span>{stats.bestMonthValue.toLocaleString("fr-FR")} MAD</span>
            <span className="text-[10px] font-sans font-bold text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5 roundedbg-indigo-50/50 dark:bg-indigo-950/20 uppercase tracking-wider">
              {stats.bestMonthName}
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">Record d'épargne nette</span>
        </div>
      </div>
    </div>
  );
}
