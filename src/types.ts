// Harmonia: Opus of the Ensemble - Core Data Types

export type InstrumentSection = 'strings' | 'woodwinds' | 'brass' | 'percussion';

export type InstrumentId = 
  | 'violin' | 'acoustic_guitar' | 'cello' | 'harp'
  | 'silver_flute' | 'soprano_sax' | 'clarinet' | 'oboe'
  | 'pocket_trumpet' | 'french_horn' | 'trombone' | 'tuba'
  | 'snare_kit' | 'marimba' | 'timpani' | 'glockenspiel';

export interface Harmonipet {
  id: string;
  name: string;
  species: string;
  sprite: string;
  section: InstrumentSection;
  instrumentName: string;
  leitmotifSound: string;
  color: string;
}

export interface MusicianStats {
  technique: number;     // Accuracy and speed in complex passages (1-100)
  toneQuality: number;   // Resonance and dynamic expression (1-100)
  tempoStability: number;// Metronomic timing and resilience to disruption (1-100)
  sightReading: number;  // Speed of learning new sheet music (1-100)
}

export interface InstrumentMastery {
  level: number; // 1 to 10
  xp: number;
}

export interface PlayerProficiency {
  sections: Record<InstrumentSection, number>; // 0 to 100
  instruments: Record<InstrumentId, InstrumentMastery>;
  unlockedInstruments: InstrumentId[];
}

export interface Musician {
  id: string;
  name: string;
  title: string;
  isPlayer?: boolean;
  avatar: string;
  paletteColor: string;
  instrumentId: InstrumentId;
  instrumentName: string;
  section: InstrumentSection;
  pet: Harmonipet;
  stats: MusicianStats;
  level: number;
  xp: number;
  dialogue?: string[];
  auditionDialogue?: string[];
  recruitedDialogue?: string[];
}

export interface RepertoirePiece {
  id: string;
  title: string;
  composer: string;
  genre: string;
  difficulty: number; // 1 to 5 stars
  minEnsembleTier: 'solo' | 'duet' | 'trio' | 'quartet' | 'chamber' | 'orchestra';
  requiredSections: {
    strings?: number;
    woodwinds?: number;
    brass?: number;
    percussion?: number;
  };
  bpm: number;
  tempoBPM?: number;
  chords: {
    strings?: number[];
    woodwinds?: number[];
    winds?: number[];
    brass?: number[];
    percussion?: string;
  }[];
  melody: number[];
  description: string;
  masteryXp: number;
  isMastered: boolean;
}

export type EnsembleTier = 'solo' | 'duet' | 'trio' | 'quartet' | 'chamber' | 'orchestra' | 'symphony';

export interface Ensemble {
  name: string;
  tier: EnsembleTier;
  members: Musician[];
  activePiece: RepertoirePiece | null;
  reputationStars: number;
  fameLevel: number;
}

export interface PracticeNote {
  targetTime: number; // in seconds relative to drill start
  lane: number;       // 0 to 3
  pitch: number;      // frequency or midi note
  hit?: boolean;
  missed?: boolean;
  accuracy?: 'perfect' | 'great' | 'good' | 'miss';
}

export interface PracticeSession {
  type: 'metronome' | 'scale_run' | 'tone_shaping';
  tier: number;
  instrumentId: InstrumentId;
  duration: number;
  elapsedTime: number;
  bpm: number;
  notes: PracticeNote[];
  score: number;
  combo: number;
  maxCombo: number;
  feedbackText: string;
  feedbackTimer: number;
  completed: boolean;
  statGained: { stat: keyof MusicianStats; amount: number } | null;
}

export interface BattleMove {
  id: string;
  name: string;
  section: InstrumentSection | 'all';
  power: number;
  harmonyCost: number;
  effect: 'resonance_boost' | 'tempo_lock' | 'vibrato_charm' | 'fortissimo_burst' | 'pianissimo_shield' | 'fortissimo_surge';
  description: string;
}

export interface AuditionBattle {
  opponent: Musician;
  playerHarmonyMeter: number; // 0 to 100
  opponentHarmonyMeter: number; // 0 to 100
  harmonyPoints: number;      // Resource for moves (0 to 100)
  maxHarmonyPoints: number;
  playerStance: 'normal' | 'pianissimo_shield' | 'fortissimo_surge';
  opponentStance: 'normal' | 'crescendo' | 'counterpoint_guard';
  turn: 'player' | 'opponent';
  turnTimer: number;
  cadencePromptActive: boolean;
  log: string[];
  selectedMoveIndex: number;
  concluded: boolean;
  won?: boolean;
}

export interface RivalEnsemble {
  id: string;
  name: string;
  tier: EnsembleTier;
  conductorName: string;
  members: Musician[];
  piece: RepertoirePiece;
  reputationRequired: number;
  rewardStars: number;
  description: string;
}

