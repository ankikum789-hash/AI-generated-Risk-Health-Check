import { 
  RiskDomainId, 
  DomainMeta, 
  DiagnosticQuestion, 
  JurisdictionConfig, 
  FraudAlert,
  HealthCheckReport,
  FounderLeadMagnet,
  N8nWorkflowNode
} from '../types/risk';

export const RISK_DOMAINS: DomainMeta[] = [
  {
    id: 'credit_underwriting',
    name: 'Credit & Underwriting Controls',
    subtitle: 'Consistency, drift tracking & exception discipline',
    icon: 'ShieldCheck',
    keyRiskSignal: 'New products or borrower segments launch before underwriting controls are sufficiently validated.',
    description: 'Examines whether credit policies are clearly defined, rules are applied consistently across channels, models are monitored for drift, and manual overrides remain auditable.',
    evidenceSignals: [
      'Credit policy rules & scorecard documentation',
      'Model version controls & drift tracking logs',
      'Alternative data source validation (cash flow/GST/bureau)',
      'Decision reason code capture & exception override logs',
      'Cohort delinquency performance by approval tier'
    ]
  },
  {
    id: 'fraud_identity',
    name: 'Fraud & Identity Controls',
    subtitle: 'Synthetic IDs, device intelligence & anomaly detection',
    icon: 'Fingerprint',
    keyRiskSignal: 'Fraud controls remain static while acquisition channels, products, or borrower behavior change.',
    description: 'Evaluates multi-layered defense against synthetic identities, first-party fraud, device fingerprint clustering, velocity spikes, and partner-originated anomalies before loan funding.',
    evidenceSignals: [
      'KYC/KYB digital verification & liveness checkpoints',
      'Entity deduplication & bank account-device link graphs',
      'Origination velocity anomaly triggers & IP geo-fencing',
      'Synthetic ID and manipulated bank statement detection',
      'Fraud alert triage SLA & escalation paths'
    ]
  },
  {
    id: 'portfolio_monitoring',
    name: 'Portfolio Monitoring & Early Warning',
    subtitle: 'Leading delinquency signals vs lagging overdue metrics',
    icon: 'LineChart',
    keyRiskSignal: 'Problems become visible through delinquency/default data before risk teams have actionable early-warning signals.',
    description: 'Tracks loan deterioration proactively using vintage curves, transaction velocity, cash-flow drops, roll rates, and merchant concentration before loans hit 30+ DPD.',
    evidenceSignals: [
      'Vintage & cohort repayment performance tables',
      'Cash-flow & settlement trend deterioration indicators',
      'Roll-rate transition matrices (Current -> 30 -> 60 -> 90 DPD)',
      'Partner/anchor merchant exposure concentration limits',
      'Automated breach notifications & remedial action triggers'
    ]
  },
  {
    id: 'risk_governance',
    name: 'Risk Governance & AI Oversight',
    subtitle: 'Decision traceability, versioning & auditability',
    icon: 'FileText',
    keyRiskSignal: 'Product growth moves faster than risk-policy updates, accountability, and escalation mechanisms.',
    description: 'Ensures clear risk ownership across leadership, rapid policy change approvals, full audit trails for automated and AI-assisted decisions, and formal committee oversight.',
    evidenceSignals: [
      'Risk RACI matrix & sign-off authority hierarchies',
      'AI/ML decision traceability & reason-code logging',
      'Model governance, backtesting logs & human-in-the-loop triggers',
      'Policy exception escalation logs and board-level reporting',
      'Third-party technology and model vendor audit records'
    ]
  },
  {
    id: 'scaling_readiness',
    name: 'Scaling & New-Product Readiness',
    subtitle: 'Multi-partner routing & embedded lending architecture',
    icon: 'Rocket',
    keyRiskSignal: 'A product can technically launch before the surrounding risk-control framework is ready to scale.',
    description: 'Validates whether risk architecture can scale alongside merchant ecosystems, higher funnel throughput, and multi-lender routing without degrading credit quality.',
    evidenceSignals: [
      'New product/channel pre-launch risk assessment checklists',
      'Lender-routing logic & eligibility rule alignment',
      'Stress-tested origination capacity & throughput headroom',
      'Merchant ecosystem health checks & co-lending covenant tracking',
      'Feedback loops from collections intelligence into credit underwriting'
    ]
  }
];

