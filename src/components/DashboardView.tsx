import React, { useState } from "react";
import { DailyHabit, VideoFocus } from "../types";
import { 
  Tv, 
  CheckSquare, 
  Square, 
  BookOpen, 
  Flame, 
  Award, 
  HeartPulse, 
  Smile, 
  Utensils, 
  Sparkles, 
  Shirt, 
  Video,
  Share2,
  TrendingUp,
  CheckCircle2
} from "lucide-react";

interface DashboardViewProps {
  dailyHabits: DailyHabit[];
  toggleHabit: (id: string) => void;
  videoFocus: VideoFocus;
  updateVideoFocus: (updated: Partial<VideoFocus>) => void;
  streakCount: number;
}

export default function DashboardView({
  dailyHabits,
  toggleHabit,
  videoFocus,
  updateVideoFocus,
  streakCount
}: DashboardViewProps) {
  const [newTitle, setNewTitle] = useState(videoFocus.videoTitle);

  // Calculate stats
  const completedHabits = dailyHabits.filter(h => h.completed).length;
  const totalHabits = dailyHabits.length;
  const habitPercentage = totalHabits > 0 ? Math.round((completedHabits / totalHabits) * 100) : 0;

  // Video publishing state
  const isVideoDone = videoFocus.isCompleted;
  const publishCount = [videoFocus.publishedFB, videoFocus.publishedTikTok, videoFocus.publishedSpotify].filter(Boolean).length;
  
  const handleTitleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateVideoFocus({ videoTitle: newTitle });
  };

  return (
    <div className="space-y-6">
      {/* Header Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Moroccan Creator Profile & Motivation */}
        <div className="md:col-span-2 bg-slate-800/60 backdrop-blur border border-slate-700/50 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-display text-sm font-medium tracking-wider uppercase">
              <Sparkles className="w-4 h-4" />
              Focus du Jour — Productivité Optimisée
            </div>
            <h2 className="text-2xl font-bold font-display mt-2 text-white">
              Bonjour, Prêt à conquérir vos objectifs ?
            </h2>
            <p className="text-slate-300 mt-2 text-sm leading-relaxed">
              Vous gérez 3 chaînes d'élite. Aujourd'hui, concentrez-vous sur un contenu d'impact et validez vos habitudes quotidiennes pour garder l'équilibre. 
            </p>
          </div>
          <div className="mt-4 flex items-center gap-4 text-slate-400 text-xs border-t border-slate-700/60 pt-4">
            <div className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Chaînes Actives: 3
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Objectif: 1 vidéo + 3 articles/semaine
            </div>
          </div>
        </div>

        {/* Streak Counter / Habit Ring */}
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 p-6 rounded-2xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-full text-xs font-semibold">
            <Flame className="w-3.5 h-3.5" />
            {streakCount} Jours
          </div>
          
          {/* Custom SVG Circular Progress Ring */}
          <div className="relative w-28 h-28 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r="45"
                className="stroke-slate-700"
                strokeWidth="8"
                fill="transparent"
              />
              <circle
                cx="56"
                cy="56"
                r="45"
                className="stroke-emerald-500 transition-all duration-500 ease-out"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 45}
                strokeDashoffset={2 * Math.PI * 45 * (1 - habitPercentage / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold font-display text-white">{habitPercentage}%</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">Habitudes</span>
            </div>
          </div>
          
          <div className="mt-3 text-sm font-medium text-slate-200">
            {completedHabits} de {totalHabits} routines complétées
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Video Production Focus (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div className="flex items-center gap-2">
              <Video className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold font-display text-white">Vidéo d'Aujourd'hui</h3>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              isVideoDone ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}>
              {isVideoDone ? "Publiée" : "En cours"}
            </span>
          </div>

          {/* Channel Selector */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Sélectionner la chaîne du jour</label>
            <div className="grid grid-cols-1 gap-2">
              {(["The Moroccan Analyst", "The Moroccan CFO", "The Moroccan Economist"] as const).map((chan) => (
                <button
                  key={chan}
                  onClick={() => updateVideoFocus({ channel: chan })}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-medium transition-all ${
                    videoFocus.channel === chan
                      ? "bg-emerald-500/10 border-emerald-500 text-white"
                      : "bg-slate-900/40 border-slate-700/40 text-slate-400 hover:bg-slate-700/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Tv className={`w-4 h-4 ${videoFocus.channel === chan ? "text-emerald-400" : "text-slate-500"}`} />
                    <span>{chan}</span>
                  </div>
                  {videoFocus.channel === chan && <div className="w-2 h-2 rounded-full bg-emerald-500"></div>}
                </button>
              ))}
            </div>
          </div>

          {/* Video Title Input */}
          <form onSubmit={handleTitleSubmit} className="space-y-2">
            <label className="text-xs text-slate-400 font-medium uppercase tracking-wider">Sujet ou Titre de la Vidéo</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Ex: Analyse de la bourse de Casablanca..."
                className="flex-1 bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-xs font-medium transition-colors"
              >
                Mettre à jour
              </button>
            </div>
          </form>

          {/* Workflow Stepper */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs text-slate-400 font-medium uppercase tracking-wider">Statut de Production</h4>
            
            {/* Completion Toggle Button */}
            <button
              onClick={() => updateVideoFocus({ isCompleted: !videoFocus.isCompleted })}
              className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium border text-sm transition-all ${
                videoFocus.isCompleted
                  ? "bg-emerald-500 text-slate-950 border-emerald-400 font-semibold"
                  : "bg-slate-900/80 border-slate-700 text-slate-200 hover:bg-slate-800"
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              {videoFocus.isCompleted ? "Vidéo Validée & Terminée !" : "Marquer la Vidéo comme Terminée"}
            </button>

            {/* Cross Publishing Checklist */}
            <div className="bg-slate-900/40 border border-slate-700/40 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold border-b border-slate-800 pb-2">
                <span className="flex items-center gap-1.5"><Share2 className="w-3.5 h-3.5" /> Multi-Publication</span>
                <span>{publishCount}/3</span>
              </div>
              
              <div className="space-y-2.5 pt-1">
                {[
                  { key: "publishedFB", label: "Facebook Page (Morocco Community)", color: "text-blue-400" },
                  { key: "publishedTikTok", label: "TikTok (Short Format Video)", color: "text-pink-400" },
                  { key: "publishedSpotify", label: "Spotify (Audio podcast / Video podcast)", color: "text-emerald-400" }
                ].map((item) => (
                  <label 
                    key={item.key}
                    className="flex items-center justify-between cursor-pointer p-1.5 hover:bg-slate-800/30 rounded-lg transition-colors"
                  >
                    <span className="text-sm text-slate-300">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={!!(videoFocus as any)[item.key]}
                      onChange={(e) => updateVideoFocus({ [item.key]: e.target.checked })}
                      className="w-4 h-4 rounded border-slate-700 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 bg-slate-800"
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Habits & Routines Checklist (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold font-display text-white">Routines & Habitudes Quotidiennes</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              Jour {streakCount}
            </span>
          </div>

          {/* Grouped Habits */}
          <div className="space-y-4">
            {/* Learning and Mind Gym */}
            <div className="space-y-2">
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">Développement Intellectuel</span>
              <div className="grid grid-cols-1 gap-2">
                {dailyHabits
                  .filter(h => h.category === "professional")
                  .map((habit) => (
                    <button
                      key={habit.id}
                      onClick={() => toggleHabit(habit.id)}
                      className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all ${
                        habit.completed
                          ? "bg-emerald-500/5 border-emerald-500/30 text-slate-400"
                          : "bg-slate-900/30 border-slate-700/50 text-white hover:bg-slate-800/30"
                      }`}
                    >
                      <div className="mt-0.5">
                        {habit.completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`text-sm font-medium ${habit.completed ? "line-through text-slate-500" : "text-slate-100"}`}>
                          {habit.name}
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{habit.description}</p>
                      </div>
                      <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md font-mono self-start uppercase">
                        {habit.name.includes("10") ? "10 min" : "30 min"}
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Well-being & Personal Preparation */}
            <div className="space-y-2">
              <span className="text-xs text-emerald-400 font-semibold uppercase tracking-wider block">Vie Personnelle & Organisation</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {dailyHabits
                  .filter(h => h.category === "personal")
                  .map((habit) => {
                    // Match icons
                    let IconComponent = Smile;
                    if (habit.name.toLowerCase().includes("sport")) IconComponent = HeartPulse;
                    else if (habit.name.toLowerCase().includes("dîner") || habit.name.toLowerCase().includes("diner")) IconComponent = Utensils;
                    else if (habit.name.toLowerCase().includes("vêtement") || habit.name.toLowerCase().includes("habil")) IconComponent = Shirt;
                    else if (habit.name.toLowerCase().includes("care") || habit.name.toLowerCase().includes("skin")) IconComponent = Sparkles;

                    return (
                      <button
                        key={habit.id}
                        onClick={() => toggleHabit(habit.id)}
                        className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                          habit.completed
                            ? "bg-emerald-500/5 border-emerald-500/20 text-slate-400"
                            : "bg-slate-900/30 border-slate-700/50 text-white hover:bg-slate-800/30"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {habit.completed ? (
                            <CheckSquare className="w-4 h-4 text-emerald-500" />
                          ) : (
                            <Square className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className={`text-sm font-medium truncate ${habit.completed ? "line-through text-slate-500" : "text-slate-200"}`}>
                            {habit.name}
                          </div>
                        </div>
                        <IconComponent className={`w-4 h-4 flex-shrink-0 ${habit.completed ? "text-slate-600" : "text-slate-400"}`} />
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
