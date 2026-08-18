import React, { useState } from 'react';
import { 
  CreditCard, 
  Coins, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  HelpCircle, 
  Award, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CREDIT_PACKAGES } from '../data/mockData';
import { CreditPackage } from '../types';

export const BuyCreditsTab: React.FC = () => {
  const { user, buyCredits, addToast, setActiveTab, setIsAddAppModalOpen } = useApp();
  const [selectedPackageForCheckout, setSelectedPackageForCheckout] = useState<CreditPackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'gpay' | 'paypal'>('gpay');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const handleCheckout = (pkg: CreditPackage) => {
    if (!user) {
      addToast('warning', 'Sign In Required', 'Please sign in to purchase testing credits.');
      return;
    }
    setSelectedPackageForCheckout(pkg);
  };

  const executePurchase = () => {
    if (!selectedPackageForCheckout) return;
    setIsProcessing(true);

    setTimeout(() => {
      buyCredits(selectedPackageForCheckout.id);
      setIsProcessing(false);
      setSelectedPackageForCheckout(null);
    }, 1200);
  };

  const FAQS = [
    {
      q: 'How many credits do I need for a 20-tester closed test?',
      a: 'To satisfy Google Play, you need 20 testers for 14 continuous days. At standard reward rates (10 coins/day), that requires 200 base credits plus completion bonuses. The 350 Coins "Google Play Guarantee" package fully funds your entire 14-day test with priority placement.'
    },
    {
      q: 'Can I get testers for free without buying credits?',
      a: 'Yes! Play20 is a 100% fair reciprocity exchange. By testing 2 peer apps for 14 days, you can earn over 300+ coins and fund your own app completely free of charge.'
    },
    {
      q: 'How does the 30-Second Anti-Cheat timer protect my app?',
      a: 'Google detects unnatural app opens and instant uninstalls. Our platform enforces an in-app dwell timer and validates 50+ character genuine feedback to ensure active engagement metrics recorded in your Play Console.'
    },
    {
      q: 'What if a tester drops out during the 14 days?',
      a: 'Our pool automatically reallocates reserved tester slots to backup qualified Android developers so you never drop below the required 20 daily active testers.'
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto pb-10">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3.5 py-1 text-xs font-bold text-indigo-700 mb-3 shadow-xs">
          <Coins className="h-3.5 w-3.5" />
          <span>Developer Credit Store</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Launch Your Closed Test Instantly
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2.5">
          Don't have time to test peer apps? Purchase instant developer credits to hire 20 verified Android testers immediately.
        </p>

        {user && (
          <div className="mt-4 inline-flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs shadow-xs">
            <span className="text-slate-500 font-medium">Current Balance:</span>
            <strong className="text-amber-700 font-bold text-sm flex items-center gap-1">
              {user.credits} ⭐ Coins
            </strong>
          </div>
        )}
      </div>

      {/* Credit Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {CREDIT_PACKAGES.map((pkg) => {
          const isPopular = pkg.popular;

          return (
            <div
              key={pkg.id}
              className={`relative flex flex-col justify-between rounded-3xl p-6 transition-all duration-200 bg-white shadow-xs ${
                isPopular
                  ? 'border-2 border-indigo-600 shadow-md shadow-indigo-100'
                  : 'border border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-indigo-600 px-3.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  Most Popular • Guaranteed Pass
                </div>
              )}

              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    {pkg.tag || 'Package'}
                  </span>
                  <div className="flex items-center gap-1 text-amber-800 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    <Coins className="h-3 w-3 text-amber-600" />
                    <span>{pkg.credits} Coins</span>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  {pkg.name}
                </h3>

                <p className="text-xs text-slate-500 mt-1 min-h-[36px] leading-relaxed">
                  {pkg.description}
                </p>

                {/* Price Display */}
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-slate-900">
                    ${pkg.priceUsd}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">USD one-time</span>
                </div>

                {/* Features list */}
                <div className="mt-6 space-y-2.5 pt-5 border-t border-slate-100">
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                      <div className="rounded-full bg-emerald-100 text-emerald-700 p-0.5 shrink-0 mt-0.5">
                        <Check className="h-3 w-3" />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase Button */}
              <div className="mt-8">
                <button
                  id={`btn-buy-${pkg.id}`}
                  onClick={() => handleCheckout(pkg)}
                  className={`w-full rounded-xl py-3 text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center justify-center gap-2 ${
                    isPopular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Get {pkg.credits} Coins (${pkg.priceUsd})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Accordion */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h3 className="text-lg font-bold text-slate-900 text-center mb-6 flex items-center justify-center gap-2">
          <HelpCircle className="h-5 w-5 text-indigo-600" />
          <span>Frequently Asked Questions</span>
        </h3>

        <div className="space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="flex items-center justify-between w-full p-4 text-left text-xs sm:text-sm font-bold text-slate-800 hover:text-indigo-600 transition-colors"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-slate-400 shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Checkout Simulator Modal */}
      {selectedPackageForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Instant Credit Checkout</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Secure 256-bit Encrypted Checkout</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPackageForCheckout(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Item summary */}
            <div className="mt-4 rounded-2xl bg-slate-50 p-4 border border-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-900">{selectedPackageForCheckout.name}</div>
                  <div className="text-[11px] text-amber-800 font-bold flex items-center gap-1 mt-0.5">
                    <Coins className="h-3 w-3 text-amber-600" />
                    +{selectedPackageForCheckout.credits} Testing Coins
                  </div>
                </div>
                <div className="text-lg font-extrabold text-slate-900">
                  ${selectedPackageForCheckout.priceUsd}.00
                </div>
              </div>
            </div>

            {/* Payment method selector */}
            <div className="mt-4 space-y-2">
              <label className="text-xs font-semibold text-slate-700">Choose Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('gpay')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    paymentMethod === 'gpay'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Google Pay
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    paymentMethod === 'card'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Credit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  PayPal
                </button>
              </div>
            </div>

            {/* Card simulator fields if card selected */}
            {paymentMethod === 'card' && (
              <div className="mt-3 space-y-2">
                <input
                  type="text"
                  placeholder="Card Number (4242 •••• •••• 4242)"
                  defaultValue="4242 4242 4242 4242"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="MM/YY"
                    defaultValue="12/28"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                  <input
                    type="text"
                    placeholder="CVC"
                    defaultValue="899"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            )}

            {/* Guarantee Note */}
            <div className="mt-4 flex items-center gap-2 text-[11px] text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
              <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>100% Google Play Production 20-tester money back guarantee.</span>
            </div>

            {/* Buttons */}
            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setSelectedPackageForCheckout(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={executePurchase}
                disabled={isProcessing}
                className="flex-[2] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-xs font-bold transition-all shadow-sm shadow-indigo-200 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    <span>Pay ${selectedPackageForCheckout.priceUsd} & Credit Coins</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