export const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  // 1. Credit & Underwriting Controls (0-3 each)
  {
    id: 'cu_1',
    domainId: 'credit_underwriting',
    text: 'Credit policy is clearly defined for each lending product',
    evidencePrompt: 'Check policy documents, eligibility rules, and documented cutoff thresholds per product/segment.',
    potentialBlindSpot: 'Ambiguous policy rules open to subjective manual interpretation.'
  },
  {
    id: 'cu_2',
    domainId: 'credit_underwriting',
    text: 'Eligibility and risk-based decision rules are consistently applied',
    evidencePrompt: 'Audit decision engine logs vs manual inputs across digital channels and partner integrations.',
    potentialBlindSpot: 'Channel-specific variations causing unintended adverse selection.'
  },
  {
    id: 'cu_3',
    domainId: 'credit_underwriting',
    text: 'Credit models and rules are monitored for drift and performance',
    evidencePrompt: 'Review PSI (Population Stability Index), CSI (Characteristic Stability Index), and approval distribution trends.',
    potentialBlindSpot: 'Scorecard decay silently increasing portfolio default risk.'
  },
  {
    id: 'cu_4',
    domainId: 'credit_underwriting',
    text: 'Manual overrides and exceptions are tracked, approved, and reviewed',
    evidencePrompt: 'Examine override log, reason codes, approval seniority, and performance of overridden accounts.',
    potentialBlindSpot: 'High override rate diluting underwriting model efficacy.'
  },

  // 2. Fraud Controls (0-3 each)
  {
    id: 'fc_1',
    domainId: 'fraud_identity',
    text: 'Identity/KYC and application-fraud controls are integrated into origination',
    evidencePrompt: 'Inspect digital KYC/KYB flow, document tampering detection, and identity liveness checks.',
    potentialBlindSpot: 'Friction reduction leading to compromised identity verification.'
  },
  {
    id: 'fc_2',
    domainId: 'fraud_identity',
    text: 'Fraud signals are evaluated before credit approval and loan funding',
    evidencePrompt: 'Verify if fraud scoring gates credit underwriting or if disbursements occur before fraud checks complete.',
    potentialBlindSpot: 'Disbursement speed prioritized over thorough fraud screening.'
  },
  {
    id: 'fc_3',
    domainId: 'fraud_identity',
    text: 'Repeat/fraudulent borrower and device/account patterns are monitored',
    evidencePrompt: 'Check device fingerprinting, shared bank account clusters, and velocity anomaly detection.',
    potentialBlindSpot: 'Organized fraud rings exploiting single-application silos.'
  },
  {
    id: 'fc_4',
    domainId: 'fraud_identity',
    text: 'Fraud rules/models are regularly reviewed against emerging patterns',
    evidencePrompt: 'Examine cadence of rule updates following confirmed fraud incidents or new attack vectors.',
    potentialBlindSpot: 'Static fraud rules outpaced by novel synthetic identity patterns.'
  },

  // 3. Portfolio Monitoring & Early Warning (0-3 each)
  {
    id: 'pm_1',
    domainId: 'portfolio_monitoring',
    text: 'Portfolio performance is monitored by product, segment, and channel',
    evidencePrompt: 'Review granular cohort vintage analysis, partner-level default rates, and ticket size trends.',
    potentialBlindSpot: 'Aggregate health masking bleeding sub-segments or weak partner funnels.'
  },
  {
    id: 'pm_2',
    domainId: 'portfolio_monitoring',
    text: 'Early-warning indicators are defined and actively monitored',
    evidencePrompt: 'Verify tracking of leading metrics: daily settlement drop, ACH dishonors, credit limit utilization spikes.',
    potentialBlindSpot: 'Relying exclusively on 30+ DPD lagging metrics.'
  },
  {
    id: 'pm_3',
    domainId: 'portfolio_monitoring',
    text: 'Delinquency/default trends trigger documented remedial actions',
    evidencePrompt: 'Check automated triggers for limit cut, origination pause, or step-up collections outreach.',
    potentialBlindSpot: 'Delinquency detected but manual delays paralyze timely interventions.'
  },
  {
    id: 'pm_4',
    domainId: 'portfolio_monitoring',
    text: 'Concentration and exposure risks are monitored as the book scales',
    evidencePrompt: 'Audit anchor borrower exposure, industry/geography caps, and partner-level book limits.',
    potentialBlindSpot: 'Over-reliance on top 5 merchant platforms or single industry vertical.'
  },

  // 4. Risk Governance & AI Oversight (0-3 each)
  {
    id: 'rg_1',
    domainId: 'risk_governance',
    text: 'Clear ownership exists for credit, fraud, and portfolio-risk decisions',
    evidencePrompt: 'Review Risk RACI matrix, CRO/Head of Risk charter, and cross-functional sign-off authorities.',
    potentialBlindSpot: 'Ambiguous risk accountability split between product, engineering, and finance.'
  },
  {
    id: 'rg_2',
    domainId: 'risk_governance',
    text: 'Risk policies are updated when products or risk conditions change',
    evidencePrompt: 'Examine policy version history and formal risk committee review minutes.',
    potentialBlindSpot: 'Policies remain static while product growth targets accelerate.'
  },
  {
    id: 'rg_3',
    domainId: 'risk_governance',
    text: 'Exceptions and policy breaches have documented escalation processes',
    evidencePrompt: 'Check escalation paths to CEO/Board for material portfolio breaches or rogue overrides.',
    potentialBlindSpot: 'Informal verbal waivers granted without formal board or risk log visibility.'
  },
  {
    id: 'rg_4',
    domainId: 'risk_governance',
    text: 'Risk decisions have appropriate audit trails and AI explainability',
    evidencePrompt: 'Ensure every automated decision records feature weights, reason codes, model version, and inputs.',
    potentialBlindSpot: 'Black-box AI decisioning without regulatory explainability or audit trails.'
  },

  // 5. Scaling & New-Product Readiness (0-3 each)
  {
    id: 'sr_1',
    domainId: 'scaling_readiness',
    text: 'Risk controls are assessed before launching a new lending product',
    evidencePrompt: 'Inspect pre-launch sign-off checklist including collections capacity and fraud defenses.',
    potentialBlindSpot: 'Rushing go-to-market without validating post-disbursement collections readiness.'
  },
  {
    id: 'sr_2',
    domainId: 'scaling_readiness',
    text: 'New lender/partner integrations are risk-assessed before activation',
    evidencePrompt: 'Review data-sharing integrity, SLA covenants, and partner fraud liabilities.',
    potentialBlindSpot: 'Partner onboarding based purely on commercial terms without risk audit.'
  },
  {
    id: 'sr_3',
    domainId: 'scaling_readiness',
    text: 'Controls can scale with increasing application and loan volumes',
    evidencePrompt: 'Verify automated KYC/underwriting throughput headroom and manual review queue capacity.',
    potentialBlindSpot: 'Operational backlogs forcing teams to relax verification rigor under volume pressure.'
  },
  {
    id: 'sr_4',
    domainId: 'scaling_readiness',
    text: 'Risk monitoring adapts as borrower mix and portfolio behavior change',
    evidencePrompt: 'Check ongoing feedback loop from collections intelligence back into credit underwriting criteria.',
    potentialBlindSpot: 'Collections learnings not systematically feeding back into origination rules.'
  }
];

