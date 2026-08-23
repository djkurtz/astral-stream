import {
  Harmonipet, Musician, RepertoirePiece, RivalEnsemble, WorldZone, WorldNPC, BattleMove, InstrumentId,
  InstrumentArtifact, LostScore, InspirationVista, PerformanceVenue, GameQuest,
  HarmoniDexEntry, ClefBadge
} from './types';

/* ---------------- STARTER INSTRUMENTS & PETS ---------------- */

export interface StarterOption {
  id: InstrumentId;
  name: string;
  sectionName: string;
  section: 'strings' | 'woodwinds' | 'brass' | 'percussion';
  description: string;
  pet: Harmonipet;
  baseStats: { technique: number; toneQuality: number; tempoStability: number; sightReading: number };
}

export const STARTER_OPTIONS: StarterOption[] = [
  {
    id: 'violin',
    name: 'Aria Violin',
    sectionName: 'Strings Section',
    section: 'strings',
    description: 'High agility, expressive vibrato, and resonant counterpoint melodies.',
    pet: {
      id: 'pet_swan',
      name: 'Allegro',
      species: 'Allegro Swan',
      sprite: 'swan',
      section: 'strings',
      instrumentName: 'Aria Violin',
      leitmotifSound: 'violin_pure',
      color: '#ec4899'
    },
    baseStats: { technique: 25, toneQuality: 22, tempoStability: 18, sightReading: 20 }
  },
  {
    id: 'silver_flute',
    name: 'Silver Concert Flute',
    sectionName: 'Woodwinds Section',
    section: 'woodwinds',
    description: 'Brisk staccato runs, airy overtones, and rapid embellishments.',
    pet: {
      id: 'pet_finch',
      name: 'Pip',
      species: 'Piccolo Finch',
      sprite: 'finch',
      section: 'woodwinds',
      instrumentName: 'Silver Concert Flute',
      leitmotifSound: 'flute_chirp',
      color: '#10b981'
    },
    baseStats: { technique: 22, toneQuality: 20, tempoStability: 20, sightReading: 24 }
  },
  {
    id: 'pocket_trumpet',
    name: 'Pocket Trumpet',
    sectionName: 'Brass Section',
    section: 'brass',
    description: 'Bold fanfares, bright projection, and dynamic fortissimo power.',
    pet: {
      id: 'pet_terrier',
      name: 'Buster',
      species: 'Fanfare Terrier',
      sprite: 'terrier',
      section: 'brass',
      instrumentName: 'Pocket Trumpet',
      leitmotifSound: 'trumpet_blare',
      color: '#eab308'
    },
    baseStats: { technique: 18, toneQuality: 26, tempoStability: 24, sightReading: 16 }
  },
  {
    id: 'snare_kit',
    name: 'Snare & Hi-Hat Kit',
    sectionName: 'Percussion Section',
    section: 'percussion',
    description: 'Unshakeable metronomic tempo, crisp polyrhythms, and groove stabilization.',
    pet: {
      id: 'pet_raccoon',
      name: 'Tempo',
      species: 'Beat Raccoon',
      sprite: 'raccoon',
      section: 'percussion',
      instrumentName: 'Snare & Hi-Hat Kit',
      leitmotifSound: 'drum_snap',
      color: '#8b5cf6'
    },
    baseStats: { technique: 20, toneQuality: 18, tempoStability: 30, sightReading: 18 }
  }
];

/* ---------------- BATTLE MOVES ---------------- */

export const BATTLE_MOVES: Record<string, BattleMove> = {
  // Strings
  counterpoint_weave: {
    id: 'counterpoint_weave',
    name: 'Counterpoint Weave',
    section: 'strings',
    power: 18,
    harmonyCost: 15,
    effect: 'resonance_boost',
    description: 'Weaves intricate melodic lines that elevate harmony and boost Tone Quality.'
  },
  vibrato_charm: {
    id: 'vibrato_charm',
    name: 'Vibrato Charm',
    section: 'strings',
    power: 24,
    harmonyCost: 25,
    effect: 'vibrato_charm',
    description: 'A lyrical, deeply moving phrase that captivates the opponent.'
  },

  // Woodwinds
  staccato_flutter: {
    id: 'staccato_flutter',
    name: 'Staccato Flutter',
    section: 'woodwinds',
    power: 16,
    harmonyCost: 10,
    effect: 'resonance_boost',
    description: 'Rapid, needle-sharp woodwind notes that slice through heavy chords.'
  },
  trill_mirage: {
    id: 'trill_mirage',
    name: 'Trill Mirage',
    section: 'woodwinds',
    power: 25,
    harmonyCost: 25,
    effect: 'vibrato_charm',
    description: 'A shimmering trill passage that dazzles the listener.'
  },

  // Brass
  fortissimo_fanfare: {
    id: 'fortissimo_fanfare',
    name: 'Fortissimo Fanfare',
    section: 'brass',
    power: 28,
    harmonyCost: 30,
    effect: 'fortissimo_burst',
    description: 'A thunderous brass burst that commands the hall and fills the harmony meter.'
  },
  mute_swell: {
    id: 'mute_swell',
    name: 'Harmonic Mute Swell',
    section: 'brass',
    power: 18,
    harmonyCost: 15,
    effect: 'tempo_lock',
    description: 'Warm, muted brass harmonies that anchor the acoustic balance.'
  },

  // Percussion
  syncopated_groove: {
    id: 'syncopated_groove',
    name: 'Syncopated Groove',
    section: 'percussion',
    power: 20,
    harmonyCost: 15,
    effect: 'tempo_lock',
    description: 'A catchy, tight rhythmic pattern that stabilizes the tempo.'
  },
  timpani_rumble: {
    id: 'timpani_rumble',
    name: 'Timpani Rumble',
    section: 'percussion',
    power: 26,
    harmonyCost: 25,
    effect: 'fortissimo_burst',
    description: 'Deep resonant percussion strikes that reverberate across the stage.'
  }
};

/* ---------------- REPERTOIRE PIECES ---------------- */

