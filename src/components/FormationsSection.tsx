import React, { useState, useEffect } from "react";
import { Formation } from "../types";
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Coins, 
  Globe, 
  Sparkles, 
  BookOpen, 
  TrendingUp, 
  Tv, 
  CheckCircle, 
  TrendingDown, 
  Layers, 
  Video, 
  ShoppingBag, 
  Award, 
  Check, 
  X,
  Store,
  DollarSign,
  Users,
  Star,
  Activity,
  ArrowUpRight,
  Sliders,
  Search,
  Building2,
  Briefcase,
  Link2,
  CheckSquare,
  FileText,
  Calendar,
  MapPin,
  Bookmark,
  ExternalLink,
  RefreshCw,
  Heart,
  Pencil,
  Youtube
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

export interface CareerSkill {
  id: string;
  name: string;
  category: "Finance" | "Soft Skills" | "Tech / IA" | "Langues" | "Management" | "Autre";
  status: "Acquise" | "En cours de travail" | "Planifiée";
  notes: string;
  lastUpdated: string;
}

export interface RecruitmentSite {
  id: string;
  name: string;
  url: string;
  notes: string;
  keywords?: string[];
  visited?: boolean;
  discoveredOpportunities?: string;
}

export interface TargetCompany {
  id: string;
  name: string;
  website: string;
  interest: number; 
  notes: string;
  contact?: string; 
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  siteUrl?: string;
  salary?: string;
  status: "À postuler" | "Postulé" | "Entretien" | "Offre" | "Refusé";
  dateApplied?: string;
  nextAction?: string;
  notes: string;
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
}

