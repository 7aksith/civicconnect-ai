import React, { useState } from 'react';
import {
  User,
  Award,
  MapPin,
  Mail,
  ShieldCheck,
  Edit3,
  CheckCircle2,
  FileText,
  ThumbsUp,
  X,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfilePage: React.FC = () => {
  const { currentUser, updateUserProfile, challenges, setCurrentView, setActiveChallengeId } = useApp();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [city, setCity] = useState(currentUser.city);
  const [stateName, setStateName] = useState(currentUser.state);
  const [bio, setBio] = useState(currentUser.bio || '');

  const myReports = challenges.filter(
    (c) => c.reportedBy.id === currentUser.id || c.reportedBy.name === currentUser.name
  );

  const badges = [
    {
      title: 'Disaster Sentinel',
      desc: 'Reported 3+ verified flood or structural alerts',
      icon: '🛡️',
      unlocked: true,
    },
    {
      title: 'AI Multi-Modal Pioneer',
      desc: 'Provided verified photo and vernacular voice evidence',
      icon: '🎙️',
      unlocked: true,
    },
    {
      title: 'Community Champion',
      desc: 'Rallied over 100 civic endorsements for local hazards',
      icon: '🤝',
      unlocked: true,
    },
    {
      title: 'Zero Duplicate Reporter',
      desc: 'Submissions have 95%+ unique geographic accuracy',
      icon: '📍',
      unlocked: true,
    },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      city,
      state: stateName,
      bio,
    });
    setIsEditModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header / Avatar Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-blue-50 shadow-md"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {currentUser.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800">
                {currentUser.role}
              </span>
            </div>

            <p className="text-xs text-slate-500 flex items-center gap-2">
              <MapPin size={14} className="text-blue-600" />
              <span>{currentUser.city}, {currentUser.state}</span>
              <span>•</span>
              <Mail size={14} className="text-slate-400" />
              <span>{currentUser.email}</span>
            </p>

            {currentUser.bio && (
              <p className="text-xs text-slate-600 mt-2 max-w-lg leading-relaxed">
                {currentUser.bio}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => setIsEditModalOpen(true)}
          className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-2xs"
        >
          <Edit3 size={15} />
          <span>Edit Profile</span>
        </button>
      </div>

      {/* Contribution Stats */}
      <div className="grid grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Reports Filed
          </span>
          <div className="text-3xl font-black text-slate-900 mt-1">
            {currentUser.reportsSubmitted}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold block mt-1">100% AI Verified</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Reputation Points
          </span>
          <div className="text-3xl font-black text-purple-600 mt-1">
            {currentUser.reputationScore}
          </div>
          <span className="text-[11px] text-purple-600 font-semibold block mt-1">Level 4 Citizen Sentinel</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs text-center">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Impacted Lives
          </span>
          <div className="text-3xl font-black text-emerald-600 mt-1">
            ~12.4K
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold block mt-1">Community Protection</span>
        </div>
      </div>

      {/* Badges / Civic Credibility */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Award size={20} className="text-purple-600" />
          <h3 className="text-base font-bold text-slate-900">Civic Reputation Badges</h3>
        </div>
        <p className="text-xs text-slate-500">
          Earned through authentic disaster evidence reporting and verified field collaboration
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {badges.map((b, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5"
            >
              <div className="text-2xl p-2 rounded-xl bg-white shadow-2xs border border-slate-100">
                {b.icon}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{b.title}</h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <form
            onSubmit={handleSaveProfile}
            className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Edit Civic Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  State
                </label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Bio / Community Role
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-blue-500 leading-relaxed"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