export const REPERTOIRE_DATABASE: RepertoirePiece[] = [
  {
    id: 'piece_minuet',
    title: 'Minuet in G Major',
    composer: 'Christian Petzold',
    genre: 'Baroque Dance',
    difficulty: 1,
    minEnsembleTier: 'solo',
    requiredSections: {},
    bpm: 110,
    chords: [
      { strings: [392, 493, 587], percussion: 'marimba' },
      { strings: [329, 392, 523], percussion: 'marimba' },
      { strings: [293, 369, 440], percussion: 'marimba' },
      { strings: [392, 493, 587], percussion: 'glockenspiel' }
    ],
    melody: [392, 587, 523, 493, 440, 392, 392, 440, 493, 523],
    description: 'A graceful and buoyant Baroque melody, perfect for soloists mastering phrase contour.',
    masteryXp: 100,
    isMastered: false
  },
  {
    id: 'piece_cavatina_duet',
    title: 'Cavatina Two-Part Invention',
    composer: 'Master Johann',
    genre: 'Classical Chamber',
    difficulty: 2,
    minEnsembleTier: 'duet',
    requiredSections: { strings: 1, woodwinds: 1 },
    bpm: 96,
    chords: [
      { strings: [349, 440, 523], winds: [698, 880] },
      { strings: [293, 349, 440], winds: [587, 698] },
      { strings: [261, 329, 392], winds: [523, 659] },
      { strings: [349, 440, 523], winds: [698, 880] }
    ],
    melody: [349, 440, 523, 698, 659, 587, 523, 440],
    description: 'An elegant counterpoint dialogue between Strings and Woodwinds.',
    masteryXp: 200,
    isMastered: false
  },
  {
    id: 'piece_bossa_trio',
    title: 'Sonora Sunset Serenade',
    composer: 'Antonio Gilberto',
    genre: 'Bossa Nova Trio',
    difficulty: 3,
    minEnsembleTier: 'trio',
    requiredSections: { strings: 1, woodwinds: 1, percussion: 1 },
    bpm: 120,
    chords: [
      { strings: [349, 440, 523, 659], winds: [587, 698], percussion: 'snare_kit' },
      { strings: [293, 349, 440, 523], winds: [523, 659], percussion: 'snare_kit' },
      { strings: [261, 329, 392, 493], winds: [440, 523], percussion: 'snare_kit' },
      { strings: [349, 440, 523, 659], winds: [587, 698], percussion: 'snare_kit' }
    ],
    melody: [523, 587, 659, 523, 440, 392, 349],
    description: 'A warm, breezy syncopated serenade showcasing guitar, saxophone, and brush snare.',
    masteryXp: 350,
    isMastered: false
  },
  {
    id: 'piece_starlight_quartet',
    title: 'Starlight String & Brass Quartet',
    composer: 'Wolfgang & Ludwig',
    genre: 'Classical Symphony',
    difficulty: 4,
    minEnsembleTier: 'quartet',
    requiredSections: { strings: 2, brass: 1, woodwinds: 1 },
    bpm: 132,
    chords: [
      { strings: [261, 329, 392], brass: [523, 659], winds: [783, 1046] },
      { strings: [220, 261, 329], brass: [440, 523], winds: [659, 880] },
      { strings: [174, 220, 261], brass: [349, 440], winds: [523, 698] },
      { strings: [196, 246, 293], brass: [392, 493], winds: [587, 783] }
    ],
    melody: [523, 523, 523, 659, 783, 659, 523],
    description: 'A triumphant 4-part conversation filled with regal brass calls and soaring violin passages.',
    masteryXp: 500,
    isMastered: false
  },
  {
    id: 'piece_ode_to_harmony',
    title: 'Ode to Harmony (Grand Finale)',
    composer: 'The First Maestro',
    genre: 'Grand Orchestral Masterwork',
    difficulty: 5,
    minEnsembleTier: 'orchestra',
    requiredSections: { strings: 2, woodwinds: 2, brass: 2, percussion: 2 },
    bpm: 140,
    chords: [
      { strings: [261, 329, 392, 523], winds: [659, 783, 1046], brass: [130, 261, 392], percussion: 'timpani' },
      { strings: [293, 349, 440, 587], winds: [698, 880, 1174], brass: [146, 293, 440], percussion: 'snare_kit' },
      { strings: [246, 293, 369, 493], winds: [587, 739, 987], brass: [123, 246, 369], percussion: 'timpani' },
      { strings: [261, 329, 392, 523], winds: [659, 783, 1046], brass: [130, 261, 392], percussion: 'glockenspiel' }
    ],
    melody: [659, 659, 698, 783, 783, 698, 659, 587, 523, 523, 587, 659, 659, 587, 587],
    description: 'The legendary masterwork of Sonora. Unites all 4 sections in glorious, transcendental polyphony.',
    masteryXp: 1000,
    isMastered: false
  }
];

/* ---------------- NPC MUSICIANS (RECRUITABLE) ---------------- */

