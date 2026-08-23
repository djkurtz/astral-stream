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

  it('should accurately calculate ensemble playability requirements and missing instrumentation', () => {
    const state = engine.getState();
    const duetPiece = REPERTOIRE_DATABASE.find(p => p.id === 'piece_cavatina_duet')!;
    const minuetPiece = REPERTOIRE_DATABASE.find(p => p.id === 'piece_minuet')!;
    const quartetPiece = REPERTOIRE_DATABASE.find(p => p.id === 'piece_starlight_quartet')!;

    // Initial ensemble is 1 solo brass player
    const ensembleSections: Record<string, number> = { strings: 0, woodwinds: 0, brass: 0, percussion: 0 };
    state.ensemble.members.forEach(m => { ensembleSections[m.section] = (ensembleSections[m.section] || 0) + 1; });
    expect(ensembleSections.brass).toBe(1);

    // Minuet has no specific section requirements (playable by any solo instrument)
    const canPlayMinuet = Object.entries(minuetPiece.requiredSections).every(([sec, count]) => (ensembleSections[sec] || 0) >= count!);
    expect(canPlayMinuet).toBe(true);

    // Cavatina Duet requires 1 strings and 1 woodwinds (not playable by solo brass)
    const canPlayDuet = Object.entries(duetPiece.requiredSections).every(([sec, count]) => (ensembleSections[sec] || 0) >= count!);
    expect(canPlayDuet).toBe(false);

    // Recruit cello (strings) and flute (woodwinds)
    state.ensemble.members.push({
      id: 'test_cello',
      name: 'Cellist Clara',
      instrumentId: 'cello',
      instrumentName: 'Cello',
      section: 'strings',
      paletteColor: '#f97316',
      avatar: '🎻',
      stats: { technique: 45, toneQuality: 50, tempoStability: 40, sightReading: 48 },
      pet: { id: 'p1', name: 'Baron', species: 'fox', affinity: 'strings', loyaltyLevel: 1 }
    });
    state.ensemble.members.push({
      id: 'test_flute',
      name: 'Flutist Fiona',
      instrumentId: 'silver_flute',
      instrumentName: 'Silver Flute',
      section: 'woodwinds',
      paletteColor: '#10b981',
      avatar: '🪈',
      stats: { technique: 42, toneQuality: 48, tempoStability: 45, sightReading: 50 },
      pet: { id: 'p2', name: 'Breeze', species: 'nightingale', affinity: 'woodwinds', loyaltyLevel: 1 }
    });

    const updatedSections: Record<string, number> = { strings: 0, woodwinds: 0, brass: 0, percussion: 0 };
    state.ensemble.members.forEach(m => { updatedSections[m.section] = (updatedSections[m.section] || 0) + 1; });

    const canPlayDuetNow = Object.entries(duetPiece.requiredSections).every(([sec, count]) => (updatedSections[sec] || 0) >= count!);
    expect(canPlayDuetNow).toBe(true);

    // Quartet still requires 2 strings, 1 brass, 1 woodwinds (we currently have 1 string, 1 brass, 1 woodwind)
    const canPlayQuartet = Object.entries(quartetPiece.requiredSections).every(([sec, count]) => (updatedSections[sec] || 0) >= count!);
    expect(canPlayQuartet).toBe(false);
  });
});
