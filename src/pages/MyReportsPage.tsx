import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  PlusCircle,
  MapPin,
  ChevronRight,
  TrendingUp,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SeverityBadge, StatusBadge, CategoryBadge } from '../components/common/Badges';
import { PriorityScoreGauge } from '../components/common/PriorityScoreGauge';

export const MyReportsPage: React.FC = () => {
  const { challenges, currentUser, setActiveChallengeId, setCurrentView } = useApp();
  const [activeTab, setActiveTab] = useState<'All' | 'Under_Review' | 'In_Progress' | 'Resolved'>('All');

  // Reports submitted by user or matching user ID
  const myReports = challenges.filter(
    (c) => c.reporterId === currentUser.id || c.reporterName === currentUser.name
  );

  const filteredReports = myReports.filter((c) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Under_Review') return c.status === 'Reported' || c.status === 'AI_Verified' || c.status === 'Under_Review';
    if (activeTab === 'In_Progress') return c.status === 'Organization_Assigned' || c.status === 'Solution_Development' || c.status === 'Implementation';
    if (activeTab === 'Resolved') return c.status === 'Resolved';
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Citizen Tracking
            </span>
            <span className="text-xs font-semibold text-slate-400">
              {myReports.length} Dispatches Registered
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            My Submitted Reports
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Track real-time remediation status, municipal assignments, and citizen audit feedback for your reports.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('report')}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-2"
        >
          <PlusCircle size={16} />
          <span>New Submission</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'All', label: `All Reports (${myReports.length})` },
          { id: 'Under_Review', label: 'Under Review' },
          { id: 'In_Progress', label: 'Remediation Active' },
          { id: 'Resolved', label: 'Resolved' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reports List */}
      {filteredReports.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs">
          <FileText size={36} className="mx-auto text-slate-300 mb-2" />
          <h3 className="text-base font-bold text-slate-800">No Reports in this Category</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You haven't filed any challenges matching this filter yet. Help your local community by reporting civic hazards.
          </p>
          <button
            onClick={() => setCurrentView('report')}
            className="mt-4 px-5 py-2.5 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm"
          >
            Report a Challenge Now
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReports.map((ch) => (
            <div
              key={ch.id}
              onClick={() => {
                setActiveChallengeId(ch.id);
                setCurrentView('challenge-detail');
              }}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-md hover:border-blue-300 cursor-pointer transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6 group"
            >
              <div className="space-y-2 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    #{ch.id}
                  </span>
                  <CategoryBadge category={ch.category} />
                  <SeverityBadge severity={ch.severity} size="sm" />
                  <StatusBadge status={ch.status} size="sm" />
                </div>

                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition-colors line-clamp-1">
                  {ch.title}
                </h3>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={13} className="text-slate-400" />
                    <span>{ch.location.address || ch.location.city}</span>
                  </span>
                  <span>•</span>
                  <span>Reported {ch.createdAt}</span>
                  <span>•</span>
                  <span>{ch.supportersCount} Supporters</span>
                </div>

                {/* Progress bar */}
                <div className="pt-2 max-w-md">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500 mb-1">
                    <span>Remediation Progress</span>
                    <span className="text-blue-600 font-bold">{ch.progressPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${ch.progressPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Right: Priority gauge and details arrow */}
              <div className="shrink-0 flex items-center gap-4">
                <PriorityScoreGauge score={ch.priorityScore} size="sm" />
                <span className="p-2 rounded-xl bg-slate-50 text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                  <ChevronRight size={18} />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
