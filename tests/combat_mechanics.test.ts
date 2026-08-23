import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from '../src/game';
import { ALLEGRO_OWL_SPIRIT, BRASS_BUNNY_SPIRIT, SITAR_SWAN_SPIRIT, STARTER_SPIRIT, FUSED_CHIMERA, STEEL_PANDA_SPIRIT, KORA_GAZELLE_SPIRIT, GLITCH_GOLEM_SPIRIT } from '../src/data';

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

  it('should correctly start wild battles with new roaming monsters', () => {
    const pierGlitch = engine.getState().wildGlitches.find(g => g.id === 'glitch_pier');
    expect(pierGlitch).toBeDefined();
    engine.startWildBattle(pierGlitch!);

    let b = engine.getState().battle;
    expect(b).toBeDefined();
    expect(b?.type).toBe('wild');
    expect(b?.enemySpirit?.name).toBe('Steel-Panda');
    expect(b?.enemySpirit?.type).toBe('global');

    const groveGlitch = engine.getState().wildGlitches.find(g => g.id === 'glitch_grove');
    expect(groveGlitch).toBeDefined();
    engine.startWildBattle(groveGlitch!);

    b = engine.getState().battle;
    expect(b?.enemySpirit?.name).toBe('Kora-Gazelle');
    expect(b?.enemySpirit?.type).toBe('global');

    const ruinsGlitch = engine.getState().wildGlitches.find(g => g.id === 'glitch_ruins');
    expect(ruinsGlitch).toBeDefined();
    engine.startWildBattle(ruinsGlitch!);

    b = engine.getState().battle;
    expect(b?.enemySpirit?.name).toBe('Glitch-Golem');
    expect(b?.enemySpirit?.type).toBe('static');
  });

  it('should verify Synth overpowers Global Steel-Panda (1.5x damage)', () => {
    const pierGlitch = engine.getState().wildGlitches.find(g => g.id === 'glitch_pier')!;
    engine.startWildBattle(pierGlitch);
    const b = engine.getState().battle!;
    b.playerSpirit = JSON.parse(JSON.stringify(STARTER_SPIRIT)); // Synth type

    engine.initiatePlayerMove(0); // Synth move vs Global enemy
    b.rhythmCursor = (b.targetWindowStart + b.targetWindowEnd) / 2;
    engine.resolveRhythmHit();

    expect(b.rhythmResult).toBe('PERFECT');
  });

  it('should allow live stem sampling and multipart harmony fusion during battle', () => {
    // Add multiple spirits to queue
    const state = engine.getState();
    state.streamQueue.push(JSON.parse(JSON.stringify(ALLEGRO_OWL_SPIRIT)));
    state.streamQueue.push(JSON.parse(JSON.stringify(SITAR_SWAN_SPIRIT)));

    const pierGlitch = state.wildGlitches.find(g => g.id === 'glitch_pier')!;
    engine.startWildBattle(pierGlitch);
    const b = state.battle!;

    // Initial lead is starter spirit (Chime-Cat)
    expect(b.playerSpirit.name).toBe('Chime-Cat');
    expect(b.canBlend).toBe(true);

    // Live stem sample: switch to Allegro-Owl (index 1)
    engine.switchActiveSpirit(1);
    expect(b.playerSpirit.name).toBe('Allegro-Owl');
    expect(b.log).toContain('STEM SWITCH');

    // Trigger Multipart Harmony Fusion
    engine.triggerPlaylistBlend();
    expect(b.blendActive).toBe(true);
    expect(b.playerSpirit.name).toBe('Omni-Harmony Chimera');
    expect(b.log).toContain('MULTIPART HARMONY FUSION');
  });
});
