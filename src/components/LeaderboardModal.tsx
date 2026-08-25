import React from 'react';
import { 
  Trophy, 
  Flame, 
  Coins, 
  ShieldCheck, 
  Sparkles,
  Users,
  Zap,
  TrendingUp
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LeaderboardModal: React.FC = () => {
  const { 
    isLeaderboardModalOpen, 
    setIsLeaderboardModalOpen, 
    leaderboardUsers,
    user 
  } = useApp();

  if (!isLeaderboardModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl my-8 animate-fadeIn">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 shadow-xs">
              <Trophy className="h-6 w-6 text-amber-500 fill-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                Weekly Leaderboard
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Top Boosters & Creators
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsLeaderboardModalOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors font-bold cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Podium Highlights */}
        {leaderboardUsers.length >= 3 && (
          <div className="mt-5 grid grid-cols-3 gap-2.5 items-end">
            {/* #2 Silver */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center flex flex-col items-center">
              <div className="relative mb-2">
                <img
                  src={leaderboardUsers[1]?.photoURL}
                  alt={leaderboardUsers[1]?.displayName}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-300 shadow-xs"
                />
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 text-slate-800 text-[10px] font-black shadow-xs">
                  2
                </span>
              </div>
              <span className="text-xs font-bold text-slate-800 line-clamp-1">
                {leaderboardUsers[1]?.displayName}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
                {leaderboardUsers[1]?.tasksCompleted} Boosts
              </span>
              <span className="mt-1 rounded-full bg-slate-200 text-slate-700 px-2 py-0.5 text-[9px] font-bold">
                🥈 Silver
              </span>
            </div>

            {/* #1 Gold */}
            <div className="rounded-2xl border border-amber-300 bg-amber-50/60 p-3.5 text-center flex flex-col items-center ring-2 ring-amber-400/20 shadow-xs">
              <div className="relative mb-2">
                <img
                  src={leaderboardUsers[0]?.photoURL}
                  alt={leaderboardUsers[0]?.displayName}
                  className="h-14 w-14 rounded-full object-cover ring-4 ring-amber-400 shadow-xs"
                />
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-amber-950 text-xs font-black shadow-xs">
                  👑
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900 line-clamp-1">
                {leaderboardUsers[0]?.displayName}
              </span>
              <span className="text-[10px] font-bold text-amber-800 mt-0.5">
                {leaderboardUsers[0]?.tasksCompleted} Boosts
              </span>
              <span className="mt-1 rounded-full bg-amber-400 text-amber-950 px-2.5 py-0.5 text-[10px] font-extrabold shadow-xs">
                🥇 Champion
              </span>
            </div>

            {/* #3 Bronze */}
            <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-3 text-center flex flex-col items-center">
              <div className="relative mb-2">
                <img
                  src={leaderboardUsers[2]?.photoURL}
                  alt={leaderboardUsers[2]?.displayName}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-amber-600/50 shadow-xs"
                />
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-700 text-white text-[10px] font-black shadow-xs">
                  3
                </span>
              </div>
              <span className="text-xs font-bold text-slate-800 line-clamp-1">
                {leaderboardUsers[2]?.displayName}
              </span>
              <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
                {leaderboardUsers[2]?.tasksCompleted} Boosts
              </span>
              <span className="mt-1 rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[9px] font-bold">
                🥉 Bronze
              </span>
            </div>
          </div>
        )}

        {/* Detailed Leaderboard List */}
        <div className="mt-5 divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1">
          {leaderboardUsers.map((item) => {
            const isCurrentUser = user && user.displayName === item.displayName;

            return (
              <div
                key={item.uid || item.rank}
                className={`flex items-center justify-between py-2.5 px-3 rounded-2xl transition-colors ${
                  isCurrentUser ? 'bg-indigo-50/70 border border-indigo-200' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`text-xs font-black w-5 text-center ${
                    item.rank === 1 ? 'text-amber-500' : item.rank === 2 ? 'text-slate-400' : item.rank === 3 ? 'text-amber-700' : 'text-slate-400'
                  }`}>
                    #{item.rank}
                  </span>

                  <img
                    src={item.photoURL}
                    alt={item.displayName}
                    className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                  />

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-800 truncate">
                        {item.displayName}
                      </span>
                      {isCurrentUser && (
                        <span className="rounded-md bg-indigo-600 text-white px-1.5 py-0.2 text-[9px] font-bold">
                          You
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-400 block">
                      {item.badge}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-orange-600">
                    <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                    <span>{item.dailyStreak}d</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                    <span>🪙</span>
                    <span>{item.totalCoinsEarned.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Info Banner */}
        <div className="mt-5 rounded-2xl bg-indigo-50/70 p-3 flex items-center gap-2.5 border border-indigo-100 text-xs text-indigo-900">
          <Zap className="h-4 w-4 text-indigo-600 shrink-0" />
          <span>
            Complete boost tasks daily to enter the leaderboard and earn a <strong>500 Coin</strong> weekend bonus!
          </span>
        </div>

      </div>
    </div>
  );
};
