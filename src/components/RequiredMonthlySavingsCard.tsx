import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import CountUpNumber from "./CountUpNumber";
import { 
  Calculator, 
  PiggyBank, 
  Target, 
  Calendar, 
  Clock, 
  TrendingUp, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Info,
  ChevronRight,
  SlidersHorizontal
} from "lucide-react";
import { FinanceEpargne, FinanceTransaction, Abonnement, FinanceSalaire } from "../types";

interface RequiredMonthlySavingsCardProps {
  epargnes: FinanceEpargne[];
  transactions?: FinanceTransaction[];
  abonnements?: Abonnement[];
  salaires?: FinanceSalaire[];
  onNavigate?: (key: string) => void;
}

export default function RequiredMonthlySavingsCard({
  epargnes = [],
  transactions = [],
  abonnements = [],
  salaires = [],
  onNavigate
}: RequiredMonthlySavingsCardProps) {
  const [sortBy, setSortBy] = useState<"monthlyRequired" | "deadline" | "remaining">("monthlyRequired");

  // Filter active/ongoing savings goals
  const ongoingGoals = useMemo(() => {
    return epargnes.filter(e => e.status === "En cours" || e.status === undefined);
  }, [epargnes]);

  // Current reference date (today)
  const now = useMemo(() => new Date(), []);

  // Compute detailed metrics per goal and aggregated total
  const calculationData = useMemo(() => {
    let totalTarget = 0;
    let totalSaved = 0;
    let totalRemaining = 0;
    let totalMonthlyRequired = 0;

    const items = ongoingGoals.map(goal => {
      const remaining = Math.max(0, (goal.targetAmount || 0) - (goal.currentAmount || 0));
      const pct = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;
      
      // Compute remaining months until deadline
      let monthsRemaining = 12; // default fallback if invalid date
      let formattedTimeLeft = "";
      let isOverdue = false;

      if (goal.deadline) {
        const dDate = new Date(goal.deadline);
        if (!isNaN(dDate.getTime())) {
          const diffMs = dDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          
          if (diffDays <= 0) {
            isOverdue = true;
            monthsRemaining = 0.5; // Ce mois-ci
            formattedTimeLeft = "Échéance ce mois / dépassée";
          } else {
            // Precise floating month count
            monthsRemaining = Math.max(0.5, diffDays / 30.4375);
            
            const totalMonthsInt = Math.floor(diffDays / 30.4375);
            const remainingDays = Math.round(diffDays % 30.4375);
            
            if (totalMonthsInt >= 12) {
              const years = Math.floor(totalMonthsInt / 12);
              const m = totalMonthsInt % 12;
              formattedTimeLeft = `${years} an${years > 1 ? "s" : ""}${m > 0 ? ` et ${m} mois` : ""}`;
            } else if (totalMonthsInt > 0) {
              formattedTimeLeft = `${totalMonthsInt} mois${remainingDays > 0 ? ` (~${diffDays}j)` : ""}`;
            } else {
              formattedTimeLeft = `${diffDays} jour${diffDays > 1 ? "s" : ""}`;
            }
          }
        }
      }

      // Required monthly rate for this specific goal
      const monthlyRequired = remaining > 0 ? Math.round(remaining / monthsRemaining) : 0;

      totalTarget += goal.targetAmount || 0;
      totalSaved += goal.currentAmount || 0;
      totalRemaining += remaining;
      totalMonthlyRequired += monthlyRequired;

      return {
        ...goal,
        remaining,
        pct,
        monthsRemaining,
        formattedTimeLeft,
        isOverdue,
        monthlyRequired
      };
    });

    // Sort items according to active selection
    items.sort((a, b) => {
      if (sortBy === "monthlyRequired") return b.monthlyRequired - a.monthlyRequired;
      if (sortBy === "remaining") return b.remaining - a.remaining;
      if (sortBy === "deadline") return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      return 0;
    });

    return {
      items,
      totalTarget,
      totalSaved,
      totalRemaining,
      totalMonthlyRequired,
      goalCount: ongoingGoals.length
    };
  }, [ongoingGoals, now, sortBy]);

  // Compute current estimated monthly net savings surplus for comparison
  const monthlyCapacityStats = useMemo(() => {
    const currentMonthKey = "2026-07";
    let salaryAmount = 35000;
    const salariesInMonth = salaires.filter(s => s.date && s.date.startsWith(currentMonthKey));
    if (salariesInMonth.length > 0) {
      salaryAmount = salariesInMonth.reduce((sum, s) => sum + s.netAmount, 0);
    }

    const otherRevenues = transactions
      .filter(t => t.type === "Revenue" && t.date && t.date.startsWith(currentMonthKey))
      .reduce((sum, t) => sum + t.amount, 0);

    const totalIncome = salaryAmount + otherRevenues;

    const activeSubs = abonnements.filter(a => a.status === "Actif");
    const totalSubsCost = activeSubs.reduce((sum, a) => sum + (a.billingPeriod === "Annuel" ? (a.costMonthly / 12) : a.costMonthly), 0);

    const totalExpenses = transactions
      .filter(t => t.type === "Dépense" && t.date && t.date.startsWith(currentMonthKey))
      .reduce((sum, t) => sum + t.amount, 0);

    const estimatedNetSurplus = Math.max(0, totalIncome - (totalSubsCost + totalExpenses));

    const gap = calculationData.totalMonthlyRequired - estimatedNetSurplus;
    const isCoverageFull = estimatedNetSurplus >= calculationData.totalMonthlyRequired;

    return {
      estimatedNetSurplus,
      gap,
      isCoverageFull,
      coveragePct: calculationData.totalMonthlyRequired > 0 
        ? Math.round((estimatedNetSurplus / calculationData.totalMonthlyRequired) * 100) 
        : 100
    };
  }, [transactions, abonnements, salaires, calculationData.totalMonthlyRequired]);

  return (
    <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 shadow-xs space-y-6">
      {/* Top Header Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600/10 border border-indigo-200/60 flex items-center justify-center text-indigo-600 shrink-0">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-neutral-900 tracking-tight">
                Calculateur d'Épargne Mensuelle Requise
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full">
                Planification Échéances
              </span>
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              Montant mensuel cumulé à mettre de côté pour atteindre 100% de vos objectifs d'épargne en cours avant leurs échéances.
            </p>
          </div>
        </div>

        {onNavigate && (
          <button
            onClick={() => onNavigate("epargnes")}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
          >
            <span>Gérer les Objectifs</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Primary KPI Summary Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Required Monthly Savings KPI */}
        <div className="bg-gradient-to-br from-indigo-900 via-neutral-900 to-slate-900 text-white rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <PiggyBank className="w-24 h-24 text-white" />
          </div>
          <div>
            <div className="flex items-center justify-between text-indigo-200 text-[10px] font-bold uppercase tracking-wider mb-1">
              <span>Épargne Requise Globale</span>
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            </div>
            <div className="flex items-baseline gap-1.5 mt-1">
              <h4 className="text-2xl font-black font-mono tracking-tight">
                <CountUpNumber value={calculationData.totalMonthlyRequired} /> MAD
              </h4>
              <span className="text-xs font-bold text-indigo-200">/ mois</span>
            </div>
          </div>
          <p className="text-[11px] text-neutral-300 font-medium mt-3 border-t border-white/10 pt-2.5">
            Necessaire pour financer simultanément vos <strong className="text-white font-bold">{calculationData.goalCount} objectifs</strong>.
          </p>
        </div>

        {/* Sum of Remaining Amount Needed */}
        <div className="bg-neutral-50 border border-neutral-200/80 rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block mb-1">
              Capital Restant À Financer
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <h4 className="text-2xl font-black font-mono text-neutral-900 tracking-tight">
                <CountUpNumber value={calculationData.totalRemaining} /> MAD
              </h4>
            </div>
          </div>
          <div className="space-y-1 mt-3 border-t border-neutral-200/60 pt-2.5">
            <div className="flex justify-between text-[11px] text-neutral-600 font-medium">
              <span>Progression Globale :</span>
              <span className="font-mono font-bold text-neutral-900">
                {calculationData.totalTarget > 0 
                  ? Math.round((calculationData.totalSaved / calculationData.totalTarget) * 100) 
                  : 0}%
              </span>
            </div>
            <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ 
                  width: `${calculationData.totalTarget > 0 
                    ? Math.min(100, (calculationData.totalSaved / calculationData.totalTarget) * 100) 
                    : 0}%` 
                }} 
              />
            </div>
          </div>
        </div>

        {/* Capacity vs Required Comparison */}
        <div className={`border rounded-2xl p-5 flex flex-col justify-between ${
          monthlyCapacityStats.isCoverageFull 
            ? "bg-emerald-50/70 border-emerald-200/90" 
            : "bg-amber-50/70 border-amber-200/90"
        }`}>
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                monthlyCapacityStats.isCoverageFull ? "text-emerald-800" : "text-amber-800"
              }`}>
                Capacité d'Épargne Estimée
              </span>
              {monthlyCapacityStats.isCoverageFull ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              )}
            </div>

            <div className="flex items-baseline gap-1 mt-1">
              <h4 className={`text-2xl font-black font-mono tracking-tight ${
                monthlyCapacityStats.isCoverageFull ? "text-emerald-950" : "text-amber-950"
              }`}>
                {monthlyCapacityStats.estimatedNetSurplus.toLocaleString("fr-FR")} MAD
              </h4>
              <span className="text-xs font-bold opacity-75">/ mois</span>
            </div>
          </div>

          <div className="mt-3 border-t border-black/5 pt-2.5">
            {monthlyCapacityStats.isCoverageFull ? (
              <p className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                <span>Capacité mensuelle suffisante (<strong className="font-mono">{monthlyCapacityStats.coveragePct}%</strong> de l'effort requis).</span>
              </p>
            ) : (
              <p className="text-[11px] text-amber-900 font-medium flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                <span>Écart de <strong className="font-mono font-bold">{monthlyCapacityStats.gap.toLocaleString("fr-FR")} MAD/mois</strong> à réallouer.</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Breakdown per Goal List Header with Controls */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-100 pb-2">
          <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <span>Détail de l'Effort Mensuel par Objectif ({calculationData.items.length})</span>
          </h4>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-neutral-400 flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3" /> Trier :
            </span>
            <div className="flex bg-neutral-100 p-0.5 rounded-lg text-[10px] font-bold">
              <button
                onClick={() => setSortBy("monthlyRequired")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  sortBy === "monthlyRequired" ? "bg-white text-neutral-900 shadow-3xs" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Épargne / mois
              </button>
              <button
                onClick={() => setSortBy("deadline")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  sortBy === "deadline" ? "bg-white text-neutral-900 shadow-3xs" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Échéance
              </button>
              <button
                onClick={() => setSortBy("remaining")}
                className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                  sortBy === "remaining" ? "bg-white text-neutral-900 shadow-3xs" : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Reste à financer
              </button>
            </div>
          </div>
        </div>

        {/* Goals List */}
        {calculationData.items.length === 0 ? (
          <div className="text-center py-8 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            <PiggyBank className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-neutral-600">Aucun objectif d'épargne en cours</p>
            <p className="text-[11px] text-neutral-400 mt-1">Ajoutez de nouveaux projets dans le module Objectifs Épargne.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {calculationData.items.map((item) => {
              const shareOfTotal = calculationData.totalMonthlyRequired > 0 
                ? Math.round((item.monthlyRequired / calculationData.totalMonthlyRequired) * 100) 
                : 0;

              return (
                <div 
                  key={item.id} 
                  className="bg-neutral-50/70 hover:bg-neutral-50 border border-neutral-200/70 hover:border-neutral-300 rounded-2xl p-4 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h5 className="text-sm font-bold text-neutral-950">{item.name}</h5>
                        {item.isOverdue && (
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-full">
                            Immédiat / Dépassé
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-neutral-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-neutral-400" />
                          Échéance : <strong className="text-neutral-700 font-mono">{item.deadline}</strong>
                        </span>
                        <span className="text-neutral-300">•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-neutral-400" />
                          Temps restant : <strong className="text-indigo-600 font-bold">{item.formattedTimeLeft}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Prominent Monthly Required Amount Badge */}
                    <div className="bg-white border border-neutral-200/90 rounded-xl px-3.5 py-2 flex items-center gap-3 shadow-3xs shrink-0 self-start sm:self-center">
                      <div className="text-right">
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">
                          Épargne Requise
                        </span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-base font-black font-mono text-indigo-700">
                            {item.monthlyRequired.toLocaleString("fr-FR")} MAD
                          </span>
                          <span className="text-[10px] font-bold text-neutral-500">/ mois</span>
                        </div>
                      </div>
                      {shareOfTotal > 0 && (
                        <div className="pl-3 border-l border-neutral-100 text-center">
                          <span className="text-[9px] text-neutral-400 block font-medium">Poids</span>
                          <span className="text-xs font-black font-mono text-neutral-700">{shareOfTotal}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Progress Bar & Amounts */}
                  <div className="space-y-1.5 pt-1 border-t border-neutral-200/40">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-neutral-500">
                        Cumulé : <strong className="text-neutral-800 font-mono">{item.currentAmount.toLocaleString("fr-FR")} MAD</strong> sur <strong className="text-neutral-800 font-mono">{item.targetAmount.toLocaleString("fr-FR")} MAD</strong>
                      </span>
                      <span className="text-neutral-600 font-medium">
                        Reste : <strong className="text-amber-700 font-mono font-bold">{item.remaining.toLocaleString("fr-FR")} MAD</strong>
                      </span>
                    </div>

                    <div className="w-full h-2 bg-neutral-200/80 rounded-full overflow-hidden flex">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          item.pct >= 100 ? "bg-emerald-500" : "bg-indigo-600"
                        }`}
                        style={{ width: `${item.pct}%` }} 
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Footer Note */}
      <div className="p-3.5 bg-neutral-50 border border-neutral-200/70 rounded-xl text-[11px] text-neutral-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
        <p>
          <strong>Méthode de calcul :</strong> Pour chaque objectif d'épargne non encore atteint, le montant restant (Cible - Montant Actuel) est divisé par le nombre exact de mois séparant la date du jour de l'échéance fixée. La somme globale indique l'effort d'épargne mensuel nécessaire pour sécuriser tous vos projets à la date prévue.
        </p>
      </div>
    </div>
  );
}
