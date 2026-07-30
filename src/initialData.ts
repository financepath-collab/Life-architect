import { 
  DailyHabit, 
  WeeklyObjective,
  FinanceTransaction, 
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
  EditorialEvent,
  ProjectFolder
} from "./types";


export const INITIAL_HABITS: DailyHabit[] = [
  { id: "h1", name: "Lire pendant 10 minutes", description: "S'évader et stimuler l'imagination", completed: false, category: "Mental", isImportant: false, dueTime: "", frequency: "Quotidien" },
  { id: "h2", name: "Apprendre pendant 30 minutes", description: "Suivre une formation ou lire un article technique", completed: false, category: "Career", isImportant: true, dueTime: "12:00", frequency: "Quotidien" },
  { id: "h3", name: "Faire du sport", description: "Activité physique (Gym, course, marche)", completed: false, category: "Health", isImportant: true, dueTime: "08:00", frequency: "Quotidien" },
  { id: "h4", name: "Planification de la semaine", description: "Définir les priorités et jalons stratégiques de la semaine", completed: false, category: "Career", isImportant: true, dueTime: "", frequency: "Hebdomadaire" },
  { id: "h5", name: "Bilan comptable & financier mensuel", description: "Vérifier le solde des comptes, le budget et l'épargne", completed: false, category: "Finance", isImportant: true, dueTime: "", frequency: "Mensuel" },
  { id: "h6", name: "Routine de soins (Skin care)", description: "Nettoyage, hydratation et protection solaire", completed: false, category: "Health", isImportant: true, dueTime: "09:00", frequency: "Quotidien" },
  { id: "h7", name: "Grande session de ménage & tri", description: "Ménage approfondi et réorganisation de l'espace de vie", completed: false, category: "Personal", isImportant: false, dueTime: "", frequency: "Hebdomadaire" },
  { id: "h8", name: "Révision des abonnements & charges", description: "Analyser les préélèvements et résilier les services inutiles", completed: false, category: "Finance", isImportant: false, dueTime: "", frequency: "Mensuel" },
];

export const INITIAL_WEEKLY_OBJECTIVES: WeeklyObjective[] = [
  { id: "o1", text: "Publier au moins 1 vidéo d'impact sur une des chaînes d'élite", completed: false, isPriority: true },
  { id: "o2", text: "Rédiger et planifier 3 articles d'analyse de marché", completed: false },
  { id: "o3", text: "Finaliser un nouveau module de cours pour l'Académie (Udemy/Site)", completed: false },
];

export const INITIAL_TRANSACTIONS: FinanceTransaction[] = [
  // July 2026 transactions
  { id: "tx_1", date: "2026-07-05", description: "Abonnement AWS & Hostinger Cloud", amount: 1250, type: "Dépense", category: "Logiciels & SaaS", account: "Compte Courant CIH", status: "Validé" },
  { id: "tx_2", date: "2026-07-12", description: "Courses Carrefour & Supermarché", amount: 2850, type: "Dépense", category: "Alimentation", account: "Compte Courant CIH", status: "Validé" },
  { id: "tx_3", date: "2026-07-15", description: "Plein Carburant Shell", amount: 750, type: "Dépense", category: "Transport & Carburant", account: "Compte Courant CIH", status: "Validé" },
  { id: "tx_4", date: "2026-07-22", description: "Mission Freelance Design UI", amount: 8500, type: "Revenue", category: "Prestation / Consulting", account: "Compte Courant Attijari", status: "Validé" },
  { id: "tx_5", date: "2026-07-25", description: "Achat Équipement Micro Shure", amount: 3200, type: "Dépense", category: "Équipement & Matériel", account: "Compte Courant Attijari", status: "Validé" },

  // June 2026 transactions
  { id: "tx_6", date: "2026-06-08", description: "Supermarché Marjane Anfa", amount: 3400, type: "Dépense", category: "Alimentation", account: "Compte Courant CIH", status: "Validé" },
  { id: "tx_7", date: "2026-06-14", description: "Entretien Véhicule & Vidange", amount: 1800, type: "Dépense", category: "Transport & Carburant", account: "Compte Courant CIH", status: "Validé" },
  { id: "tx_8", date: "2026-06-20", description: "Sorties & Restaurants", amount: 1450, type: "Dépense", category: "Loisirs & Sorties", account: "Compte Courant CIH", status: "Validé" },
  { id: "tx_9", date: "2026-06-27", description: "Consulting Stratégie Digital", amount: 5000, type: "Revenue", category: "Prestation / Consulting", account: "Compte Courant Attijari", status: "Validé" }
];

export const INITIAL_STOCKS: StockEntry[] = [
  { id: "s1", symbol: "ATW", name: "Attijariwafa Bank", buyPrice: 505.0, currentPrice: 512.5, quantity: 20, lastUpdated: "2026-07-10" },
  { id: "s2", symbol: "IAM", name: "Maroc Telecom", buyPrice: 92.4, currentPrice: 91.8, quantity: 150, lastUpdated: "2026-07-10" },
  { id: "s3", symbol: "BCP", name: "Banque Centrale Populaire", buyPrice: 295.0, currentPrice: 302.0, quantity: 35, lastUpdated: "2026-07-11" },
  { id: "s4", symbol: "TGCC", name: "TGCC S.A. Maroc", buyPrice: 310.0, currentPrice: 325.0, quantity: 50, lastUpdated: "2026-07-11" }
];

