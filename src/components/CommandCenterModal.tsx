import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  Sparkles, 
  Flame, 
  Coins, 
  CheckSquare, 
  FolderKanban, 
  BookOpen, 
  ArrowRight, 
  Tv, 
  Dumbbell, 
  Target,
  FileText,
  Clock,
  Save,
  Moon,
  Sun,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CommandCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  setActiveMenu: (menuId: string) => void;
  categories: Array<{
    id: string;
    label: string;
    icon: any;
    items: Array<{ id: string; label: string; icon: any; desc: string }>;
  }>;
  focusMode: boolean;
  toggleFocusMode: () => void;
  resetRoutines: () => void;
  forceBackup: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

export default function CommandCenterModal({
  isOpen,
  onClose,
  setActiveMenu,
  categories,
  focusMode,
  toggleFocusMode,
  resetRoutines,
  forceBackup,
  isDarkMode,
  setIsDarkMode
}: CommandCenterModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter modules based on search
  const filteredItems = React.useMemo(() => {
    const list: Array<{ id: string; label: string; desc: string; icon: any; type: "module" | "action"; action?: () => void }> = [];

    // 1. Add direct general actions at the top of query or search
    const actions = [
      {
        id: "action_focus",
        label: focusMode ? "Désactiver le Mode Concentration" : "Activer le Mode Concentration",
        desc: "Masquer les flux financiers et se concentrer sur l'essentiel",
        icon: Flame,
        type: "action" as const,
        action: () => {
          toggleFocusMode();
          onClose();
        }
      },
      {
        id: "action_backup",
        label: "Forcer la Sauvegarde & Sync",
        desc: "Enregistrer immédiatement toutes les données de votre Second Brain",
        icon: Save,
        type: "action" as const,
        action: () => {
          forceBackup();
          onClose();
        }
      },
      {
        id: "action_reset",
        label: "Démarrer une nouvelle journée (Reset)",
        desc: "Réinitialiser les routines et habitudes quotidiennes",
        icon: Clock,
        type: "action" as const,
        action: () => {
          resetRoutines();
          onClose();
        }
      },
      {
        id: "action_theme",
        label: isDarkMode ? "Basculer en Mode Clair" : "Basculer en Mode Sombre Professionnel",
        desc: "Changer l'apparence visuelle globale",
        icon: isDarkMode ? Sun : Moon,
        type: "action" as const,
        action: () => {
          setIsDarkMode(!isDarkMode);
          onClose();
        }
      }
    ];

    // Filter actions
    actions.forEach(act => {
      if (!searchQuery || act.label.toLowerCase().includes(searchQuery.toLowerCase()) || act.desc.toLowerCase().includes(searchQuery.toLowerCase())) {
        list.push(act);
      }
    });

    // 2. Add modules
    categories.forEach(cat => {
      cat.items.forEach(item => {
        if (!searchQuery || item.label.toLowerCase().includes(searchQuery.toLowerCase()) || item.desc.toLowerCase().includes(searchQuery.toLowerCase())) {
          list.push({
            id: item.id,
            label: item.label,
            desc: item.desc,
            icon: item.icon,
            type: "module" as const,
            action: () => {
              setActiveMenu(item.id);
              onClose();
            }
          });
        }
      });
    });

    return list;
  }, [searchQuery, categories, focusMode, isDarkMode, onClose, setActiveMenu, toggleFocusMode, resetRoutines, forceBackup, setIsDarkMode]);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedIndex(0);
      setSearchQuery("");
      // timeout to let anim play
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Key navigation logic
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(1, filteredItems.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredItems.length) % Math.max(1, filteredItems.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].action?.();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-start justify-center pt-24 px-4 font-sans select-none">
      
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-950/45 dark:bg-neutral-950/70 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search header bar */}
        <div className="relative flex items-center p-4 border-b border-neutral-100 dark:border-neutral-800/80">
          <Search className="w-5 h-5 text-neutral-400 dark:text-neutral-500 absolute left-5" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Rechercher un module, une action ou un raccourci de vie..."
            className="w-full bg-transparent pl-12 pr-12 py-2 text-sm font-semibold text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none"
          />
          <div className="flex items-center gap-1.5 absolute right-5">
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-black font-mono bg-neutral-100 dark:bg-zinc-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-neutral-400 dark:text-neutral-500 uppercase tracking-wide">ESC</kbd>
            <button 
              onClick={onClose} 
              className="p-1 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-lg text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-0.5">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center flex flex-col items-center justify-center space-y-2">
              <Sparkles className="w-6 h-6 text-neutral-300 dark:text-neutral-700 animate-spin" />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-bold uppercase tracking-wider">Aucun résultat trouvé</p>
              <p className="text-[10px] text-neutral-400">Essayez de taper un autre terme comme "BVC", "Sport" ou "Comptes".</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const ItemIcon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl text-left transition-all duration-150 cursor-pointer ${
                    isSelected 
                      ? "bg-neutral-100/80 dark:bg-zinc-800/80 text-neutral-900 dark:text-white" 
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50/50 dark:hover:bg-zinc-850/50"
                  }`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`p-2.5 rounded-xl border shrink-0 transition-all ${
                      isSelected 
                        ? "bg-neutral-900 text-white dark:bg-neutral-50 dark:text-neutral-950 border-neutral-900 dark:border-neutral-50" 
                        : "bg-neutral-50 dark:bg-zinc-950 text-neutral-400 dark:text-neutral-500 border-neutral-100 dark:border-neutral-900"
                    }`}>
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold leading-none ${
                        isSelected ? "text-neutral-900 dark:text-white" : "text-neutral-800 dark:text-neutral-200"
                      }`}>
                        {item.label}
                      </p>
                      <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold truncate mt-1">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center shrink-0">
                    {item.type === "action" && (
                      <span className="text-[9px] font-black font-mono border border-amber-500/20 text-amber-600 dark:text-amber-400 bg-amber-500/5 px-2 py-0.5 rounded-lg mr-2 uppercase tracking-wide">
                        Raccourci
                      </span>
                    )}
                    {isSelected && (
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 animate-in slide-in-from-left duration-150" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Modal Footer helper */}
        <div className="p-3 bg-neutral-50 dark:bg-zinc-950/60 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between text-[9px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider px-5">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-neutral-200 dark:bg-zinc-800 rounded-sm">↑↓</kbd> Naviguer
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-neutral-200 dark:bg-zinc-800 rounded-sm">ENTER</kbd> Valider
            </span>
          </div>
          <div>
            <span>Second Brain Command Center v2.0</span>
          </div>
        </div>

      </div>
    </div>
  );
}
