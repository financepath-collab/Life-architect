import React, { useState, useMemo } from "react";
import { 
  Landmark, 
  Building2, 
  Banknote, 
  Coins, 
  Wallet, 
  Plus, 
  Edit3, 
  CreditCard,
  Percent,
  History,
  ChevronDown,
  ChevronUp,
  Receipt
} from "lucide-react";
import { Account, FinanceTransaction } from "../types";

interface BankClassificationSectionProps {
  accounts: Account[];
  transactions?: FinanceTransaction[];
  onAddAccount?: () => void;
  onEditAccount?: (account: Account) => void;
}

export type BankGroupKey = 
  | "attijari" 
  | "banque_populaire" 
  | "cih" 
  | "bmce" 
  | "sgmb" 
  | "cam" 
  | "cash" 
  | "crypto" 
  | "other";

export interface BankGroupConfig {
  key: BankGroupKey;
  bankName: string;
  badgeCode: string;
  tagline: string;
  icon: React.ComponentType<{ className?: string }>;
  headerGradient: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  iconColor: string;
  textColor: string;
  accentColor: string;
  barBg: string;
  ringColor: string;
}

export const BANK_CONFIGS: Record<BankGroupKey, BankGroupConfig> = {
  attijari: {
    key: "attijari",
    bankName: "Attijariwafa Bank",
    badgeCode: "ATW",
    tagline: "Banque Principale • Salaires & Flux Courants",
    icon: Landmark,
    headerGradient: "bg-gradient-to-br from-amber-500/15 via-amber-500/5 to-transparent dark:from-amber-950/40 dark:via-zinc-900 dark:to-zinc-900",
    borderColor: "border-amber-200/90 dark:border-amber-800/60",
    badgeBg: "bg-amber-500 text-white font-black shadow-2xs",
    badgeText: "text-amber-950 dark:text-amber-200",
    iconBg: "bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300",
    iconColor: "text-amber-600 dark:text-amber-400",
    textColor: "text-amber-950 dark:text-amber-100",
    accentColor: "text-amber-600 dark:text-amber-400",
    barBg: "bg-amber-500",
    ringColor: "ring-amber-400/40"
  },
  banque_populaire: {
    key: "banque_populaire",
    bankName: "Banque Populaire (BP)",
    badgeCode: "BP",
    tagline: "Épargne de Précaution & Titres Bourse (BVC)",
    icon: Building2,
    headerGradient: "bg-gradient-to-br from-orange-500/15 via-orange-500/5 to-transparent dark:from-orange-950/40 dark:via-zinc-900 dark:to-zinc-900",
    borderColor: "border-orange-200/90 dark:border-orange-800/60",
    badgeBg: "bg-orange-500 text-white font-black shadow-2xs",
    badgeText: "text-orange-950 dark:text-orange-200",
    iconBg: "bg-orange-100 dark:bg-orange-900/60 text-orange-700 dark:text-orange-300",
    iconColor: "text-orange-600 dark:text-orange-400",
    textColor: "text-orange-950 dark:text-orange-100",
    accentColor: "text-orange-600 dark:text-orange-400",
    barBg: "bg-orange-500",
    ringColor: "ring-orange-400/40"
  },
  cih: {
    key: "cih",
    bankName: "CIH Bank",
    badgeCode: "CIH",
    tagline: "Banque Digitale & Services Retail",
    icon: CreditCard,
    headerGradient: "bg-gradient-to-br from-teal-500/15 via-teal-500/5 to-transparent dark:from-teal-950/40 dark:via-zinc-900 dark:to-zinc-900",
    borderColor: "border-teal-200/90 dark:border-teal-800/60",
    badgeBg: "bg-teal-600 text-white font-black shadow-2xs",
    badgeText: "text-teal-950 dark:text-teal-200",
    iconBg: "bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300",
    iconColor: "text-teal-600 dark:text-teal-400",
    textColor: "text-teal-950 dark:text-teal-100",
    accentColor: "text-teal-600 dark:text-teal-400",
    barBg: "bg-teal-500",
    ringColor: "ring-teal-400/40"
  },
  bmce: {
    key: "bmce",
    bankName: "Bank of Africa (BMCE)",
    badgeCode: "BOA",
    tagline: "Banque Corporate & International",
    icon: Landmark,
    headerGradient: "bg-gradient-to-br from-blue-500/15 via-blue-500/5 to-transparent dark:from-blue-950/40 dark:via-zinc-900 dark:to-zinc-900",
    borderColor: "border-blue-200/90 dark:border-blue-800/60",
    badgeBg: "bg-blue-600 text-white font-black shadow-2xs",
    badgeText: "text-blue-950 dark:text-blue-200",
    iconBg: "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300",
    iconColor: "text-blue-600 dark:text-blue-400",
    textColor: "text-blue-950 dark:text-blue-100",
    accentColor: "text-blue-600 dark:text-blue-400",
    barBg: "bg-blue-500",
    ringColor: "ring-blue-400/40"
  },
  sgmb: {
    key: "sgmb",
    bankName: "Société Générale Maroc",
    badgeCode: "SG",
    tagline: "Services Financiers & Gestion Privée",
    icon: Building2,
    headerGradient: "bg-gradient-to-br from-rose-500/15 via-rose-500/5 to-transparent dark:from-rose-950/40 dark:via-zinc-900 dark:to-zinc-900",
    borderColor: "border-rose-200/90 dark:border-rose-800/60",
    badgeBg: "bg-rose-600 text-white font-black shadow-2xs",
    badgeText: "text-rose-950 dark:text-rose-200",
    iconBg: "bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300",
    iconColor: "text-rose-600 dark:text-rose-400",
    textColor: "text-rose-950 dark:text-rose-100",
    accentColor: "text-rose-600 dark:text-rose-400",
    barBg: "bg-rose-500",
    ringColor: "ring-rose-400/40"
  },
  cam: {
    key: "cam",
    bankName: "Crédit Agricole du Maroc",
    badgeCode: "CAM",
    tagline: "Financement Spécialisé & Particuliers",
    icon: Landmark,
    headerGradient: "bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent dark:from-emerald-950/40 dark:via-zinc-900 dark:to-zinc-900",
    borderColor: "border-emerald-200/90 dark:border-emerald-800/60",
    badgeBg: "bg-emerald-600 text-white font-black shadow-2xs",
    badgeText: "text-emerald-950 dark:text-emerald-200",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    textColor: "text-emerald-950 dark:text-emerald-100",
    accentColor: "text-emerald-600 dark:text-emerald-400",
    barBg: "bg-emerald-500",
    ringColor: "ring-emerald-400/40"
  },
  cash: {
    key: "cash",
    bankName: "Espèces & Liquidités Physiques",
    badgeCode: "CASH",
    tagline: "Réserve Physique, Coffre & Billets",
    icon: Banknote,
    headerGradient: "bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent dark:from-emerald-950/40 dark:via-zinc-900 dark:to-zinc-900",
    borderColor: "border-emerald-200/90 dark:border-emerald-800/60",
    badgeBg: "bg-emerald-600 text-white font-black shadow-2xs",
    badgeText: "text-emerald-950 dark:text-emerald-200",
    iconBg: "bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    textColor: "text-emerald-950 dark:text-emerald-100",
    accentColor: "text-emerald-600 dark:text-emerald-400",
    barBg: "bg-emerald-500",
    ringColor: "ring-emerald-400/40"
  },
  crypto: {
    key: "crypto",
    bankName: "Actifs Numériques & Crypto",
    badgeCode: "CRYPTO",
    tagline: "Portefeuilles Numériques & Web3",
    icon: Coins,
    headerGradient: "bg-gradient-to-br from-purple-500/15 via-purple-500/5 to-transparent dark:from-purple-950/40 dark:via-zinc-900 dark:to-zinc-900",
    borderColor: "border-purple-200/90 dark:border-purple-800/60",
    badgeBg: "bg-purple-600 text-white font-black shadow-2xs",
    badgeText: "text-purple-950 dark:text-purple-200",
    iconBg: "bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300",
    iconColor: "text-purple-600 dark:text-purple-400",
    textColor: "text-purple-950 dark:text-purple-100",
    accentColor: "text-purple-600 dark:text-purple-400",
    barBg: "bg-purple-500",
    ringColor: "ring-purple-400/40"
  },
  other: {
    key: "other",
    bankName: "Autres Établissements Bancaires",
    badgeCode: "BANK",
    tagline: "Autres comptes & Réseaux secondaires",
    icon: Wallet,
    headerGradient: "bg-gradient-to-br from-slate-500/15 via-slate-500/5 to-transparent dark:from-slate-950/40 dark:via-zinc-900 dark:to-zinc-900",
    borderColor: "border-slate-200/90 dark:border-slate-800/60",
    badgeBg: "bg-slate-700 text-white font-black shadow-2xs",
    badgeText: "text-slate-950 dark:text-slate-200",
    iconBg: "bg-slate-100 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300",
    iconColor: "text-slate-600 dark:text-slate-400",
    textColor: "text-slate-950 dark:text-slate-100",
    accentColor: "text-slate-600 dark:text-slate-400",
    barBg: "bg-slate-600",
    ringColor: "ring-slate-400/40"
  }
};

