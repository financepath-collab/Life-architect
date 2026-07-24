import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Tv, GraduationCap, Sparkles, BookOpen, Layers } from "lucide-react";
import InteractiveModuleTable, { TableColumn } from "./InteractiveModuleTable";
import FormationsSection from "./FormationsSection";
import { ChannelInfo, Formation, ProjectFolder } from "../types";

interface MediaAndAcademySectionProps {
  channels: ChannelInfo[];
  setChannels: React.Dispatch<React.SetStateAction<ChannelInfo[]>>;
  formations: Formation[];
  setFormations: React.Dispatch<React.SetStateAction<Formation[]>>;
  folders?: ProjectFolder[];
  setFolders?: React.Dispatch<React.SetStateAction<ProjectFolder[]>>;
  initialTab?: "channels" | "academy";
}

export default function MediaAndAcademySection({
  channels,
  setChannels,
  formations,
  setFormations,
  folders = [],
  setFolders,
  initialTab = "channels"
}: MediaAndAcademySectionProps) {
  const [activeTab, setActiveTab] = useState<"channels" | "academy">(initialTab);

  const channelsColumns: TableColumn[] = [
    { key: "name", label: "Nom du Canal / Projet Médias", type: "text", required: true },
    { key: "platform", label: "Réseau Social", type: "select", options: ["YouTube", "TikTok", "LinkedIn", "Instagram", "Spotify"] },
    { key: "subscriberCount", label: "Abonnés / Audience", type: "number", required: true },
    { key: "niche", label: "Niche Éditoriale", type: "text" },
    { key: "frequency", label: "Fréquence de Publication", type: "text" }
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

  const totalAudience = channels.reduce((sum, c) => sum + (c.subscriberCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner Navigation & Context Switcher */}
      <div className="bg-white border border-neutral-200/90 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-neutral-900 tracking-tight">
              Projets Médias, Canaux & L'Académie THE MA CIRCLE
            </h2>
            <span className="text-[10px] font-bold px-2.5 py-0.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-full">
              Ecosystème Unifié
            </span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">
            Gérez vos canaux de diffusion média (YouTube, TikTok, Spotify...) ainsi que votre Académie de cours et formations certifiantes.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-neutral-100 p-1 rounded-2xl shrink-0 self-start sm:self-center">
          <button
            onClick={() => setActiveTab("channels")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "channels"
                ? "bg-neutral-900 text-white shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>Projets Médias & Canaux</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-white/20 rounded">
              {channels.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("academy")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "academy"
                ? "bg-neutral-900 text-white shadow-sm"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Académie & Formations</span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 bg-white/20 rounded">
              {formations.length}
            </span>
          </button>
        </div>
      </div>

      {/* Content Rendering based on Active Tab */}
      <AnimatePresence mode="wait">
        {activeTab === "channels" ? (
          <motion.div
            key="channels-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Stats Summary Card for Media Channels */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-neutral-900 text-white border border-neutral-800 rounded-2xl p-4 shadow-3xs flex flex-col justify-between">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Audience Globale Cumulée
                </span>
                <div className="mt-2">
                  <h4 className="text-2xl font-black font-mono text-emerald-400">
                    {totalAudience.toLocaleString("fr-FR")} <span className="text-xs text-neutral-300 font-sans">Abonnés</span>
                  </h4>
                  <span className="text-[10px] text-neutral-400 block mt-1">Sur l'ensemble de vos {channels.length} canaux médias</span>
                </div>
              </div>

              <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-3xs flex flex-col justify-between">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Canal Principal (Max Audience)
                </span>
                <div className="mt-2">
                  {channels.length > 0 ? (() => {
                    const topChan = [...channels].sort((a, b) => (b.subscriberCount || 0) - (a.subscriberCount || 0))[0];
                    return (
                      <>
                        <h4 className="text-base font-bold text-neutral-900 truncate" title={topChan.name}>
                          {topChan.name}
                        </h4>
                        <span className="text-xs font-bold font-mono text-indigo-600 block mt-0.5">
                          {topChan.subscriberCount.toLocaleString("fr-FR")} Abonnés ({topChan.platform})
                        </span>
                      </>
                    );
                  })() : (
                    <span className="text-xs text-neutral-400 italic">Aucun canal enregistré</span>
                  )}
                </div>
              </div>

              <div className="bg-indigo-50/80 border border-indigo-200/90 rounded-2xl p-4 shadow-3xs flex flex-col justify-between">
                <span className="text-[10px] font-bold text-indigo-900 uppercase tracking-wider block">
                  Intégration Académie THE MA CIRCLE
                </span>
                <div className="mt-2">
                  <p className="text-xs text-indigo-950 font-medium leading-snug">
                    Vos canaux servent de vitrine pour promouvoir les cours et programmes de l'Académie.
                  </p>
                  <button
                    onClick={() => setActiveTab("academy")}
                    className="mt-2 text-[11px] font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1 cursor-pointer"
                  >
                    <span>Voir les cours de l'Académie</span> →
                  </button>
                </div>
              </div>
            </div>

            {/* Interactive Module Table for Channels */}
            <InteractiveModuleTable
              title="Projets Médias & Canaux de Communication"
              description="Suivez vos statistiques d'audience, abonnés et fréquences de publication."
              columns={channelsColumns}
              data={channels}
              onAdd={handleAddChannel}
              onEdit={handleEditChannel}
              onDelete={handleDeleteChannel}
              onImport={handleImportChannels}
              currencySymbol="Abonnés"
              placeholderText="Rechercher un canal média par nom ou niche..."
            />
          </motion.div>
        ) : (
          <motion.div
            key="academy-tab"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
          >
            <FormationsSection
              formations={formations}
              setFormations={setFormations}
              folders={folders}
              setFolders={setFolders}
              hideTabs={false}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
