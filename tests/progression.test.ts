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
    expect(state.dialogue?.text[1]).toContain('added to your master playlist');
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

  it('should sample harmonic stems from defeated wild monsters and trigger evolution after 3 stems', () => {
    const state = engine.getState();
    const cat = state.streamQueue[0];
    expect(cat.name).toBe('Chime-Cat');
    expect(cat.isEvolved).toBeFalsy();

    // Battle 1 (Synth Bit-Bug) -> 1/3 stems
    const glitch1 = state.wildGlitches[0];
    engine.startWildBattle(glitch1);
    state.battle!.enemySpirit!.hp = 0;
    (engine as any).handleBattleVictory();
    expect(cat.harmonicEnrichment).toBe(1);
    expect(cat.isEvolved).toBeFalsy();

    // Battle 2 -> 2/3 stems
    engine.startWildBattle(glitch1);
    state.battle!.enemySpirit!.hp = 0;
    (engine as any).handleBattleVictory();
    expect(cat.harmonicEnrichment).toBe(2);
    expect(cat.isEvolved).toBeFalsy();

    // Battle 3 -> 3/3 stems -> HARMONIC EVOLUTION!
    engine.startWildBattle(glitch1);
    state.battle!.enemySpirit!.hp = 0;
    (engine as any).handleBattleVictory();
    expect(cat.harmonicEnrichment).toBe(3);
    expect(cat.isEvolved).toBe(true);
    expect(cat.name).toBe('Polyphonic Synth-Cat');
    expect(cat.moves.some(m => m.name === 'PRISM SPECTRUM ARPEGGIO')).toBe(true);
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
    expect(freshState.currentInterior).toBeNull();

    // Player enters the Neon Cafe
    freshState.player.x = 1360;
    freshState.player.y = 1340;
    freshEngine.updateProximity();
    freshEngine.interactWithNearby();
    expect(freshState.currentInterior).toBe('cafe');

    // Player steps out the cafe exit door
    freshState.player.x = 320;
    freshState.player.y = 370;
    freshEngine.updateProximity();
    freshEngine.interactWithNearby();
    expect(freshState.currentInterior).toBeNull();
    expect(freshState.visitedCafe).toBe(true);

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

  it('should support entering cafe, ordering coffee for buffs, vinyl den browsing, and biome challenges', () => {
    const engine = new GameEngine();
    const state = engine.getState();

    // Dismiss initial dialogue
    while (state.dialogue) engine.advanceDialogue();

    // 1. Enter Cafe
    state.player.x = 1360;
    state.player.y = 1340;
    engine.updateProximity();
    engine.interactWithNearby();
    expect(state.currentInterior).toBe('cafe');

    // Hurt active spirit
    state.streamQueue[0].hp = 10;
    state.streamQueue[0].energy = 20;

    // Order coffee from Aria (320, 180)
    state.player.x = 320;
    state.player.y = 200;
    engine.updateProximity();
    engine.interactWithNearby();
    expect(state.dialogue?.text[0]).toContain('Harmonic Latte');
    expect(state.streamQueue[0].hp).toBe(state.streamQueue[0].maxHp);
    expect(state.streamQueue[0].energy).toBe(100);

    // Dismiss dialogue & exit cafe
    while (state.dialogue) engine.advanceDialogue();
    state.player.x = 320;
    state.player.y = 370;
    engine.updateProximity();
    engine.interactWithNearby();
    expect(state.currentInterior).toBeNull();

    // 2. Enter Vinyl Den (1910, 1340)
    state.player.x = 1910;
    state.player.y = 1340;
    engine.updateProximity();
    engine.interactWithNearby();
    expect(state.currentInterior).toBe('vinyl_den');

    // Browse crates
    state.player.x = 180;
    state.player.y = 260;
    engine.updateProximity();
    engine.interactWithNearby();
    expect(state.dialogue?.speaker).toContain('Classical');

    while (state.dialogue) engine.advanceDialogue();
    state.player.x = 320;
    state.player.y = 370;
    engine.updateProximity();
    engine.interactWithNearby();
    expect(state.currentInterior).toBeNull();

    // 3. Test Secondary Biome Challenge: Tidal Sea Conches (1100, 2120)
    state.player.x = 1100;
    state.player.y = 2120;
    engine.updateProximity();
    engine.interactWithNearby();
    expect(state.dialogue?.speaker).toBe('Harmonic Sea Conches');
    expect(state.dialogue?.text[0]).toContain('sea conches');
  });
});
