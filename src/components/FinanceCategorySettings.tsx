import React, { useState, useEffect } from "react";
import { 
  FolderTree, Plus, Edit2, Trash2, Check, X, RotateCcw, Search, 
  Tag, ChevronRight, Layers, Sparkles, AlertCircle, Info, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getStoredTaxonomy, 
  saveStoredTaxonomy, 
  resetTaxonomyToDefaults, 
  DEFAULT_FINANCIAL_TAXONOMY,
  TAXONOMY_ICONS,
  TaxonomyCategory 
} from "../utils/taxonomy";

interface FinanceCategorySettingsProps {
  triggerToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
}

export default function FinanceCategorySettings({ triggerToast }: FinanceCategorySettingsProps) {
  const [taxonomy, setTaxonomy] = useState<Record<string, TaxonomyCategory>>(() => getStoredTaxonomy());
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // States for Inline Sub-Category Editing
  const [editingSub, setEditingSub] = useState<{ categoryKey: string; oldName: string } | null>(null);
  const [editingSubValue, setEditingSubValue] = useState("");

  // States for Adding New Sub-Category per Category
  const [newSubInputs, setNewSubInputs] = useState<Record<string, string>>({});

  // States for Adding New Main Category
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [newCatColor, setNewCatColor] = useState("indigo");
  const [newCatSubcats, setNewCatSubcats] = useState("");

  // States for Renaming Main Category
  const [editingCatKey, setEditingCatKey] = useState<string | null>(null);
  const [editingCatNameValue, setEditingCatNameValue] = useState("");

  // Synchronize on taxonomyUpdated event
  useEffect(() => {
    const handleTaxonomyUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<Record<string, TaxonomyCategory>>;
      if (customEvent.detail) {
        setTaxonomy(customEvent.detail);
      } else {
        setTaxonomy(getStoredTaxonomy());
      }
    };
    window.addEventListener("taxonomyUpdated", handleTaxonomyUpdated);
    return () => window.removeEventListener("taxonomyUpdated", handleTaxonomyUpdated);
  }, []);

  // Update input state for a specific category
  const handleSubInputChange = (catKey: string, value: string) => {
    setNewSubInputs(prev => ({ ...prev, [catKey]: value }));
  };

  // Add Sub-Category
  const handleAddSubCategory = (categoryKey: string) => {
    const rawVal = newSubInputs[categoryKey] || "";
    const trimmed = rawVal.trim();
    if (!trimmed) {
      if (triggerToast) triggerToast("Veuillez entrer un nom de sous-catégorie valide.", "warning");
      return;
    }

    const currentCat = taxonomy[categoryKey];
    if (!currentCat) return;

    if (currentCat.subCategories.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      if (triggerToast) triggerToast(`La sous-catégorie '${trimmed}' existe déjà dans '${categoryKey}'.`, "info");
      return;
    }

    const updatedSubcats = [...currentCat.subCategories, trimmed];
    const updatedTaxonomy = {
      ...taxonomy,
      [categoryKey]: {
        ...currentCat,
        subCategories: updatedSubcats
      }
    };

    setTaxonomy(updatedTaxonomy);
    saveStoredTaxonomy(updatedTaxonomy);
    setNewSubInputs(prev => ({ ...prev, [categoryKey]: "" }));

    if (triggerToast) {
      triggerToast(`Sous-catégorie '${trimmed}' ajoutée à '${categoryKey}' avec succès.`, "success");
    }
  };

  // Start Editing Sub-Category
  const handleStartEditSub = (categoryKey: string, subName: string) => {
    setEditingSub({ categoryKey, oldName: subName });
    setEditingSubValue(subName);
  };

  // Save Edited Sub-Category
  const handleSaveEditSub = () => {
    if (!editingSub) return;
    const { categoryKey, oldName } = editingSub;
    const trimmed = editingSubValue.trim();

    if (!trimmed) {
      if (triggerToast) triggerToast("Le nom de la sous-catégorie ne peut pas être vide.", "warning");
      return;
    }

    const currentCat = taxonomy[categoryKey];
    if (!currentCat) return;

    // Check duplicate
    if (oldName.toLowerCase() !== trimmed.toLowerCase() && currentCat.subCategories.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
      if (triggerToast) triggerToast(`La sous-catégorie '${trimmed}' existe déjà dans cette catégorie.`, "warning");
      return;
    }

    const updatedSubcats = currentCat.subCategories.map(s => s === oldName ? trimmed : s);
    const updatedTaxonomy = {
      ...taxonomy,
      [categoryKey]: {
        ...currentCat,
        subCategories: updatedSubcats
      }
    };

    setTaxonomy(updatedTaxonomy);
    saveStoredTaxonomy(updatedTaxonomy);
    setEditingSub(null);
    setEditingSubValue("");

    if (triggerToast) {
      triggerToast(`Sous-catégorie renommé de '${oldName}' vers '${trimmed}'.`, "success");
    }
  };

  // Delete Sub-Category
  const handleDeleteSubCategory = (categoryKey: string, subName: string) => {
    const currentCat = taxonomy[categoryKey];
    if (!currentCat) return;

    if (currentCat.subCategories.length <= 1) {
      if (triggerToast) triggerToast("Chaque catégorie doit conserver au moins une sous-catégorie.", "warning");
      return;
    }

    const updatedSubcats = currentCat.subCategories.filter(s => s !== subName);
    const updatedTaxonomy = {
      ...taxonomy,
      [categoryKey]: {
        ...currentCat,
        subCategories: updatedSubcats
      }
    };

    setTaxonomy(updatedTaxonomy);
    saveStoredTaxonomy(updatedTaxonomy);

    if (triggerToast) {
      triggerToast(`Sous-catégorie '${subName}' supprimée de '${categoryKey}'.`, "info");
    }
  };

  // Start Editing Category Name
  const handleStartEditCategory = (catKey: string) => {
    setEditingCatKey(catKey);
    setEditingCatNameValue(taxonomy[catKey]?.label || catKey);
  };

  // Save Category Name
  const handleSaveEditCategory = () => {
    if (!editingCatKey) return;
    const trimmed = editingCatNameValue.trim();
    if (!trimmed) {
      if (triggerToast) triggerToast("Le nom de la catégorie ne peut pas être vide.", "warning");
      return;
    }

    const oldCatObj = taxonomy[editingCatKey];
    if (!oldCatObj) return;

    const updatedTaxonomy = { ...taxonomy };
    delete updatedTaxonomy[editingCatKey];
    updatedTaxonomy[trimmed] = {
      ...oldCatObj,
      label: trimmed
    };

    setTaxonomy(updatedTaxonomy);
    saveStoredTaxonomy(updatedTaxonomy);
    setEditingCatKey(null);
    setEditingCatNameValue("");

    if (triggerToast) {
      triggerToast(`Catégorie modifiée : '${trimmed}'.`, "success");
    }
  };

  // Delete Main Category
  const handleDeleteCategory = (categoryKey: string) => {
    if (Object.keys(DEFAULT_FINANCIAL_TAXONOMY).includes(categoryKey)) {
      if (triggerToast) triggerToast("Les catégories système par défaut ne peuvent pas être supprimées.", "warning");
      return;
    }

    const updatedTaxonomy = { ...taxonomy };
    delete updatedTaxonomy[categoryKey];

    setTaxonomy(updatedTaxonomy);
    saveStoredTaxonomy(updatedTaxonomy);

    if (triggerToast) {
      triggerToast(`Catégorie '${categoryKey}' supprimée.`, "info");
    }
  };

  // Add New Category
  const handleCreateNewCategory = () => {
    const trimmed = newCatName.trim();
    if (!trimmed) {
      if (triggerToast) triggerToast("Veuillez saisir un nom de catégorie.", "warning");
      return;
    }

    if (taxonomy[trimmed]) {
      if (triggerToast) triggerToast(`La catégorie '${trimmed}' existe déjà.`, "warning");
      return;
    }

    const subList = newCatSubcats
      .split(",")
      .map(s => s.trim())
      .filter(s => s.length > 0);
    if (subList.length === 0) subList.push("Général");

    const updatedTaxonomy = {
      ...taxonomy,
      [trimmed]: {
        label: trimmed,
        color: newCatColor,
        subCategories: Array.from(new Set(subList))
      }
    };

    setTaxonomy(updatedTaxonomy);
    saveStoredTaxonomy(updatedTaxonomy);
    setIsAddCatModalOpen(false);
    setNewCatName("");
    setNewCatSubcats("");

    if (triggerToast) {
      triggerToast(`Nouvelle catégorie '${trimmed}' créée avec succès !`, "success");
    }
  };

  // Reset Taxonomy
  const handleReset = () => {
    const def = resetTaxonomyToDefaults();
    setTaxonomy(def);
    if (triggerToast) {
      triggerToast("Arborescence des catégories réinitialisée aux valeurs par défaut.", "info");
    }
  };

  // Filter categories by search
  const filteredCategoryKeys = Object.keys(taxonomy).filter(catKey => {
    const catObj = taxonomy[catKey];
    const q = searchQuery.toLowerCase();
    if (!q) return true;
    if (catKey.toLowerCase().includes(q)) return true;
    if (catObj.label.toLowerCase().includes(q)) return true;
    return catObj.subCategories.some(sub => sub.toLowerCase().includes(q));
  });

  // Color mappings
  const getColorClasses = (color: string) => {
    switch (color) {
      case "emerald":
        return {
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          text: "text-emerald-700",
          badge: "bg-emerald-100 text-emerald-800",
          ring: "focus:ring-emerald-500",
          button: "bg-emerald-600 hover:bg-emerald-500 text-white"
        };
      case "amber":
        return {
          bg: "bg-amber-50",
          border: "border-amber-200",
          text: "text-amber-700",
          badge: "bg-amber-100 text-amber-800",
          ring: "focus:ring-amber-500",
          button: "bg-amber-600 hover:bg-amber-500 text-white"
        };
      case "rose":
        return {
          bg: "bg-rose-50",
          border: "border-rose-200",
          text: "text-rose-700",
          badge: "bg-rose-100 text-rose-800",
          ring: "focus:ring-rose-500",
          button: "bg-rose-600 hover:bg-rose-500 text-white"
        };
      case "cyan":
        return {
          bg: "bg-cyan-50",
          border: "border-cyan-200",
          text: "text-cyan-700",
          badge: "bg-cyan-100 text-cyan-800",
          ring: "focus:ring-cyan-500",
          button: "bg-cyan-600 hover:bg-cyan-500 text-white"
        };
      default:
        return {
          bg: "bg-indigo-50",
          border: "border-indigo-200",
          text: "text-indigo-700",
          badge: "bg-indigo-100 text-indigo-800",
          ring: "focus:ring-indigo-500",
          button: "bg-indigo-600 hover:bg-indigo-500 text-white"
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Search Bar */}
      <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shrink-0">
              <FolderTree className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-neutral-900 tracking-tight flex items-center gap-2">
                <span>Paramètres des Catégories & Sous-Catégories</span>
                <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-2 py-0.5 rounded-full uppercase">
                  Personnalisable
                </span>
              </h3>
              <p className="text-xs text-neutral-500">
                Gérez vos sous-catégories pour affiner le suivi de vos budgets, dépenses, revenus et objectifs d'épargne.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsAddCatModalOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-2xl shadow-xs transition-all flex items-center gap-2 cursor-pointer border border-indigo-400/30 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Nouvelle Catégorie</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              className="px-3.5 py-2.5 bg-neutral-100 hover:bg-rose-50 hover:text-rose-600 text-neutral-600 font-bold text-xs rounded-2xl border border-neutral-200 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Réinitialiser toutes les catégories et sous-catégories aux valeurs par défaut"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Réinitialiser</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Info Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-neutral-100">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une catégorie ou sous-catégorie..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:border-indigo-400 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-neutral-500 italic bg-neutral-50 px-3 py-1.5 rounded-xl border border-neutral-100">
            <Info className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>Les sous-catégories créées ici s'affichent automatiquement dans le Guichet Unique de Saisie.</span>
          </div>
        </div>
      </div>

      {/* Salary Payday Cycle Configuration Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white rounded-3xl p-5 shadow-md border border-emerald-800/40 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-white tracking-tight flex items-center gap-2">
                <span>Cycle Mensuel de Salaire & Date de Paie</span>
                <span className="text-[10px] bg-emerald-400/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  27 - 28 du Mois
                </span>
              </h4>
              <p className="text-xs text-emerald-200/80">
                Prise en compte enregistrée : Vos versements de salaire s'effectuent les <strong>27 et 28 de chaque mois</strong>. Les nouveaux flux de paie sont automatiquement positionnés sur cette échéance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-emerald-950/60 p-2 rounded-2xl border border-emerald-800/50 shrink-0">
            <span className="text-xs font-extrabold text-emerald-300">Jour de Paie :</span>
            <span className="text-xs font-black bg-emerald-500 text-slate-950 px-2.5 py-1 rounded-xl">
              27 - 28 du mois
            </span>
          </div>
        </div>
      </div>

      {/* Categories & Subcategories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredCategoryKeys.map(catKey => {
          const catObj = taxonomy[catKey];
          const isSystemDefault = Object.keys(DEFAULT_FINANCIAL_TAXONOMY).includes(catKey);
          const IconComp = TAXONOMY_ICONS[catKey] || Tag;
          const colorStyle = getColorClasses(catObj.color);
          const isExpanded = expandedCategory === catKey || searchQuery.length > 0;

          return (
            <motion.div
              key={catKey}
              layout
              className="bg-white border border-neutral-200/90 rounded-3xl p-5 shadow-xs hover:border-neutral-300 transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Category Card Header */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl ${colorStyle.bg} border ${colorStyle.border} flex items-center justify-center ${colorStyle.text} shrink-0`}>
                      <IconComp className="w-5 h-5" />
                    </div>

                    <div>
                      {editingCatKey === catKey ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editingCatNameValue}
                            onChange={e => setEditingCatNameValue(e.target.value)}
                            className="px-2 py-1 text-xs font-black border border-indigo-300 rounded-lg bg-white focus:outline-hidden"
                            autoFocus
                          />
                          <button
                            onClick={handleSaveEditCategory}
                            className="p-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                            title="Enregistrer"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingCatKey(null)}
                            className="p-1.5 bg-neutral-200 text-neutral-600 rounded-lg hover:bg-neutral-300 cursor-pointer"
                            title="Annuler"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <h4 className="text-sm font-black text-neutral-900 tracking-tight flex items-center gap-2">
                          <span>{catObj.label || catKey}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${colorStyle.badge}`}>
                            {catObj.subCategories.length} sous-catégories
                          </span>
                        </h4>
                      )}
                      <p className="text-[11px] text-neutral-400">
                        {isSystemDefault ? "Catégorie Système" : "Catégorie Personnalisée"}
                      </p>
                    </div>
                  </div>

                  {/* Actions for Category Header */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleStartEditCategory(catKey)}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                      title="Renommer la catégorie"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {!isSystemDefault && (
                      <button
                        onClick={() => handleDeleteCategory(catKey)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                        title="Supprimer la catégorie personnalisée"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Subcategories List */}
                <div className="space-y-2">
                  <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider block">
                    Sous-catégories actives :
                  </span>

                  <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto pr-1">
                    {catObj.subCategories.map(subName => {
                      const isBeingEdited = editingSub?.categoryKey === catKey && editingSub?.oldName === subName;

                      if (isBeingEdited) {
                        return (
                          <div
                            key={subName}
                            className="flex items-center gap-1.5 bg-indigo-50 border border-indigo-300 px-2 py-1 rounded-xl shadow-2xs"
                          >
                            <input
                              type="text"
                              value={editingSubValue}
                              onChange={e => setEditingSubValue(e.target.value)}
                              className="px-2 py-0.5 text-xs font-bold text-neutral-900 bg-white border border-indigo-300 rounded-md focus:outline-hidden"
                              autoFocus
                              onKeyDown={e => {
                                if (e.key === "Enter") handleSaveEditSub();
                                if (e.key === "Escape") setEditingSub(null);
                              }}
                            />
                            <button
                              onClick={handleSaveEditSub}
                              className="p-1 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 cursor-pointer"
                              title="Valider"
                            >
                              <Check className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setEditingSub(null)}
                              className="p-1 bg-neutral-200 text-neutral-600 rounded-md hover:bg-neutral-300 cursor-pointer"
                              title="Annuler"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={subName}
                          className="group inline-flex items-center gap-1.5 text-xs font-semibold bg-neutral-50 hover:bg-indigo-50/70 border border-neutral-200/80 hover:border-indigo-200 text-neutral-800 px-3 py-1.5 rounded-xl transition-all shadow-3xs"
                        >
                          <Tag className="w-3 h-3 text-neutral-400 group-hover:text-indigo-500" />
                          <span>{subName}</span>

                          <div className="flex items-center gap-1 ml-1 opacity-60 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleStartEditSub(catKey, subName)}
                              className="p-0.5 text-neutral-400 hover:text-indigo-600 transition-colors cursor-pointer"
                              title="Éditer la sous-catégorie"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            {catObj.subCategories.length > 1 && (
                              <button
                                onClick={() => handleDeleteSubCategory(catKey, subName)}
                                className="p-0.5 text-neutral-400 hover:text-rose-600 transition-colors cursor-pointer"
                                title="Supprimer la sous-catégorie"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Add New Subcategory Form for this Card */}
              <div className="pt-3 border-t border-neutral-100">
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleAddSubCategory(catKey);
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder="Ajouter une sous-catégorie..."
                    value={newSubInputs[catKey] || ""}
                    onChange={e => handleSubInputChange(catKey, e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-xl font-medium focus:bg-white focus:outline-hidden focus:border-indigo-400 transition-all"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0 shadow-3xs active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Ajouter</span>
                  </button>
                </form>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal for Creating New Main Category */}
      <AnimatePresence>
        {isAddCatModalOpen && (
          <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-5"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <Plus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-neutral-900 tracking-tight">
                      Créer une nouvelle Catégorie Principale
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Ajoutez un grand pôle de gestion financière avec ses sous-catégories.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsAddCatModalOpen(false)}
                  className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-800 font-bold mb-1">
                    Nom de la Catégorie <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Prestations Freelance, Santé & Animaux, etc."
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-medium focus:bg-white focus:outline-hidden focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-neutral-800 font-bold mb-1">
                    Couleur de la Carte
                  </label>
                  <select
                    value={newCatColor}
                    onChange={e => setNewCatColor(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-bold text-neutral-800 focus:bg-white"
                  >
                    <option value="indigo">Indigo / Violet (Général)</option>
                    <option value="emerald">Émeraude / Vert (Revenus / Gain)</option>
                    <option value="rose">Rose / Rouge (Dépenses / Coûts)</option>
                    <option value="amber">Ambre / Orange (Charges / Fixe)</option>
                    <option value="cyan">Cyan / Bleu (Investissement / Actif)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-800 font-bold mb-1">
                    Sous-catégories initiales (séparées par des virgules)
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Logiciels, Formations, Abonnements Pro"
                    value={newCatSubcats}
                    onChange={e => setNewCatSubcats(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-medium focus:bg-white focus:outline-hidden focus:border-indigo-500"
                  />
                  <span className="text-[11px] text-neutral-400 mt-1 block">
                    Laissez vide pour générer automatiquement une sous-catégorie 'Général'.
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setIsAddCatModalOpen(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold cursor-pointer transition-all"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewCategory}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-extrabold cursor-pointer transition-all shadow-xs"
                >
                  Créer la Catégorie
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
