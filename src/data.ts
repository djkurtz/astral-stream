import { BossEntity, RivalCharacter, StreamSpirit } from './types';

export const STARTER_SPIRIT: StreamSpirit = {
  id: 'spirit_chime_cat',
  name: 'Chime-Cat',
  title: '8-Bit Synth Kitten',
  frequency: 98.0,
  species: 'Chime Feline',
  instrument: 'Chiptune Synthesizer',
  avatar: '🐱',
  color: '#38bdf8',
  hp: 65,
  maxHp: 65,
  energy: 100,
  attack: 16,
  defense: 12,
  speed: 18,
  moves: [
    {
      id: 'm_scratch',
      name: 'Glissando Scratch',
      type: 'synth',
      power: 18,
      cost: 15,
      description: 'Scratches with sparkling cyan claws to unleash a cascading synth chord.',
      soundType: 'arpeggio'
    },
    {
      id: 'm_tempo',
      name: 'Tempo Surge',
      type: 'synth',
      power: 28,
      cost: 30,
      description: 'Accelerates the beat, dealing rapid musical strikes.',
      soundType: 'arpeggio'
    }
  ]
};

export const JAX_SPIRIT: StreamSpirit = {
  id: 'spirit_bass_hound',
  name: 'Bass-Hound',
  title: 'Spiked Fuzz Basset',
  frequency: 88.3,
  species: 'Sub-Woofer Canine',
  instrument: 'Overdrive Bass',
  avatar: '🐶',
  color: '#c084fc',
  hp: 85,
  maxHp: 85,
  energy: 100,
  attack: 22,
  defense: 18,
  speed: 10,
  moves: [
    {
      id: 'm_sub_bark',
      name: 'Sub-Woofer Bark',
      type: 'bass',
      power: 24,
      cost: 20,
      description: 'Emits a heavy 808 low-frequency shockwave.',
      soundType: 'bass_drop'
    },
    {
      id: 'm_fuzz',
      name: 'Overdrive Slam',
      type: 'bass',
      power: 34,
      cost: 35,
      description: 'Slams paws down to distort the ground with raw bass fuzz.',
      soundType: 'bass_drop'
    }
  ]
};

export const FUSED_CHIMERA: StreamSpirit = {
  id: 'spirit_cyber_chimera',
  name: 'Cyber-Fuzz Chimera',
  title: 'Dual-Stream Celestial Beast',
  frequency: 186.3,
  species: 'Ascended Harmonimal',
  instrument: 'Chiptune-Metal Mashup',
  avatar: '🐯⚡',
  color: '#f43f5e',
  hp: 150,
  maxHp: 150,
  energy: 100,
  attack: 38,
  defense: 25,
  speed: 25,
  isFused: true,
  moves: [
    {
      id: 'm_dual_drop',
      name: 'DUAL-STREAM DROP',
      type: 'cosmic',
      power: 55,
      cost: 40,
      description: 'Unleashes an explosive fusion drop that tears through static interference!',
      soundType: 'cosmic_burst'
    },
    {
      id: 'm_super_arpeggio',
      name: 'Hyper-Resonance Beam',
      type: 'synth',
      power: 42,
      cost: 25,
      description: 'Fires a blazing stream of harmonized laser notes.',
      soundType: 'arpeggio'
    }
  ]
};

export const RIVAL_JAX: RivalCharacter = {
  id: 'rival_jax',
  name: 'Jax',
  title: 'The Shadow Punk',
  tagline: 'Basslines speak louder than words.',
  avatar: '🎸',
  color: '#c084fc',
  dialogueGreet: [
    "Hey! You're the one walking around with that vintage Astral Tuner?",
    "This shoreline is my turf. The music here is completely jammed by some weird static glitch.",
    "If you think you're ready to take on the anomaly, prove your rhythm to me first in a Resonance Duel!"
  ],
  dialogueDefeat: [
    "Whoa... okay, your timing is clean. I respect that.",
    "My Bass-Hound and I have been trying to breach that static storm for days.",
    "Let's team up. If we stream our frequencies together, we can blast that Dead Channel into pieces!"
  ],
  spirit: JAX_SPIRIT
};

export const BOSS_SIGNAL_OVERLORD: BossEntity = {
  id: 'boss_signal_overlord',
  name: 'DEAD CHANNEL 000',
  title: 'The Signal Overlord',
  styleAnomaly: 'crt_static',
  avatar: '📺👾',
  hp: 160,
  maxHp: 160,
  attack: 24,
  glitchIntensity: 1.0,
  moves: [
    {
      id: 'b_static_burst',
      name: 'Static Snow Burst',
      type: 'static',
      power: 20,
      cost: 10,
      description: 'Blasts blinding white noise and analog interference.',
      soundType: 'glitch_hit'
    },
    {
      id: 'b_desync',
      name: 'Frequency Jammer',
      type: 'static',
      power: 30,
      cost: 25,
      description: 'Desynchronizes your tuner, warping the battle tempo.',
      soundType: 'glitch_hit'
    }
  ]
};
