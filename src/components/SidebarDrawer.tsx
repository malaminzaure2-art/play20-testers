import React from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  TrendingUp,
  ShieldAlert,
  FileText,
  PhoneCall,
  LogOut,
  LogIn
} from 'lucide-react';

export const SidebarDrawer: React.FC = () => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    user,
    activeTab,
    setActiveTab,
    setIsAuthModalOpen,
    signOutUser,
    setLegalModalType,
  } = useApp();

  if (!isSidebarOpen) return null;

  const navigateTo = (tab: any) => {
    setActiveTab(tab);
    setIsSidebarOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 left-0 max-w-xs w-full bg-white shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 flex items-center justify-center text-white font-bold shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-slate-900 tracking-tight leading-none">
                Trend<span className="text-indigo-600">Boost</span>
              </h2>
              <span className="text-[11px] text-slate-500 font-medium">Social Growth Platform</span>
            </div>
          </div>

          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card / Login Banner */}
        <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-indigo-50/50 via-purple-50/30 to-white">
          {user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <img
                  src={user.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.uid}`}
                  alt={user.displayName}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-xl object-cover border-2 border-indigo-300 shadow-xs"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-sm text-slate-900 truncate">
                    {user.displayName}
                  </h3>
                  <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-700">
                      {user.boosterTier || 'Bronze Booster'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Quick Status */}
              <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase">Account Status</div>
                  <div className="font-extrabold text-xs text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Active Member</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-2 space-y-2.5">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl">
                🚀
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900">Welcome to TrendBoost!</h4>
                <p className="text-xs text-slate-500">Fast & Automated Social Growth.</p>
              </div>
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  setIsAuthModalOpen(true);
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Sign In / Register
              </button>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Main Navigation */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Orders & Activity
            </div>
            <div className="space-y-1">
              <button
                onClick={() => navigateTo('campaigns')}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                  activeTab === 'campaigns'
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>My Active Orders</span>
              </button>
            </div>
          </div>

          {/* System & Support */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-2">
              Policies & Support
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  setLegalModalType('safety');
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
                <span>Safety & Organic Rules</span>
              </button>

              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  setLegalModalType('privacy');
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Privacy Policy & Terms</span>
              </button>

              <button
                onClick={() => {
                  setIsSidebarOpen(false);
                  setLegalModalType('contact');
                }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs text-slate-600 hover:bg-slate-50 transition cursor-pointer"
              >
                <PhoneCall className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact Support (WhatsApp)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Drawer Footer (Sign Out / Version) */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-medium">
            TrendBoost Pro
          </div>
          {user && (
            <button
              onClick={() => {
                signOutUser();
                setIsSidebarOpen(false);
              }}
              className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
