import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Activity, 
  HeartPulse, 
  Briefcase, 
  Brain, 
  User, 
  Coins, 
  Sparkles, 
  Award, 
  TrendingUp, 
  ChevronRight, 
  CheckCircle2, 
  Layers, 
  PieChart, 
  BarChart2, 
  Target
} from "lucide-react";
import { DailyHabit } from "../types";

interface WeeklyCategoryStatsCardProps {
  dailyHabits: DailyHabit[];
  habitHistory: Record<string, string[]>;
  onNavigateToHabits?: () => void;
}

// Map category raw string to display config
const CATEGORY_CONFIG: Record<string, {
  label: string;
  icon: React.ElementType;
  color: string; // Tailwind stroke/bg color classes
  badgeBg: string;
  badgeText: string;
  gradientFrom: string;
  gradientTo: string;
  strokeColor: string;
}> = {
  Health: {
    label: "Santé & Vitalité",
    icon: HeartPulse,
    color: "emerald",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
    badgeText: "text-emerald-700 dark:text-emerald-400",
    gradientFrom: "#10b981",
    gradientTo: "#059669",
    strokeColor: "#10b981"
  },
  Santé: {
    label: "Santé & Vitalité",
    icon: HeartPulse,
    color: "emerald",
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800",
    badgeText: "text-emerald-700 dark:text-emerald-400",
    gradientFrom: "#10b981",
    gradientTo: "#059669",
    strokeColor: "#10b981"
  },
  Career: {
    label: "Carrière & Pro",
    icon: Briefcase,
    color: "indigo",
    badgeBg: "bg-indigo-50 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800",
    badgeText: "text-indigo-700 dark:text-indigo-400",
    gradientFrom: "#6366f1",
    gradientTo: "#4f46e5",
    strokeColor: "#6366f1"
  },
  Mental: {
    label: "Mental & Mindset",
    icon: Brain,
    color: "purple",
    badgeBg: "bg-purple-50 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800",
    badgeText: "text-purple-700 dark:text-purple-400",
    gradientFrom: "#a855f7",
    gradientTo: "#7e22ce",
    strokeColor: "#a855f7"
  },
  Personal: {
    label: "Vie Personnelle",
    icon: User,
    color: "amber",
    badgeBg: "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800",
    badgeText: "text-amber-700 dark:text-amber-400",
    gradientFrom: "#f59e0b",
    gradientTo: "#d97706",
    strokeColor: "#f59e0b"
  },
  personal: {
    label: "Vie Personnelle",
    icon: User,
    color: "amber",
    badgeBg: "bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800",
    badgeText: "text-amber-700 dark:text-amber-400",
    gradientFrom: "#f59e0b",
    gradientTo: "#d97706",
    strokeColor: "#f59e0b"
  },
  Finance: {
    label: "Finances & Discipline",
    icon: Coins,
    color: "cyan",
    badgeBg: "bg-cyan-50 dark:bg-cyan-950/60 border-cyan-200 dark:border-cyan-800",
    badgeText: "text-cyan-700 dark:text-cyan-400",
    gradientFrom: "#06b6d4",
    gradientTo: "#0891b2",
    strokeColor: "#06b6d4"
  }
};

const DEFAULT_CONFIG = {
  label: "Autre Catégorie",
  icon: Activity,
  color: "neutral",
  badgeBg: "bg-neutral-100 dark:bg-zinc-800 border-neutral-200 dark:border-zinc-700",
  badgeText: "text-neutral-700 dark:text-neutral-300",
  gradientFrom: "#737373",
  gradientTo: "#404040",
  strokeColor: "#737373"
};

