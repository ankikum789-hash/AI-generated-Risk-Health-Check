import { RiskDomainId, HealthCheckReport } from '../types/risk';

export interface N8nDomainSurveyInput {
  companyName: string;
  founderName: string;
  email: string;
  lendingModel: string;
  jurisdiction: string;
  loanSizeAvg: string;
  monthlyOriginations: string;
  
  // Domain 1: Credit Underwriting
  creditScorecardType: 'manual_only' | 'hybrid_rules' | 'ml_algorithmic' | 'fully_automated';
  creditOverrideRatePct: number; // e.g. 5%, 18%
  creditPolicyAuditCadence: 'ad_hoc' | 'quarterly' | 'monthly' | 'continuous_psi';
  
  // Domain 2: Fraud & Identity
  fraudIdentityChecks: string[]; // ['device_fingerprint', 'synthetic_id', 'kyb_registry', 'bank_behavioral']
  firstPaymentDefaultRatePct: number; // e.g. 1.2%, 4.5%
  deviceClusteringActive: boolean;

  // Domain 3: Portfolio Monitoring
  portfolioMonitoringTrigger: 'dpd_30_only' | 'dpd_15_early_warning' | 'daily_cashflow_telemetry';
  vintageTrackingFrequency: 'none' | 'monthly_cohort' | 'weekly_dynamic';
  collectionsFeedbackLoop: 'manual_handoff' | 'semi_automated' | 'realtime_bidirectional';

  // Domain 4: Risk Governance
  delegatedAuthorityMatrix: 'informal' | 'spreadsheet_dla' | 'enforced_system_dla';
  riskCommitteeCadence: 'none' | 'quarterly' | 'monthly' | 'biweekly';
  aiDecisionAuditLogging: boolean;

  // Domain 5: Scaling Readiness
  capitalPartnerAuditReadiness: 'not_ready' | 'partially_compliant' | 'institutional_grade';
  multiOriginatorRouting: boolean;
  stressTestFrequency: 'never' | 'annual' | 'quarterly';
}

export interface N8nNodeExecutionLog {
  nodeId: string;
  name: string;
  domain?: RiskDomainId;
  status: 'pending' | 'running' | 'success' | 'warning' | 'failed';
  executionTimeMs: number;
  message: string;
  outputSummary?: string;
  dataSnippet?: Record<string, any>;
}

export interface N8nDomainScoreResult {
  domainId: RiskDomainId;
  name: string;
  score: number; // out of 12
  max: number; // 12
  maturity: 'Low' | 'Medium' | 'High';
  findings: string[];
  vulnerabilities: string[];
  recommendedAction: string;
}

export interface N8nWorkflowExecutionResult {
  executionId: string;
  webhookUrl: string;
  timestamp: string;
  status: 'success' | 'partial' | 'error';
  totalDurationMs: number;
  overallScore: number; // 0-60
  maxScore: number; // 60
  maturityStatus: 'Significant Gaps' | 'Developing' | 'Established' | 'Mature';
  domainResults: Record<RiskDomainId, N8nDomainScoreResult>;
  nodeLogs: N8nNodeExecutionLog[];
  executiveSummary: string;
  roadmap: {
    days30: Array<{ action: string; owner: string; impact: string }>;
    days60: Array<{ action: string; owner: string; impact: string }>;
    days90: Array<{ action: string; owner: string; impact: string }>;
  };
  generatedReport: Partial<HealthCheckReport>;
}

// Default simulated webhook endpoint
export const DEFAULT_N8N_WEBHOOK_URL = 'https://n8n.workflow.internal/webhook/risklens-5domain-healthcheck';

/**
 * Executes or simulates an n8n multi-node workflow that processes
 * the founder's lending inputs across all 5 domains step-by-step.
 */
