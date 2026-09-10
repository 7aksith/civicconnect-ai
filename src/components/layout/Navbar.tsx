import React, { useState } from 'react';
import {
  Search,
  Bell,
  PlusCircle,
  Menu,
  X,
  Cpu,
  User,
  Shield,
  Building2,
  GraduationCap,
  ExternalLink,
  CheckCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole } from '../../types';

interface NavbarProps {
  onOpenMobileMenu: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenMobileMenu,
  searchQuery,
  setSearchQuery,
}) => {
  const {
    currentUser,
    switchUserRole,
    notifications,
    unreadNotificationCount,
    markNotificationRead,
    markAllNotificationsRead,
    setCurrentView,
    setActiveChallengeId,
  } = useApp();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const roles: { role: UserRole; label: string; desc: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
    { role: 'citizen', label: 'Citizen', desc: 'Aarav Sharma (Reporter)', icon: User },
    { role: 'authority', label: 'Authority / Admin', desc: 'Dr. Rajesh Verma (NDMA Officer)', icon: Shield },
    { role: 'organization', label: 'Partner NGO', desc: 'Priya Mukherjee (SEEDS India)', icon: Building2 },
    { role: 'expert', label: 'Technical Expert', desc: 'Prof. Sunita Rao (IIT Roorkee)', icon: GraduationCap },
  ];

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 sticky top-0 z-30 px-4 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Brand (on mobile) */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
          aria-label="Open Navigation Menu"
        >
          <Menu size={22} />
        </button>

        <div
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2 cursor-pointer lg:hidden"
        >
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
            <Cpu size={18} />
          </div>
          <span className="font-extrabold text-slate-900 tracking-tight text-base">
            CivicConnect<span className="text-blue-600">AI</span>
          </span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="flex-1 max-w-xl hidden md:block">
        <div className="relative">
          <Search
            size={17}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              // Switch to explore page if typing search
              if (window.location.hash !== '#explore') {
                // optionally route
              }
            }}
            placeholder="Search flood reports, infrastructure, city, or challenge ID (#CC-SIH-901)..."
            className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white text-slate-900 placeholder:text-slate-400 text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-transparent focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
          />
        </div>
      </div>

      {/* Right: Quick Report, Persona Switcher & Notifications */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Hackathon Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200/80 text-[11px] font-bold">
          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          <span>SIH 2026 • SIH26043</span>
        </div>

        {/* Quick Report Button */}
        <button
          onClick={() => setCurrentView('report')}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <PlusCircle size={15} />
          <span className="hidden sm:inline">Report Challenge</span>
          <span className="sm:hidden">Report</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Notifications"
          >
            <Bell size={20} />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-600 text-white rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white animate-pulse">
                {unreadNotificationCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsNotificationsOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 text-sm">Notifications</h4>
                    {unreadNotificationCount > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                        {unreadNotificationCount} new
                      </span>
                    )}
                  </div>
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
                  >
                    <CheckCheck size={14} />
                    <span>Mark all read</span>
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        markNotificationRead(notif.id);
                        if (notif.challengeId) {
                          setActiveChallengeId(notif.challengeId);
                          setCurrentView('challenge-detail');
                        }
                        setIsNotificationsOpen(false);
                      }}
                      className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                        !notif.isRead ? 'bg-blue-50/40' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 leading-snug">
                          {notif.title}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap">
                          {notif.createdAt}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-slate-50 border-t border-slate-100 text-center">
                  <button
                    onClick={() => {
                      setCurrentView('notifications');
                      setIsNotificationsOpen(false);
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700"
                  >
                    View All Notifications →
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-200" />

        {/* Persona Switcher / User Menu */}
        <div className="relative">
          <button
            onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-xl hover:bg-slate-100 transition-all border border-slate-200/60"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
            />
            <div className="text-left hidden md:block">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] font-semibold text-blue-600 uppercase tracking-wider">
                {currentUser.role}
              </div>
            </div>
          </button>

          {isRoleDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsRoleDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3.5 bg-slate-50 border-b border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    SIH Demo: Switch Persona
                  </div>
                  <p className="text-xs text-slate-600">
                    Experience CivicConnect AI through citizen, authority, or partner roles.
                  </p>
                </div>

                <div className="p-1.5 space-y-1">
                  {roles.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentUser.role === item.role;
                    return (
                      <button
                        key={item.role}
                        onClick={() => {
                          switchUserRole(item.role);
                          setIsRoleDropdownOpen(false);
                          if (item.role === 'authority') {
                            setCurrentView('authority-dashboard');
                          }
                        }}
                        className={`w-full text-left p-2.5 rounded-xl flex items-center gap-3 transition-colors ${
                          isActive
                            ? 'bg-blue-50 text-blue-900 font-bold border border-blue-200/80'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold flex items-center justify-between">
                            <span>{item.label}</span>
                            {isActive && (
                              <span className="text-[10px] text-blue-600 font-extrabold uppercase">Active</span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">{item.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="p-2 border-t border-slate-100 bg-slate-50/60">
                  <button
                    onClick={() => {
                      setCurrentView('profile');
                      setIsRoleDropdownOpen(false);
                    }}
                    className="w-full text-center text-xs font-bold text-slate-700 hover:text-blue-600 py-1"
                  >
                    View & Edit Profile Settings
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
