export type EmojiType =
  | 'joy'     // 😂 Kahkaha
  | 'love'    // 😍 Aşk
  | 'angry'   // 😡 Öfke
  | 'fear'    // 😱 Korku
  | 'shock'   // 🤯 Şok
  | 'cold'    // 🥶 Soğuk
  | 'cool'    // 😎 Havalı
  | 'crazy'   // 🤪 Çılgın
  | 'sad'     // 😢 Üzgün
  | 'sleepy'; // 😴 Uykulu

export type SpecialPowerType =
  | 'rocket'       // 4 emojis: cross row & column blast
  | 'bomb'         // 5 emojis: 3x3 blast
  | 'shock_blast'; // 6+ emojis: 5x5 mega blast + type zap

export type ObstacleType =
  | 'ice'      // 🧊 Buz (blocks emoji, melts when adjacent pops)
  | 'stone'    // 🪨 Taş (boulder, breaks with bomb or adjacent pops)
  | 'bubble'   // 🫧 Baloncuk (traps emoji, pops with adjacent match)
  | 'lock';    // 🔒 Kilit (chains emoji, unlocked by matching same emoji)

export interface CellData {
  id: string;
  row: number;
  col: number;
  emoji: EmojiType;
  power: SpecialPowerType | null;
  obstacle: ObstacleType | null;
  obstacleHp: number; // e.g. 1 or 2 for stones
  isSleeping?: boolean;
}

export interface LevelTarget {
  emojis?: Partial<Record<EmojiType, number>>;
  obstacles?: Partial<Record<ObstacleType, number>>;
  scoreTarget?: number;
}

export interface LevelConfig {
  id: number;
  title: string;
  allowedEmojis: EmojiType[];
  rows: number;
  cols: number;
  moves: number;
  targets: LevelTarget;
  starScores: [number, number, number];
  presetObstacles?: { row: number; col: number; type: ObstacleType; hp?: number }[];
  hint?: string;
}

export type MascotMood =
  | 'idle'     // 😐
  | 'happy'    // 😊
  | 'love'     // 😍
  | 'star'     // 🤩
  | 'shock'    // 🤯
  | 'fire'     // 🔥
  | 'worried'  // 😕
  | 'angry'    // 😤
  | 'party'    // 🥳
  | 'sad';     // 🥺

export interface FloatingText {
  id: string;
  text: string;
  x: number;
  y: number;
  color?: string;
  scale?: number;
}

export interface Particle {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  shape: 'circle' | 'star' | 'heart' | 'sparkle';
}

export interface PlayerProgress {
  unlockedLevel: number;
  levelStars: Record<number, number>;
  levelHighScores: Record<number, number>;
  coins: number;
  boosters: {
    shuffle: number;
    hammer: number;
    rocket: number;
  };
  dailyMissions: {
    date: string;
    poppedCount: number;
    combosCount: number;
    levelsCompleted: number;
    claimed: Record<string, boolean>;
  };
}
