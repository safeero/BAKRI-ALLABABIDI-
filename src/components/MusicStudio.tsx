import React, { useState, useEffect } from 'react';
import {
  Music2,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Sliders,
  FileText,
  Volume2,
  VolumeX,
  Wand2,
  Check,
  Copy,
  Download,
  Share2,
  Disc,
} from 'lucide-react';
import { GeneratedSong } from '../types';
import { apiGenerateSong, apiEnhancePrompt } from '../services/api';
import { startMusicPlayback, stopMusicPlayback, isAudioPlaying } from '../utils/audioSynth';
import { saveCreation } from '../utils/storage';

interface MusicStudioProps {
  onCreationAdded: (item: GeneratedSong) => void;
  onRequestInterstitialAd?: () => void;
  hasTurboBonus?: boolean;
}

const GENRES = [
  { id: 'طرب عربي معاصر', label: 'طرب عربي معاصر', desc: 'عود وقانون مع إيقاع حديث', emoji: '🪕' },
  { id: 'خليجي شرقي إيقاعي', label: 'خليجي إيقاعي', desc: 'إيقاعات خليجية حية ونبض سريع', emoji: '🥁' },
  { id: 'بوب حديث', label: 'بوب حديث (Pop)', desc: 'إيقاع شبابي مبهج وجذاب', emoji: '🎤' },
  { id: 'راب وهيب هوب', label: 'هيب هوب وراب', desc: 'إيقاع بوم باب وجهوري عميق', emoji: '🎧' },
  { id: 'لو فاي هادئ', label: 'لو فاي (Lo-Fi)', desc: 'أنغام هادئة للاسترخاء والتركيز', emoji: '☕' },
  { id: 'سينمائي أوركسترالي', label: 'سينمائي أوركسترا', desc: 'وتريات ملحمية وبيانو ضخم', emoji: '🎻' },
];

const MOODS = [
  { id: 'حماسي وملهم', label: 'حماسي وملهم 🔥' },
  { id: 'رومانسي شاعري', label: 'رومانسي شاعري 💖' },
  { id: 'هادئ وتأملي', label: 'هادئ وتأملي 🌙' },
  { id: 'فرح واحتفال', label: 'فرح واحتفال 🎉' },
];

const VOCAL_STYLES = [
  { id: 'غناء عربي طربي دافئ', label: 'طربي دافئ' },
  { id: 'أداء صوتي شبابي سريع', label: 'شبابي سريع' },
  { id: 'إلقاء شعري سينمائي', label: 'إلقاء شعري' },
  { id: 'كورال وأصوات محيطية', label: 'كورال محيطي' },
];

