import React from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Info, 
  Mail, 
  X, 
  Lock, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Sparkles,
  DollarSign,
  Code2,
  Smartphone,
  Globe2,
  ArrowRight,
  ShieldAlert,
  MessageCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LegalModals: React.FC = () => {
  const { legalModalType, setLegalModalType, addToast } = useApp();

  if (!legalModalType) return null;

  const closeModal = () => setLegalModalType(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl my-8 animate-fadeIn max-h-[88vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center gap-3">
            {legalModalType === 'privacy' && (
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600">
                <Lock className="h-6 w-6" />
              </div>
            )}
            {legalModalType === 'terms' && (
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 border border-amber-100 text-amber-600">
                <FileText className="h-6 w-6" />
              </div>
            )}
            {legalModalType === 'safety' && (
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                <ShieldAlert className="h-6 w-6" />
              </div>
            )}
            {legalModalType === 'contact' && (
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 border border-sky-100 text-sky-600">
                <MessageCircle className="h-6 w-6" />
              </div>
            )}

            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                {legalModalType === 'privacy' && 'Privacy Policy • GDPR Compliant'}
                {legalModalType === 'terms' && 'Terms of Service • User Agreement'}
                {legalModalType === 'safety' && 'Safety Guidelines • Account Protection'}
                {legalModalType === 'contact' && 'Contact Support • 24/7 Assistance'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {legalModalType === 'privacy' && 'Privacy Policy'}
                {legalModalType === 'terms' && 'Terms & Conditions of Service'}
                {legalModalType === 'safety' && 'Channel Safety & Organic Growth Rules'}
                {legalModalType === 'contact' && 'Contact Us via WhatsApp & Email'}
              </h3>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="mt-4 flex-1 overflow-y-auto pr-1 text-xs text-slate-600 space-y-4 leading-relaxed">
          
          {/* PRIVACY POLICY */}
          {legalModalType === 'privacy' && (
            <>
              <p className="font-medium text-slate-700">
                At <strong>TrendBoost</strong>, we are committed to protecting your privacy and digital security. We never ask for your passwords or credentials to TikTok, YouTube, Instagram, or any external social media platform.
              </p>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3.5 space-y-1.5">
                <h4 className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-indigo-600" />
                  1. Information We Collect
                </h4>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-700">
                  <li><strong>Public Profile URL:</strong> The public link to the profile, video, or post you want to promote.</li>
                  <li><strong>Account Details:</strong> Your email address and display name to manage coin transactions and account security.</li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs">
                  2. Data Security & Confidentiality
                </h4>
                <p>
                  We never sell or distribute your private information to third-party brokers. All data is encrypted and securely stored in compliance with top industry standards.
                </p>
              </div>
            </>
          )}

          {/* TERMS OF SERVICE */}
          {legalModalType === 'terms' && (
            <>
              <p className="font-medium text-slate-700">
                By creating an account and using <strong>TrendBoost</strong>, you agree to the following terms:
              </p>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3.5 space-y-1.5">
                <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-600" />
                  1. Authentic User Activity
                </h4>
                <p className="text-[11px] text-slate-700">
                  All users must follow the destination links and engage authentically (genuine Likes, Follows, Views, Subscribes). Users attempting to harvest coins without performing tasks will have their balances revoked and accounts suspended.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs">
                  2. Virtual Coins
                </h4>
                <p>
                  Coins accumulated through tasks or purchases are internal platform tokens used exclusively to launch boost campaigns across supported social media networks.
                </p>
              </div>
            </>
          )}

          {/* SAFETY GUIDELINES */}
          {legalModalType === 'safety' && (
            <>
              <div className="space-y-3">
                <p className="font-medium text-slate-800 text-sm">
                  How Our Boosting Architecture Keeps Your Channels 100% Safe:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3">
                    <span className="font-bold text-emerald-900 block text-xs mb-0.5">✅ 100% Real Organic Creators</span>
                    <p className="text-[11px] text-slate-600">
                      Zero automated bots or dummy scripts. Real community members open their native apps to watch, like, and follow your content.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3">
                    <span className="font-bold text-indigo-900 block text-xs mb-0.5">🛡️ No Passwords Ever Required</span>
                    <p className="text-[11px] text-slate-600">
                      We will never request your passwords. You only provide public links to your social media profiles or videos.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* CONTACT US */}
          {legalModalType === 'contact' && (
            <>
              <div className="space-y-4">
                <div className="rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 p-5 text-white space-y-2">
                  <h4 className="font-extrabold text-sm sm:text-base">
                    Need Help or Custom Invoicing?
                  </h4>
                  <p className="text-xs text-emerald-100 leading-relaxed">
                    Chat directly with our dedicated support team via WhatsApp or Email for account help, custom coin purchases via Bank Transfer, or VIP viral campaigns.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">WhatsApp Support</span>
                    <a
                      href="https://wa.me/2348000000000?text=Hello%20TrendBoost%20Support"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-emerald-600 hover:underline block"
                    >
                      +234 WhatsApp Admin
                    </a>
                    <p className="text-[10px] text-slate-500">Typical response time: under 5 minutes</p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Email Support</span>
                    <a
                      href="mailto:malaminzaure2@gmail.com"
                      className="text-xs font-bold text-indigo-600 hover:underline block"
                    >
                      malaminzaure2@gmail.com
                    </a>
                    <p className="text-[10px] text-slate-500">Official developer email</p>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-slate-400 font-medium">
            TrendBoost Global Community
          </span>
          <button
            onClick={closeModal}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
