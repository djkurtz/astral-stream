import { CollectibleItem, NPCEntity, SoundRipple, StreamSpirit, WildGlitchEntity, WorldObstacle } from './types';

export const STARTER_SPIRIT: StreamSpirit = {
  id: 'spirit_chime_cat',
  name: 'Chime-Cat',
  title: 'Key-Spined Chiptune Feline',
  vibeTag: '#ChiptunePop',
  species: 'Synthesizer Feline',
  instrument: 'Piano-Key Spine & Audio-Jack Tail',
  originTradition: 'Digital Arcade & Chiptune',
  avatar: '🎹🐱',
  type: 'synth',
  color: '#38bdf8',
  level: 1,
  xp: 0,
  maxXp: 100,
  hp: 70,
  maxHp: 70,
  energy: 100,
  attack: 18,
  defense: 12,
  speed: 18,
  moves: [
    {
      id: 'm_scratch',
      name: 'Key-Spine Glissando',
      type: 'synth',
      power: 20,
      cost: 15,
      description: 'Rakes its sparkling cyan claws while running its tail across its piano-key spine. [Strong vs GLOBAL]',
      effectiveness: 'Strong vs GLOBAL',
      soundType: 'arpeggio'
    },
    {
      id: 'm_tempo',
      name: 'Overclocked Tempo Surge',
      type: 'synth',
      power: 30,
      cost: 30,
      description: 'Its LED whiskers pulse with overclocked clock speeds, unleashing rapid laser arpeggios.',
      effectiveness: 'Strong vs GLOBAL',
      soundType: 'arpeggio'
    }
  ]
};

export const ALLEGRO_OWL_SPIRIT: StreamSpirit = {
  id: 'spirit_allegro_owl',
  name: 'Allegro-Owl',
  title: 'F-Hole Stradivarius Owl',
  vibeTag: '#BaroqueViolin',
  species: 'Violin-Winged Strigid',
  instrument: 'Acoustic F-Hole Chest & Horsehair Bow Wings',
  originTradition: 'European Classical (Vivaldi & Bach)',
  avatar: '🎻🦉',
  type: 'symphonic',
  color: '#a855f7',
  level: 1,
  xp: 0,
  maxXp: 100,
  hp: 75,
  maxHp: 75,
  energy: 100,
  attack: 26,
  defense: 14,
  speed: 20,
  moves: [
    {
      id: 'm_vivaldi_staccato',
      name: 'Vivaldi Bow Strike',
      type: 'symphonic',
      power: 24,
      cost: 15,
      description: 'Preens its horsehair bow wings across its violin-carved chest with rapid classical staccatos. [Strong vs SYNTH]',
      effectiveness: 'Strong vs SYNTH',
      soundType: 'violin_staccato'
    },
    {
      id: 'm_concerto_crescendo',
      name: 'Four Seasons Concerto',
      type: 'symphonic',
      power: 36,
      cost: 30,
      description: 'Flaps its wings to conduct a soaring baroque orchestral storm that shatters digital noise.',
      effectiveness: 'Strong vs SYNTH',
      soundType: 'violin_staccato'
    }
  ]
};

export const SITAR_SWAN_SPIRIT: StreamSpirit = {
  id: 'spirit_sitar_swan',
  name: 'Sitar-Swan',
  title: 'Gourd-Bodied Veena Swan',
  vibeTag: '#RagaAura',
  species: 'Fretted Sitar Cygnus',
  instrument: 'Fretted Dandi Neck & Resonant Gourd Body',
  originTradition: 'Indian Classical (Hindustani Raga)',
  avatar: '🪕🦢',
  type: 'global',
  color: '#f59e0b',
  level: 1,
  xp: 0,
  maxXp: 100,
  hp: 70,
  maxHp: 70,
  energy: 100,
  attack: 22,
  defense: 18,
  speed: 15,
  moves: [
    {
      id: 'm_raga_meend',
      name: 'Raga Yaman Glide',
      type: 'global',
      power: 24,
      cost: 15,
      description: 'Curves its fretted sitar neck to bend pitch microtonally, bypassing rigid scales. [Strong vs JAZZ]',
      effectiveness: 'Strong vs JAZZ',
      soundType: 'sitar_twang'
    },
    {
      id: 'm_jhala_drone',
      name: 'Sympathetic Drone Wave',
      type: 'global',
      power: 34,
      cost: 30,
      description: 'Its carved gourd body vibrates with hypnotic drone waves, disrupting enemy tempo.',
      effectiveness: 'Strong vs JAZZ',
      soundType: 'sitar_twang'
    }
  ]
};

