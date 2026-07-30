import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  ArrowRightLeft, 
  Wallet, 
  PiggyBank, 
  CheckCircle2, 
  TrendingUp, 
  AlertTriangle, 
  Coins, 
  PlusCircle, 
  RotateCcw, 
  Sliders, 
  Sparkles, 
  Receipt, 
  X,
  CreditCard,
  ArrowUpRight,
  Info
} from "lucide-react";
import { Account, FinanceEpargne, FinanceTransaction } from "../types";

interface EmergencyFundSectionCardProps {
  accounts: Account[];
  epargnes: FinanceEpargne[];
  transactions: FinanceTransaction[];
  setAccounts?: React.Dispatch<React.SetStateAction<Account[]>>;
  setEpargnes?: React.Dispatch<React.SetStateAction<FinanceEpargne[]>>;
  setTransactions?: React.Dispatch<React.SetStateAction<FinanceTransaction[]>>;
  triggerToast?: (message: string, type?: "success" | "info" | "warning" | "error") => void;
}

export default function EmergencyFundSectionCard({
  accounts = [],
  epargnes = [],
  transactions = [],
  setAccounts,
  setEpargnes,
  setTransactions,
  triggerToast
}: EmergencyFundSectionCardProps) {
  // Find emergency fund goal or fallback
  const emergencyFundGoal = useMemo(() => {
    const match = epargnes.find(e => {
      const nameLower = (e.name || "").toLowerCase();
      return nameLower.includes("secours") || nameLower.includes("urgence") || nameLower.includes("sécurité");
    });

    if (match) return match;

    // Default object if not found
    return {
      id: "e_emergency_fund",
      name: "Fonds de Secours & Sécurité",
      targetAmount: 45000,
      currentAmount: 32000,
      deadline: "2026-12-31",
      status: "En cours" as const
    };
  }, [epargnes]);

  // Estimate essential monthly expenses (for runway calculation)
  const estimatedMonthlyExpense = useMemo(() => {
    const recentExpenses = transactions.filter(t => t.type === "Dépense" && t.amount > 0);
    if (recentExpenses.length === 0) return 12000;

    const total = recentExpenses.reduce((sum, t) => sum + t.amount, 0);
    // Rough monthly average estimate
    const monthsCount = 3;
    const avg = total / monthsCount;
    return avg > 3000 ? Math.round(avg) : 12000;
  }, [transactions]);

  // Current coverage in months
  const monthsCovered = useMemo(() => {
    if (!estimatedMonthlyExpense || estimatedMonthlyExpense <= 0) return 0;
    return (emergencyFundGoal.currentAmount / estimatedMonthlyExpense);
  }, [emergencyFundGoal.currentAmount, estimatedMonthlyExpense]);

  // Progress percentage
  const progressPercent = useMemo(() => {
    if (!emergencyFundGoal.targetAmount || emergencyFundGoal.targetAmount <= 0) return 0;
    return Math.min(100, Math.round((emergencyFundGoal.currentAmount / emergencyFundGoal.targetAmount) * 100));
  }, [emergencyFundGoal.currentAmount, emergencyFundGoal.targetAmount]);

  // Source accounts suitable for transfer (checking accounts / cash)
  const eligibleAccounts = useMemo(() => {
    if (accounts.length === 0) {
      return [
        { id: "acc1", name: "Compte Courant BMCE", type: "Bancaire" as const, balance: 45000, currency: "MAD" },
        { id: "acc2", name: "Compte Espèces", type: "Espèces" as const, balance: 6500, currency: "MAD" }
      ];
    }
    return accounts;
  }, [accounts]);

  // Transfer form state
  const [selectedAccountId, setSelectedAccountId] = useState<string>(() => eligibleAccounts[0]?.id || "");
  const [transferAmount, setTransferAmount] = useState<number>(1000);
  const [transferNote, setTransferNote] = useState<string>("Apport mensuel Fonds de Secours");
  const [isTransferring, setIsTransferring] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showEditTargetModal, setShowEditTargetModal] = useState<boolean>(false);
  const [customTargetAmount, setCustomTargetAmount] = useState<number>(emergencyFundGoal.targetAmount);

  const selectedAccount = useMemo(() => {
    return eligibleAccounts.find(a => a.id === selectedAccountId) || eligibleAccounts[0];
  }, [eligibleAccounts, selectedAccountId]);

  // Pre-transfer check before showing confirmation AlertDialog
  const handlePreTransferCheck = () => {
    if (!selectedAccount) {
      triggerToast?.("Veuillez sélectionner un compte source.", "warning");
      return;
    }

    if (!transferAmount || transferAmount <= 0) {
      triggerToast?.("Veuillez indiquer un montant supérieur à 0 MAD.", "warning");
      return;
    }

    if (transferAmount > selectedAccount.balance) {
      triggerToast?.(`Solde insuffisant sur ${selectedAccount.name} (${selectedAccount.balance.toLocaleString("fr-FR")} MAD disponible).`, "error");
      return;
    }

    // Open confirmation AlertDialog
    setShowConfirmModal(true);
  };

  // Recent emergency fund transfers history
  const emergencyFundHistory = useMemo(() => {
    return transactions.filter(t => {
      const desc = (t.description || "").toLowerCase();
      const cat = (t.category || "").toLowerCase();
      const note = (t.note || "").toLowerCase();
      return (
        desc.includes("secours") || desc.includes("urgence") || 
        cat.includes("secours") || cat.includes("urgence") ||
        note.includes("secours") || note.includes("urgence") ||
        t.subCategory === "Fonds de Secours"
      );
    }).slice(0, 5);
  }, [transactions]);

  // Quick preset transfer buttons
  const presetAmounts = [500, 1000, 2000, 5000, 10000];

  // Execute transfer action
  const handleExecuteTransfer = () => {
    if (!selectedAccount) {
      triggerToast?.("Veuillez sélectionner un compte source.", "warning");
      return;
    }

    if (!transferAmount || transferAmount <= 0) {
      triggerToast?.("Veuillez indiquer un montant supérieur à 0 MAD.", "warning");
      return;
    }

    if (transferAmount > selectedAccount.balance) {
      triggerToast?.(`Solde insuffisant sur ${selectedAccount.name} (${selectedAccount.balance.toLocaleString("fr-FR")} MAD disponible).`, "error");
      return;
    }

    setIsTransferring(true);

    try {
      const nowStr = new Date().toISOString().split("T")[0];

      // 1. Deduct balance from source account
      if (setAccounts) {
        setAccounts(prev => prev.map(acc => {
          if (acc.id === selectedAccount.id) {
            return { ...acc, balance: Math.max(0, acc.balance - transferAmount) };
          }
          return acc;
        }));
      }

      // 2. Add amount to emergency fund epargne
      if (setEpargnes) {
        setEpargnes(prev => {
          const exists = prev.some(e => e.id === emergencyFundGoal.id);
          if (exists) {
            return prev.map(e => {
              if (e.id === emergencyFundGoal.id) {
                const newCurrent = (e.currentAmount || 0) + transferAmount;
                const newStatus = newCurrent >= e.targetAmount ? "Atteint" : "En cours";
                return { ...e, currentAmount: newCurrent, status: newStatus };
              }
              return e;
            });
          } else {
            // Add new emergency fund epargne if wasn't in array
            const newEp: FinanceEpargne = {
              id: emergencyFundGoal.id,
              name: emergencyFundGoal.name,
              targetAmount: emergencyFundGoal.targetAmount,
              currentAmount: emergencyFundGoal.currentAmount + transferAmount,
              deadline: "2026-12-31",
              status: (emergencyFundGoal.currentAmount + transferAmount) >= emergencyFundGoal.targetAmount ? "Atteint" : "En cours"
            };
            return [newEp, ...prev];
          }
        });
      }

      // 3. Append transfer transaction record
      const newTx: FinanceTransaction = {
        id: `tx_secours_${Date.now()}`,
        date: nowStr,
        description: `Transfert vers ${emergencyFundGoal.name}`,
        category: "Épargne & Investissement",
        subCategory: "Fonds de Secours",
        type: "Épargne",
        amount: transferAmount,
        account: selectedAccount.name,
        recipient: emergencyFundGoal.name,
        recurrence: "Ponctuel",
        status: "Effectué",
        note: transferNote || "Transfert rapide de sécurité"
      };

      if (setTransactions) {
        setTransactions(prev => [newTx, ...prev]);
      }

      triggerToast?.(
        `Transfert de ${transferAmount.toLocaleString("fr-FR")} MAD vers le Fonds de secours réussi !`, 
        "success"
      );

      // Reset form and close modal
      setTransferAmount(1000);
      setShowConfirmModal(false);
    } catch (err) {
      triggerToast?.("Une erreur est survenue lors du transfert.", "error");
    } finally {
      setIsTransferring(false);
    }
  };

  // Update target amount
  const handleSaveTargetAmount = () => {
    if (!customTargetAmount || customTargetAmount <= 0) return;

    if (setEpargnes) {
      setEpargnes(prev => {
        const exists = prev.some(e => e.id === emergencyFundGoal.id);
        if (exists) {
          return prev.map(e => e.id === emergencyFundGoal.id ? { ...e, targetAmount: customTargetAmount } : e);
        } else {
          return [{
            id: emergencyFundGoal.id,
            name: emergencyFundGoal.name,
            targetAmount: customTargetAmount,
            currentAmount: emergencyFundGoal.currentAmount,
            deadline: "2026-12-31",
            status: emergencyFundGoal.currentAmount >= customTargetAmount ? "Atteint" : "En cours"
          }, ...prev];
        }
      });
    }

    triggerToast?.(`Objectif du Fonds de secours ajusté à ${customTargetAmount.toLocaleString("fr-FR")} MAD`, "info");
    setShowEditTargetModal(false);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm space-y-6 transition-all relative overflow-hidden">
      
      {/* BACKGROUND DECORATIVE GLOW */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black text-neutral-950 dark:text-neutral-50 uppercase tracking-tight">
                  Fonds de Secours & Épargne d'Urgence
                </h3>
                {monthsCovered >= 3 ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Sécurisé ({monthsCovered.toFixed(1)} mois)
                  </span>
                ) : monthsCovered >= 1.5 ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    En constitution ({monthsCovered.toFixed(1)} mois)
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200/80 dark:border-rose-800/60 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    Niveau critique ({monthsCovered.toFixed(1)} mois)
                  </span>
                )}
              </div>
            </div>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            Réserve financière de précaution pour faire face aux impondérés sans impacter vos investissements long terme.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setCustomTargetAmount(emergencyFundGoal.targetAmount);
            setShowEditTargetModal(true);
          }}
          className="self-start md:self-auto px-3 py-1.5 rounded-xl bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 dark:hover:bg-zinc-700 text-neutral-700 dark:text-neutral-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shrink-0 border border-neutral-200/60 dark:border-neutral-700/60"
        >
          <Sliders className="w-3.5 h-3.5 text-neutral-400" />
          <span>Modifier l'objectif</span>
        </button>
      </div>

      {/* METRICS & PROGRESS DISPLAY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: GAUGE & PROGRESS */}
        <div className="lg:col-span-1 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow-2xs">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-neutral-500 dark:text-neutral-400">
              <span>Solde Actuel Cumulé</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-mono font-black">{progressPercent}% Atteint</span>
            </div>

            <div className="mt-2 text-3xl font-black text-neutral-950 dark:text-neutral-50 font-mono tracking-tight">
              {emergencyFundGoal.currentAmount.toLocaleString("fr-FR")} <span className="text-sm font-semibold text-neutral-400">MAD</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-neutral-200 dark:bg-zinc-800 h-3.5 rounded-full overflow-hidden mt-3 p-0.5 border border-neutral-300/40 dark:border-neutral-700/40">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-neutral-500 dark:text-neutral-400 font-medium mt-2">
              <span>Objectif : <strong className="text-neutral-800 dark:text-neutral-200 font-mono">{emergencyFundGoal.targetAmount.toLocaleString("fr-FR")} MAD</strong></span>
              <span>Reste : <strong className="text-emerald-700 dark:text-emerald-300 font-mono">{Math.max(0, emergencyFundGoal.targetAmount - emergencyFundGoal.currentAmount).toLocaleString("fr-FR")} MAD</strong></span>
            </div>
          </div>

          <div className="bg-white/80 dark:bg-zinc-900/80 p-3 rounded-xl border border-emerald-500/20 space-y-1.5 text-xs">
            <div className="font-bold text-neutral-900 dark:text-neutral-100 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300">
                <Coins className="w-3.5 h-3.5 text-emerald-500" />
                Couverture de sécurité :
              </span>
              <span className="font-mono font-black text-emerald-600 dark:text-emerald-400">
                ~{monthsCovered.toFixed(1)} mois
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 leading-snug">
              Basé sur des charges de <strong className="text-neutral-800 dark:text-neutral-200 font-mono">{estimatedMonthlyExpense.toLocaleString("fr-FR")} MAD/mois</strong>. Recommandation standard : 3 à 6 mois.
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: QUICK TRANSFER PANEL */}
        <div className="lg:col-span-2 bg-neutral-50/70 dark:bg-zinc-950/40 border border-neutral-200/80 dark:border-neutral-800/80 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-200/60 dark:border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-xs font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">
                Transfert Rapide depuis le Compte Courant
              </h4>
            </div>
            <span className="text-[11px] font-semibold text-neutral-400 hidden sm:inline">
              Alimentez immédiatement votre réserve d'urgence
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* SOURCE ACCOUNT SELECTION */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-neutral-400" />
                <span>Compte Source :</span>
              </label>
              <select
                value={selectedAccountId}
                onChange={(e) => setSelectedAccountId(e.target.value)}
                className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-2.5 text-xs font-bold text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 cursor-pointer"
              >
                {eligibleAccounts.map((acc) => (
                  <option key={acc.id} value={acc.id} className="dark:bg-zinc-900">
                    {acc.name} — Solde : {acc.balance.toLocaleString("fr-FR")} MAD
                  </option>
                ))}
              </select>
              {selectedAccount && (
                <div className="text-[11px] text-neutral-500 flex items-center justify-between px-1">
                  <span>Solde disponible :</span>
                  <span className="font-mono font-bold text-neutral-800 dark:text-neutral-200">{selectedAccount.balance.toLocaleString("fr-FR")} MAD</span>
                </div>
              )}
            </div>

            {/* TRANSFER AMOUNT INPUT */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <PiggyBank className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Montant à Transférer :</span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">MAD</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={100}
                  step={100}
                  value={transferAmount || ""}
                  onChange={(e) => setTransferAmount(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-xl pl-3 pr-14 py-2 text-sm font-black font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  placeholder="0"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400">
                  MAD
                </span>
              </div>
            </div>
          </div>

          {/* PRESET SHORTCUT BUTTONS */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400">
              Montants rapides prédéfinis :
            </span>
            <div className="flex items-center gap-2 flex-wrap">
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setTransferAmount(amt)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer border ${
                    transferAmount === amt
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-xs font-black"
                      : "bg-white dark:bg-zinc-900 border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  +{amt.toLocaleString("fr-FR")} MAD
                </button>
              ))}
            </div>
          </div>

          {/* ACTION BUTTON */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-[11px] text-neutral-500 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              <span>Met automatiquement à jour le compte courant et enregistre la transaction d'épargne.</span>
            </div>

            <button
              type="button"
              onClick={handlePreTransferCheck}
              disabled={isTransferring || !transferAmount || transferAmount <= 0}
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Transférer {transferAmount > 0 ? `${transferAmount.toLocaleString("fr-FR")} MAD` : ""} vers le Fonds de Secours</span>
            </button>
          </div>

        </div>

      </div>

      {/* RECENT TRANSFERS HISTORY */}
      {emergencyFundHistory.length > 0 && (
        <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Receipt className="w-3.5 h-3.5 text-neutral-400" />
              <span>Derniers Abondements Enregistrés ({emergencyFundHistory.length})</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {emergencyFundHistory.map((tx) => (
              <div 
                key={tx.id} 
                className="bg-neutral-50 dark:bg-zinc-950/50 border border-neutral-200/70 dark:border-neutral-800 p-2.5 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-neutral-800 dark:text-neutral-200 truncate max-w-[180px]">
                    {tx.description}
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    {tx.date ? new Date(tx.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }) : "-"} • {tx.account || "Compte"}
                  </div>
                </div>
                <div className="font-black text-emerald-600 dark:text-emerald-400 font-mono text-xs">
                  +{tx.amount.toLocaleString("fr-FR")} MAD
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TARGET EDIT MODAL */}
      <AnimatePresence>
        {showEditTargetModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4"
            >
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <h4 className="text-sm font-black text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-500" />
                  <span>Ajuster l'Objectif du Fonds de Secours</span>
                </h4>
                <button
                  type="button"
                  onClick={() => setShowEditTargetModal(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-bold text-neutral-700 dark:text-neutral-300 block">
                  Montant Cible Souhaité (MAD) :
                </label>
                <input
                  type="number"
                  value={customTargetAmount}
                  onChange={(e) => setCustomTargetAmount(Number(e.target.value))}
                  className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 text-base font-black font-mono text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />

                <div className="space-y-1 pt-1">
                  <span className="text-[11px] font-bold text-neutral-500">Raccourcis basés sur vos dépenses :</span>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setCustomTargetAmount(Math.round(estimatedMonthlyExpense * 3))}
                      className="p-2 rounded-xl bg-neutral-100 dark:bg-zinc-800 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950 text-[11px] font-bold text-center transition-colors"
                    >
                      3 Mois<br />({Math.round(estimatedMonthlyExpense * 3 / 1000)}k MAD)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomTargetAmount(Math.round(estimatedMonthlyExpense * 6))}
                      className="p-2 rounded-xl bg-neutral-100 dark:bg-zinc-800 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950 text-[11px] font-bold text-center transition-colors"
                    >
                      6 Mois<br />({Math.round(estimatedMonthlyExpense * 6 / 1000)}k MAD)
                    </button>
                    <button
                      type="button"
                      onClick={() => setCustomTargetAmount(Math.round(estimatedMonthlyExpense * 12))}
                      className="p-2 rounded-xl bg-neutral-100 dark:bg-zinc-800 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950 text-[11px] font-bold text-center transition-colors"
                    >
                      12 Mois<br />({Math.round(estimatedMonthlyExpense * 12 / 1000)}k MAD)
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEditTargetModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 text-neutral-700 dark:bg-zinc-800 dark:text-neutral-300 text-xs font-bold"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSaveTargetAmount}
                  className="px-5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-black shadow-xs hover:bg-emerald-500"
                >
                  Enregistrer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TRANSFER CONFIRMATION ALERT DIALOG */}
      <AnimatePresence>
        {showConfirmModal && selectedAccount && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" role="dialog" aria-modal="true" aria-labelledby="alert-dialog-title">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white dark:bg-zinc-900 border-2 border-emerald-500/40 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-5 relative overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                    <ArrowRightLeft className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 id="alert-dialog-title" className="text-base font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
                      Confirmation de Transfert de Fonds
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Veuillez vérifier et valider la transaction vers votre réserve d'urgence.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="p-1.5 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-xl transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Transfer Details Card */}
              <div className="bg-neutral-50 dark:bg-zinc-950/80 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 space-y-3">
                {/* Amount Highlight */}
                <div className="text-center bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-800 dark:text-emerald-300 block">
                    Montant du virement
                  </span>
                  <span className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    +{transferAmount.toLocaleString("fr-FR")} MAD
                  </span>
                </div>

                {/* Source & Destination Breakdown */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-1">
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1">
                      <Wallet className="w-3 h-3 text-neutral-500" />
                      Compte Débité
                    </div>
                    <div className="font-extrabold text-neutral-900 dark:text-neutral-100 truncate">
                      {selectedAccount.name}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500">
                      Nouveau solde : <strong className="text-neutral-800 dark:text-neutral-200">{Math.max(0, selectedAccount.balance - transferAmount).toLocaleString("fr-FR")} MAD</strong>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-zinc-900 p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-1">
                    <div className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                      <PiggyBank className="w-3 h-3 text-emerald-500" />
                      Destination
                    </div>
                    <div className="font-extrabold text-neutral-900 dark:text-neutral-100 truncate">
                      {emergencyFundGoal.name}
                    </div>
                    <div className="text-[11px] font-mono text-neutral-500">
                      Nouveau total : <strong className="text-emerald-600 dark:text-emerald-400">{(emergencyFundGoal.currentAmount + transferAmount).toLocaleString("fr-FR")} MAD</strong>
                    </div>
                  </div>
                </div>

                {/* Impact Info */}
                <div className="flex items-center gap-2 text-[11px] text-neutral-600 dark:text-neutral-300 bg-white/60 dark:bg-zinc-900/60 p-2.5 rounded-xl border border-neutral-200/60 dark:border-neutral-800">
                  <Sparkles className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    La couverture financière passera à <strong>~{((emergencyFundGoal.currentAmount + transferAmount) / (estimatedMonthlyExpense || 12000)).toFixed(1)} mois</strong> de dépenses.
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowConfirmModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-neutral-100 dark:bg-zinc-800 hover:bg-neutral-200 dark:hover:bg-zinc-700 text-neutral-700 dark:text-neutral-300 text-xs font-bold transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleExecuteTransfer}
                  disabled={isTransferring}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmer le transfert</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
