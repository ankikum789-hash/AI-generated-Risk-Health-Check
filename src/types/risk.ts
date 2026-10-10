export type RiskDomainId = 
  | 'credit_underwriting'
  | 'fraud_identity'
  | 'portfolio_monitoring'
  | 'risk_governance'
  | 'scaling_readiness';

export interface DiagnosticQuestion {
  id: string;
  domainId: RiskDomainId;
  text: string;
  evidencePrompt: string;
  potentialBlindSpot?: string;
}

export interface DomainMeta {
  id: RiskDomainId;
  name: string;
  subtitle: string;
  keyRiskSignal: string;
  icon: string;
  description: string;
  evidenceSignals: string[];
}

export interface FraudAlert {
  id: string;
  timestamp: string;
  title: string;
  domain: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  description: string;
  metric: string;
  status: 'active' | 'investigating' | 'mitigated';
  recommendedAction: string;
  borrowerCohort: string;
}

export interface StressTestScenario {
  id: string;
  name: string;
  macroDownturnPct: number; // e.g. +15%
  partnerDefaultSurgePct: number; // e.g. +25%
  fraudMultiplier: number; // e.g. 1.8x
  collectionsEfficiencyDropPct: number; // e.g. -20%
}

export type JurisdictionCode = 'US' | 'SG' | 'UK' | 'IN' | 'AE';

export interface JurisdictionConfig {
  code: JurisdictionCode;
  country: string;
  flag: string;
  currency: string;
  symbol: string;
  rateToUsd: number;
  regulator: string;
  keyComplianceFocus: string;
  pricingTiers: {
    free: { min: number; max: number; label: string };
    starter: { min: number; max: number; label: string };
    detailed: { min: number; max: number; label: string };
    implementation: { min: number; max: number; label: string };
    retainer: { min: number; max: number; label: string; period: string };
  };
}

export interface HealthCheckReport {
  clientName: string;
  founderCeo: string;
  evaluator: string;
  date: string;
  overallScore: number;
  maturityStatus: 'Significant Gaps' | 'Developing' | 'Established' | 'Mature';
  executiveSummary: string;
  primaryVulnerability: string;
  domainScores: Record<RiskDomainId, { score: number; max: number; maturity: 'Low' | 'Medium' | 'High'; notes: string }>;
  keyControlGaps: Array<{
    id: string;
    domain: string;
    observation: string;
    riskImpact: string;
    recommendation: string;
  }>;
  roadmap: {
    days30: Array<{ action: string; owner: string; impact: string }>;
    days60: Array<{ action: string; owner: string; impact: string }>;
    days90: Array<{ action: string; owner: string; impact: string }>;
  };
}

export interface FounderLeadMagnet {
  id: string;
  companyName: string;
  founderCeo: string;
  lendingModel: string;
  disbursements: string;
  targetGeography: string;
  anchorPartners: string;
  status: 'Draft Diagnostic' | 'Evidence Review' | 'Completed Health Check';
  totalScore: number;
  maturityStatus: 'Significant Gaps' | 'Developing' | 'Established' | 'Mature';
  executiveLens: string;
  fiveAreasToWatch: string[];
  scalingTriggers: Array<{
    trigger: string;
    controlQuestion: string;
    whyItMatters: string;
  }>;
  fourPriorities: Array<{
    number: string;
    title: string;
    description: string;
  }>;
  report: HealthCheckReport;
}

export interface N8nWorkflowNode {
  id: string;
  name: string;
  type: string;
  description: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  executionTimeMs?: number;
  outputSummary?: string;
}