export const INITIAL_BUDGETS: FinanceBudget[] = [
  { id: "b1", category: "Alimentation", limitAmount: 3500, spentAmount: 0, period: "Mensuel" },
  { id: "b2", category: "Équipement & Matériel", limitAmount: 10000, spentAmount: 0, period: "Mensuel" },
  { id: "b3", category: "Logiciels & SaaS", limitAmount: 1500, spentAmount: 0, period: "Mensuel" },
  { id: "b4", category: "Marketing & Publicité", limitAmount: 4000, spentAmount: 0, period: "Mensuel" },
  { id: "b5", category: "Transport & Carburant", limitAmount: 2000, spentAmount: 0, period: "Mensuel" },
  { id: "b6", category: "Loisirs & Sorties", limitAmount: 1500, spentAmount: 0, period: "Mensuel" }
];

export const INITIAL_SALAIRES: FinanceSalaire[] = [
  {
    id: "sal_2026_07",
    date: "2026-07-28",
    source: "Employeur principal (Tech Inc)",
    grossAmount: 48000,
    netAmount: 35000,
    status: "Reçu",
    jour_paiement: 28
  },
  {
    id: "sal_2026_06",
    date: "2026-06-28",
    source: "Employeur principal (Tech Inc)",
    grossAmount: 48000,
    netAmount: 35000,
    status: "Reçu",
    jour_paiement: 28
  }
];

export const INITIAL_EPARGNES: FinanceEpargne[] = [
  { id: "e1", name: "Fonds d'urgence (3 mois) - Sécurité", targetAmount: 42000, currentAmount: 42000, deadline: "2026-06-30", status: "Atteint" },
  { id: "e2", name: "Investissement BVC - Investissement", targetAmount: 60000, currentAmount: 35000, deadline: "2026-12-31", status: "En cours" },
  { id: "e3", name: "MAISON STUDIO - Autre", targetAmount: 250000, currentAmount: 45000, deadline: "2028-12-31", status: "En cours" },
  { id: "e4", name: "City trip Europe (Paris, Bruxelles, Amsterdam)", targetAmount: 25000, currentAmount: 12000, deadline: "2026-08-31", status: "En cours" },
  { id: "e5", name: "Espagne & Portugal (Séville, Lisbonne, Porto)", targetAmount: 20000, currentAmount: 5000, deadline: "2027-05-31", status: "En cours" },
  { id: "e6", name: "Certification FMVA CFI - Formation", targetAmount: 5000, currentAmount: 5000, deadline: "2026-04-30", status: "Atteint" },
  { id: "e7", name: "Tenue professionnelle (Costumes entretiens) - Mode", targetAmount: 1000, currentAmount: 600, deadline: "2026-08-15", status: "En cours" },
  { id: "e8", name: "Chaise Ergonomique - Contenu", targetAmount: 2000, currentAmount: 2000, deadline: "2026-07-10", status: "Atteint" },
  { id: "e9", name: "Abonnement gym de Salle de sport", targetAmount: 4000, currentAmount: 1500, deadline: "2026-09-30", status: "En cours" },
  { id: "e10", name: "Console de jeu Nintendo Switch", targetAmount: 6000, currentAmount: 2000, deadline: "2026-11-25", status: "En cours" },
  { id: "e11", name: "Moto de ville (Yamaha MT-07)", targetAmount: 85000, currentAmount: 8000, deadline: "2027-04-30", status: "En cours" },
  { id: "e12", name: "Caravane de Voyage Aménagée", targetAmount: 180000, currentAmount: 15000, deadline: "2028-06-30", status: "En cours" },
  { id: "e13", name: "Villa Éco-conçue à Bouskoura (Rêve)", targetAmount: 4500000, currentAmount: 150000, deadline: "2030-12-31", status: "En cours" },
  { id: "e14", name: "Porsche Taycan Électrique (Rêve)", targetAmount: 1200000, currentAmount: 50000, deadline: "2029-12-31", status: "En cours" },
  { id: "e15", name: "Studio de Production Complet", targetAmount: 150000, currentAmount: 30000, deadline: "2027-06-30", status: "En cours" },
  { id: "e16", name: "Drone DJI Air 3S Fly More Combo", targetAmount: 16500, currentAmount: 4000, deadline: "2026-12-15", status: "En cours" },
  { id: "e17", name: "Voiture Hybride Moderne", targetAmount: 290000, currentAmount: 45000, deadline: "2028-09-30", status: "En cours" }
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
  { 
    id: "g1", 
    title: "Atteindre 50 000 abonnés sur YouTube", 
    type: "Court Terme", 
    targetYear: "2026", 
    description: "Produire une vidéo qualitative par semaine sans faute.", 
    completed: false,
    milestones: [
      { id: "g1_m1", title: "Atteindre 10 000 abonnés", completed: true, dueDate: "2026-02-15" },
      { id: "g1_m2", title: "Atteindre 25 000 abonnés", completed: false, dueDate: "2026-06-30" },
      { id: "g1_m3", title: "Atteindre 40 000 abonnés", completed: false, dueDate: "2026-10-15" },
      { id: "g1_m4", title: "Atteindre 50 000 abonnés", completed: false, dueDate: "2026-12-31" }
    ]
  },
  { 
    id: "g2", 
    title: "Lancer la formation phare 'Bourse Maroc Élite'", 
    type: "Court Terme", 
    targetYear: "2026", 
    description: "Un pack complet de 15h de cours vidéo et un accès Discord privé.", 
    completed: false,
    milestones: [
      { id: "g2_m1", title: "Rédiger le plan détaillé de la formation (15 modules)", completed: true, dueDate: "2026-03-01" },
      { id: "g2_m2", title: "Enregistrer les 5 premiers modules", completed: true, dueDate: "2026-05-15" },
      { id: "g2_m3", title: "Créer le serveur Discord privé & configurer les rôles", completed: false, dueDate: "2026-08-01" },
      { id: "g2_m4", title: "Finaliser les vidéos restantes et lancer le site de vente", completed: false, dueDate: "2026-09-15" }
    ]
  },
  { 
    id: "g3", 
    title: "Atteindre l'Indépendance Financière (Rentier Maroc)", 
    type: "Long Terme", 
    targetYear: "2032", 
    description: "Générer 25 000 MAD de revenus passifs nets par mois via bourse et immo.", 
    completed: false,
    milestones: [
      { id: "g3_m1", title: "Atteindre un capital de 500 000 MAD en Bourse", completed: true, dueDate: "2027-12-31" },
      { id: "g3_m2", title: "Acheter un premier bien immobilier locatif à Casablanca", completed: false, dueDate: "2029-06-30" },
      { id: "g3_m3", title: "Faire passer le capital bourse à 1 500 000 MAD", completed: false, dueDate: "2031-12-31" },
      { id: "g3_m4", title: "Atteindre un cashflow net récurrent de 25 000 MAD/mois", completed: false, dueDate: "2032-12-31" }
    ]
  },
  { 
    id: "g4", 
    title: "Écrire un best-seller sur l'Éducation Financière au Maroc", 
    type: "Moyen Terme", 
    targetYear: "2028", 
    description: "Livre broché et Kindle expliquant la gestion d'argent en Darija/Français.", 
    completed: false,
    milestones: [
      { id: "g4_m1", title: "Élaborer la structure globale et le plan des chapitres", completed: true, dueDate: "2026-09-01" },
      { id: "g4_m2", title: "Rédiger la première moitié (Chapitres 1 à 5)", completed: false, dueDate: "2027-03-01" },
      { id: "g4_m3", title: "Faire relire par un comité de relecture & apporter les corrections", completed: false, dueDate: "2027-10-15" },
      { id: "g4_m4", title: "Lancer la campagne de précommande et imprimer le premier tirage", completed: false, dueDate: "2028-04-01" }
    ]
  }
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
  { id: "acct_attijari", name: "Attijariwafa Bank (Compte Courant)", type: "Bancaire", balance: 45000, currency: "MAD", usage: "Réception du salaire & Paiement des charges mensuelles" },
  { id: "acct_bp_carnet", name: "Banque Populaire (Compte sur Carnet)", type: "Bancaire", balance: 85000, currency: "MAD", usage: "Réservé à l'Épargne de précaution & Fonds de Secours" },
  { id: "acct_bp_cheque", name: "Banque Populaire (Compte Chèque Bourse)", type: "Bancaire", balance: 35000, currency: "MAD", usage: "Opérations de Bourse (BVC) & Portefeuille Titres" },
  { id: "acct_cash", name: "Espèces Dirhams (Coffre)", type: "Espèces", balance: 5000, currency: "MAD", usage: "Réserve physique liquide" }
];

