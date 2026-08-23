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

export const TOWN_NPCS: NPCEntity[] = [
  // --- OVERWORLD VILLAGE & DOORS ---
  {
    id: 'door_cafe',
    name: 'Neon Cafe Entrance',
    title: 'Aria\'s Cozy Sound Cafe',
    x: 1360,
    y: 1340,
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
    title: 'DJ Otter\'s Rare Wax & Gear',
    x: 1910,
    y: 1340,
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
    x: 1600,
    y: 1340,
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
      "Hoo-hoo! The acoustic balance of our world is severely disturbed by the Dead Channel.",
      "My beloved Cello-Fawn was muted by the static desync. Only your Chime-Cat holds an uncorrupted carrier wave.",
      "Visit the 3 ancient musical shrines across the cultural biomes. Solve their acoustic tuning puzzles to sample their archetypes!",
      "Once an archetype is bonded to your cat's frequency, sample defeated wild monsters in battle to trigger glorious Harmonic Evolutions!"
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
    pet: {
      name: 'Accordion-Gull',
      species: 'Sea Gull',
      sprite: 'gull',
      instrument: 'Squeeze-Box Accordion'
    },
    dialogue: [
      "Squawk! Welcome to Port Resonata and the Tidal Dunes!",
      "The Sacred Sitar Shrine is resting out on the western sandbar just past my dock! 🪕",
      "Keep an ear out along the shoreline sands. Word is a legendary Golden Vinyl washed ashore nearby—it gives a massive Max HP boost!",
      "Wild Steel-Pandas and Bit-Bugs roam the southern coastline. Sample their harmonic stems in battle to supercharge your squad!"
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
      "Deep in the bamboo thickets to the east lies the ancient Matsuri Taiko Drum Shrine. Solve its pulse rhythm to awaken Taiko-Tanuki!",
      "Head further northeast to the Sound Ruins if you dare—there's an Overdrive Energy Battery waiting for a worthy streamer."
    ]
  },
  {
    id: 'npc_lyra',
    name: 'Sage Lyra',
    title: 'Ancient Acoustic Scholar',
    x: 2350,
    y: 480,
    sprite: 'lyra',
    color: '#38bdf8',
    actionType: 'talk',
    dialogue: [
      "Greetings, traveler. You stand within the Ancient Sound Ruins, where the realm's primordial chords were first etched into stone.",
      "The Symphonic Violin Shrine rests upon our northern stone terrace! Attune its harmonic wave slider to sample Allegro-Owl.",
      "A massive Wild Glitch-Golem roams the central altar, projecting thorny Sonic Vines that blockade the pass to Desolation Ridge.",
      "Take the Overdrive Energy Battery on the eastern terrace, sample the shrine archetype, and defeat the Glitch-Golem to dissolve the vines!"
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

  // --- SECONDARY BIOME CHALLENGES & PUZZLES ---
  {
    id: 'challenge_tide_shells',
    name: 'Harmonic Sea Conches',
    title: 'Tidal Resonance Attunement',
    x: 1100,
    y: 2120,
    sprite: 'door_cafe',
    color: '#38bdf8',
    actionType: 'talk',
    dialogue: [
      "🐚 The iridescent sea conches hum with the tidal surf!",
      "You listen closely to their three distinct harmonic resonance pitches: Major Third, Fifth, and Octave.",
      "The harmonic chime resonates through the sand, revealing a sunken Golden Vinyl artifact nearby!"
    ]
  },
  {
    id: 'challenge_wind_chimes',
    name: 'Bamboo Wind Chimes',
    title: 'Ascending Pentatonic Alignment',
    x: 2550,
    y: 1750,
    sprite: 'door_cafe',
    color: '#10b981',
    actionType: 'talk',
    dialogue: [
      "🎐 The hollow bamboo and bronze wind chimes sway in the mountain breeze.",
      "You strike the chimes in ascending pentatonic order (Do - Re - Mi - Sol - La).",
      "The forest resonates with tranquil peace, opening a secret stepping stone trail through the bamboo thickets!"
    ]
  },
  {
    id: 'challenge_echo_pillars',
    name: 'Primordial Tuning Obelisks',
    title: 'Echo Pillar Beam Calibration',
    x: 2400,
    y: 750,
    sprite: 'door_cafe',
    color: '#a855f7',
    actionType: 'talk',
    dialogue: [
      "🏛️ Three ancient stone obelisks hum with subterranean acoustic currents.",
      "You calibrate their quartz focus crystals until their acoustic echoes synchronize into a single pure beam.",
      "The resonant frequency disperses the dense sonic fog shrouding the northern terrace!"
    ]
  },

  // --- INTERIOR: NEON CAFE ---
  {
    id: 'npc_aria',
    name: 'Aria',
    title: 'Neon Cafe Barista & Sound Mentor',
    x: 320,
    y: 180,
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
      "Welcome to the Neon Cafe! ☕",
      "Here is our signature Harmonic Latte! It restores your party's energy and sharpens your rhythm timing.",
      "Feel free to chat with Maya and Leo at the tables, then head outside to explore the Soundwave Festival in Cadence Plaza!"
    ]
  },
  {
    id: 'npc_maya',
    name: 'Maya',
    title: 'Lo-Fi Beatmaker Customer',
    x: 180,
    y: 260,
    sprite: 'maya',
    color: '#ec4899',
    actionType: 'talk',
    interior: 'cafe',
    pet: {
      name: 'Mellow-Moth',
      species: 'Vinyl Dust Moth',
      sprite: 'bird',
      instrument: 'Tape Hiss & Chimes'
    },
    dialogue: [
      "Hey there, fellow streamer! ☕ Listening to the tape-hiss rain outside is pure bliss.",
      "Did you know each biome on the island houses an ancient musical shrine? Legend says they embody the primordial roots of Symphonic, Global, and Matsuri traditions.",
      "Make sure you explore every corner of the island—the cultural roots are what give our pets their magic!"
    ]
  },
  {
    id: 'npc_leo',
    name: 'Leo',
    title: 'Modular Synth Collector Customer',
    x: 460,
    y: 260,
    sprite: 'leo',
    color: '#06b6d4',
    actionType: 'talk',
    interior: 'cafe',
    dialogue: [
      "Whoa, is that a Chime-Cat?! The analog keybed along its spine has incredible voltage response! 🎹",
      "I came across the sea specifically for the annual Soundwave Festival. Everyone in Cadence Plaza is so welcoming.",
      "If you're looking for audio gear, check out DJ Otter's Vinyl Den right next door—he has rare pressings that boost Harmonimal frequency!"
    ]
  },
  {
    id: 'door_cafe_exit',
    name: 'Cafe Exit',
    title: 'Step out into Cadence Plaza',
    x: 320,
    y: 370,
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
      "Feel free to flip through the record crates on the sides for rare tuning artifacts and frequency power-ups!",
      "When the festival starts, I'm dropping a brand new global mashup set at the main stage!"
    ]
  },
  {
    id: 'npc_crate_classical',
    name: 'Classical & Symphonic Crates',
    title: 'Harmonic Tuning Stash',
    x: 180,
    y: 260,
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
    title: 'Frequency Crystal Stash',
    x: 460,
    y: 260,
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
    title: 'Step out into Cadence Plaza',
    x: 320,
    y: 370,
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
    "Whoa... okay, your timing is clean and your rhythm is sharp. I respect that!",
    "My Sub-Woofer Bass-Hound track is officially added to your master playlist! 🐶🎸",
    "We're linked and ready. In battle, you can sample my overdrive bass stem or trigger our Multipart Harmony Fusion!",
    "Whenever you're ready for the final battle, step up to the Glitch Gate to breach the static storm together!"
  ]
};

