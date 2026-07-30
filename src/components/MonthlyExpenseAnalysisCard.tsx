import React, { useState, useMemo, useCallback } from "react";
import { FinanceTransaction, Abonnement } from "../types";
import CategoryDetailModal from "./CategoryDetailModal";
import { 
  TrendingDown, 
  Calendar, 
  ChevronDown, 
  PieChart as PieIcon,
  BarChart3,
  List,
  AlertCircle,
  Coins,
  ArrowRight
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

const CATEGORY_COLORS = [
  "#171717", // Charcoal
  "#404040", // Medium Charcoal
  "#737373", // Gray
  "#a3a3a3", // Light Gray
  "#0f766e", // Teal
  "#d97706", // Amber
  "#2563eb", // Royal Blue
  "#4f46e5", // Indigo
  "#c026d3", // Fuchsia
  "#ea580c", // Orange
  "#e11d48", // Rose
];

const CustomChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 p-3 rounded-xl shadow-lg font-sans">
        <p className="text-[9px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Catégorie</p>
        <p className="text-xs font-bold text-neutral-900 dark:text-neutral-50 mt-0.5">{data.name}</p>
        <p className="text-[9px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-2">Dépenses</p>
        <p className="text-sm font-black font-mono text-neutral-900 dark:text-neutral-100 mt-0.5">
          {payload[0].value.toLocaleString("fr-FR")} MAD
        </p>
        <p className="text-[9px] font-bold text-neutral-400 mt-1">
          {data.percentage.toFixed(1)}% des dépenses totales
        </p>
      </div>
    );
  }
  return null;
};

const normalizeCategory = (rawCat: string): string => {
  if (!rawCat) return "Autres";
  const normTx = rawCat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

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
    rawCat === "Alimentation" ||
    rawCat === "Alimentation & Courses" ||
    rawCat === "Logement & Serveurs" ||
    rawCat === "Équipement & Matériel" ||
    rawCat === "Marketing & Publicité" ||
    rawCat === "Transport & Carburant" ||
    rawCat === "Loisirs & Sorties"
  ) {
    return rawCat;
  }

  const mappings: { [key: string]: string } = {
    alimentation: "Alimentation",
    courses: "Alimentation",
    supermarche: "Alimentation",
    carrefour: "Alimentation",
    bim: "Alimentation",
    nourriture: "Alimentation",
    resto: "Alimentation",
    restaurant: "Alimentation",
    repas: "Alimentation",
    cafe: "Alimentation",
    café: "Alimentation",

    equipement: "Équipement & Matériel",
    materiel: "Équipement & Matériel",
    bureau: "Équipement & Matériel",
    mobilier: "Équipement & Matériel",
    shure: "Équipement & Matériel",
    sony: "Équipement & Matériel",
    camera: "Équipement & Matériel",
    clavier: "Équipement & Matériel",
    souris: "Équipement & Matériel",
    macbook: "Équipement & Matériel",
    pc: "Équipement & Matériel",
    ordinateur: "Équipement & Matériel",

    logiciel: "Logiciels & SaaS",
    logiciels: "Logiciels & SaaS",
    saas: "Logiciels & SaaS",
    adobe: "Logiciels & SaaS",
    canva: "Logiciels & SaaS",
    chatgpt: "Logiciels & SaaS",
    openai: "Logiciels & SaaS",
    hosting: "Logiciels & SaaS",
    hostinger: "Logiciels & SaaS",
    cloud: "Logiciels & SaaS",
    vpn: "Logiciels & SaaS",

    marketing: "Marketing & Publicité",
    publicite: "Marketing & Publicité",
    pub: "Marketing & Publicité",
    ads: "Marketing & Publicité",
    sponsor: "Marketing & Publicité",
    sponsoring: "Marketing & Publicité",
    google_ads: "Marketing & Publicité",
    facebook_ads: "Marketing & Publicité",
    tiktok_ads: "Marketing & Publicité",

    transport: "Transport & Carburant",
    carburant: "Transport & Carburant",
    essence: "Transport & Carburant",
    gazole: "Transport & Carburant",
    autoroute: "Transport & Carburant",
    peage: "Transport & Carburant",
    uber: "Transport & Carburant",
    taxi: "Transport & Carburant",
    train: "Transport & Carburant",
    vol: "Transport & Carburant",

    loisir: "Loisirs & Sorties",
    loisirs: "Loisirs & Sorties",
    sortie: "Loisirs & Sorties",
    sorties: "Loisirs & Sorties",
    cinema: "Loisirs & Sorties",
    voyage: "Loisirs & Sorties",
    hotel: "Loisirs & Sorties",
    vacances: "Loisirs & Sorties",
    netflix: "Loisirs & Sorties",
    spotify: "Loisirs & Sorties"
  };

  for (const [key, value] of Object.entries(mappings)) {
    if (normTx.includes(key)) {
      return value;
    }
  }
  return rawCat; // fallback
};

