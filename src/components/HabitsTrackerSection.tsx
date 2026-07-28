import React, { useState } from "react";
import { DailyHabit } from "../types";
import DisciplineHeatmap from "./DisciplineHeatmap";
import InteractiveModuleTable from "./InteractiveModuleTable";
import { 
  Flame, 
  Table, 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Tag, 
  ListPlus,
  HelpCircle,
  X,
  Target,
  BarChart3
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface HabitsTrackerSectionProps {
  dailyHabits: DailyHabit[];
  setDailyHabits: React.Dispatch<React.SetStateAction<DailyHabit[]>>;
  habitHistory: Record<string, string[]>;
  setHabitHistory: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
  streakCount: number;
  getModuleConfig: (moduleId: string) => any;
}

const PRESET_HABITS = [
  { name: "🏃 30 min de Sport / Workout", category: "Health", frequency: "Quotidien", description: "Entraînement physique, musculation ou cardio", isImportant: true },
  { name: "📚 20 min de Lecture", category: "Mental", frequency: "Quotidien", description: "Lecture enrichissante business ou dev perso", isImportant: false },
  { name: "💧 Boire 2L d'Eau", category: "Health", frequency: "Quotidien", description: "Hydratation optimale quotidienne", isImportant: false },
  { name: "🧘 10 min de Méditation", category: "Mental", frequency: "Quotidien", description: "Exercice de respiration et pleine conscience", isImportant: false },
  { name: "💻 Session Deep Work (1h)", category: "Career", frequency: "Quotidien", description: "Focus total sur le projet prioritaire sans distractions", isImportant: true },
  { name: "📊 Check Portefeuille / Bourse", category: "Finance", frequency: "Hebdomadaire", description: "Revue des budgets, épargne et investissements", isImportant: true },
  { name: "🧴 Routine Soins / Skincare", category: "Personal", frequency: "Quotidien", description: "Soins du visage matin et soir", isImportant: false }
];

export default function HabitsTrackerSection({
  dailyHabits,
  setDailyHabits,
  habitHistory,
  setHabitHistory,
  streakCount,
  getModuleConfig
}: HabitsTrackerSectionProps) {
  const [activeTab, setActiveTab] = useState<"heatmap" | "table">("heatmap");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<string>("Health");
  const [frequency, setFrequency] = useState<string>("Quotidien");
  const [dueTime, setDueTime] = useState("");
  const [description, setDescription] = useState("");
  const [isImportant, setIsImportant] = useState(false);

  const handleAddHabit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) return;

    const newHabit: DailyHabit = {
      id: "h_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      name: name.trim(),
      category,
      frequency,
      description: description.trim(),
      dueTime: dueTime.trim() || undefined,
      isImportant,
      completed: false
    };

    setDailyHabits(prev => [newHabit, ...prev]);

    // Reset Form
    setName("");
    setDescription("");
    setDueTime("");
    setIsImportant(false);
    setIsFormOpen(false);
  };

  const handleAddPreset = (preset: typeof PRESET_HABITS[0]) => {
    // Check if habit with same name already exists
    if (dailyHabits.some(h => h.name.toLowerCase() === preset.name.toLowerCase())) {
      return;
    }

    const newHabit: DailyHabit = {
      id: "h_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      name: preset.name,
      category: preset.category,
      frequency: preset.frequency,
      description: preset.description,
      isImportant: preset.isImportant,
      completed: false
    };

    setDailyHabits(prev => [newHabit, ...prev]);
  };

  const handleDeleteHabit = (id: string) => {
    setDailyHabits(prev => prev.filter(h => h.id !== id));
  };

  const habitsConfig = getModuleConfig("habits");

  return (
    <div className="space-y-6">
      
      {/* QUICK SAISIE HEADER BANNER */}
      <div className="bg-gradient-to-r from-neutral-900 via-indigo-950 to-neutral-900 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 text-white rounded-3xl p-6 shadow-md border border-neutral-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="bg-indigo-500/20 text-indigo-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-indigo-500/30 font-mono tracking-wider">
                Module Saisie & Suivi
              </span>
              <span className="bg-amber-500/20 text-amber-300 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border border-amber-500/30 font-mono tracking-wider">
                {dailyHabits.length} Habitudes Actives
              </span>
            </div>

            <h2 className="text-xl md:text-2xl font-black tracking-tight uppercase flex items-center gap-2">
              <Flame className="w-6 h-6 text-amber-400" />
              Saisie & Gestion des Habitudes
            </h2>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Inscrivez vos routines quotidiennes, hebdomadaires et mensuelles. Vous pouvez saisir de nouvelles habitudes manuellement, importer votre liste via Excel, ou utiliser nos modèles d'habitudes d'élite pré-configurés.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setIsFormOpen(!isFormOpen)}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs px-4 py-3 rounded-2xl shadow-md transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              {isFormOpen ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{isFormOpen ? "Fermer le Formulaire" : "+ Saisir une Habitude"}</span>
            </button>

            <div className="flex items-center bg-neutral-800/80 p-1 rounded-2xl border border-neutral-700/60">
              <button
                onClick={() => setActiveTab("heatmap")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "heatmap"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Flame className="w-4 h-4" />
                <span>Heatmap & Bilan</span>
              </button>

              <button
                onClick={() => setActiveTab("table")}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "table"
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Table className="w-4 h-4" />
                <span>Tableau de Saisie ({dailyHabits.length})</span>
              </button>
            </div>
          </div>

        </div>

        {/* PRESET QUICK ADD BAR */}
        <div className="mt-5 pt-4 border-t border-neutral-800/80 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-extrabold uppercase text-neutral-400 font-mono tracking-wider">
              Ajout Rapide 1-Click (Modèles d'élite) :
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {PRESET_HABITS.map((preset, idx) => {
              const exists = dailyHabits.some(h => h.name.toLowerCase() === preset.name.toLowerCase());
              return (
                <button
                  key={idx}
                  disabled={exists}
                  onClick={() => handleAddPreset(preset)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                    exists
                      ? "bg-neutral-800/40 border-neutral-800 text-neutral-500 cursor-not-allowed opacity-60"
                      : "bg-neutral-800/80 border-neutral-700/80 text-neutral-200 hover:bg-neutral-700 hover:text-white hover:border-indigo-500/50"
                  }`}
                  title={exists ? "Déjà ajoutée" : preset.description}
                >
                  {exists ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Plus className="w-3 h-3 text-indigo-400" />}
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* FORMULAR MODAL / EXPANDABLE SECTION */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className="overflow-hidden"
          >
            <form 
              onSubmit={handleAddHabit}
              className="bg-white dark:bg-zinc-900 border border-indigo-200 dark:border-indigo-900/60 rounded-3xl p-6 shadow-lg space-y-5"
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <ListPlus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-tight">
                    Saisie d'une Nouvelle Habitude ou Routine
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Name */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-mono">
                    Nom de l'Habitude <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Lecture 20 min, Boire 2L d'eau, Séance Sport, Méditation..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-mono">
                    Catégorie
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="Health">Santé & Forme (Health)</option>
                    <option value="Career">Carrière & Business (Career)</option>
                    <option value="Mental">Mental & Discipline (Mental)</option>
                    <option value="Personal">Vie Personnelle (Personal)</option>
                    <option value="Finance">Finances (Finance)</option>
                  </select>
                </div>

                {/* Frequency */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-mono">
                    Fréquence
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="Quotidien">Quotidien (Chaque jour)</option>
                    <option value="Hebdomadaire">Hebdomadaire (1x / semaine)</option>
                    <option value="Mensuel">Mensuel (1x / mois)</option>
                  </select>
                </div>

                {/* Due Time */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-mono">
                    Heure Limite (Rappel optionnel)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 08:00, 12:30, 21:00"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

                {/* Is Important */}
                <div className="space-y-1.5 flex flex-col justify-end">
                  <label className="flex items-center gap-2.5 p-2.5 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl cursor-pointer hover:bg-neutral-100 dark:hover:bg-zinc-800/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={isImportant}
                      onChange={(e) => setIsImportant(e.target.checked)}
                      className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-neutral-300"
                    />
                    <span className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200">
                      ⭐ Habitude Clé / Importante
                    </span>
                  </label>
                </div>

                {/* Description */}
                <div className="space-y-1.5 md:col-span-3">
                  <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider font-mono">
                    Description / Objectif / Consigne
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 2 chapitres avant de dormir, ou courir 5km le matin..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                  />
                </div>

              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-neutral-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs px-5 py-2.5 rounded-xl shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enregistrer l'Habitude</span>
                </button>
              </div>

            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN VIEW CONTENT */}
      {activeTab === "heatmap" ? (
        <DisciplineHeatmap
          habitHistory={habitHistory}
          setHabitHistory={setHabitHistory}
          dailyHabitsList={dailyHabits}
          streakCount={streakCount}
          onAddHabit={(newHabit) => setDailyHabits(prev => [newHabit, ...prev])}
          onDeleteHabit={handleDeleteHabit}
        />
      ) : (
        <div>
          {habitsConfig && (
            <InteractiveModuleTable
              title={habitsConfig.title}
              description={habitsConfig.description}
              columns={habitsConfig.columns}
              data={habitsConfig.data}
              onAdd={habitsConfig.onAdd}
              onEdit={habitsConfig.onEdit}
              onDelete={habitsConfig.onDelete}
              onImport={habitsConfig.onImport}
              placeholderText="Rechercher une habitude..."
            />
          )}
        </div>
      )}

    </div>
  );
}
