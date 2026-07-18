import React, { useState, useEffect } from "react";
import { SkinTracker } from "../types";
import { 
  Sparkles, 
  Calendar, 
  Droplet, 
  Plus, 
  Trash2, 
  Camera, 
  Upload, 
  Check, 
  Info,
  Sliders,
  Sun,
  Moon,
  ArrowUp,
  ArrowDown,
  Edit2,
  Save,
  X,
  RotateCcw
} from "lucide-react";

export interface RoutineStep {
  id: string;
  period: "morning" | "evening";
  stepNumber: number;
  productName: string;
  description: string;
  isActive: boolean;
}

const DEFAULT_ROUTINE_STEPS: RoutineStep[] = [
  // MATIN
  {
    id: "step_m1",
    period: "morning",
    stepNumber: 1,
    productName: "Nettoyant Doux (Cleanser)",
    description: "Élimine l'excès de sébum accumulé pendant la nuit.",
    isActive: true
  },
  {
    id: "step_m2",
    period: "morning",
    stepNumber: 2,
    productName: "Tonique Hydratant",
    description: "Rééquilibre le pH de la peau et prépare aux soins suivants.",
    isActive: true
  },
  {
    id: "step_m3",
    period: "morning",
    stepNumber: 3,
    productName: "Sérum Vitamine C (Produit A)",
    description: "Antioxydant puissant pour stimuler l'éclat et protéger du vieillissement.",
    isActive: true
  },
  {
    id: "step_m4",
    period: "morning",
    stepNumber: 4,
    productName: "Crème Hydratante Légère",
    description: "Maintient l'eau dans la barrière cutanée toute la journée.",
    isActive: true
  },
  {
    id: "step_m5",
    period: "morning",
    stepNumber: 5,
    productName: "Protection Solaire (SPF 50)",
    description: "Étape indispensable pour protéger la peau des rayons UV nocifs.",
    isActive: true
  },
  // SOIR
  {
    id: "step_e1",
    period: "evening",
    stepNumber: 1,
    productName: "Huile Nettoyante (Double Nettoyage)",
    description: "Dissout les filtres solaires (SPF), l'excès de sébum et le maquillage.",
    isActive: true
  },
  {
    id: "step_e2",
    period: "evening",
    stepNumber: 2,
    productName: "Nettoyant Moussant Purifiant",
    description: "Nettoie en profondeur à base d'eau et élimine les dernières impuretés.",
    isActive: true
  },
  {
    id: "step_e3",
    period: "evening",
    stepNumber: 3,
    productName: "Sérum Actif / Rétinol (Produit B)",
    description: "Traitement ciblé pour stimuler le renouvellement cellulaire et corriger.",
    isActive: true
  },
  {
    id: "step_e4",
    period: "evening",
    stepNumber: 4,
    productName: "Crème Riche / Crème Barrière",
    description: "Nourrit intensément et répare la barrière cutanée pendant le sommeil.",
    isActive: true
  }
];

interface SkinTrackerSectionProps {
  skinTrackers: SkinTracker[];
  setSkinTrackers: React.Dispatch<React.SetStateAction<SkinTracker[]>>;
}

// SKIN_SCAN_PRESETS removed as journal tab is disabled

