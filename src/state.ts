import { BUILDING_DEFS, INITIAL_BODIES } from './data';
import { INITIAL_FACTIONS } from './factions';
import { BuildingType, GameState, LogMessage, Resources } from './types';

const STORAGE_KEY = 'astra_imperium_save_v1';

export function createInitialState(): GameState {
  return {
    time: 0,
    speed: 1,
    paused: false,
    era: 'planetary',
    hegemonyProgress: 0,
    factions: JSON.parse(JSON.stringify(INITIAL_FACTIONS)),
    resources: {
      energy: 120,
      minerals: 250,
      alloys: 80,
      science: 30
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
        text: 'Planetary Command Established. Nova Terra is shared by 4 sovereign races. Build trade and alliances to unite the world.',
        type: 'info',
        time: '00:00'
      }
    ],
    selectedBodyId: 'terra',
    viewMode: 'surface',
    tutorial: {
      stepIndex: 0,
      completed: false,
      active: true,
      rewardClaimed: false
    }
  };
}

export function calculateBuildingCost(type: BuildingType): Partial<Resources> {
  const def = BUILDING_DEFS[type];
  return { ...def.baseCost };
}

export function calculateUpgradeCost(type: BuildingType, currentLevel: number): Partial<Resources> {
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
    if (!body.colonized || !Array.isArray(body.buildings)) continue;
    for (const b of body.buildings) {
      const def = BUILDING_DEFS[b.type];
      if (!def) continue;

      const lvl = b.level || 1;
      rates.energy -= def.energyConsumption * lvl;
      if (def.production.energy) rates.energy += def.production.energy * lvl;
      if (def.production.minerals) rates.minerals += def.production.minerals * lvl;
      if (def.production.alloys) rates.alloys += def.production.alloys * lvl;
      if (def.production.science) rates.science += def.production.science * lvl;
    }
  }

  // Passive mining drone bonus
  const miningDrones = state.ships.filter(s => s.type === 'mining_drone' && s.state === 'mining');
  rates.minerals += miningDrones.length * 4;

  // Active Faction Trade Deals
  if (state.factions) {
    for (const faction of state.factions) {
      if (faction.tradeActive && faction.tradeDeal) {
        rates[faction.tradeDeal.giveResource] -= faction.tradeDeal.giveAmount;
        rates[faction.tradeDeal.getResource] += faction.tradeDeal.getAmount;
      }
    }
  }

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
      if (!state.viewMode) {
        state.viewMode = 'surface';
      }
      if (!state.era) {
        state.era = 'planetary';
      }
      if (!state.factions) {
        state.factions = JSON.parse(JSON.stringify(INITIAL_FACTIONS));
      }
      if (state.hegemonyProgress === undefined) {
        state.hegemonyProgress = 0;
      }
      if (state.bodies) {
        for (const b of state.bodies) {
          if (!Array.isArray(b.buildings)) {
            const oldObj = (b.buildings || {}) as Record<string, number>;
            const newArr = [];
            for (const [bType, count] of Object.entries(oldObj)) {
              for (let i = 0; i < count; i++) {
                newArr.push({
                  id: `b_${Math.random().toString(36).substring(2, 8)}`,
                  type: bType as any,
                  level: 1
                });
              }
            }
            b.buildings = newArr;
          }
        }
      }
      return state;
    }
  } catch (e) {
    console.error('Failed to load save', e);
  }
  return null;
}
