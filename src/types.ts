export type GameMode = 
  | 'intro'
  | 'exploration'
  | 'audio_match_scan'
  | 'dialogue'
  | 'battle'
  | 'cleansing_cinematic'
  | 'victory';

export type GenreType = 'synth' | 'bass' | 'brass' | 'static' | 'cosmic';
export type AudioChallengeType = 'waveform_slider' | 'call_response' | 'rhythm_pulse';

export interface Move {
  id: string;
  name: string;
  type: GenreType;
  power: number;
  cost: number;
  description: string;
  soundType: 'arpeggio' | 'bass_drop' | 'brass_riff' | 'glitch_hit' | 'cosmic_burst';
  effectiveness?: string;
}

export interface StreamSpirit {
  id: string;
  name: string;
  title: string;
  vibeTag: string;
  species: string;
  instrument: string;
  avatar?: string;
  type: GenreType;
  color: string;
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
  sprite: 'aria' | 'dj_otter' | 'jax' | 'glitch_gate';
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

export interface BattleState {
  type: 'rival' | 'boss';
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

export interface GameState {
  mode: GameMode;
  zoneClean: boolean;
  player: PlayerPosition;
  npcs: NPCEntity[];
  soundRipples: SoundRipple[];
  activeCompanion: string | null;
  streamQueue: StreamSpirit[];
  activeSpiritIndex: number;
  nearbyInteractable: NPCEntity | SoundRipple | null;
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
