import { GameState, Resources } from './types';

export interface TutorialStep {
  id: string;
  badge: string;
  title: string;
  description: string;
  instruction: string;
  hint: string;
  highlightTab?: string;
  reward: Partial<Resources>;
  isComplete: (state: GameState) => boolean;
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 'select_terra',
    badge: 'MISSION 1',
    title: 'Planetary Command',
    description: 'Welcome Commander! Every great empire begins with a capital world.',
    instruction: 'Click on your home capital Nova Terra on the tactical star map.',
    hint: 'You can drag to pan around space and use the mouse wheel to zoom.',
    reward: { minerals: 50, energy: 50 },
    isComplete: (state: GameState) => state.selectedBodyId === 'terra'
  },
  {
    id: 'build_solar',
    badge: 'MISSION 2',
    title: 'Powering the Colony',
    description: 'Colony structures consume power. If energy turns negative, your mines and foundries stall.',
    instruction: 'Switch to the "Base / Colony" tab and construct a new Solar Generator Matrix or upgrade an existing one.',
    hint: 'Select Nova Terra, click the Base / Colony tab on the right, and click "Construct" or "Upgrade".',
    highlightTab: 'base',
    reward: { minerals: 100, alloys: 40 },
    isComplete: (state: GameState) => {
      const terra = state.bodies.find(b => b.id === 'terra');
      const solarList = terra && Array.isArray(terra.buildings) ? terra.buildings.filter(b => b.type === 'solar_array') : [];
      const hasUpgrade = solarList.some(b => b.level >= 2);
      const inQueue = state.buildQueue.some(q => q.targetId === 'terra' && q.typeId === 'solar_array');
      return solarList.length >= 3 || hasUpgrade || inQueue;
    }
  },
  {
    id: 'build_mine',
    badge: 'MISSION 3',
    title: 'Raw Materials',
    description: 'Raw minerals are processed into alloys and fuel all orbital engineering.',
    instruction: 'In the Base / Colony tab on Nova Terra, upgrade an active Sub-surface Mining Rig or construct a new one.',
    hint: 'Click "Upgrade to Level 2" on an active Mining Rig.',
    highlightTab: 'base',
    reward: { alloys: 60, energy: 50 },
    isComplete: (state: GameState) => {
      const terra = state.bodies.find(b => b.id === 'terra');
      const mineList = terra && Array.isArray(terra.buildings) ? terra.buildings.filter(b => b.type === 'mineral_mine') : [];
      const hasUpgrade = mineList.some(b => b.level >= 2);
      const inQueue = state.buildQueue.some(q => q.targetId === 'terra' && q.typeId === 'mineral_mine');
      return mineList.length >= 3 || hasUpgrade || inQueue;
    }
  },
  {
    id: 'build_ship',
    badge: 'MISSION 4',
    title: 'Starship Assembly',
    description: 'Your capital has an Orbital Shipyard ready to commission robotic harvesters and warships.',
    instruction: 'Open the "Shipyard" tab and commission a Prospector Harvester drone.',
    hint: 'Click the Shipyard tab, then click "Commission Ship" on the Prospector Harvester.',
    highlightTab: 'shipyard',
    reward: { science: 40, minerals: 100 },
    isComplete: (state: GameState) => {
      return state.ships.some(s => s.type === 'mining_drone') || 
             state.buildQueue.some(q => q.typeId === 'mining_drone');
    }
  },
  {
    id: 'dispatch_miner',
    badge: 'MISSION 5',
    title: 'Asteroid Prospecting',
    description: 'The Cerberus Asteroid Belt is rich in dense mineral veins. Automated drones can harvest it.',
    instruction: 'Open the "Fleets" tab, select "Cerberus Asteroid Belt" in the dropdown, and click "Dispatch".',
    hint: 'Watch your drone fly across the system and initiate automated extraction.',
    highlightTab: 'fleet',
    reward: { alloys: 100, science: 50 },
    isComplete: (state: GameState) => {
      return state.ships.some(s => 
        s.type === 'mining_drone' && 
        (s.destinationId === 'cerberus_belt' || s.locationId === 'cerberus_belt')
      );
    }
  },
  {
    id: 'colonize_ares',
    badge: 'MISSION 6',
    title: 'Imperial Expansion',
    description: 'Our sensors indicate Ares Outpost has viable atmosphere for human habitation.',
    instruction: 'Click on Ares Outpost on the map, open the "Overview" tab, and click "Establish Colony Base".',
    hint: 'Establishing a colony requires 100 Minerals, 50 Alloys, and 30 Energy.',
    highlightTab: 'sector',
    reward: { energy: 200, minerals: 300, alloys: 150, science: 100 },
    isComplete: (state: GameState) => {
      const ares = state.bodies.find(b => b.id === 'ares');
      return ares?.colonized === true;
    }
  }
];
