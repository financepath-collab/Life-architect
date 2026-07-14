import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sun, 
  CloudRain, 
  Cloud, 
  CloudLightning, 
  Wind, 
  Thermometer, 
  RefreshCw, 
  MapPin,
  Sparkles
} from "lucide-react";

interface WeatherCondition {
  id: string;
  label: string;
  temp: number;
  description: string;
  colorClass: string;
  bgGradient: string;
  advice: string;
  icon: React.ComponentType<any>;
}

const MOROCCAN_CITIES = [
  { id: "casa", name: "Casablanca" },
  { id: "kech", name: "Marrakech" },
  { id: "tanger", name: "Tanger" },
  { id: "rabat", name: "Rabat" },
  { id: "essaouira", name: "Essaouira" }
];

const WEATHER_CONDITIONS: Record<string, WeatherCondition[]> = {
  casa: [
    {
      id: "sunny",
      label: "Ensoleillé",
      temp: 28,
      description: "Soleil éclatant sur la Mosquée Hassan II",
      colorClass: "text-amber-500 dark:text-amber-400",
      bgGradient: "from-amber-50 to-orange-100/50 dark:from-amber-950/20 dark:to-orange-950/10",
      advice: "Conditions de lumière optimales ! Un timing idéal pour tourner vos prochaines vidéos YouTube ou sortir prendre l'air.",
      icon: Sun
    },
    {
      id: "rainy",
      label: "Averse de pluie",
      temp: 17,
      description: "Pluie rafraîchissante sur l'avenue Anfa",
      colorClass: "text-blue-500 dark:text-blue-400",
      bgGradient: "from-blue-50 to-indigo-100/50 dark:from-blue-950/20 dark:to-indigo-950/10",
      advice: "Ambiance cocooning parfaite. Préparez un bon thé à la menthe et consacrez-vous à la rédaction de vos scripts ou à vos rapports financiers.",
      icon: CloudRain
    },
    {
      id: "cloudy",
      label: "Partiellement nuageux",
      temp: 21,
      description: "Nuages légers au-dessus du Twin Center",
      colorClass: "text-neutral-500 dark:text-neutral-400",
      bgGradient: "from-neutral-50 to-neutral-200/50 dark:from-neutral-900/40 dark:to-neutral-800/20",
      advice: "Lumière douce et diffuse. Profitez de ce calme visuel pour peaufiner la stratégie de vos chaînes.",
      icon: Cloud
    }
  ],
  kech: [
    {
      id: "sunny",
      label: "Soleil de Plomb",
      temp: 36,
      description: "Ciel pur et chaleur intense sur la place Jemaa el-Fna",
      colorClass: "text-red-500 dark:text-red-400",
      bgGradient: "from-red-50 to-amber-100/50 dark:from-red-950/20 dark:to-amber-950/10",
      advice: "Forte chaleur dehors ! Restez au frais dans votre studio pour analyser la Bourse ou faire votre session de skin care quotidienne.",
      icon: Sun
    },
    {
      id: "windy",
      label: "Vent chaud",
      temp: 29,
      description: "Brise du désert et poussière dorée sur la Ménara",
      colorClass: "text-teal-500 dark:text-teal-400",
      bgGradient: "from-teal-50 to-emerald-100/50 dark:from-teal-950/20 dark:to-emerald-950/10",
      advice: "Un souffle d'inspiration sauvage ! Laissez les idées de concepts originaux envahir votre calendrier éditorial.",
      icon: Wind
    }
  ],
  tanger: [
    {
      id: "windy",
      label: "Vent d'Est (Chergui)",
      temp: 22,
      description: "Rafales vivifiantes sur la baie de Tanger",
      colorClass: "text-sky-500 dark:text-sky-400",
      bgGradient: "from-sky-50 to-cyan-100/50 dark:from-sky-950/20 dark:to-cyan-950/10",
      advice: "Ça décoiffe ! Canalisez cette énergie dynamique pour terminer votre sprint de 30 jours.",
      icon: Wind
    },
    {
      id: "rainy",
      label: "Pluie côtière",
      temp: 16,
      description: "Crachin océanique sur le Port de Tanger Ville",
      colorClass: "text-blue-600 dark:text-blue-500",
      bgGradient: "from-blue-50/70 to-slate-100/60 dark:from-blue-950/30 dark:to-slate-900/20",
      advice: "Le bruit des vagues et de la pluie s'harmonise. Idéal pour lire un de vos livres en retard ou travailler un cours.",
      icon: CloudRain
    }
  ],
  rabat: [
    {
      id: "sunny",
      label: "Ensoleillé et Doux",
      temp: 24,
      description: "Météo idéale sur les jardins des Oudayas",
      colorClass: "text-amber-500 dark:text-amber-400",
      bgGradient: "from-amber-50 to-orange-100/50 dark:from-amber-950/20 dark:to-orange-950/10",
      advice: "Climat royal ! Sortez marcher 15 minutes pour valider votre habitude sportive et oxygéner votre cerveau créatif.",
      icon: Sun
    },
    {
      id: "lightning",
      label: "Orage d'été",
      temp: 20,
      description: "Éclairs au loin sur le fleuve Bouregreg",
      colorClass: "text-purple-500 dark:text-purple-400",
      bgGradient: "from-purple-50 to-fuchsia-100/50 dark:from-purple-950/20 dark:to-fuchsia-950/10",
      advice: "Atmosphère électrique ! Lancez une session intensive de Deep Work en mode Concentration active pour surclasser vos objectifs.",
      icon: CloudLightning
    }
  ],
  essaouira: [
    {
      id: "windy",
      label: "Alizés puissants",
      temp: 19,
      description: "Les remparts d'Essaouira balayés par le vent",
      colorClass: "text-teal-500 dark:text-teal-400",
      bgGradient: "from-teal-50 to-sky-100/50 dark:from-teal-950/20 dark:to-sky-950/10",
      advice: "La cité des alizés porte bien son nom. Profitez de ce vent de fraîcheur pour renouveler votre vision et planifier vos budgets.",
      icon: Wind
    }
  ]
};

