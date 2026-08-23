import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { INITIAL_WORLD_NPCS } from '../src/data';

describe('Central Plaza Pianist Busking Competition & Concerto Accompaniment', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Maestro');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should station Maestro Franz "Keys" Liszt at Central Plaza (grand_hall at x: 1200, y: 1140)', () => {
    const franzNpc = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_pianist_busker');
    expect(franzNpc).toBeDefined();
    expect(franzNpc?.name).toBe('Maestro Franz "Keys" Liszt');
    expect(franzNpc?.zone).toBe('grand_hall');
    expect(franzNpc?.x).toBe(1200);
    expect(franzNpc?.y).toBe(1140);
    expect(franzNpc?.actionType).toBe('pianist_busking_duel');
    expect(franzNpc?.musicianData?.avatar).toBe('🎹');
    expect(franzNpc?.musicianData?.instrumentName).toBe('Concert Grand Piano');
  });

  it('should initialize busking state with 0 wins and false accompaniment', () => {
    const state = engine.getState();
    expect(state.pianistBuskingWins).toBe(0);
    expect(state.hasPianoAccompaniment).toBe(false);
  });

  it('should progress through 3 busking duels scaling in tempo (120, 140, 160 BPM) and award permanent accompaniment', () => {
    const state = engine.getState();
    state.currentZone = 'grand_hall';
    state.player.x = 1200;
    state.player.y = 1140;

    // --- DUEL 1: Novice Busk (120 BPM) ---
    engine.updateProximity();
    engine.interactWithNearby();
    expect(state.dialogue?.speaker).toContain('Maestro Franz');
    while (state.dialogue) {
      engine.advanceDialogue();
    }

    expect(state.mode).toBe('battle_lineup');
    engine.confirmPreBattle();

    expect(state.mode).toBe('competition');
    expect(state.competition?.isPianistDuel).toBe(true);
    expect(state.competition?.duelTier).toBe(1);
    expect(state.competition?.playerPiece.bpm).toBe(120);
    expect(state.competition?.rival.piece.bpm).toBe(120);

    // Complete Duel 1
    while (state.competition && !state.competition.concluded) {
      engine.advanceConcertPerformance();
    }
    expect(state.competition?.concluded).toBe(true);
    expect(state.competition?.won).toBe(true);
    expect(state.pianistBuskingWins).toBe(1);
    expect(state.hasPianoAccompaniment).toBe(false);

    // Dismiss victory dialogue
    while (state.dialogue) {
      engine.advanceDialogue();
    }
    expect(state.mode).toBe('exploration');

    // --- DUEL 2: Virtuoso Etude (140 BPM) ---
    engine.updateProximity();
    engine.interactWithNearby();
    while (state.dialogue) {
      engine.advanceDialogue();
    }

    expect(state.mode).toBe('battle_lineup');
    engine.confirmPreBattle();

    expect(state.mode).toBe('competition');
    expect(state.competition?.isPianistDuel).toBe(true);
    expect(state.competition?.duelTier).toBe(2);
    expect(state.competition?.playerPiece.bpm).toBe(140);
    expect(state.competition?.rival.piece.bpm).toBe(140);

    // Complete Duel 2
    while (state.competition && !state.competition.concluded) {
      engine.advanceConcertPerformance();
    }
    expect(state.competition?.concluded).toBe(true);
    expect(state.competition?.won).toBe(true);
    expect(state.pianistBuskingWins).toBe(2);
    expect(state.hasPianoAccompaniment).toBe(false);

    while (state.dialogue) {
      engine.advanceDialogue();
    }

    // --- DUEL 3: Transcendental Showdown (160 BPM) ---
    engine.updateProximity();
    engine.interactWithNearby();
    while (state.dialogue) {
      engine.advanceDialogue();
    }

    expect(state.mode).toBe('battle_lineup');
    engine.confirmPreBattle();

    expect(state.mode).toBe('competition');
    expect(state.competition?.isPianistDuel).toBe(true);
    expect(state.competition?.duelTier).toBe(3);
    expect(state.competition?.playerPiece.bpm).toBe(160);
    expect(state.competition?.rival.piece.bpm).toBe(160);

    // Complete Duel 3
    while (state.competition && !state.competition.concluded) {
      engine.advanceConcertPerformance();
    }
    expect(state.competition?.concluded).toBe(true);
    expect(state.competition?.won).toBe(true);
    expect(state.pianistBuskingWins).toBe(3);
    expect(state.hasPianoAccompaniment).toBe(true);

    while (state.dialogue) {
      engine.advanceDialogue();
    }

    // Subsequent interaction acknowledges permanent accompaniment
    engine.updateProximity();
    engine.interactWithNearby();
    expect(state.dialogue?.text.some(t => t.includes('+50% score boost'))).toBe(true);
    while (state.dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should grant a massive +50% score boost and crowd resonance surge in concert competitions and festivals', () => {
    // 1. Run a baseline competition without piano accompaniment
    engine.startConcertCompetition('rival_novice_buskers');
    engine.advanceConcertPerformance();
    const baseScore = engine.getState().competition!.playerScore;
    const baseApplause = engine.getState().competition!.audienceApplause;

    // Reset
    while (engine.getState().competition && !engine.getState().competition!.concluded) {
      engine.advanceConcertPerformance();
    }
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }

    // 2. Enable Piano Accompaniment
    engine.getState().hasPianoAccompaniment = true;
    engine.startConcertCompetition('rival_novice_buskers');
    engine.advanceConcertPerformance();
    const boostedScore = engine.getState().competition!.playerScore;
    const boostedApplause = engine.getState().competition!.audienceApplause;

    // Score should be approximately 1.5x (50% boost)
    expect(boostedScore).toBe(Math.round(baseScore * 1.5));
    // Audience applause should have extra surge (+5)
    expect(boostedApplause).toBeGreaterThan(baseApplause);
  });

  it('should persist pianist busking wins and accompaniment perk across save and load', () => {
    const state = engine.getState();
    state.pianistBuskingWins = 3;
    state.hasPianoAccompaniment = true;

    expect(engine.saveGame()).toBe(true);

    // Reset state
    const newEngine = new HarmoniaGameEngine();
    expect(newEngine.getState().hasPianoAccompaniment).toBe(false);
    expect(newEngine.loadGame()).toBe(true);
    expect(newEngine.getState().pianistBuskingWins).toBe(3);
    expect(newEngine.getState().hasPianoAccompaniment).toBe(true);
  });
});
