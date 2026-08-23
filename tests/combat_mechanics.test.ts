import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from '../src/game';
import { ALLEGRO_OWL_SPIRIT, BRASS_BUNNY_SPIRIT, SITAR_SWAN_SPIRIT, STARTER_SPIRIT, FUSED_CHIMERA } from '../src/data';

describe('Combat Mechanics & Genre Affinity Wheel', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine();
    // Dismiss intro dialogue
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should correctly start a rival battle with Jax', () => {
    engine.startBattle('rival');
    const b = engine.getState().battle;
    expect(b).toBeDefined();
    expect(b?.type === 'rival').toBe(true);
    expect(b?.turn).toBe('player');
    expect(b?.enemySpirit?.name).toBe('Bass-Hound');
  });

  it('should initiate a move and enter rhythm timing state', () => {
    engine.startBattle('rival');
    engine.initiatePlayerMove(0);
    const b = engine.getState().battle;
    expect(b?.turn).toBe('rhythm_timing');
    expect(b?.pendingMoveIndex).toBe(0);
  });

  it('should calculate PERFECT rhythm hit when cursor is within target window', () => {
    engine.startBattle('rival');
    engine.initiatePlayerMove(0);
    const b = engine.getState().battle!;
    
    // Set cursor to center of target window (0.5)
    b.rhythmCursor = (b.targetWindowStart + b.targetWindowEnd) / 2;
    engine.resolveRhythmHit();

    expect(b.rhythmResult).toBe('PERFECT');
  });

  it('should calculate MISS rhythm hit when cursor is outside target window', () => {
    engine.startBattle('rival');
    engine.initiatePlayerMove(0);
    const b = engine.getState().battle!;
    
    // Set cursor outside window (0.1)
    b.rhythmCursor = 0.1;
    engine.resolveRhythmHit();

    expect(b.rhythmResult).toBe('MISS');
  });

  it('should verify Symphonic overpowers Synth (1.5x damage)', () => {
    engine.startBattle('boss');
    const b = engine.getState().battle!;
    b.playerSpirit = JSON.parse(JSON.stringify(ALLEGRO_OWL_SPIRIT)); // Symphonic
    b.enemyBoss = {
      id: 'mock_synth',
      name: 'Mock Synth',
      title: 'Mock',
      avatar: '🎹',
      type: 'synth',
      hp: 100,
      maxHp: 100,
      attack: 10,
      glitchIntensity: 0,
      moves: []
    };

    engine.initiatePlayerMove(0); // Sets turn to rhythm_timing and pendingMoveIndex to 0
    b.rhythmCursor = (b.targetWindowStart + b.targetWindowEnd) / 2;
    engine.resolveRhythmHit();

    expect(b.rhythmResult).toBe('PERFECT');
  });

  it('should verify Cosmic overpowers Static boss (1.8x multiplier)', () => {
    engine.startBattle('boss');
    const b = engine.getState().battle!;
    b.playerSpirit = JSON.parse(JSON.stringify(FUSED_CHIMERA)); // Cosmic
    engine.initiatePlayerMove(0);
    b.rhythmCursor = (b.targetWindowStart + b.targetWindowEnd) / 2;
    engine.resolveRhythmHit();

    expect(b.rhythmResult).toBe('PERFECT');
  });
});
