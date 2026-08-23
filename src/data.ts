import { CollectibleItem, NPCEntity, MusicalShrine, StreamSpirit, WildGlitchEntity, WorldObstacle } from './types';

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

// --- CUSTOMIZATION PALETTES & PRESETS ---
export const PLAYER_PALETTES: Record<import('./types').PlayerPaletteId, import('./types').PlayerPalette> = {
  neon_cyan: {
    id: 'neon_cyan',
    name: 'Neon Cyan (Default)',
    jacketColor: '#f43f5e',     // Neon Coral Jacket
    headphoneColor: '#06b6d4',  // Cyan Cans
    hairColor: '#ca8a04',       // Amber Blonde
    vibeGlowColor: '#06b6d4'
  },
  cyber_magenta: {
    id: 'cyber_magenta',
    name: 'Cyber Magenta',
    jacketColor: '#ec4899',     // Hot Pink Jacket
    headphoneColor: '#f472b6',  // Pastel Magenta Cans
    hairColor: '#f59e0b',       // Golden Orange
    vibeGlowColor: '#ec4899'
  },
  sunset_gold: {
    id: 'sunset_gold',
    name: 'Sunset Gold',
    jacketColor: '#ea580c',     // Sunset Orange Jacket
    headphoneColor: '#fbbf24',  // Solar Gold Cans
    hairColor: '#b91c1c',       // Crimson Red
    vibeGlowColor: '#fbbf24'
  },
  emerald_synth: {
    id: 'emerald_synth',
    name: 'Emerald Synth',
    jacketColor: '#059669',     // Emerald Jacket
    headphoneColor: '#34d399',  // Mint Neon Cans
    hairColor: '#047857',       // Forest Green
    vibeGlowColor: '#10b981'
  },
  lavender_dream: {
    id: 'lavender_dream',
    name: 'Lavender Dream',
    jacketColor: '#7c3aed',     // Royal Violet Jacket
    headphoneColor: '#c084fc',  // Lavender Cans
    hairColor: '#f43f5e',       // Rose Pink
    vibeGlowColor: '#a855f7'
  }
};

export const CHIME_CAT_PALETTES: Record<import('./types').CatPaletteId, import('./types').CatPalette> = {
  classic_cyan: {
    id: 'classic_cyan',
    name: 'Classic Ivory & Pastel Blue',
    bodyColor: '#38bdf8',       // Sky Cyan
    earColor: '#ec4899',        // Neon Pink Inner Ears
    auraColor: '#38bdf8',
    keyColor: '#ffffff',        // Ivory Keys
    jackColor: '#fbbf24',       // Gold Audio Jack
    tailColor: '#38bdf8'
  },
  synthwave_magenta: {
    id: 'synthwave_magenta',
    name: '80s Synthwave Magenta & Gold',
    bodyColor: '#d946ef',       // Fuchsia Body
    earColor: '#fbbf24',        // Solar Yellow Ears
    auraColor: '#f43f5e',       // Red-Pink Glow
    keyColor: '#fef08a',        // Backlit Gold Keys
    jackColor: '#ec4899',       // Neon Pink Jack
    tailColor: '#d946ef'
  },
  vaporwave_lavender: {
    id: 'vaporwave_lavender',
    name: 'Vaporwave Lavender & Teal',
    bodyColor: '#a855f7',       // Soft Purple Body
    earColor: '#2dd4bf',        // Teal Ears
    auraColor: '#06b6d4',       // Cyan Aura
    keyColor: '#e2e8f0',        // Glitch Silver Keys
    jackColor: '#2dd4bf',       // Teal Jack
    tailColor: '#a855f7'
  },
  darkmode_neon: {
    id: 'darkmode_neon',
    name: 'Dark Mode Neon Green',
    bodyColor: '#1e293b',       // Matte Carbon Body
    earColor: '#22c55e',        // Laser Green Ears
    auraColor: '#4ade80',       // Cyber Green Glow
    keyColor: '#0f172a',        // Obsidian Keys
    jackColor: '#4ade80',       // Green LED Jack
    tailColor: '#22c55e'
  }
};

export const DEFAULT_PLAYER_TITLES = [
  'Novice Streamer',
  'Frequency Nomad',
  'Synthwave DJ',
  'Audio-Alchemist',
  'Beat Voyager',
  'Harmonic Pioneer'
];

