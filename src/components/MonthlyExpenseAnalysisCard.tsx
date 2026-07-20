import React, { useState, useMemo } from "react";
import { FinanceTransaction, Abonnement } from "../types";
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
  const normTx = rawCat.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

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
    subscriptions: "Logiciels & SaaS",
    abonnement: "Logiciels & SaaS",
    abonnements: "Logiciels & SaaS",
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
  const [chartType, setChartType] = useState<"donut" | "bar">("donut");
  
  // Find all unique months available in transactions
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    // Default fallback months
    monthsSet.add("2026-07");
    monthsSet.add("2026-06");
    monthsSet.add("2026-05");
    
    transactions.forEach(t => {
      if (t.date && t.date.length >= 7) {
        monthsSet.add(t.date.substring(0, 7));
      }
    });

    return Array.from(monthsSet).sort().reverse();
  }, [transactions]);

  // Selected month state
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    return availableMonths[0] || "2026-07";
  });

  // Calculate statistics for the selected month
  const analysisData = useMemo(() => {
    const defaultBaselines: { [key: string]: { revenue: number; expense: number } } = {
      "2026-07": { revenue: 37700, expense: 4420 },
      "2026-06": { revenue: 29500, expense: 22800 },
      "2026-05": { revenue: 31000, expense: 21000 },
      "2026-04": { revenue: 26200, expense: 15400 },
      "2026-03": { revenue: 28000, expense: 19500 },
      "2026-02": { revenue: 24500, expense: 16800 }
    };

    let totalExpense = 0;
    const categoryExpenses: { [cat: string]: number } = {};

    const activeSubCost = abonnements
      .filter(a => a.status === "Actif")
      .reduce((sum, a) => sum + (a.billingPeriod === "Mensuel" ? a.costMonthly : a.costMonthly / 12), 0);

    const monthTransactions = transactions.filter(
      t => t.type === "Dépense" && t.date && t.date.startsWith(selectedMonth)
    );

    if (monthTransactions.length > 0) {
      monthTransactions.forEach(t => {
        const amt = t.amount || 0;
        const rawCat = t.category || "Autre";
        const cat = normalizeCategory(rawCat);
        categoryExpenses[cat] = (categoryExpenses[cat] || 0) + amt;
        totalExpense += amt;
      });
    } else {
      // Fallback to baseline default expenses if no real transactions are present
      const baseline = defaultBaselines[selectedMonth] || { revenue: 25000, expense: 18000 };
      const simulatedExpense = baseline.expense;
      totalExpense = simulatedExpense;
      
      categoryExpenses["Logement & Serveurs"] = simulatedExpense * 0.4;
      categoryExpenses["Équipement"] = simulatedExpense * 0.3;
      categoryExpenses["Marketing & Loisirs"] = simulatedExpense * 0.3;
    }

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
  }, [selectedMonth, transactions, abonnements]);

  const formatMonthLabel = (monthStr: string) => {
    const [year, month] = monthStr.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    const label = date.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });
    return label.charAt(0).toUpperCase() + label.slice(1);
  };

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
          {/* Month Dropdown */}
          <div className="flex items-center gap-1.5 bg-neutral-50 dark:bg-zinc-950/60 border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 rounded-xl text-xs font-bold text-neutral-700 dark:text-neutral-300">
            <Calendar className="w-3.5 h-3.5 text-neutral-400" />
            <div className="relative">
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="appearance-none bg-transparent pr-6 focus:outline-none cursor-pointer"
              >
                {availableMonths.map(m => (
                  <option key={m} value={m} className="dark:bg-zinc-900">
                    {formatMonthLabel(m)}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-neutral-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Toggle Donut / Bar Chart */}
          <div className="flex bg-neutral-100 dark:bg-zinc-950 p-1 rounded-xl border border-neutral-200/50 dark:border-neutral-800/80">
            <button
              onClick={() => setChartType("donut")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                chartType === "donut"
                  ? "bg-white dark:bg-zinc-900 text-neutral-950 dark:text-neutral-50 shadow-3xs"
                  : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              }`}
              title="Graphique en anneau"
            >
              <PieIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setChartType("bar")}
              className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                chartType === "bar"
                  ? "bg-white dark:bg-zinc-900 text-neutral-950 dark:text-neutral-50 shadow-3xs"
                  : "text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              }`}
              title="Graphique en barres"
            >
              <BarChart3 className="w-3.5 h-3.5" />
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
          ) : chartType === "donut" ? (
            <div className="relative w-full h-[200px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={analysisData.categories}
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={78}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {analysisData.categories.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} 
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Central Totals Label */}
              <div className="absolute flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[8px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider">Total Dépenses</span>
                <span className="text-sm font-black font-mono text-neutral-900 dark:text-neutral-50 leading-none py-0.5">
                  {analysisData.totalExpense.toLocaleString("fr-FR")}
                </span>
                <span className="text-[8px] text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider">MAD</span>
              </div>
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
              Répartition par Poste de Coût
            </span>
            <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-mono font-bold">
              {analysisData.categories.length} catégories actives
            </span>
          </div>

          <div className="space-y-2.5 max-h-[200px] overflow-y-auto pr-1 scrollbar-thin">
            {analysisData.categories.map((cat, index) => {
              const maxVal = analysisData.topCategory.value || 1;
              const ratio = (cat.value / maxVal) * 100;
              const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

              return (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span 
                        className="w-2.5 h-2.5 rounded-xs shrink-0" 
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-neutral-700 dark:text-neutral-300 font-semibold truncate">
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

    </div>
  );
}
