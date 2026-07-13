import { 
  DailyHabit, 
  WeeklyObjective,
  FinanceTransaction, 
  FinanceVirement, 
  StockEntry, 
  FinanceBudget, 
  FinanceSalaire, 
  FinanceEpargne, 
  Action30Jours, 
  ProfilAmelioration, 
  PossibiliteGoal, 
  SkinTracker, 
  MealPlanner, 
  AchatMensuel, 
  Abonnement, 
  Formation, 
  MediaItem, 
  Account, 
  ResourceLink, 
  ChannelInfo,
  WishListItem,
  AchatCouteuxItem,
  BookItem,
  ScreenMediaItem,
  MonthlyGoal,
  EditorialEvent
} from "./types";


export const INITIAL_HABITS: DailyHabit[] = [
  { id: "h1", name: "Lire pendant 10 minutes", description: "S'évader et stimuler l'imagination", completed: false, category: "professional" },
  { id: "h2", name: "Apprendre pendant 30 minutes", description: "Suivre une formation ou lire un article technique", completed: false, category: "professional" },
  { id: "h3", name: "Faire du sport", description: "Activité physique (Gym, course, marche)", completed: false, category: "personal" },
  { id: "h4", name: "Préparer le dîner de demain", description: "Planifier ses repas pour gagner du temps", completed: false, category: "personal" },
  { id: "h5", name: "Routine de soins (Skin care)", description: "Nettoyage, hydratation et protection solaire", completed: false, category: "personal" },
  { id: "h6", name: "Méditation & Respiration", description: "5-10 minutes de cohérence cardiaque", completed: false, category: "personal" },
  { id: "h7", name: "Nettoyage rapide de l'espace", description: "Ranger son bureau et sa pièce de travail", completed: false, category: "personal" },
];

export const INITIAL_WEEKLY_OBJECTIVES: WeeklyObjective[] = [
  { id: "o1", text: "Publier au moins 1 vidéo d'impact sur une des chaînes d'élite", completed: false, isPriority: true },
  { id: "o2", text: "Rédiger et planifier 3 articles d'analyse de marché", completed: false },
  { id: "o3", text: "Finaliser un nouveau module de cours pour l'Académie (Udemy/Site)", completed: false },
];

export const INITIAL_TRANSACTIONS: FinanceTransaction[] = [
  { id: "t1", date: "2026-07-01", description: "Honoraires Consulting CFO Maroc", category: "Revenus Pro", type: "Revenue", amount: 18500, account: "Attijariwafa Pro" },
  { id: "t2", date: "2026-07-03", description: "Achat Micro Shure MV7 + Trépied", category: "Équipement", type: "Dépense", amount: 2800, account: "Attijariwafa Pro" },
  { id: "t3", date: "2026-07-05", description: "Sponsorship Vidéo Maroc Telecom", category: "Sponsor", type: "Revenue", amount: 15000, account: "Attijariwafa Pro" },
  { id: "t4", date: "2026-07-06", description: "Café de networking - Casablanca Marina", category: "Repas", type: "Dépense", amount: 120, account: "Espèces Dirhams" },
  { id: "t5", date: "2026-07-08", description: "Abonnement Canva Pro & Adobe Creative", category: "Logiciels", type: "Dépense", amount: 650, account: "Carte CIH" },
  { id: "t6", date: "2026-07-10", description: "Rémunération Google AdSense YouTube", category: "AdSense", type: "Revenue", amount: 4200, account: "Carte CIH" },
  { id: "t7", date: "2026-07-11", description: "Courses hebdomadaires Carrefour", category: "Alimentation", type: "Dépense", amount: 850, account: "Carte CIH" }
];

export const INITIAL_VIREMENTS: FinanceVirement[] = [
  { id: "v1", date: "2026-07-01", description: "Provision d'épargne mensuelle", sourceAccount: "Attijariwafa Pro", targetAccount: "BMCE Épargne", amount: 5000, status: "Exécuté" },
  { id: "v2", date: "2026-07-05", description: "Alimentation compte CIH pour abonnements", sourceAccount: "Attijariwafa Pro", targetAccount: "Carte CIH", amount: 1500, status: "Exécuté" },
  { id: "v3", date: "2026-07-15", description: "Ajustement de trésorerie trimestriel", sourceAccount: "Attijariwafa Pro", targetAccount: "Espèces Dirhams", amount: 3000, status: "Planifié" }
];

