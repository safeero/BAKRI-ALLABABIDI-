import React, { useState } from 'react';
import {
  DollarSign,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  Eye,
  MousePointerClick,
  Layers,
  Sparkles,
  ExternalLink,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  Plus,
  Trash2,
  Megaphone,
} from 'lucide-react';
import { AdMobSettings, CustomAdItem } from '../types';
import { saveAdMobSettings, DEFAULT_ADMOB_SETTINGS } from '../utils/storage';

interface MonetizationCenterProps {
  settings: AdMobSettings;
  onSettingsUpdated: (newSettings: AdMobSettings) => void;
  onTestInterstitial: () => void;
  onTestRewarded: () => void;
}

export const MonetizationCenter: React.FC<MonetizationCenterProps> = ({
  settings,
  onSettingsUpdated,
  onTestInterstitial,
  onTestRewarded,
}) => {
  const [localSettings, setLocalSettings] = useState<AdMobSettings>(settings);
  const [isSaved, setIsSaved] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'custom' | 'config' | 'guide'>('analytics');

  // New Custom Ad Form State
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newSponsor, setNewSponsor] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newCta, setNewCta] = useState('انقر هنا');

  const updateSetting = <K extends keyof AdMobSettings>(key: K, value: AdMobSettings[K]) => {
    const updated = { ...localSettings, [key]: value };
    setLocalSettings(updated);
    saveAdMobSettings(updated);
    onSettingsUpdated(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const handleAddCustomAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newUrl.trim()) {
      alert('يرجى كتابة عنوان الإعلان ورابط التوجيه على الأقل');
      return;
    }

    const newAd: CustomAdItem = {
      id: 'ad_' + Date.now(),
      title: newTitle.trim(),
      desc: newDesc.trim() || 'إعلان ترويجي مميز داخل التطبيق',
      sponsor: newSponsor.trim() || 'إعلان برعاية المالك',
      targetUrl: newUrl.trim(),
      cta: newCta.trim() || 'زيارة الرابط',
      active: true,
    };

    const updatedList = [newAd, ...(localSettings.customAds || [])];
    updateSetting('customAds', updatedList);

    // Reset Form
    setNewTitle('');
    setNewDesc('');
    setNewSponsor('');
    setNewUrl('');
    setNewCta('انقر هنا');
    setIsAddingNew(false);
    alert('تمت إضافة إعلانك بنجاح! سيظهر الآن تلقائياً في شريط البنر والإعلانات البينية.');
  };

  const handleToggleAd = (id: string) => {
    const list = localSettings.customAds || [];
    const updated = list.map((a) => (a.id === id ? { ...a, active: !a.active } : a));
    updateSetting('customAds', updated);
  };

  const handleDeleteAd = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      const list = localSettings.customAds || [];
      const updated = list.filter((a) => a.id !== id);
      updateSetting('customAds', updated);
    }
  };

  const handleResetToTest = () => {
    setLocalSettings(DEFAULT_ADMOB_SETTINGS);
    saveAdMobSettings(DEFAULT_ADMOB_SETTINGS);
    onSettingsUpdated(DEFAULT_ADMOB_SETTINGS);
    alert('تمت استعادة معرّفات Google AdMob التجريبية الرسمية بنجاح.');
  };

  // Calculations
  const impressions = localSettings.totalImpressions;
  const clicks = localSettings.totalClicks;
  const ctr = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '0.00';
  const estimatedRevenueUSD = ((impressions / 1000) * localSettings.estimatedRPM).toFixed(2);
  const estimatedRevenueSAR = (parseFloat(estimatedRevenueUSD) * 3.75).toFixed(2);

  return (
    <div className="flex flex-col gap-4 p-4 pb-24 w-full max-w-lg mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>مركز الإعلانات والأرباح (AdMob)</span>
          </h2>
          <p className="text-xs text-slate-400">إدارة مساحات الإعلانات وحساب الأرباح المتوقعة لتطبيقك</p>
        </div>
        {isSaved && (
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
            <Check className="w-3 h-3" />
            <span>تم الحفظ</span>
          </span>
        )}
      </div>

      {/* Status Card */}
      <div className="rounded-2xl bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-950 border border-emerald-500/30 p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-white">حالة شبكة الإعلانات</h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.2 rounded-full ${
                  localSettings.enabled
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                {localSettings.enabled ? 'مفعلة' : 'متوقفة'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {localSettings.testMode
                ? 'الوضع التجريبي (Google Test Ads)'
                : 'وضع الإنتاج المباشر (Live Ads)'}
            </p>
          </div>
        </div>

        {/* Master Toggle */}
        <button
          onClick={() => updateSetting('enabled', !localSettings.enabled)}
          className="text-emerald-400 hover:text-emerald-300 transition"
        >
          {localSettings.enabled ? (
            <ToggleRight className="w-9 h-9" />
          ) : (
            <ToggleLeft className="w-9 h-9 text-slate-600" />
          )}
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800 text-[11px] font-bold overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveSubTab('analytics')}
          className={`flex-1 min-w-[80px] py-2 rounded-xl transition ${
            activeSubTab === 'analytics'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          الأرباح والتحكم
        </button>
        <button
          onClick={() => setActiveSubTab('custom')}
          className={`flex-1 min-w-[90px] py-2 rounded-xl transition ${
            activeSubTab === 'custom'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          إعلاناتي المخصصة
        </button>
        <button
          onClick={() => setActiveSubTab('config')}
          className={`flex-1 min-w-[85px] py-2 rounded-xl transition ${
            activeSubTab === 'config'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          معرفات AdMob
        </button>
        <button
          onClick={() => setActiveSubTab('guide')}
          className={`flex-1 min-w-[85px] py-2 rounded-xl transition ${
            activeSubTab === 'guide'
              ? 'bg-emerald-600 text-white shadow'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          دليل النشر
        </button>
      </div>

      {activeSubTab === 'custom' && (
        <div className="flex flex-col gap-3">
          <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Megaphone className="w-4 h-4 text-emerald-400" />
                <span>إعلاناتك وروابطك الخاصة المباشرة</span>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                ضع إعلانات لمنتجاتك، قناتك على تيليجرام، متجرك، أو شركائك لتظهر فوراً لمستخدمي التطبيق.
              </p>
            </div>
            <button
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shrink-0 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isAddingNew ? 'إلغاء' : 'إضافة إعلان'}</span>
            </button>
          </div>

          {/* Form to add custom ad */}
          {isAddingNew && (
            <form
              onSubmit={handleAddCustomAd}
              className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/40 flex flex-col gap-2.5 shadow-xl animate-in fade-in"
            >
              <h5 className="text-xs font-bold text-emerald-300">تفاصيل الإعلان الجديد:</h5>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-300">عنوان الإعلان الرئيسي:</label>
                <input
                  type="text"
                  placeholder="مثال: خصم 50% على متجر الهدايا / انضم لقناتنا"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-300">الوصف الترويجي:</label>
                <input
                  type="text"
                  placeholder="مثال: احصل على كود الخصم الحصري الآن مع شحن سريع مجاناً"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-slate-300">اسم الراعي / المعلن:</label>
                  <input
                    type="text"
                    placeholder="مثال: متجري الرسمي"
                    value={newSponsor}
                    onChange={(e) => setNewSponsor(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[11px] font-semibold text-slate-300">نص الزر (CTA):</label>
                  <input
                    type="text"
                    placeholder="مثال: اطلب الآن / انضم"
                    value={newCta}
                    onChange={(e) => setNewCta(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-semibold text-slate-300">رابط التوجيه (URL):</label>
                <input
                  type="url"
                  placeholder="https://t.me/mychannel أو https://myshop.com"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl p-2 text-xs text-white font-mono outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <button
                type="submit"
                className="mt-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-lg transition active:scale-98 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>حفظ وإظهار الإعلان فوراً في التطبيق</span>
              </button>
            </form>
          )}

          {/* List of Custom Ads */}
          <div className="flex flex-col gap-2">
            {(localSettings.customAds || []).length === 0 ? (
              <p className="text-center text-xs text-slate-500 py-6">
                لا توجد إعلانات مخصصة بعد. انقر على "إضافة إعلان" لإنشاء أول إعلان خاص بك.
              </p>
            ) : (
              (localSettings.customAds || []).map((cad) => (
                <div
                  key={cad.id}
                  className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-2"
                >
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                          cad.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {cad.active ? 'نشط' : 'معطل'}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">{cad.sponsor}</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-100 truncate mt-0.5">{cad.title}</h5>
                    <p className="text-[11px] text-slate-400 truncate">{cad.desc}</p>
                    <a
                      href={cad.targetUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-indigo-400 hover:underline truncate flex items-center gap-1 mt-0.5"
                    >
                      <span>{cad.targetUrl}</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleToggleAd(cad.id)}
                      className="text-slate-400 hover:text-emerald-400 p-1"
                      title={cad.active ? 'إيقاف مؤقت' : 'تفعيل'}
                    >
                      {cad.active ? (
                        <ToggleRight className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-slate-600" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteAd(cad.id)}
                      className="text-slate-500 hover:text-red-400 p-1 transition"
                      title="حذف الإعلان"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeSubTab === 'analytics' && (
        <div className="flex flex-col gap-3">
          {/* Revenue KPI Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>الأرباح المقدرة (USD)</span>
              </span>
              <span className="text-xl font-black text-white font-mono">
                ${estimatedRevenueUSD}
              </span>
              <span className="text-[10px] text-emerald-400">
                ما يعادل ≈ {estimatedRevenueSAR} ر.س
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>معدل الألف ظهور (eCPM)</span>
              </span>
              <span className="text-xl font-black text-white font-mono">
                ${localSettings.estimatedRPM}
              </span>
              <span className="text-[10px] text-slate-400">متوسط الأرباح لكل 1000 ظهور</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-purple-400" />
                <span>مرات الظهور (Impressions)</span>
              </span>
              <span className="text-xl font-black text-white font-mono">{impressions}</span>
              <span className="text-[10px] text-slate-400">تزيد تلقائياً مع تصفح المستخدمين</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-1">
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <MousePointerClick className="w-3.5 h-3.5 text-amber-400" />
                <span>النقرات ونسبة النقر (CTR)</span>
              </span>
              <span className="text-xl font-black text-white font-mono">{clicks}</span>
              <span className="text-[10px] text-amber-400">CTR: {ctr}%</span>
            </div>
          </div>

          {/* Ad format test triggers */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-200">اختبار ظهور الإعلانات المدمجة الآن:</h4>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onTestInterstitial}
                className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <span>اختبار إعلان بيني (5s)</span>
              </button>
              <button
                onClick={onTestRewarded}
                className="py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold border border-emerald-500/40 flex items-center justify-center gap-1.5 transition active:scale-95"
              >
                <span>اختبار إعلان بمكافأة</span>
              </button>
            </div>
          </div>

          {/* Toggle Switches */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-200">خيارات العرض الذكي:</h4>

            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 block">إظهار شريط الإعلانات (Banner)</span>
                <span className="text-[11px] text-slate-400">عرض بنر إعلاني مريح أسفل شاشة الهاتف</span>
              </div>
              <button
                onClick={() => updateSetting('showBannerOnPages', !localSettings.showBannerOnPages)}
                className="text-emerald-400"
              >
                {localSettings.showBannerOnPages ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-600" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div>
                <span className="text-xs font-bold text-slate-200 block">الوضع التجريبي (Test Mode)</span>
                <span className="text-[11px] text-slate-400">حماية حساب AdMob أثناء التجارب والتطوير</span>
              </div>
              <button
                onClick={() => updateSetting('testMode', !localSettings.testMode)}
                className="text-emerald-400"
              >
                {localSettings.testMode ? (
                  <ToggleRight className="w-8 h-8" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'config' && (
        <div className="flex flex-col gap-3">
          <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            يمكنك ترك المعرفات التجريبية الحالية أو استبدالها بمعرفات حسابك في Google AdMob عند نشر التطبيق رسمياً على متجر Google Play.
          </p>

          {/* AdMob App ID */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-300">معرف تطبيق AdMob (App ID):</label>
            <input
              type="text"
              value={localSettings.appId}
              onChange={(e) => updateSetting('appId', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Banner ID */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-300">معرف وحدة البنر (Banner Ad Unit ID):</label>
            <input
              type="text"
              value={localSettings.bannerAdId}
              onChange={(e) => updateSetting('bannerAdId', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Interstitial ID */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-300">معرف الإعلان البيني (Interstitial Ad Unit ID):</label>
            <input
              type="text"
              value={localSettings.interstitialAdId}
              onChange={(e) => updateSetting('interstitialAdId', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Rewarded ID */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-bold text-slate-300">معرف إعلان المكافأة (Rewarded Video ID):</label>
            <input
              type="text"
              value={localSettings.rewardedAdId}
              onChange={(e) => updateSetting('rewardedAdId', e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:border-emerald-500 outline-none"
            />
          </div>

          <button
            onClick={handleResetToTest}
            className="mt-2 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs font-semibold border border-slate-700"
          >
            استعادة معرّفات Google AdMob الرسمية التجريبية
          </button>
        </div>
      )}

      {activeSubTab === 'guide' && (
        <div className="flex flex-col gap-3 text-xs leading-relaxed text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col gap-2">
            <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-1.5">
              <Code2 className="w-4 h-4" />
              <span>خطوات تفعيل الإعلانات على متجر Google Play:</span>
            </h4>
            <ol className="list-decimal list-inside space-y-2 mt-1 text-slate-300">
              <li>
                قم بإنشاء حساب على{' '}
                <a
                  href="https://admob.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 underline font-semibold"
                >
                  Google AdMob
                </a>{' '}
                وربطه مع Google Play Console.
              </li>
              <li>أنشئ تطبيق أندرويد جديد في AdMob وانسخ معرّف التطبيق (App ID).</li>
              <li>أنشئ 3 وحدات إعلانية: بنر تكيفي (Banner)، بيني (Interstitial)، وبمكافأة (Rewarded).</li>
              <li>
                الصق المعرفات في تبويب <strong>"إعداد المعرفات"</strong> هنا لتجهيزها فوراً.
              </li>
              <li>
                التطبيق معد بهيكل معماري مهيأ للتصدير كحزمة APK أو PWA جاهزة للعمل فوراً.
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
