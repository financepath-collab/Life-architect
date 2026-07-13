import React, { useState } from "react";
import { SkinTracker } from "../types";
import { 
  Sparkles, 
  Calendar, 
  Droplet, 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Camera, 
  Columns, 
  Upload, 
  Heart, 
  Check, 
  Info,
  Sliders,
  Sparkle
} from "lucide-react";

interface SkinTrackerSectionProps {
  skinTrackers: SkinTracker[];
  setSkinTrackers: React.Dispatch<React.SetStateAction<SkinTracker[]>>;
}

// Predefined abstract gradients representing simulated high-tech skin scans
const SKIN_SCAN_PRESETS: { [key: string]: string } = {
  "Excellente": "from-emerald-400 via-teal-300 to-emerald-500",
  "Bonne": "from-cyan-400 via-teal-200 to-emerald-300",
  "Sensible": "from-amber-300 via-orange-200 to-amber-400",
  "Acné/Irritée": "from-rose-400 via-orange-300 to-rose-500",
};

export default function SkinTrackerSection({
  skinTrackers = [],
  setSkinTrackers
}: SkinTrackerSectionProps) {
  const [activeTab, setActiveTab] = useState<"routine" | "journal">("routine");
  
  // Form states
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [morningRoutine, setMorningRoutine] = useState(true);
  const [eveningRoutine, setEveningRoutine] = useState(false);
  const [skinCondition, setSkinCondition] = useState<SkinTracker["skinCondition"]>("Bonne");
  const [productsUsed, setProductsUsed] = useState("");
  const [waterIntakeLiters, setWaterIntakeLiters] = useState(1.5);
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  // Before/After comparison states
  const [beforeId, setBeforeId] = useState<string>("");
  const [afterId, setAfterId] = useState<string>("");

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
    if (beforeId === id) setBeforeId("");
    if (afterId === id) setAfterId("");
  };

  // Handle local image file upload and convert to Base64
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, entryId?: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      if (entryId) {
        // Direct upload to specific entry
        setSkinTrackers(prev => prev.map(entry => 
          entry.id === entryId ? { ...entry, photoUrl: base64String } : entry
        ));
      } else {
        // Upload to active form
        setPhotoUrl(base64String);
      }
    };
    reader.readAsDataURL(file);
  };

  // Simulate skin scan (assign colorful gradient based on condition)
  const handleSimulateScan = (entryId?: string, condition?: SkinTracker["skinCondition"]) => {
    const cond = condition || skinCondition;
    // We construct a colorful canvas gradient CSS representation to use as image source or display
    const simulatedUrl = `simulated:${cond}`;
    
    if (entryId) {
      setSkinTrackers(prev => prev.map(entry => 
        entry.id === entryId ? { ...entry, photoUrl: simulatedUrl } : entry
      ));
    } else {
      setPhotoUrl(simulatedUrl);
    }
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

  // Find Before/After items
  const beforeEntry = skinTrackers.find(e => e.id === beforeId);
  const afterEntry = skinTrackers.find(e => e.id === afterId);

  // Render a skin photo container
  const renderSkinPhoto = (entry: SkinTracker) => {
    if (!entry.photoUrl) {
      return (
        <div className="w-full h-44 bg-neutral-50 border border-dashed border-neutral-200 rounded-2xl flex flex-col items-center justify-center p-4 text-center group relative overflow-hidden">
          <ImageIcon className="w-8 h-8 text-neutral-300 mb-2 group-hover:text-neutral-400 transition-all" />
          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Aucun visuel</span>
          <p className="text-[9px] text-neutral-400/80 mt-1 max-w-[150px]">Chargez une vraie photo ou générez un scan cutané.</p>
          
          <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-2">
            <label className="bg-white hover:bg-neutral-100 text-neutral-900 px-3 py-1.5 rounded-xl text-[9px] font-bold cursor-pointer transition-all flex items-center gap-1">
              <Upload className="w-3 h-3" /> Importer
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => handleImageUpload(e, entry.id)} 
              />
            </label>
            <button
              onClick={() => handleSimulateScan(entry.id, entry.skinCondition)}
              className="bg-neutral-950 hover:bg-neutral-800 text-white px-3 py-1.5 rounded-xl text-[9px] font-bold transition-all flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-amber-400" /> Simuler Scan
            </button>
          </div>
        </div>
      );
    }

    if (entry.photoUrl.startsWith("simulated:")) {
      const condition = entry.photoUrl.split(":")[1] || "Bonne";
      const gradient = SKIN_SCAN_PRESETS[condition] || "from-neutral-200 to-neutral-300";
      return (
        <div className={`w-full h-44 bg-gradient-to-tr ${gradient} rounded-2xl border border-neutral-100 p-4 flex flex-col justify-between text-white relative group overflow-hidden shadow-2xs`}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),transparent)] mix-blend-overlay" />
          
          {/* Simulated scan lines */}
          <div className="absolute inset-x-0 top-1/2 h-0.5 bg-white/40 shadow-md animate-pulse" />
          <div className="absolute inset-y-0 left-1/3 w-0.5 bg-white/20" />
          
          <div className="flex justify-between items-start z-10">
            <span className="bg-black/30 backdrop-blur-xs text-[8px] font-bold font-mono uppercase tracking-widest px-2 py-0.5 rounded-md">
              Simulated Glow Scan
            </span>
            <Sparkle className="w-3.5 h-3.5 text-white animate-spin" style={{ animationDuration: "12s" }} />
          </div>

          <div className="space-y-1 z-10 drop-shadow-xs">
            <span className="text-[10px] font-bold font-mono tracking-widest block">INDICE CUTANÉ</span>
            <span className="text-sm font-black uppercase tracking-tight block">{condition}</span>
          </div>

          <div className="absolute inset-0 bg-neutral-900/65 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1.5">
            <label className="bg-white hover:bg-neutral-100 text-neutral-900 px-3 py-1.5 rounded-xl text-[9px] font-bold cursor-pointer transition-all flex items-center gap-1">
              <Upload className="w-3 h-3" /> Changer en vraie photo
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={(e) => handleImageUpload(e, entry.id)} 
              />
            </label>
            <button
              onClick={() => {
                // Clear photo
                setSkinTrackers(prev => prev.map(e => e.id === entry.id ? { ...e, photoUrl: undefined } : e));
              }}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-[9px] font-bold transition-all flex items-center gap-1"
            >
              Supprimer le visuel
            </button>
          </div>
        </div>
      );
    }

    // Real uploaded Base64 photo
    return (
      <div className="w-full h-44 rounded-2xl border border-neutral-200/60 relative group overflow-hidden shadow-2xs">
        <img 
          src={entry.photoUrl} 
          alt={`Peau le ${entry.date}`} 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute bottom-2 left-2 bg-black/45 backdrop-blur-xs text-[8px] text-white font-bold font-mono uppercase tracking-widest px-2 py-0.5 rounded-md">
          Selfie Photo Log
        </div>

        <div className="absolute inset-0 bg-neutral-900/65 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-1.5">
          <label className="bg-white hover:bg-neutral-100 text-neutral-900 px-3 py-1.5 rounded-xl text-[9px] font-bold cursor-pointer transition-all flex items-center gap-1">
            <Upload className="w-3 h-3" /> Remplacer
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={(e) => handleImageUpload(e, entry.id)} 
            />
          </label>
          <button
            onClick={() => {
              setSkinTrackers(prev => prev.map(e => e.id === entry.id ? { ...e, photoUrl: undefined } : e));
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-xl text-[9px] font-bold transition-all flex items-center gap-1"
          >
            Supprimer le selfie
          </button>
        </div>
      </div>
    );
  };

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
            onClick={() => setActiveTab("journal")}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              activeTab === "journal"
                ? "bg-white text-neutral-950 shadow-3xs"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            Journal Photo & Comparateur
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
                    onChange={(e) => setMorningRoutine(e.target.checked)}
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
                    onChange={(e) => setEveningRoutine(e.target.checked)}
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
                        onClick={() => setSkinCondition(cond)}
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
                  onChange={(e) => setWaterIntakeLiters(parseFloat(e.target.value))}
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

      {/* TAB 2: JOURNAL PHOTO & COMPARATEUR */}
      {activeTab === "journal" && (
        <div className="space-y-8">
          
          {/* COMPARATOR TOOL */}
          <div className="bg-neutral-950 text-white rounded-3xl p-6 space-y-6 shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-tr from-cyan-500/10 to-teal-500/20 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center gap-2 border-b border-white/10 pb-4">
              <Columns className="w-5 h-5 text-teal-400" />
              <div>
                <h3 className="text-sm font-black uppercase tracking-tight">Outil Comparatif Avant / Après</h3>
                <p className="text-[11px] text-neutral-400">Sélectionnez deux analyses cutanées pour analyser la régression ou la progression de l'état cutané.</p>
              </div>
            </div>

            {/* DROP-DOWNS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Date Référence (Avant)</label>
                <select
                  value={beforeId}
                  onChange={(e) => setBeforeId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400 transition-all font-bold"
                >
                  <option value="">-- Choisir une date --</option>
                  {skinTrackers.map(e => (
                    <option key={`before-${e.id}`} value={e.id}>{formatFrenchDate(e.date)} - Peau {e.skinCondition}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Date Suivi (Après)</label>
                <select
                  value={afterId}
                  onChange={(e) => setAfterId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-400 transition-all font-bold"
                >
                  <option value="">-- Choisir une date --</option>
                  {skinTrackers.map(e => (
                    <option key={`after-${e.id}`} value={e.id}>{formatFrenchDate(e.date)} - Peau {e.skinCondition}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* COMPARATIVE CARDS RENDER */}
            {beforeEntry && afterEntry ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                {/* BEFORE */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                    <span className="text-[10px] text-teal-400 font-extrabold uppercase tracking-widest font-mono">AVANT</span>
                    <span className="text-[11px] font-bold">{formatFrenchDate(beforeEntry.date)}</span>
                  </div>
                  {renderSkinPhoto(beforeEntry)}
                  <div className="space-y-1.5 text-xs text-neutral-300">
                    <div className="flex justify-between">
                      <span className="text-neutral-500 font-bold">État cutané :</span>
                      <span className="font-extrabold text-white">{beforeEntry.skinCondition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 font-bold">Routines complètes :</span>
                      <span className="font-mono text-[10px] text-neutral-400">
                        {beforeEntry.morningRoutine ? "Matin ✓" : "Matin ✗"} | {beforeEntry.eveningRoutine ? "Soir ✓" : "Soir ✗"}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed border-t border-neutral-800/60 pt-2 text-neutral-400 italic">
                      <span className="font-bold text-neutral-500 not-italic">Produits :</span> {beforeEntry.productsUsed}
                    </p>
                  </div>
                </div>

                {/* AFTER */}
                <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                    <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest font-mono">APRÈS</span>
                    <span className="text-[11px] font-bold">{formatFrenchDate(afterEntry.date)}</span>
                  </div>
                  {renderSkinPhoto(afterEntry)}
                  <div className="space-y-1.5 text-xs text-neutral-300">
                    <div className="flex justify-between">
                      <span className="text-neutral-500 font-bold">État cutané :</span>
                      <span className="font-extrabold text-white">{afterEntry.skinCondition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500 font-bold">Routines complètes :</span>
                      <span className="font-mono text-[10px] text-neutral-400">
                        {afterEntry.morningRoutine ? "Matin ✓" : "Matin ✗"} | {afterEntry.eveningRoutine ? "Soir ✓" : "Soir ✗"}
                      </span>
                    </div>
                    <p className="text-[11px] leading-relaxed border-t border-neutral-800/60 pt-2 text-neutral-400 italic">
                      <span className="font-bold text-neutral-500 not-italic">Produits :</span> {afterEntry.productsUsed}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-900/60 border border-neutral-800/40 p-6 rounded-2xl text-center text-xs text-neutral-400 italic">
                Sélectionnez deux logs pour afficher le comparatif côte à côte.
              </div>
            )}
          </div>

          {/* PHOTO GALLERY */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-widest font-mono">Galerie Chronologique du Teint</h3>
            
            {skinTrackers.length === 0 ? (
              <div className="border border-neutral-100 rounded-3xl p-10 text-center text-neutral-400 italic text-xs bg-neutral-50/50">
                Aucun selfie ni scan enregistré. Saisissez des données d'analyse pour commencer votre album cutané.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {skinTrackers.map((entry) => {
                  let conditionBadge = "";
                  if (entry.skinCondition === "Excellente") conditionBadge = "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
                  if (entry.skinCondition === "Bonne") conditionBadge = "bg-cyan-500/10 text-cyan-700 border-cyan-500/20";
                  if (entry.skinCondition === "Sensible") conditionBadge = "bg-amber-500/10 text-amber-700 border-amber-500/20";
                  if (entry.skinCondition === "Acné/Irritée") conditionBadge = "bg-rose-500/10 text-rose-700 border-rose-500/20";

                  return (
                    <div key={`card-${entry.id}`} className="bg-white border border-neutral-200 rounded-3xl p-4 space-y-4 shadow-3xs hover:border-neutral-300 transition-all flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-black text-neutral-900">{formatFrenchDate(entry.date)}</span>
                          <span className={`text-[9px] font-bold border px-2 py-0.5 rounded-full ${conditionBadge}`}>
                            {entry.skinCondition}
                          </span>
                        </div>
                        
                        {renderSkinPhoto(entry)}
                        
                        <p className="text-[11px] text-neutral-500 leading-relaxed line-clamp-2">
                          <span className="font-bold text-neutral-400">Produits :</span> {entry.productsUsed}
                        </p>
                      </div>

                      <div className="border-t border-neutral-100 pt-3 flex items-center justify-between text-[10px] font-bold text-neutral-400">
                        <span className="flex items-center gap-1">
                          <Droplet className="w-3 h-3 text-cyan-500 fill-cyan-100" /> {entry.waterIntakeLiters} L d'eau
                        </span>
                        <div className="flex gap-1.5">
                          <span className={entry.morningRoutine ? "text-neutral-900" : "text-neutral-300"}>AM</span>
                          <span>•</span>
                          <span className={entry.eveningRoutine ? "text-neutral-900" : "text-neutral-300"}>PM</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
