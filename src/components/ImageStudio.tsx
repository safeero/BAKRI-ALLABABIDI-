import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Download,
  Share2,
  Copy,
  Check,
  ZoomIn,
  Upload,
  RefreshCw,
  Sliders,
  Maximize2,
  Image as ImageIcon,
} from 'lucide-react';
import { AspectRatioType, ImageResolutionType, GeneratedImage } from '../types';
import { apiGenerateImage, apiEditImage, apiEnhancePrompt } from '../services/api';
import { saveCreation } from '../utils/storage';

interface ImageStudioProps {
  onCreationAdded: (item: GeneratedImage) => void;
  onRequestInterstitialAd?: () => void;
  hasTurboBonus?: boolean;
}

const STYLES = [
  { id: 'واقعي فوتوغرافي', label: 'واقعي فوتوغرافي', preview: '📸' },
  { id: 'سينمائي هوليوود', label: 'سينمائي 8K', preview: '🎬' },
  { id: 'أنمي ياباني', label: 'أنمي ياباني', preview: '🎨' },
  { id: '3D ريندر', label: '3D سينمائي', preview: '🧊' },
  { id: 'رسم رقمي فني', label: 'رسم رقمي', preview: '🖌️' },
  { id: 'سايبربانك مستقبلي', label: 'سايبربانك', preview: '⚡' },
];

const ASPECT_RATIOS: { id: AspectRatioType; label: string; desc: string }[] = [
  { id: '1:1', label: '1:1', desc: 'مربع' },
  { id: '9:16', label: '9:16', desc: 'ريلز / ستوري' },
  { id: '16:9', label: '16:9', desc: 'عريض يوتيوب' },
  { id: '4:3', label: '4:3', desc: 'كلاسيكي' },
  { id: '3:4', label: '3:4', desc: 'بورتريه' },
];

const RESOLUTIONS: ImageResolutionType[] = ['512px', '1K', '2K', '4K'];