export const INITIAL_RESOURCELINKS: ResourceLink[] = [
  { id: "l1", title: "Bourse de Casablanca (BVC) - Cours en temps réel", url: "https://www.leboursier.ma", category: "Outils", rating: 5 },
  { id: "l2", title: "Maroc Lex (Portail National des Textes Juridiques)", url: "http://www.sgg.gov.ma", category: "Ressources", rating: 4 },
  { id: "l3", title: "Office des Changes Maroc - Règlements & Devises", url: "https://www.oc.gov.ma", category: "Ressources", rating: 5 },
  { id: "l4", title: "Unsplash - Photos libres de droit gratuites", url: "https://unsplash.com", category: "Inspiration", rating: 4 }
];

export const INITIAL_CHANNELS: ChannelInfo[] = [
  { 
    id: "ch1", 
    name: "The Moroccan Analyst", 
    platform: "YouTube", 
    subscriberCount: 24500, 
    niche: "Analyse économique marocaine", 
    frequency: "1 vidéo / semaine",
    email: "contact.analyst@themacircle.ma",
    credentials: [
      { id: "cred1", label: "Studio YouTube & Google Workspace", email: "yt.analyst@themacircle.ma", password: "••••••••", notes: "Accès créateur YouTube Studio" },
      { id: "cred2", label: "Compte Canva Pro Design", email: "graphics@themacircle.ma", password: "••••••••", notes: "Templates miniatures YouTube" }
    ],
    ideas: [
      { id: "id1", title: "Analyse de la Bourse de Casablanca - T3 2026", description: "Revue des tops actions BVC et dividendes 2026", status: "En préparation", deadline: "2026-08-05" },
      { id: "id2", title: "Décryptage Inflation & Taux Directeur BAM", description: "Impact sur les crédits immobiliers au Maroc", status: "Idée", deadline: "2026-08-20" }
    ],
    usefulLinks: [
      { id: "link1", title: "YouTube Creator Studio", url: "https://studio.youtube.com", category: "Production" },
      { id: "link2", title: "LeBoursier Maroc - LeBoursier.ma", url: "https://www.leboursier.ma", category: "Sources" }
    ],
    deadlines: [
      { id: "d1", title: "Tournage Épisode 48 - BVC", dueDate: "2026-08-02", status: "En cours" },
      { id: "d2", title: "Validation de la miniature & Titre SEO", dueDate: "2026-08-04", status: "À faire" }
    ]
  },
  { 
    id: "ch2", 
    name: "The Moroccan CFO", 
    platform: "TikTok", 
    subscriberCount: 42000, 
    niche: "Finance d'entreprise & astuces PME", 
    frequency: "3 vidéos / semaine",
    email: "cfo@themacircle.ma",
    credentials: [
      { id: "cred3", label: "Compte TikTok Entreprise", email: "tiktok.cfo@themacircle.ma", password: "••••••••", notes: "Accès mobile TikTok Business" }
    ],
    ideas: [
      { id: "id3", title: "3 erreurs de trésorerie mortelles en PME", description: "Format court TikTok 60 secondes", status: "Prêt", deadline: "2026-07-28" },
      { id: "id4", title: "Comment négocier son salaire de DAF au Maroc", description: "Conseils pratiques pour financiers", status: "Idée", deadline: "2026-08-10" },
      { id: "cfo_idea_1", title: "Une Annuité : Définition, Calcul & Amortissement d'Emprunt", description: "Comprendre les annuités constantes, la capitalisation et le remboursement d'emprunt bancaire.", status: "Idée", deadline: "2026-08-05" },
      { id: "cfo_idea_2", title: "Valeur Vénale : Évaluation d'Actif, Immobilier & Entreprise", description: "Comprendre la différence fondamentale entre valeur comptable nette (VCN) et valeur vénale de marché.", status: "Idée", deadline: "2026-08-12" },
      { id: "cfo_idea_3", title: "Encours Financier & Maîtrise de la Trésorerie / BFR", description: "Gestion de l'encours client et fournisseur, réduction du BFR et prévention des impayés.", status: "Idée", deadline: "2026-08-19" },
      { id: "cfo_idea_4", title: "Charges Fixes vs Charges Variables & Seuil de Rentabilité", description: "Calculer la Marge sur Coût Variable (MCV), le Seuil de Rentabilité (SR) et le Point Mort.", status: "Idée", deadline: "2026-08-26" },
      { id: "cfo_idea_5", title: "Comptabilité Analytique vs Comptabilité Générale", description: "Pourquoi la compta légale obligatoire ne suffit pas et comment la compta de gestion pilote l'entreprise.", status: "Idée", deadline: "2026-09-02" }
    ],
    usefulLinks: [
      { id: "link3", title: "TikTok Ads Manager", url: "https://ads.tiktok.com", category: "Marketing" }
    ],
    deadlines: [
      { id: "d3", title: "Montage des 3 Short Reels de la semaine", dueDate: "2026-07-29", status: "En cours" }
    ]
  },
  { 
    id: "ch3", 
    name: "The Moroccan Economist", 
    platform: "LinkedIn", 
    subscriberCount: 11200, 
    niche: "Analyses géopolitiques & Macroéconomie", 
    frequency: "2 articles / semaine",
    email: "economist@themacircle.ma",
    credentials: [
      { id: "cred4", label: "Page LinkedIn Entreprise", email: "linkedin@themacircle.ma", password: "••••••••", notes: "Administration de la page LinkedIn" }
    ],
    ideas: [
      { id: "id5", title: "Perspectives de la Banque Mondiale Maroc 2026", description: "Synthèse infographique carrousel PDF", status: "En préparation", deadline: "2026-08-01" }
    ],
    usefulLinks: [
      { id: "link4", title: "Haut-Commissariat au Plan (HCP)", url: "https://www.hcp.ma", category: "Statistiques" }
    ],
    deadlines: [
      { id: "d4", title: "Publication Article Macroéconomie", dueDate: "2026-07-31", status: "À faire" }
    ]
  },
  { 
    id: "ch4", 
    name: "Moroccan CFO Podcast", 
    platform: "Spotify", 
    subscriberCount: 1500, 
    niche: "Interviews avec des leaders économiques", 
    frequency: "1 épisode / 2 semaines",
    email: "podcast@themacircle.ma",
    credentials: [
      { id: "cred5", label: "Spotify for Podcasters", email: "spotify.podcast@themacircle.ma", password: "••••••••", notes: "Flux RSS & Analytics Spotify" }
    ],
    ideas: [
      { id: "id6", title: "Interview DAF d'un grand groupe bancaire", description: "Sujet : Transformation digitale des services financiers", status: "Idée", deadline: "2026-08-15" }
    ],
    usefulLinks: [
      { id: "link5", title: "Spotify Podcasters Dashboard", url: "https://podcasters.spotify.com", category: "Diffusion" }
    ],
    deadlines: [
      { id: "d5", title: "Mixage Audio Épisode #12", dueDate: "2026-08-08", status: "À faire" }
    ]
  },
  { 
    id: "ch5", 
    name: "L'Académie THE MA CIRCLE", 
    platform: "Autre", 
    subscriberCount: 3800, 
    niche: "Formations en Finance, Modélisation, BVC & Carrière", 
    frequency: "Projet Digital & Plateforme E-learning",
    email: "academie@themacircle.ma",
    credentials: [
      { id: "cred6", label: "Plateforme LMS & Portail Élèves", email: "admin.lms@themacircle.ma", password: "••••••••", notes: "Backoffice de gestion des cours et certifications" },
      { id: "cred7", label: "Passerelle de Paiement CMI", email: "payments@themacircle.ma", password: "••••••••", notes: "Gestion des encaissements abonnements & cours" }
    ],
    ideas: [
      { id: "id7", title: "Lancement du Module Modélisation Financière LBO", description: "Cas pratique Excel & Valorisation d'entreprise", status: "En préparation", deadline: "2026-09-01" },
      { id: "id8", title: "Masterclass Bourse de Casablanca & Trading BVC", description: "Guide complet pour investisseurs particuliers marocains", status: "Idée", deadline: "2026-09-15" }
    ],
    usefulLinks: [
      { id: "link6", title: "Portail Formations THE MA CIRCLE", url: "https://academie.themacircle.ma", category: "LMS" },
      { id: "link7", title: "Espace Étudiants & Replays", url: "https://academie.themacircle.ma/e-learning", category: "Cours" }
    ],
    deadlines: [
      { id: "d6", title: "Mise à jour des supports du cours Modélisation", dueDate: "2026-08-10", status: "En cours" },
      { id: "d7", title: "Session Q&A en Direct avec les étudiants", dueDate: "2026-08-25", status: "À faire" }
    ]
  }
];

