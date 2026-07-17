import React, { useState, useMemo } from "react";
import { 
  Sparkles, 
  Check, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight, 
  Coins, 
  Lightbulb, 
  Percent, 
  ChevronDown, 
  ChevronUp,
  AlertCircle,
  PiggyBank
} from "lucide-react";
import { FinanceBudget, FinanceTransaction } from "../types";

interface BudgetOptimizerProps {
  transactions: FinanceTransaction[];
  budgets: FinanceBudget[];
  onUpdateBudgetLimit: (category: string, newLimit: number) => void;
  onUpdateAllBudgets: (updatedBudgets: FinanceBudget[]) => void;
  triggerToast: (message: string, type: "success" | "error" | "info") => void;
}

interface CategoryTrend {
  category: string;
  m1Amount: number; // 2 months ago
  m2Amount: number; // 1 month ago
  m3Amount: number; // current month
  average: number;
  trendType: "up" | "down" | "stable" | "none";
  trendPercentage: number;
  currentLimit: number;
  suggestedLimit: number;
  potentialSavings: number;
  reason: string;
}

export default function BudgetOptimizer({
  transactions,
  budgets,
  onUpdateBudgetLimit,
  onUpdateAllBudgets,
  triggerToast
}: BudgetOptimizerProps) {
  const [isOpen, setIsOpen] = useState(true);

  // Helper to map transaction category to budget category
  const mapTransactionCategoryToBudgetCategory = (txCategory: string, budgetCategories: string[]): string => {
    if (!txCategory) return "Autres";
    const normTx = txCategory.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

    const mappings: { [key: string]: string } = {
      alimentation: "Alimentation",
      courses: "Alimentation",
      supermarche: "Alimentation",
      carrefour: "Alimentation",
      bim: "Alimentation",
      nourriture: "Alimentation",
      resto: "Alimentation",
      restaurant: "Alimentation",
      repas: "Alimentation",
      cafe: "Alimentation",
      café: "Alimentation",

      equipement: "Équipement & Matériel",
      materiel: "Équipement & Matériel",
      bureau: "Équipement & Matériel",
      mobilier: "Équipement & Matériel",
      shure: "Équipement & Matériel",
      sony: "Équipement & Matériel",
      camera: "Équipement & Matériel",
      clavier: "Équipement & Matériel",
      souris: "Équipement & Matériel",
      macbook: "Équipement & Matériel",
      pc: "Équipement & Matériel",
      ordinateur: "Équipement & Matériel",

      logiciel: "Logiciels & SaaS",
      logiciels: "Logiciels & SaaS",
      saas: "Logiciels & SaaS",
      adobe: "Logiciels & SaaS",
      canva: "Logiciels & SaaS",
      chatgpt: "Logiciels & SaaS",
      openai: "Logiciels & SaaS",
      hosting: "Logiciels & SaaS",
      hostinger: "Logiciels & SaaS",
      cloud: "Logiciels & SaaS",
      subscriptions: "Logiciels & SaaS",
      abonnement: "Logiciels & SaaS",
      abonnements: "Logiciels & SaaS",
      vpn: "Logiciels & SaaS",

      marketing: "Marketing & Publicité",
      publicite: "Marketing & Publicité",
      pub: "Marketing & Publicité",
      ads: "Marketing & Publicité",
      sponsor: "Marketing & Publicité",
      sponsoring: "Marketing & Publicité",
      google_ads: "Marketing & Publicité",
      facebook_ads: "Marketing & Publicité",
      tiktok_ads: "Marketing & Publicité",

      transport: "Transport & Carburant",
      carburant: "Transport & Carburant",
      essence: "Transport & Carburant",
      gazole: "Transport & Carburant",
      autoroute: "Transport & Carburant",
      peage: "Transport & Carburant",
      uber: "Transport & Carburant",
      taxi: "Transport & Carburant",
      train: "Transport & Carburant",
      vol: "Transport & Carburant",

      loisir: "Loisirs & Sorties",
      loisirs: "Loisirs & Sorties",
      sortie: "Loisirs & Sorties",
      sorties: "Loisirs & Sorties",
      cinema: "Loisirs & Sorties",
      voyage: "Loisirs & Sorties",
      hotel: "Loisirs & Sorties",
      vacances: "Loisirs & Sorties",
      netflix: "Loisirs & Sorties",
      spotify: "Loisirs & Sorties"
    };

    // 1. Direct word-based dictionary mapping
    for (const [key, value] of Object.entries(mappings)) {
      if (normTx.includes(key)) {
        return value;
      }
    }

    // 2. Fallback to substring matching on the budget list
    const matched = budgetCategories.find(bc => {
      const normBc = bc.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return normBc.includes(normTx) || normTx.includes(normBc);
    });

    return matched || "Autres";
  };

  const roundBudget = (amount: number): number => {
    if (amount <= 0) return 0;
    if (amount < 300) {
      return Math.round(amount / 10) * 10;
    }
    if (amount < 1500) {
      return Math.round(amount / 50) * 50;
    }
    return Math.round(amount / 100) * 100;
  };

  // Main calculations for trends
  const trendAnalysis = useMemo(() => {
    const budgetCategories = budgets.map(b => b.category);
    if (budgetCategories.length === 0) return { trends: [], totalSavings: 0, monthsLabels: [] };

    // 1. Determine anchor date (latest transaction or current system date)
    let anchorDate = new Date("2026-07-17"); // Match metadata year
    if (transactions.length > 0) {
      const dates = transactions.map(t => new Date(t.date).getTime()).filter(t => !isNaN(t));
      if (dates.length > 0) {
        anchorDate = new Date(Math.max(...dates));
      }
    }

    // 2. Identify the last 3 months
    const months: { year: number; month: number; label: string }[] = [];
    for (let i = 0; i < 3; i++) {
      const d = new Date(anchorDate.getFullYear(), anchorDate.getMonth() - i, 1);
      months.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1,
        label: d.toLocaleString("fr-FR", { month: "short", year: "numeric" })
      });
    }
    // Sort chronological: months[2] = 2 months ago, months[1] = 1 month ago, months[0] = current month
    months.reverse();

    // 3. Compute expenditures by category for these 3 months
    const expensesByCategory: { [cat: string]: number[] } = {};
    budgetCategories.forEach(cat => {
      expensesByCategory[cat] = [0, 0, 0];
    });

    transactions.forEach(t => {
      const typeStr = String(t.type || "").trim().toLowerCase();
      const isExpense = typeStr === "dépense" || typeStr === "depense" || typeStr.includes("depense") || typeStr.includes("dépense");
      if (!isExpense) return;

      const d = new Date(t.date);
      if (isNaN(d.getTime())) return;

      const ty = d.getFullYear();
      const tm = d.getMonth() + 1;

      const monthIndex = months.findIndex(m => m.year === ty && m.month === tm);
      if (monthIndex !== -1) {
        const mappedCat = mapTransactionCategoryToBudgetCategory(t.category, budgetCategories);
        if (expensesByCategory[mappedCat]) {
          expensesByCategory[mappedCat][monthIndex] += Number(t.amount) || 0;
        }
      }
    });

    // 4. Generate recommendations for each category
    const trends: CategoryTrend[] = [];
    let totalSavings = 0;

    budgets.forEach(b => {
      const amounts = expensesByCategory[b.category] || [0, 0, 0];
      const [m1, m2, m3] = amounts; // m1: 2 months ago, m2: 1 month ago, m3: current month
      
      const hasHistory = m1 > 0 || m2 > 0 || m3 > 0;
      const activeMonthsCount = amounts.filter(a => a > 0).length;
      const average = hasHistory ? (m1 + m2 + m3) / (activeMonthsCount || 3) : 0;

      let trendType: "up" | "down" | "stable" | "none" = "none";
      let trendPercentage = 0;
      let suggestedLimit = b.limitAmount;
      let reason = "";

      if (hasHistory) {
        // Calculate trend percentage (from month 1 to month 3)
        // If m1 is zero, look at m2
        const startAmount = m1 > 0 ? m1 : (m2 > 0 ? m2 : m3);
        const endAmount = m3;

        if (startAmount > 0 && startAmount !== endAmount) {
          trendPercentage = ((endAmount - startAmount) / startAmount) * 100;
          if (trendPercentage > 10) trendType = "up";
          else if (trendPercentage < -10) trendType = "down";
          else trendType = "stable";
        } else {
          trendType = "stable";
          trendPercentage = 0;
        }

        // Suggest budgets based on the trend
        if (trendType === "up") {
          // Curvature: spending is rising. Recommend 15% reduction of the highest month to prevent drift, or average
          const draftLimit = average * 0.95;
          suggestedLimit = roundBudget(Math.min(b.limitAmount, Math.max(average * 0.9, draftLimit)));
          reason = "Dépenses en hausse de " + Math.round(trendPercentage) + "% sur 3 mois. Optimisation corrective de -5% à -10% recommandée pour freiner la dérive.";
        } else if (trendType === "down") {
          // Spending is decreasing. Recommend locking in the savings by aligning the budget with m3 + 10% safety buffer
          const draftLimit = m3 * 1.08;
          suggestedLimit = roundBudget(Math.min(b.limitAmount, draftLimit));
          reason = "Excellente tendance ! Dépenses en baisse de " + Math.abs(Math.round(trendPercentage)) + "%. Ajustement à votre niveau réel actuel (+8% de marge de confort).";
        } else {
          // Stable spending. Recommend 5% optimization of average.
          suggestedLimit = roundBudget(average * 0.95);
          reason = "Dépenses relativement stables. Ajustement préventif de -5% par rapport à votre moyenne historique pour libérer du capital d'épargne.";
        }
      } else {
        // No historical transactions found in these 3 months for this category
        trendType = "none";
        suggestedLimit = roundBudget(b.limitAmount * 0.95); // default preventive reduction
        reason = "Aucune dépense enregistrée sur les 3 derniers mois. Nous suggérons une réduction préventive de 5% de l'enveloppe inutilisée.";
      }

      // If suggested limit ends up higher than the current budget limit, we cap it at current limit unless average is higher
      if (suggestedLimit > b.limitAmount && average < b.limitAmount) {
        suggestedLimit = b.limitAmount;
      }

      // Avoid suggesting negative or zero limit
      if (suggestedLimit <= 0) {
        suggestedLimit = roundBudget(b.limitAmount || 500);
      }

      const potentialSavings = Math.max(0, b.limitAmount - suggestedLimit);
      totalSavings += potentialSavings;

      trends.push({
        category: b.category,
        m1Amount: m1,
        m2Amount: m2,
        m3Amount: m3,
        average,
        trendType,
        trendPercentage,
        currentLimit: b.limitAmount,
        suggestedLimit,
        potentialSavings,
        reason
      });
    });

    return {
      trends,
      totalSavings,
      monthsLabels: months.map(m => m.label)
    };
  }, [transactions, budgets]);

  const handleApplySingle = (category: string, suggestedLimit: number) => {
    onUpdateBudgetLimit(category, suggestedLimit);
    triggerToast(`Budget de "${category}" ajusté avec succès à ${suggestedLimit.toLocaleString()} MAD !`, "success");
  };

  const handleApplyAll = () => {
    const updated = budgets.map(b => {
      const match = trendAnalysis.trends.find(t => t.category === b.category);
      if (match) {
        return { ...b, limitAmount: match.suggestedLimit };
      }
      return b;
    });
    onUpdateAllBudgets(updated);
    triggerToast(`Optimisation globale appliquée ! Vous venez de libérer ${trendAnalysis.totalSavings.toLocaleString()} MAD d'épargne mensuelle potentielle.`, "success");
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl p-6 shadow-xs space-y-4">
      {/* Header section with toggle */}
      <div 
        className="flex items-center justify-between cursor-pointer select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2.5">
          <span className="p-2 bg-neutral-950 dark:bg-neutral-800 text-white rounded-xl shadow-xs">
            <Sparkles className="w-4 h-4 text-neutral-100" />
          </span>
          <div>
            <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-50 uppercase tracking-tight flex items-center gap-1.5">
              Optimiseur de Budget Intellectuel (3 mois)
              <span className="text-[9px] bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold px-1.5 py-0.5 rounded-full lowercase font-mono">
                bêta-algorithme
              </span>
            </h3>
            <p className="text-[11px] text-neutral-400 font-medium">
              Analyse prédictive de vos tendances de dépenses sur les 3 derniers mois pour recalibrer vos enveloppes de vie.
            </p>
          </div>
        </div>

        <button className="p-1.5 rounded-lg hover:bg-neutral-50 dark:hover:bg-zinc-800 text-neutral-400 dark:text-neutral-500 transition-all">
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {isOpen && (
        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-5 animate-in fade-in duration-200">
          
          {/* Summary Box & CTA */}
          <div className="bg-neutral-50/60 dark:bg-zinc-950/40 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-start gap-3">
              <span className="p-2.5 bg-neutral-900/5 dark:bg-neutral-50/5 text-neutral-900 dark:text-neutral-100 rounded-xl">
                <PiggyBank className="w-5 h-5 text-neutral-900 dark:text-neutral-200" />
              </span>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider font-mono">
                  Économie Mensuelle Optimisée Potentielle
                </h4>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-2xl font-black font-mono text-neutral-950 dark:text-white tracking-tight">
                    +{trendAnalysis.totalSavings.toLocaleString("fr-FR")}
                  </span>
                  <span className="text-xs font-bold text-neutral-400 font-mono">MAD / mois</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-medium">
                  En ajustant vos plafonds actuels selon vos tendances réelles, vous redirigez ce capital vers vos comptes d'épargne d'élite.
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <button
                onClick={handleApplyAll}
                disabled={trendAnalysis.totalSavings === 0}
                className="w-full md:w-auto flex items-center justify-center gap-2 bg-neutral-950 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Appliquer toutes les optimisations</span>
              </button>
            </div>
          </div>

          {/* List of categories analyzed */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {trendAnalysis.trends.map((t) => {
              // Get color markers based on trend
              const trendMarker = {
                up: {
                  bg: "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/40",
                  icon: <TrendingUp className="w-3.5 h-3.5 text-red-500" />,
                  text: "En hausse",
                  color: "text-red-600"
                },
                down: {
                  bg: "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-800 dark:border-neutral-700",
                  icon: <TrendingDown className="w-3.5 h-3.5 text-neutral-400" />,
                  text: "En baisse",
                  color: "text-neutral-500"
                },
                stable: {
                  bg: "bg-neutral-50 dark:bg-zinc-850 text-neutral-700 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800",
                  icon: <AlertCircle className="w-3.5 h-3.5 text-neutral-400" />,
                  text: "Stable",
                  color: "text-neutral-600"
                },
                none: {
                  bg: "bg-neutral-50/50 dark:bg-zinc-850/50 text-neutral-400 dark:text-neutral-500 border-neutral-200/30 dark:border-neutral-800/30",
                  icon: <AlertCircle className="w-3.5 h-3.5 text-neutral-300" />,
                  text: "Inactif",
                  color: "text-neutral-400"
                }
              }[t.trendType];

              return (
                <div 
                  key={t.category}
                  className="bg-neutral-50/20 dark:bg-zinc-950/10 border border-neutral-200/60 dark:border-neutral-800/60 rounded-2xl p-4 space-y-4 shadow-3xs flex flex-col justify-between"
                >
                  {/* Category & Trend Indicator */}
                  <div className="flex items-center justify-between gap-2.5">
                    <span className="text-xs font-extrabold text-neutral-900 dark:text-neutral-50">
                      {t.category}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${trendMarker.bg}`}>
                      {trendMarker.icon}
                      <span>{trendMarker.text}</span>
                      {t.trendType !== "none" && t.trendType !== "stable" && (
                        <span>{Math.round(Math.abs(t.trendPercentage))}%</span>
                      )}
                    </span>
                  </div>

                  {/* Monthly breakdown */}
                  <div className="bg-white dark:bg-zinc-900/60 border border-neutral-100 dark:border-neutral-800/40 rounded-xl p-3 grid grid-cols-3 gap-2.5 text-center shadow-3xs">
                    {trendAnalysis.monthsLabels.map((mLabel, idx) => {
                      const val = [t.m1Amount, t.m2Amount, t.m3Amount][idx];
                      return (
                        <div key={mLabel} className="space-y-0.5">
                          <span className="text-[9px] text-neutral-400 dark:text-neutral-500 block font-bold uppercase tracking-wider">
                            {mLabel}
                          </span>
                          <span className="text-xs font-bold font-mono text-neutral-850 dark:text-neutral-200">
                            {val > 0 ? `${Math.round(val).toLocaleString()} MAD` : "0 MAD"}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recommendation logic description */}
                  <div className="flex gap-2 text-[10px] text-neutral-500 dark:text-neutral-400 leading-relaxed italic bg-neutral-50 dark:bg-zinc-850/40 px-3 py-2.5 rounded-xl border border-neutral-200/30 dark:border-neutral-800/20">
                    <Lightbulb className="w-3.5 h-3.5 text-neutral-800 dark:text-neutral-200 shrink-0 mt-0.5" />
                    <span>{t.reason}</span>
                  </div>

                  {/* Comparison Row & action button */}
                  <div className="flex items-center justify-between pt-2 border-t border-neutral-150/40 dark:border-neutral-800/30 gap-4">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-[8px] text-neutral-400 dark:text-neutral-500 font-bold block uppercase tracking-wider">Actuel</span>
                        <span className="text-xs font-extrabold text-neutral-550 dark:text-neutral-400 font-mono">
                          {t.currentLimit.toLocaleString()} MAD
                        </span>
                      </div>
                      <ArrowRight className="w-3 h-3 text-neutral-300 dark:text-neutral-600" />
                      <div>
                        <span className="text-[8px] text-neutral-400 dark:text-neutral-500 font-bold block uppercase tracking-wider">Suggéré</span>
                        <span className="text-xs font-black text-neutral-950 dark:text-white font-mono flex items-center gap-1">
                          {t.suggestedLimit.toLocaleString()} MAD
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleApplySingle(t.category, t.suggestedLimit)}
                      disabled={t.currentLimit === t.suggestedLimit}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all select-none cursor-pointer ${
                        t.currentLimit === t.suggestedLimit
                          ? "bg-neutral-100 dark:bg-zinc-800 text-neutral-400 dark:text-neutral-600"
                          : "bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 shadow-3xs"
                      }`}
                    >
                      <Check className="w-3 h-3" />
                      <span>Appliquer</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}
