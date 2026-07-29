import React, { useState, useMemo, useEffect } from "react";
import { 
  PiggyBank, 
  TrendingUp, 
  Coins, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Info,
  RefreshCw,
  Wallet,
  Landmark,
  Table,
  CheckCircle2,
  Sparkles,
  Award,
  Layers,
  ChevronDown,
  ChevronUp,
  Sliders,
  DollarSign,
  Percent,
  TrendingDown,
  Gauge,
  Flame,
  ArrowUpRight,
  PieChart as PieChartIcon
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceLine,
  LineChart,
  Line,
  Legend,
  ComposedChart,
  ReferenceDot,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { StockEntry, FinanceEpargne, Account, FinanceSalaire, FinanceTransaction, FinanceBudget } from "../types";

export interface FireCalculatorProps {
  stocks?: StockEntry[];
  epargnes?: FinanceEpargne[];
  accounts?: Account[];
  salaires?: FinanceSalaire[];
  transactions?: FinanceTransaction[];
  budgets?: FinanceBudget[];
  triggerToast?: (title: string, message: string, type?: "success" | "warning" | "info") => void;
}

export default function FireCalculator({
  stocks = [],
  epargnes = [],
  accounts = [],
  salaires = [],
  transactions = [],
  budgets = [],
  triggerToast
}: FireCalculatorProps) {

  // --- 1. COMPUTE REAL PORTFOLIO & CASHFLOW DATA FROM APP ---
  const stockWorth = useMemo(() => {
    return stocks.reduce((acc, s) => {
      const price = s.currentPrice || s.buyPrice || 0;
      return acc + (price * (s.quantity || 0));
    }, 0);
  }, [stocks]);

  const epargneWorth = useMemo(() => {
    return epargnes.reduce((acc, e) => acc + (e.currentAmount || 0), 0);
  }, [epargnes]);

  const accountWorth = useMemo(() => {
    return accounts.reduce((acc, a) => acc + (a.balance || 0), 0);
  }, [accounts]);

  const realTotalCapital = useMemo(() => {
    return stockWorth + epargneWorth + accountWorth;
  }, [stockWorth, epargneWorth, accountWorth]);

  const realMonthlyIncome = useMemo(() => {
    const totalSalaires = salaires.reduce((acc, s) => acc + (s.netAmount || 0), 0);
    if (totalSalaires > 0) return totalSalaires;
    
    const totalRev = transactions
      .filter(t => t.type === "Revenue" || t.type === "Revenu")
      .reduce((acc, t) => acc + (t.amount || 0), 0);
    return totalRev > 0 ? totalRev : 15000;
  }, [salaires, transactions]);

  const realMonthlyExpenses = useMemo(() => {
    const totalBudgets = budgets.reduce((acc, b) => acc + (b.limitAmount || 0), 0);
    if (totalBudgets > 0) return totalBudgets;

    const totalDep = transactions
      .filter(t => t.type === "Dépense")
      .reduce((acc, t) => acc + (t.amount || 0), 0);
    return totalDep > 0 ? totalDep : 8000;
  }, [budgets, transactions]);

  const realMonthlySavings = useMemo(() => {
    return Math.max(0, realMonthlyIncome - realMonthlyExpenses);
  }, [realMonthlyIncome, realMonthlyExpenses]);

  // --- 2. STATE WITH PERSISTENCE ---
  const [currentAge, setCurrentAge] = useState<number>(() => {
    const saved = localStorage.getItem("mp_fire_age");
    return saved ? Number(saved) : 28;
  });

  const [startingCapital, setStartingCapital] = useState<number>(() => {
    const saved = localStorage.getItem("mp_fire_capital");
    if (saved) return Number(saved);
    return realTotalCapital > 0 ? realTotalCapital : 100000;
  });

  const [monthlySavings, setMonthlySavings] = useState<number>(() => {
    const saved = localStorage.getItem("mp_fire_savings");
    if (saved) return Number(saved);
    return realMonthlySavings > 0 ? realMonthlySavings : 5000;
  });

  const [annualSavingsGrowth, setAnnualSavingsGrowth] = useState<number>(() => {
    const saved = localStorage.getItem("mp_fire_savings_growth");
    return saved ? Number(saved) : 0;
  });

  const [targetRente, setTargetRente] = useState<number>(() => {
    const saved = localStorage.getItem("mp_fire_rente");
    if (saved) return Number(saved);
    return realMonthlyExpenses > 0 ? realMonthlyExpenses : 15000;
  });

  const [annualReturnRate, setAnnualReturnRate] = useState<number>(() => {
    const saved = localStorage.getItem("mp_fire_return");
    return saved ? Number(saved) : 7;
  });

  const [withdrawalRate, setWithdrawalRate] = useState<number>(() => {
    const saved = localStorage.getItem("mp_fire_swr");
    return saved ? Number(saved) : 4;
  });

  const [inflationRate, setInflationRate] = useState<number>(() => {
    const saved = localStorage.getItem("mp_fire_inflation");
    return saved ? Number(saved) : 2.5;
  });

  const [targetRetirementAge, setTargetRetirementAge] = useState<number>(() => {
    const saved = localStorage.getItem("mp_fire_target_age");
    return saved ? Number(saved) : 55;
  });

  const [activeTab, setActiveTab] = useState<"horizon20" | "chart" | "expenses" | "scenarios" | "table">("horizon20");
  const [selectedHorizonYears, setSelectedHorizonYears] = useState<number>(20);

  // --- Expense Breakdown for FIRE Capital Allocation ---
  const expenseBreakdownData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {};
    
    if (budgets && budgets.length > 0) {
      budgets.forEach(b => {
        const cat = b.category || "Divers";
        categoryTotals[cat] = (categoryTotals[cat] || 0) + (b.limitAmount || 0);
      });
    } else if (transactions && transactions.length > 0) {
      transactions
        .filter(t => t.type === "Dépense" || t.type === "Expense")
        .forEach(t => {
          const cat = t.category || "Divers";
          categoryTotals[cat] = (categoryTotals[cat] || 0) + (t.amount || 0);
        });
    }

    const keys = Object.keys(categoryTotals);
    const totalDerived = keys.reduce((acc, k) => acc + categoryTotals[k], 0);

    const defaultCategories = [
      { name: "Logement & Charges", color: "#6366f1", ratio: 0.35 },
      { name: "Alimentation & Courses", color: "#10b981", ratio: 0.20 },
      { name: "Transports & Véhicule", color: "#f59e0b", ratio: 0.15 },
      { name: "Loisirs & Vacances", color: "#ec4899", ratio: 0.12 },
      { name: "Santé & Assurances", color: "#06b6d4", ratio: 0.08 },
      { name: "Abonnements & Tech", color: "#8b5cf6", ratio: 0.05 },
      { name: "Divers & Imprévus", color: "#64748b", ratio: 0.05 }
    ];

    if (keys.length > 0 && totalDerived > 0) {
      const paletteColors = ["#6366f1", "#10b981", "#f59e0b", "#ec4899", "#06b6d4", "#8b5cf6", "#64748b", "#f43f5e", "#84cc16"];
      return keys.map((catName, idx) => {
        const monthlyVal = categoryTotals[catName];
        const annualVal = monthlyVal * 12;
        const fireCapitalReq = annualVal / (withdrawalRate / 100);
        const percentage = (monthlyVal / totalDerived) * 100;
        return {
          name: catName,
          value: monthlyVal,
          monthly: monthlyVal,
          annual: annualVal,
          fireCapitalReq,
          percentage,
          color: paletteColors[idx % paletteColors.length]
        };
      });
    }

    // Default scaled to targetRente
    const baseMonthly = targetRente > 0 ? targetRente : 15000;
    return defaultCategories.map(cat => {
      const monthlyVal = Math.round(baseMonthly * cat.ratio);
      const annualVal = monthlyVal * 12;
      const fireCapitalReq = annualVal / (withdrawalRate / 100);
      return {
        name: cat.name,
        value: monthlyVal,
        monthly: monthlyVal,
        annual: annualVal,
        fireCapitalReq,
        percentage: cat.ratio * 100,
        color: cat.color
      };
    });
  }, [budgets, transactions, targetRente, withdrawalRate]);

  // Persistence effects
  useEffect(() => {
    localStorage.setItem("mp_fire_age", currentAge.toString());
    localStorage.setItem("mp_fire_capital", startingCapital.toString());
    localStorage.setItem("mp_fire_savings", monthlySavings.toString());
    localStorage.setItem("mp_fire_savings_growth", annualSavingsGrowth.toString());
    localStorage.setItem("mp_fire_rente", targetRente.toString());
    localStorage.setItem("mp_fire_return", annualReturnRate.toString());
    localStorage.setItem("mp_fire_swr", withdrawalRate.toString());
    localStorage.setItem("mp_fire_inflation", inflationRate.toString());
    localStorage.setItem("mp_fire_target_age", targetRetirementAge.toString());
  }, [currentAge, startingCapital, monthlySavings, annualSavingsGrowth, targetRente, annualReturnRate, withdrawalRate, inflationRate, targetRetirementAge]);

  // Sync with real data handler
  const handleSyncRealData = () => {
    const newCap = realTotalCapital > 0 ? realTotalCapital : 50000;
    const newSav = realMonthlySavings > 0 ? realMonthlySavings : 4000;
    const newRen = realMonthlyExpenses > 0 ? realMonthlyExpenses : 12000;

    setStartingCapital(newCap);
    setMonthlySavings(newSav);
    setTargetRente(newRen);

    if (triggerToast) {
      triggerToast(
        "Données Réelles Synchronisées !",
        `Portefeuille (${newCap.toLocaleString()} MAD) et épargne mensuelle (${newSav.toLocaleString()} MAD/m) chargés.`,
        "success"
      );
    }
  };

  // Preset scenarios handler
  const applyPresetStrategy = (ret: number, savMultiplier: number, growth: number, name: string) => {
    const baseSav = realMonthlySavings > 0 ? realMonthlySavings : 5000;
    const newSav = Math.round(baseSav * savMultiplier);
    setAnnualReturnRate(ret);
    setMonthlySavings(newSav);
    setAnnualSavingsGrowth(growth);

    if (triggerToast) {
      triggerToast(
        `Scénario appliqué : ${name}`,
        `Rendement : ${ret}%, Épargne : ${newSav.toLocaleString()} MAD/m, Croissance : ${growth}%/an`,
        "info"
      );
    }
  };

  // --- 3. COMPUTE ADVANCED FIRE METRICS & MULTI-SCENARIOS ---
  const fireMetrics = useMemo(() => {
    const netRealReturn = Math.max(0.1, annualReturnRate - inflationRate);

    // Target Capital needed for full FIRE
    const annualRenteNeeded = targetRente * 12;
    const requiredCapital = annualRenteNeeded / (withdrawalRate / 100);

    // Milestones Required Capitals
    const leanRequiredCapital = requiredCapital * 0.75; // 75% of expenses
    const fatRequiredCapital = requiredCapital * 1.5;   // 150% of expenses

    // Coast FIRE Capital needed today
    const yearsToTargetRetirement = Math.max(1, targetRetirementAge - currentAge);
    const coastCapitalNeeded = requiredCapital / Math.pow(1 + (netRealReturn / 100), yearsToTargetRetirement);
    const isCoastMet = startingCapital >= coastCapitalNeeded;

    // Trajectory calculations over 40 years (480 months)
    const projectionData: any[] = [];
    
    // Year 0 (Current State)
    projectionData.push({
      year: 0,
      age: currentAge,
      capital: Math.round(startingCapital),
      return5: Math.round(startingCapital),
      return7: Math.round(startingCapital),
      return9: Math.round(startingCapital),
      invested: Math.round(startingCapital),
      interest: 0,
      monthlySavingsStep: Math.round(monthlySavings),
      pctGoal: Math.min(100, Math.round((startingCapital / requiredCapital) * 100)),
      isFire: startingCapital >= requiredCapital,
      threshold: Math.round(requiredCapital)
    });

    let currentCapitalUser = startingCapital; // User's custom rate
    let currentCapital5 = startingCapital;    // Benchmark 5%
    let currentCapital7 = startingCapital;    // Benchmark 7%
    let currentCapital9 = startingCapital;    // Benchmark 9%

    let totalInvestedUser = startingCapital;

    const monthlyRateUser = (annualReturnRate / 100) / 12;
    const monthlyRate5 = (5 / 100) / 12;
    const monthlyRate7 = (7 / 100) / 12;
    const monthlyRate9 = (9 / 100) / 12;

    let fireAgeUser: number | null = null;
    let fireAge5: number | null = null;
    let fireAge7: number | null = null;
    let fireAge9: number | null = null;

    let leanFireAge: number | null = null;
    let fatFireAge: number | null = null;

    if (startingCapital >= requiredCapital) {
      fireAgeUser = currentAge;
      fireAge5 = currentAge;
      fireAge7 = currentAge;
      fireAge9 = currentAge;
    }

    if (startingCapital >= leanRequiredCapital) leanFireAge = currentAge;
    if (startingCapital >= fatRequiredCapital) fatFireAge = currentAge;

    for (let month = 1; month <= 480; month++) {
      const yearIdx = Math.floor((month - 1) / 12);
      
      // Indexed monthly savings if growth enabled
      const currentMonthlySavings = monthlySavings * Math.pow(1 + (annualSavingsGrowth / 100), yearIdx);

      // Monthly Compound Interest
      currentCapitalUser = currentCapitalUser * (1 + monthlyRateUser) + currentMonthlySavings;
      currentCapital5 = currentCapital5 * (1 + monthlyRate5) + currentMonthlySavings;
      currentCapital7 = currentCapital7 * (1 + monthlyRate7) + currentMonthlySavings;
      currentCapital9 = currentCapital9 * (1 + monthlyRate9) + currentMonthlySavings;

      totalInvestedUser += currentMonthlySavings;

      // Year-end capturing
      if (month % 12 === 0) {
        const year = yearIdx + 1;
        const currentYearAge = Math.round(currentAge + year);
        const interestEarned = Math.max(0, currentCapitalUser - totalInvestedUser);
        const pctGoal = Math.min(100, Math.round((currentCapitalUser / requiredCapital) * 100));

        projectionData.push({
          year,
          age: currentYearAge,
          capital: Math.round(currentCapitalUser),
          return5: Math.round(currentCapital5),
          return7: Math.round(currentCapital7),
          return9: Math.round(currentCapital9),
          invested: Math.round(totalInvestedUser),
          interest: Math.round(interestEarned),
          monthlySavingsStep: Math.round(currentMonthlySavings),
          pctGoal,
          isFire: currentCapitalUser >= requiredCapital,
          threshold: Math.round(requiredCapital)
        });

        // Detect Ages for each scenario
        if (currentCapitalUser >= leanRequiredCapital && leanFireAge === null) leanFireAge = currentYearAge;
        if (currentCapitalUser >= requiredCapital && fireAgeUser === null) fireAgeUser = currentYearAge;
        if (currentCapitalUser >= fatRequiredCapital && fatFireAge === null) fatFireAge = currentYearAge;

        if (currentCapital5 >= requiredCapital && fireAge5 === null) fireAge5 = currentYearAge;
        if (currentCapital7 >= requiredCapital && fireAge7 === null) fireAge7 = currentYearAge;
        if (currentCapital9 >= requiredCapital && fireAge9 === null) fireAge9 = currentYearAge;
      }
    }

    const currentPctGoal = Math.min(100, Math.round((startingCapital / requiredCapital) * 100));
    const yearsRemaining = fireAgeUser ? Math.max(0, fireAgeUser - currentAge) : null;
    const estimatedTargetYear = yearsRemaining !== null ? new Date().getFullYear() + yearsRemaining : null;

    // Horizon 20-Year specific calculations
    const dataHorizon = projectionData.filter(d => d.year <= selectedHorizonYears);
    const crossoverPoint = projectionData.find(d => d.isFire && d.year <= selectedHorizonYears) || null;
    const itemHorizonEnd = projectionData.find(d => d.year === selectedHorizonYears) || projectionData[projectionData.length - 1];
    const capitalHorizonEnd = itemHorizonEnd ? itemHorizonEnd.capital : 0;
    const investedHorizonEnd = itemHorizonEnd ? itemHorizonEnd.invested : 0;
    const interestHorizonEnd = itemHorizonEnd ? itemHorizonEnd.interest : 0;
    const passiveRenteHorizonEnd = Math.round(capitalHorizonEnd * (withdrawalRate / 100) / 12);
    const multiplierHorizonEnd = startingCapital > 0 ? (capitalHorizonEnd / startingCapital).toFixed(1) : "N/A";

    return {
      requiredCapital,
      leanRequiredCapital,
      fatRequiredCapital,
      coastCapitalNeeded,
      isCoastMet,
      fireAgeUser,
      fireAge5,
      fireAge7,
      fireAge9,
      leanFireAge,
      fatFireAge,
      yearsRemaining,
      estimatedTargetYear,
      currentPctGoal,
      projectionData,
      dataHorizon,
      crossoverPoint,
      itemHorizonEnd,
      capitalHorizonEnd,
      investedHorizonEnd,
      interestHorizonEnd,
      passiveRenteHorizonEnd,
      multiplierHorizonEnd,
      annualRenteNeeded,
      netRealReturn
    };
  }, [currentAge, startingCapital, monthlySavings, annualSavingsGrowth, targetRente, annualReturnRate, withdrawalRate, inflationRate, targetRetirementAge, selectedHorizonYears]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 font-sans">
      
      {/* HEADER BAR & REAL-DATA BANNER */}
      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-neutral-800 space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-sm shrink-0">
              <TrendingUp className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black text-white uppercase tracking-tight font-sans">
                  Calculateur & Stratégie FIRE (Indépendance Financière)
                </h2>
                <span className="text-[10px] font-mono font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2.5 py-0.5 rounded-full">
                  Sélecteur de Rendements & Épargne
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-medium">
                Simulez des scénarios avec différents taux de rendement (5%, 7%, 9%) et une épargne variable.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSyncRealData}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-4 py-2.5 rounded-2xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer shrink-0"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Charger Portefeuille Réel</span>
          </button>
        </div>

        {/* Real App Data Stats Pill Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-neutral-800/80">
          <div className="bg-neutral-900/90 border border-neutral-800/90 rounded-2xl p-3">
            <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block font-mono">Portefeuille Bourse (BVC)</span>
            <span className="text-xs font-black font-mono text-emerald-400">{stockWorth.toLocaleString("fr-FR")} MAD</span>
          </div>

          <div className="bg-neutral-900/90 border border-neutral-800/90 rounded-2xl p-3">
            <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block font-mono">Épargnes & Comptes</span>
            <span className="text-xs font-black font-mono text-indigo-400">{(epargneWorth + accountWorth).toLocaleString("fr-FR")} MAD</span>
          </div>

          <div className="bg-neutral-900/90 border border-neutral-800/90 rounded-2xl p-3">
            <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block font-mono">Revenu Mensuel Net</span>
            <span className="text-xs font-black font-mono text-white">+{realMonthlyIncome.toLocaleString("fr-FR")} MAD/m</span>
          </div>

          <div className="bg-neutral-900/90 border border-neutral-800/90 rounded-2xl p-3">
            <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block font-mono">Épargne Mensuelle Réelle</span>
            <span className="text-xs font-black font-mono text-amber-400">+{realMonthlySavings.toLocaleString("fr-FR")} MAD/m</span>
          </div>
        </div>
      </div>

      {/* QUICK 1-CLICK STRATEGY PRESETS BAR */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-4 shadow-3xs space-y-3">
        <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2">
          <span className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2 font-mono">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Scénarios Stratégiques Prédéfinis (1-Click)</span>
          </span>
          <span className="text-[10px] text-neutral-400 font-mono">Simulateur instantané</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Prudent 5% */}
          <button
            type="button"
            onClick={() => applyPresetStrategy(5, 1, 0, "Prudent (5%)")}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              annualReturnRate === 5 
                ? "bg-amber-500/10 border-amber-500/50 text-amber-900 dark:text-amber-200 shadow-3xs" 
                : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200/80 dark:border-neutral-700/80 hover:bg-neutral-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider font-mono text-amber-600">Prudent</span>
              <span className="text-xs font-black font-mono">5%</span>
            </div>
            <div className="mt-1">
              <span className="text-[11px] font-bold block text-neutral-900 dark:text-white">Épargne Réelle</span>
              <span className="text-[9px] text-neutral-500">Obligations / Monétaire</span>
            </div>
          </button>

          {/* Équilibré 7% */}
          <button
            type="button"
            onClick={() => applyPresetStrategy(7, 1.15, 0, "Équilibré (7%)")}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              annualReturnRate === 7 
                ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-900 dark:text-indigo-200 shadow-3xs" 
                : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200/80 dark:border-neutral-700/80 hover:bg-neutral-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider font-mono text-indigo-600">Équilibré</span>
              <span className="text-xs font-black font-mono">7%</span>
            </div>
            <div className="mt-1">
              <span className="text-[11px] font-bold block text-neutral-900 dark:text-white">Épargne +15%</span>
              <span className="text-[9px] text-neutral-500">ETF Indices & Dividendes</span>
            </div>
          </button>

          {/* Dynamique BVC 9% */}
          <button
            type="button"
            onClick={() => applyPresetStrategy(9, 1.3, 2, "BVC Dynamique (9%)")}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              annualReturnRate === 9 
                ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-900 dark:text-emerald-200 shadow-3xs" 
                : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200/80 dark:border-neutral-700/80 hover:bg-neutral-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider font-mono text-emerald-600">BVC Dynamique</span>
              <span className="text-xs font-black font-mono">9%</span>
            </div>
            <div className="mt-1">
              <span className="text-[11px] font-bold block text-neutral-900 dark:text-white">Épargne +30%</span>
              <span className="text-[9px] text-neutral-500">Bourse BVC & Valeurs Croissance</span>
            </div>
          </button>

          {/* Maximisé 11% + Croissance 3%/an */}
          <button
            type="button"
            onClick={() => applyPresetStrategy(11, 1.5, 3, "Maximisé (11%)")}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              annualReturnRate === 11 
                ? "bg-purple-500/10 border-purple-500/50 text-purple-900 dark:text-purple-200 shadow-3xs" 
                : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200/80 dark:border-neutral-700/80 hover:bg-neutral-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-wider font-mono text-purple-600">Maximisé</span>
              <span className="text-xs font-black font-mono">11%</span>
            </div>
            <div className="mt-1">
              <span className="text-[11px] font-bold block text-neutral-900 dark:text-white">Épargne Max (+3%/an)</span>
              <span className="text-[9px] text-neutral-500">Portefeuille Agressif + Indexation</span>
            </div>
          </button>
        </div>
      </div>

      {/* BENCHMARK RETURN COMPARISON SUMMARY CARDS (5%, 7%, 9%) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* BENCHMARK 5% */}
        <div className={`border rounded-3xl p-4 shadow-3xs space-y-2 transition-all ${
          annualReturnRate === 5 
            ? "bg-amber-500/10 border-amber-500/50 ring-2 ring-amber-500/30" 
            : "bg-white dark:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider font-mono">Scénario Prudent (5%)</span>
            <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              Conservateur
            </span>
          </div>
          <div>
            <h4 className="text-base font-black font-mono text-neutral-900 dark:text-white">
              {fireMetrics.fireAge5 ? `${fireMetrics.fireAge5} ans` : "Inatteignable"}
            </h4>
            <p className="text-[10px] text-neutral-500">
              {fireMetrics.fireAge5 ? `${fireMetrics.fireAge5 - currentAge} ans de travail nécessaires` : "Augmentez l'épargne"}
            </p>
          </div>
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-xs">
            <span className="text-[11px] font-bold text-neutral-500">Rendement Brut :</span>
            <span className="font-mono font-black text-amber-600">5.0% / an</span>
          </div>
        </div>

        {/* BENCHMARK 7% */}
        <div className={`border rounded-3xl p-4 shadow-3xs space-y-2 transition-all ${
          annualReturnRate === 7 
            ? "bg-indigo-500/10 border-indigo-500/50 ring-2 ring-indigo-500/30" 
            : "bg-white dark:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider font-mono">Scénario Équilibré (7%)</span>
            <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
              Standard Marché
            </span>
          </div>
          <div>
            <h4 className="text-base font-black font-mono text-neutral-900 dark:text-white">
              {fireMetrics.fireAge7 ? `${fireMetrics.fireAge7} ans` : "Inatteignable"}
            </h4>
            <p className="text-[10px] text-neutral-500">
              {fireMetrics.fireAge7 ? `${fireMetrics.fireAge7 - currentAge} ans de travail nécessaires` : "Augmentez l'épargne"}
            </p>
          </div>
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-xs">
            <span className="text-[11px] font-bold text-neutral-500">Rendement Brut :</span>
            <span className="font-mono font-black text-indigo-600">7.0% / an</span>
          </div>
        </div>

        {/* BENCHMARK 9% */}
        <div className={`border rounded-3xl p-4 shadow-3xs space-y-2 transition-all ${
          annualReturnRate === 9 
            ? "bg-emerald-500/10 border-emerald-500/50 ring-2 ring-emerald-500/30" 
            : "bg-white dark:bg-neutral-900 border-neutral-200/80 dark:border-neutral-800"
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-emerald-600 uppercase tracking-wider font-mono">Scénario Dynamique (9%)</span>
            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
              BVC / Actions
            </span>
          </div>
          <div>
            <h4 className="text-base font-black font-mono text-neutral-900 dark:text-white">
              {fireMetrics.fireAge9 ? `${fireMetrics.fireAge9} ans` : "Inatteignable"}
            </h4>
            <p className="text-[10px] text-neutral-500">
              {fireMetrics.fireAge9 ? `${fireMetrics.fireAge9 - currentAge} ans de travail nécessaires` : "Augmentez l'épargne"}
            </p>
          </div>
          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-xs">
            <span className="text-[11px] font-bold text-neutral-500">Rendement Brut :</span>
            <span className="font-mono font-black text-emerald-600">9.0% / an</span>
          </div>
        </div>

        {/* CURRENT USER SIMULATION AGE */}
        <div className="bg-neutral-900 text-white border border-neutral-800 rounded-3xl p-4 shadow-md space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black text-indigo-300 uppercase tracking-wider font-mono">Votre Simulation ({annualReturnRate}%)</span>
            <span className="text-[10px] font-mono font-bold text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-full border border-indigo-500/30">
              Sur-Mesure
            </span>
          </div>
          <div>
            <h4 className="text-lg font-black font-mono text-white">
              {fireMetrics.fireAgeUser ? `${fireMetrics.fireAgeUser} ans (${fireMetrics.estimatedTargetYear})` : "Inatteignable"}
            </h4>
            <p className="text-[10px] text-neutral-400">
              Capital cible : {Math.round(fireMetrics.requiredCapital).toLocaleString("fr-FR")} MAD
            </p>
          </div>
          <div className="pt-2 border-t border-neutral-800 flex justify-between items-center text-xs">
            <span className="text-[11px] font-bold text-neutral-400">Épargne :</span>
            <span className="font-mono font-black text-indigo-300 text-xs">
              {monthlySavings.toLocaleString("fr-FR")} MAD/m {annualSavingsGrowth > 0 ? `(+${annualSavingsGrowth}%/an)` : ""}
            </span>
          </div>
        </div>

      </div>

      {/* MAIN CONTROLS & GRAPHICAL ANALYTICS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUT PARAMETERS FORM WITH DYNAMIC SELECTORS (5 COLS) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 space-y-5 shadow-3xs">
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2 font-mono">
                <Sliders className="w-4 h-4 text-indigo-600" />
                <span>Paramètres de Simulation</span>
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">Sélecteurs interactifs</span>
            </div>

            {/* Current Age */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-700 dark:text-neutral-300">
                <span>Âge Actuel</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Math.max(18, Math.min(80, Number(e.target.value))))}
                    className="w-16 text-right font-mono font-bold text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2 py-1 rounded-lg text-neutral-900 dark:text-white"
                  />
                  <span className="text-neutral-400 text-xs">ans</span>
                </div>
              </div>
              <input 
                type="range" 
                min="18" 
                max="65" 
                step="1"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Starting capital input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-700 dark:text-neutral-300">
                <span>Capital d'Investissement Initial</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={startingCapital}
                    onChange={(e) => setStartingCapital(Math.max(0, Number(e.target.value)))}
                    className="w-28 text-right font-mono font-bold text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2 py-1 rounded-lg text-neutral-900 dark:text-white"
                  />
                  <span className="text-neutral-400 text-xs">MAD</span>
                </div>
              </div>
              <input 
                type="range" 
                min="0" 
                max="2000000" 
                step="10000"
                value={startingCapital}
                onChange={(e) => setStartingCapital(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* SELECTEUR: Rendement Annuel Espéré (Brut) */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-700 dark:text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Sélecteur de Rendement Annuel</span>
                </span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-extrabold text-sm">{annualReturnRate}% / an</span>
              </div>

              {/* Quick Rate Selector Pills */}
              <div className="grid grid-cols-5 gap-1.5">
                {[5, 7, 8.5, 9, 11].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setAnnualReturnRate(rate)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer text-center ${
                      annualReturnRate === rate
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200"
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>

              <input 
                type="range" 
                min="2" 
                max="15" 
                step="0.5"
                value={annualReturnRate}
                onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg cursor-pointer mt-1"
              />
            </div>

            {/* SELECTEUR: Épargne Mensuelle Réinvestie & Modificateurs */}
            <div className="space-y-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-700 dark:text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Épargne Mensuelle Réinvestie</span>
                </span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={monthlySavings}
                    onChange={(e) => setMonthlySavings(Math.max(0, Number(e.target.value)))}
                    className="w-24 text-right font-mono font-bold text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2 py-1 rounded-lg text-neutral-900 dark:text-white"
                  />
                  <span className="text-neutral-400 text-xs">MAD/m</span>
                </div>
              </div>

              {/* Quick Amount Selector Chips */}
              <div className="flex flex-wrap gap-1.5">
                {realMonthlySavings > 0 && (
                  <button
                    type="button"
                    onClick={() => setMonthlySavings(realMonthlySavings)}
                    className={`py-1 px-2.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                      monthlySavings === realMonthlySavings
                        ? "bg-amber-500 text-white border-amber-600"
                        : "bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-200 border-amber-200 dark:border-amber-800"
                    }`}
                  >
                    Réelle ({realMonthlySavings.toLocaleString()} MAD)
                  </button>
                )}
                {[2500, 5000, 8000, 12000, 20000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setMonthlySavings(amt)}
                    className={`py-1 px-2 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                      monthlySavings === amt
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200"
                    }`}
                  >
                    {amt >= 1000 ? `${amt / 1000}k` : amt} MAD
                  </button>
                ))}
              </div>

              {/* Modificateurs Rapides d'Épargne (+10%, +25%, +50%) */}
              <div className="flex items-center justify-between bg-neutral-50 dark:bg-neutral-950 p-2 rounded-xl border border-neutral-200/60 dark:border-neutral-800">
                <span className="text-[10px] text-neutral-500 font-bold uppercase tracking-wider font-mono">Booster l'Épargne :</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setMonthlySavings(s => Math.round(s * 1.1))}
                    className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white text-[10px] font-mono font-bold transition-all cursor-pointer"
                  >
                    +10%
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonthlySavings(s => Math.round(s * 1.25))}
                    className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white text-[10px] font-mono font-bold transition-all cursor-pointer"
                  >
                    +25%
                  </button>
                  <button
                    type="button"
                    onClick={() => setMonthlySavings(s => Math.round(s * 1.5))}
                    className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white text-[10px] font-mono font-bold transition-all cursor-pointer"
                  >
                    +50%
                  </button>
                </div>
              </div>

              <input 
                type="range" 
                min="500" 
                max="50000" 
                step="500"
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* SELECTEUR: Croissance Annuelle de l'Épargne (%/an) */}
            <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-700 dark:text-neutral-300">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-600" />
                  <span>Croissance Annuelle Épargne (Indexation)</span>
                </span>
                <span className="font-mono text-purple-600 dark:text-purple-400 font-bold text-xs">+{annualSavingsGrowth}% / an</span>
              </div>

              <div className="grid grid-cols-5 gap-1">
                {[0, 2, 3, 5, 8].map((growth) => (
                  <button
                    key={growth}
                    type="button"
                    onClick={() => setAnnualSavingsGrowth(growth)}
                    className={`py-1 px-1.5 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer text-center ${
                      annualSavingsGrowth === growth
                        ? "bg-purple-600 text-white shadow-xs"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200"
                    }`}
                  >
                    +{growth}%
                  </button>
                ))}
              </div>
            </div>

            {/* Target Rente input */}
            <div className="space-y-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-700 dark:text-neutral-300">
                <span>Rente Mensuelle Cible (Indépendance)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={targetRente}
                    onChange={(e) => setTargetRente(Math.max(1000, Number(e.target.value)))}
                    className="w-28 text-right font-mono font-bold text-xs bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2 py-1 rounded-lg text-neutral-900 dark:text-white"
                  />
                  <span className="text-neutral-400 text-xs">MAD/m</span>
                </div>
              </div>
              <input 
                type="range" 
                min="3000" 
                max="100000" 
                step="1000"
                value={targetRente}
                onChange={(e) => setTargetRente(Number(e.target.value))}
                className="w-full accent-indigo-600 h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg cursor-pointer"
              />
            </div>

            {/* Inflation & Safe Withdrawal Rate */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-500 block">Taux d'Inflation Annuel</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    className="w-16 font-mono text-xs font-bold bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2 py-1 rounded-lg text-neutral-900 dark:text-white"
                  />
                  <span className="text-[10px] text-neutral-400">%</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-neutral-500 block">Taux de Retrait Sûr (SWR)</span>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.1"
                    value={withdrawalRate}
                    onChange={(e) => setWithdrawalRate(Number(e.target.value))}
                    className="w-16 font-mono text-xs font-bold bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 px-2 py-1 rounded-lg text-neutral-900 dark:text-white"
                  />
                  <span className="text-[10px] text-neutral-400">%</span>
                </div>
              </div>
            </div>

            {/* Retrait de 4% explanations */}
            <div className="bg-neutral-50 dark:bg-neutral-950 p-3.5 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 flex items-start gap-2.5">
              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-[10px] text-neutral-500 leading-normal">
                <span className="font-black text-neutral-800 dark:text-neutral-200 block">Calcul du Taux Réel :</span>
                <span>
                  Rendement réel net d'inflation : <strong className="text-neutral-900 dark:text-white font-mono">{fireMetrics.netRealReturn.toFixed(1)}% / an</strong>. Règle des {withdrawalRate}% : Capital cible = {Math.round(100 / withdrawalRate)}x vos dépenses annuelles ({fireMetrics.annualRenteNeeded.toLocaleString()} MAD).
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* METRIC KPIS & GRAPHICAL PREVIEW (7 COLS) */}
        <div className="lg:col-span-7 space-y-5 flex flex-col justify-between">
          
          {/* TAB SELECTOR */}
          <div className="bg-neutral-100 dark:bg-neutral-900 p-1 rounded-2xl flex items-center justify-between border border-neutral-200/80 dark:border-neutral-800">
            <div className="flex items-center gap-1 w-full overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("horizon20")}
                className={`flex-1 min-w-[140px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "horizon20"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-300" />
                <span>Horizon {selectedHorizonYears} Ans & Seuil</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("expenses")}
                className={`flex-1 min-w-[150px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeTab === "expenses"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                }`}
              >
                <PieChartIcon className="w-3.5 h-3.5 text-pink-300" />
                <span>Répartition Dépenses & FIRE</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("chart")}
                className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "chart"
                    ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Intérêts Composés
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("scenarios")}
                className={`flex-1 min-w-[130px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "scenarios"
                    ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Comparatif 5% - 7% - 9%
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("table")}
                className={`flex-1 min-w-[100px] py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "table"
                    ? "bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Tableau Annuel
              </button>
            </div>
          </div>

          {/* DYNAMIC CHART CONTAINER */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-5 shadow-3xs space-y-4 flex-1 flex flex-col justify-between min-h-[380px]">
            
            {/* TAB: HORIZON 20 ANS & SEUIL FIRE (DEDICATED RECHARTS VISUALIZER) */}
            {activeTab === "horizon20" && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                
                {/* Header & Horizon Timeframe Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider font-mono flex items-center gap-1">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        <span>Projection Patrimoine & Dépassement Seuil FIRE</span>
                      </span>
                      {fireMetrics.crossoverPoint && (
                        <span className="text-[9px] font-mono font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          Seuil Atteint en Année {fireMetrics.crossoverPoint.year} ({fireMetrics.crossoverPoint.age} ans)
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-neutral-400 leading-normal mt-0.5">
                      Visualisation de la courbe de patrimoine et croisement du seuil d'indépendance financière ({Math.round(fireMetrics.requiredCapital).toLocaleString("fr-FR")} MAD).
                    </p>
                  </div>

                  {/* Horizon selector buttons */}
                  <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl self-start sm:self-auto">
                    {[10, 15, 20, 25, 30].map((horizon) => (
                      <button
                        key={horizon}
                        type="button"
                        onClick={() => setSelectedHorizonYears(horizon)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition-all cursor-pointer ${
                          selectedHorizonYears === horizon
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                        }`}
                      >
                        {horizon} Ans
                      </button>
                    ))}
                  </div>
                </div>

                {/* Horizon 20-Year KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-2xl border border-neutral-200/60 dark:border-neutral-800">
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">Patrimoine à {selectedHorizonYears} Ans</span>
                    <span className="text-xs font-black font-mono text-indigo-600 dark:text-indigo-400">
                      {fireMetrics.capitalHorizonEnd.toLocaleString("fr-FR")} MAD
                    </span>
                    <span className="text-[9px] font-bold text-emerald-500 block">+{fireMetrics.multiplierHorizonEnd}x capital initial</span>
                  </div>

                  <div className="bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-2xl border border-neutral-200/60 dark:border-neutral-800">
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">Rente Passives ({withdrawalRate}%)</span>
                    <span className="text-xs font-black font-mono text-emerald-600 dark:text-emerald-400">
                      +{fireMetrics.passiveRenteHorizonEnd.toLocaleString("fr-FR")} MAD/m
                    </span>
                    <span className="text-[9px] text-neutral-400 block">SWR de {withdrawalRate}% net</span>
                  </div>

                  <div className="bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-2xl border border-neutral-200/60 dark:border-neutral-800">
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">Dépassement Seuil FIRE</span>
                    <span className="text-xs font-black font-mono text-amber-600 dark:text-amber-400">
                      {fireMetrics.crossoverPoint 
                        ? `Année ${fireMetrics.crossoverPoint.year} (${fireMetrics.crossoverPoint.age} ans)` 
                        : `${fireMetrics.itemHorizonEnd?.pctGoal || 0}% du seuil`}
                    </span>
                    <span className="text-[9px] text-neutral-400 block">Cible: {Math.round(fireMetrics.requiredCapital / 1000)}k MAD</span>
                  </div>

                  <div className="bg-neutral-50 dark:bg-neutral-950 p-2.5 rounded-2xl border border-neutral-200/60 dark:border-neutral-800">
                    <span className="text-[9px] font-mono text-neutral-400 uppercase tracking-wider block">Intérêts Composés ({selectedHorizonYears}a)</span>
                    <span className="text-xs font-black font-mono text-purple-600 dark:text-purple-400">
                      +{fireMetrics.interestHorizonEnd.toLocaleString("fr-FR")} MAD
                    </span>
                    <span className="text-[9px] text-neutral-400 block">Effet Levier Marché</span>
                  </div>
                </div>

                {/* Main 20-Year Horizon Recharts Visualizer */}
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={fireMetrics.dataHorizon}
                      margin={{ top: 15, right: 15, left: 10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorHorizonCapital" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#6366f1" stopOpacity={0.03}/>
                        </linearGradient>
                        <linearGradient id="colorHorizonInvested" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a3a3a3" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#a3a3a3" stopOpacity={0.01}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                      <XAxis 
                        dataKey="age" 
                        tickLine={false} 
                        axisLine={false} 
                        stroke="#a3a3a3"
                        style={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace' }}
                        tickFormatter={(age, idx) => {
                          const item = fireMetrics.dataHorizon[idx];
                          return item ? `An ${item.year} (${age}a)` : `${age}a`;
                        }}
                      />
                      <YAxis 
                        tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                        tickLine={false}
                        axisLine={false}
                        stroke="#a3a3a3"
                        style={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace' }}
                      />
                      <Tooltip 
                        content={({ active, payload, label }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-neutral-900 text-white border border-neutral-800 p-3 rounded-2xl shadow-xl font-sans text-xs space-y-1.5 min-w-[200px]">
                                <div className="flex justify-between items-center border-b border-neutral-800 pb-1 font-mono font-bold">
                                  <span>Année {data.year} ({data.age} ans)</span>
                                  <span className={`px-2 py-0.5 rounded-full text-[9px] ${
                                    data.isFire ? "bg-emerald-500 text-white" : "bg-neutral-800 text-neutral-300"
                                  }`}>
                                    {data.isFire ? "Seuil FIRE Atteint !" : `${data.pctGoal}% Cible`}
                                  </span>
                                </div>
                                <div className="space-y-1 font-mono text-[11px]">
                                  <div className="flex justify-between text-indigo-300 font-bold">
                                    <span>Patrimoine :</span>
                                    <span>{data.capital.toLocaleString("fr-FR")} MAD</span>
                                  </div>
                                  <div className="flex justify-between text-neutral-400">
                                    <span>Apport Propre :</span>
                                    <span>{data.invested.toLocaleString("fr-FR")} MAD</span>
                                  </div>
                                  <div className="flex justify-between text-emerald-400">
                                    <span>Gains Intérêts :</span>
                                    <span>+{data.interest.toLocaleString("fr-FR")} MAD</span>
                                  </div>
                                  <div className="flex justify-between text-amber-400 pt-1 border-t border-neutral-800">
                                    <span>Seuil Indépendance :</span>
                                    <span>{data.threshold.toLocaleString("fr-FR")} MAD</span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />

                      {/* Area for Invested Capital */}
                      <Area 
                        type="monotone" 
                        dataKey="invested" 
                        name="Capital Propre Versé"
                        stroke="#9ca3af" 
                        strokeWidth={1.5}
                        strokeDasharray="3 3"
                        fillOpacity={1} 
                        fill="url(#colorHorizonInvested)" 
                      />

                      {/* Area for Total Portfolio Wealth */}
                      <Area 
                        type="monotone" 
                        dataKey="capital" 
                        name={`Patrimoine Global (${annualReturnRate}%)`}
                        stroke="#4f46e5" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorHorizonCapital)" 
                      />

                      {/* Reference line for Required FIRE Threshold */}
                      <ReferenceLine 
                        y={fireMetrics.requiredCapital} 
                        stroke="#10b981" 
                        strokeDasharray="5 5" 
                        strokeWidth={2.5}
                        label={{ 
                          value: `Seuil FIRE : ${Math.round(fireMetrics.requiredCapital / 1000)}k MAD`, 
                          fill: '#059669', 
                          fontSize: 10, 
                          fontWeight: 'bold', 
                          position: 'top' 
                        }} 
                      />

                      {/* Highlighted ReferenceDot at FIRE Crossover Point */}
                      {fireMetrics.crossoverPoint && (
                        <ReferenceDot
                          x={fireMetrics.crossoverPoint.age}
                          y={fireMetrics.crossoverPoint.capital}
                          r={7}
                          fill="#10b981"
                          stroke="#ffffff"
                          strokeWidth={2.5}
                        />
                      )}
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>

              </div>
            )}

            {activeTab === "expenses" && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                {/* Header & Subtitle */}
                <div className="border-b border-neutral-100 dark:border-neutral-800 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <PieChartIcon className="w-4 h-4 text-pink-500" />
                      <span className="text-[10px] font-black uppercase text-neutral-900 dark:text-white tracking-wider font-mono">
                        Répartition des Dépenses & Capital FIRE Requis par Poste
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-800">
                      Total : {(targetRente * 12).toLocaleString("fr-FR")} MAD/an
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 leading-normal mt-0.5">
                    Identifiez les postes de dépenses les plus gourmands en capital FIRE. Réduire un poste de dépense abaisse instantanément votre seuil d'indépendance financière.
                  </p>
                </div>

                {/* Pie Chart & Detailed Breakdown Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center flex-1">
                  {/* Left side: Pie Chart */}
                  <div className="md:col-span-5 h-64 w-full flex items-center justify-center relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseBreakdownData}
                          cx="50%"
                          cy="50%"
                          innerRadius={52}
                          outerRadius={82}
                          paddingAngle={3}
                          dataKey="value"
                        >
                          {expenseBreakdownData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-neutral-900 text-white border border-neutral-800 p-3 rounded-2xl shadow-xl font-sans text-xs space-y-1 min-w-[180px]">
                                  <div className="font-bold flex items-center gap-2 border-b border-neutral-800 pb-1" style={{ color: data.color }}>
                                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.color }} />
                                    <span>{data.name}</span>
                                  </div>
                                  <div className="font-mono text-[11px] space-y-0.5 pt-1">
                                    <div className="flex justify-between text-neutral-300">
                                      <span>Mensuel :</span>
                                      <span className="font-bold">{data.monthly.toLocaleString("fr-FR")} MAD/m</span>
                                    </div>
                                    <div className="flex justify-between text-neutral-400">
                                      <span>Part du budget :</span>
                                      <span>{data.percentage.toFixed(1)}%</span>
                                    </div>
                                    <div className="flex justify-between text-emerald-400 pt-1 border-t border-neutral-800 font-bold">
                                      <span>Capital FIRE Imposé :</span>
                                      <span>{Math.round(data.fireCapitalReq).toLocaleString("fr-FR")} MAD</span>
                                    </div>
                                  </div>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    {/* Center label inside Donut Pie */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-[9px] font-mono font-bold uppercase text-neutral-400">Dépenses/m</span>
                      <span className="text-xs font-black font-mono text-neutral-900 dark:text-white">
                        {targetRente.toLocaleString("fr-FR")} MAD
                      </span>
                    </div>
                  </div>

                  {/* Right side: Detailed category list cards with required capital */}
                  <div className="md:col-span-7 space-y-2 max-h-64 overflow-y-auto pr-1">
                    {expenseBreakdownData.map((cat) => (
                      <div 
                        key={cat.name} 
                        className="flex items-center justify-between p-2.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-neutral-900 dark:text-white truncate block">
                              {cat.name}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {cat.percentage.toFixed(1)}% des dépenses
                            </span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-xs font-black font-mono text-neutral-900 dark:text-white block">
                            {cat.monthly.toLocaleString("fr-FR")} MAD/m
                          </span>
                          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            Cible FIRE: {Math.round(cat.fireCapitalReq / 1000)}k MAD
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Optimization Tip Banner */}
                <div className="bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                    <span className="text-[10px] text-amber-900 dark:text-amber-200 font-medium">
                      <strong>Levier d'Indépendance :</strong> Réduire 1 000 MAD/m de dépenses libère <strong>{Math.round(12000 / (withdrawalRate / 100)).toLocaleString("fr-FR")} MAD</strong> de capital FIRE nécessaire !
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === "chart" && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider block font-mono">
                      Courbe de Capitalisation & Effet Boule de Neige ({annualReturnRate}%)
                    </span>
                    <span className="text-xs font-bold font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                      Cible : {Math.round(fireMetrics.requiredCapital).toLocaleString("fr-FR")} MAD
                    </span>
                  </div>
                  <p className="text-[10px] text-neutral-400 leading-normal mt-0.5">
                    Séparation du capital propre versé par vos soins et des intérêts composés générés par vos placements.
                  </p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={fireMetrics.projectionData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorCapitalFire" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.02}/>
                        </linearGradient>
                        <linearGradient id="colorInvestedFire" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#737373" stopOpacity={0.15}/>
                          <stop offset="95%" stopColor="#737373" stopOpacity={0.01}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                      <XAxis 
                        dataKey="age" 
                        tickLine={false} 
                        axisLine={false} 
                        stroke="#a3a3a3"
                        style={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace' }}
                      />
                      <YAxis 
                        tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                        tickLine={false}
                        axisLine={false}
                        stroke="#a3a3a3"
                        style={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace' }}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`${Number(value).toLocaleString()} MAD`]}
                        labelFormatter={(label) => `Âge: ${label} ans`}
                        contentStyle={{ borderRadius: '16px', border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', fontFamily: 'sans-serif', fontSize: '11px' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="capital" 
                        name={`Capital Portefeuille (${annualReturnRate}%)`}
                        stroke="#4f46e5" 
                        strokeWidth={2.5}
                        fillOpacity={1} 
                        fill="url(#colorCapitalFire)" 
                      />
                      <Area 
                        type="monotone" 
                        dataKey="invested" 
                        name="Épargne Propre versée"
                        stroke="#737373" 
                        strokeWidth={1.5}
                        strokeDasharray="4 4"
                        fillOpacity={1} 
                        fill="url(#colorInvestedFire)" 
                      />
                      <ReferenceLine 
                        y={fireMetrics.requiredCapital} 
                        stroke="#10b981" 
                        strokeDasharray="4 4" 
                        strokeWidth={2}
                        label={{ value: 'Seuil FIRE (Indépendance)', fill: '#059669', fontSize: 10, fontWeight: 'bold', position: 'top' }} 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === "scenarios" && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider block font-mono">
                    Comparatif de Rendement : 5% vs 7% vs 9% vs Sur-Mesure ({annualReturnRate}%)
                  </span>
                  <p className="text-[10px] text-neutral-400 leading-normal mt-0.5">
                    Impact direct du taux de rendement sur le temps nécessaire pour atteindre l'indépendance financière.
                  </p>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={fireMetrics.projectionData}
                      margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" />
                      <XAxis 
                        dataKey="age" 
                        tickLine={false} 
                        axisLine={false} 
                        stroke="#a3a3a3"
                        style={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace' }}
                      />
                      <YAxis 
                        tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                        tickLine={false}
                        axisLine={false}
                        stroke="#a3a3a3"
                        style={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace' }}
                      />
                      <Tooltip 
                        formatter={(value: any) => [`${Number(value).toLocaleString()} MAD`]}
                        labelFormatter={(label) => `Âge: ${label} ans`}
                      />
                      <Legend style={{ fontSize: '11px', fontWeight: 'bold' }} />
                      <Line type="monotone" dataKey="return5" name="Prudent (5%)" stroke="#f59e0b" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="return7" name="Équilibré (7%)" stroke="#6366f1" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="return9" name="Dynamique (9%)" stroke="#10b981" strokeWidth={2} dot={false} />
                      {annualReturnRate !== 5 && annualReturnRate !== 7 && annualReturnRate !== 9 && (
                        <Line type="monotone" dataKey="capital" name={`Votre Taux (${annualReturnRate}%)`} stroke="#ec4899" strokeWidth={2.5} strokeDasharray="5 5" dot={false} />
                      )}
                      <ReferenceLine y={fireMetrics.requiredCapital} stroke="#000" strokeDasharray="3 3" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {activeTab === "table" && (
              <div className="space-y-3 flex-1 flex flex-col justify-between overflow-x-auto">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider block font-mono">
                    Tableau de Progression Année par Année ({annualReturnRate}%)
                  </span>
                  <span className="text-[10px] text-neutral-500 font-mono">Projections sur 30 ans</span>
                </div>

                <div className="max-h-64 overflow-y-auto border border-neutral-200 dark:border-neutral-800 rounded-2xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 font-mono text-[10px] uppercase sticky top-0">
                      <tr>
                        <th className="p-2.5">Année</th>
                        <th className="p-2.5">Âge</th>
                        <th className="p-2.5">Épargne/m</th>
                        <th className="p-2.5">Capital Est.</th>
                        <th className="p-2.5">Cumul Épargne</th>
                        <th className="p-2.5">Intérêts</th>
                        <th className="p-2.5 text-right">% Cible</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono">
                      {fireMetrics.projectionData.slice(0, 30).map((row) => (
                        <tr 
                          key={row.year} 
                          className={row.isFire ? "bg-emerald-500/10 dark:bg-emerald-950/30 font-black" : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"}
                        >
                          <td className="p-2.5 text-neutral-500">Année {row.year}</td>
                          <td className="p-2.5 font-bold text-neutral-900 dark:text-white">{row.age} ans</td>
                          <td className="p-2.5 text-neutral-600 dark:text-neutral-400">{row.monthlySavingsStep.toLocaleString("fr-FR")} MAD</td>
                          <td className="p-2.5 text-indigo-600 dark:text-indigo-400 font-bold">{row.capital.toLocaleString("fr-FR")} MAD</td>
                          <td className="p-2.5 text-neutral-600 dark:text-neutral-400">{row.invested.toLocaleString("fr-FR")} MAD</td>
                          <td className="p-2.5 text-emerald-600 dark:text-emerald-400">+{row.interest.toLocaleString("fr-FR")} MAD</td>
                          <td className="p-2.5 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              row.pctGoal >= 100 ? "bg-emerald-600 text-white" : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                            }`}>
                              {row.pctGoal}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* BOTTOM INSIGHT FOOTER */}
            <div className="flex justify-between items-center bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-indigo-600 animate-pulse" />
                <span className="text-[10px] font-black text-indigo-900 dark:text-indigo-200 uppercase tracking-wider font-mono">
                  Synthèse Levier FIRE
                </span>
              </div>
              <span className="text-[10px] font-bold text-indigo-800 dark:text-indigo-300 leading-normal text-right">
                {fireMetrics.fireAgeUser 
                  ? `Atteinte du seuil FIRE à ${fireMetrics.fireAgeUser} ans ! Vos intérêts généreront ${targetRente.toLocaleString("fr-FR")} MAD/mois de rentes passives.`
                  : "Augmentez votre apport mensuel ou votre rendement pour réduire l'âge de retraite."}
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
