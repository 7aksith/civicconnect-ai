import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  MapPin,
  Clock,
  Users,
  ThumbsUp,
  Sparkles,
  ArrowUpDown,
  Flame,
  CheckCircle2,
  ChevronRight,
  SplitSquareVertical,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SeverityBadge, StatusBadge, CategoryBadge } from '../components/common/Badges';
import { PriorityScoreGauge } from '../components/common/PriorityScoreGauge';
import { LeafletMap } from '../components/common/LeafletMap';
import { ChallengeCategory, ChallengeSeverity, ChallengeStatus, Challenge } from '../types';

export const ExploreChallengesPage: React.FC = () => {
  const { challenges, setActiveChallengeId, setCurrentView, toggleSupport } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'priority' | 'newest' | 'supporters' | 'affected'>('priority');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'split'>('grid');

  const categories = ['All', 'Disaster', 'Water', 'Infrastructure', 'Waste', 'Healthcare', 'Environment', 'Public Safety'];
  const severities = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const statuses = ['All', 'Reported', 'AI_Verified', 'Under_Review', 'Organization_Assigned', 'Solution_Development', 'Implementation', 'Resolved'];

  const filteredChallenges = useMemo(() => {
    return challenges
      .filter((ch) => {
        // Search term matching
        if (searchTerm.trim()) {
          const q = searchTerm.toLowerCase();
          const matchTitle = ch.title.toLowerCase().includes(q);
          const matchDesc = ch.description.toLowerCase().includes(q);
          const matchCity = ch.location.city.toLowerCase().includes(q);
          const matchId = ch.id.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCity && !matchId) return false;
        }

        // Category filter
        if (selectedCategory !== 'All' && ch.category !== selectedCategory) return false;

        // Severity filter
        if (selectedSeverity !== 'All' && ch.severity !== selectedSeverity) return false;

        // Status filter
        if (selectedStatus !== 'All' && ch.status !== selectedStatus) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') return b.priorityScore - a.priorityScore;
        if (sortBy === 'supporters') return b.supportersCount - a.supportersCount;
        if (sortBy === 'affected') return b.aiAnalysis.affectedPopulationEstimate - a.aiAnalysis.affectedPopulationEstimate;
        // 'newest'
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [challenges, searchTerm, selectedCategory, selectedSeverity, selectedStatus, sortBy]);

  const handleOpenChallenge = (challenge: Challenge) => {
    setActiveChallengeId(challenge.id);
    setCurrentView('challenge-detail');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            National Registry
          </span>
          <span className="text-xs font-semibold text-slate-400">
            {filteredChallenges.length} Challenges Discovered
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Explore Societal Challenges
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">
          Browse verified crowdsourced hazards, prioritize community interventions, and view AI hazard scoring.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm space-y-4">
        {/* Search Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by keywords, city (e.g. New Delhi), landmark, or reference #ID..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <ArrowUpDown size={15} className="text-slate-400 shrink-0" />
            <select
              value={sortBy}
              onChange={(e: any) => setSortBy(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 rounded-2xl border border-slate-200 text-xs font-bold bg-white text-slate-700 outline-none focus:border-blue-500"
            >
              <option value="priority">Sort by AI Priority (Highest)</option>
              <option value="newest">Sort by Newest First</option>
              <option value="supporters">Sort by Most Supported</option>
              <option value="affected">Sort by Population Affected</option>
            </select>

            {/* View Switcher buttons */}
            <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Grid View"
              >
                <Grid size={16} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="List View"
              >
                <List size={16} />
              </button>
              <button
                onClick={() => setViewMode('split')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'split' ? 'bg-white shadow-xs text-blue-600' : 'text-slate-500 hover:text-slate-800'
                }`}
                title="Split Map View"
              >
                <SplitSquareVertical size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          {/* Category Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0">
              Severity:
            </span>
            {severities.map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev)}
                className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedSeverity === sev
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Results View */}
      {filteredChallenges.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-2xs">
          <Filter size={36} className="mx-auto text-slate-300 mb-2" />
          <h3 className="text-base font-bold text-slate-800">No Challenges Match Filters</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting search criteria or select 'All' categories.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedSeverity('All');
              setSelectedStatus('All');
            }}
            className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'split' ? (
        /* Split Map + List View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-4 max-h-[750px] overflow-y-auto pr-2">
            {filteredChallenges.map((ch) => (
              <div
                key={ch.id}
                onClick={() => handleOpenChallenge(ch)}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:border-blue-300 hover:shadow-md cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <CategoryBadge category={ch.category} />
                  <SeverityBadge severity={ch.severity} size="sm" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm">{ch.title}</h3>
                <p className="text-xs text-slate-500 line-clamp-2 mt-1">{ch.description}</p>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">📍 {ch.location.city}</span>
                  <span className="font-bold text-blue-600">Priority: {ch.priorityScore}/100</span>
                </div>
              </div>
            ))}
          </div>

          <div className="sticky top-20">
            <LeafletMap
              challenges={filteredChallenges}
              onSelectChallenge={(ch) => handleOpenChallenge(ch)}
              height="650px"
            />
          </div>
        </div>
      ) : viewMode === 'list' ? (
        /* Table / List View */
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Reference & Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Priority Score</th>
                  <th className="p-4">Location</th>
                  <th className="p-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredChallenges.map((ch) => (
                  <tr
                    key={ch.id}
                    onClick={() => handleOpenChallenge(ch)}
                    className="hover:bg-blue-50/40 cursor-pointer transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-slate-900 line-clamp-1">{ch.title}</div>
                      <div className="font-mono text-[10px] text-slate-400">#{ch.id}</div>
                    </td>
                    <td className="p-4"><CategoryBadge category={ch.category} /></td>
                    <td className="p-4"><SeverityBadge severity={ch.severity} size="sm" /></td>
                    <td className="p-4"><StatusBadge status={ch.status} size="sm" /></td>
                    <td className="p-4 font-bold text-slate-900">
                      <PriorityScoreGauge score={ch.priorityScore} size="sm" />
                    </td>
                    <td className="p-4 text-slate-600 font-medium">
                      {ch.location.city}, {ch.location.state}
                    </td>
                    <td className="p-4 text-right">
                      <button className="text-blue-600 font-bold hover:underline">
                        View Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredChallenges.map((ch) => (
            <div
              key={ch.id}
              onClick={() => handleOpenChallenge(ch)}
              className="bg-white rounded-3xl p-5 border border-slate-200 shadow-2xs hover:shadow-lg hover:border-blue-300 cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Card Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5">
                    <CategoryBadge category={ch.category} />
                    <SeverityBadge severity={ch.severity} size="sm" />
                  </div>
                  <StatusBadge status={ch.status} size="sm" />
                </div>

                {/* Thumbnail Image if available */}
                {ch.evidence?.images && ch.evidence.images.length > 0 && (
                  <div className="relative rounded-2xl overflow-hidden aspect-video mb-3.5 bg-slate-100">
                    <img
                      src={ch.evidence.images[0]}
                      alt={ch.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/60 text-white backdrop-blur-xs">
                      #{ch.id}
                    </div>
                  </div>
                )}

                {/* Title and Description */}
                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                  {ch.title}
                </h3>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                  {ch.description}
                </p>
              </div>

              <div className="mt-5 pt-3.5 border-t border-slate-100">
                {/* Meta details */}
                <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                  <span className="flex items-center gap-1 font-medium truncate pr-2">
                    <MapPin size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{ch.location.city}, {ch.location.state}</span>
                  </span>
                  <span className="shrink-0 text-slate-400 font-mono">
                    ~{ch.aiAnalysis.affectedPopulationEstimate.toLocaleString()} affected
                  </span>
                </div>

                {/* Footer with Gauge and Support */}
                <div className="flex items-center justify-between">
                  <PriorityScoreGauge score={ch.priorityScore} size="sm" />

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSupport(ch.id);
                      }}
                      className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-colors ${
                        ch.isSupportedByMe
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <ThumbsUp size={13} />
                      <span>{ch.supportersCount}</span>
                    </button>
                    <span className="text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform flex items-center">
                      <ChevronRight size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
