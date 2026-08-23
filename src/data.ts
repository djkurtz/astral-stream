import {
  Harmonipet, Musician, RepertoirePiece, RivalEnsemble, WorldZone, WorldNPC, BattleMove, InstrumentId,
  InstrumentArtifact, LostScore, InspirationVista, PerformanceVenue, GameQuest,
  HarmoniDexEntry, ClefBadge, PlayerCustomization, TheoryChallengeType, TheoryQuestion,
  InstrumentSection, PlayerProficiency
} from './types';

export const DEFAULT_CUSTOMIZATION: PlayerCustomization = {
  outfitColor: '#38bdf8',
  hairColor: '#78350f',
  hatStyle: 'beret',
  instrumentFinish: 'classic_amber',
  petTint: '#ffffff'
};

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

export const ALL_INSTRUMENTS_INFO: Record<InstrumentId, { name: string; section: InstrumentSection; avatar: string; description: string }> = {
  violin: { name: 'Aria Violin', section: 'strings', avatar: '🎻', description: 'Expressive lyrical leads and agile counterpoint.' },
  acoustic_guitar: { name: 'Acoustic Guitar', section: 'strings', avatar: '🎸', description: 'Rhythmic rasgueado strums and rich acoustic chord beds.' },
  cello: { name: 'Resonant Cello', section: 'strings', avatar: '🎻', description: 'Deep grounding basslines and warm melancholic resonance.' },
  harp: { name: 'Concert Harp', section: 'strings', avatar: '🪕', description: 'Shimmering arpeggios and ethereal angelic flourishes.' },
  silver_flute: { name: 'Silver Concert Flute', section: 'woodwinds', avatar: '🪈', description: 'Airy overtones, brisk staccato runs, and birdsong cantilenas.' },
  soprano_sax: { name: 'Soprano Saxophone', section: 'woodwinds', avatar: '🎷', description: 'Vibrant reed brilliance and soaring improvisational jazz phrasing.' },
  clarinet: { name: 'Bb Clarinet', section: 'woodwinds', avatar: '🪈', description: 'Liquid chalumeau low register and bright clarion leaps.' },
  oboe: { name: 'Cantabile Oboe', section: 'woodwinds', avatar: '🪈', description: 'Piercingly sweet double-reed timbre with profound emotional depth.' },
  pocket_trumpet: { name: 'Pocket Trumpet', section: 'brass', avatar: '🎺', description: 'Crisp heroic fanfares, bold dynamic attacks, and regal projection.' },
  french_horn: { name: 'French Horn', section: 'brass', avatar: '📯', description: 'Noble alpine calls, velvety warm mid-range, and distant echoes.' },
  trombone: { name: 'Tenor Trombone', section: 'brass', avatar: '🎺', description: 'Thunderous slide glissandos and punchy harmonic brass walls.' },
  tuba: { name: 'Bass Tuba', section: 'brass', avatar: '🎺', description: 'Earth-shaking acoustic pedal notes that anchor the brass choir.' },
  snare_kit: { name: 'Snare & Hi-Hat Kit', section: 'percussion', avatar: '🥁', description: 'Crisp metronomic precision, tight rolls, and groove propulsion.' },
  marimba: { name: 'Rosewood Marimba', section: 'percussion', avatar: '🪵', description: 'Warm wooden resonance and dancing polyrhythmic ostinatos.' },
  timpani: { name: 'Orchestral Timpani', section: 'percussion', avatar: '🥁', description: 'Resonant kettle drums providing thunderous dramatic crescendos.' },
  glockenspiel: { name: 'Silver Glockenspiel', section: 'percussion', avatar: '🔔', description: 'Bright crystalline metallic chimes that sparkle above the ensemble.' }
};

export function calculateEffectiveSkill(
  lead: Musician,
  proficiency: PlayerProficiency,
  instrumentId: InstrumentId = lead.instrumentId
): number {
  const info = ALL_INSTRUMENTS_INFO[instrumentId] || ALL_INSTRUMENTS_INFO.violin;
  const general = Math.round((lead.stats.technique + lead.stats.toneQuality + lead.stats.tempoStability + lead.stats.sightReading) / 4);
  const sectionScore = proficiency.sections[info.section] || 20;
  const masteryObj = proficiency.instruments[instrumentId] || { level: 1, xp: 0 };
  const masteryScore = Math.min(100, masteryObj.level * 10);
  return Math.round((general * 0.5) + (sectionScore * 0.3) + (masteryScore * 0.2));
}

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
  },

  // Tactical Stances
  pianissimo_shield: {
    id: 'pianissimo_shield',
    name: 'Pianissimo Shield',
    section: 'all',
    power: 0,
    harmonyCost: 10,
    effect: 'pianissimo_shield',
    description: 'Adopts a gentle dynamic stance, absorbing 50% dissonance and restoring 20 Harmony Points.'
  },
  fortissimo_surge: {
    id: 'fortissimo_surge',
    name: 'Fortissimo Surge',
    section: 'all',
    power: 0,
    harmonyCost: 20,
    effect: 'fortissimo_surge',
    description: 'Builds massive acoustic tension, doubling the resonance of your next harmony attack!'
  }
};

/* ---------------- INSTRUMENT-SPECIFIC BATTLE MOVES ---------------- */

export const INSTRUMENT_BATTLE_MOVES: Record<InstrumentId, { move1: BattleMove; move2: BattleMove }> = {
  violin: {
    move1: { id: 'spiccato_bounce', name: 'Spiccato Bounce', section: 'strings', power: 18, harmonyCost: 10, effect: 'resonance_boost', description: 'Crisp bouncing bow strokes that build swift melodic momentum.' },
    move2: { id: 'vibrato_charm', name: 'Vibrato Charm', section: 'strings', power: 26, harmonyCost: 25, effect: 'vibrato_charm', description: 'A lyrical, deeply moving violin phrase that captivates the audience.' }
  },
  acoustic_guitar: {
    move1: { id: 'rasgueado_strum', name: 'Rasgueado Strum', section: 'strings', power: 19, harmonyCost: 12, effect: 'resonance_boost', description: 'A fiery flamenco chord cascade that fills the acoustic space.' },
    move2: { id: 'fingerstyle_weave', name: 'Fingerstyle Weave', section: 'strings', power: 25, harmonyCost: 22, effect: 'tempo_lock', description: 'Intricate polyphonic fingerpicking that locks in harmonic balance.' }
  },
  cello: {
    move1: { id: 'cantabile_bow', name: 'Cantabile Resonance', section: 'strings', power: 20, harmonyCost: 15, effect: 'resonance_boost', description: 'A rich, singing cello passage that warms the lower harmonics.' },
    move2: { id: 'pizzicato_snap', name: 'Bartók Snap Pizzicato', section: 'strings', power: 28, harmonyCost: 25, effect: 'fortissimo_burst', description: 'A percussive string snap against the fingerboard.' }
  },
  harp: {
    move1: { id: 'glissando_cascade', name: 'Glissando Cascade', section: 'strings', power: 17, harmonyCost: 10, effect: 'resonance_boost', description: 'A sweeping rush of harp strings creating shimmering overtone waves.' },
    move2: { id: 'arpeggiated_chime', name: 'Celestial Arpeggio', section: 'strings', power: 27, harmonyCost: 25, effect: 'vibrato_charm', description: 'A sparkling, bell-like chord progression that enchants the listener.' }
  },
  silver_flute: {
    move1: { id: 'overtone_flutter', name: 'Overtone Flutter', section: 'woodwinds', power: 18, harmonyCost: 10, effect: 'resonance_boost', description: 'Rapid flutter-tonguing that sends silver harmonic ripples through the hall.' },
    move2: { id: 'trill_mirage', name: 'Trill Mirage', section: 'woodwinds', power: 26, harmonyCost: 22, effect: 'vibrato_charm', description: 'Dazzling rapid trills that disorient and enchant the listener.' }
  },
  soprano_sax: {
    move1: { id: 'blues_inflection', name: 'Soulful Portamento', section: 'woodwinds', power: 21, harmonyCost: 15, effect: 'resonance_boost', description: 'Smooth, expressive pitch bends with rich warm overtones.' },
    move2: { id: 'bebop_cadence', name: 'Bebop Velocity', section: 'woodwinds', power: 28, harmonyCost: 25, effect: 'fortissimo_burst', description: 'A lightning-fast flurry of jazz subdivisions.' }
  },
  clarinet: {
    move1: { id: 'chalumeau_warmth', name: 'Chalumeau Warmth', section: 'woodwinds', power: 17, harmonyCost: 10, effect: 'tempo_lock', description: 'Deep, velvety low-register tones that anchor the harmony.' },
    move2: { id: 'altissimo_flourish', name: 'Altissimo Flourish', section: 'woodwinds', power: 27, harmonyCost: 24, effect: 'fortissimo_burst', description: 'Piercing, soaring high-register runs that shatter dissonance.' }
  },
  oboe: {
    move1: { id: 'reedy_soliloquy', name: 'Pastoral Soliloquy', section: 'woodwinds', power: 19, harmonyCost: 12, effect: 'resonance_boost', description: 'A poignant, penetrating double-reed melody of crystal clarity.' },
    move2: { id: 'double_tongue_dash', name: 'Staccatissimo Dash', section: 'woodwinds', power: 26, harmonyCost: 22, effect: 'tempo_lock', description: 'Razor-sharp articulated attacks that stabilize the beat.' }
  },
  pocket_trumpet: {
    move1: { id: 'fanfare_call', name: 'Herald Fanfare', section: 'brass', power: 22, harmonyCost: 15, effect: 'resonance_boost', description: 'A brilliant, ringing brass call that cuts through the ensemble.' },
    move2: { id: 'fortissimo_fanfare', name: 'Fortissimo Blast', section: 'brass', power: 30, harmonyCost: 28, effect: 'fortissimo_burst', description: 'A commanding burst of pure brass power.' }
  },
  french_horn: {
    move1: { id: 'noble_horn_call', name: 'Noble Horn Echo', section: 'brass', power: 20, harmonyCost: 14, effect: 'tempo_lock', description: 'Majestic, mellow brass calls echoing from the sonic forest.' },
    move2: { id: 'brassy_cuivre', name: 'Cuivré Brass Surge', section: 'brass', power: 29, harmonyCost: 26, effect: 'fortissimo_burst', description: 'Edgy, forced brass tones creating immense acoustic tension.' }
  },
  trombone: {
    move1: { id: 'glissando_slide', name: 'Glissando Slide', section: 'brass', power: 20, harmonyCost: 14, effect: 'vibrato_charm', description: 'A smooth, theatrical trombone slide that charms the crowd.' },
    move2: { id: 'pedal_tone_punch', name: 'Pedal Tone Punch', section: 'brass', power: 31, harmonyCost: 30, effect: 'fortissimo_burst', description: 'A massive low-frequency blast that vibrates the floorboards.' }
  },
  tuba: {
    move1: { id: 'staccato_oompah', name: 'Bass Foundation', section: 'brass', power: 18, harmonyCost: 12, effect: 'tempo_lock', description: 'Rock-solid low brass rhythmic pulses.' },
    move2: { id: 'subwoofer_surge', name: 'Sub-Harmonic Surge', section: 'brass', power: 29, harmonyCost: 28, effect: 'fortissimo_burst', description: 'Earth-shaking sub-bass energy that overwhelms the opponent.' }
  },
  snare_kit: {
    move1: { id: 'paradiddle_roll', name: 'Paradiddle Roll', section: 'percussion', power: 19, harmonyCost: 12, effect: 'tempo_lock', description: 'A crisp, blazing snare rudiment that commands the tempo.' },
    move2: { id: 'rimshot_crack', name: 'Rimshot Accent', section: 'percussion', power: 28, harmonyCost: 25, effect: 'fortissimo_burst', description: 'A sudden, explosive percussive snap.' }
  },
  marimba: {
    move1: { id: 'rosewood_dance', name: 'Rosewood Mallet Dance', section: 'percussion', power: 18, harmonyCost: 10, effect: 'resonance_boost', description: 'Warm wooden mallet strikes with rich acoustic resonance.' },
    move2: { id: 'tremolo_roll', name: 'Sustained Tremolo', section: 'percussion', power: 27, harmonyCost: 24, effect: 'vibrato_charm', description: 'A shimmering four-mallet roll creating sustained singing chords.' }
  },
  timpani: {
    move1: { id: 'kettle_roll', name: 'Kettledrum Roll', section: 'percussion', power: 21, harmonyCost: 16, effect: 'tempo_lock', description: 'Distant rumbling thunder building steady acoustic power.' },
    move2: { id: 'timpani_rumble', name: 'Timpani Climax', section: 'percussion', power: 30, harmonyCost: 28, effect: 'fortissimo_burst', description: 'A thunderous orchestral climax strike.' }
  },
  glockenspiel: {
    move1: { id: 'crystal_carillon', name: 'Crystal Carillon', section: 'percussion', power: 17, harmonyCost: 10, effect: 'resonance_boost', description: 'Sparkling metallic bells that pierce through any mix.' },
    move2: { id: 'harmonic_chime', name: 'Prismatic Chime', section: 'percussion', power: 26, harmonyCost: 22, effect: 'vibrato_charm', description: 'Pure bell overtones that shimmer with ethereal brilliance.' }
  }
};

