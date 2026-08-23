export type ResourceType = 'energy' | 'minerals' | 'alloys' | 'science';

export interface Resources {
  energy: number;
  minerals: number;
  alloys: number;
  science: number;
}

export type CelestialType = 'star' | 'terrestrial' | 'moon' | 'station' | 'asteroid_field' | 'pirate_outpost';

export type BuildingType = 
  | 'solar_array' 
  | 'mineral_mine' 
  | 'alloy_foundry' 
  | 'research_lab' 
  | 'orbital_shipyard'
  | 'defense_turret';

export interface BuildingDef {
  type: BuildingType;
  name: string;
  description: string;
  baseCost: Partial<Resources>;
  costMultiplier: number;
  production: Partial<Resources>;
  energyConsumption: number;
}

export interface CelestialBody {
  id: string;
  name: string;
  type: CelestialType;
  radius: number;
  orbitRadius: number;
  orbitSpeed: number; // radians per second
  orbitAngle: number;
  color: string;
  detailsColor?: string;
  hasRings?: boolean;
  parentId?: string; // id of parent body if orbiting a planet/moon
  colonized: boolean;
  canColonize: boolean;
  buildings: Record<BuildingType, number>;
  maxBuildings: number;
  pirateThreat?: number; // 0-100
}

export type ShipType = 'scout' | 'mining_drone' | 'corvette' | 'frigate';

export interface ShipDef {
  type: ShipType;
  name: string;
  cost: Partial<Resources>;
  buildTime: number; // in seconds
  hull: number;
  attack: number;
  speed: number;
  description: string;
}

export interface Ship {
  id: string;
  name: string;
  type: ShipType;
  hull: number;
  maxHull: number;
  attack: number;
  speed: number;
  locationId: string;
  destinationId?: string;
  travelProgress: number; // 0 to 1
  state: 'idle' | 'traveling' | 'mining' | 'patrolling' | 'combat';
}

export interface BuildTask {
  id: string;
  targetId: string; // CelestialBody id
  kind: 'building' | 'ship';
  typeId: string;
  progress: number;
  totalTime: number;
  name: string;
}

export interface LogMessage {
  id: string;
  text: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  time: string;
}

export interface GameState {
  time: number;
  speed: number;
  paused: boolean;
  resources: Resources;
  resourceRates: Resources;
  bodies: CelestialBody[];
  ships: Ship[];
  buildQueue: BuildTask[];
  logs: LogMessage[];
  selectedBodyId: string;
}
