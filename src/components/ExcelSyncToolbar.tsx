import React, { useState, useRef } from "react";
import { 
  Download, 
  Upload, 
  FileSpreadsheet, 
  RefreshCw, 
  AlertCircle, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Info,
  HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface ExcelSyncToolbarProps {
  activeMenu: string;
  data: any[];
  onImport: (parsedData: any[], mode: "append" | "replace") => void;
  triggerToast: (message: string, type: "success" | "error" | "info") => void;
}

export interface ExcelColumn {
  key: string;
  label: string;
  type: "text" | "number" | "boolean" | "date";
  required?: boolean;
  defaultValue?: any;
}

// Config mapping for ALL modules in the app
export const MODULE_SCHEMAS: Record<string, { title: string; columns: ExcelColumn[] }> = {
  comptes: {
    title: "Comptes Bancaires",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "name", label: "Nom du Compte", type: "text", required: true },
      { key: "bankName", label: "Banque", type: "text", required: true },
      { key: "type", label: "Type", type: "text", defaultValue: "Courant" },
      { key: "balance", label: "Solde (MAD)", type: "number", required: true, defaultValue: 0 },
      { key: "currency", label: "Devise", type: "text", defaultValue: "MAD" },
      { key: "isInvestment", label: "Investissement", type: "boolean", defaultValue: false }
    ]
  },
  transactions: {
    title: "Transactions",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "date", label: "Date (AAAA-MM-JJ)", type: "date", required: true },
      { key: "description", label: "Description", type: "text", required: true },
      { key: "category", label: "Catégorie", type: "text", defaultValue: "Autres" },
      { key: "type", label: "Type (Revenue/Dépense)", type: "text", required: true, defaultValue: "Dépense" },
      { key: "amount", label: "Montant (MAD)", type: "number", required: true, defaultValue: 0 },
      { key: "account", label: "Compte source", type: "text", defaultValue: "Principal" }
    ]
  },
  stocks: {
    title: "Portefeuille Actions BVC",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "symbol", label: "Symbole Bourse", type: "text", required: true },
      { key: "name", label: "Nom Action", type: "text", required: true },
      { key: "buyPrice", label: "Prix d'Achat", type: "number", required: true, defaultValue: 0 },
      { key: "currentPrice", label: "Prix Actuel", type: "number", required: true, defaultValue: 0 },
      { key: "quantity", label: "Quantité", type: "number", required: true, defaultValue: 1 },
      { key: "lastUpdated", label: "Mise à jour (AAAA-MM-JJ)", type: "date" }
    ]
  },
  budgets: {
    title: "Budgets par Catégorie",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "category", label: "Catégorie", type: "text", required: true },
      { key: "limitAmount", label: "Budget Limite (MAD)", type: "number", required: true, defaultValue: 1000 },
      { key: "spentAmount", label: "Dépensé Réel", type: "number", defaultValue: 0 },
      { key: "period", label: "Période (Mensuel/Annuel)", type: "text", defaultValue: "Mensuel" }
    ]
  },
  salaires: {
    title: "Salaires & Revenus",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "date", label: "Date Réception (AAAA-MM-JJ)", type: "date", required: true },
      { key: "source", label: "Source / Employeur", type: "text", required: true },
      { key: "grossAmount", label: "Montant Brut", type: "number", required: true, defaultValue: 0 },
      { key: "netAmount", label: "Montant Net Reçu", type: "number", required: true, defaultValue: 0 },
      { key: "status", label: "Statut (Reçu/En attente)", type: "text", defaultValue: "Reçu" }
    ]
  },
  epargnes: {
    title: "Objectifs Épargne",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "name", label: "Nom du Projet", type: "text", required: true },
      { key: "targetAmount", label: "Montant Cible", type: "number", required: true, defaultValue: 50000 },
      { key: "currentAmount", label: "Montant Épargné", type: "number", defaultValue: 0 },
      { key: "deadline", label: "Échéance (AAAA-MM-JJ)", type: "date" },
      { key: "category", label: "Catégorie d'Épargne", type: "text", defaultValue: "Projet" }
    ]
  },
  achats: {
    title: "Achats Mensuels",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "name", label: "Nom de l'Achat", type: "text", required: true },
      { key: "price", label: "Prix (MAD)", type: "number", required: true, defaultValue: 0 },
      { key: "category", label: "Catégorie", type: "text", defaultValue: "Fournitures" },
      { key: "quantity", label: "Quantité", type: "number", defaultValue: 1 },
      { key: "isBought", label: "Acheté (true/false)", type: "boolean", defaultValue: false },
      { key: "link", label: "Lien URL", type: "text" }
    ]
  },
  abonnements: {
    title: "Abonnements & Charges",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "name", label: "Nom Service", type: "text", required: true },
      { key: "price", label: "Tarif Mensuel (MAD)", type: "number", required: true, defaultValue: 99 },
      { key: "billingCycle", label: "Cycle (Mensuel/Annuel)", type: "text", defaultValue: "Mensuel" },
      { key: "nextBillingDate", label: "Prochaine Facture (AAAA-MM-JJ)", type: "date" },
      { key: "category", label: "Catégorie", type: "text", defaultValue: "Hébergement" },
      { key: "isCritical", label: "Critique (true/false)", type: "boolean", defaultValue: false }
    ]
  },
  wishlist: {
    title: "Wish List",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "itemName", label: "Nom de l'Objet", type: "text", required: true },
      { key: "estimatedPrice", label: "Prix Estimé (MAD)", type: "number", required: true, defaultValue: 1000 },
      { key: "priority", label: "Priorité (Haute/Moyenne/Basse)", type: "text", defaultValue: "Moyenne" },
      { key: "category", label: "Catégorie", type: "text", defaultValue: "Électronique" },
      { key: "isAcquired", label: "Acquis (true/false)", type: "boolean", defaultValue: false },
      { key: "url", label: "Lien URL", type: "text" }
    ]
  },
  achats_couteux: {
    title: "Achats Coûteux",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "name", label: "Nom Achat", type: "text", required: true },
      { key: "price", label: "Prix (MAD)", type: "number", required: true, defaultValue: 10000 },
      { key: "targetDate", label: "Date Cible (AAAA-MM-JJ)", type: "date" },
      { key: "savedAmount", label: "Montant Épargné", type: "number", defaultValue: 0 },
      { key: "priority", label: "Priorité", type: "text", defaultValue: "Moyenne" }
    ]
  },
  habits: {
    title: "Habitudes Quotidiennes",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "name", label: "Nom de l'Habitude", type: "text", required: true },
      { key: "category", label: "Catégorie (personal/professional)", type: "text", defaultValue: "personal" },
      { key: "frequency", label: "Fréquence", type: "text", defaultValue: "Quotidien" },
      { key: "isImportant", label: "Important (true/false)", type: "boolean", defaultValue: false },
      { key: "dueTime", label: "Heure Limite (HH:MM)", type: "text", defaultValue: "20:00" }
    ]
  },
  actions30: {
    title: "Actions 30 Jours (Sprints)",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "title", label: "Titre du Sprint", type: "text", required: true },
      { key: "description", label: "Description", type: "text", defaultValue: "" },
      { key: "category", label: "Catégorie (Pro/Perso)", type: "text", defaultValue: "Pro" },
      { key: "status", label: "Statut", type: "text", defaultValue: "Pas Commencé" },
      { key: "progress", label: "Progression (%)", type: "number", defaultValue: 0 }
    ]
  },
  profil: {
    title: "Profil & Compétences",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "skillName", label: "Compétence", type: "text", required: true },
      { key: "currentLevel", label: "Niveau Actuel (%)", type: "number", defaultValue: 20 },
      { key: "targetLevel", label: "Niveau Cible (%)", type: "number", defaultValue: 80 },
      { key: "frictionArea", label: "Zone de Friction", type: "text", defaultValue: "" },
      { key: "actionPlan", label: "Plan d'Action", type: "text", defaultValue: "" }
    ]
  },
  goals: {
    title: "Possibilités & Goals de Vie",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "title", label: "But de Vie", type: "text", required: true },
      { key: "horizon", label: "Horizon (Court Terme/Moyen Terme/Long Terme)", type: "text", defaultValue: "Moyen Terme" },
      { key: "category", label: "Catégorie", type: "text", defaultValue: "Pro" },
      { key: "targetDate", label: "Date Cible (AAAA-MM-JJ)", type: "date" },
      { key: "achieved", label: "Atteint (true/false)", type: "boolean", defaultValue: false }
    ]
  },
  skin: {
    title: "Skin Care Tracker",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "name", label: "Étape Routine", type: "text", required: true },
      { key: "timeOfDay", label: "Moment de la journée (Matin/Soir)", type: "text", defaultValue: "Matin" },
      { key: "product", label: "Produit utilisé", type: "text", defaultValue: "" },
      { key: "isActive", label: "Actif (true/false)", type: "boolean", defaultValue: true }
    ]
  },
  meal: {
    title: "Meal Planner",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "day", label: "Jour de la Semaine", type: "text", required: true },
      { key: "mealType", label: "Type Repas (Petit-déjeuner/Déjeuner/Dîner/Collation)", type: "text", required: true },
      { key: "dishName", label: "Nom du Plat", type: "text", required: true },
      { key: "calories", label: "Calories (kcal)", type: "number", defaultValue: 500 },
      { key: "waterLiters", label: "Eau (Litres)", type: "number", defaultValue: 1.5 }
    ]
  },
  sport: {
    title: "Exercices de Sport",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "name", label: "Nom Exercice", type: "text", required: true },
      { key: "desc", label: "Description", type: "text", defaultValue: "" },
      { key: "duration", label: "Durée ou Séries", type: "text", defaultValue: "5 min" },
      { key: "completed", label: "Complété aujourd'hui (true/false)", type: "boolean", defaultValue: false }
    ]
  },
  project_folders: {
    title: "Dossiers de Projets",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "name", label: "Nom du Projet", type: "text", required: true },
      { key: "category", label: "Catégorie", type: "text", defaultValue: "Pro" },
      { key: "progress", label: "Progression (%)", type: "number", defaultValue: 0 },
      { key: "status", label: "Statut", type: "text", defaultValue: "En cours" },
      { key: "color", label: "Couleur (Code Hex)", type: "text", defaultValue: "#3b82f6" }
    ]
  },
  formations: {
    title: "Carrière & Formations",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "title", label: "Titre Formation", type: "text", required: true },
      { key: "provider", label: "Plateforme / École", type: "text", defaultValue: "Udemy" },
      { key: "progress", label: "Progression (%)", type: "number", defaultValue: 0 },
      { key: "category", label: "Catégorie", type: "text", defaultValue: "Professionnel" },
      { key: "url", label: "Lien URL", type: "text" }
    ]
  },
  channels: {
    title: "Canaux Média & Canaux",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "name", label: "Nom du Canal", type: "text", required: true },
      { key: "platform", label: "Plateforme (YouTube, Blog, LinkedIn...)", type: "text", defaultValue: "YouTube" },
      { key: "subscribers", label: "Audience / Abonnés", type: "number", defaultValue: 0 },
      { key: "frequency", label: "Fréquence de publication", type: "text", defaultValue: "1x/Semaine" },
      { key: "lastPublished", label: "Dernière publication (AAAA-MM-JJ)", type: "date" }
    ]
  },
  editorial_calendar: {
    title: "Calendrier de Projets",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "title", label: "Titre Événement / Publication", type: "text", required: true },
      { key: "date", label: "Date de Publication (AAAA-MM-JJ)", type: "date", required: true },
      { key: "channel", label: "Canal Média associé", type: "text", defaultValue: "YouTube" },
      { key: "type", label: "Type de Publication", type: "text", defaultValue: "Vidéo" },
      { key: "status", label: "Statut (Planifié/En cours/Publié)", type: "text", defaultValue: "Planifié" }
    ]
  },
  links: {
    title: "Liens Favoris",
    columns: [
      { key: "id", label: "ID", type: "text" },
      { key: "title", label: "Titre", type: "text", required: true },
      { key: "url", label: "Lien URL", type: "text", required: true },
      { key: "category", label: "Catégorie", type: "text", defaultValue: "Ressources" },
      { key: "isUrgent", label: "Important (true/false)", type: "boolean", defaultValue: false }
    ]
  }
};

