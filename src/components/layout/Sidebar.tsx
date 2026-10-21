import React from 'react';
import {
  LayoutDashboard,
  PlusCircle,
  Compass,
  FileText,
  MapPin,
  Users2,
  Building,
  BarChart3,
  ShieldAlert,
  Bell,
  UserCircle2,
  Settings,
  Cpu,
  Globe,
  Award,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface SidebarProps {
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isMobileOpen, onCloseMobile }) => {
  const { currentView, setCurrentView, currentUser, unreadNotificationCount } = useApp();

  const primaryNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'report', label: 'Report a Challenge', icon: PlusCircle, highlight: true },
    { id: 'explore', label: 'Explore Challenges', icon: Compass },
    { id: 'my-reports', label: 'My Reports', icon: FileText },
    { id: 'map', label: 'Live Disaster Map', icon: MapPin },
    { id: 'collaborate', label: 'Collaborate', icon: Users2 },
    { id: 'organizations', label: 'Organizations', icon: Building },
    { id: 'impact', label: 'Impact Analytics', icon: BarChart3 },
  ];

  const adminNav = [
    {
      id: 'authority-dashboard',
      label: 'Authority Command',
      icon: ShieldAlert,
      badge: 'NDMA/Admin',
      badgeColor: 'bg-red-100 text-red-700',
    },
  ];

  const secondaryNav = [
    { id: 'notifications', label: 'Notifications', icon: Bell, badgeCount: unreadNotificationCount },
    { id: 'profile', label: 'My Civic Profile', icon: UserCircle2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (viewId: string) => {
    setCurrentView(viewId);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-slate-950 text-slate-300 border-r border-slate-800/80 select-none shadow-[8px_0_24px_rgba(15,23,42,0.16)]">
      {/* Brand Header */}
      <div className="p-5 pb-4 border-b border-slate-800/80">
        <div
          onClick={() => handleNavClick('landing')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white flex items-center justify-center font-black shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <Cpu size={22} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-white tracking-tight text-lg">CivicConnect</span>
              <span className="font-extrabold text-cyan-400 text-lg">AI</span>
            </div>
            <div className="text-[10px] text-slate-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>Operations Dashboard</span>
            </div>
          </div>
        </div>

        {/* Public Landing Shortcut */}
        <button
          onClick={() => handleNavClick('landing')}
          className="mt-3.5 w-full flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Globe size={13} className="text-cyan-400" />
            <span>Public Showcase Landing</span>
          </span>
          <ChevronRight size={13} className="text-slate-500" />
        </button>
      </div>

      {/* Main Nav Scroll */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {/* Core Navigation */}
        <div className="space-y-1">
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Civic Platform
          </div>
          {primaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : item.highlight
                    ? 'bg-blue-500/10 text-cyan-400 hover:bg-blue-500/20 border border-blue-500/20'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : item.highlight ? 'text-cyan-400' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                {item.highlight && !isActive && (
                  <span className="text-[10px] bg-cyan-400/20 text-cyan-300 px-1.5 py-0.5 rounded font-bold uppercase">
                    AI
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Authority / Triage Section */}
        <div className="space-y-1">
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
            <span>Governance & Ops</span>
            {currentUser.role === 'authority' && (
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping"></span>
            )}
          </div>
          {adminNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-red-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Account & Settings */}
        <div className="space-y-1">
          <div className="px-3 mb-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Account & Prefs
          </div>
          {secondaryNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                  <span>{item.label}</span>
                </div>
                {item.badgeCount !== undefined && item.badgeCount > 0 && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-red-500 text-white">
                    {item.badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer: Platform info */}
      <div className="p-4 bg-slate-950/60 border-t border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-900/50 border border-blue-700/50 flex items-center justify-center text-blue-300 font-black text-xs shrink-0">
            CC
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold text-white truncate">CivicConnect AI</div>
            <div className="text-[10px] text-slate-400 truncate">Disaster Response Platform</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden lg:block w-64 h-screen sticky top-0 shrink-0 z-20">
        {content}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
