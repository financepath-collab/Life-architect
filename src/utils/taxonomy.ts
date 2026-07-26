import { TrendingUp, Zap, ShoppingBag, PiggyBank, Briefcase, Tag } from "lucide-react";

export interface TaxonomyCategory {
  label: string;
  color: string;
  subCategories: string[];
}

export const DEFAULT_FINANCIAL_TAXONOMY: Record<string, TaxonomyCategory> = {
  "Salaire & Revenus": {
    label: "Salaire & Revenus",
    color: "emerald",
    subCategories: [
      "Salaire Fixe Principal",
      "Prime & Gratification",
      "Freelance & Consulting",
      "YouTube & AdSense",
      "Sponsoring & Partenariats",
      "Dividendes & Bourse BVC",
      "Revenus Immobiliers",
      "Remboursements & Avoirs",
      "Autre Revenu"
    ]
  },
  "Charges Fixes & Abonnements": {
    label: "Charges Fixes & Abonnements",
    color: "amber",
    subCategories: [
      "Loyer & Logement",
      "Électricité & Eau (Redal/Lydec)",
      "Télécom & Fibre (IAM/Orange/INWI)",
      "Assurances & Mutuelles",
      "Abonnements SaaS & Logiciels",
      "Hébergement & Domaines Web",
      "Streaming & Loisirs (Netflix/Spotify)",
      "Frais Bancaires & Tenue de Compte",
      "Autre Charge Fixe"
    ]
  },
  "Dépenses Courantes & Achats": {
    label: "Dépenses Courantes & Achats",
    color: "rose",
    subCategories: [
      "Courses Alimentaires & Supermarché",
      "Transport & Carburant",
      "Restaurants & Cafés",
      "Équipement Pro & High-Tech",
      "Shopping & Vêtements",
      "Santé, Pharmacie & Soins",
      "Cadeaux & Événements",
      "Autres Dépenses"
    ]
  },
  "Épargne & Projets Futurs": {
    label: "Épargne & Projets Futurs",
    color: "indigo",
    subCategories: [
      "Épargne de Sécurité & Précaution",
      "Apport Projet Immobilier",
      "Fonds d'Urgence",
      "Voyage & Vacances",
      "Achat Équipement & Wishlist",
      "Autre Épargne"
    ]
  },
  "Investissements & Actifs": {
    label: "Investissements & Actifs",
    color: "cyan",
    subCategories: [
      "Achat Actions BVC (Bourse Casablanca)",
      "Portefeuille Crypto-Actifs",
      "Placements SCPI / FCP",
      "Autre Investissement"
    ]
  }
};

export const TAXONOMY_ICONS: Record<string, any> = {
  "Salaire & Revenus": TrendingUp,
  "Charges Fixes & Abonnements": Zap,
  "Dépenses Courantes & Achats": ShoppingBag,
  "Épargne & Projets Futurs": PiggyBank,
  "Investissements & Actifs": Briefcase,
};

const STORAGE_KEY = "mp_finance_taxonomy_v2";

export function getStoredTaxonomy(): Record<string, TaxonomyCategory> {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return DEFAULT_FINANCIAL_TAXONOMY;
  try {
    const parsed = JSON.parse(saved);
    const merged: Record<string, TaxonomyCategory> = { ...DEFAULT_FINANCIAL_TAXONOMY };
    Object.keys(parsed).forEach(key => {
      merged[key] = {
        label: parsed[key].label || key,
        color: parsed[key].color || "indigo",
        subCategories: Array.isArray(parsed[key].subCategories) && parsed[key].subCategories.length > 0
          ? parsed[key].subCategories
          : DEFAULT_FINANCIAL_TAXONOMY[key]?.subCategories || ["Général"]
      };
    });
    return merged;
  } catch (e) {
    return DEFAULT_FINANCIAL_TAXONOMY;
  }
}

export function saveStoredTaxonomy(taxonomy: Record<string, TaxonomyCategory>): void {
  const serializable: Record<string, { label: string; color: string; subCategories: string[] }> = {};
  Object.keys(taxonomy).forEach(key => {
    serializable[key] = {
      label: taxonomy[key].label || key,
      color: taxonomy[key].color || "indigo",
      subCategories: taxonomy[key].subCategories || ["Général"]
    };
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(serializable));
  window.dispatchEvent(new CustomEvent("taxonomyUpdated", { detail: taxonomy }));
}

export function resetTaxonomyToDefaults(): Record<string, TaxonomyCategory> {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("taxonomyUpdated", { detail: DEFAULT_FINANCIAL_TAXONOMY }));
  return DEFAULT_FINANCIAL_TAXONOMY;
}