export function getBattleMovesForMusician(m: Musician): BattleMove[] {
  const instMoves = INSTRUMENT_BATTLE_MOVES[m.instrumentId] || INSTRUMENT_BATTLE_MOVES.violin;
  return [
    instMoves.move1,
    instMoves.move2,
    BATTLE_MOVES.pianissimo_shield,
    BATTLE_MOVES.fortissimo_surge
  ];
}

/* ---------------- MUSIC THEORY CHALLENGES (8 PROGRESSIVE TIERS) ---------------- */

export interface CurriculumTier {
  id: TheoryChallengeType;
  title: string;
  tier: number;
  rewardSparks: number;
  rewardSightReading: number;
  questions: TheoryQuestion[];
}

export const THEORY_CURRICULUM: CurriculumTier[] = [
  {
    id: 'pitch_recognition_1',
    title: 'Tier 1: Pitch & Interval Fundamentals',
    tier: 1,
    rewardSparks: 25,
    rewardSightReading: 3,
    questions: [
      {
        prompt: '🎵 Pitch Ear-Training Drill',
        subtext: 'Identify the acoustic pitch sounded by the tuning crystal:',
        notesToPlay: [440.0],
        options: ['C4 (Middle C)', 'A4 (Concert Pitch 440Hz)', 'E4 (Fifth of A)', 'G4 (Dominant of C)'],
        correctIndex: 1,
        explanation: '440 Hz corresponds to standard orchestral Concert A4!'
      },
      {
        prompt: '🎵 Major Third Harmonic Drill',
        subtext: 'Two pitches sound in succession (C4 then E4). What interval is this?',
        notesToPlay: [261.63, 329.63],
        options: ['Minor Second', 'Major Third (4 semitones)', 'Perfect Fifth', 'Octave'],
        correctIndex: 1,
        explanation: 'C to E is a Major Third, the foundational harmonic building block of major triads!'
      },
      {
        prompt: '🎵 Octave Leap Drill',
        subtext: 'A pitch jumps from C4 up to C5. What is this acoustic ratio?',
        notesToPlay: [261.63, 523.25],
        options: ['Tritone', 'Major Seventh', 'Perfect Octave (2:1 frequency ratio)', 'Minor Sixth'],
        correctIndex: 2,
        explanation: 'A doubling in fundamental frequency produces a pure Perfect Octave!'
      },
      {
        prompt: '🎵 Minor Second Half-Step Drill',
        subtext: 'What interval separates E4 and F4 (or B4 and C5)?',
        notesToPlay: [329.63, 349.23],
        options: ['Minor Second (Half step)', 'Major Second (Whole step)', 'Minor Third', 'Unison'],
        correctIndex: 0,
        explanation: 'E to F and B to C are natural half steps (minor seconds) with no black keys between them!'
      },
      {
        prompt: '🎵 Perfect Fourth Interval',
        subtext: 'What interval spans from C4 to F4 (5 semitones)?',
        notesToPlay: [261.63, 349.23],
        options: ['Major Second', 'Major Third', 'Perfect Fourth (5 semitones)', 'Diminished Fifth'],
        correctIndex: 2,
        explanation: 'C to F is a Perfect Fourth, the inverted complement of a Perfect Fifth!'
      },
      {
        prompt: '🎼 Treble Clef Landmark Note',
        subtext: 'The Treble Clef (G Clef) curls around which staff line?',
        options: ['First line (E)', 'Second line from bottom (G4)', 'Third line (B)', 'Fourth line (D)'],
        correctIndex: 1,
        explanation: 'The Treble Clef is also known as the G Clef because its spiral centers directly on G4!'
      },
      {
        prompt: '🎼 Bass Clef Landmark Note',
        subtext: 'The two dots of the Bass Clef (F Clef) enclose which staff line?',
        options: ['Second line (B)', 'Third line (D)', 'Fourth line from bottom (F3)', 'Top line (A)'],
        correctIndex: 2,
        explanation: 'The Bass Clef encloses the fourth line, marking F3 below Middle C!'
      },
      {
        prompt: '🎵 Pitch & Sound Waves',
        subtext: 'As an acoustic sound wave increases in frequency (Hertz), what happens to its pitch?',
        options: ['It becomes lower', 'It becomes higher', 'It stays identical', 'It turns into noise'],
        correctIndex: 1,
        explanation: 'Higher frequency (more vibrations per second) produces a higher perceived musical pitch!'
      },
      {
        prompt: '🎵 Unison Definition',
        subtext: 'When two musicians play the exact same pitch simultaneously, what interval is formed?',
        options: ['Perfect Octave', 'Perfect Unison (Prime)', 'Major Second', 'Tuning Harmonic'],
        correctIndex: 1,
        explanation: 'Playing the exact same pitch simultaneously creates a Perfect Unison (1:1 ratio)!'
      },
      {
        prompt: '🎼 Enharmonic Equivalents',
        subtext: 'Which pitch is the enharmonic equivalent of C# (sounding identical on a piano)?',
        options: ['B#', 'Db (D Flat)', 'D#', 'Cb'],
        correctIndex: 1,
        explanation: 'C# and Db are enharmonic equivalents: different notation names for the same pitch!'
      }
    ]
  },
  {
    id: 'key_signatures_1',
    title: 'Tier 2: Key Signatures & Sharps',
    tier: 2,
    rewardSparks: 40,
    rewardSightReading: 4,
    questions: [
      {
        prompt: '🎼 Key Signature Identification',
        subtext: 'A piece has ONE SHARP (F#) in its clef. What major key is this?',
        options: ['C Major', 'G Major (1 Sharp: F#)', 'D Major (2 Sharps)', 'F Major (1 Flat)'],
        correctIndex: 1,
        explanation: 'Following the Circle of Fifths, G Major contains one sharp: F sharp!'
      },
      {
        prompt: '🎼 Key Signature Identification',
        subtext: 'A sonata score has TWO SHARPS (F# and C#). What major key is this?',
        options: ['D Major', 'A Major', 'E Major', 'B Major'],
        correctIndex: 0,
        explanation: 'D Major features F# and C# as its diatonic signature!'
      },
      {
        prompt: '🎼 Key Signature Identification',
        subtext: 'A pastoral waltz has ONE FLAT (Bb) in its signature. What major key is this?',
        options: ['G Major', 'Eb Major', 'F Major', 'Ab Major'],
        correctIndex: 2,
        explanation: 'F Major is the first flat key on the Circle of Fifths, containing Bb!'
      },
      {
        prompt: '🎼 Key Signature Identification',
        subtext: 'Which major key has NO SHARPS and NO FLATS in its signature?',
        options: ['G Major', 'C Major', 'D Major', 'A Minor (Natural)'],
        correctIndex: 1,
        explanation: 'C Major is the natural major scale with zero sharps and zero flats!'
      },
      {
        prompt: '🎼 Key Signature Identification',
        subtext: 'A fanfare has THREE SHARPS (F#, C#, G#). What major key is this?',
        options: ['E Major', 'A Major', 'B Major', 'F# Major'],
        correctIndex: 1,
        explanation: 'A Major contains three sharps: F#, C#, and G#!'
      },
      {
        prompt: '🎼 Key Signature Identification',
        subtext: 'A nocturne has TWO FLATS (Bb and Eb). What major key is this?',
        options: ['F Major', 'Bb Major', 'Eb Major', 'Ab Major'],
        correctIndex: 1,
        explanation: 'Bb Major contains two flats: Bb and Eb!'
      },
      {
        prompt: '🎼 Mnemonic: Order of Sharps',
        subtext: 'What is the standard order in which sharps appear in a key signature?',
        options: ['F - C - G - D - A - E - B', 'B - E - A - D - G - C - F', 'C - G - D - A - E - B - F', 'F - G - A - B - C - D - E'],
        correctIndex: 0,
        explanation: 'The order of sharps is always F C G D A E B (Father Charles Goes Down And Ends Battle)!'
      },
      {
        prompt: '🎼 Mnemonic: Order of Flats',
        subtext: 'What is the standard order in which flats appear in a key signature?',
        options: ['F - C - G - D - A - E - B', 'B - E - A - D - G - C - F', 'B - D - G - C - F - A - E', 'A - B - C - D - E - F - G'],
        correctIndex: 1,
        explanation: 'The order of flats is B E A D G C F (the reverse of sharps)!'
      },
      {
        prompt: '🎼 Key Signature Identification',
        subtext: 'A brass march features FOUR SHARPS (F#, C#, G#, D#). What major key is this?',
        options: ['A Major', 'E Major', 'B Major', 'C# Major'],
        correctIndex: 1,
        explanation: 'E Major contains four sharps: F#, C#, G#, and D#!'
      },
      {
        prompt: '🎼 Key Signature Identification',
        subtext: 'A chorale features THREE FLATS (Bb, Eb, Ab). What major key is this?',
        options: ['Bb Major', 'Eb Major', 'Ab Major', 'Db Major'],
        correctIndex: 1,
        explanation: 'Eb Major contains three flats: Bb, Eb, and Ab!'
      }
    ]
  },
  {
    id: 'rhythm_meter_1',
    title: 'Tier 3: Time Signatures & Subdivisions',
    tier: 3,
    rewardSparks: 60,
    rewardSightReading: 6,
    questions: [
      {
        prompt: '🥁 Meter & Measures Drill',
        subtext: 'In 4/4 Common Time, how many quarter notes constitute a complete measure?',
        options: ['2 Beats', '3 Beats', '4 Beats', '6 Beats'],
        correctIndex: 2,
        explanation: 'The top 4 indicates four beats per measure, and bottom 4 represents quarter notes.'
      },
      {
        prompt: '🥁 Note Value Subdivision',
        subtext: 'How many sixteenth notes fit inside a single half note (minim)?',
        options: ['4 Sixteenths', '6 Sixteenths', '8 Sixteenths', '16 Sixteenths'],
        correctIndex: 2,
        explanation: 'A half note is 2 beats = 8 sixteenth notes (4 per quarter note).'
      },
      {
        prompt: '🥁 Rhythmic Syncopation',
        subtext: 'What musical phenomenon occurs when accents deliberately fall on weak off-beats?',
        options: ['Staccato', 'Syncopation', 'Fermata', 'Glissando'],
        correctIndex: 1,
        explanation: 'Syncopation drives rhythmic energy by accenting off-beats!'
      },
      {
        prompt: '🥁 Triple Meter (Waltz)',
        subtext: 'Which time signature represents classic 3-beat triple meter (e.g. Minuet or Waltz)?',
        options: ['2/4', '3/4', '4/4', '6/8'],
        correctIndex: 1,
        explanation: '3/4 indicates three quarter note beats per measure (ONE - two - three)!'
      },
      {
        prompt: '🥁 Compound Meter (6/8)',
        subtext: 'In 6/8 time, how are the eight notes typically grouped and felt?',
        options: ['3 groups of 2 eighth notes', '2 dotted-quarter pulses (groups of 3 eighths)', '6 equal heavy pulses', '4 quarter pulses'],
        correctIndex: 1,
        explanation: '6/8 is compound duple meter: 2 main dotted-quarter beats, each divided into 3 eighth notes!'
      },
      {
        prompt: '🥁 Dotted Note Values',
        subtext: 'What does a dot placed after a note value do to its duration?',
        options: ['Doubles its value', 'Adds half of its original value', 'Subtracts a quarter value', 'Makes it staccato'],
        correctIndex: 1,
        explanation: 'A dot adds 50% of the note duration (e.g., a dotted half note is 2 + 1 = 3 beats)!'
      },
      {
        prompt: '🥁 Triplet Rhythms',
        subtext: 'What is a rhythmic Triplet?',
        options: ['3 notes played in the normal space of 2', '2 notes played in the space of 3', '4 sixteenth notes', 'A 3-beat rest'],
        correctIndex: 0,
        explanation: 'A triplet fits 3 equal notes into the standard time span of 2 notes of that value!'
      },
      {
        prompt: '🥁 Alla Breve / Cut Time',
        subtext: 'The Cut Time symbol (¢) corresponds to which time signature?',
        options: ['2/4', '2/2', '3/2', '4/2'],
        correctIndex: 1,
        explanation: 'Cut Time (Alla Breve) is 2/2: two half-note beats per measure for brisk tempos!'
      },
      {
        prompt: '🥁 Rests Identification',
        subtext: 'Which rest symbol hangs down below the fourth staff line?',
        options: ['Quarter Rest', 'Half Rest (sits on 3rd line)', 'Whole Rest (hangs below 4th line)', 'Eighth Rest'],
        correctIndex: 2,
        explanation: 'A Whole Rest hangs down below the fourth line, representing an entire measure of silence!'
      },
      {
        prompt: '🥁 Anacrusis / Pickup Measure',
        subtext: 'What term describes notes that precede the first full downbeat of a piece?',
        options: ['Coda', 'Anacrusis (Pickup note / Upbeat)', 'Cadenza', 'Tutti'],
        correctIndex: 1,
        explanation: 'An Anacrusis (pickup) leads into the first strong downbeat of the opening measure!'
      }
    ]
  },
  {
    id: 'intervals_ear_training',
    title: 'Tier 4: Advanced Intervals & The Tritone',
    tier: 4,
    rewardSparks: 85,
    rewardSightReading: 8,
    questions: [
      {
        prompt: '🎵 Perfect Fifth Recognition',
        subtext: 'Listen to the interval from C4 to G4 (3:2 ratio):',
        notesToPlay: [261.63, 392.00],
        options: ['Perfect Fourth', 'Perfect Fifth (7 semitones)', 'Minor Third', 'Major Sixth'],
        correctIndex: 1,
        explanation: 'The Perfect Fifth (7 semitones) forms the basis of Western tonal harmony and tuning!'
      },
      {
        prompt: '🎵 The Dissonant Tritone',
        subtext: 'Listen to C4 followed by F#4 (6 semitones):',
        notesToPlay: [261.63, 369.99],
        options: ['Major Second', 'Perfect Fifth', 'Tritone (Augmented 4th / Diminished 5th)', 'Octave'],
        correctIndex: 2,
        explanation: 'The Tritone exactly bisects the octave (6 semitones), historically called diabolus in musica!'
      },
      {
        prompt: '🎵 Lyrical Minor Third',
        subtext: 'Listen to A4 falling to C5 (or A4 to C4 ascending):',
        notesToPlay: [440.00, 523.25],
        options: ['Minor Third (3 semitones)', 'Major Third (4 semitones)', 'Unison', 'Perfect Fourth'],
        correctIndex: 0,
        explanation: 'A Minor Third (3 semitones) gives minor scales and chords their introspective character!'
      },
      {
        prompt: '🎵 Major Sixth Interval',
        subtext: 'What interval spans from C4 up to A4 (9 semitones, like the opening of "My Bonnie")?',
        notesToPlay: [261.63, 440.00],
        options: ['Perfect Fifth', 'Minor Sixth', 'Major Sixth (9 semitones)', 'Major Seventh'],
        correctIndex: 2,
        explanation: 'C to A is a Major Sixth (9 semitones), known for its bright, uplifting harmonic quality!'
      },
      {
        prompt: '🎵 Minor Seventh Interval',
        subtext: 'What interval spans from C4 up to Bb4 (10 semitones, the basis of dominant 7th chords)?',
        notesToPlay: [261.63, 466.16],
        options: ['Major Sixth', 'Minor Seventh (10 semitones)', 'Major Seventh', 'Octave'],
        correctIndex: 1,
        explanation: 'The Minor Seventh (10 semitones) creates the bluesy, urgent tension in dominant chords!'
      },
      {
        prompt: '🎵 Major Seventh Interval',
        subtext: 'What interval spans from C4 up to B4 (11 semitones, one half step below the octave)?',
        notesToPlay: [261.63, 493.88],
        options: ['Minor Seventh', 'Major Seventh (11 semitones)', 'Perfect Octave', 'Minor Ninth'],
        correctIndex: 1,
        explanation: 'The Major Seventh (11 semitones) has a lush, ethereal, dreamy tension resolving to the tonic!'
      },
      {
        prompt: '🎼 Interval Inversion Rule',
        subtext: 'When you invert an interval (e.g. C-to-E Major 3rd becomes E-to-C), what does it become?',
        options: ['Minor 3rd', 'Minor 6th (Rule of 9)', 'Major 6th', 'Perfect 5th'],
        correctIndex: 1,
        explanation: 'By the Rule of 9: intervals and their inversions sum to 9, and Major always inverts to Minor!'
      },
      {
        prompt: '🎵 Consonance vs Dissonance',
        subtext: 'Which of the following interval pairs is considered a Perfect Consonance in acoustics?',
        options: ['Major 2nd and Minor 7th', 'Tritone and Minor 2nd', 'Perfect Unison, Octave & Perfect 5th', 'Major 7th and Minor 3rd'],
        correctIndex: 2,
        explanation: 'Unisons, Octaves, and Perfect Fifths represent the purest acoustic consonances with simple integer ratios!'
      },
      {
        prompt: '🎵 Minor Sixth Interval',
        subtext: 'What interval spans from C4 to Ab4 (8 semitones, as in the Love Story theme)?',
        notesToPlay: [261.63, 415.30],
        options: ['Perfect Fifth', 'Minor Sixth (8 semitones)', 'Major Sixth', 'Diminished Seventh'],
        correctIndex: 1,
        explanation: 'A Minor Sixth (8 semitones) carries a dramatic, poignant emotional character!'
      },
      {
        prompt: '🎵 Major Second / Whole Step',
        subtext: 'How many half steps (semitones) constitute a Major Second (Whole Tone)?',
        notesToPlay: [261.63, 293.66],
        options: ['1 Semitone', '2 Semitones', '3 Semitones', '4 Semitones'],
        correctIndex: 1,
        explanation: 'A Major Second equals two semitones (e.g. C to D)!'
      }
    ]
  },
  {
    id: 'triads_chords',
    title: 'Tier 5: Triad Inversions & Harmonies',
    tier: 5,
    rewardSparks: 115,
    rewardSightReading: 10,
    questions: [
      {
        prompt: '🎼 Major Triad Construction',
        subtext: 'What scale degrees compose a standard root-position Major Triad?',
        options: ['1 - 2 - 3', '1 - 3 - 5', '1 - 4 - 5', '1 - 3 - 7'],
        correctIndex: 1,
        explanation: 'A major triad consists of the Root, Major Third, and Perfect Fifth (1-3-5)!'
      },
      {
        prompt: '🎼 Dominant Seventh Chords',
        subtext: 'Adding a minor seventh on top of a major triad creates which functional chord?',
        options: ['Major 7th', 'Dominant 7th (V7)', 'Diminished 7th', 'Suspended 4th'],
        correctIndex: 1,
        explanation: 'Dominant 7th chords provide the strong tension that resolves naturally to the tonic!'
      },
      {
        prompt: '🎼 First Inversion Triads',
        subtext: 'When the third of a chord is in the lowest bass voice, what inversion is it?',
        options: ['Root Position', 'First Inversion (6/3)', 'Second Inversion (6/4)', 'Third Inversion'],
        correctIndex: 1,
        explanation: 'Having the chord third in the bass places the triad in First Inversion.'
      },
      {
        prompt: '🎼 Minor Triad Construction',
        subtext: 'How does a Minor Triad differ from a Major Triad with the same root?',
        options: ['It has a flat fifth', 'It has a lowered (minor) third', 'It has a sharp root', 'It has two octaves'],
        correctIndex: 1,
        explanation: 'A minor triad lowers the third by a half step (Root - Minor 3rd - Perfect 5th / 1 - b3 - 5)!'
      },
      {
        prompt: '🎼 Second Inversion Triads',
        subtext: 'When the fifth of a chord is placed in the lowest bass voice, what inversion is it?',
        options: ['Root Position', 'First Inversion', 'Second Inversion (6/4)', 'Fourth Inversion'],
        correctIndex: 2,
        explanation: 'The fifth in the bass produces a Second Inversion (6/4) triad, often used in cadences!'
      },
      {
        prompt: '🎼 Diminished Triads',
        subtext: 'What intervals are stacked together to build a Diminished Triad?',
        options: ['Two Major Thirds', 'Two Minor Thirds (Root - b3 - b5)', 'A Major Third and a Perfect 5th', 'A Fourth and a Third'],
        correctIndex: 1,
        explanation: 'A diminished triad consists of two stacked minor thirds, creating a tense diminished 5th!'
      },
      {
        prompt: '🎼 Augmented Triads',
        subtext: 'What intervals are stacked together to build an Augmented Triad?',
        options: ['Two Major Thirds (Root - 3 - #5)', 'Two Minor Thirds', 'A Minor Third and a Fourth', 'Two Perfect Fourths'],
        correctIndex: 0,
        explanation: 'An augmented triad stacks two major thirds, raising the fifth by a half step!'
      },
      {
        prompt: '🎼 Root Position Bass',
        subtext: 'When the root pitch is in the lowest bass register, what position is the chord in?',
        options: ['Root Position (5/3)', 'First Inversion', 'Second Inversion', 'Open Voicing'],
        correctIndex: 0,
        explanation: 'Root Position means the fundamental pitch of the triad anchors the bass voice.'
      },
      {
        prompt: '🎼 Authentic Cadence (V - I)',
        subtext: 'What harmonic progression creates the most definitive sense of resolution in tonal music?',
        options: ['IV to I (Plagal / Amen)', 'V to I (Authentic Cadence)', 'ii to V (Half Cadence)', 'vi to IV (Deceptive)'],
        correctIndex: 1,
        explanation: 'The Dominant to Tonic (V to I) Authentic Cadence resolves all harmonic tension!'
      },
      {
        prompt: '🎼 Voice Leading Principles',
        subtext: 'What is the golden rule of smooth orchestral voice leading between chords?',
        options: ['Make voices jump as far as possible', 'Move voices by the smallest possible melodic steps', 'Always cross voices', 'Play all notes staccato'],
        correctIndex: 1,
        explanation: 'Smooth voice leading prioritizes stepwise motion and common tones between harmonies!'
      }
    ]
  },
  {
    id: 'advanced_keys_circle',
    title: 'Tier 6: The Circle of Fifths & Relative Minors',
    tier: 6,
    rewardSparks: 150,
    rewardSightReading: 12,
    questions: [
      {
        prompt: '🎼 Three Sharps Key',
        subtext: 'Which major key features THREE SHARPS (F#, C#, G#)?',
        options: ['E Major', 'A Major', 'B Major', 'F# Major'],
        correctIndex: 1,
        explanation: 'A Major has 3 sharps (F#, C#, G#) and its relative minor is F# minor!'
      },
      {
        prompt: '🎼 Three Flats Key',
        subtext: 'Which major key features THREE FLATS (Bb, Eb, Ab)?',
        options: ['Bb Major', 'Eb Major', 'Ab Major', 'Db Major'],
        correctIndex: 1,
        explanation: 'Eb Major has 3 flats (Bb, Eb, Ab) and its relative minor is C minor!'
      },
      {
        prompt: '🎼 Relative Minor Concept',
        subtext: 'What is the Relative Minor key to C Major (sharing no sharps and no flats)?',
        options: ['D Minor', 'E Minor', 'A Minor', 'G Minor'],
        correctIndex: 2,
        explanation: 'A Minor is the natural relative minor to C Major, starting on scale degree 6.'
      },
      {
        prompt: '🎼 Relative Minor to G Major',
        subtext: 'Which minor key shares the 1-sharp key signature of G Major?',
        options: ['B Minor', 'E Minor', 'A Minor', 'D Minor'],
        correctIndex: 1,
        explanation: 'E Minor is the relative minor of G Major (both share F#)!'
      },
      {
        prompt: '🎼 Circle of Fifths Movement',
        subtext: 'Moving CLOCKWISE around the Circle of Fifths corresponds to what interval transposition?',
        options: ['Up a Perfect Fifth (or down a P4)', 'Down a Perfect Fifth', 'Up a Half Step', 'Up a Minor Third'],
        correctIndex: 0,
        explanation: 'Moving clockwise advances by Perfect Fifths, adding one sharp or subtracting one flat each step!'
      },
      {
        prompt: '🎼 Relative Minor to F Major',
        subtext: 'Which minor key shares the 1-flat key signature of F Major?',
        options: ['G Minor', 'D Minor', 'C Minor', 'Bb Minor'],
        correctIndex: 1,
        explanation: 'D Minor is the relative minor of F Major (both share Bb)!'
      },
      {
        prompt: '🎼 Parallel Keys vs Relative Keys',
        subtext: 'How do Parallel Keys (e.g. C Major and C Minor) differ from Relative Keys?',
        options: ['They share the exact same key signature', 'They share the same tonic root pitch (C) but different scale notes', 'They are an octave apart', 'They have identical chords'],
        correctIndex: 1,
        explanation: 'Parallel keys share the exact same tonic keynote (C) but have different diatonic signatures!'
      },
      {
        prompt: '🎼 Five Sharps Key',
        subtext: 'Which major key features FIVE SHARPS (F#, C#, G#, D#, A#)?',
        options: ['E Major', 'B Major', 'F# Major', 'C# Major'],
        correctIndex: 1,
        explanation: 'B Major contains 5 sharps, and its relative minor is G# minor!'
      },
      {
        prompt: '🎼 Four Flats Key',
        subtext: 'Which major key features FOUR FLATS (Bb, Eb, Ab, Db)?',
        options: ['Eb Major', 'Ab Major', 'Db Major', 'Gb Major'],
        correctIndex: 1,
        explanation: 'Ab Major contains 4 flats, and its relative minor is F minor!'
      },
      {
        prompt: '🎼 The Leading Tone',
        subtext: 'What is the 7th scale degree called in major and harmonic minor scales?',
        options: ['Subdominant', 'Dominant', 'Leading Tone (Subtonic half-step below tonic)', 'Mediant'],
        correctIndex: 2,
        explanation: 'The Leading Tone resides a half-step below the tonic and has a powerful pull to resolve upward!'
      }
    ]
  },
  {
    id: 'tempo_dynamics_terms',
    title: 'Tier 7: Italian Terms, Dynamics & Expression',
    tier: 7,
    rewardSparks: 190,
    rewardSightReading: 15,
    questions: [
      {
        prompt: '🎭 Tempo Markings',
        subtext: 'Which Italian term indicates a fast, brisk, and lively tempo?',
        options: ['Adagio (Slow & stately)', 'Andante (Walking pace)', 'Allegro (Fast & lively)', 'Largo (Broad & heavy)'],
        correctIndex: 2,
        explanation: 'Allegro translates to joyful and lively, indicating a swift tempo (120-156 BPM)!'
      },
      {
        prompt: '🎭 Dynamic Contrast',
        subtext: 'What does the term "Subito Pianissimo" (sub. pp) instruct the ensemble to do?',
        options: ['Gradually get louder', 'Suddenly become very quiet', 'Hold the note indefinitely', 'Play with heavy accents'],
        correctIndex: 1,
        explanation: 'Subito means suddenly, and pianissimo means very soft, creating dramatic tension!'
      },
      {
        prompt: '🎭 Articulation Marks',
        subtext: "What does a \"Fermata\" (𝄐 bird's eye) symbol above a note indicate?",
        options: ['Repeat the measure', 'Hold the note longer than its written value', 'Play very short', 'Mute the instrument'],
        correctIndex: 1,
        explanation: 'A Fermata indicates the performer or conductor holds the note at their artistic discretion.'
      },
      {
        prompt: '🎭 Volume Transition',
        subtext: 'What do the symbols "Crescendo" (<) and "Decrescendo" (>) instruct the performers?',
        options: ['Speed up then slow down', 'Gradually grow louder, then gradually grow softer', 'Play staccato then legato', 'Change octave'],
        correctIndex: 1,
        explanation: 'Crescendo means gradually increasing volume; decrescendo means gradually softening!'
      },
      {
        prompt: '🎭 Articulation Styles',
        subtext: 'What is the distinction between "Staccato" (dot) and "Legato" (slur)?',
        options: ['Loud vs soft', 'Fast vs slow', 'Short/detached notes vs smooth/connected notes', 'High pitch vs low pitch'],
        correctIndex: 2,
        explanation: 'Staccato notes are detached and crisp, while legato phrases are smooth and seamless.'
      },
      {
        prompt: '🎭 Slow Tempos',
        subtext: 'Which pair of terms describes slow, majestic, stately tempos?',
        options: ['Presto and Vivace', 'Adagio and Largo', 'Allegretto and Moderato', 'Accelerando and Stringendo'],
        correctIndex: 1,
        explanation: 'Largo (broad/very slow) and Adagio (slow/at ease) denote dignified, slow speeds!'
      },
      {
        prompt: '🎭 Tempo Changes',
        subtext: 'What do "Accelerando" (accel.) and "Ritardando" (rit.) mean in performance?',
        options: ['Gradually speed up, and gradually slow down', 'Get louder and get softer', 'Transpose up a fifth and down a fifth', 'Mute and un-mute'],
        correctIndex: 0,
        explanation: 'Accelerando accelerates the tempo, while ritardando slows the pacing down.'
      },
      {
        prompt: '🎭 Sudden Dynamic Shift',
        subtext: 'What does the dynamic marking "Forte-Piano" (fp) instruct?',
        options: ['Play on a grand piano', 'Strike the note loudly then immediately drop to soft', 'Alternate loud and soft measures', 'Play at medium volume'],
        correctIndex: 1,
        explanation: 'Forte-piano demands an energetic forte attack followed instantly by a drop to piano!'
      },
      {
        prompt: '🎭 Expressive Timing',
        subtext: 'What does "Tempo Rubato" (robbed time) allow the soloist or conductor to do?',
        options: ['Play without any rhythm', 'Take expressive liberties by stretching and flexing the tempo', 'Skip measures at will', 'Play exactly like a machine'],
        correctIndex: 1,
        explanation: 'Rubato introduces expressive elasticity, subtly stealing time from one beat and giving it to another!'
      },
      {
        prompt: '🎭 Fiery Expression',
        subtext: 'What does the musical directive "Con Brio" or "Vivace" call for?',
        options: ['With sadness and weeping', 'With fire, vigor, and lively spirited tempo', 'Very quietly in the shadows', 'Like a funeral march'],
        correctIndex: 1,
        explanation: 'Con Brio means "with brilliance and vigor", bringing dazzling energy to the music!'
      }
    ]
  },
  {
    id: 'orchestral_acoustics',
    title: 'Tier 8: Grand Conservatory Acoustics & Timbre',
    tier: 8,
    rewardSparks: 260,
    rewardSightReading: 20,
    questions: [
      {
        prompt: '🎻 Harmonic Overtone Series',
        subtext: 'Touching a string lightly at its midpoint produces which overtone node?',
        options: ['The Fundamental', 'The 2nd Harmonic (Octave higher)', 'A Major Third', 'A Tritone'],
        correctIndex: 1,
        explanation: 'Dividing the vibrating string in half (node at 1/2) isolates the 2nd harmonic octave!'
      },
      {
        prompt: '🎺 Transposing Instruments',
        subtext: 'When a Bb Trumpet or Bb Clarinet plays written C, which concert pitch sounds?',
        options: ['Concert C', 'Concert Bb (Major second lower)', 'Concert D', 'Concert F'],
        correctIndex: 1,
        explanation: 'Bb instruments sound a major second lower than written pitch!'
      },
      {
        prompt: '🎼 Orchestral Timbre Fusion',
        subtext: 'Combining strings and woodwinds in unison octaves produces which acoustic effect?',
        options: ['Phase cancellation', 'Sympathetic resonance & rich harmonic warmth', 'Total dissonance', 'Tempo drift'],
        correctIndex: 1,
        explanation: 'Unison orchestral doubling enriches the composite timbre across harmonic spectrums!'
      },
      {
        prompt: '🏛️ Acoustic Formants',
        subtext: 'What acoustic property gives each instrument family and the human voice its distinct tonal color?',
        options: ['Formants (Fixed frequency resonance peaks)', 'Pure sine vibrations', 'Equal temperament tuning', 'Metronome calibration'],
        correctIndex: 0,
        explanation: 'Formants are natural acoustic resonance peaks of the instrument body that shape its unique timbre!'
      },
      {
        prompt: '🏛️ Concert Hall Reverberation (RT60)',
        subtext: 'What is the optimal reverberation decay time (RT60) for a symphonic concert hall?',
        options: ['0.2 seconds (dry studio)', '1.8 to 2.2 seconds (warm orchestral bloom)', '8.5 seconds (cathedral echo)', '60 seconds'],
        correctIndex: 1,
        explanation: 'A reverberation time of roughly 1.8 to 2.2 seconds allows orchestral chords to bloom without losing articulation!'
      },
      {
        prompt: '🎺 Bore Geometry & Tone',
        subtext: 'Why does a French Horn sound warm and mellow compared to a sharp, piercing Trumpet?',
        options: ['It uses different metal', 'It has a Conical (cone-expanding) bore rather than a Cylindrical bore', 'It plays an octave lower', 'It has no valves'],
        correctIndex: 1,
        explanation: 'Conical bore instruments (French Horn, Tuba, Euphonium) produce mellow, rounded overtones compared to cylindrical bores!'
      },
      {
        prompt: '🎼 Temperament Systems',
        subtext: 'What is the primary feature of modern 12-Tone Equal Temperament (12-TET)?',
        options: ['All fifths are acoustically pure', 'The octave is divided into 12 semitones with identical frequency ratios (2^(1/12))', 'Only C major sounds in tune', 'It uses microtones'],
        correctIndex: 1,
        explanation: 'Equal temperament slightly tempers intervals so music can modulate freely into all 12 keys without retuning!'
      },
      {
        prompt: '🎻 Sympathetic Resonance',
        subtext: 'What acoustic phenomenon causes an unplayed cello string to vibrate when a nearby violin plays its pitch?',
        options: ['Acoustic Feedback', 'Sympathetic Resonance (Harmonic induction)', 'Destructive Interference', 'Flutter-tonguing'],
        correctIndex: 1,
        explanation: 'Sympathetic resonance occurs when acoustic air waves vibrate physical objects tuned to matching frequencies!'
      },
      {
        prompt: '🎺 Brass Mutes & Acoustics',
        subtext: 'What acoustic effect does a "Harmon Mute" (with stem removed) create on a solo trumpet?',
        options: ['Loud booming bass', 'A buzzy, metallic "Miles Davis" wah-wah timbre', 'Pure organ tone', 'Muted silence'],
        correctIndex: 1,
        explanation: 'The Harmon mute forces sound through a chamber, isolating high metallic buzzing frequencies!'
      },
      {
        prompt: '🪈 Double Reed Physics',
        subtext: 'Why do Oboes and Bassoons possess a piercing, reedy, cutting orchestral presence?',
        options: ['They use electronic pickups', 'Two vibrating cane reeds produce strong prominent upper harmonics across all spectrums', 'They are louder than brass', 'They are made of brass'],
        correctIndex: 1,
        explanation: 'Double reeds vibrate against each other, generating a very rich spectrum of high odd and even harmonics!'
      }
    ]
  }
];

