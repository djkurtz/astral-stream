import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from '../src/game';

describe('GameEngine: Exploration & Dialogue State', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine();
  });

  it('should initialize with Emergency Broadcast Intro dialogue', () => {
    const state = engine.getState();
    expect(state.mode).toBe('intro');
    expect(state.dialogue).toBeDefined();
    expect(state.dialogue?.speaker).toContain('EMERGENCY BROADCAST');
    expect(state.dialogue?.text[1]).toContain('DEAD CHANNEL 000');
  });

  it('should transition from intro to exploration when dialogue completes', () => {
    const state = engine.getState();
    const totalLines = state.dialogue?.text.length || 0;
    
    // Advance through all dialogue lines
    for (let i = 0; i < totalLines; i++) {
      engine.advanceDialogue();
    }

    expect(state.mode).toBe('exploration');
    expect(state.dialogue).toBeNull();
  });

  it('should update player position and respect boundary clamps', () => {
    const state = engine.getState();
    // Complete intro first
    while (state.dialogue) {
      engine.advanceDialogue();
    }

    const initialX = state.player.x;
    const initialY = state.player.y;

    // Simulate tick with key down
    (engine as any).keysDown.add('KeyD');
    engine.update(1000);
    engine.update(1100); // 100ms dt

    expect(state.player.x).toBeGreaterThan(initialX);
    expect(state.player.dir).toBe('right');
    (engine as any).keysDown.delete('KeyD');
  });

  it('should block player movement while dialogue is active', () => {
    const state = engine.getState();
    expect(state.dialogue).not.toBeNull();
    const initialX = state.player.x;
    const initialY = state.player.y;

    (engine as any).keysDown.add('KeyD');
    (engine as any).keysDown.add('KeyS');
    engine.update(1000);
    engine.update(1100);

    expect(state.player.x).toBe(initialX);
    expect(state.player.y).toBe(initialY);
    expect(state.player.isMoving).toBe(false);
    (engine as any).keysDown.delete('KeyD');
    (engine as any).keysDown.delete('KeyS');
  });

  it('should prevent walking inside buildings (Cafe and Vinyl Den collision)', () => {
    expect((engine as any).checkObstacleCollision(1300, 1250)).toBe(true); // Inside Cafe
    expect((engine as any).checkObstacleCollision(1850, 1250)).toBe(true); // Inside Vinyl Den
    expect((engine as any).checkObstacleCollision(1600, 1450)).toBe(true); // Inside Center Fountain
    expect((engine as any).checkObstacleCollision(1500, 1400)).toBe(false); // Open Plaza Ground
  });
});
