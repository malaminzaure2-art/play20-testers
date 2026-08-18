import React from 'react';
import { 
  Play, 
  ShieldCheck, 
  Lock, 
  FileText, 
  Mail, 
  Info, 
  DollarSign, 
  Heart
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { setLegalModalType, setIsDeployGuideOpen } = useApp();

  return (
    <footer className="w-full border-t border-slate-200 bg-white mt-12 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
          
          {/* Col 1: Brand & Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                <Play className="h-4 w-4 fill-white translate-x-0.5" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900">
                  Play20
                </span>
                <span className="rounded-md bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 text-[9px] font-bold text-indigo-700 uppercase">
                  Testers
                </span>
              </div>
            </div>
            
            <p className="text-xs text-slate-500 max-w-md leading-relaxed font-medium">
              The premier reciprocal Android closed testing platform. Helping indie developers and mobile studios achieve 20 opt-in testers for 14 consecutive days to seamlessly unlock Google Play production access.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>100% Compliant with Google Play Developer Policies</span>
            </div>
          </div>

          {/* Col 2: Developer Resources */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Developer Tools
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setIsDeployGuideOpen(true)}
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  14-Day Closed Testing Checklist
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModalType('about')}
                  className="text-slate-600 hover:text-indigo-600 transition-colors"
                >
                  How Play20 Works (Peer Testing)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModalType('adsense')}
                  className="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1"
                >
                  <span>AdSense Publisher Info</span>
                  <span className="rounded bg-amber-100 text-amber-900 px-1.5 py-0.2 text-[9px] font-bold">New</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Compliance & Legal */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Legal & Policies
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setLegalModalType('privacy')}
                  className="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
                >
                  <Lock className="h-3.5 w-3.5 text-slate-400" />
                  <span>Privacy Policy & Cookies</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModalType('terms')}
                  className="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
                >
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setLegalModalType('contact')}
                  className="text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1.5"
                >
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>Contact & Support</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} Play20 Testers Platform. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => setLegalModalType('privacy')} className="hover:text-slate-700">Privacy</button>
            <button onClick={() => setLegalModalType('terms')} className="hover:text-slate-700">Terms</button>
            <button onClick={() => setLegalModalType('contact')} className="hover:text-slate-700">Support</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