export interface ConcertCompetition {
  rival: RivalEnsemble;
  playerPiece: RepertoirePiece;
  playerScore: number;
  rivalScore: number;
  audienceApplause: number; // 0 to 100
  currentMeasure: number;
  totalMeasures: number;
  isPlaying: boolean;
  concluded: boolean;
  won?: boolean;
  rewardsGiven?: boolean;
  // Dynamic Rhythmic Cadence Challenge
  sweetSpotCenter: number; // 0.2 to 0.8
  sweetSpotWidth: number;  // 0.16
  lastFeedback?: 'PERFECT' | 'GREAT' | 'OK' | 'MISS';
  lastFeedbackText?: string;
  comboStreak: number;
}

export type ZoneId = 
  | 'cavatina_village' 
  | 'woodwind_woods' 
  | 'brass_citadel' 
  | 'percussion_peaks' 
  | 'grand_hall'
  | 'west_wilderness'
  | 'east_wilderness'
  | 'north_wilderness'
  | 'south_wilderness';

export interface FestivalEvent {
  id: string;
  name: string;
  seasonDay: string;
  zone: ZoneId;
  venueName: string;
  tierRequirement: EnsembleTier;
  statRequirements: {
    minEffectiveSkill?: number;
    requiredSection?: InstrumentSection;
    minTempoStability?: number;
    minSightReading?: number;
    requiredBadges?: number;
  };
  entryFeeGold: number;
  rewardGold: number;
  rewardSparks: number;
  rewardStars: number;
  rewardBadgeId?: string;
  description: string;
  rivalMusician: Musician;
}

export interface PlayerWallet {
  gold: number;             // Notes / Acoustic Gold (♪)
  inspirationSparks: number;// Harmonic Resonance (✨)
  reputationStars: number;  // Prestige (★)
}

export interface InstrumentArtifact {
  id: string;
  name: string;
  section: InstrumentSection;
  tier: number; // 1 to 5
  bonusTechnique: number;
  bonusTone: number;
  bonusTempo: number;
  traitName: string;
  traitDescription: string;
  costGold: number;
  costSparks: number;
  equipped: boolean;
}

export interface LostScore {
  id: string;
  title: string;
  composer: string;
  fragmentsFound: number;
  totalFragments: number;
  unlocked: boolean;
  pieceId: string;
}

export interface InspirationVista {
  id: string;
  name: string;
  zone: ZoneId;
  x: number;
  y: number;
  description: string;
  statReward: keyof MusicianStats;
  statAmount: number;
  visited: boolean;
}

export interface PerformanceVenue {
  id: string;
  name: string;
  zone: ZoneId;
  type: 'gazebo' | 'cafe' | 'lounge' | 'salon' | 'concert_hall';
  baseGoldReward: number;
  reputationRequirement: number;
  acousticProfile: string;
}

export type QuestType = 'main' | 'side' | 'gig' | 'rescue' | 'restoration';

export interface GameQuest {
  id: string;
  title: string;
  chapter: number;
  type: QuestType;
  description: string;
  objective: string;
  rewardGold: number;
  rewardSparks: number;
  rewardStars: number;
  completed: boolean;
}

export interface WorldObstacle {
  type: 'box' | 'circle' | 'building' | 'gate' | 'arch';
  x: number;
  y: number;
  w?: number;
  h?: number;
  radius?: number;
  name?: string;
  buildingType?: 'academy' | 'forge' | 'library' | 'tavern' | 'cottage' | 'clocktower' | 'gate' | 'wall' | 'bridge' | 'arch';
  signIcon?: string;
  roofColor?: string;
}

export interface ZoneTransition {
  id: string;
  targetZone: ZoneId;
  targetSpawn: { x: number; y: number; dir: 'up' | 'down' | 'left' | 'right' };
  bounds: { x: number; y: number; w: number; h: number };
  promptText: string;
}

export interface WorldZone {
  id: ZoneId;
  name: string;
  subtitle: string;
  width: number;
  height: number;
  ambientBgm: string;
  themeColor: string;
  defaultSpawn: { x: number; y: number; dir: 'up' | 'down' | 'left' | 'right' };
  transitions: ZoneTransition[];
  obstacles: WorldObstacle[];
}

export interface HarmoniDexEntry {
  id: string;
  species: string;
  name: string;
  section: InstrumentSection;
  instrumentId: InstrumentId;
  instrumentName: string;
  sprite: string;
  description: string;
  discovered: boolean;
  bonded: boolean;
  evolutionStage: 1 | 2 | 3;
  evolvesTo?: string;
  evolutionLevel?: number;
}

