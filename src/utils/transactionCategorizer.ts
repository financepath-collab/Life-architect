export interface KeywordCategoryMapping {
  category: string;
  keywords: string[];
}

export const KEYWORD_CATEGORY_RULES: KeywordCategoryMapping[] = [
  {
    category: "Repas",
    keywords: [
      "carrefour", "marjane", "bim", "supermarché", "supermarche", "auchan", "glovo", "uber eats",
      "restaurant", "mcdo", "mcdonald", "kfc", "burger", "boulangerie", "pâtisserie", "patisserie",
      "cafe", "café", "starbucks", "épicerie", "epicerie", "snack", "pizza", "repas", "dejeuner",
      "dîner", "diner", "nourriture", "boucher", "traiteur", "cafeteria"
    ]
  },
  {
    category: "Alimentation",
    keywords: [
      "courses", "marche", "marché", "legumes", "légumes", "fruits", "laiterie", "hypermarche",
      "hypermarché"
    ]
  },
  {
    category: "Transport",
    keywords: [
      "total", "shell", "afriquia", "winxo", "carburant", "essence", "gazole", "peage", "péage",
      "autoroute", "uber", "careem", "taxi", "train", "oncf", "vol", "avion", "ram", "air france",
      "tram", "tramway", "parking", "stationnement", "garage", "vidange", "pneumatique", "lavage", "sans plomb"
    ]
  },
  {
    category: "Logiciels",
    keywords: [
      "openai", "chatgpt", "github", "adobe", "figma", "midjourney", "aws", "google cloud", "vercel",
      "netlify", "google storage", "icloud", "apple.com/bill", "hosting", "domain", "ovh",
      "godaddy", "namecheap", "cursor", "copilot", "anthropic", "claude", "software", "saas",
      "licence", "subscription"
    ]
  },
  {
    category: "Équipement",
    keywords: [
      "fnac", "amazon", "derb ghallef", "electroplanet", "marjane electro", "apple store", "setup",
      "ecran", "écran", "clavier", "souris", "casque", "pc", "laptop", "iphone", "macbook", "hardware",
      "matériel", "materiel", "equipement", "imprimante", "encre", "cable", "câble"
    ]
  },
  {
    category: "AdSense",
    keywords: [
      "google adsense", "adsense", "youtube payout", "google ireland", "google asia"
    ]
  },
  {
    category: "Sponsor",
    keywords: [
      "sponsor", "sponsoring", "partenariat", "brand deal", "placement", "sponsorship"
    ]
  },
  {
    category: "Revenus Pro",
    keywords: [
      "salaire", "virement reçu", "virement recu", "paiement client", "facture payee", "client",
      "stripe", "paypal payout", "upwork", "fiverr", "malt", "honoraires", "prestation", "dividendes",
      "virement entrant"
    ]
  },
  {
    category: "Loisirs",
    keywords: [
      "netflix", "spotify", "youtube premium", "disney", "cinema", "cinéma", "jeux", "steam",
      "playstation", "xbox", "concert", "voyage", "hotel", "hôtel", "airbnb", "sport", "fitness",
      "gym", "club", "salle de sport", "spectacle", "theatre"
    ]
  }
];

/**
 * Predicts or auto-assigns a category based on the transaction description.
 * If currentCategory is already valid (not empty / "Autres" / "Sans catégorie"), returns currentCategory.
 */
export function autoCategorizeTransaction(
  description: string,
  type?: "Revenue" | "Dépense" | string,
  currentCategory?: string,
  availableOptions?: string[]
): { category: string; matchedKeyword?: string; isSuggested: boolean } {
  const normCurrent = (currentCategory || "").trim().toLowerCase();
  
  // If user already assigned a specific non-generic category, keep it!
  const isGenericCategory =
    !normCurrent ||
    normCurrent === "autres" ||
    normCurrent === "autre" ||
    normCurrent === "sans catégorie" ||
    normCurrent === "sans categorie" ||
    normCurrent === "non catégorisé" ||
    normCurrent === "unassigned";

  if (!isGenericCategory && currentCategory) {
    return { category: currentCategory, isSuggested: false };
  }

  const descLower = (description || "").toLowerCase().trim();
  if (!descLower) {
    return { category: currentCategory || "Autres", isSuggested: false };
  }

  // Iterate over rules to match keywords
  for (const rule of KEYWORD_CATEGORY_RULES) {
    for (const kw of rule.keywords) {
      if (descLower.includes(kw.toLowerCase())) {
        let matchedCategory = rule.category;
        
        // If availableOptions are provided, try to find an exact match or close match in options
        if (availableOptions && availableOptions.length > 0) {
          const matchInOptions = availableOptions.find(
            opt => opt.toLowerCase() === matchedCategory.toLowerCase()
          );
          if (matchInOptions) {
            matchedCategory = matchInOptions;
          } else {
            const partial = availableOptions.find(opt =>
              opt.toLowerCase().includes(matchedCategory.toLowerCase()) ||
              matchedCategory.toLowerCase().includes(opt.toLowerCase())
            );
            if (partial && partial !== "Autres") {
              matchedCategory = partial;
            }
          }
        }

        return {
          category: matchedCategory,
          matchedKeyword: kw,
          isSuggested: true
        };
      }
    }
  }

  // Fallback heuristic based on transaction type if no keyword matched
  if (type === "Revenue") {
    const revOption = availableOptions?.find(o => o.toLowerCase().includes("revenu") || o.toLowerCase().includes("pro")) || "Revenus Pro";
    return { category: revOption, isSuggested: false };
  }

  return { category: currentCategory || "Autres", isSuggested: false };
}

/**
 * Bulk categorizes an array of transactions, updating any that have generic/empty categories.
 */
export function bulkAutoCategorizeTransactions<T extends { description: string; category?: string; type?: string }>(
  transactions: T[],
  availableOptions?: string[]
): { updatedTransactions: T[]; updatedCount: number } {
  let updatedCount = 0;
  const updatedTransactions = transactions.map(tx => {
    const normCategory = (tx.category || "").trim().toLowerCase();
    const isGeneric =
      !normCategory ||
      normCategory === "autres" ||
      normCategory === "autre" ||
      normCategory === "sans catégorie" ||
      normCategory === "non catégorisé";

    if (isGeneric && tx.description) {
      const result = autoCategorizeTransaction(tx.description, tx.type, tx.category, availableOptions);
      if (result.isSuggested && result.category !== tx.category) {
        updatedCount++;
        return {
          ...tx,
          category: result.category
        };
      }
    }
    return tx;
  });

  return { updatedTransactions, updatedCount };
}
