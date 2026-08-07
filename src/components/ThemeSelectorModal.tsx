import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Palette, Check, Sun, Moon, Sparkles } from "lucide-react";

export type ThemePresetId = "indigo" | "warm-cream" | "nordic-emerald" | "titanium-gray" | "midnight-oled" | "royal-amethyst" | "sunset-coral";

export interface ThemePreset {
  id: ThemePresetId;
  name: string;
  subtitle: string;
  badge: string;
  lightBg: string;
  darkBg: string;
  primaryColor: string;
  secondaryColor: string;
  previewGradient: string;
}

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: "nordic-emerald",
    name: "Émeraude & Sauge",
    subtitle: "Atmosphère sereine, apaisante et hautement lisible",
    badge: "Recommandé",
    lightBg: "#f2f7f4",
    darkBg: "#06120e",
    primaryColor: "#059669",
    secondaryColor: "#10b981",
    previewGradient: "from-emerald-600 to-teal-500"
  },
  {
    id: "indigo",
    name: "Slate & Indigo Pro",
    subtitle: "Thème classique, propre et équilibré",
    badge: "Populaire",
    lightBg: "#f8fafc",
    darkBg: "#0b0f17",
    primaryColor: "#4f46e5",
    secondaryColor: "#0284c7",
    previewGradient: "from-indigo-600 to-sky-500"
  },
  {
    id: "warm-cream",
    name: "Ivoire & Ambre Prestige",
    subtitle: "Inspiré du papier noble et bois chaud",
    badge: "Chaleureux",
    lightBg: "#fbf9f5",
    darkBg: "#12100e",
    primaryColor: "#d97706",
    secondaryColor: "#b45309",
    previewGradient: "from-amber-500 to-orange-600"
  },
  {
    id: "royal-amethyst",
    name: "Améthyste & Velvet",
    subtitle: "Palette créateur riche et créative",
    badge: "Créateur",
    lightBg: "#f8f6fc",
    darkBg: "#0f0a17",
    primaryColor: "#7c3aed",
    secondaryColor: "#c084fc",
    previewGradient: "from-purple-600 to-pink-500"
  },
  {
    id: "sunset-coral",
    name: "Corail & Coucher de Soleil",
    subtitle: "Palette vibrante, moderne et dynamique",
    badge: "Moderne",
    lightBg: "#fff7f5",
    darkBg: "#180c0a",
    primaryColor: "#e11d48",
    secondaryColor: "#f97316",
    previewGradient: "from-rose-600 to-orange-500"
  },
  {
    id: "titanium-gray",
    name: "Titane & Cobalt Minimal",
    subtitle: "Style ultra-structuré haut contraste",
    badge: "Haute précision",
    lightBg: "#f1f5f9",
    darkBg: "#0f172a",
    primaryColor: "#2563eb",
    secondaryColor: "#3b82f6",
    previewGradient: "from-blue-600 to-indigo-500"
  },
  {
    id: "midnight-oled",
    name: "Nuit Obscure OLED",
    subtitle: "Fond sombre profond spécial fatigue visuelle",
    badge: "Mode Nuit Pro",
    lightBg: "#0f172a",
    darkBg: "#05070a",
    primaryColor: "#38bdf8",
    secondaryColor: "#818cf8",
    previewGradient: "from-sky-400 to-indigo-500"
  }
];

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: (dark: boolean) => void;
  currentTheme: ThemePresetId;
  onSelectTheme: (theme: ThemePresetId) => void;
}

