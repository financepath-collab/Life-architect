import React, { useState, useMemo, useEffect } from "react";
import { 
  X, 
  Search, 
  Calendar, 
  ArrowUpDown, 
  CreditCard, 
  Tag, 
  Receipt, 
  Layers, 
  TrendingDown,
  ShoppingBag,
  Home,
  Laptop,
  Flame,
  Briefcase,
  Tv,
  Car,
  Utensils,
  Repeat,
  Info,
  CheckCircle2,
  Clock
} from "lucide-react";
import { FinanceTransaction, Abonnement } from "../types";

interface CategoryDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName: string | null;
  periodKey?: string; // e.g., "month:2026-07", "quarter:2026-Q3", "all", etc.
  transactions: FinanceTransaction[];
  abonnements?: Abonnement[];
  totalPeriodExpenses?: number;
}

// Category normalization helper matching the chart logic
export const normalizeCategory = (rawCat: string = ""): string => {
  if (!rawCat) return "Autre";
  const normTx = rawCat.toLowerCase().trim();

  if (
    normTx.includes("charges fixes") ||
    normTx === "abonnements & charges" ||
    normTx === "charges fixes & abonnements" ||
    normTx === "abonnements & charges récurrentes" ||
    rawCat === "Abonnements & Charges" ||
    rawCat === "Charges Fixes & Abonnements"
  ) {
    return "Abonnements & Charges";
  }

  if (
    rawCat === "Logiciels & SaaS" ||
    rawCat === "Alimentation & Courses" ||
    rawCat === "Logement & Serveurs" ||
    rawCat === "Équipement & Matériel" ||
    rawCat === "Marketing & Publicité" ||
    rawCat === "Transport & Carburant" ||
    rawCat === "Loisirs & Sorties" ||
    rawCat === "Dépenses Courantes & Achats"
  ) {
    return rawCat;
  }

  const mappings: { [key: string]: string } = {
    alimentation: "Alimentation & Courses",
    courses: "Alimentation & Courses",
    supermarche: "Alimentation & Courses",
    nourriture: "Alimentation & Courses",
    marjane: "Alimentation & Courses",
    carrefour: "Alimentation & Courses",

    logement: "Logement & Serveurs",
    loyer: "Logement & Serveurs",
    serveur: "Logement & Serveurs",
    serveurs: "Logement & Serveurs",
    electricite: "Logement & Serveurs",
    eau: "Logement & Serveurs",
    internet: "Logement & Serveurs",
    iam: "Logement & Serveurs",
    inwi: "Logement & Serveurs",

    equipement: "Équipement & Matériel",
    materiel: "Équipement & Matériel",
    bureau: "Équipement & Matériel",
    mobilier: "Équipement & Matériel",
    macbook: "Équipement & Matériel",

    logiciel: "Logiciels & SaaS",
    saas: "Logiciels & SaaS",
    adobe: "Logiciels & SaaS",
    canva: "Logiciels & SaaS",
    chatgpt: "Logiciels & SaaS",
    openai: "Logiciels & SaaS",
    hosting: "Logiciels & SaaS",

    marketing: "Marketing & Publicité",
    publicite: "Marketing & Publicité",
    pub: "Marketing & Publicité",
    ads: "Marketing & Publicité",
    sponsoring: "Marketing & Publicité",

    transport: "Transport & Carburant",
    carburant: "Transport & Carburant",
    essence: "Transport & Carburant",
    gazole: "Transport & Carburant",
    uber: "Transport & Carburant",

    loisir: "Loisirs & Sorties",
    loisirs: "Loisirs & Sorties",
    sortie: "Loisirs & Sorties",
    voyage: "Loisirs & Sorties",
    netflix: "Loisirs & Sorties",
    spotify: "Loisirs & Sorties"
  };

  for (const [key, value] of Object.entries(mappings)) {
    if (normTx.includes(key)) {
      return value;
    }
  }
  return rawCat;
};

