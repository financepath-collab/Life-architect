import { ChannelInfo } from "../types";

export interface FrequencyConfig {
  label: string;
  sublabel: string;
  placeholder: string;
  defaultFrequency: string;
  presets: string[];
}

export function getProjectFrequencyConfig(platform?: ChannelInfo["platform"] | string): FrequencyConfig {
  const p = platform || "YouTube";

  switch (p) {
    case "YouTube":
      return {
        label: "Fréquence de publication",
        sublabel: "Rythme de parution des vidéos",
        placeholder: "Ex: 1 vidéo / semaine",
        defaultFrequency: "1 vidéo / semaine",
        presets: [
          "1 vidéo / semaine",
          "2 vidéos / semaine",
          "1 vidéo / jour",
          "2 vidéos / mois",
          "1 vidéo / mois"
        ]
      };

    case "TikTok":
      return {
        label: "Fréquence de publication",
        sublabel: "Rythme des vidéos courtes",
        placeholder: "Ex: 1 à 2 vidéos / jour",
        defaultFrequency: "1 à 2 vidéos / jour",
        presets: [
          "1 à 2 vidéos / jour",
          "3 à 5 vidéos / jour",
          "1 vidéo / jour",
          "3-4 vidéos / semaine",
          "1 vidéo / semaine"
        ]
      };

    case "Instagram":
      return {
        label: "Fréquence de publication",
        sublabel: "Rythme des posts, Reels et Stories",
        placeholder: "Ex: 1 post ou Reel / jour",
        defaultFrequency: "1 post / jour",
        presets: [
          "1 post / jour",
          "3-4 posts / semaine",
          "2 Reels / semaine",
          "Daily Stories + 3 posts / sem",
          "2 posts / mois"
        ]
      };

    case "LinkedIn":
      return {
        label: "Fréquence de publication",
        sublabel: "Rythme des articles et posts pro",
        placeholder: "Ex: 3 publications / semaine",
        defaultFrequency: "3 posts / semaine",
        presets: [
          "3 posts / semaine",
          "1 post / jour (Lun-Ven)",
          "2 posts / semaine",
          "1 post / semaine",
          "2 posts / mois"
        ]
      };

    case "Spotify":
      return {
        label: "Fréquence de parution des épisodes",
        sublabel: "Rythme de diffusion du podcast",
        placeholder: "Ex: 1 épisode / quinzaine",
        defaultFrequency: "1 épisode / quinzaine",
        presets: [
          "1 épisode / semaine",
          "1 épisode / quinzaine",
          "2 épisodes / mois",
          "1 épisode / mois",
          "Par saisons (Série)"
        ]
      };

    case "Udemy / Formation":
      return {
        label: "Cadence de mise à jour & modules",
        sublabel: "Fréquence d'ajout de cours ou révisions",
        placeholder: "Ex: 1 nouveau module / mois",
        defaultFrequency: "1 mise à jour / mois",
        presets: [
          "1 nouveau module / mois",
          "1 cours complet / trimestre",
          "Mise à jour mensuelle",
          "Révision annuelle catalogue",
          "Ponctuel (Selon refonte)"
        ]
      };

    case "Produit Digital":
      return {
        label: "Cadence de mise à jour & releases",
        sublabel: "Cycle de versions, e-books, SaaS...",
        placeholder: "Ex: 1 version / mois, correctifs hebdo",
        defaultFrequency: "1 release / mois",
        presets: [
          "1 release majeure / mois",
          "Mises à jour hebdomadaires",
          "1 version / trimestre",
          "Mise à jour selon retours",
          "Édition annuelle"
        ]
      };

    case "Site Web / Blog":
      return {
        label: "Fréquence de parution / Articles",
        sublabel: "Rythme de publication du blog ou média",
        placeholder: "Ex: 2 articles / semaine",
        defaultFrequency: "2 articles / semaine",
        presets: [
          "1 article / jour",
          "2 articles / semaine",
          "1 article / semaine",
          "2 articles / mois",
          "1 newsletter + 1 article / sem"
        ]
      };

    default:
      return {
        label: "Fréquence / Cadence du projet",
        sublabel: "Rythme global d'activité ou de publication",
        placeholder: "Ex: Quotidien, Hebdomadaire, Mensuel, Ponctuel...",
        defaultFrequency: "Hebdomadaire",
        presets: [
          "Quotidien",
          "2-3x / semaine",
          "Hebdomadaire",
          "Bi-mensuel",
          "Mensuel",
          "Ponctuel / Selon besoin"
        ]
      };
  }
}