export default function FormationsSection({ formations, setFormations }: FormationsSectionProps) {
  const [activeTab, setActiveTab] = useState<"ma_circle" | "carriere_pro">("carriere_pro");
  const [carriereSubTab, setCarriereSubTab] = useState<"learning" | "skills" | "recruitment">("learning");
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

  // --- PERSISTENT DATA FOR CARRIÈRE PROFESSIONNELLE ---
  const [skills, setSkills] = useState<CareerSkill[]>(() => {
    const saved = localStorage.getItem("mp_career_skills");
    if (saved) return JSON.parse(saved);
    return [
      { id: "skill_1", name: "Modélisation Financière Excel & Valorisation (DCF)", category: "Finance", status: "En cours de travail", notes: "Maitrise des formules de cascade de cash flow et de scénarios.", lastUpdated: "2026-07-10" },
      { id: "skill_2", name: "Analyse Boursière (BVC) & Allocation d'Actifs", category: "Finance", status: "Acquise", notes: "Compréhension des états financiers cotés et stratégies de dividendes.", lastUpdated: "2026-06-15" },
      { id: "skill_3", name: "IA Générative appliquée à la Finance", category: "Tech / IA", status: "En cours de travail", notes: "Automatisation de rapports et audit de abonnements via LLM.", lastUpdated: "2026-07-12" },
      { id: "skill_4", name: "Prise de parole en public & Pitching", category: "Soft Skills", status: "Planifiée", notes: "S'entraîner pour présenter clairement les rapports semestriels.", lastUpdated: "2026-07-01" }
    ];
  });

  const [recruitmentSites, setRecruitmentSites] = useState<RecruitmentSite[]>(() => {
    const saved = localStorage.getItem("mp_recruitment_sites");
    if (saved) return JSON.parse(saved);
    return [
      { id: "site_1", name: "LinkedIn", url: "https://www.linkedin.com", notes: "Réseautage pro actif et contact direct avec les CFO et HR managers.", keywords: ["Financial Modeling", "Corporate Finance", "Networking", "AI Audit"] },
      { id: "site_2", name: "ReKrute", url: "https://www.rekrute.com", notes: "Idéal pour les cadres et postes financiers intermédiaires/seniors au Maroc.", keywords: ["Contrôle de gestion", "Finance d'entreprise", "Maroc", "CFO"] },
      { id: "site_3", name: "Anapec", url: "https://www.anapec.org", notes: "Suivi des contrats aidés, d'insertion ou d'offres institutionnelles marocaines.", keywords: ["Audit", "Trésorerie", "Jeune diplômé"] }
    ];
  });

  const [targetCompanies, setTargetCompanies] = useState<TargetCompany[]>(() => {
    const saved = localStorage.getItem("mp_target_companies");
    if (saved) return JSON.parse(saved);
    return [
      { id: "comp_1", name: "Attijariwafa Bank", website: "https://www.attijariwafabank.com", interest: 5, notes: "Leader bancaire, opportunités de Corporate Finance de haut niveau.", contact: "M. Khalid Bennani (Finance HR)" },
      { id: "comp_2", name: "Masen", website: "https://www.masen.ma", interest: 5, notes: "Projets d'énergies renouvelables, rôles de contrôleur financier ou modélisateur.", contact: "Mme. Meriem Tazi (Talent)" },
      { id: "comp_3", name: "BCP (Banque Populaire)", website: "https://www.gfbcp.com", interest: 4, notes: "Solide écosystème financier. Département Corporate Finance actif.", contact: "RH Siège" }
    ];
  });

  const [jobOpportunities, setJobOpportunities] = useState<JobOpportunity[]>(() => {
    const saved = localStorage.getItem("mp_job_opportunities");
    if (saved) return JSON.parse(saved);
    return [
      { id: "opp_1", title: "Analyste Financier Senior", company: "Attijariwafa Bank", siteUrl: "https://www.linkedin.com", salary: "18 000 MAD", status: "Entretien", dateApplied: "2026-07-02", nextAction: "Cas pratique de modélisation technique mardi", notes: "Premier entretien RH validé." },
      { id: "opp_2", title: "Contrôleur de Gestion Projet", company: "Masen", siteUrl: "https://www.rekrute.com", salary: "16 500 MAD", status: "Postulé", dateApplied: "2026-07-08", nextAction: "Suivi courtois par LinkedIn le 18 juillet", notes: "Candidature envoyée en direct." },
      { id: "opp_3", title: "Financial Modeler Junior", company: "EY Maroc", siteUrl: "https://www.linkedin.com", salary: "15 000 MAD", status: "À postuler", nextAction: "Adapter le CV avec les projets de modélisation", notes: "Cabinet d'audit de premier plan." }
    ];
  });

  // --- LOCALSTORAGE SYNC ---
  useEffect(() => { localStorage.setItem("mp_published_courses_v2", JSON.stringify(publishedCourses)); }, [publishedCourses]);
  useEffect(() => { localStorage.setItem("mp_digital_products_v2", JSON.stringify(digitalProducts)); }, [digitalProducts]);
  useEffect(() => { localStorage.setItem("mp_creator_channels", JSON.stringify(creatorChannels)); }, [creatorChannels]);
  useEffect(() => { localStorage.setItem("mp_creator_website", JSON.stringify(creatorWebsite)); }, [creatorWebsite]);
  useEffect(() => { localStorage.setItem("mp_career_skills", JSON.stringify(skills)); }, [skills]);
  useEffect(() => { localStorage.setItem("mp_recruitment_sites", JSON.stringify(recruitmentSites)); }, [recruitmentSites]);
  useEffect(() => { localStorage.setItem("mp_target_companies", JSON.stringify(targetCompanies)); }, [targetCompanies]);
  useEffect(() => { localStorage.setItem("mp_job_opportunities", JSON.stringify(jobOpportunities)); }, [jobOpportunities]);

  // --- MODAL / FORM STATES ---
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [showChannelForm, setShowChannelForm] = useState(false);
  const [showLearnForm, setShowLearnForm] = useState(false);
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showSiteForm, setShowSiteForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showOppForm, setShowOppForm] = useState(false);

  // --- FORM VALUES FOR CHANNELS ---
  const [chanName, setChanName] = useState("");
  const [chanUrl, setChanUrl] = useState("");
  const [chanSubs, setChanSubs] = useState(1000);
  const [chanVids, setChanVids] = useState(10);
  const [chanNiche, setChanNiche] = useState("");
  const [chanStatus, setChanStatus] = useState("Actif");

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

  const [skName, setSkName] = useState("");
  const [skCategory, setSkCategory] = useState<CareerSkill["category"]>("Finance");
  const [skStatus, setSkStatus] = useState<CareerSkill["status"]>("En cours de travail");
  const [skNotes, setSkNotes] = useState("");

  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [siteNotes, setSiteNotes] = useState("");
  const [siteKeywords, setSiteKeywords] = useState("");

  const [compName, setCompName] = useState("");
  const [compWebsite, setCompWebsite] = useState("");
  const [compInterest, setCompInterest] = useState(5);
  const [compNotes, setCompNotes] = useState("");
  const [compContact, setCompContact] = useState("");

  const [oppTitle, setOppTitle] = useState("");
  const [oppCompany, setOppCompany] = useState("");
  const [oppSiteUrl, setOppSiteUrl] = useState("");
  const [oppSalary, setOppSalary] = useState("");
  const [oppStatus, setOppStatus] = useState<JobOpportunity["status"]>("À postuler");
  const [oppDateApplied, setOppDateApplied] = useState("");
  const [oppNextAction, setOppNextAction] = useState("");
  const [oppNotes, setOppNotes] = useState("");

  // --- METRIC CALCS ---
  const globalLearnProgress = formations.length > 0 
    ? Math.round(formations.reduce((sum, f) => sum + f.progressPercent, 0) / formations.length) 
    : 0;
  
  const completedLearnCourses = formations.filter(f => f.progressPercent === 100 || f.status === "Terminé").length;
  const acquiredSkillsCount = skills.filter(s => s.status === "Acquise").length;
  const activeOpportunities = jobOpportunities.filter(o => o.status !== "Refusé" && o.status !== "Offre").length;

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
    setFormations(prev => [...prev, {
      id: "learn_" + Date.now(), title: lTitle.trim(), instructor: lInstructor.trim() || "Expert",
      platform: lPlatform.trim() || "Udemy", durationHours: lDuration,
      progressPercent: lStatus === "Terminé" ? 100 : lProgress, status: lStatus
    }]);
    setLTitle(""); setLInstructor(""); setLPlatform(""); setLDuration(10); setLProgress(0);
    setShowLearnForm(false);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skName.trim()) return;
    setSkills(prev => [{
      id: "skill_" + Date.now(), name: skName.trim(), category: skCategory,
      status: skStatus, notes: skNotes.trim(), lastUpdated: new Date().toISOString().split("T")[0]
    }, ...prev]);
    setSkName(""); setSkNotes(""); setShowSkillForm(false);
  };

  const handleAddSite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!siteName.trim()) return;
    const kwArray = siteKeywords ? siteKeywords.split(",").map(k => k.trim()).filter(k => k.length > 0) : [];
    setRecruitmentSites(prev => [{
      id: "site_" + Date.now(), 
      name: siteName.trim(), 
      url: siteUrl.trim() || "#", 
      notes: siteNotes.trim(),
      keywords: kwArray,
      visited: false,
      discoveredOpportunities: ""
    }, ...prev]);
    setSiteName(""); setSiteUrl(""); setSiteNotes(""); setSiteKeywords(""); setShowSiteForm(false);
  };

  const handleAddCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName.trim()) return;
    setTargetCompanies(prev => [{
      id: "comp_" + Date.now(), name: compName.trim(), website: compWebsite.trim() || "#",
      interest: compInterest, notes: compNotes.trim(), contact: compContact.trim()
    }, ...prev]);
    setCompName(""); setCompWebsite(""); setCompContact(""); setCompNotes(""); setShowCompanyForm(false);
  };

  const handleAddOpp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppTitle.trim()) return;
    setJobOpportunities(prev => [{
      id: "opp_" + Date.now(), title: oppTitle.trim(), company: oppCompany.trim(),
      siteUrl: oppSiteUrl.trim(), salary: oppSalary.trim(), status: oppStatus,
      dateApplied: oppDateApplied || new Date().toISOString().split("T")[0],
      nextAction: oppNextAction.trim(), notes: oppNotes.trim()
    }, ...prev]);
    setOppTitle(""); setOppCompany(""); setOppSalary(""); setOppNotes(""); setShowOppForm(false);
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

  const toggleSkillStatus = (id: string) => {
    setSkills(prev => prev.map(s => {
      if (s.id !== id) return s;
      const nextStatus: CareerSkill["status"] = s.status === "Planifiée" 
        ? "En cours de travail" 
        : s.status === "En cours de travail" ? "Acquise" : "Planifiée";
      return { ...s, status: nextStatus, lastUpdated: new Date().toISOString().split("T")[0] };
    }));
  };

  const updateOppStatus = (id: string, status: JobOpportunity["status"]) => {
    setJobOpportunities(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="space-y-6">
      
      {/* 1. SECTOR MAIN TABS */}
      <div className="flex border-b border-neutral-200/80 -mx-6 px-6">
        <button
          onClick={() => setActiveTab("carriere_pro")}
          className={`flex items-center gap-2.5 px-6 py-3.5 text-xs font-black uppercase tracking-widest transition-all border-b-2 -mb-px cursor-pointer select-none ${
            activeTab === "carriere_pro"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-neutral-400 hover:text-neutral-900"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>💼 CARRIÈRE PROFESSIONNELLE & AUTO-FORMATION</span>
        </button>

        <button
          onClick={() => setActiveTab("ma_circle")}
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

      {/* ==================================================== */}
      {/* --- TAB: CARRIÈRE PROFESSIONNELLE & AUTO-FORMATION --- */}
      {/* ==================================================== */}
      {activeTab === "carriere_pro" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Global Header Metrics Grid with the required Global Progress Bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gradient-to-br from-neutral-900 to-indigo-950 text-white rounded-3xl p-6 border border-neutral-800 shadow-md relative overflow-hidden">
            <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[150%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
            
            {/* Global Learning Progress (The absolute main metric requested) */}
            <div className="col-span-1 md:col-span-2 space-y-3.5 border-r border-neutral-800/80 pr-4">
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

            {/* Competency metrics */}
            <div className="col-span-1 pl-2 flex flex-col justify-center space-y-1">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Journal des compétences</span>
              <span className="text-xl font-black font-mono text-emerald-400">{acquiredSkillsCount} Acquises</span>
              <span className="text-[10px] text-neutral-300 font-medium leading-tight">
                Sur un total de {skills.length} compétences suivies activement.
              </span>
            </div>

            {/* Opportunities metrics */}
            <div className="col-span-1 pl-2 flex flex-col justify-center space-y-1 border-l border-neutral-800/80">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Recrutement & Opportunités</span>
              <span className="text-xl font-black font-mono text-amber-400">{activeOpportunities} Actives</span>
              <span className="text-[10px] text-neutral-300 font-medium leading-tight">
                Candidatures en cours d'entretien ou d'analyse.
              </span>
            </div>
          </div>

          {/* INTERNAL SUBNAGIVATION BAR */}
          <div className="flex gap-2 bg-neutral-100 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setCarriereSubTab("learning")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer select-none ${
                carriereSubTab === "learning" ? "bg-white text-neutral-950 shadow-xs" : "text-neutral-500 hover:text-neutral-950"
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5 text-indigo-500" />
              <span>Formations Suivies ({formations.length})</span>
            </button>
            <button
              onClick={() => setCarriereSubTab("skills")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer select-none ${
                carriereSubTab === "skills" ? "bg-white text-neutral-950 shadow-xs" : "text-neutral-500 hover:text-neutral-950"
              }`}
            >
              <Award className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5 text-emerald-500" />
              <span>Journal des Compétences ({skills.length})</span>
            </button>
            <button
              onClick={() => setCarriereSubTab("recruitment")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer select-none ${
                carriereSubTab === "recruitment" ? "bg-white text-neutral-950 shadow-xs" : "text-neutral-500 hover:text-neutral-950"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5 text-amber-500" />
              <span>Opportunités & Recrutement ({jobOpportunities.length})</span>
            </button>
          </div>

          {/* ================= SUBTAB: FORMATIONS SUIVIES ================= */}
          {carriereSubTab === "learning" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 border border-neutral-200/60 p-4 rounded-2xl">
                <div>
                  <h3 className="text-xs font-black text-neutral-900 uppercase tracking-tight">Vos Programmes d'Études</h3>
                  <p className="text-[11px] text-neutral-400 font-medium">Gérez votre apprentissage, relisez vos chapitres et complétez les modules de vos cours.</p>
                </div>
                <button
                  onClick={() => setShowLearnForm(true)}
                  className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enregistrer un cours</span>
                </button>
              </div>

              {/* Grid representation */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {formations.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-neutral-400 bg-white border border-dashed border-neutral-200 rounded-3xl italic text-xs">
                    Aucun cours d'apprentissage enregistré. Cliquez sur le bouton pour en ajouter un.
                  </div>
                ) : (
                  formations.map(course => (
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
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            course.status === "Terminé" ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"
                          }`}>
                            {course.status}
                          </span>
                          <button
                            onClick={() => toggleLearningStatus(course.id, course.status)}
                            className="bg-neutral-900 hover:bg-neutral-800 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                          >
                            {course.status === "Terminé" ? "Reprendre" : "Terminer"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= SUBTAB: JOURNAL DES COMPÉTENCES ================= */}
          {carriereSubTab === "skills" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 border border-neutral-200/60 p-4 rounded-2xl">
                <div>
                  <h3 className="text-xs font-black text-neutral-900 uppercase tracking-tight">Journal de Bord des Compétences</h3>
                  <p className="text-[11px] text-neutral-400 font-medium">Cartographiez les compétences acquises ou que vous travaillez activement au quotidien.</p>
                </div>
                <button
                  onClick={() => setShowSkillForm(true)}
                  className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enregistrer une compétence</span>
                </button>
              </div>

              {/* Skills cards list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {skills.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-neutral-400 bg-white border border-dashed border-neutral-200 rounded-3xl italic text-xs">
                    Aucune compétence enregistrée. Cliquez sur le bouton pour en ajouter une.
                  </div>
                ) : (
                  skills.map(skill => (
                    <div 
                      key={skill.id} 
                      className="bg-white border border-neutral-200/90 rounded-2xl p-5 space-y-3.5 shadow-3xs flex flex-col justify-between hover:border-neutral-300 transition-colors"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full font-mono ${
                            skill.category === "Finance" ? "bg-emerald-100 text-emerald-800" :
                            skill.category === "Tech / IA" ? "bg-indigo-100 text-indigo-800" :
                            skill.category === "Soft Skills" ? "bg-purple-100 text-purple-800" :
                            "bg-cyan-100 text-cyan-800"
                          }`}>
                            {skill.category}
                          </span>
                          <span className="text-[9px] text-neutral-400 font-mono">Mis à jour: {skill.lastUpdated}</span>
                        </div>
                        <h4 className="text-xs font-black text-neutral-900 leading-snug">{skill.name}</h4>
                        <p className="text-xs text-neutral-500 leading-relaxed font-medium">{skill.notes}</p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-neutral-100 gap-2">
                        <button
                          onClick={() => toggleSkillStatus(skill.id)}
                          className={`text-[9.5px] font-black uppercase px-2.5 py-1 rounded-lg border cursor-pointer select-none transition-all flex items-center gap-1 ${
                            skill.status === "Acquise" 
                              ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                              : skill.status === "En cours de travail" 
                                ? "bg-indigo-50 border-indigo-200 text-indigo-800 animate-pulse"
                                : "bg-neutral-50 border-neutral-200 text-neutral-600"
                          }`}
                        >
                          {skill.status === "Acquise" && <Check className="w-3 h-3 text-emerald-600" />}
                          {skill.status === "En cours de travail" && <RefreshCw className="w-3 h-3 text-indigo-600 spin" />}
                          {skill.status === "Planifiée" && <Calendar className="w-3 h-3 text-neutral-500" />}
                          <span>{skill.status}</span>
                        </button>

                        <button 
                          onClick={() => setSkills(prev => prev.filter(s => s.id !== skill.id))}
                          className="text-neutral-400 hover:text-red-500 p-1.5 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
                          title="Supprimer la compétence"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* ================= SUBTAB: SUIVI RECRUTEMENT & SITES ================= */}
          {carriereSubTab === "recruitment" && (
            <div className="space-y-6">
              
              {/* Kanban layout for applications / opportunities */}
              <div className="space-y-3.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 border border-neutral-200/60 p-4 rounded-2xl">
                  <div>
                    <h3 className="text-xs font-black text-neutral-900 uppercase tracking-tight flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-amber-500" />
                      <span>Pipeline des Opportunités & Candidatures</span>
                    </h3>
                    <p className="text-[11px] text-neutral-400 font-medium">Gérez votre entonnoir d'embauche de la détection technique jusqu'aux entretiens et offres d'emploi.</p>
                  </div>
                  <button
                    onClick={() => setShowOppForm(true)}
                    className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Créer une opportunité</span>
                  </button>
                </div>

                {/* Vertical interactive column tracker for opportunities */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {["À postuler", "Postulé", "Entretien", "Offre"].map((colTitle) => {
                    const statusKey = colTitle as JobOpportunity["status"];
                    const oppsInCol = jobOpportunities.filter(o => o.status === statusKey);
                    
                    return (
                      <div key={colTitle} className="bg-neutral-50/70 border border-neutral-200/60 rounded-2xl p-4 flex flex-col space-y-3">
                        <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
                          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-700 font-mono">{colTitle}</span>
                          <span className="text-[10px] bg-neutral-200 text-neutral-800 font-bold px-2 py-0.5 rounded-full font-mono">{oppsInCol.length}</span>
                        </div>

                        <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
                          {oppsInCol.length === 0 ? (
                            <div className="py-8 text-center text-[10px] text-neutral-400 italic bg-white/40 border border-dashed border-neutral-200/50 rounded-xl">
                              Aucune opportunité.
                            </div>
                          ) : (
                            oppsInCol.map(opp => (
                              <div key={opp.id} className="bg-white border border-neutral-200 rounded-xl p-3.5 space-y-2.5 shadow-3xs hover:border-neutral-300 transition-colors relative">
                                <div className="space-y-1">
                                  <h5 className="text-[11px] font-black text-neutral-900 leading-snug">{opp.title}</h5>
                                  <p className="text-[10.5px] font-bold text-indigo-600 flex items-center gap-1">
                                    <Building2 className="w-3 h-3" />
                                    <span>{opp.company}</span>
                                  </p>
                                </div>

                                {opp.salary && (
                                  <span className="inline-block text-[9px] bg-emerald-50 border border-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-bold font-mono">
                                    {opp.salary}
                                  </span>
                                )}

                                <p className="text-[10px] text-neutral-500 leading-snug font-medium line-clamp-2">{opp.notes}</p>

                                {opp.nextAction && (
                                  <div className="bg-amber-50/60 border border-amber-100 p-2 rounded-lg space-y-0.5">
                                    <span className="text-[8px] text-amber-800 font-black uppercase font-mono block">Prochaine action:</span>
                                    <p className="text-[9.5px] text-neutral-700 leading-snug font-bold">{opp.nextAction}</p>
                                  </div>
                                )}

                                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[9px] gap-1">
                                  <div className="flex gap-1">
                                    {/* Quick promotion actions */}
                                    {statusKey === "À postuler" && (
                                      <button 
                                        onClick={() => updateOppStatus(opp.id, "Postulé")}
                                        className="text-indigo-600 hover:underline font-bold"
                                      >
                                        Postuler →
                                      </button>
                                    )}
                                    {statusKey === "Postulé" && (
                                      <button 
                                        onClick={() => updateOppStatus(opp.id, "Entretien")}
                                        className="text-amber-600 hover:underline font-bold"
                                      >
                                        Entretien →
                                      </button>
                                    )}
                                    {statusKey === "Entretien" && (
                                      <button 
                                        onClick={() => updateOppStatus(opp.id, "Offre")}
                                        className="text-emerald-600 hover:underline font-bold"
                                      >
                                        Obtenu 🎉
                                      </button>
                                    )}
                                  </div>

                                  <div className="flex gap-1.5">
                                    {statusKey !== "Refusé" && (
                                      <button 
                                        onClick={() => updateOppStatus(opp.id, "Refusé")}
                                        className="text-neutral-400 hover:text-red-500 font-bold"
                                        title="Marquer refusé"
                                      >
                                        Refusé
                                      </button>
                                    )}
                                    <button 
                                      onClick={() => setJobOpportunities(prev => prev.filter(o => o.id !== opp.id))}
                                      className="text-neutral-400 hover:text-red-500 font-bold"
                                      title="Supprimer"
                                    >
                                      Suppr.
                                    </button>
                                  </div>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Websites and targeted companies */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                
                {/* Recruitment websites */}
                <div className="bg-white border border-neutral-200 rounded-3xl p-5 space-y-4 shadow-3xs">
                  <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
                    <div>
                      <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wide flex items-center gap-1.5">
                        <Link2 className="w-4 h-4 text-indigo-500" />
                        <span>Portails & Sites de Recrutement</span>
                      </h4>
                      <p className="text-[10px] text-neutral-400 font-bold mt-0.5 font-mono">
                        Visites régulières : {recruitmentSites.filter(s => s.visited).length}/{recruitmentSites.length} visités
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {recruitmentSites.some(s => s.visited) && (
                        <button
                          onClick={() => setRecruitmentSites(prev => prev.map(s => ({ ...s, visited: false })))}
                          className="text-neutral-400 hover:text-indigo-600 text-[10px] font-bold font-sans transition-colors cursor-pointer"
                        >
                          Tout décocher
                        </button>
                      )}
                      <button
                        onClick={() => setShowSiteForm(true)}
                        className="text-indigo-600 hover:text-indigo-500 text-[10.5px] font-black flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3.5 max-h-[550px] overflow-y-auto pr-1">
                    {recruitmentSites.map(site => (
                      <div 
                        key={site.id} 
                        className={`p-4 rounded-xl border flex flex-col gap-3 transition-all ${
                          site.visited 
                            ? "bg-neutral-50/40 border-neutral-200/40 opacity-75" 
                            : "bg-neutral-50 hover:bg-neutral-100/60 border-neutral-200/40"
                        }`}
                      >
                        <div className="flex justify-between gap-3 items-start">
                          <div className="flex items-start gap-2.5 flex-1">
                            <input 
                              type="checkbox"
                              checked={!!site.visited}
                              onChange={() => {
                                setRecruitmentSites(prev => prev.map(s => {
                                  if (s.id !== site.id) return s;
                                  return { ...s, visited: !s.visited };
                                }));
                              }}
                              className="mt-0.5 w-4 h-4 rounded-md border-neutral-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                              id={`site-check-${site.id}`}
                            />
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center gap-1.5">
                                <label 
                                  htmlFor={`site-check-${site.id}`}
                                  className={`text-xs font-black cursor-pointer select-none transition-all ${
                                    site.visited ? "line-through text-neutral-400" : "text-neutral-900"
                                  }`}
                                >
                                  {site.name}
                                </label>
                                <a 
                                  href={site.url} target="_blank" rel="noopener noreferrer" 
                                  className="text-indigo-600 hover:text-indigo-500 p-0.5 transition-colors"
                                  title={`Visiter ${site.name}`}
                                >
                                  <ExternalLink className="w-3 h-3 inline-block" />
                                </a>
                              </div>
                              <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">{site.notes}</p>
                            </div>
                          </div>

                          <button 
                            onClick={() => setRecruitmentSites(prev => prev.filter(s => s.id !== site.id))}
                            className="text-neutral-400 hover:text-red-500 p-1 rounded-lg shrink-0 cursor-pointer transition-colors"
                            title="Supprimer ce site"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Keywords & Specific Skills */}
                        <div className="space-y-1.5 pt-1 pl-6.5 border-t border-neutral-200/40">
                          <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 font-mono block">Mots-clés & Compétences cibles:</span>
                          <div className="flex flex-wrap gap-1">
                            {site.keywords && site.keywords.length > 0 ? (
                              site.keywords.map((kw, idx) => (
                                <span key={idx} className="group relative text-[9px] bg-indigo-50 hover:bg-red-50 text-indigo-700 hover:text-red-700 border border-indigo-100/60 hover:border-red-200 px-2 py-0.5 rounded-full font-bold font-mono transition-all flex items-center gap-1">
                                  <span>#{kw}</span>
                                  <button 
                                    onClick={() => {
                                      setRecruitmentSites(prev => prev.map(s => {
                                        if (s.id !== site.id) return s;
                                        return { ...s, keywords: (s.keywords || []).filter(k => k !== kw) };
                                      }));
                                    }}
                                    className="text-[8px] opacity-60 hover:opacity-100 cursor-pointer"
                                    title="Supprimer"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))
                            ) : (
                              <span className="text-[10px] text-neutral-400 italic">Aucun mot-clé associé.</span>
                            )}
                          </div>
                          
                          {/* Inline Form to add keyword */}
                          <form 
                            onSubmit={(e) => {
                              e.preventDefault();
                              const input = e.currentTarget.elements.namedItem("newKw") as HTMLInputElement;
                              const val = input?.value?.trim();
                              if (val) {
                                setRecruitmentSites(prev => prev.map(s => {
                                  if (s.id !== site.id) return s;
                                  const currentKws = s.keywords || [];
                                  if (currentKws.includes(val)) return s;
                                  return { ...s, keywords: [...currentKws, val] };
                                }));
                                input.value = "";
                              }
                            }}
                            className="flex items-center gap-1.5 pt-0.5 max-w-[200px]"
                          >
                            <input 
                              type="text"
                              name="newKw"
                              placeholder="+ Ajouter mot-clé"
                              className="bg-white border border-neutral-200/80 rounded-lg px-2 py-0.5 text-[10px] font-mono w-full focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                            />
                          </form>
                        </div>

                        {/* Interactive Text Field for Discovered Opportunities */}
                        <div className="pt-2.5 pl-6.5 border-t border-neutral-200/40 space-y-1.5">
                          <label className="text-[9px] font-black uppercase tracking-wider text-neutral-400 font-mono block">
                            Opportunités découvertes & candidatures :
                          </label>
                          <textarea
                            value={site.discoveredOpportunities || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setRecruitmentSites(prev => prev.map(s => {
                                if (s.id !== site.id) return s;
                                return { ...s, discoveredOpportunities: val };
                              }));
                            }}
                            placeholder="Ex: Vu offre de CFO chez XYZ Corp, contacté le recruteur... / Postulé via Easy Apply..."
                            className="w-full bg-white border border-neutral-200/85 rounded-xl p-2.5 text-[10.5px] leading-relaxed text-neutral-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-neutral-400 font-medium font-sans"
                            rows={2}
                          />
                        </div>

                      </div>
                    ))}
                  </div>
                </div>

                {/* Target Companies */}
                <div className="bg-white border border-neutral-200 rounded-3xl p-5 space-y-4 shadow-3xs">
                  <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-emerald-500" />
                      <span>Entreprises Cibles de Choix</span>
                    </h4>
                    <button
                      onClick={() => setShowCompanyForm(true)}
                      className="text-indigo-600 hover:text-indigo-500 text-[10.5px] font-black flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {targetCompanies.map(comp => (
                      <div key={comp.id} className="bg-neutral-50 hover:bg-neutral-100/60 p-4 rounded-xl border border-neutral-200/40 space-y-2 transition-all">
                        <div className="flex justify-between items-start gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-black text-neutral-900">{comp.name}</span>
                              <a 
                                href={comp.website} target="_blank" rel="noopener noreferrer" 
                                className="text-indigo-600 hover:text-indigo-500"
                              >
                                <ExternalLink className="w-3 h-3 inline-block" />
                              </a>
                            </div>
                            {comp.contact && (
                              <span className="text-[9.5px] text-indigo-500 font-bold block font-mono">Contact: {comp.contact}</span>
                            )}
                          </div>
                          
                          {/* Stars */}
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, idx) => (
                              <Star 
                                key={idx} 
                                className={`w-3 h-3 ${idx < comp.interest ? "fill-amber-400 stroke-amber-400" : "text-neutral-200"}`} 
                              />
                            ))}
                          </div>
                        </div>

                        <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">{comp.notes}</p>

                        <div className="text-right">
                          <button 
                            onClick={() => setTargetCompanies(prev => prev.filter(c => c.id !== comp.id))}
                            className="text-[10px] text-neutral-400 hover:text-red-500 cursor-pointer"
                          >
                            Retirer
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      )}

      {/* ==================================================== */}
      {/* --- TAB: ACADÉMIE "THE MA CIRCLE" (SELLING/PRODUCTS) --- */}
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
                  <div key={pillar} className="bg-neutral-800/40 border border-neutral-700/40 rounded-xl px-3.5 py-2 flex items-center gap-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span className="text-[10px] font-black tracking-wide text-neutral-200 font-mono uppercase">{pillar}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 mt-6 border-t border-neutral-800/70 relative z-10">
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4 text-center">
                <span className="text-[9px] text-neutral-400 block uppercase font-mono font-bold tracking-wider">Élèves Enregistrés</span>
                <span className="text-xl font-black font-mono text-white mt-1 block">
                  {publishedCourses.reduce((sum, c) => sum + c.studentsCount, 0).toLocaleString()}
                </span>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4 text-center">
                <span className="text-[9px] text-neutral-400 block uppercase font-mono font-bold tracking-wider">Revenus Udemy Est.</span>
                <span className="text-xl font-black font-mono text-emerald-400 mt-1 block">
                  {publishedCourses.filter(c => c.platform === "Udemy").reduce((sum, c) => sum + c.monthlyRevenue, 0).toLocaleString()} MAD / m
                </span>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4 text-center">
                <span className="text-[9px] text-neutral-400 block uppercase font-mono font-bold tracking-wider">Revenus Directs Est.</span>
                <span className="text-xl font-black font-mono text-indigo-400 mt-1 block">
                  {publishedCourses.filter(c => c.platform === "THE MA CIRCLE (Direct)").reduce((sum, c) => sum + c.monthlyRevenue, 0).toLocaleString()} MAD / m
                </span>
              </div>
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4 text-center">
                <span className="text-[9px] text-neutral-400 block uppercase font-mono font-bold tracking-wider">Produits Digitaux CA</span>
                <span className="text-xl font-black font-mono text-white mt-1 block">
                  {digitalProducts.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()} MAD
                </span>
              </div>
            </div>
          </div>

          {/* Sub-navigation inside MA CIRCLE */}
          <div className="flex gap-2 bg-neutral-100 p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setMaCircleSubTab("ecosystem")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer select-none ${
                maCircleSubTab === "ecosystem" ? "bg-white text-neutral-950 shadow-xs" : "text-neutral-500 hover:text-neutral-950"
              }`}
            >
              <Globe className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5 text-indigo-500" />
              <span>Médias & Écosystème ({creatorChannels.length + 1})</span>
            </button>
            <button
              onClick={() => setMaCircleSubTab("courses")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer select-none ${
                maCircleSubTab === "courses" ? "bg-white text-neutral-950 shadow-xs" : "text-neutral-500 hover:text-neutral-950"
              }`}
            >
              <Video className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5 text-emerald-500" />
              <span>Mes Formations Produites ({publishedCourses.length})</span>
            </button>
            <button
              onClick={() => setMaCircleSubTab("products")}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer select-none ${
                maCircleSubTab === "products" ? "bg-white text-neutral-950 shadow-xs" : "text-neutral-500 hover:text-neutral-950"
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5 text-amber-500" />
              <span>Produits Digitaux ({digitalProducts.length})</span>
            </button>
          </div>

          {/* SUBTAB: ECOSYSTEM */}
          {maCircleSubTab === "ecosystem" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              
              {/* Top info card with add channel button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 border border-neutral-200/60 p-4 rounded-2xl">
                <div>
                  <h3 className="text-xs font-black text-neutral-900 uppercase tracking-tight">Canaux Médias & Plateforme Web</h3>
                  <p className="text-[11px] text-neutral-400 font-medium">Gérez la présence en ligne de vos chaînes YouTube et les performances de votre site web académique.</p>
                </div>
                <button
                  onClick={() => setShowChannelForm(true)}
                  className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter une chaîne</span>
                </button>
              </div>

              {/* Grid with 2 parts: Left is Website Performance & Details, Right is YouTube Channels */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* 1. WEBSITE CARD (THE MA CIRCLE) */}
                <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 space-y-4 shadow-3xs lg:col-span-1">
                  <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
                    <span className="text-xs font-black text-neutral-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Globe className="w-4 h-4 text-indigo-500" />
                      <span>Site Web Académique</span>
                    </span>
                    <span className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-100/60 px-2 py-0.5 rounded-full font-bold font-mono">
                      {creatorWebsite.status}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-neutral-50/50 p-4 rounded-2xl border border-neutral-100 space-y-3">
                      <div>
                        <h4 className="text-sm font-black text-neutral-900">{creatorWebsite.name}</h4>
                        <a 
                          href={creatorWebsite.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-xs text-indigo-600 hover:text-indigo-500 font-mono font-medium hover:underline flex items-center gap-1 mt-0.5"
                        >
                          <span>{creatorWebsite.url}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>

                      <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">
                        {creatorWebsite.notes}
                      </p>
                    </div>

                    {/* Visitors & Traffic stat with quick increase/decrease controls */}
                    <div className="bg-neutral-50/50 p-4 rounded-2xl border border-neutral-100 space-y-2">
                      <div className="flex justify-between items-baseline">
                        <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider font-mono">Trafic Mensuel Estimé</span>
                        <span className="text-lg font-mono font-black text-neutral-900">{creatorWebsite.monthlyVisitors.toLocaleString()} Visiteurs</span>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => setCreatorWebsite(prev => ({ ...prev, monthlyVisitors: Math.max(0, prev.monthlyVisitors - 250) }))}
                          className="bg-white hover:bg-neutral-100 text-neutral-700 text-[10px] font-bold border rounded-lg px-2.5 py-1 flex-1 transition-all cursor-pointer"
                        >
                          -250
                        </button>
                        <button 
                          onClick={() => setCreatorWebsite(prev => ({ ...prev, monthlyVisitors: prev.monthlyVisitors + 250 }))}
                          className="bg-white hover:bg-neutral-100 text-neutral-700 text-[10px] font-bold border rounded-lg px-2.5 py-1 flex-1 transition-all cursor-pointer"
                        >
                          +250
                        </button>
                      </div>
                    </div>

                    {/* Inline edit notes for website */}
                    <div className="space-y-1">
                      <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider font-mono">Modifier les objectifs du site :</label>
                      <textarea
                        value={creatorWebsite.notes}
                        onChange={(e) => setCreatorWebsite(prev => ({ ...prev, notes: e.target.value }))}
                        className="w-full bg-neutral-50/50 border p-2 rounded-xl text-[11px] h-20 leading-relaxed text-neutral-600 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all"
                        placeholder="Quels sont les objectifs ou les intégrations en cours ?"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. YOUTUBE CHANNELS SECTION */}
                <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 space-y-4 shadow-3xs lg:col-span-2">
                  <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
                    <span className="text-xs font-black text-neutral-900 uppercase tracking-wide flex items-center gap-1.5">
                      <Youtube className="w-4 h-4 text-red-600" />
                      <span>Canaux YouTube Actifs</span>
                    </span>
                    <span className="text-[9px] bg-red-50 text-red-600 border border-red-100/60 px-2.5 py-0.5 rounded-full font-bold font-mono">
                      {creatorChannels.length} Chaînes
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {creatorChannels.map(channel => (
                      <div key={channel.id} className="bg-neutral-50 border border-neutral-200/40 hover:border-neutral-200 rounded-2xl p-4.5 space-y-3.5 transition-all">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[8px] bg-indigo-50 text-indigo-700 font-black px-2 py-0.5 rounded-full font-mono uppercase">
                              {channel.niche}
                            </span>
                            <h4 className="text-xs font-black text-neutral-900 mt-1 flex items-center gap-1.5">
                              <span>{channel.name}</span>
                              <a 
                                href={channel.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-red-500 hover:text-red-600"
                              >
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </h4>
                          </div>
                          
                          <button 
                            onClick={() => setCreatorChannels(prev => prev.filter(c => c.id !== channel.id))}
                            className="text-neutral-400 hover:text-red-500 p-1 rounded-lg hover:bg-neutral-200/30 transition-all cursor-pointer"
                            title="Supprimer la chaîne"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Interactive Stats Panel inside Channel card */}
                        <div className="grid grid-cols-2 gap-3.5 bg-white p-3 rounded-xl border border-neutral-200/40">
                          
                          {/* Subscribers with inline increase/decrease */}
                          <div className="space-y-1 text-center border-r border-neutral-100 pr-1">
                            <span className="text-[8px] text-neutral-400 font-bold block uppercase font-mono tracking-wider">Abonnés</span>
                            <span className="text-[13px] font-mono font-black text-neutral-800">
                              {channel.subscribers.toLocaleString()}
                            </span>
                            <div className="flex justify-center gap-1 mt-0.5">
                              <button 
                                onClick={() => setCreatorChannels(prev => prev.map(c => c.id === channel.id ? { ...c, subscribers: Math.max(0, c.subscribers - 100) } : c))}
                                className="bg-neutral-50 hover:bg-neutral-100 text-[8px] font-bold px-1.5 py-0.5 rounded border"
                              >
                                -100
                              </button>
                              <button 
                                onClick={() => setCreatorChannels(prev => prev.map(c => c.id === channel.id ? { ...c, subscribers: c.subscribers + 100 } : c))}
                                className="bg-neutral-50 hover:bg-neutral-100 text-[8px] font-bold px-1.5 py-0.5 rounded border"
                              >
                                +100
                              </button>
                            </div>
                          </div>

                          {/* Videos count with inline increase/decrease */}
                          <div className="space-y-1 text-center pl-1">
                            <span className="text-[8px] text-neutral-400 font-bold block uppercase font-mono tracking-wider">Vidéos</span>
                            <span className="text-[13px] font-mono font-black text-neutral-800">
                              {channel.videosCount}
                            </span>
                            <div className="flex justify-center gap-1 mt-0.5">
                              <button 
                                onClick={() => setCreatorChannels(prev => prev.map(c => c.id === channel.id ? { ...c, videosCount: Math.max(0, c.videosCount - 1) } : c))}
                                className="bg-neutral-50 hover:bg-neutral-100 text-[8px] font-bold px-1.5 py-0.5 rounded border"
                              >
                                -1
                              </button>
                              <button 
                                onClick={() => setCreatorChannels(prev => prev.map(c => c.id === channel.id ? { ...c, videosCount: c.videosCount + 1 } : c))}
                                className="bg-neutral-50 hover:bg-neutral-100 text-[8px] font-bold px-1.5 py-0.5 rounded border"
                              >
                                +1
                              </button>
                            </div>
                          </div>

                        </div>

                        {/* Status badge edit */}
                        <div className="flex justify-between items-center pt-0.5">
                          <span className="text-[9px] text-neutral-400 font-bold font-mono uppercase">Statut :</span>
                          <select 
                            value={channel.status}
                            onChange={(e) => setCreatorChannels(prev => prev.map(c => c.id === channel.id ? { ...c, status: e.target.value } : c))}
                            className="bg-white border border-neutral-200 text-[10px] rounded-md px-1.5 py-0.5 font-bold font-mono focus:outline-hidden"
                          >
                            <option value="Actif">Actif</option>
                            <option value="En croissance">En croissance</option>
                            <option value="Pause">Pause</option>
                            <option value="En projet">En projet</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* SUBTAB: COURSES PRODUCED */}
          {maCircleSubTab === "courses" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 border border-neutral-200/60 p-4 rounded-2xl">
                <div>
                  <h3 className="text-xs font-black text-neutral-900 uppercase tracking-tight">Catalogue des Formations Produites</h3>
                  <p className="text-[11px] text-neutral-400 font-medium">Formations distribuées sur Udemy ou directement en formule premium.</p>
                </div>
                <button
                  onClick={() => setShowCourseForm(true)}
                  className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                >
                  <Plus className="w-4 h-4" />
                  <span>Publier un Cours</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 1. COURSES HORS UDEMY */}
                <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 space-y-4 shadow-3xs">
                  <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
                    <span className="text-xs font-black text-neutral-900 uppercase tracking-wide">Direct THE MA CIRCLE</span>
                    <span className="text-[10px] bg-neutral-100 text-neutral-800 border px-2 py-0.5 rounded-full font-bold font-mono">
                      {publishedCourses.filter(c => c.platform !== "Udemy").length} Cours
                    </span>
                  </div>

                  <div className="space-y-3">
                    {publishedCourses.filter(c => c.platform !== "Udemy").map(course => (
                      <div key={course.id} className="bg-neutral-50 border border-neutral-200/50 rounded-xl p-4 space-y-2.5">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[8px] bg-indigo-100 text-indigo-800 font-black px-2 py-0.5 rounded-full font-mono">{course.niche}</span>
                            <h5 className="text-[11px] font-black text-neutral-900 pt-1">{course.title}</h5>
                          </div>
                          <button 
                            onClick={() => setPublishedCourses(prev => prev.filter(c => c.id !== course.id))}
                            className="text-neutral-400 hover:text-red-500 cursor-pointer p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] border-t border-neutral-200/50 pt-2 font-mono">
                          <div><span className="text-neutral-400 block text-[8px]">Prix</span><span className="font-bold">{course.price} MAD</span></div>
                          <div><span className="text-neutral-400 block text-[8px]">Élèves</span><span className="font-bold">{course.studentsCount}</span></div>
                          <div><span className="text-neutral-400 block text-[8px]">Revenu Est.</span><span className="font-bold text-indigo-600">+{course.monthlyRevenue} MAD/m</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 2. COURSES ON UDEMY */}
                <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 space-y-4 shadow-3xs">
                  <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
                    <span className="text-xs font-black text-neutral-900 uppercase tracking-wide">Sur Plateforme Udemy</span>
                    <span className="text-[10px] bg-neutral-100 text-neutral-800 border px-2 py-0.5 rounded-full font-bold font-mono">
                      {publishedCourses.filter(c => c.platform === "Udemy").length} Cours
                    </span>
                  </div>

                  <div className="space-y-3">
                    {publishedCourses.filter(c => c.platform === "Udemy").map(course => (
                      <div key={course.id} className="bg-neutral-50 border border-neutral-200/50 rounded-xl p-4 space-y-2.5">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[8px] bg-emerald-100 text-emerald-800 font-black px-2 py-0.5 rounded-full font-mono">{course.niche}</span>
                            <h5 className="text-[11px] font-black text-neutral-900 pt-1">{course.title}</h5>
                          </div>
                          <button 
                            onClick={() => setPublishedCourses(prev => prev.filter(c => c.id !== course.id))}
                            className="text-neutral-400 hover:text-red-500 cursor-pointer p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="grid grid-cols-4 gap-2 text-center text-[10px] border-t border-neutral-200/50 pt-2 font-mono">
                          <div><span className="text-neutral-400 block text-[8px]">Prix</span><span className="font-bold">{course.price} MAD</span></div>
                          <div><span className="text-neutral-400 block text-[8px]">Élèves</span><span className="font-bold">{course.studentsCount}</span></div>
                          <div><span className="text-neutral-400 block text-[8px]">Revenu</span><span className="font-bold text-emerald-600">+{course.monthlyRevenue} MAD</span></div>
                          <div><span className="text-neutral-400 block text-[8px]">Note</span><span className="font-bold text-amber-500">★ {course.rating}</span></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUBTAB: DIGITAL PRODUCTS */}
          {maCircleSubTab === "products" && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 border border-neutral-200/60 p-4 rounded-2xl">
                <div>
                  <h3 className="text-xs font-black text-neutral-900 uppercase tracking-tight">Vos Produits Digitaux d'Élite</h3>
                  <p className="text-[11px] text-neutral-400 font-medium">Modèles d'analyse financière Excel, templates Notion et guides PDF.</p>
                </div>
                <button
                  onClick={() => setShowProductForm(true)}
                  className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                >
                  <Plus className="w-4 h-4" />
                  <span>Ajouter un Produit</span>
                </button>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-3xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-black text-neutral-500 uppercase tracking-wider font-mono">
                      <th className="p-4 pl-6">Produit Digital</th>
                      <th className="p-4">Niche</th>
                      <th className="p-4">Plateforme</th>
                      <th className="p-4 font-mono">Prix</th>
                      <th className="p-4 font-mono">Ventes</th>
                      <th className="p-4 font-mono">Chiffre d'Affaires</th>
                      <th className="p-4">État</th>
                      <th className="p-4 pr-6 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {digitalProducts.map(p => (
                      <tr key={p.id} className="hover:bg-neutral-50/50">
                        <td className="p-4 pl-6 font-bold text-neutral-900">{p.title}</td>
                        <td className="p-4"><span className="text-[9px] bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded font-mono font-bold">{p.niche}</span></td>
                        <td className="p-4 font-mono font-medium text-neutral-500">{p.platform}</td>
                        <td className="p-4 font-mono font-bold text-neutral-900">{p.price} MAD</td>
                        <td className="p-4 font-mono text-neutral-600">{p.salesCount}</td>
                        <td className="p-4 font-mono font-black text-emerald-600">{p.revenue.toLocaleString()} MAD</td>
                        <td className="p-4"><span className="text-[9px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-black uppercase">{p.status}</span></td>
                        <td className="p-4 pr-6 text-right">
                          <button 
                            onClick={() => setDigitalProducts(prev => prev.filter(x => x.id !== p.id))}
                            className="text-neutral-400 hover:text-red-600 p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* ================== DIALOG MODALS ================== */}
      {/* ==================================================== */}
      <AnimatePresence>
        
        {/* ADD PUBLISHED COURSE */}
        {showCourseForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl border max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="text-sm font-black uppercase font-sans">Publier une formation</h4>
                <button onClick={() => setShowCourseForm(false)} className="cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleAddPublishedCourse} className="space-y-3">
                <input type="text" required placeholder="Titre de la formation" value={cTitle} onChange={e => setCTitle(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs" />
                <div className="grid grid-cols-2 gap-2">
                  <select value={cNiche} onChange={e => setCNiche(e.target.value as any)} className="bg-neutral-50 border p-2 rounded-xl text-xs font-bold">
                    <option value="CFO">CFO Analyst</option><option value="Analyst">Market Analyst</option><option value="Economist">Economist</option><option value="Général">Général</option>
                  </select>
                  <select value={cPlatform} onChange={e => setCPlatform(e.target.value as any)} className="bg-neutral-50 border p-2 rounded-xl text-xs font-bold">
                    <option value="Udemy">Udemy</option><option value="THE MA CIRCLE (Direct)">Vente Directe</option>
                  </select>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <input type="number" required placeholder="Prix" value={cPrice} onChange={e => setCPrice(Number(e.target.value))} className="bg-neutral-50 border p-2 rounded-xl" />
                  <input type="number" required placeholder="Élèves" value={cStudents} onChange={e => setCStudents(Number(e.target.value))} className="bg-neutral-50 border p-2 rounded-xl" />
                  <input type="number" required placeholder="Revenu Est." value={cRev} onChange={e => setCRev(Number(e.target.value))} className="bg-neutral-50 border p-2 rounded-xl" />
                </div>
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl text-xs font-bold cursor-pointer">Publier</button>
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
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl text-xs font-bold cursor-pointer">Créer</button>
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
                <button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800 text-white p-2.5 rounded-xl text-xs font-bold cursor-pointer">Enregistrer</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD CAREER SKILL */}
        {showSkillForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl border max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="text-sm font-black uppercase font-sans">Nouvelle compétence à suivre</h4>
                <button onClick={() => setShowSkillForm(false)} className="cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleAddSkill} className="space-y-3">
                <input type="text" required placeholder="Nom de la compétence (ex: DCF Modeling)" value={skName} onChange={e => setSkName(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs" />
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <select value={skCategory} onChange={e => setSkCategory(e.target.value as any)} className="bg-neutral-50 border p-2 rounded-xl font-bold">
                    <option value="Finance">Finance</option><option value="Soft Skills">Soft Skills</option><option value="Tech / IA">Tech / IA</option><option value="Langues">Langues</option><option value="Management">Management</option><option value="Autre">Autre</option>
                  </select>
                  <select value={skStatus} onChange={e => setSkStatus(e.target.value as any)} className="bg-neutral-50 border p-2 rounded-xl font-bold">
                    <option value="Planifiée">Planifiée</option><option value="En cours de travail">En cours de travail</option><option value="Acquise">Acquise</option>
                  </select>
                </div>
                <textarea placeholder="Notes (projets associés, certifications...)" value={skNotes} onChange={e => setSkNotes(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs h-20" />
                <button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800 text-white p-2.5 rounded-xl text-xs font-bold cursor-pointer">Ajouter au Journal</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD RECRUITMENT SITE */}
        {showSiteForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl border max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="text-sm font-black uppercase font-sans">Enregistrer un site de recrutement</h4>
                <button onClick={() => setShowSiteForm(false)} className="cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleAddSite} className="space-y-3 text-xs">
                <input type="text" required placeholder="Nom du site (ex: ReKrute, LinkedIn)" value={siteName} onChange={e => setSiteName(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs" />
                <input type="url" placeholder="URL (ex: https://...)" value={siteUrl} onChange={e => setSiteUrl(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs font-mono" />
                <input type="text" placeholder="Mots-clés / compétences cibles (ex: CFO, Finance, Audit - séparés par des virgules)" value={siteKeywords} onChange={e => setSiteKeywords(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs" />
                <textarea placeholder="Notes, mots de passe de recherche ou alertes planifiées..." value={siteNotes} onChange={e => setSiteNotes(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs h-16" />
                <button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800 text-white p-2.5 rounded-xl text-xs font-bold cursor-pointer">Enregistrer le site</button>
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
                <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white p-2.5 rounded-xl text-xs font-bold cursor-pointer">Ajouter la chaîne</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD TARGET COMPANY */}
        {showCompanyForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl border max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="text-sm font-black uppercase font-sans">Ajouter une entreprise cible</h4>
                <button onClick={() => setShowCompanyForm(false)} className="cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleAddCompany} className="space-y-3 text-xs">
                <input type="text" required placeholder="Nom de l'entreprise (ex: EY Maroc)" value={compName} onChange={e => setCompName(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs" />
                <div className="grid grid-cols-2 gap-2">
                  <input type="url" placeholder="Site web (https://...)" value={compWebsite} onChange={e => setCompWebsite(e.target.value)} className="bg-neutral-50 border p-2 rounded-xl font-mono" />
                  <select value={compInterest} onChange={e => setCompInterest(Number(e.target.value))} className="bg-neutral-50 border p-2 rounded-xl font-bold font-sans">
                    <option value={5}>Intérêt : ★★★★★</option><option value={4}>Intérêt : ★★★★</option><option value={3}>Intérêt : ★★★</option>
                  </select>
                </div>
                <input type="text" placeholder="Contact clé / RH (ex: Mme. Alami - Talent Acquisition)" value={compContact} onChange={e => setCompContact(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs" />
                <textarea placeholder="Notes de préparation, culture, salaire estimé..." value={compNotes} onChange={e => setCompNotes(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl text-xs h-20" />
                <button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800 text-white p-2.5 rounded-xl text-xs font-bold cursor-pointer">Ajouter</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD JOB OPPORTUNITY */}
        {showOppForm && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-white rounded-3xl border max-w-md w-full p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <h4 className="text-sm font-black uppercase font-sans">Créer une opportunité</h4>
                <button onClick={() => setShowOppForm(false)} className="cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <form onSubmit={handleAddOpp} className="space-y-3 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" required placeholder="Intitulé du poste" value={oppTitle} onChange={e => setOppTitle(e.target.value)} className="bg-neutral-50 border p-2.5 rounded-xl" />
                  <input type="text" required placeholder="Entreprise" value={oppCompany} onChange={e => setOppCompany(e.target.value)} className="bg-neutral-50 border p-2.5 rounded-xl" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Salaire estimé (ex: 18 000 MAD)" value={oppSalary} onChange={e => setOppSalary(e.target.value)} className="bg-neutral-50 border p-2.5 rounded-xl font-bold text-emerald-700" />
                  <select value={oppStatus} onChange={e => setOppStatus(e.target.value as any)} className="bg-neutral-50 border p-2 rounded-xl font-bold font-sans">
                    <option value="À postuler">À postuler</option><option value="Postulé">Postulé</option><option value="Entretien">Entretien</option><option value="Offre">Offre</option><option value="Refusé">Refusé</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <input type="url" placeholder="Lien de l'offre (LinkedIn, etc.)" value={oppSiteUrl} onChange={e => setOppSiteUrl(e.target.value)} className="bg-neutral-50 border p-2 rounded-xl" />
                  <input type="date" value={oppDateApplied} onChange={e => setOppDateApplied(e.target.value)} className="bg-neutral-50 border p-2 rounded-xl font-sans" />
                </div>
                <input type="text" placeholder="Prochaine action (ex: Relance email, Entretien le...)" value={oppNextAction} onChange={e => setOppNextAction(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl" />
                <textarea placeholder="Notes, résumé du poste, exigences clés..." value={oppNotes} onChange={e => setOppNotes(e.target.value)} className="w-full bg-neutral-50 border p-2.5 rounded-xl h-16" />
                <button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800 text-white p-2.5 rounded-xl text-xs font-bold cursor-pointer">Créer l'opportunité</button>
              </form>
            </motion.div>
          </div>
        )}

      </AnimatePresence>

    </div>
  );
}
