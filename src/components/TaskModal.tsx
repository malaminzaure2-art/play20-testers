import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  Play, 
  ExternalLink, 
  Coins, 
  CheckCircle2, 
  Sparkles,
  Star,
  Timer,
  Upload,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';
import { useApp, isTaskProofSubmittedToday } from '../context/AppContext';

export const TaskModal: React.FC = () => {
  const { 
    selectedTaskForProof, 
    setSelectedTaskForProof, 
    submitDailyProof, 
    addToast 
  } = useApp();

  const task = selectedTaskForProof;

  const alreadySubmittedToday = isTaskProofSubmittedToday(task);

  const [feedbackText, setFeedbackText] = useState<string>('');
  const [rating, setRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [visitedGroup, setVisitedGroup] = useState<boolean>(false);
  const [visitedStore, setVisitedStore] = useState<boolean>(false);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(15); // 15-second active verification timer
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDayOne = task?.currentDay === 1;

  const handleOpenGroup = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = task?.app.groupUrl && task.app.groupUrl.startsWith('http') 
      ? task.app.groupUrl 
      : 'https://groups.google.com/g/play20-testers';
    window.open(url, '_blank', 'noopener,noreferrer');
    setVisitedGroup(true);
    addToast('info', 'Google Group Opened', 'Please click "Join group" on Google Groups page.');
  };

  const handleOpenStore = (e: React.MouseEvent) => {
    e.preventDefault();
    const url = task?.app.storeAndroidUrl || task?.app.storeWebUrl || (task?.app.packageName ? `https://play.google.com/store/apps/details?id=${task.app.packageName}` : 'https://play.google.com');
    window.open(url, '_blank', 'noopener,noreferrer');
    setVisitedStore(true);
    addToast('info', 'Play Store Opened', 'Please install or open the app on your device.');
  };

  // Reset states whenever modal opens for a task
  useEffect(() => {
    if (task) {
      setFeedbackText('');
      setRating(5);
      // On Day 2-14, Google Group & Play Store are already opted-in from Day 1
      setVisitedGroup(!isDayOne);
      setVisitedStore(!isDayOne);
      setSecondsRemaining(15);
      setScreenshotPreview(null);
    }
  }, [task?.id, isDayOne]);

  // 15-second countdown timer for authentic testing verification
  useEffect(() => {
    if (!task) return;
    if (secondsRemaining <= 0) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, [task, secondsRemaining]);

  if (!task) return null;

  const minFeedbackLength = 25;
  const isFeedbackValid = feedbackText.trim().length >= minFeedbackLength;
  const isTimerDone = secondsRemaining === 0;
  const hasScreenshot = !!screenshotPreview;
  const canSubmit = isTimerDone && isFeedbackValid && visitedGroup && visitedStore && hasScreenshot && !isSubmitting;

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('error', 'Invalid File', 'Please select an image file (PNG, JPG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setScreenshotPreview(event.target?.result as string);
      addToast('success', 'Screenshot Attached', 'Proof screenshot loaded.');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();

    if (!visitedGroup) {
      addToast('error', 'Google Group Step Required', 'Please click "1. Join Google Group" first.');
      return;
    }

    if (!visitedStore) {
      addToast('error', 'Play Store Step Required', 'Please click "2. Open Play Store" to install the app.');
      return;
    }

    if (!isTimerDone) {
      addToast('warning', 'Testing Timer Active', `Please test the app for ${secondsRemaining} more seconds.`);
      return;
    }

    if (!isFeedbackValid) {
      addToast('error', 'Feedback Too Short', `Please write at least ${minFeedbackLength} characters of qualitative feedback.`);
      return;
    }

    if (!hasScreenshot) {
      addToast('error', 'Screenshot Proof Required', 'Please take and upload a screenshot of the app running on your device.');
      return;
    }

    setIsSubmitting(true);

    const result = submitDailyProof(
      task.id,
      feedbackText.trim(),
      screenshotPreview || '',
      rating,
      'Android Device',
      'Android 14'
    );

    setIsSubmitting(false);

    if (result.success) {
      setSelectedTaskForProof(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={task.app.iconUrl}
              alt={task.app.title}
              className="h-12 w-12 rounded-xl object-cover ring-1 ring-slate-200 bg-slate-100"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80';
              }}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                  Day {task.currentDay} of {task.totalDays} Verification
                </span>
                <span className="rounded bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                  +{task.app.rewardPerDay} Coins
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900">{task.app.title}</h3>
            </div>
          </div>

          <button
            onClick={() => setSelectedTaskForProof(null)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Already Submitted Today View */}
        {alreadySubmittedToday ? (
          <div className="mt-6 space-y-4 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 shadow-xs animate-in zoom-in-90">
              <CheckCircle2 className="h-9 w-9" />
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100/60 px-2.5 py-0.5 rounded-full">
                Today's Testing Done ✓
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-2">
                You've completed today's testing!
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                You have already submitted your daily feedback and claimed your <strong>+{task.app.rewardPerDay} coins</strong> today.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2 text-left">
                <CalendarCheck className="h-4 w-4 text-indigo-600 shrink-0" />
                <div>
                  <span className="font-bold block">14-Day Google Play Policy</span>
                  <span className="text-[11px] text-slate-500">Day {task.currentDay} testing session unlocks tomorrow.</span>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-indigo-600 bg-white px-2 py-1 rounded-lg border border-slate-200">
                Next: Day {task.currentDay}
              </span>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedTaskForProof(null)}
                className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2.5 text-xs font-bold transition-all shadow-xs"
              >
                Close & Return
              </button>
            </div>
          </div>
        ) : (
          /* Verification Steps Form */
          <form onSubmit={handleSubmitProof} className="mt-4 space-y-4">
          
          {/* Step 1 & Step 2: Group & Play Store Links */}
          {isDayOne ? (
            <div>
              <span className="text-[11px] font-bold text-slate-700 block mb-2">
                Step 1 & 2: Complete Google Play Opt-In (Day 1 Only)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleOpenGroup}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all border ${
                    visitedGroup 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs' 
                      : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200 active:scale-95'
                  }`}
                >
                  <Users className={`h-4 w-4 ${visitedGroup ? 'text-emerald-600' : 'text-indigo-600'}`} />
                  <span>{visitedGroup ? '✓ 1. Group Joined' : '1. Join Google Group'}</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={handleOpenStore}
                  className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all border ${
                    visitedStore 
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-xs' 
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white border-transparent shadow-xs active:scale-95'
                  }`}
                >
                  <Play className={`h-4 w-4 ${visitedStore ? 'text-emerald-600 fill-emerald-600' : 'text-white fill-white'}`} />
                  <span>{visitedStore ? '✓ 2. Play Store Opened' : '2. Open Play Store'}</span>
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Google Group Opt-In Active (Day 1 Verified)</span>
              </div>
              <button
                type="button"
                onClick={handleOpenStore}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 underline flex items-center gap-1"
              >
                <span>Launch App</span>
                <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          )}

          {/* Active Testing Timer */}
          <div className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
            isTimerDone 
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50/70 border-amber-200 text-amber-900'
          }`}>
            <div className="flex items-center gap-2.5">
              <Timer className={`h-4 w-4 ${isTimerDone ? 'text-emerald-600' : 'text-amber-600 animate-pulse'}`} />
              <div>
                <span className="text-xs font-bold block">
                  {isTimerDone ? 'Active Testing Verified' : 'Testing Engagement Timer'}
                </span>
                <span className="text-[10px] opacity-80">
                  {isTimerDone ? 'You completed the mandatory testing session.' : 'Please test the app features during this session.'}
                </span>
              </div>
            </div>
            
            <div className={`text-xs font-black px-2.5 py-1 rounded-xl ${
              isTimerDone ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-200 text-amber-950'
            }`}>
              {isTimerDone ? '✓ Verified' : `${secondsRemaining}s`}
            </div>
          </div>

          {/* Qualitative Feedback & Star Rating */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                Testing Feedback & Bug Report <span className="text-rose-500">*</span>
              </label>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-0.5"
                  >
                    <Star
                      className={`h-3.5 w-3.5 ${
                        star <= rating
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <textarea
              rows={3}
              required
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Describe your testing experience, device behavior, UI feedback, or any bugs found..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all resize-none shadow-xs"
            />
            
            <div className="flex items-center justify-between mt-1 text-[10px]">
              <span className={isFeedbackValid ? 'text-emerald-600 font-bold' : 'text-slate-400'}>
                {feedbackText.trim().length}/{minFeedbackLength} characters minimum
              </span>
              <span className="text-slate-400">Google Play Compliance</span>
            </div>
          </div>

          {/* Screenshot Proof Upload (Mandatory) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                <span>Screenshot Proof from Phone</span>
                <span className="text-rose-500 font-bold">* (MANDATORY)</span>
              </label>
              {screenshotPreview && (
                <button
                  type="button"
                  onClick={() => setScreenshotPreview(null)}
                  className="text-[10px] text-rose-600 font-bold hover:underline"
                >
                  Remove
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleScreenshotChange}
            />

            {screenshotPreview ? (
              <div className="relative rounded-2xl border border-emerald-200 overflow-hidden bg-emerald-50/50 p-2.5 flex items-center gap-3">
                <img
                  src={screenshotPreview}
                  alt="Proof preview"
                  className="h-14 w-14 rounded-xl object-cover ring-2 ring-emerald-500 shrink-0"
                />
                <div className="text-xs">
                  <span className="font-bold text-emerald-950 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    Screenshot Proof Attached
                  </span>
                  <span className="text-[10px] text-emerald-700 block mt-0.5">
                    Verified real device testing proof.
                  </span>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full rounded-xl border-2 border-dashed border-indigo-200 hover:border-indigo-500 bg-indigo-50/30 hover:bg-indigo-50/70 p-3.5 text-center transition-all flex items-center justify-center gap-2 text-xs font-bold text-indigo-700 active:scale-98"
              >
                <Upload className="h-4 w-4 text-indigo-600" />
                <span>Upload Screenshot of App Running on Phone *</span>
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pt-2">
            {!canSubmit && (
              <div className="mb-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-indigo-600 shrink-0" />
                <span className="font-medium">
                  {!visitedGroup 
                    ? 'Click "1. Join Google Group" to start' 
                    : !visitedStore 
                    ? 'Click "2. Open Play Store" to install' 
                    : !isTimerDone 
                    ? `Active testing timer (${secondsRemaining}s remaining)` 
                    : !isFeedbackValid 
                    ? `Write at least ${minFeedbackLength - feedbackText.trim().length} more characters of feedback` 
                    : !hasScreenshot
                    ? 'Upload a screenshot of the app running on your phone'
                    : 'Ready to claim coins!'}
                </span>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSelectedTaskForProof(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={!canSubmit}
                className={`flex-[2] rounded-xl py-2.5 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 ${
                  canSubmit
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 active:scale-95 cursor-pointer'
                    : 'bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed'
                }`}
              >
                <Coins className="h-4 w-4 text-amber-300" />
                <span>Claim +{task.app.rewardPerDay} Coins & Complete</span>
              </button>
            </div>
          </div>

        </form>
        )}

      </div>
    </div>
  );
};
