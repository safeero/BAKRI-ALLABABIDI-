export type TabType = 'home' | 'images' | 'videos' | 'music' | 'gallery' | 'monetization';

export type AspectRatioType = '1:1' | '9:16' | '16:9' | '4:3' | '3:4';
export type ImageResolutionType = '512px' | '1K' | '2K' | '4K';

export interface GeneratedImage {
  id: string;
  type: 'image';
  prompt: string;
  imageUrl: string;
  aspectRatio: AspectRatioType;
  resolution: ImageResolutionType;
  style: string;
  createdAt: number;
  favorite?: boolean;
}

export interface GeneratedVideo {
  id: string;
  type: 'video';
  prompt: string;
  videoUrl: string;
  previewUrl: string;
  aspectRatio: string;
  resolution: string;
  style: string;
  cameraMotion: string;
  durationSeconds: number;
  createdAt: number;
  favorite?: boolean;
}

export interface LyricSection {
  section: string;
  lines: string[];
}

export interface GeneratedSong {
  id: string;
  type: 'song';
  title: string;
  topic: string;
  genre: string;
  mood: string;
  tempo: number;
  scale: string;
  lyrics: LyricSection[];
  musicalArrangement: string;
  productionNotes: string;
  createdAt: number;
  favorite?: boolean;
}

export type CreationItem = GeneratedImage | GeneratedVideo | GeneratedSong;

export interface CustomAdItem {
  id: string;
  title: string;
  desc: string;
  sponsor: string;
  cta: string;
  targetUrl: string;
  active: boolean;
}

export interface AdMobSettings {
  enabled: boolean;
  testMode: boolean;
  appId: string;
  bannerAdId: string;
  interstitialAdId: string;
  rewardedAdId: string;
  showBannerOnPages: boolean;
  interstitialFrequency: number; // e.g. every X generations
  rewardAdBonusCredits: number;
  totalImpressions: number;
  totalClicks: number;
  estimatedRPM: number; // e.g. $2.50
  customAds?: CustomAdItem[];
}
