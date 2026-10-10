import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  ShieldAlert, 
  TrendingDown, 
  Sliders, 
  Play, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  Zap, 
  Eye, 
  ShieldCheck, 
  Layers, 
  Users, 
  ArrowUpRight 
} from 'lucide-react';
import { INITIAL_FRAUD_ALERTS } from '../data/riskData';
import { FraudAlert, JurisdictionConfig } from '../types/risk';

interface LiveRiskCockpitProps {
  currentJurisdiction: JurisdictionConfig;
  onOpenReportModal: () => void;
}

export const LiveRiskCockpit: React.FC<LiveRiskCockpitProps> = ({
  currentJurisdiction,
  onOpenReportModal,
}) => {
  const [cockpitMode, setCockpitMode] = useState<'stress_testing' | 'fraud_alerts'>('stress_testing');
  
  // Stress Testing Parameters State
  const [portfolioSize, setPortfolioSize] = useState<number>(10); // in millions USD or equivalent
  const [macroShock, setMacroShock] = useState<number>(15); // +15% macro downturn
  const [partnerShock, setPartnerShock] = useState<number>(20); // +20% partner distress
  const [fraudMultiplier, setFraudMultiplier] = useState<number>(1.8); // 1.8x
  const [collectionsDrop, setCollectionsDrop] = useState<number>(18); // -18% collections recovery
  const [selectedScenario, setSelectedScenario] = useState<string>('custom');

  // Fraud Alerts State
  const [alerts, setAlerts] = useState<FraudAlert[]>(INITIAL_FRAUD_ALERTS);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [mitigatedMessage, setMitigatedMessage] = useState<string | null>(null);

  // Currency multiplier
  const curSymbol = currentJurisdiction.symbol;
  const isINR = currentJurisdiction.code === 'IN';
  const displayPortfolio = isINR 
    ? `₹${(portfolioSize * 8.7).toFixed(1)} Cr` 
    : `${curSymbol}${(portfolioSize * currentJurisdiction.rateToUsd).toFixed(1)}M`;

  // Calculated Stress Metrics
  const stressResults = useMemo(() => {
    const baseDefault = 2.4; // 2.4% baseline 90+ DPD default rate
    const macroImpact = (macroShock / 100) * 2.8;
    const partnerImpact = (partnerShock / 100) * 3.2;
    const fraudImpact = (fraudMultiplier - 1.0) * 1.9;
    const collectionsImpact = (collectionsDrop / 100) * 2.1;

    const stressedDefaultRate = baseDefault + macroImpact + partnerImpact + fraudImpact + collectionsImpact;
    const defaultIncreaseFactor = stressedDefaultRate / baseDefault;

    const baseEclAmount = portfolioSize * 0.024;
    const stressedEclAmount = portfolioSize * (stressedDefaultRate / 100);
    const capitalShortfall = Math.max(0, stressedEclAmount - (portfolioSize * 0.045)); // assuming 4.5% existing risk reserve

    // 12-month vintage delinquency curve (MOB 1 to 12)
    const vintageMonths = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const baselineCurve = vintageMonths.map(m => Math.min(2.4, +(0.2 * Math.pow(m, 1.05)).toFixed(2)));
    const stressedCurve = vintageMonths.map(m => Math.min(18.0, +(baselineCurve[m - 1] * defaultIncreaseFactor).toFixed(2)));

    // Domain stress exposure index (0 to 100)
    const domainStress = {
      credit: Math.min(95, Math.round(35 + macroShock * 1.8)),
      fraud: Math.min(98, Math.round(30 + (fraudMultiplier - 1.0) * 35)),
      portfolio: Math.min(92, Math.round(25 + collectionsDrop * 2.0)),
      governance: Math.min(88, Math.round(30 + partnerShock * 1.2)),
      scaling: Math.min(95, Math.round(40 + partnerShock * 1.4)),
    };

    return {
      stressedDefaultRate: stressedDefaultRate.toFixed(2),
      stressedLossPct: stressedDefaultRate.toFixed(1),
      defaultIncreaseFactor: defaultIncreaseFactor.toFixed(1),
      stressedEclDisplay: isINR
        ? `₹${(stressedEclAmount * 8.7).toFixed(2)} Cr`
        : `${curSymbol}${(stressedEclAmount * currentJurisdiction.rateToUsd).toFixed(2)}M`,
      capitalShortfallDisplay: capitalShortfall > 0
        ? (isINR ? `₹${(capitalShortfall * 8.7).toFixed(2)} Cr` : `${curSymbol}${(capitalShortfall * currentJurisdiction.rateToUsd).toFixed(2)}M`)
        : 'Sufficient Buffer',
      fldgStatus: stressedDefaultRate > 5.0 ? 'Breached (Exceeds 5% FLDG cap)' : 'Within Safety Band',
      baselineCurve,
      stressedCurve,
      domainStress,
    };
  }, [portfolioSize, macroShock, partnerShock, fraudMultiplier, collectionsDrop, isINR, curSymbol, currentJurisdiction]);

  // Preset Scenarios Handler
  const applyPreset = (type: 'mild' | 'moderate' | 'blackswan') => {
    setSelectedScenario(type);
    if (type === 'mild') {
      setMacroShock(5);
      setPartnerShock(10);
      setFraudMultiplier(1.2);
      setCollectionsDrop(8);
    } else if (type === 'moderate') {
      setMacroShock(15);
      setPartnerShock(25);
      setFraudMultiplier(1.8);
      setCollectionsDrop(20);
    } else if (type === 'blackswan') {
      setMacroShock(25);
      setPartnerShock(45);
      setFraudMultiplier(2.8);
      setCollectionsDrop(35);
    }
  };

  // Fraud mitigation handler
  const handleMitigateAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === alertId) {
        return { ...a, status: 'mitigated' };
      }
      return a;
    }));
    setMitigatedMessage(`Mitigation rule activated for ${alertId}. Automated approval freeze & biometric enforcement deployed.`);
    setTimeout(() => setMitigatedMessage(null), 4500);
  };

  const filteredAlerts = alerts.filter(a => {
    if (filterSeverity === 'ALL') return true;
    return a.severity === filterSeverity;
  });

  return (
    <section id="cockpit" className="py-20 bg-slate-950 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Activity className="w-3.5 h-3.5 animate-pulse" />
              <span>Real-Time Analytical Engine</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Executive Risk Cockpit & Stress Lab
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
              Simulate macroeconomic deterioration, partner credit defaults, and synthetic fraud surges before they materialize in your regulatory returns.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setCockpitMode('stress_testing')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                cockpitMode === 'stress_testing'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5" />
              <span>Predictive Stress Test Model</span>
            </button>
            <button
              onClick={() => setCockpitMode('fraud_alerts')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all relative ${
                cockpitMode === 'fraud_alerts'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
              <span>Automated Fraud Alerts</span>
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            </button>
          </div>
        </div>

        {/* NOTIFICATION TOAST */}
        {mitigatedMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{mitigatedMessage}</span>
            </div>
            <button onClick={() => setMitigatedMessage(null)} className="text-slate-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* COCKPIT VIEW 1: PREDICTIVE STRESS TESTING MODEL */}
        {cockpitMode === 'stress_testing' && (
          <div className="space-y-8">
            {/* Top Controls Bar */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Preset Shock Scenarios:</span>
                <button
                  onClick={() => applyPreset('mild')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedScenario === 'mild'
                      ? 'bg-sky-950 border-sky-600 text-sky-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Baseline Mild Shock (+5%)
                </button>
                <button
                  onClick={() => applyPreset('moderate')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedScenario === 'moderate'
                      ? 'bg-amber-950 border-amber-600 text-amber-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Partner Distress (+15%)
                </button>
                <button
                  onClick={() => applyPreset('blackswan')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    selectedScenario === 'blackswan'
                      ? 'bg-rose-950 border-rose-600 text-rose-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Black Swan / Contagion (+25%)
                </button>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setPortfolioSize(10);
                    applyPreset('moderate');
                  }}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Variables</span>
                </button>
                <button
                  onClick={onOpenReportModal}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-950 border border-cyan-700 hover:bg-cyan-900 text-cyan-300 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>Export Stress Report</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Column: Shock Sliders & Inputs */}
              <div className="lg:col-span-4 bg-slate-900/60 rounded-2xl p-6 border border-slate-800 space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span>Stress Variables</span>
                  </div>
                  <span className="text-xs text-cyan-400 font-mono font-bold">
                    Portfolio: {displayPortfolio}
                  </span>
                </div>

                {/* Portfolio Size Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300">Total Loan Book Exposure</span>
                    <span className="font-mono text-cyan-400 font-bold">{displayPortfolio}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={portfolioSize}
                    onChange={(e) => setPortfolioSize(Number(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>{isINR ? '₹8.7 Cr' : '$1M'}</span>
                    <span>{isINR ? '₹435 Cr' : '$50M'}</span>
                  </div>
                </div>

                {/* Macro Shock Slider */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300">Macroeconomic Downturn Shock</span>
                    <span className="font-mono text-amber-400 font-bold">+{macroShock}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={macroShock}
                    onChange={(e) => {
                      setMacroShock(Number(e.target.value));
                      setSelectedScenario('custom');
                    }}
                    className="w-full accent-amber-400 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-400 mt-1">
                    Simulates inflation hike, business cash-flow contraction, and MSME turnover reduction.
                  </div>
                </div>

                {/* Partner Default Surge */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300">Anchor Partner Distress Factor</span>
                    <span className="font-mono text-rose-400 font-bold">+{partnerShock}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    step="1"
                    value={partnerShock}
                    onChange={(e) => {
                      setPartnerShock(Number(e.target.value));
                      setSelectedScenario('custom');
                    }}
                    className="w-full accent-rose-400 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-400 mt-1">
                    Simulates anchor merchant distress or channel adverse selection in embedded flows.
                  </div>
                </div>

                {/* Fraud Multiplier */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300">Synthetic Fraud Velocity Multiplier</span>
                    <span className="font-mono text-purple-400 font-bold">{fraudMultiplier.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="3.0"
                    step="0.1"
                    value={fraudMultiplier}
                    onChange={(e) => {
                      setFraudMultiplier(Number(e.target.value));
                      setSelectedScenario('custom');
                    }}
                    className="w-full accent-purple-400 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-400 mt-1">
                    Assumes organized syndicate attacks through unsecured API / partner endpoints.
                  </div>
                </div>

                {/* Collections Recovery Drop */}
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300">Collections Efficiency Degradation</span>
                    <span className="font-mono text-orange-400 font-bold">-{collectionsDrop}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={collectionsDrop}
                    onChange={(e) => {
                      setCollectionsDrop(Number(e.target.value));
                      setSelectedScenario('custom');
                    }}
                    className="w-full accent-orange-400 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="text-[11px] text-slate-400 mt-1">
                    Accounts for agency capacity strain and lower promise-to-pay conversion rates.
                  </div>
                </div>
              </div>

              {/* Right Column: Visualizations & Stressed Output KPIs */}
              <div className="lg:col-span-8 space-y-6">
                {/* 4 Summary KPI Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Stressed Default Rate
                    </div>
                    <div className="text-2xl font-extrabold text-rose-400 font-mono">
                      {stressResults.stressedDefaultRate}%
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Baseline: 2.4% ({stressResults.defaultIncreaseFactor}x surge)
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Projected ECL Loss
                    </div>
                    <div className="text-2xl font-extrabold text-amber-400 font-mono">
                      {stressResults.stressedEclDisplay}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Expected Credit Loss reserve
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Capital Shortfall
                    </div>
                    <div className={`text-xl font-extrabold font-mono ${stressResults.capitalShortfallDisplay === 'Sufficient Buffer' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {stressResults.capitalShortfallDisplay}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      vs 4.5% existing risk cushion
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      FLDG Covenant
                    </div>
                    <div className={`text-xs font-bold px-2 py-1 rounded inline-block mt-1 ${stressResults.stressedDefaultRate > '5.0' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'}`}>
                      {stressResults.fldgStatus}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1.5">
                      Statutory 5% default ceiling
                    </div>
                  </div>
                </div>

                {/* SVG Chart 1: Vintage Delinquency Migration Curve (Baseline vs Stressed) */}
                <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        Vintage Delinquency Migration Trajectory (MOB 1 to 12)
                      </h4>
                      <p className="text-xs text-slate-400">
                        Cumulative 90+ DPD default trajectory under baseline vs simulated stress.
                      </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-1 bg-cyan-400 rounded-full" />
                        <span className="text-slate-300">Baseline Curve (2.4%)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-3 h-1 bg-rose-500 rounded-full" />
                        <span className="text-rose-400 font-semibold">Stressed Curve ({stressResults.stressedDefaultRate}%)</span>
                      </div>
                    </div>
                  </div>

                  {/* Responsive SVG Chart */}
                  <div className="h-56 w-full pt-4">
                    <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
                      {/* Grid Lines */}
                      {[0, 50, 100, 150].map((y, i) => (
                        <line
                          key={i}
                          x1="40"
                          y1={y + 10}
                          x2="590"
                          y2={y + 10}
                          stroke="#334155"
                          strokeDasharray="4 4"
                          strokeWidth="0.8"
                        />
                      ))}

                      {/* Y-axis Labels */}
                      <text x="30" y="15" fill="#64748b" fontSize="10" textAnchor="end">12%</text>
                      <text x="30" y="65" fill="#64748b" fontSize="10" textAnchor="end">8%</text>
                      <text x="30" y="115" fill="#64748b" fontSize="10" textAnchor="end">4%</text>
                      <text x="30" y="165" fill="#64748b" fontSize="10" textAnchor="end">0%</text>

                      {/* X-axis Labels (Months on Book) */}
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((m, i) => {
                        const x = 50 + (i * (540 / 11));
                        return (
                          <text key={m} x={x} y="185" fill="#94a3b8" fontSize="10" textAnchor="middle">
                            M{m}
                          </text>
                        );
                      })}

                      {/* FLDG 5% Threshold Line */}
                      <line
                        x1="40"
                        y1="102"
                        x2="590"
                        y2="102"
                        stroke="#f43f5e"
                        strokeWidth="1.2"
                        strokeDasharray="2 2"
                      />
                      <text x="585" y="98" fill="#f43f5e" fontSize="9" textAnchor="end" fontWeight="bold">
                        5.0% FLDG / Covenant Threshold
                      </text>

                      {/* Baseline Path */}
                      <path
                        d={stressResults.baselineCurve.map((val, idx) => {
                          const x = 50 + (idx * (540 / 11));
                          const y = 160 - (val / 12) * 150;
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${Math.max(10, y)}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                      />

                      {/* Stressed Path */}
                      <path
                        d={stressResults.stressedCurve.map((val, idx) => {
                          const x = 50 + (idx * (540 / 11));
                          const y = 160 - (Math.min(val, 12) / 12) * 150;
                          return `${idx === 0 ? 'M' : 'L'} ${x} ${Math.max(10, y)}`;
                        }).join(' ')}
                        fill="none"
                        stroke="#f43f5e"
                        strokeWidth="3"
                      />

                      {/* Highlight Data Points */}
                      {stressResults.stressedCurve.map((val, idx) => {
                        const x = 50 + (idx * (540 / 11));
                        const y = 160 - (Math.min(val, 12) / 12) * 150;
                        if (idx % 2 === 1 || idx === 11) {
                          return (
                            <g key={idx}>
                              <circle cx={x} cy={Math.max(10, y)} r="3.5" fill="#f43f5e" stroke="#0f172a" strokeWidth="2" />
                            </g>
                          );
                        }
                        return null;
                      })}
                    </svg>
                  </div>
                </div>

                {/* 5-Domain Vulnerability Index under current stress */}
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Domain Stress Vulnerability Index (Simulated Pressure)
                    </span>
                    <span className="text-xs text-slate-400">Scale: 0 to 100</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Credit & Underwriting Drift</span>
                        <span className="font-mono text-cyan-400 font-bold">{stressResults.domainStress.credit} / 100</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-400 rounded-full" style={{ width: `${stressResults.domainStress.credit}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Fraud & Synthetic Infiltration</span>
                        <span className="font-mono text-purple-400 font-bold">{stressResults.domainStress.fraud} / 100</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-400 rounded-full" style={{ width: `${stressResults.domainStress.fraud}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Portfolio Liquidity & Roll-Rate Decay</span>
                        <span className="font-mono text-orange-400 font-bold">{stressResults.domainStress.portfolio} / 100</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-400 rounded-full" style={{ width: `${stressResults.domainStress.portfolio}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">Scaling & Partner Channel Exposure</span>
                        <span className="font-mono text-rose-400 font-bold">{stressResults.domainStress.scaling} / 100</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-rose-400 rounded-full" style={{ width: `${stressResults.domainStress.scaling}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Strategist Recommendation Box */}
                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/80 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <span className="font-bold text-white block mb-0.5">Strategist Executive Advisory Note:</span>
                    <span className="text-slate-300">
                      Under this simulated scenario, cumulative defaults reach <strong className="text-rose-300 font-semibold">{stressResults.stressedDefaultRate}%</strong>. We advise setting an automated covenant tripwire on Partner channel #B2 at month 3, tightening junior underwriter override caps by 60%, and initiating pre-collection daily SMS nudges.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COCKPIT VIEW 2: AUTOMATED FRAUD DETECTION ALERTS */}
        {cockpitMode === 'fraud_alerts' && (
          <div className="space-y-6">
            {/* Filter and Status Bar */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400">Filter Alerts:</span>
                {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
                  <button
                    key={sev}
                    onClick={() => setFilterSeverity(sev)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      filterSeverity === sev
                        ? 'bg-cyan-500 text-slate-950'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {sev}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  <span>Telemetry Feed: <strong>Active Real-Time</strong></span>
                </span>
                <span className="hidden sm:inline">•</span>
                <span>Active Threats: <strong>{alerts.filter(a => a.status !== 'mitigated').length} Unresolved</strong></span>
              </div>
            </div>

            {/* Alerts List */}
            <div className="space-y-4">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    alert.status === 'mitigated'
                      ? 'bg-slate-900/30 border-slate-800 opacity-60'
                      : alert.severity === 'CRITICAL'
                      ? 'bg-slate-900/90 border-rose-500/50 shadow-lg shadow-rose-950/20'
                      : alert.severity === 'HIGH'
                      ? 'bg-slate-900/80 border-amber-500/40'
                      : 'bg-slate-900/60 border-slate-800'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 max-w-3xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                            alert.severity === 'CRITICAL'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : alert.severity === 'HIGH'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-sky-950 text-sky-300 border border-sky-800'
                          }`}
                        >
                          {alert.severity}
                        </span>

                        <span className="text-xs font-mono text-cyan-400 font-semibold">{alert.id}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-xs text-slate-400">{alert.timestamp}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-xs text-slate-300 font-medium">{alert.domain}</span>

                        {alert.status === 'mitigated' && (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            <span>MITIGATED</span>
                          </span>
                        )}
                      </div>

                      <h4 className="text-base font-bold text-white">{alert.title}</h4>
                      <p className="text-xs sm:text-sm text-slate-300">{alert.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                        <div className="text-slate-400">
                          <span className="font-semibold text-slate-300">Cohort: </span>
                          <span>{alert.borrowerCohort}</span>
                        </div>
                        <div className="font-mono text-cyan-300 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
                          {alert.metric}
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-300 mt-2">
                        <strong className="text-cyan-400 font-semibold">Immediate Recommendation: </strong>
                        {alert.recommendedAction}
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex flex-col gap-2 shrink-0 md:self-center">
                      {alert.status !== 'mitigated' ? (
                        <button
                          onClick={() => handleMitigateAlert(alert.id)}
                          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-600 hover:from-rose-400 hover:to-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          <span>Execute Mitigation Control</span>
                        </button>
                      ) : (
                        <div className="text-center px-4 py-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 rounded-xl border border-emerald-900">
                          Control Enforced
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