export default function WeeklyCategoryStatsCard({
  dailyHabits = [],
  habitHistory = {},
  onNavigateToHabits
}: WeeklyCategoryStatsCardProps) {
  const [timeframe, setTimeframe] = useState<"currentWeek" | "last7Days">("currentWeek");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Compute stats per category
  const categoryStats = useMemo(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Determine target days array
    const targetDates: { dateStr: string; isToday: boolean }[] = [];

    if (timeframe === "currentWeek") {
      const currentDay = today.getDay(); // 0 = Sun
      const elapsedDays = currentDay === 0 ? 7 : currentDay; // 1 = Mon ... 7 = Sun
      const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1;
      const monday = new Date(today);
      monday.setDate(today.getDate() - distanceToMonday);

      for (let i = 0; i < elapsedDays; i++) {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        const dStr = d.toISOString().split("T")[0];
        targetDates.push({ dateStr: dStr, isToday: dStr === todayStr });
      }
    } else {
      // Last 7 rolling days
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dStr = d.toISOString().split("T")[0];
        targetDates.push({ dateStr: dStr, isToday: dStr === todayStr });
      }
    }

    // Group habits by normalized category
    const categoriesMap: Record<string, DailyHabit[]> = {};

    dailyHabits.forEach(h => {
      let cat = h.category || "Personal";
      if (cat === "personal") cat = "Personal";
      if (cat === "professional") cat = "Career";
      if (cat === "Santé") cat = "Health";

      if (!categoriesMap[cat]) {
        categoriesMap[cat] = [];
      }
      categoriesMap[cat].push(h);
    });

    // Ensure main standard categories appear even if empty, or filter only existing
    const standardCategories = ["Health", "Career", "Mental", "Personal", "Finance"];
    standardCategories.forEach(cat => {
      if (!categoriesMap[cat]) {
        categoriesMap[cat] = [];
      }
    });

    // Calculate stats for each category
    return Object.entries(categoriesMap).map(([catKey, habits]) => {
      const config = CATEGORY_CONFIG[catKey] || DEFAULT_CONFIG;
      const habitIds = new Set(habits.map(h => h.id));
      const totalHabitsCount = habits.length;

      let completedCount = 0;
      const totalPossible = targetDates.length * (totalHabitsCount || 0);

      targetDates.forEach(({ dateStr, isToday }) => {
        let doneForDay = habitHistory[dateStr] || [];
        if (isToday) {
          const liveDone = habits.filter(h => h.completed).map(h => h.id);
          if (liveDone.length > doneForDay.length) {
            doneForDay = liveDone;
          }
        }
        // Count how many habits of this category were completed on dateStr
        const categoryDoneCount = doneForDay.filter(id => habitIds.has(id)).length;
        completedCount += categoryDoneCount;
      });

      const percentage = totalPossible > 0 ? Math.round((completedCount / totalPossible) * 100) : 0;

      // Status appraisal
      let statusLabel = "À lancer";
      let statusColor = "text-neutral-400";
      if (totalPossible > 0) {
        if (percentage >= 85) {
          statusLabel = "Excellente discipline";
          statusColor = "text-emerald-600 dark:text-emerald-400";
        } else if (percentage >= 60) {
          statusLabel = "Bonne dynamique";
          statusColor = "text-indigo-600 dark:text-indigo-400";
        } else if (percentage >= 35) {
          statusLabel = "Modérée";
          statusColor = "text-amber-600 dark:text-amber-400";
        } else {
          statusLabel = "À renforcer";
          statusColor = "text-rose-600 dark:text-rose-400";
        }
      }

      return {
        catKey,
        habits,
        totalHabitsCount,
        completedCount,
        totalPossible,
        percentage,
        config,
        statusLabel,
        statusColor
      };
    });
  }, [dailyHabits, habitHistory, timeframe]);

  // Overall weekly average across all categories
  const overallAverage = useMemo(() => {
    const validCats = categoryStats.filter(c => c.totalHabitsCount > 0);
    if (validCats.length === 0) return 0;
    const sum = validCats.reduce((acc, c) => acc + c.percentage, 0);
    return Math.round(sum / validCats.length);
  }, [categoryStats]);

  return (
    <div id="weekly-category-stats-container" className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-6">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-neutral-900 text-white dark:bg-indigo-600 rounded-2xl shadow-2xs shrink-0">
            <PieChart className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-neutral-950 dark:text-white uppercase tracking-tight">
                Taux de Réussite Hebdomadaire par Catégorie
              </h3>
              <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 rounded-full text-[10px] font-mono font-bold">
                Moyenne: {overallAverage}%
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Jauges visuelles d'accomplissement par pôle de discipline (Santé, Carrière, Mindset, Vie Perso, Finances).
            </p>
          </div>
        </div>

        {/* Timeframe Selector & CTA */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-zinc-800 p-1 rounded-2xl border border-neutral-200/70 dark:border-zinc-700/60">
            <button
              onClick={() => setTimeframe("currentWeek")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeframe === "currentWeek"
                  ? "bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white shadow-2xs font-black"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              Semaine en cours
            </button>
            <button
              onClick={() => setTimeframe("last7Days")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                timeframe === "last7Days"
                  ? "bg-white dark:bg-zinc-700 text-neutral-900 dark:text-white shadow-2xs font-black"
                  : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
              }`}
            >
              7 jours glissants
            </button>
          </div>

          {onNavigateToHabits && (
            <button
              onClick={onNavigateToHabits}
              className="p-2 bg-neutral-50 hover:bg-neutral-100 dark:bg-zinc-800 dark:hover:bg-zinc-700 border border-neutral-200 dark:border-zinc-700 rounded-2xl text-neutral-600 dark:text-neutral-300 transition-all cursor-pointer"
              title="Aller au module complet"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Gauges per Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {categoryStats.map(stat => {
          const Icon = stat.config.icon;
          const isExpanded = expandedCategory === stat.catKey;
          const radius = 32;
          const circumference = 2 * Math.PI * radius; // ~201.06
          const strokeOffset = circumference - (circumference * Math.min(100, Math.max(0, stat.percentage))) / 100;

          return (
            <motion.div
              key={stat.catKey}
              whileHover={{ y: -2 }}
              onClick={() => setExpandedCategory(isExpanded ? null : stat.catKey)}
              className={`bg-neutral-50/70 dark:bg-zinc-800/40 border border-neutral-200/80 dark:border-zinc-700/60 rounded-2xl p-4 transition-all cursor-pointer space-y-3 flex flex-col justify-between relative overflow-hidden ${
                isExpanded ? "ring-2 ring-neutral-900 dark:ring-white shadow-md bg-white dark:bg-zinc-800" : "hover:border-neutral-300 dark:hover:border-zinc-600"
              }`}
            >
              {/* Category Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`p-2 rounded-xl border ${stat.config.badgeBg}`}>
                    <Icon className={`w-4 h-4 ${stat.config.badgeText}`} />
                  </span>
                  <span className="text-xs font-black text-neutral-900 dark:text-white truncate max-w-[100px]">
                    {stat.config.label}
                  </span>
                </div>
                <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded-full border ${stat.config.badgeBg} ${stat.config.badgeText}`}>
                  {stat.totalHabitsCount} hab.
                </span>
              </div>

              {/* Central Semi-Arc Visual Gauge */}
              <div className="flex flex-col items-center justify-center py-2 my-1">
                <div className="relative w-22 h-22 flex items-center justify-center">
                  {/* SVG circular gauge */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="44"
                      cy="44"
                      r={radius}
                      className="stroke-neutral-200 dark:stroke-zinc-700"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="44"
                      cy="44"
                      r={radius}
                      stroke={stat.config.strokeColor}
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeOffset}
                      strokeLinecap="round"
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>

                  {/* Percentage label */}
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-black font-mono text-neutral-900 dark:text-white leading-none">
                      {stat.percentage}%
                    </span>
                    <span className={`text-[8px] font-bold uppercase mt-1 ${stat.statusColor}`}>
                      {stat.statusLabel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Linear Progress Bar & Ratio */}
              <div className="space-y-1.5 pt-1 border-t border-neutral-200/50 dark:border-zinc-700/50">
                <div className="flex items-center justify-between text-[10px] font-mono font-bold text-neutral-500 dark:text-neutral-400">
                  <span>Validées</span>
                  <span>{stat.completedCount} / {stat.totalPossible}</span>
                </div>
                
                <div className="w-full bg-neutral-200/70 dark:bg-zinc-700 h-2 rounded-full overflow-hidden p-0.5">
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${stat.percentage}%`,
                      backgroundColor: stat.config.strokeColor
                    }}
                  />
                </div>
              </div>

              {/* Expand details hint */}
              {stat.habits.length > 0 && (
                <div className="text-[9px] text-center text-neutral-400 dark:text-neutral-500 font-bold font-mono">
                  {isExpanded ? "Masquer les habitudes ▲" : "Voir habitudes ▼"}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Expanded Category Habit Breakdown Drawer */}
      <AnimatePresence>
        {expandedCategory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-neutral-50 dark:bg-zinc-800/60 border border-neutral-200/80 dark:border-zinc-700/60 rounded-2xl p-4 space-y-3 overflow-hidden"
          >
            {(() => {
              const matched = categoryStats.find(c => c.catKey === expandedCategory);
              if (!matched || matched.habits.length === 0) return null;

              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-500" />
                      <span>Détail des habitudes: {matched.config.label}</span>
                    </h4>
                    <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 font-mono">
                      Taux: {matched.percentage}% ({matched.completedCount} / {matched.totalPossible} exécutions)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {matched.habits.map(h => (
                      <div 
                        key={h.id} 
                        className={`p-3 bg-white dark:bg-zinc-900 border rounded-xl flex items-center justify-between gap-2.5 ${
                          h.completed ? "border-emerald-200 dark:border-emerald-800/60" : "border-neutral-200 dark:border-zinc-700"
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0">
                          <p className={`text-xs font-bold truncate ${h.completed ? "line-through text-neutral-400" : "text-neutral-900 dark:text-white"}`}>
                            {h.name}
                          </p>
                          <span className="text-[10px] text-neutral-400 font-mono block">
                            {h.frequency || "Quotidien"} • {h.dueTime || "Toute la journée"}
                          </span>
                        </div>

                        {h.completed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-neutral-300 dark:border-zinc-600 rounded-full shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
