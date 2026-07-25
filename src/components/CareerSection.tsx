import React, { useState, useEffect } from "react";
import { 
  CareerSkill, 
  RecruitmentSite, 
  TargetCompany, 
  JobOpportunity, 
  CareerCertificate,
  MobilityCountryStatus,
  RoadmapPhase,
  VisaDocGroup,
  MobilitySkillGroup
} from "../types";
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
  Target,
  TrendingUp,
  TrendingDown,
  Compass,
  Plane,
  FileText,
  CheckSquare,
  Globe2,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  LayoutGrid,
  List
} from "lucide-react";

// --- MOBILITY DEFAULT DATA CONSTANTS (SERROU MOHAMMED - CARRIÈRE EPM FINANCE) ---
const DEFAULT_MOBILITY_COUNTRIES: MobilityCountryStatus[] = [
  { country: "Golfe (Dubaï / Abu Dhabi / Riyad)", entryPath: "Sponsor employeur direct", status: "En veille" },
  { country: "France", entryPath: "Carte Talent — salarié qualifié", status: "Candidatures envoyées" },
  { country: "Allemagne", entryPath: "EU Blue Card", status: "En veille" },
  { country: "Pays-Bas / Belgique / Luxembourg", entryPath: "Highly Skilled Migrant / permis unique", status: "En veille" },
  { country: "Singapour", entryPath: "Employment Pass + COMPASS", status: "En veille" },
  { country: "Canada", entryPath: "Express Entry / PEQ", status: "Candidatures envoyées" },
  { country: "Suisse", entryPath: "Permis employeur (quota)", status: "En veille" },
  { country: "Royaume-Uni", entryPath: "Skilled Worker visa", status: "En veille" },
  { country: "États-Unis", entryPath: "H-1B / transfert L-1", status: "En veille" },
];

const TARGET_MARKETS_REF = [
  { country: "Golfe (UAE/KSA)", demand: "Très forte", entry: "Sponsor employeur direct", salaryThreshold: "25-40k USD net/an", difficulty: 1 },
  { country: "France", demand: "Très forte", entry: "Carte Talent — salarié qualifié", salaryThreshold: "~39 582 €/an", difficulty: 2 },
  { country: "Allemagne", demand: "Forte", entry: "EU Blue Card", salaryThreshold: "~50 700 €/an (45 934 € poste pénurie)", difficulty: 2 },
  { country: "Pays-Bas / Belgique / Lux.", demand: "Forte", entry: "Highly Skilled Migrant / permis unique", salaryThreshold: "~45-55k €/an", difficulty: 2 },
  { country: "Singapour", demand: "Forte (hub APAC)", entry: "Employment Pass + COMPASS", salaryThreshold: "6 200 SGD/mois (finance)", difficulty: 3 },
  { country: "Suisse", demand: "Forte", entry: "Permis employeur (quota non-UE)", salaryThreshold: "Pas de seuil fixe, ~70-100k CHF", difficulty: 3 },
  { country: "Royaume-Uni", demand: "Forte", entry: "Skilled Worker visa", salaryThreshold: "~£38 700/an", difficulty: 3 },
  { country: "Canada", demand: "Forte", entry: "Express Entry / PEQ", salaryThreshold: "Score CRS, pas de seuil fixe", difficulty: 3 },
  { country: "États-Unis", demand: "Forte en théorie", entry: "H-1B (loterie) ou transfert L-1", salaryThreshold: "~70-115k USD/an", difficulty: 5 },
];

const DEFAULT_MOBILITY_SKILLS: MobilitySkillGroup[] = [
  {
    category: "Anglais professionnel",
    items: [
      { id: "sk_eng_1", label: "Passer un test certifiant (IELTS/TOEFL/Versant) niveau C1", done: false },
      { id: "sk_eng_2", label: "3 sessions/semaine de pratique orale (italki/Preply)", done: false },
      { id: "sk_eng_3", label: "Simuler 2 entretiens techniques en anglais", done: false }
    ]
  },
  {
    category: "2e plateforme EPM",
    items: [
      { id: "sk_epm_1", label: "Choisir entre Board / OneStream / Oracle EPBCS selon le marché visé", done: false },
      { id: "sk_epm_2", label: "Suivre la formation en ligne officielle", done: false },
      { id: "sk_epm_3", label: "Obtenir la certification", done: false }
    ]
  },
  {
    category: "Data & intégration",
    items: [
      { id: "sk_data_1", label: "Formation Power Query avancé", done: false },
      { id: "sk_data_2", label: "Bases API REST / intégration de données", done: false },
      { id: "sk_data_3", label: "Petit projet perso d'intégration EPM ↔ source externe", done: false }
    ]
  },
  {
    category: "Gestion de projet",
    items: [
      { id: "sk_pm_1", label: "Certification légère PMP ou Scrum Master", done: false },
      { id: "sk_pm_2", label: "Documenter 2 projets pilotés chez VISEO comme études de cas", done: false }
    ]
  },
  {
    category: "Visibilité digitale",
    items: [
      { id: "sk_vis_1", label: "Refonte CV version France/Europe", done: true },
      { id: "sk_vis_2", label: "Refonte CV version internationale (anglais, sans photo)", done: false },
      { id: "sk_vis_3", label: "Optimisation LinkedIn (mots-clés + Open to Work ciblé)", done: true },
      { id: "sk_vis_4", label: "5 entretiens informationnels avec des expatriés EPM", done: false }
    ]
  }
];

const DEFAULT_MOBILITY_ROADMAP: RoadmapPhase[] = [
  {
    phase: "0–6 mois",
    title: "Se rendre exportable",
    items: [
      { id: "rd_1_1", label: "Test d'anglais certifiant programmé", done: false },
      { id: "rd_1_2", label: "CV et LinkedIn refaits", done: true },
      { id: "rd_1_3", label: "Inscription communautés Anaplan / Pigment", done: true },
      { id: "rd_1_4", label: "Veille active sur les offres lancée", done: true }
    ]
  },
  {
    phase: "6–18 mois",
    title: "Candidater sur 3 fronts",
    items: [
      { id: "rd_2_1", label: "10-15 candidatures Europe continentale", done: false },
      { id: "rd_2_2", label: "5-8 candidatures Golfe", done: false },
      { id: "rd_2_3", label: "5 candidatures Singapour", done: false },
      { id: "rd_2_4", label: "Dossier visa lancé dès offre obtenue", done: false }
    ]
  },
  {
    phase: "18–36 mois",
    title: "Monter en séniorité",
    items: [
      { id: "rd_3_1", label: "Viser un rôle Senior/Lead EPM Consultant", done: false },
      { id: "rd_3_2", label: "Piloter un projet complet en autonomie", done: false },
      { id: "rd_3_3", label: "Explorer Express Entry Canada si pertinent", done: false },
      { id: "rd_3_4", label: "Évaluer une piste transfert intra-groupe vers les USA", done: false }
    ]
  },
  {
    phase: "3–5 ans",
    title: "Objectif long terme",
    items: [
      { id: "rd_4_1", label: "Devenir Manager / Practice Lead EPM", done: false },
      { id: "rd_4_2", label: "Ou rejoindre une direction financière (FP&A Director)", done: false },
      { id: "rd_4_3", label: "Envisager la résidence permanente / naturalisation", done: false }
    ]
  }
];

