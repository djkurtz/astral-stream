import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { RECRUITABLE_MUSICIANS } from '../src/data';

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

  it('should execute battle moves, consume Harmony Points, and surge the Harmony Meter', () => {
    const claraNpc = engine.getState().npcs.find(n => n.id === 'npc_clara_world')!;
    engine.startAuditionBattle(claraNpc);

    const battle = engine.getState().auditionBattle!;
    const initialHP = battle.harmonyPoints;
    const initialHarmony = battle.playerHarmonyMeter;

    engine.executeBattleMove('counterpoint_weave');

    expect(battle.harmonyPoints).toBeLessThan(initialHP);
    expect(battle.playerHarmonyMeter).toBeGreaterThan(initialHarmony);
    expect(battle.log.length).toBeGreaterThan(2);
  });

  it('should resolve victory upon reaching 100% Harmony and recruit the musician into the ensemble', () => {
    const oliverNpc = engine.getState().npcs.find(n => n.id === 'npc_oliver_world')!;
    engine.startAuditionBattle(oliverNpc);

    const battle = engine.getState().auditionBattle!;
    battle.playerHarmonyMeter = 95;

    engine.executeBattleMove('vibrato_charm');

    const state = engine.getState();
    expect(battle.concluded).toBe(true);
    expect(battle.won).toBe(true);
    expect(state.ensemble.members.some(m => m.name === 'Oliver')).toBe(true);
    expect(state.ensemble.tier).toBe('duet');
    expect(state.dialogue?.speaker).toContain('Audition Triumphant');
  });
});
