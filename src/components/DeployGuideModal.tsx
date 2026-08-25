import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  BookOpen, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Users,
  Play,
  Heart,
  UserPlus
} from 'lucide-react';

export const DeployGuideModal: React.FC = () => {
  const { isDeployGuideOpen, setIsDeployGuideOpen, setActiveTab } = useApp();

  if (!isDeployGuideOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                How TrendBoost Works (User Guide)
              </h3>
              <p className="text-xs text-slate-500">
                Learn how to grow your TikTok, YouTube, Instagram, and Facebook profiles effortlessly
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDeployGuideOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-700 text-xs sm:text-sm leading-relaxed">
          
          {/* Section 1 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-black">1</span>
              <span>What is TrendBoost and how does it work?</span>
            </div>
            <p className="text-slate-600 pl-8">
              <strong>TrendBoost</strong> is a genuine creator community engagement exchange. If you manage accounts across <strong>TikTok, YouTube, Instagram, Facebook, or Telegram</strong>, you can connect with real users who will Follow, Like, View, and Subscribe to your content safely and organically.
            </p>
          </div>

          {/* Section 2 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-black">2</span>
              <span>Two (2) Ways to Utilize the Platform:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-8">
              <div className="p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                <div className="font-bold text-amber-900 flex items-center gap-1.5">
                  <span>🪙</span>
                  <span>A: Free Organic Growth</span>
                </div>
                <p className="text-xs text-slate-600">
                  Head over to the <strong>"Earn Coins"</strong> tab to like, follow, and engage with other creators' accounts to accumulate coins, then spend those coins to boost your own content.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-1.5">
                <div className="font-bold text-indigo-900 flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>B: Instant Coin Packages</span>
                </div>
                <p className="text-xs text-slate-600">
                  If you prefer instant results without manual tasking, navigate to the <strong>"Buy Coins"</strong> tab to purchase coin packages and launch viral campaigns immediately.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">3</span>
              <span>Pro Tips for Maximum Engagement</span>
            </div>
            <div className="space-y-1.5 pl-8 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Set rewards at 10 to 15 coins per action to place your campaigns at top priority in the task feed.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Claim your Daily Login Bonus every 24 hours to grow your streak and bonus balance.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Share your referral link with creator friends to earn 100 bonus coins for every registered user.</span>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => setIsDeployGuideOpen(false)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={() => {
              setIsDeployGuideOpen(false);
              setActiveTab('explore');
            }}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
          >
            Explore Campaigns Now
          </button>
        </div>

      </div>
    </div>
  );
};
