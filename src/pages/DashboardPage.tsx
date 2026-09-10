import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  Award,
  PlusCircle,
  MapPin,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  Filter,
  Flame,
  Users,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SeverityBadge, StatusBadge, CategoryBadge } from '../components/common/Badges';
import { PriorityScoreGauge } from '../components/common/PriorityScoreGauge';
import { Challenge } from '../types';

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    challenges,
    setCurrentView,
    setActiveChallengeId,
    setSelectedMapChallenge,
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<string>('All');

  // Stats
  const myReports = challenges.filter((c) => c.reportedBy.id === currentUser.id);
  const totalReported = challenges.length;
  const inProgressCount = challenges.filter((c) =>
    ['Under_Review', 'Organization_Assigned', 'Solution_Development', 'Implementation'].includes(c.status)
  ).length;
  const resolvedCount = challenges.filter((c) => c.status === 'Resolved').length;
  const criticalCount = challenges.filter((c) => c.severity === 'Critical').length;

  const filteredChallenges =
    filterCategory === 'All'
      ? challenges
      : challenges.filter((c) => c.category === filterCategory);

  const handleOpenChallenge = (challenge: Challenge) => {
    setActiveChallengeId(challenge.id);
    setCurrentView('challenge-detail');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Citizen Operations Center
            </span>
            <span className="text-xs font-semibold text-slate-400">
              📍 {currentUser.city}, {currentUser.state}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Monitor real-time civic disaster reports, AI automated triage classifications, and collaborate with municipal agencies to resolve critical hazards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentView('report')}
            className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>Report New Challenge</span>
          </button>
          <button
            onClick={() => setCurrentView('map')}
            className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
          >
            <MapPin size={16} className="text-blue-600" />
            <span>Open Live Map</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-200 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Challenges
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <FileText size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{totalReported}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-blue-600">
            <span>{criticalCount} critical emergencies</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-amber-200 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              In Remediation
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Clock size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{inProgressCount}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-amber-600">
            <span>Field teams actively deployed</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-emerald-200 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Resolved Hazards
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{resolvedCount}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
            <span>Verified by on-ground audit</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-purple-200 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Reputation Points
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Award size={18} />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900">{currentUser.reputationScore}</div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-purple-600">
            <span>Level 4 Civic Sentinel</span>
          </div>
        </div>
      </div>

      {/* Main Content: Recent Challenges + AI Insights Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Feed of Challenges */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Recent Societal Challenges</h2>
              <p className="text-xs text-slate-500">Real-time crowdsourced reports categorized by AI</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {['All', 'Disaster', 'Water', 'Infrastructure', 'Environment'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilterCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                    filterCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredChallenges.slice(0, 4).map((ch) => (
              <div
                key={ch.id}
                onClick={() => handleOpenChallenge(ch)}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-200 cursor-pointer transition-all group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={ch.category} />
                    <SeverityBadge severity={ch.severity} size="sm" />
                    <StatusBadge status={ch.status} size="sm" />
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 font-bold">
                    #{ch.id}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-1">
                      {ch.title}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {ch.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3.5">
                      <span className="flex items-center gap-1 font-medium">
                        <MapPin size={13} className="text-slate-400" />
                        <span>{ch.location.city}, {ch.location.state}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Clock size={13} className="text-slate-400" />
                        <span>{ch.createdAt}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-semibold text-blue-600">
                        <Users size={13} />
                        <span>{ch.supportersCount} Supporters</span>
                      </span>
                    </div>
                  </div>

                  {/* Priority score snippet */}
                  <div className="shrink-0 sm:border-l sm:border-slate-100 sm:pl-4 flex sm:flex-col items-center sm:items-end justify-between">
                    <PriorityScoreGauge score={ch.priorityScore} size="sm" />
                    <span className="text-[11px] text-slate-400 mt-2 font-medium">
                      ~{ch.aiAnalysis.affectedPopulationEstimate.toLocaleString()} affected
                    </span>
                  </div>
                </div>

                {/* AI Rationale tag if critical */}
                {ch.severity === 'Critical' && (
                  <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 text-red-600 font-bold">
                      <Flame size={14} />
                      <span>{ch.aiAnalysis.urgencyLevel} Emergency Triage Active</span>
                    </div>
                    <span className="text-blue-600 font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      <span>Review Details</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setCurrentView('explore')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 shadow-2xs transition-colors"
            >
              <span>View All {challenges.length} Community Challenges</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Right Column: AI Triage Insights & Recommended Citizen Actions */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-lg border border-blue-900/40 relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 rounded-xl bg-cyan-400/20 text-cyan-300">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold">Regional AI Risk Forecast</h3>
                <span className="text-[10px] text-slate-400">SIH NLP Engine • Active Radar</span>
              </div>
            </div>

            <div className="space-y-3.5 text-xs text-slate-300">
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between text-white font-bold mb-1">
                  <span>Monsoon Waterlogging Cluster</span>
                  <span className="text-amber-400">+38% Surge</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  Dense clustering of drainage choke reports in Yamuna floodplain and low-lying railway underpasses. Priority weighted to 94/100.
                </p>
              </div>

              <div className="bg-white/5 p-3.5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between text-white font-bold mb-1">
                  <span>Partner Response Rate</span>
                  <span className="text-emerald-400">92% Assigned</span>
                </div>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  NDRF and SEEDS India matched to 14 severe structural reports within 45 minutes of verification.
                </p>
              </div>
            </div>

            <button
              onClick={() => setCurrentView('impact')}
              className="mt-5 w-full py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-extrabold text-xs hover:bg-cyan-300 transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore Analytics Dashboard</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Recommended Citizen Actions */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs">
            <h3 className="text-base font-bold text-slate-900 mb-1">Recommended Actions</h3>
            <p className="text-xs text-slate-500 mb-4">Steps to increase impact in your locality</p>

            <div className="space-y-3">
              <div
                onClick={() => {
                  setActiveChallengeId('CC-SIH-901');
                  setCurrentView('challenge-detail');
                }}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                  <span>Verify Sector 14 Drainage Choke</span>
                  <span className="text-[10px] text-blue-600">Nearby</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Municipal team claims pump deployed. Upload photo verification to confirm flow.
                </p>
              </div>

              <div
                onClick={() => setCurrentView('report')}
                className="p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 cursor-pointer transition-colors"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                  <span>Report Streetlight Outages</span>
                  <span className="text-[10px] text-emerald-600">+50 Pts</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Help map dark spots along the Outer Ring Road to improve nighttime pedestrian safety.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
