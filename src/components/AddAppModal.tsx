import React, { useState } from 'react';
import { 
  PlusCircle, 
  Coins, 
  AlertCircle, 
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AddAppModal: React.FC = () => {
  const { 
    isAddAppModalOpen, 
    setIsAddAppModalOpen, 
    addNewApp, 
    user, 
    setActiveTab, 
    addToast 
  } = useApp();

  const [title, setTitle] = useState('');
  const [groupUrl, setGroupUrl] = useState('');
  const [storeWebUrl, setStoreWebUrl] = useState('');

  if (!isAddAppModalOpen) return null;

  const totalCostCoins = 200; // 20 testers × 10 coins
  const userBalance = user?.credits || 0;
  const hasSufficientCredits = userBalance >= totalCostCoins;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !groupUrl.trim() || !storeWebUrl.trim()) {
      addToast('error', 'Missing Information', 'Please fill in all 3 required fields.');
      return;
    }

    if (!hasSufficientCredits) {
      addToast('error', 'Insufficient Coins', `You need ${totalCostCoins} Coins (Current: ${userBalance}). Please buy credits or test peer apps.`);
      setIsAddAppModalOpen(false);
      setActiveTab('store');
      return;
    }

    // Auto-generate package name from url or title
    const pkgMatch = storeWebUrl.match(/(?:id=|testing\/)([a-zA-Z0-9._]+)/);
    const packageName = pkgMatch ? pkgMatch[1] : `com.app.${title.toLowerCase().replace(/[^a-z0-9]/g, '')}`;

    const success = addNewApp({
      title: title.trim(),
      packageName,
      category: 'Productivity',
      description: 'Android application in closed testing. 20 testers required for 14 continuous days.',
      iconUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
      groupUrl: groupUrl.trim(),
      storeWebUrl: storeWebUrl.trim(),
      storeAndroidUrl: storeWebUrl.trim(),
      requiredTesters: 20,
      daysRequired: 14,
      rewardPerDay: 10,
      completionBonus: 50,
      targetRegion: 'Global',
      minAndroidVersion: 'Android 10.0+',
      feedbackPrompt: 'Please test app daily and report any issues or crashes.',
    });

    if (success) {
      setTitle('');
      setGroupUrl('');
      setStoreWebUrl('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Publish App for Testers</h3>
              <p className="text-xs text-slate-500 font-medium">Get 20 active testers for 14 days</p>
            </div>
          </div>

          <button
            onClick={() => setIsAddAppModalOpen(false)}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form Body - ONLY 3 ESSENTIAL FIELDS */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* 1. App Title */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              1. App Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. FocusFlow Pomodoro"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none shadow-xs transition-all"
            />
          </div>

          {/* 2. Google Group URL */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              2. Google Group URL <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://groups.google.com/g/your-app-testers"
              value={groupUrl}
              onChange={(e) => setGroupUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none shadow-xs transition-all"
            />
          </div>

          {/* 3. Play Store URL */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              3. Play Store Opt-in Link <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              required
              placeholder="https://play.google.com/apps/testing/com.yourcompany.app"
              value={storeWebUrl}
              onChange={(e) => setStoreWebUrl(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none shadow-xs transition-all"
            />
          </div>

          {/* Cost & Balance Overview */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 mt-2">
            <div className="flex items-center justify-between text-xs">
              <div>
                <span className="text-slate-500 font-medium">Campaign Cost (20 Testers):</span>
                <div className="text-sm font-bold text-indigo-700 mt-0.5">
                  200 Coins
                </div>
              </div>

              <div className="text-right">
                <span className="text-slate-500 font-medium">Your Balance:</span>
                <div className={`text-sm font-bold mt-0.5 ${hasSufficientCredits ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {userBalance} Coins
                </div>
              </div>
            </div>

            {!hasSufficientCredits && (
              <div className="mt-3 flex items-center justify-between gap-2 pt-2.5 border-t border-slate-200 text-xs">
                <div className="flex items-center gap-1.5 text-amber-800 font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>You need {totalCostCoins - userBalance} more coins.</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsAddAppModalOpen(false);
                    setActiveTab('store');
                  }}
                  className="font-bold text-indigo-600 hover:text-indigo-700 underline"
                >
                  Get Coins →
                </button>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAddAppModalOpen(false)}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={!hasSufficientCredits}
              className={`flex-[2] rounded-xl py-2.5 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                !hasSufficientCredits
                  ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 active:scale-95'
              }`}
            >
              <Sparkles className="h-4 w-4" />
              <span>Publish App Now</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
