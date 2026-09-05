import { CreationItem, AdMobSettings, GeneratedImage, GeneratedVideo, GeneratedSong } from '../types';

const CREATIONS_KEY = 'ai_android_creations_v1';
const ADMOB_KEY = 'ai_android_admob_settings_v1';

export const DEFAULT_ADMOB_SETTINGS: AdMobSettings = {
  enabled: true,
  testMode: true,
  appId: 'ca-app-pub-3940256099942544~3347511713', // Official Google Test App ID
  bannerAdId: 'ca-app-pub-3940256099942544/6300978111', // Official Test Banner
  interstitialAdId: 'ca-app-pub-3940256099942544/1033173712', // Official Test Interstitial
  rewardedAdId: 'ca-app-pub-3940256099942544/5224354917', // Official Test Rewarded
  showBannerOnPages: true,
  interstitialFrequency: 3,
  rewardAdBonusCredits: 50,
  totalImpressions: 1240,
  totalClicks: 38,
  estimatedRPM: 3.45,
  customAds: [
    {
      id: 'ad_1',
      title: 'متجر الهواتف الذكية - خصم 30%',
      desc: 'احصل على أحدث هواتف أندرويد مع ضمان سنتين وتوصيل مجاني.',
      sponsor: 'الراعي الرسمي',
      cta: 'اطلب الآن',
      targetUrl: 'https://google.com',
      active: true,
    },
    {
      id: 'ad_2',
      title: 'انضم لقناتنا على تيليجرام للحصول على تصاميم حصرية',
      desc: 'نشارك يومياً أحدث أوامر الذكاء الاصطناعي والصور عالية الدقة مجاناً.',
      sponsor: 'قناة المجتمع',
      cta: 'انضم الآن',
      targetUrl: 'https://telegram.org',
      active: true,
    },
  ],
};

// Initial featured creations to provide an inspiring experience right away
const INITIAL_CREATIONS: CreationItem[] = [
  {
    id: 'init_img_1',
    type: 'image',
    prompt: 'صقر عربي ملكي ذو عيون ذهبية يقف على كثيب رملي عند الغروب، إضاءة سينمائية، تفاصيل دقيقة 4K',
    imageUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '1:1',
    resolution: '4K',
    style: 'سينمائي هوليوود',
    createdAt: Date.now() - 3600000 * 5,
    favorite: true,
  } as GeneratedImage,
  {
    id: 'init_vid_1',
    type: 'video',
    prompt: 'لقطة درون سينمائية لمدينة الرياض المستقبلية 2030 مع أبراج زجاجية مضيئة وسيارات طائرة ذكية في سماء صافية',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    previewUrl: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1080&q=80',
    aspectRatio: '9:16',
    resolution: '1080p',
    style: 'سايبربانك مستقبلي',
    cameraMotion: 'تصوير طائرة درون (Drone Flyover)',
    durationSeconds: 6,
    createdAt: Date.now() - 3600000 * 3,
    favorite: true,
  } as GeneratedVideo,
  {
    id: 'init_song_1',
    type: 'song',
    title: 'نور الطموح والمجد',
    topic: 'أغنية طربية حماسية عن تحقيق الأحلام وصناعة المستحيل في عصر الذكاء الاصطناعي',
    genre: 'طرب عربي معاصر',
    mood: 'حماسي وملهم',
    tempo: 115,
    scale: 'Hijaz',
    lyrics: [
      {
        section: 'المقدمة (Intro)',
        lines: ['نغمٌ ينساب كضوء الفجر الباكر', 'يوقظ فينا حلم الغد الآمر'],
      },
      {
        section: 'المقطع الأول (Verse 1)',
        lines: [
          'ركبنا صهوة العزم وما ترددنا',
          'بأفكار الذكاء بنينا مجدنا',
          'رسمنا في سماء النور رايتنا',
          'ولا نرضى بغير القمة موطنا',
        ],
      },
      {
        section: 'اللازمة (Chorus)',
        lines: [
          'يا سائل الأيام عنا اسمع صدى الألحان',
          'نحن الذين تربعوا في قمة الإمكان',
          'نور الطموح يشع في كل الأوطان',
        ],
      },
    ],
    musicalArrangement: 'مزيج آسر من العود العراقي، آلة القانون، مع إيقاع شرقي حي وبيانو كلاسيكي.',
    productionNotes: 'طبقة صوتية دافئة وتوزيع استوديو محيطي ثلاثي الأبعاد.',
    createdAt: Date.now() - 3600000 * 1,
    favorite: true,
  } as GeneratedSong,
];

export function getStoredCreations(): CreationItem[] {
  try {
    const raw = localStorage.getItem(CREATIONS_KEY);
    if (!raw) {
      localStorage.setItem(CREATIONS_KEY, JSON.stringify(INITIAL_CREATIONS));
      return INITIAL_CREATIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_CREATIONS;
  }
}

export const getCreations = getStoredCreations;

export function saveCreation(item: CreationItem) {
  try {
    const list = getStoredCreations();
    const updated = [item, ...list.filter((i) => i.id !== item.id)];
    localStorage.setItem(CREATIONS_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save creation', err);
  }
}

export function deleteCreation(id: string) {
  try {
    const list = getStoredCreations();
    const updated = list.filter((i) => i.id !== id);
    localStorage.setItem(CREATIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function toggleFavoriteCreation(id: string) {
  try {
    const list = getStoredCreations();
    const updated = list.map((item) => (item.id === id ? { ...item, favorite: !item.favorite } : item));
    localStorage.setItem(CREATIONS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function getStoredAdMobSettings(): AdMobSettings {
  try {
    const raw = localStorage.getItem(ADMOB_KEY);
    if (!raw) {
      localStorage.setItem(ADMOB_KEY, JSON.stringify(DEFAULT_ADMOB_SETTINGS));
      return DEFAULT_ADMOB_SETTINGS;
    }
    return { ...DEFAULT_ADMOB_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_ADMOB_SETTINGS;
  }
}

export const getAdMobSettings = getStoredAdMobSettings;

export function saveAdMobSettings(settings: AdMobSettings) {
  try {
    localStorage.setItem(ADMOB_KEY, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save ad settings', err);
  }
}

export function recordAdImpression() {
  const settings = getStoredAdMobSettings();
  settings.totalImpressions += 1;
  saveAdMobSettings(settings);
}

export function recordAdClick() {
  const settings = getStoredAdMobSettings();
  settings.totalClicks += 1;
  saveAdMobSettings(settings);
}
