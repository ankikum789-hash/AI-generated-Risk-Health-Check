import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  Copy, 
  Check, 
  Send, 
  RefreshCw,
  Building,
  Calendar,
  User,
  ShieldCheck,
  Download
} from 'lucide-react';
import { HealthCheckReport, RiskDomainId } from '../types/risk';
import { generateAiRiskReport } from '../services/geminiRiskService';
import { SAMPLE_DEFAULT_REPORT } from '../data/riskData';

interface ReportGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReport?: HealthCheckReport;
}

export const ReportGeneratorModal: React.FC<ReportGeneratorModalProps> = ({
  isOpen,
  onClose,
  initialReport = SAMPLE_DEFAULT_REPORT,
}) => {
  const [report, setReport] = useState<HealthCheckReport>(initialReport);
  const [activeTab, setActiveTab] = useState<'report_view' | 'ai_copilot'>('report_view');

  // AI Copilot state
  const [clientNameInput, setClientNameInput] = useState(initialReport.clientName || 'Apex MSME Finance');
  const [founderInput, setFounderInput] = useState(initialReport.founderCeo || 'Founder & CEO');
  const [discoveryNotes, setDiscoveryNotes] = useState(
    'Discovery interview summary: Fast-growing embedded MSME lending platform. Approvals take under 2 minutes. Merchant cash advance and short-term working capital. Delinquencies currently zero across 1,000+ instalments, but manual exception approvals on new retail partner have reached 19%. Fraud detection relies mostly on Aadhaar/PAN OTP without device linkage graphs. Risk policies are not documented in formal RACI.'
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPromptTemplate = () => {
    const promptText = `Based on the attached interview notes and underwriting documents for ${clientNameInput || '[Client Name]'}, draft sections 2, 3, and 4 of our Detailed Risk Health Check report. Categorize findings strictly across Credit, Fraud, Portfolio Monitoring, Risk Governance, and New-Product Readiness, and outline a 30/60/90-day remediation roadmap.`;
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleRunAiGeneration = async () => {
    setIsGenerating(true);
    try {
      const generated = await generateAiRiskReport(
        clientNameInput,
        founderInput,
        report.domainScores,
        discoveryNotes
      );
      setReport(generated);
      setActiveTab('report_view');
    } catch (err) {
      console.error('Failed to generate AI report:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between no-print">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Detailed Risk Health Check Report Generator
              </h3>
              <p className="text-[11px] text-slate-400">
                4-Section Diagnostic Deliverable • AI Copilot Ready
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Switcher */}
            <div className="flex items-center bg-slate-900 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('report_view')}
                className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                  activeTab === 'report_view'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Executive Report
              </button>
              <button
                onClick={() => setActiveTab('ai_copilot')}
                className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition-colors ${
                  activeTab === 'ai_copilot'
                    ? 'bg-cyan-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Fast-Draft</span>
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              title="Print or Save as PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 flex-1 bg-slate-950">
          {/* TAB 1: FORMAL EXECUTIVE REPORT VIEW (PRINT-READY) */}
          {activeTab === 'report_view' && (
            <div className="max-w-4xl mx-auto space-y-8 bg-slate-900/60 p-6 sm:p-10 rounded-2xl border border-slate-800 text-slate-100 print:bg-white print:text-black print:p-0 print:border-0 print:shadow-none">
              {/* Header Page Branding */}
              <div className="border-b-2 border-slate-700 pb-6 print:border-black">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-widest text-cyan-400 font-bold mb-1 print:text-blue-700">
                      STRATRISK ADVISORY • EXECUTIVE DIAGNOSTIC
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight print:text-black">
                      Detailed Risk Health Check Report
                    </h1>
                    <p className="text-xs text-slate-400 mt-1 print:text-gray-600">
                      5-Domain Risk Maturity & Scalable Remediation Roadmap
                    </p>
                  </div>

                  <div className="text-right text-xs text-slate-300 print:text-gray-700 space-y-0.5">
                    <div><strong>Client:</strong> {report.clientName}</div>
                    <div><strong>Executive:</strong> {report.founderCeo}</div>
                    <div><strong>Strategist:</strong> {report.evaluator}</div>
                    <div><strong>Date:</strong> {report.date}</div>
                  </div>
                </div>

                {/* Score Pill Bar */}
                <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4 print:border-gray-300 print:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400 print:text-gray-600 uppercase font-semibold">Total Diagnostic Score:</span>
                    <span className="text-2xl font-mono font-extrabold text-white print:text-black">{report.overallScore} / 60</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 print:text-gray-600">Control Environment:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      report.maturityStatus === 'Significant Gaps'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : report.maturityStatus === 'Developing'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    }`}>
                      {report.maturityStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 1: EXECUTIVE SUMMARY & OVERVIEW */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider print:text-blue-800">
                  <span>Section 01</span>
                  <span>•</span>
                  <span>Executive Summary & Overview</span>
                </div>
                <h3 className="text-lg font-bold text-white print:text-black">
                  Leadership Risk Lens & Growth Vulnerability
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed print:text-gray-800">
                  {report.executiveSummary}
                </p>

                <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-800/60 print:bg-amber-50 print:border-amber-400">
                  <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 print:text-amber-800">
                    Primary Operational Vulnerability
                  </div>
                  <div className="text-xs sm:text-sm text-amber-200 font-medium print:text-amber-900">
                    {report.primaryVulnerability}
                  </div>
                </div>
              </div>

              {/* SECTION 2: 5-DOMAIN MATURITY SCORECARD */}
              <div className="space-y-4 pt-4 border-t border-slate-800 print:border-gray-300">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider print:text-blue-800">
                  <span>Section 02</span>
                  <span>•</span>
                  <span>The 5-Domain Maturity Scorecard</span>
                </div>
                <h3 className="text-lg font-bold text-white print:text-black">
                  Performance Across Core Underwriting & Risk Architecture
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border border-slate-800 rounded-xl overflow-hidden print:border-gray-300">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] print:bg-gray-100 print:text-gray-700">
                      <tr>
                        <th className="py-2.5 px-3">Domain</th>
                        <th className="py-2.5 px-3 text-center">Score</th>
                        <th className="py-2.5 px-3 text-center">Maturity Rating</th>
                        <th className="py-2.5 px-3">Core Diagnostic Findings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 print:divide-gray-300 text-slate-300 print:text-gray-800">
                      {Object.entries(report.domainScores).map(([key, data]) => {
                        const domainLabels: Record<string, string> = {
                          credit_underwriting: 'Credit & Underwriting',
                          fraud_identity: 'Fraud Controls',
                          portfolio_monitoring: 'Portfolio Monitoring',
                          risk_governance: 'Risk Governance',
                          scaling_readiness: 'New-Product / Scaling Readiness',
                        };

                        return (
                          <tr key={key} className="hover:bg-slate-900/40 print:hover:bg-transparent">
                            <td className="py-3 px-3 font-bold text-white print:text-black">
                              {domainLabels[key] || key}
                            </td>
                            <td className="py-3 px-3 text-center font-mono font-bold text-cyan-300 print:text-blue-700">
                              {data.score} / {data.max}
                            </td>
                            <td className="py-3 px-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                data.maturity === 'Low'
                                  ? 'bg-rose-950 text-rose-300 border border-rose-800 print:bg-rose-100 print:text-rose-900'
                                  : data.maturity === 'Medium'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800 print:bg-amber-100 print:text-amber-900'
                                  : 'bg-emerald-950 text-emerald-300 border border-emerald-800 print:bg-emerald-100 print:text-emerald-900'
                              }`}>
                                {data.maturity} Maturity
                              </span>
                            </td>
                            <td className="py-3 px-3 text-slate-300 print:text-gray-700 leading-normal">
                              {data.notes}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* SECTION 3: KEY CONTROL GAPS & VULNERABILITIES */}
              <div className="space-y-4 pt-4 border-t border-slate-800 print:border-gray-300">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider print:text-blue-800">
                  <span>Section 03</span>
                  <span>•</span>
                  <span>Key Control Gaps & Vulnerabilities</span>
                </div>
                <h3 className="text-lg font-bold text-white print:text-black">
                  Operational Leaks & Potential Capital Cost
                </h3>

                <div className="space-y-3">
                  {report.keyControlGaps.map((gap, idx) => (
                    <div
                      key={gap.id}
                      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 print:bg-gray-50 print:border-gray-300 space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-cyan-400 text-xs font-bold print:text-blue-700">
                            {gap.id}
                          </span>
                          <span className="text-slate-500">•</span>
                          <span className="text-xs font-semibold text-slate-300 print:text-gray-700">
                            {gap.domain}
                          </span>
                        </div>
                        <span className="text-[10px] uppercase font-bold text-rose-400 bg-rose-950/60 border border-rose-900 px-2 py-0.5 rounded print:text-rose-800 print:bg-rose-50">
                          Priority Risk
                        </span>
                      </div>

                      <div className="text-xs sm:text-sm font-semibold text-white print:text-black">
                        {gap.observation}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                        <div className="text-slate-400 print:text-gray-600">
                          <strong className="text-rose-400 print:text-rose-700">Cost / Risk Impact: </strong>
                          {gap.riskImpact}
                        </div>
                        <div className="text-slate-300 print:text-gray-800">
                          <strong className="text-cyan-400 print:text-blue-700">Remedial Fix: </strong>
                          {gap.recommendation}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* SECTION 4: PRIORITIZED REMEDIATION ROADMAP (30/60/90-DAY) */}
              <div className="space-y-4 pt-4 border-t border-slate-800 print:border-gray-300">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider print:text-blue-800">
                  <span>Section 04</span>
                  <span>•</span>
                  <span>Prioritized Remediation Roadmap</span>
                </div>
                <h3 className="text-lg font-bold text-white print:text-black">
                  Actionable 30 / 60 / 90-Day Execution Sequencing
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Days 1-30 */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-rose-900/50 print:bg-gray-50 print:border-gray-300 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 print:border-gray-300">
                      <span className="text-xs font-bold text-rose-400 uppercase tracking-wider print:text-rose-700">
                        Days 1–30
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 print:text-gray-600">
                        Fix First
                      </span>
                    </div>
                    {report.roadmap.days30.map((item, idx) => (
                      <div key={idx} className="text-xs space-y-1">
                        <div className="font-semibold text-white print:text-black">
                          • {item.action}
                        </div>
                        <div className="text-[10px] text-slate-400 print:text-gray-600 pl-2">
                          Owner: <strong>{item.owner}</strong> | Impact: {item.impact}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Days 31-60 */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-amber-900/50 print:bg-gray-50 print:border-gray-300 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 print:border-gray-300">
                      <span className="text-xs font-bold text-amber-400 uppercase tracking-wider print:text-amber-700">
                        Days 31–60
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 print:text-gray-600">
                        Fix Next
                      </span>
                    </div>
                    {report.roadmap.days60.map((item, idx) => (
                      <div key={idx} className="text-xs space-y-1">
                        <div className="font-semibold text-white print:text-black">
                          • {item.action}
                        </div>
                        <div className="text-[10px] text-slate-400 print:text-gray-600 pl-2">
                          Owner: <strong>{item.owner}</strong> | Impact: {item.impact}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Days 61-90 */}
                  <div className="p-4 rounded-xl bg-slate-950 border border-emerald-900/50 print:bg-gray-50 print:border-gray-300 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 print:border-gray-300">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider print:text-emerald-700">
                        Days 61–90
                      </span>
                      <span className="text-[10px] font-bold text-slate-400 print:text-gray-600">
                        Scale Safely
                      </span>
                    </div>
                    {report.roadmap.days90.map((item, idx) => (
                      <div key={idx} className="text-xs space-y-1">
                        <div className="font-semibold text-white print:text-black">
                          • {item.action}
                        </div>
                        <div className="text-[10px] text-slate-400 print:text-gray-600 pl-2">
                          Owner: <strong>{item.owner}</strong> | Impact: {item.impact}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sign-off Block */}
              <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400 print:text-gray-600">
                <div>
                  <div>Report Prepared by: <strong>{report.evaluator}</strong></div>
                  <div>Confidential Executive Deliverable • StratRisk Advisory</div>
                </div>
                <div className="text-right">
                  <div>Classification: <strong>Founder & Board Briefing</strong></div>
                  <div>Framework: 5-Domain Fintech & Digital Lending Risk Health Check</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI FAST-DRAFT COPILOT */}
          {activeTab === 'ai_copilot' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="p-6 rounded-2xl bg-cyan-950/20 border border-cyan-800/50">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4" />
                  <span>How to Use AI to Draft This in Minutes</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed mb-4">
                  When you finish a client discovery call or interview, feed your raw notes or transcript into this copilot. It categorizes findings strictly across Credit, Fraud, Portfolio Monitoring, Risk Governance, and New-Product Readiness, and synthesizes a tailored 30/60/90-day remediation roadmap.
                </p>

                {/* The Prompt Template Box */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 font-mono relative">
                  <div className="text-[11px] text-cyan-400 font-sans font-bold uppercase tracking-wider mb-1">
                    Standard AI Prompt Template:
                  </div>
                  "{`Based on the attached interview notes and underwriting documents for ${clientNameInput || '[Client Name]'}, draft sections 2, 3, and 4 of our Detailed Risk Health Check report. Categorize findings strictly across Credit, Fraud, Portfolio Monitoring, Risk Governance, and New-Product Readiness, and outline a 30/60/90-day remediation roadmap.`}"
                  <button
                    onClick={handleCopyPromptTemplate}
                    className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs flex items-center gap-1 border border-slate-700"
                  >
                    {copiedPrompt ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Client Discovery Input Form */}
              <div className="space-y-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Client / Lending Platform Name
                    </label>
                    <input
                      type="text"
                      value={clientNameInput}
                      onChange={(e) => setClientNameInput(e.target.value)}
                      placeholder="e.g. Apex Capital, LendTech, SME Finance"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                      Founder & CEO / Risk Head
                    </label>
                    <input
                      type="text"
                      value={founderInput}
                      onChange={(e) => setFounderInput(e.target.value)}
                      placeholder="e.g. Ananya Roy — Founder & CEO"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                    Client Discovery Notes, Interview Transcripts & Underwriting Observations
                  </label>
                  <textarea
                    rows={6}
                    value={discoveryNotes}
                    onChange={(e) => setDiscoveryNotes(e.target.value)}
                    placeholder="Paste raw notes from your founder interview or audit call..."
                    className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans leading-relaxed"
                  />
                  <div className="text-[11px] text-slate-400 mt-1">
                    Powered by Gemini 2.5 Flash / AI Studio. Synthesizes executive lens, gaps, and roadmap in seconds.
                  </div>
                </div>

                <button
                  onClick={handleRunAiGeneration}
                  disabled={isGenerating}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Synthesizing Risk Health Check with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate & Format Report with AI Copilot</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
