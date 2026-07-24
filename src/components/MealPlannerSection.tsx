import React, { useState, useMemo } from "react";
import { 
  Utensils, 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Circle, 
  Flame, 
  Sun, 
  Moon, 
  Coffee, 
  Apple, 
  Sparkles, 
  X, 
  Calendar,
  ChefHat,
  Copy,
  Clock,
  BookOpen
} from "lucide-react";
import { MealPlanner } from "../types";

interface MealPlannerSectionProps {
  mealPlanners: MealPlanner[];
  setMealPlanners: React.Dispatch<React.SetStateAction<MealPlanner[]>>;
}

const DAYS_OF_WEEK = [
  "Lundi", 
  "Mardi", 
  "Mercredi", 
  "Jeudi", 
  "Vendredi", 
  "Samedi", 
  "Dimanche"
] as const;

const MEAL_TYPES = [
  "Petit Déjeuner", 
  "Déjeuner", 
  "Dîner", 
  "Collation"
] as const;

export default function MealPlannerSection({
  mealPlanners,
  setMealPlanners
}: MealPlannerSectionProps) {
  const [selectedDay, setSelectedDay] = useState<string>("Tous");
  const [selectedMealType, setSelectedMealType] = useState<string>("Tous");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MealPlanner | null>(null);

  // Form State
  const [dayOfWeek, setDayOfWeek] = useState<MealPlanner["dayOfWeek"]>("Lundi");
  const [mealType, setMealType] = useState<MealPlanner["mealType"]>("Déjeuner");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [recipeNotes, setRecipeNotes] = useState("");
  const [calories, setCalories] = useState<number | "">(500);
  const [prepTimeMinutes, setPrepTimeMinutes] = useState<number | "">(20);
  const [prepared, setPrepared] = useState(false);

  // Reset or fill form
  const openAddModal = (day?: MealPlanner["dayOfWeek"]) => {
    setEditingItem(null);
    setDayOfWeek(day || (selectedDay !== "Tous" ? (selectedDay as MealPlanner["dayOfWeek"]) : "Lundi"));
    setMealType("Déjeuner");
    setDescription("");
    setIngredients("");
    setRecipeNotes("");
    setCalories(500);
    setPrepTimeMinutes(20);
    setPrepared(false);
    setIsModalOpen(true);
  };

  const openEditModal = (item: MealPlanner) => {
    setEditingItem(item);
    setDayOfWeek(item.dayOfWeek);
    setMealType(item.mealType);
    setDescription(item.description || "");
    setIngredients(item.ingredients || "");
    setRecipeNotes(item.recipeNotes || "");
    setCalories(item.calories || 0);
    setPrepTimeMinutes(item.prepTimeMinutes || 20);
    setPrepared(item.prepared);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const payload: MealPlanner = {
      id: editingItem ? editingItem.id : "meal_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      dayOfWeek,
      mealType,
      description: description.trim(),
      calories: Number(calories) || 0,
      prepared,
      ingredients: ingredients.trim() || undefined,
      recipeNotes: recipeNotes.trim() || undefined,
      prepTimeMinutes: Number(prepTimeMinutes) || undefined
    };

    if (editingItem) {
      setMealPlanners(prev => prev.map(m => m.id === editingItem.id ? payload : m));
    } else {
      setMealPlanners(prev => [...prev, payload]);
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Voulez-vous supprimer ce menu / cette recette ?")) {
      setMealPlanners(prev => prev.filter(m => m.id !== id));
    }
  };

  const handleTogglePrepared = (id: string) => {
    setMealPlanners(prev => prev.map(m => m.id === id ? { ...m, prepared: !m.prepared } : m));
  };

  const handleDuplicate = (item: MealPlanner) => {
    const newItem: MealPlanner = {
      ...item,
      id: "meal_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
      prepared: false
    };
    setMealPlanners(prev => [...prev, newItem]);
  };

  // Filtered Meals
  const filteredMeals = useMemo(() => {
    return mealPlanners.filter(meal => {
      const matchDay = selectedDay === "Tous" || meal.dayOfWeek === selectedDay;
      const matchType = selectedMealType === "Tous" || meal.mealType === selectedMealType;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery = !q || 
        meal.description.toLowerCase().includes(q) || 
        (meal.ingredients && meal.ingredients.toLowerCase().includes(q)) ||
        (meal.recipeNotes && meal.recipeNotes.toLowerCase().includes(q)) ||
        meal.dayOfWeek.toLowerCase().includes(q) ||
        meal.mealType.toLowerCase().includes(q);
      return matchDay && matchType && matchQuery;
    });
  }, [mealPlanners, selectedDay, selectedMealType, searchQuery]);

  // Stats calculation
  const totalCalories = useMemo(() => {
    return filteredMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
  }, [filteredMeals]);

  const preparedCount = useMemo(() => {
    return filteredMeals.filter(m => m.prepared).length;
  }, [filteredMeals]);

  // Grouping by Day for full-week view when "Tous" is selected
  const mealsByDay = useMemo(() => {
    const map: Record<string, MealPlanner[]> = {};
    DAYS_OF_WEEK.forEach(day => {
      map[day] = [];
    });
    filteredMeals.forEach(m => {
      if (map[m.dayOfWeek]) {
        map[m.dayOfWeek].push(m);
      }
    });
    return map;
  }, [filteredMeals]);

  // Meal Type Icon & Styles
  const getMealTypeStyle = (type: MealPlanner["mealType"]) => {
    switch (type) {
      case "Petit Déjeuner":
        return {
          icon: Coffee,
          bg: "bg-amber-50 dark:bg-amber-950/40",
          text: "text-amber-800 dark:text-amber-300",
          border: "border-amber-200 dark:border-amber-800/50"
        };
      case "Déjeuner":
        return {
          icon: Sun,
          bg: "bg-sky-50 dark:bg-sky-950/40",
          text: "text-sky-800 dark:text-sky-300",
          border: "border-sky-200 dark:border-sky-800/50"
        };
      case "Dîner":
        return {
          icon: Moon,
          bg: "bg-indigo-50 dark:bg-indigo-950/40",
          text: "text-indigo-800 dark:text-indigo-300",
          border: "border-indigo-200 dark:border-indigo-800/50"
        };
      case "Collation":
        return {
          icon: Apple,
          bg: "bg-emerald-50 dark:bg-emerald-950/40",
          text: "text-emerald-800 dark:text-emerald-300",
          border: "border-emerald-200 dark:border-emerald-800/50"
        };
      default:
        return {
          icon: Utensils,
          bg: "bg-neutral-50 dark:bg-zinc-800",
          text: "text-neutral-800 dark:text-neutral-200",
          border: "border-neutral-200 dark:border-zinc-700"
        };
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* SECTION HEADER */}
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
                <ChefHat className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
                  Planificateur de Repas & Recettes
                </h1>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Organisez vos menus de la semaine, notez vos recettes et suivez votre apport calorique dans un espace spacieux.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => openAddModal()}
              className="bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 px-5 py-3 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Menu / Recette</span>
            </button>
          </div>
        </div>

        {/* METRICS & SUMMARY CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-neutral-100 dark:border-zinc-800">
          <div className="bg-neutral-50 dark:bg-zinc-800/60 border border-neutral-200/60 dark:border-zinc-700/50 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Total Repas</span>
            <span className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mt-1 block">
              {filteredMeals.length}
            </span>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 block">menus planifiés</span>
          </div>

          <div className="bg-neutral-50 dark:bg-zinc-800/60 border border-neutral-200/60 dark:border-zinc-700/50 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Calories Totales</span>
            <span className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1 block flex items-center gap-1">
              <Flame className="w-5 h-5" />
              {totalCalories} <span className="text-xs font-normal text-neutral-500">kcal</span>
            </span>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 block">sélection actuelle</span>
          </div>

          <div className="bg-neutral-50 dark:bg-zinc-800/60 border border-neutral-200/60 dark:border-zinc-700/50 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Repas Préparés</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
              {preparedCount} / {filteredMeals.length}
            </span>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 block">
              {filteredMeals.length > 0 ? Math.round((preparedCount / filteredMeals.length) * 100) : 0}% complété
            </span>
          </div>

          <div className="bg-neutral-50 dark:bg-zinc-800/60 border border-neutral-200/60 dark:border-zinc-700/50 rounded-2xl p-4">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block font-mono">Moyenne / Repas</span>
            <span className="text-2xl font-black text-sky-600 dark:text-sky-400 mt-1 block">
              {filteredMeals.length > 0 ? Math.round(totalCalories / filteredMeals.length) : 0} <span className="text-xs font-normal text-neutral-500">kcal</span>
            </span>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 mt-0.5 block">par plat</span>
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH BAR */}
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-zinc-800 rounded-2xl p-4 space-y-4 shadow-3xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Day Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
            <button
              onClick={() => setSelectedDay("Tous")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedDay === "Tous"
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-3xs"
                  : "bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
              }`}
            >
              Tous les Jours
            </button>
            {DAYS_OF_WEEK.map(day => {
              const dayCount = mealPlanners.filter(m => m.dayOfWeek === day).length;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                    selectedDay === day
                      ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 shadow-3xs"
                      : "bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
                  }`}
                >
                  <span>{day}</span>
                  {dayCount > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                      selectedDay === day 
                        ? "bg-white/20 text-white dark:bg-black/20 dark:text-neutral-900" 
                        : "bg-neutral-200 dark:bg-zinc-700 text-neutral-700 dark:text-neutral-200"
                    }`}>
                      {dayCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Input */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher une recette, plat, ingrédient..."
              className="w-full bg-neutral-50 dark:bg-zinc-800/80 border border-neutral-200 dark:border-zinc-700 rounded-xl pl-9 pr-3 py-2 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Meal Type Filter Row */}
        <div className="flex items-center gap-2 pt-2 border-t border-neutral-100 dark:border-zinc-800/60 overflow-x-auto">
          <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mr-1">Repas:</span>
          <button
            onClick={() => setSelectedMealType("Tous")}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
              selectedMealType === "Tous" 
                ? "bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900" 
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            Tous
          </button>
          {MEAL_TYPES.map(type => (
            <button
              key={type}
              onClick={() => setSelectedMealType(type)}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                selectedMealType === type 
                  ? "bg-neutral-800 text-white dark:bg-neutral-200 dark:text-neutral-900" 
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* MEAL LISTING GRID / CARDS */}
      {selectedDay !== "Tous" ? (
        // SINGLE DAY VIEW - Spacious Cards
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <span>Menus du {selectedDay}</span>
            </h2>
            <button
              onClick={() => openAddModal(selectedDay as MealPlanner["dayOfWeek"])}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Ajouter pour {selectedDay}</span>
            </button>
          </div>

          {filteredMeals.length === 0 ? (
            <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-3xl p-12 text-center space-y-3">
              <ChefHat className="w-10 h-10 text-neutral-300 dark:text-zinc-700 mx-auto" />
              <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                Aucun menu enregistré pour {selectedDay}.
              </p>
              <button
                onClick={() => openAddModal(selectedDay as MealPlanner["dayOfWeek"])}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 rounded-xl text-xs font-bold"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un repas</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredMeals.map(meal => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  getMealTypeStyle={getMealTypeStyle}
                  onTogglePrepared={handleTogglePrepared}
                  onEdit={openEditModal}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
        // ALL DAYS VIEW - Grouped by Day
        <div className="space-y-8">
          {DAYS_OF_WEEK.map(day => {
            const dayMeals = mealsByDay[day] || [];
            const dayCals = dayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);

            if (selectedDay !== "Tous" && selectedDay !== day) return null;
            if (searchQuery && dayMeals.length === 0) return null;

            return (
              <div key={day} className="space-y-3">
                <div className="flex items-center justify-between bg-neutral-100/70 dark:bg-zinc-800/40 px-4 py-2.5 rounded-2xl border border-neutral-200/50 dark:border-zinc-700/40">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-neutral-900 dark:text-neutral-100">{day}</span>
                    <span className="text-xs text-neutral-400 font-mono">({dayMeals.length} repas)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 font-mono bg-amber-50 dark:bg-amber-950/40 px-2.5 py-0.5 rounded-lg border border-amber-200/60 dark:border-amber-800/40">
                      {dayCals} kcal
                    </span>
                    <button
                      onClick={() => openAddModal(day)}
                      className="p-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200 rounded-lg transition-all cursor-pointer"
                      title={`Ajouter un repas le ${day}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {dayMeals.length === 0 ? (
                  <div className="bg-white dark:bg-zinc-900/60 border border-dashed border-neutral-200 dark:border-zinc-800 rounded-2xl p-4 text-center">
                    <span className="text-xs text-neutral-400 italic">Aucun repas planifié pour ce jour. </span>
                    <button
                      onClick={() => openAddModal(day)}
                      className="text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:underline ml-1"
                    >
                      + Ajouter
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {dayMeals.map(meal => (
                      <MealCard
                        key={meal.id}
                        meal={meal}
                        getMealTypeStyle={getMealTypeStyle}
                        onTogglePrepared={handleTogglePrepared}
                        onEdit={openEditModal}
                        onDuplicate={handleDuplicate}
                        onDelete={handleDelete}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL FOR ADDING / EDITING MEALS & RECIPES */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in-50 zoom-in-95 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-100 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-800/30">
              <div className="flex items-center gap-2.5">
                <ChefHat className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100">
                  {editingItem ? "Modifier la Recette / Repas" : "Nouveau Menu ou Recette"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-xl transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Day of week */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                    Jour de la semaine *
                  </label>
                  <select
                    value={dayOfWeek}
                    onChange={(e) => setDayOfWeek(e.target.value as MealPlanner["dayOfWeek"])}
                    className="w-full bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-100 font-semibold focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
                  >
                    {DAYS_OF_WEEK.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                {/* Meal type */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                    Type de repas *
                  </label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value as MealPlanner["mealType"])}
                    className="w-full bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-100 font-semibold focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
                  >
                    {MEAL_TYPES.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Recipe / Description Title */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                  Nom du Plat / Menu Recette *
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Tagine de poulet aux citrons confits, Salade marocaine..."
                  className="w-full bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100 font-bold"
                />
              </div>

              {/* Ingredients / Details */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block flex items-center justify-between">
                  <span>Ingrédients & Ingrédients clés (Spacieux)</span>
                  <span className="text-[10px] text-neutral-400 font-normal">Optionnel</span>
                </label>
                <textarea
                  rows={3}
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  placeholder="Ex: 500g blanc de poulet, 2 citrons confits, olives vertes, 1 oignon, huile d'olive, gingembre..."
                  className="w-full bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
                />
              </div>

              {/* Recipe preparation notes */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block flex items-center justify-between">
                  <span>Notes & Instructions de préparation</span>
                  <span className="text-[10px] text-neutral-400 font-normal">Optionnel</span>
                </label>
                <textarea
                  rows={2}
                  value={recipeNotes}
                  onChange={(e) => setRecipeNotes(e.target.value)}
                  placeholder="Ex: Faire mariner la viande 1h à l'avance. Faire mijoter 45 min à feu doux..."
                  className="w-full bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
                />
              </div>

              {/* Calories & Prep Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                    Calories Estimées (kcal)
                  </label>
                  <input
                    type="number"
                    value={calories}
                    onChange={(e) => setCalories(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Ex: 650"
                    className="w-full bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider block">
                    Temps de Préparation (min)
                  </label>
                  <input
                    type="number"
                    value={prepTimeMinutes}
                    onChange={(e) => setPrepTimeMinutes(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="Ex: 30"
                    className="w-full bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-zinc-700 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 dark:text-neutral-100 font-mono focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-100"
                  />
                </div>
              </div>

              {/* Prepared Checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="modal_prepared_cb"
                  checked={prepared}
                  onChange={(e) => setPrepared(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-neutral-300 focus:ring-emerald-500 cursor-pointer"
                />
                <label htmlFor="modal_prepared_cb" className="text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer">
                  Marquer ce repas comme déjà préparé / cuisiné
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-100 dark:border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-zinc-800 transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-extrabold shadow-sm transition-all cursor-pointer"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// SUB-COMPONENT FOR INDIVIDUAL MEAL CARDS
interface MealCardProps {
  key?: React.Key;
  meal: MealPlanner;
  getMealTypeStyle: (type: MealPlanner["mealType"]) => any;
  onTogglePrepared: (id: string) => void;
  onEdit: (meal: MealPlanner) => void;
  onDuplicate: (meal: MealPlanner) => void;
  onDelete: (id: string) => void;
}

function MealCard({
  meal,
  getMealTypeStyle,
  onTogglePrepared,
  onEdit,
  onDuplicate,
  onDelete
}: MealCardProps) {
  const style = getMealTypeStyle(meal.mealType);
  const IconComp = style.icon;

  return (
    <div className={`bg-white dark:bg-zinc-900 border rounded-3xl p-5 shadow-xs transition-all hover:shadow-md flex flex-col justify-between gap-4 ${
      meal.prepared 
        ? "border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/10 dark:bg-emerald-950/10" 
        : "border-neutral-200/80 dark:border-zinc-800"
    }`}>
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase font-mono border ${style.bg} ${style.text} ${style.border}`}>
              <IconComp className="w-3 h-3" />
              <span>{meal.mealType}</span>
            </span>
            <span className="text-[10px] font-extrabold text-neutral-400 font-mono bg-neutral-100 dark:bg-zinc-800 px-2 py-0.5 rounded-lg">
              {meal.dayOfWeek}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400 font-mono bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg border border-amber-200/60 dark:border-amber-800/40 flex items-center gap-1">
              <Flame className="w-3 h-3 text-amber-500" />
              {meal.calories} kcal
            </span>
            {meal.prepTimeMinutes && (
              <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 font-mono bg-neutral-100 dark:bg-zinc-800 px-2 py-0.5 rounded-lg flex items-center gap-1">
                <Clock className="w-3 h-3 text-neutral-400" />
                {meal.prepTimeMinutes}m
              </span>
            )}
          </div>
        </div>

        {/* Title / Description */}
        <div>
          <h3 className="text-sm sm:text-base font-extrabold text-neutral-900 dark:text-neutral-100 leading-snug">
            {meal.description}
          </h3>
        </div>

        {/* Ingredients if provided */}
        {meal.ingredients && (
          <div className="bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-100 dark:border-zinc-800 rounded-2xl p-3 text-xs space-y-1">
            <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1 font-mono">
              <BookOpen className="w-3 h-3 text-amber-500" />
              <span>Ingrédients</span>
            </div>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans whitespace-pre-line">
              {meal.ingredients}
            </p>
          </div>
        )}

        {/* Recipe Notes if provided */}
        {meal.recipeNotes && (
          <div className="text-xs text-neutral-500 dark:text-neutral-400 italic bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100/60 dark:border-amber-900/30 rounded-xl p-2.5">
            <strong>Note :</strong> {meal.recipeNotes}
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-zinc-800/80 gap-2">
        <button
          onClick={() => onTogglePrepared(meal.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            meal.prepared 
              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60" 
              : "bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200"
          }`}
        >
          {meal.prepared ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Préparé</span>
            </>
          ) : (
            <>
              <Circle className="w-3.5 h-3.5 text-neutral-400" />
              <span>À préparer</span>
            </>
          )}
        </button>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onDuplicate(meal)}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg transition-all cursor-pointer"
            title="Dupliquer"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onEdit(meal)}
            className="p-1.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 rounded-lg transition-all cursor-pointer"
            title="Modifier"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(meal.id)}
            className="p-1.5 text-neutral-400 hover:text-red-600 rounded-lg transition-all cursor-pointer"
            title="Supprimer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
