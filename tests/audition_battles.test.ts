import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { RECRUITABLE_MUSICIANS, getBattleMovesForMusician } from '../src/data';

describe('Harmonia: Audition Battles & NPC Recruitment', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Maestro');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should start an audition battle against an NPC musician', () => {
    const claraNpc = engine.getState().npcs.find(n => n.id === 'npc_clara_world')!;
    engine.startAuditionBattle(claraNpc);

    const state = engine.getState();
    expect(state.mode).toBe('audition_battle');
    expect(state.auditionBattle).not.toBeNull();
    expect(state.auditionBattle?.opponent.name).toBe('Clara');
    expect(state.auditionBattle?.playerHarmonyMeter).toBe(20);
  });

  it('should provide battle moves matching the combatants actual instrument', () => {
    const player = engine.getState().ensemble.members[0];
    const violinMoves = getBattleMovesForMusician(player);
    expect(violinMoves[0].name).toBe('Spiccato Bounce');
    expect(violinMoves[1].name).toBe('Vibrato Charm');
    expect(violinMoves[2].name).toBe('Pianissimo Shield');
    expect(violinMoves[3].name).toBe('Fortissimo Surge');

    // Flute starter
    const fluteEngine = new HarmoniaGameEngine();
    fluteEngine.chooseStarter('silver_flute', 'Maestro');
    const flutePlayer = fluteEngine.getState().ensemble.members[0];
    const fluteMoves = getBattleMovesForMusician(flutePlayer);
    expect(fluteMoves[0].name).toBe('Overtone Flutter');
    expect(fluteMoves[1].name).toBe('Trill Mirage');

    // Trumpet starter
    const trumpetEngine = new HarmoniaGameEngine();
    trumpetEngine.chooseStarter('pocket_trumpet', 'Maestro');
    const trumpetPlayer = trumpetEngine.getState().ensemble.members[0];
    const trumpetMoves = getBattleMovesForMusician(trumpetPlayer);
    expect(trumpetMoves[0].name).toBe('Herald Fanfare');
    expect(trumpetMoves[1].name).toBe('Fortissimo Blast');
  });

  it('should execute battle moves by index or ID, consume Harmony Points, and surge the Harmony Meter', () => {
    const claraNpc = engine.getState().npcs.find(n => n.id === 'npc_clara_world')!;
    engine.startAuditionBattle(claraNpc);

    const battle = engine.getState().auditionBattle!;
    const initialHP = battle.harmonyPoints;
    const initialHarmony = battle.playerHarmonyMeter;

    engine.executeBattleMove(0); // Spiccato Bounce for violin

    expect(battle.harmonyPoints).toBeLessThan(initialHP);
    expect(battle.playerHarmonyMeter).toBeGreaterThan(initialHarmony);
    expect(battle.log.length).toBeGreaterThan(2);
    expect(battle.log[battle.log.length - 1]).toContain('Spiccato Bounce');
  });

  it('should resolve victory upon reaching 100% Harmony and recruit the musician into the ensemble', () => {
    const oliverNpc = engine.getState().npcs.find(n => n.id === 'npc_oliver_world')!;
    engine.startAuditionBattle(oliverNpc);

    const battle = engine.getState().auditionBattle!;
    battle.playerHarmonyMeter = 95;

    engine.executeBattleMove(1); // Vibrato Charm

    const state = engine.getState();
    expect(battle.concluded).toBe(true);
    expect(battle.won).toBe(true);
    expect(state.ensemble.members.some(m => m.name === 'Oliver')).toBe(true);
    expect(state.ensemble.tier).toBe('duet');
    expect(state.dialogue?.speaker).toContain('Audition Triumphant');
  });
});
