import React, { useState, useEffect } from "react";
import { CareerSkill, RecruitmentSite, TargetCompany, JobOpportunity, CareerCertificate } from "../types";
import { DEFAULT_RECRUITMENT_SITES } from "../data/recruitmentSitesData";
import { 
  Briefcase, 
  Plus, 
  Trash2, 
  Globe, 
  Sparkles, 
  CheckCircle, 
  Layers, 
  Award, 
  Check, 
  X,
  Star,
  Activity,
  Sliders,
  Search,
  Building2,
  Link2,
  Calendar,
  ExternalLink,
  RefreshCw,
  Heart,
  Pencil,
  MapPin,
  LayoutDashboard,
  Target
} from "lucide-react";

interface CareerSectionProps {
  activeTab?: "dash" | "pipeline" | "skills" | "recruitment" | "companies" | "certificates" | "sites";
  onNavigate?: (moduleId: string) => void;
}

export default function CareerSection({ activeTab, onNavigate }: CareerSectionProps = {}) {
  const [careerTab, setCareerTab] = useState<"dash" | "pipeline" | "skills" | "recruitment" | "companies" | "certificates">("dash");

  useEffect(() => {
    if (activeTab) {
      if (activeTab === "sites") {
        setCareerTab("recruitment");
      } else if (["dash", "pipeline", "skills", "recruitment", "companies", "certificates"].includes(activeTab)) {
        setCareerTab(activeTab as any);
      }
    }
  }, [activeTab]);

  const handleTabChange = (tab: "dash" | "pipeline" | "skills" | "recruitment" | "companies" | "certificates") => {
    setCareerTab(tab);
    if (onNavigate) {
      const mappedId = tab === "recruitment" ? "career_sites" : `career_${tab}`;
      onNavigate(mappedId);
    }
  };

  // --- PERSISTENT DATA FOR CARRIÈRE PROFESSIONNELLE ---
  const [certificates, setCertificates] = useState<CareerCertificate[]>(() => {
    const saved = localStorage.getItem("mp_career_certificates");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [
      { id: "cert_1", name: "CFA Chartered Financial Analyst - Level I", authority: "CFA Institute", status: "En cours", niche: "Finance", notes: "Focus sur l'éthique, la modélisation quantitative, et l'analyse d'états financiers." },
      { id: "cert_2", name: "Financial Modeling & Valuation Analyst (FMVA)", authority: "Corporate Finance Institute (CFI)", status: "Obtenu", niche: "Finance", issueDate: "2026-03-15", credentialId: "FMVA-98715", notes: "Parcours d'évaluation de PME, construction de modèles 3-statement et valorisation DCF." },
      { id: "cert_3", name: "Certification AMMC (Professionnels des Marchés)", authority: "AMMC (Autorité Marocaine du Marché des Capitaux)", status: "Planifié", niche: "Finance", notes: "Nécessaire pour opérer sur les portefeuilles d'investissements et d'analyse financière au Maroc." }
    ];
  });
  const [skills, setSkills] = useState<CareerSkill[]>(() => {
    const saved = localStorage.getItem("mp_career_skills");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: "skill_1", name: "Modélisation Financière Excel & Valorisation (DCF)", category: "Finance", status: "En cours de travail", notes: "Maitrise des formules de cascade de cash flow et de scénarios.", lastUpdated: "2026-07-10" },
      { id: "skill_2", name: "Analyse Boursière (BVC) & Allocation d'Actifs", category: "Finance", status: "Acquise", notes: "Compréhension des états financiers cotés et stratégies de dividendes.", lastUpdated: "2026-06-15" },
      { id: "skill_3", name: "IA Générative appliquée à la Finance", category: "Tech / IA", status: "En cours de travail", notes: "Automatisation de rapports et audit de abonnements via LLM.", lastUpdated: "2026-07-12" },
      { id: "skill_4", name: "Prise de parole en public & Pitching", category: "Soft Skills", status: "Planifiée", notes: "S'entraîner pour présenter clairement les rapports semestriels.", lastUpdated: "2026-07-01" }
    ];
  });

  const [recruitmentSites, setRecruitmentSites] = useState<RecruitmentSite[]>(() => {
    const saved = localStorage.getItem("mp_recruitment_sites");
    let existing: RecruitmentSite[] = [];
    if (saved) {
      try {
        existing = JSON.parse(saved);
      } catch (e) {
        existing = [];
      }
    }
    if (existing.length <= 3) {
      return DEFAULT_RECRUITMENT_SITES;
    }
    const merged = [...existing];
    DEFAULT_RECRUITMENT_SITES.forEach(d => {
      const exists = merged.some(m => m.url.toLowerCase() === d.url.toLowerCase() || m.name.toLowerCase() === d.name.toLowerCase());
      if (!exists) {
        merged.push(d);
      }
    });
    return merged;
  });

  const [targetCompanies, setTargetCompanies] = useState<TargetCompany[]>(() => {
    const saved = localStorage.getItem("mp_target_companies");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: "comp_1", name: "Attijariwafa Bank", website: "https://www.attijariwafabank.com", interest: 5, notes: "Leader bancaire, opportunités de Corporate Finance de haut niveau.", contact: "M. Khalid Bennani (Finance HR)" },
      { id: "comp_2", name: "Masen", website: "https://www.masen.ma", interest: 5, notes: "Projets d'énergies renouvelables, rôles de contrôleur financier ou modélisateur.", contact: "Mme. Meriem Tazi (Talent)" },
      { id: "comp_3", name: "BCP (Banque Populaire)", website: "https://www.gfbcp.com", interest: 4, notes: "Solide écosystème financier. Département Corporate Finance actif.", contact: "RH Siège" }
    ];
  });

  const [jobOpportunities, setJobOpportunities] = useState<JobOpportunity[]>(() => {
    const saved = localStorage.getItem("mp_job_opportunities");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [
      { id: "opp_1", title: "Analyste Financier Senior", company: "Attijariwafa Bank", siteUrl: "https://www.linkedin.com", salary: "18 000 MAD", status: "Entretien", dateApplied: "2026-07-02", nextAction: "Cas pratique de modélisation technique mardi", notes: "Premier entretien RH validé." },
      { id: "opp_2", title: "Contrôleur de Gestion Projet", company: "Masen", siteUrl: "https://www.rekrute.com", salary: "16 500 MAD", status: "Postulé", dateApplied: "2026-07-08", nextAction: "Suivi courtois par LinkedIn le 18 juillet", notes: "Candidature envoyée en direct." },
      { id: "opp_3", title: "Financial Modeler Junior", company: "EY Maroc", siteUrl: "https://www.linkedin.com", salary: "15 000 MAD", status: "À postuler", nextAction: "Adapter le CV avec les projets de modélisation", notes: "Cabinet d'audit de premier plan." }
    ];
  });

  // --- LOCALSTORAGE SYNC ---
  useEffect(() => { localStorage.setItem("mp_career_skills", JSON.stringify(skills)); }, [skills]);
  useEffect(() => { localStorage.setItem("mp_recruitment_sites", JSON.stringify(recruitmentSites)); }, [recruitmentSites]);
  useEffect(() => { localStorage.setItem("mp_target_companies", JSON.stringify(targetCompanies)); }, [targetCompanies]);
  useEffect(() => { localStorage.setItem("mp_job_opportunities", JSON.stringify(jobOpportunities)); }, [jobOpportunities]);
  useEffect(() => { localStorage.setItem("mp_career_certificates", JSON.stringify(certificates)); }, [certificates]);

  // --- MODAL / FORM STATES ---
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showSiteForm, setShowSiteForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
  const [showOppForm, setShowOppForm] = useState(false);
  const [showCertForm, setShowCertForm] = useState(false);

  // --- FORM VALUES ---
  const [certName, setCertName] = useState("");
  const [certAuthority, setCertAuthority] = useState("");
  const [certIssueDate, setCertIssueDate] = useState("");
  const [certExpiryDate, setCertExpiryDate] = useState("");
  const [certCredentialId, setCertCredentialId] = useState("");
  const [certCredentialUrl, setCertCredentialUrl] = useState("");
  const [certStatus, setCertStatus] = useState<CareerCertificate["status"]>("En cours");
  const [certNiche, setCertNiche] = useState<CareerCertificate["niche"]>("Finance");
  const [certNotes, setCertNotes] = useState("");

  const [skName, setSkName] = useState("");
  const [skCategory, setSkCategory] = useState<CareerSkill["category"]>("Finance");
  const [skStatus, setSkStatus] = useState<CareerSkill["status"]>("En cours de travail");
  const [skNotes, setSkNotes] = useState("");

  const [siteName, setSiteName] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [siteNotes, setSiteNotes] = useState("");
  const [siteKeywords, setSiteKeywords] = useState("");
  const [siteCountry, setSiteCountry] = useState("Maroc");
  const [siteIdentifiant, setSiteIdentifiant] = useState("");
  const [siteSearch, setSiteSearch] = useState("");
  const [siteCountryFilter, setSiteCountryFilter] = useState("Tous");

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
  const acquiredSkillsCount = skills.filter(s => s.status === "Acquise").length;
  const activeOpportunities = jobOpportunities.filter(o => o.status !== "Refusé" && o.status !== "Offre").length;
  const offeredOpportunities = jobOpportunities.filter(o => o.status === "Offre").length;
  const obtainedCertificatesCount = certificates.filter(c => c.status === "Obtenu").length;

  // --- SUBMISSION HANDLERS ---
  const handleAddCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certName.trim() || !certAuthority.trim()) return;
    setCertificates(prev => [{
      id: "cert_" + Date.now(),
      name: certName.trim(),
      authority: certAuthority.trim(),
      issueDate: certIssueDate || undefined,
      expiryDate: certExpiryDate || undefined,
      credentialId: certCredentialId.trim() || undefined,
      credentialUrl: certCredentialUrl.trim() || undefined,
      status: certStatus,
      niche: certNiche,
      notes: certNotes.trim() || undefined
    }, ...prev]);
    setCertName(""); setCertAuthority(""); setCertIssueDate(""); setCertExpiryDate(""); setCertCredentialId(""); setCertCredentialUrl(""); setCertStatus("En cours"); setCertNiche("Finance"); setCertNotes(""); setShowCertForm(false);
  };

  const toggleCertStatus = (id: string) => {
    setCertificates(prev => prev.map(c => {
      if (c.id !== id) return c;
      const nextStatus: CareerCertificate["status"] = c.status === "Planifié" 
        ? "En cours" 
        : c.status === "En cours" ? "Obtenu" : "Planifié";
      return { 
        ...c, 
        status: nextStatus,
        issueDate: nextStatus === "Obtenu" ? new Date().toISOString().split("T")[0] : c.issueDate
      };
    }));
  };

  const deleteCertificate = (id: string) => {
    setCertificates(prev => prev.filter(c => c.id !== id));
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
      discoveredOpportunities: "",
      country: siteCountry,
      identifiant: siteIdentifiant.trim() || "N/A"
    }, ...prev]);
    setSiteName(""); setSiteUrl(""); setSiteNotes(""); setSiteKeywords(""); setSiteCountry("Maroc"); setSiteIdentifiant(""); setShowSiteForm(false);
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
      
      {/* 1. SECTOR METRICS PANEL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 bg-gradient-to-br from-zinc-900 to-indigo-950 text-white rounded-3xl p-6 border border-zinc-800 shadow-md relative overflow-hidden">
        <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[150%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
        
        {/* Core Stat 1: Total Job Pipeline */}
        <div className="col-span-1 border-r border-zinc-800/80 pr-4 flex flex-col justify-center space-y-1">
          <span className="text-[10px] font-black tracking-widest text-indigo-300 block uppercase font-mono">Suivi de Carrière</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono leading-none">{jobOpportunities.length}</span>
            <span className="text-xs text-zinc-400 font-medium">Opportunités</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-medium font-sans">
            {activeOpportunities} candidatures en cours.
          </span>
        </div>

        {/* Core Stat 2: Offered / Completed */}
        <div className="col-span-1 border-r border-zinc-800/80 pr-4 pl-2 flex flex-col justify-center space-y-1">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">Offres Reçues</span>
          <span className="text-2xl font-black font-mono text-emerald-400 leading-none">{offeredOpportunities} Offres</span>
          <span className="text-[10px] text-zinc-300 font-medium mt-1">
            Objectifs en cours de finalisation !
          </span>
        </div>

        {/* Core Stat 3: Competency metrics */}
        <div className="col-span-1 border-r border-zinc-800/80 pr-4 pl-2 flex flex-col justify-center space-y-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">Compétences</span>
          <span className="text-2xl font-black font-mono text-amber-400 leading-none">{acquiredSkillsCount} Acquises</span>
          <span className="text-[10px] text-zinc-300 font-medium mt-1">
            Sur un total de {skills.length} identifiées.
          </span>
        </div>

        {/* Core Stat 4: Certifications */}
        <div className="col-span-1 border-r border-zinc-800/80 pr-4 pl-2 flex flex-col justify-center space-y-1">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest font-mono">Certificats</span>
          <span className="text-2xl font-black font-mono text-purple-400 leading-none">{obtainedCertificatesCount} <span className="text-xs font-semibold text-zinc-400">/ {certificates.length}</span></span>
          <span className="text-[10px] text-zinc-300 font-medium mt-1">
            Diplômes & accréditations obtenus.
          </span>
        </div>

        {/* Core Stat 5: Recruitment Portals */}
        <div className="col-span-1 pl-2 flex flex-col justify-center space-y-1">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest font-mono">Portails Recrutement</span>
          <span className="text-2xl font-black font-mono text-white leading-none">
            {recruitmentSites.filter(s => s.visited).length} <span className="text-xs font-semibold text-zinc-500">/ {recruitmentSites.length}</span>
          </span>
          <span className="text-[10px] text-zinc-300 font-medium mt-1">
            Considérés et suivis régulièrement.
          </span>
        </div>
      </div>

      {/* 2. TAB SELECTION */}
      <div className="flex flex-wrap gap-2 bg-neutral-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => handleTabChange("dash")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer select-none ${
            careerTab === "dash" ? "bg-white text-zinc-950 shadow-xs" : "text-neutral-500 hover:text-zinc-950"
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5 text-zinc-950" />
          <span>Dashboard</span>
        </button>
        <button
          onClick={() => handleTabChange("pipeline")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer select-none ${
            careerTab === "pipeline" ? "bg-white text-zinc-950 shadow-xs" : "text-neutral-500 hover:text-zinc-950"
          }`}
        >
          <Briefcase className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5 text-amber-500" />
          <span>Pipeline ({jobOpportunities.length})</span>
        </button>
        <button
          onClick={() => handleTabChange("recruitment")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer select-none ${
            careerTab === "recruitment" ? "bg-white text-zinc-950 shadow-xs" : "text-neutral-500 hover:text-zinc-950"
          }`}
        >
          <Link2 className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5 text-indigo-500" />
          <span>Portails Recrutement ({recruitmentSites.length})</span>
        </button>
        <button
          onClick={() => handleTabChange("companies")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer select-none ${
            careerTab === "companies" ? "bg-white text-zinc-950 shadow-xs" : "text-neutral-500 hover:text-zinc-950"
          }`}
        >
          <Building2 className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5 text-emerald-500" />
          <span>Entreprises Cibles ({targetCompanies.length})</span>
        </button>
        <button
          onClick={() => handleTabChange("skills")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer select-none ${
            careerTab === "skills" ? "bg-white text-zinc-950 shadow-xs" : "text-neutral-500 hover:text-zinc-950"
          }`}
        >
          <Award className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5 text-purple-500" />
          <span>Compétences ({skills.length})</span>
        </button>
        <button
          onClick={() => handleTabChange("certificates")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer select-none ${
            careerTab === "certificates" ? "bg-white text-zinc-950 shadow-xs" : "text-neutral-500 hover:text-zinc-950"
          }`}
        >
          <CheckCircle className="w-3.5 h-3.5 inline-block mr-1.5 -mt-0.5 text-indigo-500" />
          <span>Certificats & Diplômes ({certificates.length})</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* --- TAB: DASHBOARD DE CARRIÈRE --- */}
      {/* ==================================================== */}
      {careerTab === "dash" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Welcome & Overview Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Card: Pipeline Status & Quick Stats */}
            <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-neutral-950 text-white rounded-lg">
                      <Briefcase className="w-4 h-4 text-amber-400" />
                    </span>
                    <h3 className="text-sm font-black text-neutral-950 uppercase tracking-tight">
                      Pipeline Recrutement
                    </h3>
                  </div>
                  <button
                    onClick={() => handleTabChange("pipeline")}
                    className="text-[10px] font-black text-indigo-600 uppercase tracking-wider hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    Gérer <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* Recruitment status bars */}
                <div className="space-y-3">
                  {["À postuler", "Postulé", "Entretien", "Offre"].map((status) => {
                    const count = jobOpportunities.filter(o => o.status === status).length;
                    const total = jobOpportunities.length || 1;
                    const percentage = Math.round((count / total) * 100);
                    const colorClass = 
                      status === "Offre" ? "bg-emerald-500" :
                      status === "Entretien" ? "bg-indigo-500" :
                      status === "Postulé" ? "bg-amber-500" : "bg-neutral-400";
                    return (
                      <div key={status} className="space-y-1">
                        <div className="flex justify-between text-xs font-bold text-neutral-700">
                          <span>{status}</span>
                          <span className="font-mono">{count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-neutral-100 h-2 rounded-full overflow-hidden">
                          <div className={`h-full ${colorClass} rounded-full`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Next Action Highlight */}
              {(() => {
                const pendingAction = jobOpportunities.find(o => o.nextAction && o.status !== "Offre" && o.status !== "Refusé");
                if (pendingAction) {
                  return (
                    <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl space-y-1 mt-4">
                      <span className="text-[9px] text-amber-800 font-black uppercase font-mono block">Action Prioritaire :</span>
                      <h5 className="text-[11px] font-black text-neutral-900 leading-tight">{pendingAction.title} ({pendingAction.company})</h5>
                      <p className="text-[10.5px] font-medium text-neutral-600 leading-snug">{pendingAction.nextAction}</p>
                    </div>
                  );
                }
                return (
                  <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-center text-[10.5px] text-neutral-400 italic mt-4">
                    Aucune action d'entretien planifiée
                  </div>
                );
              })()}
            </div>

            {/* Middle Card: Skills Mastery & Development */}
            <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-neutral-950 text-white rounded-lg">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                  </span>
                  <h3 className="text-sm font-black text-neutral-950 uppercase tracking-tight">
                    Compétences Clés
                  </h3>
                </div>
                <button
                  onClick={() => handleTabChange("skills")}
                  className="text-[10px] font-black text-indigo-600 uppercase tracking-wider hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  Développer <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3.5">
                {skills.slice(0, 4).map((skill) => {
                  const statusColors = 
                    skill.status === "Acquise" ? "bg-emerald-50 text-emerald-800 border-emerald-100" :
                    skill.status === "En cours de travail" ? "bg-indigo-50 text-indigo-800 border-indigo-100" :
                    "bg-neutral-50 text-neutral-600 border-neutral-200";
                  return (
                    <div key={skill.id} className="flex items-center justify-between p-2.5 bg-neutral-50 border border-neutral-200/50 rounded-xl">
                      <div className="space-y-0.5 max-w-[65%]">
                        <span className="text-[11px] font-bold text-neutral-900 block truncate">{skill.name}</span>
                        <span className="text-[9px] text-neutral-400 font-bold uppercase block tracking-wider font-mono">{skill.category}</span>
                      </div>
                      <span className={`text-[9px] font-black px-2 py-0.5 border rounded-md font-mono ${statusColors}`}>
                        {skill.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Card: High-Tier Target Companies */}
            <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-neutral-950 text-white rounded-lg">
                    <Target className="w-4 h-4 text-emerald-400" />
                  </span>
                  <h3 className="text-sm font-black text-neutral-950 uppercase tracking-tight">
                    Entreprises d'Élite
                  </h3>
                </div>
                <button
                  onClick={() => handleTabChange("companies")}
                  className="text-[10px] font-black text-indigo-600 uppercase tracking-wider hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  Voir tout <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {targetCompanies.slice(0, 3).map((comp) => (
                  <div key={comp.id} className="p-3 bg-neutral-50 border border-neutral-200/50 rounded-xl space-y-1">
                    <div className="flex justify-between items-start">
                      <h5 className="text-[11px] font-black text-neutral-900 leading-tight">{comp.name}</h5>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3 h-3 ${i < comp.interest ? "text-amber-500 fill-amber-500" : "text-neutral-200"}`} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-[10px] text-neutral-500 leading-relaxed font-medium line-clamp-1">{comp.notes}</p>
                    {comp.contact && (
                      <span className="text-[9px] text-indigo-600 font-bold block">Contact : {comp.contact}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Lower Grid: Certifications & Portals */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left Lower: Certifications & Accreditations */}
            <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-neutral-950 text-white rounded-lg">
                    <CheckCircle className="w-4 h-4 text-indigo-400" />
                  </span>
                  <h3 className="text-sm font-black text-neutral-950 uppercase tracking-tight">
                    Certifications & Accréditations
                  </h3>
                </div>
                <button
                  onClick={() => handleTabChange("certificates")}
                  className="text-[10px] font-black text-indigo-600 uppercase tracking-wider hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  Gérer <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="space-y-3">
                {certificates.map((cert) => {
                  const statusColors = 
                    cert.status === "Obtenu" ? "bg-emerald-50 text-emerald-800 border-emerald-100" :
                    cert.status === "En cours" ? "bg-indigo-50 text-indigo-800 border-indigo-100" :
                    "bg-neutral-50 text-neutral-500 border-neutral-200";
                  return (
                    <div key={cert.id} className="flex items-center justify-between p-3 bg-neutral-50 border border-neutral-200/40 rounded-xl">
                      <div className="space-y-0.5 max-w-[70%]">
                        <span className="text-[11.5px] font-bold text-neutral-900 block truncate">{cert.name}</span>
                        <div className="flex items-center gap-1.5 text-[9.5px] text-neutral-400">
                          <span className="font-extrabold">{cert.authority}</span>
                          <span>•</span>
                          <span className="font-bold uppercase tracking-wider font-mono text-[8px]">{cert.niche}</span>
                        </div>
                      </div>
                      <span className={`text-[9.5px] font-black px-2 py-0.5 border rounded-md font-mono ${statusColors}`}>
                        {cert.status}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Lower: Portails de recrutement & Profiles Quick Access */}
            <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-neutral-950 text-white rounded-lg">
                    <Globe className="w-4 h-4 text-teal-400" />
                  </span>
                  <h3 className="text-sm font-black text-neutral-950 uppercase tracking-tight">
                    Portails & Profils Recrutement
                  </h3>
                </div>
                <button
                  onClick={() => handleTabChange("recruitment")}
                  className="text-[10px] font-black text-indigo-600 uppercase tracking-wider hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  Tous les sites <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {recruitmentSites.slice(0, 4).map((site) => (
                  <a 
                    key={site.id} 
                    href={site.url} 
                    target="_blank" 
                    referrerPolicy="no-referrer"
                    className="p-3 bg-neutral-50 border border-neutral-200/50 hover:border-indigo-200 hover:bg-indigo-50/10 rounded-xl transition-all flex flex-col justify-between h-24 shadow-3xs group cursor-pointer"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[11.5px] font-black text-neutral-900 group-hover:text-indigo-950 transition-colors">{site.name}</span>
                        <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider font-mono block">{site.country}</span>
                    </div>
                    {site.identifiant ? (
                      <span className="text-[9px] font-mono text-neutral-500 bg-neutral-200/50 px-1.5 py-0.5 rounded-md w-fit font-bold truncate max-w-full">
                        ID: {site.identifiant}
                      </span>
                    ) : (
                      <span className="text-[9px] italic text-neutral-400">Aucun ID enregistré</span>
                    )}
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ==================================================== */}
      {/* --- TAB: PIPELINE DES CANDIDATURES --- */}
      {/* ==================================================== */}
      {careerTab === "pipeline" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 border border-neutral-200/60 p-4 rounded-2xl">
            <div>
              <h3 className="text-xs font-black text-neutral-900 uppercase tracking-tight flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-amber-500" />
                <span>Pipeline Interactif des Candidatures</span>
              </h3>
              <p className="text-[11px] text-neutral-400 font-medium">Gérez votre entonnoir d'embauche de la détection technique jusqu'aux entretiens et offres d'emploi.</p>
            </div>
            <button
              onClick={() => setShowOppForm(true)}
              className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
            >
              <Plus className="w-4 h-4" />
              <span>Créer une opportunité</span>
            </button>
          </div>

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

                  <div className="space-y-3 overflow-y-auto max-h-[420px] pr-1">
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
                            <div className="flex gap-1.5">
                              {statusKey === "À postuler" && (
                                <button 
                                  onClick={() => updateOppStatus(opp.id, "Postulé")}
                                  className="text-indigo-600 hover:underline font-bold cursor-pointer"
                                >
                                  Postuler →
                                </button>
                              )}
                              {statusKey === "Postulé" && (
                                <button 
                                  onClick={() => updateOppStatus(opp.id, "Entretien")}
                                  className="text-amber-600 hover:underline font-bold cursor-pointer"
                                >
                                  Entretien →
                                </button>
                              )}
                              {statusKey === "Entretien" && (
                                <button 
                                  onClick={() => updateOppStatus(opp.id, "Offre")}
                                  className="text-emerald-600 hover:underline font-bold cursor-pointer"
                                >
                                  Obtenu 🎉
                                </button>
                              )}
                            </div>

                            <div className="flex gap-1.5">
                              {statusKey !== "Refusé" && (
                                <button 
                                  onClick={() => updateOppStatus(opp.id, "Refusé")}
                                  className="text-neutral-400 hover:text-red-500 font-bold cursor-pointer"
                                  title="Marquer refusé"
                                >
                                  Refusé
                                </button>
                              )}
                              <button 
                                onClick={() => setJobOpportunities(prev => prev.filter(o => o.id !== opp.id))}
                                className="text-neutral-400 hover:text-red-500 font-bold cursor-pointer"
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
      )}

      {/* ==================================================== */}
      {/* --- TAB: PORTAILS & SITES DE RECRUTEMENT --- */}
      {/* ==================================================== */}
      {careerTab === "recruitment" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-white border border-neutral-200 rounded-3xl p-5 space-y-4 shadow-3xs">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
              <div>
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Link2 className="w-4 h-4 text-indigo-500" />
                  <span>Portails & Sites de Recrutement Internationaux</span>
                </h4>
                <p className="text-[10px] text-neutral-400 font-bold mt-0.5 font-mono">
                  Visites régulières : {recruitmentSites.filter(s => s.visited).length}/{recruitmentSites.length} visités
                  {siteCountryFilter !== "Tous" || siteSearch ? ` (${recruitmentSites.filter(site => {
                    const matchesSearch = site.name.toLowerCase().includes(siteSearch.toLowerCase()) || 
                                          (site.notes || "").toLowerCase().includes(siteSearch.toLowerCase()) ||
                                          (site.keywords || []).some(kw => kw.toLowerCase().includes(siteSearch.toLowerCase()));
                    const matchesCountry = siteCountryFilter === "Tous" || site.country === siteCountryFilter;
                    return matchesSearch && matchesCountry;
                  }).length} filtrés)` : ""}
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
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer select-none"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter un portail</span>
                </button>
              </div>
            </div>

            {/* Barre de recherche & Filtre par pays */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-1">
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none text-neutral-400">
                  <Search className="w-3.5 h-3.5" />
                </span>
                <input 
                  type="text"
                  placeholder="Rechercher un site par nom, mot-clé, notes..."
                  value={siteSearch}
                  onChange={(e) => setSiteSearch(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-8 pr-2.5 py-1.5 text-xs font-sans focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div>
                <select
                  value={siteCountryFilter}
                  onChange={(e) => setSiteCountryFilter(e.target.value)}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2.5 py-1.5 text-xs font-bold text-neutral-700 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                >
                  <option value="Tous">Tous les Pays ({recruitmentSites.length})</option>
                  <option value="Maroc">Maroc</option>
                  <option value="France">France</option>
                  <option value="Canada">Canada</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Germany">Allemagne</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="Netherlands">Pays-Bas</option>
                  <option value="USA">USA</option>
                  <option value="Worldwide">International</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-1">
              {recruitmentSites.filter(site => {
                const matchesSearch = site.name.toLowerCase().includes(siteSearch.toLowerCase()) || 
                                      (site.notes || "").toLowerCase().includes(siteSearch.toLowerCase()) ||
                                      (site.keywords || []).some(kw => kw.toLowerCase().includes(siteSearch.toLowerCase()));
                const matchesCountry = siteCountryFilter === "Tous" || site.country === siteCountryFilter;
                return matchesSearch && matchesCountry;
              }).map(site => (
                <div 
                  key={site.id} 
                  className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition-all ${
                    site.visited 
                      ? "bg-neutral-50/40 border-neutral-200/40 opacity-75" 
                      : "bg-neutral-50 hover:bg-neutral-100/60 border-neutral-200/40"
                  }`}
                >
                  <div className="space-y-3">
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
                          className="mt-0.5 w-4 h-4 rounded-md border-neutral-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer font-sans"
                          id={`site-check-${site.id}`}
                        />
                        <div className="space-y-1 flex-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
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
                              <ExternalLink className="w-3.5 h-3.5 inline-block" />
                            </a>
                            {site.country && (
                              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-neutral-200/60 text-neutral-600 font-sans tracking-wide ml-auto">
                                {site.country === "Germany" ? "Allemagne" : site.country === "Netherlands" ? "Pays-Bas" : site.country}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-neutral-500 leading-relaxed font-medium">{site.notes}</p>
                          
                          {site.identifiant && site.identifiant !== "N/A" && (
                            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-neutral-500 font-mono bg-neutral-200/30 rounded-md px-2 py-0.5 w-fit">
                              <span className="font-bold text-neutral-400">ID:</span>
                              <span className="font-extrabold text-neutral-700">{site.identifiant}</span>
                              <button 
                                onClick={() => {
                                  navigator.clipboard.writeText(site.identifiant || "");
                                }}
                                className="text-[9px] text-indigo-600 hover:text-indigo-800 ml-1.5 cursor-pointer font-bold font-sans"
                                title="Copier l'identifiant"
                              >
                                Copier
                              </button>
                            </div>
                          )}
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

                    {/* Keywords & Target Skills */}
                    <div className="space-y-1.5 pt-2 pl-6.5 border-t border-neutral-200/40">
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
                                className="text-[8px] opacity-60 hover:opacity-100 cursor-pointer font-sans"
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
                          placeholder="+ Ajouter un mot-clé"
                          className="bg-white border border-neutral-200/80 rounded-lg px-2 py-0.5 text-[10px] font-mono w-full focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                        />
                      </form>
                    </div>
                  </div>

                  {/* Interactive Text Area for Discovered Opportunities */}
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
                      className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-[10.5px] leading-relaxed text-neutral-600 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-neutral-400 font-medium font-sans"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* --- TAB: ENTREPRISES CIBLES --- */}
      {/* ==================================================== */}
      {careerTab === "companies" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="bg-white border border-neutral-200 rounded-3xl p-5 space-y-4 shadow-3xs">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
              <div>
                <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wide flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-emerald-500" />
                  <span>Entreprises Cibles de Choix</span>
                </h4>
                <p className="text-[10px] text-neutral-400 font-bold mt-0.5 font-mono">Focalisez-vous sur les entreprises à fort potentiel de croissance au Maroc et à l'international.</p>
              </div>
              <button
                onClick={() => setShowCompanyForm(true)}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 cursor-pointer select-none"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une entreprise</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {targetCompanies.map(comp => (
                <div key={comp.id} className="bg-neutral-50 hover:bg-neutral-100/60 p-4 rounded-xl border border-neutral-200/40 space-y-2 transition-all flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-black text-neutral-900">{comp.name}</span>
                          <a 
                            href={comp.website} target="_blank" rel="noopener noreferrer" 
                            className="text-neutral-800 hover:text-neutral-600"
                          >
                            <ExternalLink className="w-3.5 h-3.5 inline-block" />
                          </a>
                        </div>
                        {comp.contact && (
                          <span className="text-[9.5px] text-neutral-600 font-bold block font-mono">Contact: {comp.contact}</span>
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
                  </div>

                  <div className="text-right pt-2 border-t border-neutral-100 mt-2">
                    <button 
                      onClick={() => setTargetCompanies(prev => prev.filter(c => c.id !== comp.id))}
                      className="text-[10px] text-neutral-400 hover:text-red-500 cursor-pointer font-bold font-sans"
                    >
                      Retirer l'entreprise
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* --- TAB: JOURNAL DES COMPÉTENCES --- */}
      {/* ==================================================== */}
      {careerTab === "skills" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 border border-neutral-200/60 p-4 rounded-2xl">
            <div>
              <h3 className="text-xs font-black text-neutral-900 uppercase tracking-tight">Journal de Bord des Compétences Professionnelles</h3>
              <p className="text-[11px] text-neutral-400 font-medium">Cartographiez les compétences acquises ou que vous travaillez activement au quotidien.</p>
            </div>
            <button
              onClick={() => setShowSkillForm(true)}
              className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
            >
              <Plus className="w-4 h-4" />
              <span>Enregistrer une compétence</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.length === 0 ? (
              <div className="col-span-full py-16 text-center text-neutral-400 bg-white border border-dashed border-neutral-200 rounded-3xl italic text-xs">
                Aucune compétence enregistrée. Cliquez sur le bouton pour en ajouter une.
              </div>
            ) : (
              skills.map(skill => (
                <div 
                  key={skill.id} 
                  className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3.5 shadow-3xs flex flex-col justify-between hover:border-neutral-300 transition-colors"
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
                      {skill.status === "En cours de travail" && <RefreshCw className="w-3 h-3 text-indigo-600" />}
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

      {/* ==================================================== */}
      {/* --- TAB: CERTIFICATS & DIPLÔMES --- */}
      {/* ==================================================== */}
      {careerTab === "certificates" && (
        <div className="space-y-4 animate-in fade-in duration-300">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-50 border border-neutral-200/60 p-4 rounded-2xl">
            <div>
              <h3 className="text-xs font-black text-neutral-900 uppercase tracking-tight flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-indigo-500" />
                <span>Certifications Académiques & Accréditations de Marché</span>
              </h3>
              <p className="text-[11px] text-neutral-400 font-medium">Consignez vos certifications (CFA, AMMC, FMVA), diplômes et accréditations professionnelles.</p>
            </div>
            <button
              onClick={() => setShowCertForm(true)}
              className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
            >
              <Plus className="w-4 h-4" />
              <span>Ajouter un certificat</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.length === 0 ? (
              <div className="col-span-full py-16 text-center text-neutral-400 bg-white border border-dashed border-neutral-200 rounded-3xl italic text-xs">
                Aucun certificat ou diplôme enregistré. Cliquez sur le bouton pour en ajouter un.
              </div>
            ) : (
              certificates.map(cert => (
                <div 
                  key={cert.id} 
                  className="bg-white border border-neutral-200 rounded-2xl p-5 space-y-3.5 shadow-3xs flex flex-col justify-between hover:border-neutral-300 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex gap-1">
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full font-mono ${
                          cert.niche === "Finance" ? "bg-amber-100 text-amber-800" :
                          cert.niche === "Tech" ? "bg-blue-100 text-blue-800" :
                          cert.niche === "Management" ? "bg-purple-100 text-purple-800" :
                          "bg-neutral-100 text-neutral-800"
                        }`}>
                          {cert.niche}
                        </span>
                        {cert.credentialUrl && (
                          <a 
                            href={cert.credentialUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-neutral-400 hover:text-indigo-600 self-center"
                            title="Voir le justificatif externe"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      
                      {cert.issueDate && (
                        <span className="text-[9px] text-neutral-400 font-mono">
                          {cert.status === "Obtenu" ? `Obtenu le: ${cert.issueDate}` : `Prévu le: ${cert.issueDate}`}
                        </span>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      <h4 className="text-xs font-black text-neutral-900 leading-snug">{cert.name}</h4>
                      <p className="text-[10px] text-neutral-400 font-bold font-sans uppercase tracking-wider">{cert.authority}</p>
                    </div>

                    {cert.notes && (
                      <p className="text-xs text-neutral-500 leading-relaxed font-medium">{cert.notes}</p>
                    )}

                    {cert.credentialId && (
                      <div className="pt-1.5 flex items-center gap-1.5 text-[10px] text-neutral-500 font-mono bg-neutral-50 rounded-lg px-2.5 py-1 w-fit border border-neutral-200/40">
                        <span className="font-bold text-neutral-400">ID Certif:</span>
                        <span className="font-extrabold text-neutral-700">{cert.credentialId}</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(cert.credentialId || "");
                          }}
                          className="text-[9px] text-indigo-600 hover:text-indigo-800 ml-1 cursor-pointer font-bold font-sans"
                          title="Copier l'identifiant"
                        >
                          Copier
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 gap-2">
                    <button
                      onClick={() => toggleCertStatus(cert.id)}
                      className={`text-[9.5px] font-black uppercase px-2.5 py-1 rounded-lg border cursor-pointer select-none transition-all flex items-center gap-1 ${
                        cert.status === "Obtenu" 
                          ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                          : cert.status === "En cours" 
                            ? "bg-indigo-50 border-indigo-200 text-indigo-800 animate-pulse"
                            : "bg-neutral-50 border-neutral-200 text-neutral-600"
                      }`}
                    >
                      {cert.status === "Obtenu" && <Check className="w-3 h-3 text-emerald-600" />}
                      {cert.status === "En cours" && <RefreshCw className="w-3 h-3 text-indigo-600" />}
                      {cert.status === "Planifié" && <Calendar className="w-3 h-3 text-neutral-500" />}
                      <span>{cert.status}</span>
                    </button>

                    <button 
                      onClick={() => deleteCertificate(cert.id)}
                      className="text-neutral-400 hover:text-red-500 p-1.5 hover:bg-neutral-50 rounded-lg transition-colors cursor-pointer"
                      title="Supprimer le certificat"
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

      {/* ==================================================== */}
      {/* --- ALL FORM MODALS --- */}
      {/* ==================================================== */}
      
      {/* 1. SKILL FORM MODAL */}
      {showSkillForm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-950/45 backdrop-blur-xs" onClick={() => setShowSkillForm(false)} />
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 max-w-md w-full relative z-10 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2.5 border-b border-neutral-100">
              <h4 className="text-xs font-black text-neutral-950 uppercase tracking-wider">Enregistrer une Compétence</h4>
              <button onClick={() => setShowSkillForm(false)} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSkill} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-neutral-400 block">Nom de la compétence</label>
                <input 
                  type="text" required value={skName} onChange={(e) => setSkName(e.target.value)}
                  placeholder="Ex: Analyse d'États Financiers IFRS"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Catégorie</label>
                  <select 
                    value={skCategory} onChange={(e) => setSkCategory(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-2 text-xs font-bold text-neutral-700 cursor-pointer"
                  >
                    <option value="Finance">Finance</option>
                    <option value="Soft Skills">Soft Skills</option>
                    <option value="Tech / IA">Tech / IA</option>
                    <option value="Langues">Langues</option>
                    <option value="Management">Management</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Statut initial</label>
                  <select 
                    value={skStatus} onChange={(e) => setSkStatus(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-2 text-xs font-bold text-neutral-700 cursor-pointer"
                  >
                    <option value="Planifiée">Planifiée</option>
                    <option value="En cours de travail">En cours de travail</option>
                    <option value="Acquise">Acquise</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-neutral-400 block">Notes & Plan d'Action</label>
                <textarea 
                  value={skNotes} onChange={(e) => setSkNotes(e.target.value)}
                  placeholder="Ex: Suivre la formation sur les fusions-acquisitions, lire des rapports annuels..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  rows={3}
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Ajouter la compétence
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. RECRUITMENT PORTAL FORM MODAL */}
      {showSiteForm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-950/45 backdrop-blur-xs" onClick={() => setShowSiteForm(false)} />
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 max-w-md w-full relative z-10 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2.5 border-b border-neutral-100">
              <h4 className="text-xs font-black text-neutral-950 uppercase tracking-wider">Ajouter un Portail / Site</h4>
              <button onClick={() => setShowSiteForm(false)} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddSite} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Nom du portail</label>
                  <input 
                    type="text" required value={siteName} onChange={(e) => setSiteName(e.target.value)}
                    placeholder="Ex: ReKrute Maroc"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Pays d'origine</label>
                  <select 
                    value={siteCountry} onChange={(e) => setSiteCountry(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-2 text-xs font-bold text-neutral-700 cursor-pointer"
                  >
                    <option value="Maroc">Maroc</option>
                    <option value="France">France</option>
                    <option value="Canada">Canada</option>
                    <option value="Suisse">Suisse</option>
                    <option value="Germany">Allemagne</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Netherlands">Pays-Bas</option>
                    <option value="USA">USA</option>
                    <option value="Worldwide">International</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-neutral-400 block">URL du site</label>
                <input 
                  type="url" value={siteUrl} onChange={(e) => setSiteUrl(e.target.value)}
                  placeholder="https://www.rekrute.com"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Identifiant / Candidat ID</label>
                  <input 
                    type="text" value={siteIdentifiant} onChange={(e) => setSiteIdentifiant(e.target.value)}
                    placeholder="Ex: user_10527"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Mots-clés (séparés par virgules)</label>
                  <input 
                    type="text" value={siteKeywords} onChange={(e) => setSiteKeywords(e.target.value)}
                    placeholder="Ex: Finance, CFO, Audit"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-neutral-400 block">Description & Notes du site</label>
                <textarea 
                  value={siteNotes} onChange={(e) => setSiteNotes(e.target.value)}
                  placeholder="Ex: Principal portail d'offres cadres et financiers au Maroc."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  rows={2}
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Enregistrer le portail
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. TARGET COMPANY FORM MODAL */}
      {showCompanyForm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-950/45 backdrop-blur-xs" onClick={() => setShowCompanyForm(false)} />
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 max-w-md w-full relative z-10 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2.5 border-b border-neutral-100">
              <h4 className="text-xs font-black text-neutral-950 uppercase tracking-wider">Ajouter une Entreprise Cible</h4>
              <button onClick={() => setShowCompanyForm(false)} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddCompany} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Nom de l'entreprise</label>
                  <input 
                    type="text" required value={compName} onChange={(e) => setCompName(e.target.value)}
                    placeholder="Ex: OCP Group"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Niveau d'intérêt (1-5)</label>
                  <select 
                    value={compInterest} onChange={(e) => setCompInterest(Number(e.target.value))}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-2 text-xs font-bold text-neutral-700 cursor-pointer"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (Extrême)</option>
                    <option value={4}>⭐⭐⭐⭐ (Très élevé)</option>
                    <option value={3}>⭐⭐⭐ (Moyen)</option>
                    <option value={2}>⭐⭐ (Faible)</option>
                    <option value={1}>⭐ (Très faible)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-neutral-400 block">Site internet</label>
                <input 
                  type="url" value={compWebsite} onChange={(e) => setCompWebsite(e.target.value)}
                  placeholder="https://www.ocpgroup.ma"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-neutral-400 block">Contact Clé (RH / Recruteur)</label>
                <input 
                  type="text" value={compContact} onChange={(e) => setCompContact(e.target.value)}
                  placeholder="Ex: Mme. Amina El Fassi (Talent Acquisition Specialist)"
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-neutral-400 block">Notes & Synergies</label>
                <textarea 
                  value={compNotes} onChange={(e) => setCompNotes(e.target.value)}
                  placeholder="Ex: Département Corporate active, poste de Analyst ou modélisateur ciblé."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  rows={2}
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Ajouter l'entreprise
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. OPPORTUNITY FORM MODAL */}
      {showOppForm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-950/45 backdrop-blur-xs" onClick={() => setShowOppForm(false)} />
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 max-w-md w-full relative z-10 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2.5 border-b border-neutral-100">
              <h4 className="text-xs font-black text-neutral-950 uppercase tracking-wider">Créer une Opportunité</h4>
              <button onClick={() => setShowOppForm(false)} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddOpp} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Titre du poste</label>
                  <input 
                    type="text" required value={oppTitle} onChange={(e) => setOppTitle(e.target.value)}
                    placeholder="Ex: Analyste M&A Junior"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Entreprise</label>
                  <input 
                    type="text" required value={oppCompany} onChange={(e) => setOppCompany(e.target.value)}
                    placeholder="Ex: Capital Trust Maroc"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Rémunération / Salaire estimé</label>
                  <input 
                    type="text" value={oppSalary} onChange={(e) => setOppSalary(e.target.value)}
                    placeholder="Ex: 14 000 MAD"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Statut du pipeline</label>
                  <select 
                    value={oppStatus} onChange={(e) => setOppStatus(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-2 text-xs font-bold text-neutral-700 cursor-pointer"
                  >
                    <option value="À postuler">À postuler</option>
                    <option value="Postulé">Postulé</option>
                    <option value="Entretien">Entretien</option>
                    <option value="Offre">Offre</option>
                    <option value="Refusé">Refusé</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Date de candidature</label>
                  <input 
                    type="date" value={oppDateApplied} onChange={(e) => setOppDateApplied(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Prochaine action</label>
                  <input 
                    type="text" value={oppNextAction} onChange={(e) => setOppNextAction(e.target.value)}
                    placeholder="Ex: Préparer cas d'évaluation technique"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-neutral-400 block">Lien de l'offre d'emploi</label>
                <input 
                  type="url" value={oppSiteUrl} onChange={(e) => setOppSiteUrl(e.target.value)}
                  placeholder="https://www.linkedin.com/jobs/..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-neutral-400 block">Notes & Suivi technique</label>
                <textarea 
                  value={oppNotes} onChange={(e) => setOppNotes(e.target.value)}
                  placeholder="Ex: Entretien RH passé, retour positif attendu d'ici vendredi."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  rows={2}
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Créer l'opportunité
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 5. CERTIFICATE FORM MODAL */}
      {showCertForm && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-neutral-950/45 backdrop-blur-xs" onClick={() => setShowCertForm(false)} />
          <div className="bg-white rounded-3xl p-6 border border-neutral-200 max-w-md w-full relative z-10 space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-2.5 border-b border-neutral-100">
              <h4 className="text-xs font-black text-neutral-950 uppercase tracking-wider">Enregistrer un Certificat / Diplôme</h4>
              <button onClick={() => setShowCertForm(false)} className="text-neutral-400 hover:text-neutral-600 cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddCertificate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-neutral-400 block">Nom de la Certification / Diplôme</label>
                <input 
                  type="text" required value={certName} onChange={(e) => setCertName(e.target.value)}
                  placeholder="Ex: CFA Level I, Licence de Finance..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-neutral-400 block">Organisme Émetteur / École</label>
                <input 
                  type="text" required value={certAuthority} onChange={(e) => setCertAuthority(e.target.value)}
                  placeholder="Ex: CFA Institute, Université de Lyon..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Niche / Spécialité</label>
                  <select 
                    value={certNiche} onChange={(e) => setCertNiche(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-2 text-xs font-bold text-neutral-700 cursor-pointer"
                  >
                    <option value="Finance">Finance</option>
                    <option value="Tech">Tech</option>
                    <option value="Management">Management</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Statut</label>
                  <select 
                    value={certStatus} onChange={(e) => setCertStatus(e.target.value as any)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-2 py-2 text-xs font-bold text-neutral-700 cursor-pointer"
                  >
                    <option value="Planifié">Planifié</option>
                    <option value="En cours">En cours</option>
                    <option value="Obtenu">Obtenu</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Date d'obtention / Prévue</label>
                  <input 
                    type="date" value={certIssueDate} onChange={(e) => setCertIssueDate(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Date d'expiration (optionnel)</label>
                  <input 
                    type="date" value={certExpiryDate} onChange={(e) => setCertExpiryDate(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">Identifiant du diplôme</label>
                  <input 
                    type="text" value={certCredentialId} onChange={(e) => setCertCredentialId(e.target.value)}
                    placeholder="Ex: ID-90815"
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-neutral-400 block">URL de vérification</label>
                  <input 
                    type="url" value={certCredentialUrl} onChange={(e) => setCertCredentialUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-neutral-400 block">Notes, Objectifs & Justificatifs</label>
                <textarea 
                  value={certNotes} onChange={(e) => setCertNotes(e.target.value)}
                  placeholder="Ex: Score de passage attendu, modules techniques clés à valider..."
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-xs font-medium focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  rows={2}
                />
              </div>

              <button 
                type="submit" 
                className="w-full bg-neutral-950 hover:bg-neutral-800 text-white py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Créer le Certificat
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