export const ImageStudio: React.FC<ImageStudioProps> = ({
  onCreationAdded,
  onRequestInterstitialAd,
  hasTurboBonus,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'generate' | 'edit'>('generate');

  // Generation state
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('1:1');
  const [resolution, setResolution] = useState<ImageResolutionType>('4K');
  const [selectedStyle, setSelectedStyle] = useState('سينمائي هوليوود');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Edit state
  const [editPrompt, setEditPrompt] = useState('');
  const [sourceImage, setSourceImage] = useState<string | null>(null);

  // Result state
  const [currentImage, setCurrentImage] = useState<GeneratedImage | null>(null);
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);

  // Handle prompt enhancer
  const handleEnhance = async (isEdit = false) => {
    const textToEnhance = isEdit ? editPrompt : prompt;
    if (!textToEnhance.trim()) return;
    setIsEnhancing(true);
    try {
      const data = await apiEnhancePrompt(textToEnhance, 'image');
      if (isEdit) {
        setEditPrompt(data.enhancedPrompt);
      } else {
        setPrompt(data.enhancedPrompt);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Handle Generate
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      const data = await apiGenerateImage({
        prompt,
        aspectRatio,
        imageSize: resolution,
        style: selectedStyle,
      });

      const newImage: GeneratedImage = {
        id: 'img_' + Math.random().toString(36).substring(2, 9),
        type: 'image',
        prompt,
        imageUrl: data.imageUrl,
        aspectRatio,
        resolution,
        style: selectedStyle,
        createdAt: Date.now(),
      };

      setCurrentImage(newImage);
      saveCreation(newImage);
      onCreationAdded(newImage);

      const newCount = generationCount + 1;
      setGenerationCount(newCount);
      if (newCount % 3 === 0 && onRequestInterstitialAd) {
        onRequestInterstitialAd();
      }
    } catch (err: any) {
      alert(err.message || 'حدث خطأ أثناء توليد الصورة');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Edit
  const handleEdit = async () => {
    if (!sourceImage || !editPrompt.trim()) return;
    setIsLoading(true);
    try {
      const data = await apiEditImage({
        imageBase64: sourceImage,
        prompt: editPrompt,
      });

      const newImage: GeneratedImage = {
        id: 'img_edit_' + Math.random().toString(36).substring(2, 9),
        type: 'image',
        prompt: `تعديل: ${editPrompt}`,
        imageUrl: data.imageUrl,
        aspectRatio: '1:1',
        resolution: '1K',
        style: 'تعديل ذكي',
        createdAt: Date.now(),
      };

      setCurrentImage(newImage);
      saveCreation(newImage);
      onCreationAdded(newImage);
    } catch (err: any) {
      alert(err.message || 'فشل تعديل الصورة');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle file upload
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setSourceImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCopyPrompt = () => {
    if (currentImage) {
      navigator.clipboard.writeText(currentImage.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-24 w-full max-w-lg mx-auto animate-in fade-in duration-200">
      {/* Studio Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-400" />
            <span>استوديو تصميم الصور 4K</span>
          </h2>
          <p className="text-xs text-slate-400">توليد صور واقعية وتعديلها مجاناً بالذكاء الاصطناعي</p>
        </div>
        {hasTurboBonus && (
          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
            Turbo 4K
          </span>
        )}
      </div>

      {/* Sub tabs: Generate vs Edit */}
      <div className="flex p-1 bg-slate-900 rounded-2xl border border-slate-800">
        <button
          onClick={() => setActiveSubTab('generate')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeSubTab === 'generate'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          توليد صورة جديدة
        </button>
        <button
          onClick={() => setActiveSubTab('edit')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
            activeSubTab === 'edit'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          تعديل صورة ذكياً
        </button>
      </div>

      {activeSubTab === 'generate' ? (
        <div className="flex flex-col gap-3">
          {/* Prompt Input */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">وصف الصورة المطلوبة:</label>
              <button
                onClick={() => handleEnhance(false)}
                disabled={isEnhancing || !prompt.trim()}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
              >
                <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
                <span>{isEnhancing ? 'جاري التحسين...' : 'تحسين الأمر تلقائياً'}</span>
              </button>
            </div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="مثال: أسد أبيض شامخ بتاج ذهبي مرصع بالزمرد في قصر ملكي فخم، إضاءة سينمائية، تفاصيل دقيقة 4K..."
              rows={3}
              className="w-full rounded-2xl bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 p-3 text-xs text-slate-100 placeholder-slate-500 outline-none resize-none leading-relaxed"
            />
          </div>

          {/* Quick preset suggestions */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
            <button
              onClick={() =>
                setPrompt('طبيعة جبلية ساحرة مع شلالات متدفقة وبحيرة زمردية في وادٍ أخضر عند الشروق')
              }
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 whitespace-nowrap"
            >
              🏔️ طبيعة وشلالات
            </button>
            <button
              onClick={() =>
                setPrompt('سيارة رياضية خارقة مستقبلية تسير في شوارع دبي المضاءة بالنيون تحت المطر')
              }
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 whitespace-nowrap"
            >
              🏎️ سيارة خارقة نيون
            </button>
            <button
              onClick={() =>
                setPrompt('بطل عربي قديم في صحراء واسعة مع درع مزخرف بالنقوش الذهبية')
              }
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 whitespace-nowrap"
            >
              ⚔️ فارس أسطوري
            </button>
          </div>

          {/* Styles Selector */}
          <div className="flex flex-col gap-1.5">
            <span className="text-xs font-bold text-slate-300">النمط الفني:</span>
            <div className="grid grid-cols-3 gap-2">
              {STYLES.map((st) => (
                <button
                  key={st.id}
                  onClick={() => setSelectedStyle(st.id)}
                  className={`flex items-center gap-1.5 p-2 rounded-xl border text-xs font-semibold transition ${
                    selectedStyle === st.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-base">{st.preview}</span>
                  <span className="truncate">{st.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Aspect Ratio and Resolution */}
          <div className="grid grid-cols-2 gap-3">
            {/* Aspect Ratio */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-300">الأبعاد (Aspect Ratio):</span>
              <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                {ASPECT_RATIOS.map((ar) => (
                  <button
                    key={ar.id}
                    onClick={() => setAspectRatio(ar.id)}
                    className={`px-2 py-1.5 rounded-xl border text-xs font-bold text-center transition shrink-0 ${
                      aspectRatio === ar.id
                        ? 'bg-indigo-600 text-white border-indigo-500'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{ar.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-300">الدقة والجودة:</span>
              <div className="flex gap-1">
                {RESOLUTIONS.map((res) => (
                  <button
                    key={res}
                    onClick={() => setResolution(res)}
                    className={`flex-1 py-1.5 rounded-xl border text-xs font-bold text-center transition ${
                      resolution === res
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !prompt.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-2 active:scale-[0.98] transition mt-1"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري توليد الصورة الفائقة 4K...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>توليد الصورة الآن مجاناً</span>
              </>
            )}
          </button>
        </div>
      ) : (
        /* Edit Tab */
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-300">1. اختر الصورة المراد تعديلها:</label>
            {sourceImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 h-48 bg-slate-900 flex items-center justify-center">
                <img
                  src={sourceImage}
                  alt="Original"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
                <label className="absolute bottom-2 right-2 bg-slate-900/90 hover:bg-slate-800 text-xs text-indigo-300 px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer transition">
                  تغيير الصورة
                  <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </label>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500/60 rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-slate-900/60 cursor-pointer transition">
                <Upload className="w-8 h-8 text-indigo-400" />
                <span className="text-xs font-bold text-slate-200">انقر هنا لاختيار صورة من جهازك</span>
                <span className="text-[10px] text-slate-500">يدعم PNG, JPG, WebP</span>
                <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
              </label>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">2. أدخل التعديل المطلوب:</label>
              <button
                onClick={() => handleEnhance(true)}
                disabled={isEnhancing || !editPrompt.trim()}
                className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>تحسين الوصف</span>
              </button>
            </div>
            <textarea
              value={editPrompt}
              onChange={(e) => setEditPrompt(e.target.value)}
              placeholder="مثال: أضف أضواء نيون زرقاء وخلفية ليلية ماطرة مع انعكاسات مائية..."
              rows={3}
              className="w-full rounded-2xl bg-slate-900 border border-slate-800 focus:border-indigo-500 p-3 text-xs text-slate-100 placeholder-slate-500 outline-none resize-none"
            />
          </div>

          <button
            onClick={handleEdit}
            disabled={isLoading || !sourceImage || !editPrompt.trim()}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-[0.98] transition mt-1"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>جاري تطبيق التعديل الذكي...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>تعديل الصورة بالذكاء الاصطناعي</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Result Display Card */}
      {currentImage && (
        <div className="mt-4 rounded-3xl bg-slate-900 border border-slate-800 p-4 flex flex-col gap-3 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <Check className="w-4 h-4" />
              <span>تم إنشاء الصورة بنجاح ({currentImage.resolution})</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{currentImage.aspectRatio}</span>
          </div>

          {/* Image Container with zoom trigger */}
          <div
            onClick={() => setIsZoomed(true)}
            className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 cursor-zoom-in group max-h-[380px] flex items-center justify-center"
          >
            <img
              src={currentImage.imageUrl}
              alt={currentImage.prompt}
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover max-h-[380px] rounded-2xl group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="bg-slate-900/80 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 backdrop-blur-md">
                <ZoomIn className="w-3.5 h-3.5" />
                <span>تكبير كامل</span>
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-850 leading-relaxed">
            "{currentImage.prompt}"
          </p>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <a
              href={currentImage.imageUrl}
              download={`ai_image_${currentImage.id}.png`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل الصورة 4K</span>
            </a>

            <button
              onClick={handleCopyPrompt}
              className="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'نسخ الأمر'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Fullscreen Zoom Modal */}
      {isZoomed && currentImage && (
        <div
          onClick={() => setIsZoomed(false)}
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 cursor-zoom-out"
        >
          <img
            src={currentImage.imageUrl}
            alt="Full size"
            referrerPolicy="no-referrer"
            className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
          />
          <span className="text-slate-400 text-xs mt-3">انقر في أي مكان للإغلاق</span>
        </div>
      )}
    </div>
  );
};
