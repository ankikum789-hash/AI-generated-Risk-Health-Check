import React, { useState, useMemo } from 'react';
import { 
  Lock, 
  UserCheck, 
  ArrowRight, 
  LogOut, 
  CheckCircle, 
  Download, 
  DollarSign, 
  Layers, 
  ShieldCheck, 
  Calendar, 
  FileText, 
  Sliders, 
  Check, 
  Building2, 
  PhoneCall,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { JurisdictionConfig, JurisdictionCode } from '../types/risk';
import { JURISDICTIONS } from '../data/riskData';

interface FounderPortalProps {
  isOpen: boolean;
  onClose: () => void;
  isLoggedIn: boolean;
  currentUser: string | null;
  onLogin: (name: string, company: string) => void;
  onLogout: () => void;
  currentJurisdiction: JurisdictionConfig;
  onSelectJurisdiction: (code: JurisdictionCode) => void;
  onOpenReportModal: () => void;
}

export const FounderPortal: React.FC<FounderPortalProps> = ({
  isOpen,
  onClose,
  isLoggedIn,
  currentUser,
  onLogin,
  onLogout,
  currentJurisdiction,
  onSelectJurisdiction,
  onOpenReportModal,
}) => {
  // Login Form State
  const [emailInput, setEmailInput] = useState('');
  const [companyInput, setCompanyInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  // Scope & Fee Modeler State
  const [aumMillions, setAumMillions] = useState<number>(10);
  const [partnerCount, setPartnerCount] = useState<number>(3);
  const [includeFldgReview, setIncludeFldgReview] = useState<boolean>(true);
  const [includeAiDriftAudit, setIncludeAiDriftAudit] = useState<boolean>(true);
  const [includeBoardReadout, setIncludeBoardReadout] = useState<boolean>(true);
  const [engagementType, setEngagementType] = useState<'detailed' | 'implementation' | 'retainer'>('detailed');
  const [proposalGenerated, setProposalGenerated] = useState<boolean>(false);

  // Fee Calculation
  const feeCalculation = useMemo(() => {
    const isINR = currentJurisdiction.code === 'IN';
    const rate = currentJurisdiction.rateToUsd;
    const symbol = currentJurisdiction.symbol;

    let baseUsd = 2000; // default for Detailed Health Check
    if (engagementType === 'implementation') baseUsd = 4000;
    if (engagementType === 'retainer') baseUsd = 1200;

    // AUM scaling factor
    const aumFactor = aumMillions > 20 ? 1.3 : aumMillions > 10 ? 1.15 : 1.0;
    
    // Partner integrations factor
    const partnerFactor = partnerCount > 5 ? 1.25 : partnerCount > 2 ? 1.1 : 1.0;

    // Addons
    let addonsUsd = 0;
    if (includeFldgReview) addonsUsd += 450;
    if (includeAiDriftAudit) addonsUsd += 600;
    if (includeBoardReadout) addonsUsd += 350;

    const totalUsd = Math.round((baseUsd * aumFactor * partnerFactor) + addonsUsd);

    if (isINR) {
      // Prompt conversion: ~$2,000 ~ ₹190,000
      const totalINR = Math.round(totalUsd * 87.0);
      return {
        amountFormatted: `₹${totalINR.toLocaleString('en-IN')}`,
        baseFormatted: `₹${Math.round(baseUsd * 87.0).toLocaleString('en-IN')}`,
        addonsFormatted: `₹${Math.round(addonsUsd * 87.0).toLocaleString('en-IN')}`,
        symbol: '₹',
        period: engagementType === 'retainer' ? '/month' : 'one-time engagement fee',
      };
    }

    const localAmount = Math.round(totalUsd * rate);
    return {
      amountFormatted: `${symbol}${localAmount.toLocaleString()}`,
      baseFormatted: `${symbol}${Math.round(baseUsd * rate).toLocaleString()}`,
      addonsFormatted: `${symbol}${Math.round(addonsUsd * rate).toLocaleString()}`,
      symbol,
      period: engagementType === 'retainer' ? '/month' : 'one-time engagement fee',
    };
  }, [currentJurisdiction, engagementType, aumMillions, partnerCount, includeFldgReview, includeAiDriftAudit, includeBoardReadout]);

  if (!isOpen) return null;

  return (
    <div className="py-12 bg-slate-950 min-h-[85vh] text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">RiskLens</span>
            <span className="text-slate-600">/</span>
            <span className="text-cyan-400 font-semibold">Founder & CEO Client Portal</span>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-white font-medium bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700"
          >
            ← Back to Public Website
          </button>
        </div>

        {/* NOT LOGGED IN STATE */}
        {!isLoggedIn ? (
          <div className="max-w-md mx-auto my-8 p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 mx-auto mb-3">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-xl font-bold text-white">Founder Advisory Suite</h2>
              <p className="text-xs text-slate-400 mt-1">
                Enter your credentials or choose 1-Click Demo Access to view confidential fee proposals & data room deliverables.
              </p>
            </div>

            {/* 1-Click Demo Buttons */}
            <div className="space-y-2 mb-6">
              <button
                onClick={() => onLogin('Lead Founder', 'Apex MSME Finance')}
                className="w-full py-2.5 px-4 rounded-xl bg-cyan-950 hover:bg-cyan-900 border border-cyan-700 text-cyan-200 text-xs font-bold transition-all flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-cyan-400" />
                  <span>Demo: MSME Lending Founder (Active Cohort)</span>
                </div>
                <ChevronRight className="w-4 h-4 text-cyan-400" />
              </button>

              <button
                onClick={() => onLogin('Fintech & Digital Lender Founder', 'ScalePay Fintech')}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-semibold transition-all flex items-center justify-between cursor-pointer"
              >
                <span>Demo: Prospective Fintech Founder (Series A)</span>
                <ChevronRight className="w-4 h-4 text-slate-500" />
              </button>
            </div>

            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800" />
              </div>
              <span className="relative bg-slate-900 px-3 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
                Or Sign In with Email
              </span>
            </div>

            {/* Custom Sign In Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onLogin(emailInput.split('@')[0] || 'Founder', companyInput || 'Fintech Corp');
              }}
              className="space-y-3.5"
            >
              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Company / Platform</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Intellend"
                  value={companyInput}
                  onChange={(e) => setCompanyInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Founder / CEO Email</label>
                <input
                  type="email"
                  required
                  placeholder="founder@company.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300 block mb-1">Access Passcode</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  defaultValue="executive2026"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                Access Confidential Room
              </button>
            </form>
          </div>
        ) : (
          /* LOGGED IN FOUNDER PORTAL VIEW */
          <div className="space-y-10">
            {/* Header Client Bar */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center text-white font-extrabold text-base">
                  {currentUser?.charAt(0) || 'B'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">{currentUser}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Active Engagement Room
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Assigned Risk Strategist: <strong className="text-cyan-300">Ankita</strong> • Lead Diagnostic Partner
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenReportModal}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-2 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Open Active Report</span>
                </button>
                <button
                  onClick={onLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-rose-400 bg-slate-950 border border-slate-800"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* CONFIDENTIAL STRATEGIC FEE & SCOPE CALCULATOR */}
            <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                    <DollarSign className="w-4 h-4" />
                    <span>Confidential Scope & Fee Proposal Modeler</span>
                  </div>
                  <h4 className="text-xl font-bold text-white">
                    Custom Advisory Scope & Quote Generator
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Calibrated for {currentJurisdiction.country} ({currentJurisdiction.currency}) based on loan book AUM, partner volume, and regulatory add-ons.
                  </p>
                </div>

                {/* Country Switcher */}
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
                  {Object.values(JURISDICTIONS).map(j => (
                    <button
                      key={j.code}
                      onClick={() => onSelectJurisdiction(j.code)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                        currentJurisdiction.code === j.code
                          ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {j.flag} {j.code}
                    </button>
                  ))}
                </div>
              </div>

              {/* Engagement Type Selector */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Select Advisory Structure
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    onClick={() => setEngagementType('detailed')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      engagementType === 'detailed'
                        ? 'bg-cyan-950/70 border-cyan-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">Detailed Risk Health Check</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">4-Part Report + 30/60/90-Day Roadmap</div>
                  </button>

                  <button
                    onClick={() => setEngagementType('implementation')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      engagementType === 'implementation'
                        ? 'bg-cyan-950/70 border-cyan-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">Diagnostic + Implementation</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">4–6 Weeks Hands-on Policy & Rules Deployment</div>
                  </button>

                  <button
                    onClick={() => setEngagementType('retainer')}
                    className={`p-3.5 rounded-xl border text-left transition-all ${
                      engagementType === 'retainer'
                        ? 'bg-cyan-950/70 border-cyan-500 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold">Fractional CRO Retainer</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Ongoing Monthly Advisory & Board Representation</div>
                  </button>
                </div>
              </div>

              {/* Sliders for Volume & Partners */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300">Current / Target 12-Month Loan Book AUM</span>
                    <span className="font-mono text-cyan-400 font-bold">
                      {currentJurisdiction.code === 'IN' ? `₹${(aumMillions * 8.7).toFixed(1)} Cr` : `$${aumMillions}M`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={aumMillions}
                    onChange={(e) => setAumMillions(Number(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>{currentJurisdiction.code === 'IN' ? '₹8.7 Cr' : '$1M'}</span>
                    <span>{currentJurisdiction.code === 'IN' ? '₹435 Cr' : '$50M+'}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-300">Anchor Merchant / Partner Channels</span>
                    <span className="font-mono text-cyan-400 font-bold">{partnerCount} Ecosystems</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={partnerCount}
                    onChange={(e) => setPartnerCount(Number(e.target.value))}
                    className="w-full accent-cyan-400 bg-slate-800 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>1 Partner</span>
                    <span>10+ Multi-ecosystems</span>
                  </div>
                </div>
              </div>

              {/* Scope Add-ons */}
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">
                  Specialized Modules & Regulatory Add-ons
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div
                    onClick={() => setIncludeFldgReview(!includeFldgReview)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                      includeFldgReview ? 'bg-cyan-950/50 border-cyan-600 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>FLDG & Co-Lending Covenant Audit</span>
                    <div className={`w-4 h-4 rounded flex items-center justify-center ${includeFldgReview ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700'}`}>
                      {includeFldgReview && <Check className="w-3 h-3" />}
                    </div>
                  </div>

                  <div
                    onClick={() => setIncludeAiDriftAudit(!includeAiDriftAudit)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                      includeAiDriftAudit ? 'bg-cyan-950/50 border-cyan-600 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>AI / ML Scorecard Drift Validation</span>
                    <div className={`w-4 h-4 rounded flex items-center justify-center ${includeAiDriftAudit ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700'}`}>
                      {includeAiDriftAudit && <Check className="w-3 h-3" />}
                    </div>
                  </div>

                  <div
                    onClick={() => setIncludeBoardReadout(!includeBoardReadout)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                      includeBoardReadout ? 'bg-cyan-950/50 border-cyan-600 text-white' : 'bg-slate-950 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span>Board & Investor Committee Readout</span>
                    <div className={`w-4 h-4 rounded flex items-center justify-center ${includeBoardReadout ? 'bg-cyan-500 text-slate-950' : 'border border-slate-700'}`}>
                      {includeBoardReadout && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Calculated Proposal Output */}
              <div className="p-6 rounded-2xl bg-slate-950 border border-cyan-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Calculated Confidential Proposal Fee
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-extrabold text-cyan-400 font-mono">
                      {feeCalculation.amountFormatted}
                    </span>
                    <span className="text-xs text-slate-400">
                      ({feeCalculation.period})
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Base: {feeCalculation.baseFormatted} + Addons: {feeCalculation.addonsFormatted} • Tailored for {currentJurisdiction.country}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setProposalGenerated(true);
                      setTimeout(() => setProposalGenerated(false), 4000);
                    }}
                    className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>{proposalGenerated ? 'Proposal Generated!' : 'Generate Signed Scope Proposal'}</span>
                  </button>
                </div>
              </div>

              {proposalGenerated && (
                <div className="p-4 rounded-xl bg-emerald-950 border border-emerald-700 text-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Bespoke proposal document generated for {currentUser} at {feeCalculation.amountFormatted}. Letter of Engagement sent to registered founder email.</span>
                </div>
              )}
            </div>

            {/* DIRECT STRATEGIST CALENDAR & BOOKING */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Direct 1:1 Founder Diagnostic Session</h4>
                  <p className="text-xs text-slate-400 max-w-xl">
                    Reserve a 45-minute confidential deep-dive with Risk Strategist Ankita. We review your underwriting rules, override bottlenecks, and prepare your initial 5-domain maturity scorecard.
                  </p>
                </div>
              </div>

              <button
                onClick={() => alert('Diagnostic session reservation initiated! Our executive assistant will confirm within 2 business hours.')}
                className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 transition-colors shadow-md cursor-pointer"
              >
                Schedule Readout Call
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
