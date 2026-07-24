import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Coins, 
  Plus, 
  Trash2, 
  Edit3, 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  Search, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Tag, 
  Calendar, 
  Building, 
  ShoppingBag, 
  PiggyBank, 
  PieChart, 
  Info, 
  Check, 
  X, 
  ChevronDown, 
  RefreshCw, 
  Download, 
  Upload,
  Zap,
  Briefcase,
  SlidersHorizontal,
  FolderTree
} from "lucide-react";
import { 
  FinanceTransaction, 
  FinanceSalaire, 
  Abonnement, 
  AchatMensuel, 
  Account, 
  FinanceBudget, 
  FinanceEpargne 
} from "../types";

export interface UnifiedFinancialEntrySectionProps {
  transactions: FinanceTransaction[];
  setTransactions: React.Dispatch<React.SetStateAction<FinanceTransaction[]>>;
  salaires: FinanceSalaire[];
  setSalaires: React.Dispatch<React.SetStateAction<FinanceSalaire[]>>;
  abonnements: Abonnement[];
  setAbonnements: React.Dispatch<React.SetStateAction<Abonnement[]>>;
  achatsMensuels: AchatMensuel[];
  setAchatsMensuels: React.Dispatch<React.SetStateAction<AchatMensuel[]>>;
  accounts: Account[];
  setAccounts: React.Dispatch<React.SetStateAction<Account[]>>;
  budgets: FinanceBudget[];
  setBudgets: React.Dispatch<React.SetStateAction<FinanceBudget[]>>;
  epargnes: FinanceEpargne[];
  setEpargnes: React.Dispatch<React.SetStateAction<FinanceEpargne[]>>;
  triggerToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
}

// TAXONOMY DEFINITION (Catégories Principales et Sous-Catégories)
export const FINANCIAL_TAXONOMY: Record<string, { label: string; icon: any; color: string; subCategories: string[] }> = {
  "Salaire & Revenus": {
    label: "Salaire & Revenus",
    icon: TrendingUp,
    color: "emerald",
    subCategories: [
      "Salaire Fixe Principal",
      "Prime & Gratification",
      "Freelance & Consulting",
      "YouTube & AdSense",
      "Sponsoring & Partenariats",
      "Dividendes & Bourse BVC",
      "Revenus Immobiliers",
      "Remboursements & Avoirs",
      "Autre Revenu"
    ]
  },
  "Charges Fixes & Abonnements": {
    label: "Charges Fixes & Abonnements",
    icon: Zap,
    color: "amber",
    subCategories: [
      "Loyer & Logement",
      "Électricité & Eau (Redal/Lydec)",
      "Télécom & Fibre (IAM/Orange/INWI)",
      "Assurances & Mutuelles",
      "Abonnements SaaS & Logiciels",
      "Hébergement & Domaines Web",
      "Streaming & Loisirs (Netflix/Spotify)",
      "Frais Bancaires & Tenue de Compte",
      "Autre Charge Fixe"
    ]
  },
  "Dépenses Courantes & Achats": {
    label: "Dépenses Courantes & Achats",
    icon: ShoppingBag,
    color: "rose",
    subCategories: [
      "Courses Alimentaires & Supermarché",
      "Transport & Carburant",
      "Restaurants & Cafés",
      "Équipement Pro & High-Tech",
      "Shopping & Vêtements",
      "Santé, Pharmacie & Soins",
      "Cadeaux & Événements",
      "Autres Dépenses"
    ]
  },
  "Épargne & Projets Futurs": {
    label: "Épargne & Projets Futurs",
    icon: PiggyBank,
    color: "indigo",
    subCategories: [
      "Épargne de Sécurité & Précaution",
      "Apport Projet Immobilier",
      "Fonds d'Urgence",
      "Voyage & Vacances",
      "Achat Équipement & Wishlist",
      "Autre Épargne"
    ]
  },
  "Investissements & Actifs": {
    label: "Investissements & Actifs",
    icon: Briefcase,
    color: "cyan",
    subCategories: [
      "Achat Actions BVC (Bourse Casablanca)",
      "Portefeuille Crypto-Actifs",
      "Placements SCPI / FCP",
      "Autre Investissement"
    ]
  }
};

