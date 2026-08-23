import { NPCEntity, SoundRipple, StreamSpirit } from './types';

export const STARTER_SPIRIT: StreamSpirit = {
  id: 'spirit_chime_cat',
  name: 'Chime-Cat',
  title: '8-Bit Synth Kitten',
  vibeTag: '#ChiptunePop',
  species: 'Chime Feline',
  instrument: 'Chiptune Synthesizer',
  originTradition: 'Digital Chiptune & Arcade',
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
      description: 'Scratches with sparkling cyan synth tones. [Strong vs GLOBAL]',
      effectiveness: 'Strong vs GLOBAL',
      soundType: 'arpeggio'
    },
    {
      id: 'm_tempo',
      name: 'Tempo Surge',
      type: 'synth',
      power: 30,
      cost: 30,
      description: 'Accelerates the clock speed, dealing rapid digital strikes.',
      effectiveness: 'Strong vs GLOBAL',
      soundType: 'arpeggio'
    }
  ]
};

export const ALLEGRO_OWL_SPIRIT: StreamSpirit = {
  id: 'spirit_allegro_owl',
  name: 'Allegro-Owl',
  title: 'Baroque Concertmaster',
  vibeTag: '#BaroqueViolin',
  species: 'Strigiform Virtuoso',
  instrument: 'Baroque Violin & Bow',
  originTradition: 'European Classical (Vivaldi & Bach)',
  avatar: '🦉🎻',
  type: 'symphonic',
  color: '#a855f7',
  hp: 75,
  maxHp: 75,
  energy: 100,
  attack: 26,
  defense: 14,
  speed: 20,
  moves: [
    {
      id: 'm_vivaldi_staccato',
      name: 'Vivaldi Staccato',
      type: 'symphonic',
      power: 24,
      cost: 15,
      description: 'Strikes with rapid, fiery classical violin bowing. [Strong vs SYNTH]',
      effectiveness: 'Strong vs SYNTH',
      soundType: 'violin_staccato'
    },
    {
      id: 'm_concerto_crescendo',
      name: 'Four Seasons Crescendo',
      type: 'symphonic',
      power: 36,
      cost: 30,
      description: 'Unleashes a sweeping baroque orchestral harmonic storm.',
      effectiveness: 'Strong vs SYNTH',
      soundType: 'violin_staccato'
    }
  ]
};

export const SITAR_SWAN_SPIRIT: StreamSpirit = {
  id: 'spirit_sitar_swan',
  name: 'Sitar-Swan',
  title: 'Raga Meditation Swan',
  vibeTag: '#RagaAura',
  species: 'Avian Mystic',
  instrument: 'Classical Indian Sitar',
  originTradition: 'Indian Classical (Hindustani Raga)',
  avatar: '🦢🪕',
  type: 'global',
  color: '#f59e0b',
  hp: 70,
  maxHp: 70,
  energy: 100,
  attack: 22,
  defense: 18,
  speed: 15,
  moves: [
    {
      id: 'm_raga_meend',
      name: 'Raga Yaman Bend',
      type: 'global',
      power: 24,
      cost: 15,
      description: 'Pulls the sitar strings with microtonal grace. [Strong vs JAZZ]',
      effectiveness: 'Strong vs JAZZ',
      soundType: 'sitar_twang'
    },
    {
      id: 'm_jhala_drone',
      name: 'Jhala Resonance Wave',
      type: 'global',
      power: 34,
      cost: 30,
      description: 'Hypnotic sympathetic string resonance that bypasses armor.',
      effectiveness: 'Strong vs JAZZ',
      soundType: 'sitar_twang'
    }
  ]
};

