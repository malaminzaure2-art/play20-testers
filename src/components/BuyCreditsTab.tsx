import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Coins, 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Globe,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CREDIT_PACKAGES } from '../data/mockData';
import { CreditPackage } from '../types';

export const BuyCreditsTab: React.FC = () => {
  const { user, buyCredits, addToast, setIsAuthModalOpen } = useApp();
  const [selectedPackageForCheckout, setSelectedPackageForCheckout] = useState<CreditPackage | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currency, setCurrency] = useState<'USD' | 'NGN'>('USD');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const PAYSTACK_PUBLIC_KEY = 'pk_live_ebdab74cbfcc040409a13d8234444db5ca620140';

  // Completely Automatic Location & Currency Detection (Silent & Seamless)
  useEffect(() => {
    try {
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const userLocale = navigator.language || '';
      
      // If visitor is strictly inside Nigeria -> display NGN (₦)
      if (
        userTimeZone.includes('Lagos') || 
        userLocale.toLowerCase().includes('ng') || 
        userTimeZone.includes('Africa/Lagos')
      ) {
        setCurrency('NGN');
      } else {
        // All international visitors worldwide -> display pure USD ($)
        setCurrency('USD');
      }
    } catch {
      setCurrency('USD');
    }
  }, []);

  const handleOpenCheckout = (pkg: CreditPackage) => {
    if (!user) {
      setIsAuthModalOpen(true);
      addToast('info', 'Sign In Required', 'Please sign in or create an account to purchase testing credits.');
      return;
    }
    setSelectedPackageForCheckout(pkg);
  };

  const executePaystackPayment = (pkg: CreditPackage) => {
    if (!user) return;
    setIsProcessing(true);

    const triggerPopup = () => {
      try {
        const amountInKobo = pkg.priceNgn * 100;
        const txReference = `PL20_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;

        if (typeof (window as any).PaystackPop !== 'undefined') {
          const handler = (window as any).PaystackPop.setup({
            key: PAYSTACK_PUBLIC_KEY,
            email: user.email || 'customer@hausatech.com',
            amount: amountInKobo,
            currency: 'NGN',
            ref: txReference,
            metadata: {
              custom_fields: [
                {
                  display_name: 'Customer Name',
                  variable_name: 'customer_name',
                  value: user.displayName || 'Developer'
                },
                {
                  display_name: 'Package',
                  variable_name: 'package_name',
                  value: `${pkg.name} (${pkg.credits} Coins)`
                },
                {
                  display_name: 'User ID',
                  variable_name: 'user_uid',
                  value: user.uid
                }
              ]
            },
            callback: function(response: any) {
              setIsProcessing(false);
              setSelectedPackageForCheckout(null);
              buyCredits(pkg.id, response.reference || txReference);
            },
            onClose: function() {
              setIsProcessing(false);
              addToast('info', 'Checkout Closed', 'You can complete your purchase whenever you are ready.');
            }
          });

          handler.openIframe();
        } else {
          const script = document.createElement('script');
          script.src = 'https://js.paystack.co/v1/inline.js';
          script.onload = () => executePaystackPayment(pkg);
          document.body.appendChild(script);
        }
      } catch (err: any) {
        setIsProcessing(false);
        console.error('Checkout Error:', err);
        addToast('error', 'Checkout Error', 'Could not open payment gateway. Please try again.');
      }
    };

    triggerPopup();
  };

  const isNgn = currency === 'NGN';

  const FAQS = [
    {
      q: 'How many credits do I need for a 20-tester closed test?',
      a: 'To satisfy Google Play requirements, you need 20 testers for 14 continuous days. At standard reward rates (10 coins/day), that requires 200 base credits plus completion bonuses. The 250 Coins package fully funds your entire 14-day test with priority matching.'
    },
    {
      q: 'Can I get testers for free without buying credits?',
      a: 'Yes! Play20 is a 100% fair reciprocity exchange. By testing 2 peer apps for 14 days, you can earn over 300+ coins and fund your own app completely free of charge.'
    },
    {
      q: 'Which payment methods are accepted?',
      a: 'We accept all major credit and debit cards (Visa, Mastercard, American Express), Apple Pay, and secure instant payments globally.'
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
        <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-bold text-emerald-800 mb-3 shadow-xs">
          <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
          <span>🎉 Launch Promotion • 60% OFF All Packages</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900">
          Launch Your Closed Test Instantly
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2.5">
          Don't have time to test peer apps? Purchase instant developer credits to hire 20 verified Android testers immediately.
        </p>

        {user && (
          <div className="mt-4 inline-flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs shadow-xs">
            <span className="text-slate-500 font-medium">Your Current Balance:</span>
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
          const displayPrice = isNgn ? `₦${pkg.priceNgn.toLocaleString()}` : `$${pkg.priceUsd}`;

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
                    {pkg.badge || 'Package'}
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
                <div className="mt-5 flex items-baseline gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {displayPrice}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">one-time</span>
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

              {/* Action button */}
              <div className="mt-8">
                <button
                  id={`btn-buy-${pkg.id}`}
                  onClick={() => handleOpenCheckout(pkg)}
                  className={`w-full rounded-xl py-3 text-xs font-bold transition-all shadow-xs active:scale-95 flex items-center justify-center gap-2 ${
                    isPopular
                      ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-200'
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Buy {pkg.credits} Coins ({displayPrice})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Security Banner */}
      <div className="mt-12 rounded-3xl border border-indigo-100 bg-linear-to-r from-indigo-50/70 via-white to-indigo-50/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200 shrink-0">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-900">
              Secure Encrypted Payment Gateway
            </h4>
            <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
              Pay securely with Visa, Mastercard, American Express, Apple Pay, and international cards. Your testing coins are immediately credited to your balance upon payment completion.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <Lock className="h-3.5 w-3.5 text-emerald-600" />
            <span>256-bit SSL Protected</span>
          </span>
        </div>
      </div>

      {/* FAQ Accordion */}
      <div className="mt-14 max-w-3xl mx-auto">
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

      {/* Checkout Modal */}
      {selectedPackageForCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Secure Checkout</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Instant Coin Credit to Account</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPackageForCheckout(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 text-sm font-bold"
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
                    <Coins className="h-3.5 w-3.5 text-amber-600" />
                    +{selectedPackageForCheckout.credits} Testing Reward Coins
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-slate-900">
                    {isNgn ? `₦${selectedPackageForCheckout.priceNgn.toLocaleString()}` : `$${selectedPackageForCheckout.priceUsd}`}
                  </div>
                  <div className="text-[10px] text-slate-400 font-medium">One-time payment</div>
                </div>
              </div>
            </div>

            {/* Accepted Methods Info */}
            <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5 space-y-2 text-xs text-slate-600">
              <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                Supported Payment Methods:
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-700">
                  <CreditCard className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Mastercard & Visa</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Globe className="h-3.5 w-3.5 text-blue-600" />
                  <span>International Cards</span>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setSelectedPackageForCheckout(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => executePaystackPayment(selectedPackageForCheckout)}
                disabled={isProcessing}
                className="flex-[2] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-3 text-xs font-bold transition-all shadow-md shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Opening Gateway...</span>
                ) : (
                  <>
                    <Zap className="h-4 w-4 fill-white" />
                    <span>Pay {isNgn ? `₦${selectedPackageForCheckout.priceNgn.toLocaleString()}` : `$${selectedPackageForCheckout.priceUsd}`}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
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
