import React, { useState } from 'react';
import { 
  Globe, 
  Check, 
  HelpCircle, 
  ArrowRight, 
  Lock, 
  Scale, 
  Building2, 
  ShieldCheck, 
  Sparkles,
  Layers
} from 'lucide-react';
import { JURISDICTIONS } from '../data/riskData';
import { JurisdictionCode } from '../types/risk';

interface PricingJurisdictionSectionProps {
  currentJurisdiction: JurisdictionCode;
  onSelectJurisdiction: (code: JurisdictionCode) => void;
  onSelectService: (serviceName: string) => void;
  onOpenFounderPortal: () => void;
}

export const PricingJurisdictionSection: React.FC<PricingJurisdictionSectionProps> = ({
  currentJurisdiction,
  onSelectJurisdiction,
  onSelectService,
  onOpenFounderPortal,
}) => {
  const [selectedFreq, setSelectedFreq] = useState<'project' | 'retainer'>('project');
  const jConfig = JURISDICTIONS[currentJurisdiction] || JURISDICTIONS.IN;
  const p = jConfig.pricingTiers;

  return (
    <section id="pricing" className="py-20 bg-slate-950 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            <Globe className="w-3.5 h-3.5" />
            <span>Advisory Engagement Scopes & Multi-Jurisdiction Architecture</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Institutional Engagement Models Calibrated for 5 Global Lending Hubs
          </h2>
          <p className="mt-3 text-base text-slate-400">
            Transparent, milestone-based advisory scopes dynamically mapped to local regulatory environments (India, Singapore, US, UK, and Dubai). Access our Founder Portal for bespoke AUM-based proposals.
          </p>
        </div>

        {/* Global Jurisdiction Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {Object.values(JURISDICTIONS).map((item) => {
            const isSelected = item.code === currentJurisdiction;
            return (
              <button
                key={item.code}
                onClick={() => onSelectJurisdiction(item.code)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                  isSelected
                    ? 'bg-cyan-950/90 border-cyan-500 text-cyan-300 shadow-lg shadow-cyan-500/15'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span className="text-base">{item.flag}</span>
                <span>{item.country}</span>
                <span className="font-mono text-[11px] opacity-75">({item.symbol} {item.currency})</span>
              </button>
            );
          })}
        </div>

        {/* Selected Country Regulatory Context Pill */}
        <div className="max-w-4xl mx-auto mb-12 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <span>{jConfig.country} Lending Regulatory Framework</span>
                <span className="text-cyan-400 font-mono text-[11px] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {jConfig.regulator}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                Key Compliance Focus: <span className="text-slate-300">{jConfig.keyComplianceFocus}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenFounderPortal}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold shrink-0 transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
          >
            <Lock className="w-3 h-3 text-cyan-400" />
            <span>Open Confidential Fee Portal</span>
          </button>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {/* Card 1: Starter Health Check */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Rapid Reconnaissance
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Starter Risk Health Check</h3>
              <p className="text-xs text-slate-400 mb-4">Underwriting policy & exception audit</p>

              <div className="mb-5 pb-5 border-b border-slate-800">
                <div className="text-3xl font-extrabold text-white font-mono">{p.starter.label}</div>
                <div className="text-[11px] text-slate-400 mt-1">Single engagement • 48-72h turnaround</div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>5-Domain Maturity Scorecard</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Audit of top 25 manual overrides</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Credit Policy & PPG consistency check</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>45-Min founder diagnostic readout</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectService('Starter Risk Health Check')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Select Starter Package</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Detailed Health Check (Recommended) */}
          <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-cyan-500/70 shadow-xl shadow-cyan-500/10 flex flex-col justify-between relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-cyan-500 text-slate-950 font-extrabold text-[11px] uppercase tracking-wider shadow">
              Recommended Initial Offer
            </div>

            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                Flagship Diagnostic
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Detailed Risk Health Check</h3>
              <p className="text-xs text-slate-300 mb-4">Full 4-part report & 30/60/90-day plan</p>

              <div className="mb-5 pb-5 border-b border-slate-800">
                <div className="text-3xl font-extrabold text-white font-mono">{p.detailed.label}</div>
                <div className="text-[11px] text-cyan-300 mt-1">Recommended for validating your offer</div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Full 4-Part Executive Report Deliverable</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>3-5 High-Priority Control Gaps identified</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Vintage delinquency & cohort curve analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>Prioritized 30 / 60 / 90-Day Remediation Plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>90-Min Board & Founder Readout session</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectService('Detailed Risk Health Check')}
              className="w-full py-3 px-4 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Book Detailed Health Check</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Health Check + Implementation or Fractional CRO */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Execution & Retainer
                </div>
                <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded border border-slate-800 text-[10px]">
                  <button
                    onClick={() => setSelectedFreq('project')}
                    className={`px-2 py-0.5 rounded ${selectedFreq === 'project' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400'}`}
                  >
                    Sprint
                  </button>
                  <button
                    onClick={() => setSelectedFreq('retainer')}
                    className={`px-2 py-0.5 rounded ${selectedFreq === 'retainer' ? 'bg-cyan-950 text-cyan-300 font-bold' : 'text-slate-400'}`}
                  >
                    Retainer
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-1">
                {selectedFreq === 'project' ? 'Health Check + Implementation' : 'Ongoing CRO Advisory'}
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                {selectedFreq === 'project' ? 'Hands-on rule deployment & policy revamp' : 'Fractional Chief Risk Officer retainer'}
              </p>

              <div className="mb-5 pb-5 border-b border-slate-800">
                <div className="text-3xl font-extrabold text-white font-mono">
                  {selectedFreq === 'project' ? p.implementation.label : `${p.retainer.label}/mo`}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  {selectedFreq === 'project' ? '4–6 weeks embedded support' : 'Billed monthly • Cancel anytime'}
                </div>
              </div>

              <div className="space-y-2.5 text-xs text-slate-300 mb-6">
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{selectedFreq === 'project' ? 'All Detailed Health Check deliverables' : 'Monthly portfolio drift & cohort audits'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{selectedFreq === 'project' ? 'Hands-on DLA Matrix & policy drafting' : 'Pre-launch risk review for new lending products'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{selectedFreq === 'project' ? 'Fraud velocity & device rule configurations' : 'Ad-hoc Slack/WhatsApp access for urgent approvals'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                  <span>{selectedFreq === 'project' ? 'Weekly engineering & underwriting standups' : 'Attendance at monthly Risk & Board Committees'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onSelectService(selectedFreq === 'project' ? 'Health Check + Implementation Support' : 'Ongoing Implementation Advisory')}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>{selectedFreq === 'project' ? 'Request Implementation Scope' : 'Retain Fractional CRO'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Strategic Decision Answer Box: Why We Display Services Outside and Bespoke Modeler Inside */}
        <div className="max-w-4xl mx-auto p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 border border-cyan-800/40">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0 mt-1">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">
                Strategic Architecture: Public Transparency + Private Founder Portal
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                By presenting clear service tiers on the exterior, prospective fintech & digital lender founders gain instant confidence in the structured scope. Inside our secure <strong>Founder Portal</strong>, founders calculate bespoke fee proposals tailored to their exact loan book AUM, partner volume, and multi-market regulatory requirements (e.g. RBI FLDG caps in India vs MAS TRM in Singapore).
              </p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  onClick={onOpenFounderPortal}
                  className="px-3.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-colors cursor-pointer"
                >
                  Enter Founder Portal
                </button>
                <span className="text-[11px] text-slate-400">Instant 1-Click Demo Login Available</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
