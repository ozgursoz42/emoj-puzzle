import React from 'react';
import { FloatingText, Particle } from '../types/game';

interface ParticleLayerProps {
  particles: Particle[];
  floatingTexts: FloatingText[];
}

export const ParticleLayer: React.FC<ParticleLayerProps> = ({ particles, floatingTexts }) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
      {/* Dynamic Pop Particles */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full transition-transform duration-75"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            backgroundColor: p.color,
            opacity: p.alpha,
            transform: `translate(-50%, -50%) scale(${p.alpha})`,
            boxShadow: `0 0 8px ${p.color}`,
          }}
        />
      ))}

      {/* Floating Score & Combo Texts */}
      {floatingTexts.map((ft) => (
        <div
          key={ft.id}
          className="absolute font-black tracking-wider text-center animate-bounce z-40 select-none"
          style={{
            left: `${ft.x}px`,
            top: `${ft.y}px`,
            transform: 'translate(-50%, -50%)',
            color: ft.color || '#FEF08A',
            fontSize: ft.scale ? `${ft.scale * 18}px` : '20px',
            textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 0 12px rgba(251,191,36,0.6)',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))',
          }}
        >
          {ft.text}
        </div>
      ))}
    </div>
  );
};
