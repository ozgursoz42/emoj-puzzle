import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, RotateCcw, Zap, Shuffle, Hammer, Star, Box } from 'lucide-react';
import { LevelConfig, CellData, EmojiType, MascotMood, FloatingText, Particle, SpecialPowerType, ObstacleType } from '../types/game';
import { GameBoard } from './GameBoard';
import { EmotionMascot } from './EmotionMascot';
import { ParticleLayer } from './ParticleLayer';
import { EmojiAvatar } from './EmojiAvatar';
import { VictoryModal } from './VictoryModal';
import { DefeatModal } from './DefeatModal';
import { sound } from '../utils/audio';

interface GameScreenProps {
  level: LevelConfig;
  playerCoins: number;
  highScore: number;
  onVictory: (levelId: number, score: number, stars: number, coinsEarned: number) => void;
  onHome: () => void;
  onReplay: () => void;
  onNextLevel: () => void;
  onSpendCoins: (amount: number) => boolean;
  onPopEmojis?: (count: number) => void;
  onComboAchievement?: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({
  level,
  playerCoins,
  highScore,
  onVictory,
  onHome,
  onReplay,
  onNextLevel,
  onSpendCoins,
  onPopEmojis,
  onComboAchievement,
}) => {
  const [grid, setGrid] = useState<(CellData | null)[][]>([]);
  const [movesLeft, setMovesLeft] = useState(level.moves);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [mascotMood, setMascotMood] = useState<MascotMood>('idle');
  const [mascotQuote, setMascotQuote] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Set<string>>(new Set());
  const [poppingKeys, setPoppingKeys] = useState<Set<string>>(new Set());
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [activeBooster, setActiveBooster] = useState<'hammer' | null>(null);

  // Targets tracking
  const [remainingEmojis, setRemainingEmojis] = useState<Record<string, number>>(() => ({
    ...(level.targets.emojis || {}),
  }));
  const [remainingObstacles, setRemainingObstacles] = useState<Record<string, number>>(() => ({
    ...(level.targets.obstacles || {}),
  }));
  const [isReady, setIsReady] = useState(false);

  const comboTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Helper to generate a random allowed emoji
  const getRandomEmoji = useCallback((): EmojiType => {
    const list = level.allowedEmojis;
    return list[Math.floor(Math.random() * list.length)];
  }, [level.allowedEmojis]);

  // Initialize Board
  const initBoard = useCallback(() => {
    const newGrid: (CellData | null)[][] = [];
    const rows = level.rows;
    const cols = level.cols;

    for (let r = 0; r < rows; r++) {
      const rowArr: (CellData | null)[] = [];
      for (let c = 0; c < cols; c++) {
        // Check preset obstacles
        const preset = level.presetObstacles?.find((p) => p.row === r && p.col === c);
        const emojiType = getRandomEmoji();

        rowArr.push({
          id: `${r}-${c}-${Date.now()}-${Math.random()}`,
          row: r,
          col: c,
          emoji: emojiType,
          power: null,
          obstacle: preset ? preset.type : null,
          obstacleHp: preset ? (preset.hp || 1) : 0,
          isSleeping: emojiType === 'sleepy',
        });
      }
      newGrid.push(rowArr);
    }

    setGrid(newGrid);
    setMovesLeft(level.moves);
    setScore(0);
    setCombo(1);
    setMascotMood('idle');
    setGameState('playing');
    setActiveBooster(null);
    setPoppingKeys(new Set());
    setSelectedGroup(new Set());

    // Explicitly set targets
    setRemainingEmojis({ ...(level.targets.emojis || {}) });
    setRemainingObstacles({ ...(level.targets.obstacles || {}) });
    setIsReady(true);
  }, [level, getRandomEmoji]);

  useEffect(() => {
    initBoard();
  }, [initBoard]);

  // Reset combo after inactive window
  const resetComboTimer = useCallback(() => {
    if (comboTimerRef.current) clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      setCombo(1);
      setMascotMood('idle');
    }, 3200);
  }, []);

  // Spawn visual floating text
  const addFloatingText = (text: string, x: number, y: number, color?: string, scale = 1) => {
    const id = `${Date.now()}-${Math.random()}`;
    setFloatingTexts((prev) => [...prev, { id, text, x, y, color, scale }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((item) => item.id !== id));
    }, 850);
  };

  // Spawn Particle Bursts
  const spawnParticles = (x: number, y: number, color: string, count = 14) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
      const speed = 2.5 + Math.random() * 4.5;
      newParticles.push({
        id: `${Date.now()}-${Math.random()}`,
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 5 + Math.random() * 6,
        alpha: 1,
        shape: 'circle',
      });
    }

    setParticles((prev) => [...prev, ...newParticles]);

    let frame = 0;
    const interval = setInterval(() => {
      frame++;
      setParticles((prev) =>
        prev
          .map((p) => {
            if (!newParticles.some((np) => np.id === p.id)) return p;
            return {
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              alpha: Math.max(0, p.alpha - 0.08),
            };
          })
          .filter((p) => p.alpha > 0)
      );

      if (frame > 14) {
        clearInterval(interval);
      }
    }, 35);
  };

  // Find connected matching emojis (Flood Fill / BFS)
  const getConnectedGroup = useCallback((startRow: number, startCol: number, currentGrid: (CellData | null)[][]): [number, number][] => {
    const rows = currentGrid.length;
    const cols = currentGrid[0]?.length || 0;
    const targetCell = currentGrid[startRow]?.[startCol];
    if (!targetCell) return [];

    // If cell has lock or stone, it cannot start a normal match
    if (targetCell.obstacle === 'stone' || targetCell.obstacle === 'lock') {
      return [];
    }

    const targetType = targetCell.emoji;
    const queue: [number, number][] = [[startRow, startCol]];
    const visited = new Set<string>();
    visited.add(`${startRow},${startCol}`);
    const group: [number, number][] = [];

    const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      group.push([r, c]);

      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols) {
          const neighbor = currentGrid[nr][nc];
          const key = `${nr},${nc}`;
          if (
            neighbor &&
            !visited.has(key) &&
            neighbor.emoji === targetType &&
            neighbor.obstacle !== 'stone' &&
            neighbor.obstacle !== 'lock'
          ) {
            visited.add(key);
            queue.push([nr, nc]);
          }
        }
      }
    }

    return group;
  }, []);

  // Hover group highlight
  const handleHoverGroup = (row: number, col: number) => {
    if (isProcessing || activeBooster === 'hammer') return;
    const cell = grid[row]?.[col];
    if (!cell) return;

    if (cell.power) {
      setSelectedGroup(new Set([`${row},${col}`]));
      return;
    }
    const group = getConnectedGroup(row, col, grid);
    if (group.length >= 2) {
      const set = new Set(group.map(([r, c]) => `${r},${c}`));
      setSelectedGroup(set);
    } else {
      setSelectedGroup(new Set());
    }
  };

  const handleClearHover = () => {
    setSelectedGroup(new Set());
  };

  // Hammer Booster Action
  const handleHammerUse = (row: number, col: number) => {
    const cell = grid[row]?.[col];
    if (!cell) return;

    sound.playPowerExplosion('bomb');
    setIsProcessing(true);
    setActiveBooster(null);

    const newGrid: (CellData | null)[][] = grid.map((rArr) => rArr.map((c) => (c ? { ...c } : null)));

    if (cell.obstacle) {
      newGrid[row][col]!.obstacle = null;
      newGrid[row][col]!.obstacleHp = 0;
      updateObstacleTarget(cell.obstacle);
    } else {
      newGrid[row][col] = null;
      updateEmojiTarget(cell.emoji, 1);
    }

    const compacted = applyGravity(newGrid);
    setGrid(compacted);
    setScore((s) => s + 50);
    setIsProcessing(false);
  };

  // Update targets
  const updateEmojiTarget = (type: EmojiType, count: number) => {
    setRemainingEmojis((prev) => {
      if (prev[type] === undefined) return prev;
      return { ...prev, [type]: Math.max(0, prev[type] - count) };
    });
  };

  const updateObstacleTarget = (type: ObstacleType, count = 1) => {
    setRemainingObstacles((prev) => {
      if (prev[type] === undefined) return prev;
      return { ...prev, [type]: Math.max(0, prev[type] - count) };
    });
  };

  // Total remaining non-empty emojis on the board
  const totalRemainingOnBoard = grid.flat().filter((cell): cell is CellData => cell !== null).length;

  // Check victory condition
  useEffect(() => {
    if (!isReady || gameState !== 'playing') return;

    // Condition 1: THE ENTIRE BOX IS CLEARED ("kutu bitirildiğinde bolum bitsin")
    const isBoxCleared = totalRemainingOnBoard === 0;

    // Condition 2: All specific level targets are completed
    const emojiTargetKeys = Object.keys(level.targets.emojis || {});
    const obstacleTargetKeys = Object.keys(level.targets.obstacles || {});

    const emojisDone =
      emojiTargetKeys.length > 0 &&
      emojiTargetKeys.every((key) => {
        const remaining = remainingEmojis[key];
        return typeof remaining === 'number' && remaining <= 0;
      });

    const obstaclesDone =
      obstacleTargetKeys.length > 0 &&
      obstacleTargetKeys.every((key) => {
        const remaining = remainingObstacles[key];
        return typeof remaining === 'number' && remaining <= 0;
      });

    const hasSpecificTargets = emojiTargetKeys.length > 0 || obstacleTargetKeys.length > 0;
    const isTargetsCompleted =
      hasSpecificTargets &&
      (emojiTargetKeys.length === 0 || emojisDone) &&
      (obstacleTargetKeys.length === 0 || obstaclesDone);

    if (isBoxCleared || isTargetsCompleted) {
      setGameState('won');
      setMascotMood('party');
      setMascotQuote(isBoxCleared ? 'KUTU TEMİZLENDİ! 🎉' : 'Kazandın!');

      // Bonus points for remaining moves and clearing box
      const boxClearBonus = isBoxCleared ? 1000 : 0;
      const finalScore = score + (movesLeft * 75) + boxClearBonus;

      // Calculate stars earned based on score targets
      const [s1, s2, s3] = level.starScores;
      let stars = 1;
      if (finalScore >= s3) stars = 3;
      else if (finalScore >= s2) stars = 2;
      else if (finalScore >= s1) stars = 1;

      // Bonus coins
      const bonusCoins = 50 + (movesLeft * 5) + (isBoxCleared ? 30 : 0);

      setTimeout(() => {
        onVictory(level.id, finalScore, stars, bonusCoins);
      }, 700);
    } else if (movesLeft <= 0 && !isProcessing) {
      setGameState('lost');
      setMascotMood('sad');
      setMascotQuote('Hamle Bitti!');
    }
  }, [isReady, totalRemainingOnBoard, remainingEmojis, remainingObstacles, movesLeft, isProcessing, gameState, score, level, onVictory]);

  /**
   * Gravity Fall & Column Compaction
   * IMPORTANT: "patlayan emojilerin yerine yenileri eklenmesin"
   * Only existing emojis fall to the bottom of their columns.
   * If a column becomes completely empty, non-empty columns are centered together.
   */
  const applyGravity = useCallback((board: (CellData | null)[][]): (CellData | null)[][] => {
    const rows = board.length;
    const cols = board[0].length;

    // 1. In each column, let existing non-null items fall to bottom
    const columns: CellData[][] = [];
    for (let c = 0; c < cols; c++) {
      const colItems: CellData[] = [];
      for (let r = rows - 1; r >= 0; r--) {
        const item = board[r][c];
        if (item !== null) {
          colItems.push(item);
        }
      }
      columns.push(colItems); // bottom to top
    }

    // 2. Filter out completely empty columns
    const nonEmptyColumns = columns.filter((col) => col.length > 0);

    // Reconstruct newGrid:
    const newGrid: (CellData | null)[][] = Array.from({ length: rows }, () =>
      Array.from({ length: cols }, () => null)
    );

    if (nonEmptyColumns.length === 0) {
      return newGrid;
    }

    // Center the remaining non-empty columns so emojis connect!
    const emptyColsCount = cols - nonEmptyColumns.length;
    const leftPadding = Math.floor(emptyColsCount / 2);

    nonEmptyColumns.forEach((colItems, colIdx) => {
      const targetCol = leftPadding + colIdx;
      colItems.forEach((item, itemIdx) => {
        const targetRow = rows - 1 - itemIdx;
        item.row = targetRow;
        item.col = targetCol;
        newGrid[targetRow][targetCol] = item;
      });
    });

    return newGrid;
  }, []);

  // Main Pop Handler with Juicier Animations!
  const handleCellClick = (row: number, col: number) => {
    if (isProcessing || gameState !== 'playing') return;

    if (activeBooster === 'hammer') {
      handleHammerUse(row, col);
      return;
    }

    const clickedCell = grid[row]?.[col];
    if (!clickedCell) return;

    const power = clickedCell.power;
    const group = getConnectedGroup(row, col, grid);

    // If neither power nor a valid group (>=2)
    if (!power && group.length < 2) {
      sound.playInvalid();
      setMascotMood('worried');
      setMascotQuote('En az 2 bağlı!');
      return;
    }

    setIsProcessing(true);
    setSelectedGroup(new Set());

    // Calculate Pop Set (Set of cells to remove or blast)
    const toPop = new Set<string>();
    let powerToSpawn: SpecialPowerType | null = null;
    let powerSpawnPos: [number, number] | null = null;

    // Determine special power creation from group size
    if (!power) {
      if (group.length === 4) {
        powerToSpawn = 'rocket';
        powerSpawnPos = [row, col];
      } else if (group.length === 5) {
        powerToSpawn = 'bomb';
        powerSpawnPos = [row, col];
      } else if (group.length >= 6) {
        powerToSpawn = 'shock_blast';
        powerSpawnPos = [row, col];
      }
      group.forEach(([r, c]) => toPop.add(`${r},${c}`));
    }

    // Determine special power detonation if tapped directly
    if (power === 'rocket') {
      sound.playPowerExplosion('rocket');
      // Clear entire row and column
      for (let c = 0; c < level.cols; c++) {
        if (grid[row]?.[c]) toPop.add(`${row},${c}`);
      }
      for (let r = 0; r < level.rows; r++) {
        if (grid[r]?.[col]) toPop.add(`${r},${col}`);
      }
    } else if (power === 'bomb') {
      sound.playPowerExplosion('bomb');
      // Clear 3x3 surrounding
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = row + dr;
          const nc = col + dc;
          if (nr >= 0 && nr < level.rows && nc >= 0 && nc < level.cols && grid[nr]?.[nc]) {
            toPop.add(`${nr},${nc}`);
          }
        }
      }
    } else if (power === 'shock_blast') {
      sound.playPowerExplosion('shock');
      // Clear 5x5 + all instances of that emoji
      const targetEmoji = clickedCell.emoji;
      for (let r = 0; r < level.rows; r++) {
        for (let c = 0; c < level.cols; c++) {
          if (grid[r]?.[c]) {
            if (Math.abs(r - row) <= 2 && Math.abs(c - col) <= 2) {
              toPop.add(`${r},${c}`);
            }
            if (grid[r][c]?.emoji === targetEmoji) {
              toPop.add(`${r},${c}`);
            }
          }
        }
      }
    }

    // Emoji Unique Behaviors Trigger
    if (!power && group.length >= 2) {
      const type = clickedCell.emoji;

      if (type === 'angry') {
        // 😡 Öfke: diagonal X-burst lines!
        for (let i = 1; i <= 2; i++) {
          [[i, i], [i, -i], [-i, i], [-i, -i]].forEach(([dr, dc]) => {
            const nr = row + dr;
            const nc = col + dc;
            if (nr >= 0 && nr < level.rows && nc >= 0 && nc < level.cols && grid[nr]?.[nc]) {
              toPop.add(`${nr},${nc}`);
            }
          });
        }
      } else if (type === 'sad') {
        // 😢 Üzgün: vertical river blast!
        for (let r = 0; r < level.rows; r++) {
          if (grid[r]?.[col]) toPop.add(`${r},${col}`);
        }
      } else if (type === 'crazy') {
        // 🤪 Çılgın: pops all of a random emoji type!
        const randomOtherType = getRandomEmoji();
        for (let r = 0; r < level.rows; r++) {
          for (let c = 0; c < level.cols; c++) {
            if (grid[r]?.[c]?.emoji === randomOtherType) {
              toPop.add(`${r},${c}`);
            }
          }
        }
      } else if (type === 'cold') {
        // 🥶 Soğuk: melts all ice on the board
        for (let r = 0; r < level.rows; r++) {
          for (let c = 0; c < level.cols; c++) {
            if (grid[r]?.[c]?.obstacle === 'ice') {
              toPop.add(`${r},${c}`);
            }
          }
        }
      }
    }

    // Damage adjacent obstacles (Ice, Stone, Bubble, Lock)
    const affectedObstacles: { row: number; col: number }[] = [];
    toPop.forEach((key) => {
      const [r, c] = key.split(',').map(Number);
      const dirs = [[0, 1], [0, -1], [1, 0], [-1, 0]];
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < level.rows && nc >= 0 && nc < level.cols) {
          if (grid[nr]?.[nc]?.obstacle && !toPop.has(`${nr},${nc}`)) {
            affectedObstacles.push({ row: nr, col: nc });
          }
        }
      }
    });

    // Score & Combo Calculations
    const currentCombo = combo;
    const comboMultiplier = clickedCell.emoji === 'cool' ? currentCombo * 2 : currentCombo;
    const baseScore = toPop.size * 10;
    const bonusGroupScore = toPop.size >= 4 ? 30 : 0;
    const totalGainedScore = (baseScore + bonusGroupScore) * comboMultiplier;

    setScore((s) => s + totalGainedScore);
    const nextCombo = Math.min(combo + 1, 8);
    setCombo(nextCombo);
    resetComboTimer();

    // 1. START ANIMATION: mark cells with popping animation
    setPoppingKeys(new Set(toPop));

    // Play Sound & Vibrate
    if (!power) {
      sound.playPop(nextCombo, toPop.size);
      if (powerToSpawn) {
        sound.playPowerSpawn();
      }
    }

    if (nextCombo >= 2) {
      sound.playCombo(nextCombo);
    }
    if (nextCombo >= 3 && onComboAchievement) {
      onComboAchievement();
    }
    if (onPopEmojis) {
      onPopEmojis(toPop.size);
    }

    // Mascot Mood Update
    if (nextCombo >= 4) {
      setMascotMood('fire');
      setMascotQuote('ALEV ALDIN! 🔥');
    } else if (nextCombo >= 3 || toPop.size >= 6) {
      setMascotMood('shock');
      setMascotQuote('ÇILGIN ZİNCİR! 🤯');
    } else if (toPop.size >= 4) {
      setMascotMood('star');
      setMascotQuote('Süper Patlama! ⭐');
    } else {
      setMascotMood('happy');
      setMascotQuote('Harika!');
    }

    // Visual Floating text & particle burst
    addFloatingText(`+${totalGainedScore}`, 160, 200, '#FDE047', 1.2);
    if (nextCombo >= 2) {
      setTimeout(() => {
        addFloatingText(`COMBO x${nextCombo}!`, 160, 160, '#FB7185', 1.3);
      }, 100);
    }

    spawnParticles(160, 220, '#FBBF24', 18);

    // Track targets removed
    toPop.forEach((key) => {
      const [r, c] = key.split(',').map(Number);
      const cell = grid[r]?.[c];
      if (cell) {
        updateEmojiTarget(cell.emoji, 1);
        if (cell.obstacle) {
          updateObstacleTarget(cell.obstacle, 1);
        }
      }
    });

    // Reduce move
    setMovesLeft((m) => Math.max(0, m - 1));

    // 2. WAIT FOR ANIMATION TO COMPLETE (260ms), then apply gravity (without spawning new emojis)
    setTimeout(() => {
      const boardCopy: (CellData | null)[][] = grid.map((rArr, r) =>
        rArr.map((c, cIdx) => {
          if (toPop.has(`${r},${cIdx}`)) {
            if (powerToSpawn && powerSpawnPos && powerSpawnPos[0] === r && powerSpawnPos[1] === cIdx) {
              return {
                ...c!,
                power: powerToSpawn,
                obstacle: null,
              };
            }
            return null; // CLEARED! NO NEW ONE SPAWNED!
          }

          if (!c) return null;

          // Check if damaged adjacent obstacle
          const damaged = affectedObstacles.find((o) => o.row === r && o.col === cIdx);
          if (damaged && c.obstacle) {
            if (c.obstacle === 'stone') {
              if (c.obstacleHp > 1) {
                return { ...c, obstacleHp: c.obstacleHp - 1 };
              } else {
                updateObstacleTarget('stone', 1);
                return { ...c, obstacle: null, obstacleHp: 0 };
              }
            } else {
              updateObstacleTarget(c.obstacle, 1);
              return { ...c, obstacle: null, obstacleHp: 0 };
            }
          }

          // Wake up adjacent sleeping emojis
          if (c.isSleeping) {
            const isNearPop = [[0, 1], [0, -1], [1, 0], [-1, 0]].some(([dr, dc]) =>
              toPop.has(`${r + dr},${cIdx + dc}`)
            );
            if (isNearPop) {
              return { ...c, isSleeping: false };
            }
          }

          return c;
        })
      );

      // Apply downward gravity and column compaction
      const newGrid = applyGravity(boardCopy);
      setGrid(newGrid);
      setPoppingKeys(new Set());
      setIsProcessing(false);
    }, 260);
  };

  // Booster: Shuffle Board
  const handleShuffle = () => {
    if (isProcessing) return;
    sound.playClick();
    setIsProcessing(true);

    const nonNullCells = grid.flat().filter((c): c is CellData => c !== null);
    const flatEmojis = nonNullCells.map((c) => c.emoji);

    // Shuffle array
    for (let i = flatEmojis.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [flatEmojis[i], flatEmojis[j]] = [flatEmojis[j], flatEmojis[i]];
    }

    let idx = 0;
    const newGrid = grid.map((rArr) =>
      rArr.map((cell) => {
        if (!cell) return null;
        if (cell.obstacle === 'stone' || cell.obstacle === 'lock') {
          return cell;
        }
        const emoji = flatEmojis[idx++];
        return {
          ...cell,
          emoji,
          isSleeping: emoji === 'sleepy',
        };
      })
    );

    setGrid(newGrid);
    addFloatingText('KARIŞTIRILDI!', 160, 200, '#60A5FA', 1.2);
    setTimeout(() => setIsProcessing(false), 250);
  };

  // Extra moves purchased in defeat
  const handleBuyMoves = () => {
    if (onSpendCoins(100)) {
      setMovesLeft((m) => m + 5);
      setGameState('playing');
      setMascotMood('happy');
      setMascotQuote('+5 Hamle Aldın!');
    }
  };

  // Check 3-star score progress
  const [s1, s2, s3] = level.starScores;
  const starProgress = Math.min(100, Math.floor((score / s3) * 100));

  return (
    <div className="relative w-full h-full flex flex-col justify-between items-center bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-950 text-white overflow-hidden p-2.5 sm:p-3 select-none">
      {/* Visual Particle / Floating Text Layer */}
      <ParticleLayer particles={particles} floatingTexts={floatingTexts} />

      {/* Top Header HUD */}
      <div className="w-full max-w-sm flex items-center justify-between shrink-0 mb-1 z-20">
        {/* Home / Back Button */}
        <button
          onClick={() => {
            sound.playClick();
            onHome();
          }}
          className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-slate-200 transition-colors shadow-sm"
          title="Bölümler"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Level Title & Star Bar */}
        <div className="flex-1 flex flex-col items-center justify-center px-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-black text-amber-300 tracking-wide uppercase">
              BÖLÜM {level.id}
            </span>
          </div>

          {/* Star Progress Bar */}
          <div className="w-32 bg-slate-800/90 rounded-full h-2 p-0.5 border border-white/15 relative flex items-center mt-0.5">
            <div
              className="bg-gradient-to-r from-amber-400 to-yellow-300 h-full rounded-full transition-all duration-300 shadow-sm"
              style={{ width: `${starProgress}%` }}
            />
            {/* 3 Star markers */}
            <div className="absolute inset-0 flex justify-between items-center px-1 pointer-events-none">
              <Star size={10} className={score >= s1 ? 'fill-amber-400 text-amber-300' : 'text-slate-600'} />
              <Star size={10} className={score >= s2 ? 'fill-amber-400 text-amber-300' : 'text-slate-600'} />
              <Star size={10} className={score >= s3 ? 'fill-amber-400 text-amber-300' : 'text-slate-600'} />
            </div>
          </div>
        </div>

        {/* Replay Button */}
        <button
          onClick={() => {
            sound.playClick();
            onReplay();
          }}
          className="w-9 h-9 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 flex items-center justify-center text-slate-200 transition-colors shadow-sm"
          title="Yeniden Başlat"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      {/* Targets & Mascot HUD Zone */}
      <div className="w-full max-w-sm flex items-center justify-between gap-2 px-1 py-1 z-10 shrink-0">
        {/* Targets & Box Counter Box */}
        <div className="flex-1 bg-slate-900/80 border border-white/10 rounded-2xl p-2 flex items-center gap-2 backdrop-blur-md shadow-md min-h-[58px]">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            {/* Box Remaining Counter */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 shrink-0">
              <Box size={14} className="text-amber-400" />
              <div className="flex flex-col leading-none">
                <span className="text-[9px] uppercase font-bold text-amber-200/80">Kalan</span>
                <span className="text-xs font-black tabular-nums">{totalRemainingOnBoard}</span>
              </div>
            </div>

            {/* Emojis Target if defined */}
            {level.targets.emojis &&
              Object.entries(remainingEmojis).map(([type, count]) => (
                <div key={type} className="flex items-center gap-1 shrink-0">
                  <EmojiAvatar type={type as EmojiType} size={28} />
                  <span
                    className={`text-xs font-black tabular-nums ${
                      count <= 0 ? 'text-emerald-400' : 'text-white'
                    }`}
                  >
                    {count <= 0 ? '✓' : `×${count}`}
                  </span>
                </div>
              ))}

            {/* Obstacles Target if defined */}
            {level.targets.obstacles &&
              Object.entries(remainingObstacles).map(([type, count]) => (
                <div key={type} className="flex items-center gap-1 shrink-0">
                  <EmojiAvatar type="joy" obstacle={type as ObstacleType} size={28} />
                  <span
                    className={`text-xs font-black tabular-nums ${
                      count <= 0 ? 'text-emerald-400' : 'text-white'
                    }`}
                  >
                    {count <= 0 ? '✓' : `×${count}`}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Central Animated Emotion Mascot */}
        <div className="shrink-0 relative">
          <EmotionMascot mood={mascotMood} subtitle={mascotQuote} size={64} />
        </div>

        {/* Moves Left Counter Box */}
        <div
          className={`flex flex-col items-center justify-center px-3 py-1 rounded-2xl border backdrop-blur-md shadow-md min-w-[70px] min-h-[58px] transition-colors ${
            movesLeft <= 4
              ? 'bg-rose-950/80 border-rose-500/80 text-rose-300 animate-pulse'
              : 'bg-slate-900/80 border-white/10 text-white'
          }`}
        >
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            HAMLE
          </span>
          <span className="text-2xl font-black tabular-nums leading-none mt-0.5">
            {movesLeft}
          </span>
        </div>
      </div>

      {/* Combo Indicator Banner */}
      <div className="h-6 flex items-center justify-center shrink-0">
        {combo >= 2 && (
          <div className="px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white text-xs font-black tracking-wider shadow-lg animate-bounce flex items-center gap-1 border border-yellow-300/80">
            <Zap size={13} className="fill-yellow-300 text-yellow-300" />
            <span>COMBO x{combo}</span>
          </div>
        )}
      </div>

      {/* Main Game Board Grid */}
      <div className="flex-1 flex items-center justify-center my-auto w-full max-w-[390px] px-1 z-10">
        {grid.length > 0 && (
          <GameBoard
            grid={grid}
            onCellClick={handleCellClick}
            selectedGroup={selectedGroup}
            poppingKeys={poppingKeys}
            hoverGroup={handleHoverGroup}
            clearHover={handleClearHover}
            isProcessing={isProcessing}
          />
        )}
      </div>

      {/* Bottom Boosters & Score Bar */}
      <div className="w-full max-w-sm flex items-center justify-between gap-2 px-1 pt-2 z-10 shrink-0">
        {/* Score Display */}
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            SKOR
          </span>
          <span className="text-xl font-black text-amber-300 tabular-nums">
            {score.toLocaleString('tr-TR')}
          </span>
        </div>

        {/* Boosters: Hammer & Shuffle */}
        <div className="flex items-center gap-2">
          {/* Hammer Booster */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveBooster(activeBooster === 'hammer' ? null : 'hammer');
            }}
            className={`w-11 h-11 rounded-2xl flex flex-col items-center justify-center text-[10px] font-bold transition-all shadow-md ${
              activeBooster === 'hammer'
                ? 'game-btn game-btn-yellow scale-105 ring-2 ring-white'
                : 'game-btn bg-slate-800/90 text-slate-300 hover:bg-slate-700'
            }`}
            title="Çekiç: Tek bir emojiyi veya engeli kır!"
          >
            <Hammer size={18} className="text-amber-400" />
          </button>

          {/* Shuffle Booster */}
          <button
            onClick={handleShuffle}
            disabled={isProcessing}
            className="game-btn bg-slate-800/90 text-slate-300 hover:bg-slate-700 w-11 h-11 rounded-2xl flex flex-col items-center justify-center text-[10px] font-bold shadow-md transition-all active:scale-95"
            title="Tahtayı Karıştır"
          >
            <Shuffle size={18} className="text-indigo-400" />
          </button>
        </div>
      </div>

      {/* Modals for Victory and Defeat */}
      {gameState === 'won' && (
        <VictoryModal
          levelId={level.id}
          score={score}
          highScore={highScore}
          stars={score >= s3 ? 3 : score >= s2 ? 2 : 1}
          rewardCoins={50 + movesLeft * 5 + (totalRemainingOnBoard === 0 ? 30 : 0)}
          onNextLevel={onNextLevel}
          onReplay={onReplay}
          onHome={onHome}
        />
      )}

      {gameState === 'lost' && (
        <DefeatModal
          levelId={level.id}
          playerCoins={playerCoins}
          onRetry={onReplay}
          onBuyMoves={handleBuyMoves}
          onHome={onHome}
        />
      )}
    </div>
  );
};
