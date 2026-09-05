import React from 'react';
import {
  Sparkles,
  Image as ImageIcon,
  Video,
  Music2,
  Gift,
  Zap,
  Flame,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import { TabType } from '../types';

interface HomeFeedProps {
  onNavigate: (tab: TabType) => void;
  onOpenRewardedAd: () => void;
  hasTurboBonus: boolean;
}

const INSPIRATION_PROMPTS = [
  {
    type: 'image' as const,
    title: 'صقر ملكي بدقة 4K',
    desc: 'صقر عربي على كثيب رملي عند الغروب الذهبي بتفاصيل واقعية خارقة',
    tab: 'images' as TabType,
    badge: 'تصميم صور',
    color: 'from-amber-500/20 to-orange-500/10 text-amber-300 border-amber-500/30',
  },
  {
    type: 'video' as const,
    title: 'لقطة درون سينمائية 8K',
    desc: 'طيران سينمائي سلس فوق مدينة مستقبلية مع إضاءة شفقية وانعكاسات زجاجية',
    tab: 'videos' as TabType,
    badge: 'تصميم فيديو',
    color: 'from-indigo-500/20 to-blue-500/10 text-indigo-300 border-indigo-500/30',
  },
  {
    type: 'music' as const,
    title: 'أغنية طربية حماسية بالعود',
    desc: 'مزيج طربي عريق مع إيقاع حديث وبيانو ملهم ومقام الحجاز العذب',
    tab: 'music' as TabType,
    badge: 'تأليف أغنية',
    color: 'from-purple-500/20 to-pink-500/10 text-purple-300 border-purple-500/30',
  },
];

export const HomeFeed: React.FC<HomeFeedProps> = ({
  onNavigate,
  onOpenRewardedAd,
  hasTurboBonus,
}) => {
  return (
    <div className="flex flex-col gap-5 p-4 pb-20 w-full max-w-lg mx-auto animate-in fade-in duration-200">
      {/* Hero Welcome Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/60 via-slate-900 to-slate-950 p-5 border border-indigo-500/30 shadow-xl">
        <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>مجاني بالكامل 100%</span>
            </span>
            {hasTurboBonus ? (
              <span className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>وضع التوربو السريع مفعل</span>
              </span>
            ) : (
              <button
                onClick={onOpenRewardedAd}
                className="flex items-center gap-1 text-[11px] font-semibold px-2 py-1 rounded-full bg-slate-800/80 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 transition active:scale-95"
              >
                <Gift className="w-3 h-3 text-amber-400" />
                <span>مكافأة السرعة</span>
              </button>
            )}
          </div>

          <h1 className="text-xl font-black text-white leading-snug">
            استوديو الذكاء الاصطناعي للأندرويد
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            صمم صوراً فائقة الدقة 4K، فيديوهات سينمائية بالذكاء الاصطناعي، وأغاني كاملة مع ألحان ومقامات حية بنقرة واحدة وبدون أي تكلفة.
          </p>
        </div>
      </div>

      {/* Main Studio Shortcuts */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>أدوات التصميم الإبداعي</span>
          </h2>
          <span className="text-[11px] text-slate-400">اختر أداة للبدء</span>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* 1. Images */}
          <button
            onClick={() => onNavigate('images')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/40 text-center transition-all group active:scale-95 shadow-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-xs font-bold text-slate-100">تصميم صور</span>
            <span className="text-[10px] text-slate-400 mt-0.5">توليد وتعديل 4K</span>
          </button>

          {/* 2. Videos */}
          <button
            onClick={() => onNavigate('videos')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/40 text-center transition-all group active:scale-95 shadow-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs font-bold text-slate-100">تصميم فيديو</span>
            <span className="text-[10px] text-slate-400 mt-0.5">مشاهد سينمائية</span>
          </button>

          {/* 3. Songs */}
          <button
            onClick={() => onNavigate('music')}
            className="flex flex-col items-center justify-center p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/40 text-center transition-all group active:scale-95 shadow-md"
          >
            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Music2 className="w-6 h-6 text-pink-400" />
            </div>
            <span className="text-xs font-bold text-slate-100">تصميم أغاني</span>
            <span className="text-[10px] text-slate-400 mt-0.5">كلمات وألحان حية</span>
          </button>
        </div>
      </div>

      {/* Featured Inspirations */}
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>أفكار جاهزة للتجربة الفورية</span>
          </h2>
          <span className="text-[11px] text-slate-400">انقر للإنشاء</span>
        </div>

        <div className="flex flex-col gap-2">
          {INSPIRATION_PROMPTS.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onNavigate(item.tab)}
              className="p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 cursor-pointer transition flex items-center justify-between gap-3 group active:scale-[0.99]"
            >
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.color}`}>
                    {item.badge}
                  </span>
                  <h4 className="text-xs font-bold text-slate-200 truncate">{item.title}</h4>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-1">{item.desc}</p>
              </div>

              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 transition text-slate-300 group-hover:text-white">
                <ArrowLeft className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AdMob & Monetization Quick Link for the Owner */}
      <div
        onClick={() => onNavigate('monetization')}
        className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/50 border border-indigo-500/20 cursor-pointer hover:border-indigo-500/40 transition flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-amber-400">
            <Gift className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-200">مركز الإعلانات والأرباح (AdMob)</h4>
            <p className="text-[11px] text-slate-400">
              تحكم بوحدات الإعلانات، اختبر الإعلانات البينية، واستعرض أرباحك المقدرة.
            </p>
          </div>
        </div>
        <ArrowLeft className="w-4 h-4 text-slate-400" />
      </div>
    </div>
  );
};
