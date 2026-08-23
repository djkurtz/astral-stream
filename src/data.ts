import {
  Harmonipet, Musician, MusicianStats, RepertoirePiece, RivalEnsemble, WorldZone, WorldNPC, BattleMove, InstrumentId, FestivalEvent,
  InstrumentArtifact, LostScore, InspirationVista, PerformanceVenue, GameQuest, DispatchVenue,
  HarmoniDexEntry, ClefBadge, PlayerCustomization, TheoryChallengeType, TheoryQuestion,
  InstrumentSection, PlayerProficiency, PetSynergy, PhoneMessage, SectionAction
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
  glockenspiel: { name: 'Silver Glockenspiel', section: 'percussion', avatar: '🔔', description: 'Bright crystalline metallic chimes that sparkle above the ensemble.' },
  harpsichord: { name: 'Harpsichord', section: 'strings', avatar: '🎹', description: 'Bright, quill-plucked sharp attack with pristine Baroque brilliance.' },
  electric_guitar: { name: 'Electric Guitar', section: 'strings', avatar: '🎸', description: 'Overdriven crunchy power chords, blistering sustain, and distortion harmonics.' },
  saxophone: { name: 'Saxophone', section: 'woodwinds', avatar: '🎷', description: 'Rich reedy jazz timbre with warm expressive vibrato.' },
  typewriter: { name: 'Typewriter', section: 'percussion', avatar: '⌨️', description: 'Rapid mechanical click-clack strikes with clear margin bell chimes.' },
  cannon: { name: 'Tchaikovsky Cannon', section: 'percussion', avatar: '💣', description: 'Massive low-frequency sub-bass artillery boom and resonant thunder.' }
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
  },
  harpsichord: {
    move1: { id: 'quill_staccato', name: 'Quill Pluck', section: 'strings', power: 20, harmonyCost: 12, effect: 'resonance_boost', description: 'Crisp, quill-plucked strings delivering sparkling harmonic clarity.' },
    move2: { id: 'baroque_toccata', name: 'Baroque Toccata', section: 'strings', power: 29, harmonyCost: 26, effect: 'fortissimo_burst', description: 'A rapid, dazzling counterpoint flourish that commands total attention.' }
  },
  electric_guitar: {
    move1: { id: 'power_chord_riff', name: 'Overdrive Riff', section: 'strings', power: 22, harmonyCost: 14, effect: 'resonance_boost', description: 'A crunchy distorted power chord that electrifies the hall.' },
    move2: { id: 'feedback_screamer', name: 'Harmonic Feedback', section: 'strings', power: 31, harmonyCost: 28, effect: 'fortissimo_burst', description: 'Blistering distortion sustain that shatters dissonance.' }
  },
  saxophone: {
    move1: { id: 'sax_blues_inflection', name: 'Soulful Portamento', section: 'woodwinds', power: 21, harmonyCost: 15, effect: 'resonance_boost', description: 'Smooth, expressive pitch bends with rich warm overtones.' },
    move2: { id: 'sax_bebop_cadence', name: 'Bebop Velocity', section: 'woodwinds', power: 28, harmonyCost: 25, effect: 'fortissimo_burst', description: 'A lightning-fast flurry of jazz subdivisions.' }
  },
  typewriter: {
    move1: { id: 'margin_bell_chime', name: 'Margin Bell Chime', section: 'percussion', power: 19, harmonyCost: 12, effect: 'tempo_lock', description: 'A crisp mechanical clack punctuated by a pure metallic bell chime.' },
    move2: { id: 'rapid_keystroke_roll', name: 'Stenographer Roll', section: 'percussion', power: 28, harmonyCost: 25, effect: 'fortissimo_burst', description: 'A lightning-fast barrage of rhythmic key strikes.' }
  },
  cannon: {
    move1: { id: 'artillery_salvo', name: 'Artillery Salvo', section: 'percussion', power: 23, harmonyCost: 16, effect: 'resonance_boost', description: 'A resounding low-end boom that rattles the acoustic foundation.' },
    move2: { id: '1812_overture_blast', name: '1812 Overture Blast', section: 'percussion', power: 34, harmonyCost: 32, effect: 'fortissimo_burst', description: 'An earth-shattering sub-bass cannon detonation of legendary magnitude.' }
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
    title: 'Harmonia Sunset Serenade',
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
    description: 'The legendary masterwork of Harmonia. Unites all 4 sections in glorious, transcendental polyphony.',
    masteryXp: 1000,
    isMastered: false
  }
];

/* ---------------- NPC MUSICIANS (RECRUITABLE) ---------------- */

export const RECRUITABLE_MUSICIANS: Musician[] = [
  {
    id: 'npc_clara',
    name: 'Clara',
    title: 'Teen Violin Prodigy (Age 15)',
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
    isKid: true,
    outfitColor: '#ec4899',
    hairColor: '#fde047',
    hatStyle: 'beret',
    dialogue: [
      "Hey! Clara here (15 and proud!). I've been running scale drills for four hours straight—my fingers are practically humming!",
      "My swan familiar, Vibrato, says I need to chill, but the Conservatory Auditions are next month and I refuse to fumble my cadenza.",
      "You look like you've got serious musical drive! Wanna trade licks in a fast Audition Duel and see how our motifs match up?"
    ],
    auditionDialogue: [
      "Let's see that bow dexterity! Can your phrasing match my lyrical vibrato?"
    ],
    recruitedDialogue: [
      "Whoa, your counterpoint is incredible! Pack up, Vibrato—we just found our dream ensemble!"
    ]
  },
  {
    id: 'npc_oliver',
    name: 'Oliver',
    title: 'Preteen Flute Nature Nerd (Age 13)',
    avatar: '🪈',
    paletteColor: '#10b981',
    outfitColor: '#059669',
    hairColor: '#b45309',
    hatStyle: 'feather_cap',
    isKid: true,
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
      "Shh! Listen! Did you hear that? That was a piccolo warbler in the high branches! I'm Oliver (13 and 3/4!).",
      "Everyone at school complains that the flute is 'too delicate', but Chirpy and I can play triple-tongued chromatic runs that leave them speechless!",
      "If you're putting together a real ensemble, you definitely need a lightning-fast woodwind voice. Care to jam?"
    ],
    auditionDialogue: [
      "Catch the gust! Try to keep up with my rapid-fire staccato arpeggios!"
    ],
    recruitedDialogue: [
      "YES! That was so tight! Chirpy, grab the sheet music binder—we're hitting the road together!"
    ]
  },
  {
    id: 'npc_baron',
    name: 'Jax "The Brass Baron"',
    title: 'High School Band Lead (Age 17)',
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
      "Yo! What's good! I'm Jax—first chair trumpet in the Citadel Youth Marching Brigade.",
      "The crew calls me 'The Brass Baron' because my high-C fanfares can literally shake dust off the castle chandeliers! Rally, sound off!",
      "You think your group's got the lung power and spine to back up my golden leads? Step up and prove it!"
    ],
    auditionDialogue: [
      "Brace your ears! Here comes a true fortissimo blast that'll test your harmonic shield!"
    ],
    recruitedDialogue: [
      "Ha! That was legit! You actually held the pocket against my blast! Rally, we found our crew!"
    ]
  },
  {
    id: 'npc_rita',
    name: 'Rita',
    title: 'Skate-Punk Drummer (Age 16)',
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
      "One-two-three-BAM! Sup! I'm Rita. Most kids in town play polite salon minuets, but me and Groove? We live for thunderous backbeats and polyrhythms.",
      "If your ensemble can't lock into an unflinching 160 BPM pocket, you're gonna crumble on the big stage.",
      "Think your internal metronome is steady enough? Let's take it to the stage and trade rhythm chops!"
    ],
    auditionDialogue: [
      "Lock in! Don't let your tempo rush or drag even a microsecond!"
    ],
    recruitedDialogue: [
      "Boom! Right in the pocket. You've got real rhythm instinct. Count me in—let's make some noise!"
    ]
  },
  {
    id: 'npc_toby',
    name: 'Toby',
    title: 'Acoustic Folk Kid (Age 11)',
    avatar: '🪕',
    paletteColor: '#f59e0b',
    instrumentId: 'acoustic_guitar',
    instrumentName: 'Cedar Acoustic Guitar',
    section: 'strings',
    pet: {
      id: 'pet_hare_toby',
      name: 'Barnaby Jr',
      species: 'Vivace Hare',
      sprite: 'hare',
      section: 'strings',
      instrumentName: 'Cedar Guitar',
      leitmotifSound: 'guitar_strum',
      color: '#f59e0b'
    },
    stats: { technique: 26, toneQuality: 34, tempoStability: 30, sightReading: 24 },
    level: 2,
    xp: 100,
    dialogue: [
      "Hi mister maestro! I'm Toby (I'm eleven!). My big brother said I was too little for the town square concerts...",
      "...so Hoppy and I have been writing secret woodland folk songs out here in Lyre Valley! Want to hear one?"
    ],
    auditionDialogue: ["Watch my fingerpicking! I've been practicing every single afternoon!"],
    recruitedDialogue: ["YAY! I'm in a real ensemble now! Wait till my brother hears about this!"]
  },
  {
    id: 'npc_maya',
    name: 'Maya',
    title: 'Goth Cello Teen (Age 15)',
    avatar: '🎻',
    paletteColor: '#7c3aed',
    instrumentId: 'cello',
    instrumentName: 'Midnight Cello',
    section: 'strings',
    pet: {
      id: 'pet_cat_maya',
      name: 'Nocturne',
      species: 'Allegro Swan',
      sprite: 'swan',
      section: 'strings',
      instrumentName: 'Midnight Cello',
      leitmotifSound: 'violin_pure',
      color: '#7c3aed'
    },
    stats: { technique: 38, toneQuality: 44, tempoStability: 32, sightReading: 36 },
    level: 3,
    xp: 220,
    dialogue: [
      "Everything sounds more profound in D minor. I'm Maya.",
      "The other academy kids obsess over cheerful major scales, but the cello was born for weeping cantabiles and dark resonance.",
      "Can your music handle genuine emotional depth, or is it all just sunshine and arpeggios?"
    ],
    auditionDialogue: ["Feel the melancholic weight of my bass resonance! Respond with true emotion!"],
    recruitedDialogue: ["...Impressive. Your harmonic phrasing actually resonated with my soul. I'll join your journey."]
  },
  {
    id: 'npc_chloe',
    name: 'Chloe',
    title: 'Shy Oboe Prodigy (Age 12)',
    avatar: '🌾',
    paletteColor: '#059669',
    instrumentId: 'oboe',
    instrumentName: 'Silver-Keyed Oboe',
    section: 'woodwinds',
    pet: {
      id: 'pet_frog_chloe',
      name: 'Pebble',
      species: 'Flute Frog',
      sprite: 'frog',
      section: 'woodwinds',
      instrumentName: 'Silver Oboe',
      leitmotifSound: 'flute_chirp',
      color: '#059669'
    },
    stats: { technique: 40, toneQuality: 42, tempoStability: 36, sightReading: 42 },
    level: 3,
    xp: 210,
    dialogue: [
      "U-um... hello. I'm Chloe. Double reeds are super tricky to control, and crowds make me kind of nervous...",
      "Pebble the frog helps me steady my breath out here in the quiet mist of Breeze Glade. Would you... like to play a duet?"
    ],
    auditionDialogue: ["I-I'll try my best! Listen to the overtone resonance of my rosewood reed!"],
    recruitedDialogue: ["You made me feel so calm and confident! Pebble and I would love to travel with you!"]
  },
  {
    id: 'npc_devon',
    name: 'Devon',
    title: 'Indie College Saxophonist (Age 19)',
    avatar: '🎷',
    paletteColor: '#0d9488',
    instrumentId: 'soprano_sax',
    instrumentName: 'Vintage Curved Sax',
    section: 'woodwinds',
    pet: {
      id: 'pet_hound_devon',
      name: 'Miles',
      species: 'Piccolo Finch',
      sprite: 'finch',
      section: 'woodwinds',
      instrumentName: 'Vintage Sax',
      leitmotifSound: 'flute_chirp',
      color: '#0d9488'
    },
    stats: { technique: 48, toneQuality: 52, tempoStability: 44, sightReading: 46 },
    level: 4,
    xp: 380,
    dialogue: [
      "Hey man. Devon here. Ditching morning theory lectures to transcribe bird calls in the canopy.",
      "Jazz isn't just about playing all the right notes—it's about the space between 'em. Got an interesting chord chart you wanna jam on?"
    ],
    auditionDialogue: ["Let's ride this modal groove. Show me your improvisational chops!"],
    recruitedDialogue: ["Smooth phrasing, my friend. Pure vibes. Miles and I are definitely down for this tour."]
  },
  {
    id: 'npc_sam',
    name: 'Sam',
    title: 'Trombone Hotshot (Age 16)',
    avatar: '🎺',
    paletteColor: '#f97316',
    instrumentId: 'trombone',
    instrumentName: 'Tenor Slide Trombone',
    section: 'brass',
    pet: {
      id: 'pet_badger_sam',
      name: 'Diesel',
      species: 'Fanfare Badger',
      sprite: 'badger',
      section: 'brass',
      instrumentName: 'Tenor Trombone',
      leitmotifSound: 'horn_call',
      color: '#f97316'
    },
    stats: { technique: 46, toneQuality: 48, tempoStability: 42, sightReading: 38 },
    level: 4,
    xp: 350,
    dialogue: [
      "Jax thinks he's the loudest horn in Harmonia? Hilarious! My trombone slide reaches low pedal tones that shake the whole canyon!",
      "Echo Canyon is my personal practice amphitheater. Want to see whose sound waves carry further?"
    ],
    auditionDialogue: ["Incoming glissando! Catch this sonic wave if you can!"],
    recruitedDialogue: ["Whoa, you actually harmonized with that gliss! That was epic! Count me in on your brass lineup!"]
  },
  {
    id: 'npc_ren',
    name: 'Ren',
    title: 'Taiko Dynamo Kid (Age 12)',
    avatar: '🥁',
    paletteColor: '#a855f7',
    instrumentId: 'timpani',
    instrumentName: 'Twin Thunder Bongo Mallets',
    section: 'percussion',
    pet: {
      id: 'pet_armadillo_ren',
      name: 'Tank',
      species: 'Rhythm Armadillo',
      sprite: 'armadillo',
      section: 'percussion',
      instrumentName: 'Thunder Bongos',
      leitmotifSound: 'drum_beat',
      color: '#a855f7'
    },
    stats: { technique: 45, toneQuality: 38, tempoStability: 55, sightReading: 30 },
    level: 4,
    xp: 360,
    dialogue: [
      "YEAH! DID YOU HEAR THAT CRACKLE?! I'm Ren! These basalt stones sound just like giant timpani!",
      "Tank can curl into a ball and roll a 240 BPM blast beat! CAN YOU MATCH OUR PRIMAL ENERGY?!"
    ],
    auditionDialogue: ["MAXIMUM TEMPO! Try to stay standing against our volcanic rhythm rush!"],
    recruitedDialogue: ["THAT WAS SO SICK! Your whole ensemble was grooving! We're coming with you for sure!"]
  },
  {
    id: 'npc_nico',
    name: 'Nico',
    title: 'Conservatory Arranger (Age 20)',
    avatar: '📜',
    paletteColor: '#ec4899',
    instrumentId: 'harp',
    instrumentName: 'Orchestral Lever Harp',
    section: 'strings',
    pet: {
      id: 'pet_swan_nico',
      name: 'Symphony',
      species: 'Allegro Swan',
      sprite: 'swan',
      section: 'strings',
      instrumentName: 'Lever Harp',
      leitmotifSound: 'violin_pure',
      color: '#ec4899'
    },
    stats: { technique: 55, toneQuality: 58, tempoStability: 50, sightReading: 60 },
    level: 5,
    xp: 500,
    dialogue: [
      "Whew... running on two hours of sleep and iced coffee. I'm Nico, senior composition student at the High Conservatory.",
      "If you're preparing for the Grand Solstice Symphony, remember: balance across all 4 instrument families is what creates true harmonic transcendence.",
      "Would you like to test your ensemble's multi-part voicing against my orchestral harp counterpoint?"
    ],
    auditionDialogue: ["Observe the voice leading across four independent registers! Show me your ensemble synergy!"],
    recruitedDialogue: ["Magnificent polyphony! Your orchestration has genuine brilliance. I would be thrilled to arrange and perform with your ensemble!"]
  }
];

/* ---------------- RIVAL ENSEMBLES (CONCERT SHOWDOWNS) ---------------- */