export default function ThemeSelectorModal({
  isOpen,
  onClose,
  isDarkMode,
  onToggleDarkMode,
  currentTheme,
  onSelectTheme
}: ThemeSelectorModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-neutral-950/60 dark:bg-black/80 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-2xl bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-zinc-800 rounded-3xl shadow-2xl overflow-hidden z-10 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-zinc-800/80 bg-neutral-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800/80 text-indigo-600 dark:text-indigo-400 rounded-2xl">
                <Palette className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span>Personnaliser l'Apparence & le Thème</span>
                  <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-full text-[10px] font-mono font-bold">
                    6 Thèmes
                  </span>
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Choisissez l'univers visuel et le niveau de contraste qui correspondent le mieux à vos yeux.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800 rounded-2xl transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
            
            {/* Mode Sombre / Clair Quick Toggle */}
            <div className="p-4 bg-neutral-50 dark:bg-zinc-800/50 border border-neutral-200/80 dark:border-zinc-700/60 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${isDarkMode ? "bg-amber-950/60 border-amber-800 text-amber-400" : "bg-amber-50 border-amber-200 text-amber-600"}`}>
                  {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </div>
                <div>
                  <span className="text-xs font-black text-neutral-900 dark:text-white block uppercase tracking-wider">
                    Mode {isDarkMode ? "Sombre / Profond" : "Clair / Lumineux"}
                  </span>
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    Basculez entre l'affichage haute clarté de jour et l'affichage confort de nuit.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 p-1 rounded-xl border border-neutral-200 dark:border-zinc-700 shrink-0 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => onToggleDarkMode(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    !isDarkMode
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" />
                  <span>Clair</span>
                </button>

                <button
                  type="button"
                  onClick={() => onToggleDarkMode(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isDarkMode
                      ? "bg-indigo-600 text-white shadow-xs"
                      : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" />
                  <span>Sombre</span>
                </button>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-black text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Palettes & Ambiance Visuelle</span>
                </h4>
                <span className="text-[10px] text-neutral-400 font-mono">Changement instantané</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {THEME_PRESETS.map((preset) => {
                  const isSelected = currentTheme === preset.id;

                  return (
                    <motion.div
                      key={preset.id}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      onClick={() => onSelectTheme(preset.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? "bg-white dark:bg-zinc-800 border-indigo-600 dark:border-indigo-500 shadow-md ring-2 ring-indigo-500/20"
                          : "bg-neutral-50/70 dark:bg-zinc-800/40 border-neutral-200/80 dark:border-zinc-700/60 hover:bg-white dark:hover:bg-zinc-800 hover:border-neutral-300 dark:hover:border-zinc-600"
                      }`}
                    >
                      {/* Top row */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {/* Color dots preview */}
                          <div className="flex items-center -space-x-1">
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 shadow-2xs inline-block"
                              style={{ backgroundColor: preset.lightBg }}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 shadow-2xs inline-block"
                              style={{ backgroundColor: preset.primaryColor }}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-black/10 shadow-2xs inline-block"
                              style={{ backgroundColor: preset.secondaryColor }}
                            />
                          </div>
                          <span className="text-xs font-black text-neutral-900 dark:text-white">
                            {preset.name}
                          </span>
                        </div>

                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          isSelected 
                            ? "bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800"
                            : "bg-neutral-200/60 dark:bg-zinc-700 text-neutral-600 dark:text-neutral-300 border-transparent"
                        }`}>
                          {preset.badge}
                        </span>
                      </div>

                      {/* Description */}
                      <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mb-3 line-clamp-2">
                        {preset.subtitle}
                      </p>

                      {/* Visual Mini Preview Bar */}
                      <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100 dark:border-zinc-700/60">
                        <div className="flex items-center gap-1.5">
                          <div
                            className={`h-2.5 w-12 rounded-full bg-linear-to-r ${preset.previewGradient}`}
                          />
                          <span className="text-[9px] font-mono text-neutral-400">Accents</span>
                        </div>

                        {isSelected ? (
                          <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" /> Actif
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200">
                            Sélectionner
                          </span>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="p-4 bg-neutral-50/80 dark:bg-zinc-900/80 border-t border-neutral-100 dark:border-zinc-800/80 flex items-center justify-between">
            <span className="text-[11px] text-neutral-400 font-medium">
              Vos préférences de thème sont automatiquement sauvegardées localement.
            </span>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-white dark:hover:bg-neutral-100 dark:text-neutral-900 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95"
            >
              Terminé
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
