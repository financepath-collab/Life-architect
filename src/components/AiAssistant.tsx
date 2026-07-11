import React, { useState } from "react";
import { AiTask, TokenStatus } from "../types";
import { 
  Sparkles, 
  Tv, 
  BookOpen, 
  Cpu, 
  ArrowRight, 
  Copy, 
  Check, 
  HelpCircle, 
  Code,
  FileText,
  Clock,
  Loader2,
  TrendingUp,
  AlertCircle
} from "lucide-react";

interface AiAssistantProps {
  aiTasks: AiTask[];
  tokenStatus: TokenStatus;
  addAiTask: (task: Omit<AiTask, "id" | "date">) => void;
  resetTokens: () => void;
}

export default function AiAssistant({
  aiTasks,
  tokenStatus,
  addAiTask,
  resetTokens
}: AiAssistantProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedType, setSelectedType] = useState<AiTask["type"]>("video_script");
  const [selectedChannel, setSelectedChannel] = useState("The Moroccan Analyst");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Quick suggestion prompts
  const suggestions = [
    {
      label: "Accroche Vidéo Analyst",
      type: "video_script" as const,
      channel: "The Moroccan Analyst",
      text: "Génère 3 idées d'accroches percutantes (hooks) et un plan de vidéo sur les résultats semestriels de la bourse de Casablanca cette semaine."
    },
    {
      label: "Optimisation CFO Cashflow",
      type: "video_script" as const,
      channel: "The Moroccan CFO",
      text: "Rédige un script de 2 minutes expliquant comment optimiser le besoin en fonds de roulement (BFR) d'une entreprise marocaine en Dirhams."
    },
    {
      label: "Inflation Marocain Economist",
      type: "article_draft" as const,
      channel: "The Moroccan Economist",
      text: "Prépare un article LinkedIn approfondi sur les décisions récentes de Bank Al-Maghrib concernant le taux directeur et son impact sur l'immobilier."
    },
    {
      label: "Idées de Code Dashboard",
      type: "web_improvement" as const,
      channel: "Site Web",
      text: "Propose des idées d'amélioration de l'expérience utilisateur et de l'architecture pour mon dashboard de créateur de contenu."
    }
  ];

  const handleApplySuggestion = (sug: typeof suggestions[0]) => {
    setPrompt(sug.text);
    setSelectedType(sug.type);
    setSelectedChannel(sug.channel);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          type: selectedType,
          channel: selectedChannel
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "La génération a échoué.");
      }

      const data = await response.json();
      
      // Calculate fake/simulated tokens spent based on chars generated
      const tokensSpent = Math.round(prompt.length * 0.5 + (data.text?.length || 0) * 1.3);

      addAiTask({
        type: selectedType,
        channel: selectedChannel,
        prompt: prompt.trim(),
        output: data.text || "",
        tokensUsed: tokensSpent
      });

      setPrompt("");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Impossible de se connecter à l'API Gemini. Vérifiez votre clé API.");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tokenPercentage = Math.min(100, Math.round((tokenStatus.consumed / tokenStatus.dailyLimit) * 100));

  return (
    <div className="space-y-6">
      {/* Token Tracker Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-800/60 backdrop-blur border border-slate-700/50 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 font-display text-sm font-medium tracking-wider uppercase">
              <Cpu className="w-4 h-4" />
              Allocation de jetons IA quotidiens
            </div>
            <h2 className="text-xl font-bold font-display mt-2 text-white">
              Développement et Amélioration du Site en continu
            </h2>
            <p className="text-slate-300 mt-2 text-xs leading-relaxed">
              Consommez judicieusement vos tokens chaque jour pour rédiger des articles, scripter vos épisodes, ou formuler des requêtes d'amélioration web à copier directement dans votre projet.
            </p>
          </div>
          
          <div className="mt-4 flex items-center justify-between border-t border-slate-700/60 pt-4">
            <span className="text-xs text-slate-400">Réinitialisation automatique des tokens à minuit (UTC)</span>
            <button
              onClick={resetTokens}
              className="text-[10px] text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 bg-emerald-500/5 px-2 py-1 rounded transition-colors"
            >
              Forcer Réinitialisation
            </button>
          </div>
        </div>

        {/* Token Progress circle/bar */}
        <div className="bg-slate-800/60 backdrop-blur border border-slate-700/50 p-6 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <span>Tokens Consommés</span>
              <span>{tokenPercentage}%</span>
            </div>
            <div className="text-2xl font-bold font-display text-white mt-2">
              {tokenStatus.consumed.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ {tokenStatus.dailyLimit.toLocaleString()}</span>
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  tokenPercentage > 85 ? "bg-red-500" : tokenPercentage > 60 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${tokenPercentage}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>Disponible: {(tokenStatus.dailyLimit - tokenStatus.consumed).toLocaleString()}</span>
              <span>Tokens IA actifs</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Generator Controls (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-700/60 pb-3">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold font-display text-white">Générateur d'idées IA</h3>
          </div>

          {/* Quick Suggestions List */}
          <div className="space-y-2">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Suggestions d'élite</span>
            <div className="grid grid-cols-1 gap-1.5">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleApplySuggestion(sug)}
                  className="text-left text-xs bg-slate-900/40 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/20 p-2.5 rounded-xl text-slate-300 transition-all flex items-center justify-between gap-2"
                >
                  <span className="truncate font-medium">{sug.label}</span>
                  <ArrowRight className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 pt-1">
            {/* Generation Type */}
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Type de Tâche</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="video_script">🎬 Script Vidéo / Hook</option>
                  <option value="article_draft">📰 Ébauche d'article</option>
                  <option value="web_improvement">💻 Amélioration du Site</option>
                  <option value="financial_summary">📊 Résumé Financier</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Cible / Chaîne</label>
                <select
                  value={selectedChannel}
                  onChange={(e) => setSelectedChannel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="The Moroccan Analyst">The Moroccan Analyst</option>
                  <option value="The Moroccan CFO">The Moroccan CFO</option>
                  <option value="The Moroccan Economist">The Moroccan Economist</option>
                  <option value="Site Web">Site Web Personnel</option>
                  <option value="Autres">Autre / Facebook</option>
                </select>
              </div>
            </div>

            {/* Prompt input */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Votre Consigne (Prompt)</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Décrivez votre idée de vidéo, le sujet d'article, ou la fonctionnalité web que vous souhaitez ajouter..."
                className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 h-28 resize-none"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-xs text-red-400">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{errorMsg}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !prompt.trim()}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                loading || !prompt.trim()
                  ? "bg-slate-700 text-slate-400 cursor-not-allowed"
                  : "bg-emerald-500 hover:bg-emerald-600 text-slate-950 shadow-lg shadow-emerald-500/10"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Génération en cours...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Générer avec Gemini
                </>
              )}
            </button>
          </form>
        </div>

        {/* History & Output (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-800/40 border border-slate-700/40 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold font-display text-white">Résultats & Archive des Tâches</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {aiTasks.length} requêtes sauvegardées
            </span>
          </div>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {aiTasks.length === 0 ? (
              <div className="text-center py-16 text-slate-500 text-sm flex flex-col items-center justify-center gap-2">
                <Cpu className="w-8 h-8 text-slate-600" />
                <p>Aucune génération effectuée aujourd'hui.</p>
                <p className="text-xs text-slate-600 max-w-xs mt-1">Utilisez l'un des modèles à gauche ou saisissez votre propre consigne pour démarrer.</p>
              </div>
            ) : (
              aiTasks.map((task) => (
                <div key={task.id} className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        task.type === "video_script" ? "bg-purple-500" :
                        task.type === "article_draft" ? "bg-amber-500" :
                        task.type === "web_improvement" ? "bg-blue-500" : "bg-emerald-500"
                      }`}></span>
                      <span className="font-semibold text-slate-300">{task.channel}</span>
                      <span className="text-slate-500 font-mono text-[10px]">({task.type})</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-850 px-2 py-0.5 rounded border border-slate-800">
                      -{task.tokensUsed} tokens
                    </span>
                  </div>

                  <div className="text-xs italic bg-slate-950/40 p-2.5 rounded-lg border border-slate-850 text-slate-400">
                    <strong className="text-slate-300 not-italic">Prompt:</strong> "{task.prompt}"
                  </div>

                  {/* Output content markdown block */}
                  <div className="text-xs text-slate-300 leading-relaxed bg-slate-950/80 p-3.5 rounded-xl border border-slate-800/80 max-h-64 overflow-y-auto font-mono whitespace-pre-wrap">
                    {task.output}
                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleCopy(task.id, task.output)}
                      className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 bg-slate-800/50 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-all"
                    >
                      {copiedId === task.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          Copié !
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          Copier le résultat
                        </>
                      )}
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