export const INITIAL_STOCKS: StockEntry[] = [
  { id: "s1", symbol: "ATW", name: "Attijariwafa Bank", buyPrice: 505.0, currentPrice: 512.5, quantity: 20, lastUpdated: "2026-07-10" },
  { id: "s2", symbol: "IAM", name: "Maroc Telecom", buyPrice: 92.4, currentPrice: 91.8, quantity: 150, lastUpdated: "2026-07-10" },
  { id: "s3", symbol: "BCP", name: "Banque Centrale Populaire", buyPrice: 295.0, currentPrice: 302.0, quantity: 35, lastUpdated: "2026-07-11" },
  { id: "s4", symbol: "TGCC", name: "TGCC S.A. Maroc", buyPrice: 310.0, currentPrice: 325.0, quantity: 50, lastUpdated: "2026-07-11" }
];

export const INITIAL_BUDGETS: FinanceBudget[] = [
  { id: "b1", category: "Alimentation", limitAmount: 3500, spentAmount: 1850, period: "Mensuel" },
  { id: "b2", category: "Équipement & Matériel", limitAmount: 10000, spentAmount: 2800, period: "Mensuel" },
  { id: "b3", category: "Logiciels & SaaS", limitAmount: 1500, spentAmount: 650, period: "Mensuel" },
  { id: "b4", category: "Marketing & Publicité", limitAmount: 4000, spentAmount: 1200, period: "Mensuel" },
  { id: "b5", category: "Transport & Carburant", limitAmount: 2000, spentAmount: 800, period: "Mensuel" },
  { id: "b6", category: "Loisirs & Sorties", limitAmount: 1500, spentAmount: 420, period: "Mensuel" }
];

export const INITIAL_SALAIRES: FinanceSalaire[] = [
  { id: "sa1", date: "2026-07-01", source: "Consulting Mensuel CFO Maroc", grossAmount: 20000, netAmount: 18500, status: "Reçu" },
  { id: "sa2", date: "2026-07-28", source: "Sponsorship Vidéo Banque Populaire", grossAmount: 12000, netAmount: 12000, status: "En attente" },
  { id: "sa3", date: "2026-07-30", source: "Dividendes Actions Portefeuille", grossAmount: 3500, netAmount: 3000, status: "En attente" }
];

export const INITIAL_EPARGNES: FinanceEpargne[] = [
  { id: "e1", name: "Achat Appartement Casablanca", targetAmount: 300000, currentAmount: 145000, deadline: "2028-12-31", status: "En cours" },
  { id: "e2", name: "Fonds d'Urgence (6 mois charges)", targetAmount: 45000, currentAmount: 45000, deadline: "2026-03-31", status: "Atteint" },
  { id: "e3", name: "Nouveau MacBook Pro & Caméra 4K", targetAmount: 35000, currentAmount: 12000, deadline: "2026-12-15", status: "En cours" }
];

export const INITIAL_ACTIONS_30_JOURS: Action30Jours[] = [
  { id: "ac1", dayNumber: 1, taskDescription: "Définir la charte graphique et éditoriale pour 'The Moroccan Analyst'", completed: true, note: "Fait. Couleurs: Vert Émeraude et Or Slate." },
  { id: "ac2", dayNumber: 2, taskDescription: "Installer le matériel audio et optimiser le traitement acoustique", completed: true, note: "Panneaux installés." },
  { id: "ac3", dayNumber: 3, taskDescription: "Rédiger les structures d'accroche pour les Shorts / TikTok", completed: true, note: "Structure en 3 temps (Hook, Body, CTA)." },
  { id: "ac4", dayNumber: 4, taskDescription: "Faire l'analyse comparative des 5 plus grands créateurs de finance", completed: true, note: "Tableau Excel d'analyse rempli." },
  { id: "ac5", dayNumber: 5, taskDescription: "Créer un calendrier éditorial pour les 30 prochains jours", completed: true, note: "Trello configuré." },
  { id: "ac6", dayNumber: 6, taskDescription: "Écrire le premier script complet de la vidéo YouTube d'élite", completed: false, note: "En cours de rédaction." },
  { id: "ac7", dayNumber: 7, taskDescription: "Filmer et monter le premier épisode de l'Académie Financière", completed: false, note: "" },
  { id: "ac8", dayNumber: 8, taskDescription: "Créer un modèle de miniature à fort taux de clic (CTR) sur Photoshop", completed: false, note: "" },
  { id: "ac9", dayNumber: 9, taskDescription: "Optimiser le SEO de la chaîne (Mots clés, description, tags)", completed: false, note: "" }
];

