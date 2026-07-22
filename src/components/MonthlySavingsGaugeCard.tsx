import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import CountUpNumber from "./CountUpNumber";
import { 
  PiggyBank, 
  Target, 
  TrendingUp, 
  HelpCircle, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  TrendingDown,
  Info
} from "lucide-react";
import { FinanceTransaction, Abonnement, FinanceSalaire } from "../types";

interface MonthlySavingsGaugeCardProps {
  transactions: FinanceTransaction[];
  abonnements: Abonnement[];
  salaires?: FinanceSalaire[];
}

export default function MonthlySavingsGaugeCard({
  transactions = [],
  abonnements = [],
  salaires = []
}: MonthlySavingsGaugeCardProps) {
  // Current month of analysis (July 2026 is the reference default)
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-07");
  
  // Savings target state (in MAD), loaded from and persisted to localStorage
  const [savingsGoal, setSavingsGoal] = useState<number>(() => {
    const saved = localStorage.getItem("la_monthly_savings_goal");
    return saved ? Number(saved) : 5000; // Default to 5,000 MAD
  });

  // Save changes to savings target
  useEffect(() => {
    localStorage.setItem("la_monthly_savings_goal", String(savingsGoal));
  }, [savingsGoal]);

  // Months lists based on existing transactions
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

  // Compute stats for selected month
  const stats = useMemo(() => {
    // 1. Revenues (Salaries + Other revenues)
    let salaryAmount = 0;
    const salariesInMonth = salaires.filter(s => s.date && s.date.startsWith(selectedMonth));
    if (salariesInMonth.length > 0) {
      salaryAmount = salariesInMonth.reduce((sum, s) => sum + s.netAmount, 0);
    } else if (selectedMonth === "2026-07") {
      salaryAmount = 35000; // Default fallback for Jul 2026
    }

    const otherRevenues = transactions.filter(t => 
      t.type === "Revenue" && 
      t.date && 
      t.date.startsWith(selectedMonth) &&
      !t.description?.toLowerCase().includes("salaire") &&
      !t.description?.toLowerCase().includes("salary")
    ).reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = salaryAmount + otherRevenues;

    // 2. Subscriptions
    const activeSubs = abonnements.filter(a => a.status === "Actif");
    const totalSubsCost = activeSubs.reduce((sum, a) => {
      return sum + (a.billingPeriod === "Annuel" ? (a.costMonthly / 12) : a.costMonthly);
    }, 0);

    // 3. Transactions Dépenses
    const totalExpenses = transactions.filter(t => 
      t.type === "Dépense" && 
      t.date && 
      t.date.startsWith(selectedMonth)
    ).reduce((sum, t) => sum + t.amount, 0);

    // 4. Net Savings computed (Reste après toutes dépenses)
    const totalOutflow = totalSubsCost + totalExpenses;
    const netSavings = totalIncome - totalOutflow;

    // 5. Completion Rate of Savings Target
    const progressPercent = savingsGoal > 0 ? Math.round((netSavings / savingsGoal) * 100) : 0;
    const cappedProgressPercent = Math.min(100, Math.max(0, progressPercent));

    // Remaining savings needed
    const remainingToSave = Math.max(0, savingsGoal - netSavings);

    return {
      totalIncome,
      totalOutflow,
      netSavings,
      progressPercent,
      cappedProgressPercent,
      remainingToSave,
    };
  }, [selectedMonth, transactions, abonnements, salaires, savingsGoal]);

  // Tailor beautiful visual status comments & styling based on completion percentage
  const gaugeConfig = useMemo(() => {
    const pct = stats.progressPercent;
    if (pct >= 100) {
      return {
        colorClass: "text-emerald-600 dark:text-emerald-400",
        strokeClass: "stroke-emerald-500 dark:stroke-emerald-400",
        bgClass: "bg-emerald-50/50 dark:bg-emerald-950/25 border-emerald-200/60 dark:border-emerald-900/40",
        badge: "Cible Atteinte !",
        comment: "Félicitations ! Objectif d'épargne d'élite accompli à 100%. Votre discipline financière est exemplaire.",
        icon: <Sparkles className="w-4 h-4 text-emerald-500 animate-pulse" />
      };
    } else if (pct >= 75) {
      return {
        colorClass: "text-indigo-600 dark:text-indigo-400",
        strokeClass: "stroke-indigo-500 dark:stroke-indigo-400",
        bgClass: "bg-indigo-50/50 dark:bg-indigo-950/25 border-indigo-200/60 dark:border-indigo-900/40",
        badge: "Presque Atteint",
        comment: "Excellent rythme ! Vous approchez de votre objectif mensuel. Continuez cet effort d'élite.",
        icon: <TrendingUp className="w-4 h-4 text-indigo-500" />
      };
    } else if (pct >= 40) {
      return {
        colorClass: "text-blue-600 dark:text-blue-400",
        strokeClass: "stroke-blue-500 dark:stroke-blue-400",
        bgClass: "bg-blue-50/50 dark:bg-blue-950/25 border-blue-200/60 dark:border-blue-900/40",
        badge: "En Bonne Voie",
        comment: "Progression saine. Vous avancez régulièrement vers votre objectif d'épargne.",
        icon: <CheckCircle2 className="w-4 h-4 text-blue-500" />
      };
    } else if (pct >= 0) {
      return {
        colorClass: "text-amber-600 dark:text-amber-400",
        strokeClass: "stroke-amber-500 dark:stroke-amber-400",
        bgClass: "bg-amber-50/50 dark:bg-amber-950/25 border-amber-200/60 dark:border-amber-900/40",
        badge: "En Progression",
        comment: "Début d'épargne amorcé. Essayez de limiter les dépenses non prioritaires pour accélérer le rythme.",
        icon: <AlertCircle className="w-4 h-4 text-amber-500" />
      };
    } else {
      return {
        colorClass: "text-rose-600 dark:text-rose-400",
        strokeClass: "stroke-rose-500 dark:stroke-rose-400",
        bgClass: "bg-rose-50/50 dark:bg-rose-950/25 border-rose-200/60 dark:border-rose-900/40",
        badge: "Effort Requis",
        comment: "Alerte : Vos dépenses dépassent vos revenus. Mettez en veille certains abonnements ou optimisez vos budgets.",
        icon: <TrendingDown className="w-4 h-4 text-rose-500" />
      };
    }
  }, [stats.progressPercent]);

  // Radius details for SVG circle path (Semi-circle or Gauge style)
  const radius = 55;
  const strokeWidth = 10;
  const circumference = radius * 2 * Math.PI;
  // A beautiful radial arch / semi-circle gauge (using 180 degrees)
  const dashArray = circumference;
  // Offsets for standard Gauge: we use a beautiful 3/4 circle (270 degrees) to feel premium
  const angleRange = 270;
  const strokeDasharray = `${(circumference * angleRange) / 360} ${circumference}`;
  const maxDashOffset = (circumference * angleRange) / 360;
  const strokeDashoffset = maxDashOffset - (maxDashOffset * Math.min(100, Math.max(0, stats.progressPercent))) / 100;

  return (
    <div 
      id="monthly-savings-gauge-card"
      className="bg-white dark:bg-zinc-950 border border-neutral-200/90 dark:border-neutral-800/80 rounded-3xl p-6 shadow-3xs space-y-6"
    >
      {/* Header with Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-900 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-neutral-950 dark:bg-zinc-800 text-white rounded-lg shadow-sm">
            <PiggyBank className="w-4 h-4 text-emerald-400" />
          </span>
          <div>
            <h3 className="text-sm font-black text-neutral-950 dark:text-white uppercase tracking-tight">
              Jauge d'Épargne Mensuelle
            </h3>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">
              Suivi en temps réel de votre taux de réalisation d'objectif d'épargne
            </p>
          </div>
        </div>

        {/* Month Selector */}
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="px-2.5 py-1.5 bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl text-xs font-bold cursor-pointer outline-none focus:ring-1 focus:ring-neutral-400 self-start sm:self-auto"
        >
          {availableMonths.map(m => {
            const date = new Date(m + "-02");
            const formatted = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
            return (
              <option key={m} value={m}>
                {formatted.charAt(0).toUpperCase() + formatted.slice(1)}
              </option>
            );
          })}
        </select>
      </div>

      {/* Main Grid: Gauge + Configuration & Information */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left column: SVG Arch Gauge (5 cols) */}
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 bg-neutral-50/50 dark:bg-zinc-900/20 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/60 text-center relative overflow-hidden">
          
          <div className="relative w-36 h-36 flex items-center justify-center mt-2">
            {/* SVG radial arch gauge (3/4 circle rotated to be centered) */}
            <svg className="w-full h-full transform rotate-[135deg]">
              {/* Background Arch */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className="stroke-neutral-100 dark:stroke-neutral-850"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeLinecap="round"
              />
              {/* Foreground Animated Arch */}
              <circle
                cx="72"
                cy="72"
                r={radius}
                className={`${gaugeConfig.strokeClass} transition-all duration-1000 ease-out`}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Content overlay */}
            <div className="absolute flex flex-col items-center justify-center pt-2">
              <span className={`text-3xl font-black font-mono leading-none ${gaugeConfig.colorClass}`}>
                <CountUpNumber value={stats.progressPercent} suffix="%" />
              </span>
              <span className="text-[9px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-1.5 flex items-center gap-1">
                Atteint
              </span>
            </div>
          </div>

          {/* Goal status comments */}
          <div className="mt-2 space-y-1">
            <span className={`inline-flex items-center gap-1 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider ${gaugeConfig.bgClass} border`}>
              {gaugeConfig.icon}
              {gaugeConfig.badge}
            </span>
          </div>

        </div>

        {/* Right column: Target Slider Config & Metrics (7 cols) */}
        <div className="md:col-span-7 space-y-5">
          
          {/* Target config slider */}
          <div className="p-4 bg-neutral-50/70 dark:bg-zinc-900/30 border border-neutral-200/60 dark:border-neutral-800 rounded-2xl space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-indigo-500" />
                Objectif d'Épargne Mensuel
              </span>
              <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-0.5 rounded-md border border-indigo-100/60 dark:border-indigo-900/40">
                <CountUpNumber value={savingsGoal} suffix=" MAD" />
              </span>
            </div>

            <input
              type="range"
              min="1000"
              max="20000"
              step="500"
              value={savingsGoal}
              onChange={(e) => setSavingsGoal(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1 bg-neutral-200 dark:bg-zinc-800 rounded-lg cursor-pointer"
            />
            
            <div className="flex justify-between text-[9px] text-neutral-400 font-bold">
              <span>1 000 MAD</span>
              <span>10 000 MAD</span>
              <span>20 000 MAD</span>
            </div>
          </div>

          {/* Numerical breakdown with mini visual indicator cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-neutral-50 dark:bg-zinc-900/20 border border-neutral-150 dark:border-neutral-850 rounded-xl">
              <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider block mb-1">Épargne Réalisée</span>
              <span className={`text-sm font-black font-mono block ${stats.netSavings >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                <CountUpNumber value={stats.netSavings} suffix=" MAD" />
              </span>
              <span className="text-[8.5px] text-neutral-400 block mt-0.5">Surplus de trésorerie net</span>
            </div>

            <div className="p-3 bg-neutral-50 dark:bg-zinc-900/20 border border-neutral-150 dark:border-neutral-850 rounded-xl">
              <span className="text-[9px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider block mb-1">Reste à Épargner</span>
              <span className="text-sm font-black font-mono text-neutral-800 dark:text-neutral-200 block">
                <CountUpNumber value={stats.remainingToSave} suffix=" MAD" />
              </span>
              <span className="text-[8.5px] text-neutral-400 block mt-0.5">Pour finaliser l'objectif</span>
            </div>
          </div>

          {/* Copilot Advice Commentary Card */}
          <div className={`p-3 border rounded-xl flex items-start gap-2.5 transition-all ${gaugeConfig.bgClass}`}>
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-neutral-500" />
            <p className="text-[11px] font-semibold leading-relaxed text-neutral-700 dark:text-neutral-300">
              {gaugeConfig.comment}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}
