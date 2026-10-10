import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { FiveDomainsSection } from './components/FiveDomainsSection';
import { LiveRiskCockpit } from './components/LiveRiskCockpit';
import { DiagnosticStressTest } from './components/DiagnosticStressTest';
import { FounderDiagnosticHub } from './components/FounderDiagnosticHub';
import { PricingJurisdictionSection } from './components/PricingJurisdictionSection';
import { DocumentChecklistSection } from './components/DocumentChecklistSection';
import { TestimonialsFeedbackSection } from './components/TestimonialsFeedbackSection';
import { FounderPortal } from './components/FounderPortal';
import { ReportGeneratorModal } from './components/ReportGeneratorModal';
import { Footer } from './components/Footer';

import { JURISDICTIONS, SAMPLE_DEFAULT_REPORT } from './data/riskData';
import { JurisdictionCode, HealthCheckReport, RiskDomainId } from './types/risk';

export default function App() {
  // Jurisdiction state (default to India as highlighted in sample document, easily toggleable to US, SG, UK, Dubai)
  const [currentJurisdictionCode, setCurrentJurisdictionCode] = useState<JurisdictionCode>('IN');
  const currentJurisdiction = JURISDICTIONS[currentJurisdictionCode] || JURISDICTIONS.IN;

  // Active view tab
  const [activeTab, setActiveTab] = useState<string>('home');

  // Founder Portal state
  const [isPortalOpen, setIsPortalOpen] = useState<boolean>(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Report Modal state
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [currentReport, setCurrentReport] = useState<HealthCheckReport>(SAMPLE_DEFAULT_REPORT);

  // Notification toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleLogin = (name: string, company: string) => {
    setIsLoggedIn(true);
    setCurrentUser(`${name} (${company})`);
    showToast(`Welcome to your Executive Advisory Room, ${name}!`);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    showToast('Signed out of Executive Portal.');
  };

  const handleSelectService = (serviceName: string) => {
    if (serviceName.includes('Starter') || serviceName.includes('Detailed') || serviceName.includes('Implementation') || serviceName.includes('Advisory')) {
      setIsPortalOpen(true);
      showToast(`Selected: ${serviceName}. Scope modeler loaded in Founder Suite.`);
    }
  };

  const handleStartStressTest = () => {
    setIsPortalOpen(false);
    setActiveTab('stress-test');
    const el = document.getElementById('stress-test');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleExploreCockpit = () => {
    setIsPortalOpen(false);
    setActiveTab('cockpit');
    const el = document.getElementById('cockpit');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleGenerateReportFromScores = (
    domainScores: Record<RiskDomainId, { score: number; max: number; notes: string }>
  ) => {
    const total = Object.values(domainScores).reduce((acc, curr) => acc + curr.score, 0);
    let status: HealthCheckReport['maturityStatus'] = 'Developing';
    if (total <= 20) status = 'Significant Gaps';
    else if (total <= 40) status = 'Developing';
    else if (total <= 50) status = 'Established';
    else status = 'Mature';

    setCurrentReport(prev => ({
      ...prev,
      overallScore: total,
      maturityStatus: status,
      domainScores: {
        credit_underwriting: {
          score: domainScores.credit_underwriting.score,
          max: 12,
          maturity: domainScores.credit_underwriting.score < 6 ? 'Low' : domainScores.credit_underwriting.score < 10 ? 'Medium' : 'High',
          notes: domainScores.credit_underwriting.score < 8 ? 'Manual override rate elevated; credit policy rules need PSI tracking.' : 'Solid rule consistency across merchant channels.'
        },
        fraud_identity: {
          score: domainScores.fraud_identity.score,
          max: 12,
          maturity: domainScores.fraud_identity.score < 6 ? 'Low' : domainScores.fraud_identity.score < 10 ? 'Medium' : 'High',
          notes: domainScores.fraud_identity.score < 8 ? 'Identity checks lack cross-channel device link clustering.' : 'Biometric and digital KYB operational.'
        },
        portfolio_monitoring: {
          score: domainScores.portfolio_monitoring.score,
          max: 12,
          maturity: domainScores.portfolio_monitoring.score < 6 ? 'Low' : domainScores.portfolio_monitoring.score < 10 ? 'Medium' : 'High',
          notes: domainScores.portfolio_monitoring.score < 8 ? 'Relies on lag 30+ DPD; needs real-time cash flow early warning indicators.' : 'Cohort vintage delinquency tracking active.'
        },
        risk_governance: {
          score: domainScores.risk_governance.score,
          max: 12,
          maturity: domainScores.risk_governance.score < 6 ? 'Low' : domainScores.risk_governance.score < 10 ? 'Medium' : 'High',
          notes: domainScores.risk_governance.score < 8 ? 'Formal DLA hierarchy and AI decision audit trails required.' : 'Risk committee cadence active.'
        },
        scaling_readiness: {
          score: domainScores.scaling_readiness.score,
          max: 12,
          maturity: domainScores.scaling_readiness.score < 6 ? 'Low' : domainScores.scaling_readiness.score < 10 ? 'Medium' : 'High',
          notes: domainScores.scaling_readiness.score < 8 ? 'Multi-lender routing logic and collections feedback loop need calibration.' : 'Channel capacity validated for 3x expansion.'
        }
      }
    }));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        currentJurisdiction={currentJurisdictionCode}
        onSelectJurisdiction={(code) => {
          setCurrentJurisdictionCode(code);
          showToast(`Jurisdiction switched to ${JURISDICTIONS[code].country} (${JURISDICTIONS[code].currency})`);
        }}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setIsPortalOpen(false);
          setActiveTab(tab);
          if (tab === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          const targetId = tab === 'overview' ? 'services' : tab;
          const el = document.getElementById(targetId);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        isPortalOpen={isPortalOpen}
        setIsPortalOpen={setIsPortalOpen}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-xl bg-cyan-950/90 border border-cyan-700 text-cyan-200 text-xs shadow-2xl backdrop-blur-md animate-fade-in flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {isPortalOpen ? (
          /* PRIVATE FOUNDER SUITE VIEW */
          <FounderPortal
            isOpen={isPortalOpen}
            onClose={() => setIsPortalOpen(false)}
            isLoggedIn={isLoggedIn}
            currentUser={currentUser}
            onLogin={handleLogin}
            onLogout={handleLogout}
            currentJurisdiction={currentJurisdiction}
            onSelectJurisdiction={setCurrentJurisdictionCode}
            onOpenReportModal={() => setIsReportModalOpen(true)}
          />
        ) : (
          /* PUBLIC EXTERIOR SITE (CODOPILOT / ADVISORY STYLE) */
          <>
            {/* 1. Hero Section */}
            <Hero
              onStartStressTest={handleStartStressTest}
              onExploreCockpit={handleExploreCockpit}
              onOpenReportModal={() => setIsReportModalOpen(true)}
              currentJurisdiction={currentJurisdiction}
            />

            {/* 2. Services Section (Codopilot-style exterior presentation) */}
            <ServicesSection
              currentJurisdiction={currentJurisdiction}
              onSelectService={handleSelectService}
              onStartStressTest={handleStartStressTest}
              onOpenFounderPortal={() => setIsPortalOpen(true)}
            />

            {/* 3. The 5 Domains of Lending Risk Health */}
            <FiveDomainsSection
              onStartStressTestForDomain={() => handleStartStressTest()}
              onOpenReportWithGeneratedData={(rep) => {
                setCurrentReport(rep);
                setIsReportModalOpen(true);
              }}
            />

            {/* 4. Live Risk Cockpit: Real-time fraud detection & predictive stress testing */}
            <LiveRiskCockpit
              currentJurisdiction={currentJurisdiction}
              onOpenReportModal={() => setIsReportModalOpen(true)}
            />

            {/* 5. Interactive 20-Question Stress Test Diagnostic */}
            <DiagnosticStressTest
              onOpenReportModal={() => setIsReportModalOpen(true)}
              onGenerateReportFromScores={handleGenerateReportFromScores}
            />

            {/* 6. Dynamic Multi-Founder Lead Magnet & Diagnostic Hub */}
            <FounderDiagnosticHub
              onOpenReportModalWithData={(rep) => {
                setCurrentReport(rep);
                setIsReportModalOpen(true);
              }}
              onOpenFounderPortal={() => setIsPortalOpen(true)}
            />

            {/* 7. Founder Testimonials & Client Review Hub */}
            <TestimonialsFeedbackSection
              currentJurisdiction={currentJurisdiction}
              onOpenFounderPortal={() => setIsPortalOpen(true)}
              onOpenReportModal={() => setIsReportModalOpen(true)}
            />

            {/* 8. Pricing & Global Regulatory Jurisdictions (US, SG, UK, IN, Dubai) */}
            <PricingJurisdictionSection
              currentJurisdiction={currentJurisdictionCode}
              onSelectJurisdiction={(code) => setCurrentJurisdictionCode(code)}
              onSelectService={handleSelectService}
              onOpenFounderPortal={() => setIsPortalOpen(true)}
            />

            {/* 8. Pre-Engagement Document Checklist */}
            <DocumentChecklistSection />
          </>
        )}
      </main>

      {/* 4-Part Executive Report Modal & AI Fast-Draft Copilot */}
      <ReportGeneratorModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        initialReport={currentReport}
      />

      {/* Footer */}
      <Footer
        currentJurisdiction={currentJurisdiction}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onOpenFounderPortal={() => setIsPortalOpen(true)}
      />
    </div>
  );
}
