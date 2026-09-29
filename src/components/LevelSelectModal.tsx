import React, { useState } from 'react';
import { X, Lock, Star } from 'lucide-react';
import { LEVELS } from '../data/levels';
import { PlayerProgress } from '../types/game';
import { sound } from '../utils/audio';

interface LevelSelectModalProps {
  progress: PlayerProgress;
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  progress,
  onSelectLevel,
  onClose,
}) => {
  const [selectedRange, setSelectedRange] = useState<number>(() => {
    // Default to the tab containing player's current unlocked level
    const current = progress.unlockedLevel;
    if (current <= 10) return 0;
    if (current <= 20) return 1;
    if (current <= 30) return 2;
    if (current <= 40) return 3;
    return 4;
  });

  const tabs = [
    { label: '1 - 10', range: [1, 10], tag: 'Başlangıç' },
    { label: '11 - 20', range: [11, 20], tag: 'Güçler' },
    { label: '21 - 30', range: [21, 30], tag: 'Engeller' },
    { label: '31 - 40', range: [31, 40], tag: 'Uzman' },
    { label: '41 - 50', range: [41, 50], tag: 'Efsane' },
  ];

  const currentTab = tabs[selectedRange];
  const displayedLevels = LEVELS.filter(
    (l) => l.id >= currentTab.range[0] && l.id <= currentTab.range[1]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[390px] h-[580px] max-h-[92vh] bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 border-2 border-indigo-500/50 rounded-3xl p-4 flex flex-col text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div>
            <h2 className="text-xl font-black text-amber-300 drop-shadow-sm">BÖLÜMLER</h2>
            <div className="text-[11px] font-bold text-slate-300">
              Açılan: <span className="text-amber-400">{progress.unlockedLevel}</span> / 50 Bölüm
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-slate-300 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Range Tabs */}
        <div className="flex gap-1.5 py-2 overflow-x-auto no-scrollbar shrink-0">
          {tabs.map((tab, idx) => {
            const isActive = idx === selectedRange;
            const isUnlocked = progress.unlockedLevel >= tab.range[0];
            return (
              <button
                key={idx}
                onClick={() => {
                  sound.playClick();
                  setSelectedRange(idx);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex flex-col items-center ${
                  isActive
                    ? 'bg-amber-400 text-slate-900 shadow-md scale-105'
                    : isUnlocked
                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    : 'bg-slate-900/60 text-slate-500 opacity-60'
                }`}
              >
                <span>{tab.label}</span>
                <span className="text-[9px] font-normal opacity-80">{tab.tag}</span>
              </button>
            );
          })}
        </div>

        {/* Levels Grid (10 levels per screen, perfectly scrollable or 2x5 grid) */}
        <div className="flex-1 overflow-y-auto py-3 px-1">
          <div className="grid grid-cols-2 gap-3">
            {displayedLevels.map((lvl) => {
              const isUnlocked = lvl.id <= progress.unlockedLevel;
              const isCurrent = lvl.id === progress.unlockedLevel;
              const stars = progress.levelStars[lvl.id] || 0;
              const highScore = progress.levelHighScores[lvl.id] || 0;

              return (
                <button
                  key={lvl.id}
                  onClick={() => {
                    if (isUnlocked) {
                      sound.playClick();
                      onSelectLevel(lvl.id);
                    } else {
                      sound.playInvalid();
                    }
                  }}
                  disabled={!isUnlocked}
                  className={`relative p-3 rounded-2xl flex flex-col items-center justify-between transition-all select-none ${
                    isCurrent
                      ? 'game-btn game-btn-yellow ring-4 ring-amber-300/60 scale-102'
                      : isUnlocked
                      ? 'game-btn bg-gradient-to-b from-indigo-700 to-indigo-900 border-b-4 border-indigo-950 text-white hover:brightness-110'
                      : 'bg-slate-800/50 border border-slate-700/50 text-slate-500 cursor-not-allowed opacity-60'
                  }`}
                >
                  {/* Top Level ID Badge */}
                  <div className="w-full flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-black px-2 py-0.5 rounded-full ${
                        isCurrent
                          ? 'bg-amber-800 text-amber-100'
                          : isUnlocked
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      #{lvl.id}
                    </span>
                    {isUnlocked ? (
                      highScore > 0 ? (
                        <span className="text-[10px] font-bold text-amber-200 tabular-nums">
                          {highScore.toLocaleString('tr-TR')}
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-emerald-300">YENİ!</span>
                      )
                    ) : (
                      <Lock size={14} className="text-slate-500" />
                    )}
                  </div>

                  {/* Level Title */}
                  <div
                    className={`text-xs font-black truncate max-w-[120px] text-center my-1.5 ${
                      isCurrent ? 'text-amber-950' : isUnlocked ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    {lvl.title}
                  </div>

                  {/* Stars Won */}
                  <div className="flex items-center gap-1 mt-1">
                    {[1, 2, 3].map((s) => (
                      <Star
                        key={s}
                        size={15}
                        className={
                          isUnlocked && s <= stars
                            ? 'fill-amber-400 text-amber-300 drop-shadow'
                            : 'text-slate-600/60'
                        }
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Bottom Quick Play */}
        <div className="pt-2 border-t border-white/10 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onSelectLevel(progress.unlockedLevel);
            }}
            className="game-btn game-btn-green w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-black"
          >
            <span>BÖLÜM {progress.unlockedLevel}'İ OYNA</span>
          </button>
        </div>
      </div>
    </div>
  );
};