// Helper for category icon and color badges
const getCategoryBadgeStyle = (category: string) => {
  const catLower = category.toLowerCase();

  if (catLower.includes("aliment") || catLower.includes("course") || catLower.includes("nourriture")) {
    return {
      icon: Utensils,
      colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      accentBg: "bg-emerald-500",
      pillBg: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300"
    };
  }
  if (catLower.includes("logement") || catLower.includes("serveur") || catLower.includes("loyer")) {
    return {
      icon: Home,
      colorClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      accentBg: "bg-blue-500",
      pillBg: "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
    };
  }
  if (catLower.includes("équipement") || catLower.includes("matériel") || catLower.includes("bureau")) {
    return {
      icon: Laptop,
      colorClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      accentBg: "bg-amber-500",
      pillBg: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300"
    };
  }
  if (catLower.includes("logiciel") || catLower.includes("saas") || catLower.includes("abonnement")) {
    return {
      icon: Layers,
      colorClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      accentBg: "bg-purple-500",
      pillBg: "bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300"
    };
  }
  if (catLower.includes("marketing") || catLower.includes("pub")) {
    return {
      icon: Flame,
      colorClass: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      accentBg: "bg-orange-500",
      pillBg: "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300"
    };
  }
  if (catLower.includes("transport") || catLower.includes("carburant")) {
    return {
      icon: Car,
      colorClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
      accentBg: "bg-cyan-500",
      pillBg: "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-300"
    };
  }
  if (catLower.includes("loisir") || catLower.includes("sortie") || catLower.includes("voyage")) {
    return {
      icon: Tv,
      colorClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      accentBg: "bg-rose-500",
      pillBg: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300"
    };
  }

  return {
    icon: Tag,
    colorClass: "bg-neutral-500/10 text-neutral-600 dark:text-neutral-400 border-neutral-500/20",
    accentBg: "bg-neutral-500",
    pillBg: "bg-neutral-100 dark:bg-zinc-800 text-neutral-700 dark:text-neutral-300"
  };
};