interface MonthlyExpenseAnalysisCardProps {
  transactions: FinanceTransaction[];
  abonnements?: Abonnement[];
}

export default function MonthlyExpenseAnalysisCard({ 
  transactions = [], 
  abonnements = [] 
}: MonthlyExpenseAnalysisCardProps) {
  const [chartType, setChartType] = useState<"donut" | "pie" | "bar">("pie");
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [modalCategory, setModalCategory] = useState<string | null>(null);
  
  // Selected period state for the pie chart ("month:2026-07", "quarter:2026-Q3", "all", etc.)
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month:2026-07");
  
  // Find all unique months available in transactions
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    monthsSet.add("2026-07");
    monthsSet.add("2026-06");
    monthsSet.add("2026-05");
    monthsSet.add("2026-04");
    
    transactions.forEach(t => {
      if (t.date && t.date.length >= 7) {
        monthsSet.add(t.date.substring(0, 7));
      }
    });

    return Array.from(monthsSet).sort().reverse();
  }, [transactions]);

  // Find all unique quarters available
  const availableQuarters = useMemo(() => {
    const qSet = new Set<string>();
    qSet.add("2026-Q3");
    qSet.add("2026-Q2");
    qSet.add("2026-Q1");
    
    transactions.forEach(t => {
      if (t.date && t.date.length >= 7) {
        const year = t.date.substring(0, 4);
        const m = parseInt(t.date.substring(5, 7), 10);
        let q = 1;
        if (m >= 4 && m <= 6) q = 2;
        else if (m >= 7 && m <= 9) q = 3;
        else if (m >= 10 && m <= 12) q = 4;
        qSet.add(`${year}-Q${q}`);
      }
    });

    return Array.from(qSet).sort().reverse();
  }, [transactions]);

  const matchesPeriod = useCallback((dateStr: string | undefined, periodKey: string) => {
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
  }, []);

  const formatMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const label = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

  const formatQuarterLabel = (qKey: string) => {
    const [year, qStr] = qKey.split("-Q");
    const q = parseInt(qStr, 10);
    const qMap: { [key: number]: string } = {
      1: "T1 (Jan - Mars)",
      2: "T2 (Avr - Juin)",
      3: "T3 (Juil - Sept)",
      4: "T4 (Oct - Déc)"
    };
    return `${qMap[q] || `Trimestre ${q}`} ${year}`;
  };

  // Calculate statistics for the selected period (Month / Quarter)
  const analysisData = useMemo(() => {
    let totalExpense = 0;
    const categoryExpenses: { [cat: string]: number } = {};

    const activeSubCost = abonnements
      .filter(a => a.status === "Actif")
      .reduce((sum, a) => sum + (a.billingPeriod === "Mensuel" ? a.costMonthly : a.costMonthly / 12), 0);

    const periodTransactions = transactions.filter(
      t => t.type === "Dépense" && matchesPeriod(t.date, selectedPeriod)
    );

    periodTransactions.forEach(t => {
      const amt = t.amount || 0;
      const rawCat = t.category || "Autre";
      const cat = normalizeCategory(rawCat);
      categoryExpenses[cat] = (categoryExpenses[cat] || 0) + amt;
      totalExpense += amt;
    });

    if (activeSubCost > 0) {
      categoryExpenses["Abonnements & Charges"] = (categoryExpenses["Abonnements & Charges"] || 0) + activeSubCost;
      totalExpense += activeSubCost;
    }

    // Format into chart array
    const sortedCategories = Object.entries(categoryExpenses)
      .map(([name, value]) => ({
        name,
        value,
        percentage: totalExpense > 0 ? (value / totalExpense) * 100 : 0
      }))
      .sort((a, b) => b.value - a.value);

    const topCategory = sortedCategories[0] || { name: "Aucune", value: 0, percentage: 0 };

    return {
      totalExpense,
      categories: sortedCategories,
      topCategory,
      averageExpense: sortedCategories.length > 0 ? totalExpense / sortedCategories.length : 0
    };
  }, [selectedPeriod, transactions, abonnements, matchesPeriod]);

  return (
    <div id="monthly-expense-category-analysis" className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 shadow-2xs hover:shadow-sm transition-all duration-300 space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-neutral-900 text-white rounded-2xl shrink-0">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-50 uppercase tracking-wider font-display">
              Analyse des Dépenses par Catégorie
            </h3>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">
              Répartition et analyse des coûts mensuels
            </p>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Period Selector Dropdown (Month / Quarter / Global) */}
          <div className="flex items-center gap-1.5 bg-neutral-50 dark:bg-zinc-950/60 border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-300">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="appearance-none bg-transparent pr-6 focus:outline-none cursor-pointer font-bold"
              >
                <option value="all" className="dark:bg-zinc-900">🌐 Tout le cumul (Global)</option>
                <optgroup label="📅 Filtrer par Mois" className="dark:bg-zinc-900">
                  {availableMonths.map(m => (
                    <option key={m} value={`month:${m}`} className="dark:bg-zinc-900">
                      Mois : {formatMonthLabel(m)}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="📊 Filtrer par Trimestre" className="dark:bg-zinc-900">
                  {availableQuarters.map(q => (
                    <option key={q} value={`quarter:${q}`} className="dark:bg-zinc-900">
                      Trimestre : {formatQuarterLabel(q)}
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown className="w-3 h-3 text-neutral-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Toggle Pie / Donut / Bar Chart */}
          <div className="flex bg-neutral-100 dark:bg-zinc-950 p-1 rounded-xl border border-neutral-200/50 dark:border-neutral-800/80 text-xs">
            <button
              type="button"
              onClick={() => setChartType("pie")}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 font-bold ${
                chartType === "pie"
                  ? "bg-white dark:bg-zinc-900 text-neutral-950 dark:text-neutral-50 shadow-3xs"
                  : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              }`}
              title="Graphique circulaire / Camembert"
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Circulaire</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType("donut")}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 font-bold ${
                chartType === "donut"
                  ? "bg-white dark:bg-zinc-900 text-neutral-950 dark:text-neutral-50 shadow-3xs"
                  : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              }`}
              title="Graphique en anneau"
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Anneau</span>
            </button>
            <button
              type="button"
              onClick={() => setChartType("bar")}
              className={`px-2 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 font-bold ${
                chartType === "bar"
                  ? "bg-white dark:bg-zinc-900 text-neutral-950 dark:text-neutral-50 shadow-3xs"
                  : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              }`}
              title="Graphique en barres"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Barres</span>
            </button>
          </div>
        </div>
      </div>

      {/* CHART & VISUALIZATION AREA */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        
        {/* Left Column: Interactive Recharts Visual */}
        <div className="md:col-span-5 relative flex items-center justify-center min-h-[220px] bg-neutral-50/30 dark:bg-zinc-950/20 border border-neutral-200/40 dark:border-neutral-800/40 rounded-2xl py-3">
          {analysisData.categories.length === 0 ? (
            <div className="text-center text-xs text-neutral-400 py-10 italic">
              Aucune dépense sur ce mois.
            </div>
          ) : chartType === "pie" || chartType === "donut" ? (
            <div className="relative w-full h-[210px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height={210}>
                <PieChart>
                  <Pie
                    data={analysisData.categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={chartType === "donut" ? 55 : 0}
                    outerRadius={78}
                    paddingAngle={chartType === "donut" ? 3 : 1.5}
                    dataKey="value"
                    onClick={(entry) => {
                      setSelectedCategoryName(entry.name);
                      setModalCategory(entry.name);
                    }}
                    cursor="pointer"
                  >
                    {analysisData.categories.map((entry, index) => {
                      const isSelected = selectedCategoryName === entry.name;
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} 
                          stroke={isSelected ? "#ffffff" : "transparent"}
                          strokeWidth={isSelected ? 3 : 0}
                          style={{
                            filter: selectedCategoryName && !isSelected ? "opacity(0.4)" : "opacity(1)",
                            transition: "all 0.3s ease"
                          }}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Central Totals Label for Donut Mode */}
              {chartType === "donut" && (
                <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-[8px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider">Total Dépenses</span>
                  <span className="text-sm font-black font-mono text-neutral-900 dark:text-neutral-50 leading-none py-0.5">
                    {analysisData.totalExpense.toLocaleString("fr-FR")}
                  </span>
                  <span className="text-[8px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider">MAD</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-[200px] px-3">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={analysisData.categories}
                  margin={{ top: 10, right: 10, left: -25, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" className="opacity-40 dark:opacity-10" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#a3a3a3', fontSize: 9, fontWeight: 600 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#a3a3a3', fontSize: 9, fontWeight: 500 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(val) => `${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`}
                  />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Bar 
                    dataKey="value" 
                    radius={[4, 4, 0, 0]} 
                    maxBarSize={20}
                    onClick={(entry: any) => {
                      if (entry && entry.name) {
                        setSelectedCategoryName(entry.name);
                        setModalCategory(entry.name);
                      }
                    }}
                    cursor="pointer"
                  >
                    {analysisData.categories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Right Column: Progressive List Legend */}
        <div className="md:col-span-7 space-y-3.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
              Répartition par Poste de Coût <span className="text-[9px] font-semibold text-purple-600 dark:text-purple-400 font-sans ml-1">(Cliquez pour détailler)</span>
            </span>
            <div className="flex items-center gap-2">
              {selectedCategoryName && (
                <button
                  type="button"
                  onClick={() => setSelectedCategoryName(null)}
                  className="text-[9px] bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2 py-0.5 rounded font-bold cursor-pointer transition-all"
                >
                  Réinitialiser la sélection
                </button>
              )}
              <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono font-bold">
                {analysisData.categories.length} catégories actives
              </span>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">
            {analysisData.categories.map((cat, index) => {
              const maxVal = analysisData.topCategory.value || 1;
              const ratio = (cat.value / maxVal) * 100;
              const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];
              const isSelected = selectedCategoryName === cat.name;

              return (
                <div 
                  key={cat.name} 
                  onClick={() => {
                    setSelectedCategoryName(cat.name);
                    setModalCategory(cat.name);
                  }}
                  title="Cliquez pour ouvrir la liste détaillée des transactions de cette catégorie"
                  className={`space-y-1 p-1.5 rounded-xl transition-all cursor-pointer border ${
                    isSelected 
                      ? "bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 shadow-2xs" 
                      : "border-transparent hover:bg-neutral-50 dark:hover:bg-zinc-800/40"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span 
                        className="w-2.5 h-2.5 rounded-xs shrink-0" 
                        style={{ backgroundColor: color }}
                      />
                      <span className={`font-semibold truncate ${isSelected ? "text-indigo-900 dark:text-indigo-200 font-extrabold" : "text-neutral-700 dark:text-neutral-300"}`}>
                        {cat.name}
                      </span>
                    </div>
                    <div className="font-mono text-right shrink-0">
                      <span className="text-neutral-900 dark:text-neutral-100 font-bold">
                        {cat.value.toLocaleString("fr-FR")} MAD
                      </span>
                      <span className="text-neutral-400 dark:text-neutral-500 text-[10px] ml-1.5 font-bold">
                        ({cat.percentage.toFixed(0)}%)
                      </span>
                    </div>
                  </div>
                  {/* Progress track */}
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800/60 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${ratio}%`, backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* SYNTHESIS / ANALYSIS BANNER */}
      <div className="bg-neutral-50 dark:bg-zinc-950/40 border border-neutral-200/50 dark:border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl shrink-0">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide block">
              Poste de dépense principal
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                {analysisData.topCategory.name}
              </span>
              <span className="text-[10px] font-bold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded">
                {analysisData.topCategory.percentage.toFixed(0)}% des dépenses
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono self-end sm:self-center">
          <div className="text-right">
            <span className="text-neutral-400 dark:text-neutral-500 text-[9px] block font-sans font-bold">MOYENNE PAR CATÉGORIE</span>
            <span className="text-neutral-800 dark:text-neutral-200 font-bold">
              {Math.round(analysisData.averageExpense).toLocaleString("fr-FR")} MAD
            </span>
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-100 dark:border-neutral-800/80 my-2" />

      {/* Règle de Budget Automatisée (50/30/20) */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-xl">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-black text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">
              Règle Budgétaire Classique 50 / 30 / 20
            </h4>
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 font-semibold uppercase tracking-wider">
              Analyse automatique de la répartition par rapport à la règle d'or financière
            </p>
          </div>
        </div>

        {/* 50/30/20 Calculation logic and UI */}
        {(() => {
          // 1. Calculate Monthly Income for the selected period
          const income = transactions
            .filter(t => t.type === "Revenue" && matchesPeriod(t.date, selectedPeriod))
            .reduce((sum, t) => sum + (t.amount || 0), 0);

          let besoins = 0; // Needs (50%)
          let envies = 0;  // Wants (30%)
          let epargne = 0; // Savings (20%)

          // Active subscriptions also count as Needs
          const activeSubCost = abonnements
            .filter(a => a.status === "Actif")
            .reduce((sum, a) => sum + (a.billingPeriod === "Mensuel" ? a.costMonthly : a.costMonthly / 12), 0);

          const periodExpenses = transactions.filter(
            t => t.type === "Dépense" && matchesPeriod(t.date, selectedPeriod)
          );

          periodExpenses.forEach(t => {
            const amt = t.amount || 0;
            const rawCat = t.category || "Autre";
            const cat = normalizeCategory(rawCat);

            const catLower = cat.toLowerCase();
            if (
              catLower.includes("alimentation") ||
              catLower.includes("transport") ||
              catLower.includes("carburant") ||
              catLower.includes("logiciel") ||
              catLower.includes("saas") ||
              catLower.includes("abonnement") ||
              catLower.includes("logement") ||
              catLower.includes("serveurs") ||
              catLower.includes("facture") ||
              catLower.includes("bureau") ||
              catLower.includes("marketing") ||
              catLower.includes("publicité")
            ) {
              besoins += amt;
            } else if (
              catLower.includes("loisir") ||
              catLower.includes("sortie") ||
              catLower.includes("cadeaux") ||
              catLower.includes("shopping") ||
              catLower.includes("équipement") ||
              catLower.includes("matériel") ||
              catLower.includes("voyage") ||
              catLower.includes("restaurant") ||
              catLower.includes("café") ||
              catLower.includes("netflix") ||
              catLower.includes("spotify")
            ) {
              envies += amt;
            } else if (
              catLower.includes("épargne") ||
              catLower.includes("cagnottes") ||
              catLower.includes("bourse") ||
              catLower.includes("invest") ||
              catLower.includes("stock") ||
              catLower.includes("crypto")
            ) {
              epargne += amt;
            } else {
              besoins += amt;
            }
          });

          if (activeSubCost > 0) {
            besoins += activeSubCost;
          }

          const totalExpenses = besoins + envies + epargne;
          const remainingIncome = income - totalExpenses;
          const totalSavings = Math.max(0, epargne + remainingIncome);

          const besoinsPct = income > 0 ? (besoins / income) * 100 : 0;
          const enviesPct = income > 0 ? (envies / income) * 100 : 0;
          const epargnePct = income > 0 ? (totalSavings / income) * 100 : 0;

          const idealBesoins = income * 0.50;
          const idealEnvies = income * 0.30;
          const idealEpargne = income * 0.20;

          return (
            <div className="space-y-4 bg-neutral-50/50 dark:bg-zinc-950/20 p-4 border border-neutral-200/40 dark:border-neutral-800/40 rounded-2xl">
              <div className="space-y-3">
                {/* Real split bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">Votre Répartition Réelle</span>
                    <span className="font-mono text-neutral-400 dark:text-neutral-500 text-[10px] font-bold">
                      Sur {income.toLocaleString("fr-FR")} MAD de revenus
                    </span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-4 rounded-full overflow-hidden flex">
                    <div 
                      className="bg-neutral-900 dark:bg-zinc-400 h-full transition-all duration-500 flex items-center justify-center text-[8px] font-black text-white dark:text-neutral-950"
                      style={{ width: `${Math.min(100, besoinsPct)}%` }}
                      title={`Besoins: ${besoinsPct.toFixed(1)}%`}
                    >
                      {besoinsPct > 10 && `${besoinsPct.toFixed(0)}%`}
                    </div>
                    <div 
                      className="bg-neutral-500 dark:bg-zinc-600 h-full transition-all duration-500 flex items-center justify-center text-[8px] font-black text-white"
                      style={{ width: `${Math.min(100 - besoinsPct, enviesPct)}%` }}
                      title={`Envies: ${enviesPct.toFixed(1)}%`}
                    >
                      {enviesPct > 10 && `${enviesPct.toFixed(0)}%`}
                    </div>
                    <div 
                      className="bg-emerald-600 h-full transition-all duration-500 flex items-center justify-center text-[8px] font-black text-white"
                      style={{ width: `${Math.min(100 - besoinsPct - enviesPct, epargnePct)}%` }}
                      title={`Épargne: ${epargnePct.toFixed(1)}%`}
                    >
                      {epargnePct > 10 && `${epargnePct.toFixed(0)}%`}
                    </div>
                  </div>
                </div>

                {/* Ideal split bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold text-neutral-500">
                    <span>Cible Conseillée (50% / 30% / 20%)</span>
                    <span>Répartition Recommandée</span>
                  </div>
                  <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-3.5 rounded-full overflow-hidden flex opacity-85">
                    <div className="bg-neutral-800/40 dark:bg-zinc-400/30 h-full w-[50%] flex items-center justify-center text-[8px] font-extrabold text-neutral-700 dark:text-neutral-300">
                      50% Besoins
                    </div>
                    <div className="bg-neutral-500/40 h-full w-[30%] flex items-center justify-center text-[8px] font-extrabold text-neutral-700 dark:text-neutral-300">
                      30% Envies
                    </div>
                    <div className="bg-emerald-600/40 h-full w-[20%] flex items-center justify-center text-[8px] font-extrabold text-emerald-800 dark:text-emerald-200">
                      20% Épargne
                    </div>
                  </div>
                </div>
              </div>

              {/* Side by side comparison metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {/* Needs metric */}
                <div className="p-3 bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase">Besoins (Cible 50%)</span>
                    {besoinsPct <= 50 ? (
                      <span className="text-[8px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-xs font-mono">SOUS CONTRÔLE</span>
                    ) : (
                      <span className="text-[8px] font-black bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-xs font-mono">DÉPASSÉ</span>
                    )}
                  </div>
                  <div className="font-mono">
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      {Math.round(besoins).toLocaleString("fr-FR")} MAD
                    </span>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold ml-1">
                      ({besoinsPct.toFixed(0)}%)
                    </span>
                  </div>
                  <p className="text-[9px] text-neutral-400 dark:text-neutral-500 leading-tight">
                    Cible : {Math.round(idealBesoins).toLocaleString("fr-FR")} MAD. {besoinsPct <= 50 ? "Excellent respect des besoins vitaux." : "Vos coûts fixes sont un peu élevés."}
                  </p>
                </div>

                {/* Wants metric */}
                <div className="p-3 bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase">Envies (Cible 30%)</span>
                    {enviesPct <= 30 ? (
                      <span className="text-[8px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-xs font-mono font-bold">OK</span>
                    ) : (
                      <span className="text-[8px] font-black bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-xs font-mono font-bold font-mono">VIGILANCE</span>
                    )}
                  </div>
                  <div className="font-mono">
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      {Math.round(envies).toLocaleString("fr-FR")} MAD
                    </span>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold ml-1">
                      ({enviesPct.toFixed(0)}%)
                    </span>
                  </div>
                  <p className="text-[9px] text-neutral-400 dark:text-neutral-500 leading-tight">
                    Cible : {Math.round(idealEnvies).toLocaleString("fr-FR")} MAD. {enviesPct <= 30 ? "Budget de plaisir maîtrisé." : "Attention aux dépenses discrétionnaires."}
                  </p>
                </div>

                {/* Savings metric */}
                <div className="p-3 bg-white dark:bg-zinc-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-xl space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase">Épargne (Cible 20%)</span>
                    {epargnePct >= 20 ? (
                      <span className="text-[8px] font-black bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-xs font-mono font-bold font-mono">OBJECTIF ATTEINT</span>
                    ) : (
                      <span className="text-[8px] font-black bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 px-1.5 py-0.5 rounded-xs font-mono font-bold font-mono font-mono">A RENFORCER</span>
                    )}
                  </div>
                  <div className="font-mono">
                    <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                      {Math.round(totalSavings).toLocaleString("fr-FR")} MAD
                    </span>
                    <span className="text-[10px] text-neutral-400 dark:text-neutral-500 font-bold ml-1">
                      ({epargnePct.toFixed(0)}%)
                    </span>
                  </div>
                  <p className="text-[9px] text-neutral-400 dark:text-neutral-500 leading-tight">
                    Cible : {Math.round(idealEpargne).toLocaleString("fr-FR")} MAD. {epargnePct >= 20 ? "Excellente discipline d'épargne." : "Essayez de réduire vos extras."}
                  </p>
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* DETAILED CATEGORY TRANSACTIONS MODAL */}
      <CategoryDetailModal
        isOpen={!!modalCategory}
        onClose={() => setModalCategory(null)}
        categoryName={modalCategory}
        periodKey={selectedPeriod}
        transactions={transactions}
        abonnements={abonnements}
        totalPeriodExpenses={analysisData.totalExpense}
      />

    </div>
  );
}
