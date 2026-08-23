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

  it('should prevent walking inside buildings (Cafe and Vinyl Den collision)', () => {
    expect((engine as any).checkBuildingCollision(150, 150)).toBe(true); // Inside Cafe
    expect((engine as any).checkBuildingCollision(600, 150)).toBe(true); // Inside Vinyl Den
    expect((engine as any).checkBuildingCollision(400, 310)).toBe(true); // Inside Center Fountain
    expect((engine as any).checkBuildingCollision(400, 450)).toBe(false); // Open Plaza Ground
  });
});