export const THEORY_CHALLENGES: Record<string, TheoryQuestion[]> = Object.fromEntries(
  THEORY_CURRICULUM.map(tier => [tier.id, tier.questions])
);

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
    id: 'piece_mountain_rondo',
    title: 'Mountain Rondo & Thunder Bell',
    composer: 'Chief Korath',
    genre: 'Rhythmic Folk Suite',
    difficulty: 4,
    minEnsembleTier: 'chamber',
    requiredSections: { strings: 1, woodwinds: 1, brass: 1, percussion: 2 },
    bpm: 136,
    chords: [
      { strings: [220, 261, 329], winds: [440, 523], brass: [220, 440], percussion: 'timpani' },
      { strings: [174, 220, 261], winds: [349, 440], brass: [174, 349], percussion: 'snare_kit' },
      { strings: [196, 246, 293], winds: [392, 493], brass: [196, 392], percussion: 'timpani' },
      { strings: [220, 261, 329], winds: [440, 523], brass: [220, 440], percussion: 'glockenspiel' }
    ],
    melody: [440, 523, 659, 523, 440, 392, 440, 523],
    description: 'A dynamic, thundering percussion feature that echoes off the canyon walls with polyrhythmic fury.',
    masteryXp: 750,
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
    description: 'A cheerful local street busker looking for a friendly musical exchange at the Cavatina gazebo.'
  },
  {
    id: 'rival_woodwind_trio',
    name: 'The Whispering Canopy Trio',
    tier: 'trio',
    conductorName: 'Master Sylvan',
    members: [
      {
        id: 'rival_sylvan',
        name: 'Master Sylvan',
        title: 'Forest Flutist',
        avatar: '🪈',
        paletteColor: '#10b981',
        instrumentId: 'silver_flute',
        instrumentName: 'Silver Concert Flute',
        section: 'woodwinds',
        pet: {
          id: 'pet_finch_sylvan',
          name: 'Zephyr',
          species: 'Canopy Finch',
          sprite: 'finch',
          section: 'woodwinds',
          instrumentName: 'Concert Flute',
          leitmotifSound: 'flute_chirp',
          color: '#10b981'
        },
        stats: { technique: 45, toneQuality: 45, tempoStability: 40, sightReading: 40 },
        level: 4,
        xp: 300
      },
      {
        id: 'rival_reed',
        name: 'Reed',
        title: 'Cane Oboist',
        avatar: '🌾',
        paletteColor: '#059669',
        instrumentId: 'oboe',
        instrumentName: 'Rosewood Oboe',
        section: 'woodwinds',
        pet: {
          id: 'pet_otter_reed',
          name: 'Echo',
          species: 'River Otter',
          sprite: 'otter',
          section: 'woodwinds',
          instrumentName: 'Oboe',
          leitmotifSound: 'oboe_melody',
          color: '#059669'
        },
        stats: { technique: 40, toneQuality: 42, tempoStability: 38, sightReading: 38 },
        level: 3,
        xp: 250
      },
      {
        id: 'rival_moss',
        name: 'Rowan',
        title: 'Woodland Cellist',
        avatar: '🎻',
        paletteColor: '#047857',
        instrumentId: 'cello',
        instrumentName: 'Acoustic Cello',
        section: 'strings',
        pet: {
          id: 'pet_hound_rowan',
          name: 'Cedar',
          species: 'Forest Hound',
          sprite: 'hound',
          section: 'strings',
          instrumentName: 'Acoustic Cello',
          leitmotifSound: 'violin_pure',
          color: '#047857'
        },
        stats: { technique: 42, toneQuality: 44, tempoStability: 40, sightReading: 40 },
        level: 4,
        xp: 280
      }
    ],
    piece: REPERTOIRE_DATABASE[2], // Bossa Nova Serenade
    reputationRequired: 1,
    rewardStars: 2,
    description: 'A nimble woodland trio performing syncopated bossa nova rhythms under the resonant forest canopies.'
  },
  {
    id: 'rival_brass_quartet',
    name: 'The Gilded Citadel Fanfare',
    tier: 'quartet',
    conductorName: 'Baroness Vesta',
    members: [
      {
        id: 'rival_vesta',
        name: 'Baroness Vesta',
        title: 'Citadel Hornist',
        avatar: '📯',
        paletteColor: '#eab308',
        instrumentId: 'french_horn',
        instrumentName: 'Gilded French Horn',
        section: 'brass',
        pet: {
          id: 'pet_ram_vesta',
          name: 'Valiant',
          species: 'Citadel Ram',
          sprite: 'ram',
          section: 'brass',
          instrumentName: 'French Horn',
          leitmotifSound: 'horn_call',
          color: '#eab308'
        },
        stats: { technique: 65, toneQuality: 68, tempoStability: 60, sightReading: 58 },
        level: 6,
        xp: 600
      },
      {
        id: 'rival_cornet_guard',
        name: 'Lieutenant Val',
        title: 'Herald Cornet',
        avatar: '🎺',
        paletteColor: '#ca8a04',
        instrumentId: 'pocket_trumpet',
        instrumentName: 'Golden Trumpet',
        section: 'brass',
        pet: {
          id: 'pet_terrier_val',
          name: 'Blare',
          species: 'Fanfare Terrier',
          sprite: 'terrier',
          section: 'brass',
          instrumentName: 'Golden Trumpet',
          leitmotifSound: 'trumpet_blare',
          color: '#ca8a04'
        },
        stats: { technique: 62, toneQuality: 64, tempoStability: 58, sightReading: 55 },
        level: 6,
        xp: 550
      },
      RECRUITABLE_MUSICIANS[0], // Clara (Strings)
      RECRUITABLE_MUSICIANS[1]  // Oliver (Woodwinds)
    ],
    piece: REPERTOIRE_DATABASE[3], // Starlight Quartet
    reputationRequired: 3,
    rewardStars: 3,
    description: 'A regal brass and string quartet whose wall of sound commands authority across the Citadel concourse.'
  },
  {
    id: 'rival_thunder_chamber',
    name: 'The Mountain Thunder Corps',
    tier: 'chamber',
    conductorName: 'Chief Korath',
    members: [
      {
        id: 'rival_korath',
        name: 'Chief Korath',
        title: 'Thunder Timpanist',
        avatar: '🥁',
        paletteColor: '#8b5cf6',
        instrumentId: 'timpani',
        instrumentName: 'Caldera Timpani',
        section: 'percussion',
        pet: {
          id: 'pet_badger_korath',
          name: 'Grom',
          species: 'Thunder Badger',
          sprite: 'badger',
          section: 'percussion',
          instrumentName: 'Caldera Timpani',
          leitmotifSound: 'timpani_boom',
          color: '#8b5cf6'
        },
        stats: { technique: 80, toneQuality: 82, tempoStability: 85, sightReading: 75 },
        level: 8,
        xp: 850
      },
      RECRUITABLE_MUSICIANS[0], // Clara (Violin)
      RECRUITABLE_MUSICIANS[1], // Oliver (Flute)
      RECRUITABLE_MUSICIANS[2], // Baron (Trumpet)
      RECRUITABLE_MUSICIANS[3]  // Rita (Snare)
    ],
    piece: REPERTOIRE_DATABASE[4], // Mountain Rondo
    reputationRequired: 5,
    rewardStars: 4,
    description: 'A colossal rhythmic chamber troupe driving intricate polyrhythmic grooves with thundering stone bells.'
  },
  {
    id: 'rival_grand_orchestra',
    name: 'The Grand Philharmonic of Sonora',
    tier: 'orchestra',
    conductorName: 'Maestro Valerius',
    members: [
      {
        id: 'rival_valerius',
        name: 'Maestro Valerius',
        title: 'Grand Conductor',
        avatar: '🎼',
        paletteColor: '#ec4899',
        instrumentId: 'violin',
        instrumentName: 'Platinum Maestro Baton',
        section: 'strings',
        pet: {
          id: 'pet_swan_valerius',
          name: 'Sinfonia',
          species: 'Symphony Swan',
          sprite: 'swan',
          section: 'strings',
          instrumentName: 'Grand Baton',
          leitmotifSound: 'violin_pure',
          color: '#ec4899'
        },
        stats: { technique: 95, toneQuality: 98, tempoStability: 95, sightReading: 95 },
        level: 12,
        xp: 2000
      },
      RECRUITABLE_MUSICIANS[0],
      RECRUITABLE_MUSICIANS[1],
      RECRUITABLE_MUSICIANS[2],
      RECRUITABLE_MUSICIANS[3]
    ],
    piece: REPERTOIRE_DATABASE[5], // Ode to Harmony
    reputationRequired: 7,
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
    defaultSpawn: { x: 1000, y: 920, dir: 'down' },
    transitions: [
      { id: 'tr_to_woods', targetZone: 'woodwind_woods', targetSpawn: { x: 120, y: 720, dir: 'right' }, bounds: { x: 1920, y: 640, w: 80, h: 160 }, promptText: '➡️ East Gate: To Woodwind Woods' },
      { id: 'tr_to_citadel', targetZone: 'brass_citadel', targetSpawn: { x: 1000, y: 1460, dir: 'up' }, bounds: { x: 920, y: 0, w: 160, h: 80 }, promptText: '⬆️ North Gate: To Brass Citadel & Metro Cadenza' },
      { id: 'tr_to_peaks', targetZone: 'percussion_peaks', targetSpawn: { x: 1000, y: 140, dir: 'down' }, bounds: { x: 920, y: 1520, w: 160, h: 80 }, promptText: '⬇️ South Bridge: To Percussion Peaks' },
      { id: 'tr_to_grand_hall', targetZone: 'grand_hall', targetSpawn: { x: 1000, y: 1440, dir: 'up' }, bounds: { x: 0, y: 640, w: 80, h: 160 }, promptText: '⬅️ West Arch: To Grand Symphony Hall' }
    ],
    obstacles: [
      // North Boundary (Walls with opening at x: 920-1080 for North Gate to Brass Citadel)
      { type: 'building', buildingType: 'wall', x: 0, y: 0, w: 920, h: 60, name: 'North Village Wall' },
      { type: 'building', buildingType: 'wall', x: 1080, y: 0, w: 920, h: 60, name: 'North Village Wall' },
      { type: 'gate', buildingType: 'gate', x: 920, y: 0, w: 160, h: 60, name: 'North Grand Gate (To Brass Citadel)', signIcon: '⬆️' },

      // South Boundary (River with stone bridge at x: 920-1080 for South Gate to Percussion Peaks)
      { type: 'building', buildingType: 'wall', x: 0, y: 1540, w: 920, h: 60, name: 'South Melodic River' },
      { type: 'building', buildingType: 'wall', x: 1080, y: 1540, w: 920, h: 60, name: 'South Melodic River' },
      { type: 'gate', buildingType: 'bridge', x: 920, y: 1540, w: 160, h: 60, name: 'South River Bridge (To Percussion Peaks)', signIcon: '⬇️' },

      // East Boundary (Woods with opening at y: 640-800 for East Forest Road to Woodwind Woods)
      { type: 'building', buildingType: 'wall', x: 1940, y: 0, w: 60, h: 640, name: 'East Boundary Woods' },
      { type: 'building', buildingType: 'wall', x: 1940, y: 800, w: 60, h: 800, name: 'East Boundary Woods' },
      { type: 'gate', buildingType: 'gate', x: 1940, y: 640, w: 60, h: 160, name: 'East Forest Gate (To Woodwind Woods)', signIcon: '➡️' },

      // West Boundary (Grand Stone Colonnade with opening at y: 640-800 to Grand Symphony Hall)
      { type: 'building', buildingType: 'wall', x: 0, y: 0, w: 60, h: 640, name: 'West Citadel Colonnade' },
      { type: 'building', buildingType: 'wall', x: 0, y: 800, w: 60, h: 800, name: 'West Citadel Colonnade' },
      { type: 'gate', buildingType: 'arch', x: 0, y: 640, w: 60, h: 160, name: 'West Symphony Arch (To Grand Hall)', signIcon: '⬅️' },

      // Village Buildings
      { type: 'building', buildingType: 'academy', x: 220, y: 280, w: 320, h: 220, name: 'Cavatina Music Academy', signIcon: '🎼', roofColor: '#1e3a8a' },
      { type: 'building', buildingType: 'forge', x: 600, y: 280, w: 260, h: 220, name: "Master Luthier's Forge", signIcon: '🎻', roofColor: '#b45309' },
      { type: 'building', buildingType: 'library', x: 1200, y: 280, w: 340, h: 220, name: 'Conservatory Library & Archives', signIcon: '📖', roofColor: '#065f46' },
      { type: 'building', buildingType: 'tavern', x: 380, y: 960, w: 320, h: 220, name: 'The Melodic Rose Tavern & Inn', signIcon: '🍺', roofColor: '#991b1b' },
      { type: 'building', buildingType: 'clocktower', x: 1240, y: 960, w: 320, h: 220, name: 'Cavatina Town Hall & Clocktower', signIcon: '⏰', roofColor: '#4c1d95' },

      // Central Plaza Feature
      { type: 'circle', x: 1000, y: 720, radius: 64, name: 'Clef Fountain' }
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
    defaultSpawn: { x: 120, y: 720, dir: 'right' },
    transitions: [
      { id: 'tr_to_cavatina_from_woods', targetZone: 'cavatina_village', targetSpawn: { x: 1860, y: 720, dir: 'left' }, bounds: { x: 0, y: 640, w: 80, h: 160 }, promptText: '⬅️ West Trail: Back to Cavatina Village' }
    ],
    obstacles: [
      { type: 'box', x: 0, y: 0, w: 2000, h: 60, name: 'Northern Thicket' },
      { type: 'box', x: 0, y: 0, w: 60, h: 640, name: 'Western Tree Wall' },
      { type: 'box', x: 0, y: 800, w: 60, h: 800, name: 'Western Tree Wall' },
      { type: 'box', x: 1940, y: 0, w: 60, h: 1600, name: 'Eastern Bamboo Wall' },
      { type: 'box', x: 0, y: 1540, w: 2000, h: 60, name: 'Southern Briar Patch' },
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
    defaultSpawn: { x: 1000, y: 1460, dir: 'up' },
    transitions: [
      { id: 'tr_to_cavatina_from_citadel', targetZone: 'cavatina_village', targetSpawn: { x: 1000, y: 120, dir: 'down' }, bounds: { x: 920, y: 1520, w: 160, h: 80 }, promptText: '⬇️ South Bastion Gate: Back to Cavatina Village' }
    ],
    obstacles: [
      { type: 'box', x: 0, y: 0, w: 2000, h: 100, name: 'Citadel Golden Wall' },
      { type: 'box', x: 0, y: 0, w: 80, h: 1600, name: 'West Rampart' },
      { type: 'box', x: 1920, y: 0, w: 80, h: 1600, name: 'East Rampart' },
      { type: 'box', x: 0, y: 1540, w: 920, h: 60, name: 'South Wall Left' },
      { type: 'box', x: 1080, y: 1540, w: 920, h: 60, name: 'South Wall Right' },
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
    defaultSpawn: { x: 1000, y: 140, dir: 'down' },
    transitions: [
      { id: 'tr_to_cavatina_from_peaks', targetZone: 'cavatina_village', targetSpawn: { x: 1000, y: 1440, dir: 'up' }, bounds: { x: 920, y: 0, w: 160, h: 80 }, promptText: '⬆️ North Summit Pass: Back to Cavatina Village' }
    ],
    obstacles: [
      { type: 'box', x: 0, y: 0, w: 920, h: 60, name: 'North Cliff Left' },
      { type: 'box', x: 1080, y: 0, w: 920, h: 60, name: 'North Cliff Right' },
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
    defaultSpawn: { x: 1000, y: 1440, dir: 'up' },
    transitions: [
      { id: 'tr_to_cavatina_from_grand_hall', targetZone: 'cavatina_village', targetSpawn: { x: 140, y: 720, dir: 'right' }, bounds: { x: 920, y: 1520, w: 160, h: 80 }, promptText: '⬇️ South Grand Foyer: Back to Cavatina Village' }
    ],
    obstacles: [
      { type: 'box', x: 0, y: 0, w: 2000, h: 120, name: 'Grand Stage Back Wall' },
      { type: 'box', x: 0, y: 1540, w: 920, h: 60, name: 'Foyer Wall Left' },
      { type: 'box', x: 1080, y: 1540, w: 920, h: 60, name: 'Foyer Wall Right' },
      { type: 'box', x: 300, y: 400, w: 1400, h: 200, name: 'Grand Stage Platform' }
    ]
  }
};

/* ---------------- WORLD NPCS ROSTER ---------------- */

export const INITIAL_WORLD_NPCS: WorldNPC[] = [
  // Cavatina Village NPCs & Props
  {
    id: 'npc_practice_shed',
    name: 'Practice Shed Stand',
    title: 'Hone Musicianship & Technique [SPACE]',
    x: 280,
    y: 540,
    zone: 'cavatina_village',
    isProp: true,
    propType: 'music_stand',
    actionType: 'practice_bench',
    dialogue: [
      "Welcome to the Practice Shed! Regular practice sharpens Technique, Tone Quality, and Tempo Stability as you advance through higher BPM tiers."
    ]
  },
  {
    id: 'npc_theory_academy',
    name: 'Academy Theory Lectern',
    title: 'Music Theory Drills & Challenges [SPACE]',
    x: 460,
    y: 540,
    zone: 'cavatina_village',
    isProp: true,
    propType: 'lectern',
    actionType: 'theory_bench',
    theoryType: 'pitch_recognition_1',
    dialogue: [
      "Welcome to the Sonora Music Conservatory! Test your knowledge across 8 progressive curriculum tiers from Pitch Recognition to Orchestral Acoustics."
    ]
  },
  {
    id: 'npc_theory_professor',
    name: 'Professor Lyra',
    title: 'Conservatory Dean [SPACE to Talk]',
    x: 370,
    y: 540,
    zone: 'cavatina_village',
    musicianData: {
      id: 'prof_lyra',
      name: 'Professor Lyra',
      title: 'Academy Dean',
      avatar: '🎓',
      paletteColor: '#38bdf8',
      instrumentId: 'silver_flute',
      instrumentName: 'Silver Baton',
      section: 'woodwinds',
      pet: {
        id: 'pet_finch_lyra',
        name: 'Cadence',
        species: 'Piccolo Finch',
        sprite: 'finch',
        section: 'woodwinds',
        instrumentName: 'Silver Flute',
        leitmotifSound: 'flute_chirp',
        color: '#38bdf8'
      },
      stats: { technique: 50, toneQuality: 50, tempoStability: 50, sightReading: 50 },
      level: 10,
      xp: 1000
    },
    actionType: 'talk',
    dialogue: [
      "Greetings, young maestro! Study the Theory Lectern to advance through our 8-tier curriculum. Every drill permanently elevates your Sight-Reading!",
      "When you feel ready to explore Sonora, the North Gate leads to the Brass Citadel, while the East Gate leads to Woodwind Woods."
    ]
  },
  {
    id: 'npc_luthier_marco',
    name: 'Master Luthier Marco',
    title: 'Artisan Craftsman [SPACE to Forge]',
    x: 730,
    y: 540,
    zone: 'cavatina_village',
    musicianData: {
      id: 'luthier_marco',
      name: 'Master Marco',
      title: 'Master Luthier',
      avatar: '🔨',
      paletteColor: '#d97706',
      instrumentId: 'violin',
      instrumentName: 'Carving Chisel',
      section: 'strings',
      pet: {
        id: 'pet_hare_marco',
        name: 'Varnish',
        species: 'Craftsman Hare',
        sprite: 'hare',
        section: 'strings',
        instrumentName: 'Acoustic Guitar',
        leitmotifSound: 'guitar_strum',
        color: '#d97706'
      },
      stats: { technique: 60, toneQuality: 70, tempoStability: 40, sightReading: 40 },
      level: 8,
      xp: 800
    },
    actionType: 'luthier_shop',
    dialogue: [
      "Welcome to the Forge! Bring me Notes (♪) and Inspiration Sparks (✨) to craft signature instrument artifacts and ascend your tone!"
    ]
  },
  {
    id: 'npc_customization_mirror',
    name: 'Maestro Styling Vanity',
    title: 'Customize Avatar & Instrument [SPACE]',
    x: 1320,
    y: 530,
    zone: 'cavatina_village',
    isProp: true,
    propType: 'vanity',
    actionType: 'customization_mirror',
    dialogue: [
      "Welcome to the Maestro Styling Mirror! Change your outfit, hair, hat, and instrument finish."
    ]
  },
  {
    id: 'npc_music_stand_1',
    name: 'Historic Music Stand',
    title: 'Study Sheet Music [SPACE]',
    x: 1440,
    y: 530,
    zone: 'cavatina_village',
    isProp: true,
    propType: 'music_stand',
    actionType: 'sheet_music_stand',
    sheetMusicReward: 'piece_cavatina_duet',
    dialogue: [
      "You discovered the sheet music for 'Cavatina Two-Part Invention' (Duet piece for Strings & Woodwinds)!"
    ]
  },
  {
    id: 'npc_village_signpost',
    name: 'Village Directional Signpost',
    title: 'Read Map Guide [SPACE]',
    x: 1000,
    y: 830,
    zone: 'cavatina_village',
    isProp: true,
    propType: 'signpost',
    actionType: 'signpost',
    dialogue: [
      "🗺️ CAVATINA VILLAGE NAVIGATION GUIDE:",
      "• ⬆️ NORTH GATE: Follow the paved road north to reach the Brass Citadel & Metro Cadenza!",
      "• ➡️ EAST GATE: Follow the paved road east to reach Woodwind Woods & the Coastal Coast!",
      "• ⬇️ SOUTH BRIDGE: Cross the stone bridge south to reach Percussion Peaks & Mountbeat!",
      "• ⬅️ WEST ARCH: Head west to reach The Grand Symphony Hall!"
    ]
  },
  {
    id: 'npc_busker_tim',
    name: 'Busker Tim',
    title: 'Gazebo Soloist [SPACE to Compete]',
    x: 1000,
    y: 640,
    zone: 'cavatina_village',
    musicianData: {
      id: 'rival_tim',
      name: 'Tim',
      title: 'Street Busker',
      avatar: '🎸',
      paletteColor: '#f59e0b',
      instrumentId: 'acoustic_guitar',
      instrumentName: 'Acoustic Guitar',
      section: 'strings',
      pet: {
        id: 'pet_hare_tim',
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
    },
    actionType: 'competition_stage',
    rivalId: 'rival_novice_buskers',
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
  {
    id: 'npc_gatekeeper_elias',
    name: 'Gatekeeper Elias',
    title: 'Citadel Highway Guard [SPACE]',
    x: 1000,
    y: 110,
    zone: 'cavatina_village',
    musicianData: {
      id: 'guard_elias',
      name: 'Elias',
      title: 'Highway Gatekeeper',
      avatar: '💂',
      paletteColor: '#475569',
      instrumentId: 'pocket_trumpet',
      instrumentName: 'Signal Bugle',
      section: 'brass',
      pet: {
        id: 'pet_hound_elias',
        name: 'Sentinel',
        species: 'Herald Hound',
        sprite: 'hound',
        section: 'brass',
        instrumentName: 'Signal Bugle',
        leitmotifSound: 'trumpet_fanfare',
        color: '#eab308'
      },
      stats: { technique: 35, toneQuality: 35, tempoStability: 35, sightReading: 35 },
      level: 4,
      xp: 300
    },
    actionType: 'talk',
    dialogue: [
      "Greetings traveler! This is the North Grand Gate of Cavatina Village.",
      "Just walk straight up through this archway to enter the Brass Citadel Highway and continue to Metro Cadenza!"
    ]
  },

  {
    id: 'npc_signpost_north_gate',
    name: 'North Brass Citadel Highway Sign',
    title: '🗺️ Road Sign: ⬆️ To Brass Citadel & Metro [SPACE]',
    x: 880,
    y: 100,
    zone: 'cavatina_village',
    isProp: true,
    propType: 'road_sign',
    actionType: 'signpost',
    dialogue: [
      "🎺 NORTH ROAD SIGN (CITADEL HIGHWAY):",
      "• ⬆️ NORTH HIGHWAY: Ascends the gilded ramparts to The Brass Citadel & Metro Cadenza.",
      "• Home of Captain Baron Von Brass and the Echo Amphitheater."
    ]
  },
  {
    id: 'npc_signpost_east_gate',
    name: 'East Woodwind Woods Signpost',
    title: '🗺️ Road Sign: ➡️ To Woodwind Woods [SPACE]',
    x: 1860,
    y: 600,
    zone: 'cavatina_village',
    isProp: true,
    propType: 'road_sign',
    actionType: 'signpost',
    dialogue: [
      "🌲 EAST ROAD SIGN (FOREST TRAIL):",
      "• ➡️ EAST ROAD: Leads into Woodwind Woods & Vivace Canopy.",
      "• Home of Flutist Oliver, elusive woodwind familiars, and whispering reeds."
    ]
  },
  {
    id: 'npc_signpost_south_bridge',
    name: 'South Percussion Peaks Bridge Sign',
    title: '🗺️ Road Sign: ⬇️ To Percussion Peaks [SPACE]',
    x: 880,
    y: 1480,
    zone: 'cavatina_village',
    isProp: true,
    propType: 'road_sign',
    actionType: 'signpost',
    dialogue: [
      "🥁 SOUTH ROAD SIGN (RIVER BRIDGE):",
      "• ⬇️ SOUTH BRIDGE: Crosses the Melodic River into Percussion Peaks & Rondo Caldera.",
      "• Home of Rhythm Rita and resonant Taiko mountain steps."
    ]
  },
  {
    id: 'npc_signpost_west_arch',
    name: 'West Grand Symphony Signpost',
    title: '🗺️ Road Sign: ⬅️ To Grand Symphony Hall [SPACE]',
    x: 120,
    y: 600,
    zone: 'cavatina_village',
    isProp: true,
    propType: 'road_sign',
    actionType: 'signpost',
    dialogue: [
      "🏛️ WEST ROAD SIGN (GRAND COLONNADE):",
      "• ⬅️ WEST ROAD: Leads directly to The Grand Symphony Hall.",
      "• Assemble all 4 instrument sections to audition before Maestro Valerius!"
    ]
  },

  // ==================== WOODWIND WOODS (WILDERNESS & CANOPY) ====================
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
    id: 'npc_sylvan_grove',
    name: 'Master Sylvan',
    title: 'Canopy Trio Bandleader [SPACE to Compete]',
    x: 1500,
    y: 950,
    zone: 'woodwind_woods',
    actionType: 'competition_stage',
    rivalId: 'rival_woodwind_trio',
    dialogue: [
      "Greetings! We are The Whispering Canopy Trio. Do your woodwinds have the phrasing and syncopation to match our Bossa Nova groove?"
    ]
  },
  {
    id: 'npc_theory_woods',
    name: 'Forest Druid Lectern',
    title: 'Woodwind Theory Exam (Intervals) [SPACE]',
    x: 900,
    y: 400,
    zone: 'woodwind_woods',
    isProp: true,
    propType: 'lectern',
    actionType: 'theory_bench',
    theoryType: 'intervals_ear_training',
    dialogue: [
      "Study the natural overtones of the forest canopy to master interval recognition and harmonic skips!"
    ]
  },
  {
    id: 'npc_music_stand_woods',
    name: 'Ancient Stone Stand',
    title: 'Study Sheet Music [SPACE]',
    x: 1300,
    y: 650,
    zone: 'woodwind_woods',
    isProp: true,
    propType: 'ancient_stone_stand',
    actionType: 'sheet_music_stand',
    sheetMusicReward: 'piece_bossa_trio',
    dialogue: [
      "You discovered the sheet music for 'Sonora Sunset Serenade' (Bossa Nova Trio)!"
    ]
  },
  {
    id: 'npc_vista_woods_bellflower',
    name: 'Bellflower Basin Vista',
    title: 'Acoustic Inspiration Vista [SPACE to Attune]',
    x: 1400,
    y: 1100,
    zone: 'woodwind_woods',
    isProp: true,
    propType: 'vista_monolith',
    actionType: 'inspiration_vista',
    vistaId: 'vista_bellflower',
    dialogue: [
      "You sit amidst the resonant bellflowers. Tone Quality permanently increased by +5! (+10 Inspiration Sparks ✨)"
    ]
  },
  {
    id: 'npc_vista_woods_waterfall',
    name: 'Verdant Cascade Vista',
    title: 'Acoustic Inspiration Vista [SPACE to Attune]',
    x: 500,
    y: 1200,
    zone: 'woodwind_woods',
    isProp: true,
    propType: 'vista_monolith',
    actionType: 'inspiration_vista',
    vistaId: 'vista_verdant_waterfall',
    dialogue: [
      "You meditate beside the roaring waterfall. Sight-Reading permanently increased by +5! (+10 Inspiration Sparks ✨)"
    ]
  },
  {
    id: 'npc_signpost_woods_exit',
    name: 'Vivace Canopy Exit Signpost',
    title: '🗺️ Road Sign: ⬅️ Back to Cavatina Village [SPACE]',
    x: 120,
    y: 600,
    zone: 'woodwind_woods',
    isProp: true,
    propType: 'road_sign',
    actionType: 'signpost',
    dialogue: [
      "🌲 VIVACE CANOPY TRAILHEAD:",
      "• ⬅️ WEST TRAIL: Follow the winding forest path back to Cavatina Village Plaza.",
      "• ➡️ EAST GLADE: Leads toward Flutist Oliver, Master Sylvan, and the Bellflower Basin."
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
      sprite: 'otter',
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
    id: 'npc_wild_finch',
    name: 'Wild Piccolo Finch',
    title: 'Wild Harmonipet (Silver Flute) [SPACE to Harmonize]',
    x: 600,
    y: 550,
    zone: 'woodwind_woods',
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_finch_wild',
      name: 'Cadenza',
      species: 'Piccolo Finch',
      sprite: 'finch',
      section: 'woodwinds',
      instrumentName: 'Silver Flute',
      leitmotifSound: 'flute_chirp',
      color: '#38bdf8'
    },
    dialogue: [
      "A chirping Piccolo Finch flutters between branches singing rapid trills! Match its cadence to bond with it!"
    ]
  },

  // ==================== THE BRASS CITADEL (FORTRESS & HIGHWAY) ====================
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
    id: 'npc_vesta_amphitheater',
    name: 'Baroness Vesta',
    title: 'Citadel Fanfare Bandleader [SPACE to Compete]',
    x: 1000,
    y: 400,
    zone: 'brass_citadel',
    actionType: 'competition_stage',
    rivalId: 'rival_brass_quartet',
    dialogue: [
      "Welcome to the Gilded Amphitheater! The Citadel Fanfare Quartet challenges you to match our regal volume and soaring four-part harmony!"
    ]
  },
  {
    id: 'npc_theory_citadel',
    name: 'Citadel Golden Lectern',
    title: 'Royal Harmony Exam (Chords & Triads) [SPACE]',
    x: 600,
    y: 750,
    zone: 'brass_citadel',
    isProp: true,
    propType: 'lectern',
    actionType: 'theory_bench',
    theoryType: 'triads_chords',
    dialogue: [
      "Master triad inversions and chord analysis to command royal fanfare authority!"
    ]
  },
  {
    id: 'npc_music_stand_citadel',
    name: 'Golden Music Stand',
    title: 'Study Sheet Music [SPACE]',
    x: 1200,
    y: 450,
    zone: 'brass_citadel',
    isProp: true,
    propType: 'golden_music_stand',
    actionType: 'sheet_music_stand',
    sheetMusicReward: 'piece_starlight_quartet',
    dialogue: [
      "You discovered the sheet music for 'Starlight String & Brass Quartet'!"
    ]
  },
  {
    id: 'npc_vista_citadel_echo',
    name: 'Echo Rampart Vista',
    title: 'Acoustic Inspiration Vista [SPACE to Attune]',
    x: 1400,
    y: 1200,
    zone: 'brass_citadel',
    isProp: true,
    propType: 'vista_monolith',
    actionType: 'inspiration_vista',
    vistaId: 'vista_echo_falls',
    dialogue: [
      "The echoing ramparts sharpen your sonic projection. Tone Quality permanently increased by +5! (+10 Inspiration Sparks ✨)"
    ]
  },
  {
    id: 'npc_vista_citadel_pinnacle',
    name: 'Sunlit Brass Pinnacle',
    title: 'Acoustic Inspiration Vista [SPACE to Attune]',
    x: 400,
    y: 400,
    zone: 'brass_citadel',
    isProp: true,
    propType: 'vista_monolith',
    actionType: 'inspiration_vista',
    vistaId: 'vista_sunlit_pinnacle',
    dialogue: [
      "Sunlight gleaming on polished brass inspires effortless dexterity. Technique permanently increased by +5! (+10 Inspiration Sparks ✨)"
    ]
  },
  {
    id: 'npc_signpost_citadel_exit',
    name: 'Allegro Citadel Exit Marker',
    title: '🗺️ Road Sign: ⬇️ Back to Cavatina Village [SPACE]',
    x: 1080,
    y: 1440,
    zone: 'brass_citadel',
    isProp: true,
    propType: 'road_sign',
    actionType: 'signpost',
    dialogue: [
      "🎺 ALLEGRO CITADEL HIGHWAY POST:",
      "• ⬇️ SOUTH HIGHWAY: Descends the Gilded Ramparts back to Cavatina Village Plaza.",
      "• ⬆️ NORTH CONCOURSE: Leads to Baroness Vesta and the Echo Amphitheater."
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
      sprite: 'ram',
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
    id: 'npc_wild_hound',
    name: 'Wild Fanfare Hound',
    title: 'Wild Harmonipet (Trumpet) [SPACE to Harmonize]',
    x: 500,
    y: 1100,
    zone: 'brass_citadel',
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_hound_wild',
      name: 'Major',
      species: 'Fanfare Hound',
      sprite: 'hound',
      section: 'brass',
      instrumentName: 'Herald Trumpet',
      leitmotifSound: 'trumpet_fanfare',
      color: '#eab308'
    },
    dialogue: [
      "A loyal Fanfare Hound barks bright brass intervals! Match its cadence to bond with it!"
    ]
  },

  // ==================== PERCUSSION PEAKS (MOUNTAIN VALLEYS & GHATS) ====================
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
  {
    id: 'npc_korath_summit',
    name: 'Chief Korath',
    title: 'Thunder Corps Chieftain [SPACE to Compete]',
    x: 1000,
    y: 650,
    zone: 'percussion_peaks',
    actionType: 'competition_stage',
    rivalId: 'rival_thunder_chamber',
    dialogue: [
      "Boom! The Mountain Thunder Corps holds the summit. Can your ensemble maintain flawless tempo against our thundering stone bells?"
    ]
  },
  {
    id: 'npc_theory_peaks',
    name: 'Sonic Caldera Lectern',
    title: 'Peaks Acoustics & Dynamics Exam [SPACE]',
    x: 600,
    y: 950,
    zone: 'percussion_peaks',
    isProp: true,
    propType: 'lectern',
    actionType: 'theory_bench',
    theoryType: 'tempo_dynamics_terms',
    dialogue: [
      "Master polyrhythms, tempo markings, and acoustic decay across the mountain valleys!"
    ]
  },
  {
    id: 'npc_music_stand_peaks',
    name: 'Basalt Standing Ledger',
    title: 'Study Sheet Music [SPACE]',
    x: 1400,
    y: 450,
    zone: 'percussion_peaks',
    isProp: true,
    propType: 'ancient_stone_stand',
    actionType: 'sheet_music_stand',
    sheetMusicReward: 'piece_mountain_rondo',
    dialogue: [
      "You discovered the sheet music for 'Mountain Rondo & Thunder Bell' (Chamber Suite)!"
    ]
  },
  {
    id: 'npc_vista_peaks_monolith',
    name: 'High Ridge Monolith Vista',
    title: 'Acoustic Inspiration Vista [SPACE to Attune]',
    x: 1000,
    y: 400,
    zone: 'percussion_peaks',
    isProp: true,
    propType: 'vista_monolith',
    actionType: 'inspiration_vista',
    vistaId: 'vista_monolith_peak',
    dialogue: [
      "Metronomic pulses from the monolith steady your heartbeat. Tempo Stability permanently increased by +5! (+10 Inspiration Sparks ✨)"
    ]
  },
  {
    id: 'npc_vista_peaks_thunder',
    name: 'Thunder Bell Gorge Vista',
    title: 'Acoustic Inspiration Vista [SPACE to Attune]',
    x: 1600,
    y: 1100,
    zone: 'percussion_peaks',
    isProp: true,
    propType: 'vista_monolith',
    actionType: 'inspiration_vista',
    vistaId: 'vista_thunder_gorge',
    dialogue: [
      "Deep sub-bass tremors anchor your inner rhythmic pocket. Tempo Stability permanently increased by +5! (+10 Inspiration Sparks ✨)"
    ]
  },
  {
    id: 'npc_signpost_peaks_exit',
    name: 'Rondo Caldera Exit Marker',
    title: '🗺️ Road Sign: ⬆️ Back to Cavatina Village [SPACE]',
    x: 1080,
    y: 140,
    zone: 'percussion_peaks',
    isProp: true,
    propType: 'road_sign',
    actionType: 'signpost',
    dialogue: [
      "🥁 RONDO CALDERA BRIDGE POST:",
      "• ⬆️ NORTH BRIDGE: Crosses the Resonant Gorge back to Cavatina Village Plaza.",
      "• ⬇️ SOUTH RIDGE: Leads down the Stepped Ghats toward Chief Korath and Rhythm Rita."
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
      sprite: 'squirrel',
      section: 'percussion',
      instrumentName: 'Marimba',
      leitmotifSound: 'marimba_roll',
      color: '#ec4899'
    },
    dialogue: [
      "A nimble Marimba Squirrel is tapping energetic triplets on polished rosewood bars! Match its cadence to bond with it!"
    ]
  },
  {
    id: 'npc_wild_badger',
    name: 'Wild Thunder Badger',
    title: 'Wild Harmonipet (Timpani) [SPACE to Harmonize]',
    x: 1500,
    y: 1200,
    zone: 'percussion_peaks',
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_badger_wild',
      name: 'Basso',
      species: 'Thunder Badger',
      sprite: 'badger',
      section: 'percussion',
      instrumentName: 'Caldera Timpani',
      leitmotifSound: 'timpani_boom',
      color: '#8b5cf6'
    },
    dialogue: [
      "A fierce Thunder Badger rumbles powerful subterranean beats on rock timpani! Match its cadence to bond with it!"
    ]
  },

  // ==================== THE GRAND SYMPHONY HALL (CLIMAX) ====================
  {
    id: 'npc_maestro_valerius',
    name: 'Maestro Valerius',
    title: 'Grand Symphony Conductor [SPACE to Compete]',
    x: 1000,
    y: 550,
    zone: 'grand_hall',
    actionType: 'competition_stage',
    rivalId: 'rival_grand_orchestra',
    dialogue: [
      "Welcome, Maestro! Has your ensemble mastered all 4 sections? If so, let us perform the Ode to Harmony for the world!"
    ]
  },
  {
    id: 'npc_signpost_hall_exit',
    name: 'Grand Symphony Foyer Directory',
    title: '🏛️ Directory: ⬇️ Back to Cavatina Village [SPACE]',
    x: 1080,
    y: 1440,
    zone: 'grand_hall',
    isProp: true,
    propType: 'road_sign',
    actionType: 'signpost',
    dialogue: [
      "🏛️ SINFONIA HALL FOYER DIRECTORY:",
      "• ⬇️ GRAND PORTICO: Exit doors leading back to Cavatina Village West Colonnade.",
      "• ⬆️ THE ETERNAL STAGE: Conductor's Podium & Maestro Valerius."
    ]
  },

  // ==================== CAVATINA VILLAGE EXPLORATION & QUESTS ====================
  {
    id: 'npc_vista_cavatina',
    name: 'Canyon of Thirds Vista',
    title: 'Acoustic Inspiration Vista [SPACE to Attune]',
    x: 1650,
    y: 1100,
    zone: 'cavatina_village',
    isProp: true,
    propType: 'vista_monolith',
    actionType: 'inspiration_vista',
    vistaId: 'vista_canyon_thirds',
    dialogue: [
      "You sit and listen to the natural third intervals echoing across the canyon. Technique permanently increased by +5! (+10 Inspiration Sparks ✨)"
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
      sprite: 'hare',
      section: 'strings',
      instrumentName: 'Acoustic Guitar',
      leitmotifSound: 'guitar_strum',
      color: '#f59e0b'
    },
    dialogue: [
      "A wild Vivace Hare is strumming harmonic rhythms on its acoustic guitar! Match its cadence to bond with it!"
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
    id: 'vista_verdant_waterfall',
    name: 'Verdant Cascade Basin',
    zone: 'woodwind_woods',
    x: 500,
    y: 1200,
    description: 'The roaring white noise of the waterfall trains laser-sharp rhythmic sight-reading.',
    statReward: 'sightReading',
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
    id: 'vista_sunlit_pinnacle',
    name: 'Sunlit Brass Pinnacle',
    zone: 'brass_citadel',
    x: 400,
    y: 400,
    description: 'High citadel spires channel golden sunlight and crystalline acoustic projection.',
    statReward: 'technique',
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
  },
  {
    id: 'vista_thunder_gorge',
    name: 'The Thunder Bell Gorge',
    zone: 'percussion_peaks',
    x: 1600,
    y: 1100,
    description: 'Deep subterranean bass rumbles instill unflinching tempo stability and pocket.',
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