export const RECRUITABLE_MUSICIANS: Musician[] = [
  {
    id: 'npc_clara',
    name: 'Clara',
    title: 'Virtuoso Violinist',
    avatar: '🎻',
    paletteColor: '#ec4899',
    instrumentId: 'violin',
    instrumentName: 'Concert Violin',
    section: 'strings',
    pet: {
      id: 'pet_swan_clara',
      name: 'Vibrato',
      species: 'Allegro Swan',
      sprite: 'swan',
      section: 'strings',
      instrumentName: 'Concert Violin',
      leitmotifSound: 'violin_pure',
      color: '#ec4899'
    },
    stats: { technique: 35, toneQuality: 40, tempoStability: 28, sightReading: 32 },
    level: 2,
    xp: 150,
    dialogue: [
      "Greetings! The acoustic resonance of Cavatina Village is simply sublime today.",
      "My partner Vibrato and I are seeking a dedicated chamber ensemble with true artistic vision.",
      "Would you care for a friendly Audition Duel? Let us test how well our motifs harmonize!"
    ],
    auditionDialogue: [
      "Let us begin! Show me your bow control and melodic phrasing!"
    ],
    recruitedDialogue: [
      "Splendid! Your phrasing was impeccable. Vibrato and I would be honored to join your ensemble!"
    ]
  },
  {
    id: 'npc_oliver',
    name: 'Oliver',
    title: 'Forest Flute Wandler',
    avatar: '🪈',
    paletteColor: '#10b981',
    instrumentId: 'silver_flute',
    instrumentName: 'Silver Concert Flute',
    section: 'woodwinds',
    pet: {
      id: 'pet_finch_oliver',
      name: 'Chirpy',
      species: 'Piccolo Finch',
      sprite: 'finch',
      section: 'woodwinds',
      instrumentName: 'Silver Flute',
      leitmotifSound: 'flute_chirp',
      color: '#10b981'
    },
    stats: { technique: 32, toneQuality: 30, tempoStability: 34, sightReading: 38 },
    level: 2,
    xp: 120,
    dialogue: [
      "Phew... practicing scales in the bamboo breeze always clears my tone.",
      "My Piccolo Finch, Chirpy, can match pitch with any songbird in the forest.",
      "If you're assembling a multi-part ensemble, a crisp woodwind lead is essential. Care to jam?"
    ],
    auditionDialogue: [
      "Listen closely to the wind's rapid tempo! Can you match my staccato cadence?"
    ],
    recruitedDialogue: [
      "Incredible breath support! Chirpy and I are packing our sheet music—we're on your team!"
    ]
  },
  {
    id: 'npc_baron',
    name: 'Baron Von Brass',
    title: 'Citadel Trumpet Captain',
    avatar: '🎺',
    paletteColor: '#eab308',
    instrumentId: 'pocket_trumpet',
    instrumentName: 'Golden Herald Trumpet',
    section: 'brass',
    pet: {
      id: 'pet_terrier_baron',
      name: 'Rally',
      species: 'Fanfare Terrier',
      sprite: 'terrier',
      section: 'brass',
      instrumentName: 'Herald Trumpet',
      leitmotifSound: 'trumpet_blare',
      color: '#eab308'
    },
    stats: { technique: 30, toneQuality: 45, tempoStability: 36, sightReading: 25 },
    level: 3,
    xp: 240,
    dialogue: [
      "Halt! You stand before the Brass Citadel. Only musicians with true projection may pass.",
      "Rally and I have heralded royal arrivals for a decade. Our fortissimo commands respect!",
      "Think your ensemble has the stamina to support my brass fanfares? Prove it in an Audition!"
    ],
    auditionDialogue: [
      "Hear the golden blare! Brace your ears for a true fortissimo swell!"
    ],
    recruitedDialogue: [
      "Ha! Outstanding tone! Your ensemble has genuine spine. Rally and I shall march with you!"
    ]
  },
  {
    id: 'npc_rita',
    name: 'Rhythm Rita',
    title: 'Mountain Snare Maestro',
    avatar: '🥁',
    paletteColor: '#8b5cf6',
    instrumentId: 'snare_kit',
    instrumentName: 'Custom Snare & Hi-Hat',
    section: 'percussion',
    pet: {
      id: 'pet_raccoon_rita',
      name: 'Groove',
      species: 'Beat Raccoon',
      sprite: 'raccoon',
      section: 'percussion',
      instrumentName: 'Custom Snare',
      leitmotifSound: 'drum_snap',
      color: '#8b5cf6'
    },
    stats: { technique: 38, toneQuality: 32, tempoStability: 48, sightReading: 28 },
    level: 3,
    xp: 280,
    dialogue: [
      "One, two, three, four! Tap your feet! You can't have harmony without a rock-solid pocket.",
      "Groove and I keep the pulse of Percussion Peaks running like clockwork.",
      "Want to see if you can hold your tempo under pressure? Let's take it to the practice stage!"
    ],
    auditionDialogue: [
      "Lock into the rhythm! Don't let your tempo rush or drag!"
    ],
    recruitedDialogue: [
      "Solid as a rock! That was right in the pocket. You've got yourself a drummer!"
    ]
  }
];

/* ---------------- RIVAL ENSEMBLES (CONCERT SHOWDOWNS) ---------------- */

export const RIVAL_ENSEMBLES: RivalEnsemble[] = [
  {
    id: 'rival_novice_buskers',
    name: 'The Cavatina Street Soloists',
    tier: 'solo',
    conductorName: 'Busker Tim',
    members: [
      {
        id: 'rival_tim',
        name: 'Tim',
        title: 'Street Busker',
        avatar: '🎸',
        paletteColor: '#f59e0b',
        instrumentId: 'acoustic_guitar',
        instrumentName: 'Acoustic Guitar',
        section: 'strings',
        pet: {
          id: 'pet_hare',
          name: 'Hoppy',
          species: 'Strumming Hare',
          sprite: 'hare',
          section: 'strings',
          instrumentName: 'Acoustic Guitar',
          leitmotifSound: 'guitar_strum',
          color: '#f59e0b'
        },
        stats: { technique: 20, toneQuality: 20, tempoStability: 20, sightReading: 20 },
        level: 1,
        xp: 50
      }
    ],
    piece: REPERTOIRE_DATABASE[0], // Minuet in G
    reputationRequired: 0,
    rewardStars: 1,
    description: 'A cheerful local street busker looking for a friendly musical exchange at the town gazebo.'
  },
  {
    id: 'rival_allegro_duo',
    name: 'The Allegro Academy Duet',
    tier: 'duet',
    conductorName: 'Lady Beatrice',
    members: [
      RECRUITABLE_MUSICIANS[0], // Clara (Violin)
      RECRUITABLE_MUSICIANS[1]  // Oliver (Flute)
    ],
    piece: REPERTOIRE_DATABASE[1], // Cavatina Two-Part Invention
    reputationRequired: 1,
    rewardStars: 2,
    description: 'A polished chamber duo celebrated for their clean phrasing and intricate counterpoint.'
  },
  {
    id: 'rival_triad_trio',
    name: 'The Starlight Jazz Trio',
    tier: 'trio',
    conductorName: 'Duke Sterling',
    members: [
      RECRUITABLE_MUSICIANS[0], // Clara
      RECRUITABLE_MUSICIANS[1], // Oliver
      RECRUITABLE_MUSICIANS[3]  // Rita
    ],
    piece: REPERTOIRE_DATABASE[2], // Bossa Nova Serenade
    reputationRequired: 3,
    rewardStars: 3,
    description: 'A groovy ensemble combining smooth jazz melodies with tight percussion grooves.'
  },
  {
    id: 'rival_grand_orchestra',
    name: 'The Grand Philharmonic of Sonora',
    tier: 'orchestra',
    conductorName: 'Maestro Valerius',
    members: [
      RECRUITABLE_MUSICIANS[0],
      RECRUITABLE_MUSICIANS[1],
      RECRUITABLE_MUSICIANS[2],
      RECRUITABLE_MUSICIANS[3]
    ],
    piece: REPERTOIRE_DATABASE[4], // Ode to Harmony
    reputationRequired: 6,
    rewardStars: 5,
    description: 'The supreme masters of orchestral music in Sonora. Defeating them seals your legacy as the Grand Maestro!'
  }
];

/* ---------------- WORLD ZONES CONFIGS ---------------- */

