import { BUILDING_DEFS, SHIP_DEFS } from './data';
import { addLog, calculateRates, deductResources } from './state';
import { BuildingType, GameState, Ship, ShipType } from './types';

export class GameEngine {
  private state: GameState;
  private lastTick: number = 0;
  private resAccumulator: number = 0;

  constructor(state: GameState) {
    this.state = state;
  }

  public update(now: number): void {
    if (this.lastTick === 0) {
      this.lastTick = now;
      return;
    }
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    if (this.state.paused) return;

    const gameDt = dt * this.state.speed;
    this.state.time += gameDt;

    // 1. Orbit calculation
    for (const body of this.state.bodies) {
      if (body.orbitSpeed > 0) {
        body.orbitAngle = (body.orbitAngle + body.orbitSpeed * gameDt) % (Math.PI * 2);
      }
    }

    // 2. Resource generation (calculated every frame smoothly)
    this.state.resourceRates = calculateRates(this.state);
    this.resAccumulator += gameDt;
    if (this.resAccumulator >= 0.1) {
      const step = this.resAccumulator;
      this.resAccumulator = 0;

      this.state.resources.energy = Math.max(0, this.state.resources.energy + this.state.resourceRates.energy * step);
      this.state.resources.minerals = Math.max(0, this.state.resources.minerals + this.state.resourceRates.minerals * step);
      this.state.resources.alloys = Math.max(0, this.state.resources.alloys + this.state.resourceRates.alloys * step);
      this.state.resources.science = Math.max(0, this.state.resources.science + this.state.resourceRates.science * step);
    }

    // 3. Process Build Queue
    for (let i = this.state.buildQueue.length - 1; i >= 0; i--) {
      const task = this.state.buildQueue[i];
      task.progress += gameDt;

      if (task.progress >= task.totalTime) {
        // Complete task
        this.completeBuildTask(task);
        this.state.buildQueue.splice(i, 1);
      }
    }

    // 4. Ship Movement & Actions
    for (const ship of this.state.ships) {
      if (ship.state === 'traveling' && ship.destinationId) {
        // Linear travel progress
        ship.travelProgress += (ship.speed / 500) * gameDt;
        if (ship.travelProgress >= 1) {
          ship.locationId = ship.destinationId;
          ship.destinationId = undefined;
          ship.travelProgress = 0;

          const arrivedBody = this.state.bodies.find(b => b.id === ship.locationId);
          if (arrivedBody?.type === 'asteroid_field' && ship.type === 'mining_drone') {
            ship.state = 'mining';
            addLog(this.state, `${ship.name} arrived at ${arrivedBody.name} and initiated deep-core mining.`, 'success');
          } else {
            ship.state = 'idle';
            addLog(this.state, `${ship.name} arrived at ${arrivedBody?.name || 'destination'}.`, 'info');
          }
        }
      }
    }
  }

  private completeBuildTask(task: { targetId: string; kind: 'building' | 'ship'; typeId: string; name: string }): void {
    const target = this.state.bodies.find(b => b.id === task.targetId);
    if (!target) return;

    if (task.kind === 'building') {
      const bType = task.typeId as BuildingType;
      target.buildings[bType] = (target.buildings[bType] || 0) + 1;
      addLog(this.state, `Construction complete: ${task.name} upgraded on ${target.name}.`, 'success');
    } else if (task.kind === 'ship') {
      const sType = task.typeId as ShipType;
      const def = SHIP_DEFS[sType];
      const newShip: Ship = {
        id: 'ship_' + Math.random().toString(36).substring(2, 8),
        name: `${def.name.split(' ')[0]} ${Math.floor(Math.random() * 899 + 100)}`,
        type: sType,
        hull: def.hull,
        maxHull: def.hull,
        attack: def.attack,
        speed: def.speed,
        locationId: target.id,
        travelProgress: 0,
        state: 'idle'
      };
      this.state.ships.push(newShip);
      addLog(this.state, `Shipyard commissioned new vessel: ${newShip.name} ready for duty at ${target.name}.`, 'success');
    }
  }

  public queueBuilding(bodyId: string, bType: BuildingType, cost: any): boolean {
    deductResources(this.state.resources, cost);
    const def = BUILDING_DEFS[bType];
    this.state.buildQueue.push({
      id: Math.random().toString(36).substring(2, 9),
      targetId: bodyId,
      kind: 'building',
      typeId: bType,
      progress: 0,
      totalTime: 4 + ((this.state.bodies.find(b => b.id === bodyId)?.buildings[bType] || 0) * 2),
      name: def.name
    });
    addLog(this.state, `Started construction of ${def.name} on ${(this.state.bodies.find(b => b.id === bodyId))?.name}.`, 'info');
    return true;
  }