export default function UnifiedFinancialEntrySection({
  transactions,
  setTransactions,
  salaires,
  setSalaires,
  abonnements,
  setAbonnements,
  achatsMensuels,
  setAchatsMensuels,
  accounts,
  setAccounts,
  budgets,
  setBudgets,
  epargnes,
  setEpargnes,
  triggerToast
}: UnifiedFinancialEntrySectionProps) {
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<FinanceTransaction | null>(null);

  // Form Fields
  const [date, setDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState<string>("");
  const [category, setCategory] = useState<string>("Dépenses Courantes & Achats");
  const [subCategory, setSubCategory] = useState<string>("Courses Alimentaires & Supermarché");
  const [type, setType] = useState<"Revenue" | "Dépense" | "Épargne" | "Investissement">("Dépense");
  const [amount, setAmount] = useState<string>("");
  const [account, setAccount] = useState<string>(accounts[0]?.name || "Attijariwafa Bank");
  const [recipient, setRecipient] = useState<string>("");
  const [recurrence, setRecurrence] = useState<"Ponctuel" | "Mensuel" | "Annuel">("Ponctuel");
  const [status, setStatus] = useState<"Effectué" | "En attente">("Effectué");
  const [note, setNote] = useState<string>("");

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("Tous");
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>("Tous");

  // Sync subcategories dropdown when category changes
  const handleCategoryChange = (newCat: string) => {
    setCategory(newCat);
    const availableSubs = FINANCIAL_TAXONOMY[newCat]?.subCategories || ["Général"];
    setSubCategory(availableSubs[0]);
    if (newCat === "Salaire & Revenus") {
      setType("Revenue");
    } else if (newCat === "Épargne & Projets Futurs") {
      setType("Épargne");
    } else if (newCat === "Investissements & Actifs") {
      setType("Investissement");
    } else {
      setType("Dépense");
    }
  };

  // Open modal for new
  const handleOpenNewModal = () => {
    setEditingTx(null);
    setDate(new Date().toISOString().split("T")[0]);
    setDescription("");
    setCategory("Dépenses Courantes & Achats");
    setSubCategory("Courses Alimentaires & Supermarché");
    setType("Dépense");
    setAmount("");
    setAccount(accounts[0]?.name || "Attijariwafa Bank");
    setRecipient("");
    setRecurrence("Ponctuel");
    setStatus("Effectué");
    setNote("");
    setIsModalOpen(true);
  };

  // Open modal for edit
  const handleOpenEditModal = (tx: FinanceTransaction) => {
    setEditingTx(tx);
    setDate(tx.date || new Date().toISOString().split("T")[0]);
    setDescription(tx.description || "");
    const matchedCat = Object.keys(FINANCIAL_TAXONOMY).find(k => k.toLowerCase() === (tx.category || "").toLowerCase()) || tx.category || "Dépenses Courantes & Achats";
    setCategory(matchedCat);
    setSubCategory(tx.subCategory || FINANCIAL_TAXONOMY[matchedCat]?.subCategories[0] || "Général");
    setType((tx.type as any) || "Dépense");
    setAmount(tx.amount ? String(tx.amount) : "");
    setAccount(tx.account || accounts[0]?.name || "Attijariwafa Bank");
    setRecipient(tx.recipient || "");
    setRecurrence(tx.recurrence || "Ponctuel");
    setStatus(tx.status === "En attente" ? "En attente" : "Effectué");
    setNote(tx.note || "");
    setIsModalOpen(true);
  };

  // SAVE TRANSACTION & DISPATCH TO ALL MODULES
  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      if (triggerToast) triggerToast("Veuillez saisir un montant valide.", "error");
      return;
    }
    if (!description.trim()) {
      if (triggerToast) triggerToast("Veuillez remplir le libellé de la transaction.", "error");
      return;
    }

    const txId = editingTx ? editingTx.id : "tx_" + Date.now();
    const updatedTx: FinanceTransaction = {
      id: txId,
      date,
      description,
      category,
      subCategory,
      type,
      amount: parsedAmount,
      account,
      recipient,
      recurrence,
      status,
      note
    };

    // 1. Master Transactions State Update
    if (editingTx) {
      setTransactions(prev => prev.map(t => t.id === editingTx.id ? updatedTx : t));
    } else {
      setTransactions(prev => [updatedTx, ...prev]);
    }

    let dispatchLog: string[] = ["Transaction enregistrée dans le journal maître"];

    // 2. DISPATCH TO SALAIRES & REVENUS
    if (category === "Salaire & Revenus" || type === "Revenue") {
      const salEntry: FinanceSalaire = {
        id: "sal_" + Date.now(),
        date,
        source: recipient ? `${description} (${recipient})` : description,
        grossAmount: parsedAmount,
        netAmount: parsedAmount,
        status: status === "En attente" ? "En attente" : "Reçu"
      };
      setSalaires(prev => [salEntry, ...prev]);
      dispatchLog.push("Déversé dans 'Salaires & Revenus'");
    }

    // 3. DISPATCH TO ABONNEMENTS & CHARGES
    if (category === "Charges Fixes & Abonnements" || recurrence === "Mensuel" || recurrence === "Annuel") {
      const subEntry: Abonnement = {
        id: "sub_" + Date.now(),
        serviceName: description,
        costMonthly: recurrence === "Annuel" ? Math.round(parsedAmount / 12) : parsedAmount,
        billingPeriod: recurrence === "Annuel" ? "Annuel" : "Mensuel",
        nextBillingDate: date,
        status: "Actif"
      };
      setAbonnements(prev => {
        const exists = prev.some(a => a.serviceName.toLowerCase() === description.toLowerCase());
        if (exists) {
          return prev.map(a => a.serviceName.toLowerCase() === description.toLowerCase() ? { ...a, costMonthly: subEntry.costMonthly } : a);
        }
        return [subEntry, ...prev];
      });
      dispatchLog.push("Synchronisé avec 'Abonnements & Charges'");
    }

    // 4. DISPATCH TO ACHATS MENSUELS
    if (category === "Dépenses Courantes & Achats") {
      const achEntry: AchatMensuel = {
        id: "ach_" + Date.now(),
        date,
        itemName: description,
        store: recipient || "Magasin",
        category: subCategory || "Autres",
        amount: parsedAmount,
        priority: "Moyenne",
        status: "Acheté"
      };
      setAchatsMensuels(prev => [achEntry, ...prev]);
      dispatchLog.push("Ajouté aux 'Achats Mensuels'");
    }

    // 5. DISPATCH TO ACCOUNTS
    if (account && accounts.length > 0) {
      const isRevenue = type === "Revenue" || category === "Salaire & Revenus";
      const delta = isRevenue ? parsedAmount : -parsedAmount;
      setAccounts(prev => prev.map(acc => {
        if (acc.name.toLowerCase() === account.toLowerCase()) {
          return { ...acc, balance: Math.max(0, acc.balance + delta) };
        }
        return acc;
      }));
      dispatchLog.push(`Solde ajusté sur le compte '${account}'`);
    }

    // 6. DISPATCH TO BUDGETS
    if (type === "Dépense" || category === "Dépenses Courantes & Achats" || category === "Charges Fixes & Abonnements") {
      setBudgets(prev => prev.map(b => {
        const isMatch = b.category.toLowerCase().includes(category.toLowerCase()) || 
                        b.category.toLowerCase().includes(subCategory.toLowerCase()) ||
                        category.toLowerCase().includes(b.category.toLowerCase());
        if (isMatch) {
          return { ...b, spentAmount: b.spentAmount + parsedAmount };
        }
        return b;
      }));
      dispatchLog.push("Enveloppes budgétaires actualisées");
    }

    // 7. DISPATCH TO EPARGNES
    if (type === "Épargne" || category === "Épargne & Projets Futurs") {
      setEpargnes(prev => prev.map(ep => {
        if (subCategory && ep.name.toLowerCase().includes(subCategory.toLowerCase())) {
          return { ...ep, currentAmount: ep.currentAmount + parsedAmount };
        }
        return ep;
      }));
      dispatchLog.push("Affecté aux Objectifs d'Épargne");
    }

    if (triggerToast) {
      triggerToast(`✨ Flux enregistré avec succès ! (${dispatchLog.slice(1).join(", ")})`, "success");
    }

    setIsModalOpen(false);
  };

  // Delete transaction
  const handleDeleteTx = (id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
    if (triggerToast) triggerToast("Transaction supprimée du journal.", "info");
  };

  // KPI Calculations
  const stats = useMemo(() => {
    let totalRev = 0;
    let totalCharges = 0;
    let totalAchats = 0;
    let totalEpargne = 0;

    transactions.forEach(t => {
      const amt = Number(t.amount) || 0;
      if (t.type === "Revenue" || t.category === "Salaire & Revenus") {
        totalRev += amt;
      } else if (t.category === "Charges Fixes & Abonnements" || t.recurrence === "Mensuel") {
        totalCharges += amt;
      } else if (t.type === "Épargne" || t.category === "Épargne & Projets Futurs") {
        totalEpargne += amt;
      } else {
        totalAchats += amt;
      }
    });

    const netBalance = totalRev - (totalCharges + totalAchats + totalEpargne);
    return { totalRev, totalCharges, totalAchats, totalEpargne, netBalance };
  }, [transactions]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const matchesSearch = (t.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (t.recipient || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (t.subCategory || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
                            (t.account || "").toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCat = selectedCategoryFilter === "Tous" || t.category === selectedCategoryFilter;
      const matchesType = selectedTypeFilter === "Tous" || t.type === selectedTypeFilter;

      return matchesSearch && matchesCat && matchesType;
    });
  }, [transactions, searchTerm, selectedCategoryFilter, selectedTypeFilter]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* TOP HEADER & ACTION BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-neutral-900 to-indigo-950 text-white rounded-3xl p-6 shadow-md border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-[11px] font-mono font-bold rounded-full flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Guichet Unique Financial & Dispatcher
            </span>
          </div>
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            Saisie Unifiée des Flux Financials
          </h2>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Saisissez ici l'ensemble de vos opérations (salaires, charges, abonnements, courses, épargne). Choisissez la <strong className="text-indigo-300">Catégorie Principale</strong> et la <strong className="text-emerald-300">Sous-catégorie Détaillée</strong> : le système dispatchera automatiquement vos données vers tous les sous-modules de l'application !
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={handleOpenNewModal}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 cursor-pointer border border-indigo-400/40 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Saisir un Nouveau Flux Financial</span>
          </button>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI DISPATCH SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenus */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-xs hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5 text-neutral-600">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Revenus & Rentrées
            </span>
            <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-mono font-bold">
              Dispatch Salaires
            </span>
          </div>
          <div className="text-xl font-black font-mono text-neutral-900">
            +{stats.totalRev.toLocaleString("fr-FR")} <span className="text-xs font-sans font-normal text-neutral-400">MAD</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Saisie salaires, freelance & AdSense</p>
        </div>

        {/* Total Charges Fixes */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-xs hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5 text-neutral-600">
              <Zap className="w-4 h-4 text-amber-600" />
              Charges & Abonnements
            </span>
            <span className="text-[10px] bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-mono font-bold">
              Dispatch Charges
            </span>
          </div>
          <div className="text-xl font-black font-mono text-neutral-900">
            -{stats.totalCharges.toLocaleString("fr-FR")} <span className="text-xs font-sans font-normal text-neutral-400">MAD</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Loyer, électricité, SaaS & récurrents</p>
        </div>

        {/* Total Dépenses Courantes */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-xs hover:border-rose-300 transition-all">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5 text-neutral-600">
              <ShoppingBag className="w-4 h-4 text-rose-600" />
              Dépenses Courantes
            </span>
            <span className="text-[10px] bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-mono font-bold">
              Dispatch Achats
            </span>
          </div>
          <div className="text-xl font-black font-mono text-neutral-900">
            -{stats.totalAchats.toLocaleString("fr-FR")} <span className="text-xs font-sans font-normal text-neutral-400">MAD</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Courses, transport, tech & sorties</p>
        </div>

        {/* Net Solde */}
        <div className="bg-white border border-neutral-200/90 rounded-2xl p-4 shadow-xs hover:border-indigo-300 transition-all">
          <div className="flex items-center justify-between text-neutral-500 text-xs font-bold mb-2">
            <span className="flex items-center gap-1.5 text-neutral-600">
              <Coins className="w-4 h-4 text-indigo-600" />
              Capacité Nette Réelle
            </span>
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-mono font-bold">
              Dispatch Comptes
            </span>
          </div>
          <div className={`text-xl font-black font-mono ${stats.netBalance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
            {stats.netBalance >= 0 ? '+' : ''}{stats.netBalance.toLocaleString("fr-FR")} <span className="text-xs font-sans font-normal text-neutral-400">MAD</span>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">Flux disponible calculé en temps réel</p>
        </div>
      </div>

      {/* SEARCH, FILTER & CATEGORY TABS */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-neutral-400" />
            <input
              type="text"
              placeholder="Rechercher par libellé, sous-catégorie, destinataire ou banque..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-2xl text-xs text-neutral-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white transition-all font-medium"
            />
          </div>

          {/* Type Filter dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-neutral-500">Filtrer par type :</span>
            <select
              value={selectedTypeFilter}
              onChange={e => setSelectedTypeFilter(e.target.value)}
              className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold text-neutral-800 focus:outline-hidden"
            >
              <option value="Tous">Tous les Types</option>
              <option value="Revenue">Revenus uniquement</option>
              <option value="Dépense">Dépenses uniquement</option>
              <option value="Épargne">Épargne uniquement</option>
              <option value="Investissement">Investissements uniquement</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none border-t border-neutral-100 pt-3">
          <button
            onClick={() => setSelectedCategoryFilter("Tous")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategoryFilter === "Tous"
                ? "bg-neutral-900 text-white shadow-3xs"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
            }`}
          >
            Toutes les Catégories ({transactions.length})
          </button>

          {Object.keys(FINANCIAL_TAXONOMY).map(catKey => {
            const tax = FINANCIAL_TAXONOMY[catKey];
            const count = transactions.filter(t => t.category === catKey).length;
            const isSelected = selectedCategoryFilter === catKey;

            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategoryFilter(catKey)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  isSelected
                    ? "bg-indigo-600 text-white shadow-3xs"
                    : "bg-neutral-50 border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                }`}
              >
                <span>{tax.label}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                  isSelected ? "bg-white/20 text-white" : "bg-neutral-200/80 text-neutral-700"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MASTER TRANSACTIONS TABLE */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-neutral-900 tracking-tight flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-indigo-600" />
              Journal des Flux & Dispatch Actif ({filteredTransactions.length})
            </h3>
            <p className="text-xs text-neutral-500">Chaque entrée est classée par catégorie & sous-catégorie et transmise aux dashboards respectifs.</p>
          </div>

          <button
            onClick={handleOpenNewModal}
            className="px-3.5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-3xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ajouter une ligne</span>
          </button>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-neutral-200 rounded-2xl">
            <Coins className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-neutral-600">Aucun flux financier correspondant aux critères.</p>
            <p className="text-[11px] text-neutral-400 mt-1">Saisissez un nouveau flux pour alimenter vos tableaux de bord.</p>
            <button
              onClick={handleOpenNewModal}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              + Saisir un flux
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50/80 text-neutral-500 font-bold uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-4 rounded-l-xl">Date</th>
                  <th className="py-3 px-4">Libellé & Destinataire</th>
                  <th className="py-3 px-4">Catégorie Principale</th>
                  <th className="py-3 px-4">Sous-Catégorie Détaillée</th>
                  <th className="py-3 px-4">Compte Source</th>
                  <th className="py-3 px-4 text-right">Montant (MAD)</th>
                  <th className="py-3 px-4 rounded-r-xl text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium">
                {filteredTransactions.map(tx => {
                  const isRevenue = tx.type === "Revenue" || tx.category === "Salaire & Revenus";
                  const isEpargne = tx.type === "Épargne" || tx.category === "Épargne & Projets Futurs";
                  
                  return (
                    <tr key={tx.id} className="hover:bg-neutral-50/80 transition-colors group">
                      <td className="py-3 px-4 text-neutral-500 font-mono text-[11px] whitespace-nowrap">
                        {tx.date}
                      </td>
                      
                      <td className="py-3 px-4">
                        <div className="font-extrabold text-neutral-900 group-hover:text-indigo-600 transition-colors">
                          {tx.description}
                        </div>
                        {tx.recipient && (
                          <div className="text-[10px] text-neutral-400 font-mono">
                            Partie prenante: {tx.recipient}
                          </div>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-neutral-100 text-neutral-800 border border-neutral-200">
                          {tx.category || "Dépenses Courantes"}
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {tx.subCategory || "Général"}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-neutral-600 font-mono text-[11px]">
                        {tx.account || "Attijariwafa Bank"}
                      </td>

                      <td className="py-3 px-4 text-right font-mono font-black text-sm whitespace-nowrap">
                        <span className={isRevenue ? "text-emerald-600" : isEpargne ? "text-indigo-600" : "text-neutral-900"}>
                          {isRevenue ? "+" : isEpargne ? "➡️ " : "-"}{(Number(tx.amount) || 0).toLocaleString("fr-FR")} <span className="text-[10px] font-normal text-neutral-400">MAD</span>
                        </span>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleOpenEditModal(tx)}
                            className="p-1.5 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all cursor-pointer"
                            title="Éditer le flux"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTx(tx.id)}
                            className="p-1.5 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-rose-50 hover:text-rose-600 transition-all cursor-pointer"
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
        )}
      </div>

      {/* MODAL FOR NEW / EDIT TRANSACTION */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-neutral-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-2xl max-w-2xl w-full space-y-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
                    <Coins className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-neutral-900 tracking-tight">
                      {editingTx ? "Éditer le Flux Financial" : "Saisir un Nouveau Flux Financial"}
                    </h3>
                    <p className="text-xs text-neutral-500">
                      Entrée unique multi-critères avec dispatch automatique.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveTransaction} className="space-y-4 text-xs">
                {/* CATEGORY & SUBCATEGORY SELECTION */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl">
                  {/* Catégorie Principale */}
                  <div>
                    <label className="block text-neutral-800 font-bold mb-1.5">
                      Catégorie Principale <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={e => handleCategoryChange(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl font-bold text-neutral-900 focus:outline-hidden focus:border-indigo-500"
                    >
                      {Object.keys(FINANCIAL_TAXONOMY).map(cKey => (
                        <option key={cKey} value={cKey}>
                          {FINANCIAL_TAXONOMY[cKey].label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Sous-catégorie Détaillée */}
                  <div>
                    <label className="block text-neutral-800 font-bold mb-1.5">
                      Sous-Catégorie Détaillée <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={subCategory}
                      onChange={e => setSubCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-xl font-bold text-indigo-900 focus:outline-hidden focus:border-indigo-500"
                    >
                      {(FINANCIAL_TAXONOMY[category]?.subCategories || ["Général"]).map(sub => (
                        <option key={sub} value={sub}>
                          {sub}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* DESCRIPTION & MONTANT */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-neutral-700 font-bold mb-1">
                      Libellé / Description du Flux <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="ex: Salaire Attijari M-07, Loyer, Courses Marjane, Adobe CC"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-semibold text-neutral-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-bold mb-1">
                      Montant (MAD) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="any"
                      placeholder="ex: 15000"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-300 rounded-xl font-black font-mono text-neutral-900 focus:outline-hidden focus:border-indigo-500 focus:bg-white"
                    />
                  </div>
                </div>

                {/* DATE, TYPE & RECURRENCE */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-neutral-700 font-bold mb-1">Date du flux</label>
                    <input
                      type="date"
                      value={date}
                      onChange={e => setDate(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-medium text-neutral-800"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-bold mb-1">Nature de l'opération</label>
                    <select
                      value={type}
                      onChange={e => setType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-bold text-neutral-800"
                    >
                      <option value="Dépense font-bold">🔴 Dépense / Sortie</option>
                      <option value="Revenue">🟢 Revenu / Rentrée</option>
                      <option value="Épargne">🔵 Épargne & Transfert</option>
                      <option value="Investissement">🟣 Investissement (Actif)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-bold mb-1">Périodicité / Récurrence</label>
                    <select
                      value={recurrence}
                      onChange={e => setRecurrence(e.target.value as any)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-bold text-neutral-800"
                    >
                      <option value="Ponctuel">Ponctuel (1 fois)</option>
                      <option value="Mensuel">Mensuel (Récurrent)</option>
                      <option value="Annuel">Annuel</option>
                    </select>
                  </div>
                </div>

                {/* COMPTE BANCAIRE & DESTINATAIRE */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-700 font-bold mb-1">Compte Bancaire / Source</label>
                    <select
                      value={account}
                      onChange={e => setAccount(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-bold text-neutral-800"
                    >
                      {accounts.length > 0 ? (
                        accounts.map(acc => (
                          <option key={acc.id} value={acc.name}>
                            {acc.name} ({acc.balance.toLocaleString("fr-FR")} MAD)
                          </option>
                        ))
                      ) : (
                        <option value="Attijariwafa Bank">Attijariwafa Bank</option>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-bold mb-1">Destinataire / Tiers / Entité</label>
                    <input
                      type="text"
                      placeholder="ex: Employeur, Marjane, Netflix, Lydec, IAM"
                      value={recipient}
                      onChange={e => setRecipient(e.target.value)}
                      className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-medium text-neutral-800"
                    />
                  </div>
                </div>

                {/* NOTES / REMARQUES */}
                <div>
                  <label className="block text-neutral-700 font-bold mb-1">Notes / Référence justificative (Optionnel)</label>
                  <textarea
                    rows={2}
                    placeholder="Numéro de facture, note personnelle..."
                    value={note}
                    onChange={e => setNote(e.target.value)}
                    className="w-full px-3.5 py-2 bg-neutral-50 border border-neutral-300 rounded-xl font-medium text-neutral-800 resize-none"
                  />
                </div>

                {/* DISPATCH AUTOMATIC NOTIFICATION PREVIEW */}
                <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl text-[11px] text-emerald-800 font-medium flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-extrabold block">Automation & Dispatch Actif :</span>
                    En enregistrant ce flux sous <strong>{category}</strong> ({subCategory}), il sera immédiatement propagé vers vos dashboards, compte {account}, budgets mensuels et relevés statistiques.
                  </div>
                </div>

                {/* FORM ACTIONS */}
                <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-600 font-bold hover:bg-neutral-100 cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black shadow-md cursor-pointer transition-all flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Enregistrer & Dispatcher</span>
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
