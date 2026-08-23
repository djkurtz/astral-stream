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

export type EnsembleTier = 'solo' | 'duet' | 'trio' | 'quartet' | 'chamber' | 'orchestra';

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
  section: InstrumentSection;
  power: number;
  harmonyCost: number;
  effect: 'resonance_boost' | 'tempo_lock' | 'vibrato_charm' | 'fortissimo_burst';
  description: string;
}

export interface AuditionBattle {
  opponent: Musician;
  playerHarmonyMeter: number; // 0 to 100
  opponentHarmonyMeter: number; // 0 to 100
  harmonyPoints: number;      // Resource for moves (0 to 100)
  maxHarmonyPoints: number;
  turn: 'player' | 'opponent';
  turnTimer: number;
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
}

export type ZoneId = 
  | 'cavatina_village' 
  | 'woodwind_woods' 
  | 'brass_citadel' 
  | 'percussion_peaks' 
  | 'grand_hall';

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
  type: 'box' | 'circle';
  x: number;
  y: number;
  w?: number;
  h?: number;
  radius?: number;
  name?: string;
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

export interface WorldNPC {
  id: string;
  name: string;
  title: string;
  x: number;
  y: number;
  zone: ZoneId;
  musicianData?: Musician;
  actionType: 'talk' | 'audition_battle' | 'practice_bench' | 'competition_stage' | 'sheet_music_stand' | 'inspiration_vista' | 'luthier_shop';
  dialogue: string[];
  sheetMusicReward?: string; // piece ID
  vistaId?: string;
}

export interface GameDialogue {
  speaker: string;
  avatar: string;
  text: string[];
  index: number;
  onComplete?: () => void;
}

export type GameMode = 
  | 'character_customization' 
  | 'exploration' 
  | 'practice' 
  | 'audition_battle' 
  | 'competition' 
  | 'dialogue' 
  | 'repertoire_menu'
  | 'luthier_menu'
  | 'quest_menu';

export interface GameState {
  mode: GameMode;
  currentZone: ZoneId;
  player: {
    x: number;
    y: number;
    dir: 'up' | 'down' | 'left' | 'right';
    isMoving: boolean;
  };
  followerTrail: { x: number; y: number }[];
  camera: { x: number; y: number };
  ensemble: Ensemble;
  recruitedMusicians: Musician[];
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
  practiceSession: PracticeSession | null;
  auditionBattle: AuditionBattle | null;
  competition: ConcertCompetition | null;
  dialogue: GameDialogue | null;
  time: number;
}