export const MusicStudio: React.FC<MusicStudioProps> = ({
  onCreationAdded,
  onRequestInterstitialAd,
  hasTurboBonus,
}) => {
  const [topic, setTopic] = useState('');
  const [selectedGenre, setSelectedGenre] = useState(GENRES[0].id);
  const [selectedMood, setSelectedMood] = useState(MOODS[0].id);
  const [selectedVocal, setSelectedVocal] = useState(VOCAL_STYLES[0].id);

  const [isLoading, setIsLoading] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);

  // Audio Playback
  const [currentSong, setCurrentSong] = useState<GeneratedSong | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    return () => {
      stopMusicPlayback();
    };
  }, []);

  const handleEnhance = async () => {
    if (!topic.trim()) return;
    setIsEnhancing(true);
    try {
      const data = await apiEnhancePrompt(topic, 'song');
      setTopic(data.enhancedPrompt);
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    stopMusicPlayback();
    setIsPlaying(false);

    try {
      const data = await apiGenerateSong({
        topic,
        genre: selectedGenre,
        mood: selectedMood,
        vocal: selectedVocal,
        tempo: 'متوسط (110 BPM)',
      });

      const newSong: GeneratedSong = {
        id: data.song?.id || 'song_' + Math.random().toString(36).substring(2, 9),
        type: 'song',
        title: data.song?.title || `لحن ${topic.slice(0, 20)}`,
        topic,
        genre: selectedGenre,
        mood: selectedMood,
        tempo: data.song?.tempo || 112,
        scale: data.song?.scale || 'Hijaz',
        lyrics: data.song?.lyrics || [],
        musicalArrangement: data.song?.musicalArrangement || 'توزيع موسيقي متكامل',
        productionNotes: data.song?.productionNotes || 'نصائح استوديو',
        createdAt: Date.now(),
      };

      setCurrentSong(newSong);
      saveCreation(newSong);
      onCreationAdded(newSong);

      // Auto start playback for instant gratification!
      startMusicPlayback(newSong, (step, lineIdx) => {
        setActiveStep(step);
        setActiveLineIndex(lineIdx);
      });
      setIsPlaying(true);

      if (onRequestInterstitialAd) {
        onRequestInterstitialAd();
      }
    } catch (err: any) {
      alert(err.message || 'فشل تأليف الأغنية');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePlayback = () => {
    if (!currentSong) return;
    if (isPlaying) {
      stopMusicPlayback();
      setIsPlaying(false);
    } else {
      startMusicPlayback(currentSong, (step, lineIdx) => {
        setActiveStep(step);
        setActiveLineIndex(lineIdx);
      });
      setIsPlaying(true);
    }
  };

  const handleCopyLyrics = () => {
    if (!currentSong) return;
    const fullText = currentSong.lyrics
      .map((sec) => `${sec.section}:\n${sec.lines.join('\n')}`)
      .join('\n\n');
    navigator.clipboard.writeText(`${currentSong.title}\n\n${fullText}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSheet = () => {
    if (!currentSong) return;
    const fullText = `عنوان الأغنية: ${currentSong.title}
النمط: ${currentSong.genre}
الحالة: ${currentSong.mood}
المقام والسرعة: ${currentSong.scale} (${currentSong.tempo} BPM)
التوزيع الموسيقي: ${currentSong.musicalArrangement}
------------------------------------------------
الكلمات:
${currentSong.lyrics.map((sec) => `[${sec.section}]\n${sec.lines.join('\n')}`).join('\n\n')}
`;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentSong.title.replace(/\s+/g, '_')}_كلمات_وألحان.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-24 w-full max-w-lg mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <Music2 className="w-5 h-5 text-pink-400" />
            <span>استوديو تأليف وتلحين الأغاني</span>
          </h2>
          <p className="text-xs text-slate-400">تأليف كلمات وتلحين نغمات موسيقية حية مجاناً</p>
        </div>
        {hasTurboBonus && (
          <span className="text-[10px] bg-pink-500/20 text-pink-300 border border-pink-500/30 px-2 py-0.5 rounded-full font-bold">
            Studio Pro
          </span>
        )}
      </div>

      {/* Topic Input */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300">موضوع أو فكرة الأغنية:</label>
          <button
            onClick={handleEnhance}
            disabled={isEnhancing || !topic.trim()}
            className="flex items-center gap-1 text-[11px] text-pink-400 hover:text-pink-300 disabled:opacity-50"
          >
            <Wand2 className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
            <span>{isEnhancing ? 'جاري التحسين...' : 'صياغة فكرة ملهمة'}</span>
          </button>
        </div>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="مثال: أغنية طربية ملهمة عن الشغف وتحقيق المستحيل في رحلة النجاح، بنبرة فخر واعتزاز..."
          rows={2}
          className="w-full rounded-2xl bg-slate-900 border border-slate-800 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 p-3 text-xs text-slate-100 placeholder-slate-500 outline-none resize-none leading-relaxed"
        />
      </div>

      {/* Quick Ideas */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] no-scrollbar">
        <button
          onClick={() => setTopic('أغنية عن العزيمة والصمود وتحقيق الأهداف الكبرى')}
          className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 whitespace-nowrap"
        >
          💪 العزيمة والنجاح
        </button>
        <button
          onClick={() => setTopic('أغنية حب وشوق دافئة بنكهة شرقية وأوتار العود الهادئة')}
          className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 whitespace-nowrap"
        >
          ❤️ حب وطرب شرقي
        </button>
        <button
          onClick={() => setTopic('أغنية شبابية حماسية عن المستقبل والابتكار والتفاؤل')}
          className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 whitespace-nowrap"
        >
          🚀 حماس ومستقبل
        </button>
      </div>

      {/* Musical Genres */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-bold text-slate-300">النمط الموسيقي والآلات:</span>
        <div className="grid grid-cols-2 gap-2">
          {GENRES.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGenre(g.id)}
              className={`p-2.5 rounded-xl border text-right transition flex items-start gap-2 ${
                selectedGenre === g.id
                  ? 'bg-pink-600/20 border-pink-500 text-pink-200 shadow-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <span className="text-xl shrink-0 mt-0.5">{g.emoji}</span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold truncate">{g.label}</span>
                <span className="text-[10px] text-slate-400 line-clamp-1">{g.desc}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mood & Vocals */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-slate-300">الحالة المزاجية:</span>
          <select
            value={selectedMood}
            onChange={(e) => setSelectedMood(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-pink-500"
          >
            {MOODS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <span className="text-xs font-bold text-slate-300">الأداء الصوتي:</span>
          <select
            value={selectedVocal}
            onChange={(e) => setSelectedVocal(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 outline-none focus:border-pink-500"
          >
            {VOCAL_STYLES.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isLoading || !topic.trim()}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600 hover:opacity-95 disabled:opacity-50 text-white font-bold text-sm shadow-xl shadow-pink-600/30 flex items-center justify-center gap-2 active:scale-[0.98] transition mt-1"
      >
        {isLoading ? (
          <>
            <Disc className="w-4 h-4 animate-spin" />
            <span>جاري تأليف الكلمات والتلحين الموسيقي...</span>
          </>
        ) : (
          <>
            <Music2 className="w-4 h-4" />
            <span>تأليف وتلحين الأغنية مجاناً</span>
          </>
        )}
      </button>

      {/* Generated Song Player & Lyrics Card */}
      {currentSong && (
        <div className="mt-3 rounded-3xl bg-slate-900 border border-slate-800 p-4 flex flex-col gap-4 shadow-2xl animate-in zoom-in-95 duration-200">
          {/* Header & Waveform */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-pink-400 flex items-center gap-1.5">
                <Disc className={`w-4 h-4 ${isPlaying ? 'animate-spin' : ''}`} />
                <span>مشغل الأغنية واللحن الحي</span>
              </span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-mono">
                {currentSong.scale} • {currentSong.tempo} BPM
              </span>
            </div>

            <h3 className="text-base font-black text-white">{currentSong.title}</h3>

            {/* Simulated Live Audio Equalizer Bars */}
            <div className="h-12 bg-slate-950 rounded-2xl p-2 flex items-end justify-between gap-1 overflow-hidden border border-slate-850">
              {Array.from({ length: 24 }).map((_, i) => {
                const height = isPlaying
                  ? Math.max(15, Math.floor(Math.sin((activeStep + i) * 0.4) * 40 + 50))
                  : 15;
                return (
                  <div
                    key={i}
                    className="flex-1 bg-gradient-to-t from-pink-500 via-purple-500 to-indigo-400 rounded-t-sm transition-all duration-150"
                    style={{ height: `${height}%` }}
                  />
                );
              })}
            </div>
          </div>

          {/* Player Controls */}
          <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-2xl border border-slate-850">
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayback}
                className="w-12 h-12 rounded-full bg-pink-600 hover:bg-pink-500 text-white flex items-center justify-center shadow-lg shadow-pink-600/30 transition active:scale-95"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </button>
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-200">
                  {isPlaying ? 'الموسيقى تعزف الآن...' : 'انقر لتشغيل اللحن والموسيقى'}
                </span>
                <span className="text-[10px] text-slate-400">
                  محرك توليد الألحان والمقامات الشرقية الحي
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                stopMusicPlayback();
                startMusicPlayback(currentSong, (step, lineIdx) => {
                  setActiveStep(step);
                  setActiveLineIndex(lineIdx);
                });
                setIsPlaying(true);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300"
              title="إعادة التشغيل من البداية"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Interactive Lyrics Karaoke View */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-pink-400" />
                <span>كلمات الأغنية المقفاة:</span>
              </span>
              <button
                onClick={handleCopyLyrics}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'تم النسخ' : 'نسخ الكلمات'}</span>
              </button>
            </div>

            <div className="max-h-56 overflow-y-auto space-y-3 p-3 bg-slate-950/70 rounded-2xl border border-slate-850">
              {currentSong.lyrics.map((sec, secIdx) => (
                <div key={secIdx} className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-pink-400 tracking-wider">
                    {sec.section}
                  </span>
                  <div className="flex flex-col gap-1 pl-2">
                    {sec.lines.map((line, lIdx) => (
                      <p
                        key={lIdx}
                        className={`text-xs leading-relaxed transition-all duration-300 ${
                          isPlaying
                            ? 'text-pink-200 font-medium'
                            : 'text-slate-300'
                        }`}
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Arrangement Info */}
          <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-850 flex flex-col gap-1 text-xs">
            <span className="font-bold text-slate-300">التوزيع الموسيقي:</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {currentSong.musicalArrangement}
            </p>
          </div>

          {/* Download & Share Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSheet}
              className="flex-1 py-2.5 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل نوتة وكلمات الأغنية</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
