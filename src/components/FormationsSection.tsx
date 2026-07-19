import React, { useState, useEffect } from "react";
import { Formation, ProjectFolder } from "../types";
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Globe, 
  Sparkles, 
  CheckCircle, 
  Layers, 
  Award, 
  Check, 
  X,
  Search,
  ExternalLink,
  RefreshCw,
  Sliders,
  Tv,
  ShoppingBag,
  Video
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// --- CUSTOM INTERFACES ---
export interface PublishedCourse {
  id: string;
  title: string;
  niche: "CFO" | "Analyst" | "Economist" | "Général";
  platform: "Udemy" | "THE MA CIRCLE (Direct)";
  price: number; 
  studentsCount: number;
  monthlyRevenue: number; 
  rating: number; 
}

export interface DigitalProduct {
  id: string;
  title: string;
  niche: "CFO" | "Analyst" | "Economist" | "Général";
  platform: "THE MA CIRCLE" | "Gumroad" | "E-commerce";
  price: number; 
  salesCount: number;
  revenue: number; 
  status: "Actif" | "En projet";
}

export interface CreatorChannel {
  id: string;
  name: string;
  url: string;
  subscribers: number;
  videosCount: number;
  niche: string;
  status: string;
}

export interface CreatorWebsite {
  id: string;
  name: string;
  url: string;
  monthlyVisitors: number;
  status: string;
  notes: string;
}

interface FormationsSectionProps {
  formations: Formation[]; 
  setFormations: React.Dispatch<React.SetStateAction<Formation[]>>;
  folders?: ProjectFolder[];
  setFolders?: React.Dispatch<React.SetStateAction<ProjectFolder[]>>;
  activeTab?: "carriere_pro" | "ma_circle";
  hideTabs?: boolean;
}

