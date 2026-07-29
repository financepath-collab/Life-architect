import React, { useState, useMemo } from "react";
import CategoryDetailModal from "./CategoryDetailModal";
import { motion } from "motion/react";
import { 
  ResponsiveContainer, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip 
} from "recharts";
import { 
  Plus, 
  Search, 
  ArrowUpDown, 
  Trash2, 
  Edit2, 
  Download, 
  Upload, 
  X, 
  Check, 
  Sparkles, 
  ChevronDown,
  Filter,
  Star,
  FileSpreadsheet,
  AlertCircle,
  PieChart,
  ExternalLink,
  ArrowLeftRight,
  Maximize2,
  Minimize2,
  Rows,
  Calculator,
  Hourglass,
  PiggyBank,
  Coins,
  Target,
  Clock,
  Sliders,
  Zap,
  TrendingUp,
  Calendar,
  ShieldCheck
} from "lucide-react";
import DateRangeSelector, { DateRange } from "./DateRangeSelector";
import { autoCategorizeTransaction, bulkAutoCategorizeTransactions } from "../utils/transactionCategorizer";

export interface TableColumn {
  key: string;
  label: string;
  type: "text" | "number" | "boolean" | "date" | "select" | "rating" | "progress";
  options?: string[]; // For select type
  required?: boolean;
}

interface InteractiveModuleTableProps {
  title: string;
  description: string;
  columns: TableColumn[];
  data: any[];
  onAdd: (item: any) => void;
  onEdit: (id: string, updatedFields: any) => void;
  onDelete: (id: string) => void;
  onImport: (items: any[]) => void;
  placeholderText?: string;
  currencySymbol?: string; // e.g. "MAD"
  onTransfer?: (item: any) => void;
  transferLabel?: string;
  salaires?: any[];
  transactions?: any[];
  abonnements?: any[];
}

