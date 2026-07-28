import React, { useState, useEffect } from "react";
import { 
  CareerSkill, 
  RecruitmentSite, 
  TargetCompany, 
  CareerCertificate,
  MobilityCountryStatus,
  RoadmapPhase,
  VisaDocGroup,
  MobilitySkillGroup,
  MobilityTargetMarket
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
  List,
  Eye,
  EyeOff
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
  activeTab?: "dash" | "mobility" | "skills" | "recruitment" | "companies" | "certificates" | "sites";
  onNavigate?: (moduleId: string) => void;
}

export default function CareerSection({ activeTab, onNavigate }: CareerSectionProps = {}) {
  const [careerTab, setCareerTab] = useState<"dash" | "mobility" | "skills" | "recruitment" | "companies" | "certificates">("dash");

  useEffect(() => {
    if (activeTab) {
      if (activeTab === "sites") {
        setCareerTab("recruitment");
      } else if (["dash", "mobility", "skills", "recruitment", "companies", "certificates"].includes(activeTab)) {
        setCareerTab(activeTab as any);
      }
    }
  }, [activeTab]);

  const handleTabChange = (tab: "dash" | "mobility" | "skills" | "recruitment" | "companies" | "certificates") => {
    setCareerTab(tab);
    if (onNavigate) {
      const mappedId = tab === "recruitment" ? "career_sites" : `career_${tab}`;
      onNavigate(mappedId);
    }
  };

  // --- MOBILITY & TOUR DE CONTRÔLE STATE ---
  const [mobilityHeader, setMobilityHeader] = useState(() => {
    const saved = localStorage.getItem("mp_mobility_header");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: "Serrou Mohammed",
      plan: "Plan EPM Finance",
      tagline: "Tour de contrôle · Mobilité internationale",
      description: "Suivi vivant de votre recherche multi-pays : candidatures, compétences, échéances salariales et dossiers visa au même endroit."
    };
  });

  const [mobilityTargetMarkets, setMobilityTargetMarkets] = useState<MobilityTargetMarket[]>(() => {
    const saved = localStorage.getItem("mp_mobility_target_markets");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return TARGET_MARKETS_REF;
  });

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

  useEffect(() => { localStorage.setItem("mp_mobility_header", JSON.stringify(mobilityHeader)); }, [mobilityHeader]);
  useEffect(() => { localStorage.setItem("mp_mobility_target_markets", JSON.stringify(mobilityTargetMarkets)); }, [mobilityTargetMarkets]);
  useEffect(() => { localStorage.setItem("mp_mobility_countries", JSON.stringify(mobilityCountries)); }, [mobilityCountries]);
  useEffect(() => { localStorage.setItem("mp_mobility_skills", JSON.stringify(mobilitySkills)); }, [mobilitySkills]);
  useEffect(() => { localStorage.setItem("mp_mobility_roadmap", JSON.stringify(mobilityRoadmap)); }, [mobilityRoadmap]);
  useEffect(() => { localStorage.setItem("mp_mobility_visa", JSON.stringify(mobilityVisa)); }, [mobilityVisa]);

  // --- MOBILITY EDIT MODAL & FORM STATES ---
  // Header
  const [showEditHeaderModal, setShowEditHeaderModal] = useState(false);
  const [editHeaderForm, setEditHeaderForm] = useState(mobilityHeader);

  // Destination Country
  const [showAddCountryModal, setShowAddCountryModal] = useState(false);
  const [editingCountryIdx, setEditingCountryIdx] = useState<number | null>(null);
  const [countryForm, setCountryForm] = useState<{ country: string; entryPath: string; status: MobilityCountryStatus["status"] }>({
    country: "",
    entryPath: "",
    status: "En veille"
  });

  // Target Market
  const [showMarketModal, setShowMarketModal] = useState(false);
  const [editingMarketIdx, setEditingMarketIdx] = useState<number | null>(null);
  const [marketForm, setMarketForm] = useState<MobilityTargetMarket>({
    country: "",
    demand: "Très forte",
    entry: "",
    salaryThreshold: "",
    difficulty: 2
  });

  // Skills Checklist
  const [showAddSkillCatModal, setShowAddSkillCatModal] = useState(false);
  const [newSkillCatName, setNewSkillCatName] = useState("");
  const [addingSkillItemCatIdx, setAddingSkillItemCatIdx] = useState<number | null>(null);
  const [newSkillItemLabel, setNewSkillItemLabel] = useState("");

  // Roadmap
  const [showAddRoadmapPhaseModal, setShowAddRoadmapPhaseModal] = useState(false);
  const [newPhaseLabel, setNewPhaseLabel] = useState("");
  const [newPhaseTitle, setNewPhaseTitle] = useState("");
  const [addingRoadmapItemPhaseIdx, setAddingRoadmapItemPhaseIdx] = useState<number | null>(null);
  const [newRoadmapItemLabel, setNewRoadmapItemLabel] = useState("");

  // Visa
  const [showAddVisaGroupModal, setShowAddVisaGroupModal] = useState(false);
  const [newVisaCountryName, setNewVisaCountryName] = useState("");
  const [addingVisaDocGroupIdx, setAddingVisaDocGroupIdx] = useState<number | null>(null);
  const [newVisaDocLabel, setNewVisaDocLabel] = useState("");

  // --- MOBILITY ACTIONS & HANDLERS ---
  const handleSaveHeader = () => {
    setMobilityHeader(editHeaderForm);
    setShowEditHeaderModal(false);
  };

  const handleSaveCountry = () => {
    if (!countryForm.country.trim()) return;
    if (editingCountryIdx !== null) {
      const updated = [...mobilityCountries];
      updated[editingCountryIdx] = { ...countryForm };
      setMobilityCountries(updated);
    } else {
      setMobilityCountries([...mobilityCountries, { ...countryForm }]);
    }
    setShowAddCountryModal(false);
    setEditingCountryIdx(null);
    setCountryForm({ country: "", entryPath: "", status: "En veille" });
  };

  const handleDeleteCountry = (idx: number) => {
    if (window.confirm("Supprimer cette destination ?")) {
      setMobilityCountries(mobilityCountries.filter((_, i) => i !== idx));
    }
  };

  const handleSaveMarket = () => {
    if (!marketForm.country.trim()) return;
    if (editingMarketIdx !== null) {
      const updated = [...mobilityTargetMarkets];
      updated[editingMarketIdx] = { ...marketForm };
      setMobilityTargetMarkets(updated);
    } else {
      setMobilityTargetMarkets([...mobilityTargetMarkets, { ...marketForm }]);
    }
    setShowMarketModal(false);
    setEditingMarketIdx(null);
    setMarketForm({ country: "", demand: "Très forte", entry: "", salaryThreshold: "", difficulty: 2 });
  };

  const handleDeleteMarket = (idx: number) => {
    if (window.confirm("Supprimer ce marché cible ?")) {
      setMobilityTargetMarkets(mobilityTargetMarkets.filter((_, i) => i !== idx));
    }
  };

  const handleAddSkillCategory = () => {
    if (!newSkillCatName.trim()) return;
    setMobilitySkills([...mobilitySkills, { category: newSkillCatName.trim(), items: [] }]);
    setNewSkillCatName("");
    setShowAddSkillCatModal(false);
  };

  const handleAddSkillItem = (catIdx: number) => {
    if (!newSkillItemLabel.trim()) return;
    const updated = [...mobilitySkills];
    updated[catIdx].items.push({
      id: `sk_custom_${Date.now()}`,
      label: newSkillItemLabel.trim(),
      done: false
    });
    setMobilitySkills(updated);
    setNewSkillItemLabel("");
    setAddingSkillItemCatIdx(null);
  };

  const handleDeleteSkillItem = (catIdx: number, itemId: string) => {
    const updated = [...mobilitySkills];
    updated[catIdx].items = updated[catIdx].items.filter(i => i.id !== itemId);
    setMobilitySkills(updated);
  };

  const handleDeleteSkillCat = (catIdx: number) => {
    if (window.confirm("Supprimer cette catégorie et ses compétences ?")) {
      setMobilitySkills(mobilitySkills.filter((_, i) => i !== catIdx));
    }
  };

  const handleAddRoadmapPhase = () => {
    if (!newPhaseLabel.trim() || !newPhaseTitle.trim()) return;
    setMobilityRoadmap([...mobilityRoadmap, { phase: newPhaseLabel.trim(), title: newPhaseTitle.trim(), items: [] }]);
    setNewPhaseLabel("");
    setNewPhaseTitle("");
    setShowAddRoadmapPhaseModal(false);
  };

  const handleAddRoadmapItem = (phaseIdx: number) => {
    if (!newRoadmapItemLabel.trim()) return;
    const updated = [...mobilityRoadmap];
    updated[phaseIdx].items.push({
      id: `rd_custom_${Date.now()}`,
      label: newRoadmapItemLabel.trim(),
      done: false
    });
    setMobilityRoadmap(updated);
    setNewRoadmapItemLabel("");
    setAddingRoadmapItemPhaseIdx(null);
  };

  const handleDeleteRoadmapItem = (phaseIdx: number, itemId: string) => {
    const updated = [...mobilityRoadmap];
    updated[phaseIdx].items = updated[phaseIdx].items.filter(i => i.id !== itemId);
    setMobilityRoadmap(updated);
  };

  const handleDeleteRoadmapPhase = (phaseIdx: number) => {
    if (window.confirm("Supprimer cet horizon de feuille de route ?")) {
      setMobilityRoadmap(mobilityRoadmap.filter((_, i) => i !== phaseIdx));
    }
  };

  const handleAddVisaGroup = () => {
    if (!newVisaCountryName.trim()) return;
    setMobilityVisa([...mobilityVisa, { country: newVisaCountryName.trim(), docs: [] }]);
    setNewVisaCountryName("");
    setShowAddVisaGroupModal(false);
  };

  const handleAddVisaDoc = (groupIdx: number) => {
    if (!newVisaDocLabel.trim()) return;
    const updated = [...mobilityVisa];
    updated[groupIdx].docs.push({
      id: `v_custom_${Date.now()}`,
      label: newVisaDocLabel.trim(),
      done: false
    });
    setMobilityVisa(updated);
    setNewVisaDocLabel("");
    setAddingVisaDocGroupIdx(null);
  };

  const handleDeleteVisaDoc = (groupIdx: number, docId: string) => {
    const updated = [...mobilityVisa];
    updated[groupIdx].docs = updated[groupIdx].docs.filter(d => d.id !== docId);
    setMobilityVisa(updated);
  };

  const handleDeleteVisaGroup = (groupIdx: number) => {
    if (window.confirm("Supprimer ce dossier de visa ?")) {
      setMobilityVisa(mobilityVisa.filter((_, i) => i !== groupIdx));
    }
  };

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

  // --- PERSISTENT DATA FOR CARRIÈRE PROFESSIONNELLE ---
  useEffect(() => { localStorage.setItem("mp_career_skills", JSON.stringify(skills)); }, [skills]);
  useEffect(() => { localStorage.setItem("mp_recruitment_sites", JSON.stringify(recruitmentSites)); }, [recruitmentSites]);
  useEffect(() => { localStorage.setItem("mp_target_companies", JSON.stringify(targetCompanies)); }, [targetCompanies]);
  useEffect(() => { localStorage.setItem("mp_career_certificates", JSON.stringify(certificates)); }, [certificates]);

  // --- MODAL / FORM STATES ---
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showSiteForm, setShowSiteForm] = useState(false);
  const [showCompanyForm, setShowCompanyForm] = useState(false);
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
  const [siteViewMode, setSiteViewMode] = useState<"grid" | "table">("grid");
  const [showVisitedToday, setShowVisitedToday] = useState(false);

  const [compName, setCompName] = useState("");
  const [compWebsite, setCompWebsite] = useState("");
  const [compInterest, setCompInterest] = useState(5);
  const [compNotes, setCompNotes] = useState("");
  const [compContact, setCompContact] = useState("");

  // --- METRIC CALCS ---
  const acquiredSkillsCount = skills.filter(s => s.status === "Acquise").length;
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



  return (
    <div className="space-y-6">
      
      {/* 1. SECTOR METRICS PANEL */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-gradient-to-br from-zinc-900 to-indigo-950 text-white rounded-3xl p-6 border border-zinc-800 shadow-md relative overflow-hidden">
        <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[150%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
        
        {/* Core Stat 1: Target Companies */}
        <div className="col-span-1 border-r border-zinc-800/80 pr-4 flex flex-col justify-center space-y-1">
          <span className="text-[10px] font-black tracking-widest text-emerald-400 block uppercase font-mono">Entreprises Cibles</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black font-mono leading-none">{targetCompanies.length}</span>
            <span className="text-xs text-zinc-400 font-medium">Entreprises</span>
          </div>
          <span className="text-[10px] text-zinc-400 font-medium font-sans">
            Cartographiées et suivies.
          </span>
        </div>

        {/* Core Stat 2: Competency metrics */}
        <div className="col-span-1 border-r border-zinc-800/80 pr-4 pl-2 flex flex-col justify-center space-y-1">
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest font-mono">Compétences</span>
          <span className="text-2xl font-black font-mono text-amber-400 leading-none">{acquiredSkillsCount} Acquises</span>
          <span className="text-[10px] text-zinc-300 font-medium mt-1">
            Sur un total de {skills.length} identifiées.
          </span>
        </div>

        {/* Core Stat 3: Certifications */}
        <div className="col-span-1 border-r border-zinc-800/80 pr-4 pl-2 flex flex-col justify-center space-y-1">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest font-mono">Certificats</span>
          <span className="text-2xl font-black font-mono text-purple-400 leading-none">{obtainedCertificatesCount} <span className="text-xs font-semibold text-zinc-400">/ {certificates.length}</span></span>
          <span className="text-[10px] text-zinc-300 font-medium mt-1">
            Diplômes & accréditations obtenus.
          </span>
        </div>

        {/* Core Stat 4: Recruitment Portals */}
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
              <div className="flex items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-[11px] font-black uppercase tracking-wider font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {mobilityHeader.tagline}
                </div>
                <button
                  onClick={() => {
                    setEditHeaderForm(mobilityHeader);
                    setShowEditHeaderModal(true);
                  }}
                  className="p-1 text-zinc-400 hover:text-emerald-400 transition-colors cursor-pointer"
                  title="Éditer l'en-tête de mobilité"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
                {mobilityHeader.name} <span className="text-zinc-400 font-normal">· {mobilityHeader.plan}</span>
              </h2>
              <p className="text-xs md:text-sm text-zinc-300 font-medium leading-relaxed">
                {mobilityHeader.description}
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
                  <button
                    onClick={() => {
                      setEditingCountryIdx(null);
                      setCountryForm({ country: "", entryPath: "", status: "En veille" });
                      setShowAddCountryModal(true);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-sans font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nouvelle Destination</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="text-zinc-500 border-b border-zinc-800 uppercase text-[10px] tracking-widest font-sans">
                        <th className="py-2.5 px-3">Pays / Région</th>
                        <th className="py-2.5 px-3">Voie d'entrée privilégiée</th>
                        <th className="py-2.5 px-3 text-center">Statut Actuel</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
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
                            <td className="py-3 px-3 text-center">
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
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => {
                                    setEditingCountryIdx(idx);
                                    setCountryForm({ ...c });
                                    setShowAddCountryModal(true);
                                  }}
                                  className="p-1.5 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                                  title="Modifier"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCountry(idx)}
                                  className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors cursor-pointer"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
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
                <button
                  onClick={() => {
                    setEditingMarketIdx(null);
                    setMarketForm({ country: "", demand: "Très forte", entry: "", salaryThreshold: "", difficulty: 2 });
                    setShowMarketModal(true);
                  }}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter un marché</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-50 text-neutral-500 font-black uppercase text-[10px] tracking-wider border-b border-neutral-200">
                      <th className="py-3 px-3">Marché / Zone</th>
                      <th className="py-3 px-3">Demande EPM / FP&A</th>
                      <th className="py-3 px-3">Voie d'entrée</th>
                      <th className="py-3 px-3">Seuil Salaire Visa 2026</th>
                      <th className="py-3 px-3 text-center">Difficulté Visa</th>
                      <th className="py-3 px-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-medium">
                    {mobilityTargetMarkets.map((m, idx) => (
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
                        <td className="py-3 px-3 text-center font-mono text-amber-600 font-bold">
                          {"●".repeat(m.difficulty)}{"○".repeat(5 - m.difficulty)}
                        </td>
                        <td className="py-3 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => {
                                setEditingMarketIdx(idx);
                                setMarketForm({ ...m });
                                setShowMarketModal(true);
                              }}
                              className="p-1.5 text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
                              title="Modifier"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteMarket(idx)}
                              className="p-1.5 text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
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
                <button
                  onClick={() => {
                    setNewSkillCatName("");
                    setShowAddSkillCatModal(true);
                  }}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nouvelle catégorie</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {mobilitySkills.map((grp, gIdx) => {
                  const grpDone = grp.items.filter(i => i.done).length;
                  return (
                    <div key={gIdx} className="p-4 bg-neutral-50/80 border border-neutral-200/80 rounded-2xl space-y-3 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center border-b border-neutral-200/60 pb-2">
                          <h4 className="text-xs font-black text-neutral-900 uppercase tracking-tight">{grp.category}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                              {grpDone}/{grp.items.length}
                            </span>
                            <button
                              onClick={() => handleDeleteSkillCat(gIdx)}
                              className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Supprimer la catégorie"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {grp.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between group/item">
                              <label className="flex items-start gap-2.5 cursor-pointer text-xs flex-1 pr-2">
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
                                  item.done ? "line-through text-neutral-400" : "text-neutral-800 font-medium group-hover/item:text-neutral-950"
                                }`}>
                                  {item.label}
                                </span>
                              </label>
                              <button
                                onClick={() => handleDeleteSkillItem(gIdx, item.id)}
                                className="opacity-0 group-hover/item:opacity-100 text-neutral-400 hover:text-red-500 transition-all cursor-pointer p-0.5"
                                title="Supprimer la compétence"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Add Item Trigger */}
                      <div className="pt-2 border-t border-neutral-200/60">
                        {addingSkillItemCatIdx === gIdx ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={newSkillItemLabel}
                              onChange={(e) => setNewSkillItemLabel(e.target.value)}
                              placeholder="Action / compétence..."
                              className="flex-1 text-xs px-2.5 py-1 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-purple-500"
                              onKeyDown={(e) => e.key === "Enter" && handleAddSkillItem(gIdx)}
                              autoFocus
                            />
                            <button
                              onClick={() => handleAddSkillItem(gIdx)}
                              className="p-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setAddingSkillItemCatIdx(null)}
                              className="p-1 bg-neutral-200 text-neutral-600 rounded-lg hover:bg-neutral-300 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setAddingSkillItemCatIdx(gIdx);
                              setNewSkillItemLabel("");
                            }}
                            className="w-full py-1 text-[11px] font-bold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100/80 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Ajouter une action</span>
                          </button>
                        )}
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
                <button
                  onClick={() => {
                    setNewPhaseLabel("");
                    setNewPhaseTitle("");
                    setShowAddRoadmapPhaseModal(true);
                  }}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nouvel horizon</span>
                </button>
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
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] font-mono text-neutral-500">{pDone}/{phase.items.length}</span>
                            <button
                              onClick={() => handleDeleteRoadmapPhase(pIdx)}
                              className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer p-0.5"
                              title="Supprimer l'horizon"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <h4 className="text-xs font-black text-neutral-900 leading-snug">{phase.title}</h4>
                        <div className="space-y-2 pt-1 border-t border-neutral-200/60">
                          {phase.items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between group/item">
                              <label className="flex items-start gap-2 cursor-pointer text-[11px] flex-1 pr-1">
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
                                  item.done ? "line-through text-neutral-400" : "text-neutral-700 group-hover/item:text-neutral-950 font-medium"
                                }`}>
                                  {item.label}
                                </span>
                              </label>
                              <button
                                onClick={() => handleDeleteRoadmapItem(pIdx, item.id)}
                                className="opacity-0 group-hover/item:opacity-100 text-neutral-400 hover:text-red-500 transition-all cursor-pointer p-0.5"
                                title="Supprimer le jalon"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Add Item Trigger */}
                      <div className="pt-2 border-t border-neutral-200/60">
                        {addingRoadmapItemPhaseIdx === pIdx ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={newRoadmapItemLabel}
                              onChange={(e) => setNewRoadmapItemLabel(e.target.value)}
                              placeholder="Intitulé du jalon..."
                              className="flex-1 text-xs px-2.5 py-1 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500"
                              onKeyDown={(e) => e.key === "Enter" && handleAddRoadmapItem(pIdx)}
                              autoFocus
                            />
                            <button
                              onClick={() => handleAddRoadmapItem(pIdx)}
                              className="p-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setAddingRoadmapItemPhaseIdx(null)}
                              className="p-1 bg-neutral-200 text-neutral-600 rounded-lg hover:bg-neutral-300 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setAddingRoadmapItemPhaseIdx(pIdx);
                              setNewRoadmapItemLabel("");
                            }}
                            className="w-full py-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100/80 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Ajouter un jalon</span>
                          </button>
                        )}
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
                <button
                  onClick={() => {
                    setNewVisaCountryName("");
                    setShowAddVisaGroupModal(true);
                  }}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Nouveau dossier visa</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {mobilityVisa.map((vGroup, vIdx) => {
                  const vDone = vGroup.docs.filter(d => d.done).length;
                  return (
                    <div key={vIdx} className="p-4 bg-neutral-50/70 border border-neutral-200/80 rounded-2xl space-y-3 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-neutral-200/60 pb-2">
                          <h4 className="text-xs font-black text-neutral-900">{vGroup.country}</h4>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-mono font-bold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              {vDone}/{vGroup.docs.length}
                            </span>
                            <button
                              onClick={() => handleDeleteVisaGroup(vIdx)}
                              className="text-neutral-400 hover:text-red-600 transition-colors cursor-pointer p-0.5"
                              title="Supprimer le dossier"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          {vGroup.docs.map((docItem) => (
                            <div key={docItem.id} className="flex items-center justify-between group/item">
                              <label className="flex items-start gap-2 cursor-pointer text-[11px] flex-1 pr-1">
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
                                  docItem.done ? "line-through text-neutral-400" : "text-neutral-700 group-hover/item:text-neutral-950 font-medium"
                                }`}>
                                  {docItem.label}
                                </span>
                              </label>
                              <button
                                onClick={() => handleDeleteVisaDoc(vIdx, docItem.id)}
                                className="opacity-0 group-hover/item:opacity-100 text-neutral-400 hover:text-red-500 transition-all cursor-pointer p-0.5"
                                title="Supprimer le document"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Add Visa Doc Trigger */}
                      <div className="pt-2 border-t border-neutral-200/60">
                        {addingVisaDocGroupIdx === vIdx ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="text"
                              value={newVisaDocLabel}
                              onChange={(e) => setNewVisaDocLabel(e.target.value)}
                              placeholder="Libellé pièce..."
                              className="flex-1 text-xs px-2.5 py-1 bg-white border border-neutral-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                              onKeyDown={(e) => e.key === "Enter" && handleAddVisaDoc(vIdx)}
                              autoFocus
                            />
                            <button
                              onClick={() => handleAddVisaDoc(vIdx)}
                              className="p-1 bg-amber-600 text-white rounded-lg hover:bg-amber-700 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setAddingVisaDocGroupIdx(null)}
                              className="p-1 bg-neutral-200 text-neutral-600 rounded-lg hover:bg-neutral-300 cursor-pointer"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setAddingVisaDocGroupIdx(vIdx);
                              setNewVisaDocLabel("");
                            }}
                            className="w-full py-1 text-[11px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100/80 rounded-lg transition-colors flex items-center justify-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Ajouter une pièce</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ==================================================== */}
          {/* --- MODALS FOR MOBILITY & EPM EDITING --- */}
          {/* ==================================================== */}

          {/* 1. Header Edit Modal */}
          {showEditHeaderModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="text-base font-black text-neutral-900">Éditer l'En-tête Mobilité & EPM</h3>
                  <button onClick={() => setShowEditHeaderModal(false)} className="text-neutral-400 hover:text-neutral-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Surtitre / Tagline</label>
                    <input
                      type="text"
                      value={editHeaderForm.tagline}
                      onChange={(e) => setEditHeaderForm({ ...editHeaderForm, tagline: e.target.value })}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Nom / Profil</label>
                    <input
                      type="text"
                      value={editHeaderForm.name}
                      onChange={(e) => setEditHeaderForm({ ...editHeaderForm, name: e.target.value })}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Intitulé du Plan</label>
                    <input
                      type="text"
                      value={editHeaderForm.plan}
                      onChange={(e) => setEditHeaderForm({ ...editHeaderForm, plan: e.target.value })}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Description / Objectifs</label>
                    <textarea
                      rows={3}
                      value={editHeaderForm.description}
                      onChange={(e) => setEditHeaderForm({ ...editHeaderForm, description: e.target.value })}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => setShowEditHeaderModal(false)}
                    className="px-4 py-2 bg-neutral-100 text-neutral-700 text-xs font-bold rounded-xl hover:bg-neutral-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveHeader}
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700"
                  >
                    Enregistrer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. Destination Country Modal */}
          {showAddCountryModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="text-base font-black text-neutral-900">
                    {editingCountryIdx !== null ? "Modifier la Destination" : "Nouvelle Destination Mobilité"}
                  </h3>
                  <button onClick={() => setShowAddCountryModal(false)} className="text-neutral-400 hover:text-neutral-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Pays / Région *</label>
                    <input
                      type="text"
                      placeholder="Ex: Suisse, Japon..."
                      value={countryForm.country}
                      onChange={(e) => setCountryForm({ ...countryForm, country: e.target.value })}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Voie d'entrée privilégiée</label>
                    <input
                      type="text"
                      placeholder="Ex: Permis travail sponsorisé, Visa nomade..."
                      value={countryForm.entryPath}
                      onChange={(e) => setCountryForm({ ...countryForm, entryPath: e.target.value })}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Statut Actuel</label>
                    <select
                      value={countryForm.status}
                      onChange={(e) => setCountryForm({ ...countryForm, status: e.target.value as any })}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="En veille">En veille</option>
                      <option value="Candidatures envoyées">Candidatures envoyées</option>
                      <option value="En entretien">En entretien</option>
                      <option value="Offre reçue">Offre reçue</option>
                      <option value="Mis en pause">Mis en pause</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => setShowAddCountryModal(false)}
                    className="px-4 py-2 bg-neutral-100 text-neutral-700 text-xs font-bold rounded-xl hover:bg-neutral-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveCountry}
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700"
                  >
                    {editingCountryIdx !== null ? "Enregistrer" : "Ajouter"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 3. Target Market Modal */}
          {showMarketModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="text-base font-black text-neutral-900">
                    {editingMarketIdx !== null ? "Modifier le Marché Cible" : "Ajouter un Marché Cible"}
                  </h3>
                  <button onClick={() => setShowMarketModal(false)} className="text-neutral-400 hover:text-neutral-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Marché / Zone *</label>
                    <input
                      type="text"
                      placeholder="Ex: Australie, UAE..."
                      value={marketForm.country}
                      onChange={(e) => setMarketForm({ ...marketForm, country: e.target.value })}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Demande EPM / FP&A</label>
                    <input
                      type="text"
                      placeholder="Ex: Très forte, Forte..."
                      value={marketForm.demand}
                      onChange={(e) => setMarketForm({ ...marketForm, demand: e.target.value })}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Voie d'entrée</label>
                    <input
                      type="text"
                      placeholder="Ex: Visa points, Sponsor direct..."
                      value={marketForm.entry}
                      onChange={(e) => setMarketForm({ ...marketForm, entry: e.target.value })}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Seuil Salaire Visa 2026</label>
                    <input
                      type="text"
                      placeholder="Ex: 50 000 €/an..."
                      value={marketForm.salaryThreshold}
                      onChange={(e) => setMarketForm({ ...marketForm, salaryThreshold: e.target.value })}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Difficulté Visa (1 à 5)</label>
                    <input
                      type="number"
                      min={1}
                      max={5}
                      value={marketForm.difficulty}
                      onChange={(e) => setMarketForm({ ...marketForm, difficulty: parseInt(e.target.value) || 1 })}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => setShowMarketModal(false)}
                    className="px-4 py-2 bg-neutral-100 text-neutral-700 text-xs font-bold rounded-xl hover:bg-neutral-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveMarket}
                    className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700"
                  >
                    {editingMarketIdx !== null ? "Enregistrer" : "Ajouter"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 4. Add Skill Category Modal */}
          {showAddSkillCatModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="text-base font-black text-neutral-900">Nouvelle Catégorie de Compétence</h3>
                  <button onClick={() => setShowAddSkillCatModal(false)} className="text-neutral-400 hover:text-neutral-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Intitulé de la Catégorie *</label>
                  <input
                    type="text"
                    placeholder="Ex: Certification BI, IA & Machine Learning..."
                    value={newSkillCatName}
                    onChange={(e) => setNewSkillCatName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyDown={(e) => e.key === "Enter" && handleAddSkillCategory()}
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => setShowAddSkillCatModal(false)}
                    className="px-4 py-2 bg-neutral-100 text-neutral-700 text-xs font-bold rounded-xl hover:bg-neutral-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddSkillCategory}
                    className="px-4 py-2 bg-purple-600 text-white text-xs font-bold rounded-xl hover:bg-purple-700"
                  >
                    Créer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. Add Roadmap Phase Modal */}
          {showAddRoadmapPhaseModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="text-base font-black text-neutral-900">Nouvel Horizon Roadmap</h3>
                  <button onClick={() => setShowAddRoadmapPhaseModal(false)} className="text-neutral-400 hover:text-neutral-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Période / Horizon *</label>
                    <input
                      type="text"
                      placeholder="Ex: 5–10 ans..."
                      value={newPhaseLabel}
                      onChange={(e) => setNewPhaseLabel(e.target.value)}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-neutral-700 block mb-1">Titre de l'étape *</label>
                    <input
                      type="text"
                      placeholder="Ex: CFO / VP Finance..."
                      value={newPhaseTitle}
                      onChange={(e) => setNewPhaseTitle(e.target.value)}
                      className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => setShowAddRoadmapPhaseModal(false)}
                    className="px-4 py-2 bg-neutral-100 text-neutral-700 text-xs font-bold rounded-xl hover:bg-neutral-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddRoadmapPhase}
                    className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700"
                  >
                    Créer
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 6. Add Visa Country Group Modal */}
          {showAddVisaGroupModal && (
            <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <h3 className="text-base font-black text-neutral-900">Nouveau Dossier Visa Pays</h3>
                  <button onClick={() => setShowAddVisaGroupModal(false)} className="text-neutral-400 hover:text-neutral-700">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Nom du Pays / Zone *</label>
                  <input
                    type="text"
                    placeholder="Ex: Royaume-Uni, USA, Japon..."
                    value={newVisaCountryName}
                    onChange={(e) => setNewVisaCountryName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                    onKeyDown={(e) => e.key === "Enter" && handleAddVisaGroup()}
                    autoFocus
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => setShowAddVisaGroupModal(false)}
                    className="px-4 py-2 bg-neutral-100 text-neutral-700 text-xs font-bold rounded-xl hover:bg-neutral-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleAddVisaGroup}
                    className="px-4 py-2 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-700"
                  >
                    Créer
                  </button>
                </div>
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
            
            {/* Left Card: Recruitment Portals Quick Access */}
            <div className="bg-white border border-neutral-200/80 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 bg-neutral-950 text-white rounded-lg">
                      <Globe className="w-4 h-4 text-indigo-400" />
                    </span>
                    <h3 className="text-sm font-black text-neutral-950 uppercase tracking-tight">
                      Portails de Recrutement
                    </h3>
                  </div>
                  <button
                    onClick={() => handleTabChange("recruitment")}
                    className="text-[10px] font-black text-indigo-600 uppercase tracking-wider hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    Gérer <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {recruitmentSites.slice(0, 4).map((site) => (
                    <a
                      key={site.id}
                      href={site.url}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="flex items-center justify-between p-2.5 bg-neutral-50 border border-neutral-200/50 hover:bg-neutral-100 rounded-xl transition-all group cursor-pointer"
                    >
                      <div className="space-y-0.5">
                        <span className="text-[11.5px] font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors block">{site.name}</span>
                        <span className="text-[9px] text-neutral-400 font-bold font-mono uppercase">{site.country}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-indigo-600 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-2xl flex items-center justify-between mt-2">
                <span className="text-[10px] text-indigo-900 font-bold font-mono">
                  {recruitmentSites.length} plateformes enregistrées
                </span>
                <button
                  onClick={() => handleTabChange("recruitment")}
                  className="text-[10px] font-black text-indigo-700 uppercase tracking-wider hover:underline cursor-pointer"
                >
                  Voir tout
                </button>
              </div>
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

        const isVisitedOnDate = (site: RecruitmentSite, dateStr: string) => {
          if (site.visitedDates?.includes(dateStr)) return true;
          if (site.lastVisitedDate === dateStr) return true;
          return false;
        };

        const filteredSites = recruitmentSites.filter(site => {
          const matchesSearch = site.name.toLowerCase().includes(siteSearch.toLowerCase()) || 
                                (site.notes || "").toLowerCase().includes(siteSearch.toLowerCase()) ||
                                (site.keywords || []).some(kw => kw.toLowerCase().includes(siteSearch.toLowerCase()));
          const matchesCountry = siteCountryFilter === "Tous" || site.country === siteCountryFilter;
          const visitedToday = isVisitedOnDate(site, todayStr);
          const matchesVisited = showVisitedToday || !visitedToday;

          return matchesSearch && matchesCountry && matchesVisited;
        });

        const todayVisitedCount = recruitmentSites.filter(s => isVisitedOnDate(s, todayStr)).length;
        const totalSites = recruitmentSites.length;
        const visitRate = totalSites > 0 ? Math.round((todayVisitedCount / totalSites) * 100) : 0;
        const uniqueCountries = Array.from(new Set(recruitmentSites.map(s => s.country).filter(Boolean)));

        const toggleVisitDate = (siteId: string, dateStr: string) => {
          setRecruitmentSites(prev => prev.map(s => {
            if (s.id !== siteId) return s;
            const currentDates = s.visitedDates || [];
            const exists = currentDates.includes(dateStr);
            let newDates: string[];
            if (exists) {
              newDates = currentDates.filter(d => d !== dateStr);
            } else {
              newDates = [...currentDates, dateStr];
            }
            const isVisitedToday = newDates.includes(todayStr);
            return { 
              ...s, 
              visitedDates: newDates,
              visited: isVisitedToday,
              lastVisitedDate: isVisitedToday ? todayStr : (s.lastVisitedDate === dateStr ? undefined : s.lastVisitedDate)
            };
          }));
        };

        // Active / priority sites unvisited today for Hero banner
        const activeTodayList = recruitmentSites.filter(s => !isVisitedOnDate(s, todayStr));

        return (
          <div className="space-y-6 animate-in fade-in duration-300">
            
            {/* 1. HERO - ACTIVE PORTALS BANNER (MEDIAHUB / BOOKS & MOVIES STYLE) */}
            <div className="bg-neutral-900 text-white rounded-3xl p-6 shadow-md border border-neutral-800 relative overflow-hidden">
              <div className="absolute top-[-30%] right-[-10%] w-[45%] h-[160%] rounded-full bg-indigo-900 blur-3xl pointer-events-none opacity-40" />
              
              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black tracking-widest text-neutral-300 uppercase font-mono">Routine Recrutement Quotidienne</span>
                  </div>
                  <span className="text-xs text-neutral-400 font-mono">
                    {todayVisitedCount} / {totalSites} sites visités aujourd'hui ({visitRate}%)
                  </span>
                </div>

                {activeTodayList.length === 0 ? (
                  <div className="py-6 text-center text-neutral-300 max-w-md mx-auto space-y-2">
                    <CheckCircle className="w-10 h-10 mx-auto text-emerald-400" />
                    <p className="text-xs font-bold text-white">
                      Félicitations ! Vous avez consulté l'ensemble de vos portails cibles aujourd'hui.
                    </p>
                    <p className="text-[10px] text-neutral-400">
                      Votre discipline de recherche est à 100%. Revenez demain pour maintenir votre série !
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-300">Portails à consulter en priorité aujourd'hui :</span>
                      <span className="text-[10px] text-indigo-400 font-mono font-bold">{activeTodayList.length} en attente</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {activeTodayList.slice(0, 4).map(site => {
                        // Calculate 7-day visit count
                        const visited7Count = last7Days.filter(d => isVisitedOnDate(site, d.dateStr)).length;
                        const pct7 = Math.round((visited7Count / 7) * 100);

                        return (
                          <div key={site.id} className="bg-neutral-800/60 border border-neutral-700/60 rounded-2xl p-4 space-y-3 transition-all hover:bg-neutral-800/90">
                            <div className="flex justify-between items-start gap-3">
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="text-[9px] bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 px-2 py-0.5 rounded-md font-bold font-mono uppercase">
                                    {site.country === "Germany" ? "Allemagne" : site.country || "International"}
                                  </span>
                                  {site.identifiant && site.identifiant !== "N/A" && (
                                    <span className="text-[9px] bg-neutral-700 text-neutral-300 px-1.5 py-0.5 rounded font-mono">
                                      ID: {site.identifiant}
                                    </span>
                                  )}
                                </div>
                                <h4 className="text-xs md:text-sm font-black text-white leading-snug truncate" title={site.name}>
                                  {site.name}
                                </h4>
                              </div>

                              <div className="flex items-center gap-2 shrink-0">
                                <a
                                  href={site.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 bg-neutral-700 hover:bg-indigo-600 text-neutral-200 hover:text-white rounded-lg transition-colors"
                                  title={`Ouvrir ${site.name}`}
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => toggleVisitDate(site.id, todayStr)}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all flex items-center gap-1 shadow-3xs cursor-pointer"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>Valider Visite</span>
                                </button>
                              </div>
                            </div>

                            {/* Streak progress bar */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between items-center text-[10px] font-mono text-neutral-400">
                                <span>Régularité 7J : {visited7Count}/7 jours ({pct7}%)</span>
                                <span>Aujourd'hui : Non visité</span>
                              </div>
                              <div className="w-full bg-neutral-700 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-indigo-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${pct7}%` }} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 2. TOP METRICS HEADER CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block font-mono">Portails Référencés</span>
                  <p className="text-base font-extrabold font-mono text-neutral-950 block">{totalSites} sites</p>
                </div>
                <div className="p-2.5 bg-neutral-50 rounded-xl text-neutral-950 border border-neutral-100 shrink-0">
                  <Globe className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block font-mono">Visités Aujourd'hui</span>
                  <p className="text-base font-extrabold font-mono text-indigo-600 block">{todayVisitedCount} / {totalSites}</p>
                </div>
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100 shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block font-mono">Discipline Quotidienne</span>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-extrabold font-mono text-emerald-600 block">{visitRate}%</p>
                  </div>
                </div>
                <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
              </div>

              <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block font-mono">Pays Ciblés</span>
                  <p className="text-base font-extrabold font-mono text-neutral-950 block">{uniqueCountries.length} zones</p>
                </div>
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl border border-amber-100 shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* 3. CONTROLS BAR (BOOKS & MOVIES STYLE) */}
            <div className="bg-white border border-neutral-200/80 rounded-3xl p-5 shadow-xs space-y-4">
              <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-600" />
                  <h3 className="text-xs font-black text-neutral-950 uppercase tracking-tight font-mono">
                    Portails & Plateformes de Recrutement Cibles
                  </h3>
                </div>

                <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto justify-between xl:justify-end">
                  {/* View Mode Toggle (Tableau vs Cartes) */}
                  <div className="flex items-center gap-1 bg-neutral-100/80 p-1 rounded-2xl border border-neutral-200/50">
                    <button
                      type="button"
                      onClick={() => setSiteViewMode("grid")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        siteViewMode === "grid"
                          ? "bg-neutral-950 text-white shadow-xs"
                          : "text-neutral-600 hover:text-neutral-950 hover:bg-white/60"
                      }`}
                      title="Vue Cartes (Grille)"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Cartes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSiteViewMode("table")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        siteViewMode === "table"
                          ? "bg-neutral-950 text-white shadow-xs"
                          : "text-neutral-600 hover:text-neutral-950 hover:bg-white/60"
                      }`}
                      title="Vue Tableau synthétique"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>Tableau</span>
                    </button>
                  </div>

                  {/* Search Input */}
                  <div className="relative w-full sm:w-60">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Rechercher portail, mot-clé..."
                      value={siteSearch}
                      onChange={(e) => setSiteSearch(e.target.value)}
                      className="w-full bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200 rounded-xl pl-9 pr-8 py-2 text-xs font-bold text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
                    />
                    {siteSearch && (
                      <button 
                        onClick={() => setSiteSearch("")} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-900"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Add New Portal */}
                  <button
                    onClick={() => setShowSiteForm(true)}
                    className="flex items-center gap-1.5 bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-black transition-all shadow-xs cursor-pointer shrink-0 active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nouveau portail</span>
                  </button>
                </div>
              </div>

              {/* Country Filter Pills & Visited Toggle */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 w-full pt-1">
                <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-none flex-1">
                  {["Tous", "Maroc", "France", "Canada", "Suisse", "Germany", "Worldwide"].map(countryKey => {
                    const label = countryKey === "Worldwide" ? "International" : countryKey === "Germany" ? "Allemagne" : countryKey;
                    const matchingSites = countryKey === "Tous" 
                      ? recruitmentSites 
                      : recruitmentSites.filter(s => s.country === countryKey);
                    const totalCount = matchingSites.length;
                    const unvisitedCount = matchingSites.filter(s => !isVisitedOnDate(s, todayStr)).length;
                    const isActive = siteCountryFilter === countryKey;

                    return (
                      <button
                        key={countryKey}
                        onClick={() => setSiteCountryFilter(countryKey)}
                        className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                          isActive
                            ? "bg-neutral-950 text-white font-black shadow-xs"
                            : "bg-neutral-100/80 hover:bg-neutral-200/80 text-neutral-600 border border-neutral-200/60"
                        }`}
                      >
                        <span>{label}</span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded-full ${
                          isActive ? "bg-neutral-700 text-white" : "bg-neutral-200 text-neutral-700"
                        }`}>
                          {showVisitedToday ? totalCount : unvisitedCount}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setShowVisitedToday(prev => !prev)}
                  className={`text-[11px] font-bold px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer ${
                    showVisitedToday
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-300 font-extrabold shadow-3xs"
                      : "bg-neutral-100/80 hover:bg-neutral-200/80 text-neutral-600 border border-neutral-200/60"
                  }`}
                  title={showVisitedToday ? "Masquer les sites déjà visités aujourd'hui" : "Afficher les sites déjà visités aujourd'hui"}
                >
                  {showVisitedToday ? (
                    <>
                      <EyeOff className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Masquer visités ({todayVisitedCount})</span>
                    </>
                  ) : (
                    <>
                      <Eye className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Afficher visités ({todayVisitedCount})</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 4. MEDIAHUB FORMATTED CONTENT DISPLAY (TABLE OR GRID) */}
            {filteredSites.length === 0 ? (
              todayVisitedCount > 0 && !showVisitedToday ? (
                <div className="text-center py-12 px-6 bg-gradient-to-br from-emerald-50/80 to-teal-50/30 rounded-3xl border border-emerald-200/80 space-y-3 font-sans shadow-3xs">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-2xs">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-extrabold text-emerald-950">
                      Tous les portails sélectionnés ({todayVisitedCount}) ont été visités aujourd'hui !
                    </h4>
                    <p className="text-xs text-emerald-700 font-medium max-w-md mx-auto">
                      Ils ont été masqués de la liste et réapparaîtront automatiquement <strong>demain</strong> pour votre routine quotidienne.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowVisitedToday(true)}
                    className="inline-flex items-center gap-1.5 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-3xs cursor-pointer mt-2"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Afficher les sites visités aujourd'hui ({todayVisitedCount})</span>
                  </button>
                </div>
              ) : (
                <div className="text-center py-16 text-neutral-400 italic bg-neutral-50/50 rounded-3xl border border-dashed border-neutral-200 font-medium text-xs">
                  Aucun portail de recrutement ne correspond à vos critères.
                </div>
              )
            ) : siteViewMode === "table" ? (
              /* TABLE VIEW (MEDIAMUB / BOOKS & MOVIES STYLE) */
              <div className="overflow-x-auto rounded-2xl border border-neutral-200/80 shadow-3xs bg-white">
                <table className="w-full text-left border-collapse font-sans text-xs min-w-[950px]">
                  <thead>
                    <tr className="bg-neutral-50/80 border-b border-neutral-200/80 text-neutral-500 font-extrabold uppercase tracking-wider text-[10px] font-mono">
                      <th className="py-3 px-4">Portail / Plateforme</th>
                      <th className="py-3 px-4 w-32">Zone / Pays</th>
                      <th className="py-3 px-4">Identifiant & Mots-clés</th>
                      <th className="py-3 px-4 w-48">Discipline & Série 7J</th>
                      <th className="py-3 px-4 w-36 text-center">Statut Visite</th>
                      <th className="py-3 px-4 text-right w-24">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredSites.map((site) => {
                      const visitedToday = isVisitedOnDate(site, todayStr);
                      const visited7Count = last7Days.filter(d => isVisitedOnDate(site, d.dateStr)).length;
                      const pct7 = Math.round((visited7Count / 7) * 100);

                      const getCountryBadgeStyle = (country?: string) => {
                        switch (country) {
                          case "France": return "bg-indigo-50 text-indigo-700 border-indigo-200/80";
                          case "Maroc": return "bg-emerald-50 text-emerald-700 border-emerald-200/80";
                          case "Canada": return "bg-rose-50 text-rose-700 border-rose-200/80";
                          case "Suisse": return "bg-purple-50 text-purple-700 border-purple-200/80";
                          case "Germany": return "bg-amber-50 text-amber-700 border-amber-200/80";
                          default: return "bg-neutral-100 text-neutral-700 border-neutral-200";
                        }
                      };

                      return (
                        <tr key={site.id} className="hover:bg-neutral-50/70 transition-colors group">
                          {/* Title & Icon Avatar */}
                          <td className="py-3.5 px-4 font-black text-neutral-900 max-w-[280px]">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                                visitedToday ? "bg-emerald-100 text-emerald-700" : "bg-indigo-100 text-indigo-700"
                              }`}>
                                <Globe className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <a
                                  href={site.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-extrabold text-xs text-neutral-900 hover:text-indigo-600 transition-colors flex items-center gap-1 truncate"
                                  title={site.name}
                                >
                                  <span className="truncate">{site.name}</span>
                                  <ExternalLink className="w-3 h-3 text-neutral-400 shrink-0" />
                                </a>
                                {site.notes && (
                                  <p className="text-[10.5px] text-neutral-500 font-normal truncate max-w-[220px]" title={site.notes}>
                                    {site.notes}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Country Badge */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg border uppercase tracking-wider font-mono ${getCountryBadgeStyle(site.country)}`}>
                              {site.country === "Germany" ? "Allemagne" : site.country || "International"}
                            </span>
                          </td>

                          {/* ID & Keywords */}
                          <td className="py-3.5 px-4 space-y-1">
                            {site.identifiant && site.identifiant !== "N/A" && (
                              <span className="inline-block text-[10px] font-mono font-bold text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-md">
                                ID: {site.identifiant}
                              </span>
                            )}
                            {site.keywords && site.keywords.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {site.keywords.slice(0, 3).map((kw, idx) => (
                                  <span key={idx} className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-1.5 py-0.2 rounded font-mono font-bold">
                                    #{kw}
                                  </span>
                                ))}
                              </div>
                            )}
                          </td>

                          {/* 7-Day Streak & Meter */}
                          <td className="py-3.5 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-mono font-bold">
                                <span className="text-neutral-900">{pct7}% régulier</span>
                                <span className="text-neutral-400">{visited7Count}/7 j</span>
                              </div>
                              <div className="w-full bg-neutral-150 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    pct7 >= 80 ? "bg-emerald-500" : pct7 >= 40 ? "bg-indigo-600" : "bg-amber-500"
                                  }`} 
                                  style={{ width: `${pct7}%` }} 
                                />
                              </div>
                              <div className="flex items-center gap-0.5 pt-0.5">
                                {last7Days.map(day => {
                                  const checked = isVisitedOnDate(site, day.dateStr);
                                  return (
                                    <button
                                      key={day.dateStr}
                                      type="button"
                                      onClick={() => toggleVisitDate(site.id, day.dateStr)}
                                      className={`w-4 h-4 rounded text-[8px] font-black font-mono transition-all cursor-pointer flex items-center justify-center ${
                                        checked
                                          ? "bg-indigo-600 text-white font-extrabold"
                                          : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200"
                                      } ${day.isToday ? "ring-1 ring-indigo-500" : ""}`}
                                      title={`${day.label} ${day.num}`}
                                    >
                                      {day.num}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          </td>

                          {/* Visit Today Button Badge */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => toggleVisitDate(site.id, todayStr)}
                              className={`w-full py-1.5 px-3 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-3xs ${
                                visitedToday
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-black"
                                  : "bg-neutral-100 hover:bg-indigo-50 text-neutral-700 hover:text-indigo-700 border border-neutral-200 font-bold"
                              }`}
                            >
                              {visitedToday ? (
                                <>
                                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Visité</span>
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
                                  <span>Marquer visité</span>
                                </>
                              )}
                            </button>
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right space-x-1">
                            <a
                              href={site.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-neutral-400 hover:text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors inline-block"
                              title="Ouvrir le site"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => setRecruitmentSites(prev => prev.filter(s => s.id !== site.id))}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors inline-block cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* GRID CARDS VIEW (MEDIAHUB / BOOKS & MOVIES STYLE) */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredSites.map(site => {
                  const visitedToday = isVisitedOnDate(site, todayStr);
                  const visited7Count = last7Days.filter(d => isVisitedOnDate(site, d.dateStr)).length;
                  const pct7 = Math.round((visited7Count / 7) * 100);

                  return (
                    <div 
                      key={site.id} 
                      className={`bg-white border rounded-3xl p-5 space-y-4 shadow-3xs transition-all flex flex-col justify-between hover:shadow-xs ${
                        visitedToday 
                          ? "border-emerald-200/90 bg-emerald-50/10" 
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Header: Title, Country Tag, External Link */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {site.country && (
                                <span className="text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md bg-neutral-100 text-neutral-700 font-mono">
                                  {site.country === "Germany" ? "Allemagne" : site.country}
                                </span>
                              )}
                              {site.identifiant && site.identifiant !== "N/A" && (
                                <span className="text-[9.5px] font-mono text-neutral-500 bg-neutral-50 border border-neutral-200 px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <span>ID: <strong>{site.identifiant}</strong></span>
                                </span>
                              )}
                            </div>
                            <h5 className="text-sm font-black text-neutral-950 truncate" title={site.name}>
                              {site.name}
                            </h5>
                          </div>

                          <a
                            href={site.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-neutral-100 hover:bg-indigo-50 text-neutral-600 hover:text-indigo-600 rounded-xl transition-colors shrink-0"
                            title={`Ouvrir ${site.name}`}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>

                        {/* Notes / Description */}
                        {site.notes && (
                          <p className="text-[11px] text-neutral-600 font-medium leading-relaxed bg-neutral-50/80 p-3 rounded-2xl border border-neutral-150 line-clamp-2">
                            {site.notes}
                          </p>
                        )}

                        {/* Keywords Tags */}
                        {site.keywords && site.keywords.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {site.keywords.map((kw, idx) => (
                              <span key={idx} className="text-[9px] bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-full font-bold font-mono">
                                #{kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bottom Section: 1-Click Check-in + 7-Day Streak Meter & Buttons */}
                      <div className="pt-3 border-t border-neutral-100 space-y-3">
                        {/* Progress Meter Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center text-[10px] font-mono font-bold text-neutral-500">
                            <span>Série 7J : {visited7Count}/7 jours</span>
                            <span className="text-neutral-900 font-extrabold">{pct7}%</span>
                          </div>
                          <div className="w-full bg-neutral-150 rounded-full h-1.5 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                pct7 >= 80 ? "bg-emerald-500" : pct7 >= 40 ? "bg-indigo-600" : "bg-amber-500"
                              }`} 
                              style={{ width: `${pct7}%` }} 
                            />
                          </div>
                        </div>

                        {/* Visit Today Main Button + Trash */}
                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => toggleVisitDate(site.id, todayStr)}
                            className={`flex-1 py-2.5 px-3 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs ${
                              visitedToday
                                ? "bg-emerald-600 text-white shadow-3xs"
                                : "bg-neutral-100 hover:bg-indigo-50 text-neutral-700 hover:text-indigo-700 border border-neutral-200"
                            }`}
                          >
                            {visitedToday ? (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                <span>Visité Aujourd'hui</span>
                              </>
                            ) : (
                              <>
                                <RefreshCw className="w-4 h-4 text-neutral-400" />
                                <span>Marquer comme visité</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => setRecruitmentSites(prev => prev.filter(s => s.id !== site.id))}
                            className="p-2.5 text-neutral-400 hover:text-rose-600 rounded-2xl hover:bg-rose-50 transition-colors cursor-pointer border border-transparent hover:border-rose-100"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* 7-Day Interactive Streak Buttons */}
                        <div className="flex items-center justify-between gap-1 pt-1 border-t border-neutral-100/80">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase font-mono">7J :</span>
                          <div className="flex items-center gap-1">
                            {last7Days.map(day => {
                              const checked = isVisitedOnDate(site, day.dateStr);
                              return (
                                <button
                                  key={day.dateStr}
                                  type="button"
                                  onClick={() => toggleVisitDate(site.id, day.dateStr)}
                                  className={`w-5.5 h-5.5 rounded-lg flex items-center justify-center text-[8.5px] font-black font-mono transition-all cursor-pointer ${
                                    checked
                                      ? "bg-indigo-600 text-white font-extrabold shadow-3xs"
                                      : "bg-neutral-100 text-neutral-400 hover:bg-neutral-200"
                                  } ${day.isToday ? "ring-1 ring-indigo-500" : ""}`}
                                  title={`${day.label} ${day.num}`}
                                >
                                  {day.num}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
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
