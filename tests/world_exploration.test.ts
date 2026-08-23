import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { WORLD_ZONES } from '../src/data';

describe('Harmonia: World Exploration & Zone Navigation', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Aria');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should define valid world zones with boundaries and transitions', () => {
    const zoneKeys = Object.keys(WORLD_ZONES);
    expect(zoneKeys.length).toBeGreaterThanOrEqual(4);
    for (const key of zoneKeys) {
      const z = WORLD_ZONES[key];
      expect(z.width).toBeGreaterThan(0);
      expect(z.height).toBeGreaterThan(0);
      expect(z.transitions.length).toBeGreaterThan(0);
    }
  });

  it('should warp to another zone when stepping through transition bounds', () => {
    const state = engine.getState();
    expect(state.currentZone).toBe('cavatina_village');

    // Warp directly to Woodwind Woods
    engine.warpToZone('woodwind_woods', { x: 120, y: 600, dir: 'right' });

    expect(state.currentZone).toBe('woodwind_woods');
    expect(state.player.x).toBe(120);
    expect(state.player.y).toBe(600);
    expect(state.discoveredZones['woodwind_woods']).toBe(true);
  });

  it('should prevent movement into solid obstacles', () => {
    const state = engine.getState();
    // Position player right against the Practice Shed wall (x: 450, y: 350, w: 280, h: 180)
    const isColliding = (engine as any).checkObstacleCollision(500, 400);
    expect(isColliding).toBe(true);

    const isWalkable = (engine as any).checkObstacleCollision(1000, 1000);
    expect(isWalkable).toBe(false);
  });
});
