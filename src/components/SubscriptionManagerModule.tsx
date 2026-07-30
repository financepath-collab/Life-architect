import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Abonnement, FinanceTransaction, Account } from "../types";
import {
  CreditCard,
  Calendar,
  BellRing,
  AlertTriangle,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Coins,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Layers,
  Filter,
  Info,
  Check,
  X,
  Clock,
  ShieldAlert,
  Zap,
  Tag,
  Wallet
} from "lucide-react";

interface SubscriptionManagerModuleProps {
  abonnements: Abonnement[];
  setAbonnements: React.Dispatch<React.SetStateAction<Abonnement[]>>;
  transactions?: FinanceTransaction[];
  setTransactions?: React.Dispatch<React.SetStateAction<FinanceTransaction[]>>;
  accounts?: Account[];
  setAccounts?: React.Dispatch<React.SetStateAction<Account[]>>;
  triggerToast?: (msg: string, type?: "success" | "error" | "info") => void;
}

export default function SubscriptionManagerModule({
  abonnements,
  setAbonnements,
  transactions = [],
  setTransactions,
  accounts = [],
  setAccounts,
  triggerToast
}: SubscriptionManagerModuleProps) {
  // Search & Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "due_3_days" | "actif" | "suspendu">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("Toutes");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<Abonnement | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    serviceName: "",
    costMonthly: "",
    billingPeriod: "Mensuel" as "Mensuel" | "Annuel",
    nextBillingDate: new Date().toISOString().split("T")[0],
    category: "Logiciels & SaaS",
    account: accounts[0]?.name || "Compte Courant CIH",
    status: "Actif" as "Actif" | "Suspendu",
    notes: ""
  });

  // Snoozed alerts state
  const [snoozedIds, setSnoozedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("mp_snoozed_subs_v1");
    return saved ? JSON.parse(saved) : [];
  });

  // Calculate days remaining relative to reference date (July 2026 or current date)
  const getDaysRemaining = (dateStr: string): number => {
    if (!dateStr) return 999;
    const targetDate = new Date(dateStr);
    if (isNaN(targetDate.getTime())) return 999;

    const baseline = new Date();
    // Reference year check for consistency with initial dataset
    const referenceDate = baseline.getFullYear() === 2026 ? baseline : new Date("2026-07-11");

    referenceDate.setHours(0, 0, 0, 0);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - referenceDate.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
  };

  // Subscriptions with computed countdown
  const subsWithCountdown = useMemo(() => {
    return abonnements.map(sub => {
      const days = getDaysRemaining(sub.nextBillingDate);
      return {
        ...sub,
        daysRemaining: days,
        isDueIn3Days: sub.status === "Actif" && days <= 3
      };
    }).sort((a, b) => a.daysRemaining - b.daysRemaining);
  }, [abonnements]);

  // Critical Subscriptions (< 3 days)
  const criticalDueSubs = useMemo(() => {
    return subsWithCountdown.filter(s => s.isDueIn3Days && !snoozedIds.includes(s.id));
  }, [subsWithCountdown, snoozedIds]);

  // Total active monthly cost
  const totalMonthlyCost = useMemo(() => {
    return abonnements
      .filter(a => a.status === "Actif")
      .reduce((sum, a) => {
        const cost = a.billingPeriod === "Mensuel" ? a.costMonthly : (a.costMonthly || 0) / 12;
        return sum + cost;
      }, 0);
  }, [abonnements]);

  // Total annual projection
  const totalAnnualCost = useMemo(() => totalMonthlyCost * 12, [totalMonthlyCost]);

  // Filtered List for Table/Grid
  const filteredSubscriptions = useMemo(() => {
    return subsWithCountdown.filter(sub => {
      // Search
      const matchesSearch = sub.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (sub.notes && sub.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      
      if (!matchesSearch) return false;

      // Status Filter
      if (statusFilter === "due_3_days" && !sub.isDueIn3Days) return false;
      if (statusFilter === "actif" && sub.status !== "Actif") return false;
      if (statusFilter === "suspendu" && sub.status !== "Suspendu") return false;

      // Category Filter
      if (categoryFilter !== "Toutes" && sub.category !== categoryFilter) return false;

      return true;
    });
  }, [subsWithCountdown, searchQuery, statusFilter, categoryFilter]);

  // Handlers
  const handleOpenAddModal = () => {
    setEditingSub(null);
    setFormData({
      serviceName: "",
      costMonthly: "",
      billingPeriod: "Mensuel",
      nextBillingDate: new Date().toISOString().split("T")[0],
      category: "Logiciels & SaaS",
      account: accounts[0]?.name || "Compte Courant CIH",
      status: "Actif",
      notes: ""
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (sub: Abonnement) => {
    setEditingSub(sub);
    setFormData({
      serviceName: sub.serviceName,
      costMonthly: sub.costMonthly.toString(),
      billingPeriod: sub.billingPeriod || "Mensuel",
      nextBillingDate: sub.nextBillingDate || new Date().toISOString().split("T")[0],
      category: sub.category || "Logiciels & SaaS",
      account: sub.account || accounts[0]?.name || "Compte Courant CIH",
      status: sub.status || "Actif",
      notes: sub.notes || ""
    });
    setIsModalOpen(true);
  };

  const handleSaveSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.serviceName.trim() || !formData.costMonthly) {
      if (triggerToast) triggerToast("Veuillez renseigner le nom et le montant du service.", "error");
      return;
    }

    const numCost = parseFloat(formData.costMonthly);
    if (isNaN(numCost) || numCost < 0) {
      if (triggerToast) triggerToast("Montant invalide.", "error");
      return;
    }

    if (editingSub) {
      // Update existing
      setAbonnements(prev => prev.map(s => s.id === editingSub.id ? {
        ...s,
        serviceName: formData.serviceName.trim(),
        costMonthly: numCost,
        billingPeriod: formData.billingPeriod,
        nextBillingDate: formData.nextBillingDate,
        category: formData.category,
        account: formData.account,
        status: formData.status,
        notes: formData.notes
      } : s));
      if (triggerToast) triggerToast(`Abonnement "${formData.serviceName}" mis à jour avec succès.`, "success");
    } else {
      // Create new
      const newSub: Abonnement = {
        id: `sub_${Date.now()}`,
        serviceName: formData.serviceName.trim(),
        costMonthly: numCost,
        billingPeriod: formData.billingPeriod,
        nextBillingDate: formData.nextBillingDate,
        category: formData.category,
        account: formData.account,
        status: formData.status,
        notes: formData.notes
      };
      setAbonnements(prev => [newSub, ...prev]);
      if (triggerToast) triggerToast(`Abonnement "${formData.serviceName}" ajouté avec succès.`, "success");
    }

    setIsModalOpen(false);
  };

  const handleDeleteSubscription = (id: string, name: string) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'abonnement "${name}" ?`)) {
      setAbonnements(prev => prev.filter(s => s.id !== id));
      if (triggerToast) triggerToast(`Abonnement "${name}" supprimé.`, "info");
    }
  };

  const handleToggleStatus = (sub: Abonnement) => {
    const newStatus = sub.status === "Actif" ? "Suspendu" : "Actif";
    setAbonnements(prev => prev.map(s => s.id === sub.id ? { ...s, status: newStatus } : s));
    if (triggerToast) {
      triggerToast(`Abonnement "${sub.serviceName}" ${newStatus === "Actif" ? "réactivé" : "suspendu"}.`, "info");
    }
  };

  // Process payment for a subscription (Create expense transaction & advance nextBillingDate by 1 month or 1 year)
  const handleValidatePayment = (sub: Abonnement) => {
    const cost = sub.costMonthly;
    const targetAccountName = sub.account || accounts[0]?.name || "Compte Courant CIH";

    // 1. Advance nextBillingDate
    const currentDate = new Date(sub.nextBillingDate || new Date().toISOString().split("T")[0]);
    if (sub.billingPeriod === "Annuel") {
      currentDate.setFullYear(currentDate.getFullYear() + 1);
    } else {
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    const newNextDateStr = currentDate.toISOString().split("T")[0];

    setAbonnements(prev => prev.map(s => s.id === sub.id ? { ...s, nextBillingDate: newNextDateStr } : s));

    // 2. Add expense transaction if setTransactions is provided
    if (setTransactions) {
      const newTx: FinanceTransaction = {
        id: `tx_sub_${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        description: `Prélèvement : ${sub.serviceName}`,
        amount: cost,
        type: "Dépense",
        category: "Abonnements & Charges",
        account: targetAccountName,
        status: "Validé"
      };
      setTransactions(prev => [newTx, ...prev]);
    }

    // 3. Deduct from account balance if setAccounts is provided
    if (setAccounts && accounts.length > 0) {
      setAccounts(prev => prev.map(acc => {
        if (acc.name === targetAccountName) {
          return { ...acc, balance: acc.balance - cost };
        }
        return acc;
      }));
    }

    if (triggerToast) {
      triggerToast(`Règlement de ${cost.toLocaleString("fr-FR")} MAD pour "${sub.serviceName}" validé. Prochaine échéance : ${newNextDateStr}`, "success");
    }
  };

  // Snooze alert for 24h
  const handleSnoozeAlert = (id: string) => {
    setSnoozedIds(prev => {
      const updated = [...prev, id];
      localStorage.setItem("mp_snoozed_subs_v1", JSON.stringify(updated));
      return updated;
    });
    if (triggerToast) triggerToast("Rappel masqué pour cet abonnement.", "info");
  };

  return (
    <div className="space-y-6">
      
      {/* 1. VISUAL NOTIFICATION BANNER (3 DAYS BEFORE DUE DATE) */}
      <AnimatePresence>
        {criticalDueSubs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15 }}
            className="bg-gradient-to-r from-rose-500/10 via-amber-500/10 to-red-500/15 border-2 border-rose-500/80 rounded-3xl p-5 md:p-6 shadow-md relative overflow-hidden space-y-4"
          >
            {/* Pulsing indicator background */}
            <div className="absolute -right-8 -top-8 w-40 h-40 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

            {/* Banner Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-200/60 dark:border-rose-900/50 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                  <BellRing className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-rose-950 dark:text-rose-200 uppercase tracking-tight flex items-center gap-2">
                    <span>Alerte Échéances : Prélèvements Imminents (&lt; 3 Jours)</span>
                    <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full font-mono uppercase">
                      {criticalDueSubs.length} Service{criticalDueSubs.length > 1 ? "s" : ""}
                    </span>
                  </h3>
                  <p className="text-xs text-rose-800 dark:text-rose-300 font-medium">
                    Consultez et validez vos abonnements arrivant à échéance très prochainement pour maintenir un solde adéquat.
                  </p>
                </div>
              </div>

              <span className="text-[11px] font-mono font-extrabold text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-800 px-3 py-1 rounded-xl self-start sm:self-auto">
                Total Imminent : {criticalDueSubs.reduce((sum, s) => sum + s.costMonthly, 0).toLocaleString("fr-FR")} MAD
              </span>
            </div>

            {/* Critical Subscriptions Quick Action Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {criticalDueSubs.map(sub => {
                const isOverdue = sub.daysRemaining < 0;
                const isToday = sub.daysRemaining === 0;

                return (
                  <div
                    key={sub.id}
                    className="bg-white dark:bg-zinc-900 border-2 border-rose-300 dark:border-rose-800/80 rounded-2xl p-4 flex flex-col justify-between gap-3 shadow-sm hover:border-rose-500 transition-all"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-black text-neutral-900 dark:text-neutral-100 text-xs uppercase tracking-tight truncate">
                          {sub.serviceName}
                        </span>
                        <span className="text-xs font-mono font-black text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-lg border border-rose-200 dark:border-rose-800">
                          {sub.costMonthly.toLocaleString("fr-FR")} MAD
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400">
                        <span>Compte : {sub.account || "Non défini"}</span>
                        <span className="font-mono text-[10px]">{sub.nextBillingDate}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between gap-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg font-mono ${
                        isOverdue 
                          ? "bg-rose-600 text-white animate-bounce" 
                          : isToday 
                            ? "bg-rose-600 text-white" 
                            : "bg-amber-500 text-white"
                      }`}>
                        {isOverdue 
                          ? `Échu (${Math.abs(sub.daysRemaining)}j)` 
                          : isToday 
                            ? "Aujourd'hui !" 
                            : `Dans ${sub.daysRemaining} jour${sub.daysRemaining > 1 ? "s" : ""}`
                        }
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleSnoozeAlert(sub.id)}
                          className="px-2 py-1 text-[10px] font-bold text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 rounded-lg transition-colors cursor-pointer"
                          title="Masquer l'alerte pour cet abonnement"
                        >
                          Masquer
                        </button>
                        <button
                          onClick={() => handleValidatePayment(sub)}
                          className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all shadow-xs flex items-center gap-1 cursor-pointer"
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Payer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. KPI SUMMARY METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-zinc-900 border border-neutral-200/90 dark:border-neutral-800 p-4 rounded-3xl shadow-xs space-y-1">
          <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
            <span>Coût Mensuel Total</span>
            <Coins className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-neutral-950 dark:text-neutral-50 font-mono">
            {totalMonthlyCost.toLocaleString("fr-FR")} <span className="text-xs font-bold text-neutral-400">MAD/mo</span>
          </div>
          <p className="text-[10px] text-neutral-400">
            {abonnements.filter(a => a.status === "Actif").length} abonnements actifs enregistrés
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-neutral-200/90 dark:border-neutral-800 p-4 rounded-3xl shadow-xs space-y-1">
          <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
            <span>Projection Annuelle</span>
            <Calendar className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-neutral-950 dark:text-neutral-50 font-mono">
            {totalAnnualCost.toLocaleString("fr-FR")} <span className="text-xs font-bold text-neutral-400">MAD/an</span>
          </div>
          <p className="text-[10px] text-neutral-400">
            Total des charges récurrentes cumulées sur 12 mois
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-neutral-200/90 dark:border-neutral-800 p-4 rounded-3xl shadow-xs space-y-1">
          <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
            <span>Alertes &lt; 3 Jours</span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-black text-rose-600 dark:text-rose-400 font-mono">
            {subsWithCountdown.filter(s => s.isDueIn3Days).length} <span className="text-xs font-bold text-neutral-400">services</span>
          </div>
          <p className="text-[10px] text-neutral-400">
            Prélèvements nécessitant une attention immédiate
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-neutral-200/90 dark:border-neutral-800 p-4 rounded-3xl shadow-xs space-y-1">
          <div className="text-xs font-bold text-neutral-500 dark:text-neutral-400 flex items-center justify-between">
            <span>Abonnements Suspendus</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-neutral-950 dark:text-neutral-50 font-mono">
            {abonnements.filter(a => a.status === "Suspendu").length} <span className="text-xs font-bold text-neutral-400">services</span>
          </div>
          <p className="text-[10px] text-neutral-400">
            Économies réalisées sur abonnements mis en pause
          </p>
        </div>

      </div>

      {/* 3. TOOLBAR & FILTER SECTION */}
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200/90 dark:border-neutral-800 rounded-3xl p-5 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === "all"
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs"
                  : "bg-neutral-100 text-neutral-600 dark:bg-zinc-800 dark:text-neutral-300 hover:bg-neutral-200"
              }`}
            >
              Tous ({abonnements.length})
            </button>

            <button
              onClick={() => setStatusFilter("due_3_days")}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer flex items-center gap-1.5 ${
                statusFilter === "due_3_days"
                  ? "bg-rose-600 text-white shadow-xs font-black"
                  : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 hover:bg-rose-100"
              }`}
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>&lt; 3 Jours ({subsWithCountdown.filter(s => s.isDueIn3Days).length})</span>
            </button>

            <button
              onClick={() => setStatusFilter("actif")}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === "actif"
                  ? "bg-emerald-600 text-white shadow-xs font-black"
                  : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 hover:bg-emerald-100"
              }`}
            >
              Actifs ({abonnements.filter(a => a.status === "Actif").length})
            </button>

            <button
              onClick={() => setStatusFilter("suspendu")}
              className={`px-3.5 py-1.5 rounded-2xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                statusFilter === "suspendu"
                  ? "bg-amber-600 text-white shadow-xs font-black"
                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 hover:bg-amber-100"
              }`}
            >
              Suspendus ({abonnements.filter(a => a.status === "Suspendu").length})
            </button>
          </div>

          {/* Search & Add Button */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un service..."
                className="w-full bg-neutral-100 dark:bg-zinc-800 border border-neutral-200/80 dark:border-neutral-700 rounded-2xl pl-9 pr-3 py-2 text-xs font-medium text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-2xl shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span className="hidden sm:inline">Ajouter Abonnement</span>
            </button>
          </div>

        </div>

      </div>

      {/* 4. SUBSCRIPTION TABLE / GRID */}
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200/90 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-xs">
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-neutral-50 dark:bg-zinc-950/60 border-b border-neutral-200/80 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">Service & Catégorie</th>
                <th className="py-3.5 px-4">Coût & Période</th>
                <th className="py-3.5 px-4">Compte Assigné</th>
                <th className="py-3.5 px-4">Prochain Prélèvement</th>
                <th className="py-3.5 px-4">Notification & Décompte</th>
                <th className="py-3.5 px-4 text-center">État</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
              {filteredSubscriptions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-400">
                    <CreditCard className="w-8 h-8 mx-auto mb-2 opacity-30" />
                    <p className="font-bold text-sm">Aucun abonnement ne correspond à votre recherche.</p>
                    <p className="text-xs text-neutral-500 mt-1">Ajoutez vos abonnements pour bénéficier des notifications 3 jours avant échéance.</p>
                  </td>
                </tr>
              ) : (
                filteredSubscriptions.map((sub) => {
                  const days = sub.daysRemaining;
                  const isDue3Days = sub.isDueIn3Days;
                  const isOverdue = days < 0;
                  const isToday = days === 0;

                  return (
                    <tr 
                      key={sub.id} 
                      className={`hover:bg-neutral-50/80 dark:hover:bg-zinc-800/40 transition-colors ${
                        isDue3Days ? "bg-rose-50/40 dark:bg-rose-950/20" : ""
                      }`}
                    >
                      {/* Service & Category */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${
                            isDue3Days 
                              ? "bg-rose-600 text-white animate-pulse" 
                              : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
                          }`}>
                            <CreditCard className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-extrabold text-neutral-900 dark:text-neutral-100 text-xs">
                              {sub.serviceName}
                            </div>
                            <div className="text-[10px] text-neutral-400 font-medium">
                              {sub.category || "Logiciels & SaaS"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Cost & Period */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-black text-neutral-950 dark:text-neutral-50 text-xs">
                          {sub.costMonthly.toLocaleString("fr-FR")} MAD
                        </div>
                        <div className="text-[10px] text-neutral-400">
                          {sub.billingPeriod || "Mensuel"}
                        </div>
                      </td>

                      {/* Account */}
                      <td className="py-3.5 px-4 text-neutral-700 dark:text-neutral-300 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Wallet className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                          <span>{sub.account || "Non défini"}</span>
                        </div>
                      </td>

                      {/* Next Billing Date */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-neutral-800 dark:text-neutral-200">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>{sub.nextBillingDate || "N/A"}</span>
                        </div>
                      </td>

                      {/* Countdown & 3-Day Alert Badge */}
                      <td className="py-3.5 px-4">
                        {sub.status === "Suspendu" ? (
                          <span className="text-[10px] font-bold text-neutral-400 bg-neutral-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
                            En pause
                          </span>
                        ) : isDue3Days ? (
                          <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full font-mono text-white ${
                            isOverdue ? "bg-rose-600 animate-bounce" : isToday ? "bg-rose-600" : "bg-amber-500"
                          }`}>
                            <BellRing className="w-3 h-3" />
                            <span>
                              {isOverdue 
                                ? `Échu (-${Math.abs(days)}j)` 
                                : isToday 
                                  ? "Aujourd'hui !" 
                                  : `Dans ${days} jour${days > 1 ? "s" : ""}`
                              }
                            </span>
                          </span>
                        ) : days <= 7 ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-full font-mono">
                            <Clock className="w-3 h-3" />
                            <span>Dans {days} jours</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 rounded-full font-mono">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Dans {days} jours</span>
                          </span>
                        )}
                      </td>

                      {/* Status Toggle */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(sub)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all cursor-pointer ${
                            sub.status === "Actif"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800"
                              : "bg-neutral-100 text-neutral-600 dark:bg-zinc-800 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700"
                          }`}
                        >
                          {sub.status || "Actif"}
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {sub.status === "Actif" && (
                            <button
                              onClick={() => handleValidatePayment(sub)}
                              className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10px] font-bold transition-all shadow-2xs flex items-center gap-1 cursor-pointer"
                              title="Valider le paiement et avancer la date de prélèvement"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span className="hidden sm:inline">Payer</span>
                            </button>
                          )}
                          <button
                            onClick={() => handleOpenEditModal(sub)}
                            className="p-1.5 text-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                            title="Modifier"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteSubscription(sub.id, sub.serviceName)}
                            className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* 5. ADD / EDIT SUBSCRIPTION MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-2xl max-w-lg w-full space-y-5 relative">
            
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl border border-indigo-500/20">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h3 className="text-base font-black text-neutral-950 dark:text-neutral-50">
                  {editingSub ? "Modifier l'Abonnement" : "Nouveau Service Récurrent"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-xl transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubscription} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Nom du Service <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.serviceName}
                  onChange={(e) => setFormData(prev => ({ ...prev, serviceName: e.target.value }))}
                  placeholder="ex: Netflix, AWS Cloud, Gym, Adobe Creative"
                  className="w-full bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-3.5 py-2.5 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Montant Récurrent (MAD) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.costMonthly}
                    onChange={(e) => setFormData(prev => ({ ...prev, costMonthly: e.target.value }))}
                    placeholder="ex: 150"
                    className="w-full bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-3.5 py-2.5 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Périodicité
                  </label>
                  <select
                    value={formData.billingPeriod}
                    onChange={(e) => setFormData(prev => ({ ...prev, billingPeriod: e.target.value as any }))}
                    className="w-full bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-3.5 py-2.5 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="Mensuel">Mensuel</option>
                    <option value="Annuel">Annuel</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Prochaine Échéance
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.nextBillingDate}
                    onChange={(e) => setFormData(prev => ({ ...prev, nextBillingDate: e.target.value }))}
                    className="w-full bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-3.5 py-2.5 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-mono font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Compte Débité
                  </label>
                  <select
                    value={formData.account}
                    onChange={(e) => setFormData(prev => ({ ...prev, account: e.target.value }))}
                    className="w-full bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-3.5 py-2.5 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    {accounts.length > 0 ? (
                      accounts.map(acc => (
                        <option key={acc.id} value={acc.name}>{acc.name} ({acc.balance.toLocaleString("fr-FR")} MAD)</option>
                      ))
                    ) : (
                      <option value="Compte Courant CIH">Compte Courant CIH</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-3.5 py-2.5 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="Logiciels & SaaS">Logiciels & SaaS</option>
                    <option value="Loisirs & Streaming">Loisirs & Streaming</option>
                    <option value="Sport & Santé">Sport & Santé</option>
                    <option value="Téléphonie & Internet">Téléphonie & Internet</option>
                    <option value="Cloud & Infrastructure">Cloud & Infrastructure</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                    Statut du Service
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-3.5 py-2.5 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                  >
                    <option value="Actif">Actif</option>
                    <option value="Suspendu">Suspendu</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                  Notes & Détails
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Notes, numéro de contrat, conditions d'annulation..."
                  className="w-full bg-neutral-50 dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl px-3.5 py-2 text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
                />
              </div>

              {/* Info box on 3-day notifications */}
              <div className="bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800 p-3 rounded-2xl flex items-center gap-2.5 text-[11px] text-indigo-900 dark:text-indigo-300">
                <BellRing className="w-4 h-4 text-indigo-500 shrink-0" />
                <span>
                  Le système générera automatiquement un rappel visuel <strong>3 jours avant</strong> le prélèvement ({formData.nextBillingDate || "date fixée"}).
                </span>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-2xl font-bold transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-2xl shadow-md transition-all cursor-pointer"
                >
                  {editingSub ? "Enregistrer les modifications" : "Créer l'Abonnement"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
