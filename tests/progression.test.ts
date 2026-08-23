import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from '../src/game';
import { JAX_SPIRIT, FUSED_CHIMERA } from '../src/data';

describe('Story Progression & Tag-Team Fusion', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine();
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should recruit Bass-Hound and enter exploration phase upon defeating Jax', () => {
    engine.startBattle('rival');
    const state = engine.getState();
    const b = state.battle!;
    
    // Simulate knocking out enemy Jax spirit
    b.enemySpirit!.hp = 0;
    (engine as any).handleBattleVictory();

    // Verify recruitment
    expect(state.activeCompanion).toBe('jax');
    expect(state.streamQueue.some(s => s.id === JAX_SPIRIT.id)).toBe(true);
    expect(state.mode).toBe('exploration');
    expect(state.battle).toBeNull();
    
    // Verify Jax celebration dialogue
    expect(state.dialogue?.speaker).toContain('Jax & Bass-Hound');
    expect(state.dialogue?.text[1]).toContain('joining your active squad');
  });

  it('should trigger Collaborative Playlist Blend fusion in boss battle', () => {
    // Set active companion to jax
    engine.getState().activeCompanion = 'jax';
    engine.startBattle('boss');

    const b = engine.getState().battle!;
    expect(b.canBlend).toBe(true);
    expect(b.blendActive).toBe(false);

    // Trigger fusion
    engine.triggerPlaylistBlend();

    expect(b.blendActive).toBe(true);
    expect(b.playerSpirit.id).toBe(FUSED_CHIMERA.id);
    expect(b.playerSpirit.hp).toBe(160);
    expect(b.playerSpirit.moves[0].name).toBe('GLOBAL PLAYLIST BLEND DROP');
  });

  it('should transition to victory cleansing cinematic after defeating boss', () => {
    engine.startBattle('boss');
    const state = engine.getState();
    const b = state.battle!;

    b.enemyBoss!.hp = 0;
    (engine as any).handleBattleVictory();

    expect(state.mode).toBe('cleansing_cinematic');
    expect(state.battle).toBeNull();
  });
});
