import React, { useEffect } from 'react';
import { RotateCcw, PlusCircle, ArrowLeft } from 'lucide-react';
import { EmotionMascot } from './EmotionMascot';
import { sound } from '../utils/audio';

interface DefeatModalProps {
  levelId: number;
  playerCoins: number;
  onRetry: () => void;
  onBuyMoves: () => void;
  onHome: () => void;
}

export const DefeatModal: React.FC<DefeatModalProps> = ({
  levelId,
  playerCoins,
  onRetry,
  onBuyMoves,
  onHome,
}) => {
  useEffect(() => {
    sound.playDefeat();
  }, []);

  const canAffordExtraMoves = playerCoins >= 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[330px] bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 border-2 border-rose-500/80 rounded-3xl p-5 text-center text-white shadow-2xl overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-10 -left-10 w-28 h-28 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Mascot Centerpiece */}
        <div className="flex justify-center -mt-2 mb-1">
          <EmotionMascot mood="sad" subtitle="Bir dahakine!" size={72} />
        </div>

        <h2 className="text-2xl font-black tracking-wide text-rose-400 drop-shadow-md mb-1">
          HAMLE KALMADI!
        </h2>
        <p className="text-xs font-medium text-slate-300 mb-4">
          Bölüm {levelId} hedeflerine çok yaklaştın. Pes etme!
        </p>

        {/* Extra Moves Offer */}
        <div className="bg-white/10 rounded-2xl p-3 border border-white/10 mb-4 text-left">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-bold text-amber-300">Ekstra 5 Hamle İster misin?</div>
            <div className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
              <span>Bakiye: {playerCoins}</span>
              <span>🪙</span>
            </div>
          </div>
          <button
            onClick={() => {
              if (canAffordExtraMoves) {
                sound.playClick();
                onBuyMoves();
              } else {
                sound.playInvalid();
              }
            }}
            disabled={!canAffordExtraMoves}
            className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all ${
              canAffordExtraMoves
                ? 'game-btn game-btn-yellow'
                : 'bg-slate-700/60 text-slate-400 cursor-not-allowed border-none'
            }`}
          >
            <PlusCircle size={16} />
            <span>+5 Hamle Al (100 🪙)</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onRetry();
            }}
            className="game-btn game-btn-coral w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm"
          >
            <RotateCcw size={18} />
            <span>TEKRAR DENE</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onHome();
            }}
            className="game-btn bg-slate-800 hover:bg-slate-700 text-slate-300 border-b-2 border-slate-950 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <ArrowLeft size={15} />
            <span>BÖLÜMLERE DÖN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
