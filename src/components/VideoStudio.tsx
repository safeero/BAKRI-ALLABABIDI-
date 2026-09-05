import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  Sparkles,
  Wand2,
  Play,
  Pause,
  RotateCcw,
  Download,
  Film,
  Compass,
  CheckCircle2,
  RefreshCw,
  Sliders,
  Copy,
  Check,
} from 'lucide-react';
import { GeneratedVideo } from '../types';
import { apiGenerateVideo, apiCheckVideoStatus, apiEnhancePrompt } from '../services/api';
import { saveCreation } from '../utils/storage';

interface VideoStudioProps {
  onCreationAdded: (item: GeneratedVideo) => void;
  onRequestInterstitialAd?: () => void;
  hasTurboBonus?: boolean;
}

const CAMERA_MOTIONS = [
  { id: 'تصوير طائرة درون (Drone Flyover)', label: 'طائرة درون (Drone)', desc: 'تحليق سينمائي واسع' },
  { id: 'تتبع سينمائي (Cinematic Tracking)', label: 'تتبع سينمائي', desc: 'متابعة سلسة للأشخاص والسيارات' },
  { id: 'حركة بطيئة (Slow Motion 60fps)', label: 'حركة بطيئة 60fps', desc: 'لقطة درامية ناعمة' },
  { id: 'زووم ناعم (Cinematic Zoom)', label: 'زووم ديناميكي', desc: 'تقريب وتركيز على التفاصيل' },
  { id: 'دوران 360 (Orbit)', label: 'دوران سينمائي', desc: 'التفاف كامل حول المجسم' },
];

const VIDEO_STYLES = [
  { id: 'سينمائي هوليوود', label: 'سينمائي هوليوود', emoji: '🎬' },
  { id: 'سايبربانك مستقبلي', label: 'خيال علمي 2050', emoji: '🛸' },
  { id: 'طبيعة ووثائقي 8K', label: 'وثائقي طبيعة', emoji: '🌿' },
  { id: 'إعلان تجاري فخم', label: 'إعلان تجاري', emoji: '✨' },
];

