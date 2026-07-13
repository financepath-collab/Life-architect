import React, { useState, useMemo } from "react";
import { EditorialEvent } from "../types";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Edit, 
  Trash2, 
  Filter, 
  Check, 
  X, 
  Video, 
  Smartphone, 
  FileText, 
  Grid, 
  List, 
  AlertCircle, 
  Tv, 
  Play,
  Briefcase,
  Layers,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface EditorialCalendarSectionProps {
  events: EditorialEvent[];
  setEvents: React.Dispatch<React.SetStateAction<EditorialEvent[]>>;
  availableChannels?: string[];
}

export default function EditorialCalendarSection({ 
  events = [], 
  setEvents,
  availableChannels = [
    "The Moroccan Analyst", 
    "The Moroccan CFO", 
    "The Moroccan Economist", 
    "The MA Circle"
  ]
}: EditorialCalendarSectionProps) {
  
  // View mode: 'calendar' or 'list'
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  // Active filter state
  const [filterChannel, setFilterChannel] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterFormat, setFilterFormat] = useState<string>("all");

  // Local calendar date navigation (defaults to July 2026 as per application metadata date context)
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date(2026, 6, 1)); // Month index 6 is July

  // Quick form modal state
  const [showModal, setShowModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState("");
  const [formChannelName, setFormChannelName] = useState(availableChannels[0]);
  const [customChannelName, setCustomChannelName] = useState("");
  const [formPlatform, setFormPlatform] = useState("YouTube");
  const [formScheduledDate, setFormScheduledDate] = useState("2026-07-15");
  const [formStatus, setFormStatus] = useState<EditorialEvent["status"]>("Planifié");
  const [formContentType, setFormContentType] = useState<EditorialEvent["contentType"]>("Vidéo Longue");
  const [formNotes, setFormNotes] = useState("");

  // Determine final channel name based on custom selection
  const activeChannel = formChannelName === "Autre / Custom" ? customChannelName : formChannelName;

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const firstDayIndex = useMemo(() => {
    // Get day index of the 1st of the month, adjusted for Monday-first calendar (0 = Monday, 6 = Sunday)
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1;
  }, [year, month]);

  // Months labels in French
  const monthLabels = [
    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];

  // Helper to handle date navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Filter events based on filters
  const filteredEvents = useMemo(() => {
    return events.filter(e => {
      const matchChannel = filterChannel === "all" || e.channelName === filterChannel;
      const matchStatus = filterStatus === "all" || e.status === filterStatus;
      const matchFormat = filterFormat === "all" || e.contentType === filterFormat;
      return matchChannel && matchStatus && matchFormat;
    });
  }, [events, filterChannel, filterStatus, filterFormat]);

  // Statistics
  const stats = useMemo(() => {
    // July 2026 range or selected month range
    const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const monthlyEvents = events.filter(e => e.scheduledDate.startsWith(currentMonthPrefix));

    const total = monthlyEvents.length;
    const published = monthlyEvents.filter(e => e.status === "Publié").length;
    const planned = monthlyEvents.filter(e => e.status === "Planifié").length;
    const draft = monthlyEvents.filter(e => e.status === "Brouillon").length;
    const inProgress = monthlyEvents.filter(e => e.status === "En cours").length;

    return {
      total,
      published,
      planned,
      draft,
      inProgress,
      publishedRate: total > 0 ? Math.round((published / total) * 100) : 0
    };
  }, [events, year, month]);

  // Add/Edit Submission
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const channelVal = formChannelName === "Autre / Custom" 
      ? (customChannelName.trim() || "Chaîne Autre")
      : formChannelName;

    if (editingEventId) {
      // Edit
      setEvents(prev => prev.map(evt => {
        if (evt.id === editingEventId) {
          return {
            ...evt,
            title: formTitle.trim() || "Sans titre",
            channelName: channelVal,
            platform: formPlatform,
            scheduledDate: formScheduledDate,
            status: formStatus,
            contentType: formContentType,
            notes: formNotes.trim()
          };
        }
        return evt;
      }));
    } else {
      // Create
      const newEvent: EditorialEvent = {
        id: "ee_" + Date.now(),
        title: formTitle.trim() || "Sans titre",
        channelName: channelVal,
        platform: formPlatform,
        scheduledDate: formScheduledDate,
        status: formStatus,
        contentType: formContentType,
        notes: formNotes.trim()
      };
      setEvents(prev => [...prev, newEvent]);
    }

    resetForm();
    setShowModal(false);
  };

  const resetForm = () => {
    setFormTitle("");
    setFormChannelName(availableChannels[0]);
    setCustomChannelName("");
    setFormPlatform("YouTube");
    setFormScheduledDate(`${year}-${String(month + 1).padStart(2, '0')}-15`);
    setFormStatus("Planifié");
    setFormContentType("Vidéo Longue");
    setFormNotes("");
    setEditingEventId(null);
  };

  // Start edit
  const handleEditStart = (evt: EditorialEvent) => {
    setEditingEventId(evt.id);
    setFormTitle(evt.title);
    if (availableChannels.includes(evt.channelName)) {
      setFormChannelName(evt.channelName);
      setCustomChannelName("");
    } else {
      setFormChannelName("Autre / Custom");
      setCustomChannelName(evt.channelName);
    }
    setFormPlatform(evt.platform);
    setFormScheduledDate(evt.scheduledDate);
    setFormStatus(evt.status);
    setFormContentType(evt.contentType);
    setFormNotes(evt.notes || "");
    setShowModal(true);
  };

  // Fast toggles
  const handleQuickStatusChange = (id: string, newStatus: EditorialEvent["status"]) => {
    setEvents(prev => prev.map(evt => evt.id === id ? { ...evt, status: newStatus } : evt));
  };

  const handleDelete = (id: string) => {
    if (confirm("Voulez-vous supprimer cet événement du calendrier éditorial ?")) {
      setEvents(prev => prev.filter(evt => evt.id !== id));
    }
  };

  const openAddForDay = (dayNum: number) => {
    resetForm();
    const formattedDay = String(dayNum).padStart(2, '0');
    const formattedMonth = String(month + 1).padStart(2, '0');
    setFormScheduledDate(`${year}-${formattedMonth}-${formattedDay}`);
    setShowModal(true);
  };

  // Icons and colors helpers per Platform
  const getPlatformColors = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "youtube":
        return { bg: "bg-red-50 text-red-600 border-red-200", badge: "bg-red-600 text-white", ring: "ring-red-500/10" };
      case "tiktok":
        return { bg: "bg-zinc-50 text-zinc-900 border-zinc-200", badge: "bg-zinc-900 text-white", ring: "ring-zinc-500/10" };
      case "linkedin":
        return { bg: "bg-blue-50 text-blue-700 border-blue-200", badge: "bg-blue-600 text-white", ring: "ring-blue-500/10" };
      case "instagram":
        return { bg: "bg-pink-50 text-pink-600 border-pink-200", badge: "bg-pink-600 text-white", ring: "ring-pink-500/10" };
      case "spotify":
        return { bg: "bg-emerald-50 text-emerald-700 border-emerald-200", badge: "bg-emerald-600 text-white", ring: "ring-emerald-500/10" };
      default:
        return { bg: "bg-neutral-50 text-neutral-600 border-neutral-200", badge: "bg-neutral-600 text-white", ring: "ring-neutral-500/10" };
    }
  };

  const getStatusBadge = (status: EditorialEvent["status"]) => {
    switch (status) {
      case "Publié":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "Planifié":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "En cours":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "Brouillon":
        return "bg-neutral-100 text-neutral-700 border-neutral-200";
    }
  };

  // Drag and Drop State & Handlers
  const [draggedOverDate, setDraggedOverDate] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, eventId: string) => {
    e.dataTransfer.setData("text/plain", eventId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDragEnter = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    setDraggedOverDate(targetDate);
  };

  const handleDragLeave = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    setDraggedOverDate(prev => prev === targetDate ? null : prev);
  };

  const handleDrop = (e: React.DragEvent, targetDate: string) => {
    e.preventDefault();
    setDraggedOverDate(null);
    const eventId = e.dataTransfer.getData("text/plain");
    if (!eventId) return;

    setEvents(prev => prev.map(evt => {
      if (evt.id === eventId) {
        return { ...evt, scheduledDate: targetDate };
      }
      return evt;
    }));
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-neutral-100 dark:border-neutral-800">
        <div>
          <h3 className="text-base font-black text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-500" />
            Calendrier Éditorial Multi-Plateforme
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Planifiez, organisez et suivez vos publications de réseaux sociaux. <span className="text-indigo-500 font-bold">Glissez-déposez</span> une publication pour changer sa date instantanément !
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Toggle View Mode */}
          <div className="flex items-center bg-neutral-100 dark:bg-zinc-950 p-1 rounded-xl border border-neutral-200 dark:border-neutral-800">
            <button
              onClick={() => setViewMode('calendar')}
              className={`p-1.5 rounded-lg transition-all text-xs font-bold cursor-pointer flex items-center gap-1 ${viewMode === 'calendar' ? 'bg-white dark:bg-zinc-900 text-neutral-900 dark:text-neutral-50 shadow-3xs' : 'text-neutral-400 hover:text-neutral-600'}`}
              title="Vue Grille Calendrier"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Calendrier</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-all text-xs font-bold cursor-pointer flex items-center gap-1 ${viewMode === 'list' ? 'bg-white dark:bg-zinc-900 text-neutral-900 dark:text-neutral-50 shadow-3xs' : 'text-neutral-400 hover:text-neutral-600'}`}
              title="Vue Liste"
            >
              <List className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Liste</span>
            </button>
          </div>

          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition-colors shadow-2xs select-none cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une Publication</span>
          </button>
        </div>
      </div>

      {/* STATS DE PERFORMANCES ÉDITORIALES DU MOIS SELECTIONNÉ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Planned */}
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 p-4 rounded-2xl shadow-3xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Publications Prévues</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black font-mono text-neutral-900 dark:text-neutral-50">{stats.total}</span>
            <span className="text-xs text-neutral-400">ce mois</span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-indigo-500 h-full w-full" />
          </div>
        </div>

        {/* Total Published */}
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 p-4 rounded-2xl shadow-3xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Publiées & En ligne</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black font-mono text-emerald-600 dark:text-emerald-400">{stats.published}</span>
            <span className="text-xs text-neutral-400">/ {stats.total}</span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1 rounded-full mt-3 overflow-hidden">
            <div style={{ width: `${stats.publishedRate}%` }} className="bg-emerald-500 h-full transition-all" />
          </div>
        </div>

        {/* Planified Remaining */}
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 p-4 rounded-2xl shadow-3xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">Prêtes & Planifiées</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black font-mono text-indigo-600 dark:text-indigo-400">{stats.planned}</span>
            <span className="text-xs text-neutral-400">bloquées</span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1 rounded-full mt-3 overflow-hidden">
            <div style={{ width: `${stats.total > 0 ? (stats.planned / stats.total) * 100 : 0}%` }} className="bg-indigo-400 h-full" />
          </div>
        </div>

        {/* Drafts or In Production */}
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 p-4 rounded-2xl shadow-3xs">
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">En Production & Brouillons</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-xl font-black font-mono text-amber-600 dark:text-amber-500">{stats.draft + stats.inProgress}</span>
            <span className="text-xs text-neutral-400">idées</span>
          </div>
          <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1 rounded-full mt-3 overflow-hidden">
            <div style={{ width: `${stats.total > 0 ? ((stats.draft + stats.inProgress) / stats.total) * 100 : 0}%` }} className="bg-amber-400 h-full" />
          </div>
        </div>

      </div>

      {/* FILTER BAR AND CALENDAR NAVIGATION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-neutral-50 dark:bg-zinc-950 p-4 rounded-2xl border border-neutral-200/60 dark:border-neutral-800">
        
        {/* Navigation Controls */}
        <div className="flex items-center gap-3">
          <button 
            onClick={prevMonth}
            className="p-1.5 hover:bg-neutral-200/60 dark:hover:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-zinc-900 cursor-pointer text-neutral-600 dark:text-neutral-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="text-xs font-black uppercase text-neutral-900 dark:text-neutral-50 tracking-wider min-w-[120px] text-center">
            {monthLabels[month]} {year}
          </div>

          <button 
            onClick={nextMonth}
            className="p-1.5 hover:bg-neutral-200/60 dark:hover:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-zinc-900 cursor-pointer text-neutral-600 dark:text-neutral-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Quick jump to current July 2026 */}
          {(year !== 2026 || month !== 6) && (
            <button
              onClick={() => setCurrentDate(new Date(2026, 6, 1))}
              className="text-[10px] font-black uppercase tracking-wider bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 text-indigo-600 hover:bg-neutral-100 px-2 py-1 rounded-lg"
            >
              Juillet 2026
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-bold shrink-0">
            <Filter className="w-3.5 h-3.5 text-neutral-400" />
            <span>Filtrer :</span>
          </div>

          {/* Channel selector */}
          <select
            value={filterChannel}
            onChange={(e) => setFilterChannel(e.target.value)}
            className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none cursor-pointer"
          >
            <option value="all">Toutes les chaînes</option>
            {availableChannels.map(ch => (
              <option key={ch} value={ch}>{ch}</option>
            ))}
          </select>

          {/* Status selector */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none cursor-pointer"
          >
            <option value="all">Tous les Statuts</option>
            <option value="Brouillon">Brouillon</option>
            <option value="En cours">En cours</option>
            <option value="Planifié">Planifié</option>
            <option value="Publié">Publié</option>
          </select>

          {/* Format Selector */}
          <select
            value={filterFormat}
            onChange={(e) => setFilterFormat(e.target.value)}
            className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-2.5 py-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none cursor-pointer"
          >
            <option value="all">Tous les Formats</option>
            <option value="Vidéo Longue">Vidéo Longue</option>
            <option value="Short / Reel">Short / Reel</option>
            <option value="Carrousel">Carrousel</option>
            <option value="Post Écrit">Post Écrit</option>
            <option value="Podcast">Podcast</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

      </div>

      {/* --- RENDER MODES --- */}
      {viewMode === 'calendar' ? (
        
        /* CALENDAR GRID VIEW */
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-3xs">
          
          {/* Days of Week Header */}
          <div className="grid grid-cols-7 border-b border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-zinc-950/20">
            {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((dayName, idx) => (
              <div 
                key={idx} 
                className="py-2.5 text-center text-[10px] font-black uppercase text-neutral-400 tracking-wider border-r border-neutral-100 last:border-r-0 dark:border-neutral-800"
              >
                {dayName}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 auto-rows-[140px] md:auto-rows-[160px]">
            {/* Blank cells before the 1st of month */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div 
                key={`empty-${idx}`} 
                className="bg-neutral-50/30 dark:bg-zinc-950/5 border-r border-b border-neutral-100 dark:border-neutral-800"
              />
            ))}

            {/* Actual Month Days */}
            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNumber = idx + 1;
              const formattedDay = String(dayNumber).padStart(2, '0');
              const formattedMonth = String(month + 1).padStart(2, '0');
              const cellDateStr = `${year}-${formattedMonth}-${formattedDay}`;

              // Find events scheduled on this day (already filtered by filters!)
              const dayEvents = filteredEvents.filter(e => e.scheduledDate === cellDateStr);

              const isToday = new Date().toDateString() === new Date(year, month, dayNumber).toDateString();
              const isDraggedOver = draggedOverDate === cellDateStr;

              return (
                <div 
                  key={`day-${dayNumber}`}
                  onDragOver={handleDragOver}
                  onDragEnter={(e) => handleDragEnter(e, cellDateStr)}
                  onDragLeave={(e) => handleDragLeave(e, cellDateStr)}
                  onDrop={(e) => handleDrop(e, cellDateStr)}
                  className={`border-r border-b border-neutral-100 dark:border-neutral-800 p-2 flex flex-col justify-between group transition-all relative overflow-hidden ${
                    isDraggedOver 
                      ? 'bg-indigo-50/40 dark:bg-indigo-950/30 ring-2 ring-indigo-500 ring-inset scale-[0.98]' 
                      : 'hover:bg-neutral-50/30 dark:hover:bg-zinc-950/10'
                  }`}
                >
                  {/* Day number header */}
                  <div className="flex justify-between items-center mb-1">
                    <span 
                      className={`text-[11px] font-black font-mono w-5 h-5 flex items-center justify-center rounded-full ${
                        isToday 
                          ? 'bg-indigo-600 text-white shadow-3xs font-black' 
                          : 'text-neutral-500 dark:text-neutral-400'
                      }`}
                    >
                      {dayNumber}
                    </span>

                    {/* Quick plus trigger */}
                    <button
                      onClick={() => openAddForDay(dayNumber)}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-400 hover:text-indigo-600 hover:bg-neutral-100 rounded-md transition-all cursor-pointer"
                      title="Planifier ce jour"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Events list within cell */}
                  <div className="flex-1 overflow-y-auto space-y-1 pr-0.5 max-h-[100px] scrollbar-thin">
                    {dayEvents.map(evt => {
                      const colors = getPlatformColors(evt.platform);
                      return (
                        <div
                          key={evt.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, evt.id)}
                          onClick={(e) => {
                            if (e.defaultPrevented) return;
                            handleEditStart(evt);
                          }}
                          className={`p-1 rounded-md text-[10px] font-semibold border ${colors.bg} cursor-grab active:cursor-grabbing truncate leading-normal hover:scale-[1.02] transition-transform select-none`}
                          title={`${evt.channelName} (${evt.platform})\n${evt.title}\nFormat: ${evt.contentType}\nStatut: ${evt.status} (Glissez-déposez pour reprogrammer)`}
                        >
                          <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${evt.status === "Publié" ? "bg-emerald-500" : evt.status === "Planifié" ? "bg-indigo-500" : evt.status === "En cours" ? "bg-amber-500" : "bg-neutral-400"}`} />
                          <span className="font-extrabold font-mono opacity-80 mr-0.5 uppercase">
                            {evt.platform.substring(0, 2)}:
                          </span>
                          {evt.title}
                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>

        </div>

      ) : (
        
        /* LIST VIEW (Gives a chronological layout, extremely good on small screens) */
        <div className="space-y-3.5">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-16 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl bg-neutral-50/20">
              <AlertCircle className="w-8 h-8 text-neutral-300 mx-auto mb-2.5" />
              <h4 className="text-xs font-bold text-neutral-600 dark:text-neutral-400">Aucune publication trouvée</h4>
              <p className="text-[11px] text-neutral-400 mt-1 max-w-xs mx-auto">
                Aucun événement ne correspond à vos filtres pour cette période.
              </p>
              <button
                onClick={() => { resetForm(); setShowModal(true); }}
                className="mt-4 text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mx-auto bg-white border border-neutral-200 px-3 py-1.5 rounded-lg shadow-3xs cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Créer une publication</span>
              </button>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-3xs divide-y divide-neutral-100 dark:divide-neutral-800">
              {filteredEvents
                .sort((a, b) => a.scheduledDate.localeCompare(b.scheduledDate))
                .map(evt => {
                  const colors = getPlatformColors(evt.platform);
                  
                  return (
                    <div 
                      key={evt.id} 
                      className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-neutral-50/30 transition-colors"
                    >
                      {/* Left: Date & Identity */}
                      <div className="flex items-start gap-3 md:max-w-xs">
                        <div className="bg-neutral-100 dark:bg-zinc-950 p-2 rounded-xl text-center min-w-[54px] shrink-0 border border-neutral-200/60 dark:border-neutral-800">
                          <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest block">Date</span>
                          <span className="text-xs font-black font-mono text-neutral-900 dark:text-neutral-50 block mt-0.5">
                            {evt.scheduledDate.split("-")[2]}/{evt.scheduledDate.split("-")[1]}
                          </span>
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-black text-neutral-900 dark:text-neutral-50">
                              {evt.channelName}
                            </span>
                            <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${colors.bg}`}>
                              {evt.platform}
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-neutral-400 mt-0.5 font-semibold">
                            Format: <span className="text-neutral-600 dark:text-neutral-300">{evt.contentType}</span>
                          </p>
                        </div>
                      </div>

                      {/* Middle: Title & Notes */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-black text-neutral-900 dark:text-neutral-50 leading-relaxed truncate">
                          {evt.title}
                        </h4>
                        {evt.notes ? (
                          <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-1 line-clamp-1 italic">
                            {evt.notes}
                          </p>
                        ) : (
                          <span className="text-[10px] text-neutral-300 dark:text-neutral-700 italic block mt-0.5">Aucune note</span>
                        )}
                      </div>

                      {/* Right: Status badge & Action buttons */}
                      <div className="flex items-center justify-between md:justify-end gap-3 shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${getStatusBadge(evt.status)}`}>
                            {evt.status}
                          </span>

                          {/* Quick publish checkmark */}
                          {evt.status !== "Publié" && (
                            <button
                              onClick={() => handleQuickStatusChange(evt.id, "Publié")}
                              className="p-1 text-emerald-500 hover:bg-emerald-50 rounded-lg cursor-pointer"
                              title="Marquer comme Publié"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleEditStart(evt)}
                            className="p-1.5 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg cursor-pointer"
                            title="Modifier"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(evt.id)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-lg cursor-pointer"
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

      )}

      {/* ADD / EDIT DIALOG FORM MODAL */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-5 shadow-2xl w-full max-w-lg"
            >
              
              <div className="flex justify-between items-center mb-4 pb-2.5 border-b border-neutral-100 dark:border-neutral-800">
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                  <Plus className="w-4 h-4 text-indigo-500" />
                  {editingEventId ? "Modifier la Publication" : "Planifier une nouvelle publication"}
                </h4>
                <button 
                  onClick={() => { resetForm(); setShowModal(false); }}
                  className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                
                {/* Subject / Title */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Titre de la Publication / Sujet de Vidéo</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 5 Conseils d'investissement immobilier au Maroc"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Channel dropdown */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Chaîne Cible</label>
                    <select
                      value={formChannelName}
                      onChange={(e) => setFormChannelName(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none cursor-pointer"
                    >
                      {availableChannels.map(ch => (
                        <option key={ch} value={ch}>{ch}</option>
                      ))}
                      <option value="Autre / Custom">Autre / Custom...</option>
                    </select>
                  </div>

                  {/* Platform selection */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Réseau Social / Plateforme</label>
                    <select
                      value={formPlatform}
                      onChange={(e) => setFormPlatform(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none cursor-pointer"
                    >
                      <option value="YouTube">YouTube</option>
                      <option value="TikTok">TikTok</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Spotify">Spotify / Podcast</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                </div>

                {formChannelName === "Autre / Custom" && (
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Nom du Canal Custom</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ma Newsletter Bourse"
                      value={customChannelName}
                      onChange={(e) => setCustomChannelName(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Scheduled Date */}
                  <div className="sm:col-span-1">
                    <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Date de sortie</label>
                    <input
                      type="date"
                      required
                      value={formScheduledDate}
                      onChange={(e) => setFormScheduledDate(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none"
                    />
                  </div>

                  {/* Format/Type */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Format de contenu</label>
                    <select
                      value={formContentType}
                      onChange={(e) => setFormContentType(e.target.value as EditorialEvent["contentType"])}
                      className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none cursor-pointer"
                    >
                      <option value="Vidéo Longue">Vidéo Longue</option>
                      <option value="Short / Reel">Short / Reel</option>
                      <option value="Carrousel">Carrousel</option>
                      <option value="Post Écrit">Post Écrit</option>
                      <option value="Podcast">Podcast</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">État de préparation</label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as EditorialEvent["status"])}
                      className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none cursor-pointer"
                    >
                      <option value="Brouillon">Brouillon</option>
                      <option value="En cours">En cours</option>
                      <option value="Planifié">Planifié</option>
                      <option value="Publié">Publié</option>
                    </select>
                  </div>
                </div>

                {/* Notes & script details */}
                <div>
                  <label className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block mb-1">Notes de tournage, Script, Idées de Miniature</label>
                  <textarea
                    placeholder="e.g. Structure du script: 1. Introduction captivante... 2. Analyse des graphiques... 3. Recommandations. Lien Gdoc du script : ..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    rows={3}
                    className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3.5 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
                  />
                </div>

                {/* Footer buttons */}
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { resetForm(); setShowModal(false); }}
                    className="px-4 py-2 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-500 hover:text-neutral-700 text-xs font-bold cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-4.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>{editingEventId ? "Mettre à jour" : "Planifier"}</span>
                  </button>
                </div>

              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