export const INITIAL_PROFIL_AMELIORATIONS: ProfilAmelioration[] = [
  { id: "pa1", focusArea: "Élocution & Voix-Off", status: "En cours", targetDate: "2026-08-31", actionPlan: "Faire 10 min de lecture à voix haute par jour et enregistrer ses podcasts." },
  { id: "pa2", focusArea: "Montage Vidéo Dynamique (CapCut/Premiere)", status: "En cours", targetDate: "2026-09-30", actionPlan: "Suivre la formation avancée et pratiquer le jump-cut et le sound design." },
  { id: "pa3", focusArea: "Analyse Fondamentale des Sociétés de la BVC", status: "Maîtrisé", targetDate: "2026-05-15", actionPlan: "Certifié Analyse Financière Marocaine." },
  { id: "pa4", focusArea: "Storytelling & Écriture de Scripts Captivants", status: "À travailler", targetDate: "2026-10-15", actionPlan: "Lire 'Story' de Robert McKee et analyser les accroches à succès." }
];

export const INITIAL_POSSIBILITES_GOALS: PossibiliteGoal[] = [
  { id: "g1", title: "Atteindre 50 000 abonnés sur YouTube", type: "Court Terme", targetYear: "2026", description: "Produire une vidéo qualitative par semaine sans faute.", completed: false },
  { id: "g2", title: "Lancer la formation phare 'Bourse Maroc Élite'", type: "Court Terme", targetYear: "2026", description: "Un pack complet de 15h de cours vidéo et un accès Discord privé.", completed: false },
  { id: "g3", title: "Atteindre l'Indépendance Financière (Rentier Maroc)", type: "Long Terme", targetYear: "2032", description: "Générer 25 000 MAD de revenus passifs nets par mois via bourse et immo.", completed: false },
  { id: "g4", title: "Écrire un best-seller sur l'Éducation Financière au Maroc", type: "Moyen Terme", targetYear: "2028", description: "Livre broché et Kindle expliquant la gestion d'argent en Darija/Français.", completed: false }
];

export const INITIAL_SKIN_TRACKERS: SkinTracker[] = [
  { id: "sk1", date: "2026-07-09", morningRoutine: true, eveningRoutine: true, skinCondition: "Excellente", productsUsed: "Nettoyant CeraVe, Sérum Vitamine C, Crème Solaire Anthelios, Rétinol le soir", waterIntakeLiters: 2.5 },
  { id: "sk2", date: "2026-07-10", morningRoutine: true, eveningRoutine: true, skinCondition: "Bonne", productsUsed: "Même routine, Crème hydratante intense", waterIntakeLiters: 2.0 },
  { id: "sk3", date: "2026-07-11", morningRoutine: true, eveningRoutine: false, skinCondition: "Sensible", productsUsed: "Eau thermale, Crème apaisante Cicaplast", waterIntakeLiters: 1.5 }
];

