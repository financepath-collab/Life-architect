import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Circle,
  Sparkles,
  ArrowUpRight,
  Flame,
  CheckSquare,
  Square,
  Droplets,
  Sun,
  Moon,
  Coins,
  FolderKanban,
  Check,
  Filter,
  Clock,
  ExternalLink,
  Zap,
  GripVertical,
  MoveRight,
  AlertCircle,
  AlertTriangle
} from "lucide-react";
import {
  DailyHabit,
  WeeklyObjective,
  Action30Jours,
  ProjectFolder,
  SkinTracker,
  Abonnement,
  AchatMensuel,
  FinanceTransaction,
  FinanceEpargne
} from "../types";

export type CalendarFilterCategory = "TOUS" | "HABIT" | "PROJET" | "FINANCE" | "SKIN CARE";

interface DashboardUnifiedCalendarProps {
  dailyHabits: DailyHabit[];
  habitHistory: Record<string, string[]>;
  onToggleHabitForDate: (habitId: string, dateStr: string) => void;
  weeklyObjectives: WeeklyObjective[];
  onToggleWeeklyObjective: (id: string) => void;
  actions30Jours: Action30Jours[];
  onToggleAction30Jours: (id: string) => void;
  folders: ProjectFolder[];
  onToggleFolderObjective: (folderId: string, objId: string) => void;
  skinTrackers: SkinTracker[];
  onToggleSkinRoutineForDate: (dateStr: string, timeOfDay: "morning" | "evening") => void;
  abonnements: Abonnement[];
  achatsMensuels: AchatMensuel[];
  onToggleAchatStatus: (id: string) => void;
  transactions?: FinanceTransaction[];
  epargnes?: FinanceEpargne[];
  onNavigateToModule: (moduleId: string) => void;
  triggerToast: (msg: string, type: "success" | "info" | "warning" | "error") => void;
}

