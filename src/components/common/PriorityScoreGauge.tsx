import React from 'react';

interface PriorityScoreGaugeProps {
  score: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const PriorityScoreGauge: React.FC<PriorityScoreGaugeProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const getColor = (s: number) => {
    if (s >= 85) return { stroke: '#ef4444', text: 'text-red-600', bg: 'bg-red-50 border-red-200' };
    if (s >= 70) return { stroke: '#f59e0b', text: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
    if (s >= 50) return { stroke: '#2563eb', text: 'text-blue-600', bg: 'bg-blue-50 border-blue-200' };
    return { stroke: '#10b981', text: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-200' };
  };

  const color = getColor(score);

  if (size === 'sm') {
    return (
      <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-bold ${color.bg} ${color.text}`}>
        <span>Priority: {score}/100</span>
      </div>
    );
  }

  // Circular gauge for md and lg
  const radius = size === 'lg' ? 44 : 32;
  const strokeWidth = size === 'lg' ? 7 : 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const svgSize = (radius + strokeWidth) * 2;

  return (
    <div className="flex items-center gap-3">
      <div className="relative inline-flex items-center justify-center shrink-0">
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`font-black tracking-tight ${size === 'lg' ? 'text-2xl' : 'text-base'} ${color.text}`}>
            {score}
          </span>
          {size === 'lg' && <span className="text-[10px] text-slate-400 font-semibold -mt-1">/100</span>}
        </div>
      </div>

      {showLabel && (
        <div>
          <div className="text-[11px] uppercase tracking-wider font-bold text-slate-400">AI Priority Score</div>
          <div className={`text-sm font-bold ${color.text}`}>
            {score >= 85 ? 'Critical Emergency' : score >= 70 ? 'High Civic Action' : score >= 50 ? 'Standard Priority' : 'Routine Queued'}
          </div>
        </div>
      )}
    </div>
  );
};
