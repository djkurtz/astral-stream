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

  it('should start wild glitch battle, award XP, and level up Harmonimal', () => {
    const state = engine.getState();
    const glitch = state.wildGlitches[0];
    
    engine.startWildBattle(glitch);
    expect(state.battle?.type).toBe('wild');
    expect(state.battle?.enemySpirit?.name).toBe(glitch.spirit.name);

    // Initial level & XP
    const playerSpirit = state.streamQueue[0];
    expect(playerSpirit.level).toBe(1);
    expect(playerSpirit.xp).toBe(0);

    // First victory (+50 XP)
    state.battle!.enemySpirit!.hp = 0;
    (engine as any).handleBattleVictory();

    expect(playerSpirit.xp).toBe(50);
    expect(playerSpirit.level).toBe(1);
    expect(glitch.defeated).toBe(true);

    // Second victory (+50 XP -> 100 XP -> LEVEL UP to Lv.2)
    const glitch2 = state.wildGlitches[1];
    engine.startWildBattle(glitch2);
    state.battle!.enemySpirit!.hp = 0;
    (engine as any).handleBattleVictory();

    expect(playerSpirit.level).toBe(2);
    expect(playerSpirit.maxHp).toBeGreaterThan(70);
    expect(playerSpirit.attack).toBeGreaterThan(18);
  });

  it('should start with festival morning prologue and trigger emergency broadcast on exploration', () => {
    const freshEngine = new GameEngine();
    const freshState = freshEngine.getState();

    // Starts in morning prologue with Aria
    expect(freshState.dialogue?.speaker).toBe('Aria ☕');
    expect(freshState.dialogue?.avatar).toBe('☕');
    expect(freshState.questStage).toBe('intro');

    // Dismiss morning coffee dialogue
    while (freshState.dialogue) {
      freshEngine.advanceDialogue();
    }
    expect(freshState.mode).toBe('exploration');
    expect(freshState.dialogue).toBeNull();
    expect(freshState.questStage).toBe('intro');

    // Move near Harmony Fountain (1600, 1450)
    freshState.player.x = 1600;
    freshState.player.y = 1450;
    freshEngine.update(1000);
    freshEngine.update(1016);

    // Emergency broadcast is triggered!
    expect(freshState.dialogue?.speaker).toContain('EMERGENCY BROADCAST');
    expect(freshState.dialogue?.avatar).toBe('📳');

    // Dismiss broadcast to start quest
    while (freshState.dialogue) {
      freshEngine.advanceDialogue();
    }
    expect(freshState.questStage).toBe('seek_traditions');
  });
});
