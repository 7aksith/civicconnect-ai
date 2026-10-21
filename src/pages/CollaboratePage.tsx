import React, { useState } from 'react';
import {
  Users2,
  Sparkles,
  Building,
  GraduationCap,
  Briefcase,
  Shield,
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Search,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockOrganizations } from '../data/mockData';

export const CollaboratePage: React.FC = () => {
  const { addToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const partners = [
    {
      id: 'p-1',
      name: 'SEEDS India Disaster Preparedness Unit',
      type: 'NGO',
      matchScore: 96,
      expertise: ['Flood Mitigation', 'Emergency Shelter', 'Community Disaster Risk'],
      projectsActive: 18,
      verifiedPersonnel: 450,
      location: 'National Capital Region',
      icon: Building,
    },
    {
      id: 'p-2',
      name: 'IIT Roorkee Department of Earthquake Engineering',
      type: 'University',
      matchScore: 94,
      expertise: ['Slope Stability', 'Landslide Warning', 'Structural Assessment'],
      projectsActive: 8,
      verifiedPersonnel: 42,
      location: 'Roorkee, Uttarakhand',
      icon: GraduationCap,
    },
    {
      id: 'p-3',
      name: 'FloodSense AI Satellite GeoSpatial Lab',
      type: 'Startup',
      matchScore: 91,
      expertise: ['SAR Satellite Analysis', 'Micro-elevation Drone Bathymetry'],
      projectsActive: 12,
      verifiedPersonnel: 28,
      location: 'Bengaluru, Karnataka',
      icon: Briefcase,
    },
    {
      id: 'p-4',
      name: 'National Disaster Response Force (NDRF) 8th Bn',
      type: 'Authority',
      matchScore: 95,
      expertise: ['Search & Rescue', 'Mass Inundation Evacuation', 'Heavy Equipment'],
      projectsActive: 31,
      verifiedPersonnel: 1200,
      location: 'Ghaziabad, Uttar Pradesh',
      icon: Shield,
    },
  ];

  const filteredPartners = partners.filter((p) => {
    if (selectedCategory !== 'All' && p.type !== selectedCategory) return false;
    if (searchQuery.trim() && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const handleConnect = (name: string) => {
    addToast({
      type: 'success',
      title: 'Collaboration Dispatch Sent',
      message: `Direct liaison established with ${name}. Project channel opened.`,
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Multi-Sectoral Coalition
          </span>
          <span className="text-xs font-semibold text-slate-400">
            Partner Response Network
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Collaborate with Solution Partners
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">
          Connecting on-ground citizen disaster reports with verified academic research labs, NGOs, and technical startups for accelerated execution.
        </p>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search partners by name, technology, or expertise (e.g. Flood, Satellite)..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1">
          {['All', 'NGO', 'University', 'Startup', 'Authority'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredPartners.map((p) => {
          const Icon = p.icon;
          return (
            <div
              key={p.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200/60 shadow-2xs">
                      <Icon size={24} />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {p.type}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base leading-snug mt-1">
                        {p.name}
                      </h3>
                    </div>
                  </div>

                  <span className="shrink-0 px-2.5 py-1 rounded-full text-xs font-black bg-cyan-50 text-cyan-900 border border-cyan-200">
                    {p.matchScore}% Match
                  </span>
                </div>

                <div className="text-xs text-slate-500 mb-4">
                  <span>📍 {p.location}</span> • <span>👥 {p.verifiedPersonnel} Specialists</span>
                </div>

                <div className="space-y-2 mb-6">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Core Technical Expertise:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {p.expertise.map((exp, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200/80"
                      >
                        {exp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">
                  {p.projectsActive} Active Interventions
                </span>

                <button
                  onClick={() => handleConnect(p.name)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <MessageSquare size={14} />
                  <span>Initiate Collaboration</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
