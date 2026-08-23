import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';

describe('Harmonia: Pokémon-Style Arc (HarmoniDex, Wild Bonding & League Badges)', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Ash');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should register starter species in the HarmoniDex upon boot', () => {
    const state = engine.getState();
    expect(state.harmoniDex.length).toBe(16); // 4 per section
    expect(state.badges.length).toBe(8); // 8 Conservatory Badges

    const swan = state.harmoniDex.find(d => d.id === 'dex_swan')!;
    expect(swan.discovered).toBe(true);
    expect(swan.bonded).toBe(true);
    expect(swan.species).toBe('Allegro Swan');
  });

  it('should engage with a wild Harmonipet and bond with it via harmonic resonance', () => {
    const state = engine.getState();
    const wildHareNpc = state.npcs.find(n => n.id === 'npc_wild_hare')!;
    expect(wildHareNpc).toBeDefined();

    state.player.x = wildHareNpc.x;
    state.player.y = wildHareNpc.y;
    engine.updateProximity();
    engine.interactWithNearby();

    expect(state.mode).toBe('harmonize_wild');
    expect(state.harmonizeEncounter).not.toBeNull();
    expect(state.harmonizeEncounter?.pet.species).toBe('Vivace Hare');

    // Play cadence notes to fill resonance meter
    state.harmonizeEncounter!.isPlayingMelody = false;
    engine.playHarmonizeNote(0);
    engine.playHarmonizeNote(1);
    engine.playHarmonizeNote(2);

    expect(state.harmonizeEncounter?.concluded).toBe(true);
    expect(state.harmonizeEncounter?.caught).toBe(true);

    const hareDex = state.harmoniDex.find(d => d.id === 'dex_hare')!;
    expect(hareDex.discovered).toBe(true);
    expect(hareDex.bonded).toBe(true);
    expect(state.ensemble.members.some(m => m.name === 'Vivace')).toBe(true);
  });

  it('should award Conservatory Clef Badges upon conquering concert showdowns', () => {
    const state = engine.getState();
    expect(state.badges.filter(b => b.obtained).length).toBe(0);

    engine.startConcertCompetition('rival_novice_buskers');

    while (state.competition && !state.competition.concluded) {
      engine.advanceConcertPerformance();
    }

    expect(state.badges[0].obtained).toBe(true);
    expect(state.badges[0].name).toBe('Prelude Clef');
  });
});
