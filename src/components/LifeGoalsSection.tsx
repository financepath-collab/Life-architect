import React, { useState, useMemo } from "react";
import { PossibiliteGoal, GoalMilestone } from "../types";
import { 
  Award, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  CheckCircle, 
  Circle, 
  PlusCircle, 
  ChevronDown, 
  ChevronUp, 
  Target, 
  TrendingUp, 
  CheckSquare, 
  Clock, 
  Sparkles, 
  ListTodo, 
  ArrowRight,
  Bookmark,
  Hourglass,
  CalendarDays,
  Activity,
  Search,
  Pencil
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface LifeGoalsSectionProps {
  possibilitesGoals: PossibiliteGoal[];
  setPossibilitesGoals: React.Dispatch<React.SetStateAction<PossibiliteGoal[]>>;
}

export default function LifeGoalsSection({
  possibilitesGoals,
  setPossibilitesGoals
}: LifeGoalsSectionProps) {
  // Filter States
  const [horizonFilter, setHorizonFilter] = useState<"Tous" | "Court Terme" | "Moyen Terme" | "Long Terme">("Tous");
  const [statusFilter, setStatusFilter] = useState<"Tous" | "En cours" | "Atteints">("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  // UI Control States
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoalId, setEditingGoalId] = useState<string | null>(null);

  // Form Field States (Add / Edit)
  const [title, setTitle] = useState("");
  const [type, setType] = useState<"Court Terme" | "Moyen Terme" | "Long Terme">("Court Terme");
  const [targetYear, setTargetYear] = useState("");
  const [description, setDescription] = useState("");
  const [completed, setCompleted] = useState(false);

  // New Milestone quick fields (mapped per goal to keep it simple, or single temp fields)
  const [newMilestoneTitle, setNewMilestoneTitle] = useState("");
  const [newMilestoneDueDate, setNewMilestoneDueDate] = useState("");

  // Editing Milestone state
  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editMilestoneTitle, setEditMilestoneTitle] = useState("");
  const [editMilestoneDueDate, setEditMilestoneDueDate] = useState("");

  // Stats calculation
  const stats = useMemo(() => {
    const total = possibilitesGoals.length;
    const completedGoals = possibilitesGoals.filter(g => g.completed).length;
    const courtTerme = possibilitesGoals.filter(g => g.type === "Court Terme").length;
    const moyenTerme = possibilitesGoals.filter(g => g.type === "Moyen Terme").length;
    const longTerme = possibilitesGoals.filter(g => g.type === "Long Terme").length;

    // Milestone stats
    let totalMilestonesCount = 0;
    let completedMilestonesCount = 0;
    possibilitesGoals.forEach(g => {
      if (g.milestones) {
        totalMilestonesCount += g.milestones.length;
        completedMilestonesCount += g.milestones.filter(m => m.completed).length;
      }
    });

    const overallMilestoneRate = totalMilestonesCount > 0 
      ? Math.round((completedMilestonesCount / totalMilestonesCount) * 100) 
      : 0;

    return {
      total,
      completedGoals,
      activeGoals: total - completedGoals,
      courtTerme,
      moyenTerme,
      longTerme,
      totalMilestonesCount,
      completedMilestonesCount,
      overallMilestoneRate,
      completionRate: total > 0 ? Math.round((completedGoals / total) * 100) : 0
    };
  }, [possibilitesGoals]);

  // Handle Filtering
  const filteredGoals = useMemo(() => {
    return possibilitesGoals.filter(g => {
      const matchesHorizon = horizonFilter === "Tous" || g.type === horizonFilter;
      
      const isGoalCompleted = g.completed;
      const matchesStatus = statusFilter === "Tous" 
        ? true 
        : statusFilter === "Atteints" 
          ? isGoalCompleted 
          : !isGoalCompleted;

      const text = `${g.title} ${g.description} ${g.targetYear}`.toLowerCase();
      const matchesSearch = text.includes(searchQuery.toLowerCase()) || (
        g.milestones && g.milestones.some(m => m.title.toLowerCase().includes(searchQuery.toLowerCase()))
      );

      return matchesHorizon && matchesStatus && matchesSearch;
    });
  }, [possibilitesGoals, horizonFilter, statusFilter, searchQuery]);

  // Goal CRUD Actions
  const handleOpenAdd = () => {
    setEditingGoalId(null);
    setTitle("");
    setType("Court Terme");
    setTargetYear(new Date().getFullYear().toString());
    setDescription("");
    setCompleted(false);
    setShowAddForm(true);
  };

  const handleOpenEdit = (goal: PossibiliteGoal) => {
    setEditingGoalId(goal.id);
    setTitle(goal.title);
    setType(goal.type);
    setTargetYear(goal.targetYear);
    setDescription(goal.description);
    setCompleted(goal.completed);
    setShowAddForm(true);
  };

  const handleDeleteGoal = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet objectif de vie stratégique ?")) {
      setPossibilitesGoals(prev => prev.filter(g => g.id !== id));
      if (expandedGoalId === id) setExpandedGoalId(null);
    }
  };

  const handleSubmitGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingGoalId) {
      // Edit
      setPossibilitesGoals(prev => prev.map(g => {
        if (g.id !== editingGoalId) return g;
        return {
          ...g,
          title: title.trim(),
          type,
          targetYear: targetYear.trim(),
          description: description.trim(),
          completed
        };
      }));
      setEditingGoalId(null);
    } else {
      // Add
      const newGoal: PossibiliteGoal = {
        id: "goal_" + Date.now(),
        title: title.trim(),
        type,
        targetYear: targetYear.trim(),
        description: description.trim(),
        completed: false,
        milestones: []
      };
      setPossibilitesGoals(prev => [newGoal, ...prev]);
    }

    // Reset Form
    setTitle("");
    setDescription("");
    setShowAddForm(false);
  };

  const handleToggleGoalCompleted = (goal: PossibiliteGoal) => {
    setPossibilitesGoals(prev => prev.map(g => {
      if (g.id !== goal.id) return g;
      const nextCompleted = !g.completed;
      
      // Optional auto-check milestones if completing goal
      let updatedMilestones = g.milestones || [];
      if (nextCompleted) {
        updatedMilestones = updatedMilestones.map(m => ({ ...m, completed: true }));
      }

      return {
        ...g,
        completed: nextCompleted,
        milestones: updatedMilestones
      };
    }));
  };

  // Milestone actions
  const handleToggleMilestone = (goalId: string, milestoneId: string) => {
    setPossibilitesGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      const updatedMilestones = (g.milestones || []).map(m => {
        if (m.id !== milestoneId) return m;
        return { ...m, completed: !m.completed };
      });

      // Auto-complete goal if all milestones are completed and there's at least one milestone
      const allCompleted = updatedMilestones.length > 0 && updatedMilestones.every(m => m.completed);

      return {
        ...g,
        milestones: updatedMilestones,
        completed: allCompleted ? true : g.completed
      };
    }));
  };

  const handleAddMilestone = (e: React.FormEvent, goalId: string) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;

    const newMilestone: GoalMilestone = {
      id: "ms_" + Date.now(),
      title: newMilestoneTitle.trim(),
      completed: false,
      dueDate: newMilestoneDueDate ? newMilestoneDueDate : undefined
    };

    setPossibilitesGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      const currentMilestones = g.milestones || [];
      return {
        ...g,
        milestones: [...currentMilestones, newMilestone],
        // If we add a new non-completed milestone, make sure goal is not automatically completed if it was
        completed: g.completed && currentMilestones.length === 0 ? true : g.completed
      };
    }));

    setNewMilestoneTitle("");
    setNewMilestoneDueDate("");
  };

  const handleStartEditMilestone = (milestone: GoalMilestone) => {
    setEditingMilestoneId(milestone.id);
    setEditMilestoneTitle(milestone.title);
    setEditMilestoneDueDate(milestone.dueDate || "");
  };

  const handleSaveEditMilestone = (goalId: string, milestoneId: string) => {
    if (!editMilestoneTitle.trim()) return;
    setPossibilitesGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      return {
        ...g,
        milestones: (g.milestones || []).map(m =>
          m.id === milestoneId ? { ...m, title: editMilestoneTitle.trim(), dueDate: editMilestoneDueDate || undefined } : m
        )
      };
    }));
    setEditingMilestoneId(null);
  };

  const handleCancelEditMilestone = () => {
    setEditingMilestoneId(null);
  };

  const handleDeleteMilestone = (goalId: string, milestoneId: string) => {
    setPossibilitesGoals(prev => prev.map(g => {
      if (g.id !== goalId) return g;
      const updatedMilestones = (g.milestones || []).filter(m => m.id !== milestoneId);
      
      // Re-evaluate goal completed status if remaining are all complete
      const allCompleted = updatedMilestones.length > 0 && updatedMilestones.every(m => m.completed);

      return {
        ...g,
        milestones: updatedMilestones,
        completed: allCompleted ? true : g.completed
      };
    }));
  };

  // Helper calculation for a single goal milestone progress
  const getGoalProgress = (goal: PossibiliteGoal) => {
    if (!goal.milestones || goal.milestones.length === 0) {
      return goal.completed ? 100 : 0;
    }
    const completed = goal.milestones.filter(m => m.completed).length;
    return Math.round((completed / goal.milestones.length) * 100);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. HERO DE PRÉSENTATION DES BUTS DE VIE */}
      <div className="bg-neutral-900 text-white rounded-3xl p-6 shadow-md border border-neutral-800 relative overflow-hidden">
        <div className="absolute top-[-40%] right-[-15%] w-[50%] h-[180%] rounded-full bg-neutral-800/80 blur-3xl pointer-events-none opacity-40" />
        
        <div className="relative z-10 space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-neutral-800 rounded-xl text-amber-400 border border-neutral-700 shadow-3xs">
                <Award className="w-5 h-5" />
              </span>
              <div>
                <span className="text-[10px] font-black tracking-widest text-neutral-300 uppercase font-mono">Planification Stratégique</span>
                <h2 className="text-sm md:text-base font-black text-white leading-none mt-1">
                  Possibilités & Objectifs de Vie Majeurs
                </h2>
              </div>
            </div>
            <span className="text-xs text-neutral-400 font-mono hidden md:inline-block">
              {stats.activeGoals} but{stats.activeGoals > 1 ? "s" : ""} actif{stats.activeGoals > 1 ? "s" : ""} restant{stats.activeGoals > 1 ? "s" : ""}
            </span>
          </div>

          <p className="text-xs text-neutral-400 leading-relaxed max-w-2xl">
            Réglez vos objectifs de vie à court, moyen et long terme. Divisez chaque grand objectif stratégique en <strong className="text-amber-400 font-bold">jalons mesurables (milestones)</strong> pour suivre votre progression de manière réaliste et structurée.
          </p>

          {/* Micro stats panels */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
            <div className="bg-neutral-800/40 border border-neutral-700/40 rounded-2xl p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Avancement global</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black font-mono text-white">{stats.completionRate}%</span>
                <span className="text-[10px] text-neutral-400 font-semibold">({stats.completedGoals}/{stats.total} objectifs)</span>
              </div>
            </div>

            <div className="bg-neutral-800/40 border border-neutral-700/40 rounded-2xl p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Jalons Validés</span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black font-mono text-amber-400">{stats.overallMilestoneRate}%</span>
                <span className="text-[10px] text-neutral-400 font-semibold">({stats.completedMilestonesCount}/{stats.totalMilestonesCount} étapes)</span>
              </div>
            </div>

            <div className="bg-neutral-800/40 border border-neutral-700/40 rounded-2xl p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Horizons d'action</span>
              <span className="text-[11px] font-extrabold text-neutral-200 block font-mono">
                {stats.courtTerme} Court • {stats.moyenTerme} Moyen • {stats.longTerme} Long
              </span>
            </div>

            <div className="bg-neutral-800/40 border border-neutral-700/40 rounded-2xl p-3.5 space-y-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Taux d'Action</span>
              <div className="flex items-center gap-1">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-[11px] font-black text-emerald-400 font-mono">Discipline Intégrale</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CONTROLS BAR: HORIZON, STATUS, SEARCH, ADD BUTTON */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Horizon Filter */}
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
              {(["Tous", "Court Terme", "Moyen Terme", "Long Terme"] as const).map(h => (
                <button
                  key={h}
                  onClick={() => setHorizonFilter(h)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer flex items-center gap-1 ${
                    horizonFilter === h
                      ? "bg-white text-neutral-950 shadow-3xs"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {h === "Tous" ? "Tous Horizons" : h}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl">
              {(["Tous", "En cours", "Atteints"] as const).map(s => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                    statusFilter === s
                      ? "bg-white text-neutral-950 shadow-3xs"
                      : "text-neutral-500 hover:text-neutral-900"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full xl:w-auto ml-auto">
            {/* Search Input */}
            <div className="relative w-full xl:w-60">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un objectif, jalon..."
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

            {/* Add Goal Button */}
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow-3xs cursor-pointer shrink-0 font-sans"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Fixer un Objectif</span>
            </button>
          </div>
        </div>

        {/* 3. COLLAPSIBLE ADD / EDIT FORM */}
        <AnimatePresence>
          {showAddForm && (
            <motion.form 
              onSubmit={handleSubmitGoal}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-neutral-50 rounded-2xl border border-neutral-200/80 p-5 space-y-4 font-sans"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
                <h3 className="text-xs font-black text-neutral-950 uppercase tracking-widest font-mono flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
                  <span>{editingGoalId ? "Modifier l'Objectif de Vie" : "Créer un Objectif de Vie Stratégique"}</span>
                </h3>
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)} 
                  className="text-neutral-400 hover:text-neutral-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-neutral-400 uppercase">Intitulé du Goal *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Atteindre l'Indépendance Financière au Maroc"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-neutral-400 uppercase">Horizon Temporel</label>
                  <select 
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-2 py-2 text-xs text-neutral-900 font-bold focus:outline-none focus:border-neutral-900 cursor-pointer"
                  >
                    <option value="Court Terme">Court Terme (Dans l'année)</option>
                    <option value="Moyen Terme">Moyen Terme (1 à 3 ans)</option>
                    <option value="Long Terme">Long Terme (3 ans et +)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-neutral-400 uppercase">Année Cible *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: 2026, 2028, 2032"
                    value={targetYear}
                    onChange={(e) => setTargetYear(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 font-mono font-bold"
                  />
                </div>
              </div>

              {/* Description / Why */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-neutral-400 uppercase">Pourquoi & Comment (Raison d'être et Vision)</label>
                <textarea 
                  placeholder="Expliquez l'impact de cet objectif sur votre vie, les habitudes requises et la motivation sous-jacente..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl p-3.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 font-medium"
                  rows={2}
                />
              </div>

              {/* Status checklist if editing */}
              {editingGoalId && (
                <div className="flex items-center gap-2 bg-neutral-100 p-3 rounded-xl border border-neutral-200 w-fit">
                  <input 
                    type="checkbox" 
                    id="edit_completed"
                    checked={completed}
                    onChange={(e) => setCompleted(e.target.checked)}
                    className="rounded border-neutral-300 text-neutral-950 focus:ring-neutral-950 cursor-pointer w-4 h-4"
                  />
                  <label htmlFor="edit_completed" className="text-xs font-bold text-neutral-700 cursor-pointer">
                    Marquer cet objectif de vie comme entièrement atteint (Atteint)
                  </label>
                </div>
              )}

              {/* Footer actions */}
              <div className="flex justify-end gap-2.5 pt-1 border-t border-neutral-150">
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
                  {editingGoalId ? "Enregistrer les modifications" : "Ajouter cet Objectif de Vie"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {/* 4. GOALS INTERACTIVE SPREADSHEET TABLE */}
        {filteredGoals.length === 0 ? (
          <div className="text-center py-20 text-neutral-400 italic bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200 font-medium text-xs">
            Aucun objectif de vie ne correspond à vos filtres et recherche actuels.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-neutral-200/80 shadow-3xs bg-white">
            <table className="w-full text-left border-collapse font-sans text-xs min-w-[950px]">
              <thead>
                <tr className="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 border-r border-neutral-150 w-12 text-center">Status</th>
                  <th className="py-3 px-4 border-r border-neutral-150">Objectif Stratégique (Goal)</th>
                  <th className="py-3 px-4 border-r border-neutral-150 w-32">Horizon</th>
                  <th className="py-3 px-4 border-r border-neutral-150 w-24 text-center">Année Cible</th>
                  <th className="py-3 px-4 border-r border-neutral-150">Description & Vision</th>
                  <th className="py-3 px-4 border-r border-neutral-150 w-52">Jalons & Progression</th>
                  <th className="py-3 px-4 text-center w-28">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-150">
                {filteredGoals.map((goal) => {
                  const progress = getGoalProgress(goal);
                  const isExpanded = expandedGoalId === goal.id;
                  const milestonesCount = goal.milestones?.length || 0;
                  const completedMilestones = goal.milestones?.filter(m => m.completed).length || 0;

                  return (
                    <React.Fragment key={goal.id}>
                      <tr className={`hover:bg-neutral-50/40 transition-colors group ${
                        goal.completed ? "bg-emerald-50/10" : ""
                      }`}>
                        
                        {/* 1. STATUS CHECKBOX */}
                        <td className="py-3 px-4 border-r border-neutral-150 text-center">
                          <button
                            onClick={() => handleToggleGoalCompleted(goal)}
                            className="text-neutral-400 hover:text-neutral-900 transition-colors inline-block cursor-pointer"
                            title={goal.completed ? "Marquer comme en cours" : "Marquer comme atteint"}
                          >
                            {goal.completed ? (
                              <CheckCircle className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                            ) : (
                              <Circle className="w-5 h-5 text-neutral-300 hover:text-neutral-500" />
                            )}
                          </button>
                        </td>

                        {/* 2. GOAL TITLE */}
                        <td className="py-3 px-4 border-r border-neutral-150 font-black text-neutral-900 max-w-[250px] truncate">
                          <span 
                            className={`cursor-pointer hover:underline ${
                              goal.completed ? "line-through text-neutral-400 font-medium" : ""
                            }`}
                            onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                            title={goal.title}
                          >
                            {goal.title}
                          </span>
                        </td>

                        {/* 3. HORIZON TAG */}
                        <td className="py-3 px-4 border-r border-neutral-150">
                          <span className={`inline-block text-[9px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider font-mono border ${
                            goal.type === "Court Terme"
                              ? "bg-red-50 text-red-700 border-red-100"
                              : goal.type === "Moyen Terme"
                                ? "bg-amber-50 text-amber-700 border-amber-100"
                                : "bg-neutral-100 text-neutral-700 border-neutral-200"
                          }`}>
                            {goal.type}
                          </span>
                        </td>

                        {/* 4. TARGET YEAR */}
                        <td className="py-3 px-4 border-r border-neutral-150 text-center font-mono font-bold text-neutral-800 text-xs">
                          {goal.targetYear}
                        </td>

                        {/* 5. DESCRIPTION */}
                        <td className={`py-3 px-4 border-r border-neutral-150 text-neutral-500 max-w-[240px] truncate ${
                          goal.completed ? "text-neutral-400 italic" : "font-medium"
                        }`} title={goal.description}>
                          {goal.description || "Aucun détail complémentaire spécifié."}
                        </td>

                        {/* 6. PROGRESSION & MILESTONES RATIO */}
                        <td className="py-3 px-4 border-r border-neutral-150">
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] font-bold text-neutral-500">
                              <span>Progression :</span>
                              <span className="font-mono text-neutral-800">
                                {progress}% ({completedMilestones}/{milestonesCount} jalons)
                              </span>
                            </div>
                            <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden p-[1px] shadow-inner relative">
                              <div 
                                className={`h-full rounded-full transition-all duration-500 ${
                                  progress === 100 
                                    ? "bg-emerald-500" 
                                    : progress > 50 
                                      ? "bg-amber-500" 
                                      : "bg-red-500"
                                }`} 
                                style={{ width: `${progress}%` }} 
                              />
                            </div>
                          </div>
                        </td>

                        {/* 7. ROW ACTIONS */}
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Expand milestones button */}
                            <button
                              onClick={() => setExpandedGoalId(isExpanded ? null : goal.id)}
                              className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 cursor-pointer font-bold text-[10px] ${
                                isExpanded 
                                  ? "bg-neutral-900 border-neutral-900 text-white" 
                                  : "bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50"
                              }`}
                              title={isExpanded ? "Masquer les jalons" : "Gérer les jalons"}
                            >
                              <ListTodo className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Jalons</span>
                              {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleOpenEdit(goal)}
                              className="text-neutral-400 hover:text-neutral-950 p-1 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                              title="Modifier l'objectif"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteGoal(goal.id)}
                              className="text-neutral-400 hover:text-red-600 p-1 rounded hover:bg-neutral-100 transition-colors cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>

                      {/* EXPANDED JALONS SECTION */}
                      {isExpanded && (
                        <tr className="bg-neutral-50/50">
                          <td colSpan={7} className="py-4 px-8 border-b border-neutral-200">
                            <div className="space-y-4 font-sans">
                              
                              <div className="flex items-center justify-between border-b border-neutral-150 pb-2">
                                <span className="flex items-center gap-2 text-[11px] font-black text-neutral-700 uppercase tracking-wider font-mono">
                                  <ListTodo className="w-4 h-4 text-amber-500" />
                                  <span>Jalons Stratégiques de : <strong>"{goal.title}"</strong></span>
                                </span>
                                <span className="text-[10px] font-bold text-neutral-400 font-mono">
                                  {completedMilestones} sur {milestonesCount} étapes complétées
                                </span>
                              </div>

                              {/* Milestones list */}
                              {milestonesCount === 0 ? (
                                <div className="text-center py-6 text-neutral-400 italic font-medium bg-white/50 border border-dashed border-neutral-200 rounded-2xl">
                                  Aucun jalon défini pour le moment. Divisez cet objectif en étapes ci-dessous !
                                </div>
                              ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {goal.milestones?.map((milestone) => (
                                    <div 
                                      key={milestone.id}
                                      className={`flex items-center justify-between bg-white border rounded-xl p-3 shadow-3xs hover:border-neutral-300 transition-all ${
                                        milestone.completed ? "bg-emerald-50/10 border-emerald-100" : "border-neutral-200"
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 min-w-0">
                                        <button
                                          onClick={() => handleToggleMilestone(goal.id, milestone.id)}
                                          className="text-neutral-400 hover:text-neutral-900 transition-colors shrink-0 cursor-pointer"
                                        >
                                          {milestone.completed ? (
                                            <CheckCircle className="w-4.5 h-4.5 text-emerald-600 fill-emerald-50" />
                                          ) : (
                                            <Circle className="w-4.5 h-4.5 text-neutral-300 hover:text-neutral-400" />
                                          )}
                                        </button>
                                        <span className={`text-xs font-bold truncate ${
                                          milestone.completed ? "line-through text-neutral-400 font-semibold" : "text-neutral-800"
                                        }`} title={milestone.title}>
                                          {milestone.title}
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        {milestone.dueDate && (
                                          <span className="text-[9px] bg-neutral-100 text-neutral-500 font-bold font-mono px-2 py-0.5 rounded-md border border-neutral-200/80 flex items-center gap-1">
                                            <CalendarDays className="w-2.5 h-2.5" />
                                            <span>{milestone.dueDate}</span>
                                          </span>
                                        )}
                                        
                                        <button
                                          onClick={() => handleDeleteMilestone(goal.id, milestone.id)}
                                          className="text-neutral-300 hover:text-red-500 p-1 rounded hover:bg-neutral-50 transition-colors cursor-pointer"
                                          title="Supprimer ce jalon"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Form to add a new milestone to this goal */}
                              <form 
                                onSubmit={(e) => handleAddMilestone(e, goal.id)}
                                className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col md:flex-row items-end gap-3 max-w-2xl"
                              >
                                <div className="space-y-1.5 flex-1 w-full">
                                  <label className="text-[10px] font-black text-neutral-400 uppercase">Nouvelle Étape / Jalon Mesurable</label>
                                  <input 
                                    type="text"
                                    required
                                    placeholder="Ex: Obtenir la validation du nom de domaine"
                                    value={newMilestoneTitle}
                                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-neutral-900"
                                  />
                                </div>

                                <div className="space-y-1.5 w-full md:w-44">
                                  <label className="text-[10px] font-black text-neutral-400 uppercase">Date Cible (Optionnel)</label>
                                  <input 
                                    type="date"
                                    value={newMilestoneDueDate}
                                    onChange={(e) => setNewMilestoneDueDate(e.target.value)}
                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-neutral-900 cursor-pointer"
                                  />
                                </div>

                                <button
                                  type="submit"
                                  className="bg-neutral-900 hover:bg-neutral-800 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1 cursor-pointer transition-colors shrink-0 shadow-3xs h-9 w-full md:w-auto justify-center"
                                >
                                  <PlusCircle className="w-4 h-4" />
                                  <span>Ajouter Jalon</span>
                                </button>
                              </form>

                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
