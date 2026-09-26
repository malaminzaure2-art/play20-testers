import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  PlusCircle, 
  Menu, 
  Sparkles, 
  TrendingUp, 
  LogIn, 
  Zap,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    user,
    isAdmin,
    setIsAdminPanelOpen,
    activeTab,
    setActiveTab,
    setIsAuthModalOpen,
    setIsCreateCampaignModalOpen,
    setIsSidebarOpen,
  } = useApp();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Side: Drawer Toggle + Brand Logo */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <button
            id="btn-open-sidebar"
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/70 border border-slate-200/70 transition cursor-pointer"
            title="Menu"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={() => setActiveTab('explore')}
            className="flex items-center gap-2 text-left group cursor-pointer focus:outline-hidden"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-xs shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200 shrink-0">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 leading-none">
                  Trend<span className="text-indigo-600">Boost</span>
                </span>
                <span className="hidden md:inline-flex text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
                  Pro
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block leading-tight mt-0.5">
                Social Growth Platform
              </p>
            </div>
          </button>
        </div>

        {/* Center: Desktop Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/60">
          <button
            id="nav-tab-explore"
            onClick={() => setActiveTab('explore')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'explore'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Services & Rates
          </button>

          <button
            id="nav-tab-campaigns"
            onClick={() => setActiveTab('campaigns')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'campaigns'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-indigo-500" />
            My Orders
          </button>
        </nav>

        {/* Right Side: Admin Button, Place Order CTA, Auth */}
        <div className="flex items-center gap-2 shrink-0">
          
          {/* Admin Dispatcher Button (Visible ONLY when logged in as admin) */}
          {isAdmin && (
            <button
              id="btn-admin-panel-nav"
              onClick={() => setIsAdminPanelOpen(true)}
              className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs sm:text-sm px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl shadow-md shadow-amber-500/25 transition flex items-center gap-1.5 cursor-pointer active:scale-95 border border-amber-300 animate-pulse"
              title="Budaddiyar Tashar Admin (Customer Dispatcher)"
            >
              <ShieldCheck className="w-4 h-4 text-slate-950" />
              <span className="hidden sm:inline">Admin Panel</span>
              <span className="sm:hidden text-xs">Admin</span>
            </button>
          )}

          {/* Create Promotion CTA Button */}
          <button
            id="btn-create-campaign-nav"
            onClick={() => setIsCreateCampaignModalOpen(true)}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs sm:text-sm font-bold px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl shadow-xs shadow-indigo-500/20 hover:shadow-md transition flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
            <span className="hidden sm:inline">+ Place Order</span>
            <span className="sm:hidden text-xs">Order</span>
          </button>

          {/* User Profile / Login */}
          {user ? (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden border-2 border-indigo-200 focus:outline-hidden hover:scale-105 transition cursor-pointer shrink-0"
              title={user.displayName}
            >
              <img
                src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`}
                alt={user.displayName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </button>
          ) : (
            <button
              id="btn-login-nav"
              onClick={() => setIsAuthModalOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-2.5 sm:px-3.5 py-2 rounded-xl transition flex items-center gap-1 cursor-pointer shrink-0"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

        </div>

      </div>
    </header>
  );
};
