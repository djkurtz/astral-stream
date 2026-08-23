// Harmonia: Opus of the Ensemble - Procedural Multi-Voice Audio Engine

import { InstrumentId, InstrumentSection, Musician } from './types';

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
      case 'cello': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, t);

        // Add gentle vibrato for bowed strings
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(5.5, t); // 5.5 Hz vibrato
        lfoGain.gain.setValueAtTime(freq * 0.015, t);
        lfo.connect(osc.frequency);
        lfo.start(t);
        lfo.stop(t + duration);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(instrumentId === 'cello' ? 800 : 2400, t);

        // Bowed envelope: smooth swell and release
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3 * velocity, t + 0.05);
        gain.gain.setValueAtTime(0.25 * velocity, t + duration * 0.7);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + duration);
        break;
      }

      case 'harp':
      case 'acoustic_guitar': {
        // Karplus-Strong physical modeling string resonance with pluck burst & damped harmonics
        const isHarp = instrumentId === 'harp';
        const pluckGain = this.ctx.createGain();
        const mainGain = this.ctx.createGain();
        const stringFilter = this.ctx.createBiquadFilter();

        // 1. Pluck excitation impulse (noise burst)
        const burstLen = Math.max(128, Math.floor(this.ctx.sampleRate * 0.008));
        const noiseBuffer = this.ctx.createBuffer(1, burstLen, this.ctx.sampleRate);
        const data = noiseBuffer.getChannelData(0);
        for (let i = 0; i < burstLen; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (burstLen * 0.4));
        }
        const pluckNoise = this.ctx.createBufferSource();
        pluckNoise.buffer = noiseBuffer;

        // 2. Resonant string body oscillator
        const bodyOsc = this.ctx.createOscillator();
        bodyOsc.type = isHarp ? 'sine' : 'triangle';
        bodyOsc.frequency.setValueAtTime(freq, t);

        // String damping filter
        stringFilter.type = 'lowpass';
        stringFilter.frequency.setValueAtTime(isHarp ? 3800 : 2600, t);
        stringFilter.frequency.exponentialRampToValueAtTime(Math.max(80, freq * 1.5), t + duration);
        stringFilter.Q.setValueAtTime(isHarp ? 2.5 : 1.8, t);

        // Pluck transient envelope
        pluckGain.gain.setValueAtTime(0.4 * velocity, t);
        pluckGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

        // Sustained string ring envelope
        const stringSustain = Math.max(duration, isHarp ? 0.9 : 0.7);
        mainGain.gain.setValueAtTime(0, t);
        mainGain.gain.linearRampToValueAtTime((isHarp ? 0.38 : 0.35) * velocity, t + 0.008);
        mainGain.gain.exponentialRampToValueAtTime(0.001, t + stringSustain);

        pluckNoise.connect(pluckGain);
        pluckGain.connect(stringFilter);
        bodyOsc.connect(stringFilter);
        stringFilter.connect(mainGain);
        mainGain.connect(this.masterGain);

        pluckNoise.start(t);
        bodyOsc.start(t);
        bodyOsc.stop(t + stringSustain);
        break;
      }

      case 'harpsichord': {
        // Bright quill-plucked sharp attack: dual harmonics with high-frequency bite & rapid metallic decay
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(freq, t);

        osc2.type = 'square';
        osc2.frequency.setValueAtTime(freq * 2, t); // Octave overtone for bright quill bite

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3200, t);
        filter.frequency.exponentialRampToValueAtTime(1200, t + duration);
        filter.Q.setValueAtTime(1.8, t);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.32 * velocity, t + 0.003); // Instant sharp plucked attack
        gain.gain.exponentialRampToValueAtTime(0.08 * velocity, t + 0.08); // Fast quill pluck drop
        gain.gain.exponentialRampToValueAtTime(0.001, t + Math.min(duration, 0.6));

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + duration);
        osc2.stop(t + duration);
        break;
      }

      case 'electric_guitar': {
        // Overdriven crunchy power timbre: rich fundamental + power 5th with soft-clip waveshaper and amp cabinet filter
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const preGain = this.ctx.createGain();
        const postGain = this.ctx.createGain();
        const shaper = this.ctx.createWaveShaper();
        const filter = this.ctx.createBiquadFilter();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(freq, t);

        osc2.type = 'square';
        osc2.frequency.setValueAtTime(freq * 1.4983, t); // Power 5th overtone for crunchy harmonic thickness

        // Soft-clipping distortion curve
        const curveLen = 256;
        const curve = new Float32Array(curveLen);
        for (let i = 0; i < curveLen; i++) {
          const x = (i * 2) / curveLen - 1;
          curve[i] = Math.tanh(x * 2.8);
        }
        shaper.curve = curve;
        shaper.oversample = '2x';

        // Guitar amplifier cabinet emulation filter (rolls off harsh highs and deep mud)
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2200, t);
        filter.Q.setValueAtTime(1.5, t);

        preGain.gain.setValueAtTime(1.5, t); // Drive into shaper

        postGain.gain.setValueAtTime(0, t);
        postGain.gain.linearRampToValueAtTime(0.28 * velocity, t + 0.008); // Aggressive pick attack
        postGain.gain.setValueAtTime(0.22 * velocity, t + duration * 0.7); // Sustained overdrive body
        postGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        osc1.connect(preGain);
        osc2.connect(preGain);
        preGain.connect(shaper);
        shaper.connect(filter);
        filter.connect(postGain);
        postGain.connect(this.masterGain);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + duration);
        osc2.stop(t + duration);
        break;
      }

      // --- WOODWINDS ---
      case 'silver_flute':
      case 'soprano_sax':
      case 'saxophone':
      case 'clarinet': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        const isSax = instrumentId === 'soprano_sax' || instrumentId === 'saxophone';
        osc.type = isSax ? 'sawtooth' : (instrumentId === 'clarinet' ? 'square' : 'sine');
        osc.frequency.setValueAtTime(freq, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(isSax ? 2000 : 1200, t);
        filter.Q.setValueAtTime(isSax ? 3.0 : 2.0, t);

        // Warm vibrato for flute and saxophone
        if (instrumentId === 'silver_flute' || isSax) {
          const lfo = this.ctx.createOscillator();
          const lfoGain = this.ctx.createGain();
          const vibratoRate = isSax ? 5.2 : 6.0; // Warm 5.2Hz jazz vibrato
          const vibratoDepth = isSax ? freq * 0.018 : freq * 0.012;
          lfo.frequency.setValueAtTime(vibratoRate, t);
          lfoGain.gain.setValueAtTime(0, t);
          lfoGain.gain.linearRampToValueAtTime(vibratoDepth, t + 0.1); // Expressive delayed jazz vibrato
          lfo.connect(osc.frequency);
          lfo.start(t);
          lfo.stop(t + duration);
        }

        // Breathy envelope
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime((isSax ? 0.32 : 0.28) * velocity, t + (isSax ? 0.03 : 0.04));
        gain.gain.setValueAtTime((isSax ? 0.28 : 0.24) * velocity, t + duration * 0.75);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + duration);
        break;
      }

      case 'oboe': {
        // Oboe with FM double-reed nasal sidebands
        const carrier = this.ctx.createOscillator();
        const modulator = this.ctx.createOscillator();
        const modGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        carrier.type = 'sawtooth';
        carrier.frequency.setValueAtTime(freq, t);

        // Double-reed FM modulation (2:1 ratio creating nasal harmonic sidebands)
        modulator.type = 'sine';
        modulator.frequency.setValueAtTime(freq * 2, t);
        modGain.gain.setValueAtTime(freq * 0.45, t);
        modGain.gain.exponentialRampToValueAtTime(Math.max(1, freq * 0.15), t + duration);

        modulator.connect(carrier.frequency);

        // Formant cavity filter
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, t);
        filter.Q.setValueAtTime(2.2, t);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.3 * velocity, t + 0.04);
        gain.gain.setValueAtTime(0.25 * velocity, t + duration * 0.75);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

        carrier.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        modulator.start(t);
        carrier.start(t);
        modulator.stop(t + duration);
        carrier.stop(t + duration);
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
      case 'typewriter': {
        // Rapid mechanical clacks with margin bell ring
        const bufferSize = Math.floor(this.ctx.sampleRate * 0.04);
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = this.ctx.createGain();
        const noiseFilter = this.ctx.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.setValueAtTime(1800, t);

        noiseGain.gain.setValueAtTime(0.35 * velocity, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.035);

        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        noise.start(t);

        // Metallic key strike body
        const clickOsc = this.ctx.createOscillator();
        const clickGain = this.ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(1400, t);
        clickOsc.frequency.exponentialRampToValueAtTime(300, t + 0.025);
        clickGain.gain.setValueAtTime(0.3 * velocity, t);
        clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);

        clickOsc.connect(clickGain);
        clickGain.connect(this.masterGain);
        clickOsc.start(t);
        clickOsc.stop(t + 0.025);

        // Resonant margin bell chime ring (pure crystalline bell overtone)
        const bellOsc = this.ctx.createOscillator();
        const bellGain = this.ctx.createGain();
        bellOsc.type = 'sine';
        const bellFreq = freq > 400 ? freq * 4 : 2093;
        bellOsc.frequency.setValueAtTime(bellFreq, t);

        bellGain.gain.setValueAtTime(0, t);
        bellGain.gain.linearRampToValueAtTime(0.22 * velocity, t + 0.005);
        bellGain.gain.exponentialRampToValueAtTime(0.001, t + Math.max(duration, 0.45));

        bellOsc.connect(bellGain);
        bellGain.connect(this.masterGain);
        bellOsc.start(t);
        bellOsc.stop(t + Math.max(duration, 0.45));
        break;
      }

      case 'cannon': {
        // Massive low-frequency sub-bass artillery boom with resonant rumble
        const noiseLen = Math.floor(this.ctx.sampleRate * 0.8);
        const noiseBuffer = this.ctx.createBuffer(1, noiseLen, this.ctx.sampleRate);
        const noiseData = noiseBuffer.getChannelData(0);
        for (let i = 0; i < noiseLen; i++) {
          noiseData[i] = Math.random() * 2 - 1;
        }

        const noiseSrc = this.ctx.createBufferSource();
        noiseSrc.buffer = noiseBuffer;
        const noiseFilter = this.ctx.createBiquadFilter();
        const noiseGain = this.ctx.createGain();

        noiseFilter.type = 'lowpass';
        noiseFilter.frequency.setValueAtTime(800, t);
        noiseFilter.frequency.exponentialRampToValueAtTime(60, t + 0.6);
        noiseFilter.Q.setValueAtTime(3.0, t);

        noiseGain.gain.setValueAtTime(0.45 * velocity, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.75);

        noiseSrc.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        noiseSrc.start(t);

        // Sub-bass punch oscillator (plunging from 110Hz to 25Hz)
        const subOsc = this.ctx.createOscillator();
        const subGain = this.ctx.createGain();
        subOsc.type = 'sine';
        subOsc.frequency.setValueAtTime(110, t);
        subOsc.frequency.exponentialRampToValueAtTime(25, t + 0.7);

        subGain.gain.setValueAtTime(0.5 * velocity, t);
        subGain.gain.exponentialRampToValueAtTime(0.001, t + Math.max(duration, 0.8));

        subOsc.connect(subGain);
        subGain.connect(this.masterGain);
        subOsc.start(t);
        subOsc.stop(t + Math.max(duration, 0.8));
        break;
      }

      case 'snare_kit':
      case 'marimba':
      case 'timpani': {
        if (instrumentId === 'snare_kit') {
          // Snare: Noise Burst + Snare Body Sine
          const bufferSize = Math.floor(this.ctx.sampleRate * 0.15);
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
          // Marimba: Warm Wooden Mallet Strike
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t);

          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.35 * velocity, t + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25);

          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(t);
          osc.stop(t + 0.25);
        }
        break;
      }

      case 'glockenspiel': {
        // Glockenspiel with FM metallic bell sidebands (inharmonic ratio 2.756)
        const carrier = this.ctx.createOscillator();
        const modulator = this.ctx.createOscillator();
        const modGain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        carrier.type = 'sine';
        carrier.frequency.setValueAtTime(freq, t);

        // Metallic bell sidebands via inharmonic FM ratio (2.756)
        modulator.type = 'sine';
        modulator.frequency.setValueAtTime(freq * 2.756, t);
        modGain.gain.setValueAtTime(freq * 1.2 * velocity, t);
        modGain.gain.exponentialRampToValueAtTime(0.01, t + 0.35);

        modulator.connect(carrier.frequency);

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(600, t);

        const bellDuration = Math.max(duration, 0.85);
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.36 * velocity, t + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.001, t + bellDuration);

        carrier.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        modulator.start(t);
        carrier.start(t);
        modulator.stop(t + bellDuration);
        carrier.stop(t + bellDuration);
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

  /**
   * Synthesize distinct percussion timbres for Harmonipet encounters (no pitch frequencies)
   * Adapts dynamically to Typewriter, Cannon, Timpani, Marimba, and Snare Kit
   */
  public playHarmonizePercussion(index: number, velocity: number = 0.85, specialInstrument?: InstrumentId): void {
    if (this.isMuted || !this.ensureContext() || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    if (specialInstrument === 'typewriter') {
      switch (index) {
        case 0: {
          // 1. Key Clack (light mechanical strike)
          const bufferSize = Math.floor(this.ctx.sampleRate * 0.03);
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          const noiseGain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.setValueAtTime(2200, t);
          noiseGain.gain.setValueAtTime(0.35 * velocity, t);
          noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
          noise.connect(filter);
          filter.connect(noiseGain);
          noiseGain.connect(this.masterGain);
          noise.start(t);
          break;
        }
        case 1: {
          // 2. Spacebar (deep mechanical thud)
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(320, t);
          osc.frequency.exponentialRampToValueAtTime(80, t + 0.06);
          gain.gain.setValueAtTime(0.4 * velocity, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(t);
          osc.stop(t + 0.06);
          break;
        }
        case 2: {
          // 3. Carriage Return Slide & Zip (mechanical ratchet)
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(600, t);
          osc.frequency.linearRampToValueAtTime(1400, t + 0.08);
          gain.gain.setValueAtTime(0.25 * velocity, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(t);
          osc.stop(t + 0.09);
          break;
        }
        case 3:
        default: {
          // 4. Margin Bell Chime
          const bell = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          bell.type = 'sine';
          bell.frequency.setValueAtTime(2093, t); // C7 silver chime
          gain.gain.setValueAtTime(0, t);
          gain.gain.linearRampToValueAtTime(0.35 * velocity, t + 0.005);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
          bell.connect(gain);
          gain.connect(this.masterGain);
          bell.start(t);
          bell.stop(t + 0.5);
          break;
        }
      }
      return;
    }

    if (specialInstrument === 'cannon') {
      switch (index) {
        case 0: {
          // 1. Fuse Sizzle (high noise hiss)
          const bufferSize = Math.floor(this.ctx.sampleRate * 0.15);
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;
          const gain = this.ctx.createGain();
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(3500, t);
          gain.gain.setValueAtTime(0.3 * velocity, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.14);
          noise.connect(filter);
          filter.connect(gain);
          gain.connect(this.masterGain);
          noise.start(t);
          break;
        }
        case 1: {
          // 2. Powder Pack Thud (damped punch)
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(200, t);
          osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
          gain.gain.setValueAtTime(0.45 * velocity, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(t);
          osc.stop(t + 0.1);
          break;
        }
        case 2: {
          // 3. Canyon Echo (sub-bass roll)
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(90, t);
          osc.frequency.exponentialRampToValueAtTime(30, t + 0.4);
          gain.gain.setValueAtTime(0.4 * velocity, t);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(t);
          osc.stop(t + 0.45);
          break;
        }
        case 3:
        default: {
          // 4. Artillery Cannon Blast
          this.playInstrumentNote('cannon', 60, 0.65, velocity * 1.2);
          break;
        }
      }
      return;
    }

    if (specialInstrument === 'timpani') {
      const timpaniPitches = [73.42, 87.31, 110.00, 146.83]; // D2, F2, A2, D3
      this.playInstrumentNote('timpani', timpaniPitches[index] || 110, 0.45, velocity);
      return;
    }

    if (specialInstrument === 'marimba') {
      const marimbaPitches = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
      this.playInstrumentNote('marimba', marimbaPitches[index] || 392, 0.35, velocity);
      return;
    }

    // Default: Snare Kit (Hi-hat, Snare, Kick, Cymbal)
    switch (index) {
      case 0:
        this.playInstrumentNote('snare_kit', 220, 0.12, velocity * 0.9);
        break;
      case 1:
        this.playInstrumentNote('snare_kit', 160, 0.18, velocity);
        break;
      case 2:
        this.playInstrumentNote('timpani', 65, 0.35, velocity * 1.1); // Kick
        break;
      case 3:
      default:
        this.playInstrumentNote('glockenspiel', 1760, 0.5, velocity); // Crash/Bell
        break;
    }
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

  public playGrandPianoNote(freq: number, duration: number = 0.8, velocity: number = 0.8): void {
    if (this.isMuted || !this.ensureContext() || !this.ctx || !this.masterGain) return;
    const t = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, t);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, t);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(8000, freq * 4), t);
    filter.frequency.exponentialRampToValueAtTime(Math.max(200, freq * 1.2), t + duration);

    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4 * velocity, t + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.15 * velocity, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(t);
    osc2.start(t);
    osc1.stop(t + duration);
    osc2.stop(t + duration);
  }

  public playGrandPianoCadence(): void {
    if (this.isMuted || !this.ensureContext()) return;
    const flourish = [
      { freq: 261.63, delay: 0, dur: 0.25 },   // C4
      { freq: 329.63, delay: 60, dur: 0.25 },  // E4
      { freq: 392.00, delay: 120, dur: 0.25 }, // G4
      { freq: 523.25, delay: 180, dur: 0.3 },  // C5
      { freq: 659.25, delay: 240, dur: 0.3 },  // E5
      { freq: 783.99, delay: 300, dur: 0.35 }, // G5
      { freq: 1046.50, delay: 360, dur: 0.4 }, // C6
      { freq: 1318.51, delay: 420, dur: 0.5 }, // E6
      { freq: 1567.98, delay: 480, dur: 0.6 }, // G6
      { freq: 2093.00, delay: 560, dur: 0.8 }, // C7
    ];
    flourish.forEach(n => {
      setTimeout(() => {
        this.playGrandPianoNote(n.freq, n.dur, 0.85);
      }, n.delay);
    });
    setTimeout(() => {
      [130.81, 261.63, 329.63, 392.00, 523.25].forEach(f => {
        this.playGrandPianoNote(f, 1.6, 0.95);
      });
    }, 700);
  }

  /**
   * Synthesize authentic structured chord notes and melodic voice during concert competition
   */
  public playStructuredConcertHarmony(options: {
    chord?: {
      strings?: number[];
      woodwinds?: number[];
      winds?: number[];
      brass?: number[];
      percussion?: string;
    };
    melodyNotes?: number[];
    members: Musician[];
    sectionBalance?: Record<InstrumentSection, number>;
    hasPianoAccompaniment?: boolean;
    isPianistDuel?: boolean;
    maestroFlow?: number;
    duration?: number;
  }): void {
    if (this.isMuted || !this.ensureContext()) return;

    const chord = options.chord || {};
    const stringNotes = chord.strings && chord.strings.length > 0 ? chord.strings : [261.63, 329.63, 392.0];
    const windNotes = (chord.woodwinds && chord.woodwinds.length > 0 ? chord.woodwinds : (chord.winds && chord.winds.length > 0 ? chord.winds : [523.25, 659.25]));
    const brassNotes = chord.brass && chord.brass.length > 0 ? chord.brass : [261.63, 392.0];
    const percType = chord.percussion || 'timpani';

    const flow = options.maestroFlow !== undefined ? options.maestroFlow : 50;
    const flowBonus = (flow / 100) * 0.25;

    // Track how many musicians per section to voice chords across polyphony
    const sectionCounts: Record<InstrumentSection, number> = {
      strings: 0,
      woodwinds: 0,
      brass: 0,
      percussion: 0
    };

    options.members.forEach((m) => {
      const idx = sectionCounts[m.section]++;
      const balance = options.sectionBalance ? (options.sectionBalance[m.section] ?? 70) : 70;
      const balanceMod = Math.max(0.3, Math.min(1.3, balance / 70));
      const velocity = Math.min(1.0, 0.65 * balanceMod + flowBonus);
      const dur = options.duration || 0.45;

      if (m.section === 'strings') {
        const pitch = stringNotes[idx % stringNotes.length];
        this.playInstrumentNote(m.instrumentId, pitch, dur, velocity);
      } else if (m.section === 'woodwinds') {
        const pitch = windNotes[idx % windNotes.length];
        this.playInstrumentNote(m.instrumentId, pitch, dur, velocity);
      } else if (m.section === 'brass') {
        const pitch = brassNotes[idx % brassNotes.length];
        this.playInstrumentNote(m.instrumentId, pitch, dur, velocity);
      } else if (m.section === 'percussion') {
        const rootPitch = stringNotes[0] ? stringNotes[0] * 0.5 : 130.81;
        const inst = (m.instrumentId === 'timpani' || m.instrumentId === 'marimba' || m.instrumentId === 'glockenspiel' || m.instrumentId === 'snare_kit' || m.instrumentId === 'typewriter' || m.instrumentId === 'cannon')
          ? m.instrumentId
          : (percType as InstrumentId);
        this.playInstrumentNote(inst, rootPitch, dur, velocity);
      }
    });

    // Melodic voice phrase playback
    if (options.melodyNotes && options.melodyNotes.length > 0) {
      const leadMusician = options.members[0];
      const leadInst: InstrumentId = leadMusician ? leadMusician.instrumentId : 'violin';
      options.melodyNotes.forEach((noteFreq, nIdx) => {
        setTimeout(() => {
          this.playInstrumentNote(leadInst, noteFreq, 0.3, Math.min(1.0, 0.8 + flowBonus));
        }, nIdx * 120);
      });
    }

    // Piano Accompaniment Harmonic Flourishes
    if (options.hasPianoAccompaniment && !options.isPianistDuel) {
      // Arpeggiate harmonic chord tones with sparkling grand piano
      const pianoNotes = [
        stringNotes[0] || 261.63,
        stringNotes[1] || (stringNotes[0] * 1.25) || 329.63,
        stringNotes[2] || (stringNotes[0] * 1.5) || 392.0,
        (stringNotes[0] || 261.63) * 2,
        (stringNotes[1] || 329.63) * 2
      ];
      pianoNotes.forEach((pfreq, pIdx) => {
        setTimeout(() => {
          this.playGrandPianoNote(pfreq, 0.4, Math.min(1.0, 0.75 + flowBonus * 0.5));
        }, pIdx * 70);
      });
    }

    // Pianist Duel counterpoint flourish
    if (options.isPianistDuel) {
      const duelRoot = stringNotes[0] || 261.63;
      const duelNotes = [duelRoot * 0.5, duelRoot * 0.75, duelRoot, duelRoot * 1.25, duelRoot * 1.5, duelRoot * 2];
      duelNotes.forEach((pfreq, pIdx) => {
        setTimeout(() => {
          this.playGrandPianoNote(pfreq, 0.4, 0.85);
        }, pIdx * 80);
      });
    }
  }

  /**
   * Resonant feedback when conducting / cueing a specific instrument section
   */
  public playSectionCueFeedback(section: InstrumentSection, note?: number): void {
    if (this.isMuted || !this.ensureContext()) return;
    const defaultFrequencies: Record<InstrumentSection, { inst: InstrumentId; freq: number }> = {
      strings: { inst: 'violin', freq: note || 440 },
      woodwinds: { inst: 'silver_flute', freq: note || 587.33 },
      brass: { inst: 'pocket_trumpet', freq: note || 523.25 },
      percussion: { inst: 'timpani', freq: note || 146.83 }
    };
    const target = defaultFrequencies[section] || defaultFrequencies.strings;
    this.playInstrumentNote(target.inst, target.freq, 0.35, 0.9);
  }

  /**
   * Synthesize iconic classical celebrity motifs using procedural Web Audio
   */
  public playCelebrityMotif(celebrityId: string): void {
    if (this.isMuted || !this.ensureContext() || !this.ctx || !this.masterGain) return;
    const id = celebrityId.toLowerCase();

    if (id.includes('mozart')) {
      // 🎭 Wolfgang Amadeus Mozart: 'Eine kleine Nachtmusik' Allegro motif + Starling chirps
      const motif = [
        { freq: 392.00, dur: 0.22, delay: 0 },    // G4
        { freq: 293.66, dur: 0.22, delay: 240 },  // D4
        { freq: 392.00, dur: 0.16, delay: 480 },  // G4
        { freq: 293.66, dur: 0.16, delay: 640 },  // D4
        { freq: 392.00, dur: 0.20, delay: 800 },  // G4
        { freq: 493.88, dur: 0.20, delay: 1000 }, // B4
        { freq: 587.33, dur: 0.45, delay: 1200 }, // D5
        { freq: 523.25, dur: 0.22, delay: 1700 }, // C5
        { freq: 440.00, dur: 0.22, delay: 1940 }, // A4
        { freq: 523.25, dur: 0.16, delay: 2180 }, // C5
        { freq: 440.00, dur: 0.16, delay: 2340 }, // A4
        { freq: 523.25, dur: 0.20, delay: 2500 }, // C5
        { freq: 369.99, dur: 0.20, delay: 2700 }, // F#4
        { freq: 293.66, dur: 0.50, delay: 2900 }, // D4
      ];
      motif.forEach(n => {
        setTimeout(() => {
          this.playInstrumentNote('violin', n.freq, n.dur, 0.9);
          if (n.freq > 400) {
            this.playInstrumentNote('silver_flute', n.freq * 2, n.dur * 0.5, 0.4);
          }
        }, n.delay);
      });

    } else if (id.includes('beethoven')) {
      // ⚡ Ludwig van Beethoven: Symphony No. 5 Fate Motif (Da-Da-Da-DUM!)
      const fate1 = [
        { freq: 392.00, dur: 0.15, delay: 0 },    // G4
        { freq: 392.00, dur: 0.15, delay: 160 },  // G4
        { freq: 392.00, dur: 0.15, delay: 320 },  // G4
        { freq: 311.13, dur: 0.90, delay: 500 },  // Eb4
      ];
      const fate2 = [
        { freq: 349.23, dur: 0.15, delay: 1500 }, // F4
        { freq: 349.23, dur: 0.15, delay: 1660 }, // F4
        { freq: 349.23, dur: 0.15, delay: 1820 }, // F4
        { freq: 293.66, dur: 1.10, delay: 2000 }, // D4
      ];
      [...fate1, ...fate2].forEach(n => {
        setTimeout(() => {
          this.playInstrumentNote('french_horn', n.freq, n.dur, 0.95);
          this.playInstrumentNote('pocket_trumpet', n.freq < 400 ? n.freq * 2 : n.freq, n.dur, 0.85);
          this.playInstrumentNote('cello', n.freq * 0.5, n.dur, 0.9);
          if (n.dur > 0.5) {
            this.playInstrumentNote('timpani', n.freq * 0.5, n.dur, 1.0);
          }
        }, n.delay);
      });

    } else if (id.includes('bach')) {
      // 📜 Johann Sebastian Bach: Toccata & Fugue in D minor Organ Arpeggio
      const toccata = [
        { freq: 440.00, dur: 0.12, delay: 0 },    // A4
        { freq: 392.00, dur: 0.12, delay: 110 },  // G4
        { freq: 440.00, dur: 0.70, delay: 220 },  // A4
        { freq: 392.00, dur: 0.12, delay: 1000 }, // G4
        { freq: 349.23, dur: 0.12, delay: 1120 }, // F4
        { freq: 329.63, dur: 0.12, delay: 1240 }, // E4
        { freq: 293.66, dur: 0.12, delay: 1360 }, // D4
        { freq: 277.18, dur: 0.15, delay: 1480 }, // C#4
        { freq: 293.66, dur: 0.80, delay: 1620 }, // D4
      ];
      toccata.forEach(n => {
        setTimeout(() => {
          this.playInstrumentNote('oboe', n.freq, n.dur, 0.85);
          this.playInstrumentNote('silver_flute', n.freq * 2, n.dur, 0.6);
          this.playInstrumentNote('cello', n.freq * 0.5, n.dur, 0.8);
        }, n.delay);
      });
      setTimeout(() => {
        [146.83, 220.00, 293.66, 349.23, 440.00].forEach(f => {
          this.playInstrumentNote('oboe', f, 1.2, 0.9);
          this.playInstrumentNote('cello', f * 0.5, 1.2, 0.85);
        });
      }, 2500);

    } else if (id.includes('paganini')) {
      // 🎻 Niccolò Paganini: Caprice No. 24 Virtuoso Violin Shredding
      const caprice = [
        { freq: 440.00, dur: 0.08, delay: 0 },    // A4
        { freq: 440.00, dur: 0.08, delay: 90 },   // A4
        { freq: 523.25, dur: 0.08, delay: 180 },  // C5
        { freq: 493.88, dur: 0.08, delay: 260 },  // B4
        { freq: 440.00, dur: 0.10, delay: 340 },  // A4
        { freq: 659.25, dur: 0.08, delay: 480 },  // E5
        { freq: 659.25, dur: 0.08, delay: 570 },  // E5
        { freq: 783.99, dur: 0.08, delay: 660 },  // G5
        { freq: 698.46, dur: 0.08, delay: 740 },  // F5
        { freq: 659.25, dur: 0.10, delay: 820 },  // E5
        { freq: 493.88, dur: 0.08, delay: 960 },  // B4
        { freq: 587.33, dur: 0.08, delay: 1040 }, // D5
        { freq: 523.25, dur: 0.08, delay: 1120 }, // C5
        { freq: 493.88, dur: 0.08, delay: 1200 }, // B4
        { freq: 440.00, dur: 0.10, delay: 1280 }, // A4
        { freq: 329.63, dur: 0.12, delay: 1400 }, // E4
        { freq: 440.00, dur: 0.60, delay: 1540 }, // A4
      ];
      caprice.forEach(n => {
        setTimeout(() => {
          this.playInstrumentNote('violin', n.freq, n.dur, 0.95);
        }, n.delay);
      });

    } else if (id.includes('satie')) {
      // ☂️ Erik Satie: Gymnopédie No. 1 Lilting Velvet Waltz
      setTimeout(() => this.playInstrumentNote('acoustic_guitar', 196.00, 0.8, 0.7), 0); // G3
      setTimeout(() => {
        this.playInstrumentNote('harp', 493.88, 0.6, 0.6); // B4
        this.playInstrumentNote('harp', 587.33, 0.6, 0.6); // D5
        this.playInstrumentNote('harp', 739.99, 0.6, 0.6); // F#5
      }, 400);
      setTimeout(() => this.playInstrumentNote('acoustic_guitar', 146.83, 0.8, 0.7), 1000); // D3
      setTimeout(() => {
        this.playInstrumentNote('harp', 440.00, 0.6, 0.6); // A4
        this.playInstrumentNote('harp', 554.37, 0.6, 0.6); // C#5
        this.playInstrumentNote('harp', 739.99, 0.6, 0.6); // F#5
      }, 1400);
      const melody = [
        { freq: 739.99, dur: 0.7, delay: 1800 }, // F#5
        { freq: 659.25, dur: 0.5, delay: 2400 }, // E5
        { freq: 587.33, dur: 0.5, delay: 2900 }, // D5
        { freq: 493.88, dur: 0.5, delay: 3400 }, // B4
        { freq: 554.37, dur: 0.5, delay: 3900 }, // C#5
        { freq: 587.33, dur: 1.0, delay: 4400 }, // D5
      ];
      melody.forEach(n => {
        setTimeout(() => {
          this.playInstrumentNote('silver_flute', n.freq, n.dur, 0.75);
          this.playInstrumentNote('harp', n.freq, n.dur, 0.5);
        }, n.delay);
      });
    } else {
      this.playFanfare();
    }
  }

  /**
   * Post-game celebratory jam session playback for the Maestro's Roundtable
   * Weaves together Mozart, Beethoven, Bach, Paganini, and Satie with full orchestral triumph.
   */
  public playMaestroRoundtableJam(): void {
    if (this.isMuted || !this.ensureContext() || !this.ctx || !this.masterGain) return;

    // 1. Satie's velvet opening chords (0ms - 400ms)
    setTimeout(() => this.playInstrumentNote('acoustic_guitar', 196.00, 0.8, 0.8), 0);
    setTimeout(() => {
      this.playInstrumentNote('harp', 493.88, 0.6, 0.7);
      this.playInstrumentNote('harp', 587.33, 0.6, 0.7);
      this.playInstrumentNote('harp', 739.99, 0.6, 0.7);
    }, 200);

    // 2. Bach's polyphonic counterpoint arpeggios (400ms - 1000ms)
    const bachNotes = [
      { freq: 440.00, dur: 0.12, delay: 400 },
      { freq: 523.25, dur: 0.12, delay: 520 },
      { freq: 659.25, dur: 0.12, delay: 640 },
      { freq: 587.33, dur: 0.15, delay: 760 },
      { freq: 440.00, dur: 0.25, delay: 900 }
    ];
    bachNotes.forEach(n => {
      setTimeout(() => {
        this.playInstrumentNote('oboe', n.freq, n.dur, 0.85);
        this.playInstrumentNote('cello', n.freq * 0.5, n.dur, 0.8);
      }, n.delay);
    });

    // 3. Mozart's joyful Eine kleine Nachtmusik leap (1100ms - 1700ms)
    const mozartNotes = [
      { freq: 392.00, dur: 0.14, delay: 1100 }, // G4
      { freq: 293.66, dur: 0.14, delay: 1250 }, // D4
      { freq: 392.00, dur: 0.14, delay: 1400 }, // G4
      { freq: 493.88, dur: 0.14, delay: 1550 }, // B4
      { freq: 587.33, dur: 0.28, delay: 1700 }, // D5
    ];
    mozartNotes.forEach(n => {
      setTimeout(() => {
        this.playInstrumentNote('violin', n.freq, n.dur, 0.9);
        this.playInstrumentNote('glockenspiel', n.freq * 2, n.dur, 0.6);
      }, n.delay);
    });

    // 4. Paganini's high-octane shredding triplets (1900ms - 2400ms)
    const paganiniNotes = [
      { freq: 880.00, dur: 0.08, delay: 1900 }, // A5
      { freq: 783.99, dur: 0.08, delay: 1980 }, // G5
      { freq: 698.46, dur: 0.08, delay: 2060 }, // F5
      { freq: 659.25, dur: 0.08, delay: 2140 }, // E5
      { freq: 587.33, dur: 0.08, delay: 2220 }, // D5
      { freq: 880.00, dur: 0.25, delay: 2300 }, // A5
    ];
    paganiniNotes.forEach(n => {
      setTimeout(() => {
        this.playInstrumentNote('violin', n.freq, n.dur, 0.95);
      }, n.delay);
    });

    // 5. Beethoven's heroic brass fanfare & timpani impact (2500ms - 3100ms)
    const beethovenFanfare = [
      { freq: 392.00, dur: 0.15, delay: 2500 }, // G4
      { freq: 392.00, dur: 0.15, delay: 2680 }, // G4
      { freq: 392.00, dur: 0.15, delay: 2860 }, // G4
      { freq: 311.13, dur: 0.60, delay: 3040 }, // Eb4
    ];
    beethovenFanfare.forEach(n => {
      setTimeout(() => {
        this.playInstrumentNote('pocket_trumpet', n.freq, n.dur, 0.95);
        this.playInstrumentNote('french_horn', n.freq * 0.5, n.dur, 0.9);
        this.playInstrumentNote('timpani', n.freq * 0.25, n.dur, 1.0);
      }, n.delay);
    });

    // 6. Grand Solstice Tutti Chord with festive cannon salute (3600ms)
    setTimeout(() => {
      [130.81, 196.00, 261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50].forEach(f => {
        this.playInstrumentNote('violin', f, 1.2, 0.9);
        this.playInstrumentNote('pocket_trumpet', f * 0.5, 1.2, 0.85);
        this.playInstrumentNote('glockenspiel', f * 2, 1.0, 0.7);
      });
      this.playInstrumentNote('cannon', 65.41, 1.0, 1.0);
      this.playInstrumentNote('timpani', 98.00, 1.0, 1.0);
    }, 3600);
  }

    /* ---------------- DYNAMIC BIOME SOUNDSCAPES & WILDLIFE FX ---------------- */

  public playWildlifeCall(species: string): void {
    if (this.isMuted || !this.ensureContext() || !this.ctx || !this.masterGain) return;
    
    if (species.includes('hare') || species.includes('bunny')) {
      // Playful rapid staccato plucks
      [659.25, 880.00, 987.77].forEach((freq, idx) => {
        setTimeout(() => this.playInstrumentNote('acoustic_guitar', freq, 0.15, 0.7), idx * 80);
      });
    } else if (species.includes('chameleon')) {
      // Bright Baroque harpsichord mordent arpeggio
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        setTimeout(() => this.playInstrumentNote('harpsichord', freq, 0.25, 0.8), idx * 80);
      });
    } else if (species.includes('hedgehog')) {
      // Crunchy overdriven electric guitar power chord riff
      [164.81, 220.00, 246.94, 329.63].forEach((freq, idx) => {
        setTimeout(() => this.playInstrumentNote('electric_guitar', freq, 0.35, 0.85), idx * 100);
      });
    } else if (species.includes('fox')) {
      // Smoky jazz saxophone flourish with warm vibrato
      [392.00, 440.00, 466.16, 523.25, 587.33].forEach((freq, idx) => {
        setTimeout(() => this.playInstrumentNote('saxophone', freq, 0.3, 0.85), idx * 110);
      });
    } else if (species.includes('woodpecker') || species.includes('typist')) {
      // Rapid typewriter key clacks culminating in a margin bell chime
      [0, 50, 100, 150].forEach(delay => {
        setTimeout(() => this.playInstrumentNote('typewriter', 440, 0.08, 0.8), delay);
      });
      setTimeout(() => this.playInstrumentNote('typewriter', 880, 0.4, 0.9), 220);
    } else if (species.includes('beetle') || species.includes('bombardier') || species.includes('cannon')) {
      // Massive sub-bass artillery cannon detonation
      this.playInstrumentNote('cannon', 65.41, 0.8, 1.0);
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