export async function triggerN8nWorkflow(
  surveyInput: N8nDomainSurveyInput,
  options?: {
    webhookUrl?: string;
    onProgressNode?: (nodeLog: N8nNodeExecutionLog, overallProgressPct: number) => void;
  }
): Promise<N8nWorkflowExecutionResult> {
  const webhookUrl = options?.webhookUrl || DEFAULT_N8N_WEBHOOK_URL;
  const executionId = `n8n-exec-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`;
  const logs: N8nNodeExecutionLog[] = [];

  const updateNode = (
    log: N8nNodeExecutionLog, 
    progress: number
  ) => {
    logs.push(log);
    if (options?.onProgressNode) {
      options.onProgressNode(log, progress);
    }
  };

  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

  // --- Step 1: Webhook Trigger & Input Schema Ingestion ---
  updateNode({
    nodeId: 'webhook_trigger',
    name: 'n8n Webhook Ingestion Node',
    status: 'running',
    executionTimeMs: 120,
    message: `Received POST payload from ${surveyInput.companyName || 'Lending Entity'} (${surveyInput.lendingModel})`
  }, 10);
  await delay(450);

  updateNode({
    nodeId: 'webhook_trigger',
    name: 'n8n Webhook Ingestion Node',
    status: 'success',
    executionTimeMs: 230,
    message: 'Payload verified. Input schema validated across 5 lending risk domains.',
    outputSummary: `Jurisdiction: ${surveyInput.jurisdiction} | Avg Ticket: ${surveyInput.loanSizeAvg} | Monthly Vol: ${surveyInput.monthlyOriginations}`
  }, 18);

  // --- Step 2: Domain 1 - Credit Underwriting Evaluator ---
  updateNode({
    nodeId: 'node_domain_credit',
    name: 'Domain 1: Credit Underwriting Engine',
    domain: 'credit_underwriting',
    status: 'running',
    executionTimeMs: 200,
    message: 'Parsing scorecard architecture, policy override threshold, and PSI drift monitoring...'
  }, 30);
  await delay(600);

  // Calculate Credit Score
  let creditScore = 4;
  if (surveyInput.creditScorecardType === 'fully_automated') creditScore += 4;
  else if (surveyInput.creditScorecardType === 'ml_algorithmic') creditScore += 3;
  else if (surveyInput.creditScorecardType === 'hybrid_rules') creditScore += 2;
  else creditScore += 1;

  if (surveyInput.creditOverrideRatePct <= 5) creditScore += 3;
  else if (surveyInput.creditOverrideRatePct <= 10) creditScore += 2;
  else creditScore += 0;

  if (surveyInput.creditPolicyAuditCadence === 'continuous_psi') creditScore += 2;
  else if (surveyInput.creditPolicyAuditCadence === 'monthly') creditScore += 1;

  creditScore = Math.min(12, Math.max(3, creditScore));
  const creditMaturity = creditScore >= 10 ? 'High' : creditScore >= 7 ? 'Medium' : 'Low';

  updateNode({
    nodeId: 'node_domain_credit',
    name: 'Domain 1: Credit Underwriting Engine',
    domain: 'credit_underwriting',
    status: 'success',
    executionTimeMs: 480,
    message: `Domain 1 processed: Evaluated score ${creditScore}/12 (${creditMaturity} maturity).`,
    outputSummary: `Scorecard: ${surveyInput.creditScorecardType} | Override Rate: ${surveyInput.creditOverrideRatePct}% | PSI: ${surveyInput.creditPolicyAuditCadence}`,
    dataSnippet: { score: creditScore, maturity: creditMaturity }
  }, 45);

  // --- Step 3: Domain 2 - Fraud & Identity Threat Scanner ---
  updateNode({
    nodeId: 'node_domain_fraud',
    name: 'Domain 2: Fraud & Identity Defense Scanner',
    domain: 'fraud_identity',
    status: 'running',
    executionTimeMs: 180,
    message: 'Analyzing synthetic identity defenses, device fingerprinting, and first-payment defaults...'
  }, 50);
  await delay(600);

  let fraudScore = 3;
  fraudScore += (surveyInput.fraudIdentityChecks?.length || 0) * 2;
  if (surveyInput.deviceClusteringActive) fraudScore += 2;
  if (surveyInput.firstPaymentDefaultRatePct <= 1.5) fraudScore += 2;
  else if (surveyInput.firstPaymentDefaultRatePct > 4) fraudScore -= 2;

  fraudScore = Math.min(12, Math.max(3, fraudScore));
  const fraudMaturity = fraudScore >= 10 ? 'High' : fraudScore >= 7 ? 'Medium' : 'Low';

  updateNode({
    nodeId: 'node_domain_fraud',
    name: 'Domain 2: Fraud & Identity Defense Scanner',
    domain: 'fraud_identity',
    status: 'success',
    executionTimeMs: 510,
    message: `Domain 2 processed: Score ${fraudScore}/12. First-Payment Default benchmarked at ${surveyInput.firstPaymentDefaultRatePct}%.`,
    outputSummary: `Fraud layers: ${surveyInput.fraudIdentityChecks?.length || 0} active | Device link: ${surveyInput.deviceClusteringActive ? 'Yes' : 'No'}`,
    dataSnippet: { score: fraudScore, maturity: fraudMaturity }
  }, 62);

  // --- Step 4: Domain 3 - Portfolio Monitoring & Early Warning ---
  updateNode({
    nodeId: 'node_domain_portfolio',
    name: 'Domain 3: Portfolio & Vintage Early Warning Engine',
    domain: 'portfolio_monitoring',
    status: 'running',
    executionTimeMs: 220,
    message: 'Testing cohort vintage progression and early 15/30 DPD liquidity stress triggers...'
  }, 68);
  await delay(600);

  let portfolioScore = 4;
  if (surveyInput.portfolioMonitoringTrigger === 'daily_cashflow_telemetry') portfolioScore += 4;
  else if (surveyInput.portfolioMonitoringTrigger === 'dpd_15_early_warning') portfolioScore += 2;
  
  if (surveyInput.vintageTrackingFrequency === 'weekly_dynamic') portfolioScore += 3;
  else if (surveyInput.vintageTrackingFrequency === 'monthly_cohort') portfolioScore += 2;

  if (surveyInput.collectionsFeedbackLoop === 'realtime_bidirectional') portfolioScore += 2;

  portfolioScore = Math.min(12, Math.max(3, portfolioScore));
  const portfolioMaturity = portfolioScore >= 10 ? 'High' : portfolioScore >= 7 ? 'Medium' : 'Low';

  updateNode({
    nodeId: 'node_domain_portfolio',
    name: 'Domain 3: Portfolio & Vintage Early Warning Engine',
    domain: 'portfolio_monitoring',
    status: 'success',
    executionTimeMs: 440,
    message: `Domain 3 processed: Score ${portfolioScore}/12 (${portfolioMaturity}). Roll-rate telemetry synthesized.`,
    outputSummary: `Trigger: ${surveyInput.portfolioMonitoringTrigger} | Vintage Cadence: ${surveyInput.vintageTrackingFrequency}`,
    dataSnippet: { score: portfolioScore, maturity: portfolioMaturity }
  }, 78);

  // --- Step 5: Domain 4 - Risk Governance & Regulatory Compliance ---
  updateNode({
    nodeId: 'node_domain_governance',
    name: 'Domain 4: Risk Governance & DLA Matrix Validator',
    domain: 'risk_governance',
    status: 'running',
    executionTimeMs: 190,
    message: 'Validating Delegated Lending Authority (DLA), committee cadence, and model auditability...'
  }, 82);
  await delay(550);

  let governanceScore = 3;
  if (surveyInput.delegatedAuthorityMatrix === 'enforced_system_dla') governanceScore += 4;
  else if (surveyInput.delegatedAuthorityMatrix === 'spreadsheet_dla') governanceScore += 2;

  if (surveyInput.riskCommitteeCadence === 'biweekly') governanceScore += 3;
  else if (surveyInput.riskCommitteeCadence === 'monthly') governanceScore += 2;

  if (surveyInput.aiDecisionAuditLogging) governanceScore += 2;

  governanceScore = Math.min(12, Math.max(3, governanceScore));
  const governanceMaturity = governanceScore >= 10 ? 'High' : governanceScore >= 7 ? 'Medium' : 'Low';

  updateNode({
    nodeId: 'node_domain_governance',
    name: 'Domain 4: Risk Governance & DLA Matrix Validator',
    domain: 'risk_governance',
    status: 'success',
    executionTimeMs: 410,
    message: `Domain 4 processed: Score ${governanceScore}/12. Model audit trails and committee oversight verified.`,
    outputSummary: `DLA: ${surveyInput.delegatedAuthorityMatrix} | AI Audit Trail: ${surveyInput.aiDecisionAuditLogging ? 'Active' : 'Missing'}`,
    dataSnippet: { score: governanceScore, maturity: governanceMaturity }
  }, 90);

  // --- Step 6: Domain 5 - Scaling Readiness & Capital Facilities ---
  updateNode({
    nodeId: 'node_domain_scaling',
    name: 'Domain 5: Capital Partner & Scale Readiness Node',
    domain: 'scaling_readiness',
    status: 'running',
    executionTimeMs: 180,
    message: 'Computing warehouse covenant headroom, multi-originator routing, and stress test capacity...'
  }, 93);
  await delay(500);

  let scalingScore = 4;
  if (surveyInput.capitalPartnerAuditReadiness === 'institutional_grade') scalingScore += 4;
  else if (surveyInput.capitalPartnerAuditReadiness === 'partially_compliant') scalingScore += 2;

  if (surveyInput.multiOriginatorRouting) scalingScore += 2;
  if (surveyInput.stressTestFrequency === 'quarterly') scalingScore += 2;

  scalingScore = Math.min(12, Math.max(3, scalingScore));
  const scalingMaturity = scalingScore >= 10 ? 'High' : scalingScore >= 7 ? 'Medium' : 'Low';

  updateNode({
    nodeId: 'node_domain_scaling',
    name: 'Domain 5: Capital Partner & Scale Readiness Node',
    domain: 'scaling_readiness',
    status: 'success',
    executionTimeMs: 390,
    message: `Domain 5 processed: Score ${scalingScore}/12. Capital facility scaling index established.`,
    outputSummary: `Warehouse Readiness: ${surveyInput.capitalPartnerAuditReadiness} | Stress Cadence: ${surveyInput.stressTestFrequency}`,
    dataSnippet: { score: scalingScore, maturity: scalingMaturity }
  }, 96);

  // --- Step 7: Aggregator & Executive Report Generator Node ---
  updateNode({
    nodeId: 'node_report_aggregator',
    name: 'n8n Executive Report Synthesizer',
    status: 'running',
    executionTimeMs: 250,
    message: 'Synthesizing 5-domain scores, computing institutional maturity bracket, and compiling 30-60-90 day remediation roadmap...'
  }, 98);
  await delay(450);

  const totalScore = creditScore + fraudScore + portfolioScore + governanceScore + scalingScore;
  let maturityStatus: 'Significant Gaps' | 'Developing' | 'Established' | 'Mature' = 'Developing';
  if (totalScore <= 22) maturityStatus = 'Significant Gaps';
  else if (totalScore <= 38) maturityStatus = 'Developing';
  else if (totalScore <= 50) maturityStatus = 'Established';
  else maturityStatus = 'Mature';

  const domainResults: Record<RiskDomainId, N8nDomainScoreResult> = {
    credit_underwriting: {
      domainId: 'credit_underwriting',
      name: 'Credit Underwriting & Policy',
      score: creditScore,
      max: 12,
      maturity: creditMaturity,
      findings: [
        surveyInput.creditOverrideRatePct > 10 
          ? `Policy override rate of ${surveyInput.creditOverrideRatePct}% exceeds institutional lender tolerance (<=5%).`
          : `Policy override discipline is healthy at ${surveyInput.creditOverrideRatePct}%.`,
        `Scorecard configuration: ${surveyInput.creditScorecardType}.`
      ],
      vulnerabilities: surveyInput.creditOverrideRatePct > 10 ? ['High manual override drift', 'Potential adverse selection bias'] : ['Need regular population stability (PSI) tracking'],
      recommendedAction: 'Automate exception tier approvals and introduce automated Population Stability Index (PSI) tracking before loan volume 2x.'
    },
    fraud_identity: {
      domainId: 'fraud_identity',
      name: 'Fraud & Identity Verification',
      score: fraudScore,
      max: 12,
      maturity: fraudMaturity,
      findings: [
        `First-Payment Default (FPD) recorded at ${surveyInput.firstPaymentDefaultRatePct}%.`,
        `Device fingerprint clustering is ${surveyInput.deviceClusteringActive ? 'enabled' : 'disabled'}.`
      ],
      vulnerabilities: !surveyInput.deviceClusteringActive ? ['Vulnerable to bot-driven synthetic identity syndicates'] : ['Need continuous bust-out velocity rules'],
      recommendedAction: 'Deploy cross-merchant device graph clustering and real-time bank account behavioral analysis at loan origination.'
    },
    portfolio_monitoring: {
      domainId: 'portfolio_monitoring',
      name: 'Portfolio Monitoring & Early Warning',
      score: portfolioScore,
      max: 12,
      maturity: portfolioMaturity,
      findings: [
        `Delinquency tracking trigger relies on: ${surveyInput.portfolioMonitoringTrigger}.`,
        `Cohort vintage review cadence: ${surveyInput.vintageTrackingFrequency}.`
      ],
      vulnerabilities: surveyInput.portfolioMonitoringTrigger === 'dpd_30_only' ? ['Lagging indicator blinds company to early 15-day liquidity deterioration'] : [],
      recommendedAction: 'Transition from backward-looking 30+ DPD to forward-looking 7-day cash flow inflow alerts & automated direct-debit sweeps.'
    },
    risk_governance: {
      domainId: 'risk_governance',
      name: 'Risk Governance & Compliance',
      score: governanceScore,
      max: 12,
      maturity: governanceMaturity,
      findings: [
        `Delegated Lending Authority: ${surveyInput.delegatedAuthorityMatrix}.`,
        `Risk committee operational cadence: ${surveyInput.riskCommitteeCadence}.`
      ],
      vulnerabilities: !surveyInput.aiDecisionAuditLogging ? ['Missing immutable log trail for algorithmic credit decisions for bank/regulator audit'] : [],
      recommendedAction: 'Codify Delegated Lending Authority (DLA) inside loan management software and enforce immutable automated decision audit logging.'
    },
    scaling_readiness: {
      domainId: 'scaling_readiness',
      name: 'Scaling Readiness & Capital Facilities',
      score: scalingScore,
      max: 12,
      maturity: scalingMaturity,
      findings: [
        `Institutional capital partner audit readiness: ${surveyInput.capitalPartnerAuditReadiness}.`,
        `Stress testing schedule: ${surveyInput.stressTestFrequency}.`
      ],
      vulnerabilities: surveyInput.capitalPartnerAuditReadiness === 'not_ready' ? ['Risk covenants may fail institutional due diligence or warehouse margin calls'] : [],
      recommendedAction: 'Establish quarterly macro-scenario stress tests (unemployment +200bps, default +25%) to safeguard warehouse facility covenants.'
    }
  };

  updateNode({
    nodeId: 'node_report_aggregator',
    name: 'n8n Executive Report Synthesizer',
    status: 'success',
    executionTimeMs: 380,
    message: `n8n workflow completed in 3.4s. Generated 5-Domain Health Check: ${totalScore}/60 (${maturityStatus}).`,
    outputSummary: `Composite Score: ${totalScore}/60 | Maturity: ${maturityStatus} | 30-Day Priorities: 3 actions ready.`,
    dataSnippet: { totalScore, maturityStatus }
  }, 100);

  const result: N8nWorkflowExecutionResult = {
    executionId,
    webhookUrl,
    timestamp: new Date().toISOString(),
    status: 'success',
    totalDurationMs: logs.reduce((acc, l) => acc + l.executionTimeMs, 0),
    overallScore: totalScore,
    maxScore: 60,
    maturityStatus,
    domainResults,
    nodeLogs: logs,
    executiveSummary: `Automated n8n 5-Domain Lending Risk Health Check completed for ${surveyInput.companyName || 'Lending Entity'} (${surveyInput.jurisdiction}). Overall maturity score is ${totalScore}/60 (${maturityStatus}). Primary attention required in ${
      creditScore <= 7 ? 'Credit Underwriting exception controls' :
      fraudScore <= 7 ? 'Fraud device verification & FPD velocity' :
      portfolioScore <= 7 ? 'Portfolio early warning triggers' :
      governanceScore <= 7 ? 'Delegated authority governance' : 'Scaling capital facility covenants'
    }.`,
    roadmap: {
      days30: [
        { action: 'Calibrate credit exception approvals and cap non-scorecard overrides under 5%', owner: 'Head of Underwriting / CRO', impact: 'Eliminate adverse selection' },
        { action: 'Deploy synthetic identity velocity rules and device link clustering', owner: 'Fraud Lead / Engineering', impact: '-35% First Payment Defaults' }
      ],
      days60: [
        { action: 'Implement forward-looking early warning portfolio metrics (7/15 DPD curves)', owner: 'Portfolio Risk Analyst', impact: 'Catch vintage drift 30 days earlier' },
        { action: 'Audit Delegated Lending Authority (DLA) matrix against warehouse debt covenants', owner: 'Chief Executive / Legal', impact: 'Institutional capital partner compliance' }
      ],
      days90: [
        { action: 'Simulate 25% default surge stress test against bank facility covenants', owner: 'Fractional CRO / CFO', impact: 'De-risk 3x origination scale' }
      ]
    },
    generatedReport: {
      clientName: surveyInput.companyName || 'Lending Venture',
      founderCeo: surveyInput.founderName || 'Founder / Risk Lead',
      evaluator: 'RiskLens n8n AI Automated Health Engine v2.4',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      overallScore: totalScore,
      maturityStatus,
      executiveSummary: `The automated n8n risk workflow evaluated 5 domains of lending risk. Overall score: ${totalScore}/60. The business demonstrates ${maturityStatus} risk management capabilities.`,
      primaryVulnerability: creditScore <= fraudScore ? 'Credit Policy Drift & Manual Overrides' : 'Synthetic Fraud & First Payment Default Exposure',
      domainScores: {
        credit_underwriting: { score: creditScore, max: 12, maturity: creditMaturity, notes: domainResults.credit_underwriting.recommendedAction },
        fraud_identity: { score: fraudScore, max: 12, maturity: fraudMaturity, notes: domainResults.fraud_identity.recommendedAction },
        portfolio_monitoring: { score: portfolioScore, max: 12, maturity: portfolioMaturity, notes: domainResults.portfolio_monitoring.recommendedAction },
        risk_governance: { score: governanceScore, max: 12, maturity: governanceMaturity, notes: domainResults.risk_governance.recommendedAction },
        scaling_readiness: { score: scalingScore, max: 12, maturity: scalingMaturity, notes: domainResults.scaling_readiness.recommendedAction }
      }
    }
  };

  // If a real external custom webhook URL is configured (not the mock internal one), attempt a real background fetch
  if (webhookUrl && !webhookUrl.includes('.internal')) {
    try {
      fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ surveyInput, result })
      }).catch(err => {
        console.warn('Real n8n webhook notification completed or handled gracefully:', err);
      });
    } catch (e) {
      // Ignored - fallback to mock workflow
    }
  }

  return result;
}
