import React, { useState, useEffect, useRef } from 'react';
import { 
  Edit3, 
  Upload, 
  Image as ImageIcon, 
  X as CloseIcon, 
  Check, 
  Copy, 
  ExternalLink,
  Save,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EditAppModal: React.FC = () => {
  const { 
    editingApp, 
    setEditingApp, 
    updateApp, 
    addToast 
  } = useApp();

  const OFFICIAL_GROUP_URL = 'https://groups.google.com/g/play20-testers';
  const OFFICIAL_GROUP_EMAIL = 'play20-testers@googlegroups.com';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [useOfficialGroup, setUseOfficialGroup] = useState(true);
  const [customGroupUrl, setCustomGroupUrl] = useState('');
  const [storeWebUrl, setStoreWebUrl] = useState('');
  const [iconUrl, setIconUrl] = useState<string>('');
  const [category, setCategory] = useState<any>('Tools');
  const [isUploading, setIsUploading] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Populate state when modal opens
  useEffect(() => {
    if (editingApp) {
      setTitle(editingApp.title || '');
      setDescription(editingApp.description || '');
      setIconUrl(editingApp.iconUrl || '');
      setCategory(editingApp.category || 'Tools');
      setStoreWebUrl(editingApp.storeWebUrl || '');
      
      const isOfficial = editingApp.groupUrl === OFFICIAL_GROUP_URL;
      setUseOfficialGroup(isOfficial);
      setCustomGroupUrl(isOfficial ? '' : editingApp.groupUrl);
    }
  }, [editingApp]);

  if (!editingApp) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(OFFICIAL_GROUP_EMAIL);
    setCopiedEmail(true);
    addToast('success', 'Email Copied!', 'Paste play20-testers@googlegroups.com in your Google Play Console.');
    setTimeout(() => setCopiedEmail(false), 2500);
  };

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
          addToast('success', 'Icon Updated', 'App icon updated successfully!');
        }
        setIsUploading(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      addToast('error', 'Title Required', 'Please enter your app name.');
      return;
    }

    const finalGroupUrl = useOfficialGroup ? OFFICIAL_GROUP_URL : customGroupUrl.trim();
    if (!finalGroupUrl) {
      addToast('error', 'Google Group Required', 'Please provide a valid Google Group URL.');
      return;
    }

    if (!storeWebUrl.trim()) {
      addToast('error', 'Play Store Link Required', 'Please enter your Google Play opt-in link.');
      return;
    }

    // Extract package name if possible or keep existing
    let finalPackageName = editingApp.packageName;
    try {
      const parsed = new URL(storeWebUrl.trim());
      const idParam = parsed.searchParams.get('id');
      if (idParam) {
        finalPackageName = idParam;
      }
    } catch (e) {
      // keep existing
    }

    const success = updateApp(editingApp.id, {
      title: title.trim(),
      description: description.trim() || `${title} closed testing track.`,
      iconUrl: iconUrl || editingApp.iconUrl,
      groupUrl: finalGroupUrl,
      storeWebUrl: storeWebUrl.trim(),
      storeAndroidUrl: storeWebUrl.trim(),
      category,
      packageName: finalPackageName,
    });

    if (success) {
      setEditingApp(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-xs">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Edit App Details</h3>
              <p className="text-xs text-slate-500">Update links, icon, or title with zero additional coin cost</p>
            </div>
          </div>

          <button
            onClick={() => setEditingApp(null)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="mt-5 space-y-4">
          
          {/* App Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              App Title / Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., My Awesome App"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>

          {/* App Icon Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              App Icon (Square)
            </label>
            <div className="flex items-center gap-3">
              <div className="relative h-14 w-14 shrink-0 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 overflow-hidden flex items-center justify-center">
                {iconUrl ? (
                  <img
                    src={iconUrl}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <ImageIcon className="h-6 w-6 text-slate-400" />
                )}
              </div>

              <div className="flex-1">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs transition-colors"
                >
                  <Upload className="h-3.5 w-3.5 text-indigo-600" />
                  <span>{isUploading ? 'Compressing...' : 'Change Icon from Phone'}</span>
                </button>
                <p className="text-[11px] text-slate-400 mt-1">PNG, JPG or WEBP under 5MB</p>
              </div>
            </div>
          </div>

          {/* Google Group Setup */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
            <label className="block text-xs font-bold text-slate-800">
              Google Group for Testers
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUseOfficialGroup(true)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border text-left transition-all ${
                  useOfficialGroup
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Official Group (Recommended)
              </button>

              <button
                type="button"
                onClick={() => setUseOfficialGroup(false)}
                className={`py-2 px-3 rounded-xl text-xs font-bold border text-left transition-all ${
                  !useOfficialGroup
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                Custom Group URL
              </button>
            </div>

            {useOfficialGroup ? (
              <div className="rounded-xl bg-white border border-slate-200 p-3 text-xs text-slate-600">
                <p className="text-[11px] text-slate-500 mb-1.5 font-medium">
                  Add this email to your Google Play Console Closed Testing track:
                </p>
                <div className="flex items-center justify-between bg-slate-100/80 px-2.5 py-1.5 rounded-lg font-mono text-[11px] text-slate-800">
                  <span>{OFFICIAL_GROUP_EMAIL}</span>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-sans font-bold text-[10px] ml-2"
                  >
                    {copiedEmail ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedEmail ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <input
                  type="url"
                  value={customGroupUrl}
                  onChange={(e) => setCustomGroupUrl(e.target.value)}
                  placeholder="https://groups.google.com/g/your-testers-group"
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200"
                />
              </div>
            )}
          </div>

          {/* Play Store Opt-In Link */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Google Play Closed Testing Web Link (Opt-in URL) *
            </label>
            <input
              type="url"
              required
              value={storeWebUrl}
              onChange={(e) => setStoreWebUrl(e.target.value)}
              placeholder="https://play.google.com/apps/testing/com.yourpackage.app"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all font-mono"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Testing Instructions & Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief instructions for testers..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditingApp(null)}
              className="flex-1 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-xs font-bold shadow-sm shadow-indigo-200 active:scale-95 transition-all"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