export const WORLD_ZONES: Record<string, WorldZone> = {
  cavatina_village: {
    id: 'cavatina_village',
    name: 'Cavatina Village',
    subtitle: 'The Cradle of Melodies & Academy Plaza',
    width: 2000,
    height: 1600,
    ambientBgm: 'cavatina_village',
    themeColor: '#38bdf8',
    defaultSpawn: { x: 1000, y: 800, dir: 'down' },
    transitions: [
      { id: 'tr_to_woods', targetZone: 'woodwind_woods', targetSpawn: { x: 120, y: 600, dir: 'right' }, bounds: { x: 1940, y: 500, w: 60, h: 200 }, promptText: 'To Woodwind Woods' },
      { id: 'tr_to_citadel', targetZone: 'brass_citadel', targetSpawn: { x: 1000, y: 1480, dir: 'up' }, bounds: { x: 900, y: 0, w: 200, h: 60 }, promptText: 'To Brass Citadel' },
      { id: 'tr_to_peaks', targetZone: 'percussion_peaks', targetSpawn: { x: 1000, y: 120, dir: 'down' }, bounds: { x: 900, y: 1540, w: 200, h: 60 }, promptText: 'To Percussion Peaks' },
      { id: 'tr_to_grand_hall', targetZone: 'grand_hall', targetSpawn: { x: 1000, y: 1200, dir: 'up' }, bounds: { x: 0, y: 500, w: 60, h: 200 }, promptText: 'To Grand Symphony Hall' }
    ],
    obstacles: [
      { type: 'box', x: 0, y: 0, w: 2000, h: 60, name: 'North Boundary Wall' },
      { type: 'box', x: 0, y: 1540, w: 2000, h: 60, name: 'South Boundary River' },
      { type: 'box', x: 450, y: 350, w: 280, h: 180, name: 'Practice Academy Shed' },
      { type: 'box', x: 1250, y: 350, w: 320, h: 180, name: 'Conservatory Library' },
      { type: 'circle', x: 1000, y: 800, radius: 64, name: 'Clef Fountain' }
    ]
  },
  woodwind_woods: {
    id: 'woodwind_woods',
    name: 'Woodwind Woods',
    subtitle: 'Whispering Canopies & Reed Riverbeds',
    width: 2000,
    height: 1600,
    ambientBgm: 'woodwind_woods',
    themeColor: '#10b981',
    defaultSpawn: { x: 120, y: 600, dir: 'right' },
    transitions: [
      { id: 'tr_to_cavatina_from_woods', targetZone: 'cavatina_village', targetSpawn: { x: 1880, y: 600, dir: 'left' }, bounds: { x: 0, y: 500, w: 60, h: 200 }, promptText: 'Back to Cavatina Village' }
    ],
    obstacles: [
      { type: 'box', x: 0, y: 0, w: 2000, h: 60, name: 'Northern Thicket' },
      { type: 'box', x: 1940, y: 0, w: 60, h: 1600, name: 'Eastern Bamboo Wall' },
      { type: 'circle', x: 500, y: 450, radius: 36, name: 'Resonant Willow 1' },
      { type: 'circle', x: 1400, y: 450, radius: 36, name: 'Resonant Willow 2' },
      { type: 'circle', x: 900, y: 1000, radius: 48, name: 'Piccolo Grove' }
    ]
  },
  brass_citadel: {
    id: 'brass_citadel',
    name: 'The Brass Citadel',
    subtitle: 'Gilded Ramparts & The Echo Amphitheater',
    width: 2000,
    height: 1600,
    ambientBgm: 'brass_citadel',
    themeColor: '#eab308',
    defaultSpawn: { x: 1000, y: 1480, dir: 'up' },
    transitions: [
      { id: 'tr_to_cavatina_from_citadel', targetZone: 'cavatina_village', targetSpawn: { x: 1000, y: 120, dir: 'down' }, bounds: { x: 900, y: 1540, w: 200, h: 60 }, promptText: 'Back to Cavatina Village' }
    ],
    obstacles: [
      { type: 'box', x: 0, y: 0, w: 2000, h: 100, name: 'Citadel Golden Wall' },
      { type: 'box', x: 0, y: 0, w: 80, h: 1600, name: 'West Rampart' },
      { type: 'box', x: 1920, y: 0, w: 80, h: 1600, name: 'East Rampart' },
      { type: 'circle', x: 600, y: 600, radius: 40, name: 'Herald Pillar West' },
      { type: 'circle', x: 1400, y: 600, radius: 40, name: 'Herald Pillar East' }
    ]
  },
  percussion_peaks: {
    id: 'percussion_peaks',
    name: 'Percussion Peaks',
    subtitle: 'Stepped Ghats & Resonant Stone Bells',
    width: 2000,
    height: 1600,
    ambientBgm: 'percussion_peaks',
    themeColor: '#8b5cf6',
    defaultSpawn: { x: 1000, y: 120, dir: 'down' },
    transitions: [
      { id: 'tr_to_cavatina_from_peaks', targetZone: 'cavatina_village', targetSpawn: { x: 1000, y: 1480, dir: 'up' }, bounds: { x: 900, y: 0, w: 200, h: 60 }, promptText: 'Back to Cavatina Village' }
    ],
    obstacles: [
      { type: 'box', x: 0, y: 1540, w: 2000, h: 60, name: 'South Canyon Drop' },
      { type: 'circle', x: 500, y: 800, radius: 50, name: 'Timpani Monolith' },
      { type: 'circle', x: 1500, y: 800, radius: 50, name: 'Snare Monolith' }
    ]
  },
  grand_hall: {
    id: 'grand_hall',
    name: 'The Grand Symphony Hall',
    subtitle: 'Sanctuary of Maestros & The Eternal Stage',
    width: 2000,
    height: 1600,
    ambientBgm: 'grand_hall',
    themeColor: '#ec4899',
    defaultSpawn: { x: 1000, y: 1200, dir: 'up' },
    transitions: [
      { id: 'tr_to_cavatina_from_grand_hall', targetZone: 'cavatina_village', targetSpawn: { x: 120, y: 600, dir: 'right' }, bounds: { x: 900, y: 1540, w: 200, h: 60 }, promptText: 'Back to Cavatina Village' }
    ],
    obstacles: [
      { type: 'box', x: 0, y: 0, w: 2000, h: 120, name: 'Grand Stage Back Wall' },
      { type: 'box', x: 300, y: 400, w: 1400, h: 200, name: 'Grand Stage Platform' }
    ]
  }
};

/* ---------------- WORLD NPCS ROSTER ---------------- */

