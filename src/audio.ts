// Advanced Procedural Web Audio Engine for Astral Stream

export class AudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isWarped: boolean = false;
  private bgmInterval: number | null = null;
  private currentTrack: 'town' | 'battle' | null = null;
  private stepCount: number = 0;
  private filterNode: BiquadFilterNode | null = null;

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
      [659, 783, 987, 1318].forEach((f, i) => setTimeout(() => this.playTone(f, 'square', 0.12, 0.12), i * 50));
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
      // 8-Bit Ascending Arcade Chirp
      [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
        setTimeout(() => this.playTone(f, 'square', 0.1, 0.15), i * 65);
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

  /* ---------------- STRUCTURED BGM SYSTEM ---------------- */
  public switchTrack(track: 'town' | 'battle'): void {
    if (this.currentTrack === track && this.bgmInterval) return;
    this.stopBGM();
    this.currentTrack = track;
    this.startBGM();
  }

  public startBGM(): void {
    if (this.bgmInterval) return;
    this.init();
    this.stepCount = 0;

    // 16-Step Sequences
    // Town: Am - F - C - G (Cozy Lo-Fi Vibe)
    const townChords = [
      // Am (Steps 0-3)
      { b: 110, m: [440, 523, 659, 523] },
      // F (Steps 4-7)
      { b: 87.3, m: [349, 440, 523, 440] },
      // C (Steps 8-11)
      { b: 130.8, m: [523, 659, 783, 659] },
      // G (Steps 12-15)
      { b: 98.0, m: [392, 493, 587, 493] }
    ];

    // Battle: Driving Synth-Punk (Dm - Bb - F - C)
    const battleChords = [
      // Dm (0-3)
      { b: 146.8, m: [587, 698, 880, 698] },
      // Bb (4-7)
      { b: 116.5, m: [466, 587, 698, 587] },
      // F (8-11)
      { b: 174.6, m: [698, 880, 1046, 880] },
      // C (12-15)
      { b: 130.8, m: [523, 659, 783, 1046] }
    ];

    const tempoMs = this.currentTrack === 'battle' ? 125 : 175; // Faster for battle

    this.bgmInterval = window.setInterval(() => {
      if (!this.ctx || this.isMuted) return;

      const track = this.currentTrack || 'town';
      const chords = track === 'battle' ? battleChords : townChords;
      const step16 = this.stepCount % 16;
      const chordIndex = Math.floor(step16 / 4);
      const subStep = step16 % 4;
      const chord = chords[chordIndex];

      if (track === 'battle') {
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
        // Chill Town Drums
        if (step16 === 0 || step16 === 8) this.playDrum('kick');
        if (step16 === 4 || step16 === 12) this.playDrum('snare');
        if (step16 % 2 === 0) this.playDrum('hihat');

        // Warm Bass
        if (subStep === 0) {
          this.playTone(chord.b, 'triangle', 0.25, 0.1);
        }

        // Acoustic Arpeggio
        const mel = chord.m[subStep];
        if (subStep % 2 === 0) {
          this.playTone(mel, 'sine', 0.18, 0.06);
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