  public queueShip(bodyId: string, sType: ShipType): boolean {
    const def = SHIP_DEFS[sType];
    deductResources(this.state.resources, def.cost);
    this.state.buildQueue.push({
      id: Math.random().toString(36).substring(2, 9),
      targetId: bodyId,
      kind: 'ship',
      typeId: sType,
      progress: 0,
      totalTime: def.buildTime,
      name: def.name
    });
    addLog(this.state, `Commissioned ${def.name} at ${(this.state.bodies.find(b => b.id === bodyId))?.name}.`, 'info');
    return true;
  }

  public colonizeBody(bodyId: string): boolean {
    const body = this.state.bodies.find(b => b.id === bodyId);
    if (!body || body.colonized || !body.canColonize) return false;

    const colonizeCost = { alloys: 50, energy: 30, minerals: 100 };
    deductResources(this.state.resources, colonizeCost);

    body.colonized = true;
    body.buildings.solar_array = 1;
    body.buildings.mineral_mine = 1;

    addLog(this.state, `Colony established on ${body.name}! Initial life support and mining online.`, 'success');
    return true;
  }

  public sendShip(shipId: string, destinationId: string): void {
    const ship = this.state.ships.find(s => s.id === shipId);
    if (!ship || ship.state === 'traveling' || ship.locationId === destinationId) return;

    ship.state = 'traveling';
    ship.destinationId = destinationId;
    ship.travelProgress = 0;
    const dest = this.state.bodies.find(b => b.id === destinationId);
    addLog(this.state, `${ship.name} engaged sub-light engines, heading to ${dest?.name || destinationId}.`, 'info');
  }

  /* ---------------- Stage 1 Diplomacy & Hegemony ---------------- */
  public sendDiplomaticEnvoy(factionId: string): boolean {
    const faction = this.state.factions?.find(f => f.id === factionId);
    if (!faction || faction.relationship === 'unified') return false;

    faction.opinion = Math.min(100, faction.opinion + 15);
    if (faction.opinion >= 70 && faction.relationship === 'neutral') {
      faction.relationship = 'friendly';
    }
    if (faction.opinion >= 40 && faction.relationship === 'hostile') {
      faction.relationship = 'neutral';
    }
    addLog(this.state, `Diplomatic mission sent to ${faction.name}. Relations improved (+15 Opinion).`, 'success');
    this.updateHegemony();
    return true;
  }

  public toggleTradeRoute(factionId: string): boolean {
    const faction = this.state.factions?.find(f => f.id === factionId);
    if (!faction) return false;

    if (!faction.tradeActive) {
      if (faction.opinion < 30) {
        addLog(this.state, `${faction.name} refuses trade. (Requires Opinion >= 30).`, 'warning');
        return false;
      }
      faction.tradeActive = true;
      addLog(this.state, `Established bilateral trade route with ${faction.name}!`, 'success');
    } else {
      faction.tradeActive = false;
      addLog(this.state, `Suspended trade route with ${faction.name}.`, 'info');
    }
    this.updateHegemony();
    return true;
  }

  public formAlliance(factionId: string): boolean {
    const faction = this.state.factions?.find(f => f.id === factionId);
    if (!faction || faction.relationship === 'allied' || faction.relationship === 'unified') return false;

    if (faction.opinion < 70) {
      addLog(this.state, `${faction.name} is not ready for an alliance (Requires Opinion >= 70).`, 'warning');
      return false;
    }

    faction.relationship = 'allied';
    addLog(this.state, `Signed the Planetary Concordat! ${faction.name} is now your military and scientific Ally!`, 'success');
    this.updateHegemony();
    return true;
  }

  public unifyFaction(factionId: string): boolean {
    const faction = this.state.factions?.find(f => f.id === factionId);
    if (!faction || faction.relationship === 'unified') return false;

    if (faction.opinion < 90) {
      addLog(this.state, `${faction.name} requires at least 90 Opinion to ratify total integration.`, 'warning');
      return false;
    }

    faction.relationship = 'unified';
    faction.tradeActive = true;
    addLog(this.state, `HISTORIC MILESTONE: ${faction.name} has signed the Planetary Unification Accord!`, 'success');
    this.updateHegemony();
    return true;
  }

  public updateHegemony(): void {
    if (!this.state.factions) return;

    let points = 0;
    for (const f of this.state.factions) {
      if (f.relationship === 'unified') points += 25;
      else if (f.relationship === 'allied') points += 12;
      else if (f.relationship === 'friendly') points += 6;
      if (f.tradeActive) points += 5;
    }

    this.state.hegemonyProgress = Math.min(100, points);

    if (this.state.hegemonyProgress >= 100 && this.state.era === 'planetary') {
      this.state.era = 'interplanetary';
      addLog(this.state, `🌟 GLOBAL HEGEMONY ACHIEVED! Nova Terra is unified under one banner! The Orbital Space Program is now ACTIVE!`, 'success');
    }
  }
}
