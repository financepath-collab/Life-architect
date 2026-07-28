import React, { useState } from "react";
import { BookItem, ScreenMediaItem, Formation, DailyHabit, MediaProgressLog } from "../types";
import { 
  Tv, 
  BookOpen, 
  GraduationCap, 
  Film, 
  CheckCircle2, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  History, 
  X, 
  ArrowRight,
  Zap,
  Flame,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MediaProgressWidgetProps {
  books: BookItem[];
  setBooks: React.Dispatch<React.SetStateAction<BookItem[]>>;
  screenMedia: ScreenMediaItem[];
  setScreenMedia: React.Dispatch<React.SetStateAction<ScreenMediaItem[]>>;
  formations: Formation[];
  setFormations: React.Dispatch<React.SetStateAction<Formation[]>>;
  dailyHabits: DailyHabit[];
  setDailyHabits: React.Dispatch<React.SetStateAction<DailyHabit[]>>;
  mediaProgressLogs: MediaProgressLog[];
  setMediaProgressLogs: React.Dispatch<React.SetStateAction<MediaProgressLog[]>>;
  triggerToast?: (title: string, message: string, type?: "success" | "warning" | "info") => void;
  compact?: boolean;
}

export function MediaProgressWidget({
  books,
  setBooks,
  screenMedia,
  setScreenMedia,
  formations,
  setFormations,
  dailyHabits,
  setDailyHabits,
  mediaProgressLogs,
  setMediaProgressLogs,
  triggerToast,
  compact = false
}: MediaProgressWidgetProps) {
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"Tous" | "Série" | "Livre" | "Formation" | "Film/Anime">("Tous");

  const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  };

  const todayStr = getTodayStr();

  // Active items
  const activeSeries = screenMedia.filter(s => (s.type === "Série" || s.type === "Anime") && s.status === "En cours");
  const activeFilms = screenMedia.filter(s => s.type === "Film" && s.status === "En cours");
  const activeBooks = books.filter(b => b.status === "En cours");
  const activeFormations = formations.filter(f => f.status === "En cours" || (f.progressPercent > 0 && f.progressPercent < 100));

  // Logs today
  const todayLogs = mediaProgressLogs.filter(l => l.date === todayStr);

  // Helper to log advancement and update item + habit
  const logAdvancement = (
    mediaType: "Série" | "Film" | "Anime" | "Livre" | "Formation" | "Autre",
    mediaId: string,
    title: string,
    stepAmount: number,
    unit: string,
    currentVal: number,
    totalVal?: number
  ) => {
    const newVal = currentVal + stepAmount;
    const timeStr = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });

    // 1. Log entry
    const newLog: MediaProgressLog = {
      id: "mpl_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      date: todayStr,
      mediaType,
      mediaId,
      title,
      advancedAmount: stepAmount,
      unit,
      previousValue: currentVal,
      newValue: newVal,
      totalValue: totalVal,
      timestamp: timeStr
    };

    setMediaProgressLogs(prev => [newLog, ...prev]);

    // 2. Update state for item
    if (mediaType === "Livre") {
      setBooks(prev => prev.map(b => {
        if (b.id !== mediaId) return b;
        const autoFinished = newVal >= b.totalPages ? "Terminé" : "En cours";
        return { ...b, currentPage: Math.min(newVal, b.totalPages), status: autoFinished as any };
      }));
    } else if (mediaType === "Formation") {
      setFormations(prev => prev.map(f => {
        if (f.id !== mediaId) return f;
        const autoFinished = newVal >= 100 ? "Terminé" : "En cours";
        return { ...f, progressPercent: Math.min(100, newVal), status: autoFinished as any };
      }));
    } else {
      setScreenMedia(prev => prev.map(m => {
        if (m.id !== mediaId) return m;
        const total = m.totalEpisodes || 1;
        const autoFinished = newVal >= total ? "Terminé" : "En cours";
        return { ...m, currentEpisode: Math.min(newVal, total), status: autoFinished as any };
      }));
    }

    // 3. Auto-complete related daily habit for today
    let matchedHabitName = "";
    setDailyHabits(prev => prev.map(h => {
      const hLower = h.name.toLowerCase();
      let isMatch = false;
      if (mediaType === "Série" || mediaType === "Anime" || mediaType === "Film") {
        if (hLower.includes("série") || hLower.includes("serie") || hLower.includes("épisode") || hLower.includes("episode") || hLower.includes("film") || hLower.includes("tv")) isMatch = true;
      } else if (mediaType === "Livre") {
        if (hLower.includes("lire") || hLower.includes("lecture") || hLower.includes("livre") || hLower.includes("book") || hLower.includes("page")) isMatch = true;
      } else if (mediaType === "Formation") {
        if (hLower.includes("cours") || hLower.includes("formation") || hLower.includes("apprentissage") || hLower.includes("étude") || hLower.includes("etude")) isMatch = true;
      }

      if (isMatch) {
        matchedHabitName = h.name;
        return { ...h, completed: true };
      }
      return h;
    }));

    if (triggerToast) {
      triggerToast(
        "Avancée enregistrée !",
        `+${stepAmount} ${unit} sur "${title}"${matchedHabitName ? ` • Habitude "${matchedHabitName}" cochée !` : ""}`,
        "success"
      );
    }
  };

  return (
    <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-neutral-800 space-y-5">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-3xs">
            <Zap className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white uppercase tracking-tight font-sans">
                Avancées du Jour & Synchronisation
              </h3>
              <span className="text-[10px] font-mono font-black bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
                {todayLogs.length} fait(s) aujourd'hui
              </span>
            </div>
            <p className="text-[11px] text-neutral-400 font-medium">
              Chaque épisode, chapitre ou leçon validé met à jour vos médias et coche vos habitudes automatiquement.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowSyncModal(true)}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-sm shadow-indigo-600/30 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Journal de Progrès</span>
          </button>
          
          <button
            type="button"
            onClick={() => setShowHistoryModal(true)}
            className="p-2 bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 border border-neutral-700/80 rounded-xl transition-all cursor-pointer"
            title="Historique des avancées"
          >
            <History className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TODAY'S ADVANCEMENTS SUMMARY CAROUSEL / CHIPS */}
      {todayLogs.length > 0 && (
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-3.5 space-y-2">
          <span className="text-[10px] font-mono font-extrabold text-indigo-300 uppercase tracking-wider block">
            🔥 Validé aujourd'hui ({todayLogs.length}) :
          </span>
          <div className="flex flex-wrap gap-2">
            {todayLogs.map(log => (
              <div 
                key={log.id} 
                className="flex items-center gap-2 bg-neutral-950 border border-neutral-800 text-xs px-3 py-1.5 rounded-xl font-medium text-neutral-200"
              >
                <span className="text-emerald-400 font-extrabold">+{log.advancedAmount} {log.unit}</span>
                <span className="text-neutral-400">•</span>
                <span className="font-bold text-white truncate max-w-[160px]">{log.title}</span>
                <span className="text-[10px] font-mono text-neutral-500">({log.newValue}{log.totalValue ? `/${log.totalValue}` : ""})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ACTIVE MEDIA QUICK ACTION CARDS GRID */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">
            ⚡ Quick-Action : Cochez vos progrès en 1 Clic
          </span>
          <span className="text-[10px] text-neutral-500 font-bold">
            {activeSeries.length + activeBooks.length + activeFormations.length} média(s) en cours
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Active Series & Animes */}
          {activeSeries.slice(0, 3).map(series => {
            const current = series.currentEpisode || 0;
            const total = series.totalEpisodes || 1;
            const pct = Math.round((current / total) * 100);

            return (
              <div key={series.id} className="bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-purple-300 font-mono">
                      {series.type}
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-white truncate">{series.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                    <span>Ep. {current} / {total}</span>
                    <div className="w-12 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => logAdvancement(series.type as any, series.id, series.title, 1, "épisode(s)", current, total)}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-[11px] px-3 py-2 rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1 cursor-pointer"
                  title="Ajouter 1 épisode"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+1 Ep</span>
                </button>
              </div>
            );
          })}

          {/* Active Books */}
          {activeBooks.slice(0, 3).map(book => {
            const current = book.currentPage || 0;
            const total = book.totalPages || 1;
            const pct = Math.round((current / total) * 100);

            return (
              <div key={book.id} className="bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300 font-mono">
                      Livre
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-white truncate">{book.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                    <span>p. {current} / {total}</span>
                    <div className="w-12 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => logAdvancement("Livre", book.id, book.title, 10, "pages", current, total)}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-extrabold text-[11px] px-2.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                    title="+10 Pages"
                  >
                    <span>+10p</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => logAdvancement("Livre", book.id, book.title, 20, "pages", current, total)}
                    className="bg-amber-700 hover:bg-amber-600 text-white font-extrabold text-[11px] px-2.5 py-2 rounded-xl transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                    title="+20 Pages"
                  >
                    <span>+20p</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Active Formations */}
          {activeFormations.slice(0, 3).map(course => {
            const currentPct = course.progressPercent || 0;

            return (
              <div key={course.id} className="bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 p-3.5 rounded-2xl flex items-center justify-between gap-3 transition-all">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-300 font-mono">
                      Formation
                    </span>
                  </div>
                  <h4 className="text-xs font-black text-white truncate">{course.title}</h4>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400">
                    <span>{currentPct}% complété</span>
                    <div className="w-12 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${currentPct}%` }}></div>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => logAdvancement("Formation", course.id, course.title, 10, "%", currentPct, 100)}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[11px] px-3 py-2 rounded-xl transition-all shadow-xs shrink-0 flex items-center gap-1 cursor-pointer"
                  title="+10% / +1 Leçon"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+10%</span>
                </button>
              </div>
            );
          })}

          {activeSeries.length === 0 && activeBooks.length === 0 && activeFormations.length === 0 && (
            <div className="col-span-full py-6 text-center text-xs text-neutral-500 italic bg-neutral-900/50 rounded-2xl border border-dashed border-neutral-800">
              Aucun média marqué "En cours". Ajoutez des livres, séries ou formations dans les modules dédiés !
            </div>
          )}
        </div>
      </div>

      {/* FULL LOG / SYNC MODAL */}
      <AnimatePresence>
        {showSyncModal && (
          <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 text-white rounded-3xl p-6 max-w-2xl w-full shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-xl border border-indigo-500/30">
                    <Sparkles className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight">
                      Journal & Synchronisation des Progrès Médias
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Sélectionnez l'élément que vous avez avancé aujourd'hui pour mettre à jour vos statistiques et cocher automatiquement vos habitudes quotidiennes.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowSyncModal(false)}
                  className="p-2 text-neutral-400 hover:text-white bg-neutral-800 rounded-xl cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Category Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {(["Tous", "Série", "Livre", "Formation"] as const).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat as any)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat 
                        ? "bg-indigo-600 text-white font-extrabold shadow-sm" 
                        : "bg-neutral-800 text-neutral-400 hover:text-neutral-200"
                    }`}
                  >
                    {cat === "Série" ? "📺 Séries / Animes" : cat === "Livre" ? "📚 Livres" : cat === "Formation" ? "🎓 Formations" : "Tous les médias"}
                  </button>
                ))}
              </div>

              {/* LIST OF ACTIVE ITEMS FOR DETAILED LOGGING */}
              <div className="space-y-3">
                {/* Series / Animes */}
                {(selectedCategory === "Tous" || selectedCategory === "Série") && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-black text-purple-400 uppercase tracking-wider flex items-center gap-2">
                      <Tv className="w-4 h-4" />
                      <span>Séries TV & Animes</span>
                    </h4>
                    {screenMedia.filter(s => s.status === "En cours").map(item => (
                      <div key={item.id} className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h5 className="text-xs font-extrabold text-white">{item.title}</h5>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            Épisode {item.currentEpisode || 0} sur {item.totalEpisodes || "?"} • {item.platform || "TV"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => logAdvancement(item.type as any, item.id, item.title, 1, "épisode(s)", item.currentEpisode || 0, item.totalEpisodes)}
                            className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>+1 Ep</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => logAdvancement(item.type as any, item.id, item.title, 2, "épisode(s)", item.currentEpisode || 0, item.totalEpisodes)}
                            className="bg-purple-800 hover:bg-purple-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>+2 Ep</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Books */}
                {(selectedCategory === "Tous" || selectedCategory === "Livre") && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      <span>Livres & Audiobooks</span>
                    </h4>
                    {books.filter(b => b.status === "En cours").map(book => (
                      <div key={book.id} className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h5 className="text-xs font-extrabold text-white">{book.title}</h5>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            Page {book.currentPage || 0} sur {book.totalPages || "?"} • {book.author}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => logAdvancement("Livre", book.id, book.title, 10, "pages", book.currentPage || 0, book.totalPages)}
                            className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>+10 p</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => logAdvancement("Livre", book.id, book.title, 25, "pages", book.currentPage || 0, book.totalPages)}
                            className="bg-amber-700 hover:bg-amber-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>+25 p</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => logAdvancement("Livre", book.id, book.title, 50, "pages", book.currentPage || 0, book.totalPages)}
                            className="bg-amber-800 hover:bg-amber-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>+50 p</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Formations */}
                {(selectedCategory === "Tous" || selectedCategory === "Formation") && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>Formations & Cours</span>
                    </h4>
                    {formations.filter(f => f.status === "En cours" || (f.progressPercent > 0 && f.progressPercent < 100)).map(course => (
                      <div key={course.id} className="p-3.5 bg-neutral-950 border border-neutral-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h5 className="text-xs font-extrabold text-white">{course.title}</h5>
                          <span className="text-[10px] text-neutral-400 font-mono">
                            Progrès : {course.progressPercent}% • {course.platform}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => logAdvancement("Formation", course.id, course.title, 10, "%", course.progressPercent || 0, 100)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>+10%</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => logAdvancement("Formation", course.id, course.title, 20, "%", course.progressPercent || 0, 100)}
                            className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <span>+20%</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-800 flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowSyncModal(false)}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* HISTORY MODAL */}
      <AnimatePresence>
        {showHistoryModal && (
          <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-neutral-900 border border-neutral-800 text-white rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <History className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-base font-black text-white uppercase tracking-tight">
                    Historique des Progrès Médias
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowHistoryModal(false)}
                  className="p-1.5 text-neutral-400 hover:text-white bg-neutral-800 rounded-xl cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {mediaProgressLogs.length === 0 ? (
                <p className="text-center text-xs text-neutral-500 py-8 italic">
                  Aucun historique enregistré pour le moment.
                </p>
              ) : (
                <div className="space-y-2">
                  {mediaProgressLogs.slice(0, 30).map(log => (
                    <div key={log.id} className="p-3 bg-neutral-950 border border-neutral-800/80 rounded-2xl flex items-center justify-between text-xs">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-indigo-400">+{log.advancedAmount} {log.unit}</span>
                          <span className="font-bold text-white">{log.title}</span>
                        </div>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          {log.date} à {log.timestamp} • Nouveau total : {log.newValue}
                        </span>
                      </div>
                      <span className="text-[10px] bg-neutral-800 border border-neutral-700/60 text-neutral-300 font-mono px-2 py-0.5 rounded-full font-bold">
                        {log.mediaType}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
