import React, { useState, useMemo, useEffect } from "react";
import { EditorialEvent, ProjectFolder } from "../types";
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
  HelpCircle,
  RefreshCw,
  CloudLightning,
  Link2,
  Unlink
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { User } from "firebase/auth";
import { 
  googleSignIn, 
  initAuth, 
  logout as googleLogout, 
  fetchGoogleEvents, 
  createGoogleEvent, 
  updateGoogleEvent, 
  deleteGoogleEvent 
} from "../googleCalendarService";
import {
  isOutlookConnected,
  getOutlookAccessToken,
  loginOutlook,
  logoutOutlook,
  fetchOutlookEvents,
  createOutlookEvent,
  updateOutlookEvent,
  deleteOutlookEvent,
  OutlookEvent
} from "../outlookCalendarService";

interface EditorialCalendarSectionProps {
  events: EditorialEvent[];
  setEvents: React.Dispatch<React.SetStateAction<EditorialEvent[]>>;
  folders?: ProjectFolder[];
  setFolders?: React.Dispatch<React.SetStateAction<ProjectFolder[]>>;
  availableChannels?: string[];
}

export default function EditorialCalendarSection({ 
  events = [], 
  setEvents,
  folders = [],
  setFolders,
  availableChannels = [
    "The Moroccan Analyst", 
    "The Moroccan CFO", 
    "The Moroccan Economist", 
    "The MA Circle"
  ]
}: EditorialCalendarSectionProps) {
  
  // View mode: 'calendar' or 'list' or 'kanban'
  const [viewMode, setViewMode] = useState<'calendar' | 'list' | 'kanban'>('calendar');

  // Google Calendar Integration State
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [googleToken, setGoogleToken] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<{ type: "success" | "error" | "info"; text: string } | null>(null);

  // Outlook Calendar Integration State
  const [outlookToken, setOutlookToken] = useState<string | null>(null);
  const [isOutlookLinked, setIsOutlookLinked] = useState(false);

  useEffect(() => {
    const checkOutlook = async () => {
      const token = await getOutlookAccessToken();
      if (token) {
        setOutlookToken(token);
        setIsOutlookLinked(true);
      } else {
        setOutlookToken(null);
        setIsOutlookLinked(false);
      }
    };
    checkOutlook();
  }, []);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setGoogleToken(token);
      },
      () => {
        setGoogleUser(null);
        setGoogleToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

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

  // --- GOOGLE CALENDAR SYNC HANDLERS ---
  const handleGoogleSignInClick = async () => {
    setIsSyncing(true);
    setSyncStatusMsg({ type: "info", text: "Connexion à Google en cours..." });
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setGoogleToken(result.accessToken);
        setSyncStatusMsg({ type: "success", text: `Connecté avec succès : ${result.user.email}` });
      }
    } catch (err: any) {
      console.error(err);
      setSyncStatusMsg({ type: "error", text: `Connexion échouée : ${err.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleGoogleLogoutClick = async () => {
    setIsSyncing(true);
    try {
      await googleLogout();
      setGoogleUser(null);
      setGoogleToken(null);
      setSyncStatusMsg({ type: "success", text: "Déconnecté du compte Google." });
    } catch (err: any) {
      console.error(err);
      setSyncStatusMsg({ type: "error", text: `Erreur déconnexion : ${err.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleImportGoogleEvents = async () => {
    if (!googleToken) {
      setSyncStatusMsg({ type: "error", text: "Veuillez d'abord vous connecter à Google Calendar." });
      return;
    }
    setIsSyncing(true);
    setSyncStatusMsg({ type: "info", text: "Récupération de vos événements Google..." });
    try {
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month + 2, 1).toISOString();
      const gEvents = await fetchGoogleEvents(googleToken, startDate, endDate);

      let importedCount = 0;
      const updatedEvents = [...events];

      gEvents.forEach(ge => {
        if (!ge.id || !ge.summary) return;

        const alreadyExists = events.some(e => e.googleEventId === ge.id || e.id === ge.id || e.id === "ge_" + ge.id);
        if (alreadyExists) return;

        let dateStr = "";
        if (ge.start.date) {
          dateStr = ge.start.date;
        } else if (ge.start.dateTime) {
          dateStr = ge.start.dateTime.split("T")[0];
        }

        if (!dateStr) return;

        let platform = "YouTube";
        let title = ge.summary;
        const upperSummary = ge.summary.toUpperCase();
        if (upperSummary.includes("[YOUTUBE]")) {
          platform = "YouTube";
          title = ge.summary.replace(/\[YOUTUBE\]/i, "").trim();
        } else if (upperSummary.includes("[TIKTOK]")) {
          platform = "TikTok";
          title = ge.summary.replace(/\[TIKTOK\]/i, "").trim();
        } else if (upperSummary.includes("[LINKEDIN]")) {
          platform = "LinkedIn";
          title = ge.summary.replace(/\[LINKEDIN\]/i, "").trim();
        } else if (upperSummary.includes("[INSTAGRAM]")) {
          platform = "Instagram";
          title = ge.summary.replace(/\[INSTAGRAM\]/i, "").trim();
        } else if (upperSummary.includes("[SPOTIFY]")) {
          platform = "Spotify";
          title = ge.summary.replace(/\[SPOTIFY\]/i, "").trim();
        }

        let contentType: EditorialEvent["contentType"] = "Vidéo Longue";
        if (platform === "TikTok" || platform === "Instagram") contentType = "Short / Reel";
        if (platform === "LinkedIn") contentType = "Post Écrit";
        if (platform === "Spotify") contentType = "Podcast";

        updatedEvents.push({
          id: "ge_" + ge.id,
          title: title,
          channelName: "The Moroccan Analyst",
          platform: platform,
          scheduledDate: dateStr,
          status: "Planifié",
          contentType: contentType,
          notes: ge.description || "Importé automatiquement de Google Calendar",
          googleEventId: ge.id
        });
        importedCount++;
      });

      if (importedCount > 0) {
        setEvents(updatedEvents);
        setSyncStatusMsg({ type: "success", text: `${importedCount} événement(s) importé(s) de Google Calendar !` });
      } else {
        setSyncStatusMsg({ type: "success", text: "Votre calendrier est déjà synchronisé." });
      }
    } catch (err: any) {
      console.error(err);
      setSyncStatusMsg({ type: "error", text: `Erreur d'importation : ${err.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportGoogleEvents = async () => {
    if (!googleToken) {
      setSyncStatusMsg({ type: "error", text: "Veuillez d'abord vous connecter à Google Calendar." });
      return;
    }

    const toExport = events.filter(e => !e.googleEventId);
    if (toExport.length === 0) {
      setSyncStatusMsg({ type: "info", text: "Toutes vos publications sont déjà exportées sur Google Calendar." });
      return;
    }

    const confirmExport = window.confirm(
      `Voulez-vous exporter ${toExport.length} publication(s) locales vers votre Google Calendar ?`
    );
    if (!confirmExport) return;

    setIsSyncing(true);
    setSyncStatusMsg({ type: "info", text: `Exportation de ${toExport.length} événements vers Google Calendar...` });

    try {
      let exportedCount = 0;
      const updatedEvents = [...events];

      for (const evt of toExport) {
        const payload = {
          summary: `[${evt.platform.toUpperCase()}] ${evt.title}`,
          description: `Canal : ${evt.channelName}\nFormat : ${evt.contentType}\nStatut : ${evt.status}\n\nNotes :\n${evt.notes || ""}`,
          start: { date: evt.scheduledDate },
          end: { date: evt.scheduledDate }
        };

        const createdGe = await createGoogleEvent(googleToken, payload);
        const idx = updatedEvents.findIndex(item => item.id === evt.id);
        if (idx !== -1) {
          updatedEvents[idx] = {
            ...updatedEvents[idx],
            googleEventId: createdGe.id
          };
        }
        exportedCount++;
      }

      setEvents(updatedEvents);
      setSyncStatusMsg({ type: "success", text: `${exportedCount} publications exportées vers Google Calendar !` });
    } catch (err: any) {
      console.error(err);
      setSyncStatusMsg({ type: "error", text: `Erreur d'exportation : ${err.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleFullTwoWaySync = async () => {
    if (!googleToken) return;
    setIsSyncing(true);
    setSyncStatusMsg({ type: "info", text: "Synchronisation automatique bidirectionnelle..." });
    try {
      // 1. Export local publications
      const toExport = events.filter(e => !e.googleEventId);
      let exportCount = 0;
      const updatedEvents = [...events];

      for (const evt of toExport) {
        const payload = {
          summary: `[${evt.platform.toUpperCase()}] ${evt.title}`,
          description: `Canal : ${evt.channelName}\nFormat : ${evt.contentType}\nStatut : ${evt.status}\n\nNotes :\n${evt.notes || ""}`,
          start: { date: evt.scheduledDate },
          end: { date: evt.scheduledDate }
        };
        const createdGe = await createGoogleEvent(googleToken, payload);
        const idx = updatedEvents.findIndex(item => item.id === evt.id);
        if (idx !== -1) {
          updatedEvents[idx].googleEventId = createdGe.id;
        }
        exportCount++;
      }

      // 2. Import from Google
      const startDate = new Date(year, month - 1, 1).toISOString();
      const endDate = new Date(year, month + 2, 1).toISOString();
      const gEvents = await fetchGoogleEvents(googleToken, startDate, endDate);
      let importCount = 0;

      gEvents.forEach(ge => {
        if (!ge.id || !ge.summary) return;
        const alreadyExists = updatedEvents.some(e => e.googleEventId === ge.id || e.id === ge.id || e.id === "ge_" + ge.id);
        if (alreadyExists) return;

        let dateStr = "";
        if (ge.start.date) dateStr = ge.start.date;
        else if (ge.start.dateTime) dateStr = ge.start.dateTime.split("T")[0];

        if (!dateStr) return;

        let platform = "YouTube";
        let title = ge.summary;
        const upperSummary = ge.summary.toUpperCase();
        if (upperSummary.includes("[YOUTUBE]")) {
          platform = "YouTube";
          title = ge.summary.replace(/\[YOUTUBE\]/i, "").trim();
        } else if (upperSummary.includes("[TIKTOK]")) {
          platform = "TikTok";
          title = ge.summary.replace(/\[TIKTOK\]/i, "").trim();
        } else if (upperSummary.includes("[LINKEDIN]")) {
          platform = "LinkedIn";
          title = ge.summary.replace(/\[LINKEDIN\]/i, "").trim();
        } else if (upperSummary.includes("[INSTAGRAM]")) {
          platform = "Instagram";
          title = ge.summary.replace(/\[INSTAGRAM\]/i, "").trim();
        } else if (upperSummary.includes("[SPOTIFY]")) {
          platform = "Spotify";
          title = ge.summary.replace(/\[SPOTIFY\]/i, "").trim();
        }

        let contentType: EditorialEvent["contentType"] = "Vidéo Longue";
        if (platform === "TikTok" || platform === "Instagram") contentType = "Short / Reel";
        if (platform === "LinkedIn") contentType = "Post Écrit";
        if (platform === "Spotify") contentType = "Podcast";

        updatedEvents.push({
          id: "ge_" + ge.id,
          title: title,
          channelName: "The Moroccan Analyst",
          platform: platform,
          scheduledDate: dateStr,
          status: "Planifié",
          contentType: contentType,
          notes: ge.description || "Importé automatiquement de Google Calendar",
          googleEventId: ge.id
        });
        importCount++;
      });

      setEvents(updatedEvents);
      setSyncStatusMsg({
        type: "success",
        text: `Synchronisation automatique terminée ! Export : ${exportCount} | Import : ${importCount}`
      });
    } catch (err: any) {
      console.error(err);
      setSyncStatusMsg({ type: "error", text: `Erreur synchronisation automatique : ${err.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  // --- OUTLOOK CALENDAR SYNC HANDLERS ---
  const handleOutlookSignInClick = async () => {
    setIsSyncing(true);
    setSyncStatusMsg({ type: "info", text: "Connexion à Outlook en cours..." });
    try {
      const success = await loginOutlook(window.location.origin);
      if (success) {
        const token = await getOutlookAccessToken();
        setOutlookToken(token);
        setIsOutlookLinked(true);
        setSyncStatusMsg({ type: "success", text: "Connecté avec succès à votre compte Outlook !" });
      }
    } catch (err: any) {
      console.error(err);
      setSyncStatusMsg({ type: "error", text: `Connexion Outlook échouée : ${err.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOutlookLogoutClick = async () => {
    setIsSyncing(true);
    try {
      logoutOutlook();
      setOutlookToken(null);
      setIsOutlookLinked(false);
      setSyncStatusMsg({ type: "success", text: "Déconnecté du compte Outlook." });
    } catch (err: any) {
      console.error(err);
      setSyncStatusMsg({ type: "error", text: `Erreur déconnexion Outlook : ${err.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleImportOutlookEvents = async () => {
    const token = await getOutlookAccessToken();
    if (!token) {
      setSyncStatusMsg({ type: "error", text: "Veuillez d'abord vous connecter à Outlook." });
      return;
    }
    setIsSyncing(true);
    setSyncStatusMsg({ type: "info", text: "Récupération de vos événements Outlook..." });
    try {
      // Fetch for previous month up to 3 months ahead
      const startDate = new Date(year, month - 1, 1).toISOString().split(".")[0];
      const endDate = new Date(year, month + 2, 1).toISOString().split(".")[0];
      const oEvents = await fetchOutlookEvents(token, startDate, endDate);

      let importedCount = 0;
      const updatedEvents = [...events];

      oEvents.forEach(oe => {
        if (!oe.id || !oe.subject) return;

        const alreadyExists = events.some(e => e.outlookEventId === oe.id || e.id === oe.id || e.id === "oe_" + oe.id);
        if (alreadyExists) return;

        const dateStr = oe.start.dateTime.split("T")[0];
        if (!dateStr) return;

        let platform = "YouTube";
        let title = oe.subject;
        const upperSubject = oe.subject.toUpperCase();
        if (upperSubject.includes("[YOUTUBE]")) {
          platform = "YouTube";
          title = oe.subject.replace(/\[YOUTUBE\]/i, "").trim();
        } else if (upperSubject.includes("[TIKTOK]")) {
          platform = "TikTok";
          title = oe.subject.replace(/\[TIKTOK\]/i, "").trim();
        } else if (upperSubject.includes("[LINKEDIN]")) {
          platform = "LinkedIn";
          title = oe.subject.replace(/\[LINKEDIN\]/i, "").trim();
        } else if (upperSubject.includes("[INSTAGRAM]")) {
          platform = "Instagram";
          title = oe.subject.replace(/\[INSTAGRAM\]/i, "").trim();
        } else if (upperSubject.includes("[SPOTIFY]")) {
          platform = "Spotify";
          title = oe.subject.replace(/\[SPOTIFY\]/i, "").trim();
        }

        let contentType: EditorialEvent["contentType"] = "Vidéo Longue";
        if (platform === "TikTok" || platform === "Instagram") contentType = "Short / Reel";
        if (platform === "LinkedIn") contentType = "Post Écrit";
        if (platform === "Spotify") contentType = "Podcast";

        updatedEvents.push({
          id: "oe_" + oe.id,
          title: title,
          channelName: "The Moroccan Analyst",
          platform: platform,
          scheduledDate: dateStr,
          status: "Planifié",
          contentType: contentType,
          notes: oe.body?.content || "Importé automatiquement d'Outlook Calendar",
          outlookEventId: oe.id
        });
        importedCount++;
      });

      if (importedCount > 0) {
        setEvents(updatedEvents);
        setSyncStatusMsg({ type: "success", text: `${importedCount} événement(s) importé(s) d'Outlook !` });
      } else {
        setSyncStatusMsg({ type: "success", text: "Votre calendrier Outlook est déjà synchronisé." });
      }
    } catch (err: any) {
      console.error(err);
      setSyncStatusMsg({ type: "error", text: `Erreur d'importation Outlook : ${err.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleExportOutlookEvents = async () => {
    const token = await getOutlookAccessToken();
    if (!token) {
      setSyncStatusMsg({ type: "error", text: "Veuillez d'abord vous connecter à Outlook." });
      return;
    }

    const toExport = events.filter(e => !e.outlookEventId);
    if (toExport.length === 0) {
      setSyncStatusMsg({ type: "info", text: "Toutes vos publications sont déjà exportées sur Outlook." });
      return;
    }

    const confirmExport = window.confirm(
      `Voulez-vous exporter ${toExport.length} publication(s) locales vers votre compte Outlook ?`
    );
    if (!confirmExport) return;

    setIsSyncing(true);
    setSyncStatusMsg({ type: "info", text: `Exportation de ${toExport.length} événements vers Outlook...` });

    try {
      let exportedCount = 0;
      const updatedEvents = [...events];

      for (const evt of toExport) {
        const payload: OutlookEvent = {
          subject: `[${evt.platform.toUpperCase()}] ${evt.title}`,
          body: {
            contentType: "text",
            content: `Canal : ${evt.channelName}\nFormat : ${evt.contentType}\nStatut : ${evt.status}\n\nNotes :\n${evt.notes || ""}`
          },
          start: {
            dateTime: `${evt.scheduledDate}T09:00:00`,
            timeZone: "UTC"
          },
          end: {
            dateTime: `${evt.scheduledDate}T10:00:00`,
            timeZone: "UTC"
          }
        };

        const createdOe = await createOutlookEvent(token, payload);
        const idx = updatedEvents.findIndex(item => item.id === evt.id);
        if (idx !== -1) {
          updatedEvents[idx] = {
            ...updatedEvents[idx],
            outlookEventId: createdOe.id
          };
        }
        exportedCount++;
      }

      setEvents(updatedEvents);
      setSyncStatusMsg({ type: "success", text: `${exportedCount} publications exportées vers Outlook !` });
    } catch (err: any) {
      console.error(err);
      setSyncStatusMsg({ type: "error", text: `Erreur d'exportation Outlook : ${err.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  const handleOutlookTwoWaySync = async () => {
    const token = await getOutlookAccessToken();
    if (!token) return;
    setIsSyncing(true);
    setSyncStatusMsg({ type: "info", text: "Synchronisation automatique bidirectionnelle Outlook..." });
    try {
      // 1. Export local publications
      const toExport = events.filter(e => !e.outlookEventId);
      let exportCount = 0;
      const updatedEvents = [...events];

      for (const evt of toExport) {
        const payload: OutlookEvent = {
          subject: `[${evt.platform.toUpperCase()}] ${evt.title}`,
          body: {
            contentType: "text",
            content: `Canal : ${evt.channelName}\nFormat : ${evt.contentType}\nStatut : ${evt.status}\n\nNotes :\n${evt.notes || ""}`
          },
          start: {
            dateTime: `${evt.scheduledDate}T09:00:00`,
            timeZone: "UTC"
          },
          end: {
            dateTime: `${evt.scheduledDate}T10:00:00`,
            timeZone: "UTC"
          }
        };
        const createdOe = await createOutlookEvent(token, payload);
        const idx = updatedEvents.findIndex(item => item.id === evt.id);
        if (idx !== -1) {
          updatedEvents[idx].outlookEventId = createdOe.id;
        }
        exportCount++;
      }

      // 2. Import from Outlook
      const startDate = new Date(year, month - 1, 1).toISOString().split(".")[0];
      const endDate = new Date(year, month + 2, 1).toISOString().split(".")[0];
      const oEvents = await fetchOutlookEvents(token, startDate, endDate);
      let importCount = 0;

      oEvents.forEach(oe => {
        if (!oe.id || !oe.subject) return;
        const alreadyExists = updatedEvents.some(e => e.outlookEventId === oe.id || e.id === oe.id || e.id === "oe_" + oe.id);
        if (alreadyExists) return;

        const dateStr = oe.start.dateTime.split("T")[0];
        if (!dateStr) return;

        let platform = "YouTube";
        let title = oe.subject;
        const upperSubject = oe.subject.toUpperCase();
        if (upperSubject.includes("[YOUTUBE]")) {
          platform = "YouTube";
          title = oe.subject.replace(/\[YOUTUBE\]/i, "").trim();
        } else if (upperSubject.includes("[TIKTOK]")) {
          platform = "TikTok";
          title = oe.subject.replace(/\[TIKTOK\]/i, "").trim();
        } else if (upperSubject.includes("[LINKEDIN]")) {
          platform = "LinkedIn";
          title = oe.subject.replace(/\[LINKEDIN\]/i, "").trim();
        } else if (upperSubject.includes("[INSTAGRAM]")) {
          platform = "Instagram";
          title = oe.subject.replace(/\[INSTAGRAM\]/i, "").trim();
        } else if (upperSubject.includes("[SPOTIFY]")) {
          platform = "Spotify";
          title = oe.subject.replace(/\[SPOTIFY\]/i, "").trim();
        }

        let contentType: EditorialEvent["contentType"] = "Vidéo Longue";
        if (platform === "TikTok" || platform === "Instagram") contentType = "Short / Reel";
        if (platform === "LinkedIn") contentType = "Post Écrit";
        if (platform === "Spotify") contentType = "Podcast";

        updatedEvents.push({
          id: "oe_" + oe.id,
          title: title,
          channelName: "The Moroccan Analyst",
          platform: platform,
          scheduledDate: dateStr,
          status: "Planifié",
          contentType: contentType,
          notes: oe.body?.content || "Importé automatiquement d'Outlook Calendar",
          outlookEventId: oe.id
        });
        importCount++;
      });

      setEvents(updatedEvents);
      setSyncStatusMsg({
        type: "success",
        text: `Synchronisation Outlook terminée ! Export : ${exportCount} | Import : ${importCount}`
      });
    } catch (err: any) {
      console.error(err);
      setSyncStatusMsg({ type: "error", text: `Erreur synchronisation Outlook : ${err.message}` });
    } finally {
      setIsSyncing(false);
    }
  };

  // Add/Edit Submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const channelVal = formChannelName === "Autre / Custom" 
      ? (customChannelName.trim() || "Chaîne Autre")
      : formChannelName;

    if (editingEventId) {
      // Edit
      const oldEvt = events.find(evt => evt.id === editingEventId);
      const updatedEvt = {
        ...oldEvt!,
        title: formTitle.trim() || "Sans titre",
        channelName: channelVal,
        platform: formPlatform,
        scheduledDate: formScheduledDate,
        status: formStatus,
        contentType: formContentType,
        notes: formNotes.trim()
      };

      setEvents(prev => prev.map(evt => evt.id === editingEventId ? updatedEvt : evt));

      // Auto update Google Event if connected
      if (googleToken && updatedEvt.googleEventId) {
        updateGoogleEvent(googleToken, updatedEvt.googleEventId, {
          summary: `[${updatedEvt.platform.toUpperCase()}] ${updatedEvt.title}`,
          description: `Canal : ${updatedEvt.channelName}\nFormat : ${updatedEvt.contentType}\nStatut : ${updatedEvt.status}\n\nNotes :\n${updatedEvt.notes || ""}`,
          start: { date: updatedEvt.scheduledDate },
          end: { date: updatedEvt.scheduledDate }
        }).catch(err => console.error("Auto Google Calendar update failed:", err));
      }

      // Auto update Outlook Event if connected
      if (outlookToken && updatedEvt.outlookEventId) {
        updateOutlookEvent(outlookToken, updatedEvt.outlookEventId, {
          subject: `[${updatedEvt.platform.toUpperCase()}] ${updatedEvt.title}`,
          body: {
            contentType: "text",
            content: `Canal : ${updatedEvt.channelName}\nFormat : ${updatedEvt.contentType}\nStatut : ${updatedEvt.status}\n\nNotes :\n${updatedEvt.notes || ""}`
          },
          start: {
            dateTime: `${updatedEvt.scheduledDate}T09:00:00`,
            timeZone: "UTC"
          },
          end: {
            dateTime: `${updatedEvt.scheduledDate}T10:00:00`,
            timeZone: "UTC"
          }
        }).catch(err => console.error("Auto Outlook Calendar update failed:", err));
      }
    } else {
      // Create
      const newId = "ee_" + Date.now();
      const newEvent: EditorialEvent = {
        id: newId,
        title: formTitle.trim() || "Sans titre",
        channelName: channelVal,
        platform: formPlatform,
        scheduledDate: formScheduledDate,
        status: formStatus,
        contentType: formContentType,
        notes: formNotes.trim()
      };

      if (googleToken || outlookToken) {
        setIsSyncing(true);
        setSyncStatusMsg({ type: "info", text: "Création de la publication sur vos calendriers synchronisés..." });
        
        try {
          // Google Calendar integration
          if (googleToken) {
            try {
              const createdGe = await createGoogleEvent(googleToken, {
                summary: `[${newEvent.platform.toUpperCase()}] ${newEvent.title}`,
                description: `Canal : ${newEvent.channelName}\nFormat : ${newEvent.contentType}\nStatut : ${newEvent.status}\n\nNotes :\n${newEvent.notes || ""}`,
                start: { date: newEvent.scheduledDate },
                end: { date: newEvent.scheduledDate }
              });
              newEvent.googleEventId = createdGe.id;
            } catch (errG) {
              console.error("Auto Google Calendar creation failed:", errG);
            }
          }

          // Outlook Integration
          if (outlookToken) {
            try {
              const createdOe = await createOutlookEvent(outlookToken, {
                subject: `[${newEvent.platform.toUpperCase()}] ${newEvent.title}`,
                body: {
                  contentType: "text",
                  content: `Canal : ${newEvent.channelName}\nFormat : ${newEvent.contentType}\nStatut : ${newEvent.status}\n\nNotes :\n${newEvent.notes || ""}`
                },
                start: {
                  dateTime: `${newEvent.scheduledDate}T09:00:00`,
                  timeZone: "UTC"
                },
                end: {
                  dateTime: `${newEvent.scheduledDate}T10:00:00`,
                  timeZone: "UTC"
                }
              });
              newEvent.outlookEventId = createdOe.id;
            } catch (errO) {
              console.error("Auto Outlook Calendar creation failed:", errO);
            }
          }

          setEvents(prev => [...prev, newEvent]);
          setSyncStatusMsg({ type: "success", text: "Publication ajoutée et synchronisée avec vos calendriers !" });
        } catch (errAll) {
          console.error("Calendar creations failed:", errAll);
          setEvents(prev => [...prev, newEvent]);
        } finally {
          setIsSyncing(false);
        }
      } else {
        setEvents(prev => [...prev, newEvent]);
      }
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
    setEvents(prev => prev.map(evt => {
      if (evt.id === id) {
        const updated = { ...evt, status: newStatus };
        
        // Auto update Google Event if connected
        if (googleToken && updated.googleEventId) {
          updateGoogleEvent(googleToken, updated.googleEventId, {
            summary: `[${updated.platform.toUpperCase()}] ${updated.title}`,
            description: `Canal : ${updated.channelName}\nFormat : ${updated.contentType}\nStatut : ${updated.status}\n\nNotes :\n${updated.notes || ""}`
          }).catch(err => console.error("Google Calendar status update failed:", err));
        }

        // Auto update Outlook Event if connected
        if (outlookToken && updated.outlookEventId) {
          updateOutlookEvent(outlookToken, updated.outlookEventId, {
            subject: `[${updated.platform.toUpperCase()}] ${updated.title}`,
            body: {
              contentType: "text",
              content: `Canal : ${updated.channelName}\nFormat : ${updated.contentType}\nStatut : ${updated.status}\n\nNotes :\n${updated.notes || ""}`
            }
          }).catch(err => console.error("Outlook Calendar status update failed:", err));
        }

        return updated;
      }
      return evt;
    }));
  };

  const handleDelete = (id: string) => {
    const evtToDelete = events.find(evt => evt.id === id);
    if (confirm("Voulez-vous supprimer cet événement du calendrier éditorial ?")) {
      setEvents(prev => prev.filter(evt => evt.id !== id));

      if (googleToken && evtToDelete?.googleEventId) {
        deleteGoogleEvent(googleToken, evtToDelete.googleEventId)
          .then(() => {
            setSyncStatusMsg({ type: "success", text: "Événement supprimé localement et sur votre Google Calendar." });
          })
          .catch(err => console.error("Google Calendar event deletion failed:", err));
      }

      if (outlookToken && evtToDelete?.outlookEventId) {
        deleteOutlookEvent(outlookToken, evtToDelete.outlookEventId)
          .then(() => {
            setSyncStatusMsg({ type: "success", text: "Événement supprimé localement et de votre compte Outlook." });
          })
          .catch(err => console.error("Outlook Calendar event deletion failed:", err));
      }
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
        const updated = { ...evt, scheduledDate: targetDate };
        
        // Auto update Google Event if connected
        if (googleToken && updated.googleEventId) {
          updateGoogleEvent(googleToken, updated.googleEventId, {
            start: { date: targetDate },
            end: { date: targetDate }
          }).catch(err => console.error("Google Calendar drop update failed:", err));
        }

        // Auto update Outlook Event if connected
        if (outlookToken && updated.outlookEventId) {
          updateOutlookEvent(outlookToken, updated.outlookEventId, {
            start: { dateTime: `${targetDate}T09:00:00`, timeZone: "UTC" },
            end: { dateTime: `${targetDate}T10:00:00`, timeZone: "UTC" }
          }).catch(err => console.error("Outlook Calendar drop update failed:", err));
        }

        return updated;
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
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg transition-all text-xs font-bold cursor-pointer flex items-center gap-1 ${viewMode === 'kanban' ? 'bg-white dark:bg-zinc-900 text-neutral-900 dark:text-neutral-50 shadow-3xs' : 'text-neutral-400 hover:text-neutral-600'}`}
              title="Vue Kanban"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Kanban</span>
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

      {/* GOOGLE CALENDAR SYNC PANEL */}
      <div className="bg-neutral-50/50 dark:bg-zinc-900/30 border border-neutral-200/70 dark:border-neutral-800/70 p-4 rounded-2xl shadow-3xs flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-neutral-800 dark:text-neutral-100 uppercase tracking-wide flex items-center gap-2">
                <span>Synchronisation Google Calendar</span>
                {googleUser && (
                  <span className="inline-flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Automatique
                  </span>
                )}
              </h4>
              <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
                {googleUser 
                  ? "Votre calendrier éditorial local et votre Google Calendar sont connectés. Toute modification ou ajout de publication sera synchronisé instantanément !"
                  : "Connectez votre agenda Google pour synchroniser automatiquement vos dates de publication, éviter les doublons et recevoir des alertes par email."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
            {!googleUser ? (
              <button
                onClick={handleGoogleSignInClick}
                disabled={isSyncing}
                className="flex items-center gap-2.5 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-zinc-800 text-neutral-700 dark:text-neutral-200 text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-3xs cursor-pointer select-none disabled:opacity-50"
              >
                <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span>{isSyncing ? "Connexion..." : "Se connecter avec Google"}</span>
              </button>
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 bg-neutral-100 dark:bg-zinc-850 px-3 py-1.5 rounded-xl border border-neutral-200/50 dark:border-neutral-700/50">
                  {googleUser.photoURL ? (
                    <img 
                      src={googleUser.photoURL} 
                      alt="Avatar" 
                      className="w-4 h-4 rounded-full" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-indigo-500 text-white flex items-center justify-center text-[10px] font-bold">
                      {googleUser.email ? googleUser.email[0].toUpperCase() : "G"}
                    </div>
                  )}
                  <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300 max-w-[120px] truncate">
                    {googleUser.email}
                  </span>
                </div>

                <button
                  onClick={handleFullTwoWaySync}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-3xs cursor-pointer select-none disabled:opacity-50"
                  title="Lancer une synchronisation bidirectionnelle"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>Synchroniser</span>
                </button>

                <button
                  onClick={handleImportGoogleEvents}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-zinc-800 text-neutral-700 dark:text-neutral-200 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-3xs cursor-pointer select-none disabled:opacity-50"
                  title="Importer les événements de votre calendrier Google vers l'application"
                >
                  <span>Importer</span>
                </button>

                <button
                  onClick={handleExportGoogleEvents}
                  disabled={isSyncing}
                  className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-zinc-800 text-neutral-700 dark:text-neutral-200 text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-3xs cursor-pointer select-none disabled:opacity-50"
                  title="Exporter les publications créées localement vers Google Calendar"
                >
                  <span>Exporter</span>
                </button>

                <button
                  onClick={handleGoogleLogoutClick}
                  disabled={isSyncing}
                  className="bg-red-50 hover:bg-red-100 dark:bg-red-950/30 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 text-xs font-bold px-3 py-1.5 rounded-xl transition-all cursor-pointer select-none"
                  title="Se déconnecter"
                >
                  Déconnecter
                </button>
              </div>
            )}
          </div>
        </div>

        {syncStatusMsg && (
          <div className={`p-3 rounded-xl flex items-center justify-between text-xs font-bold border ${
            syncStatusMsg.type === "success" 
              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50" 
              : syncStatusMsg.type === "error"
              ? "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/50"
              : "bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border-blue-100 dark:border-blue-900/50"
          }`}>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              <span>{syncStatusMsg.text}</span>
            </div>
            <button 
              onClick={() => setSyncStatusMsg(null)}
              className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
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

      ) : viewMode === 'list' ? (
        
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

      ) : (
        
        /* TABLEAU KANBAN DE PRODUCTION DE CONTENU */
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4 scrollbar-thin">
          {[
            { id: "Brouillon", title: "1. Idée / Scripting", color: "bg-neutral-50/60 dark:bg-zinc-950/10 border-neutral-200 dark:border-neutral-800", iconColor: "bg-neutral-400", allowedStatuses: ["Brouillon", "Idée"] },
            { id: "Scénarisé", title: "2. Scénarisé", color: "bg-sky-500/5 border-sky-100/50 dark:bg-sky-950/10 dark:border-sky-900/30", iconColor: "bg-sky-400", allowedStatuses: ["Scénarisé"] },
            { id: "Tourné", title: "3. Tourné", color: "bg-purple-500/5 border-purple-100/50 dark:bg-purple-950/10 dark:border-purple-900/30", iconColor: "bg-purple-400", allowedStatuses: ["Tourné"] },
            { id: "En cours", title: "4. Montage", color: "bg-amber-500/5 border-amber-100/50 dark:bg-amber-950/10 dark:border-amber-900/30", iconColor: "bg-amber-400", allowedStatuses: ["En cours", "Monté"] },
            { id: "Planifié", title: "5. Prêt / Publié", color: "bg-emerald-500/5 border-emerald-100/50 dark:bg-emerald-950/10 dark:border-emerald-900/30", iconColor: "bg-emerald-400", allowedStatuses: ["Planifié", "Prêt à Publier", "Publié"] },
          ].map(column => {
            const columnEvents = filteredEvents.filter(e => column.allowedStatuses.includes(e.status));
            
            return (
              <div
                key={column.id}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const eventId = e.dataTransfer.getData("text/plain");
                  if (!eventId) return;
                  setEvents(prev => prev.map(evt => {
                    if (evt.id === eventId) {
                      // Map back to a valid status supported by system
                      let nextStatus: EditorialEvent["status"] = column.id as any;
                      if (column.id === "En cours") nextStatus = "En cours";
                      if (column.id === "Planifié") nextStatus = "Planifié";
                      if (column.id === "Brouillon") nextStatus = "Brouillon";
                      return { ...evt, status: nextStatus };
                    }
                    return evt;
                  }));
                }}
                className={`flex flex-col rounded-2xl border p-3.5 min-w-[220px] max-w-[280px] h-[550px] shrink-0 ${column.color}`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-neutral-200/50 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${column.iconColor}`} />
                    <h4 className="text-[11px] font-black text-neutral-800 dark:text-neutral-200 tracking-tight uppercase">
                      {column.title}
                    </h4>
                  </div>
                  <span className="text-[9px] bg-white dark:bg-zinc-950 text-neutral-600 dark:text-neutral-400 font-extrabold font-mono px-2 py-0.5 rounded-md border border-neutral-200/60 dark:border-neutral-800">
                    {columnEvents.length}
                  </span>
                </div>

                {/* Column Body - Cards List */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5 scrollbar-thin">
                  {columnEvents.length === 0 ? (
                    <div className="text-center py-12 text-[10px] text-neutral-400 italic border border-dashed border-neutral-200/50 dark:border-neutral-800 rounded-xl bg-white/20 dark:bg-zinc-950/5 flex flex-col justify-center items-center gap-1.5">
                      <span className="text-sm">📌</span>
                      <span>Glisser un sujet ici</span>
                    </div>
                  ) : (
                    columnEvents.map(evt => {
                      const colors = getPlatformColors(evt.platform);
                      
                      // Move card one click to the left
                      const handleMoveLeft = (e: React.MouseEvent) => {
                        e.stopPropagation();
                        const stages = ["Brouillon", "Scénarisé", "Tourné", "En cours", "Planifié"];
                        const currentIdx = stages.indexOf(column.id);
                        if (currentIdx > 0) {
                          const nextStatus = stages[currentIdx - 1];
                          setEvents(prev => prev.map(e => e.id === evt.id ? { ...e, status: nextStatus as any } : e));
                        }
                      };

                      // Move card one click to the right
                      const handleMoveRight = (e: React.MouseEvent) => {
                        e.stopPropagation();
                        const stages = ["Brouillon", "Scénarisé", "Tourné", "En cours", "Planifié"];
                        const currentIdx = stages.indexOf(column.id);
                        if (currentIdx < stages.length - 1 && currentIdx >= 0) {
                          const nextStatus = stages[currentIdx + 1];
                          setEvents(prev => prev.map(e => e.id === evt.id ? { ...e, status: nextStatus as any } : e));
                        }
                      };

                      const currentStageIdx = ["Brouillon", "Scénarisé", "Tourné", "En cours", "Planifié"].indexOf(column.id);

                      return (
                        <div
                          key={evt.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, evt.id)}
                          onClick={() => handleEditStart(evt)}
                          className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl hover:shadow-2xs transition-all cursor-grab active:cursor-grabbing space-y-2.5 hover:border-neutral-400 dark:hover:border-neutral-700"
                        >
                          <div className="flex items-center justify-between">
                            <span className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${colors.bg}`}>
                              {evt.platform}
                            </span>
                            <span className="text-[8px] text-neutral-400 font-bold font-mono">
                              {evt.scheduledDate.split("-")[2]}/{evt.scheduledDate.split("-")[1]}
                            </span>
                          </div>

                          <div>
                            <h5 className="text-[10px] font-black text-neutral-800 dark:text-neutral-100 leading-snug line-clamp-2">
                              {evt.title}
                            </h5>
                            <span className="text-[8px] text-neutral-400 font-bold block mt-1 font-mono">
                              {evt.channelName}
                            </span>
                          </div>

                          {/* Footer with actions and Arrows */}
                          <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                            {/* Action Tools */}
                            <div className="flex items-center gap-0.5">
                              <button
                                onClick={(e) => { e.stopPropagation(); handleEditStart(evt); }}
                                className="p-1 text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-lg cursor-pointer"
                                title="Modifier"
                              >
                                <Edit className="w-3 h-3" />
                              </button>
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(evt.id); }}
                                className="p-1 text-neutral-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg cursor-pointer"
                                title="Supprimer"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Click to Move */}
                            <div className="flex items-center gap-0.5 bg-neutral-100 dark:bg-zinc-800 p-0.5 rounded-md">
                              <button
                                onClick={handleMoveLeft}
                                disabled={currentStageIdx === 0}
                                className={`p-0.5 rounded-md transition-all ${currentStageIdx === 0 ? "text-neutral-300 dark:text-zinc-700 cursor-not-allowed" : "text-neutral-600 hover:bg-white dark:text-neutral-300 dark:hover:bg-zinc-900 cursor-pointer"}`}
                                title="Déplacer à gauche"
                              >
                                <ChevronLeft className="w-3 h-3" />
                              </button>
                              <button
                                onClick={handleMoveRight}
                                disabled={currentStageIdx === 4}
                                className={`p-0.5 rounded-md transition-all ${currentStageIdx === 4 ? "text-neutral-300 dark:text-zinc-700 cursor-not-allowed" : "text-neutral-600 hover:bg-white dark:text-neutral-300 dark:hover:bg-zinc-900 cursor-pointer"}`}
                                title="Déplacer à droite"
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
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
