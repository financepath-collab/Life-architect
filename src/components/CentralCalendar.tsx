import React, { useState, useMemo } from "react";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Bell, 
  ShoppingBag, 
  Layers, 
  Flame, 
  Filter, 
  X, 
  TrendingUp, 
  PiggyBank, 
  FolderKanban,
  CalendarDays,
  ListFilter,
  Grid,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  DailyHabit, 
  WeeklyObjective, 
  Action30Jours, 
  Abonnement, 
  FinanceEpargne, 
  FinanceTransaction, 
  FinanceSalaire,
  AchatMensuel
} from "../types";

export interface CentralCalendarProps {
  dailyHabits?: DailyHabit[];
  onToggleHabit?: (id: string) => void;
  weeklyObjectives?: WeeklyObjective[];
  actions30Jours?: Action30Jours[];
  abonnements?: Abonnement[];
  achatsMensuels?: AchatMensuel[];
  achatsCouteux?: any[];
  epargnes?: FinanceEpargne[];
  salaires?: FinanceSalaire[];
  transactions?: FinanceTransaction[];
  editorialEvents?: any[];
  monthlyGoals?: any[];
}

export type CalendarCategoryFilter = "all" | "finances" | "habits" | "projects";
export type CalendarViewMode = "month" | "week" | "agenda";

interface CalendarEventItem {
  id: string;
  title: string;
  subtitle?: string;
  date: Date; // standard JS Date
  dateStr: string; // YYYY-MM-DD
  type: "habit" | "subscription" | "purchase" | "epargne" | "salary" | "transaction" | "objective" | "action30" | "editorial";
  category: "finances" | "habits" | "projects";
  completed?: boolean;
  amount?: number;
  isRevenue?: boolean;
  habitId?: string;
  details?: string;
}

