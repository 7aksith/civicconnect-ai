import React, { useState } from 'react';
import {
  Bell,
  CheckCheck,
  Sparkles,
  ShieldCheck,
  Building2,
  Users,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsPage: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    setActiveChallengeId,
    setCurrentView,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'All' | 'Unread' | 'AI'>('All');

  const filtered = notifications.filter((n) => {
    if (activeTab === 'Unread') return !n.isRead;
    if (activeTab === 'AI') return n.type === 'AI_ANALYSIS';
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'AI_ANALYSIS':
        return <Sparkles size={16} className="text-cyan-600" />;
      case 'STATUS_CHANGE':
        return <Clock size={16} className="text-blue-600" />;
      case 'ORG_ASSIGNED':
        return <Building2 size={16} className="text-indigo-600" />;
      case 'SUPPORT_MILESTONE':
        return <Users size={16} className="text-emerald-600" />;
      default:
        return <Bell size={16} className="text-slate-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Notification Dispatch
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Activity & AI Alert Center
          </h1>
          <p className="text-sm text-slate-600 mt-0.5">
            Real-time updates on your filings, AI classification telemetry, and partner deployments.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-colors shadow-2xs"
        >
          <CheckCheck size={16} />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'All', label: 'All Notifications' },
          { id: 'Unread', label: 'Unread Only' },
          { id: 'AI', label: 'AI Intelligence Logs' },
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

      {/* Notifications List */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Bell size={36} className="mx-auto text-slate-300 mb-2" />
            <h3 className="font-bold text-slate-800 text-sm">No Notifications Found</h3>
            <p className="text-xs text-slate-500 mt-1">You're all caught up with your civic radar alerts.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                markNotificationRead(item.id);
                if (item.challengeId) {
                  setActiveChallengeId(item.challengeId);
                  setCurrentView('challenge-detail');
                }
              }}
              className={`p-5 flex items-start gap-4 hover:bg-slate-50 cursor-pointer transition-colors ${
                !item.isRead ? 'bg-blue-50/30' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/80">
                {getIcon(item.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-900 leading-snug">
                    {item.title}
                  </h4>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {item.createdAt}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {item.message}
                </p>

                {item.challengeId && (
                  <div className="mt-2.5 flex items-center gap-1 text-xs font-bold text-blue-600">
                    <span>Inspect Challenge #{item.challengeId}</span>
                    <ArrowRight size={13} />
                  </div>
                )}
              </div>

              {!item.isRead && (
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 mt-2" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