export const INITIAL_WORLD_NPCS: WorldNPC[] = [
  // Cavatina Village
  {
    id: 'npc_practice_shed',
    name: 'Practice Shed',
    title: 'Hone Musicianship & Technique [SPACE]',
    x: 590,
    y: 540,
    zone: 'cavatina_village',
    actionType: 'practice_bench',
    dialogue: [
      "Welcome to the Practice Shed! Regular practice sharpens Technique, Tone Quality, and Tempo Stability."
    ]
  },
  {
    id: 'npc_music_stand_1',
    name: 'Historic Music Stand',
    title: 'Study Sheet Music [SPACE]',
    x: 1410,
    y: 540,
    zone: 'cavatina_village',
    actionType: 'sheet_music_stand',
    sheetMusicReward: 'piece_cavatina_duet',
    dialogue: [
      "You discovered the sheet music for 'Cavatina Two-Part Invention' (Duet piece for Strings & Woodwinds)!"
    ]
  },
  {
    id: 'npc_busker_tim',
    name: 'Busker Tim',
    title: 'Gazebo Soloist [SPACE to Compete]',
    x: 1000,
    y: 650,
    zone: 'cavatina_village',
    actionType: 'competition_stage',
    dialogue: [
      "Hey there! Want to enter a friendly Busking Showcase to earn your first Reputation Star?"
    ]
  },
  {
    id: 'npc_clara_world',
    name: 'Clara',
    title: 'Virtuoso Violinist [SPACE to Jam]',
    x: 820,
    y: 850,
    zone: 'cavatina_village',
    musicianData: RECRUITABLE_MUSICIANS[0],
    actionType: 'audition_battle',
    dialogue: RECRUITABLE_MUSICIANS[0].dialogue || []
  },

  // Woodwind Woods
  {
    id: 'npc_oliver_world',
    name: 'Oliver',
    title: 'Forest Flutist [SPACE to Jam]',
    x: 900,
    y: 850,
    zone: 'woodwind_woods',
    musicianData: RECRUITABLE_MUSICIANS[1],
    actionType: 'audition_battle',
    dialogue: RECRUITABLE_MUSICIANS[1].dialogue || []
  },
  {
    id: 'npc_music_stand_woods',
    name: 'Ancient Stone Stand',
    title: 'Study Sheet Music [SPACE]',
    x: 1300,
    y: 650,
    zone: 'woodwind_woods',
    actionType: 'sheet_music_stand',
    sheetMusicReward: 'piece_bossa_trio',
    dialogue: [
      "You discovered the sheet music for 'Sonora Sunset Serenade' (Bossa Nova Trio)!"
    ]
  },

  // Brass Citadel
  {
    id: 'npc_baron_world',
    name: 'Baron Von Brass',
    title: 'Citadel Trumpet Captain [SPACE to Jam]',
    x: 1000,
    y: 750,
    zone: 'brass_citadel',
    musicianData: RECRUITABLE_MUSICIANS[2],
    actionType: 'audition_battle',
    dialogue: RECRUITABLE_MUSICIANS[2].dialogue || []
  },
  {
    id: 'npc_music_stand_citadel',
    name: 'Golden Music Stand',
    title: 'Study Sheet Music [SPACE]',
    x: 1200,
    y: 450,
    zone: 'brass_citadel',
    actionType: 'sheet_music_stand',
    sheetMusicReward: 'piece_starlight_quartet',
    dialogue: [
      "You discovered the sheet music for 'Starlight String & Brass Quartet'!"
    ]
  },

  // Percussion Peaks
  {
    id: 'npc_rita_world',
    name: 'Rhythm Rita',
    title: 'Mountain Snare Maestro [SPACE to Jam]',
    x: 1000,
    y: 950,
    zone: 'percussion_peaks',
    musicianData: RECRUITABLE_MUSICIANS[3],
    actionType: 'audition_battle',
    dialogue: RECRUITABLE_MUSICIANS[3].dialogue || []
  },

  // Grand Symphony Hall
  {
    id: 'npc_maestro_valerius',
    name: 'Maestro Valerius',
    title: 'Grand Symphony Conductor [SPACE to Compete]',
    x: 1000,
    y: 550,
    zone: 'grand_hall',
    actionType: 'competition_stage',
    dialogue: [
      "Welcome, Maestro! Has your ensemble mastered all 4 sections? If so, let us perform the Ode to Harmony for the world!"
    ]
  },

  // Master Luthier & Vistas
  {
    id: 'npc_luthier_marco',
    name: 'Master Luthier Marco',
    title: 'Instrument Workshop & Forge [SPACE]',
    x: 350,
    y: 850,
    zone: 'cavatina_village',
    actionType: 'luthier_shop',
    dialogue: [
      "Welcome to the Luthier's Forge! Bring me Notes (♪) and Inspiration Sparks (✨) to ascend your instruments and craft signature artifacts."
    ]
  },
  {
    id: 'npc_vista_cavatina',
    name: 'Canyon of Thirds Vista',
    title: 'Acoustic Inspiration Vista [SPACE to Attune]',
    x: 1650,
    y: 1100,
    zone: 'cavatina_village',
    actionType: 'inspiration_vista',
    vistaId: 'vista_canyon_thirds',
    dialogue: [
      "You sit and listen to the natural third intervals echoing across the canyon. Technique permanently increased by +5!"
    ]
  },
  {
    id: 'npc_side_musicbox',
    name: 'Elder Timothy',
    title: 'Antique Music Box Repair [SPACE]',
    x: 1200,
    y: 1150,
    zone: 'cavatina_village',
    actionType: 'talk',
    dialogue: [
      "Oh my! My grandfather's music box lost its cylinder pins. If you can gather brass pins from the luthier, I'll reward you handsomely with 150 Notes (♪)!"
    ]
  },

  // Wild Harmonipets for Bonding
  {
    id: 'npc_wild_hare',
    name: 'Wild Vivace Hare',
    title: 'Wild Harmonipet (Acoustic Guitar) [SPACE to Harmonize]',
    x: 1750,
    y: 750,
    zone: 'cavatina_village',
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_hare_wild',
      name: 'Vivace',
      species: 'Vivace Hare',
      sprite: '🐇',
      section: 'strings',
      instrumentName: 'Acoustic Guitar',
      leitmotifSound: 'guitar_strum',
      color: '#f59e0b'
    },
    dialogue: [
      "A wild Vivace Hare is strumming harmonic rhythms on its acoustic guitar! Match its cadence to bond with it!"
    ]
  },
  {
    id: 'npc_wild_otter',
    name: 'Wild Cantabile Otter',
    title: 'Wild Harmonipet (Oboe) [SPACE to Harmonize]',
    x: 1550,
    y: 850,
    zone: 'woodwind_woods',
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_otter_wild',
      name: 'Lento',
      species: 'Cantabile Otter',
      sprite: '🦦',
      section: 'woodwinds',
      instrumentName: 'Oboe',
      leitmotifSound: 'oboe_melody',
      color: '#10b981'
    },
    dialogue: [
      "A graceful Cantabile Otter is piping warm lyrical melodies by the brook! Match its cadence to bond with it!"
    ]
  },
  {
    id: 'npc_wild_ram',
    name: 'Wild Alpine Ram',
    title: 'Wild Harmonipet (French Horn) [SPACE to Harmonize]',
    x: 1600,
    y: 700,
    zone: 'brass_citadel',
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_ram_wild',
      name: 'Rondo',
      species: 'Alpine Ram',
      sprite: '🐏',
      section: 'brass',
      instrumentName: 'French Horn',
      leitmotifSound: 'horn_call',
      color: '#f97316'
    },
    dialogue: [
      "A noble Alpine Ram calls out with rich horn echoes! Match its cadence to bond with it!"
    ]
  },
  {
    id: 'npc_wild_squirrel',
    name: 'Wild Marimba Squirrel',
    title: 'Wild Harmonipet (Rosewood Marimba) [SPACE to Harmonize]',
    x: 1400,
    y: 850,
    zone: 'percussion_peaks',
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_squirrel_wild',
      name: 'Click',
      species: 'Marimba Squirrel',
      sprite: '🐿️',
      section: 'percussion',
      instrumentName: 'Marimba',
      leitmotifSound: 'marimba_roll',
      color: '#ec4899'
    },
    dialogue: [
      "A nimble Marimba Squirrel is tapping energetic triplets on polished rosewood bars! Match its cadence to bond with it!"
    ]
  }
];

