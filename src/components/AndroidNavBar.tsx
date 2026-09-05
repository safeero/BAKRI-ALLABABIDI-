import React from 'react';
import { Home, Image as ImageIcon, Video, Music2, FolderHeart, DollarSign } from 'lucide-react';
import { TabType } from '../types';

interface AndroidNavBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  creationsCount: number;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({
  activeTab,
  onTabChange,
  creationsCount,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'الرئيسية', icon: Home },
    { id: 'images' as TabType, label: 'الصور', icon: ImageIcon },
    { id: 'videos' as TabType, label: 'فيديو', icon: Video },
    { id: 'music' as TabType, label: 'أغاني', icon: Music2 },
    {
      id: 'gallery' as TabType,
      label: 'إبداعاتي',
      icon: FolderHeart,
      badge: creationsCount > 0 ? creationsCount : undefined,
    },
    { id: 'monetization' as TabType, label: 'الإعلانات', icon: DollarSign },
  ];

  return (
    <nav className="w-full bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 pt-1 pb-2 flex flex-col items-center select-none z-30 shrink-0">
      <div className="w-full flex items-center justify-around max-w-lg">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-2xl transition-all duration-200 relative min-w-[54px] ${
                isActive
                  ? 'text-indigo-400 font-bold scale-105'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {/* Active pill indicator background */}
              <div
                className={`p-1.5 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-indigo-500/20 text-indigo-300' : 'bg-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>

              {/* Badge if available */}
              {tab.badge !== undefined && (
                <span className="absolute top-1 right-2 bg-indigo-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center leading-tight shadow">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Android System Gesture Navigation Pill */}
      <div className="w-32 h-1 bg-slate-700/60 rounded-full mt-2" />
    </nav>
  );
};
