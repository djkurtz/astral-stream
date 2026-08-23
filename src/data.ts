import { NPCEntity, SoundRipple, StreamSpirit } from './types';

export const STARTER_SPIRIT: StreamSpirit = {
  id: 'spirit_chime_cat',
  name: 'Chime-Cat',
  title: '8-Bit Synth Kitten',
  vibeTag: '#ChiptunePop',
  species: 'Chime Feline',
  instrument: 'Chiptune Synthesizer',
  type: 'synth',
  color: '#38bdf8',
  hp: 70,
  maxHp: 70,
  energy: 100,
  attack: 18,
  defense: 12,
  speed: 18,
  moves: [
    {
      id: 'm_scratch',
      name: 'Glissando Scratch',
      type: 'synth',
      power: 20,
      cost: 15,
      description: 'Scratches with sparkling cyan claws. [Strong vs BASS]',
      effectiveness: 'Strong vs BASS',
      soundType: 'arpeggio'
    },
    {
      id: 'm_tempo',
      name: 'Tempo Surge',
      type: 'synth',
      power: 30,
      cost: 30,
      description: 'Accelerates the beat, dealing rapid musical strikes. [Strong vs BASS]',
      effectiveness: 'Strong vs BASS',
      soundType: 'arpeggio'
    }
  ]
};

export const BRASS_BUNNY_SPIRIT: StreamSpirit = {
  id: 'spirit_brass_bunny',
  name: 'Brass-Bunny',
  title: 'Golden Saxophone Rabbit',
  vibeTag: '#ElectroBrass',
  species: 'Horn Leporid',
  instrument: 'Golden Saxophone',
  type: 'brass',
  color: '#fbbf24',
  hp: 60,
  maxHp: 60,
  energy: 100,
  attack: 24,
  defense: 10,
  speed: 22,
  moves: [
    {
      id: 'm_sax_riff',
      name: 'Sonic Brass Blast',
      type: 'brass',
      power: 22,
      cost: 15,
      description: 'Blasts a warm jazz-pop riff. [Strong vs SYNTH]',
      effectiveness: 'Strong vs SYNTH',
      soundType: 'brass_riff'
    },
    {
      id: 'm_tempo_hop',
      name: 'Tempo Hop',
      type: 'brass',
      power: 32,
      cost: 30,
      description: 'High-energy brass crescendo that deafens digital synths.',
      effectiveness: 'Strong vs SYNTH',
      soundType: 'brass_riff'
    }
  ]
};

export const JAX_SPIRIT: StreamSpirit = {
  id: 'spirit_bass_hound',
  name: 'Bass-Hound',
  title: 'Spiked Fuzz Basset',
  vibeTag: '#SpikedBass',
  species: 'Sub-Woofer Canine',
  instrument: 'Overdrive Bass',
  type: 'bass',
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
      description: 'Emits a heavy 808 low-frequency shockwave. [Strong vs BRASS]',
      effectiveness: 'Strong vs BRASS',
      soundType: 'bass_drop'
    },
    {
      id: 'm_fuzz',
      name: 'Overdrive Slam',
      type: 'bass',
      power: 34,
      cost: 35,
      description: 'Slams paws down to distort the ground with raw bass fuzz. [Strong vs BRASS]',
      effectiveness: 'Strong vs BRASS',
      soundType: 'bass_drop'
    }
  ]
};

