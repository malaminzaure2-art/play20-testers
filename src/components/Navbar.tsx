import React from 'react';
import { 
  Menu,
  Play, 
  Coins, 
  PlusCircle, 
  LogOut, 
  Compass, 
  CheckSquare, 
  Layers, 
  Gift
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    user, 
    activeTab, 
    setActiveTab, 
    signInWithGoogle, 
    signOutUser, 
    setIsAddAppModalOpen,
    setIsReferralModalOpen,
    setIsSidebarOpen,
    setIsAuthModalOpen,
    addToast,
    tasks
  } = useApp();

  const activeTasksCount = tasks.filter((t) => t.status === 'active').length;

  const handleProtectedTab = (tab: 'tasks' | 'my-apps' | 'store') => {
    if (!user) {
      setIsAuthModalOpen(true);
      addToast('info', 'Sign In Required', `Please sign in to access ${tab === 'tasks' ? 'your testing tasks' : tab === 'my-apps' ? 'your published apps' : 'the coins exchange'}.`);
      return;
    }
    setActiveTab(tab);
  };

  const handleInviteClick = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      addToast('info', 'Sign In Required', 'Please sign in to get your referral link and earn +50 Coins.');
      return;
    }
    setIsReferralModalOpen(true);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left Side: Hamburger Menu Button + Logo */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hamburger Menu Toggle Button (Left on Desktop & Mobile) */}
          <button
            id="btn-open-sidebar"
            onClick={() => setIsSidebarOpen(true)}
            className="flex h-10 items-center gap-1.5 px-2.5 sm:px-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-indigo-600 transition-all shadow-xs active:scale-95 group"
            title="Open Main Menu (Sidebar)"
          >
            <Menu className="h-5 w-5 text-slate-700 group-hover:text-indigo-600 transition-colors" />
            <span className="hidden sm:inline text-xs font-bold text-slate-700 group-hover:text-indigo-600">Menu</span>
          </button>

          {/* Brand Logo */}
          <button 
            id="brand-logo-btn"
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-2 text-left group transition-transform active:scale-95"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs shadow-indigo-200">
              <Play className="h-4 w-4 fill-white translate-x-0.5" />
            </div>
            <div className="hidden xs:block">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Play20
                </span>
                <span className="rounded-md bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 text-[9px] font-bold text-indigo-700 uppercase">
                  Testers
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium leading-none">
                20 Testers • 14 Days
              </p>
            </div>
          </button>
        </div>

        {/* Center: Clean Primary Navigation Tabs (Desktop) */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 shadow-inner">
          <button
            id="nav-tab-explore"
            onClick={() => setActiveTab('explore')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'explore'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Compass className="h-3.5 w-3.5 text-indigo-600" />
            Explore Apps
          </button>

          <button
            id="nav-tab-tasks"
            onClick={() => handleProtectedTab('tasks')}
            className={`relative flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tasks'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <CheckSquare className="h-3.5 w-3.5 text-indigo-600" />
            My Tasks
            {activeTasksCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 px-1 text-[10px] font-bold border border-emerald-200">
                {activeTasksCount}
              </span>
            )}
          </button>

          <button
            id="nav-tab-my-apps"
            onClick={() => handleProtectedTab('my-apps')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'my-apps'
                ? 'bg-white text-indigo-700 shadow-xs border border-slate-200/80 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-indigo-600" />
            My Apps
          </button>
        </nav>

        {/* Right Side: Action Bar */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* Invite & Earn Button (Desktop/Tablet) */}
          <button
            onClick={handleInviteClick}
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 px-2.5 sm:px-3 py-1.5 text-xs font-bold transition-all shadow-xs active:scale-95"
            title="Invite friends and get +50 free Coins"
          >
            <Gift className="h-3.5 w-3.5 text-indigo-600" />
            <span>Invite</span>
            <span className="rounded bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.2">
              +50
            </span>
          </button>

          {user ? (
            <>
              {/* Credit Balance Badge */}
              <button 
                id="user-balance-badge"
                onClick={() => setActiveTab('store')}
                className="flex items-center gap-1 sm:gap-1.5 rounded-xl border border-amber-200 bg-amber-50/80 px-2 sm:px-3 py-1.5 hover:border-amber-300 hover:bg-amber-100/80 transition-all shadow-xs active:scale-95"
                title="Your Coins Balance (Click to buy more)"
              >
                <Coins className="h-3.5 w-3.5 text-amber-600 fill-amber-400" />
                <span className="text-xs font-extrabold text-amber-900">
                  {user.credits}
                </span>
              </button>

              {/* Submit App CTA */}
              <button
                id="btn-add-app-nav"
                onClick={() => setIsAddAppModalOpen(true)}
                className="flex items-center gap-1 sm:gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 sm:px-3.5 py-1.5 text-xs font-bold shadow-xs shadow-indigo-200 transition-all active:scale-95"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">ADD YOUR APP</span>
                <span className="sm:hidden">Add App</span>
              </button>

              {/* User Avatar & Drawer Trigger */}
              <div className="flex items-center gap-1 sm:gap-1.5 pl-1 sm:pl-1.5 border-l border-slate-200">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="relative group transition-transform active:scale-95"
                  title="Click to view Profile & Menu"
                >
                  <img
                    src={user.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={user.displayName}
                    className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200 group-hover:ring-indigo-400"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 text-white text-[7px] font-bold" title="Verified Tester">
                    ✓
                  </span>
                </button>
                <button
                  id="btn-signout"
                  onClick={signOutUser}
                  title="Sign Out"
                  className="hidden md:flex rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                </button>
              </div>
            </>
          ) : (
            <button
              id="btn-signin-nav"
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 text-xs font-bold shadow-xs transition-all active:scale-95"
            >
              <span>Sign In / Register</span>
            </button>
          )}
        </div>
      </div>

      {/* Native Mobile App Fixed Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-1.5 shadow-lg flex items-center justify-around">
        {/* Menu on the FAR LEFT on mobile bottom bar too */}
        <button
          id="mobile-bottom-menu-btn"
          onClick={() => setIsSidebarOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl text-slate-600 hover:text-indigo-600 transition-all active:scale-95"
        >
          <Menu className="h-4 w-4" />
          <span className="text-[10px] font-semibold tracking-tight">Menu</span>
        </button>

        <button
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all active:scale-95 ${
            activeTab === 'explore' 
              ? 'text-indigo-600 bg-indigo-50 font-bold' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="h-4 w-4" />
          <span className="text-[10px] tracking-tight">Explore</span>
        </button>

        <button
          onClick={() => handleProtectedTab('tasks')}
          className={`relative flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all active:scale-95 ${
            activeTab === 'tasks' 
              ? 'text-indigo-600 bg-indigo-50 font-bold' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <CheckSquare className="h-4 w-4" />
          <span className="text-[10px] tracking-tight">Tasks</span>
          {activeTasksCount > 0 && (
            <span className="absolute top-0.5 right-2 flex h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          )}
        </button>

        <button
          onClick={() => handleProtectedTab('my-apps')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all active:scale-95 ${
            activeTab === 'my-apps' 
              ? 'text-indigo-600 bg-indigo-50 font-bold' 
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          <span className="text-[10px] tracking-tight">My Apps</span>
        </button>
      </div>
    </header>
  );
};
