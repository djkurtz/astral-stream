export type GameMode = 
  | 'intro'
  | 'tuning_tutorial'
  | 'exploration'
  | 'dialogue'
  | 'battle'
  | 'cleansing_cinematic'
  | 'victory';

export interface Move {
  id: string;
  name: string;
  type: 'synth' | 'bass' | 'brass' | 'static' | 'cosmic';
  power: number;
  cost: number; // Harmonic Energy (HE)
  description: string;
  soundType: 'arpeggio' | 'bass_drop' | 'brass_riff' | 'glitch_hit' | 'cosmic_burst';
}

export interface StreamSpirit {
  id: string;
  name: string;
  title: string;
  frequency: number; // e.g. 98.0
  species: string;
  instrument: string;
  avatar: string; // pixel sprite identifier
  color: string;
  hp: number;
  maxHp: number;
  energy: number; // 0 to 100 HE
  attack: number;
  defense: number;
  speed: number;
  moves: Move[];
  isFused?: boolean;
}

export interface RivalCharacter {
  id: string;
  name: string;
  title: string;
  tagline: string;
  avatar: string;
  color: string;
  dialogueGreet: string[];
  dialogueDefeat: string[];
  spirit: StreamSpirit;
}

export interface BossEntity {
  id: string;
  name: string;
  title: string;
  styleAnomaly: 'crt_static' | 'monochrome_ink' | 'wireframe';
  avatar: string;
  hp: number;
  maxHp: number;
  attack: number;
  moves: Move[];
  glitchIntensity: number; // 0 to 1
}

export interface BattleState {
  type: 'rival' | 'boss';
  playerSpirit: StreamSpirit;
  enemySpirit?: StreamSpirit;
  enemyBoss?: BossEntity;
  turn: 'player' | 'enemy' | 'animating';
  selectedMoveIndex: number;
  log: string;
  canFuse: boolean;
  fusionActive: boolean;
}

export interface TuningState {
  targetFrequency: number;
  currentFrequency: number;
  tolerance: number;
  isLocked: boolean;
  spiritToUnlock: StreamSpirit;
}

export interface GameState {
  mode: GameMode;
  zoneClean: boolean;
  activeCompanion: RivalCharacter | null;
  streamQueue: StreamSpirit[]; // Collected spirits
  activeSpiritIndex: number;
  tuning: TuningState | null;
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
  cleansingProgress: number; // 0 to 1
}