export const FUSED_CHIMERA: StreamSpirit = {
  id: 'spirit_cyber_chimera',
  name: 'Cyber-Fuzz Chimera',
  title: 'Blended Stream Legend',
  vibeTag: '#CosmicMashup',
  species: 'Ascended Harmonimal',
  instrument: 'Chiptune-Metal Mashup',
  type: 'cosmic',
  color: '#f43f5e',
  hp: 150,
  maxHp: 150,
  energy: 100,
  attack: 40,
  defense: 25,
  speed: 25,
  isFused: true,
  moves: [
    {
      id: 'm_dual_drop',
      name: 'PLAYLIST BLEND DROP',
      type: 'cosmic',
      power: 60,
      cost: 40,
      description: 'Unleashes an explosive fusion drop that tears through static interference! [SHATTERS GLITCHES]',
      effectiveness: 'Critical vs GLITCH',
      soundType: 'cosmic_burst'
    },
    {
      id: 'm_super_arpeggio',
      name: 'Hyper-Resonance Beam',
      type: 'synth',
      power: 45,
      cost: 25,
      description: 'Fires a blazing stream of harmonized laser notes.',
      effectiveness: 'Strong vs BASS',
      soundType: 'arpeggio'
    }
  ]
};

export const BOSS_SIGNAL_OVERLORD = {
  id: 'boss_signal_overlord',
  name: 'DEAD CHANNEL 000',
  title: 'The Signal Overlord',
  type: 'static' as const,
  avatar: '📺👾',
  hp: 160,
  maxHp: 160,
  attack: 22,
  glitchIntensity: 1.0,
  moves: [
    {
      id: 'b_static_burst',
      name: 'Static Snow Burst',
      type: 'static' as const,
      power: 20,
      cost: 10,
      description: 'Blasts blinding white noise and analog interference.',
      soundType: 'glitch_hit' as const
    },
    {
      id: 'b_desync',
      name: 'Stream Desync Jammer',
      type: 'static' as const,
      power: 28,
      cost: 25,
      description: 'Hacks your audio feed, desynchronizing the battle tempo.',
      soundType: 'glitch_hit' as const
    }
  ]
};

export const TOWN_NPCS: NPCEntity[] = [
  {
    id: 'npc_aria',
    name: 'Aria',
    title: 'Neon Cafe Barista',
    x: 180,
    y: 220,
    sprite: 'aria',
    color: '#38bdf8',
    actionType: 'talk',
    dialogue: [
      "Welcome to the Neon Cafe! ☕ Grab a chair and listen to the ocean waves.",
      "Are you new to battling with Harmonimals? Here's the secret to genre matchups:",
      "🎹 SYNTH overclocks 🎸 BASS, but 🎷 BRASS pierces right through SYNTH!",
      "Match your sound against their weakness and time your hits to the beat for massive critical damage!"
    ]
  },
  {
    id: 'npc_dj_otter',
    name: 'DJ Otter',
    title: 'Vinyl Records Master',
    x: 620,
    y: 200,
    sprite: 'dj_otter',
    color: '#fbbf24',
    actionType: 'talk',
    dialogue: [
      "Yo! Welcome to the Vinyl Den. 💽 Music flows through everything on Cadence Island.",
      "See that glowing musical ripple near the fountain? That's an uncataloged sound frequency!",
      "Walk up to it and tap your Sonic Radar to Audio-Match and stream a new companion!"
    ]
  },
  {
    id: 'npc_jax',
    name: 'Jax',
    title: 'The Shadow Punk',
    x: 400,
    y: 110,
    sprite: 'jax',
    color: '#c084fc',
    actionType: 'battle_jax',
    dialogue: [
      "Hey. You're the new streamer in town with the Vibe-Phone?",
      "Beyond this gate, a rogue Dead Channel has hijacked the entire shoreline with static snow.",
      "If you think your squad has what it takes, battle my Bass-Hound to prove your rhythm!"
    ]
  }
];

export const RIVAL_JAX = {
  name: 'Jax',
  title: 'The Shadow Punk',
  dialogueDefeat: [
    "Whoa... okay, your timing is clean and your rhythm is sharp. I respect that.",
    "My Bass-Hound and I have been trying to breach that static storm for days.",
    "Let's link our feeds into a Collaborative Playlist Blend! Together, we can blast that Dead Channel into pieces!"
  ]
};

export const TOWN_SOUND_RIPPLES: SoundRipple[] = [
  {
    id: 'ripple_fountain',
    x: 500,
    y: 350,
    spirit: BRASS_BUNNY_SPIRIT,
    discovered: false
  }
];
