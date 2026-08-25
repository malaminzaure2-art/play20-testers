import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  ExternalLink, 
  Sparkles, 
  Coins, 
  Clock, 
  Zap,
  TrendingUp
} from 'lucide-react';

export const MyTasksTab: React.FC = () => {
  const {
    user,
    completedTasks,
    setActiveTab,
    setIsAuthModalOpen,
  } = useApp();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center text-2xl font-bold">
          🔒
        </div>
        <h2 className="text-xl font-black text-slate-900">Sign In to View Task History</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Please sign in to check your completed tasks, verified rewards, and accumulated coins.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
        >
          Sign In / Register
        </button>
      </div>
    );
  }

  const myTasks = completedTasks.filter(t => t.userId === user.uid);
  const totalCoinsEarned = myTasks.reduce((acc, t) => acc + (t.coinsEarned || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Task History
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              {myTasks.length} Completed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review all completed TikTok, YouTube, Instagram, and Facebook boost tasks with instant coin proof.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('explore')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Earn More Coins</span>
        </button>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
            ✅
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Total Completed Tasks</div>
            <div className="text-xl font-black text-slate-900">{myTasks.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-lg">
            🪙
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Total Coins Earned</div>
            <div className="text-xl font-black text-amber-700">+{totalCoinsEarned} Coins</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
            🔥
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Booster Tier Status</div>
            <div className="text-xl font-black text-purple-700">{user.boosterTier || 'Bronze'}</div>
          </div>
        </div>
      </div>

      {/* Completed Tasks List */}
      {myTasks.length > 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {myTasks.map((task) => (
              <div key={task.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition">
                
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0 mt-0.5">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white uppercase">
                        {task.platform}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 uppercase">
                        {task.actionType}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(task.completedAt).toLocaleString()}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm text-slate-900">
                      {task.campaignTitle}
                    </h4>

                    <a
                      href={task.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:underline inline-flex items-center gap-1 font-mono text-[11px]"
                    >
                      <span>{task.targetUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-right">
                    <div className="text-xs text-emerald-600 font-bold">Verified ✅</div>
                    <div className="font-black text-amber-900 bg-amber-50 border border-amber-200 px-3 py-1 rounded-xl text-xs flex items-center gap-1 shadow-2xs">
                      <span>🪙</span>
                      <span>+{task.coinsEarned} Coins</span>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 mx-auto flex items-center justify-center text-2xl font-bold">
            🪙
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900">No completed tasks yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Start engaging with TikTok, YouTube, Instagram, and Facebook campaigns right now to earn hundreds of coins in minutes!
            </p>
          </div>
          <button
            onClick={() => setActiveTab('explore')}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Browse Tasks & Earn Coins</span>
          </button>
        </div>
      )}

    </div>
  );
};
