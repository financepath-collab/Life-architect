import React, { useState, useMemo } from "react";
import { 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  ZAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell, 
  ReferenceLine,
  ReferenceArea 
} from "recharts";
import { 
  Abonnement, 
  FinanceTransaction, 
  FinanceSalaire 
} from "../types";
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Sparkles, 
  Filter, 
  Layers, 
  HelpCircle, 
  Zap, 
  Coins, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight,
  Info,
  Calendar
} from "lucide-react";

interface SubscriptionScatterChartCardProps {
  abonnements: Abonnement[];
  transactions?: FinanceTransaction[];
  salaires?: FinanceSalaire[];
}

export default function SubscriptionScatterChartCard({
  abonnements = [],
  transactions = [],
  salaires = []
}: SubscriptionScatterChartCardProps) {
  // Mode toggle: 'services' (individual subscription points) vs 'months' (historical monthly correlation)
  const [viewMode, setViewMode] = useState<"services" | "months">("services");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("Toutes");

  // Calculate estimated baseline monthly income
  const baselineMonthlyIncome = useMemo(() => {
    let salaryIncome = 0;
    if (salaires && salaires.length > 0) {
      salaryIncome = salaires.reduce((sum, s) => sum + (s.netAmount || 0), 0) / Math.max(1, salaires.length);
    }
    if (salaryIncome > 0) return salaryIncome;

    // Fallback: search revenue transactions
    const incomeTxs = transactions.filter(t => t.type === "Revenue" && t.amount > 0);
    if (incomeTxs.length > 0) {
      const sum = incomeTxs.reduce((acc, t) => acc + t.amount, 0);
      return Math.max(10000, sum / 3);
    }

    return 35000; // Default baseline if no data
  }, [salaires, transactions]);

  // Active sub list
  const activeAbonnements = useMemo(() => {
    return abonnements.filter(a => a.status === "Actif" || a.status === undefined);
  }, [abonnements]);

  // Total monthly cost of subscriptions
  const totalMonthlySubCost = useMemo(() => {
    return activeAbonnements.reduce((sum, a) => {
      const cost = a.billingPeriod === "Mensuel" ? a.costMonthly : (a.costMonthly || 0) / 12;
      return sum + cost;
    }, 0);
  }, [activeAbonnements]);

  // Subscriptions Scatter Data (Individual Services)
  const serviceScatterData = useMemo(() => {
    return activeAbonnements.map(sub => {
      const monthlyCost = sub.billingPeriod === "Mensuel" ? sub.costMonthly : (sub.costMonthly || 0) / 12;
      const annualCost = monthlyCost * 12;
      // Impact on monthly savings rate (% of monthly income consumed)
      const savingsRateImpact = baselineMonthlyIncome > 0 ? (monthlyCost / baselineMonthlyIncome) * 100 : 0;
      
      // Determine optimization priority quadrant
      let priority: "Haute" | "Moyenne" | "Faible" = "Faible";
      let color = "#10b981"; // Emerald / Green
      if (monthlyCost >= 1000 || savingsRateImpact >= 3) {
        priority = "Haute";
        color = "#f43f5e"; // Rose / Red
      } else if (monthlyCost >= 400 || savingsRateImpact >= 1.2) {
        priority = "Moyenne";
        color = "#f59e0b"; // Amber / Yellow
      }

      return {
        id: sub.id,
        name: sub.serviceName || "Service",
        xCost: Math.round(monthlyCost),
        yImpact: Number(savingsRateImpact.toFixed(2)),
        zAnnual: Math.round(annualCost),
        billingPeriod: sub.billingPeriod,
        nextBillingDate: sub.nextBillingDate,
        priority,
        color
      };
    }).sort((a, b) => b.xCost - a.xCost);
  }, [activeAbonnements, baselineMonthlyIncome]);

  // Monthly Historical Scatter Data (Monthly Total Subscriptions vs Savings Rate %)
  const monthlyScatterData = useMemo(() => {
    const monthsMap = new Map<string, { income: number; expense: number; txCount: number }>();

    // Aggregate transactions by YYYY-MM
    transactions.forEach(t => {
      if (!t.date || t.date.length < 7) return;
      const mKey = t.date.substring(0, 7);
      if (!monthsMap.has(mKey)) {
        monthsMap.set(mKey, { income: 0, expense: 0, txCount: 0 });
      }
      const item = monthsMap.get(mKey)!;
      item.txCount++;
      if (t.type === "Revenue") item.income += t.amount;
      else if (t.type === "Dépense") item.expense += t.amount;
    });

    // Fallback if empty
    if (monthsMap.size === 0) {
      const nowStr = new Date().toISOString().substring(0, 7);
      monthsMap.set(nowStr, { income: baselineMonthlyIncome, expense: 22000, txCount: 10 });
      monthsMap.set("2026-06", { income: baselineMonthlyIncome, expense: 24500, txCount: 12 });
      monthsMap.set("2026-05", { income: baselineMonthlyIncome, expense: 21000, txCount: 14 });
    }

    return Array.from(monthsMap.entries()).map(([mKey, val]) => {
      // Add salaries if present for that month
      let mIncome = val.income;
      const mSalaries = salaires.filter(s => s.date && s.date.startsWith(mKey));
      if (mSalaries.length > 0) {
        mIncome += mSalaries.reduce((sum, s) => sum + (s.netAmount || 0), 0);
      } else if (val.income === 0) {
        mIncome = baselineMonthlyIncome;
      }

      const totalExpense = val.expense + totalMonthlySubCost;
      const netSavings = mIncome - totalExpense;
      const savingsRate = mIncome > 0 ? (netSavings / mIncome) * 100 : 0;

      // Date label (e.g., "Juillet 2026")
      const [year, month] = mKey.split("-");
      const dateObj = new Date(Number(year), Number(month) - 1, 1);
      const labelStr = dateObj.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });

      return {
        monthKey: mKey,
        label: labelStr,
        xSubCost: Math.round(totalMonthlySubCost),
        ySavingsRate: Number(savingsRate.toFixed(1)),
        netSavings: Math.round(netSavings),
        income: Math.round(mIncome),
        color: savingsRate >= 25 ? "#10b981" : savingsRate >= 10 ? "#6366f1" : "#f43f5e"
      };
    });
  }, [transactions, salaires, baselineMonthlyIncome, totalMonthlySubCost]);

  // Overall impact on baseline savings rate
  const globalSubSavingsRateImpact = useMemo(() => {
    if (!baselineMonthlyIncome || baselineMonthlyIncome <= 0) return 0;
    return (totalMonthlySubCost / baselineMonthlyIncome) * 100;
  }, [totalMonthlySubCost, baselineMonthlyIncome]);

  // Potential savings rate gain if high priority subscriptions are optimized (e.g. 30% reduction)
  const potentialSavingsRateGain = useMemo(() => {
    const highPriorityCost = serviceScatterData
      .filter(s => s.priority === "Haute" || s.priority === "Moyenne")
      .reduce((acc, s) => acc + s.xCost, 0);
    const potentialMonthlySavings = highPriorityCost * 0.4; // 40% optimization
    return baselineMonthlyIncome > 0 ? (potentialMonthlySavings / baselineMonthlyIncome) * 100 : 0;
  }, [serviceScatterData, baselineMonthlyIncome]);

  // Custom Scatter Tooltip
  const CustomScatterTooltip = ({ active, payload }: any) => {
    if (!active || !payload || !payload.length) return null;
    const data = payload[0].payload;

    if (viewMode === "services") {
      return (
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 p-3.5 rounded-2xl shadow-xl text-xs space-y-2 z-50 min-w-[210px]">
          <div className="flex items-center justify-between gap-3 border-b border-neutral-100 dark:border-neutral-800 pb-2">
            <span className="font-black text-neutral-900 dark:text-neutral-100 text-sm">
              {data.name}
            </span>
            <span 
              className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                data.priority === "Haute" 
                  ? "bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 border border-rose-200 dark:border-rose-800" 
                  : data.priority === "Moyenne"
                  ? "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400 border border-amber-200 dark:border-amber-800"
                  : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800"
              }`}
            >
              Priorité {data.priority}
            </span>
          </div>

          <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
            <div className="flex justify-between">
              <span>Coût Mensuel :</span>
              <strong className="font-mono text-neutral-900 dark:text-neutral-100">{data.xCost.toLocaleString("fr-FR")} MAD</strong>
            </div>
            <div className="flex justify-between">
              <span>Coût Annuel :</span>
              <strong className="font-mono text-neutral-900 dark:text-neutral-100">{data.zAnnual.toLocaleString("fr-FR")} MAD</strong>
            </div>
            <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-bold">
              <span>Impact Taux Épargne :</span>
              <span className="font-mono">-{data.yImpact}%</span>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-400 italic">
            {data.priority === "Haute" 
              ? "💡 Service à fort impact : évaluer l'usage réel ou renégocier le tarif." 
              : "✅ Coût sous contrôle par rapport au budget global."}
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 p-3.5 rounded-2xl shadow-xl text-xs space-y-2 z-50 min-w-[210px]">
          <div className="font-black text-neutral-900 dark:text-neutral-100 border-b border-neutral-100 dark:border-neutral-800 pb-1.5 flex items-center justify-between">
            <span>Mois : {data.label}</span>
            <span className="text-[10px] text-neutral-400 font-normal">{data.monthKey}</span>
          </div>

          <div className="space-y-1 text-neutral-600 dark:text-neutral-400">
            <div className="flex justify-between">
              <span>Abonnements Total :</span>
              <strong className="font-mono text-neutral-900 dark:text-neutral-100">{data.xSubCost.toLocaleString("fr-FR")} MAD</strong>
            </div>
            <div className="flex justify-between">
              <span>Taux d'Épargne Réel :</span>
              <strong className="font-mono text-emerald-600 dark:text-emerald-400 font-black">{data.ySavingsRate}%</strong>
            </div>
            <div className="flex justify-between">
              <span>Épargne Nette :</span>
              <strong className="font-mono text-neutral-900 dark:text-neutral-100">{data.netSavings.toLocaleString("fr-FR")} MAD</strong>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm space-y-6 relative overflow-hidden transition-all">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-neutral-950 dark:text-neutral-50 uppercase tracking-tight">
                Analyse de Dispersion : Abonnements vs Taux d'Épargne
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Visualisez l'impact direct de chaque charge récurrente sur votre capacité d'épargne mensuelle.
              </p>
            </div>
          </div>
        </div>

        {/* VIEW MODE TOGGLE BUTTONS */}
        <div className="flex items-center bg-neutral-100 dark:bg-zinc-800 p-1 rounded-2xl border border-neutral-200/80 dark:border-neutral-700/60 shrink-0 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("services")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "services"
                ? "bg-white dark:bg-zinc-900 text-neutral-950 dark:text-neutral-50 shadow-xs font-black"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Par Service ({activeAbonnements.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("months")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === "months"
                ? "bg-white dark:bg-zinc-900 text-neutral-950 dark:text-neutral-50 shadow-xs font-black"
                : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Évolution Mensuelle</span>
          </button>
        </div>
      </div>

      {/* METRIC HIGHLIGHT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-neutral-50/80 dark:bg-zinc-950/50 border border-neutral-200/80 dark:border-neutral-800 p-4 rounded-2xl space-y-1">
          <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
            <span>Coût Mensuel Abonnements</span>
            <Coins className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-xl font-black text-neutral-950 dark:text-neutral-50 font-mono">
            {totalMonthlySubCost.toLocaleString("fr-FR")} <span className="text-xs font-bold text-neutral-400">MAD/mois</span>
          </div>
          <div className="text-[10px] text-neutral-400">
            Soit <strong className="text-neutral-700 dark:text-neutral-300 font-mono">{(totalMonthlySubCost * 12).toLocaleString("fr-FR")} MAD</strong> par an
          </div>
        </div>

        <div className="bg-neutral-50/80 dark:bg-zinc-950/50 border border-neutral-200/80 dark:border-neutral-800 p-4 rounded-2xl space-y-1">
          <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
            <span>Poids sur le Taux d'Épargne</span>
            <TrendingDown className="w-3.5 h-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-black text-rose-600 dark:text-rose-400 font-mono">
            -{globalSubSavingsRateImpact.toFixed(1)}%
          </div>
          <div className="text-[10px] text-neutral-400">
            Du revenu mensuel moyen ({baselineMonthlyIncome.toLocaleString("fr-FR")} MAD)
          </div>
        </div>

        <div className="bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-500/20 p-4 rounded-2xl space-y-1">
          <div className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
            <span>Potentiel Récupérable</span>
            <Zap className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
            +{potentialSavingsRateGain.toFixed(1)}% <span className="text-xs font-bold text-emerald-700/70">d'épargne</span>
          </div>
          <div className="text-[10px] text-emerald-700 dark:text-emerald-400/80">
            En rationalisant les abonnements prioritaires
          </div>
        </div>

      </div>

      {/* SCATTER CHART CONTAINER */}
      <div className="bg-neutral-50/50 dark:bg-zinc-950/30 border border-neutral-200/60 dark:border-neutral-800/80 rounded-2xl p-4 space-y-3">
        
        <div className="flex items-center justify-between text-xs font-bold text-neutral-600 dark:text-neutral-400 px-1">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-500" />
            {viewMode === "services" 
              ? "Axe X : Coût mensuel du service (MAD) • Axe Y : Impact direct sur le taux d'épargne (%)" 
              : "Axe X : Dépense totale abonnements du mois (MAD) • Axe Y : Taux d'épargne réel atteint (%)"}
          </span>
          <span className="text-[10px] text-neutral-400 font-mono">
            {viewMode === "services" ? `${serviceScatterData.length} Services` : `${monthlyScatterData.length} Mois`}
          </span>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" opacity={0.5} />
              
              <XAxis 
                type="number" 
                dataKey={viewMode === "services" ? "xCost" : "xSubCost"} 
                name="Coût Mensuel" 
                unit=" MAD"
                tickLine={false}
                stroke="#888888"
                fontSize={11}
                fontWeight={600}
              />
              
              <YAxis 
                type="number" 
                dataKey={viewMode === "services" ? "yImpact" : "ySavingsRate"} 
                name="Taux d'Épargne" 
                unit="%"
                tickLine={false}
                stroke="#888888"
                fontSize={11}
                fontWeight={600}
              />
              
              <ZAxis type="number" range={[100, 400]} />
              
              <Tooltip content={<CustomScatterTooltip />} />

              {/* Reference threshold lines */}
              {viewMode === "services" ? (
                <>
                  <ReferenceLine x={500} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: "Seuil 500 MAD", fill: "#f59e0b", fontSize: 10 }} />
                  <ReferenceLine y={2} stroke="#f43f5e" strokeDasharray="3 3" label={{ value: "Impact > 2%", fill: "#f43f5e", fontSize: 10 }} />
                </>
              ) : (
                <ReferenceLine y={20} stroke="#10b981" strokeDasharray="3 3" label={{ value: "Cible Taux Épargne 20%", fill: "#10b981", fontSize: 10 }} />
              )}

              <Scatter 
                name={viewMode === "services" ? "Abonnements" : "Mois"} 
                data={viewMode === "services" ? serviceScatterData : monthlyScatterData}
              >
                {(viewMode === "services" ? serviceScatterData : monthlyScatterData).map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    className="transition-all cursor-pointer hover:opacity-80"
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* LEGEND & ACTION RECOMMENDATIONS */}
        <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          
          <div className="flex items-center gap-4 flex-wrap text-[11px] font-bold">
            <span className="text-neutral-400">Légende :</span>
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
              Impact Fort (≥ 1 000 MAD / ≥ 3%)
            </span>
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
              Impact Moyen
            </span>
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
              Impact Faible
            </span>
          </div>

        </div>

      </div>

      {/* TOP OPTIMIZATION CANDIDATES LIST */}
      {serviceScatterData.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-500" />
            <span>Pistes d'Optimisation Prioritaires</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {serviceScatterData.slice(0, 4).map((sub) => (
              <div 
                key={sub.id} 
                className="bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-200/80 dark:border-neutral-800 p-3 rounded-2xl flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                    <span>{sub.name}</span>
                    <span className="text-[10px] text-neutral-400 font-mono">({sub.billingPeriod})</span>
                  </div>
                  <div className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Consomme <strong className="text-emerald-600 dark:text-emerald-400 font-mono">+{sub.yImpact}%</strong> du taux d'épargne potentiel
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-black text-neutral-950 dark:text-neutral-50 font-mono text-sm">
                    {sub.xCost.toLocaleString("fr-FR")} MAD<span className="text-[10px] font-normal text-neutral-400">/mo</span>
                  </div>
                  <div className="text-[10px] font-mono text-neutral-400">
                    {sub.zAnnual.toLocaleString("fr-FR")} MAD/an
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
