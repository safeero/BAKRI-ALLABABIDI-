import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, CheckCircle2, Play, Volume2, VolumeX } from 'lucide-react';
import { recordAdImpression, recordAdClick } from '../utils/storage';

interface RewardedAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRewardGranted: () => void;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  isOpen,
  onClose,
  onRewardGranted,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(8);
  const [completed, setCompleted] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setSecondsLeft(8);
      setCompleted(false);
      return;
    }

    recordAdImpression();

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCompleted(true);
          onRewardGranted();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onRewardGranted]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col relative text-slate-100">
        {/* Top Header */}
        <div className="p-3 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded flex items-center gap-1">
              <Gift className="w-3 h-3" />
              Rewarded Ad • إعلان بمكافأة
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 rounded-full bg-slate-800 text-slate-300 hover:text-white"
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <span className="text-xs font-mono font-bold bg-slate-800 px-2 py-0.5 rounded-full text-emerald-400">
              {completed ? 'اكتملت المكافأة!' : `${secondsLeft}s`}
            </span>
          </div>
        </div>

        {/* Video Simulation */}
        <div className="relative h-64 bg-slate-950 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-indigo-950/20 to-transparent" />
          
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mb-3 animate-pulse">
              <Play className="w-7 h-7 text-emerald-400 fill-emerald-400/30 mr-0.5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">
              سرعة فائقة ومعالجة توربو 4K الفورية
            </h3>
            <p className="text-xs text-slate-400 max-w-xs">
              شاهد هذا المقطع القصير للحصول على معالجة ذات أولوية فائقة لجميع الفيديوهات والصور مجاناً!
            </p>
          </div>

          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-slate-800">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-indigo-500 transition-all duration-1000 ease-linear"
              style={{ width: `${((8 - secondsLeft) / 8) * 100}%` }}
            />
          </div>
        </div>

        {/* Reward Status */}
        <div className="p-4 bg-slate-950 flex flex-col gap-2">
          {completed ? (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-center gap-2 text-emerald-400 text-sm font-bold bg-emerald-500/10 py-2 rounded-xl border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
                <span>تم منحك رصيد الأولوية السريعة 4K بنجاح!</span>
              </div>
              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition"
              >
                متابعة في التطبيق
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between text-xs text-slate-400 py-2">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
                <span>جاري إكمال المشاهدة لمنح المكافأة...</span>
              </span>
              <button
                onClick={() => {
                  recordAdClick();
                  alert('تم تسجيل التفاعل مع الإعلان');
                }}
                className="text-indigo-400 hover:underline font-semibold"
              >
                تفاصيل العرض
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
