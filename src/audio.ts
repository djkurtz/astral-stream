// Procedural Web Audio Engine for Astral Stream (Zero external asset dependencies)

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isWarped: boolean = false;
  private bgmInterval: number | null = null;
  private beatCount: number = 0;
  private filterNode: BiquadFilterNode | null = null;

  public init(): void {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AudioCtx();
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(12000, this.ctx.currentTime);
    this.filterNode.connect(this.ctx.destination);
  }

  public setWarped(warped: boolean): void {
    this.isWarped = warped;
    if (!this.ctx || !this.filterNode) return;
    const targetFreq = warped ? 1100 : 14000;
    this.filterNode.frequency.exponentialRampToValueAtTime(targetFreq, this.ctx.currentTime + 0.5);
  }

  public playTone(freq: number, type: OscillatorType = 'square', duration: number = 0.15, vol: number = 0.1): void {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.filterNode || this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio error:', e);
    }
  }

  public playDrum(kind: 'kick' | 'snare' | 'hihat'): void {
    if (!this.ctx || this.isMuted) return;
    try {
      if (kind === 'kick') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(130, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(30, this.ctx.currentTime + 0.18);

        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.18);

        osc.connect(gain);
        gain.connect(this.filterNode || this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.18);
      } else if (kind === 'snare') {
        this.playTone(180, 'triangle', 0.1, 0.2);
        this.playStaticHiss(0.1, 0.08);
      } else if (kind === 'hihat') {
        this.playStaticHiss(0.04, 0.04);
      }
    } catch (e) {}
  }

  public playStaticHiss(duration: number = 0.15, vol: number = 0.1): void {
    if (!this.ctx || this.isMuted) return;
    try {
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(vol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      whiteNoise.connect(gain);
      gain.connect(this.filterNode || this.ctx.destination);
      whiteNoise.start();
    } catch (e) {}
  }

  public playTuningClick(): void {
    this.playTone(600 + Math.random() * 300, 'square', 0.04, 0.05);
  }

  public playLockChime(): void {
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 'sine', 0.25, 0.15), i * 70);
    });
  }

  public playCleansingBloom(): void {
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((note, i) => {
      setTimeout(() => {
        this.playTone(note, 'triangle', 0.5, 0.2);
        this.playTone(note * 1.5, 'sine', 0.4, 0.1);
      }, i * 90);
    });
  }

  public playMoveSound(type: string): void {
    if (type === 'arpeggio') {
      [659, 783, 987, 1318].forEach((f, i) => setTimeout(() => this.playTone(f, 'square', 0.12, 0.12), i * 50));
    } else if (type === 'bass_drop') {
      const osc = this.ctx?.createOscillator();
      const gain = this.ctx?.createGain();
      if (!this.ctx || !osc || !gain) return;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(35, this.ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.filterNode || this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } else if (type === 'glitch_hit') {
      this.playStaticHiss(0.25, 0.25);
      this.playTone(90, 'sawtooth', 0.2, 0.2);
    } else if (type === 'cosmic_burst') {
      this.playCleansingBloom();
    }
  }

  public startBGM(): void {
    if (this.bgmInterval) return;
    this.init();

    // 120 BPM chiptune pattern
    const melodyC = [523, 0, 659, 0, 783, 659, 1046, 783];
    const bassC = [130, 0, 130, 0, 164, 0, 196, 0];

    this.bgmInterval = window.setInterval(() => {
      if (!this.ctx || this.isMuted) return;
      const step = this.beatCount % 8;

      // Drums
      if (step === 0 || step === 4) this.playDrum('kick');
      if (step === 2 || step === 6) this.playDrum('snare');
      this.playDrum('hihat');

      // Bass & Melody
      const mNote = melodyC[step];
      const bNote = bassC[step];

      if (mNote > 0) {
        this.playTone(this.isWarped ? mNote * 0.98 : mNote, 'square', 0.1, 0.04);
      }
      if (bNote > 0) {
        this.playTone(this.isWarped ? bNote * 1.03 : bNote, 'triangle', 0.15, 0.08);
      }

      if (this.isWarped && Math.random() < 0.2) {
        this.playStaticHiss(0.08, 0.06);
      }

      this.beatCount++;
    }, 150);
  }

  public stopBGM(): void {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const soundEngine = new AudioEngine();