export const TAIKO_TANUKI_SPIRIT: StreamSpirit = {
  id: 'spirit_taiko_tanuki',
  name: 'Taiko-Tanuki',
  title: 'Belly-Drum Matsuri Tanuki',
  vibeTag: '#MatsuriThunder',
  species: 'Percussive Drum-Belly Canid',
  instrument: 'Wooden-Hooped Taiko Belly & Tail Bachi Sticks',
  originTradition: 'Japanese Folk Matsuri',
  avatar: '🥁🦝',
  type: 'global',
  color: '#ef4444',
  level: 1,
  xp: 0,
  maxXp: 100,
  hp: 85,
  maxHp: 85,
  energy: 100,
  attack: 25,
  defense: 16,
  speed: 12,
  moves: [
    {
      id: 'm_taiko_strike',
      name: 'Belly-Drum Thunder Strike',
      type: 'global',
      power: 25,
      cost: 15,
      description: 'Pats its taut taiko drum-skin belly with wooden tail-sticks, booming shockwaves. [Strong vs JAZZ]',
      effectiveness: 'Strong vs JAZZ',
      soundType: 'taiko_boom'
    },
    {
      id: 'm_matsuri_frenzy',
      name: 'Festival Tremolo Frenzy',
      type: 'global',
      power: 35,
      cost: 35,
      description: 'An accelerating celebratory drum roll that energizes allies and rattles foes.',
      effectiveness: 'Strong vs JAZZ',
      soundType: 'taiko_boom'
    }
  ]
};

export const BRASS_BUNNY_SPIRIT: StreamSpirit = {
  id: 'spirit_brass_bunny',
  name: 'Brass-Bunny',
  title: 'Saxophone-Eared Bebop Hare',
  vibeTag: '#BebopSwing',
  species: 'Horn-Eared Leporid',
  instrument: 'Gleaming Sax Bell Ears',
  originTradition: 'American Jazz & Blues',
  avatar: '🎷🐰',
  type: 'jazz',
  color: '#fbbf24',
  level: 1,
  xp: 0,
  maxXp: 100,
  hp: 65,
  maxHp: 65,
  energy: 100,
  attack: 25,
  defense: 10,
  speed: 22,
  moves: [
    {
      id: 'm_sax_riff',
      name: 'Horn-Ear Swing Blast',
      type: 'jazz',
      power: 24,
      cost: 15,
      description: 'Perks its golden saxophone ears to toot a syncopated bebop flurry. [Strong vs SYMPHONIC]',
      effectiveness: 'Strong vs SYMPHONIC',
      soundType: 'brass_riff'
    },
    {
      id: 'm_tempo_hop',
      name: 'Syncopated Hop Solo',
      type: 'jazz',
      power: 35,
      cost: 30,
      description: 'Hops rhythmically while blasting a brass crescendo that shatters classical rigidity.',
      effectiveness: 'Strong vs SYMPHONIC',
      soundType: 'brass_riff'
    }
  ]
};

export const JAX_SPIRIT: StreamSpirit = {
  id: 'spirit_bass_hound',
  name: 'Bass-Hound',
  title: 'Sub-Woofer Overdrive Basset',
  vibeTag: '#SpikedBass',
  species: 'Sub-Woofer Canine',
  instrument: 'Throat Sub-Woofer Cone & Guitar-Strap Ears',
  originTradition: 'Underground Heavy Rock',
  avatar: '🎸🐶',
  type: 'bass',
  color: '#c084fc',
  level: 2,
  xp: 0,
  maxXp: 150,
  hp: 90,
  maxHp: 90,
  energy: 100,
  attack: 24,
  defense: 20,
  speed: 10,
  moves: [
    {
      id: 'm_sub_bark',
      name: '808 Sub-Woofer Bark',
      type: 'bass',
      power: 25,
      cost: 20,
      description: 'Barks through its throat woofer cone, releasing a seismic 808 sub-bass shockwave.',
      effectiveness: 'Heavy Sub Damage',
      soundType: 'bass_drop'
    },
    {
      id: 'm_fuzz',
      name: 'Overdrive Paw Slam',
      type: 'bass',
      power: 36,
      cost: 35,
      description: 'Slams heavy paws to distort the arena with raw analog fuzz distortion.',
      effectiveness: 'Crushing Distortion',
      soundType: 'bass_drop'
    }
  ]
};