export default function CategoryDetailModal({
  isOpen,
  onClose,
  categoryName,
  periodKey = "all",
  transactions = [],
  abonnements = [],
  totalPeriodExpenses
}: CategoryDetailModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"date-desc" | "date-asc" | "amount-desc" | "amount-asc">("date-desc");

  // Keyboard escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Format human label for selected period
  const periodLabel = useMemo(() => {
    if (!periodKey || periodKey === "all") return "Tout le cumul";
    if (periodKey.startsWith("month:")) {
      const mStr = periodKey.replace("month:", "");
      const [year, month] = mStr.split("-");
      const d = new Date(parseInt(year), parseInt(month) - 1, 1);
      const l = d.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
      return l.charAt(0).toUpperCase() + l.slice(1);
    }
    if (periodKey.startsWith("quarter:")) {
      const [year, qStr] = periodKey.replace("quarter:", "").split("-Q");
      const qMap: { [key: string]: string } = {
        "1": "T1 (Jan - Mars)",
        "2": "T2 (Avr - Juin)",
        "3": "T3 (Juil - Sept)",
        "4": "T4 (Oct - Déc)"
      };
      return `${qMap[qStr] || `Trimestre ${qStr}`} ${year}`;
    }
    return periodKey;
  }, [periodKey]);

  // Match period logic
  const matchesPeriod = (dateStr?: string) => {
    if (!dateStr || dateStr.length < 7) return false;
    if (periodKey === "all") return true;
    if (periodKey.startsWith("month:")) {
      const m = periodKey.replace("month:", "");
      return dateStr.startsWith(m);
    }
    if (periodKey.startsWith("quarter:")) {
      const [year, qStr] = periodKey.replace("quarter:", "").split("-Q");
      const q = parseInt(qStr, 10);
      const dateYear = dateStr.substring(0, 4);
      const dateMonth = parseInt(dateStr.substring(5, 7), 10);
      if (dateYear !== year) return false;
      if (q === 1) return dateMonth >= 1 && dateMonth <= 3;
      if (q === 2) return dateMonth >= 4 && dateMonth <= 6;
      if (q === 3) return dateMonth >= 7 && dateMonth <= 9;
      if (q === 4) return dateMonth >= 10 && dateMonth <= 12;
    }
    return dateStr.startsWith(periodKey);
  };

  // Filter transactions belonging to this category and period
  const categoryTransactions = useMemo(() => {
    if (!categoryName) return [];

    return transactions.filter(t => {
      // Must be an expense
      if (t.type !== "Dépense") return false;
      
      // Match period filter
      if (!matchesPeriod(t.date)) return false;

      // Match category name
      const normCat = normalizeCategory(t.category);
      const targetNormCat = normalizeCategory(categoryName);
      
      return normCat === targetNormCat || t.category === categoryName || categoryName === "Autre";
    });
  }, [categoryName, periodKey, transactions]);

  // Filter subscriptions that belong to this category (if applicable)
  const categoryAbonnements = useMemo(() => {
    if (!categoryName) return [];
    const targetNormCat = normalizeCategory(categoryName);

    if (
      targetNormCat === "Abonnements & Charges" || 
      targetNormCat === "Logiciels & SaaS" ||
      targetNormCat === "Logement & Serveurs" ||
      targetNormCat === "Loisirs & Sorties"
    ) {
      return abonnements.filter(a => a.status === "Actif");
    }
    return [];
  }, [categoryName, abonnements]);

  // Apply Search & Sort
  const filteredTransactions = useMemo(() => {
    let result = [...categoryTransactions];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(t => 
        (t.description && t.description.toLowerCase().includes(term)) ||
        (t.account && t.account.toLowerCase().includes(term)) ||
        (t.recipient && t.recipient.toLowerCase().includes(term)) ||
        (t.note && t.note.toLowerCase().includes(term)) ||
        (t.category && t.category.toLowerCase().includes(term))
      );
    }

    result.sort((a, b) => {
      if (sortOrder === "date-desc") return (b.date || "").localeCompare(a.date || "");
      if (sortOrder === "date-asc") return (a.date || "").localeCompare(b.date || "");
      if (sortOrder === "amount-desc") return (b.amount || 0) - (a.amount || 0);
      if (sortOrder === "amount-asc") return (a.amount || 0) - (b.amount || 0);
      return 0;
    });

    return result;
  }, [categoryTransactions, searchTerm, sortOrder]);

  // Total amount calculated
  const totalAmount = useMemo(() => {
    let sum = categoryTransactions.reduce((acc, t) => acc + (t.amount || 0), 0);
    // Include active subscriptions cost if category is Abonnements
    const targetNormCat = normalizeCategory(categoryName || "");
    if (
      targetNormCat === "Abonnements & Charges" ||
      targetNormCat === "Charges Fixes & Abonnements"
    ) {
      const activeSubCost = abonnements
        .filter(a => a.status === "Actif")
        .reduce((s, a) => s + (a.billingPeriod === "Mensuel" ? a.costMonthly : a.costMonthly / 12), 0);
      sum += activeSubCost;
    }
    return sum;
  }, [categoryTransactions, categoryName, abonnements]);

  const totalOpsCount = categoryTransactions.length + (categoryAbonnements.length > 0 ? categoryAbonnements.length : 0);
  const avgAmount = totalOpsCount > 0 ? totalAmount / totalOpsCount : 0;
  
  const percentShare = useMemo(() => {
    if (!totalPeriodExpenses || totalPeriodExpenses <= 0) return 0;
    return (totalAmount / totalPeriodExpenses) * 100;
  }, [totalAmount, totalPeriodExpenses]);

  if (!isOpen || !categoryName) return null;

  const styleInfo = getCategoryBadgeStyle(categoryName);
  const CategoryIcon = styleInfo.icon;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden text-neutral-900 dark:text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-5 sm:p-6 border-b border-neutral-100 dark:border-neutral-800/80 flex items-start justify-between gap-4 bg-neutral-50/50 dark:bg-zinc-950/30">
          <div className="flex items-center gap-3.5">
            <div className={`p-3 rounded-2xl border ${styleInfo.colorClass} shadow-xs shrink-0`}>
              <CategoryIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-neutral-950 dark:text-neutral-50 tracking-tight">
                  {categoryName}
                </h2>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${styleInfo.colorClass}`}>
                  Catégorie Dépense
                </span>
              </div>
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-neutral-400" />
                <span>Période : <strong className="text-neutral-700 dark:text-neutral-200">{periodLabel}</strong></span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-xl transition-colors cursor-pointer"
            title="Fermer la fenêtre (Échap)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* METRICS SUMMARY BAR */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 sm:p-6 bg-neutral-100/40 dark:bg-zinc-950/40 border-b border-neutral-100 dark:border-neutral-800/60 text-xs">
          <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 p-3 rounded-2xl shadow-3xs">
            <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              Total Dépensé
            </span>
            <span className="text-base font-black text-rose-600 dark:text-rose-400 mt-0.5 block">
              {totalAmount.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-xs text-neutral-400">MAD</span>
            </span>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 p-3 rounded-2xl shadow-3xs">
            <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              Nombre d'opérations
            </span>
            <span className="text-base font-black text-neutral-800 dark:text-neutral-100 mt-0.5 block">
              {categoryTransactions.length} <span className="text-xs font-semibold text-neutral-400">trans.</span>
            </span>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 p-3 rounded-2xl shadow-3xs">
            <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              Moyenne / Opération
            </span>
            <span className="text-base font-black text-neutral-800 dark:text-neutral-100 mt-0.5 block">
              {avgAmount.toLocaleString("fr-FR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })} <span className="text-xs font-semibold text-neutral-400">MAD</span>
            </span>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 p-3 rounded-2xl shadow-3xs">
            <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider block">
              Part du Budget Total
            </span>
            <span className="text-base font-black text-purple-600 dark:text-purple-400 mt-0.5 block">
              {percentShare > 0 ? `${percentShare.toFixed(1)} %` : "N/A"}
            </span>
          </div>
        </div>

        {/* SEARCH & CONTROLS */}
        <div className="px-5 py-3 border-b border-neutral-100 dark:border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-zinc-900">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher une transaction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 pl-9 pr-3 py-1.5 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-neutral-800 dark:text-neutral-200"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto text-xs">
            <span className="text-neutral-400 font-semibold hidden sm:inline">Trier par :</span>
            <div className="flex items-center gap-1 bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 px-2.5 py-1.5 rounded-xl font-bold text-neutral-700 dark:text-neutral-300">
              <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <select
                value={sortOrder}
                onChange={(e: any) => setSortOrder(e.target.value)}
                className="bg-transparent border-none text-xs font-bold text-neutral-800 dark:text-neutral-200 focus:outline-none cursor-pointer"
              >
                <option value="date-desc" className="dark:bg-zinc-900">Date (Plus récents)</option>
                <option value="date-asc" className="dark:bg-zinc-900">Date (Plus anciens)</option>
                <option value="amount-desc" className="dark:bg-zinc-900">Montant (Plus élevé)</option>
                <option value="amount-asc" className="dark:bg-zinc-900">Montant (Plus faible)</option>
              </select>
            </div>
          </div>
        </div>

        {/* TRANSACTIONS LIST CONTAINER */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Active Subscriptions banner if applicable */}
          {categoryAbonnements.length > 0 && (
            <div className="bg-purple-50/60 dark:bg-purple-950/30 border border-purple-200/80 dark:border-purple-800/50 rounded-2xl p-4 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-purple-900 dark:text-purple-200 flex items-center gap-2">
                  <Repeat className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Charges Fixes & Abonnements Récurrents Inclus ({categoryAbonnements.length})</span>
                </h4>
                <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300">
                  Total : {categoryAbonnements.reduce((s, a) => s + (a.billingPeriod === "Mensuel" ? a.costMonthly : a.costMonthly / 12), 0).toLocaleString("fr-FR")} MAD/mois
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {categoryAbonnements.map((sub) => (
                  <div key={sub.id} className="bg-white dark:bg-zinc-900 border border-purple-100 dark:border-purple-900/50 p-3 rounded-xl flex items-center justify-between text-xs shadow-3xs">
                    <div className="space-y-0.5">
                      <span className="font-bold text-neutral-900 dark:text-neutral-100 block">{sub.serviceName}</span>
                      <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
                        {sub.category || "Abonnement"} • Facturation {sub.billingPeriod}
                      </span>
                    </div>
                    <div className="font-black font-mono text-purple-600 dark:text-purple-400 shrink-0 ml-2">
                      -{sub.costMonthly.toLocaleString("fr-FR")} MAD/m
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Transactions Table / Cards */}
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3 bg-neutral-50/50 dark:bg-zinc-950/20 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
              <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-zinc-800 text-neutral-400 flex items-center justify-center mx-auto">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                  {searchTerm ? "Aucune transaction ne correspond à votre recherche." : "Aucune transaction enregistrée dans cette catégorie."}
                </p>
                <p className="text-[11px] text-neutral-400 mt-1">
                  Les dépenses saisies ou importées apparaîtront automatiquement ici avec leur détail complet.
                </p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-100/70 dark:bg-zinc-950 text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider text-[10px] border-b border-neutral-200/80 dark:border-neutral-800">
                  <tr>
                    <th className="py-3 px-3.5">Date</th>
                    <th className="py-3 px-3.5">Libellé & Destinataire</th>
                    <th className="py-3 px-3.5">Compte</th>
                    <th className="py-3 px-3.5 text-center">Statut</th>
                    <th className="py-3 px-3.5 text-right">Montant</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
                  {filteredTransactions.map((tx) => {
                    const isCompleted = !tx.status || tx.status === "Effectué";
                    return (
                      <tr 
                        key={tx.id} 
                        className="hover:bg-neutral-50/80 dark:hover:bg-zinc-850/50 transition-colors"
                      >
                        <td className="py-3 px-3.5 whitespace-nowrap text-neutral-600 dark:text-neutral-400 font-semibold">
                          {tx.date ? new Date(tx.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }) : "-"}
                        </td>
                        <td className="py-3 px-3.5">
                          <div className="font-bold text-neutral-900 dark:text-neutral-100">
                            {tx.description || "Dépense sans nom"}
                          </div>
                          {(tx.recipient || tx.note) && (
                            <div className="text-[11px] text-neutral-400 truncate max-w-xs mt-0.5">
                              {tx.recipient ? `Destinataire : ${tx.recipient}` : tx.note}
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-3.5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-neutral-100 dark:bg-zinc-800 text-neutral-700 dark:text-neutral-300 font-semibold text-[11px]">
                            <CreditCard className="w-3 h-3 text-neutral-400" />
                            {tx.account || "Compte Courant"}
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-center whitespace-nowrap">
                          {isCompleted ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                              <CheckCircle2 className="w-3 h-3" />
                              Effectué
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                              <Clock className="w-3 h-3" />
                              En attente
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-3.5 text-right font-black text-rose-600 dark:text-rose-400 whitespace-nowrap text-sm">
                          -{(tx.amount || 0).toLocaleString("fr-FR", { minimumFractionDigits: 2 })} MAD
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-zinc-950 flex items-center justify-between text-xs">
          <div className="text-neutral-400 font-medium hidden sm:block">
            Astuce : Cliquez en dehors du tableau ou appuyez sur <kbd className="px-1.5 py-0.5 bg-neutral-200 dark:bg-zinc-800 rounded text-[10px] font-mono text-neutral-700 dark:text-neutral-300">Échap</kbd> pour fermer.
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 font-bold rounded-xl transition-colors shadow-xs cursor-pointer ml-auto"
          >
            Fermer
          </button>
        </div>

      </div>
    </div>
  );
}
