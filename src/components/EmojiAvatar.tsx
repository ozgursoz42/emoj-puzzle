import React from 'react';
import { EmojiType, SpecialPowerType, ObstacleType } from '../types/game';

interface EmojiAvatarProps {
  type: EmojiType;
  size?: number; // default 48
  power?: SpecialPowerType | null;
  obstacle?: ObstacleType | null;
  obstacleHp?: number;
  isSleeping?: boolean;
  className?: string;
  animate?: boolean;
}

export const EmojiAvatar: React.FC<EmojiAvatarProps> = ({
  type,
  size = 48,
  power = null,
  obstacle = null,
  obstacleHp = 1,
  isSleeping = false,
  className = '',
  animate = false,
}) => {
  // Render high-definition volumetric 3D stylized SVG faces
  const renderFace = () => {
    switch (type) {
      case 'joy': // 😂 Kahkaha
        return (
          <g>
            {/* Ground Contact Shadow */}
            <ellipse cx="24" cy="44" rx="14" ry="3" fill="#000000" opacity="0.3" filter="url(#gaussian-blur-soft)" />

            {/* Base Spherical 3D Ball */}
            <circle cx="24" cy="23" r="20" fill="url(#grad-joy-3d)" filter="url(#drop-shadow-3d)" />

            {/* 3D Rim Bounce Light (Bottom-Right Rim Light) */}
            <path
              d="M 12 36 A 20 20 0 0 0 40 23 A 20 20 0 0 1 12 36 Z"
              fill="url(#rim-bounce-warm)"
              opacity="0.6"
            />

            {/* Dual Specular 3D Gloss Highlight */}
            <ellipse cx="21" cy="11" rx="12" ry="5.5" fill="url(#specular-white)" opacity="0.85" />
            <circle cx="16" cy="9" r="2" fill="#FFFFFF" opacity="0.9" />

            {/* 3D Facial Features with Emboss Depth */}
            <g filter="url(#feature-shadow)">
              {/* Squint Laughing Eyes */}
              <path d="M 12 17 Q 16 10 20 17" stroke="#682907" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 28 17 Q 32 10 36 17" stroke="#682907" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Big Open Happy Mouth with 3D Depth */}
              <path d="M 14 23 Q 24 37 34 23 Z" fill="#451A03" />
              {/* Mouth Tongue */}
              <path d="M 18 29 Q 24 37 30 29 Q 24 25 18 29 Z" fill="#F43F5E" />
              {/* White Teeth Arc */}
              <path d="M 15.5 23 Q 24 27 32.5 23" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </g>

            {/* 3D Glistening Crystal Tear Drops */}
            {/* Left Tear */}
            <g filter="url(#drop-shadow-tear)">
              <path d="M 8 19 C 4.5 22, 4.5 27, 9 29 C 13.5 27, 13.5 22, 10 19 Z" fill="url(#grad-tear-3d)" />
              <ellipse cx="8" cy="23.5" rx="1.2" ry="2.2" fill="#FFFFFF" opacity="0.9" transform="rotate(-15 8 23.5)" />
              <circle cx="9.5" cy="26" r="0.7" fill="#FFFFFF" opacity="0.7" />
            </g>

            {/* Right Tear */}
            <g filter="url(#drop-shadow-tear)">
              <path d="M 40 19 C 36.5 22, 36.5 27, 41 29 C 45.5 27, 45.5 22, 42 19 Z" fill="url(#grad-tear-3d)" />
              <ellipse cx="40" cy="23.5" rx="1.2" ry="2.2" fill="#FFFFFF" opacity="0.9" transform="rotate(15 40 23.5)" />
              <circle cx="38.5" cy="26" r="0.7" fill="#FFFFFF" opacity="0.7" />
            </g>
          </g>
        );

      case 'love': // 😍 Aşk
        return (
          <g>
            <ellipse cx="24" cy="44" rx="14" ry="3" fill="#000000" opacity="0.3" filter="url(#gaussian-blur-soft)" />
            <circle cx="24" cy="23" r="20" fill="url(#grad-love-3d)" filter="url(#drop-shadow-3d)" />

            {/* Bottom-right rim bounce light */}
            <path
              d="M 12 36 A 20 20 0 0 0 40 23 A 20 20 0 0 1 12 36 Z"
              fill="url(#rim-bounce-pink)"
              opacity="0.6"
            />

            {/* Specular White Gloss */}
            <ellipse cx="21" cy="11" rx="12" ry="5.5" fill="url(#specular-white)" opacity="0.85" />
            <circle cx="16" cy="9" r="2" fill="#FFFFFF" opacity="0.9" />

            {/* Volumetric Soft Blush Cheeks */}
            <ellipse cx="10" cy="27" rx="4.5" ry="3" fill="#FB7185" opacity="0.65" filter="url(#gaussian-blur-soft)" />
            <ellipse cx="38" cy="27" rx="4.5" ry="3" fill="#FB7185" opacity="0.65" filter="url(#gaussian-blur-soft)" />

            {/* 3D Ruby Gemstone Heart Eyes (Left) */}
            <g transform="translate(15, 17) scale(0.72) translate(-15, -15)" filter="url(#feature-shadow)">
              <path
                d="M 15 26 C 9 20, 2 13, 2 8 A 6 6 0 0 1 14 6 L 15 8 L 16 6 A 6 6 0 0 1 28 8 C 28 13, 21 20, 15 26 Z"
                fill="url(#grad-ruby-heart)"
              />
              {/* 3D Heart Glint */}
              <ellipse cx="9" cy="8" rx="2.5" ry="1.4" fill="#FFFFFF" opacity="0.9" transform="rotate(-30 9 8)" />
              <circle cx="13" cy="12" r="1.1" fill="#FFFFFF" opacity="0.75" />
            </g>

            {/* 3D Ruby Gemstone Heart Eyes (Right) */}
            <g transform="translate(33, 17) scale(0.72) translate(-15, -15)" filter="url(#feature-shadow)">
              <path
                d="M 15 26 C 9 20, 2 13, 2 8 A 6 6 0 0 1 14 6 L 15 8 L 16 6 A 6 6 0 0 1 28 8 C 28 13, 21 20, 15 26 Z"
                fill="url(#grad-ruby-heart)"
              />
              <ellipse cx="9" cy="8" rx="2.5" ry="1.4" fill="#FFFFFF" opacity="0.9" transform="rotate(-30 9 8)" />
              <circle cx="13" cy="12" r="1.1" fill="#FFFFFF" opacity="0.75" />
            </g>

            {/* Sweet 3D Curved Smile */}
            <g filter="url(#feature-shadow)">
              <path d="M 16 27 Q 24 37 32 27" stroke="#682907" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 19 28 Q 24 35 29 28" fill="#F43F5E" />
            </g>
          </g>
        );

      case 'angry': // 😡 Öfke
        return (
          <g>
            <ellipse cx="24" cy="44" rx="14" ry="3" fill="#000000" opacity="0.35" filter="url(#gaussian-blur-soft)" />
            <circle cx="24" cy="23" r="20" fill="url(#grad-angry-3d)" filter="url(#drop-shadow-3d)" />

            {/* Bottom-right orange rim reflection */}
            <path
              d="M 12 36 A 20 20 0 0 0 40 23 A 20 20 0 0 1 12 36 Z"
              fill="url(#rim-bounce-orange)"
              opacity="0.7"
            />

            <ellipse cx="21" cy="11" rx="12" ry="5.5" fill="url(#specular-white)" opacity="0.7" />

            {/* Fierce angled 3D eyebrows */}
            <g filter="url(#feature-shadow)">
              <path d="M 9 13 L 21 19" stroke="#350606" strokeWidth="3.6" strokeLinecap="round" />
              <path d="M 39 13 L 27 19" stroke="#350606" strokeWidth="3.6" strokeLinecap="round" />

              {/* Fierce white eyes with dark pupils */}
              <circle cx="16.5" cy="21" r="3.5" fill="#FFFFFF" />
              <circle cx="17.2" cy="20.8" r="1.8" fill="#350606" />
              <circle cx="31.5" cy="21" r="3.5" fill="#FFFFFF" />
              <circle cx="30.8" cy="20.8" r="1.8" fill="#350606" />

              {/* Clenched Teeth Grimace */}
              <rect x="15" y="27" width="18" height="6.5" rx="3.2" fill="#350606" />
              <rect x="16" y="28" width="16" height="4.5" rx="2" fill="#FFFFFF" />
              <line x1="20" y1="28" x2="20" y2="32.5" stroke="#350606" strokeWidth="1.4" />
              <line x1="24" y1="28" x2="24" y2="32.5" stroke="#350606" strokeWidth="1.4" />
              <line x1="28" y1="28" x2="28" y2="32.5" stroke="#350606" strokeWidth="1.4" />
            </g>
          </g>
        );

      case 'fear': // 😱 Korku
        return (
          <g>
            <ellipse cx="24" cy="44" rx="14" ry="3" fill="#000000" opacity="0.3" filter="url(#gaussian-blur-soft)" />
            <circle cx="24" cy="23" r="20" fill="url(#grad-fear-3d)" filter="url(#drop-shadow-3d)" />

            {/* Cyan chill glow on forehead */}
            <ellipse cx="24" cy="11" rx="14" ry="6" fill="#38BDF8" opacity="0.45" filter="url(#gaussian-blur-soft)" />
            <ellipse cx="21" cy="11" rx="12" ry="5.5" fill="url(#specular-white)" opacity="0.75" />

            {/* Wide frightened 3D white eyes */}
            <g filter="url(#feature-shadow)">
              <ellipse cx="16" cy="18" rx="4.8" ry="6.2" fill="#FFFFFF" />
              <circle cx="16.5" cy="18.5" r="2.2" fill="#1E1B4B" />
              <circle cx="15.8" cy="17.5" r="0.8" fill="#FFFFFF" />

              <ellipse cx="32" cy="18" rx="4.8" ry="6.2" fill="#FFFFFF" />
              <circle cx="31.5" cy="18.5" r="2.2" fill="#1E1B4B" />
              <circle cx="30.8" cy="17.5" r="0.8" fill="#FFFFFF" />

              {/* Screaming Oval 3D Mouth */}
              <ellipse cx="24" cy="30" rx="4.5" ry="7.5" fill="#1E1B4B" />
              <ellipse cx="24" cy="32" rx="3.2" ry="4.5" fill="#312E81" />

              {/* Shaking 3D Hands on Cheeks */}
              <path d="M 8 21 Q 13 23 12 29 Q 7 31 8 21 Z" fill="#93C5FD" stroke="#1E40AF" strokeWidth="1.2" />
              <path d="M 40 21 Q 35 23 36 29 Q 41 31 40 21 Z" fill="#93C5FD" stroke="#1E40AF" strokeWidth="1.2" />
            </g>
          </g>
        );

      case 'shock': // 🤯 Şok
        return (
          <g>
            <ellipse cx="24" cy="44" rx="14" ry="3" fill="#000000" opacity="0.3" filter="url(#gaussian-blur-soft)" />

            {/* Exploding Mushroom Cloud Top with 3D Depth */}
            <g filter="url(#feature-shadow)">
              <path
                d="M 11 15 C 6 6, 15 1, 24 4 C 33 1, 42 6, 37 15 Z"
                fill="url(#grad-shock-burst-3d)"
              />
              <circle cx="14" cy="6" r="2" fill="#FDE047" />
              <circle cx="34" cy="6" r="2" fill="#FDE047" />
              <circle cx="24" cy="3" r="2.5" fill="#FFFFFF" />
            </g>

            {/* Head Sphere */}
            <circle cx="24" cy="25" r="18.5" fill="url(#grad-shock-3d)" filter="url(#drop-shadow-3d)" />
            <ellipse cx="22" cy="16" rx="11" ry="4.5" fill="url(#specular-white)" opacity="0.75" />

            {/* Stunned 3D Eyes */}
            <g filter="url(#feature-shadow)">
              <circle cx="16.5" cy="24" r="4.2" fill="#FFFFFF" />
              <circle cx="16.5" cy="24" r="1.8" fill="#3B0764" />
              <circle cx="15.5" cy="23" r="1" fill="#FFFFFF" />

              <circle cx="31.5" cy="24" r="4.2" fill="#FFFFFF" />
              <circle cx="31.5" cy="24" r="1.8" fill="#3B0764" />
              <circle cx="30.5" cy="23" r="1" fill="#FFFFFF" />

              {/* Dropped Jaw O-Mouth */}
              <ellipse cx="24" cy="34" rx="5" ry="6.5" fill="#3B0764" />
            </g>
          </g>
        );

      case 'cold': // 🥶 Soğuk
        return (
          <g>
            <ellipse cx="24" cy="44" rx="14" ry="3" fill="#000000" opacity="0.3" filter="url(#gaussian-blur-soft)" />
            <circle cx="24" cy="23" r="20" fill="url(#grad-cold-3d)" filter="url(#drop-shadow-3d)" />

            {/* Frosty rim reflection */}
            <path
              d="M 12 36 A 20 20 0 0 0 40 23 A 20 20 0 0 1 12 36 Z"
              fill="url(#rim-bounce-ice)"
              opacity="0.7"
            />
            <ellipse cx="21" cy="11" rx="12" ry="5.5" fill="url(#specular-white)" opacity="0.85" />

            {/* 3D Icicles dripping from top */}
            <g filter="url(#feature-shadow)">
              <polygon points="11,5 14,14 10,7" fill="#E0F2FE" />
              <polygon points="23,3 25,16 21,5" fill="#F0F9FF" />
              <polygon points="35,5 37,13 33,7" fill="#E0F2FE" />

              {/* Shivering Eyes */}
              <ellipse cx="16" cy="18" rx="3.5" ry="4" fill="#0C4A6E" />
              <circle cx="15" cy="17" r="1.2" fill="#FFFFFF" />
              <ellipse cx="32" cy="18" rx="3.5" ry="4" fill="#0C4A6E" />
              <circle cx="31" cy="17" r="1.2" fill="#FFFFFF" />

              {/* Purple Chattering Lips with 3D Bevel */}
              <rect x="14" y="27" width="20" height="7" rx="3" fill="#4338CA" />
              <line x1="15" y1="30.5" x2="33" y2="30.5" stroke="#FFFFFF" strokeWidth="2.5" />
              <line x1="19" y1="28" x2="19" y2="33" stroke="#0C4A6E" strokeWidth="1.2" />
              <line x1="24" y1="28" x2="24" y2="33" stroke="#0C4A6E" strokeWidth="1.2" />
              <line x1="29" y1="28" x2="29" y2="33" stroke="#0C4A6E" strokeWidth="1.2" />
            </g>
          </g>
        );

      case 'cool': // 😎 Havalı
        return (
          <g>
            <ellipse cx="24" cy="44" rx="14" ry="3" fill="#000000" opacity="0.3" filter="url(#gaussian-blur-soft)" />
            <circle cx="24" cy="23" r="20" fill="url(#grad-cool-3d)" filter="url(#drop-shadow-3d)" />

            <path
              d="M 12 36 A 20 20 0 0 0 40 23 A 20 20 0 0 1 12 36 Z"
              fill="url(#rim-bounce-warm)"
              opacity="0.6"
            />
            <ellipse cx="21" cy="11" rx="12" ry="5.5" fill="url(#specular-white)" opacity="0.85" />

            {/* 3D Dark Sunglasses with Physical Glare */}
            <g filter="url(#feature-shadow)">
              <path
                d="M 8 16 C 8 14, 14 13, 21 15 C 22 15.5, 26 15.5, 27 15 C 34 13, 40 14, 40 16 C 40 23, 33 26, 26 25 C 23.5 24.5, 24.5 24.5, 22 25 C 15 26, 8 23, 8 16 Z"
                fill="#090D16"
                stroke="#1E293B"
                strokeWidth="1.5"
              />
              <line x1="21" y1="17" x2="27" y2="17" stroke="#090D16" strokeWidth="3" strokeLinecap="round" />

              {/* White Glare Lines on Glasses */}
              <polygon points="12,17 16,17 13,23 9,23" fill="#FFFFFF" opacity="0.85" />
              <polygon points="29,17 33,17 30,23 26,23" fill="#FFFFFF" opacity="0.85" />

              {/* Smug Smirk */}
              <path d="M 18 29 Q 25 35 32 28" stroke="#682907" strokeWidth="3" strokeLinecap="round" fill="none" />
            </g>
          </g>
        );

      case 'crazy': // 🤪 Çılgın
        return (
          <g>
            <ellipse cx="24" cy="44" rx="14" ry="3" fill="#000000" opacity="0.3" filter="url(#gaussian-blur-soft)" />
            <circle cx="24" cy="23" r="20" fill="url(#grad-crazy-3d)" filter="url(#drop-shadow-3d)" />

            <path
              d="M 12 36 A 20 20 0 0 0 40 23 A 20 20 0 0 1 12 36 Z"
              fill="url(#rim-bounce-green)"
              opacity="0.6"
            />
            <ellipse cx="21" cy="11" rx="12" ry="5.5" fill="url(#specular-white)" opacity="0.85" />

            <g filter="url(#feature-shadow)">
              {/* Wonky Eyebrows */}
              <path d="M 10 12 Q 15 10 19 15" stroke="#043927" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M 28 15 Q 32 10 38 13" stroke="#043927" strokeWidth="2.8" strokeLinecap="round" fill="none" />

              {/* Left Eye: HUGE cartoon eyeball */}
              <circle cx="15.5" cy="19.5" r="5.5" fill="#FFFFFF" stroke="#043927" strokeWidth="1.2" />
              <circle cx="16.5" cy="20.5" r="2.6" fill="#043927" />
              <circle cx="15" cy="19" r="1.2" fill="#FFFFFF" />

              {/* Right Eye: small wacky eyeball */}
              <circle cx="32" cy="19.5" r="3.4" fill="#FFFFFF" stroke="#043927" strokeWidth="1.2" />
              <circle cx="32" cy="19.5" r="1.5" fill="#043927" />

              {/* Mouth & 3D Tongue */}
              <path d="M 14 26 Q 24 37 34 26" stroke="#043927" strokeWidth="2.8" fill="#043927" />
              <path d="M 22 28 Q 28 40 34 33 Q 32 28 22 28 Z" fill="#FB7185" stroke="#E11D48" strokeWidth="1.2" />
            </g>
          </g>
        );

      case 'sad': // 😢 Üzgün
        return (
          <g>
            <ellipse cx="24" cy="44" rx="14" ry="3" fill="#000000" opacity="0.3" filter="url(#gaussian-blur-soft)" />
            <circle cx="24" cy="23" r="20" fill="url(#grad-sad-3d)" filter="url(#drop-shadow-3d)" />

            <path
              d="M 12 36 A 20 20 0 0 0 40 23 A 20 20 0 0 1 12 36 Z"
              fill="url(#rim-bounce-ice)"
              opacity="0.6"
            />
            <ellipse cx="21" cy="11" rx="12" ry="5.5" fill="url(#specular-white)" opacity="0.8" />

            <g filter="url(#feature-shadow)">
              {/* Slanted sad eyebrows */}
              <path d="M 11 16 Q 16 13 20 16" stroke="#075985" strokeWidth="2.8" strokeLinecap="round" fill="none" />
              <path d="M 28 16 Q 32 13 37 16" stroke="#075985" strokeWidth="2.8" strokeLinecap="round" fill="none" />

              {/* Big glistening tearful eyes */}
              <ellipse cx="16" cy="20" rx="3.8" ry="4.8" fill="#0C4A6E" />
              <circle cx="15" cy="18.5" r="1.8" fill="#FFFFFF" />
              <circle cx="17" cy="21.5" r="0.8" fill="#FFFFFF" opacity="0.8" />

              <ellipse cx="32" cy="20" rx="3.8" ry="4.8" fill="#0C4A6E" />
              <circle cx="31" cy="18.5" r="1.8" fill="#FFFFFF" />
              <circle cx="33" cy="21.5" r="0.8" fill="#FFFFFF" opacity="0.8" />

              {/* Downturned mouth */}
              <path d="M 17 31 Q 24 25 31 31" stroke="#075985" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Dripping 3D tear */}
              <path d="M 14 22 C 11.5 25, 11.5 29, 15 30.5 C 18.5 29, 18.5 25, 15 22 Z" fill="url(#grad-tear-3d)" />
              <ellipse cx="14" cy="26" rx="0.9" ry="1.8" fill="#FFFFFF" opacity="0.85" />
            </g>
          </g>
        );

      case 'sleepy': // 😴 Uykulu
      default:
        return (
          <g>
            <ellipse cx="24" cy="44" rx="14" ry="3" fill="#000000" opacity="0.3" filter="url(#gaussian-blur-soft)" />
            <circle cx="24" cy="23" r="20" fill="url(#grad-sleepy-3d)" filter="url(#drop-shadow-3d)" />

            <path
              d="M 12 36 A 20 20 0 0 0 40 23 A 20 20 0 0 1 12 36 Z"
              fill="url(#rim-bounce-purple)"
              opacity="0.6"
            />
            <ellipse cx="21" cy="11" rx="12" ry="5.5" fill="url(#specular-white)" opacity="0.8" />

            <g filter="url(#feature-shadow)">
              {/* Closed curved peaceful sleeping eyes */}
              <path d="M 11 19 Q 16 24 21 19" stroke="#312E81" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M 27 19 Q 32 24 37 19" stroke="#312E81" strokeWidth="3" strokeLinecap="round" fill="none" />

              {/* Small snoring mouth */}
              <ellipse cx="24" cy="29" rx="3.2" ry="4.2" fill="#312E81" />

              {/* 3D Snoozing bubble on nose */}
              <circle cx="31" cy="26" r="4.8" fill="url(#grad-bubble-3d)" opacity="0.9" stroke="#A5B4FC" strokeWidth="1" />
              <ellipse cx="29.8" cy="24.5" rx="1.5" ry="1" fill="#FFFFFF" opacity="0.9" />
            </g>

            {/* Floating 3D Zzz */}
            {isSleeping && (
              <g className="animate-pulse" filter="url(#feature-shadow)">
                <text x="34" y="13" fill="#C7D2FE" fontSize="9" fontWeight="900" fontFamily="sans-serif">z</text>
                <text x="39" y="8" fill="#E0E7FF" fontSize="12" fontWeight="900" fontFamily="sans-serif">Z</text>
              </g>
            )}
          </g>
        );
    }
  };

  // Render 3D Power Badge Overlay (Rocket, Bomb, Shock)
  const renderPower = () => {
    if (!power) return null;
    if (power === 'rocket') {
      return (
        <g className="animate-pulse-glow">
          <circle cx="24" cy="23" r="21" fill="none" stroke="#FDE047" strokeWidth="2.8" strokeDasharray="5 3" />
          {/* Rocket 3D badge in bottom-right corner */}
          <g transform="translate(25, 25) scale(0.88)" filter="url(#feature-shadow)">
            <circle cx="11" cy="11" r="10" fill="url(#grad-badge-red)" stroke="#FFFFFF" strokeWidth="1.6" />
            <path d="M 6 16 L 9 10 L 15 7 L 16 11 L 11 16 Z" fill="#FFFFFF" />
            <polygon points="15,7 18,6 16,11" fill="#FBBF24" />
            <polygon points="6,16 4,18 7,16" fill="#F97316" />
          </g>
        </g>
      );
    }
    if (power === 'bomb') {
      return (
        <g className="animate-pulse-glow">
          <circle cx="24" cy="23" r="21" fill="none" stroke="#EF4444" strokeWidth="2.8" />
          {/* Bomb badge in bottom-right */}
          <g transform="translate(25, 25) scale(0.88)" filter="url(#feature-shadow)">
            <circle cx="11" cy="11" r="10" fill="url(#grad-badge-dark)" stroke="#F59E0B" strokeWidth="1.6" />
            <circle cx="10" cy="11" r="5" fill="#3F3F46" />
            <line x1="12" y1="8" x2="16" y2="4" stroke="#FDE047" strokeWidth="2" />
            <circle cx="16" cy="4" r="2.5" fill="#EF4444" />
          </g>
        </g>
      );
    }
    if (power === 'shock_blast') {
      return (
        <g className="animate-spin" style={{ transformOrigin: '24px 23px', animationDuration: '5s' }}>
          <circle cx="24" cy="23" r="22" fill="none" stroke="url(#grad-rainbow-stroke)" strokeWidth="3.2" />
          <g transform="translate(25, 25) scale(0.88)" filter="url(#feature-shadow)">
            <circle cx="11" cy="11" r="10" fill="url(#grad-badge-purple)" stroke="#FFFFFF" strokeWidth="1.6" />
            <polygon points="12,3 7,11 11,11 10,19 16,10 12,10" fill="#FDE047" />
          </g>
        </g>
      );
    }
    return null;
  };

  // Render 3D Obstacle Overlay (Ice, Stone, Bubble, Lock)
  const renderObstacle = () => {
    if (!obstacle) return null;

    if (obstacle === 'ice') {
      return (
        <g filter="url(#drop-shadow-3d)">
          {/* 3D Glass Ice Cube with Facets */}
          <rect
            x="2"
            y="2"
            width="44"
            height="44"
            rx="12"
            fill="url(#grad-ice-cube-3d)"
            stroke="#BAE6FD"
            strokeWidth="2.8"
            opacity="0.88"
          />
          {/* 3D Glass Facet Reflections */}
          <polygon points="4,4 18,4 4,18" fill="#FFFFFF" opacity="0.6" />
          <polygon points="44,4 44,18 30,4" fill="#FFFFFF" opacity="0.3" />
          {/* Fracture Cracks */}
          <path d="M 6 12 L 14 18 L 11 26" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9" />
          <path d="M 40 8 L 32 16 L 35 24 L 42 28" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.85" />
        </g>
      );
    }

    if (obstacle === 'stone') {
      return (
        <g filter="url(#drop-shadow-3d)">
          {/* 3D Heavy Boulder */}
          <circle cx="24" cy="24" r="22" fill="url(#grad-stone-3d)" stroke="#1E293B" strokeWidth="3" />
          {/* Deep Fissures */}
          <path d="M 12 12 L 20 20 L 16 32" stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          <path d="M 28 8 L 24 18 L 34 26" stroke="#0F172A" strokeWidth="2.6" strokeLinecap="round" fill="none" />
          {obstacleHp > 1 ? (
            <circle cx="24" cy="24" r="9.5" fill="#0F172A" opacity="0.8">
              <animate attributeName="opacity" values="0.8;0.45;0.8" dur="1.5s" repeatCount="indefinite" />
            </circle>
          ) : null}
          <text x="24" y="28" fill="#F8FAFC" fontSize="12" fontWeight="900" textAnchor="middle">
            {obstacleHp > 1 ? '2' : '1'}
          </text>
        </g>
      );
    }

    if (obstacle === 'bubble') {
      return (
        <g filter="url(#drop-shadow-3d)">
          {/* Iridescent 3D Bubble */}
          <circle cx="24" cy="24" r="23" fill="url(#grad-bubble-3d)" stroke="#E0F2FE" strokeWidth="2.2" opacity="0.88" />
          {/* Dual Glass Gleams */}
          <ellipse cx="14" cy="12" rx="4.5" ry="2.5" fill="#FFFFFF" opacity="0.9" transform="rotate(-30 14 12)" />
          <circle cx="19" cy="10" r="1.4" fill="#FFFFFF" opacity="0.95" />
          <ellipse cx="34" cy="34" rx="2.8" ry="1.4" fill="#FFFFFF" opacity="0.65" transform="rotate(-30 34 34)" />
        </g>
      );
    }

    if (obstacle === 'lock') {
      return (
        <g filter="url(#drop-shadow-3d)">
          <ellipse cx="24" cy="24" rx="22" ry="14" fill="none" stroke="#475569" strokeWidth="3.5" strokeDasharray="6 3" />
          {/* 3D Golden Padlock in center */}
          <g transform="translate(14, 13)" filter="url(#feature-shadow)">
            <path d="M 6 10 L 6 5 A 4 4 0 0 1 14 5 L 14 10" fill="none" stroke="#E2E8F0" strokeWidth="2.8" />
            <rect x="3" y="9" width="14" height="12" rx="3" fill="url(#grad-gold-lock-3d)" stroke="#78350F" strokeWidth="1.4" />
            <circle cx="10" cy="14" r="1.8" fill="#3B1502" />
            <polygon points="9,14 11,14 10.5,18 9.5,18" fill="#3B1502" />
          </g>
        </g>
      );
    }

    return null;
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none transition-transform duration-150 ${className} ${animate ? 'animate-jiggle' : ''}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 48 48"
        width={size}
        height={size}
        className="overflow-visible"
      >
        <defs>
          {/* Filters for 3D depth and embossing */}
          <filter id="gaussian-blur-soft" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" />
          </filter>

          <filter id="drop-shadow-3d" x="-20%" y="-15%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3.5" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.45" />
          </filter>

          <filter id="drop-shadow-tear" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1.5" stdDeviation="1" floodColor="#0284C7" floodOpacity="0.4" />
          </filter>

          <filter id="feature-shadow" x="-15%" y="-15%" width="130%" height="130%">
            <feDropShadow dx="0" dy="1.2" stdDeviation="0.8" floodColor="#000000" floodOpacity="0.35" />
          </filter>

          {/* 3D Specular Highlight Gradients */}
          <linearGradient id="specular-white" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
          </linearGradient>

          {/* 3D Rim Bounce Light Gradients */}
          <linearGradient id="rim-bounce-warm" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="rim-bounce-pink" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FECDD3" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="rim-bounce-orange" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#FED7AA" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#EA580C" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="rim-bounce-ice" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#E0F2FE" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="rim-bounce-green" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#A7F3D0" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="rim-bounce-purple" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#4F46E5" stopOpacity="0.0" />
          </linearGradient>

          {/* 3D Spherical Normal Gradients (Key Light top-left cx=32%, cy=25%) */}
          {/* 3D Joy */}
          <radialGradient id="grad-joy-3d" cx="32%" cy="24%" r="75%">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="35%" stopColor="#FACC15" />
            <stop offset="70%" stopColor="#D97706" />
            <stop offset="100%" stopColor="#78350F" />
          </radialGradient>

          {/* 3D Love */}
          <radialGradient id="grad-love-3d" cx="32%" cy="24%" r="75%">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="40%" stopColor="#FBBF24" />
            <stop offset="75%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#881337" />
          </radialGradient>

          <linearGradient id="grad-ruby-heart" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="40%" stopColor="#E11D48" />
            <stop offset="100%" stopColor="#9F1239" />
          </linearGradient>

          {/* 3D Angry */}
          <radialGradient id="grad-angry-3d" cx="32%" cy="22%" r="78%">
            <stop offset="0%" stopColor="#FECACA" />
            <stop offset="35%" stopColor="#EF4444" />
            <stop offset="70%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#450A0A" />
          </radialGradient>

          {/* 3D Fear */}
          <radialGradient id="grad-fear-3d" cx="32%" cy="22%" r="78%">
            <stop offset="0%" stopColor="#E0E7FF" />
            <stop offset="40%" stopColor="#818CF8" />
            <stop offset="75%" stopColor="#4338CA" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </radialGradient>

          {/* 3D Shock */}
          <radialGradient id="grad-shock-3d" cx="32%" cy="26%" r="75%">
            <stop offset="0%" stopColor="#F5D0FE" />
            <stop offset="40%" stopColor="#C084FC" />
            <stop offset="75%" stopColor="#7E22CE" />
            <stop offset="100%" stopColor="#3B0764" />
          </radialGradient>

          <linearGradient id="grad-shock-burst-3d" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#9333EA" />
            <stop offset="45%" stopColor="#EC4899" />
            <stop offset="100%" stopColor="#FDE047" />
          </linearGradient>

          {/* 3D Cold */}
          <radialGradient id="grad-cold-3d" cx="32%" cy="24%" r="75%">
            <stop offset="0%" stopColor="#F0F9FF" />
            <stop offset="40%" stopColor="#38BDF8" />
            <stop offset="75%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#082F49" />
          </radialGradient>

          {/* 3D Cool */}
          <radialGradient id="grad-cool-3d" cx="32%" cy="24%" r="75%">
            <stop offset="0%" stopColor="#FEF9C3" />
            <stop offset="40%" stopColor="#F59E0B" />
            <stop offset="75%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </radialGradient>

          {/* 3D Crazy */}
          <radialGradient id="grad-crazy-3d" cx="32%" cy="24%" r="75%">
            <stop offset="0%" stopColor="#D1FAE5" />
            <stop offset="40%" stopColor="#10B981" />
            <stop offset="75%" stopColor="#047857" />
            <stop offset="100%" stopColor="#064E3B" />
          </radialGradient>

          {/* 3D Sad */}
          <radialGradient id="grad-sad-3d" cx="32%" cy="24%" r="75%">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="40%" stopColor="#38BDF8" />
            <stop offset="75%" stopColor="#0284C7" />
            <stop offset="100%" stopColor="#0C4A6E" />
          </radialGradient>

          {/* 3D Sleepy */}
          <radialGradient id="grad-sleepy-3d" cx="32%" cy="24%" r="75%">
            <stop offset="0%" stopColor="#EEF2FF" />
            <stop offset="40%" stopColor="#A5B4FC" />
            <stop offset="75%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#312E81" />
          </radialGradient>

          {/* 3D Teardrops */}
          <radialGradient id="grad-tear-3d" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#E0F2FE" />
            <stop offset="50%" stopColor="#38BDF8" />
            <stop offset="100%" stopColor="#0284C7" />
          </radialGradient>

          {/* 3D Ice Cube */}
          <linearGradient id="grad-ice-cube-3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F0F9FF" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#7DD3FC" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#0284C7" stopOpacity="0.88" />
          </linearGradient>

          {/* 3D Stone Boulder */}
          <radialGradient id="grad-stone-3d" cx="30%" cy="25%" r="75%">
            <stop offset="0%" stopColor="#CBD5E1" />
            <stop offset="40%" stopColor="#64748B" />
            <stop offset="80%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </radialGradient>

          {/* 3D Bubble */}
          <linearGradient id="grad-bubble-3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F472B6" stopOpacity="0.3" />
            <stop offset="35%" stopColor="#38BDF8" stopOpacity="0.4" />
            <stop offset="70%" stopColor="#34D399" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.4" />
          </linearGradient>

          {/* 3D Gold Lock */}
          <linearGradient id="grad-gold-lock-3d" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Badges */}
          <linearGradient id="grad-badge-red" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#F87171" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>
          <linearGradient id="grad-badge-dark" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3F3F46" />
            <stop offset="100%" stopColor="#09090B" />
          </linearGradient>
          <linearGradient id="grad-badge-purple" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A855F7" />
            <stop offset="100%" stopColor="#6B21A8" />
          </linearGradient>
          <linearGradient id="grad-rainbow-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="25%" stopColor="#F59E0B" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="75%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>

        {/* Base 3D Face */}
        {renderFace()}

        {/* 3D Special Power Badge */}
        {renderPower()}

        {/* 3D Obstacle Layer */}
        {renderObstacle()}
      </svg>
    </div>
  );
};
