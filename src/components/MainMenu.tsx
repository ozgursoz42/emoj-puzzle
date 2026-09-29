import React from 'react';
import { Play, Map, Calendar, Settings, HelpCircle, Star } from 'lucide-react';
import { EmojiAvatar } from './EmojiAvatar';
import { EmotionMascot } from './EmotionMascot';
import { PlayerProgress } from '../types/game';
import { sound } from '../utils/audio';

interface MainMenuProps {
  progress: PlayerProgress;
  onPlay: () => void;
  onOpenLevels: () => void;
  onOpenMissions: () => void;
  onOpenHowToPlay: () => void;
  onOpenSettings: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  progress,
  onPlay,
  onOpenLevels,
  onOpenMissions,
  onOpenHowToPlay,
  onOpenSettings,
}) => {
  // Calculate total stars earned
  const totalStars = Object.values(progress?.levelStars || {}).reduce((acc, curr) => acc + (curr || 0), 0);
  const coins = typeof progress?.coins === 'number' ? progress.coins : 120;
  const currentLevel = progress?.unlockedLevel || 1;

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center p-4 bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 text-white overflow-hidden select-none">
      {/* Decorative Floating Emojis in Background */}
      <div className="absolute top-12 left-4 opacity-50 pointer-events-none animate-float-soft">
        <EmojiAvatar type="joy" size={44} />
      </div>
      <div
        className="absolute top-24 right-5 opacity-50 pointer-events-none animate-float-soft"
        style={{ animationDelay: '1.2s' }}
      >
        <EmojiAvatar type="love" size={48} />
      </div>
      <div
        className="absolute bottom-28 left-6 opacity-40 pointer-events-none animate-float-soft"
        style={{ animationDelay: '0.8s' }}
      >
        <EmojiAvatar type="crazy" size={40} />
      </div>
      <div
        className="absolute bottom-36 right-6 opacity-40 pointer-events-none animate-float-soft"
        style={{ animationDelay: '1.6s' }}
      >
        <EmojiAvatar type="cool" size={42} />
      </div>

      {/* Top Bar: Player Stats (Stars & Coins) */}
      <div className="w-full max-w-sm flex items-center justify-between z-10 pt-2">
        {/* Stars */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-amber-400/40 shadow-sm backdrop-blur-md">
          <Star size={16} className="fill-amber-400 text-amber-300" />
          <span className="text-xs font-black text-amber-300 tabular-nums">
            {totalStars} <span className="text-[10px] text-slate-400 font-normal">/ 150</span>
          </span>
        </div>

        {/* Coins */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-yellow-400/40 shadow-sm backdrop-blur-md">
          <span className="text-sm">🪙</span>
          <span className="text-xs font-black text-yellow-300 tabular-nums">
            {coins.toLocaleString('tr-TR')}
          </span>
        </div>

        {/* Settings Icon */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenSettings();
          }}
          className="w-9 h-9 rounded-full bg-slate-800/80 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white active:scale-95 transition-all shadow-sm"
          title="Ayarlar"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* Center Hero Logo & Mascot */}
      <div className="flex-1 flex flex-col items-center justify-center my-auto z-10 text-center max-w-xs">
        {/* Central Animated Emotion Mascot */}
        <div className="mb-2">
          <EmotionMascot mood="happy" subtitle="Hadi Oynayalım!" size={84} />
        </div>

        {/* Big 3D Game Title */}
        <div className="space-y-0.5 mb-2 select-none">
          <div
            className="text-4xl sm:text-5xl font-black tracking-wider text-amber-300"
            style={{
              textShadow: '0 2px 0 #b45309, 0 4px 0 #78350f, 0 6px 0 #451a03, 0 8px 16px rgba(0,0,0,0.6)',
              letterSpacing: '0.05em',
            }}
          >
            EMOJİ
          </div>
          <div
            className="text-4xl sm:text-5xl font-black tracking-wider text-rose-400"
            style={{
              textShadow: '0 2px 0 #be123c, 0 4px 0 #881337, 0 6px 0 #4c0519, 0 8px 16px rgba(0,0,0,0.6)',
              letterSpacing: '0.05em',
            }}
          >
            PATLATMA
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm font-bold text-amber-100/90 tracking-wide mb-6 drop-shadow">
          “Emojileri patlat, zinciri oluştur!”
        </p>

        {/* BIG 3D "OYNA" (PLAY) BUTTON */}
        <button
          onClick={() => {
            sound.playClick();
            onPlay();
          }}
          className="game-btn game-btn-yellow w-64 py-4 rounded-3xl flex items-center justify-center gap-3 text-2xl font-black tracking-wider shadow-[0_10px_25px_rgba(245,158,11,0.5)] transform active:scale-95 relative overflow-hidden group"
        >
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent rounded-t-3xl pointer-events-none" />
          <Play size={28} className="fill-amber-900 text-amber-900 drop-shadow" />
          <span className="drop-shadow">OYNA</span>
        </button>

        <div className="text-[11px] font-bold text-amber-200/80 mt-2">
          Bölüm {currentLevel}
        </div>
      </div>

      {/* Bottom Action Menu Buttons */}
      <div className="w-full max-w-xs grid grid-cols-3 gap-2.5 z-10 pb-3">
        {/* Bölümler */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenLevels();
          }}
          className="game-btn bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-b-3 border-slate-950 py-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-[11px] font-bold"
        >
          <Map size={18} className="text-indigo-400" />
          <span>Bölümler</span>
        </button>

        {/* Günlük Görev */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenMissions();
          }}
          className="game-btn bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-b-3 border-slate-950 py-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-[11px] font-bold relative"
        >
          <div className="relative">
            <Calendar size={18} className="text-emerald-400" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <span>Görevler</span>
        </button>

        {/* Rehber / Nasıl Oynanır */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenHowToPlay();
          }}
          className="game-btn bg-slate-800/90 hover:bg-slate-700 text-slate-200 border-b-3 border-slate-950 py-3 rounded-2xl flex flex-col items-center justify-center gap-1 text-[11px] font-bold"
        >
          <HelpCircle size={18} className="text-amber-400" />
          <span>Rehber</span>
        </button>
      </div>
    </div>
  );
};
