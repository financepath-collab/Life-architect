import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Abonnement, ProfilAmelioration, FinanceEpargne, DailyHabit } from "../types";
import { 
  Bell, 
  Calendar, 
  AlertCircle, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  EyeOff, 
  ArrowRight,
  Sparkles,
  Coins,
  ShieldAlert,
  Search,
  Filter
} from "lucide-react";

interface AlertsBannerProps {
  abonnements: Abonnement[];
  profilAmeliorations: ProfilAmelioration[];
  epargnes: FinanceEpargne[];
  dailyHabits?: DailyHabit[];
  onNavigateToModule: (moduleId: string) => void;
}

interface AlertItem {
  id: string; // unique ID prefixed by type (e.g. "sub_ab1")
  title: string;
  subtitle: string;
  type: "subscription" | "project" | "savings";
  statusText: string;
  targetDate: string;
  daysRemaining: number;
  urgency: "urgent" | "warning" | "info" | "overdue";
  moduleId: string; // tab ID to navigate to
  amountText?: string;
}

export default function AlertsBanner({
  abonnements,
  profilAmeliorations,
  epargnes,
  dailyHabits,
  onNavigateToModule
}: AlertsBannerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "urgent" | "subscription" | "project">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("mp_dismissed_alerts_v2");
    return saved ? JSON.parse(saved) : [];
  });

  const [snoozedAlerts, setSnoozedAlerts] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("mp_snoozed_alerts_v2");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const now = Date.now();
        const filtered: Record<string, number> = {};
        for (const [id, expiresAt] of Object.entries(parsed)) {
          if (typeof expiresAt === "number" && expiresAt > now) {
            filtered[id] = expiresAt;
          }
        }
        return filtered;
      } catch (e) {
        return {};
      }
    }
    return {};
  });

  // Save dismissed alerts locally
  useEffect(() => {
    localStorage.setItem("mp_dismissed_alerts_v2", JSON.stringify(dismissedIds));
  }, [dismissedIds]);

  // Save snoozed alerts locally
  useEffect(() => {
    localStorage.setItem("mp_snoozed_alerts_v2", JSON.stringify(snoozedAlerts));
  }, [snoozedAlerts]);

  // Handle snooze/dismiss
  const handleDismiss = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedIds(prev => [...prev, id]);
  };

  const handleSnooze = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    setSnoozedAlerts(prev => ({
      ...prev,
      [id]: expiresAt
    }));
  };

  const handleResetDismissed = () => {
    setDismissedIds([]);
    setSnoozedAlerts({});
  };

  // Safe date helper to calculate days remaining relative to the creator workspace current time (July 11, 2026 or current date)
  const getDaysRemaining = (dateStr: string): number => {
    if (!dateStr) return 999;
    const targetDate = new Date(dateStr);
    if (isNaN(targetDate.getTime())) return 999;

    const baseline = new Date();
    // Since our mock environment calendar resides in July 2026, we check the local year.
    // If the system's local year is not 2026, we default our reference date to 2026-07-11 to keep math realistic.
    const referenceDate = baseline.getFullYear() === 2026 ? baseline : new Date("2026-07-11");

    referenceDate.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - referenceDate.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  // Compile alerts from states
  const alertsList: AlertItem[] = [];

  // 1. Process active subscriptions
  abonnements
    .filter(sub => sub.status === "Actif")
    .forEach(sub => {
      const days = getDaysRemaining(sub.nextBillingDate);
      let urgency: AlertItem["urgency"] = "info";
      if (days < 0) urgency = "overdue";
      else if (days <= 5) urgency = "urgent";
      else if (days <= 15) urgency = "warning";

      alertsList.push({
        id: `sub_${sub.id}`,
        title: sub.serviceName,
        subtitle: `Facturation récurrente (${sub.billingPeriod === "Mensuel" ? "mensuelle" : "annuelle"})`,
        type: "subscription",
        statusText: days < 0 
          ? `Échue depuis ${Math.abs(days)} jours` 
          : days === 0 
            ? "Aujourd'hui !" 
            : `Dans ${days} jours`,
        targetDate: sub.nextBillingDate,
        daysRemaining: days,
        urgency,
        moduleId: "abonnements",
        amountText: `${sub.costMonthly.toLocaleString("fr-FR")} MAD`
      });
    });

  // 2. Process active project competencies (profilAmeliorations)
  profilAmeliorations
    .filter(p => p.status !== "Maîtrisé")
    .forEach(p => {
      const days = getDaysRemaining(p.targetDate);
      let urgency: AlertItem["urgency"] = "info";
      if (days < 0) urgency = "overdue";
      else if (days <= 7) urgency = "urgent";
      else if (days <= 30) urgency = "warning";

      alertsList.push({
        id: `proj_${p.id}`,
        title: p.focusArea,
        subtitle: `Compétence : ${p.status} • Plan : ${p.actionPlan.slice(0, 50)}...`,
        type: "project",
        statusText: days < 0 
          ? `Date limite dépassée de ${Math.abs(days)} jours` 
          : days === 0 
            ? "Date limite aujourd'hui !" 
            : `Échéance dans ${days} jours`,
        targetDate: p.targetDate,
        daysRemaining: days,
        urgency,
        moduleId: "profil"
      });
    });

  // 3. Process ongoing savings goals (epargnes)
  epargnes
    .filter(e => e.status === "En cours")
    .forEach(e => {
      const days = getDaysRemaining(e.deadline);
      // Savings are long-term, so warn if less than 60 days
      let urgency: AlertItem["urgency"] = "info";
      if (days < 0) urgency = "overdue";
      else if (days <= 15) urgency = "urgent";
      else if (days <= 60) urgency = "warning";

      alertsList.push({
        id: `save_${e.id}`,
        title: e.name,
        subtitle: `Objectif épargne : ${e.currentAmount.toLocaleString("fr-FR")} MAD / ${e.targetAmount.toLocaleString("fr-FR")} MAD`,
        type: "savings",
        statusText: days < 0 
          ? `Échéance dépassée de ${Math.abs(days)} jours` 
          : days === 0 
            ? "Échéance aujourd'hui !" 
            : `Échéance dans ${days} jours`,
        targetDate: e.deadline,
        daysRemaining: days,
        urgency,
        moduleId: "epargnes",
        amountText: `${(e.targetAmount - e.currentAmount).toLocaleString("fr-FR")} MAD restants`
      });
    });

  // 4. Process overdue daily habits
  if (dailyHabits) {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();

    dailyHabits
      .filter(h => h.isImportant && !h.completed && h.dueTime)
      .forEach(h => {
        const parts = h.dueTime!.split(":");
        if (parts.length === 2) {
          const dueHour = parseInt(parts[0], 10);
          const dueMin = parseInt(parts[1], 10);
          if (!isNaN(dueHour) && !isNaN(dueMin)) {
            const isLate = (currentHour > dueHour) || (currentHour === dueHour && currentMin >= dueMin);
            if (isLate) {
              alertsList.push({
                id: `habit_${h.id}`,
                title: h.name,
                subtitle: `Discipline quotidienne importante : ${h.description || "Aucune description"}`,
                type: "project",
                statusText: `En retard (${h.dueTime})`,
                targetDate: new Date().toISOString().split("T")[0] + " " + h.dueTime,
                daysRemaining: 0,
                urgency: "overdue",
                moduleId: "dashboard"
              });
            }
          }
        }
      });
  }

  // Sort by urgency severity: overdue first, then lowest remaining days, then alphabetical
  const sortedAlerts = [...alertsList].sort((a, b) => {
    const priority = { overdue: 0, urgent: 1, warning: 2, info: 3 };
    if (priority[a.urgency] !== priority[b.urgency]) {
      return priority[a.urgency] - priority[b.urgency];
    }
    return a.daysRemaining - b.daysRemaining;
  });

  // Filter out dismissed and snoozed alerts
  const nowMs = Date.now();
  const activeAlerts = sortedAlerts.filter(alert => {
    if (dismissedIds.includes(alert.id)) return false;
    if (snoozedAlerts[alert.id] && snoozedAlerts[alert.id] > nowMs) return false;
    return true;
  });

  // Compute stats for active alerts
  const totalUrgentCount = activeAlerts.filter(a => a.urgency === "urgent" || a.urgency === "overdue").length;
  const totalWarningCount = activeAlerts.filter(a => a.urgency === "warning").length;

  // Filter based on tabs & search
  const filteredAlerts = activeAlerts.filter(alert => {
    // Tab filter
    if (filter === "urgent" && alert.urgency !== "urgent" && alert.urgency !== "overdue") return false;
    if (filter === "subscription" && alert.type !== "subscription") return false;
    if (filter === "project" && alert.type !== "project" && alert.type !== "savings") return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alert.title.toLowerCase().includes(q) ||
        alert.subtitle.toLowerCase().includes(q) ||
        alert.statusText.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Check styling according to severity
  const getSeverityStyle = (urgency: AlertItem["urgency"]) => {
    switch (urgency) {
      case "overdue":
        return {
          container: "bg-red-50/70 hover:bg-red-50 border-red-200 text-red-950",
          badge: "bg-red-500 text-white font-mono font-black",
          dot: "bg-red-500 animate-ping",
          iconColor: "text-red-600"
        };
      case "urgent":
        return {
          container: "bg-rose-50/70 hover:bg-rose-50 border-rose-200 text-rose-950",
          badge: "bg-rose-600 text-white font-mono font-semibold",
          dot: "bg-rose-600 animate-ping",
          iconColor: "text-rose-600"
        };
      case "warning":
        return {
          container: "bg-amber-50/70 hover:bg-amber-50 border-amber-200 text-amber-950",
          badge: "bg-amber-100 text-amber-800 border border-amber-200 font-medium",
          dot: "bg-amber-500",
          iconColor: "text-amber-600"
        };
      case "info":
      default:
        return {
          container: "bg-neutral-50/50 hover:bg-neutral-50 border-neutral-200/95 text-neutral-800",
          badge: "bg-neutral-100 text-neutral-700 border border-neutral-200 font-medium",
          dot: "bg-neutral-400",
          iconColor: "text-neutral-500"
        };
    }
  };

  return (
    <div id="alerts-notifications-center" className="bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-2xs transition-all">
      
      {/* HEADER BAR */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between p-5 bg-neutral-50/50 border-b border-neutral-100 cursor-pointer select-none"
      >
        <div className="flex items-center gap-3.5">
          <div className="relative w-10 h-10 bg-neutral-900 rounded-xl flex items-center justify-center text-white shrink-0 shadow-3xs">
            <Bell className={`w-5 h-5 ${totalUrgentCount > 0 ? "animate-bounce" : ""}`} />
            {activeAlerts.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5.5 h-5.5 bg-neutral-950 text-white text-[10px] font-black border-2 border-white rounded-full flex items-center justify-center">
                {activeAlerts.length}
              </span>
            )}
          </div>
          <div className="space-y-0.5">
            <h3 className="text-sm font-black text-neutral-900 uppercase tracking-tight flex items-center gap-2">
              <span>ALERTES & ÉCHÉANCES</span>
              {totalUrgentCount > 0 && (
                <span className="bg-rose-100 text-rose-700 text-[9px] font-bold px-2 py-0.5 rounded-full border border-rose-200/50 animate-pulse">
                  {totalUrgentCount} URGENTS
                </span>
              )}
            </h3>
            <p className="text-xs text-neutral-400">
              {activeAlerts.length === 0 
                ? "Toutes vos échéances sont à jour !" 
                : `Surveillez vos dates d'échéances SaaS, projets et épargnes d'élite.`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3.5">
          {dismissedIds.length > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleResetDismissed();
              }}
              className="text-[10px] text-neutral-400 hover:text-neutral-900 font-bold underline transition-colors cursor-pointer"
            >
              Réactiver les alertes masquées
            </button>
          )}
          <div className="p-2 bg-neutral-100 rounded-xl border border-neutral-200 text-neutral-600">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* FILTER & COLLAPSIBLE CONTENT CONTAINER */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="p-6 space-y-5 border-t border-neutral-100">
              
              {/* FILTER CONTROLS */}
              {activeAlerts.length > 0 && (
                <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pb-2">
                  {/* Tabs */}
                  <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
                    <button
                      onClick={() => setFilter("all")}
                      className={`px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                        filter === "all"
                          ? "bg-neutral-900 text-white border-neutral-900 font-extrabold"
                          : "bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100 hover:text-neutral-800"
                      }`}
                    >
                      Toutes ({activeAlerts.length})
                    </button>
                    <button
                      onClick={() => setFilter("urgent")}
                      className={`px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        filter === "urgent"
                          ? "bg-rose-600 text-white border-rose-600 font-extrabold"
                          : "bg-rose-50/50 text-rose-700 border-rose-200/55 hover:bg-rose-50 hover:text-rose-800"
                      }`}
                    >
                      🚨 Urgentes ({totalUrgentCount})
                    </button>
                    <button
                      onClick={() => setFilter("subscription")}
                      className={`px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        filter === "subscription"
                          ? "bg-neutral-900 text-white border-neutral-900 font-extrabold"
                          : "bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100 hover:text-neutral-800"
                      }`}
                    >
                      📅 Abonnements ({activeAlerts.filter(a => a.type === "subscription").length})
                    </button>
                    <button
                      onClick={() => setFilter("project")}
                      className={`px-3 py-1.5 text-[11px] font-bold rounded-xl border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                        filter === "project"
                          ? "bg-neutral-900 text-white border-neutral-900 font-extrabold"
                          : "bg-neutral-50 text-neutral-500 border-neutral-200 hover:bg-neutral-100 hover:text-neutral-800"
                      }`}
                    >
                      🚀 Projets & Épargnes ({activeAlerts.filter(a => a.type === "project" || a.type === "savings").length})
                    </button>
                  </div>

                  {/* Search bar */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Rechercher une alerte ou date..."
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl pl-9 pr-4 py-1.5 text-xs text-neutral-800 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all font-medium"
                    />
                  </div>
                </div>
              )}

              {/* LIST OF ALERTS */}
              {filteredAlerts.length === 0 ? (
                <div className="text-center py-10 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200/80">
                  <Clock className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                  <p className="text-xs text-neutral-400 font-semibold uppercase tracking-wide">Aucune alerte correspondante</p>
                  <p className="text-[10px] text-neutral-400 mt-1">Vos finances et projets sont en parfaite adéquation avec vos objectifs.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                  {filteredAlerts.map(alert => {
                    const style = getSeverityStyle(alert.urgency);
                    return (
                      <div
                        key={alert.id}
                        onClick={() => onNavigateToModule(alert.moduleId)}
                        className={`group relative border rounded-2xl p-4 flex items-start gap-3.5 transition-all cursor-pointer shadow-3xs ${style.container}`}
                      >
                        {/* Urgent dot / indicator */}
                        <div className="relative mt-1 shrink-0">
                          <span className={`w-2.5 h-2.5 rounded-full block ${style.dot}`} />
                          {(alert.urgency === "urgent" || alert.urgency === "overdue") && (
                            <span className="absolute top-0 left-0 w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping opacity-75" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 block font-mono">
                              {alert.type === "subscription" 
                                ? "📅 SaaS & Abonnement" 
                                : alert.type === "savings" 
                                  ? "💰 Projet Épargne" 
                                  : "🚀 Projet Compétence"}
                            </span>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${style.badge}`}>
                              {alert.statusText}
                            </span>
                          </div>

                          <h4 className="text-xs font-black text-neutral-900 truncate uppercase tracking-tight group-hover:underline flex items-center gap-1.5">
                            <span>{alert.title}</span>
                            {alert.amountText && (
                              <span className="text-[10px] font-mono text-neutral-500 font-normal">({alert.amountText})</span>
                            )}
                          </h4>

                          <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
                            {alert.subtitle}
                          </p>

                          {/* Quick details */}
                          <div className="flex items-center gap-2 pt-1.5 text-[9px] font-bold text-neutral-400 font-mono">
                            <Calendar className="w-3 h-3 text-neutral-400 shrink-0" />
                            <span>DATE LIMITE : {alert.targetDate}</span>
                          </div>
                        </div>

                        {/* Actions overlay */}
                        <div className="flex items-center gap-1.5 shrink-0 self-center">
                          {/* Snooze button for non-urgent financial alerts */}
                          {(alert.type === "subscription" || alert.type === "savings") && 
                           (alert.urgency !== "urgent" && alert.urgency !== "overdue") && (
                            <button
                              onClick={(e) => handleSnooze(alert.id, e)}
                              title="Répéter dans 24h (Snooze)"
                              className="p-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 text-indigo-600 hover:text-indigo-800 transition-all cursor-pointer opacity-0 group-hover:opacity-100 shadow-3xs flex items-center gap-1"
                            >
                              <Clock className="w-3.5 h-3.5" />
                              <span className="text-[9px] font-bold hidden md:inline">Snooze 24h</span>
                            </button>
                          )}

                          {/* Dismiss button */}
                          <button
                            onClick={(e) => handleDismiss(alert.id, e)}
                            title="Masquer l'alerte"
                            className="p-1.5 bg-white/80 hover:bg-white rounded-lg border border-neutral-200 text-neutral-400 hover:text-neutral-800 transition-all cursor-pointer opacity-0 group-hover:opacity-100 shadow-3xs"
                          >
                            <EyeOff className="w-3.5 h-3.5" />
                          </button>
                          
                          {/* Go indicator */}
                          <div className="p-1.5 bg-neutral-900 text-white rounded-lg opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all">
                            <ArrowRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* CRITICAL BOTTOM TIP BANNER */}
              {activeAlerts.length > 0 && (
                <div className="bg-neutral-50 border border-neutral-150 rounded-2xl p-4 flex items-center gap-3 text-xs text-neutral-500 shadow-3xs">
                  <Sparkles className="w-5 h-5 text-neutral-900 shrink-0" />
                  <p className="leading-relaxed">
                    <span className="font-bold text-neutral-800">Conseil d'organisation</span> : Les abonnements SaaS impactent directement vos budgets. Gardez un œil sur les renouvellements pour éviter les prélèvements inutiles sur votre compte <span className="font-semibold text-neutral-800">CIH E-Commerce</span>.
                  </p>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
