import React, { useState, useEffect } from "react";
import { 
  DailyHabit, 
  VideoFocus, 
  WeeklyArticle, 
  CourseDeliverable, 
  PurchaseEntry, 
  StockEntry, 
  AiTask, 
  TokenStatus 
} from "./types";
import DashboardView from "./components/DashboardView";
import WeeklyContent from "./components/WeeklyContent";
import FinanceTracker from "./components/FinanceTracker";
import AiAssistant from "./components/AiAssistant";
import { 
  Tv, 
  FileSpreadsheet, 
  Sparkles, 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Video, 
  TrendingUp, 
  Coins, 
  Moon, 
  Sun,
  Flame,
  User,
  Coffee
} from "lucide-react";

// Initial Habits template
const INITIAL_HABITS: DailyHabit[] = [
  { id: "h1", name: "Lire pendant 10 minutes", description: "S'évader et stimuler l'imagination", completed: false, category: "professional" },
  { id: "h2", name: "Apprendre pendant 30 minutes", description: "Suivre une formation ou lire un article technique", completed: false, category: "professional" },
  { id: "h3", name: "Faire du sport", description: "Activité physique (Idéalement chaque jour, min 4x/semaine)", completed: false, category: "personal" },
  { id: "h4", name: "Préparer le dîner de demain", description: "Planifier ses repas pour gagner du temps", completed: false, category: "personal" },
  { id: "h5", name: "Préparer les vêtements de demain", description: "Éviter la fatigue de décision matinale", completed: false, category: "personal" },
  { id: "h6", name: "Routine de soins (Skin care)", description: "Prendre soin de sa peau matin ou soir", completed: false, category: "personal" },
  { id: "h7", name: "Routine dentaire (Teeth care)", description: "Brossage complet et fil dentaire", completed: false, category: "personal" },
  { id: "h8", name: "Nettoyage rapide de l'espace", description: "Ranger son bureau et sa pièce de travail", completed: false, category: "personal" },
];

const INITIAL_VIDEO: VideoFocus = {
  id: "v1",
  channel: "The Moroccan Analyst",
  videoTitle: "Analyse économique de la semaine",
  isCompleted: false,
  publishedFB: false,
  publishedTikTok: false,
  publishedSpotify: false,
};

const INITIAL_ARTICLES: WeeklyArticle[] = [
  { id: "a1", title: "L'essor de la Fintech au Maroc en 2026", platforms: { facebook: true, linkedin: true, instagram: false, website: true }, isCompleted: true },
  { id: "a2", title: "3 conseils financiers pour les PME marocaines", platforms: { facebook: false, linkedin: true, instagram: false, website: false }, isCompleted: false },
];

const INITIAL_COURSES: CourseDeliverable[] = [
  { id: "c1", type: "Udemy", title: "Analyse Financière Marocaine - Leçon 1", episodeNumber: 1, isPrepared: true, isPublished: true },
  { id: "c2", type: "Website", title: "Stratégies de couverture de change - Intro", episodeNumber: 1, isPrepared: false, isPublished: false },
];

const INITIAL_PURCHASES: PurchaseEntry[] = [
  { id: "p1", date: "2026-07-08", description: "Abonnement Canva Pro", category: "Business", amount: 150 },
  { id: "p2", date: "2026-07-10", description: "Publicité sponsorisée Facebook - CFA", category: "Marketing", amount: 300 },
];

