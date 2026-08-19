import React from 'react';
import { 
  Play, 
  X, 
  Compass, 
  CheckSquare, 
  Layers, 
  CreditCard, 
  Gift, 
  Trophy, 
  BookOpen, 
  Database, 
  Flame, 
  Coins, 
  LogOut, 
  ShieldCheck, 
  ChevronRight,
  PlusCircle,
  FileText,
  Info,
  Mail,
  Smartphone,
  Download
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SidebarDrawer: React.FC = () => {
  const { 
    isSidebarOpen, 
    setIsSidebarOpen, 
    user, 
    activeTab, 
    setActiveTab, 
    tasks, 
    setIsAddAppModalOpen,
    setIsReferralModalOpen,
    setIsLeaderboardModalOpen,
    setIsDeployGuideOpen,
    setIsFirebaseModalOpen,
    setIsAuthModalOpen,
    setLegalModalType,
    signOutUser,
    signInWithGoogle,
    addToast
  } = useApp();

  if (!isSidebarOpen) return null;

  const activeTasksCount = tasks.filter((t) => t.status === 'active').length;

  const navigateTo = (tab: typeof activeTab) => {
    if (tab !== 'explore' && !user) {
      setIsSidebarOpen(false);
      setIsAuthModalOpen(true);
      addToast('info', 'Sign In Required', `Please sign in to access ${tab === 'tasks' ? 'your testing tasks' : tab === 'my-apps' ? 'your published apps' : 'the coins exchange'}.`);
      return;
    }
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  const handleAddApp = () => {
    setIsSidebarOpen(false);
    if (!user) {
      setIsAuthModalOpen(true);
      addToast('info', 'Sign In Required', 'Please sign in or register to publish your app.');
      return;
    }
    setIsAddAppModalOpen(true);
  };

  const handleReferralClick = () => {
    setIsSidebarOpen(false);
    if (!user) {
      setIsAuthModalOpen(true);
      addToast('info', 'Sign In Required', 'Please sign in to view your referral code and earn +50 Coins.');
      return;
    }
    setIsReferralModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark Backdrop */}
      <div 
        onClick={() => setIsSidebarOpen(false)}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 left-0 max-w-full flex">
        <aside className="w-80 max-w-[85vw] bg-white border-r border-slate-200 shadow-2xl flex flex-col h-full animate-in slide-in-from-left duration-300">
          
          {/* Top Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                <Play className="h-4 w-4 fill-white translate-x-0.5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base tracking-tight text-slate-900">
                    Play20
                  </span>
                  <span className="rounded-md bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 text-[9px] font-bold text-indigo-700 uppercase">
                    Hub
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">
                  20 Testers • 14 Days
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSidebarOpen(false)}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 transition-colors"
              title="Close Menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* User Profile Card */}
          {user ? (
            <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-indigo-50/40 via-white to-slate-50/60">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={user.displayName}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-indigo-200"
                  />
                  <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[8px] font-bold shadow-xs">
                    ✓
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 truncate">
                    {user.displayName}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-indigo-700 font-semibold">
                    <ShieldCheck className="h-3 w-3 text-indigo-600" />
                    <span>{user.testerRank || 'Top Tester ⭐'}</span>
                  </div>
                </div>
              </div>

              {/* Balance & Streak Strip */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => { navigateTo('store'); }}
                  className="flex items-center justify-between rounded-xl bg-amber-50/80 border border-amber-200/80 px-2.5 py-1.5 text-left hover:bg-amber-100/70 transition-colors shadow-xs"
                >
                  <div>
                    <span className="text-[9px] font-bold text-amber-800 uppercase block">Coins</span>
                    <span className="text-xs font-extrabold text-amber-900">{user.credits}</span>
                  </div>
                  <Coins className="h-3.5 w-3.5 text-amber-600" />
                </button>

                <div className="flex items-center justify-between rounded-xl bg-orange-50/80 border border-orange-200/80 px-2.5 py-1.5 text-left shadow-xs">
                  <div>
                    <span className="text-[9px] font-bold text-orange-800 uppercase block">Streak</span>
                    <span className="text-xs font-extrabold text-orange-950">{user.dailyStreak || 4}d</span>
                  </div>
                  <Flame className="h-3.5 w-3.5 text-orange-500 fill-orange-500" />
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-600 mb-2.5 font-medium">
                Sign in to manage your 20 testers & track coins.
              </p>
              <button
                onClick={() => { 
                  setIsSidebarOpen(false); 
                  setIsAuthModalOpen(true); 
                }}
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2.5 text-xs font-bold transition-all shadow-xs"
              >
                Sign In / Register
              </button>
            </div>
          )}

          {/* Quick Action */}
          <div className="p-3 border-b border-slate-100">
            <button
              onClick={handleAddApp}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-3 text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <PlusCircle className="h-4 w-4" />
              <span>ADD YOUR APP</span>
            </button>
          </div>

          {/* Scrollable Navigation Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            
            {/* Primary App Views */}
            <div>
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Main Pages
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => navigateTo('explore')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'explore'
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Compass className="h-4 w-4 text-indigo-600" />
                    <span>Explore Apps</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => navigateTo('tasks')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'tasks'
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CheckSquare className="h-4 w-4 text-indigo-600" />
                    <span>My Tasks & Daily Tests</span>
                  </div>
                  {activeTasksCount > 0 ? (
                    <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold border border-emerald-200">
                      {activeTasksCount} Active
                    </span>
                  ) : (
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                  )}
                </button>

                <button
                  onClick={() => navigateTo('my-apps')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'my-apps'
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Layers className="h-4 w-4 text-indigo-600" />
                    <span>My Published Apps</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </button>

                <button
                  onClick={() => navigateTo('store')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === 'store'
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <CreditCard className="h-4 w-4 text-indigo-600" />
                    <span>Get Coins & Packages</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            {/* Growth & Community Features */}
            <div>
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Rewards & Community
              </span>
              <div className="space-y-1">
                <button
                  onClick={handleReferralClick}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-indigo-50/70 hover:text-indigo-900 transition-all border border-transparent hover:border-indigo-100"
                >
                  <div className="flex items-center gap-2.5">
                    <Gift className="h-4 w-4 text-indigo-600" />
                    <span>Invite Friends</span>
                  </div>
                  <span className="rounded bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.2">
                    +50 Coins
                  </span>
                </button>

                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    const installBtn = document.getElementById('btn-install-pwa');
                    if (installBtn) {
                      installBtn.click();
                    }
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-indigo-700 bg-indigo-50/60 hover:bg-indigo-50 transition-all border border-indigo-100/80"
                >
                  <div className="flex items-center gap-2.5">
                    <Smartphone className="h-4 w-4 text-indigo-600" />
                    <span className="font-bold">Install to Device</span>
                  </div>
                  <Download className="h-3.5 w-3.5 text-indigo-500" />
                </button>
              </div>
            </div>

            {/* Legal & AdSense Policies */}
            <div>
              <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                Legal & Policies
              </span>
              <div className="space-y-1">
                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    setLegalModalType('privacy');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="h-4 w-4 text-slate-400" />
                    <span>Privacy Policy & Cookies</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                </button>

                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    setLegalModalType('terms');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="h-4 w-4 text-slate-400" />
                    <span>Terms of Service</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                </button>

                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    setLegalModalType('about');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Info className="h-4 w-4 text-slate-400" />
                    <span>About Play20</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                </button>

                <button
                  onClick={() => {
                    setIsSidebarOpen(false);
                    setLegalModalType('contact');
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all"
                >
                  <div className="flex items-center gap-2.5">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span>Contact Support</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-300" />
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Footer */}
          {user ? (
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 py-1 px-2 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                Switch Account
              </button>

              <button
                onClick={() => {
                  signOutUser();
                  setIsSidebarOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 py-1 px-2 rounded-lg hover:bg-rose-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-center">
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2 text-xs font-bold transition-all shadow-xs"
              >
                Open Sign In Page
              </button>
            </div>
          )}

        </aside>
      </div>
    </div>
  );
};
