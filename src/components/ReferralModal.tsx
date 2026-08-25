import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Copy, 
  Check, 
  Gift, 
  Sparkles, 
  Coins, 
  ArrowRight,
  Share2
} from 'lucide-react';

export const ReferralModal: React.FC = () => {
  const {
    isReferralModalOpen,
    setIsReferralModalOpen,
    user,
    copyReferralLink,
    referrals,
    claimReferralBonus,
    setIsAuthModalOpen,
  } = useApp();

  const [copied, setCopied] = React.useState(false);

  if (!isReferralModalOpen) return null;

  const referralCode = user?.referralCode || 'TREND-VIP';
  const referralLink = `https://trendboost.app?ref=${referralCode}`;

  const handleCopy = () => {
    copyReferralLink();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = `Hey! Join TrendBoost to get thousands of real Followers, Likes and Views on TikTok & YouTube for free! Use my link to get 100 free coins instantly: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl my-8 animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-xs">
              <Gift className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                Invite & Earn Program
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Invite Friends & Earn 100 Coins!
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsReferralModalOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-5">
          
          <div className="rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 border border-indigo-100 space-y-2 text-center">
            <div className="text-3xl">🎁</div>
            <h4 className="font-extrabold text-sm text-slate-900">
              Earn 100 Coins for every invited friend who joins
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Every friend who registers through your link receives 100 free bonus coins, and your account gets credited with 100 coins automatically!
            </p>
          </div>

          {/* Referral Code & Link Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 block">
              Your Unique Referral Link:
            </label>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-700 font-mono select-all focus:outline-hidden"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Quick Share to WhatsApp */}
          <button
            onClick={handleShareWhatsApp}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Share via WhatsApp</span>
          </button>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-semibold">Friends Joined</div>
              <div className="text-xl font-black text-indigo-600">{user?.referralsCount || 0}</div>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <div className="text-xs text-slate-500 font-semibold">Coins Earned</div>
              <div className="text-xl font-black text-amber-700">🪙 {user?.referralEarnings || 0}</div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