export default function SkinTrackerSection({
  skinTrackers = [],
  setSkinTrackers
}: SkinTrackerSectionProps) {
  const [activeTab, setActiveTab] = useState<"routine" | "etapes">("routine");
  
  // Form states
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [morningRoutine, setMorningRoutine] = useState(true);
  const [eveningRoutine, setEveningRoutine] = useState(false);
  const [skinCondition, setSkinCondition] = useState<SkinTracker["skinCondition"]>("Bonne");
  const [productsUsed, setProductsUsed] = useState("");
  const [waterIntakeLiters, setWaterIntakeLiters] = useState(1.5);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  // --- SKINCARE ROUTINE STEPS STATES & STORAGE ---
  const [routineSteps, setRoutineSteps] = useState<RoutineStep[]>(() => {
    const saved = localStorage.getItem("la_skin_routine_steps");
    return saved ? JSON.parse(saved) : DEFAULT_ROUTINE_STEPS;
  });

  const [checkedStepsByDate, setCheckedStepsByDate] = useState<Record<string, string[]>>(() => {
    const saved = localStorage.getItem("la_skin_checked_steps_by_date");
    return saved ? JSON.parse(saved) : {};
  });

  // Edit/Create states for individual steps
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [editProductName, setEditProductName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const [newProductName, setNewProductName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPeriod, setNewPeriod] = useState<"morning" | "evening">("morning");

  // Save steps and checks to localStorage
  useEffect(() => {
    localStorage.setItem("la_skin_routine_steps", JSON.stringify(routineSteps));
  }, [routineSteps]);

  useEffect(() => {
    localStorage.setItem("la_skin_checked_steps_by_date", JSON.stringify(checkedStepsByDate));
  }, [checkedStepsByDate]);

  // Load existing log for the selected date automatically
  useEffect(() => {
    const existing = skinTrackers.find(entry => entry.date === date);
    if (existing) {
      setMorningRoutine(existing.morningRoutine);
      setEveningRoutine(existing.eveningRoutine);
      setSkinCondition(existing.skinCondition);
      setProductsUsed(existing.productsUsed === "Routine de soins" ? "" : existing.productsUsed);
      setWaterIntakeLiters(existing.waterIntakeLiters);
      setPhotoUrl(existing.photoUrl);
    } else {
      // If no entry exists, calculate from checked steps of the day or reset to defaults
      const checkedIds = checkedStepsByDate[date] || [];
      const activeMorningSteps = routineSteps.filter(s => s.period === "morning" && s.isActive);
      const activeEveningSteps = routineSteps.filter(s => s.period === "evening" && s.isActive);

      const mChecked = activeMorningSteps.length > 0 && activeMorningSteps.every(s => checkedIds.includes(s.id));
      const eChecked = activeEveningSteps.length > 0 && activeEveningSteps.every(s => checkedIds.includes(s.id));

      setMorningRoutine(mChecked);
      setEveningRoutine(eChecked);
      setSkinCondition("Bonne");
      setProductsUsed("");
      setWaterIntakeLiters(1.5);
      setPhotoUrl(undefined);
    }
  }, [date, skinTrackers]);

  // Sync checkboxes with individual steps in both directions
  const updateSkinTrackerField = <K extends keyof SkinTracker>(field: K, value: SkinTracker[K]) => {
    setSkinTrackers(prev => {
      const existing = prev.find(entry => entry.date === date);
      if (existing) {
        return prev.map(entry => {
          if (entry.date === date) {
            return { ...entry, [field]: value };
          }
          return entry;
        });
      } else {
        const newEntry: SkinTracker = {
          id: "sk_" + Date.now(),
          date,
          morningRoutine: field === "morningRoutine" ? (value as boolean) : morningRoutine,
          eveningRoutine: field === "eveningRoutine" ? (value as boolean) : eveningRoutine,
          skinCondition: field === "skinCondition" ? (value as SkinTracker["skinCondition"]) : skinCondition,
          productsUsed: "Routine de soins",
          waterIntakeLiters: field === "waterIntakeLiters" ? (value as number) : waterIntakeLiters,
          photoUrl: field === "photoUrl" ? (value as string | undefined) : photoUrl
        };
        return [newEntry, ...prev];
      }
    });
  };

  // Automatically check/uncheck individual steps inside checkedStepsByDate when skinTrackers changes
  useEffect(() => {
    let changed = false;
    const updatedCheckedSteps = { ...checkedStepsByDate };

    const activeMorningSteps = routineSteps.filter(s => s.period === "morning" && s.isActive).map(s => s.id);
    const activeEveningSteps = routineSteps.filter(s => s.period === "evening" && s.isActive).map(s => s.id);

    skinTrackers.forEach(entry => {
      const currentDate = entry.date;
      const currentList = updatedCheckedSteps[currentDate] || [];

      const morningAllChecked = activeMorningSteps.length > 0 && activeMorningSteps.every(id => currentList.includes(id));
      const eveningAllChecked = activeEveningSteps.length > 0 && activeEveningSteps.every(id => currentList.includes(id));

      let newList = [...currentList];
      let dateChanged = false;

      // If tracker says morning routine is done, but not all morning steps are checked
      if (entry.morningRoutine && !morningAllChecked) {
        newList = [...new Set([...newList, ...activeMorningSteps])];
        dateChanged = true;
      } 
      // If tracker says morning routine is NOT done, but all morning steps are checked
      else if (!entry.morningRoutine && morningAllChecked && activeMorningSteps.length > 0) {
        newList = newList.filter(id => !activeMorningSteps.includes(id));
        dateChanged = true;
      }

      // If tracker says evening routine is done, but not all evening steps are checked
      if (entry.eveningRoutine && !eveningAllChecked) {
        newList = [...new Set([...newList, ...activeEveningSteps])];
        dateChanged = true;
      }
      // If tracker says evening routine is NOT done, but all evening steps are checked
      else if (!entry.eveningRoutine && eveningAllChecked && activeEveningSteps.length > 0) {
        newList = newList.filter(id => !activeEveningSteps.includes(id));
        dateChanged = true;
      }

      if (dateChanged) {
        updatedCheckedSteps[currentDate] = newList;
        changed = true;
      }
    });

    if (changed) {
      setCheckedStepsByDate(updatedCheckedSteps);
    }
  }, [skinTrackers, routineSteps]);

  const handleToggleMorningCheckbox = (checked: boolean) => {
    setMorningRoutine(checked);
    const mSteps = routineSteps.filter(s => s.period === "morning" && s.isActive).map(s => s.id);
    
    setCheckedStepsByDate(prev => {
      const currentList = prev[date] || [];
      let newList: string[];
      if (checked) {
        newList = [...new Set([...currentList, ...mSteps])];
      } else {
        newList = currentList.filter(id => !mSteps.includes(id));
      }
      return { ...prev, [date]: newList };
    });

    updateSkinTrackerField("morningRoutine", checked);
  };

  const handleToggleEveningCheckbox = (checked: boolean) => {
    setEveningRoutine(checked);
    const eSteps = routineSteps.filter(s => s.period === "evening" && s.isActive).map(s => s.id);
    
    setCheckedStepsByDate(prev => {
      const currentList = prev[date] || [];
      let newList: string[];
      if (checked) {
        newList = [...new Set([...currentList, ...eSteps])];
      } else {
        newList = currentList.filter(id => !eSteps.includes(id));
      }
      return { ...prev, [date]: newList };
    });

    updateSkinTrackerField("eveningRoutine", checked);
  };

  const toggleStepForDate = (stepId: string, targetDate: string) => {
    setCheckedStepsByDate(prev => {
      const currentList = prev[targetDate] || [];
      const isChecked = currentList.includes(stepId);
      const newList = isChecked 
        ? currentList.filter(id => id !== stepId)
        : [...currentList, stepId];
      
      const newObj = { ...prev, [targetDate]: newList };

      // Trigger automatic sync with overall morning/evening checkboxes
      setTimeout(() => {
        const activeMorningSteps = routineSteps.filter(s => s.period === "morning" && s.isActive);
        const activeEveningSteps = routineSteps.filter(s => s.period === "evening" && s.isActive);

        const morningAllChecked = activeMorningSteps.length > 0 && activeMorningSteps.every(s => newList.includes(s.id));
        const eveningAllChecked = activeEveningSteps.length > 0 && activeEveningSteps.every(s => newList.includes(s.id));

        if (targetDate === date) {
          setMorningRoutine(morningAllChecked);
          setEveningRoutine(eveningAllChecked);
        }

        setSkinTrackers(prevTrackers => {
          const entryExists = prevTrackers.some(e => e.date === targetDate);
          if (entryExists) {
            return prevTrackers.map(entry => {
              if (entry.date === targetDate) {
                return {
                  ...entry,
                  morningRoutine: activeMorningSteps.length > 0 ? morningAllChecked : entry.morningRoutine,
                  eveningRoutine: activeEveningSteps.length > 0 ? eveningAllChecked : entry.eveningRoutine
                };
              }
              return entry;
            });
          } else {
            const newEntry: SkinTracker = {
              id: "sk_" + Date.now(),
              date: targetDate,
              morningRoutine: activeMorningSteps.length > 0 ? morningAllChecked : false,
              eveningRoutine: activeEveningSteps.length > 0 ? eveningAllChecked : false,
              skinCondition: "Bonne",
              productsUsed: "Routine de soins",
              waterIntakeLiters: 1.5
            };
            return [newEntry, ...prevTrackers];
          }
        });
      }, 0);

      return newObj;
    });
  };

  // --- ACTIONS FOR STEP CONFIGURATION ---
  const handleAddStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    const filteredSteps = routineSteps.filter(s => s.period === newPeriod);
    const nextStepNum = filteredSteps.length > 0 
      ? Math.max(...filteredSteps.map(s => s.stepNumber)) + 1 
      : 1;

    const newStep: RoutineStep = {
      id: "step_" + Date.now(),
      period: newPeriod,
      stepNumber: nextStepNum,
      productName: newProductName.trim(),
      description: newDescription.trim(),
      isActive: true
    };

    setRoutineSteps(prev => [...prev, newStep]);
    setNewProductName("");
    setNewDescription("");
  };

  const handleDeleteStep = (id: string) => {
    setRoutineSteps(prev => {
      const remaining = prev.filter(s => s.id !== id);
      const morning = remaining.filter(s => s.period === "morning").map((s, i) => ({ ...s, stepNumber: i + 1 }));
      const evening = remaining.filter(s => s.period === "evening").map((s, i) => ({ ...s, stepNumber: i + 1 }));
      return [...morning, ...evening];
    });
  };

  const handleMoveStep = (id: string, direction: "up" | "down") => {
    const stepToMove = routineSteps.find(s => s.id === id);
    if (!stepToMove) return;

    const periodSteps = routineSteps.filter(s => s.period === stepToMove.period).sort((a, b) => a.stepNumber - b.stepNumber);
    const index = periodSteps.findIndex(s => s.id === id);
    
    if (direction === "up" && index > 0) {
      const tempNum = periodSteps[index - 1].stepNumber;
      periodSteps[index - 1].stepNumber = stepToMove.stepNumber;
      stepToMove.stepNumber = tempNum;
    } else if (direction === "down" && index < periodSteps.length - 1) {
      const tempNum = periodSteps[index + 1].stepNumber;
      periodSteps[index + 1].stepNumber = stepToMove.stepNumber;
      stepToMove.stepNumber = tempNum;
    }

    // Update overall list
    setRoutineSteps([...routineSteps]);
  };

  const handleStartEditStep = (step: RoutineStep) => {
    setEditingStepId(step.id);
    setEditProductName(step.productName);
    setEditDescription(step.description);
  };

  const handleSaveEditStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProductName.trim()) return;

    setRoutineSteps(prev => prev.map(s => s.id === editingStepId ? {
      ...s,
      productName: editProductName.trim(),
      description: editDescription.trim()
    } : s));

    setEditingStepId(null);
  };

  const handleResetToDefaults = () => {
    if (window.confirm("Voulez-vous vraiment restaurer les étapes de routine par défaut ? Vos modifications seront écrasées.")) {
      setRoutineSteps(DEFAULT_ROUTINE_STEPS);
    }
  };

  // Handler to add or update a skin tracker entry
  const handleSubmitEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) return;

    const existingIndex = skinTrackers.findIndex(entry => entry.date === date);

    if (existingIndex >= 0) {
      // Update existing
      const updatedTrackers = [...skinTrackers];
      updatedTrackers[existingIndex] = {
        ...updatedTrackers[existingIndex],
        morningRoutine,
        eveningRoutine,
        skinCondition,
        productsUsed: productsUsed.trim() || "Routine de soins",
        waterIntakeLiters,
        photoUrl: photoUrl || updatedTrackers[existingIndex].photoUrl
      };
      setSkinTrackers(updatedTrackers);
    } else {
      // Create new
      const newEntry: SkinTracker = {
        id: "sk_" + Date.now(),
        date,
        morningRoutine,
        eveningRoutine,
        skinCondition,
        productsUsed: productsUsed.trim() || "Routine de soins",
        waterIntakeLiters,
        photoUrl
      };
      setSkinTrackers(prev => [newEntry, ...prev]);
    }

    // Reset form fields except date
    setProductsUsed("");
    setPhotoUrl(undefined);
  };

  // Delete an entry
  const handleDeleteEntry = (id: string) => {
    setSkinTrackers(prev => prev.filter(entry => entry.id !== id));
  };

  // Handle local image file upload and convert to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPhotoUrl(base64String);
    };
    reader.readAsDataURL(file);
  };

  // Simulate skin scan (assign colorful gradient based on condition)
  const handleSimulateScan = () => {
    const simulatedUrl = `simulated:${skinCondition}`;
    setPhotoUrl(simulatedUrl);
  };

  // Helper to format French date
  const formatFrenchDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
    } catch {
      return dateStr;
    }
  };

  // Sort skin trackers by date descending
  const sortedTrackers = [...skinTrackers].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* DOUBLE SECTION HEADER & TABS */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-600" />
            Consistance Beauté & Skin Tracker Évolutif
          </h2>
          <p className="text-xs text-neutral-400">
            Suivez quotidiennement votre routine cutanée, votre hydratation et visualisez les progrès de votre peau grâce au journal photo interactif.
          </p>
        </div>

        {/* TABS SELECTOR */}
        <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl self-start">
          <button
            onClick={() => setActiveTab("routine")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "routine"
                ? "bg-white text-neutral-950 shadow-3xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Routine & Saisie
          </button>
          <button
            onClick={() => setActiveTab("etapes")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              activeTab === "etapes"
                ? "bg-white text-neutral-950 shadow-3xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Sparkles className="w-3 h-3 text-teal-600" />
            Étapes AM/PM
          </button>
        </div>
      </div>

      {/* TAB 1: ROUTINE & SAISIE */}
      {activeTab === "routine" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* SAISIE FORM (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-neutral-50/50 border border-neutral-200/70 rounded-3xl p-6 space-y-5">
            <div className="border-b border-neutral-200/50 pb-3 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-neutral-700" />
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest font-mono">Enregistrer l'état du jour</h3>
            </div>

            <form onSubmit={handleSubmitEntry} className="space-y-4">
              {/* DATE */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Date d'Analyse</label>
                <div className="relative">
                  <input 
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 font-bold focus:outline-none focus:border-neutral-900 transition-all"
                  />
                </div>
              </div>

              {/* ROUTINES CHECKS */}
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  morningRoutine 
                    ? "bg-white border-neutral-900 text-neutral-900 shadow-3xs" 
                    : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300"
                }`}>
                  <input 
                    type="checkbox"
                    checked={morningRoutine}
                    onChange={(e) => handleToggleMorningCheckbox(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                    morningRoutine ? "bg-neutral-900 border-neutral-900 text-white" : "border-neutral-300 bg-white"
                  }`}>
                    {morningRoutine && <Check className="w-3 h-3" />}
                  </div>
                  <span className="text-[11px] font-bold">Routine Matin</span>
                </label>

                <label className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition-all ${
                  eveningRoutine 
                    ? "bg-white border-neutral-900 text-neutral-900 shadow-3xs" 
                    : "bg-white border-neutral-200 text-neutral-500 hover:border-neutral-300"
                }`}>
                  <input 
                    type="checkbox"
                    checked={eveningRoutine}
                    onChange={(e) => handleToggleEveningCheckbox(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center transition-all ${
                    eveningRoutine ? "bg-neutral-900 border-neutral-900 text-white" : "border-neutral-300 bg-white"
                  }`}>
                    {eveningRoutine && <Check className="w-3 h-3" />}
                  </div>
                  <span className="text-[11px] font-bold">Routine Soir</span>
                </label>
              </div>

              {/* SKIN CONDITION */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">État cutané ressenti</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["Excellente", "Bonne", "Sensible", "Acné/Irritée"] as const).map((cond) => {
                    const isActive = skinCondition === cond;
                    let colorClasses = "";
                    if (cond === "Excellente") colorClasses = isActive ? "bg-emerald-50 border-emerald-500 text-emerald-950 shadow-3xs" : "hover:bg-emerald-50/30 hover:border-emerald-200";
                    if (cond === "Bonne") colorClasses = isActive ? "bg-cyan-50 border-cyan-500 text-cyan-950 shadow-3xs" : "hover:bg-cyan-50/30 hover:border-cyan-200";
                    if (cond === "Sensible") colorClasses = isActive ? "bg-amber-50 border-amber-500 text-amber-950 shadow-3xs" : "hover:bg-amber-50/30 hover:border-amber-200";
                    if (cond === "Acné/Irritée") colorClasses = isActive ? "bg-rose-50 border-rose-500 text-rose-950 shadow-3xs" : "hover:bg-rose-50/30 hover:border-rose-200";

                    return (
                      <button
                        key={cond}
                        type="button"
                        onClick={() => {
                          setSkinCondition(cond);
                          updateSkinTrackerField("skinCondition", cond);
                        }}
                        className={`px-3 py-2 rounded-xl border text-[11px] font-bold transition-all text-left ${colorClasses} ${
                          isActive ? "border-2" : "bg-white border-neutral-200 text-neutral-700"
                        }`}
                      >
                        {cond}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* WATER INTAKE */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                  <span>Consommation d'eau (L)</span>
                  <span className="text-neutral-900 font-mono font-extrabold text-xs flex items-center gap-1 bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-md">
                    <Droplet className="w-3.5 h-3.5 fill-cyan-400 text-cyan-500" />
                    {waterIntakeLiters.toFixed(1)} L
                  </span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="4"
                  step="0.5"
                  value={waterIntakeLiters}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setWaterIntakeLiters(val);
                    updateSkinTrackerField("waterIntakeLiters", val);
                  }}
                  className="w-full accent-cyan-600 cursor-pointer h-1.5 bg-neutral-200 rounded-lg"
                />
              </div>

              {/* PRODUCTS USED */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Produits appliqués</label>
                <input 
                  type="text"
                  value={productsUsed}
                  onChange={(e) => setProductsUsed(e.target.value)}
                  placeholder="ex: Nettoyant, Vitamine C, SPF 50, Rétinol..."
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-all font-medium"
                />
              </div>

              {/* TODAY'S STEPS QUICK CHECKLIST */}
              <div className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-3 shadow-3xs">
                <div className="flex justify-between items-center border-b border-neutral-100 pb-2">
                  <span className="text-[10px] font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-pulse" />
                    Étapes de la journée ({formatFrenchDate(date)})
                  </span>
                  <button
                    type="button"
                    onClick={() => setActiveTab("etapes")}
                    className="text-[9px] font-bold text-teal-600 hover:text-teal-700 bg-teal-50 px-2 py-1 rounded-md transition-all cursor-pointer"
                  >
                    Gérer les étapes
                  </button>
                </div>

                <div className="space-y-3">
                  {/* MORNING QUICK PREVIEW */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-amber-600 flex items-center gap-1">
                        <Sun className="w-3.5 h-3.5 text-amber-500" /> Matin (AM)
                      </span>
                      <span className="text-neutral-500 font-mono text-[9px] bg-neutral-100 px-1.5 py-0.5 rounded-md">
                        {(checkedStepsByDate[date] || []).filter(id => routineSteps.some(s => s.id === id && s.period === "morning" && s.isActive)).length} / {routineSteps.filter(s => s.period === "morning" && s.isActive).length}
                      </span>
                    </div>
                    {routineSteps.filter(s => s.period === "morning" && s.isActive).length === 0 ? (
                      <p className="text-[9px] text-neutral-400 italic">Aucune étape définie.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {routineSteps.filter(s => s.period === "morning" && s.isActive).map(step => {
                          const isChecked = (checkedStepsByDate[date] || []).includes(step.id);
                          return (
                            <button
                              key={`quick-m-${step.id}`}
                              type="button"
                              onClick={() => toggleStepForDate(step.id, date)}
                              className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all border cursor-pointer ${
                                isChecked 
                                  ? "bg-amber-50 border-amber-300 text-amber-800" 
                                  : "bg-neutral-50 border-neutral-200 text-neutral-400 hover:bg-neutral-100"
                              }`}
                              title={step.description || step.productName}
                            >
                              {step.stepNumber}. {step.productName.split(" (")[0]}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* EVENING QUICK PREVIEW */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold">
                      <span className="text-indigo-600 flex items-center gap-1">
                        <Moon className="w-3.5 h-3.5 text-indigo-500" /> Soir (PM)
                      </span>
                      <span className="text-neutral-500 font-mono text-[9px] bg-neutral-100 px-1.5 py-0.5 rounded-md">
                        {(checkedStepsByDate[date] || []).filter(id => routineSteps.some(s => s.id === id && s.period === "evening" && s.isActive)).length} / {routineSteps.filter(s => s.period === "evening" && s.isActive).length}
                      </span>
                    </div>
                    {routineSteps.filter(s => s.period === "evening" && s.isActive).length === 0 ? (
                      <p className="text-[9px] text-neutral-400 italic">Aucune étape définie.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {routineSteps.filter(s => s.period === "evening" && s.isActive).map(step => {
                          const isChecked = (checkedStepsByDate[date] || []).includes(step.id);
                          return (
                            <button
                              key={`quick-e-${step.id}`}
                              type="button"
                              onClick={() => toggleStepForDate(step.id, date)}
                              className={`px-2 py-1 rounded-lg text-[9px] font-bold transition-all border cursor-pointer ${
                                isChecked 
                                  ? "bg-indigo-50 border-indigo-300 text-indigo-800" 
                                  : "bg-neutral-50 border-neutral-200 text-neutral-400 hover:bg-neutral-100"
                              }`}
                              title={step.description || step.productName}
                            >
                              {step.stepNumber}. {step.productName.split(" (")[0]}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ADD PHOTO (OPTIONAL) */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Photo du jour (Optionnel)</label>
                <div className="flex gap-2">
                  <label className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-2 flex items-center justify-center gap-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 cursor-pointer transition-all">
                    <Upload className="w-4 h-4 text-neutral-400" />
                    {photoUrl ? "✓ Image importée" : "Importer un selfie"}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={(e) => handleImageUpload(e)} 
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSimulateScan()}
                    className="bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-3xs"
                  >
                    <Camera className="w-4 h-4 text-amber-400" />
                    Simuler Scan
                  </button>
                </div>
              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm uppercase tracking-wider font-mono flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Valider l'Analyse du Jour
              </button>
            </form>
          </div>

          {/* TABLE LOGS (lg:col-span-7) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest font-mono">Historique des Saisies</h3>
              <span className="text-[10px] text-neutral-400 font-mono">{sortedTrackers.length} jours enregistrés</span>
            </div>

            {sortedTrackers.length === 0 ? (
              <div className="border border-neutral-100 rounded-2xl p-10 text-center text-neutral-400 italic text-xs">
                Aucune routine de soins enregistrée pour le moment.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {sortedTrackers.map((entry) => {
                  let badgeColor = "";
                  if (entry.skinCondition === "Excellente") badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";
                  if (entry.skinCondition === "Bonne") badgeColor = "bg-cyan-50 text-cyan-700 border-cyan-200";
                  if (entry.skinCondition === "Sensible") badgeColor = "bg-amber-50 text-amber-700 border-amber-200";
                  if (entry.skinCondition === "Acné/Irritée") badgeColor = "bg-rose-50 text-rose-700 border-rose-200";

                  return (
                    <div key={entry.id} className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-neutral-300 transition-all shadow-3xs">
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs font-extrabold text-neutral-900 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                            {formatFrenchDate(entry.date)}
                          </span>
                          <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full ${badgeColor}`}>
                            Peau {entry.skinCondition}
                          </span>
                          <span className="text-[10px] bg-neutral-50 text-neutral-600 px-2 py-0.5 rounded-md border border-neutral-200/50 flex items-center gap-1 font-mono">
                            <Droplet className="w-3 h-3 text-cyan-500 fill-cyan-200" />
                            {entry.waterIntakeLiters}L
                          </span>
                        </div>

                        <p className="text-xs text-neutral-500 font-semibold leading-relaxed">
                          <span className="text-neutral-400 font-bold">Produits :</span> {entry.productsUsed}
                        </p>

                        <div className="flex items-center gap-4 text-[10px] font-bold">
                          <span className={`flex items-center gap-1 ${entry.morningRoutine ? "text-neutral-900" : "text-neutral-300"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${entry.morningRoutine ? "bg-neutral-900" : "bg-neutral-200"}`} />
                            Routine Matin {entry.morningRoutine ? "Faite" : "Omise"}
                          </span>
                          <span className={`flex items-center gap-1 ${entry.eveningRoutine ? "text-neutral-900" : "text-neutral-300"}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${entry.eveningRoutine ? "bg-neutral-900" : "bg-neutral-200"}`} />
                            Routine Soir {entry.eveningRoutine ? "Faite" : "Omise"}
                          </span>
                        </div>
                      </div>

                      {/* QUICK PREVIEW / PHOTO STATUS AND DELETE */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 sm:border-l border-neutral-100 pt-3 sm:pt-0 sm:pl-4">
                        {entry.photoUrl ? (
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] text-neutral-500 font-bold font-mono">Visuel Activé</span>
                          </div>
                        ) : (
                          <span className="text-[9px] text-neutral-400 italic">Pas d'image</span>
                        )}

                        <button
                          onClick={() => handleDeleteEntry(entry.id)}
                          className="text-neutral-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-all"
                          title="Supprimer ce log"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: ÉTAPES DE MA ROUTINE */}
      {activeTab === "etapes" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* HEADER CONTROLS */}
          <div className="bg-neutral-50 border border-neutral-200/60 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600 animate-pulse" />
                Planificateur et Suivi par Étapes (AM & PM)
              </h3>
              <p className="text-xs text-neutral-500">
                Suivez et cochez vos soins à la date de votre choix. Personnalisez l'ordre et le détail de vos produits ci-dessous.
              </p>
            </div>

            {/* DATE SELECTOR & RESET */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white border border-neutral-200 rounded-xl px-3 py-1.5 shadow-3xs">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Date :</span>
                <input 
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-transparent text-xs text-neutral-900 font-bold focus:outline-none cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={handleResetToDefaults}
                className="bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-300 text-neutral-600 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
                title="Restaurer les étapes de routine d'origine"
              >
                <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
                Restaurer défauts
              </button>
            </div>
          </div>

          {/* EDIT ROUTINE STEP DIALOG / FORM */}
          {editingStepId && (
            <div className="bg-teal-50 border border-teal-200 rounded-2xl p-4 space-y-3 animate-in slide-in-from-top-2 duration-200 shadow-sm">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-teal-900 flex items-center gap-1.5">
                  <Edit2 className="w-3.5 h-3.5 text-teal-600" /> Modifier l'étape de soin
                </span>
                <button
                  onClick={() => setEditingStepId(null)}
                  className="text-teal-500 hover:text-teal-800 p-1 rounded-md cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleSaveEditStep} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                <div className="md:col-span-5 space-y-1">
                  <label className="text-[9px] font-bold text-teal-800 uppercase block">Nom de l'étape / Produit</label>
                  <input 
                    type="text"
                    required
                    value={editProductName}
                    onChange={(e) => setEditProductName(e.target.value)}
                    className="w-full bg-white border border-teal-200 rounded-lg px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-teal-500 font-semibold"
                  />
                </div>
                <div className="md:col-span-5 space-y-1">
                  <label className="text-[9px] font-bold text-teal-800 uppercase block">Instructions d'application / Note</label>
                  <input 
                    type="text"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full bg-white border border-teal-200 rounded-lg px-3 py-1.5 text-xs text-neutral-900 focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div className="md:col-span-2 flex gap-1.5">
                  <button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <Save className="w-3.5 h-3.5" /> Enregistrer
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TWO COLUMNS: MATIN (AM) & SOIR (PM) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* COLUMN 1: MATIN (AM) */}
            <div className="bg-gradient-to-b from-amber-50/30 to-white border border-amber-100 rounded-3xl p-5 md:p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-amber-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                    <Sun className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest font-mono">Routine Matin (AM)</h4>
                    <p className="text-[10px] text-neutral-400">Éclat, hydratation & protection solaire</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200/50 px-2.5 py-0.5 rounded-md font-mono">
                    {(checkedStepsByDate[date] || []).filter(id => routineSteps.some(s => s.id === id && s.period === "morning" && s.isActive)).length} / {routineSteps.filter(s => s.period === "morning" && s.isActive).length} fait(s)
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {routineSteps.filter(s => s.period === "morning" && s.isActive).length === 0 ? (
                  <div className="border border-dashed border-amber-200 rounded-2xl p-8 text-center text-xs text-amber-800/60 italic bg-white/50">
                    Aucune étape pour le matin. Ajoutez-en une ci-dessous !
                  </div>
                ) : (
                  routineSteps
                    .filter(s => s.period === "morning" && s.isActive)
                    .sort((a, b) => a.stepNumber - b.stepNumber)
                    .map((step, index, arr) => {
                      const isChecked = (checkedStepsByDate[date] || []).includes(step.id);
                      return (
                        <div 
                          key={step.id} 
                          className={`border rounded-2xl p-3.5 flex items-start gap-3 transition-all ${
                            isChecked 
                              ? "bg-amber-50/20 border-amber-200/50 shadow-3xs" 
                              : "bg-white border-neutral-200/70 hover:border-neutral-300"
                          }`}
                        >
                          {/* CHECKBOX */}
                          <button
                            type="button"
                            onClick={() => toggleStepForDate(step.id, date)}
                            className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer mt-0.5 shrink-0 ${
                              isChecked 
                                ? "bg-amber-500 border-amber-500 text-white" 
                                : "border-neutral-300 hover:border-amber-400 bg-white"
                            }`}
                          >
                            {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                          </button>

                          {/* CONTENT */}
                          <div className="flex-1 space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="bg-amber-100 text-amber-800 font-mono font-bold text-[9px] px-1.5 py-0.2 rounded shrink-0">
                                Étape {step.stepNumber}
                              </span>
                              <h5 className={`text-xs font-extrabold truncate ${isChecked ? "text-amber-950/60 line-through" : "text-neutral-900"}`}>
                                {step.productName}
                              </h5>
                            </div>
                            {step.description && (
                              <p className={`text-[10px] leading-relaxed line-clamp-2 ${isChecked ? "text-amber-800/40" : "text-neutral-500 font-medium"}`}>
                                {step.description}
                              </p>
                            )}
                          </div>

                          {/* MANAGEMENT CONTROLS */}
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMoveStep(step.id, "up")}
                              disabled={index === 0}
                              className={`p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all cursor-pointer ${index === 0 && "opacity-20 cursor-not-allowed"}`}
                              title="Déplacer vers le haut"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveStep(step.id, "down")}
                              disabled={index === arr.length - 1}
                              className={`p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all cursor-pointer ${index === arr.length - 1 && "opacity-20 cursor-not-allowed"}`}
                              title="Déplacer vers le bas"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStartEditStep(step)}
                              className="p-1 rounded-md text-neutral-400 hover:text-teal-600 hover:bg-teal-50 transition-all cursor-pointer"
                              title="Modifier"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStep(step.id)}
                              className="p-1 rounded-md text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                              title="Supprimer l'étape"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>

            {/* COLUMN 2: SOIR (PM) */}
            <div className="bg-gradient-to-b from-indigo-50/20 to-white border border-indigo-100 rounded-3xl p-5 md:p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-indigo-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
                    <Moon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest font-mono">Routine Soir (PM)</h4>
                    <p className="text-[10px] text-neutral-400">Régénération, nutrition & actifs ciblés</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200/50 px-2.5 py-0.5 rounded-md font-mono">
                    {(checkedStepsByDate[date] || []).filter(id => routineSteps.some(s => s.id === id && s.period === "evening" && s.isActive)).length} / {routineSteps.filter(s => s.period === "evening" && s.isActive).length} fait(s)
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {routineSteps.filter(s => s.period === "evening" && s.isActive).length === 0 ? (
                  <div className="border border-dashed border-indigo-200 rounded-2xl p-8 text-center text-xs text-indigo-800/60 italic bg-white/50">
                    Aucune étape pour le soir. Ajoutez-en une ci-dessous !
                  </div>
                ) : (
                  routineSteps
                    .filter(s => s.period === "evening" && s.isActive)
                    .sort((a, b) => a.stepNumber - b.stepNumber)
                    .map((step, index, arr) => {
                      const isChecked = (checkedStepsByDate[date] || []).includes(step.id);
                      return (
                        <div 
                          key={step.id} 
                          className={`border rounded-2xl p-3.5 flex items-start gap-3 transition-all ${
                            isChecked 
                              ? "bg-indigo-50/10 border-indigo-200/50 shadow-3xs" 
                              : "bg-white border-neutral-200/70 hover:border-neutral-300"
                          }`}
                        >
                          {/* CHECKBOX */}
                          <button
                            type="button"
                            onClick={() => toggleStepForDate(step.id, date)}
                            className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all cursor-pointer mt-0.5 shrink-0 ${
                              isChecked 
                                ? "bg-indigo-600 border-indigo-600 text-white" 
                                : "border-neutral-300 hover:border-indigo-400 bg-white"
                            }`}
                          >
                            {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                          </button>

                          {/* CONTENT */}
                          <div className="flex-1 space-y-0.5 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="bg-indigo-100 text-indigo-800 font-mono font-bold text-[9px] px-1.5 py-0.2 rounded shrink-0">
                                Étape {step.stepNumber}
                              </span>
                              <h5 className={`text-xs font-extrabold truncate ${isChecked ? "text-indigo-950/60 line-through" : "text-neutral-900"}`}>
                                {step.productName}
                              </h5>
                            </div>
                            {step.description && (
                              <p className={`text-[10px] leading-relaxed line-clamp-2 ${isChecked ? "text-indigo-800/40" : "text-neutral-500 font-medium"}`}>
                                {step.description}
                              </p>
                            )}
                          </div>

                          {/* MANAGEMENT CONTROLS */}
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMoveStep(step.id, "up")}
                              disabled={index === 0}
                              className={`p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all cursor-pointer ${index === 0 && "opacity-20 cursor-not-allowed"}`}
                              title="Déplacer vers le haut"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveStep(step.id, "down")}
                              disabled={index === arr.length - 1}
                              className={`p-1 rounded-md text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-all cursor-pointer ${index === arr.length - 1 && "opacity-20 cursor-not-allowed"}`}
                              title="Déplacer vers le bas"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleStartEditStep(step)}
                              className="p-1 rounded-md text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all cursor-pointer"
                              title="Modifier"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStep(step.id)}
                              className="p-1 rounded-md text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                              title="Supprimer l'étape"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                )}
              </div>
            </div>

          </div>

          {/* ADD NEW STEP FORM */}
          <div className="bg-neutral-50 border border-neutral-200/70 rounded-3xl p-6">
            <h4 className="text-xs font-bold text-neutral-900 uppercase tracking-widest font-mono border-b border-neutral-200/50 pb-3 mb-4">
              Ajouter une étape personnalisée à vos routines
            </h4>
            <form onSubmit={handleAddStep} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Routine cible</label>
                <select
                  value={newPeriod}
                  onChange={(e) => setNewPeriod(e.target.value as "morning" | "evening")}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 font-bold focus:outline-none focus:border-neutral-950 transition-all cursor-pointer"
                >
                  <option value="morning">☀️ Routine Matin (AM)</option>
                  <option value="evening">🌙 Routine Soir (PM)</option>
                </select>
              </div>

              <div className="md:col-span-4 space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Nom de l'étape (ex: Cleanser, Rétinol)</label>
                <input 
                  type="text"
                  required
                  placeholder="ex: Gel Nettoyant, Vitamine C, Sérum..."
                  value={newProductName}
                  onChange={(e) => setNewProductName(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950 transition-all font-semibold"
                />
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Note d'application / Rôle</label>
                <input 
                  type="text"
                  placeholder="ex: Sur peau sèche, tapoter doucement..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-white border border-neutral-200 rounded-xl px-3 py-2.5 text-xs text-neutral-900 focus:outline-none focus:border-neutral-950 transition-all"
                />
              </div>

              <div className="md:col-span-2">
                <button
                  type="submit"
                  className="w-full bg-neutral-950 hover:bg-neutral-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-teal-400" />
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
