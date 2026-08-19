import React, { useState } from 'react';
import { 
  Layers, 
  Users, 
  PlusCircle, 
  Calendar, 
  Award, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Download, 
  Star, 
  MessageSquare, 
  Smartphone, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle,
  Edit3,
  Trash2,
  Coins
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppListing } from '../types';

export const MyAppsTab: React.FC = () => {
  const { apps, user, setIsAddAppModalOpen, addToast, tasks, setEditingApp, deleteApp } = useApp();
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [appToDelete, setAppToDelete] = useState<AppListing | null>(null);

  const myApps = apps.filter((a) => a.ownerId === user?.uid);

  // Compute stats across developer's apps
  const totalTestersJoined = myApps.reduce((acc, a) => acc + (a.currentTesters || 0), 0);
  const totalTargetTesters = myApps.reduce((acc, a) => acc + (a.requiredTesters || 20), 0);

  // Get all feedback received for my apps
  const myAppIds = myApps.map((a) => a.id);
  const allFeedbacksForMyApps = tasks
    .filter((t) => myAppIds.includes(t.appId))
    .flatMap((t) => t.feedbacks);

  const toggleExpand = (appId: string) => {
    setExpandedAppId((prev) => (prev === appId ? null : appId));
  };

  const handleExportCSV = (appTitle: string) => {
    const rows = [
      ['Date', 'Tester Name', 'Rating', 'Device Model', 'Android OS', 'Qualitative Feedback', 'Status'],
      ...allFeedbacksForMyApps.map((fb) => [
        new Date(fb.date).toISOString().split('T')[0],
        fb.userName,
        fb.rating.toString(),
        fb.deviceModel,
        fb.androidVersion,
        `"${fb.feedbackText.replace(/"/g, '""')}"`,
        fb.status
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${appTitle.replace(/\s+/g, '_')}_GooglePlay_Testing_Log.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'CSV Exported', 'Google Play closed testing feedback log downloaded.');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Developer Dashboard & Published Apps
            </h2>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {myApps.length} Published
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Monitor your 20-tester progress, review daily tester qualitative bug reports, and export compliance proof logs.
          </p>
        </div>
      </div>

      {/* Metrics Row (Professional Polish 4-Metric Grid) */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
            <span>Testers for Your App</span>
            <Users className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {totalTestersJoined} <span className="text-xs font-normal text-slate-400">/ {totalTargetTesters || 20} joined</span>
          </div>
          <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all" 
              style={{ width: `${Math.min(100, Math.round((totalTestersJoined / (totalTargetTesters || 20)) * 100))}%` }} 
            />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
            <span>Verified Daily Proofs</span>
            <MessageSquare className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {allFeedbacksForMyApps.length} <span className="text-xs font-normal text-slate-400">reviews</span>
          </div>
          <div className="text-[11px] text-emerald-700 font-semibold mt-2">
            Qualitative feedback received
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-1 font-medium">
            <span>Average Tester Rating</span>
            <Star className="h-4 w-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            4.9 <span className="text-xs font-normal text-slate-400">/ 5.0</span>
          </div>
          <div className="text-[11px] text-amber-700 font-semibold mt-2">
            High quality organic reviews
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-indigo-100 bg-indigo-50/40 shadow-xs">
          <div className="flex items-center justify-between text-indigo-700 text-xs mb-1 font-semibold">
            <span>Compliance Status</span>
            <Award className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="text-lg font-bold text-indigo-950 mt-1">
            On Track ⚡
          </div>
          <div className="text-[11px] text-indigo-700 font-medium mt-1">
            Satisfies 14 continuous days
          </div>
        </div>

      </div>

      {/* Published Apps List */}
      {myApps.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-xs">
          <div className="mx-auto h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 mb-3">
            <Layers className="h-6 w-6" />
          </div>
          <h3 className="text-base font-bold text-slate-800">You haven't published any apps yet</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Ready to satisfy Google Play's 20-tester closed testing requirement? Publish your app with your Google Group link and Play Store opt-in URL.
          </p>
          <button
            onClick={() => setIsAddAppModalOpen(true)}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 text-xs font-bold shadow-sm shadow-indigo-200 transition-all active:scale-95"
          >
            <PlusCircle className="h-4 w-4" />
            <span>ADD YOUR APP</span>
          </button>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {myApps.map((app) => {
            const progressPercent = Math.min(100, Math.round((app.currentTesters / app.requiredTesters) * 100));
            const isExpanded = expandedAppId === app.id;
            const appFeedbacks = tasks
              .filter((t) => t.appId === app.id)
              .flatMap((t) => t.feedbacks);

            return (
              <div
                key={app.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 transition-all hover:border-indigo-200 hover:shadow-md shadow-xs"
              >
                {/* Header Row */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center gap-4">
                    <img
                      src={app.iconUrl}
                      alt={app.title}
                      className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-200 bg-slate-100 shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          {app.category}
                        </span>
                        <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold">
                          Active Closed Test
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {app.packageName}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-1">
                        {app.title}
                      </h3>

                      <p className="text-xs text-slate-600 mt-1 line-clamp-1 max-w-xl">
                        {app.description}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
                    <a
                      href={app.groupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 text-xs font-semibold transition-colors shadow-xs"
                    >
                      <span>Google Group</span>
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setEditingApp(app)}
                      className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 text-xs font-bold transition-all shadow-xs active:scale-95"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAppToDelete(app)}
                      className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 px-3 py-1.5 text-xs font-bold transition-all shadow-xs active:scale-95"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>

                {/* Tester Progress Meter */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-slate-600 font-semibold flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5 text-indigo-600" />
                      Tester Acquisition Progress:
                    </span>
                    <span className="text-indigo-700 font-bold">
                      {app.currentTesters} / {app.requiredTesters} Testers Joined ({progressPercent}%)
                    </span>
                  </div>

                  <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all duration-700"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Tester Feedbacks Toggle */}
                <div className="mt-4 pt-3 border-t border-slate-100">
                  <button
                    onClick={() => toggleExpand(app.id)}
                    className="flex items-center justify-between w-full text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5 text-indigo-600" />
                      View Tester Feedback Roster ({appFeedbacks.length} submissions)
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>

                  {/* Expanded Feedbacks */}
                  {isExpanded && (
                    <div className="mt-4 space-y-3">
                      {appFeedbacks.length === 0 ? (
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center text-xs text-slate-500">
                          No tester proof submissions received yet today. Testers submit daily after their 30s session.
                        </div>
                      ) : (
                        appFeedbacks.map((fb) => (
                          <div
                            key={fb.id}
                            className="rounded-xl border border-slate-200 bg-slate-50/70 p-4"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-2">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-slate-800">{fb.userName}</span>
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
                              <span className="text-[11px] text-slate-400">
                                {new Date(fb.date).toLocaleString()}
                              </span>
                            </div>

                            <p className="text-xs text-slate-700 leading-relaxed font-sans">
                              "{fb.feedbackText}"
                            </p>

                            <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                              <div className="flex items-center gap-2">
                                <Smartphone className="h-3 w-3 text-slate-400" />
                                <span>{fb.deviceModel} • {fb.androidVersion}</span>
                              </div>
                              <span className="text-emerald-700 font-bold flex items-center gap-1">
                                <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                Verified Organic Engagement
                              </span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Delete App Confirmation Modal */}
      {appToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 shadow-xs mb-4">
              <Trash2 className="h-7 w-7" />
            </div>

            <h3 className="text-lg font-bold text-center text-slate-900">
              Delete "{appToDelete.title}"?
            </h3>

            <p className="text-xs text-slate-600 text-center mt-2 leading-relaxed">
              Are you sure you want to delete this app from the testing exchange?
            </p>

            {/* Refund info box */}
            <div className="mt-4 rounded-2xl border p-3.5 text-xs text-left bg-slate-50 border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 font-semibold">Active Testers:</span>
                <span className="font-bold text-slate-800">{appToDelete.currentTesters} / {appToDelete.requiredTesters}</span>
              </div>

              {appToDelete.currentTesters === 0 ? (
                <div className="flex items-center gap-2 text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-xs font-bold">
                  <Coins className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span>0 testers joined yet — 100 Coins will be refunded automatically to your balance!</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-amber-800 bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-xs">
                  <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
                  <span>This app has active testers. Deleting it will remove it from Explore immediately.</span>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setAppToDelete(null)}
                className="flex-1 rounded-xl border border-slate-300 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  deleteApp(appToDelete.id);
                  setAppToDelete(null);
                }}
                className="flex-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white py-2.5 text-xs font-bold shadow-sm shadow-rose-200 active:scale-95 transition-all flex items-center justify-center gap-1.5"
              >
                <Trash2 className="h-4 w-4" />
                <span>Confirm Delete</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
