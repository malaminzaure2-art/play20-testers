import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CREDIT_PACKAGES } from '../data/mockData';
import { 
  Coins, 
  Sparkles, 
  CheckCircle2, 
  CreditCard, 
  MessageCircle, 
  ShieldCheck, 
  Zap,
  HelpCircle,
  TrendingUp,
  Award
} from 'lucide-react';

export const BuyCreditsTab: React.FC = () => {
  const {
    buyCredits,
    user,
    setIsAuthModalOpen,
  } = useApp();

  const [currency, setCurrency] = useState<'NGN' | 'USD'>('NGN');
  const [selectedPkgId, setSelectedPkgId] = useState<string | null>(null);

  const handlePurchase = (pkgId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    buyCredits(pkgId);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-black">
          <span>🪙</span>
          <span>BUY BOOSTING COINS (INSTANT DELIVERY)</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Get Coins to Boost Your Accounts Rapidly
        </h1>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Get real human Followers, Subscribers, Likes, and Views with no delay. Pay securely via <strong>Debit Card, Bank Transfer, or WhatsApp</strong>.
        </p>

        {/* Currency Switcher */}
        <div className="pt-2 inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
          <button
            onClick={() => setCurrency('NGN')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              currency === 'NGN'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🇳🇬 Naira (NGN ₦)
          </button>
          <button
            onClick={() => setCurrency('USD')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              currency === 'USD'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            💵 US Dollars ($ USD)
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CREDIT_PACKAGES.map((pkg) => {
          const totalCoins = pkg.credits + (pkg.bonusCredits || 0);

          return (
            <div
              key={pkg.id}
              className={`bg-white rounded-3xl p-6 border flex flex-col justify-between transition-all duration-200 relative ${
                pkg.popular
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-xl'
                  : 'border-slate-200 hover:border-slate-300 shadow-xs'
              }`}
            >
              {/* Popular Badge */}
              {pkg.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[11px] font-bold shadow-md whitespace-nowrap">
                  {pkg.badge}
                </div>
              )}

              <div className="space-y-4">
                
                <div className="space-y-1">
                  <h3 className="font-extrabold text-base text-slate-900">
                    {pkg.name}
                  </h3>
                  <p className="text-xs text-slate-500 leading-snug">
                    {pkg.description}
                  </p>
                </div>

                {/* Coin Quantity Box */}
                <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1 text-center">
                  <div className="text-2xl font-black text-amber-950 flex items-center justify-center gap-1.5">
                    <span>🪙</span>
                    <span>{totalCoins.toLocaleString()}</span>
                    <span className="text-xs font-bold uppercase text-amber-800">Coins</span>
                  </div>
                  {pkg.bonusCredits ? (
                    <div className="text-[11px] font-extrabold text-emerald-700">
                      +{pkg.bonusCredits} Free Bonus Coins 🔥
                    </div>
                  ) : null}
                </div>

                {/* Price Display */}
                <div className="text-center py-1">
                  <div className="text-2xl font-black text-slate-900">
                    {currency === 'NGN' ? `₦${pkg.priceNgn.toLocaleString()}` : `$${pkg.priceUsd.toFixed(2)}`}
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">One-time payment</div>
                </div>

                {/* Feature checklist */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

              </div>

              {/* Purchase Button */}
              <div className="pt-6">
                <button
                  id={`btn-buy-pkg-${pkg.id}`}
                  onClick={() => handlePurchase(pkg.id)}
                  className={`w-full py-3 rounded-2xl font-black text-xs transition flex items-center justify-center gap-1.5 shadow-sm cursor-pointer ${
                    pkg.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-indigo-500/25'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Buy Now ({currency === 'NGN' ? `₦${pkg.priceNgn.toLocaleString()}` : `$${pkg.priceUsd}`})</span>
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Direct WhatsApp / Bank Transfer Support Box */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Instant WhatsApp Support</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            Prefer paying via Bank Transfer or have questions?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            Reach out directly on WhatsApp to submit payment proof or get instant assistance crediting your account!
          </p>
        </div>

        <a
          href="https://wa.me/2349068990863?text=Hello%20TrendBoost,%20I%20would%20like%20to%20purchase%20boosting%20Coins"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-emerald-500/30 transition flex items-center gap-2 shrink-0 cursor-pointer"
        >
          <MessageCircle className="w-5 h-5 fill-slate-950" />
          <span>Chat on WhatsApp</span>
        </a>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-lg font-black text-slate-900">Frequently Asked Questions (FAQs)</h3>
          <p className="text-xs text-slate-500">Everything you need to know about our organic boosting network</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Are followers and likes from real human users?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes, absolutely! Our community is made of active creators and real users who perform tasks on their mobile apps to earn coins.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Is my social media account safe from bans?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes, 100% safe. Actions are performed organically by real humans within the official apps with zero bot automation.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Can I earn coins without paying?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Yes! You can go to the "Earn Coins" tab and follow, subscribe, or like other creators' channels to earn coins completely free.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>How quickly do results start coming in?</span>
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Immediately! As soon as you launch your campaign, it is distributed across our active user base and followers start rolling in.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
