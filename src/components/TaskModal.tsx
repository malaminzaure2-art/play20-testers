import React, { useState } from 'react';
import { 
  Users, 
  Play, 
  ExternalLink, 
  Coins, 
  CheckCircle2, 
  Sparkles,
  Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const TaskModal: React.FC = () => {
  const { 
    selectedTaskForProof, 
    setSelectedTaskForProof, 
    submitDailyProof, 
    addToast 
  } = useApp();

  const task = selectedTaskForProof;

  const [feedbackText, setFeedbackText] = useState<string>('App tested successfully. Good performance and smooth navigation.');
  const [rating, setRating] = useState<number>(5);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!task) return null;

  const handleSubmitProof = (e: React.FormEvent) => {
    e.preventDefault();

    if (!feedbackText.trim()) {
      addToast('error', 'Missing Feedback', 'Please write a brief feedback.');
      return;
    }

    setIsSubmitting(true);

    const result = submitDailyProof(
      task.id,
      feedbackText.trim(),
      'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=500&auto=format&fit=crop&q=80',
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
      <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 sm:p-7 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <img
              src={task.app.iconUrl}
              alt={task.app.title}
              className="h-12 w-12 rounded-xl object-cover ring-1 ring-slate-200 bg-slate-100"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                  Day {task.currentDay} of {task.totalDays}
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

        {/* Action Form */}
        <form onSubmit={handleSubmitProof} className="mt-5 space-y-4">
          
          {/* Quick Links: Group & Play Store */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href={task.app.groupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2.5 px-3 text-xs font-bold text-slate-800 transition-colors shadow-xs"
            >
              <Users className="h-4 w-4 text-indigo-600" />
              <span>1. Join Google Group</span>
              <ExternalLink className="h-3 w-3 text-slate-400" />
            </a>

            <a
              href={task.app.storeAndroidUrl || task.app.storeWebUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 py-2.5 px-3 text-xs font-bold text-indigo-800 transition-colors shadow-xs"
            >
              <Play className="h-4 w-4 fill-indigo-700 text-indigo-700" />
              <span>2. Open Play Store</span>
              <ExternalLink className="h-3 w-3 text-indigo-400" />
            </a>
          </div>

          {/* Feedback & Star Rating */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                Testing Feedback
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
              placeholder="Write your feedback after testing the app..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all resize-none shadow-xs"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setSelectedTaskForProof(null)}
              className="flex-1 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 active:scale-95 shadow-indigo-100"
            >
              <Coins className="h-4 w-4 text-amber-300" />
              <span>Claim +{task.app.rewardPerDay} Coins & Complete</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
