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
}

export interface NPCEntity {
  id: string;
  name: string;
  title: string;
  x: number;
  y: number;
  sprite: 'aria' | 'dj_otter' | 'jax' | 'maestro_owl' | 'glitch_gate' | 'pelican' | 'spark' | 'lyra';
  color: string;
  dialogue: string[];
  actionType?: 'talk' | 'battle_jax' | 'audio_match';
}

export interface SoundRipple {
  id: string;
  x: number;
  y: number;
  challengeType: AudioChallengeType;
  spirit: StreamSpirit;
  discovered: boolean;
}

export interface WildGlitchEntity {
  id: string;
  name: string;
  x: number;
  y: number;
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
  challengeType: AudioChallengeType;
  spiritToUnlock: StreamSpirit;
  isComplete: boolean;

  // Challenge 1: Waveform Alignment
  targetFreq: number;
  playerFreq: number;
  holdTime: number;

  // Challenge 2: Call & Response Melody Mimic
  melodySequence: number[];
  playerSequence: number[];
  activeDemoNote: number | null;
  isListeningToPlayer: boolean;

  // Challenge 3: Rhythm Pulse Ring
  pulseRadius: number;
  targetRadius: number;
  combo: number;
  feedback: string | null;
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

export interface GameState {
  mode: GameMode;
  questStage: 'intro' | 'seek_traditions' | 'ruins_clearing' | 'ridge_breach' | 'gate_ready' | 'cleansed';
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
}
