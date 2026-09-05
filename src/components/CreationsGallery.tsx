import React, { useState } from 'react';
import {
  FolderHeart,
  Image as ImageIcon,
  Video,
  Music2,
  Trash2,
  Heart,
  Play,
  Download,
  ExternalLink,
  X,
} from 'lucide-react';
import { CreationItem, GeneratedImage, GeneratedVideo, GeneratedSong } from '../types';
import { deleteCreation, toggleFavoriteCreation } from '../utils/storage';
import { startMusicPlayback, stopMusicPlayback } from '../utils/audioSynth';

interface CreationsGalleryProps {
  creations: CreationItem[];
  onCreationsUpdated: (items: CreationItem[]) => void;
}

export const CreationsGallery: React.FC<CreationsGalleryProps> = ({
  creations,
  onCreationsUpdated,
}) => {
  const [filter, setFilter] = useState<'all' | 'image' | 'video' | 'song' | 'favorites'>('all');
  const [activeItem, setActiveItem] = useState<CreationItem | null>(null);

  const filtered = creations.filter((item) => {
    if (filter === 'favorites') return item.favorite;
    if (filter === 'image') return item.type === 'image';
    if (filter === 'video') return item.type === 'video';
    if (filter === 'song') return item.type === 'song';
    return true;
  });

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('هل أنت متأكد من حذف هذا العنصر؟')) {
      const updated = deleteCreation(id);
      onCreationsUpdated(updated);
      if (activeItem?.id === id) {
        setActiveItem(null);
      }
    }
  };

  const handleToggleFav = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = toggleFavoriteCreation(id);
    onCreationsUpdated(updated);
  };

  return (
    <div className="flex flex-col gap-4 p-4 pb-24 w-full max-w-lg mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <FolderHeart className="w-5 h-5 text-indigo-400" />
            <span>معرض إبداعاتي الذكية</span>
          </h2>
          <p className="text-xs text-slate-400">جميع الصور، الفيديوهات، والأغاني التي قمت بتوليدها</p>
        </div>
        <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-full font-bold">
          {creations.length} عنصر
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
        {[
          { id: 'all', label: 'الكل' },
          { id: 'image', label: 'الصور' },
          { id: 'video', label: 'الفيديوهات' },
          { id: 'song', label: 'الأغاني' },
          { id: 'favorites', label: 'المفضلة ❤️' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id as any)}
            className={`px-3 py-1.5 rounded-xl transition shrink-0 ${
              filter === f.id
                ? 'bg-indigo-600 text-white font-bold shadow'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 flex flex-col items-center justify-center text-center gap-2 text-slate-500">
          <FolderHeart className="w-12 h-12 stroke-1 text-slate-600" />
          <p className="text-sm font-bold text-slate-400">لا توجد عناصر في هذا القسم بعد</p>
          <p className="text-xs max-w-xs">ابدأ الآن بتوليد صور أو فيديوهات أو أغاني من الأقسام المجاورة مجاناً!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setActiveItem(item)}
              className="group relative rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 overflow-hidden cursor-pointer transition flex flex-col shadow-md active:scale-[0.98]"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-square w-full bg-slate-950 flex items-center justify-center overflow-hidden">
                {item.type === 'image' && (
                  <img
                    src={(item as GeneratedImage).imageUrl}
                    alt="Creation"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                {item.type === 'video' && (
                  <div className="relative w-full h-full">
                    <img
                      src={(item as GeneratedVideo).previewUrl}
                      alt="Video preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-purple-600/80 text-white flex items-center justify-center shadow-lg">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>
                )}
                {item.type === 'song' && (
                  <div className="w-full h-full bg-gradient-to-br from-pink-950/60 to-purple-950/40 p-4 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mb-2">
                      <Music2 className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-white line-clamp-2">
                      {(item as GeneratedSong).title}
                    </span>
                    <span className="text-[10px] text-pink-300 mt-1">
                      {(item as GeneratedSong).genre}
                    </span>
                  </div>
                )}

                {/* Top Badge (Type) */}
                <div className="absolute top-2 right-2 flex items-center gap-1">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-slate-950/80 backdrop-blur-md text-white border border-white/10 flex items-center gap-1">
                    {item.type === 'image' && <ImageIcon className="w-2.5 h-2.5 text-indigo-400" />}
                    {item.type === 'video' && <Video className="w-2.5 h-2.5 text-purple-400" />}
                    {item.type === 'song' && <Music2 className="w-2.5 h-2.5 text-pink-400" />}
                    <span>{item.type === 'image' ? 'صورة' : item.type === 'video' ? 'فيديو' : 'أغنية'}</span>
                  </span>
                </div>

                {/* Favorite & Delete Buttons */}
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <button
                    onClick={(e) => handleToggleFav(item.id, e)}
                    className="p-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 hover:text-red-400 transition"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        item.favorite ? 'text-red-500 fill-red-500' : 'text-white'
                      }`}
                    />
                  </button>
                  <button
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 rounded-full bg-slate-950/80 backdrop-blur-md text-slate-300 hover:text-red-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Title & Info */}
              <div className="p-2.5 flex flex-col gap-0.5">
                <h4 className="text-xs font-bold text-slate-200 truncate">
                  {item.type === 'song'
                    ? (item as GeneratedSong).title
                    : (item as GeneratedImage | GeneratedVideo).prompt}
                </h4>
                <span className="text-[10px] text-slate-400">
                  {new Date(item.createdAt).toLocaleDateString('ar-EG')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Item Detail Modal */}
      {activeItem && (
        <div
          onClick={() => setActiveItem(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden p-4 flex flex-col gap-3 relative max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-300">
                {activeItem.type === 'image'
                  ? 'عرض الصورة بدقة فائقة'
                  : activeItem.type === 'video'
                  ? 'مشغل الفيديو'
                  : 'تفاصيل الأغنية واللحن'}
              </span>
              <button
                onClick={() => setActiveItem(null)}
                className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Media Content */}
            {activeItem.type === 'image' && (
              <div className="rounded-2xl overflow-hidden bg-slate-950 max-h-80 flex items-center justify-center">
                <img
                  src={(activeItem as GeneratedImage).imageUrl}
                  alt="Full preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-auto object-contain max-h-80"
                />
              </div>
            )}

            {activeItem.type === 'video' && (
              <div className="rounded-2xl overflow-hidden bg-black max-h-80 flex items-center justify-center">
                <video
                  src={(activeItem as GeneratedVideo).videoUrl}
                  controls
                  autoPlay
                  loop
                  playsInline
                  className="w-full max-h-80 object-contain"
                />
              </div>
            )}

            {activeItem.type === 'song' && (
              <div className="flex flex-col gap-3">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-900/40 to-purple-900/40 border border-pink-500/30 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{(activeItem as GeneratedSong).title}</h3>
                    <span className="text-xs text-pink-300">
                      {(activeItem as GeneratedSong).genre} • {(activeItem as GeneratedSong).scale}
                    </span>
                  </div>
                  <button
                    onClick={() => startMusicPlayback(activeItem as GeneratedSong)}
                    className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>تشغيل اللحن</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-950 rounded-xl max-h-44 overflow-y-auto text-xs space-y-2">
                  {(activeItem as GeneratedSong).lyrics.map((sec, i) => (
                    <div key={i} className="flex flex-col gap-0.5">
                      <span className="text-[10px] text-pink-400 font-bold">{sec.section}</span>
                      {sec.lines.map((l, j) => (
                        <p key={j} className="text-slate-300">
                          {l}
                        </p>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <p className="text-xs text-slate-300 bg-slate-950/70 p-2.5 rounded-xl border border-slate-800 leading-relaxed">
              {activeItem.type === 'song'
                ? `الموضوع: ${(activeItem as GeneratedSong).topic}`
                : (activeItem as GeneratedImage | GeneratedVideo).prompt}
            </p>

            {/* Download Link */}
            {activeItem.type === 'image' && (
              <a
                href={(activeItem as GeneratedImage).imageUrl}
                download="ai_creation.png"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                <span>تحميل الصورة بجودة كاملة</span>
              </a>
            )}

            {activeItem.type === 'video' && (
              <a
                href={(activeItem as GeneratedVideo).videoUrl}
                download="ai_video.mp4"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow"
              >
                <Download className="w-4 h-4" />
                <span>تحميل الفيديو MP4</span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
