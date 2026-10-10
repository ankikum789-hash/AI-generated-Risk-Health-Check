import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Fingerprint, 
  LineChart, 
  FileText, 
  Rocket, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight,
  Eye,
  ArrowUpRight,
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  CheckCircle,
  Clock,
  Send,
  Sliders,
  Terminal,
  ExternalLink,
  X,
  FileCheck,
  ChevronLeft
} from 'lucide-react';
import { RISK_DOMAINS, DIAGNOSTIC_QUESTIONS } from '../data/riskData';
import { RiskDomainId, HealthCheckReport } from '../types/risk';
import { 
  triggerN8nWorkflow, 
  N8nDomainSurveyInput, 
  N8nWorkflowExecutionResult, 
  N8nNodeExecutionLog,
  DEFAULT_N8N_WEBHOOK_URL
} from '../services/n8nService';

interface FiveDomainsSectionProps {
  onStartStressTestForDomain?: (domainId: RiskDomainId) => void;
  onOpenReportWithGeneratedData?: (report: HealthCheckReport) => void;
}

export const FiveDomainsSection: React.FC<FiveDomainsSectionProps> = ({
  onStartStressTestForDomain,
  onOpenReportWithGeneratedData,
}) => {
  const [selectedDomainId, setSelectedDomainId] = useState<RiskDomainId>('credit_underwriting');

  // n8n Survey & Workflow Modal State
  const [isSurveyModalOpen, setIsSurveyModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [customWebhookUrl, setCustomWebhookUrl] = useState<string>(DEFAULT_N8N_WEBHOOK_URL);
  
  // Survey Inputs
  const [surveyData, setSurveyData] = useState<N8nDomainSurveyInput>({
    companyName: 'ApexCredit Capital',
    founderName: 'Aditya & Team',
    email: 'aditya@apexcredit.io',
    lendingModel: 'SME Working Capital & Invoice Financing',
    jurisdiction: 'India (RBI DLG / NBFC)',
    loanSizeAvg: '₹1,50,000 ($1,800)',
    monthlyOriginations: '₹18 Crore ($2.2M)',
    
    // Domain 1: Credit Underwriting
    creditScorecardType: 'hybrid_rules',
    creditOverrideRatePct: 14,
    creditPolicyAuditCadence: 'quarterly',
    
    // Domain 2: Fraud & Identity
    fraudIdentityChecks: ['kyb_registry', 'device_fingerprint', 'bank_behavioral'],
    firstPaymentDefaultRatePct: 2.8,
    deviceClusteringActive: false,

    // Domain 3: Portfolio Monitoring
    portfolioMonitoringTrigger: 'dpd_30_only',
    vintageTrackingFrequency: 'monthly_cohort',
    collectionsFeedbackLoop: 'semi_automated',

    // Domain 4: Risk Governance
    delegatedAuthorityMatrix: 'spreadsheet_dla',
    riskCommitteeCadence: 'monthly',
    aiDecisionAuditLogging: false,

    // Domain 5: Scaling Readiness
    capitalPartnerAuditReadiness: 'partially_compliant',
    multiOriginatorRouting: true,
    stressTestFrequency: 'annual',
  });

  // Workflow Execution State
  const [isWorkflowRunning, setIsWorkflowRunning] = useState(false);
  const [workflowProgress, setWorkflowProgress] = useState(0);
  const [activeNodeLog, setActiveNodeLog] = useState<N8nNodeExecutionLog | null>(null);
  const [allNodeLogs, setAllNodeLogs] = useState<N8nNodeExecutionLog[]>([]);
  const [workflowResult, setWorkflowResult] = useState<N8nWorkflowExecutionResult | null>(null);

  const selectedDomain = RISK_DOMAINS.find(d => d.id === selectedDomainId) || RISK_DOMAINS[0];
  const domainQuestions = DIAGNOSTIC_QUESTIONS.filter(q => q.domainId === selectedDomainId);

  const getDomainIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5" />;
      case 'Fingerprint': return <Fingerprint className="w-5 h-5" />;
      case 'LineChart': return <LineChart className="w-5 h-5" />;
      case 'FileText': return <FileText className="w-5 h-5" />;
      case 'Rocket': return <Rocket className="w-5 h-5" />;
      default: return <ShieldCheck className="w-5 h-5" />;
    }
  };

  const handleStartWorkflow = async () => {
    setCurrentStep(7); // Jump to execution canvas
    setIsWorkflowRunning(true);
    setWorkflowProgress(5);
    setAllNodeLogs([]);
    setWorkflowResult(null);

    try {
      const result = await triggerN8nWorkflow(surveyData, {
        webhookUrl: customWebhookUrl,
        onProgressNode: (log, progress) => {
          setActiveNodeLog(log);
          setAllNodeLogs(prev => [...prev, log]);
          setWorkflowProgress(progress);
        }
      });

      setWorkflowResult(result);
      setIsWorkflowRunning(false);
      setWorkflowProgress(100);
      setCurrentStep(8); // Results view
    } catch (err) {
      console.error('n8n execution error:', err);
      setIsWorkflowRunning(false);
    }
  };

  const handleTransferToReportGenerator = () => {
    if (!workflowResult) return;
    if (onOpenReportWithGeneratedData) {
      onOpenReportWithGeneratedData(workflowResult.generatedReport as HealthCheckReport);
    }
    setIsSurveyModalOpen(false);
  };

  return (
    <section id="domains" className="py-20 bg-slate-900/60 border-t border-b border-slate-800 text-slate-100 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Header with n8n Automation Spotlight */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Core Framework • 5 Domains of Lending Risk Health</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              The 5 Architectural Pillars of Lending Risk Control
            </h2>
            <p className="mt-3 text-base text-slate-400">
              A battle-tested governance and quantitative framework for digital lenders, fintechs, and embedded platforms. Ensure underwriting, fraud defense, portfolio telemetry, and warehouse capital covenants scale seamlessly.
            </p>
          </div>

          {/* High-Impact AI Automation Trigger */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={() => {
                setCurrentStep(1);
                setIsSurveyModalOpen(true);
              }}
              className="px-5 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
            >
              <Zap className="w-4 h-4 text-slate-950 group-hover:scale-110 transition-transform fill-slate-950" />
              <span>⚡ Start Automated 5-Domain Health Check (n8n)</span>
            </button>
          </div>
        </div>

        {/* Automated Architecture Banner */}
        <div className="mb-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-blue-950/50 border border-cyan-800/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>Autonomous n8n Lending Risk Workflow Pipeline</span>
                <span className="text-[10px] font-mono uppercase bg-cyan-900/60 text-cyan-300 border border-cyan-700/80 px-2 py-0.5 rounded">
                  Webhook v2.4 Active
                </span>
              </div>
              <div className="text-xs text-slate-300 mt-0.5">
                Automatically calculates founder business health check across each domain node-by-node in seconds.
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentStep(1);
              setIsSurveyModalOpen(true);
            }}
            className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 self-end md:self-auto cursor-pointer"
          >
            <span>Launch Reactive Flow</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Domain Navigation Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-10">
          {RISK_DOMAINS.map((domain, index) => {
            const isSelected = domain.id === selectedDomainId;
            return (
              <button
                key={domain.id}
                onClick={() => setSelectedDomainId(domain.id)}
                className={`p-4 rounded-xl text-left transition-all border flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/60 border-cyan-500/80 shadow-lg shadow-cyan-500/10'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                    {getDomainIcon(domain.icon)}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">0{index + 1}</span>
                </div>
                <div>
                  <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {domain.name.split(' Controls')[0].split(' & Early')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {domain.subtitle}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Domain Inspector */}
        <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 md:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Domain Overview & Risk Signal */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <div className="flex items-center gap-2.5 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                  {getDomainIcon(selectedDomain.icon)}
                  <span>Domain Focus</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{selectedDomain.name}</h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {selectedDomain.description}
                </p>
              </div>

              {/* Key Risk Signal Callout */}
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1.5 uppercase tracking-wider">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Key Risk Signal</span>
                </div>
                <p className="text-xs text-amber-200 font-medium leading-normal">
                  "{selectedDomain.keyRiskSignal}"
                </p>
              </div>

              {/* Evidence / Signals to Examine */}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Evidence & Signals We Audit</span>
                </div>
                <div className="space-y-2">
                  {selectedDomain.evidenceSignals.map((sig, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{sig}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  onClick={() => {
                    setCurrentStep(1);
                    setIsSurveyModalOpen(true);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/10"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>Automate Health Check</span>
                </button>
                {onStartStressTestForDomain && (
                  <button
                    onClick={() => onStartStressTestForDomain(selectedDomain.id)}
                    className="py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Manual 0-3 Test</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Column: Core Diagnostic Checkpoints */}
            <div className="lg:col-span-7 bg-slate-900/50 rounded-xl p-6 border border-slate-800/80">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Core Diagnostic Checkpoints (0–3 Scoring Scale)
                </span>
                <span className="text-xs text-cyan-400 font-mono">
                  4 Critical Controls
                </span>
              </div>

              <div className="space-y-4">
                {domainQuestions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-start gap-2.5">
                        <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <h4 className="text-xs sm:text-sm font-semibold text-white">
                          {q.text}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        0–3 Pts
                      </span>
                    </div>

                    <div className="ml-7 text-[11px] text-slate-400 space-y-1">
                      <div className="text-slate-300">
                        <strong className="text-cyan-400 font-normal">Audit Probe: </strong>
                        {q.evidencePrompt}
                      </div>
                      {q.potentialBlindSpot && (
                        <div className="text-amber-300/90 text-[10px]">
                          <strong>Potential Blind Spot: </strong>
                          {q.potentialBlindSpot}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>0 = No control &nbsp;|&nbsp; 1 = Partially defined &nbsp;|&nbsp; 2 = Operational &nbsp;|&nbsp; 3 = Automated & regularly tested</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* REACTIVE MULTI-STEP SURVEY & n8n WORKFLOW EXECUTION MODAL                 */}
      {/* ========================================================================= */}
      {isSurveyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-fade-in my-auto">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-800 text-cyan-400">
                  <Zap className="w-5 h-5 fill-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-white">
                      AI-Automated 5-Domain Lending Risk Health Check
                    </h3>
                    <span className="text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800 px-2 py-0.5 rounded">
                      n8n Powered
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Step {currentStep <= 6 ? `${currentStep} of 6: Data Intake` : currentStep === 7 ? 'n8n Workflow Execution' : 'Scorecard Ready'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsSurveyModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Stepper Progress Indicator */}
            {currentStep <= 6 && (
              <div className="px-6 pt-4 pb-2 bg-slate-950/40 border-b border-slate-800/60">
                <div className="grid grid-cols-6 gap-2 text-center">
                  {[
                    { step: 1, label: 'Profile' },
                    { step: 2, label: '1. Credit' },
                    { step: 3, label: '2. Fraud' },
                    { step: 4, label: '3. Portfolio' },
                    { step: 5, label: '4. Governance' },
                    { step: 6, label: '5. Scaling' },
                  ].map((s) => (
                    <div 
                      key={s.step} 
                      onClick={() => !isWorkflowRunning && setCurrentStep(s.step)}
                      className={`cursor-pointer transition-all ${
                        currentStep === s.step 
                          ? 'text-cyan-400 font-bold' 
                          : currentStep > s.step 
                          ? 'text-emerald-400 font-medium' 
                          : 'text-slate-500'
                      }`}
                    >
                      <div className="text-[11px] truncate">{s.label}</div>
                      <div className={`h-1.5 rounded-full mt-1.5 transition-all ${
                        currentStep === s.step 
                          ? 'bg-cyan-400' 
                          : currentStep > s.step 
                          ? 'bg-emerald-500' 
                          : 'bg-slate-800'
                      }`} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Body: Dynamic Step Content */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">

              {/* STEP 1: Founder & Lending Business Profile */}
              {currentStep === 1 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-slate-800 pb-3">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-cyan-400" />
                      <span>Step 1: Lending Business Architecture & Profile</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Configure your lending entity profile so the n8n risk workflow calibrates thresholds to your portfolio size and jurisdiction.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Lending Entity / Company Name
                      </label>
                      <input
                        type="text"
                        value={surveyData.companyName}
                        onChange={(e) => setSurveyData({ ...surveyData, companyName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        placeholder="e.g. Acme FinTech, NovaCapital"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Founder / Head of Risk Name
                      </label>
                      <input
                        type="text"
                        value={surveyData.founderName}
                        onChange={(e) => setSurveyData({ ...surveyData, founderName: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        placeholder="e.g. Sarah Jenkins (CEO)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Lending Model
                      </label>
                      <select
                        value={surveyData.lendingModel}
                        onChange={(e) => setSurveyData({ ...surveyData, lendingModel: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="SME Working Capital & Invoice Financing">SME Working Capital & Invoice Financing</option>
                        <option value="Digital BNPL & Consumer Installment Loans">Digital BNPL & Consumer Installment Loans</option>
                        <option value="Merchant Cash Advance (MCA)">Merchant Cash Advance (MCA)</option>
                        <option value="Embedded B2B Marketplace Lending">Embedded B2B Marketplace Lending</option>
                        <option value="Earned Wage Access & Payroll Advance">Earned Wage Access & Payroll Advance</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Jurisdiction & Regulatory Regime
                      </label>
                      <input
                        type="text"
                        value={surveyData.jurisdiction}
                        onChange={(e) => setSurveyData({ ...surveyData, jurisdiction: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        placeholder="e.g. India (RBI NBFC), USA (CFPB/State), Singapore (MAS)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Average Loan Ticket Size
                      </label>
                      <input
                        type="text"
                        value={surveyData.loanSizeAvg}
                        onChange={(e) => setSurveyData({ ...surveyData, loanSizeAvg: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        placeholder="e.g. ₹1,50,000 ($1,800)"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Monthly Origination Volume
                      </label>
                      <input
                        type="text"
                        value={surveyData.monthlyOriginations}
                        onChange={(e) => setSurveyData({ ...surveyData, monthlyOriginations: e.target.value })}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        placeholder="e.g. ₹20 Crore ($2.4M / month)"
                      />
                    </div>
                  </div>

                  {/* n8n Webhook Configuration */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5" />
                        <span>n8n Webhook Endpoint Trigger</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">SIMULATED & DISPATCH READY</span>
                    </div>
                    <input
                      type="text"
                      value={customWebhookUrl}
                      onChange={(e) => setCustomWebhookUrl(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 font-mono text-[11px] text-cyan-200 px-3 py-2 rounded-lg focus:outline-none focus:border-cyan-500"
                    />
                    <div className="text-[10px] text-slate-500 mt-1">
                      Our system emits simulated execution events by default. You can also paste an external n8n webhook URL to receive live JSON payloads.
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Domain 1 - Credit Underwriting */}
              {currentStep === 2 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-slate-800 pb-3">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      <span>Domain 1: Credit Underwriting & Policy Governance</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Assess scorecard decision engine consistency, manual exception drift, and PSI drift surveillance.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        1. Underwriting Decision Architecture:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {[
                          { id: 'fully_automated', label: 'Fully Automated Algorithmic Engine', sub: 'Zero manual touchpoint for 90%+ loans' },
                          { id: 'ml_algorithmic', label: 'ML Model + Scorecard Triage', sub: 'Automated tiers with selective human review' },
                          { id: 'hybrid_rules', label: 'Rule-Engine + Underwriter Approval', sub: 'Knockout rules with analyst signoff' },
                          { id: 'manual_only', label: 'Primarily Manual Underwriter Discretion', sub: 'Spreadsheet or subjective reviews' },
                        ].map((opt) => (
                          <div
                            key={opt.id}
                            onClick={() => setSurveyData({ ...surveyData, creditScorecardType: opt.id as any })}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                              surveyData.creditScorecardType === opt.id
                                ? 'bg-cyan-950/80 border-cyan-500 text-white'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className="text-xs font-bold text-white">{opt.label}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{opt.sub}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-slate-300">
                          2. Manual Policy Override Rate:
                        </label>
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          surveyData.creditOverrideRatePct <= 5 ? 'bg-emerald-950 text-emerald-400' :
                          surveyData.creditOverrideRatePct <= 10 ? 'bg-amber-950 text-amber-400' : 'bg-rose-950 text-rose-400'
                        }`}>
                          {surveyData.creditOverrideRatePct}% ({surveyData.creditOverrideRatePct <= 5 ? 'Low Drift' : surveyData.creditOverrideRatePct <= 10 ? 'Moderate' : 'High Adverse Selection Risk'})
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="35"
                        step="1"
                        value={surveyData.creditOverrideRatePct}
                        onChange={(e) => setSurveyData({ ...surveyData, creditOverrideRatePct: Number(e.target.value) })}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                        <span>0% (Full Compliance)</span>
                        <span>5% (Bank Standard)</span>
                        <span>15% (Warning)</span>
                        <span>30%+ (Dangerous Gap)</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        3. Population Stability Index (PSI) & Scorecard Retraining Cadence:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'continuous_psi', label: 'Continuous Telemetry' },
                          { id: 'monthly', label: 'Monthly Cohort Review' },
                          { id: 'quarterly', label: 'Quarterly Audit' },
                          { id: 'ad_hoc', label: 'Ad-Hoc / Annual Only' },
                        ].map((cad) => (
                          <button
                            key={cad.id}
                            type="button"
                            onClick={() => setSurveyData({ ...surveyData, creditPolicyAuditCadence: cad.id as any })}
                            className={`p-2.5 rounded-lg border text-xs font-medium transition-all ${
                              surveyData.creditPolicyAuditCadence === cad.id
                                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {cad.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Domain 2 - Fraud & Identity Controls */}
              {currentStep === 3 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-slate-800 pb-3">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Fingerprint className="w-4 h-4 text-cyan-400" />
                      <span>Domain 2: Fraud Defense & Synthetic Identity Verification</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Evaluate active verification layers, first-payment default (FPD) performance, and device clustering.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        1. Active Fraud & Identity Verification Layers:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {[
                          { id: 'device_fingerprint', label: 'Device Hash & IP Geo-Velocity Tracking' },
                          { id: 'synthetic_id', label: 'Synthetic ID Sweeps & SSN/Aadhaar Discrepancies' },
                          { id: 'kyb_registry', label: 'Automated Government/Corporate Registry Sync' },
                          { id: 'bank_behavioral', label: 'Real-Time Bank Statement Behavioral Analysis' },
                          { id: 'shared_blacklist', label: 'Industry Shared Fraud Blacklist Cross-Check' },
                        ].map((chk) => {
                          const isActive = surveyData.fraudIdentityChecks.includes(chk.id);
                          return (
                            <div
                              key={chk.id}
                              onClick={() => {
                                const next = isActive
                                  ? surveyData.fraudIdentityChecks.filter(x => x !== chk.id)
                                  : [...surveyData.fraudIdentityChecks, chk.id];
                                setSurveyData({ ...surveyData, fraudIdentityChecks: next });
                              }}
                              className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                isActive
                                  ? 'bg-cyan-950/70 border-cyan-500 text-white'
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              <span className="text-xs font-medium">{chk.label}</span>
                              <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                                isActive ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700'
                              }`}>
                                {isActive && <CheckCircle className="w-3 h-3" />}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-semibold text-slate-300">
                          2. First-Payment Default (FPD) Rate:
                        </label>
                        <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                          surveyData.firstPaymentDefaultRatePct <= 1.5 ? 'bg-emerald-950 text-emerald-400' :
                          surveyData.firstPaymentDefaultRatePct <= 3.0 ? 'bg-amber-950 text-amber-400' : 'bg-rose-950 text-rose-400'
                        }`}>
                          {surveyData.firstPaymentDefaultRatePct}% ({surveyData.firstPaymentDefaultRatePct <= 1.5 ? 'Institutional Grade' : 'Fraud Leakage Warning'})
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0.2"
                        max="8.0"
                        step="0.1"
                        value={surveyData.firstPaymentDefaultRatePct}
                        onChange={(e) => setSurveyData({ ...surveyData, firstPaymentDefaultRatePct: Number(e.target.value) })}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">Cross-Channel Device Graph Link Clustering</div>
                        <div className="text-[10px] text-slate-400">Detect multi-borrower application syndicates sharing hardware tokens or banking proxies</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSurveyData({ ...surveyData, deviceClusteringActive: !surveyData.deviceClusteringActive })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          surveyData.deviceClusteringActive 
                            ? 'bg-cyan-500 text-slate-950' 
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {surveyData.deviceClusteringActive ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Domain 3 - Portfolio Monitoring */}
              {currentStep === 4 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-slate-800 pb-3">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <LineChart className="w-4 h-4 text-cyan-400" />
                      <span>Domain 3: Portfolio Monitoring & Vintage Delinquency Signals</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Check for leading indicators vs lagging 30+ DPD defaults, cohort loss projections, and collections feedback loops.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        1. Primary Delinquency Trigger Telemetry:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          { id: 'daily_cashflow_telemetry', label: 'Daily Bank Cashflow Telemetry', desc: 'Forward-looking 7-day liquidity alerts' },
                          { id: 'dpd_15_early_warning', label: '15-DPD Early Velocity Curve', desc: 'Pre-default early cure interventions' },
                          { id: 'dpd_30_only', label: 'Traditional 30+ DPD Lagging Only', desc: 'Reacts only after missed payment milestones' },
                        ].map((trig) => (
                          <div
                            key={trig.id}
                            onClick={() => setSurveyData({ ...surveyData, portfolioMonitoringTrigger: trig.id as any })}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                              surveyData.portfolioMonitoringTrigger === trig.id
                                ? 'bg-cyan-950/80 border-cyan-500 text-white'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className="text-xs font-bold text-white">{trig.label}</div>
                            <div className="text-[10px] text-slate-400 mt-1">{trig.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        2. Cohort Vintage Analysis Tracking Cadence:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'weekly_dynamic', label: 'Weekly Dynamic Curves' },
                          { id: 'monthly_cohort', label: 'Monthly Cohorts (MOB 1-24)' },
                          { id: 'none', label: 'No Cohort Tracking' },
                        ].map((v) => (
                          <button
                            key={v.id}
                            type="button"
                            onClick={() => setSurveyData({ ...surveyData, vintageTrackingFrequency: v.id as any })}
                            className={`p-2.5 rounded-lg border text-xs font-medium transition-all ${
                              surveyData.vintageTrackingFrequency === v.id
                                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {v.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        3. Collections Feedback Loop into Underwriting Engine:
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: 'realtime_bidirectional', label: 'Automated Real-Time', sub: 'Roll-rates retrain scorecard' },
                          { id: 'semi_automated', label: 'Monthly Analyst Handoff', sub: 'Manual policy adjustments' },
                          { id: 'manual_handoff', label: 'Disconnected Silos', sub: 'No structured feedback loop' },
                        ].map((c) => (
                          <div
                            key={c.id}
                            onClick={() => setSurveyData({ ...surveyData, collectionsFeedbackLoop: c.id as any })}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                              surveyData.collectionsFeedbackLoop === c.id
                                ? 'bg-cyan-950/80 border-cyan-500 text-white'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className="text-xs font-bold text-white">{c.label}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">{c.sub}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Domain 4 - Risk Governance */}
              {currentStep === 5 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-slate-800 pb-3">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      <span>Domain 4: Risk Governance & Delegated Lending Authority</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Validate policy ownership, formal committee cadence, and compliance auditability.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        1. Delegated Lending Authority (DLA) Architecture:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          { id: 'enforced_system_dla', label: 'Enforced in Software (LMS)', desc: 'Automated hard authorization locks' },
                          { id: 'spreadsheet_dla', label: 'Spreadsheet / Written Matrix', desc: 'Manual signoffs subject to error' },
                          { id: 'informal', label: 'Informal / Founder Discretion', desc: 'No codified ticket size limits' },
                        ].map((dla) => (
                          <div
                            key={dla.id}
                            onClick={() => setSurveyData({ ...surveyData, delegatedAuthorityMatrix: dla.id as any })}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                              surveyData.delegatedAuthorityMatrix === dla.id
                                ? 'bg-cyan-950/80 border-cyan-500 text-white'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className="text-xs font-bold text-white">{dla.label}</div>
                            <div className="text-[10px] text-slate-400 mt-1">{dla.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        2. Credit & Risk Committee Review Cadence:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { id: 'biweekly', label: 'Bi-Weekly Cadence' },
                          { id: 'monthly', label: 'Monthly Committee' },
                          { id: 'quarterly', label: 'Quarterly Review' },
                          { id: 'none', label: 'Ad-hoc / Not Formed' },
                        ].map((com) => (
                          <button
                            key={com.id}
                            type="button"
                            onClick={() => setSurveyData({ ...surveyData, riskCommitteeCadence: com.id as any })}
                            className={`p-2.5 rounded-lg border text-xs font-medium transition-all ${
                              surveyData.riskCommitteeCadence === com.id
                                ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                            }`}
                          >
                            {com.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white">Immutable AI / Algorithmic Decision Audit Logging</div>
                        <div className="text-[10px] text-slate-400">Stores unalterable reasoning logs for every automated rejection and acceptance for bank partner and regulatory audits</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSurveyData({ ...surveyData, aiDecisionAuditLogging: !surveyData.aiDecisionAuditLogging })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          surveyData.aiDecisionAuditLogging 
                            ? 'bg-cyan-500 text-slate-950' 
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {surveyData.aiDecisionAuditLogging ? 'Active' : 'Missing'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 6: Domain 5 - Scaling Readiness & Capital Facilities */}
              {currentStep === 6 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="border-b border-slate-800 pb-3">
                    <h4 className="text-base font-bold text-white flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-cyan-400" />
                      <span>Domain 5: Scaling Readiness & Institutional Facility Covenants</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Assess warehouse credit facility covenant headroom, multi-originator routing, and stress-test preparedness.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-2">
                        1. Institutional Capital Partner Audit Readiness:
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {[
                          { id: 'institutional_grade', label: 'Institutional Grade', desc: 'Audit-ready covenants, FLDG headroom' },
                          { id: 'partially_compliant', label: 'Partially Compliant', desc: 'Meets initial checks, manual covenant reports' },
                          { id: 'not_ready', label: 'Early / High Due Diligence Friction', desc: 'Unprepared for warehouse line audit' },
                        ].map((cap) => (
                          <div
                            key={cap.id}
                            onClick={() => setSurveyData({ ...surveyData, capitalPartnerAuditReadiness: cap.id as any })}
                            className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                              surveyData.capitalPartnerAuditReadiness === cap.id
                                ? 'bg-cyan-950/80 border-cyan-500 text-white'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                            }`}
                          >
                            <div className="text-xs font-bold text-white">{cap.label}</div>
                            <div className="text-[10px] text-slate-400 mt-1">{cap.desc}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">Multi-Originator / Multi-Lender Routing</div>
                          <div className="text-[10px] text-slate-400">Dynamically routes loans to distinct balance sheet or co-lending partners based on risk appetite</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSurveyData({ ...surveyData, multiOriginatorRouting: !surveyData.multiOriginatorRouting })}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                            surveyData.multiOriginatorRouting 
                              ? 'bg-cyan-500 text-slate-950' 
                              : 'bg-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {surveyData.multiOriginatorRouting ? 'Active' : 'Single'}
                        </button>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                        <label className="block text-xs font-bold text-white mb-2">
                          Macro Scenario Stress Test Cadence
                        </label>
                        <select
                          value={surveyData.stressTestFrequency}
                          onChange={(e) => setSurveyData({ ...surveyData, stressTestFrequency: e.target.value as any })}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                        >
                          <option value="quarterly">Quarterly Systematic Simulation</option>
                          <option value="annual">Annual Stress Test Only</option>
                          <option value="never">Never Tested Under Stressed Loss</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 7: LIVE n8n WORKFLOW EXECUTION CANVAS */}
              {currentStep === 7 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="text-center max-w-xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-semibold mb-2">
                      <Zap className="w-3.5 h-3.5 animate-spin" />
                      <span>n8n Autonomous Lending Risk Engine</span>
                    </div>
                    <h4 className="text-xl font-extrabold text-white">
                      Executing 5-Domain Automated Health Check
                    </h4>
                    <p className="text-xs text-slate-400 mt-1">
                      Evaluating underwriting exception rates, synthetic fraud vectors, early warning roll-rates, and DLA governance node-by-node.
                    </p>
                  </div>

                  {/* Visual Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-400">Pipeline Execution:</span>
                      <span className="text-cyan-400 font-bold">{workflowProgress}%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-slate-950 border border-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 transition-all duration-300"
                        style={{ width: `${workflowProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* Visual n8n Node Graph */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      { id: 'webhook_trigger', title: '1. Webhook Ingestion', sub: 'POST /v1/healthcheck' },
                      { id: 'node_domain_credit', title: '2. Underwriting Evaluator', sub: 'Domain 1: Credit & Scorecard' },
                      { id: 'node_domain_fraud', title: '3. Fraud & Identity Scanner', sub: 'Domain 2: FPD & Synthetic Defense' },
                      { id: 'node_domain_portfolio', title: '4. Early Warning Modeler', sub: 'Domain 3: Vintage & 15-DPD' },
                      { id: 'node_domain_governance', title: '5. DLA Matrix Validator', sub: 'Domain 4: Governance & Audit' },
                      { id: 'node_domain_scaling', title: '6. Capital Facility Node', sub: 'Domain 5: Scale Readiness' },
                      { id: 'node_report_aggregator', title: '7. AI Report Synthesizer', sub: 'Composite Score & 90-Day Plan' },
                    ].map((node) => {
                      const matchedLog = allNodeLogs.find(l => l.nodeId === node.id);
                      const isCurrentlyActive = activeNodeLog?.nodeId === node.id && isWorkflowRunning;
                      const isComplete = matchedLog && matchedLog.status === 'success';

                      return (
                        <div
                          key={node.id}
                          className={`p-3.5 rounded-xl border transition-all ${
                            isCurrentlyActive 
                              ? 'bg-cyan-950/80 border-cyan-400 shadow-md shadow-cyan-500/20 animate-pulse' 
                              : isComplete 
                              ? 'bg-slate-950/90 border-emerald-500/60' 
                              : 'bg-slate-950/40 border-slate-800 text-slate-500'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold text-white truncate">{node.title}</span>
                            {isComplete ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : isCurrentlyActive ? (
                              <Zap className="w-4 h-4 text-cyan-400 animate-spin shrink-0" />
                            ) : (
                              <Clock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400">{node.sub}</div>
                          {matchedLog && (
                            <div className="text-[10px] font-mono text-cyan-300 mt-2 truncate">
                              ✓ {matchedLog.executionTimeMs}ms • {matchedLog.message}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Terminal Execution Console */}
                  <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-[11px] max-h-48 overflow-y-auto space-y-1">
                    <div className="text-slate-500 flex items-center gap-1.5 pb-1 border-b border-slate-900">
                      <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                      <span>n8n Live Workflow Engine Stream [Execution ID: {allNodeLogs[0]?.nodeId ? 'Active' : 'Initiating'}]</span>
                    </div>
                    {allNodeLogs.map((log, idx) => (
                      <div key={idx} className="text-slate-300 flex items-start gap-2">
                        <span className="text-cyan-500 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                        <span className="text-emerald-400 font-bold shrink-0">{log.name}:</span>
                        <span className="text-slate-300">{log.message}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 8: SCORECARD & EXECUTIVE ACTION ROADMAP */}
              {currentStep === 8 && workflowResult && (
                <div className="space-y-6 animate-fade-in">
                  
                  {/* Results Header Card */}
                  <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-slate-900 to-blue-950/60 border border-cyan-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                      <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold mb-1">
                        n8n Automated Audit Scorecard • Completed in {workflowResult.totalDurationMs}ms
                      </div>
                      <h4 className="text-2xl font-black text-white">
                        {surveyData.companyName} Risk Health Index
                      </h4>
                      <p className="text-xs text-slate-300 mt-1 max-w-xl">
                        {workflowResult.executiveSummary}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 bg-slate-950/80 p-4 rounded-xl border border-slate-800 shrink-0">
                      <div className="text-center">
                        <div className="text-3xl font-black text-cyan-300">
                          {workflowResult.overallScore}<span className="text-sm text-slate-500 font-normal">/60</span>
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono">5-Domain Total</div>
                      </div>
                      <div className="h-10 w-px bg-slate-800" />
                      <div className="text-center">
                        <div className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${
                          workflowResult.maturityStatus === 'Mature' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' :
                          workflowResult.maturityStatus === 'Established' ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' :
                          workflowResult.maturityStatus === 'Developing' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}>
                          {workflowResult.maturityStatus}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase font-mono mt-1">Maturity Bracket</div>
                      </div>
                    </div>
                  </div>

                  {/* 5-Domain Detailed Breakdown Grid */}
                  <div>
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                      Automated 5-Domain Evaluation Breakdown (Calculated by n8n Pipeline)
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                      {Object.values(workflowResult.domainResults).map((d) => (
                        <div 
                          key={d.domainId}
                          className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-bold text-white truncate">{d.name.split(' &')[0]}</span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                d.maturity === 'High' ? 'bg-emerald-950 text-emerald-400' :
                                d.maturity === 'Medium' ? 'bg-amber-950 text-amber-400' : 'bg-rose-950 text-rose-400'
                              }`}>
                                {d.score}/12
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 mb-2">
                              Maturity: <strong className="text-slate-200">{d.maturity}</strong>
                            </div>
                            <div className="text-[10px] text-slate-300 line-clamp-3">
                              {d.recommendedAction}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 30-60-90 Day Remediation Roadmap */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-cyan-300 mb-3 flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Immediate 30-Day Automated Corrective Priorities</span>
                    </h5>
                    <div className="space-y-2">
                      {workflowResult.roadmap.days30.map((action, idx) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                              {idx + 1}
                            </span>
                            <span className="text-slate-200 font-medium">{action.action}</span>
                          </div>
                          <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded shrink-0">
                            Impact: {action.impact}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                    <button
                      onClick={() => {
                        setCurrentStep(1);
                        setWorkflowResult(null);
                      }}
                      className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-run Health Check with New Inputs</span>
                    </button>

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <button
                        onClick={handleTransferToReportGenerator}
                        className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <FileCheck className="w-4 h-4 fill-slate-950" />
                        <span>Open 4-Part Executive Report</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Modal Footer Controls (Step Navigation) */}
            {currentStep <= 6 && (
              <div className="p-4 border-t border-slate-800 bg-slate-950/90 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                    currentStep === 1 
                      ? 'text-slate-600 cursor-not-allowed' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800 cursor-pointer'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                {currentStep < 6 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(prev => prev + 1)}
                    className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-cyan-500/10"
                  >
                    <span>Next Domain</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleStartWorkflow}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-cyan-500/20"
                  >
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Trigger Automated n8n 5-Domain Health Check</span>
                  </button>
                )}
              </div>
            )}

          </div>
        </div>
      )}

    </section>
  );
};
