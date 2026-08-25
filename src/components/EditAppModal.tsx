import React, { useState, useEffect } from 'react';
import { 
  Edit3, 
  X as CloseIcon, 
  Save, 
  Coins, 
  ExternalLink,
  Sparkles,
  Link2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SocialPlatform, BoostActionType } from '../types';

export const EditAppModal: React.FC = () => {
  const { 
    editingApp, 
    setEditingApp, 
    updateCampaign, 
    addToast 
  } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [targetUrl, setTargetUrl] = useState('');
  const [coinsPerAction, setCoinsPerAction] = useState<number>(10);
  const [status, setStatus] = useState<'active' | 'paused'>('active');

  useEffect(() => {
    if (editingApp) {
      setTitle(editingApp.title || '');
      setDescription(editingApp.description || '');
      setTargetUrl(editingApp.targetUrl || '');
      setCoinsPerAction(editingApp.coinsPerAction || 10);
      setStatus(editingApp.status === 'paused' ? 'paused' : 'active');
    }
  }, [editingApp]);

  if (!editingApp) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      addToast('error', 'Title Required', 'Please enter a campaign title.');
      return;
    }

    if (!targetUrl.trim()) {
      addToast('error', 'URL Required', 'Please enter a valid link for your campaign.');
      return;
    }

    const success = updateCampaign(editingApp.id, {
      title: title.trim(),
      description: description.trim(),
      targetUrl: targetUrl.trim(),
      coinsPerAction: Number(coinsPerAction),
      status: status,
    });

    if (success) {
      setEditingApp(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl my-8 animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 shadow-xs">
              <Edit3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Edit Boost Campaign</h3>
              <p className="text-xs text-slate-500">Update destination URL, title, or reward coins</p>
            </div>
          </div>

          <button
            onClick={() => setEditingApp(null)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <CloseIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="mt-5 space-y-4">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Campaign Title / Channel Name *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Follow our TikTok account @globaltrend"
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Target URL */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Destination URL (Target Link) *
            </label>
            <div className="relative">
              <Link2 className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="url"
                required
                value={targetUrl}
                onChange={(e) => setTargetUrl(e.target.value)}
                placeholder="https://www.tiktok.com/@youraccount"
                className="w-full rounded-xl border border-slate-300 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden font-mono"
              />
            </div>
          </div>

          {/* Coins Per Action & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Coins Per Action (Reward)
              </label>
              <div className="flex flex-wrap items-center gap-1.5 mb-2">
                {[2, 5, 10, 20, 50, 100].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setCoinsPerAction(r)}
                    className={`px-2 py-0.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                      coinsPerAction === r
                        ? 'bg-amber-500 text-slate-950 border-amber-500 font-black'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    🪙 {r}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="1"
                max="1000"
                value={coinsPerAction || ''}
                onChange={(e) => setCoinsPerAction(Math.max(1, parseInt(e.target.value) || 0))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 bg-white focus:border-indigo-500 focus:outline-hidden font-bold"
                placeholder="Coins amount..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Campaign Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 bg-white focus:border-indigo-500 focus:outline-hidden font-bold"
              >
                <option value="active">Active (Running)</option>
                <option value="paused">Paused</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Task Instructions (Optional)
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Example: Follow account and like the latest post..."
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditingApp(null)}
              className="flex-1 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-xs font-bold shadow-xs transition-all cursor-pointer"
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
