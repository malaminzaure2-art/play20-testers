import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SocialPlatform, BoostActionType } from '../types';
import { 
  X, 
  Zap,
  ShieldCheck,
  ArrowRight,
  HelpCircle,
  Check
} from 'lucide-react';

declare global {
  interface Window {
    PaystackPop?: {
      setup: (options: Record<string, any>) => {
        openIframe: () => void;
      };
    };
  }
}

interface ServiceOption {
  type: BoostActionType;
  label: string;
  unitPriceNgn: number;
  minQty: number;
}

const PLATFORM_CONFIG: Record<'tiktok' | 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'website', {
  name: string;
  icon: string;
  placeholder: string;
  exampleUrl: string;
  services: ServiceOption[];
}> = {
  tiktok: {
    name: 'TikTok',
    icon: '🎵',
    placeholder: 'https://www.tiktok.com/@yourusername',
    exampleUrl: 'Paste your TikTok Profile link or Video link',
    services: [
      { type: 'follow', label: 'Profile Followers', unitPriceNgn: 3.5, minQty: 50 },
      { type: 'like', label: 'Video Likes', unitPriceNgn: 1.5, minQty: 50 },
      { type: 'view', label: 'Video Views', unitPriceNgn: 0.6, minQty: 200 },
      { type: 'comment', label: 'Custom Comments', unitPriceNgn: 10.0, minQty: 20 },
      { type: 'share', label: 'Video Shares', unitPriceNgn: 2.0, minQty: 50 },
    ],
  },
  youtube: {
    name: 'YouTube',
    icon: '📺',
    placeholder: 'https://youtube.com/@channel or video URL',
    exampleUrl: 'Paste your YouTube Channel link or Video link',
    services: [
      { type: 'subscribe', label: 'Subscribers (Monetization Boost)', unitPriceNgn: 6.0, minQty: 50 },
      { type: 'like', label: 'Video Likes', unitPriceNgn: 2.0, minQty: 50 },
      { type: 'view', label: 'High Retention Video Views', unitPriceNgn: 1.2, minQty: 100 },
      { type: 'comment', label: 'Positive Comments', unitPriceNgn: 12.0, minQty: 20 },
      { type: 'share', label: 'Video Shares', unitPriceNgn: 2.5, minQty: 50 },
    ],
  },
  instagram: {
    name: 'Instagram',
    icon: '📸',
    placeholder: 'https://instagram.com/yourusername',
    exampleUrl: 'Paste your Instagram Profile or Post/Reel link',
    services: [
      { type: 'follow', label: 'Real Followers', unitPriceNgn: 3.0, minQty: 50 },
      { type: 'like', label: 'Post / Reel Likes', unitPriceNgn: 1.5, minQty: 50 },
      { type: 'view', label: 'Reel / Video Views', unitPriceNgn: 0.8, minQty: 200 },
      { type: 'comment', label: 'Comments', unitPriceNgn: 10.0, minQty: 20 },
    ],
  },
  facebook: {
    name: 'Facebook',
    icon: '📘',
    placeholder: 'https://facebook.com/page-or-post-link',
    exampleUrl: 'Paste your Facebook Page link or Post link',
    services: [
      { type: 'follow', label: 'Page Followers', unitPriceNgn: 2.5, minQty: 50 },
      { type: 'like', label: 'Post / Page Likes', unitPriceNgn: 1.5, minQty: 50 },
      { type: 'view', label: 'Video Views', unitPriceNgn: 0.8, minQty: 100 },
      { type: 'share', label: 'Post Shares', unitPriceNgn: 2.5, minQty: 50 },
    ],
  },
  twitter: {
    name: 'Twitter / X',
    icon: '🐦',
    placeholder: 'https://x.com/yourusername',
    exampleUrl: 'Paste your Twitter / X Profile link or Tweet link',
    services: [
      { type: 'follow', label: 'Profile Followers', unitPriceNgn: 3.5, minQty: 50 },
      { type: 'like', label: 'Tweet Likes', unitPriceNgn: 1.8, minQty: 50 },
    ],
  },
  website: {
    name: 'Website Traffic',
    icon: '🌐',
    placeholder: 'https://yourwebsite.com',
    exampleUrl: 'Paste your Blog or Website URL',
    services: [
      { type: 'view', label: 'Real Targeted Web Visitors', unitPriceNgn: 1.0, minQty: 100 },
    ],
  },
};