/* ---------------- INSTRUMENT ARTIFACTS (LUTHIER FORGE) ---------------- */

export const INSTRUMENT_ARTIFACTS: InstrumentArtifact[] = [
  {
    id: 'artifact_rosin_swan',
    name: 'Bow Rosin of the Swan',
    section: 'strings',
    tier: 2,
    bonusTechnique: 15,
    bonusTone: 10,
    bonusTempo: 5,
    traitName: 'Lyrical Vibrato',
    traitDescription: 'Heals ensemble Harmony by 5% and cures tempo wobble every 4th measure. (Swan crit multiplier 2.0x)',
    costGold: 300,
    costSparks: 15,
    equipped: false
  },
  {
    id: 'artifact_lip_plate',
    name: 'Silver Embouchure Lip Plate',
    section: 'woodwinds',
    tier: 2,
    bonusTechnique: 12,
    bonusTone: 15,
    bonusTempo: 5,
    traitName: 'Breathless Cadenza',
    traitDescription: 'Eliminates breath penalties during rapid runs. (Finch move cost -25%)',
    costGold: 300,
    costSparks: 15,
    equipped: false
  },
  {
    id: 'artifact_brass_mute',
    name: 'Resonant Brass Mute',
    section: 'brass',
    tier: 2,
    bonusTechnique: 8,
    bonusTone: 20,
    bonusTempo: 10,
    traitName: 'Dual-Harmonic Shift',
    traitDescription: 'Toggles between Open Flare (+30% attack) and Harmon Mute (AoE charm). (Terrier dissonance immunity)',
    costGold: 350,
    costSparks: 18,
    equipped: false
  },
  {
    id: 'artifact_bronze_cymbals',
    name: 'Hand-Hammered Bronze Cymbals',
    section: 'percussion',
    tier: 2,
    bonusTechnique: 10,
    bonusTone: 5,
    bonusTempo: 25,
    traitName: 'Sonic Dispersal Crash',
    traitDescription: 'Disperses opponent buffs on Beat 1 and locks tempo meter. (Raccoon syncopation gold bonus)',
    costGold: 350,
    costSparks: 18,
    equipped: false
  }
];

/* ---------------- LOST SCORES ---------------- */

export const INITIAL_LOST_SCORES: LostScore[] = [
  {
    id: 'score_canon_whispers',
    title: 'The Canon of Whispers',
    composer: 'The First Maestro',
    fragmentsFound: 1,
    totalFragments: 3,
    unlocked: false,
    pieceId: 'piece_cavatina_duet'
  },
  {
    id: 'score_sunken_grotto',
    title: 'Sonata of the Sunken Grotto',
    composer: 'The First Maestro',
    fragmentsFound: 0,
    totalFragments: 3,
    unlocked: false,
    pieceId: 'piece_bossa_trio'
  },
  {
    id: 'score_tempest_fugue',
    title: 'The Tempest Fugue',
    composer: 'The First Maestro',
    fragmentsFound: 0,
    totalFragments: 4,
    unlocked: false,
    pieceId: 'piece_starlight_quartet'
  },
  {
    id: 'score_cosmic_lyre',
    title: 'Hymn of the Cosmic Lyre',
    composer: 'The First Maestro',
    fragmentsFound: 0,
    totalFragments: 4,
    unlocked: false,
    pieceId: 'piece_ode_to_harmony'
  }
];

/* ---------------- INSPIRATION VISTAS ---------------- */

export const INITIAL_INSPIRATION_VISTAS: InspirationVista[] = [
  {
    id: 'vista_canyon_thirds',
    name: 'The Canyon of Thirds',
    zone: 'cavatina_village',
    x: 1650,
    y: 1100,
    description: 'Natural stone arches amplify perfect third intervals, sharpening bow dexterity.',
    statReward: 'technique',
    statAmount: 5,
    visited: false
  },
  {
    id: 'vista_bellflower',
    name: 'The Bellflower Basin',
    zone: 'woodwind_woods',
    x: 1400,
    y: 1100,
    description: 'Acoustic blossoms resonate with soft overtones, enriching tone quality.',
    statReward: 'toneQuality',
    statAmount: 5,
    visited: false
  },
  {
    id: 'vista_echo_falls',
    name: 'The Echo Rampart',
    zone: 'brass_citadel',
    x: 1400,
    y: 1200,
    description: 'Gilded walls reflect bold acoustic waves, granting unwavering dynamic control.',
    statReward: 'toneQuality',
    statAmount: 5,
    visited: false
  },
  {
    id: 'vista_monolith_peak',
    name: 'The High Ridge Monolith',
    zone: 'percussion_peaks',
    x: 1000,
    y: 400,
    description: 'Ancient metronomic vibrations stabilize the pulse under pressure.',
    statReward: 'tempoStability',
    statAmount: 5,
    visited: false
  }
];

/* ---------------- PERFORMANCE VENUES ---------------- */

