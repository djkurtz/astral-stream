// Advanced Procedural Web Audio Engine for Astral Stream
import { AudioTimbrePreset } from './types';

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isWarped: boolean = false;
  private bgmInterval: number | null = null;
  private currentTrack: string | null = null;
  private stepCount: number = 0;
  private filterNode: BiquadFilterNode | null = null;
  private chimeCatTimbre: AudioTimbrePreset = 'chiptune_square';

  public setChimeCatTimbre(preset: AudioTimbrePreset): void {
    this.chimeCatTimbre = preset;
  }

  public getChimeCatTimbre(): AudioTimbrePreset {
    return this.chimeCatTimbre;
  }

  public init(): void {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    this.ctx = new AudioCtx();
    this.filterNode = this.ctx.createBiquadFilter();
    this.filterNode.type = 'lowpass';
    this.filterNode.frequency.setValueAtTime(14000, this.ctx.currentTime);
    this.filterNode.connect(this.ctx.destination);
  }

  public setWarped(warped: boolean): void {
    this.isWarped = warped;
    if (!this.ctx || !this.filterNode) return;
    const targetFreq = warped ? 1200 : 14000;
    this.filterNode.frequency.exponentialRampToValueAtTime(targetFreq, this.ctx.currentTime + 0.4);
  }

  public playTone(freq: number, type: OscillatorType = 'square', duration: number = 0.15, vol: number = 0.1): void {
    if (!this.ctx || this.isMuted || freq <= 0) return;
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
    } catch (e) {}
  }

  // 1. Warm Analog Saw Lead (Detuned Sawtooths + Resonant Filter Sweep)
  public playWarmAnalogLead(freq: number, duration: number = 0.22, vol: number = 0.16): void {
    if (!this.ctx || this.isMuted || freq <= 0) return;
    try {
      const t = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(freq, t);
      osc2.frequency.setValueAtTime(freq * 1.008, t); // Detuned for warmth

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.Q.setValueAtTime(3.5, t);
      filter.frequency.setValueAtTime(freq * 1.4, t);
      filter.frequency.exponentialRampToValueAtTime(freq * 4.5, t + 0.04);
      filter.frequency.exponentialRampToValueAtTime(freq * 1.6, t + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(this.filterNode || this.ctx.destination);

      osc1.start(t);
      osc2.start(t);
      osc1.stop(t + duration);
      osc2.stop(t + duration);
    } catch (e) {}
  }

  // 2. Electric FM Rhodes (Frequency Modulation + Tine Sparkle)
  public playFMRhodesChime(freq: number, duration: number = 0.32, vol: number = 0.18): void {
    if (!this.ctx || this.isMuted || freq <= 0) return;
    try {
      const t = this.ctx.currentTime;
      const carrier = this.ctx.createOscillator();
      carrier.type = 'sine';
      carrier.frequency.setValueAtTime(freq, t);

      const modulator = this.ctx.createOscillator();
      modulator.type = 'sine';
      modulator.frequency.setValueAtTime(freq * 3.5, t);

      const modGain = this.ctx.createGain();
      modGain.gain.setValueAtTime(freq * 1.6, t);
      modGain.gain.exponentialRampToValueAtTime(1.0, t + 0.1);

      modulator.connect(modGain);
      modGain.connect(carrier.frequency);

      const sparkle = this.ctx.createOscillator();
      sparkle.type = 'triangle';
      sparkle.frequency.setValueAtTime(freq * 2.0, t);

      const mainGain = this.ctx.createGain();
      mainGain.gain.setValueAtTime(vol, t);
      mainGain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      carrier.connect(mainGain);
      sparkle.connect(mainGain);
      mainGain.connect(this.filterNode || this.ctx.destination);

      modulator.start(t);
      carrier.start(t);
      sparkle.start(t);
      modulator.stop(t + duration);
      carrier.stop(t + duration);
      sparkle.stop(t + duration);
    } catch (e) {}
  }

  public playDrum(kind: 'kick' | 'snare' | 'hihat' | 'clap'): void {
    if (!this.ctx || this.isMuted) return;
    try {
      if (kind === 'kick') {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.setValueAtTime(140, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(32, this.ctx.currentTime + 0.16);

        gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.16);

        osc.connect(gain);
        gain.connect(this.filterNode || this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.16);
      } else if (kind === 'snare' || kind === 'clap') {
        this.playTone(kind === 'clap' ? 240 : 180, 'triangle', 0.1, 0.2);
        this.playStaticHiss(0.1, 0.09);
      } else if (kind === 'hihat') {
        this.playStaticHiss(0.03, 0.04);
      }
    } catch (e) {}
  }

  public playStaticHiss(duration: number = 0.15, vol: number = 0.1): void {
    if (!this.ctx || this.isMuted) return;
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
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

  public playRhythmHit(grade: 'PERFECT' | 'GREAT' | 'MISS'): void {
    if (grade === 'PERFECT') {
      this.playDrum('clap');
      this.playTone(1046.5, 'sine', 0.25, 0.25); // High C6 chime
      setTimeout(() => this.playTone(1318.5, 'triangle', 0.2, 0.2), 60); // E6
    } else if (grade === 'GREAT') {
      this.playDrum('snare');
      this.playTone(659.25, 'sine', 0.18, 0.18);
    } else {
      this.playTone(110, 'sawtooth', 0.25, 0.2); // Low thud
    }
  }

  public playPadTone(padIndex: number): void {
    const freqs = [261.63, 329.63, 392.00]; // C4 (Low), E4 (Mid), G4 (High)
    const freq = freqs[padIndex] || 300;
    this.playTone(freq, 'triangle', 0.28, 0.22);
    this.playTone(freq * 2, 'sine', 0.2, 0.08);
  }

  public playSuccessDing(): void {
    this.playTone(880, 'sine', 0.15, 0.15); // A5
    setTimeout(() => this.playTone(1046.5, 'triangle', 0.3, 0.2), 80); // C6
  }

  public playTuningClick(): void {
    this.playTone(700 + Math.random() * 250, 'sine', 0.05, 0.08);
  }

  public playLockChime(): void {
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((note, i) => {
      setTimeout(() => this.playTone(note, 'sine', 0.25, 0.15), i * 70);
    });
  }

  public playDiscoveryFanfare(): void {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((note, i) => {
      setTimeout(() => {
        this.playTone(note, 'triangle', 0.25, 0.18);
        this.playTone(note * 1.5, 'sine', 0.15, 0.08);
      }, i * 65);
    });
  }

  public playCleansingBloom(): void {
    const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
    notes.forEach((note, i) => {
      setTimeout(() => {
        this.playTone(note, 'triangle', 0.6, 0.2);
        this.playTone(note * 1.5, 'sine', 0.4, 0.1);
      }, i * 80);
    });
  }

  public playMoveSound(type: string): void {
    if (type === 'arpeggio') {
      const notes = [659, 783, 987, 1318];
      notes.forEach((f, i) => {
        setTimeout(() => {
          if (this.chimeCatTimbre === 'warm_saw') {
            this.playWarmAnalogLead(f, 0.16, 0.14);
          } else if (this.chimeCatTimbre === 'fm_rhodes') {
            this.playFMRhodesChime(f, 0.22, 0.16);
          } else {
            this.playTone(f, 'square', 0.12, 0.12);
          }
        }, i * 50);
      });
    } else if (type === 'violin_staccato') {
      // Classical Baroque Violin Staccato (Rapid crisp bowing)
      [440, 554.37, 659.25, 880].forEach((f, i) => {
        setTimeout(() => {
          this.playTone(f, 'triangle', 0.1, 0.2);
          this.playTone(f * 2, 'sine', 0.08, 0.08);
        }, i * 60);
      });
    } else if (type === 'sitar_twang') {
      // Indian Classical Sitar with Microtonal Meend (Pitch Bend)
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(293.66, this.ctx.currentTime); // D4
      osc.frequency.linearRampToValueAtTime(329.63, this.ctx.currentTime + 0.15); // Bend to E4
      osc.frequency.linearRampToValueAtTime(293.66, this.ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(this.filterNode || this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);
    } else if (type === 'taiko_boom') {
      // Japanese Matsuri Taiko Drum (Heavy resonant thud)
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.frequency.setValueAtTime(95, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(28, this.ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.45, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.filterNode || this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } else if (type === 'brass_riff') {
      // Jazz Brass Saxophone blast
      [349.23, 440, 523.25, 698.46].forEach((f, i) => setTimeout(() => this.playTone(f, 'sawtooth', 0.14, 0.15), i * 50));
    } else if (type === 'bass_drop') {
      const osc = this.ctx?.createOscillator();
      const gain = this.ctx?.createGain();
      if (!this.ctx || !osc || !gain) return;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(38, this.ctx.currentTime + 0.35);
      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(this.filterNode || this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.35);
    } else if (type === 'glitch_hit') {
      this.playStaticHiss(0.3, 0.3);
      this.playTone(85, 'sawtooth', 0.25, 0.25);
    } else if (type === 'cosmic_burst') {
      this.playCleansingBloom();
    }
  }

  public playCreatureMotif(spiritId: string): void {
    if (spiritId === 'spirit_chime_cat') {
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((f, i) => {
        setTimeout(() => {
          if (this.chimeCatTimbre === 'warm_saw') {
            this.playWarmAnalogLead(f, 0.18, 0.16);
          } else if (this.chimeCatTimbre === 'fm_rhodes') {
            this.playFMRhodesChime(f, 0.26, 0.18);
          } else {
            this.playTone(f, 'square', 0.1, 0.15);
          }
        }, i * 65);
      });
    } else if (spiritId === 'spirit_allegro_owl') {
      // Baroque Violin Concertmaster Cadence
      [440, 554.37, 659.25, 880, 1108.73].forEach((f, i) => {
        setTimeout(() => {
          this.playTone(f, 'triangle', 0.12, 0.22);
          this.playTone(f * 2, 'sine', 0.08, 0.08);
        }, i * 60);
      });
    } else if (spiritId === 'spirit_sitar_swan') {
      // Indian Raga Meend Glide & Drone
      this.playTone(146.83, 'sawtooth', 0.6, 0.1); // D3 Drone
      if (this.ctx) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(293.66, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(349.23, this.ctx.currentTime + 0.25);
        osc.frequency.linearRampToValueAtTime(293.66, this.ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(this.filterNode || this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.6);
      }
    } else if (spiritId === 'spirit_taiko_tanuki') {
      // Japanese Matsuri Festival Cadence (Don! Don! Ka-Don!)
      this.playMoveSound('taiko_boom');
      setTimeout(() => this.playMoveSound('taiko_boom'), 180);
      setTimeout(() => this.playTone(320, 'triangle', 0.06, 0.2), 340); // Ka (rimshot)
      setTimeout(() => this.playMoveSound('taiko_boom'), 420); // Don
    } else if (spiritId === 'spirit_brass_bunny') {
      // Bebop Jazz Horn Lick
      [349.23, 440, 523.25, 698.46, 659.25].forEach((f, i) => {
        setTimeout(() => this.playTone(f, 'sawtooth', 0.12, 0.18), i * 70);
      });
    } else if (spiritId === 'spirit_bass_hound') {
      // Heavy 808 Sub Slide
      this.playMoveSound('bass_drop');
    } else if (spiritId === 'spirit_cyber_chimera') {
      this.playCleansingBloom();
    }
  }

  public playEmergencyAlertBuzz(): void {
    this.init();

    // Trigger physical hardware vibration if available (mobile phones / gamepads)
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate([400, 150, 400, 150, 600]);
      } catch (_e) {
        // Ignore if restricted by browser permissions
      }
    }

    if (!this.ctx || this.isMuted) return;

    // Authentic Dual-Tone 853Hz & 960Hz Emergency Broadcast Alert Pulsed Screech + Sub Motor Hum
    const bursts = [0, 0.45, 0.9];
    bursts.forEach(startTime => {
      if (!this.ctx) return;
      const t = this.ctx.currentTime + startTime;
      const duration = 0.38;

      // Tone 1: 853 Hz (EAS Attention Frequency)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(853, t);
      gain1.gain.setValueAtTime(0.25, t);
      gain1.gain.exponentialRampToValueAtTime(0.01, t + duration);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(t);
      osc1.stop(t + duration);

      // Tone 2: 960 Hz (EAS Attention Frequency)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(960, t);
      gain2.gain.setValueAtTime(0.25, t);
      gain2.gain.exponentialRampToValueAtTime(0.01, t + duration);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(t);
      osc2.stop(t + duration);

      // Low phone motor vibration hum (60 Hz)
      const oscSub = this.ctx.createOscillator();
      const gainSub = this.ctx.createGain();
      oscSub.type = 'square';
      oscSub.frequency.setValueAtTime(60, t);
      gainSub.gain.setValueAtTime(0.3, t);
      gainSub.gain.exponentialRampToValueAtTime(0.01, t + duration);
      oscSub.connect(gainSub);
      gainSub.connect(this.ctx.destination);
      oscSub.start(t);
      oscSub.stop(t + duration);
    });
  }

  private currentBiome: 'beach' | 'plaza' | 'sangeet' | 'bamboo' | 'grove' | 'ruins' | 'ridge' | 'cafe' | 'vinyl_den' = 'plaza';

  public setBiome(biome: 'beach' | 'plaza' | 'sangeet' | 'bamboo' | 'grove' | 'ruins' | 'ridge' | 'cafe' | 'vinyl_den'): void {
    this.currentBiome = biome;
  }

  public updatePlayerPosition(x: number, y: number): void {
    // Retained for coordinate-based fallback
    let targetBiome: 'beach' | 'plaza' | 'grove' | 'ruins' | 'ridge' = 'plaza';
    if (y > 1850 && x < 1400) {
      targetBiome = 'beach';
    } else if (x > 2100 && y > 950) {
      targetBiome = 'grove';
    } else if (x > 1800 && y <= 950) {
      targetBiome = 'ruins';
    } else if (x <= 1300 && y <= 1050) {
      targetBiome = 'ridge';
    } else {
      targetBiome = 'plaza';
    }

    if (this.currentBiome !== targetBiome) {
      this.currentBiome = targetBiome;
    }
  }

  /* ---------------- STRUCTURED BGM SYSTEM ---------------- */
  public switchTrack(track: string): void {
    if (this.currentTrack === track && this.bgmInterval) return;
    this.stopBGM();
    this.currentTrack = track;
    if (track === 'beach') this.currentBiome = 'beach';
    else if (track === 'sangeet') this.currentBiome = 'sangeet';
    else if (track === 'bamboo') this.currentBiome = 'bamboo';
    else if (track === 'ruins') this.currentBiome = 'ruins';
    else if (track === 'ridge') this.currentBiome = 'ridge';
    else if (track === 'cafe') this.currentBiome = 'cafe';
    else if (track === 'vinyl_den') this.currentBiome = 'vinyl_den';
    else if (track === 'town') this.currentBiome = 'plaza';
    this.startBGM();
  }

  public startBGM(): void {
    if (this.bgmInterval) return;
    this.init();
    this.stepCount = 0;

    // Biome Specific Chords & Melodies
    const biomeChords = {
      plaza: [ // Cozy Lo-Fi Jazz (Am7 - Dm7 - G7 - Cmaj7)
        { b: 110, m: [440, 523, 659, 523], voice: 'sine' },
        { b: 73.4, m: [293, 349, 440, 349], voice: 'sine' },
        { b: 98.0, m: [392, 493, 587, 493], voice: 'sine' },
        { b: 130.8, m: [523, 659, 783, 659], voice: 'sine' }
      ],
      beach: [ // Tropical Port Resonata Steel-Pan / Marimba (Fmaj7 - C - Dm7 - Bb)
        { b: 87.3, m: [349, 440, 523, 659], voice: 'triangle' },
        { b: 130.8, m: [523, 659, 783, 659], voice: 'triangle' },
        { b: 73.4, m: [293, 349, 440, 587], voice: 'triangle' },
        { b: 116.5, m: [466, 587, 698, 880], voice: 'triangle' }
      ],
      sangeet: [ // Vedic Sangeet Lotus Sanctuary - Raga Yaman (D - F# - A - C#)
        { b: 146.8, m: [293.6, 370.0, 440.0, 554.4], voice: 'sawtooth' },
        { b: 110.0, m: [220.0, 277.2, 330.0, 440.0], voice: 'sawtooth' },
        { b: 146.8, m: [440.0, 493.9, 554.4, 659.3], voice: 'sawtooth' },
        { b: 98.0, m: [196.0, 246.9, 293.7, 370.0], voice: 'sawtooth' }
      ],
      bamboo: [ // Zen Bamboo Koto / Pentatonic (D - F - G - A - C)
        { b: 146.8, m: [293, 349, 392, 440], voice: 'triangle' },
        { b: 110.0, m: [440, 523, 587, 659], voice: 'triangle' },
        { b: 146.8, m: [587, 659, 783, 880], voice: 'triangle' },
        { b: 98.0, m: [392, 440, 523, 587], voice: 'triangle' }
      ],
      grove: [ // Legacy Alias for Bamboo
        { b: 146.8, m: [293, 349, 392, 440], voice: 'triangle' },
        { b: 110.0, m: [440, 523, 587, 659], voice: 'triangle' },
        { b: 146.8, m: [587, 659, 783, 880], voice: 'triangle' },
        { b: 98.0, m: [392, 440, 523, 587], voice: 'triangle' }
      ],
      ruins: [ // Ancient Resonant Choral Swells (Em - C - G - D)
        { b: 82.4, m: [329, 392, 493, 659], voice: 'sine' },
        { b: 130.8, m: [523, 659, 783, 1046], voice: 'sine' },
        { b: 98.0, m: [392, 493, 587, 783], voice: 'sine' },
        { b: 73.4, m: [293, 369, 440, 587], voice: 'sine' }
      ],
      ridge: [ // Gritty Analog Overdrive & Static (Bm - G - Em - F#)
        { b: 123.5, m: [493, 587, 740, 587], voice: 'sawtooth' },
        { b: 98.0, m: [392, 493, 587, 493], voice: 'sawtooth' },
        { b: 82.4, m: [329, 392, 493, 392], voice: 'sawtooth' },
        { b: 92.5, m: [369, 440, 554, 440], voice: 'sawtooth' }
      ],
      cafe: [ // Warm Lo-Fi Chillhop (Fmaj7 - Em7 - Dm7 - Cmaj7)
        { b: 87.3, m: [349, 440, 523, 659], voice: 'sine' },
        { b: 82.4, m: [329, 392, 493, 587], voice: 'sine' },
        { b: 73.4, m: [293, 349, 440, 523], voice: 'sine' },
        { b: 65.4, m: [261, 329, 392, 523], voice: 'sine' }
      ],
      vinyl_den: [ // Turntable Soul & Rare Wax (Bbmaj7 - Gm7 - Cm7 - F7)
        { b: 116.5, m: [466, 587, 698, 880], voice: 'triangle' },
        { b: 98.0, m: [392, 466, 587, 698], voice: 'triangle' },
        { b: 130.8, m: [523, 622, 783, 932], voice: 'triangle' },
        { b: 87.3, m: [349, 440, 523, 698], voice: 'triangle' }
      ]
    };

    // Battle: Driving Synth-Punk (Dm - Bb - F - C)
    const battleChords = [
      { b: 146.8, m: [587, 698, 880, 698] },
      { b: 116.5, m: [466, 587, 698, 587] },
      { b: 174.6, m: [698, 880, 1046, 880] },
      { b: 130.8, m: [523, 659, 783, 1046] }
    ];

    const tempoMs = this.currentTrack === 'battle' ? 125 : 170;

    this.bgmInterval = window.setInterval(() => {
      if (!this.ctx || this.isMuted) return;

      const track = this.currentTrack || 'town';
      const step16 = this.stepCount % 16;
      const chordIndex = Math.floor(step16 / 4);
      const subStep = step16 % 4;

      if (track === 'battle') {
        const chord = battleChords[chordIndex];
        // Driving Dance Drums
        if (step16 % 4 === 0) this.playDrum('kick');
        if (step16 % 4 === 2) this.playDrum('snare');
        this.playDrum('hihat');

        // Bass
        if (subStep === 0 || subStep === 2) {
          this.playTone(this.isWarped ? chord.b * 0.98 : chord.b, 'sawtooth', 0.12, 0.12);
        }

        // Melody Lead
        const mel = chord.m[subStep];
        this.playTone(this.isWarped ? mel * 1.02 : mel, 'square', 0.08, 0.05);

      } else {
        const currentProg = (biomeChords as any)[this.currentBiome] || biomeChords.plaza;
        const chord = currentProg[chordIndex];
        const voice = (chord.voice as OscillatorType) || 'sine';

        // Biome Dynamic Percussion
        if (this.currentBiome === 'beach') {
          if (step16 === 0 || step16 === 10) this.playDrum('kick');
          if (step16 === 4 || step16 === 12) this.playDrum('clap');
          if (step16 % 2 === 1) this.playDrum('hihat');
        } else if (this.currentBiome === 'sangeet') {
          // Tabla pulse pattern (Dha Dha Din Tin)
          if (step16 === 0 || step16 === 8) this.playTone(110, 'sine', 0.18, 0.2); // Bayan bass
          if (step16 === 4 || step16 === 12) this.playTone(293.66, 'triangle', 0.08, 0.12); // Dayan rim
          if (step16 % 2 === 1) this.playTone(587.33, 'sine', 0.04, 0.05);
        } else if (this.currentBiome === 'bamboo' || this.currentBiome === 'grove') {
          if (step16 === 0 || step16 === 8) this.playDrum('kick');
          if (step16 === 6 || step16 === 14) this.playDrum('hihat');
        } else if (this.currentBiome === 'ridge') {
          if (step16 % 4 === 0) this.playDrum('kick');
          if (step16 % 4 === 2) this.playDrum('snare');
          if (Math.random() < 0.25) this.playStaticHiss(0.08, 0.08);
        } else {
          // Plaza / Cafe / Vinyl / Ruins default
          if (step16 === 0 || step16 === 8) this.playDrum('kick');
          if (step16 === 4 || step16 === 12) this.playDrum('snare');
          if (step16 % 2 === 0) this.playDrum('hihat');
        }

        // Bass
        if (subStep === 0) {
          const bassType = this.currentBiome === 'ridge' ? 'sawtooth' : (this.currentBiome === 'sangeet' ? 'sawtooth' : 'triangle');
          this.playTone(chord.b, bassType, 0.28, this.currentBiome === 'ridge' ? 0.14 : 0.1);
        }

        // Ambient Melody Arpeggios
        const mel = chord.m[subStep];
        if (subStep % 2 === 0 || this.currentBiome === 'beach' || this.currentBiome === 'sangeet') {
          this.playTone(mel, voice, 0.2, 0.07);
        }
      }

      if (this.isWarped && Math.random() < 0.15) {
        this.playStaticHiss(0.06, 0.05);
      }

      this.stepCount++;
    }, tempoMs);
  }

  public stopBGM(): void {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const soundEngine = new AudioEngine();