export const DISCUSSION_QUESTIONS = [
  {
    q: 'Where are exceptions increasing as lending volume grows?',
    insight: 'High override rates (>8-12%) often signal a mismatch between growth targets and credit policy, usually concentrating risk in untested borrower cohorts.'
  },
  {
    q: 'Which controls are still dependent on manual review?',
    insight: 'Manual touchpoints in document inspection or bank statement analysis become bottlenecks that break down under 3x-5x scaling surges.'
  },
  {
    q: 'Which early-warning signals are available before delinquency becomes visible?',
    insight: 'Leading indicators like daily merchant settlement dip, POS turnover velocity, and GST filing lags reveal distress 30-45 days before the first missed payment.'
  },
  {
    q: 'What changes in the risk framework when a new lending product launches?',
    insight: 'Different products (e.g., invoice discounting vs revolving merchant credit) carry distinct fraud topologies and require custom monitoring triggers.'
  },
  {
    q: 'Which risk controls are monitored continuously versus reviewed periodically?',
    insight: 'Quarterly reviews are obsolete in digital lending; synthetic fraud detection, override spikes, and cohort loss rates require near real-time telemetry.'
  }
];

export const JURISDICTIONS: Record<string, JurisdictionConfig> = {
  US: {
    code: 'US',
    country: 'United States',
    flag: '🇺🇸',
    currency: 'USD',
    symbol: '$',
    rateToUsd: 1.0,
    regulator: 'CFPB, OCC, State Banking Regulators',
    keyComplianceFocus: 'FCRA model explainability, Fair Lending (ECOA), UDAAP, E-SIGN compliance',
    pricingTiers: {
      free: { min: 0, max: 0, label: 'Free' },
      starter: { min: 500, max: 750, label: '$500 – $750' },
      detailed: { min: 1500, max: 2500, label: '$1,500 – $2,500' },
      implementation: { min: 3000, max: 5000, label: '$3,000 – $5,000+' },
      retainer: { min: 750, max: 1500, label: '$750 – $1,500', period: '/month' }
    }
  },
  IN: {
    code: 'IN',
    country: 'India',
    flag: '🇮🇳',
    currency: 'INR',
    symbol: '₹',
    rateToUsd: 87.0, // calibrated to exact prompt conversion
    regulator: 'Reserve Bank of India (RBI)',
    keyComplianceFocus: 'RBI Digital Lending Guidelines (DLG), 5% FLDG default loss guarantee caps, RE vs LSP mandates, CIBIL reporting',
    pricingTiers: {
      free: { min: 0, max: 0, label: 'Free' },
      starter: { min: 47910, max: 71865, label: '₹47,910 – ₹71,865' },
      detailed: { min: 143725, max: 239540, label: '₹143,725 – ₹239,540' },
      implementation: { min: 287450, max: 479100, label: '₹287,450 – ₹479,100+' },
      retainer: { min: 71865, max: 143725, label: '₹71,865 – ₹143,725', period: '/month' }
    }
  },
  SG: {
    code: 'SG',
    country: 'Singapore',
    flag: '🇸🇬',
    currency: 'SGD',
    symbol: 'S$',
    rateToUsd: 1.34,
    regulator: 'Monetary Authority of Singapore (MAS)',
    keyComplianceFocus: 'MAS Technology Risk Management (TRM) Guidelines, FEAT AI Fairness principles, FinTech Regulatory Sandbox',
    pricingTiers: {
      free: { min: 0, max: 0, label: 'Free' },
      starter: { min: 670, max: 1000, label: 'S$670 – S$1,000' },
      detailed: { min: 2010, max: 3350, label: 'S$2,010 – S$3,350' },
      implementation: { min: 4020, max: 6700, label: 'S$4,020 – S$6,700+' },
      retainer: { min: 1000, max: 2010, label: 'S$1,000 – S$2,010', period: '/month' }
    }
  },
  UK: {
    code: 'UK',
    country: 'United Kingdom',
    flag: '🇬🇧',
    currency: 'GBP',
    symbol: '£',
    rateToUsd: 0.80,
    regulator: 'Financial Conduct Authority (FCA)',
    keyComplianceFocus: 'FCA Consumer Duty, CONC lending rules, Open Banking AISP/PISP verification standards',
    pricingTiers: {
      free: { min: 0, max: 0, label: 'Free' },
      starter: { min: 400, max: 600, label: '£400 – £600' },
      detailed: { min: 1200, max: 2000, label: '£1,200 – £2,000' },
      implementation: { min: 2400, max: 4000, label: '£2,400 – £4,000+' },
      retainer: { min: 600, max: 1200, label: '£600 – £1,200', period: '/month' }
    }
  },
  AE: {
    code: 'AE',
    country: 'United Arab Emirates (Dubai)',
    flag: '🇦🇪',
    currency: 'AED',
    symbol: 'AED',
    rateToUsd: 3.67,
    regulator: 'DFSA (DIFC) / ADGM / Central Bank of UAE',
    keyComplianceFocus: 'DIFC Data Protection, Open Finance Framework, Crowdfunding & SME Credit Guidelines',
    pricingTiers: {
      free: { min: 0, max: 0, label: 'Free' },
      starter: { min: 1835, max: 2750, label: 'AED 1,835 – AED 2,750' },
      detailed: { min: 5500, max: 9180, label: 'AED 5,500 – AED 9,180' },
      implementation: { min: 11000, max: 18360, label: 'AED 11,000 – AED 18,360+' },
      retainer: { min: 2750, max: 5500, label: 'AED 2,750 – AED 5,500', period: '/month' }
    }
  }
};

