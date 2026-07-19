import React, { useState, useMemo } from "react";
import { BookItem, ScreenMediaItem } from "../types";
import { 
  BookOpen, 
  Film, 
  Tv, 
  Gamepad, 
  Plus, 
  Trash2, 
  Star, 
  Play, 
  CheckCircle, 
  Bookmark, 
  Search, 
  X, 
  Check, 
  TrendingUp, 
  Clapperboard, 
  BookMarked, 
  Filter,
  Layers,
  Sparkles,
  BookOpenCheck
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MediaHubSectionProps {
  books: BookItem[];
  setBooks: React.Dispatch<React.SetStateAction<BookItem[]>>;
  screenMedia: ScreenMediaItem[];
  setScreenMedia: React.Dispatch<React.SetStateAction<ScreenMediaItem[]>>;
  initialFormatFilter?: "Tous" | "Livre" | "Série" | "Film" | "Anime";
}

// Unified representation for rendering lists elegantly
interface UnifiedMedia {
  id: string; // original id
  title: string;
  creator: string; // author or director/platform
  type: "Livre" | "Série" | "Film" | "Anime";
  status: "À lire/voir" | "En cours" | "Terminé";
  progressPercent: number;
  currentProgressText: string;
  totalProgressText: string;
  currentValue: number;
  totalValue: number;
  genreOrPlatform: string;
  rating: number;
  notes: string;
  season?: number;
}

export default function MediaHubSection({
  books,
  setBooks,
  screenMedia,
  setScreenMedia,
  initialFormatFilter = "Tous"
}: MediaHubSectionProps) {
  // Format filters
  const [formatFilter, setFormatFilter] = useState<"Tous" | "Livre" | "Série" | "Film" | "Anime">(initialFormatFilter);
  const [statusFilter, setStatusFilter] = useState<"Tous" | "En cours" | "À lire/voir" | "Terminé">("Tous");
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenreOrPlatform, setSelectedGenreOrPlatform] = useState("Tous");

  // Add form states
  const [showAddForm, setShowAddForm] = useState(false);
  const [mediaType, setMediaType] = useState<"Livre" | "Série" | "Film" | "Anime">("Livre");
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState(""); // author for book, platform/director for others
  const [genre, setGenre] = useState(""); // genre or platform
  const [totalPages, setTotalPages] = useState<number>(300);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [season, setSeason] = useState<number>(1);
  const [totalEpisodes, setTotalEpisodes] = useState<number>(12);
  const [currentEpisode, setCurrentEpisode] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [rating, setRating] = useState<number>(0);
  const [status, setStatus] = useState<"À lire/voir" | "En cours" | "Terminé">("En cours");

  // Inline notes editor state
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  // Map individual states to a unified interface
  const unifiedList = useMemo(() => {
    const list: UnifiedMedia[] = [];

    // Map Books
    books.forEach(b => {
      const pct = b.totalPages > 0 ? Math.round((b.currentPage / b.totalPages) * 100) : 0;
      list.push({
        id: b.id,
        title: b.title,
        creator: b.author,
        type: "Livre",
        status: b.status === "À lire" ? "À lire/voir" : b.status === "En cours" ? "En cours" : "Terminé",
        progressPercent: pct,
        currentProgressText: `${b.currentPage} p.`,
        totalProgressText: `${b.totalPages} p.`,
        currentValue: b.currentPage,
        totalValue: b.totalPages,
        genreOrPlatform: b.genre || "Développement Personnel",
        rating: b.rating,
        notes: b.notes || ""
      });
    });

    // Map Screen Media
    screenMedia.forEach(m => {
      let pct = 0;
      let currentText = "";
      let totalText = "";
      let curVal = 0;
      let totVal = 0;

      if (m.type === "Film") {
        pct = m.status === "Terminé" ? 100 : m.status === "En cours" ? 50 : 0;
        currentText = m.status;
        totalText = "1 h 30+";
      } else {
        totVal = m.totalEpisodes || 12;
        curVal = m.currentEpisode || 0;
        pct = totVal > 0 ? Math.round((curVal / totVal) * 100) : 0;
        currentText = `Ep ${curVal}`;
        totalText = `Ep ${totVal}`;
      }

      list.push({
        id: m.id,
        title: m.title,
        creator: m.platform || "Netflix",
        type: m.type as any,
        status: m.status === "À regarder" ? "À lire/voir" : m.status === "En cours" ? "En cours" : "Terminé",
        progressPercent: pct,
        currentProgressText: currentText,
        totalProgressText: totalText,
        currentValue: curVal,
        totalValue: totVal,
        genreOrPlatform: m.platform || "Netflix",
        rating: m.rating,
        notes: m.notes || "",
        season: m.season
      });
    });

    return list;
  }, [books, screenMedia]);

  // Extract unique genres/platforms for filter dropdown
  const uniqueGenresAndPlatforms = useMemo(() => {
    const set = new Set<string>();
    unifiedList.forEach(item => {
      if (item.genreOrPlatform) {
        set.add(item.genreOrPlatform);
      }
    });
    return Array.from(set).sort();
  }, [unifiedList]);

  // Filtered List
  const filteredList = useMemo(() => {
    return unifiedList.filter(item => {
      const matchesFormat = formatFilter === "Tous" || item.type === formatFilter;
      const matchesStatus = statusFilter === "Tous" || item.status === statusFilter;
      
      const text = `${item.title} ${item.creator} ${item.genreOrPlatform} ${item.notes}`.toLowerCase();
      const matchesSearch = text.includes(searchQuery.toLowerCase());

      const matchesGenreOrPlatform = selectedGenreOrPlatform === "Tous" || item.genreOrPlatform === selectedGenreOrPlatform;

      return matchesFormat && matchesStatus && matchesSearch && matchesGenreOrPlatform;
    });
  }, [unifiedList, formatFilter, statusFilter, searchQuery, selectedGenreOrPlatform]);

  // Stats Counters
  const stats = useMemo(() => {
    const total = unifiedList.length;
    const enCours = unifiedList.filter(item => item.status === "En cours").length;
    const wishlist = unifiedList.filter(item => item.status === "À lire/voir").length;
    const termines = unifiedList.filter(item => item.status === "Terminé").length;
    
    const booksCount = books.length;
    const seriesCount = screenMedia.filter(m => m.type === "Série").length;
    const filmsCount = screenMedia.filter(m => m.type === "Film").length;
    const animeCount = screenMedia.filter(m => m.type === "Anime").length;

    return {
      total,
      enCours,
      wishlist,
      termines,
      booksCount,
      seriesCount,
      filmsCount,
      animeCount,
      completionRate: total > 0 ? Math.round((termines / total) * 100) : 0
    };
  }, [unifiedList, books, screenMedia]);

  // Handle updates (Increments, status changes, notes saving)
  const handleUpdateProgress = (item: UnifiedMedia, newValue: number) => {
    if (item.type === "Livre") {
      setBooks(prev => prev.map(b => {
        if (b.id !== item.id) return b;
        const val = Math.max(0, Math.min(newValue, b.totalPages));
        const autoFinished = val === b.totalPages ? "Terminé" : b.status;
        return { ...b, currentPage: val, status: autoFinished as any };
      }));
    } else {
      setScreenMedia(prev => prev.map(m => {
        if (m.id !== item.id) return m;
        if (m.type === "Film" || !m.totalEpisodes) return m;
        const val = Math.max(0, Math.min(newValue, m.totalEpisodes));
        const autoFinished = val === m.totalEpisodes ? "Terminé" : m.status;
        return { ...m, currentEpisode: val, status: autoFinished as any };
      }));
    }
  };

  const handleUpdateStatus = (item: UnifiedMedia, newStatus: "À lire/voir" | "En cours" | "Terminé") => {
    if (item.type === "Livre") {
      setBooks(prev => prev.map(b => {
        if (b.id !== item.id) return b;
        let p = b.currentPage;
        if (newStatus === "Terminé") p = b.totalPages;
        if (newStatus === "À lire/voir" as any) p = 0;
        return {
          ...b,
          status: newStatus === "À lire/voir" ? "À lire" : newStatus as any,
          currentPage: p
        };
      }));
    } else {
      setScreenMedia(prev => prev.map(m => {
        if (m.id !== item.id) return m;
        let p = m.currentEpisode || 0;
        if (newStatus === "Terminé" && m.totalEpisodes) p = m.totalEpisodes;
        if (newStatus === "À lire/voir" as any) p = 0;
        return {
          ...m,
          status: newStatus === "À lire/voir" ? "À regarder" : newStatus as any,
          currentEpisode: m.type === "Film" ? undefined : p
        };
      }));
    }
  };

  const handleUpdateRating = (item: UnifiedMedia, stars: number) => {
    if (item.type === "Livre") {
      setBooks(prev => prev.map(b => b.id === item.id ? { ...b, rating: stars } : b));
    } else {
      setScreenMedia(prev => prev.map(m => m.id === item.id ? { ...m, rating: stars } : m));
    }
  };

  const handleDeleteItem = (item: UnifiedMedia) => {
    if (item.type === "Livre") {
      setBooks(prev => prev.filter(b => b.id !== item.id));
    } else {
      setScreenMedia(prev => prev.filter(m => m.id !== item.id));
    }
  };

  const handleSaveNotes = (id: string, isBook: boolean) => {
    if (isBook) {
      setBooks(prev => prev.map(b => b.id === id ? { ...b, notes: tempNotes } : b));
    } else {
      setScreenMedia(prev => prev.map(m => m.id === id ? { ...m, notes: tempNotes } : m));
    }
    setEditingNotesId(null);
  };

  // Add New Media Action
  const handleAddNewMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (mediaType === "Livre") {
      const newBook: BookItem = {
        id: "b_" + Date.now(),
        title: title.trim(),
        author: creator.trim() || "Auteur inconnu",
        genre: genre.trim() || "Développement Personnel",
        currentPage: status === "Terminé" ? totalPages : Number(currentPage) || 0,
        totalPages: Number(totalPages) || 300,
        rating: status === "Terminé" ? rating : 0,
        notes: notes.trim(),
        status: status === "À lire/voir" ? "À lire" : status === "En cours" ? "En cours" : "Terminé"
      };
      setBooks(prev => [newBook, ...prev]);
    } else {
      const newMedia: ScreenMediaItem = {
        id: "sm_" + Date.now(),
        title: title.trim(),
        type: mediaType as any,
        platform: creator.trim() || "Netflix",
        season: mediaType === "Film" ? undefined : (Number(season) || 1),
        currentEpisode: mediaType === "Film" ? undefined : (status === "Terminé" ? totalEpisodes : Number(currentEpisode) || 0),
        totalEpisodes: mediaType === "Film" ? undefined : (Number(totalEpisodes) || 12),
        rating: status === "Terminé" ? rating : 0,
        notes: notes.trim(),
        status: status === "À lire/voir" ? "À regarder" : status === "En cours" ? "En cours" : "Terminé"
      };
      setScreenMedia(prev => [newMedia, ...prev]);
    }

    // Reset fields
    setTitle("");
    setCreator("");
    setGenre("");
    setNotes("");
    setRating(0);
    setStatus("En cours");
    setTotalPages(300);
    setCurrentPage(0);
    setSeason(1);
    setTotalEpisodes(12);
    setCurrentEpisode(0);
    setShowAddForm(false);
  };

  // Helper icons
  const getFormatIcon = (type: "Livre" | "Série" | "Film" | "Anime", className = "w-4 h-4") => {
    switch (type) {
      case "Livre": return <BookOpen className={className} />;
      case "Série": return <Tv className={className} />;
      case "Film": return <Film className={className} />;
      case "Anime": return <Gamepad className={className} />;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 1. HERO - ACTIVE MEDIAS SLIDER / LIST */}
      <div className="bg-neutral-900 text-white rounded-3xl p-6 shadow-md border border-neutral-800 relative overflow-hidden">
        <div className="absolute top-[-30%] right-[-10%] w-[45%] h-[160%] rounded-full bg-neutral-800 blur-3xl pointer-events-none opacity-50" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black tracking-widest text-neutral-300 uppercase font-mono">Suivis Actifs En Cours</span>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              {stats.enCours} média{stats.enCours > 1 ? "s" : ""} en cours d'apprentissage ou visionnage
            </span>
          </div>

          {stats.enCours === 0 ? (
            <div className="py-8 text-center text-neutral-400 max-w-md mx-auto">
              <BookOpenCheck className="w-10 h-10 mx-auto mb-2 opacity-50 text-neutral-300" />
              <p className="text-xs font-bold text-white">Aucun livre ou série en cours de lecture/visionnage actif.</p>
              <p className="text-[10px] text-neutral-500 mt-1.5">
                Commencez à suivre vos lectures et vos épisodes en ajoutant ou en changeant le statut d'un élément ci-dessous !
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {unifiedList.filter(item => item.status === "En cours").slice(0, 4).map(item => {
                return (
                  <div key={item.id} className="bg-neutral-800/40 border border-neutral-700/50 rounded-2xl p-4.5 space-y-3.5 transition-all hover:bg-neutral-800/75">
                    <div className="flex justify-between items-start gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[9px] bg-neutral-700 text-neutral-100 px-2.5 py-0.5 rounded-full font-bold font-mono uppercase tracking-wider flex items-center gap-1 shrink-0">
                            {getFormatIcon(item.type, "w-2.5 h-2.5")}
                            <span>{item.type}</span>
                          </span>
                          <span className="text-[9px] bg-neutral-800/80 text-neutral-400 px-2 py-0.5 rounded-full font-bold font-mono truncate max-w-[100px]">
                            {item.genreOrPlatform}
                          </span>
                        </div>
                        <h4 className="text-xs md:text-sm font-black text-white mt-1 leading-snug truncate" title={item.title}>
                          {item.title}
                        </h4>
                        <p className="text-[11px] text-neutral-400 font-medium truncate">
                          {item.type === "Livre" ? "Par" : "Sur"} {item.creator}
                        </p>
                      </div>

                      {item.type !== "Film" && (
                        <div className="flex flex-col items-end shrink-0">
                          <span className="text-base font-black font-mono text-red-400">{item.progressPercent}%</span>
                          <span className="text-[10px] text-neutral-400 font-bold mt-0.5 font-mono">
                            {item.season ? `S${item.season} • ` : ""}{item.currentProgressText} / {item.totalProgressText}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Interactive Progress Indicators */}
                    {item.type !== "Film" && (
                      <div className="space-y-2">
                        <div className="w-full bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-red-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${item.progressPercent}%` }} />
                        </div>

                        <div className="flex items-center justify-between gap-3 bg-neutral-800/80 p-2 rounded-xl border border-neutral-700/50">
                          <span className="text-[10px] text-neutral-400 font-black font-sans uppercase">Ajuster la position :</span>
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleUpdateProgress(item, item.currentValue - (item.type === "Livre" ? 10 : 1))}
                              className="w-6.5 h-6.5 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                              title={item.type === "Livre" ? "-10 Pages" : "-1 Épisode"}
                            >
                              -{item.type === "Livre" ? "10" : "1"}
                            </button>
                            <button 
                              onClick={() => handleUpdateProgress(item, item.currentValue - 1)}
                              className="w-6.5 h-6.5 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg flex items-center justify-center font-bold text-[10px] transition-colors cursor-pointer"
                              title="-1"
                            >
                              -1
                            </button>
                            <input 
                              type="number"
                              value={item.currentValue}
                              onChange={(e) => handleUpdateProgress(item, Number(e.target.value))}
                              className="w-11 h-6.5 bg-neutral-900 border border-neutral-700 text-white text-center font-mono text-xs rounded-lg focus:outline-none focus:border-red-500"
                            />
                            <button 
                              onClick={() => handleUpdateProgress(item, item.currentValue + 1)}
                              className="w-6.5 h-6.5 bg-neutral-700 hover:bg-red-500 hover:text-white text-white rounded-lg flex items-center justify-center font-bold text-[10px] transition-colors cursor-pointer"
                              title="+1"
                            >
                              +1
                            </button>
                            <button 
                              onClick={() => handleUpdateProgress(item, item.currentValue + (item.type === "Livre" ? 10 : 1))}
                              className="w-6.5 h-6.5 bg-neutral-700 hover:bg-red-500 hover:text-white text-white rounded-lg flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
                              title={item.type === "Livre" ? "+10 Pages" : "+1 Épisode"}
                            >
                              +{item.type === "Livre" ? "10" : "1"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Note Editor Area */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span className="font-bold">Avis, Idées & Concepts clés :</span>
                        {editingNotesId === item.id ? (
                          <div className="flex items-center gap-1.5">
                            <button 
                              onClick={() => handleSaveNotes(item.id, item.type === "Livre")} 
                              className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-0.5 font-sans"
                            >
                              <Check className="w-3 h-3" /> Enregistrer
                            </button>
                            <button onClick={() => setEditingNotesId(null)} className="text-neutral-500 hover:text-neutral-400">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => { setEditingNotesId(item.id); setTempNotes(item.notes); }} 
                            className="text-neutral-400 hover:text-white flex items-center gap-1 font-sans"
                          >
                            <Play className="w-3 h-3 rotate-90" /> Commenter
                          </button>
                        )}
                      </div>
                      
                      {editingNotesId === item.id ? (
                        <textarea 
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                          rows={2}
                          placeholder="Notez des concepts, des citations clés ou votre avis..."
                        />
                      ) : (
                        <p className="text-xs text-neutral-300 italic bg-neutral-800/60 p-2 rounded-lg leading-relaxed min-h-[34px] line-clamp-2">
                          {item.notes || "Pas de note. Cliquez sur Commenter pour ajouter des leçons."}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 2. STATS BAR CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Bibliothèque</span>
            <span className="text-base font-extrabold font-mono text-neutral-950 block">
              {stats.booksCount} livre{stats.booksCount > 1 ? "s" : ""}
            </span>
          </div>
          <div className="p-2.5 bg-neutral-50 rounded-xl text-neutral-950 border border-neutral-100 shrink-0"><BookOpen className="w-4 h-4" /></div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Programmes Écrans</span>
            <span className="text-base font-extrabold font-mono text-neutral-950 block">
              {stats.seriesCount + stats.filmsCount + stats.animeCount} contenus
            </span>
          </div>
          <div className="p-2.5 bg-red-50 text-red-600 rounded-xl border border-red-100 shrink-0"><Film className="w-4 h-4" /></div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">En attente (Wishlist)</span>
            <span className="text-base font-extrabold font-mono text-neutral-950 block">
              {stats.wishlist} élément{stats.wishlist > 1 ? "s" : ""}
            </span>
          </div>
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 shrink-0"><Bookmark className="w-4 h-4" /></div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Taux d'achèvement</span>
            <span className="text-base font-extrabold font-mono text-neutral-950 block">
              {stats.completionRate}% terminés
            </span>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shrink-0"><CheckCircle className="w-4 h-4" /></div>
        </div>
      </div>

      {/* 3. CONTROLS BAR: FILTERS + SEARCH + ADD BUTTON */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-5 shadow-xs space-y-4">
        
        {/* Dynamic Filters Area */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Format Filter */}
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
              {(["Tous", "Livre", "Série", "Film", "Anime"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFormatFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                    formatFilter === f
                      ? "bg-white text-neutral-950 shadow-3xs"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {f === "Tous" ? "Tous Formats" : f}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5">
              {(["Tous", "En cours", "À lire/voir", "Terminé"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    statusFilter === s
                      ? "bg-neutral-900 text-white border-neutral-900 shadow-3xs"
                      : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {s === "Tous" ? "Tous Statuts" : s === "À lire/voir" ? "Wishlist" : s}
                </button>
              ))}
            </div>

            {/* Genre / Platform Select Dropdown */}
            <div className="flex items-center gap-1.5 border border-neutral-200 rounded-xl px-2.5 py-1.5 bg-white text-xs font-semibold">
              <Filter className="w-3.5 h-3.5 text-neutral-400" />
              <select 
                value={selectedGenreOrPlatform} 
                onChange={(e) => setSelectedGenreOrPlatform(e.target.value)}
                className="bg-transparent text-neutral-700 font-bold focus:outline-none focus:ring-0 cursor-pointer"
              >
                <option value="Tous">Tous Genres/Plateformes</option>
                {uniqueGenresAndPlatforms.map(gp => (
                  <option key={gp} value={gp}>{gp}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full xl:w-auto ml-auto">
            {/* Search Input */}
            <div className="relative w-full xl:w-60">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher titre, auteur, genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl pl-9 pr-3.5 py-2 text-xs font-bold text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Add New Button */}
            <button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-1.5 bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-3xs cursor-pointer shrink-0"
            >
              {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              <span>{showAddForm ? "Annuler" : "Ajouter un Média"}</span>
            </button>
          </div>
        </div>

        {/* 4. COLLAPSIBLE ADD MEDIA FORM */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form 
              onSubmit={handleAddNewMedia}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-neutral-50 rounded-2xl border border-neutral-200/80 p-5 space-y-4 font-sans"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <h3 className="text-xs font-black text-neutral-950 uppercase tracking-widest font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-neutral-800" />
                  <span>Enregistrer un Nouveau Média</span>
                </h3>
                
                {/* Selector for media type */}
                <div className="flex items-center gap-1 bg-neutral-200/80 p-0.5 rounded-lg">
                  {(["Livre", "Série", "Film", "Anime"] as const).map(type => (
                    <button
                      type="button"
                      key={type}
                      onClick={() => {
                        setMediaType(type);
                        setCreator(type === "Livre" ? "" : "Netflix");
                        setGenre(type === "Livre" ? "Développement Personnel" : "");
                      }}
                      className={`px-2.5 py-1 rounded-md text-[10px] font-black transition-all ${
                        mediaType === type
                          ? "bg-white text-neutral-950 shadow-3xs"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-neutral-400 uppercase">Titre du Média *</label>
                  <input 
                    type="text" 
                    required
                    placeholder={mediaType === "Livre" ? "Ex: L'Autoroute du Millionnaire" : "Ex: Interstellar"}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-neutral-400 uppercase">
                    {mediaType === "Livre" ? "Auteur du Livre *" : "Diffuseur / Plateforme"}
                  </label>
                  <input 
                    type="text" 
                    required={mediaType === "Livre"}
                    placeholder={mediaType === "Livre" ? "Ex: MJ DeMarco" : "Ex: Netflix, Prime Video, Cinéma"}
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-neutral-400 uppercase">
                    {mediaType === "Livre" ? "Genre / Catégorie" : "Genre Cinématographique / Tags"}
                  </label>
                  <input 
                    type="text" 
                    placeholder={mediaType === "Livre" ? "Ex: Finance, Richesse, Business" : "Ex: Science-fiction, Drame"}
                    value={genre}
                    onChange={(e) => setGenre(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 font-medium"
                  />
                </div>
              </div>

              {/* Dynamic size fields */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-neutral-400 uppercase">Statut d'Avancement</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-2 py-2 text-xs text-neutral-900 font-bold focus:outline-none focus:border-neutral-900 cursor-pointer"
                  >
                    <option value="À lire/voir">En attente (Wishlist)</option>
                    <option value="En cours">En cours de lecture/visionnage</option>
                    <option value="Terminé">Terminé / Complété</option>
                  </select>
                </div>

                {mediaType === "Livre" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-neutral-400 uppercase">Pages Totales</label>
                      <input 
                        type="number" 
                        min={1}
                        value={totalPages}
                        onChange={(e) => setTotalPages(Number(e.target.value))}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-neutral-400 uppercase">Page Actuelle</label>
                      <input 
                        type="number" 
                        min={0}
                        max={totalPages}
                        disabled={status === "À lire/voir" || status === "Terminé"}
                        value={status === "À lire/voir" ? 0 : status === "Terminé" ? totalPages : currentPage}
                        onChange={(e) => setCurrentPage(Number(e.target.value))}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-900 disabled:bg-neutral-100 disabled:text-neutral-400 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </>
                )}

                {mediaType !== "Livre" && mediaType !== "Film" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-neutral-400 uppercase">Saison</label>
                      <input 
                        type="number" 
                        min={1}
                        value={season}
                        onChange={(e) => setSeason(Number(e.target.value))}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-neutral-400 uppercase">Épisodes Totaux</label>
                      <input 
                        type="number" 
                        min={1}
                        value={totalEpisodes}
                        onChange={(e) => setTotalEpisodes(Number(e.target.value))}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-neutral-400 uppercase">Épisode Actuel</label>
                      <input 
                        type="number" 
                        min={0}
                        max={totalEpisodes}
                        disabled={status === "À lire/voir" || status === "Terminé"}
                        value={status === "À lire/voir" ? 0 : status === "Terminé" ? totalEpisodes : currentEpisode}
                        onChange={(e) => setCurrentEpisode(Number(e.target.value))}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs font-mono text-neutral-900 disabled:bg-neutral-100 disabled:text-neutral-400 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </>
                )}

                {status === "Terminé" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-neutral-400 uppercase">Note (Stars)</label>
                    <div className="flex items-center gap-1 h-9">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="text-neutral-300 hover:text-amber-400 transition-colors cursor-pointer"
                        >
                          <Star className={`w-5 h-5 ${rating >= star ? "text-amber-400 fill-amber-400" : ""}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Notes / Avis */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-neutral-400 uppercase">Notes, Avis Personnels ou Synopsis</label>
                <textarea 
                  placeholder="Écrivez vos leçons clés, résumés, répliques marquantes ou pourquoi vous voulez consommer ce média..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl p-3.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 font-medium"
                  rows={2}
                />
              </div>

              {/* Footer actions */}
              <div className="flex justify-end gap-2.5 pt-1">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-xl text-xs font-bold text-neutral-800 transition-all cursor-pointer"
                >
                  Fermer
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer shadow-3xs"
                >
                  Ajouter à ma Médiathèque
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* 5. MEDIA GRID LIST (CARDS) */}
        {filteredList.length === 0 ? (
          <div className="text-center py-20 text-neutral-400 italic bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200 font-medium text-xs">
            Aucun élément multimédia ne correspond à vos critères de recherche.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredList.map((item) => {
              return (
                <div 
                  key={item.id}
                  className="bg-neutral-50/50 border border-neutral-200/80 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-neutral-400 hover:bg-white transition-all shadow-3xs group relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="text-[9px] bg-neutral-200 text-neutral-800 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono flex items-center gap-1 shrink-0 shadow-3xs">
                          {getFormatIcon(item.type, "w-2.5 h-2.5")}
                          <span>{item.type}</span>
                        </span>
                        <span className="text-[9px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full font-bold font-mono truncate max-w-[110px]" title={item.genreOrPlatform}>
                          {item.genreOrPlatform}
                        </span>
                      </div>
                      
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        item.status === "Terminé"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : item.status === "En cours"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                      }`}>
                        {item.status === "À lire/voir" ? (item.type === "Livre" ? "À Lire" : "À Voir") : item.status}
                      </span>
                    </div>

                    <div className="space-y-1 min-w-0">
                      <h4 className="text-xs font-black text-neutral-900 leading-tight flex items-start gap-1.5">
                        {item.type === "Livre" ? (
                          <BookMarked className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                        ) : (
                          <Clapperboard className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                        )}
                        <span className="line-clamp-2" title={item.title}>{item.title}</span>
                      </h4>
                      <p className="text-[11px] text-neutral-500 font-semibold pl-5.5">
                        {item.type === "Livre" ? "Auteur" : "Plateforme"} : {item.creator}
                      </p>
                      {item.type !== "Film" && item.season && (
                        <span className="text-[10px] text-neutral-400 font-bold block pl-5.5">
                          Saison {item.season}
                        </span>
                      )}
                    </div>

                    {/* Progress indicator */}
                    {item.type !== "Film" && item.status !== "À lire/voir" && (
                      <div className="space-y-1.5 pl-5.5 pt-0.5">
                        <div className="flex items-center justify-between text-[10px] font-bold text-neutral-500 font-sans">
                          <span>Progression :</span>
                          <span className="font-mono text-neutral-800">
                            {item.progressPercent}% ({item.currentProgressText} / {item.totalProgressText})
                          </span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-1 overflow-hidden">
                          <div className="bg-neutral-900 h-1 rounded-full transition-all" style={{ width: `${item.progressPercent}%` }} />
                        </div>
                      </div>
                    )}

                    {/* Film completed or standard stars */}
                    {item.status === "Terminé" && (
                      <div className="flex items-center gap-0.5 pl-5.5 pt-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                          <button
                            type="button"
                            key={s}
                            onClick={() => handleUpdateRating(item, s)}
                            className="text-neutral-200 hover:text-amber-400 transition-colors"
                          >
                            <Star className={`w-3.5 h-3.5 ${item.rating >= s ? "text-amber-400 fill-amber-400" : "text-neutral-200"}`} />
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Comments block */}
                    {item.notes && (
                      <div className="pl-5.5 pt-1">
                        <p className="text-[11px] text-neutral-500 bg-white border border-neutral-100 rounded-lg p-2.5 italic leading-relaxed font-medium">
                          {item.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions buttons */}
                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2 pl-5.5">
                    <div className="flex items-center gap-1.5">
                      {item.status !== "En cours" && (
                        <button 
                          onClick={() => handleUpdateStatus(item, "En cours")}
                          className="text-[10px] font-bold text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                        >
                          {item.type === "Livre" ? "Lire" : "Regarder"}
                        </button>
                      )}
                      {item.status !== "Terminé" && (
                        <button 
                          onClick={() => handleUpdateStatus(item, "Terminé")}
                          className="text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                        >
                          Terminé
                        </button>
                      )}
                      {item.status !== "À lire/voir" && (
                        <button 
                          onClick={() => handleUpdateStatus(item, "À lire/voir")}
                          className="text-[10px] font-bold text-neutral-500 hover:bg-neutral-100 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
                        >
                          Wishlist
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => handleDeleteItem(item)}
                      className="text-neutral-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer ml-auto opacity-0 group-hover:opacity-100"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