export const PERFORMANCE_VENUES: PerformanceVenue[] = [
  {
    id: 'venue_cavatina_gazebo',
    name: 'Cavatina Park Gazebo',
    zone: 'cavatina_village',
    type: 'gazebo',
    baseGoldReward: 60,
    reputationRequirement: 0,
    acousticProfile: 'Open air with light pedestrian chatter. Great for early busking.'
  },
  {
    id: 'venue_roasted_bean',
    name: 'The Roasted Bean Café',
    zone: 'cavatina_village',
    type: 'cafe',
    baseGoldReward: 160,
    reputationRequirement: 1,
    acousticProfile: 'Intimate dry acoustics. Clattering espresso machines require dynamic focus.'
  },
  {
    id: 'venue_manor_salon',
    name: 'Manor Solana Chamber Salon',
    zone: 'cavatina_village',
    type: 'salon',
    baseGoldReward: 450,
    reputationRequirement: 3,
    acousticProfile: 'High reflection. Strict Pianissimo-to-Mezzo-Forte dynamic ceilings.'
  },
  {
    id: 'venue_royal_hall',
    name: 'The Royal Symphony Hall',
    zone: 'grand_hall',
    type: 'concert_hall',
    baseGoldReward: 1500,
    reputationRequirement: 6,
    acousticProfile: 'Cathedral reverb decay (3.5s). Demands full 4-section orchestral balance.'
  }
];

/* ---------------- GAME QUESTS ---------------- */

export const INITIAL_GAME_QUESTS: GameQuest[] = [
  {
    id: 'quest_ch1',
    title: 'Chapter 1: The Street Soloist',
    chapter: 1,
    type: 'main',
    description: 'Begin your journey in Cavatina Village. Hone your technique in the Practice Shed and recruit your first Duet partner.',
    objective: 'Recruit Clara or Oliver and defeat Busker Tim at the Gazebo.',
    rewardGold: 200,
    rewardSparks: 20,
    rewardStars: 1,
    completed: false
  },
  {
    id: 'quest_ch2',
    title: 'Chapter 2: The Bossa Trio',
    chapter: 2,
    type: 'main',
    description: 'Travel beyond the village to assemble a 3-piece rhythm section and win the Coastal Showdown.',
    objective: 'Recruit Rhythm Rita and master the Bossa Nova Serenade.',
    rewardGold: 400,
    rewardSparks: 35,
    rewardStars: 2,
    completed: false
  },
  {
    id: 'quest_ch3',
    title: 'Chapter 3: The Starlight Quartet',
    chapter: 3,
    type: 'main',
    description: 'Enter the competitive Citadel, recruit Baron Von Brass, and perform the Starlight Quartet.',
    objective: 'Recruit Baron Von Brass and achieve 4-piece ensemble synergy.',
    rewardGold: 700,
    rewardSparks: 50,
    rewardStars: 3,
    completed: false
  },
  {
    id: 'quest_ch5',
    title: 'Chapter 5: The Grand Symphony',
    chapter: 5,
    type: 'main',
    description: 'Unite all 4 acoustic families and perform the Ode to Harmony at the Grand Symphony Hall.',
    objective: 'Defeat Maestro Valerius in the Grand Philharmonic Showdown.',
    rewardGold: 2500,
    rewardSparks: 100,
    rewardStars: 5,
    completed: false
  },
  {
    id: 'quest_side_musicbox',
    title: 'Side Quest: The Antique Music Box',
    chapter: 1,
    type: 'restoration',
    description: 'Elder Timothy needs help replacing the brass cylinder pins of his family heirloom.',
    objective: 'Speak with Master Luthier Marco and return to Elder Timothy.',
    rewardGold: 150,
    rewardSparks: 10,
    rewardStars: 0,
    completed: false
  }
];

/* ---------------- THE HARMONIDEX (16 CREATURE BESTIARY) ---------------- */

