import React from 'react';
import { CellData } from '../types/game';
import { EmojiAvatar } from './EmojiAvatar';

interface GameBoardProps {
  grid: (CellData | null)[][];
  onCellClick: (row: number, col: number) => void;
  selectedGroup: Set<string>;
  poppingKeys: Set<string>;
  hoverGroup: (row: number, col: number) => void;
  clearHover: () => void;
  isProcessing: boolean;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid,
  onCellClick,
  selectedGroup,
  poppingKeys,
  hoverGroup,
  clearHover,
  isProcessing,
}) => {
  const rows = grid.length;
  const cols = grid[0]?.length || 7;

  return (
    <div className="relative p-2.5 sm:p-3.5 rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-950/95 to-slate-950 border-3 border-indigo-500/40 backdrop-blur-md shadow-[0_12px_35px_rgba(0,0,0,0.7),inset_0_2px_4px_rgba(255,255,255,0.15)] touch-none select-none max-w-full">
      {/* 3D Toy Grid Pocket Trays */}
      <div
        className="grid gap-1.5 sm:gap-2 justify-center"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
        }}
        onMouseLeave={clearHover}
      >
        {grid.map((rowArr, rIdx) =>
          rowArr.map((cell, cIdx) => {
            const key = `${rIdx},${cIdx}`;
            const isGrouped = selectedGroup.has(key);
            const isPopping = poppingKeys.has(key);

            // If empty slot (cleared box cell)
            if (!cell) {
              return (
                <div
                  key={`empty-${rIdx}-${cIdx}`}
                  className="aspect-square flex items-center justify-center rounded-2xl bg-black/30 border border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] opacity-35 pointer-events-none"
                  style={{
                    minWidth: '38px',
                    minHeight: '38px',
                    maxWidth: '52px',
                    maxHeight: '52px',
                  }}
                />
              );
            }

            return (
              <div
                key={cell.id}
                onClick={() => !isProcessing && onCellClick(rIdx, cIdx)}
                onMouseEnter={() => !isProcessing && hoverGroup(rIdx, cIdx)}
                className={`relative aspect-square flex items-center justify-center rounded-2xl cursor-pointer transition-all duration-150 transform ${
                  isPopping
                    ? 'animate-emoji-pop z-30'
                    : isGrouped
                    ? '-translate-y-1.5 scale-112 z-20 filter drop-shadow-[0_8px_16px_rgba(245,158,11,0.6)]'
                    : 'hover:-translate-y-0.5 hover:scale-104 active:translate-y-1 active:scale-95'
                }`}
                style={{
                  minWidth: '38px',
                  minHeight: '38px',
                  maxWidth: '52px',
                  maxHeight: '52px',
                }}
              >
                {/* 3D Acrylic Cell Tray Background */}
                <div
                  className={`absolute inset-0 rounded-2xl transition-all duration-150 ${
                    isGrouped
                      ? 'bg-gradient-to-b from-amber-400/40 to-yellow-500/30 border-2 border-amber-300 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),0_0_12px_rgba(253,224,71,0.8)]'
                      : 'bg-gradient-to-b from-white/10 to-white/[0.02] border border-white/15 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.2),inset_0_-2px_4px_rgba(0,0,0,0.5),0_3px_6px_rgba(0,0,0,0.4)]'
                  }`}
                />

                {/* Shockwave effect during pop */}
                {isPopping && (
                  <div className="absolute inset-0 rounded-full border-3 border-yellow-300 animate-shockwave pointer-events-none" />
                )}

                {/* 3D Emoji Avatar */}
                <div className={`relative z-10 transition-transform duration-150 ${isGrouped ? 'scale-108' : ''}`}>
                  <EmojiAvatar
                    type={cell.emoji}
                    power={cell.power}
                    obstacle={cell.obstacle}
                    obstacleHp={cell.obstacleHp}
                    isSleeping={cell.isSleeping}
                    size={42}
                    animate={isGrouped && !isPopping}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
