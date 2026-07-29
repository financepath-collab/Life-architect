import React, { useMemo } from "react";
import { FinanceTransaction, Abonnement } from "../types";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from "recharts";
import { PiggyBank, Coins, TrendingUp, Percent, Landmark, Calendar, ArrowUpRight } from "lucide-react";

interface SavingsTrendChartProps {
  transactions: FinanceTransaction[];
  abonnements?: Abonnement[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isPositive = data["Épargne Nette"] >= 0;
    
    return (
      <div className="bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 p-4 rounded-2xl shadow-lg space-y-2.5 min-w-[240px] font-sans animate-in fade-in zoom-in duration-150">
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
          <div className="border-t border-dashed border-neutral-200 dark:border-neutral-800 pt-1.5 mt-1.5 space-y-1.5">
            <div className="flex justify-between items-center gap-4">
              <span className="text-neutral-800 dark:text-neutral-100 font-semibold flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isPositive ? 'bg-indigo-500' : 'bg-rose-500'}`} />
                Épargne Mensuelle :
              </span>
              <span className={`font-mono font-bold ${isPositive ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {isPositive ? "+" : ""}{data["Épargne Nette"].toLocaleString("fr-FR")} MAD
              </span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-neutral-900 dark:text-neutral-100 font-black flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-900 dark:bg-neutral-100" />
                Capital Cumulé :
              </span>
              <span className="font-mono font-black text-neutral-950 dark:text-white">
                {data["Épargne Cumulée"].toLocaleString("fr-FR")} MAD
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center text-[10px] gap-4 pt-1">
            <span className="text-neutral-400 dark:text-neutral-500 font-semibold">Taux d'Épargne :</span>
            <span className={`font-bold font-mono px-1.5 py-0.5 rounded-md ${
              isPositive 
                ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400' 
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

export default function SavingsTrendChart({ transactions = [], abonnements = [] }: SavingsTrendChartProps) {
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

  // Generate list of the last 12 months
  const last12Months = useMemo(() => {
    const list = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(referenceDate.getFullYear(), referenceDate.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const key = `${year}-${month}`;
      const label = d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
      list.push({ key, label });
    }
    return list;
  }, [referenceDate]);

  // Build the detailed chart data representing 12 months of trends
  const chartData = useMemo(() => {
    const activeSubCost = abonnements
      .filter(a => a.status === "Actif")
      .reduce((sum, a) => sum + (a.billingPeriod === "Mensuel" ? a.costMonthly : a.costMonthly / 12), 0);

    let cumulativeSavings = 0;

    return last12Months.map(({ key, label }) => {
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
      let finalExpenses = expenses;
      
      // Include active subscription charges
      if (activeSubCost > 0) {
        finalExpenses += activeSubCost;
      }

      const netSavings = finalIncome - finalExpenses;
      const savingsRate = finalIncome > 0 ? (netSavings / finalIncome) * 100 : 0;
      
      cumulativeSavings += netSavings;

      return {
        name: label.charAt(0).toUpperCase() + label.slice(1),
        Revenus: finalIncome,
        Dépenses: finalExpenses,
        "Épargne Nette": netSavings,
        "Épargne Cumulée": cumulativeSavings,
        "Taux d'Épargne (%)": Math.round(savingsRate),
      };
    });
  }, [last12Months, transactions, abonnements]);

  // Calculations for KPI Cards
  const stats = useMemo(() => {
    const totalSavings = chartData.reduce((acc, curr) => acc + curr["Épargne Nette"], 0);
    const avgSavings = totalSavings / chartData.length;
    const avgSavingsRate = chartData.reduce((acc, curr) => acc + curr["Taux d'Épargne (%)"], 0) / chartData.length;
    const finalAccumulated = chartData[chartData.length - 1]?.["Épargne Cumulée"] || 0;
    
    // Find highest monthly savings
    let maxMonthlySavings = 0;
    let maxMonthName = "";
    chartData.forEach(m => {
      if (m["Épargne Nette"] > maxMonthlySavings) {
        maxMonthlySavings = m["Épargne Nette"];
        maxMonthName = m.name;
      }
    });

    return {
      totalSavings,
      avgSavings,
      avgSavingsRate: Math.round(avgSavingsRate),
      finalAccumulated,
      maxMonthlySavings,
      maxMonthName
    };
  }, [chartData]);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in duration-300">
      
      {/* Header section with subtitle & legend */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-4 border-dashed">
        <div className="space-y-1">
          <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-50 flex items-center gap-2 font-display uppercase tracking-wider">
            <TrendingUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Tendances de l'Épargne & Accumulation de Capital (12 Mois)</span>
          </h3>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 font-medium">
            Analyse de votre enrichissement à long terme montrant l'épargne nette mensuelle et le cumul progressif de votre richesse.
          </p>
        </div>
        
        {/* Custom Legend */}
        <div className="flex flex-wrap items-center gap-4 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/50 dark:border-neutral-800 px-3.5 py-1.5 rounded-xl text-[10px] font-bold text-neutral-600 dark:text-neutral-400 self-start md:self-auto uppercase tracking-wide">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-xs bg-indigo-200 dark:bg-indigo-950/50" />
            <span>Épargne Mensuelle (MAD)</span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-neutral-200 dark:border-neutral-800 pl-3">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
            <span>Capital Cumulé (MAD)</span>
          </div>
        </div>
      </div>

      {/* Dual Axis Line & Area Chart */}
      <div className="w-full h-80 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 15, right: -5, left: -20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="wealthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0}/>
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
            
            {/* Left YAxis for Monthly Net Savings */}
            <YAxis 
              yAxisId="left"
              tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 500 }}
              className="text-neutral-400 dark:text-neutral-500"
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
            />

            {/* Right YAxis for Cumulative Wealth */}
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 500 }}
              className="text-indigo-400 dark:text-indigo-500"
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
            
            {/* Bar showing monthly net savings on Left YAxis */}
            <Bar 
              yAxisId="left"
              name="Épargne Mensuelle"
              dataKey="Épargne Nette" 
              fill="#818cf8"
              opacity={0.65}
              radius={[3, 3, 0, 0]} 
              maxBarSize={16}
            />
            
            {/* Area showing cumulative wealth trend on Right YAxis */}
            <Area 
              yAxisId="right"
              name="Épargne Cumulée"
              type="monotone" 
              dataKey="Épargne Cumulée" 
              stroke="#4f46e5" 
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#wealthGradient)"
              dot={{ r: 4.5, stroke: "#4f46e5", strokeWidth: 2.5, fill: "#ffffff" }}
              activeDot={{ r: 6.5, stroke: "#4f46e5", strokeWidth: 3, fill: "#ffffff" }}
            />
            
            {/* Baseline reference */}
            <ReferenceLine yAxisId="left" y={0} stroke="#f43f5e" strokeDasharray="3 3" opacity={0.5} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* High fidelity KPI summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
        {/* Card 1: Capital Accumulé Final */}
        <div className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/60 dark:border-neutral-800 rounded-xl p-4 space-y-1 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            <Landmark className="w-3.5 h-3.5 text-indigo-500" />
            <span>Richesse Accumulée (12 mois)</span>
          </div>
          <div className="text-base font-black text-neutral-900 dark:text-neutral-50 font-mono">
            {stats.finalAccumulated.toLocaleString("fr-FR")} MAD
          </div>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">Total net épargné sur la période</span>
        </div>

        {/* Card 2: Épargne Mensuelle Moyenne */}
        <div className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/60 dark:border-neutral-800 rounded-xl p-4 space-y-1 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            <Coins className="w-3.5 h-3.5 text-emerald-500" />
            <span>Épargne Mensuelle Moyenne</span>
          </div>
          <div className="text-base font-black text-neutral-900 dark:text-neutral-50 font-mono">
            {Math.round(stats.avgSavings).toLocaleString("fr-FR")} MAD
          </div>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">Surplus mensuel disponible moyen</span>
        </div>

        {/* Card 3: Taux d'Épargne Moyen */}
        <div className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/60 dark:border-neutral-800 rounded-xl p-4 space-y-1 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            <Percent className="w-3.5 h-3.5 text-amber-500" />
            <span>Taux d'Épargne Moyen</span>
          </div>
          <div className="text-base font-black text-neutral-900 dark:text-neutral-50 font-mono">
            {stats.avgSavingsRate}%
          </div>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">Proportion du revenu mise de côté</span>
        </div>

        {/* Card 4: Meilleure performance mensuelle */}
        <div className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/80 dark:border-neutral-800 rounded-xl p-4 space-y-1 flex flex-col justify-between">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            <ArrowUpRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Meilleure Épargne Mensuelle</span>
          </div>
          <div className="text-base font-black text-neutral-900 dark:text-neutral-50 font-mono flex items-center justify-between">
            <span>{stats.maxMonthlySavings.toLocaleString("fr-FR")} MAD</span>
            <span className="text-[9px] font-sans font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-1.5 py-0.5 rounded uppercase tracking-wider">
              {stats.maxMonthName}
            </span>
          </div>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 block">Performance d'épargne record</span>
        </div>
      </div>
    </div>
  );
}
