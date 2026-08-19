import React, { useState } from 'react';
import { 
  CheckSquare, 
  Calendar, 
  Coins, 
  Flame, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Star, 
  Award, 
  ShieldCheck, 
  Gift, 
  Trophy,
  Play,
  UploadCloud,
  Smartphone
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TestingTask } from '../types';

export const MyTasksTab: React.FC = () => {
  const { 
    tasks, 
    user, 
    setSelectedTaskForProof, 
    setActiveTab, 
    setIsReferralModalOpen,
    setIsLeaderboardModalOpen 
  } = useApp();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

  const userTasks = tasks.filter((t) => t.userId === user?.uid);
  const activeTasks = userTasks.filter((t) => t.status === 'active');
  const completedTasks = userTasks.filter((t) => t.status === 'completed');

  const toggleExpand = (taskId: string) => {
    setExpandedTaskId((prev) => (prev === taskId ? null : taskId));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Tester Reputation & Verified Badge Card */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xs">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">Tester Status</span>
            <div className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <span>{user?.testerRank || 'Top Tester'}</span>
              <span className="text-amber-500">⭐</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium">100% 14-Day Completion Rate</span>
          </div>
        </div>

        <div className="rounded-2xl border border-orange-100 bg-orange-50/70 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-xs">
              <Flame className="h-6 w-6 fill-white" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-orange-700 uppercase tracking-wider">Active Streak</span>
              <div className="text-sm font-extrabold text-slate-900">
                {user?.dailyStreak || 4} Days Consecutive
              </div>
              <span className="text-[10px] text-slate-500 font-medium">+10 Bonus Coins incoming</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
              <Gift className="h-6 w-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Invite Developers</span>
              <div className="text-sm font-extrabold text-slate-900">
                +{user?.referralEarnings || 150} Coins Earned
              </div>
              <span className="text-[10px] text-slate-500 font-medium">Get +50 Coins per friend</span>
            </div>
          </div>
          <button
            onClick={() => setIsReferralModalOpen(true)}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 text-xs font-bold transition-all shadow-xs active:scale-95"
          >
            Invite
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              My Active Testing Tasks
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {activeTasks.length} in Progress
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Keep your 14-day streak alive! Complete daily test tasks to earn rewards and build your developer reputation.
          </p>
        </div>

        {/* Total Earned Counter */}
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-200 p-2.5 rounded-xl self-start md:self-auto shadow-xs">
          <div className="h-9 w-9 rounded-lg bg-amber-200/60 flex items-center justify-center text-amber-800">
            <Coins className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-amber-800/80">Total Coins Earned</div>
            <div className="text-sm font-bold text-amber-900">
              +{userTasks.reduce((acc, t) => acc + (t.totalCreditsEarned || 0), 0)} Coins
            </div>
          </div>
        </div>
      </div>

      {/* If No Tasks */}
      {userTasks.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
            <CheckSquare className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">No active testing tasks yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            You haven't joined any app closed testing groups. Explore available peer apps, test them for 14 days, and earn coins!
          </p>
          <button
            onClick={() => setActiveTab('explore')}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-bold shadow-sm shadow-indigo-200 transition-all active:scale-95"
          >
            <span>Explore Available Apps</span>
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {userTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const progressPercent = Math.min(100, Math.round((task.currentDay / task.totalDays) * 100));
            const isExpanded = expandedTaskId === task.id;

            return (
              <div
                key={task.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 transition-all hover:border-indigo-200 hover:shadow-md shadow-xs"
              >
                {/* Task Top Info */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* App details */}
                  <div className="flex items-start sm:items-center gap-4">
                    <img
                      src={task.app.iconUrl}
                      alt={task.app.title}
                      className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200 bg-slate-100 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {task.app.category}
                        </span>
                        {isCompleted ? (
                          <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                            14-Day Cycle Completed 🏆
                          </span>
                        ) : (
                          <span className="rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 text-[10px] font-bold flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            Day {task.currentDay} of {task.totalDays}
                          </span>
                        )}
                        <span className="text-xs text-slate-500 font-mono">
                          {task.app.packageName}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {task.app.title}
                      </h3>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span>Developer: <strong className="text-slate-700">{task.app.ownerName}</strong></span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-700 font-bold">
                          <Coins className="h-3.5 w-3.5 text-amber-500" />
                          Earned: +{task.totalCreditsEarned} Coins
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Buttons */}
                  <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
                    <a
                      href={task.app.storeAndroidUrl || task.app.storeWebUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 px-3.5 py-2 text-xs font-semibold transition-colors shadow-xs"
                    >
                      <Play className="h-3.5 w-3.5 text-indigo-600 fill-indigo-600" />
                      <span>Play Store</span>
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </a>

                    {!isCompleted && (
                      <button
                        onClick={() => setSelectedTaskForProof(task)}
                        className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-xs font-bold shadow-sm shadow-indigo-200 transition-all active:scale-95"
                      >
                        <UploadCloud className="h-4 w-4" />
                        <span>Submit Day {task.currentDay} Proof</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 14-Day Visual Day Progress Strip */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-indigo-600" />
                      14-Day Google Play Testing Streak:
                    </span>
                    <span className="text-indigo-700 font-bold">
                      {task.currentDay}/{task.totalDays} Days ({progressPercent}%)
                    </span>
                  </div>

                  {/* 14 Individual Day Pills */}
                  <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5 sm:gap-2">
                    {Array.from({ length: 14 }).map((_, index) => {
                      const dayNum = index + 1;
                      const hasFeedback = task.feedbacks.some((f) => f.dayNumber === dayNum);
                      const isCurrent = dayNum === task.currentDay && !isCompleted;
                      const isLocked = dayNum > task.currentDay;

                      return (
                        <div
                          key={dayNum}
                          className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-center transition-all ${
                            hasFeedback
                              ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                              : isCurrent
                              ? 'bg-indigo-50 border-indigo-400 text-indigo-800 ring-1 ring-indigo-300 font-bold'
                              : 'bg-slate-50 border-slate-200 text-slate-400'
                          }`}
                        >
                          <span className="text-[9px] font-bold uppercase">
                            D{dayNum}
                          </span>
                          <span className="text-[11px] mt-0.5">
                            {hasFeedback ? '✅' : isCurrent ? '🟡' : '🔒'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submissions Drawer Toggle */}
                {task.feedbacks.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => toggleExpand(task.id)}
                      className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                    >
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        View {task.feedbacks.length} Verified Daily Reviews & Screenshots
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </button>

                    {/* Expandable Reviews Log */}
                    {isExpanded && (
                      <div className="mt-3 space-y-3 pl-2 border-l-2 border-indigo-200">
                        {task.feedbacks.map((fb) => (
                          <div
                            key={fb.id}
                            className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className="rounded bg-emerald-100 text-emerald-800 px-2 py-0.5 text-[10px] font-bold">
                                  Day {fb.dayNumber} Proof
                                </span>
                                <div className="flex text-amber-400">
                                  {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${
                                        i < fb.rating
                                          ? 'fill-amber-400 text-amber-400'
                                          : 'text-slate-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <span className="text-[11px] text-slate-400 font-medium">
                                {new Date(fb.date).toLocaleDateString()}
                              </span>
                            </div>

                            <p className="text-xs text-slate-700 leading-relaxed font-sans">
                              "{fb.feedbackText}"
                            </p>

                            <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 text-[10px] text-slate-500">
                              <div className="flex items-center gap-2">
                                <Smartphone className="h-3 w-3 text-slate-400" />
                                <span>{fb.deviceModel} ({fb.androidVersion})</span>
                              </div>
                              <span className="text-amber-800 font-bold">
                                +{fb.creditsAwarded} Coins Awarded
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
