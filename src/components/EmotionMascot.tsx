import React, { useState, useEffect } from 'react';
import { MascotMood } from '../types/game';
import { sound } from '../utils/audio';

interface EmotionMascotProps {
  mood: MascotMood;
  subtitle?: string;
  size?: number; // default 68
  onTap?: () => void;
}

export const EmotionMascot: React.FC<EmotionMascotProps> = ({
  mood,
  subtitle,
  size = 64,
  onTap,
}) => {
  const [bounce, setBounce] = useState(false);

  useEffect(() => {
    setBounce(true);
    const t = setTimeout(() => setBounce(false), 400);
    return () => clearTimeout(t);
  }, [mood]);

  const handleTap = () => {
    sound.playClick();
    setBounce(true);
    setTimeout(() => setBounce(false), 300);
    if (onTap) onTap();
  };

  // Get mood comment
  const getMoodComment = () => {
    if (subtitle) return subtitle;
    switch (mood) {
      case 'idle':
        return 'Hazır mısın?';
      case 'happy':
        return 'Güzel hamle!';
      case 'love':
        return 'Harika bağ!';
      case 'star':
        return 'Süpersin! ⭐';
      case 'shock':
        return 'Aklım uçtu! 🤯';
      case 'fire':
        return 'ALEV ALDIN! 🔥';
      case 'worried':
        return 'Dikkatli ol...';
      case 'angry':
        return 'Hamle kalıyor!';
      case 'party':
        return 'KAZANDIN! 🎉';
      case 'sad':
        return 'Tekrar dene!';
      default:
        return '';
    }
  };

  return (
    <div
      onClick={handleTap}
      className={`relative inline-flex flex-col items-center justify-center cursor-pointer select-none transition-transform duration-200 ${
        bounce ? 'scale-115 -translate-y-1.5' : 'hover:scale-105'
      }`}
    >
      {/* Speech Bubble / Mood Tag */}
      <div className="absolute -top-6 px-2.5 py-0.5 rounded-full bg-white text-slate-900 font-extrabold text-[11px] shadow-lg border border-amber-300 whitespace-nowrap z-20 pointer-events-none transform -translate-y-0.5 animate-bounce">
        {getMoodComment()}
        {/* Little bubble triangle */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-r border-b border-amber-300" />
      </div>

      {/* SVG Volumetric 3D Mascot Character */}
      <svg
        viewBox="0 0 64 66"
        width={size}
        height={size * 1.03}
        className="overflow-visible filter drop-shadow-xl"
      >
        <defs>
          {/* 3D Body Spherical Gradient */}
          <radialGradient id="mascot-body-3d" cx="35%" cy="26%" r="75%">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="35%" stopColor="#FACC15" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </radialGradient>

          {/* 3D Fire Sphere Gradient */}
          <radialGradient id="mascot-fire-3d" cx="35%" cy="24%" r="75%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="35%" stopColor="#F97316" />
            <stop offset="70%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#7F1D1D" />
          </radialGradient>

          {/* 3D Specular Highlight */}
          <linearGradient id="mascot-specular" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
          </linearGradient>

          {/* Bottom Rim Bounce Light */}
          <linearGradient id="mascot-rim-bounce" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
          </linearGradient>

          {/* 3D Party Hat Gradient */}
          <linearGradient id="party-hat-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F43F5E" />
            <stop offset="50%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>

          <filter id="mascot-feature-shadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#000000" floodOpacity="0.4" />
          </filter>

          <filter id="mascot-blur-soft">
            <feGaussianBlur stdDeviation="1.8" />
          </filter>
        </defs>

        {/* 3D Ground Contact Shadow */}
        <ellipse cx="32" cy="60" rx="20" ry="4.5" fill="#000000" opacity="0.35" filter="url(#mascot-blur-soft)" />

        {/* Fire Aura if mood === 'fire' */}
        {mood === 'fire' && (
          <g className="animate-pulse">
            <path
              d="M 12 28 C 6 16, 20 6, 26 12 C 32 4, 46 10, 48 24 C 58 16, 56 36, 44 48 C 32 58, 16 54, 12 28 Z"
              fill="#F97316"
              opacity="0.45"
            />
            <path
              d="M 18 26 C 14 18, 24 10, 30 14 C 36 8, 44 14, 42 26 C 48 22, 46 36, 38 42 C 28 48, 18 44, 18 26 Z"
              fill="#FACC15"
              opacity="0.65"
            />
          </g>
        )}

        {/* Main 3D Spherical Body */}
        <circle
          cx="32"
          cy="32"
          r="26"
          fill={mood === 'fire' ? 'url(#mascot-fire-3d)' : 'url(#mascot-body-3d)'}
        />

        {/* 3D Rim Bounce Light on bottom */}
        <path
          d="M 16 48 A 26 26 0 0 0 52 32 A 26 26 0 0 1 16 48 Z"
          fill="url(#mascot-rim-bounce)"
          opacity="0.6"
        />

        {/* Primary Specular 3D Gloss */}
        <ellipse cx="28" cy="16" rx="16" ry="7" fill="url(#mascot-specular)" />
        <circle cx="21" cy="13" r="2.8" fill="#FFFFFF" opacity="0.9" />

        {/* 3D Soft Blush Cheeks */}
        {(mood === 'happy' || mood === 'love' || mood === 'star' || mood === 'party') && (
          <>
            <ellipse cx="15" cy="37" rx="5.5" ry="3.5" fill="#FB7185" opacity="0.65" filter="url(#mascot-blur-soft)" />
            <ellipse cx="49" cy="37" rx="5.5" ry="3.5" fill="#FB7185" opacity="0.65" filter="url(#mascot-blur-soft)" />
          </>
        )}

        {/* Mood-Specific 3D Face Features */}
        {mood === 'idle' && (
          <g filter="url(#mascot-feature-shadow)">
            {/* Friendly Round 3D Eyes */}
            <circle cx="22" cy="28" r="4.5" fill="#451A03" />
            <circle cx="20.5" cy="26" r="1.8" fill="#FFFFFF" />
            <circle cx="23" cy="29.5" r="0.8" fill="#FFFFFF" opacity="0.8" />

            <circle cx="42" cy="28" r="4.5" fill="#451A03" />
            <circle cx="40.5" cy="26" r="1.8" fill="#FFFFFF" />
            <circle cx="43" cy="29.5" r="0.8" fill="#FFFFFF" opacity="0.8" />

            {/* Gentle Smile */}
            <path d="M 24 38 Q 32 44 40 38" stroke="#451A03" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {mood === 'happy' && (
          <g filter="url(#mascot-feature-shadow)">
            {/* Squint Joyful Eyes */}
            <path d="M 16 28 Q 22 19 28 28" stroke="#451A03" strokeWidth="3.6" strokeLinecap="round" fill="none" />
            <path d="M 36 28 Q 42 19 48 28" stroke="#451A03" strokeWidth="3.6" strokeLinecap="round" fill="none" />

            {/* Big Smile with 3D Tongue */}
            <path d="M 20 36 Q 32 51 44 36 Z" fill="#451A03" />
            <path d="M 25 41 Q 32 51 39 41 Z" fill="#F43F5E" />
            <path d="M 22 36 Q 32 40 42 36" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {mood === 'love' && (
          <g filter="url(#mascot-feature-shadow)">
            {/* 3D Heart Eyes */}
            <g transform="translate(22, 26) scale(0.72) translate(-15, -15)">
              <path
                d="M 15 26 C 9 20, 2 13, 2 8 A 6 6 0 0 1 14 6 L 15 8 L 16 6 A 6 6 0 0 1 28 8 C 28 13, 21 20, 15 26 Z"
                fill="#E11D48"
              />
              <circle cx="9" cy="8" r="2.2" fill="#FFFFFF" />
            </g>
            <g transform="translate(42, 26) scale(0.72) translate(-15, -15)">
              <path
                d="M 15 26 C 9 20, 2 13, 2 8 A 6 6 0 0 1 14 6 L 15 8 L 16 6 A 6 6 0 0 1 28 8 C 28 13, 21 20, 15 26 Z"
                fill="#E11D48"
              />
              <circle cx="9" cy="8" r="2.2" fill="#FFFFFF" />
            </g>
            <path d="M 23 38 Q 32 46 41 38" stroke="#451A03" strokeWidth="3.4" strokeLinecap="round" fill="none" />
          </g>
        )}

        {mood === 'star' && (
          <g filter="url(#mascot-feature-shadow)">
            {/* 3D Star Eyes */}
            <polygon points="22,21 24,26 29,27 25,31 26,36 22,33 18,36 19,31 15,27 20,26" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.2" />
            <polygon points="42,21 44,26 49,27 45,31 46,36 42,33 38,36 39,31 35,27 40,26" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="1.2" />
            <path d="M 21 37 Q 32 50 43 37 Z" fill="#451A03" />
            <path d="M 25 42 Q 32 50 39 42 Z" fill="#F43F5E" />
          </g>
        )}

        {mood === 'shock' && (
          <g filter="url(#mascot-feature-shadow)">
            <circle cx="21" cy="26" r="6.2" fill="#FFFFFF" stroke="#451A03" strokeWidth="1.6" />
            <circle cx="21" cy="26" r="2.6" fill="#451A03" />
            <circle cx="43" cy="26" r="6.2" fill="#FFFFFF" stroke="#451A03" strokeWidth="1.6" />
            <circle cx="43" cy="26" r="2.6" fill="#451A03" />
            <ellipse cx="32" cy="42" rx="6" ry="7.5" fill="#451A03" />
          </g>
        )}

        {mood === 'fire' && (
          <g filter="url(#mascot-feature-shadow)">
            {/* 3D Sunglasses */}
            <path
              d="M 12 23 C 12 21, 19 20, 28 22 C 36 20, 43 21, 52 23 C 52 30, 45 33, 36 32 C 29 33, 22 33, 12 30 Z"
              fill="#0F172A"
            />
            <polygon points="16,24 21,24 17,30 13,30" fill="#FFFFFF" opacity="0.85" />
            <polygon points="38,24 43,24 39,30 35,30" fill="#FFFFFF" opacity="0.85" />
            <path d="M 24 41 Q 33 47 40 39" stroke="#350606" strokeWidth="3.4" strokeLinecap="round" fill="none" />
          </g>
        )}

        {mood === 'worried' && (
          <g filter="url(#mascot-feature-shadow)">
            <path d="M 15 20 Q 21 23 27 19" stroke="#451A03" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M 37 19 Q 43 23 49 20" stroke="#451A03" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <ellipse cx="22" cy="28" rx="3.8" ry="4.2" fill="#451A03" />
            <circle cx="20.5" cy="27" r="1.4" fill="#FFFFFF" />
            <ellipse cx="42" cy="28" rx="3.8" ry="4.2" fill="#451A03" />
            <circle cx="40.5" cy="27" r="1.4" fill="#FFFFFF" />
            <path d="M 23 40 Q 28 36 33 40 Q 38 44 41 40" stroke="#451A03" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* 3D Sweat Drop */}
            <path d="M 49 16 C 47 20, 47 24, 50 25 C 53 24, 53 20, 51 16 Z" fill="#38BDF8" />
          </g>
        )}

        {mood === 'angry' && (
          <g filter="url(#mascot-feature-shadow)">
            <path d="M 15 18 L 28 25" stroke="#451A03" strokeWidth="3.6" strokeLinecap="round" />
            <path d="M 49 18 L 36 25" stroke="#451A03" strokeWidth="3.6" strokeLinecap="round" />
            <circle cx="23" cy="28" r="3.6" fill="#451A03" />
            <circle cx="41" cy="28" r="3.6" fill="#451A03" />
            <path d="M 22 41 Q 32 34 42 41" stroke="#451A03" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          </g>
        )}

        {mood === 'party' && (
          <g>
            {/* 3D Party Hat */}
            <g filter="url(#mascot-feature-shadow)">
              <polygon points="32,0 19,18 45,18" fill="url(#party-hat-grad)" stroke="#FFFFFF" strokeWidth="1.6" />
              <circle cx="32" cy="1" r="3.5" fill="#FDE047" />
              <line x1="23" y1="12" x2="41" y2="12" stroke="#FDE047" strokeWidth="2.2" />
              <line x1="27" y1="6" x2="37" y2="6" stroke="#FFFFFF" strokeWidth="2.2" />
            </g>

            {/* Happy Eyes and Screaming Happy Mouth */}
            <g filter="url(#mascot-feature-shadow)">
              <path d="M 16 30 Q 22 21 28 30" stroke="#451A03" strokeWidth="3.6" strokeLinecap="round" fill="none" />
              <path d="M 36 30 Q 42 21 48 30" stroke="#451A03" strokeWidth="3.6" strokeLinecap="round" fill="none" />
              <path d="M 19 38 Q 32 54 45 38 Z" fill="#451A03" />
              <path d="M 24 44 Q 32 54 40 44 Z" fill="#F43F5E" />
            </g>
          </g>
        )}

        {mood === 'sad' && (
          <g filter="url(#mascot-feature-shadow)">
            <path d="M 15 21 Q 21 17 26 21" stroke="#451A03" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <path d="M 38 21 Q 43 17 49 21" stroke="#451A03" strokeWidth="2.8" strokeLinecap="round" fill="none" />
            <circle cx="22" cy="29" r="4.8" fill="#451A03" />
            <circle cx="21" cy="27" r="2" fill="#FFFFFF" />
            <circle cx="42" cy="29" r="4.8" fill="#451A03" />
            <circle cx="41" cy="27" r="2" fill="#FFFFFF" />
            <path d="M 24 42 Q 32 35 40 42" stroke="#451A03" strokeWidth="3.2" strokeLinecap="round" fill="none" />
            {/* 3D Teardrop */}
            <path d="M 17 31 C 14.5 35, 14.5 39, 18 40.5 C 21.5 39, 21.5 35, 18 31 Z" fill="#38BDF8" />
          </g>
        )}
      </svg>
    </div>
  );
};
