import React from 'react';
import { 
  Search, 
  Coins, 
  Users, 
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ExploreAppsTab: React.FC = () => {
  const { 
    apps, 
    tasks, 
    user, 
    joinAppTest, 
    setSelectedTaskForProof, 
    searchQuery,
    setSearchQuery
  } = useApp();

  const filteredApps = apps.filter((app) => {
    return (
      app.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.packageName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const isUserTestingApp = (appId: string) => {
    return tasks.find((t) => t.appId === appId && t.userId === user?.uid);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Simple Clean Search Bar Only */}
      <div className="pb-5 border-b border-slate-200">
        <div className="relative max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="search-apps-input"
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all shadow-xs"
          />
        </div>
      </div>

      {/* Apps Grid */}
      {filteredApps.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-xs">
          <p className="text-sm font-semibold text-slate-800">No apps found</p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-2 text-xs text-indigo-600 font-bold underline hover:text-indigo-700"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredApps.map((app) => {
            const existingTask = isUserTestingApp(app.id);
            const isOwner = user?.uid === app.ownerId;
            const progressPercent = Math.min(100, Math.round((app.currentTesters / app.requiredTesters) * 100));
            const slotsLeft = Math.max(0, app.requiredTesters - app.currentTesters);

            return (
              <div
                key={app.id}
                className="group flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 hover:border-indigo-300 hover:shadow-md transition-all duration-200 shadow-xs"
              >
                <div>
                  {/* Top Row: Icon + Title + Reward */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={app.iconUrl}
                        alt={app.title}
                        className="h-11 w-11 rounded-xl object-cover ring-1 ring-slate-200 bg-slate-100"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80';
                        }}
                      />
                      <div>
                        <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">
                          {app.category}
                        </span>
                        <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                          {app.title}
                        </h3>
                      </div>
                    </div>

                    {/* Reward Badge */}
                    <div className="flex items-center gap-1 rounded-lg bg-emerald-50 border border-emerald-200 px-2 py-1 text-xs font-bold text-emerald-800 shrink-0">
                      <Coins className="h-3.5 w-3.5 text-emerald-600" />
                      <span>+{app.rewardPerDay} Coins/day</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="mt-2.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {app.description}
                  </p>

                  {/* Testers Progress */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500 font-medium flex items-center gap-1">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        Testers: <strong className="text-slate-800">{app.currentTesters}/{app.requiredTesters}</strong>
                      </span>
                      <span className={`font-semibold text-[11px] ${slotsLeft <= 3 ? 'text-amber-700' : 'text-emerald-700'}`}>
                        {slotsLeft > 0 ? `${slotsLeft} slots left` : 'Full'}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-4 pt-2">
                  {isOwner ? (
                    <div className="w-full text-center rounded-xl bg-slate-100 border border-slate-200 py-2 text-xs font-semibold text-slate-600">
                      Your App
                    </div>
                  ) : existingTask ? (
                    <button
                      onClick={() => setSelectedTaskForProof(existingTask)}
                      className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 py-2 text-xs font-bold transition-all shadow-xs"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-indigo-600" />
                      <span>Testing Active (Day {existingTask.currentDay}/14)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => joinAppTest(app)}
                      disabled={slotsLeft === 0}
                      className={`w-full py-2 rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5 ${
                        slotsLeft === 0
                          ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                          : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 active:scale-95'
                      }`}
                    >
                      <span>Join & Test App</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
