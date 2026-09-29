/**
 * Emoji Patlatma - Full Mobile-First Casual Game App
 */

import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { MainMenu } from './components/MainMenu';
import { GameScreen } from './components/GameScreen';
import { LevelSelectModal } from './components/LevelSelectModal';
import { HowToPlayModal } from './components/HowToPlayModal';
import { DailyMissionsModal } from './components/DailyMissionsModal';
import { SettingsModal } from './components/SettingsModal';
import { LEVELS } from './data/levels';
import { PlayerProgress } from './types/game';

const STORAGE_KEY = 'emoji_patlatma_progress_v2';

const DEFAULT_PROGRESS: PlayerProgress = {
  unlockedLevel: 1,
  levelStars: {},
  levelHighScores: {},
  coins: 120,
  boosters: {
    shuffle: 3,
    hammer: 2,
    rocket: 2,
  },
  dailyMissions: {
    date: new Date().toDateString(),
    poppedCount: 0,
    combosCount: 0,
    levelsCompleted: 0,
    claimed: {},
  },
};

// Safe Error Boundary to prevent any blank white/dark screen
interface ErrorBoundaryProps {
  children: ReactNode;
}
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Emoji Patlatma Error:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-slate-950 text-white text-center">
          <div className="text-4xl mb-2">🥺</div>
          <h2 className="text-xl font-black text-amber-400 mb-2">Bir Hata Oluştu</h2>
          <p className="text-xs text-slate-300 max-w-xs mb-4">
            Oyun verisi sıfırlanarak tekrar başlatılabilir.
          </p>
          <button
            onClick={this.handleReset}
            className="game-btn game-btn-yellow px-6 py-3 rounded-2xl text-sm font-black"
          >
            OYUNU YENİDEN BAŞLAT
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [screen, setScreen] = useState<'MAIN_MENU' | 'PLAYING'>('MAIN_MENU');
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [showLevelSelect, setShowLevelSelect] = useState(false);
  const [showMissions, setShowMissions] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // Load progress from localStorage with deep sanitization
  const [progress, setProgress] = useState<PlayerProgress>(() => {
    try {
      localStorage.removeItem('emoji_patlatma_progress_v1');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const today = new Date().toDateString();

        return {
          unlockedLevel: typeof parsed.unlockedLevel === 'number' && parsed.unlockedLevel >= 1 && parsed.unlockedLevel <= 50 ? parsed.unlockedLevel : 1,
          coins: typeof parsed.coins === 'number' ? parsed.coins : 120,
          levelStars: parsed.levelStars && typeof parsed.levelStars === 'object' ? parsed.levelStars : {},
          levelHighScores: parsed.levelHighScores && typeof parsed.levelHighScores === 'object' ? parsed.levelHighScores : {},
          boosters: {
            shuffle: parsed.boosters?.shuffle ?? 3,
            hammer: parsed.boosters?.hammer ?? 2,
            rocket: parsed.boosters?.rocket ?? 2,
          },
          dailyMissions: {
            date: parsed.dailyMissions?.date === today ? today : today,
            poppedCount: parsed.dailyMissions?.date === today ? (parsed.dailyMissions?.poppedCount || 0) : 0,
            combosCount: parsed.dailyMissions?.date === today ? (parsed.dailyMissions?.combosCount || 0) : 0,
            levelsCompleted: parsed.dailyMissions?.date === today ? (parsed.dailyMissions?.levelsCompleted || 0) : 0,
            claimed: parsed.dailyMissions?.date === today && parsed.dailyMissions?.claimed ? parsed.dailyMissions.claimed : {},
          },
        };
      }
    } catch (e) {
      console.warn('Could not read progress from localStorage, using default:', e);
    }
    return DEFAULT_PROGRESS;
  });

  // Save progress on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  const [gameSession, setGameSession] = useState<number>(0);

  // Start Playing level
  const handleStartLevel = (levelId: number) => {
    setActiveLevelId(levelId);
    setGameSession((s) => s + 1);
    setShowLevelSelect(false);
    setScreen('PLAYING');
  };

  // Play next level or current unlocked level
  const handlePlayCurrent = () => {
    handleStartLevel(progress.unlockedLevel || 1);
  };

  // On Victory
  const handleVictory = (levelId: number, score: number, stars: number, coinsEarned: number) => {
    setProgress((prev) => {
      const nextUnlocked = Math.max(prev.unlockedLevel || 1, Math.min(levelId + 1, 50));
      const currentBestStars = prev.levelStars?.[levelId] || 0;
      const currentHighScore = prev.levelHighScores?.[levelId] || 0;

      return {
        ...prev,
        unlockedLevel: nextUnlocked,
        coins: (prev.coins || 0) + coinsEarned,
        levelStars: {
          ...(prev.levelStars || {}),
          [levelId]: Math.max(currentBestStars, stars),
        },
        levelHighScores: {
          ...(prev.levelHighScores || {}),
          [levelId]: Math.max(currentHighScore, score),
        },
        dailyMissions: {
          ...prev.dailyMissions,
          levelsCompleted: (prev.dailyMissions?.levelsCompleted || 0) + 1,
        },
      };
    });
  };

  // Track popped emojis for daily mission
  const handlePopEmojis = (count: number) => {
    setProgress((prev) => ({
      ...prev,
      dailyMissions: {
        ...prev.dailyMissions,
        poppedCount: (prev.dailyMissions?.poppedCount || 0) + count,
      },
    }));
  };

  // Track high combos for daily mission
  const handleComboAchievement = () => {
    setProgress((prev) => ({
      ...prev,
      dailyMissions: {
        ...prev.dailyMissions,
        combosCount: (prev.dailyMissions?.combosCount || 0) + 1,
      },
    }));
  };

  // Spend Coins helper
  const handleSpendCoins = (amount: number): boolean => {
    if ((progress.coins || 0) >= amount) {
      setProgress((prev) => ({
        ...prev,
        coins: (prev.coins || 0) - amount,
      }));
      return true;
    }
    return false;
  };

  // Claim Mission Reward
  const handleClaimMissionReward = (missionId: string, reward: number) => {
    setProgress((prev) => ({
      ...prev,
      coins: (prev.coins || 0) + reward,
      dailyMissions: {
        ...prev.dailyMissions,
        claimed: {
          ...(prev.dailyMissions?.claimed || {}),
          [missionId]: true,
        },
      },
    }));
  };

  // Reset Progress
  const handleResetProgress = () => {
    setProgress({
      ...DEFAULT_PROGRESS,
      dailyMissions: {
        date: new Date().toDateString(),
        poppedCount: 0,
        combosCount: 0,
        levelsCompleted: 0,
        claimed: {},
      },
    });
    setActiveLevelId(1);
    setScreen('MAIN_MENU');
  };

  const currentLevelConfig = LEVELS.find((l) => l.id === activeLevelId) || LEVELS[0];

  return (
    <ErrorBoundary>
      <div className="w-full h-full min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden font-['Fredoka',sans-serif]">
        {/* Mobile-Frame Responsive Container */}
        <main className="relative w-full max-w-[430px] h-full sm:h-[92vh] sm:max-h-[860px] bg-slate-900 sm:rounded-3xl sm:border-4 sm:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
          {screen === 'MAIN_MENU' && (
            <MainMenu
              progress={progress}
              onPlay={handlePlayCurrent}
              onOpenLevels={() => setShowLevelSelect(true)}
              onOpenMissions={() => setShowMissions(true)}
              onOpenHowToPlay={() => setShowHowToPlay(true)}
              onOpenSettings={() => setShowSettings(true)}
            />
          )}

          {screen === 'PLAYING' && (
            <GameScreen
              key={`${activeLevelId}-${gameSession}`} // re-mount on level or session change
              level={currentLevelConfig}
              playerCoins={progress.coins || 0}
              highScore={progress.levelHighScores?.[activeLevelId] || 0}
              onVictory={handleVictory}
              onHome={() => setScreen('MAIN_MENU')}
              onReplay={() => {
                setGameSession((s) => s + 1);
              }}
              onNextLevel={() => {
                if (activeLevelId < 50) {
                  handleStartLevel(activeLevelId + 1);
                } else {
                  setScreen('MAIN_MENU');
                }
              }}
              onSpendCoins={handleSpendCoins}
              onPopEmojis={handlePopEmojis}
              onComboAchievement={handleComboAchievement}
            />
          )}

          {/* Global Modals */}
          {showLevelSelect && (
            <LevelSelectModal
              progress={progress}
              onSelectLevel={handleStartLevel}
              onClose={() => setShowLevelSelect(false)}
            />
          )}

          {showMissions && (
            <DailyMissionsModal
              progress={progress}
              onClaimReward={handleClaimMissionReward}
              onClose={() => setShowMissions(false)}
            />
          )}

          {showHowToPlay && (
            <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
          )}

          {showSettings && (
            <SettingsModal
              onClose={() => setShowSettings(false)}
              onResetProgress={handleResetProgress}
            />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}
