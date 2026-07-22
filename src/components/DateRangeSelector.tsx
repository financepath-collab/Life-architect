import React from "react";
import { Calendar, Filter, X, RefreshCw, ChevronRight } from "lucide-react";

export type DateRangePreset = 
  | "all" 
  | "today" 
  | "this_week" 
  | "this_month" 
  | "last_month" 
  | "last_3_months" 
  | "this_year" 
  | "custom";

export interface DateRange {
  preset: DateRangePreset;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
}

export const getDateRangeForPreset = (preset: DateRangePreset): { startDate: string; endDate: string } => {
  const now = new Date();
  const format = (d: Date) => d.toISOString().split("T")[0];

  if (preset === "today") {
    const todayStr = format(now);
    return { startDate: todayStr, endDate: todayStr };
  }

  if (preset === "this_week") {
    const dayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon
    const diffToMon = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek);
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMon);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    return { startDate: format(monday), endDate: format(sunday) };
  }

  if (preset === "this_month") {
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startDate: format(firstDay), endDate: format(lastDay) };
  }

  if (preset === "last_month") {
    const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
    return { startDate: format(firstDay), endDate: format(lastDay) };
  }

  if (preset === "last_3_months") {
    const firstDay = new Date(now.getFullYear(), now.getMonth() - 2, 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return { startDate: format(firstDay), endDate: format(lastDay) };
  }

  if (preset === "this_year") {
    const firstDay = new Date(now.getFullYear(), 0, 1);
    const lastDay = new Date(now.getFullYear(), 11, 31);
    return { startDate: format(firstDay), endDate: format(lastDay) };
  }

  return { startDate: "", endDate: "" };
};

interface DateRangeSelectorProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  totalItemsCount?: number;
  filteredItemsCount?: number;
  dateColumnLabel?: string;
  className?: string;
}

export default function DateRangeSelector({
  value,
  onChange,
  totalItemsCount,
  filteredItemsCount,
  dateColumnLabel,
  className = ""
}: DateRangeSelectorProps) {
  const handlePresetSelect = (preset: DateRangePreset) => {
    if (preset === "custom") {
      onChange({
        ...value,
        preset: "custom"
      });
      return;
    }

    const { startDate, endDate } = getDateRangeForPreset(preset);
    onChange({
      preset,
      startDate,
      endDate
    });
  };

  const handleStartDateChange = (newStart: string) => {
    onChange({
      preset: "custom",
      startDate: newStart,
      endDate: value.endDate
    });
  };

  const handleEndDateChange = (newEnd: string) => {
    onChange({
      preset: "custom",
      startDate: value.startDate,
      endDate: newEnd
    });
  };

  const handleReset = () => {
    onChange({
      preset: "all",
      startDate: "",
      endDate: ""
    });
  };

  const isFiltered = value.preset !== "all" || Boolean(value.startDate) || Boolean(value.endDate);

  const presetsList: { id: DateRangePreset; label: string }[] = [
    { id: "all", label: "Toutes les dates" },
    { id: "today", label: "Aujourd'hui" },
    { id: "this_month", label: "Ce mois-ci" },
    { id: "last_month", label: "Mois dernier" },
    { id: "last_3_months", label: "3 derniers mois" },
    { id: "this_year", label: "Année en cours" },
    { id: "custom", label: "Plage personnalisée" }
  ];

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  return (
    <div className={`bg-neutral-900 text-white rounded-2xl p-4 shadow-sm border border-neutral-800 space-y-3.5 transition-all ${className}`}>
      {/* Header Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl border border-indigo-500/30">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-white font-mono">
                Sélecteur de Plage de Dates
              </h3>
              {dateColumnLabel && (
                <span className="px-2 py-0.5 bg-neutral-800 text-neutral-300 border border-neutral-700/60 rounded text-[10px] font-mono">
                  Basé sur : {dateColumnLabel}
                </span>
              )}
            </div>
            <p className="text-[11px] text-neutral-400 mt-0.5">
              Filtrez dynamiquement les transactions, budgets, factures et données financières.
            </p>
          </div>
        </div>

        {/* Counter & Status Badge */}
        <div className="flex items-center gap-2">
          {typeof filteredItemsCount === "number" && typeof totalItemsCount === "number" && (
            <div className="px-3 py-1 bg-neutral-800/90 border border-neutral-700/80 rounded-xl text-[11px] font-mono font-bold text-neutral-300 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${isFiltered ? "bg-amber-400 animate-pulse" : "bg-emerald-400"}`} />
              <span>{filteredItemsCount} / {totalItemsCount} éléments</span>
            </div>
          )}

          {isFiltered && (
            <button
              onClick={handleReset}
              className="px-2.5 py-1 bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer"
              title="Réinitialiser la plage de dates"
            >
              <X className="w-3.5 h-3.5" />
              <span>Réinitialiser</span>
            </button>
          )}
        </div>
      </div>

      {/* Preset Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        {presetsList.map((p) => {
          const isActive = value.preset === p.id;
          return (
            <button
              key={p.id}
              onClick={() => handlePresetSelect(p.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                isActive
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-md font-extrabold"
                  : "bg-neutral-800/80 hover:bg-neutral-800 text-neutral-300 border-neutral-700/60"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Custom Inputs Row or Active Range Summary */}
      {(value.preset === "custom" || (value.startDate && value.endDate)) && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-neutral-800/80">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px] font-mono">
              Du :
            </span>
            <input
              type="date"
              value={value.startDate}
              onChange={(e) => handleStartDateChange(e.target.value)}
              className="bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
            />

            <ChevronRight className="w-4 h-4 text-neutral-500 shrink-0 hidden sm:block" />

            <span className="text-neutral-400 font-bold uppercase tracking-wider text-[10px] font-mono">
              Au :
            </span>
            <input
              type="date"
              value={value.endDate}
              onChange={(e) => handleEndDateChange(e.target.value)}
              className="bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500 cursor-pointer"
            />
          </div>

          {value.startDate && value.endDate && (
            <div className="text-[11px] font-mono font-bold text-indigo-300 bg-indigo-950/60 border border-indigo-800/50 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <span>Période active :</span>
              <span className="text-white">{formatDateDisplay(value.startDate)} ➔ {formatDateDisplay(value.endDate)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
