import React, { useState, useEffect } from 'react';
import { ExternalLink, X, Info } from 'lucide-react';
import { AdMobSettings } from '../types';
import { recordAdImpression, recordAdClick } from '../utils/storage';

interface AdBannerProps {
  settings: AdMobSettings;
  onOpenSettings?: () => void;
}

const SAMPLE_ADS = [
  {
    title: 'Samsung Galaxy S25 Ultra مع مزايا Galaxy AI',
    desc: 'احصل على أقوى هاتف ذكاء اصطناعي الآن مع عروض حصرية.',
    sponsor: 'Samsung Official',
    cta: 'اكتشف المزيد',
    color: 'from-blue-950/80 to-slate-900',
  },
  {
    title: 'Google Cloud Platform للمطورين',
    desc: 'ابدأ مجاناً مع رصيد 300$ لتشغيل نماذج الذكاء الاصطناعي السحابية.',
    sponsor: 'Google Cloud',
    cta: 'ابدأ مجاناً',
    color: 'from-indigo-950/80 to-slate-900',
  },
  {
    title: 'أسرع إنترنت ألياف بصرية 5G فائق السرعة',
    desc: 'تحميل فيديوهات وصور الذكاء الاصطناعي في ثوانٍ معدودة.',
    sponsor: 'Telecom 5G Fiber',
    cta: 'اشترك الآن',
    color: 'from-emerald-950/80 to-slate-900',
  },
];

export const AdBanner: React.FC<AdBannerProps> = ({ settings, onOpenSettings }) => {
  const [adIndex, setAdIndex] = useState(0);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (settings.enabled && !isDismissed) {
      recordAdImpression();
    }
  }, [settings.enabled, isDismissed]);

  if (!settings.enabled || !settings.showBannerOnPages || isDismissed) {
    return null;
  }

  const activeCustomAds = (settings.customAds || []).filter((a) => a.active);
  const adsPool = activeCustomAds.length > 0
    ? activeCustomAds.map((ca) => ({
        title: ca.title,
        desc: ca.desc,
        sponsor: ca.sponsor || 'إعلان مخصص',
        cta: ca.cta || 'زيارة الرابط',
        targetUrl: ca.targetUrl,
        color: 'from-indigo-950/90 to-slate-900',
      }))
    : SAMPLE_ADS.map((sa) => ({ ...sa, targetUrl: '' }));

  const ad = adsPool[adIndex % adsPool.length] || adsPool[0];

  const handleClick = () => {
    recordAdClick();
    if (ad.targetUrl) {
      window.open(ad.targetUrl, '_blank', 'noopener,noreferrer');
    }
    // Rotate to next ad
    setAdIndex((prev) => (prev + 1) % adsPool.length);
  };

  return (
    <aside aria-label="إعلان مدمج" className="w-full px-3 py-1.5 shrink-0 select-none">
      <div
        className={`w-full max-w-lg mx-auto rounded-xl border border-indigo-500/20 bg-gradient-to-r ${ad.color} p-2.5 shadow-lg flex items-center justify-between gap-2 relative overflow-hidden`}
      >
        {/* Ad Tag */}
        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="bg-amber-400/90 text-slate-950 text-[9px] font-black px-1.5 py-0.2 rounded uppercase tracking-wider">
              Ad • إعلان
            </span>
            <span className="text-[10px] text-slate-400 truncate">{ad.sponsor}</span>
            {settings.testMode && (
              <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded border border-slate-700">
                Test Mode
              </span>
            )}
          </div>
          <h4 className="text-xs font-bold text-slate-100 truncate mt-0.5">{ad.title}</h4>
          <p className="text-[11px] text-slate-300 truncate">{ad.desc}</p>
        </div>

        {/* CTA Button & Close */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleClick}
            className="flex items-center gap-1 text-[11px] font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg shadow-sm transition active:scale-95 whitespace-nowrap"
          >
            <span>{ad.cta}</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setIsDismissed(true)}
              title="إغلاق الإعلان مؤقتاً"
              className="text-slate-400 hover:text-slate-200 p-1 rounded-full hover:bg-slate-800/80 transition"
            >
              <X className="w-3 h-3" />
            </button>
            {onOpenSettings && (
              <button
                onClick={onOpenSettings}
                title="إعدادات AdMob"
                className="text-slate-500 hover:text-indigo-300 p-1 rounded-full hover:bg-slate-800/80 transition"
              >
                <Info className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
