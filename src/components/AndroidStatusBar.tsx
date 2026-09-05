import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Sparkles, Smartphone } from 'lucide-react';

interface AndroidStatusBarProps {
  isPhoneFrame: boolean;
  onToggleFrame: () => void;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({ isPhoneFrame, onToggleFrame }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const mins = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${mins}`);
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-md px-4 py-2 flex items-center justify-between text-xs text-slate-400 select-none border-b border-slate-900 z-30">
      {/* Left side: Time and AI app indicator */}
      <div className="flex items-center gap-2 font-medium tracking-tight">
        <span className="text-slate-200 font-semibold">{time || '10:24'}</span>
        <span className="flex items-center gap-1 text-[11px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded-full border border-indigo-500/30">
          <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
          <span>AI Studio</span>
        </span>
      </div>

      {/* Center: Device frame switch button */}
      <button
        onClick={onToggleFrame}
        title={isPhoneFrame ? 'التبديل إلى وضع ملء الشاشة' : 'التبديل إلى إطار هاتف أندرويد'}
        className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-slate-800/80 hover:bg-slate-800 text-slate-300 transition-colors border border-slate-700/50"
      >
        <Smartphone className="w-3 h-3 text-indigo-400" />
        <span className="hidden sm:inline">{isPhoneFrame ? 'ملء الشاشة' : 'إطار هاتف أندرويد'}</span>
      </button>

      {/* Right side: 5G, Wi-Fi, Battery */}
      <div className="flex items-center gap-2 text-slate-300">
        <span className="font-bold text-[10px] tracking-tighter text-slate-400">5G</span>
        <Wifi className="w-3.5 h-3.5 text-slate-300" />
        <div className="flex items-center gap-0.5">
          <span className="text-[10px] font-medium text-emerald-400">100%</span>
          <BatteryMedium className="w-4 h-4 text-emerald-400" />
        </div>
      </div>
    </header>
  );
};
