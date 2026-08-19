import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Smartphone, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Share2, 
  PlusSquare, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Monitor
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PwaInstallBanner: React.FC = () => {
  const { addToast } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissedThisSession, setIsDismissedThisSession] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);
  const [showDesktopGuide, setShowDesktopGuide] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    // 1. Check if user is ALREADY running the app from Home Screen (Standalone mode)
    const checkStandalone = () => {
      const isStandaloneMode = 
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      
      setIsStandalone(isStandaloneMode);
    };

    checkStandalone();

    // 2. Check if user is on iOS device (iPhone / iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // 3. Listen for Chrome / Android / Edge beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 4. Listen for successful installation event
    const handleAppInstalled = () => {
      localStorage.setItem('pwa_installed_success', 'true');
      setIsStandalone(true);
      setDeferredPrompt(null);
      addToast('success', 'App Installed! 🎉', 'Play20 Testers is now installed on your device.');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [addToast]);

  // If already installed on home screen, or already installed in this browser, DO NOT SHOW
  const alreadyInstalled = isStandalone || localStorage.getItem('pwa_installed_success') === 'true';
  if (alreadyInstalled || isDismissedThisSession) {
    return null;
  }

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Native 1-click install prompt on Android / Chrome / Edge
      try {
        deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          localStorage.setItem('pwa_installed_success', 'true');
          setIsStandalone(true);
          addToast('success', 'Installing App...', 'Adding Play20 Testers to your device.');
        } else {
          // If declined this time, dismiss for this session; it will prompt again next time they return
          setIsDismissedThisSession(true);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    } else if (isIos) {
      // Show iOS step-by-step modal guide
      setShowIosGuide(true);
    } else {
      // Show desktop / browser guide dialog
      setShowDesktopGuide(true);
    }
  };

  const handleDismissForNow = () => {
    // Dismiss for current view session so it doesn't block them right now,
    // but when they return/refresh later it will show again as requested!
    setIsDismissedThisSession(true);
  };

  return (
    <>
      {/* Floating Bottom Install Prompt Banner */}
      <aside 
        aria-label="Install Play20 Testers Application"
        className="fixed bottom-16 lg:bottom-5 left-3 right-3 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-in slide-in-from-bottom-5 duration-300"
      >
        <div className="rounded-3xl border-2 border-indigo-500/30 bg-slate-900/95 backdrop-blur-xl text-white p-4 sm:p-5 shadow-2xl shadow-indigo-950/50">
          
          <div className="flex items-start gap-3.5">
            {/* App Icon */}
            <div className="relative shrink-0">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/30 ring-2 ring-indigo-400/30">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[8px] font-bold">
                ✓
              </span>
            </div>

            {/* Info Text */}
            <div className="flex-1 min-w-0 pr-1">
              <div className="flex items-center gap-1.5">
                <h4 className="text-sm font-black text-white tracking-tight">
                  Install Play20 App
                </h4>
                <span className="rounded-md bg-indigo-500/20 border border-indigo-400/30 px-1.5 py-0.2 text-[9px] font-bold text-indigo-300 uppercase">
                  Fast Access
                </span>
              </div>
              
              <p className="text-xs text-slate-300 mt-1 leading-snug">
                Add to your home screen for quick 1-tap access and daily testing coin rewards.
              </p>
            </div>

            {/* Close Button (Later) */}
            <button
              onClick={handleDismissForNow}
              className="rounded-full p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Maybe Later"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex items-center gap-2">
            <button
              onClick={handleDismissForNow}
              className="flex-1 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-300 py-2.5 px-3 text-xs font-semibold transition-all text-center"
            >
              Maybe Later
            </button>

            <button
              id="btn-install-pwa"
              onClick={handleInstallClick}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white py-2.5 px-3 text-xs font-bold shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Install App ⚡</span>
            </button>
          </div>

        </div>
      </aside>

      {/* iOS Step-by-Step Installation Guide Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="text-center mb-5">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 mb-3 shadow-xs">
                <Smartphone className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Install on iPhone / iPad
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Follow these 2 simple steps in Safari to add Play20 to your Home Screen:
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[11px]">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Tap the Share icon (📤)</p>
                  <p className="text-slate-500 text-[11px]">Located on your Safari browser toolbar.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[11px]">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Select "Add to Home Screen" (➕)</p>
                  <p className="text-slate-500 text-[11px]">Then tap <strong>Add</strong> at the top right.</p>
                </div>
              </div>
            </div>

            {/* Done Button */}
            <button
              onClick={() => {
                setShowIosGuide(false);
                setIsDismissedThisSession(true);
              }}
              className="mt-5 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Got It
            </button>

          </div>
        </div>
      )}

      {/* Desktop / Manual Browser Guide Modal */}
      {showDesktopGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="text-center mb-5">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200 mb-3 shadow-xs">
                <Monitor className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Install Play20 App
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                You can install Play20 directly from your browser:
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-3 text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[11px]">
                  1
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Look at the browser address bar (top right)</p>
                  <p className="text-slate-500 text-[11px]">Click the <strong>Install App (⊕)</strong> icon or menu (⋮).</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white font-bold text-[11px]">
                  2
                </div>
                <div>
                  <p className="font-semibold text-slate-900">Click "Install"</p>
                  <p className="text-slate-500 text-[11px]">Play20 will open in its own fast standalone window.</p>
                </div>
              </div>
            </div>

            {/* Done Button */}
            <button
              onClick={() => {
                setShowDesktopGuide(false);
                setIsDismissedThisSession(true);
              }}
              className="mt-5 w-full rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-xs font-bold shadow-xs active:scale-95 transition-all"
            >
              Got It
            </button>

          </div>
        </div>
      )}
    </>
  );
};
