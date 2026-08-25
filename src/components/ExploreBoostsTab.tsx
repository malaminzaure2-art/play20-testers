import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Sparkles, 
  Zap,
  CheckCircle2,
  ArrowRight,
  Award,
  Lock,
  Headphones
} from 'lucide-react';

interface PlatformServiceInfo {
  name: string;
  icon: string;
  badge: string;
  popularService: string;
  startingPrice: string;
  features: string[];
  gradient: string;
}

const PLATFORM_SHOWCASE: Record<string, PlatformServiceInfo> = {
  tiktok: {
    name: 'TikTok Growth',
    icon: '🎵',
    badge: 'Trending 🔥',
    popularService: 'Followers, Likes & Views',
    startingPrice: 'From ₦0.60 per view',
    features: ['High-Retention Views', 'Active Profile Followers', 'Viral Algorithm Boost', 'Real Likes & Shares'],
    gradient: 'from-slate-900 to-slate-800',
  },
  youtube: {
    name: 'YouTube Promotion',
    icon: '📺',
    badge: 'High Demand 🚀',
    popularService: 'Subscribers, Views & Likes',
    startingPrice: 'From ₦1.20 per view',
    features: ['Monetization Subscribers', 'High Retention Watch Time', 'Real Video Engagement', '100% Safe Channel Growth'],
    gradient: 'from-rose-950 via-slate-900 to-slate-900',
  },
  instagram: {
    name: 'Instagram Boost',
    icon: '📸',
    badge: 'Fast Delivery ⚡',
    popularService: 'Followers, Likes & Reels',
    startingPrice: 'From ₦0.80 per view',
    features: ['Organic-Looking Followers', 'Reel Video Viral Push', 'Explore Page Trigger', 'Zero Password Required'],
    gradient: 'from-pink-950 via-purple-950 to-slate-900',
  },
  facebook: {
    name: 'Facebook Growth',
    icon: '📘',
    badge: 'Instant ⏱️',
    popularService: 'Page Followers & Post Likes',
    startingPrice: 'From ₦0.80 per view',
    features: ['Page Monetization Boost', 'Post & Video Likes', 'Share Viral Distribution', 'Active Audience Reach'],
    gradient: 'from-blue-950 via-slate-900 to-slate-900',
  },
  twitter: {
    name: 'Twitter / X Boost',
    icon: '🐦',
    badge: 'Viral Reach 📈',
    popularService: 'Followers & Tweet Likes',
    startingPrice: 'From ₦1.80 per like',
    features: ['Profile Followers Boost', 'Tweet Likes & Retweets', 'Higher Impression Score', 'Safe & Permanent'],
    gradient: 'from-slate-900 to-zinc-900',
  },
  website: {
    name: 'Website Traffic',
    icon: '🌐',
    badge: 'SEO Boost 🌍',
    popularService: 'Targeted Web Visitors',
    startingPrice: 'From ₦1.00 per visit',
    features: ['Real Targeted Visitors', 'Low Bounce Rate Traffic', 'Blog & Store Visitors', 'Instant Traffic Delivery'],
    gradient: 'from-purple-950 via-slate-900 to-slate-900',
  },
};

export const ExploreBoostsTab: React.FC = () => {
  const {
    setIsCreateCampaignModalOpen,
  } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Hero Banner with Instant CTA */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 text-white p-7 sm:p-10 shadow-xl border border-indigo-500/20">
        
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-gradient-to-br from-pink-500/20 to-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-20 w-60 h-60 rounded-full bg-indigo-600/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Official Social Media Promotion Platform</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
            Supercharge Your Social Media Growth Instantly 🚀
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            Order real followers, subscribers, views, and likes for <strong>TikTok, YouTube, Instagram, Facebook, Twitter, and Websites</strong>. Instant automated delivery with Paystack payment.
          </p>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              id="btn-hero-order-boost"
              onClick={() => setIsCreateCampaignModalOpen(true)}
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-extrabold text-sm sm:text-base px-7 py-4 rounded-2xl shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2.5 cursor-pointer"
            >
              <Zap className="w-5 h-5 text-amber-300 fill-amber-300" />
              <span>+ Place Promotion Order Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Floating Trust Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 mt-8 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-400">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white">Instant Start</div>
              <div className="text-xs text-slate-400">Delivery in minutes</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white">100% Safe</div>
              <div className="text-xs text-slate-400">No passwords needed</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white">Guaranteed</div>
              <div className="text-xs text-slate-400">Real high quality</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-pink-400">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-black text-white">24/7 Support</div>
              <div className="text-xs text-slate-400">Always active</div>
            </div>
          </div>
        </div>

      </div>

      {/* Supported Platforms Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Choose a Social Network to Boost
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select your platform and launch your targeted promotion in seconds.
            </p>
          </div>

          <button
            onClick={() => setIsCreateCampaignModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3.5 py-2 rounded-xl transition cursor-pointer"
          >
            <span>Order All Services</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Object.entries(PLATFORM_SHOWCASE).map(([pKey, p]) => (
            <div
              key={pKey}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:border-indigo-300"
            >
              <div className="p-6 space-y-4">
                
                {/* Header with Icon & Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl shadow-xs group-hover:scale-105 transition">
                      {p.icon}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">{p.name}</h3>
                      <p className="text-xs font-medium text-slate-500">{p.popularService}</p>
                    </div>
                  </div>

                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {p.badge}
                  </span>
                </div>

                {/* Starting Price Tag */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Affordable Pricing:</span>
                  <span className="text-xs font-black text-indigo-600">{p.startingPrice}</span>
                </div>

                {/* Feature Bullet List */}
                <ul className="space-y-2 pt-1 text-xs text-slate-600">
                  {p.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

              </div>

              {/* Order Button */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => setIsCreateCampaignModalOpen(true)}
                  className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs sm:text-sm transition flex items-center justify-center gap-2 cursor-pointer shadow-xs group-hover:shadow-indigo-500/20"
                >
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Boost {p.name.replace(' Boost', '').replace(' Growth', '').replace(' Promotion', '')} Now</span>
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