export const INITIAL_WISHLIST: WishListItem[] = [
  { id: "wl1", itemName: "Villa Éco-conçue à Bouskoura", store: "Immobilier Prestige", estimatedPrice: 4500000, priority: "Rêve", link: "https://www.prestige.ma", note: "Grand jardin et piscine solaire." },
  { id: "wl2", itemName: "Porsche Taycan Électrique", store: "Centre Porsche Casablanca", estimatedPrice: 1200000, priority: "Rêve", link: "https://www.porsche.com/pap/_morocco_/", note: "Le summum de la technologie et de l'élégance." },
  { id: "wl3", itemName: "Studio de Production Complet", store: "Casablanca Sound", estimatedPrice: 150000, priority: "Peut-être", link: "", note: "Pour des podcasts de qualité broadcast internationale." },
  { id: "wl4", itemName: "Tenue professionnelle / Costumes d'entretiens", store: "Zara / Massimo Dutti", estimatedPrice: 3500, priority: "Bientôt", link: "", note: "Costumes élégants de qualité pour réunions stratégiques et entretiens." },
  { id: "wl5", itemName: "Pack Microphone Shure SM7B & Wave XLR", store: "GrosBill Casablanca", estimatedPrice: 6200, priority: "Bientôt", link: "", note: "Le micro de référence des podcasters pour un son d'une netteté absolue." },
  { id: "wl6", itemName: "Console de jeu Nintendo Switch OLED", store: "Virgin Megastore", estimatedPrice: 4200, priority: "Peut-être", link: "", note: "Pour la détente saine après des sessions d'analyse intenses." },
  { id: "wl7", itemName: "Moto de ville (Yamaha MT-07)", store: "Yamaha Maroc", estimatedPrice: 85000, priority: "Rêve", link: "", note: "Idéal pour naviguer rapidement en milieu urbain dense." },
  { id: "wl8", itemName: "Caravane de Voyage Aménagée", store: "Maroc Caravanes", estimatedPrice: 180000, priority: "Rêve", link: "", note: "Pour des voyages et sessions de travail en digital nomad." },
  { id: "wl9", itemName: "Drone DJI Air 3S Fly More Combo", store: "DJI Store Casablanca", estimatedPrice: 16500, priority: "Peut-être", link: "", note: "Pour capturer des plans aériens épiques pour les productions vidéo." },
  { id: "wl10", itemName: "Voiture Hybride Moderne", store: "Toyota Casablanca", estimatedPrice: 290000, priority: "Rêve", link: "", note: "Économe, fiable et confortable pour les déplacements interurbains." },
  { id: "wl11", itemName: "Montre Classique Automatique", store: "Krone Casablanca", estimatedPrice: 14000, priority: "Peut-être", link: "", note: "Accessoire de distinction intemporel." },
  { id: "wl12", itemName: "Parfum d'Exception (Bleu de Chanel)", store: "Beauty Success", estimatedPrice: 1600, priority: "Bientôt", link: "", note: "Signature olfactive professionnelle mémorable." }
];

