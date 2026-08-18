import React, { useState } from 'react';
import { 
  Github, 
  Terminal, 
  Globe, 
  Copy, 
  Check, 
  ExternalLink, 
  Layers, 
  ShieldCheck, 
  Database,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EXPORTED_FIREBASE_CONFIG_JS, EXPORTED_FIRESTORE_RULES } from '../firebase/config';

export const DeployGuideModal: React.FC = () => {
  const { isDeployGuideOpen, setIsDeployGuideOpen, addToast } = useApp();
  const [activeGuideTab, setActiveGuideTab] = useState<'git' | 'vercel' | 'netlify' | 'firebase'>('git');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isDeployGuideOpen) return null;

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(label);
    addToast('success', 'Copied to Clipboard', `${label} copied successfully.`);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const GIT_COMMANDS = `# 1. Initialize local git repository
git init

# 2. Add all production files to staging
git add .

# 3. Create initial commit
git commit -m "Initial commit: Play20 Closed Testing & Feedback Exchange platform"

# 4. Rename default branch to main
git branch -M main

# 5. Connect your GitHub remote repository (replace with your repo URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/play20-testing-exchange.git

# 6. Push codebase to GitHub
git push -u origin main
`;

  const VERCEL_STEPS = `# Option A: Deploy via Vercel CLI (Instant)
npm i -g vercel
vercel

# Option B: Deploy via Vercel Web Dashboard (Recommended for CI/CD)
# 1. Open https://vercel.com/new and sign in with GitHub.
# 2. Click "Import" next to your 'play20-testing-exchange' repository.
# 3. Configure Framework Preset: 'Vite'
# 4. Build Command: 'npm run build'
# 5. Output Directory: 'dist'
# 6. Under 'Environment Variables', add:
#    VITE_FIREBASE_API_KEY=your_api_key
#    VITE_FIREBASE_PROJECT_ID=your_project_id
# 7. Click "Deploy". Your site is live on *.vercel.app!
`;

  const NETLIFY_STEPS = `# Option A: Deploy via Netlify CLI
npm i -g netlify-cli
netlify deploy --prod --dir=dist

# Option B: Deploy via Netlify Dashboard
# 1. Open https://app.netlify.com and click "Add new site" -> "Import an existing project".
# 2. Select GitHub and authorize your repository.
# 3. Build settings:
#    - Base directory: (leave empty)
#    - Build command: npm run build
#    - Publish directory: dist
# 4. Under Site configuration -> Domain management:
#    - Click "Add custom domain" (e.g. play20exchange.com)
#    - Add CNAME record pointing to your Netlify site.
`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800">
              <Github className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">GitHub Setup & Production Deployment</h3>
              <p className="text-xs text-slate-500 font-medium">Step-by-step commands for GitHub, Vercel, Netlify & Firebase</p>
            </div>
          </div>

          <button
            onClick={() => setIsDeployGuideOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="mt-5 flex items-center gap-1.5 border-b border-slate-100 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveGuideTab('git')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeGuideTab === 'git'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Terminal className="h-4 w-4" />
            1. Git & GitHub Setup
          </button>

          <button
            onClick={() => setActiveGuideTab('vercel')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeGuideTab === 'vercel'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Globe className="h-4 w-4" />
            2. Vercel & Netlify
          </button>

          <button
            onClick={() => setActiveGuideTab('firebase')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeGuideTab === 'firebase'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Database className="h-4 w-4" />
            3. Firebase Config & Rules
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-5">
          
          {/* Tab 1: Git Commands */}
          {activeGuideTab === 'git' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-700 font-medium">
                  Run these sequential terminal commands in your project root:
                </span>
                <button
                  onClick={() => copyToClipboard(GIT_COMMANDS, 'Git commands')}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-xs"
                >
                  {copiedSection === 'Git commands' ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copiedSection === 'Git commands' ? 'Copied!' : 'Copy Script'}</span>
                </button>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-emerald-400 overflow-x-auto shadow-inner">
                <pre>{GIT_COMMANDS}</pre>
              </div>
            </div>
          )}

          {/* Tab 2: Vercel & Netlify */}
          {activeGuideTab === 'vercel' && (
            <div className="space-y-4">
              
              {/* Vercel Section */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Vercel Deployment & Custom Domain</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(VERCEL_STEPS, 'Vercel steps')}
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy Instructions</span>
                  </button>
                </div>
                <pre className="font-mono text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap">
                  {VERCEL_STEPS}
                </pre>
              </div>

              {/* Netlify Section */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">Netlify Deployment</span>
                  </div>
                  <button
                    onClick={() => copyToClipboard(NETLIFY_STEPS, 'Netlify steps')}
                    className="flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy Instructions</span>
                  </button>
                </div>
                <pre className="font-mono text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap">
                  {NETLIFY_STEPS}
                </pre>
              </div>

            </div>
          )}

          {/* Tab 3: Firebase Config & Rules */}
          {activeGuideTab === 'firebase' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">firebase-config.js (Modular SDK)</span>
                  <button
                    onClick={() => copyToClipboard(EXPORTED_FIREBASE_CONFIG_JS, 'firebase-config.js')}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Code</span>
                  </button>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto">
                  <pre>{EXPORTED_FIREBASE_CONFIG_JS}</pre>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">firestore.rules (Security Architecture)</span>
                  <button
                    onClick={() => copyToClipboard(EXPORTED_FIRESTORE_RULES, 'firestore.rules')}
                    className="flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>Copy Rules</span>
                  </button>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto">
                  <pre>{EXPORTED_FIRESTORE_RULES}</pre>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="mt-6 flex justify-end border-t border-slate-100 pt-4">
          <button
            onClick={() => setIsDeployGuideOpen(false)}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-bold transition-all shadow-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
