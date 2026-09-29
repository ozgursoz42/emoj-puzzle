import React, { useState } from 'react';
import { X, Sparkles, HelpCircle } from 'lucide-react';
import { EmojiAvatar } from './EmojiAvatar';
import { EMOJI_INFO, OBSTACLE_INFO } from '../data/levels';
import { EmojiType, ObstacleType } from '../types/game';
import { sound } from '../utils/audio';

interface HowToPlayModalProps {
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'rules' | 'emojis' | 'powers' | 'obstacles'>('rules');

  const emojiList: EmojiType[] = [
    'joy', 'love', 'angry', 'fear', 'shock', 'cold', 'cool', 'crazy', 'sad', 'sleepy',
  ];

  const obstacleList: ObstacleType[] = ['ice', 'stone', 'bubble', 'lock'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-[390px] h-[580px] max-h-[92vh] bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 border-2 border-amber-400/60 rounded-3xl p-4 flex flex-col text-white shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-2">
            <HelpCircle size={22} className="text-amber-400" />
            <h2 className="text-lg font-black text-amber-300">NASIL OYNANIR?</h2>
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

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 py-2.5 border-b border-white/10 shrink-0">
          {[
            { id: 'rules', label: 'Kurallar' },
            { id: 'powers', label: 'Güçler' },
            { id: 'emojis', label: 'Emojiler' },
            { id: 'obstacles', label: 'Engeller' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id as typeof activeTab);
              }}
              className={`py-1.5 rounded-xl text-xs font-bold transition-all text-center ${
                activeTab === tab.id
                  ? 'bg-amber-400 text-slate-950 shadow-md font-black'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 px-1">
          {activeTab === 'rules' && (
            <div className="space-y-3 text-xs leading-relaxed text-slate-200">
              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                <div className="font-black text-amber-300 text-sm mb-1">🎯 1. Temel Amaç</div>
                <p>
                  Her bölümde belirtilen hedefleri (belirli emojileri toplamak veya engelleri kırmak) verilen hamle sayısı bitmeden tamamla!
                </p>
              </div>

              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                <div className="font-black text-emerald-300 text-sm mb-1">👆 2. Dokun ve Patlat</div>
                <p>
                  Birbirine bağlı en az 2 aynı emojiden oluşan gruba dokunduğunda grup anında patlar. Büyük gruplar daha fazla skor ve özel güç kazandırır!
                </p>
              </div>

              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                <div className="font-black text-purple-300 text-sm mb-1">⚡ 3. Kombo Zinciri</div>
                <p>
                  Arka arkaya hızlı patlatmalar yaptığında COMBO x2, x3, x4 çarpanları devreye girer ve rekor puanlar kazandırır!
                </p>
              </div>

              <div className="bg-white/10 p-3.5 rounded-2xl border border-white/10">
                <div className="font-black text-rose-300 text-sm mb-1">😀 4. Duygu Karakteri</div>
                <p>
                  Ekranın üstündeki sevimli Duygu Karakteri oyun performansına canlı olarak tepki verir. Başarılarında sevinir, harika zincirlerde alev alır!
                </p>
              </div>
            </div>
          )}

          {activeTab === 'powers' && (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-red-950/60 to-slate-900 p-3 rounded-2xl border border-red-500/30 flex items-center gap-3">
                <EmojiAvatar type="joy" power="rocket" size={48} />
                <div className="text-xs">
                  <div className="font-black text-amber-300 text-sm">4 Emoji: Roket 🚀</div>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    Tüm satır ve sütundaki emojileri lazer hızıyla temizler.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-amber-950/60 to-slate-900 p-3 rounded-2xl border border-amber-500/30 flex items-center gap-3">
                <EmojiAvatar type="love" power="bomb" size={48} />
                <div className="text-xs">
                  <div className="font-black text-amber-300 text-sm">5 Emoji: Alan Bombası 💣</div>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    Çevresindeki 3x3 alandaki tüm emojileri ve sert engelleri havaya uçurur.
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-950/60 to-slate-900 p-3 rounded-2xl border border-purple-500/30 flex items-center gap-3">
                <EmojiAvatar type="shock" power="shock_blast" size={48} />
                <div className="text-xs">
                  <div className="font-black text-purple-300 text-sm">6+ Emoji: Gökkuşağı Şok ⚡</div>
                  <p className="text-slate-300 text-[11px] mt-0.5">
                    Devasa 5x5 alanı patlatır ve tahtadaki tüm aynı tür emojilere elektrik arkı gönderir!
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'emojis' && (
            <div className="space-y-2">
              {emojiList.map((type) => {
                const info = EMOJI_INFO[type];
                return (
                  <div
                    key={type}
                    className="bg-white/5 hover:bg-white/10 p-2.5 rounded-2xl border border-white/10 flex items-center gap-3 transition-colors"
                  >
                    <EmojiAvatar type={type} size={42} />
                    <div className="flex-1">
                      <div className="font-black text-xs text-amber-300 flex items-center gap-1">
                        <span>{info.icon}</span>
                        <span>{info.name}</span>
                      </div>
                      <p className="text-slate-300 text-[11px] leading-tight mt-0.5">
                        {info.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'obstacles' && (
            <div className="space-y-3">
              {obstacleList.map((obs) => {
                const info = OBSTACLE_INFO[obs];
                return (
                  <div
                    key={obs}
                    className="bg-white/10 p-3 rounded-2xl border border-white/10 flex items-center gap-3"
                  >
                    <EmojiAvatar type="joy" obstacle={obs} obstacleHp={obs === 'stone' ? 2 : 1} size={46} />
                    <div>
                      <div className="font-black text-sm text-amber-300 flex items-center gap-1.5">
                        <span>{info.icon}</span>
                        <span>{info.name}</span>
                      </div>
                      <p className="text-slate-300 text-xs mt-0.5">{info.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="pt-2 border-t border-white/10 shrink-0">
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="game-btn game-btn-yellow w-full py-2.5 rounded-xl font-black text-xs"
          >
            ANLADIM, OYNA!
          </button>
        </div>
      </div>
    </div>
  );
};
