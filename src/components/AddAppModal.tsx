import React, { useState, useRef } from 'react';
import { 
  PlusCircle, 
  Coins, 
  AlertCircle, 
  Sparkles,
  Upload,
  Image as ImageIcon,
  X as CloseIcon,
  Check
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
  const [iconUrl, setIconUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAddAppModalOpen) return null;

  const totalCostCoins = 200; // 20 testers × 10 coins
  const userBalance = user?.credits || 0;
  const hasSufficientCredits = userBalance >= totalCostCoins;

  // Handle image upload & compression for phone / computer
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('error', 'Invalid File', 'Please select an image file (PNG, JPG, WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('error', 'File Too Large', 'Please select an image under 5MB.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Resize to 192x192 max for high quality + lightweight Firestore storage
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 192;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          setIconUrl(compressedDataUrl);
          addToast('success', 'Icon Uploaded', 'App icon loaded successfully!');
        }
        setIsUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveIcon = () => {
    setIconUrl('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !groupUrl.trim() || !storeWebUrl.trim()) {
      addToast('error', 'Missing Information', 'Please fill in all required fields.');
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

    const finalIcon = iconUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80';

    const success = addNewApp({
      title: title.trim(),
      packageName,
      category: 'Productivity',
      description: 'Android application in closed testing. 20 testers required for 14 continuous days.',
      iconUrl: finalIcon,
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
      setIconUrl('');
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          
          {/* App Icon Upload Section */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              App Icon (Hoton App) <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
            </label>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageFileChange}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
            />

            <div className="flex items-center gap-3.5 p-3 rounded-2xl border border-slate-200 bg-slate-50/80">
              {/* Icon Preview */}
              <div className="relative h-14 w-14 rounded-2xl border border-slate-200 bg-white overflow-hidden shrink-0 flex items-center justify-center shadow-xs">
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt="App Icon Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="h-6 w-6 text-slate-300" />
                  </div>
                )}
              </div>

              {/* Upload Action */}
              <div className="flex-1 min-w-0">
                {iconUrl ? (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold hover:bg-indigo-100 transition-all active:scale-95"
                    >
                      Change Icon
                    </button>
                    <button
                      type="button"
                      onClick={handleRemoveIcon}
                      className="p-1.5 rounded-xl text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 text-xs font-bold transition-all"
                      title="Remove Icon"
                    >
                      <CloseIcon className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white text-indigo-600 border border-indigo-200 text-xs font-bold hover:bg-indigo-50 shadow-xs transition-all active:scale-95"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>{isUploading ? 'Loading...' : 'Upload from Phone/PC'}</span>
                    </button>
                    <p className="text-[10px] text-slate-400 mt-1 truncate">PNG, JPG ko WEBP</p>
                  </div>
                )}
              </div>
            </div>
          </div>

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
