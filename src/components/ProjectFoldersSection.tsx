import React, { useState, useMemo, useEffect } from "react";
import { Formation, ResourceLink, MonthlyGoal } from "../types";
import { 
  Folder, 
  FolderOpen, 
  Plus, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  CheckSquare, 
  Square, 
  Link2, 
  GraduationCap, 
  Target, 
  Sparkles, 
  Clock, 
  BookOpen, 
  FileText, 
  Check, 
  X, 
  AlertCircle, 
  Calendar, 
  ChevronRight, 
  Globe, 
  Search,
  CheckCircle2,
  ListTodo,
  FolderPlus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ProjectFolder {
  id: string;
  name: string;
  description: string;
  category: "YouTube" | "Formation" | "E-commerce" | "Finance" | "Autre";
  createdAt: string;
  associatedFormationIds: string[];
  associatedLinkIds: string[];
  associatedGoalIds: string[];
  customObjectives: { id: string; text: string; completed: boolean }[];
  customLinks: { id: string; title: string; url: string; category: string }[];
  notes: string;
}

interface ProjectFoldersSectionProps {
  formations: Formation[];
  setFormations: React.Dispatch<React.SetStateAction<Formation[]>>;
  links: ResourceLink[];
  setLinks: React.Dispatch<React.SetStateAction<ResourceLink[]>>;
  monthlyGoals: MonthlyGoal[];
  setMonthlyGoals: React.Dispatch<React.SetStateAction<MonthlyGoal[]>>;
}

const DEFAULT_PROJECT_FOLDERS: ProjectFolder[] = [
  {
    id: "proj_1",
    name: "Chaîne YouTube - The Moroccan Analyst",
    description: "Planification des tutoriels de modélisation financière, analyses macroéconomiques et développement de l'audience.",
    category: "YouTube",
    createdAt: "2026-05-15",
    associatedFormationIds: [],
    associatedLinkIds: [],
    associatedGoalIds: [],
    customObjectives: [
      { id: "co_1", text: "Atteindre 10k abonnés d'ici la fin d'année", completed: false },
      { id: "co_2", text: "Publier 2 vidéos de haute qualité par semaine", completed: true },
      { id: "co_3", text: "Finaliser le script de la vidéo de Private Equity", completed: false }
    ],
    customLinks: [
      { id: "cl_1", title: "YouTube Creator Studio", url: "https://studio.youtube.com", category: "Outils" },
      { id: "cl_2", title: "Inspiration : Financial Modeling World Cup", url: "https://fmworldcup.com", category: "Ressources" }
    ],
    notes: "Axe principal de croissance de l'audience. Les vidéos de modélisation de LBO sur Excel ont le meilleur taux de rétention. Se concentrer sur l'aspect éducationnel premium."
  },
  {
    id: "proj_2",
    name: "Lancement de la Formation Private Equity",
    description: "Création et monétisation du programme d'accompagnement premium d'analyse transactionnelle pour professionnels de la finance.",
    category: "Formation",
    createdAt: "2026-06-10",
    associatedFormationIds: [],
    associatedLinkIds: [],
    associatedGoalIds: [],
    customObjectives: [
      { id: "co_4", text: "Enregistrer les 15 premiers modules vidéos", completed: false },
      { id: "co_5", text: "Préparer le template de modèle financier de LBO", completed: true },
      { id: "co_6", text: "Créer la page de capture de leads de l'Académie", completed: false }
    ],
    customLinks: [
      { id: "cl_3", title: "Kajabi Dashboard", url: "https://kajabi.com", category: "Outils" }
    ],
    notes: "Tarification prévue : formule premium directe. Tester l'offre auprès de 50 premiers bêta-testeurs de la communauté 'The MA Circle'."
  }
];

export default function ProjectFoldersSection({
  formations = [],
  setFormations,
  links = [],
  setLinks,
  monthlyGoals = [],
  setMonthlyGoals
}: ProjectFoldersSectionProps) {
  
  // State for folders
  const [folders, setFolders] = useState<ProjectFolder[]>(() => {
    const saved = localStorage.getItem("mp_project_folders_v1");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse project folders", e);
      }
    }
    return DEFAULT_PROJECT_FOLDERS;
  });

  // Save to local storage
  useEffect(() => {
    localStorage.setItem("mp_project_folders_v1", JSON.stringify(folders));
  }, [folders]);

  // Selected folder
  const [selectedFolderId, setSelectedFolderId] = useState<string>(() => {
    return folders[0]?.id || "";
  });

  // Safe selected folder getter
  const selectedFolder = useMemo(() => {
    return folders.find(f => f.id === selectedFolderId) || folders[0] || null;
  }, [folders, selectedFolderId]);

  // Tab control within selected folder
  const [activeTab, setActiveTab] = useState<"overview" | "formations" | "objectives" | "links">("overview");

  // Form states for creating/editing projects
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectFolder | null>(null);
  const [projName, setProjName] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projCategory, setProjCategory] = useState<ProjectFolder["category"]>("Autre");

  // Quick inputs inside unified view
  const [newCustomObjectiveText, setNewCustomObjectiveText] = useState("");
  const [newCustomLinkTitle, setNewCustomLinkTitle] = useState("");
  const [newCustomLinkUrl, setNewCustomLinkUrl] = useState("");
  const [newCustomLinkCat, setNewCustomLinkCat] = useState("Outils");

  // Assoc association dropdown states
  const [showAssociateFormation, setShowAssociateFormation] = useState(false);
  const [showAssociateGoal, setShowAssociateGoal] = useState(false);
  const [showAssociateLink, setShowAssociateLink] = useState(false);

  // Edit notes debounced-like local state
  const [localNotes, setLocalNotes] = useState("");

  // Sync local notes when folder changes
  useEffect(() => {
    if (selectedFolder) {
      setLocalNotes(selectedFolder.notes || "");
    }
  }, [selectedFolderId]);

  // Save notes handler
  const handleSaveNotes = () => {
    if (!selectedFolder) return;
    setFolders(prev => prev.map(f => f.id === selectedFolder.id ? { ...f, notes: localNotes } : f));
  };

  // Open modal for creating project
  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setProjName("");
    setProjDesc("");
    setProjCategory("Autre");
    setShowProjectModal(true);
  };

  // Open modal for editing project
  const handleOpenEditModal = (proj: ProjectFolder) => {
    setEditingProject(proj);
    setProjName(proj.name);
    setProjDesc(proj.description);
    setProjCategory(proj.category);
    setShowProjectModal(true);
  };

  // Submit project form
  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) return;

    if (editingProject) {
      // Edit mode
      setFolders(prev => prev.map(f => f.id === editingProject.id ? {
        ...f,
        name: projName.trim(),
        description: projDesc.trim(),
        category: projCategory
      } : f));
    } else {
      // Create mode
      const newFolder: ProjectFolder = {
        id: "proj_" + Date.now(),
        name: projName.trim(),
        description: projDesc.trim(),
        category: projCategory,
        createdAt: new Date().toISOString().split('T')[0],
        associatedFormationIds: [],
        associatedLinkIds: [],
        associatedGoalIds: [],
        customObjectives: [],
        customLinks: [],
        notes: ""
      };
      setFolders(prev => [...prev, newFolder]);
      setSelectedFolderId(newFolder.id);
    }

    setShowProjectModal(false);
    setEditingProject(null);
  };

  // Delete project
  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce dossier de projet ?")) return;
    const filtered = folders.filter(f => f.id !== id);
    setFolders(filtered);
    if (selectedFolderId === id) {
      setSelectedFolderId(filtered[0]?.id || "");
    }
  };

  // Add custom checklist objective to selected project
  const handleAddCustomObjective = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomObjectiveText.trim() || !selectedFolder) return;

    const newObj = {
      id: "co_" + Date.now(),
      text: newCustomObjectiveText.trim(),
      completed: false
    };

    setFolders(prev => prev.map(f => {
      if (f.id === selectedFolder.id) {
        return {
          ...f,
          customObjectives: [...f.customObjectives, newObj]
        };
      }
      return f;
    }));

    setNewCustomObjectiveText("");
  };

  // Toggle custom objective completion
  const handleToggleCustomObjective = (objId: string) => {
    if (!selectedFolder) return;
    setFolders(prev => prev.map(f => {
      if (f.id === selectedFolder.id) {
        return {
          ...f,
          customObjectives: f.customObjectives.map(o => o.id === objId ? { ...o, completed: !o.completed } : o)
        };
      }
      return f;
    }));
  };

  // Delete custom objective
  const handleDeleteCustomObjective = (objId: string) => {
    if (!selectedFolder) return;
    setFolders(prev => prev.map(f => {
      if (f.id === selectedFolder.id) {
        return {
          ...f,
          customObjectives: f.customObjectives.filter(o => o.id !== objId)
        };
      }
      return f;
    }));
  };

  // Add custom URL link
  const handleAddCustomLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomLinkTitle.trim() || !newCustomLinkUrl.trim() || !selectedFolder) return;

    let formattedUrl = newCustomLinkUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = "https://" + formattedUrl;
    }

    const newLink = {
      id: "cl_" + Date.now(),
      title: newCustomLinkTitle.trim(),
      url: formattedUrl,
      category: newCustomLinkCat
    };

    setFolders(prev => prev.map(f => {
      if (f.id === selectedFolder.id) {
        return {
          ...f,
          customLinks: [...f.customLinks, newLink]
        };
      }
      return f;
    }));

    setNewCustomLinkTitle("");
    setNewCustomLinkUrl("");
  };

  // Delete custom link
  const handleDeleteCustomLink = (linkId: string) => {
    if (!selectedFolder) return;
    setFolders(prev => prev.map(f => {
      if (f.id === selectedFolder.id) {
        return {
          ...f,
          customLinks: f.customLinks.filter(l => l.id !== linkId)
        };
      }
      return f;
    }));
  };

  // Associate an existing global Formation
  const handleAssociateFormation = (formationId: string) => {
    if (!selectedFolder) return;
    setFolders(prev => prev.map(f => {
      if (f.id === selectedFolder.id) {
        const alreadyLinked = f.associatedFormationIds.includes(formationId);
        return {
          ...f,
          associatedFormationIds: alreadyLinked 
            ? f.associatedFormationIds.filter(id => id !== formationId)
            : [...f.associatedFormationIds, formationId]
        };
      }
      return f;
    }));
    setShowAssociateFormation(false);
  };

  // Associate an existing global Bookmark (Link)
  const handleAssociateLink = (linkId: string) => {
    if (!selectedFolder) return;
    setFolders(prev => prev.map(f => {
      if (f.id === selectedFolder.id) {
        const alreadyLinked = f.associatedLinkIds.includes(linkId);
        return {
          ...f,
          associatedLinkIds: alreadyLinked
            ? f.associatedLinkIds.filter(id => id !== linkId)
            : [...f.associatedLinkIds, linkId]
        };
      }
      return f;
    }));
    setShowAssociateLink(false);
  };

  // Associate an existing global Goal
  const handleAssociateGoal = (goalId: string) => {
    if (!selectedFolder) return;
    setFolders(prev => prev.map(f => {
      if (f.id === selectedFolder.id) {
        const alreadyLinked = f.associatedGoalIds.includes(goalId);
        return {
          ...f,
          associatedGoalIds: alreadyLinked
            ? f.associatedGoalIds.filter(id => id !== goalId)
            : [...f.associatedGoalIds, goalId]
        };
      }
      return f;
    }));
    setShowAssociateGoal(false);
  };

  // Fetch actual data associated with selected project
  const associatedFormations = useMemo(() => {
    if (!selectedFolder) return [];
    return formations.filter(f => selectedFolder.associatedFormationIds.includes(f.id));
  }, [selectedFolder, formations]);

  const associatedLinks = useMemo(() => {
    if (!selectedFolder) return [];
    return links.filter(l => selectedFolder.associatedLinkIds.includes(l.id));
  }, [selectedFolder, links]);

  const associatedGoals = useMemo(() => {
    if (!selectedFolder) return [];
    return monthlyGoals.filter(g => selectedFolder.associatedGoalIds.includes(g.id));
  }, [selectedFolder, monthlyGoals]);

  // Compute stats for unified project view
  const projectStats = useMemo(() => {
    if (!selectedFolder) return { progress: 0, completedFormations: 0, totalFormations: 0, completedObjectives: 0, totalObjectives: 0 };

    // Formations progress calculation
    const totalFormations = associatedFormations.length;
    const avgFormationProgress = totalFormations > 0 
      ? associatedFormations.reduce((acc, f) => acc + (f.progressPercent || 0), 0) / totalFormations
      : 100; // if no formations, consider 100% contribution

    const completedFormations = associatedFormations.filter(f => f.progressPercent === 100 || f.status === "Terminé").length;

    // Objectives progress calculation
    const customObjs = selectedFolder.customObjectives || [];
    const totalCustom = customObjs.length;
    const completedCustom = customObjs.filter(o => o.completed).length;

    const totalGoals = associatedGoals.length;
    const completedGoals = associatedGoals.filter(g => (g.currentRevenue || 0) >= (g.targetRevenue || 1)).length; // simplistic completion logic for monthly goals

    const totalObjectives = totalCustom + totalGoals;
    const completedObjectives = completedCustom + completedGoals;

    const objectivesProgress = totalObjectives > 0
      ? (completedObjectives / totalObjectives) * 100
      : 100; // if no objectives, consider 100% contribution

    // Combine
    let combinedProgress = 0;
    if (totalFormations > 0 && totalObjectives > 0) {
      combinedProgress = Math.round((avgFormationProgress + objectivesProgress) / 2);
    } else if (totalFormations > 0) {
      combinedProgress = Math.round(avgFormationProgress);
    } else if (totalObjectives > 0) {
      combinedProgress = Math.round(objectivesProgress);
    } else {
      combinedProgress = 0;
    }

    return {
      progress: combinedProgress,
      completedFormations,
      totalFormations,
      completedObjectives,
      totalObjectives
    };
  }, [selectedFolder, associatedFormations, associatedGoals]);

  // Available lists for association dropdowns
  const unassociatedFormations = useMemo(() => {
    if (!selectedFolder) return [];
    return formations.filter(f => !selectedFolder.associatedFormationIds.includes(f.id));
  }, [selectedFolder, formations]);

  const unassociatedLinks = useMemo(() => {
    if (!selectedFolder) return [];
    return links.filter(l => !selectedFolder.associatedLinkIds.includes(l.id));
  }, [selectedFolder, links]);

  const unassociatedGoals = useMemo(() => {
    if (!selectedFolder) return [];
    return monthlyGoals.filter(g => !selectedFolder.associatedGoalIds.includes(g.id));
  }, [selectedFolder, monthlyGoals]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header card with glass effect */}
      <div className="bg-gradient-to-r from-neutral-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-neutral-800 relative overflow-hidden">
        <div className="absolute top-[-30%] right-[-10%] w-[50%] h-[150%] rounded-full bg-indigo-500/10 blur-[100px] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 bg-neutral-800/80 border border-neutral-700/60 px-3 py-1 rounded-full">
              <FolderOpen className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[10px] font-black tracking-widest text-neutral-300 uppercase font-mono">Workspace Unifié</span>
            </div>
            <h2 className="text-2xl font-black font-sans leading-none tracking-tight">DOSSIERS DE PROJETS</h2>
            <p className="text-[11px] text-neutral-300 font-medium leading-relaxed">
              Consolidez votre vision créatrice. Associez vos formations en cours, suivez vos objectifs de croissance et organisez tous vos liens ressources par projet (ex: Chaîne YouTube A, Lancement Académie).
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/10 cursor-pointer select-none active:scale-95"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Nouveau Dossier</span>
          </button>
        </div>
      </div>

      {folders.length === 0 ? (
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-12 text-center flex flex-col items-center justify-center space-y-4">
          <Folder className="w-12 h-12 text-neutral-300" />
          <div className="max-w-md">
            <h3 className="text-sm font-black text-neutral-900 uppercase">Aucun dossier de projet</h3>
            <p className="text-xs text-neutral-400 mt-1">Créez votre tout premier dossier de projet pour commencer à organiser vos formations et objectifs de développement de manière centralisée.</p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="bg-neutral-900 hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer select-none"
          >
            Créer un dossier de projet
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Sidebar - Projects selector list */}
          <div className="lg:col-span-4 space-y-3">
            <div className="bg-neutral-50/60 border border-neutral-200/60 rounded-2xl p-4">
              <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block mb-3 font-sans">
                Mes Projets Créateurs ({folders.length})
              </span>
              <div className="space-y-2">
                {folders.map(f => {
                  const isSelected = f.id === selectedFolderId;
                  const totalItems = f.associatedFormationIds.length + f.customObjectives.length + f.associatedGoalIds.length + f.customLinks.length;
                  return (
                    <div
                      key={f.id}
                      onClick={() => {
                        setSelectedFolderId(f.id);
                        setActiveTab("overview");
                      }}
                      className={`group p-4 rounded-xl border text-left transition-all cursor-pointer select-none relative ${
                        isSelected 
                          ? "bg-white border-indigo-600 shadow-sm"
                          : "bg-white/60 border-neutral-200/80 hover:bg-white hover:border-neutral-300"
                      }`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex items-start gap-2.5">
                          {isSelected ? (
                            <FolderOpen className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          ) : (
                            <Folder className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                          )}
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-neutral-900 block group-hover:text-indigo-600 transition-colors">
                              {f.name}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-medium block line-clamp-1">
                              {f.description}
                            </span>
                          </div>
                        </div>
                        
                        {/* Quick category badge */}
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full shrink-0 font-mono tracking-wider ${
                          f.category === "YouTube" ? "bg-red-50 text-red-600 border border-red-100" :
                          f.category === "Formation" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                          f.category === "E-commerce" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                          f.category === "Finance" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                          "bg-neutral-100 text-neutral-600 border border-neutral-200"
                        }`}>
                          {f.category}
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between pt-2 border-t border-neutral-100 text-[10px] text-neutral-400 font-bold uppercase tracking-wider font-sans">
                        <span>{totalItems} Éléments reliés</span>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenEditModal(f);
                            }}
                            className="text-neutral-500 hover:text-indigo-600 transition-colors p-1"
                            title="Modifier"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteProject(f.id, e)}
                            className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Area - Selected Project Hub */}
          {selectedFolder && (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Active project header card */}
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 shadow-3xs">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-neutral-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full font-mono tracking-wider ${
                        selectedFolder.category === "YouTube" ? "bg-red-50 text-red-600 border border-red-100" :
                        selectedFolder.category === "Formation" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                        selectedFolder.category === "E-commerce" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                        selectedFolder.category === "Finance" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                        "bg-neutral-100 text-neutral-600 border border-neutral-200"
                      }`}>
                        PROJET : {selectedFolder.category}
                      </span>
                      <span className="text-[10px] font-mono text-neutral-400">Créé le {selectedFolder.createdAt}</span>
                    </div>
                    <h3 className="text-lg font-black text-neutral-900 leading-tight">
                      {selectedFolder.name}
                    </h3>
                    <p className="text-xs text-neutral-400 font-medium leading-relaxed max-w-2xl">
                      {selectedFolder.description}
                    </p>
                  </div>

                  {/* Circular completion metric */}
                  <div className="flex items-center gap-3 bg-neutral-50 border border-neutral-100 p-2.5 rounded-xl self-end md:self-auto">
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full transform -rotate-90">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          className="text-neutral-100"
                          strokeWidth="4"
                          stroke="currentColor"
                          fill="transparent"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          className="text-indigo-600 transition-all duration-300"
                          strokeWidth="4"
                          strokeDasharray={2 * Math.PI * 20}
                          strokeDashoffset={2 * Math.PI * 20 * (1 - projectStats.progress / 100)}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                        />
                      </svg>
                      <span className="absolute text-[10px] font-black font-mono text-neutral-950">
                        {projectStats.progress}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[9px] font-bold text-neutral-400 block uppercase tracking-wider">Avancement Global</span>
                      <span className="text-xs font-black text-neutral-900 block font-mono">
                        {projectStats.completedFormations}/{projectStats.totalFormations} cours • {projectStats.completedObjectives}/{projectStats.totalObjectives} jalons
                      </span>
                    </div>
                  </div>
                </div>

                {/* Sub tabs navigation */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "overview" 
                        ? "bg-neutral-900 text-white shadow-3xs" 
                        : "bg-neutral-50 border border-neutral-100 text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-indigo-500" />
                    <span>Vue d'ensemble & Notes</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("formations")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "formations" 
                        ? "bg-neutral-900 text-white shadow-3xs" 
                        : "bg-neutral-50 border border-neutral-100 text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-emerald-500" />
                    <span>Formations Associées ({associatedFormations.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("objectives")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "objectives" 
                        ? "bg-neutral-900 text-white shadow-3xs" 
                        : "bg-neutral-50 border border-neutral-100 text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <Target className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-red-500" />
                    <span>Objectifs & Jalons ({selectedFolder.customObjectives.length + associatedGoals.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("links")}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "links" 
                        ? "bg-neutral-900 text-white shadow-3xs" 
                        : "bg-neutral-50 border border-neutral-100 text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-amber-500" />
                    <span>Liens & Ressources ({selectedFolder.customLinks.length + associatedLinks.length})</span>
                  </button>
                </div>
              </div>

              {/* Tab 1: OVERVIEW & NOTES */}
              {activeTab === "overview" && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 animate-in fade-in duration-300">
                  
                  {/* Left Notes Column */}
                  <div className="md:col-span-8 bg-white border border-neutral-200/90 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-indigo-500" />
                        <h4 className="text-xs font-black text-neutral-900 uppercase">Brainstorming & Notes du Projet</h4>
                      </div>
                      <button
                        onClick={handleSaveNotes}
                        className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 px-3 py-1 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer select-none"
                      >
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Enregistrer</span>
                      </button>
                    </div>

                    <textarea
                      value={localNotes}
                      onChange={(e) => setLocalNotes(e.target.value)}
                      onBlur={handleSaveNotes}
                      rows={8}
                      placeholder="Brainstormez ici vos idées de contenu, notes d'analyse stratégique, plans de monétisation, plan de cours de vos formations..."
                      className="w-full text-xs font-medium text-neutral-700 bg-neutral-50/50 border border-neutral-200 rounded-xl p-3 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all font-sans leading-relaxed resize-y"
                    />
                    <div className="flex items-center gap-1.5 text-[10px] text-neutral-400 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Les modifications apportées au bloc-notes s'enregistrent automatiquement lorsque vous cliquez en dehors ou cliquez sur Enregistrer.</span>
                    </div>
                  </div>

                  {/* Right Summary Grid Column */}
                  <div className="md:col-span-4 space-y-4">
                    <div className="bg-gradient-to-br from-indigo-50/50 to-neutral-50 border border-indigo-100 rounded-2xl p-5 space-y-4">
                      <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest font-sans">
                        Statistiques Projet
                      </h4>
                      
                      <div className="space-y-3 font-sans">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-neutral-500 font-medium">Formations :</span>
                          <span className="font-bold text-neutral-900">
                            {associatedFormations.length} cours ({projectStats.completedFormations} terminés)
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-neutral-500 font-medium">Objectifs :</span>
                          <span className="font-bold text-neutral-900">
                            {selectedFolder.customObjectives.length} jalons ({selectedFolder.customObjectives.filter(o => o.completed).length} validés)
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-neutral-500 font-medium">Liens & Favoris :</span>
                          <span className="font-bold text-neutral-900">
                            {selectedFolder.customLinks.length + associatedLinks.length} ressources
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-indigo-100/60 pt-3">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-800 uppercase tracking-wide">
                          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                          <span>Focus de l'architecte</span>
                        </div>
                        <p className="text-[10.5px] text-indigo-950/80 mt-1 leading-relaxed font-medium">
                          Reliez vos formations suivies pour consolider vos compétences techniques. Définissez des jalons clairs et gardez vos outils de référence à portée de main !
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: ASSOCIATED FORMATIONS */}
              {activeTab === "formations" && (
                <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 space-y-5 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                    <div>
                      <h4 className="text-xs font-black text-neutral-900 uppercase">📚 Formations & Cours Suivis</h4>
                      <p className="text-[10.5px] text-neutral-400 mt-0.5">Formations suivies par l'architecte associées à ce projet spécifique.</p>
                    </div>

                    <div className="relative">
                      <button
                        onClick={() => setShowAssociateFormation(!showAssociateFormation)}
                        className="bg-neutral-950 hover:bg-neutral-800 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer select-none"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Associer une formation</span>
                      </button>

                      {/* Dropdown list for association */}
                      {showAssociateFormation && (
                        <div className="absolute right-0 mt-2 w-72 bg-white border border-neutral-200 rounded-xl shadow-xl z-30 p-2 max-h-60 overflow-y-auto">
                          <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block px-2 py-1.5 font-sans border-b border-neutral-100">
                            Sélectionner une formation
                          </span>
                          {unassociatedFormations.length === 0 ? (
                            <span className="text-[10px] text-neutral-400 italic block p-3 text-center">Aucune autre formation globale disponible.</span>
                          ) : (
                            <div className="space-y-1 mt-1">
                              {unassociatedFormations.map(f => (
                                <button
                                  key={f.id}
                                  onClick={() => handleAssociateFormation(f.id)}
                                  className="w-full text-left p-2 rounded-lg text-xs hover:bg-neutral-50 flex flex-col gap-0.5"
                                >
                                  <span className="font-bold text-neutral-900 block line-clamp-1">{f.title}</span>
                                  <span className="text-[10px] text-neutral-400 font-medium block">Par {f.instructor} • {f.platform}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {associatedFormations.length === 0 ? (
                    <div className="text-center py-10 bg-neutral-50/50 border border-dashed border-neutral-200 rounded-xl">
                      <GraduationCap className="w-8 h-8 text-neutral-300 mx-auto" />
                      <span className="text-xs font-bold text-neutral-400 block mt-2">Aucune formation reliée</span>
                      <p className="text-[10.5px] text-neutral-400 mt-0.5 max-w-xs mx-auto">Reliez des cours suivis pour suivre de près l'acquisition des compétences nécessaires à votre projet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {associatedFormations.map(course => {
                        return (
                          <div
                            key={course.id}
                            className="border border-neutral-200/80 p-4 rounded-xl bg-neutral-50/40 hover:bg-white hover:border-neutral-300 transition-all flex flex-col justify-between"
                          >
                            <div className="space-y-2">
                              <div className="flex justify-between items-start gap-2">
                                <span className="text-[9px] font-black uppercase tracking-wider bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded border border-indigo-100 font-mono">
                                  {course.platform}
                                </span>
                                <button
                                  onClick={() => handleAssociateFormation(course.id)}
                                  className="text-neutral-400 hover:text-red-600 transition-colors"
                                  title="Retirer du projet"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              
                              <div>
                                <h5 className="text-xs font-black text-neutral-900 line-clamp-2 leading-tight">
                                  {course.title}
                                </h5>
                                <span className="text-[10px] text-neutral-400 font-medium block mt-1">
                                  Formateur : {course.instructor}
                                </span>
                              </div>
                            </div>

                            <div className="mt-4 pt-3 border-t border-neutral-100/60 space-y-2">
                              <div className="flex justify-between items-center text-[10px] font-bold text-neutral-500 font-sans">
                                <span>Progression :</span>
                                <span className="font-mono text-neutral-900">{course.progressPercent}%</span>
                              </div>
                              <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                                <div
                                  className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                                  style={{ width: `${course.progressPercent}%` }}
                                />
                              </div>

                              {/* Simple update progress inside project view */}
                              <div className="flex gap-1.5 mt-2">
                                <button
                                  onClick={() => {
                                    setFormations(prev => prev.map(f => f.id === course.id ? { ...f, progressPercent: Math.min(f.progressPercent + 10, 100), status: Math.min(f.progressPercent + 10, 100) === 100 ? "Terminé" : "En cours" } : f));
                                  }}
                                  className="bg-white hover:bg-neutral-50 border border-neutral-200 px-2 py-1 rounded-lg text-[9px] font-bold text-neutral-600 transition-all flex-1 cursor-pointer"
                                >
                                  +10% Prog.
                                </button>
                                <button
                                  onClick={() => {
                                    setFormations(prev => prev.map(f => f.id === course.id ? { ...f, progressPercent: 100, status: "Terminé" } : f));
                                  }}
                                  className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-1 rounded-lg text-[9px] font-bold text-emerald-700 transition-all cursor-pointer"
                                  title="Marquer comme complété"
                                >
                                  Complété
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: OBJECTIVES & MILESTONES */}
              {activeTab === "objectives" && (
                <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 space-y-5 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                    <div>
                      <h4 className="text-xs font-black text-neutral-900 uppercase">🎯 Objectifs & Jalons du Projet</h4>
                      <p className="text-[10.5px] text-neutral-400 mt-0.5">Suivi de vos jalons opérationnels spécifiques et objectifs mensuels reliés.</p>
                    </div>

                    <div className="flex gap-2">
                      {/* Associate existing monthly goal button */}
                      <div className="relative">
                        <button
                          onClick={() => setShowAssociateGoal(!showAssociateGoal)}
                          className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer select-none"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Relier Objectif Mensuel</span>
                        </button>

                        {/* Dropdown for associate goals */}
                        {showAssociateGoal && (
                          <div className="absolute right-0 mt-2 w-72 bg-white border border-neutral-200 rounded-xl shadow-xl z-30 p-2 max-h-60 overflow-y-auto">
                            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block px-2 py-1.5 font-sans border-b border-neutral-100">
                              Sélectionner l'objectif
                            </span>
                            {unassociatedGoals.length === 0 ? (
                              <span className="text-[10px] text-neutral-400 italic block p-3 text-center">Aucun autre objectif global disponible.</span>
                            ) : (
                              <div className="space-y-1 mt-1">
                                {unassociatedGoals.map(g => (
                                  <button
                                    key={g.id}
                                    onClick={() => handleAssociateGoal(g.id)}
                                    className="w-full text-left p-2 rounded-lg text-xs hover:bg-neutral-50 flex flex-col gap-0.5"
                                  >
                                    <span className="font-bold text-neutral-900 block line-clamp-1">{g.channelName}</span>
                                    <span className="text-[10px] text-neutral-400 font-medium block">
                                      {g.month} • Cible : {g.targetRevenue || g.targetFollowers} (MAD / Abo)
                                    </span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add new custom project checklist objective form */}
                  <form onSubmit={handleAddCustomObjective} className="flex gap-2 bg-neutral-50 p-2 rounded-xl border border-neutral-200/60">
                    <input
                      type="text"
                      value={newCustomObjectiveText}
                      onChange={(e) => setNewCustomObjectiveText(e.target.value)}
                      placeholder="Ajouter un nouveau jalon spécifique à ce projet (ex: Enregistrer l'épisode 1)..."
                      className="flex-1 text-xs font-medium bg-transparent border-0 focus:outline-hidden focus:ring-0 text-neutral-800"
                    />
                    <button
                      type="submit"
                      className="bg-neutral-900 hover:bg-neutral-800 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer select-none"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Ajouter</span>
                    </button>
                  </form>

                  {/* Combined List of Objectives */}
                  <div className="space-y-3">
                    
                    {/* Associated Monthly Goals */}
                    {associatedGoals.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block font-sans">
                          Objectifs de Croissance Globaux Reliés
                        </span>
                        <div className="space-y-2">
                          {associatedGoals.map(g => {
                            const revProgress = g.targetRevenue ? Math.round(((g.currentRevenue || 0) / g.targetRevenue) * 100) : 0;
                            return (
                              <div
                                key={g.id}
                                className="border border-indigo-100 bg-indigo-50/20 p-3.5 rounded-xl flex items-center justify-between gap-4"
                              >
                                <div className="space-y-0.5 flex-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded font-mono">
                                      {g.month}
                                    </span>
                                    <h5 className="text-xs font-bold text-neutral-950">
                                      Objectif de Croissance - {g.channelName}
                                    </h5>
                                  </div>
                                  <div className="flex gap-4 text-[10.5px] text-neutral-400 font-medium font-sans">
                                    <span>Cible CA : {g.targetRevenue || 0} MAD (Actuel: {g.currentRevenue || 0} MAD)</span>
                                    <span>Cible Abo : {g.targetFollowers || 0} (Actuel: {g.currentFollowers || 0})</span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <span className="text-[10px] font-black text-indigo-600 block font-mono">{revProgress}%</span>
                                    <span className="text-[8px] font-bold text-neutral-400 block uppercase font-sans">Atteint</span>
                                  </div>
                                  <button
                                    onClick={() => handleAssociateGoal(g.id)}
                                    className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                                    title="Retirer du projet"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Custom Project Checklist Milestones */}
                    <div className="space-y-2 pt-2 border-t border-neutral-100">
                      <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block font-sans">
                        Jalons Internes du Projet ({selectedFolder.customObjectives.length})
                      </span>
                      
                      {selectedFolder.customObjectives.length === 0 ? (
                        <div className="text-center py-6 text-neutral-400 italic text-xs">
                          Aucun jalon interne défini pour l'instant. Utilisez la barre ci-dessus pour en ajouter !
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {selectedFolder.customObjectives.map(o => {
                            return (
                              <div
                                key={o.id}
                                className={`p-3 rounded-xl border flex items-center justify-between gap-3 transition-all ${
                                  o.completed 
                                    ? "bg-neutral-50 border-neutral-200 text-neutral-400" 
                                    : "bg-white border-neutral-200/80 text-neutral-800"
                                }`}
                              >
                                <div
                                  onClick={() => handleToggleCustomObjective(o.id)}
                                  className="flex items-center gap-3 cursor-pointer flex-1 select-none"
                                >
                                  {o.completed ? (
                                    <CheckSquare className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  ) : (
                                    <Square className="w-4.5 h-4.5 text-neutral-400 shrink-0" />
                                  )}
                                  <span className={`text-xs font-medium leading-tight ${o.completed ? "line-through" : ""}`}>
                                    {o.text}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleDeleteCustomObjective(o.id)}
                                  className="text-neutral-400 hover:text-red-500 transition-colors p-1 shrink-0"
                                  title="Supprimer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              )}

              {/* Tab 4: LINKS & RESOURCES */}
              {activeTab === "links" && (
                <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 space-y-5 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                    <div>
                      <h4 className="text-xs font-black text-neutral-900 uppercase">🔗 Liens Favoris & Outils</h4>
                      <p className="text-[10.5px] text-neutral-400 mt-0.5">Accès instantané à vos outils de monétisation, d'administration ou de recherche d'audience.</p>
                    </div>

                    <div className="flex gap-2">
                      {/* Associate existing bookmark button */}
                      <div className="relative">
                        <button
                          onClick={() => setShowAssociateLink(!showAssociateLink)}
                          className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer select-none"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Relier Raccourci Global</span>
                        </button>

                        {/* Dropdown for associate links */}
                        {showAssociateLink && (
                          <div className="absolute right-0 mt-2 w-72 bg-white border border-neutral-200 rounded-xl shadow-xl z-30 p-2 max-h-60 overflow-y-auto">
                            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block px-2 py-1.5 font-sans border-b border-neutral-100">
                              Sélectionner le raccourci
                            </span>
                            {unassociatedLinks.length === 0 ? (
                              <span className="text-[10px] text-neutral-400 italic block p-3 text-center">Aucun autre raccourci disponible.</span>
                            ) : (
                              <div className="space-y-1 mt-1">
                                {unassociatedLinks.map(l => (
                                  <button
                                    key={l.id}
                                    onClick={() => handleAssociateLink(l.id)}
                                    className="w-full text-left p-2 rounded-lg text-xs hover:bg-neutral-50 flex flex-col gap-0.5"
                                  >
                                    <span className="font-bold text-neutral-900 block line-clamp-1">{l.title}</span>
                                    <span className="text-[10px] text-neutral-400 font-mono block line-clamp-1">{l.url}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Add custom project url form */}
                  <form onSubmit={handleAddCustomLink} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-200/60">
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        value={newCustomLinkTitle}
                        onChange={(e) => setNewCustomLinkTitle(e.target.value)}
                        placeholder="Nom du raccourci (ex: Analytics)..."
                        className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-lg p-2 focus:outline-hidden text-neutral-800"
                        required
                      />
                    </div>
                    <div className="sm:col-span-5">
                      <input
                        type="text"
                        value={newCustomLinkUrl}
                        onChange={(e) => setNewCustomLinkUrl(e.target.value)}
                        placeholder="Adresse URL (ex: studio.youtube.com)..."
                        className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-lg p-2 focus:outline-hidden text-neutral-800"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="w-full bg-neutral-900 hover:bg-neutral-800 text-white p-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer select-none"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter</span>
                      </button>
                    </div>
                  </form>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Associated global links */}
                    {associatedLinks.map(l => {
                      return (
                        <div
                          key={l.id}
                          className="border border-indigo-100 bg-indigo-50/5 p-4 rounded-xl flex items-start justify-between gap-3 hover:border-indigo-200 hover:bg-indigo-50/15 transition-all"
                        >
                          <div className="space-y-1">
                            <span className="text-[8px] font-black uppercase bg-indigo-50 text-indigo-700 px-1.5 py-0.2 rounded border border-indigo-100 font-mono">
                              {l.category || "Favoris"}
                            </span>
                            <h5 className="text-xs font-bold text-neutral-950">
                              {l.title}
                            </h5>
                            <a
                              href={l.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-indigo-600 font-medium hover:underline flex items-center gap-1.5 font-mono line-clamp-1"
                            >
                              <span>{l.url.replace(/^https?:\/\//i, '')}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </div>

                          <button
                            onClick={() => handleAssociateLink(l.id)}
                            className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                            title="Retirer l'association"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}

                    {/* Custom project specific links */}
                    {selectedFolder.customLinks.map(l => {
                      return (
                        <div
                          key={l.id}
                          className="border border-neutral-200/80 p-4 rounded-xl flex items-start justify-between gap-3 hover:border-neutral-300 hover:bg-white bg-neutral-50/30 transition-all"
                        >
                          <div className="space-y-1">
                            <span className="text-[8px] font-black uppercase bg-neutral-100 text-neutral-500 px-1.5 py-0.2 rounded border border-neutral-200 font-mono">
                              {l.category || "Outils"}
                            </span>
                            <h5 className="text-xs font-bold text-neutral-950">
                              {l.title}
                            </h5>
                            <a
                              href={l.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] text-neutral-500 hover:text-indigo-600 font-medium hover:underline flex items-center gap-1.5 font-mono line-clamp-1"
                            >
                              <span>{l.url.replace(/^https?:\/\//i, '')}</span>
                              <ExternalLink className="w-3 h-3 shrink-0" />
                            </a>
                          </div>

                          <button
                            onClick={() => handleDeleteCustomLink(l.id)}
                            className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}

                    {associatedLinks.length === 0 && selectedFolder.customLinks.length === 0 && (
                      <div className="col-span-2 text-center py-8 text-neutral-400 italic text-xs">
                        Aucun lien ou ressource enregistré pour l'instant. Ajoutez un lien ci-dessus !
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}

        </div>
      )}

      {/* Modern Modal / Drawer for creating & editing Project Folders */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            className="bg-white border border-neutral-200/80 rounded-3xl p-6 w-full max-w-lg shadow-2xl relative"
          >
            <button
              onClick={() => {
                setShowProjectModal(false);
                setEditingProject(null);
              }}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-black text-neutral-900 uppercase tracking-tight mb-4">
              {editingProject ? "Modifier le Dossier" : "Créer un Dossier de Projet"}
            </h3>

            <form onSubmit={handleProjectSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider font-sans">
                  Nom du Projet / Dossier *
                </label>
                <input
                  type="text"
                  value={projName}
                  onChange={(e) => setProjName(e.target.value)}
                  placeholder="ex: YouTube Channel - The Moroccan Analyst"
                  className="w-full text-xs font-semibold bg-neutral-50/50 border border-neutral-200 rounded-xl p-3 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all text-neutral-800"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider font-sans">
                  Catégorie
                </label>
                <select
                  value={projCategory}
                  onChange={(e) => setProjCategory(e.target.value as ProjectFolder["category"])}
                  className="w-full text-xs font-semibold bg-neutral-50/50 border border-neutral-200 rounded-xl p-3 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all text-neutral-800"
                >
                  <option value="YouTube">Vidéo / YouTube</option>
                  <option value="Formation">Formation / Académie</option>
                  <option value="E-commerce">E-commerce / Produits</option>
                  <option value="Finance">Finance / Investissements</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-neutral-400 uppercase tracking-wider font-sans">
                  Description succincte
                </label>
                <textarea
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  placeholder="Objectif à moyen terme de ce projet, niche, plateformes..."
                  rows={3}
                  className="w-full text-xs font-semibold bg-neutral-50/50 border border-neutral-200 rounded-xl p-3 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all text-neutral-800 resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2.5 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowProjectModal(false);
                    setEditingProject(null);
                  }}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer"
                >
                  {editingProject ? "Enregistrer" : "Créer le Projet"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
