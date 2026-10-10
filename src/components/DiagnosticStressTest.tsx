import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  RotateCcw, 
  FileText, 
  HelpCircle, 
  ShieldCheck, 
  Bookmark,
  ChevronDown,
  Layers
} from 'lucide-react';
import { RISK_DOMAINS, DIAGNOSTIC_QUESTIONS, DISCUSSION_QUESTIONS } from '../data/riskData';
import { RiskDomainId } from '../types/risk';

interface DiagnosticStressTestProps {
  onOpenReportModal: () => void;
  onGenerateReportFromScores: (
    scores: Record<RiskDomainId, { score: number; max: number; notes: string }>
  ) => void;
}

export const DiagnosticStressTest: React.FC<DiagnosticStressTestProps> = ({
  onOpenReportModal,
  onGenerateReportFromScores,
}) => {
  // Store individual answer score (0 to 3) for each question id
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    // Default to Intellend benchmark scores (total: 38/60)
    const initial: Record<string, number> = {};
    DIAGNOSTIC_QUESTIONS.forEach((q, idx) => {
      // realistic spread matching ~38 total
      const val = [2, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 1, 2, 2, 2, 3, 2, 2, 2, 3][idx] ?? 2;
      initial[q.id] = val;
    });
    return initial;
  });

  const [activeDomainFilter, setActiveDomainFilter] = useState<string>('ALL');

  // Compute domain breakdowns and total score
  const scoreAnalytics = useMemo(() => {
    let total = 0;
    const domainTotals: Record<RiskDomainId, { score: number; max: number; notes: string }> = {
      credit_underwriting: { score: 0, max: 12, notes: '' },
      fraud_identity: { score: 0, max: 12, notes: '' },
      portfolio_monitoring: { score: 0, max: 12, notes: '' },
      risk_governance: { score: 0, max: 12, notes: '' },
      scaling_readiness: { score: 0, max: 12, notes: '' },
    };

    DIAGNOSTIC_QUESTIONS.forEach(q => {
      const s = answers[q.id] || 0;
      total += s;
      domainTotals[q.domainId].score += s;
    });

    let tier: 'Significant Gaps' | 'Developing' | 'Established' | 'Mature' = 'Developing';
    let tierColor = 'text-amber-400';
    let tierBg = 'bg-amber-950/40 border-amber-800/80';
    let tierDescription = 'Developing control environment with foundational processes established but significant exposure to scaling drift.';

    if (total <= 20) {
      tier = 'Significant Gaps';
      tierColor = 'text-rose-400';
      tierBg = 'bg-rose-950/40 border-rose-800/80';
      tierDescription = 'Significant control gaps to investigate urgently before originating higher volumes.';
    } else if (total <= 40) {
      tier = 'Developing';
      tierColor = 'text-amber-400';
      tierBg = 'bg-amber-950/40 border-amber-800/80';
      tierDescription = 'Developing control environment. Operating controls exist, but early warning and AI governance need systematic hardening.';
    } else if (total <= 50) {
      tier = 'Established';
      tierColor = 'text-sky-400';
      tierBg = 'bg-sky-950/40 border-sky-800/80';
      tierDescription = 'Established controls with identifiable ownership; minor areas to strengthen before institutional debt syndication.';
    } else {
      tier = 'Mature';
      tierColor = 'text-emerald-400';
      tierBg = 'bg-emerald-950/40 border-emerald-800/80';
      tierDescription = 'More mature control environment. Automated, monitored continuously, and regularly backtested for drift.';
    }

    return {
      total,
      domainTotals,
      tier,
      tierColor,
      tierBg,
      tierDescription,
    };
  }, [answers]);

  const handleScoreChange = (questionId: string, val: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: val,
    }));
  };

  const loadPreset = (preset: 'embedded_msme' | 'early_stage' | 'mature' | 'zero') => {
    const updated: Record<string, number> = {};
    DIAGNOSTIC_QUESTIONS.forEach((q, idx) => {
      if (preset === 'zero') updated[q.id] = 0;
      else if (preset === 'early_stage') updated[q.id] = [1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1][idx];
      else if (preset === 'mature') updated[q.id] = [3, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 2, 3, 3, 3, 2, 3, 3, 3, 3][idx];
      else updated[q.id] = [2, 2, 2, 2, 2, 2, 1, 2, 2, 1, 2, 1, 2, 2, 2, 3, 2, 2, 2, 3][idx];
    });
    setAnswers(updated);
  };

  const handleGenerateReport = () => {
    onGenerateReportFromScores(scoreAnalytics.domainTotals);
    onOpenReportModal();
  };

  const filteredQuestions = DIAGNOSTIC_QUESTIONS.filter(q => {
    if (activeDomainFilter === 'ALL') return true;
    return q.domainId === activeDomainFilter;
  });

  return (
    <section id="stress-test" className="py-20 bg-slate-950 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>RiskLens • AI-Assisted Self-Diagnostic</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Free Risk-Control Health Check
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
              Pressure-test your credit, fraud, portfolio and risk-governance controls across the 20 executive checkpoints (0 to 3 scale) before rapid origination exposes the gaps.
            </p>
          </div>

          {/* Quick Benchmark Presets */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-slate-400 font-medium">Load Profile:</span>
            <button
              onClick={() => loadPreset('embedded_msme')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-cyan-800/60 text-cyan-300 transition-colors"
            >
              Embedded MSME (Score 38)
            </button>
            <button
              onClick={() => loadPreset('early_stage')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            >
              Early-Stage (Score 15)
            </button>
            <button
              onClick={() => loadPreset('mature')}
              className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors"
            >
              Mature Lender (Score 53)
            </button>
            <button
              onClick={() => loadPreset('zero')}
              className="px-2 py-1.5 rounded-lg text-xs font-medium text-slate-500 hover:text-slate-300"
              title="Reset all to 0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Live Scorecard Banner */}
        <div className={`p-6 rounded-2xl border mb-10 ${scoreAnalytics.tierBg}`}>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Total Score Gauge */}
            <div className="md:col-span-4 flex items-center gap-5 border-b md:border-b-0 md:border-r border-slate-800/80 pb-6 md:pb-0 pr-0 md:pr-6">
              <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={scoreAnalytics.tierColor}
                    strokeDasharray={`${(scoreAnalytics.total / 60) * 100}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <div className="text-2xl font-extrabold text-white font-mono leading-none">
                    {scoreAnalytics.total}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">/ 60</div>
                </div>
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Overall Control Maturity
                </div>
                <div className={`text-xl font-extrabold ${scoreAnalytics.tierColor}`}>
                  {scoreAnalytics.tier}
                </div>
                <div className="text-xs text-slate-300 mt-1 max-w-xs">
                  {scoreAnalytics.tierDescription}
                </div>
              </div>
            </div>

            {/* Domain Breakdown Bars */}
            <div className="md:col-span-5 space-y-2">
              <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                5-Domain Point Distribution (Max 12 each)
              </div>
              {RISK_DOMAINS.map(d => {
                const s = scoreAnalytics.domainTotals[d.id]?.score || 0;
                const pct = (s / 12) * 100;
                return (
                  <div key={d.id} className="flex items-center gap-3 text-xs">
                    <span className="w-32 truncate text-slate-300 font-medium">
                      {d.name.split(' Controls')[0].split(' & Early')[0]}
                    </span>
                    <div className="flex-1 h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          pct < 50 ? 'bg-rose-500' : pct < 75 ? 'bg-amber-400' : 'bg-emerald-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-10 text-right font-mono font-bold text-slate-200">
                      {s} / 12
                    </span>
                  </div>
                );
              })}
            </div>

            {/* CTA to Full Report */}
            <div className="md:col-span-3 flex flex-col gap-3 justify-center items-start md:items-end">
              <button
                onClick={handleGenerateReport}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Compile 4-Part Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <span className="text-[11px] text-slate-400 text-center md:text-right">
                Includes executive summary, gaps & 30/60/90-day plan
              </span>
            </div>
          </div>
        </div>

        {/* Scoring Scale Reference Legend */}
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 mb-8 flex flex-wrap items-center justify-between gap-4 text-xs">
          <span className="font-semibold text-slate-300">Scoring Rubric:</span>
          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-slate-950 border border-slate-700 flex items-center justify-center font-mono font-bold text-rose-400">0</span>
              <span>No formal control / major gap</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-slate-950 border border-slate-700 flex items-center justify-center font-mono font-bold text-amber-400">1</span>
              <span>Partially defined</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-slate-950 border border-slate-700 flex items-center justify-center font-mono font-bold text-sky-400">2</span>
              <span>Defined and operational</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-5 h-5 rounded bg-slate-950 border border-slate-700 flex items-center justify-center font-mono font-bold text-emerald-400">3</span>
              <span>Automated, monitored & regularly tested</span>
            </span>
          </div>
        </div>

        {/* Domain Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
          <button
            onClick={() => setActiveDomainFilter('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              activeDomainFilter === 'ALL'
                ? 'bg-cyan-500 text-slate-950'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            All 20 Questions
          </button>
          {RISK_DOMAINS.map(d => (
            <button
              key={d.id}
              onClick={() => setActiveDomainFilter(d.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeDomainFilter === d.id
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {d.name.split(' Controls')[0].split(' & Early')[0]}
            </button>
          ))}
        </div>

        {/* 20 Questions List */}
        <div className="space-y-4">
          {filteredQuestions.map((q, idx) => {
            const currentVal = answers[q.id] ?? 0;
            const parentDomain = RISK_DOMAINS.find(d => d.id === q.domainId);

            return (
              <div
                key={q.id}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 max-w-3xl">
                    <div className="flex items-center gap-2 text-[11px] font-mono text-cyan-400">
                      <span>{parentDomain?.name}</span>
                      <span className="text-slate-600">•</span>
                      <span>Item #{idx + 1}</span>
                    </div>

                    <h4 className="text-sm sm:text-base font-bold text-white">
                      {q.text}
                    </h4>

                    <p className="text-xs text-slate-400">
                      <strong className="text-slate-300">Evidence signal: </strong>
                      {q.evidencePrompt}
                    </p>

                    {q.potentialBlindSpot && (
                      <p className="text-[11px] text-amber-300/80">
                        <strong>Watch for: </strong>
                        {q.potentialBlindSpot}
                      </p>
                    )}
                  </div>

                  {/* 0 to 3 Button Group */}
                  <div className="flex items-center gap-1.5 shrink-0 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                    {[0, 1, 2, 3].map((val) => {
                      const isSelected = currentVal === val;
                      return (
                        <button
                          key={val}
                          onClick={() => handleScoreChange(q.id, val)}
                          className={`w-9 h-9 rounded-lg text-xs font-mono font-bold transition-all flex items-center justify-center cursor-pointer ${
                            isSelected
                              ? val === 0
                                ? 'bg-rose-600 text-white shadow-md'
                                : val === 1
                                ? 'bg-amber-500 text-slate-950 shadow-md'
                                : val === 2
                                ? 'bg-sky-500 text-slate-950 shadow-md'
                                : 'bg-emerald-500 text-slate-950 shadow-md'
                              : 'text-slate-400 hover:text-white hover:bg-slate-900'
                          }`}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 5 Questions to Discuss Section (from page 2 of the PDF) */}
        <div className="mt-14 p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Executive Debrief Agenda</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
            5 Critical Questions to Discuss at Leadership Level
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-2xl">
            Derived directly from our lending stress test framework. Use these questions in your next board or credit committee meeting to challenge operating assumptions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DISCUSSION_QUESTIONS.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="w-6 h-6 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    0{index + 1}
                  </span>
                  <div>
                    <h5 className="text-xs sm:text-sm font-bold text-white mb-1">
                      {item.q}
                    </h5>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {item.insight}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