export const INITIAL_FRAUD_ALERTS: FraudAlert[] = [
  {
    id: 'ALT-8041',
    timestamp: '2 mins ago',
    title: 'Synthetic Identity Cluster Detected',
    domain: 'Fraud Controls',
    severity: 'CRITICAL',
    description: '14 MSME loan applications submitted within 18 minutes sharing identical device hash and sequential PAN/SSN issuance series.',
    metric: 'Velocity Anomaly: 14 apps / 18 mins',
    status: 'active',
    recommendedAction: 'Instantly freeze automated approvals on Device Hash #d8f1e and require biometric facial match + GST validation.',
    borrowerCohort: 'Merchant Tier C - QSR Micro-loans'
  },
  {
    id: 'ALT-7992',
    timestamp: '14 mins ago',
    title: 'Manual Underwriting Override Spike Breached Threshold',
    domain: 'Credit & Underwriting',
    severity: 'HIGH',
    description: 'Underwriting override rate on Partner #B2-Retail spiked to 19.4% (Threshold: 8.0%). 86% of overrides granted by junior underwriters.',
    metric: 'Override Rate: 19.4% (+142% vs baseline)',
    status: 'active',
    recommendedAction: 'Enforce dual-authorization for credit exceptions > $10,000 and freeze policy waivers until CRO review.',
    borrowerCohort: 'Partner Ecosystem: RetailPay Embedded'
  },
  {
    id: 'ALT-7920',
    timestamp: '42 mins ago',
    title: 'Bank Statement Income Manipulation Pattern',
    domain: 'Fraud Controls',
    severity: 'HIGH',
    description: 'PDF structural anomaly detected across 9 uploaded bank statements. Circular fund transfers identified between linked director accounts.',
    metric: 'Circular Volume: ₹42.8L ($51.5k)',
    status: 'investigating',
    recommendedAction: 'Switch verification mode to Account Aggregator (AA) direct bank pull; suspend PDF self-upload channel.',
    borrowerCohort: 'Unsecured Working Capital Cohort 2026-Q3'
  },
  {
    id: 'ALT-7855',
    timestamp: '1 hour ago',
    title: 'Partner Concentration & Daily Repayment Drop',
    domain: 'Portfolio Monitoring',
    severity: 'MEDIUM',
    description: 'Anchor Merchant Hub-X daily POS throughput dipped 34% week-on-week, triggering leading early warning for 60-day debt service ratio.',
    metric: 'Daily Inflow Drop: -34% WoW',
    status: 'mitigated',
    recommendedAction: 'Trigger proactive covenant engagement with Hub-X treasury team and adjust dynamic daily sweep percentage.',
    borrowerCohort: 'Merchant Cash Advance (MCA) Segment'
  }
];

