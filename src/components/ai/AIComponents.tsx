import React from 'react';
import {
  Sparkles,
  AlertCircle,
  Copy,
  Users,
  ShieldCheck,
  TrendingUp,
  ExternalLink,
  Bot,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { AIAnalysisResult, DuplicateReport, MatchedPartner } from '../../types';
import { PriorityScoreGauge } from '../common/PriorityScoreGauge';
import { SeverityBadge, AIConfidenceBadge } from '../common/Badges';

export const AIAnalysisCard: React.FC<{
  analysis: AIAnalysisResult;
  challengeTitle?: string;
  className?: string;
}> = ({ analysis, challengeTitle, className = '' }) => {
  return (
    <div className={`bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-xl border border-blue-900/40 relative overflow-hidden ${className}`}>
      {/* Background ambient glow */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -ml-12 -mb-12" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-white">CivicConnect AI Analysis</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 uppercase tracking-wider">
                AI Engine
              </span>
            </div>
            <p className="text-xs text-slate-400">Deep semantic triage & disaster threat scoring</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center gap-1.5">
            <Sparkles size={12} className="text-cyan-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span>{analysis.confidenceScore}% AI Confidence</span>
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6 relative z-10">
        <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
            Priority Score
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl font-black text-white">{analysis.priorityScore}</span>
            <span className="text-xs text-slate-400">/100</span>
          </div>
          <span className={`inline-block mt-1 text-[11px] font-bold ${
            analysis.priorityScore >= 85 ? 'text-red-400' : analysis.priorityScore >= 70 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {analysis.priorityScore >= 85 ? 'Immediate Escalation' : 'High Priority'}
          </span>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
            Severity Rating
          </span>
          <div className="text-2xl font-black text-white">{analysis.severity}</div>
          <span className="text-[11px] text-cyan-300 font-semibold block mt-1">
            {analysis.urgencyLevel} response
          </span>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
            Affected Population
          </span>
          <div className="text-2xl font-black text-white">
            ~{analysis.affectedPopulationEstimate.toLocaleString()}
          </div>
          <span className="text-[11px] text-slate-400 font-semibold block mt-1">
            GIS density calculation
          </span>
        </div>

        <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 block mb-1">
            Duplicate Reports
          </span>
          <div className="text-2xl font-black text-white">
            {analysis.duplicatesDetected.length}
          </div>
          <span className="text-[11px] text-slate-400 font-semibold block mt-1">
            {analysis.duplicatesDetected.length > 0 ? 'Cluster merged' : 'Unique incident'}
          </span>
        </div>
      </div>

      {/* AI Rationale & Recommended Action */}
      <div className="space-y-4 pt-2 relative z-10">
        <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-cyan-300 uppercase tracking-wider">
            <Zap size={14} className="text-cyan-400" />
            <span>AI Reasoning & Evaluation Rationale</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {analysis.analysisRationale.map((point, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 size={14} className="text-cyan-400 shrink-0 mt-0.5" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-2xl flex items-start gap-3">
          <div className="p-2 rounded-xl bg-blue-500/20 text-blue-300 shrink-0">
            <Bot size={18} />
          </div>
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-blue-300">
              Recommended Municipal & Partner Action
            </span>
            <p className="text-sm font-medium text-white mt-0.5 leading-relaxed">
              {analysis.recommendedAction}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DuplicateDetectionCard: React.FC<{
  duplicates: DuplicateReport[];
  onViewDuplicate?: (id: string) => void;
}> = ({ duplicates, onViewDuplicate }) => {
  if (duplicates.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center">
        <ShieldCheck size={32} className="mx-auto text-emerald-600 mb-2" />
        <h4 className="text-sm font-bold text-slate-900">No Duplicate Reports Detected</h4>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          CivicConnect AI spatial engine did not find duplicate complaints within 1.5 km of this geocoordinate.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-amber-900">
          <Copy size={18} className="text-amber-600" />
          <h4 className="text-sm font-bold">AI Duplicate Cluster Detected ({duplicates.length})</h4>
        </div>
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
          Merged for Priority
        </span>
      </div>

      <p className="text-xs text-amber-800 leading-relaxed">
        The natural language model correlated existing citizen filings nearby. Cluster weight has boosted this problem's urgency score to prevent duplicate work.
      </p>

      <div className="space-y-2">
        {duplicates.map((dup) => (
          <div
            key={dup.id}
            className="bg-white p-3.5 rounded-xl border border-amber-200 shadow-2xs flex items-center justify-between gap-3 hover:border-amber-300 transition-colors"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 truncate">{dup.title}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {dup.id}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                <span>📍 {dup.distanceKm} km away</span>
                <span>⏱️ {dup.reportedAt}</span>
                <span className="text-emerald-600 font-medium">
                  Match: {Math.round(dup.similarityScore * 100)}%
                </span>
              </div>
            </div>

            {onViewDuplicate && (
              <button
                onClick={() => onViewDuplicate(dup.id)}
                className="shrink-0 p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-slate-50 transition-colors"
                title="View original filing"
              >
                <ExternalLink size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export const ExpertMatchScore: React.FC<{
  partner: MatchedPartner;
  onConnect?: () => void;
}> = ({ partner, onConnect }) => {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              {partner.type}
            </span>
            <h4 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">{partner.name}</h4>
          </div>
          <div className="text-right shrink-0">
            <span className="text-xs font-black px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
              {partner.matchScore}% Match
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-3 mb-2">
          {partner.expertise.map((exp, idx) => (
            <span key={idx} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
              {exp}
            </span>
          ))}
        </div>

        <div className="text-xs text-slate-500 mt-2">
          <span>📍 {partner.location}</span> • <span>Contact: {partner.contactPerson}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[11px] text-slate-400 font-medium">AI Recommended</span>
        <button
          onClick={onConnect}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1"
        >
          <span>Initiate Collab</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
};
