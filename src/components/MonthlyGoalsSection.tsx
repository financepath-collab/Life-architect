import React, { useState, useMemo } from "react";
import { MonthlyGoal, ProjectFolder } from "../types";
import { 
  Plus, 
  Trash2, 
  X, 
  Check, 
  Edit, 
  Target, 
  DollarSign, 
  Users, 
  MessageSquare,
  Calendar,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface MonthlyGoalsSectionProps {
  goals: MonthlyGoal[];
  setGoals: React.Dispatch<React.SetStateAction<MonthlyGoal[]>>;
  folders?: ProjectFolder[];
  setFolders?: React.Dispatch<React.SetStateAction<ProjectFolder[]>>;
  availableChannels?: string[];
}

export default function MonthlyGoalsSection({ 
  goals = [], 
  setGoals, 
  folders = [],
  setFolders,
  availableChannels = [
    "The Moroccan Analyst", 
    "The Moroccan CFO", 
    "The Moroccan Economist", 
    "Moroccan CFO Podcast"
  ] 
}: MonthlyGoalsSectionProps) {
  
  // Available Months for filtering (default list + any custom months added)
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    monthsSet.add("2026-07");
    monthsSet.add("2026-06");
    monthsSet.add("2026-05");
    
    goals.forEach(g => {
      if (g.month && g.month.length >= 7) {
        monthsSet.add(g.month);
      }
    });

    return Array.from(monthsSet).sort().reverse();
  }, [goals]);

  // Selected filter month (default to latest available or current "2026-07")
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    return availableMonths[0] || "2026-07";
  });

  // State for adding/editing goals
  const [showForm, setShowForm] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);
  
  // Form values
  const [formMonth, setFormMonth] = useState("2026-07");
  const [formChannelName, setFormChannelName] = useState(availableChannels[0]);
  const [customChannelName, setCustomChannelName] = useState("");
  const [formTargetRevenue, setFormTargetRevenue] = useState<number | "">("");
  const [formCurrentRevenue, setFormCurrentRevenue] = useState<number | "">("");
  const [formTargetFollowers, setFormTargetFollowers] = useState<number | "">("");
  const [formCurrentFollowers, setFormCurrentFollowers] = useState<number | "">("");
  const [formNote, setFormNote] = useState("");
  const [gFolderId, setGFolderId] = useState<string>("");

  const activeChannel = formChannelName === "Autre / Custom" ? customChannelName : formChannelName;

  // Filter goals for the selected month
  const filteredGoals = useMemo(() => {
    return goals.filter(g => g.month === selectedMonth);
  }, [goals, selectedMonth]);

  // General monthly statistics
  const monthlyStats = useMemo(() => {
    let totalTargetRev = 0;
    let totalCurrentRev = 0;
    let totalTargetFollowers = 0;
    let totalCurrentFollowers = 0;

    filteredGoals.forEach(g => {
      totalTargetRev += g.targetRevenue || 0;
      totalCurrentRev += g.currentRevenue || 0;
      totalTargetFollowers += g.targetFollowers || 0;
      totalCurrentFollowers += g.currentFollowers || 0;
    });

    const revRate = totalTargetRev > 0 ? (totalCurrentRev / totalTargetRev) * 100 : 0;
    const followersRate = totalTargetFollowers > 0 ? (totalCurrentFollowers / totalTargetFollowers) * 100 : 0;

    return {
      totalTargetRev,
      totalCurrentRev,
      totalTargetFollowers,
      totalCurrentFollowers,
      revenueProgressRate: Math.round(Math.min(100, revRate)),
      followersProgressRate: Math.round(Math.min(100, followersRate))
    };
  }, [filteredGoals]);

  // Handle Form Submission (Add or Edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalChannelName = formChannelName === "Autre / Custom" 
      ? (customChannelName.trim() || "Chaîne Sans Nom")
      : formChannelName;

    const tRev = Number(formTargetRevenue) || 0;
    const cRev = Number(formCurrentRevenue) || 0;
    const tFol = Number(formTargetFollowers) || 0;
    const cFol = Number(formCurrentFollowers) || 0;

    const goalId = editingGoalId || ("mg_" + Date.now());

    if (editingGoalId) {
      // Edit mode
      setGoals(prev => prev.map(g => {
        if (g.id === editingGoalId) {
          return {
            ...g,
            month: formMonth,
            channelName: finalChannelName,
            targetRevenue: tRev,
            currentRevenue: cRev,
            targetFollowers: tFol,
            currentFollowers: cFol,
            note: formNote.trim()
          };
        }
        return g;
      }));
      setEditingGoalId(null);
    } else {
      // Add mode
      const newGoal: MonthlyGoal = {
        id: goalId,
        month: formMonth,
        channelName: finalChannelName,
        targetRevenue: tRev,
        currentRevenue: cRev,
        targetFollowers: tFol,
        currentFollowers: cFol,
        note: formNote.trim()
      };
      setGoals(prev => [newGoal, ...prev]);
    }

    if (setFolders) {
      setFolders(prev => prev.map(f => {
        let goalIds = f.associatedGoalIds.filter(id => id !== goalId);
        if (f.id === gFolderId) {
          goalIds = [...goalIds, goalId];
        }
        return {
          ...f,
          associatedGoalIds: goalIds
        };
      }));
    }

    // Reset form states
    resetForm();
    setShowForm(false);
  };

  const resetForm = () => {
    setFormMonth("2026-07");
    setFormChannelName(availableChannels[0]);
    setCustomChannelName("");
    setFormTargetRevenue("");
    setFormCurrentRevenue("");
    setFormTargetFollowers("");
    setFormCurrentFollowers("");
    setFormNote("");
    setGFolderId("");
    setEditingGoalId(null);
  };

  // Trigger editing mode
  const startEdit = (goal: MonthlyGoal) => {
    setEditingGoalId(goal.id);
    setFormMonth(goal.month);
    
    if (availableChannels.includes(goal.channelName)) {
      setFormChannelName(goal.channelName);
      setCustomChannelName("");
    } else {
      setFormChannelName("Autre / Custom");
      setCustomChannelName(goal.channelName);
    }

    setFormTargetRevenue(goal.targetRevenue);
    setFormCurrentRevenue(goal.currentRevenue);
    setFormTargetFollowers(goal.targetFollowers);
    setFormCurrentFollowers(goal.currentFollowers);
    setFormNote(goal.note || "");
    
    const associatedFolder = folders.find(f => f.associatedGoalIds.includes(goal.id));
    setGFolderId(associatedFolder?.id || "");
    
    setShowForm(true);
  };

  const deleteGoal = (id: string) => {
    if (confirm("Voulez-vous vraiment supprimer cet objectif mensuel ?")) {
      setGoals(prev => prev.filter(g => g.id !== id));
    }
  };

  // Convert month representation e.g. "2026-07" -> "Juillet 2026"
  const formatMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const label = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BAR AND FILTERS */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h3 className="text-base font-black text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-500" />
            Objectifs Mensuels des Chaînes
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Fixez et suivez vos paliers de revenus et de progression d'audience par plateforme.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Select filter Month */}
          <div className="flex items-center gap-2 bg-neutral-50 dark:bg-zinc-950 px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="appearance-none bg-transparent text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none pr-4 cursor-pointer"
            >
              {availableMonths.map(m => (
                <option key={m} value={m}>
                  {formatMonthLabel(m)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-colors shadow-2xs select-none cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvel Objectif</span>
          </button>
        </div>
      </div>

      {/* MONTHLY SUMMARY METRICS */}
      {filteredGoals.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Revenue Target summary */}
          <div className="bg-neutral-50/70 dark:bg-zinc-950/40 border border-neutral-200/60 dark:border-neutral-800 rounded-2xl p-4.5 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-neutral-600 dark:text-neutral-400">
              <span className="flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-500" />
                Revenus Cumulés du Mois
              </span>
              <span className="font-mono text-neutral-900 dark:text-neutral-50">
                {monthlyStats.totalCurrentRev.toLocaleString("fr-FR")} / {monthlyStats.totalTargetRev.toLocaleString("fr-FR")} MAD
              </span>
            </div>

            <div className="relative w-full h-2 bg-neutral-200/70 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div 
                style={{ width: `${monthlyStats.revenueProgressRate}%` }}
                className="h-full bg-emerald-500 rounded-full transition-all duration-500 ease-out"
              />
            </div>

            <div className="flex justify-between items-center text-[10px] font-black uppercase text-neutral-400 tracking-wider">
              <span>Taux de réalisation global</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-black">{monthlyStats.revenueProgressRate}%</span>
            </div>
          </div>

          {/* Follower Growth summary */}
          <div className="bg-neutral-50/70 dark:bg-zinc-950/40 border border-neutral-200/60 dark:border-neutral-800 rounded-2xl p-4.5 space-y-3">
            <div className="flex justify-between items-center text-xs font-bold text-neutral-600 dark:text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-500" />
                Objectifs Followers / Abonnés
              </span>
              <span className="font-mono text-neutral-900 dark:text-neutral-50">
                +{monthlyStats.totalCurrentFollowers.toLocaleString("fr-FR")} / +{monthlyStats.totalTargetFollowers.toLocaleString("fr-FR")} abonnés
              </span>
            </div>

            <div className="relative w-full h-2 bg-neutral-200/70 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div 
                style={{ width: `${monthlyStats.followersProgressRate}%` }}
                className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out"
              />
            </div>

            <div className="flex justify-between items-center text-[10px] font-black uppercase text-neutral-400 tracking-wider">
              <span>Croissance d'audience</span>
              <span className="text-indigo-600 dark:text-indigo-400 font-mono font-black">{monthlyStats.followersProgressRate}%</span>
            </div>
          </div>

        </div>
      )}

      {/* GOAL INPUT MODAL / FORM COLLAPSIBLE */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5"
          >
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-neutral-200/60 dark:border-neutral-800">
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-700 dark:text-neutral-300">
                {editingGoalId ? "Modifier l'objectif" : "Ajouter un nouvel objectif"}
              </h4>
              <button 
                onClick={() => { resetForm(); setShowForm(false); }}
                className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-200/50 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Target Month selection */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Mois cible</label>
                  <input
                    type="month"
                    value={formMonth}
                    onChange={(e) => setFormMonth(e.target.value)}
                    required
                    className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Channel Name selection */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Chaîne de contenu</label>
                  <select
                    value={formChannelName}
                    onChange={(e) => setFormChannelName(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                  >
                    {availableChannels.map(ch => (
                      <option key={ch} value={ch}>{ch}</option>
                    ))}
                    <option value="Autre / Custom">Autre / Custom...</option>
                  </select>
                </div>

                {/* Custom Channel Name input */}
                {formChannelName === "Autre / Custom" && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Nom personnalisé de la chaîne</label>
                    <input
                      type="text"
                      placeholder="e.g. My Newsletter"
                      value={customChannelName}
                      onChange={(e) => setCustomChannelName(e.target.value)}
                      required
                      className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                )}
              </div>

              {/* Targets and Current state */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                
                {/* Target Revenue */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Cible de revenus (MAD)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 15000"
                    value={formTargetRevenue}
                    onChange={(e) => setFormTargetRevenue(e.target.value === "" ? "" : Number(e.target.value))}
                    required
                    className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs font-bold font-mono text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Current Revenue */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Revenus actuels (MAD)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 5000"
                    value={formCurrentRevenue}
                    onChange={(e) => setFormCurrentRevenue(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs font-bold font-mono text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Target Followers growth */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Cible d'abonnés / followers</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 1000"
                    value={formTargetFollowers}
                    onChange={(e) => setFormTargetFollowers(e.target.value === "" ? "" : Number(e.target.value))}
                    required
                    className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs font-bold font-mono text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Current Followers progress */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Abonnés actuels gagnés</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="e.g. 450"
                    value={formCurrentFollowers}
                    onChange={(e) => setFormCurrentFollowers(e.target.value === "" ? "" : Number(e.target.value))}
                    className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs font-bold font-mono text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

              </div>

              {/* Project Folder association */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">📁 Dossier de projet associé</label>
                <select
                  value={gFolderId}
                  onChange={(e) => setGFolderId(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer font-sans"
                >
                  <option value="">-- Aucun --</option>
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
              </div>

              {/* Note input field */}
              <div>
                <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Notes / Plan d'action pour atteindre cet objectif</label>
                <textarea
                  placeholder="e.g. Publier 2 Reels sponsorisés, optimiser le tunnel de vente du produit digital..."
                  value={formNote}
                  onChange={(e) => setFormNote(e.target.value)}
                  rows={2}
                  className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Submit and cancel actions */}
              <div className="flex justify-end gap-3.5 pt-1.5">
                <button
                  type="button"
                  onClick={() => { resetForm(); setShowForm(false); }}
                  className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 text-xs font-bold cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingGoalId ? "Mettre à jour" : "Fixer l'objectif"}</span>
                </button>
              </div>

            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CORE OBJECTIFS LIST */}
      <div className="space-y-4">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/20">
            <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2.5" />
            <h4 className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Aucun objectif fixé pour {formatMonthLabel(selectedMonth)}</h4>
            <p className="text-[11px] text-neutral-400 mt-1 max-w-sm mx-auto">
              Planifiez la croissance d'audience et les revenus de vos chaînes pour rester discipliné et mesurer votre progression.
            </p>
            <button
              onClick={() => { resetForm(); setShowForm(true); }}
              className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mx-auto bg-white border border-neutral-200 px-3 py-1.5 rounded-lg shadow-3xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Créer le premier objectif du mois</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredGoals.map((g) => {
              const revPercent = g.targetRevenue > 0 ? Math.round((g.currentRevenue / g.targetRevenue) * 100) : 0;
              const folPercent = g.targetFollowers > 0 ? Math.round((g.currentFollowers / g.targetFollowers) * 100) : 0;
              const associatedFolder = folders.find(f => f.associatedGoalIds.includes(g.id));

              return (
                <div 
                  key={g.id} 
                  className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-5 hover:border-indigo-500/20 transition-all shadow-3xs hover:shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6"
                >
                  {/* Left Column - Channel Identity & Notes */}
                  <div className="space-y-2 md:max-w-xs shrink-0">
                    <div>
                      <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Chaîne</span>
                      <h4 className="text-sm font-black text-neutral-900 dark:text-neutral-50 mt-0.5">{g.channelName}</h4>
                      
                      {associatedFolder && (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 text-[9px] font-black bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-sans">
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
                            {associatedFolder.name}
                          </span>
                        </div>
                      )}
                    </div>

                    {g.note && (
                      <p className="text-[11px] text-neutral-400 dark:text-neutral-500 italic flex items-start gap-1">
                        <MessageSquare className="w-3 h-3 text-neutral-300 shrink-0 mt-0.5" />
                        <span className="line-clamp-2" title={g.note}>{g.note}</span>
                      </p>
                    )}
                  </div>

                  {/* Middle Column - Progress visualizer */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Revenue progression */}
                    <div className="space-y-2 bg-neutral-50/50 dark:bg-zinc-950/60 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800/60">
                      <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500">
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5 text-emerald-500" />
                          Revenus
                        </span>
                        <span className="font-mono text-neutral-700 dark:text-neutral-300">
                          {g.currentRevenue.toLocaleString()} / {g.targetRevenue.toLocaleString()} MAD
                        </span>
                      </div>

                      <div className="relative w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${Math.min(100, revPercent)}%` }}
                          className={`h-full rounded-full ${revPercent >= 100 ? "bg-emerald-500" : "bg-emerald-400"}`}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-black text-neutral-400">
                        <span>Progression</span>
                        <span className={revPercent >= 100 ? "text-emerald-600 font-extrabold" : "text-neutral-600"}>
                          {revPercent}% {revPercent >= 100 && "🎯"}
                        </span>
                      </div>
                    </div>

                    {/* Followers growth progression */}
                    <div className="space-y-2 bg-neutral-50/50 dark:bg-zinc-950/60 p-3 rounded-xl border border-neutral-100 dark:border-neutral-800/60">
                      <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500">
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-indigo-500" />
                          Followers
                        </span>
                        <span className="font-mono text-neutral-700 dark:text-neutral-300">
                          +{g.currentFollowers.toLocaleString()} / +{g.targetFollowers.toLocaleString()}
                        </span>
                      </div>

                      <div className="relative w-full h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                        <div 
                          style={{ width: `${Math.min(100, folPercent)}%` }}
                          className={`h-full rounded-full ${folPercent >= 100 ? "bg-indigo-500" : "bg-indigo-400"}`}
                        />
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-black text-neutral-400">
                        <span>Progression</span>
                        <span className={folPercent >= 100 ? "text-indigo-600 font-extrabold" : "text-neutral-600"}>
                          {folPercent}% {folPercent >= 100 && "🚀"}
                        </span>
                      </div>
                    </div>

                  </div>

                  {/* Right Column - Actions */}
                  <div className="flex md:flex-col items-center justify-end gap-2 shrink-0 border-t md:border-t-0 border-neutral-100 pt-3 md:pt-0">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => startEdit(g)}
                        className="p-1.5 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-colors cursor-pointer"
                        title="Modifier l'objectif"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteGoal(g.id)}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg transition-colors cursor-pointer"
                        title="Supprimer l'objectif"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <select
                      value={associatedFolder?.id || ""}
                      onChange={(e) => {
                        const targetFolderId = e.target.value;
                        if (setFolders) {
                          setFolders(prev => prev.map(f => {
                            let ids = f.associatedGoalIds.filter(id => id !== g.id);
                            if (f.id === targetFolderId) {
                              ids = [...ids, g.id];
                            }
                            return {
                              ...f,
                              associatedGoalIds: ids
                            };
                          }));
                        }
                      }}
                      className="text-[9px] font-bold text-neutral-500 bg-neutral-50 hover:bg-neutral-100 hover:text-neutral-800 border border-neutral-200 rounded-lg py-1 px-1.5 focus:outline-hidden cursor-pointer max-w-[100px] font-sans"
                    >
                      <option value="">📁 Projet...</option>
                      {folders.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>
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
