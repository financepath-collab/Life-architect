import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Tv, 
  Key, 
  Lightbulb, 
  Link2, 
  Calendar, 
  Plus, 
  ExternalLink, 
  ChevronRight, 
  Layers, 
  Sparkles, 
  Globe, 
  Lock, 
  Users,
  Settings
} from "lucide-react";
import InteractiveModuleTable, { TableColumn } from "./InteractiveModuleTable";
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

  const channelsColumns: TableColumn[] = [
    { key: "name", label: "Nom du Projet Digital / Média", type: "text", required: true },
    { key: "platform", label: "Plateforme / Réseau", type: "select", options: ["YouTube", "TikTok", "LinkedIn", "Instagram", "Spotify", "Autre"] },
    { key: "subscriberCount", label: "Abonnés / Audience", type: "number", required: true },
    { key: "niche", label: "Niche Éditoriale", type: "text" },
    { key: "frequency", label: "Fréquence / Type", type: "text" }
  ];

  const handleAddChannel = (item: any) => {
    setChannels(prev => [...prev, item]);
  };

  const handleEditChannel = (id: string, updated: any) => {
    setChannels(prev => prev.map(x => x.id === id ? updated : x));
  };

  const handleDeleteChannel = (id: string) => {
    setChannels(prev => prev.filter(x => x.id !== id));
  };

  const handleImportChannels = (items: any[]) => {
    setChannels(prev => [...prev, ...items]);
  };

  const handleUpdateSelectedChannel = (updatedChannel: ChannelInfo) => {
    setChannels(prev => prev.map(c => c.id === updatedChannel.id ? updatedChannel : c));
    setSelectedChannel(updatedChannel);
  };

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
              Projets Médias & Digitaux
            </h2>
            <span className="text-[10px] font-bold px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full">
              {channels.length} Projets
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1 max-w-2xl">
            Espace centralisé de vos médias, canaux et projets digitaux (inc. L'Académie THE MA CIRCLE). Cliquez sur un projet pour ouvrir sa fenêtre dédiée (Emails, mots de passe, idées de sujets, liens utiles, deadlines).
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-neutral-900 text-white border border-neutral-800 rounded-2xl px-4 py-2 text-right">
            <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block">Audience Cumulée</span>
            <span className="text-base font-black font-mono text-emerald-400">
              {totalAudience.toLocaleString("fr-FR")} <span className="text-xs text-neutral-300 font-sans font-normal">Abonnés</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Interactive Project Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {channels.map(chan => {
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

                  <div className="p-1.5 rounded-xl bg-neutral-100 text-neutral-500 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                <p className="text-xs text-neutral-500 line-clamp-2">
                  {chan.niche || "Projet digital & diffusion média"}
                </p>

                <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-xs font-mono font-bold">
                  <span className="text-neutral-400 text-[11px]">Audience / Abonnés :</span>
                  <span className="text-emerald-600 font-extrabold">{chan.subscriberCount.toLocaleString("fr-FR")}</span>
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

      {/* Interactive Module Table for Channels */}
      <InteractiveModuleTable
        title="Liste & Statistiques des Projets Digitaux & Médias"
        description="Gérez les paramètres globaux d'audience, plateformes et fréquences."
        columns={channelsColumns}
        data={channels}
        onAdd={handleAddChannel}
        onEdit={handleEditChannel}
        onDelete={handleDeleteChannel}
        onImport={handleImportChannels}
        currencySymbol="Abonnés"
        placeholderText="Rechercher un projet média par nom ou niche..."
      />

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