// --- ZONE MAP CONFIGURATIONS ---
export const ZONE_CONFIGS: Record<import('./types').ZoneId, import('./types').ZoneMapConfig> = {
  plaza: {
    id: 'plaza',
    name: 'Cadence Plaza',
    subtitle: 'Heart of the Soundstream & Crossroads of Traditions',
    width: 3200,
    height: 2400,
    ambientTrack: 'town',
    themeColor: '#38bdf8',
    defaultSpawn: { x: 1500, y: 1400, dir: 'up' },
    transitions: [
      // South -> Beach
      { id: 'tr_plaza_to_beach', targetZone: 'beach', targetSpawn: { x: 1080, y: 120, dir: 'down' }, bounds: { x: 1540, y: 2200, w: 120, h: 80 }, promptText: 'To Port Resonata Dunes' },
      // Southeast -> Sangeet
      { id: 'tr_plaza_to_sangeet', targetZone: 'sangeet', targetSpawn: { x: 120, y: 280, dir: 'right' }, bounds: { x: 3080, y: 1900, w: 100, h: 120 }, promptText: 'To Sangeet Lotus Sanctuary' },
      // East -> Bamboo
      { id: 'tr_plaza_to_bamboo', targetZone: 'bamboo', targetSpawn: { x: 120, y: 720, dir: 'right' }, bounds: { x: 3080, y: 1380, w: 100, h: 120 }, promptText: 'To Whispering Bamboo Forest' },
      // Northeast -> Ruins
      { id: 'tr_plaza_to_ruins', targetZone: 'ruins', targetSpawn: { x: 120, y: 1420, dir: 'right' }, bounds: { x: 3080, y: 200, w: 100, h: 120 }, promptText: 'To Ancient Sound Ruins' },
      // Northwest -> Ridge
      { id: 'tr_plaza_to_ridge', targetZone: 'ridge', targetSpawn: { x: 1850, y: 1220, dir: 'left' }, bounds: { x: 20, y: 200, w: 100, h: 120 }, promptText: 'To Desolation Ridge' },
      // Cafe Doorway
      { id: 'tr_plaza_to_cafe', targetZone: 'cafe', targetSpawn: { x: 320, y: 340, dir: 'up' }, bounds: { x: 1340, y: 1320, w: 40, h: 30 }, promptText: 'Enter Neon Cafe' },
      // Vinyl Den Doorway
      { id: 'tr_plaza_to_vinyl', targetZone: 'vinyl_den', targetSpawn: { x: 320, y: 340, dir: 'up' }, bounds: { x: 1890, y: 1320, w: 40, h: 30 }, promptText: 'Enter Vinyl Den' }
    ],
    obstacles: [
      { type: 'box', x: 0, y: 0, w: 3200, h: 100, name: 'Northern Mountain Ridge' },
      { type: 'box', x: 0, y: 0, w: 120, h: 2400, name: 'Western Sea Cliffs' },
      { type: 'box', x: 3080, y: 0, w: 120, h: 2400, name: 'Eastern Boundary Cliffs' },
      { type: 'water', direction: 'south', value: 2200, name: 'Southern Ocean Surf' },
      { type: 'box', x: 1230, y: 1180, w: 260, h: 160, name: 'Neon Cafe' },
      { type: 'box', x: 1780, y: 1180, w: 260, h: 160, name: 'Vinyl Den' },
      { type: 'circle', x: 1600, y: 1450, radius: 52, name: 'Harmony Fountain' },
      { type: 'circle', x: 1140, y: 1200, radius: 18, name: 'Plaza Tree NW' },
      { type: 'circle', x: 2060, y: 1200, radius: 18, name: 'Plaza Tree NE' }
    ]
  },

  beach: {
    id: 'beach',
    name: 'Port Resonata & Coastal Raga Dunes',
    subtitle: 'Tidal Surfs, Microtonal Drones & Calypso Grooves',
    width: 2200,
    height: 2400,
    ambientTrack: 'beach',
    themeColor: '#f59e0b',
    defaultSpawn: { x: 1080, y: 120, dir: 'down' },
    transitions: [
      // North -> Plaza
      { id: 'tr_beach_to_plaza', targetZone: 'plaza', targetSpawn: { x: 900, y: 1300, dir: 'up' }, bounds: { x: 980, y: 0, w: 200, h: 60 }, promptText: 'To Cadence Plaza' },
      // East -> Sangeet
      { id: 'tr_beach_to_sangeet', targetZone: 'sangeet', targetSpawn: { x: 120, y: 820, dir: 'right' }, bounds: { x: 2140, y: 650, w: 60, h: 160 }, promptText: 'To Sangeet Lotus Sanctuary' }
    ],
    obstacles: [
      { type: 'box', x: 0, y: 0, w: 2200, h: 60, name: 'North Dunes Bluff' },
      { type: 'box', x: 0, y: 0, w: 60, h: 2400, name: 'West Sandbar Cliff' },
      { type: 'water', direction: 'south', value: 2200, name: 'Ocean Surf South' },
      { type: 'circle', x: 280, y: 1100, radius: 20, name: 'Beach Palm 1' },
      { type: 'circle', x: 480, y: 1120, radius: 20, name: 'Beach Palm 2' },
      { type: 'circle', x: 780, y: 1080, radius: 20, name: 'Beach Palm 3' },
      { type: 'circle', x: 1020, y: 1110, radius: 20, name: 'Beach Palm 4' },
      { type: 'circle', x: 1300, y: 1100, radius: 20, name: 'Beach Palm 5' }
    ]
  },

  sangeet: {
    id: 'sangeet',
    name: 'Sangeet Lotus Sanctuary',
    subtitle: 'Vedic Highlands & Resonant Sitar Stepped Ghats',
    width: 2000,
    height: 1600,
    ambientTrack: 'sangeet',
    themeColor: '#ea580c',
    defaultSpawn: { x: 120, y: 280, dir: 'right' },
    transitions: [
      // Northwest -> Plaza
      { id: 'tr_sangeet_to_plaza', targetZone: 'plaza', targetSpawn: { x: 1680, y: 1180, dir: 'left' }, bounds: { x: 0, y: 200, w: 60, h: 160 }, promptText: 'To Cadence Plaza' },
      // West -> Beach
      { id: 'tr_sangeet_to_beach', targetZone: 'beach', targetSpawn: { x: 2080, y: 720, dir: 'left' }, bounds: { x: 0, y: 750, w: 60, h: 160 }, promptText: 'To Port Resonata Dunes' },
      // Northeast -> Bamboo
      { id: 'tr_sangeet_to_bamboo', targetZone: 'bamboo', targetSpawn: { x: 120, y: 1320, dir: 'right' }, bounds: { x: 1940, y: 300, w: 60, h: 160 }, promptText: 'To Whispering Bamboo Forest' }
    ],
    obstacles: [
      { type: 'box', x: 0, y: 0, w: 2000, h: 60, name: 'North Himalayan Foothills' },
      { type: 'box', x: 0, y: 1540, w: 2000, h: 60, name: 'South Sanctuary Wall' },
      { type: 'box', x: 750, y: 700, w: 500, h: 350, name: 'Sacred Lotus Pool' },
      { type: 'circle', x: 600, y: 600, radius: 24, name: 'Sandstone Pillar NW' },
      { type: 'circle', x: 1400, y: 600, radius: 24, name: 'Sandstone Pillar NE' }
    ]
  },

  bamboo: {
    id: 'bamboo',
    name: 'Whispering Bamboo Forest',
    subtitle: 'Ancient Torii Arches & Matsuri Taiko Rhythms',
    width: 2000,
    height: 1600,
    ambientTrack: 'bamboo',
    themeColor: '#10b981',
    defaultSpawn: { x: 120, y: 720, dir: 'right' },
    transitions: [
      // West -> Plaza
      { id: 'tr_bamboo_to_plaza', targetZone: 'plaza', targetSpawn: { x: 1680, y: 700, dir: 'left' }, bounds: { x: 0, y: 650, w: 60, h: 160 }, promptText: 'To Cadence Plaza' },
      // Southwest -> Sangeet
      { id: 'tr_bamboo_to_sangeet', targetZone: 'sangeet', targetSpawn: { x: 1880, y: 380, dir: 'left' }, bounds: { x: 0, y: 1250, w: 60, h: 160 }, promptText: 'To Sangeet Lotus Sanctuary' },
      // North -> Ruins
      { id: 'tr_bamboo_to_ruins', targetZone: 'ruins', targetSpawn: { x: 1050, y: 1480, dir: 'up' }, bounds: { x: 950, y: 0, w: 160, h: 60 }, promptText: 'To Ancient Sound Ruins' }
    ],
    obstacles: [
      { type: 'box', x: 1940, y: 0, w: 60, h: 1600, name: 'East Bamboo Palisades' },
      { type: 'circle', x: 450, y: 400, radius: 22, name: 'Bamboo Thicket 1' },
      { type: 'circle', x: 750, y: 480, radius: 22, name: 'Bamboo Thicket 2' },
      { type: 'circle', x: 1350, y: 420, radius: 22, name: 'Bamboo Thicket 3' },
      { type: 'circle', x: 1650, y: 550, radius: 22, name: 'Bamboo Thicket 4' },
      { type: 'circle', x: 500, y: 1150, radius: 22, name: 'Bamboo Thicket 5' },
      { type: 'circle', x: 1450, y: 1150, radius: 22, name: 'Bamboo Thicket 6' }
    ]
  },

  ruins: {
    id: 'ruins',
    name: 'Ancient Sound Ruins',
    subtitle: 'Baroque Marble Monoliths & Primordial Clef Terraces',
    width: 2200,
    height: 1600,
    ambientTrack: 'ruins',
    themeColor: '#a855f7',
    defaultSpawn: { x: 120, y: 1420, dir: 'right' },
    transitions: [
      // Southwest -> Plaza
      { id: 'tr_ruins_to_plaza', targetZone: 'plaza', targetSpawn: { x: 1680, y: 220, dir: 'left' }, bounds: { x: 0, y: 1350, w: 60, h: 160 }, promptText: 'To Cadence Plaza' },
      // South -> Bamboo
      { id: 'tr_ruins_to_bamboo', targetZone: 'bamboo', targetSpawn: { x: 1020, y: 120, dir: 'down' }, bounds: { x: 950, y: 1540, w: 160, h: 60 }, promptText: 'To Whispering Bamboo Forest' },
      // Northwest -> Ridge (Sonic Vines gate)
      { id: 'tr_ruins_to_ridge', targetZone: 'ridge', targetSpawn: { x: 1850, y: 820, dir: 'left' }, bounds: { x: 0, y: 300, w: 60, h: 160 }, promptText: 'To Desolation Ridge Gorge' }
    ],
    obstacles: [
      { type: 'box', x: 0, y: 0, w: 2200, h: 60, name: 'Northern Escarpment' },
      { type: 'box', x: 2140, y: 0, w: 60, h: 1600, name: 'Eastern Escarpment' },
      { type: 'circle', x: 800, y: 400, radius: 28, name: 'Fluted Marble Pillar 1' },
      { type: 'circle', x: 1400, y: 400, radius: 28, name: 'Fluted Marble Pillar 2' },
      { type: 'circle', x: 800, y: 1100, radius: 28, name: 'Fluted Marble Pillar 3' },
      { type: 'circle', x: 1400, y: 1100, radius: 28, name: 'Fluted Marble Pillar 4' }
    ]
  },

  ridge: {
    id: 'ridge',
    name: 'Desolation Ridge',
    subtitle: 'Jax\'s Overdrive Stage & The Glitch Gate Breach',
    width: 2000,
    height: 1400,
    ambientTrack: 'ridge',
    themeColor: '#f43f5e',
    defaultSpawn: { x: 1850, y: 1220, dir: 'left' },
    transitions: [
      // Southeast -> Plaza
      { id: 'tr_ridge_to_plaza', targetZone: 'plaza', targetSpawn: { x: 120, y: 220, dir: 'right' }, bounds: { x: 1940, y: 1150, w: 60, h: 160 }, promptText: 'To Cadence Plaza' },
      // East -> Ruins
      { id: 'tr_ridge_to_ruins', targetZone: 'ruins', targetSpawn: { x: 120, y: 380, dir: 'right' }, bounds: { x: 1940, y: 750, w: 60, h: 160 }, promptText: 'To Ancient Sound Ruins' }
    ],
    obstacles: [
      { type: 'box', x: 0, y: 0, w: 2000, h: 80, name: 'Ridge Peak Wall' },
      { type: 'box', x: 0, y: 0, w: 60, h: 1400, name: 'Western Canyon Wall' },
      { type: 'circle', x: 600, y: 550, radius: 32, name: 'Amp Monolith West' },
      { type: 'circle', x: 1400, y: 550, radius: 32, name: 'Amp Monolith East' }
    ]
  },

  cafe: {
    id: 'cafe',
    name: 'Neon Cafe',
    subtitle: 'Aria\'s Lo-Fi Sound Lab & Coffee Haven',
    width: 640,
    height: 440,
    ambientTrack: 'cafe',
    themeColor: '#38bdf8',
    defaultSpawn: { x: 320, y: 340, dir: 'up' },
    transitions: [
      { id: 'tr_cafe_exit', targetZone: 'plaza', targetSpawn: { x: 1360, y: 1380, dir: 'down' }, bounds: { x: 280, y: 370, w: 80, h: 50 }, promptText: 'Exit to Cadence Plaza' }
    ],
    obstacles: [
      { type: 'box', x: 180, y: 130, w: 280, h: 50, name: 'Espresso Bar Counter' },
      { type: 'box', x: 140, y: 240, w: 80, h: 50, name: 'Customer Table West' },
      { type: 'box', x: 420, y: 240, w: 80, h: 50, name: 'Customer Table East' }
    ]
  },

  vinyl_den: {
    id: 'vinyl_den',
    name: 'The Vinyl Den',
    subtitle: 'DJ Otter\'s Analog Archive & Rare Wax',
    width: 640,
    height: 440,
    ambientTrack: 'vinyl_den',
    themeColor: '#fbbf24',
    defaultSpawn: { x: 320, y: 340, dir: 'up' },
    transitions: [
      { id: 'tr_vinyl_exit', targetZone: 'plaza', targetSpawn: { x: 1910, y: 1380, dir: 'down' }, bounds: { x: 280, y: 370, w: 80, h: 50 }, promptText: 'Exit to Cadence Plaza' }
    ],
    obstacles: [
      { type: 'box', x: 180, y: 130, w: 280, h: 50, name: 'Turntable Desk Counter' },
      { type: 'box', x: 140, y: 240, w: 80, h: 50, name: 'Classical Record Crate' },
      { type: 'box', x: 420, y: 240, w: 80, h: 50, name: 'Global Record Crate' }
    ]
  }
};

