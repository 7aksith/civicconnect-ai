import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ReportChallengePage } from './pages/ReportChallengePage';
import { ExploreChallengesPage } from './pages/ExploreChallengesPage';
import { ChallengeDetailsPage } from './pages/ChallengeDetailsPage';
import { MapViewPage } from './pages/MapViewPage';
import { MyReportsPage } from './pages/MyReportsPage';
import { CollaboratePage } from './pages/CollaboratePage';
import { OrganizationsPage } from './pages/OrganizationsPage';
import { ImpactDashboardPage } from './pages/ImpactDashboardPage';
import { AuthorityDashboardPage } from './pages/AuthorityDashboardPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SettingsPage } from './pages/SettingsPage';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView } = useApp();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50">
        <LandingPage />
        <ToastContainer />
      </div>
    );
  }

  if (currentView === 'login' || currentView === 'login-admin') {
    return (
      <div className="min-h-screen bg-slate-950">
        <LoginPage />
        <ToastContainer />
      </div>
    );
  }

  // App Shell Layout for all interior views
  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardPage />;
      case 'report':
        return <ReportChallengePage />;
      case 'explore':
        return <ExploreChallengesPage />;
      case 'challenge-detail':
        return <ChallengeDetailsPage />;
      case 'map':
        return <MapViewPage />;
      case 'my-reports':
        return <MyReportsPage />;
      case 'collaborate':
        return <CollaboratePage />;
      case 'organizations':
        return <OrganizationsPage />;
      case 'impact':
        return <ImpactDashboardPage />;
      case 'authority-dashboard':
        return <AuthorityDashboardPage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),transparent_22%),radial-gradient(circle_at_bottom_right,_rgba(15,118,110,0.12),transparent_26%),linear-gradient(135deg,#f8fafc_0%,#eef3ff_30%,#f4f7fb_60%,#edf7f6_100%)] text-slate-900 antialiased">
      <div className="absolute inset-0 opacity-80 [background-image:linear-gradient(to_right,rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.10)_1px,transparent_1px)] [background-size:28px_28px]" />

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar Navigation */}
        <Sidebar
          isMobileOpen={isMobileNavOpen}
          onCloseMobile={() => setIsMobileNavOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <Navbar
            onOpenMobileMenu={() => setIsMobileNavOpen(true)}
            searchQuery={searchQuery}
            setSearchQuery={(q) => {
              setSearchQuery(q);
              if (currentView !== 'explore') {
                setCurrentView('explore');
              }
            }}
          />

          {/* Page View Container */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <div className="rounded-[30px] border border-slate-200/70 bg-white/70 shadow-[0_24px_70px_rgba(15,23,42,0.08)] backdrop-blur-xl p-2 sm:p-3">
              {renderCurrentView()}
            </div>
          </main>
        </div>
      </div>

      {/* Floating Toast Notification Stack */}
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