export const INITIAL_MEAL_PLANNERS: MealPlanner[] = [
  { id: "m1", dayOfWeek: "Lundi", mealType: "Petit Déjeuner", description: "Pain complet bio, huile d'olive, fromage blanc marocain, thé à la menthe sans sucre", calories: 450, prepared: true },
  { id: "m2", dayOfWeek: "Lundi", mealType: "Déjeuner", description: "Tagine de poulet au citron confit et olives, salade marocaine (tomates, oignons, concombre)", calories: 750, prepared: true },
  { id: "m3", dayOfWeek: "Lundi", mealType: "Dîner", description: "Harira légère (soupe traditionnelle marocaine) avec dattes et figues sèches", calories: 500, prepared: true },
  { id: "m4", dayOfWeek: "Mardi", mealType: "Déjeuner", description: "Pavé de saumon grillé, riz complet et légumes sautés à la marocaine", calories: 680, prepared: false },
  { id: "m5", dayOfWeek: "Mercredi", mealType: "Déjeuner", description: "Couscous d'orge aux sept légumes et bœuf (portion modérée)", calories: 820, prepared: false }
];

export const INITIAL_ACHATS_MENSUELS: AchatMensuel[] = [
  { id: "am1", date: "2026-07-02", itemName: "Appareil photo Sony Alpha 7 IV", store: "Sony Store Casablanca", category: "Matériel", amount: 26000, priority: "Élevée", status: "À acheter" },
  { id: "am2", date: "2026-07-05", itemName: "Lampe LED Elgato Key Light", store: "Amazon.ae (Livraison Maroc)", category: "Matériel", amount: 2200, priority: "Moyenne", status: "Acheté" },
  { id: "am3", date: "2026-07-09", itemName: "Chaise ergonomique de bureau Steelcase", store: "Alpha Bureau Rabat", category: "Mobilier", amount: 6500, priority: "Élevée", status: "À acheter" },
  { id: "am4", date: "2026-07-10", itemName: "Template Notion Ultimate Creator Studio", store: "Gumroad", category: "Logiciel", amount: 490, priority: "Faible", status: "Acheté" }
];

export const INITIAL_ABONNEMENTS: Abonnement[] = [
  { id: "ab1", serviceName: "ChatGPT Plus & API Gemini Pro", costMonthly: 250, billingPeriod: "Mensuel", nextBillingDate: "2026-07-25", status: "Actif" },
  { id: "ab2", serviceName: "Canva Pro (Équipe)", costMonthly: 150, billingPeriod: "Mensuel", nextBillingDate: "2026-08-01", status: "Actif" },
  { id: "ab3", serviceName: "Adobe Creative Cloud complet", costMonthly: 600, billingPeriod: "Mensuel", nextBillingDate: "2026-07-28", status: "Actif" },
  { id: "ab4", serviceName: "Hébergement Hostinger + Nom de Domaine", costMonthly: 80, billingPeriod: "Mensuel", nextBillingDate: "2026-11-12", status: "Actif" },
  { id: "ab5", serviceName: "Epidemic Sound (Musiques libres)", costMonthly: 180, billingPeriod: "Mensuel", nextBillingDate: "2026-08-05", status: "Actif" }
];

export const INITIAL_FORMATIONS: Formation[] = [
  { id: "f1", title: "Production & Direction Artistique Cinématographique", instructor: "Badr Din", platform: "Udemy Maroc", durationHours: 18, progressPercent: 65, status: "En cours" },
  { id: "f2", title: "Storytelling et structure narrative pour vidéos YouTube", instructor: "Ali El Merouani", platform: "Skillshare", durationHours: 8, progressPercent: 100, status: "Terminé" },
  { id: "f3", title: "Publicité Digitale Optimisée sur Facebook & TikTok ADS", instructor: "Sarah Kamal", platform: "E-learning Hub", durationHours: 12, progressPercent: 20, status: "En cours" }
];

export const INITIAL_BOOKS: BookItem[] = [
  { id: "b1", title: "The Intelligent Investor", author: "Benjamin Graham", status: "En cours", currentPage: 210, totalPages: 480, genre: "Finance / Investissement", rating: 5, notes: "Une référence absolue sur la valeur d'investissement." },
  { id: "b2", title: "Père Riche Père Pauvre", author: "Robert Kiyosaki", status: "Terminé", currentPage: 240, totalPages: 240, genre: "Éducation Financière", rating: 3, notes: "Idées de mindset sur la différence entre actif et passif." },
  { id: "b3", title: "Zero to One", author: "Peter Thiel", status: "À lire", currentPage: 0, totalPages: 220, genre: "Entrepreneuriat", rating: 0, notes: "À lire pour comprendre les monopoles et l'innovation." }
];

