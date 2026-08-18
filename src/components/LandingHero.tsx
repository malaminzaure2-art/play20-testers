import React from 'react';
import { 
  CheckCircle2, 
  ShieldCheck, 
  Coins, 
  Smartphone, 
  ArrowRight, 
  Award, 
  PlusCircle,
  Users
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingHero: React.FC = () => {
  const { user, signInWithGoogle, setActiveTab, setIsAddAppModalOpen } = useApp();

  return (
    <div className="relative overflow-hidden bg-white pt-8 pb-10 border-b border-slate-200 shadow-xs">
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Policy Tag */}
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/80 px-3.5 py-1 text-xs font-bold text-indigo-800 mb-4 shadow-xs">
          <ShieldCheck className="h-4 w-4 text-indigo-600" />
          <span>Google Play 20-Tester & 14-Day Policy Helper</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Get <span className="text-indigo-600">20 Real Testers for 14 Days</span> on Google Play
        </h1>
        
        <p className="mt-3.5 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Test peer Android applications to earn free coins, or submit your own app to get 20 active testers for 14 continuous days to meet Google Play Console production requirements.
        </p>

        {/* Action CTAs */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {user ? (
            <>
              <button
                id="hero-cta-addapp"
                onClick={() => setIsAddAppModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md shadow-indigo-100 transition-all active:scale-95"
              >
                <PlusCircle className="h-4 w-4" />
                <span>+ Submit Your App</span>
              </button>

              <button
                id="hero-cta-explore"
                onClick={() => setActiveTab('explore')}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all shadow-xs"
              >
                <Smartphone className="h-4 w-4 text-indigo-600" />
                <span>Explore Apps to Test</span>
              </button>
            </>
          ) : (
            <>
              <button
                id="hero-cta-get-started"
                onClick={signInWithGoogle}
                className="flex items-center gap-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-md transition-all active:scale-95"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Get Started with Google</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>

              <button
                onClick={() => setActiveTab('explore')}
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all shadow-xs"
              >
                <span>Explore Available Apps</span>
              </button>
            </>
          )}
        </div>

        {/* 3 Simple Steps */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-4xl mx-auto text-left">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-6 w-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">1</div>
              <h3 className="text-xs font-bold text-slate-900">Test Apps & Earn Coins</h3>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Download peer developer apps on Google Play, test for 30 seconds daily, and submit quick feedback to earn coins.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-6 w-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">2</div>
              <h3 className="text-xs font-bold text-slate-900">Submit Your App</h3>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Use your earned coins to open your 20-tester pool with your Google Group and Play Store opt-in link.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-xs">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="h-6 w-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">3</div>
              <h3 className="text-xs font-bold text-slate-900">Google Play Compliant</h3>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              After 14 consecutive days of active engagement, your app meets the requirements for Google Play Production.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
