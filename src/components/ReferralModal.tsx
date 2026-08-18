import React from 'react';
import { 
  Gift, 
  Copy, 
  Share2, 
  Users, 
  Coins, 
  CheckCircle2, 
  Sparkles,
  MessageCircle,
  Send
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReferralModal: React.FC = () => {
  const { 
    user, 
    isReferralModalOpen, 
    setIsReferralModalOpen, 
    copyReferralLink, 
    referrals,
    claimReferralBonus,
    addToast
  } = useApp();

  if (!isReferralModalOpen) return null;

  const referralCode = user?.referralCode || 'PLAY20-MZ88';
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://play20-testers.vercel.app';
  const referralLink = `${baseUrl}?ref=${referralCode}`;
  const shareText = `🚀 Join me on Play20! Test Android apps for 14 days and get 20 free testers for your own Google Play app. Use my invite link to get +50 FREE Coins: ${referralLink}`;

  const shareOnWhatsApp = () => {
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`, '_blank');
  };

  const shareOnTelegram = () => {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent('🚀 Join Play20 and get 20 Google Play testers for free + 50 Coins!')}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <Gift className="h-6 w-6 text-indigo-600" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                Invite & Earn Rewards
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Get +50 Free Coins Per Friend
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsReferralModalOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Stats Row */}
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3.5 text-center">
            <span className="text-slate-500 text-xs font-semibold">Friends Invited</span>
            <div className="mt-1 flex items-center justify-center gap-1.5 text-lg font-black text-slate-900">
              <Users className="h-4 w-4 text-indigo-600" />
              <span>{user?.referralsCount || 0}</span>
            </div>
          </div>

          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-3.5 text-center">
            <span className="text-amber-800 text-xs font-semibold">Coins Earned</span>
            <div className="mt-1 flex items-center justify-center gap-1.5 text-lg font-black text-amber-900">
              <Coins className="h-4 w-4 text-amber-500 fill-amber-400" />
              <span>+{user?.referralEarnings || 0}</span>
            </div>
          </div>
        </div>

        {/* How it works */}
        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-3.5 space-y-2 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <div className="h-4 w-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              1
            </div>
            <p><strong>Share your invite link</strong> with other Android developers or testers.</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-4 w-4 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              2
            </div>
            <p>They sign up and test their first app on Play20.</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="h-4 w-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
              3
            </div>
            <p><strong>You both instantly receive +50 Coins</strong> to publish or test apps!</p>
          </div>
        </div>

        {/* Link Box */}
        <div className="mt-5">
          <label className="text-xs font-bold text-slate-800 mb-1.5 block">
            Your Unique Invite Link
          </label>
          <div className="flex items-center gap-2">
            <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-xs font-mono text-slate-700 truncate select-all">
              {referralLink}
            </div>
            <button
              onClick={copyReferralLink}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 text-xs font-bold shadow-xs transition-all active:scale-95 shrink-0"
            >
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </button>
          </div>
        </div>

        {/* Quick Social Share Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <button
            onClick={shareOnWhatsApp}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-3 text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <MessageCircle className="h-4 w-4" />
            <span>Share WhatsApp</span>
          </button>

          <button
            onClick={shareOnTelegram}
            className="flex items-center justify-center gap-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white py-2.5 px-3 text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            <Send className="h-4 w-4" />
            <span>Share Telegram</span>
          </button>
        </div>

        {/* Recent Referrals List */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2.5">
            <h4 className="text-xs font-bold text-slate-800">
              Recent Successful Referrals
            </h4>
            <span className="text-[10px] font-bold text-slate-400">
              {referrals.length} developers
            </span>
          </div>

          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {referrals.map((ref) => (
              <div
                key={ref.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-2.5 text-xs"
              >
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-800">{ref.referredName}</span>
                  <span className="text-[10px] text-slate-400">({ref.date})</span>
                </div>
                <div className="flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg text-[10px]">
                  <span>+{ref.coinsEarned} Coins</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
