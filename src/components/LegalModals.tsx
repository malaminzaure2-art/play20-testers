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
  DollarSign
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
                {legalModalType === 'contact' && 'Support & Inquiries • 24/7 Response'}
                {legalModalType === 'adsense' && 'Google AdSense Checklist & Approval'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {legalModalType === 'privacy' && 'Privacy Policy & Cookie Policy'}
                {legalModalType === 'terms' && 'Terms of Service & Rules'}
                {legalModalType === 'about' && 'About Play20 Testers Platform'}
                {legalModalType === 'contact' && 'Contact Us & Developer Support'}
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
                Last updated: August 2026. At <strong>Play20 Testers</strong> (referred to as "we", "our", or "the Platform"), we are deeply committed to protecting your privacy and ensuring transparency in all our data handling practices.
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
                  You have the right to request access to, correction of, or permanent deletion of your account and submitted data at any time by contacting our privacy compliance team at <strong>privacy@play20.app</strong>.
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

          {/* CONTACT US */}
          {legalModalType === 'contact' && (
            <>
              <p className="text-xs text-slate-700 font-medium">
                Have questions about 14-day closed testing, need help with your app listing, or want to report an issue? Our team is available 24/7.
              </p>

              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <Mail className="h-5 w-5 text-indigo-600 mb-1.5" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Developer Support Email</span>
                  <span className="text-xs font-bold text-slate-900">support@play20.app</span>
                  <p className="text-[10px] text-slate-500 mt-1">Average response time: &lt;4 hours</p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <ShieldCheck className="h-5 w-5 text-emerald-600 mb-1.5" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Legal & Privacy Inquiries</span>
                  <span className="text-xs font-bold text-slate-900">privacy@play20.app</span>
                  <p className="text-[10px] text-slate-500 mt-1">For GDPR, account deletion & DMCA</p>
                </div>
              </div>

              {/* Quick Contact Form */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  addToast('success', 'Message Sent! ✉️', 'Thank you! Our support team will respond to your email within a few hours.');
                  closeModal();
                }}
                className="mt-4 space-y-3 pt-3 border-t border-slate-100"
              >
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="developer@gmail.com"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Subject / Question</label>
                  <input
                    type="text"
                    required
                    placeholder="E.g., How to add opt-in link, coin purchase issue..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Message</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Describe your inquiry or app details..."
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:border-indigo-600 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-xs font-bold transition-all shadow-xs"
                >
                  Submit Inquiry
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
                    Google AdSense Policy Checklist (100% Prepared)
                  </h4>
                  <p className="text-[11px] text-slate-700">
                    To get approved for Google AdSense on your domain (e.g. <code>play20.app</code> or your custom domain), Google evaluates the following 5 requirements:
                  </p>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">1. Mandatory Legal Pages (Ready ✅)</strong>
                      <span className="text-[11px] text-slate-500">Privacy Policy (with Google Cookie & GDPR clauses), Terms of Service, About Us, and Contact Us are fully active on this site.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">2. High Quality & Functional Content (Ready ✅)</strong>
                      <span className="text-[11px] text-slate-500">The site contains a real, highly useful interactive tool (Android 14-day closed testing matching platform with real workflows).</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">3. Easy & Clear Navigation (Ready ✅)</strong>
                      <span className="text-[11px] text-slate-500">Desktop & Mobile Navigation with Sidebar menu, bottom bar, and search filters.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">4. Custom Domain & SSL (HTTPS)</strong>
                      <span className="text-[11px] text-slate-500">Connect your custom domain (e.g. <code>yourname.com</code>) in Google AdSense dashboard.</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl border border-slate-100 bg-slate-50">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-slate-900 block">5. ads.txt File (Placed in /public/ads.txt)</strong>
                      <span className="text-[11px] text-slate-500">When Google approves your account, add your publisher ID: <code>google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0</code>.</span>
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
            Play20 Compliance Center
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
