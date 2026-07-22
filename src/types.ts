export interface DailyHabit {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  category: "Health" | "Career" | "Mental" | "Personal" | "Finance" | "personal" | "professional" | string;
  isImportant?: boolean;
  dueTime?: string;
  frequency?: "Quotidien" | "Hebdomadaire" | "Mensuel" | string;
}

export interface VideoFocus {
  id: string;
  channel: "The Moroccan Analyst" | "The Moroccan CFO" | "The Moroccan Economist";
  videoTitle: string;
  isCompleted: boolean;
  publishedFB: boolean;
  publishedTikTok: boolean;
  publishedSpotify: boolean;
}

export interface WeeklyArticle {
  id: string;
  title: string;
  platforms: {
    facebook: boolean;
    linkedin: boolean;
    instagram: boolean;
    website: boolean;
  };
  isCompleted: boolean;
}

export interface CourseDeliverable {
  id: string;
  type: "Udemy" | "Website";
  title: string;
  episodeNumber: number;
  isPrepared: boolean;
  isPublished: boolean;
}

export interface PurchaseEntry {
  id: string;
  date: string;
  description: string;
  category: "Business" | "Marketing" | "Stock" | "Personnel" | "Autres";
  amount: number; // in MAD
}

export interface StockEntry {
  id: string;
  symbol: string;
  name: string;
  buyPrice: number; // MAD
  currentPrice: number; // MAD
  quantity: number;
  lastUpdated: string;
}

export interface AiTask {
  id: string;
  date: string;
  type: "video_script" | "article_draft" | "web_improvement" | "financial_summary";
  channel: string;
  prompt: string;
  output: string;
  tokensUsed: number;
}

export interface TokenStatus {
  dailyLimit: number;
  consumed: number;
}

export interface WeeklyObjective {
  id: string;
  text: string;
  completed: boolean;
  isPriority?: boolean;
}

// === NEW MODULES DEFINED FOR ADVANCED PLATFORM ===

// 1. Finance Submodules
export interface FinanceTransaction {
  id: string;
  date: string;
  description: string;
  category: string;
  type: "Revenue" | "Dépense";
  amount: number; // MAD
  account: string;
}

export interface FinanceBudget {
  id: string;
  category: string;
  limitAmount: number; // MAD
  spentAmount: number; // MAD
  period: "Mensuel" | "Annuel";
}

export interface FinanceSalaire {
  id: string;
  date: string;
  source: string;
  grossAmount: number; // MAD
  netAmount: number; // MAD
  status: "Reçu" | "En attente";
}

export interface FinanceEpargne {
  id: string;
  name: string;
  targetAmount: number; // MAD
  currentAmount: number; // MAD
  deadline: string;
  status: "En cours" | "Atteint";
}

// 2. Productivité Submodules
export interface Action30Jours {
  id: string;
  dayNumber: number; // 1-30
  taskDescription: string;
  completed: boolean;
  note: string;
}

export interface Sprint {
  id: string;
  name: string;
  month: string; // "2026-01" to "2026-12"
  status: "active" | "completed" | "planned";
  tasks: Action30Jours[];
  description?: string;
}

export interface ProfilAmelioration {
  id: string;
  focusArea: string; // e.g., "Élocution", "Montage Vidéo", "SEO"
  status: "À travailler" | "En cours" | "Maîtrisé";
  targetDate: string;
  actionPlan: string;
}

export interface GoalMilestone {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
}

export interface PossibiliteGoal {
  id: string;
  title: string;
  type: "Court Terme" | "Moyen Terme" | "Long Terme";
  targetYear: string;
  description: string;
  completed: boolean;
  milestones?: GoalMilestone[];
}

// 3. Santé Submodules
export interface SkinTracker {
  id: string;
  date: string;
  morningRoutine: boolean;
  eveningRoutine: boolean;
  skinCondition: "Excellente" | "Bonne" | "Sensible" | "Acné/Irritée";
  productsUsed: string;
  waterIntakeLiters: number;
  photoUrl?: string;
}

export interface MealPlanner {
  id: string;
  dayOfWeek: "Lundi" | "Mardi" | "Mercredi" | "Jeudi" | "Vendredi" | "Samedi" | "Dimanche";
  mealType: "Petit Déjeuner" | "Déjeuner" | "Dîner" | "Collation";
  description: string;
  calories: number;
  prepared: boolean;
}

// 4. Achats Submodules
export interface AchatMensuel {
  id: string;
  date: string;
  itemName: string;
  store: string;
  category: string;
  amount: number; // MAD
  priority: "Élevée" | "Moyenne" | "Faible";
  status: "Acheté" | "À acheter";
}

export interface Abonnement {
  id: string;
  serviceName: string;
  costMonthly: number; // MAD
  billingPeriod: "Mensuel" | "Annuel";
  nextBillingDate: string;
  status: "Actif" | "Suspendu";
}

// 5. Formation Submodules
export interface Formation {
  id: string;
  title: string;
  instructor: string;
  platform: string;
  durationHours: number;
  progressPercent: number; // 0 - 100
  status: "Non commencé" | "En cours" | "Terminé";
}

