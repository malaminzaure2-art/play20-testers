import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Zap,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  ThumbsUp,
  Headphones
} from 'lucide-react';

interface PlatformServiceInfo {
  name: string;
  icon: string;
  badge: string;
  badgeColor: string;
  popularService: string;
  startingPrice: string;
  features: string[];
}

const PLATFORM_SHOWCASE: Record<string, PlatformServiceInfo> = {
  tiktok: {
    name: 'TikTok Growth',
    icon: '🎵',
    badge: 'Trending 🔥',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200/60',
    popularService: 'Followers, Likes & Views',
    startingPrice: 'From ₦0.60 / view',
    features: ['High-Retention Views', 'Active Profile Followers', 'Algorithm FYP Boost', 'Real Likes & Shares'],
  },
  youtube: {
    name: 'YouTube Promotion',
    icon: '📺',
    badge: 'High Demand 🚀',
    badgeColor: 'bg-red-50 text-red-700 border-red-200/60',
    popularService: 'Subscribers, Views & Likes',
    startingPrice: 'From ₦1.20 / view',
    features: ['Monetization Subscribers', 'High Retention Watch Time', 'Real Video Engagement', '100% Safe Channel Growth'],
  },
  instagram: {
    name: 'Instagram Boost',
    icon: '📸',
    badge: 'Fast Delivery ⚡',
    badgeColor: 'bg-pink-50 text-pink-700 border-pink-200/60',
    popularService: 'Followers, Likes & Reels',
    startingPrice: 'From ₦0.80 / view',
    features: ['Organic-Looking Followers', 'Reel Video Viral Push', 'Explore Feed Placement', 'Zero Password Required'],
  },
  facebook: {
    name: 'Facebook Growth',
    icon: '📘',
    badge: 'Instant ⏱️',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/60',
    popularService: 'Page Followers & Post Likes',
    startingPrice: 'From ₦0.80 / view',
    features: ['Page Monetization Boost', 'Post & Video Likes', 'Share Viral Distribution', 'Active Audience Reach'],
  },
  twitter: {
    name: 'Twitter / X Boost',
    icon: '🐦',
    badge: 'Viral Reach 📈',
    badgeColor: 'bg-slate-100 text-slate-700 border-slate-200',
    popularService: 'Followers & Tweet Likes',
    startingPrice: 'From ₦1.80 / like',
    features: ['Profile Followers Boost', 'Tweet Likes & Retweets', 'Higher Impression Score', 'Safe & Permanent'],
  },
  website: {
    name: 'Website Traffic',
    icon: '🌐',
    badge: 'SEO Boost 🌍',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    popularService: 'Targeted Web Visitors',
    startingPrice: 'From ₦1.00 / visit',
    features: ['Real Targeted Visitors', 'Low Bounce Rate Traffic', 'Blog & Store Traffic', 'Instant Delivery'],
  },
};

export const ExploreBoostsTab: React.FC = () => {
  const {
    setIsCreateCampaignModalOpen,
  } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-6 sm:space-y-8">
      
      {/* Mobile-Optimized Modern Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-purple-950 text-white p-5 sm:p-8 shadow-lg border border-indigo-500/20">
        
        {/* Subtle Ambient Background Light */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-56 h-56 rounded-full bg-pink-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 -mb-16 w-56 h-56 rounded-full bg-indigo-500/15 blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-3 sm:space-y-4">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-indigo-200 border border-white/10 text-[11px] font-semibold">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Fast Social Media Promotion</span>
          </div>

          {/* Heading */}
          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Grow Your Followers, Views & Likes Instantly 🚀
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Promote your <strong>TikTok, YouTube, Instagram, Facebook, and Twitter</strong> accounts with real engagement. Automated fast delivery with secure Paystack checkout.
          </p>

          {/* CTA Action Button */}
          <div className="pt-2">
            <button
              id="btn-hero-order-boost"
              onClick={() => setIsCreateCampaignModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md shadow-indigo-600/30 transition active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span>Place Promotion Order Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Compact Trust Features */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 pt-5 mt-5 border-t border-white/10">
          <div className="flex items-center gap-2 bg-white/5 sm:bg-transparent p-2 sm:p-0 rounded-lg">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">Instant Start</div>
              <div className="text-[10px] text-slate-400">Within minutes</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/5 sm:bg-transparent p-2 sm:p-0 rounded-lg">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">100% Safe</div>
              <div className="text-[10px] text-slate-400">No password</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/5 sm:bg-transparent p-2 sm:p-0 rounded-lg">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center shrink-0">
              <ThumbsUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">High Quality</div>
              <div className="text-[10px] text-slate-400">Guaranteed</div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-white/5 sm:bg-transparent p-2 sm:p-0 rounded-lg">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-pink-500/20 text-pink-300 flex items-center justify-center shrink-0">
              <Headphones className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-white leading-tight">24/7 Support</div>
              <div className="text-[10px] text-slate-400">Live chat</div>
            </div>
          </div>
        </div>

      </div>

      {/* Supported Platforms Grid */}
      <div className="space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              Select Social Network
            </h2>
            <p className="text-xs text-slate-500">
              Choose your platform to launch targeted promotion.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
          {Object.entries(PLATFORM_SHOWCASE).map(([pKey, p]) => (
            <div
              key={pKey}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden"
            >
              <div className="p-4 sm:p-5 space-y-3">
                
                {/* Header with Icon & Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                      {p.icon}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-tight">{p.name}</h3>
                      <p className="text-[11px] text-slate-500 font-medium">{p.popularService}</p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                </div>

                {/* Starting Price Tag */}
                <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Pricing:</span>
                  <span className="font-extrabold text-indigo-600">{p.startingPrice}</span>
                </div>

                {/* Feature Bullet List */}
                <ul className="space-y-1.5 pt-1 text-[11px] sm:text-xs text-slate-600">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span className="truncate">{feat}</span>
                    </li>
                  ))}
                </ul>

              </div>

              {/* Order Button */}
              <div className="p-4 sm:p-5 pt-0">
                <button
                  onClick={() => setIsCreateCampaignModalOpen(true)}
                  className="w-full py-2.5 sm:py-3 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-300" />
                  <span>Boost {p.name.replace(' Boost', '').replace(' Growth', '').replace(' Promotion', '')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
