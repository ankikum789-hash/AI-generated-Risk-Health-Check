import { GoogleGenAI } from '@google/genai';
import { HealthCheckReport, RiskDomainId } from '../types/risk';
import { SAMPLE_DEFAULT_REPORT } from '../data/riskData';

export async function generateAiRiskReport(
  clientName: string,
  founderCeo: string,
  domainScores: Record<RiskDomainId, { score: number; max: number; notes: string }>,
  discoveryNotes: string
): Promise<HealthCheckReport> {
  const apiKey = (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || '';

  const totalScore = Object.values(domainScores).reduce((acc, curr) => acc + curr.score, 0);
  let maturityStatus: HealthCheckReport['maturityStatus'] = 'Developing';
  if (totalScore <= 20) maturityStatus = 'Significant Gaps';
  else if (totalScore <= 40) maturityStatus = 'Developing';
  else if (totalScore <= 50) maturityStatus = 'Established';
  else maturityStatus = 'Mature';

  if (!apiKey) {
    // Return high-quality structured heuristic report tailored to inputs
    return createHeuristicReport(clientName, founderCeo, domainScores, discoveryNotes, totalScore, maturityStatus);
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `
You are acting as an elite Senior Risk Strategist for fintech & digital lending founders & CEOs.
You are compiling a formal "Detailed Risk Health Check Report" based on the following diagnostic:

Client Company: ${clientName || 'Digital Lender Inc.'}
Founder / CEO: ${founderCeo || 'Fintech Founder'}
Total Diagnostic Score: ${totalScore} / 60 (Status: ${maturityStatus})

Scores across the 5 domains (0-12 points each):
- Credit & Underwriting: ${domainScores.credit_underwriting?.score || 6}/12 (Notes: ${domainScores.credit_underwriting?.notes || 'None'})
- Fraud & Identity: ${domainScores.fraud_identity?.score || 6}/12 (Notes: ${domainScores.fraud_identity?.notes || 'None'})
- Portfolio Monitoring: ${domainScores.portfolio_monitoring?.score || 6}/12 (Notes: ${domainScores.portfolio_monitoring?.notes || 'None'})
- Risk Governance & AI Oversight: ${domainScores.risk_governance?.score || 6}/12 (Notes: ${domainScores.risk_governance?.notes || 'None'})
- Scaling & New-Product Readiness: ${domainScores.scaling_readiness?.score || 6}/12 (Notes: ${domainScores.scaling_readiness?.notes || 'None'})

Client Discovery Notes / Transcript:
${discoveryNotes || 'Early stage digital lender scaling originations through 3 partner ecosystems. Overrides are increasing, fraud is checked post-disbursement.'}

Generate a strictly formatted JSON response adhering to this structure:
{
  "executiveSummary": "Concise summary for leadership highlighting overall risk posture and primary vulnerabilities.",
  "primaryVulnerability": "The single primary vulnerability threatening loan book growth.",
  "domainScores": {
    "credit_underwriting": { "maturity": "Low|Medium|High", "notes": "Specific finding" },
    "fraud_identity": { "maturity": "Low|Medium|High", "notes": "Specific finding" },
    "portfolio_monitoring": { "maturity": "Low|Medium|High", "notes": "Specific finding" },
    "risk_governance": { "maturity": "Low|Medium|High", "notes": "Specific finding" },
    "scaling_readiness": { "maturity": "Low|Medium|High", "notes": "Specific finding" }
  },
  "keyControlGaps": [
    {
      "id": "GAP-01",
      "domain": "Domain Name",
      "observation": "Exact operational leak",
      "riskImpact": "Financial / regulatory cost",
      "recommendation": "Concrete mitigation"
    }
  ],
  "roadmap": {
    "days30": [{ "action": "Action item", "owner": "Role", "impact": "Business outcome" }],
    "days60": [{ "action": "Action item", "owner": "Role", "impact": "Business outcome" }],
    "days90": [{ "action": "Action item", "owner": "Role", "impact": "Business outcome" }]
  }
}
Respond with valid JSON only.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text || '';
    const parsed = JSON.parse(text);

    return {
      clientName: clientName || 'Digital Lender',
      founderCeo: founderCeo || 'Founder & CEO',
      evaluator: 'Ankita — Risk Strategist for Fintech & Digital Lenders',
      date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      overallScore: totalScore,
      maturityStatus,
      executiveSummary: parsed.executiveSummary || SAMPLE_DEFAULT_REPORT.executiveSummary,
      primaryVulnerability: parsed.primaryVulnerability || SAMPLE_DEFAULT_REPORT.primaryVulnerability,
      domainScores: {
        credit_underwriting: {
          score: domainScores.credit_underwriting.score,
          max: 12,
          maturity: parsed.domainScores?.credit_underwriting?.maturity || 'Medium',
          notes: parsed.domainScores?.credit_underwriting?.notes || 'Credit policy rules defined but lack dynamic PSI monitoring.'
        },
        fraud_identity: {
          score: domainScores.fraud_identity.score,
          max: 12,
          maturity: parsed.domainScores?.fraud_identity?.maturity || 'Medium',
          notes: parsed.domainScores?.fraud_identity?.notes || 'Device and identity velocity rules need cross-channel enforcement.'
        },
        portfolio_monitoring: {
          score: domainScores.portfolio_monitoring.score,
          max: 12,
          maturity: parsed.domainScores?.portfolio_monitoring?.maturity || 'Low',
          notes: parsed.domainScores?.portfolio_monitoring?.notes || 'Early warning indicators need real-time merchant settlement telemetry.'
        },
        risk_governance: {
          score: domainScores.risk_governance.score,
          max: 12,
          maturity: parsed.domainScores?.risk_governance?.maturity || 'Medium',
          notes: parsed.domainScores?.risk_governance?.notes || 'Documented exception logs required for board and regulator audits.'
        },
        scaling_readiness: {
          score: domainScores.scaling_readiness.score,
          max: 12,
          maturity: parsed.domainScores?.scaling_readiness?.maturity || 'Medium',
          notes: parsed.domainScores?.scaling_readiness?.notes || 'Multi-partner routing covenants need automated risk throttling.'
        }
      },
      keyControlGaps: parsed.keyControlGaps || SAMPLE_DEFAULT_REPORT.keyControlGaps,
      roadmap: parsed.roadmap || SAMPLE_DEFAULT_REPORT.roadmap
    };
  } catch (err) {
    console.warn('Falling back to local heuristic report generator due to API error:', err);
    return createHeuristicReport(clientName, founderCeo, domainScores, discoveryNotes, totalScore, maturityStatus);
  }
}

function createHeuristicReport(
  clientName: string,
  founderCeo: string,
  domainScores: Record<RiskDomainId, { score: number; max: number; notes: string }>,
  discoveryNotes: string,
  totalScore: number,
  maturityStatus: HealthCheckReport['maturityStatus']
): HealthCheckReport {
  const cName = clientName || 'Digital Lending Cohort';
  const cLeader = founderCeo || 'Founder & CEO';

  const getMaturity = (score: number): 'Low' | 'Medium' | 'High' => {
    if (score <= 5) return 'Low';
    if (score <= 9) return 'Medium';
    return 'High';
  };

  return {
    clientName: cName,
    founderCeo: cLeader,
    evaluator: 'Ankita — Risk Strategist for Fintech & Digital Lenders',
    date: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    overallScore: totalScore,
    maturityStatus,
    executiveSummary: `${cName} is actively proving its fintech & digital origination model and expanding channel partnerships. However, as loan volumes and partner integrations multiply, the current risk-control environment displays concentrated vulnerabilities in ${domainScores.portfolio_monitoring.score < 8 ? 'portfolio monitoring and early warning' : 'underwriting drift and override governance'}. Without immediate stabilization, loan book expansion will exacerbate credit volatility and potential first-loss guarantee breaches.`,
    primaryVulnerability: discoveryNotes ? `Identified in discovery notes: ${discoveryNotes.slice(0, 140)}... Manual workarounds and lag indicators threatening scale.` : 'Absence of real-time early warning telemetry combined with rising manual override rates under partner throughput pressure.',
    domainScores: {
      credit_underwriting: {
        score: domainScores.credit_underwriting.score,
        max: 12,
        maturity: getMaturity(domainScores.credit_underwriting.score),
        notes: domainScores.credit_underwriting.notes || 'Underwriting rules operate consistently in core tiers, but manual exception volume has elevated with channel expansion.'
      },
      fraud_identity: {
        score: domainScores.fraud_identity.score,
        max: 12,
        maturity: getMaturity(domainScores.fraud_identity.score),
        notes: domainScores.fraud_identity.notes || 'Digital KYC is operational; requires device-fingerprint velocity barriers to prevent synthetic identity attacks.'
      },
      portfolio_monitoring: {
        score: domainScores.portfolio_monitoring.score,
        max: 12,
        maturity: getMaturity(domainScores.portfolio_monitoring.score),
        notes: domainScores.portfolio_monitoring.notes || 'Monitoring relies on lagging 30+ DPD buckets; daily cash-flow velocity indicators need active tracking.'
      },
      risk_governance: {
        score: domainScores.risk_governance.score,
        max: 12,
        maturity: getMaturity(domainScores.risk_governance.score),
        notes: domainScores.risk_governance.notes || 'Governance has direct founder oversight; formalize delegated authorities and AI decision log audibility.'
      },
      scaling_readiness: {
        score: domainScores.scaling_readiness.score,
        max: 12,
        maturity: getMaturity(domainScores.scaling_readiness.score),
        notes: domainScores.scaling_readiness.notes || 'Origination throughput is strong; multi-lender routing logic and collections feedback loops require hardening.'
      }
    },
    keyControlGaps: [
      {
        id: 'GAP-01',
        domain: 'Portfolio Early Warning',
        observation: 'Absence of leading cash-flow deterioration triggers across merchant borrower segments.',
        riskImpact: 'First indication of borrower distress occurs at default rather than 30 days prior during cash-flow contraction.',
        recommendation: 'Deploy dynamic bank sweep and daily settlement volatility metrics to trigger automated pre-delinquency outreach.'
      },
      {
        id: 'GAP-02',
        domain: 'Credit Underwriting',
        observation: 'Manual exception approvals exceed recommended 8% threshold without centralized reason codes.',
        riskImpact: 'Adverse selection creeps into new merchant cohorts, elevating cumulative vintage loss rates by 2.4x.',
        recommendation: 'Enforce strict 2-tier approval authorities and automate monthly override performance tracking reports.'
      },
      {
        id: 'GAP-03',
        domain: 'Fraud Controls',
        observation: 'Application-level verification lacks cross-channel device and bank-account linkage clustering.',
        riskImpact: 'Synthetic fraud rings exploit multiple affiliate partner funnels before single-channel limits trigger.',
        recommendation: 'Implement real-time device hash graph matching and velocity throttles across all digital origination endpoints.'
      },
      {
        id: 'GAP-04',
        domain: 'Scaling & Governance',
        observation: 'Collections recoveries and roll-rate learnings operate in silos separate from underwriting rule updates.',
        riskImpact: 'Underwriting models repeat approval errors in segments exhibiting poor recovery performance.',
        recommendation: 'Establish bi-weekly credit-to-collections feedback loops to automatically calibrate risk score cutoffs.'
      }
    ],
    roadmap: {
      days30: [
        { action: 'Establish centralized Delegated Lending Authority (DLA) & override reason codes', owner: 'Risk Strategist & Head of Credit', impact: 'Immediate 40% reduction in uncalibrated policy waivers' },
        { action: 'Implement cross-channel velocity limit rules on KYC & bank accounts', owner: 'Fraud Lead / Engineering', impact: 'Hard stop against organized synthetic identity sweeps' },
        { action: 'Audit top 3 partner originations for cohort default divergence', owner: 'Risk Analytics', impact: 'Isolates underperforming merchant channels' }
      ],
      days60: [
        { action: 'Build automated Vintage Delinquency & Roll-Rate tracking dashboards', owner: 'Risk Analytics & Tech', impact: 'Executive visibility into cohort deterioration' },
        { action: 'Deploy direct Account Aggregator / Open Banking bank statement pull', owner: 'Product & Tech', impact: 'Eliminates document manipulation & PDF forgery risk' },
        { action: 'Establish formal monthly Risk & Credit Policy Committee', owner: 'CEO, CRO & Board Liaison', impact: 'Regulatory-grade risk governance before next financing round' }
      ],
      days90: [
        { action: 'Calibrate multi-partner credit routing engine with dynamic loss covenants', owner: 'Partnerships & Risk Lead', impact: 'Safeguards loan book growth across new ecosystem scale' },
        { action: 'Implement automated AI scorecard drift and PSI telemetry logs', owner: 'Data Science Lead', impact: 'Meets central bank explainability and compliance standards' },
        { action: 'Embed collections roll-rate feedback directly into credit scorecard weights', owner: 'Credit Policy Lead', impact: 'Dynamic self-healing underwriting framework' }
      ]
    }
  };
}