// Wild Static Glitchlings roaming the shoreline
export const BIT_BUG_SPIRIT: StreamSpirit = {
  id: 'spirit_bit_bug',
  name: 'Bit-Bug',
  title: 'Rogue Byte Glitchling',
  vibeTag: '#StaticNoise',
  species: 'Pixelated Static Insect',
  instrument: 'Corrupted Bit-Crush Antennae',
  originTradition: 'Rogue Data Leak',
  avatar: '👾',
  type: 'static',
  color: '#f87171',
  level: 1,
  xp: 0,
  maxXp: 60,
  hp: 45,
  maxHp: 45,
  energy: 100,
  attack: 14,
  defense: 8,
  speed: 12,
  moves: [
    {
      id: 'm_static_nibble',
      name: 'Bit-Crush Nibble',
      type: 'static',
      power: 16,
      cost: 10,
      description: 'Chitters with noisy digital static teeth.',
      soundType: 'glitch_hit'
    }
  ]
};

export const NOISE_MOTE_SPIRIT: StreamSpirit = {
  id: 'spirit_noise_mote',
  name: 'Noise-Mote',
  title: 'Analog Static Orb',
  vibeTag: '#AnalogGlitch',
  species: 'Electromagnetic Anomaly',
  instrument: 'White Noise Discharge Core',
  originTradition: 'Rogue Data Leak',
  avatar: '📺',
  type: 'static',
  color: '#fb7185',
  level: 1,
  xp: 0,
  maxXp: 60,
  hp: 50,
  maxHp: 50,
  energy: 100,
  attack: 16,
  defense: 10,
  speed: 14,
  moves: [
    {
      id: 'm_white_hiss',
      name: 'White Noise Flash',
      type: 'static',
      power: 18,
      cost: 12,
      description: 'Flashes blinding analog snow to disorient the listener.',
      soundType: 'glitch_hit'
    }
  ]
};

export const STEEL_PANDA_SPIRIT: StreamSpirit = {
  id: 'spirit_steel_panda',
  name: 'Steel-Panda',
  title: 'Calypso Steelpan Ursid',
  vibeTag: '#CalypsoSteel',
  species: 'Percussive Steelpan Ursid',
  instrument: 'Tuned Steelpan Drum & Mallets',
  originTradition: 'Caribbean (Trinidad & Tobago)',
  avatar: '🐼',
  type: 'global',
  color: '#10b981',
  level: 2,
  xp: 0,
  maxXp: 120,
  hp: 80,
  maxHp: 80,
  energy: 100,
  attack: 24,
  defense: 16,
  speed: 14,
  moves: [
    {
      id: 'm_calypso_roll',
      name: 'Calypso Mallet Roll',
      type: 'global',
      power: 24,
      cost: 15,
      description: 'Rolls rubber mallets across tuned steelpan bowls, ringing bright tropical harmonics. [Strong vs JAZZ]',
      effectiveness: 'Strong vs JAZZ',
      soundType: 'taiko_boom'
    },
    {
      id: 'm_island_echo',
      name: 'Carnival Bass Resonance',
      type: 'global',
      power: 35,
      cost: 30,
      description: 'Vibrates the steel pan skirt with booming festive resonance.',
      effectiveness: 'Strong vs JAZZ',
      soundType: 'taiko_boom'
    }
  ]
};

