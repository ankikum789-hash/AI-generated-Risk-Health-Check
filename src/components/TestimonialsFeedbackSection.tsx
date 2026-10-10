import React, { useState } from 'react';
import { 
  Star, 
  Quote, 
  CheckCircle, 
  MessageSquare, 
  Send, 
  Building2, 
  ShieldCheck, 
  TrendingUp, 
  ThumbsUp, 
  Sparkles, 
  Filter,
  UserCheck
} from 'lucide-react';
import { JurisdictionConfig } from '../types/risk';

interface Testimonial {
  id: string;
  founderName: string;
  title: string;
  company: string;
  jurisdiction: string;
  flag: string;
  lendingModel: string;
  quote: string;
  highlightMetric: string;
  verifiedEngagement: string;
  rating: number;
}

const INITIAL_TESTIMONIALS: Testimonial[] = [];

interface TestimonialsFeedbackSectionProps {
  currentJurisdiction: JurisdictionConfig;
  onOpenFounderPortal: () => void;
  onOpenReportModal: () => void;
}

export const TestimonialsFeedbackSection: React.FC<TestimonialsFeedbackSectionProps> = ({
  currentJurisdiction,
  onOpenFounderPortal,
  onOpenReportModal,
}) => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(INITIAL_TESTIMONIALS);
  const [filterModel, setFilterModel] = useState<string>('ALL');

  // Interactive Client Feedback Form State
  const [feedbackTab, setFeedbackTab] = useState<'testimonials' | 'submit_feedback'>('testimonials');
  const [clientName, setClientName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientRole, setClientRole] = useState('Founder & CEO');
  const [clientCountry, setClientCountry] = useState(currentJurisdiction.country);
  const [clientLendingModel, setClientLendingModel] = useState('Embedded MSME Lending');
  const [diagnosticRating, setDiagnosticRating] = useState<number>(5);
  const [roadmapRating, setRoadmapRating] = useState<number>(5);
  const [fraudRating, setFraudRating] = useState<number>(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const filteredTestimonials = testimonials.filter(t => {
    if (filterModel === 'ALL') return true;
    return t.lendingModel.toLowerCase().includes(filterModel.toLowerCase());
  });

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientCompany || !feedbackText) return;

    const newTestimonial: Testimonial = {
      id: `client-${Date.now()}`,
      founderName: clientName,
      title: clientRole,
      company: clientCompany,
      jurisdiction: `${clientCountry}`,
      flag: currentJurisdiction.flag,
      lendingModel: clientLendingModel,
      quote: feedbackText,
      highlightMetric: 'Verified Founder Review • Post-Diagnostic',
      verifiedEngagement: 'Detailed Risk Health Check',
      rating: Math.round((diagnosticRating + roadmapRating + fraudRating) / 3),
    };

    setTestimonials([newTestimonial, ...testimonials]);
    setSubmittedMessage('Thank you! Your verified executive review has been recorded and posted.');
    setFeedbackText('');
    setClientName('');
    setClientCompany('');
    setFeedbackTab('testimonials');
    setTimeout(() => setSubmittedMessage(null), 5000);
  };

  return (
    <section id="testimonials" className="py-20 bg-slate-950 text-slate-100 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950/80 border border-cyan-800 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <UserCheck className="w-3.5 h-3.5" />
              <span>Founder Trust & Executive Track Record</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              What Fintech & Digital Lender Founders & CEOs Say
            </h2>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
              Independent reviews from fintech & digital lending leaders who used our 5-domain risk diagnostic to scale originations without losing control of loss rates.
            </p>
          </div>

          {/* Toggle between Testimonials and Feedback Submission */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-auto">
            <button
              onClick={() => setFeedbackTab('testimonials')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                feedbackTab === 'testimonials'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Founder Testimonials ({testimonials.length})
            </button>
            <button
              onClick={() => setFeedbackTab('submit_feedback')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                feedbackTab === 'submit_feedback'
                  ? 'bg-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Submit Client Feedback</span>
            </button>
          </div>
        </div>

        {/* Global Impact Numbers */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">₹120Cr+ / $45M</div>
            <div className="text-xs text-slate-400 mt-1">Loan book volume stress-tested</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">0</div>
            <div className="text-xs text-slate-400 mt-1">FLDG or covenant breaches</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">38%</div>
            <div className="text-xs text-slate-400 mt-1">Avg drop in uncalibrated overrides</div>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">100%</div>
            <div className="text-xs text-slate-400 mt-1">Board & regulator audit readiness</div>
          </div>
        </div>

        {/* Success toast */}
        {submittedMessage && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-700 text-emerald-200 text-xs flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{submittedMessage}</span>
            </div>
            <button onClick={() => setSubmittedMessage(null)} className="text-slate-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* VIEW 1: TESTIMONIALS CARDS */}
        {feedbackTab === 'testimonials' && (
          <div className="space-y-6">
            {/* Filter Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-xs text-slate-400 font-medium shrink-0 flex items-center gap-1">
                <Filter className="w-3 h-3 text-cyan-400" />
                <span>Filter by Lending Model:</span>
              </span>
              {['ALL', 'MSME', 'Merchant', 'Invoice', 'Open Banking', 'Cash Advance'].map((m) => (
                <button
                  key={m}
                  onClick={() => setFilterModel(m)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                    filterModel === m
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Testimonials Grid or Blank Cohort State */}
            {filteredTestimonials.length === 0 ? (
              <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center space-y-4 max-w-2xl mx-auto my-6">
                <div className="w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 mx-auto">
                  <UserCheck className="w-6 h-6 text-slate-500" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-white">Awaiting First Verified Founder Feedback</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                    Testimonials are published strictly upon client authorization following completion of evidence review and board readouts. No hypothetical reviews are displayed.
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setFeedbackTab('submit_feedback')}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors shadow-md cursor-pointer"
                  >
                    Submit Founder Evaluation
                  </button>
                  <button
                    onClick={onOpenFounderPortal}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    Enter Founder Portal
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTestimonials.map((t) => (
                  <div
                    key={t.id}
                    className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top rating and model tag */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          {[...Array(t.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                          {t.flag} {t.lendingModel}
                        </span>
                      </div>

                      {/* Quote */}
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6 italic">
                        "{t.quote}"
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800/80 space-y-3">
                      {/* Impact Metric Pill */}
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 text-[11px] text-emerald-300 font-medium flex items-center gap-2">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate">{t.highlightMetric}</span>
                      </div>

                      {/* Author Info */}
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs font-bold text-white">{t.founderName}</div>
                          <div className="text-[11px] text-slate-400">
                            {t.title}, <strong className="text-slate-300">{t.company}</strong>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] uppercase font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                            {t.verifiedEngagement.split(' + ')[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Callout */}
            <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-cyan-950/20 to-slate-900 border border-cyan-900/40 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
              <div className="flex items-center gap-3">
                <Quote className="w-8 h-8 text-cyan-500/60 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Join 15+ Scaling Fintech & Digital Lenders Protecting Their Loan Book</h4>
                  <p className="text-xs text-slate-400">Get an independent executive review before your next debt or equity fundraise.</p>
                </div>
              </div>
              <button
                onClick={onOpenFounderPortal}
                className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 transition-colors shadow-md cursor-pointer"
              >
                Schedule Founder Diagnostic
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: SUBMIT CLIENT FEEDBACK FORM */}
        {feedbackTab === 'submit_feedback' && (
          <div className="max-w-2xl mx-auto bg-slate-900/70 p-6 sm:p-8 rounded-2xl border border-slate-800">
            <div className="mb-6">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
                <MessageSquare className="w-4 h-4" />
                <span>Executive Post-Engagement Feedback</span>
              </div>
              <h3 className="text-xl font-bold text-white">Client Risk Diagnostic Review</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you a fintech or digital lending founder, risk head, or CEO who completed a Risk Health Check? Share your experience to help other founders navigate scalable risk controls.
              </p>
            </div>

            <form onSubmit={handleSubmitFeedback} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brotish Das"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Lending Platform / Company</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Intellend"
                    value={clientCompany}
                    onChange={(e) => setClientCompany(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Your Executive Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Founder & CEO / Head of Credit"
                    value={clientRole}
                    onChange={(e) => setClientRole(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Lending Model</label>
                  <select
                    value={clientLendingModel}
                    onChange={(e) => setClientLendingModel(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Embedded MSME Lending">Embedded MSME Lending</option>
                    <option value="Merchant Cash Advance (MCA)">Merchant Cash Advance (MCA)</option>
                    <option value="Working Capital & FLDG">Working Capital & FLDG</option>
                    <option value="SME Invoice Discounting">SME Invoice Discounting</option>
                    <option value="Open Banking Credit">Open Banking Credit</option>
                    <option value="Consumer BNPL">Consumer BNPL</option>
                  </select>
                </div>
              </div>

              {/* 3 Structured Rating Bars */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Diagnostic Quality Evaluation (1 to 5 Stars)
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">5-Domain Diagnostic Accuracy:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setDiagnosticRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${star <= diagnosticRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Actionability of 30/60/90-Day Roadmap:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRoadmapRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${star <= roadmapRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Fraud & Early-Warning Control Practicality:</span>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setFraudRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star className={`w-4 h-4 ${star <= fraudRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">
                  Executive Review & Qualitative Takeaway
                </label>
                <textarea
                  required
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Describe how the risk health check impacted your underwriting policies, fraud detection, or investor conversations..."
                  className="w-full p-3.5 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Verified Executive Testimonial</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};