// 3 Ancient Musical Tradition Shrines across the Realm
export const TOWN_SOUND_RIPPLES: MusicalShrine[] = [
  {
    id: 'shrine_sitar',
    name: 'Sacred Sitar & Raga Shrine',
    tradition: 'Indian Classical Veena/Sitar',
    biome: 'Port Resonata Tidal Sands',
    x: 450,
    y: 2050,
    challengeType: 'call_response',
    spirit: SITAR_SWAN_SPIRIT, // Indian Classical (Gourd-Bodied Sitar Swan)
    discovered: false
  },
  {
    id: 'shrine_taiko',
    name: 'Matsuri Taiko Drum Shrine',
    tradition: 'Japanese Festival Matsuri',
    biome: 'Whispering Bamboo Grove',
    x: 2850,
    y: 1550,
    challengeType: 'rhythm_pulse',
    spirit: TAIKO_TANUKI_SPIRIT, // Japanese Matsuri (Belly-Drum Taiko Tanuki)
    discovered: false
  },
  {
    id: 'shrine_violin',
    name: 'Symphonic Violin Shrine',
    tradition: 'European Baroque Classical',
    biome: 'Ancient Sound Ruins',
    x: 2700,
    y: 360,
    challengeType: 'waveform_slider',
    spirit: ALLEGRO_OWL_SPIRIT, // European Baroque Classical (Violin-Winged Owl)
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
  { type: 'box', x: 0, y: 0, w: 120, h: 2200, name: 'Western Sea Cliffs' },

  // Desolation Ridge Enclosing Canyon Bluffs (Creates an airtight bottleneck pass at x: 580..820)
  { type: 'box', x: 120, y: 840, w: 460, h: 80, name: 'Desolation Southwest Bluff' },
  { type: 'box', x: 820, y: 840, w: 260, h: 80, name: 'Desolation Southeast Bluff' },
  { type: 'box', x: 1040, y: 100, w: 80, h: 740, name: 'Desolation Eastern Escarpment' },

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