const INITIAL_STOCKS: StockEntry[] = [
  { id: "s1", symbol: "ATW", name: "Attijariwafa Bank", buyPrice: 505.0, currentPrice: 512.5, quantity: 20, lastUpdated: "2026-07-10" },
  { id: "s2", symbol: "IAM", name: "Maroc Telecom", buyPrice: 92.4, currentPrice: 91.8, quantity: 150, lastUpdated: "2026-07-10" },
  { id: "s3", symbol: "BCP", name: "Banque Centrale Populaire", buyPrice: 295.0, currentPrice: 302.0, quantity: 35, lastUpdated: "2026-07-11" },
];

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<"dashboard" | "content" | "finance" | "ai">("dashboard");

  // Core App States (loaded from localStorage or initialized)
  const [dailyHabits, setDailyHabits] = useState<DailyHabit[]>(() => {
    const saved = localStorage.getItem("moroccan_planner_habits");
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [videoFocus, setVideoFocus] = useState<VideoFocus>(() => {
    const saved = localStorage.getItem("moroccan_planner_video");
    return saved ? JSON.parse(saved) : INITIAL_VIDEO;
  });

  const [articles, setArticles] = useState<WeeklyArticle[]>(() => {
    const saved = localStorage.getItem("moroccan_planner_articles");
    return saved ? JSON.parse(saved) : INITIAL_ARTICLES;
  });

  const [courses, setCourses] = useState<CourseDeliverable[]>(() => {
    const saved = localStorage.getItem("moroccan_planner_courses");
    return saved ? JSON.parse(saved) : INITIAL_COURSES;
  });

  const [purchases, setPurchases] = useState<PurchaseEntry[]>(() => {
    const saved = localStorage.getItem("moroccan_planner_purchases");
    return saved ? JSON.parse(saved) : INITIAL_PURCHASES;
  });

  const [stocks, setStocks] = useState<StockEntry[]>(() => {
    const saved = localStorage.getItem("moroccan_planner_stocks");
    return saved ? JSON.parse(saved) : INITIAL_STOCKS;
  });

  const [aiTasks, setAiTasks] = useState<AiTask[]>(() => {
    const saved = localStorage.getItem("moroccan_planner_aitasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [tokenStatus, setTokenStatus] = useState<TokenStatus>(() => {
    const saved = localStorage.getItem("moroccan_planner_tokens");
    return saved ? JSON.parse(saved) : { dailyLimit: 50000, consumed: 1500 };
  });

  const [streakCount, setStreakCount] = useState<number>(() => {
    const saved = localStorage.getItem("moroccan_planner_streak");
    return saved ? parseInt(saved) : 5;
  });

  // Synchronize States to LocalStorage on updates
  useEffect(() => {
    localStorage.setItem("moroccan_planner_habits", JSON.stringify(dailyHabits));
  }, [dailyHabits]);

  useEffect(() => {
    localStorage.setItem("moroccan_planner_video", JSON.stringify(videoFocus));
  }, [videoFocus]);

  useEffect(() => {
    localStorage.setItem("moroccan_planner_articles", JSON.stringify(articles));
  }, [articles]);

  useEffect(() => {
    localStorage.setItem("moroccan_planner_courses", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("moroccan_planner_purchases", JSON.stringify(purchases));
  }, [purchases]);

  useEffect(() => {
    localStorage.setItem("moroccan_planner_stocks", JSON.stringify(stocks));
  }, [stocks]);

  useEffect(() => {
    localStorage.setItem("moroccan_planner_aitasks", JSON.stringify(aiTasks));
  }, [aiTasks]);

  useEffect(() => {
    localStorage.setItem("moroccan_planner_tokens", JSON.stringify(tokenStatus));
  }, [tokenStatus]);

  useEffect(() => {
    localStorage.setItem("moroccan_planner_streak", streakCount.toString());
  }, [streakCount]);

  // -- STATE MODIFICATION HANDLERS --

  // Habits Handlers
  const toggleHabit = (id: string) => {
    setDailyHabits(prev => {
      const updated = prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h);
      
      // If all habits completed, boost streak
      const allDone = updated.every(h => h.completed);
      if (allDone) {
        setStreakCount(s => s + 1);
      }
      return updated;
    });
  };

  // Video Handlers
  const updateVideoFocus = (updated: Partial<VideoFocus>) => {
    setVideoFocus(prev => ({ ...prev, ...updated }));
  };

  // Article Handlers
  const addArticle = (title: string) => {
    const newArt: WeeklyArticle = {
      id: "a_" + Date.now(),
      title,
      platforms: { facebook: false, linkedin: false, instagram: false, website: false },
      isCompleted: false
    };
    setArticles(prev => [newArt, ...prev]);
  };

  const toggleArticlePlatform = (id: string, platform: keyof WeeklyArticle["platforms"]) => {
    setArticles(prev => prev.map(art => {
      if (art.id === id) {
        const nextPlatforms = {
          ...art.platforms,
          [platform]: !art.platforms[platform]
        };
        const anyPlatformPublished = Object.values(nextPlatforms).some(Boolean);
        return {
          ...art,
          platforms: nextPlatforms,
          isCompleted: anyPlatformPublished
        };
      }
      return art;
    }));
  };

  const deleteArticle = (id: string) => {
    setArticles(prev => prev.filter(art => art.id !== id));
  };

  // Course Handlers
  const addCourseItem = (type: "Udemy" | "Website", title: string, episodeNum: number) => {
    const newCourse: CourseDeliverable = {
      id: "c_" + Date.now(),
      type,
      title,
      episodeNumber: episodeNum,
      isPrepared: false,
      isPublished: false
    };
    setCourses(prev => [newCourse, ...prev]);
  };

  const toggleCourseStatus = (id: string, field: "isPrepared" | "isPublished") => {
    setCourses(prev => prev.map(c => {
      if (c.id === id) {
        const nextVal = !c[field];
        return { ...c, [field]: nextVal };
      }
      return c;
    }));
  };

  const deleteCourseItem = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

  // Purchases Handlers
  const addPurchase = (entry: Omit<PurchaseEntry, "id">) => {
    const item: PurchaseEntry = {
      id: "p_" + Date.now(),
      ...entry
    };
    setPurchases(prev => [item, ...prev]);
  };

  const deletePurchase = (id: string) => {
    setPurchases(prev => prev.filter(p => p.id !== id));
  };

  // Stocks Handlers
  const addStock = (entry: Omit<StockEntry, "id" | "lastUpdated">) => {
    const item: StockEntry = {
      id: "s_" + Date.now(),
      ...entry,
      lastUpdated: new Date().toISOString().split("T")[0]
    };
    setStocks(prev => [item, ...prev]);
  };

  const updateStockPrice = (id: string, currentPrice: number) => {
    setStocks(prev => prev.map(s => s.id === id ? {
      ...s,
      currentPrice,
      lastUpdated: new Date().toISOString().split("T")[0]
    } : s));
  };

  const deleteStock = (id: string) => {
    setStocks(prev => prev.filter(s => s.id !== id));
  };

  // AI Task Handlers
  const addAiTask = (task: Omit<AiTask, "id" | "date">) => {
    const item: AiTask = {
      id: "ai_" + Date.now(),
      date: new Date().toISOString().split("T")[0],
      ...task
    };
    setAiTasks(prev => [item, ...prev]);
    setTokenStatus(prev => ({
      ...prev,
      consumed: Math.min(prev.dailyLimit, prev.consumed + task.tokensUsed)
    }));
  };

  const resetTokens = () => {
    setTokenStatus({ dailyLimit: 50000, consumed: 0 });
  };

  // Quick reset for start of a new week or day
  const resetDailyRoutines = () => {
    if (window.confirm("Voulez-vous réinitialiser vos habitudes pour une nouvelle journée ?")) {
      setDailyHabits(prev => prev.map(h => ({ ...h, completed: false })));
      // Reset daily video publication state too
      setVideoFocus(prev => ({
        ...prev,
        isCompleted: false,
        publishedFB: false,
        publishedTikTok: false,
        publishedSpotify: false
      }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1329] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-900">
      
      {/* Dynamic Global Top Bar */}
      <header className="bg-slate-900/90 backdrop-blur border-b border-slate-800 sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold font-display text-white flex items-center gap-2">
                Moroccan Content Creator Planner
              </h1>
              <p className="text-[11px] text-slate-400 font-mono uppercase tracking-wider">
                Elite Workflow • Business, Finance & Académie
              </p>
            </div>
          </div>

          {/* Quick Stats Banner */}
          <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 px-4 py-2 rounded-xl text-xs">
            <div className="flex items-center gap-1.5 border-r border-slate-800 pr-3 mr-1">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <span className="text-slate-300">Streak:</span>
              <strong className="text-white font-mono">{streakCount} Jours</strong>
            </div>
            <div className="flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-400">Tokens IA:</span>
              <span className="text-white font-mono">
                {((tokenStatus.dailyLimit - tokenStatus.consumed)).toLocaleString()} / {tokenStatus.dailyLimit.toLocaleString()}
              </span>
            </div>
          </div>

        </div>
      </header>

      {/* Main Workspace Navigation Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col gap-6">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-1">
          {[
            { id: "dashboard", label: "Tableau de Bord & Routines", icon: LayoutDashboard },
            { id: "content", label: "Publications & Formations", icon: BookOpen },
            { id: "finance", label: "Finances & Bourse (Excel)", icon: FileSpreadsheet },
            { id: "ai", label: "Gemini Assistant & Tokens", icon: Sparkles }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-xs sm:text-sm font-semibold transition-all border-b-2 ${
                  isActive 
                    ? "bg-slate-800/80 border-emerald-500 text-white font-bold"
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-850/50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-emerald-400" : "text-slate-500"}`} />
                {tab.label}
              </button>
            );
          })}
          
          <div className="ml-auto flex items-center">
            <button
              onClick={resetDailyRoutines}
              className="text-xs text-slate-400 hover:text-red-400 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-red-500/30 hover:bg-red-500/5 transition-all font-medium"
            >
              Nouveau Jour
            </button>
          </div>
        </div>

        {/* Dynamic Tab Workspace */}
        <main className="flex-1 animate-fade-in duration-350">
          {activeTab === "dashboard" && (
            <DashboardView
              dailyHabits={dailyHabits}
              toggleHabit={toggleHabit}
              videoFocus={videoFocus}
              updateVideoFocus={updateVideoFocus}
              streakCount={streakCount}
            />
          )}

          {activeTab === "content" && (
            <WeeklyContent
              articles={articles}
              addArticle={addArticle}
              toggleArticlePlatform={toggleArticlePlatform}
              deleteArticle={deleteArticle}
              courses={courses}
              addCourseItem={addCourseItem}
              toggleCourseStatus={toggleCourseStatus}
              deleteCourseItem={deleteCourseItem}
            />
          )}

          {activeTab === "finance" && (
            <FinanceTracker
              purchases={purchases}
              addPurchase={addPurchase}
              deletePurchase={deletePurchase}
              stocks={stocks}
              addStock={addStock}
              updateStockPrice={updateStockPrice}
              deleteStock={deleteStock}
            />
          )}

          {activeTab === "ai" && (
            <AiAssistant
              aiTasks={aiTasks}
              tokenStatus={tokenStatus}
              addAiTask={addAiTask}
              resetTokens={resetTokens}
            />
          )}
        </main>
      </div>

      {/* Footer info banner */}
      <footer className="border-t border-slate-800/80 bg-slate-950/40 py-6 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Moroccan Content Creator Planner. Tous droits réservés.</p>
          <div className="flex gap-4 text-slate-400">
            <span>The Moroccan Analyst</span>
            <span>•</span>
            <span>The Moroccan CFO</span>
            <span>•</span>
            <span>The Moroccan Economist</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
