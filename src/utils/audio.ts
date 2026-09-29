/**
 * High-performance Web Audio API Sound Synthesizer for "Emoji Patlatma"
 * Provides instant, zero-latency tactile audio feedback without external assets.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = true;
  private isHapticsEnabled: boolean = true;

  constructor() {
    // Load preference from localStorage
    try {
      const savedSound = localStorage.getItem('emoji_sound_enabled');
      if (savedSound !== null) {
        this.isEnabled = savedSound === 'true';
      }
      const savedHaptics = localStorage.getItem('emoji_haptics_enabled');
      if (savedHaptics !== null) {
        this.isHapticsEnabled = savedHaptics === 'true';
      }
    } catch {
      // Ignore localStorage security errors
    }
  }

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getSoundEnabled(): boolean {
    return this.isEnabled;
  }

  public setSoundEnabled(val: boolean) {
    this.isEnabled = val;
    try {
      localStorage.setItem('emoji_sound_enabled', String(val));
    } catch {}
  }

  public getHapticsEnabled(): boolean {
    return this.isHapticsEnabled;
  }

  public setHapticsEnabled(val: boolean) {
    this.isHapticsEnabled = val;
    try {
      localStorage.setItem('emoji_haptics_enabled', String(val));
    } catch {}
  }

  public vibrate(pattern: number | number[] = 15) {
    if (this.isHapticsEnabled && typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  }

  /**
   * Satisfying Bubbly Pop Sound
   * Pitch scales with combo and count for dopamine-boosting casual game feel!
   */
  public playPop(pitchStep: number = 0, count: number = 3) {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    this.vibrate(count > 4 ? [25, 30, 35] : 15);

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    // Base pitch around 380Hz, rising up to 750Hz based on step
    const baseFreq = 380 + Math.min(pitchStep, 8) * 45;
    osc.type = 'sine';

    // Pitch sweep: fast upward chirp then drop for pop effect
    osc.frequency.setValueAtTime(baseFreq * 0.8, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.03);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.6, now + 0.12);

    // Volume envelope
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.15);

    // Add a secondary soft bubble harmonic
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(baseFreq * 1.2, now);
    subOsc.frequency.exponentialRampToValueAtTime(baseFreq * 2.2, now + 0.04);
    subGain.gain.setValueAtTime(0.15, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.1);
  }

  /**
   * Ascending Combo Chime Fanfare
   */
  public playCombo(comboLevel: number) {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    this.vibrate([20, 40, 30]);

    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C, E, G, C5, E5, G5, C6
    const startIdx = Math.min(comboLevel, notes.length - 2);

    const now = this.ctx.currentTime;
    [0, 1].forEach((offset, idx) => {
      if (!this.ctx) return;
      const freq = notes[startIdx + offset] || 523.25;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0.25, now + idx * 0.07);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.22);
    });
  }

  /**
   * Power Creation chime (when 4, 5, or 6+ are matched)
   */
  public playPowerSpawn() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    this.vibrate([15, 20, 25]);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.2);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.3);
  }

  /**
   * Special Power Detonation (Rocket / Bomb / Shock)
   */
  public playPowerExplosion(type: 'rocket' | 'bomb' | 'shock' = 'bomb') {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    this.vibrate([40, 30, 60]);
    const now = this.ctx.currentTime;

    // Low boom oscillator
    const boomOsc = this.ctx.createOscillator();
    const boomGain = this.ctx.createGain();

    boomOsc.type = 'triangle';
    const startFreq = type === 'shock' ? 320 : (type === 'rocket' ? 240 : 180);
    boomOsc.frequency.setValueAtTime(startFreq, now);
    boomOsc.frequency.exponentialRampToValueAtTime(40, now + 0.35);

    boomGain.gain.setValueAtTime(0.4, now);
    boomGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    boomOsc.connect(boomGain);
    boomGain.connect(this.ctx.destination);

    boomOsc.start(now);
    boomOsc.stop(now + 0.42);

    // High sizzle / sparkle
    const sparkleOsc = this.ctx.createOscillator();
    const sparkleGain = this.ctx.createGain();
    sparkleOsc.type = 'sawtooth';
    sparkleOsc.frequency.setValueAtTime(800, now);
    sparkleOsc.frequency.exponentialRampToValueAtTime(200, now + 0.2);
    sparkleGain.gain.setValueAtTime(0.12, now);
    sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    sparkleOsc.connect(sparkleGain);
    sparkleGain.connect(this.ctx.destination);
    sparkleOsc.start(now);
    sparkleOsc.stop(now + 0.25);
  }

  /**
   * Victory celebratory fanfare!
   */
  public playWin() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    this.vibrate([50, 50, 100, 50, 150]);
    const notes = [
      { f: 523.25, d: 0.12 }, // C5
      { f: 659.25, d: 0.12 }, // E5
      { f: 783.99, d: 0.15 }, // G5
      { f: 1046.50, d: 0.45 }, // C6
    ];

    let t = this.ctx.currentTime;
    notes.forEach((note) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, t);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + note.d + 0.05);

      t += note.d * 0.9;
    });
  }

  /**
   * Defeat soft chime
   */
  public playDefeat() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    this.vibrate([40, 50, 40]);
    const notes = [440, 392, 349.23, 293.66]; // A4, G4, F4, D4
    let t = this.ctx.currentTime;
    notes.forEach((f, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, t + idx * 0.12);

      gain.gain.setValueAtTime(0.2, t + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.12 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t + idx * 0.12);
      osc.stop(t + idx * 0.12 + 0.22);
    });
  }

  /**
   * UI Click
   */
  public playClick() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    this.vibrate(10);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  /**
   * Invalid move (gentle buzz)
   */
  public playInvalid() {
    if (!this.isEnabled) return;
    this.initCtx();
    if (!this.ctx) return;

    this.vibrate(20);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.setValueAtTime(120, now + 0.05);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }
}

export const sound = new SoundEngine();
