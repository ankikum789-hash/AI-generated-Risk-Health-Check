import React, { useState } from 'react';
import { 
  FileCheck, 
  CheckCircle2, 
  Clock, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { PRE_ENGAGEMENT_DOC_CHECKLIST } from '../data/riskData';

export const DocumentChecklistSection: React.FC = () => {
  const [docStatuses, setDocStatuses] = useState<Record<string, 'ready' | 'pending' | 'review'>>({
    'Latest Credit Policy & Product Program Guide (PPG)': 'ready',
    'Underwriting Scorecard & Decision Engine Rule Hierarchy': 'pending',
    'Manual Override & Exception Log (Last 90 Days)': 'pending',
    'Digital KYC/KYB Flow Architecture Diagram': 'ready',
    'Fraud Ruleset & Velocity Limit Configurations': 'pending',
    'Monthly Vintage Delinquency Curves (MOB 1 to 24)': 'pending',
    'Roll-Rate Matrix & DPD Transition Analysis': 'ready',
    'Risk RACI & Delegated Lending Authority (DLA) Matrix': 'ready',
  });

  const [copiedEmail, setCopiedEmail] = useState(false);

  const toggleStatus = (docName: string) => {
    const current = docStatuses[docName] || 'pending';
    const next = current === 'ready' ? 'pending' : current === 'pending' ? 'review' : 'ready';
    setDocStatuses(prev => ({ ...prev, [docName]: next }));
  };

  const handleCopyEmailTemplate = () => {
    const emailBody = `Subject: Pre-Engagement Document Checklist: Detailed Risk Health Check

Hi [Founder / Head of Risk],

To prepare our evidence-based Detailed Risk Health Check and 30/60/90-day remediation roadmap, please grant read-only data room access to the following 4 core categories:

1. Credit & Underwriting:
   - Latest Credit Policy & Product Program Guide (PPG)
   - Underwriting Scorecard & Decision Engine Rule Hierarchy
   - Manual Override & Exception Log (Last 90 Days)

2. Fraud & Identity Controls:
   - Digital KYC/KYB Flow Architecture Diagram
   - Fraud Ruleset & Velocity Limit Configurations
   - Confirmed Fraud Incident Log (Past 12 Months)

3. Portfolio Analytics:
   - Monthly Vintage Delinquency Curves (MOB 1 to 24)
   - Roll-Rate Matrix & DPD Transition Analysis
   - Partner / Anchor Merchant Concentration Schedule

4. Governance & Partner Agreements:
   - Risk RACI & Delegated Lending Authority (DLA) Matrix
   - Financing Partner / Co-Lending / FLDG Agreements
   - AI/ML Model Documentation & Drift Validation Reports

All documents are reviewed under our mutual NDA and encrypted data room. Let me know once access is provisioned so we can commence evidence review.

Best regards,
Ankita — Risk Strategist for Fintech & Digital Lenders`;

    navigator.clipboard.writeText(emailBody);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <section id="checklist" className="py-20 bg-slate-900/40 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <FileCheck className="w-3.5 h-3.5" />
              <span>Pre-Engagement Readiness</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Pre-Engagement Client Document Checklist
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
              The exact documents we request from fintech & digital lender founders and risk teams before commencing a Detailed Risk Health Check.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyEmailTemplate}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors flex items-center gap-2 cursor-pointer"
            >
              {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-cyan-400" />}
              <span>{copiedEmail ? 'Email Copied!' : 'Copy Founder Email Template'}</span>
            </button>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PRE_ENGAGEMENT_DOC_CHECKLIST.map((cat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  {cat.category}
                </h3>
                <span className="text-[11px] text-slate-500 font-mono">
                  {cat.documents.length} Items
                </span>
              </div>

              <div className="space-y-3">
                {cat.documents.map((doc, dIdx) => {
                  const status = docStatuses[doc.name] || (doc.status as any);

                  return (
                    <div
                      key={dIdx}
                      className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 transition-colors flex items-start justify-between gap-3 cursor-pointer"
                      onClick={() => toggleStatus(doc.name)}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-white">
                            {doc.name}
                          </span>
                          {doc.required && (
                            <span className="text-[9px] uppercase font-bold text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded">
                              Required
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal">
                          {doc.description}
                        </p>
                      </div>

                      {/* Status Toggle Pill */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(doc.name);
                        }}
                        className={`shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 ${
                          status === 'ready'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : status === 'review'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}
                      >
                        {status === 'ready' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {status === 'review' && <Clock className="w-3 h-3 text-amber-400" />}
                        <span>{status === 'ready' ? 'Uploaded' : status === 'review' ? 'In Review' : 'Pending'}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Confidentiality Notice */}
        <div className="mt-8 p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>All client documents are handled under strict bilateral Non-Disclosure Agreements (NDA) and SOC2-compliant encrypted storage.</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono hidden sm:inline">Encrypted AES-256</span>
        </div>
      </div>
    </section>
  );
};
