import { NPCEntity, SoundRipple, StreamSpirit } from './types';

export const STARTER_SPIRIT: StreamSpirit = {
  id: 'spirit_chime_cat',
  name: 'Chime-Cat',
  title: '8-Bit Synth Kitten',
  vibeTag: '#ChiptunePop',
  species: 'Chime Feline',
  instrument: 'Chiptune Synthesizer',
  avatar: '🐱',
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

export const CLOUD_SLOTH_SPIRIT: StreamSpirit = {
  id: 'spirit_cloud_sloth',
  name: 'Cloud-Sloth',
  title: 'Sleepy Lo-Fi Sloth',
  vibeTag: '#LoFiAcoustic',
  species: 'Rainstick Sloth',
  instrument: 'Acoustic Rainstick',
  avatar: '🦥',
  type: 'synth',
  color: '#a7f3d0',
  hp: 80,
  maxHp: 80,
  energy: 100,
  attack: 16,
  defense: 20,
  speed: 8,
  moves: [
    {
      id: 'm_rain_strum',
      name: 'Cozy Rain Strum',
      type: 'synth',
      power: 22,
      cost: 15,
      description: 'Plays gentle rain acoustic chords that soothe the spirit. [Strong vs BASS]',
      effectiveness: 'Strong vs BASS',
      soundType: 'arpeggio'
    },
    {
      id: 'm_lofi_nap',
      name: 'Lo-Fi Chill',
      type: 'synth',
      power: 32,
      cost: 30,
      description: 'Emits relaxing ambient frequencies that bypass defenses.',
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
  avatar: '🐰🎷',
  type: 'brass',
  color: '#fbbf24',
  hp: 65,
  maxHp: 65,
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
      name: 'Tempo Hop Crescendo',
      type: 'brass',
      power: 34,
      cost: 30,
      description: 'High-energy brass crescendo that pierces digital synths.',
      effectiveness: 'Strong vs SYNTH',
      soundType: 'brass_riff'
    }
  ]
};

export const BEAT_PUP_SPIRIT: StreamSpirit = {
  id: 'spirit_beat_pup',
  name: 'Beat-Pup',
  title: 'Snappy Snare Terrier',
  vibeTag: '#ElectroBeats',
  species: 'Drummer Canine',
  instrument: 'Snare Drum & Claps',
  avatar: '🐶🥁',
  type: 'bass',
  color: '#f43f5e',
  hp: 75,
  maxHp: 75,
  energy: 100,
  attack: 20,
  defense: 16,
  speed: 16,
  moves: [
    {
      id: 'm_snare_kick',
      name: 'Snare Clap Attack',
      type: 'bass',
      power: 24,
      cost: 15,
      description: 'Hits a snappy pop-punk snare drum rimshot. [Strong vs BRASS]',
      effectiveness: 'Strong vs BRASS',
      soundType: 'bass_drop'
    },
    {
      id: 'm_beat_slam',
      name: '4-on-the-Floor Drop',
      type: 'bass',
      power: 32,
      cost: 30,
      description: 'Drives the bass rhythm with heavy dance kicks.',
      effectiveness: 'Strong vs BRASS',
      soundType: 'bass_drop'
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
  avatar: '🐶',
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
  avatar: '🐯⚡',
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
      "Check out the 3 musical ripples around the plaza to discover new sounds!"
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
      "There are 3 unique sound ripples scattered across town:",
      "🎛️ Equalizer Slider near the cafe, 🎹 Melody Repeat at the fountain, and 🎯 Rhythm Beats by my shop!",
      "Collect them all to build an unstoppable festival playlist!"
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

// 3 Distinct Sound Ripples across the Town Plaza
export const TOWN_SOUND_RIPPLES: SoundRipple[] = [
  {
    id: 'ripple_cafe',
    x: 180,
    y: 360,
    challengeType: 'waveform_slider',
    spirit: CLOUD_SLOTH_SPIRIT,
    discovered: false
  },
  {
    id: 'ripple_fountain',
    x: 400,
    y: 400,
    challengeType: 'call_response',
    spirit: BRASS_BUNNY_SPIRIT,
    discovered: false
  },
  {
    id: 'ripple_vinyl',
    x: 620,
    y: 360,
    challengeType: 'rhythm_pulse',
    spirit: BEAT_PUP_SPIRIT,
    discovered: false
  }
];
