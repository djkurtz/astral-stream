// Harmonia: Opus of the Ensemble - Procedural Multi-Voice Audio Engine

import { InstrumentId, InstrumentSection } from './types';

export class HarmoniaSoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isMuted: boolean = false;
  private bgmInterval: number | null = null;
  private currentBgm: string = 'cavatina_village';
  private step: number = 0;

  constructor() {
    // Lazy audio context initialization on user interaction
  }

  public init(): void {
    if (this.ctx) return;
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtxClass) return;
    this.ctx = new AudioCtxClass();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);
  }

  private ensureContext(): boolean {
    if (!this.ctx) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return !!this.ctx;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 0.3, this.ctx.currentTime);
    }
  }

  public setMasterVolume(volume: number): void {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, volume)), this.ctx.currentTime);
    }
  }

  public getCurrentBgm(): string {
    return this.currentBgm;
  }

  /* ---------------- PROCEDURAL INSTRUMENT SYNTHESIS ---------------- */

  /**
   * Synthesize a note for a specific instrument
   */
  public playInstrumentNote(instrumentId: InstrumentId, freq: number, duration: number = 0.4, velocity: number = 0.8): void {
    if (this.isMuted || !this.ensureContext() || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    switch (instrumentId) {
      // --- STRINGS ---
      case 'violin':
      case 'cello':
      case 'harp':
      case 'acoustic_guitar': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = instrumentId === 'acoustic_guitar' || instrumentId === 'harp' ? 'triangle' : 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);

        // Add gentle vibrato for bowed strings
        if (instrumentId === 'violin' || instrumentId === 'cello') {
          const lfo = this.ctx.createOscillator();
          const lfoGain = this.ctx.createGain();
          lfo.frequency.setValueAtTime(5.5, t); // 5.5 Hz vibrato
          lfoGain.gain.setValueAtTime(freq * 0.015, t);
          lfo.connect(osc.frequency);
          lfo.start(t);
          lfo.stop(t + duration);
        }

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(instrumentId === 'cello' ? 800 : 2400, t);

        // Envelope
        gain.gain.setValueAtTime(0, t);
        if (instrumentId === 'acoustic_guitar' || instrumentId === 'harp') {
          // Plucked envelope: rapid attack, exponential decay
          gain.gain.linearRampToValueAtTime(0.35 * velocity, t + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        } else {
          // Bowed envelope: smooth swell and release
          gain.gain.linearRampToValueAtTime(0.3 * velocity, t + 0.05);
          gain.gain.setValueAtTime(0.25 * velocity, t + duration * 0.7);
          gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        }

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + duration);
        break;
      }

      // --- WOODWINDS ---
      case 'silver_flute':
      case 'soprano_sax':
      case 'clarinet':
      case 'oboe': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = instrumentId === 'soprano_sax' ? 'sawtooth' : (instrumentId === 'clarinet' ? 'square' : 'sine');
        osc.frequency.setValueAtTime(freq, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(instrumentId === 'soprano_sax' ? 1800 : 1200, t);
        filter.Q.setValueAtTime(2.0, t);

        // Flute vibrato
        if (instrumentId === 'silver_flute') {
          const lfo = this.ctx.createOscillator();
          const lfoGain = this.ctx.createGain();
          lfo.frequency.setValueAtTime(6.0, t);
          lfoGain.gain.setValueAtTime(freq * 0.012, t);
          lfo.connect(osc.frequency);
          lfo.start(t);
          lfo.stop(t + duration);
        }

        // Breathy envelope
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.28 * velocity, t + 0.04);
        gain.gain.setValueAtTime(0.24 * velocity, t + duration * 0.75);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + duration);
        break;
      }

      // --- BRASS ---
      case 'pocket_trumpet':
      case 'french_horn':
      case 'trombone':
      case 'tuba': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);

        // Brass dynamic filter swell (lip resonance)
        filter.type = 'lowpass';
        filter.Q.setValueAtTime(3.5, t);
        const baseCutoff = instrumentId === 'tuba' ? 350 : (instrumentId === 'trombone' ? 700 : 1400);
        filter.frequency.setValueAtTime(baseCutoff * 0.5, t);
        filter.frequency.exponentialRampToValueAtTime(baseCutoff * 3.0, t + 0.08);
        filter.frequency.exponentialRampToValueAtTime(baseCutoff, t + duration);

        // Envelope
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.32 * velocity, t + 0.03);
        gain.gain.setValueAtTime(0.26 * velocity, t + duration * 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + duration);
        break;
      }

      // --- PERCUSSION ---
      case 'snare_kit':
      case 'marimba':
      case 'timpani':
      case 'glockenspiel': {
        if (instrumentId === 'snare_kit') {
          // Snare: Noise Burst + Snare Body Sine
          const bufferSize = this.ctx.sampleRate * 0.15;
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }

          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          const noiseGain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(1000, t);

          noiseGain.gain.setValueAtTime(0.3 * velocity, t);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);

          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(this.masterGain);
          noise.start(t);

          // Tone thump
          const osc = this.ctx.createOscillator();
          const oscGain = this.ctx.createGain();
          osc.frequency.setValueAtTime(180, t);
          osc.frequency.exponentialRampToValueAtTime(80, t + 0.08);
          oscGain.gain.setValueAtTime(0.25 * velocity, t);
          oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
          osc.connect(oscGain);
          oscGain.connect(this.masterGain);
          osc.start(t);
          osc.stop(t + 0.08);
        } else if (instrumentId === 'timpani') {
          // Timpani: Resonant Sine with pitch drop
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t);
          osc.frequency.exponentialRampToValueAtTime(freq * 0.85, t + duration);

          gain.gain.setValueAtTime(0.4 * velocity, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(t);
          osc.stop(t + duration);
        } else {
          // Marimba / Glockenspiel: Wooden or Metallic Mallet Strike
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = instrumentId === 'glockenspiel' ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.35 * velocity, t + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.001, t + (instrumentId === 'glockenspiel' ? 0.8 : 0.25));

          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(t);
          osc.stop(t + (instrumentId === 'glockenspiel' ? 0.8 : 0.25));
        }
        break;
      }
    }
  }

  /* ---------------- PRACTICE & UI SOUND FX ---------------- */

  public playMetronomeClick(accent: boolean = false): void {
    if (this.isMuted || !this.ensureContext() || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(accent ? 1200 : 800, t);
    gain.gain.setValueAtTime(accent ? 0.4 : 0.2, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + 0.04);
  }

  public playNoteAccuracyFeedback(accuracy: 'perfect' | 'great' | 'good' | 'miss'): void {
    if (this.isMuted || !this.ensureContext() || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (accuracy === 'perfect') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, t); // A5
      osc.frequency.setValueAtTime(1320, t + 0.06); // E6
      gain.gain.setValueAtTime(0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    } else if (accuracy === 'great') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(784, t); // G5
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    } else if (accuracy === 'good') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523, t); // C5
      gain.gain.setValueAtTime(0.15, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
    } else {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    }

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(t);
    osc.stop(t + (accuracy === 'perfect' ? 0.2 : 0.15));
  }

  public playFanfare(): void {
    if (this.isMuted || !this.ensureContext()) return;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playInstrumentNote('pocket_trumpet', freq, 0.35, 0.9);
      }, idx * 120);
    });
  }

    /* ---------------- DYNAMIC BIOME SOUNDSCAPES & WILDLIFE FX ---------------- */

  public playWildlifeCall(species: string): void {
    if (this.isMuted || !this.ensureContext() || !this.ctx || !this.masterGain) return;
    
    if (species.includes('hare') || species.includes('bunny')) {
      // Playful rapid staccato plucks
      [659.25, 880.00, 987.77].forEach((freq, idx) => {
        setTimeout(() => this.playInstrumentNote('acoustic_guitar', freq, 0.15, 0.7), idx * 80);
      });
    } else if (species.includes('swan')) {
      // Lyrical singing vibrato glide
      [587.33, 880.00, 1046.50].forEach((freq, idx) => {
        setTimeout(() => this.playInstrumentNote('violin', freq, 0.45, 0.8), idx * 150);
      });
    } else if (species.includes('frog')) {
      // Bubbly staccato trill
      [392.00, 440.00, 392.00, 523.25].forEach((freq, idx) => {
        setTimeout(() => this.playInstrumentNote('silver_flute', freq, 0.1, 0.8), idx * 70);
      });
    } else if (species.includes('finch') || species.includes('bird')) {
      // High fluttering birdsong chirps
      [1046.50, 1174.66, 1318.51, 1567.98].forEach((freq, idx) => {
        setTimeout(() => this.playInstrumentNote('silver_flute', freq, 0.12, 0.75), idx * 60);
      });
    } else if (species.includes('badger')) {
      // Punchy double-tongued brass call
      [293.66, 293.66, 440.00, 587.33].forEach((freq, idx) => {
        setTimeout(() => this.playInstrumentNote('pocket_trumpet', freq, 0.15, 0.85), idx * 90);
      });
    } else if (species.includes('terrier') || species.includes('hound')) {
      // Energetic rhythmic fanfare barking
      [440.00, 659.25, 440.00, 880.00].forEach((freq, idx) => {
        setTimeout(() => this.playInstrumentNote('pocket_trumpet', freq, 0.18, 0.9), idx * 110);
      });
    } else if (species.includes('armadillo') || species.includes('raccoon')) {
      // Snappy rolling percussion tap
      [0, 60, 120, 180].forEach(delay => {
        setTimeout(() => this.playInstrumentNote('snare_kit', 220, 0.1, 0.8), delay);
      });
    } else if (species.includes('tortoise') || species.includes('bear')) {
      // Deep resonant bronze gong strike
      this.playInstrumentNote('timpani', 110, 0.8, 0.9);
      setTimeout(() => this.playInstrumentNote('glockenspiel', 880, 0.6, 0.5), 50);
    } else {
      this.playInstrumentNote('glockenspiel', 659.25, 0.3, 0.6);
    }
  }

  public playBiomeNatureAmbience(zone: string): void {
    if (this.isMuted || !this.ensureContext() || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    if (zone.includes('wilderness') || zone.includes('woods') || zone.includes('valley') || zone.includes('glade')) {
      // Soft rustling wind breeze (filtered white noise)
      const bufferSize = this.ctx.sampleRate * 0.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.08;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(zone.includes('canyon') ? 400 : 800, t);
      filter.Q.setValueAtTime(3.0, t);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.12, t + 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      whiteNoise.start(t);
      whiteNoise.stop(t + 0.8);
    }
  }

  /* ---------------- DYNAMIC MULTI-BIOME ENSEMBLE BGM ---------------- */

  public startBGM(zone: string = 'cavatina_village', activeSections: InstrumentSection[] = ['strings']): void {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.currentBgm = zone;
    this.step = 0;

    interface BiomeChord {
      root: number;
      strings: number[];
      winds: number[];
      brass: number[];
      leadInst: InstrumentId;
    }

    let chords: BiomeChord[] = [];
    let bpm = 100;

    if (zone === 'cavatina_village') {
      // Pastoral F Major (F - Dm - Bb - C)
      bpm = 96;
      chords = [
        { root: 174.61, strings: [349.23, 440.00, 523.25], winds: [698.46, 880.00], brass: [261.63, 349.23], leadInst: 'violin' },
        { root: 146.83, strings: [293.66, 349.23, 440.00], winds: [587.33, 698.46], brass: [220.00, 293.66], leadInst: 'violin' },
        { root: 116.54, strings: [233.08, 349.23, 466.16], winds: [466.16, 587.33], brass: [174.61, 233.08], leadInst: 'cello' },
        { root: 130.81, strings: [261.63, 329.63, 392.00], winds: [523.25, 659.25], brass: [196.00, 261.63], leadInst: 'violin' }
      ];
    } else if (zone === 'west_wilderness') {
      // Lyre Valley: Gentle Folk G Major (G - Em - C - D)
      bpm = 88;
      chords = [
        { root: 196.00, strings: [392.00, 493.88, 587.33], winds: [783.99, 987.77], brass: [196.00, 293.66], leadInst: 'acoustic_guitar' },
        { root: 164.81, strings: [329.63, 392.00, 493.88], winds: [659.25, 783.99], brass: [164.81, 246.94], leadInst: 'acoustic_guitar' },
        { root: 130.81, strings: [261.63, 329.63, 392.00], winds: [523.25, 659.25], brass: [130.81, 196.00], leadInst: 'violin' },
        { root: 146.83, strings: [293.66, 369.99, 440.00], winds: [587.33, 739.99], brass: [146.83, 220.00], leadInst: 'acoustic_guitar' }
      ];
    } else if (zone === 'woodwind_woods') {
      // Sylvan Bossa Nova / Jazz G Dorian (Gmaj7 - Em9 - Am7 - D7)
      bpm = 112;
      chords = [
        { root: 196.00, strings: [392.00, 493.88, 587.33], winds: [739.99, 880.00], brass: [293.66, 392.00], leadInst: 'silver_flute' },
        { root: 164.81, strings: [329.63, 392.00, 493.88], winds: [659.25, 739.99], brass: [246.94, 329.63], leadInst: 'soprano_sax' },
        { root: 220.00, strings: [261.63, 329.63, 440.00], winds: [523.25, 659.25], brass: [220.00, 329.63], leadInst: 'clarinet' },
        { root: 146.83, strings: [293.66, 369.99, 440.00], winds: [587.33, 698.46], brass: [220.00, 293.66], leadInst: 'silver_flute' }
      ];
    } else if (zone === 'east_wilderness') {
      // Breeze Glade: Misty Impressionist Pentatonic in D (D - G - A - Bm)
      bpm = 86;
      chords = [
        { root: 146.83, strings: [293.66, 440.00, 587.33], winds: [587.33, 880.00], brass: [220.00, 293.66], leadInst: 'silver_flute' },
        { root: 196.00, strings: [392.00, 493.88, 587.33], winds: [783.99, 987.77], brass: [196.00, 293.66], leadInst: 'oboe' },
        { root: 220.00, strings: [440.00, 554.37, 659.25], winds: [880.00, 1108.73], brass: [220.00, 329.63], leadInst: 'silver_flute' },
        { root: 123.47, strings: [246.94, 369.99, 493.88], winds: [493.88, 739.99], brass: [185.00, 246.94], leadInst: 'oboe' }
      ];
    } else if (zone === 'brass_citadel') {
      // Gilded Citadel: Heroic Eb Major (Eb - Ab - Bb - Cm)
      bpm = 106;
      chords = [
        { root: 155.56, strings: [311.13, 392.00, 466.16], winds: [622.25, 783.99], brass: [233.08, 311.13], leadInst: 'pocket_trumpet' },
        { root: 207.65, strings: [261.63, 329.63, 415.30], winds: [523.25, 659.25], brass: [207.65, 311.13], leadInst: 'french_horn' },
        { root: 116.54, strings: [233.08, 349.23, 466.16], winds: [466.16, 698.46], brass: [174.61, 233.08], leadInst: 'trombone' },
        { root: 130.81, strings: [261.63, 311.13, 392.00], winds: [523.25, 622.25], brass: [196.00, 261.63], leadInst: 'pocket_trumpet' }
      ];
    } else if (zone === 'north_wilderness') {
      // Echo Canyon: Red Rock Steppe Mixolydian in D (D - C - G - D)
      bpm = 94;
      chords = [
        { root: 146.83, strings: [293.66, 369.99, 440.00], winds: [587.33, 739.99], brass: [220.00, 293.66], leadInst: 'french_horn' },
        { root: 130.81, strings: [261.63, 329.63, 392.00], winds: [523.25, 659.25], brass: [196.00, 261.63], leadInst: 'pocket_trumpet' },
        { root: 196.00, strings: [392.00, 493.88, 587.33], winds: [783.99, 987.77], brass: [196.00, 293.66], leadInst: 'trombone' },
        { root: 146.83, strings: [293.66, 369.99, 440.00], winds: [587.33, 739.99], brass: [220.00, 293.66], leadInst: 'french_horn' }
      ];
    } else if (zone === 'percussion_peaks') {
      // Percussion Peaks: Driving Harmonic A Minor (Am - F - G - Em)
      bpm = 124;
      chords = [
        { root: 220.00, strings: [261.63, 329.63, 440.00], winds: [523.25, 659.25], brass: [220.00, 329.63], leadInst: 'marimba' },
        { root: 174.61, strings: [349.23, 440.00, 523.25], winds: [698.46, 880.00], brass: [261.63, 349.23], leadInst: 'timpani' },
        { root: 196.00, strings: [392.00, 493.88, 587.33], winds: [783.99, 987.77], brass: [196.00, 293.66], leadInst: 'glockenspiel' },
        { root: 164.81, strings: [329.63, 392.00, 493.88], winds: [659.25, 783.99], brass: [164.81, 246.94], leadInst: 'snare_kit' }
      ];
    } else if (zone === 'south_wilderness') {
      // Rumble Gorge: Volcanic Tribal E Minor (Em - G - D - C)
      bpm = 132;
      chords = [
        { root: 164.81, strings: [329.63, 392.00, 493.88], winds: [659.25, 783.99], brass: [164.81, 246.94], leadInst: 'timpani' },
        { root: 196.00, strings: [392.00, 493.88, 587.33], winds: [783.99, 987.77], brass: [196.00, 293.66], leadInst: 'marimba' },
        { root: 146.83, strings: [293.66, 369.99, 440.00], winds: [587.33, 739.99], brass: [146.83, 220.00], leadInst: 'snare_kit' },
        { root: 130.81, strings: [261.63, 329.63, 392.00], winds: [523.25, 659.25], brass: [130.81, 196.00], leadInst: 'timpani' }
      ];
    } else {
      // Grand Symphony Hall: Majestic C Major Orchestral (C - G - Am - F)
      bpm = 100;
      chords = [
        { root: 130.81, strings: [261.63, 329.63, 392.00], winds: [523.25, 659.25], brass: [196.00, 261.63], leadInst: 'harp' },
        { root: 196.00, strings: [392.00, 493.88, 587.33], winds: [783.99, 987.77], brass: [196.00, 293.66], leadInst: 'pocket_trumpet' },
        { root: 220.00, strings: [261.63, 329.63, 440.00], winds: [523.25, 659.25], brass: [220.00, 329.63], leadInst: 'violin' },
        { root: 174.61, strings: [349.23, 440.00, 523.25], winds: [698.46, 880.00], brass: [261.63, 349.23], leadInst: 'silver_flute' }
      ];
    }

    const intervalMs = (60 / bpm / 2) * 1000; // Eighth notes

    this.bgmInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const chordIdx = Math.floor(this.step / 8) % chords.length;
      const subStep = this.step % 8;
      const chord = chords[chordIdx];

      // Occasional ambient nature sounds in wilderness biomes
      if (this.step % 32 === 0 && Math.random() < 0.5) {
        this.playBiomeNatureAmbience(zone);
      }

      // Bass root on downbeats (measure starts and half-measures)
      if (subStep === 0 || subStep === 4) {
        if (activeSections.includes('strings') || activeSections.includes('brass')) {
          this.playInstrumentNote(activeSections.includes('brass') ? 'french_horn' : 'cello', chord.root, 0.45, 0.6);
        }
      }

      // Melodic arpeggio for strings
      if (activeSections.includes('strings') && (subStep % 2 === 0)) {
        const noteIdx = (subStep / 2) % chord.strings.length;
        const inst = activeSections.includes('strings') ? (chord.leadInst === 'acoustic_guitar' ? 'acoustic_guitar' : 'violin') : 'violin';
        this.playInstrumentNote(inst, chord.strings[noteIdx], 0.28, 0.55);
      }

      // Woodwinds breathy counter-melody
      if (activeSections.includes('woodwinds') && (subStep === 2 || subStep === 6)) {
        const windNote = chord.winds[subStep === 2 ? 0 : 1];
        const inst = (chord.leadInst === 'oboe' || chord.leadInst === 'soprano_sax') ? chord.leadInst : 'silver_flute';
        this.playInstrumentNote(inst, windNote, 0.38, 0.6);
      }

      // Brass majestic punctuation
      if (activeSections.includes('brass') && (subStep === 0 || subStep === 6)) {
        this.playInstrumentNote('pocket_trumpet', chord.brass[0], 0.32, 0.65);
      }

      // Percussion pulse & grooves
      if (activeSections.includes('percussion')) {
        if (subStep === 0 || subStep === 4) {
          this.playInstrumentNote('timpani', chord.root * 0.75, 0.22, 0.65);
        }
        if (subStep === 2 || subStep === 6) {
          this.playInstrumentNote('snare_kit', 220, 0.15, 0.5);
          this.playInstrumentNote('glockenspiel', chord.strings[0] * 2, 0.18, 0.45);
        }
      }

      this.step++;
    }, intervalMs);
  }

  public stopBGM(): void {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const soundEngine = new HarmoniaSoundEngine();