export const TAIKO_TANUKI_SPIRIT: StreamSpirit = {
  id: 'spirit_taiko_tanuki',
  name: 'Taiko-Tanuki',
  title: 'Matsuri Festival Drummer',
  vibeTag: '#MatsuriThunder',
  species: 'Percussive Canid',
  instrument: 'Nagado Taiko Drum',
  originTradition: 'Japanese Folk Matsuri',
  avatar: '🦝🥁',
  type: 'global',
  color: '#ef4444',
  hp: 85,
  maxHp: 85,
  energy: 100,
  attack: 25,
  defense: 16,
  speed: 12,
  moves: [
    {
      id: 'm_taiko_strike',
      name: 'Thunder Taiko Strike',
      type: 'global',
      power: 25,
      cost: 15,
      description: 'Delivers a booming festival drum beat that shakes the ground. [Strong vs JAZZ]',
      effectiveness: 'Strong vs JAZZ',
      soundType: 'taiko_boom'
    },
    {
      id: 'm_matsuri_frenzy',
      name: 'Festival Drum Tremolo',
      type: 'global',
      power: 35,
      cost: 35,
      description: 'A rapid barrage of bachi stick strikes in accelerating tempo.',
      effectiveness: 'Strong vs JAZZ',
      soundType: 'taiko_boom'
    }
  ]
};