export const KORA_GAZELLE_SPIRIT: StreamSpirit = {
  id: 'spirit_kora_gazelle',
  name: 'Kora-Gazelle',
  title: 'Harp-Horned Griot Antelope',
  vibeTag: '#GriotStrings',
  species: '21-String Harpa Gazella',
  instrument: 'Calabash Gourd & 21-String Kora Horns',
  originTradition: 'West African (Mali & Senegal)',
  avatar: '🦌',
  type: 'global',
  color: '#f97316',
  level: 2,
  xp: 0,
  maxXp: 120,
  hp: 75,
  maxHp: 75,
  energy: 100,
  attack: 26,
  defense: 12,
  speed: 24,
  moves: [
    {
      id: 'm_kora_pluck',
      name: '21-String Kora Pluck',
      type: 'global',
      power: 25,
      cost: 15,
      description: 'Leaps gracefully while plucking its 21 strings in polyrhythmic cascading runs. [Strong vs JAZZ]',
      effectiveness: 'Strong vs JAZZ',
      soundType: 'sitar_twang'
    },
    {
      id: 'm_savanna_arpeggio',
      name: 'Savanna Horizon Cascade',
      type: 'global',
      power: 36,
      cost: 30,
      description: 'Strikes a soaring resonant chord that summons warm savanna breezes.',
      effectiveness: 'Strong vs JAZZ',
      soundType: 'sitar_twang'
    }
  ]
};

export const GLITCH_GOLEM_SPIRIT: StreamSpirit = {
  id: 'spirit_glitch_golem',
  name: 'Glitch-Golem',
  title: 'Corrupted Monolith Anomaly',
  vibeTag: '#MonolithStatic',
  species: 'Heavy Static Colossus',
  instrument: 'Low-Frequency Static Core',
  originTradition: 'Dead Channel Rift Leak',
  avatar: '🗿',
  type: 'static',
  color: '#ef4444',
  level: 3,
  xp: 0,
  maxXp: 180,
  hp: 110,
  maxHp: 110,
  energy: 100,
  attack: 28,
  defense: 22,
  speed: 8,
  moves: [
    {
      id: 'm_golem_stomp',
      name: 'Corrupted Monolith Stomp',
      type: 'static',
      power: 26,
      cost: 15,
      description: 'Stomps heavy static stone feet, radiating digital shockwaves.',
      soundType: 'glitch_hit'
    },
    {
      id: 'm_desync_quake',
      name: 'Sub-Static Quake',
      type: 'static',
      power: 38,
      cost: 30,
      description: 'Discharges a high-voltage pulse of raw analog snow and desync noise.',
      soundType: 'glitch_hit'
    }
  ]
};

export const FUSED_CHIMERA: StreamSpirit = {
  id: 'spirit_cyber_chimera',
  name: 'Omni-Harmony Chimera',
  title: 'World Symphony Hybrid',
  vibeTag: '#WorldSymphonyMashup',
  species: 'Ascended Biological Synthesis',
  instrument: 'Violin Bow Wings + Sitar Neck + Woofer Chest',
  originTradition: 'Global Musical Convergence',
  avatar: '🐯✨',
  type: 'cosmic',
  color: '#f43f5e',
  level: 3,
  xp: 0,
  maxXp: 300,
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
      description: 'Blends classical violin bows, sitar bends, and sub-bass drops into a cleansing beam! [SHATTERS GLITCHES]',
      effectiveness: 'Critical vs GLITCH',
      soundType: 'cosmic_burst'
    },
    {
      id: 'm_super_arpeggio',
      name: 'Omni-Resonance Concerto',
      type: 'symphonic',
      power: 48,
      cost: 25,
      description: 'Conducts all integrated world instruments in an unstoppable harmonious laser.',
      effectiveness: 'Universal Resonance',
      soundType: 'violin_staccato'
    }
  ]
};

