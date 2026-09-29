import React from 'react';
import { X, Calendar, CheckCircle2, Gift } from 'lucide-react';
import { PlayerProgress } from '../types/game';
import { sound } from '../utils/audio';

interface DailyMissionsModalProps {
  progress: PlayerProgress;
  onClaimReward: (missionId: string, reward: number) => void;
  onClose: () => void;
}

export const DailyMissionsModal: React.FC<DailyMissionsModalProps> = ({
  progress,
  onClaimReward,
  onClose,
}) => {
  const missions = [
    {
      id: 'pop_emojis',
      title: '50 Emoji Patlat',
      progress: Math.min(progress.dailyMissions.poppedCount || 0, 50),
      total: 50,
      reward: 60,
    },
    {
      id: 'do_combos',
      title: '3 Kez Yüksek Kombo Yap (x3+)',
      progress: Math.min(progress.dailyMissions.combosCount || 0, 3),
      total: 3,
      reward: 80,
    },
    {
      id: 'beat_levels',
      title: '2 Bölüm Başarıyla Geç',
      progress: Math.min(progress.dailyMissions.levelsCompleted || 0, 2),
      total: 2,
      reward: 100,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[360px] bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 border-2 border-emerald-400/60 rounded-3xl p-4 flex flex-col text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <Calendar size={22} className="text-emerald-400" />
            <div>
              <h2 className="text-lg font-black text-emerald-300">GÜNLÜK GÖREVLER</h2>
              <div className="text-[10px] text-slate-400">Her gün yenilenir ve ödül kazandırır!</div>
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

        {/* Missions List */}
        <div className="py-4 space-y-3">
          {missions.map((m) => {
            const isCompleted = m.progress >= m.total;
            const isClaimed = !!progress.dailyMissions.claimed?.[m.id];

            return (
              <div
                key={m.id}
                className="bg-white/10 p-3 rounded-2xl border border-white/10 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white">{m.title}</span>
                  <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                    <span>+{m.reward}</span>
                    <span>🪙</span>
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${(m.progress / m.total) * 100}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="text-slate-400 font-bold">
                    {m.progress} / {m.total}
                  </span>

                  {isClaimed ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      <span>Alındı</span>
                    </span>
                  ) : isCompleted ? (
                    <button
                      onClick={() => {
                        sound.playWin();
                        onClaimReward(m.id, m.reward);
                      }}
                      className="game-btn game-btn-green px-3 py-1 rounded-lg text-xs font-black flex items-center gap-1"
                    >
                      <Gift size={13} />
                      <span>Ödülü Al</span>
                    </button>
                  ) : (
                    <span className="text-slate-500 font-medium">Devam Ediyor</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <div className="pt-2 border-t border-white/10 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="game-btn game-btn-purple w-full py-2.5 rounded-xl font-black text-xs"
          >
            TAMAM
          </button>
        </div>
      </div>
    </div>
  );
};