export default function DashboardUnifiedCalendar({
  dailyHabits,
  habitHistory,
  onToggleHabitForDate,
  weeklyObjectives,
  onToggleWeeklyObjective,
  actions30Jours,
  onToggleAction30Jours,
  folders,
  onToggleFolderObjective,
  skinTrackers,
  onToggleSkinRoutineForDate,
  abonnements,
  achatsMensuels,
  onToggleAchatStatus,
  onNavigateToModule,
  triggerToast
}: DashboardUnifiedCalendarProps) {
  // Calendar View Month State
  const [currentDate, setCurrentDate] = useState(() => new Date());
  
  // Selected Date in YYYY-MM-DD
  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const [selectedDateStr, setSelectedDateStr] = useState<string>(todayStr);

  // Filter Category Multi-Select State
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => new Set(["HABIT", "PROJET", "FINANCE", "SKIN CARE"])
  );

  const isAllCategoriesSelected = selectedCategories.size === 4;

  const toggleCategory = (cat: string) => {
    if (cat === "TOUS") {
      setSelectedCategories(new Set(["HABIT", "PROJET", "FINANCE", "SKIN CARE"]));
      return;
    }
    setSelectedCategories(prev => {
      const next = new Set(prev);
      if (next.has(cat)) {
        // Don't allow unchecking the last one if only 1 was left, or allow toggling
        if (next.size > 1) {
          next.delete(cat);
        } else {
          // If user toggles off the last active category, turn all back on or leave it
          next.clear();
        }
      } else {
        next.add(cat);
      }
      return next;
    });
  };

  // Drag and drop state
  const [dragOverDateStr, setDragOverDateStr] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<any | null>(null);

  // Calendar View Mode State (MOIS vs SEMAINE)
  const [viewMode, setViewMode] = useState<"MOIS" | "SEMAINE">("MOIS");

  // Format header title according to viewMode
  const headerTitle = useMemo(() => {
    if (viewMode === "MOIS") {
      return currentDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    } else {
      // Calculate start (Monday) and end (Sunday) of the active week
      const d = new Date(currentDate);
      const dayOfWeek = d.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      
      const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diffToMonday);
      const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);

      const monDay = monday.getDate();
      const monMonth = monday.toLocaleDateString("fr-FR", { month: "short" });
      const sunDay = sunday.getDate();
      const sunMonth = sunday.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });

      if (monday.getMonth() === sunday.getMonth()) {
        return `Semaine du ${monDay} au ${sunDay} ${sunday.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}`;
      }
      return `Semaine du ${monDay} ${monMonth} au ${sunDay} ${sunMonth}`;
    }
  }, [currentDate, viewMode]);

  // Navigate Period (Month or Week)
  const handlePrevPeriod = () => {
    setCurrentDate(prev => {
      if (viewMode === "MOIS") {
        return new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      } else {
        return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7);
      }
    });
  };

  const handleNextPeriod = () => {
    setCurrentDate(prev => {
      if (viewMode === "MOIS") {
        return new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      } else {
        return new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7);
      }
    });
  };

  const handleJumpToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDateStr(now.toISOString().split("T")[0]);
  };

  // Generate Calendar Days Grid (Month vs Week)
  const calendarDays = useMemo(() => {
    if (viewMode === "SEMAINE") {
      const d = new Date(currentDate);
      const dayOfWeek = d.getDay();
      const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
      const monday = new Date(d.getFullYear(), d.getMonth(), d.getDate() + diffToMonday);

      const days = [];
      for (let i = 0; i < 7; i++) {
        const dayDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
        days.push({
          dateObj: dayDate,
          dateStr: dayDate.toISOString().split("T")[0],
          dayNumber: dayDate.getDate(),
          isCurrentMonth: true
        });
      }
      return days;
    }

    // Default Month View Grid
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Monday as first day of week (0 = Monday, ..., 6 = Sunday)
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const days = [];

    // Previous month padding days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const pDay = prevMonthLastDay - i;
      const d = new Date(year, month - 1, pDay);
      days.push({
        dateObj: d,
        dateStr: d.toISOString().split("T")[0],
        dayNumber: pDay,
        isCurrentMonth: false
      });
    }

    // Current month days
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const d = new Date(year, month, i);
      days.push({
        dateObj: d,
        dateStr: d.toISOString().split("T")[0],
        dayNumber: i,
        isCurrentMonth: true
      });
    }

    // Next month padding days to complete 35 or 42 grid cells
    const remaining = (7 - (days.length % 7)) % 7;
    for (let i = 1; i <= remaining; i++) {
      const d = new Date(year, month + 1, i);
      days.push({
        dateObj: d,
        dateStr: d.toISOString().split("T")[0],
        dayNumber: i,
        isCurrentMonth: false
      });
    }

    return days;
  }, [currentDate, viewMode]);

  // Compute Summary Statistics per Day
  const getDaySummary = (dateStr: string) => {
    // 1. HABITS
    const completedHabitIds = habitHistory[dateStr] || [];
    const isToday = dateStr === todayStr;
    const habitsList = dailyHabits;
    const habitsCompleted = isToday 
      ? habitsList.filter(h => h.completed).length 
      : completedHabitIds.length;
    const habitsTotal = habitsList.length;

    // 2. SKIN CARE
    const skinEntry = skinTrackers.find(s => s.date === dateStr);
    const skinMorning = skinEntry?.morningRoutine || false;
    const skinEvening = skinEntry?.eveningRoutine || false;
    const skinCompletedCount = (skinMorning ? 1 : 0) + (skinEvening ? 1 : 0);

    // 3. PROJETS & OBJECTIFS (weekly objectives + 30 days + folder objectives)
    const folderObjs = folders.flatMap(f => f.customObjectives.map(o => ({ ...o, folderId: f.id, folderName: f.name })));
    const projPendingCount = folderObjs.filter(o => !o.completed).length + weeklyObjectives.filter(o => !o.completed).length;
    const projTotal = folderObjs.length + weeklyObjectives.length + actions30Jours.length;

    // 4. FINANCE (Abonnements + Achats due)
    const financeCount = abonnements.filter(a => a.status === "Actif").length + achatsMensuels.length;

    const isPastDay = dateStr < todayStr;
    const hasOverdue = isPastDay && (
      (habitsTotal > 0 && habitsCompleted < habitsTotal) ||
      (skinCompletedCount < 2) ||
      (projPendingCount > 0)
    );

    return {
      habitsCompleted,
      habitsTotal,
      skinMorning,
      skinEvening,
      skinCompletedCount,
      projPendingCount,
      projTotal,
      financeCount,
      hasOverdue,
      hasHabitActivity: selectedCategories.has("HABIT") && habitsCompleted > 0,
      hasSkinActivity: selectedCategories.has("SKIN CARE") && skinCompletedCount > 0,
      hasProjActivity: selectedCategories.has("PROJET") && projTotal > 0,
      hasFinanceActivity: selectedCategories.has("FINANCE") && financeCount > 0
    };
  };

  // Selected Date Items List
  const selectedDayItems = useMemo(() => {
    const isSelectedToday = selectedDateStr === todayStr;
    const completedHabitIdsForDate = habitHistory[selectedDateStr] || [];

    // HABITS
    const habits = dailyHabits.map(h => {
      const isDone = isSelectedToday ? h.completed : completedHabitIdsForDate.includes(h.id);
      return {
        id: h.id,
        title: h.name,
        subtitle: `Routines • ${h.category || "Quotidien"}`,
        completed: isDone,
        category: "HABIT" as CalendarFilterCategory,
        moduleKey: "habits",
        typeLabel: "Habitude",
        dueDate: selectedDateStr
      };
    });

    // PROJETS & OBJECTIFS
    const projObjectives = weeklyObjectives.map(o => ({
      id: o.id,
      title: o.text,
      subtitle: o.isPriority ? "Objectif Hebdo Prioritaire" : "Objectif Hebdo",
      completed: o.completed,
      category: "PROJET" as CalendarFilterCategory,
      moduleKey: "channels",
      typeLabel: "Objectif",
      rawType: "weekly",
      dueDate: (o as any).dueDate || selectedDateStr
    }));

    const folderObjectives = folders.flatMap(f => f.customObjectives.map(o => ({
      id: o.id,
      folderId: f.id,
      title: o.text,
      subtitle: `Projet: ${f.name}`,
      completed: o.completed,
      category: "PROJET" as CalendarFilterCategory,
      moduleKey: "project_folders",
      typeLabel: "Tâche de Projet",
      rawType: "folder",
      dueDate: o.dueDate || selectedDateStr
    })));

    const sprint30Actions = actions30Jours.slice(0, 5).map(a => ({
      id: a.id,
      title: `Jour ${a.dayNumber}: ${a.taskDescription}`,
      subtitle: "Sprint 30 Jours",
      completed: a.completed,
      category: "PROJET" as CalendarFilterCategory,
      moduleKey: "actions30",
      typeLabel: "Action 30J",
      rawType: "action30",
      dueDate: selectedDateStr
    }));

    // SKIN CARE
    const skinLog = skinTrackers.find(s => s.date === selectedDateStr);
    const skinItems = [
      {
        id: "skin_morning",
        title: "Routine Soir / Matin : Matin (Crème Solaire SPF)",
        subtitle: "Soin Visage Matinal",
        completed: skinLog?.morningRoutine || false,
        category: "SKIN CARE" as CalendarFilterCategory,
        moduleKey: "skin",
        typeLabel: "Soins Matin",
        rawType: "skin_morning",
        dueDate: selectedDateStr
      },
      {
        id: "skin_evening",
        title: "Routine Soir / Matin : Soir (Nettoyage & Sérum)",
        subtitle: "Soin Visage Nocturne",
        completed: skinLog?.eveningRoutine || false,
        category: "SKIN CARE" as CalendarFilterCategory,
        moduleKey: "skin",
        typeLabel: "Soins Soir",
        rawType: "skin_evening",
        dueDate: selectedDateStr
      }
    ];

    // FINANCE
    const financeItems = [
      ...abonnements.map(a => ({
        id: a.id,
        title: `Abonnement ${a.serviceName} (${a.costMonthly} MAD)`,
        subtitle: `Facturation ${a.billingPeriod} • Échéance: ${a.nextBillingDate || "Mensuelle"}`,
        completed: a.status === "Actif",
        category: "FINANCE" as CalendarFilterCategory,
        moduleKey: "abonnements",
        typeLabel: "Abonnement",
        rawType: "abonnement",
        dueDate: a.nextBillingDate || selectedDateStr
      })),
      ...achatsMensuels.map(a => ({
        id: a.id,
        title: `Achat prévisionnel: ${a.itemName} (${a.amount} MAD)`,
        subtitle: `Magasin: ${a.store} • Priorité: ${a.priority}`,
        completed: a.status === "Acheté",
        category: "FINANCE" as CalendarFilterCategory,
        moduleKey: "achats",
        typeLabel: "Achat Prévisible",
        rawType: "achat",
        dueDate: (a as any).targetDate || (a as any).dueDate || selectedDateStr
      }))
    ];

    // Filter by Selected Categories Set
    const all = [
      ...habits,
      ...projObjectives,
      ...folderObjectives,
      ...sprint30Actions,
      ...skinItems,
      ...financeItems
    ];

    return all.filter(item => selectedCategories.has(item.category));
  }, [
    selectedDateStr,
    todayStr,
    dailyHabits,
    habitHistory,
    weeklyObjectives,
    folders,
    actions30Jours,
    skinTrackers,
    abonnements,
    achatsMensuels,
    selectedCategories
  ]);

  // Selected Day Progress Calculation
  const dayProgressStats = useMemo(() => {
    if (selectedDayItems.length === 0) return { total: 0, completed: 0, percent: 0 };
    const completed = selectedDayItems.filter(i => i.completed).length;
    const total = selectedDayItems.length;
    const percent = Math.round((completed / total) * 100);
    return { total, completed, percent };
  }, [selectedDayItems]);

  const overdueCountInSelectedDay = useMemo(() => {
    return selectedDayItems.filter(item => {
      const itemDueDate = item.dueDate || selectedDateStr;
      return !item.completed && itemDueDate < todayStr;
    }).length;
  }, [selectedDayItems, selectedDateStr, todayStr]);

  // Handle Validation directly from Calendar
  const handleToggleItemInCalendar = (item: any) => {
    if (item.category === "HABIT") {
      onToggleHabitForDate(item.id, selectedDateStr);
      triggerToast(`Habitude "${item.title}" mise à jour !`, "success");
    } else if (item.category === "SKIN CARE") {
      const timeOfDay = item.rawType === "skin_morning" ? "morning" : "evening";
      onToggleSkinRoutineForDate(selectedDateStr, timeOfDay);
      triggerToast(`Soin du visage (${timeOfDay === "morning" ? "Matin" : "Soir"}) validé !`, "success");
    } else if (item.category === "PROJET") {
      if (item.rawType === "weekly") {
        onToggleWeeklyObjective(item.id);
        triggerToast(`Objectif hebdo mis à jour !`, "info");
      } else if (item.rawType === "folder") {
        onToggleFolderObjective(item.folderId, item.id);
        triggerToast(`Tâche de projet mise à jour !`, "success");
      } else if (item.rawType === "action30") {
        onToggleAction30Jours(item.id);
        triggerToast(`Action Sprint 30J mise à jour !`, "info");
      }
    } else if (item.category === "FINANCE") {
      if (item.rawType === "achat") {
        onToggleAchatStatus(item.id);
        triggerToast(`Statut d'achat mis à jour !`, "success");
      } else {
        triggerToast(`Consultez le module Finance pour modifier les abonnements récurrents`, "info");
      }
    }
  };

  // Handle Drag and Drop Rescheduling
  const handleDropOnDate = (e: React.DragEvent, targetDateStr: string) => {
    e.preventDefault();
    setDragOverDateStr(null);
    setDraggedItem(null);

    try {
      const dataStr = e.dataTransfer.getData("application/json") || e.dataTransfer.getData("text/plain");
      if (!dataStr) return;
      
      let parsedPayload: any = null;
      try {
        parsedPayload = JSON.parse(dataStr);
      } catch {
        return;
      }

      const { item, sourceDateStr } = parsedPayload || {};
      if (!item || !targetDateStr) return;

      if (sourceDateStr === targetDateStr) {
        triggerToast(`L'élément "${item.title}" est déjà sur ce jour`, "info");
        return;
      }

      const parts = targetDateStr.split("-");
      const targetDateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const formattedTarget = targetDateObj.toLocaleDateString("fr-FR", { day: "numeric", month: "long" });

      if (item.category === "HABIT") {
        // Toggle habit on target date
        onToggleHabitForDate(item.id, targetDateStr);
        // If it was completed on source date, transfer completion
        if (item.completed) {
          onToggleHabitForDate(item.id, sourceDateStr);
        }
        triggerToast(`Habitude "${item.title}" reprogrammée pour le ${formattedTarget}`, "success");
      } else if (item.category === "SKIN CARE") {
        const timeOfDay = item.rawType === "skin_morning" ? "morning" : "evening";
        onToggleSkinRoutineForDate(targetDateStr, timeOfDay);
        if (item.completed) {
          onToggleSkinRoutineForDate(sourceDateStr, timeOfDay);
        }
        triggerToast(`Soin "${item.title}" reprogrammé pour le ${formattedTarget}`, "success");
      } else if (item.category === "PROJET") {
        if (item.rawType === "weekly") {
          onToggleWeeklyObjective(item.id);
        } else if (item.rawType === "folder") {
          onToggleFolderObjective(item.folderId, item.id);
        } else if (item.rawType === "action30") {
          onToggleAction30Jours(item.id);
        }
        triggerToast(`Tâche "${item.title}" reprogrammée pour le ${formattedTarget}`, "success");
      } else if (item.category === "FINANCE") {
        if (item.rawType === "achat") {
          onToggleAchatStatus(item.id);
        }
        triggerToast(`Échéance "${item.title}" reprogrammée pour le ${formattedTarget}`, "info");
      }

      // Automatically switch view to target date to inspect changes
      setSelectedDateStr(targetDateStr);
    } catch (err) {
      console.error("Drop handling error:", err);
    }
  };

  // Selected Date Display String
  const selectedDateLabel = useMemo(() => {
    const parts = selectedDateStr.split("-");
    if (parts.length < 3) return selectedDateStr;
    const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  }, [selectedDateStr]);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-neutral-200/90 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 shadow-xs space-y-6">
      
      {/* 1. Header & Title Block */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-100 dark:border-zinc-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-2xl shadow-2xs">
              <CalendarIcon className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                <span>Calendrier Unifié Interactif</span>
                <span className="px-2.5 py-0.5 bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800/80 rounded-full text-[10px] font-mono font-bold">
                  Multi-Domaines
                </span>
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Supervisez, validez et accédez directement à l'ensemble de vos routines, projets, soins et écheances financières.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. DEDICATED DOMAIN FILTER BAR */}
      <div className="bg-neutral-50/90 dark:bg-zinc-800/60 p-3.5 rounded-2xl border border-neutral-200/80 dark:border-zinc-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-extrabold text-neutral-800 dark:text-neutral-200">
          <Filter className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          <span>Filtres d'affichage :</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tous */}
          <button
            type="button"
            onClick={() => toggleCategory("TOUS")}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 select-none ${
              isAllCategoriesSelected
                ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs"
                : "bg-white text-neutral-600 dark:bg-zinc-900 dark:text-neutral-400 border border-neutral-200 dark:border-zinc-700 hover:border-neutral-300"
            }`}
          >
            <span>Tous les domaines</span>
          </button>

          {/* Habitudes */}
          <button
            type="button"
            onClick={() => toggleCategory("HABIT")}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 select-none border ${
              selectedCategories.has("HABIT")
                ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                : "bg-white text-neutral-400 dark:bg-zinc-900 dark:text-neutral-500 border-neutral-200 dark:border-zinc-800 hover:text-neutral-700"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Habitudes</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              selectedCategories.has("HABIT") ? "bg-indigo-700/80 text-white" : "bg-neutral-100 text-neutral-500 dark:bg-zinc-800"
            }`}>
              {dailyHabits.length}
            </span>
          </button>

          {/* Projets */}
          <button
            type="button"
            onClick={() => toggleCategory("PROJET")}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 select-none border ${
              selectedCategories.has("PROJET")
                ? "bg-sky-600 text-white border-sky-600 shadow-xs"
                : "bg-white text-neutral-400 dark:bg-zinc-900 dark:text-neutral-500 border-neutral-200 dark:border-zinc-800 hover:text-neutral-700"
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Projets</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              selectedCategories.has("PROJET") ? "bg-sky-700/80 text-white" : "bg-neutral-100 text-neutral-500 dark:bg-zinc-800"
            }`}>
              {weeklyObjectives.length + folders.flatMap(f => f.customObjectives).length + actions30Jours.length}
            </span>
          </button>

          {/* Finance */}
          <button
            type="button"
            onClick={() => toggleCategory("FINANCE")}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 select-none border ${
              selectedCategories.has("FINANCE")
                ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                : "bg-white text-neutral-400 dark:bg-zinc-900 dark:text-neutral-500 border-neutral-200 dark:border-zinc-800 hover:text-neutral-700"
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Finance</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              selectedCategories.has("FINANCE") ? "bg-amber-700/80 text-white" : "bg-neutral-100 text-neutral-500 dark:bg-zinc-800"
            }`}>
              {abonnements.length + achatsMensuels.length}
            </span>
          </button>

          {/* Skin Care */}
          <button
            type="button"
            onClick={() => toggleCategory("SKIN CARE")}
            className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-2 select-none border ${
              selectedCategories.has("SKIN CARE")
                ? "bg-rose-600 text-white border-rose-600 shadow-xs"
                : "bg-white text-neutral-400 dark:bg-zinc-900 dark:text-neutral-500 border-neutral-200 dark:border-zinc-800 hover:text-neutral-700"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Skin Care</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              selectedCategories.has("SKIN CARE") ? "bg-rose-700/80 text-white" : "bg-neutral-100 text-neutral-500 dark:bg-zinc-800"
            }`}>
              2
            </span>
          </button>
        </div>
      </div>

      {/* 2. Main Calendar Grid & Detail Panel Split */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-7 items-start">
        
        {/* LEFT COLUMN: MONTHLY CALENDAR GRID (7 Cols in XL) */}
        <div className="xl:col-span-7 bg-neutral-50/70 dark:bg-zinc-800/40 border border-neutral-200/80 dark:border-zinc-700/60 rounded-3xl p-5 space-y-4">
          
          {/* Month / Week Controller Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200/60 dark:border-zinc-700/60">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-black capitalize text-neutral-900 dark:text-white font-sans">
                {headerTitle}
              </span>
              <button
                type="button"
                onClick={handleJumpToToday}
                className="px-2.5 py-1 bg-white dark:bg-zinc-900 hover:bg-neutral-100 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-zinc-700 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
              >
                Aujourd'hui
              </button>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              {/* View Mode Toggle Switch (Mois vs Semaine) */}
              <div className="flex items-center gap-1 bg-neutral-200/70 dark:bg-zinc-700/60 p-1 rounded-xl border border-neutral-300/50 dark:border-zinc-600/50">
                <button
                  type="button"
                  onClick={() => setViewMode("MOIS")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer select-none ${
                    viewMode === "MOIS"
                      ? "bg-white text-neutral-900 dark:bg-zinc-900 dark:text-white shadow-2xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  Mois
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("SEMAINE")}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all cursor-pointer select-none ${
                    viewMode === "SEMAINE"
                      ? "bg-white text-neutral-900 dark:bg-zinc-900 dark:text-white shadow-2xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  Semaine
                </button>
              </div>

              {/* Prev / Next Period Arrows */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handlePrevPeriod}
                  className="p-1.5 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-700 dark:text-neutral-200 rounded-xl border border-neutral-200 dark:border-zinc-700 transition-all cursor-pointer"
                  title={viewMode === "MOIS" ? "Mois précédent" : "Semaine précédente"}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextPeriod}
                  className="p-1.5 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-700 dark:text-neutral-200 rounded-xl border border-neutral-200 dark:border-zinc-700 transition-all cursor-pointer"
                  title={viewMode === "MOIS" ? "Mois suivant" : "Semaine suivante"}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Weekday Names Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[11px] font-extrabold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider py-1">
            <span>Lun</span>
            <span>Mar</span>
            <span>Mer</span>
            <span>Jeu</span>
            <span>Ven</span>
            <span>Sam</span>
            <span>Dim</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {calendarDays.map((day, idx) => {
              const isSelected = day.dateStr === selectedDateStr;
              const isToday = day.dateStr === todayStr;
              const isDragOver = day.dateStr === dragOverDateStr;
              const summary = getDaySummary(day.dateStr);

              return (
                <button
                  key={`${day.dateStr}_${idx}`}
                  type="button"
                  onClick={() => setSelectedDateStr(day.dateStr)}
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = "move";
                    if (dragOverDateStr !== day.dateStr) {
                      setDragOverDateStr(day.dateStr);
                    }
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    if (dragOverDateStr === day.dateStr) {
                      setDragOverDateStr(null);
                    }
                  }}
                  onDrop={(e) => handleDropOnDate(e, day.dateStr)}
                  className={`${viewMode === "SEMAINE" ? "min-h-[110px]" : "min-h-[64px]"} p-2 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between text-left select-none ${
                    isDragOver
                      ? "bg-indigo-100/90 dark:bg-indigo-950/90 border-2 border-dashed border-indigo-600 scale-105 shadow-xl ring-2 ring-indigo-400 z-30"
                      : isSelected
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 border-neutral-900 dark:border-white shadow-md ring-2 ring-indigo-500/30 z-10"
                      : isToday
                      ? "bg-indigo-50/80 dark:bg-indigo-950/60 border-indigo-400 text-indigo-950 dark:text-indigo-200 font-bold"
                      : day.isCurrentMonth
                      ? summary.hasOverdue
                        ? "bg-rose-50/20 dark:bg-rose-950/20 border-rose-300 dark:border-rose-900/80 text-neutral-800 dark:text-neutral-200 hover:border-rose-400"
                        : "bg-white dark:bg-zinc-900 border-neutral-200/70 dark:border-zinc-800 text-neutral-800 dark:text-neutral-200 hover:border-neutral-300 dark:hover:border-zinc-700"
                      : "bg-neutral-100/50 dark:bg-zinc-900/30 border-transparent text-neutral-300 dark:text-zinc-700"
                  }`}
                >
                  {/* Day Number and Today Badge / Overdue Indicator */}
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-mono font-extrabold ${isSelected ? (isSelected && isToday ? "text-amber-300 dark:text-amber-600" : "") : ""}`}>
                      {day.dayNumber}
                    </span>
                    <div className="flex items-center gap-1">
                      {summary.hasOverdue && !isSelected && (
                        <span className="p-0.5 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-0.5" title="Date dépassée / Éléments non complétés en retard">
                          <AlertCircle className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
                        </span>
                      )}
                      {isToday && (
                        <span className={`text-[8px] font-mono uppercase font-black px-1 rounded ${isSelected ? "bg-amber-400 text-neutral-950" : "bg-indigo-600 text-white"}`}>
                          Auj.
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Indicator Dots for Activity Categories */}
                  <div className="flex items-center gap-1 mt-1 flex-wrap">
                    {/* Habit dot */}
                    {selectedCategories.has("HABIT") && summary.hasHabitActivity && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-indigo-300" : "bg-indigo-600"}`}
                        title={`${summary.habitsCompleted}/${summary.habitsTotal} routines complétées`}
                      />
                    )}

                    {/* Skincare dot */}
                    {selectedCategories.has("SKIN CARE") && summary.hasSkinActivity && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-rose-300" : "bg-rose-500"}`}
                        title="Soin de peau enregistré"
                      />
                    )}

                    {/* Project dot */}
                    {selectedCategories.has("PROJET") && summary.hasProjActivity && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-sky-300" : "bg-sky-500"}`}
                        title="Tâches de projets"
                      />
                    )}

                    {/* Finance dot */}
                    {selectedCategories.has("FINANCE") && summary.hasFinanceActivity && (
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-amber-300" : "bg-amber-500"}`}
                        title="Échéances financières"
                      />
                    )}
                  </div>

                  {/* Week View Detail Pills */}
                  {viewMode === "SEMAINE" && (
                    <div className="space-y-1 my-1 w-full text-[9px] font-bold">
                      {selectedCategories.has("HABIT") && summary.habitsTotal > 0 && (
                        <div className={`px-1.5 py-0.5 rounded flex items-center justify-between ${
                          isSelected ? "bg-neutral-800 text-indigo-200 dark:bg-neutral-200 dark:text-indigo-900" : "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                        }`}>
                          <span>Hab.</span>
                          <span>{summary.habitsCompleted}/{summary.habitsTotal}</span>
                        </div>
                      )}
                      {selectedCategories.has("PROJET") && summary.projTotal > 0 && (
                        <div className={`px-1.5 py-0.5 rounded flex items-center justify-between ${
                          isSelected ? "bg-neutral-800 text-sky-200 dark:bg-neutral-200 dark:text-sky-900" : "bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300"
                        }`}>
                          <span>Proj.</span>
                          <span>{summary.projPendingCount}</span>
                        </div>
                      )}
                      {selectedCategories.has("FINANCE") && summary.financeCount > 0 && (
                        <div className={`px-1.5 py-0.5 rounded flex items-center justify-between ${
                          isSelected ? "bg-neutral-800 text-amber-200 dark:bg-neutral-200 dark:text-amber-900" : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300"
                        }`}>
                          <span>Fin.</span>
                          <span>{summary.financeCount}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Micro Progress Bar */}
                  {summary.habitsTotal > 0 && (
                    <div className="w-full bg-neutral-200 dark:bg-zinc-700 h-1 rounded-full overflow-hidden mt-1">
                      <div
                        className={`h-full ${isSelected ? "bg-indigo-400" : "bg-indigo-600"}`}
                        style={{ width: `${Math.round((summary.habitsCompleted / summary.habitsTotal) * 100)}%` }}
                      />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend Footer */}
          <div className="pt-2 border-t border-neutral-200/60 dark:border-zinc-700/60 flex flex-wrap items-center justify-between gap-3 text-[10px] text-neutral-500 dark:text-neutral-400">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-indigo-600 inline-block" /> Routines & Habitudes
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" /> Skincare
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-sky-500 inline-block" /> Projets
              </span>
              <span className="flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> Finance
              </span>
            </div>
            <span className="font-mono text-[9px]">Cliquez sur un jour pour valider vos éléments</span>
          </div>
        </div>

        {/* RIGHT COLUMN: SELECTED DATE DETAIL & VALIDATION PANEL (5 Cols in XL) */}
        <div className="xl:col-span-5 bg-neutral-50/90 dark:bg-zinc-800/60 border border-neutral-200/80 dark:border-zinc-700/60 rounded-3xl p-5 space-y-5">
          
          {/* Selected Date Header Banner */}
          <div className="flex items-center justify-between pb-3 border-b border-neutral-200/60 dark:border-zinc-700/60">
            <div>
              <span className="text-[10px] font-mono font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 block">
                {selectedDateStr === todayStr ? "JOUR ACTUEL" : "JOUR SÉLECTIONNÉ"}
              </span>
              <h3 className="text-sm font-black text-neutral-900 dark:text-white capitalize">
                {selectedDateLabel}
              </h3>
            </div>

            {/* Quick module redirection buttons row */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => onNavigateToModule("routines")}
                className="px-2 py-1 bg-white dark:bg-zinc-900 hover:bg-neutral-100 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-zinc-700 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                title="Aller au module Routines"
              >
                <span>Routines</span>
                <ArrowUpRight className="w-3 h-3 text-indigo-500" />
              </button>

              <button
                type="button"
                onClick={() => onNavigateToModule("skin")}
                className="px-2 py-1 bg-white dark:bg-zinc-900 hover:bg-neutral-100 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-zinc-700 rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                title="Aller au module Skincare"
              >
                <span>Soins</span>
                <ArrowUpRight className="w-3 h-3 text-rose-500" />
              </button>
            </div>
          </div>

          {/* Completion Meter Bar for selected day */}
          <div className="p-3.5 bg-white dark:bg-zinc-900 border border-neutral-200/70 dark:border-zinc-800 rounded-2xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Progression du jour
              </span>
              <span className="font-mono font-black text-indigo-600 dark:text-indigo-400">
                {dayProgressStats.completed} / {dayProgressStats.total} ({dayProgressStats.percent}%)
              </span>
            </div>

            <div className="w-full bg-neutral-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${dayProgressStats.percent}%` }}
                className="h-full bg-linear-to-r from-indigo-600 via-purple-600 to-emerald-500 rounded-full"
              />
            </div>
          </div>

          {/* Drag & Drop Help Tip Banner */}
          <div className="px-3 py-2 bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-900/50 rounded-2xl flex items-center gap-2 text-[11px] text-indigo-900 dark:text-indigo-200">
            <GripVertical className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span><strong>Glissez-déposez</strong> une tâche vers une date du calendrier pour la reprogrammer rapidement.</span>
          </div>

          {/* Overdue Items Alert Banner */}
          {overdueCountInSelectedDay > 0 && (
            <div className="px-3 py-2.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800 rounded-2xl flex items-center justify-between gap-2 text-xs font-bold text-rose-900 dark:text-rose-200 shadow-2xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0" />
                <span>{overdueCountInSelectedDay} {overdueCountInSelectedDay > 1 ? "éléments en retard (date dépassée)" : "élément en retard (date dépassée)"}</span>
              </div>
              <span className="text-[10px] font-mono bg-rose-200/80 dark:bg-rose-900 text-rose-950 dark:text-rose-100 px-2 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0">
                À Traiter
              </span>
            </div>
          )}

          {/* Interactive Items Checklist for selected day */}
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {selectedDayItems.length === 0 ? (
              <div className="text-center py-8 px-4 bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-zinc-800 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-neutral-500">
                  Aucun élément ne correspond aux filtres actifs pour cette journée.
                </p>
                <button
                  type="button"
                  onClick={() => toggleCategory("TOUS")}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-bold cursor-pointer"
                >
                  Réactiver tous les domaines
                </button>
              </div>
            ) : (
              selectedDayItems.map((item) => {
                let badgeBg = "bg-neutral-100 text-neutral-700 dark:bg-zinc-800 dark:text-neutral-300";
                if (item.category === "HABIT") badgeBg = "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800";
                if (item.category === "PROJET") badgeBg = "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/80 dark:text-sky-300 dark:border-sky-800";
                if (item.category === "FINANCE") badgeBg = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-800";
                if (item.category === "SKIN CARE") badgeBg = "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/80 dark:text-rose-300 dark:border-rose-800";

                const isBeingDragged = draggedItem?.id === item.id;
                const itemDueDate = item.dueDate || selectedDateStr;
                const isOverdue = !item.completed && itemDueDate < todayStr;

                return (
                  <div
                    key={`${item.category}_${item.id}`}
                    draggable={true}
                    onDragStart={(e) => {
                      e.dataTransfer.setData("application/json", JSON.stringify({ item, sourceDateStr: selectedDateStr }));
                      e.dataTransfer.setData("text/plain", item.title);
                      setDraggedItem(item);
                    }}
                    onDragEnd={() => {
                      setDraggedItem(null);
                      setDragOverDateStr(null);
                    }}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between gap-2.5 cursor-grab active:cursor-grabbing select-none ${
                      isBeingDragged
                        ? "opacity-40 border-dashed border-indigo-400 scale-98"
                        : item.completed
                        ? "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/40"
                        : isOverdue
                        ? "bg-rose-50/70 dark:bg-rose-950/30 border-rose-400 dark:border-rose-800/90 shadow-2xs ring-1 ring-rose-400/40"
                        : "bg-white dark:bg-zinc-900 border-neutral-200/80 dark:border-zinc-800 hover:border-neutral-300 hover:shadow-xs"
                    }`}
                  >
                    {/* Drag Grip Handle */}
                    <span className="p-0.5 text-neutral-300 dark:text-zinc-600 hover:text-neutral-500 dark:hover:text-neutral-400 cursor-grab active:cursor-grabbing shrink-0" title="Glisser pour reprogrammer">
                      <GripVertical className="w-4 h-4" />
                    </span>

                    {/* Checkbox and Text */}
                    <div className="flex items-center gap-2.5 min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => handleToggleItemInCalendar(item)}
                        className={`p-1 rounded-lg transition-transform active:scale-90 cursor-pointer shrink-0 ${
                          item.completed 
                            ? "text-emerald-600 dark:text-emerald-400" 
                            : isOverdue
                            ? "text-rose-500 dark:text-rose-400 hover:text-rose-600"
                            : "text-neutral-300 hover:text-neutral-500"
                        }`}
                        title={item.completed ? "Marquer comme non accompli" : "Valider l'élément"}
                      >
                        {item.completed ? (
                          <CheckCircle2 className="w-5 h-5 fill-emerald-100 dark:fill-emerald-950/50" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>

                      <div className="space-y-0.5 min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${badgeBg}`}>
                            {item.typeLabel}
                          </span>
                          {isOverdue && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1 shrink-0 animate-pulse">
                              <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
                              <span>Date dépassée ({itemDueDate})</span>
                            </span>
                          )}
                          <span className="text-[10px] text-neutral-400 font-medium truncate">
                            {item.subtitle}
                          </span>
                        </div>
                        <p className={`text-xs font-bold leading-snug truncate ${
                          item.completed 
                            ? "line-through text-neutral-400 dark:text-neutral-500" 
                            : isOverdue
                            ? "text-rose-950 dark:text-rose-100"
                            : "text-neutral-900 dark:text-white"
                        }`}>
                          {item.title}
                        </p>
                      </div>
                    </div>

                    {/* Redirection / Navigation Shortcut Button */}
                    <button
                      type="button"
                      onClick={() => onNavigateToModule(item.moduleKey)}
                      className="p-1.5 bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 dark:hover:bg-zinc-700 text-neutral-600 dark:text-neutral-300 rounded-xl transition-all cursor-pointer shrink-0 flex items-center gap-1 text-[10px] font-bold"
                      title={`Ouvrir le module ${item.moduleKey}`}
                    >
                      <span className="hidden sm:inline">Page</span>
                      <ExternalLink className="w-3 h-3 text-indigo-500" />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Module Navigation Shortcuts */}
          <div className="pt-3 border-t border-neutral-200/60 dark:border-zinc-700/60 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onNavigateToModule("channels")}
              className="px-3 py-2 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center justify-between cursor-pointer transition-all"
            >
              <span className="flex items-center gap-1.5">
                <FolderKanban className="w-3.5 h-3.5 text-sky-500" />
                Projets
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
            </button>

            <button
              type="button"
              onClick={() => onNavigateToModule("finance_dash")}
              className="px-3 py-2 bg-white dark:bg-zinc-900 hover:bg-neutral-100 dark:hover:bg-zinc-800 border border-neutral-200 dark:border-zinc-800 rounded-xl text-xs font-bold text-neutral-800 dark:text-neutral-200 flex items-center justify-between cursor-pointer transition-all"
            >
              <span className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-500" />
                Finance
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
