import React from 'react';
import { 
  Trophy, 
  Flame, 
  Coins, 
  ShieldCheck, 
  Sparkles,
  User as UserIcon,
  Users
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
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors font-bold"
          >
            ✕
          </button>
        </div>

        {/* Dynamic Leaderboard Content */}
        {leaderboardUsers.length === 0 ? (
          <div className="py-12 px-4 text-center">
            <div className="mx-auto h-16 w-16 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-500 mb-3.5 shadow-xs">
              <Trophy className="h-8 w-8" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">No Ranked Testers Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
              Start testing apps on the platform or submit your daily feedback to claim the <strong>#1 Champion spot</strong> on the leaderboard!
            </p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium Highlights */}
            {leaderboardUsers.length >= 3 && (
              <div className="mt-5 grid grid-cols-3 gap-2.5 items-end">
                {/* #2 Silver */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-3 text-center flex flex-col items-center">
                  <div className="relative mb-2">
                    {leaderboardUsers[1]?.photoURL ? (
                      <img
                        src={leaderboardUsers[1].photoURL}
                        alt={leaderboardUsers[1].displayName}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-slate-300 shadow-xs"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-700 font-bold text-sm">
                        {leaderboardUsers[1]?.displayName?.charAt(0) || '2'}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-slate-300 text-slate-800 text-[10px] font-black shadow-xs">
                      2
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 line-clamp-1">
                    {leaderboardUsers[1]?.displayName || 'Tester 2'}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
                    {leaderboardUsers[1]?.completedTests || 0} Apps Done
                  </span>
                  <span className="mt-1 rounded-full bg-slate-200 text-slate-700 px-2 py-0.5 text-[9px] font-bold">
                    🥈 Silver
                  </span>
                </div>

                {/* #1 Gold */}
                <div className="rounded-2xl border border-amber-300 bg-amber-50/60 p-3.5 text-center flex flex-col items-center ring-2 ring-amber-400/20 shadow-xs">
                  <div className="relative mb-2">
                    {leaderboardUsers[0]?.photoURL ? (
                      <img
                        src={leaderboardUsers[0].photoURL}
                        alt={leaderboardUsers[0].displayName}
                        className="h-14 w-14 rounded-full object-cover ring-4 ring-amber-400 shadow-xs"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-amber-200 flex items-center justify-center text-amber-900 font-bold text-base">
                        {leaderboardUsers[0]?.displayName?.charAt(0) || '1'}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-amber-950 text-xs font-black shadow-xs">
                      👑
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-900 line-clamp-1">
                    {leaderboardUsers[0]?.displayName || 'Top Champion'}
                  </span>
                  <span className="text-[10px] font-bold text-amber-800 mt-0.5">
                    {leaderboardUsers[0]?.completedTests || 0} Apps Done
                  </span>
                  <span className="mt-1 rounded-full bg-amber-400 text-amber-950 px-2.5 py-0.5 text-[10px] font-extrabold shadow-xs">
                    🥇 Champion
                  </span>
                </div>

                {/* #3 Bronze */}
                <div className="rounded-2xl border border-orange-200 bg-orange-50/50 p-3 text-center flex flex-col items-center">
                  <div className="relative mb-2">
                    {leaderboardUsers[2]?.photoURL ? (
                      <img
                        src={leaderboardUsers[2].photoURL}
                        alt={leaderboardUsers[2].displayName}
                        className="h-12 w-12 rounded-full object-cover ring-2 ring-amber-600/50 shadow-xs"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-orange-200 flex items-center justify-center text-orange-900 font-bold text-sm">
                        {leaderboardUsers[2]?.displayName?.charAt(0) || '3'}
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-700 text-white text-[10px] font-black shadow-xs">
                      3
                    </span>
                  </div>
                  <span className="text-xs font-bold text-slate-800 line-clamp-1">
                    {leaderboardUsers[2]?.displayName || 'Tester 3'}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-500 mt-0.5">
                    {leaderboardUsers[2]?.completedTests || 0} Apps Done
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

                      {item.photoURL ? (
                        <img
                          src={item.photoURL}
                          alt={item.displayName}
                          className="h-8 w-8 rounded-full object-cover ring-1 ring-slate-200"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold">
                          {item.displayName?.charAt(0) || 'U'}
                        </div>
                      )}

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
                          {item.badge || 'Verified Tester 🛡️'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-right">
                      <div className="flex items-center gap-1 text-[11px] font-bold text-orange-600">
                        <Flame className="h-3.5 w-3.5 fill-orange-500 text-orange-500" />
                        <span>{item.dailyStreak}d streak</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        <Coins className="h-3 w-3 text-emerald-600" />
                        <span>{item.totalCoinsEarned}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* Footer Info Banner */}
        <div className="mt-5 rounded-2xl bg-indigo-50/70 p-3 flex items-center gap-2.5 border border-indigo-100 text-xs text-indigo-900">
          <ShieldCheck className="h-4 w-4 text-indigo-600 shrink-0" />
          <span>
            Complete 14 full testing days without uninstalling to level up to <strong>Top Tester ⭐</strong>.
          </span>
        </div>

      </div>
    </div>
  );
};
