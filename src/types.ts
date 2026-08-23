export type GameMode = 
  | 'intro'
  | 'audio_match_scan'
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
  cost: number;
  description: string;
  soundType: 'arpeggio' | 'bass_drop' | 'brass_riff' | 'glitch_hit' | 'cosmic_burst';
}

export interface StreamSpirit {
  id: string;
  name: string;
  title: string;
  vibeTag: string; // e.g. '#ChiptuneSynth'
  species: string;
  instrument: string;
  avatar: string;
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
  glitchIntensity: number;
}

export interface BattleState {
  type: 'rival' | 'boss';
  playerSpirit: StreamSpirit;
  enemySpirit?: StreamSpirit;
  enemyBoss?: BossEntity;
  turn: 'player' | 'enemy' | 'animating';
  selectedMoveIndex: number;
  log: string;
  canBlend: boolean;
  blendActive: boolean;
}

export interface AudioMatchState {
  targetWaveformSync: number; // 0 to 100
  currentSync: number;
  scanPulses: number;
  isMatched: boolean;
  spiritToUnlock: StreamSpirit;
}

export interface GameState {
  mode: GameMode;
  zoneClean: boolean;
  activeCompanion: RivalCharacter | null;
  streamQueue: StreamSpirit[];
  activeSpiritIndex: number;
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
