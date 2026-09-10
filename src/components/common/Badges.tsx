import React from 'react';
import {
  AlertTriangle,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  Building2,
  Cpu,
} from 'lucide-react';
import { ChallengeSeverity, ChallengeStatus, ChallengeCategory } from '../../types';

export const SeverityBadge: React.FC<{ severity: ChallengeSeverity; size?: 'sm' | 'md' }> = ({
  severity,
  size = 'md',
}) => {
  const config = {
    Critical: {
      bg: 'bg-red-50 text-red-700 border-red-200 ring-red-500/10',
      dot: 'bg-red-600',
      icon: Flame,
    },
    High: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/10',
      dot: 'bg-amber-500',
      icon: AlertTriangle,
    },
    Medium: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/10',
      dot: 'bg-blue-500',
      icon: Clock,
    },
    Low: {
      bg: 'bg-slate-50 text-slate-700 border-slate-200 ring-slate-500/10',
      dot: 'bg-slate-500',
      icon: CheckCircle2,
    },
  }[severity];

  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ring-1 ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon size={size === 'sm' ? 12 : 13} className="shrink-0" />
      <span>{severity} Severity</span>
    </span>
  );
};

export const StatusBadge: React.FC<{ status: ChallengeStatus; size?: 'sm' | 'md' }> = ({
  status,
  size = 'md',
}) => {
  const config: Record<
    ChallengeStatus,
    { label: string; bg: string; icon: React.ComponentType<{ size?: number; className?: string }> }
  > = {
    Reported: {
      label: 'Reported',
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: Clock,
    },
    AI_Verified: {
      label: 'AI Verified',
      bg: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      icon: Sparkles,
    },
    Under_Review: {
      label: 'Under Review',
      bg: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: ShieldCheck,
    },
    Organization_Assigned: {
      label: 'Org Assigned',
      bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      icon: Building2,
    },
    Solution_Development: {
      label: 'In Solution',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: Cpu,
    },
    Implementation: {
      label: 'Implementation',
      bg: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: Clock,
    },
    Resolved: {
      label: 'Resolved',
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: CheckCircle2,
    },
  };

  const current = config[status] || config.Reported;
  const Icon = current.icon;
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-medium border ${current.bg} ${sizeClasses}`}
    >
      <Icon size={size === 'sm' ? 12 : 13} />
      <span>{current.label}</span>
    </span>
  );
};

export const CategoryBadge: React.FC<{ category: ChallengeCategory }> = ({ category }) => {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200/80">
      {category}
    </span>
  );
};

export const AIConfidenceBadge: React.FC<{ confidence: number }> = ({ confidence }) => {
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-900 border border-cyan-200 shadow-2xs">
      <Sparkles size={12} className="text-cyan-600" />
      <span>{confidence}% AI Confidence</span>
    </span>
  );
};