export const INITIAL_HARMONIDEX: HarmoniDexEntry[] = [
  // Strings (4 Species)
  {
    id: 'dex_swan',
    species: 'Allegro Swan',
    name: 'Allegro',
    section: 'strings',
    instrumentId: 'violin',
    instrumentName: 'Violin',
    sprite: '🦢',
    description: 'An elegant avian familiar known for soaring lyrical cantilenas and razor-sharp spiccato bowing.',
    discovered: true,
    bonded: true,
    evolutionStage: 1,
    evolvesTo: 'Symphonic Swan',
    evolutionLevel: 20
  },
  {
    id: 'dex_hare',
    species: 'Vivace Hare',
    name: 'Vivace',
    section: 'strings',
    instrumentId: 'acoustic_guitar',
    instrumentName: 'Acoustic Guitar',
    sprite: '🐇',
    description: 'A nimble woodland creature that strums rapid rasgueado chords with astonishing speed.',
    discovered: false,
    bonded: false,
    evolutionStage: 1,
    evolvesTo: 'Virtuoso Hare',
    evolutionLevel: 20
  },
  {
    id: 'dex_fox',
    species: 'Andante Fox',
    name: 'Soren',
    section: 'strings',
    instrumentId: 'cello',
    instrumentName: 'Cello',
    sprite: '🦊',
    description: 'A wise russet fox whose cello vibrations resonate deeply within the listener’s heart.',
    discovered: false,
    bonded: false,
    evolutionStage: 1,
    evolvesTo: 'Maestro Fox',
    evolutionLevel: 20
  },
  {
    id: 'dex_dolphin',
    species: 'Glissando Dolphin',
    name: 'Marina',
    section: 'strings',
    instrumentId: 'harp',
    instrumentName: 'Concert Harp',
    sprite: '🐬',
    description: 'A magical marine creature that plucks shimmering arpeggios that mimic the ocean spray.',
    discovered: false,
    bonded: false,
    evolutionStage: 1
  },

  // Woodwinds (4 Species)
  {
    id: 'dex_finch',
    species: 'Piccolo Finch',
    name: 'Pip',
    section: 'woodwinds',
    instrumentId: 'silver_flute',
    instrumentName: 'Silver Flute',
    sprite: '🐦',
    description: 'A vibrant songbird producing crystalline high-register trills that carry across mountain winds.',
    discovered: true,
    bonded: false,
    evolutionStage: 1,
    evolvesTo: 'Seraph Finch',
    evolutionLevel: 20
  },
  {
    id: 'dex_otter',
    species: 'Cantabile Otter',
    name: 'Lento',
    section: 'woodwinds',
    instrumentId: 'oboe',
    instrumentName: 'Oboe',
    sprite: '🦦',
    description: 'A playful aquatic familiar whose double-reed timbre possesses melancholic and noble depth.',
    discovered: false,
    bonded: false,
    evolutionStage: 1
  },
  {
    id: 'dex_lynx',
    species: 'Clarinet Lynx',
    name: 'Sonata',
    section: 'woodwinds',
    instrumentId: 'clarinet',
    instrumentName: 'Bb Clarinet',
    sprite: '🐱',
    description: 'A sleek predator capable of gliding effortlessly between liquid low chalumeau and bright clarion registers.',
    discovered: false,
    bonded: false,
    evolutionStage: 1
  },
  {
    id: 'dex_badger',
    species: 'Bassoon Badger',
    name: 'Grave',
    section: 'woodwinds',
    instrumentId: 'soprano_sax',
    instrumentName: 'Soprano Sax / Reeds',
    sprite: '🦡',
    description: 'A grounded familiar whose staccato bass notes form the bedrock of woodwind counterpoint.',
    discovered: false,
    bonded: false,
    evolutionStage: 1
  },

  // Brass (4 Species)
  {
    id: 'dex_terrier',
    species: 'Fanfare Terrier',
    name: 'Buster',
    section: 'brass',
    instrumentId: 'pocket_trumpet',
    instrumentName: 'Pocket Trumpet',
    sprite: '🐕',
    description: 'An enthusiastic canine familiar whose brassy barks sound like regal royal fanfares.',
    discovered: true,
    bonded: false,
    evolutionStage: 1,
    evolvesTo: 'Grand Herald Hound',
    evolutionLevel: 20
  },
  {
    id: 'dex_ram',
    species: 'Alpine Ram',
    name: 'Rondo',
    section: 'brass',
    instrumentId: 'french_horn',
    instrumentName: 'French Horn',
    sprite: '🐏',
    description: 'With curling golden horns, this majestic creature projects warm heroic calls across the alpine peaks.',
    discovered: false,
    bonded: false,
    evolutionStage: 1
  },
  {
    id: 'dex_lion',
    species: 'Regal Lion',
    name: 'Brillante',
    section: 'brass',
    instrumentId: 'trombone',
    instrumentName: 'Tenor Trombone',
    sprite: '🦁',
    description: 'A proud monarch whose roaring glissandos command immediate dynamic attention on the battlefield.',
    discovered: false,
    bonded: false,
    evolutionStage: 1
  },
  {
    id: 'dex_elephant',
    species: 'Tuba Elephant',
    name: 'Basso',
    section: 'brass',
    instrumentId: 'tuba',
    instrumentName: 'Bass Tuba',
    sprite: '🐘',
    description: 'A gentle giant whose seismic pedal tones shake the earth and anchor the harmony.',
    discovered: false,
    bonded: false,
    evolutionStage: 1
  },

  // Percussion (4 Species)
  {
    id: 'dex_raccoon',
    species: 'Beat Raccoon',
    name: 'Tempo',
    section: 'percussion',
    instrumentId: 'snare_kit',
    instrumentName: 'Snare & Hi-Hat',
    sprite: '🦝',
    description: 'A dexterous trickster who can maintain complex polyrhythmic beats without missing a single pulse.',
    discovered: true,
    bonded: false,
    evolutionStage: 1,
    evolvesTo: 'Groove Master Raccoon',
    evolutionLevel: 20
  },
  {
    id: 'dex_bear',
    species: 'Thunder Bear',
    name: 'Kensho',
    section: 'percussion',
    instrumentId: 'timpani',
    instrumentName: 'Timpani',
    sprite: '🐻',
    description: 'A colossal mountain guardian that strikes kettle drums with thunderous fortissimo authority.',
    discovered: false,
    bonded: false,
    evolutionStage: 1
  },
  {
    id: 'dex_squirrel',
    species: 'Marimba Squirrel',
    name: 'Click',
    section: 'percussion',
    instrumentId: 'marimba',
    instrumentName: 'Rosewood Marimba',
    sprite: '🐿️',
    description: 'Darting along polished wooden bars, this creature produces sparkling xylophonic cascades.',
    discovered: false,
    bonded: false,
    evolutionStage: 1
  },
  {
    id: 'dex_owl',
    species: 'Chime Owl',
    name: 'Luna',
    section: 'percussion',
    instrumentId: 'glockenspiel',
    instrumentName: 'Glockenspiel',
    sprite: '🦉',
    description: 'A nocturnal familiar that taps pure bell-metal tones, resonating with celestial clarity.',
    discovered: false,
    bonded: false,
    evolutionStage: 1
  }
];

/* ---------------- THE 8 CONSERVATORY CLEF BADGES ---------------- */

export const CLEF_BADGES: ClefBadge[] = [
  {
    id: 'badge_prelude',
    name: 'Prelude Clef',
    icon: '𝄞',
    section: 'strings',
    conservatory: 'Cavatina Village Academy',
    maestroName: 'Lady Beatrice',
    obtained: false
  },
  {
    id: 'badge_pastorale',
    name: 'Pastorale Clef',
    icon: '𝄢',
    section: 'woodwinds',
    conservatory: 'Pastoral Meadow Conservatory',
    maestroName: 'Master Rowan',
    obtained: false
  },
  {
    id: 'badge_bossa',
    name: 'Bossa Clef',
    icon: '𝄡',
    section: 'percussion',
    conservatory: 'Port Resonata Jazz Pavilion',
    maestroName: 'Duke Sterling',
    obtained: false
  },
  {
    id: 'badge_cadenza',
    name: 'Cadenza Clef',
    icon: '𝄪',
    section: 'brass',
    conservatory: 'Metro Cadenza Gilded Guild',
    maestroName: 'Baron Von Brass',
    obtained: false
  },
  {
    id: 'badge_rondo',
    name: 'Rondo Clef',
    icon: '𝄫',
    section: 'strings',
    conservatory: 'Echo Canyon Hermitage',
    maestroName: 'Maestro Soren',
    obtained: false
  },
  {
    id: 'badge_scherzo',
    name: 'Scherzo Clef',
    icon: '𝄬',
    section: 'percussion',
    conservatory: 'Mountbeat Taiko Monastery',
    maestroName: 'Grandmaster Kensho',
    obtained: false
  },
  {
    id: 'badge_nocturne',
    name: 'Nocturne Clef',
    icon: '𝄭',
    section: 'woodwinds',
    conservatory: 'Starlight Conservatory of Sonora',
    maestroName: 'Lady Selene',
    obtained: false
  },
  {
    id: 'badge_overture',
    name: 'Overture Clef',
    icon: '𝄮',
    section: 'all',
    conservatory: 'Grand Citadel of Virtuosos',
    maestroName: 'General Roland',
    obtained: false
  }
];