export interface MediaItem {
  id: string;
  title: string;
  type: "Film" | "Série" | "Livre";
  authorOrDirector: string;
  progress: string; // e.g., "Page 120/350", "Saison 2 Ep 4", "100%"
  rating: number; // 1-5
  status: "À voir/lire" | "En cours" | "Terminé";
}

// 6. Comptes Submodules
export interface Account {
  id: string;
  name: string;
  type: "Bancaire" | "Espèces" | "Crypto";
  balance: number; // MAD
  currency: string;
}

export interface ResourceLink {
  id: string;
  title: string;
  url: string;
  category: string;
  rating: number; // 1-5
}

export interface ChannelInfo {
  id: string;
  name: string;
  platform: "YouTube" | "TikTok" | "LinkedIn" | "Instagram" | "Spotify";
  subscriberCount: number;
  niche: string;
  frequency: string;
}

export interface WishListItem {
  id: string;
  itemName: string;
  store: string;
  estimatedPrice: number; // MAD
  priority: "Rêve" | "Peut-être" | "Bientôt";
  link: string;
  note: string;
}

export interface AchatCouteuxItem {
  id: string;
  itemName: string;
  targetDate: string;
  estimatedPrice: number; // MAD
  status: "Planifié" | "Économise" | "Acheté";
  store: string;
  priority: "Prioritaire" | "Secondaire" | "Faible";
}

export interface BookItem {
  id: string;
  title: string;
  author: string;
  status: "À lire" | "En cours" | "Terminé";
  currentPage: number;
  totalPages: number;
  genre: string;
  rating: number; // 1-5
  notes: string;
}

export interface ScreenMediaItem {
  id: string;
  title: string;
  type: "Film" | "Série" | "Anime";
  status: "À regarder" | "En cours" | "Terminé";
  currentEpisode?: number;
  totalEpisodes?: number;
  season?: number;
  rating: number; // 1-5
  notes: string;
  platform: string;
}

export interface MonthlyGoal {
  id: string;
  month: string; // e.g. "2026-07"
  channelName: string; // e.g. "The Moroccan Analyst"
  targetRevenue: number; // MAD
  currentRevenue: number; // MAD
  targetFollowers: number; // target count
  currentFollowers: number; // current count
  note?: string;
}

export interface EditorialEvent {
  id: string;
  title: string;
  channelName: string;
  platform: string; // e.g. "YouTube", "TikTok", "Instagram", etc.
  scheduledDate: string; // "YYYY-MM-DD"
  status: "Brouillon" | "En cours" | "Planifié" | "Publié";
  contentType: "Vidéo Longue" | "Short / Reel" | "Carrousel" | "Post Écrit" | "Podcast" | "Autre";
  notes?: string;
  googleEventId?: string;
  outlookEventId?: string;
  projectId?: string;
}

export interface ProjectFolder {
  id: string;
  name: string;
  description: string;
  category: "YouTube" | "Formation" | "E-commerce" | "Finance" | "Autre";
  createdAt: string;
  associatedFormationIds: string[];
  associatedLinkIds: string[];
  associatedGoalIds: string[];
  customObjectives: { id: string; text: string; completed: boolean }[];
  customLinks: { id: string; title: string; url: string; category: string }[];
  notes: string;
}

export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  content: string;
  mood: "Excellent" | "Bon" | "Neutre" | "Fatigué" | "Stressé";
  tags?: string;
}

// 7. Career Submodules
export interface CareerSkill {
  id: string;
  name: string;
  category: "Finance" | "Soft Skills" | "Tech / IA" | "Langues" | "Management" | "Autre";
  status: "Acquise" | "En cours de travail" | "Planifiée";
  notes: string;
  lastUpdated: string;
}

export interface RecruitmentSite {
  id: string;
  name: string;
  url: string;
  notes: string;
  keywords?: string[];
  visited?: boolean;
  discoveredOpportunities?: string;
  country?: string;
  identifiant?: string;
}

export interface TargetCompany {
  id: string;
  name: string;
  website: string;
  interest: number; // 1 to 5 stars
  notes: string;
  contact?: string;
}

export interface JobOpportunity {
  id: string;
  title: string;
  company: string;
  siteUrl?: string;
  salary?: string;
  status: "À postuler" | "Postulé" | "Entretien" | "Offre" | "Refusé";
  dateApplied?: string;
  nextAction?: string;
  notes: string;
}

export interface CareerCertificate {
  id: string;
  name: string;
  authority: string; // e.g. "CFA Institute", "Udemy", "AMMC"
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  status: "Obtenu" | "En cours" | "Planifié";
  niche: "Finance" | "Tech" | "Management" | "Autre";
  notes?: string;
}

export interface MobilityCountryStatus {
  country: string;
  entryPath: string;
  status: "En veille" | "Candidatures envoyées" | "En entretien" | "Offre reçue" | "Mis en pause";
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  items: { id: string; label: string; done: boolean }[];
}

export interface VisaDocGroup {
  country: string;
  docs: { id: string; label: string; done: boolean }[];
}

export interface MobilitySkillGroup {
  category: string;
  items: { id: string; label: string; done: boolean }[];
}




