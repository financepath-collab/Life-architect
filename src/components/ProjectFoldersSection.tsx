import React, { useState, useMemo, useEffect } from "react";
import { Formation, ResourceLink, MonthlyGoal, ProjectFolder, EditorialEvent, TopicToCover, ProjectBusinessKPIs, ProjectObjective, ObjectiveHistoryEntry } from "../types";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from "recharts";
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
  Calendar as CalendarIcon, 
  ChevronRight, 
  Globe, 
  Search,
  CheckCircle2,
  ListTodo,
  FolderPlus,
  Archive,
  ArchiveRestore,
  FolderArchive,
  RotateCcw,
  CalendarDays,
  Pencil,
  Lightbulb,
  Compass,
  Tag,
  Filter,
  Layers,
  Key,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Users,
  ShoppingBag,
  Video,
  UserCheck,
  DollarSign,
  TrendingUp,
  BarChart3,
  PieChart,
  ShieldAlert,
  Rocket,
  Cpu,
  Coins,
  Briefcase,
  Award,
  Activity,
  Layers3,
  PlusCircle,
  Minus,
  TrendingDown,
  ArrowUpRight,
  ArrowRight
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

/**
 * Calculates average objective completion percentage and performance status for a project folder
 */
export function getFolderCompletionStats(f: ProjectFolder, formationsList: Formation[] = []) {
  const pcts: number[] = [];
  let completedCount = 0;
  let totalCount = 0;

  // 1. Structured objectives (objectives field)
  if (f.objectives && f.objectives.length > 0) {
    f.objectives.forEach(obj => {
      totalCount++;
      const tgt = obj.targetValue || 1;
      const curr = obj.currentValue || 0;
      const pct = Math.min(100, Math.max(0, Math.round((curr / tgt) * 100)));
      pcts.push(pct);
      if (pct >= 100) completedCount++;
    });
  }

  // 2. Custom checklist objectives
  if (f.customObjectives && f.customObjectives.length > 0) {
    f.customObjectives.forEach(co => {
      totalCount++;
      pcts.push(co.completed ? 100 : 0);
      if (co.completed) completedCount++;
    });
  }

  // 3. Business KPIs
  if (f.businessKPIs) {
    if ((f.businessKPIs.targetPayingSubscribers || 0) > 0) {
      totalCount++;
      const pct = Math.min(100, Math.round(((f.businessKPIs.currentPayingSubscribers || 0) / f.businessKPIs.targetPayingSubscribers!) * 100));
      pcts.push(pct);
      if (pct >= 100) completedCount++;
    }
    if ((f.businessKPIs.targetProductsSold || 0) > 0) {
      totalCount++;
      const pct = Math.min(100, Math.round(((f.businessKPIs.currentProductsSold || 0) / f.businessKPIs.targetProductsSold!) * 100));
      pcts.push(pct);
      if (pct >= 100) completedCount++;
    }
    if ((f.businessKPIs.targetFormationsSold || 0) > 0) {
      totalCount++;
      const pct = Math.min(100, Math.round(((f.businessKPIs.currentFormationsSold || 0) / f.businessKPIs.targetFormationsSold!) * 100));
      pcts.push(pct);
      if (pct >= 100) completedCount++;
    }
    if ((f.businessKPIs.targetCoachingSold || 0) > 0) {
      totalCount++;
      const pct = Math.min(100, Math.round(((f.businessKPIs.currentCoachingSold || 0) / f.businessKPIs.targetCoachingSold!) * 100));
      pcts.push(pct);
      if (pct >= 100) completedCount++;
    }
    if ((f.businessKPIs.targetCustomRevenue || 0) > 0) {
      totalCount++;
      const pct = Math.min(100, Math.round(((f.businessKPIs.currentCustomRevenue || 0) / f.businessKPIs.targetCustomRevenue!) * 100));
      pcts.push(pct);
      if (pct >= 100) completedCount++;
    }
  }

  // 4. Formations linked
  if (f.associatedFormationIds && f.associatedFormationIds.length > 0 && formationsList.length > 0) {
    const linked = formationsList.filter(fm => f.associatedFormationIds.includes(fm.id));
    linked.forEach(fm => {
      totalCount++;
      const pct = fm.progressPercent || (fm.status === "Terminé" ? 100 : 0);
      pcts.push(pct);
      if (pct >= 100) completedCount++;
    });
  }

  if (pcts.length === 0) {
    return {
      avgPct: 0,
      totalCount: 0,
      completedCount: 0,
      statusLabel: "Nouveau",
      badgeClass: "bg-neutral-100 text-neutral-600 border-neutral-200",
      barClass: "bg-neutral-300",
      trendType: "none" as const
    };
  }

  const avgPct = Math.min(100, Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length));

  if (avgPct >= 80) {
    return {
      avgPct,
      totalCount,
      completedCount,
      statusLabel: "Excellente",
      badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
      barClass: "bg-emerald-500",
      trendType: "up" as const
    };
  } else if (avgPct >= 40) {
    return {
      avgPct,
      totalCount,
      completedCount,
      statusLabel: "En progrès",
      badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
      barClass: "bg-amber-500",
      trendType: "mid" as const
    };
  } else {
    return {
      avgPct,
      totalCount,
      completedCount,
      statusLabel: "À booster",
      badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
      barClass: "bg-rose-500",
      trendType: "down" as const
    };
  }
}

interface ProjectFoldersSectionProps {
  folders: ProjectFolder[];
  setFolders: React.Dispatch<React.SetStateAction<ProjectFolder[]>>;
  formations: Formation[];
  setFormations: React.Dispatch<React.SetStateAction<Formation[]>>;
  links: ResourceLink[];
  setLinks: React.Dispatch<React.SetStateAction<ResourceLink[]>>;
  monthlyGoals: MonthlyGoal[];
  setMonthlyGoals: React.Dispatch<React.SetStateAction<MonthlyGoal[]>>;
  events: EditorialEvent[];
  setEvents: React.Dispatch<React.SetStateAction<EditorialEvent[]>>;
}

