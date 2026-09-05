import React, { useState, useEffect } from 'react';
import { TabType, CreationItem, AdMobSettings } from './types';
import { getCreations, getAdMobSettings } from './utils/storage';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidNavBar } from './components/AndroidNavBar';
import { AdBanner } from './components/AdBanner';
import { InterstitialAdModal } from './components/InterstitialAdModal';
import { RewardedAdModal } from './components/RewardedAdModal';
import { HomeFeed } from './components/HomeFeed';
import { ImageStudio } from './components/ImageStudio';
import { VideoStudio } from './components/VideoStudio';
import { MusicStudio } from './components/MusicStudio';
import { CreationsGallery } from './components/CreationsGallery';
import { MonetizationCenter } from './components/MonetizationCenter';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [creations, setCreations] = useState<CreationItem[]>([]);
  const [adSettings, setAdSettings] = useState<AdMobSettings>(getAdMobSettings());
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [showRewarded, setShowRewarded] = useState(false);
  const [hasTurboBonus, setHasTurboBonus] = useState(false);

  // Load initial data
  useEffect(() => {
    setCreations(getCreations());
    setAdSettings(getAdMobSettings());
  }, []);

  const handleCreationAdded = (newItem: CreationItem) => {
    setCreations((prev) => [newItem, ...prev.filter((item) => item.id !== newItem.id)]);
  };

  const handleRewardGranted = () => {
    setHasTurboBonus(true);
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center justify-center font-sans antialiased overflow-x-hidden selection:bg-indigo-500 selection:text-white"
    >
      {/* Outer wrapper: Android Phone Mockup frame or Full Width container */}
      <div
        className={`w-full flex flex-col h-screen overflow-hidden transition-all duration-300 relative ${
          isPhoneFrame
            ? 'max-w-[440px] md:h-[92vh] md:max-h-[890px] md:rounded-[42px] md:border-[10px] md:border-slate-850 md:shadow-[0_25px_70px_rgba(0,0,0,0.8)]'
            : 'max-w-full h-screen rounded-none border-0'
        }`}
      >
        {/* Android Top Notch Camera Pin Hole (in phone frame mode) */}
        {isPhoneFrame && (
          <div className="hidden md:flex absolute top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-black rounded-full border border-slate-800 z-40 items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-900" />
          </div>
        )}

        {/* 1. Android Status Bar (Time, 5G, Wi-Fi, Battery, Frame Toggle) */}
        <AndroidStatusBar
          isPhoneFrame={isPhoneFrame}
          onToggleFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        />

        {/* 2. Main Scrollable Screen Content */}
        <main className="flex-1 overflow-y-auto overscroll-contain bg-slate-950 flex flex-col">
          {activeTab === 'home' && (
            <HomeFeed
              onNavigate={(tab) => setActiveTab(tab)}
              onOpenRewardedAd={() => setShowRewarded(true)}
              hasTurboBonus={hasTurboBonus}
            />
          )}

          {activeTab === 'images' && (
            <ImageStudio
              onCreationAdded={handleCreationAdded}
              onRequestInterstitialAd={() => {
                if (adSettings.enabled) setShowInterstitial(true);
              }}
              hasTurboBonus={hasTurboBonus}
            />
          )}

          {activeTab === 'videos' && (
            <VideoStudio
              onCreationAdded={handleCreationAdded}
              onRequestInterstitialAd={() => {
                if (adSettings.enabled) setShowInterstitial(true);
              }}
              hasTurboBonus={hasTurboBonus}
            />
          )}

          {activeTab === 'music' && (
            <MusicStudio
              onCreationAdded={handleCreationAdded}
              onRequestInterstitialAd={() => {
                if (adSettings.enabled) setShowInterstitial(true);
              }}
              hasTurboBonus={hasTurboBonus}
            />
          )}

          {activeTab === 'gallery' && (
            <CreationsGallery
              creations={creations}
              onCreationsUpdated={(items) => setCreations(items)}
            />
          )}

          {activeTab === 'monetization' && (
            <MonetizationCenter
              settings={adSettings}
              onSettingsUpdated={(newSettings) => setAdSettings(newSettings)}
              onTestInterstitial={() => setShowInterstitial(true)}
              onTestRewarded={() => setShowRewarded(true)}
            />
          )}
        </main>

        {/* 3. Simulated AdMob Bottom Banner */}
        <AdBanner
          settings={adSettings}
          onOpenSettings={() => setActiveTab('monetization')}
        />

        {/* 4. Android Bottom Navigation Bar & Gesture Pill */}
        <AndroidNavBar
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab)}
          creationsCount={creations.length}
        />

        {/* 5. Interstitial Ad Modal (Full screen simulation) */}
        <InterstitialAdModal
          isOpen={showInterstitial}
          onClose={() => setShowInterstitial(false)}
          adUnitId={adSettings.interstitialAdId}
          customAd={(adSettings.customAds || []).find((a) => a.active)}
        />

        {/* 6. Rewarded Ad Modal */}
        <RewardedAdModal
          isOpen={showRewarded}
          onClose={() => setShowRewarded(false)}
          onRewardGranted={handleRewardGranted}
        />
      </div>
    </div>
  );
}
