import React, { useState, useMemo, useEffect } from "react";
import { Action30Jours, Sprint } from "../types";
import {
  Calendar,
  CheckCircle,
  CheckCircle2,
  Play,
  Flame,
  Trophy,
  ChevronRight,
  ChevronLeft,
  Plus,
  Edit2,
  Trash2,
  List,
  Info,
  Sparkles,
  TrendingUp,
  Check,
  Activity,
  X,
  Undo,
  CalendarDays,
  Target,
  Clock,
  ArrowRight,
  RefreshCw,
  Award
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from "recharts";

interface Actions30JoursSectionProps {
  actions30Jours: Action30Jours[];
  setActions30Jours: React.Dispatch<React.SetStateAction<Action30Jours[]>>;
}

const MONTHS_LIST = [
  { key: "2026-01", label: "Janvier 2026", short: "Jan" },
  { key: "2026-02", label: "Février 2026", short: "Fév" },
  { key: "2026-03", label: "Mars 2026", short: "Mar" },
  { key: "2026-04", label: "Avril 2026", short: "Avr" },
  { key: "2026-05", label: "Mai 2026", short: "Mai" },
  { key: "2026-06", label: "Juin 2026", short: "Juin" },
  { key: "2026-07", label: "Juillet 2026", short: "Juil" },
  { key: "2026-08", label: "Août 2026", short: "Aoû" },
  { key: "2026-09", label: "Septembre 2026", short: "Sep" },
  { key: "2026-10", label: "Octobre 2026", short: "Oct" },
  { key: "2026-11", label: "Novembre 2026", short: "Nov" },
  { key: "2026-12", label: "Décembre 2026", short: "Déc" },
];

// Helper to generate a boilerplate 30-day sprint template
function generateSprintTemplate(focus: string, prefix: string): Action30Jours[] {
  const templates: Record<string, string[]> = {
    youtube: [
      "Définir la thématique, le positionnement et l'identité de la chaîne",
      "Rédiger la charte graphique (couleurs, typographies, bannières)",
      "Configurer la chaîne YouTube, les paramètres SEO par défaut",
      "Analyser 5 chaînes concurrentes directes et noter leurs points forts",
      "Lister 20 idées de vidéos à fort potentiel de recherche",
      "Rédiger la structure d'écriture de script (Intro, Hook, Corps, CTA)",
      "Écrire le script détaillé du 1er épisode",
      "Préparer le conducteur et tester l'enregistrement audio/micro",
      "Créer le premier template de miniature cliquable sur Photoshop/Canva",
      "Enregistrer les premières séquences du 1er épisode",
      "Monter la première moitié de la vidéo (rythme, coupes, b-roll)",
      "Terminer le montage (effets sonores, transitions, étalonnage)",
      "Créer un teaser court (Short/Reel) pour promouvoir la vidéo",
      "Écrire le titre optimisé, la description riche et les tags SEO",
      "Publier la première vidéo officielle et analyser les premières 24h",
      "Recueillir les retours d'audience et lister les optimisations",
      "Écrire le script détaillé du 2ème épisode",
      "Améliorer le set de tournage (éclairage, cadrage, fond)",
      "Filmer le 2ème épisode de façon plus fluide",
      "Créer 2 versions de miniatures pour faire un test A/B",
      "Monter le 2ème épisode en intégrant de la musique dynamique",
      "Publier le 2ème épisode et diffuser sur les réseaux (LinkedIn/X)",
      "Analyser le taux de clic (CTR) et la durée de visionnage moyenne",
      "Élaborer une stratégie d'acquisition d'abonnés par e-mail",
      "Écrire le script détaillé du 3ème épisode",
      "Filmer le 3ème épisode (focus sur la clarté d'élocution)",
      "Monter le 3ème épisode avec des animations de texte modernes",
      "Rédiger un post de blog/LinkedIn récapitulatif pour drainer du trafic",
      "Publier le 3ème épisode et suivre la courbe de croissance en direct",
      "Bilan de fin de premier sprint de 30 jours et plan de mise à l'échelle"
    ],
    finance: [
      "Clarifier sa situation financière actuelle (patrimoine, dettes, cash-flow)",
      "Établir un budget de dépenses de base et fixer un taux d'épargne cible",
      "Sélectionner 2 à 3 banques ou courtiers locaux fiables pour investir",
      "Ouvrir un compte d'investissement (PEA, compte-titres, contrat d'assurance)",
      "Faire une veille sur l'historique des performances de la bourse marocaine (BVC)",
      "Sélectionner 5 actions phares à dividendes réguliers pour analyse",
      "Calculer le rendement moyen de son futur portefeuille d'investissement",
      "Modéliser sa projection de rentier à 5, 10 et 15 ans sur Excel",
      "Définir sa stratégie d'investissement programmée (DCA)",
      "Effectuer son premier versement d'investissement test (même minime)",
      "Rechercher et répertorier les opportunités d'épargne à haut rendement",
      "Analyser les avantages fiscaux des placements d'épargne retraite",
      "Lire les 3 derniers rapports annuels de sa société favorite en bourse",
      "Analyser le secteur immobilier local pour comparaison d'actifs",
      "Établir un fonds d'urgence équivalent à 6 mois de charges fixes",
      "Suivre une formation ou un webinaire sur l'analyse technique simplifiée",
      "Définir ses règles d'arbitrage de portefeuille en cas de baisse des marchés",
      "Évaluer le coût d'acquisition d'un studio locatif à Casablanca/Rabat",
      "Créer une veille automatisée des annonces d'actifs d'occasion sous-évalués",
      "Optimiser ses abonnements récurrents pour économiser 500 MAD de plus par mois",
      "Analyser la fiscalité sur les dividendes d'actions de la BVC",
      "Partager ses objectifs financiers avec un mentor ou un groupe d'investisseurs",
      "Simuler l'impact de l'inflation sur son pouvoir d'achat à long terme",
      "Analyser 3 SCPI / OPCI de la place pour diversifier en pierre-papier",
      "Se documenter sur l'investissement dans l'or ou les métaux précieux physiques",
      "Vérifier le taux d'endettement maximal accordé par sa banque",
      "Écrire sa politique de gestion de risques personnels (assurances, prévoyance)",
      "Faire un bilan complet de ses compétences monétisables en freelance",
      "Déployer les premiers gains réinvestis automatiquement",
      "Bilan financier du mois, mise à jour de sa valeur nette totale"
    ],
    generic: Array.from({ length: 30 }, (_, i) => `Tâche quotidienne du sprint - Jour ${i + 1}`)
  };

  const selectedList = templates[focus] || templates.generic;
  return Array.from({ length: 30 }, (_, i) => ({
    id: `${prefix}_day_${i + 1}`,
    dayNumber: i + 1,
    taskDescription: selectedList[i] || `Tâche de combat pour le jour ${i + 1}`,
    completed: false,
    note: ""
  }));
}

export default function Actions30JoursSection({
  actions30Jours,
  setActions30Jours
}: Actions30JoursSectionProps) {
  // We manage the list of sprints for the 12 months of 2026
  const [sprints, setSprints] = useState<Sprint[]>(() => {
    const saved = localStorage.getItem("mp_sprints_annual_v2");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse sprints, fallback to initial", e);
      }
    }

    // Prefill beautiful historical sprints for 2026
    const initialSprints: Sprint[] = [];

    // Janvier 2026 (100% completed)
    const janTasks = generateSprintTemplate("youtube", "jan");
    janTasks.forEach(t => t.completed = true);
    janTasks[0].note = "Livrable : Charte de marque validée.";
    janTasks[14].note = "Canal en direct avec 100 abonnés organiques !";
    initialSprints.push({
      id: "sp_jan",
      name: "Branding & Positionnement Média",
      month: "2026-01",
      status: "completed",
      tasks: janTasks,
      description: "Sprint fondateur pour poser l'audience cible et le branding d'élite."
    });

    // Février 2026 (28/30 completed)
    const febTasks = generateSprintTemplate("youtube", "feb");
    febTasks.forEach((t, idx) => { if (idx !== 15 && idx !== 27) t.completed = true; });
    initialSprints.push({
      id: "sp_feb",
      name: "Lancement Officiel de la Chaîne YT",
      month: "2026-02",
      status: "completed",
      tasks: febTasks,
      description: "Création des premiers formats longs d'analyse macro-économique."
    });

    // Mars 2026 (25/30 completed)
    const marTasks = generateSprintTemplate("generic", "mar");
    marTasks.forEach((t, idx) => { if (idx < 25) t.completed = true; });
    initialSprints.push({
      id: "sp_mar",
      name: "Production de Podcast Audio & Vidéo",
      month: "2026-03",
      status: "completed",
      tasks: marTasks,
      description: "Installation du setup d'enregistrement et premiers invités d'affaires."
    });

    // Avril 2026 (24/30 completed)
    const aprTasks = generateSprintTemplate("finance", "apr");
    aprTasks.forEach((t, idx) => { if (idx < 24) t.completed = true; });
    initialSprints.push({
      id: "sp_apr",
      name: "Sponsorisation & Partenariats BVC",
      month: "2026-04",
      status: "completed",
      tasks: aprTasks,
      description: "Prise de contact avec les courtiers et banques de Casablanca."
    });

    // Mai 2026 (29/30 completed)
    const mayTasks = generateSprintTemplate("generic", "may");
    mayTasks.forEach((t, idx) => { if (idx !== 11) t.completed = true; });
    initialSprints.push({
      id: "sp_may",
      name: "Refonte du Blog & Newsletter Privée",
      month: "2026-05",
      status: "completed",
      tasks: mayTasks,
      description: "Mise en place de la capture d'emails et du branding écrit."
    });

    // Juin 2026 (27/30 completed)
    const junTasks = generateSprintTemplate("youtube", "jun");
    junTasks.forEach((t, idx) => { if (idx !== 4 && idx !== 14 && idx !== 24) t.completed = true; });
    initialSprints.push({
      id: "sp_jun",
      name: "Campagne d'Acquisition TikTok & Shorts",
      month: "2026-06",
      status: "completed",
      tasks: junTasks,
      description: "Focus sur la découpe de formats courts verticaux viraux."
    });

    // Juillet 2026 (Active)
    // We map actions30Jours (which currently has 9 tasks) to a 30-day list
    const julTasks = Array.from({ length: 30 }, (_, i) => {
      const existing = actions30Jours.find(t => t.dayNumber === i + 1);
      if (existing) {
        return { ...existing };
      }
      return {
        id: `jul_day_${i + 1}`,
        dayNumber: i + 1,
        taskDescription: i < 9 ? `Tâche quotidienne du combat - Jour ${i + 1}` : `Étape ${i + 1} du plan de consolidation du projet`,
        completed: false,
        note: ""
      };
    });

    initialSprints.push({
      id: "sp_jul",
      name: "Lancement de Projet Créateur d'Élite",
      month: "2026-07",
      status: "active",
      tasks: julTasks,
      description: "Le sprint en cours pour asseoir l'autorité financière du média."
    });

    // Août 2026 (Planned)
    const augTasks = generateSprintTemplate("finance", "aug");
    initialSprints.push({
      id: "sp_aug",
      name: "Lancement de la Formation Bourse Maroc",
      month: "2026-08",
      status: "planned",
      tasks: augTasks,
      description: "Structure complète de la formation payante et de la communauté."
    });

    return initialSprints;
  }, []);

  // Selected month for detail inspection
  const [selectedMonth, setSelectedMonth] = useState<string>("2026-07");
  const [activeTab, setActiveTab] = useState<"annual" | "details">("annual");

  // New sprint form state
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSprintName, setNewSprintName] = useState("");
  const [newSprintDesc, setNewSprintDesc] = useState("");
  const [newSprintMonth, setNewSprintMonth] = useState("");
  const [newSprintTemplateType, setNewSprintTemplateType] = useState<"youtube" | "finance" | "generic">("youtube");

  // Filter to current year 2026
  const currentSprint = useMemo(() => {
    return sprints.find(s => s.month === selectedMonth);
  }, [sprints, selectedMonth]);

  // Save sprints list to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("mp_sprints_annual_v2", JSON.stringify(sprints));
  }, [sprints]);

  // Synchronize the July 2026 sprint back to actions30Jours prop when July tasks change in annual state
  useEffect(() => {
    const julSprint = sprints.find(s => s.month === "2026-07");
    if (julSprint) {
      // Filter only tasks that have valid descriptions or are completed
      // We keep a clean list in actions30Jours prop
      const cleanTasks = julSprint.tasks.filter(t => t.taskDescription.trim() !== "");
      // Compare and update if different to avoid infinite loop
      if (JSON.stringify(cleanTasks) !== JSON.stringify(actions30Jours)) {
        setActions30Jours(cleanTasks);
      }
    }
  }, [sprints, actions30Jours, setActions30Jours]);

  // Handle checking / unchecking days in active sprint
  const toggleDayCompletion = (dayNum: number) => {
    setSprints(prev => prev.map(sprint => {
      if (sprint.month === selectedMonth) {
        const updatedTasks = sprint.tasks.map(task => {
          if (task.dayNumber === dayNum) {
            return { ...task, completed: !task.completed };
          }
          return task;
        });
        return { ...sprint, tasks: updatedTasks };
      }
      return sprint;
    }));
  };

  // Handle task description or note modification
  const handleEditTaskText = (dayNum: number, text: string, type: "desc" | "note") => {
    setSprints(prev => prev.map(sprint => {
      if (sprint.month === selectedMonth) {
        const updatedTasks = sprint.tasks.map(task => {
          if (task.dayNumber === dayNum) {
            return {
              ...task,
              taskDescription: type === "desc" ? text : task.taskDescription,
              note: type === "note" ? text : task.note
            };
          }
          return task;
        });
        return { ...sprint, tasks: updatedTasks };
      }
      return sprint;
    }));
  };

  // Create a brand new sprint
  const handleCreateSprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSprintMonth || !newSprintName) return;

    // Check if month already has a sprint
    const exists = sprints.some(s => s.month === newSprintMonth);
    if (exists) {
      alert("Ce mois possède déjà un sprint. Supprimez-le ou éditez-le d'abord.");
      return;
    }

    const newTasks = generateSprintTemplate(newSprintTemplateType, newSprintMonth.replace("-", "_"));
    const newSprint: Sprint = {
      id: `sp_${Date.now()}`,
      name: newSprintName,
      month: newSprintMonth,
      status: newSprintMonth === "2026-07" ? "active" : newSprintMonth < "2026-07" ? "completed" : "planned",
      tasks: newTasks,
      description: newSprintDesc
    };

    setSprints(prev => [...prev, newSprint]);
    setSelectedMonth(newSprintMonth);
    setActiveTab("details");
    setShowCreateForm(false);
    setNewSprintName("");
    setNewSprintDesc("");
    setNewSprintMonth("");
  };

  // Delete a sprint
  const handleDeleteSprint = (monthKey: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce sprint ? Cette action est irréversible.")) {
      setSprints(prev => prev.filter(s => s.month !== monthKey));
      if (selectedMonth === monthKey) {
        setSelectedMonth("2026-07");
      }
    }
  };

  // Change sprint status
  const handleUpdateSprintStatus = (monthKey: string, newStatus: "active" | "completed" | "planned") => {
    setSprints(prev => prev.map(s => {
      if (s.month === monthKey) {
        return { ...s, status: newStatus };
      }
      // If setting this to active, set other active sprints to completed
      if (newStatus === "active" && s.status === "active") {
        return { ...s, status: "completed" };
      }
      return s;
    }));
  };

  // Statistics for overall year
  const yearStats = useMemo(() => {
    const activeAndCompleted = sprints.filter(s => s.status !== "planned");
    const totalSprintsCount = sprints.length;
    const completedSprintsCount = sprints.filter(s => s.status === "completed").length;
    
    let totalCompletedDays = 0;
    sprints.forEach(s => {
      totalCompletedDays += s.tasks.filter(t => t.completed).length;
    });

    const averageCompletion = activeAndCompleted.length > 0 
      ? Math.round(activeAndCompleted.reduce((acc, curr) => {
          const compl = curr.tasks.filter(t => t.completed).length;
          return acc + (compl / 30) * 100;
        }, 0) / activeAndCompleted.length)
      : 0;

    return {
      totalSprintsCount,
      completedSprintsCount,
      totalCompletedDays,
      averageCompletion
    };
  }, [sprints]);

  // Selected Sprint statistics
  const currentSprintStats = useMemo(() => {
    if (!currentSprint) return { completed: 0, total: 30, pct: 0 };
    const completed = currentSprint.tasks.filter(t => t.completed).length;
    const total = currentSprint.tasks.length;
    return {
      completed,
      total,
      pct: Math.round((completed / total) * 100)
    };
  }, [currentSprint]);

  // Momentum chart data for the currently selected sprint
  const momentumChartData = useMemo(() => {
    if (!currentSprint) return [];
    const data = [];
    
    // Determine active day limit based on system date 2026-07-18
    const today = new Date("2026-07-18");
    const [sprintYear, sprintMonth] = currentSprint.month.split("-").map(Number);
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;

    let activeDayLimit = 30;
    if (sprintYear === todayYear && sprintMonth === todayMonth) {
      activeDayLimit = Math.min(30, Math.max(1, today.getDate()));
    } else if (sprintYear > todayYear || (sprintYear === todayYear && sprintMonth > todayMonth)) {
      activeDayLimit = 0; // Future
    }

    for (let day = 1; day <= 30; day++) {
      // Find how many tasks with dayNumber <= day are completed
      const completedUpToDay = currentSprint.tasks.filter(
        t => t.dayNumber <= day && t.completed
      ).length;

      data.push({
        day,
        name: `J${day}`,
        "Tâches Complétées": day <= activeDayLimit ? completedUpToDay : undefined,
        "Cadence Idéale": day,
      });
    }
    return data;
  }, [currentSprint]);

  // Momentum Status Coaching Insight
  const momentumStatus = useMemo(() => {
    if (!currentSprint) return null;
    const today = new Date("2026-07-18");
    const [sprintYear, sprintMonth] = currentSprint.month.split("-").map(Number);
    const todayYear = today.getFullYear();
    const todayMonth = today.getMonth() + 1;

    let activeDayLimit = 30;
    if (sprintYear === todayYear && sprintMonth === todayMonth) {
      activeDayLimit = Math.min(30, Math.max(1, today.getDate()));
    } else if (sprintYear > todayYear || (sprintYear === todayYear && sprintMonth > todayMonth)) {
      return { status: "not_started", text: "Sprint non démarré", diff: 0, completed: 0 };
    }

    const completedAtCurrentDay = currentSprint.tasks.filter(
      t => t.dayNumber <= activeDayLimit && t.completed
    ).length;

    const diff = completedAtCurrentDay - activeDayLimit;

    if (activeDayLimit === 30) {
      return {
        status: completedAtCurrentDay === 30 ? "perfect" : completedAtCurrentDay >= 25 ? "excellent" : "completed",
        text: `Sprint complété à ${Math.round((completedAtCurrentDay / 30) * 100)}% (${completedAtCurrentDay} / 30 tâches)`,
        diff,
        completed: completedAtCurrentDay
      };
    }

    return {
      status: diff >= 0 ? "ahead" : diff >= -3 ? "on_track" : "behind",
      text: diff >= 0 
        ? `Élan Excellent (+${diff} tâches d'avance)` 
        : diff >= -3 
          ? "Sur la bonne voie (cadence maîtrisée)" 
          : `Retard de cadence (${Math.abs(diff)} tâches à rattraper)`,
      diff,
      completed: completedAtCurrentDay
    };
  }, [currentSprint]);

  return (
    <div className="space-y-6">
      {/* Header and Summary Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-neutral-950 flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-neutral-800" />
            Actions 30 Jours & Timeline des Sprints
          </h2>
          <p className="text-sm text-neutral-500 font-medium mt-1">
            Visualisez et gérez votre discipline mensuelle et l'enchaînement de vos sprints d'attaque sur l'année.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-neutral-100 p-1 rounded-xl border border-neutral-200 self-start md:self-auto">
          <button
            onClick={() => setActiveTab("annual")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "annual"
                ? "bg-white text-neutral-900 shadow-3xs border border-neutral-200/50"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Calendrier Annuel
          </button>
          <button
            onClick={() => setActiveTab("details")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "details"
                ? "bg-white text-neutral-900 shadow-3xs border border-neutral-200/50"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            Détail du Sprint ({currentSprint ? currentSprint.month.substring(5) : "Aucun"})
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Sprints Programmés</span>
            <span className="text-xl font-extrabold font-mono text-neutral-950 block">{yearStats.totalSprintsCount}</span>
          </div>
          <div className="p-2 bg-neutral-50 rounded-xl text-neutral-900 border border-neutral-200"><CalendarDays className="w-4 h-4" /></div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Sprints Complétés</span>
            <span className="text-xl font-extrabold font-mono text-neutral-950 block">{yearStats.completedSprintsCount}</span>
          </div>
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700 border border-emerald-200"><Trophy className="w-4 h-4" /></div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Jours de Combat Validés</span>
            <span className="text-xl font-extrabold font-mono text-neutral-950 block">{yearStats.totalCompletedDays} Jours</span>
          </div>
          <div className="p-2 bg-neutral-50 rounded-xl text-neutral-900 border border-neutral-200"><Flame className="w-4 h-4" /></div>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-3xs flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Réussite Globale</span>
            <span className="text-xl font-extrabold font-mono text-emerald-600 block">{yearStats.averageCompletion}%</span>
          </div>
          <div className="p-2 bg-emerald-50 rounded-xl text-emerald-700 border border-emerald-200"><TrendingUp className="w-4 h-4" /></div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "annual" ? (
          <motion.div
            key="annual-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Top Toolbar */}
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-neutral-900">Timeline Annuelle 2026</h3>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-3 py-1.5 bg-neutral-950 text-white rounded-xl text-xs font-extrabold hover:bg-neutral-800 transition-all flex items-center gap-1 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                Planifier un Sprint
              </button>
            </div>

            {/* Create New Sprint Form */}
            {showCreateForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleCreateSprint}
                className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-4 overflow-hidden"
              >
                <div className="flex items-center justify-between border-b border-neutral-200 pb-2">
                  <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">Planification d'un Nouveau Sprint de 30 Jours</h4>
                  <button type="button" onClick={() => setShowCreateForm(false)} className="text-neutral-400 hover:text-neutral-900">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] text-neutral-500 font-bold uppercase block">Nom du Sprint</label>
                    <input
                      type="text"
                      required
                      placeholder="ex: Lancement Canal Privé"
                      value={newSprintName}
                      onChange={e => setNewSprintName(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-neutral-500 font-bold uppercase block">Mois Cible</label>
                    <select
                      required
                      value={newSprintMonth}
                      onChange={e => setNewSprintMonth(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900"
                    >
                      <option value="">Sélectionner un mois</option>
                      {MONTHS_LIST.map(m => (
                        <option key={m.key} value={m.key} disabled={sprints.some(s => s.month === m.key)}>
                          {m.label} {sprints.some(s => s.month === m.key) ? "(Déjà occupé)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-neutral-500 font-bold uppercase block">Modèle de Tâches</label>
                    <select
                      value={newSprintTemplateType}
                      onChange={e => setNewSprintTemplateType(e.target.value as any)}
                      className="w-full text-xs font-medium px-3 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900"
                    >
                      <option value="youtube">Média / Créateur YouTube</option>
                      <option value="finance">Finance d'Élite & Investissement</option>
                      <option value="generic">Générique (Jour 1 à 30)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] text-neutral-500 font-bold uppercase block">Description / Objectif</label>
                    <input
                      type="text"
                      placeholder="Objectif ultime de ce sprint..."
                      value={newSprintDesc}
                      onChange={e => setNewSprintDesc(e.target.value)}
                      className="w-full text-xs font-medium px-3 py-2 bg-white border border-neutral-200 rounded-xl focus:outline-hidden focus:border-neutral-900"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    className="px-3 py-2 border border-neutral-200 text-neutral-500 rounded-xl text-xs font-bold hover:bg-neutral-100"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-950 text-white rounded-xl text-xs font-extrabold hover:bg-neutral-800 flex items-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Générer le Sprint de 30 Jours
                  </button>
                </div>
              </motion.form>
            )}

            {/* Annual Timeline Layout (12 Months) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {MONTHS_LIST.map((m, index) => {
                const sprint = sprints.find(s => s.month === m.key);
                const completedCount = sprint ? sprint.tasks.filter(t => t.completed).length : 0;
                const completionPct = sprint ? Math.round((completedCount / 30) * 100) : 0;

                return (
                  <div
                    key={m.key}
                    onClick={() => {
                      if (sprint) {
                        setSelectedMonth(m.key);
                        setActiveTab("details");
                      }
                    }}
                    className={`bg-white border rounded-2xl p-4 flex flex-col justify-between transition-all group ${
                      sprint 
                        ? "border-neutral-200 hover:border-neutral-400 hover:shadow-xs cursor-pointer"
                        : "border-dashed border-neutral-200 opacity-60 hover:opacity-100"
                    } relative`}
                  >
                    {/* Header Month */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-neutral-950 block"></span>
                        <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wide">{m.label}</h4>
                      </div>
                      
                      {sprint ? (
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                          sprint.status === "completed"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : sprint.status === "active"
                            ? "bg-neutral-950 text-white border border-neutral-800 animate-pulse"
                            : "bg-blue-50 text-blue-700 border border-blue-200"
                        }`}>
                          {sprint.status === "completed" ? "Complété" : sprint.status === "active" ? "Actif" : "Planifié"}
                        </span>
                      ) : (
                        <span className="text-[10px] text-neutral-400 font-bold italic">Aucun sprint</span>
                      )}
                    </div>

                    {/* Sprint Title & Info */}
                    {sprint ? (
                      <div className="space-y-2 flex-1">
                        <p className="text-xs font-extrabold text-neutral-800 leading-snug group-hover:text-neutral-950">
                          {sprint.name}
                        </p>
                        {sprint.description && (
                          <p className="text-[10px] text-neutral-400 font-medium line-clamp-2">
                            {sprint.description}
                          </p>
                        )}

                        {/* Miniature 30-dots Matrix representing the 30 days */}
                        <div className="pt-2">
                          <div className="flex items-center justify-between text-[9px] text-neutral-400 font-bold mb-1">
                            <span>Timeline du Combat</span>
                            <span className="font-mono text-neutral-900">{completedCount}/30 Jours ({completionPct}%)</span>
                          </div>
                          
                          {/* 3 rows of 10 dots */}
                          <div className="grid grid-cols-10 gap-1.5 p-1.5 bg-neutral-50 rounded-xl border border-neutral-100">
                            {sprint.tasks.map((task, dIdx) => (
                              <div
                                key={task.id}
                                title={`Jour ${task.dayNumber}: ${task.taskDescription} ${task.completed ? "(Terminé)" : "(À faire)"}`}
                                className={`aspect-square rounded-full transition-all duration-300 ${
                                  task.completed
                                    ? "bg-emerald-500 border border-emerald-600 shadow-3xs"
                                    : sprint.status === "active" && task.dayNumber === (completedCount + 1)
                                    ? "bg-neutral-900 ring-2 ring-neutral-300 animate-pulse scale-110"
                                    : "bg-neutral-200/80 border border-neutral-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 flex flex-col items-center justify-center py-6 border border-dashed border-neutral-100 rounded-xl bg-neutral-50/50 mt-1">
                        <Calendar className="w-6 h-6 text-neutral-300 mb-1" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setNewSprintMonth(m.key);
                            setNewSprintName(`Sprint de ${m.label.split(" ")[0]}`);
                            setShowCreateForm(true);
                          }}
                          className="text-[10px] text-neutral-600 hover:text-neutral-950 font-extrabold flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-neutral-200 shadow-3xs"
                        >
                          <Plus className="w-3 h-3" />
                          Créer
                        </button>
                      </div>
                    )}

                    {/* Bottom Action buttons */}
                    {sprint && (
                      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-bold text-neutral-500">
                        <div className="flex items-center gap-1">
                          {sprint.status !== "active" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateSprintStatus(m.key, "active");
                              }}
                              className="text-neutral-900 hover:text-emerald-700 transition-all flex items-center gap-0.5"
                              title="Définir comme sprint actif"
                            >
                              <Play className="w-3 h-3" />
                              Activer
                            </button>
                          )}
                          {sprint.status === "active" && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUpdateSprintStatus(m.key, "completed");
                              }}
                              className="text-emerald-600 hover:text-emerald-800 transition-all flex items-center gap-0.5"
                              title="Marquer comme complété"
                            >
                              <Check className="w-3 h-3" />
                              Compléter
                            </button>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSprint(m.key);
                            }}
                            className="text-neutral-400 hover:text-red-500 transition-all p-0.5"
                            title="Supprimer le sprint"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                          <span className="text-neutral-900 group-hover:translate-x-1 transition-all duration-200 flex items-center gap-0.5">
                            Éditer <ChevronRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="details-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Sprint Selection Selector */}
            <div className="bg-white border border-neutral-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-3xs">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-neutral-900 text-white rounded-xl">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-neutral-900">
                      {currentSprint ? currentSprint.name : "Aucun sprint configuré pour ce mois"}
                    </h3>
                    {currentSprint && (
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                        currentSprint.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : currentSprint.status === "active"
                          ? "bg-neutral-950 text-white border border-neutral-800"
                          : "bg-blue-50 text-blue-700 border border-blue-200"
                      }`}>
                        {currentSprint.status === "completed" ? "Complété" : currentSprint.status === "active" ? "Actif" : "Planifié"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 font-medium mt-0.5">
                    Mois : {MONTHS_LIST.find(m => m.key === selectedMonth)?.label || selectedMonth}
                  </p>
                </div>
              </div>

              {/* Month Select dropdown */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="text-xs text-neutral-400 font-bold">Mois :</span>
                <select
                  value={selectedMonth}
                  onChange={e => setSelectedMonth(e.target.value)}
                  className="text-xs font-bold px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-hidden"
                >
                  {sprints.map(s => (
                    <option key={s.month} value={s.month}>
                      {MONTHS_LIST.find(m => m.key === s.month)?.label || s.month}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setActiveTab("annual")}
                  className="text-xs font-bold px-3 py-1.5 border border-neutral-200 text-neutral-600 hover:text-neutral-950 rounded-xl transition-all"
                >
                  Retour
                </button>
              </div>
            </div>

            {currentSprint ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Side: Summary & Focus Area */}
                <div className="space-y-6">
                  {/* Progress Card */}
                  <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-3xs space-y-4">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-neutral-700" />
                      Avancement du Sprint
                    </h4>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-black font-mono">
                        <span className="text-neutral-500">Jours validés</span>
                        <span className="text-neutral-950">{currentSprintStats.completed} / {currentSprintStats.total}</span>
                      </div>
                      <div className="w-full bg-neutral-100 h-2.5 rounded-full overflow-hidden border border-neutral-200/50">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500 shadow-xs"
                          style={{ width: `${currentSprintStats.pct}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-neutral-400 font-medium text-right">
                        Taux d'accomplissement : {currentSprintStats.pct}%
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-bold">
                      <span className="text-neutral-500">Statut du Sprint</span>
                      <select
                        value={currentSprint.status}
                        onChange={(e) => handleUpdateSprintStatus(currentSprint.month, e.target.value as any)}
                        className="bg-neutral-50 border border-neutral-200 rounded-lg px-2 py-1 font-extrabold focus:outline-hidden"
                      >
                        <option value="active">Actif</option>
                        <option value="completed">Complété</option>
                        <option value="planned">Planifié</option>
                      </select>
                    </div>
                  </div>

                  {/* Template Info Card */}
                  <div className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-3xs space-y-3">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Info className="w-4 h-4 text-neutral-700" />
                      À propos du Sprint de 30 Jours
                    </h4>
                    <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                      Un sprint de 30 jours consiste à s'attribuer une seule tâche majeure mais accessible par jour. En validant régulièrement chaque étape, vous transformez vos grands rêves en livrables tangibles.
                    </p>
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-100 space-y-1">
                      <span className="text-[9px] text-neutral-400 font-bold uppercase tracking-wider block">Astuce d'efficacité</span>
                      <p className="text-[11px] text-neutral-600 font-semibold leading-normal">
                        Prenez 10 minutes chaque soir pour rédiger l'action du lendemain. Votre cerveau l'assimilera durant la nuit.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Side: The 30-Day Checklist */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-neutral-900 uppercase tracking-wider">Plan de Combat des 30 Jours</h4>
                    <span className="text-[10px] text-neutral-400 font-bold">Cochez chaque jour validé</span>
                  </div>

                  {/* List of 30 Days */}
                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {currentSprint.tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-3.5 border rounded-xl flex items-start gap-3 transition-all duration-200 ${
                          task.completed
                            ? "bg-emerald-50/40 border-emerald-200/60 shadow-3xs"
                            : "bg-white border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        {/* Day Completion Checkbox */}
                        <button
                          onClick={() => toggleDayCompletion(task.dayNumber)}
                          className={`mt-0.5 shrink-0 w-5 h-5 rounded-md flex items-center justify-center transition-all ${
                            task.completed
                              ? "bg-emerald-500 border border-emerald-600 text-white"
                              : "border border-neutral-300 hover:border-neutral-500 bg-white"
                          }`}
                        >
                          {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </button>

                        {/* Task Content */}
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-black font-mono text-neutral-400 uppercase tracking-wider">
                              Jour {task.dayNumber}
                            </span>
                            {task.completed && (
                              <span className="text-[9px] font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-200/50">
                                Validé !
                              </span>
                            )}
                          </div>

                          {/* Editable task description */}
                          <input
                            type="text"
                            value={task.taskDescription}
                            onChange={(e) => handleEditTaskText(task.dayNumber, e.target.value, "desc")}
                            className={`w-full text-xs font-extrabold text-neutral-800 bg-transparent border-0 border-b border-transparent focus:border-neutral-400 focus:outline-hidden focus:bg-neutral-50 px-1 py-0.5 rounded-sm ${
                              task.completed ? "line-through text-neutral-400" : ""
                            }`}
                            placeholder={`Tâche du Jour ${task.dayNumber}...`}
                          />

                          {/* Note / Deliverable edit block */}
                          <div className="flex items-center gap-1.5 pt-1">
                            <span className="text-[9px] font-bold text-neutral-400 shrink-0">Livrable / Note :</span>
                            <input
                              type="text"
                              value={task.note}
                              onChange={(e) => handleEditTaskText(task.dayNumber, e.target.value, "note")}
                              className="flex-1 text-[10px] font-medium text-neutral-500 bg-transparent border-0 border-b border-transparent focus:border-neutral-300 focus:outline-hidden focus:bg-neutral-50 px-1 py-0.5 rounded-sm"
                              placeholder="ex: Document rédigé, maquette validée..."
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Graphique de Vitesse & Élan du Sprint */}
              <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-4 shadow-3xs mt-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-neutral-900 text-white rounded-xl">
                      <TrendingUp className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-neutral-950 uppercase tracking-wider">
                        Élan & Momentum du Sprint (30 Jours)
                      </h3>
                      <p className="text-xs text-neutral-500 font-medium">
                        Suivez votre élan de réalisation quotidien par rapport au rythme linéaire idéal d'une tâche par jour.
                      </p>
                    </div>
                  </div>

                  {/* Momentum Status Badge */}
                  <div className="flex flex-wrap items-center gap-2">
                    {momentumStatus && (
                      <>
                        {momentumStatus.status === "ahead" && (
                          <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                            <Check className="w-3 h-3 text-emerald-600 stroke-[3]" />
                            {momentumStatus.text}
                          </span>
                        )}
                        {momentumStatus.status === "on_track" && (
                          <span className="text-[10px] bg-neutral-50 border border-neutral-200 text-neutral-700 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                            <Activity className="w-3 h-3 text-neutral-600" />
                            {momentumStatus.text}
                          </span>
                        )}
                        {momentumStatus.status === "behind" && (
                          <span className="text-[10px] bg-amber-50 border border-amber-200 text-amber-800 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                            <Flame className="w-3 h-3 text-amber-600" />
                            {momentumStatus.text}
                          </span>
                        )}
                        {momentumStatus.status === "not_started" && (
                          <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-600 px-2.5 py-1 rounded-full font-bold">
                            {momentumStatus.text}
                          </span>
                        )}
                        {momentumStatus.status === "perfect" && (
                          <span className="text-[10px] bg-emerald-100 border border-emerald-200 text-emerald-800 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                            <Trophy className="w-3 h-3 text-emerald-600" />
                            Sprint Parfait !
                          </span>
                        )}
                      </>
                    )}
                    <span className="text-[10px] bg-neutral-100 border border-neutral-200 text-neutral-700 px-2.5 py-1 rounded-full font-mono font-bold">
                      Momentum : {currentSprintStats.completed} / 30 Jours
                    </span>
                  </div>
                </div>

                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={momentumChartData}
                      margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                      <XAxis 
                        dataKey="day" 
                        tick={{ fill: '#737373', fontSize: 10, fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                        dy={8}
                      />
                      <YAxis 
                        domain={[0, 30]}
                        tick={{ fill: '#737373', fontSize: 10, fontWeight: 600 }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-neutral-950 text-white border border-neutral-800 p-3 rounded-xl shadow-xl space-y-1 text-xs">
                                <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Jour {data.day}</p>
                                <div className="space-y-1">
                                  <p className="flex justify-between gap-6">
                                    <span className="text-neutral-400 font-semibold">Réalisé Cumulé :</span>
                                    <span className="font-bold font-mono text-white">
                                      {data["Tâches Complétées"] !== undefined ? `${data["Tâches Complétées"]} / 30` : "Non survenu"}
                                    </span>
                                  </p>
                                  <p className="flex justify-between gap-6">
                                    <span className="text-neutral-400 font-semibold">Cadence Idéale :</span>
                                    <span className="font-bold font-mono text-neutral-300">
                                      {data["Cadence Idéale"]} / 30
                                    </span>
                                  </p>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      {/* Cadence Idéale (Dashed Line) */}
                      <Line 
                        type="monotone" 
                        dataKey="Cadence Idéale" 
                        stroke="#a3a3a3" 
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        activeDot={false}
                      />
                      {/* Tâches Complétées Réelles (Solid Black Line) */}
                      <Line 
                        type="monotone" 
                        dataKey="Tâches Complétées" 
                        stroke="#171717" 
                        strokeWidth={3}
                        connectNulls={false}
                        dot={{ r: 3, fill: '#171717' }}
                        activeDot={{ r: 6, fill: '#171717', stroke: '#ffffff', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="bg-neutral-50 p-4 border border-neutral-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="font-black text-neutral-800 uppercase tracking-wider text-[10px] block">Comment lire ce graphique ?</span>
                    <p className="text-neutral-500 font-medium leading-relaxed">
                      La ligne grise en pointillés représente un rythme parfait d'un jour complété par jour calendaire. Si votre ligne noire (cumul réel de tâches terminées) se maintient au-dessus ou au niveau de la ligne grise, votre sprint conserve un excellent élan.
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600">
                      <span className="w-3 h-0.5 bg-neutral-900 border-t-2 border-neutral-900" />
                      <span>Réalisé</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-600">
                      <span className="w-3 h-0.5 border-t-2 border-dashed border-neutral-400" />
                      <span>Idéal</span>
                    </div>
                  </div>
                </div>
              </div>
              </>
            ) : (
              <div className="text-center py-16 bg-white border border-neutral-200 rounded-2xl p-6">
                <Calendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <h3 className="text-sm font-black text-neutral-900">Aucun sprint configuré</h3>
                <p className="text-xs text-neutral-400 font-medium max-w-md mx-auto mt-1 mb-4">
                  Vous n'avez pas de sprint enregistré pour ce mois. Retournez au calendrier annuel pour en initialiser un !
                </p>
                <button
                  onClick={() => setActiveTab("annual")}
                  className="px-4 py-2 bg-neutral-950 text-white rounded-xl text-xs font-extrabold hover:bg-neutral-800"
                >
                  Aller au Calendrier
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
