import React, { useState, useEffect, useMemo } from "react";
import { JournalEntry } from "../types";
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Search, 
  Smile, 
  Frown, 
  Meh, 
  Activity, 
  Compass, 
  Calendar, 
  Tag, 
  Edit2, 
  X, 
  Check, 
  FileText,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const MOODS = [
  { value: "Excellent", label: "Excellent", color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20", icon: Smile },
  { value: "Bon", label: "Bon", color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20", icon: Compass },
  { value: "Neutre", label: "Neutre", color: "text-amber-500 bg-amber-500/10 border-amber-500/20", icon: Meh },
  { value: "Fatigué", label: "Fatigué", color: "text-blue-500 bg-blue-500/10 border-blue-500/20", icon: Activity },
  { value: "Stressé", label: "Stressé", color: "text-rose-500 bg-rose-500/10 border-rose-500/20", icon: Frown }
] as const;

export default function JournalSection() {
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem("life_architect_journal");
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error("Failed to load journal entries:", e);
    }
    // Return sample entries if empty to give a rich starting experience
    return [
      {
        id: "j_1",
        date: "2026-07-16",
        title: "Lancement de la nouvelle structure de vie",
        content: "Aujourd'hui, j'ai optimisé mes trackers de discipline et de projets. Je me sens motivé à bloc. Les finances sont sous contrôle, j'ai budgétisé toutes les charges du mois. L'objectif de la semaine est d'être hyper constant sur ma routine de sport.",
        mood: "Excellent",
        tags: "Discipline, Finances, Organisation"
      },
      {
        id: "j_2",
        date: "2026-07-15",
        title: "Session de révisions & Analyse de marché",
        content: "Excellente progression sur la formation en production cinématographique. J'ai aussi analysé le comportement du cours de bourse sur la BVC. Patience et rigueur sont les maîtres mots de cette transition.",
        mood: "Bon",
        tags: "Apprentissage, Bourse"
      }
    ];
  });

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("life_architect_journal", JSON.stringify(entries));
  }, [entries]);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMoodFilter, setSelectedMoodFilter] = useState<string>("Tous");

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form input fields
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<JournalEntry["mood"]>("Bon");
  const [tags, setTags] = useState("");

  // Filter & search logic
  const filteredEntries = useMemo(() => {
    return entries
      .filter(entry => {
        const matchesSearch = 
          entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (entry.tags && entry.tags.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesMood = selectedMoodFilter === "Tous" || entry.mood === selectedMoodFilter;
        
        return matchesSearch && matchesMood;
      })
      .sort((a, b) => b.date.localeCompare(a.date)); // Newest first
  }, [entries, searchQuery, selectedMoodFilter]);

  const handleOpenAddForm = () => {
    setEditingId(null);
    setTitle("");
    setDate(new Date().toISOString().split("T")[0]);
    setContent("");
    setMood("Bon");
    setTags("");
    setShowForm(true);
  };

  const handleOpenEditForm = (entry: JournalEntry) => {
    setEditingId(entry.id);
    setTitle(entry.title);
    setDate(entry.date);
    setContent(entry.content);
    setMood(entry.mood);
    setTags(entry.tags || "");
    setShowForm(true);
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    if (editingId) {
      // Update existing
      setEntries(prev => prev.map(item => 
        item.id === editingId 
          ? { ...item, title: title.trim(), date, content: content.trim(), mood, tags: tags.trim() }
          : item
      ));
      setEditingId(null);
    } else {
      // Add new
      const newEntry: JournalEntry = {
        id: "journal_" + Date.now(),
        title: title.trim(),
        date,
        content: content.trim(),
        mood,
        tags: tags.trim()
      };
      setEntries(prev => [newEntry, ...prev]);
    }

    // Reset fields & close
    setTitle("");
    setContent("");
    setTags("");
    setShowForm(false);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette réflexion ?")) {
      setEntries(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top action bar with Add Button & Filter controls */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center bg-white dark:bg-zinc-950 border border-neutral-200/50 dark:border-neutral-800 p-4 rounded-3xl">
        <div className="flex-1 flex flex-col sm:flex-row gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Rechercher des réflexions, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800/80 rounded-2xl text-xs font-medium text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-indigo-500/50"
            />
          </div>

          {/* Mood Filter */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono hidden sm:inline">Humeur:</span>
            <select
              value={selectedMoodFilter}
              onChange={(e) => setSelectedMoodFilter(e.target.value)}
              className="px-3 py-2.5 bg-neutral-50 dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800/80 rounded-2xl text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-hidden focus:ring-1 focus:ring-indigo-500/50"
            >
              <option value="Tous">Toutes les humeurs</option>
              {MOODS.map(m => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleOpenAddForm}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-bold rounded-2xl cursor-pointer shadow-sm shadow-indigo-500/10 transition-all select-none shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Nouvelle Réflexion</span>
        </button>
      </div>

      {/* Add / Edit Form Modal-like inline section */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <form 
              onSubmit={handleSaveEntry}
              className="bg-neutral-50/50 dark:bg-zinc-950/40 border border-neutral-200 dark:border-neutral-800 p-5 md:p-6 rounded-3xl space-y-4 mb-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-neutral-800 dark:text-white">
                    {editingId ? "Modifier la Réflexion" : "Nouvelle Réflexion Quotidienne"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Date Input */}
                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Date de l'entrée</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                      className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-bold text-neutral-800 dark:text-neutral-100 focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Title Input */}
                <div className="md:col-span-8 space-y-1.5">
                  <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Titre de la réflexion</label>
                  <input 
                    type="text" 
                    placeholder="Qu'avez-vous à l'esprit aujourd'hui ?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-bold text-neutral-800 dark:text-neutral-100 focus:outline-hidden focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Mood Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono block">État d'esprit & Énergie</label>
                <div className="flex flex-wrap gap-2">
                  {MOODS.map(m => {
                    const MoodIcon = m.icon;
                    const isSelected = mood === m.value;
                    return (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setMood(m.value)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border cursor-pointer select-none transition-all ${
                          isSelected 
                            ? `${m.color} ring-1 ring-offset-2 ring-indigo-500/30` 
                            : "bg-white dark:bg-zinc-900 border-neutral-200 dark:border-neutral-800/80 text-neutral-500 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700"
                        }`}
                      >
                        <MoodIcon className="w-4 h-4" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Reflection Content TextArea */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Contenu / Pensées de la journée</label>
                <textarea 
                  rows={5}
                  placeholder="Écrivez librement... Vos leçons apprises, blocages surmontés ou jalons validés."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-medium text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 focus:outline-hidden focus:border-indigo-500 leading-relaxed resize-y"
                />
              </div>

              {/* Tags Input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>Tags (séparés par des virgules)</span>
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Discipline, Finances, Focus, YouTube"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-bold text-neutral-800 dark:text-neutral-100 focus:outline-hidden focus:border-indigo-500"
                />
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-900 dark:hover:bg-zinc-850 border border-neutral-200 dark:border-neutral-800 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-400 cursor-pointer select-none transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer shadow-sm transition-all select-none"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingId ? "Mettre à jour" : "Sauvegarder"}</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid / Stack of Entries */}
      {filteredEntries.length === 0 ? (
        <div className="bg-white dark:bg-zinc-950 border border-neutral-200/50 dark:border-neutral-800 rounded-3xl p-12 text-center flex flex-col items-center justify-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-neutral-800 dark:text-white">Aucun écrit trouvé</h3>
            <p className="text-xs text-neutral-400 max-w-sm">
              Commencez à documenter vos pensées, vos progrès professionnels, vos défis ou de simples gratitudes quotidiennes.
            </p>
          </div>
          <button
            onClick={handleOpenAddForm}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-xs font-bold text-indigo-600 dark:text-indigo-400 rounded-xl cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Écrire maintenant</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredEntries.map(entry => {
              const matchedMood = MOODS.find(m => m.value === entry.mood) || MOODS[1];
              const MoodIcon = matchedMood.icon;

              return (
                <motion.div
                  key={entry.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white dark:bg-zinc-950 border border-neutral-200/50 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 p-5 rounded-3xl flex flex-col justify-between space-y-4 group transition-all duration-200"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-[10px] font-black font-mono text-neutral-400 bg-neutral-100 dark:bg-zinc-900 px-2 py-1 rounded-md">
                          <Calendar className="w-3 h-3 text-indigo-500" />
                          <span>{entry.date}</span>
                        </span>
                        
                        {/* Mood tag */}
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold border rounded-lg ${matchedMood.color}`}>
                          <MoodIcon className="w-3 h-3" />
                          <span>{entry.mood}</span>
                        </span>
                      </div>

                      {/* Edit & Delete Actions */}
                      <div className="flex items-center gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleOpenEditForm(entry)}
                          className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-900 rounded-lg cursor-pointer"
                          title="Modifier"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-500/10 rounded-lg cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Title */}
                    <h4 className="text-sm font-bold text-neutral-800 dark:text-neutral-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {entry.title}
                    </h4>

                    {/* Body Text */}
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                      {entry.content}
                    </p>
                  </div>

                  {/* Tags footer */}
                  {entry.tags && (
                    <div className="pt-3 border-t border-dashed border-neutral-100 dark:border-neutral-800/80 flex flex-wrap gap-1.5">
                      {entry.tags.split(",").map((t, i) => {
                        const trimmedTag = t.trim();
                        if (!trimmedTag) return null;
                        return (
                          <span 
                            key={i}
                            className="inline-flex items-center gap-0.5 px-2 py-0.5 text-[9px] font-black font-mono text-neutral-400 dark:text-neutral-500 bg-neutral-50 dark:bg-zinc-900 border border-neutral-200/50 dark:border-neutral-850 rounded-md"
                          >
                            #{trimmedTag}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
