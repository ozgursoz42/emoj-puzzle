import React, { useState } from 'react';
import { X, Volume2, VolumeX, Smartphone, RotateCcw, ShieldAlert } from 'lucide-react';
import { sound } from '../utils/audio';

interface SettingsModalProps {
  onClose: () => void;
  onResetProgress: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, onResetProgress }) => {
  const [soundEnabled, setSoundEnabled] = useState(sound.getSoundEnabled());
  const [hapticsEnabled, setHapticsEnabled] = useState(sound.getHapticsEnabled());
  const [confirmReset, setConfirmReset] = useState(false);

  const toggleSound = () => {
    const newVal = !soundEnabled;
    setSoundEnabled(newVal);
    sound.setSoundEnabled(newVal);
    if (newVal) sound.playClick();
  };

  const toggleHaptics = () => {
    const newVal = !hapticsEnabled;
    setHapticsEnabled(newVal);
    sound.setHapticsEnabled(newVal);
    if (newVal) sound.vibrate(25);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[340px] bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 border-2 border-indigo-400/50 rounded-3xl p-5 text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <h2 className="text-xl font-black text-amber-300">AYARLAR</h2>
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

        {/* Options */}
        <div className="py-4 space-y-3">
          {/* Sound Toggle */}
          <div className="bg-white/10 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {soundEnabled ? (
                <Volume2 size={20} className="text-emerald-400" />
              ) : (
                <VolumeX size={20} className="text-slate-500" />
              )}
              <span className="text-xs font-bold text-white">Ses Efektleri</span>
            </div>
            <button
              onClick={toggleSound}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Haptics Toggle */}
          <div className="bg-white/10 p-3 rounded-2xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Smartphone size={20} className="text-amber-400" />
              <span className="text-xs font-bold text-white">Titreşim Geri Bildirimi</span>
            </div>
            <button
              onClick={toggleHaptics}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                hapticsEnabled ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  hapticsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Reset Progress */}
          <div className="pt-2">
            {!confirmReset ? (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <RotateCcw size={14} />
                <span>İlerlemeyi Sıfırla</span>
              </button>
            ) : (
              <div className="p-3 rounded-2xl bg-rose-950/80 border border-rose-500/50 space-y-2">
                <div className="flex items-center gap-2 text-rose-300 text-xs font-bold">
                  <ShieldAlert size={16} />
                  <span>Emin misin? Tüm yıldızlar silinir.</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      sound.playClick();
                      onResetProgress();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                  >
                    Evet, Sıfırla
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 font-bold text-xs"
                  >
                    Vazgeç
                  </button>
                </div>
              </div>
            )}
          </div>
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
            KAPAT
          </button>
        </div>
      </div>
    </div>
  );
};
