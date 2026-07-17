import React, { useState } from "react";
import { 
  Coins, Flame, Heart, FolderKanban, BookOpen, Star, AlertCircle, Bell, 
  ArrowRight, TrendingUp, PiggyBank, Landmark, ClipboardCheck, CheckCircle2, 
  ListTodo, Calendar, Award, Target, Trophy, Sparkles, Smile, RefreshCw, 
  Plus, Trash2, Dumbbell, Play, Pause, ExternalLink, GraduationCap, Link2, 
  BookOpenCheck, CheckSquare, Coffee, ChevronRight, Activity
} from "lucide-react";
import { 
  Account, FinanceBudget, FinanceEpargne, Abonnement, StockEntry, FinanceTransaction,
  DailyHabit, Action30Jours, WeeklyObjective, ProfilAmelioration, PossibiliteGoal, JournalEntry,
  SkinTracker, MealPlanner, ProjectFolder, EditorialEvent, BookItem, ScreenMediaItem, Formation
} from "../types";

// ==========================================
// 1. FINANCE SECTION DASHBOARD
// ==========================================
interface FinanceDashProps {
  accounts: Account[];
  budgets: FinanceBudget[];
  epargnes: FinanceEpargne[];
  abonnements: Abonnement[];
  stocks: StockEntry[];
  transactions: FinanceTransaction[];
  onNavigate: (moduleId: string) => void;
}

