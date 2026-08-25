import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  Zap,
  ThumbsUp,
  UserPlus,
  PlaySquare,
  Eye,
  Send,
  MessageSquare
} from 'lucide-react';

export const TaskModal: React.FC = () => {
  const {
    selectedCampaignForTask,
    setSelectedCampaignForTask,
    executeBoostTask,
    user,
  } = useApp();

  const [hasOpenedLink, setHasOpenedLink] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset state when a new campaign is selected
  useEffect(() => {
    if (selectedCampaignForTask) {
      setHasOpenedLink(false);
      setSecondsRemaining(selectedCampaignForTask.minDurationSeconds || 10);
      setIsTimerRunning(false);
      setIsSubmitting(false);
    }
  }, [selectedCampaignForTask]);

  // Countdown timer effect
  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, secondsRemaining]);

  if (!selectedCampaignForTask) return null;

  const camp = selectedCampaignForTask;

  const handleOpenLink = () => {
    setHasOpenedLink(true);
    setIsTimerRunning(true);
    setSecondsRemaining(camp.minDurationSeconds || 10);
    window.open(camp.targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleClaim = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const res = executeBoostTask(camp);
      if (res.success) {
        setSelectedCampaignForTask(null);
      }
      setIsSubmitting(false);
    }, 400);
  };

  const totalDuration = camp.minDurationSeconds || 10;
  const progressPercent = Math.round(((totalDuration - secondsRemaining) / totalDuration) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200/80 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-xs">
              <Zap className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900 leading-tight">
                Complete Boost Task
              </h3>
              <p className="text-xs text-slate-500">
                {camp.platform.toUpperCase()} • Earn +{camp.rewardPerAction} Coins
              </p>
            </div>
          </div>

          <button
            onClick={() => setSelectedCampaignForTask(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          
          {/* Campaign Details Box */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-100 text-indigo-800 uppercase">
                {camp.actionType} on {camp.platform}
              </span>
              <span className="text-xs font-black text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-lg">
                🪙 +{camp.rewardPerAction} Coins
              </span>
            </div>

            <h4 className="font-bold text-sm text-slate-900 leading-snug">
              {camp.title}
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed">
              {camp.description}
            </p>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="space-y-3">
            <h5 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
              How to complete this task in 3 simple steps:
            </h5>

            <div className="space-y-2.5">
              
              {/* Step 1 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-xs text-slate-700">
                  <strong>Click 'Open Link':</strong> This will open the target {camp.platform.toUpperCase()} profile or video in a new tab/app.
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                <div className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-xs text-slate-700">
                  <strong>Perform the required action:</strong> Tap <strong>{camp.actionType.toUpperCase()}</strong> or watch the content for the required duration.
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                <div className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </div>
                <div className="text-xs text-slate-700">
                  <strong>Return here & claim:</strong> Once the verification timer completes, click 'Verify & Claim Coins'.
                </div>
              </div>

            </div>
          </div>

          {/* Action Trigger Area */}
          <div className="space-y-3 pt-2">
            
            {/* Step 1 Button: Open Link */}
            {!hasOpenedLink ? (
              <button
                id="btn-open-task-link"
                onClick={handleOpenLink}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm rounded-2xl shadow-md shadow-indigo-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>1. Open {camp.platform.toUpperCase()} Link</span>
              </button>
            ) : (
              /* Step 2: Verification Timer & Claim */
              <div className="space-y-3">
                
                {/* Timer Bar */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="text-slate-600 flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-600" />
                      {secondsRemaining > 0 ? 'Verifying action duration...' : 'Verification Completed!'}
                    </span>
                    <span className={secondsRemaining > 0 ? 'text-indigo-600 font-mono font-black text-sm' : 'text-emerald-600 font-bold'}>
                      {secondsRemaining > 0 ? `${secondsRemaining}s` : 'Ready! ✅'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 rounded-full ${
                        secondsRemaining === 0 ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>

                  <div className="text-[11px] text-slate-500 text-center">
                    {secondsRemaining > 0 
                      ? 'Please wait for the timer to finish before claiming your reward coins.' 
                      : 'Verification complete! Tap the button below to credit your coins.'}
                  </div>
                </div>

                {/* Claim Button */}
                <button
                  id="btn-claim-task-reward"
                  disabled={secondsRemaining > 0 || isSubmitting}
                  onClick={handleClaim}
                  className={`w-full py-3.5 rounded-2xl font-black text-sm transition flex items-center justify-center gap-2 shadow-lg ${
                    secondsRemaining === 0
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-emerald-500/25 cursor-pointer animate-pulse'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  <Sparkles className="w-5 h-5 text-amber-300" />
                  <span>
                    {isSubmitting ? 'Crediting Coins...' : `2. Verify & Claim +${camp.rewardPerAction} Coins Now!`}
                  </span>
                </button>

                {/* Re-open Link if needed */}
                <div className="text-center">
                  <button
                    onClick={handleOpenLink}
                    className="text-xs text-indigo-600 hover:underline font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Re-open link if it did not open automatically</span>
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