export default function InteractiveModuleTable({
  title,
  description,
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  onImport,
  placeholderText = "Rechercher...",
  currencySymbol = "MAD",
  onTransfer,
  transferLabel,
  salaires = [],
  transactions = [],
  abonnements = []
}: InteractiveModuleTableProps) {
  // State variables
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilters, setActiveFilters] = useState<{ [key: string]: string }>({});
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [showPieChart, setShowPieChart] = useState(true);
  const [modalCategory, setModalCategory] = useState<string | null>(null);
  const [isCompactView, setIsCompactView] = useState<boolean>(() => {
    return localStorage.getItem("la_table_compact") === "true";
  });

  const toggleCompactView = () => {
    setIsCompactView(prev => {
      const next = !prev;
      localStorage.setItem("la_table_compact", next ? "true" : "false");
      return next;
    });
  };

  // Date Range Selector State
  const [dateRange, setDateRange] = useState<DateRange>({
    preset: "all",
    startDate: "",
    endDate: ""
  });

  // History / Period filter states
  const [historyMode, setHistoryMode] = useState<"all" | "monthly" | "yearly">("all");
  const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(() => new Date().getMonth() + 1);
  
  // Dialog / form state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formState, setFormState] = useState<{ [key: string]: any }>({});
  
  // Delete confirmation state
  const [itemToDelete, setItemToDelete] = useState<any | null>(null);
  
  // Excel / CSV Import modal state
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [csvInput, setCsvInput] = useState("");
  const [importError, setImportError] = useState("");

  // Simulation states for Achats Coûteux Calculator
  const [simAllocationPct, setSimAllocationPct] = useState<number>(30); // 30% default allocation
  const [simSelectedItemId, setSimSelectedItemId] = useState<string>("custom");
  const [simCustomAmount, setSimCustomAmount] = useState<number>(15000);

  // Populate form with default empty values when adding
  const openAddModal = () => {
    const initialForm: { [key: string]: any } = {};
    columns.forEach(col => {
      if (col.type === "number") initialForm[col.key] = 0;
      else if (col.type === "boolean") initialForm[col.key] = false;
      else if (col.type === "select") initialForm[col.key] = col.options?.[0] || "";
      else if (col.type === "rating") initialForm[col.key] = 3;
      else if (col.type === "date") initialForm[col.key] = new Date().toISOString().split("T")[0];
      else initialForm[col.key] = "";
    });
    setFormState(initialForm);
    setIsAddOpen(true);
  };

  // Populate form with existing values when editing
  const openEditModal = (item: any) => {
    setEditingItem(item);
    setFormState({ ...item });
  };

  // Handle standard input changes with real-time auto-categorization
  const handleInputChange = (key: string, value: any) => {
    setFormState(prev => {
      const updated = { ...prev, [key]: value };

      if (key === "description" && typeof value === "string" && value.trim().length >= 2) {
        const categoryCol = columns.find(c => c.key === "category");
        if (categoryCol) {
          const autoRes = autoCategorizeTransaction(value, updated.type, updated.category, categoryCol.options);
          if (autoRes.isSuggested && autoRes.category) {
            updated.category = autoRes.category;
            updated._autoCategoryMatched = autoRes.matchedKeyword;
          }
        }
      }
      return updated;
    });
  };

  // Form Submit (Add or Edit)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalForm = { ...formState };
    const categoryCol = columns.find(c => c.key === "category");
    if (categoryCol && finalForm.description) {
      const autoRes = autoCategorizeTransaction(finalForm.description, finalForm.type, finalForm.category, categoryCol.options);
      if (autoRes.category) {
        finalForm.category = autoRes.category;
      }
    }
    delete finalForm._autoCategoryMatched;

    if (editingItem) {
      onEdit(editingItem.id, finalForm);
      setEditingItem(null);
    } else {
      const newItem = {
        id: "gen_" + Date.now() + Math.random().toString(36).substr(2, 5),
        ...finalForm
      };
      onAdd(newItem);
      setIsAddOpen(false);
    }
    setFormState({});
  };

  // Bulk Auto Categorization handler for existing data
  const handleBulkAutoCategorize = () => {
    const categoryCol = columns.find(c => c.key === "category");
    const options = categoryCol?.options || [];
    const { updatedTransactions, updatedCount } = bulkAutoCategorizeTransactions(data, options);
    if (updatedCount > 0) {
      updatedTransactions.forEach(item => {
        const original = data.find(d => d.id === item.id);
        if (original && original.category !== item.category) {
          onEdit(item.id, item);
        }
      });
      alert(`🪄 ${updatedCount} transaction(s) ont été analysées et catégorisées avec succès !`);
    } else {
      alert("✨ Toutes vos transactions avec description ont déjà une catégorie appropriée !");
    }
  };

  // Sorting Handler
  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Filter Handler
  const handleFilterChange = (key: string, value: string) => {
    setActiveFilters(prev => {
      const updated = { ...prev };
      if (value === "ALL" || !value) {
        delete updated[key];
      } else {
        updated[key] = value;
      }
      return updated;
    });
  };

  // Extract unique options for any dropdown column to display in table filter header
  const filterOptions = useMemo(() => {
    const options: { [key: string]: string[] } = {};
    columns.forEach(col => {
      if (col.type === "select" && col.options) {
        options[col.key] = col.options;
      } else if (col.type === "boolean") {
        options[col.key] = ["Vrai", "Faux"];
      }
    });
    return options;
  }, [columns]);

  // Auto-detect date column for filtering
  const dateColumn = useMemo(() => {
    const explicitDateCol = columns.find(col => col.type === "date");
    if (explicitDateCol) return explicitDateCol;

    const keywords = ["date", "duedate", "deadline", "nextbillingdate", "targetdate", "lastupdated", "purchasedate", "createdat"];
    const keywordCol = columns.find(col => keywords.includes(col.key.toLowerCase()));
    if (keywordCol) return keywordCol;

    return null;
  }, [columns]);

  // Search, Filter, and Sort data
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Apply Search Filter
    if (searchTerm.trim() !== "") {
      const lowerSearch = searchTerm.toLowerCase();
      result = result.filter(item => {
        return columns.some(col => {
          const val = item[col.key];
          if (val === undefined || val === null) return false;
          return String(val).toLowerCase().includes(lowerSearch);
        });
      });
    }

    // 2. Apply Custom Select Filters
    Object.keys(activeFilters).forEach(key => {
      const filterVal = activeFilters[key];
      const column = columns.find(c => c.key === key);
      if (!column) return;

      if (column.type === "boolean") {
        const boolVal = filterVal === "Vrai";
        result = result.filter(item => item[key] === boolVal);
      } else {
        result = result.filter(item => String(item[key]) === filterVal);
      }
    });

    // 2.5 Apply Date Range Filter if active
    if (dateRange.startDate || dateRange.endDate) {
      const targetKey = dateColumn ? dateColumn.key : "date";
      result = result.filter(item => {
        const rawVal = item[targetKey] ?? item["date"] ?? item["dueDate"] ?? item["deadline"] ?? item["lastUpdated"] ?? item["nextBillingDate"] ?? item["targetDate"];
        if (!rawVal) return false;

        let normDate = "";
        const strVal = String(rawVal).trim();
        if (/^\d{4}-\d{2}-\d{2}/.test(strVal)) {
          normDate = strVal.substring(0, 10);
        } else {
          const parts = strVal.split(/[/.-]/);
          if (parts.length === 3) {
            if (parts[0].length === 4) {
              normDate = `${parts[0]}-${parts[1].padStart(2, "0")}-${parts[2].padStart(2, "0")}`;
            } else if (parts[2].length === 4) {
              normDate = `${parts[2]}-${parts[1].padStart(2, "0")}-${parts[0].padStart(2, "0")}`;
            }
          }
          if (!normDate) {
            const parsed = new Date(rawVal);
            if (!isNaN(parsed.getTime())) {
              normDate = parsed.toISOString().split("T")[0];
            }
          }
        }

        if (!normDate) return false;

        if (dateRange.startDate && normDate < dateRange.startDate) return false;
        if (dateRange.endDate && normDate > dateRange.endDate) return false;
        return true;
      });
    }

    // 2.6 Legacy History Filter (Monthly / Yearly) fallback
    if (historyMode !== "all" && columns.some(col => col.key === "date") && !dateRange.startDate && !dateRange.endDate) {
      result = result.filter(item => {
        const itemDate = item["date"];
        if (!itemDate) return false;
        
        const parts = String(itemDate).split("-");
        if (parts.length >= 2) {
          const year = Number(parts[0]);
          const month = Number(parts[1]);
          
          if (historyMode === "yearly") {
            return year === selectedYear;
          } else if (historyMode === "monthly") {
            return year === selectedYear && month === selectedMonth;
          }
        }
        return true;
      });
    }

    // 3. Apply Sorting
    if (sortConfig) {
      const { key, direction } = sortConfig;
      const column = columns.find(c => c.key === key);
      
      result.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];

        if (valA === undefined || valA === null) return direction === "asc" ? 1 : -1;
        if (valB === undefined || valB === null) return direction === "asc" ? -1 : 1;

        if (column?.type === "number") {
          return direction === "asc" ? Number(valA) - Number(valB) : Number(valB) - Number(valA);
        }
        
        if (column?.type === "date") {
          const timeA = valA ? new Date(valA).getTime() : 0;
          const timeB = valB ? new Date(valB).getTime() : 0;
          if (!isNaN(timeA) && !isNaN(timeB) && timeA !== 0 && timeB !== 0) {
            return direction === "asc" ? timeA - timeB : timeB - timeA;
          }
          return direction === "asc"
            ? String(valA).localeCompare(String(valB), "fr", { numeric: true })
            : String(valB).localeCompare(String(valA), "fr", { numeric: true });
        }

        if (column?.type === "boolean") {
          const numA = valA ? 1 : 0;
          const numB = valB ? 1 : 0;
          return direction === "asc" ? numA - numB : numB - numA;
        }
        
        return direction === "asc"
          ? String(valA).localeCompare(String(valB), "fr", { numeric: true })
          : String(valB).localeCompare(String(valA), "fr", { numeric: true });
      });
    }

    return result;
  }, [data, searchTerm, activeFilters, sortConfig, columns, historyMode, selectedYear, selectedMonth, dateRange, dateColumn]);

  // Calcule les dépenses les plus élevées du mois courant (uniquement pour les Transactions Réelles)
  const currentMonthExpensesData = useMemo(() => {
    if (title !== "Transactions Réelles") return { top3: [], total: 0 };

    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth() + 1; // 1-12

    let total = 0;
    const categoryTotals: { [category: string]: number } = {};

    data.forEach(item => {
      if (!item) return;
      const typeStr = String(item.type || "").trim().toLowerCase();
      const isExpense = typeStr === "dépense" || typeStr === "depense" || typeStr.includes("dépense") || typeStr.includes("depense");
      if (!isExpense) return;

      const dateStr = String(item.date || "");
      const parts = dateStr.split("-");
      const isCurrentMonth = parts.length >= 2 &&
                             Number(parts[0]) === curYear &&
                             Number(parts[1]) === curMonth;

      if (isCurrentMonth) {
        const amt = Number(item.amount) || 0;
        total += amt;
        const cat = String(item.category || "Autres").trim();
        categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
      }
    });

    const top3 = Object.entries(categoryTotals)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 3);

    return { top3, total };
  }, [data, title]);

  // Simulation & Allocation Mensuelle pour la section Achats Coûteux (prise en compte dynamique des revenus et charges du mois)
  const achatsCouteuxAllocation = useMemo(() => {
    const isAchatCouteuxModule = title.toLowerCase().includes("achats coûteux") || title.toLowerCase().includes("achats couteux");
    if (!isAchatCouteuxModule) return null;

    const now = new Date();
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

    // 1. Calcul des Revenus Mensuels réels
    let salairesAmount = 0;
    if (salaires && salaires.length > 0) {
      const salMonth = salaires.filter((s: any) => s.date && s.date.startsWith(currentMonthKey));
      if (salMonth.length > 0) {
        salairesAmount = salMonth.reduce((acc: number, s: any) => acc + Number(s.netAmount || s.amount || 0), 0);
      } else {
        salairesAmount = salaires.reduce((acc: number, s: any) => acc + Number(s.netAmount || s.amount || 0), 0);
      }
    }

    let txRevenues = 0;
    if (transactions && transactions.length > 0) {
      txRevenues = transactions
        .filter((t: any) => t.type === "Revenue" && t.date && t.date.startsWith(currentMonthKey))
        .reduce((acc: number, t: any) => acc + Number(t.amount || 0), 0);
    }
    const totalRevenues = salairesAmount + txRevenues;

    // 2. Calcul des Charges Mensuelles réelles (Abonnements + Charges/Dépenses du mois)
    let totalAbonnements = 0;
    if (abonnements && abonnements.length > 0) {
      totalAbonnements = abonnements
        .filter((a: any) => a.status === "Actif" || !a.status)
        .reduce((acc: number, a: any) => acc + Number(a.costMonthly || a.amount || 0), 0);
    }

    let txExpenses = 0;
    if (transactions && transactions.length > 0) {
      txExpenses = transactions
        .filter((t: any) => t.type === "Dépense" && t.date && t.date.startsWith(currentMonthKey))
        .reduce((acc: number, t: any) => acc + Number(t.amount || 0), 0);
    }

    let totalExpenses = totalAbonnements + txExpenses;
    if (totalExpenses === 0) totalExpenses = 4420;

    // 3. Capacité d'épargne nette du mois (Revenus - Charges)
    const netCapacity = totalRevenues - totalExpenses;

    let totalBudget = 0;
    let totalMonthlyRequired = 0;

    const items = data.map((item: any) => {
      if (!item) return null;
      const price = Number(item.estimatedPrice || item.targetAmount || item.amount || 0);
      const targetDateStr = item.targetDate || item.deadline || "";
      const status = item.status || "Planifié";

      let monthsRemaining = 1;
      let diffDays = 30;
      let timeText = "Échéance non définie";

      if (targetDateStr) {
        const dDate = new Date(targetDateStr);
        if (!isNaN(dDate.getTime())) {
          const diffMs = dDate.getTime() - now.getTime();
          diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
          if (diffDays <= 0) {
            monthsRemaining = 0.5;
            timeText = "Ce mois-ci / Échéance proche";
          } else {
            monthsRemaining = Math.max(0.5, diffDays / 30.4375);
            const mInt = Math.floor(diffDays / 30.4375);
            if (mInt >= 12) {
              const yrs = Math.floor(mInt / 12);
              const remM = mInt % 12;
              timeText = `${yrs} an${yrs > 1 ? "s" : ""}${remM > 0 ? ` et ${remM} mois` : ""}`;
            } else if (mInt > 0) {
              timeText = `${mInt} mois (${diffDays}j)`;
            } else {
              timeText = `${diffDays} jour${diffDays > 1 ? "s" : ""}`;
            }
          }
        }
      }

      const monthlyAllocation = status === "Acheté" ? 0 : Math.round(price / Math.max(0.5, monthsRemaining));
      if (status !== "Acheté") {
        totalBudget += price;
        totalMonthlyRequired += monthlyAllocation;
      }

      return {
        ...item,
        price,
        monthsRemaining,
        timeText,
        monthlyAllocation,
        status
      };
    }).filter(Boolean);

    // Reste à vivre d'épargne libre après provision des achats coûteux
    const resteAVivre = netCapacity - totalMonthlyRequired;
    const isSustainable = resteAVivre >= 0;
    const impactOnIncomePct = totalRevenues > 0 ? Math.round((totalMonthlyRequired / totalRevenues) * 100) : 0;

    // Calculs du Calculateur d'Échéance & Allocation Optimale
    let selectedSimPrice = simCustomAmount;
    if (simSelectedItemId !== "custom") {
      const matched = items.find((i: any) => (i.id && String(i.id) === String(simSelectedItemId)) || (i.itemName && i.itemName === simSelectedItemId));
      if (matched) {
        selectedSimPrice = matched.price;
      }
    }

    const simMonthlyAllocation = Math.max(100, Math.round(netCapacity * (simAllocationPct / 100)));
    const simMonthsNeeded = Math.max(1, Math.ceil(selectedSimPrice / Math.max(1, simMonthlyAllocation)));

    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + simMonthsNeeded);
    const simEstimatedDateText = targetDate.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

    const profiles = [
      {
        id: "prudent",
        label: "Prudent (15%)",
        pct: 15,
        monthly: Math.round(netCapacity * 0.15),
        months: Math.max(1, Math.ceil(selectedSimPrice / Math.max(1, netCapacity * 0.15)))
      },
      {
        id: "equilibre",
        label: "Équilibré (30%)",
        pct: 30,
        monthly: Math.round(netCapacity * 0.30),
        months: Math.max(1, Math.ceil(selectedSimPrice / Math.max(1, netCapacity * 0.30)))
      },
      {
        id: "accelere",
        label: "Accéléré (50%)",
        pct: 50,
        monthly: Math.round(netCapacity * 0.50),
        months: Math.max(1, Math.ceil(selectedSimPrice / Math.max(1, netCapacity * 0.50)))
      },
      {
        id: "intensif",
        label: "Intensif (80%)",
        pct: 80,
        monthly: Math.round(netCapacity * 0.80),
        months: Math.max(1, Math.ceil(selectedSimPrice / Math.max(1, netCapacity * 0.80)))
      }
    ];

    return {
      items,
      totalBudget,
      totalMonthlyRequired,
      activeCount: items.filter((i: any) => i.status !== "Acheté").length,
      totalRevenues,
      totalExpenses,
      netCapacity,
      resteAVivre,
      isSustainable,
      impactOnIncomePct,
      selectedSimPrice,
      simMonthlyAllocation,
      simMonthsNeeded,
      simEstimatedDateText,
      profiles
    };
  }, [data, title, salaires, transactions, abonnements, simAllocationPct, simSelectedItemId, simCustomAmount]);

  // Real-time Category Breakdown calculation for Pie Chart
  const categoryPieData = useMemo(() => {
    if (!processedData || processedData.length === 0) return { items: [], total: 0, unit: currencySymbol, chartTitle: "Répartition des Données" };

    const firstItem = processedData[0];
    if (!firstItem) return { items: [], total: 0, unit: currencySymbol, chartTitle: "Répartition des Données" };

    // Find numerical key (spentAmount, spent, amount, montant, limitAmount, costMonthly, subscriberCount, etc.)
    const possibleNumKeys = ["subscriberCount", "subscribers", "spentAmount", "spent", "amount", "montant", "costMonthly", "limitAmount", "cost", "price", "prix", "balance"];
    let numKey = possibleNumKeys.find(k => k in firstItem);
    if (!numKey) {
      const numCol = columns.find(c => c.type === "number");
      if (numCol) numKey = numCol.key;
    }

    // Determine unit and title based on numKey or title
    let unit = currencySymbol;
    let chartTitle = "Répartition par Catégorie";

    if (numKey === "subscriberCount" || numKey === "subscribers" || title.toLowerCase().includes("canal") || title.toLowerCase().includes("médias") || title.toLowerCase().includes("media")) {
      unit = "Abonnés";
      chartTitle = "Répartition de l'Audience par Canal";
    } else if (title.toLowerCase().includes("budget") || title.toLowerCase().includes("dépense") || title.toLowerCase().includes("achat") || title.toLowerCase().includes("compte") || title.toLowerCase().includes("financ")) {
      unit = currencySymbol;
      chartTitle = "Répartition des Dépenses par Catégorie";
    }

    // Find category key
    const possibleCatKeys = ["category", "categorie", "catégorie", "serviceName", "itemName", "source", "name", "type", "description"];
    let catKey = possibleCatKeys.find(k => k in firstItem);
    if (!catKey) {
      const textCol = columns.find(c => c.type === "text" || c.type === "select");
      if (textCol) catKey = textCol.key;
    }

    if (!numKey || !catKey) return { items: [], total: 0, unit, chartTitle };

    const categoryTotals: { [key: string]: number } = {};
    let totalAmount = 0;

    processedData.forEach(item => {
      if (!item) return;

      // Filter out pure Revenue if type field exists
      const typeVal = String(item.type || "").toLowerCase();
      if (typeVal && (typeVal.includes("revenu") || typeVal.includes("revenue")) && !typeVal.includes("dépense") && !typeVal.includes("depense")) {
        return;
      }

      const catVal = String(item[catKey] || "Autres").trim() || "Autres";
      const amtVal = Math.abs(Number(item[numKey]) || 0);

      if (amtVal > 0) {
        categoryTotals[catVal] = (categoryTotals[catVal] || 0) + amtVal;
        totalAmount += amtVal;
      }
    });

    const PALETTE = [
      "#6366f1", "#10b981", "#f59e0b", "#f43f5e", 
      "#8b5cf6", "#06b6d4", "#ec4899", "#3b82f6", 
      "#14b8a6", "#f97316", "#84cc16", "#a855f7"
    ];

    const sortedCategories = Object.entries(categoryTotals)
      .map(([name, value], idx) => ({
        name,
        value,
        percentage: totalAmount > 0 ? Number(((value / totalAmount) * 100).toFixed(1)) : 0,
        fill: PALETTE[idx % PALETTE.length]
      }))
      .sort((a, b) => b.value - a.value);

    return { items: sortedCategories, total: totalAmount };
  }, [processedData, columns]);

  // Animation key for smooth fade-in transition when date range, category or search filters change
  const filterAnimationKey = useMemo(() => {
    return `${dateRange.preset}_${dateRange.startDate}_${dateRange.endDate}_${JSON.stringify(activeFilters)}_${searchTerm}_${historyMode}_${selectedYear}_${selectedMonth}`;
  }, [dateRange, activeFilters, searchTerm, historyMode, selectedYear, selectedMonth]);

  // Export to CSV masquerading as Excel
  const handleExportCSV = () => {
    if (processedData.length === 0) return;
    
    const headers = columns.map(col => `"${col.label.replace(/"/g, '""')}"`).join(",");
    const rows = processedData.map(item => {
      return columns.map(col => {
        let val = item[col.key];
        if (val === undefined || val === null) return '""';
        if (col.type === "boolean") return val ? '"Oui"' : '"Non"';
        return `"${String(val).replace(/"/g, '""')}"`;
      }).join(",");
    });
    
    const csvContent = "\uFEFF" + [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${title.toLowerCase().replace(/\s+/g, "_")}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Import from Excel/CSV Handler
  const handleImportCSVSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvInput.trim()) {
      setImportError("Le contenu CSV est vide.");
      return;
    }

    try {
      const lines = csvInput.trim().split("\n");
      if (lines.length < 2) {
        setImportError("Format invalide. Il doit y avoir au moins une ligne d'en-tête et une ligne de données.");
        return;
      }

      const headers = lines[0].split(",").map(h => h.replace(/^["']|["']$/g, "").trim().toLowerCase());
      const parsedItems: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const cells = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(c => c.replace(/^["']|["']$/g, "").trim());
        const newItem: any = {
          id: "imp_" + Date.now() + "_" + i + Math.random().toString(36).substr(2, 3)
        };

        columns.forEach(col => {
          const targetIndex = headers.findIndex(h => h === col.label.toLowerCase() || h === col.key.toLowerCase());
          
          if (targetIndex !== -1 && cells[targetIndex] !== undefined) {
            let rawVal = cells[targetIndex];
            if (col.type === "number") {
              newItem[col.key] = Number(rawVal) || 0;
            } else if (col.type === "boolean") {
              newItem[col.key] = ["vrai", "oui", "true", "1", "yes"].includes(rawVal.toLowerCase());
            } else if (col.type === "rating") {
              newItem[col.key] = Math.min(5, Math.max(1, Number(rawVal) || 3));
            } else {
              newItem[col.key] = rawVal;
            }
          } else {
            if (col.type === "number") newItem[col.key] = 0;
            else if (col.type === "boolean") newItem[col.key] = false;
            else if (col.type === "rating") newItem[col.key] = 3;
            else newItem[col.key] = "";
          }
        });

        parsedItems.push(newItem);
      }

      if (parsedItems.length === 0) {
        setImportError("Aucune ligne de données valide trouvée.");
        return;
      }

      onImport(parsedItems);
      setIsImportOpen(false);
      setCsvInput("");
      setImportError("");
    } catch (err: any) {
      setImportError("Erreur de parsing: " + err.message);
    }
  };

  const handleLoadSampleCSV = () => {
    const headerRow = columns.map(col => `"${col.label}"`).join(",");
    const sampleRows = [
      columns.map(col => {
        if (col.type === "number") return "1200";
        if (col.type === "boolean") return "Oui";
        if (col.type === "date") return "2026-07-12";
        if (col.type === "select") return col.options?.[0] || "Standard";
        if (col.type === "rating") return "4";
        return `Exemple ${col.label} 1`;
      }).join(","),
      columns.map(col => {
        if (col.type === "number") return "350";
        if (col.type === "boolean") return "Non";
        if (col.type === "date") return "2026-07-13";
        if (col.type === "select") return col.options?.[1] || col.options?.[0] || "Standard";
        if (col.type === "rating") return "5";
        return `Exemple ${col.label} 2`;
      }).join(",")
    ];

    setCsvInput([headerRow, ...sampleRows].join("\n"));
  };

  return (
    <div className="bg-white border border-neutral-200/80 rounded-2xl p-6 shadow-xs space-y-6 text-neutral-800">
      
      {/* Title & CTAs Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-neutral-900 font-sans tracking-tight flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-neutral-900 rounded-full"></span>
            {title}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">{description}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={toggleCompactView}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer select-none ${
              isCompactView
                ? "bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 text-indigo-700 dark:text-indigo-300 shadow-2xs"
                : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200"
            }`}
            title={isCompactView ? "Désactiver la vue compacte (revenir à l'espacement standard)" : "Activer la vue compacte (réduire l'espacement pour afficher plus d'éléments sur l'écran)"}
          >
            {isCompactView ? (
              <Maximize2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            ) : (
              <Rows className="w-3.5 h-3.5 text-neutral-500" />
            )}
            <span>Vue Compacte</span>
            {isCompactView && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            )}
          </button>

          <button
            onClick={handleExportCSV}
            disabled={processedData.length === 0}
            className="flex items-center gap-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 px-3 py-2 rounded-xl text-xs font-semibold transition-all border border-neutral-200 disabled:opacity-40"
            title="Exporter vers Microsoft Excel / CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exporter</span>
          </button>
          
          <button
            onClick={() => setIsImportOpen(true)}
            className="flex items-center gap-1.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 px-3 py-2 rounded-xl text-xs font-semibold transition-all border border-neutral-200"
            title="Importer à partir d'un fichier CSV / Excel"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Importer</span>
          </button>

          {columns.some(c => c.key === "category") && (
            <button
              onClick={handleBulkAutoCategorize}
              className="flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-3xs"
              title="Analyser automatiquement les descriptions pour attribuer une catégorie aux transactions sans catégorie"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Catégoriser Auto</span>
            </button>
          )}

          {categoryPieData.items.length > 0 && (
            <button
              onClick={() => setShowPieChart(!showPieChart)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                showPieChart 
                  ? "bg-indigo-600 text-white border-indigo-500 shadow-xs" 
                  : "bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200"
              }`}
              title="Afficher ou masquer le Graphique Circulaire de Répartition"
            >
              <PieChart className="w-3.5 h-3.5" />
              <span>Répartition ({categoryPieData.items.length})</span>
            </button>
          )}

          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau</span>
          </button>
        </div>
      </div>

      {/* Graphique Circulaire (Pie Chart) de Répartition en Temps Réel */}
      {categoryPieData.items.length > 0 && showPieChart && (
        <motion.div 
          key={`pie-${filterAnimationKey}`}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-neutral-900 text-white border border-neutral-800 rounded-2xl p-5 shadow-lg space-y-5"
        >
          {/* Header Card */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded-xl shrink-0">
                <PieChart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-white font-mono flex items-center gap-2 flex-wrap">
                  {categoryPieData.chartTitle}
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[10px] normal-case font-mono font-bold">
                    Temps réel
                  </span>
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Visualisation interactive mise à jour automatiquement selon vos filtres ({processedData.length} élément{processedData.length > 1 ? "s" : ""}).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <div className="px-3 py-1.5 bg-neutral-800/90 border border-neutral-700/80 rounded-xl text-xs font-mono font-bold text-neutral-200">
                Total filtré : <span className="text-emerald-400 font-extrabold">{categoryPieData.total.toLocaleString("fr-FR")} {categoryPieData.unit}</span>
              </div>
              <button
                onClick={() => setShowPieChart(false)}
                className="p-1.5 hover:bg-neutral-800 text-neutral-400 hover:text-white rounded-lg transition-all cursor-pointer"
                title="Fermer le graphique"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Grid: Pie Chart (Recharts) + Category Legend Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Recharts Donut Pie Chart Container */}
            <div className="lg:col-span-5 relative h-[250px] w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <RechartsTooltip
                    content={({ active, payload }: any) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-neutral-950 border border-neutral-700/90 rounded-xl p-3 shadow-2xl text-xs space-y-1.5 z-50">
                            <div className="flex items-center gap-2">
                              <span 
                                className="w-3 h-3 rounded-full shrink-0" 
                                style={{ backgroundColor: data.fill }} 
                              />
                              <span className="font-bold text-white text-sm">{data.name}</span>
                            </div>
                            <div className="pt-1.5 border-t border-neutral-800/80 flex items-center justify-between gap-4 font-mono">
                              <span className="text-neutral-400">Total :</span>
                              <span className="font-bold text-emerald-400">
                                {data.value.toLocaleString("fr-FR")} {categoryPieData.unit}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4 font-mono">
                              <span className="text-neutral-400">Part du total :</span>
                              <span className="font-bold text-indigo-300">
                                {data.percentage}%
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Pie
                    data={categoryPieData.items}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={3}
                    cornerRadius={6}
                    onClick={(entry) => setModalCategory(entry.name)}
                    cursor="pointer"
                  >
                    {categoryPieData.items.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.fill} 
                        stroke="#171717"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                </RechartsPieChart>
              </ResponsiveContainer>

              {/* Center Donut Badge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-neutral-400">
                  {categoryPieData.items.length} {categoryPieData.unit === "Abonnés" ? "Canaux" : "Catégories"}
                </span>
                <span className="text-base font-black font-mono text-white mt-0.5">
                  {categoryPieData.total.toLocaleString("fr-FR")}
                </span>
                <span className="text-[10px] font-bold text-emerald-400 font-mono">
                  {categoryPieData.unit}
                </span>
              </div>
            </div>

            {/* Category Breakdown Progress Cards */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[250px] overflow-y-auto custom-scrollbar pr-1">
              {categoryPieData.items.map((cat) => (
                <div 
                  key={cat.name}
                  onClick={() => setModalCategory(cat.name)}
                  title="Cliquez pour afficher les transactions de cette catégorie"
                  className="p-3 bg-neutral-950/80 border border-neutral-800 hover:border-indigo-500/50 rounded-xl space-y-2 cursor-pointer transition-all hover:bg-neutral-900/80"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span 
                        className="w-2.5 h-2.5 rounded-full shrink-0" 
                        style={{ backgroundColor: cat.fill }}
                      />
                      <span className="text-xs font-bold text-neutral-200 truncate" title={cat.name}>
                        {cat.name}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded text-[10px] font-mono font-bold shrink-0">
                      {cat.percentage}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono pt-0.5">
                    <span className="text-neutral-400 text-[11px]">Dépense :</span>
                    <span className="font-bold text-white">
                      {cat.value.toLocaleString("fr-FR")} {currencySymbol}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        width: `${cat.percentage}%`,
                        backgroundColor: cat.fill
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Résumé des dépenses les plus élevées pour le module Transactions */}
      {title === "Transactions Réelles" && (
        <div className="bg-neutral-50/60 border border-neutral-200/60 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="p-2 bg-neutral-950 text-white rounded-xl shadow-3xs">
                <PieChart className="w-4 h-4" />
              </span>
              <div>
                <h3 className="text-xs font-black text-neutral-950 uppercase tracking-tight block">
                  Postes de Dépenses les plus Coûteux (Ce Mois-ci)
                </h3>
                <p className="text-[10px] text-neutral-400 font-medium block">
                  Les 3 catégories de dépenses les plus importantes pour {[
                    "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
                    "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
                  ][new Date().getMonth()]} {new Date().getFullYear()}
                </p>
              </div>
            </div>
            <div className="text-[10px] font-bold text-neutral-500 bg-white border border-neutral-200/60 px-3 py-2 rounded-full shadow-3xs self-start sm:self-center">
              Dépenses mensuelles globales : <span className="font-mono text-neutral-950 font-black">{currentMonthExpensesData.total.toLocaleString("fr-FR")} {currencySymbol}</span>
            </div>
          </div>

          {currentMonthExpensesData.top3.length === 0 ? (
            <div className="text-xs text-neutral-400 italic py-8 text-center bg-white rounded-xl border border-dashed border-neutral-200/80">
              Aucune dépense enregistrée pour le mois courant.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentMonthExpensesData.top3.map((item, index) => {
                const percentage = currentMonthExpensesData.total > 0
                  ? Math.round((item.amount / currentMonthExpensesData.total) * 100)
                  : 0;

                // Color accents depending on ranking
                const rankColors = [
                  { bg: "bg-red-50/60 border-red-100/60", text: "text-red-700", bar: "bg-red-500" },
                  { bg: "bg-amber-50/60 border-amber-100/60", text: "text-amber-700", bar: "bg-amber-500" },
                  { bg: "bg-neutral-50 border-neutral-200/40", text: "text-neutral-700", bar: "bg-neutral-600" }
                ][index] || { bg: "bg-neutral-50 border-neutral-200/40", text: "text-neutral-700", bar: "bg-neutral-500" };

                return (
                  <div 
                    key={item.category} 
                    className="bg-white border border-neutral-200/60 rounded-xl p-4 shadow-3xs flex flex-col justify-between space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest font-mono">
                          #{index + 1}
                        </span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${rankColors.bg} ${rankColors.text} border`}>
                          {percentage}% des dépenses
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-neutral-900 truncate max-w-[120px]" title={item.category}>
                        {item.category}
                      </span>
                    </div>

                    <div>
                      <span className="text-lg font-black font-mono text-neutral-950 tracking-tight">
                        {item.amount.toLocaleString("fr-FR")}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-bold ml-1 font-mono">
                        {currencySymbol}
                      </span>
                    </div>

                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`${rankColors.bar} h-full rounded-full transition-all duration-500`} 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Module Achats Coûteux: Simulateur d'Allocation & Pédagogie de Financement */}
      {achatsCouteuxAllocation && (
        <div className="bg-gradient-to-br from-indigo-950/90 via-neutral-900 to-slate-950 border border-indigo-500/30 rounded-2xl p-5 md:p-6 text-white space-y-5 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-indigo-500/20">
            <div className="flex items-start gap-3">
              <span className="p-3 bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-xl shrink-0">
                <Calculator className="w-6 h-6" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black uppercase tracking-tight text-white">
                    Simulateur d'Allocation Mensuelle & Étanchéité du Budget
                  </h3>
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 rounded-full font-mono">
                    Principe Actif
                  </span>
                </div>
                <p className="text-xs text-neutral-300 mt-1 max-w-2xl leading-relaxed">
                  <strong className="text-indigo-200">Comment la simulation intègre vos revenus & charges ?</strong> Le coût total d'un achat futur (ex. 15 000 MAD dans 5 mois) <span className="underline decoration-indigo-400">n'est pas déduit de vos revenus actuels</span>. L'application calcule la <strong>mensualité à mettre de côté (3 000 MAD/mois)</strong> et vérifie si votre <strong>capacité nette (Revenus - Charges)</strong> permet de la supporter sereinement.
                </p>
              </div>
            </div>

            {/* Total KPIs */}
            <div className="flex items-center gap-3 shrink-0 bg-neutral-950/80 p-3 rounded-xl border border-neutral-800">
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">Coût Total Projets</span>
                <span className="text-sm font-black font-mono text-white">
                  {achatsCouteuxAllocation.totalBudget.toLocaleString("fr-FR")} {currencySymbol}
                </span>
              </div>
              <div className="h-8 w-px bg-neutral-800" />
              <div>
                <span className="text-[10px] uppercase font-mono font-bold text-indigo-400 block">Effort Mensuel Requis</span>
                <span className="text-base font-black font-mono text-emerald-400">
                  +{achatsCouteuxAllocation.totalMonthlyRequired.toLocaleString("fr-FR")} <span className="text-xs font-normal">{currencySymbol}/mois</span>
                </span>
              </div>
            </div>
          </div>

          {/* Tableau de bord d'Équilibre Financier (Revenus, Charges, Capacité Nette, Provision & Reste à Vivre) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 p-3.5 bg-neutral-950/80 rounded-xl border border-neutral-800/80">
            <div className="p-2.5 bg-neutral-900/80 rounded-lg border border-neutral-800">
              <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider block mb-1">
                1. Revenus du Mois
              </span>
              <span className="text-sm md:text-base font-black font-mono text-white">
                +{achatsCouteuxAllocation.totalRevenues.toLocaleString("fr-FR")} <span className="text-[10px] font-normal text-neutral-400">{currencySymbol}</span>
              </span>
            </div>

            <div className="p-2.5 bg-neutral-900/80 rounded-lg border border-neutral-800">
              <span className="text-[10px] font-mono font-bold text-rose-400 uppercase tracking-wider block mb-1">
                2. Charges du Mois
              </span>
              <span className="text-sm md:text-base font-black font-mono text-rose-300">
                -{achatsCouteuxAllocation.totalExpenses.toLocaleString("fr-FR")} <span className="text-[10px] font-normal text-neutral-400">{currencySymbol}</span>
              </span>
            </div>

            <div className="p-2.5 bg-neutral-900/80 rounded-lg border border-neutral-800">
              <span className="text-[10px] font-mono font-bold text-indigo-300 uppercase tracking-wider block mb-1">
                3. Capacité Nette (1 - 2)
              </span>
              <span className="text-sm md:text-base font-black font-mono text-indigo-200">
                ={achatsCouteuxAllocation.netCapacity.toLocaleString("fr-FR")} <span className="text-[10px] font-normal text-neutral-400">{currencySymbol}</span>
              </span>
            </div>

            <div className="p-2.5 bg-neutral-900/80 rounded-lg border border-neutral-800">
              <span className="text-[10px] font-mono font-bold text-amber-300 uppercase tracking-wider block mb-1">
                4. Provision Achats
              </span>
              <span className="text-sm md:text-base font-black font-mono text-amber-300">
                -{achatsCouteuxAllocation.totalMonthlyRequired.toLocaleString("fr-FR")} <span className="text-[10px] font-normal text-neutral-400">{currencySymbol}/m</span>
              </span>
            </div>

            <div className="col-span-2 sm:col-span-1 p-2.5 bg-emerald-950/40 rounded-lg border border-emerald-500/30">
              <span className="text-[10px] font-mono font-bold text-emerald-300 uppercase tracking-wider block mb-1">
                5. Épargne Nette Libre
              </span>
              <span className={`text-sm md:text-base font-black font-mono ${achatsCouteuxAllocation.isSustainable ? "text-emerald-300" : "text-rose-400"}`}>
                ={achatsCouteuxAllocation.resteAVivre.toLocaleString("fr-FR")} <span className="text-[10px] font-normal text-neutral-400">{currencySymbol}/m</span>
              </span>
            </div>
          </div>

          {/* Synthèse de soutenabilité & Conseils d'allocation */}
          <div className={`p-3.5 rounded-xl border text-xs leading-relaxed flex items-center justify-between gap-3 ${
            achatsCouteuxAllocation.isSustainable 
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
              : "bg-rose-500/10 border-rose-500/30 text-rose-200"
          }`}>
            <div className="flex items-center gap-2.5">
              <span className="text-base">
                {achatsCouteuxAllocation.isSustainable ? "🟢" : "🔴"}
              </span>
              <div>
                <strong className="font-bold text-white block mb-0.5">
                  {achatsCouteuxAllocation.isSustainable ? "Simulation Financière Validée & Soutenable" : "Attention : Capacité d'Épargne Dépassée"}
                </strong>
                <span>
                  {achatsCouteuxAllocation.isSustainable ? (
                    <>Vos revenus mensuels de <strong className="text-white">{achatsCouteuxAllocation.totalRevenues.toLocaleString("fr-FR")} {currencySymbol}</strong> couvrent vos charges (<strong className="text-white">{achatsCouteuxAllocation.totalExpenses.toLocaleString("fr-FR")} {currencySymbol}</strong>) et permettent d'allouer <strong className="text-emerald-300">{achatsCouteuxAllocation.totalMonthlyRequired.toLocaleString("fr-FR")} {currencySymbol}/mois</strong> (soit {achatsCouteuxAllocation.impactOnIncomePct}% de vos revenus) à vos projets tout en conservant <strong className="text-emerald-300">{achatsCouteuxAllocation.resteAVivre.toLocaleString("fr-FR")} {currencySymbol}</strong> d'épargne disponible.</>
                  ) : (
                    <>La provision mensuelle requise (<strong className="text-rose-300">{achatsCouteuxAllocation.totalMonthlyRequired.toLocaleString("fr-FR")} {currencySymbol}/mois</strong>) dépasse votre capacité d'épargne disponible (<strong className="text-white">{achatsCouteuxAllocation.netCapacity.toLocaleString("fr-FR")} {currencySymbol}</strong>). Envisagez d'étaler la date d'échéance de vos projets.</>
                  )}
                </span>
              </div>
            </div>

            <span className="hidden md:inline-block px-2.5 py-1 bg-black/40 border border-white/10 rounded-lg font-mono text-[11px] shrink-0 font-bold">
              Impact : {achatsCouteuxAllocation.impactOnIncomePct}% des revenus
            </span>
          </div>

          {/* Calculateur d'Échéance & Allocation Optimale */}
          <div className="p-4 bg-slate-900/90 border border-indigo-500/30 rounded-xl space-y-4 shadow-inner">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-lg">
                  <Clock className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-black uppercase text-white font-mono tracking-wide flex items-center gap-2">
                    Calculateur de Mois Nécessaires & Allocation Optimale
                  </h4>
                  <p className="text-[11px] text-neutral-300">
                    Estimez précisément le temps d'épargne requis selon vos revenus nets ({achatsCouteuxAllocation.totalRevenues.toLocaleString("fr-FR")} {currencySymbol}) et vos charges fixes ({achatsCouteuxAllocation.totalExpenses.toLocaleString("fr-FR")} {currencySymbol}).
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-mono font-bold rounded-lg shrink-0">
                Capacité Nette : {achatsCouteuxAllocation.netCapacity.toLocaleString("fr-FR")} {currencySymbol}/mois
              </span>
            </div>

            {/* Form Inputs for Simulator */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Target Project or Custom Price selection */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-neutral-300 uppercase font-mono block">
                  Projet d'Achat / Montant Cible
                </label>
                <div className="flex gap-2">
                  <select
                    value={simSelectedItemId}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSimSelectedItemId(val);
                      if (val !== "custom") {
                        const matched = achatsCouteuxAllocation.items.find((i: any) => (i.id && String(i.id) === val) || (i.itemName && i.itemName === val));
                        if (matched) setSimCustomAmount(matched.price);
                      }
                    }}
                    className="flex-1 bg-neutral-950 border border-neutral-700 text-white text-xs rounded-lg px-3 py-2 font-mono focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="custom">-- Montant Personnalisé --</option>
                    {achatsCouteuxAllocation.items.map((it: any, i: number) => (
                      <option key={it.id || i} value={it.id || it.itemName}>
                        {it.itemName || `Projet #${i+1}`} ({it.price.toLocaleString("fr-FR")} {currencySymbol})
                      </option>
                    ))}
                  </select>

                  {simSelectedItemId === "custom" && (
                    <div className="relative w-36">
                      <input
                        type="number"
                        min="1"
                        value={simCustomAmount}
                        onChange={(e) => setSimCustomAmount(Math.max(1, Number(e.target.value)))}
                        className="w-full bg-neutral-950 border border-neutral-700 text-white text-xs rounded-lg px-3 py-2 font-mono focus:border-indigo-500 focus:outline-none pr-8"
                        placeholder="Ex: 15000"
                      />
                      <span className="absolute right-2.5 top-2 text-[10px] text-neutral-400 font-mono">
                        {currencySymbol}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Slider for Allocation Percentage */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-neutral-300 uppercase">Allocation Mensuelle ({simAllocationPct}%) :</span>
                  <span className="font-black text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    +{achatsCouteuxAllocation.simMonthlyAllocation.toLocaleString("fr-FR")} {currencySymbol}/mois
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={simAllocationPct}
                  onChange={(e) => setSimAllocationPct(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
                <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
                  <span>Prudent (10%)</span>
                  <span>Recommandé (30%)</span>
                  <span>Accéléré (50%)</span>
                  <span>Max (100%)</span>
                </div>
              </div>
            </div>

            {/* Results Highlight Banner */}
            <div className="bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900 border border-indigo-500/40 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/30 font-black text-lg">
                  🎯
                </span>
                <div>
                  <span className="text-[10px] uppercase font-mono font-bold text-neutral-400 block">
                    Délai Estimé pour {achatsCouteuxAllocation.selectedSimPrice.toLocaleString("fr-FR")} {currencySymbol}
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black font-mono text-emerald-400">
                      {achatsCouteuxAllocation.simMonthsNeeded} Mois
                    </span>
                    <span className="text-xs text-indigo-200 font-medium font-mono">
                      (Concrétisation prévue : <strong className="text-white uppercase">{achatsCouteuxAllocation.simEstimatedDateText}</strong>)
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-300 font-mono text-right hidden sm:block">
                  Effort / Capacité :
                </span>
                <span className="px-3 py-1.5 bg-indigo-950/80 border border-indigo-500/40 rounded-lg text-xs font-mono font-bold text-indigo-200">
                  {Math.round((achatsCouteuxAllocation.simMonthlyAllocation / (achatsCouteuxAllocation.netCapacity || 1)) * 100)}% de votre capacité
                </span>
              </div>
            </div>

            {/* Comparison of 4 Allocation Profiles */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider font-mono block">
                Comparez les profils d'allocation d'épargne optimale :
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {achatsCouteuxAllocation.profiles.map((prof: any) => {
                  const isActive = simAllocationPct === prof.pct;
                  return (
                    <button
                      key={prof.id}
                      onClick={() => setSimAllocationPct(prof.pct)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                        isActive
                          ? "bg-indigo-600/30 border-indigo-400 text-white shadow-md ring-1 ring-indigo-400"
                          : "bg-neutral-950/60 border-neutral-800 text-neutral-300 hover:border-neutral-700"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span className="text-[11px] font-extrabold truncate">{prof.label}</span>
                        {isActive && <Check className="w-3.5 h-3.5 text-indigo-300 shrink-0" />}
                      </div>
                      <div>
                        <div className="text-xs font-mono font-black text-emerald-400">
                          +{prof.monthly.toLocaleString("fr-FR")} {currencySymbol}/m
                        </div>
                        <div className="text-[10px] font-mono text-neutral-400 mt-0.5">
                          Délai : <strong className="text-white">{prof.months} mois</strong>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Detailed item list allocation */}
          {achatsCouteuxAllocation.items.length === 0 ? (
            <div className="text-xs text-neutral-400 italic text-center py-4 bg-neutral-950/40 rounded-xl border border-dashed border-neutral-800">
              Aucun achat coûteux configuré. Ajoutez vos futurs projets pour calculer l'allocation mensuelle recommandée.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-400 uppercase tracking-wider font-mono px-1">
                <span>Décomposition par projet d'achat</span>
                <span>{achatsCouteuxAllocation.activeCount} projet(s) planifié(s)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {achatsCouteuxAllocation.items.map((item: any, idx: number) => {
                  const itemSimMonths = Math.max(1, Math.ceil(item.price / Math.max(1, achatsCouteuxAllocation.simMonthlyAllocation)));
                  return (
                    <div 
                      key={item.id || idx}
                      className="p-4 bg-neutral-950/90 border border-neutral-800/80 hover:border-indigo-500/40 rounded-xl space-y-3 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-xs font-black text-white truncate max-w-[160px]" title={item.itemName}>
                            {item.itemName || "Projet sans nom"}
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full font-mono shrink-0 ${
                            item.status === "Acheté" 
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : item.status === "Économise"
                                ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                          }`}>
                            {item.status}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mt-1">
                          <span>Coût Estimé Total :</span>
                          <span className="font-bold text-white">
                            {item.price.toLocaleString("fr-FR")} {currencySymbol}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs font-mono text-neutral-400 mt-1">
                          <span>Échéance Cible :</span>
                          <span className="text-indigo-300 font-medium">
                            {item.timeText}
                          </span>
                        </div>

                        {/* Délai estimé selon la capacité nette */}
                        {item.status !== "Acheté" && (
                          <div className="p-2 bg-indigo-950/40 border border-indigo-500/20 rounded-lg flex items-center justify-between text-[11px] font-mono mt-2">
                            <span className="text-neutral-300 flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-amber-400" /> Délai Optimal :
                            </span>
                            <span className="font-extrabold text-amber-300">
                              ~{itemSimMonths} mois
                            </span>
                          </div>
                        )}
                      </div>

                      {item.status !== "Acheté" && (
                        <div className="pt-2.5 border-t border-neutral-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] text-neutral-300 font-mono">Allocation Recommandée :</span>
                            <span className="text-xs font-extrabold font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              {item.monthlyAllocation.toLocaleString("fr-FR")} {currencySymbol}/mois
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            <button
                              onClick={() => {
                                setSimSelectedItemId(String(item.id || item.itemName));
                                setSimCustomAmount(item.price);
                              }}
                              className="py-1.5 px-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 rounded-lg text-[10px] font-bold font-mono transition-all flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Sliders className="w-3 h-3 text-indigo-400" />
                              <span>Simuler</span>
                            </button>

                            {onTransfer && (
                              <button
                                onClick={() => onTransfer(item)}
                                className="py-1.5 px-2 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 rounded-lg text-[10px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer truncate"
                              >
                                <PiggyBank className="w-3 h-3 text-indigo-300 shrink-0" />
                                <span className="truncate">{transferLabel || "Épargne"}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sélecteur de Plage de Dates au-dessus de la table */}
      <DateRangeSelector
        value={dateRange}
        onChange={setDateRange}
        totalItemsCount={data.length}
        filteredItemsCount={processedData.length}
        dateColumnLabel={dateColumn?.label || "Date"}
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={placeholderText}
            className="w-full bg-neutral-50/50 border border-neutral-200 rounded-xl pl-10 pr-10 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white transition-all"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-3 text-neutral-400 hover:text-neutral-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Column Specific Dropdown Filters */}
        {columns.filter(col => col.type === "select" || col.type === "boolean").slice(0, 3).map(col => {
          const selected = activeFilters[col.key] || "";
          const options = filterOptions[col.key] || [];

          return (
            <div key={col.key} className="relative shrink-0">
              <select
                value={selected}
                onChange={(e) => handleFilterChange(col.key, e.target.value)}
                className="appearance-none bg-neutral-50 border border-neutral-200 text-neutral-700 pl-3.5 pr-8 py-2.5 text-xs rounded-xl focus:outline-none focus:border-neutral-900 focus:bg-white font-medium cursor-pointer transition-all"
              >
                <option value="">{col.label}</option>
                {options.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-3 pointer-events-none" />
            </div>
          );
        })}

        {Object.keys(activeFilters).length > 0 && (
          <button
            onClick={() => setActiveFilters({})}
            className="text-xs text-neutral-900 hover:text-neutral-700 font-bold px-2 py-1.5 flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            <span>Réinitialiser</span>
          </button>
        )}
      </div>

      {/* Quick Column Sorting Bar (Date, Amount, Category) */}
      {columns.some(col => ["date", "amount", "category"].includes(col.key)) && (
        <div className="flex flex-wrap items-center gap-2 px-1 py-0.5 bg-neutral-50/40 rounded-xl border border-neutral-200/50 p-2.5">
          <div className="flex items-center gap-1.5 mr-1">
            <span className="p-1 bg-neutral-900 text-white rounded-md">
              <ArrowUpDown className="w-3 h-3" />
            </span>
            <span className="text-[10px] text-neutral-500 font-black uppercase tracking-wider">Trier par colonne :</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {columns
              .filter(col => ["date", "amount", "category"].includes(col.key))
              .map(col => {
                const isSorted = sortConfig?.key === col.key;
                const direction = isSorted ? sortConfig.direction : null;
                return (
                  <button
                    key={col.key}
                    type="button"
                    onClick={() => handleSort(col.key)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1.5 border cursor-pointer select-none ${
                      isSorted
                        ? "bg-neutral-950 text-white border-neutral-950 shadow-xs"
                        : "bg-white text-neutral-600 border-neutral-200/80 hover:text-neutral-900 hover:border-neutral-300"
                    }`}
                    title={`Trier par ${col.label}`}
                  >
                    <span>{col.label}</span>
                    {isSorted ? (
                      direction === "asc" ? (
                        <span className="text-[9px] font-black font-mono px-1 bg-white/20 rounded-sm">▲ Asc</span>
                      ) : (
                        <span className="text-[9px] font-black font-mono px-1 bg-white/20 rounded-sm">▼ Desc</span>
                      )
                    ) : (
                      <span className="text-[9px] text-neutral-400 font-mono">⇅</span>
                    )}
                  </button>
                );
              })}
            {sortConfig && (
              <button
                type="button"
                onClick={() => setSortConfig(null)}
                className="text-[10px] text-neutral-500 hover:text-red-600 font-black uppercase tracking-wider transition-colors cursor-pointer px-2.5 py-1.5 bg-neutral-100 hover:bg-red-50/50 rounded-lg border border-neutral-200/40"
              >
                Réinitialiser le tri
              </button>
            )}
          </div>
        </div>
      )}

      {/* View 'Historique' for Modules with Date Column (like Transactions) */}
      {columns.some(col => col.key === "date") && (
        <div className="bg-neutral-50/60 border border-neutral-200/60 rounded-2xl p-4 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-neutral-900 text-white rounded-lg">
                <Filter className="w-3.5 h-3.5" />
              </span>
              <div>
                <span className="text-xs font-black text-neutral-950 uppercase tracking-tight block">Vue Historique & Périodes</span>
                <span className="text-[10px] text-neutral-400 font-medium block">Filtrer rapidement les flux par mois ou par année</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl self-start">
              <button
                type="button"
                onClick={() => setHistoryMode("all")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  historyMode === "all"
                    ? "bg-white text-neutral-950 shadow-3xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Tout l'historique
              </button>
              <button
                type="button"
                onClick={() => setHistoryMode("monthly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  historyMode === "monthly"
                    ? "bg-white text-neutral-950 shadow-3xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Par Mois
              </button>
              <button
                type="button"
                onClick={() => setHistoryMode("yearly")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  historyMode === "yearly"
                    ? "bg-white text-neutral-950 shadow-3xs"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                Par Année
              </button>
            </div>
          </div>

          {historyMode !== "all" && (
            <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-neutral-200/50">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Sélectionner :</span>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Year Selection Dropdown */}
                <div className="relative shrink-0">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                    className="appearance-none bg-white border border-neutral-200 text-neutral-800 pl-3 pr-8 py-2 text-xs rounded-xl focus:outline-none focus:border-neutral-900 font-semibold cursor-pointer transition-all"
                  >
                    {[2024, 2025, 2026, 2027].map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>

                {/* Month Selection Dropdown (Only if monthly) */}
                {historyMode === "monthly" && (
                  <div className="relative shrink-0">
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
                      className="appearance-none bg-white border border-neutral-200 text-neutral-800 pl-3 pr-8 py-2 text-xs rounded-xl focus:outline-none focus:border-neutral-900 font-semibold cursor-pointer transition-all"
                    >
                      {[
                        { value: 1, label: "Janvier" },
                        { value: 2, label: "Février" },
                        { value: 3, label: "Mars" },
                        { value: 4, label: "Avril" },
                        { value: 5, label: "Mai" },
                        { value: 6, label: "Juin" },
                        { value: 7, label: "Juillet" },
                        { value: 8, label: "Août" },
                        { value: 9, label: "Septembre" },
                        { value: 10, label: "Octobre" },
                        { value: 11, label: "Novembre" },
                        { value: 12, label: "Décembre" },
                      ].map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-2.5 pointer-events-none" />
                  </div>
                )}
              </div>

              {/* Reset shortcut */}
              <button
                type="button"
                onClick={() => {
                  setHistoryMode("all");
                }}
                className="text-xs text-neutral-500 hover:text-neutral-900 font-bold transition-colors cursor-pointer"
              >
                Réinitialiser les filtres temporels
              </button>

              <div className="ml-auto text-[10px] text-neutral-500 font-bold bg-white border border-neutral-200/60 px-3 py-1.5 rounded-full shadow-3xs">
                {historyMode === "monthly" ? (
                  <span>
                    📅 {[
                      "Janvier", "Février", "Mars", "Avril", "Mai", "Juin", 
                      "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
                    ][selectedMonth - 1]} {selectedYear}
                  </span>
                ) : (
                  <span>📅 Année {selectedYear}</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Table View */}
      <motion.div 
        key={`table-container-${filterAnimationKey}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="overflow-x-auto rounded-xl border border-neutral-200 bg-white"
      >
        <table className="w-full border-collapse text-left text-xs">
          <thead>
            <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold tracking-wide">
              {columns.map(col => {
                const isSorted = sortConfig?.key === col.key;
                return (
                  <th 
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={`${isCompactView ? "px-3 py-1.5 text-[11px]" : "px-4 py-3"} cursor-pointer hover:bg-neutral-100/80 hover:text-neutral-900 transition-colors select-none group ${
                      isSorted ? "bg-neutral-100/40 text-neutral-950 font-bold" : ""
                    }`}
                    title={`Trier par ${col.label}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{col.label}</span>
                      <span className="inline-flex items-center transition-transform">
                        {isSorted ? (
                          sortConfig.direction === "asc" ? (
                            <span className="text-neutral-950 text-xs font-black font-mono leading-none">▲</span>
                          ) : (
                            <span className="text-neutral-950 text-xs font-black font-mono leading-none">▼</span>
                          )
                        ) : (
                          <ArrowUpDown className="w-3 h-3 text-neutral-400 opacity-20 group-hover:opacity-100 transition-opacity" />
                        )}
                      </span>
                    </div>
                  </th>
                );
              })}
              <th className={`${isCompactView ? "px-3 py-1.5 text-[11px]" : "px-4 py-3"} text-right font-semibold text-neutral-500`}>Actions</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-neutral-100 font-medium">
            {processedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center py-16 text-neutral-400 italic">
                  <div className="flex flex-col items-center gap-2">
                    <FileSpreadsheet className="w-8 h-8 text-neutral-300" />
                    <span>Aucun enregistrement disponible.</span>
                  </div>
                </td>
              </tr>
            ) : (
              processedData.map((item, index) => (
                <motion.tr 
                  key={`${filterAnimationKey}_${item.id}`} 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: Math.min(index * 0.02, 0.25), ease: "easeOut" }}
                  className="hover:bg-neutral-50/50 transition-colors text-neutral-700"
                >
                  {columns.map(col => {
                    const value = item[col.key];

                    return (
                      <td key={col.key} className={isCompactView ? "px-3 py-1 text-[11px]" : "px-4 py-3.5"}>
                        {col.type === "boolean" ? (
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            value 
                              ? "bg-neutral-900 text-white border-neutral-900" 
                              : "bg-neutral-100 border-neutral-200 text-neutral-400"
                          }`}>
                            {value ? "Oui" : "Non"}
                          </span>
                        ) : col.type === "number" ? (
                          <span className="font-mono text-neutral-900 font-semibold">
                            {col.key.toLowerCase().includes("amount") || col.key.toLowerCase().includes("price") || col.key.toLowerCase().includes("cost") || col.key.toLowerCase().includes("balance")
                              ? `${Number(value).toLocaleString("fr-FR")} ${currencySymbol}`
                              : value
                            }
                          </span>
                        ) : col.type === "rating" ? (
                          <div className="flex items-center gap-0.5 text-amber-500">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star 
                                key={star} 
                                className={`w-3.5 h-3.5 ${star <= (Number(value) || 0) ? "fill-amber-500" : "text-neutral-200"}`} 
                              />
                            ))}
                          </div>
                        ) : col.type === "progress" ? (
                          <div className="flex items-center gap-2 w-28">
                            <div className="w-full bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                              <div 
                                className="bg-neutral-900 h-1.5 rounded-full transition-all duration-500" 
                                style={{ width: `${Math.min(100, Math.max(0, Number(value) || 0))}%` }}
                              />
                            </div>
                            <span className="font-mono text-[10px] text-neutral-500">{value}%</span>
                          </div>
                        ) : col.type === "date" ? (
                          <span className="text-neutral-800 font-mono font-medium">{value}</span>
                        ) : (
                          <span className="truncate max-w-xl block text-neutral-900 font-semibold">
                            {typeof value === "string" && (value.startsWith("http://") || value.startsWith("https://")) ? (
                              <a 
                                href={value} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-indigo-600 hover:text-indigo-500 hover:underline font-semibold inline-flex items-center gap-1"
                              >
                                {value.replace("https://", "").replace("http://", "").split("/")[0]}
                                <ExternalLink className="w-3 h-3 shrink-0 inline text-neutral-400" />
                              </a>
                            ) : (
                              value
                            )}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  
                  <td className={`${isCompactView ? "px-3 py-1 text-[11px]" : "px-4 py-3.5"} text-right whitespace-nowrap`}>
                    <div className="flex items-center justify-end gap-1">
                      {onTransfer && (
                        <button
                          onClick={() => onTransfer(item)}
                          className={`${isCompactView ? "p-1" : "p-1.5"} text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-all flex items-center gap-1 cursor-pointer border border-indigo-100 dark:border-indigo-900/30`}
                          title={transferLabel || "Convertir"}
                        >
                          <ArrowLeftRight className="w-3.5 h-3.5" />
                          <span className="text-[10px] font-bold hidden sm:inline">{transferLabel || "Convertir"}</span>
                        </button>
                      )}
                      <button
                        onClick={() => openEditModal(item)}
                        className={`${isCompactView ? "p-1" : "p-1.5"} text-neutral-400 hover:text-neutral-900 rounded-lg hover:bg-neutral-100 transition-colors`}
                        title="Modifier la ligne"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setItemToDelete(item)}
                        className={`${isCompactView ? "p-1" : "p-1.5"} text-neutral-400 hover:text-red-500 rounded-lg hover:bg-neutral-100 transition-colors`}
                        title="Supprimer la ligne"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      {/* Row summary count footer */}
      <div className="text-[11px] text-neutral-400 flex items-center justify-between font-sans">
        <span>Affichage de {processedData.length} sur {data.length} lignes</span>
        <span>Life Architect Second Brain • Import/Export Actifs</span>
      </div>

      {/* ADD / EDIT LINE MODAL DIALOG (Light theme popup) */}
      {(isAddOpen || editingItem) && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/20 backdrop-blur-xs transition-opacity duration-200">
          <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
              <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-neutral-900" />
                {editingItem ? "Modifier la ligne" : "Créer un nouvel enregistrement"}
              </h3>
              <button 
                onClick={() => { setIsAddOpen(false); setEditingItem(null); }}
                className="text-neutral-400 hover:text-neutral-900 p-1 rounded-lg hover:bg-neutral-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {columns.map(col => {
                  const val = formState[col.key] !== undefined ? formState[col.key] : "";

                  return (
                    <div key={col.key} className={col.type === "text" && col.key.toLowerCase().includes("description") ? "sm:col-span-2" : ""}>
                      <label className="block text-[10px] font-bold text-neutral-500 mb-1.5 uppercase tracking-wider">
                        {col.label} {col.required && <span className="text-red-500">*</span>}
                      </label>

                      {col.type === "select" ? (
                        <div className="relative">
                          <select
                            value={val}
                            onChange={(e) => handleInputChange(col.key, e.target.value)}
                            required={col.required}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white appearance-none cursor-pointer"
                          >
                            {col.options?.map(opt => (
                              <option key={opt} value={opt}>{opt}</option>
                            ))}
                          </select>
                          <ChevronDown className="w-3.5 h-3.5 text-neutral-400 absolute right-3 top-2.5 pointer-events-none" />
                        </div>
                      ) : col.type === "boolean" ? (
                        <div className="flex items-center gap-3 py-2">
                          <input
                            type="checkbox"
                            checked={!!val}
                            onChange={(e) => handleInputChange(col.key, e.target.checked)}
                            className="w-4 h-4 text-neutral-900 bg-white border-neutral-300 rounded focus:ring-neutral-900"
                          />
                          <span className="text-xs text-neutral-600">Activer / Sélectionner</span>
                        </div>
                      ) : col.type === "rating" ? (
                        <div className="flex items-center gap-1 py-1">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => handleInputChange(col.key, star)}
                              className="text-amber-500 hover:scale-110 transition-transform"
                            >
                              <Star className={`w-5 h-5 ${star <= (Number(val) || 0) ? "fill-amber-500" : "text-neutral-200"}`} />
                            </button>
                          ))}
                        </div>
                      ) : col.type === "number" ? (
                        <input
                           type="number"
                           step="any"
                           value={val}
                           onChange={(e) => handleInputChange(col.key, e.target.value === "" ? "" : Number(e.target.value))}
                           required={col.required}
                           className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-300 focus:outline-none focus:border-neutral-900 focus:bg-white font-mono"
                        />
                      ) : col.type === "date" ? (
                        <input
                          type="date"
                          value={val}
                          onChange={(e) => handleInputChange(col.key, e.target.value)}
                          required={col.required}
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900 focus:bg-white font-mono"
                        />
                      ) : (
                        <div>
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => handleInputChange(col.key, e.target.value)}
                            required={col.required}
                            placeholder={`Entrer ${col.label.toLowerCase()}`}
                            className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3.5 py-2 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white"
                          />
                          {col.key === "description" && formState._autoCategoryMatched && (
                            <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-amber-800 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg animate-in fade-in-50">
                              <Sparkles className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>Catégorie <strong>{formState.category}</strong> attribuée automatiquement d'après <em>"{formState._autoCategoryMatched}"</em></span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-2.5 pt-4 border-t border-neutral-100 mt-6">
                <button
                  type="button"
                  onClick={() => { setIsAddOpen(false); setEditingItem(null); }}
                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  {editingItem ? "Valider" : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EXCEL IMPORT DIALOG MODAL (Light Theme popup) */}
      {isImportOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/20 backdrop-blur-xs">
          <div className="bg-white border border-neutral-200 rounded-2xl w-full max-w-xl shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 bg-neutral-50/50">
              <h3 className="font-bold text-sm text-neutral-900 flex items-center gap-2">
                <Upload className="w-4 h-4 text-neutral-900" />
                <span>Importer des données Excel / CSV</span>
              </h3>
              <button 
                onClick={() => { setIsImportOpen(false); setCsvInput(""); setImportError(""); }}
                className="text-neutral-400 hover:text-neutral-900 p-1 rounded-lg hover:bg-neutral-100 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleImportCSVSubmit} className="p-6 space-y-4">
              
              <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-neutral-700 shrink-0 mt-0.5" />
                <div className="text-xs text-neutral-600 space-y-1">
                  <p className="text-neutral-900 font-bold">Consignes de format :</p>
                  <p>Collez des données brutes CSV délimitées par des virgules. Les en-têtes doivent correspondre exactement aux colonnes suivantes :</p>
                  <p className="font-mono text-[10px] text-neutral-500 bg-neutral-100 p-2 rounded border border-neutral-200 mt-1 select-all">
                    {columns.map(c => c.label).join(",")}
                  </p>
                </div>
              </div>

              {/* CSV input text area */}
              <div className="space-y-1.5">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wide">
                  Données CSV ou copier/coller depuis Excel :
                </label>
                <textarea
                  value={csvInput}
                  onChange={(e) => setCsvInput(e.target.value)}
                  placeholder="Collez vos lignes issues d'Excel ou votre fichier CSV..."
                  rows={8}
                  className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-4 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 focus:bg-white font-mono leading-relaxed transition-all"
                />
              </div>

              {importError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{importError}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100 mt-6">
                <button
                  type="button"
                  onClick={handleLoadSampleCSV}
                  className="text-xs text-neutral-900 hover:text-neutral-700 font-bold flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-500" />
                  <span>Générer un modèle de lignes</span>
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => { setIsImportOpen(false); setCsvInput(""); setImportError(""); }}
                    className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-neutral-900 hover:bg-neutral-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                  >
                    Importer maintenant
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE DIALOG MODAL */}
      {itemToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-neutral-950/30 backdrop-blur-xs transition-opacity duration-200">
          <div className="bg-white dark:bg-zinc-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl w-full max-w-sm shadow-xl overflow-hidden animate-in fade-in-50 zoom-in-95 duration-150">
            <div className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/40 rounded-full flex items-center justify-center mx-auto text-rose-600 dark:text-rose-400">
                <Trash2 className="w-6 h-6" />
              </div>
              
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
                  Confirmer la suppression
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                  Êtes-vous sûr de vouloir supprimer cet élément ? Cette action est irréversible.
                </p>
                {(itemToDelete.title || itemToDelete.name || itemToDelete.description || itemToDelete.label || itemToDelete.libelle) && (
                  <div className="mt-3 p-2.5 bg-neutral-50 dark:bg-zinc-950/60 border border-neutral-200/80 dark:border-neutral-800 rounded-xl text-xs font-semibold text-neutral-800 dark:text-neutral-200 truncate max-w-xs mx-auto">
                    "{itemToDelete.title || itemToDelete.name || itemToDelete.description || itemToDelete.label || itemToDelete.libelle}"
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="flex-1 bg-neutral-100 hover:bg-neutral-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-neutral-700 dark:text-neutral-300 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (itemToDelete) {
                      onDelete(itemToDelete.id);
                      setItemToDelete(null);
                    }
                  }}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED CATEGORY TRANSACTIONS MODAL */}
      <CategoryDetailModal
        isOpen={!!modalCategory}
        onClose={() => setModalCategory(null)}
        categoryName={modalCategory}
        periodKey="all"
        transactions={transactions}
        abonnements={abonnements}
      />

    </div>
  );
}