export function detectBankGroup(account: Account): BankGroupKey {
  const name = (account.name || "").toLowerCase();
  const usage = (account.usage || "").toLowerCase();
  const type = (account.type || "").toLowerCase();

  if (type === "crypto" || name.includes("crypto") || name.includes("binance") || name.includes("bitcoin")) {
    return "crypto";
  }
  if (type === "espèces" || type === "especes" || name.includes("espèces") || name.includes("especes") || name.includes("coffre") || name.includes("cash")) {
    return "cash";
  }
  if (name.includes("attijari") || name.includes("atw") || usage.includes("attijari") || name.includes("attijariwafa")) {
    return "attijari";
  }
  if (name.includes("populaire") || name.includes("bp") || usage.includes("populaire") || name.includes("carnet") || name.includes("chèque") || name.includes("cheque")) {
    return "banque_populaire";
  }
  if (name.includes("cih") || usage.includes("cih")) {
    return "cih";
  }
  if (name.includes("bmce") || name.includes("africa") || name.includes("boa")) {
    return "bmce";
  }
  if (name.includes("société générale") || name.includes("societe generale") || name.includes("sgmb") || name.includes("sg")) {
    return "sgmb";
  }
  if (name.includes("crédit agricole") || name.includes("credit agricole") || name.includes("cam")) {
    return "cam";
  }

  return "other";
}

