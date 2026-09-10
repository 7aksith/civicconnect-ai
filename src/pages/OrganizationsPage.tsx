import React, { useState } from 'react';
import {
  Building,
  GraduationCap,
  Briefcase,
  Shield,
  Search,
  CheckCircle2,
  Phone,
  Mail,
  ExternalLink,
  MapPin,
  X,
} from 'lucide-react';
import { mockOrganizations } from '../data/mockData';
import { Organization } from '../types';

export const OrganizationsPage: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [search, setSearch] = useState<string>('');
  const [activeOrgModal, setActiveOrgModal] = useState<Organization | null>(null);

  const filteredOrgs = mockOrganizations.filter((org) => {
    if (selectedType !== 'All' && org.type !== selectedType) return false;
    if (search.trim() && !org.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Accredited Directory
          </span>
          <span className="text-xs font-semibold text-slate-400">
            {mockOrganizations.length} Certified Partners
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Partner Organizations Directory
        </h1>
        <p className="text-sm text-slate-600 mt-0.5">
          Explore registered non-profits, academic technical institutions, civil defence units, and disaster-tech innovators.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative flex-1 w-full">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organization by name, sector, or headquarters..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl border border-slate-200 text-xs font-medium focus:border-blue-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1">
          {['All', 'NGO', 'University', 'Startup', 'Authority'].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedType === t
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Organizations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredOrgs.map((org) => {
          return (
            <div
              key={org.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-2xs hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {org.type}
                    </span>
                    <h3 className="font-bold text-slate-900 text-lg leading-snug mt-1">
                      {org.name}
                    </h3>
                  </div>

                  {org.verified && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <CheckCircle2 size={13} className="text-emerald-600" />
                      <span>Govt Verified</span>
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-4">
                  {org.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-5">
                  {org.expertise.map((exp, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700"
                    >
                      {exp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                  <span>⚡ {org.activeProjects} Active Projects</span>
                  <span>🏆 {org.solvedChallenges} Solved</span>
                </div>

                <button
                  onClick={() => setActiveOrgModal(org)}
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors"
                >
                  View Profile
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Modal */}
      {activeOrgModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                  {activeOrgModal.type}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  {activeOrgModal.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveOrgModal(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {activeOrgModal.description}
            </p>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <MapPin size={15} className="text-blue-600" />
                <span>Headquarters: {activeOrgModal.location}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Mail size={15} className="text-blue-600" />
                <span>Contact: {activeOrgModal.contactEmail}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <ExternalLink size={15} className="text-blue-600" />
                <a href={activeOrgModal.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                  {activeOrgModal.website}
                </a>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Certified Capabilities
              </div>
              <div className="flex flex-wrap gap-1.5">
                {activeOrgModal.expertise.map((exp, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200"
                  >
                    {exp}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveOrgModal(null)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