export const INITIAL_ACHATS_COUTEUX: AchatCouteuxItem[] = [
  { id: "acc-macbook", itemName: "MacBook Pro M3 Max (ReLab)", targetDate: "2026-08-15", estimatedPrice: 32000, status: "Économise", store: "https://relab.ma/page-de-produit/macbook", priority: "Prioritaire" },
  { id: "acc-dji", itemName: "Drone DJI Air 3S Fly More Combo", targetDate: "2026-10-30", estimatedPrice: 16500, status: "Planifié", store: "DJI Store Casablanca", priority: "Secondaire" },
  { id: "acc-auto", itemName: "Voiture Hybride Moderne (Automobile)", targetDate: "2027-06-30", estimatedPrice: 290000, status: "Planifié", store: "Toyota Casablanca", priority: "Secondaire" },
  { id: "acc-watch", itemName: "Montre Classique Automatique", targetDate: "2026-12-25", estimatedPrice: 14000, status: "Planifié", store: "Krone Casablanca", priority: "Faible" },
  { id: "acc-perfume", itemName: "Parfum d'Exception (Bleu de Chanel)", targetDate: "2026-09-10", estimatedPrice: 1600, status: "Planifié", store: "Beauty Success", priority: "Faible" }
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
  },
  {
    id: "ee_cfo_1",
    title: "Une Annuité : Définition, Calcul & Amortissement d'Emprunt",
    channelName: "The Moroccan CFO",
    platform: "YouTube",
    scheduledDate: "2026-08-05",
    status: "Brouillon",
    contentType: "Vidéo Longue",
    notes: "Explication claire des annuités, valeur actuelle/future et tableau d'amortissement d'emprunt."
  },
  {
    id: "ee_cfo_2",
    title: "Valeur Vénale : Évaluation d'Actif, Immobilier & PME (VCN vs Marché)",
    channelName: "The Moroccan CFO",
    platform: "YouTube",
    scheduledDate: "2026-08-12",
    status: "Brouillon",
    contentType: "Vidéo Longue",
    notes: "Différence entre valeur comptable au bilan et valeur vénale. Méthodes d'évaluation d'actifs."
  },
  {
    id: "ee_cfo_3",
    title: "Encours Financier & Maîtrise de la Trésorerie / BFR",
    channelName: "The Moroccan CFO",
    platform: "YouTube",
    scheduledDate: "2026-08-19",
    status: "Brouillon",
    contentType: "Vidéo Longue",
    notes: "Optimisation de l'encours clients et fournisseurs pour réduire le besoin en fonds de roulement."
  },
  {
    id: "ee_cfo_4",
    title: "Charges Fixes vs Charges Variables : Seuil de Rentabilité",
    channelName: "The Moroccan CFO",
    platform: "YouTube",
    scheduledDate: "2026-08-26",
    status: "Brouillon",
    contentType: "Vidéo Longue",
    notes: "Calcul pratique de la Marge sur Coût Variable (MCV), du Seuil de Rentabilité et du Point Mort."
  },
  {
    id: "ee_cfo_5",
    title: "Comptabilité Analytique vs Comptabilité Générale",
    channelName: "The Moroccan CFO",
    platform: "YouTube",
    scheduledDate: "2026-09-02",
    status: "Brouillon",
    contentType: "Vidéo Longue",
    notes: "Comparatif entre comptabilité financière obligatoire et comptabilité de gestion/analytique."
  }
];

