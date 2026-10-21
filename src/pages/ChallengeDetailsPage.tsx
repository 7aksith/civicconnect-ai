import React, { useState } from 'react';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  ThumbsUp,
  Share2,
  Sparkles,
  Building2,
  ShieldCheck,
  Flame,
  CheckCircle2,
  MessageSquare,
  Send,
  AlertTriangle,
  Play,
  Volume2,
  Bot,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SeverityBadge, StatusBadge, CategoryBadge, AIConfidenceBadge } from '../components/common/Badges';
import { PriorityScoreGauge } from '../components/common/PriorityScoreGauge';
import { AIAnalysisCard, DuplicateDetectionCard, ExpertMatchScore } from '../components/ai/AIComponents';
import { ChallengeStatus } from '../types';

export const ChallengeDetailsPage: React.FC = () => {
  const {
    selectedChallenge,
    setCurrentView,
    toggleSupport,
    addComment,
    currentUser,
    updateChallengeStatus,
    assignOrganizationToChallenge,
    addToast,
    challenges,
    setActiveChallengeId,
  } = useApp();

  const [commentText, setCommentText] = useState('');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedOrgToAssign, setSelectedOrgToAssign] = useState({
    id: 'org-1',
    name: 'SEEDS India Rapid Disaster Response',
    type: 'NGO',
  });

  if (!selectedChallenge) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900">No Challenge Selected</h2>
        <p className="text-slate-500 text-sm mt-1">Please select an issue from the list or map.</p>
        <button
          onClick={() => setCurrentView('explore')}
          className="mt-4 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs"
        >
          Explore Challenges
        </button>
      </div>
    );
  }

  const ch = selectedChallenge;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast({
      type: 'success',
      title: 'Link Copied',
      message: `Direct link for Challenge #${ch.id} copied to clipboard.`,
    });
  };

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    addComment(ch.id, commentText);
    setCommentText('');
  };

  const timelineSteps: { status: ChallengeStatus; label: string }[] = [
    { status: 'Reported', label: 'Reported' },
    { status: 'AI_Verified', label: 'AI Verified' },
    { status: 'Under_Review', label: 'Under Review' },
    { status: 'Organization_Assigned', label: 'Org Assigned' },
    { status: 'Solution_Development', label: 'In Solution' },
    { status: 'Implementation', label: 'Implementation' },
    { status: 'Resolved', label: 'Resolved' },
  ];

  const currentStepIndex = timelineSteps.findIndex((s) => s.status === ch.status);

  // Similar challenges (filter same category excluding self)
  const similarChallenges = challenges
    .filter((c) => c.category === ch.category && c.id !== ch.id)
    .slice(0, 3);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <button
          onClick={() => setCurrentView('explore')}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white px-3.5 py-2 rounded-xl border border-slate-200 transition-colors shadow-2xs"
        >
          <ArrowLeft size={16} />
          <span>Back to Challenges</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleSupport(ch.id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              ch.isSupportedByMe
                ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <ThumbsUp size={15} />
            <span>{ch.isSupportedByMe ? 'Supported' : 'Support Issue'}</span>
            <span className="px-1.5 py-0.5 rounded bg-black/10 text-[10px] font-extrabold">
              {ch.supportersCount}
            </span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
          >
            <Share2 size={15} />
            <span>Share</span>
          </button>

          {/* Authority Quick Actions */}
          {currentUser.role === 'authority' && (
            <div className="flex items-center gap-2">
              <select
                value={ch.status}
                onChange={(e) => updateChallengeStatus(ch.id, e.target.value as ChallengeStatus)}
                className="text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 rounded-xl px-3 py-2 outline-none"
              >
                {timelineSteps.map((s) => (
                  <option key={s.status} value={s.status}>
                    Set: {s.label}
                  </option>
                ))}
              </select>

              <button
                onClick={() => setIsAssignModalOpen(true)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
              >
                Assign Partner
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Card Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700">
              #{ch.id}
            </span>
            <CategoryBadge category={ch.category} />
            <SeverityBadge severity={ch.severity} />
            <StatusBadge status={ch.status} />
          </div>

          <PriorityScoreGauge score={ch.priorityScore} size="sm" />
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-snug">
            {ch.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <MapPin size={15} className="text-blue-600" />
              <span>{ch.location.address}, {ch.location.city}, {ch.location.state} ({ch.location.pincode})</span>
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock size={15} className="text-slate-400" />
              <span>Reported {ch.createdAt}</span>
            </span>
            <span>•</span>
            <span>Reporter: <strong className="text-slate-700">{ch.reporterName}</strong></span>
          </div>
        </div>

        {/* Status Lifecycle Progress Bar */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 uppercase tracking-wider text-[11px]">
              Remediation Lifecycle Progress
            </span>
            <span className="text-blue-600 font-mono">{ch.progressPercent}% Completed</span>
          </div>

          {/* Progress bar line */}
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${ch.progressPercent}%` }}
            />
          </div>

          {/* Steps Timeline Icons */}
          <div className="grid grid-cols-7 gap-1 pt-2">
            {timelineSteps.map((step, idx) => {
              const isPast = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div key={step.status} className="text-center">
                  <div
                    className={`w-7 h-7 mx-auto rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                        : isPast
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isPast ? <CheckCircle2 size={14} /> : idx + 1}
                  </div>
                  <span
                    className={`block mt-1.5 text-[10px] truncate ${
                      isCurrent ? 'font-bold text-blue-600' : isPast ? 'font-medium text-slate-700' : 'text-slate-400'
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Grid: Details + AI Rationale + Assigned Org */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-8">
          {/* Detailed Description */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Incident Narrative & On-Ground Situation</h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {ch.description}
            </p>

            {/* If assigned organization exists */}
            {ch.assignedOrganization && (
              <div className="mt-4 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-600 text-white">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700">
                      Mobilized Field Partner
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {ch.assignedOrganization.name}
                    </h4>
                    <span className="text-xs text-indigo-600 font-medium">
                      Type: {ch.assignedOrganization.type}
                    </span>
                  </div>
                </div>
                <span className="px-3 py-1 bg-white text-indigo-800 text-xs font-bold rounded-full border border-indigo-200">
                  Active in Field
                </span>
              </div>
            )}
          </div>

          {/* Evidence Gallery */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Multi-Modal Evidence Record</h3>
              <span className="text-xs text-slate-400">
                {ch.images.length} Photos • {ch.voiceNotesCount} Audio Note
              </span>
            </div>

            {/* Photos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {ch.images.map((imgUrl, i) => (
                <div
                  key={i}
                  className="group relative rounded-2xl overflow-hidden border border-slate-200 aspect-video bg-slate-100"
                >
                  <img
                    src={imgUrl}
                    alt={`Evidence ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <span className="text-white text-xs font-bold">Field Photographic Verification #{i + 1}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Audio Evidence preview if voice note exists */}
            {ch.voiceNotesCount > 0 && (
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className="w-10 h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-sm"
                  >
                    <Play size={18} className={isPlayingAudio ? 'animate-spin' : ''} />
                  </button>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      Citizen Voice Dispatch (00:24)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      AI Transcribed: "Water rising over curb, pedestrian footpath submerged..."
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-slate-400 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                  Audio telemetry
                </span>
              </div>
            )}
          </div>

          {/* AI Comprehensive Analysis Card */}
          <AIAnalysisCard analysis={ch.aiAnalysis} challengeTitle={ch.title} />

          {/* Timeline Audit Trail */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">Official Action Timeline</h3>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {ch.timelineEvents.map((evt, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-blue-600 border-2 border-white ring-2 ring-blue-100" />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{evt.title}</span>
                    <span className="text-slate-400 font-mono">{evt.timestamp}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5">{evt.description}</p>
                  {evt.actor && (
                    <span className="inline-block mt-1 text-[10px] text-slate-400 font-medium">
                      By: {evt.actor}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Public Discussion & Comments */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare size={18} className="text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Community Field Discussion ({ch.comments.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400">Moderated civic forum</span>
            </div>

            {/* Post comment input */}
            <form onSubmit={handlePostComment} className="flex gap-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={`Share an update or observation as ${currentUser.name}...`}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Send size={14} />
                <span>Post</span>
              </button>
            </form>

            {/* Comments list */}
            <div className="space-y-4 divide-y divide-slate-100">
              {ch.comments.map((cm) => (
                <div key={cm.id} className="pt-4 first:pt-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <img
                        src={cm.userAvatar}
                        alt={cm.userName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-xs font-bold text-slate-900">{cm.userName}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 uppercase">
                        {cm.userRole}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400">{cm.createdAt}</span>
                  </div>
                  <p className="text-xs text-slate-600 pl-8 leading-relaxed">{cm.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: AI Matched Partners & Similar Issues */}
        <div className="space-y-6">
          {/* Matched Solution Partners */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900">AI Matched Partners</h3>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                Civic Match Engine
              </span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Based on the disaster severity and geotechnical profile, the following vetted entities are ranked for immediate mobilization:
            </p>

            <div className="space-y-3">
              {[
                {
                  id: 'org-1',
                  name: 'SEEDS India Rapid Disaster Response',
                  type: 'NGO' as const,
                  matchScore: 96,
                  expertise: ['Flood Mitigation', 'Emergency Shelter'],
                  location: 'NCR Headquarters',
                  contactPerson: 'Priya Mukherjee',
                },
                {
                  id: 'org-4',
                  name: 'National Disaster Response Force (NDRF)',
                  type: 'Authority' as const,
                  matchScore: 93,
                  expertise: ['Search & Rescue', 'Evacuation'],
                  location: '8th Battalion Command',
                  contactPerson: 'Cmdt. P. K. Singh',
                },
                {
                  id: 'org-2',
                  name: 'IIT Delhi Civil & Hydraulic Lab',
                  type: 'University' as const,
                  matchScore: 88,
                  expertise: ['Stormwater Modeling'],
                  location: 'Hauz Khas, New Delhi',
                  contactPerson: 'Prof. A. Bansal',
                },
              ].map((p) => (
                <ExpertMatchScore
                  key={p.id}
                  partner={p}
                  onConnect={() => {
                    addToast({
                      type: 'success',
                      title: 'Collaboration Request Dispatched',
                      message: `Liaison alert transmitted to ${p.name}.`,
                    });
                  }}
                />
              ))}
            </div>
          </div>

          {/* Similar Challenges Radar */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Similar Community Challenges</h3>
            <p className="text-xs text-slate-500">Other nearby issues within the {ch.category} sector</p>

            <div className="space-y-3">
              {similarChallenges.map((sc) => (
                <div
                  key={sc.id}
                  onClick={() => {
                    setActiveChallengeId(sc.id);
                  }}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-blue-50/50 border border-slate-200/80 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs font-bold text-slate-900 mb-1">
                    <span className="truncate pr-2">{sc.title}</span>
                    <span className="text-[10px] text-blue-600 shrink-0 font-mono">#{sc.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                    <span>📍 {sc.location.city}</span>
                    <span className="font-semibold text-slate-700">Priority: {sc.priorityScore}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Assign Organization Modal (For Authorities) */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-slate-200 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Assign Partner Organization</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Dispatch an accredited NGO, University lab, or Disaster unit to Challenge #{ch.id}
              </p>
            </div>

            <div className="space-y-3">
              {[
                { id: 'org-1', name: 'SEEDS India Rapid Disaster Response', type: 'NGO' },
                { id: 'org-4', name: 'National Disaster Response Force (NDRF)', type: 'Authority' },
                { id: 'org-2', name: 'IIT Delhi Hydraulic Engineering Lab', type: 'University' },
                { id: 'org-3', name: 'FloodSense AI Satellite GeoSpatial', type: 'Startup' },
              ].map((org) => (
                <div
                  key={org.id}
                  onClick={() => setSelectedOrgToAssign(org)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-colors ${
                    selectedOrgToAssign.id === org.id
                      ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold'
                      : 'border-slate-200 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs">
                    <span>{org.name}</span>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-white border border-slate-200">
                      {org.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  assignOrganizationToChallenge(
                    ch.id,
                    selectedOrgToAssign.id,
                    selectedOrgToAssign.name,
                    selectedOrgToAssign.type
                  );
                  setIsAssignModalOpen(false);
                }}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
              >
                Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
