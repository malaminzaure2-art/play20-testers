import React from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Mail, 
  Info, 
  DollarSign, 
  Heart,
  MessageCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setLegalModalType, setIsDeployGuideOpen, setActiveTab } = useApp();

  return (
    <footer className="w-full border-t border-slate-200 bg-white mt-12 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
          
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-pink-500 text-white shadow-xs">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  TrendBoost
                </span>
                <span className="rounded-md bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 text-[9px] font-bold text-indigo-700 uppercase">
                  Social Exchange
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-500 max-w-md leading-relaxed font-medium">
              The leading organic social media growth and creator community engagement platform for TikTok, YouTube, Instagram, and Facebook. 100% real human activity and high-speed delivery.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>100% Real Community Creators & Organic Engagement</span>
            </div>
          </div>

          {/* Col 2: Fast Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setActiveTab('explore')}
                  className="text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  Social Growth Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab('campaigns')}
                  className="text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  My Active Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Compliance & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Help & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setLegalModalType('privacy')}
                  className="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Lock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Privacy Policy</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModalType('terms')}
                  className="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModalType('safety')}
                  className="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
                  <span>Safety & Rules</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModalType('contact')}
                  className="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <MessageCircle className="h-3.5 w-3.5 text-slate-400" />
                  <span>Contact Support (WhatsApp / Email)</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} TrendBoost Social Exchange Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setLegalModalType('privacy')} className="hover:text-slate-700 cursor-pointer">Privacy</button>
            <button onClick={() => setLegalModalType('terms')} className="hover:text-slate-700 cursor-pointer">Terms</button>
            <button onClick={() => setLegalModalType('contact')} className="hover:text-slate-700 cursor-pointer">WhatsApp</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
