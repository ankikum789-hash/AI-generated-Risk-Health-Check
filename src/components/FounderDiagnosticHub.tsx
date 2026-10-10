import React, { useState } from 'react';
import { 
  Building2, 
  FileCheck2, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle, 
  Layers, 
  RefreshCw, 
  UploadCloud, 
  Check, 
  Scale, 
  Globe, 
  Clock, 
  FileText,
  Workflow,
  Zap,
  ChevronRight
} from 'lucide-react';
import { FOUNDER_LEAD_MAGNETS, N8N_WORKFLOW_PIPELINE } from '../data/riskData';
import { FounderLeadMagnet, HealthCheckReport, N8nWorkflowNode, RiskDomainId } from '../types/risk';

interface FounderDiagnosticHubProps {
  onOpenReportModalWithData: (report: HealthCheckReport) => void;
  onOpenFounderPortal: () => void;
}

export const FounderDiagnosticHub: React.FC<FounderDiagnosticHubProps> = ({
  onOpenReportModalWithData,
  onOpenFounderPortal,
}) => {
  const [leadMagnets, setLeadMagnets] = useState<FounderLeadMagnet[]>(FOUNDER_LEAD_MAGNETS);
  const [selectedMagnetId, setSelectedMagnetId] = useState<string>(FOUNDER_LEAD_MAGNETS[0].id);
  const [activeSubTab, setActiveSubTab] = useState<'executive_lens' | 'scaling_triggers' | 'control_gaps' | 'remediation_roadmap'>('executive_lens');

  // New Founder Profile Ingestion Modal State
  const [isIngestModalOpen, setIsIngestModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newFounder, setNewFounder] = useState('');
  const [newModel, setNewModel] = useState('Embedded B2B Marketplace Lending');
  const [newVolume, setNewVolume] = useState('₹35 Crore+ ($4.2M)');
  const [newPartners, setNewPartners] = useState('4 Anchor Logistics Platforms');
  const [newGeography, setNewGeography] = useState('India (RBI DLG Regulated)');
  const [discoveryNotes, setDiscoveryNotes] = useState(
    'Company operates fast merchant cash advances. Originating 400+ loans weekly. Manual override approvals increased to 16% on newer logistics partner. KYC uses digital Aadhaar OTP without cross-channel device linkage. 30+ DPD is currently at 1.4% but no leading cash-flow indicators exist.'
  );

  // n8n Pipeline Simulation State
  const [isN8nRunning, setIsN8nRunning] = useState(false);
  const [n8nNodes, setN8nNodes] = useState<N8nWorkflowNode[]>(N8N_WORKFLOW_PIPELINE);
  const [n8nActiveStep, setN8nActiveStep] = useState<number>(-1);

  const currentMagnet = leadMagnets.find(m => m.id === selectedMagnetId) || leadMagnets[0];

  const handleRunN8nPipeline = () => {
    if (!newCompany) return;
    setIsN8nRunning(true);
    setN8nActiveStep(0);

    // Simulate n8n workflow node-by-node execution
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setN8nActiveStep(step);
      if (step >= n8nNodes.length) {
        clearInterval(interval);
        setTimeout(() => {
          // Construct new Lead Magnet tailored to inputs
          const newId = `lm_${Date.now()}`;
          const newTotalScore = 34; // Dynamic evaluated score

          const newLeadMagnet: FounderLeadMagnet = {
            id: newId,
            companyName: newCompany,
            founderCeo: newFounder || 'Founder & CEO',
            lendingModel: newModel,
            disbursements: newVolume,
            targetGeography: newGeography,
            anchorPartners: newPartners,
            status: 'Completed Health Check',
            totalScore: newTotalScore,
            maturityStatus: 'Developing',
            executiveLens: `${newCompany} is demonstrating rapid origination growth in ${newModel}. While initial vintage cohorts maintain low delinquency, commercial pressure from ${newPartners} is stressing manual underwriting override queues and elevating synthetic fraud risk.`,
            fiveAreasToWatch: [
              `Underwriting consistency across ${newPartners}`,
              'Real-time fraud and device linkage anomaly controls',
              'Manual exception and waiver approval governance',
              'Leading cash flow deterioration indicators before 30+ DPD defaults',
              'Model drift telemetry and regulatory explainability'
            ],
            scalingTriggers: [
              {
                trigger: `Scaling across ${newPartners}`,
                controlQuestion: 'Can risk segment delinquency and roll rates by partner ecosystem?',
                whyItMatters: 'Aggregate portfolio metrics mask bleeding sub-tiers.'
              },
              {
                trigger: 'Higher Funnel Throughput',
                controlQuestion: 'Can underwriting speed scale without sacrificing decision auditability?',
                whyItMatters: 'Compressed approvals frequently cause adverse selection leaks.'
              }
            ],
            fourPriorities: [
              { number: '01', title: 'Partner-Level Risk Visibility', description: 'Isolate cohort vintage curves for each anchor channel.' },
              { number: '02', title: 'Automated Velocity Limits', description: 'Enforce real-time device hash and bank account velocity rules.' },
              { number: '03', title: 'Delegated Lending Authority', description: 'Cap junior underwriter override waivers and track override performance.' },
              { number: '04', title: 'Credit-to-Collections Loop', description: 'Feed default recovery learnings directly back into scorecard cutoffs.' }
            ],
            report: {
              clientName: newCompany,
              founderCeo: newFounder || 'Founder & CEO',
              evaluator: 'Ankita — Risk Strategist for Fintech & Digital Lenders',
              date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
              overallScore: newTotalScore,
              maturityStatus: 'Developing',
              executiveSummary: `${newCompany} has proven its distribution model, but risk controls need rapid institutional hardening as origination volumes scale.`,
              primaryVulnerability: 'Rising manual exception rates without central reason code tracking, combined with absence of real-time merchant early warning telemetry.',
              domainScores: {
                credit_underwriting: { score: 7, max: 12, maturity: 'Medium', notes: 'Policy defined; override discipline needs tightening.' },
                fraud_identity: { score: 6, max: 12, maturity: 'Low', notes: 'Digital KYC active; lacks cross-channel device link graphs.' },
                portfolio_monitoring: { score: 6, max: 12, maturity: 'Low', notes: 'Requires daily cash-flow velocity indicators.' },
                risk_governance: { score: 8, max: 12, maturity: 'Medium', notes: 'Founder oversight strong; formalize DLA tiers.' },
                scaling_readiness: { score: 7, max: 12, maturity: 'Medium', notes: 'Partner routing covenants require automated thresholding.' }
              },
              keyControlGaps: [
                {
                  id: 'GAP-01',
                  domain: 'Credit & Underwriting',
                  observation: 'Manual underwriting override rate reached 16% on newly integrated logistics partner.',
                  riskImpact: 'Creates unchecked adverse selection, driving 2.2x higher cohort loss rates.',
                  recommendation: 'Enforce strict Delegated Lending Authority (DLA) caps and mandatory reason codes.'
                },
                {
                  id: 'GAP-02',
                  domain: 'Fraud Controls',
                  observation: 'Application-level verification lacks device hash velocity controls.',
                  riskImpact: 'Exposure to organized synthetic identity sweeps across partner funnels.',
                  recommendation: 'Deploy cross-channel device fingerprinting and IP geo-velocity throttles.'
                },
                {
                  id: 'GAP-03',
                  domain: 'Portfolio Early Warning',
                  observation: 'Early warning monitoring relies exclusively on 30+ DPD lagging indicators.',
                  riskImpact: 'Defaults materialize before risk team has actionable intervention signals.',
                  recommendation: 'Track daily merchant POS cash-flow drops and settlement turnover.'
                }
              ],
              roadmap: {
                days30: [
                  { action: 'Audit and cap junior underwriting override loopholes', owner: 'Credit Policy Lead', impact: 'Immediately halts uncalibrated waivers' },
                  { action: 'Deploy real-time device velocity rules on origination API', owner: 'Fraud Engineering', impact: 'Blocks synthetic fraud rings' }
                ],
                days60: [
                  { action: 'Build partner-segmented vintage delinquency dashboards', owner: 'Risk Analytics', impact: 'Detects deterioration 30 days before default' },
                  { action: 'Deploy Account Aggregator (AA) direct bank verification', owner: 'Tech & Product', impact: 'Eliminates bank statement tampering' }
                ],
                days90: [
                  { action: 'Embed collections recovery intelligence into credit scorecard', owner: 'CRO & Data Science', impact: 'Dynamic risk calibration' }
                ]
              }
            }
          };

          setLeadMagnets(prev => [newLeadMagnet, ...prev]);
          setSelectedMagnetId(newId);
          setIsN8nRunning(false);
          setIsIngestModalOpen(false);
          setN8nActiveStep(-1);
        }, 800);
      }
    }, 450);
  };

  return (
    <section id="case-study" className="py-20 bg-slate-900/40 border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>RiskLens • AI-Assisted Health Check Hub</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Founder-Specific Risk-Control Diagnostics
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
              Switch between customized risk diagnostics across different digital lending models, or upload a founder profile to pressure-test your controls and generate tailored results in minutes.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsIngestModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Ingest New Founder Profile</span>
            </button>
            <button
              onClick={() => onOpenReportModalWithData(currentMagnet.report)}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition-colors flex items-center gap-1.5"
            >
              <FileCheck2 className="w-4 h-4 text-cyan-400" />
              <span>View Full 4-Part Report</span>
            </button>
          </div>
        </div>

        {/* Dynamic Founder / Lead Magnet Tab Switcher Strip */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select Diagnostic Profile:</span>
          </span>
          {leadMagnets.map((m) => {
            const isSelected = m.id === selectedMagnetId;
            return (
              <button
                key={m.id}
                onClick={() => setSelectedMagnetId(m.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-2 cursor-pointer ${
                  isSelected
                    ? 'bg-cyan-950/90 border-cyan-500 text-cyan-300 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{m.companyName.split(' (')[0]}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  m.maturityStatus === 'Significant Gaps' ? 'bg-rose-950 text-rose-300' :
                  m.maturityStatus === 'Developing' ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
                }`}>
                  {m.totalScore}/60
                </span>
              </button>
            );
          })}
        </div>

        {/* Lead Magnet Diagnostic Card Container */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
          {/* Top Company Context Header */}
          <div className="p-6 bg-slate-900/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-6 text-xs">
              <div>
                <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Fintech Platform</span>
                <span className="font-bold text-white text-base">{currentMagnet.companyName}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Lending Structure</span>
                <span className="font-semibold text-cyan-300">{currentMagnet.lendingModel}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Portfolio / GMV</span>
                <span className="font-mono text-slate-200">{currentMagnet.disbursements}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Anchor Channels</span>
                <span className="text-slate-300">{currentMagnet.anchorPartners}</span>
              </div>
              <div>
                <span className="text-slate-500 block uppercase tracking-wider text-[10px]">Jurisdiction</span>
                <span className="text-slate-300">{currentMagnet.targetGeography}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 block font-semibold">5-Domain Maturity</span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold inline-block mt-0.5 ${
                  currentMagnet.maturityStatus === 'Significant Gaps' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  currentMagnet.maturityStatus === 'Developing' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {currentMagnet.maturityStatus} ({currentMagnet.totalScore}/60 Pts)
                </span>
              </div>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex items-center gap-2 px-6 pt-4 border-b border-slate-800 overflow-x-auto text-xs">
            <button
              onClick={() => setActiveSubTab('executive_lens')}
              className={`pb-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeSubTab === 'executive_lens' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Executive Lens & 5 Focus Areas
            </button>
            <button
              onClick={() => setActiveSubTab('scaling_triggers')}
              className={`pb-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeSubTab === 'scaling_triggers' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              What Changes as Platform Scales?
            </button>
            <button
              onClick={() => setActiveSubTab('control_gaps')}
              className={`pb-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeSubTab === 'control_gaps' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Key Control Gaps & Scorecard
            </button>
            <button
              onClick={() => setActiveSubTab('remediation_roadmap')}
              className={`pb-3 font-semibold transition-colors border-b-2 whitespace-nowrap ${
                activeSubTab === 'remediation_roadmap' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              30 / 60 / 90-Day Remediation Plan
            </button>
          </div>

          {/* SUB-VIEW 1: EXECUTIVE LENS & 5 FOCUS AREAS */}
          {activeSubTab === 'executive_lens' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-800/40">
                <div className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Strategic Executive Lens for Leadership</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">
                  "{currentMagnet.executiveLens}"
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                  Five Areas Watched Most Closely for {currentMagnet.companyName}:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentMagnet.fiveAreasToWatch.map((area, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-3">
                      <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="text-xs text-slate-300 font-medium leading-normal">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* SUB-VIEW 2: SCALING TRIGGERS TABLE */}
          {activeSubTab === 'scaling_triggers' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3 px-4 font-semibold w-1/4">Scaling Trigger</th>
                      <th className="py-3 px-4 font-semibold w-1/3">Control Question</th>
                      <th className="py-3 px-4 font-semibold">Why It Matters</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {currentMagnet.scalingTriggers.map((st, idx) => (
                      <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-white align-top">{st.trigger}</td>
                        <td className="py-3.5 px-4 text-cyan-300 align-top font-medium">{st.controlQuestion}</td>
                        <td className="py-3.5 px-4 text-slate-300 align-top">{st.whyItMatters}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* SUB-VIEW 3: CONTROL GAPS & SCORECARD */}
          {activeSubTab === 'control_gaps' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4">
                {Object.entries(currentMagnet.report.domainScores).map(([key, data]) => (
                  <div key={key} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold capitalize truncate">{key.replace('_', ' ')}</div>
                    <div className="text-lg font-bold text-white font-mono mt-1">{data.score} / {data.max}</div>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded mt-1 inline-block ${
                      data.maturity === 'Low' ? 'bg-rose-950 text-rose-300' :
                      data.maturity === 'Medium' ? 'bg-amber-950 text-amber-300' : 'bg-emerald-950 text-emerald-300'
                    }`}>
                      {data.maturity}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Priority Operational Leaks & Control Gaps
                </h4>
                {currentMagnet.report.keyControlGaps.map((gap) => (
                  <div key={gap.id} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-cyan-400 text-xs font-bold">{gap.id}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-xs font-semibold text-slate-300">{gap.domain}</span>
                      </div>
                      <span className="text-[9px] uppercase font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded">
                        High Priority Leak
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-white">{gap.observation}</div>
                    <div className="text-[11px] text-slate-400">
                      <strong className="text-rose-400">Impact: </strong>{gap.riskImpact}
                    </div>
                    <div className="text-[11px] text-cyan-300">
                      <strong>Remediation: </strong>{gap.recommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SUB-VIEW 4: REMEDIATION ROADMAP */}
          {activeSubTab === 'remediation_roadmap' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-rose-900/50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">Days 1–30</span>
                    <span className="text-[10px] text-slate-400">Fix First</span>
                  </div>
                  {currentMagnet.report.roadmap.days30.map((item, idx) => (
                    <div key={idx} className="text-xs space-y-0.5">
                      <div className="font-semibold text-white">• {item.action}</div>
                      <div className="text-[10px] text-slate-400 pl-2">Owner: {item.owner} | {item.impact}</div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-amber-900/50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">Days 31–60</span>
                    <span className="text-[10px] text-slate-400">Fix Next</span>
                  </div>
                  {currentMagnet.report.roadmap.days60.map((item, idx) => (
                    <div key={idx} className="text-xs space-y-0.5">
                      <div className="font-semibold text-white">• {item.action}</div>
                      <div className="text-[10px] text-slate-400 pl-2">Owner: {item.owner} | {item.impact}</div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-emerald-900/50 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Days 61–90</span>
                    <span className="text-[10px] text-slate-400">Scale Safely</span>
                  </div>
                  {currentMagnet.report.roadmap.days90.map((item, idx) => (
                    <div key={idx} className="text-xs space-y-0.5">
                      <div className="font-semibold text-white">• {item.action}</div>
                      <div className="text-[10px] text-slate-400 pl-2">Owner: {item.owner} | {item.impact}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* N8N INGESTION & PIPELINE AUTOMATION MODAL */}
        {isIngestModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
                    <Workflow className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      n8n Automated Risk Health Check Ingestion
                    </h3>
                    <p className="text-xs text-slate-400">
                      Upload founder profile to generate a tailored 5-domain diagnostic lead magnet in minutes.
                    </p>
                  </div>
                </div>
                {!isN8nRunning && (
                  <button
                    onClick={() => setIsIngestModalOpen(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                )}
              </div>

              {/* Running n8n Visualizer */}
              {isN8nRunning ? (
                <div className="space-y-4 py-4">
                  <div className="text-center space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold animate-pulse">
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>n8n Workflow Executing across 6 Risk Nodes...</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Parsing data room & underwriting policy for {newCompany}...
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    {n8nNodes.map((node, idx) => {
                      const isDone = n8nActiveStep > idx;
                      const isCurrent = n8nActiveStep === idx;

                      return (
                        <div
                          key={node.id}
                          className={`p-3 rounded-xl border text-xs flex items-center justify-between transition-all ${
                            isDone
                              ? 'bg-emerald-950/40 border-emerald-800 text-emerald-200'
                              : isCurrent
                              ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-md animate-pulse'
                              : 'bg-slate-950 border-slate-800 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {isDone ? (
                              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : isCurrent ? (
                              <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                            ) : (
                              <span className="w-4 h-4 rounded-full border border-slate-700 flex items-center justify-center text-[9px] font-mono">
                                {idx + 1}
                              </span>
                            )}
                            <div>
                              <div className="font-bold">{node.name}</div>
                              <div className="text-[10px] opacity-80">{node.type}</div>
                            </div>
                          </div>
                          <span className="font-mono text-[10px]">
                            {isDone ? `${node.executionTimeMs}ms` : isCurrent ? 'running...' : 'queued'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                /* Intake Form */
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRunN8nPipeline();
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Company / Platform Name</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. VelocityCapital"
                        value={newCompany}
                        onChange={(e) => setNewCompany(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Founder / CEO Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Ananya Roy — Founder & CEO"
                        value={newFounder}
                        onChange={(e) => setNewFounder(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Lending Model</label>
                      <input
                        type="text"
                        value={newModel}
                        onChange={(e) => setNewModel(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Disbursements / AUM</label>
                      <input
                        type="text"
                        value={newVolume}
                        onChange={(e) => setNewVolume(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-300 block mb-1">Target Jurisdiction</label>
                      <input
                        type="text"
                        value={newGeography}
                        onChange={(e) => setNewGeography(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">
                      Founder Interview Notes, Underwriting Policy Summary & Data Room Highlights
                    </label>
                    <textarea
                      rows={4}
                      value={discoveryNotes}
                      onChange={(e) => setDiscoveryNotes(e.target.value)}
                      className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400 font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Zap className="w-4 h-4" />
                    <span>Run n8n Automated Pipeline & Generate 5-Domain Lead Magnet</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