export const INITIAL_SCREENMEDIA: ScreenMediaItem[] = [
  { id: "sm1", title: "Billions", type: "Série", status: "En cours", currentEpisode: 8, totalEpisodes: 12, season: 4, rating: 5, notes: "Saison 4 - Excellente tension dramatique autour de la haute finance.", platform: "Netflix" },
  { id: "sm2", title: "Wall Street: Money Never Sleeps", type: "Film", status: "Terminé", rating: 4, notes: "Bonne suite du classique, très axé sur la crise de 2008.", platform: "Prime Video" },
  { id: "sm3", title: "Death Note", type: "Anime", status: "À regarder", currentEpisode: 0, totalEpisodes: 37, season: 1, rating: 0, notes: "Recommandé pour le suspense tactique.", platform: "Netflix" },
  { id: "sm4", title: "Spirited Away", type: "Anime", status: "Terminé", rating: 5, notes: "Chef-d'œuvre de Ghibli.", platform: "Crunchyroll" }
];


export const INITIAL_ACCOUNTS: Account[] = [
  { id: "acct1", name: "Attijariwafa Pro Main", type: "Bancaire", balance: 145800, currency: "MAD" },
  { id: "acct2", name: "CIH E-Commerce", type: "Bancaire", balance: 12450, currency: "MAD" },
  { id: "acct3", name: "BMCE Épargne Or", type: "Bancaire", balance: 75000, currency: "MAD" },
  { id: "acct4", name: "Espèces Dirhams (Coffre)", type: "Espèces", balance: 8400, currency: "MAD" },
  { id: "acct5", name: "Binance (Crypto BTC/USDT)", type: "Crypto", balance: 2500, currency: "USD" }
];

export const INITIAL_RESOURCELINKS: ResourceLink[] = [
  { id: "l1", title: "Bourse de Casablanca (BVC) - Cours en temps réel", url: "https://www.leboursier.ma", category: "Outils", rating: 5 },
  { id: "l2", title: "Maroc Lex (Portail National des Textes Juridiques)", url: "http://www.sgg.gov.ma", category: "Ressources", rating: 4 },
  { id: "l3", title: "Office des Changes Maroc - Règlements & Devises", url: "https://www.oc.gov.ma", category: "Ressources", rating: 5 },
  { id: "l4", title: "Unsplash - Photos libres de droit gratuites", url: "https://unsplash.com", category: "Inspiration", rating: 4 }
];

export const INITIAL_CHANNELS: ChannelInfo[] = [
  { id: "ch1", name: "The Moroccan Analyst", platform: "YouTube", subscriberCount: 24500, niche: "Analyse économique marocaine", frequency: "1 vidéo / semaine" },
  { id: "ch2", name: "The Moroccan CFO", platform: "TikTok", subscriberCount: 42000, niche: "Finance d'entreprise & astuces PME", frequency: "3 vidéos / semaine" },
  { id: "ch3", name: "The Moroccan Economist", platform: "LinkedIn", subscriberCount: 11200, niche: "Analyses géopolitiques & Macroéconomie", frequency: "2 articles / semaine" },
  { id: "ch4", name: "Moroccan CFO Podcast", platform: "Spotify", subscriberCount: 1500, niche: "Interviews avec des leaders économiques", frequency: "1 épisode / 2 semaines" }
];

export const INITIAL_WISHLIST: WishListItem[] = [
  { id: "wl1", itemName: "Villa Éco-conçue à Bouskoura", store: "Immobilier Prestige", estimatedPrice: 4500000, priority: "Rêve", link: "https://www.prestige.ma", note: "Grand jardin et piscine solaire." },
  { id: "wl2", itemName: "Porsche Taycan Électrique", store: "Centre Porsche Casablanca", estimatedPrice: 1200000, priority: "Rêve", link: "https://www.porsche.com/pap/_morocco_/", note: "Le summum de la technologie et de l'élégance." },
  { id: "wl3", itemName: "Studio de Production Complet", store: "Casablanca Sound", estimatedPrice: 150000, priority: "Peut-être", link: "", note: "Pour des podcasts de qualité broadcast internationale." }
];

