import { describe, it, expect, beforeEach } from 'vitest';
import { AstralGameEngine } from '../src/game';
import { WILD_SPAWN_ZONES } from '../src/data';

describe('Wild Monster AI & Algorithmic Spawning', () => {
  let engine: AstralGameEngine;

  beforeEach(() => {
    engine = new AstralGameEngine();
    const state = engine.getState();
    while (state.dialogue) {
      engine.advanceDialogue();
    }
    state.currentZone = 'beach';
    state.currentInterior = null;
    expect(state.mode).toBe('exploration');
  });

  it('should define valid wild spawn zones across the map', () => {
    expect(WILD_SPAWN_ZONES.length).toBeGreaterThanOrEqual(4);
    for (const zone of WILD_SPAWN_ZONES) {
      expect(zone.minX).toBeLessThan(zone.maxX);
      expect(zone.minY).toBeLessThan(zone.maxY);
      expect(zone.possibleSpirits.length).toBeGreaterThan(0);
    }
  });

  it('should wander or patrol when player is far away (>220px)', () => {
    const state = engine.getState();
    // Position player far away on beach
    state.player.x = 100;
    state.player.y = 100;

    const bug = state.wildGlitches.find(g => g.id === 'glitch_beach_1')!;
    expect(bug).toBeDefined();
    const initialDist = Math.hypot(state.player.x - bug.x, state.player.y - bug.y);
    expect(initialDist).toBeGreaterThan(220);

    // Run AI tick
    (engine as any).updateWildMonsters(0.1);
    expect(bug.isAlerted).toBe(false);
  });

  it('should not update or pursue monsters when player is in the village or indoors', () => {
    const state = engine.getState();
    state.currentZone = 'plaza';
    state.currentInterior = null;
    const bug = state.wildGlitches.find(g => g.id === 'glitch_beach_1')!;
    state.player.x = bug.x + 20;
    state.player.y = bug.y;

    (engine as any).updateWildMonsters(0.1);
    expect(bug.isAlerted).toBe(false);
    expect(state.mode).toBe('exploration');
  });

  it('should alert and pursue player when within detection radius (<220px)', () => {
    const state = engine.getState();
    const bug = state.wildGlitches.find(g => g.id === 'glitch_beach_1')!;
    
    // Move player close to the bug (within 100px)
    state.player.x = bug.x + 80;
    state.player.y = bug.y;
    const initialBugX = bug.x;

    // Simulate 0.5s of pursuit
    (engine as any).updateWildMonsters(0.5);

    expect(bug.isAlerted).toBe(true);
    // Bug should have moved closer towards player (increased X)
    expect(bug.x).toBeGreaterThan(initialBugX);
  });

  it('should trigger wild battle upon direct touch (<34px)', () => {
    const state = engine.getState();
    const bug = state.wildGlitches.find(g => g.id === 'glitch_beach_1')!;

    // Place player right adjacent to bug
    state.player.x = bug.x + 20;
    state.player.y = bug.y;

    (engine as any).updateWildMonsters(0.1);

    expect(state.mode).toBe('battle');
    expect(state.battle).not.toBeNull();
    expect(state.battle?.enemySpirit?.id).toBe(bug.spirit.id);
  });

  it('should handle monster algorithmic respawn after defeat', () => {
    const state = engine.getState();
    const bug = state.wildGlitches.find(g => g.id === 'glitch_beach_1')!;
    bug.defeated = true;
    bug.respawnTimer = 0;

    // Simulate 10 seconds (not yet respawned)
    (engine as any).updateWildMonsters(10);
    expect(bug.defeated).toBe(true);

    // Simulate 15 more seconds (total 25s > 20s threshold)
    (engine as any).updateWildMonsters(15);
    expect(bug.defeated).toBe(false);
    expect(bug.respawnTimer).toBe(0);
  });
});