const DEFAULT_MOBILITY_VISA: VisaDocGroup[] = [
  {
    country: "France",
    docs: [
      { id: "v_fr_1", label: "Diplôme reconnu via ENIC-NARIC", done: false },
      { id: "v_fr_2", label: "Contrat CDI/CDD ≥ 3 mois ≥ seuil salarial", done: false },
      { id: "v_fr_3", label: "Passeport valide + photos", done: true },
      { id: "v_fr_4", label: "Justificatif de logement", done: false }
    ]
  },
  {
    country: "Allemagne",
    docs: [
      { id: "v_de_1", label: "Diplôme reconnu (anabin / ZAB)", done: false },
      { id: "v_de_2", label: "Contrat de travail signé ≥ seuil Blue Card", done: false },
      { id: "v_de_3", label: "Assurance santé", done: false },
      { id: "v_de_4", label: "Preuve de logement", done: false }
    ]
  },
  {
    country: "Golfe (UAE/KSA)",
    docs: [
      { id: "v_uae_1", label: "Diplôme légalisé / apostillé", done: false },
      { id: "v_uae_2", label: "Contrat signé par l'employeur sponsor", done: false },
      { id: "v_uae_3", label: "Visite médicale sur place", done: false },
      { id: "v_uae_4", label: "Casier judiciaire", done: false }
    ]
  },
  {
    country: "Singapour",
    docs: [
      { id: "v_sg_1", label: "Qualifications vérifiées (screening MOM)", done: false },
      { id: "v_sg_2", label: "Contrat + évaluation COMPASS", done: false },
      { id: "v_sg_3", label: "Passeport valide", done: true }
    ]
  },
  {
    country: "Canada",
    docs: [
      { id: "v_ca_1", label: "Profil Express Entry créé (score CRS)", done: false },
      { id: "v_ca_2", label: "Résultats de test de langue (IELTS/TEF)", done: false },
      { id: "v_ca_3", label: "Évaluation des diplômes (ECA)", done: false },
      { id: "v_ca_4", label: "Preuve de fonds", done: false }
    ]
  }
];

interface CareerSectionProps {
  activeTab?: "dash" | "mobility" | "pipeline" | "skills" | "recruitment" | "companies" | "certificates" | "sites";
  onNavigate?: (moduleId: string) => void;
}