export const TOWN_NPCS: NPCEntity[] = [
  // --- CADENCE PLAZA ---
  {
    id: 'door_cafe',
    name: 'Neon Cafe Entrance',
    title: 'Aria\'s Cozy Sound Cafe [SPACE]',
    x: 1360,
    y: 1340,
    zone: 'plaza',
    sprite: 'door_cafe',
    color: '#38bdf8',
    actionType: 'enter_building',
    dialogue: [
      "Stepping inside the cozy Neon Cafe...",
      "The smell of fresh dark roast and warm lo-fi chords fills the air!"
    ]
  },
  {
    id: 'door_vinyl',
    name: 'Vinyl Den Entrance',
    title: 'DJ Otter\'s Rare Wax & Gear [SPACE]',
    x: 1910,
    y: 1340,
    zone: 'plaza',
    sprite: 'door_vinyl',
    color: '#fbbf24',
    actionType: 'enter_building',
    dialogue: [
      "Stepping inside the Vinyl Den...",
      "Walls of legendary vinyl masters and analog gear glow under neon lights!"
    ]
  },
  {
    id: 'npc_maestro',
    name: 'Maestro Owl',
    title: 'Conservatory Grand Master',
    x: 900,
    y: 620,
    zone: 'plaza',
    sprite: 'maestro_owl',
    color: '#a855f7',
    actionType: 'talk',
    pet: {
      name: 'Cello-Fawn',
      species: 'Sonata Fawn',
      sprite: 'fawn',
      instrument: 'Baroque Cello'
    },
    dialogue: [
      "Hoo-hoo! The acoustic tragedy... it is worse than I feared! The pirate anomaly Dead Channel 000 has corrupted our island's entire analog broadcast grid.",
      "My beloved Cello-Fawn, along with all the villagers' acoustic music pets, was muted by the analog desync wave. We cannot broadcast their frequencies!",
      "Ah, but you! You carry the direct-synthesis signature of the Synthwave Coast! Your Chime-Cat's electronic carrier wave is completely immune to the local grid corruption.",
      "Another mainland visiting streamer—a fiery punk named Jax—passed through earlier with an 808 Sub-Woofer Bass-Hound. He charged up to Desolation Ridge to hold the Glitch Gate!",
      "Visit the ancient cultural shrines across the biomes. Overcome their linear challenges, attune your cat's frequency to their primordial roots, then seek out Jax. Only a united melody and bassline can save our island!"
    ]
  },

  // --- PORT RESONATA & COASTAL RAGA DUNES ---
  {
    id: 'npc_pelican',
    name: 'Barnaby',
    title: 'Harbor Master Pelican',
    x: 550,
    y: 950,
    zone: 'beach',
    sprite: 'pelican',
    color: '#38bdf8',
    actionType: 'talk',
    pet: {
      name: 'Accordion-Gull',
      species: 'Sea Gull',
      sprite: 'gull',
      instrument: 'Squeeze-Box Accordion'
    },
    dialogue: [
      "Squawk! Welcome to Port Resonata and the Coastal Raga Dunes!",
      "The sea breeze carries microtonal ocean waves and calypso rhythms from distant archipelagos.",
      "If you're seeking the Indian Classical sitar traditions, follow the eastern tidal path to the grand Sangeet Lotus Sanctuary!",
      "Keep an ear out along our shoreline sands. Word is a legendary Golden Vinyl washed ashore nearby—it gives a massive Max HP boost!"
    ]
  },
  {
    id: 'challenge_tide_shells',
    name: 'Harmonic Sea Conches',
    title: 'Tidal Resonance Attunement [SPACE]',
    x: 1100,
    y: 2120,
    zone: 'beach',
    sprite: 'puzzle_beacon',
    color: '#38bdf8',
    actionType: 'challenge_side',
    dialogue: [
      "🐚 The iridescent sea conches hum with the tidal surf!",
      "You listen closely to their three distinct harmonic resonance pitches: Major Third, Fifth, and Octave.",
      "The harmonic chime resonates through the sand, unearthing a sunken Golden Vinyl artifact (+20 Max HP)!"
    ]
  },

  // --- SANGEET LOTUS SANCTUARY (SOUTH ASIAN / VEDIC HIGHLANDS) ---
  {
    id: 'npc_ravi',
    name: 'Pandit Ravi',
    title: 'Sitar Virtuoso & Vedic Scholar',
    x: 1000,
    y: 580,
    zone: 'sangeet',
    sprite: 'ravi',
    color: '#ea580c',
    actionType: 'talk',
    dialogue: [
      "Namaste, visiting streamer. Welcome to the Sangeet Lotus Sanctuary.",
      "Here in the Vedic Highlands, music is not mere entertainment—it is Nada Brahma, the primordial sound of the cosmos.",
      "To awaken the Sacred Sitar-Swan at our central stepped ghats, you must overcome two ancient challenges:",
      "First, tune the Tanpura Drone Beacons to lock the fundamental Sa and Pa frequencies. Second, purify the wild Steel-Panda guardian in musical combat!",
      "Only then will the Sitar-Swan attune with your Chime-Cat's carrier wave."
    ]
  },
  {
    id: 'challenge_sangeet_linear1',
    name: 'Tanpura Drone Beacons',
    title: 'Sa-Pa Fundamental Attunement [SPACE]',
    x: 450,
    y: 850,
    zone: 'sangeet',
    sprite: 'puzzle_beacon',
    color: '#ea580c',
    actionType: 'challenge_linear1',
    dialogue: [
      "🪕 The ancient copper Tanpura Beacons resonate with deep microtonal overtone drones.",
      "You adjust the tuning beads to harmonize the fundamental 'Sa' (Tonic) and 'Pa' (Fifth) drone waves.",
      "A golden acoustic bridge illuminates across the lotus pool! (Challenge 1/2 Cleared)"
    ]
  },
  {
    id: 'challenge_ghat_bells',
    name: 'Vedic Temple Chimes',
    title: 'Raga Yaman Octave Bell Alignment [SPACE]',
    x: 1500,
    y: 800,
    zone: 'sangeet',
    sprite: 'puzzle_beacon',
    color: '#fbbf24',
    actionType: 'challenge_side',
    dialogue: [
      "🔔 Sacred bronze bells hanging from the sandstone chhatri pavilion catch the breeze.",
      "You strike the seven tiered bells in the ascent of Raga Yaman (Ni Re Ga Ma Dha Ni Sa).",
      "The divine resonance crystalline harmony coalesces into a rare Frequency Crystal (+10 HP, +3 ATK)!"
    ]
  },

  // --- WHISPERING BAMBOO FOREST ---
  {
    id: 'npc_spark',
    name: 'Spark',
    title: 'Master Audio Engineer & Cable Runner',
    x: 400,
    y: 720,
    zone: 'bamboo',
    sprite: 'spark',
    color: '#f59e0b',
    actionType: 'talk',
    dialogue: [
      "Check 1-2, check 1-2! Signals are peaking in the red across the Whispering Bamboo Forest! ⚡",
      "I'm patching heavy-gauge audio cables to shield the eastern sound grid from Dead Channel's desync waves.",
      "Deep in the bamboo thickets lies the ancient Matsuri Taiko Drum Shrine. But the path is guarded by two rhythm trials:",
      "First, invert the Phase at the Vermilion Torii Gate. Second, pass the Tremolo Rhythm Gate to summon Taiko-Tanuki!",
      "There's also a set of Pentatonic Wind Chimes off the beaten trail if you want a permanent power boost."
    ]
  },
  {
    id: 'challenge_bamboo_linear1',
    name: 'Torii Phase Inverter',
    title: 'Phase Cancellation Relay [SPACE]',
    x: 900,
    y: 720,
    zone: 'bamboo',
    sprite: 'puzzle_torii',
    color: '#10b981',
    actionType: 'challenge_linear1',
    dialogue: [
      "⛩️ The great vermilion Torii arch hums with out-of-phase destructive interference.",
      "You flip the polarity switch on your Vibe-Phone, achieving 180° Phase Alignment with the bamboo stalks.",
      "The static mist dissipates, clearing the way to the inner Taiko glade! (Challenge 1/2 Cleared)"
    ]
  },
  {
    id: 'challenge_wind_chimes',
    name: 'Bamboo Wind Chimes',
    title: 'Ascending Pentatonic Alignment [SPACE]',
    x: 1200,
    y: 500,
    zone: 'bamboo',
    sprite: 'puzzle_beacon',
    color: '#10b981',
    actionType: 'challenge_side',
    dialogue: [
      "🎐 The hollow bamboo and bronze wind chimes sway in the mountain breeze.",
      "You strike the chimes in ascending pentatonic order (Do - Re - Mi - Sol - La).",
      "The forest resonates with tranquil peace, revealing a hidden Harmonic Tuning Fork (+5 ATK)!"
    ]
  },

  // --- ANCIENT SOUND RUINS ---
  {
    id: 'npc_lyra',
    name: 'Sage Lyra',
    title: 'Ancient Acoustic Scholar',
    x: 600,
    y: 850,
    zone: 'ruins',
    sprite: 'lyra',
    color: '#38bdf8',
    actionType: 'talk',
    dialogue: [
      "Greetings, traveler. You stand within the Ancient Sound Ruins, where the realm's primordial chords were first etched into marble.",
      "The Symphonic Violin Shrine rests upon our northern stone terrace, guarded by two ancient challenges:",
      "First, align the Quartz Focus Crystals across the Grecian amphitheater. Second, purify the colossal Glitch-Golem!",
      "Once defeated, the Glitch-Golem's thorny Sonic Vines blocking the northwest gorge to Desolation Ridge will dissolve forever."
    ]
  },
  {
    id: 'challenge_ruins_linear1',
    name: 'Quartz Obelisk Array',
    title: 'Harmonic Beam Focus [SPACE]',
    x: 1400,
    y: 750,
    zone: 'ruins',
    sprite: 'puzzle_obelisk',
    color: '#a855f7',
    actionType: 'challenge_linear1',
    dialogue: [
      "🏛️ Three colossal marble obelisks hum with subterranean acoustic currents.",
      "You rotate the quartz focus prisms until their harmonic resonance merges into a single pure violet beam.",
      "The amphitheater gate unlocks, granting access to the Symphonic Violin Shrine! (Challenge 1/2 Cleared)"
    ]
  },
  {
    id: 'challenge_echo_pillars',
    name: 'Amphitheater Floor Tiles',
    title: 'Cadence Harmonic Stepping [SPACE]',
    x: 1400,
    y: 1100,
    zone: 'ruins',
    sprite: 'puzzle_obelisk',
    color: '#a855f7',
    actionType: 'challenge_side',
    dialogue: [
      "🏛️ Ancient Grecian stone floor tiles resonate with acoustic pitch when stepped upon.",
      "You tread the authentic cadence progression: Tonic $\\rightarrow$ Subdominant $\\rightarrow$ Dominant $\\rightarrow$ Tonic.",
      "A concealed vault slides open in the floor, revealing an Overdrive Energy Battery (+15 HP, +10 DEF)!"
    ]
  },

  // --- DESOLATION RIDGE ---
  {
    id: 'npc_jax',
    name: 'Jax',
    title: 'The Underground Punk',
    x: 1000,
    y: 600,
    zone: 'ridge',
    sprite: 'jax',
    color: '#c084fc',
    actionType: 'battle_jax',
    dialogue: [
      "Halt! Step back from the perimeter! I've got Desolation Ridge locked down with pure 808 low-end.",
      "Hey... wait a second. That glowing key-spine... you're a streamer from Metro Sound City! You took the midnight ferry from the Synthwave Coast too, didn't you?",
      "When Dead Channel 000 hijacked the island's analog broadcast towers and muted everyone's pets, my Bass-Hound and I charged up here. Our digital electronic carrier wave is immune to the static.",
      "I've been using Bass-Hound's sub-woofer shockwaves to keep that howling Glitch Gate from swallowing the island... but raw bass alone can't shatter the anomaly core.",
      "I need your chiptune lead synth and those world shrine frequencies you've gathered! But before we link playlists, let's see if your timing can survive my overdrive bass drops! Duel me!"
    ]
  },
  {
    id: 'npc_gate',
    name: 'Glitch Gate',
    title: 'The Static Anomaly Rift [SPACE]',
    x: 1000,
    y: 350,
    zone: 'ridge',
    sprite: 'glitch_gate',
    color: '#ef4444',
    actionType: 'talk',
    dialogue: [
      "⚠️ The Glitch Gate is howling with volatile analog static and rolling CRT scanlines!",
      "Jax is holding the perimeter with heavy 808 sub-bass. Duel Jax at Desolation Ridge first to synchronize your mainland frequencies before attempting to breach."
    ]
  },
  {
    id: 'challenge_ridge_linear1',
    name: 'Overdrive Sub-Switch',
    title: 'Voltage LFO Dampener [SPACE]',
    x: 600,
    y: 750,
    zone: 'ridge',
    sprite: 'puzzle_switch',
    color: '#f43f5e',
    actionType: 'challenge_linear1',
    dialogue: [
      "⚡ A massive vacuum-tube switchboard crackles with high-voltage overdrive.",
      "You engage the low-frequency oscillator dampener, stabilizing the volcanic ground tremors.",
      "The amplifier stack powers up to maximum volume, preparing the stage for Jax's duel! (Challenge 1/2 Cleared)"
    ]
  },

  // --- INTERIOR: NEON CAFE ---
  {
    id: 'prop_cafe_mirror',
    name: 'Streamer Mirror & Synth Bench',
    title: 'Calibrate Persona & Chime-Cat [SPACE]',
    x: 100,
    y: 180,
    zone: 'cafe',
    sprite: 'prop_mirror',
    color: '#38bdf8',
    actionType: 'customize',
    interior: 'cafe',
    dialogue: [
      "You step up to Aria's studio vanity mirror and modular synth bench. ✨",
      "Calibrate your streamer outfit, headphones, call-sign, and Chime-Cat's keybed aura & oscillator timbre!"
    ]
  },
  {
    id: 'npc_aria',
    name: 'Aria',
    title: 'Neon Cafe Barista & Sound Mentor',
    x: 320,
    y: 180,
    zone: 'cafe',
    sprite: 'aria',
    color: '#38bdf8',
    actionType: 'order_coffee',
    interior: 'cafe',
    pet: {
      name: 'Latte-Chirp',
      species: 'Melody Songbird',
      sprite: 'bird',
      instrument: 'Flute / Piccolo Whistle'
    },
    dialogue: [
      "Good morning, Streamer! What can I brew for you on this glorious festival morning? ☕",
      "Latte-Chirp and I are getting the morning espresso dialed in. Order a Harmonic Latte anytime to top off your squad's HP and energy!",
      "Chat with Maya and Leo at the lounge tables, or test your look in the Streamer Mirror [C] before heading outside to the plaza."
    ],
    dialoguePostAlert: [
      "Oh Streamer... I'm still in shock! When that static snow crashed the broadcast towers, my poor Latte-Chirp was instantly knocked offline... 😭",
      "Your Chime-Cat's direct digital carrier wave from Metro Sound City is the only signal standing strong against Dead Channel 000.",
      "Jax ran toward Desolation Ridge to barricade the glitch rift with his 808 Bass-Hound.",
      "Drink this Harmonic Latte to restore your squad's HP. Seek the ancient shrines across the biomes and help Jax breach the gate before our music is lost forever!"
    ]
  },
  {
    id: 'npc_maya',
    name: 'Maya',
    title: 'Lo-Fi Beatmaker Customer',
    x: 180,
    y: 260,
    zone: 'cafe',
    sprite: 'maya',
    color: '#ec4899',
    actionType: 'talk',
    interior: 'cafe',
    pet: {
      name: 'Mellow-Moth',
      species: 'Vinyl Dust Moth',
      sprite: 'moth',
      instrument: 'Tape Hiss & Chimes'
    },
    dialogue: [
      "Hey there, fellow streamer! ☕ Listening to the warm tape-hiss beats in here is pure bliss.",
      "My partner Mellow-Moth loves resting by the warm tube amp, fluttering its wings in time with the rhythm.",
      "Are you performing in the Soundwave Festival showcase later? I can't wait to hear your Chime-Cat's chiptune lead on the main stage!"
    ],
    dialoguePostAlert: [
      "Mellow-Moth... where did you go?! The connection just dissolved into white noise when that emergency alert buzzed... 😭",
      "The island's analog towers are completely scrambled! But your Chime-Cat's digital carrier wave from Metro Sound City is still glowing bright!",
      "Legend says the ancient musical shrines embody the primordial roots of Symphonic, Sangeet, and Matsuri traditions. If you sample them, you might just break Dead Channel's hold and bring our pets back!"
    ]
  },
  {
    id: 'npc_leo',
    name: 'Leo',
    title: 'Modular Synth Collector Customer',
    x: 460,
    y: 260,
    zone: 'cafe',
    sprite: 'leo',
    color: '#06b6d4',
    actionType: 'talk',
    interior: 'cafe',
    pet: {
      name: 'Volt-Fawn',
      species: 'Voltage Resonance Fawn',
      sprite: 'fawn',
      instrument: 'Resonant Filter Sweeps'
    },
    dialogue: [
      "Whoa, is that a Chime-Cat?! The analog keybed along its spine has incredible voltage response! 🎹",
      "My Volt-Fawn is humming along with the cafe's synth bassline. We took the midnight ferry from the Synthwave Coast for the festival.",
      "Jax and his 808 Bass-Hound were on the same boat—he was playing loud punk bass riffs on the deck the entire crossing!",
      "If you want to check out rare records, DJ Otter's Vinyl Den is right next door in the plaza."
    ],
    dialoguePostAlert: [
      "Volt-Fawn vanished! The whole frequency grid collapsed into distorted static! ⚡😱",
      "Jax grabbed his bass and sprinted toward Desolation Ridge to hold off the glitch rift. Since you two are from the mainland, your pets seem immune to this local analog interference!",
      "You've got to team up with Jax and gather the island's harmony archetypes to purge Dead Channel 000!"
    ]
  },
  {
    id: 'door_cafe_exit',
    name: 'Cafe Exit',
    title: 'Step out into Cadence Plaza [SPACE]',
    x: 320,
    y: 370,
    zone: 'cafe',
    sprite: 'door_cafe',
    color: '#38bdf8',
    actionType: 'exit_building',
    interior: 'cafe',
    dialogue: [
      "Stepping out into the sunny morning air of Cadence Plaza..."
    ]
  },

  // --- INTERIOR: VINYL DEN ---
  {
    id: 'npc_dj_otter',
    name: 'DJ Otter',
    title: 'World Vinyl Collector & DJ',
    x: 320,
    y: 180,
    zone: 'vinyl_den',
    sprite: 'dj_otter',
    color: '#fbbf24',
    actionType: 'browse_shop',
    interior: 'vinyl_den',
    pet: {
      name: 'Vinyl-Pup',
      species: 'Groove Terrier',
      sprite: 'pup',
      instrument: 'Turntable Scratch'
    },
    dialogue: [
      "Yo! Welcome to the Vinyl Den! 💽",
      "Vinyl-Pup and I are prepping the crates for today's opening festival set.",
      "Feel free to flip through the record crates on the sides for rare tuning artifacts and frequency power-ups!",
      "When the festival starts, I'm dropping a brand new global mashup set at the main stage!"
    ],
    dialoguePostAlert: [
      "Vinyl-Pup got sucked into the static wave! My turntables are just spitting out white noise! 💽💥",
      "Dead Channel 000 is jamming every frequency on the island. Only your Chime-Cat can cut through that noise!",
      "Take whatever tuning gear you need from the shop crates to power up your moves!"
    ]
  },
  {
    id: 'npc_crate_classical',
    name: 'Classical & Symphonic Crates',
    title: 'Harmonic Tuning Stash [SPACE]',
    x: 180,
    y: 260,
    zone: 'vinyl_den',
    sprite: 'door_vinyl',
    color: '#a855f7',
    actionType: 'browse_shop',
    interior: 'vinyl_den',
    dialogue: [
      "📦 Flipping through rare vinyl crates...",
      "Found pristine master recordings of Baroque violin concertos and orchestral overtures!"
    ]
  },
  {
    id: 'npc_crate_global',
    name: 'Global Traditions & Bass Crates',
    title: 'Frequency Crystal Stash [SPACE]',
    x: 460,
    y: 260,
    zone: 'vinyl_den',
    sprite: 'door_vinyl',
    color: '#f59e0b',
    actionType: 'browse_shop',
    interior: 'vinyl_den',
    dialogue: [
      "📦 Flipping through global tradition crates...",
      "Found authentic Ravi Shankar sitar pressings, Japanese Taiko master tapes, and heavy 808 sub-bass vinyl!"
    ]
  },
  {
    id: 'door_vinyl_exit',
    name: 'Vinyl Den Exit',
    title: 'Step out into Cadence Plaza [SPACE]',
    x: 320,
    y: 370,
    zone: 'vinyl_den',
    sprite: 'door_vinyl',
    color: '#fbbf24',
    actionType: 'exit_building',
    interior: 'vinyl_den',
    dialogue: [
      "Stepping out into Cadence Plaza..."
    ]
  }
];

