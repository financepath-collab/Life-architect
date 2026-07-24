import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Key, 
  Lightbulb, 
  Link2, 
  Calendar, 
  FileText, 
  Plus, 
  Trash2, 
  Edit3, 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  ExternalLink, 
  Tv, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Save,
  Globe,
  Sparkles
} from "lucide-react";
import { ChannelInfo, MediaCredential, MediaIdea, MediaUsefulLink, MediaTaskDeadline } from "../types";

interface MediaProjectDetailsModalProps {
  channel: ChannelInfo;
  onClose: () => void;
  onUpdateChannel: (updatedChannel: ChannelInfo) => void;
  onDeleteChannel?: (id: string) => void;
}

export default function MediaProjectDetailsModal({
  channel,
  onClose,
  onUpdateChannel,
  onDeleteChannel
}: MediaProjectDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"credentials" | "ideas" | "links" | "deadlines" | "notes" | "settings">("credentials");
  const [showPasswordMap, setShowPasswordMap] = useState<{ [key: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Editable local state initialized from channel
  const [channelName, setChannelName] = useState<string>(channel.name || "");
  const [channelPlatform, setChannelPlatform] = useState<ChannelInfo["platform"]>(channel.platform || "YouTube");
  const [subscriberCount, setSubscriberCount] = useState<number>(channel.subscriberCount || 0);
  const [niche, setNiche] = useState<string>(channel.niche || "");
  const [frequency, setFrequency] = useState<string>(channel.frequency || "");

  const [credentials, setCredentials] = useState<MediaCredential[]>(channel.credentials || []);
  const [ideas, setIdeas] = useState<MediaIdea[]>(channel.ideas || []);
  const [usefulLinks, setUsefulLinks] = useState<MediaUsefulLink[]>(channel.usefulLinks || []);
  const [deadlines, setDeadlines] = useState<MediaTaskDeadline[]>(channel.deadlines || []);
  const [notes, setNotes] = useState<string>(channel.notes || "");

  // Primary Email / Pass quick fields
  const [primaryEmail, setPrimaryEmail] = useState<string>(channel.email || "");
  const [primaryPassword, setPrimaryPassword] = useState<string>(channel.password || "");
  const [showPrimaryPass, setShowPrimaryPass] = useState(false);

  // Forms states
  const [showAddCred, setShowAddCred] = useState(false);
  const [newCred, setNewCred] = useState({ label: "", email: "", password: "", notes: "" });

  const [showAddIdea, setShowAddIdea] = useState(false);
  const [newIdea, setNewIdea] = useState({ title: "", description: "", status: "Idée" as const, deadline: "" });

  const [showAddLink, setShowAddLink] = useState(false);
  const [newLink, setNewLink] = useState({ title: "", url: "", category: "Ressource", notes: "" });

  const [showAddDeadline, setShowAddDeadline] = useState(false);
  const [newDeadline, setNewDeadline] = useState({ title: "", dueDate: "", status: "À faire" as const });

  // Save changes to parent state
  const saveStateToParent = (
    updatedCreds = credentials,
    updatedIdeas = ideas,
    updatedLinks = usefulLinks,
    updatedDeadlines = deadlines,
    updatedNotes = notes,
    updatedEmail = primaryEmail,
    updatedPass = primaryPassword,
    updatedName = channelName,
    updatedPlatform = channelPlatform,
    updatedSubscribers = subscriberCount,
    updatedNiche = niche,
    updatedFrequency = frequency
  ) => {
    onUpdateChannel({
      ...channel,
      name: updatedName,
      platform: updatedPlatform,
      subscriberCount: updatedSubscribers,
      niche: updatedNiche,
      frequency: updatedFrequency,
      email: updatedEmail,
      password: updatedPass,
      credentials: updatedCreds,
      ideas: updatedIdeas,
      usefulLinks: updatedLinks,
      deadlines: updatedDeadlines,
      notes: updatedNotes
    });
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStateToParent(
      credentials,
      ideas,
      usefulLinks,
      deadlines,
      notes,
      primaryEmail,
      primaryPassword,
      channelName,
      channelPlatform,
      subscriberCount,
      niche,
      frequency
    );
  };

  const toggleShowPass = (id: string) => {
    setShowPasswordMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Credentials Handlers
  const handleAddCredential = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCred.label || !newCred.email) return;
    const item: MediaCredential = {
      id: "cred_" + Date.now(),
      ...newCred
    };
    const next = [...credentials, item];
    setCredentials(next);
    saveStateToParent(next);
    setNewCred({ label: "", email: "", password: "", notes: "" });
    setShowAddCred(false);
  };

  const handleDeleteCredential = (id: string) => {
    const next = credentials.filter(c => c.id !== id);
    setCredentials(next);
    saveStateToParent(next);
  };

  // Ideas Handlers
  const handleAddIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIdea.title) return;
    const item: MediaIdea = {
      id: "idea_" + Date.now(),
      ...newIdea
    };
    const next = [...ideas, item];
    setIdeas(next);
    saveStateToParent(undefined, next);
    setNewIdea({ title: "", description: "", status: "Idée", deadline: "" });
    setShowAddIdea(false);
  };

  const handleDeleteIdea = (id: string) => {
    const next = ideas.filter(i => i.id !== id);
    setIdeas(next);
    saveStateToParent(undefined, next);
  };

  const handleUpdateIdeaStatus = (id: string, status: MediaIdea["status"]) => {
    const next = ideas.map(i => i.id === id ? { ...i, status } : i);
    setIdeas(next);
    saveStateToParent(undefined, next);
  };

  // Useful Links Handlers
  const handleAddLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLink.title || !newLink.url) return;
    let formattedUrl = newLink.url;
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
      formattedUrl = "https://" + formattedUrl;
    }
    const item: MediaUsefulLink = {
      id: "link_" + Date.now(),
      ...newLink,
      url: formattedUrl
    };
    const next = [...usefulLinks, item];
    setUsefulLinks(next);
    saveStateToParent(undefined, undefined, next);
    setNewLink({ title: "", url: "", category: "Ressource", notes: "" });
    setShowAddLink(false);
  };

  const handleDeleteLink = (id: string) => {
    const next = usefulLinks.filter(l => l.id !== id);
    setUsefulLinks(next);
    saveStateToParent(undefined, undefined, next);
  };

  // Deadlines Handlers
  const handleAddDeadline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeadline.title || !newDeadline.dueDate) return;
    const item: MediaTaskDeadline = {
      id: "dl_" + Date.now(),
      ...newDeadline
    };
    const next = [...deadlines, item];
    setDeadlines(next);
    saveStateToParent(undefined, undefined, undefined, next);
    setNewDeadline({ title: "", dueDate: "", status: "À faire" });
    setShowAddDeadline(false);
  };

  const handleDeleteDeadline = (id: string) => {
    const next = deadlines.filter(d => d.id !== id);
    setDeadlines(next);
    saveStateToParent(undefined, undefined, undefined, next);
  };

  const handleUpdateDeadlineStatus = (id: string, status: MediaTaskDeadline["status"]) => {
    const next = deadlines.map(d => d.id === id ? { ...d, status } : d);
    setDeadlines(next);
    saveStateToParent(undefined, undefined, undefined, next);
  };

  // Save Notes
  const handleSaveNotes = () => {
    saveStateToParent(undefined, undefined, undefined, undefined, notes);
  };

  // Save Primary Email/Pass
  const handleSavePrimaryCreds = () => {
    saveStateToParent(undefined, undefined, undefined, undefined, undefined, primaryEmail, primaryPassword);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white border border-neutral-200 rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header Bar */}
        <div className="p-6 bg-gradient-to-r from-neutral-900 via-slate-900 to-indigo-950 text-white flex items-start justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-indigo-300 shrink-0">
              <Tv className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-white tracking-tight">{channel.name}</h2>
                <span className="text-[10px] font-bold font-mono px-2.5 py-0.5 bg-indigo-500/30 border border-indigo-400/40 text-indigo-200 rounded-full">
                  {channel.platform}
                </span>
              </div>
              <p className="text-xs text-neutral-300 mt-1">
                {channel.niche || "Projet Média & Digital"} • <strong className="text-emerald-400 font-mono font-bold">{(channel.subscriberCount || 0).toLocaleString("fr-FR")} Abonnés</strong> ({channel.frequency})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {onDeleteChannel && (
              <button
                onClick={() => {
                  if (confirm(`Voulez-vous vraiment supprimer le projet "${channel.name}" ?`)) {
                    onDeleteChannel(channel.id);
                    onClose();
                  }
                }}
                className="p-2 text-rose-300 hover:text-white hover:bg-rose-600/30 rounded-xl transition-all cursor-pointer"
                title="Supprimer ce projet"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white hover:bg-white/10 rounded-xl transition-all cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Primary Email / Password Quick Header Strip */}
        <div className="bg-neutral-900/90 border-b border-neutral-800 px-6 py-3 text-white flex flex-wrap items-center justify-between gap-4 text-xs font-mono shrink-0">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-neutral-400 text-[11px]">Email Principal :</span>
              <input
                type="email"
                placeholder="Ex: contact@themacircle.ma"
                value={primaryEmail}
                onChange={e => setPrimaryEmail(e.target.value)}
                onBlur={handleSavePrimaryCreds}
                className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-2.5 py-1 text-xs focus:border-indigo-500 outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-400 text-[11px]">Mot de passe :</span>
              <div className="relative flex items-center">
                <input
                  type={showPrimaryPass ? "text" : "password"}
                  placeholder="Secret..."
                  value={primaryPassword}
                  onChange={e => setPrimaryPassword(e.target.value)}
                  onBlur={handleSavePrimaryCreds}
                  className="bg-neutral-800 border border-neutral-700 text-white rounded-lg px-2.5 py-1 text-xs focus:border-indigo-500 outline-hidden pr-8"
                />
                <button
                  onClick={() => setShowPrimaryPass(!showPrimaryPass)}
                  className="absolute right-2 text-neutral-400 hover:text-white"
                >
                  {showPrimaryPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <span className="text-[10px] text-neutral-400 italic">Modifications enregistrées automatiquement</span>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="bg-neutral-100 border-b border-neutral-200 px-6 pt-3 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            onClick={() => setActiveTab("credentials")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x cursor-pointer shrink-0 ${
              activeTab === "credentials"
                ? "bg-white border-neutral-200 text-indigo-700 shadow-2xs"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Key className="w-4 h-4" />
            <span>Identifiants & Mots de Passe</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-neutral-200 rounded font-bold">
              {credentials.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("ideas")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x cursor-pointer shrink-0 ${
              activeTab === "ideas"
                ? "bg-white border-neutral-200 text-indigo-700 shadow-2xs"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Idées de Sujets</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-neutral-200 rounded font-bold">
              {ideas.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("links")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x cursor-pointer shrink-0 ${
              activeTab === "links"
                ? "bg-white border-neutral-200 text-indigo-700 shadow-2xs"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Link2 className="w-4 h-4" />
            <span>Liens Utiles</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-neutral-200 rounded font-bold">
              {usefulLinks.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("deadlines")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x cursor-pointer shrink-0 ${
              activeTab === "deadlines"
                ? "bg-white border-neutral-200 text-indigo-700 shadow-2xs"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Échéances & Deadlines</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-neutral-200 rounded font-bold">
              {deadlines.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("notes")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x cursor-pointer shrink-0 ${
              activeTab === "notes"
                ? "bg-white border-neutral-200 text-indigo-700 shadow-2xs"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Notes & Stratégie</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-t border-x cursor-pointer shrink-0 ${
              activeTab === "settings"
                ? "bg-white border-neutral-200 text-indigo-700 shadow-2xs"
                : "border-transparent text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>Paramètres du Projet</span>
          </button>
        </div>

        {/* Modal Main Body Content */}
        <div className="p-6 overflow-y-auto grow space-y-6">
          {/* 1. CREDENTIALS TAB */}
          {activeTab === "credentials" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Comptes & Accès sécurisés</h3>
                  <p className="text-xs text-neutral-500">Mots de passe, logins et emails de connexion pour ce projet média.</p>
                </div>
                <button
                  onClick={() => setShowAddCred(!showAddCred)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter un identifiant</span>
                </button>
              </div>

              {/* Add Credential Form */}
              {showAddCred && (
                <form onSubmit={handleAddCredential} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-800">Nouvel Identifiant</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Nom / Service (Ex: YouTube Studio)"
                      value={newCred.label}
                      onChange={e => setNewCred({ ...newCred, label: e.target.value })}
                      className="bg-white border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Email / Login"
                      value={newCred.email}
                      onChange={e => setNewCred({ ...newCred, email: e.target.value })}
                      className="bg-white border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                    <input
                      type="text"
                      placeholder="Mot de passe"
                      value={newCred.password}
                      onChange={e => setNewCred({ ...newCred, password: e.target.value })}
                      className="bg-white border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden font-mono"
                    />
                    <input
                      type="text"
                      placeholder="Notes / Précisions"
                      value={newCred.notes}
                      onChange={e => setNewCred({ ...newCred, notes: e.target.value })}
                      className="bg-white border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddCred(false)}
                      className="px-3 py-1.5 bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              )}

              {/* List of credentials */}
              {credentials.length === 0 ? (
                <div className="text-center py-8 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                  <Key className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-neutral-600">Aucun identifiant spécifique enregistré</p>
                  <p className="text-[11px] text-neutral-400 mt-1">Saisissez l'email principal ci-dessus ou ajoutez un compte spécifique.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {credentials.map(c => {
                    const isVisible = showPasswordMap[c.id];
                    return (
                      <div key={c.id} className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-2 shadow-3xs relative group">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-900">{c.label}</span>
                          <button
                            onClick={() => handleDeleteCredential(c.id)}
                            className="p-1 text-neutral-400 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="space-y-1 text-xs font-mono">
                          <div className="flex items-center justify-between bg-neutral-50 p-2 rounded-xl border border-neutral-100">
                            <span className="text-neutral-700 truncate">{c.email}</span>
                            <button
                              onClick={() => copyToClipboard(c.email, c.id + "_email")}
                              className="text-neutral-400 hover:text-indigo-600 ml-2"
                              title="Copier l'email"
                            >
                              {copiedId === c.id + "_email" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {c.password && (
                            <div className="flex items-center justify-between bg-neutral-50 p-2 rounded-xl border border-neutral-100">
                              <span className="text-neutral-800 font-bold">
                                {isVisible ? c.password : "••••••••••••"}
                              </span>
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => toggleShowPass(c.id)}
                                  className="text-neutral-400 hover:text-neutral-700 p-0.5"
                                >
                                  {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => copyToClipboard(c.password!, c.id + "_pass")}
                                  className="text-neutral-400 hover:text-indigo-600 p-0.5"
                                  title="Copier le mot de passe"
                                >
                                  {copiedId === c.id + "_pass" ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {c.notes && (
                          <p className="text-[11px] text-neutral-500 italic pt-1 border-t border-neutral-100">
                            {c.notes}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* 2. IDEAS TAB */}
          {activeTab === "ideas" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Idées de Sujets & Contenus</h3>
                  <p className="text-xs text-neutral-500">Banque d'idées de vidéos, posts, articles et émissions pour ce canal.</p>
                </div>
                <button
                  onClick={() => setShowAddIdea(!showAddIdea)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter un sujet</span>
                </button>
              </div>

              {/* Add Idea Form */}
              {showAddIdea && (
                <form onSubmit={handleAddIdea} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-800">Nouveau Sujet de Contenu</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Titre du sujet / Vidéo"
                      value={newIdea.title}
                      onChange={e => setNewIdea({ ...newIdea, title: e.target.value })}
                      className="bg-white border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden sm:col-span-2"
                    />
                    <textarea
                      placeholder="Description ou plan rapide..."
                      value={newIdea.description}
                      onChange={e => setNewIdea({ ...newIdea, description: e.target.value })}
                      className="bg-white border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden sm:col-span-2 rows-2"
                    />
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 block mb-1">Statut</label>
                      <select
                        value={newIdea.status}
                        onChange={e => setNewIdea({ ...newIdea, status: e.target.value as any })}
                        className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                      >
                        <option value="Idée">Idée</option>
                        <option value="En préparation">En préparation</option>
                        <option value="Prêt">Prêt</option>
                        <option value="Publié">Publié</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-neutral-500 block mb-1">Deadline / Date prévue</label>
                      <input
                        type="date"
                        value={newIdea.deadline}
                        onChange={e => setNewIdea({ ...newIdea, deadline: e.target.value })}
                        className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddIdea(false)}
                      className="px-3 py-1.5 bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              )}

              {/* List of Ideas */}
              {ideas.length === 0 ? (
                <div className="text-center py-8 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                  <Lightbulb className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-neutral-600">Aucune idée de sujet enregistrée</p>
                  <p className="text-[11px] text-neutral-400 mt-1">Ajoutez vos idées de vidéos, carrousels ou podcasts.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ideas.map(idea => (
                    <div key={idea.id} className="bg-white border border-neutral-200 rounded-2xl p-4 space-y-2 shadow-3xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1 grow">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-neutral-900">{idea.title}</h4>
                          {idea.deadline && (
                            <span className="text-[10px] font-mono text-neutral-500 bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded-md">
                              {idea.deadline}
                            </span>
                          )}
                        </div>
                        {idea.description && (
                          <p className="text-xs text-neutral-600 line-clamp-2">{idea.description}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                        <select
                          value={idea.status}
                          onChange={e => handleUpdateIdeaStatus(idea.id, e.target.value as any)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border outline-hidden cursor-pointer ${
                            idea.status === "Publié" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                            idea.status === "En préparation" ? "bg-indigo-50 text-indigo-800 border-indigo-200" :
                            idea.status === "Prêt" ? "bg-cyan-50 text-cyan-800 border-cyan-200" :
                            "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          <option value="Idée">Idée</option>
                          <option value="En préparation">En préparation</option>
                          <option value="Prêt">Prêt</option>
                          <option value="Publié">Publié</option>
                        </select>

                        <button
                          onClick={() => handleDeleteIdea(idea.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. USEFUL LINKS TAB */}
          {activeTab === "links" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Liens Utiles & Ressources</h3>
                  <p className="text-xs text-neutral-500">Signets vers vos tableaux de bord, dossiers Drive, outils de création ou sources.</p>
                </div>
                <button
                  onClick={() => setShowAddLink(!showAddLink)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter un lien</span>
                </button>
              </div>

              {/* Add Link Form */}
              {showAddLink && (
                <form onSubmit={handleAddLink} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-800">Nouveau Lien Utile</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Nom / Libellé (Ex: Studio Créateur)"
                      value={newLink.title}
                      onChange={e => setNewLink({ ...newLink, title: e.target.value })}
                      className="bg-white border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                    <input
                      type="text"
                      required
                      placeholder="URL (https://...)"
                      value={newLink.url}
                      onChange={e => setNewLink({ ...newLink, url: e.target.value })}
                      className="bg-white border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                    <input
                      type="text"
                      placeholder="Catégorie (Ex: Production, Sources...)"
                      value={newLink.category}
                      onChange={e => setNewLink({ ...newLink, category: e.target.value })}
                      className="bg-white border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                    <input
                      type="text"
                      placeholder="Notes / Précisions"
                      value={newLink.notes}
                      onChange={e => setNewLink({ ...newLink, notes: e.target.value })}
                      className="bg-white border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddLink(false)}
                      className="px-3 py-1.5 bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              )}

              {/* List of Links */}
              {usefulLinks.length === 0 ? (
                <div className="text-center py-8 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                  <Link2 className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-neutral-600">Aucun lien utile enregistré</p>
                  <p className="text-[11px] text-neutral-400 mt-1">Ajoutez vos liens importants pour y accéder en 1 clic.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {usefulLinks.map(link => (
                    <div key={link.id} className="bg-white border border-neutral-200 rounded-2xl p-3.5 space-y-2 shadow-3xs flex items-center justify-between gap-3">
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-neutral-900 truncate">{link.title}</h4>
                          {link.category && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 bg-neutral-100 text-neutral-600 rounded">
                              {link.category}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-400 font-mono truncate">{link.url}</p>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
                        >
                          <span>Ouvrir</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                        <button
                          onClick={() => handleDeleteLink(link.id)}
                          className="p-1.5 text-neutral-400 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. DEADLINES TAB */}
          {activeTab === "deadlines" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Échéances & Tâches (Deadlines)</h3>
                  <p className="text-xs text-neutral-500">Planification des livrables, tournages et dates limites pour ce projet.</p>
                </div>
                <button
                  onClick={() => setShowAddDeadline(!showAddDeadline)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une deadline</span>
                </button>
              </div>

              {/* Add Deadline Form */}
              {showAddDeadline && (
                <form onSubmit={handleAddDeadline} className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-800">Nouvelle Échéance</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Intitulé de l'échéance (Ex: Tournage Épisode 1)"
                      value={newDeadline.title}
                      onChange={e => setNewDeadline({ ...newDeadline, title: e.target.value })}
                      className="bg-white border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden sm:col-span-2"
                    />
                    <input
                      type="date"
                      required
                      value={newDeadline.dueDate}
                      onChange={e => setNewDeadline({ ...newDeadline, dueDate: e.target.value })}
                      className="bg-white border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                    <select
                      value={newDeadline.status}
                      onChange={e => setNewDeadline({ ...newDeadline, status: e.target.value as any })}
                      className="bg-white border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    >
                      <option value="À faire">À faire</option>
                      <option value="En cours">En cours</option>
                      <option value="Terminé">Terminé</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddDeadline(false)}
                      className="px-3 py-1.5 bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                    >
                      Enregistrer
                    </button>
                  </div>
                </form>
              )}

              {/* List of Deadlines */}
              {deadlines.length === 0 ? (
                <div className="text-center py-8 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
                  <Calendar className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-neutral-600">Aucune échéance fixée</p>
                  <p className="text-[11px] text-neutral-400 mt-1">Saisissez vos jalons importants et dates de publication.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {deadlines.map(dl => (
                    <div key={dl.id} className="bg-white border border-neutral-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-3xs">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleUpdateDeadlineStatus(dl.id, dl.status === "Terminé" ? "À faire" : "Terminé")}
                          className={`p-1 rounded-lg transition-all cursor-pointer ${
                            dl.status === "Terminé" ? "text-emerald-600 bg-emerald-50" : "text-neutral-400 hover:text-indigo-600"
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <div>
                          <h4 className={`text-xs font-bold ${dl.status === "Terminé" ? "line-through text-neutral-400" : "text-neutral-900"}`}>
                            {dl.title}
                          </h4>
                          <span className="text-[10px] font-mono font-bold text-indigo-600 block">
                            Échéance : {dl.dueDate}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <select
                          value={dl.status}
                          onChange={e => handleUpdateDeadlineStatus(dl.id, e.target.value as any)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border outline-hidden cursor-pointer ${
                            dl.status === "Terminé" ? "bg-emerald-50 text-emerald-800 border-emerald-200" :
                            dl.status === "En cours" ? "bg-indigo-50 text-indigo-800 border-indigo-200" :
                            "bg-amber-50 text-amber-800 border-amber-200"
                          }`}
                        >
                          <option value="À faire">À faire</option>
                          <option value="En cours">En cours</option>
                          <option value="Terminé">Terminé</option>
                        </select>

                        <button
                          onClick={() => handleDeleteDeadline(dl.id)}
                          className="p-1 text-neutral-400 hover:text-rose-600 rounded-lg transition-all cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. NOTES TAB */}
          {activeTab === "notes" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Notes & Stratégie</h3>
                  <p className="text-xs text-neutral-500">Espace de prise de note libre pour la ligne éditoriale, sponsorings, etc.</p>
                </div>
                <button
                  onClick={handleSaveNotes}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer les Notes</span>
                </button>
              </div>

              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                onBlur={handleSaveNotes}
                rows={12}
                placeholder="Rédigez vos notes stratégiques, lignes directrices, partenariats ou objectifs de croissance..."
                className="w-full bg-neutral-50 border border-neutral-200 rounded-2xl p-4 text-xs text-neutral-800 leading-relaxed focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-hidden"
              />
            </div>
          )}

          {/* 6. SETTINGS TAB */}
          {activeTab === "settings" && (
            <form onSubmit={handleSaveSettings} className="space-y-4">
              <div className="flex items-center justify-between gap-2 border-b border-neutral-100 pb-3">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900">Paramètres Généraux du Projet</h3>
                  <p className="text-xs text-neutral-500">Modifiez le nom, la plateforme, l'audience et la niche éditoriale.</p>
                </div>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Enregistrer les Modifs</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50 p-5 rounded-2xl border border-neutral-200">
                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Nom du Projet Digital / Média</label>
                  <input
                    type="text"
                    required
                    value={channelName}
                    onChange={e => setChannelName(e.target.value)}
                    className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Plateforme / Réseau</label>
                  <select
                    value={channelPlatform}
                    onChange={e => setChannelPlatform(e.target.value as any)}
                    className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  >
                    <option value="YouTube">YouTube</option>
                    <option value="TikTok">TikTok</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Instagram">Instagram</option>
                    <option value="Spotify">Spotify</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Abonnés / Audience Cumulée</label>
                  <input
                    type="number"
                    required
                    value={subscriberCount}
                    onChange={e => setSubscriberCount(Number(e.target.value))}
                    className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs font-mono font-bold text-emerald-600 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Fréquence de publication / Format</label>
                  <input
                    type="text"
                    value={frequency}
                    onChange={e => setFrequency(e.target.value)}
                    placeholder="Ex: 1 vidéo / semaine"
                    className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-bold text-neutral-700 block mb-1">Niche Éditoriale / Thématique</label>
                  <input
                    type="text"
                    value={niche}
                    onChange={e => setNiche(e.target.value)}
                    placeholder="Ex: Finance d'entreprise, géopolitique, interviews..."
                    className="w-full bg-white border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                  />
                </div>
              </div>

              {onDeleteChannel && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center justify-between gap-4 mt-6">
                  <div>
                    <h4 className="text-xs font-bold text-rose-900">Zone de Danger</h4>
                    <p className="text-[11px] text-rose-700">Supprimer définitivement ce projet média et tous ses identifiants, idées et notes associés.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Voulez-vous vraiment supprimer définitivement le projet "${channel.name}" ?`)) {
                        onDeleteChannel(channel.id);
                        onClose();
                      }
                    }}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Supprimer ce projet</span>
                  </button>
                </div>
              )}
            </form>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500 shrink-0">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Changements sauvegardés dynamiquement.</span>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </motion.div>
    </div>
  );
}