export default function CareerSection({ activeTab, onNavigate }: CareerSectionProps = {}) {
  const [careerTab, setCareerTab] = useState<"dash" | "mobility" | "pipeline" | "skills" | "recruitment" | "companies" | "certificates">("dash");

  useEffect(() => {
    if (activeTab) {
      if (activeTab === "sites") {
        setCareerTab("recruitment");
      } else if (["dash", "mobility", "pipeline", "skills", "recruitment", "companies", "certificates"].includes(activeTab)) {
        setCareerTab(activeTab as any);
      }
    }
  }, [activeTab]);

  const handleTabChange = (tab: "dash" | "mobility" | "pipeline" | "skills" | "recruitment" | "companies" | "certificates") => {
    setCareerTab(tab);
    if (onNavigate) {
      const mappedId = tab === "recruitment" ? "career_sites" : `career_${tab}`;
      onNavigate(mappedId);
    }
  };

  // --- MOBILITY & TOUR DE CONTRÔLE STATE ---
  const [mobilityCountries, setMobilityCountries] = useState<MobilityCountryStatus[]>(() => {
    const saved = localStorage.getItem("mp_mobility_countries");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_MOBILITY_COUNTRIES;
  });

  const [mobilitySkills, setMobilitySkills] = useState<MobilitySkillGroup[]>(() => {
    const saved = localStorage.getItem("mp_mobility_skills");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_MOBILITY_SKILLS;
  });

  const [mobilityRoadmap, setMobilityRoadmap] = useState<RoadmapPhase[]>(() => {
    const saved = localStorage.getItem("mp_mobility_roadmap");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_MOBILITY_ROADMAP;
  });

  const [mobilityVisa, setMobilityVisa] = useState<VisaDocGroup[]>(() => {
    const saved = localStorage.getItem("mp_mobility_visa");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_MOBILITY_VISA;
  });

  const [mobilityInnerTab, setMobilityInnerTab] = useState<"overview" | "board" | "skills" | "roadmap" | "visa" | "market">("overview");

  useEffect(() => { localStorage.setItem("mp_mobility_countries", JSON.stringify(mobilityCountries)); }, [mobilityCountries]);
  useEffect(() => { localStorage.setItem("mp_mobility_skills", JSON.stringify(mobilitySkills)); }, [mobilitySkills]);
  useEffect(() => { localStorage.setItem("mp_mobility_roadmap", JSON.stringify(mobilityRoadmap)); }, [mobilityRoadmap]);
  useEffect(() => { localStorage.setItem("mp_mobility_visa", JSON.stringify(mobilityVisa)); }, [mobilityVisa]);

  // Calculations for global gauge & progress
  const totalSkillActions = mobilitySkills.reduce((acc, g) => acc + g.items.length, 0);
  const doneSkillActions = mobilitySkills.reduce((acc, g) => acc + g.items.filter(i => i.done).length, 0);

  const totalRoadmapActions = mobilityRoadmap.reduce((acc, p) => acc + p.items.length, 0);
  const doneRoadmapActions = mobilityRoadmap.reduce((acc, p) => acc + p.items.filter(i => i.done).length, 0);

  const totalVisaActions = mobilityVisa.reduce((acc, v) => acc + v.docs.length, 0);
  const doneVisaActions = mobilityVisa.reduce((acc, v) => acc + v.docs.filter(d => d.done).length, 0);

  const globalTotalActions = totalSkillActions + totalRoadmapActions + totalVisaActions;
  const globalDoneActions = doneSkillActions + doneRoadmapActions + doneVisaActions;
  const globalProgressPct = globalTotalActions > 0 ? Math.round((globalDoneActions / globalTotalActions) * 100) : 0;


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

  const [oppStatusFilter, setOppStatusFilter] = useState<"Tous" | JobOpportunity["status"]>("Tous");
  const [oppSearchQuery, setOppSearchQuery] = useState("");
  const [oppViewMode, setOppViewMode] = useState<"table" | "grid">("table");

  // --- METRIC CALCS ---
  const acquiredSkillsCount = skills.filter(s => s.status === "Acquise").length;
  const activeOpportunities = jobOpportunities.filter(o => o.status !== "Refusé" && o.status !== "Offre").length;
  const offeredOpportunities = jobOpportunities.filter(o => o.status === "Offre").length;
  const obtainedCertificatesCount = certificates.filter(c => c.status === "Obtenu").length;
  
  // --- INTERVIEW SUCCESS RATE (LAST 30 DAYS) ---
  const interviewSuccessRate30Days = React.useMemo(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const recentOpps = jobOpportunities.filter(opp => {
      if (!opp.dateApplied) return false;
      const appDate = new Date(opp.dateApplied);
      return appDate >= thirtyDaysAgo && appDate <= today && opp.status !== "À postuler";
    });

    const totalApplied = recentOpps.length;
    const totalInterviews = recentOpps.filter(opp => opp.status === "Entretien" || opp.status === "Offre").length;
    const rate = totalApplied > 0 ? (totalInterviews / totalApplied) * 100 : 0;

    return {
      totalApplied,
      totalInterviews,
      rate: Math.round(rate)
    };
  }, [jobOpportunities]);

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
      
      {/* 0. SUMMARY WIDGET: INTERVIEW SUCCESS RATE */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-3xs flex flex-col md:flex-row md:items-center justify-between gap-5 animate-in fade-in duration-300">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl shrink-0">
            <Target className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-black text-neutral-950 uppercase tracking-tight flex items-center gap-2">
              <span>Conversion en Entretien (30j)</span>
              <span className="text-[10px] font-mono font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                Taux de succès
              </span>
            </h4>
            <p className="text-xs text-neutral-500 font-medium leading-relaxed">
              Pourcentage de candidatures envoyées au cours des 30 derniers jours qui ont abouti à un entretien d'embauche ou à une offre.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 shrink-0 border-t md:border-t-0 border-neutral-100 pt-4 md:pt-0">
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block font-mono">Performance de Conversion</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black font-mono text-neutral-950 leading-none">
                {interviewSuccessRate30Days.rate}%
              </span>
              <span className="text-xs text-neutral-500 font-bold font-mono">
                ({interviewSuccessRate30Days.totalInterviews} / {interviewSuccessRate30Days.totalApplied} candidatures)
              </span>
              {interviewSuccessRate30Days.rate >= 50 ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>Excellent</span>
                </span>
              ) : interviewSuccessRate30Days.rate > 0 ? (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-0.5">
                  <TrendingUp className="w-3 h-3" />
                  <span>En cours</span>
                </span>
              ) : (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-neutral-50 text-neutral-600 border border-neutral-200 flex items-center gap-0.5">
                  <span>Aucun entretien</span>
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <div className="w-32 bg-neutral-100 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    interviewSuccessRate30Days.rate >= 50 
                      ? "bg-emerald-500" 
                      : interviewSuccessRate30Days.rate >= 25 
                      ? "bg-indigo-500" 
                      : "bg-amber-500"
                  }`}
                  style={{ width: `${Math.min(100, Math.max(0, interviewSuccessRate30Days.rate || 0))}%` }}
                />
              </div>
              <span className="text-[10px] text-neutral-400 font-bold font-mono">
                {interviewSuccessRate30Days.totalApplied > 0 ? "Actif" : "En attente"}
              </span>
            </div>
          </div>
        </div>
      </div>

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
          onClick={() => handleTabChange("mobility")}
          className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wide transition-all cursor-pointer select-none flex items-center gap-1.5 ${
            careerTab === "mobility" ? "bg-emerald-600 text-white shadow-sm font-black" : "text-emerald-800 bg-emerald-50/80 hover:bg-emerald-100/80 border border-emerald-200/60 font-bold"
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Mobilité & EPM ({globalProgressPct}%)</span>
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
      {/* --- TAB: MOBILITÉ INTERNATIONALE & EPM (TOUR DE CONTRÔLE) --- */}
      {/* ==================================================== */}
      {careerTab === "mobility" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Header Card & Progress Gauge */}
          <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-zinc-800 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-[11px] font-black uppercase tracking-wider font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Tour de contrôle · Mobilité internationale
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                Serrou Mohammed <span className="text-zinc-400 font-normal">· Plan EPM Finance</span>
              </h2>
              <p className="text-xs md:text-sm text-zinc-300 font-medium leading-relaxed">
                Suivi vivant de votre recherche multi-pays : candidatures, compétences, échéances salariales et dossiers visa au même endroit.
              </p>
            </div>

            {/* Circular Gauge */}
            <div className="z-10 bg-zinc-900/90 border border-zinc-800/90 rounded-2xl p-4 flex items-center gap-4 shadow-inner min-w-[250px]">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="6" className="text-zinc-800" fill="transparent" />
                  <circle 
                    cx="32" 
                    cy="32" 
                    r="26" 
                    stroke="currentColor" 
                    strokeWidth="6" 
                    className="text-emerald-400 transition-all duration-700 ease-out" 
                    fill="transparent" 
                    strokeDasharray={163.3}
                    strokeDashoffset={163.3 - (163.3 * globalProgressPct) / 100} 
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-sm font-black font-mono text-white">{globalProgressPct}%</span>
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 block font-mono">Avancement Global</span>
                <span className="text-xs font-bold text-emerald-400">{globalDoneActions} / {globalTotalActions} actions réalisées</span>
                <span className="text-[10px] text-zinc-400 block mt-0.5">Compétences + Roadmap + Visas</span>
              </div>
            </div>
          </div>

          {/* Inner Sub-navigation bar for Mobility */}
          <div className="flex flex-wrap items-center gap-1.5 bg-neutral-100 p-1.5 rounded-2xl border border-neutral-200/80">
            {[
              { id: "overview", label: "Vue d'ensemble", icon: LayoutDashboard },
              { id: "board", label: "Statut par Destination (Board)", icon: Compass },
              { id: "market", label: "Marchés Cibles 2026", icon: Globe },
              { id: "skills", label: "Compétences & Dev", icon: Sparkles },
              { id: "roadmap", label: "Feuille de Route (Horizons)", icon: MapPin },
              { id: "visa", label: "Visas & Documents", icon: ShieldCheck }
            ].map(subTab => {
              const IconComp = subTab.icon;
              const isActive = mobilityInnerTab === subTab.id;
              return (
                <button
                  key={subTab.id}
                  onClick={() => setMobilityInnerTab(subTab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer select-none flex items-center gap-1.5 ${
                    isActive ? "bg-white text-zinc-950 shadow-xs font-black" : "text-neutral-600 hover:text-zinc-950 hover:bg-neutral-200/60"
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5" />
                  <span>{subTab.label}</span>
                </button>
              );
            })}
          </div>

          {/* INNER VIEW: Vue d'ensemble OR Board */}
          {(mobilityInnerTab === "overview" || mobilityInnerTab === "board") && (
            <div className="space-y-6">
              {/* Split-Flap Destination Board */}
              <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 text-zinc-100 shadow-xl font-mono space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-800 pb-4 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                    </span>
                    <h3 className="text-sm font-black text-emerald-400 uppercase tracking-widest">
                      STATUT PAR DESTINATION — TOUR DE CONTRÔLE
                    </h3>
                  </div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest bg-zinc-900 px-2.5 py-1 rounded-lg border border-zinc-800">
                    Sponsor & Visas 2026
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-zinc-500 border-b border-zinc-800 uppercase text-[10px] tracking-widest font-sans">
                        <th className="py-2.5 px-3">Pays / Région</th>
                        <th className="py-2.5 px-3">Voie d'entrée privilégiée</th>
                        <th className="py-2.5 px-3 text-right">Statut Actuel</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {mobilityCountries.map((c, idx) => {
                        const getStatusBadge = (status: string) => {
                          switch (status) {
                            case "Offre reçue": return "bg-emerald-950 text-emerald-300 border-emerald-700/80";
                            case "En entretien": return "bg-indigo-950 text-indigo-300 border-indigo-700/80";
                            case "Candidatures envoyées": return "bg-amber-950 text-amber-300 border-amber-700/80";
                            case "Mis en pause": return "bg-zinc-900 text-zinc-400 border-zinc-700";
                            default: return "bg-zinc-900 text-zinc-300 border-zinc-800";
                          }
                        };
                        return (
                          <tr key={idx} className="hover:bg-zinc-900/50 transition-colors">
                            <td className="py-3 px-3 font-bold text-white font-sans">{c.country}</td>
                            <td className="py-3 px-3 text-zinc-400 text-[11px] font-sans">{c.entryPath}</td>
                            <td className="py-3 px-3 text-right">
                              <select
                                value={c.status}
                                onChange={(e) => {
                                  const updated = [...mobilityCountries];
                                  updated[idx].status = e.target.value as any;
                                  setMobilityCountries(updated);
                                }}
                                className={`text-[11px] font-black uppercase px-2.5 py-1 rounded-lg border cursor-pointer ${getStatusBadge(c.status)} focus:outline-none`}
                              >
                                <option value="En veille" className="bg-zinc-900 text-white">En veille</option>
                                <option value="Candidatures envoyées" className="bg-zinc-900 text-amber-300">Candidatures envoyées</option>
                                <option value="En entretien" className="bg-zinc-900 text-indigo-300">En entretien</option>
                                <option value="Offre reçue" className="bg-zinc-900 text-emerald-300">Offre reçue</option>
                                <option value="Mis en pause" className="bg-zinc-900 text-zinc-400">Mis en pause</option>
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* INNER VIEW: Market Reference Table 2026 */}
          {(mobilityInnerTab === "overview" || mobilityInnerTab === "market") && (
            <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                    <Globe className="w-4 h-4" />
                  </span>
                  <h3 className="text-sm font-black text-neutral-950 uppercase tracking-tight">
                    Comparatif des Marchés Cibles (Grille de Référence 2026)
                  </h3>
                </div>
                <span className="text-[10px] font-bold text-neutral-400 font-mono">Conditions de Visa & Seuils</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-50 text-neutral-500 font-black uppercase text-[10px] tracking-wider border-b border-neutral-200">
                      <th className="py-3 px-3">Marché / Zone</th>
                      <th className="py-3 px-3">Demande EPM / FP&A</th>
                      <th className="py-3 px-3">Voie d'entrée</th>
                      <th className="py-3 px-3">Seuil Salaire Visa 2026</th>
                      <th className="py-3 px-3 text-right">Difficulté Visa</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-medium">
                    {TARGET_MARKETS_REF.map((m, idx) => (
                      <tr key={idx} className="hover:bg-neutral-50/70 transition-colors">
                        <td className="py-3 px-3 font-bold text-neutral-900">{m.country}</td>
                        <td className="py-3 px-3 text-neutral-700">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            m.demand.includes("Très forte") ? "bg-emerald-100 text-emerald-800" : "bg-indigo-100 text-indigo-800"
                          }`}>
                            {m.demand}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-neutral-600">{m.entry}</td>
                        <td className="py-3 px-3 font-mono text-neutral-800 font-bold">{m.salaryThreshold}</td>
                        <td className="py-3 px-3 text-right font-mono text-amber-600 font-bold">
                          {"●".repeat(m.difficulty)}{"○".repeat(5 - m.difficulty)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INNER VIEW: Skills Checklist */}
          {(mobilityInnerTab === "overview" || mobilityInnerTab === "skills") && (
            <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-purple-50 text-purple-600 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-neutral-950 uppercase tracking-tight">
                      Plan de Montée en Compétences (EPM & Carrière Int.)
                    </h3>
                    <span className="text-[10px] text-neutral-500 font-medium">
                      {doneSkillActions} sur {totalSkillActions} actions validées
                    </span>
                  </div>
                </div>
                <div className="w-32 bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-600 rounded-full transition-all duration-500" 
                    style={{ width: `${totalSkillActions > 0 ? (doneSkillActions / totalSkillActions) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {mobilitySkills.map((grp, gIdx) => {
                  const grpDone = grp.items.filter(i => i.done).length;
                  return (
                    <div key={gIdx} className="p-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl space-y-3">
                      <div className="flex justify-between items-center border-b border-neutral-200/60 pb-2">
                        <h4 className="text-xs font-black text-neutral-900 uppercase tracking-tight">{grp.category}</h4>
                        <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                          {grpDone}/{grp.items.length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {grp.items.map((item) => (
                          <label key={item.id} className="flex items-start gap-2.5 cursor-pointer text-xs group">
                            <input
                              type="checkbox"
                              checked={item.done}
                              onChange={() => {
                                const updated = [...mobilitySkills];
                                const targetItem = updated[gIdx].items.find(i => i.id === item.id);
                                if (targetItem) targetItem.done = !targetItem.done;
                                setMobilitySkills(updated);
                              }}
                              className="mt-0.5 rounded text-purple-600 focus:ring-purple-500 border-neutral-300 cursor-pointer"
                            />
                            <span className={`leading-snug transition-colors ${
                              item.done ? "line-through text-neutral-400" : "text-neutral-800 font-medium group-hover:text-neutral-950"
                            }`}>
                              {item.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* INNER VIEW: Roadmap */}
          {(mobilityInnerTab === "overview" || mobilityInnerTab === "roadmap") && (
            <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
                    <MapPin className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-neutral-950 uppercase tracking-tight">
                      Feuille de Route par Horizon (Roadmap Multi-Séquences)
                    </h3>
                    <span className="text-[10px] text-neutral-500 font-medium">
                      {doneRoadmapActions} sur {totalRoadmapActions} jalons complétés
                    </span>
                  </div>
                </div>
                <div className="w-32 bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                    style={{ width: `${totalRoadmapActions > 0 ? (doneRoadmapActions / totalRoadmapActions) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {mobilityRoadmap.map((phase, pIdx) => {
                  const pDone = phase.items.filter(i => i.done).length;
                  return (
                    <div key={pIdx} className="p-4 bg-neutral-50/70 border border-neutral-200/80 rounded-2xl space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                            {phase.phase}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500">{pDone}/{phase.items.length}</span>
                        </div>
                        <h4 className="text-xs font-black text-neutral-900 leading-snug">{phase.title}</h4>
                        <div className="space-y-2 pt-1 border-t border-neutral-200/60">
                          {phase.items.map((item) => (
                            <label key={item.id} className="flex items-start gap-2 cursor-pointer text-[11px] group">
                              <input
                                type="checkbox"
                                checked={item.done}
                                onChange={() => {
                                  const updated = [...mobilityRoadmap];
                                  const targetItem = updated[pIdx].items.find(i => i.id === item.id);
                                  if (targetItem) targetItem.done = !targetItem.done;
                                  setMobilityRoadmap(updated);
                                }}
                                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-neutral-300 cursor-pointer"
                              />
                              <span className={`leading-snug transition-colors ${
                                item.done ? "line-through text-neutral-400" : "text-neutral-700 group-hover:text-neutral-950 font-medium"
                              }`}>
                                {item.label}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* INNER VIEW: Visa & Documents Checklist */}
          {(mobilityInnerTab === "overview" || mobilityInnerTab === "visa") && (
            <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs space-y-5">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                    <ShieldCheck className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-sm font-black text-neutral-950 uppercase tracking-tight">
                      Dossiers Visa & Pièces Justificatives par Pays
                    </h3>
                    <span className="text-[10px] text-neutral-500 font-medium">
                      {doneVisaActions} sur {totalVisaActions} pièces prêtes
                    </span>
                  </div>
                </div>
                <div className="w-32 bg-neutral-100 h-2 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all duration-500" 
                    style={{ width: `${totalVisaActions > 0 ? (doneVisaActions / totalVisaActions) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {mobilityVisa.map((vGroup, vIdx) => {
                  const vDone = vGroup.docs.filter(d => d.done).length;
                  return (
                    <div key={vIdx} className="p-4 bg-neutral-50/70 border border-neutral-200/80 rounded-2xl space-y-3">
                      <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                        <h4 className="text-xs font-black text-neutral-900">{vGroup.country}</h4>
                        <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          {vDone}/{vGroup.docs.length}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {vGroup.docs.map((docItem) => (
                          <label key={docItem.id} className="flex items-start gap-2 cursor-pointer text-[11px] group">
                            <input
                              type="checkbox"
                              checked={docItem.done}
                              onChange={() => {
                                const updated = [...mobilityVisa];
                                const targetDoc = updated[vIdx].docs.find(d => d.id === docItem.id);
                                if (targetDoc) targetDoc.done = !targetDoc.done;
                                setMobilityVisa(updated);
                              }}
                              className="mt-0.5 rounded text-amber-600 focus:ring-amber-500 border-neutral-300 cursor-pointer"
                            />
                            <span className={`leading-snug transition-colors ${
                              docItem.done ? "line-through text-neutral-400" : "text-neutral-700 group-hover:text-neutral-950 font-medium"
                            }`}>
                              {docItem.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      )}

      {/* ==================================================== */}
      {/* --- TAB: DASHBOARD DE CARRIÈRE --- */}
      {/* ==================================================== */}
      {careerTab === "dash" && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Featured Banner: Tour de Contrôle Mobilité Internationale */}
          <div className="bg-gradient-to-br from-zinc-950 via-zinc-900 to-indigo-950 text-white rounded-3xl p-6 shadow-lg border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                  <Compass className="w-4 h-4" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 font-mono">
                  Module Actif · Mobilité Internationale EPM
                </span>
              </div>
              <h3 className="text-xl font-black text-white">
                Tour de contrôle · Plan de carrière Serrou Mohammed
              </h3>
              <p className="text-xs text-zinc-300 font-medium max-w-2xl leading-relaxed">
                Tableau de bord vivant multi-pays : suivi des candidatures (Golfe, France, Canada...), plan de compétences EPM, grille de salaire visa 2026 et dossiers administratifs.
              </p>
            </div>
            
            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right hidden sm:block">
                <span className="text-2xl font-black font-mono text-emerald-400 block">{globalProgressPct}%</span>
                <span className="text-[10px] text-zinc-400 font-mono">{globalDoneActions} / {globalTotalActions} actions faites</span>
              </div>
              <button
                onClick={() => handleTabChange("mobility")}
                className="px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Ouvrir la Tour de Contrôle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

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
      {/* --- TAB: PIPELINE DES CANDIDATURES & OPPORTUNITÉS --- */}
      {/* ==================================================== */}
      {careerTab === "pipeline" && (() => {
        const filteredOpps = jobOpportunities.filter(opp => {
          const matchesStatus = oppStatusFilter === "Tous" || opp.status === oppStatusFilter;
          const matchesQuery = opp.title.toLowerCase().includes(oppSearchQuery.toLowerCase()) ||
                               opp.company.toLowerCase().includes(oppSearchQuery.toLowerCase()) ||
                               (opp.notes || "").toLowerCase().includes(oppSearchQuery.toLowerCase());
          return matchesStatus && matchesQuery;
        });

        const counts = {
          total: jobOpportunities.length,
          aPostuler: jobOpportunities.filter(o => o.status === "À postuler").length,
          postule: jobOpportunities.filter(o => o.status === "Postulé").length,
          entretien: jobOpportunities.filter(o => o.status === "Entretien").length,
          offre: jobOpportunities.filter(o => o.status === "Offre").length,
          refuse: jobOpportunities.filter(o => o.status === "Refusé").length
        };

        const getStatusBadge = (status: JobOpportunity["status"]) => {
          switch (status) {
            case "À postuler":
              return "bg-neutral-100 text-neutral-700 border-neutral-200";
            case "Postulé":
              return "bg-indigo-50 text-indigo-700 border-indigo-200";
            case "Entretien":
              return "bg-amber-50 text-amber-700 border-amber-200";
            case "Offre":
              return "bg-emerald-50 text-emerald-700 border-emerald-200";
            case "Refusé":
              return "bg-red-50 text-red-700 border-red-200";
            default:
              return "bg-neutral-100 text-neutral-600 border-neutral-200";
          }
        };

        return (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* KPI Metrics Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div className="bg-white border border-neutral-200 rounded-2xl p-3.5 shadow-3xs space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Total Offres</span>
                <p className="text-xl font-black text-neutral-900 font-mono">{counts.total}</p>
              </div>
              <div className="bg-white border border-neutral-200 rounded-2xl p-3.5 shadow-3xs space-y-1">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">À Postuler</span>
                <p className="text-xl font-black text-neutral-700 font-mono">{counts.aPostuler}</p>
              </div>
              <div className="bg-white border border-indigo-100 rounded-2xl p-3.5 shadow-3xs space-y-1 bg-indigo-50/20">
                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">Postulées</span>
                <p className="text-xl font-black text-indigo-700 font-mono">{counts.postule}</p>
              </div>
              <div className="bg-white border border-amber-100 rounded-2xl p-3.5 shadow-3xs space-y-1 bg-amber-50/20">
                <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block">Entretiens</span>
                <p className="text-xl font-black text-amber-700 font-mono">{counts.entretien}</p>
              </div>
              <div className="bg-white border border-emerald-100 rounded-2xl p-3.5 shadow-3xs space-y-1 bg-emerald-50/20 col-span-2 sm:col-span-1">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Offres Obtenues</span>
                <p className="text-xl font-black text-emerald-700 font-mono">{counts.offre}</p>
              </div>
            </div>

            {/* Header & Action Controls Bar */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-3xs space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-amber-500 shrink-0" />
                  <h3 className="text-xs font-black text-neutral-950 uppercase tracking-tight">
                    Suivi des Candidatures & Opportunités
                  </h3>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* View Mode Toggle */}
                  <div className="bg-neutral-100 p-1 rounded-xl flex items-center gap-1 border border-neutral-200/80">
                    <button
                      onClick={() => setOppViewMode("table")}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        oppViewMode === "table"
                          ? "bg-white text-neutral-900 shadow-3xs font-extrabold"
                          : "text-neutral-500 hover:text-neutral-900"
                      }`}
                      title="Vue Tableau Synthétique"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span className="text-[11px] hidden sm:inline">Tableau</span>
                    </button>
                    <button
                      onClick={() => setOppViewMode("grid")}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        oppViewMode === "grid"
                          ? "bg-white text-neutral-900 shadow-3xs font-extrabold"
                          : "text-neutral-500 hover:text-neutral-900"
                      }`}
                      title="Vue Grille / Cartes"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="text-[11px] hidden sm:inline">Cartes</span>
                    </button>
                  </div>

                  <button
                    onClick={() => setShowOppForm(true)}
                    className="bg-neutral-950 hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nouvelle opportunité</span>
                  </button>
                </div>
              </div>

              {/* Filters & Search Bar */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-neutral-100">
                {/* Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
                  {(["Tous", "À postuler", "Postulé", "Entretien", "Offre", "Refusé"] as const).map(statusTab => {
                    const countVal = statusTab === "Tous" ? counts.total :
                      statusTab === "À postuler" ? counts.aPostuler :
                      statusTab === "Postulé" ? counts.postule :
                      statusTab === "Entretien" ? counts.entretien :
                      statusTab === "Offre" ? counts.offre : counts.refuse;

                    const isActive = oppStatusFilter === statusTab;
                    return (
                      <button
                        key={statusTab}
                        onClick={() => setOppStatusFilter(statusTab)}
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                          isActive
                            ? "bg-neutral-900 text-white font-extrabold shadow-3xs"
                            : "bg-neutral-50 hover:bg-neutral-100 text-neutral-600 border border-neutral-200/60"
                        }`}
                      >
                        <span>{statusTab}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                          isActive ? "bg-neutral-700 text-white" : "bg-neutral-200 text-neutral-700"
                        }`}>
                          {countVal}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Search Box */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Rechercher poste, entreprise..."
                    value={oppSearchQuery}
                    onChange={(e) => setOppSearchQuery(e.target.value)}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-8 pr-3 py-1 text-xs font-sans focus:outline-hidden focus:ring-1 focus:ring-neutral-900"
                  />
                </div>
              </div>
            </div>

            {/* Opportunities Content Rendering */}
            {filteredOpps.length === 0 ? (
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-10 text-center space-y-2">
                <p className="text-xs font-bold text-neutral-500">Aucune candidature trouvée pour ces filtres.</p>
                <p className="text-[11px] text-neutral-400">Cliquez sur "Nouvelle opportunité" pour ajouter une piste d'emploi.</p>
              </div>
            ) : oppViewMode === "table" ? (
              /* TABLE VIEW */
              <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-3xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] font-black uppercase text-neutral-500 font-mono tracking-wider">
                        <th className="p-3.5">Poste & Entreprise</th>
                        <th className="p-3.5">Statut</th>
                        <th className="p-3.5">Rémunération</th>
                        <th className="p-3.5">Prochaine Action</th>
                        <th className="p-3.5">Notes & Historique</th>
                        <th className="p-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {filteredOpps.map(opp => (
                        <tr key={opp.id} className="hover:bg-neutral-50/60 transition-colors">
                          <td className="p-3.5 space-y-0.5">
                            <h5 className="font-extrabold text-neutral-900">{opp.title}</h5>
                            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-indigo-600">
                              <Building2 className="w-3 h-3 text-indigo-500 shrink-0" />
                              <span>{opp.company}</span>
                              {opp.siteUrl && (
                                <a href={opp.siteUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-indigo-600">
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </td>

                          <td className="p-3.5">
                            <select
                              value={opp.status}
                              onChange={(e) => updateOppStatus(opp.id, e.target.value as JobOpportunity["status"])}
                              className={`text-[10px] font-extrabold font-mono px-2.5 py-1 rounded-lg border focus:outline-hidden cursor-pointer ${getStatusBadge(opp.status)}`}
                            >
                              <option value="À postuler">À postuler</option>
                              <option value="Postulé">Postulé</option>
                              <option value="Entretien">Entretien</option>
                              <option value="Offre">Offre Obtenue</option>
                              <option value="Refusé">Refusé</option>
                            </select>
                          </td>

                          <td className="p-3.5">
                            {opp.salary ? (
                              <span className="text-[10px] font-bold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                                {opp.salary}
                              </span>
                            ) : (
                              <span className="text-[10px] text-neutral-400 italic">—</span>
                            )}
                          </td>

                          <td className="p-3.5 max-w-[200px]">
                            {opp.nextAction ? (
                              <span className="text-[11px] font-medium text-amber-900 bg-amber-50/70 border border-amber-100 px-2 py-1 rounded-lg block leading-tight">
                                {opp.nextAction}
                              </span>
                            ) : (
                              <span className="text-[10px] text-neutral-400 italic">—</span>
                            )}
                          </td>

                          <td className="p-3.5 max-w-[220px]">
                            <p className="text-[11px] text-neutral-600 font-medium line-clamp-2">{opp.notes || "—"}</p>
                          </td>

                          <td className="p-3.5 text-right">
                            <button
                              onClick={() => setJobOpportunities(prev => prev.filter(o => o.id !== opp.id))}
                              className="text-neutral-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* GRID CARDS VIEW */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOpps.map(opp => (
                  <div key={opp.id} className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-3 shadow-3xs hover:border-neutral-300 transition-all flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h5 className="text-xs font-black text-neutral-900 leading-snug">{opp.title}</h5>
                          <p className="text-[11px] font-bold text-indigo-600 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3" />
                            <span>{opp.company}</span>
                          </p>
                        </div>
                        <select
                          value={opp.status}
                          onChange={(e) => updateOppStatus(opp.id, e.target.value as JobOpportunity["status"])}
                          className={`text-[9.5px] font-black font-mono px-2 py-0.5 rounded-lg border focus:outline-hidden cursor-pointer ${getStatusBadge(opp.status)}`}
                        >
                          <option value="À postuler">À postuler</option>
                          <option value="Postulé">Postulé</option>
                          <option value="Entretien">Entretien</option>
                          <option value="Offre">Offre</option>
                          <option value="Refusé">Refusé</option>
                        </select>
                      </div>

                      {opp.salary && (
                        <span className="inline-block text-[10px] font-extrabold font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                          {opp.salary}
                        </span>
                      )}

                      {opp.notes && (
                        <p className="text-[11px] text-neutral-600 font-medium leading-relaxed bg-neutral-50/60 p-2.5 rounded-xl border border-neutral-100">
                          {opp.notes}
                        </p>
                      )}

                      {opp.nextAction && (
                        <div className="bg-amber-50/80 border border-amber-200/60 p-2.5 rounded-xl space-y-0.5">
                          <span className="text-[8px] text-amber-800 font-black uppercase font-mono block">Prochaine action:</span>
                          <p className="text-[10.5px] text-neutral-800 leading-snug font-bold">{opp.nextAction}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[10px]">
                      <span className="text-neutral-400 font-mono">
                        {opp.dateApplied ? `Postulé le ${opp.dateApplied}` : "Piste active"}
                      </span>
                      <button
                        onClick={() => setJobOpportunities(prev => prev.filter(o => o.id !== opp.id))}
                        className="text-neutral-400 hover:text-red-500 font-bold cursor-pointer transition-colors"
                      >
                        Supprimer
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* ==================================================== */}
      {/* --- TAB: PORTAILS & SITES DE RECRUTEMENT --- */}
      {/* ==================================================== */}
      {careerTab === "recruitment" && (() => {
        const todayStr = new Date().toISOString().split("T")[0];
        
        // Gen last 7 days dynamically
        const last7Days = [];
        const daysOfWeek = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
        const todayObj = new Date();
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(todayObj.getDate() - i);
          const dateStr = d.toISOString().split("T")[0];
          const dayLabel = daysOfWeek[d.getDay()];
          const dayNum = d.getDate();
          last7Days.push({ dateStr, label: dayLabel, num: dayNum, isToday: dateStr === todayStr });
        }

        const filteredSites = recruitmentSites.filter(site => {
          const matchesSearch = site.name.toLowerCase().includes(siteSearch.toLowerCase()) || 
                                (site.notes || "").toLowerCase().includes(siteSearch.toLowerCase()) ||
                                (site.keywords || []).some(kw => kw.toLowerCase().includes(siteSearch.toLowerCase()));
          const matchesCountry = siteCountryFilter === "Tous" || site.country === siteCountryFilter;
          return matchesSearch && matchesCountry;
        });

        const todayVisitedCount = recruitmentSites.filter(s => s.visitedDates?.includes(todayStr) || s.visited).length;

        return (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="bg-white border border-neutral-200 rounded-3xl p-5 space-y-4 shadow-3xs">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-2.5">
                <div>
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wide flex items-center gap-1.5">
                    <Link2 className="w-4 h-4 text-indigo-500" />
                    <span>Portails & Sites de Recrutement Internationaux</span>
                  </h4>
                  <p className="text-[10px] text-neutral-400 font-bold mt-0.5 font-mono">
                    Visites aujourd'hui : <span className="text-indigo-600 font-extrabold">{todayVisitedCount}</span> / {recruitmentSites.length} visités
                    {siteCountryFilter !== "Tous" || siteSearch ? ` (${filteredSites.length} filtrés)` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {recruitmentSites.some(s => (s.visitedDates && s.visitedDates.length > 0) || s.visited) && (
                    <button
                      onClick={() => setRecruitmentSites(prev => prev.map(s => ({ ...s, visited: false, visitedDates: [] })))}
                      className="text-neutral-400 hover:text-indigo-600 text-[10px] font-bold font-sans transition-colors cursor-pointer"
                    >
                      Tout effacer
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

              {/* CLEAN LIST LAYOUT WITHOUT EXTRA INPUT BOXES */}
              <div className="divide-y divide-neutral-100 max-h-[600px] overflow-y-auto pr-1">
                {filteredSites.length === 0 ? (
                  <div className="py-8 text-center text-xs text-neutral-400 font-medium">
                    Aucun site trouvé correspondant à vos critères.
                  </div>
                ) : (
                  filteredSites.map(site => {
                    const isVisitedOnDate = (dateStr: string) => {
                      if (site.visitedDates?.includes(dateStr)) return true;
                      if (dateStr === todayStr && site.visited) return true;
                      return false;
                    };

                    return (
                      <div 
                        key={site.id} 
                        className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-6 transition-all"
                      >
                        {/* Info details (Left) */}
                        <div className="space-y-2 flex-1 min-w-0">
                          <div className="flex items-start gap-2.5">
                            <div className="space-y-1 flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <a 
                                  href={site.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-xs font-bold text-neutral-900 hover:text-indigo-600 transition-colors flex items-center gap-1 min-w-0 truncate font-sans"
                                  title={`Visiter ${site.name}`}
                                >
                                  <span className="truncate">{site.name}</span>
                                  <ExternalLink className="w-3.5 h-3.5 shrink-0 inline text-neutral-400" />
                                </a>
                                {site.country && (
                                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-sans tracking-wide">
                                    {site.country === "Germany" ? "Allemagne" : site.country === "Netherlands" ? "Pays-Bas" : site.country}
                                  </span>
                                )}
                                {site.identifiant && site.identifiant !== "N/A" && (
                                  <div className="flex items-center gap-1 text-[9.5px] text-neutral-500 font-mono bg-neutral-50 border border-neutral-150 rounded-md px-1.5 py-0.5">
                                    <span className="font-bold text-neutral-400">ID:</span>
                                    <span className="font-extrabold text-neutral-700">{site.identifiant}</span>
                                    <button 
                                      onClick={() => {
                                        navigator.clipboard.writeText(site.identifiant || "");
                                      }}
                                      className="text-[9px] text-indigo-600 hover:text-indigo-800 ml-1 cursor-pointer font-bold font-sans"
                                      title="Copier l'identifiant"
                                    >
                                      Copier
                                    </button>
                                  </div>
                                )}
                              </div>
                              <p className="text-[11px] text-neutral-500 font-medium leading-relaxed max-w-2xl">{site.notes}</p>
                            </div>
                          </div>

                          {/* Keywords as clean inline tags if present */}
                          {site.keywords && site.keywords.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {site.keywords.map((kw, idx) => (
                                <span key={idx} className="text-[9px] bg-indigo-50/60 text-indigo-700 border border-indigo-100/40 px-2 py-0.5 rounded-full font-bold font-mono flex items-center gap-1">
                                  <span>#{kw}</span>
                                  <button 
                                    type="button"
                                    onClick={() => {
                                      setRecruitmentSites(prev => prev.map(s => {
                                        if (s.id !== site.id) return s;
                                        return { ...s, keywords: (s.keywords || []).filter(k => k !== kw) };
                                      }));
                                    }}
                                    className="text-[8px] opacity-60 hover:opacity-100 cursor-pointer font-sans hover:text-red-600"
                                    title="Supprimer"
                                  >
                                    ×
                                  </button>
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Discovered Opportunities note if present */}
                          {site.discoveredOpportunities && (
                            <div className="text-[10px] text-neutral-600 bg-neutral-50 border border-neutral-150 rounded-lg p-2 font-sans italic">
                              <span className="font-bold font-mono text-neutral-400 not-italic uppercase text-[8px] block">Opportunités repérées:</span>
                              {site.discoveredOpportunities}
                            </div>
                          )}
                        </div>

                        {/* Interactive Circle check-ins & actions (Right) */}
                        <div className="flex sm:items-center justify-between lg:justify-end gap-4 shrink-0 border-t lg:border-t-0 border-neutral-100 pt-3 lg:pt-0">
                          <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 font-mono block text-left lg:text-right">
                              Visite quotidienne :
                            </span>
                            <div className="flex items-center gap-1.5">
                              {last7Days.map((day) => {
                                const checked = isVisitedOnDate(day.dateStr);
                                return (
                                  <button
                                    key={day.dateStr}
                                    type="button"
                                    onClick={() => {
                                      setRecruitmentSites(prev => prev.map(s => {
                                        if (s.id !== site.id) return s;
                                        const currentDates = s.visitedDates || [];
                                        const exists = currentDates.includes(day.dateStr);
                                        let newDates: string[];
                                        if (exists) {
                                          newDates = currentDates.filter(d => d !== day.dateStr);
                                        } else {
                                          newDates = [...currentDates, day.dateStr];
                                        }
                                        const isVisitedToday = newDates.includes(todayStr);
                                        return { 
                                          ...s, 
                                          visitedDates: newDates,
                                          visited: isVisitedToday
                                        };
                                      }));
                                    }}
                                    className={`w-9 h-9 rounded-full flex flex-col items-center justify-center transition-all select-none cursor-pointer ${
                                      checked
                                        ? "bg-indigo-600 text-white border border-indigo-600 shadow-xs hover:bg-indigo-500"
                                        : "bg-white text-neutral-500 hover:text-neutral-900 border border-neutral-200 hover:bg-neutral-50"
                                    } ${day.isToday ? "ring-2 ring-indigo-500 ring-offset-1" : ""}`}
                                    title={day.isToday ? "Aujourd'hui" : `${day.label} ${day.num}`}
                                  >
                                    <span className="text-[7px] font-black tracking-wider leading-none uppercase">
                                      {day.label}
                                    </span>
                                    <span className="text-[11px] font-black leading-none mt-0.5 font-mono">
                                      {day.num}
                                    </span>
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          <button 
                            type="button"
                            onClick={() => setRecruitmentSites(prev => prev.filter(s => s.id !== site.id))}
                            className="text-neutral-400 hover:text-red-500 p-2.5 rounded-xl hover:bg-neutral-50 border border-transparent hover:border-neutral-200 shrink-0 cursor-pointer transition-colors mt-auto self-end"
                            title="Supprimer ce site"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })()}

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
