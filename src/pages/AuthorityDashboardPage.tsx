import React, { useState } from 'react';
import {
  ShieldAlert,
  Flame,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Users,
  Building2,
  Filter,
  Search,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Bot,
  Copy,
  Layers,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SeverityBadge, StatusBadge, CategoryBadge } from '../components/common/Badges';
import { PriorityScoreGauge } from '../components/common/PriorityScoreGauge';
import { Challenge, ChallengeStatus } from '../types';

export const AuthorityDashboardPage: React.FC = () => {
  const {
    challenges,
    setActiveChallengeId,
    setCurrentView,
    updateChallengeStatus,
    assignOrganizationToChallenge,
    addToast,
  } = useApp();

  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal for Triage Action
  const [activeModalChallenge, setActiveModalChallenge] = useState<Challenge | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<ChallengeStatus>('Under_Review');
  const [authorityNote, setAuthorityNote] = useState<string>('');
  const [selectedOrgId, setSelectedOrgId] = useState<string>('org-1');

  // Stats
  const criticalCount = challenges.filter((c) => c.severity === 'Critical').length;
  const highCount = challenges.filter((c) => c.severity === 'High').length;
  const underReviewCount = challenges.filter((c) => c.status === 'Reported' || c.status === 'AI_Verified' || c.status === 'Under_Review').length;
  const assignedCount = challenges.filter((c) => c.status === 'Organization_Assigned' || c.status === 'Implementation').length;

  const sortedAndFiltered = challenges
    .filter((ch) => {
      if (severityFilter !== 'All' && ch.severity !== severityFilter) return false;
      if (statusFilter !== 'All' && ch.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        if (
          !ch.title.toLowerCase().includes(q) &&
          !ch.location.city.toLowerCase().includes(q) &&
          !ch.id.toLowerCase().includes(q)
        ) {
          return false;
        }
      }
      return true;
    })
    .sort((a, b) => b.priorityScore - a.priorityScore); // Critical / High priority first!

  const handleOpenTriageModal = (ch: Challenge) => {
    setActiveModalChallenge(ch);
    setSelectedStatus(ch.status);
    setAuthorityNote('');
  };

  const handleApplyTriageAction = () => {
    if (!activeModalChallenge) return;
    updateChallengeStatus(activeModalChallenge.id, selectedStatus, authorityNote);
    setActiveModalChallenge(null);
  };

  const handleMergeDuplicates = (chId: string) => {
    addToast({
      type: 'success',
      title: 'Duplicate Cluster Merged',
      message: `Merged 2 auxiliary citizen reports into master file #${chId}. Priority score recalculation queued.`,
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-red-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-red-900/40 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-red-600 text-white uppercase tracking-wider">
              Emergency Command Center
            </span>
            <span className="text-xs text-red-300 font-semibold">
              NDMA / Municipal Incident Triage Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Authority Priority Triage & Dispatch
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Instant prioritization queue driven by CivicConnect AI. Review NLP hazard evaluations, allocate response battalions, and resolve citizen bottlenecks.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setCurrentView('map')}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-red-600/30 flex items-center gap-2"
          >
            <Flame size={16} />
            <span>Open Disaster Heatmap</span>
          </button>
        </div>
      </div>

      {/* Priority Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-red-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
              Critical Emergency Queue
            </span>
            <Flame size={18} className="text-red-600" />
          </div>
          <div className="text-3xl font-black text-red-600">{criticalCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Requires dispatch under 60 minutes</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-amber-700 uppercase tracking-wider">
              High Severity Pending
            </span>
            <AlertTriangle size={18} className="text-amber-600" />
          </div>
          <div className="text-3xl font-black text-amber-600">{highCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">Inspection required within 24h</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
              In Remediation
            </span>
            <Building2 size={18} className="text-blue-600" />
          </div>
          <div className="text-3xl font-black text-blue-600">{assignedCount}</div>
          <p className="text-[11px] text-slate-500 mt-1">NGOs & NDRF units active</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-2xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
              AI Confidence Average
            </span>
            <Sparkles size={18} className="text-emerald-600" />
          </div>
          <div className="text-3xl font-black text-slate-900">93.4%</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Verified triage accuracy</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search priority tickets by ID, problem description, or district..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:border-red-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 outline-none"
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical Priority Only</option>
            <option value="High">High Severity</option>
            <option value="Medium">Medium</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-700 outline-none"
          >
            <option value="All">All Lifecycles</option>
            <option value="Reported">Reported</option>
            <option value="AI_Verified">AI Verified</option>
            <option value="Under_Review">Under Review</option>
            <option value="Organization_Assigned">Org Assigned</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Priority Triage Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-slate-900 text-base">Priority Dispatch Queue</h3>
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-700">
              Sorted by AI Risk Score
            </span>
          </div>
          <span className="text-xs text-slate-400">
            Showing {sortedAndFiltered.length} Active Records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-4">Priority Score</th>
                <th className="p-4">Challenge & Details</th>
                <th className="p-4">Location</th>
                <th className="p-4">AI Severity</th>
                <th className="p-4">Status</th>
                <th className="p-4">Duplicates</th>
                <th className="p-4 text-right">Command Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {sortedAndFiltered.map((ch) => (
                <tr key={ch.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    <PriorityScoreGauge score={ch.priorityScore} size="sm" />
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-slate-900 text-sm line-clamp-1">{ch.title}</div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                      <span className="font-mono text-slate-400">#{ch.id}</span>
                      <span>•</span>
                      <span>~{ch.aiAnalysis.affectedPopulationEstimate.toLocaleString()} affected</span>
                      <span>•</span>
                      <span>{ch.createdAt}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">
                    <div>{ch.location.city}</div>
                    <div className="text-[10px] text-slate-400 truncate max-w-[140px]">
                      {ch.location.address}
                    </div>
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <SeverityBadge severity={ch.severity} size="sm" />
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    <StatusBadge status={ch.status} size="sm" />
                  </td>
                  <td className="p-4 whitespace-nowrap">
                    {ch.aiAnalysis.duplicatesDetected.length > 0 ? (
                      <button
                        onClick={() => handleMergeDuplicates(ch.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-[11px] font-bold hover:bg-amber-100 transition-colors"
                      >
                        <Copy size={12} />
                        <span>{ch.aiAnalysis.duplicatesDetected.length} Flagged (Merge)</span>
                      </button>
                    ) : (
                      <span className="text-slate-400 text-[11px] font-medium">Unique</span>
                    )}
                  </td>
                  <td className="p-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenTriageModal(ch)}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-xs shadow-2xs transition-colors"
                      >
                        Triage
                      </button>
                      <button
                        onClick={() => {
                          setActiveChallengeId(ch.id);
                          setCurrentView('challenge-detail');
                        }}
                        className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-blue-600 hover:bg-slate-50"
                        title="View Full File"
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Triage Action Modal */}
      {activeModalChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-red-50 text-red-700 border border-red-200">
                  Incident Triage Protocol
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Manage #{activeModalChallenge.id}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">{activeModalChallenge.title}</p>
              </div>
              <PriorityScoreGauge score={activeModalChallenge.priorityScore} size="sm" />
            </div>

            {/* AI Recommendation Box */}
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-blue-900">
                <Bot size={15} />
                <span>AI Recommended Directive</span>
              </div>
              <p className="text-blue-800 leading-relaxed">
                {activeModalChallenge.aiAnalysis.recommendedAction}
              </p>
            </div>

            {/* Status Change */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Set Lifecycle Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as ChallengeStatus)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 outline-none focus:border-blue-500"
              >
                <option value="Reported">Reported</option>
                <option value="AI_Verified">AI Verified</option>
                <option value="Under_Review">Under Review</option>
                <option value="Organization_Assigned">Organization Assigned</option>
                <option value="Solution_Development">Solution Development</option>
                <option value="Implementation">Implementation (In Progress)</option>
                <option value="Resolved">Resolved (Verified)</option>
              </select>
            </div>

            {/* Field Partner Selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Dispatch / Notify Partner Organization
              </label>
              <select
                value={selectedOrgId}
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 outline-none focus:border-blue-500"
              >
                <option value="org-1">SEEDS India Rapid Disaster Response (NGO)</option>
                <option value="org-4">National Disaster Response Force (NDRF - Authority)</option>
                <option value="org-2">IIT Delhi Civil & Hydraulic Lab (University)</option>
                <option value="org-3">FloodSense AI Satellite GeoSpatial (Startup)</option>
              </select>
            </div>

            {/* Internal notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Official Authority Log Note
              </label>
              <textarea
                rows={3}
                value={authorityNote}
                onChange={(e) => setAuthorityNote(e.target.value)}
                placeholder="Log notes regarding municipal pump dispatch, earthmover requisition, or field status..."
                className="w-full p-3 rounded-xl border border-slate-200 text-xs outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setActiveModalChallenge(null)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyTriageAction}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/20 transition-all"
              >
                Apply & Dispatch Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
