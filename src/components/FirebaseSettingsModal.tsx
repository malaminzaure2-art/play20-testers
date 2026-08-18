import React, { useState } from 'react';
import { 
  Database, 
  ShieldCheck, 
  Key, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Server, 
  UserCheck 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DEFAULT_FIREBASE_CONFIG } from '../firebase/config';

export const FirebaseSettingsModal: React.FC = () => {
  const { isFirebaseModalOpen, setIsFirebaseModalOpen, addToast } = useApp();
  
  const [apiKey, setApiKey] = useState(DEFAULT_FIREBASE_CONFIG.apiKey);
  const [projectId, setProjectId] = useState(DEFAULT_FIREBASE_CONFIG.projectId);
  const [authDomain, setAuthDomain] = useState(DEFAULT_FIREBASE_CONFIG.authDomain);
  const [storageBucket, setStorageBucket] = useState(DEFAULT_FIREBASE_CONFIG.storageBucket);

  if (!isFirebaseModalOpen) return null;

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('success', 'Firebase Credentials Saved', 'Updated local environment bridge configuration.');
    setIsFirebaseModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Firebase Auth & Firestore Integration</h3>
              <p className="text-xs text-slate-500 font-medium">Database collections architecture & credentials</p>
            </div>
          </div>

          <button
            onClick={() => setIsFirebaseModalOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Firestore Collections Schema Overview */}
        <div className="mt-5 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="h-4 w-4" />
              <span>Active Firestore Schema Architecture</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                <div className="font-mono font-bold text-indigo-700">users / {`{uid}`}</div>
                <p className="text-[11px] text-slate-500 mt-1">
                  uid, email, displayName, photoURL, credits, joinedAt, role
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                <div className="font-mono font-bold text-emerald-700">apps / {`{appId}`}</div>
                <p className="text-[11px] text-slate-500 mt-1">
                  appId, ownerId, title, groupUrl, storeUrl, requiredTesters, currentTesters, active
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                <div className="font-mono font-bold text-teal-700">tasks / {`{taskId}`}</div>
                <p className="text-[11px] text-slate-500 mt-1">
                  taskId, userId, appId, startDate, dayCount, status, lastFeedbackDate
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-xs">
                <div className="font-mono font-bold text-amber-800">proofs / {`{proofId}`}</div>
                <p className="text-[11px] text-slate-500 mt-1">
                  proofId, taskId, rating, feedback (min 50 chars), screenshotUrl, device, verified
                </p>
              </div>
            </div>
          </div>

          {/* Credentials form */}
          <form onSubmit={handleSaveConfig} className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 pt-2">
              <Key className="h-3.5 w-3.5 text-amber-600" />
              <span>Configure Firebase Keys (Optional / Custom Project)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">API Key</label>
                <input
                  type="text"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Project ID</label>
                <input
                  type="text"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Auth Domain</label>
                <input
                  type="text"
                  value={authDomain}
                  onChange={(e) => setAuthDomain(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500 shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Storage Bucket</label>
                <input
                  type="text"
                  value={storageBucket}
                  onChange={(e) => setStorageBucket(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-500 shadow-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={() => setIsFirebaseModalOpen(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2 text-xs transition-all shadow-xs"
              >
                Save & Connect
              </button>
            </div>
          </form>

        </div>

      </div>
    </div>
  );
};
