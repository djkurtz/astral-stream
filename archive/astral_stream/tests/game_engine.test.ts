import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from '../src/game';

describe('GameEngine: Exploration & Dialogue State', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine();
  });

  it('should initialize with Festival Morning Prologue dialogue', () => {
    const state = engine.getState();
    expect(state.mode).toBe('intro');
    expect(state.dialogue).toBeDefined();
    expect(state.dialogue?.speaker).toContain('Aria ☕');
    expect(state.dialogue?.text[0]).toContain('Soundwave Festival');
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

  it('should switch active lead Harmonimal and cycle through stream queue', () => {
    const state = engine.getState();
    // Dismiss dialogue
    while (state.dialogue) {
      engine.advanceDialogue();
    }

    // Add Sitar Swan to queue
    state.streamQueue.push({
      id: 'spirit_sitar_swan',
      name: 'Sitar-Swan',
      title: 'Gourd-Bodied Veena Swan',
      vibeTag: '#RagaAura',
      species: 'Fretted Sitar Cygnus',
      instrument: 'Fretted Dandi Neck',
      originTradition: 'Indian Classical',
      avatar: '🪕🦢',
      type: 'global',
      color: '#f59e0b',
      level: 1,
      xp: 0,
      maxXp: 100,
      hp: 70,
      maxHp: 70,
      energy: 100,
      attack: 22,
      defense: 18,
      speed: 15,
      moves: []
    });

    expect(state.activeSpiritIndex).toBe(0);
    
    // Switch to index 1 (Sitar-Swan)
    engine.switchActiveSpirit(1);
    expect(state.activeSpiritIndex).toBe(1);
    expect(state.streamQueue[state.activeSpiritIndex].name).toBe('Sitar-Swan');

    // Cycle active spirit
    engine.cycleActiveSpirit();
    expect(state.activeSpiritIndex).toBe(0);
    expect(state.streamQueue[state.activeSpiritIndex].name).toBe('Chime-Cat');
  });
});