export const FOUNDER_LEAD_MAGNETS: FounderLeadMagnet[] = [
  {
    id: 'lm_embedded_msme',
    companyName: 'Apex Capital (Embedded MSME Finance)',
    founderCeo: 'Founder & CEO (MSME Platform)',
    lendingModel: 'Embedded MSME Merchant Cash Advance',
    disbursements: '₹25 Crore+ ($3.0M)',
    targetGeography: 'India / Southeast Asia',
    anchorPartners: '3 Anchor POS & E-Commerce Aggregators',
    status: 'Completed Health Check',
    totalScore: 38,
    maturityStatus: 'Developing',
    executiveLens: 'The platform is at an interesting transition point: from proving an embedded MSME lending model with initial partners to scaling across large merchant ecosystems. While early proof points show strong repayment discipline, the critical question is whether credit and fraud controls remain equally visible, explainable, and scalable as volumes and partners expand 5x.',
    fiveAreasToWatch: [
      'Underwriting consistency across different merchant ecosystems and MSME cohorts',
      'Fraud and identity controls as embedded origination volume increases',
      'Exception and override governance as approval decisions become faster',
      'Early-warning and portfolio monitoring before delinquency becomes visible',
      'AI governance: decision traceability, model/version control, drift, and human oversight'
    ],
    scalingTriggers: [
      {
        trigger: 'More merchant ecosystems',
        controlQuestion: 'Can risk be segmented by partner, channel, product, and cohort?',
        whyItMatters: 'A portfolio that performs well in aggregate can hide partner-level differences in credit quality, fraud, or repayment.'
      },
      {
        trigger: 'Higher funnel throughput',
        controlQuestion: 'Can decision speed increase without reducing decision traceability?',
        whyItMatters: 'Automation compresses decision time; controls need to preserve explainability, exception visibility, and auditability.'
      },
      {
        trigger: 'More alternative data',
        controlQuestion: 'Are data sources reliable, consistent, and monitored for drift?',
        whyItMatters: 'Different ecosystems produce different data quality, completeness, and behavioral signals.'
      },
      {
        trigger: 'Larger loan book',
        controlQuestion: 'Are early-warning indicators sensitive enough to detect deterioration before delinquency?',
        whyItMatters: 'At scale, lagging indicators become useless for proactive portfolio defense.'
      },
      {
        trigger: 'More AI-assisted decisions',
        controlQuestion: 'Can the company reconstruct why a material decision was made?',
        whyItMatters: 'Model/version changes, overrides, and human intervention need to remain fully auditable.'
      },
      {
        trigger: 'More lender / partner relationships',
        controlQuestion: 'Are risk responsibilities and escalation paths explicit across the ecosystem?',
        whyItMatters: 'Embedded lending creates multiple hand-offs across platform, lender, merchant, and technology layers.'
      }
    ],
    fourPriorities: [
      {
        number: '01',
        title: 'Partner-level risk visibility',
        description: 'Separate portfolio behavior by merchant ecosystem, product, and borrower cohort rather than relying primarily on aggregate portfolio metrics.'
      },
      {
        number: '02',
        title: 'Early-warning capability',
        description: 'Move beyond overdue monitoring to signals from cash flow, merchant activity, repayment behavior, and partner-level changes.'
      },
      {
        number: '03',
        title: 'AI decision governance',
        description: 'Ensure model/version history, decision reason codes, overrides, human review, and drift monitoring remain visible as AI-assisted underwriting expands.'
      },
      {
        number: '04',
        title: 'Credit-to-collections feedback',
        description: 'Create a closed loop in which repayment and collections outcomes continuously inform credit policy, segmentation, and monitoring.'
      }
    ],
    report: {
      clientName: 'Apex Capital (Embedded MSME Finance)',
      founderCeo: 'Founder & CEO',
      evaluator: 'Ankita — Risk Strategist for Fintech & Digital Lenders',
      date: 'September 2026',
      overallScore: 38,
      maturityStatus: 'Developing',
      executiveSummary: 'Apex Capital has demonstrated commercial velocity across initial merchant cohorts with zero historic write-offs. However, as the platform transitions from proof-of-concept into multi-partner ecosystem scaling, the control architecture risks lagging commercial distribution.',
      primaryVulnerability: 'Concentrated reliance on aggregate portfolio metrics, lack of partner-segmented vintage monitoring, and informal manual override controls that become unviable at 5x volume scale.',
      domainScores: {
        credit_underwriting: { score: 8, max: 12, maturity: 'Medium', notes: 'Credit policy rules defined but lack dynamic PSI monitoring.' },
        fraud_identity: { score: 7, max: 12, maturity: 'Medium', notes: 'Device and identity velocity rules need cross-channel enforcement.' },
        portfolio_monitoring: { score: 6, max: 12, maturity: 'Low', notes: 'Early warning indicators need real-time merchant settlement telemetry.' },
        risk_governance: { score: 9, max: 12, maturity: 'Medium', notes: 'Documented exception logs required for board and regulator audits.' },
        scaling_readiness: { score: 8, max: 12, maturity: 'Medium', notes: 'Multi-partner routing covenants need automated risk throttling.' }
      },
      keyControlGaps: [
        { id: 'GAP-01', domain: 'Portfolio Monitoring', observation: 'Over-reliance on aggregate portfolio health obscuring partner-specific vintage performance.', riskImpact: 'A single distressed anchor ecosystem could trigger concentrated write-offs before aggregate delinquency metrics react.', recommendation: 'Implement partner-segmented vintage curves (MOB 1-12) and real-time daily cash-flow velocity indicators.' },
        { id: 'GAP-02', domain: 'Credit & Underwriting', observation: 'Manual exception approvals exceed 14% threshold without centralized reason codes.', riskImpact: 'Adverse selection creeps into new merchant cohorts, elevating cumulative vintage loss rates by 2.4x.', recommendation: 'Enforce strict 2-tier approval authorities and automate monthly override performance tracking reports.' },
        { id: 'GAP-03', domain: 'Fraud Controls', observation: 'Application-level verification lacks cross-channel device and bank-account linkage clustering.', riskImpact: 'Synthetic fraud rings exploit multiple affiliate partner funnels before single-channel limits trigger.', recommendation: 'Implement real-time device hash graph matching and velocity throttles across all digital origination endpoints.' }
      ],
      roadmap: {
        days30: [
          { action: 'Audit and freeze high-risk manual underwriting override loopholes', owner: 'Head of Underwriting', impact: 'Immediate containment of adverse selection' },
          { action: 'Deploy real-time cross-channel application velocity limits', owner: 'Fraud Lead / Tech', impact: 'Eliminates multi-partner synthetic fraud attacks' }
        ],
        days60: [
          { action: 'Build automated partner-segmented vintage & early warning dashboards', owner: 'Risk Analytics', impact: 'Detects borrower deterioration 30 days before overdue' },
          { action: 'Implement Account Aggregator (AA) direct bank flow to replace PDF uploads', owner: 'Product & Engineering', impact: 'Closes document tampering vulnerability' }
        ],
        days90: [
          { action: 'Deploy automated AI scorecard drift and PSI telemetry', owner: 'Data Science / Tech', impact: 'Guarantees regulatory explainability and model health' },
          { action: 'Integrate collections intelligence feedback loop into origination rules', owner: 'Collections & Credit', impact: 'Dynamic rule tightening based on recovery outcomes' }
        ]
      }
    }
  },
  {
    id: 'lm_b2b_supply_chain',
    companyName: 'SupplyCredit Global (B2B Invoice Finance)',
    founderCeo: 'Founder & Managing Director',
    lendingModel: 'Anchor-Led Supply Chain Financing & Invoice Discounting',
    disbursements: '$42M+ Annual GMV',
    targetGeography: 'Singapore & UAE (DIFC)',
    anchorPartners: '6 Tier-1 Enterprise Corporate Anchors',
    status: 'Evidence Review',
    totalScore: 44,
    maturityStatus: 'Established',
    executiveLens: 'SupplyCredit leverages enterprise ERP data for seamless invoice advances to sub-tier suppliers. As enterprise buyers stretch payment cycles and supply chain disruptions emerge, the risk view must capture supplier concentration and multi-tier dilution risks before invoice maturity.',
    fiveAreasToWatch: [
      'Anchor enterprise debtor concentration limits and credit limit renewal cycles',
      'Invoice duplication, circular billing, and commercial dispute fraud controls',
      'Supplier cash flow degradation signals outside the anchor relationship',
      'Recourse vs non-recourse legal enforcement and dispute escalation governance',
      'Multi-currency and cross-border settlement FX volatility covenants'
    ],
    scalingTriggers: [
      {
        trigger: 'Tier-2 and Tier-3 Supplier Onboarding',
        controlQuestion: 'Can risk evaluate indirect supplier creditworthiness without full financials?',
        whyItMatters: 'Deeper supply chain tiers present higher default velocity and fragmented bookkeeping.'
      },
      {
        trigger: 'Higher Invoice Velocity',
        controlQuestion: 'Are automated matching rules detecting re-hypothecated or cancelled invoices?',
        whyItMatters: 'Fraud syndicates target high-speed invoice factoring with fake e-way bills.'
      }
    ],
    fourPriorities: [
      { number: '01', title: 'Automated Buyer Verification', description: 'Direct API verification with buyer ERP rather than static vendor invoices.' },
      { number: '02', title: 'Dynamic Supplier Concentration Caps', description: 'Limit single-supplier drawdowns to 15% of total facility per anchor.' },
      { number: '03', title: 'Circular Factoring Detection', description: 'Graph algorithms to flag reciprocal supplier-buyer ownership or shared directors.' },
      { number: '04', title: 'Cross-Border Legal Recourse', description: 'Enforce dual-jurisdiction legal covenants across DIFC and MAS governing bodies.' }
    ],
    report: {
      clientName: 'SupplyCredit Global',
      founderCeo: 'Founder & MD',
      evaluator: 'Ankita — Risk Strategist for Fintech & Digital Lenders',
      date: 'September 2026',
      overallScore: 44,
      maturityStatus: 'Established',
      executiveSummary: 'SupplyCredit Global demonstrates mature underwriting at the enterprise anchor level. However, rapid expansion into Tier-2 vendors creates exposure to supplier concentration and commercial reconciliation lags.',
      primaryVulnerability: 'Lack of real-time supplier cash-flow visibility outside the anchor buyer relationship.',
      domainScores: {
        credit_underwriting: { score: 10, max: 12, maturity: 'High', notes: 'Anchor underwriting is institutional grade.' },
        fraud_identity: { score: 9, max: 12, maturity: 'Medium', notes: 'Invoice authenticity verified; needs cross-registry invoice deduplication.' },
        portfolio_monitoring: { score: 8, max: 12, maturity: 'Medium', notes: 'Anchor health monitored; vendor concentration caps need tighter limits.' },
        risk_governance: { score: 9, max: 12, maturity: 'Medium', notes: 'Formal credit committee in place for limits > $250k.' },
        scaling_readiness: { score: 8, max: 12, maturity: 'Medium', notes: 'ERP integration scalable; cross-border dispute protocols need documentation.' }
      },
      keyControlGaps: [
        { id: 'GAP-01', domain: 'Fraud & Invoicing', observation: 'Absence of automated tax authority invoice status polling prior to invoice funding.', riskImpact: 'Cancelled or credited invoices funded in error.', recommendation: 'Connect real-time e-Invoicing API validation prior to disbursement.' }
      ],
      roadmap: {
        days30: [{ action: 'Deploy real-time tax portal e-invoice validation', owner: 'Product & Risk', impact: 'Stops cancelled invoice advances' }],
        days60: [{ action: 'Formalize 15% single-supplier concentration ceiling', owner: 'CRO', impact: 'Prevents single-vendor contagion' }],
        days90: [{ action: 'Implement MAS-compliant cross-border dispute protocol', owner: 'Legal & Risk', impact: 'Secures institutional debt facilities' }]
      }
    }
  },
  {
    id: 'lm_consumer_microcredit',
    companyName: 'NovaCredit (Digital Consumer Micro-Lending)',
    founderCeo: 'Co-Founder & Chief Product Officer',
    lendingModel: 'Instant Digital Revolving Consumer Lines',
    disbursements: '$18M+ Active Balance Sheet',
    targetGeography: 'United States & UK',
    anchorPartners: 'Affiliate Marketing & Neo-bank SuperApps',
    status: 'Completed Health Check',
    totalScore: 28,
    maturityStatus: 'Developing',
    executiveLens: 'NovaCredit delivers sub-60-second consumer credit lines through mobile SuperApp distribution. Rapid acquisition growth has compressed KYC verification times, causing early-stage delinquency spikes and synthetic identity contamination in recent origination cohorts.',
    fiveAreasToWatch: [
      'Synthetic identity injection through fast-fill application flows',
      'Affiliate acquisition channel adverse selection and early payment default (EPD)',
      'Model decay on alternative bureau and open banking scorecards',
      'Collections roll-rate deterioration from 30 DPD to 60 DPD',
      'Regulatory compliance under FCA Consumer Duty and CFPB Fair Lending rules'
    ],
    scalingTriggers: [
      {
        trigger: 'Affiliate Channel Surge',
        controlQuestion: 'Can risk isolate fraud spikes on specific marketing affiliates in real time?',
        whyItMatters: 'Unregulated affiliate traffic often drives 3x higher default rates.'
      }
    ],
    fourPriorities: [
      { number: '01', title: 'Affiliate Risk Throttling', description: 'Dynamic daily origination caps on affiliate channels showing >3% EPD.' },
      { number: '02', title: 'Device Fingerprint Velocity', description: 'Hard stop on applications with matching device hashes or IP anomalies.' },
      { number: '03', title: 'Open Banking Cash-Flow Verification', description: 'Mandatory transaction telemetry rather than self-reported income.' },
      { number: '04', title: 'Automated 15-Day Cure Workflows', description: 'Step-up collections nudges before first missed installment.' }
    ],
    report: {
      clientName: 'NovaCredit Platform',
      founderCeo: 'Co-Founder & CPO',
      evaluator: 'Ankita — Risk Strategist for Fintech & Digital Lenders',
      date: 'September 2026',
      overallScore: 28,
      maturityStatus: 'Developing',
      executiveSummary: 'NovaCredit has achieved high funnel throughput, but rapid affiliate onboarding has diluted credit quality and elevated early payment defaults.',
      primaryVulnerability: 'Synthetic identity infiltration and lack of affiliate-level origination throttling.',
      domainScores: {
        credit_underwriting: { score: 6, max: 12, maturity: 'Low', notes: 'High approval speed has elevated early payment defaults.' },
        fraud_identity: { score: 5, max: 12, maturity: 'Low', notes: 'Device velocity rules missing on mobile onboarding.' },
        portfolio_monitoring: { score: 6, max: 12, maturity: 'Low', notes: 'Affiliate channel delinquency curves not segmented.' },
        risk_governance: { score: 6, max: 12, maturity: 'Low', notes: 'Marketing team overriding risk cutoff thresholds to hit growth goals.' },
        scaling_readiness: { score: 5, max: 12, maturity: 'Low', notes: 'Collections agency capacity overwhelmed by recent cohort defaults.' }
      },
      keyControlGaps: [
        { id: 'GAP-01', domain: 'Fraud & Marketing', observation: 'Top 2 affiliate channels account for 48% of 30+ DPD defaults.', riskImpact: 'Severe adverse selection diluting capital adequacy.', recommendation: 'Enforce real-time affiliate risk scoring and freeze low-scoring channels.' }
      ],
      roadmap: {
        days30: [{ action: 'Cap low-performing affiliate partner disbursements', owner: 'Head of Growth & Risk', impact: 'Immediately halts 60% of bad originations' }],
        days60: [{ action: 'Deploy real-time device intelligence & KYC liveness', owner: 'Fraud Engineering', impact: 'Blocks synthetic fraud rings' }],
        days90: [{ action: 'Recalibrate automated credit scorecard with Open Banking', owner: 'Credit Science', impact: 'Reduces 90-day defaults by 35%' }]
      }
    }
  }
];