export const RIVAL_ENSEMBLES: RivalEnsemble[] = [
  {
    id: 'rival_novice_buskers',
    name: 'The Cavatina Street Soloists',
    tier: 'solo',
    conductorName: 'Timmy (Age 12)',
    members: [
      {
        id: 'rival_tim',
        name: 'Timmy',
        title: 'Preteen Street Busker (Age 12)',
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
    description: 'An enthusiastic preteen street busker performing friendly folk tunes by the Cavatina fountain.'
  },
  {
    id: 'rival_woodwind_trio',
    name: 'The Whispering Canopy Trio',
    tier: 'trio',
    conductorName: 'Leo (Age 14)',
    members: [
      {
        id: 'rival_sylvan',
        name: 'Leo',
        title: 'Flute Prodigy (Age 14)',
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
        name: 'Penny',
        title: 'Alto Sax Teen (Age 15)',
        avatar: '🎷',
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
        title: 'Woodland Cellist (Age 16)',
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
    description: 'A nimble teenage jazz trio jamming syncopated bossa nova rhythms under the sunlit forest canopies.'
  },
  {
    id: 'rival_brass_quartet',
    name: 'The Gilded Citadel Fanfare',
    tier: 'quartet',
    conductorName: 'Baroness Vesta (Age 17)',
    members: [
      {
        id: 'rival_vesta',
        name: 'Baroness Vesta',
        title: 'Marching Captain (Age 17)',
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
        title: 'Lead Cornet Teen (Age 16)',
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
    description: 'A disciplined high school brass and string quartet commanding immense fortissimo projection across the Citadel.'
  },
  {
    id: 'rival_thunder_chamber',
    name: 'The Mountain Thunder Corps',
    tier: 'chamber',
    conductorName: 'Ronin (Age 18)',
    members: [
      {
        id: 'rival_korath',
        name: 'Ronin',
        title: 'Street Percussion Master (Age 18)',
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
    description: 'A thunderous youth percussion chamber troupe driving intricate polyrhythmic grooves with heavy volcanic beats.'
  },
  {
    id: 'rival_grand_orchestra',
    name: 'The Harmonia Youth Symphony',
    tier: 'orchestra',
    conductorName: 'Aurelius (Age 21)',
    members: [
      {
        id: 'rival_valerius',
        name: 'Aurelius',
        title: 'Student Conductor (Age 21)',
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
    description: 'The premier conservatory youth orchestra of Harmonia, uniting all four instrument families in transcendent polyphony.'
  }
];

/* ---------------- WORLD ZONES CONFIGS ---------------- */

export const WORLD_ZONES: Record<string, WorldZone> = {
  // 🎻 WEST CARDINAL VILLAGE: Cavatina Village (Strings)
  cavatina_village: {
    id: 'cavatina_village',
    name: 'Cavatina Village',
    subtitle: 'Western Strings Hamlet & Cradle of Harmony',
    width: 2000,
    height: 1600,
    ambientBgm: 'cavatina_village',
    themeColor: '#38bdf8',
    defaultSpawn: { x: 1000, y: 920, dir: 'down' },
    transitions: [
      { id: 'tr_cavatina_to_west_wilds', targetZone: 'west_wilderness', targetSpawn: { x: 120, y: 800, dir: 'right' }, bounds: { x: 1920, y: 720, w: 80, h: 160 }, promptText: '➡️ East Gate: Into Lyre Valley (West Wilderness)' }
    ],
    obstacles: [
      { type: 'building', buildingType: 'wall', x: 0, y: 0, w: 2000, h: 60, name: 'North Village Wall' },
      { type: 'building', buildingType: 'wall', x: 0, y: 1540, w: 2000, h: 60, name: 'South Melodic River' },
      { type: 'building', buildingType: 'wall', x: 0, y: 0, w: 60, h: 1600, name: 'West Colonnade Cliff' },
      { type: 'building', buildingType: 'wall', x: 1940, y: 0, w: 60, h: 720, name: 'East Boundary Woods Top' },
      { type: 'building', buildingType: 'wall', x: 1940, y: 880, w: 60, h: 720, name: 'East Boundary Woods Bottom' },
      { type: 'gate', buildingType: 'gate', x: 1940, y: 720, w: 60, h: 160, name: 'East Forest Gate', signIcon: '➡️' },
      // Village Buildings
      { type: 'building', buildingType: 'academy', x: 220, y: 280, w: 320, h: 220, name: 'Cavatina Music Academy', signIcon: '🎼', roofColor: '#1e3a8a' },
      { type: 'building', buildingType: 'forge', x: 600, y: 280, w: 260, h: 220, name: "Master Luthier Marco's Forge", signIcon: '🎻', roofColor: '#b45309' },
      { type: 'building', buildingType: 'library', x: 1200, y: 280, w: 340, h: 220, name: 'Conservatory Library & Archives', signIcon: '📖', roofColor: '#065f46' },
      { type: 'building', buildingType: 'tavern', x: 380, y: 960, w: 320, h: 220, name: 'The Melodic Rose Tavern & Inn', signIcon: '🍺', roofColor: '#991b1b' },
      { type: 'building', buildingType: 'clocktower', x: 1240, y: 960, w: 320, h: 220, name: 'Cavatina Town Hall & Clocktower', signIcon: '⏰', roofColor: '#4c1d95' },
      { type: 'circle', x: 1000, y: 800, radius: 64, name: 'Clef Fountain' }
    ]
  },

  // 🌲 WEST WILDERNESS: Lyre Valley (Short E/W transit width: 800, Deep N/S exploration height: 1800)
  west_wilderness: {
    id: 'west_wilderness',
    name: 'Lyre Valley',
    subtitle: 'Whispering Wilds & Silver Bow Glen',
    width: 800,
    height: 1800,
    ambientBgm: 'west_wilderness',
    themeColor: '#0ea5e9',
    defaultSpawn: { x: 120, y: 800, dir: 'right' },
    transitions: [
      { id: 'tr_ww_to_cavatina', targetZone: 'cavatina_village', targetSpawn: { x: 1860, y: 800, dir: 'left' }, bounds: { x: 0, y: 720, w: 80, h: 160 }, promptText: '⬅️ West Trail: Back to Cavatina Village' },
      { id: 'tr_ww_to_grand_hall', targetZone: 'grand_hall', targetSpawn: { x: 140, y: 1000, dir: 'right' }, bounds: { x: 720, y: 820, w: 80, h: 160 }, promptText: '➡️ East Highway: To Sinfonia Magna (Grand Symphony Metropolis)' },
      { id: 'tr_ww_to_north', targetZone: 'north_wilderness', targetSpawn: { x: 140, y: 400, dir: 'right' }, bounds: { x: 320, y: 0, w: 160, h: 80 }, promptText: '⬆️ Northwest Mountain Pass: Direct Path to Echo Canyon (North Wilderness)' },
      { id: 'tr_ww_to_south', targetZone: 'south_wilderness', targetSpawn: { x: 140, y: 400, dir: 'right' }, bounds: { x: 320, y: 1720, w: 160, h: 80 }, promptText: '⬇️ Southwest Cliff Pass: Direct Path to Rumble Gorge (South Wilderness)' }
    ],
    obstacles: [
      { type: 'box', x: 0, y: 0, w: 320, h: 60, name: 'Northern Valley Ridge Left' },
      { type: 'box', x: 480, y: 0, w: 320, h: 60, name: 'Northern Valley Ridge Right' },
      { type: 'gate', buildingType: 'gate', x: 320, y: 0, w: 160, h: 60, name: 'North Echo Pass Arch', signIcon: '⬆️' },
      { type: 'box', x: 0, y: 1740, w: 320, h: 60, name: 'Southern Valley Stream Left' },
      { type: 'box', x: 480, y: 1740, w: 320, h: 60, name: 'Southern Valley Stream Right' },
      { type: 'gate', buildingType: 'gate', x: 320, y: 1740, w: 160, h: 60, name: 'South Rumble Pass Arch', signIcon: '⬇️' },
      { type: 'box', x: 0, y: 0, w: 60, h: 720, name: 'West Valley Thicket Top' },
      { type: 'box', x: 0, y: 880, w: 60, h: 920, name: 'West Valley Thicket Bottom' },
      { type: 'box', x: 740, y: 0, w: 60, h: 820, name: 'East Grand Archwoods Top' },
      { type: 'box', x: 740, y: 980, w: 60, h: 820, name: 'East Grand Archwoods Bottom' },
      // North & South Exploration Obstacles
      { type: 'circle', x: 200, y: 350, radius: 48, name: 'Acoustic Willow Copse' },
      { type: 'circle', x: 600, y: 1450, radius: 56, name: 'Resonant Rock Boulder' }
    ]
  },

  // 🪈 EAST CARDINAL VILLAGE: Woodwind Woods (Woodwinds)
  woodwind_woods: {
    id: 'woodwind_woods',
    name: 'Woodwind Woods',
    subtitle: 'Sylvan Canopy Village & Sylvan Glade',
    width: 2000,
    height: 1600,
    ambientBgm: 'woodwind_woods',
    themeColor: '#10b981',
    defaultSpawn: { x: 1000, y: 920, dir: 'down' },
    transitions: [
      { id: 'tr_woods_to_east_wilds', targetZone: 'east_wilderness', targetSpawn: { x: 680, y: 900, dir: 'left' }, bounds: { x: 0, y: 820, w: 80, h: 160 }, promptText: '⬅️ West Trail: To Breeze Glade (East Wilderness)' }
    ],
    obstacles: [
      { type: 'building', buildingType: 'wall', x: 0, y: 0, w: 2000, h: 60, name: 'Northern Thicket Wall' },
      { type: 'building', buildingType: 'wall', x: 0, y: 1540, w: 2000, h: 60, name: 'Southern Briar River' },
      { type: 'building', buildingType: 'wall', x: 0, y: 0, w: 60, h: 820, name: 'Western Tree Wall Top' },
      { type: 'building', buildingType: 'wall', x: 0, y: 980, w: 60, h: 620, name: 'Western Tree Wall Bottom' },
      { type: 'gate', buildingType: 'gate', x: 0, y: 820, w: 60, h: 160, name: 'West Glade Gate', signIcon: '⬅️' },
      { type: 'building', buildingType: 'wall', x: 1940, y: 0, w: 60, h: 1600, name: 'Eastern Bamboo Ridge' },
      // Replicated Village Buildings (Sylvan Theme)
      { type: 'building', buildingType: 'academy', x: 220, y: 280, w: 320, h: 220, name: 'Sylvan Woodwind Academy', signIcon: '🪈', roofColor: '#047857' },
      { type: 'building', buildingType: 'forge', x: 600, y: 280, w: 260, h: 220, name: "Master Reed's Cane Workshop", signIcon: '🌾', roofColor: '#065f46' },
      { type: 'building', buildingType: 'library', x: 1200, y: 280, w: 340, h: 220, name: 'Canopy Acoustic Archives', signIcon: '🍃', roofColor: '#0f766e' },
      { type: 'building', buildingType: 'tavern', x: 380, y: 960, w: 320, h: 220, name: 'The Whispering Willow Lounge', signIcon: '🍵', roofColor: '#15803d' },
      { type: 'building', buildingType: 'clocktower', x: 1240, y: 960, w: 320, h: 220, name: 'Sylvan Town Hall & Great Tree Dial', signIcon: '🌳', roofColor: '#166534' },
      { type: 'circle', x: 1000, y: 720, radius: 64, name: 'Sylvan Spring Basin' }
    ]
  },

  // 🍃 EAST WILDERNESS: Breeze Glade (Short E/W transit width: 800, Deep N/S exploration height: 1800)
  east_wilderness: {
    id: 'east_wilderness',
    name: 'Breeze Glade',
    subtitle: 'Reedmarsh Wilds & Zephyr Falls',
    width: 800,
    height: 1800,
    ambientBgm: 'east_wilderness',
    themeColor: '#059669',
    defaultSpawn: { x: 680, y: 900, dir: 'left' },
    transitions: [
      { id: 'tr_ew_to_woods', targetZone: 'woodwind_woods', targetSpawn: { x: 120, y: 900, dir: 'right' }, bounds: { x: 720, y: 820, w: 80, h: 160 }, promptText: '➡️ East Trail: Into Woodwind Woods' },
      { id: 'tr_ew_to_grand_hall', targetZone: 'grand_hall', targetSpawn: { x: 2260, y: 1000, dir: 'left' }, bounds: { x: 0, y: 820, w: 80, h: 160 }, promptText: '⬅️ West Highway: To Sinfonia Magna (Grand Symphony Metropolis)' },
      { id: 'tr_ew_to_north', targetZone: 'north_wilderness', targetSpawn: { x: 1660, y: 400, dir: 'left' }, bounds: { x: 320, y: 0, w: 160, h: 80 }, promptText: '⬆️ Northeast Zephyr Pass: Direct Path to Echo Canyon (North Wilderness)' },
      { id: 'tr_ew_to_south', targetZone: 'south_wilderness', targetSpawn: { x: 1660, y: 400, dir: 'left' }, bounds: { x: 320, y: 1720, w: 160, h: 80 }, promptText: '⬇️ Southeast Glade Trail: Direct Path to Rumble Gorge (South Wilderness)' }
    ],
    obstacles: [
      { type: 'box', x: 0, y: 0, w: 320, h: 60, name: 'Northern Reed Marsh Left' },
      { type: 'box', x: 480, y: 0, w: 320, h: 60, name: 'Northern Reed Marsh Right' },
      { type: 'gate', buildingType: 'gate', x: 320, y: 0, w: 160, h: 60, name: 'North Echo Pass Arch', signIcon: '⬆️' },
      { type: 'box', x: 0, y: 1740, w: 320, h: 60, name: 'Southern Bamboo Clump Left' },
      { type: 'box', x: 480, y: 1740, w: 320, h: 60, name: 'Southern Bamboo Clump Right' },
      { type: 'gate', buildingType: 'gate', x: 320, y: 1740, w: 160, h: 60, name: 'South Rumble Pass Arch', signIcon: '⬇️' },
      { type: 'box', x: 0, y: 0, w: 60, h: 820, name: 'West Marsh Edge Top' },
      { type: 'box', x: 0, y: 980, w: 60, h: 820, name: 'West Marsh Edge Bottom' },
      { type: 'box', x: 740, y: 0, w: 60, h: 820, name: 'East Wood Edge Top' },
      { type: 'box', x: 740, y: 980, w: 60, h: 820, name: 'East Wood Edge Bottom' },
      // Exploration Obstacles
      { type: 'circle', x: 200, y: 400, radius: 44, name: 'Flute Reed Pool' },
      { type: 'circle', x: 600, y: 1400, radius: 52, name: 'Zephyr Hollow' }
    ]
  },

  // 🎺 NORTH CARDINAL VILLAGE: The Brass Citadel (Brass)
  brass_citadel: {
    id: 'brass_citadel',
    name: 'The Brass Citadel',
    subtitle: 'Gilded Ramparts & Metro Cadenza',
    width: 2000,
    height: 1600,
    ambientBgm: 'brass_citadel',
    themeColor: '#eab308',
    defaultSpawn: { x: 1000, y: 920, dir: 'down' },
    transitions: [
      { id: 'tr_citadel_to_north_wilds', targetZone: 'north_wilderness', targetSpawn: { x: 900, y: 120, dir: 'down' }, bounds: { x: 920, y: 1520, w: 160, h: 80 }, promptText: '⬇️ South Bastion Gate: To Echo Canyon (North Wilderness)' }
    ],
    obstacles: [
      { type: 'building', buildingType: 'wall', x: 0, y: 0, w: 2000, h: 60, name: 'Citadel Golden North Wall' },
      { type: 'building', buildingType: 'wall', x: 0, y: 0, w: 60, h: 1600, name: 'West Rampart' },
      { type: 'building', buildingType: 'wall', x: 1940, y: 0, w: 60, h: 1600, name: 'East Rampart' },
      { type: 'building', buildingType: 'wall', x: 0, y: 1540, w: 920, h: 60, name: 'South Wall Left' },
      { type: 'building', buildingType: 'wall', x: 1080, y: 1540, w: 920, h: 60, name: 'South Wall Right' },
      { type: 'gate', buildingType: 'gate', x: 920, y: 1540, w: 160, h: 60, name: 'South Bastion Gate', signIcon: '⬇️' },
      // Replicated Village Buildings (Brass Theme)
      { type: 'building', buildingType: 'academy', x: 220, y: 280, w: 320, h: 220, name: 'Citadel Brass Conservatory', signIcon: '🎺', roofColor: '#854d0e' },
      { type: 'building', buildingType: 'forge', x: 600, y: 280, w: 260, h: 220, name: 'The Gilded Horn Foundry', signIcon: '📯', roofColor: '#a16207' },
      { type: 'building', buildingType: 'library', x: 1200, y: 280, w: 340, h: 220, name: 'Citadel Fanfare Archives', signIcon: '📜', roofColor: '#b45309' },
      { type: 'building', buildingType: 'tavern', x: 380, y: 960, w: 320, h: 220, name: 'The Golden Trumpet Canteen', signIcon: '🍺', roofColor: '#c2410c' },
      { type: 'building', buildingType: 'clocktower', x: 1240, y: 960, w: 320, h: 220, name: 'Citadel High Council & Solar Dial', signIcon: '☀️', roofColor: '#9a3412' },
      { type: 'circle', x: 1000, y: 720, radius: 64, name: 'Sunlit Herald Fountain' }
    ]
  },

  // 🏜️ NORTH WILDERNESS: Echo Canyon (Deep E/W exploration width: 1800, Short N/S transit height: 800)
  north_wilderness: {
    id: 'north_wilderness',
    name: 'Echo Canyon',
    subtitle: 'Golden Steppes & Resonance Peak',
    width: 1800,
    height: 800,
    ambientBgm: 'north_wilderness',
    themeColor: '#d97706',
    defaultSpawn: { x: 900, y: 120, dir: 'down' },
    transitions: [
      { id: 'tr_nw_to_citadel', targetZone: 'brass_citadel', targetSpawn: { x: 1000, y: 1460, dir: 'up' }, bounds: { x: 820, y: 0, w: 160, h: 80 }, promptText: '⬆️ North Pass: Into The Brass Citadel' },
      { id: 'tr_nw_to_grand_hall', targetZone: 'grand_hall', targetSpawn: { x: 1200, y: 140, dir: 'down' }, bounds: { x: 820, y: 720, w: 160, h: 80 }, promptText: '⬇️ South Highway: To Sinfonia Magna (Grand Symphony Metropolis)' },
      { id: 'tr_nw_to_west', targetZone: 'west_wilderness', targetSpawn: { x: 400, y: 140, dir: 'down' }, bounds: { x: 0, y: 320, w: 80, h: 160 }, promptText: '⬅️ Northwest Valley Trail: Direct Path to Lyre Valley (West Wilderness)' },
      { id: 'tr_nw_to_east', targetZone: 'east_wilderness', targetSpawn: { x: 400, y: 140, dir: 'down' }, bounds: { x: 1720, y: 320, w: 80, h: 160 }, promptText: '➡️ Northeast Zephyr Trail: Direct Path to Breeze Glade (East Wilderness)' }
    ],
    obstacles: [
      { type: 'box', x: 0, y: 0, w: 820, h: 60, name: 'North Mesa Wall Left' },
      { type: 'box', x: 980, y: 0, w: 820, h: 60, name: 'North Mesa Wall Right' },
      { type: 'box', x: 0, y: 740, w: 820, h: 60, name: 'South Canyon Gate Left' },
      { type: 'box', x: 980, y: 740, w: 820, h: 60, name: 'South Canyon Gate Right' },
      { type: 'box', x: 0, y: 0, w: 60, h: 320, name: 'West Canyon Wall Top' },
      { type: 'box', x: 0, y: 480, w: 60, h: 320, name: 'West Canyon Wall Bottom' },
      { type: 'gate', buildingType: 'gate', x: 0, y: 320, w: 60, h: 160, name: 'West Lyre Pass Arch', signIcon: '⬅️' },
      { type: 'box', x: 1740, y: 0, w: 60, h: 320, name: 'East Canyon Wall Top' },
      { type: 'box', x: 1740, y: 480, w: 60, h: 320, name: 'East Canyon Wall Bottom' },
      { type: 'gate', buildingType: 'gate', x: 1740, y: 320, w: 60, h: 160, name: 'East Breeze Pass Arch', signIcon: '➡️' },
      // E/W Exploration Obstacles
      { type: 'circle', x: 400, y: 200, radius: 50, name: 'Acoustic Monolith' },
      { type: 'circle', x: 1400, y: 600, radius: 50, name: 'Fanfare Ridge Spire' }
    ]
  },

  // 🥁 SOUTH CARDINAL VILLAGE: Percussion Peaks (Percussion)
  percussion_peaks: {
    id: 'percussion_peaks',
    name: 'Percussion Peaks',
    subtitle: 'Stepped Ghats & Mountbeat Monastery',
    width: 2000,
    height: 1600,
    ambientBgm: 'percussion_peaks',
    themeColor: '#8b5cf6',
    defaultSpawn: { x: 1000, y: 920, dir: 'down' },
    transitions: [
      { id: 'tr_peaks_to_south_wilds', targetZone: 'south_wilderness', targetSpawn: { x: 900, y: 680, dir: 'up' }, bounds: { x: 920, y: 0, w: 160, h: 80 }, promptText: '⬆️ North Summit Pass: To Rumble Gorge (South Wilderness)' }
    ],
    obstacles: [
      { type: 'building', buildingType: 'wall', x: 0, y: 0, w: 920, h: 60, name: 'North Cliff Left' },
      { type: 'building', buildingType: 'wall', x: 1080, y: 0, w: 920, h: 60, name: 'North Cliff Right' },
      { type: 'gate', buildingType: 'gate', x: 920, y: 0, w: 160, h: 60, name: 'North Summit Gate', signIcon: '⬆️' },
      { type: 'building', buildingType: 'wall', x: 0, y: 0, w: 60, h: 1600, name: 'West Ghat Wall' },
      { type: 'building', buildingType: 'wall', x: 1940, y: 0, w: 60, h: 1600, name: 'East Ghat Wall' },
      { type: 'building', buildingType: 'wall', x: 0, y: 1540, w: 2000, h: 60, name: 'South Canyon Drop' },
      // Replicated Village Buildings (Percussion Theme)
      { type: 'building', buildingType: 'academy', x: 220, y: 280, w: 320, h: 220, name: 'Mountbeat Rhythm Academy', signIcon: '🥁', roofColor: '#581c87' },
      { type: 'building', buildingType: 'forge', x: 600, y: 280, w: 260, h: 220, name: 'The Basalt Taiko & Mallet Forge', signIcon: '🔨', roofColor: '#6b21a8' },
      { type: 'building', buildingType: 'library', x: 1200, y: 280, w: 340, h: 220, name: 'Polyrhythm Stone Vaults', signIcon: '🪨', roofColor: '#7e22ce' },
      { type: 'building', buildingType: 'tavern', x: 380, y: 960, w: 320, h: 220, name: 'The Rolling Boulder Saloon', signIcon: '🍖', roofColor: '#4c1d95' },
      { type: 'building', buildingType: 'clocktower', x: 1240, y: 960, w: 320, h: 220, name: 'Mountbeat Great Belltower', signIcon: '🔔', roofColor: '#3b0764' },
      { type: 'circle', x: 1000, y: 720, radius: 64, name: 'Resonant Bronze Gong Well' }
    ]
  },

  // 🌋 SOUTH WILDERNESS: Rumble Gorge (Deep E/W exploration width: 1800, Short N/S transit height: 800)
  south_wilderness: {
    id: 'south_wilderness',
    name: 'Rumble Gorge',
    subtitle: 'Rhythm Caverns & Echoing Caldera',
    width: 1800,
    height: 800,
    ambientBgm: 'south_wilderness',
    themeColor: '#7c3aed',
    defaultSpawn: { x: 900, y: 680, dir: 'up' },
    transitions: [
      { id: 'tr_sw_to_peaks', targetZone: 'percussion_peaks', targetSpawn: { x: 1000, y: 140, dir: 'down' }, bounds: { x: 820, y: 720, w: 160, h: 80 }, promptText: '⬇️ South Descent: Into Percussion Peaks' },
      { id: 'tr_sw_to_grand_hall', targetZone: 'grand_hall', targetSpawn: { x: 1200, y: 1860, dir: 'up' }, bounds: { x: 820, y: 0, w: 160, h: 80 }, promptText: '⬆️ North Highway: To Sinfonia Magna (Grand Symphony Metropolis)' },
      { id: 'tr_sw_to_west', targetZone: 'west_wilderness', targetSpawn: { x: 400, y: 1660, dir: 'up' }, bounds: { x: 0, y: 320, w: 80, h: 160 }, promptText: '⬅️ Southwest Basalt Pass: Direct Path to Lyre Valley (West Wilderness)' },
      { id: 'tr_sw_to_east', targetZone: 'east_wilderness', targetSpawn: { x: 400, y: 1660, dir: 'up' }, bounds: { x: 1720, y: 320, w: 80, h: 160 }, promptText: '➡️ Southeast Caldera Pass: Direct Path to Breeze Glade (East Wilderness)' }
    ],
    obstacles: [
      { type: 'box', x: 0, y: 0, w: 820, h: 60, name: 'North Gorge Rim Left' },
      { type: 'box', x: 980, y: 0, w: 820, h: 60, name: 'North Gorge Rim Right' },
      { type: 'box', x: 0, y: 740, w: 820, h: 60, name: 'South Peak Pass Left' },
      { type: 'box', x: 980, y: 740, w: 820, h: 60, name: 'South Peak Pass Right' },
      { type: 'box', x: 0, y: 0, w: 60, h: 320, name: 'West Basalt Wall Top' },
      { type: 'box', x: 0, y: 480, w: 60, h: 320, name: 'West Basalt Wall Bottom' },
      { type: 'gate', buildingType: 'gate', x: 0, y: 320, w: 60, h: 160, name: 'West Lyre Pass Arch', signIcon: '⬅️' },
      { type: 'box', x: 1740, y: 0, w: 60, h: 320, name: 'East Basalt Wall Top' },
      { type: 'box', x: 1740, y: 480, w: 60, h: 320, name: 'East Basalt Wall Bottom' },
      { type: 'gate', buildingType: 'gate', x: 1740, y: 320, w: 60, h: 160, name: 'East Breeze Pass Arch', signIcon: '➡️' },
      // E/W Exploration Obstacles
      { type: 'circle', x: 400, y: 600, radius: 50, name: 'Echoing Basalt Spire' },
      { type: 'circle', x: 1400, y: 200, radius: 50, name: 'Caldera Steam Vent' }
    ]
  },

  // 🏛️ SINFONIA MAGNA: The Grand Polyphony & Imperial Philharmonic Metropolis
  grand_hall: {
    id: 'grand_hall',
    name: 'Sinfonia Magna',
    subtitle: 'The Grand Polyphony & Imperial Philharmonic Metropolis',
    width: 2400,
    height: 2000,
    ambientBgm: 'grand_hall',
    themeColor: '#f59e0b',
    defaultSpawn: { x: 1200, y: 1000, dir: 'down' },
    transitions: [
      { id: 'tr_gh_to_west', targetZone: 'west_wilderness', targetSpawn: { x: 680, y: 900, dir: 'left' }, bounds: { x: 0, y: 920, w: 80, h: 160 }, promptText: '⬅️ West Arch: Through Lyre Valley to Cavatina Village (Strings)' },
      { id: 'tr_gh_to_east', targetZone: 'east_wilderness', targetSpawn: { x: 120, y: 900, dir: 'right' }, bounds: { x: 2320, y: 920, w: 80, h: 160 }, promptText: '➡️ East Gate: Through Breeze Glade to Woodwind Woods (Winds)' },
      { id: 'tr_gh_to_north', targetZone: 'north_wilderness', targetSpawn: { x: 900, y: 680, dir: 'up' }, bounds: { x: 1120, y: 0, w: 160, h: 80 }, promptText: '⬆️ North Colonnade: Through Echo Canyon to Brass Citadel (Brass)' },
      { id: 'tr_gh_to_south', targetZone: 'south_wilderness', targetSpawn: { x: 900, y: 120, dir: 'down' }, bounds: { x: 1120, y: 1920, w: 160, h: 80 }, promptText: '⬇️ South Grand Bridge: Through Rumble Gorge to Percussion Peaks (Percussion)' }
    ],
    obstacles: [
      // City Perimeter Walls
      { type: 'building', buildingType: 'wall', x: 0, y: 0, w: 1120, h: 60, name: 'North Colonnade Wall Left' },
      { type: 'building', buildingType: 'wall', x: 1280, y: 0, w: 1120, h: 60, name: 'North Colonnade Wall Right' },
      { type: 'building', buildingType: 'wall', x: 0, y: 1940, w: 1120, h: 60, name: 'South Colonnade Wall Left' },
      { type: 'building', buildingType: 'wall', x: 1280, y: 1940, w: 1120, h: 60, name: 'South Colonnade Wall Right' },
      { type: 'building', buildingType: 'wall', x: 0, y: 0, w: 60, h: 920, name: 'West Colonnade Wall Top' },
      { type: 'building', buildingType: 'wall', x: 0, y: 1080, w: 60, h: 920, name: 'West Colonnade Wall Bottom' },
      { type: 'building', buildingType: 'wall', x: 2340, y: 0, w: 60, h: 920, name: 'East Colonnade Wall Top' },
      { type: 'building', buildingType: 'wall', x: 2340, y: 1080, w: 60, h: 920, name: 'East Colonnade Wall Bottom' },
      // Central City Iconic Buildings - Positioned in the 4 Quadrants (North road x:1120..1280, y:0..1000 completely clear)
      // NW Quadrant: High Conservatory of Maestros
      { type: 'building', buildingType: 'academy', x: 260, y: 260, w: 480, h: 320, name: 'High Conservatory of Maestros', signIcon: '🎼', roofColor: '#1e3a8a' },
      // NE Quadrant: The Grand Symphony Hall
      { type: 'building', buildingType: 'academy', x: 1460, y: 240, w: 640, h: 360, name: 'The Grand Symphony Hall', signIcon: '🏛️', roofColor: '#831843' },
      // SW Quadrant: The Maestro's Forum & Taphouse
      { type: 'building', buildingType: 'tavern', x: 260, y: 1320, w: 480, h: 320, name: "The Maestro's Forum & Taphouse", signIcon: '🍷', roofColor: '#991b1b' },
      // SE Quadrant: Royal Archives & Solstice Council
      { type: 'building', buildingType: 'library', x: 1380, y: 1320, w: 420, h: 320, name: 'Royal Archives & Grand Library', signIcon: '📖', roofColor: '#065f46' },
      { type: 'building', buildingType: 'clocktower', x: 1860, y: 1320, w: 420, h: 320, name: 'Solstice Clocktower & Council Hall', signIcon: '⏰', roofColor: '#4c1d95' }
    ]
  }
};

/* ---------------- WORLD NPCS ROSTER ---------------- */

export const INITIAL_WORLD_NPCS: WorldNPC[] = [
  // ==================== CAVATINA VILLAGE (SETTLED STRINGS HAMLET) ====================
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
    dialogue: ["Welcome to the Practice Shed! Regular practice sharpens Technique, Tone Quality, and Tempo Stability."]
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
    dialogue: ["Welcome to the Cavatina Music Academy! Test your knowledge across progressive curriculum tiers."]
  },
  {
    id: 'npc_theory_professor',
    name: 'Professor Lyra',
    title: 'Academy Dean [SPACE to Talk]',
    x: 370,
    y: 540,
    zone: 'cavatina_village',
    isNonMusician: true,
    musicianData: {
      id: 'prof_lyra',
      name: 'Professor Lyra',
      title: 'Academy Dean',
      avatar: '🎓',
      paletteColor: '#38bdf8',
      instrumentId: 'silver_flute',
      instrumentName: 'Silver Baton',
      section: 'woodwinds',
      pet: { id: 'pet_lyra', name: 'Syllable', species: 'Staccato Songbird', sprite: 'bird', section: 'woodwinds', instrumentName: 'Silver Baton', leitmotifSound: 'flute_chirp', color: '#0284c7' },
      isNonMusician: true,
      stats: { technique: 50, toneQuality: 50, tempoStability: 50, sightReading: 50 },
      level: 10,
      xp: 1000
    },
    actionType: 'talk',
    dialogue: [
      "Greetings, young maestro! Study the Theory Lectern to advance through our 8-tier curriculum. Every drill permanently elevates your Sight-Reading!",
      "When you feel ready to explore Harmonia, the East Gate leads out into Lyre Valley, the wild path toward the Grand Symphony Hall."
    ],
    dialogueSets: [
      [
        "Greetings, young maestro! Study the Theory Lectern to advance through our 8-tier curriculum. Every drill permanently elevates your Sight-Reading!",
        "When you feel ready to explore Harmonia, the East Gate leads out into Lyre Valley, the wild path toward Sinfonia Magna."
      ],
      [
        "Remember: An octave is an interval of eight diatonic notes with double the frequency. Pure acoustic physics in action!",
        "Mastering your pitch intervals will make animal harmonization encounters twice as fast!"
      ],
      [
        "The High Conservatory in the capital has strict entry standards. Pass all 8 theory tiers and the masters will welcome you with open arms!"
      ]
    ]
  },
  {
    id: 'npc_luthier_marco',
    name: 'Master Luthier Marco',
    title: 'Artisan Craftsman [SPACE to Forge]',
    x: 730,
    y: 540,
    zone: 'cavatina_village',
    isNonMusician: true,
    musicianData: {
      id: 'luthier_marco',
      name: 'Master Marco',
      title: 'Master Luthier',
      avatar: '🔨',
      paletteColor: '#d97706',
      instrumentId: 'violin',
      instrumentName: 'Carving Chisel',
      section: 'strings',
      pet: { id: 'pet_marco', name: 'Chisel', species: 'Harmonic Beaver', sprite: 'beaver', section: 'strings', instrumentName: 'Carving Chisel', leitmotifSound: 'violin_pure', color: '#b45309' },
      isNonMusician: true,
      stats: { technique: 60, toneQuality: 70, tempoStability: 40, sightReading: 40 },
      level: 8,
      xp: 800
    },
    actionType: 'luthier_shop',
    dialogue: ["Welcome to the Forge! Bring me Notes (♪) and Inspiration Sparks (✨) to craft signature instrument artifacts and ascend your tone!"],
    dialogueSets: [
      ["Welcome to the Forge! Bring me Notes (♪) and Inspiration Sparks (✨) to craft signature instrument artifacts and ascend your tone!"],
      ["The grain of aged alpine spruce holds sonic memories, maestro. Carve with patience, and the wood will sing for centuries."],
      ["Looking to boost your Technique? The 'Carved Bridge of Precision' is my finest masterpiece. Take a look at the workshop catalog!"]
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
    dialogue: ["Welcome to the Maestro Styling Mirror! Change your outfit, hair, hat, and instrument finish."]
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
    dialogue: ["You discovered the sheet music for 'Cavatina Two-Part Invention' (Duet piece for Strings & Woodwinds)!"]
  },
  {
    id: 'npc_barkeep_barnaby',
    name: 'Barkeep Barnaby',
    title: '🍺 Barkeep Barnaby (The Melodic Rose Tavern) [SPACE]',
    x: 480,
    y: 1200,
    zone: 'cavatina_village',
    isNonMusician: true,
    musicianData: {
      id: 'barkeep_barnaby',
      name: 'Barnaby',
      title: 'Tavern Host & Storyteller',
      avatar: '🍺',
      paletteColor: '#b45309',
      instrumentId: 'acoustic_guitar',
      instrumentName: 'Tavern Stein',
      section: 'strings',
      pet: { id: 'pet_barnaby', name: 'Stein', species: 'Melody Hound', sprite: 'hound', section: 'strings', instrumentName: 'Tavern Stein', leitmotifSound: 'guitar_strum', color: '#d97706' },
      isNonMusician: true,
      stats: { technique: 45, toneQuality: 55, tempoStability: 50, sightReading: 40 },
      level: 5,
      xp: 400
    },
    actionType: 'talk',
    dialogue: [
      "Welcome, young traveler, to The Melodic Rose Tavern & Inn! I'm Barnaby, your host.",
      "The tavern is packed with young musicians trading gossip! Young Toby is out in Lyre Valley writing folk songs, and Clara has been burning up the academy floor with scale drills.",
      "Take a seat by the hearth, rest your ears, and enjoy the warm tavern hospitality!"
    ],
    dialogueSets: [
      [
        "Welcome to The Melodic Rose Tavern & Inn! Pull up a chair by the warm hearth and rest your weary feet.",
        "💡 Local Lore: Elder Timothy by the Clocktower needs brass pins for his antique music box. Master Marco at the Forge can machine them!"
      ],
      [
        "🌲 Exploration Gossip: In Woodwind Woods, you'll find the Bellflower Basin and Verdant Cascade vistas — listening there permanently elevates your stats!",
        "And keep an eye out for secret treasure chests hidden behind the weeping willow thickets!"
      ],
      [
        "Haha! You should've seen Mama Aria and Mrs. Chen arguing by the bar earlier over whose child practices more hours.",
        "I had to pour them both double-ciders just to save the glassware from their high notes!"
      ]
    ]
  },
  {
    id: 'npc_door_tavern',
    name: 'The Melodic Rose Tavern Door',
    title: '🚪 Enter The Melodic Rose Tavern & Inn [SPACE to Rest]',
    x: 540,
    y: 1180,
    zone: 'cavatina_village',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'talk',
    dialogue: ["You push open the warm oak door of The Melodic Rose Tavern & Inn. The cozy aroma of roasted apples and mulled cider fills the air!"]
  },
  {
    id: 'npc_secret_mozart',
    name: 'Wolfgang Amadeus Mozart',
    title: 'The Prankster Virtuoso [SPACE]',
    x: 240,
    y: 1100,
    zone: 'cavatina_village',
    isSecret: true,
    actionType: 'celebrity_secret',
    celebrityMotif: 'mozart',
    celebrityReward: { notes: 350, sparks: 25 },
    musicianData: {
      id: 'mozart',
      name: 'Wolfgang Amadeus Mozart',
      title: 'The Prankster Virtuoso',
      avatar: '🎭',
      paletteColor: '#e11d48',
      instrumentId: 'violin',
      instrumentName: 'Imperial Violin & Clavier',
      section: 'strings',
      pet: {
        id: 'pet_mozart_starling',
        name: 'Vogel',
        species: 'Virtuoso Starling',
        sprite: 'finch',
        section: 'strings',
        instrumentName: 'Imperial Violin',
        leitmotifSound: 'flute_chirp',
        color: '#f43f5e'
      },
      stats: { technique: 98, toneQuality: 95, tempoStability: 92, sightReading: 99 },
      level: 20,
      xp: 5000
    },
    dialogue: [
      "Hahaha! *pffft* 💨 Pardon my acoustics! You found my secret garden hideaway behind the Melodic Rose Tavern!",
      "Meet my feathered prodigy, Vogel the Starling! I whistled the opening of 'Eine kleine Nachtmusik' to him once, and now he won't stop singing it!",
      "People think classical music must be grim and serious. Nonsense! A well-timed whoopee cushion is just syncopated percussion! Keep laughing and keep playing!"
    ],
    dialogueSets: [
      [
        "Hahaha! *pffft* 💨 Pardon my acoustics! You found my secret garden hideaway behind the Melodic Rose Tavern!",
        "Meet my feathered prodigy, Vogel the Starling! I whistled the opening of 'Eine kleine Nachtmusik' to him once, and now he won't stop singing it!",
        "People think classical music must be grim and serious. Nonsense! A well-timed whoopee cushion is just syncopated percussion! Keep laughing and keep playing!"
      ],
      [
        "Did you know I composed my first symphony when I was eight years old? My dad Leopold wouldn't let me play outside until I finished the second movement!",
        "Playfulness is the secret fountain of melodic genius. Never lose your joy!"
      ],
      [
        "Mama Aria was just through here looking for you. I hid behind this hedge and played a chromatic scale on a kazoobie. She thought it was a haunted bee! Haha!"
      ]
    ]
  },
  {
    id: 'npc_door_forge',
    name: "Master Luthier's Forge Door",
    title: "🚪 Enter Master Luthier's Forge [SPACE]",
    x: 730,
    y: 500,
    zone: 'cavatina_village',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'luthier_shop',
    dialogue: ["You step inside the Artisan Forge. The rhythmic clinking of chisels and sweet scent of amber varnish welcome you!"]
  },
  {
    id: 'npc_door_academy',
    name: 'Cavatina Music Academy Door',
    title: '🚪 Enter Cavatina Music Academy [SPACE to Study]',
    x: 380,
    y: 500,
    zone: 'cavatina_village',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'theory_bench',
    theoryType: 'pitch_recognition_1',
    dialogue: ["You walk into the grand marble atrium of Cavatina Music Academy. Progressive theory lecterns line the halls!"]
  },
  {
    id: 'npc_door_library',
    name: 'Conservatory Library Door',
    title: '🚪 Enter Conservatory Library & Archives [SPACE]',
    x: 1370,
    y: 500,
    zone: 'cavatina_village',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'talk',
    dialogue: ["You enter the silent, towering shelves of the Conservatory Library. Ancient musical manuscripts glow with faint acoustic resonance."]
  },
  {
    id: 'npc_door_townhall',
    name: 'Cavatina Town Hall Door',
    title: '🚪 Enter Town Hall & Clocktower [SPACE]',
    x: 1400,
    y: 1180,
    zone: 'cavatina_village',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'talk',
    dialogue: ["You enter Cavatina Town Hall beneath the echoing chimes of the Great Clocktower. The regional quest bulletin board is prominently displayed."]
  },
  {
    id: 'npc_village_signpost',
    name: 'Village Directional Signpost',
    title: 'Read Map Guide [SPACE]',
    x: 1000,
    y: 890,
    zone: 'cavatina_village',
    isProp: true,
    propType: 'signpost',
    actionType: 'signpost',
    dialogue: [
      "🗺️ CAVATINA VILLAGE (WESTERN STRINGS HAMLET):",
      "• ➡️ EAST GATE: Follow the trail into Lyre Valley (West Wilderness) toward the Grand Symphony Hub.",
      "• 🍺 THE MELODIC ROSE TAVERN: Rest your ears and chat with local parents and youth in the southwest plaza.",
      "• 🔨 ARTISAN FORGE: Master Marco crafts signature string artifacts in the northwest quarter.",
      "• 🎼 CAVATINA ACADEMY: Study theory and practice scales in the northwest quarter."
    ]
  },
  {
    id: 'npc_busker_tim',
    name: 'Timmy',
    title: 'Preteen Street Busker (Age 12) [SPACE to Compete]',
    x: 1000,
    y: 640,
    zone: 'cavatina_village',
    wander: true,
    anchorX: 1000,
    anchorY: 640,
    musicianData: {
      id: 'rival_tim',
      name: 'Timmy',
      title: 'Preteen Busker',
      avatar: '🎸',
      paletteColor: '#f59e0b',
      instrumentId: 'acoustic_guitar',
      instrumentName: 'Acoustic Guitar',
      section: 'strings',
      pet: { id: 'pet_timmy', name: 'Pick', species: 'Vivace Hare', sprite: 'hare', section: 'strings', instrumentName: 'Acoustic Guitar', leitmotifSound: 'guitar_strum', color: '#f59e0b' },
      stats: { technique: 20, toneQuality: 20, tempoStability: 20, sightReading: 20 },
      level: 1,
      xp: 50
    },
    actionType: 'competition_stage',
    rivalId: 'rival_novice_buskers',
    dialogue: ["Hey! I'm Timmy! I busk out here by the fountain after middle school to earn lunch money and practice my chords. Wanna battle for a Reputation Star?"]
  },
  {
    id: 'npc_clara_world',
    name: 'Clara',
    title: 'Teen Violin Prodigy (Age 15) [SPACE to Jam]',
    x: 820,
    y: 850,
    zone: 'cavatina_village',
    wander: true,
    anchorX: 820,
    anchorY: 850,
    musicianData: RECRUITABLE_MUSICIANS[0],
    actionType: 'audition_battle',
    dialogue: RECRUITABLE_MUSICIANS[0].dialogue || []
  },
  {
    id: 'npc_maya_world',
    name: 'Maya',
    title: 'Goth Cello Teen (Age 15) [SPACE to Jam]',
    x: 1250,
    y: 850,
    zone: 'cavatina_village',
    wander: true,
    anchorX: 1250,
    anchorY: 850,
    musicianData: RECRUITABLE_MUSICIANS[5],
    actionType: 'audition_battle',
    dialogue: RECRUITABLE_MUSICIANS[5].dialogue || []
  },
  {
    id: 'npc_side_musicbox',
    name: 'Elder Timothy',
    title: 'Elderly Music Box Collector [SPACE]',
    x: 1100,
    y: 1100,
    zone: 'cavatina_village',
    actionType: 'talk',
    questId: 'quest_side_musicbox',
    dialogue: [
      "Ah, young maestro! My cherished antique music box lost its delicate brass cylinder pins...",
      "Could you visit Master Marco at the Artisan Forge and craft replacement pins? I would reward you handsomely with Notes and Sparks!"
    ]
  },
  {
    id: 'npc_vista_cavatina',
    name: 'Canyon of Thirds Vista',
    title: 'Attune to Acoustic Vista [SPACE]',
    x: 1650,
    y: 1100,
    zone: 'cavatina_village',
    isProp: true,
    propType: 'vista_monolith',
    actionType: 'inspiration_vista',
    vistaId: 'vista_canyon_thirds',
    dialogue: ["You stand atop the Canyon of Thirds. Natural stone arches amplify harmonic third intervals, sharpening your technique!"]
  },
  {
    id: 'npc_wild_hare',
    name: 'Wild Vivace Hare',
    title: 'Wild Harmonipet (Acoustic Guitar) [SPACE to Harmonize]',
    x: 1750,
    y: 750,
    zone: 'cavatina_village',
    wander: true,
    anchorX: 1750,
    anchorY: 750,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_hare_wild',
      name: 'Vivace',
      species: 'Vivace Hare',
      sprite: 'hare',
      section: 'strings',
      instrumentName: 'Acoustic Guitar',
      instrumentId: 'acoustic_guitar',
      leitmotifSound: 'guitar_strum',
      color: '#f59e0b'
    },
    dialogue: ["A wild Vivace Hare is strumming harmonic rhythms on its acoustic guitar! Match its cadence to bond with it!"]
  },
  {
    id: 'npc_wild_swan_cavatina',
    name: 'Wild Cantabile Swan',
    title: 'Wild Harmonipet (Violin) [SPACE to Harmonize]',
    x: 900,
    y: 1300,
    zone: 'cavatina_village',
    wander: true,
    anchorX: 900,
    anchorY: 1300,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_swan_cavatina',
      name: 'Vibrato Jr',
      species: 'Cantabile Swan',
      sprite: 'swan',
      section: 'strings',
      instrumentName: 'Concert Violin',
      instrumentId: 'violin',
      leitmotifSound: 'violin_pure',
      color: '#ec4899'
    },
    dialogue: ["A graceful Cantabile Swan floats along the south river, singing violin tones! Harmonize with it!"]
  },
  // Player's Parent & In-Game Mentor (Cavatina)
  {
    id: 'npc_player_parent',
    name: 'Mama Aria (Your Stage Mom)',
    title: 'Your Loving Parent & Mentor [SPACE to Talk]',
    x: 950,
    y: 880,
    zone: 'cavatina_village',
    wander: true,
    anchorX: 950,
    anchorY: 880,
    actionType: 'talk',
    isNonMusician: true,
    dialogue: [
      "Sweetie! Stand up straight and relax your shoulders! Have you practiced your 40 hours today?! 🎻",
      "I just texted Mrs. Chen that you're going to headline the Solstice Gala in Sinfonia Magna! Don't make me look bad in the village group chat!",
      "Remember: In animal encounters, ALWAYS use Tuning Mode first to find the notes without penalty! In busking duels, keep your pulse steady in the sweet spot!",
      "Here, take some fresh warm honey tea and a little pocket spark! Now go make your mother proud! ✨"
    ],
    dialogueSets: [
      [
        "Sweetie! Stand up straight and relax your shoulders! Have you practiced your 40 hours today?! 🎻",
        "I just texted Mrs. Chen that you're going to headline the Solstice Gala in Sinfonia Magna! Don't make me look bad in the village group chat! ✨"
      ],
      [
        "Listen carefully to your mother's advice: In animal encounters, ALWAYS use Tuning Mode first! 🐾",
        "Tuning lets you find the note without losing any composure! Once you know the melody, switch to Play Mode for the win!"
      ],
      [
        "Did you see Mrs. Chen's face when I told her your ensemble already recruited a second musician? Priceless! 💅",
        "She tried to claim Clara was practicing Paganini in her sleep. Please! My child has genuine virtuoso DNA!"
      ],
      [
        "In busking duels, remember to breathe from your diaphragm and stay locked in the sweet spot! 🎯",
        "Here, I packed you some warm chamomile honey tea and fresh almond crisps for the road! Go make Mama proud! 💖"
      ]
    ]
  },
  // Parent Spectators (Cavatina)
  {
    id: 'npc_parent_clara',
    name: "Mrs. Chen (Clara's Mom)",
    title: 'Stage Mom [SPACE to Talk]',
    x: 750,
    y: 800,
    zone: 'cavatina_village',
    wander: true,
    anchorX: 750,
    anchorY: 800,
    actionType: 'talk',
    isNonMusician: true,
    questId: 'quest_mrs_chen_score',
    dialogue: [
      "Have you seen Clara? She promised she'd practice for 40 hours today, but she's out challenging strangers by the fountain!",
      "If she doesn't make first chair at the High Conservatory, her aunt in the Brass Citadel will never let me hear the end of it."
    ],
    dialogueSets: [
      [
        "Have you seen Clara? She promised she'd practice for 40 hours today, but she's out challenging strangers by the fountain!",
        "If she doesn't make first chair at the High Conservatory, her aunt in the Brass Citadel will never let me hear the end of it."
      ],
      [
        "Your mother Aria was just bragging in the marketplace about your tempo consistency.",
        "Hmph! Clara has been doing metronome drills at 200 BPM since she was three years old. We are not worried!"
      ],
      [
        "Between you and me... Clara actually plays with much more emotion when she's performing duets with you.",
        "Don't tell her I said that, though! She needs to stay focused on her scales!"
      ]
    ]
  },
  {
    id: 'npc_parent_timmy',
    name: "Mr. Miller (Timmy's Dad)",
    title: 'Proud Father [SPACE to Talk]',
    x: 1050,
    y: 950,
    zone: 'cavatina_village',
    wander: true,
    anchorX: 1050,
    anchorY: 950,
    actionType: 'talk',
    isNonMusician: true,
    dialogue: [
      "I don't know much about fancy harmonic minor scales, but Timmy's acoustic guitar busking paid for our groceries this week.",
      "The kid's got calluses on his fingers and a smile on his face. That's good honest music!"
    ],
    dialogueSets: [
      [
        "I don't know much about fancy harmonic minor scales, but Timmy's acoustic guitar busking paid for our groceries this week.",
        "The kid's got calluses on his fingers and a smile on his face. That's good honest music!"
      ],
      [
        "Timmy was up on the roof yesterday trying to harmonize with the weather vane.",
        "He said the wind was blowing in 'B-flat major'. Looked like plain old breezy weather to me, but he's having a blast."
      ],
      [
        "If you ever need someone to hold down a steady four-on-the-floor rhythm, Timmy's your guy. He never drops a beat!"
      ]
    ]
  },
  {
    id: 'npc_spectator_cavatina',
    name: 'Old Lady Beatrice',
    title: 'Village Elder [SPACE to Talk]',
    x: 1300,
    y: 750,
    zone: 'cavatina_village',
    wander: true,
    anchorX: 1300,
    anchorY: 750,
    actionType: 'talk',
    isNonMusician: true,
    dialogue: [
      "Back in my day, we tuned our violins with rusty pitchforks, and we were grateful for the tetanus!",
      "These youngsters with their ergonomic chin rests and gold-plated tuning pegs don't know real character."
    ],
    dialogueSets: [
      [
        "Back in my day, we tuned our violins with rusty pitchforks, and we were grateful for the tetanus!",
        "These youngsters with their ergonomic chin rests and gold-plated tuning pegs don't know real character."
      ],
      [
        "I remember when the Grand Hall in Sinfonia Magna was just a muddy patch of grass with three fiddlers and a goat.",
        "Now look at it—velvet runners and brass chandeliers! Music was tougher back then, but we had grit!"
      ],
      [
        "Play me something with a little bit of bite, youngster! None of this modern airy-fairy ambient fluff!"
      ]
    ]
  },

  // ==================== WEST WILDERNESS (LYRE VALLEY & WHISPERING GLEN) ====================
  {
    id: 'npc_sign_west_wilds',
    name: 'Lyre Valley Trail Marker',
    title: 'Read Guidepost [SPACE]',
    x: 180,
    y: 840,
    zone: 'west_wilderness',
    isProp: true,
    propType: 'road_sign',
    actionType: 'signpost',
    dialogue: [
      "🌲 LYRE VALLEY (WEST WILDERNESS):",
      "• ⬅️ WEST: Direct path to Cavatina Village (Strings).",
      "• ➡️ EAST: Direct highway to The Central City (Grand Symphony Hub).",
      "• ⬆️ NORTH PASS: Direct mountain highway to Echo Canyon (North Wilderness & Brass Citadel)!",
      "• ⬇️ SOUTH PASS: Direct cliffside highway to Rumble Gorge (South Wilderness & Percussion Peaks)!"
    ]
  },
  {
    id: 'npc_sign_west_crossroads',
    name: 'Wilderness Ring Crossroads Guidepost',
    title: 'Read Crossroads Sign [SPACE]',
    x: 450,
    y: 840,
    zone: 'west_wilderness',
    isProp: true,
    propType: 'road_sign',
    actionType: 'signpost',
    dialogue: [
      "🧭 LYRE VALLEY CROSSROADS (WILDERNESS RING HIGHWAY):",
      "• ⬆️ NORTH PASS: Direct highway to Echo Canyon (North Wilderness).",
      "• ⬇️ SOUTH PASS: Direct highway to Rumble Gorge (South Wilderness).",
      "• ⬅️ WEST HIGHWAY: To Cavatina Village.",
      "• ➡️ EAST HIGHWAY: To The Central City."
    ]
  },
  {
    id: 'npc_toby_world',
    name: 'Toby',
    title: 'Acoustic Folk Kid (Age 11) [SPACE to Jam]',
    x: 400,
    y: 900,
    zone: 'west_wilderness',
    wander: true,
    anchorX: 400,
    anchorY: 900,
    musicianData: RECRUITABLE_MUSICIANS[4],
    actionType: 'audition_battle',
    dialogue: RECRUITABLE_MUSICIANS[4].dialogue || []
  },
  {
    id: 'npc_chest_west',
    name: 'Secret Willow Grove Chest',
    title: 'Open Hidden Treasure Chest [SPACE]',
    x: 300,
    y: 300,
    zone: 'west_wilderness',
    isProp: true,
    propType: 'treasure_chest',
    actionType: 'treasure_chest',
    treasureReward: { notes: 250, sparks: 15 },
    dialogue: ["You opened the hidden Willow Grove Chest! Found 250 Notes (♪) and 15 Inspiration Sparks (✨)!"]
  },
  {
    id: 'npc_score_bach_minuet',
    name: 'Mossy Stone Stand',
    title: 'Inspect Ancient Manuscript [SPACE]',
    x: 500,
    y: 400,
    zone: 'west_wilderness',
    isProp: true,
    propType: 'ancient_stone_stand',
    actionType: 'sheet_music_stand',
    sheetMusicReward: 'piece_bach_minuet',
    dialogue: ["You discovered the ancient lost folio for 'Minuet in G Major' (Baroque Duet)!"]
  },
  {
    id: 'npc_wild_hare_wilds',
    name: 'Wild Meadow Hare',
    title: 'Wild Harmonipet (Acoustic Guitar) [SPACE to Harmonize]',
    x: 350,
    y: 600,
    zone: 'west_wilderness',
    wander: true,
    anchorX: 350,
    anchorY: 600,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_hare_wilds2',
      name: 'Clover',
      species: 'Vivace Hare',
      sprite: 'hare',
      section: 'strings',
      instrumentName: 'Acoustic Guitar',
      instrumentId: 'acoustic_guitar',
      leitmotifSound: 'guitar_strum',
      color: '#f59e0b'
    },
    dialogue: ["A sprightly Meadow Hare is strumming rapid folk chords in the tall grass! Harmonize with its rhythm!"]
  },
  {
    id: 'npc_vista_silver_bow',
    name: 'Silver Bow Glen Vista',
    title: 'Attune to Acoustic Vista [SPACE]',
    x: 400,
    y: 1500,
    zone: 'west_wilderness',
    isProp: true,
    propType: 'vista_monolith',
    actionType: 'inspiration_vista',
    vistaId: 'vista_silver_bow',
    dialogue: ["You stand within the Silver Bow Glen. The soft breeze plays the willow leaves like delicate violin strings!"]
  },
  {
    id: 'npc_wild_swan',
    name: 'Wild Cantabile Swan',
    title: 'Wild Harmonipet (Violin) [SPACE to Harmonize]',
    x: 500,
    y: 1300,
    zone: 'west_wilderness',
    wander: true,
    anchorX: 500,
    anchorY: 1300,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_swan_wild',
      name: 'Grace',
      species: 'Cantabile Swan',
      sprite: 'swan',
      section: 'strings',
      instrumentName: 'Concert Violin',
      instrumentId: 'violin',
      leitmotifSound: 'violin_pure',
      color: '#ec4899'
    },
    dialogue: ["A majestic Cantabile Swan glides across the stream, singing pure lyrical violin tones! Harmonize with it!"]
  },
  {
    id: 'npc_wild_chameleon_west',
    name: 'Wild Clavichord Chameleon',
    title: 'Wild Harmonipet (Harpsichord) [SPACE to Harmonize]',
    x: 250,
    y: 800,
    zone: 'west_wilderness',
    wander: true,
    anchorX: 250,
    anchorY: 800,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_chameleon_wild',
      name: 'Camille',
      species: 'Clavichord Chameleon',
      sprite: '🦎',
      section: 'strings',
      instrumentName: 'Harpsichord',
      instrumentId: 'harpsichord',
      leitmotifSound: 'harpsichord_pluck',
      color: '#06b6d4'
    },
    dialogue: ["A glittering Clavichord Chameleon perches on the trellis, plucking bright, quill-sharp harpsichord counterpoint! Match its Baroque cadence!"]
  },
  {
    id: 'npc_wild_hedgehog_west',
    name: 'Wild Rockabilly Hedgehog',
    title: 'Wild Harmonipet (Electric Guitar) [SPACE to Harmonize]',
    x: 450,
    y: 1100,
    zone: 'west_wilderness',
    wander: true,
    anchorX: 450,
    anchorY: 1100,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_hedgehog_wild',
      name: 'Spike',
      species: 'Rockabilly Hedgehog',
      sprite: '🦔',
      section: 'strings',
      instrumentName: 'Electric Guitar',
      instrumentId: 'electric_guitar',
      leitmotifSound: 'guitar_overdrive',
      color: '#ef4444'
    },
    dialogue: ["A rebellious Rockabilly Hedgehog cranks up the amplifier distortion on its electric guitar! Match its crunchy rock riffs to bond!"]
  },
  {
    id: 'npc_puzzle_gate_west',
    name: 'Circle of Fifths Acoustic Gate (Verdant Pass)',
    title: '🌀 Circle of Fifths Acoustic Portal [SPACE to Modulate]',
    x: 550,
    y: 300,
    zone: 'west_wilderness',
    isProp: true,
    propType: 'circle_of_fifths_monolith',
    actionType: 'circle_of_fifths_puzzle',
    dialogue: ["Vines wrap around an ancient crystalline portal resonating in pure fifth intervals. Align the key modulations through the Circle of Fifths to pass!"]
  },

  // ==================== WOODWIND WOODS (SETTLED CANOPY VILLAGE) ====================
  {
    id: 'npc_theory_woods',
    name: 'Forest Druid Lectern',
    title: 'Woodwind Theory Exam (Intervals) [SPACE]',
    x: 460,
    y: 540,
    zone: 'woodwind_woods',
    isProp: true,
    propType: 'lectern',
    actionType: 'theory_bench',
    theoryType: 'intervals_ear_training',
    dialogue: ["Study the natural overtones of the forest canopy to master interval recognition and harmonic skips!"]
  },
  {
    id: 'npc_dean_woods',
    name: 'Druid Zephyr',
    title: 'Canopy Academy Dean [SPACE to Talk]',
    x: 370,
    y: 540,
    zone: 'woodwind_woods',
    isNonMusician: true,
    musicianData: {
      id: 'dean_zephyr',
      name: 'Druid Zephyr',
      title: 'Canopy Dean',
      avatar: '🍃',
      paletteColor: '#10b981',
      instrumentId: 'silver_flute',
      instrumentName: 'Druid Staff',
      section: 'woodwinds',
      pet: { id: 'pet_zephyr', name: 'Whisper', species: 'Canopy Jay', sprite: 'bird', section: 'woodwinds', instrumentName: 'Druid Staff', leitmotifSound: 'flute_chirp', color: '#10b981' },
      isNonMusician: true,
      stats: { technique: 55, toneQuality: 65, tempoStability: 45, sightReading: 60 },
      level: 9,
      xp: 900
    },
    actionType: 'talk',
    dialogue: [
      "Welcome to Sylvan Canopy! The wind carries ancient modal jazz melodies through the branches.",
      "Practice your interval ear training at our druid lectern, or visit Master Reed's workshop to carve responsive reeds."
    ],
    dialogueSets: [
      [
        "Welcome to Sylvan Canopy! The wind carries ancient modal jazz melodies through the branches.",
        "Practice your interval ear training at our druid lectern, or visit Master Reed's workshop to carve responsive reeds."
      ],
      [
        "To play woodwinds is to control the very breath of life. A relaxed throat produces a rich, warm overtone series.",
        "Take a deep breath and let the forest acoustics guide your embouchure!"
      ],
      [
        "Our students Devon and Oliver have contrasting styles—one loves cool modal jazz, the other classical rapid staccato.",
        "Both are wonderful expressions of the wind's dual nature: gentle breeze and brisk gale."
      ]
    ]
  },
  {
    id: 'npc_luthier_woods',
    name: "Master Reed's Workshop",
    title: 'Woodwind Artisan Workshop [SPACE to Forge]',
    x: 730,
    y: 540,
    zone: 'woodwind_woods',
    isNonMusician: true,
    musicianData: {
      id: 'luthier_reed',
      name: 'Master Reed',
      title: 'Cane & Flute Crafter',
      avatar: '🌾',
      paletteColor: '#059669',
      instrumentId: 'silver_flute',
      instrumentName: 'Gouging Machine',
      section: 'woodwinds',
      pet: { id: 'pet_reed', name: 'Cane', species: 'River Otter', sprite: 'otter', section: 'woodwinds', instrumentName: 'Gouging Machine', leitmotifSound: 'flute_chirp', color: '#059669' },
      isNonMusician: true,
      stats: { technique: 65, toneQuality: 65, tempoStability: 50, sightReading: 45 },
      level: 8,
      xp: 800
    },
    actionType: 'luthier_shop',
    dialogue: ["Welcome! Bring Notes and Sparks to craft premium woodwind mouthpieces, silver keypads, and rosewood bells!"],
    dialogueSets: [
      ["Welcome! Bring Notes and Sparks to craft premium woodwind mouthpieces, silver keypads, and rosewood bells!"],
      ["The secret to a responsive reed is cane seasoned under the canopy mist for three full seasons. Crisp, vibrant response every time."],
      ["If you want your flute tones to project across the valley, try the 'Silver Resonator Headjoint'. It adds effortless brilliance!"]
    ]
  },
  {
    id: 'npc_vanity_woods',
    name: 'Sylvan Canopy Wardrobe',
    title: 'Customize Avatar & Instrument [SPACE]',
    x: 1320,
    y: 530,
    zone: 'woodwind_woods',
    isProp: true,
    propType: 'vanity',
    actionType: 'customization_mirror',
    dialogue: ["Welcome to the Sylvan Styling Vanity! Change your outfit, feather caps, and emerald finishes."]
  },
  {
    id: 'npc_music_stand_woods',
    name: 'Canopy Music Stand',
    title: 'Study Sheet Music [SPACE]',
    x: 1440,
    y: 530,
    zone: 'woodwind_woods',
    isProp: true,
    propType: 'music_stand',
    actionType: 'sheet_music_stand',
    sheetMusicReward: 'piece_bossa_trio',
    dialogue: ["You discovered the sheet music for 'Sylvan Bossa Nova Serenade' (Trio piece for Woodwinds & Strings)!"]
  },
  {
    id: 'npc_hostess_flora',
    name: 'Hostess Flora',
    title: '🍵 Hostess Flora (Whispering Willow Lounge) [SPACE]',
    x: 480,
    y: 1200,
    zone: 'woodwind_woods',
    isNonMusician: true,
    musicianData: {
      id: 'hostess_flora',
      name: 'Flora',
      title: 'Tea Hostess & Flutist',
      avatar: '🍵',
      paletteColor: '#15803d',
      instrumentId: 'silver_flute',
      instrumentName: 'Tea Kettle',
      section: 'woodwinds',
      pet: { id: 'pet_flora', name: 'Blossom', species: 'Flute Frog', sprite: 'frog', section: 'woodwinds', instrumentName: 'Tea Kettle', leitmotifSound: 'flute_chirp', color: '#15803d' },
      isNonMusician: true,
      stats: { technique: 40, toneQuality: 60, tempoStability: 45, sightReading: 45 },
      level: 5,
      xp: 400
    },
    actionType: 'talk',
    dialogue: [
      "Welcome to The Whispering Willow Lounge! Have some hot honeyed chamomile tea—nothing restores a tired embouchure faster!",
      "The young jazz trio has been jamming on the canopy stage all afternoon. Listen to that sweet syncopation!"
    ],
    dialogueSets: [
      [
        "Welcome to The Whispering Willow Lounge! Have some hot honeyed chamomile tea—nothing restores a tired embouchure faster!",
        "The young jazz trio has been jamming on the canopy stage all afternoon. Listen to that sweet syncopation!"
      ],
      [
        "Looking for inspiration? The Bellflower Basin down south has natural blooming acoustic chimes. It's simply enchanting.",
        "Just watch out for playful river otters—they love stealing shiny silver keycaps!"
      ],
      [
        "A little secret from the lounge: When you harmonize with wild creatures in the glade, match their tempo before trying complex runs!"
      ]
    ]
  },
  {
    id: 'npc_door_woods_tavern',
    name: 'Whispering Willow Lounge Door',
    title: '🚪 Enter The Whispering Willow Lounge [SPACE]',
    x: 540,
    y: 1180,
    zone: 'woodwind_woods',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'talk',
    dialogue: ["You push open the woven bamboo door of The Whispering Willow Lounge. Soft bossa jazz melodies drift through the warm herbal mist."]
  },
  {
    id: 'npc_door_woods_forge',
    name: "Master Reed's Workshop Door",
    title: "🚪 Enter Master Reed's Workshop [SPACE]",
    x: 730,
    y: 500,
    zone: 'woodwind_woods',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'luthier_shop',
    dialogue: ["You step into Master Reed's Workshop. Rows of aging cane tubes and gleaming silver flute rods hang from the cedar ceiling."]
  },
  {
    id: 'npc_door_woods_academy',
    name: 'Sylvan Academy Door',
    title: '🚪 Enter Sylvan Woodwind Academy [SPACE]',
    x: 380,
    y: 500,
    zone: 'woodwind_woods',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'theory_bench',
    theoryType: 'intervals_ear_training',
    dialogue: ["You enter the open-air treehouse halls of Sylvan Academy. Wind chimes resonate in pristine harmonic fifths."]
  },
  {
    id: 'npc_door_woods_library',
    name: 'Canopy Archives Door',
    title: '🚪 Enter Canopy Acoustic Archives [SPACE]',
    x: 1370,
    y: 500,
    zone: 'woodwind_woods',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'talk',
    dialogue: ["You browse the Canopy Archives. Scrolls preserved in beeswax detail ancient wind instrument acoustic chamber designs."]
  },
  {
    id: 'npc_door_woods_townhall',
    name: 'Sylvan Town Hall Door',
    title: '🚪 Enter Sylvan Town Hall & Great Tree Dial [SPACE]',
    x: 1400,
    y: 1180,
    zone: 'woodwind_woods',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'talk',
    dialogue: ["You step beneath the Great Tree Dial. Sunlight filters through amber leaves, marking the musical hours with gentle chiming breezes."]
  },
  {
    id: 'npc_signpost_woods',
    name: 'Woodwind Woods Signpost',
    title: 'Read Map Guide [SPACE]',
    x: 1000,
    y: 830,
    zone: 'woodwind_woods',
    isProp: true,
    propType: 'signpost',
    actionType: 'signpost',
    dialogue: [
      "🗺️ WOODWIND WOODS (EASTERN CANOPY VILLAGE):",
      "• ⬅️ WEST GATE: Direct trail into Breeze Glade (East Wilderness) toward Central City.",
      "• 🍵 THE WHISPERING WILLOW LOUNGE: Warm tea and jazz gossip in the southwest plaza.",
      "• 🌾 CANE WORKSHOP: Master Reed crafts woodwind upgrades in the northwest quarter.",
      "• 🪈 SYLVAN ACADEMY: Interval theory and staccato training in the northwest quarter."
    ]
  },
  {
    id: 'npc_secret_bach',
    name: 'Johann Sebastian Bach',
    title: 'The Counterpoint Patriarch [SPACE]',
    x: 1750,
    y: 700,
    zone: 'woodwind_woods',
    isSecret: true,
    actionType: 'celebrity_secret',
    celebrityMotif: 'bach',
    celebrityReward: { notes: 400, sparks: 30 },
    musicianData: {
      id: 'bach',
      name: 'Johann Sebastian Bach',
      title: 'The Counterpoint Patriarch',
      avatar: '📜',
      paletteColor: '#15803d',
      instrumentId: 'oboe',
      instrumentName: 'Cathedral Organ Pipes & Well-Tempered Reed',
      section: 'woodwinds',
      pet: { id: 'pet_bach', name: 'Fugue', species: 'Piccolo Finch', sprite: 'finch', section: 'woodwinds', instrumentName: 'Well-Tempered Reed', leitmotifSound: 'flute_chirp', color: '#15803d' },
      stats: { technique: 100, toneQuality: 98, tempoStability: 100, sightReading: 100 },
      level: 20,
      xp: 5000
    },
    dialogue: [
      "Halt! Shhh! Watch your step in this tree hollow—Wilhelm, Carl, and Johann Jr. are practicing their 6-part fugue on the higher boughs!",
      "Directing twenty musical children while improvising organ toccatas before morning chapel is simply an exercise in harmonic parenting!",
      "Remember: Counterpoint is not math, it is a conversation between souls where everyone speaks at once, yet perfect harmony prevails!"
    ],
    dialogueSets: [
      [
        "Halt! Shhh! Watch your step in this tree hollow—Wilhelm, Carl, and Johann Jr. are practicing their 6-part fugue on the higher boughs!",
        "Directing twenty musical children while improvising organ toccatas before morning chapel is simply an exercise in harmonic parenting!",
        "Remember: Counterpoint is not math, it is a conversation between souls where everyone speaks at once, yet perfect harmony prevails!"
      ],
      [
        "There's nothing remarkable about playing the organ. All one has to do is hit the right keys at the right time and the instrument plays itself.",
        "Of course, doing so across four manuals and pedalboard at 140 BPM requires a bit of practice."
      ],
      [
        "Coffee is the nectar of contrapuntal composition! Without my morning three cups of coffee, I am like a dried-up piece of roast goat."
      ]
    ]
  },
  {
    id: 'npc_sylvan_grove',
    name: 'Leo & The Canopy Trio',
    title: 'Teen Bossa Trio (Ages 14-16) [SPACE to Compete]',
    x: 1500,
    y: 950,
    zone: 'woodwind_woods',
    wander: true,
    anchorX: 1500,
    anchorY: 950,
    actionType: 'competition_stage',
    rivalId: 'rival_woodwind_trio',
    dialogue: ["Yo! We're the Whispering Canopy Trio! We won the regional youth jazz fest last summer. Think you can handle our bossa syncopation?"]
  },
  {
    id: 'npc_oliver_world',
    name: 'Oliver',
    title: 'Preteen Flute Nature Nerd (Age 13) [SPACE to Jam]',
    x: 900,
    y: 850,
    zone: 'woodwind_woods',
    wander: true,
    anchorX: 900,
    anchorY: 850,
    musicianData: RECRUITABLE_MUSICIANS[1],
    actionType: 'audition_battle',
    dialogue: RECRUITABLE_MUSICIANS[1].dialogue || []
  },
  {
    id: 'npc_devon_world',
    name: 'Devon',
    title: 'Indie College Saxophonist (Age 19) [SPACE to Jam]',
    x: 1300,
    y: 550,
    zone: 'woodwind_woods',
    wander: true,
    anchorX: 1300,
    anchorY: 550,
    musicianData: RECRUITABLE_MUSICIANS[7],
    actionType: 'audition_battle',
    dialogue: RECRUITABLE_MUSICIANS[7].dialogue || []
  },
  {
    id: 'npc_wild_finch',
    name: 'Wild Piccolo Finch',
    title: 'Wild Harmonipet (Silver Flute) [SPACE to Harmonize]',
    x: 600,
    y: 900,
    zone: 'woodwind_woods',
    wander: true,
    anchorX: 600,
    anchorY: 900,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_finch_wild',
      name: 'Chirpy',
      species: 'Piccolo Finch',
      sprite: 'finch',
      section: 'woodwinds',
      instrumentName: 'Silver Flute',
      instrumentId: 'silver_flute',
      leitmotifSound: 'flute_chirp',
      color: '#10b981'
    },
    dialogue: ["A colorful Piccolo Finch flutters between the branches, chirping high-velocity woodwind runs! Echo its pitch!"]
  },
  {
    id: 'npc_wild_otter',
    name: 'Wild Reed Otter',
    title: 'Wild Harmonipet (Clarinet) [SPACE to Harmonize]',
    x: 1400,
    y: 1200,
    zone: 'woodwind_woods',
    wander: true,
    anchorX: 1400,
    anchorY: 1200,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_otter_wild',
      name: 'Echo',
      species: 'River Otter',
      sprite: 'otter',
      section: 'woodwinds',
      instrumentName: 'Clarinet',
      instrumentId: 'clarinet',
      leitmotifSound: 'flute_chirp',
      color: '#059669'
    },
    dialogue: ["A playful River Otter slides down the mudbank, blowing smooth clarinet arpeggios! Match its tone to bond!"]
  },
  {
    id: 'npc_vista_bellflower',
    name: 'Bellflower Basin Vista',
    title: 'Attune to Acoustic Vista [SPACE]',
    x: 800,
    y: 1250,
    zone: 'woodwind_woods',
    isProp: true,
    propType: 'vista_monolith',
    actionType: 'inspiration_vista',
    vistaId: 'vista_bellflower',
    dialogue: ["The natural bellflowers in the basin chime in gentle resonance, boosting your tone!"]
  },
  {
    id: 'npc_vista_verdant_waterfall',
    name: 'Verdant Waterfall Vista',
    title: 'Attune to Acoustic Vista [SPACE]',
    x: 1650,
    y: 650,
    zone: 'woodwind_woods',
    isProp: true,
    propType: 'vista_monolith',
    actionType: 'inspiration_vista',
    vistaId: 'vista_verdant_waterfall',
    dialogue: ["The cascading waterfall hums a continuous harmonic pedal point, clearing your pitch!"]
  },
  // Parent Spectators (Woodwinds)
  {
    id: 'npc_parent_oliver',
    name: "Mr. Higgins (Oliver's Dad)",
    title: 'Tired Father [SPACE to Talk]',
    x: 850,
    y: 900,
    zone: 'woodwind_woods',
    wander: true,
    anchorX: 850,
    anchorY: 900,
    actionType: 'talk',
    isNonMusician: true,
    dialogue: [
      "My boy Oliver loves the flute. It's great, except he wakes up at 5:00 AM trying to harmonize with the piccolos outside his bedroom window.",
      "Do you know how loud a high-register piccolo trill is before your first cup of coffee? It pierces bone."
    ],
    dialogueSets: [
      [
        "My boy Oliver loves the flute. It's great, except he wakes up at 5:00 AM trying to harmonize with the piccolos outside his bedroom window.",
        "Do you know how loud a high-register piccolo trill is before your first cup of coffee? It pierces bone."
      ],
      [
        "Yesterday Oliver tried to explain 'triple tonguing' to me while eating cereal. Milk went everywhere.",
        "He's passionate, I'll give him that. Just wish his instrument had a volume knob."
      ],
      [
        "Mama Aria told me your group is heading to Sinfonia Magna. If Oliver joins you, make sure he eats his vegetables!"
      ]
    ]
  },
  {
    id: 'npc_spectator_woods',
    name: 'Birdwatcher Martha',
    title: 'Audubon Enthusiast [SPACE to Talk]',
    x: 1150,
    y: 800,
    zone: 'woodwind_woods',
    wander: true,
    anchorX: 1150,
    anchorY: 800,
    actionType: 'talk',
    isNonMusician: true,
    dialogue: [
      "I came all the way from the capital to spot rare finches, but these teenage woodwind prodigies keep confusing the birds with their trills!",
      "Yesterday a cedar waxwing tried to mate with Oliver's flute case. Complete pandemonium."
    ],
    dialogueSets: [
      [
        "I came all the way from the capital to spot rare finches, but these teenage woodwind prodigies keep confusing the birds with their trills!",
        "Yesterday a cedar waxwing tried to mate with Oliver's flute case. Complete pandemonium."
      ],
      [
        "Did you know the Great Canopy Hornbill only sings in major sevenths? Nature has impeccable musical taste.",
        "If you listen closely to the breeze in the reeds, you can hear a natural whole-tone scale!"
      ],
      [
        "Keep practicing, young musician! The birds are very harsh critics, but I think they like your tone."
      ]
    ]
  },
  {
    id: 'npc_parent_penny',
    name: "Dr. Thorne (Penny's Dad)",
    title: 'Resigned Parent [SPACE to Talk]',
    x: 1050,
    y: 950,
    zone: 'woodwind_woods',
    wander: true,
    anchorX: 1050,
    anchorY: 950,
    actionType: 'talk',
    isNonMusician: true,
    dialogue: [
      "Penny originally wanted to play drums. I bought her an oboe thinking it would be quiet and refined.",
      "Now our house sounds like a dying goose at 2:00 in the morning. But she's happy, so I wear earplugs."
    ],
    dialogueSets: [
      [
        "Penny originally wanted to play drums. I bought her an oboe thinking it would be quiet and refined.",
        "Now our house sounds like a dying goose at 2:00 in the morning. But she's happy, so I wear earplugs."
      ],
      [
        "As a botanist, I study plants. As an oboist's father, I study the acoustic properties of soundproof wall foam.",
        "So far, three layers of velvet and egg cartons are holding the peace with our neighbors."
      ],
      [
        "Double reeds take incredible lung pressure. Penny has stronger lung capacity than a pearl diver now!"
      ]
    ]
  },

  // ==================== EAST WILDERNESS (BREEZE GLADE & BAMBOO MARSH) ====================
  {
    id: 'npc_sign_east_wilds',
    name: 'Breeze Glade Trail Marker',
    title: 'Read Guidepost [SPACE]',
    x: 620,
    y: 840,
    zone: 'east_wilderness',
    isProp: true,
    propType: 'road_sign',
    actionType: 'signpost',
    dialogue: [
      "🍃 BREEZE GLADE (EAST WILDERNESS):",
      "• ➡️ EAST: Direct trail into Woodwind Woods (Woodwinds).",
      "• ⬅️ WEST: Direct highway to The Central City (Grand Symphony Hub).",
      "• ⬆️ NORTH PASS: Direct mountain highway to Echo Canyon (North Wilderness & Brass Citadel)!",
      "• ⬇️ SOUTH PASS: Direct glade highway to Rumble Gorge (South Wilderness & Percussion Peaks)!"
    ]
  },
  {
    id: 'npc_sign_east_crossroads',
    name: 'Wilderness Ring Crossroads Guidepost',
    title: 'Read Crossroads Sign [SPACE]',
    x: 350,
    y: 840,
    zone: 'east_wilderness',
    isProp: true,
    propType: 'road_sign',
    actionType: 'signpost',
    dialogue: [
      "🧭 BREEZE GLADE CROSSROADS (WILDERNESS RING HIGHWAY):",
      "• ⬆️ NORTH PASS: Direct highway to Echo Canyon (North Wilderness).",
      "• ⬇️ SOUTH PASS: Direct highway to Rumble Gorge (South Wilderness).",
      "• ➡️ EAST TRAIL: To Woodwind Woods.",
      "• ⬅️ WEST HIGHWAY: To The Central City."
    ]
  },
  {
    id: 'npc_chloe_world',
    name: 'Chloe',
    title: 'Shy Oboe Prodigy (Age 12) [SPACE to Jam]',
    x: 400,
    y: 900,
    zone: 'east_wilderness',
    wander: true,
    anchorX: 400,
    anchorY: 900,
    musicianData: RECRUITABLE_MUSICIANS[6],
    actionType: 'audition_battle',
    dialogue: RECRUITABLE_MUSICIANS[6].dialogue || []
  },
  {
    id: 'npc_secret_satie',
    name: 'Erik Satie',
    title: 'The Velvet Eccentric [SPACE]',
    x: 240,
    y: 250,
    zone: 'east_wilderness',
    isSecret: true,
    actionType: 'celebrity_secret',
    celebrityMotif: 'satie',
    celebrityReward: { notes: 350, sparks: 25 },
    musicianData: {
      id: 'satie',
      name: 'Erik Satie',
      title: 'The Velvet Eccentric',
      avatar: '☂️',
      paletteColor: '#64748b',
      instrumentId: 'harp',
      instrumentName: 'Velvet Gymnopedie Chimes',
      section: 'strings',
      pet: { id: 'pet_satie', name: 'Velours', species: 'Allegro Swan', sprite: 'swan', section: 'strings', instrumentName: 'Velvet Gymnopedie Chimes', leitmotifSound: 'violin_pure', color: '#64748b' },
      stats: { technique: 90, toneQuality: 98, tempoStability: 95, sightReading: 92 },
      level: 20,
      xp: 5000
    },
    dialogue: [
      "*Softly humming Gymnopédie No. 1...* Ah, bonjour. Please, mind the umbrella. I must protect my complexion from yellow and red wavelengths.",
      "My doctor insists on a strict regimen: I eat exclusively white foods. Hard-boiled egg whites, powdered sugar, grated coconut, and occasionally finely shredded parchment paper.",
      "Why play twenty notes when one quiet, melancholy cadence can stop time itself? Take these sparks and listen to the velvet spaces between sounds."
    ],
    dialogueSets: [
      [
        "*Softly humming Gymnopédie No. 1...* Ah, bonjour. Please, mind the umbrella. I must protect my complexion from yellow and red wavelengths.",
        "My doctor insists on a strict regimen: I eat exclusively white foods. Hard-boiled egg whites, powdered sugar, grated coconut, and occasionally finely shredded parchment paper.",
        "Why play twenty notes when one quiet, melancholy cadence can stop time itself? Take these sparks and listen to the velvet spaces between sounds."
      ],
      [
        "I own twelve identical grey velvet suits and eighty-four walking sticks. Eccentric? No, simply consistent.",
        "When you perform, try playing like a nightingale with a toothache. The melancholic tension is exquisite."
      ],
      [
        "Do not be afraid of simplicity. An unadorned open fifth chord holds more mystery than a hundred hurried scales."
      ]
    ]
  },
  {
    id: 'npc_vista_zephyr_falls',
    name: 'Zephyr Falls Vista',
    title: 'Attune to Acoustic Vista [SPACE]',
    x: 400,
    y: 300,
    zone: 'east_wilderness',
    isProp: true,
    propType: 'vista_monolith',
    actionType: 'inspiration_vista',
    vistaId: 'vista_zephyr_falls',
    dialogue: ["The crystalline spray of Zephyr Falls sings in harmonious fifths, clearing your musical mind!"]
  },
  {
    id: 'npc_wild_frog',
    name: 'Wild Flute Frog',
    title: 'Wild Harmonipet (Oboe) [SPACE to Harmonize]',
    x: 350,
    y: 500,
    zone: 'east_wilderness',
    wander: true,
    anchorX: 350,
    anchorY: 500,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_frog_wild',
      name: 'Syncopate',
      species: 'Flute Frog',
      sprite: 'frog',
      section: 'woodwinds',
      instrumentName: 'Silver Oboe',
      instrumentId: 'oboe',
      leitmotifSound: 'flute_chirp',
      color: '#059669'
    },
    dialogue: ["A luminous green Flute Frog croaks with rich double-reed resonance upon a lily pad! Match its arpeggio!"]
  },
  {
    id: 'npc_wild_finch_wilds',
    name: 'Wild Canopy Finch',
    title: 'Wild Harmonipet (Silver Flute) [SPACE to Harmonize]',
    x: 550,
    y: 400,
    zone: 'east_wilderness',
    wander: true,
    anchorX: 550,
    anchorY: 400,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_finch_wilds2',
      name: 'Zephyr Jr',
      species: 'Piccolo Finch',
      sprite: 'finch',
      section: 'woodwinds',
      instrumentName: 'Silver Flute',
      instrumentId: 'silver_flute',
      leitmotifSound: 'flute_chirp',
      color: '#10b981'
    },
    dialogue: ["A wild Canopy Finch is singing syncopated woodwind scales in the misty reeds! Harmonize with its melody!"]
  },
  {
    id: 'npc_chest_east',
    name: 'Bamboo Secret Alcove Chest',
    title: 'Open Hidden Treasure Chest [SPACE]',
    x: 500,
    y: 1500,
    zone: 'east_wilderness',
    isProp: true,
    propType: 'treasure_chest',
    actionType: 'treasure_chest',
    treasureReward: { notes: 250, sparks: 15 },
    dialogue: ["You discovered the Bamboo Secret Alcove Chest! Claimed 250 Notes (♪) and 15 Inspiration Sparks (✨)!"]
  },
  {
    id: 'npc_score_debussy_reverie',
    name: 'Bamboo Altar Stand',
    title: 'Inspect Ancient Manuscript [SPACE]',
    x: 300,
    y: 1400,
    zone: 'east_wilderness',
    isProp: true,
    propType: 'ancient_stone_stand',
    actionType: 'sheet_music_stand',
    sheetMusicReward: 'piece_debussy_reverie',
    dialogue: ["You unearthed the impressionist masterpiece 'Rêverie for Woodwind Trio'!"]
  },
  {
    id: 'npc_wild_sax_fox_east',
    name: 'Wild Bebop Fox',
    title: 'Wild Harmonipet (Saxophone) [SPACE to Harmonize]',
    x: 450,
    y: 700,
    zone: 'east_wilderness',
    wander: true,
    anchorX: 450,
    anchorY: 700,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_sax_fox_wild',
      name: 'Dexter',
      species: 'Bebop Fox',
      sprite: '🦊',
      section: 'woodwinds',
      instrumentName: 'Saxophone',
      instrumentId: 'saxophone',
      leitmotifSound: 'sax_vibrato',
      color: '#f97316'
    },
    dialogue: ["A cool Bebop Fox swings beneath the sylvan willow, improvising smoky jazz saxophone lines with rich, warm vibrato! Harmonize with its melody!"]
  },

  // ==================== BRASS CITADEL (SETTLED GILDED METRO) ====================
  {
    id: 'npc_theory_citadel',
    name: 'Citadel Theory Lectern',
    title: 'Brass Theory Exam (Triads & Chords) [SPACE]',
    x: 460,
    y: 540,
    zone: 'brass_citadel',
    isProp: true,
    propType: 'lectern',
    actionType: 'theory_bench',
    theoryType: 'triads_chords',
    dialogue: ["Master the construction of major, minor, and augmented brass triads to command heroic projection!"]
  },
  {
    id: 'npc_dean_citadel',
    name: 'Commandant Sterling',
    title: 'Citadel Conservatory Dean [SPACE to Talk]',
    x: 370,
    y: 540,
    zone: 'brass_citadel',
    isNonMusician: true,
    musicianData: {
      id: 'dean_sterling',
      name: 'Commandant Sterling',
      title: 'Brass Commandant',
      avatar: '🎺',
      paletteColor: '#eab308',
      instrumentId: 'pocket_trumpet',
      instrumentName: 'Command Baton',
      section: 'brass',
      pet: { id: 'pet_sterling', name: 'Valor', species: 'Fanfare Terrier', sprite: 'terrier', section: 'brass', instrumentName: 'Command Baton', leitmotifSound: 'trumpet_blare', color: '#eab308' },
      isNonMusician: true,
      stats: { technique: 65, toneQuality: 70, tempoStability: 60, sightReading: 50 },
      level: 10,
      xp: 1000
    },
    actionType: 'talk',
    dialogue: [
      "Stand tall, recruit! In the Brass Citadel, breath control and impeccable posture are the cornerstones of victory.",
      "Take our Triad Exam at the lectern, or commission high-flow brass mutes at Master Vulcan's foundry."
    ],
    dialogueSets: [
      [
        "Stand tall, recruit! In the Brass Citadel, breath control and impeccable posture are the cornerstones of victory.",
        "Take our Triad Exam at the lectern, or commission high-flow brass mutes at Master Vulcan's foundry."
      ],
      [
        "A triad is the bedrock of Western harmony: Root, Third, and Fifth. Stack them with precision, and you can command acoustic shockwaves!",
        "Mastering your triad theory unlocks tremendous projection and dynamic range for your entire ensemble."
      ],
      [
        "Jax has undeniable firepower on the trumpet, but an orchestra requires unity over ego.",
        "Help him learn the beauty of harmonic counterpoint and he will become an unstoppable soloist!"
      ]
    ]
  },
  {
    id: 'npc_luthier_citadel',
    name: 'The Gilded Horn Foundry',
    title: 'Brass Smithy & Horn Forge [SPACE to Forge]',
    x: 730,
    y: 540,
    zone: 'brass_citadel',
    isNonMusician: true,
    musicianData: {
      id: 'luthier_vulcan',
      name: 'Master Vulcan',
      title: 'Master Brass Smith',
      avatar: '📯',
      paletteColor: '#a16207',
      instrumentId: 'french_horn',
      instrumentName: 'Brass Anvil',
      section: 'brass',
      pet: { id: 'pet_vulcan', name: 'Anvil', species: 'Citadel Ram', sprite: 'ram', section: 'brass', instrumentName: 'Brass Anvil', leitmotifSound: 'horn_call', color: '#a16207' },
      isNonMusician: true,
      stats: { technique: 60, toneQuality: 75, tempoStability: 55, sightReading: 40 },
      level: 8,
      xp: 800
    },
    actionType: 'luthier_shop',
    dialogue: ["Fire up the furnace! Bring Notes and Sparks to forge golden valve oil, heavy brass mutes, and bell flares!"],
    dialogueSets: [
      ["Fire up the furnace! Bring Notes and Sparks to forge golden valve oil, heavy brass mutes, and bell flares!"],
      ["Tempering brass at 800 degrees aligns the alloy's crystalline structure. That's why our horns roar louder than thunder!"],
      ["Need extra tempo stability under pressure? The 'Heavyweighted Leadpipe' keeps your embouchure steady even in a hurricane!"]
    ]
  },
  {
    id: 'npc_vanity_citadel',
    name: 'Citadel Herald Vanity',
    title: 'Customize Avatar & Instrument [SPACE]',
    x: 1320,
    y: 530,
    zone: 'brass_citadel',
    isProp: true,
    propType: 'vanity',
    actionType: 'customization_mirror',
    dialogue: ["Welcome to the Citadel Herald Vanity! Upgrade your marching uniforms, plume berets, and gilded gold finishes."]
  },
  {
    id: 'npc_music_stand_citadel',
    name: 'Gilded Music Stand',
    title: 'Study Sheet Music [SPACE]',
    x: 1440,
    y: 530,
    zone: 'brass_citadel',
    isProp: true,
    propType: 'music_stand',
    actionType: 'sheet_music_stand',
    sheetMusicReward: 'piece_starlight_quartet',
    dialogue: ["You discovered the sheet music for 'Starlight Fanfare' (Quartet piece for Brass & Ensemble)!"]
  },
  {
    id: 'npc_sergeant_brass',
    name: 'Sergeant Brass',
    title: '🍺 Sergeant Brass (Golden Trumpet Canteen) [SPACE]',
    x: 480,
    y: 1200,
    zone: 'brass_citadel',
    isNonMusician: true,
    musicianData: {
      id: 'sergeant_brass',
      name: 'Sgt Brass',
      title: 'Canteen Host & Bugler',
      avatar: '🍺',
      paletteColor: '#c2410c',
      instrumentId: 'pocket_trumpet',
      instrumentName: 'Canteen Stein',
      section: 'brass',
      pet: { id: 'pet_sgt_brass', name: 'Bugler', species: 'Fanfare Badger', sprite: 'badger', section: 'brass', instrumentName: 'Canteen Stein', leitmotifSound: 'horn_call', color: '#c2410c' },
      isNonMusician: true,
      stats: { technique: 50, toneQuality: 60, tempoStability: 55, sightReading: 40 },
      level: 6,
      xp: 500
    },
    actionType: 'talk',
    dialogue: [
      "Drink up, recruits! A proper fortissimo swell burns five hundred calories an hour! Grab an ice-cold sparkling sarsaparilla.",
      "Baroness Vesta and her fanfare brigade have been doing marching drills in the central concourse. Pure military precision!"
    ],
    dialogueSets: [
      [
        "Drink up, recruits! A proper fortissimo swell burns five hundred calories an hour! Grab an ice-cold sparkling sarsaparilla.",
        "Baroness Vesta and her fanfare brigade have been doing marching drills in the central concourse. Pure military precision!"
      ],
      [
        "Out in Echo Canyon, the acoustic reverberation is so intense you can play a call and harmonize with your own echo four seconds later!",
        "Watch out for wild fanfare terriers, though—they love chasing shiny valve caps!"
      ],
      [
        "Old Horatio was telling war stories about the Great Fanfare Campaign again. Half of it is exaggerated, but the man can still blast a high C!"
      ]
    ]
  },
  {
    id: 'npc_door_citadel_tavern',
    name: 'Golden Trumpet Canteen Door',
    title: '🚪 Enter Golden Trumpet Canteen [SPACE]',
    x: 540,
    y: 1180,
    zone: 'brass_citadel',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'talk',
    dialogue: ["You push through the heavy swinging bronze doors of The Golden Trumpet Canteen. Robust marching marches echo over hearty laughter."]
  },
  {
    id: 'npc_door_citadel_forge',
    name: 'Gilded Horn Foundry Door',
    title: '🚪 Enter Gilded Horn Foundry [SPACE]',
    x: 730,
    y: 500,
    zone: 'brass_citadel',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'luthier_shop',
    dialogue: ["You enter the blast of heat from the Gilded Horn Foundry. Red-hot brass bells are quenched in oil with a triumphant hiss!"]
  },
  {
    id: 'npc_door_citadel_academy',
    name: 'Citadel Conservatory Door',
    title: '🚪 Enter Citadel Brass Conservatory [SPACE]',
    x: 380,
    y: 500,
    zone: 'brass_citadel',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'theory_bench',
    theoryType: 'triads_chords',
    dialogue: ["You step into the vaulted stone amphitheater of the Brass Conservatory. Golden banners hang from massive triumphal arches."]
  },
  {
    id: 'npc_door_citadel_library',
    name: 'Citadel Archives Door',
    title: '🚪 Enter Citadel War Fanfare Archives [SPACE]',
    x: 1370,
    y: 500,
    zone: 'brass_citadel',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'talk',
    dialogue: ["You explore the Fanfare Archives. Illuminated bronze plates document the historic fanfare signals of Harmonia's defense corps."]
  },
  {
    id: 'npc_door_citadel_townhall',
    name: 'Citadel High Council Door',
    title: '🚪 Enter Citadel High Council & Solar Dial [SPACE]',
    x: 1400,
    y: 1180,
    zone: 'brass_citadel',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'talk',
    dialogue: ["You enter the High Council Chamber beneath the golden solar chronometer. The Citadel's regional defense bounties are posted here."]
  },
  {
    id: 'npc_signpost_citadel',
    name: 'Citadel Directional Signpost',
    title: 'Read Map Guide [SPACE]',
    x: 1000,
    y: 830,
    zone: 'brass_citadel',
    isProp: true,
    propType: 'signpost',
    actionType: 'signpost',
    dialogue: [
      "🗺️ THE BRASS CITADEL (NORTHERN GILDED BASTION):",
      "• ⬇️ SOUTH BASTION: Direct highway through Echo Canyon to Central City.",
      "• 🍺 GOLDEN TRUMPET CANTEEN: Rations and marching band banter in the southwest concourse.",
      "• 📯 HORN FOUNDRY: Master Vulcan crafts brass bells and valve upgrades in the northwest quarter.",
      "• 🎺 BRASS CONSERVATORY: Triad harmonic exams in the northwest quarter."
    ]
  },
  {
    id: 'npc_baron_world',
    name: 'Jax "The Brass Baron"',
    title: 'High School Band Lead (Age 17) [SPACE to Jam]',
    x: 1000,
    y: 800,
    zone: 'brass_citadel',
    wander: true,
    anchorX: 1000,
    anchorY: 800,
    musicianData: RECRUITABLE_MUSICIANS[2],
    actionType: 'audition_battle',
    dialogue: RECRUITABLE_MUSICIANS[2].dialogue || []
  },
  {
    id: 'npc_vesta_citadel',
    name: 'Baroness Vesta',
    title: 'High School Marching Captain (Age 17) [SPACE to Compete]',
    x: 1500,
    y: 600,
    zone: 'brass_citadel',
    wander: true,
    anchorX: 1500,
    anchorY: 600,
    actionType: 'competition_stage',
    rivalId: 'rival_brass_quartet',
    dialogue: ["Attention! I'm Baroness Vesta, drum major of the Citadel Fanfare Brigade. Our brass quartet has won state honors three years running. Think you can out-project us?"]
  },
  {
    id: 'npc_wild_terrier',
    name: 'Wild Fanfare Terrier',
    title: 'Wild Harmonipet (Pocket Trumpet) [SPACE to Harmonize]',
    x: 1200,
    y: 1100,
    zone: 'brass_citadel',
    wander: true,
    anchorX: 1200,
    anchorY: 1100,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_terrier_wild',
      name: 'Rally',
      species: 'Fanfare Terrier',
      sprite: 'terrier',
      section: 'brass',
      instrumentName: 'Pocket Trumpet',
      instrumentId: 'pocket_trumpet',
      leitmotifSound: 'trumpet_blare',
      color: '#eab308'
    },
    dialogue: ["An energetic Fanfare Terrier is yapping out crisp brass fifths! Match its barking rhythm!"]
  },
  {
    id: 'npc_wild_ram',
    name: 'Wild Citadel Ram',
    title: 'Wild Harmonipet (French Horn) [SPACE to Harmonize]',
    x: 400,
    y: 1200,
    zone: 'brass_citadel',
    wander: true,
    anchorX: 400,
    anchorY: 1200,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_ram_wild',
      name: 'Valiant',
      species: 'Citadel Ram',
      sprite: 'ram',
      section: 'brass',
      instrumentName: 'French Horn',
      instrumentId: 'french_horn',
      leitmotifSound: 'horn_call',
      color: '#eab308'
    },
    dialogue: ["A noble Citadel Ram stomps proudly upon the gilded stone, blaring warm French horn fanfares! Echo its motif!"]
  },
  {
    id: 'npc_vista_echo_falls',
    name: 'Echo Falls Vista',
    title: 'Attune to Acoustic Vista [SPACE]',
    x: 750,
    y: 1250,
    zone: 'brass_citadel',
    isProp: true,
    propType: 'vista_monolith',
    actionType: 'inspiration_vista',
    vistaId: 'vista_echo_falls',
    dialogue: ["The echoing falls reverberate with crystalline brilliance, boosting your technique!"]
  },
  {
    id: 'npc_vista_sunlit_pinnacle',
    name: 'Sunlit Pinnacle Vista',
    title: 'Attune to Acoustic Vista [SPACE]',
    x: 1650,
    y: 650,
    zone: 'brass_citadel',
    isProp: true,
    propType: 'vista_monolith',
    actionType: 'inspiration_vista',
    vistaId: 'vista_sunlit_pinnacle',
    dialogue: ["Standing upon the Sunlit Pinnacle, your musical spirit swells with heroic projection!"]
  },
  // Parent Spectators (Brass)
  {
    id: 'npc_parent_jax',
    name: "Officer Briggs (Jax's Dad)",
    title: 'Patrol Captain [SPACE to Talk]',
    x: 950,
    y: 850,
    zone: 'brass_citadel',
    wander: true,
    anchorX: 950,
    anchorY: 850,
    actionType: 'talk',
    isNonMusician: true,
    dialogue: [
      "Jax says he's 'first chair in the Citadel Youth Brigade'. All I know is every time he hits a high C, my patrol cruiser alarm goes off across the plaza.",
      "I love the boy's confidence, but the city council keeps sending me noise ordinances with my own signature on them."
    ],
    dialogueSets: [
      [
        "Jax says he's 'first chair in the Citadel Youth Brigade'. All I know is every time he hits a high C, my patrol cruiser alarm goes off across the plaza.",
        "I love the boy's confidence, but the city council keeps sending me noise ordinances with my own signature on them."
      ],
      [
        "Yesterday Jax challenged a steam train to a volume battle at the crossing. The train had to yield the right of way.",
        "If you take him on tour with your ensemble, just remind him that 'pianissimo' means quiet, not 'slightly less loud'!"
      ],
      [
        "Mama Aria texted me claiming her kid practices 40 hours a day. I told her in the Citadel, our kids practice 40 hours BEFORE breakfast!"
      ]
    ]
  },
  {
    id: 'npc_spectator_citadel',
    name: 'Mrs. Gable',
    title: 'Exhausted Mother [SPACE to Talk]',
    x: 1350,
    y: 750,
    zone: 'brass_citadel',
    wander: true,
    anchorX: 1350,
    anchorY: 750,
    actionType: 'talk',
    isNonMusician: true,
    dialogue: [
      "My son took up the sousaphone. We had to reinforce our living room floorboards and remove all delicate porcelain china.",
      "Whenever he practices pedal tones, the cat hovers three inches off the rug from the acoustic vibration."
    ],
    dialogueSets: [
      [
        "My son took up the sousaphone. We had to reinforce our living room floorboards and remove all delicate porcelain china.",
        "Whenever he practices pedal tones, the cat hovers three inches off the rug from the acoustic vibration."
      ],
      [
        "I tried buying him earplugs. He said, 'Mom, how can I feel the glory of the brass if my ears are insulated?!'",
        "Now the entire neighborhood knows the Bb major scale by heart."
      ],
      [
        "You look like a sensible musician with good taste. Please tell me your ensemble uses woodwinds or strings to balance out all this brass blast!"
      ]
    ]
  },
  {
    id: 'npc_veteran_brass',
    name: 'Veteran Horatio',
    title: 'Old Bugler [SPACE to Talk]',
    x: 750,
    y: 750,
    zone: 'brass_citadel',
    wander: true,
    anchorX: 750,
    anchorY: 750,
    actionType: 'talk',
    isNonMusician: true,
    dialogue: [
      "A true brass soldier doesn't apologize for spit valves—they let the music flow directly into the ground! That's what I told the health inspector.",
      "The man had no respect for acoustic acoustics. Gave me a ticket anyway."
    ],
    dialogueSets: [
      [
        "A true brass soldier doesn't apologize for spit valves—they let the music flow directly into the ground! That's what I told the health inspector.",
        "The man had no respect for acoustic acoustics. Gave me a ticket anyway."
      ],
      [
        "In the old days, we didn't have rotary valves or fancy monel pistons. We bent pitch using pure lip tension and grit!",
        "Kids today with their ultra-light titanium trumpets... back in my day, the trumpet weighed twenty pounds and doubled as a shield!"
      ],
      [
        "Keep your chin up and your air column straight, rookie! Sound the alarm and let them hear you all the way in Sinfonia Magna!"
      ]
    ]
  },

  // ==================== NORTH WILDERNESS (ECHO CANYON & RED ROCK STEPPES) ====================
  {
    id: 'npc_sign_north_wilds',
    name: 'Echo Canyon Trail Marker',
    title: 'Read Guidepost [SPACE]',
    x: 950,
    y: 180,
    zone: 'north_wilderness',
    isProp: true,
    propType: 'road_sign',
    actionType: 'signpost',
    dialogue: [
      "🏜️ ECHO CANYON (NORTH WILDERNESS):",
      "• ⬆️ NORTH: Ascend direct highway to The Brass Citadel (Brass).",
      "• ⬇️ SOUTH: Descent direct highway to The Central City (Grand Symphony Hub).",
      "• ⬅️ WEST PASS: Direct mountain highway to Lyre Valley (West Wilderness & Cavatina)!",
      "• ➡️ EAST PASS: Direct canyon highway to Breeze Glade (East Wilderness & Woodwinds)!"
    ]
  },
  {
    id: 'npc_sign_north_crossroads',
    name: 'Wilderness Ring Crossroads Guidepost',
    title: 'Read Crossroads Sign [SPACE]',
    x: 840,
    y: 440,
    zone: 'north_wilderness',
    isProp: true,
    propType: 'road_sign',
    actionType: 'signpost',
    dialogue: [
      "🧭 ECHO CANYON CROSSROADS (WILDERNESS RING HIGHWAY):",
      "• ⬅️ WEST PASS: Direct highway to Lyre Valley (West Wilderness).",
      "• ➡️ EAST PASS: Direct highway to Breeze Glade (East Wilderness).",
      "• ⬆️ NORTH HIGHWAY: To The Brass Citadel.",
      "• ⬇️ SOUTH HIGHWAY: To The Central City."
    ]
  },
  {
    id: 'npc_sam_world',
    name: 'Sam',
    title: 'Trombone Hotshot (Age 16) [SPACE to Jam]',
    x: 900,
    y: 400,
    zone: 'north_wilderness',
    wander: true,
    anchorX: 900,
    anchorY: 400,
    musicianData: RECRUITABLE_MUSICIANS[8],
    actionType: 'audition_battle',
    dialogue: RECRUITABLE_MUSICIANS[8].dialogue || []
  },
  {
    id: 'npc_chest_north',
    name: 'Canyon Echo Chamber Chest',
    title: 'Open Hidden Treasure Chest [SPACE]',
    x: 300,
    y: 300,
    zone: 'north_wilderness',
    isProp: true,
    propType: 'treasure_chest',
    actionType: 'treasure_chest',
    treasureReward: { notes: 250, sparks: 15 },
    dialogue: ["You opened the Canyon Echo Chamber Chest! Claimed 250 Notes (♪) and 15 Inspiration Sparks (✨)!"]
  },
  {
    id: 'npc_score_vivaldi_spring',
    name: 'Gilded Steppe Stand',
    title: 'Inspect Ancient Manuscript [SPACE]',
    x: 400,
    y: 550,
    zone: 'north_wilderness',
    isProp: true,
    propType: 'golden_music_stand',
    actionType: 'sheet_music_stand',
    sheetMusicReward: 'piece_vivaldi_spring',
    dialogue: ["You recovered the energetic score of 'Spring Allegro for Brass Quartet'!"]
  },
  {
    id: 'npc_wild_terrier_wilds',
    name: 'Wild Steppe Terrier',
    title: 'Wild Harmonipet (Pocket Trumpet) [SPACE to Harmonize]',
    x: 250,
    y: 450,
    zone: 'north_wilderness',
    wander: true,
    anchorX: 250,
    anchorY: 450,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_terrier_wilds2',
      name: 'Bugle',
      species: 'Fanfare Terrier',
      sprite: 'terrier',
      section: 'brass',
      instrumentName: 'Pocket Trumpet',
      instrumentId: 'pocket_trumpet',
      leitmotifSound: 'trumpet_blare',
      color: '#eab308'
    },
    dialogue: ["A swift Steppe Terrier barks out staccato bugle fanfares among the red boulders! Match its pitch!"]
  },
  {
    id: 'npc_vista_resonance_peak',
    name: 'Resonance Peak Vista',
    title: 'Attune to Acoustic Vista [SPACE]',
    x: 1450,
    y: 350,
    zone: 'north_wilderness',
    isProp: true,
    propType: 'vista_monolith',
    actionType: 'inspiration_vista',
    vistaId: 'vista_resonance_peak',
    dialogue: ["Standing atop Resonance Peak, every sound bounces back with pristine clarity, honing your technique!"]
  },
  {
    id: 'npc_secret_beethoven',
    name: 'Ludwig van Beethoven',
    title: 'The Deafening Titan [SPACE]',
    x: 1560,
    y: 320,
    zone: 'north_wilderness',
    isSecret: true,
    actionType: 'celebrity_secret',
    celebrityMotif: 'beethoven',
    celebrityReward: { notes: 400, sparks: 30 },
    musicianData: {
      id: 'beethoven',
      name: 'Ludwig van Beethoven',
      title: 'The Deafening Titan',
      avatar: '⚡',
      paletteColor: '#475569',
      instrumentId: 'french_horn',
      instrumentName: 'Great Brass Ear Trumpet of Fate',
      section: 'brass',
      pet: { id: 'pet_beethoven', name: 'Titan', species: 'Fanfare Terrier', sprite: 'terrier', section: 'brass', instrumentName: 'Great Brass Ear Trumpet of Fate', leitmotifSound: 'trumpet_blare', color: '#475569' },
      stats: { technique: 96, toneQuality: 99, tempoStability: 98, sightReading: 95 },
      level: 20,
      xp: 5000
    },
    dialogue: [
      "WHAT?! SPEAK LOUDER! PROJECT DIRECTLY INTO MY EAR TRUMPET! 📢",
      "I AM CURRENTLY ENGAGED IN A FORTISSIMO SCREAMING CONTEST WITH THAT THUNDERSTORM CLOUD! DA-DA-DA-DUM! FATE KNOCKS AT THE DOOR!",
      "Never let mere mortal quietude hold back your symphony! If the world does not hear you, play so fiercely that the mountains tremble!"
    ],
    dialogueSets: [
      [
        "WHAT?! SPEAK LOUDER! PROJECT DIRECTLY INTO MY EAR TRUMPET! 📢",
        "I AM CURRENTLY ENGAGED IN A FORTISSIMO SCREAMING CONTEST WITH THAT THUNDERSTORM CLOUD! DA-DA-DA-DUM! FATE KNOCKS AT THE DOOR!",
        "Never let mere mortal quietude hold back your symphony! If the world does not hear you, play so fiercely that the mountains tremble!"
      ],
      [
        "I COUNT EXACTLY SIXTY COFFEE BEANS PER CUP! NOT FIFTY-NINE, NOT SIXTY-ONE! PRECISION IS THE ROOT OF GENIUS!",
        "When I write a crescendo, I want the floorboards to crack! Give your music titanic conviction!"
      ],
      [
        "THEY TOLD ME A DEAF MAN COULD NOT CONDUCT AN ORCHESTRA! HA! I HEAR THE MUSIC IN MY BONES AND BLOOD! PLAY FROM YOUR HEART!"
      ]
    ]
  },
  {
    id: 'npc_wild_badger',
    name: 'Wild Fanfare Badger',
    title: 'Wild Harmonipet (French Horn) [SPACE to Harmonize]',
    x: 1350,
    y: 550,
    zone: 'north_wilderness',
    wander: true,
    anchorX: 1350,
    anchorY: 550,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_badger_wild',
      name: 'Diesel',
      species: 'Fanfare Badger',
      sprite: 'badger',
      section: 'brass',
      instrumentName: 'French Horn',
      instrumentId: 'french_horn',
      leitmotifSound: 'horn_call',
      color: '#f97316'
    },
    dialogue: ["A stout Fanfare Badger puffs its chest and echoes deep horn calls against the canyon walls! Match its call!"]
  },
  {
    id: 'npc_wild_cannon_beetle_north',
    name: 'Wild Bombardier Beetle',
    title: 'Wild Harmonipet (Cannon) [SPACE to Harmonize]',
    x: 650,
    y: 350,
    zone: 'north_wilderness',
    wander: true,
    anchorX: 650,
    anchorY: 350,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_cannon_beetle_wild',
      name: 'Boomer',
      species: 'Bombardier Beetle',
      sprite: '🪲',
      section: 'percussion',
      instrumentName: 'Tchaikovsky Cannon',
      instrumentId: 'cannon',
      leitmotifSound: 'cannon_boom',
      color: '#84cc16'
    },
    dialogue: ["A heavily armored Bombardier Beetle primes its resonance chamber, detonating massive sub-bass artillery cannon booms across the canyon! Match its thunderous pulse!"]
  },
  {
    id: 'npc_puzzle_gate_north',
    name: 'Circle of Fifths Acoustic Gate (North Pass)',
    title: '🌀 Circle of Fifths Acoustic Monolith [SPACE to Modulate]',
    x: 600,
    y: 250,
    zone: 'north_wilderness',
    isProp: true,
    propType: 'circle_of_fifths_monolith',
    actionType: 'circle_of_fifths_puzzle',
    dialogue: ["An ancient acoustic gate carved with key signatures. Modulating through the Circle of Fifths (C -> G -> D -> A -> E) will open the mountain passage."]
  },

  // ==================== PERCUSSION PEAKS (SETTLED TAIKO GHATS) ====================
  {
    id: 'npc_theory_peaks',
    name: 'Mountain Metronome Lectern',
    title: 'Rhythm Theory Exam (Polyrhythms) [SPACE]',
    x: 460,
    y: 540,
    zone: 'percussion_peaks',
    isProp: true,
    propType: 'lectern',
    actionType: 'theory_bench',
    theoryType: 'rhythm_meter_1',
    dialogue: ["Master irregular meters (5/4, 7/8) and syncopated cross-rhythms to lock into the ultimate rhythmic groove!"]
  },
  {
    id: 'npc_dean_peaks',
    name: 'Master Goro',
    title: 'Mountbeat Academy Master [SPACE to Talk]',
    x: 370,
    y: 540,
    zone: 'percussion_peaks',
    isNonMusician: true,
    musicianData: {
      id: 'dean_goro',
      name: 'Master Goro',
      title: 'Taiko Grandmaster',
      avatar: '🥁',
      paletteColor: '#8b5cf6',
      instrumentId: 'timpani',
      instrumentName: 'Gong Mallet',
      section: 'percussion',
      pet: { id: 'pet_goro', name: 'Thunder', species: 'Tempo Tortoise', sprite: 'tortoise', section: 'percussion', instrumentName: 'Gong Mallet', leitmotifSound: 'drum_beat', color: '#8b5cf6' },
      isNonMusician: true,
      stats: { technique: 70, toneQuality: 65, tempoStability: 80, sightReading: 45 },
      level: 10,
      xp: 1000
    },
    actionType: 'talk',
    dialogue: [
      "Feel the mountain's pulse beneath your soles! In Percussion Peaks, timing is absolute.",
      "Take our Rhythm & Meter exam, or visit Master Tetsu to shape hardwood drumsticks and bronze mallets."
    ],
    dialogueSets: [
      [
        "Feel the mountain's pulse beneath your soles! In Percussion Peaks, timing is absolute.",
        "Take our Rhythm & Meter exam, or visit Master Tetsu to shape hardwood drumsticks and bronze mallets."
      ],
      [
        "A true percussionist does not merely play rhythms—they become the metronomic heart of the ensemble.",
        "When your tempo stability is unwavering, the melodic instruments can soar with complete freedom!"
      ],
      [
        "Young Rita and Ren have raw volcanic power in their beats. Train them well, maestro, and your crescendo will shake the heavens!"
      ]
    ]
  },
  {
    id: 'npc_luthier_peaks',
    name: 'The Basalt Taiko Forge',
    title: 'Percussion Workshop & Foundry [SPACE to Forge]',
    x: 730,
    y: 540,
    zone: 'percussion_peaks',
    isNonMusician: true,
    musicianData: {
      id: 'luthier_tetsu',
      name: 'Master Tetsu',
      title: 'Master Mallet Smith',
      avatar: '🔨',
      paletteColor: '#6b21a8',
      instrumentId: 'marimba',
      instrumentName: 'Forging Sledge',
      section: 'percussion',
      pet: { id: 'pet_tetsu', name: 'Forge', species: 'Rhythm Armadillo', sprite: 'armadillo', section: 'percussion', instrumentName: 'Forging Sledge', leitmotifSound: 'drum_snap', color: '#6b21a8' },
      isNonMusician: true,
      stats: { technique: 65, toneQuality: 60, tempoStability: 75, sightReading: 40 },
      level: 8,
      xp: 800
    },
    actionType: 'luthier_shop',
    dialogue: ["Stoke the coals! Bring Notes and Sparks to forge resonant timpani heads, hardwood taiko sticks, and tuned marimba bars!"],
    dialogueSets: [
      ["Stoke the coals! Bring Notes and Sparks to forge resonant timpani heads, hardwood taiko sticks, and tuned marimba bars!"],
      ["Dense volcanic basalt produces an acoustic 'thud' that cuts through the thickest orchestral textures. Unmatched punch!"],
      ["Want to never drop a combo during rhythm shredding? The 'Hardwood Balancer Mallet' gives you maximum tempo resilience!"]
    ]
  },
  {
    id: 'npc_vanity_peaks',
    name: 'Basalt Styling Vanity',
    title: 'Customize Avatar & Instrument [SPACE]',
    x: 1320,
    y: 530,
    zone: 'percussion_peaks',
    isProp: true,
    propType: 'vanity',
    actionType: 'customization_mirror',
    dialogue: ["Welcome to the Basalt Styling Vanity! Equip taiko headbands, punk vests, and midnight obsidian instrument finishes."]
  },
  {
    id: 'npc_music_stand_peaks',
    name: 'Basalt Music Stand',
    title: 'Study Sheet Music [SPACE]',
    x: 1440,
    y: 530,
    zone: 'percussion_peaks',
    isProp: true,
    propType: 'music_stand',
    actionType: 'sheet_music_stand',
    sheetMusicReward: 'piece_taiko_thunder',
    dialogue: ["You discovered the sheet music for 'Mountbeat Thunderclap' (Chamber piece for Full Percussion & Ensemble)!"]
  },
  {
    id: 'npc_mama_beat',
    name: 'Mama Beat',
    title: '🍖 Mama Beat (The Rolling Boulder Saloon) [SPACE]',
    x: 480,
    y: 1200,
    zone: 'percussion_peaks',
    isNonMusician: true,
    musicianData: {
      id: 'mama_beat',
      name: 'Mama Beat',
      title: 'Saloon Host & Drummer',
      avatar: '🍖',
      paletteColor: '#4c1d95',
      instrumentId: 'snare_kit',
      instrumentName: 'Saloon Ladle',
      section: 'percussion',
      pet: { id: 'pet_mama_beat', name: 'Skillet', species: 'Beat Raccoon', sprite: 'raccoon', section: 'percussion', instrumentName: 'Saloon Ladle', leitmotifSound: 'drum_snap', color: '#4c1d95' },
      isNonMusician: true,
      stats: { technique: 55, toneQuality: 50, tempoStability: 70, sightReading: 40 },
      level: 6,
      xp: 500
    },
    actionType: 'talk',
    dialogue: [
      "Eat your hearty volcanic beef stew, kiddo! You can't hold an unflinching 160 BPM pocket on an empty stomach!",
      "Rita and Ronin have been trading drum solos out on the mountain stage. The whole saloon floor is vibrating!"
    ],
    dialogueSets: [
      [
        "Eat your hearty volcanic beef stew, kiddo! You can't hold an unflinching 160 BPM pocket on an empty stomach!",
        "Rita and Ronin have been trading drum solos out on the mountain stage. The whole saloon floor is vibrating!"
      ],
      [
        "Down in Rumble Gorge, you'll find the Thunder Gorge Vista. Attuning there permanently boosts your tempo stability!",
        "Just keep an ear out for wild rhythm armadillos—they love rolling blast beats down the canyon slopes!"
      ],
      [
        "Mama Aria from Cavatina Village sent a bird with a message bragging about your violin intonation. I wrote back: 'That's nice, honey, but can your kid play in 7/8 time?!' Haha!"
      ]
    ]
  },
  {
    id: 'npc_door_peaks_tavern',
    name: 'Rolling Boulder Saloon Door',
    title: '🚪 Enter Rolling Boulder Saloon [SPACE]',
    x: 540,
    y: 1180,
    zone: 'percussion_peaks',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'talk',
    dialogue: ["You shove open the thick volcanic granite doors of The Rolling Boulder Saloon. Thunderous taiko pulses and savory aromas welcome you!"]
  },
  {
    id: 'npc_door_peaks_forge',
    name: 'Basalt Taiko Forge Door',
    title: '🚪 Enter Basalt Taiko Forge [SPACE]',
    x: 730,
    y: 500,
    zone: 'percussion_peaks',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'luthier_shop',
    dialogue: ["You step into the smoky Basalt Forge. Steam vents hiss as tuned metal marimba keys are carved from volcanic ores."]
  },
  {
    id: 'npc_door_peaks_academy',
    name: 'Mountbeat Academy Door',
    title: '🚪 Enter Mountbeat Rhythm Academy [SPACE]',
    x: 380,
    y: 500,
    zone: 'percussion_peaks',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'theory_bench',
    theoryType: 'rhythm_meter_1',
    dialogue: ["You enter the cavernous training dojo of Mountbeat Academy. Giant wooden metronomes swing in flawless synchronization."]
  },
  {
    id: 'npc_door_peaks_library',
    name: 'Stone Vaults Door',
    title: '🚪 Enter Polyrhythm Stone Vaults [SPACE]',
    x: 1370,
    y: 500,
    zone: 'percussion_peaks',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'talk',
    dialogue: ["You explore the Stone Vaults. Ancient slate tablets record complex polyrhythmic cycles dating back centuries."]
  },
  {
    id: 'npc_door_peaks_townhall',
    name: 'Mountbeat Belltower Door',
    title: '🚪 Enter Mountbeat Belltower & Ghat Council [SPACE]',
    x: 1400,
    y: 1180,
    zone: 'percussion_peaks',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'talk',
    dialogue: ["You enter the Great Belltower. The massive bronze bells above chime the changing tempo shifts of the realm."]
  },
  {
    id: 'npc_signpost_peaks',
    name: 'Peaks Directional Signpost',
    title: 'Read Map Guide [SPACE]',
    x: 1000,
    y: 830,
    zone: 'percussion_peaks',
    isProp: true,
    propType: 'signpost',
    actionType: 'signpost',
    dialogue: [
      "🗺️ PERCUSSION PEAKS (SOUTHERN TAIKO GHATS):",
      "• ⬆️ NORTH SUMMIT: Direct highway into Rumble Gorge toward Central City.",
      "• 🍖 ROLLING BOULDER SALOON: Hearty stew and rhythm jam sessions in southwest plaza.",
      "• 🔨 TAIKO FORGE: Master Tetsu crafts mallet and drum upgrades in northwest quarter.",
      "• 🥁 RHYTHM ACADEMY: Polyrhythm and meter theory exams in northwest quarter."
    ]
  },
  {
    id: 'npc_rita_world',
    name: 'Rita',
    title: 'Skate-Punk Drummer (Age 16) [SPACE to Jam]',
    x: 1000,
    y: 1050,
    zone: 'percussion_peaks',
    wander: true,
    anchorX: 1000,
    anchorY: 1050,
    musicianData: RECRUITABLE_MUSICIANS[3],
    actionType: 'audition_battle',
    dialogue: RECRUITABLE_MUSICIANS[3].dialogue || []
  },
  {
    id: 'npc_ronin_peaks',
    name: 'Chieftain Ronin',
    title: 'Street Percussion Leader (Age 18) [SPACE to Compete]',
    x: 1500,
    y: 600,
    zone: 'percussion_peaks',
    wander: true,
    anchorX: 1500,
    anchorY: 600,
    actionType: 'competition_stage',
    rivalId: 'rival_thunder_chamber',
    dialogue: ["Yo! I'm Ronin. We run the Mountbeat street drum crew. In Percussion Peaks, timing isn't a suggestion—it's law. Let's see your pulse!"]
  },
  {
    id: 'npc_wild_tortoise',
    name: 'Wild Tempo Tortoise',
    title: 'Wild Harmonipet (Timpani) [SPACE to Harmonize]',
    x: 1200,
    y: 800,
    zone: 'percussion_peaks',
    wander: true,
    anchorX: 1200,
    anchorY: 800,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_tortoise_wild',
      name: 'Meter',
      species: 'Tempo Tortoise',
      sprite: 'tortoise',
      section: 'percussion',
      instrumentName: 'Timpani',
      instrumentId: 'timpani',
      leitmotifSound: 'drum_beat',
      color: '#8b5cf6'
    },
    dialogue: ["A massive Tempo Tortoise taps its resonant shell like a grand orchestral timpani with metronomic precision! Lock into its cadence!"]
  },
  {
    id: 'npc_wild_raccoon',
    name: 'Wild Beat Raccoon',
    title: 'Wild Harmonipet (Snare Kit) [SPACE to Harmonize]',
    x: 1600,
    y: 1200,
    zone: 'percussion_peaks',
    wander: true,
    anchorX: 1600,
    anchorY: 1200,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_raccoon_wild',
      name: 'Groove',
      species: 'Beat Raccoon',
      sprite: 'raccoon',
      section: 'percussion',
      instrumentName: 'Custom Snare',
      instrumentId: 'snare_kit',
      leitmotifSound: 'drum_snap',
      color: '#8b5cf6'
    },
    dialogue: ["A clever Beat Raccoon drums with rapid paw-taps on hollow basalt stones! Lock into its groove!"]
  },
  {
    id: 'npc_vista_monolith_peak',
    name: 'Monolith Peak Vista',
    title: 'Attune to Acoustic Vista [SPACE]',
    x: 750,
    y: 1250,
    zone: 'percussion_peaks',
    isProp: true,
    propType: 'vista_monolith',
    actionType: 'inspiration_vista',
    vistaId: 'vista_monolith_peak',
    dialogue: ["Standing before the Monolith Peak, rhythmic echoes steady your internal clock!"]
  },
  {
    id: 'npc_vista_thunder_gorge',
    name: 'Thunder Gorge Vista',
    title: 'Attune to Acoustic Vista [SPACE]',
    x: 1650,
    y: 650,
    zone: 'percussion_peaks',
    isProp: true,
    propType: 'vista_monolith',
    actionType: 'inspiration_vista',
    vistaId: 'vista_thunder_gorge',
    dialogue: ["The tectonic bass tremors awaken your rhythmic drive and tempo stability!"]
  },
  // Parent Spectators (Percussion)
  {
    id: 'npc_parent_rita',
    name: "Mama Kroll (Rita's Mom)",
    title: 'Exasperated Mother [SPACE to Talk]',
    x: 950,
    y: 1100,
    zone: 'percussion_peaks',
    wander: true,
    anchorX: 950,
    anchorY: 1100,
    actionType: 'talk',
    isNonMusician: true,
    dialogue: [
      "Rita tapped drumbeats on her cereal bowl, the bathroom sink, and my dining table for ten years straight.",
      "Buying her that custom snare kit wasn't a gift—it was purely self-defense. At least now the pots and pans stay in one piece."
    ],
    dialogueSets: [
      [
        "Rita tapped drumbeats on her cereal bowl, the bathroom sink, and my dining table for ten years straight.",
        "Buying her that custom snare kit wasn't a gift—it was purely self-defense. At least now the pots and pans stay in one piece."
      ],
      [
        "Yesterday Rita told me she wants to play a 32nd-note drum roll during her wedding march someday.",
        "I told her as long as she cleans her room first, she can drum all the way down the aisle."
      ],
      [
        "If Rita is traveling with your ensemble to the capital, make sure she packs spare drumsticks. She breaks about four pairs a week!"
      ]
    ]
  },
  {
    id: 'npc_spectator_peaks',
    name: 'Grandpa Arthur',
    title: 'Rhythm Traditionalist [SPACE to Talk]',
    x: 750,
    y: 1150,
    zone: 'percussion_peaks',
    wander: true,
    anchorX: 750,
    anchorY: 1150,
    actionType: 'talk',
    isNonMusician: true,
    dialogue: [
      "Back in my day, we didn't have all these fancy polyrhythms, quintuplets, and 7/8 time signatures.",
      "We had ONE beat! Boom, boom, boom! And if you didn't like it, you walked uphill both ways in the snow!"
    ],
    dialogueSets: [
      [
        "Back in my day, we didn't have all these fancy polyrhythms, quintuplets, and 7/8 time signatures.",
        "We had ONE beat! Boom, boom, boom! And if you didn't like it, you walked uphill both ways in the snow!"
      ],
      [
        "These youngsters with their double-bass pedals and metric modulations... in my day, we hit a log with a mammoth bone and called it a symphony!",
        "And we loved it!"
      ],
      [
        "You've got good timing, kid. Don't let all those high-pitched violins rush your tempo. Hold the line!"
      ]
    ]
  },
  {
    id: 'npc_miner_percussion',
    name: 'Basalt Miner Dave',
    title: 'Quarry Supervisor [SPACE to Talk]',
    x: 1100,
    y: 920,
    zone: 'percussion_peaks',
    wander: true,
    anchorX: 1100,
    anchorY: 920,
    actionType: 'talk',
    isNonMusician: true,
    dialogue: [
      "The kids think they're playing cool street taiko. I think they're accidentally triggering miniature rockslides on ridge four.",
      "I had to issue hardhats to the mountain goats."
    ],
    dialogueSets: [
      [
        "The kids think they're playing cool street taiko. I think they're accidentally triggering miniature rockslides on ridge four.",
        "I had to issue hardhats to the mountain goats."
      ],
      [
        "When we blast the quarry with acoustic dynamite, the sound reverberates in pure minor thirds across the caldera.",
        "Even the geology around here is musical!"
      ],
      [
        "Be careful crossing into Rumble Gorge. The magma vents pop in syncopated triplets. Watch your step!"
      ]
    ]
  },

  // ==================== SOUTH WILDERNESS (RUMBLE GORGE & VOLCANIC CAVERNS) ====================
  {
    id: 'npc_sign_south_wilds',
    name: 'Rumble Gorge Trail Marker',
    title: 'Read Guidepost [SPACE]',
    x: 950,
    y: 620,
    zone: 'south_wilderness',
    isProp: true,
    propType: 'road_sign',
    actionType: 'signpost',
    dialogue: [
      "🌋 RUMBLE GORGE (SOUTH WILDERNESS):",
      "• ⬇️ SOUTH: Direct highway descent into Percussion Peaks (Percussion).",
      "• ⬆️ NORTH: Direct highway ascent to The Central City (Grand Symphony Hub).",
      "• ⬅️ WEST PASS: Direct basalt highway to Lyre Valley (West Wilderness & Cavatina)!",
      "• ➡️ EAST PASS: Direct caldera highway to Breeze Glade (East Wilderness & Woodwinds)!"
    ]
  },
  {
    id: 'npc_sign_south_crossroads',
    name: 'Wilderness Ring Crossroads Guidepost',
    title: 'Read Crossroads Sign [SPACE]',
    x: 840,
    y: 440,
    zone: 'south_wilderness',
    isProp: true,
    propType: 'road_sign',
    actionType: 'signpost',
    dialogue: [
      "🧭 RUMBLE GORGE CROSSROADS (WILDERNESS RING HIGHWAY):",
      "• ⬅️ WEST PASS: Direct highway to Lyre Valley (West Wilderness).",
      "• ➡️ EAST PASS: Direct highway to Breeze Glade (East Wilderness).",
      "• ⬇️ SOUTH HIGHWAY: To Percussion Peaks.",
      "• ⬆️ NORTH HIGHWAY: To The Central City."
    ]
  },
  {
    id: 'npc_ren_world',
    name: 'Ren',
    title: 'Taiko Dynamo Kid (Age 12) [SPACE to Jam]',
    x: 900,
    y: 400,
    zone: 'south_wilderness',
    wander: true,
    anchorX: 900,
    anchorY: 400,
    musicianData: RECRUITABLE_MUSICIANS[9],
    actionType: 'audition_battle',
    dialogue: RECRUITABLE_MUSICIANS[9].dialogue || []
  },
  {
    id: 'npc_chest_south',
    name: 'Obsidian Cavern Secret Chest',
    title: 'Open Hidden Treasure Chest [SPACE]',
    x: 1450,
    y: 350,
    zone: 'south_wilderness',
    isProp: true,
    propType: 'treasure_chest',
    actionType: 'treasure_chest',
    treasureReward: { notes: 250, sparks: 15 },
    dialogue: ["You uncovered the Obsidian Cavern Secret Chest! Gained 250 Notes (♪) and 15 Inspiration Sparks (✨)!"]
  },
  {
    id: 'npc_score_tchaikovsky_dance',
    name: 'Basalt Pedestal Stand',
    title: 'Inspect Ancient Manuscript [SPACE]',
    x: 1300,
    y: 550,
    zone: 'south_wilderness',
    isProp: true,
    propType: 'ancient_stone_stand',
    actionType: 'sheet_music_stand',
    sheetMusicReward: 'piece_tchaikovsky_dance',
    dialogue: ["You discovered the thrilling score 'Dance of the Tumblers for Percussion Chamber'!"]
  },
  {
    id: 'npc_wild_tortoise_wilds',
    name: 'Wild Caldera Tortoise',
    title: 'Wild Harmonipet (Timpani) [SPACE to Harmonize]',
    x: 1550,
    y: 500,
    zone: 'south_wilderness',
    wander: true,
    anchorX: 1550,
    anchorY: 500,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_tortoise_wilds2',
      name: 'Basalt',
      species: 'Tempo Tortoise',
      sprite: 'tortoise',
      section: 'percussion',
      instrumentName: 'Timpani',
      instrumentId: 'timpani',
      leitmotifSound: 'drum_beat',
      color: '#8b5cf6'
    },
    dialogue: ["A wild Caldera Tortoise thumps its heavy bronze shell in primal 3/4 waltz time! Harmonize with its pulse!"]
  },
  {
    id: 'npc_vista_echoing_caldera',
    name: 'Echoing Caldera Vista',
    title: 'Attune to Acoustic Vista [SPACE]',
    x: 350,
    y: 450,
    zone: 'south_wilderness',
    isProp: true,
    propType: 'vista_monolith',
    actionType: 'inspiration_vista',
    vistaId: 'vista_echoing_caldera',
    dialogue: ["The steady subterranean heartbeat of the caldera grounds your internal metronome!"]
  },
  {
    id: 'npc_secret_paganini',
    name: 'Niccolò Paganini',
    title: 'The Fiendish Virtuoso [SPACE]',
    x: 180,
    y: 220,
    zone: 'south_wilderness',
    isSecret: true,
    actionType: 'celebrity_secret',
    celebrityMotif: 'paganini',
    celebrityReward: { notes: 450, sparks: 35 },
    musicianData: {
      id: 'paganini',
      name: 'Niccolò Paganini',
      title: 'The Fiendish Virtuoso',
      avatar: '🎻',
      paletteColor: '#581c87',
      instrumentId: 'violin',
      instrumentName: 'Il Cannone Guarnieri (Smoky Demonic Violin)',
      section: 'strings',
      pet: { id: 'pet_paganini', name: 'Cannone', species: 'Allegro Swan', sprite: 'swan', section: 'strings', instrumentName: 'Il Cannone Guarnieri', leitmotifSound: 'violin_pure', color: '#581c87' },
      stats: { technique: 100, toneQuality: 96, tempoStability: 99, sightReading: 97 },
      level: 20,
      xp: 5000
    },
    dialogue: [
      "Shhh... Lower your voice! The superstitious villagers in the gorge think my Caprice No. 24 is fueled by brimstone and dark pacts!",
      "I did NOT sell my soul to any demon for violin shredding! It's just extreme left-hand pizzicato, ricochet bowing, and fifteen hours of daily scales!",
      "Though... having spooky volcanic steam billowing behind you does add phenomenal stage presence! Take these fiery notes and practice your arpeggios!"
    ],
    dialogueSets: [
      [
        "Shhh... Lower your voice! The superstitious villagers in the gorge think my Caprice No. 24 is fueled by brimstone and dark pacts!",
        "I did NOT sell my soul to any demon for violin shredding! It's just extreme left-hand pizzicato, ricochet bowing, and fifteen hours of daily scales!",
        "Though... having spooky volcanic steam billowing behind you does add phenomenal stage presence! Take these fiery notes and practice your arpeggios!"
      ],
      [
        "One time during a concert in Genoa, three of my violin strings snapped one after another! I finished the entire concerto on the G string alone!",
        "Resourcefulness and calm under pressure—that is the mark of a true stage master."
      ],
      [
        "Warm up your finger joints before attempting rapid artificial harmonics. Tendonitis is the only real demon a violinist faces!"
      ]
    ]
  },
  {
    id: 'npc_wild_armadillo',
    name: 'Wild Rhythm Armadillo',
    title: 'Wild Harmonipet (Snare Kit) [SPACE to Harmonize]',
    x: 450,
    y: 300,
    zone: 'south_wilderness',
    wander: true,
    anchorX: 450,
    anchorY: 300,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_armadillo_wild',
      name: 'Tank',
      species: 'Rhythm Armadillo',
      sprite: 'armadillo',
      section: 'percussion',
      instrumentName: 'Snare Kit',
      instrumentId: 'snare_kit',
      leitmotifSound: 'drum_snap',
      color: '#a855f7'
    },
    dialogue: ["A spirited Rhythm Armadillo rolls along the basalt rocks, rattling its armor in syncopated snare bursts! Match its rhythm!"]
  },
  {
    id: 'npc_wild_typewriter_bird_south',
    name: 'Wild Typist Woodpecker',
    title: 'Wild Harmonipet (Typewriter) [SPACE to Harmonize]',
    x: 650,
    y: 450,
    zone: 'south_wilderness',
    wander: true,
    anchorX: 650,
    anchorY: 450,
    actionType: 'wild_harmonipet',
    wildPetData: {
      id: 'pet_typewriter_bird_wild',
      name: 'Quill',
      species: 'Typist Woodpecker',
      sprite: '🐦',
      section: 'percussion',
      instrumentName: 'Typewriter',
      instrumentId: 'typewriter',
      leitmotifSound: 'typewriter_clack',
      color: '#06b6d4'
    },
    dialogue: ["A focused Typist Woodpecker pecks rapid rhythmic mechanical clacks and silver margin bell chimes into a petrified trunk! Harmonize with its cadence!"]
  },
  {
    id: 'npc_puzzle_gate_south',
    name: 'Circle of Fifths Acoustic Gate (Rumble Pass)',
    title: '🌀 Circle of Fifths Mountain Monolith [SPACE to Modulate]',
    x: 1350,
    y: 550,
    zone: 'south_wilderness',
    isProp: true,
    propType: 'circle_of_fifths_monolith',
    actionType: 'circle_of_fifths_puzzle',
    dialogue: ["The magma-warmed stone monolith hums in harmonic fifths. Match the modulation sequence to unlock the passage!"]
  },

  // ==================== CENTRAL CITY (THE GRAND SYMPHONY HUB) ====================
  // Central Landmark Buildings & Interactive Doors
  {
    id: 'npc_door_grand_symphony',
    name: 'The Grand Symphony Hall Entrance',
    title: '🏛️ Enter The Grand Symphony Hall [SPACE to Compete]',
    x: 1780,
    y: 600,
    zone: 'grand_hall',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'competition_stage',
    rivalId: 'rival_grand_orchestra',
    dialogue: ["You step into the majestic auditorium of The Grand Symphony Hall in the Northeast Quarter. Velvet seats and gilded acoustics surround the ultimate competition stage!"]
  },
  {
    id: 'npc_door_grand_conservatory',
    name: 'High Conservatory Entrance',
    title: '🎼 Enter High Conservatory of Maestros [SPACE to Study]',
    x: 500,
    y: 580,
    zone: 'grand_hall',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'theory_bench',
    theoryType: 'orchestral_acoustics',
    dialogue: ["You enter the vaulted halls of the High Conservatory of Maestros in the Northwest Quarter. Master scholars dissect the physics of acoustic resonance."]
  },
  {
    id: 'npc_door_grand_archives',
    name: 'Royal Archives Entrance',
    title: '📖 Enter Royal Archives & Grand Library [SPACE]',
    x: 1590,
    y: 1320,
    zone: 'grand_hall',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'sheet_music_stand',
    sheetMusicReward: 'piece_ode_to_harmony',
    dialogue: ["You enter the Royal Archives in the Southeast Quarter. Shelves towering four stories high hold every score ever composed across Harmonia! Discovered the 'Ode to Harmonic Resonance'!"]
  },
  {
    id: 'npc_door_grand_forum',
    name: "The Maestro's Forum Entrance",
    title: "🍷 Enter The Maestro's Forum & Taphouse [SPACE]",
    x: 500,
    y: 1320,
    zone: 'grand_hall',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'talk',
    dialogue: ["You enter the lively Maestro's Forum in the Southwest Quarter. Conductors, concertmasters, and soloists from all four cardinal realms raise sparkling glasses in celebration!"]
  },
  {
    id: 'npc_door_grand_council',
    name: 'Solstice Council Entrance',
    title: '⏰ Enter Solstice Clocktower & Council Hall [SPACE]',
    x: 2070,
    y: 1320,
    zone: 'grand_hall',
    isProp: true,
    propType: 'door_trigger',
    actionType: 'talk',
    dialogue: ["You enter the Solstice Council Hall in the Southeast Quarter beneath the astronomical clock. The grand tournament calendar and realm-wide quests are overseen here."]
  },
  // Central City Characters
  {
    id: 'npc_maestro_vane',
    name: 'Maestro Vane',
    title: '🍷 Maestro Vane (Central Taphouse Host) [SPACE]',
    x: 500,
    y: 1260,
    zone: 'grand_hall',
    isNonMusician: true,
    musicianData: {
      id: 'maestro_vane',
      name: 'Maestro Vane',
      title: 'Grand Sommelier & Cellist',
      avatar: '🍷',
      paletteColor: '#991b1b',
      instrumentId: 'cello',
      instrumentName: 'Sommelier Key',
      section: 'strings',
      pet: { id: 'pet_vane', name: 'Vintage', species: 'Cantabile Swan', sprite: 'swan', section: 'strings', instrumentName: 'Sommelier Key', leitmotifSound: 'violin_pure', color: '#991b1b' },
      isNonMusician: true,
      stats: { technique: 75, toneQuality: 80, tempoStability: 75, sightReading: 70 },
      level: 10,
      xp: 1200
    },
    actionType: 'talk',
    dialogue: [
      "Welcome to The Central City, young maestro! I am Vane. Here at the Forum in the Southwest Quarter, masters of Strings, Woodwinds, Brass, and Percussion share table and tune.",
      "The Solstice Symphony Tournament in the Grand Hall is the crowning glory of all Harmonia. Assemble an 8-piece chamber ensemble to claim your title!"
    ],
    dialogueSets: [
      [
        "Welcome to The Central City, young maestro! I am Vane. Here at the Forum in the Southwest Quarter, masters of Strings, Woodwinds, Brass, and Percussion share table and tune.",
        "The Solstice Symphony Tournament in the Grand Hall is the crowning glory of all Harmonia. Assemble an 8-piece chamber ensemble to claim your title!"
      ],
      [
        "A proper vintage cider needs time to ferment, just as a great orchestral movement needs patience in its development section.",
        "Take a rest, sip some spiced pear nectar, and listen to the polyphonic conversations around the room."
      ],
      [
        "Did you know the four cardinal villages were once isolated until the ring road was constructed?",
        "Now travelers can journey directly between the wild frontiers without needing to pass through our central gates!"
      ]
    ]
  },
  {
    id: 'npc_archivist_selene',
    name: 'Archivist Selene',
    title: 'Royal Musicologist [SPACE to Talk]',
    x: 1590,
    y: 1260,
    zone: 'grand_hall',
    isNonMusician: true,
    musicianData: {
      id: 'archivist_selene',
      name: 'Selene',
      title: 'Royal Musicologist',
      avatar: '📜',
      paletteColor: '#065f46',
      instrumentId: 'harp',
      instrumentName: 'Archive Scroll',
      section: 'strings',
      pet: { id: 'pet_selene', name: 'Scroll', species: 'Vivace Hare', sprite: 'hare', section: 'strings', instrumentName: 'Archive Scroll', leitmotifSound: 'guitar_strum', color: '#065f46' },
      isNonMusician: true,
      stats: { technique: 70, toneQuality: 70, tempoStability: 65, sightReading: 95 },
      level: 10,
      xp: 1200
    },
    actionType: 'talk',
    dialogue: [
      "Greetings, scholar! If you seek lost sheet music manuscripts, search the deep wilderness corridors flanking the four cardinal highways.",
      "The ancient masters hid masterpieces in the glens and canyons of Harmonia."
    ],
    dialogueSets: [
      [
        "Greetings, scholar! If you seek lost sheet music manuscripts, search the deep wilderness corridors flanking the four cardinal highways.",
        "The ancient masters hid masterpieces in the glens and canyons of Harmonia."
      ],
      [
        "I am currently transcribing a lost score by Maestro Bach. The counterpoint is so dense it feels like solving a mathematical labyrinth!",
        "Every note is a deliberate choice in the cosmic tapestry of sound."
      ],
      [
        "If your Sight-Reading is ever lacking, visit the academy lecterns in each quarter. Theoretical knowledge is the key to effortless performance!"
      ]
    ]
  },
  {
    id: 'npc_nico_world',
    name: 'Nico',
    title: 'Conservatory Arranger (Age 20) [SPACE to Jam]',
    x: 800,
    y: 1000,
    zone: 'grand_hall',
    wander: true,
    anchorX: 800,
    anchorY: 1000,
    musicianData: RECRUITABLE_MUSICIANS[10],
    actionType: 'audition_battle',
    dialogue: RECRUITABLE_MUSICIANS[10].dialogue || []
  },
  {
    id: 'npc_aurelius_grand_hall',
    name: 'Aurelius',
    title: 'Student Conductor (Age 21) [SPACE to Compete]',
    x: 1600,
    y: 1000,
    zone: 'grand_hall',
    wander: true,
    anchorX: 1600,
    anchorY: 1000,
    actionType: 'competition_stage',
    rivalId: 'rival_grand_orchestra',
    dialogue: ["Welcome to the Eternal Stage! I'm Aurelius. My youth orchestra has unified all four musical sections into one voice. Show us the breadth of your ensemble's harmony!"]
  },
  {
    id: 'npc_theory_grand_hall',
    name: 'Grand High Lectern',
    title: 'Master Theory Exam (Acoustics & Orchestration) [SPACE]',
    x: 500,
    y: 640,
    zone: 'grand_hall',
    isProp: true,
    propType: 'lectern',
    actionType: 'theory_bench',
    theoryType: 'orchestral_acoustics',
    dialogue: ["The pinnacle of theoretical studies: learn to balance timbral weight, dynamic frequencies, and polyphonic counterpoint across full symphony orchestras!"]
  },
  {
    id: 'npc_pianist_busker',
    name: 'Maestro Franz "Keys" Liszt',
    title: 'Grand Virtuoso Pianist [SPACE to Duel]',
    x: 1200,
    y: 1140,
    zone: 'grand_hall',
    actionType: 'pianist_busking_duel',
    musicianData: {
      id: 'musician_franz_liszt',
      name: 'Maestro Franz "Keys" Liszt',
      title: 'Grand Virtuoso Pianist',
      avatar: '🎹',
      paletteColor: '#fbbf24',
      instrumentId: 'glockenspiel',
      instrumentName: 'Concert Grand Piano',
      section: 'percussion',
      pet: {
        id: 'pet_franz_liszt',
        name: 'Cadenza',
        species: 'Rhapsody Nightingale',
        sprite: 'nightingale',
        section: 'percussion',
        instrumentName: 'Concert Grand Piano',
        leitmotifSound: 'glockenspiel_bell',
        color: '#fbbf24'
      },
      stats: { technique: 85, toneQuality: 85, tempoStability: 85, sightReading: 95 },
      level: 12,
      xp: 3000
    },
    dialogue: [
      "Maestro Franz 'Keys' Liszt sits boldly before a gleaming concert grand piano at the Eternal Rotunda Dais.",
      "My fingers dance across the eighty-eight keys with transcendental fury! Dare you challenge a true virtuoso in a high-tempo busking duel?"
    ],
    dialogueSets: [
      [
        "Maestro Franz 'Keys' Liszt sits boldly before a gleaming concert grand piano at the Eternal Rotunda Dais.",
        "\"My fingers dance across the eighty-eight keys with transcendental fury! Dare you challenge a true virtuoso in a high-tempo busking duel?\""
      ],
      [
        "\"To play a wrong note is insignificant; to play without passion is inexcusable!\"",
        "\"Bring your utmost expression to the keyboard, and let us see if your pulse can match my Hungarian rhapsodies!\""
      ],
      [
        "\"Ah, the acoustic resonance of this rotunda is magnificent! Every harmonic overtone rings like crystal chandeliers in an imperial ballroom.\""
      ]
    ]
  },
  {
    id: 'npc_music_stand_grand_hall',
    name: 'Celestial Music Stand',
    title: 'Study Sheet Music [SPACE]',
    x: 1280,
    y: 1140,
    zone: 'grand_hall',
    isProp: true,
    propType: 'golden_music_stand',
    actionType: 'sheet_music_stand',
    sheetMusicReward: 'piece_ode_to_harmony',
    dialogue: ["You discovered the legendary master score: 'Ode to Harmonic Resonance' (Full 8-Piece Symphony Orchestra)!"]
  },
  {
    id: 'npc_signpost_grand_hall',
    name: 'Central City Compass Sign',
    title: 'Read Central Overworld Marker [SPACE]',
    x: 1200,
    y: 1350,
    zone: 'grand_hall',
    isProp: true,
    propType: 'road_sign',
    actionType: 'signpost',
    dialogue: [
      "🏛️ THE CENTRAL CITY (GRAND SYMPHONY HUB):",
      "• ⬅️ WEST ARCH: Highway through Lyre Valley to Cavatina Village (Strings).",
      "• ➡️ EAST GATE: Highway through Breeze Glade to Woodwind Woods (Woodwinds).",
      "• ⬆️ NORTH COLONNADE: Highway through Echo Canyon to The Brass Citadel (Brass).",
      "• ⬇️ SOUTH GRAND BRIDGE: Highway through Rumble Gorge to Percussion Peaks (Percussion).",
      "• 🏛️ THE GRAND SYMPHONY HALL: Center stage for realm championship tournaments."
    ]
  },
  {
    id: 'npc_blind_conductor',
    name: 'Maestro Tiresias',
    title: 'The Blind Conductor (Timbre Clinic) [SPACE to Consult]',
    x: 750,
    y: 550,
    zone: 'grand_hall',
    wander: true,
    anchorX: 750,
    anchorY: 550,
    actionType: 'talk',
    questId: 'quest_blind_conductor',
    musicianData: {
      id: 'maestro_tiresias',
      name: 'Maestro Tiresias',
      title: 'The Blind Conductor',
      avatar: '🦯',
      paletteColor: '#6366f1',
      instrumentId: 'french_horn',
      instrumentName: 'Resonant Brass Horn',
      section: 'brass',
      pet: {
        id: 'pet_tiresias',
        name: 'Echo',
        species: 'Nocturne Bat',
        sprite: '🦇',
        section: 'brass',
        instrumentName: 'Resonant Brass Horn',
        leitmotifSound: 'horn_call',
        color: '#6366f1'
      },
      stats: { technique: 90, toneQuality: 100, tempoStability: 95, sightReading: 95 },
      level: 15,
      xp: 4000
    },
    dialogue: [
      "Maestro Tiresias raises an ivory baton, listening to the ambient air:",
      "\"Sight is a distraction to the true ear. I hear the subtle timbral clash between your woodwind formants and brass overtones.\"",
      "\"Let us align the frequencies: let the warm cello and horn ground the lower mids, while the violin and flutes soar freely in pristine acoustic harmony!\""
    ],
    dialogueSets: [
      [
        "Maestro Tiresias raises an ivory baton, listening to the ambient air:",
        "\"Sight is a distraction to the true ear. I hear the subtle timbral clash between your woodwind formants and brass overtones.\"",
        "\"Let us align the frequencies: let the warm cello and horn ground the lower mids, while the violin and flutes soar freely in pristine acoustic harmony!\""
      ],
      [
        "\"Listen to the space BETWEEN the notes. Silence is the canvas upon which music paints its colors.\"",
        "\"When your ensemble breathes together in rest measures, the subsequent chord lands with ten times the emotional weight.\""
      ],
      [
        "\"The acoustic aura of your ensemble is glowing brighter each day. Never cease listening with your heart, young maestro.\""
      ]
    ]
  },
  {
    id: 'npc_maestro_roundtable',
    name: "The Maestro's Roundtable",
    title: "🍷 The Maestro's Roundtable (Titan Jam Session) [SPACE]",
    x: 520,
    y: 1650,
    zone: 'grand_hall',
    actionType: 'talk',
    questId: 'quest_maestro_roundtable',
    dialogue: [
      "A grand banquet table laden with sparkling cider and scored parchment. Mozart, Beethoven, Bach, Paganini, and Satie raise their glasses!",
      "Mozart: \"Hahaha! What did I tell you? True harmony is alive and kicking!\"",
      "Beethoven: \"I FEEL the titanic resonance of your symphony shaking the taphouse rafters!\"",
      "Bach: \"A sublime contrapuntal architecture. Well played, young maestro.\"",
      "Paganini: \"Your virtuosic flair on the fingerboard is truly devilish!\"",
      "Satie: \"Ah, finally... let us lounge, sip pear cider, and jam in ambient serenity.\""
    ],
    dialogueSets: [
      [
        "A grand banquet table laden with sparkling cider and scored parchment. Mozart, Beethoven, Bach, Paganini, and Satie raise their glasses!",
        "Mozart: \"Hahaha! What did I tell you? True harmony is alive and kicking!\"",
        "Beethoven: \"I FEEL the titanic resonance of your symphony shaking the taphouse rafters!\"",
        "Bach: \"A sublime contrapuntal architecture. Well played, young maestro.\"",
        "Paganini: \"Your virtuosic flair on the fingerboard is truly devilish!\"",
        "Satie: \"Ah, finally... let us lounge, sip pear cider, and jam in ambient serenity.\""
      ],
      [
        "Mozart giggles and balances a cider glass on his forehead while playing a three-finger trill.",
        "Beethoven: \"Amadeus, behave yourself! We are honoring the Solstice Maestro!\"",
        "Bach nods approvingly: \"Let the child play. Contrapuntal joy knows no rigid bounds.\""
      ],
      [
        "Paganini tunes his demonic G string with a sinister grin: \"Who is ready for a double-stop race across eighty measures?!\"",
        "Satie yawns gracefully: \"Please, let us play something slow, unhurried, and shaped like a velvet pear.\""
      ]
    ]
  }
];

