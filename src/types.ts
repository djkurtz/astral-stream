export type GameMode = 
  | 'intro'
  | 'exploration'
  | 'audio_match_scan'
  | 'dialogue'
  | 'battle'
  | 'cleansing_cinematic'
  | 'victory';

export type GenreType = 
  | 'symphonic'   // Classical, Baroque, Romantic Orchestral (Violin, Cello, Piano)
  | 'global'       // Global traditions: Sitar, Kora, Flamenco, Gamelan, Steelpan
  | 'jazz'         // Jazz, Blues, Bebop, Big Band Brass (Saxophone, Trumpet)
  | 'synth'        // Chiptune, Synthwave, Electronic Pop
  | 'bass'         // Funk, Rock, Overdrive Bass, 808
  | 'static'       // Rogue Noise, Analog Desync
  | 'cosmic';      // Omnigenre Fusion Mashup

export type AudioChallengeType = 'waveform_slider' | 'call_response' | 'rhythm_pulse';

export type ZoneId = 
  | 'plaza'
  | 'beach'
  | 'sangeet'
  | 'bamboo'
  | 'ruins'
  | 'ridge'
  | 'cafe'
  | 'vinyl_den';

export interface Move {
  id: string;
  name: string;
  type: GenreType;
  power: number;
  cost: number;
  description: string;
  soundType: 'arpeggio' | 'bass_drop' | 'brass_riff' | 'glitch_hit' | 'cosmic_burst' | 'violin_staccato' | 'sitar_twang' | 'taiko_boom';
  effectiveness?: string;
}

export interface StreamSpirit {
  id: string;
  name: string;
  title: string;
  vibeTag: string;
  species: string;
  instrument: string;
  avatar: string;
  originTradition: string; // e.g. "European Classical", "Indian Classical", "West African", "Caribbean", "Japanese Matsuri"
  type: GenreType;
  color: string;
  level: number;
  xp: number;
  maxXp: number;
  hp: number;
  maxHp: number;
  energy: number;
  attack: number;
  defense: number;
  speed: number;
  moves: Move[];
  isFused?: boolean;
  harmonicEnrichment?: number;
  isEvolved?: boolean;
}

export interface NPCEntity {
  id: string;
  name: string;
  title: string;
  x: number;
  y: number;
  sprite: 'aria' | 'dj_otter' | 'jax' | 'maestro_owl' | 'glitch_gate' | 'pelican' | 'spark' | 'lyra' | 'maya' | 'leo' | 'ravi' | 'door_cafe' | 'door_vinyl' | 'puzzle_beacon' | 'puzzle_torii' | 'puzzle_obelisk' | 'puzzle_switch' | 'prop_mirror';
  color: string;
  dialogue: string[];
  dialoguePostAlert?: string[];
  actionType?: 'talk' | 'battle_jax' | 'audio_match' | 'enter_building' | 'exit_building' | 'order_coffee' | 'browse_shop' | 'customize' | 'challenge_linear1' | 'challenge_linear2' | 'challenge_side';
  zone?: ZoneId;
  interior?: 'cafe' | 'vinyl_den';
  pet?: {
    name: string;
    species: string;
    sprite: 'bird' | 'pup' | 'fawn' | 'gull' | 'moth';
    instrument: string;
  };
}

export interface MusicalShrine {
  id: string;
  name: string;
  tradition: string;
  biome: string;
  zone?: ZoneId;
  x: number;
  y: number;
  challengeType: AudioChallengeType;
  spirit: StreamSpirit;
  discovered: boolean;
}

export type SoundRipple = MusicalShrine;

export interface WildGlitchEntity {
  id: string;
  name: string;
  x: number;
  y: number;
  zone?: ZoneId;
  spirit: StreamSpirit;
  defeated: boolean;
  spawnOrigin?: { x: number; y: number; radius: number };
  isAlerted?: boolean;
  wanderTimer?: number;
  wanderTarget?: { x: number; y: number };
  respawnTimer?: number;
}

export interface CollectibleItem {
  id: string;
  name: string;
  icon: string;
  x: number;
  y: number;
  zone?: ZoneId;
  type: 'tuning_fork' | 'golden_vinyl' | 'energy_battery' | 'frequency_crystal';
  description: string;
  effect: string;
  collected: boolean;
}

export interface BattleState {
  type: 'wild' | 'rival' | 'boss';
  playerSpirit: StreamSpirit;
  enemySpirit?: StreamSpirit;
  enemyBoss?: {
    id: string;
    name: string;
    title: string;
    avatar: string;
    type: GenreType;
    hp: number;
    maxHp: number;
    attack: number;
    moves: Move[];
    glitchIntensity: number;
  };
  turn: 'player' | 'rhythm_timing' | 'enemy' | 'animating';
  pendingMoveIndex: number | null;
  rhythmCursor: number;
  rhythmSpeed: number;
  targetWindowStart: number;
  targetWindowEnd: number;
  rhythmResult: 'PERFECT' | 'GREAT' | 'MISS' | null;
  log: string;
  canBlend: boolean;
  blendActive: boolean;
}

