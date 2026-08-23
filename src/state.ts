import { BUILDING_DEFS, INITIAL_BODIES } from './data';
import { BuildingType, GameState, LogMessage, Resources } from './types';

const STORAGE_KEY = 'astra_imperium_save_v1';

export function createInitialState(): GameState {
  return {
    time: 0,
    speed: 1,
    paused: false,
    resources: {
      energy: 100,
      minerals: 250,
      alloys: 80,
      science: 20
    },
    resourceRates: {
      energy: 0,
      minerals: 0,
      alloys: 0,
      science: 0
    },
    bodies: JSON.parse(JSON.stringify(INITIAL_BODIES)),
    ships: [
      {
        id: 'ship_init_1',
        name: 'Vanguard Alpha',
        type: 'scout',
        hull: 50,
        maxHull: 50,
        attack: 5,
        speed: 120,
        locationId: 'terra',
        travelProgress: 0,
        state: 'idle'
      }
    ],
    buildQueue: [],
    logs: [
      {
        id: '1',
        text: 'Colony Command Online. Solar arrays and mining operations active on Nova Terra.',
        type: 'info',
        time: '00:00'
      }
    ],
    selectedBodyId: 'terra',
    tutorial: {
      stepIndex: 0,
      completed: false,
      active: true,
      rewardClaimed: false
    }
  };
}

export function calculateBuildingCost(type: BuildingType, currentLevel: number): Partial<Resources> {
  const def = BUILDING_DEFS[type];
  const mult = Math.pow(def.costMultiplier, currentLevel);
  const cost: Partial<Resources> = {};
  for (const [res, val] of Object.entries(def.baseCost)) {
    cost[res as keyof Resources] = Math.round((val || 0) * mult);
  }
  return cost;
}

export function canAfford(resources: Resources, cost: Partial<Resources>): boolean {
  for (const [res, val] of Object.entries(cost)) {
    if ((resources[res as keyof Resources] || 0) < (val || 0)) {
      return false;
    }
  }
  return true;
}

export function deductResources(resources: Resources, cost: Partial<Resources>): void {
  for (const [res, val] of Object.entries(cost)) {
    resources[res as keyof Resources] = Math.max(0, (resources[res as keyof Resources] || 0) - (val || 0));
  }
}

export function addLog(state: GameState, text: string, type: LogMessage['type'] = 'info'): void {
  const mins = Math.floor(state.time / 60).toString().padStart(2, '0');
  const secs = Math.floor(state.time % 60).toString().padStart(2, '0');
  state.logs.unshift({
    id: Math.random().toString(36).substring(2, 9),
    text,
    type,
    time: `${mins}:${secs}`
  });
  if (state.logs.length > 50) {
    state.logs.pop();
  }
}

export function calculateRates(state: GameState): Resources {
  const rates: Resources = { energy: 0, minerals: 0, alloys: 0, science: 0 };
  
  for (const body of state.bodies) {
    if (!body.colonized) continue;
    for (const [bType, count] of Object.entries(body.buildings)) {
      if (count <= 0) continue;
      const def = BUILDING_DEFS[bType as BuildingType];
      if (!def) continue;

      rates.energy -= def.energyConsumption * count;
      if (def.production.energy) rates.energy += def.production.energy * count;
      if (def.production.minerals) rates.minerals += def.production.minerals * count;
      if (def.production.alloys) rates.alloys += def.production.alloys * count;
      if (def.production.science) rates.science += def.production.science * count;
    }
  }

  // Passive mining drone bonus
  const miningDrones = state.ships.filter(s => s.type === 'mining_drone' && s.state === 'mining');
  rates.minerals += miningDrones.length * 4;

  return rates;
}

export function grantResources(resources: Resources, reward: Partial<Resources>): void {
  for (const [res, val] of Object.entries(reward)) {
    resources[res as keyof Resources] = (resources[res as keyof Resources] || 0) + (val || 0);
  }
}

export function saveGame(state: GameState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    addLog(state, 'Game state saved to local storage.', 'success');
  } catch (e) {
    console.error('Failed to save game', e);
  }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const state = JSON.parse(raw);
      if (!state.tutorial) {
        state.tutorial = {
          stepIndex: 0,
          completed: false,
          active: true,
          rewardClaimed: false
        };
      }
      return state;
    }
  } catch (e) {
    console.error('Failed to load save', e);
  }
  return null;
}
