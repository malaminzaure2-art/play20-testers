import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Monitor,
  TrendingUp,
  Share,
  MoreVertical,
  PlusSquare,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PwaInstallBanner: React.FC = () => {
  const { addToast } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissedThisSession, setIsDismissedThisSession] = useState(false);
  
  // Modals for guided installation when browser prompt is suppressed/deferred
  const [showAndroidGuide, setShowAndroidGuide] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [showDesktopGuide, setShowDesktopGuide] = useState(false);

  // Device detection
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    const isAndroidDevice = /android/.test(ua);
    const isMobileDevice = isIosDevice || isAndroidDevice || /mobile|tablet/.test(ua);

    setIsIos(isIosDevice);
    setIsAndroid(isAndroidDevice);
    setIsMobile(isMobileDevice);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
      localStorage.setItem('pwa_installed_success', 'true');
      setIsStandalone(true);
      setDeferredPrompt(null);
      addToast('success', 'Manhaja Ta Sauka! 🎉', 'An riga an sanya TrendBoost a allon wayarka.');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [addToast]);

  const alreadyInstalled = isStandalone || localStorage.getItem('pwa_installed_success') === 'true';
  if (alreadyInstalled || isDismissedThisSession) {
    return null;
  }

  const handleInstallClick = async () => {
    // 1. If native browser prompt is available, trigger it immediately
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          localStorage.setItem('pwa_installed_success', 'true');
          setIsStandalone(true);
          addToast('success', 'Ana Sanyawa...', 'Ana sauke TrendBoost a allon wayarka.');
        } else {
          setIsDismissedThisSession(true);
        }
        setDeferredPrompt(null);
        return;
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    }

    // 2. If no native prompt event (e.g. mobile Chrome inside iframe, Safari, or Chrome gesture requirement)
    if (isIos) {
      setShowIosGuide(true);
    } else if (isAndroid || isMobile) {
      setShowAndroidGuide(true);
    } else {
      setShowDesktopGuide(true);
    }
  };

  const handleDismissForNow = () => {
    setIsDismissedThisSession(true);
  };

  return (
    <>
      {/* Floating Bottom Install Prompt Banner */}
      <aside 
        aria-label="Install TrendBoost Application"
        className="fixed bottom-16 lg:bottom-5 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-slideUp duration-300"
      >
        <div className="rounded-3xl border-2 border-indigo-500/40 bg-slate-950/95 backdrop-blur-xl text-white p-4 sm:p-5 shadow-2xl shadow-indigo-950/60">
          
          <div className="flex items-start gap-3.5">
            {/* App Icon */}
            <div className="relative shrink-0">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-600 to-pink-500 flex items-center justify-center text-white shadow-md ring-2 ring-indigo-400/30">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[8px] font-bold">
                ✓
              </span>
            </div>

            {/* Info Text */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h4 className="text-sm font-black text-white tracking-tight">
                  {isMobile ? 'Sanya a Wayarka (Install App)' : 'Install TrendBoost App'}
                </h4>
                <span className="rounded-md bg-emerald-500/20 border border-emerald-400/40 px-1.5 py-0.2 text-[9px] font-bold text-emerald-300 uppercase">
                  Mobile PWA
                </span>
              </div>
              
              <p className="text-xs text-slate-300 mt-1 leading-snug">
                {isMobile 
                  ? 'Sauke manhajar a allon wayarka don samun damar shiga kai tsaye ba tare da buɗe browser ba!'
                  : 'Add TrendBoost to your home screen or desktop for instant access and faster speed.'}
              </p>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismissForNow}
              className="rounded-full p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
              title="Rufe"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center gap-2">
            <button
              onClick={handleDismissForNow}
              className="flex-1 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 py-2.5 px-3 text-xs font-semibold transition-all text-center cursor-pointer"
            >
              Daga Baya
            </button>

            <button
              id="btn-install-pwa"
              onClick={handleInstallClick}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-indigo-400 hover:to-pink-400 active:scale-98 text-white py-2.5 px-3 text-xs font-black shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              {isMobile ? <Smartphone className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
              <span>Sanya a Waya 📲</span>
            </button>
          </div>

        </div>
      </aside>

      {/* 1. Android Phone Step-by-Step Installation Modal */}
      {showAndroidGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl border border-indigo-200/40 bg-white p-5 sm:p-6 shadow-2xl">
            
            <div className="text-center mb-5">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 mb-3 shadow-xs">
                <Smartphone className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Sanya Manhaja a Wayar Android 📲
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Kawai bi waɗannan matakai 3 a browser Chrome ko Samsung Internet:
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-800 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-black text-xs">
                  1
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 flex items-center gap-1.5">
                    <span>Danna ɗigo uku (⋮) na Browser</span>
                    <MoreVertical className="w-3.5 h-3.5 text-slate-500 inline" />
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Yana can saman dama na allon wayarka a Chrome.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-black text-xs">
                  2
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 flex items-center gap-1">
                    <span>Zaɓi "Install app" ko "Add to Home screen"</span>
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Zaɓin yana nufin <strong>Sanya a allon waya 📲</strong>.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-black text-xs">
                  3
                </div>
                <div>
                  <p className="font-extrabold text-slate-900">
                    Danna "Install" ko "Add"
                  </p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Nan take alamar TrendBoost za ta sauka a kan allon wayarka kamar application!
                  </p>
                </div>
              </div>

            </div>

            <button
              onClick={() => {
                setShowAndroidGuide(false);
                setIsDismissedThisSession(true);
              }}
              className="mt-5 w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white py-3 text-xs font-black shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
            >
              Na Gane, Zan Sanya Yanzu 👍
            </button>

          </div>
        </div>
      )}

      {/* 2. iOS Safari (iPhone / iPad) Step-by-Step Installation Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl border border-indigo-200/40 bg-white p-5 sm:p-6 shadow-2xl">
            
            <div className="text-center mb-5">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 mb-3 shadow-xs">
                <Share className="h-7 w-7 text-indigo-600" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                Sanya a Wayar iPhone / iPad 🍏
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Bi waɗannan matakai biyu a cikin browser ta Safari:
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-800 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-black text-xs">
                  1
                </div>
                <div>
                  <p className="font-extrabold text-slate-900">Danna alamar Raba (Share 📤)</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Tana can a ƙasan browser Safari.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-black text-xs">
                  2
                </div>
                <div>
                  <p className="font-extrabold text-slate-900">Zaɓi "Add to Home Screen" (➕)</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Sannan danna <strong>Add</strong> a saman dama.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowIosGuide(false);
                setIsDismissedThisSession(true);
              }}
              className="mt-5 w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white py-3 text-xs font-black shadow-md shadow-indigo-600/25 transition-all cursor-pointer"
            >
              Na Gane 👍
            </button>

          </div>
        </div>
      )}

      {/* 3. Desktop / Laptop Browser Guide Modal */}
      {showDesktopGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            
            <div className="text-center mb-5">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 mb-3 shadow-xs">
                <Monitor className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Sanya a Kwamfuta (Install on PC)
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                A browser ta Chrome ko Microsoft Edge:
              </p>
            </div>

            <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[11px]">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Duba Saman Address Bar</p>
                  <p className="text-slate-500 text-[11px]">Danna alamar <strong>Install (⊕)</strong> ko menu (⋮).</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[11px]">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Danna "Install"</p>
                  <p className="text-slate-500 text-[11px]">TrendBoost zai buɗe a matsayin cikakkiyar manhaja ta kwamfuta.</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setShowDesktopGuide(false);
                setIsDismissedThisSession(true);
              }}
              className="mt-5 w-full rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-xs font-bold shadow-xs transition-all cursor-pointer"
            >
              Rufe
            </button>

          </div>
        </div>
      )}
    </>
  );
};
