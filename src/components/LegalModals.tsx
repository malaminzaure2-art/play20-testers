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
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LegalModals: React.FC = () => {
  const { legalModalType, setLegalModalType, addToast } = useApp();

  if (!legalModalType) return null;

  const closeModal = () => setLegalModalType(null);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[88vh] flex flex-col">
        
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
            {legalModalType === 'about' && (
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600">
                <Info className="h-6 w-6" />
              </div>
            )}
            {legalModalType === 'contact' && (
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 border border-sky-100 text-sky-600">
                <Mail className="h-6 w-6" />
              </div>
            )}
            {legalModalType === 'adsense' && (
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-700">
                <DollarSign className="h-6 w-6" />
              </div>
            )}

            <div>
              <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                {legalModalType === 'privacy' && 'Official Compliance • GDPR & CCPA'}
                {legalModalType === 'terms' && 'Platform Agreement • Community Guidelines'}
                {legalModalType === 'about' && 'About Play20 • Android Dev Community'}
                {legalModalType === 'contact' && 'Support & Engineering Services • Worldwide'}
                {legalModalType === 'adsense' && 'Google AdSense Checklist & Approval'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {legalModalType === 'privacy' && 'Privacy Policy & Cookie Policy'}
                {legalModalType === 'terms' && 'Terms of Service & Rules'}
                {legalModalType === 'about' && 'About Play20 Testers Platform'}
                {legalModalType === 'contact' && 'Contact Us & Custom Development'}
                {legalModalType === 'adsense' && 'Google AdSense Monetization Guide'}
              </h3>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
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
                Last updated: August 2026. At <strong>Play20 Testers</strong> (referred to as "we", "our", or "the Platform"), we are deeply committed to protecting your privacy and ensuring complete transparency in all our data handling practices.
              </p>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3.5 space-y-1.5">
                <h4 className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-indigo-600" />
                  1. Information We Collect
                </h4>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-slate-700">
                  <li><strong>Account Credentials:</strong> Basic profile information (Display Name, Email Address, and Avatar) authenticated securely via Google Sign-In / Firebase Auth.</li>
                  <li><strong>App Testing Data:</strong> App package names, opt-in Google Group URLs, daily qualitative testing feedback, screenshots submitted as proof, device models, and Android OS versions for compatibility validation.</li>
                  <li><strong>Log & Analytical Data:</strong> IP address, browser type, and interaction timestamps strictly for fraud prevention, duplicate detection, and platform performance.</li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs">
                  2. Third-Party Advertising & Google AdSense Cookies
                </h4>
                <p>
                  We may partner with third-party advertising networks, including <strong>Google AdSense</strong>, to serve advertisements when you visit our website. These companies may use cookies, web beacons, and similar tracking technologies to collect non-personally identifiable information about your visits to this and other websites in order to provide advertisements about goods and services of interest to you.
                </p>
                <p className="text-[11px] text-slate-500">
                  Google’s use of the DoubleClick cookie enables it and its partners to serve ads based on your visit to our site and/or other sites on the Internet. You may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noreferrer" className="text-indigo-600 underline">Google Ads Settings</a>.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs">
                  3. How We Use Your Data
                </h4>
                <p>
                  Your data is used strictly to coordinate peer-to-peer closed testing tracks, calculate tester streak bonuses, verify 14-day completion milestones, and maintain the integrity of our developer community. We never sell your personal information to third parties.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs">
                  4. Data Rights (GDPR & CCPA)
                </h4>
                <p>
                  You have the right to request access to, correction of, or permanent deletion of your account and submitted data at any time by contacting our compliance officer at <strong>msngapps@gmail.com</strong>.
                </p>
              </div>
            </>
          )}

          {/* TERMS OF SERVICE */}
          {legalModalType === 'terms' && (
            <>
              <p className="font-medium text-slate-700">
                By creating an account or using <strong>Play20 Testers</strong>, you agree to abide by the following community standards and platform terms:
              </p>

              <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-3.5 space-y-1.5">
                <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-amber-600" />
                  1. Genuine Peer-to-Peer Closed Testing Standard
                </h4>
                <p className="text-[11px] text-slate-700">
                  Play20 is a mutual exchange platform designed to help legitimate Android developers meet Google Play's 20-tester, 14-consecutive-day closed testing requirement. Testers agree to install apps via Google Play, test genuinely, and provide constructive, honest feedback.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs">
                  2. Prohibited Conduct & Zero-Tolerance Violations
                </h4>
                <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
                  <li>Submitting malicious apps, phishing APKs, spyware, or apps that violate Google Play Developer Program Policies.</li>
                  <li>Automating testing using bots, emulated fake clicks, or fraudulent duplicate accounts.</li>
                  <li>Early uninstallation before completing the mandatory 14-day testing period without legitimate cause.</li>
                </ul>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs">
                  3. Virtual Coins & Reward Credit System
                </h4>
                <p>
                  Coins on Play20 are virtual platform utility units used solely to publish apps for testing or earn testing privileges. Coins possess no cash value and cannot be redeemed for fiat currency outside authorized platform promotions.
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="font-bold text-slate-900 text-xs">
                  4. Disclaimer of Google Affiliation
                </h4>
                <p>
                  Play20 is an independent developer utility and is not affiliated with, endorsed by, or sponsored by Google LLC or Google Play. All Android trademarks belong to Google LLC.
                </p>
              </div>
            </>
          )}

          {/* ABOUT US */}
          {legalModalType === 'about' && (
            <>
              <div className="space-y-3">
                <p className="font-medium text-slate-800 text-sm leading-relaxed">
                  <strong>Play20 Testers</strong> was built by independent Android developers, for independent Android developers.
                </p>

                <p>
                  In late 2023, Google introduced a policy requiring personal Google Play developer accounts to have at least <strong>20 testers opted-in for 14 consecutive days</strong> before applying for production access. For solo creators and small indie studios, finding 20 reliable testers was nearly impossible.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                  <div className="rounded-2xl border border-indigo-100 bg-indigo-50/60 p-3">
                    <span className="font-bold text-indigo-900 block text-xs mb-0.5">🤝 Reciprocal Exchange</span>
                    <p className="text-[11px] text-slate-600">
                      Developers test each other's apps. When you test a colleague's app, you earn coins to get 20 testers for your own app for free.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-3">
                    <span className="font-bold text-emerald-900 block text-xs mb-0.5">🛡️ 14-Day Streak Verifier</span>
                    <p className="text-[11px] text-slate-600">
                      Automated streak tracking, daily feedback logs, and device logs ensure zero drops during Google's 14-day review window.
                    </p>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-slate-900 text-xs mb-1">Our Core Commitment:</h4>
                  <p className="text-[11px] text-slate-600">
                    We maintain 100% compliance with Google Play Developer Policies by fostering genuine human testers, meaningful qualitative feedback, and clean opt-in Google Groups.
                  </p>
                </div>
              </div>
            </>
          )}

          {/* CONTACT US + CUSTOM DEV SERVICES */}
          {legalModalType === 'contact' && (
            <>
              {/* Promotional Banner: Custom Web & Mobile App Development */}
              <div className="rounded-3xl border-2 border-indigo-500/30 bg-gradient-to-br from-indigo-900 via-indigo-800 to-slate-900 p-5 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 h-24 w-24 rounded-full bg-indigo-500/20 blur-xl pointer-events-none" />
                
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 tracking-wider shadow-xs">
                    ★ Available For Hire Worldwide
                  </span>
                </div>

                <h4 className="text-sm sm:text-base font-extrabold text-white leading-tight">
                  Need a Custom Android App, iOS App, or Web Platform?
                </h4>
                
                <p className="text-xs text-indigo-100 mt-1.5 leading-relaxed">
                  We build world-class mobile applications, high-performance web systems, SaaS platforms, and backend APIs for individuals, startups, and businesses worldwide with fast delivery and premium design.
                </p>

                <div className="mt-3.5 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
                    <Smartphone className="h-3.5 w-3.5 text-amber-300" />
                    Android & iOS Apps
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
                    <Globe2 className="h-3.5 w-3.5 text-cyan-300" />
                    Full-Stack Web & SaaS
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 px-2 py-1 text-[11px] font-semibold text-white backdrop-blur-xs">
                    <Code2 className="h-3.5 w-3.5 text-emerald-300" />
                    Play Console & Store Setup
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-indigo-200">
                    Direct developer inquiry:
                  </span>
                  <a
                    href="mailto:msngapps@gmail.com?subject=Custom%20App%2FWeb%20Development%20Inquiry"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-white text-indigo-950 px-3.5 py-1.5 text-xs font-bold hover:bg-amber-300 transition-all shadow-xs"
                  >
                    <span>Hire Us / Email Us</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Direct Contact Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <Mail className="h-5 w-5 text-indigo-600 mb-1.5" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Official Email Address</span>
                  <a href="mailto:msngapps@gmail.com" className="text-xs font-bold text-indigo-600 hover:underline">
                    msngapps@gmail.com
                  </a>
                  <p className="text-[10px] text-slate-500 mt-1">Direct developer & business support</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 mb-1.5" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Worldwide Service</span>
                  <span className="text-xs font-bold text-slate-900">Global Client Support</span>
                  <p className="text-[10px] text-slate-500 mt-1">Average response: Under 4 hours</p>
                </div>
              </div>

              {/* Quick Contact Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const target = e.target as any;
                  const email = target.email?.value || '';
                  const subject = target.subject?.value || 'General Inquiry';
                  const message = target.message?.value || '';
                  window.location.href = `mailto:msngapps@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${email}\n\n${message}`)}`;
                  addToast('success', 'Email Client Opened ✉️', 'Please send the message through your email app to msngapps@gmail.com.');
                  closeModal();
                }}
                className="mt-4 space-y-3 pt-3 border-t border-slate-100"
              >
                <h5 className="font-bold text-slate-900 text-xs">Send Direct Message / Project Brief</h5>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Email</label>
                  <input
                    name="email"
                    type="email"
                    required
                    placeholder="yourname@gmail.com"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Subject / Project Requirement</label>
                  <input
                    name="subject"
                    type="text"
                    required
                    placeholder="E.g., I want to build a Flutter app / Web dashboard / Support inquiry"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Message / Details</label>
                  <textarea
                    name="message"
                    rows={3}
                    required
                    placeholder="Describe your request or project specifications..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-xs font-bold transition-all shadow-xs"
                >
                  Send to msngapps@gmail.com
                </button>
              </form>
            </>
          )}

          {/* ADSENSE GUIDE */}
          {legalModalType === 'adsense' && (
            <>
              <div className="space-y-3">
                <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-3.5 space-y-2">
                  <h4 className="font-bold text-amber-950 text-xs flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    Google AdSense Approval & Readiness Guide
                  </h4>
                  <p className="text-[11px] text-slate-700">
                    To get approved for Google AdSense on your domain (e.g. <code>testers.hausatech.com</code> or your root domain), Google evaluates the following core pillars:
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">1. Mandatory Legal Pages (Fully Active ✅)</strong>
                      <span className="text-[11px] text-slate-500">Privacy Policy (with Google DoubleClick Cookie & GDPR clauses), Terms of Service, About Us, and Contact Us are fully active on this site.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">2. High Utility & Original Service (Fully Active ✅)</strong>
                      <span className="text-[11px] text-slate-500">The site provides a valuable utility tool (Android 14-day closed testing peer exchange network), which AdSense favors over low-effort blogs.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">3. Responsive UI & Clean Navigation (Fully Active ✅)</strong>
                      <span className="text-[11px] text-slate-500">Fast, mobile-friendly interface with search bar, tab navigation, and clear call-to-actions.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">4. SSL / HTTPS Security (Ready on Vercel ✅)</strong>
                      <span className="text-[11px] text-slate-500">Your site uses automatic HTTPS encryption required by modern AdSense policies.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">5. ads.txt File (Placed in /public/ads.txt ✅)</strong>
                      <span className="text-[11px] text-slate-500">Once your AdSense account is created, you simply add your publisher code (<code>pub-XXXXXXXXXXXXXXXX</code>) to public/ads.txt.</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

        </div>

        {/* Footer Action */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-[10px] text-slate-400 font-medium">
            Contact: msngapps@gmail.com
          </span>
          <button
            onClick={closeModal}
            className="rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 text-xs font-bold transition-all"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
