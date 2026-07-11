import React from "react";
import { 
  FinanceTransaction, 
  FinanceBudget, 
  StockEntry, 
  FinanceEpargne, 
  Abonnement 
} from "../types";
import { 
  TrendingUp, 
  TrendingDown, 
  Coins, 
  Wallet, 
  PieChart, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

interface FinanceChartsProps {
  transactions: FinanceTransaction[];
  budgets: FinanceBudget[];
  stocks: StockEntry[];
  epargnes: FinanceEpargne[];
  abonnements: Abonnement[];
}

export default function FinanceCharts({
  transactions = [],
  budgets = [],
  stocks = [],
  epargnes = [],
  abonnements = []
}: FinanceChartsProps) {
  // 1. Calculate general numbers
  const totalInflow = transactions
    .filter(t => t.type === "Revenue")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalOutflow = transactions
    .filter(t => t.type === "Dépense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netSavings = totalInflow - totalOutflow;

  const stockPortfolioCost = stocks.reduce((acc, s) => acc + s.buyPrice * s.quantity, 0);
  const stockPortfolioValue = stocks.reduce((acc, s) => acc + s.currentPrice * s.quantity, 0);
  const stockProfitLoss = stockPortfolioValue - stockPortfolioCost;

  const totalMonthlyAbonnements = abonnements
    .filter(a => a.status === "Actif")
    .reduce((sum, a) => {
      return sum + (a.billingPeriod === "Mensuel" ? a.costMonthly : a.costMonthly / 12);
    }, 0);

  // 2. Build Category Aggregations for expenditures
  const expensesByCategory = React.useMemo(() => {
    const map: { [key: string]: number } = {};
    transactions
      .filter(t => t.type === "Dépense")
      .forEach(t => {
        map[t.category] = (map[t.category] || 0) + t.amount;
      });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [transactions]);

  const maxExpenseCategoryAmount = expensesByCategory[0]?.[1] || 1;

  // 3. Build monthly budgets overview
  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.limitAmount, 0);
  const totalBudgetSpent = budgets.reduce((sum, b) => sum + b.spentAmount, 0);
  const budgetUtilizationRate = totalBudgetLimit > 0 ? (totalBudgetSpent / totalBudgetLimit) * 100 : 0;

  return (
    <div className="space-y-6">
      
      {/* 4 Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenues */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Entrées</span>
            <h4 className="text-xl font-bold font-mono text-emerald-600">
              +{totalInflow.toLocaleString("fr-FR")} MAD
            </h4>
            <span className="text-[10px] text-neutral-400 font-medium">Revenus et virements reçus</span>
          </div>
          <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 border border-emerald-100">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Total Expenses */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total Dépenses</span>
            <h4 className="text-xl font-bold font-mono text-rose-600">
              -{totalOutflow.toLocaleString("fr-FR")} MAD
            </h4>
            <span className="text-[10px] text-neutral-400 font-medium">Dépenses réelles comptabilisées</span>
          </div>
          <div className="p-3 bg-rose-50 rounded-xl text-rose-600 border border-rose-100">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>

        {/* Net Savings Cash Flow */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Trésorerie Nette</span>
            <h4 className={`text-xl font-bold font-mono ${netSavings >= 0 ? "text-neutral-900" : "text-amber-600"}`}>
              {netSavings >= 0 ? "+" : ""}{netSavings.toLocaleString("fr-FR")} MAD
            </h4>
            <span className="text-[10px] text-neutral-400 font-medium">Flux net disponible de la période</span>
          </div>
          <div className="p-3 bg-neutral-100 rounded-xl text-neutral-900 border border-neutral-200">
            <Coins className="w-5 h-5" />
          </div>
        </div>

        {/* Portfolio Valuation */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Portefeuille Actions</span>
            <h4 className="text-xl font-bold font-mono text-neutral-900">
              {stockPortfolioValue.toLocaleString("fr-FR")} MAD
            </h4>
            <span className={`text-[10px] font-semibold ${stockProfitLoss >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
              {stockProfitLoss >= 0 ? "▲" : "▼"} {stockProfitLoss >= 0 ? "+" : ""}{stockProfitLoss.toLocaleString("fr-FR")} MAD
            </span>
          </div>
          <div className="p-3 bg-neutral-100 rounded-xl text-neutral-900 border border-neutral-200">
            <Wallet className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid of charts and metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left column: Budget and Savings goals */}
        <div className="space-y-6">
          {/* Global Budget Health */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-neutral-800" />
                <span>Utilisation des Budgets Mensuels</span>
              </h3>
              <span className={`text-xs font-semibold font-mono px-2.5 py-0.5 rounded-full border ${
                budgetUtilizationRate > 85 
                  ? "bg-rose-50 border-rose-100 text-rose-700" 
                  : "bg-emerald-50 border-emerald-100 text-emerald-700"
              }`}>
                {budgetUtilizationRate.toFixed(1)}% Consommé
              </span>
            </div>

            <div className="space-y-3.5">
              <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-700 ${
                    budgetUtilizationRate > 85 ? "bg-rose-600" : "bg-neutral-900"
                  }`}
                  style={{ width: `${Math.min(100, budgetUtilizationRate)}%` }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <span className="text-neutral-400 text-[9px] block font-sans font-bold">TOTAL ALLOUÉ</span>
                  <span className="text-neutral-800 font-bold">{totalBudgetLimit.toLocaleString("fr-FR")} MAD</span>
                </div>
                <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                  <span className="text-neutral-400 text-[9px] block font-sans font-bold">TOTAL DÉPENSÉ</span>
                  <span className="text-neutral-800 font-bold">{totalBudgetSpent.toLocaleString("fr-FR")} MAD</span>
                </div>
              </div>

              {/* Individual budget breakdown */}
              <div className="space-y-2.5 pt-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Suivi par catégorie</span>
                {budgets.slice(0, 4).map(b => {
                  const rate = b.limitAmount > 0 ? (b.spentAmount / b.limitAmount) * 100 : 0;
                  return (
                    <div key={b.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-700 font-semibold">{b.category}</span>
                        <span className="text-neutral-500 font-mono">
                          {b.spentAmount} / <span className="text-neutral-400">{b.limitAmount} MAD</span>
                        </span>
                      </div>
                      <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${rate > 90 ? "bg-rose-600" : "bg-neutral-900"}`} 
                          style={{ width: `${Math.min(100, rate)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Savings Goals performance */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-neutral-800" />
              <span>Progression de l'Épargne & Objectifs</span>
            </h3>

            <div className="space-y-3">
              {epargnes.map(goal => {
                const rate = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                return (
                  <div key={goal.id} className="bg-neutral-50/50 border border-neutral-200 p-3.5 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-neutral-800">{goal.name}</span>
                        <span className="text-[9px] text-neutral-400 block font-mono">Échéance : {goal.deadline}</span>
                      </div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-900 text-white">
                        {rate.toFixed(0)}%
                      </span>
                    </div>

                    <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-neutral-900 h-full rounded-full transition-all duration-700" 
                        style={{ width: `${Math.min(100, rate)}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-[10px] font-mono text-neutral-500">
                      <span>Cumulé : {goal.currentAmount.toLocaleString("fr-FR")} MAD</span>
                      <span>Cible : {goal.targetAmount.toLocaleString("fr-FR")} MAD</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Expenditures breakdown & Monthly Subscriptions */}
        <div className="space-y-6">
          
          {/* Expenditures by Category Chart */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <h3 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-500" />
              <span>Dépenses par Catégorie</span>
            </h3>

            <div className="space-y-4">
              {expensesByCategory.length === 0 ? (
                <div className="text-xs text-neutral-400 italic text-center py-12">
                  Aucune dépense enregistrée pour afficher la répartition.
                </div>
              ) : (
                expensesByCategory.map(([cat, amount]) => {
                  const percentage = totalOutflow > 0 ? (amount / totalOutflow) * 100 : 0;
                  const ratio = (amount / maxExpenseCategoryAmount) * 100;
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-neutral-700 font-semibold">{cat}</span>
                        <div className="font-mono text-right">
                          <span className="text-neutral-900 font-bold">{amount.toLocaleString("fr-FR")} MAD</span>
                          <span className="text-neutral-400 text-[10px] ml-1.5">({percentage.toFixed(0)}%)</span>
                        </div>
                      </div>
                      <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-neutral-900 h-full rounded-full transition-all duration-500" 
                          style={{ width: `${ratio}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Subscriptions cost impact */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-neutral-950 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-neutral-800" />
                <span>Impact de vos Abonnements</span>
              </h3>
              <span className="text-xs font-mono text-neutral-900 bg-neutral-100 px-2.5 py-1 rounded-lg border border-neutral-200 font-bold">
                {totalMonthlyAbonnements.toLocaleString("fr-FR")} MAD / mois
              </span>
            </div>

            <p className="text-xs text-neutral-500 leading-relaxed">
              Vos abonnements actifs récurrents s'élèvent à un total mensuel estimé de <span className="text-neutral-800 font-semibold">{totalMonthlyAbonnements.toFixed(0)} MAD</span>, soit environ <span className="text-neutral-800 font-semibold">{(totalMonthlyAbonnements * 12).toLocaleString("fr-FR")} MAD par an</span>.
            </p>

            <div className="space-y-2">
              {abonnements.filter(a => a.status === "Actif").slice(0, 4).map(sub => (
                <div key={sub.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-neutral-800">{sub.serviceName}</span>
                    <span className="text-[9px] text-neutral-400 block">Prochain prélèvement : {sub.nextBillingDate}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-neutral-700">
                    {sub.costMonthly} MAD / {sub.billingPeriod === "Mensuel" ? "mois" : "an"}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
