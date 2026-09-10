import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer } from './components/common/ToastContainer';

// Pages
import { LandingPage } from './pages/LandingPage';
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

  // If user is on the public presentation landing page
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-slate-50">
        <LandingPage />
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
    <div className="min-h-screen bg-slate-50/70 text-slate-900 flex antialiased">
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
          {renderCurrentView()}
        </main>
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
