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

  /* ---------------- DYNAMIC ENSEMBLE BGM ---------------- */

  public startBGM(zone: string = 'cavatina_village', activeSections: InstrumentSection[] = ['strings']): void {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.currentBgm = zone;
    this.step = 0;

    // Harmonic Progressions for each zone
    // Cavatina Village: Pastoral F Major (F - Dm - Bb - C)
    const cavatinaChords = [
      { root: 174.61, strings: [349.23, 440.00, 523.25], winds: [698.46, 880.00], brass: [261.63, 349.23], drum: 'marimba' },
      { root: 146.83, strings: [293.66, 349.23, 440.00], winds: [587.33, 698.46], brass: [220.00, 293.66], drum: 'snare_kit' },
      { root: 116.54, strings: [233.08, 349.23, 466.16], winds: [466.16, 587.33], brass: [174.61, 233.08], drum: 'marimba' },
      { root: 130.81, strings: [261.63, 329.63, 392.00], winds: [523.25, 659.25], brass: [196.00, 261.63], drum: 'snare_kit' }
    ];

    const bpm = 100;
    const intervalMs = (60 / bpm / 2) * 1000; // Eighth notes

    this.bgmInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      const chordIdx = Math.floor(this.step / 8) % cavatinaChords.length;
      const subStep = this.step % 8;
      const chord = cavatinaChords[chordIdx];

      // Bass root on downbeats
      if (subStep === 0 || subStep === 4) {
        if (activeSections.includes('strings') || activeSections.includes('brass')) {
          this.playInstrumentNote(activeSections.includes('brass') ? 'french_horn' : 'cello', chord.root, 0.4, 0.6);
        }
      }

      // Melodic arpeggio for strings
      if (activeSections.includes('strings') && (subStep % 2 === 0)) {
        const noteIdx = (subStep / 2) % chord.strings.length;
        this.playInstrumentNote('violin', chord.strings[noteIdx], 0.25, 0.5);
      }

      // Woodwinds breathy counter-melody
      if (activeSections.includes('woodwinds') && (subStep === 2 || subStep === 6)) {
        const windNote = chord.winds[subStep === 2 ? 0 : 1];
        this.playInstrumentNote('silver_flute', windNote, 0.35, 0.55);
      }

      // Brass majestic punctuation
      if (activeSections.includes('brass') && (subStep === 0 || subStep === 6)) {
        this.playInstrumentNote('pocket_trumpet', chord.brass[0], 0.3, 0.6);
      }

      // Percussion pulse
      if (activeSections.includes('percussion')) {
        if (subStep === 0 || subStep === 4) {
          this.playInstrumentNote('timpani', chord.root * 0.75, 0.2, 0.6);
        }
        if (subStep === 2 || subStep === 6) {
          this.playInstrumentNote('glockenspiel', chord.strings[0] * 2, 0.15, 0.4);
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
