import React, { useState, useRef } from 'react';
import { 
  PlusCircle, 
  Coins, 
  AlertCircle, 
  Sparkles,
  Upload,
  Image as ImageIcon,
  X as CloseIcon,
  Copy,
  Check,
  ExternalLink,
  ChevronDown,
  ChevronUp
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

  const OFFICIAL_GROUP_URL = 'https://groups.google.com/g/play20-testers';
  const OFFICIAL_GROUP_EMAIL = 'play20-testers@googlegroups.com';

  const [title, setTitle] = useState('');
  const [useOfficialGroup, setUseOfficialGroup] = useState(true);
  const [customGroupUrl, setCustomGroupUrl] = useState('');
  const [storeWebUrl, setStoreWebUrl] = useState('');
  const [iconUrl, setIconUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isAddAppModalOpen) return null;

  const totalCostCoins = 200; // 20 testers × 10 coins
  const userBalance = user?.credits || 0;
  const hasSufficientCredits = userBalance >= totalCostCoins;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(OFFICIAL_GROUP_EMAIL);
    setCopiedEmail(true);
    addToast('success', 'Email Copied!', 'Paste play20-testers@googlegroups.com in your Google Play Console testers list.');
    setTimeout(() => setCopiedEmail(false), 2500);
  };

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

    if (!hasSufficientCredits) {
      addToast('error', 'Insufficient Coins', `You need ${totalCostCoins} coins to launch a 20-tester closed test.`);
      return;
    }

    const finalGroupUrl = useOfficialGroup ? OFFICIAL_GROUP_URL : customGroupUrl.trim();

    if (!finalGroupUrl) {
      addToast('error', 'Missing Field', 'Please provide a valid Google Group URL.');
      return;
    }

    if (!storeWebUrl.trim()) {
      addToast('error', 'Missing Field', 'Please provide your Google Play opt-in link.');
      return;
    }

    // Process app submission
    addNewApp({
      title: title.trim(),
      googleGroupUrl: finalGroupUrl,
      storeWebUrl: storeWebUrl.trim(),
      icon: iconUrl || `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=60`,
      description: 'Google Play 14-day closed testing track with 20 active peer developers.',
      category: 'Productivity',
      totalSlots: 20,
      rewardCoins: 10,
    });

    setIsAddAppModalOpen(false);
    setTitle('');
    setCustomGroupUrl('');
    setStoreWebUrl('');
    setIconUrl('');
    addToast('success', 'App Launched!', 'Your app is now live on the testing feed. 20 testers will begin testing.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
              <PlusCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Publish App for Testers</h3>
              <p className="text-xs text-slate-500 font-medium">Hire 20 verified testers for 14 continuous days</p>
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
              App Icon <span className="text-slate-400 font-normal text-[11px]">(Optional)</span>
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
                      <span>{isUploading ? 'Loading...' : 'Upload from Device'}</span>
                    </button>
                    <p className="text-[10px] text-slate-400 mt-1 truncate">PNG, JPG, or WEBP</p>
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

          {/* 2. Official Google Group Integration */}
          <div className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                <span>2. Official Play20 Testers Pool</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">Instant Access</span>
              </span>
              <button
                type="button"
                onClick={() => setUseOfficialGroup(!useOfficialGroup)}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 underline"
              >
                {useOfficialGroup ? 'Use Custom Group' : 'Use Official Group'}
              </button>
            </div>

            {useOfficialGroup ? (
              <div className="mt-2.5 space-y-2">
                <p className="text-[11px] text-indigo-900/90 leading-relaxed">
                  No need to create a new Google Group! Simply copy this email and add it to your <strong>Google Play Console ➔ Closed testing ➔ Testers list</strong>:
                </p>
                <div className="flex items-center justify-between gap-2 bg-white rounded-xl p-2 border border-indigo-200 shadow-xs">
                  <code className="text-xs font-bold text-indigo-900 select-all truncate pl-1">
                    {OFFICIAL_GROUP_EMAIL}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold transition-all shrink-0 active:scale-95 shadow-xs"
                  >
                    {copiedEmail ? <Check className="h-3.5 w-3.5 text-emerald-300" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedEmail ? 'Copied!' : 'Copy Email'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-2.5 space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">Custom Google Group URL:</label>
                <input
                  type="url"
                  placeholder="https://groups.google.com/g/your-custom-group"
                  value={customGroupUrl}
                  onChange={(e) => setCustomGroupUrl(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 shadow-xs"
                />
              </div>
            )}
          </div>

          {/* 3. Play Store Opt-in Link */}
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
            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
              This is the join link generated in your Google Play Console under <strong>"How testers join your test (Join on Android/Web)"</strong> after adding the testers group email.
            </p>
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
