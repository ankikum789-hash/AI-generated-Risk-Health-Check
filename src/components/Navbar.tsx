import React from 'react';
import { Shield, Sparkles, Lock, Globe, ChevronDown, CheckCircle2, Home, Zap } from 'lucide-react';
import { JURISDICTIONS } from '../data/riskData';
import { JurisdictionCode } from '../types/risk';

interface NavbarProps {
  currentJurisdiction: JurisdictionCode;
  onSelectJurisdiction: (code: JurisdictionCode) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isPortalOpen: boolean;
  setIsPortalOpen: (open: boolean) => void;
  isLoggedIn: boolean;
  currentUser: string | null;
  onLogout: () => void;
  onOpenReportModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentJurisdiction,
  onSelectJurisdiction,
  activeTab,
  setActiveTab,
  isPortalOpen,
  setIsPortalOpen,
  isLoggedIn,
  currentUser,
  onLogout,
  onOpenReportModal,
}) => {
  const currentJ = JURISDICTIONS[currentJurisdiction] || JURISDICTIONS.IN;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-100 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Strategist Branding */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              setIsPortalOpen(false);
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-sky-600 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold tracking-tight text-white text-base">
                <span>RiskLens</span>
                <span className="text-cyan-400 font-mono text-[10px] px-1.5 py-0.5 rounded bg-cyan-950/80 border border-cyan-800/50 uppercase tracking-wider font-semibold">AI-ASSISTED</span>
              </div>
              <p className="text-xs text-slate-400 font-normal">Lending Risk Intelligence</p>
            </div>
          </div>

          {/* Navigation links */}
          {!isPortalOpen && (
            <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
              <button
                onClick={() => {
                  setIsPortalOpen(false);
                  setActiveTab('home');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'home'
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Home className="w-3.5 h-3.5 text-cyan-400" />
                <span>Home</span>
              </button>
              <button
                onClick={() => {
                  setIsPortalOpen(false);
                  setActiveTab('services');
                  const el = document.getElementById('services');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'services' || activeTab === 'overview'
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Services
              </button>
              <button
                onClick={() => {
                  setIsPortalOpen(false);
                  setActiveTab('domains');
                  const el = document.getElementById('domains');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'domains'
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>5 Domains & AI Audit</span>
              </button>
              <button
                onClick={() => {
                  setIsPortalOpen(false);
                  setActiveTab('stress-test');
                  const el = document.getElementById('stress-test');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'stress-test'
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Diagnostic Test</span>
              </button>
              <button
                onClick={() => {
                  setIsPortalOpen(false);
                  setActiveTab('cockpit');
                  const el = document.getElementById('cockpit');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'cockpit'
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Risk Cockpit</span>
              </button>
              <button
                onClick={() => {
                  setIsPortalOpen(false);
                  setActiveTab('case-study');
                  const el = document.getElementById('case-study');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'case-study'
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Founder Benchmarks
              </button>
              <button
                onClick={() => {
                  setIsPortalOpen(false);
                  setActiveTab('testimonials');
                  const el = document.getElementById('testimonials');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'testimonials'
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Founder Reviews
              </button>
              <button
                onClick={() => {
                  setIsPortalOpen(false);
                  setActiveTab('pricing');
                  const el = document.getElementById('pricing');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'pricing'
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Engagement Models
              </button>
              <button
                onClick={() => {
                  setIsPortalOpen(false);
                  setActiveTab('checklist');
                  const el = document.getElementById('checklist');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  activeTab === 'checklist'
                    ? 'text-cyan-400 bg-cyan-950/40 border border-cyan-800/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900'
                }`}
              >
                Doc Checklist
              </button>
            </nav>
          )}

          {/* Right Action Bar */}
          <div className="flex items-center gap-3">
            {/* Global Jurisdiction & Currency Switcher */}
            <div className="relative group">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-xs font-medium text-slate-200 hover:border-cyan-500/50 cursor-pointer">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                <span>{currentJ.flag}</span>
                <span className="font-mono text-cyan-300 font-semibold">{currentJ.currency}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
              <div className="absolute right-0 top-full mt-1.5 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 hidden group-hover:block z-50">
                <div className="text-[11px] font-semibold text-slate-400 px-2.5 py-1 uppercase tracking-wider">
                  Select Jurisdiction & Currency
                </div>
                {Object.values(JURISDICTIONS).map((j) => (
                  <button
                    key={j.code}
                    onClick={() => onSelectJurisdiction(j.code)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs text-left transition-colors ${
                      currentJurisdiction === j.code
                        ? 'bg-cyan-950/80 text-cyan-300 font-semibold border border-cyan-800/60'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-base">{j.flag}</span>
                      <div>
                        <div>{j.country}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{j.regulator.split(',')[0]}</div>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-slate-200">{j.symbol} {j.currency}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* View Full Report Quick Action */}
            <button
              onClick={onOpenReportModal}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all"
            >
              <span>Sample Report</span>
            </button>

            {/* Founder Portal / Executive Suite */}
            {isPortalOpen ? (
              <button
                onClick={() => setIsPortalOpen(false)}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors"
              >
                <span>Back to Overview</span>
              </button>
            ) : (
              <button
                onClick={() => setIsPortalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{isLoggedIn ? `Portal: ${currentUser?.split(' ')[0]}` : 'Founder Portal'}</span>
                {isLoggedIn && <CheckCircle2 className="w-3 h-3 text-emerald-300" />}
              </button>
            )}
          </div>
        </div>

        {/* Mobile secondary navigation */}
        <div className="lg:hidden flex items-center gap-2 py-2 overflow-x-auto text-xs border-t border-slate-800">
          <button
            onClick={() => { setIsPortalOpen(false); setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md flex items-center gap-1 ${activeTab === 'home' && !isPortalOpen ? 'text-cyan-400 font-bold bg-slate-800' : 'text-slate-400'}`}
          >
            <Home className="w-3 h-3" />
            <span>Home</span>
          </button>
          <button
            onClick={() => {
              setIsPortalOpen(false);
              setActiveTab('services');
              const el = document.getElementById('services');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md ${activeTab === 'services' && !isPortalOpen ? 'text-cyan-400 font-bold bg-slate-800' : 'text-slate-400'}`}
          >
            Services
          </button>
          <button
            onClick={() => {
              setIsPortalOpen(false);
              setActiveTab('domains');
              const el = document.getElementById('domains');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md ${activeTab === 'domains' && !isPortalOpen ? 'text-cyan-400 font-bold bg-slate-800' : 'text-slate-400'}`}
          >
            5 Domains
          </button>
          <button
            onClick={() => {
              setIsPortalOpen(false);
              setActiveTab('stress-test');
              const el = document.getElementById('stress-test');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md ${activeTab === 'stress-test' && !isPortalOpen ? 'text-cyan-400 font-bold bg-slate-800' : 'text-slate-400'}`}
          >
            Diagnostic Test
          </button>
          <button
            onClick={() => {
              setIsPortalOpen(false);
              setActiveTab('cockpit');
              const el = document.getElementById('cockpit');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md ${activeTab === 'cockpit' && !isPortalOpen ? 'text-cyan-400 font-bold bg-slate-800' : 'text-slate-400'}`}
          >
            Live Risk Cockpit
          </button>
          <button
            onClick={() => {
              setIsPortalOpen(false);
              setActiveTab('case-study');
              const el = document.getElementById('case-study');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md ${activeTab === 'case-study' && !isPortalOpen ? 'text-cyan-400 font-bold bg-slate-800' : 'text-slate-400'}`}
          >
            Benchmarks
          </button>
          <button
            onClick={() => {
              setIsPortalOpen(false);
              setActiveTab('testimonials');
              const el = document.getElementById('testimonials');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md ${activeTab === 'testimonials' && !isPortalOpen ? 'text-cyan-400 font-bold bg-slate-800' : 'text-slate-400'}`}
          >
            Reviews
          </button>
          <button
            onClick={() => {
              setIsPortalOpen(false);
              setActiveTab('pricing');
              const el = document.getElementById('pricing');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`whitespace-nowrap px-2.5 py-1 rounded-md ${activeTab === 'pricing' && !isPortalOpen ? 'text-cyan-400 font-bold bg-slate-800' : 'text-slate-400'}`}
          >
            Engagement Models
          </button>
        </div>
      </div>
    </header>
  );
};
