import React from 'react';
import { 
  Trophy, 
  Medal, 
  Flame, 
  CheckCircle2, 
  Coins, 
  ShieldCheck, 
  Sparkles,
  Star
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-50 border border-amber-200 text-amber-600">
              <Trophy className="h-6 w-6 text-amber-500 fill-amber-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                Weekly Honor Roll
              </span>
              <h3 className="text-base font-bold text-slate-900">
                Top Active Testers Leaderboard
              </h3>
            </div>
          </div>

          <button
            onClick={() => setIsLeaderboardModalOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Top 3 Podium Highlights */}
        <div className="mt-5 grid grid-cols-3 gap-2.5 items-end">
          {/* #2 Silver */}
          {leaderboardUsers[1] && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center flex flex-col items-center">
              <div className="relative mb-2">
                <img
                  src={leaderboardUsers[1].photoURL}
                  alt={leaderboardUsers[1].displayName}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-300"
                />
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 text-slate-800 text-[10px] font-black shadow-xs">
                  2
                </span>
              </div>
              <span className="text-xs font-bold text-slate-800 line-clamp-1">
                {leaderboardUsers[1].displayName}
              </span>
              <span className="text-[10px] font-semibold text-slate-500">
                {leaderboardUsers[1].completedTests} Apps Done
              </span>
              <span className="mt-1 rounded-full bg-slate-200 text-slate-700 px-2 py-0.5 text-[9px] font-bold">
                🥈 Silver
              </span>
            </div>
          )}

          {/* #1 Gold */}
          {leaderboardUsers[0] && (
            <div className="rounded-2xl border border-amber-300 bg-amber-50/60 p-3.5 text-center flex flex-col items-center ring-2 ring-amber-400/20 shadow-xs">
              <div className="relative mb-2">
                <img
                  src={leaderboardUsers[0].photoURL}
                  alt={leaderboardUsers[0].displayName}
                  className="h-14 w-14 rounded-full object-cover ring-4 ring-amber-400"
                />
                <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-amber-950 text-xs font-black shadow-xs">
                  👑
                </span>
              </div>
              <span className="text-xs font-bold text-slate-900 line-clamp-1">
                {leaderboardUsers[0].displayName}
              </span>
              <span className="text-[10px] font-bold text-amber-800">
                {leaderboardUsers[0].completedTests} Apps Done
              </span>
              <span className="mt-1 rounded-full bg-amber-400 text-amber-950 px-2.5 py-0.5 text-[10px] font-extrabold shadow-xs">
                🥇 Champion
              </span>
            </div>
          )}

          {/* #3 Bronze */}
          {leaderboardUsers[2] && (
            <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-3 text-center flex flex-col items-center">
              <div className="relative mb-2">
                <img
                  src={leaderboardUsers[2].photoURL}
                  alt={leaderboardUsers[2].displayName}
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-amber-600/50"
                />
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-700 text-white text-[10px] font-black shadow-xs">
                  3
                </span>
              </div>
              <span className="text-xs font-bold text-slate-800 line-clamp-1">
                {leaderboardUsers[2].displayName}
              </span>
              <span className="text-[10px] font-semibold text-slate-500">
                {leaderboardUsers[2].completedTests} Apps Done
              </span>
              <span className="mt-1 rounded-full bg-amber-100 text-amber-900 px-2 py-0.5 text-[9px] font-bold">
                🥉 Bronze
              </span>
            </div>
          )}
        </div>

        {/* Full Leaderboard Table */}
        <div className="mt-5 space-y-2 max-h-56 overflow-y-auto pr-1">
          {leaderboardUsers.map((lbUser) => {
            const isMe = lbUser.uid === user?.uid;
            return (
              <div
                key={lbUser.uid}
                className={`flex items-center justify-between rounded-xl p-3 text-xs transition-all ${
                  isMe
                    ? 'border-2 border-indigo-600 bg-indigo-50/70 shadow-xs'
                    : 'border border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-5 text-center font-black ${
                    lbUser.rank === 1 ? 'text-amber-500 font-extrabold text-sm' :
                    lbUser.rank === 2 ? 'text-slate-400 font-extrabold text-sm' :
                    lbUser.rank === 3 ? 'text-amber-700 font-extrabold text-sm' :
                    'text-slate-500 font-bold'
                  }`}>
                    #{lbUser.rank}
                  </span>

                  <img
                    src={lbUser.photoURL}
                    alt={lbUser.displayName}
                    className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                  />

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-slate-900">{lbUser.displayName}</span>
                      {isMe && (
                        <span className="rounded bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.2">
                          YOU
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-medium text-slate-500">
                      {lbUser.badge}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-orange-600">
                    <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                    <span>{lbUser.dailyStreak}d streak</span>
                  </div>

                  <div className="flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-1 text-emerald-800 font-bold text-[11px]">
                    <Coins className="h-3 w-3 text-emerald-600 fill-emerald-500" />
                    <span>{lbUser.totalCoinsEarned}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Verification Footer Note */}
        <div className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-3 flex items-center justify-between text-xs text-indigo-900">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
            <span>Complete 14 full testing days without uninstalling to level up to <strong>Top Tester ⭐</strong>.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
