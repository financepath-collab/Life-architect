import React, { useState, useMemo } from "react";
import { 
  PiggyBank, 
  TrendingUp, 
  Coins, 
  HelpCircle, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine
} from "recharts";
import { motion } from "motion/react";

export default function FireCalculator() {
  // --- FIRE INPUT STATES ---
  const [currentAge, setCurrentAge] = useState<number>(28);
  const [startingCapital, setStartingCapital] = useState<number>(100000); // MAD
  const [monthlySavings, setMonthlySavings] = useState<number>(5000); // MAD
  const [targetRente, setTargetRente] = useState<number>(20000); // MAD per month
  const [annualReturnRate, setAnnualReturnRate] = useState<number>(8); // %
  const [withdrawalRate, setWithdrawalRate] = useState<number>(4); // % (Standard Rule of 4%)

  // --- COMPUTE FIRE METRICS ---
  const fireMetrics = useMemo(() => {
    // Target Capital needed for this rente based on withdrawal rate
    // Annual rente needed = targetRente * 12
    // Required Capital = (targetRente * 12) / (withdrawalRate / 100)
    const annualRenteNeeded = targetRente * 12;
    const requiredCapital = annualRenteNeeded / (withdrawalRate / 100);

    // Let's project the capital year by year (up to 40 years) to find the exact age of FIRE
    const projectionData: any[] = [];
    let currentCapital = startingCapital;
    let totalInvested = startingCapital;
    const monthlyRate = (annualReturnRate / 100) / 12;
    
    let fireAge: number | null = null;
    let fireYearIdx: number | null = null;

    // Loop through 40 years (480 months)
    for (let month = 1; month <= 480; month++) {
      const yearIdx = Math.floor((month - 1) / 12);
      const ageAtThisMonth = currentAge + (month / 12);

      // Monthly Compound Interest addition
      currentCapital = currentCapital * (1 + monthlyRate) + monthlySavings;
      totalInvested += monthlySavings;

      // Capture year-end data for the chart
      if (month % 12 === 0) {
        const year = yearIdx + 1;
        const currentYearAge = Math.round(currentAge + year);
        const interestEarned = Math.max(0, currentCapital - totalInvested);

        projectionData.push({
          year,
          age: currentYearAge,
          capital: Math.round(currentCapital),
          invested: Math.round(totalInvested),
          interest: Math.round(interestEarned),
        });

        // Detect first year when capital exceeds required capital
        if (currentCapital >= requiredCapital && fireAge === null) {
          fireAge = currentYearAge;
          fireYearIdx = year;
        }
      }
    }

    // Double check if FIRE is immediately met
    if (startingCapital >= requiredCapital && fireAge === null) {
      fireAge = currentAge;
      fireYearIdx = 0;
    }

    return {
      requiredCapital,
      fireAge,
      fireYearIdx,
      projectionData,
      annualRenteNeeded
    };
  }, [currentAge, startingCapital, monthlySavings, targetRente, annualReturnRate, withdrawalRate]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* HEADER SECTION */}
      <div className="pb-5 border-b border-neutral-100 dark:border-neutral-800 space-y-1">
        <h3 className="text-base font-black text-neutral-900 dark:text-neutral-50 flex items-center gap-2 uppercase tracking-tight">
          <TrendingUp className="w-5 h-5 text-neutral-800" />
          Calculateur de Liberté Financière (Mouvement FIRE)
        </h3>
        <p className="text-xs text-neutral-400 max-w-2xl leading-relaxed">
          Simulez votre trajectoire d'indépendance financière. Ce simulateur projette la capitalisation de votre épargne via des intérêts composés et détermine l'âge de votre retraite anticipée grâce à la règle des 4%.
        </p>
      </div>

      {/* INPUT CONTROLS & DYNAMIC KPIS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* INPUT FORM SLIDERS (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/60 dark:border-neutral-800 rounded-3xl p-6 space-y-5 shadow-3xs">
            <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider block font-mono">Simulateur de Paramètres</span>

            {/* Starting capital input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-700 dark:text-neutral-300">
                <span>Capital de Départ</span>
                <span className="font-mono text-neutral-900 dark:text-white">{startingCapital.toLocaleString("fr-FR")} MAD</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="1000000" 
                step="10000"
                value={startingCapital}
                onChange={(e) => setStartingCapital(Number(e.target.value))}
                className="w-full accent-neutral-900 dark:accent-white h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
                <span>0 MAD</span>
                <span>1 Million MAD</span>
              </div>
            </div>

            {/* Monthly savings input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-700 dark:text-neutral-300">
                <span>Épargne Mensuelle</span>
                <span className="font-mono text-neutral-900 dark:text-white">+{monthlySavings.toLocaleString("fr-FR")} MAD / mois</span>
              </div>
              <input 
                type="range" 
                min="500" 
                max="50000" 
                step="500"
                value={monthlySavings}
                onChange={(e) => setMonthlySavings(Number(e.target.value))}
                className="w-full accent-neutral-900 dark:accent-white h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
                <span>500 MAD</span>
                <span>50 000 MAD</span>
              </div>
            </div>

            {/* Target Rente input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-700 dark:text-neutral-300">
                <span>Rente Mensuelle Cible</span>
                <span className="font-mono text-neutral-900 dark:text-white">{targetRente.toLocaleString("fr-FR")} MAD / mois</span>
              </div>
              <input 
                type="range" 
                min="3000" 
                max="100000" 
                step="1000"
                value={targetRente}
                onChange={(e) => setTargetRente(Number(e.target.value))}
                className="w-full accent-neutral-900 dark:accent-white h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
                <span>3 000 MAD</span>
                <span>100 000 MAD</span>
              </div>
            </div>

            {/* Annual Return rate */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-700 dark:text-neutral-300">
                <span>Rendement Annuel Estimé</span>
                <span className="font-mono text-neutral-900 dark:text-white">{annualReturnRate}% (BVC / Immo)</span>
              </div>
              <input 
                type="range" 
                min="2" 
                max="15" 
                step="0.5"
                value={annualReturnRate}
                onChange={(e) => setAnnualReturnRate(Number(e.target.value))}
                className="w-full accent-neutral-900 dark:accent-white h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
                <span>2% (Prudent)</span>
                <span>15% (Agressif)</span>
              </div>
            </div>

            {/* Current Age */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-neutral-700 dark:text-neutral-300">
                <span>Votre Âge Actuel</span>
                <span className="font-mono text-neutral-900 dark:text-white">{currentAge} ans</span>
              </div>
              <input 
                type="range" 
                min="18" 
                max="65" 
                step="1"
                value={currentAge}
                onChange={(e) => setCurrentAge(Number(e.target.value))}
                className="w-full accent-neutral-900 dark:accent-white h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
                <span>18 ans</span>
                <span>65 ans</span>
              </div>
            </div>

            {/* Retrait de 4% explanations */}
            <div className="bg-white dark:bg-neutral-950 p-3.5 rounded-2xl border border-neutral-200/50 dark:border-neutral-850 flex items-start gap-2.5">
              <Info className="w-4.5 h-4.5 text-neutral-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-neutral-900 dark:text-neutral-100 block">Règle d'or des 4%</span>
                <span className="text-[10px] text-neutral-400 block leading-normal">
                  Pour obtenir une rente de {targetRente.toLocaleString()} MAD sans épuiser votre capital, vous devez accumuler un capital égal à 25 fois vos dépenses annuelles.
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* METRIC KPIS & GRAPHICAL PREVIEW (7 Cols) */}
        <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
          
          {/* Key Output Blocks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Target age of retirement */}
            <div className="bg-neutral-900 text-white rounded-3xl p-5 border border-neutral-800 shadow-md relative overflow-hidden">
              <div className="space-y-1 z-10 relative">
                <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider block font-mono">Âge d'Indépendance (FIRE)</span>
                {fireMetrics.fireAge ? (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl font-black font-mono tracking-tight text-white">{fireMetrics.fireAge}</span>
                    <span className="text-base text-neutral-400 font-black">ans</span>
                  </div>
                ) : (
                  <span className="text-lg font-black text-neutral-400 block py-1">Inatteignable en 40 ans</span>
                )}
                <p className="text-[10px] text-neutral-400 leading-normal">
                  {fireMetrics.fireAge 
                    ? `Dans ${fireMetrics.fireAge - currentAge} années d'épargne assidue et de capitalisation.`
                    : "Augmentez votre épargne mensuelle ou ciblez un rendement plus élevé."}
                </p>
              </div>
              <div className="absolute right-3.5 bottom-3 text-neutral-800 pointer-events-none select-none">
                <ShieldCheck className="w-16 h-16 opacity-30" />
              </div>
            </div>

            {/* Required FIRE Number */}
            <div className="bg-white border border-neutral-200/80 rounded-3xl p-5 shadow-3xs flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider block font-mono">Nombre de Liberté (FIRE Number)</span>
                <h4 className="text-xl font-black font-mono text-neutral-900 leading-tight">
                  {Math.round(fireMetrics.requiredCapital).toLocaleString("fr-FR")} MAD
                </h4>
                <span className="text-[10px] text-neutral-400 font-medium block leading-none">
                  Pour financer {targetRente.toLocaleString("fr-FR")} MAD / mois.
                </span>
              </div>
              <div className="p-3.5 bg-neutral-100 rounded-2xl text-neutral-800 shrink-0 border border-neutral-200">
                <Coins className="w-5 h-5" />
              </div>
            </div>

          </div>

          {/* DYNAMIC CHART */}
          <div className="bg-white border border-neutral-200/80 rounded-3xl p-5 shadow-3xs space-y-4 flex-1 flex flex-col justify-between min-h-[300px]">
            <div>
              <span className="text-[10px] font-black uppercase text-neutral-400 tracking-wider block font-mono">Simulation des Intérêts Composés</span>
              <p className="text-[10px] text-neutral-400 leading-normal mt-0.5">
                Courbe de croissance de votre capital de {currentAge} ans à {currentAge + 40} ans.
              </p>
            </div>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={fireMetrics.projectionData}
                  margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorCapital" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#171717" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#171717" stopOpacity={0.01}/>
                    </linearGradient>
                    <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#737373" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#737373" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                  <XAxis 
                    dataKey="age" 
                    tickLine={false} 
                    axisLine={false} 
                    stroke="#a3a3a3"
                    style={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace' }}
                  />
                  <YAxis 
                    tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
                    tickLine={false}
                    axisLine={false}
                    stroke="#a3a3a3"
                    style={{ fontSize: '10px', fontWeight: 'bold', fontFamily: 'monospace' }}
                  />
                  <Tooltip 
                    formatter={(value: any) => [`${Number(value).toLocaleString()} MAD`]}
                    labelFormatter={(label) => `Âge: ${label} ans`}
                    contentStyle={{ borderRadius: '16px', border: '1px solid #e5e5e5', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', fontFamily: 'sans-serif', fontSize: '11px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="capital" 
                    name="Capital Total Est."
                    stroke="#171717" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorCapital)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="invested" 
                    name="Épargne Propre versée"
                    stroke="#737373" 
                    strokeWidth={1}
                    strokeDasharray="4 4"
                    fillOpacity={1} 
                    fill="url(#colorInvested)" 
                  />
                  {/* Reference line showing needed capital */}
                  <ReferenceLine 
                    y={fireMetrics.requiredCapital} 
                    stroke="#eab308" 
                    strokeDasharray="3 3" 
                    strokeWidth={1.5}
                    label={{ value: 'Seuil FIRE', fill: '#ca8a04', fontSize: 9, fontWeight: 'bold', position: 'top' }} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="flex justify-between items-center bg-amber-500/5 border border-amber-500/10 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600 animate-pulse" />
                <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider font-mono">Effet de Levier</span>
              </div>
              <span className="text-[10px] font-bold text-amber-700 leading-normal text-right">
                {fireMetrics.fireAge 
                  ? `À ${fireMetrics.fireAge} ans, vos intérêts cumulés financeront à eux seuls vos besoins sans que vous ayez à entamer l'épargne de départ !`
                  : "Modifiez vos versements pour voir l'effet boule de neige du compound interest."}
              </span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