export default function CentralCalendar({
  dailyHabits = [],
  onToggleHabit = () => {},
  weeklyObjectives = [],
  actions30Jours = [],
  abonnements = [],
  achatsMensuels = [],
  achatsCouteux = [],
  epargnes = [],
  salaires = [],
  transactions = [],
  editorialEvents = [],
  monthlyGoals = []
}: CentralCalendarProps) {
  
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<CalendarViewMode>("month");
  const [categoryFilter, setCategoryFilter] = useState<CalendarCategoryFilter>("all");
  const [selectedDayStr, setSelectedDayStr] = useState<string | null>(null);
  const [quickTaskText, setQuickTaskText] = useState("");
  const [customEvents, setCustomEvents] = useState<CalendarEventItem[]>([]);

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const monthNames = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  // Compile all unified calendar events dynamically
  const allEvents = useMemo(() => {
    const events: CalendarEventItem[] = [...customEvents];

    // 1. Abonnements & Charges Récurrentes
    abonnements.forEach(ab => {
      let billingDay = 1;
      if (ab.nextBillingDate) {
        const parsed = new Date(ab.nextBillingDate);
        if (!isNaN(parsed.getTime())) {
          billingDay = parsed.getDate();
        }
      }
      // Create event for current month and adjacent months
      for (let m = currentMonth - 1; m <= currentMonth + 1; m++) {
        const evDate = new Date(currentYear, m, Math.min(billingDay, 28));
        const dateStr = evDate.toISOString().slice(0, 10);
        events.push({
          id: `abonnement_${ab.id}_${m}`,
          title: `Prelev. ${ab.serviceName}`,
          subtitle: `${ab.costMonthly} MAD / mois`,
          date: evDate,
          dateStr,
          type: "subscription",
          category: "finances",
          amount: ab.costMonthly,
          isRevenue: false,
          details: `Statut: ${ab.status}`
        });
      }
    });

    // 2. Achats Mensuels & Achats Coûteux
    achatsMensuels.forEach(ac => {
      const dateObj = ac.date ? new Date(ac.date) : new Date(currentYear, currentMonth, 15);
      const validDate = isNaN(dateObj.getTime()) ? new Date(currentYear, currentMonth, 15) : dateObj;
      events.push({
        id: `achat_${ac.id}`,
        title: `Achat: ${ac.itemName}`,
        subtitle: `${ac.amount} MAD (${ac.store || "Boutique"})`,
        date: validDate,
        dateStr: validDate.toISOString().slice(0, 10),
        type: "purchase",
        category: "finances",
        amount: ac.amount,
        completed: ac.status === "Acheté",
        details: `Priorité: ${ac.priority}`
      });
    });

    achatsCouteux.forEach((ac: any) => {
      const dateObj = ac.targetDate ? new Date(ac.targetDate) : new Date(currentYear, currentMonth, 20);
      const validDate = isNaN(dateObj.getTime()) ? new Date(currentYear, currentMonth, 20) : dateObj;
      events.push({
        id: `achat_couteux_${ac.id}`,
        title: `Achat Majeur: ${ac.name || ac.itemName || "Projet"}`,
        subtitle: `${ac.amount || ac.estimatedCost || 0} MAD`,
        date: validDate,
        dateStr: validDate.toISOString().slice(0, 10),
        type: "purchase",
        category: "finances",
        amount: ac.amount || ac.estimatedCost || 0,
        completed: ac.completed || ac.status === "Réalisé"
      });
    });

    // 3. Salaires & Revenus Attendus
    salaires.forEach(sal => {
      const dateObj = sal.date ? new Date(sal.date) : new Date(currentYear, currentMonth, 28);
      const validDate = isNaN(dateObj.getTime()) ? new Date(currentYear, currentMonth, 28) : dateObj;
      events.push({
        id: `salaire_${sal.id}`,
        title: `Rentrée: ${sal.source}`,
        subtitle: `${sal.netAmount} MAD net`,
        date: validDate,
        dateStr: validDate.toISOString().slice(0, 10),
        type: "salary",
        category: "finances",
        amount: sal.netAmount,
        isRevenue: true,
        details: `Statut: ${sal.status}`
      });
    });

    // 4. Objectifs d'Épargne (Échéances)
    epargnes.forEach(ep => {
      if (ep.deadline) {
        const dateObj = new Date(ep.deadline);
        if (!isNaN(dateObj.getTime())) {
          events.push({
            id: `epargne_${ep.id}`,
            title: `Échéance Épargne: ${ep.name}`,
            subtitle: `Cible: ${ep.targetAmount} MAD`,
            date: dateObj,
            dateStr: dateObj.toISOString().slice(0, 10),
            type: "epargne",
            category: "finances",
            amount: ep.targetAmount,
            completed: ep.status === "Atteint"
          });
        }
      }
    });

    // 5. Transactions enregistrées
    transactions.forEach(t => {
      const dateObj = new Date(t.date);
      if (!isNaN(dateObj.getTime())) {
        events.push({
          id: `tx_${t.id}`,
          title: t.description,
          subtitle: `${t.amount} MAD (${t.category})`,
          date: dateObj,
          dateStr: dateObj.toISOString().slice(0, 10),
          type: "transaction",
          category: "finances",
          amount: t.amount,
          isRevenue: t.type === "Revenue"
        });
      }
    });

    // 6. Habitudes & Disciplines Quotidiennes / Hebdomadaires / Mensuelles
    // Generate events for daily habits in the current month display
    const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    dailyHabits.forEach(habit => {
      const freq = habit.frequency || "Quotidien";

      if (freq === "Quotidien") {
        // Daily: place on days of current month
        for (let d = 1; d <= daysInCurrentMonth; d++) {
          const habitDate = new Date(currentYear, currentMonth, d);
          const dateStr = habitDate.toISOString().slice(0, 10);
          events.push({
            id: `habit_${habit.id}_${d}`,
            title: habit.name,
            subtitle: habit.dueTime ? `Rappel à ${habit.dueTime}` : "Habitude quotidienne",
            date: habitDate,
            dateStr,
            type: "habit",
            category: "habits",
            completed: habit.completed,
            habitId: habit.id,
            details: habit.description
          });
        }
      } else if (freq === "Hebdomadaire") {
        // Weekly: place on every Monday
        for (let d = 1; d <= daysInCurrentMonth; d++) {
          const habitDate = new Date(currentYear, currentMonth, d);
          if (habitDate.getDay() === 1) { // Monday
            const dateStr = habitDate.toISOString().slice(0, 10);
            events.push({
              id: `habit_weekly_${habit.id}_${d}`,
              title: `[Hebdo] ${habit.name}`,
              subtitle: "Routine hebdomadaire",
              date: habitDate,
              dateStr,
              type: "habit",
              category: "habits",
              completed: habit.completed,
              habitId: habit.id,
              details: habit.description
            });
          }
        }
      } else if (freq === "Mensuel") {
        // Monthly: place on 1st and 15th
        [1, 15].forEach(d => {
          if (d <= daysInCurrentMonth) {
            const habitDate = new Date(currentYear, currentMonth, d);
            const dateStr = habitDate.toISOString().slice(0, 10);
            events.push({
              id: `habit_monthly_${habit.id}_${d}`,
              title: `[Mensuel] ${habit.name}`,
              subtitle: "Discipline mensuelle",
              date: habitDate,
              dateStr,
              type: "habit",
              category: "habits",
              completed: habit.completed,
              habitId: habit.id,
              details: habit.description
            });
          }
        });
      }
    });

    // 7. Objectifs Hebdomadaires
    weeklyObjectives.forEach((obj, idx) => {
      // Place on Mondays or Fridays
      const dayNum = ((idx % 4) * 7) + 3;
      if (dayNum <= daysInCurrentMonth) {
        const objDate = new Date(currentYear, currentMonth, Math.min(dayNum, daysInCurrentMonth));
        const dateStr = objDate.toISOString().slice(0, 10);
        events.push({
          id: `weekly_obj_${obj.id}`,
          title: `Objectif Hebdo: ${obj.text}`,
          subtitle: obj.isPriority ? "★ Priorité Haute" : "Objectif Hebdomadaire",
          date: objDate,
          dateStr,
          type: "objective",
          category: "habits",
          completed: obj.completed
        });
      }
    });

    // 8. Actions 30 Jours
    actions30Jours.forEach(act => {
      const dayNum = Math.min(Math.max(act.dayNumber, 1), daysInCurrentMonth);
      const actDate = new Date(currentYear, currentMonth, dayNum);
      events.push({
        id: `act30_${act.id}`,
        title: `Sprint J${act.dayNumber}: ${act.taskDescription}`,
        subtitle: act.note ? `Note: ${act.note}` : "Action Sprint 30 Jours",
        date: actDate,
        dateStr: actDate.toISOString().slice(0, 10),
        type: "action30",
        category: "habits",
        completed: act.completed
      });
    });

    // 9. Editorial Events & Projects
    editorialEvents.forEach(ed => {
      const dateObj = ed.date ? new Date(ed.date) : new Date(currentYear, currentMonth, 10);
      if (!isNaN(dateObj.getTime())) {
        events.push({
          id: `editorial_${ed.id}`,
          title: `Pub: ${ed.title}`,
          subtitle: `${ed.channel || "Média"} • ${ed.type || "Publication"}`,
          date: dateObj,
          dateStr: dateObj.toISOString().slice(0, 10),
          type: "editorial",
          category: "projects",
          completed: ed.status === "Publié"
        });
      }
    });

    return events;
  }, [
    customEvents, abonnements, achatsMensuels, achatsCouteux, salaires, 
    epargnes, transactions, dailyHabits, weeklyObjectives, actions30Jours, 
    editorialEvents, currentMonth, currentYear
  ]);

  // Filtered Events based on active Category
  const filteredEvents = useMemo(() => {
    if (categoryFilter === "all") return allEvents;
    return allEvents.filter(ev => ev.category === categoryFilter);
  }, [allEvents, categoryFilter]);

  // Calendar Grid Generator Logic
  const monthGridDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    // Day of week for 1st of month (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    // Convert to Monday = 0, ..., Sunday = 6
    let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startingDayOfWeek === -1) startingDayOfWeek = 6;

    const daysCount = lastDayOfMonth.getDate();
    const daysArray = [];

    // Previous month filler days
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const d = prevMonthLastDay - i;
      const date = new Date(currentYear, currentMonth - 1, d);
      daysArray.push({
        date,
        dateStr: date.toISOString().slice(0, 10),
        dayNum: d,
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let d = 1; d <= daysCount; d++) {
      const date = new Date(currentYear, currentMonth, d);
      daysArray.push({
        date,
        dateStr: date.toISOString().slice(0, 10),
        dayNum: d,
        isCurrentMonth: true
      });
    }

    // Next month filler days to complete rows (multiples of 7)
    const remainingDays = (7 - (daysArray.length % 7)) % 7;
    for (let d = 1; d <= remainingDays; d++) {
      const date = new Date(currentYear, currentMonth + 1, d);
      daysArray.push({
        date,
        dateStr: date.toISOString().slice(0, 10),
        dayNum: d,
        isCurrentMonth: false
      });
    }

    return daysArray;
  }, [currentYear, currentMonth]);

  // Map events to date strings
  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEventItem[]> = {};
    filteredEvents.forEach(ev => {
      if (!map[ev.dateStr]) map[ev.dateStr] = [];
      map[ev.dateStr].push(ev);
    });
    return map;
  }, [filteredEvents]);

  // Monthly Financial & Habit Stats
  const monthStats = useMemo(() => {
    const monthEvents = filteredEvents.filter(ev => {
      return ev.date.getFullYear() === currentYear && ev.date.getMonth() === currentMonth;
    });

    let totalExpenses = 0;
    let totalRevenue = 0;
    let totalHabitsCount = 0;
    let completedHabitsCount = 0;

    monthEvents.forEach(ev => {
      if (ev.category === "finances") {
        if (ev.isRevenue && ev.amount) totalRevenue += ev.amount;
        else if (ev.amount && !ev.isRevenue) totalExpenses += ev.amount;
      }
      if (ev.type === "habit") {
        totalHabitsCount++;
        if (ev.completed) completedHabitsCount++;
      }
    });

    const habitRate = totalHabitsCount > 0 ? Math.round((completedHabitsCount / totalHabitsCount) * 100) : 0;

    return { totalExpenses, totalRevenue, totalHabitsCount, completedHabitsCount, habitRate };
  }, [filteredEvents, currentYear, currentMonth]);

  // Selected Day Details
  const selectedDayEvents = selectedDayStr ? (eventsByDate[selectedDayStr] || []) : [];

  const handleAddQuickTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskText.trim() || !selectedDayStr) return;

    const [y, m, d] = selectedDayStr.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);

    const newEv: CalendarEventItem = {
      id: `custom_${Date.now()}`,
      title: quickTaskText.trim(),
      subtitle: "Rappel personnalisé",
      date: dateObj,
      dateStr: selectedDayStr,
      type: "objective",
      category: "habits",
      completed: false
    };

    setCustomEvents(prev => [...prev, newEv]);
    setQuickTaskText("");
  };

  // Helper for Event Badge Colors
  const getBadgeStyle = (ev: CalendarEventItem) => {
    switch (ev.type) {
      case "subscription":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300 border-amber-200 dark:border-amber-800";
      case "purchase":
        return "bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-200 dark:border-rose-800";
      case "salary":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800 font-bold";
      case "epargne":
        return "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800";
      case "habit":
        return ev.completed 
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-200/60 line-through" 
          : "bg-indigo-100 text-indigo-800 dark:bg-indigo-950/80 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800";
      case "objective":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300 border-purple-200 dark:border-purple-800";
      case "action30":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/80 dark:text-blue-300 border-blue-200 dark:border-blue-800";
      case "editorial":
        return "bg-violet-100 text-violet-800 dark:bg-violet-950/80 dark:text-violet-300 border-violet-200 dark:border-violet-800";
      default:
        return "bg-neutral-100 text-neutral-800 dark:bg-zinc-800 dark:text-neutral-200 border-neutral-200";
    }
  };

  const todayStr = new Date().toISOString().slice(0, 10);

  return (
    <div id="central-calendar-container" className="space-y-6">
      
      {/* Top Header & Summary Dashboard */}
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="p-3 bg-neutral-900 text-white dark:bg-indigo-600 rounded-2xl shadow-xs shrink-0">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">
                  Planning & Calendrier Central
                </h2>
                <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider">
                  Temps Réel
                </span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Vue mensuelle unifiée des rappels financiers, abonnements, achats prévus et disciplines.
              </p>
            </div>
          </div>

          {/* Month Stats Indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200/70 dark:border-zinc-700/60 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-500 dark:text-rose-400 block font-mono">
                Charges Pervues
              </span>
              <span className="text-sm font-black text-neutral-900 dark:text-white font-mono mt-0.5 block">
                {monthStats.totalExpenses.toLocaleString("fr-FR")} MAD
              </span>
            </div>

            <div className="p-3 bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200/70 dark:border-zinc-700/60 rounded-2xl">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block font-mono">
                Rentrées
              </span>
              <span className="text-sm font-black text-neutral-900 dark:text-white font-mono mt-0.5 block">
                {monthStats.totalRevenue.toLocaleString("fr-FR")} MAD
              </span>
            </div>

            <div className="p-3 bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200/70 dark:border-zinc-700/60 rounded-2xl col-span-2 sm:col-span-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block font-mono">
                Disciplines du Mois
              </span>
              <span className="text-sm font-black text-neutral-900 dark:text-white font-mono mt-0.5 block">
                {monthStats.completedHabitsCount} / {monthStats.totalHabitsCount} ({monthStats.habitRate}%)
              </span>
            </div>
          </div>
        </div>

        {/* Calendar Control Toolbar: Month Picker, Category Filters, View Switcher */}
        <div className="pt-4 border-t border-neutral-100 dark:border-zinc-800 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Month Navigation & Today Button */}
          <div className="flex items-center justify-between lg:justify-start gap-3">
            <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-zinc-800/80 p-1 rounded-2xl border border-neutral-200/70 dark:border-zinc-700/60">
              <button 
                onClick={handlePrevMonth}
                className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-xl text-neutral-600 dark:text-neutral-300 transition-all cursor-pointer shadow-2xs"
                title="Mois précédent"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <button
                onClick={handleToday}
                className="px-3.5 py-1.5 bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white rounded-xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                Aujourd'hui
              </button>

              <button 
                onClick={handleNextMonth}
                className="p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-xl text-neutral-600 dark:text-neutral-300 transition-all cursor-pointer shadow-2xs"
                title="Mois suivant"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white font-mono min-w-[160px] text-center lg:text-left">
              {monthNames[currentMonth]} {currentYear}
            </h3>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 custom-scrollbar">
            {[
              { id: "all", label: "Tous", icon: Layers },
              { id: "finances", label: "Finances & Achats", icon: DollarSign },
              { id: "habits", label: "Tâches & Disciplines", icon: Flame },
              { id: "projects", label: "Projets & Médias", icon: FolderKanban }
            ].map(cat => {
              const Icon = cat.icon;
              const isActive = categoryFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id as CalendarCategoryFilter)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap border ${
                    isActive
                      ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-2xs"
                      : "bg-neutral-50 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 border-neutral-200/80 dark:border-zinc-700/60 hover:bg-neutral-100 dark:hover:bg-zinc-700"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-zinc-800 p-1 rounded-2xl border border-neutral-200/70 dark:border-zinc-700/60 shrink-0">
            {[
              { id: "month", label: "Grille", icon: Grid },
              { id: "week", label: "Semaine", icon: CalendarDays },
              { id: "agenda", label: "Agenda", icon: ListFilter }
            ].map(v => {
              const Icon = v.icon;
              const isActive = viewMode === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => setViewMode(v.id as CalendarViewMode)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                    isActive
                      ? "bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white shadow-2xs font-black"
                      : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{v.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* VIEW MODE 1: MONTHLY GRID */}
      {viewMode === "month" && (
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 rounded-3xl p-4 sm:p-6 shadow-sm overflow-hidden space-y-3">
          
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 text-center font-bold text-xs uppercase tracking-wider text-neutral-400 dark:text-neutral-500 border-b border-neutral-100 dark:border-zinc-800 pb-3">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mer</span>
            <span>Jeu</span>
            <span>Ven</span>
            <span className="text-rose-500/70 dark:text-rose-400/70">Sam</span>
            <span className="text-rose-500/70 dark:text-rose-400/70">Dim</span>
          </div>

          {/* Grid Cells */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2.5">
            {monthGridDays.map((dayItem, idx) => {
              const dateEvents = eventsByDate[dayItem.dateStr] || [];
              const isToday = dayItem.dateStr === todayStr;
              const isSelected = selectedDayStr === dayItem.dateStr;

              return (
                <div
                  key={`${dayItem.dateStr}_${idx}`}
                  onClick={() => setSelectedDayStr(dayItem.dateStr)}
                  className={`min-h-[90px] sm:min-h-[115px] p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between overflow-hidden relative group ${
                    !dayItem.isCurrentMonth
                      ? "bg-neutral-50/50 dark:bg-zinc-950/30 border-transparent text-neutral-300 dark:text-zinc-700"
                      : isToday
                      ? "bg-indigo-50/30 dark:bg-indigo-950/20 border-indigo-500/80 dark:border-indigo-500 text-neutral-900 dark:text-white shadow-xs"
                      : isSelected
                      ? "bg-white dark:bg-zinc-800 border-neutral-900 dark:border-white shadow-sm"
                      : "bg-white dark:bg-zinc-900 border-neutral-200/80 dark:border-zinc-800 hover:border-neutral-400 dark:hover:border-zinc-600 text-neutral-800 dark:text-neutral-200"
                  }`}
                >
                  {/* Top Bar inside cell */}
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-black font-mono w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday 
                        ? "bg-indigo-600 text-white shadow-2xs" 
                        : !dayItem.isCurrentMonth 
                        ? "text-neutral-300 dark:text-zinc-700" 
                        : "text-neutral-700 dark:text-neutral-300"
                    }`}>
                      {dayItem.dayNum}
                    </span>

                    {dateEvents.length > 0 && (
                      <span className="text-[9px] font-bold font-mono px-1.5 py-0.5 bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-400 rounded-full border border-neutral-200/60 dark:border-zinc-700/60">
                        {dateEvents.length}
                      </span>
                    )}
                  </div>

                  {/* Badges preview */}
                  <div className="space-y-1 my-1 flex-1 overflow-hidden">
                    {dateEvents.slice(0, 3).map((ev, eIdx) => (
                      <div
                        key={`${ev.id}_${eIdx}`}
                        className={`px-1.5 py-0.5 rounded-md text-[9.5px] font-medium truncate border flex items-center justify-between gap-1 ${getBadgeStyle(ev)}`}
                        title={ev.title}
                      >
                        <span className="truncate">{ev.title}</span>
                        {ev.amount && (
                          <span className="font-mono text-[8.5px] shrink-0 font-bold">
                            {ev.amount}M
                          </span>
                        )}
                      </div>
                    ))}

                    {dateEvents.length > 3 && (
                      <div className="text-[9px] text-neutral-400 font-bold font-mono text-center">
                        +{dateEvents.length - 3} de plus
                      </div>
                    )}
                  </div>

                  {/* Add action shortcut on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[9px] text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center gap-0.5 pt-0.5 border-t border-neutral-100 dark:border-zinc-800">
                    <Plus className="w-3 h-3" />
                    <span>Détails</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: WEEKLY VIEW */}
      {viewMode === "week" && (
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 rounded-3xl p-5 shadow-sm space-y-4">
          <div className="text-xs text-neutral-500 dark:text-neutral-400 font-medium flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-500" />
            <span>Vue hebdomadaire détaillée des événements pour la semaine active du mois.</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {monthGridDays.slice(0, 7).map((dItem, idx) => {
              const weekEvents = eventsByDate[dItem.dateStr] || [];
              const dayLabel = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi", "Dimanche"][idx];

              return (
                <div 
                  key={dItem.dateStr} 
                  className="bg-neutral-50 dark:bg-zinc-800/40 border border-neutral-200/80 dark:border-zinc-700/60 rounded-2xl p-3 space-y-3 min-h-[220px]"
                >
                  <div className="flex items-center justify-between border-b border-neutral-200/60 dark:border-zinc-700/60 pb-2">
                    <div>
                      <span className="text-xs font-black text-neutral-900 dark:text-white block">
                        {dayLabel}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {dItem.dateStr}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-white dark:bg-zinc-700 text-neutral-700 dark:text-neutral-200 px-2 py-0.5 rounded-full border border-neutral-200 dark:border-zinc-600">
                      {weekEvents.length}
                    </span>
                  </div>

                  <div className="space-y-1.5 max-h-[280px] overflow-y-auto custom-scrollbar">
                    {weekEvents.length === 0 ? (
                      <p className="text-[10px] text-neutral-400 italic py-4 text-center">Aucun événement</p>
                    ) : (
                      weekEvents.map(ev => (
                        <div 
                          key={ev.id} 
                          className={`p-2 rounded-xl text-xs border space-y-1 ${getBadgeStyle(ev)}`}
                        >
                          <p className="font-bold truncate">{ev.title}</p>
                          {ev.subtitle && <p className="text-[10px] opacity-80 truncate">{ev.subtitle}</p>}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* VIEW MODE 3: AGENDA LIST VIEW */}
      {viewMode === "agenda" && (
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <ListFilter className="w-4 h-4 text-indigo-500" />
              Chronologie des Événements du Mois
            </h3>
            <span className="text-xs font-mono font-bold text-neutral-500 dark:text-neutral-400">
              {filteredEvents.length} événements enregistrés
            </span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 text-neutral-400 text-xs italic">
                Aucun événement à afficher pour ce filtre.
              </div>
            ) : (
              filteredEvents
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map(ev => (
                  <div
                    key={ev.id}
                    className="p-3.5 bg-neutral-50 dark:bg-zinc-800/40 border border-neutral-200/70 dark:border-zinc-700/60 rounded-2xl flex items-center justify-between gap-4 hover:border-neutral-400 dark:hover:border-zinc-500 transition-all"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="text-center shrink-0 w-12 p-2 bg-white dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-xl">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono">
                          {monthNames[ev.date.getMonth()].slice(0, 3)}
                        </span>
                        <span className="text-sm font-black text-neutral-900 dark:text-white font-mono block">
                          {ev.date.getDate()}
                        </span>
                      </div>

                      <div className="min-w-0 space-y-0.5">
                        <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                          {ev.title}
                        </p>
                        {ev.subtitle && (
                          <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                            {ev.subtitle}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      {ev.amount && (
                        <span className={`text-xs font-black font-mono px-2.5 py-1 rounded-full border ${
                          ev.isRevenue 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300" 
                            : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300"
                        }`}>
                          {ev.isRevenue ? "+" : "-"}{ev.amount.toLocaleString("fr-FR")} MAD
                        </span>
                      )}

                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${getBadgeStyle(ev)}`}>
                        {ev.type}
                      </span>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {/* DAY INSPECTOR MODAL / DRAWER */}
      <AnimatePresence>
        {selectedDayStr && (
          <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDayStr(null)}
              className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden z-10 flex flex-col max-h-[85vh]"
            >
              {/* Header */}
              <div className="p-5 border-b border-neutral-200/80 dark:border-zinc-800 bg-neutral-50/80 dark:bg-zinc-950/50 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-xs">
                    <CalendarIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-neutral-900 dark:text-white font-mono">
                      Événements du {selectedDayStr}
                    </h3>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {selectedDayEvents.length} élément(s) prévus sur cette date
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDayStr(null)}
                  className="p-2 hover:bg-neutral-200 dark:hover:bg-zinc-800 rounded-xl text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Event List */}
              <div className="p-5 flex-1 overflow-y-auto space-y-3 custom-scrollbar">
                {selectedDayEvents.length === 0 ? (
                  <div className="text-center py-8 text-neutral-400 text-xs italic">
                    Aucun rappel financier ou tâche programmée pour cette journée.
                  </div>
                ) : (
                  selectedDayEvents.map(ev => (
                    <div
                      key={ev.id}
                      className="p-3.5 bg-neutral-50 dark:bg-zinc-800/40 border border-neutral-200/70 dark:border-zinc-700/60 rounded-2xl flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {ev.type === "habit" && ev.habitId ? (
                          <button
                            onClick={() => onToggleHabit(ev.habitId!)}
                            className="p-1 cursor-pointer shrink-0"
                            title="Changer le statut"
                          >
                            {ev.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 fill-emerald-100 dark:fill-emerald-950/60" />
                            ) : (
                              <div className="w-5 h-5 border-2 border-neutral-300 dark:border-zinc-600 rounded-full" />
                            )}
                          </button>
                        ) : (
                          <div className={`p-2 rounded-xl text-xs font-bold shrink-0 ${getBadgeStyle(ev)}`}>
                            {ev.type === "subscription" ? <Bell className="w-3.5 h-3.5" /> :
                             ev.type === "purchase" ? <ShoppingBag className="w-3.5 h-3.5" /> :
                             ev.type === "salary" ? <TrendingUp className="w-3.5 h-3.5" /> :
                             ev.type === "epargne" ? <PiggyBank className="w-3.5 h-3.5" /> :
                             <Clock className="w-3.5 h-3.5" />}
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className={`text-xs font-bold truncate ${ev.completed ? "line-through text-neutral-400 dark:text-neutral-500" : "text-neutral-900 dark:text-white"}`}>
                            {ev.title}
                          </p>
                          {ev.subtitle && (
                            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">
                              {ev.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      {ev.amount && (
                        <span className={`text-xs font-black font-mono shrink-0 px-2 py-0.5 rounded-full border ${
                          ev.isRevenue 
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300" 
                            : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300"
                        }`}>
                          {ev.isRevenue ? "+" : "-"}{ev.amount} MAD
                        </span>
                      )}
                    </div>
                  ))
                )}

                {/* Quick Add Form inside Day Inspector */}
                <form onSubmit={handleAddQuickTask} className="pt-3 border-t border-neutral-100 dark:border-zinc-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={quickTaskText}
                    onChange={(e) => setQuickTaskText(e.target.value)}
                    placeholder="Ajouter un rappel ou tâche rapide pour ce jour..."
                    className="flex-1 bg-neutral-100 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-medium text-neutral-800 dark:text-neutral-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Ajouter
                  </button>
                </form>
              </div>

              {/* Footer */}
              <div className="p-3 bg-neutral-50 dark:bg-zinc-950/50 border-t border-neutral-200/80 dark:border-zinc-800 flex justify-end shrink-0">
                <button
                  onClick={() => setSelectedDayStr(null)}
                  className="px-4 py-1.5 bg-neutral-200 hover:bg-neutral-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-neutral-800 dark:text-neutral-200 text-xs font-bold rounded-xl cursor-pointer transition-all"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