export const N8N_WORKFLOW_PIPELINE: N8nWorkflowNode[] = [
  {
    id: 'node-webhook',
    name: 'Founder Intake Webhook',
    type: 'Webhook Trigger',
    description: 'Receives founder profile, loan book AUM, partner channels & uploaded underwriting policies via encrypted endpoint.',
    status: 'completed',
    executionTimeMs: 120,
    outputSummary: 'Payload validated: 4 documents & loan book parameters received'
  },
  {
    id: 'node-parser',
    name: 'AI Document & Policy Parser',
    type: 'Gemini 2.5 Flash / Document AI',
    description: 'Extracts underwriting PPG cutoffs, KYC architecture checkpoints, and manual exception rules from uploaded data room.',
    status: 'completed',
    executionTimeMs: 480,
    outputSummary: 'Parsed 18 policy rules, 6 partner SLAs, and 90-day exception logs'
  },
  {
    id: 'node-domain-scoring',
    name: '5-Domain Scoring Engine',
    type: 'n8n Code Node / Risk Matrix',
    description: 'Executes automated 20-checkpoint rubric across Credit, Fraud, Portfolio, Governance, and Scaling (0-60 points).',
    status: 'completed',
    executionTimeMs: 210,
    outputSummary: 'Scored: 38/60 (Developing). Identified 3 critical control leaks'
  },
  {
    id: 'node-pricing-engine',
    name: 'Jurisdiction & Scope Pricing Modeler',
    type: 'Multi-Currency Rule Engine',
    description: 'Calculates tailored fees across US, India, SG, UK, and UAE calibrated to AUM volume and regulatory compliance requirements.',
    status: 'completed',
    executionTimeMs: 150,
    outputSummary: 'Mapped to local jurisdiction: Starter, Detailed & Implementation quote generated'
  },
  {
    id: 'node-report-builder',
    name: 'Executive Report & 30/60/90 Roadmap',
    type: 'PDF / Markdown Synthesizer',
    description: 'Compiles the full 4-part Executive Diagnostic, Key Control Gaps, and sequenced remediation action plan.',
    status: 'completed',
    executionTimeMs: 650,
    outputSummary: 'Generated 4-part PDF deliverable with board-level executive lens'
  },
  {
    id: 'node-notification',
    name: 'Founder & Strategist Notification',
    type: 'Slack & Email Dispatch',
    description: 'Dispatches instant confidential access link to founder and alerts Risk Strategist Ankita for review.',
    status: 'completed',
    executionTimeMs: 180,
    outputSummary: 'Delivered in 1.79s total pipeline execution time'
  }
];

