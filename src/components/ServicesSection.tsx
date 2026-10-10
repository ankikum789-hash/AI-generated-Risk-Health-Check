import React from 'react';
import { 
  Sparkles, 
  CheckCircle, 
  ArrowRight, 
  ShieldAlert, 
  Zap, 
  Clock, 
  Layers, 
  TrendingUp,
  FileSpreadsheet
} from 'lucide-react';
import { JurisdictionConfig } from '../types/risk';

interface ServicesSectionProps {
  currentJurisdiction: JurisdictionConfig;
  onSelectService: (serviceName: string) => void;
  onStartStressTest: () => void;
  onOpenFounderPortal: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  currentJurisdiction,
  onSelectService,
  onStartStressTest,
  onOpenFounderPortal,
}) => {
  const p = currentJurisdiction.pricingTiers;

  const services = [
    {
      id: 'free_diagnostic',
      name: 'Free Stress Test',
      tag: 'Lead Magnet / Self-Diagnostic',
      price: p.free.label,
      turnaround: 'Instant (3 Mins)',
      badge: 'Immediate Value',
      badgeColor: 'bg-emerald-950 text-emerald-300 border-emerald-800',
      description: 'Quick management-level diagnostic across the 5 risk control domains. Pinpoints high-level control gap concentration before deep-dive audits.',
      deliverables: [
        '20-Question 5-Domain Stress Test Score (0–60)',
        'Maturity Bracket: Significant Gaps, Developing, Established, or Mature',
        'Identification of top 2 high-priority blind spots',
        'Self-guided discussion prompts for executive committee'
      ],
      ctaText: 'Launch Free Diagnostic',
      action: onStartStressTest,
      recommended: false,
    },
    {
      id: 'starter_check',
      name: 'Starter Risk Health Check',
      tag: 'Rapid Control Reconnaissance',
      price: p.starter.label,
      turnaround: '48–72 Hours',
      badge: 'Fast Turnaround',
      badgeColor: 'bg-sky-950 text-sky-300 border-sky-800',
      description: 'Focused review of core underwriting rules, KYC/fraud triage, and top 20 manual exception approvals for early-stage fintech & digital lenders.',
      deliverables: [
        'Comprehensive 5-Domain Maturity Scorecard',
        'Review of Credit Policy & PPG rules consistency',
        'Manual override log audit (sample of 25-50 loans)',
        'Executive debrief call (45 mins) with founder/risk head'
      ],
      ctaText: 'Select Starter Check',
      action: () => onSelectService('Starter Risk Health Check'),
      recommended: false,
    },
    {
      id: 'detailed_check',
      name: 'Detailed Risk Health Check',
      tag: 'Recommended Core Advisory',
      price: p.detailed.label,
      turnaround: '5–7 Business Days',
      badge: 'Most Popular / Recommended',
      badgeColor: 'bg-gradient-to-r from-cyan-900 to-blue-900 text-cyan-200 border-cyan-500/50',
      description: 'Our flagship executive engagement for scaling lenders. Full diagnostic covering underwriting drift, synthetic fraud vulnerabilities, vintage curves, and a custom 30/60/90-day remediation roadmap.',
      deliverables: [
        'Complete 4-Part Executive Report (Executive Lens & Gaps)',
        'Deep-dive audit into 5 domains with evidence grading',
        'Vintage & cohort delinquency curve analysis (MOB 1–12)',
        'Prioritized 30 / 60 / 90-Day Remediation Action Plan',
        'Board-ready slide deck + 90-minute strategic readout session'
      ],
      ctaText: 'Request Detailed Check',
      action: () => onSelectService('Detailed Risk Health Check'),
      recommended: true,
    },
    {
      id: 'implementation_support',
      name: 'Health Check + Implementation Support',
      tag: 'Diagnostic + Hands-On Execution',
      price: p.implementation.label,
      turnaround: '4–6 Weeks Engaged',
      badge: 'High Impact',
      badgeColor: 'bg-purple-950 text-purple-300 border-purple-800',
      description: 'We don’t just identify the leaks—we embed with your product, underwriting, and engineering teams to draft policies, rewrite rules, and deploy early-warning dashboards.',
      deliverables: [
        'Everything in Detailed Risk Health Check',
        'Drafting updated Delegated Lending Authority (DLA) matrix',
        'Configuration of automated fraud velocity & device rules',
        'Designing real-time early warning indicator triggers',
        'Weekly implementation standups with product & engineering'
      ],
      ctaText: 'Engage Implementation',
      action: () => onSelectService('Health Check + Implementation Support'),
      recommended: false,
    },
    {
      id: 'ongoing_retainer',
      name: 'Fractional CRO Advisory',
      tag: 'Ongoing Implementation Retainer',
      price: `${p.retainer.label}${p.retainer.period}`,
      turnaround: 'Monthly Retainer',
      badge: 'Strategic Growth',
      badgeColor: 'bg-amber-950 text-amber-300 border-amber-800',
      description: 'On-demand Chief Risk Officer advisory for founders navigating new lending product launches, bank partner negotiations, co-lending/FLDG compliance, and board meetings.',
      deliverables: [
        'Monthly portfolio health & cohort drift reviews',
        'Pre-launch risk sign-off for new loan products / partners',
        'Co-lending & institutional capital partner due diligence prep',
        'Ad-hoc Slack/WhatsApp access for urgent risk decisions',
        'Attendance at monthly Risk & Credit Committee meetings'
      ],
      ctaText: 'Retain Fractional CRO',
      action: () => onSelectService('Ongoing Implementation Advisory'),
      recommended: false,
    }
  ];

  return (
    <section id="services" className="py-20 bg-slate-950 text-slate-100 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/70 border border-cyan-800/70 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Core Offer: AI-Assisted Risk-Control Health Check</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Independent Risk-Control Health Checks for Growing Digital & Fintech Lenders.
            </h2>
            <p className="mt-3 text-base text-slate-400">
              Pressure-test your credit, fraud, portfolio and risk-governance controls before growth exposes the gaps. AI-assisted, objective evaluation delivered in minutes, backed by institutional human expertise.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-3 py-2 rounded-lg flex items-center gap-2">
              <span className="text-slate-200 font-semibold">{currentJurisdiction.flag} Local Currency:</span>
              <span className="text-cyan-400 font-mono font-bold">{currentJurisdiction.currency} ({currentJurisdiction.symbol})</span>
            </div>
            <button
              onClick={onOpenFounderPortal}
              className="text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800 px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <span>Custom Scope Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.slice(0, 3).map((service) => (
            <div
              key={service.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                service.recommended
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border-2 border-cyan-500/60 shadow-2xl shadow-cyan-500/10'
                  : 'bg-slate-900/60 border border-slate-800 hover:border-slate-700 hover:bg-slate-900/90'
              }`}
            >
              {service.recommended && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-md">
                  Recommended Initial Offer
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${service.badgeColor}`}>
                    {service.badge}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{service.turnaround}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-white mb-1">{service.name}</h3>
                <p className="text-xs font-medium text-cyan-400 mb-4">{service.tag}</p>

                <div className="mb-5 pb-5 border-b border-slate-800">
                  <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
                    {service.price}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Calibrated for {currentJurisdiction.country} fintech & digital lenders
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="space-y-2.5 mb-8">
                  <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Key Deliverables</span>
                  </div>
                  {service.deliverables.map((d, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={service.action}
                className={`w-full py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  service.recommended
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600'
                }`}
              >
                <span>{service.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Secondary Services (Implementation Support & Fractional CRO) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {services.slice(3, 5).map((service) => (
            <div
              key={service.id}
              className="rounded-2xl p-6 bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${service.badgeColor}`}>
                    {service.badge}
                  </span>
                  <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                    <Clock className="w-3 h-3 text-slate-500" />
                    <span>{service.turnaround}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-2">
                  <h3 className="text-xl font-bold text-white">{service.name}</h3>
                  <div className="text-xl font-extrabold text-cyan-300 font-mono">{service.price}</div>
                </div>
                <p className="text-xs font-medium text-slate-400 mb-4">{service.tag}</p>

                <p className="text-sm text-slate-300 leading-relaxed mb-5">
                  {service.description}
                </p>

                <div className="space-y-2 mb-6">
                  {service.deliverables.map((d, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={service.action}
                className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{service.ctaText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* N8N AUTOMATED 5-DOMAIN WORKFLOW & PRICING ENGINE */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold mb-1">
                <span>AUTOMATION: N8N AGENTIC RISK PIPELINE</span>
              </div>
              <h3 className="text-xl font-bold text-white">
                How We Automate 5-Domain Stress Testing & Pricing in Minutes
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-2xl">
                The moment a founder shares their underwriting policy, KYC flow, and loan book AUM, our n8n workflow executes automated analysis across the 5 domains, maps control gaps, and generates tailored scope pricing.
              </p>
            </div>
            <button
              onClick={onOpenFounderPortal}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Test n8n Intake Workflow</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 5-Step Visual Architecture */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                step: '01',
                title: 'Data Intake Webhook',
                tool: 'n8n Webhook / Encrypted API',
                desc: 'Receives founder profile, loan book AUM, and underwriting policy documents.',
                badge: '120ms'
              },
              {
                step: '02',
                title: '5-Domain AI Parser',
                tool: 'Gemini 2.5 Flash / Document AI',
                desc: 'Audits credit PPG rules, synthetic fraud velocity checks, and DLA exception tiers.',
                badge: '480ms'
              },
              {
                step: '03',
                title: 'Control Gap Scorer',
                tool: 'n8n Risk Matrix Node',
                desc: 'Evaluates the 20 checkpoints (0-60 points) and pinpoints top 3-5 operational leaks.',
                badge: '210ms'
              },
              {
                step: '04',
                title: 'Scope Pricing Engine',
                tool: 'Multi-Jurisdiction Rules',
                desc: 'Calculates Starter, Detailed, or Retainer fee calibrated to local currency & AUM.',
                badge: '150ms'
              },
              {
                step: '05',
                title: 'Report & Roadmap Dispatch',
                tool: 'PDF Engine + Webhook',
                desc: 'Outputs 4-part executive deliverable & 30/60/90-day plan directly to founder.',
                badge: '650ms'
              }
            ].map((node) => (
              <div
                key={node.step}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-2 hover:border-cyan-800 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-cyan-400 font-bold">Step {node.step}</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">{node.badge}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{node.title}</h4>
                  <div className="text-[10px] font-mono text-cyan-300 mt-0.5">{node.tool}</div>
                  <p className="text-[11px] text-slate-400 leading-normal mt-2">{node.desc}</p>
                </div>
                <div className="pt-2 border-t border-slate-900 flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                  <CheckCircle className="w-3 h-3" />
                  <span>Automated</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advisory Approach Banner */}
        <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 border border-cyan-900/40 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">Executive Value in Minutes, Not Weeks</div>
              <div className="text-xs text-slate-400 max-w-xl">
                By fusing automated n8n pipeline ingestion with senior human strategist review, we pinpoint your underwriting leaks and deliver an institutional 30/60/90-day remediation roadmap before your next board meeting.
              </div>
            </div>
          </div>
          <button
            onClick={onStartStressTest}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 transition-colors shadow-md shadow-cyan-500/20 cursor-pointer"
          >
            Start with Free Diagnostic
          </button>
        </div>
      </div>
    </section>
  );
};
