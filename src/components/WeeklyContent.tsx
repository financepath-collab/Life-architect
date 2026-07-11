import React, { useState } from "react";
import { WeeklyArticle, CourseDeliverable } from "../types";
import { 
  BookOpen, 
  Linkedin, 
  Facebook, 
  Instagram, 
  Globe, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Play, 
  Tv, 
  GraduationCap, 
  ListPlus,
  Info
} from "lucide-react";

interface WeeklyContentProps {
  articles: WeeklyArticle[];
  addArticle: (title: string) => void;
  toggleArticlePlatform: (id: string, platform: keyof WeeklyArticle["platforms"]) => void;
  deleteArticle: (id: string) => void;
  courses: CourseDeliverable[];
  addCourseItem: (type: "Udemy" | "Website", title: string, episodeNum: number) => void;
  toggleCourseStatus: (id: string, field: "isPrepared" | "isPublished") => void;
  deleteCourseItem: (id: string) => void;
}

export default function WeeklyContent({
  articles,
  addArticle,
  toggleArticlePlatform,
  deleteArticle,
  courses,
  addCourseItem,
  toggleCourseStatus,
  deleteCourseItem
}: WeeklyContentProps) {
  const [newArticleTitle, setNewArticleTitle] = useState("");
  const [newCourseTitle, setNewCourseTitle] = useState("");
  const [courseType, setCourseType] = useState<"Udemy" | "Website">("Udemy");
  const [episodeNum, setEpisodeNum] = useState<number>(1);

  // Article Stats
  const completedArticles = articles.filter(a => {
    const p = a.platforms;
    return p.facebook || p.linkedin || p.instagram || p.website;
  }).length;

  // Course Stats
  const udemyPrepared = courses.filter(c => c.type === "Udemy" && c.isPrepared).length;
  const udemyPublished = courses.filter(c => c.type === "Udemy" && c.isPublished).length;
  const sitePrepared = courses.filter(c => c.type === "Website" && c.isPrepared).length;
  const sitePublished = courses.filter(c => c.type === "Website" && c.isPublished).length;

  const handleAddArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticleTitle.trim()) return;
    addArticle(newArticleTitle);
    setNewArticleTitle("");
  };

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseTitle.trim()) return;
    addCourseItem(courseType, newCourseTitle, episodeNum);
    setNewCourseTitle("");
    setEpisodeNum(prev => prev + 1);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* SECTION 1: ARTICLES DE LA SEMAINE */}
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold font-display text-white">Articles de la Semaine</h3>
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
            completedArticles >= 3 ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
          }`}>
            {completedArticles}/3 Articles Publiés
          </span>
        </div>

        {/* Info box */}
        <div className="flex items-start gap-2.5 bg-slate-900/50 border border-slate-700/50 p-3 rounded-xl text-xs text-slate-300">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            Règle : Publier au moins <strong>3 articles par semaine</strong> sur votre profil Facebook, LinkedIn, Instagram et votre site web. Tirez parti de l'onglet IA pour générer des idées ou des ébauches.
          </p>
        </div>

        {/* Add Article Form */}
        <form onSubmit={handleAddArticle} className="flex gap-2">
          <input
            type="text"
            value={newArticleTitle}
            onChange={(e) => setNewArticleTitle(e.target.value)}
            placeholder="Titre ou sujet de l'article..."
            className="flex-1 bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="submit"
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 rounded-xl text-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" /> Ajouter
          </button>
        </form>

        {/* Articles list */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {articles.length === 0 ? (
            <div className="text-center py-8 text-slate-500 text-sm">
              Aucun article ajouté pour cette semaine.
            </div>
          ) : (
            articles.map((art) => (
              <div 
                key={art.id} 
                className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700/80 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-semibold text-white leading-snug">{art.title}</h4>
                  <button
                    onClick={() => deleteArticle(art.id)}
                    className="text-slate-500 hover:text-red-400 p-1 rounded-lg hover:bg-slate-800/60 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Platforms tracker */}
                <div className="grid grid-cols-4 gap-2 pt-1">
                  {[
                    { key: "linkedin", label: "LinkedIn", icon: Linkedin, color: "hover:bg-blue-600/20 hover:border-blue-500 text-blue-400" },
                    { key: "facebook", label: "Facebook", icon: Facebook, color: "hover:bg-sky-600/20 hover:border-sky-500 text-sky-400" },
                    { key: "instagram", label: "Instagram", icon: Instagram, color: "hover:bg-pink-600/20 hover:border-pink-500 text-pink-400" },
                    { key: "website", label: "Site Web", icon: Globe, color: "hover:bg-emerald-600/20 hover:border-emerald-500 text-emerald-400" }
                  ].map((plat) => {
                    const isChecked = art.platforms[plat.key as keyof WeeklyArticle["platforms"]];
                    return (
                      <button
                        type="button"
                        key={plat.key}
                        onClick={() => toggleArticlePlatform(art.id, plat.key as any)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border text-xs font-medium transition-all gap-1.5 ${
                          isChecked 
                            ? "bg-slate-800 border-emerald-500 text-white shadow-md shadow-emerald-500/5"
                            : "bg-slate-900/60 border-slate-800/80 text-slate-500 " + plat.color
                        }`}
                      >
                        <plat.icon className={`w-4 h-4 ${isChecked ? "text-emerald-400" : "text-slate-400"}`} />
                        <span className={isChecked ? "text-slate-200" : "text-slate-500"}>{plat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* SECTION 2: FORMATIONS & COURS (UDEMY & SITE WEB) */}
      <div className="bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold font-display text-white">Formations & Académie</h3>
          </div>
          <div className="text-xs text-slate-400 flex gap-3">
            <span>Udemy: <strong className="text-emerald-400">{udemyPublished}/3</strong></span>
            <span>Site: <strong className="text-emerald-400">{sitePublished}/3</strong></span>
          </div>
        </div>

        {/* Info box */}
        <div className="flex items-start gap-2.5 bg-slate-900/50 border border-slate-700/50 p-3 rounded-xl text-xs text-slate-300">
          <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p>
            Objectif Hebdomadaire : Préparer et publier <strong>3 épisodes sur Udemy</strong> et <strong>3 vidéos sur votre propre site web</strong> pour vos formations.
          </p>
        </div>

        {/* Add Course Deliverable Form */}
        <form onSubmit={handleAddCourse} className="bg-slate-900/30 border border-slate-800 p-4 rounded-xl space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setCourseType("Udemy")}
              className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                courseType === "Udemy"
                  ? "bg-purple-600/20 border-purple-500 text-purple-300"
                  : "bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/40"
              }`}
            >
              Udemy Course (3/Semaine)
            </button>
            <button
              type="button"
              onClick={() => setCourseType("Website")}
              className={`py-2 rounded-lg text-xs font-semibold border transition-all ${
                courseType === "Website"
                  ? "bg-blue-600/20 border-blue-500 text-blue-300"
                  : "bg-slate-950/40 border-slate-800 text-slate-400 hover:bg-slate-800/40"
              }`}
            >
              Site Web Course (3/Semaine)
            </button>
          </div>

          <div className="flex gap-2">
            <input
              type="number"
              value={episodeNum}
              onChange={(e) => setEpisodeNum(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 bg-slate-900/60 border border-slate-700/80 rounded-xl px-2 py-2 text-sm text-center text-white focus:outline-none focus:border-emerald-500"
              placeholder="Ep"
              title="Episode / Vidéo numéro"
            />
            <input
              type="text"
              value={newCourseTitle}
              onChange={(e) => setNewCourseTitle(e.target.value)}
              placeholder="Sujet de la leçon (Ex: Les bases de la finance...)"
              className="flex-1 bg-slate-900/60 border border-slate-700/80 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold px-4 rounded-xl text-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Deliverables List */}
        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
          {/* Udemy Sublist */}
          <div className="space-y-2">
            <div className="text-xs text-purple-400 font-semibold flex items-center justify-between">
              <span>UDEMY EPISODES ({courses.filter(c => c.type === "Udemy").length})</span>
              <span className="font-mono text-[10px] bg-purple-900/20 px-2 py-0.5 rounded border border-purple-500/20">Prog: {udemyPublished}/3</span>
            </div>
            
            {courses.filter(c => c.type === "Udemy").length === 0 ? (
              <div className="text-xs text-slate-500 italic p-2 bg-slate-900/20 rounded-lg">Aucun cours Udemy planifié.</div>
            ) : (
              courses.filter(c => c.type === "Udemy").map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-800/60 bg-slate-900/20 text-xs">
                  <div className="flex-1 pr-4">
                    <span className="font-mono text-purple-400 font-semibold mr-1.5">[Ep {item.episodeNumber}]</span>
                    <span className="text-slate-200 font-medium">{item.title}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleCourseStatus(item.id, "isPrepared")}
                      className={`px-2 py-1 rounded border font-semibold transition-colors ${
                        item.isPrepared 
                          ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                          : "bg-slate-950/40 border-slate-800 text-slate-500 hover:bg-slate-800"
                      }`}
                    >
                      Préparé
                    </button>
                    <button
                      onClick={() => toggleCourseStatus(item.id, "isPublished")}
                      className={`px-2 py-1 rounded border font-semibold transition-colors ${
                        item.isPublished 
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                          : "bg-slate-950/40 border-slate-800 text-slate-500 hover:bg-slate-800"
                      }`}
                    >
                      Publié
                    </button>
                    <button onClick={() => deleteCourseItem(item.id)} className="text-slate-500 hover:text-red-400 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Website Sublist */}
          <div className="space-y-2 pt-2">
            <div className="text-xs text-blue-400 font-semibold flex items-center justify-between">
              <span>SITE WEB VIDEOS ({courses.filter(c => c.type === "Website").length})</span>
              <span className="font-mono text-[10px] bg-blue-900/20 px-2 py-0.5 rounded border border-blue-500/20">Prog: {sitePublished}/3</span>
            </div>
            
            {courses.filter(c => c.type === "Website").length === 0 ? (
              <div className="text-xs text-slate-500 italic p-2 bg-slate-900/20 rounded-lg">Aucune vidéo de site web planifiée.</div>
            ) : (
              courses.filter(c => c.type === "Website").map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-800/60 bg-slate-900/20 text-xs">
                  <div className="flex-1 pr-4">
                    <span className="font-mono text-blue-400 font-semibold mr-1.5">[Vidéo {item.episodeNumber}]</span>
                    <span className="text-slate-200 font-medium">{item.title}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleCourseStatus(item.id, "isPrepared")}
                      className={`px-2 py-1 rounded border font-semibold transition-colors ${
                        item.isPrepared 
                          ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                          : "bg-slate-950/40 border-slate-800 text-slate-500 hover:bg-slate-800"
                      }`}
                    >
                      Préparé
                    </button>
                    <button
                      onClick={() => toggleCourseStatus(item.id, "isPublished")}
                      className={`px-2 py-1 rounded border font-semibold transition-colors ${
                        item.isPublished 
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                          : "bg-slate-950/40 border-slate-800 text-slate-500 hover:bg-slate-800"
                      }`}
                    >
                      Publié
                    </button>
                    <button onClick={() => deleteCourseItem(item.id)} className="text-slate-500 hover:text-red-400 p-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
