import React, { useState, useEffect, useMemo } from "react";
import { WeeklyObjective, FinanceTransaction, JournalEntry } from "../types";
import { 
  Inbox, 
  Plus, 
  Check, 
  Trash2, 
  ArrowRight, 
  Coins, 
  Calendar, 
  BookOpen, 
  Zap,
  Tag,
  Briefcase,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface QuickCaptureInboxProps {
  onAddWeeklyObjective: (text: string, isPriority?: boolean) => void;
  onAddTransaction: (transaction: Omit<FinanceTransaction, "id">) => void;
  onAddJournalEntry: (title: string, content: string, mood: "Excellent" | "Bon" | "Neutre" | "Fatigué" | "Stressé") => void;
  onShowToast: (message: string, type: "success" | "error" | "info") => void;
}

interface CapturedItem {
  id: string;
  text: string;
  createdAt: string;
}

export default function QuickCaptureInbox({
  onAddWeeklyObjective,
  onAddTransaction,
  onAddJournalEntry,
  onShowToast
}: QuickCaptureInboxProps) {
  const [inboxItems, setInboxItems] = useState<CapturedItem[]>(() => {
    try {
      const saved = localStorage.getItem("la_quick_capture_inbox");
      return saved ? JSON.parse(saved) : [
        { id: "cap_1", text: "Suivi recrutement : Envoyer CV actualisé au cabinet à Casablanca", createdAt: new Date(Date.now() - 3600000 * 2).toISOString() },
        { id: "cap_2", text: "Payer l'hébergement serveur pro - 250 DH", createdAt: new Date(Date.now() - 3600000 * 5).toISOString() },
        { id: "cap_3", text: "Idée vidéo BVC : Analyse de la dynamique boursière sur Attijariwafa", createdAt: new Date(Date.now() - 3600000 * 24).toISOString() }
      ];
    } catch (e) {
      return [];
    }
  });

  const [inputText, setInputText] = useState("");

  useEffect(() => {
    localStorage.setItem("la_quick_capture_inbox", JSON.stringify(inboxItems));
  }, [inboxItems]);

  const handleCapture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newItem: CapturedItem = {
      id: "cap_" + Date.now(),
      text: inputText.trim(),
      createdAt: new Date().toISOString()
    };

    setInboxItems(prev => [newItem, ...prev]);
    setInputText("");
    onShowToast("Idée capturée avec succès dans votre Inbox !", "success");
  };

  const handleDelete = (id: string) => {
    setInboxItems(prev => prev.filter(item => item.id !== id));
  };

  // Helper to intelligently detect category tag based on text analysis
  const detectSmartTag = (text: string) => {
    const lower = text.toLowerCase();
    
    // 1. Finance
    if (
      lower.includes("dh") || 
      lower.includes("mad") || 
      lower.includes("dirham") || 
      lower.includes("payer") || 
      lower.includes("achat") || 
      lower.includes("dépense") || 
      lower.includes("investir") || 
      lower.includes("bourse") || 
      lower.includes("bvc") ||
      lower.includes("compte") ||
      lower.includes("argent")
    ) {
      return { label: "Finance / Budget", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20", icon: Coins };
    }

    // 2. Job / Career
    if (
      lower.includes("cv") || 
      lower.includes("recruteur") || 
      lower.includes("entretien") || 
      lower.includes("cabinet") || 
      lower.includes("job") || 
      lower.includes("candidature") || 
      lower.includes("pro") || 
      lower.includes("boulot") || 
      lower.includes("compétence") ||
      lower.includes("formation")
    ) {
      return { label: "Job & Carrière", color: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20", icon: Briefcase };
    }

    // 3. Media / Creation
    if (
      lower.includes("vidéo") || 
      lower.includes("youtube") || 
      lower.includes("tiktok") || 
      lower.includes("podcast") || 
      lower.includes("script") || 
      lower.includes("idée") || 
      lower.includes("contenu") || 
      lower.includes("linkedin") || 
      lower.includes("article")
    ) {
      return { label: "Créations / Médias", color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20", icon: Zap };
    }

    // 4. Default / Tasks
    return { label: "Tâche / Idée", color: "bg-neutral-100 text-neutral-600 dark:bg-zinc-800 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700", icon: Inbox };
  };

  // Helper to extract first numbers found in text as a potential amount
  const extractAmount = (text: string): number => {
    const match = text.match(/\b\d+(?:[.,]\d+)?\b/);
    if (match) {
      // replace comma with dot for decimals
      const parsed = parseFloat(match[0].replace(",", "."));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Dispatch captured item into a real task
  const convertToTask = (item: CapturedItem, isPriority = false) => {
    onAddWeeklyObjective(item.text, isPriority);
    handleDelete(item.id);
    onShowToast(`Converti avec succès en Objectif ${isPriority ? "Prioritaire" : "Standard"} !`, "success");
  };

  // Dispatch captured item into a transaction
  const convertToTransaction = (item: CapturedItem) => {
    const amount = extractAmount(item.text);
    const isRevenue = item.text.toLowerCase().includes("reçu") || item.text.toLowerCase().includes("gagné") || item.text.toLowerCase().includes("salaire");
    
    // Basic pre-fills
    onAddTransaction({
      date: new Date().toISOString().split("T")[0],
      description: item.text,
      category: isRevenue ? "Revenus Pro" : "Autres",
      type: isRevenue ? "Revenue" : "Dépense",
      amount: amount > 0 ? amount : 100, // Fallback default
      account: "Principal"
    });

    handleDelete(item.id);
    onShowToast(`Converti en Transaction financière (${amount > 0 ? amount + " MAD" : "à configurer"}) !`, "success");
  };

  // Dispatch captured item to today's journal note
  const convertToJournal = (item: CapturedItem) => {
    onAddJournalEntry(
      `Idée Capturée du ${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long" })}`,
      `Cette note a été capturée rapidement via mon Quick Capture Second Brain :\n\n"${item.text}"`,
      "Neutre"
    );
    handleDelete(item.id);
    onShowToast("Transféré dans votre Journal de Bord quotidien !", "success");
  };

  return (
    <div id="quick-capture-inbox-section" className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 shadow-2xs hover:shadow-xs transition-all duration-300">
      
      {/* HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800/80 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-neutral-900 text-white dark:bg-zinc-800 dark:text-neutral-50 rounded-2xl">
            <Inbox className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-50 uppercase tracking-wider font-display">
              Quick Capture & Inbox
            </h3>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">
              Capturez vos pensées et dispatchez-les en un clic
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-zinc-850 px-2.5 py-1 rounded-xl text-[10px] font-black font-mono text-neutral-500 dark:text-neutral-400 uppercase">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-500"></span>
          </span>
          <span>{inboxItems.length} En attente</span>
        </div>
      </div>

      {/* TEXT INPUT ENGINE */}
      <form onSubmit={handleCapture} className="relative flex items-center mb-6">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Un flash d'esprit ? Notez-le ici (ex: Payer 120 DH abonnement, Idée vidéo, Tâche pro...)"
          className="w-full bg-neutral-50 dark:bg-zinc-950 border border-neutral-200/80 dark:border-neutral-800/80 hover:border-neutral-300 dark:hover:border-neutral-700/80 rounded-2xl px-4 py-3.5 pr-12 text-xs font-medium text-neutral-800 dark:text-neutral-200 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 dark:focus:border-neutral-400 transition-all font-sans"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className={`absolute right-2 p-2 rounded-xl text-white font-bold transition-all ${
            inputText.trim() 
              ? "bg-neutral-900 hover:bg-neutral-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 cursor-pointer" 
              : "bg-neutral-200 dark:bg-zinc-800/40 text-neutral-400 dark:text-neutral-600 cursor-not-allowed"
          }`}
          title="Capturer immédiatement"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
        </button>
      </form>

      {/* CAPTURED ITEMS LIST */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {inboxItems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 text-center flex flex-col items-center justify-center space-y-2.5 bg-neutral-50/50 dark:bg-zinc-950/20 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl"
            >
              <div className="p-3 bg-neutral-100 dark:bg-zinc-900 text-neutral-400 rounded-full">
                <Check className="w-5 h-5 text-neutral-500" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs text-neutral-800 dark:text-neutral-200 font-bold uppercase tracking-wider">Votre Inbox est vide !</p>
                <p className="text-[10px] text-neutral-400 font-medium">Tout est trié, propre et organisé dans votre Second Brain.</p>
              </div>
            </motion.div>
          ) : (
            inboxItems.map(item => {
              const tag = detectSmartTag(item.text);
              const TagIcon = tag.icon;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-neutral-50/70 dark:bg-zinc-950/40 border border-neutral-100 dark:border-neutral-800/60 hover:border-neutral-200 dark:hover:border-neutral-700 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-bold border ${tag.color} font-mono uppercase tracking-wide`}>
                        <TagIcon className="w-2.5 h-2.5" />
                        {tag.label}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-neutral-400 uppercase">
                        {new Date(item.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-800 dark:text-neutral-200 font-semibold leading-relaxed break-words font-sans">
                      {item.text}
                    </p>
                  </div>

                  {/* DISPATCH ACTION PILLS */}
                  <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                    
                    {/* Convert to Task */}
                    <button
                      onClick={() => convertToTask(item, false)}
                      className="p-2 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-xl text-neutral-500 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 group/btn"
                      title="Convertir en Objectif Hebdomadaire"
                    >
                      <Check className="w-3.5 h-3.5 text-neutral-400 group-hover/btn:text-neutral-700 dark:group-hover/btn:text-neutral-300" />
                      <span className="text-[10px] font-mono font-bold uppercase hidden md:inline">Objectif</span>
                    </button>

                    {/* Convert to Transaction */}
                    <button
                      onClick={() => convertToTransaction(item)}
                      className="p-2 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 hover:border-emerald-400 hover:text-emerald-600 rounded-xl text-neutral-500 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 group/btn"
                      title="Convertir en Transaction Financière"
                    >
                      <Coins className="w-3.5 h-3.5 text-neutral-400 group-hover/btn:text-emerald-500" />
                      <span className="text-[10px] font-mono font-bold uppercase hidden md:inline text-neutral-500 group-hover/btn:text-emerald-600">Finances</span>
                    </button>

                    {/* Convert to Journal */}
                    <button
                      onClick={() => convertToJournal(item)}
                      className="p-2 bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-400 hover:text-indigo-600 rounded-xl text-neutral-500 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 group/btn"
                      title="Déplacer vers Journal de Bord"
                    >
                      <BookOpen className="w-3.5 h-3.5 text-neutral-400 group-hover/btn:text-indigo-500" />
                      <span className="text-[10px] font-mono font-bold uppercase hidden md:inline text-neutral-500 group-hover/btn:text-indigo-600">Note</span>
                    </button>

                    <div className="w-px h-5 bg-neutral-200 dark:bg-neutral-800 mx-1" />

                    {/* Delete Item */}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/20 text-neutral-400 hover:text-rose-600 rounded-xl transition-all cursor-pointer"
                      title="Supprimer définitivement"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* SECOND BRAIN EDUCATION TRIVIA FOOTER */}
      <div className="mt-5 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center gap-2 text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold font-sans">
        <AlertCircle className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-600 shrink-0" />
        <span>Astuce : Ne surchargez pas votre esprit. Notez instantanément et classez vos projets au moment propice.</span>
      </div>

    </div>
  );
}
