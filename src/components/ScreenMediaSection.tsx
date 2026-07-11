import React, { useState } from "react";
import { ScreenMediaItem } from "../types";
import { 
  Film, 
  Tv, 
  Plus, 
  Trash2, 
  Star, 
  Play, 
  CheckCircle, 
  Monitor, 
  X, 
  Check,
  ChevronRight,
  TrendingUp,
  Clapperboard
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ScreenMediaSectionProps {
  screenMedia: ScreenMediaItem[];
  setScreenMedia: React.Dispatch<React.SetStateAction<ScreenMediaItem[]>>;
}

export default function ScreenMediaSection({ screenMedia, setScreenMedia }: ScreenMediaSectionProps) {
  const [filter, setFilter] = useState<"Tous" | "Film" | "Série" | "Anime">("Tous");
  const [statusFilter, setStatusFilter] = useState<"Tous" | "En cours" | "À regarder" | "Terminé">("Tous");
  
  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"Film" | "Série" | "Anime">("Série");
  const [platform, setPlatform] = useState("");
  const [currentEpisode, setCurrentEpisode] = useState<number>(0);
  const [totalEpisodes, setTotalEpisodes] = useState<number>(12);
  const [rating, setRating] = useState<number>(0);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState<"À regarder" | "En cours" | "Terminé">("En cours");

  // Notes editing state
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState("");

  const handleAddMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newMedia: ScreenMediaItem = {
      id: "sm_" + Date.now(),
      title: title.trim(),
      type,
      platform: platform.trim() || "Netflix",
      currentEpisode: type === "Film" ? undefined : (status === "Terminé" ? totalEpisodes : Number(currentEpisode) || 0),
      totalEpisodes: type === "Film" ? undefined : (Number(totalEpisodes) || 1),
      rating: status === "Terminé" ? rating : 0,
      notes: notes.trim(),
      status
    };

    setScreenMedia(prev => [newMedia, ...prev]);
    
    // Reset Form
    setTitle("");
    setPlatform("");
    setCurrentEpisode(0);
    setTotalEpisodes(12);
    setRating(0);
    setNotes("");
    setStatus("En cours");
    setShowAddForm(false);
  };

  const deleteMedia = (id: string) => {
    setScreenMedia(prev => prev.filter(m => m.id !== id));
  };

  const updateEpisode = (id: string, newEp: number) => {
    setScreenMedia(prev => prev.map(m => {
      if (m.id !== id) return m;
      if (m.type === "Film" || !m.totalEpisodes) return m;
      const validatedEp = Math.max(0, Math.min(newEp, m.totalEpisodes));
      const newStatus = validatedEp === m.totalEpisodes ? "Terminé" : m.status;
      return {
        ...m,
        currentEpisode: validatedEp,
        status: newStatus as any
      };
    }));
  };

  const changeStatus = (id: string, newStatus: "À regarder" | "En cours" | "Terminé") => {
    setScreenMedia(prev => prev.map(m => {
      if (m.id !== id) return m;
      let curEp = m.currentEpisode;
      if (newStatus === "Terminé" && m.totalEpisodes) curEp = m.totalEpisodes;
      if (newStatus === "À regarder") curEp = 0;
      return {
        ...m,
        status: newStatus,
        currentEpisode: curEp
      };
    }));
  };

  const saveNotes = (id: string) => {
    setScreenMedia(prev => prev.map(m => m.id === id ? { ...m, notes: tempNotes } : m));
    setEditingNotesId(null);
  };

  const currentlyWatching = screenMedia.filter(m => m.status === "En cours");
  const watchlist = screenMedia.filter(m => m.status === "À regarder");
  const finished = screenMedia.filter(m => m.status === "Terminé");

  const displayedMedia = screenMedia.filter(m => {
    const matchesType = filter === "Tous" || m.type === filter;
    const matchesStatus = statusFilter === "Tous" || m.status === statusFilter;
    return matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* 1. CURRENTLY WATCHING - HERO CARDS CONTAINER */}
      <div className="bg-neutral-900 text-white rounded-3xl p-6 shadow-md border border-neutral-800 relative overflow-hidden">
        <div className="absolute top-[-30%] left-[-10%] w-[40%] h-[150%] rounded-full bg-neutral-800 blur-3xl pointer-events-none opacity-55" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black tracking-widest text-neutral-400 uppercase font-mono font-sans">En cours de Visionnage</span>
            </div>
            <span className="text-xs text-neutral-400 font-mono">
              {currentlyWatching.length} œuvre{currentlyWatching.length > 1 ? "s" : ""} active{currentlyWatching.length > 1 ? "s" : ""}
            </span>
          </div>

          {currentlyWatching.length === 0 ? (
            <div className="py-6 text-center text-neutral-400">
              <Film className="w-8 h-8 mx-auto mb-2 opacity-40 text-neutral-300" />
              <p className="text-xs font-semibold">Aucun film ou série en cours de visionnage actif.</p>
              <p className="text-[10px] text-neutral-500 mt-1">Sélectionnez une œuvre dans votre liste ci-dessous pour lancer sa lecture.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentlyWatching.map(media => {
                const percent = media.type === "Film" 
                  ? 50 // placeholder progress indicator
                  : (media.currentEpisode && media.totalEpisodes 
                      ? Math.round((media.currentEpisode / media.totalEpisodes) * 100) 
                      : 0);

                return (
                  <div key={media.id} className="bg-neutral-800/50 border border-neutral-700/60 rounded-2xl p-5 space-y-4 transition-all hover:bg-neutral-800/80">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] bg-red-950 text-red-400 px-2.5 py-0.5 rounded-full font-bold font-mono">
                            {media.type}
                          </span>
                          <span className="text-[9px] bg-neutral-700 text-neutral-300 px-2 py-0.5 rounded-full font-bold font-mono">
                            {media.platform}
                          </span>
                        </div>
                        <h4 className="text-sm font-extrabold text-white mt-1 leading-snug">{media.title}</h4>
                      </div>
                      
                      {media.type !== "Film" && (
                        <div className="flex flex-col items-end shrink-0">
                          <span className="text-lg font-black font-mono text-red-400">{percent}%</span>
                          <span className="text-[10px] text-neutral-400 font-semibold mt-0.5 font-mono">Ep {media.currentEpisode} / {media.totalEpisodes}</span>
                        </div>
                      )}
                    </div>

                    {/* Progress indicator bar */}
                    {media.type !== "Film" && (
                      <div className="w-full bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-red-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${percent}%` }} />
                      </div>
                    )}

                    {/* Interactive Episode tracker */}
                    {media.type !== "Film" && (
                      <div className="flex items-center justify-between gap-3 bg-neutral-800 p-2.5 rounded-xl border border-neutral-700/60">
                        <span className="text-[10px] text-neutral-400 font-bold font-sans uppercase">Ajuster l'épisode :</span>
                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => updateEpisode(media.id, (media.currentEpisode || 0) - 1)}
                            className="w-7 h-7 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                          >
                            -1
                          </button>
                          <input 
                            type="number"
                            value={media.currentEpisode || 0}
                            onChange={(e) => updateEpisode(media.id, Number(e.target.value))}
                            className="w-12 h-7 bg-neutral-900 border border-neutral-700 text-white text-center font-mono text-xs rounded-lg focus:outline-none focus:border-red-500"
                          />
                          <button 
                            onClick={() => updateEpisode(media.id, (media.currentEpisode || 0) + 1)}
                            className="w-7 h-7 bg-neutral-700 hover:bg-red-500 hover:text-white text-white rounded-lg flex items-center justify-center font-bold text-sm transition-colors cursor-pointer"
                          >
                            +1
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Note editor for media */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <span className="font-bold">Avis / Remarques :</span>
                        {editingNotesId === media.id ? (
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => { setScreenMedia(prev => prev.map(m => m.id === media.id ? { ...m, notes: tempNotes } : m)); setEditingNotesId(null); }} className="text-red-400 hover:text-red-300 font-bold flex items-center gap-0.5"><Check className="w-3 h-3" /> Enregistrer</button>
                            <button onClick={() => setEditingNotesId(null)} className="text-neutral-500 hover:text-neutral-400"><X className="w-3 h-3" /></button>
                          </div>
                        ) : (
                          <button onClick={() => { setEditingNotesId(media.id); setTempNotes(media.notes); }} className="text-neutral-400 hover:text-white flex items-center gap-1"><Play className="w-3 h-3 rotate-90" /> Modifier</button>
                        )}
                      </div>
                      
                      {editingNotesId === media.id ? (
                        <textarea 
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-red-500"
                          rows={2}
                          placeholder="Qu'avez-vous pensé de cet épisode / film ?"
                        />
                      ) : (
                        <p className="text-xs text-neutral-300 italic bg-neutral-800/75 p-2 rounded-lg leading-relaxed min-h-[36px]">
                          {media.notes || "Pas de commentaires de visionnage ajoutés. Cliquez pour en insérer."}
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

      {/* 2. STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans">
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">File d'attente (Watchlist)</span>
            <span className="text-base font-extrabold font-mono text-neutral-900 block">{watchlist.length} œuvre{watchlist.length > 1 ? "s" : ""}</span>
          </div>
          <div className="p-2 bg-neutral-50 rounded-lg text-neutral-900 border border-neutral-200"><Monitor className="w-4 h-4" /></div>
        </div>
        
        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Œuvres Visionnées</span>
            <span className="text-base font-extrabold font-mono text-neutral-900 block">{finished.length} œuvre{finished.length > 1 ? "s" : ""}</span>
          </div>
          <div className="p-2 bg-red-50 text-red-600 rounded-lg border border-red-100"><CheckCircle className="w-4 h-4" /></div>
        </div>

        <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Films vs Séries / Animes</span>
            <span className="text-base font-extrabold font-mono text-neutral-900 block">
              {screenMedia.filter(m => m.type === "Film").length} films • {screenMedia.filter(m => m.type !== "Film").length} séries
            </span>
          </div>
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg border border-blue-100"><TrendingUp className="w-4 h-4" /></div>
        </div>
      </div>

      {/* 3. MAIN FILTER + ADD CONTAINER */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs space-y-6">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
          <div className="flex flex-wrap items-center gap-3">
            {/* Type Filters */}
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
              {(["Tous", "Film", "Série", "Anime"] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    filter === t
                      ? "bg-white text-neutral-900 shadow-3xs"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {t === "Tous" ? "Tous" : t}s
                </button>
              ))}
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-1.5">
              {(["Tous", "En cours", "À regarder", "Terminé"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    statusFilter === s
                      ? "bg-neutral-900 text-white border-neutral-900"
                      : "bg-white text-neutral-500 border-neutral-200 hover:border-neutral-300"
                  }`}
                >
                  {s === "Tous" ? "Tout Statut" : s === "À regarder" ? "À Regarder (Watchlist)" : s}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 bg-neutral-950 hover:bg-neutral-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer ml-auto"
          >
            {showAddForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{showAddForm ? "Annuler" : "Ajouter un Contenu"}</span>
          </button>
        </div>

        {/* 4. COLLAPSIBLE ADD MEDIA FORM */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form 
              onSubmit={handleAddMedia}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-neutral-50 rounded-2xl border border-neutral-200/80 p-5 space-y-4"
            >
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest font-mono">
                Enregistrer un Nouveau Programme / Film
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Titre du Programme / Film *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Breaking Bad"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Type</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-2 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  >
                    <option value="Série">Série TV</option>
                    <option value="Film">Film</option>
                    <option value="Anime">Anime</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Plateforme</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Netflix, Prime, Crunchyroll"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase">Statut</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-2 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                  >
                    <option value="À regarder">À regarder (Watchlist)</option>
                    <option value="En cours">En cours</option>
                    <option value="Terminé">Terminé</option>
                  </select>
                </div>

                {type !== "Film" && (
                  <>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase">Épisodes Totaux</label>
                      <input 
                        type="number" 
                        min={1}
                        value={totalEpisodes}
                        onChange={(e) => setTotalEpisodes(Number(e.target.value))}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-400 uppercase">Épisode Actuel</label>
                      <input 
                        type="number" 
                        min={0}
                        max={totalEpisodes}
                        disabled={status === "À regarder" || status === "Terminé"}
                        value={status === "À regarder" ? 0 : status === "Terminé" ? totalEpisodes : currentEpisode}
                        onChange={(e) => setCurrentEpisode(Number(e.target.value))}
                        className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 disabled:bg-neutral-100 disabled:text-neutral-400 focus:outline-none focus:border-neutral-900"
                      />
                    </div>
                  </>
                )}

                {status === "Terminé" && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Note (Stars)</label>
                    <div className="flex items-center gap-1 h-9">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="text-neutral-300 hover:text-amber-400 transition-colors"
                        >
                          <Star className={`w-5 h-5 ${rating >= star ? "text-amber-400 fill-amber-400" : ""}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase">Notes & Commentaires</label>
                <textarea 
                  placeholder="Écrivez vos pensées, avis ou résumés de vos visionnages..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl p-3 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900"
                  rows={2}
                />
              </div>

              <div className="flex justify-end gap-2.5">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 bg-neutral-200 hover:bg-neutral-300 rounded-xl text-xs font-semibold text-neutral-800 transition-all cursor-pointer"
                >
                  Fermer
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Ajouter le Programme
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* 5. MEDIA GRID LIST */}
        {displayedMedia.length === 0 ? (
          <div className="text-center py-20 text-neutral-400 italic bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200">
            Aucun contenu ne correspond à vos critères de recherche.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedMedia.map((media) => {
              const percent = media.type === "Film" 
                ? 100 
                : (media.currentEpisode && media.totalEpisodes 
                    ? Math.round((media.currentEpisode / media.totalEpisodes) * 100) 
                    : 0);

              return (
                <div 
                  key={media.id}
                  className="bg-neutral-50/50 border border-neutral-200/80 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-neutral-400 hover:bg-white transition-all shadow-3xs"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] bg-neutral-200 text-neutral-700 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider font-mono">
                          {media.type}
                        </span>
                        <span className="text-[9px] bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full font-bold font-mono">
                          {media.platform}
                        </span>
                      </div>
                      
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        media.status === "Terminé"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                          : media.status === "En cours"
                            ? "bg-red-50 text-red-700 border border-red-100"
                            : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                      }`}>
                        {media.status === "À regarder" ? "À Regarder" : media.status}
                      </span>
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-neutral-900 leading-tight flex items-center gap-1.5">
                        <Clapperboard className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                        <span>{media.title}</span>
                      </h4>
                    </div>

                    {media.type !== "Film" && media.status !== "À regarder" && (
                      <div className="space-y-1.5 pl-5">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-neutral-400 font-semibold">Progression :</span>
                          <span className="font-mono font-bold text-neutral-800">{percent}% (Ep {media.currentEpisode}/{media.totalEpisodes})</span>
                        </div>
                        <div className="w-full bg-neutral-200 rounded-full h-1">
                          <div className="bg-neutral-900 h-1 rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                      </div>
                    )}

                    {media.status === "Terminé" && media.rating > 0 && (
                      <div className="flex items-center gap-0.5 pl-5 pt-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} className={`w-3.5 h-3.5 ${media.rating >= s ? "text-amber-400 fill-amber-400" : "text-neutral-200"}`} />
                        ))}
                      </div>
                    )}

                    {media.notes && (
                      <div className="pl-5 pt-1">
                        <p className="text-[11px] text-neutral-500 bg-white border border-neutral-100 rounded-lg p-2 italic leading-relaxed">
                          {media.notes}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-2 pl-5">
                    {/* Status change actions */}
                    <div className="flex items-center gap-1">
                      {media.status !== "En cours" && (
                        <button 
                          onClick={() => changeStatus(media.id, "En cours")}
                          className="text-[10px] font-bold text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Regarder
                        </button>
                      )}
                      {media.status !== "Terminé" && (
                        <button 
                          onClick={() => changeStatus(media.id, "Terminé")}
                          className="text-[10px] font-bold text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          Marquer Vu
                        </button>
                      )}
                      {media.status !== "À regarder" && (
                        <button 
                          onClick={() => changeStatus(media.id, "À regarder")}
                          className="text-[10px] font-bold text-neutral-500 hover:bg-neutral-100 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                        >
                          File d'attente
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => deleteMedia(media.id)}
                      className="text-neutral-400 hover:text-red-500 p-1 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer ml-auto"
                      title="Supprimer ce contenu"
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
