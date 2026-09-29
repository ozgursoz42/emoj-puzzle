import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, ArrowRight, RotateCcw } from 'lucide-react';
import { EmotionMascot } from './EmotionMascot';
import { sound } from '../utils/audio';

interface VictoryModalProps {
  levelId: number;
  score: number;
  highScore: number;
  stars: number; // 1, 2, or 3
  rewardCoins: number;
  onNextLevel: () => void;
  onReplay: () => void;
  onHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  levelId,
  score,
  highScore,
  stars,
  rewardCoins,
  onNextLevel,
  onReplay,
  onHome,
}) => {
  useEffect(() => {
    sound.playWin();

    const safeConfetti = (opts: confetti.Options) => {
      try {
        const fn = typeof confetti === 'function' ? confetti : (confetti as unknown as { default: typeof confetti })?.default;
        if (typeof fn === 'function') {
          fn(opts);
        }
      } catch (err) {
        console.warn('Confetti error:', err);
      }
    };

    // Launch celebratory confetti burst
    safeConfetti({
      particleCount: 75,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FBBF24', '#FB7185', '#38BDF8', '#4ADE80', '#A855F7'],
    });
    const t = setTimeout(() => {
      safeConfetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      safeConfetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 350);

    return () => clearTimeout(t);
  }, []);

  const getVictoryTitle = () => {
    if (stars === 3) return 'EFSANEVİ!';
    if (stars === 2) return 'MÜKEMMEL!';
    return 'HARİKA!';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[340px] bg-gradient-to-b from-indigo-900/95 via-slate-900/95 to-slate-950/95 border-2 border-amber-400/80 rounded-3xl p-5 text-center text-white shadow-2xl overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Mascot Centerpiece */}
        <div className="flex justify-center -mt-2 mb-1">
          <EmotionMascot mood="party" subtitle="Tebrikler!" size={72} />
        </div>

        {/* Victory Title */}
        <h2 className="text-3xl font-black tracking-wider text-amber-300 drop-shadow-md mb-0.5">
          {getVictoryTitle()}
        </h2>
        <p className="text-xs font-bold text-amber-100/80 tracking-wide uppercase mb-3">
          Bölüm {levelId} Tamamlandı!
        </p>

        {/* Stars */}
        <div className="flex items-center justify-center gap-2 mb-4">
          {[1, 2, 3].map((s) => {
            const isEarned = s <= stars;
            return (
              <div
                key={s}
                className={`relative transition-all duration-300 transform ${
                  isEarned ? 'scale-110' : 'scale-90 opacity-40'
                }`}
                style={{
                  transitionDelay: `${s * 150}ms`,
                  marginTop: s === 2 ? '-8px' : '0px',
                }}
              >
                <Star
                  size={s === 2 ? 46 : 38}
                  className={
                    isEarned
                      ? 'fill-amber-400 text-amber-300 filter drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                      : 'text-slate-500'
                  }
                />
              </div>
            );
          })}
        </div>

        {/* Score & Rewards Card */}
        <div className="bg-white/10 rounded-2xl p-3 border border-white/10 mb-4 flex items-center justify-around">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Skor</div>
            <div className="text-xl font-black text-amber-300 tabular-nums">
              {score.toLocaleString('tr-TR')}
            </div>
            {highScore > 0 && score >= highScore && (
              <span className="text-[9px] font-bold text-emerald-400">YENİ REKOR!</span>
            )}
          </div>
          <div className="w-[1px] h-8 bg-white/15" />
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-300 tracking-wider">Ödül</div>
            <div className="text-xl font-black text-yellow-400 flex items-center justify-center gap-1">
              <span>+{rewardCoins}</span>
              <span className="text-sm">🪙</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          {levelId < 50 ? (
            <button
              onClick={() => {
                sound.playClick();
                onNextLevel();
              }}
              className="game-btn game-btn-green w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-base"
            >
              <span>SONRAKİ BÖLÜM</span>
              <ArrowRight size={20} />
            </button>
          ) : (
            <button
              onClick={() => {
                sound.playClick();
                onHome();
              }}
              className="game-btn game-btn-yellow w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-base"
            >
              <span>ANA MENÜYE DÖN</span>
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => {
                sound.playClick();
                onReplay();
              }}
              className="game-btn game-btn-purple flex-1 py-2.5 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold"
            >
              <RotateCcw size={15} />
              <span>TEKRAR OYNA</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                onHome();
              }}
              className="game-btn bg-slate-800 hover:bg-slate-700 text-slate-200 border-b-2 border-slate-950 flex-1 py-2.5 rounded-xl text-xs font-bold"
            >
              BÖLÜMLER
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
