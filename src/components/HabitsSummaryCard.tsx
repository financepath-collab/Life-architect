import React from "react";
import { motion } from "motion/react";
import { 
  Flame, 
  TrendingUp, 
  TrendingDown, 
  Award, 
  Check, 
  HelpCircle,
  Activity,
  Sparkles
} from "lucide-react";
import { DailyHabit } from "../types";

interface HabitsSummaryCardProps {
  dailyHabits: DailyHabit[];
  habitHistory: Record<string, string[]>;
}

export const HabitsSummaryCard: React.FC<HabitsSummaryCardProps> = ({
  dailyHabits,
  habitHistory,
}) => {
  const stats = React.useMemo(() => {
    const today = new Date();
    const currentDay = today.getDay(); // 0 is Sunday, 1 is Monday...
    
    // Convert to Monday-first week (1: Mon, 7: Sun)
    const elapsedDays = currentDay === 0 ? 7 : currentDay;
    
    // Find Monday of the current week
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
    const monday = new Date(today);
    monday.setDate(today.getDate() - distanceToMonday);
    monday.setHours(0, 0, 0, 0);

    const habitsCount = dailyHabits.length;
    const dayNamesFr = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
    const weeklyHistoryByDay: { 
      dateStr: string; 
      dayName: string; 
      completedCount: number; 
      percentage: number; 
      isToday: boolean;
      isFuture: boolean;
    }[] = [];

    let totalCompletionsThisWeek = 0;
    const weeklyPossibleCompletions = elapsedDays * (habitsCount || 1);

    for (let i = 0; i < 7; i++) {
      const day = new Date(monday);
      day.setDate(monday.getDate() + i);
      const dateStr = day.toISOString().split("T")[0];
      const isFuture = day > today;
      const isToday = dateStr === today.toISOString().split("T")[0];

      // Get completions
      let completedList = habitHistory[dateStr] || [];
      if (isToday) {
        // Use live state if it's today
        const liveCompletions = dailyHabits.filter(h => h.completed).map(h => h.id);
        if (liveCompletions.length > completedList.length) {
          completedList = liveCompletions;
        }
      }

      const completedCount = completedList.length;
      const percentage = habitsCount > 0 ? (completedCount / habitsCount) * 100 : 0;

      if (i < elapsedDays) {
        totalCompletionsThisWeek += completedCount;
      }

      weeklyHistoryByDay.push({
        dateStr,
        dayName: dayNamesFr[i],
        completedCount,
        percentage,
        isToday,
        isFuture,
      });
    }

    const weeklyRate = weeklyPossibleCompletions > 0 
      ? (totalCompletionsThisWeek / weeklyPossibleCompletions) * 100 
      : 0;

    // Monthly average completion rate (last 30 days)
    let totalCompletions30Days = 0;
    const monthlyPossibleCompletions = 30 * (habitsCount || 1);

    for (let i = 0; i < 30; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      
      let completedList = habitHistory[dateStr] || [];
      if (dateStr === today.toISOString().split("T")[0]) {
        const liveCompletions = dailyHabits.filter(h => h.completed).map(h => h.id);
        if (liveCompletions.length > completedList.length) {
          completedList = liveCompletions;
        }
      }
      totalCompletions30Days += completedList.length;
    }

    const monthlyRate = monthlyPossibleCompletions > 0 
      ? (totalCompletions30Days / monthlyPossibleCompletions) * 100 
      : 0;

    const diff = weeklyRate - monthlyRate;

    return {
      weeklyRate: Math.round(weeklyRate),
      monthlyRate: Math.round(monthlyRate),
      diff: Math.round(diff * 10) / 10,
      days: weeklyHistoryByDay,
      habitsCount,
      completedToday: dailyHabits.filter(h => h.completed).length,
    };
  }, [dailyHabits, habitHistory]);

  if (stats.habitsCount === 0) {
    return (
      <div id="habits-summary-empty" className="bg-white border border-neutral-200/85 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <span className="p-1.5 bg-neutral-100 rounded-lg text-neutral-500">
            <Activity className="w-4 h-4" />
          </span>
          <h3 className="text-sm font-black text-neutral-950 uppercase tracking-tight">
            Performance des Habitudes
          </h3>
        </div>
        <p className="text-xs text-neutral-500">
          Aucune habitude n'est configurée pour le moment. Allez dans le module de productivité pour en créer.
        </p>
      </div>
    );
  }

  // Determine feedback styles & messages based on performance
  const isBetter = stats.diff >= 0;
  const absDiff = Math.abs(stats.diff);

  return (
    <div 
      id="habits-summary-card" 
      className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs space-y-6 animate-in fade-in duration-300"
    >
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div className="flex items-center gap-2.5">
          <span className="p-1.5 bg-neutral-900 text-white rounded-lg shadow-sm">
            <Flame className="w-4 h-4 text-amber-400" />
          </span>
          <div>
            <h3 className="text-sm font-black text-neutral-950 uppercase tracking-tight">
              Analyse de Discipline Hebdomadaire
            </h3>
            <p className="text-[11px] text-neutral-500 font-medium">
              Taux de complétion de la semaine en cours comparé à la moyenne des 30 derniers jours
            </p>
          </div>
        </div>
        
        {/* Dynamic Comparison Pill */}
        <div className="flex items-center gap-2">
          {stats.diff > 0 ? (
            <span className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-150 px-2.5 py-1 rounded-full font-mono">
              <TrendingUp className="w-3.5 h-3.5" />
              +{absDiff}% ce mois-ci
            </span>
          ) : stats.diff < 0 ? (
            <span className="flex items-center gap-1 text-[11px] font-extrabold text-amber-700 bg-amber-50 border border-amber-150 px-2.5 py-1 rounded-full font-mono">
              <TrendingDown className="w-3.5 h-3.5" />
              -{absDiff}% sous la moyenne
            </span>
          ) : (
            <span className="flex items-center gap-1 text-[11px] font-extrabold text-neutral-600 bg-neutral-50 border border-neutral-200 px-2.5 py-1 rounded-full font-mono">
              Stable
            </span>
          )}
        </div>
      </div>

      {/* Main Grid Structure */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* COL 1: The Radial Progress Gauge */}
        <div className="md:col-span-3 flex flex-col items-center justify-center p-3 bg-neutral-50/40 rounded-2xl border border-neutral-200/40">
          <div className="relative w-24 h-24 flex items-center justify-center">
            {/* SVG circle meter */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="38"
                className="stroke-neutral-100"
                strokeWidth="7"
                fill="transparent"
              />
              <circle
                cx="48"
                cy="48"
                r="38"
                className="stroke-neutral-900 transition-all duration-700 ease-out"
                strokeWidth="7"
                fill="transparent"
                strokeDasharray={238.76}
                strokeDashoffset={238.76 - (238.76 * Math.min(100, Math.max(0, stats.weeklyRate))) / 100}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xl font-black text-neutral-950 font-mono leading-none">
                {stats.weeklyRate}%
              </span>
              <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest mt-1">
                Semaine
              </span>
            </div>
          </div>
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider mt-3 font-mono">
            {stats.completedToday} / {stats.habitsCount} Complétées aujourd'hui
          </span>
        </div>

        {/* COL 2: Informational Comparison Detail */}
        <div className="md:col-span-4 space-y-4">
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">État comparatif</h4>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-neutral-900 font-mono">{stats.weeklyRate}%</span>
              <span className="text-xs text-neutral-400">vs</span>
              <span className="text-base font-extrabold text-neutral-500 font-mono">{stats.monthlyRate}% mensuel</span>
            </div>
          </div>

          <div className="p-3 bg-neutral-50 border border-neutral-200/50 rounded-xl">
            <p className="text-xs font-medium text-neutral-600 leading-relaxed">
              {stats.diff > 2 ? (
                <span>
                  🔥 <strong className="text-neutral-900 font-bold">Excellent travail !</strong> Votre discipline cette semaine est supérieure de {absDiff}% à votre moyenne habituelle. Gardez ce rythme soutenu !
                </span>
              ) : stats.diff < -2 ? (
                <span>
                  💪 <strong className="text-neutral-900 font-bold">Prenez de l'élan !</strong> Vous êtes légèrement en retrait de {absDiff}% par rapport à votre moyenne mensuelle. Un petit effort aujourd'hui peut tout changer.
                </span>
              ) : (
                <span>
                  ✨ <strong className="text-neutral-900 font-bold">Rythme régulier !</strong> Vous êtes parfaitement aligné avec votre performance moyenne de {stats.monthlyRate}%. La constance est la clé du succès.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* COL 3: The 7-Day Matrix Tracker */}
        <div className="md:col-span-5 space-y-3">
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Calendrier de la semaine</h4>
          
          <div className="grid grid-cols-7 gap-2">
            {stats.days.map((day, idx) => {
              // Decide background color and text colors depending on performance & state
              let bgColor = "bg-neutral-50 border-neutral-200 text-neutral-400";
              let ringColor = "";

              if (day.isFuture) {
                bgColor = "bg-neutral-50/40 border-neutral-100 text-neutral-300";
              } else if (day.completedCount === 0) {
                bgColor = "bg-neutral-100 border-neutral-200 text-neutral-400";
              } else if (day.percentage === 100) {
                bgColor = "bg-emerald-600 border-emerald-700 text-white font-bold";
              } else if (day.percentage >= 60) {
                bgColor = "bg-emerald-100 border-emerald-200 text-emerald-950 font-bold";
              } else if (day.percentage >= 30) {
                bgColor = "bg-emerald-50 border-emerald-150 text-emerald-800";
              } else {
                bgColor = "bg-amber-50 border-amber-150 text-amber-800";
              }

              if (day.isToday) {
                ringColor = "ring-2 ring-neutral-950 ring-offset-2";
              }

              return (
                <div 
                  key={idx}
                  className={`flex flex-col items-center justify-between p-2 rounded-xl border text-center transition-all ${bgColor} ${ringColor}`}
                  title={`${day.completedCount}/${stats.habitsCount} habitudes complétées le ${day.dateStr}`}
                >
                  <span className="text-[10px] uppercase font-black tracking-wider block opacity-75">{day.dayName}</span>
                  
                  {day.percentage === 100 && !day.isFuture ? (
                    <div className="w-5 h-5 rounded-full bg-white text-emerald-700 flex items-center justify-center my-1 shadow-3xs scale-90">
                      <Award className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  ) : (
                    <span className="text-xs font-mono font-black my-1 block">
                      {day.isFuture ? "-" : day.completedCount}
                    </span>
                  )}
                  
                  <span className="text-[8px] font-bold block opacity-60">
                    {day.isFuture ? "Prévu" : `${Math.round(day.percentage)}%`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
