import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Target, 
  Plus, 
  Trash2, 
  Check, 
  CalendarDays, 
  Pencil, 
  Folder, 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  Clock, 
  TrendingUp, 
  BarChart2, 
  Layers,
  Save,
  AlertCircle
} from "lucide-react";
import { ProjectFolder, ProjectObjective } from "../types";

interface FolderObjectivesModalProps {
  folder: ProjectFolder;
  onClose: () => void;
  onUpdateFolder: (updatedFolder: ProjectFolder) => void;
}

export default function FolderObjectivesModal({
  folder,
  onClose,
  onUpdateFolder
}: FolderObjectivesModalProps) {
  const [activeTab, setActiveTab] = useState<"checklist" | "kpis" | "vision">("checklist");

  // New custom objective state
  const [showAddObj, setShowAddObj] = useState(false);
  const [newObjText, setNewObjText] = useState("");
  const [newObjDueDate, setNewObjDueDate] = useState("");

  // Edit custom objective state
  const [editingObjId, setEditingObjId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editDueDate, setEditDueDate] = useState("");

  // Core Goal state
  const [isEditingCoreGoal, setIsEditingCoreGoal] = useState(false);
  const [coreGoalText, setCoreGoalText] = useState(folder.coreGoal || "");

  // Structured KPI state
  const [showAddKpi, setShowAddKpi] = useState(false);
  const [kpiTitle, setKpiTitle] = useState("");
  const [kpiTarget, setKpiTarget] = useState<number | "">("");
  const [kpiCurrent, setKpiCurrent] = useState<number | "">("");
  const [kpiUnit, setKpiUnit] = useState("");

  const customObjs = folder.customObjectives || [];
  const completedCount = customObjs.filter(o => o.completed).length;
  const totalCount = customObjs.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Handlers for Custom Objectives Checklist
  const handleToggleCustomObj = (id: string) => {
    const updated = customObjs.map(o => 
      o.id === id ? { ...o, completed: !o.completed } : o
    );
    onUpdateFolder({ ...folder, customObjectives: updated });
  };

  const handleAddCustomObj = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjText.trim()) return;

    const newObj = {
      id: "co_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      text: newObjText.trim(),
      dueDate: newObjDueDate || undefined,
      completed: false
    };

    onUpdateFolder({ ...folder, customObjectives: [...customObjs, newObj] });
    setNewObjText("");
    setNewObjDueDate("");
    setShowAddObj(false);
  };

  const handleStartEditObj = (o: { id: string; text: string; dueDate?: string }) => {
    setEditingObjId(o.id);
    setEditText(o.text);
    setEditDueDate(o.dueDate || "");
  };

  const handleSaveEditObj = (id: string) => {
    if (!editText.trim()) return;
    const updated = customObjs.map(o => 
      o.id === id ? { ...o, text: editText.trim(), dueDate: editDueDate || undefined } : o
    );
    onUpdateFolder({ ...folder, customObjectives: updated });
    setEditingObjId(null);
  };

  const handleDeleteCustomObj = (id: string) => {
    const updated = customObjs.filter(o => o.id !== id);
    onUpdateFolder({ ...folder, customObjectives: updated });
  };

  // Handler for Core Goal
  const handleSaveCoreGoal = () => {
    onUpdateFolder({ ...folder, coreGoal: coreGoalText.trim() });
    setIsEditingCoreGoal(false);
  };

  // Handlers for Structured KPIs
  const handleAddKpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kpiTitle.trim() || kpiTarget === "") return;

    const newKpi: ProjectObjective = {
      id: "kpi_" + Date.now(),
      title: kpiTitle.trim(),
      targetValue: Number(kpiTarget) || 0,
      currentValue: Number(kpiCurrent) || 0,
      unit: kpiUnit.trim() || "unités"
    };

    const updatedKpis = [...(folder.objectives || []), newKpi];
    onUpdateFolder({ ...folder, objectives: updatedKpis });
    setKpiTitle("");
    setKpiTarget("");
    setKpiCurrent("");
    setKpiUnit("");
    setShowAddKpi(false);
  };

  const handleUpdateKpiCurrent = (kpiId: string | undefined, newVal: number) => {
    if (!kpiId) return;
    const updated = (folder.objectives || []).map(k => 
      k.id === kpiId ? { ...k, currentValue: Math.max(0, newVal) } : k
    );
    onUpdateFolder({ ...folder, objectives: updated });
  };

  const handleDeleteKpi = (kpiId: string | undefined) => {
    if (!kpiId) return;
    const updated = (folder.objectives || []).filter(k => k.id !== kpiId);
    onUpdateFolder({ ...folder, objectives: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header Modal */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between shrink-0">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-indigo-400/30 font-mono tracking-wider">
                {folder.category || "Projet"}
              </span>
              {folder.statusPhase && (
                <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-amber-400/30 font-mono tracking-wider">
                  {folder.statusPhase}
                </span>
              )}
            </div>

            <h3 className="text-lg md:text-xl font-black text-white tracking-tight flex items-center gap-2 mt-1">
              <Folder className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>{folder.name}</span>
            </h3>

            <p className="text-xs text-neutral-400 line-clamp-1">
              {folder.description || "Gestion et suivi des objectifs personnalisés du dossier de projet."}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-xl transition-all cursor-pointer hover:bg-neutral-800 shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Global Progress Bar Header */}
        <div className="bg-neutral-50 dark:bg-zinc-950 px-6 py-3 border-b border-neutral-200/80 dark:border-zinc-800 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-neutral-700 dark:text-neutral-300">
            <Target className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <span>Progression des Jalons :</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{completedCount} / {totalCount} ({progressPct}%)</span>
          </div>

          <div className="w-32 md:w-48 bg-neutral-200 dark:bg-zinc-800 rounded-full h-2.5 overflow-hidden">
            <div 
              className="bg-indigo-600 dark:bg-indigo-500 h-full rounded-full transition-all duration-300" 
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-4 border-b border-neutral-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shrink-0">
          <button
            onClick={() => setActiveTab("checklist")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-t-2xl border-b-2 transition-all cursor-pointer ${
              activeTab === "checklist"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Objectifs Jalons ({customObjs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("kpis")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-t-2xl border-b-2 transition-all cursor-pointer ${
              activeTab === "kpis"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Objectifs Chiffrés / KPIs ({folder.objectives?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("vision")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-t-2xl border-b-2 transition-all cursor-pointer ${
              activeTab === "vision"
                ? "border-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/30"
                : "border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Vision & Cap</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">

          {/* TAB 1: CHECKLIST OBJECTIVES */}
          {activeTab === "checklist" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold uppercase text-neutral-800 dark:text-neutral-200 tracking-wider font-mono">
                    Checklist des Jalons Personnalisés
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Saisissez et cochez les étapes clés pour faire avancer votre projet.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddObj(!showAddObj)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Nouvel Objectif</span>
                </button>
              </div>

              {/* Form to Add Custom Objective */}
              <AnimatePresence>
                {showAddObj && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAddCustomObj}
                    className="p-4 bg-indigo-50/60 dark:bg-zinc-800/80 border border-indigo-200 dark:border-zinc-700 rounded-2xl space-y-3 overflow-hidden"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase text-indigo-900 dark:text-indigo-300 font-mono">
                        Ajouter un jalon d'objectif
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowAddObj(false)}
                        className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="sm:col-span-2">
                        <label className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 block mb-1">
                          Intitulé de l'objectif *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Publier les 5 premiers cours Udemy..."
                          value={newObjText}
                          onChange={e => setNewObjText(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 block mb-1">
                          Date Cible (Optionnelle)
                        </label>
                        <input
                          type="date"
                          value={newObjDueDate}
                          onChange={e => setNewObjDueDate(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddObj(false)}
                        className="px-3 py-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-zinc-700 rounded-xl cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs cursor-pointer"
                      >
                        Enregistrer
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* List of Custom Objectives */}
              {customObjs.length === 0 ? (
                <div className="text-center py-8 bg-neutral-50 dark:bg-zinc-950/60 border border-dashed border-neutral-200 dark:border-zinc-800 rounded-2xl p-4">
                  <Target className="w-8 h-8 text-neutral-300 dark:text-zinc-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
                    Aucun objectif jalon saisi pour ce dossier.
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    Cliquez sur "+ Nouvel Objectif" ci-dessus pour planifier vos étapes.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {customObjs.map(o => {
                    const isEditing = editingObjId === o.id;

                    if (isEditing) {
                      return (
                        <div key={o.id} className="p-3 bg-indigo-50 dark:bg-zinc-800 border border-indigo-200 dark:border-zinc-700 rounded-2xl space-y-2">
                          <span className="text-[10px] font-extrabold uppercase text-indigo-800 dark:text-indigo-300 font-mono">
                            Modifier le jalon
                          </span>
                          <div className="flex flex-col sm:flex-row gap-2">
                            <input
                              type="text"
                              value={editText}
                              onChange={e => setEditText(e.target.value)}
                              className="flex-1 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                            <input
                              type="date"
                              value={editDueDate}
                              onChange={e => setEditDueDate(e.target.value)}
                              className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-100 cursor-pointer"
                            />
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleSaveEditObj(o.id)}
                                className="bg-indigo-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer hover:bg-indigo-700"
                              >
                                Enregistrer
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingObjId(null)}
                                className="bg-neutral-200 dark:bg-zinc-700 text-neutral-700 dark:text-neutral-200 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                              >
                                Annuler
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={o.id}
                        className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                          o.completed
                            ? "bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200/80 dark:border-emerald-900/40 text-neutral-500"
                            : "bg-white dark:bg-zinc-900 border-neutral-200/80 dark:border-zinc-800 hover:border-indigo-300 text-neutral-800 dark:text-neutral-200"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0 flex-1 pr-3">
                          <button
                            onClick={() => handleToggleCustomObj(o.id)}
                            className="cursor-pointer shrink-0"
                          >
                            {o.completed ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <Circle className="w-5 h-5 text-neutral-300 dark:text-zinc-600 hover:text-indigo-600" />
                            )}
                          </button>

                          <div className="min-w-0 flex-1">
                            <span className={`text-xs font-extrabold block line-clamp-2 ${
                              o.completed ? "line-through text-neutral-400 dark:text-neutral-500" : ""
                            }`}>
                              {o.text}
                            </span>

                            {o.dueDate && (
                              <span className="text-[10px] font-mono font-bold text-neutral-400 dark:text-neutral-500 flex items-center gap-1 mt-0.5">
                                <CalendarDays className="w-3 h-3 text-indigo-500" />
                                <span>Date cible : {o.dueDate}</span>
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleStartEditObj(o)}
                            className="p-1.5 text-neutral-400 hover:text-indigo-600 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-xl cursor-pointer transition-all"
                            title="Modifier cet objectif"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomObj(o.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl cursor-pointer transition-all"
                            title="Supprimer cet objectif"
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
          )}

          {/* TAB 2: STRUCTURED KPIS */}
          {activeTab === "kpis" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold uppercase text-neutral-800 dark:text-neutral-200 tracking-wider font-mono">
                    Objectifs Chiffrés & Cibles Chiffre d'Affaires / Volume
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Fixez des cibles mesurables (ex: CA, nombre de ventes, abonnés).
                  </p>
                </div>

                <button
                  onClick={() => setShowAddKpi(!showAddKpi)}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold px-3.5 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Nouvel KPI</span>
                </button>
              </div>

              {/* Add KPI Form */}
              <AnimatePresence>
                {showAddKpi && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleAddKpi}
                    className="p-4 bg-indigo-50/60 dark:bg-zinc-800/80 border border-indigo-200 dark:border-zinc-700 rounded-2xl space-y-3 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 block mb-1">
                          Nom de l'objectif *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: Ventes Ebook, Abonnés Youtube..."
                          value={kpiTitle}
                          onChange={e => setKpiTitle(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 block mb-1">
                          Unité (MAD, Abonnés, Ventes...)
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: MAD, Ventes, Inscrits"
                          value={kpiUnit}
                          onChange={e => setKpiUnit(e.target.value)}
                          className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 block mb-1">
                          Valeur Actuelle
                        </label>
                        <input
                          type="number"
                          placeholder="0"
                          value={kpiCurrent}
                          onChange={e => setKpiCurrent(e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-neutral-600 dark:text-neutral-400 block mb-1">
                          Valeur Cible (Target) *
                        </label>
                        <input
                          type="number"
                          required
                          placeholder="Ex: 50000"
                          value={kpiTarget}
                          onChange={e => setKpiTarget(e.target.value === "" ? "" : Number(e.target.value))}
                          className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setShowAddKpi(false)}
                        className="px-3 py-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-zinc-700 rounded-xl cursor-pointer"
                      >
                        Annuler
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs cursor-pointer"
                      >
                        Enregistrer le KPI
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* List of KPIs */}
              {(!folder.objectives || folder.objectives.length === 0) ? (
                <div className="text-center py-8 bg-neutral-50 dark:bg-zinc-950/60 border border-dashed border-neutral-200 dark:border-zinc-800 rounded-2xl p-4">
                  <BarChart2 className="w-8 h-8 text-neutral-300 dark:text-zinc-600 mx-auto mb-2" />
                  <p className="text-xs font-bold text-neutral-600 dark:text-neutral-400">
                    Aucun objectif chiffré défini pour l'instant.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {folder.objectives.map((kpi, idx) => {
                    const pct = Math.min(100, Math.round(((kpi.currentValue || 0) / (kpi.targetValue || 1)) * 100));

                    return (
                      <div key={kpi.id || idx} className="p-4 bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 rounded-2xl space-y-3 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-neutral-900 dark:text-neutral-100">
                            {kpi.title}
                          </span>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-black text-indigo-600 dark:text-indigo-400">
                              {kpi.currentValue} / {kpi.targetValue} {kpi.unit} ({pct}%)
                            </span>
                            <button
                              onClick={() => handleDeleteKpi(kpi.id)}
                              className="text-neutral-400 hover:text-rose-600 cursor-pointer p-1"
                              title="Supprimer ce KPI"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Progress Bar & Quick Adjust */}
                        <div className="space-y-1.5">
                          <div className="w-full bg-neutral-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                            <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                          </div>

                          <div className="flex items-center justify-between text-[10px] font-mono text-neutral-500">
                            <span>Ajuster la valeur actuelle :</span>
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleUpdateKpiCurrent(kpi.id, (kpi.currentValue || 0) - 1)}
                                className="px-2 py-0.5 bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 dark:hover:bg-zinc-700 text-neutral-700 dark:text-neutral-200 rounded-lg font-bold cursor-pointer"
                              >
                                -1
                              </button>
                              <button
                                onClick={() => handleUpdateKpiCurrent(kpi.id, (kpi.currentValue || 0) + 1)}
                                className="px-2 py-0.5 bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 dark:hover:bg-zinc-700 text-neutral-700 dark:text-neutral-200 rounded-lg font-bold cursor-pointer"
                              >
                                +1
                              </button>
                              <button
                                onClick={() => {
                                  const val = window.prompt("Saisir la nouvelle valeur actuelle :", String(kpi.currentValue || 0));
                                  if (val !== null && !isNaN(Number(val))) {
                                    handleUpdateKpiCurrent(kpi.id, Number(val));
                                  }
                                }}
                                className="px-2.5 py-0.5 bg-indigo-600 text-white rounded-lg font-bold cursor-pointer"
                              >
                                Saisir
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: CORE GOAL & VISION */}
          {activeTab === "vision" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-extrabold uppercase text-neutral-800 dark:text-neutral-200 tracking-wider font-mono">
                    Objectif Stratégique Principal (Core Goal)
                  </h4>
                  <p className="text-[11px] text-neutral-500">
                    Définissez la vision globale et la raison d'être du projet.
                  </p>
                </div>

                {!isEditingCoreGoal && (
                  <button
                    onClick={() => setIsEditingCoreGoal(true)}
                    className="flex items-center gap-1.5 bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 text-neutral-800 dark:text-neutral-200 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    <span>Éditer</span>
                  </button>
                )}
              </div>

              {isEditingCoreGoal ? (
                <div className="p-4 bg-indigo-50/50 dark:bg-zinc-800/80 border border-indigo-200 dark:border-zinc-700 rounded-2xl space-y-3">
                  <textarea
                    rows={3}
                    value={coreGoalText}
                    onChange={e => setCoreGoalText(e.target.value)}
                    placeholder="Ex: Lancer la formation d'ici fin 2026 et générer 100k MAD de CA récurrent..."
                    className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-700 rounded-xl p-3 text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setIsEditingCoreGoal(false)}
                      className="px-3 py-1.5 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-zinc-700 rounded-xl cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleSaveCoreGoal}
                      className="flex items-center gap-1 px-4 py-1.5 text-xs font-extrabold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Enregistrer</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-neutral-50 dark:bg-zinc-950/60 border border-neutral-200/80 dark:border-zinc-800 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-extrabold text-neutral-900 dark:text-neutral-100">Cap Stratégique</span>
                  </div>
                  <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium italic">
                    {folder.coreGoal || "Aucun cap stratégique saisi. Cliquez sur 'Éditer' pour définir l'objectif principal du projet."}
                  </p>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 dark:bg-zinc-950 border-t border-neutral-200/80 dark:border-zinc-800 flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            Fermer la fenêtre
          </button>
        </div>

      </motion.div>
    </div>
  );
}