export const AddAppModal: React.FC = () => {
  const {
    isCreateCampaignModalOpen,
    setIsCreateCampaignModalOpen,
    createNewCampaign,
    user,
    addToast,
  } = useApp();

  const [platform, setPlatform] = useState<'tiktok' | 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'website'>('youtube');
  const currentConfig = PLATFORM_CONFIG[platform] || PLATFORM_CONFIG.youtube;
  
  const [actionType, setActionType] = useState<BoostActionType>('subscribe');
  const [targetUrl, setTargetUrl] = useState('');
  const [quantity, setQuantity] = useState<number>(500);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCreateCampaignModalOpen) return null;

  // Selected Service
  const currentService = currentConfig.services.find(s => s.type === actionType) || currentConfig.services[0];
  const totalPriceNgn = Math.round(quantity * currentService.unitPriceNgn);

  const executeOrderCreation = (paymentRef?: string) => {
    const campaignTitle = `${currentConfig.name} Boost: ${quantity.toLocaleString()} ${currentService.label}`;

    const success = createNewCampaign({
      platform,
      actionType: currentService.type,
      title: campaignTitle,
      targetUrl: targetUrl.trim(),
      category: 'General',
      description: `Direct boost order for ${quantity} ${currentService.label} on ${currentConfig.name}`,
      rewardPerAction: 10,
      requiredCount: quantity,
      minDurationSeconds: 10,
      paymentMethod: 'cash_card',
      amountPaidNgn: totalPriceNgn,
    });

    setIsSubmitting(false);

    if (success) {
      setTargetUrl('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetUrl.trim() || !targetUrl.startsWith('http')) {
      alert('Please enter a valid target URL starting with https://');
      return;
    }

    setIsSubmitting(true);
    const orderRef = `TB-${platform.substring(0, 2).toUpperCase()}-${Date.now().toString().slice(-6)}`;

    // Trigger Paystack Popup Checkout
    if (typeof window !== 'undefined' && window.PaystackPop) {
      try {
        const paystackKey = (import.meta as any).env?.VITE_PAYSTACK_PUBLIC_KEY || 'pk_live_ebdab74cbfcc040409a13d8234444db5ca620140';
        
        const handler = window.PaystackPop.setup({
          key: paystackKey,
          email: user?.email || 'customer@trendboost.app',
          amount: totalPriceNgn * 100, // Paystack amount is in Kobo
          currency: 'NGN',
          ref: orderRef,
          metadata: {
            custom_fields: [
              { display_name: "Platform", variable_name: "platform", value: currentConfig.name },
              { display_name: "Service", variable_name: "service", value: currentService.label },
              { display_name: "Target URL", variable_name: "target_url", value: targetUrl.trim() },
              { display_name: "Quantity", variable_name: "quantity", value: quantity.toString() },
            ]
          },
          callback: function(response: { reference: string }) {
            addToast('success', 'Payment Successful! 💳', `Paystack Ref: ${response.reference}`);
            executeOrderCreation(response.reference);
          },
          onClose: function() {
            setIsSubmitting(false);
            addToast('info', 'Payment Cancelled', 'You can retry whenever you are ready.');
          }
        });

        handler.openIframe();
        return;
      } catch (err) {
        console.warn('Paystack popup fallback:', err);
      }
    }

    // Direct Instant Activation Fallback
    executeOrderCreation(orderRef);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/75 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[94vh] my-auto">
        
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/80 via-purple-50/60 to-pink-50/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-black shadow-md shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg text-slate-900 leading-tight">
                Order Social Media Promotion 🚀
              </h3>
              <p className="text-xs text-slate-500">
                Fast, automated delivery for real social media growth.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCreateCampaignModalOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Guide Banner */}
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200/80 flex items-center gap-2 text-xs text-slate-600">
          <HelpCircle className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            Choose your network & service, paste your link, and select your quantity.
          </span>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Step 1: Select Platform */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Step 1: Choose Platform <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(Object.keys(PLATFORM_CONFIG) as Array<'tiktok' | 'youtube' | 'instagram' | 'facebook' | 'twitter' | 'website'>).map((pKey) => {
                const cfg = PLATFORM_CONFIG[pKey];
                const isSelected = platform === pKey;
                return (
                  <button
                    key={pKey}
                    type="button"
                    onClick={() => {
                      setPlatform(pKey);
                      setActionType(cfg.services[0].type);
                    }}
                    className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm ring-2 ring-indigo-500/30'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-lg">{cfg.icon}</span>
                    <span>{cfg.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Select Service */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Step 2: Choose Service for {currentConfig.name} <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentConfig.services.map((srv) => {
                const isSelected = actionType === srv.type;
                return (
                  <button
                    key={srv.type}
                    type="button"
                    onClick={() => setActionType(srv.type)}
                    className={`p-3.5 rounded-2xl text-xs font-bold text-left transition cursor-pointer border flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm ring-2 ring-indigo-500/20'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        isSelected ? 'bg-white text-indigo-600 font-black' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : '•'}
                      </div>
                      <span className="text-xs font-bold">{srv.label}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Paste Link */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Step 3: Paste Your Profile or Video Link <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              required
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              placeholder={currentConfig.placeholder}
              className="w-full px-4 py-3 rounded-2xl border border-slate-300 text-xs sm:text-sm text-slate-900 font-mono focus:outline-hidden focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 bg-slate-50/50"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Safe. No passwords required ever.</span>
              </span>
              <span className="text-indigo-600 font-medium">{currentConfig.exampleUrl}</span>
            </div>
          </div>

          {/* Step 4: Choose Quantity & Live Total Price */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              Step 4: Select Quantity
            </label>
            
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
              {[100, 250, 500, 1000, 2500, 5000].map((qty) => {
                const isSelected = quantity === qty;
                const price = Math.round(qty * currentService.unitPriceNgn);
                return (
                  <button
                    key={qty}
                    type="button"
                    onClick={() => setQuantity(qty)}
                    className={`py-2 px-1 rounded-xl text-center border transition cursor-pointer flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-black">{qty.toLocaleString()}</span>
                    <span className={`text-[10px] font-bold ${isSelected ? 'text-amber-300' : 'text-slate-500'}`}>
                      ₦{price.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2 flex-1">
                <span className="text-xs text-slate-600 font-medium whitespace-nowrap">Or custom quantity:</span>
                <input
                  type="number"
                  min={currentService.minQty || 50}
                  max={100000}
                  value={quantity || ''}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                  placeholder="e.g. 500"
                />
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold flex items-center justify-between sm:justify-start gap-2 shrink-0">
                <span className="text-slate-300">Total Price:</span>
                <span className="text-amber-300 font-black text-sm">₦{totalPriceNgn.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Single Direct Action Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl font-black text-sm sm:text-base bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span>
                {isSubmitting
                  ? 'Launching Order...'
                  : `Pay ₦${totalPriceNgn.toLocaleString()} with Paystack 🚀`}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