export interface ClefBadge {
  id: string;
  name: string;
  icon: string;
  section: InstrumentSection | 'all';
  conservatory: string;
  maestroName: string;
  obtained: boolean;
}

export interface HarmonizeEncounter {
  pet: Harmonipet;
  instrumentId: InstrumentId;
  targetMelody: number[];
  targetNoteIndices: number[];
  currentStep: number;
  playerInputs: number[];
  resonanceMeter: number;
  catchThreshold: number;
  attemptsRemaining: number;
  lastFeedback?: 'PERFECT' | 'DISSONANCE';
  lastFeedbackText?: string;
  concluded: boolean;
  caught: boolean;
}

export interface WorldNPC {
  id: string;
  name: string;
  title: string;
  x: number;
  y: number;
  zone: ZoneId;
  musicianData?: Musician;
  isProp?: boolean;
  propType?: 'lectern' | 'vanity' | 'music_stand' | 'signpost' | 'fountain' | 'anvil' | 'ancient_stone_stand' | 'golden_music_stand' | 'vista_monolith' | 'road_sign' | 'door_trigger';
  actionType: 'talk' | 'audition_battle' | 'practice_bench' | 'competition_stage' | 'sheet_music_stand' | 'inspiration_vista' | 'luthier_shop' | 'wild_harmonipet' | 'conservatory_master' | 'theory_bench' | 'customization_mirror' | 'signpost';
  dialogue: string[];
  sheetMusicReward?: string; // piece ID
  vistaId?: string;
  badgeId?: string;
  wildPetData?: Harmonipet;
  rivalId?: string;
  theoryType?: TheoryChallengeType;
  questId?: string;
}

export interface GameDialogue {
  speaker: string;
  avatar: string;
  text: string[];
  index: number;
  onComplete?: () => void;
}

export interface PlayerCustomization {
  outfitColor: string;
  hairColor: string;
  hatStyle: 'beret' | 'feather_cap' | 'maestro' | 'headband' | 'none';
  instrumentFinish: 'classic_amber' | 'gilded_gold' | 'midnight_obsidian' | 'rosewood';
  petTint: string;
}

export type TheoryChallengeType = 
  | 'pitch_recognition_1' 
  | 'key_signatures_1' 
  | 'rhythm_meter_1'
  | 'intervals_ear_training'
  | 'triads_chords'
  | 'advanced_keys_circle'
  | 'tempo_dynamics_terms'
  | 'orchestral_acoustics';

export interface TheoryQuestion {
  prompt: string;
  subtext: string;
  notesToPlay?: number[];
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface TheoryChallenge {
  type: TheoryChallengeType;
  title: string;
  tier: number;
  questions: TheoryQuestion[];
  currentQuestionIndex: number;
  score: number;
  rewardSparks: number;
  rewardSightReading: number;
  completed: boolean;
}

export type GameMode = 
  | 'character_customization' 
  | 'exploration' 
  | 'practice' 
  | 'theory_challenge'
  | 'audition_battle' 
  | 'competition' 
  | 'dialogue' 
  | 'repertoire_menu'
  | 'luthier_menu'
  | 'quest_menu'
  | 'harmonize_wild'
  | 'dex_menu'
  | 'badge_menu';

export interface GameState {
  mode: GameMode;
  currentZone: ZoneId;
  player: {
    x: number;
    y: number;
    dir: 'up' | 'down' | 'left' | 'right';
    isMoving: boolean;
  };
  customization: PlayerCustomization;
  followerTrail: { x: number; y: number }[];
  camera: { x: number; y: number };
  ensemble: Ensemble;
  recruitedMusicians: Musician[];
  ensembleBox: Musician[]; // PC Storage Box for non-active party members
  harmoniDex: HarmoniDexEntry[]; // The 16+ creature encyclopedia
  badges: ClefBadge[]; // The 8 Conservatory Badges
  repertoire: RepertoirePiece[];
  discoveredZones: Record<ZoneId, boolean>;
  npcs: WorldNPC[];
  nearbyInteractable: WorldNPC | null;
  wallet: PlayerWallet;
  artifacts: InstrumentArtifact[];
  lostScores: LostScore[];
  vistas: InspirationVista[];
  quests: GameQuest[];
  activeQuestId: string | null;
  questInventory: string[]; // e.g. 'brass_music_box_pins'
  proficiency: PlayerProficiency;
  practiceLevel: number;
  theoryLevel: number;
  completedTheoryDrills: string[];
  practiceSession: PracticeSession | null;
  theoryChallenge: TheoryChallenge | null;
  auditionBattle: AuditionBattle | null;
  harmonizeEncounter: HarmonizeEncounter | null;
  competition: ConcertCompetition | null;
  calendarEvents: FestivalEvent[];
  completedEvents: string[]; // event IDs
  dialogue: GameDialogue | null;
  time: number;
}