export const RIVAL_JAX = {
  name: 'Jax',
  title: 'The Underground Punk',
  dialogueDefeat: [
    "HELL YEAH! That key-spine glissando cut right through my heaviest fuzz distortion! Your timing is razor-sharp!",
    "Consider my Sub-Woofer Bass-Hound officially linked to your master playlist! 🐶🎸",
    "With your high-frequency melodic synth and my seismic 808 rhythm section, we have the complete electronic carrier wave.",
    "In battle against Dead Channel 000, trigger our PLAYLIST BLEND MASHUP to fuse our pets into the mighty Cyber-Fuzz Chimera! Let's kick down this Glitch Gate!"
  ]
};

// 3 Ancient Musical Tradition Shrines across the Realm
export const TOWN_SOUND_RIPPLES: MusicalShrine[] = [
  {
    id: 'shrine_sitar',
    name: 'Sacred Sitar & Lotus Shrine',
    tradition: 'Indian Classical Veena/Sitar',
    biome: 'Sangeet Lotus Sanctuary',
    zone: 'sangeet',
    x: 1000,
    y: 900,
    challengeType: 'call_response',
    spirit: SITAR_SWAN_SPIRIT, // Indian Classical (Gourd-Bodied Sitar Swan)
    discovered: false
  },
  {
    id: 'shrine_taiko',
    name: 'Matsuri Taiko Drum Shrine',
    tradition: 'Japanese Festival Matsuri',
    biome: 'Whispering Bamboo Forest',
    zone: 'bamboo',
    x: 1500,
    y: 800,
    challengeType: 'rhythm_pulse',
    spirit: TAIKO_TANUKI_SPIRIT, // Japanese Matsuri (Belly-Drum Taiko Tanuki)
    discovered: false
  },
  {
    id: 'shrine_violin',
    name: 'Symphonic Violin Shrine',
    tradition: 'European Baroque Classical',
    biome: 'Ancient Sound Ruins',
    zone: 'ruins',
    x: 1100,
    y: 350,
    challengeType: 'waveform_slider',
    spirit: ALLEGRO_OWL_SPIRIT, // European Baroque Classical (Violin-Winged Owl)
    discovered: false
  }
];