/* ---------------- INSTRUMENT ARTIFACTS ---------------- */

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
  },
  {
    id: 'vista_silver_bow',
    name: 'Silver Bow Glen',
    zone: 'west_wilderness',
    x: 1000,
    y: 1300,
    description: 'Willow trees whistle delicate string harmonics, imbuing warm lyrical tone.',
    statReward: 'toneQuality',
    statAmount: 5,
    visited: false
  },
  {
    id: 'vista_zephyr_falls',
    name: 'Zephyr Falls',
    zone: 'east_wilderness',
    x: 1000,
    y: 350,
    description: 'The misting cascade rings with pure woodwind intervals, sharpening sight-reading.',
    statReward: 'sightReading',
    statAmount: 5,
    visited: false
  },
  {
    id: 'vista_resonance_peak',
    name: 'Resonance Peak',
    zone: 'north_wilderness',
    x: 1600,
    y: 600,
    description: 'Acoustic canyon echoes reflect crisp brass attacks, elevating technical dexterity.',
    statReward: 'technique',
    statAmount: 5,
    visited: false
  },
  {
    id: 'vista_echoing_caldera',
    name: 'Echoing Caldera',
    zone: 'south_wilderness',
    x: 450,
    y: 800,
    description: 'Deep volcanic pulses lock in absolute rhythmic tempo stability.',
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
    title: 'Chapter 1: The Western Strings Mastery',
    chapter: 1,
    type: 'main',
    section: 'strings',
    description: 'Master the expressive bowings and lyrical cantabile of Strings in Cavatina Village. Pass Conservatory Theory Tier 1 (Pitch Fundamentals) at the academy lectern, recruit a local prodigy (Clara or Maya) to form your Duet, and triumph at the Village Gazebo against Busker Timmy.',
    objective: 'Pass Theory Tier 1 (Pitch Fundamentals), recruit Clara or Maya, and defeat Busker Timmy at the Village Gazebo.',
    rewardGold: 200,
    rewardSparks: 20,
    rewardStars: 1,
    completed: false,
    requiredTheoryTier: 1
  },
  {
    id: 'quest_ch2',
    title: 'Chapter 2: The Sylvan Woodwind Mastery',
    chapter: 2,
    type: 'main',
    section: 'woodwinds',
    description: 'Traverse the eastern wilderness into Woodwind Woods. Pass Conservatory Theory Tier 2 (Key Signatures), recruit a woodwind prodigy (Oliver, Chloe, or Devon), and prove your syncopation against Leo’s Whispering Canopy Trio.',
    objective: 'Pass Theory Tier 2 (Key Signatures), recruit Oliver or Chloe, and defeat Leo’s Whispering Canopy Trio in Woodwind Woods.',
    rewardGold: 450,
    rewardSparks: 35,
    rewardStars: 2,
    completed: false,
    requiredTheoryTier: 2
  },
  {
    id: 'quest_ch3',
    title: 'Chapter 3: The Gilded Brass Mastery',
    chapter: 3,
    type: 'main',
    section: 'brass',
    description: 'March north into the fortified ramparts of The Brass Citadel. Pass Conservatory Theory Tier 3 (Time Signatures & Subdivisions), recruit a brass prodigy (Jax or Sam), and conquer Baroness Vesta’s Citadel Fanfare.',
    objective: 'Pass Theory Tier 3 (Time Signatures), recruit Jax or Sam, and defeat Baroness Vesta’s Gilded Citadel Fanfare in The Brass Citadel.',
    rewardGold: 750,
    rewardSparks: 50,
    rewardStars: 3,
    completed: false,
    requiredTheoryTier: 3
  },
  {
    id: 'quest_ch4',
    title: 'Chapter 4: The Mountain Percussion Mastery',
    chapter: 4,
    type: 'main',
    section: 'percussion',
    description: 'Descend south into Rumble Gorge and Percussion Peaks. Pass Conservatory Theory Tier 4 (Advanced Intervals & Tritones), recruit a rhythm prodigy (Rita or Ren), and conquer Chieftain Ronin’s Mountain Thunder Corps.',
    objective: 'Pass Theory Tier 4 (Intervals & Tritones), recruit Rita or Ren, and defeat Chieftain Ronin’s Mountain Thunder Corps.',
    rewardGold: 1200,
    rewardSparks: 75,
    rewardStars: 4,
    completed: false,
    requiredTheoryTier: 4
  },
  {
    id: 'quest_ch5',
    title: 'Grand Finale: The Solstice Symphony',
    chapter: 5,
    type: 'main',
    description: 'Enter The Central City. Pass Conservatory Theory Tier 5 (Triad Inversions & Harmonies), assemble an 8-piece chamber orchestra uniting all 4 instrument families with Arranger Nico, and perform the Ode to Harmony for the Solstice Council.',
    objective: 'Pass Theory Tier 5 (Triads & Chords), recruit Nico in Central City, and defeat Aurelius & The Harmonia Youth Symphony.',
    rewardGold: 2500,
    rewardSparks: 150,
    rewardStars: 5,
    completed: false,
    requiredTheoryTier: 5
  },
  {
    id: 'quest_side_musicbox',
    title: 'Side Quest: The Antique Music Box',
    chapter: 1,
    type: 'restoration',
    description: 'Elder Timothy in Cavatina Village needs help replacing the delicate brass cylinder pins of his grandfather’s heirloom.',
    objective: 'Speak with Master Luthier Marco at the Forge, craft replacement Brass Pins, and return to Elder Timothy.',
    rewardGold: 150,
    rewardSparks: 10,
    rewardStars: 0,
    completed: false,
    requiredTheoryTier: 1
  },
  {
    id: 'quest_rescue_harmonidex',
    title: 'Familiar Rescue: Melodic Wildlife Bonding',
    chapter: 2,
    type: 'rescue',
    description: 'Wild Harmonipets in the wilderness biomes respond to pure pitch intervals. Apply your ear training to harmonize with and bond a wild creature to register them in your HarmoniDex.',
    objective: 'Successfully harmonize with and bond any wild Harmonipet in the wilderness corridors.',
    rewardGold: 300,
    rewardSparks: 25,
    rewardStars: 1,
    completed: false,
    requiredTheoryTier: 1
  },
  {
    id: 'quest_side_theory_scholar',
    title: 'Academic Favor: Conservatory Theory Scholar',
    chapter: 2,
    type: 'side',
    description: 'Professor Lyra at the Cavatina Music Academy and regional deans encourage musicians to train their ears and score-reading at village theory lecterns.',
    objective: 'Pass 3 music theory drills at the academic lecterns across Harmonia’s regional academies.',
    rewardGold: 350,
    rewardSparks: 30,
    rewardStars: 1,
    completed: false,
    requiredTheoryTier: 1
  },
  {
    id: 'quest_side_luthier_artisan',
    title: 'Artisan Commission: The Luthier’s Craft',
    chapter: 3,
    type: 'side',
    description: 'Master Luthier Marco in Cavatina, Master Reed in Woodwinds, and Master Vulcan in the Citadel forge signature instrument artifacts requiring acoustic harmonic knowledge.',
    objective: 'Pass Theory Tier 2 and gather Notes and Inspiration Sparks to forge an Instrument Artifact at any regional luthier forge.',
    rewardGold: 500,
    rewardSparks: 40,
    rewardStars: 2,
    completed: false,
    requiredTheoryTier: 2
  },
  {
    id: 'quest_restoration_vistas',
    title: 'Shrine Restoration: Whispers of the Four Biomes',
    chapter: 4,
    type: 'restoration',
    description: 'Harmonia’s ancient masters encoded harmonic power into natural Inspiration Vistas across Lyre Valley, Breeze Glade, Echo Canyon, and Rumble Gorge.',
    objective: 'Attune to at least 4 Inspiration Vistas across Harmonia’s connector wilderness biomes.',
    rewardGold: 600,
    rewardSparks: 50,
    rewardStars: 2,
    completed: false,
    requiredTheoryTier: 3
  },
  {
    id: 'quest_gig_festival_circuit',
    title: 'Festival Tour: Solstice Seasonal Circuit',
    chapter: 5,
    type: 'gig',
    description: 'The Solstice Clocktower Council in Central City oversees seasonal tournament concerts across the realm. Pay the entry fee and compete to win prestigious Conservatory Clef Badges.',
    objective: 'Win any seasonal Grand Concert festival competition from the Solstice Council calendar.',
    rewardGold: 1000,
    rewardSparks: 80,
    rewardStars: 3,
    completed: false,
    requiredTheoryTier: 4
  },
  {
    id: 'quest_brass_bow_debate',
    title: 'Rivalry Duet: The Brass & Bow Debate',
    chapter: 3,
    type: 'side',
    section: 'brass',
    description: 'Clara (Violin) and Jax (Trumpet) are locked in a fierce debate over whose instrument commands superior acoustic projection. Unite both prodigies in your ensemble to harmonize their sonic rivalry.',
    objective: 'Recruit both Clara and Jax into your ensemble to bridge strings and brass in a harmonious rivalry duet.',
    rewardGold: 600,
    rewardSparks: 45,
    rewardStars: 2,
    completed: false,
    requiredTheoryTier: 2
  },
  {
    id: 'quest_bass_underground',
    title: 'Subterranean Groove: The Low-End Underground',
    chapter: 4,
    type: 'side',
    section: 'percussion',
    description: 'Maya (Cello) and Rita (Drums) share a passion for deep acoustic resonance and low-frequency grooves. Unite low strings and thunderous rhythm in your ensemble.',
    objective: 'Recruit both Maya and Rita into your ensemble to unlock the subterranean groove resonance.',
    rewardGold: 800,
    rewardSparks: 60,
    rewardStars: 2,
    completed: false,
    requiredTheoryTier: 3
  },
  {
    id: 'quest_mrs_chen_score',
    title: "Secret Heritage: Mrs. Chen's Lullaby",
    chapter: 1,
    type: 'side',
    section: 'strings',
    description: "Mrs. Chen pushes Clara relentlessly for 40 hours of daily practice, but secretly treasures a vintage lullaby score from her youth. Speak with her in Cavatina Village to uncover the manuscript.",
    objective: "Speak with Mrs. Chen in Cavatina Village after recruiting Clara or passing Theory Tier 1 to recover her secret lullaby score.",
    rewardGold: 300,
    rewardSparks: 25,
    rewardStars: 1,
    completed: false,
    requiredTheoryTier: 1
  },
  {
    id: 'quest_blind_conductor',
    title: 'Timbre Discord Clinic: The Blind Conductor',
    chapter: 3,
    type: 'side',
    description: "Maestro Tiresias, the legendary Blind Conductor, diagnoses orchestral timbre discord through pure acoustic resonance. Visit him to balance your ensemble's harmonic frequencies.",
    objective: "Consult with Maestro Tiresias in the High Conservatory or wilderness and resolve the acoustic frequency discord.",
    rewardGold: 700,
    rewardSparks: 50,
    rewardStars: 2,
    completed: false,
    requiredTheoryTier: 3
  },
  {
    id: 'quest_maestro_roundtable',
    title: "The Maestro's Roundtable: Classical Titan Jam",
    chapter: 5,
    type: 'gig',
    description: "The 5 immortal masters—Mozart, Beethoven, Bach, Paganini, and Satie—gather at The Maestro's Forum & Taphouse in Central City for the ultimate post-game celebratory jam session.",
    objective: "Meet the Maestros at the Central Taphouse forum after conquering the Solstice Symphony to ignite the celebratory roundtable jam!",
    rewardGold: 3000,
    rewardSparks: 200,
    rewardStars: 5,
    completed: false,
    requiredTheoryTier: 5
  }
];

