import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Dumbbell, 
  Music, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Square, 
  Volume2, 
  SkipForward, 
  SkipBack, 
  Flame, 
  Timer, 
  Check, 
  Activity, 
  Sparkles,
  AlertCircle,
  Calendar
} from "lucide-react";

// Predefined default exercises for a 30-minute balanced session
const DEFAULT_EXERCISES = [
  { id: "ex_1", name: "Échauffement Articulaire & Cardio", desc: "Rotations des bras, genoux hauts et jumping jacks doux.", duration: "5 min", completed: false },
  { id: "ex_2", name: "Squats de l'Atlas", desc: "Descente contrôlée, fesses en arrière, poids sur les talons.", duration: "5 min (3 séries x 15)", completed: false },
  { id: "ex_3", name: "Pompes Solides (Push-ups)", desc: "Gainage parfait, coudes à 45 degrés. Sur les genoux si besoin.", duration: "5 min (3 séries x 12)", completed: false },
  { id: "ex_4", name: "Fentes Alternées", desc: "Fente avant droite puis gauche, angle de 90° pour chaque genou.", duration: "5 min (3 séries x 10/jambe)", completed: false },
  { id: "ex_5", name: "Gainage Planche Royale", desc: "Appui sur les avant-bras, corps aligné, abdos et fessiers contractés.", duration: "5 min (4 x 45s de travail)", completed: false },
  { id: "ex_6", name: "Étirements & Retour au Calme", desc: "Respiration profonde, étirement des quadriceps, du dos et des épaules.", duration: "5 min", completed: false },
];

// Suggested playlist tracks
const SUGGESTED_PLAYLIST = [
  { id: "track_1", title: "Second Brain Power Cardio", artist: "Atlas Beats", duration: "3:45", tempo: "128 BPM", coverColor: "from-amber-500 to-red-500" },
  { id: "track_2", title: "Gnawa Electro Fusion", artist: "Maâlem Synth", duration: "4:12", tempo: "130 BPM", coverColor: "from-purple-500 to-indigo-500" },
  { id: "track_3", title: "Desert Run Up-tempo", artist: "Sahara Groove", duration: "3:58", tempo: "125 BPM", coverColor: "from-emerald-500 to-teal-500" },
  { id: "track_4", title: "BVC Bull Market Energy", artist: "CFO Chillout", duration: "4:30", tempo: "120 BPM", coverColor: "from-blue-500 to-cyan-500" },
  { id: "track_5", title: "Creativity Flow Workout", artist: "The Analyst Project", duration: "3:15", tempo: "135 BPM", coverColor: "from-rose-500 to-orange-500" },
];

