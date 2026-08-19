import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { SidebarDrawer } from './components/SidebarDrawer';
import { ExploreAppsTab } from './components/ExploreAppsTab';
import { MyTasksTab } from './components/MyTasksTab';
import { MyAppsTab } from './components/MyAppsTab';
import { BuyCreditsTab } from './components/BuyCreditsTab';
import { TaskModal } from './components/TaskModal';
import { AddAppModal } from './components/AddAppModal';
import { EditAppModal } from './components/EditAppModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { FirebaseSettingsModal } from './components/FirebaseSettingsModal';
import { ReferralModal } from './components/ReferralModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { LegalModals } from './components/LegalModals';
import { AuthModal } from './components/AuthModal';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';

const MainContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-700 pb-24 lg:pb-0">
      
      {/* Sticky Navigation Bar with Left Menu Drawer Button */}
      <Navbar />

      {/* Side Navigation Drawer (Left Sliding Menu) */}
      <SidebarDrawer />

      {/* Main Container */}
      <main className="flex-1">
        {activeTab === 'explore' && <ExploreAppsTab />}
        {activeTab === 'tasks' && <MyTasksTab />}
        {activeTab === 'my-apps' && <MyAppsTab />}
        {activeTab === 'store' && <BuyCreditsTab />}
      </main>

      {/* Footer with AdSense Policy Links */}
      <Footer />

      {/* Modals & Portals */}
      <AuthModal />
      <TaskModal />
      <AddAppModal />
      <EditAppModal />
      <DeployGuideModal />
      <FirebaseSettingsModal />
      <ReferralModal />
      <LeaderboardModal />
      <LegalModals />
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