export const VideoStudio: React.FC<VideoStudioProps> = ({
  onCreationAdded,
  onRequestInterstitialAd,
  hasTurboBonus,
}) => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState('9:16');
  const [resolution, setResolution] = useState('1080p');
  const [selectedStyle, setSelectedStyle] = useState('سينمائي هوليوود');
  const [selectedMotion, setSelectedMotion] = useState(CAMERA_MOTIONS[0].id);

  // Generation status
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Current Video Result
  const [currentVideo, setCurrentVideo] = useState<GeneratedVideo | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [copied, setCopied] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const PIPELINE_STEPS = [
    'تحليل الفكرة والإخراج السينمائي...',
    'رسم الإطارات الأساسية بالحركة المطلوبة...',
    'محاكاة حركة الكاميرا والعمق البصري...',
    'الترقية النهائية بدقة 1080p وتجهيز MP4...',
  ];

  // Prompt Enhancer
  const handleEnhance = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const data = await apiEnhancePrompt(prompt, 'video');
      setPrompt(data.enhancedPrompt);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Generate Video
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationStep(0);

    // Simulated multi-stage progress for user reassurance
    const interval = setInterval(() => {
      setGenerationStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 2000);

    try {
      const data = await apiGenerateVideo({
        prompt,
        aspectRatio,
        resolution,
        style: selectedStyle,
        cameraMotion: selectedMotion,
      });

      // Poll or finalize
      const newVideo: GeneratedVideo = {
        id: data.videoId || 'vid_' + Math.random().toString(36).substring(2, 9),
        type: 'video',
        prompt,
        videoUrl:
          data.videoUrl ||
          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        previewUrl: data.previewUrl || 'https://picsum.photos/seed/video/720/1280',
        aspectRatio,
        resolution,
        style: selectedStyle,
        cameraMotion: selectedMotion,
        durationSeconds: 6,
        createdAt: Date.now(),
      };

      setCurrentVideo(newVideo);
      saveCreation(newVideo);
      onCreationAdded(newVideo);

      if (onRequestInterstitialAd) {
        onRequestInterstitialAd();
      }
    } catch (err: any) {
      alert(err.message || 'فشل توليد الفيديو');
    } finally {
      clearInterval(interval);
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleCopyPrompt = () => {
    if (currentVideo) {
      navigator.clipboard.writeText(currentVideo.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-24 w-full max-w-lg mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Video className="w-5 h-5 text-purple-400" />
            <span>استوديو تصميم الفيديو بالذكاء الاصطناعي</span>
          </h2>
          <p className="text-xs text-slate-400">توليد مقاطع سينمائية وحركات كاميرا واقعية مجاناً</p>
        </div>
        {hasTurboBonus && (
          <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-bold">
            Veo Turbo
          </span>
        )}
      </div>

      {/* Prompt Area */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300">وصف المشهد السينمائي والحركة:</label>
          <button
            onClick={handleEnhance}
            disabled={isEnhancing || !prompt.trim()}
            className="flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 disabled:opacity-50"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
            <span>{isEnhancing ? 'جاري التحسين...' : 'تحسين سينمائي تلقائي'}</span>
          </button>
        </div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="مثال: لقطة سينمائية لغواصة تستكشف أعماق المحيط وسط أسماك مضيئة بيولوجياً وشعب مرجانية متوهجة، إضاءة ناعمة وماء نقي فائق الوضوح..."
          rows={3}
          className="w-full rounded-2xl bg-slate-900 border border-slate-800 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 p-3 text-xs text-slate-100 placeholder-slate-500 outline-none resize-none leading-relaxed"
        />
      </div>

      {/* Quick Prompts */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
        <button
          onClick={() =>
            setPrompt('طيران درون سريع بين قمم الجبال الجليدية المغطاة بالضباب عند شروق الشمس مع انعكاسات ثلجية مبهرة')
          }
          className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 whitespace-nowrap"
        >
          🏔️ طيران فوق الجبال
        </button>
        <button
          onClick={() =>
            setPrompt('سباق سيارات سرعة نيون في شوارع مستقبلية تحت المطر ليلاً مع شرارات وتأثيرات سينمائية 4K')
          }
          className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 whitespace-nowrap"
        >
          🏎️ سباق سيارات نيون
        </button>
        <button
          onClick={() =>
            setPrompt('رائد فضاء يمشي على كوكب فضائي أحمر محاطاً بكريستالات عملاقة عاكسة للضوء')
          }
          className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 whitespace-nowrap"
        >
          🌌 استكشاف الفضاء
        </button>
      </div>

      {/* Camera Motion Selection */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-purple-400" />
          <span>حركة الكاميرا (Camera Motion):</span>
        </span>
        <div className="grid grid-cols-2 gap-2">
          {CAMERA_MOTIONS.map((cm) => (
            <button
              key={cm.id}
              onClick={() => setSelectedMotion(cm.id)}
              className={`p-2.5 rounded-xl border text-right transition flex flex-col gap-0.5 ${
                selectedMotion === cm.id
                  ? 'bg-purple-600/20 border-purple-500 text-purple-200 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="text-xs font-bold">{cm.label}</span>
              <span className="text-[10px] text-slate-400">{cm.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Style Presets */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-bold text-slate-300">النمط السينمائي:</span>
        <div className="grid grid-cols-2 gap-2">
          {VIDEO_STYLES.map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStyle(st.id)}
              className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-semibold transition ${
                selectedStyle === st.id
                  ? 'bg-purple-600/20 border-purple-500 text-purple-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="text-base">{st.emoji}</span>
              <span className="truncate">{st.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Aspect Ratio & Resolution */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-slate-300">أبعاد الفيديو:</span>
          <div className="flex gap-1.5">
            {[
              { id: '9:16', label: '9:16 ريلز' },
              { id: '16:9', label: '16:9 يوتيوب' },
              { id: '1:1', label: '1:1 مربع' },
            ].map((ar) => (
              <button
                key={ar.id}
                onClick={() => setAspectRatio(ar.id)}
                className={`flex-1 py-2 rounded-xl border text-xs font-bold text-center transition ${
                  aspectRatio === ar.id
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {ar.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-slate-300">الجودة:</span>
          <div className="flex gap-1.5">
            {['720p', '1080p'].map((res) => (
              <button
                key={res}
                onClick={() => setResolution(res)}
                className={`flex-1 py-2 rounded-xl border text-xs font-bold text-center transition ${
                  resolution === res
                    ? 'bg-purple-600 text-white border-purple-500'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                }`}
              >
                {res}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Generate Video Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:opacity-95 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-purple-600/30 flex items-center justify-center gap-2 active:scale-[0.98] transition mt-1"
      >
        {isGenerating ? (
          <>
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>جاري إخراج الفيديو السينمائي...</span>
          </>
        ) : (
          <>
            <Film className="w-4 h-4" />
            <span>توليد الفيديو السينمائي مجاناً</span>
          </>
        )}
      </button>

      {/* Progress Pipeline Screen while generating */}
      {isGenerating && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 flex flex-col gap-2.5 animate-in fade-in">
          <div className="flex items-center justify-between text-xs text-purple-400 font-bold">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>مراحل معالجة الفيديو بالذكاء الاصطناعي</span>
            </span>
            <span>{Math.round(((generationStep + 1) / 4) * 100)}%</span>
          </div>

          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-700"
              style={{ width: `${((generationStep + 1) / 4) * 100}%` }}
            />
          </div>

          <div className="flex flex-col gap-1 mt-1">
            {PIPELINE_STEPS.map((stepDesc, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-2 text-xs transition-opacity ${
                  idx <= generationStep ? 'text-slate-200' : 'text-slate-600'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    idx < generationStep
                      ? 'bg-emerald-400'
                      : idx === generationStep
                      ? 'bg-purple-400 animate-ping'
                      : 'bg-slate-700'
                  }`}
                />
                <span>{stepDesc}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Player Display */}
      {currentVideo && (
        <div className="mt-4 rounded-3xl bg-slate-900 border border-slate-800 p-4 flex flex-col gap-3 shadow-2xl animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>تم إنشاء الفيديو بنجاح ({currentVideo.resolution})</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono">{currentVideo.aspectRatio}</span>
          </div>

          {/* Video element */}
          <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 flex items-center justify-center">
            <video
              ref={videoRef}
              src={currentVideo.videoUrl}
              loop
              playsInline
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              className="w-full max-h-[420px] object-contain rounded-2xl"
            />

            {/* Play/Pause Overlay Overlay Button */}
            <button
              onClick={togglePlay}
              className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-slate-900/70 hover:bg-slate-900/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition active:scale-95 shadow-xl"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-white" />
              ) : (
                <Play className="w-6 h-6 fill-white ml-0.5" />
              )}
            </button>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between bg-slate-950/80 p-2.5 rounded-xl border border-slate-850">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = 0;
                    videoRef.current.play();
                    setIsPlaying(true);
                  }
                }}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300"
                title="إعادة التشغيل من البداية"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center gap-1 text-[11px] bg-slate-800 px-2 py-1 rounded-lg">
                <span className="text-slate-400">السرعة:</span>
                {[0.5, 1, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => changeSpeed(spd)}
                    className={`px-1.5 py-0.2 rounded font-mono font-bold ${
                      playbackSpeed === spd ? 'bg-purple-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            <span className="text-[11px] text-slate-400">{currentVideo.cameraMotion.split('(')[0]}</span>
          </div>

          <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-xl border border-slate-850 leading-relaxed">
            "{currentVideo.prompt}"
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href={currentVideo.videoUrl}
              download={`ai_video_${currentVideo.id}.mp4`}
              target="_blank"
              rel="noreferrer"
              className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل الفيديو MP4</span>
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
    </div>
  );
};