// Roaming Wild Static Glitch & Monster Encounters
export const TOWN_WILD_GLITCHES: WildGlitchEntity[] = [
  {
    id: 'glitch_beach_1',
    name: 'Wild Bit-Bug',
    zone: 'beach',
    x: 1200,
    y: 650,
    spirit: BIT_BUG_SPIRIT,
    defeated: false,
    spawnOrigin: { x: 1200, y: 650, radius: 180 },
    wanderTimer: 0
  },
  {
    id: 'glitch_pier',
    name: 'Wild Steel-Panda',
    zone: 'beach',
    x: 750,
    y: 900,
    spirit: STEEL_PANDA_SPIRIT,
    defeated: false,
    spawnOrigin: { x: 750, y: 900, radius: 200 },
    wanderTimer: 0
  },
  {
    id: 'glitch_sangeet',
    name: 'Wild Noise-Mote',
    zone: 'sangeet',
    x: 1450,
    y: 800,
    spirit: NOISE_MOTE_SPIRIT,
    defeated: false,
    spawnOrigin: { x: 1450, y: 800, radius: 180 },
    wanderTimer: 0
  },
  {
    id: 'glitch_grove',
    name: 'Wild Kora-Gazelle',
    zone: 'bamboo',
    x: 1400,
    y: 1300,
    spirit: KORA_GAZELLE_SPIRIT,
    defeated: false,
    spawnOrigin: { x: 1400, y: 1300, radius: 200 },
    wanderTimer: 0
  },
  {
    id: 'glitch_ruins',
    name: 'Wild Glitch-Golem',
    zone: 'ruins',
    x: 1100,
    y: 850,
    spirit: GLITCH_GOLEM_SPIRIT,
    defeated: false,
    spawnOrigin: { x: 1100, y: 850, radius: 200 },
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
    maxX: 1850,
    minY: 450,
    maxY: 1150,
    possibleSpirits: [BIT_BUG_SPIRIT, STEEL_PANDA_SPIRIT]
  },
  {
    id: 'zone_sangeet',
    name: 'Sangeet Lotus Sanctuary',
    minX: 300,
    maxX: 1700,
    minY: 400,
    maxY: 1200,
    possibleSpirits: [NOISE_MOTE_SPIRIT, STEEL_PANDA_SPIRIT]
  },
  {
    id: 'zone_grove',
    name: 'Whispering Bamboo Thickets',
    minX: 300,
    maxX: 1700,
    minY: 400,
    maxY: 1400,
    possibleSpirits: [NOISE_MOTE_SPIRIT, KORA_GAZELLE_SPIRIT]
  },
  {
    id: 'zone_ruins',
    name: 'Ancient Sound Ruins',
    minX: 400,
    maxX: 1800,
    minY: 350,
    maxY: 1250,
    possibleSpirits: [GLITCH_GOLEM_SPIRIT, BIT_BUG_SPIRIT]
  },
  {
    id: 'zone_ridge',
    name: 'Desolation Ridge',
    minX: 350,
    maxX: 1650,
    minY: 450,
    maxY: 1100,
    possibleSpirits: [NOISE_MOTE_SPIRIT, BIT_BUG_SPIRIT]
  }
];