export const BOSS_SIGNAL_OVERLORD = {
  id: 'boss_signal_overlord',
  name: 'DEAD CHANNEL 000',
  title: 'The Static Anomaly',
  type: 'static' as const,
  avatar: '📺👾',
  hp: 180,
  maxHp: 180,
  attack: 22,
  glitchIntensity: 1.0,
  moves: [
    {
      id: 'b_static_burst',
      name: 'Analog Snow Storm',
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
    title: 'Neon Cafe Barista & Sound Mentor',
    x: 1360,
    y: 1370,
    sprite: 'aria',
    color: '#38bdf8',
    actionType: 'talk',
    dialogue: [
      "Welcome to Cadence Plaza! ☕ Notice how our Harmonimals are living, breathing instruments?",
      "To reach Desolation Ridge in the northwest, you must overcome the impenetrable Sonic Vines blocking the mountain path.",
      "The vines resonate with discordant static. You'll need high-resonance global harmonies to dissolve them!",
      "Visit Barnaby down at Port Resonata to the south, and explore the Whispering Bamboo Grove to the east.",
      "Here is how the Global Genre wheel turns:",
      "🎻 SYMPHONIC (Violin) overpowers 🎹 SYNTH (Chiptune)!",
      "🎹 SYNTH overpowers 🪕 GLOBAL (Sitar & Taiko)!",
      "🪕 GLOBAL overpowers 🎷 JAZZ (Saxophone), and 🎷 JAZZ pierces 🎻 SYMPHONIC!"
    ]
  },
  {
    id: 'npc_dj_otter',
    name: 'DJ Otter',
    title: 'World Vinyl Collector',
    x: 1880,
    y: 1370,
    sprite: 'dj_otter',
    color: '#fbbf24',
    actionType: 'talk',
    dialogue: [
      "Yo! Welcome to the Vinyl Den! 💽",
      "If you want to clear the rogue static, tune into the 3 cultural sound stations in town:",
      "🎻 Allegro-Owl (Violin-Winged Owl) near the cafe terrace,",
      "🪕 Sitar-Swan (Gourd-Bodied Veena Swan) at the center fountain,",
      "🥁 Taiko-Tanuki (Belly-Drum Matsuri Raccoon) in the Eastern Bamboo Grove!",
      "Master their frequencies to build the ultimate world playlist!"
    ]
  },
  {
    id: 'npc_jax',
    name: 'Jax',
    title: 'The Underground Punk',
    x: 600,
    y: 450,
    sprite: 'jax',
    color: '#c084fc',
    actionType: 'battle_jax',
    dialogue: [
      "Halt right there. I guard Desolation Ridge, and nobody passes without proving their rhythm.",
      "Dead Channel 000 is raging just beyond that Glitch Gate behind me. It wiped out my band's entire soundstage.",
      "You fought your way through the Sonic Vines and gathered the world's frequencies... but can you match my raw overdrive?",
      "Duel my Sub-Woofer Bass-Hound! If you can synchronize with my bass drops, we'll storm the Glitch Gate together!"
    ]
  },
  {
    id: 'npc_gate',
    name: 'Glitch Gate',
    title: 'The Static Anomaly Rift',
    x: 600,
    y: 320,
    sprite: 'glitch_gate',
    color: '#ef4444',
    actionType: 'talk',
    dialogue: [
      "⚠️ The Glitch Gate is howling with volatile analog static!",
      "Duel Jax at Desolation Ridge first to synchronize frequencies before attempting to breach."
    ]
  },
  {
    id: 'npc_maestro',
    name: 'Maestro Owl',
    title: 'Conservatory Grand Master',
    x: 1600,
    y: 1340,
    sprite: 'maestro_owl',
    color: '#a855f7',
    actionType: 'talk',
    dialogue: [
      "Hoo-hoo! The acoustic balance of our world is severely disturbed by the Dead Channel.",
      "I am testing the harmonic mastery of all traveling Streamers. Have you tuned into the Baroque Violin and Indian Sitar stations here in town?",
      "To breach the static barriers, seek the Harmonic Tuning Fork and the Frequency Crystals hidden across the realm.",
      "Once your playlist resonates with multiple cultural traditions, even the ancient colossus in the Northeast Ruins will yield!"
    ]
  },
  {
    id: 'npc_pelican',
    name: 'Barnaby',
    title: 'Harbor Master Pelican',
    x: 600,
    y: 2050,
    sprite: 'pelican',
    color: '#38bdf8',
    actionType: 'talk',
    dialogue: [
      "Squawk! Welcome to Port Resonata and the Tidal Dunes!",
      "Keep an ear out along the shoreline sands. Word is a legendary Golden Vinyl washed ashore nearby—it gives a massive Max HP boost!",
      "Wild Steel-Pandas and Bit-Bugs roam the southern coastline. Battling them will sharpen your squad's frequency before you head north!",
      "If you're aiming for the Ancient Ruins or the Ridge, make sure your lead Harmonimal is well-tuned."
    ]
  },
  {
    id: 'npc_spark',
    name: 'Spark',
    title: 'Master Audio Engineer & Cable Runner',
    x: 2450,
    y: 1350,
    sprite: 'spark',
    color: '#f59e0b',
    actionType: 'talk',
    dialogue: [
      "Check 1-2, check 1-2! Signals are peaking in the red across the Whispering Bamboo Grove! ⚡",
      "I'm patching heavy-gauge audio cables to shield the eastern sound grid from Dead Channel's desync waves.",
      "The ancient stone lanterns here illuminate hidden harmonic frequencies. Tune into the Taiko drum circle nearby!",
      "Head further northeast to the Sound Ruins if you dare—there's an Overdrive Energy Battery waiting for a worthy streamer."
    ]
  }
];

export const RIVAL_JAX = {
  name: 'Jax',
  title: 'The Underground Punk',
  dialogueDefeat: [
    "Whoa... okay, your timing is clean and your rhythm is sharp. I respect that!",
    "My Sub-Woofer Bass-Hound and I are officially joining your active squad! 🐶🎸",
    "We're linked and ready, but Dead Channel 000 is a massive anomaly. Take time to explore Cadence Plaza!",
    "Battle wild static glitches on the beach to level up your squad, and discover the 3 cultural sound stations in town.",
    "Whenever you're ready for the final battle, step up to the Glitch Gate to breach the static storm together!"
  ]
};

// 3 Distinct Cultural Sound Ripples across the Realm
export const TOWN_SOUND_RIPPLES: SoundRipple[] = [
  {
    id: 'ripple_cafe',
    x: 1350,
    y: 1500,
    challengeType: 'waveform_slider',
    spirit: ALLEGRO_OWL_SPIRIT, // European Baroque Classical (Violin-Winged Owl)
    discovered: false
  },
  {
    id: 'ripple_fountain',
    x: 1600,
    y: 1560,
    challengeType: 'call_response',
    spirit: SITAR_SWAN_SPIRIT, // Indian Classical (Gourd-Bodied Sitar Swan)
    discovered: false
  },
  {
    id: 'ripple_vinyl',
    x: 2600,
    y: 1400,
    challengeType: 'rhythm_pulse',
    spirit: TAIKO_TANUKI_SPIRIT, // Japanese Matsuri (Belly-Drum Taiko Tanuki)
    discovered: false
  }
];

// Roaming Wild Static Glitch & Monster Encounters Across the 5 Regions
export const TOWN_WILD_GLITCHES: WildGlitchEntity[] = [
  {
    id: 'glitch_beach_1',
    name: 'Wild Bit-Bug',
    x: 400,
    y: 2100,
    spirit: BIT_BUG_SPIRIT,
    defeated: false,
    spawnOrigin: { x: 400, y: 2100, radius: 180 },
    wanderTimer: 0
  },
  {
    id: 'glitch_beach_2',
    name: 'Wild Noise-Mote',
    x: 450,
    y: 550,
    spirit: NOISE_MOTE_SPIRIT,
    defeated: false,
    spawnOrigin: { x: 450, y: 550, radius: 180 },
    wanderTimer: 0
  },
  {
    id: 'glitch_pier',
    name: 'Wild Steel-Panda',
    x: 750,
    y: 2050,
    spirit: STEEL_PANDA_SPIRIT,
    defeated: false,
    spawnOrigin: { x: 750, y: 2050, radius: 200 },
    wanderTimer: 0
  },
  {
    id: 'glitch_grove',
    name: 'Wild Kora-Gazelle',
    x: 2550,
    y: 1650,
    spirit: KORA_GAZELLE_SPIRIT,
    defeated: false,
    spawnOrigin: { x: 2550, y: 1650, radius: 200 },
    wanderTimer: 0
  },
  {
    id: 'glitch_ruins',
    name: 'Wild Glitch-Golem',
    x: 2550,
    y: 500,
    spirit: GLITCH_GOLEM_SPIRIT,
    defeated: false,
    spawnOrigin: { x: 2550, y: 500, radius: 200 },
    wanderTimer: 0
  }
];

export interface WildSpawnZone {
  id: string;
  name: string;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  possibleSpirits: StreamSpirit[];
}

export const WILD_SPAWN_ZONES: WildSpawnZone[] = [
  {
    id: 'zone_beach',
    name: 'Port Resonata Tidal Dunes',
    minX: 250,
    maxX: 850,
    minY: 1950,
    maxY: 2150,
    possibleSpirits: [BIT_BUG_SPIRIT, STEEL_PANDA_SPIRIT]
  },
  {
    id: 'zone_grove',
    name: 'Whispering Bamboo Thickets',
    minX: 2300,
    maxX: 2900,
    minY: 1400,
    maxY: 1800,
    possibleSpirits: [NOISE_MOTE_SPIRIT, KORA_GAZELLE_SPIRIT]
  },
  {
    id: 'zone_ruins',
    name: 'Ancient Sound Ruins',
    minX: 2400,
    maxX: 2900,
    minY: 350,
    maxY: 750,
    possibleSpirits: [GLITCH_GOLEM_SPIRIT, BIT_BUG_SPIRIT]
  },
  {
    id: 'zone_ridge',
    name: 'Desolation Ridge',
    minX: 350,
    maxX: 850,
    minY: 450,
    maxY: 700,
    possibleSpirits: [NOISE_MOTE_SPIRIT, BIT_BUG_SPIRIT]
  }
];

// Scattered Collectible Items Across the Realm
export const TOWN_ITEMS: CollectibleItem[] = [
  {
    id: 'item_tuning_fork',
    name: 'Harmonic Tuning Fork',
    icon: '🍴',
    x: 1260,
    y: 1580,
    type: 'tuning_fork',
    description: 'A pristine silver tuning fork resonating at concert pitch 440 Hz.',
    effect: '+5 ATK Permanent Buff',
    collected: false
  },
  {
    id: 'item_golden_vinyl',
    name: 'Golden Vinyl Record',
    icon: '📀',
    x: 450,
    y: 2120,
    type: 'golden_vinyl',
    description: 'A legendary master recording preserving pristine analog groove fidelity.',
    effect: '+20 Max HP Permanent Buff',
    collected: false
  },
  {
    id: 'item_frequency_crystal',
    name: 'Frequency Crystal',
    icon: '💎',
    x: 2800,
    y: 1250,
    type: 'frequency_crystal',
    description: 'A shimmering crystalline prism that refracts sonic frequencies into pure energy.',
    effect: '+10 Max HP & +3 ATK Buff',
    collected: false
  },
  {
    id: 'item_energy_battery',
    name: 'Overdrive Energy Battery',
    icon: '🔋',
    x: 2750,
    y: 450,
    type: 'energy_battery',
    description: 'A supercharged lithium-core battery packed with pure musical overdrive.',
    effect: '+15 Max HP & +10 DEF Buff',
    collected: false
  }
];

// World Obstacles across the 3200x2400 Realm
export const WORLD_OBSTACLES: WorldObstacle[] = [
  // Natural Physical Boundaries (North Mountain Ridge & East Palisades)
  { type: 'box', x: 0, y: 0, w: 3200, h: 100, name: 'Northern Mountain Ridge' },
  { type: 'box', x: 3100, y: 0, w: 100, h: 2400, name: 'Eastern Bamboo Palisades' },

  // Western Contoured Sea Cliffs
  { type: 'box', x: 0, y: 0, w: 120, h: 1980, name: 'Western Sea Cliffs' },

  // South Ocean Waters (Walkable pier jetty exclusion handled in collision engine)
  { type: 'water', direction: 'south', value: 2200, name: 'Ocean South' },

  // Buildings
  { type: 'box', x: 1230, y: 1180, w: 260, h: 160, name: 'Neon Cafe' },
  { type: 'box', x: 1780, y: 1180, w: 260, h: 160, name: 'Vinyl Den' },

  // Fountain
  { type: 'circle', x: 1600, y: 1450, radius: 52, name: 'Harmony Fountain' },

  // Plaza Perimeter Trees (radius: 18)
  { type: 'circle', x: 1140, y: 1200, radius: 18, name: 'Plaza Tree NW' },
  { type: 'circle', x: 1140, y: 1400, radius: 18, name: 'Plaza Tree W' },
  { type: 'circle', x: 1140, y: 1600, radius: 18, name: 'Plaza Tree SW' },
  { type: 'circle', x: 2120, y: 1200, radius: 18, name: 'Plaza Tree NE' },
  { type: 'circle', x: 2120, y: 1600, radius: 18, name: 'Plaza Tree SE' },

  // Lampposts in plaza (radius: 16)
  { type: 'circle', x: 1280, y: 1380, radius: 16, name: 'Plaza Lamppost NW' },
  { type: 'circle', x: 1920, y: 1380, radius: 16, name: 'Plaza Lamppost NE' },
  { type: 'circle', x: 1280, y: 1620, radius: 16, name: 'Plaza Lamppost SW' },
  { type: 'circle', x: 1920, y: 1620, radius: 16, name: 'Plaza Lamppost SE' },
  { type: 'circle', x: 1600, y: 1260, radius: 16, name: 'Plaza Lamppost North' },
  { type: 'circle', x: 1600, y: 1640, radius: 16, name: 'Plaza Lamppost South' },

  // Stone lanterns in bamboo grove (radius: 14)
  { type: 'circle', x: 2380, y: 1280, radius: 14, name: 'Bamboo Stone Lantern 1' },
  { type: 'circle', x: 2680, y: 1280, radius: 14, name: 'Bamboo Stone Lantern 2' },
  { type: 'circle', x: 2450, y: 1600, radius: 14, name: 'Bamboo Stone Lantern 3' },
  { type: 'circle', x: 2750, y: 1600, radius: 14, name: 'Bamboo Stone Lantern 4' },

  // Palm tree trunks on beach (radius: 20)
  { type: 'circle', x: 280, y: 2050, radius: 20, name: 'Beach Palm 1' },
  { type: 'circle', x: 480, y: 2080, radius: 20, name: 'Beach Palm 2' },
  { type: 'circle', x: 780, y: 2040, radius: 20, name: 'Beach Palm 3' },
  { type: 'circle', x: 1020, y: 2070, radius: 20, name: 'Beach Palm 4' },
  { type: 'circle', x: 1300, y: 2060, radius: 20, name: 'Beach Palm 5' },

  // Bamboo thickets (radius: 18 - carefully placed with wide walkways)
  { type: 'circle', x: 2320, y: 1140, radius: 18, name: 'Bamboo Thicket 1' },
  { type: 'circle', x: 2520, y: 1180, radius: 18, name: 'Bamboo Thicket 2' },
  { type: 'circle', x: 2720, y: 1140, radius: 18, name: 'Bamboo Thicket 3' },
  { type: 'circle', x: 2520, y: 1420, radius: 18, name: 'Bamboo Thicket 4' }, // Shifted east for open western passage
  { type: 'circle', x: 2680, y: 1520, radius: 18, name: 'Bamboo Thicket 5' },
  { type: 'circle', x: 2840, y: 1460, radius: 18, name: 'Bamboo Thicket 6' },
  { type: 'circle', x: 2500, y: 1720, radius: 18, name: 'Bamboo Thicket 7' },
  { type: 'circle', x: 2700, y: 1700, radius: 18, name: 'Bamboo Thicket 8' },

  // Ancient stone ruin pillars in canyon & ruins (radius: 24)
  { type: 'circle', x: 2300, y: 400, radius: 24, name: 'Ruin Pillar 1' },
  { type: 'circle', x: 2520, y: 360, radius: 24, name: 'Ruin Pillar 2' },
  { type: 'circle', x: 2740, y: 420, radius: 24, name: 'Ruin Pillar 3' },
  { type: 'circle', x: 2420, y: 600, radius: 24, name: 'Ruin Pillar 4' },
  { type: 'circle', x: 2620, y: 640, radius: 24, name: 'Ruin Pillar 5' },
  { type: 'circle', x: 2820, y: 580, radius: 24, name: 'Ruin Pillar 6' },
  { type: 'circle', x: 400, y: 400, radius: 24, name: 'Ridge Pillar 1' },
  { type: 'circle', x: 800, y: 400, radius: 24, name: 'Ridge Pillar 2' }
];
