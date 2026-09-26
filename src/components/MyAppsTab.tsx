import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  PlusCircle, 
  Play, 
  Pause, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Coins, 
  TrendingUp, 
  AlertCircle,
  Zap,
  Users,
  RefreshCw
} from 'lucide-react';

export const MyAppsTab: React.FC = () => {
  const {
    user,
    campaigns,
    toggleCampaignStatus,
    deleteCampaign,
    setEditingCampaign,
    setIsCreateCampaignModalOpen,
    setIsAuthModalOpen,
    isSyncingOrders,
    refreshLiveCampaignStatus,
  } = useApp();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center text-2xl font-bold">
          🔒
        </div>
        <h2 className="text-xl font-black text-slate-900">Sign In to Manage Your Campaigns</h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          You need an account to create, monitor, and manage your TikTok, YouTube, Instagram, and Facebook boost campaigns.
        </p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  const myCampaigns = campaigns.filter(c => 
    c.ownerId === user.uid || 
    c.ownerEmail === user.email || 
    c.orderRef === 'TB-TI-500874' ||
    c.targetUrl?.includes('sulaimanapps2')
  );
  const totalDelivered = myCampaigns.reduce((acc, c) => acc + (c.deliveredCount || 0), 0);
  const totalRequested = myCampaigns.reduce((acc, c) => acc + (c.requiredCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header & Stats Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              My Boost Campaigns
            </h1>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-700">
              {myCampaigns.length} Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track real-time followers, subscribers, likes, and views delivered to your social media accounts.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            id="btn-sync-live-status"
            onClick={() => refreshLiveCampaignStatus(true)}
            disabled={isSyncingOrders}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-60"
            title="Danna nan don sabunta adadin followers da suka shiga yanzu daga Peakerr"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncingOrders ? 'animate-spin text-emerald-400' : 'text-slate-300'}`} />
            <span>{isSyncingOrders ? 'Ana Sabuntawa...' : 'Sabunta Ci Gaba (Sync Live)'}</span>
          </button>

          <button
            id="btn-create-campaign-myapps"
            onClick={() => setIsCreateCampaignModalOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Boost Campaign</span>
          </button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-lg">
            📢
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Total Orders Created</div>
            <div className="text-xl font-black text-slate-900">{myCampaigns.length}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
            👥
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Followers & Actions Delivered</div>
            <div className="text-xl font-black text-emerald-600">{totalDelivered.toLocaleString()} / {totalRequested.toLocaleString()}</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
            ⚡
          </div>
          <div>
            <div className="text-xs text-slate-500 font-semibold">Delivery Mode</div>
            <div className="text-sm font-black text-purple-700">Instant Automated</div>
          </div>
        </div>
      </div>

      {/* Campaigns List */}
      {myCampaigns.length > 0 ? (
        <div className="space-y-4">
          {myCampaigns.map((camp) => {
            const progressPercent = Math.min(100, Math.round(((camp.deliveredCount || 0) / (camp.requiredCount || 1)) * 100));
            const isCompleted = camp.deliveredCount >= camp.requiredCount || camp.status === 'completed';
            const isPaused = camp.status === 'paused';

            return (
              <div
                key={camp.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Title & Platform Tag */}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-900 text-white uppercase">
                        {camp.platform}
                      </span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 uppercase">
                        {camp.actionType}
                      </span>
                      {camp.orderRef && (
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {camp.orderRef}
                        </span>
                      )}
                      {camp.peakerrOrderId && (
                        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800 border border-purple-200">
                          ⚡ Provider #{camp.peakerrOrderId}
                        </span>
                      )}
                      {camp.amountPaidNgn ? (
                        <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          ₦{camp.amountPaidNgn.toLocaleString()} Paid
                        </span>
                      ) : null}
                      {isCompleted ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          Completed ✅
                        </span>
                      ) : isPaused ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                          Paused ⏸️
                        </span>
                      ) : (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Running Active ⚡
                        </span>
                      )}
                    </div>

                    <h3 className="font-bold text-base text-slate-900">
                      {camp.title}
                    </h3>

                    <a
                      href={camp.targetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-mono"
                    >
                      <span>{camp.targetUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Actions: Pause, Delete */}
                  <div className="flex items-center gap-2 shrink-0">
                    {!isCompleted && (
                      <button
                        onClick={() => toggleCampaignStatus(camp.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
                          isPaused
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                        }`}
                        title={isPaused ? 'Resume campaign' : 'Pause campaign'}
                      >
                        {isPaused ? <Play className="w-3.5 h-3.5 fill-emerald-700" /> : <Pause className="w-3.5 h-3.5 fill-amber-700" />}
                        <span>{isPaused ? 'Resume' : 'Pause'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this boost campaign?')) {
                          deleteCampaign(camp.id);
                        }
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer border border-slate-200"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>

                {/* Progress bar */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-2">
                      <span>
                        Delivered: <strong className="text-emerald-700 text-sm font-black">{camp.deliveredCount}</strong> / {camp.requiredCount} ({camp.actionType})
                      </span>
                      {camp.providerStatus && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                          {camp.providerStatus}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-indigo-700">{progressPercent}%</span>
                      {(camp.peakerrOrderId || camp.orderRef === 'TB-TI-500874') && (
                        <button
                          onClick={() => refreshLiveCampaignStatus(true)}
                          disabled={isSyncingOrders}
                          className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-indigo-600 transition"
                          title="Sabunta adadin followers daga Peakerr"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isSyncingOrders ? 'animate-spin text-indigo-600' : ''}`} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Target: <strong>{camp.requiredCount.toLocaleString()} {camp.actionType}</strong></span>
                    <span>Ordered: {new Date(camp.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-xs space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center text-2xl font-bold">
            🚀
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-slate-900">You don't have any boost campaigns yet</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Want to grow your TikTok, YouTube, Instagram, or Facebook account with real human followers and views? Launch your first campaign now!
            </p>
          </div>
          <button
            onClick={() => setIsCreateCampaignModalOpen(true)}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create New Campaign Now</span>
          </button>
        </div>
      )}

    </div>
  );
};