// Scattered Collectible Items Across the Realm
export const TOWN_ITEMS: CollectibleItem[] = [
  {
    id: 'item_tuning_fork',
    name: 'Harmonic Tuning Fork',
    icon: '🍴',
    zone: 'plaza',
    x: 520,
    y: 980,
    type: 'tuning_fork',
    description: 'A pristine silver tuning fork resonating at concert pitch 440 Hz.',
    effect: '+5 ATK Permanent Buff',
    collected: false
  },
  {
    id: 'item_golden_vinyl',
    name: 'Golden Vinyl Record',
    icon: '📀',
    zone: 'beach',
    x: 1650,
    y: 1100,
    type: 'golden_vinyl',
    description: 'A legendary master recording preserving pristine analog groove fidelity.',
    effect: '+20 Max HP Permanent Buff',
    collected: false
  },
  {
    id: 'item_frequency_crystal',
    name: 'Frequency Crystal',
    icon: '💎',
    zone: 'sangeet',
    x: 1600,
    y: 400,
    type: 'frequency_crystal',
    description: 'A shimmering crystalline prism that refracts sonic frequencies into pure energy.',
    effect: '+10 Max HP & +3 ATK Buff',
    collected: false
  },
  {
    id: 'item_energy_battery',
    name: 'Overdrive Energy Battery',
    icon: '🔋',
    zone: 'ruins',
    x: 1800,
    y: 450,
    type: 'energy_battery',
    description: 'A supercharged lithium-core battery packed with pure musical overdrive.',
    effect: '+15 Max HP & +10 DEF Buff',
    collected: false
  }
];

