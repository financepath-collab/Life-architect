import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Tv, 
  Key, 
  Lightbulb, 
  Link2, 
  Calendar, 
  Plus, 
  ChevronRight, 
  Trash2,
  Search,
  X,
  Edit3,
  Globe,
  Users
} from "lucide-react";
import MediaProjectDetailsModal from "./MediaProjectDetailsModal";
import { ChannelInfo } from "../types";

interface MediaProjectsSectionProps {
  channels: ChannelInfo[];
  setChannels: React.Dispatch<React.SetStateAction<ChannelInfo[]>>;
}

export default function MediaProjectsSection({
  channels,
  setChannels
}: MediaProjectsSectionProps) {
  const [selectedChannel, setSelectedChannel] = useState<ChannelInfo | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // New channel form state
  const [newChannel, setNewChannel] = useState<{
    name: string;
    platform: ChannelInfo["platform"];
    subscriberCount: number;
    niche: string;
    frequency: string;
    email: string;
    password: string;
    notes: string;
  }>({
    name: "",
    platform: "YouTube",
    subscriberCount: 0,
    niche: "",
    frequency: "1 vidéo / semaine",
    email: "",
    password: "",
    notes: ""
  });

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChannel.name) return;

    const createdItem: ChannelInfo = {
      id: "chan_" + Date.now(),
      name: newChannel.name,
      platform: newChannel.platform,
      subscriberCount: Number(newChannel.subscriberCount) || 0,
      niche: newChannel.niche || "Contenu & Média",
      frequency: newChannel.frequency || "Hebdomadaire",
      email: newChannel.email || undefined,
      password: newChannel.password || undefined,
      credentials: [],
      ideas: [],
      usefulLinks: [],
      deadlines: [],
      notes: newChannel.notes || ""
    };

    setChannels(prev => [...prev, createdItem]);
    setShowAddModal(false);
    setNewChannel({
      name: "",
      platform: "YouTube",
      subscriberCount: 0,
      niche: "",
      frequency: "1 vidéo / semaine",
      email: "",
      password: "",
      notes: ""
    });
  };

  const handleDeleteChannel = (id: string) => {
    setChannels(prev => prev.filter(x => x.id !== id));
  };

  const handleUpdateSelectedChannel = (updatedChannel: ChannelInfo) => {
    setChannels(prev => prev.map(c => c.id === updatedChannel.id ? updatedChannel : c));
    setSelectedChannel(updatedChannel);
  };

  const filteredChannels = channels.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.niche.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.platform.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAudience = channels.reduce((sum, c) => sum + (c.subscriberCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation */}
      <div className="bg-white border border-neutral-200/90 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 border border-indigo-200/80 flex items-center justify-center text-indigo-700">
              <Tv className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-black text-neutral-900 tracking-tight">
              Projets Digitaux & Médias
            </h2>
            <span className="text-[10px] font-bold px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full">
              {channels.length} Projets
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            Gérez tous vos projets digitaux (cours Udemy, produits digitaux, chaînes médias, sites web). Cliquez sur une carte pour ouvrir sa fenêtre dédiée (Identifiants, Sujets, Liens, Deadlines).
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs border border-indigo-400/30"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un Projet</span>
          </button>

          <div className="bg-neutral-900 text-white border border-neutral-800 rounded-2xl px-4 py-2 text-right shrink-0">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Audience Cumulée</span>
            <span className="text-base font-black font-mono text-emerald-400">
              {totalAudience.toLocaleString("fr-FR")} <span className="text-xs text-neutral-300 font-sans font-normal">Abonnés</span>
            </span>
          </div>
        </div>
      </div>

      {/* Filter / Search bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher un projet par nom, niche ou plateforme..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-neutral-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden shadow-3xs"
          />
        </div>

        <span className="text-xs font-bold text-neutral-500 font-mono">
          Affichage : {filteredChannels.length} / {channels.length} projet(s)
        </span>
      </div>

      {/* Grid of Interactive Project Cards */}
      {filteredChannels.length === 0 ? (
        <div className="text-center py-12 bg-white border border-dashed border-neutral-200 rounded-3xl p-6">
          <Tv className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-neutral-800">Aucun projet digital trouvé</h3>
          <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
            Créez votre premier projet média ou ajustez votre recherche.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un Projet</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredChannels.map(chan => {
            const credCount = (chan.credentials?.length || 0) + (chan.email ? 1 : 0);
            const ideaCount = chan.ideas?.length || 0;
            const linkCount = chan.usefulLinks?.length || 0;
            const deadlineCount = chan.deadlines?.length || 0;

            return (
              <motion.div
                key={chan.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.15 }}
                onClick={() => setSelectedChannel(chan)}
                className="bg-white border border-neutral-200 hover:border-indigo-400/80 rounded-3xl p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group relative overflow-hidden"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs">
                        {chan.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-black text-neutral-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                          {chan.name}
                        </h3>
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-md">
                          {chan.platform}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(`Voulez-vous vraiment supprimer le projet "${chan.name}" ?`)) {
                            handleDeleteChannel(chan.id);
                          }
                        }}
                        className="p-1.5 text-neutral-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer"
                        title="Supprimer ce projet"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="p-1.5 rounded-xl bg-neutral-100 text-neutral-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-neutral-500 line-clamp-2 min-h-[32px]">
                    {chan.niche || "Projet digital & diffusion média"}
                  </p>

                  <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-mono font-bold">
                    <span className="text-neutral-400 text-[11px]">Audience / Abonnés :</span>
                    <span className="text-emerald-600 font-extrabold">{(chan.subscriberCount || 0).toLocaleString("fr-FR")}</span>
                  </div>
                </div>

                {/* Quick Summary Badges */}
                <div className="grid grid-cols-4 gap-1.5 bg-neutral-50 border border-neutral-100 p-2 rounded-2xl text-[10px] font-mono text-center">
                  <div className="p-1 bg-white rounded-xl border border-neutral-200/80" title="Identifiants & Mots de passe">
                    <Key className="w-3.5 h-3.5 text-amber-600 mx-auto mb-0.5" />
                    <span className="font-bold text-neutral-800">{credCount}</span>
                  </div>
                  <div className="p-1 bg-white rounded-xl border border-neutral-200/80" title="Idées de sujets">
                    <Lightbulb className="w-3.5 h-3.5 text-indigo-600 mx-auto mb-0.5" />
                    <span className="font-bold text-neutral-800">{ideaCount}</span>
                  </div>
                  <div className="p-1 bg-white rounded-xl border border-neutral-200/80" title="Liens utiles">
                    <Link2 className="w-3.5 h-3.5 text-cyan-600 mx-auto mb-0.5" />
                    <span className="font-bold text-neutral-800">{linkCount}</span>
                  </div>
                  <div className="p-1 bg-white rounded-xl border border-neutral-200/80" title="Deadlines & tâches">
                    <Calendar className="w-3.5 h-3.5 text-rose-600 mx-auto mb-0.5" />
                    <span className="font-bold text-neutral-800">{deadlineCount}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedChannel(chan);
                  }}
                  className="w-full py-2.5 px-3 bg-neutral-900 group-hover:bg-indigo-600 text-white rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-3xs"
                >
                  <span>Ouvrir la fenêtre du projet</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Modal for Adding a Project */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-neutral-200 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden my-6"
            >
              <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
                    <Tv className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white">Nouveau Projet Digital / Média</h3>
                    <p className="text-xs text-neutral-400">Créez la fenêtre dédiée à votre nouveau canal.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="p-6 space-y-4">
                <div>
                  <label className="text-xs font-bold text-neutral-800 block mb-1">Nom du Projet Digital *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: The Moroccan Tech Digest"
                    value={newChannel.name}
                    onChange={e => setNewChannel({ ...newChannel, name: e.target.value })}
                    className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">Plateforme / Réseau</label>
                    <select
                      value={newChannel.platform}
                      onChange={e => setNewChannel({ ...newChannel, platform: e.target.value as any })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden font-bold"
                    >
                      <option value="YouTube">YouTube</option>
                      <option value="TikTok">TikTok</option>
                      <option value="LinkedIn">LinkedIn</option>
                      <option value="Instagram">Instagram</option>
                      <option value="Spotify">Spotify</option>
                      <option value="Udemy / Formation">Udemy / Formation</option>
                      <option value="Produit Digital">Produit Digital (Ebook, SaaS...)</option>
                      <option value="Site Web / Blog">Site Web / Blog</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">Audience / Abonnés</label>
                    <input
                      type="number"
                      required
                      placeholder="Ex: 5000"
                      value={newChannel.subscriberCount}
                      onChange={e => setNewChannel({ ...newChannel, subscriberCount: Number(e.target.value) })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs font-mono font-bold text-emerald-600 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">Niche Éditoriale</label>
                    <input
                      type="text"
                      placeholder="Ex: Tech & Startups Maroc"
                      value={newChannel.niche}
                      onChange={e => setNewChannel({ ...newChannel, niche: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-neutral-800 block mb-1">Fréquence de publication</label>
                    <input
                      type="text"
                      placeholder="Ex: 2 vidéos / semaine"
                      value={newChannel.frequency}
                      onChange={e => setNewChannel({ ...newChannel, frequency: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-neutral-100">
                  <div>
                    <label className="text-[11px] font-bold text-neutral-600 block mb-1">Email de Connexion (Optionnel)</label>
                    <input
                      type="email"
                      placeholder="contact@canal.ma"
                      value={newChannel.email}
                      onChange={e => setNewChannel({ ...newChannel, email: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-neutral-600 block mb-1">Mot de Passe (Optionnel)</label>
                    <input
                      type="password"
                      placeholder="Secret..."
                      value={newChannel.password}
                      onChange={e => setNewChannel({ ...newChannel, password: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-4 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
                  >
                    Créer le Projet
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal for Project Details */}
      <AnimatePresence>
        {selectedChannel && (
          <MediaProjectDetailsModal
            channel={selectedChannel}
            onClose={() => setSelectedChannel(null)}
            onUpdateChannel={handleUpdateSelectedChannel}
            onDeleteChannel={handleDeleteChannel}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