export default function ExcelSyncToolbar({ activeMenu, data = [], onImport, triggerToast }: ExcelSyncToolbarProps) {
  const schemaConfig = MODULE_SCHEMAS[activeMenu];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [importMode, setImportMode] = useState<"append" | "replace">("append");
  const [dragActive, setDragActive] = useState(false);

  // If this page does not support importing/exporting templates, hide
  if (!schemaConfig) {
    return null;
  }

  const handleExport = () => {
    try {
      const { title, columns } = schemaConfig;
      
      // Generate CSV headers
      const headers = columns.map(col => col.label).join(";");
      
      // Generate CSV rows
      const rows = data.map(item => {
        return columns.map(col => {
          let val = item[col.key];
          if (val === undefined || val === null) return "";
          if (typeof val === "boolean") return val ? "true" : "false";
          
          const valStr = String(val).replace(/"/g, '""');
          if (valStr.includes(";") || valStr.includes("\n") || valStr.includes('"')) {
            return `"${valStr}"`;
          }
          return valStr;
        }).join(";");
      });

      const csvContent = [headers, ...rows].join("\n");
      // Add UTF-8 BOM so Excel opens french characters perfectly
      const blob = new Blob(["\ufeff" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Modèle_${title.replace(/[\s&]+/g, "_")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      triggerToast(`Modèle Excel (${title}) exporté avec succès !`, "success");
    } catch (err) {
      console.error(err);
      triggerToast("Erreur lors de l'exportation du modèle.", "error");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length === 0) {
          triggerToast("Le fichier importé semble vide ou incorrect.", "error");
          return;
        }
        
        onImport(parsed, importMode);
        setIsOpen(false);
        triggerToast(`${parsed.length} entrées synchronisées avec succès !`, "success");
        if (fileInputRef.current) fileInputRef.current.value = "";
      } catch (err: any) {
        console.error(err);
        triggerToast(`Erreur lors de la lecture du fichier : ${err.message || err}`, "error");
      }
    };
    reader.readAsText(file, "UTF-8");
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split(/\r?\n/).filter(line => line.trim() !== "");
    if (lines.length < 1) return [];
    
    const headerLine = lines[0];
    const separator = headerLine.includes(";") ? ";" : ",";
    
    const splitLine = (line: string): string[] => {
      const result: string[] = [];
      let current = "";
      let inQuotes = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') {
          if (inQuotes && line[i + 1] === '"') {
            current += '"';
            i++;
          } else {
            inQuotes = !inQuotes;
          }
        } else if (char === separator && !inQuotes) {
          result.push(current);
          current = "";
        } else {
          current += char;
        }
      }
      result.push(current);
      return result;
    };

    const fileHeaders = splitLine(lines[0]).map(h => h.trim().toLowerCase().replace(/^\ufeff/, ""));
    const { columns } = schemaConfig;

    const parsedData = lines.slice(1).map((line, index) => {
      const values = splitLine(line);
      const rowObj: any = {};
      
      columns.forEach(col => {
        // Match by label (French) or by key
        const headerIdx = fileHeaders.findIndex(h => 
          h === col.label.toLowerCase() || h === col.key.toLowerCase()
        );
        
        if (headerIdx !== -1 && headerIdx < values.length) {
          let rawValue = values[headerIdx].trim();
          
          // Remove wrapping quotes if they remain
          if (rawValue.startsWith('"') && rawValue.endsWith('"')) {
            rawValue = rawValue.slice(1, -1).replace(/""/g, '"');
          }

          if (rawValue === "") {
            rowObj[col.key] = col.defaultValue !== undefined ? col.defaultValue : "";
          } else if (rawValue.toLowerCase() === "true" || rawValue.toLowerCase() === "oui" || rawValue.toLowerCase() === "vrai") {
            rowObj[col.key] = true;
          } else if (rawValue.toLowerCase() === "false" || rawValue.toLowerCase() === "non" || rawValue.toLowerCase() === "faux") {
            rowObj[col.key] = false;
          } else if (!isNaN(Number(rawValue)) && rawValue !== "") {
            rowObj[col.key] = Number(rawValue);
          } else {
            rowObj[col.key] = rawValue;
          }
        } else {
          rowObj[col.key] = col.defaultValue !== undefined ? col.defaultValue : "";
        }
      });
      
      // Ensure clean ID
      if (!rowObj.id || rowObj.id === "") {
        rowObj.id = `imported_${Date.now()}_${index}_${Math.floor(Math.random() * 10000)}`;
      }
      
      return rowObj;
    });
    
    return parsedData;
  };

  return (
    <div id="excel-sync-bar" className="bg-neutral-50 dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 mb-6 shadow-3xs transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Module Title & Info */}
        <div className="flex items-start gap-3">
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-tight flex items-center gap-2">
              Synchronisation Excel : {schemaConfig.title}
            </h3>
            <p className="text-[11px] text-neutral-400 mt-0.5 leading-relaxed max-w-xl">
              Téléchargez le gabarit Excel, remplissez-le directement dans Excel, puis ré-importez le fichier pour rafraîchir ou ajouter vos données sans aucune perte de format.
            </p>
          </div>
        </div>

        {/* Export/Import Buttons */}
        <div className="flex items-center gap-3 self-start lg:self-center">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 hover:bg-neutral-50 dark:hover:bg-zinc-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 text-xs font-black rounded-2xl shadow-3xs transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-500" />
            <span>Télécharger Modèle Excel</span>
          </button>
          
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`flex items-center gap-2 px-4 py-2 border text-xs font-black rounded-2xl shadow-3xs transition-all cursor-pointer ${
              isOpen
                ? "bg-neutral-900 border-neutral-900 text-white dark:bg-neutral-100 dark:border-neutral-100 dark:text-neutral-950"
                : "bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>{isOpen ? "Fermer l'Importation" : "Importer de Excel / CSV"}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5 ml-0.5" /> : <ChevronDown className="w-3.5 h-3.5 ml-0.5" />}
          </button>
        </div>
      </div>

      {/* Expanded Import Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="border-t border-neutral-150 dark:border-neutral-800/80 mt-4 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* Column Checklist Info */}
                <div className="md:col-span-5 bg-neutral-100/60 dark:bg-zinc-900/60 rounded-2xl p-4 border border-neutral-200/50 dark:border-neutral-800/50 flex flex-col justify-between">
                  <div>
                    <h4 className="text-[11px] font-black text-neutral-800 dark:text-neutral-200 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-indigo-500" /> Colonnes Recommandées
                    </h4>
                    <p className="text-[10px] text-neutral-500 mb-3 leading-relaxed">
                      Assurez-vous que votre fichier contient exactement ces colonnes en première ligne (ou utilisez le modèle exporté) :
                    </p>
                    <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto pr-1">
                      {schemaConfig.columns.map(col => (
                        <span 
                          key={col.key} 
                          className="px-2 py-1 bg-white dark:bg-zinc-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-[9.5px] font-mono text-neutral-600 dark:text-neutral-400 font-bold"
                        >
                          {col.label} {col.required && <span className="text-rose-500 font-black">*</span>}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-neutral-200/40 dark:border-neutral-800/40">
                    <span className="text-[9px] text-neutral-400 font-bold block uppercase tracking-wider">Format des Cellules :</span>
                    <span className="text-[9.5px] text-neutral-400 block mt-1 leading-normal">
                      • <strong className="text-neutral-600 dark:text-neutral-300">Boolean</strong>: 'true' (Vrai) ou 'false' (Faux)<br />
                      • <strong className="text-neutral-600 dark:text-neutral-300">Date</strong>: format AAAA-MM-JJ (ex: 2026-07-17)<br />
                      • <strong className="text-neutral-600 dark:text-neutral-300">Chiffres</strong>: sans espace ni symbole de devise (ex: 2500)
                    </span>
                  </div>
                </div>

                {/* File Dropzone & Mode Selector */}
                <div className="md:col-span-7 flex flex-col gap-4">
                  
                  {/* Mode Selector */}
                  <div className="flex items-center gap-4">
                    <span className="text-[10.5px] font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wide">Mode d'intégration :</span>
                    <div className="flex items-center gap-1 bg-neutral-150 dark:bg-neutral-900 p-0.5 rounded-xl border border-neutral-200/60 dark:border-neutral-800/60">
                      <button
                        type="button"
                        onClick={() => setImportMode("append")}
                        className={`px-3 py-1 text-[10.5px] font-black rounded-lg transition-all cursor-pointer ${
                          importMode === "append"
                            ? "bg-white dark:bg-zinc-800 text-neutral-950 dark:text-neutral-50 shadow-3xs"
                            : "text-neutral-400 hover:text-neutral-700"
                        }`}
                      >
                        Ajouter aux données existantes
                      </button>
                      <button
                        type="button"
                        onClick={() => setImportMode("replace")}
                        className={`px-3 py-1 text-[10.5px] font-black rounded-lg transition-all cursor-pointer ${
                          importMode === "replace"
                            ? "bg-rose-500 text-white shadow-3xs"
                            : "text-neutral-400 hover:text-rose-500"
                        }`}
                      >
                        Écraser & Remplacer tout
                      </button>
                    </div>
                  </div>

                  {/* Dropzone */}
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      dragActive
                        ? "border-emerald-500 bg-emerald-500/5"
                        : "border-neutral-300 dark:border-neutral-800 hover:border-emerald-500/50 hover:bg-neutral-100/50 dark:hover:bg-zinc-900/50"
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,text/csv,application/vnd.ms-excel"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Upload className={`w-8 h-8 mb-2 ${dragActive ? "text-emerald-500 animate-bounce" : "text-neutral-400"}`} />
                    <p className="text-xs font-black text-neutral-700 dark:text-neutral-300 uppercase tracking-tight">
                      Glissez-déposez votre gabarit Excel (.csv) ici
                    </p>
                    <p className="text-[10px] text-neutral-400 mt-1 leading-normal">
                      ou cliquez pour parcourir vos dossiers.<br />
                      Seuls les fichiers CSV exportés de Microsoft Excel ou de Google Sheets sont acceptés.
                    </p>
                  </div>

                </div>

              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
