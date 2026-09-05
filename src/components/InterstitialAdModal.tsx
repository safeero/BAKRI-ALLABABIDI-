import React, { useState, useEffect } from 'react';
import { X, ExternalLink, ShieldCheck, Megaphone } from 'lucide-react';
import { recordAdImpression, recordAdClick } from '../utils/storage';
import { CustomAdItem } from '../types';

interface InterstitialAdModalProps {
  isOpen: boolean;
  onClose: () => void;
  adUnitId?: string;
  customAd?: CustomAdItem;
}

export const InterstitialAdModal: React.FC<InterstitialAdModalProps> = ({
  isOpen,
  onClose,
  adUnitId = 'ca-app-pub-3940256099942544/1033173712',
  customAd,
}) => {
  const [countdown, setCountdown] = useState(5);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(5);
      setCanClose(false);
      return;
    }

    recordAdImpression();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const title = customAd?.title || 'منصة Google Cloud AI للأجهزة الذكية';
  const desc = customAd?.desc || 'قم بنشر تطبيقاتك الذكية على منصة سحابية موثوقة مع أمان عالي ودعم فني على مدار الساعة.';
  const sponsor = customAd?.sponsor || 'Google AdMob Sponsored';
  const cta = customAd?.cta || 'زيارة موقع المعلن';
  const targetUrl = customAd?.targetUrl;

  const handleAction = () => {
    recordAdClick();
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden flex flex-col relative text-slate-100">
        {/* Top bar with AdMob indicator & countdown or close */}
        <div className="p-3 bg-slate-950 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded">
              Ad • إعلان بيني
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{adUnitId.slice(0, 16)}...</span>
          </div>

          <div>
            {canClose ? (
              <button
                onClick={onClose}
                className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-2.5 py-1 rounded-full border border-slate-600 transition"
              >
                <span>إغلاق الإعلان</span>
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="text-xs bg-slate-800 text-amber-400 font-bold px-2 py-1 rounded-full font-mono">
                يمكن التخطي خلال {countdown} ثوانٍ
              </span>
            )}
          </div>
        </div>

        {/* Sponsor visual creative */}
        <div className="relative h-64 bg-gradient-to-br from-indigo-900/60 via-purple-900/40 to-slate-900 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center mb-3 shadow-inner">
            {customAd ? <Megaphone className="w-8 h-8 text-amber-400" /> : <ShieldCheck className="w-8 h-8 text-indigo-300" />}
          </div>
          <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase mb-1">
            {sponsor}
          </span>
          <h3 className="text-base font-bold text-white mb-2 leading-snug">
            {title}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed max-w-xs">
            {desc}
          </p>
        </div>

        {/* Action button */}
        <div className="p-4 bg-slate-950 flex flex-col gap-2">
          <button
            onClick={handleAction}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition active:scale-[0.98]"
          >
            <span>{cta}</span>
            <ExternalLink className="w-4 h-4" />
          </button>
          <div className="text-center">
            <span className="text-[10px] text-slate-500">
              يمكنك إدارة وتغيير هذا الإعلان من تبويب "الإعلانات" في شريط التطبيق السفلي.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
