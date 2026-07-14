import React, { useState, useMemo } from "react";
import { DailyHabit } from "../types";
import { 
  Flame, 
  Award, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Info, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle,
  Square
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface DisciplineHeatmapProps {
  habitHistory: Record<string, string[]>;
  setHabitHistory: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  dailyHabitsList: DailyHabit[];
  streakCount: number;
}

export default function DisciplineHeatmap({
  habitHistory,
  setHabitHistory,
  dailyHabitsList,
  streakCount
}: DisciplineHeatmapProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Year 2026 Dates Generation
  const yearDays = useMemo(() => {
    const days: Date[] = [];
    // Start date: Jan 1, 2026
    const start = new Date(2026, 0, 1);
    // End date: Dec 31, 2026
    const end = new Date(2026, 11, 31);

    const curr = new Date(start);
    while (curr <= end) {
      days.push(new Date(curr));
      curr.setDate(curr.getDate() + 1);
    }
    return days;
  }, []);

  // Compute stats for 2026
  const stats = useMemo(() => {
    const totalDays = yearDays.length;
    let completedDaysCount = 0;
    let perfectDaysCount = 0;
    let maxStreak = 0;
    let currentStreak = 0;
    let totalHabitsCompleted = 0;

    // Helper map of formatted dates to completed habits
    const daysWithCompletion = new Set<string>();

    const todayStr = new Date().toISOString().split("T")[0];

    // We traverse chronological order to compute streaks
    const sortedDays = [...yearDays].sort((a, b) => a.getTime() - b.getTime());

    sortedDays.forEach(day => {
      const dateStr = day.toISOString().split("T")[0];
      const completedList = habitHistory[dateStr] || [];
      const score = completedList.length;

      totalHabitsCompleted += score;

      if (score > 0) {
        completedDaysCount++;
        daysWithCompletion.add(dateStr);
        currentStreak++;
        if (currentStreak > maxStreak) {
          maxStreak = currentStreak;
        }
      } else {
        // If it's a day in the future, don't break current streak calculation if it's after today
        if (dateStr <= todayStr) {
          currentStreak = 0;
        }
      }

      if (score >= dailyHabitsList.length) {
        perfectDaysCount++;
      }
    });

    const completionRate = totalDays > 0 ? (completedDaysCount / totalDays) * 100 : 0;

    return {
      completedDaysCount,
      perfectDaysCount,
      maxStreak: Math.max(maxStreak, streakCount),
      totalHabitsCompleted,
      completionRate
    };
  }, [yearDays, habitHistory, dailyHabitsList.length, streakCount]);

  // Group days by week (Monday to Sunday) for standard contribution board rendering
  // Monday is index 1, Sunday is 0. We'll align Monday as first day of the week column-wise.
  const weeks = useMemo(() => {
    const columns: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = Array(7).fill(null);

    // Jan 1, 2026 is Thursday. Thursday index is 4 (if Sunday=0) or 3 (if Mon=0).
    // Let's map days such that Monday is index 0, Sunday is index 6.
    const getDayIndex = (d: Date) => {
      const day = d.getDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
      return day === 0 ? 6 : day - 1;
    };

    yearDays.forEach((day) => {
      const dayIdx = getDayIndex(day);
      
      // If we are back at Monday and the week already has entries, push current week and start a new one
      if (dayIdx === 0 && currentWeek.some(d => d !== null)) {
        columns.push(currentWeek);
        currentWeek = Array(7).fill(null);
      }

      currentWeek[dayIdx] = day;
    });

    // Push the final week
    if (currentWeek.some(d => d !== null)) {
      columns.push(currentWeek);
    }

    return columns;
  }, [yearDays]);

  // Color mapper based on the score (number of completed habits)
  const getCellColor = (dateStr: string) => {
    const completed = habitHistory[dateStr] || [];
    const score = completed.length;
    const maxHabits = dailyHabitsList.length || 7;

    if (score === 0) return "bg-neutral-100 dark:bg-neutral-800 border-neutral-200/50 dark:border-neutral-700/30";
    
    const ratio = score / maxHabits;

    if (ratio >= 1) return "bg-amber-500 border-amber-600 shadow-3xs hover:shadow-2xs animate-pulse hover:scale-110 ring-2 ring-amber-300 dark:ring-amber-500/30"; // Perfect day is glowing Gold!
    if (ratio >= 0.7) return "bg-emerald-700 border-emerald-800 text-white"; // Deep forest emerald green
    if (ratio >= 0.4) return "bg-emerald-500 border-emerald-600 text-white"; // Standard emerald green
    return "bg-emerald-200 border-emerald-300 text-neutral-800"; // Light sage green
  };

  // Safe date labels
  const formatDateLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  };

  // Retrieve details for a selected day
  const selectedDayHabits = useMemo(() => {
    if (!selectedDate) return [];
    const completedIds = habitHistory[selectedDate] || [];
    return dailyHabitsList.map(h => ({
      ...h,
      completed: completedIds.includes(h.id)
    }));
  }, [selectedDate, habitHistory, dailyHabitsList]);

  // Handle toggling a habit in the past/selected day
  const handleTogglePastHabit = (habitId: string) => {
    if (!selectedDate) return;
    setHabitHistory(prev => {
      const currentList = prev[selectedDate] || [];
      const newList = currentList.includes(habitId)
        ? currentList.filter(id => id !== habitId)
        : [...currentList, habitId];
      return {
        ...prev,
        [selectedDate]: newList
      };
    });
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER HERO BANNER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h3 className="text-base font-black text-neutral-900 dark:text-neutral-50 flex items-center gap-2 uppercase tracking-tight">
            <Calendar className="w-5 h-5 text-neutral-800" />
            Calendrier d'Assiduité (Heatmap)
          </h3>
          <p className="text-xs text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Gamifiez votre discipline quotidienne sur 365 jours. Plus vous validez vos routines d'élite, plus les pixels s'illuminent en vert émeraude ou en <span className="text-amber-500 font-bold">Or Impérial</span>. Cliquez sur un pixel pour voir vos routines passées !
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 px-3 py-1.5 rounded-xl text-[10px] text-neutral-500 font-bold">
          <span>Moins</span>
          <div className="w-3.5 h-3.5 rounded bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/50" />
          <div className="w-3.5 h-3.5 rounded bg-emerald-200 border border-emerald-300" />
          <div className="w-3.5 h-3.5 rounded bg-emerald-500 border border-emerald-600" />
          <div className="w-3.5 h-3.5 rounded bg-emerald-700 border border-emerald-800" />
          <div className="w-3.5 h-3.5 rounded bg-amber-500 border border-amber-600 ring-1 ring-amber-300" title="Journée Parfaite !" />
          <span>Plus</span>
        </div>
      </div>

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Streak Record */}
        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider block">Record de Chaîne</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-neutral-900 dark:text-neutral-50">{stats.maxStreak}</span>
              <span className="text-xs text-neutral-400 font-bold">jours</span>
            </div>
          </div>
          <div className="p-2.5 bg-amber-50 dark:bg-amber-950/20 text-amber-500 rounded-xl border border-amber-100 dark:border-amber-900/50">
            <Flame className="w-5 h-5 fill-amber-500 animate-pulse" />
          </div>
        </div>

        {/* Perfect Days */}
        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider block">Jours Parfaits (100%)</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-neutral-900 dark:text-neutral-50">{stats.perfectDaysCount}</span>
              <span className="text-xs text-neutral-400 font-bold">jours</span>
            </div>
          </div>
          <div className="p-2.5 bg-yellow-50 dark:bg-yellow-950/20 text-yellow-500 rounded-xl border border-yellow-100 dark:border-yellow-900/50">
            <Award className="w-5 h-5" />
          </div>
        </div>

        {/* Consistency rate */}
        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider block">Taux d'Activité de l'Année</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-neutral-900 dark:text-neutral-50">{stats.completionRate.toFixed(1)}%</span>
            </div>
          </div>
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Total Actions */}
        <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 rounded-2xl p-4 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider block">Habitudes Totales Validées</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black font-mono text-neutral-900 dark:text-neutral-50">{stats.totalHabitsCompleted}</span>
              <span className="text-xs text-neutral-400 font-bold">validations</span>
            </div>
          </div>
          <div className="p-2.5 bg-neutral-100 dark:bg-neutral-850 text-neutral-800 dark:text-neutral-300 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* HEATMAP GRIDS CONTAINER */}
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 shadow-3xs overflow-x-auto scrollbar-thin">
        <div className="min-w-[780px] flex gap-3">
          
          {/* Day of Week Labels */}
          <div className="flex flex-col justify-between py-1 text-[9px] font-black text-neutral-400 uppercase tracking-widest font-mono select-none h-[112px] mt-6 pr-2">
            <span>Lun</span>
            <span>Mer</span>
            <span>Ven</span>
            <span>Dim</span>
          </div>

          {/* Grid of Weeks */}
          <div className="flex-1 space-y-1">
            
            {/* Months labels at the top */}
            <div className="grid grid-cols-[repeat(53,14px)] gap-[3px] text-[8px] font-bold text-neutral-400 uppercase tracking-wider h-6 select-none border-b border-neutral-100/60 pb-1.5 mb-1.5">
              {/* Approximately label positions */}
              {Array.from({ length: 53 }).map((_, idx) => {
                // Approximate Month boundaries:
                // Column 0-3 Jan, 4-7 Feb, 8-11 Mar, 12-16 Apr, 17-20 May, 21-25 Jun, 26-29 Jul, 30-33 Aug, 34-38 Sep, 39-42 Oct, 43-47 Nov, 48-52 Dec
                if (idx === 0) return <span key={idx} className="col-start-1">Jan</span>;
                if (idx === 4) return <span key={idx} className="col-start-5">Fév</span>;
                if (idx === 8) return <span key={idx} className="col-start-9">Mar</span>;
                if (idx === 13) return <span key={idx} className="col-start-14">Avr</span>;
                if (idx === 18) return <span key={idx} className="col-start-19">Mai</span>;
                if (idx === 22) return <span key={idx} className="col-start-23">Jui</span>;
                if (idx === 27) return <span key={idx} className="col-start-28">Jul</span>;
                if (idx === 31) return <span key={idx} className="col-start-32">Aoû</span>;
                if (idx === 36) return <span key={idx} className="col-start-37">Sep</span>;
                if (idx === 40) return <span key={idx} className="col-start-41">Oct</span>;
                if (idx === 45) return <span key={idx} className="col-start-46">Nov</span>;
                if (idx === 49) return <span key={idx} className="col-start-50">Déc</span>;
                return null;
              })}
            </div>

            {/* Grid display */}
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIdx) => (
                <div key={weekIdx} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIdx) => {
                    if (!day) {
                      return (
                        <div 
                          key={dayIdx} 
                          className="w-3.5 h-3.5 rounded-[3px] bg-transparent pointer-events-none" 
                        />
                      );
                    }

                    const dateStr = day.toISOString().split("T")[0];
                    const numCompleted = habitHistory[dateStr]?.length || 0;
                    const isSelected = selectedDate === dateStr;

                    return (
                      <button
                        key={day.getTime()}
                        onClick={() => setSelectedDate(dateStr)}
                        className={`w-3.5 h-3.5 rounded-[3px] border transition-all duration-150 cursor-pointer ${getCellColor(dateStr)} ${
                          isSelected 
                            ? "ring-2 ring-neutral-900 dark:ring-white scale-115 border-neutral-900 z-10 shadow-md" 
                            : "hover:scale-120 hover:shadow-3xs"
                        }`}
                        title={`${formatDateLabel(dateStr)} : ${numCompleted} / ${dailyHabitsList.length} routines validées`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

      {/* DETAIL RETROSPECTIVE DRAWER OR CARD */}
      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.div
            key={selectedDate}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 rounded-3xl p-6 shadow-2xs space-y-4"
          >
            
            {/* Day Header */}
            <div className="flex items-center justify-between gap-4 pb-2 border-b border-neutral-200/50 dark:border-neutral-800">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-neutral-400" />
                <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-wider font-mono">
                  {formatDateLabel(selectedDate)}
                </h4>
              </div>
              <button 
                onClick={() => setSelectedDate(null)}
                className="text-xs font-bold text-neutral-400 hover:text-neutral-700 hover:bg-neutral-200/50 dark:hover:bg-neutral-800 py-1 px-2.5 rounded-lg transition-colors cursor-pointer"
              >
                Masquer
              </button>
            </div>

            {/* Stats and completion */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <p className="text-xs text-neutral-500">
                Vous pilotez la consistance de cette journée. Cliquez sur une habitude pour l'enregistrer ou la retirer rétroactivement de votre historique.
              </p>
              
              <div className="bg-white dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-850 px-3.5 py-1.5 rounded-xl text-xs font-extrabold font-mono text-neutral-800 dark:text-neutral-200 shrink-0 self-start sm:self-center shadow-3xs">
                Score : {selectedDayHabits.filter(h => h.completed).length} / {dailyHabitsList.length}
              </div>
            </div>

            {/* Checklist of Habits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 pt-2">
              {selectedDayHabits.map(habit => (
                <button
                  key={habit.id}
                  onClick={() => handleTogglePastHabit(habit.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-2xl border text-left cursor-pointer transition-all ${
                    habit.completed
                      ? "bg-white dark:bg-neutral-950 border-neutral-200 text-neutral-400 dark:text-neutral-500"
                      : "bg-white dark:bg-neutral-950 border-neutral-200/60 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/50"
                  }`}
                >
                  <div>
                    {habit.completed ? (
                      <CheckCircle className="w-4.5 h-4.5 text-emerald-600 fill-emerald-100 dark:fill-emerald-950" />
                    ) : (
                      <Square className="w-4.5 h-4.5 text-neutral-300" />
                    )}
                  </div>
                  <div>
                    <span className={`text-xs font-extrabold block ${habit.completed ? "line-through" : ""}`}>
                      {habit.name}
                    </span>
                    {habit.description && (
                      <span className="text-[10px] text-neutral-400 block mt-0.5">{habit.description}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
