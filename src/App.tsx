import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { SidebarDrawer } from './components/SidebarDrawer';
import { ExploreBoostsTab } from './components/ExploreBoostsTab';
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
import { AdminPanelModal } from './components/AdminPanelModal';
import { PwaInstallBanner } from './components/PwaInstallBanner';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';
import { Sparkles, ShoppingBag, Zap, Menu } from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setIsCreateCampaignModalOpen,
    setIsSidebarOpen 
  } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-500/20 selection:text-indigo-700 pb-20 sm:pb-0">
      
      {/* Sticky Navigation Bar */}
      <Navbar />

      {/* Side Navigation Drawer (Left Sliding Menu) */}
      <SidebarDrawer />

      {/* Main Container */}
      <main className="flex-1">
        {activeTab === 'explore' && <ExploreBoostsTab />}
        {activeTab === 'campaigns' && <MyAppsTab />}
        {activeTab === 'tasks' && <MyTasksTab />}
        {activeTab === 'store' && <BuyCreditsTab />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation Bar */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-4 py-2 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'explore' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span className="text-[10px] font-bold">Services</span>
        </button>

        {/* Central Prominent Order Button */}
        <button
          onClick={() => setIsCreateCampaignModalOpen(true)}
          className="flex flex-col items-center -mt-5 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white p-3 rounded-full shadow-lg shadow-indigo-500/30 active:scale-95 transition"
        >
          <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
        </button>

        <button
          onClick={() => setActiveTab('campaigns')}
          className={`flex flex-col items-center gap-1 transition ${
            activeTab === 'campaigns' ? 'text-indigo-600' : 'text-slate-500'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-[10px] font-bold">My Orders</span>
        </button>

        <button
          onClick={() => setIsSidebarOpen(true)}
          className="flex flex-col items-center gap-1 text-slate-500 hover:text-slate-900 transition"
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] font-bold">Menu</span>
        </button>
      </nav>

      {/* Modals & Portals */}
      <AuthModal />
      <AdminPanelModal />
      <TaskModal />
      <AddAppModal />
      <EditAppModal />
      <DeployGuideModal />
      <FirebaseSettingsModal />
      <ReferralModal />
      <LeaderboardModal />
      <LegalModals />
      <PwaInstallBanner />
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