export const PRE_ENGAGEMENT_DOC_CHECKLIST = [
  {
    category: '1. Credit & Underwriting',
    documents: [
      { name: 'Latest Credit Policy & Product Program Guide (PPG)', required: true, status: 'ready', description: 'Covers eligibility criteria, cut-off thresholds, ticket sizes, and tenure rules.' },
      { name: 'Underwriting Scorecard & Decision Engine Rule Hierarchy', required: true, status: 'pending', description: 'Includes knock-out rules, score cutoffs, and alternative data weighting.' },
      { name: 'Manual Override & Exception Log (Last 90 Days)', required: true, status: 'pending', description: 'Lists all loans approved outside standard policy, approver name, and reason codes.' }
    ]
  },
  {
    category: '2. Fraud & Identity Architecture',
    documents: [
      { name: 'Digital KYC/KYB Flow Architecture Diagram', required: true, status: 'ready', description: 'Sequence of ID verification, biometric checks, bank account validation, and entity registries.' },
      { name: 'Fraud Ruleset & Velocity Limit Configurations', required: true, status: 'pending', description: 'Device, IP, bank account, and phone number frequency velocity thresholds.' },
      { name: 'Confirmed Fraud Incident Log (Past 12 Months)', required: false, status: 'pending', description: 'Root cause analysis of confirmed first-party and third-party fraud cases.' }
    ]
  },
  {
    category: '3. Portfolio Analytics & Cohorts',
    documents: [
      { name: 'Monthly Vintage Delinquency Curves (MOB 1 to 24)', required: true, status: 'pending', description: 'Cumulative default rates by origination vintage, product, and channel.' },
      { name: 'Roll-Rate Matrix & DPD Transition Analysis', required: true, status: 'ready', description: 'Transition probabilities from Current -> 30 DPD -> 60 DPD -> 90 DPD.' },
      { name: 'Partner/Anchor Merchant Concentration Schedule', required: true, status: 'pending', description: 'Portfolio breakdown by merchant ecosystem, industry sector, and geography.' }
    ]
  },
  {
    category: '4. Governance & Partner Contracts',
    documents: [
      { name: 'Risk RACI & Delegated Lending Authority (DLA) Matrix', required: true, status: 'ready', description: 'Approval hierarchies, credit committee charters, and escalation mandates.' },
      { name: 'Financing Partner / Co-Lending / FLDG Agreements', required: true, status: 'pending', description: 'Covenants, First Loss Default Guarantee terms, and partner loss-sharing definitions.' },
      { name: 'AI/ML Model Documentation & Drift Validation Reports', required: false, status: 'pending', description: 'Feature stability, backtesting results, and human-in-the-loop fallback protocols.' }
    ]
  }
];

export const SAMPLE_DEFAULT_REPORT: HealthCheckReport = FOUNDER_LEAD_MAGNETS[0].report;