export function FinanceSectionDashboard({ 
  accounts, budgets, epargnes, abonnements, stocks, transactions, onNavigate 
}: FinanceDashProps) {
  // Calculations
  const totalAccountBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const totalStockValuation = stocks.reduce((sum, s) => sum + (s.currentPrice * s.quantity), 0);
  const totalEpargne = epargnes.reduce((sum, e) => sum + e.currentAmount, 0);
  const totalNetWorth = totalAccountBalance + totalStockValuation + totalEpargne;

  // Budget exceeded/spent percentages
  const exceededBudgetsCount = budgets.filter(b => b.spentAmount > b.limitAmount).length;
  const criticalBudgetsCount = budgets.filter(b => b.spentAmount >= b.limitAmount * 0.9 && b.spentAmount <= b.limitAmount).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/60 pb-4">
        <div>
          <h2 className="text-lg font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
            <Coins className="w-5 h-5 text-neutral-800" />
            <span>Tableau de bord de Trésorerie & Investissements</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Aperçu global de votre patrimoine estimé, respect budgétaire d'élite et de vos actifs financiers.
          </p>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 text-white flex flex-col justify-between h-32 shadow-sm">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Patrimoine Total</span>
          <div>
            <h4 className="text-xl font-black font-mono leading-none">
              {totalNetWorth.toLocaleString("fr-FR")} MAD
            </h4>
            <span className="text-[10px] text-neutral-400 block mt-1">Liquidités, bourse & épargne d'urgence</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between h-32 shadow-3xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Liquidités en Comptes</span>
          <div>
            <h4 className="text-xl font-bold font-mono text-neutral-900 leading-none">
              {totalAccountBalance.toLocaleString("fr-FR")} MAD
            </h4>
            <span className="text-[10px] text-neutral-400 block mt-1">{accounts.length} comptes actifs configurés</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between h-32 shadow-3xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Portefeuille Bourse (BVC)</span>
          <div>
            <h4 className="text-xl font-bold font-mono text-neutral-900 leading-none">
              {totalStockValuation.toLocaleString("fr-FR")} MAD
            </h4>
            <span className="text-[10px] text-neutral-400 block mt-1">{stocks.length} lignes d'investissement d'élite</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col justify-between h-32 shadow-3xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Cagnottes Épargne</span>
          <div>
            <h4 className="text-xl font-bold font-mono text-neutral-900 leading-none">
              {totalEpargne.toLocaleString("fr-FR")} MAD
            </h4>
            <span className="text-[10px] text-neutral-400 block mt-1">Progression projets à long terme</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enveloppes Budgétaires Status */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
              <Landmark className="w-4 h-4 text-neutral-700" />
              <span>Suivi Budgétaire d'Élite</span>
            </h3>
            {exceededBudgetsCount > 0 ? (
              <span className="text-[9px] bg-red-100 border border-red-200 text-red-800 px-2 py-0.5 rounded-full font-bold">
                {exceededBudgetsCount} Dépassés
              </span>
            ) : criticalBudgetsCount > 0 ? (
              <span className="text-[9px] bg-amber-100 border border-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-bold">
                {criticalBudgetsCount} Limites Critiques
              </span>
            ) : (
              <span className="text-[9px] bg-emerald-100 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                Tous Budgets OK
              </span>
            )}
          </div>

          <div className="space-y-3">
            {budgets.slice(0, 4).map((b, idx) => {
              const spentPct = b.limitAmount > 0 ? Math.round((b.spentAmount / b.limitAmount) * 100) : 0;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-neutral-800">
                    <span>{b.category}</span>
                    <span>{b.spentAmount.toLocaleString("fr-FR")} / {b.limitAmount.toLocaleString("fr-FR")} MAD</span>
                  </div>
                  <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        spentPct > 100 
                          ? "bg-red-500" 
                          : spentPct >= 90 
                            ? "bg-amber-500" 
                            : "bg-neutral-900"
                      }`} 
                      style={{ width: `${Math.min(100, spentPct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => onNavigate("budgets")}
            className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Optimiser et ajuster mes budgets</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Prochains Prélèvements SaaS */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
              <Bell className="w-4 h-4 text-neutral-700" />
              <span>SaaS Actifs & Prochaines Factures</span>
            </h3>
            <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full font-mono">
              {abonnements.filter(a => a.status === "Actif").length} SaaS Actifs
            </span>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {abonnements.filter(a => a.status === "Actif").slice(0, 3).map((ab) => (
              <div key={ab.id} className="p-3 bg-neutral-50 border border-neutral-200/50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-neutral-900 block">{ab.serviceName}</span>
                  <span className="text-[10px] text-neutral-400 font-medium">Facturation {ab.billingPeriod}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold font-mono text-neutral-850 block">{ab.costMonthly} MAD/m</span>
                  <span className="text-[9px] text-neutral-500 font-bold">Le {new Date(ab.nextBillingDate).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={() => onNavigate("abonnements")}
            className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Voir tous les abonnements & hébergements</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. PRODUCTIVITY SECTION DASHBOARD
// ==========================================
interface ProductivityDashProps {
  dailyHabits: DailyHabit[];
  actions30Jours: Action30Jours[];
  weeklyObjectives: WeeklyObjective[];
  profilAmeliorations: ProfilAmelioration[];
  possibilitesGoals: PossibiliteGoal[];
  journalEntries: JournalEntry[];
  streakCount: number;
  onNavigate: (moduleId: string) => void;
  onToggleHabit: (id: string) => void;
}

export function ProductivitySectionDashboard({ 
  dailyHabits, actions30Jours, weeklyObjectives, profilAmeliorations, possibilitesGoals, journalEntries, streakCount, onNavigate, onToggleHabit 
}: ProductivityDashProps) {
  // Stats
  const completedHabitsToday = dailyHabits.filter(h => h.completed).length;
  const totalHabitsCount = dailyHabits.length;
  const completed30JoursActions = actions30Jours.filter(a => a.completed).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/60 pb-4">
        <div>
          <h2 className="text-lg font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-neutral-800" />
            <span>Tableau de bord de Productivité & Alignement</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Série d'assiduité d'élite, sprints de combat et suivi d'objectifs professionnels de long terme.
          </p>
        </div>
      </div>

      {/* Streak and Habits Hero Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-neutral-900 text-white border border-neutral-800 rounded-2xl p-5 flex items-center justify-between shadow-sm">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Série de Discipline</span>
            <h4 className="text-2xl font-black font-mono leading-none flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-500 fill-amber-500 shrink-0" />
              <span>{streakCount} JOURS</span>
            </h4>
            <span className="text-[10px] text-neutral-400 block font-medium">Continuez à valider quotidiennement vos disciplines</span>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-3xs">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Habitudes Aujourd'hui</span>
            <h4 className="text-2xl font-black font-mono text-neutral-900 leading-none">
              {completedHabitsToday} / {totalHabitsCount}
            </h4>
            <div className="w-24 bg-neutral-100 h-1.5 rounded-full overflow-hidden mt-1">
              <div 
                className="bg-neutral-900 h-full rounded-full transition-all" 
                style={{ width: `${totalHabitsCount > 0 ? (completedHabitsToday / totalHabitsCount) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-3xs">
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">Progression du Sprint 30J</span>
            <h4 className="text-2xl font-black font-mono text-neutral-900 leading-none">
              {completed30JoursActions} / 30
            </h4>
            <span className="text-[10px] text-neutral-400 block font-medium">Sprint de combat et focus projet</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Todays Habits Fast Panel */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-neutral-700" />
              <span>Suivi Rapide de mes Disciplines</span>
            </h3>
            <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full font-mono">
              {completedHabitsToday} validées
            </span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {dailyHabits.map((habit) => (
              <button
                key={habit.id}
                onClick={() => onToggleHabit(habit.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all text-left cursor-pointer ${
                  habit.completed
                    ? "bg-neutral-50/50 border-neutral-200 text-neutral-400"
                    : "bg-white border-neutral-200 text-neutral-850 hover:bg-neutral-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0">
                    {habit.completed ? (
                      <CheckCircle2 className="w-4 h-4 text-neutral-900 fill-neutral-900 text-white" />
                    ) : (
                      <div className="w-4 h-4 border-2 border-neutral-300 rounded" />
                    )}
                  </div>
                  <div>
                    <span className={`text-xs font-semibold block ${habit.completed ? "line-through text-neutral-400" : "text-neutral-800"}`}>
                      {habit.name}
                    </span>
                  </div>
                </div>
                <span className="text-[8px] font-bold uppercase border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 rounded">
                  {habit.category === "professional" ? "Pro" : "Perso"}
                </span>
              </button>
            ))}
          </div>

          <button 
            onClick={() => onNavigate("habits")}
            className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Voir l'historique complet et heatmap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Starred Weekly Objectives */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
                <Target className="w-4 h-4 text-neutral-700" />
                <span>Objectifs Prioritaires de la Semaine</span>
              </h3>
              <span className="text-[10px] font-bold text-neutral-500 bg-neutral-50 px-2 py-0.5 rounded-full font-mono">
                {weeklyObjectives.filter(o => o.isPriority).length} Starred
              </span>
            </div>

            <div className="space-y-2.5">
              {weeklyObjectives.filter(o => o.isPriority).length === 0 ? (
                <div className="text-center py-8 text-xs text-neutral-400 italic">
                  Aucun objectif prioritaire épinglé pour cette semaine.
                </div>
              ) : (
                weeklyObjectives.filter(o => o.isPriority).map(obj => (
                  <div key={obj.id} className="flex items-center gap-3 p-3 bg-amber-50/20 border border-amber-100 rounded-xl">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />
                    <span className={`text-xs font-semibold text-neutral-850 ${obj.completed ? "line-through text-neutral-400" : ""}`}>
                      {obj.text}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <button 
            onClick={() => onNavigate("dashboard")}
            className="w-full py-2.5 mt-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Gérer mes objectifs sur la page d'accueil</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. HEALTH & BEAUTY SECTION DASHBOARD
// ==========================================
interface HealthDashProps {
  skinTrackers: SkinTracker[];
  mealPlanners: MealPlanner[];
  onNavigate: (moduleId: string) => void;
}

export function HealthSectionDashboard({ skinTrackers, mealPlanners, onNavigate }: HealthDashProps) {
  const todayStr = new Date().toISOString().split("T")[0];
  const todaySkinLog = skinTrackers.find(s => s.date === todayStr);
  const hydrationAmount = todaySkinLog?.waterIntakeLiters || 0;

  // Active sport timer state is purely visual on this dashboard
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/60 pb-4">
        <div>
          <h2 className="text-lg font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
            <Heart className="w-5 h-5 text-neutral-800" />
            <span>Tableau de bord de Santé & Soins</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Suivi quotidien de la routine cutanée, d'hydratation, d'activité sportive et de nutrition.
          </p>
        </div>
      </div>

      {/* Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1: Hydratation & Routine */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-3xs flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-neutral-700" />
              <span>Hydratation & Soins du Jour</span>
            </h3>
            
            <div className="p-4 bg-indigo-50/40 border border-indigo-100 rounded-2xl text-center space-y-1.5">
              <span className="text-2xl">💧</span>
              <h4 className="text-xl font-black font-mono text-indigo-950 leading-none">{hydrationAmount.toFixed(2)} L</h4>
              <span className="text-[10px] text-indigo-500 font-bold block">Objectif quotidien : 2.5 Litres</span>
              <div className="w-full bg-indigo-100/50 h-2 rounded-full overflow-hidden mt-2 border border-indigo-200/20">
                <div className="bg-indigo-600 h-full rounded-full transition-all" style={{ width: `${Math.min(100, (hydrationAmount / 2.5) * 100)}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-center">
                <span className="text-xs font-bold text-neutral-500 block uppercase tracking-wider">Matin (SPF)</span>
                <span className="text-sm font-black text-neutral-800 block mt-1">
                  {todaySkinLog?.morningRoutine ? "✅ Fait" : "❌ En attente"}
                </span>
              </div>
              <div className="p-3 bg-neutral-50 border border-neutral-200/60 rounded-xl text-center">
                <span className="text-xs font-bold text-neutral-500 block uppercase tracking-wider">Soir (Sérum)</span>
                <span className="text-sm font-black text-neutral-800 block mt-1">
                  {todaySkinLog?.eveningRoutine ? "✅ Fait" : "❌ En attente"}
                </span>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate("skin")}
            className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer text-center"
          >
            Mettre à jour mes routines de soin
          </button>
        </div>

        {/* Column 2: Sport Fast Control */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-3xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-neutral-700" />
              <span>Minuteur Focus Sport (30 min)</span>
            </h3>

            <div className="py-6 bg-neutral-50 border border-neutral-200/50 rounded-2xl flex flex-col items-center justify-center space-y-4">
              <span className="text-3xl font-mono font-black text-neutral-900 tracking-tight">{formatTime(timeRemaining)}</span>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-10 h-10 rounded-full bg-neutral-900 hover:bg-neutral-850 text-white flex items-center justify-center shadow-xs cursor-pointer select-none"
                >
                  {isPlaying ? <Pause className="w-4.5 h-4.5 fill-white text-white" /> : <Play className="w-4.5 h-4.5 fill-white text-white translate-x-0.5" />}
                </button>
                <button
                  onClick={() => {
                    setIsPlaying(false);
                    setTimeRemaining(1800);
                  }}
                  className="px-3.5 bg-white hover:bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-700 transition-all cursor-pointer"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={() => onNavigate("sport")}
            className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-750 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Ouvrir l'entraînement et exercices</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Column 3: Planificateur de Repas */}
        <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-3xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-neutral-700" />
              <span>Plan Nutritionnel de la Semaine</span>
            </h3>

            <div className="space-y-2.5 max-h-52 overflow-y-auto pr-1">
              {mealPlanners.slice(0, 3).map((meal) => (
                <div key={meal.id} className="p-3 bg-neutral-50 border border-neutral-200/50 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 block uppercase font-mono">{meal.dayOfWeek} • {meal.mealType}</span>
                    <span className="text-xs font-extrabold text-neutral-850 block mt-0.5">{meal.description}</span>
                  </div>
                  <span className="text-xs font-black font-mono text-neutral-650 bg-white border border-neutral-200/80 px-2 py-0.5 rounded-lg shrink-0 ml-2">
                    {meal.calories} kcal
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigate("meal")}
            className="w-full py-2.5 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-750 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Planifier tous mes repas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 4. PROJECTS & ACADEMY SECTION DASHBOARD
// ==========================================
interface ProjetsDashProps {
  folders: ProjectFolder[];
  formations: Formation[];
  onNavigate: (moduleId: string) => void;
}

export function ProjetsSectionDashboard({ folders, formations, onNavigate }: ProjetsDashProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/60 pb-4">
        <div>
          <h2 className="text-lg font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-neutral-800" />
            <span>Tableau de bord de Projets & Académie</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Aperçu global de vos dossiers de projets actifs, préparation de contenus et montée en compétences d'élite.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Project folders list with progress */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-neutral-700" />
              <span>Dossiers de Projets Actifs</span>
            </h3>
            <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full font-mono font-bold">
              {folders.length} Dossiers
            </span>
          </div>

          <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
            {folders.slice(0, 3).map((folder) => {
              const totalObjectives = folder.customObjectives.length;
              const completedObjectives = folder.customObjectives.filter(o => o.completed).length;
              const progressPct = totalObjectives > 0 ? Math.round((completedObjectives / totalObjectives) * 100) : 0;

              return (
                <div key={folder.id} className="p-4 bg-neutral-50 border border-neutral-200/50 rounded-2xl space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-black text-neutral-900 block">{folder.name}</span>
                      <span className="text-[10px] text-neutral-400 font-medium block truncate max-w-[200px]">{folder.description}</span>
                    </div>
                    <span className="text-[9px] bg-neutral-900 text-white border border-neutral-800 px-2 py-0.5 rounded font-bold font-mono">
                      {folder.category}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-neutral-500 font-mono">
                      <span>Progression : {completedObjectives}/{totalObjectives}</span>
                      <span>{progressPct}%</span>
                    </div>
                    <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-neutral-900 h-full rounded-full transition-all" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => onNavigate("project_folders")}
            className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer text-center"
          >
            Ouvrir mes dossiers de projets
          </button>
        </div>

        {/* Competencies / Formations */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-neutral-700" />
                <span>Montée en Compétences & Académie</span>
              </h3>
              <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full font-mono font-bold">
                {formations.filter(f => f.status === "En cours").length} En cours
              </span>
            </div>

            <div className="space-y-2.5">
              {formations.slice(0, 3).map((form) => (
                <div key={form.id} className="p-3 bg-neutral-50 border border-neutral-200/50 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-extrabold text-neutral-850 block">{form.title}</span>
                      <span className="text-[9px] text-neutral-400 font-semibold uppercase">{form.platform} • {form.instructor}</span>
                    </div>
                    <span className="text-[9px] font-bold text-neutral-500 bg-white border border-neutral-200 px-1.5 py-0.5 rounded font-mono">
                      {form.progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200/80 h-1 rounded-full overflow-hidden">
                    <div className="bg-neutral-900 h-full rounded-full" style={{ width: `${form.progressPercent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigate("formations")}
            className="w-full py-2.5 mt-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-750 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Gérer mon académie complète</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}

// ==========================================
// 5. LECTURES & SCREENS SECTION DASHBOARD
// ==========================================
interface LecturesDashProps {
  books: BookItem[];
  screenMedia: ScreenMediaItem[];
  onNavigate: (moduleId: string) => void;
}

export function LecturesSectionDashboard({ books, screenMedia, onNavigate }: LecturesDashProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-200/60 pb-4">
        <div>
          <h2 className="text-lg font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-neutral-800" />
            <span>Tableau de bord de Lectures & Écrans</span>
          </h2>
          <p className="text-xs text-neutral-500">
            Aperçu de vos lectures de développement personnel, finances, et votre file d'attente multimédia.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Books Section Progress */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
            <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-neutral-700" />
              <span>Livres En cours de Lecture</span>
            </h3>
            <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full font-mono font-bold">
              {books.filter(b => b.status === "En cours").length} Actifs
            </span>
          </div>

          <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
            {books.filter(b => b.status === "En cours").slice(0, 3).map((book) => {
              const progressPct = book.totalPages > 0 ? Math.round((book.currentPage / book.totalPages) * 100) : 0;
              return (
                <div key={book.id} className="p-4 bg-neutral-50 border border-neutral-200/50 rounded-2xl space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-xs font-black text-neutral-900 block">{book.title}</span>
                      <span className="text-[10px] text-neutral-400 font-medium block">Par {book.author}</span>
                    </div>
                    <span className="text-[9px] bg-neutral-900 text-white border border-neutral-800 px-2 py-0.5 rounded font-mono font-bold">
                      {progressPct}%
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold text-neutral-500 font-mono">
                      <span>Pages : {book.currentPage}/{book.totalPages}</span>
                    </div>
                    <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-neutral-950 h-full rounded-full" style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button 
            onClick={() => onNavigate("books")}
            className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer text-center"
          >
            Ouvrir ma bibliothèque de livres
          </button>
        </div>

        {/* Screen Media File */}
        <div className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="text-xs font-black text-neutral-950 uppercase tracking-wider flex items-center gap-2">
                <BookOpenCheck className="w-4 h-4 text-neutral-700" />
                <span>File d'Écrans & Multimédia</span>
              </h3>
              <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-700 px-2 py-0.5 rounded-full font-mono font-bold">
                {screenMedia.filter(s => s.status === "En cours").length} Actifs
              </span>
            </div>

            <div className="space-y-2.5">
              {screenMedia.filter(s => s.status === "En cours").slice(0, 3).map((media) => (
                <div key={media.id} className="p-3 bg-neutral-50 border border-neutral-200/50 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold text-neutral-850 block">{media.title}</span>
                    <span className="text-[9px] text-neutral-400 font-semibold uppercase">{media.type} • {media.platform}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold bg-white border border-neutral-200/85 text-neutral-800 px-2 py-0.5 rounded-lg font-mono">
                      Ep : {media.currentEpisode || 0} / {media.totalEpisodes || "--"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button 
            onClick={() => onNavigate("screenmedia")}
            className="w-full py-2.5 mt-4 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-750 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Gérer mes films, animes & séries</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
}