export default function WeatherWidget() {
  const [selectedCity, setSelectedCity] = useState("casa");
  const [conditionIndex, setConditionIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const availableConditions = WEATHER_CONDITIONS[selectedCity] || WEATHER_CONDITIONS.casa;
  const currentCondition = availableConditions[conditionIndex % availableConditions.length];

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
    setConditionIndex(0);
  };

  const handleRefreshCondition = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 600);
    setConditionIndex(prev => prev + 1);
  };

  const ActiveIcon = currentCondition.icon;

  return (
    <div className="bg-white dark:bg-zinc-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-5 shadow-3xs hover:shadow-2xs transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Left Side: Header & City Selector */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-neutral-900 dark:bg-zinc-800 text-white dark:text-neutral-200 rounded-xl">
            <MapPin className="w-4 h-4" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400 block font-mono">
              Météo Inspirante du Jour
            </span>
            <div className="flex items-center gap-2">
              <select
                value={selectedCity}
                onChange={handleCityChange}
                className="text-sm font-black text-neutral-900 dark:text-neutral-100 bg-transparent border-none outline-none focus:ring-0 p-0 pr-6 cursor-pointer hover:text-neutral-700 transition-colors"
                id="weather-city-select"
              >
                {MOROCCAN_CITIES.map(city => (
                  <option key={city.id} value={city.id} className="bg-white dark:bg-zinc-900 font-bold text-neutral-800 dark:text-neutral-200">
                    {city.name}, Maroc
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Right Side: Refresh Weather Control */}
        <button
          onClick={handleRefreshCondition}
          className="flex items-center gap-1.5 self-start sm:self-center bg-neutral-50 dark:bg-zinc-850 hover:bg-neutral-100 dark:hover:bg-zinc-800 text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 text-[10px] font-extrabold px-3 py-2 rounded-xl transition-all cursor-pointer border border-neutral-200/50 dark:border-neutral-700/50 select-none"
          title="Simuler un changement météo"
          id="weather-refresh-btn"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRotating ? "animate-spin" : ""}`} />
          <span>SIMULER LE TEMPS</span>
        </button>
      </div>

      {/* Main Condition Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedCity}_${currentCondition.id}_${conditionIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className={`mt-4 p-4 rounded-2xl bg-gradient-to-r ${currentCondition.bgGradient} border border-neutral-200/30 dark:border-neutral-700/10 flex flex-col md:flex-row md:items-center gap-5 justify-between`}
        >
          {/* Weather visual & metrics */}
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-white/40 dark:bg-zinc-800/40 rounded-full blur-md" />
              <div className={`relative p-3.5 rounded-full bg-white dark:bg-zinc-850 border border-neutral-100 dark:border-zinc-800 shadow-3xs ${currentCondition.colorClass}`}>
                <ActiveIcon className="w-8 h-8 animate-pulse" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black font-mono text-neutral-900 dark:text-neutral-100 leading-none">
                  {currentCondition.temp}°C
                </span>
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-white/80 dark:bg-zinc-900/60 px-2.5 py-0.5 rounded-full border border-neutral-200/40 dark:border-neutral-700/40 shadow-3xs">
                  {currentCondition.label}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 font-semibold leading-relaxed">
                {currentCondition.description}
              </p>
            </div>
          </div>

          {/* Inspirational advice card */}
          <div className="md:max-w-md bg-white/60 dark:bg-zinc-900/40 border border-white/80 dark:border-zinc-800/50 p-3.5 rounded-xl shadow-3xs space-y-1.5 backdrop-blur-xs flex-1">
            <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[9px] font-black uppercase tracking-wider">
                Conseil de Discipline d'Élite
              </span>
            </div>
            <p className="text-[11px] text-neutral-600 dark:text-neutral-300 leading-relaxed font-medium">
              {currentCondition.advice}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
