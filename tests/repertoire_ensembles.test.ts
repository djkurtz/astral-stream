import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { REPERTOIRE_DATABASE, RIVAL_ENSEMBLES } from '../src/data';

describe('Harmonia: Repertoire, Sheet Music & Concert Competitions', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('pocket_trumpet', 'Baron');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should initialize with starter solo piece and expand when discovering sheet music', () => {
    const state = engine.getState();
    expect(state.repertoire.length).toBe(1);
    expect(state.repertoire[0].id).toBe('piece_minuet');

    // Interact with historic music stand
    const stand = state.npcs.find(n => n.id === 'npc_music_stand_1')!;
    state.player.x = stand.x;
    state.player.y = stand.y;
    engine.updateProximity();
    engine.interactWithNearby();

    expect(state.repertoire.length).toBe(2);
    expect(state.repertoire.some(p => p.id === 'piece_cavatina_duet')).toBe(true);
  });

  it('should start and complete concert competition and award Reputation Stars', () => {
    engine.startConcertCompetition('rival_novice_buskers');
    const state = engine.getState();

    expect(state.mode).toBe('competition');
    expect(state.competition).not.toBeNull();
    expect(state.competition?.rival.name).toContain('Cavatina');

    // Advance all measures
    while (state.competition && !state.competition.concluded) {
      engine.advanceConcertPerformance();
    }

    expect(state.competition?.concluded).toBe(true);
    expect(state.ensemble.reputationStars).toBeGreaterThanOrEqual(1);
    expect(state.dialogue?.speaker).toContain('Concert Results');
  });
});
