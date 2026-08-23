import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from '../src/game';
import { WORLD_OBSTACLES } from '../src/data';

describe('World Collision & Camera Tracking System', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine();
    // Dismiss intro dialogue
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should export valid WORLD_OBSTACLES matching all Chapter 1 specifications', () => {
    expect(WORLD_OBSTACLES).toBeDefined();
    expect(WORLD_OBSTACLES.length).toBeGreaterThanOrEqual(25);

    const waterBorders = WORLD_OBSTACLES.filter(o => o.type === 'water');
    expect(waterBorders.length).toBeGreaterThanOrEqual(1);
    expect(waterBorders.some(w => w.direction === 'south' && w.value === 2200)).toBe(true);

    const boxes = WORLD_OBSTACLES.filter(o => o.type === 'box');
    expect(boxes.some(b => b.name === 'Neon Cafe' && b.x === 1230 && b.y === 1180 && b.w === 260 && b.h === 160)).toBe(true);
    expect(boxes.some(b => b.name === 'Vinyl Den' && b.x === 1780 && b.y === 1180 && b.w === 260 && b.h === 160)).toBe(true);
    expect(boxes.some(b => b.name === 'Western Sea Cliffs')).toBe(true);
    expect(boxes.some(b => b.name === 'Northern Mountain Ridge')).toBe(true);
    expect(boxes.some(b => b.name === 'Eastern Bamboo Palisades')).toBe(true);

    const circles = WORLD_OBSTACLES.filter(o => o.type === 'circle');
    expect(circles.some(c => c.name === 'Harmony Fountain' && c.x === 1600 && c.y === 1450 && c.radius === 52)).toBe(true);
    expect(circles.some(c => c.name === 'Plaza Tree NW')).toBe(true);
  });

  it('should block movement into natural boundaries (Western cliffs, Northern ridge, Southern ocean)', () => {
    // Ocean South (y > 2200 when not on pier)
    expect(engine.checkObstacleCollision(500, 2250)).toBe(true);
    expect(engine.checkObstacleCollision(500, 2150)).toBe(false);

    // Western Sea Cliffs (x < 120, y < 1980)
    expect(engine.checkObstacleCollision(100, 1500)).toBe(true);
    expect(engine.checkObstacleCollision(200, 1500)).toBe(false);

    // Northern Mountains (y < 100)
    expect(engine.checkObstacleCollision(1000, 50)).toBe(true);
    expect(engine.checkObstacleCollision(1000, 150)).toBe(false);
  });

  it('should block movement into buildings (Cafe and Vinyl Den)', () => {
    // Cafe (x: 1230, y: 1180, w: 260, h: 160)
    expect(engine.checkObstacleCollision(1300, 1250)).toBe(true); // Inside Cafe
    expect(engine.checkObstacleCollision(1200, 1250)).toBe(false); // Just outside West wall
    expect(engine.checkObstacleCollision(1300, 1370)).toBe(false); // Just outside South patio

    // Vinyl Den (x: 1780, y: 1180, w: 260, h: 160)
    expect(engine.checkObstacleCollision(1850, 1250)).toBe(true); // Inside Vinyl Den
    expect(engine.checkObstacleCollision(2060, 1250)).toBe(false); // Just outside East wall
  });

  it('should block movement into the center plaza fountain', () => {
    // Fountain (x: 1600, y: 1450, radius: 52)
    expect(engine.checkObstacleCollision(1600, 1450)).toBe(true); // Exact center
    expect(engine.checkObstacleCollision(1630, 1450)).toBe(true); // Inside radius (dist 30 <= 52)
    expect(engine.checkObstacleCollision(1600, 1530)).toBe(false); // Outside radius (dist 80 > 52)
  });

  it('should block movement into tree trunks and bamboo thickets (radius: 20)', () => {
    // Beach Palm 1 (280, 2050, radius: 20)
    expect(engine.checkObstacleCollision(280, 2050)).toBe(true);
    expect(engine.checkObstacleCollision(280, 2010)).toBe(false);

    // Bamboo Thicket 1 (2320, 1140, radius: 20)
    expect(engine.checkObstacleCollision(2320, 1140)).toBe(true);
    expect(engine.checkObstacleCollision(2320, 1100)).toBe(false);
  });

  it('should block movement into lampposts and stone lanterns (radius: 16)', () => {
    // Plaza Lamppost NW (1280, 1380, radius: 16)
    expect(engine.checkObstacleCollision(1280, 1380)).toBe(true);
    expect(engine.checkObstacleCollision(1280, 1420)).toBe(false);

    // Bamboo Stone Lantern 1 (2380, 1280, radius: 16)
    expect(engine.checkObstacleCollision(2380, 1280)).toBe(true);
    expect(engine.checkObstacleCollision(2380, 1240)).toBe(false);
  });

  it('should block movement into ancient stone ruin pillars (radius: 24)', () => {
    // Ruin Pillar 1 (2300, 400, radius: 24)
    expect(engine.checkObstacleCollision(2300, 400)).toBe(true);
    expect(engine.checkObstacleCollision(2300, 350)).toBe(false);

    // Ridge Pillar 1 (400, 400, radius: 24)
    expect(engine.checkObstacleCollision(400, 400)).toBe(true);
    expect(engine.checkObstacleCollision(400, 350)).toBe(false);
  });

  it('should accurately calculate camera tracking coordinates across 3200x2400 world', () => {
    const state = engine.getState();

    // Initial spawn at Cadence Plaza (1500, 1400)
    expect(state.player.x).toBe(1500);
    expect(state.player.y).toBe(1400);

    engine.update(1000);
    engine.update(1016);

    // Camera centered on player: camX = 1500 - 640 = 860, camY = 1400 - 360 = 1040
    expect(state.camera.x).toBe(860);
    expect(state.camera.y).toBe(1040);

    // Test top-left boundary clamping (player at 140, 120)
    state.player.x = 140;
    state.player.y = 120;
    engine.update(1032);
    expect(state.camera.x).toBe(0);
    expect(state.camera.y).toBe(0);

    // Test bottom-right boundary clamping (player at 3060, 2180)
    state.player.x = 3060;
    state.player.y = 2180;
    engine.update(1048);
    // 3200 - 1280 = 1920; 2400 - 720 = 1680
    expect(state.camera.x).toBe(1920);
    expect(state.camera.y).toBe(1680);
  });

  it('should prevent player from walking through obstacles during movement update', () => {
    const state = engine.getState();
    // Position player just north of the Cafe (1300, 1170)
    state.player.x = 1300;
    state.player.y = 1170;

    // Simulate pressing KeyS (down into the Cafe at y: 1180-1340)
    (engine as any).keysDown.add('KeyS');
    engine.update(1000);
    engine.update(1100);

    // Player should NOT have penetrated into the Cafe
    expect(state.player.y).toBe(1170);
    (engine as any).keysDown.delete('KeyS');
  });

  it('should block walking into trees across the map', () => {
    // Plaza Tree NW at (1140, 1200) with radius 18
    expect(engine.checkObstacleCollision(1140, 1200)).toBe(true);
    expect(engine.checkObstacleCollision(1140, 1210)).toBe(true);
    expect(engine.checkObstacleCollision(1140, 1230)).toBe(false);
  });

  it('should allow smooth passage between leftmost lanterns in bamboo forest without getting stuck', () => {
    // Midpoint between Lantern 1 (2380, 1280) and Lantern 3 (2450, 1600) is around (2415, 1440)
    expect(engine.checkObstacleCollision(2415, 1440)).toBe(false);
  });

  it('should allow walking on pier jetties over ocean water', () => {
    // West Pier deck extends to (x: 140-320, y: 2040-2260)
    expect(engine.checkObstacleCollision(200, 2240)).toBe(false); // Walkable on pier deck
    expect(engine.checkObstacleCollision(500, 2240)).toBe(true);  // Blocked in open ocean
  });
});
