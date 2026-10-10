import React from 'react';
import { Shield, Mail, Globe, ArrowUpRight, Lock, FileText, CheckCircle } from 'lucide-react';
import { JurisdictionConfig } from '../types/risk';

interface FooterProps {
  currentJurisdiction: JurisdictionConfig;
  onOpenReportModal: () => void;
  onOpenFounderPortal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentJurisdiction,
  onOpenReportModal,
  onOpenFounderPortal,
}) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs py-14 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Role */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-950 border border-cyan-800 flex items-center justify-center text-cyan-400 font-bold">
                <Shield className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-sm tracking-tight">RiskLens</span>
              <span className="text-cyan-400 font-mono text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/50 uppercase tracking-wider font-semibold">AI-ASSISTED</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              AI-Assisted Lending Risk Intelligence. Independent risk-control health checks for growing digital & fintech lenders. Pressure-test your credit, fraud, portfolio and risk-governance controls before growth exposes the gaps.
            </p>
            <div className="text-slate-500 text-[11px]">
              Principal Strategist: <span className="text-slate-300">Ankita</span>
            </div>
          </div>

          {/* Col 2: Methodologies */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              The 5 Domains
            </div>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>Credit & Underwriting Controls</li>
              <li>Fraud & Identity Architecture</li>
              <li>Portfolio Early Warning & Vintage Curves</li>
              <li>Risk Governance & AI Traceability</li>
              <li>Scaling & Embedded Ecosystem Readiness</li>
            </ul>
          </div>

          {/* Col 3: Jurisdictions & Coverage */}
          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Global Lending Hubs
            </div>
            <ul className="space-y-1.5 text-slate-400 text-xs">
              <li>🇮🇳 India — RBI Digital Lending & FLDG 5%</li>
              <li>🇸🇬 Singapore — MAS Tech Risk & AI FEAT</li>
              <li>🇺🇸 United States — CFPB, OCC & Fair Lending</li>
              <li>🇬🇧 United Kingdom — FCA Consumer Duty</li>
              <li>🇦🇪 Dubai (UAE) — DFSA & Open Finance</li>
            </ul>
          </div>

          {/* Col 4: Executive Deliverables */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Founder Deliverables
            </div>
            <div className="space-y-2">
              <button
                onClick={onOpenReportModal}
                className="w-full text-left p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-800 text-slate-300 hover:text-white transition-colors flex items-center justify-between"
              >
                <span>Sample 5-Page Report</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
              </button>
              <button
                onClick={onOpenFounderPortal}
                className="w-full text-left p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-800 text-slate-300 hover:text-white transition-colors flex items-center justify-between"
              >
                <span>Confidential Fee Portal</span>
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
              </button>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer directly from PDF */}
        <div className="pt-8 border-t border-slate-800/80 text-[11px] text-slate-500 leading-relaxed">
          <p className="mb-2">
            <strong className="text-slate-400">Important Disclaimer: </strong>
            This framework is not a statutory audit, regulatory assurance opinion, model validation, or formal compliance sign-off. It is an independent, hypothesis-led executive diagnostic based on management information, process evidence, and portfolio analytics intended to identify control gaps that merit deeper evidence-based review.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-slate-600">
            <span>© 2026 StratRisk Advisory. All rights reserved. Confidential Executive Deliverables.</span>
            <span>Current Jurisdiction: {currentJurisdiction.country} ({currentJurisdiction.currency})</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