export default function ProjectFoldersSection({
  folders = [],
  setFolders,
  formations = [],
  setFormations,
  links = [],
  setLinks,
  monthlyGoals = [],
  setMonthlyGoals,
  events = [],
  setEvents
}: ProjectFoldersSectionProps) {
  
  // Archiving view toggle (false = Active projects, true = Archived projects)
  const [showArchivedView, setShowArchivedView] = useState<boolean>(false);

  // Active vs. Archived projects memo
  const activeFolders = useMemo(() => folders.filter(f => !f.isArchived), [folders]);
  const archivedFolders = useMemo(() => folders.filter(f => f.isArchived), [folders]);

  const displayedFolders = useMemo(() => {
    return showArchivedView ? archivedFolders : activeFolders;
  }, [showArchivedView, activeFolders, archivedFolders]);

  // Selected folder ID
  const [selectedFolderId, setSelectedFolderId] = useState<string>(() => {
    return folders[0]?.id || "";
  });

  // Safe selected folder getter
  const selectedFolder = useMemo(() => {
    const match = folders.find(f => f.id === selectedFolderId);
    if (match) return match;
    return displayedFolders[0] || folders[0] || null;
  }, [folders, selectedFolderId, displayedFolders]);

  // Tab control within selected folder
  const [activeTab, setActiveTab] = useState<"overview" | "credentials" | "strategy" | "topics" | "formations" | "objectives" | "links" | "calendar">("overview");

  // Form states for creating/editing projects
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectFolder | null>(null);
  const [projName, setProjName] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projCategory, setProjCategory] = useState<ProjectFolder["category"]>("Autre");
  const [projEmail, setProjEmail] = useState("");
  const [projPassword, setProjPassword] = useState("");
  const [projInitialLinkTitle, setProjInitialLinkTitle] = useState("");
  const [projInitialLinkUrl, setProjInitialLinkUrl] = useState("");
  const [projInitialObjectiveText, setProjInitialObjectiveText] = useState("");
  const [projInitialObjectiveDueDate, setProjInitialObjectiveDueDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [projIsArchived, setProjIsArchived] = useState(false);
  const [projTargetAudienceModal, setProjTargetAudienceModal] = useState("");
  const [projCoreGoalModal, setProjCoreGoalModal] = useState("");
  const [projKeyMetricTargetModal, setProjKeyMetricTargetModal] = useState("");
  const [showPasswordInDetails, setShowPasswordInDetails] = useState(false);

  // Modal extended project states
  const [projStatusPhaseModal, setProjStatusPhaseModal] = useState<ProjectFolder["statusPhase"]>("Croissance & Ventes");
  const [projLaunchDateModal, setProjLaunchDateModal] = useState("");
  const [projBudgetModal, setProjBudgetModal] = useState<string>("");
  const [projTechStackModal, setProjTechStackModal] = useState("");
  const [projKeyRisksModal, setProjKeyRisksModal] = useState("");
  const [projValuePropModal, setProjValuePropModal] = useState("");
  const [projTeamModal, setProjTeamModal] = useState("");

  const [targetSubscribersModal, setTargetSubscribersModal] = useState<string>("");
  const [currentSubscribersModal, setCurrentSubscribersModal] = useState<string>("");
  const [targetProductsModal, setTargetProductsModal] = useState<string>("");
  const [currentProductsModal, setCurrentProductsModal] = useState<string>("");
  const [targetFormationsModal, setTargetFormationsModal] = useState<string>("");
  const [currentFormationsModal, setCurrentFormationsModal] = useState<string>("");
  const [targetCoachingModal, setTargetCoachingModal] = useState<string>("");
  const [currentCoachingModal, setCurrentCoachingModal] = useState<string>("");
  const [targetAdsenseModal, setTargetAdsenseModal] = useState<string>("");
  const [currentAdsenseModal, setCurrentAdsenseModal] = useState<string>("");
  const [targetCustomRevModal, setTargetCustomRevModal] = useState<string>("");
  const [currentCustomRevModal, setCurrentCustomRevModal] = useState<string>("");

  // Strategy & Goal states for selected project (Inline)
  const [projTargetAudience, setProjTargetAudience] = useState("");
  const [projCoreGoal, setProjCoreGoal] = useState("");
  const [projKeyMetricTarget, setProjKeyMetricTarget] = useState("");
  const [projStatusPhase, setProjStatusPhase] = useState<ProjectFolder["statusPhase"]>("Croissance & Ventes");
  const [projLaunchDate, setProjLaunchDate] = useState("");
  const [projBudget, setProjBudget] = useState<string>("");
  const [projTechStack, setProjTechStack] = useState("");
  const [projKeyRisks, setProjKeyRisks] = useState("");
  const [projValueProp, setProjValueProp] = useState("");
  const [projTeam, setProjTeam] = useState("");

  const [targetSubscribers, setTargetSubscribers] = useState<string>("");
  const [currentSubscribers, setCurrentSubscribers] = useState<string>("");
  const [targetProducts, setTargetProducts] = useState<string>("");
  const [currentProducts, setCurrentProducts] = useState<string>("");
  const [targetFormations, setTargetFormations] = useState<string>("");
  const [currentFormations, setCurrentFormations] = useState<string>("");
  const [targetCoaching, setTargetCoaching] = useState<string>("");
  const [currentCoaching, setCurrentCoaching] = useState<string>("");
  const [targetAdsense, setTargetAdsense] = useState<string>("");
  const [currentAdsense, setCurrentAdsense] = useState<string>("");
  const [targetCustomRev, setTargetCustomRev] = useState<string>("");
  const [currentCustomRev, setCurrentCustomRev] = useState<string>("");

  const [customKPIList, setCustomKPIList] = useState<{ id: string; label: string; target: string; current: string; unit?: string }[]>([]);
  const [newCustomKPILabel, setNewCustomKPILabel] = useState("");
  const [newCustomKPITarget, setNewCustomKPITarget] = useState("");
  const [newCustomKPICurrent, setNewCustomKPICurrent] = useState("");
  const [newCustomKPIUnit, setNewCustomKPIUnit] = useState("");

  // Direct Project Objectives (objectives field: ProjectObjective[])
  const [newObjTitle, setNewObjTitle] = useState("");
  const [newObjTarget, setNewObjTarget] = useState("");
  const [newObjCurrent, setNewObjCurrent] = useState("");
  const [newObjUnit, setNewObjUnit] = useState("");

  // Objective History & Trend Chart Modal states
  const [selectedObjHistoryIdx, setSelectedObjHistoryIdx] = useState<number | null>(null);
  const [histLogDate, setHistLogDate] = useState<string>(() => new Date().toISOString().split("T")[0]);
  const [histLogValue, setHistLogValue] = useState<string>("");
  const [histLogNote, setHistLogNote] = useState<string>("");

  const [isEditingStrategy, setIsEditingStrategy] = useState(false);

  // Topics to cover (Sujets à traiter) states
  const [topicStatusFilter, setTopicStatusFilter] = useState<"Tous" | "À traiter" | "En rédaction" | "Tourné" | "Publié" | "Idée">("Tous");
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicCategory, setNewTopicCategory] = useState("Tutoriel");
  const [newTopicStatus, setNewTopicStatus] = useState<TopicToCover["status"]>("À traiter");
  const [newTopicFormat, setNewTopicFormat] = useState<TopicToCover["targetFormat"]>("Vidéo YouTube");
  const [newTopicPriority, setNewTopicPriority] = useState<TopicToCover["priority"]>("Haute");
  const [newTopicNotes, setNewTopicNotes] = useState("");

  // Edit topic state
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTopicTitle, setEditTopicTitle] = useState("");
  const [editTopicCategory, setEditTopicCategory] = useState("");
  const [editTopicStatus, setEditTopicStatus] = useState<TopicToCover["status"]>("À traiter");
  const [editTopicFormat, setEditTopicFormat] = useState<TopicToCover["targetFormat"]>("Vidéo YouTube");
  const [editTopicPriority, setEditTopicPriority] = useState<TopicToCover["priority"]>("Haute");
  const [editTopicNotes, setEditTopicNotes] = useState("");

  // Sync strategy fields when selected folder changes
  useEffect(() => {
    if (selectedFolder) {
      setProjTargetAudience(selectedFolder.targetAudience || "");
      setProjCoreGoal(selectedFolder.coreGoal || "");
      setProjKeyMetricTarget(selectedFolder.keyMetricTarget || "");
      setProjStatusPhase(selectedFolder.statusPhase || "Croissance & Ventes");
      setProjLaunchDate(selectedFolder.launchDate || "");
      setProjBudget(selectedFolder.projectBudget ? String(selectedFolder.projectBudget) : "");
      setProjTechStack(selectedFolder.techStack ? selectedFolder.techStack.join(", ") : "");
      setProjKeyRisks(selectedFolder.keyRisks || "");
      setProjValueProp(selectedFolder.valueProposition || "");
      setProjTeam(selectedFolder.teamStakeholders || "");

      const kpis = selectedFolder.businessKPIs || {};
      setTargetSubscribers(kpis.targetPayingSubscribers !== undefined ? String(kpis.targetPayingSubscribers) : "");
      setCurrentSubscribers(kpis.currentPayingSubscribers !== undefined ? String(kpis.currentPayingSubscribers) : "");
      setTargetProducts(kpis.targetProductsSold !== undefined ? String(kpis.targetProductsSold) : "");
      setCurrentProducts(kpis.currentProductsSold !== undefined ? String(kpis.currentProductsSold) : "");
      setTargetFormations(kpis.targetFormationsSold !== undefined ? String(kpis.targetFormationsSold) : "");
      setCurrentFormations(kpis.currentFormationsSold !== undefined ? String(kpis.currentFormationsSold) : "");
      setTargetCoaching(kpis.targetCoachingSold !== undefined ? String(kpis.targetCoachingSold) : "");
      setCurrentCoaching(kpis.currentCoachingSold !== undefined ? String(kpis.currentCoachingSold) : "");
      setTargetAdsense(kpis.targetAdsenseRevenue !== undefined ? String(kpis.targetAdsenseRevenue) : "");
      setCurrentAdsense(kpis.currentAdsenseRevenue !== undefined ? String(kpis.currentAdsenseRevenue) : "");
      setTargetCustomRev(kpis.targetCustomRevenue !== undefined ? String(kpis.targetCustomRevenue) : "");
      setCurrentCustomRev(kpis.currentCustomRevenue !== undefined ? String(kpis.currentCustomRevenue) : "");
      setCustomKPIList(kpis.customKPIs || []);

      setIsEditingStrategy(false);
    }
  }, [selectedFolderId, selectedFolder]);

  // Save strategy handler
  const handleSaveStrategy = () => {
    if (!selectedFolder) return;

    const updatedBusinessKPIs: ProjectBusinessKPIs = {
      targetPayingSubscribers: targetSubscribers !== "" ? parseFloat(targetSubscribers) : undefined,
      currentPayingSubscribers: currentSubscribers !== "" ? parseFloat(currentSubscribers) : undefined,
      targetProductsSold: targetProducts !== "" ? parseFloat(targetProducts) : undefined,
      currentProductsSold: currentProducts !== "" ? parseFloat(currentProducts) : undefined,
      targetFormationsSold: targetFormations !== "" ? parseFloat(targetFormations) : undefined,
      currentFormationsSold: currentFormations !== "" ? parseFloat(currentFormations) : undefined,
      targetCoachingSold: targetCoaching !== "" ? parseFloat(targetCoaching) : undefined,
      currentCoachingSold: currentCoaching !== "" ? parseFloat(currentCoaching) : undefined,
      targetAdsenseRevenue: targetAdsense !== "" ? parseFloat(targetAdsense) : undefined,
      currentAdsenseRevenue: currentAdsense !== "" ? parseFloat(currentAdsense) : undefined,
      targetCustomRevenue: targetCustomRev !== "" ? parseFloat(targetCustomRev) : undefined,
      currentCustomRevenue: currentCustomRev !== "" ? parseFloat(currentCustomRev) : undefined,
      customKPIs: customKPIList
    };

    const parsedTech = projTechStack.split(",").map(s => s.trim()).filter(Boolean);

    setFolders(prev => prev.map(f => f.id === selectedFolder.id ? {
      ...f,
      targetAudience: projTargetAudience.trim(),
      coreGoal: projCoreGoal.trim(),
      keyMetricTarget: projKeyMetricTarget.trim(),
      statusPhase: projStatusPhase,
      launchDate: projLaunchDate,
      projectBudget: projBudget !== "" ? parseFloat(projBudget) : undefined,
      techStack: parsedTech.length > 0 ? parsedTech : undefined,
      keyRisks: projKeyRisks.trim(),
      valueProposition: projValueProp.trim(),
      teamStakeholders: projTeam.trim(),
      businessKPIs: updatedBusinessKPIs
    } : f));

    setIsEditingStrategy(false);
  };

  // Quick increment/decrement KPI directly on project sheet
  const handleQuickUpdateKPI = (kpiField: keyof ProjectBusinessKPIs, delta: number) => {
    if (!selectedFolder) return;
    const currentKPIs = selectedFolder.businessKPIs || {};
    let val = (currentKPIs[kpiField] as number) || 0;
    val = Math.max(0, val + delta);

    const updatedKPIs = {
      ...currentKPIs,
      [kpiField]: val
    };

    setFolders(prev => prev.map(f => f.id === selectedFolder.id ? {
      ...f,
      businessKPIs: updatedKPIs
    } : f));
  };

  // Add Custom Business KPI
  const handleAddCustomKPI = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomKPILabel.trim() || !selectedFolder) return;
    const newKpi = {
      id: "ckpi_" + Date.now(),
      label: newCustomKPILabel.trim(),
      target: newCustomKPITarget.trim() || "0",
      current: newCustomKPICurrent.trim() || "0",
      unit: newCustomKPIUnit.trim() || ""
    };
    const updatedList = [...customKPIList, newKpi];
    setCustomKPIList(updatedList);
    
    const updatedKPIs = {
      ...(selectedFolder.businessKPIs || {}),
      customKPIs: updatedList
    };
    setFolders(prev => prev.map(f => f.id === selectedFolder.id ? {
      ...f,
      businessKPIs: updatedKPIs
    } : f));

    setNewCustomKPILabel("");
    setNewCustomKPITarget("");
    setNewCustomKPICurrent("");
    setNewCustomKPIUnit("");
  };

  const handleDeleteCustomKPI = (kpiId: string) => {
    if (!selectedFolder) return;
    const updatedList = customKPIList.filter(k => k.id !== kpiId);
    setCustomKPIList(updatedList);
    const updatedKPIs = {
      ...(selectedFolder.businessKPIs || {}),
      customKPIs: updatedList
    };
    setFolders(prev => prev.map(f => f.id === selectedFolder.id ? {
      ...f,
      businessKPIs: updatedKPIs
    } : f));
  };

  // Structured Project Objectives (f.objectives) handlers
  const handleAddObjectiveItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newObjTitle.trim() || !selectedFolder) return;
    const initialVal = parseFloat(newObjCurrent) || 0;
    const today = new Date().toISOString().split("T")[0];
    
    const newObj: ProjectObjective = {
      id: `obj_${Date.now()}`,
      title: newObjTitle.trim(),
      targetValue: parseFloat(newObjTarget) || 0,
      currentValue: initialVal,
      unit: newObjUnit.trim() || "unités",
      history: [
        {
          id: `hist_${Date.now()}`,
          date: today,
          value: initialVal,
          note: "Valeur initiale à la création"
        }
      ]
    };
    const currentObjs = selectedFolder.objectives || [];
    const updatedObjs = [...currentObjs, newObj];

    setFolders(prev => prev.map(f => f.id === selectedFolder.id ? {
      ...f,
      objectives: updatedObjs
    } : f));

    setNewObjTitle("");
    setNewObjTarget("");
    setNewObjCurrent("");
    setNewObjUnit("");
  };

  const handleQuickUpdateObjCurrent = (idx: number, delta: number) => {
    if (!selectedFolder || !selectedFolder.objectives) return;
    const today = new Date().toISOString().split("T")[0];

    const updatedObjs = selectedFolder.objectives.map((obj, i) => {
      if (i === idx) {
        const newVal = Math.max(0, obj.currentValue + delta);
        const currentHistory = obj.history || [];
        const existingTodayIdx = currentHistory.findIndex(h => h.date === today);
        let updatedHistory = [...currentHistory];

        if (existingTodayIdx >= 0) {
          updatedHistory[existingTodayIdx] = {
            ...updatedHistory[existingTodayIdx],
            value: newVal,
            note: updatedHistory[existingTodayIdx].note || `Mise à jour rapide (${delta > 0 ? '+' : ''}${delta})`
          };
        } else {
          updatedHistory.push({
            id: `hist_${Date.now()}`,
            date: today,
            value: newVal,
            note: `Ajustement rapide (${delta > 0 ? '+' : ''}${delta})`
          });
        }
        updatedHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return {
          ...obj,
          currentValue: newVal,
          history: updatedHistory
        };
      }
      return obj;
    });

    setFolders(prev => prev.map(f => f.id === selectedFolder.id ? {
      ...f,
      objectives: updatedObjs
    } : f));
  };

  const handleAddObjectiveHistoryPoint = (objIdx: number, val: number, dateStr?: string, noteStr?: string) => {
    if (!selectedFolder || !selectedFolder.objectives || objIdx < 0 || objIdx >= selectedFolder.objectives.length) return;
    const targetObj = selectedFolder.objectives[objIdx];
    const dateToUse = dateStr || new Date().toISOString().split("T")[0];
    const currentHistory = targetObj.history || [];

    const existingIdx = currentHistory.findIndex(h => h.date === dateToUse);
    let updatedHistory: ObjectiveHistoryEntry[] = [];

    if (existingIdx >= 0) {
      updatedHistory = currentHistory.map((h, idx) => idx === existingIdx ? { ...h, value: val, note: noteStr !== undefined ? noteStr : h.note } : h);
    } else {
      const newEntry: ObjectiveHistoryEntry = {
        id: `hist_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        date: dateToUse,
        value: val,
        note: noteStr || ""
      };
      updatedHistory = [...currentHistory, newEntry];
    }

    updatedHistory.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const updatedObjs = selectedFolder.objectives.map((obj, i) => {
      if (i === objIdx) {
        return {
          ...obj,
          currentValue: val,
          history: updatedHistory
        };
      }
      return obj;
    });

    setFolders(prev => prev.map(f => f.id === selectedFolder.id ? {
      ...f,
      objectives: updatedObjs
    } : f));

    setHistLogValue("");
    setHistLogNote("");
  };

  const handleDeleteObjectiveHistoryPoint = (objIdx: number, histId: string) => {
    if (!selectedFolder || !selectedFolder.objectives) return;
    const targetObj = selectedFolder.objectives[objIdx];
    const currentHistory = targetObj.history || [];
    const updatedHistory = currentHistory.filter(h => h.id !== histId);

    let newCurrent = targetObj.currentValue;
    if (updatedHistory.length > 0) {
      newCurrent = updatedHistory[updatedHistory.length - 1].value;
    }

    const updatedObjs = selectedFolder.objectives.map((obj, i) => {
      if (i === objIdx) {
        return {
          ...obj,
          currentValue: newCurrent,
          history: updatedHistory
        };
      }
      return obj;
    });

    setFolders(prev => prev.map(f => f.id === selectedFolder.id ? {
      ...f,
      objectives: updatedObjs
    } : f));
  };

  const handleDeleteObjectiveItem = (idx: number) => {
    if (!selectedFolder || !selectedFolder.objectives) return;
    const updatedObjs = selectedFolder.objectives.filter((_, i) => i !== idx);
    setFolders(prev => prev.map(f => f.id === selectedFolder.id ? {
      ...f,
      objectives: updatedObjs
    } : f));
  };

  // Add topic to cover handler
  const handleAddTopicToCover = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTopicTitle.trim() || !selectedFolder) return;

    const newTopic: TopicToCover = {
      id: "top_" + Date.now(),
      title: newTopicTitle.trim(),
      category: newTopicCategory,
      status: newTopicStatus,
      targetFormat: newTopicFormat,
      priority: newTopicPriority,
      notes: newTopicNotes.trim() || undefined
    };

    setFolders(prev => prev.map(f => {
      if (f.id === selectedFolder.id) {
        return {
          ...f,
          topicsToCover: [...(f.topicsToCover || []), newTopic]
        };
      }
      return f;
    }));

    setNewTopicTitle("");
    setNewTopicNotes("");
  };

  // Cycle status for topic to cover
  const handleToggleTopicStatus = (topicId: string) => {
    if (!selectedFolder) return;
    const statusCycle: TopicToCover["status"][] = ["Idée", "À traiter", "En rédaction", "Tourné", "Publié"];
    setFolders(prev => prev.map(f => {
      if (f.id === selectedFolder.id) {
        return {
          ...f,
          topicsToCover: (f.topicsToCover || []).map(t => {
            if (t.id === topicId) {
              const nextIdx = (statusCycle.indexOf(t.status) + 1) % statusCycle.length;
              return { ...t, status: statusCycle[nextIdx] };
            }
            return t;
          })
        };
      }
      return f;
    }));
  };

  // Delete topic to cover
  const handleDeleteTopicToCover = (topicId: string) => {
    if (!selectedFolder) return;
    setFolders(prev => prev.map(f => {
      if (f.id === selectedFolder.id) {
        return {
          ...f,
          topicsToCover: (f.topicsToCover || []).filter(t => t.id !== topicId)
        };
      }
      return f;
    }));
  };

  // Start editing topic
  const handleStartEditTopic = (topic: TopicToCover) => {
    setEditingTopicId(topic.id);
    setEditTopicTitle(topic.title);
    setEditTopicCategory(topic.category || "Tutoriel");
    setEditTopicStatus(topic.status);
    setEditTopicFormat(topic.targetFormat);
    setEditTopicPriority(topic.priority || "Moyenne");
    setEditTopicNotes(topic.notes || "");
  };

  // Save edit topic
  const handleSaveEditTopic = (topicId: string) => {
    if (!selectedFolder || !editTopicTitle.trim()) return;
    setFolders(prev => prev.map(f => {
      if (f.id === selectedFolder.id) {
        return {
          ...f,
          topicsToCover: (f.topicsToCover || []).map(t =>
            t.id === topicId ? {
              ...t,
              title: editTopicTitle.trim(),
              category: editTopicCategory,
              status: editTopicStatus,
              targetFormat: editTopicFormat,
              priority: editTopicPriority,
              notes: editTopicNotes.trim() || undefined
            } : t
          )
        };
      }
      return f;
    }));
    setEditingTopicId(null);
  };

  // Quick inputs inside unified view
  const [newCustomObjectiveText, setNewCustomObjectiveText] = useState("");
  const [newCustomObjectiveDueDate, setNewCustomObjectiveDueDate] = useState(() => new Date().toISOString().split("T")[0]);

  // Editing custom objective/jalon state
  const [editingObjectiveId, setEditingObjectiveId] = useState<string | null>(null);
  const [editObjectiveText, setEditObjectiveText] = useState("");
  const [editObjectiveDueDate, setEditObjectiveDueDate] = useState("");
  const [newCustomLinkTitle, setNewCustomLinkTitle] = useState("");
  const [newCustomLinkUrl, setNewCustomLinkUrl] = useState("");
  const [newCustomLinkCat, setNewCustomLinkCat] = useState("Outils");

  // Assoc association dropdown states
  const [showAssociateFormation, setShowAssociateFormation] = useState(false);
  const [showAssociateGoal, setShowAssociateGoal] = useState(false);
  const [showAssociateLink, setShowAssociateLink] = useState(false);
  const [showAssociateEvent, setShowAssociateEvent] = useState(false);

  // New project event form states
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [newEventPlatform, setNewEventPlatform] = useState("YouTube");
  const [newEventContentType, setNewEventContentType] = useState("Vidéo Longue");
  const [newEventStatus, setNewEventStatus] = useState("Brouillon");

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

  // Archive project handler
  const handleArchiveProject = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const todayStr = new Date().toISOString().split("T")[0];
    setFolders(prev => prev.map(f => f.id === id ? { ...f, isArchived: true, archivedAt: todayStr } : f));
  };

  // Unarchive / Restore project handler
  const handleUnarchiveProject = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFolders(prev => prev.map(f => f.id === id ? { ...f, isArchived: false, archivedAt: undefined } : f));
  };

  // Open modal for creating project
  const handleOpenCreateModal = () => {
    setEditingProject(null);
    setProjName("");
    setProjDesc("");
    setProjCategory("Autre");
    setProjEmail("");
    setProjPassword("");
    setProjInitialLinkTitle("");
    setProjInitialLinkUrl("");
    setProjInitialObjectiveText("");
    setProjInitialObjectiveDueDate(new Date().toISOString().split("T")[0]);
    setProjIsArchived(false);
    setProjTargetAudienceModal("");
    setProjCoreGoalModal("");
    setProjKeyMetricTargetModal("");

    // Extended fields
    setProjStatusPhaseModal("Croissance & Ventes");
    setProjLaunchDateModal("");
    setProjBudgetModal("");
    setProjTechStackModal("");
    setProjKeyRisksModal("");
    setProjValuePropModal("");
    setProjTeamModal("");

    // KPIs
    setTargetSubscribersModal("");
    setCurrentSubscribersModal("");
    setTargetProductsModal("");
    setCurrentProductsModal("");
    setTargetFormationsModal("");
    setCurrentFormationsModal("");
    setTargetCoachingModal("");
    setCurrentCoachingModal("");
    setTargetAdsenseModal("");
    setCurrentAdsenseModal("");
    setTargetCustomRevModal("");
    setCurrentCustomRevModal("");

    setShowProjectModal(true);
  };

  // Open modal for editing project
  const handleOpenEditModal = (proj: ProjectFolder) => {
    setEditingProject(proj);
    setProjName(proj.name);
    setProjDesc(proj.description);
    setProjCategory(proj.category);
    setProjEmail(proj.email || "");
    setProjPassword(proj.password || "");
    setProjInitialLinkTitle("");
    setProjInitialLinkUrl("");
    setProjInitialObjectiveText("");
    setProjInitialObjectiveDueDate(new Date().toISOString().split("T")[0]);
    setProjIsArchived(proj.isArchived || false);
    setProjTargetAudienceModal(proj.targetAudience || "");
    setProjCoreGoalModal(proj.coreGoal || "");
    setProjKeyMetricTargetModal(proj.keyMetricTarget || "");

    // Extended fields
    setProjStatusPhaseModal(proj.statusPhase || "Croissance & Ventes");
    setProjLaunchDateModal(proj.launchDate || "");
    setProjBudgetModal(proj.projectBudget ? String(proj.projectBudget) : "");
    setProjTechStackModal(proj.techStack ? proj.techStack.join(", ") : "");
    setProjKeyRisksModal(proj.keyRisks || "");
    setProjValuePropModal(proj.valueProposition || "");
    setProjTeamModal(proj.teamStakeholders || "");

    // KPIs
    const kpis = proj.businessKPIs || {};
    setTargetSubscribersModal(kpis.targetPayingSubscribers !== undefined ? String(kpis.targetPayingSubscribers) : "");
    setCurrentSubscribersModal(kpis.currentPayingSubscribers !== undefined ? String(kpis.currentPayingSubscribers) : "");
    setTargetProductsModal(kpis.targetProductsSold !== undefined ? String(kpis.targetProductsSold) : "");
    setCurrentProductsModal(kpis.currentProductsSold !== undefined ? String(kpis.currentProductsSold) : "");
    setTargetFormationsModal(kpis.targetFormationsSold !== undefined ? String(kpis.targetFormationsSold) : "");
    setCurrentFormationsModal(kpis.currentFormationsSold !== undefined ? String(kpis.currentFormationsSold) : "");
    setTargetCoachingModal(kpis.targetCoachingSold !== undefined ? String(kpis.targetCoachingSold) : "");
    setCurrentCoachingModal(kpis.currentCoachingSold !== undefined ? String(kpis.currentCoachingSold) : "");
    setTargetAdsenseModal(kpis.targetAdsenseRevenue !== undefined ? String(kpis.targetAdsenseRevenue) : "");
    setCurrentAdsenseModal(kpis.currentAdsenseRevenue !== undefined ? String(kpis.currentAdsenseRevenue) : "");
    setTargetCustomRevModal(kpis.targetCustomRevenue !== undefined ? String(kpis.targetCustomRevenue) : "");
    setCurrentCustomRevModal(kpis.currentCustomRevenue !== undefined ? String(kpis.currentCustomRevenue) : "");

    setShowProjectModal(true);
  };

  // Submit project form
  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projName.trim()) return;

    const parsedTech = projTechStackModal.split(",").map(s => s.trim()).filter(Boolean);
    const businessKPIsModal: ProjectBusinessKPIs = {
      targetPayingSubscribers: targetSubscribersModal !== "" ? parseFloat(targetSubscribersModal) : undefined,
      currentPayingSubscribers: currentSubscribersModal !== "" ? parseFloat(currentSubscribersModal) : undefined,
      targetProductsSold: targetProductsModal !== "" ? parseFloat(targetProductsModal) : undefined,
      currentProductsSold: currentProductsModal !== "" ? parseFloat(currentProductsModal) : undefined,
      targetFormationsSold: targetFormationsModal !== "" ? parseFloat(targetFormationsModal) : undefined,
      currentFormationsSold: currentFormationsModal !== "" ? parseFloat(currentFormationsModal) : undefined,
      targetCoachingSold: targetCoachingModal !== "" ? parseFloat(targetCoachingModal) : undefined,
      currentCoachingSold: currentCoachingModal !== "" ? parseFloat(currentCoachingModal) : undefined,
      targetAdsenseRevenue: targetAdsenseModal !== "" ? parseFloat(targetAdsenseModal) : undefined,
      currentAdsenseRevenue: currentAdsenseModal !== "" ? parseFloat(currentAdsenseModal) : undefined,
      targetCustomRevenue: targetCustomRevModal !== "" ? parseFloat(targetCustomRevModal) : undefined,
      currentCustomRevenue: currentCustomRevModal !== "" ? parseFloat(currentCustomRevModal) : undefined,
      customKPIs: editingProject?.businessKPIs?.customKPIs || []
    };

    if (editingProject) {
      // Edit mode
      setFolders(prev => prev.map(f => f.id === editingProject.id ? {
        ...f,
        name: projName.trim(),
        description: projDesc.trim(),
        category: projCategory,
        email: projEmail.trim() || undefined,
        password: projPassword.trim() || undefined,
        isArchived: projIsArchived,
        archivedAt: projIsArchived ? (f.archivedAt || new Date().toISOString().split("T")[0]) : undefined,
        targetAudience: projTargetAudienceModal.trim(),
        coreGoal: projCoreGoalModal.trim(),
        keyMetricTarget: projKeyMetricTargetModal.trim(),
        statusPhase: projStatusPhaseModal,
        launchDate: projLaunchDateModal,
        projectBudget: projBudgetModal !== "" ? parseFloat(projBudgetModal) : undefined,
        techStack: parsedTech.length > 0 ? parsedTech : undefined,
        keyRisks: projKeyRisksModal.trim(),
        valueProposition: projValuePropModal.trim(),
        teamStakeholders: projTeamModal.trim(),
        businessKPIs: businessKPIsModal
      } : f));
    } else {
      // Create mode
      const customLinks: { id: string; title: string; url: string; category: string }[] = [];
      if (projInitialLinkTitle.trim() && projInitialLinkUrl.trim()) {
        let formattedUrl = projInitialLinkUrl.trim();
        if (!/^https?:\/\//i.test(formattedUrl)) {
          formattedUrl = "https://" + formattedUrl;
        }
        customLinks.push({
          id: "cl_" + Date.now(),
          title: projInitialLinkTitle.trim(),
          url: formattedUrl,
          category: "Lien Utile"
        });
      }

      const customObjectives: { id: string; text: string; completed: boolean; dueDate?: string }[] = [];
      if (projInitialObjectiveText.trim()) {
        customObjectives.push({
          id: "co_" + Date.now(),
          text: projInitialObjectiveText.trim(),
          completed: false,
          dueDate: projInitialObjectiveDueDate || undefined
        });
      }

      const newFolder: ProjectFolder = {
        id: "proj_" + Date.now(),
        name: projName.trim(),
        description: projDesc.trim(),
        category: projCategory,
        createdAt: new Date().toISOString().split('T')[0],
        email: projEmail.trim() || undefined,
        password: projPassword.trim() || undefined,
        targetAudience: projTargetAudienceModal.trim(),
        coreGoal: projCoreGoalModal.trim(),
        keyMetricTarget: projKeyMetricTargetModal.trim(),
        statusPhase: projStatusPhaseModal,
        launchDate: projLaunchDateModal,
        projectBudget: projBudgetModal !== "" ? parseFloat(projBudgetModal) : undefined,
        techStack: parsedTech.length > 0 ? parsedTech : undefined,
        keyRisks: projKeyRisksModal.trim(),
        valueProposition: projValuePropModal.trim(),
        teamStakeholders: projTeamModal.trim(),
        businessKPIs: businessKPIsModal,
        associatedFormationIds: [],
        associatedLinkIds: [],
        associatedGoalIds: [],
        customObjectives,
        topicsToCover: [],
        customLinks,
        notes: "",
        isArchived: projIsArchived,
        archivedAt: projIsArchived ? new Date().toISOString().split("T")[0] : undefined
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
      completed: false,
      dueDate: newCustomObjectiveDueDate || undefined
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

  // Start editing custom objective/jalon
  const handleStartEditObjective = (o: { id: string; text: string; completed: boolean; dueDate?: string }) => {
    setEditingObjectiveId(o.id);
    setEditObjectiveText(o.text);
    setEditObjectiveDueDate(o.dueDate || "");
  };

  // Save edited custom objective/jalon
  const handleSaveEditObjective = (objId: string) => {
    if (!selectedFolder || !editObjectiveText.trim()) return;
    setFolders(prev => prev.map(f => {
      if (f.id === selectedFolder.id) {
        return {
          ...f,
          customObjectives: f.customObjectives.map(o =>
            o.id === objId ? { ...o, text: editObjectiveText.trim(), dueDate: editObjectiveDueDate || undefined } : o
          )
        };
      }
      return f;
    }));
    setEditingObjectiveId(null);
  };

  // Cancel editing custom objective/jalon
  const handleCancelEditObjective = () => {
    setEditingObjectiveId(null);
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

  // Associate/disassociate an existing calendar event
  const handleAssociateEvent = (eventId: string) => {
    if (!selectedFolder) return;
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return {
          ...e,
          projectId: e.projectId === selectedFolder.id ? undefined : selectedFolder.id
        };
      }
      return e;
    }));
    setShowAssociateEvent(false);
  };

  // Add a new project event
  const handleAddProjectEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFolder || !newEventTitle.trim()) return;

    const newEvt: EditorialEvent = {
      id: "evt_" + Date.now(),
      title: newEventTitle.trim(),
      channelName: "Principal",
      platform: newEventPlatform,
      scheduledDate: newEventDate || new Date().toISOString().split("T")[0],
      status: newEventStatus as any,
      contentType: newEventContentType as any,
      projectId: selectedFolder.id
    };

    setEvents(prev => [newEvt, ...prev]);
    setNewEventTitle("");
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

  const associatedEvents = useMemo(() => {
    if (!selectedFolder) return [];
    return events.filter(e => e.projectId === selectedFolder.id);
  }, [selectedFolder, events]);

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

  const unassociatedEvents = useMemo(() => {
    if (!selectedFolder) return [];
    return events.filter(e => e.projectId !== selectedFolder.id);
  }, [selectedFolder, events]);

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
            <div className="bg-neutral-50/60 border border-neutral-200/60 rounded-2xl p-4 space-y-3">
              
              {/* Filter tabs: Active vs Archived */}
              <div className="flex items-center justify-between border-b border-neutral-200/80 pb-2.5">
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block font-sans">
                  Projets ({folders.length})
                </span>
                <div className="flex items-center gap-1 bg-neutral-200/60 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => {
                      setShowArchivedView(false);
                      if (activeFolders.length > 0 && (!selectedFolder || selectedFolder.isArchived)) {
                        setSelectedFolderId(activeFolders[0].id);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      !showArchivedView 
                        ? "bg-white text-neutral-900 shadow-2xs font-black"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <FolderOpen className="w-3 h-3 text-indigo-600" />
                    <span>Actifs ({activeFolders.length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowArchivedView(true);
                      if (archivedFolders.length > 0 && (!selectedFolder || !selectedFolder.isArchived)) {
                        setSelectedFolderId(archivedFolders[0].id);
                      }
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      showArchivedView 
                        ? "bg-white text-neutral-900 shadow-2xs font-black"
                        : "text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <Archive className="w-3 h-3 text-amber-600" />
                    <span>Archives ({archivedFolders.length})</span>
                  </button>
                </div>
              </div>

              {displayedFolders.length === 0 ? (
                <div className="p-6 text-center text-neutral-400 text-xs italic bg-white/60 rounded-xl border border-dashed border-neutral-200">
                  {showArchivedView 
                    ? "Aucun projet archivé pour l'instant." 
                    : "Aucun projet actif. Créez un nouveau dossier de projet ou consultez vos archives."}
                </div>
              ) : (
                <div className="space-y-2">
                  {displayedFolders.map(f => {
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
                          <div className="flex items-start gap-2.5 min-w-0">
                            {isSelected ? (
                              <FolderOpen className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                            ) : f.isArchived ? (
                              <Archive className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            ) : (
                              <Folder className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                            )}
                            <div className="space-y-0.5 min-w-0">
                              <span className="text-xs font-bold text-neutral-900 block group-hover:text-indigo-600 transition-colors truncate">
                                {f.name}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-medium block line-clamp-1">
                                {f.description}
                              </span>
                            </div>
                          </div>
                          
                          {/* Quick category or archived badge */}
                          <div className="flex flex-col items-end gap-1 shrink-0">
                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full font-mono tracking-wider ${
                              f.category === "YouTube" ? "bg-red-50 text-red-600 border border-red-100" :
                              f.category === "Formation" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                              f.category === "E-commerce" ? "bg-amber-50 text-amber-600 border border-amber-100" :
                              f.category === "Finance" ? "bg-indigo-50 text-indigo-600 border border-indigo-100" :
                              "bg-neutral-100 text-neutral-600 border border-neutral-200"
                            }`}>
                              {f.category}
                            </span>
                            {f.isArchived && (
                              <span className="text-[8px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-mono">
                                Archivé
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Mini-Dashboard Objectifs & Performance */}
                        {(() => {
                          const stats = getFolderCompletionStats(f, formations);
                          return (
                            <div className="mt-3 p-2.5 bg-neutral-50/90 rounded-xl border border-neutral-200/70 space-y-2 font-sans">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  {stats.trendType === "up" && <TrendingUp className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                                  {stats.trendType === "mid" && <ArrowUpRight className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                                  {stats.trendType === "down" && <TrendingDown className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                                  {stats.trendType === "none" && <Minus className="w-3.5 h-3.5 text-neutral-400 shrink-0" />}
                                  <span className="text-xs font-black font-mono text-neutral-900">{stats.avgPct}%</span>
                                  <span className="text-[9px] font-bold text-neutral-400 uppercase">complété</span>
                                </div>
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${stats.badgeClass}`}>
                                  {stats.statusLabel}
                                </span>
                              </div>

                              <div className="h-1.5 w-full bg-neutral-200/80 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${stats.barClass}`}
                                  style={{ width: `${stats.avgPct}%` }}
                                />
                              </div>

                              <div className="flex justify-between items-center text-[9.5px] font-semibold text-neutral-500">
                                <span>{stats.completedCount}/{stats.totalCount} objectifs validés</span>
                                <span className="font-mono text-neutral-400 text-[9px]">{stats.totalCount} mesure(s)</span>
                              </div>
                            </div>
                          );
                        })()}

                        <div className="mt-3 flex items-center justify-between pt-2 border-t border-neutral-100 text-[10px] text-neutral-400 font-bold uppercase tracking-wider font-sans">
                          <span>{totalItems} Éléments reliés</span>
                          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
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

                            {f.isArchived ? (
                              <button
                                onClick={(e) => handleUnarchiveProject(f.id, e)}
                                className="text-amber-600 hover:text-amber-700 transition-colors p-1"
                                title="Restaurer le projet"
                              >
                                <ArchiveRestore className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={(e) => handleArchiveProject(f.id, e)}
                                className="text-neutral-400 hover:text-amber-600 transition-colors p-1"
                                title="Archiver le projet"
                              >
                                <Archive className="w-3.5 h-3.5" />
                              </button>
                            )}

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
              )}
            </div>
          </div>

          {/* Main Area - Selected Project Hub */}
          {selectedFolder && (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Archive Alert Banner if selected folder is archived */}
              {selectedFolder.isArchived && (
                <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-amber-900 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl shrink-0">
                      <Archive className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-black block uppercase tracking-tight">PROJET ARCHIVÉ</span>
                      <span className="text-[11px] text-amber-700 font-medium leading-tight block mt-0.5">
                        Dossier classé {selectedFolder.archivedAt ? `le ${selectedFolder.archivedAt}` : ""}. Vos formations, objectifs, événements et liens restent consultables en mode archive.
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleUnarchiveProject(selectedFolder.id)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-3.5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs active:scale-95"
                  >
                    <ArchiveRestore className="w-4 h-4" />
                    <span>Désarchiver</span>
                  </button>
                </div>
              )}

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
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-black text-neutral-900 leading-tight">
                        {selectedFolder.name}
                      </h3>
                      {!selectedFolder.isArchived ? (
                        <button
                          onClick={() => handleArchiveProject(selectedFolder.id)}
                          className="px-2.5 py-1 bg-neutral-100 hover:bg-amber-50 text-neutral-600 hover:text-amber-700 border border-neutral-200 hover:border-amber-200 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer"
                          title="Archiver ce projet"
                        >
                          <Archive className="w-3 h-3 text-amber-600" />
                          <span>Archiver</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUnarchiveProject(selectedFolder.id)}
                          className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-[10px] font-extrabold flex items-center gap-1 transition-all cursor-pointer"
                          title="Restaurer le projet"
                        >
                          <ArchiveRestore className="w-3 h-3 text-amber-600" />
                          <span>Restaurer</span>
                        </button>
                      )}
                    </div>
                    <p className="text-xs text-neutral-400 font-medium leading-relaxed max-w-2xl">
                      {selectedFolder.description}
                    </p>
                  </div>

                  {/* Mini-Dashboard Header Widget */}
                  {(() => {
                    const activeStats = getFolderCompletionStats(selectedFolder, formations);
                    return (
                      <div className="flex items-center gap-3 bg-gradient-to-br from-neutral-50 to-neutral-100/80 border border-neutral-200/80 p-3 rounded-2xl self-start md:self-auto shadow-2xs">
                        <div className="relative w-13 h-13 flex items-center justify-center shrink-0">
                          <svg className="w-full h-full transform -rotate-90">
                            <circle
                              cx="26"
                              cy="26"
                              r="21"
                              className="text-neutral-200/80"
                              strokeWidth="4.5"
                              stroke="currentColor"
                              fill="transparent"
                            />
                            <circle
                              cx="26"
                              cy="26"
                              r="21"
                              className={`${activeStats.trendType === "up" ? "text-emerald-500" : activeStats.trendType === "mid" ? "text-amber-500" : "text-rose-500"} transition-all duration-500`}
                              strokeWidth="4.5"
                              strokeDasharray={2 * Math.PI * 21}
                              strokeDashoffset={2 * Math.PI * 21 * (1 - activeStats.avgPct / 100)}
                              strokeLinecap="round"
                              stroke="currentColor"
                              fill="transparent"
                            />
                          </svg>
                          <span className="absolute text-[11px] font-black font-mono text-neutral-900">
                            {activeStats.avgPct}%
                          </span>
                        </div>

                        <div className="space-y-0.5 font-sans">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Performances</span>
                            <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase border flex items-center gap-1 ${activeStats.badgeClass}`}>
                              {activeStats.trendType === "up" && <TrendingUp className="w-3 h-3 text-emerald-600" />}
                              {activeStats.trendType === "mid" && <ArrowUpRight className="w-3 h-3 text-amber-600" />}
                              {activeStats.trendType === "down" && <TrendingDown className="w-3 h-3 text-rose-500" />}
                              {activeStats.trendType === "none" && <Minus className="w-3 h-3 text-neutral-400" />}
                              <span>{activeStats.statusLabel}</span>
                            </span>
                          </div>

                          <div className="text-xs font-black text-neutral-900 font-mono">
                            {activeStats.completedCount}/{activeStats.totalCount} Objectifs atteints
                          </div>

                          <div className="text-[9.5px] text-neutral-500 font-medium">
                            {projectStats.completedFormations}/{projectStats.totalFormations} cours terminés
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Sub tabs navigation */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "overview" 
                        ? "bg-neutral-900 text-white shadow-3xs" 
                        : "bg-neutral-50 border border-neutral-100 text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-indigo-500" />
                    <span>Vue d'ensemble & Notes</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("credentials")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "credentials" 
                        ? "bg-neutral-900 text-white shadow-3xs" 
                        : "bg-neutral-50 border border-neutral-100 text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <Key className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-amber-500" />
                    <span>Identifiants & Accès</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("strategy")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "strategy" 
                        ? "bg-neutral-900 text-white shadow-3xs" 
                        : "bg-neutral-50 border border-neutral-100 text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <Target className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-rose-500" />
                    <span>Objectifs & Stratégie</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("topics")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "topics" 
                        ? "bg-neutral-900 text-white shadow-3xs" 
                        : "bg-neutral-50 border border-neutral-100 text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-amber-500" />
                    <span>Sujets à traiter ({selectedFolder.topicsToCover?.length || 0})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("formations")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "formations" 
                        ? "bg-neutral-900 text-white shadow-3xs" 
                        : "bg-neutral-50 border border-neutral-100 text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <GraduationCap className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-emerald-500" />
                    <span>Formations ({associatedFormations.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("objectives")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "objectives" 
                        ? "bg-neutral-900 text-white shadow-3xs" 
                        : "bg-neutral-50 border border-neutral-100 text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-indigo-500" />
                    <span>Jalons & Checklist ({selectedFolder.customObjectives.length + associatedGoals.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("links")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "links" 
                        ? "bg-neutral-900 text-white shadow-3xs" 
                        : "bg-neutral-50 border border-neutral-100 text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <Link2 className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-amber-500" />
                    <span>Ressources & Liens ({selectedFolder.customLinks.length + associatedLinks.length})</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("calendar")}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeTab === "calendar" 
                        ? "bg-neutral-900 text-white shadow-3xs" 
                        : "bg-neutral-50 border border-neutral-100 text-neutral-500 hover:text-neutral-900"
                    }`}
                  >
                    <CalendarIcon className="w-3.5 h-3.5 inline mr-1.5 -mt-0.5 text-indigo-500" />
                    <span>Calendrier Éditorial ({associatedEvents.length})</span>
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
                  <div className="md:col-span-4 space-y-4 font-sans">
                    {/* Strategic Snapshot Widget */}
                    <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 text-white border border-neutral-800 rounded-2xl p-4 space-y-3 shadow-md">
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-rose-400 tracking-wider">
                          <Target className="w-3.5 h-3.5" />
                          <span>Aperçu Stratégique</span>
                        </div>
                        <button
                          onClick={() => setActiveTab("strategy")}
                          className="text-[9px] text-indigo-300 hover:text-white font-bold underline cursor-pointer"
                        >
                          Éditer
                        </button>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-[9px] font-bold text-neutral-400 block uppercase">Audience Cible :</span>
                          <span className="font-medium text-neutral-200 line-clamp-2">
                            {selectedFolder.targetAudience || "Non définie"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-neutral-400 block uppercase">Objectif Principal :</span>
                          <span className="font-medium text-neutral-200 line-clamp-2">
                            {selectedFolder.coreGoal || "Non défini"}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] font-bold text-neutral-400 block uppercase">Cible KPI :</span>
                          <span className="font-bold text-amber-300 font-mono">
                            {selectedFolder.keyMetricTarget || "Non définie"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Widget */}
                    <div className="bg-gradient-to-br from-indigo-50/50 to-neutral-50 border border-indigo-100 rounded-2xl p-5 space-y-4">
                      <h4 className="text-[10px] font-black text-indigo-900 uppercase tracking-widest font-sans">
                        Statistiques Projet
                      </h4>
                      
                      <div className="space-y-3 font-sans">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-neutral-500 font-medium">Sujets à traiter :</span>
                          <span className="font-bold text-neutral-900 font-mono">
                            {selectedFolder.topicsToCover?.length || 0} sujets
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-neutral-500 font-medium">Formations :</span>
                          <span className="font-bold text-neutral-900">
                            {associatedFormations.length} cours ({projectStats.completedFormations} terminés)
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-neutral-500 font-medium">Jalons & Objectifs :</span>
                          <span className="font-bold text-neutral-900">
                            {selectedFolder.customObjectives.length} jalons ({selectedFolder.customObjectives.filter(o => o.completed).length} validés)
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-neutral-500 font-medium">Ressources & Liens :</span>
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
                          Reliez vos formations et organisez vos thématiques dans l'onglet 'Sujets à traiter' pour planifier vos productions avec régularité !
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab: IDENTIFIANTS & ACCÈS */}
              {activeTab === "credentials" && (
                <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 space-y-6 animate-in fade-in duration-300 font-sans">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                    <div>
                      <h4 className="text-xs font-black text-neutral-900 uppercase flex items-center gap-2">
                        <Key className="w-4 h-4 text-amber-500" />
                        <span>Identifiants & Accès du Projet</span>
                      </h4>
                      <p className="text-[10.5px] text-neutral-400 mt-0.5">
                        Conservez les emails de contact, mots de passe et accès administratifs spécifiques à ce projet.
                      </p>
                    </div>

                    <button
                      onClick={() => handleOpenEditModal(selectedFolder)}
                      className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Modifier les Accès</span>
                    </button>
                  </div>

                  {/* Main email & password cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-2xl space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
                        <Mail className="w-4 h-4 text-indigo-500" />
                        <span>Email Principal du Projet</span>
                      </div>
                      <div className="text-sm font-mono font-bold text-neutral-900 break-all select-all">
                        {selectedFolder.email || <span className="text-neutral-400 italic text-xs font-normal">Non configuré</span>}
                      </div>
                    </div>

                    <div className="p-4 bg-neutral-50 border border-neutral-200/80 rounded-2xl space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-neutral-500">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-amber-500" />
                          <span>Mot de passe Principal</span>
                        </div>
                        {selectedFolder.password && (
                          <button
                            type="button"
                            onClick={() => setShowPasswordInDetails(!showPasswordInDetails)}
                            className="text-[10px] text-neutral-500 hover:text-neutral-900 flex items-center gap-1 cursor-pointer font-normal"
                          >
                            {showPasswordInDetails ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                            <span>{showPasswordInDetails ? "Masquer" : "Afficher"}</span>
                          </button>
                        )}
                      </div>
                      <div className="text-sm font-mono font-bold text-neutral-900 select-all">
                        {selectedFolder.password ? (
                          showPasswordInDetails ? selectedFolder.password : "••••••••••••"
                        ) : (
                          <span className="text-neutral-400 italic text-xs font-normal">Non configuré</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "strategy" && (
                <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 space-y-6 animate-in fade-in duration-300 font-sans">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                    <div>
                      <h4 className="text-xs font-black text-neutral-900 uppercase flex items-center gap-2">
                        <Target className="w-4 h-4 text-rose-500" />
                        <span>Fiche Technique & Objectifs Business du Projet</span>
                      </h4>
                      <p className="text-[10.5px] text-neutral-400 mt-0.5">
                        Supervisez les objectifs chiffrés (abonnés payants, ventes, formations, AdSense) et la fiche stratégique globale.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        if (isEditingStrategy) {
                          handleSaveStrategy();
                        } else {
                          setIsEditingStrategy(true);
                        }
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer select-none ${
                        isEditingStrategy 
                          ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xs" 
                          : "bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border border-neutral-200"
                      }`}
                    >
                      {isEditingStrategy ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Enregistrer les Modifications</span>
                        </>
                      ) : (
                        <>
                          <Pencil className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Modifier la Fiche & Cibles</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* 1. Extended Technical Overview Banner */}
                  <div className="bg-gradient-to-r from-neutral-900 via-neutral-950 to-indigo-950 text-white p-5 rounded-2xl space-y-4 shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <Rocket className="w-4 h-4 text-rose-400" />
                        <span className="text-xs font-black uppercase tracking-wider text-rose-300">Phase & Avancement Produit</span>
                      </div>
                      
                      {isEditingStrategy ? (
                        <select
                          value={projStatusPhase}
                          onChange={(e) => setProjStatusPhase(e.target.value as ProjectFolder["statusPhase"])}
                          className="text-xs font-extrabold bg-neutral-800 border border-neutral-700 text-white rounded-lg px-2.5 py-1 focus:outline-hidden"
                        >
                          <option value="Idéation">Phase : Idéation</option>
                          <option value="Conception">Phase : Conception</option>
                          <option value="Prototypage & MVP">Phase : Prototypage & MVP</option>
                          <option value="Lancement">Phase : Lancement</option>
                          <option value="Croissance & Ventes">Phase : Croissance & Ventes</option>
                          <option value="Scalabilité & Maturité">Phase : Scalabilité & Maturité</option>
                        </select>
                      ) : (
                        <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/30 text-rose-200 font-mono">
                          {selectedFolder.statusPhase || "Croissance & Ventes"}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium">
                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Date de Lancement :</span>
                        {isEditingStrategy ? (
                          <input
                            type="date"
                            value={projLaunchDate}
                            onChange={(e) => setProjLaunchDate(e.target.value)}
                            className="text-xs bg-neutral-800 border border-neutral-700 text-white rounded-lg p-1.5 w-full font-mono"
                          />
                        ) : (
                          <span className="text-white font-bold font-mono">
                            {selectedFolder.launchDate || "Non définie"}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Budget & Investissement :</span>
                        {isEditingStrategy ? (
                          <input
                            type="number"
                            value={projBudget}
                            onChange={(e) => setProjBudget(e.target.value)}
                            placeholder="ex: 15000"
                            className="text-xs bg-neutral-800 border border-neutral-700 text-white rounded-lg p-1.5 w-full font-mono"
                          />
                        ) : (
                          <span className="text-emerald-400 font-bold font-mono">
                            {selectedFolder.projectBudget ? `${selectedFolder.projectBudget.toLocaleString()} MAD / €` : "Non spécifié"}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 sm:col-span-2">
                        <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block">Équipe & Intervenants :</span>
                        {isEditingStrategy ? (
                          <input
                            type="text"
                            value={projTeam}
                            onChange={(e) => setProjTeam(e.target.value)}
                            placeholder="ex: Fondateur, Monteur, Customer Manager..."
                            className="text-xs bg-neutral-800 border border-neutral-700 text-white rounded-lg p-1.5 w-full"
                          />
                        ) : (
                          <span className="text-neutral-200 font-medium">
                            {selectedFolder.teamStakeholders || "Fondateur principal"}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Tech Stack & Risks */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-white/10 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-indigo-300 uppercase tracking-wider">
                          <Cpu className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Stack Technique & Outils Outilés :</span>
                        </div>
                        {isEditingStrategy ? (
                          <input
                            type="text"
                            value={projTechStack}
                            onChange={(e) => setProjTechStack(e.target.value)}
                            placeholder="ex: YouTube Studio, Stripe, Kajabi, Substack..."
                            className="text-xs bg-neutral-800 border border-neutral-700 text-white rounded-lg p-1.5 w-full"
                          />
                        ) : (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {selectedFolder.techStack && selectedFolder.techStack.length > 0 ? (
                              selectedFolder.techStack.map((tech, idx) => (
                                <span key={idx} className="text-[9.5px] font-bold bg-white/10 border border-white/15 px-2 py-0.5 rounded-md text-neutral-200 font-mono">
                                  {tech}
                                </span>
                              ))
                            ) : (
                              <span className="text-neutral-400 italic text-[11px]">Aucun outil renseigné</span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[9px] font-bold text-amber-300 uppercase tracking-wider">
                          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                          <span>Risques Clés & Freins Identifiés :</span>
                        </div>
                        {isEditingStrategy ? (
                          <input
                            type="text"
                            value={projKeyRisks}
                            onChange={(e) => setProjKeyRisks(e.target.value)}
                            placeholder="ex: Risque d'algorithme, délai d'enregistrement..."
                            className="text-xs bg-neutral-800 border border-neutral-700 text-white rounded-lg p-1.5 w-full"
                          />
                        ) : (
                          <span className="text-neutral-300 italic text-[11px] block pt-0.5">
                            {selectedFolder.keyRisks || "Aucun risque bloquant identifié pour l'instant."}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 2. Proposition de Valeur & Strategic Baseline */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* UVP */}
                    <div className="bg-neutral-50/70 border border-neutral-200/80 rounded-2xl p-4 space-y-2 md:col-span-1">
                      <div className="flex items-center gap-2 text-indigo-900 text-xs font-extrabold uppercase tracking-wide">
                        <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                          <Award className="w-4 h-4" />
                        </div>
                        <span>Proposition de Valeur (UVP)</span>
                      </div>
                      {isEditingStrategy ? (
                        <textarea
                          value={projValueProp}
                          onChange={(e) => setProjValueProp(e.target.value)}
                          placeholder="Ex: Analyses financières de niveau fonds M&A rendues accessibles..."
                          rows={3}
                          className="w-full text-xs font-medium text-neutral-800 bg-white border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                        />
                      ) : (
                        <p className="text-xs text-neutral-700 font-medium leading-relaxed bg-white/60 p-3 rounded-xl border border-neutral-100 min-h-[80px]">
                          {selectedFolder.valueProposition || <span className="text-neutral-400 italic">Renseignez votre élément différenciateur principal.</span>}
                        </p>
                      )}
                    </div>

                    {/* Target Audience */}
                    <div className="bg-neutral-50/70 border border-neutral-200/80 rounded-2xl p-4 space-y-2 md:col-span-1">
                      <div className="flex items-center gap-2 text-indigo-900 text-xs font-extrabold uppercase tracking-wide">
                        <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                          <Compass className="w-4 h-4" />
                        </div>
                        <span>Audience Cible & Niche</span>
                      </div>
                      {isEditingStrategy ? (
                        <textarea
                          value={projTargetAudience}
                          onChange={(e) => setProjTargetAudience(e.target.value)}
                          placeholder="Ex: Étudiants en finance, jeunes professionnels M&A / Private Equity..."
                          rows={3}
                          className="w-full text-xs font-medium text-neutral-800 bg-white border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                        />
                      ) : (
                        <p className="text-xs text-neutral-700 font-medium leading-relaxed bg-white/60 p-3 rounded-xl border border-neutral-100 min-h-[80px]">
                          {selectedFolder.targetAudience || <span className="text-neutral-400 italic">Aucune audience définie.</span>}
                        </p>
                      )}
                    </div>

                    {/* Core Goal */}
                    <div className="bg-neutral-50/70 border border-neutral-200/80 rounded-2xl p-4 space-y-2 md:col-span-1">
                      <div className="flex items-center gap-2 text-rose-900 text-xs font-extrabold uppercase tracking-wide">
                        <div className="p-1.5 bg-rose-100 text-rose-700 rounded-lg">
                          <Target className="w-4 h-4" />
                        </div>
                        <span>Objectif Stratégique Globale</span>
                      </div>
                      {isEditingStrategy ? (
                        <textarea
                          value={projCoreGoal}
                          onChange={(e) => setProjCoreGoal(e.target.value)}
                          placeholder="Ex: Développer une audience qualifiée et générer 100k€ de CA..."
                          rows={3}
                          className="w-full text-xs font-medium text-neutral-800 bg-white border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-rose-500"
                        />
                      ) : (
                        <p className="text-xs text-neutral-700 font-medium leading-relaxed bg-white/60 p-3 rounded-xl border border-neutral-100 min-h-[80px]">
                          {selectedFolder.coreGoal || <span className="text-neutral-400 italic">Aucun objectif stratégique défini.</span>}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 3. Detailed Business Targets & Sales Metrics Section */}
                  <div className="space-y-4 pt-2 border-t border-neutral-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-black text-neutral-900 uppercase">
                        <Coins className="w-4 h-4 text-emerald-600" />
                        <span>Objectifs Chiffrés de Monétisation & Ventes</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-400">
                        Suivi dynamique des conversions
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      
                      {/* KPI 1: Abonnés Payants / Subscribers */}
                      <div className="bg-gradient-to-br from-indigo-50/50 to-neutral-50 border border-indigo-100 p-4 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-950 uppercase">
                            <Users className="w-4 h-4 text-indigo-600" />
                            <span>Abonnés Payants</span>
                          </div>
                          {!isEditingStrategy && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleQuickUpdateKPI("currentPayingSubscribers", -1)}
                                className="w-5 h-5 bg-white border border-neutral-200 text-neutral-600 hover:text-indigo-600 rounded flex items-center justify-center font-black cursor-pointer"
                              >
                                -
                              </button>
                              <button
                                onClick={() => handleQuickUpdateKPI("currentPayingSubscribers", 1)}
                                className="w-5 h-5 bg-indigo-600 text-white rounded flex items-center justify-center font-black hover:bg-indigo-500 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>

                        {isEditingStrategy ? (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <label className="text-[9px] font-bold text-neutral-400 uppercase">Actuel</label>
                              <input
                                type="number"
                                value={currentSubscribers}
                                onChange={(e) => setCurrentSubscribers(e.target.value)}
                                placeholder="0"
                                className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-neutral-400 uppercase">Cible</label>
                              <input
                                type="number"
                                value={targetSubscribers}
                                onChange={(e) => setTargetSubscribers(e.target.value)}
                                placeholder="100"
                                className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-baseline">
                              <span className="text-xl font-black font-mono text-neutral-900">
                                {selectedFolder.businessKPIs?.currentPayingSubscribers || 0}
                              </span>
                              <span className="text-xs font-extrabold font-mono text-neutral-400">
                                / {selectedFolder.businessKPIs?.targetPayingSubscribers || 0} abonnés
                              </span>
                            </div>

                            {/* Progress bar */}
                            {(() => {
                              const curr = selectedFolder.businessKPIs?.currentPayingSubscribers || 0;
                              const tgt = selectedFolder.businessKPIs?.targetPayingSubscribers || 1;
                              const pct = Math.min(100, Math.round((curr / (tgt || 1)) * 100));
                              return (
                                <div className="space-y-1">
                                  <div className="h-2 w-full bg-indigo-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                                  </div>
                                  <span className="text-[9.5px] font-bold font-mono text-indigo-700 block text-right">
                                    {pct}% de l'objectif atteint
                                  </span>
                                </div>
                              );
                            })()}
                          </>
                        )}
                      </div>

                      {/* KPI 2: Produits Vendus / Digital Products */}
                      <div className="bg-gradient-to-br from-amber-50/50 to-neutral-50 border border-amber-100 p-4 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-extrabold text-amber-950 uppercase">
                            <ShoppingBag className="w-4 h-4 text-amber-600" />
                            <span>Produits Numériques Vendus</span>
                          </div>
                          {!isEditingStrategy && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleQuickUpdateKPI("currentProductsSold", -1)}
                                className="w-5 h-5 bg-white border border-neutral-200 text-neutral-600 hover:text-amber-600 rounded flex items-center justify-center font-black cursor-pointer"
                              >
                                -
                              </button>
                              <button
                                onClick={() => handleQuickUpdateKPI("currentProductsSold", 1)}
                                className="w-5 h-5 bg-amber-600 text-white rounded flex items-center justify-center font-black hover:bg-amber-500 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>

                        {isEditingStrategy ? (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <label className="text-[9px] font-bold text-neutral-400 uppercase">Actuel</label>
                              <input
                                type="number"
                                value={currentProducts}
                                onChange={(e) => setCurrentProducts(e.target.value)}
                                placeholder="0"
                                className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-neutral-400 uppercase">Cible</label>
                              <input
                                type="number"
                                value={targetProducts}
                                onChange={(e) => setTargetProducts(e.target.value)}
                                placeholder="50"
                                className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-baseline">
                              <span className="text-xl font-black font-mono text-neutral-900">
                                {selectedFolder.businessKPIs?.currentProductsSold || 0}
                              </span>
                              <span className="text-xs font-extrabold font-mono text-neutral-400">
                                / {selectedFolder.businessKPIs?.targetProductsSold || 0} ventes
                              </span>
                            </div>

                            {(() => {
                              const curr = selectedFolder.businessKPIs?.currentProductsSold || 0;
                              const tgt = selectedFolder.businessKPIs?.targetProductsSold || 1;
                              const pct = Math.min(100, Math.round((curr / (tgt || 1)) * 100));
                              return (
                                <div className="space-y-1">
                                  <div className="h-2 w-full bg-amber-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-amber-600 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                                  </div>
                                  <span className="text-[9.5px] font-bold font-mono text-amber-700 block text-right">
                                    {pct}% de l'objectif atteint
                                  </span>
                                </div>
                              );
                            })()}
                          </>
                        )}
                      </div>

                      {/* KPI 3: Formations Vendues / Inscriptions */}
                      <div className="bg-gradient-to-br from-emerald-50/50 to-neutral-50 border border-emerald-100 p-4 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-950 uppercase">
                            <GraduationCap className="w-4 h-4 text-emerald-600" />
                            <span>Formations & Inscriptions</span>
                          </div>
                          {!isEditingStrategy && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleQuickUpdateKPI("currentFormationsSold", -1)}
                                className="w-5 h-5 bg-white border border-neutral-200 text-neutral-600 hover:text-emerald-600 rounded flex items-center justify-center font-black cursor-pointer"
                              >
                                -
                              </button>
                              <button
                                onClick={() => handleQuickUpdateKPI("currentFormationsSold", 1)}
                                className="w-5 h-5 bg-emerald-600 text-white rounded flex items-center justify-center font-black hover:bg-emerald-500 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>

                        {isEditingStrategy ? (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <label className="text-[9px] font-bold text-neutral-400 uppercase">Actuel</label>
                              <input
                                type="number"
                                value={currentFormations}
                                onChange={(e) => setCurrentFormations(e.target.value)}
                                placeholder="0"
                                className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-neutral-400 uppercase">Cible</label>
                              <input
                                type="number"
                                value={targetFormations}
                                onChange={(e) => setTargetFormations(e.target.value)}
                                placeholder="30"
                                className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-baseline">
                              <span className="text-xl font-black font-mono text-neutral-900">
                                {selectedFolder.businessKPIs?.currentFormationsSold || 0}
                              </span>
                              <span className="text-xs font-extrabold font-mono text-neutral-400">
                                / {selectedFolder.businessKPIs?.targetFormationsSold || 0} inscrits
                              </span>
                            </div>

                            {(() => {
                              const curr = selectedFolder.businessKPIs?.currentFormationsSold || 0;
                              const tgt = selectedFolder.businessKPIs?.targetFormationsSold || 1;
                              const pct = Math.min(100, Math.round((curr / (tgt || 1)) * 100));
                              return (
                                <div className="space-y-1">
                                  <div className="h-2 w-full bg-emerald-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-600 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                                  </div>
                                  <span className="text-[9.5px] font-bold font-mono text-emerald-700 block text-right">
                                    {pct}% de l'objectif atteint
                                  </span>
                                </div>
                              );
                            })()}
                          </>
                        )}
                      </div>

                      {/* KPI 4: Accompagnement / Coaching */}
                      <div className="bg-gradient-to-br from-rose-50/50 to-neutral-50 border border-rose-100 p-4 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-extrabold text-rose-950 uppercase">
                            <UserCheck className="w-4 h-4 text-rose-600" />
                            <span>Accompagnement / Coaching</span>
                          </div>
                          {!isEditingStrategy && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleQuickUpdateKPI("currentCoachingSold", -1)}
                                className="w-5 h-5 bg-white border border-neutral-200 text-neutral-600 hover:text-rose-600 rounded flex items-center justify-center font-black cursor-pointer"
                              >
                                -
                              </button>
                              <button
                                onClick={() => handleQuickUpdateKPI("currentCoachingSold", 1)}
                                className="w-5 h-5 bg-rose-600 text-white rounded flex items-center justify-center font-black hover:bg-rose-500 cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>

                        {isEditingStrategy ? (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <label className="text-[9px] font-bold text-neutral-400 uppercase">Actuel</label>
                              <input
                                type="number"
                                value={currentCoaching}
                                onChange={(e) => setCurrentCoaching(e.target.value)}
                                placeholder="0"
                                className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-neutral-400 uppercase">Cible</label>
                              <input
                                type="number"
                                value={targetCoaching}
                                onChange={(e) => setTargetCoaching(e.target.value)}
                                placeholder="10"
                                className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-baseline">
                              <span className="text-xl font-black font-mono text-neutral-900">
                                {selectedFolder.businessKPIs?.currentCoachingSold || 0}
                              </span>
                              <span className="text-xs font-extrabold font-mono text-neutral-400">
                                / {selectedFolder.businessKPIs?.targetCoachingSold || 0} clients
                              </span>
                            </div>

                            {(() => {
                              const curr = selectedFolder.businessKPIs?.currentCoachingSold || 0;
                              const tgt = selectedFolder.businessKPIs?.targetCoachingSold || 1;
                              const pct = Math.min(100, Math.round((curr / (tgt || 1)) * 100));
                              return (
                                <div className="space-y-1">
                                  <div className="h-2 w-full bg-rose-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-rose-600 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                                  </div>
                                  <span className="text-[9.5px] font-bold font-mono text-rose-700 block text-right">
                                    {pct}% de l'objectif atteint
                                  </span>
                                </div>
                              );
                            })()}
                          </>
                        )}
                      </div>

                      {/* KPI 5: Revenue AdSense & Média */}
                      <div className="bg-gradient-to-br from-red-50/50 to-neutral-50 border border-red-100 p-4 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-extrabold text-red-950 uppercase">
                            <Video className="w-4 h-4 text-red-600" />
                            <span>Revenus AdSense & Pub</span>
                          </div>
                          {!isEditingStrategy && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => handleQuickUpdateKPI("currentAdsenseRevenue", -500)}
                                className="w-5 h-5 bg-white border border-neutral-200 text-neutral-600 hover:text-red-600 rounded flex items-center justify-center font-black cursor-pointer text-[10px]"
                              >
                                -
                              </button>
                              <button
                                onClick={() => handleQuickUpdateKPI("currentAdsenseRevenue", 500)}
                                className="w-5 h-5 bg-red-600 text-white rounded flex items-center justify-center font-black hover:bg-red-500 cursor-pointer text-[10px]"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>

                        {isEditingStrategy ? (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <label className="text-[9px] font-bold text-neutral-400 uppercase">Actuel (€/MAD)</label>
                              <input
                                type="number"
                                value={currentAdsense}
                                onChange={(e) => setCurrentAdsense(e.target.value)}
                                placeholder="0"
                                className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-neutral-400 uppercase">Cible (€/MAD)</label>
                              <input
                                type="number"
                                value={targetAdsense}
                                onChange={(e) => setTargetAdsense(e.target.value)}
                                placeholder="10000"
                                className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-baseline">
                              <span className="text-xl font-black font-mono text-neutral-900">
                                {(selectedFolder.businessKPIs?.currentAdsenseRevenue || 0).toLocaleString()}
                              </span>
                              <span className="text-xs font-extrabold font-mono text-neutral-400">
                                / {(selectedFolder.businessKPIs?.targetAdsenseRevenue || 0).toLocaleString()} MAD/€
                              </span>
                            </div>

                            {(() => {
                              const curr = selectedFolder.businessKPIs?.currentAdsenseRevenue || 0;
                              const tgt = selectedFolder.businessKPIs?.targetAdsenseRevenue || 1;
                              const pct = Math.min(100, Math.round((curr / (tgt || 1)) * 100));
                              return (
                                <div className="space-y-1">
                                  <div className="h-2 w-full bg-red-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-600 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                                  </div>
                                  <span className="text-[9.5px] font-bold font-mono text-red-700 block text-right">
                                    {pct}% de l'objectif atteint
                                  </span>
                                </div>
                              );
                            })()}
                          </>
                        )}
                      </div>

                      {/* KPI 6: Chiffre d'Affaires Global Projet */}
                      <div className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-indigo-950 text-white border border-neutral-800 p-4 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 uppercase">
                            <TrendingUp className="w-4 h-4 text-emerald-400" />
                            <span>Chiffre d'Affaires Total</span>
                          </div>
                        </div>

                        {isEditingStrategy ? (
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <label className="text-[9px] font-bold text-neutral-400 uppercase">Généré Actuel</label>
                              <input
                                type="number"
                                value={currentCustomRev}
                                onChange={(e) => setCurrentCustomRev(e.target.value)}
                                placeholder="0"
                                className="w-full p-2 bg-neutral-800 border border-neutral-700 text-white rounded-lg text-xs font-mono font-bold"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-neutral-400 uppercase">Objectif Cible</label>
                              <input
                                type="number"
                                value={targetCustomRev}
                                onChange={(e) => setTargetCustomRev(e.target.value)}
                                placeholder="50000"
                                className="w-full p-2 bg-neutral-800 border border-neutral-700 text-white rounded-lg text-xs font-mono font-bold"
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="flex justify-between items-baseline">
                              <span className="text-xl font-black font-mono text-emerald-400">
                                {(selectedFolder.businessKPIs?.currentCustomRevenue || 0).toLocaleString()}
                              </span>
                              <span className="text-xs font-extrabold font-mono text-neutral-400">
                                / {(selectedFolder.businessKPIs?.targetCustomRevenue || 0).toLocaleString()} MAD/€
                              </span>
                            </div>

                            {(() => {
                              const curr = selectedFolder.businessKPIs?.currentCustomRevenue || 0;
                              const tgt = selectedFolder.businessKPIs?.targetCustomRevenue || 1;
                              const pct = Math.min(100, Math.round((curr / (tgt || 1)) * 100));
                              return (
                                <div className="space-y-1">
                                  <div className="h-2 w-full bg-neutral-800 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                                  </div>
                                  <span className="text-[9.5px] font-bold font-mono text-emerald-400 block text-right">
                                    {pct}% accompli
                                  </span>
                                </div>
                              );
                            })()}
                          </>
                        )}
                      </div>

                    </div>
                  </div>

                  {/* 4. Custom Additional KPIs */}
                  <div className="space-y-3 pt-4 border-t border-neutral-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-black text-neutral-900 uppercase">
                        <BarChart3 className="w-4 h-4 text-indigo-600" />
                        <span>KPIs Personnalisés Spécifiques au Projet</span>
                      </div>
                    </div>

                    {/* Add custom KPI form */}
                    <form onSubmit={handleAddCustomKPI} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-200/60">
                      <div className="sm:col-span-4">
                        <input
                          type="text"
                          value={newCustomKPILabel}
                          onChange={(e) => setNewCustomKPILabel(e.target.value)}
                          placeholder="Nom du KPI (ex: Partenariats B2B...)"
                          className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-lg p-2 text-neutral-800"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={newCustomKPICurrent}
                          onChange={(e) => setNewCustomKPICurrent(e.target.value)}
                          placeholder="Actuel (ex: 2)"
                          className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-lg p-2 text-neutral-800 font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={newCustomKPITarget}
                          onChange={(e) => setNewCustomKPITarget(e.target.value)}
                          placeholder="Cible (ex: 5)"
                          className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-lg p-2 text-neutral-800 font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={newCustomKPIUnit}
                          onChange={(e) => setNewCustomKPIUnit(e.target.value)}
                          placeholder="Unité (ex: marques, %)"
                          className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-lg p-2 text-neutral-800 font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <button
                          type="submit"
                          className="w-full bg-neutral-900 hover:bg-neutral-800 text-white p-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ajouter</span>
                        </button>
                      </div>
                    </form>

                    {/* Custom KPIs List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {customKPIList.map((kpi) => {
                        const currNum = parseFloat(kpi.current) || 0;
                        const tgtNum = parseFloat(kpi.target) || 1;
                        const pct = Math.min(100, Math.round((currNum / (tgtNum || 1)) * 100));
                        return (
                          <div key={kpi.id} className="bg-white border border-neutral-200/90 p-3 rounded-xl flex flex-col justify-between space-y-2 shadow-2xs">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-neutral-900">{kpi.label}</span>
                              <button
                                onClick={() => handleDeleteCustomKPI(kpi.id)}
                                className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex justify-between items-baseline font-mono text-xs">
                              <span className="font-black text-indigo-600">{kpi.current} {kpi.unit}</span>
                              <span className="text-neutral-400">/ {kpi.target} {kpi.unit}</span>
                            </div>

                            <div className="h-1.5 w-full bg-neutral-100 rounded-full overflow-hidden">
                              <div className="h-full bg-indigo-600 rounded-full transition-all duration-300" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}

                      {customKPIList.length === 0 && (
                        <div className="sm:col-span-2 text-center py-4 text-neutral-400 text-xs italic bg-neutral-50/50 rounded-xl border border-dashed border-neutral-200">
                          Aucun KPI sur mesure ajouté pour l'instant. Créez-en un ci-dessus si besoin !
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 5. Direct Project Objectives Array (objectives: { title, targetValue, currentValue, unit }[]) */}
                  <div className="space-y-4 pt-4 border-t border-neutral-200/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-black text-neutral-900 uppercase">
                        <Target className="w-4 h-4 text-emerald-600" />
                        <span>Objectifs KPIs Structurés (Champ objectives)</span>
                      </div>
                      <span className="text-[10px] font-mono text-neutral-500">
                        {selectedFolder.objectives?.length || 0} objectif(s) actif(s)
                      </span>
                    </div>

                    {/* Add Objective Item Form */}
                    <form onSubmit={handleAddObjectiveItem} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-emerald-50/40 p-3 rounded-xl border border-emerald-200/60">
                      <div className="sm:col-span-4">
                        <label className="text-[9px] font-bold text-emerald-900 uppercase block mb-1">Titre de l'Objectif / KPI</label>
                        <input
                          type="text"
                          value={newObjTitle}
                          onChange={(e) => setNewObjTitle(e.target.value)}
                          placeholder="ex: Abonnés YouTube, Ventes..."
                          className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-lg p-2 text-neutral-800"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[9px] font-bold text-emerald-900 uppercase block mb-1">Actuel</label>
                        <input
                          type="number"
                          value={newObjCurrent}
                          onChange={(e) => setNewObjCurrent(e.target.value)}
                          placeholder="ex: 3450"
                          className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-lg p-2 font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[9px] font-bold text-emerald-900 uppercase block mb-1">Cible</label>
                        <input
                          type="number"
                          value={newObjTarget}
                          onChange={(e) => setNewObjTarget(e.target.value)}
                          placeholder="ex: 10000"
                          className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-lg p-2 font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-[9px] font-bold text-emerald-900 uppercase block mb-1">Unité</label>
                        <input
                          type="text"
                          value={newObjUnit}
                          onChange={(e) => setNewObjUnit(e.target.value)}
                          placeholder="ex: abonnés, MAD..."
                          className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-lg p-2"
                        />
                      </div>
                      <div className="sm:col-span-2 flex items-end">
                        <button
                          type="submit"
                          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white p-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ajouter</span>
                        </button>
                      </div>
                    </form>

                    {/* Objectives Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(selectedFolder.objectives || []).map((obj, idx) => {
                        const tgt = obj.targetValue || 1;
                        const curr = obj.currentValue || 0;
                        const pct = Math.min(100, Math.round((curr / tgt) * 100));

                        return (
                          <div key={idx} className="bg-white border border-neutral-200/90 p-3.5 rounded-2xl space-y-2.5 shadow-2xs">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-extrabold text-neutral-900 truncate">{obj.title}</span>
                              <button
                                onClick={() => handleDeleteObjectiveItem(idx)}
                                title="Supprimer cet objectif"
                                className="text-neutral-300 hover:text-rose-600 transition-colors p-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex justify-between items-baseline font-mono text-xs">
                              <div className="flex items-baseline gap-1">
                                <span className="text-lg font-black text-emerald-700">{curr.toLocaleString()}</span>
                                <span className="text-xs font-bold text-neutral-500">{obj.unit}</span>
                              </div>
                              <div className="text-neutral-400 font-bold text-[11px]">
                                Cible : {tgt.toLocaleString()} {obj.unit}
                              </div>
                            </div>

                            <div className="space-y-1">
                              <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <div className="flex justify-between items-center text-[10px]">
                                <span className="font-bold text-emerald-800">{pct}% réalisé</span>
                                <div className="flex items-center gap-1">
                                  <button
                                    onClick={() => handleQuickUpdateObjCurrent(idx, -1)}
                                    className="px-1.5 py-0.5 bg-neutral-100 hover:bg-neutral-200 rounded font-mono font-bold text-neutral-700 cursor-pointer"
                                    title="-1"
                                  >
                                    -1
                                  </button>
                                  <button
                                    onClick={() => handleQuickUpdateObjCurrent(idx, 1)}
                                    className="px-1.5 py-0.5 bg-emerald-100 hover:bg-emerald-200 rounded font-mono font-bold text-emerald-800 cursor-pointer"
                                    title="+1"
                                  >
                                    +1
                                  </button>
                                  <button
                                    onClick={() => handleQuickUpdateObjCurrent(idx, 10)}
                                    className="px-1.5 py-0.5 bg-emerald-200 hover:bg-emerald-300 rounded font-mono font-bold text-emerald-900 cursor-pointer"
                                    title="+10"
                                  >
                                    +10
                                  </button>
                                </div>
                              </div>
                            </div>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedObjHistoryIdx(idx);
                                setHistLogValue(String(curr));
                              }}
                              className="w-full mt-2 py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer font-mono"
                            >
                              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Historique & Graphique ({obj.history?.length || 0} relevés)</span>
                            </button>
                          </div>
                        );
                      })}

                      {(!selectedFolder.objectives || selectedFolder.objectives.length === 0) && (
                        <div className="sm:col-span-2 text-center py-5 text-neutral-400 text-xs italic bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200">
                          Aucun objectif KPI défini dans <code className="font-mono text-[10px] text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">objectives</code> pour ce projet. Utilisez le formulaire ci-dessus pour en ajouter.
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* Tab 1.8: TOPICS TO COVER (SUJETS À TRAITER) */}
              {activeTab === "topics" && (
                <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 space-y-5 animate-in fade-in duration-300 font-sans">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                    <div>
                      <h4 className="text-xs font-black text-neutral-900 uppercase flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        <span>Sujets & Thématiques à traiter (Content Backlog)</span>
                      </h4>
                      <p className="text-[10.5px] text-neutral-400 mt-0.5">
                        Acheminez vos idées de sujets, épisodes, vidéos ou modules de cours selon leur état d'avancement.
                      </p>
                    </div>

                    {/* Filter status pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {(["Tous", "À traiter", "En rédaction", "Tourné", "Publié", "Idée"] as const).map(status => (
                        <button
                          key={status}
                          onClick={() => setTopicStatusFilter(status)}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase font-mono transition-all cursor-pointer ${
                            topicStatusFilter === status
                              ? "bg-neutral-900 text-white shadow-2xs"
                              : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                          }`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Form to add new topic */}
                  <form onSubmit={handleAddTopicToCover} className="bg-neutral-50/80 border border-neutral-200/80 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center gap-2 text-xs font-extrabold text-neutral-900 uppercase">
                      <Plus className="w-4 h-4 text-indigo-600" />
                      <span>Ajouter un nouveau sujet / thème</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          value={newTopicTitle}
                          onChange={(e) => setNewTopicTitle(e.target.value)}
                          placeholder="Titre du sujet, étude de cas ou module..."
                          className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-neutral-800"
                          required
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <select
                          value={newTopicCategory}
                          onChange={(e) => setNewTopicCategory(e.target.value)}
                          className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden text-neutral-800"
                        >
                          <option value="Tutoriel">Tutoriel</option>
                          <option value="Étude de cas">Étude de cas</option>
                          <option value="Stratégie">Stratégie</option>
                          <option value="Avis / Analyse">Avis / Analyse</option>
                          <option value="Mindset">Mindset</option>
                          <option value="Module Formation">Module Formation</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <select
                          value={newTopicFormat}
                          onChange={(e) => setNewTopicFormat(e.target.value as TopicToCover["targetFormat"])}
                          className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden text-neutral-800"
                        >
                          <option value="Vidéo YouTube">Vidéo YouTube</option>
                          <option value="Short / Reel">Short / Reel</option>
                          <option value="Module Formation">Module Formation</option>
                          <option value="Post LinkedIn">Post LinkedIn</option>
                          <option value="Newsletter">Newsletter</option>
                          <option value="Autre">Autre</option>
                        </select>
                      </div>

                      <div className="sm:col-span-3">
                        <select
                          value={newTopicStatus}
                          onChange={(e) => setNewTopicStatus(e.target.value as TopicToCover["status"])}
                          className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden text-neutral-800"
                        >
                          <option value="À traiter">À traiter</option>
                          <option value="En rédaction">En rédaction</option>
                          <option value="Tourné">Tourné</option>
                          <option value="Publié">Publié</option>
                          <option value="Idée">Idée</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2.5 items-center">
                      <input
                        type="text"
                        value={newTopicNotes}
                        onChange={(e) => setNewTopicNotes(e.target.value)}
                        placeholder="Notes / Angle d'attaque / Ressources requises (optionnel)..."
                        className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden text-neutral-800 flex-1"
                      />
                      <button
                        type="submit"
                        className="w-full sm:w-auto bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Ajouter le sujet</span>
                      </button>
                    </div>
                  </form>

                  {/* Topics List */}
                  <div className="space-y-2.5">
                    {((selectedFolder.topicsToCover || []).filter(t => topicStatusFilter === "Tous" || t.status === topicStatusFilter)).map(topic => {
                      const isEditing = editingTopicId === topic.id;

                      const statusBadgeStyle = {
                        "Idée": "bg-neutral-100 text-neutral-600 border-neutral-200",
                        "À traiter": "bg-amber-100 text-amber-800 border-amber-200",
                        "En rédaction": "bg-sky-100 text-sky-800 border-sky-200",
                        "Tourné": "bg-indigo-100 text-indigo-800 border-indigo-200",
                        "Publié": "bg-emerald-100 text-emerald-800 border-emerald-200"
                      }[topic.status] || "bg-neutral-100 text-neutral-600 border-neutral-200";

                      if (isEditing) {
                        return (
                          <div key={topic.id} className="p-3.5 bg-neutral-50 border border-indigo-300 rounded-2xl space-y-3 font-sans">
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                              <input
                                type="text"
                                value={editTopicTitle}
                                onChange={(e) => setEditTopicTitle(e.target.value)}
                                className="sm:col-span-6 text-xs font-bold bg-white border border-neutral-200 rounded-lg p-2 text-neutral-900"
                              />
                              <select
                                value={editTopicStatus}
                                onChange={(e) => setEditTopicStatus(e.target.value as TopicToCover["status"])}
                                className="sm:col-span-3 text-xs font-semibold bg-white border border-neutral-200 rounded-lg p-2 text-neutral-800"
                              >
                                <option value="Idée">Idée</option>
                                <option value="À traiter">À traiter</option>
                                <option value="En rédaction">En rédaction</option>
                                <option value="Tourné">Tourné</option>
                                <option value="Publié">Publié</option>
                              </select>
                              <select
                                value={editTopicFormat}
                                onChange={(e) => setEditTopicFormat(e.target.value as TopicToCover["targetFormat"])}
                                className="sm:col-span-3 text-xs font-semibold bg-white border border-neutral-200 rounded-lg p-2 text-neutral-800"
                              >
                                <option value="Vidéo YouTube">Vidéo YouTube</option>
                                <option value="Short / Reel">Short / Reel</option>
                                <option value="Module Formation">Module Formation</option>
                                <option value="Post LinkedIn">Post LinkedIn</option>
                                <option value="Newsletter">Newsletter</option>
                                <option value="Autre">Autre</option>
                              </select>
                            </div>
                            <input
                              type="text"
                              value={editTopicNotes}
                              onChange={(e) => setEditTopicNotes(e.target.value)}
                              placeholder="Notes..."
                              className="w-full text-xs bg-white border border-neutral-200 rounded-lg p-2 text-neutral-800"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setEditingTopicId(null)}
                                className="px-3 py-1 bg-neutral-200 text-neutral-800 rounded-lg text-xs font-bold cursor-pointer"
                              >
                                Annuler
                              </button>
                              <button
                                onClick={() => handleSaveEditTopic(topic.id)}
                                className="px-3 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                              >
                                Enregistrer
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={topic.id}
                          className="p-3.5 bg-neutral-50/50 hover:bg-white border border-neutral-200/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all font-sans"
                        >
                          <div className="space-y-1">
                            <div className="flex flex-wrap items-center gap-2">
                              {/* Status badge button (click to cycle) */}
                              <button
                                onClick={() => handleToggleTopicStatus(topic.id)}
                                className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border font-mono cursor-pointer transition-transform active:scale-95 ${statusBadgeStyle}`}
                                title="Cliquer pour faire avancer le statut"
                              >
                                {topic.status}
                              </button>

                              <span className="text-[10px] font-extrabold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-md">
                                {topic.category || "Général"}
                              </span>

                              <span className="text-[10px] font-mono text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md">
                                {topic.targetFormat}
                              </span>
                            </div>

                            <h5 className="text-xs font-bold text-neutral-900 leading-snug">
                              {topic.title}
                            </h5>

                            {topic.notes && (
                              <p className="text-[11px] text-neutral-500 font-medium">
                                📝 {topic.notes}
                              </p>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                            <button
                              onClick={() => handleStartEditTopic(topic)}
                              className="p-1.5 text-neutral-400 hover:text-indigo-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                              title="Modifier"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteTopicToCover(topic.id)}
                              className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                              title="Supprimer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {(!selectedFolder.topicsToCover || selectedFolder.topicsToCover.length === 0) && (
                      <div className="text-center py-10 bg-neutral-50/50 border border-dashed border-neutral-200 rounded-2xl text-neutral-400 text-xs italic">
                        Aucun sujet ou thème enregistré dans ce backlog. Ajoutez votre premier sujet ci-dessus !
                      </div>
                    )}
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
                  <form onSubmit={handleAddCustomObjective} className="flex flex-col sm:flex-row gap-2 bg-neutral-50 p-2.5 rounded-2xl border border-neutral-200/80">
                    <input
                      type="text"
                      value={newCustomObjectiveText}
                      onChange={(e) => setNewCustomObjectiveText(e.target.value)}
                      placeholder="Ajouter un nouveau jalon spécifique à ce projet (ex: Enregistrer l'épisode 1)..."
                      className="flex-1 text-xs font-medium bg-transparent border-0 focus:outline-none focus:ring-0 text-neutral-800 px-2 py-1"
                    />
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-xl px-2.5 py-1 shadow-2xs">
                        <CalendarDays className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <input
                          type="date"
                          value={newCustomObjectiveDueDate}
                          onChange={(e) => setNewCustomObjectiveDueDate(e.target.value)}
                          className="text-xs font-bold bg-transparent border-0 focus:outline-none text-neutral-800 cursor-pointer"
                          title="Date limite / Échéance du jalon"
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-neutral-900 hover:bg-neutral-800 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer select-none shrink-0"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Ajouter</span>
                      </button>
                    </div>
                  </form>

                  {/* Combined List of Objectives */}
                  <div className="space-y-4">
                    
                    {/* Structured Project Objectives with History & Trend Charts */}
                    {selectedFolder.objectives && selectedFolder.objectives.length > 0 && (
                      <div className="space-y-2.5 pb-3 border-b border-neutral-100">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block font-sans">
                            Objectifs KPIs Structurés & Suivi Hebdomadaire ({selectedFolder.objectives.length})
                          </span>
                          <span className="text-[10px] text-emerald-700 font-mono font-bold">
                            Tendance & Relevés Hebdomadaires
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {selectedFolder.objectives.map((obj, idx) => {
                            const tgt = obj.targetValue || 1;
                            const curr = obj.currentValue || 0;
                            const pct = Math.min(100, Math.round((curr / tgt) * 100));

                            return (
                              <div key={idx} className="bg-neutral-50/80 border border-neutral-200/90 p-3.5 rounded-2xl space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-extrabold text-neutral-900 truncate">{obj.title}</span>
                                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold rounded-full">
                                    {pct}%
                                  </span>
                                </div>

                                <div className="flex justify-between items-baseline font-mono text-xs">
                                  <div className="flex items-baseline gap-1">
                                    <span className="text-base font-black text-emerald-700">{curr.toLocaleString()}</span>
                                    <span className="text-xs font-bold text-neutral-500">{obj.unit}</span>
                                  </div>
                                  <div className="text-neutral-400 font-bold text-[10.5px]">
                                    Cible : {tgt.toLocaleString()} {obj.unit}
                                  </div>
                                </div>

                                <div className="h-1.5 w-full bg-neutral-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setSelectedObjHistoryIdx(idx);
                                    setHistLogValue(String(curr));
                                  }}
                                  className="w-full mt-1.5 py-1.5 px-3 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer font-mono shadow-2xs"
                                >
                                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>Historique & Tendance ({obj.history?.length || 0} relevés)</span>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

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
                            const isEditing = editingObjectiveId === o.id;

                            if (isEditing) {
                              return (
                                <div key={o.id} className="p-3 bg-indigo-50/50 border border-indigo-200 rounded-2xl space-y-2 animate-in fade-in duration-200">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800">
                                      Modifier l'objectif & la date cible
                                    </span>
                                  </div>
                                  <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                      type="text"
                                      value={editObjectiveText}
                                      onChange={(e) => setEditObjectiveText(e.target.value)}
                                      placeholder="Intitulé du jalon..."
                                      className="flex-1 bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-bold text-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <div className="flex items-center gap-1.5 bg-white border border-neutral-200 rounded-xl px-2.5 py-1">
                                      <CalendarDays className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                                      <input
                                        type="date"
                                        value={editObjectiveDueDate}
                                        onChange={(e) => setEditObjectiveDueDate(e.target.value)}
                                        className="text-xs font-bold bg-transparent border-0 focus:outline-none text-neutral-800 cursor-pointer"
                                      />
                                    </div>
                                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                                      <button
                                        type="button"
                                        onClick={() => handleSaveEditObjective(o.id)}
                                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                                      >
                                        <Check className="w-3.5 h-3.5" />
                                        <span>Enregistrer</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={handleCancelEditObjective}
                                        className="bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-700 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                                      >
                                        Annuler
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            return (
                              <div
                                key={o.id}
                                className={`p-3 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all ${
                                  o.completed 
                                    ? "bg-neutral-50 border-neutral-200/80 text-neutral-400" 
                                    : "bg-white border-neutral-200/80 text-neutral-800 shadow-2xs hover:border-neutral-300"
                                }`}
                              >
                                <div
                                  onClick={() => handleToggleCustomObjective(o.id)}
                                  className="flex items-center gap-3 cursor-pointer flex-1 select-none min-w-0"
                                >
                                  {o.completed ? (
                                    <CheckSquare className="w-4.5 h-4.5 text-emerald-600 shrink-0" />
                                  ) : (
                                    <Square className="w-4.5 h-4.5 text-neutral-400 shrink-0" />
                                  )}
                                  <span className={`text-xs font-semibold leading-tight ${o.completed ? "line-through text-neutral-400" : "text-neutral-900"}`}>
                                    {o.text}
                                  </span>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                  {o.dueDate ? (
                                    <span className="text-[10px] bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-bold font-mono px-2.5 py-1 rounded-lg border border-indigo-200/60 flex items-center gap-1.5">
                                      <CalendarDays className="w-3 h-3 text-indigo-500" />
                                      <span>{o.dueDate}</span>
                                    </span>
                                  ) : (
                                    <span className="text-[10px] text-neutral-400 italic">Sans date</span>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => handleStartEditObjective(o)}
                                    className="text-neutral-400 hover:text-indigo-600 transition-colors p-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer"
                                    title="Modifier le jalon et sa date d'objectif"
                                  >
                                    <Pencil className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCustomObjective(o.id)}
                                    className="text-neutral-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-neutral-100 cursor-pointer"
                                    title="Supprimer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
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

              {/* Tab 5: CALENDAR & CONTENT */}
              {activeTab === "calendar" && (
                <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 space-y-5 animate-in fade-in duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-100">
                    <div>
                      <h4 className="text-xs font-black text-neutral-900 uppercase">📅 Calendrier Éditorial & Contenus</h4>
                      <p className="text-[10.5px] text-neutral-400 mt-0.5">Vidéos, publications et événements planifiés directement rattachés à ce projet.</p>
                    </div>

                    <div className="flex gap-2">
                      {/* Associate existing event button */}
                      <div className="relative">
                        <button
                          onClick={() => setShowAssociateEvent(!showAssociateEvent)}
                          className="bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 text-neutral-800 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 cursor-pointer select-none"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Relier Publication Existante</span>
                        </button>

                        {/* Dropdown for associate events */}
                        {showAssociateEvent && (
                          <div className="absolute right-0 mt-2 w-72 bg-white border border-neutral-200 rounded-xl shadow-xl z-30 p-2 max-h-60 overflow-y-auto">
                            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block px-2 py-1.5 font-sans border-b border-neutral-100">
                              Sélectionner le contenu
                            </span>
                            {unassociatedEvents.length === 0 ? (
                              <span className="text-[10px] text-neutral-400 italic block p-3 text-center">Aucun autre contenu disponible.</span>
                            ) : (
                              <div className="space-y-1 mt-1 font-sans">
                                {unassociatedEvents.map(e => (
                                  <button
                                    key={e.id}
                                    onClick={() => handleAssociateEvent(e.id)}
                                    className="w-full text-left p-2 rounded-lg text-xs hover:bg-neutral-50 flex flex-col gap-0.5"
                                  >
                                    <span className="font-bold text-neutral-900 block line-clamp-1">{e.title}</span>
                                    <span className="text-[9px] text-neutral-400 font-mono block">
                                      {e.platform} • {e.scheduledDate} ({e.status})
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

                  {/* Add new event form directly in project folder context */}
                  <form onSubmit={handleAddProjectEvent} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-neutral-50 p-3 rounded-xl border border-neutral-200/60 font-sans">
                    <div className="sm:col-span-4">
                      <input
                        type="text"
                        value={newEventTitle}
                        onChange={(e) => setNewEventTitle(e.target.value)}
                        placeholder="Titre de la vidéo / post..."
                        className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-lg p-2 focus:outline-hidden text-neutral-800"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <input
                        type="date"
                        value={newEventDate}
                        onChange={(e) => setNewEventDate(e.target.value)}
                        className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-lg p-2 focus:outline-hidden text-neutral-800 font-mono"
                        required
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <select
                        value={newEventPlatform}
                        onChange={(e) => setNewEventPlatform(e.target.value)}
                        className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-lg p-2 focus:outline-hidden text-neutral-800"
                      >
                        <option value="YouTube">YouTube</option>
                        <option value="TikTok">TikTok</option>
                        <option value="Instagram">Instagram</option>
                        <option value="LinkedIn">LinkedIn</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <select
                        value={newEventContentType}
                        onChange={(e) => setNewEventContentType(e.target.value)}
                        className="w-full text-xs font-medium bg-white border border-neutral-200 rounded-lg p-2 focus:outline-hidden text-neutral-800"
                      >
                        <option value="Vidéo Longue">Vidéo Longue</option>
                        <option value="Short / Reel">Short / Reel</option>
                        <option value="Post Écrit">Post Écrit</option>
                        <option value="Podcast">Podcast</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <button
                        type="submit"
                        className="w-full bg-neutral-900 hover:bg-neutral-800 text-white p-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer select-none"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Créer</span>
                      </button>
                    </div>
                  </form>

                  {/* List of associated events */}
                  <div className="space-y-2.5">
                    {associatedEvents.map(evt => {
                      const statusColors = {
                        "Brouillon": "bg-neutral-100 text-neutral-600 border-neutral-200",
                        "En cours": "bg-blue-50 text-blue-700 border-blue-100",
                        "Planifié": "bg-indigo-50 text-indigo-700 border-indigo-100",
                        "Publié": "bg-emerald-50 text-emerald-700 border-emerald-100"
                      };

                      return (
                        <div
                          key={evt.id}
                          className="border border-neutral-100 bg-neutral-50/20 p-3.5 rounded-xl flex items-center justify-between gap-4 hover:border-neutral-200 hover:bg-white transition-all font-sans"
                        >
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                              <CalendarIcon className="w-4 h-4" />
                            </div>
                            <div className="space-y-0.5">
                              <h5 className="text-xs font-extrabold text-neutral-950">
                                {evt.title}
                              </h5>
                              <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-neutral-400">
                                <span className="font-semibold text-neutral-500 font-mono bg-neutral-100 px-1.5 py-0.2 rounded">
                                  {evt.platform}
                                </span>
                                <span>•</span>
                                <span className="font-mono">{evt.scheduledDate}</span>
                                <span>•</span>
                                <span className="italic">{evt.contentType}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border font-mono ${statusColors[evt.status] || "bg-neutral-50 text-neutral-500"}`}>
                              {evt.status}
                            </span>
                            <button
                              onClick={() => handleAssociateEvent(evt.id)}
                              className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                              title="Retirer du projet"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {associatedEvents.length === 0 && (
                      <div className="text-center py-10 text-neutral-400 italic text-xs">
                        Aucun contenu ou vidéo planifié pour ce projet. Reliez un contenu existant ou créez-en un nouveau ci-dessus !
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
            className="bg-white border border-neutral-200/80 rounded-3xl p-6 w-full max-w-xl shadow-2xl relative max-h-[90vh] overflow-y-auto"
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
                  rows={2}
                  className="w-full text-xs font-semibold bg-neutral-50/50 border border-neutral-200 rounded-xl p-3 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white transition-all text-neutral-800 resize-none"
                />
              </div>

              {/* Credentials & Access Section */}
              <div className="space-y-2 pt-2 border-t border-neutral-100 font-sans">
                <span className="text-[10px] font-black text-amber-900 uppercase tracking-widest block flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-amber-600" />
                  <span>Identifiants & Accès du Projet</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase flex items-center gap-1">
                      <Mail className="w-3 h-3 text-neutral-400" />
                      <span>Email du Projet</span>
                    </label>
                    <input
                      type="email"
                      value={projEmail}
                      onChange={(e) => setProjEmail(e.target.value)}
                      placeholder="projet@domaine.com"
                      className="w-full text-xs font-medium bg-neutral-50/50 border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase flex items-center gap-1">
                      <Lock className="w-3 h-3 text-neutral-400" />
                      <span>Mot de passe</span>
                    </label>
                    <input
                      type="text"
                      value={projPassword}
                      onChange={(e) => setProjPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full text-xs font-mono font-medium bg-neutral-50/50 border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Initial Resource Link & Initial Milestone (Creation only) */}
              {!editingProject && (
                <>
                  <div className="space-y-2 pt-2 border-t border-neutral-100 font-sans">
                    <span className="text-[10px] font-black text-sky-900 uppercase tracking-widest block flex items-center gap-1.5">
                      <Link2 className="w-3.5 h-3.5 text-sky-600" />
                      <span>Lien Utile Initial (Optionnel)</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={projInitialLinkTitle}
                        onChange={(e) => setProjInitialLinkTitle(e.target.value)}
                        placeholder="Titre (ex: Dashboard Analytics)"
                        className="w-full text-xs font-medium bg-neutral-50/50 border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-sky-500 focus:bg-white"
                      />
                      <input
                        type="text"
                        value={projInitialLinkUrl}
                        onChange={(e) => setProjInitialLinkUrl(e.target.value)}
                        placeholder="URL (ex: https://...)"
                        className="w-full text-xs font-medium bg-neutral-50/50 border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-sky-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-neutral-100 font-sans">
                    <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest block flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Premier Jalon / Objectif (Optionnel)</span>
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        value={projInitialObjectiveText}
                        onChange={(e) => setProjInitialObjectiveText(e.target.value)}
                        placeholder="ex: Lancer le premier module..."
                        className="sm:col-span-2 w-full text-xs font-medium bg-neutral-50/50 border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                      />
                      <input
                        type="date"
                        value={projInitialObjectiveDueDate}
                        onChange={(e) => setProjInitialObjectiveDueDate(e.target.value)}
                        className="w-full text-xs font-medium bg-neutral-50/50 border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Strategic Objectives & Business Targets fields */}
              <div className="space-y-3 pt-2 border-t border-neutral-100 font-sans">
                <span className="text-[10px] font-black text-indigo-900 uppercase tracking-widest block flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-indigo-600" />
                  <span>🎯 Fiche Technique, Orientation & Objectifs Business</span>
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase">
                      Phase & Statut du Projet
                    </label>
                    <select
                      value={projStatusPhaseModal}
                      onChange={(e) => setProjStatusPhaseModal(e.target.value as ProjectFolder["statusPhase"])}
                      className="w-full text-xs font-semibold bg-neutral-50/50 border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 text-neutral-800"
                    >
                      <option value="Idéation">Idéation</option>
                      <option value="Conception">Conception</option>
                      <option value="Prototypage & MVP">Prototypage & MVP</option>
                      <option value="Lancement">Lancement</option>
                      <option value="Croissance & Ventes">Croissance & Ventes</option>
                      <option value="Scalabilité & Maturité">Scalabilité & Maturité</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase">
                      Date de Lancement Prévue
                    </label>
                    <input
                      type="date"
                      value={projLaunchDateModal}
                      onChange={(e) => setProjLaunchDateModal(e.target.value)}
                      className="w-full text-xs font-medium bg-neutral-50/50 border border-neutral-200 rounded-xl p-2.5 font-mono focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase">
                      Budget & Investissement (€/MAD)
                    </label>
                    <input
                      type="number"
                      value={projBudgetModal}
                      onChange={(e) => setProjBudgetModal(e.target.value)}
                      placeholder="ex: 15000"
                      className="w-full text-xs font-medium bg-neutral-50/50 border border-neutral-200 rounded-xl p-2.5 font-mono focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-neutral-500 uppercase">
                      Stack Technique & Outils (séparés par des virgules)
                    </label>
                    <input
                      type="text"
                      value={projTechStackModal}
                      onChange={(e) => setProjTechStackModal(e.target.value)}
                      placeholder="ex: YouTube, Kajabi, Stripe, Premiere..."
                      className="w-full text-xs font-medium bg-neutral-50/50 border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase">
                    Proposition de Valeur Unique (UVP)
                  </label>
                  <input
                    type="text"
                    value={projValuePropModal}
                    onChange={(e) => setProjValuePropModal(e.target.value)}
                    placeholder="ex: Analyses de niveau fonds M&A rendues accessibles..."
                    className="w-full text-xs font-medium bg-neutral-50/50 border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase">
                    Audience Cible & Niche
                  </label>
                  <input
                    type="text"
                    value={projTargetAudienceModal}
                    onChange={(e) => setProjTargetAudienceModal(e.target.value)}
                    placeholder="ex: Étudiants en M&A, analystes Private Equity..."
                    className="w-full text-xs font-medium bg-neutral-50/50 border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-neutral-500 uppercase">
                    Objectif Stratégique Principal
                  </label>
                  <input
                    type="text"
                    value={projCoreGoalModal}
                    onChange={(e) => setProjCoreGoalModal(e.target.value)}
                    placeholder="ex: Se positionner comme la référence..."
                    className="w-full text-xs font-medium bg-neutral-50/50 border border-neutral-200 rounded-xl p-2.5 focus:outline-hidden focus:ring-1 focus:ring-indigo-500 focus:bg-white"
                  />
                </div>

                {/* Business Targets Grid inside Modal */}
                <div className="p-3 bg-neutral-50 border border-neutral-200/80 rounded-2xl space-y-2.5">
                  <span className="text-[9.5px] font-black text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
                    <Coins className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Cibles & Objectifs Chiffrés de Monétisation</span>
                  </span>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                    <div>
                      <label className="text-[8.5px] font-bold text-neutral-500 uppercase">Abonnés Payants</label>
                      <input
                        type="number"
                        value={targetSubscribersModal}
                        onChange={(e) => setTargetSubscribersModal(e.target.value)}
                        placeholder="Cible ex: 100"
                        className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[8.5px] font-bold text-neutral-500 uppercase">Produits Vendus</label>
                      <input
                        type="number"
                        value={targetProductsModal}
                        onChange={(e) => setTargetProductsModal(e.target.value)}
                        placeholder="Cible ex: 50"
                        className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[8.5px] font-bold text-neutral-500 uppercase">Formations Vendues</label>
                      <input
                        type="number"
                        value={targetFormationsModal}
                        onChange={(e) => setTargetFormationsModal(e.target.value)}
                        placeholder="Cible ex: 30"
                        className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[8.5px] font-bold text-neutral-500 uppercase">Coaching / Accomp.</label>
                      <input
                        type="number"
                        value={targetCoachingModal}
                        onChange={(e) => setTargetCoachingModal(e.target.value)}
                        placeholder="Cible ex: 10"
                        className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[8.5px] font-bold text-neutral-500 uppercase">AdSense (€/MAD)</label>
                      <input
                        type="number"
                        value={targetAdsenseModal}
                        onChange={(e) => setTargetAdsenseModal(e.target.value)}
                        placeholder="Cible ex: 10000"
                        className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>

                    <div>
                      <label className="text-[8.5px] font-bold text-neutral-500 uppercase">CA Total Cible</label>
                      <input
                        type="number"
                        value={targetCustomRevModal}
                        onChange={(e) => setTargetCustomRevModal(e.target.value)}
                        placeholder="Cible ex: 50000"
                        className="w-full p-2 bg-white border border-neutral-200 rounded-lg text-xs font-mono font-bold"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Archiving Toggle Checkbox */}
              <div className="pt-1">
                <label className="flex items-center gap-2.5 p-3 bg-neutral-50 border border-neutral-200/80 rounded-xl cursor-pointer hover:bg-neutral-100/60 transition-all">
                  <input
                    type="checkbox"
                    checked={projIsArchived}
                    onChange={(e) => setProjIsArchived(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-neutral-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-800">
                    <Archive className="w-3.5 h-3.5 text-amber-600" />
                    <span>Archiver ce projet (masquer de la vue principale)</span>
                  </div>
                </label>
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

      {/* Objective Weekly History & Trend Chart Modal */}
      {selectedObjHistoryIdx !== null && selectedFolder && selectedFolder.objectives && selectedFolder.objectives[selectedObjHistoryIdx] && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-neutral-200 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-5 sm:p-6 space-y-5 text-neutral-900 font-sans">
            
            {(() => {
              const objIdx = selectedObjHistoryIdx;
              const activeObj = selectedFolder.objectives[objIdx];
              const historyList = [...(activeObj.history || [])].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
              
              const curr = activeObj.currentValue || 0;
              const tgt = activeObj.targetValue || 1;
              const pct = Math.min(100, Math.round((curr / tgt) * 100));

              // Stats calculation
              const firstVal = historyList.length > 0 ? historyList[0].value : curr;
              const latestVal = curr;
              const totalDelta = latestVal - firstVal;
              const totalPctChange = firstVal > 0 ? Math.round(((latestVal - firstVal) / firstVal) * 100) : 0;
              const weeksCount = Math.max(1, historyList.length);
              const avgWeeklyVelocity = Math.round(totalDelta / weeksCount);
              const remainingToTarget = Math.max(0, tgt - curr);
              const estimatedWeeksRemaining = avgWeeklyVelocity > 0 ? Math.ceil(remainingToTarget / avgWeeklyVelocity) : null;

              return (
                <>
                  <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="p-3 bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-2xl font-bold">
                        <TrendingUp className="w-5 h-5" />
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-black text-neutral-900">
                            Historique de Progression : {activeObj.title}
                          </h3>
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-mono font-bold rounded-full">
                            {pct}% réalisé
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Projet : <strong className="text-neutral-800">{selectedFolder.name}</strong> • Cible : <strong className="text-emerald-700">{tgt.toLocaleString()} {activeObj.unit}</strong>
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedObjHistoryIdx(null)}
                      className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-100 transition-all cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* KPI Metrics Summary Bar */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-neutral-50 p-3.5 rounded-2xl border border-neutral-200/80 font-mono">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase block font-sans">Valeur Actuelle</span>
                      <span className="text-lg font-black text-emerald-700">{curr.toLocaleString()} <span className="text-xs font-medium text-neutral-500">{activeObj.unit}</span></span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase block font-sans">Évolution Totale</span>
                      <span className={`text-lg font-black ${totalDelta >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        {totalDelta >= 0 ? "+" : ""}{totalDelta.toLocaleString()} ({totalPctChange >= 0 ? "+" : ""}{totalPctChange}%)
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase block font-sans">Rythme Hebdo Moyen</span>
                      <span className="text-lg font-black text-indigo-600">
                        {avgWeeklyVelocity >= 0 ? "+" : ""}{avgWeeklyVelocity.toLocaleString()} <span className="text-[10px] text-neutral-400 font-sans">/sem</span>
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase block font-sans">Temps Estimé</span>
                      <span className="text-lg font-black text-amber-600">
                        {curr >= tgt ? "Atteint 🎉" : estimatedWeeksRemaining ? `~${estimatedWeeksRemaining} sem` : "Indéterminé"}
                      </span>
                    </div>
                  </div>

                  {/* Trend Chart (Recharts AreaChart) */}
                  <div className="space-y-2 bg-slate-900 p-4 rounded-2xl border border-slate-800 text-white">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-300">
                      <span className="font-bold flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-400" />
                        Graphique de Tendance Hebdomadaire
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {historyList.length} relevé(s) enregistré(s)
                      </span>
                    </div>

                    {historyList.length === 0 ? (
                      <div className="h-40 flex items-center justify-center text-xs text-slate-400 italic">
                        Aucun relevé d'historique. Enregistrez votre premier point ci-dessous !
                      </div>
                    ) : (
                      <div className="h-52 w-full pt-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={historyList} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorObjVal" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis 
                              dataKey="date" 
                              stroke="#94a3b8" 
                              fontSize={10} 
                              tickFormatter={(val) => {
                                const parts = val.split("-");
                                return parts.length === 3 ? `${parts[2]}/${parts[1]}` : val;
                              }} 
                            />
                            <YAxis stroke="#94a3b8" fontSize={10} />
                            <Tooltip
                              contentStyle={{ backgroundColor: "#0f172a", borderColor: "#334155", borderRadius: "12px", color: "#fff", fontSize: "11px" }}
                              formatter={(value: any) => [`${value.toLocaleString()} ${activeObj.unit}`, "Valeur"]}
                              labelFormatter={(label) => `Date: ${label}`}
                            />
                            <ReferenceLine 
                              y={tgt} 
                              stroke="#10b981" 
                              strokeDasharray="4 4" 
                              label={{ value: `Cible (${tgt.toLocaleString()})`, fill: "#34d399", fontSize: 10, position: "top" }} 
                            />
                            <Area 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#10b981" 
                              strokeWidth={2.5} 
                              fillOpacity={1} 
                              fill="url(#colorObjVal)" 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                  </div>

                  {/* Weekly Log Form */}
                  <div className="space-y-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80">
                    <span className="text-xs font-black uppercase text-emerald-900 block font-mono">
                      ➕ Enregistrer un Relevé Hebdomadaire
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-bold text-emerald-950 block mb-1">Date du Relevé</label>
                        <input
                          type="date"
                          value={histLogDate}
                          onChange={(e) => setHistLogDate(e.target.value)}
                          className="w-full text-xs font-bold bg-white border border-neutral-200 rounded-xl p-2 text-neutral-800"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <label className="text-[10px] font-bold text-emerald-950 block mb-1">Valeur Mesurée ({activeObj.unit})</label>
                        <input
                          type="number"
                          value={histLogValue}
                          onChange={(e) => setHistLogValue(e.target.value)}
                          placeholder={`ex: ${curr}`}
                          className="w-full text-xs font-bold bg-white border border-neutral-200 rounded-xl p-2 font-mono"
                        />
                      </div>
                      <div className="sm:col-span-4">
                        <label className="text-[10px] font-bold text-emerald-950 block mb-1">Note / Fait Marquant (Optionnel)</label>
                        <input
                          type="text"
                          value={histLogNote}
                          onChange={(e) => setHistLogNote(e.target.value)}
                          placeholder="ex: Lancement vidéo LBO..."
                          className="w-full text-xs bg-white border border-neutral-200 rounded-xl p-2 text-neutral-800"
                        />
                      </div>
                      <div className="sm:col-span-2 flex items-end">
                        <button
                          type="button"
                          onClick={() => {
                            const v = parseFloat(histLogValue);
                            if (!isNaN(v)) {
                              handleAddObjectiveHistoryPoint(objIdx, v, histLogDate, histLogNote);
                            }
                          }}
                          className="w-full bg-emerald-700 hover:bg-emerald-800 text-white p-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ajouter</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* History Table / Records List */}
                  <div className="space-y-2">
                    <span className="text-xs font-black uppercase text-neutral-700 block font-mono">
                      📋 Tableau des Points Historiques Enregistrés ({historyList.length})
                    </span>

                    {historyList.length === 0 ? (
                      <div className="text-xs text-neutral-400 italic text-center py-4 bg-neutral-50 rounded-xl border border-dashed border-neutral-200">
                        Aucun point historique enregistré pour le moment.
                      </div>
                    ) : (
                      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                        {[...historyList].reverse().map((entry, idx) => {
                          const prevEntry = historyList[historyList.length - 2 - idx];
                          const delta = prevEntry ? entry.value - prevEntry.value : 0;

                          return (
                            <div
                              key={entry.id || idx}
                              className="flex items-center justify-between p-2.5 bg-neutral-50 hover:bg-neutral-100/80 border border-neutral-200/80 rounded-xl text-xs font-mono transition-all"
                            >
                              <div className="flex items-center gap-3">
                                <span className="px-2 py-0.5 bg-white border border-neutral-200 rounded-lg text-[11px] font-bold text-neutral-700">
                                  {entry.date}
                                </span>
                                <span className="font-extrabold text-emerald-800 text-sm">
                                  {entry.value.toLocaleString()} {activeObj.unit}
                                </span>
                                {delta !== 0 && (
                                  <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${delta > 0 ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                                    {delta > 0 ? "+" : ""}{delta.toLocaleString()}
                                  </span>
                                )}
                                {entry.note && (
                                  <span className="text-[11px] text-neutral-500 font-sans italic truncate max-w-xs">
                                    "{entry.note}"
                                  </span>
                                )}
                              </div>

                              <button
                                type="button"
                                onClick={() => handleDeleteObjectiveHistoryPoint(objIdx, entry.id)}
                                className="text-neutral-400 hover:text-rose-600 transition-colors p-1 rounded-lg hover:bg-white cursor-pointer"
                                title="Supprimer ce point"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </>
              );
            })()}

          </div>
        </div>
      )}

    </div>
  );
}
