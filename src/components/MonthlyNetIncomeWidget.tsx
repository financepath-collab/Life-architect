import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import CountUpNumber from "./CountUpNumber";
import { 
  Scale, 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  CreditCard, 
  Plus, 
  HelpCircle, 
  Calculator,
  Sliders,
  DollarSign,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Percent,
  CheckCircle2,
  PiggyBank
} from "lucide-react";
import { Account, FinanceBudget, Abonnement, FinanceTransaction, FinanceSalaire } from "../types";

interface MonthlyNetIncomeWidgetProps {
  budgets: FinanceBudget[];
  abonnements: Abonnement[];
  transactions: FinanceTransaction[];
  salaires?: FinanceSalaire[];
}

export default function MonthlyNetIncomeWidget({
  budgets = [],
  abonnements = [],
  transactions = [],
  salaires = []
}: MonthlyNetIncomeWidgetProps) {
  // Current Month/Year for calculations (defaults to July 2026 as per other parts)
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-07");
  const [calculationMode, setCalculationMode] = useState<"actual" | "budget">("actual");
  
  // Interactive Simulation variables
  const [simulationEnabled, setSimulationEnabled] = useState<boolean>(false);
  const [simulatedRevenue, setSimulatedRevenue] = useState<number>(0);
  const [simulatedExpense, setSimulatedExpense] = useState<number>(0);

  // Savings Recommendation states
  const [selectedSuggestion, setSelectedSuggestion] = useState<"conservative" | "balanced" | "aggressive" | "custom">("balanced");
  const [customSavingsValue, setCustomSavingsValue] = useState<number>(0);

  const handleSelectPreset = (preset: "conservative" | "balanced" | "aggressive") => {
    setSelectedSuggestion(preset);
    if (savingsSuggestions) {
      setCustomSavingsValue(savingsSuggestions[preset]);
    }
  };

  // Synchronize customSavingsValue to default to balanced on month or simulator changes
  React.useEffect(() => {
    if (savingsSuggestions) {
      setCustomSavingsValue(savingsSuggestions.balanced);
      setSelectedSuggestion("balanced");
    }
  }, [selectedMonth, simulationEnabled, simulatedRevenue, simulatedExpense]);

  // Available months list based on transaction dates and current month
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>(["2026-07", "2026-06", "2026-05"]);
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

  // Compute Base Stats
  const stats = useMemo(() => {
    // 1. Calculate Monthly Revenue (Revenus)
    let salaryAmount = 0;
    let otherRevenueAmount = 0;

    // Filter received salaries for the selected month
    const salariesInMonth = salaires.filter(s => s.date && s.date.startsWith(selectedMonth));
    if (salariesInMonth.length > 0) {
      salaryAmount = salariesInMonth.reduce((sum, s) => sum + s.netAmount, 0);
    } else if (selectedMonth === "2026-07") {
      // High-quality fallback matching standard base state
      salaryAmount = 35000; 
    }

    // Filter other revenues from transactions
    const otherRevenuesInMonth = transactions.filter(t => 
      t.type === "Revenue" && 
      t.date && 
      t.date.startsWith(selectedMonth) &&
      !t.description?.toLowerCase().includes("salaire") &&
      !t.description?.toLowerCase().includes("salary")
    );
    otherRevenueAmount = otherRevenuesInMonth.reduce((sum, t) => sum + t.amount, 0);

    const baseTotalRevenue = salaryAmount + otherRevenueAmount;

    // 2. Calculate Subscriptions (Abonnements Mensuels)
    // Subscriptions are typically general monthly recurring, but we can filter active ones
    const activeSubscribers = abonnements.filter(a => a.status === "Actif");
    const totalSubscriptionsCost = activeSubscribers.reduce((sum, a) => {
      if (a.billingPeriod === "Annuel") {
        return sum + (a.costMonthly / 12);
      }
      return sum + a.costMonthly;
    }, 0);

    // 3. Calculate Monthly Costs (Actual Expenses vs Budget limits)
    // Actual expenses (Dépenses)
    const expensesInMonth = transactions.filter(t => 
      t.type === "Dépense" && 
      t.date && 
      t.date.startsWith(selectedMonth)
    );
    const totalActualExpenses = expensesInMonth.reduce((sum, t) => sum + t.amount, 0);

    // Budget limits
    const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limitAmount, 0);

    // Apply Simulation values if enabled
    const finalTotalRevenue = baseTotalRevenue + (simulationEnabled ? simulatedRevenue : 0);
    const calculatedExpenses = calculationMode === "actual" 
      ? totalActualExpenses 
      : totalBudgetLimit;
    
    const finalCalculatedExpenses = calculatedExpenses + (simulationEnabled ? simulatedExpense : 0);

    // Monthly Net Income calculation
    const netIncome = finalTotalRevenue - totalSubscriptionsCost - finalCalculatedExpenses;

    // Net Savings Rate (Taux d'épargne net)
    const savingsRate = finalTotalRevenue > 0 ? (netIncome / finalTotalRevenue) * 100 : 0;

    return {
      salaryAmount,
      otherRevenueAmount,
      totalRevenue: finalTotalRevenue,
      baseTotalRevenue,
      totalSubscriptionsCost,
      actualExpenses: totalActualExpenses,
      budgetLimit: totalBudgetLimit,
      totalExpenses: finalCalculatedExpenses,
      netIncome,
      savingsRate,
      activeSubsCount: activeSubscribers.length,
    };
  }, [selectedMonth, budgets, abonnements, transactions, salaires, calculationMode, simulationEnabled, simulatedRevenue, simulatedExpense]);

  // Savings Suggestions based on net surplus
  const savingsSuggestions = useMemo(() => {
    const surplus = stats.netIncome;
    if (surplus <= 0) return null;

    const conservative = Math.round(surplus * 0.30);
    const balanced = Math.round(surplus * 0.50);
    const aggressive = Math.round(surplus * 0.80);

    // Rule of thumb target (20% of total revenue)
    const ruleOfThumbTarget = Math.round(stats.totalRevenue * 0.20);

    return {
      surplus,
      conservative,
      balanced,
      aggressive,
      ruleOfThumbTarget,
    };
  }, [stats.netIncome, stats.totalRevenue]);

  // Synchronize manual custom value when suggestion changes or is initialized
  const currentSavingsAmount = useMemo(() => {
    if (!savingsSuggestions) return 0;
    if (selectedSuggestion === "custom") {
      return customSavingsValue;
    }
    return savingsSuggestions[selectedSuggestion] || 0;
  }, [selectedSuggestion, customSavingsValue, savingsSuggestions]);

  // Visual Styling configuration based on savings rate
  const rateConfig = useMemo(() => {
    const rate = stats.savingsRate;
    if (rate >= 40) {
      return {
        colorClass: "text-emerald-600 dark:text-emerald-400",
        bgClass: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/40",
        strokeClass: "stroke-emerald-500",
        comment: "Excellent ! Votre taux d'épargne est très élevé. Vous optimisez parfaitement vos finances.",
        badge: "Épargne Élite"
      };
    } else if (rate >= 20) {
      return {
        colorClass: "text-indigo-600 dark:text-indigo-400",
        bgClass: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-200 dark:border-indigo-900/40",
        strokeClass: "stroke-indigo-500",
        comment: "Sain ! Vous respectez la règle d'or des 20% d'épargne mensuelle.",
        badge: "Épargne Saine"
      };
    } else if (rate >= 0) {
      return {
        colorClass: "text-amber-600 dark:text-amber-400",
        bgClass: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-900/40",
        strokeClass: "stroke-amber-500",
        comment: "Vigilance. Votre reste à vivre est limité. Essayez de réduire les dépenses discrétionnaires.",
        badge: "Équilibre Fragile"
      };
    } else {
      return {
        colorClass: "text-red-600 dark:text-red-400",
        bgClass: "bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/40",
        strokeClass: "stroke-red-500",
        comment: "Déficit ! Vos dépenses et abonnements dépassent vos revenus mensuels.",
        badge: "Budget en Déficit"
      };
    }
  }, [stats.savingsRate]);

  return (
    <div 
      id="monthly-net-income-widget" 
      className="bg-white dark:bg-zinc-950 border border-neutral-200/90 dark:border-neutral-800/80 rounded-3xl p-6 shadow-3xs space-y-6"
    >
      {/* Header section with month picker and calculations mode */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-900 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-neutral-900 dark:bg-zinc-800 text-white rounded-lg shadow-sm">
            <Scale className="w-4 h-4 text-emerald-400" />
          </span>
          <div>
            <h3 className="text-sm font-black text-neutral-950 dark:text-white uppercase tracking-tight">
              Calculateur de Revenu Net Mensuel
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
              Analyse automatique de vos flux financiers réels et simulés
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Month Selector */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-2.5 py-1.5 bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs font-bold cursor-pointer outline-none focus:ring-1 focus:ring-neutral-400"
          >
            {availableMonths.map(m => {
              const date = new Date(m + "-02"); // avoid timezone shift
              const formatted = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
              return (
                <option key={m} value={m}>
                  {formatted.charAt(0).toUpperCase() + formatted.slice(1)}
                </option>
              );
            })}
          </select>

          {/* Toggle Calculation Mode */}
          <div className="flex bg-neutral-100 dark:bg-zinc-900 p-0.5 rounded-xl border border-neutral-200/50 dark:border-neutral-800">
            <button
              onClick={() => setCalculationMode("actual")}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                calculationMode === "actual"
                  ? "bg-white dark:bg-zinc-800 text-neutral-900 dark:text-white shadow-3xs"
                  : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
              }`}
            >
              Réel (Transactions)
            </button>
            <button
              onClick={() => setCalculationMode("budget")}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                calculationMode === "budget"
                  ? "bg-white dark:bg-zinc-800 text-neutral-900 dark:text-white shadow-3xs"
                  : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
              }`}
            >
              Budgétisé (Limites)
            </button>
          </div>

          {/* Toggle Simulator */}
          <button
            onClick={() => {
              setSimulationEnabled(!simulationEnabled);
              if (!simulationEnabled) {
                setSimulatedRevenue(0);
                setSimulatedExpense(0);
              }
            }}
            className={`px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-wider flex items-center gap-1 transition-all cursor-pointer ${
              simulationEnabled 
                ? "bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/40 dark:border-indigo-900/50 dark:text-indigo-400 font-extrabold" 
                : "bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-500 dark:bg-zinc-950 dark:border-neutral-800"
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Simulateur</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Visual Gauge + Statistics breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        
        {/* visual circular/radial gauge (4 cols) */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 bg-neutral-50/50 dark:bg-zinc-900/20 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/60 text-center">
          <div className="relative w-32 h-32 flex items-center justify-center">
            {/* SVG circle meter representing net savings rate */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="52"
                className="stroke-neutral-100 dark:stroke-neutral-800"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="64"
                cy="64"
                r="52"
                className={`${rateConfig.strokeClass} transition-all duration-700 ease-out`}
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={326.72}
                strokeDashoffset={326.72 - (326.72 * Math.min(100, Math.max(0, stats.savingsRate))) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className={`text-2xl font-black font-mono leading-none ${rateConfig.colorClass}`}>
                <CountUpNumber value={stats.savingsRate} decimals={0} suffix="%" />
              </span>
              <span className="text-[8px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-1">
                Taux Épargne
              </span>
            </div>
          </div>

          <div className="mt-4 space-y-1">
            <span className={`inline-block text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${rateConfig.bgClass} border`}>
              {rateConfig.badge}
            </span>
            <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-mono block mt-1">
              Reste net : <CountUpNumber value={stats.netIncome} suffix=" MAD" />
            </span>
          </div>
        </div>

        {/* Detailed Breakdown with progress rows (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* CARD 1: REVENUS */}
            <div className="p-4 bg-emerald-50/20 dark:bg-emerald-950/10 border border-emerald-100/50 dark:border-emerald-900/30 rounded-2xl">
              <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block mb-1">
                Revenus Totaux
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-emerald-700 dark:text-emerald-300 font-mono">
                  <CountUpNumber value={stats.totalRevenue} />
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">MAD</span>
              </div>
              <div className="mt-2 text-[9px] text-neutral-500 dark:text-neutral-400 space-y-0.5">
                <div className="flex justify-between">
                  <span>Salaire Net:</span>
                  <span className="font-mono font-bold">
                    <CountUpNumber value={stats.salaryAmount} suffix=" MAD" />
                  </span>
                </div>
                {stats.otherRevenueAmount > 0 && (
                  <div className="flex justify-between">
                    <span>Extras:</span>
                    <span className="font-mono font-bold">
                      <CountUpNumber value={stats.otherRevenueAmount} prefix="+" suffix=" MAD" />
                    </span>
                  </div>
                )}
                {simulationEnabled && simulatedRevenue > 0 && (
                  <div className="flex justify-between text-indigo-600 dark:text-indigo-400 font-bold">
                    <span>Simulé:</span>
                    <span className="font-mono font-extrabold">
                      <CountUpNumber value={simulatedRevenue} prefix="+" suffix=" MAD" />
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* CARD 2: ABONNEMENTS */}
            <div className="p-4 bg-indigo-50/20 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl">
              <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                Abonnements SaaS
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-indigo-700 dark:text-indigo-300 font-mono">
                  <CountUpNumber value={stats.totalSubscriptionsCost} />
                </span>
                <span className="text-[10px] text-indigo-600 font-bold">MAD/m</span>
              </div>
              <div className="mt-2 text-[9px] text-neutral-500 dark:text-neutral-400 space-y-0.5">
                <div className="flex justify-between">
                  <span>Services actifs:</span>
                  <span className="font-bold">{stats.activeSubsCount}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pression budgétaire:</span>
                  <span className="font-mono text-neutral-600 dark:text-neutral-400">
                    <CountUpNumber value={stats.totalRevenue > 0 ? (stats.totalSubscriptionsCost / stats.totalRevenue) * 100 : 0} decimals={1} suffix="%" />
                  </span>
                </div>
              </div>
            </div>

            {/* CARD 3: AUTRES COÛTS / DEPENSES */}
            <div className="p-4 bg-neutral-50 dark:bg-zinc-900/30 border border-neutral-200/50 dark:border-neutral-800/80 rounded-2xl">
              <span className="text-[9px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block mb-1">
                {calculationMode === "actual" ? "Dépenses Réelles" : "Limites Budgets"}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-lg font-black text-neutral-800 dark:text-neutral-200 font-mono">
                  <CountUpNumber value={stats.totalExpenses} />
                </span>
                <span className="text-[10px] text-neutral-500 font-bold">MAD</span>
              </div>
              <div className="mt-2 text-[9px] text-neutral-500 dark:text-neutral-400 space-y-0.5">
                <div className="flex justify-between">
                  <span>Base calculée:</span>
                  <span className="font-mono font-bold">
                    <CountUpNumber value={calculationMode === "actual" ? stats.actualExpenses : stats.budgetLimit} suffix=" MAD" />
                  </span>
                </div>
                {simulationEnabled && simulatedExpense > 0 && (
                  <div className="flex justify-between text-indigo-600 dark:text-indigo-400 font-bold">
                    <span>Simulé:</span>
                    <span className="font-mono font-extrabold">
                      <CountUpNumber value={simulatedExpense} prefix="+" suffix=" MAD" />
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Horizontal Net Income Flow Progress Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-[10px] font-black uppercase tracking-wider">
              <span className="text-neutral-400 dark:text-neutral-500">Flux d'affectation des revenus</span>
              <span className={rateConfig.colorClass}>
                Net : <CountUpNumber value={stats.netIncome} suffix=" MAD" />
              </span>
            </div>
            
            <div className="relative w-full bg-neutral-100 dark:bg-zinc-900 h-3 rounded-full overflow-hidden p-[1px] border border-neutral-200/40 dark:border-neutral-800">
              {/* 1. Subscriptions bar (Indigo) */}
              <div 
                className="absolute left-0 top-0 h-full bg-indigo-500 transition-all duration-300 z-10" 
                style={{ width: `${Math.min(100, (stats.totalSubscriptionsCost / Math.max(1, stats.totalRevenue)) * 100)}%` }}
                title={`Abonnements : ${stats.totalSubscriptionsCost.toFixed(0)} MAD`}
              />
              {/* 2. Budgets/Expenses bar (Slate/Neutral) */}
              <div 
                className="absolute top-0 h-full bg-neutral-700 dark:bg-neutral-500 transition-all duration-300 z-5"
                style={{ 
                  left: `${Math.min(100, (stats.totalSubscriptionsCost / Math.max(1, stats.totalRevenue)) * 100)}%`,
                  width: `${Math.min(100 - (stats.totalSubscriptionsCost / Math.max(1, stats.totalRevenue)) * 100, (stats.totalExpenses / Math.max(1, stats.totalRevenue)) * 100)}%`
                }}
                title={`Coûts : ${stats.totalExpenses.toFixed(0)} MAD`}
              />
              {/* 3. Net Savings bar (Emerald - positive savings) */}
              {stats.netIncome > 0 && (
                <div 
                  className="absolute top-0 h-full bg-emerald-500 transition-all duration-300 z-1 animate-pulse"
                  style={{ 
                    left: `${Math.min(100, ((stats.totalSubscriptionsCost + stats.totalExpenses) / Math.max(1, stats.totalRevenue)) * 100)}%`,
                    width: `${Math.min(100 - ((stats.totalSubscriptionsCost + stats.totalExpenses) / Math.max(1, stats.totalRevenue)) * 100, (stats.netIncome / Math.max(1, stats.totalRevenue)) * 100)}%`
                  }}
                  title={`Épargne Nette : ${stats.netIncome.toFixed(0)} MAD`}
                />
              )}
            </div>
            
            {/* Labels for progress bar */}
            <div className="flex items-center gap-3 text-[9px] text-neutral-400 dark:text-neutral-500 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-500" /> Abonnements ({stats.totalRevenue > 0 ? ((stats.totalSubscriptionsCost / stats.totalRevenue) * 100).toFixed(0) : 0}%)
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-neutral-700 dark:bg-neutral-500" /> Autres Coûts ({stats.totalRevenue > 0 ? ((stats.totalExpenses / stats.totalRevenue) * 100).toFixed(0) : 0}%)
              </span>
              {stats.netIncome > 0 && (
                <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" /> Revenu Net / Épargne ({stats.savingsRate.toFixed(0)}%)
                </span>
              )}
            </div>
          </div>

          {/* Advice card based on results */}
          <div className={`p-3 border rounded-xl transition-all ${rateConfig.bgClass}`}>
            <p className="text-[11px] font-medium leading-relaxed text-neutral-700 dark:text-neutral-300">
              {rateConfig.comment}
            </p>
          </div>

          {/* Interactive Recommended Savings Suggestions */}
          {savingsSuggestions ? (
            <div className="p-4 bg-neutral-50 dark:bg-zinc-900/20 border border-neutral-200/50 dark:border-neutral-800 rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg">
                  <PiggyBank className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                </span>
                <div>
                  <h4 className="text-xs font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
                    Allocation d'Épargne Recommandée
                  </h4>
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500">
                    Optimisez votre surplus disponible de <span className="font-mono font-bold text-neutral-600 dark:text-neutral-300">{savingsSuggestions.surplus.toLocaleString("fr-FR")} MAD</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Conservative option */}
                <button
                  type="button"
                  onClick={() => handleSelectPreset("conservative")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedSuggestion === "conservative"
                      ? "bg-indigo-50/50 border-indigo-300 dark:bg-indigo-950/20 dark:border-indigo-800/80"
                      : "bg-white hover:bg-neutral-50/50 dark:bg-zinc-950 dark:border-neutral-850 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black uppercase text-neutral-400 dark:text-neutral-500">Prudent (30%)</span>
                    {selectedSuggestion === "conservative" && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />}
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200 font-mono">
                      {savingsSuggestions.conservative.toLocaleString("fr-FR")}
                    </span>
                    <span className="text-[9px] text-neutral-400 font-bold">MAD</span>
                  </div>
                  <span className="text-[9px] text-neutral-400 dark:text-neutral-500 block mt-1 leading-none">Sécurité & Plaisirs</span>
                </button>

                {/* Balanced option */}
                <button
                  type="button"
                  onClick={() => handleSelectPreset("balanced")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedSuggestion === "balanced"
                      ? "bg-indigo-50/50 border-indigo-300 dark:bg-indigo-950/20 dark:border-indigo-800/80"
                      : "bg-white hover:bg-neutral-50/50 dark:bg-zinc-950 dark:border-neutral-850 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black uppercase text-neutral-400 dark:text-neutral-500">Équilibré (50%)</span>
                    {selectedSuggestion === "balanced" && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />}
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200 font-mono">
                      {savingsSuggestions.balanced.toLocaleString("fr-FR")}
                    </span>
                    <span className="text-[9px] text-neutral-400 font-bold">MAD</span>
                  </div>
                  <span className="text-[9px] text-neutral-400 dark:text-neutral-500 block mt-1 leading-none">Recommandation d'Or</span>
                </button>

                {/* Aggressive option */}
                <button
                  type="button"
                  onClick={() => handleSelectPreset("aggressive")}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedSuggestion === "aggressive"
                      ? "bg-indigo-50/50 border-indigo-300 dark:bg-indigo-950/20 dark:border-indigo-800/80"
                      : "bg-white hover:bg-neutral-50/50 dark:bg-zinc-950 dark:border-neutral-850 hover:border-neutral-300"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-black uppercase text-neutral-400 dark:text-neutral-500">Audacieux (80%)</span>
                    {selectedSuggestion === "aggressive" && <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" />}
                  </div>
                  <div className="mt-1 flex items-baseline gap-1">
                    <span className="text-sm font-extrabold text-neutral-800 dark:text-neutral-200 font-mono">
                      {savingsSuggestions.aggressive.toLocaleString("fr-FR")}
                    </span>
                    <span className="text-[9px] text-neutral-400 font-bold">MAD</span>
                  </div>
                  <span className="text-[9px] text-neutral-400 dark:text-neutral-500 block mt-1 leading-none">Indépendance Rapide</span>
                </button>
              </div>

              {/* Slider manually adjustment */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-center text-[10px]">
                  <span className="font-bold text-neutral-600 dark:text-neutral-400">Ajuster l'épargne manuellement :</span>
                  <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2 py-0.5 rounded border border-indigo-100 dark:border-indigo-900/40">
                    {customSavingsValue.toLocaleString("fr-FR")} MAD ({savingsSuggestions.surplus > 0 ? ((customSavingsValue / savingsSuggestions.surplus) * 100).toFixed(0) : 0}%)
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={savingsSuggestions.surplus}
                  step={Math.max(10, Math.round(savingsSuggestions.surplus / 50))}
                  value={customSavingsValue}
                  onChange={(e) => {
                    setCustomSavingsValue(Number(e.target.value));
                    setSelectedSuggestion("custom");
                  }}
                  className="w-full accent-indigo-500 h-1 bg-neutral-200 dark:bg-zinc-850 rounded-lg cursor-pointer animate-in fade-in duration-200"
                />
              </div>

              {/* Simulation Result Details */}
              <div className="p-3 bg-white dark:bg-zinc-950 rounded-xl border border-neutral-200/50 dark:border-neutral-850 flex flex-col md:flex-row justify-between items-start md:items-center gap-3 text-[11px] leading-relaxed">
                <div>
                  <span className="font-extrabold text-neutral-800 dark:text-neutral-200 block">
                    Projection d'impact :
                  </span>
                  <p className="text-neutral-400 dark:text-neutral-500 mt-0.5">
                    En épargnant <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">{currentSavingsAmount.toLocaleString("fr-FR")} MAD</span>, votre reste à vivre discrétionnaire est de <span className="font-mono font-black text-neutral-700 dark:text-neutral-200">{(savingsSuggestions.surplus - currentSavingsAmount).toLocaleString("fr-FR")} MAD</span>.
                  </p>
                </div>
                <div className="text-[10px] p-2 bg-neutral-50 dark:bg-zinc-900/40 rounded-lg border border-neutral-150 dark:border-neutral-850 text-neutral-500 dark:text-neutral-400 shrink-0">
                  {currentSavingsAmount >= savingsSuggestions.ruleOfThumbTarget ? (
                    <span className="text-emerald-600 dark:text-emerald-400 font-extrabold flex items-center gap-1.5 justify-end">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                      Objectif d'épargne globale (20%) atteint !
                    </span>
                  ) : (
                    <span>Cible idéale de 20% d'épargne globale : <strong className="font-mono">{savingsSuggestions.ruleOfThumbTarget.toLocaleString("fr-FR")} MAD</strong></span>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-rose-50/30 dark:bg-rose-950/10 border border-rose-100/40 dark:border-rose-900/20 rounded-2xl flex items-start gap-2.5">
              <span className="p-1 bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-md">
                <AlertTriangle className="w-3.5 h-3.5" />
              </span>
              <div>
                <h4 className="text-xs font-black text-rose-800 dark:text-rose-400 uppercase tracking-tight">
                  Aucun surplus disponible pour l'épargne
                </h4>
                <p className="text-[10px] text-rose-600/80 dark:text-rose-400/70 leading-relaxed mt-0.5">
                  Vos dépenses fixes et vos abonnements dépassent ou égalent vos revenus ce mois-ci. Concentrez-vous sur la réduction des coûts variables ou la suspension de certains abonnements SaaS pour retrouver une marge positive.
                </p>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Interactive Simulation Sliders Drawer */}
      <AnimatePresence>
        {simulationEnabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-neutral-100 dark:border-neutral-900 pt-4"
          >
            <div className="p-4 bg-indigo-50/10 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-indigo-700 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                  <Sliders className="w-3.5 h-3.5" />
                  Simulateur de Budget & Reste à Vivre
                </span>
                <button
                  onClick={() => {
                    setSimulatedRevenue(0);
                    setSimulatedExpense(0);
                  }}
                  className="text-[9px] font-bold text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 underline cursor-pointer"
                >
                  Réinitialiser
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Slider 1: Simulated Revenue */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-neutral-700 dark:text-neutral-300">Revenu mensuel additionnel</span>
                    <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                      +{simulatedRevenue.toLocaleString("fr-FR")} MAD
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50000"
                    step="500"
                    value={simulatedRevenue}
                    onChange={(e) => setSimulatedRevenue(Number(e.target.value))}
                    className="w-full accent-emerald-500 h-1 bg-neutral-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-neutral-400">
                    <span>0 MAD</span>
                    <span>50 000 MAD</span>
                  </div>
                </div>

                {/* Slider 2: Simulated Expense */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-neutral-700 dark:text-neutral-300">Dépenses ou coûts additionnels</span>
                    <span className="font-mono font-black text-rose-600 dark:text-rose-400">
                      +{simulatedExpense.toLocaleString("fr-FR")} MAD
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30000"
                    step="250"
                    value={simulatedExpense}
                    onChange={(e) => setSimulatedExpense(Number(e.target.value))}
                    className="w-full accent-rose-500 h-1 bg-neutral-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[9px] text-neutral-400">
                    <span>0 MAD</span>
                    <span>30 000 MAD</span>
                  </div>
                </div>
              </div>

              {/* Simulation Result Banner */}
              <div className="p-3 bg-white dark:bg-zinc-950 border border-indigo-150/40 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs leading-relaxed">
                <div>
                  <span className="font-extrabold text-neutral-800 dark:text-neutral-200 block">Résultat de la simulation :</span>
                  <span className="text-neutral-500 dark:text-neutral-400 text-[11px]">
                    Impact direct : {simulatedRevenue >= simulatedExpense ? "+" : ""}
                    {(simulatedRevenue - simulatedExpense).toLocaleString("fr-FR")} MAD sur votre reste à vivre.
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-neutral-400 text-[10px]">Nouveau Revenu Net:</span>
                  <span className={`font-mono font-black text-sm ${stats.netIncome >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                    {stats.netIncome.toLocaleString("fr-FR")} MAD
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