export const INITIAL_PROJECT_FOLDERS: ProjectFolder[] = [
  {
    id: "proj_1",
    name: "Chaîne YouTube - The Moroccan Analyst",
    description: "Création de contenu éducatif sur la modélisation financière, les études de cas d'entreprises et l'analyse macroéconomique.",
    category: "YouTube",
    createdAt: "2026-05-15",
    statusPhase: "Croissance & Ventes",
    launchDate: "2026-09-01",
    projectBudget: 15000,
    techStack: ["YouTube Studio", "AdSense", "Adobe Premiere", "Canva", "Substack"],
    keyRisks: "Complexité de la modélisation Excel pour débutants, variations de l'algorithme YouTube",
    valueProposition: "Analyses de valorisation financières de niveau fonds d'investissement expliquées de manière claire et visuelle.",
    teamStakeholders: "Fondateur & Analyste principal, Monteur vidéo freelance",
    targetAudience: "Étudiants en finance, jeunes professionnels M&A/Private Equity & passionnés d'analyse d'entreprises.",
    coreGoal: "Développer une audience qualifiée de 10 000 passionnés de finance d'ici la fin d'année et établir une autorité de marque incontournable.",
    keyMetricTarget: "10,000 abonnés / 25,000 vues mensuelles",
    businessKPIs: {
      targetPayingSubscribers: 250,
      currentPayingSubscribers: 65,
      targetProductsSold: 120,
      currentProductsSold: 32,
      targetFormationsSold: 50,
      currentFormationsSold: 18,
      targetCoachingSold: 15,
      currentCoachingSold: 6,
      targetAdsenseRevenue: 12000,
      currentAdsenseRevenue: 3850,
      targetCustomRevenue: 60000,
      currentCustomRevenue: 22400,
      customKPIs: [
        { id: "ckpi_1", label: "Partenariats B2B Sponsoring", target: "5", current: "2", unit: "marques" }
      ]
    },
    objectives: [
      { 
        id: "obj_yt_1",
        title: "Abonnés YouTube", 
        targetValue: 10000, 
        currentValue: 3450, 
        unit: "abonnés",
        history: [
          { id: "h1", date: "2026-06-15", value: 2400, note: "Lancement campagne d'été" },
          { id: "h2", date: "2026-06-22", value: 2650, note: "Vidéo Modélisation LBO (+250 abonnés)" },
          { id: "h3", date: "2026-06-29", value: 2890, note: "Reel viral Instagram/Shorts" },
          { id: "h4", date: "2026-07-06", value: 3120, note: "Sponsoring Bourse" },
          { id: "h5", date: "2026-07-13", value: 3300, note: "Partenariat M&A" },
          { id: "h6", date: "2026-07-20", value: 3450, note: "Semaine passée" }
        ]
      },
      { 
        id: "obj_yt_2",
        title: "Ventes Modèles Excel & Bourse", 
        targetValue: 120, 
        currentValue: 32, 
        unit: "ventes",
        history: [
          { id: "h2_1", date: "2026-06-15", value: 12, note: "Ouverture catalogue" },
          { id: "h2_2", date: "2026-06-29", value: 20, note: "Promo pack Excel" },
          { id: "h2_3", date: "2026-07-13", value: 28, note: "Relance newsletter" },
          { id: "h2_4", date: "2026-07-20", value: 32, note: "Dernier relevé" }
        ]
      },
      { 
        id: "obj_yt_3",
        title: "Revenus Publicitaires AdSense", 
        targetValue: 12000, 
        currentValue: 3850, 
        unit: "MAD",
        history: [
          { id: "h3_1", date: "2026-06-15", value: 1200 },
          { id: "h3_2", date: "2026-06-29", value: 2450 },
          { id: "h3_3", date: "2026-07-13", value: 3100 },
          { id: "h3_4", date: "2026-07-20", value: 3850 }
        ]
      },
      { 
        id: "obj_yt_4",
        title: "Inscriptions Formations M&A", 
        targetValue: 50, 
        currentValue: 18, 
        unit: "inscrits",
        history: [
          { id: "h4_1", date: "2026-06-15", value: 5 },
          { id: "h4_2", date: "2026-06-29", value: 10 },
          { id: "h4_3", date: "2026-07-13", value: 14 },
          { id: "h4_4", date: "2026-07-20", value: 18 }
        ]
      }
    ],
    associatedFormationIds: ["f1", "f2"],
    associatedLinkIds: [],
    associatedGoalIds: ["mg1"],
    customObjectives: [
      { id: "co_1", text: "Atteindre 10k abonnés d'ici la fin d'année", completed: false, dueDate: "2026-12-31" },
      { id: "co_2", text: "Publier 2 vidéos de haute qualité par semaine", completed: true, dueDate: "2026-08-15" },
      { id: "co_3", text: "Finaliser le script de la vidéo de Private Equity", completed: false, dueDate: "2026-07-30" }
    ],
    topicsToCover: [
      { id: "top_1", title: "Comment construire un modèle financier LBO complet sur Excel de A à Z", category: "Tutoriel", status: "À traiter", targetFormat: "Vidéo YouTube", priority: "Haute", notes: "Inclure le fichier Excel téléchargeable en description." },
      { id: "top_2", title: "Analyse financière approfondie de LVMH : Secret de leurs marges d'exploitation", category: "Étude de cas", status: "En rédaction", targetFormat: "Vidéo YouTube", priority: "Haute", notes: "Focus sur la valorisation du multiple EBITDA." },
      { id: "top_3", title: "Private Equity vs Investment Banking : Quel parcours choisir en 2026 ?", category: "Avis / Analyse", status: "Tourné", targetFormat: "Vidéo YouTube", priority: "Moyenne", notes: "Interview croisée avec un analyste senior." },
      { id: "top_4", title: "Les 5 erreurs classiques en valorisation DCF que font 90% des analystes", category: "Tutoriel", status: "Idée", targetFormat: "Short / Reel", priority: "Moyenne", notes: "Format court dynamique pour YouTube Shorts & Instagram." }
    ],
    customLinks: [
      { id: "cl_1", title: "YouTube Creator Studio", url: "https://studio.youtube.com", category: "Outils" },
      { id: "cl_2", title: "Inspiration : Financial Modeling World Cup", url: "https://fmworldcup.com", category: "Ressources" }
    ],
    notes: "Axe principal de croissance de l'audience. Les vidéos de modélisation de LBO sur Excel ont le meilleur taux de rétention. Se concentrer sur l'aspect éducationnel premium."
  },
  {
    id: "proj_2",
    name: "Académie & Offres de Formations Premium",
    description: "Création, structuration et monétisation des programmes d'accompagnement avancés (Private Equity, Modélisation & Excel Financier).",
    category: "Formation",
    createdAt: "2026-06-10",
    statusPhase: "Lancement",
    launchDate: "2026-09-15",
    projectBudget: 25000,
    techStack: ["Kajabi", "Stripe", "Loom", "Notion", "Substack", "Zoom"],
    keyRisks: "Délais d'enregistrement des modules, taux de conversion des appels de vente",
    valueProposition: "Accompagnement intensif et bootcamp pratique pour décrocher des offres en Private Equity & M&A.",
    teamStakeholders: "Coach principal, Formateur M&A invite, Customer Success Manager",
    targetAudience: "Professionnels en reconversion ou analystes souhaitant décrocher une offre en M&A, TS ou Private Equity.",
    coreGoal: "Construire un catalogue de 3 formations phares haut de gamme générant un chiffre d'affaires récurrent et des taux de satisfaction client > 95%.",
    keyMetricTarget: "50 premiers étudiants / 15 000€ de CA au 1er lancement",
    businessKPIs: {
      targetPayingSubscribers: 150,
      currentPayingSubscribers: 42,
      targetProductsSold: 200,
      currentProductsSold: 58,
      targetFormationsSold: 100,
      currentFormationsSold: 36,
      targetCoachingSold: 30,
      currentCoachingSold: 12,
      targetAdsenseRevenue: 0,
      currentAdsenseRevenue: 0,
      targetCustomRevenue: 120000,
      currentCustomRevenue: 48000,
      customKPIs: [
        { id: "ckpi_2", label: "Taux de Réussite aux Entretiens M&A", target: "90", current: "85", unit: "%" }
      ]
    },
    objectives: [
      { title: "Inscrits Programme Académie", targetValue: 100, currentValue: 36, unit: "élèves" },
      { title: "Ventes Modèles LBO & Valo", targetValue: 200, currentValue: 58, unit: "ventes" },
      { title: "Clients Coaching Immersion PE", targetValue: 30, currentValue: 12, unit: "clients" },
      { title: "Chiffre d'Affaires Académie", targetValue: 120000, currentValue: 48000, unit: "MAD" }
    ],
    associatedFormationIds: ["f3"],
    associatedLinkIds: [],
    associatedGoalIds: ["mg2"],
    customObjectives: [
      { id: "co_4", text: "Enregistrer les 15 premiers modules vidéos de la formation PE", completed: false, dueDate: "2026-09-01" },
      { id: "co_5", text: "Préparer le template de modèle financier de LBO certifié", completed: true, dueDate: "2026-06-30" },
      { id: "co_6", text: "Créer la page de capture de leads de l'Académie", completed: false, dueDate: "2026-08-10" }
    ],
    topicsToCover: [
      { id: "top_5", title: "Module 1 : Principes fondamentaux du Montage LBO & Debt Service", category: "Module Formation", status: "À traiter", targetFormat: "Module Formation", priority: "Haute", notes: "Support PDF + cas pratique téléchargeable." },
      { id: "top_6", title: "Module 2 : Valorisation d'entreprise par la méthode des multiples de transactions comparables", category: "Module Formation", status: "En rédaction", targetFormat: "Module Formation", priority: "Haute" },
      { id: "top_7", title: "Atelier Live trimestriel : Coaching Q&A et préparation aux entretiens M&A", category: "Stratégie", status: "Idée", targetFormat: "Autre", priority: "Moyenne" }
    ],
    customLinks: [
      { id: "cl_3", title: "Kajabi Dashboard", url: "https://kajabi.com", category: "Outils" }
    ],
    notes: "Tarification prévue : formule premium directe. Tester l'offre auprès des 50 premiers bêta-testeurs de la communauté 'The MA Circle'."
  },
  {
    id: "proj_3",
    name: "Newsletter & Communauté Private 'The MA Circle'",
    description: "Publication hebdomadaire d'analyses financières confidentielles et animation de la communauté d'élite.",
    category: "YouTube",
    createdAt: "2026-07-01",
    statusPhase: "Croissance & Ventes",
    launchDate: "2026-07-15",
    projectBudget: 5000,
    techStack: ["Substack", "ConvertKit", "Discord", "Typeform"],
    keyRisks: "Désabonnements si la régularité baisse, délivrabilité e-mail dans les spams",
    valueProposition: "Analyses M&A exclusives et opportunités de networking réservées aux membres du cercle.",
    teamStakeholders: "Rédacteur en chef, Lead Community Manager",
    targetAudience: "Abonnés investis souhaitant recevoir des dossiers d'analyse financière poussés directement par e-mail.",
    coreGoal: "Créer une relation de confiance directe et convertir les lecteurs réguliers en étudiants de l'Académie.",
    keyMetricTarget: "2,500 inscrits Newsletter / Taux d'ouverture de 45%",
    businessKPIs: {
      targetPayingSubscribers: 500,
      currentPayingSubscribers: 180,
      targetProductsSold: 150,
      currentProductsSold: 45,
      targetFormationsSold: 40,
      currentFormationsSold: 15,
      targetCoachingSold: 10,
      currentCoachingSold: 4,
      targetAdsenseRevenue: 0,
      currentAdsenseRevenue: 0,
      targetCustomRevenue: 35000,
      currentCustomRevenue: 12800
    },
    objectives: [
      { title: "Membres Abonnés Newsletter", targetValue: 500, currentValue: 180, unit: "membres" },
      { title: "Ventes Guides & Subscriptions", targetValue: 150, currentValue: 45, unit: "ventes" },
      { title: "Revenu Récurrent Mensuel (MRR)", targetValue: 35000, currentValue: 12800, unit: "MAD" }
    ],
    associatedFormationIds: [],
    associatedLinkIds: [],
    associatedGoalIds: [],
    customObjectives: [
      { id: "co_7", text: "Configurer le système d'automation Substack / ConvertKit", completed: true, dueDate: "2026-07-10" },
      { id: "co_8", text: "Rédiger le Lead Magnet : 'Guide ultime de la valorisation d'entreprise'", completed: false, dueDate: "2026-08-05" }
    ],
    topicsToCover: [
      { id: "top_8", title: "Édition #01 : Décryptage d'une transaction M&A récente dans la Tech", category: "Avis / Analyse", status: "À traiter", targetFormat: "Newsletter", priority: "Haute", notes: "Envoi prévu tous les dimanches matin à 09h00." },
      { id: "top_9", title: "Édition #02 : Les secrets des fonds de Private Equity pour booster l'EBITDA", category: "Stratégie", status: "Idée", targetFormat: "Newsletter", priority: "Moyenne" }
    ],
    customLinks: [
      { id: "cl_4", title: "Substack Dashboard", url: "https://substack.com", category: "Outils" }
    ],
    notes: "Liaison directe avec l'acquisition YouTube : insérer un appel à l'action en fin de chaque vidéo."
  }
];




