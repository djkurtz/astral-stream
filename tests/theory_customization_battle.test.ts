import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';

describe('Harmonia: Theory Challenges, Customization & Tactical Street Battles', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Orpheus');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should support player, pet, and instrument finish customization', () => {
    const state = engine.getState();
    expect(state.customization.hatStyle).toBe('beret');
    expect(state.customization.instrumentFinish).toBe('classic_amber');

    engine.setCustomization({
      hatStyle: 'maestro',
      outfitColor: '#4f46e5',
      instrumentFinish: 'gilded_gold',
      petTint: '#f43f5e'
    });

    expect(state.customization.hatStyle).toBe('maestro');
    expect(state.customization.outfitColor).toBe('#4f46e5');
    expect(state.customization.instrumentFinish).toBe('gilded_gold');
    expect(state.customization.petTint).toBe('#f43f5e');
  });

  it('should launch a music theory challenge, evaluate answers, and award Sight-Reading XP', () => {
    engine.startTheoryChallenge('pitch_recognition');
    const state = engine.getState();

    expect(state.mode).toBe('theory_challenge');
    expect(state.theoryChallenge).not.toBeNull();
    expect(state.theoryChallenge?.questions.length).toBe(3);

    const initialRdg = state.ensemble.members[0].stats.sightReading;

    while (state.theoryChallenge && !state.theoryChallenge.completed) {
      const q = state.theoryChallenge.questions[state.theoryChallenge.currentQuestionIndex];
      engine.answerTheoryQuestion(q.correctIndex);
      while (state.dialogue) engine.advanceDialogue();
    }

    expect(state.mode).toBe('exploration');
    expect(state.theoryChallenge).toBeNull();
    expect(state.ensemble.members[0].stats.sightReading).toBeGreaterThan(initialRdg);
    expect(state.wallet.inspirationSparks).toBeGreaterThan(10);
  });

  it('should execute tactical street battles with Pianissimo Shield and Fortissimo Surge', () => {
    const state = engine.getState();
    const claraNpc = state.npcs.find(n => n.id === 'npc_clara_world')!;
    expect(claraNpc).toBeDefined();

    engine.startAuditionBattle(claraNpc);
    expect(state.mode).toBe('audition_battle');
    expect(state.auditionBattle?.playerStance).toBe('normal');

    // Use Pianissimo Shield (Move 3)
    engine.executeBattleMove('pianissimo_shield');
    expect(state.auditionBattle?.playerStance).toBe('pianissimo_shield');
    expect(state.auditionBattle?.log.some(l => l.includes('Pianissimo Shield'))).toBe(true);

    // Use Fortissimo Surge (Move 4)
    state.auditionBattle!.turn = 'player';
    engine.executeBattleMove('fortissimo_surge');
    expect(state.auditionBattle?.playerStance).toBe('fortissimo_surge');

    // Unleash attack with doubled power
    state.auditionBattle!.turn = 'player';
    const meterBefore = state.auditionBattle!.playerHarmonyMeter;
    engine.executeBattleMove('counterpoint_weave');
    expect(state.auditionBattle!.playerHarmonyMeter).toBeGreaterThan(meterBefore + 25);
  });
});