export default function BankClassificationSection({
  accounts = [],
  transactions = [],
  onAddAccount,
  onEditAccount
}: BankClassificationSectionProps) {
  const [selectedBankFilter, setSelectedBankFilter] = useState<BankGroupKey | "all">("all");
  const [expandedHistory, setExpandedHistory] = useState<Record<string, boolean>>({});

  const toggleHistory = (bankKey: string) => {
    setExpandedHistory(prev => ({
      ...prev,
      [bankKey]: !prev[bankKey]
    }));
  };

  // Group accounts by bank
  const { groupedBanks, totalLiquidity, dominantBank } = useMemo(() => {
    const map = new Map<BankGroupKey, { config: BankGroupConfig; accounts: Account[]; totalBalance: number }>();

    let total = 0;

    accounts.forEach(acc => {
      const bankKey = detectBankGroup(acc);
      const config = BANK_CONFIGS[bankKey];
      const bal = acc.balance || 0;
      total += bal;

      if (!map.has(bankKey)) {
        map.set(bankKey, { config, accounts: [], totalBalance: 0 });
      }
      const existing = map.get(bankKey)!;
      existing.accounts.push(acc);
      existing.totalBalance += bal;
    });

    const list = Array.from(map.values()).map(item => ({
      ...item,
      percentage: total > 0 ? (item.totalBalance / total) * 100 : 0
    }));

    // Sort banks by total balance descending
    list.sort((a, b) => b.totalBalance - a.totalBalance);

    const dominant = list.length > 0 ? list[0] : null;

    return {
      groupedBanks: list,
      totalLiquidity: total,
      dominantBank: dominant
    };
  }, [accounts]);

  const filteredBanks = useMemo(() => {
    if (selectedBankFilter === "all") return groupedBanks;
    return groupedBanks.filter(b => b.config.key === selectedBankFilter);
  }, [groupedBanks, selectedBankFilter]);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-neutral-200/90 dark:border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800/80 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="p-2 bg-indigo-50 dark:bg-indigo-950/80 border border-indigo-200 dark:border-indigo-800/60 text-indigo-700 dark:text-indigo-300 rounded-2xl shrink-0">
              <Landmark className="w-5 h-5" />
            </span>
            <h2 className="text-base sm:text-lg font-black text-neutral-900 dark:text-neutral-100 tracking-tight flex items-center gap-2">
              <span>Classification des Soldes par Établissement Bancaire</span>
            </h2>
            <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-200 text-[10px] font-black uppercase tracking-wider rounded-lg border border-indigo-200 dark:border-indigo-800">
              {groupedBanks.length} Établissement{groupedBanks.length > 1 ? "s" : ""}
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium pl-0.5">
            Répartition visuelle de vos liquidités par banque (Attijariwafa Bank, Banque Populaire, etc.) avec icônes distinctives & attribution opérationnelle.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap shrink-0">
          <div className="bg-neutral-50 dark:bg-zinc-800/80 border border-neutral-200/80 dark:border-neutral-700/80 px-4 py-2 rounded-2xl flex items-center gap-3">
            <div className="text-right font-mono">
              <span className="text-[10px] font-bold text-neutral-400 uppercase block">Total Liquidités</span>
              <span className="text-sm sm:text-base font-black text-neutral-950 dark:text-neutral-100">
                {totalLiquidity.toLocaleString("fr-FR")} MAD
              </span>
            </div>
          </div>

          {onAddAccount && (
            <button
              onClick={onAddAccount}
              className="flex items-center gap-1.5 bg-neutral-950 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-950 text-white px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Compte</span>
            </button>
          )}
        </div>
      </div>

      {/* Global Liquidity Distribution Multi-Bar */}
      {groupedBanks.length > 0 && (
        <div className="bg-neutral-50/80 dark:bg-zinc-800/40 border border-neutral-200/70 dark:border-neutral-800 p-4 rounded-2xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400">
            <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Répartition globale des fonds par Banque :</span>
            </span>
            {dominantBank && (
              <span className="text-[11px] text-neutral-500 font-mono">
                Banque Dominante : <strong className="text-indigo-600 dark:text-indigo-400">{dominantBank.config.bankName}</strong> ({dominantBank.percentage.toFixed(1)}%)
              </span>
            )}
          </div>

          {/* Multi-Segmented Progress Bar */}
          <div className="h-3.5 w-full bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden flex shadow-inner">
            {groupedBanks.map((item) => (
              <div
                key={item.config.key}
                style={{ width: `${Math.max(item.percentage, 1)}%` }}
                className={`h-full ${item.config.barBg} transition-all duration-500 relative group cursor-pointer`}
                title={`${item.config.bankName}: ${item.totalBalance.toLocaleString("fr-FR")} MAD (${item.percentage.toFixed(1)}%)`}
              >
                <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-neutral-950 text-white text-[10px] font-mono font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap z-20 pointer-events-none transition-opacity">
                  {item.config.badgeCode} : {item.totalBalance.toLocaleString("fr-FR")} MAD ({item.percentage.toFixed(1)}%)
                </div>
              </div>
            ))}
          </div>

          {/* Bank Badges Filter Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <button
              onClick={() => setSelectedBankFilter("all")}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none ${
                selectedBankFilter === "all"
                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-white dark:text-neutral-950 dark:border-white shadow-2xs"
                  : "bg-white dark:bg-zinc-800 text-neutral-700 dark:text-neutral-300 border-neutral-200/80 dark:border-neutral-700 hover:bg-neutral-100"
              }`}
            >
              Toutes ({accounts.length})
            </button>

            {groupedBanks.map((item) => {
              const isSelected = selectedBankFilter === item.config.key;
              return (
                <button
                  key={item.config.key}
                  onClick={() => setSelectedBankFilter(item.config.key)}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none ${
                    isSelected
                      ? `${item.config.badgeBg} border-transparent shadow-2xs`
                      : `bg-white dark:bg-zinc-800 ${item.config.textColor} border-neutral-200/80 dark:border-neutral-700 hover:border-neutral-300`
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${item.config.barBg}`} />
                  <span>{item.config.badgeCode}</span>
                  <span className="font-mono text-[10px] opacity-80">({item.percentage.toFixed(0)}%)</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Grid of Bank Classification Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {filteredBanks.map((item) => {
          const { config, accounts: bankAccounts, totalBalance, percentage } = item;
          const IconComponent = config.icon;
          const isHistoryExpanded = !!expandedHistory[config.key];

          // Filter up to 5 most recent transactions for this specific bank
          const bankTxs = transactions.filter(tx => {
            if (!tx.account) return false;
            const txAccLower = tx.account.toLowerCase().trim();

            const matchesAccount = bankAccounts.some(
              acc => acc.id === tx.account || acc.name.toLowerCase().trim() === txAccLower || txAccLower.includes(acc.name.toLowerCase().trim())
            );
            if (matchesAccount) return true;

            const mockAcc: Account = { id: "", name: tx.account, type: "Bancaire", balance: 0, currency: "MAD" };
            return detectBankGroup(mockAcc) === config.key;
          })
          .sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
          .slice(0, 5);

          return (
            <div
              key={config.key}
              className={`border rounded-2xl p-5 space-y-4 shadow-3xs transition-all relative overflow-hidden ${config.borderColor} ${config.headerGradient}`}
            >
              {/* Top Bank Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200/60 dark:border-neutral-800/60 pb-3.5">
                <div className="flex items-center gap-3">
                  {/* Distinctive Bank Logo Badge */}
                  <div className={`p-2.5 rounded-2xl shrink-0 flex items-center justify-center font-black font-mono tracking-tight text-xs shadow-2xs ring-2 ${config.ringColor} ${config.badgeBg}`}>
                    {config.badgeCode}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
                        {config.bankName}
                      </h3>
                      <span className={`text-[10px] font-extrabold font-mono px-2 py-0.5 rounded-md ${config.iconBg}`}>
                        {bankAccounts.length} compte{bankAccounts.length > 1 ? "s" : ""}
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-medium leading-snug mt-0.5">
                      {config.tagline}
                    </p>
                  </div>
                </div>

                {/* Bank Total Balance Header */}
                <div className="text-left sm:text-right font-mono shrink-0">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase block">Solde Total Banque</span>
                  <span className={`text-base font-black ${config.textColor}`}>
                    {totalBalance.toLocaleString("fr-FR")} MAD
                  </span>
                  <span className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 block">
                    {percentage.toFixed(1)}% des liquidités
                  </span>
                </div>
              </div>

              {/* Progress Bar per Bank */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-neutral-500 font-medium">
                  <span>Part du portefeuille cash :</span>
                  <span className="font-mono font-bold text-neutral-700 dark:text-neutral-300">{percentage.toFixed(1)}%</span>
                </div>
                <div className="h-1.5 w-full bg-neutral-200/80 dark:bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                    className={`h-full ${config.barBg} transition-all duration-500`}
                  />
                </div>
              </div>

              {/* Sub-accounts List under this Bank */}
              <div className="space-y-2.5 pt-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 block font-mono">
                  Comptes rattachés ({bankAccounts.length}) :
                </span>

                <div className="space-y-2">
                  {bankAccounts.map((acc) => {
                    const accShare = totalBalance > 0 ? ((acc.balance || 0) / totalBalance) * 100 : 0;

                    return (
                      <div
                        key={acc.id}
                        className="bg-white/90 dark:bg-zinc-900/90 border border-neutral-200/80 dark:border-neutral-800 p-3 rounded-xl flex items-center justify-between gap-3 text-xs hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-3xs group"
                      >
                        <div className="space-y-1 min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-neutral-900 dark:text-neutral-100 truncate block">
                              {acc.name}
                            </span>
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300 shrink-0">
                              {acc.type || "Bancaire"}
                            </span>
                          </div>
                          {acc.usage && (
                            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 line-clamp-1 leading-tight font-medium">
                              🎯 {acc.usage}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right font-mono">
                            <span className="font-black text-neutral-900 dark:text-neutral-100 block">
                              {(acc.balance || 0).toLocaleString("fr-FR")} {acc.currency || "MAD"}
                            </span>
                            <span className="text-[9px] font-semibold text-neutral-400 block">
                              {accShare.toFixed(0)}% du solde banque
                            </span>
                          </div>

                          {onEditAccount && (
                            <button
                              onClick={() => onEditAccount(acc)}
                              className="p-1.5 text-neutral-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 rounded-lg transition-all opacity-80 group-hover:opacity-100 cursor-pointer"
                              title="Modifier ce compte"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recent Transactions Dropdown Section */}
              <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-800 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => toggleHistory(config.key)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer bg-white/90 dark:bg-zinc-800/90 hover:bg-white dark:hover:bg-zinc-800 text-neutral-800 dark:text-neutral-200 border-neutral-200/80 dark:border-neutral-700 shadow-2xs group"
                  >
                    <History className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 group-hover:rotate-[-20deg] transition-transform" />
                    <span>Historique récent</span>
                    <span className="px-1.5 py-0.2 bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-mono text-[10px] font-black rounded-md">
                      {bankTxs.length}
                    </span>
                    {isHistoryExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5 text-neutral-400" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                    )}
                  </button>

                  <span className="text-[10px] text-neutral-500 font-medium font-mono">
                    {bankTxs.length > 0 ? "5 derniers mouvements" : "Aucune transaction"}
                  </span>
                </div>

                {/* Collapsible Dropdown List */}
                {isHistoryExpanded && (
                  <div className="bg-white/95 dark:bg-zinc-950/90 border border-neutral-200/90 dark:border-neutral-800/90 rounded-2xl p-3 space-y-2 shadow-inner transition-all animate-fadeIn">
                    <div className="flex items-center justify-between pb-1.5 border-b border-neutral-100 dark:border-neutral-800/80">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 font-mono flex items-center gap-1">
                        <Receipt className="w-3 h-3 text-indigo-500" />
                        Dernières transactions • {config.bankName}
                      </span>
                      <span className="text-[10px] font-bold font-mono text-neutral-400">
                        Max 5 opérations
                      </span>
                    </div>

                    {bankTxs.length > 0 ? (
                      <div className="space-y-1.5">
                        {bankTxs.map((tx) => {
                          const isRevenue = tx.type === "Revenue" || tx.type === "Revenu";
                          return (
                            <div
                              key={tx.id}
                              className="p-2.5 rounded-xl bg-neutral-50/80 dark:bg-zinc-900/80 border border-neutral-200/60 dark:border-neutral-800/80 flex items-center justify-between gap-2.5 text-xs hover:bg-neutral-100/80 dark:hover:bg-zinc-800/60 transition-colors"
                            >
                              <div className="space-y-0.5 min-w-0 flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="font-bold text-neutral-900 dark:text-neutral-100 truncate block">
                                    {tx.description}
                                  </span>
                                  <span className="text-[9px] font-semibold px-1.5 py-0.2 rounded bg-neutral-200/80 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-300">
                                    {tx.category || "Général"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-neutral-400 font-medium">
                                  <span>📅 {tx.date}</span>
                                  {tx.account && (
                                    <span>• 💳 {tx.account}</span>
                                  )}
                                </div>
                              </div>

                              <div className="text-right font-mono shrink-0 pl-2">
                                <span className={`font-black text-xs block ${isRevenue ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                                  {isRevenue ? "+" : "-"}{Math.abs(tx.amount || 0).toLocaleString("fr-FR")} MAD
                                </span>
                                {tx.status && (
                                  <span className="text-[9px] text-neutral-400 block font-sans">
                                    {tx.status}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-[11px] text-neutral-400 italic">
                        Aucune transaction récente répertoriée pour cet établissement.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredBanks.length === 0 && (
        <div className="text-center py-10 text-neutral-400 italic text-xs bg-neutral-50 dark:bg-zinc-800/40 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
          Aucun compte bancaire enregistré pour cet établissement.
        </div>
      )}
    </div>
  );
}
