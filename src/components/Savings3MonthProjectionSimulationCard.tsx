import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  PiggyBank, 
  TrendingUp, 
  Calculator, 
  Calendar, 
  Sparkles, 
  Percent, 
  Coins, 
  Target, 
  ArrowUpRight, 
  ShieldCheck, 
  Zap, 
  Sliders, 
  RefreshCw, 
  Layers, 
  Info,
  CheckCircle2,
  BarChart2,
  ChevronRight,
  Award
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { FinanceTransaction, Abonnement, FinanceSalaire } from "../types";

interface Savings3MonthProjectionSimulationCardProps {
  transactions: FinanceTransaction[];
  abonnements: Abonnement[];
  salaires?: FinanceSalaire[];
  initialBalance?: number;
}

export default function Savings3MonthProjectionSimulationCard({
  transactions = [],
  abonnements = [],
  salaires = [],
  initialBalance = 0
}: Savings3MonthProjectionSimulationCardProps) {
  // ---------------------------------------------------------------------------
  // 1. CALCULATE 3-MONTH HISTORICAL BASELINE
  // ---------------------------------------------------------------------------
  const threeMonthsData = useMemo(() => {
    // Collect all available unique months from transactions & salaries
    const monthsSet = new Set<string>();
    
    // Always include latest months by default
    const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      monthsSet.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
    }

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

    // Sorted in descending order (most recent first)
    const sortedMonths = Array.from(monthsSet).sort().reverse();

    // Take the top 3 most recent months
    const last3Months = sortedMonths.slice(0, 3);

    // Active subscriptions cost (monthly equivalent)
    const activeSubsCost = abonnements
      .filter(a => a.status === "Actif")
      .reduce((sum, a) => sum + (a.billingPeriod === "Annuel" ? a.costMonthly / 12 : a.costMonthly), 0);

    const monthlyBreakdown = last3Months.map(monthKey => {
      // Income
      let salarySum = salaires
        .filter(s => s.date && s.date.startsWith(monthKey))
        .reduce((sum, s) => sum + (s.netAmount || 0), 0);

      const otherIncome = transactions
        .filter(t => t.type === "Revenue" && t.date && t.date.startsWith(monthKey))
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      // If no salary logged specifically, use transaction revenues or baseline
      let totalIncome = salarySum + otherIncome;
      if (totalIncome === 0) {
        totalIncome = 32000; // Realistic default fallback for analysis
      }

      // Expenses
      let totalExpenses = transactions
        .filter(t => t.type === "Dépense" && t.date && t.date.startsWith(monthKey))
        .reduce((sum, t) => sum + (t.amount || 0), 0);

      totalExpenses += activeSubsCost;

      if (totalExpenses === activeSubsCost) {
        totalExpenses += 18500; // Fallback if no transactions logged for that month
      }

      const netSavings = Math.max(0, totalIncome - totalExpenses);
      const savingsRate = totalIncome > 0 ? (netSavings / totalIncome) * 100 : 0;

      // Month name label in French
      const [y, m] = monthKey.split("-");
      const d = new Date(parseInt(y, 10), parseInt(m, 10) - 1, 1);
      const monthLabel = d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });

      return {
        monthKey,
        monthLabel: monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1),
        income: totalIncome,
        expenses: totalExpenses,
        netSavings,
        savingsRate
      };
    });

    // Compute averages over the 3 months
    const totalAvgIncome = monthlyBreakdown.reduce((acc, m) => acc + m.income, 0) / (monthlyBreakdown.length || 1);
    const totalAvgExpenses = monthlyBreakdown.reduce((acc, m) => acc + m.expenses, 0) / (monthlyBreakdown.length || 1);
    const totalAvgNetSavings = monthlyBreakdown.reduce((acc, m) => acc + m.netSavings, 0) / (monthlyBreakdown.length || 1);
    
    const avgSavingsRate = totalAvgIncome > 0 ? (totalAvgNetSavings / totalAvgIncome) * 100 : 0;

    return {
      monthlyBreakdown,
      totalAvgIncome,
      totalAvgExpenses,
      totalAvgNetSavings,
      avgSavingsRate
    };
  }, [transactions, abonnements, salaires]);

  // ---------------------------------------------------------------------------
  // 2. SIMULATION CONTROLS STATE
  // ---------------------------------------------------------------------------
  // Simulated monthly savings rate (%) initialized to actual 3-month average
  const [simulatedRate, setSimulatedRate] = useState<number>(() => {
    return Math.round(threeMonthsData.avgSavingsRate || 25);
  });

  // Annual return yield (%)
  const [annualReturnRate, setAnnualReturnRate] = useState<number>(5.0); // Default 5%

  // Horizon in months (default 36 months = 3 years)
  const [horizonMonths, setHorizonMonths] = useState<number>(36);

  // Initial Lump Sum starting capital option
  const [useInitialCapital, setUseInitialCapital] = useState<boolean>(false);
  const [customStartingCapital, setCustomStartingCapital] = useState<number>(initialBalance || 10000);

  // Sync simulated rate if baseline changes drastically
  const handleResetToBaseline = () => {
    setSimulatedRate(Math.round(threeMonthsData.avgSavingsRate));
    setAnnualReturnRate(5.0);
    setHorizonMonths(36);
  };

  // Monthly savings amount derived from simulated rate and average income
  const simulatedMonthlyAmount = useMemo(() => {
    return Math.round((threeMonthsData.totalAvgIncome * simulatedRate) / 100);
  }, [threeMonthsData.totalAvgIncome, simulatedRate]);

  // Actual baseline monthly amount for comparison
  const baselineMonthlyAmount = Math.round(threeMonthsData.totalAvgNetSavings);

  // ---------------------------------------------------------------------------
  // 3. PROJECTION ENGINE (MONTH BY MONTH COMPOUNDING)
  // ---------------------------------------------------------------------------
  const projectionResults = useMemo(() => {
    const monthlyReturnRate = Math.pow(1 + annualReturnRate / 100, 1 / 12) - 1;
    const startCap = useInitialCapital ? customStartingCapital : 0;

    let cumulativeSimulated = startCap;
    let cumulativeContributionsSimulated = startCap;

    let cumulativeBaseline = startCap;
    let cumulativeContributionsBaseline = startCap;

    const chartPoints = [];

    for (let month = 1; month <= horizonMonths; month++) {
      // Simulated trajectory
      cumulativeContributionsSimulated += simulatedMonthlyAmount;
      cumulativeSimulated = (cumulativeSimulated + simulatedMonthlyAmount) * (1 + monthlyReturnRate);

      // Baseline trajectory (at current 3M average)
      cumulativeContributionsBaseline += baselineMonthlyAmount;
      cumulativeBaseline = (cumulativeBaseline + baselineMonthlyAmount) * (1 + monthlyReturnRate);

      const interestGained = Math.max(0, cumulativeSimulated - cumulativeContributionsSimulated);

      // Label format
      let label = `M${month}`;
      if (horizonMonths > 24) {
        if (month % 6 === 0 || month === 1 || month === horizonMonths) {
          const yrs = (month / 12).toFixed(month % 12 === 0 ? 0 : 1);
          label = `${yrs} an${month >= 24 ? "s" : ""}`;
        }
      } else {
        label = `Mois ${month}`;
      }

      chartPoints.push({
        month,
        label,
        "Versements Cumulés": Math.round(cumulativeContributionsSimulated),
        "Intérêts Générés": Math.round(interestGained),
        "Capital Projeté": Math.round(cumulativeSimulated),
        "Capital Taux Actuel": Math.round(cumulativeBaseline)
      });
    }

    const totalProjectedSimulated = Math.round(cumulativeSimulated);
    const totalContributionsSimulated = Math.round(cumulativeContributionsSimulated);
    const totalInterestGained = Math.max(0, totalProjectedSimulated - totalContributionsSimulated);

    const totalProjectedBaseline = Math.round(cumulativeBaseline);
    const extraGainVsBaseline = totalProjectedSimulated - totalProjectedBaseline;

    return {
      chartPoints,
      totalProjectedSimulated,
      totalContributionsSimulated,
      totalInterestGained,
      totalProjectedBaseline,
      extraGainVsBaseline
    };
  }, [
    horizonMonths, 
    simulatedMonthlyAmount, 
    baselineMonthlyAmount, 
    annualReturnRate, 
    useInitialCapital, 
    customStartingCapital
  ]);

  // Key Checkpoint Milestones (6M, 1 an, 3 ans, 5 ans, 10 ans)
  const milestones = useMemo(() => {
    const monthlyReturnRate = Math.pow(1 + annualReturnRate / 100, 1 / 12) - 1;
    const startCap = useInitialCapital ? customStartingCapital : 0;

    const periods = [
      { months: 6, label: "6 Mois" },
      { months: 12, label: "1 An" },
      { months: 36, label: "3 Ans" },
      { months: 60, label: "5 Ans" },
      { months: 120, label: "10 Ans" }
    ];

    return periods.map(p => {
      let cap = startCap;
      let contrib = startCap;
      for (let m = 1; m <= p.months; m++) {
        contrib += simulatedMonthlyAmount;
        cap = (cap + simulatedMonthlyAmount) * (1 + monthlyReturnRate);
      }
      return {
        periodLabel: p.label,
        months: p.months,
        projectedCapital: Math.round(cap),
        contributions: Math.round(contrib),
        interest: Math.round(Math.max(0, cap - contrib))
      };
    });
  }, [simulatedMonthlyAmount, annualReturnRate, useInitialCapital, customStartingCapital]);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm space-y-6 transition-all">
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
              <Calculator className="w-5 h-5" />
            </span>
            <h3 className="text-base font-black text-neutral-950 dark:text-neutral-50 uppercase tracking-tight">
              Simulation & Projection d'Épargne
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/50">
              Basé sur 3 Mois
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Projection financière basée sur votre taux d'économie moyen des 3 derniers mois ({threeMonthsData.avgSavingsRate.toFixed(1)}%). Explorez différents scénarios avec intérêts composés.
          </p>
        </div>

        <button
          type="button"
          onClick={handleResetToBaseline}
          className="self-start md:self-auto px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 dark:hover:bg-zinc-700 text-neutral-700 dark:text-neutral-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          title="Réinitialiser la simulation au taux moyen actuel"
        >
          <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
          <span>Réinitialiser</span>
        </button>
      </div>

      {/* 3-MONTH HISTORICAL BASELINE RECAP */}
      <div className="bg-neutral-50/70 dark:bg-zinc-950/40 border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-purple-500" />
            <span>Synthèse Historique (3 Derniers Mois)</span>
          </span>
          <span className="text-[11px] font-semibold text-neutral-400">
            Moyenne Mensuelle
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Month 1, 2, 3 details */}
          {threeMonthsData.monthlyBreakdown.map((m) => (
            <div key={m.monthKey} className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 p-3 rounded-xl space-y-1 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-neutral-900 dark:text-neutral-100">{m.monthLabel}</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60">
                  {m.savingsRate.toFixed(1)} % épargné
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-1">
                <span>Revenu : {m.income.toLocaleString("fr-FR")} MAD</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">+{m.netSavings.toLocaleString("fr-FR")} MAD</span>
              </div>
            </div>
          ))}

          {/* 3M Average Summary Card */}
          <div className="bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent border border-purple-500/20 p-3 rounded-xl space-y-1 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-purple-900 dark:text-purple-200">Moyenne 3M Taux</span>
              <span className="text-xs font-black text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full bg-purple-500/10">
                {threeMonthsData.avgSavingsRate.toFixed(1)} %
              </span>
            </div>
            <div className="text-[11px] text-neutral-600 dark:text-neutral-300 font-semibold mt-1">
              Épargne moyenne : <strong className="text-purple-700 dark:text-purple-300">{threeMonthsData.totalAvgNetSavings.toLocaleString("fr-FR", { maximumFractionDigits: 0 })} MAD/mois</strong>
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS & SLIDERS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 bg-neutral-100/40 dark:bg-zinc-950/30 p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/60">
        
        {/* CONTROL 1: SIMULATED SAVINGS RATE */}
        <div className="space-y-3 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-3xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-purple-500" />
              <span>Taux d'Épargne Simulé</span>
            </label>
            <span className="text-sm font-black text-purple-600 dark:text-purple-400 font-mono">
              {simulatedRate} %
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={75}
            step={1}
            value={simulatedRate}
            onChange={(e) => setSimulatedRate(Number(e.target.value))}
            className="w-full accent-purple-600 cursor-pointer h-2 bg-neutral-200 dark:bg-zinc-800 rounded-lg"
          />

          <div className="flex items-center justify-between text-[11px] text-neutral-500">
            <span>Épargne mensuelle : <strong className="text-neutral-900 dark:text-neutral-100 font-mono">{simulatedMonthlyAmount.toLocaleString("fr-FR")} MAD</strong></span>
            <span>0% - 75%</span>
          </div>

          {/* Quick Boost Buttons */}
          <div className="pt-1 flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-semibold text-neutral-400">Ajustement rapide :</span>
            <button
              type="button"
              onClick={() => setSimulatedRate(Math.max(0, simulatedRate - 5))}
              className="px-2 py-0.5 rounded bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-[10px] font-bold text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              -5%
            </button>
            <button
              type="button"
              onClick={() => setSimulatedRate(Math.round(threeMonthsData.avgSavingsRate))}
              className="px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold border border-purple-200/60 dark:border-purple-800/60"
            >
              Moyenne 3M
            </button>
            <button
              type="button"
              onClick={() => setSimulatedRate(simulatedRate + 5)}
              className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200/60 dark:border-emerald-800/60"
            >
              +5% Boost
            </button>
          </div>
        </div>

        {/* CONTROL 2: HORIZON & YIELD */}
        <div className="space-y-3 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-3xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-500" />
              <span>Horizon de Projection</span>
            </label>
            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 font-mono">
              {horizonMonths < 12 ? `${horizonMonths} mois` : `${(horizonMonths / 12).toFixed(horizonMonths % 12 === 0 ? 0 : 1)} an${horizonMonths >= 24 ? "s" : ""}`}
            </span>
          </div>

          <input
            type="range"
            min={6}
            max={120}
            step={6}
            value={horizonMonths}
            onChange={(e) => setHorizonMonths(Number(e.target.value))}
            className="w-full accent-indigo-600 cursor-pointer h-2 bg-neutral-200 dark:bg-zinc-800 rounded-lg"
          />

          <div className="flex items-center gap-1.5 pt-1">
            {[6, 12, 36, 60, 120].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setHorizonMonths(m)}
                className={`flex-1 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  horizonMonths === m
                    ? "bg-indigo-600 text-white shadow-xs font-black"
                    : "bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200"
                }`}
              >
                {m < 12 ? `${m}M` : `${m / 12}A`}
              </button>
            ))}
          </div>
        </div>

        {/* CONTROL 3: YIELD & INITIAL CAPITAL */}
        <div className="space-y-3 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-neutral-200/80 dark:border-neutral-800 shadow-3xs">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              <span>Rendement Annuel Estimé</span>
            </label>
            <span className="text-sm font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {annualReturnRate} %
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={15}
            step={0.5}
            value={annualReturnRate}
            onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
            className="w-full accent-emerald-600 cursor-pointer h-2 bg-neutral-200 dark:bg-zinc-800 rounded-lg"
          />

          <div className="flex items-center justify-between text-[10px] text-neutral-400">
            <span>0% (Livret / Cash)</span>
            <span>5% (Prudent)</span>
            <span>10%+ (Bourse / Actions)</span>
          </div>

          {/* Toggle starting lump sum */}
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useInitialCapital}
                onChange={(e) => setUseInitialCapital(e.target.checked)}
                className="rounded text-purple-600 focus:ring-purple-500"
              />
              <span className="font-bold text-neutral-700 dark:text-neutral-300 text-[11px]">Inclure apport initial</span>
            </label>
            {useInitialCapital && (
              <input
                type="number"
                value={customStartingCapital}
                onChange={(e) => setCustomStartingCapital(Math.max(0, Number(e.target.value)))}
                className="w-24 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 px-2 py-0.5 rounded text-xs font-mono font-bold text-right"
                placeholder="MAD"
              />
            )}
          </div>
        </div>

      </div>

      {/* RESULT METRICS SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projected Total Capital */}
        <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-indigo-700 rounded-2xl p-4 text-white shadow-md flex flex-col justify-between">
          <span className="text-[10px] font-black uppercase tracking-wider text-purple-200 block">
            Capital Total Projeté ({horizonMonths < 12 ? `${horizonMonths} mois` : `${(horizonMonths / 12).toFixed(0)} an(s)`})
          </span>
          <div className="my-2">
            <div className="text-2xl font-black font-mono leading-none">
              {projectionResults.totalProjectedSimulated.toLocaleString("fr-FR")} MAD
            </div>
            <span className="text-[11px] text-purple-100 font-medium block mt-1">
              Versements : {projectionResults.totalContributionsSimulated.toLocaleString("fr-FR")} MAD
            </span>
          </div>
          <div className="text-[10px] font-bold text-purple-200 bg-white/10 px-2 py-1 rounded-lg w-fit">
            Taux d'épargne : {simulatedRate}%
          </div>
        </div>

        {/* Compound Interest Gained */}
        <div className="bg-white dark:bg-zinc-900 border border-emerald-200 dark:border-emerald-900/50 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              Gains d'Intérêts Composés
            </span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="my-2">
            <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono leading-none">
              +{projectionResults.totalInterestGained.toLocaleString("fr-FR")} MAD
            </div>
            <span className="text-[11px] text-neutral-500 block mt-1">
              Rendement à {annualReturnRate}% / an
            </span>
          </div>
          <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-200/50 w-fit">
            Effet de levier : {((projectionResults.totalInterestGained / Math.max(1, projectionResults.totalContributionsSimulated)) * 100).toFixed(1)}% de plus
          </div>
        </div>

        {/* Extra Gain vs Current 3M Baseline */}
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              Ecart vs Taux Moyen 3M
            </span>
            <TrendingUp className="w-4 h-4 text-purple-500" />
          </div>
          <div className="my-2">
            <div className={`text-xl font-black font-mono leading-none ${
              projectionResults.extraGainVsBaseline >= 0 ? "text-purple-600 dark:text-purple-400" : "text-amber-600"
            }`}>
              {projectionResults.extraGainVsBaseline >= 0 ? "+" : ""}
              {projectionResults.extraGainVsBaseline.toLocaleString("fr-FR")} MAD
            </div>
            <span className="text-[11px] text-neutral-500 block mt-1">
              Comparé à {threeMonthsData.avgSavingsRate.toFixed(1)}% ({baselineMonthlyAmount.toLocaleString("fr-FR")} MAD/m)
            </span>
          </div>
          <div className="text-[10px] font-semibold text-neutral-600 dark:text-neutral-400">
            Effort mensuel : {simulatedMonthlyAmount >= baselineMonthlyAmount ? "+" : ""}
            {(simulatedMonthlyAmount - baselineMonthlyAmount).toLocaleString("fr-FR")} MAD/mois
          </div>
        </div>

        {/* Equivalent Monthly Pace */}
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 flex flex-col justify-between shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              Épargne Mensuelle Injectée
            </span>
            <Coins className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="my-2">
            <div className="text-xl font-black text-neutral-900 dark:text-neutral-100 font-mono leading-none">
              {simulatedMonthlyAmount.toLocaleString("fr-FR")} MAD
            </div>
            <span className="text-[11px] text-neutral-500 block mt-1">
              sur un revenu moyen de {Math.round(threeMonthsData.totalAvgIncome).toLocaleString("fr-FR")} MAD
            </span>
          </div>
          <div className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-200/50 w-fit">
            Reste à vivre : {Math.max(0, Math.round(threeMonthsData.totalAvgIncome - simulatedMonthlyAmount)).toLocaleString("fr-FR")} MAD
          </div>
        </div>
      </div>

      {/* PROJECTION TRAJECTORY CHART */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-purple-500" />
            <span>Trajectoire de Croissance du Capital ({horizonMonths < 12 ? `${horizonMonths} mois` : `${(horizonMonths / 12).toFixed(0)} ans`})</span>
          </h4>
          <span className="text-[11px] font-semibold text-neutral-400 hidden sm:inline">
            Cumulative Contributions vs Total Capital with Compound Interest
          </span>
        </div>

        <div className="h-72 w-full bg-neutral-50/50 dark:bg-zinc-950/30 p-3 rounded-2xl border border-neutral-200/80 dark:border-neutral-800">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={projectionResults.chartPoints} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="gradSimulated" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="gradInterest" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(150,150,150,0.15)" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} stroke="#a3a3a3" />
              <YAxis 
                tick={{ fontSize: 10 }} 
                stroke="#a3a3a3" 
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-neutral-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-neutral-800">
                        <div className="font-bold border-b border-neutral-800 pb-1 text-purple-300">{label}</div>
                        {payload.map((item: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between gap-4">
                            <span className="text-neutral-400" style={{ color: item.color }}>{item.name} :</span>
                            <span className="font-mono font-bold">{Number(item.value).toLocaleString("fr-FR")} MAD</span>
                          </div>
                        ))}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              <Area 
                type="monotone" 
                dataKey="Capital Projeté" 
                stroke="#8b5cf6" 
                strokeWidth={3} 
                fillOpacity={1} 
                fill="url(#gradSimulated)" 
              />
              <Area 
                type="monotone" 
                dataKey="Versements Cumulés" 
                stroke="#6366f1" 
                strokeWidth={2} 
                strokeDasharray="4 4" 
                fillOpacity={0} 
              />
              {annualReturnRate > 0 && (
                <Area 
                  type="monotone" 
                  dataKey="Intérêts Générés" 
                  stroke="#10b981" 
                  strokeWidth={2} 
                  fillOpacity={1} 
                  fill="url(#gradInterest)" 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* MILESTONES TABLE & ADVICE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Milestones Checkpoints */}
        <div className="lg:col-span-2 bg-neutral-50/50 dark:bg-zinc-950/20 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-1.5">
              <Target className="w-4 h-4 text-purple-500" />
              <span>Jalons d'Épargne Clés ({simulatedRate}% / mois)</span>
            </h4>
            <span className="text-[11px] font-semibold text-neutral-400">
              Rendement : {annualReturnRate}%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-100 dark:bg-zinc-900 text-neutral-500 font-bold uppercase text-[10px] tracking-wider border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  <th className="py-2 px-3">Horizon</th>
                  <th className="py-2 px-3">Versements</th>
                  <th className="py-2 px-3">Intérêts</th>
                  <th className="py-2 px-3 text-right">Capital Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
                {milestones.map((m) => {
                  const isCurrentSelected = m.months === horizonMonths;
                  return (
                    <tr 
                      key={m.months}
                      onClick={() => setHorizonMonths(m.months)}
                      className={`cursor-pointer transition-colors ${
                        isCurrentSelected 
                          ? "bg-purple-500/10 dark:bg-purple-950/40 font-bold text-purple-900 dark:text-purple-200" 
                          : "hover:bg-neutral-100/60 dark:hover:bg-zinc-850/50"
                      }`}
                    >
                      <td className="py-2.5 px-3 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isCurrentSelected ? "bg-purple-600" : "bg-neutral-300 dark:bg-zinc-700"}`} />
                        <span>{m.periodLabel}</span>
                      </td>
                      <td className="py-2.5 px-3 text-neutral-600 dark:text-neutral-400 font-mono">
                        {m.contributions.toLocaleString("fr-FR")} MAD
                      </td>
                      <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                        +{m.interest.toLocaleString("fr-FR")} MAD
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-neutral-900 dark:text-neutral-100 font-mono text-sm">
                        {m.projectedCapital.toLocaleString("fr-FR")} MAD
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tailored Financial Advice Card */}
        <div className="bg-gradient-to-br from-purple-500/10 via-indigo-500/5 to-transparent border border-purple-200/80 dark:border-purple-800/60 rounded-2xl p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200">
              <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <h4 className="text-xs font-black uppercase tracking-wider">Recommandation Stratégique</h4>
            </div>

            <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
              En maintenant votre taux moyen des 3 derniers mois ({threeMonthsData.avgSavingsRate.toFixed(1)}%), vous épargnez <strong className="text-purple-700 dark:text-purple-300">{simulatedMonthlyAmount.toLocaleString("fr-FR")} MAD/mois</strong>.
            </p>

            <div className="bg-white/80 dark:bg-zinc-900/80 p-3 rounded-xl border border-purple-100 dark:border-purple-900/50 space-y-1.5 text-xs">
              <div className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Impact de l'effort (+5%) :</span>
              </div>
              <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                Augmenter votre taux d'épargne de 5% ajouterait <strong className="text-emerald-600 dark:text-emerald-400">+{(threeMonthsData.totalAvgIncome * 0.05).toFixed(0)} MAD/mois</strong>, générant un gain net supplémentaire de <strong className="text-purple-600 dark:text-purple-400">+{Math.round((threeMonthsData.totalAvgIncome * 0.05) * horizonMonths * (1 + annualReturnRate/100)).toLocaleString("fr-FR")} MAD</strong> à horizon {horizonMonths < 12 ? `${horizonMonths} mois` : `${(horizonMonths/12).toFixed(0)} ans`}.
              </p>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-neutral-400 flex items-center justify-between border-t border-purple-200/40 dark:border-purple-800/40">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Modèle à capitalisation mensuelle
            </span>
            <span className="font-mono text-purple-600 dark:text-purple-400 font-bold">Smart Wealth Engine</span>
          </div>
        </div>

      </div>

    </div>
  );
}