export default function FocusSport({ 
  exercises: propsExercises, 
  setExercises: propsSetExercises,
  sportHistory = [],
  onToggleSportDay
}: { 
  exercises?: any[]; 
  setExercises?: React.Dispatch<React.SetStateAction<any[]>>; 
  sportHistory?: string[];
  onToggleSportDay?: (date: string) => void;
} = {}) {
  // --- TIMER STATES (30 mins = 1800s) ---
  const INITIAL_SECONDS = 1800;
  const [secondsLeft, setSecondsLeft] = useState(INITIAL_SECONDS);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // --- EXERCISES STATES ---
  const [localExercises, setLocalExercises] = useState(() => {
    const saved = localStorage.getItem("mp_sport_exercises");
    return saved ? JSON.parse(saved) : DEFAULT_EXERCISES;
  });

  const exercises = propsExercises !== undefined ? propsExercises : localExercises;
  const setExercises = propsSetExercises !== undefined ? propsSetExercises : setLocalExercises;

  // Keep local state in sync if props are not provided
  useEffect(() => {
    if (propsExercises === undefined) {
      localStorage.setItem("mp_sport_exercises", JSON.stringify(localExercises));
    }
  }, [localExercises, propsExercises]);

  const [newExName, setNewExName] = useState("");
  const [newExDesc, setNewExDesc] = useState("");
  const [newExDuration, setNewExDuration] = useState("5 min");

  // --- MUSIC PLAYLIST STATES ---
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [trackProgress, setTrackProgress] = useState(35); // simulated percent
  const [volume, setVolume] = useState(75);
  const musicIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // --- ALARM CHIME VIA WEB AUDIO API ---
  const playWorkoutEndChime = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      
      // Multi-tone notification
      const playTone = (freq: number, start: number, duration: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, start);
        
        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + duration - 0.05);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + duration);
      };

      playTone(523.25, ctx.currentTime, 0.3); // C5
      playTone(659.25, ctx.currentTime + 0.25, 0.3); // E5
      playTone(783.99, ctx.currentTime + 0.5, 0.3); // G5
      playTone(1046.50, ctx.currentTime + 0.75, 0.6); // C6
    } catch (e) {
      console.warn("Web Audio API not supported or blocked by browser autoplay policy.");
    }
  };

  // --- TIMER EFFECT ---
  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            if (timerRef.current) clearInterval(timerRef.current);
            playWorkoutEndChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive]);

  // --- MUSIC TRACK PROCESS SIMULATION ---
  useEffect(() => {
    if (isPlayingMusic) {
      musicIntervalRef.current = setInterval(() => {
        setTrackProgress((prev) => {
          if (prev >= 100) {
            // Next track automatically
            setCurrentTrackIndex((prevIndex) => (prevIndex + 1) % SUGGESTED_PLAYLIST.length);
            return 0;
          }
          return prev + 1;
        });
      }, 1500);
    } else {
      if (musicIntervalRef.current) clearInterval(musicIntervalRef.current);
    }

    return () => {
      if (musicIntervalRef.current) clearInterval(musicIntervalRef.current);
    };
  }, [isPlayingMusic]);

  // --- PERSIST EXERCISES ---
  useEffect(() => {
    localStorage.setItem("mp_sport_exercises", JSON.stringify(exercises));
  }, [exercises]);

  // --- FORMAT TIMER DISPLAY ---
  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // --- ACTIONS HANDLERS ---
  const handleToggleTimer = () => {
    setTimerActive(!timerActive);
  };

  const handleResetTimer = () => {
    setTimerActive(false);
    setSecondsLeft(INITIAL_SECONDS);
  };

  const handleToggleExercise = (id: string) => {
    setExercises(prev => prev.map(ex => ex.id === id ? { ...ex, completed: !ex.completed } : ex));
  };

  const handleAddExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExName.trim()) return;

    const newEx = {
      id: "ex_" + Date.now(),
      name: newExName.trim(),
      desc: newExDesc.trim() || "Exercice personnalisé ajouté à la séance.",
      duration: newExDuration.trim() || "5 min",
      completed: false
    };

    setExercises(prev => [...prev, newEx]);
    setNewExName("");
    setNewExDesc("");
    setNewExDuration("5 min");
  };

  const handleDeleteExercise = (id: string) => {
    setExercises(prev => prev.filter(ex => ex.id !== id));
  };

  const handleResetExercises = () => {
    setExercises(DEFAULT_EXERCISES.map(ex => ({ ...ex, completed: false })));
  };

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setTrackProgress(0);
    setIsPlayingMusic(true);
  };

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + SUGGESTED_PLAYLIST.length) % SUGGESTED_PLAYLIST.length);
    setTrackProgress(0);
  };

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % SUGGESTED_PLAYLIST.length);
    setTrackProgress(0);
  };

  // SVG Progress circle values
  const radius = 80;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const progressPercent = ((INITIAL_SECONDS - secondsLeft) / INITIAL_SECONDS) * 100;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  const activeTrack = SUGGESTED_PLAYLIST[currentTrackIndex];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER HERO */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="bg-neutral-900 text-white text-[10px] font-bold font-mono px-2.5 py-1 rounded-full flex items-center gap-1.5 uppercase">
              <Dumbbell className="w-3 h-3 text-amber-400" />
              Focus Sport Actif
            </span>
            <span className="text-neutral-300">•</span>
            <span className="text-xs font-semibold text-neutral-500">Session de 30 Minutes</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-neutral-900 tracking-tight font-display">
            Entraînement Quotidien Rénal & Cardio
          </h1>
          <p className="text-xs text-neutral-500 max-w-xl leading-relaxed">
            Maintenez une forme physique d'élite pour soutenir votre productivité de créateur de contenu. Un corps sain est le moteur d'un esprit stratégique.
          </p>
        </div>

        <button
          onClick={handleResetExercises}
          className="text-xs bg-neutral-150 hover:bg-neutral-200 text-neutral-800 px-4 py-2.5 rounded-xl font-bold transition-all border border-neutral-200/60 flex items-center gap-2"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Réinitialiser la Séance
        </button>
      </div>

      {/* CORE GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: TIMER & PLAYER (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* THE 30-MINUTE TIMER CARD */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 flex flex-col items-center justify-center shadow-sm relative overflow-hidden">
            <div className="absolute top-4 left-4 flex items-center gap-1.5 text-[10px] font-bold font-mono text-neutral-400 uppercase tracking-wider">
              <Timer className="w-3.5 h-3.5" />
              Minuterie d'Entraînement
            </div>

            <div className="py-8 flex flex-col items-center">
              {/* SVG Radial Progress Ring */}
              <div className="relative w-48 h-48 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  {/* Track circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r={radius}
                    className="stroke-neutral-100 fill-none"
                    strokeWidth={strokeWidth}
                  />
                  {/* Active progress circle */}
                  <motion.circle
                    cx="96"
                    cy="96"
                    r={radius}
                    className="stroke-neutral-900 fill-none"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.5, ease: "linear" }}
                    strokeLinecap="round"
                  />
                </svg>

                {/* Digital counter in center */}
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-black font-mono tracking-tight text-neutral-950">
                    {formatTime(secondsLeft)}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-1 font-mono">
                    {secondsLeft === 0 ? "Terminé !" : "Restant"}
                  </span>
                </div>
              </div>

              {/* Workout state visual status banner */}
              {secondsLeft === 0 ? (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-6 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Félicitations ! Séance de 30 min complétée !</span>
                </motion.div>
              ) : (
                <div className="mt-4 text-center">
                  <span className="text-xs font-medium text-neutral-500">
                    {timerActive ? "Séance active, donnez tout !" : "Prêt à démarrer votre chrono"}
                  </span>
                </div>
              )}

              {/* Controls */}
              <div className="flex items-center gap-4 mt-6">
                <button
                  onClick={handleToggleTimer}
                  disabled={secondsLeft === 0}
                  className={`w-14 h-14 rounded-full flex items-center justify-center text-white transition-all shadow-md cursor-pointer ${
                    secondsLeft === 0 
                      ? "bg-neutral-200 cursor-not-allowed" 
                      : timerActive 
                        ? "bg-neutral-800 hover:bg-neutral-900" 
                        : "bg-neutral-950 hover:bg-neutral-800"
                  }`}
                  title={timerActive ? "Pause" : "Démarrer"}
                >
                  {timerActive ? <Pause className="w-6 h-6 fill-white" /> : <Play className="w-6 h-6 fill-white ml-1" />}
                </button>

                <button
                  onClick={handleResetTimer}
                  className="w-12 h-12 rounded-full border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-600 flex items-center justify-center transition-all shadow-2xs cursor-pointer"
                  title="Réinitialiser"
                >
                  <RotateCcw className="w-4.5 h-4.5" />
                </button>
              </div>
            </div>
          </div>

          {/* SUGGESTED PLAYLIST / MUSIC PLAYER */}
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-neutral-950 uppercase tracking-widest font-mono flex items-center gap-2">
                <Music className="w-4 h-4 text-neutral-800" />
                Playlist d'Entraînement
              </h3>
              <span className="text-[10px] text-neutral-400 font-mono">BPM ÉLEVÉ</span>
            </div>

            {/* Current Track Player Card */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 flex flex-col gap-4">
              <div className="flex items-center gap-3.5">
                {/* Simulated Album Cover with pulsing graphic if playing */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${activeTrack.coverColor} flex items-center justify-center text-white shadow-2xs relative shrink-0 overflow-hidden`}>
                  {isPlayingMusic ? (
                    <div className="flex items-end gap-1 h-5 w-5 justify-center">
                      <span className="w-1 bg-white rounded-full animate-[bounce_0.8s_infinite_100ms] h-full"></span>
                      <span className="w-1 bg-white rounded-full animate-[bounce_0.8s_infinite_300ms] h-3/4"></span>
                      <span className="w-1 bg-white rounded-full animate-[bounce_0.8s_infinite_200ms] h-1/2"></span>
                    </div>
                  ) : (
                    <Music className="w-5 h-5 opacity-90" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <span className="text-xs font-black text-neutral-900 block truncate leading-tight">
                    {activeTrack.title}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-medium block mt-0.5">
                    {activeTrack.artist} • {activeTrack.tempo}
                  </span>
                </div>
              </div>

              {/* Progress Slider (Simulated) */}
              <div className="space-y-1">
                <div 
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    const percent = Math.round((clickX / rect.width) * 100);
                    setTrackProgress(percent);
                  }}
                  className="h-1.5 bg-neutral-200 rounded-full overflow-hidden cursor-pointer relative"
                >
                  <div 
                    style={{ width: `${trackProgress}%` }}
                    className={`h-full bg-neutral-900 rounded-full transition-all duration-300`}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-neutral-400 font-mono">
                  <span>0:45</span>
                  <span>{activeTrack.duration}</span>
                </div>
              </div>

              {/* Player control buttons */}
              <div className="flex items-center justify-between px-2">
                <button 
                  onClick={handlePrevTrack}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-200/50 transition-colors cursor-pointer"
                >
                  <SkipBack className="w-4 h-4" />
                </button>

                <button 
                  onClick={() => setIsPlayingMusic(!isPlayingMusic)}
                  className="w-10 h-10 bg-neutral-900 hover:bg-neutral-800 text-white rounded-full flex items-center justify-center transition-all shadow-xs cursor-pointer"
                >
                  {isPlayingMusic ? <Pause className="w-4.5 h-4.5 fill-white" /> : <Play className="w-4.5 h-4.5 fill-white ml-0.5" />}
                </button>

                <button 
                  onClick={handleNextTrack}
                  className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-lg hover:bg-neutral-200/50 transition-colors cursor-pointer"
                >
                  <SkipForward className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 shrink-0 ml-4 border-l border-neutral-200 pl-4">
                  <Volume2 className="w-3.5 h-3.5 text-neutral-400" />
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={volume} 
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-16 h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-neutral-900"
                  />
                </div>
              </div>
            </div>

            {/* Playlist Track list */}
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              {SUGGESTED_PLAYLIST.map((track, idx) => {
                const isActive = idx === currentTrackIndex;
                return (
                  <button
                    key={track.id}
                    onClick={() => handleTrackSelect(idx)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left border transition-all cursor-pointer ${
                      isActive 
                        ? "bg-neutral-900 border-neutral-950 text-white shadow-xs" 
                        : "bg-white border-neutral-100 hover:bg-neutral-50 hover:border-neutral-200 text-neutral-800"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${track.coverColor} flex items-center justify-center text-white font-mono text-[9px] font-bold shrink-0`}>
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <span className={`text-xs font-bold block truncate ${isActive ? "text-white" : "text-neutral-900"}`}>
                          {track.title}
                        </span>
                        <span className={`text-[9px] block mt-0.5 truncate ${isActive ? "text-neutral-300" : "text-neutral-400"}`}>
                          {track.artist}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-2">
                      <span className={`text-[9px] font-mono ${isActive ? "text-neutral-300" : "text-neutral-400"}`}>
                        {track.tempo}
                      </span>
                      <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                        isActive ? "bg-white/15 text-white" : "bg-neutral-100 text-neutral-500"
                      }`}>
                        {track.duration}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: WORKOUT EXERCISES (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white border border-neutral-200 rounded-3xl p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-neutral-950 uppercase tracking-tight flex items-center gap-2">
                  <Activity className="w-4.5 h-4.5 text-neutral-900" />
                  Programme d'Entraînement Requis
                </h3>
                <p className="text-xs text-neutral-400">
                  Validez chaque exercice pour compléter les 30 minutes de séance sportive active.
                </p>
              </div>
              <span className="text-xs bg-neutral-100 border border-neutral-200 text-neutral-800 px-3 py-1 rounded-full font-mono font-bold">
                {exercises.filter((ex: any) => ex.completed).length} / {exercises.length} validés
              </span>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-bold text-neutral-400 font-mono uppercase">
                <span>Avancement de l'effort</span>
                <span>{exercises.length > 0 ? Math.round((exercises.filter((ex: any) => ex.completed).length / exercises.length) * 100) : 0}%</span>
              </div>
              <div className="h-2 bg-neutral-100 rounded-full overflow-hidden border border-neutral-200/50">
                <motion.div 
                  className="h-full bg-neutral-900 rounded-full"
                  style={{ width: `${exercises.length > 0 ? (exercises.filter((ex: any) => ex.completed).length / exercises.length) * 100 : 0}%` }}
                  layout
                />
              </div>
            </div>

            {/* List of exercises */}
            <div className="space-y-3">
              <AnimatePresence initial={false}>
                {exercises.map((ex: any) => (
                  <motion.div
                    key={ex.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`flex items-start justify-between p-4 rounded-2xl border transition-all ${
                      ex.completed
                        ? "bg-neutral-50/50 border-neutral-150 text-neutral-400"
                        : "bg-white border-neutral-200 text-neutral-800 hover:shadow-2xs"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleToggleExercise(ex.id)}
                      className="flex-1 flex items-start gap-3 text-left cursor-pointer mr-3"
                    >
                      <div className="shrink-0 mt-0.5">
                        {ex.completed ? (
                          <CheckCircle className="w-5 h-5 text-neutral-900 fill-neutral-900 text-white" />
                        ) : (
                          <Square className="w-5 h-5 text-neutral-300 hover:text-neutral-400" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <span className={`text-xs font-bold block leading-tight ${ex.completed ? "line-through text-neutral-400" : "text-neutral-900"}`}>
                          {ex.name}
                        </span>
                        <p className={`text-[11px] leading-relaxed ${ex.completed ? "text-neutral-400/80" : "text-neutral-500"}`}>
                          {ex.desc}
                        </p>
                      </div>
                    </button>

                    <div className="flex items-center gap-3 shrink-0 ml-2">
                      <span className={`text-[9px] font-bold font-mono px-2 py-0.5 rounded border uppercase ${
                        ex.completed 
                          ? "bg-neutral-100/50 border-neutral-200 text-neutral-400" 
                          : "bg-neutral-50 border-neutral-200 text-neutral-600"
                      }`}>
                        {ex.duration}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleDeleteExercise(ex.id)}
                        className="text-neutral-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer"
                        title="Supprimer l'exercice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {exercises.length === 0 && (
                <div className="text-xs text-neutral-400 italic py-10 text-center bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200">
                  Aucun exercice planifié. Ajoutez-en un ci-dessous !
                </div>
              )}
            </div>

            {/* Add Custom Exercise Form */}
            <form onSubmit={handleAddExercise} className="bg-neutral-50 border border-neutral-200 p-4 rounded-2xl space-y-3">
              <div className="flex items-center gap-1.5 pb-2 border-b border-neutral-100">
                <Plus className="w-4 h-4 text-neutral-900" />
                <span className="text-[10px] font-bold text-neutral-900 uppercase tracking-wider font-mono">
                  Ajouter un Exercice Sur-Mesure
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  type="text"
                  required
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                  placeholder="Nom de l'exercice (ex: Traction, Burpees)"
                  className="bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-all font-medium"
                />
                
                <input
                  type="text"
                  value={newExDuration}
                  onChange={(e) => setNewExDuration(e.target.value)}
                  placeholder="Durée / Répétitions (ex: 5 min ou 3x10)"
                  className="bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-all font-medium"
                />
              </div>

              <input
                type="text"
                value={newExDesc}
                onChange={(e) => setNewExDesc(e.target.value)}
                placeholder="Description rapide de l'exécution ou conseils..."
                className="w-full bg-white border border-neutral-200 rounded-xl px-3.5 py-2.5 text-xs text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 transition-all font-medium"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-neutral-950 hover:bg-neutral-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  Ajouter à la séance
                </button>
              </div>
            </form>
          </div>

          {/* TIPS & BENEFIT CARD */}
          <div className="bg-amber-50/50 border border-amber-200/60 rounded-3xl p-5 flex gap-4">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-xs font-extrabold text-amber-900 uppercase tracking-wider font-mono">
                Conseils du Coach d'Élite
              </h4>
              <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                Pensez à bien vous hydrater tout au long de votre séance de 30 minutes. Un apport hydrique suffisant améliore la clarté d'esprit de 15% et élimine le stress créatif accumulé lors de l'analyse financière et du montage de vos vidéos pro.
              </p>
            </div>
          </div>

        </div>

      </div>

      {/* SECTION : HISTORIQUE DES ENTRAÎNEMENTS (CALENDRIER) */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
          <div className="space-y-1">
            <h3 className="text-base font-black text-neutral-900 tracking-tight flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-500" />
              Historique Personnel & Calendrier d'Effort
            </h3>
            <p className="text-xs text-neutral-400">
              Visualisez et gérez les jours où vous avez complété vos 30 minutes de sport. Cliquez sur un jour pour l'activer ou le désactiver rétroactivement.
            </p>
          </div>
          
          {/* STATS RAPIDES */}
          <div className="flex items-center gap-3 bg-neutral-50 px-4 py-2.5 rounded-2xl border border-neutral-200/60 self-start">
            <div className="text-center px-3 border-r border-neutral-200">
              <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Jours Actifs</span>
              <span className="text-base font-black font-mono text-neutral-900">{sportHistory.length}</span>
            </div>
            <div className="text-center px-3">
              <span className="text-[10px] text-neutral-400 font-bold block uppercase tracking-wider">Effort Cumulé</span>
              <span className="text-base font-black font-mono text-amber-600">{sportHistory.length * 30} min</span>
            </div>
          </div>
        </div>

        {/* CALENDRIER */}
        <div>
          {(() => {
            const today = new Date();
            const year = today.getFullYear();
            const month = today.getMonth();
            const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const firstDayIndex = new Date(year, month, 1).getDay();
            const offset = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Mon is 0

            const calendarCells = [];
            for (let i = 0; i < offset; i++) calendarCells.push(null);
            for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

            return (
              <div className="max-w-3xl mx-auto space-y-4">
                <div className="flex justify-between items-center bg-neutral-900 text-white px-5 py-3.5 rounded-2xl font-bold text-sm tracking-wide shadow-xs">
                  <span className="uppercase font-mono tracking-widest">{monthNames[month]} {year}</span>
                  <span className="text-xs font-medium text-neutral-400 bg-neutral-800 px-3 py-1 rounded-full border border-neutral-700/50">Simulé à 30 min/jour</span>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-bold text-neutral-400 uppercase tracking-wider py-1">
                  <div>Lun</div>
                  <div>Mar</div>
                  <div>Mer</div>
                  <div>Jeu</div>
                  <div>Ven</div>
                  <div>Sam</div>
                  <div>Dim</div>
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {calendarCells.map((day, idx) => {
                    if (day === null) {
                      return <div key={`empty-${idx}`} className="aspect-square bg-neutral-50/30 rounded-xl border border-transparent" />;
                    }

                    const mm = String(month + 1).padStart(2, '0');
                    const dd = String(day).padStart(2, '0');
                    const dateStr = `${year}-${mm}-${dd}`;
                    const isCompleted = sportHistory.includes(dateStr);
                    const isToday = today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

                    return (
                      <button
                        key={`day-${day}`}
                        type="button"
                        onClick={() => onToggleSportDay?.(dateStr)}
                        className={`relative aspect-square flex flex-col items-center justify-between p-2 rounded-2xl border text-xs font-bold transition-all cursor-pointer group ${
                          isCompleted
                            ? "bg-amber-50 border-amber-300 text-amber-950 shadow-3xs hover:bg-amber-100"
                            : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50"
                        } ${isToday ? "ring-2 ring-neutral-900 ring-offset-2" : ""}`}
                      >
                        <span className={`text-[10px] self-start leading-none ${isToday ? "bg-neutral-900 text-white rounded-md px-1 py-0.5" : ""}`}>{day}</span>
                        
                        {isCompleted ? (
                          <div className="flex flex-col items-center gap-0.5">
                            <Dumbbell className="w-4 h-4 text-amber-600 fill-amber-200" />
                            <span className="text-[8px] font-mono font-medium text-amber-800 leading-none">30m</span>
                          </div>
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-dashed border-neutral-300 flex items-center justify-center group-hover:border-neutral-400">
                            <span className="text-[7px] text-neutral-300 group-hover:text-neutral-500 font-mono">+</span>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

    </div>
  );
}