export const BRASS_BUNNY_SPIRIT: StreamSpirit = {
  id: 'spirit_brass_bunny',
  name: 'Brass-Bunny',
  title: 'Golden Bebop Saxophonist',
  vibeTag: '#BebopSwing',
  species: 'Horn Leporid',
  instrument: 'Golden Alto Saxophone',
  originTradition: 'American Jazz & Blues',
  avatar: '🐰🎷',
  type: 'jazz',
  color: '#fbbf24',
  hp: 65,
  maxHp: 65,
  energy: 100,
  attack: 25,
  defense: 10,
  speed: 22,
  moves: [
    {
      id: 'm_sax_riff',
      name: 'Bebop Swing Blast',
      type: 'jazz',
      power: 24,
      cost: 15,
      description: 'Blasts an energetic syncopated jazz riff. [Strong vs SYMPHONIC]',
      effectiveness: 'Strong vs SYMPHONIC',
      soundType: 'brass_riff'
    },
    {
      id: 'm_tempo_hop',
      name: 'Syncopated Crescendo',
      type: 'jazz',
      power: 35,
      cost: 30,
      description: 'Improvisational horn solo that shatters classical rigidity.',
      effectiveness: 'Strong vs SYMPHONIC',
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
  instrument: 'Overdrive Bass Guitar',
  originTradition: 'Underground Heavy Rock',
  avatar: '🐶',
  type: 'bass',
  color: '#c084fc',
  hp: 90,
  maxHp: 90,
  energy: 100,
  attack: 24,
  defense: 20,
  speed: 10,
  moves: [
    {
      id: 'm_sub_bark',
      name: 'Sub-Woofer Bark',
      type: 'bass',
      power: 25,
      cost: 20,
      description: 'Emits a heavy low-frequency overdrive shockwave.',
      effectiveness: 'Heavy Sub Damage',
      soundType: 'bass_drop'
    },
    {
      id: 'm_fuzz',
      name: 'Overdrive Slam',
      type: 'bass',
      power: 36,
      cost: 35,
      description: 'Slams paws down to distort the ground with raw bass fuzz.',
      effectiveness: 'Crushing Distortion',
      soundType: 'bass_drop'
    }
  ]
};

export const FUSED_CHIMERA: StreamSpirit = {
  id: 'spirit_cyber_chimera',
  name: 'Omni-Harmony Chimera',
  title: 'World Symphony Legend',
  vibeTag: '#WorldSymphonyMashup',
  species: 'Ascended Cross-Genre Harmonimal',
  instrument: 'Baroque Violin + Indian Sitar + 808 Bass',
  originTradition: 'Global Musical Convergence',
  avatar: '🐯✨',
  type: 'cosmic',
  color: '#f43f5e',
  hp: 160,
  maxHp: 160,
  energy: 100,
  attack: 42,
  defense: 26,
  speed: 25,
  isFused: true,
  moves: [
    {
      id: 'm_dual_drop',
      name: 'GLOBAL PLAYLIST BLEND DROP',
      type: 'cosmic',
      power: 65,
      cost: 40,
      description: 'Fuses classical baroque strings, Indian sitar, and chiptune into a radiant cleansing drop! [SHATTERS GLITCHES]',
      effectiveness: 'Critical vs GLITCH',
      soundType: 'cosmic_burst'
    },
    {
      id: 'm_super_arpeggio',
      name: 'Omni-Resonance Concerto',
      type: 'symphonic',
      power: 48,
      cost: 25,
      description: 'Fires a blazing stream of harmonized world melodies.',
      effectiveness: 'Universal Resonance',
      soundType: 'violin_staccato'
    }
  ]
};

export const BOSS_SIGNAL_OVERLORD = {
  id: 'boss_signal_overlord',
  name: 'DEAD CHANNEL 000',
  title: 'The Signal Overlord',
  type: 'static' as const,
  avatar: '📺👾',
  hp: 180,
  maxHp: 180,
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
      "Welcome to Cadence Plaza! ☕ Our island brings together music from every culture on Earth.",
      "Here is how the Global Genre wheel turns:",
      "🎻 SYMPHONIC (Classical) overpowers 🎹 SYNTH (Electronic)!",
      "🎹 SYNTH overpowers 🪕 GLOBAL (Sitar & Taiko)!",
      "🪕 GLOBAL overpowers 🎷 JAZZ (Brass), and 🎷 JAZZ pierces 🎻 SYMPHONIC!",
      "Explore the plaza to discover European Classical, Indian Raga, and Japanese Matsuri spirits!"
    ]
  },
  {
    id: 'npc_dj_otter',
    name: 'DJ Otter',
    title: 'World Vinyl Collector',
    x: 620,
    y: 200,
    sprite: 'dj_otter',
    color: '#fbbf24',
    actionType: 'talk',
    dialogue: [
      "Yo! I collect vinyl pressings from every continent. 💽",
      "Check out the 3 cultural sound stations in town:",
      "🎻 Allegro-Owl's Baroque Violin near the cafe terrace,",
      "🪕 Sitar-Swan's Indian Raga chords at the center fountain,",
      "🥁 Taiko-Tanuki's Japanese Festival drums by my vinyl shop!",
      "Collect them all to build an unstoppable world music festival squad!"
    ]
  },
  {
    id: 'npc_jax',
    name: 'Jax',
    title: 'The Underground Punk',
    x: 400,
    y: 110,
    sprite: 'jax',
    color: '#c084fc',
    actionType: 'battle_jax',
    dialogue: [
      "Hey. You're the streamer exploring our global soundwaves?",
      "Beyond this gate, a rogue Dead Channel has hijacked the feed with screeching static.",
      "Duel my Bass-Hound so we can sync our frequencies, and then we'll team up for the boss!"
    ]
  }
];

export const RIVAL_JAX = {
  name: 'Jax',
  title: 'The Underground Punk',
  dialogueDefeat: [
    "Whoa... okay, your timing is clean and your rhythm is sharp. I respect that!",
    "My Bass-Hound and I are joining your squad right now!",
    "Let's breach the Glitch Gate and blend our global playlist to blast Dead Channel 000 into pieces!"
  ]
};

// 3 Distinct Cultural Sound Ripples across the Town Plaza
export const TOWN_SOUND_RIPPLES: SoundRipple[] = [
  {
    id: 'ripple_cafe',
    x: 180,
    y: 360,
    challengeType: 'waveform_slider',
    spirit: ALLEGRO_OWL_SPIRIT, // European Baroque Classical (Violin)
    discovered: false
  },
  {
    id: 'ripple_fountain',
    x: 400,
    y: 400,
    challengeType: 'call_response',
    spirit: SITAR_SWAN_SPIRIT, // Indian Classical (Sitar)
    discovered: false
  },
  {
    id: 'ripple_vinyl',
    x: 620,
    y: 360,
    challengeType: 'rhythm_pulse',
    spirit: TAIKO_TANUKI_SPIRIT, // Japanese Matsuri (Taiko Drum)
    discovered: false
  }
];