// Legacy / Comprehensive World Obstacles (maintained for spatial consistency and unit tests)
export const WORLD_OBSTACLES: WorldObstacle[] = [
  { type: 'box', x: 0, y: 0, w: 3200, h: 100, name: 'Northern Mountain Ridge' },
  { type: 'box', x: 3100, y: 0, w: 100, h: 2400, name: 'Eastern Bamboo Palisades' },
  { type: 'box', x: 0, y: 0, w: 120, h: 2200, name: 'Western Sea Cliffs' },
  { type: 'box', x: 120, y: 840, w: 460, h: 80, name: 'Desolation Southwest Bluff' },
  { type: 'box', x: 820, y: 840, w: 260, h: 80, name: 'Desolation Southeast Bluff' },
  { type: 'box', x: 1040, y: 100, w: 80, h: 740, name: 'Desolation Eastern Escarpment' },
  { type: 'water', direction: 'south', value: 2200, name: 'Ocean South' },
  { type: 'box', x: 1230, y: 1180, w: 260, h: 160, name: 'Neon Cafe' },
  { type: 'box', x: 1780, y: 1180, w: 260, h: 160, name: 'Vinyl Den' },
  { type: 'circle', x: 1600, y: 1450, radius: 52, name: 'Harmony Fountain' },
  { type: 'circle', x: 1140, y: 1200, radius: 18, name: 'Plaza Tree NW' },
  { type: 'circle', x: 1140, y: 1400, radius: 18, name: 'Plaza Tree W' },
  { type: 'circle', x: 1140, y: 1600, radius: 18, name: 'Plaza Tree SW' },
  { type: 'circle', x: 2120, y: 1200, radius: 18, name: 'Plaza Tree NE' },
  { type: 'circle', x: 2120, y: 1600, radius: 18, name: 'Plaza Tree SE' },
  { type: 'circle', x: 1280, y: 1380, radius: 16, name: 'Plaza Lamppost NW' },
  { type: 'circle', x: 1920, y: 1380, radius: 16, name: 'Plaza Lamppost NE' },
  { type: 'circle', x: 1280, y: 1620, radius: 16, name: 'Plaza Lamppost SW' },
  { type: 'circle', x: 1920, y: 1620, radius: 16, name: 'Plaza Lamppost SE' },
  { type: 'circle', x: 1600, y: 1260, radius: 16, name: 'Plaza Lamppost North' },
  { type: 'circle', x: 1600, y: 1640, radius: 16, name: 'Plaza Lamppost South' },
  { type: 'circle', x: 2380, y: 1280, radius: 14, name: 'Bamboo Stone Lantern 1' },
  { type: 'circle', x: 2680, y: 1280, radius: 14, name: 'Bamboo Stone Lantern 2' },
  { type: 'circle', x: 2450, y: 1600, radius: 14, name: 'Bamboo Stone Lantern 3' },
  { type: 'circle', x: 2750, y: 1600, radius: 14, name: 'Bamboo Stone Lantern 4' },
  { type: 'circle', x: 280, y: 2050, radius: 20, name: 'Beach Palm 1' },
  { type: 'circle', x: 480, y: 2080, radius: 20, name: 'Beach Palm 2' },
  { type: 'circle', x: 780, y: 2040, radius: 20, name: 'Beach Palm 3' },
  { type: 'circle', x: 1020, y: 2070, radius: 20, name: 'Beach Palm 4' },
  { type: 'circle', x: 1300, y: 2060, radius: 20, name: 'Beach Palm 5' },
  { type: 'circle', x: 2320, y: 1140, radius: 18, name: 'Bamboo Thicket 1' },
  { type: 'circle', x: 2520, y: 1180, radius: 18, name: 'Bamboo Thicket 2' },
  { type: 'circle', x: 2720, y: 1140, radius: 18, name: 'Bamboo Thicket 3' },
  { type: 'circle', x: 2520, y: 1420, radius: 18, name: 'Bamboo Thicket 4' },
  { type: 'circle', x: 2680, y: 1520, radius: 18, name: 'Bamboo Thicket 5' },
  { type: 'circle', x: 2840, y: 1460, radius: 18, name: 'Bamboo Thicket 6' },
  { type: 'circle', x: 2500, y: 1720, radius: 18, name: 'Bamboo Thicket 7' },
  { type: 'circle', x: 2700, y: 1700, radius: 18, name: 'Bamboo Thicket 8' },
  { type: 'circle', x: 2300, y: 400, radius: 24, name: 'Ruin Pillar 1' },
  { type: 'circle', x: 2520, y: 360, radius: 24, name: 'Ruin Pillar 2' },
  { type: 'circle', x: 2740, y: 420, radius: 24, name: 'Ruin Pillar 3' },
  { type: 'circle', x: 2420, y: 600, radius: 24, name: 'Ruin Pillar 4' },
  { type: 'circle', x: 2620, y: 640, radius: 24, name: 'Ruin Pillar 5' },
  { type: 'circle', x: 2820, y: 580, radius: 24, name: 'Ruin Pillar 6' },
  { type: 'circle', x: 400, y: 400, radius: 24, name: 'Ridge Pillar 1' },
  { type: 'circle', x: 800, y: 400, radius: 24, name: 'Ridge Pillar 2' }
];