export interface AudioMatchState {
  stage: 1 | 2 | 3;
  spiritToUnlock: StreamSpirit;
  isComplete: boolean;
  targetFreq: number;
  playerFreq: number;
  holdTime: number;
  melodySequence: number[];
  playerSequence: number[];
  activeDemoNote: number | null;
  isListeningToPlayer: boolean;
  pulseRadius: number;
  targetRadius: number;
  combo: number;
  feedback: string | null;
  challengeType?: AudioChallengeType;
}

export interface PlayerPosition {
  x: number;
  y: number;
  dir: 'up' | 'down' | 'left' | 'right';
  isMoving: boolean;
}

export interface BoxObstacle {
  type: 'box';
  x: number;
  y: number;
  w: number;
  h: number;
  name?: string;
}

export interface CircleObstacle {
  type: 'circle';
  x: number;
  y: number;
  radius: number;
  name?: string;
}

export interface WaterBoundary {
  type: 'water';
  direction: 'south' | 'west';
  value: number;
  name?: string;
}

export type WorldObstacle = BoxObstacle | CircleObstacle | WaterBoundary;

// --- Zone System ---
export interface ZoneTransitionTrigger {
  id: string;
  targetZone: ZoneId;
  targetSpawn: { x: number; y: number; dir?: 'up' | 'down' | 'left' | 'right' };
  bounds: { x: number; y: number; w: number; h: number };
  promptText?: string;
}

export interface ZoneMapConfig {
  id: ZoneId;
  name: string;
  subtitle: string;
  width: number;
  height: number;
  ambientTrack: 'town' | 'beach' | 'sangeet' | 'bamboo' | 'ruins' | 'ridge' | 'cafe' | 'vinyl_den';
  themeColor: string;
  transitions: ZoneTransitionTrigger[];
  obstacles: WorldObstacle[];
  defaultSpawn: { x: number; y: number; dir: 'up' | 'down' | 'left' | 'right' };
}

export interface TransitionState {
  fromZone: ZoneId;
  toZone: ZoneId;
  targetSpawn: { x: number; y: number; dir?: 'up' | 'down' | 'left' | 'right' };
  progress: number;
  duration: number;
  phase: 'fade_out' | 'fade_in';
}

// --- Customization Types ---
export type PlayerPaletteId = 'neon_cyan' | 'cyber_magenta' | 'sunset_gold' | 'emerald_synth' | 'lavender_dream';
export type CatPaletteId = 'classic_cyan' | 'synthwave_magenta' | 'vaporwave_lavender' | 'darkmode_neon';
export type AudioTimbrePreset = 'chiptune_square' | 'warm_saw' | 'fm_rhodes';

export interface PlayerPalette {
  id: PlayerPaletteId;
  name: string;
  jacketColor: string;
  headphoneColor: string;
  hairColor: string;
  vibeGlowColor: string;
}

export interface CatPalette {
  id: CatPaletteId;
  name: string;
  bodyColor: string;
  earColor: string;
  auraColor: string;
  keyColor: string;
  jackColor: string;
  tailColor: string;
}

export interface PlayerCustomization {
  title: string;
  paletteId: PlayerPaletteId;
  jacketColor: string;
  headphoneColor: string;
  hairColor: string;
  vibeGlowColor: string;
}

export interface ChimeCatCustomization {
  paletteId: CatPaletteId;
  bodyColor: string;
  earColor: string;
  auraColor: string;
  keyColor: string;
  jackColor: string;
  tailColor: string;
  timbrePreset: AudioTimbrePreset;
}

export interface GameState {
  mode: GameMode;
  questStage: 'intro' | 'seek_traditions' | 'ruins_clearing' | 'ridge_breach' | 'gate_ready' | 'cleansed';
  currentZone: ZoneId;
  transition: TransitionState | null;
  discoveredZones: Record<ZoneId, boolean>;
  camera: {
    x: number;
    y: number;
  };
  zoneClean: boolean;
  player: PlayerPosition;
  npcs: NPCEntity[];
  soundRipples: SoundRipple[];
  wildGlitches: WildGlitchEntity[];
  items: CollectibleItem[];
  inventory: string[];
  activeCompanion: string | null;
  followerTrail: Array<{ x: number; y: number }>;
  streamQueue: StreamSpirit[];
  activeSpiritIndex: number;
  nearbyInteractable: NPCEntity | SoundRipple | WildGlitchEntity | CollectibleItem | null;
  audioMatch: AudioMatchState | null;
  battle: BattleState | null;
  dialogue: {
    speaker: string;
    avatar: string;
    text: string[];
    index: number;
    onComplete?: () => void;
  } | null;
  time: number;
  glitchActive: boolean;
  cleansingProgress: number;
  currentInterior: 'cafe' | 'vinyl_den' | null;
  visitedCafe: boolean;
  zoneChallenges: Record<string, boolean>;
  playerCustomization: PlayerCustomization;
  chimeCatCustomization: ChimeCatCustomization;
  isCustomizing: boolean;
}
