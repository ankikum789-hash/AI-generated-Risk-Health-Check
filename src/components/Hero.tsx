import React from 'react';
import { ArrowRight, ShieldCheck, Activity, Sparkles, AlertTriangle, Layers, FileCheck, Landmark } from 'lucide-react';
import { JurisdictionConfig } from '../types/risk';

interface HeroProps {
  onStartStressTest: () => void;
  onExploreCockpit: () => void;
  onOpenReportModal: () => void;
  currentJurisdiction: JurisdictionConfig;
}

export const Hero: React.FC<HeroProps> = ({
  onStartStressTest,
  onExploreCockpit,
  onOpenReportModal,
  currentJurisdiction,
}) => {
  return (
    <section id="home" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-slate-800/80 bg-radial from-slate-900/60 via-slate-950 to-slate-950 scroll-mt-20">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Executive Tag */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-800/60 text-cyan-300 text-xs font-semibold mb-6 shadow-sm backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-extrabold tracking-wider uppercase text-cyan-200">RISKLENS</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-300 font-medium">AI-Assisted Lending Risk Intelligence</span>
          </div>

          {/* Main Title */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white leading-tight mb-5 max-w-4xl">
            Scale your lending business <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">without letting growth outpace your risk controls.</span>
          </h1>

          {/* Direct Secondary Line */}
          <div className="text-lg sm:text-xl md:text-2xl font-semibold text-cyan-300/90 mb-4 max-w-3xl leading-snug">
            AI-assisted risk intelligence for growing digital and fintech lenders.
          </div>

          {/* Supporting Line */}
          <p className="text-sm sm:text-base md:text-lg text-slate-300 font-normal leading-relaxed mb-7 max-w-3xl">
            Independently assess your credit, fraud, portfolio-monitoring and risk-governance controls — and identify the areas that may need attention as your lending business grows.
          </p>

          {/* Core Offer Ribbon */}
          <div className="w-full max-w-2xl mb-8 p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/40 to-slate-900 border border-cyan-800/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-xl">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-cyan-500 text-slate-950 font-bold uppercase tracking-wider text-[10px] shrink-0">
                Core Offer
              </span>
              <span className="font-bold text-white text-sm">
                AI-Assisted Risk-Control Health Check
              </span>
            </div>
            <div className="flex items-center gap-2 text-cyan-300 font-mono text-[11px] font-medium flex-wrap justify-center">
              <span>Credit</span>
              <span className="text-slate-600">•</span>
              <span>Fraud</span>
              <span className="text-slate-600">•</span>
              <span>Portfolio Monitoring</span>
              <span className="text-slate-600">•</span>
              <span>Risk Governance</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 w-full mb-12">
            <button
              onClick={onStartStressTest}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-bold rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-xl shadow-cyan-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>Get Your Risk-Control Health Check</span>
              <ArrowRight className="w-4 h-4 ml-1 text-slate-950" />
            </button>

            <button
              onClick={() => {
                const el = document.getElementById('services') || document.getElementById('domains');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all hover:border-slate-500 cursor-pointer"
            >
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Explore How It Works</span>
            </button>

            <button
              onClick={onExploreCockpit}
              className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold rounded-xl text-slate-300 hover:text-white bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Launch Live Cockpit</span>
            </button>

            <button
              onClick={onOpenReportModal}
              className="flex items-center justify-center gap-2 px-4 py-3 text-xs font-semibold rounded-xl text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>Sample Report</span>
            </button>
          </div>

          {/* Executive Trust Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl pt-6 border-t border-slate-800/80 text-left">
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Framework</span>
              </div>
              <div className="text-lg font-bold text-white">5 Core Domains</div>
              <div className="text-xs text-slate-400">Credit, Fraud, Portfolio, Gov, Scaling</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center gap-2 text-emerald-400 mb-1">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Early Detection</span>
              </div>
              <div className="text-lg font-bold text-white">30 Days Ahead</div>
              <div className="text-xs text-slate-400">Leading metrics before 30+ DPD hits</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center gap-2 text-sky-400 mb-1">
                <Layers className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Roadmap</span>
              </div>
              <div className="text-lg font-bold text-white">30 / 60 / 90 Days</div>
              <div className="text-xs text-slate-400">Prioritized control remediation plan</div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-slate-800">
              <div className="flex items-center gap-2 text-purple-400 mb-1">
                <Landmark className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Compliance</span>
              </div>
              <div className="text-lg font-bold text-white">5 Global Hubs</div>
              <div className="text-xs text-slate-400">US, India (RBI), SG (MAS), UK, Dubai</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
