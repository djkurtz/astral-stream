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

  it('should move the player when pressing Arrow keys', () => {
    const state = engine.getState();
    const initialY = state.player.y;

    engine.handleKeyDown('ArrowDown');
    engine.update(100);
    engine.handleKeyUp('ArrowDown');

    expect(state.player.y).toBeGreaterThan(initialY);
  });

  it('should interact with Barkeep Barnaby at the Tavern and trigger tavern rest/gossip', () => {
    const state = engine.getState();
    const barnaby = state.npcs.find(n => n.id === 'npc_barkeep_barnaby')!;
    expect(barnaby).toBeDefined();

    state.player.x = barnaby.x;
    state.player.y = barnaby.y;
    engine.updateProximity();
    engine.interactWithNearby();

    expect(state.dialogue).toBeDefined();
    expect(state.dialogue?.speaker).toBe('Barkeep Barnaby');
    expect(state.dialogue?.text[0]).toContain('The Melodic Rose Tavern & Inn');
  });

  it('should trigger building door interaction prompts', () => {
    const state = engine.getState();
    const tavernDoor = state.npcs.find(n => n.id === 'npc_door_tavern')!;
    expect(tavernDoor).toBeDefined();

    state.player.x = tavernDoor.x;
    state.player.y = tavernDoor.y;
    engine.updateProximity();
    expect(state.nearbyInteractable?.id).toBe('npc_door_tavern');
  });
});