export default function FormationsSection({ 
  formations, 
  setFormations,
  folders = [],
  setFolders,
  activeTab: activeTabProp,
  hideTabs = false
}: FormationsSectionProps) {
  const [localActiveTab, setLocalActiveTab] = useState<"ma_circle" | "carriere_pro">("carriere_pro");

  useEffect(() => {
    if (activeTabProp) {
      setLocalActiveTab(activeTabProp);
    }
  }, [activeTabProp]);

  const activeTab = activeTabProp || localActiveTab;
  const setActiveTab = activeTabProp ? () => {} : setLocalActiveTab;

  const [maCircleSubTab, setMaCircleSubTab] = useState<"ecosystem" | "courses" | "products">("ecosystem");

  // --- PERSISTENT DATA FOR THE MA CIRCLE ---
  const [publishedCourses, setPublishedCourses] = useState<PublishedCourse[]>(() => {
    const saved = localStorage.getItem("mp_published_courses_v2");
    if (saved) return JSON.parse(saved);
    return [
      { id: "pub_1", title: "Analyse Financière & Modélisation pour CFO Marocains", niche: "CFO", platform: "Udemy", price: 250, studentsCount: 1240, monthlyRevenue: 4500, rating: 4.8 },
      { id: "pub_2", title: "Les Fondations de la Bourse de Casablanca (BVC)", niche: "Analyst", platform: "Udemy", price: 300, studentsCount: 850, monthlyRevenue: 3200, rating: 4.7 },
      { id: "pub_3", title: "Académie d'Élite : Ingénierie Financière & Fiscalité", niche: "CFO", platform: "THE MA CIRCLE (Direct)", price: 1500, studentsCount: 45, monthlyRevenue: 12000, rating: 4.9 },
      { id: "pub_4", title: "Masterclass Macroéconomie & Conjoncture Marocaine", niche: "Economist", platform: "THE MA CIRCLE (Direct)", price: 800, studentsCount: 30, monthlyRevenue: 6400, rating: 4.8 }
    ];
  });

  const [digitalProducts, setDigitalProducts] = useState<DigitalProduct[]>(() => {
    const saved = localStorage.getItem("mp_digital_products_v2");
    if (saved) return JSON.parse(saved);
    return [
      { id: "prod_1", title: "Modèle Excel Professionnel d'Évaluation de PME Marocaines", niche: "CFO", platform: "THE MA CIRCLE", price: 350, salesCount: 140, revenue: 49000, status: "Actif" },
      { id: "prod_2", title: "Template Notion Ultimate Creator de Contenu Multi-Chaînes", niche: "Analyst", platform: "THE MA CIRCLE", price: 150, salesCount: 95, revenue: 14250, status: "Actif" },
      { id: "prod_3", title: "Ebook d'Élite : Le Guide du Rentier BVC", niche: "Analyst", platform: "Gumroad", price: 200, salesCount: 0, revenue: 0, status: "En projet" }
    ];
  });

  const [creatorChannels, setCreatorChannels] = useState<CreatorChannel[]>(() => {
    const saved = localStorage.getItem("mp_creator_channels");
    if (saved) return JSON.parse(saved);
    return [
      { id: "chan_1", name: "The Moroccan CFO", url: "https://www.youtube.com", subscribers: 12500, videosCount: 48, niche: "CFO / Finance d'Entreprise Marocaine", status: "Actif" },
      { id: "chan_2", name: "The Moroccan Analyst", url: "https://www.youtube.com", subscribers: 8400, videosCount: 32, niche: "Analyse Boursière (BVC) & Bourse", status: "Actif" },
      { id: "chan_3", name: "The Moroccan Economist", url: "https://www.youtube.com", subscribers: 4200, videosCount: 15, niche: "Macroéconomie & Conjoncture", status: "En croissance" }
    ];
  });

  const [creatorWebsite, setCreatorWebsite] = useState<CreatorWebsite>(() => {
    const saved = localStorage.getItem("mp_creator_website");
    if (saved) return JSON.parse(saved);
    return {
      id: "web_1",
      name: "THE MA CIRCLE",
      url: "https://macircle.ma",
      monthlyVisitors: 3500,
      status: "Actif",
      notes: "Plateforme d'hébergement premium pour formations, templates de modélisation financière et modèles professionnels."
    };
  });

  // --- LOCALSTORAGE SYNC ---
  useEffect(() => { localStorage.setItem("mp_published_courses_v2", JSON.stringify(publishedCourses)); }, [publishedCourses]);
  useEffect(() => { localStorage.setItem("mp_digital_products_v2", JSON.stringify(digitalProducts)); }, [digitalProducts]);
  useEffect(() => { localStorage.setItem("mp_creator_channels", JSON.stringify(creatorChannels)); }, [creatorChannels]);
  useEffect(() => { localStorage.setItem("mp_creator_website", JSON.stringify(creatorWebsite)); }, [creatorWebsite]);

  // --- MODAL / FORM STATES ---
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showChannelForm, setShowChannelForm] = useState(false);
  const [showLearnForm, setShowLearnForm] = useState(false);

  // --- FORM VALUES ---
  const [cTitle, setCTitle] = useState("");
  const [cNiche, setCNiche] = useState<"CFO" | "Analyst" | "Economist" | "Général">("CFO");
  const [cPlatform, setCPlatform] = useState<"Udemy" | "THE MA CIRCLE (Direct)">("Udemy");
  const [cPrice, setCPrice] = useState(199);
  const [cStudents, setCStudents] = useState(0);
  const [cRev, setCRev] = useState(0);
  const [cRating, setCRating] = useState(4.8);

  const [pTitle, setPTitle] = useState("");
  const [pNiche, setPNiche] = useState<"CFO" | "Analyst" | "Economist" | "Général">("CFO");
  const [pPlatform, setPPlatform] = useState<"THE MA CIRCLE" | "Gumroad" | "E-commerce">("THE MA CIRCLE");
  const [pPrice, setPPrice] = useState(150);
  const [pSales, setPSales] = useState(0);
  const [pStatus, setPStatus] = useState<"Actif" | "En projet">("Actif");

  const [lTitle, setLTitle] = useState("");
  const [lInstructor, setLInstructor] = useState("");
  const [lPlatform, setLPlatform] = useState("");
  const [lDuration, setLDuration] = useState(10);
  const [lProgress, setLProgress] = useState(0);
  const [lStatus, setLStatus] = useState<"Non commencé" | "En cours" | "Terminé">("En cours");
  const [lFolderId, setLFolderId] = useState<string>("");
  const [selectedFilterFolderId, setSelectedFilterFolderId] = useState<string>("");

  const [chanName, setChanName] = useState("");
  const [chanUrl, setChanUrl] = useState("");
  const [chanSubs, setChanSubs] = useState(1000);
  const [chanVids, setChanVids] = useState(10);
  const [chanNiche, setChanNiche] = useState("");
  const [chanStatus, setChanStatus] = useState("Actif");

  // --- METRIC CALCS ---
  const globalLearnProgress = formations.length > 0 
    ? Math.round(formations.reduce((sum, f) => sum + f.progressPercent, 0) / formations.length) 
    : 0;
  
  const completedLearnCourses = formations.filter(f => f.progressPercent === 100 || f.status === "Terminé").length;

  const filteredFormations = React.useMemo(() => {
    if (!selectedFilterFolderId) return formations;
    const folder = folders.find(f => f.id === selectedFilterFolderId);
    if (!folder) return formations;
    return formations.filter(f => folder.associatedFormationIds.includes(f.id));
  }, [formations, folders, selectedFilterFolderId]);

  // --- SUBMISSION HANDLERS ---
  const handleAddPublishedCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cTitle.trim()) return;
    setPublishedCourses(prev => [{
      id: "pub_" + Date.now(), title: cTitle.trim(), niche: cNiche, platform: cPlatform,
      price: cPrice, studentsCount: cStudents, monthlyRevenue: cRev, rating: cRating
    }, ...prev]);
    setCTitle(""); setShowCourseForm(false);
  };

  const handleAddDigitalProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pTitle.trim()) return;
    setDigitalProducts(prev => [{
      id: "prod_" + Date.now(), title: pTitle.trim(), niche: pNiche, platform: pPlatform,
      price: pPrice, salesCount: pSales, revenue: pPrice * pSales, status: pStatus
    }, ...prev]);
    setPTitle(""); setShowProductForm(false);
  };

  const handleAddCreatorChannel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chanName.trim()) return;
    setCreatorChannels(prev => [{
      id: "chan_" + Date.now(),
      name: chanName.trim(),
      url: chanUrl.trim() || "https://www.youtube.com",
      subscribers: Number(chanSubs) || 0,
      videosCount: Number(chanVids) || 0,
      niche: chanNiche.trim() || "Finance",
      status: chanStatus
    }, ...prev]);
    setChanName(""); setChanUrl(""); setChanSubs(1000); setChanVids(10); setChanNiche(""); setChanStatus("Actif");
    setShowChannelForm(false);
  };

  const handleAddLearningCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lTitle.trim()) return;
    const courseId = "learn_" + Date.now();
    setFormations(prev => [...prev, {
      id: courseId, title: lTitle.trim(), instructor: lInstructor.trim() || "Expert",
      platform: lPlatform.trim() || "Udemy", durationHours: lDuration,
      progressPercent: lStatus === "Terminé" ? 100 : lProgress, status: lStatus
    }]);

    if (lFolderId && setFolders) {
      setFolders(prev => prev.map(f => {
        if (f.id === lFolderId) {
          return {
            ...f,
            associatedFormationIds: [...f.associatedFormationIds, courseId]
          };
        }
        return f;
      }));
    }

    setLTitle(""); setLInstructor(""); setLPlatform(""); setLDuration(10); setLProgress(0); setLFolderId("");
    setShowLearnForm(false);
  };

  // --- ACTIONS ---
  const deleteLearningCourse = (id: string) => setFormations(prev => prev.filter(f => f.id !== id));
  const updateLearningProgress = (id: string, progress: number) => {
    setFormations(prev => prev.map(f => {
      if (f.id !== id) return f;
      const progressVal = Math.max(0, Math.min(progress, 100));
      return { ...f, progressPercent: progressVal, status: progressVal === 100 ? "Terminé" : f.status };
    }));
  };
  const toggleLearningStatus = (id: string, currentStatus: string) => {
    setFormations(prev => prev.map(f => {
      if (f.id !== id) return f;
      const isFin = currentStatus !== "Terminé";
      return { ...f, status: isFin ? "Terminé" : "En cours" as any, progressPercent: isFin ? 100 : 50 };
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* 1. SECTOR MAIN TABS */}
      {!hideTabs && (
        <div className="flex border-b border-neutral-200/80 -mx-6 px-6">
          <button
            onClick={() => setLocalActiveTab("carriere_pro")}
            className={`flex items-center gap-2.5 px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-all border-b-2 -mb-px cursor-pointer select-none ${
              activeTab === "carriere_pro"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-neutral-400 hover:text-neutral-900"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>📚 ÉTUDES & AUTO-FORMATION</span>
          </button>

          <button
            onClick={() => setLocalActiveTab("ma_circle")}
            className={`flex items-center gap-2.5 px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-all border-b-2 -mb-px cursor-pointer select-none ${
              activeTab === "ma_circle"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-neutral-400 hover:text-neutral-900"
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>🎯 ACADÉMIE "THE MA CIRCLE"</span>
          </button>
        </div>
      )}

      {/* ==================================================== */}
      {/* --- TAB: AUTO-FORMATION --- */}
      {/* ==================================================== */}
      {activeTab === "carriere_pro" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Global Header Metrics Grid with the required Global Progress Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gradient-to-br from-neutral-900 to-indigo-950 text-white rounded-3xl p-6 border border-neutral-800 shadow-md relative overflow-hidden">
            <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[150%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
            
            {/* Global Learning Progress */}
            <div className="space-y-3.5 border-r border-neutral-800/80 pr-4">
              <span className="text-[10px] font-black tracking-widest text-indigo-300 block uppercase font-mono">Auto-Formation Globale</span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono leading-none">{globalLearnProgress}%</span>
                <span className="text-xs text-neutral-400 font-medium">de progression</span>
              </div>
              
              {/* Actual global progress bar widget */}
              <div className="space-y-1">
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                    style={{ width: `${globalLearnProgress}%` }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-neutral-400 font-bold font-mono">
                  <span>{completedLearnCourses} / {formations.length} Cours complétés</span>
                  <span>Moyenne générale</span>
                </div>
              </div>
            </div>

            {/* Hours stats */}
            <div className="pl-4 flex flex-col justify-center space-y-1.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Volume Horaire</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black font-mono text-emerald-400">
                  {Math.round(formations.reduce((sum, f) => sum + ((f.durationHours || 0) * (f.progressPercent || 0) / 100), 0))} h
                </span>
                <span className="text-xs text-neutral-400">complétées sur {formations.reduce((sum, f) => sum + (f.durationHours || 0), 0)} h</span>
              </div>
              <p className="text-[10.5px] text-neutral-300">
                Focalisez-vous sur l'apprentissage quotidien pour débloquer vos compétences cibles.
              </p>
            </div>
          </div>

          {/* SUBTAB: FORMATIONS SUIVIES */}
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 border border-neutral-200/60 p-4 rounded-2xl">
              <div>
                <h3 className="text-xs font-black text-neutral-900 uppercase tracking-tight">Vos Programmes d'Études</h3>
                <p className="text-[11px] text-neutral-400 font-medium">Gerez votre apprentissage, relisez vos chapitres et complétez les modules de vos cours.</p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={selectedFilterFolderId}
                  onChange={(e) => setSelectedFilterFolderId(e.target.value)}
                  className="text-xs font-bold text-neutral-700 bg-white border border-neutral-200 rounded-xl py-2 px-3 focus:outline-hidden cursor-pointer font-sans"
                >
                  <option value="">📁 Tous les dossiers</option>
                  {folders.map(f => (
                    <option key={f.id} value={f.id}>{f.name}</option>
                  ))}
                </select>
                <button
                  onClick={() => setShowLearnForm(true)}
                  className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enregistrer un cours</span>
                </button>
              </div>
            </div>

            {/* Grid representation */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredFormations.length === 0 ? (
                <div className="col-span-full py-16 text-center text-neutral-400 bg-white border border-dashed border-neutral-200 rounded-3xl italic text-xs">
                  Aucun cours d'apprentissage enregistré. Cliquez sur le bouton pour en ajouter un.
                </div>
              ) : (
                filteredFormations.map(course => {
                  const associatedFolder = folders.find(f => f.associatedFormationIds.includes(course.id));

                  return (
                    <div key={course.id} className="bg-white border border-neutral-200/90 rounded-2xl p-5 space-y-4 shadow-3xs flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start gap-2">
                          <span className="text-[9px] bg-neutral-100 border border-neutral-200/50 text-neutral-600 px-2.5 py-0.5 rounded-full font-bold font-mono">
                            {course.platform}
                          </span>
                          <button
                            onClick={() => deleteLearningCourse(course.id)}
                            className="text-neutral-400 hover:text-red-500 p-1 rounded-lg hover:bg-neutral-50 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <h4 className="text-xs font-black text-neutral-900 leading-snug line-clamp-2 min-h-[36px]">{course.title}</h4>
                        <p className="text-[10px] text-neutral-400 font-bold font-mono">Par {course.instructor} • {course.durationHours} Heures</p>
                        
                        {associatedFolder && (
                          <div className="pt-1">
                            <span className="inline-flex items-center gap-1 text-[9px] font-black bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-sans">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                              {associatedFolder.name}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3 pt-3 border-t border-dashed border-neutral-100 mt-1">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-bold font-mono text-neutral-400">
                            <span>Avancement</span>
                            <span className="text-neutral-900">{course.progressPercent}%</span>
                          </div>
                          <input 
                            type="range" min="0" max="100" value={course.progressPercent}
                            onChange={(e) => updateLearningProgress(course.id, Number(e.target.value))}
                            className="w-full accent-indigo-600 h-1.5 bg-neutral-100 rounded-lg cursor-pointer"
                          />
                        </div>
                        <div className="flex items-center justify-between gap-2 pt-1">
                          <div className="flex flex-col gap-1">
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block text-center ${
                              course.status === "Terminé" ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"
                            }`}>
                              {course.status}
                            </span>
                            
                            <select
                              value={associatedFolder?.id || ""}
                              onChange={(e) => {
                                const targetFolderId = e.target.value;
                                if (setFolders) {
                                  setFolders(prev => prev.map(f => {
                                    // Remove this course from f
                                    let ids = f.associatedFormationIds.filter(id => id !== course.id);
                                    // Add to target folder
                                    if (f.id === targetFolderId) {
                                      ids = [...ids, course.id];
                                    }
                                    return {
                                      ...f,
                                      associatedFormationIds: ids
                                    };
                                  }));
                                }
                              }}
                              className="text-[9px] font-bold text-neutral-500 bg-neutral-50 hover:bg-neutral-100 hover:text-neutral-800 border border-neutral-200 rounded-lg py-0.5 px-1 focus:outline-hidden cursor-pointer max-w-[95px]"
                            >
                              <option value="">📁 Projet...</option>
                              {folders.map(f => (
                                <option key={f.id} value={f.id}>{f.name}</option>
                              ))}
                            </select>
                          </div>

                          <button
                            onClick={() => toggleLearningStatus(course.id, course.status)}
                            className="bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
                          >
                            {course.status === "Terminé" ? "Reprendre" : "Terminer"}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* --- TAB: ACADÉMIE "THE MA CIRCLE" --- */}
      {/* ==================================================== */}
      {activeTab === "ma_circle" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-gradient-to-r from-neutral-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-neutral-800 relative overflow-hidden">
            <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[150%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row justify-between gap-6">
              <div className="space-y-3.5 max-w-xl">
                <div className="inline-flex items-center gap-2 bg-neutral-800/85 border border-neutral-700/60 px-3 py-1 rounded-full">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-[10px] font-black tracking-widest text-neutral-300 uppercase font-mono">Unified Creator Hub</span>
                </div>
                <h2 className="text-2xl font-black font-sans leading-none tracking-tight">THE MA CIRCLE</h2>
                <p className="text-xs text-neutral-300 leading-relaxed font-medium">
                  Monétisez vos canaux : <span className="text-emerald-400 font-bold">The Moroccan CFO</span>, <span className="text-indigo-300 font-bold">The Moroccan Analyst</span>, et <span className="text-cyan-300 font-bold">The Moroccan Economist</span>. 
                  Gérez vos formations sur Udemy pour la visibilité de l'audience, et hébergez vos cours de haut de gamme en formule premium directe !
                </p>
              </div>

              <div className="flex flex-col justify-center gap-2 shrink-0 md:min-w-[220px]">
                {["I. CFO Analyst", "II. Market Analyst", "III. Economist"].map((pillar) => (
                  <div key={pillar} className="flex items-center gap-2.5 bg-neutral-800/30 border border-neutral-800/50 rounded-xl px-3 py-1.5 text-[10.5px] font-extrabold font-mono text-indigo-200">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    <span>{pillar}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subnavigation for the Circle */}
          <div className="flex gap-2 bg-neutral-100 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setMaCircleSubTab("ecosystem")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer select-none ${
                maCircleSubTab === "ecosystem" ? "bg-white text-neutral-950 shadow-xs" : "text-neutral-500 hover:text-neutral-950"
              }`}
            >
              <Tv className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5 text-indigo-500" />
              <span>Canaux & Site ({creatorChannels.length + 1})</span>
            </button>
            <button
              onClick={() => setMaCircleSubTab("courses")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer select-none ${
                maCircleSubTab === "courses" ? "bg-white text-neutral-950 shadow-xs" : "text-neutral-500 hover:text-neutral-950"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5 text-amber-500" />
              <span>Cours Publiés ({publishedCourses.length})</span>
            </button>
            <button
              onClick={() => setMaCircleSubTab("products")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer select-none ${
                maCircleSubTab === "products" ? "bg-white text-neutral-950 shadow-xs" : "text-neutral-500 hover:text-neutral-950"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5 text-emerald-500" />
              <span>Produits Digitaux ({digitalProducts.length})</span>
            </button>
          </div>

          {/* ECOSYSTEM SUBTAB */}
          {maCircleSubTab === "ecosystem" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 border border-neutral-200/60 p-4 rounded-2xl">
                <div>
                  <h3 className="text-xs font-black text-neutral-900 uppercase tracking-tight">Canaux de Contenu & Site Central</h3>
                  <p className="text-[11px] text-neutral-400 font-medium">Gérez la portée de vos différentes chaînes et le trafic de votre portail principal.</p>
                </div>
                <button
                  onClick={() => setShowChannelForm(true)}
                  className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un canal</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Website card */}
                <div className="lg:col-span-1 bg-white border border-neutral-200 rounded-3xl p-5 space-y-4 shadow-3xs flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[9px] bg-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-bold font-mono">SITE CENTRAL MA</span>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-black text-neutral-950 leading-none">{creatorWebsite.name}</h4>
                      <a href={creatorWebsite.url} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-indigo-600">
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <p className="text-xs text-neutral-500 leading-relaxed font-medium">{creatorWebsite.notes}</p>
                    
                    <div className="pt-2">
                      <span className="text-[9px] font-black uppercase text-neutral-400 font-mono block">Volume de trafic estimé :</span>
                      <span className="text-lg font-black font-mono text-indigo-600">{creatorWebsite.monthlyVisitors.toLocaleString()} <span className="text-xs text-neutral-400 font-bold">visites/mois</span></span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 space-y-2">
                    <div className="flex justify-between items-center text-[10px] text-neutral-400 font-bold">
                      <span>Mise à jour du trafic :</span>
                      <span className="text-emerald-500">● {creatorWebsite.status}</span>
                    </div>
                    <input 
                      type="range" min="100" max="25000" step="100" value={creatorWebsite.monthlyVisitors}
                      onChange={(e) => setCreatorWebsite(prev => ({ ...prev, monthlyVisitors: Number(e.target.value) }))}
                      className="w-full accent-indigo-600 h-1 bg-neutral-100 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                {/* Channels cards list */}
                <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {creatorChannels.map(chan => (
                    <div key={chan.id} className="bg-neutral-50/60 hover:bg-neutral-50 border border-neutral-200/50 rounded-2xl p-4 space-y-3 shadow-3xs flex flex-col justify-between transition-colors">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[9px] bg-red-100 text-red-800 px-2.5 py-0.5 rounded-full font-bold font-mono">YOUTUBE</span>
                          <button onClick={() => setCreatorChannels(prev => prev.filter(c => c.id !== chan.id))} className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-xs font-black text-neutral-900 leading-none">{chan.name}</h5>
                          <a href={chan.url} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-indigo-600">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <span className="text-[10px] text-neutral-400 font-bold font-mono block">Thématique: {chan.niche}</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-white border border-neutral-100 p-3 rounded-xl font-mono text-[10.5px]">
                        <div>
                          <span className="text-[8px] text-neutral-400 block font-bold uppercase font-sans">Abonnés</span>
                          <span className="font-extrabold text-neutral-950">{chan.subscribers.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-[8px] text-neutral-400 block font-bold uppercase font-sans">Vidéos</span>
                          <span className="font-extrabold text-neutral-950">{chan.videosCount}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex justify-between items-center text-[9px] text-neutral-400 font-bold font-mono">
                        <span>Statut: {chan.status}</span>
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => setCreatorChannels(prev => prev.map(c => c.id === chan.id ? { ...c, subscribers: c.subscribers + 100 } : c))}
                            className="bg-neutral-200 hover:bg-neutral-300 px-2 py-0.5 rounded text-neutral-800 font-bold cursor-pointer font-sans"
                          >
                            +100 Abonnés
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* COURSES SUBTAB */}
          {maCircleSubTab === "courses" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 border border-neutral-200/60 p-4 rounded-2xl">
                <div>
                  <h3 className="text-xs font-black text-neutral-900 uppercase tracking-tight">Vos Formations & Masterclasses Publiées</h3>
                  <p className="text-[11px] text-neutral-400 font-medium">Gérez vos revenus passifs et le nombre d'élèves inscrits sur Udemy ou en formule directe.</p>
                </div>
                <button
                  onClick={() => setShowCourseForm(true)}
                  className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publier un cours</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {publishedCourses.map(course => (
                  <div key={course.id} className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-4 shadow-3xs flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-[9.5px] bg-indigo-50 border border-indigo-100 text-indigo-800 px-2.5 py-0.5 rounded-full font-black font-mono">
                          {course.platform}
                        </span>
                        <button onClick={() => setPublishedCourses(prev => prev.filter(c => c.id !== course.id))} className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-black text-neutral-900 leading-snug line-clamp-2">{course.title}</h4>
                      <p className="text-[10px] text-neutral-400 font-bold font-mono">Niche: {course.niche} • Note moyenne: ⭐ {course.rating}</p>
                    </div>

                    <div className="grid grid-cols-3 gap-2 bg-neutral-50 border border-neutral-100 p-3 rounded-xl font-mono text-[10.5px]">
                      <div>
                        <span className="text-[8px] text-neutral-400 block font-bold uppercase font-sans">Prix</span>
                        <span className="font-extrabold text-neutral-950">{course.price} MAD</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-neutral-400 block font-bold uppercase font-sans">Élèves</span>
                        <span className="font-extrabold text-indigo-600">{course.studentsCount.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-neutral-400 block font-bold uppercase font-sans">Rev. estimé</span>
                        <span className="font-extrabold text-emerald-600">+{course.monthlyRevenue.toLocaleString()} MAD</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PRODUCTS SUBTAB */}
          {maCircleSubTab === "products" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 border border-neutral-200/60 p-4 rounded-2xl">
                <div>
                  <h3 className="text-xs font-black text-neutral-900 uppercase tracking-tight">Vos Produits Digitaux & Templates Excel</h3>
                  <p className="text-[11px] text-neutral-400 font-medium">Suivez les ventes de vos templates Notion, feuilles de calcul de modélisation BVC et ebooks.</p>
                </div>
                <button
                  onClick={() => setShowProductForm(true)}
                  className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enregistrer un produit</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {digitalProducts.map(prod => (
                  <div key={prod.id} className="bg-white border border-neutral-200 rounded-2xl p-4.5 space-y-3.5 shadow-3xs flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full font-bold font-mono">{prod.platform}</span>
                        <button onClick={() => setDigitalProducts(prev => prev.filter(p => p.id !== prod.id))} className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-[11.5px] font-black text-neutral-900 leading-snug line-clamp-2 min-h-[34px]">{prod.title}</h4>
                      <div className="flex items-center justify-between text-[9px] font-mono text-neutral-400">
                        <span>Niche: {prod.niche}</span>
                        <span className={`px-2 py-0.5 rounded-full font-sans font-bold text-[8.5px] ${
                          prod.status === "Actif" ? "bg-emerald-100 text-emerald-800" : "bg-neutral-100 text-neutral-500"
                        }`}>{prod.status}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1 bg-neutral-50 border border-neutral-100 p-2.5 rounded-xl font-mono text-[10.5px]">
                      <div>
                        <span className="text-[8px] text-neutral-400 block font-bold uppercase font-sans">Prix</span>
                        <span className="font-extrabold text-neutral-950">{prod.price} MAD</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-neutral-400 block font-bold uppercase font-sans">Ventes</span>
                        <span className="font-extrabold text-neutral-900">{prod.salesCount}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-neutral-400 block font-bold uppercase font-sans">Rev.</span>
                        <span className="font-extrabold text-emerald-600">+{prod.revenue.toLocaleString()} MAD</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* --- ALL STREAMLINED FORM MODALS --- */}
      {/* ==================================================== */}
      <AnimatePresence>
        
        {/* ADD PUBLISHED COURSE */}
        {showCourseForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl border max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="text-sm font-black uppercase font-sans">Publier un nouveau cours</h4>
                <button onClick={() => setShowCourseForm(false)} className="cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleAddPublishedCourse} className="space-y-3">
                <input type="text" required placeholder="Titre de la formation" value={cTitle} onChange={e => setCTitle(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs" />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <select value={cNiche} onChange={e => setCNiche(e.target.value as any)} className="bg-neutral-50 border p-2 rounded-xl font-bold">
                    <option value="CFO">CFO Analyst</option><option value="Analyst">Market Analyst</option><option value="Economist">Economist</option><option value="Général">Général</option>
                  </select>
                  <select value={cPlatform} onChange={e => setCPlatform(e.target.value as any)} className="bg-neutral-50 border p-2 rounded-xl font-bold">
                    <option value="Udemy">Udemy</option><option value="THE MA CIRCLE (Direct)">THE MA CIRCLE (Direct)</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <input type="number" required placeholder="Prix (MAD)" value={cPrice} onChange={e => setCPrice(Number(e.target.value))} className="bg-neutral-50 border p-2 rounded-xl" />
                  <input type="number" required placeholder="Élèves" value={cStudents} onChange={e => setCStudents(Number(e.target.value))} className="bg-neutral-50 border p-2 rounded-xl" />
                  <input type="number" required placeholder="Note (ex: 4.8)" step="0.1" max="5" min="1" value={cRating} onChange={e => setCRating(Number(e.target.value))} className="bg-neutral-50 border p-2 rounded-xl" />
                </div>
                <input type="number" required placeholder="Revenus Mensuels (MAD)" value={cRev} onChange={e => setCRev(Number(e.target.value))} className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs font-mono" />
                <button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800 text-white p-2.5 rounded-xl text-xs font-bold cursor-pointer">Publier le cours</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD DIGITAL PRODUCT */}
        {showProductForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl border max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="text-sm font-black uppercase font-sans">Nouveau produit digital</h4>
                <button onClick={() => setShowProductForm(false)} className="cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleAddDigitalProduct} className="space-y-3">
                <input type="text" required placeholder="Nom du produit" value={pTitle} onChange={e => setPTitle(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs" />
                <div className="grid grid-cols-2 gap-2">
                  <select value={pNiche} onChange={e => setPNiche(e.target.value as any)} className="bg-neutral-50 border p-2 rounded-xl text-xs font-bold">
                    <option value="CFO">CFO Analyst</option><option value="Analyst">Market Analyst</option><option value="Economist">Economist</option>
                  </select>
                  <select value={pPlatform} onChange={e => setPPlatform(e.target.value as any)} className="bg-neutral-50 border p-2 rounded-xl text-xs font-bold">
                    <option value="THE MA CIRCLE">THE MA CIRCLE</option><option value="Gumroad">Gumroad</option><option value="E-commerce">E-commerce</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <input type="number" required placeholder="Prix" value={pPrice} onChange={e => setPPrice(Number(e.target.value))} className="bg-neutral-50 border p-2 rounded-xl" />
                  <input type="number" required placeholder="Ventes" value={pSales} onChange={e => setPSales(Number(e.target.value))} className="bg-neutral-50 border p-2 rounded-xl" />
                </div>
                <button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800 text-white p-2.5 rounded-xl text-xs font-bold cursor-pointer">Créer</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD LEARNING COURSE */}
        {showLearnForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl border max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="text-sm font-black uppercase font-sans">Enregistrer un cours suivi</h4>
                <button onClick={() => setShowLearnForm(false)} className="cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleAddLearningCourse} className="space-y-3">
                <input type="text" required placeholder="Titre de la formation" value={lTitle} onChange={e => setLTitle(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs" />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <input type="text" placeholder="Formateur / Expert" value={lInstructor} onChange={e => setLInstructor(e.target.value)} className="bg-neutral-50 border p-2 rounded-xl" />
                  <input type="text" placeholder="Plateforme (Udemy, etc.)" value={lPlatform} onChange={e => setLPlatform(e.target.value)} className="bg-neutral-50 border p-2 rounded-xl" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <input type="number" required placeholder="Durée (Heures)" value={lDuration} onChange={e => setLDuration(Number(e.target.value))} className="bg-neutral-50 border p-2 rounded-xl" />
                  <input type="number" required placeholder="Avancement (%)" value={lProgress} onChange={e => setLProgress(Number(e.target.value))} className="bg-neutral-50 border p-2 rounded-xl" />
                  <select value={lStatus} onChange={e => setLStatus(e.target.value as any)} className="bg-neutral-50 border p-2 rounded-xl font-bold font-sans">
                    <option value="Non commencé">Non commencé</option><option value="En cours">En cours</option><option value="Terminé">Terminé</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-neutral-400 uppercase tracking-wider font-sans block">
                    📁 Associer à un Dossier de Projet
                  </label>
                  <select
                    value={lFolderId}
                    onChange={(e) => setLFolderId(e.target.value)}
                    className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs font-bold font-sans"
                  >
                    <option value="">-- Aucun --</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
                <button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800 text-white p-2.5 rounded-xl text-xs font-bold cursor-pointer">Enregistrer</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD CREATOR CHANNEL */}
        {showChannelForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl border max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="text-sm font-black uppercase font-sans">Ajouter une chaîne YouTube</h4>
                <button onClick={() => setShowChannelForm(false)} className="cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleAddCreatorChannel} className="space-y-3">
                <input type="text" required placeholder="Nom de la chaîne (ex: The Moroccan CFO)" value={chanName} onChange={e => setChanName(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs" />
                <input type="url" placeholder="URL YouTube (https://youtube.com/...)" value={chanUrl} onChange={e => setChanUrl(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs font-mono" />
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <input type="number" placeholder="Nombre d'abonnés" value={chanSubs} onChange={e => setChanSubs(Number(e.target.value))} className="bg-neutral-50 border p-2 rounded-xl" />
                  <input type="number" placeholder="Nombre de vidéos" value={chanVids} onChange={e => setChanVids(Number(e.target.value))} className="bg-neutral-50 border p-2 rounded-xl" />
                </div>
                <input type="text" placeholder="Thématique / Niche (ex: Finance, Immobilier...)" value={chanNiche} onChange={e => setChanNiche(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs" />
                <select value={chanStatus} onChange={e => setChanStatus(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs font-bold">
                  <option value="Actif">Actif</option>
                  <option value="En croissance">En croissance</option>
                  <option value="Pause">Pause</option>
                  <option value="En projet">En projet</option>
                </select>
                <button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800 text-white p-2.5 rounded-xl text-xs font-bold cursor-pointer">Ajouter la chaîne</button>
              </form>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
