import React, { useState } from 'react';
import {
  MapPin,
  Filter,
  Flame,
  AlertTriangle,
  Clock,
  Sparkles,
  ChevronRight,
  X,
  ThumbsUp,
  Layers,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LeafletMap } from '../components/common/LeafletMap';
import { SeverityBadge, StatusBadge, CategoryBadge } from '../components/common/Badges';
import { PriorityScoreGauge } from '../components/common/PriorityScoreGauge';
import { Challenge, ChallengeSeverity } from '../types';

export const MapViewPage: React.FC = () => {
  const { challenges, setActiveChallengeId, setCurrentView, toggleSupport } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [activeSeverity, setActiveSeverity] = useState<string>('All');
  const [selectedMapItem, setSelectedMapItem] = useState<Challenge | null>(null);

  const categories = ['All', 'Disaster', 'Water', 'Infrastructure', 'Waste', 'Healthcare', 'Environment', 'Public Safety'];

  const filteredChallenges = challenges.filter((c) => {
    if (activeCategory !== 'All' && c.category !== activeCategory) return false;
    if (activeSeverity !== 'All' && c.severity !== activeSeverity) return false;
    return true;
  });

  const criticalCount = challenges.filter((c) => c.severity === 'Critical').length;
  const highCount = challenges.filter((c) => c.severity === 'High').length;

  return (
    <div className="space-y-4 pb-12">
      {/* Top Header & Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              Geospatial Operations
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Live National Disaster Heatmap
            </span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Live Societal & Disaster Map
          </h1>
        </div>

        {/* Quick summary badges */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveSeverity(activeSeverity === 'Critical' ? 'All' : 'Critical')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              activeSeverity === 'Critical'
                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                : 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
            }`}
          >
            <Flame size={14} />
            <span>{criticalCount} Critical Hotspots</span>
          </button>

          <button
            onClick={() => setActiveSeverity(activeSeverity === 'High' ? 'All' : 'High')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              activeSeverity === 'High'
                ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            <AlertTriangle size={14} />
            <span>{highCount} High Alerts</span>
          </button>
        </div>
      </div>

      {/* Filter Category Row */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Map Layout Container */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-sm bg-white">
        {/* Leaflet Map Component */}
        <LeafletMap
          challenges={filteredChallenges}
          selectedChallengeId={selectedMapItem?.id}
          onSelectChallenge={(ch) => setSelectedMapItem(ch)}
          height="620px"
        />

        {/* Floating Legend Overlay */}
        <div className="absolute top-4 left-4 z-10 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200 shadow-lg text-xs space-y-2 hidden sm:block">
          <div className="font-bold text-slate-900 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <Layers size={13} className="text-blue-600" />
            <span>Threat Pin Severity</span>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 ring-2 ring-red-200 animate-ping" />
              <span className="font-semibold text-slate-700">Critical (Flood, Fire, Collapse)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="font-semibold text-slate-700">High (Water Choke, Power Outage)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="font-semibold text-slate-700">Medium (Road Potholes, Waste)</span>
            </div>
          </div>
        </div>

        {/* Side Drawer when a pin is selected */}
        {selectedMapItem && (
          <div className="absolute top-4 right-4 bottom-4 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 shadow-2xl p-5 z-20 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-200">
            <div>
              <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-100">
                <div className="flex flex-wrap items-center gap-1.5">
                  <CategoryBadge category={selectedMapItem.category} />
                  <SeverityBadge severity={selectedMapItem.severity} size="sm" />
                </div>
                <button
                  onClick={() => setSelectedMapItem(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="mt-3">
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  #{selectedMapItem.id}
                </span>
                <h3 className="font-bold text-slate-900 text-base leading-snug mt-0.5">
                  {selectedMapItem.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                  {selectedMapItem.description}
                </p>
              </div>

              {/* Photo thumbnail */}
              {selectedMapItem.evidence?.images && selectedMapItem.evidence.images.length > 0 && (
                <div className="mt-3 rounded-xl overflow-hidden aspect-video border border-slate-200">
                  <img
                    src={selectedMapItem.evidence.images[0]}
                    alt={selectedMapItem.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Stats */}
              <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Location:</span>
                  <span className="font-bold text-slate-900">{selectedMapItem.location.city}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Population Impact:</span>
                  <span className="font-bold text-emerald-600">
                    ~{selectedMapItem.aiAnalysis.affectedPopulationEstimate.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Status:</span>
                  <StatusBadge status={selectedMapItem.status} size="sm" />
                </div>
              </div>

              <div className="mt-3">
                <PriorityScoreGauge score={selectedMapItem.priorityScore} size="sm" />
              </div>
            </div>

            {/* Bottom buttons */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                onClick={() => {
                  setActiveChallengeId(selectedMapItem.id);
                  setCurrentView('challenge-detail');
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Full Challenge View</span>
                <ChevronRight size={14} />
              </button>

              <button
                onClick={() => toggleSupport(selectedMapItem.id)}
                className={`p-2.5 rounded-xl border text-xs font-bold transition-colors ${
                  selectedMapItem.isSupportedByMe
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
                title="Support Issue"
              >
                <ThumbsUp size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
