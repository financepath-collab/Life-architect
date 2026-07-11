export interface DailyHabit {
  id: string;
  name: string;
  description: string;
  completed: boolean;
  category: "personal" | "professional";
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
