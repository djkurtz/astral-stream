import { BuildingDef, BuildingType, CelestialBody, ShipDef, ShipType } from './types';

export const BUILDING_DEFS: Record<BuildingType, BuildingDef> = {
  solar_array: {
    type: 'solar_array',
    name: 'Solar Generator Matrix',
    description: 'Harnesses stellar radiation to power colonies and orbital platforms.',
    baseCost: { minerals: 30 },
    costMultiplier: 1.35,
    production: { energy: 4 },
    energyConsumption: 0
  },
  mineral_mine: {
    type: 'mineral_mine',
    name: 'Sub-surface Mining Rig',
    description: 'Drills deep into planetary crust to extract raw silicates and heavy metals.',
    baseCost: { minerals: 50, energy: 10 },
    costMultiplier: 1.4,
    production: { minerals: 3 },
    energyConsumption: 1.5
  },
  alloy_foundry: {
    type: 'alloy_foundry',
    name: 'Plasma Alloy Foundry',
    description: 'Smelts raw minerals into high-durability spaceframe alloys.',
    baseCost: { minerals: 80, energy: 25 },
    costMultiplier: 1.5,
    production: { alloys: 1.5, minerals: -2 },
    energyConsumption: 2.5
  },
  research_lab: {
    type: 'research_lab',
    name: 'Astro-Physics Lab',
    description: 'Conducts deep-space surveys and develops cutting-edge technology.',
    baseCost: { minerals: 60, alloys: 20 },
    costMultiplier: 1.45,
    production: { science: 2 },
    energyConsumption: 2
  },
  orbital_shipyard: {
    type: 'orbital_shipyard',
    name: 'Orbital Shipyard',
    description: 'Gantry capable of assembling automated drones and military starships.',
    baseCost: { minerals: 150, alloys: 60, energy: 50 },
    costMultiplier: 1.8,
    production: {},
    energyConsumption: 4
  },
  defense_turret: {
    type: 'defense_turret',
    name: 'Point-Defense Battery',
    description: 'Automated railguns and laser arrays to repel hostile pirate incursions.',
    baseCost: { minerals: 75, alloys: 40 },
    costMultiplier: 1.5,
    production: {},
    energyConsumption: 2
  }
};

export const SHIP_DEFS: Record<ShipType, ShipDef> = {
  scout: {
    type: 'scout',
    name: 'Vanguard Scout Drone',
    description: 'Lightweight, rapid reconnaissance vessel. Scans unknown sectors.',
    cost: { minerals: 40, alloys: 15, energy: 10 },
    buildTime: 5,
    hull: 50,
    attack: 5,
    speed: 120
  },
  mining_drone: {
    type: 'mining_drone',
    name: 'Prospector Harvester',
    description: 'Automated drone that deploys to asteroids and moons to haul minerals.',
    cost: { minerals: 60, alloys: 25, energy: 15 },
    buildTime: 8,
    hull: 80,
    attack: 0,
    speed: 75
  },
  corvette: {
    type: 'corvette',
    name: 'Aegis Patrol Corvette',
    description: 'Fast escort vessel designed for anti-pirate interception.',
    cost: { minerals: 100, alloys: 60, energy: 30 },
    buildTime: 12,
    hull: 160,
    attack: 25,
    speed: 95
  },
  frigate: {
    type: 'frigate',
    name: 'Titan Heavy Frigate',
    description: 'Formidable warship with reinforced shielding and dual plasma cannons.',
    cost: { minerals: 200, alloys: 140, energy: 75 },
    buildTime: 22,
    hull: 350,
    attack: 65,
    speed: 60
  }
};

export const INITIAL_BODIES: CelestialBody[] = [
  {
    id: 'sol',
    name: 'Helios Prime (Star)',
    type: 'star',
    radius: 34,
    orbitRadius: 0,
    orbitSpeed: 0,
    orbitAngle: 0,
    color: '#fbbf24',
    colonized: false,
    canColonize: false,
    buildings: { solar_array: 0, mineral_mine: 0, alloy_foundry: 0, research_lab: 0, orbital_shipyard: 0, defense_turret: 0 },
    maxBuildings: 0
  },
  {
    id: 'terra',
    name: 'Nova Terra (Capital)',
    type: 'terrestrial',
    radius: 18,
    orbitRadius: 110,
    orbitSpeed: 0.12,
    orbitAngle: 0.5,
    color: '#38bdf8',
    detailsColor: '#22c55e',
    colonized: true,
    canColonize: true,
    buildings: { solar_array: 2, mineral_mine: 2, alloy_foundry: 1, research_lab: 1, orbital_shipyard: 1, defense_turret: 0 },
    maxBuildings: 12
  },
  {
    id: 'station_alpha',
    name: 'Apex Orbital Station',
    type: 'station',
    radius: 10,
    orbitRadius: 40,
    orbitSpeed: 0.6,
    orbitAngle: 1.2,
    color: '#cbd5e1',
    parentId: 'terra',
    colonized: true,
    canColonize: true,
    buildings: { solar_array: 1, mineral_mine: 0, alloy_foundry: 0, research_lab: 1, orbital_shipyard: 0, defense_turret: 1 },
    maxBuildings: 6
  },
  {
    id: 'ares',
    name: 'Ares Outpost',
    type: 'terrestrial',
    radius: 14,
    orbitRadius: 185,
    orbitSpeed: 0.08,
    orbitAngle: 2.4,
    color: '#f87171',
    detailsColor: '#991b1b',
    colonized: false,
    canColonize: true,
    buildings: { solar_array: 0, mineral_mine: 0, alloy_foundry: 0, research_lab: 0, orbital_shipyard: 0, defense_turret: 0 },
    maxBuildings: 8,
    pirateThreat: 15
  },
  {
    id: 'cerberus_belt',
    name: 'Cerberus Asteroid Belt',
    type: 'asteroid_field',
    radius: 12,
    orbitRadius: 260,
    orbitSpeed: 0.05,
    orbitAngle: 4.1,
    color: '#94a3b8',
    colonized: false,
    canColonize: true,
    buildings: { solar_array: 0, mineral_mine: 0, alloy_foundry: 0, research_lab: 0, orbital_shipyard: 0, defense_turret: 0 },
    maxBuildings: 4,
    pirateThreat: 40
  },
  {
    id: 'zeus',
    name: 'Zeus Gas Giant',
    type: 'terrestrial',
    radius: 26,
    orbitRadius: 350,
    orbitSpeed: 0.03,
    orbitAngle: 0.9,
    color: '#fb923c',
    hasRings: true,
    colonized: false,
    canColonize: false,
    buildings: { solar_array: 0, mineral_mine: 0, alloy_foundry: 0, research_lab: 0, orbital_shipyard: 0, defense_turret: 0 },
    maxBuildings: 0
  },
  {
    id: 'pirate_cove',
    name: 'Skull Rock (Pirate Haven)',
    type: 'pirate_outpost',
    radius: 11,
    orbitRadius: 420,
    orbitSpeed: 0.02,
    orbitAngle: 5.2,
    color: '#dc2626',
    colonized: false,
    canColonize: false,
    buildings: { solar_array: 0, mineral_mine: 0, alloy_foundry: 0, research_lab: 0, orbital_shipyard: 0, defense_turret: 0 },
    maxBuildings: 0,
    pirateThreat: 90
  }
];