export const INITIAL_QUESTS = INITIAL_GAME_QUESTS;

/* ---------------- THE HARMONIDEX (16 CREATURE BESTIARY) ---------------- */

export const INITIAL_HARMONIDEX: HarmoniDexEntry[] = [
  // Strings (6 Species)
  {
    id: 'dex_swan',
    species: 'Allegro Swan',
    name: 'Allegro',
    section: 'strings',
    instrumentId: 'violin',
    instrumentName: 'Violin',
    sprite: '🐣',
    description: 'An elegant avian familiar known for soaring lyrical cantilenas and razor-sharp spiccato bowing.',
    discovered: true,
    bonded: true,
    evolutionStage: 1,
    evolvesTo: 'Symphonic Swan',
    evolutionLevel: 3,
    evolvedSprite: '🦢',
    evolvedLore: 'Having blossomed into a magnificent Symphonic Swan, its soaring vibrato creates an angelic acoustic aura that fills concert halls with transcendental resonance.',
    evolvedStatsBonus: { technique: 8, toneQuality: 10 },
    rarity: 'common'
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
    evolutionLevel: 3,
    evolvedSprite: '🐇🪕',
    evolvedLore: 'With lightning paw dexterity, the Virtuoso Hare can execute blistering rasgueado strums and folk arpeggios that supercharge tempo stability.',
    evolvedStatsBonus: { technique: 10, tempoStability: 8 },
    rarity: 'common'
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
    evolutionLevel: 3,
    evolvedSprite: '🦊🎻',
    evolvedLore: 'A serene woodland master whose rich cantabile cello lines resonate in deep harmony with the ancient forest trees.',
    evolvedStatsBonus: { toneQuality: 10, sightReading: 8 },
    rarity: 'common'
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
    evolutionStage: 1,
    evolvesTo: 'Siren Dolphin',
    evolutionLevel: 3,
    evolvedSprite: '🐬🪕',
    evolvedLore: 'Plucking celestial harp glissandos across the ocean waves, creating soothing acoustic tides that absorb dissonance and restore harmony.',
    evolvedStatsBonus: { toneQuality: 8, sightReading: 10 },
    rarity: 'rare'
  },
  {
    id: 'dex_chameleon',
    species: 'Clavichord Chameleon',
    name: 'Camille',
    section: 'strings',
    instrumentId: 'harpsichord',
    instrumentName: 'Harpsichord',
    sprite: '🦎',
    description: 'A vibrant reptile whose nimble claws pluck delicate, quill-sharp harpsichord counterpoint with Baroque precision.',
    discovered: false,
    bonded: false,
    evolutionStage: 1,
    evolvesTo: 'Cembalo Dragon',
    evolutionLevel: 3,
    evolvedSprite: '🐲🎹',
    evolvedLore: 'Ascended into a legendary Baroque dragon, unleashing rapid-fire harpsichord counterpoint flourishes of pristine acoustic power.',
    evolvedStatsBonus: { technique: 10, sightReading: 8 },
    rarity: 'exotic'
  },
  {
    id: 'dex_rock_hedgehog',
    species: 'Rockabilly Hedgehog',
    name: 'Spike',
    section: 'strings',
    instrumentId: 'electric_guitar',
    instrumentName: 'Electric Guitar',
    sprite: '🦔',
    description: 'Bristling with amplified quills, this rocker unleashes overdriven power chords and blistering distortion harmonics.',
    discovered: false,
    bonded: false,
    evolutionStage: 1,
    evolvesTo: 'Heavy Metal Porcupine',
    evolutionLevel: 3,
    evolvedSprite: '🦔🎸',
    evolvedLore: 'Bristling with electrified distortion quills, shredding legendary overdrive riffs that send electrifying shockwaves across the concert stage!',
    evolvedStatsBonus: { technique: 12, toneQuality: 8 },
    rarity: 'exotic'
  },

  // Woodwinds (5 Species)
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
    evolutionLevel: 3,
    evolvedSprite: '🐦🪈',
    evolvedLore: 'Soaring into the high atmospheric winds, singing crystalline flute trills that pierce effortlessly through the heaviest orchestral textures.',
    evolvedStatsBonus: { technique: 10, sightReading: 8 },
    rarity: 'common'
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
    evolutionStage: 1,
    evolvesTo: 'Virtuoso Otter',
    evolutionLevel: 3,
    evolvedSprite: '🦦🪈',
    evolvedLore: 'Gliding gracefully through misty river glades, weaving expressive oboe soliloquies of profound emotional beauty.',
    evolvedStatsBonus: { toneQuality: 10, tempoStability: 8 },
    rarity: 'common'
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
    evolutionStage: 1,
    evolvesTo: 'Clarinet Panther',
    evolutionLevel: 3,
    evolvedSprite: '🐆🎷',
    evolvedLore: 'A stealthy feline virtuoso leaping effortlessly between velvety chalumeau lows and piercing clarion highs.',
    evolvedStatsBonus: { technique: 8, toneQuality: 10 },
    rarity: 'rare'
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
    evolutionStage: 1,
    evolvesTo: 'Bassoon Badger Maestro',
    evolutionLevel: 3,
    evolvedSprite: '🦡🪈',
    evolvedLore: 'Anchoring the acoustic foundation with robust double-reed basslines and unbreakable rhythmic fortitude.',
    evolvedStatsBonus: { tempoStability: 10, toneQuality: 8 },
    rarity: 'rare'
  },
  {
    id: 'dex_sax_fox',
    species: 'Bebop Fox',
    name: 'Dexter',
    section: 'woodwinds',
    instrumentId: 'saxophone',
    instrumentName: 'Saxophone',
    sprite: '🦊',
    description: 'A smooth, nocturnal canid famous for smoky midnight jazz runs and rich, reedy vibrato improvisation.',
    discovered: false,
    bonded: false,
    evolutionStage: 1,
    evolvesTo: 'Virtuoso Bebop Fox',
    evolutionLevel: 3,
    evolvedSprite: '🦊🎷',
    evolvedLore: 'The ultimate midnight jazz prodigy! Its soulful saxophone portamentos and blistering bebop cadence riffs enchant all who hear.',
    evolvedStatsBonus: { technique: 10, toneQuality: 10 },
    rarity: 'exotic'
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
    evolutionLevel: 3,
    evolvedSprite: '🐕🎺',
    evolvedLore: 'Sounding regal golden herald calls and heroic brass blasts that fill the concert hall with triumphant energy.',
    evolvedStatsBonus: { toneQuality: 12, tempoStability: 8 },
    rarity: 'common'
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
    evolutionStage: 1,
    evolvesTo: 'Alpine Sovereign Ram',
    evolutionLevel: 3,
    evolvedSprite: '🐏📯',
    evolvedLore: 'Echoing noble French horn calls across majestic snowpeaks with warm, velvety acoustic warmth.',
    evolvedStatsBonus: { toneQuality: 10, tempoStability: 8 },
    rarity: 'common'
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
    evolutionStage: 1,
    evolvesTo: 'Imperial Lion',
    evolutionLevel: 3,
    evolvedSprite: '🦁🎺',
    evolvedLore: 'Roaring thunderous slide trombone glissandos that command immediate fortissimo respect and awe.',
    evolvedStatsBonus: { toneQuality: 12, technique: 8 },
    rarity: 'rare'
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
    evolutionStage: 1,
    evolvesTo: 'Colossus Elephant',
    evolutionLevel: 3,
    evolvedSprite: '🐘🎺',
    evolvedLore: 'Vibrating the bedrock of Harmonia with subterranean acoustic pedal notes that anchor the entire brass choir.',
    evolvedStatsBonus: { tempoStability: 12, toneQuality: 8 },
    rarity: 'legendary'
  },

  // Percussion (6 Species)
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
    evolutionLevel: 3,
    evolvedSprite: '🦝🥁',
    evolvedLore: 'Executing blazing paradiddle rolls and crisp rimshots with metronomic microsecond perfection.',
    evolvedStatsBonus: { tempoStability: 14, technique: 8 },
    rarity: 'common'
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
    evolutionStage: 1,
    evolvesTo: 'Thunder Titan Bear',
    evolutionLevel: 3,
    evolvedSprite: '🐻🥁',
    evolvedLore: 'Striking kettle timpani drums with volcanic fury, building unstoppable dynamic crescendos.',
    evolvedStatsBonus: { toneQuality: 10, tempoStability: 10 },
    rarity: 'rare'
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
    evolutionStage: 1,
    evolvesTo: 'Virtuoso Squirrel',
    evolutionLevel: 3,
    evolvedSprite: '🐿️🪵',
    evolvedLore: 'Dancing across polished rosewood bars with four mallets, showering listeners with shimmering polyrhythmic melodies.',
    evolvedStatsBonus: { technique: 10, tempoStability: 8 },
    rarity: 'common'
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
    evolutionStage: 1,
    evolvesTo: 'Celestial Chime Owl',
    evolutionLevel: 3,
    evolvedSprite: '🦉🔔',
    evolvedLore: 'Tapping pure glockenspiel bell overtones that shimmer under starry midnight skies with ethereal magic.',
    evolvedStatsBonus: { sightReading: 12, toneQuality: 8 },
    rarity: 'rare'
  },
  {
    id: 'dex_typewriter_bird',
    species: 'Typist Woodpecker',
    name: 'Quill',
    section: 'percussion',
    instrumentId: 'typewriter',
    instrumentName: 'Typewriter',
    sprite: '🐦',
    description: 'Pecking out rapid mechanical staccato rhythms with clockwork precision, accompanied by cheerful margin bell chimes.',
    discovered: false,
    bonded: false,
    evolutionStage: 1,
    evolvesTo: 'Symphonic Stenographer',
    evolutionLevel: 3,
    evolvedSprite: '🦉⌨️',
    evolvedLore: 'Mechanical speed turned into fine art, delivering rapid-fire percussive key strikes and bell chimes in tight syncopation.',
    evolvedStatsBonus: { technique: 10, tempoStability: 10 },
    rarity: 'exotic'
  },
  {
    id: 'dex_cannon_beetle',
    species: 'Bombardier Beetle',
    name: 'Boomer',
    section: 'percussion',
    instrumentId: 'cannon',
    instrumentName: 'Tchaikovsky Cannon',
    sprite: '🪲',
    description: 'An armored titan that generates seismic acoustic shockwaves and deep sub-bass explosions fit for the 1812 Overture.',
    discovered: false,
    bonded: false,
    evolutionStage: 1,
    evolvesTo: 'Artillery Scarab',
    evolutionLevel: 3,
    evolvedSprite: '🪲💣',
    evolvedLore: 'Detonating legendary 1812 sub-bass artillery salvos that resonate through the soul and conquer dissonance.',
    evolvedStatsBonus: { toneQuality: 14, tempoStability: 8 },
    rarity: 'legendary'
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
    conservatory: 'Starlight Conservatory of Harmonia',
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

/* ---------------- FESTIVAL COMPETITION CALENDAR ---------------- */

export const FESTIVAL_CALENDAR: FestivalEvent[] = [
  {
    id: 'event_spring_cavatina',
    name: 'Cavatina Meadow Serenade',
    seasonDay: 'Spring 4th (Primavera)',
    zone: 'cavatina_village',
    venueName: 'Village Plaza Gazebo',
    tierRequirement: 'duet',
    statRequirements: {
      minEffectiveSkill: 25,
      requiredSection: 'strings'
    },
    entryFeeGold: 20,
    rewardGold: 150,
    rewardSparks: 15,
    rewardStars: 1,
    rewardBadgeId: 'badge_prelude',
    description: 'A gentle spring festival where emerging duets weave lyrical counterpoint under the blooming cherry willows.',
    rivalMusician: {
      id: 'rival_clara',
      name: 'Duet Master Clara',
      title: 'Meadow Virtuoso',
      avatar: '🎻',
      paletteColor: '#ec4899',
      instrumentId: 'violin',
      instrumentName: 'Aria Violin',
      section: 'strings',
      pet: {
        id: 'pet_clara_swan',
        name: 'Grace',
        species: 'Cantabile Swan',
        sprite: 'swan',
        section: 'strings',
        instrumentName: 'Aria Violin',
        leitmotifSound: 'violin_pure',
        color: '#ec4899'
      },
      stats: { technique: 30, toneQuality: 35, tempoStability: 30, sightReading: 30 },
      level: 3,
      xp: 300
    }
  },
  {
    id: 'event_summer_woodwind',
    name: 'Sylvan Bossa Jamboree',
    seasonDay: 'Summer 12th (Solstice)',
    zone: 'woodwind_woods',
    venueName: 'Sylvan Glade Canopy Stage',
    tierRequirement: 'trio',
    statRequirements: {
      minEffectiveSkill: 40,
      requiredSection: 'woodwinds',
      minSightReading: 35
    },
    entryFeeGold: 40,
    rewardGold: 300,
    rewardSparks: 25,
    rewardStars: 1,
    rewardBadgeId: 'badge_pastorale',
    description: 'An infectious jazz & bossa nova carnival reverberating through the sunlit canopies of Woodwind Woods.',
    rivalMusician: {
      id: 'rival_sylvan',
      name: 'Bandleader Sylvan',
      title: 'Groove Arch-Druid',
      avatar: '🎷',
      paletteColor: '#10b981',
      instrumentId: 'silver_flute',
      instrumentName: 'Bamboo Tenor Sax',
      section: 'woodwinds',
      pet: {
        id: 'pet_sylvan_frog',
        name: 'Syncopate',
        species: 'Flute Frog',
        sprite: 'frog',
        section: 'woodwinds',
        instrumentName: 'Silver Flute',
        leitmotifSound: 'flute_chirp',
        color: '#10b981'
      },
      stats: { technique: 45, toneQuality: 50, tempoStability: 45, sightReading: 45 },
      level: 5,
      xp: 600
    }
  },
  {
    id: 'event_autumn_brass',
    name: 'Brass Bastion Fanfare Derby',
    seasonDay: 'Autumn 8th (Equinox)',
    zone: 'brass_citadel',
    venueName: 'The Echo Amphitheater',
    tierRequirement: 'quartet',
    statRequirements: {
      minEffectiveSkill: 55,
      requiredSection: 'brass',
      minTempoStability: 50
    },
    entryFeeGold: 60,
    rewardGold: 500,
    rewardSparks: 40,
    rewardStars: 2,
    rewardBadgeId: 'badge_cadenza',
    description: 'A thunderous tournament of dynamic projection and heroic fanfares echoing from gilded ramparts.',
    rivalMusician: {
      id: 'rival_vesta',
      name: 'Baroness Vesta',
      title: 'High Herald of Cadenza',
      avatar: '🎺',
      paletteColor: '#f59e0b',
      instrumentId: 'pocket_trumpet',
      instrumentName: 'Golden Valved Trumpet',
      section: 'brass',
      pet: {
        id: 'pet_vesta_badger',
        name: 'Crescendo',
        species: 'Fanfare Badger',
        sprite: 'badger',
        section: 'brass',
        instrumentName: 'Pocket Trumpet',
        leitmotifSound: 'trumpet_brass',
        color: '#f59e0b'
      },
      stats: { technique: 60, toneQuality: 65, tempoStability: 60, sightReading: 55 },
      level: 8,
      xp: 1200
    }
  },
  {
    id: 'event_winter_percussion',
    name: 'Thunderclap Taiko Summit',
    seasonDay: 'Winter 16th (Frostbeat)',
    zone: 'percussion_peaks',
    venueName: 'Mountbeat Caldera Stage',
    tierRequirement: 'chamber',
    statRequirements: {
      minEffectiveSkill: 70,
      requiredSection: 'percussion',
      minTempoStability: 65
    },
    entryFeeGold: 100,
    rewardGold: 800,
    rewardSparks: 60,
    rewardStars: 2,
    rewardBadgeId: 'badge_scherzo',
    description: 'The ultimate trial of pulse, polyrhythm, and earth-shattering precision held over molten basalt pits.',
    rivalMusician: {
      id: 'rival_ronin',
      name: 'Chieftain Ronin',
      title: 'Master of the Primal Beat',
      avatar: '🥁',
      paletteColor: '#8b5cf6',
      instrumentId: 'snare_kit',
      instrumentName: 'Grand Taiko Drums',
      section: 'percussion',
      pet: {
        id: 'pet_ronin_armadillo',
        name: 'Staccato',
        species: 'Rhythm Armadillo',
        sprite: 'armadillo',
        section: 'percussion',
        instrumentName: 'Snare Kit',
        leitmotifSound: 'drum_beat',
        color: '#8b5cf6'
      },
      stats: { technique: 75, toneQuality: 70, tempoStability: 85, sightReading: 70 },
      level: 10,
      xp: 2000
    }
  },
  {
    id: 'event_grand_solstice_symphony',
    name: 'Harmonia Grand Solstice Symphony',
    seasonDay: 'Grand Finale Festival',
    zone: 'grand_hall',
    venueName: 'The Eternal Sanctuary Stage',
    tierRequirement: 'symphony',
    statRequirements: {
      minEffectiveSkill: 80,
      requiredBadges: 4
    },
    entryFeeGold: 200,
    rewardGold: 2000,
    rewardSparks: 150,
    rewardStars: 5,
    rewardBadgeId: 'badge_overture',
    description: 'The legendary climax where Harmonia\'s supreme 8-piece orchestra performs the Ode to Harmony for the High Council.',
    rivalMusician: {
      id: 'rival_aurelius',
      name: 'High Maestro Aurelius',
      title: 'Conductor of the Spheres',
      avatar: '👑',
      paletteColor: '#ec4899',
      instrumentId: 'harp',
      instrumentName: 'The Celestial Harp',
      section: 'strings',
      pet: {
        id: 'pet_aurelius_kirin',
        name: 'Symphonia',
        species: 'Cantabile Swan',
        sprite: 'swan',
        section: 'strings',
        instrumentName: 'The Celestial Harp',
        leitmotifSound: 'violin_pure',
        color: '#ec4899'
      },
      stats: { technique: 90, toneQuality: 95, tempoStability: 90, sightReading: 95 },
      level: 15,
      xp: 5000
    }
  }
];

/* ---------------- DYNAMIC DIFFICULTY SCALING ---------------- */

export function calculateDynamicRivalStats(baseStats: MusicianStats, progressTier: number): MusicianStats {
  // progressTier: 1 (Duet), 2 (Trio), 3 (Quartet), 4 (Chamber), 5 (Symphony)
  const multiplier = 1 + (progressTier - 1) * 0.35;
  return {
    technique: Math.min(100, Math.round(baseStats.technique * multiplier)),
    toneQuality: Math.min(100, Math.round(baseStats.toneQuality * multiplier)),
    tempoStability: Math.min(100, Math.round(baseStats.tempoStability * multiplier)),
    sightReading: Math.min(100, Math.round(baseStats.sightReading * multiplier))
  };
}

/* ---------------- INITIAL DISPATCH VENUES ---------------- */

export const INITIAL_DISPATCH_VENUES: DispatchVenue[] = [
  {
    id: 'dispatch_cavatina_gazebo',
    name: 'Cavatina Gazebo',
    zone: 'cavatina_village',
    requiredTier: 'solo',
    durationSeconds: 30,
    rewardNotes: 100,
    rewardSparks: 5,
    rewardXp: 60,
    description: 'A charming garden gazebo in Cavatina Village where townspeople gather for acoustic morning serenades.',
    unlocked: true
  },
  {
    id: 'dispatch_whispering_lounge',
    name: 'Whispering Lounge',
    zone: 'woodwind_woods',
    requiredTier: 'duet',
    durationSeconds: 60,
    rewardNotes: 220,
    rewardSparks: 12,
    rewardXp: 140,
    description: 'A tranquil forest canopy lounge where gentle woodwind harmonies soothe weary woodland travelers.',
    unlocked: false
  },
  {
    id: 'dispatch_golden_canteen',
    name: 'Golden Canteen',
    zone: 'brass_citadel',
    requiredTier: 'trio',
    durationSeconds: 120,
    rewardNotes: 400,
    rewardSparks: 25,
    rewardXp: 280,
    description: 'A bustling Citadel dining hall where triumphant brass fanfares rally the garrison and patrons.',
    unlocked: false
  },
  {
    id: 'dispatch_boulder_saloon',
    name: 'Boulder Saloon',
    zone: 'percussion_peaks',
    requiredTier: 'quartet',
    durationSeconds: 180,
    rewardNotes: 650,
    rewardSparks: 40,
    rewardXp: 480,
    description: 'A rowdy mountain cavern tavern echoing with polyrhythmic beats, stomps, and driving percussion.',
    unlocked: false
  },
  {
    id: 'dispatch_grand_rotunda',
    name: 'Grand Rotunda',
    zone: 'grand_hall',
    requiredTier: 'chamber',
    durationSeconds: 300,
    rewardNotes: 1200,
    rewardSparks: 80,
    rewardXp: 900,
    description: 'The pinnacle acoustic amphitheater of the Conservatory, demanding rich multi-instrumental resonance.',
    unlocked: false
  }
];

/* ---------------- PET SYNERGY UNISON ATTACKS ---------------- */

export const PET_SYNERGIES: PetSynergy[] = [
  {
    id: 'synergy_avian_cantabile',
    name: 'Avian Cantabile',
    requiredPets: ['Swan', 'Finch'],
    effectType: 'heal_harmony',
    power: 35,
    cost: 30,
    description: 'Swan & Finch blend lyrical strings and airy woodwinds into a soothing resonance that restores +35% Harmony Meter!'
  },
  {
    id: 'synergy_syncopated_fanfare',
    name: 'Syncopated Fanfare',
    requiredPets: ['Terrier', 'Raccoon'],
    effectType: 'stun_rival',
    power: 25,
    cost: 40,
    description: 'Terrier & Raccoon unleash a punchy syncopated brass blast that deals +25% resonance and stuns the rival musician!'
  },
  {
    id: 'synergy_bebop_staccato',
    name: 'Bebop Staccato',
    requiredPets: ['Fox', 'Woodpecker'],
    effectType: 'crit_burst',
    power: 50,
    cost: 45,
    description: 'Fox & Woodpecker execute rapid syncopated bebop riffs that strike with overwhelming critical burst resonance (+50% Harmony)!'
  },
  {
    id: 'synergy_thunder_quake',
    name: 'Thunder Quake',
    requiredPets: ['Beetle', 'Bear'],
    effectType: 'crit_burst',
    power: 60,
    cost: 50,
    description: 'Beetle & Bear combine subterranean cannon shockwaves with volcanic timpani strikes for seismic resonance (+60% Harmony)!'
  }
];

export const INITIAL_PHONE_MESSAGES: PhoneMessage[] = [
  {
    id: 'msg_mom_welcome',
    sender: 'Mama Aria 💖',
    senderAvatar: '👩‍👧',
    category: 'mom',
    subject: 'Did you practice today?! 🎻',
    body: "Hi sweetie! I set up your HarmoniPhone with all your calendar gigs and quest logs. Remember: Ling Ling was already practicing 40 hours a day! Don't let Mrs. Chen's daughter Clara out-rehearse you. I already bragged to the whole village council that you're going to headline Sinfonia Magna!",
    timestamp: 'Season 1, Day 1',
    read: false
  },
  {
    id: 'msg_clara_rivalry',
    sender: 'Clara Chen 🎻',
    senderAvatar: '👧',
    category: 'rival',
    subject: 'Practice duel rematch?',
    body: "Hey! Saw you picked up your starter instrument. My mom won't stop talking about you, but let's see if your intonation can keep up with my vibrato in the Village Square. Meet me by the fountain if you're ready for a play-off!",
    timestamp: 'Season 1, Day 1',
    read: false
  },
  {
    id: 'msg_rumor_easter_egg',
    sender: 'Town Gossip / Chirper 🐦',
    senderAvatar: '🗞️',
    category: 'gossip',
    subject: 'Mysterious Pianist in Sinfonia Magna!',
    body: "Rumor Mill: A flashy virtuoso pianist with wild silver hair and a grand piano on wheels has taken over the Central Square dais in Sinfonia Magna! They say if anyone can out-busk him in a concerto duel, he'll join as their permanent accompanist!",
    timestamp: 'Season 1, Day 2',
    read: false
  },
  {
    id: 'msg_rumor_cannon',
    sender: 'Explorer Bulletin 🧭',
    senderAvatar: '🪲',
    category: 'gossip',
    subject: 'Unusual Beast in North Wilderness',
    body: "Scouts report hearing artillery explosions in the red canyons of North Wilderness! It's not warfare—it's a rare Bombardier Beetle using a Tchaikovsky cannon resonance chamber! Bring ear protection!",
    timestamp: 'Season 1, Day 2',
    read: false
  }
];

/* ---------------- ENSEMBLE BATTLE SECTION ACTIONS ---------------- */

export const SECTION_ACTIONS: Record<InstrumentSection, SectionAction[]> = {
  strings: [
    {
      id: 'strings_cantabile',
      name: 'Cantabile Legato',
      section: 'strings',
      icon: '🎻',
      description: 'Lyrical sustained melodic sweep. Delivers steady resonance and surges audience favor.',
      cost: 15,
      power: 28,
      effect: 'applause_surge',
      soundType: 'violin_pure'
    },
    {
      id: 'strings_spiccato',
      name: 'Spiccato Arpeggio',
      section: 'strings',
      icon: '✨',
      description: 'Rapid bouncing bow attack. Unleashes sharp acoustic multi-hit bursts on the rival line.',
      cost: 20,
      power: 38,
      effect: 'attack',
      soundType: 'violin'
    },
    {
      id: 'strings_pizzicato',
      name: 'Pizzicato Snap',
      section: 'strings',
      icon: '🪕',
      description: 'Plucked percussive acoustic snap. Generates quick resonance and restores +15 Maestro Flow.',
      cost: 10,
      power: 20,
      effect: 'heal_harmony',
      soundType: 'guitar_strum'
    },
    {
      id: 'strings_harmonics',
      name: 'Harmonic Overtones',
      section: 'strings',
      icon: '🛡️',
      description: 'Ethereal high frequencies. Erects an acoustic barrier that shields against rival counter-attacks.',
      cost: 25,
      power: 15,
      effect: 'shield',
      soundType: 'violin_pure'
    }
  ],
  woodwinds: [
    {
      id: 'woodwinds_staccato',
      name: 'Staccato Trill',
      section: 'woodwinds',
      icon: '🪈',
      description: 'Agile rapid-fire woodwind trill. Pierces through rival guard with pinpoint acoustic precision.',
      cost: 15,
      power: 32,
      effect: 'attack',
      soundType: 'flute_chirp'
    },
    {
      id: 'woodwinds_dolce',
      name: 'Dolce Serenade',
      section: 'woodwinds',
      icon: '🍃',
      description: 'Warm breathy melody that soothes the hall, restoring +25 Maestro Flow and ensemble composure.',
      cost: 10,
      power: 18,
      effect: 'heal_harmony',
      soundType: 'silver_flute'
    },
    {
      id: 'woodwinds_gust',
      name: 'Chromatic Gale',
      section: 'woodwinds',
      icon: '🌪️',
      description: 'Sweeping chromatic whirlwind scale that blows through the auditorium for massive score.',
      cost: 25,
      power: 42,
      effect: 'attack',
      soundType: 'flute_chirp'
    },
    {
      id: 'woodwinds_breath',
      name: 'Diaphragm Focus',
      section: 'woodwinds',
      icon: '💨',
      description: 'Deep breath control technique. Empowers the next section with +50% amplified sound output.',
      cost: 20,
      power: 15,
      effect: 'boost_next',
      soundType: 'silver_flute'
    }
  ],
  brass: [
    {
      id: 'brass_fortissimo',
      name: 'Fortissimo Blare',
      section: 'brass',
      icon: '🎺',
      description: 'Titanic golden herald blast. Shakes the auditorium rafters with colossal dynamic volume.',
      cost: 25,
      power: 45,
      effect: 'attack',
      soundType: 'trumpet_blare'
    },
    {
      id: 'brass_tutti',
      name: 'Tutti Fanfare',
      section: 'brass',
      icon: '⚡',
      description: 'Inspiring brass fanfare that doubles (+100%) the resonance attack power of the next section!',
      cost: 20,
      power: 20,
      effect: 'boost_next',
      soundType: 'trumpet_blare'
    },
    {
      id: 'brass_triumphal',
      name: 'Triumphal March',
      section: 'brass',
      icon: '👑',
      description: 'Stately march that excites the judges and generates a +20% Audience Applause surge.',
      cost: 15,
      power: 24,
      effect: 'applause_surge',
      soundType: 'pocket_trumpet'
    },
    {
      id: 'brass_muted',
      name: 'Harmon-Muted Echo',
      section: 'brass',
      icon: '🔕',
      description: 'Buzzy cup-muted brass call that disorients the rival ensemble and disrupts their cadence.',
      cost: 15,
      power: 26,
      effect: 'stun_rival',
      soundType: 'pocket_trumpet'
    }
  ],
  percussion: [
    {
      id: 'percussion_thunder',
      name: 'Taiko Thunderclap',
      section: 'percussion',
      icon: '🥁',
      description: 'Deep seismic percussive impact that stuns the rival ensemble, suppressing their next strike.',
      cost: 25,
      power: 36,
      effect: 'stun_rival',
      soundType: 'drum_snap'
    },
    {
      id: 'percussion_groove',
      name: 'Syncopated Pocket',
      section: 'percussion',
      icon: '🎯',
      description: 'Unflinching metronomic pocket groove. Locks the entire ensemble into rhythmic perfection.',
      cost: 15,
      power: 26,
      effect: 'heal_harmony',
      soundType: 'snare_kit'
    },
    {
      id: 'percussion_roll',
      name: 'Crescendo Snare Roll',
      section: 'percussion',
      icon: '🔥',
      description: 'Accelerating buzz roll that builds massive dynamic tension, unleashing +42 resonance score.',
      cost: 25,
      power: 42,
      effect: 'attack',
      soundType: 'drum_snap'
    },
    {
      id: 'percussion_reset',
      name: 'Metronome Pulse',
      section: 'percussion',
      icon: '⏱️',
      description: 'Authoritative four-on-the-floor downbeat that resets timing errors and restores +25 Flow.',
      cost: 10,
      power: 16,
      effect: 'heal_harmony',
      soundType: 'snare_kit'
    }
  ]
};


