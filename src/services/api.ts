import { AspectRatioType, ImageResolutionType } from '../types';

export async function checkServerHealth() {
  try {
    const res = await fetch('/api/health');
    return await res.json();
  } catch {
    return { status: 'offline', hasApiKey: false };
  }
}

export async function apiEnhancePrompt(prompt: string, type: 'image' | 'video' | 'song') {
  const res = await fetch('/api/enhance-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, type }),
  });
  if (!res.ok) throw new Error('فشل تحسين النص');
  return await res.json();
}

export async function apiGenerateImage(params: {
  prompt: string;
  aspectRatio: AspectRatioType;
  imageSize: ImageResolutionType;
  style: string;
}) {
  const res = await fetch('/api/generate-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'فشل توليد الصورة');
  }
  return await res.json();
}

export async function apiEditImage(params: { imageBase64: string; prompt: string }) {
  const res = await fetch('/api/edit-image', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'فشل تعديل الصورة');
  }
  return await res.json();
}

export async function apiGenerateVideo(params: {
  prompt: string;
  aspectRatio: string;
  resolution: string;
  style: string;
  cameraMotion: string;
}) {
  const res = await fetch('/api/generate-video', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'فشل توليد الفيديو');
  }
  return await res.json();
}

export async function apiCheckVideoStatus(params: { videoId: string; operationName?: string }) {
  const res = await fetch('/api/video-status', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('فشل جلب حالة الفيديو');
  return await res.json();
}

export async function apiGenerateSong(params: {
  topic: string;
  genre: string;
  mood: string;
  vocal: string;
  tempo: string;
}) {
  const res = await fetch('/api/generate-song', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'فشل تأليف الأغنية');
  }
  return await res.json();
}