export const INITIAL_ACHATS_COUTEUX: AchatCouteuxItem[] = [
  { id: "acc1", itemName: "Nouveau Drone DJI Inspire 3", targetDate: "2026-10-30", estimatedPrice: 85000, status: "Économise", store: "Drone Maroc", priority: "Prioritaire" },
  { id: "acc2", itemName: "Objectif Cinéma Arri Alexa Mini", targetDate: "2026-12-15", estimatedPrice: 42000, status: "Planifié", store: "CineGears Casablanca", priority: "Secondaire" },
  { id: "acc3", itemName: "Mac Studio M2 Ultra (128 Go RAM)", targetDate: "2026-09-01", estimatedPrice: 55000, status: "Économise", store: "iStyle Maroc", priority: "Prioritaire" }
];

export const INITIAL_MONTHLY_GOALS: MonthlyGoal[] = [
  {
    id: "mg1",
    month: "2026-07",
    channelName: "The Moroccan Analyst",
    targetRevenue: 12000,
    currentRevenue: 8500,
    targetFollowers: 500,
    currentFollowers: 320,
    note: "Optimiser l'intégration sponsorisée de la prochaine vidéo"
  },
  {
    id: "mg2",
    month: "2026-07",
    channelName: "The Moroccan CFO",
    targetRevenue: 20000,
    currentRevenue: 15500,
    targetFollowers: 2500,
    currentFollowers: 1800,
    note: "Augmenter la fréquence sur TikTok à 4 publications par semaine"
  },
  {
    id: "mg3",
    month: "2026-07",
    channelName: "The Moroccan Economist",
    targetRevenue: 8000,
    currentRevenue: 4000,
    targetFollowers: 800,
    currentFollowers: 620,
    note: "Série d'articles macro sur l'industrie automobile au Maroc"
  }
];

export const INITIAL_EDITORIAL_EVENTS: EditorialEvent[] = [
  {
    id: "ee1",
    title: "Comment investir en Bourse au Maroc en 2026 ? (Guide Complet)",
    channelName: "The Moroccan Analyst",
    platform: "YouTube",
    scheduledDate: "2026-07-10",
    status: "Publié",
    contentType: "Vidéo Longue",
    notes: "Vidéo de 25 minutes avec chapitres. Bien insérer le lien du sponsor en description."
  },
  {
    id: "ee2",
    title: "Le Guide Ultime de la Fiche de Paie au Maroc (Calcul & Taxes)",
    channelName: "The Moroccan CFO",
    platform: "YouTube",
    scheduledDate: "2026-07-14",
    status: "Planifié",
    contentType: "Vidéo Longue",
    notes: "Sera publié mardi à 18h. Le montage est finalisé, miniature validée."
  },
  {
    id: "ee3",
    title: "Analyse du Nouveau Modèle Industriel Marocain",
    channelName: "The Moroccan Economist",
    platform: "YouTube",
    scheduledDate: "2026-07-18",
    status: "En cours",
    contentType: "Vidéo Longue",
    notes: "Rédaction du script en cours. Enregistrer les voix off jeudi."
  },
  {
    id: "ee4",
    title: "3 Erreurs de Gestion Financière qui tuent les Startups",
    channelName: "The Moroccan CFO",
    platform: "TikTok",
    scheduledDate: "2026-07-12",
    status: "Publié",
    contentType: "Short / Reel",
    notes: "Short d'une minute à fort impact. Bon taux de rétention attendu."
  },
  {
    id: "ee5",
    title: "Perspectives de la Banque Centrale du Maroc (Inflation & Taux)",
    channelName: "The Moroccan Analyst",
    platform: "LinkedIn",
    scheduledDate: "2026-07-16",
    status: "Brouillon",
    contentType: "Post Écrit",
    notes: "Post d'analyse macro-économique rapide avec infographie."
  }
];



