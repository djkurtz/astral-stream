import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { RIVAL_ENSEMBLES } from '../src/data';

describe('Villages, Wilderness & Escalating Busker Progression', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Maestro');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should verify each village and wilderness zone has its own distinct busker stage, soloist, and theory exam', () => {
    const state = engine.getState();
    const zones = ['cavatina_village', 'woodwind_woods', 'brass_citadel', 'percussion_peaks'];

    for (const zoneId of zones) {
      const zoneNpcs = state.npcs.filter(n => n.zone === zoneId);
      
      // Every zone must have a soloist for auditions
      const soloist = zoneNpcs.find(n => n.actionType === 'audition_battle');
      expect(soloist, `Zone ${zoneId} should have a soloist`).toBeDefined();

      // Every zone must have a busker stage for competitions
      const buskerStage = zoneNpcs.find(n => n.actionType === 'competition_stage');
      expect(buskerStage, `Zone ${zoneId} should have a busker stage`).toBeDefined();
      expect(buskerStage?.rivalId).toBeDefined();

      // Every zone must have a theory exam lectern
      const theoryBench = zoneNpcs.find(n => n.actionType === 'theory_bench');
      expect(theoryBench, `Zone ${zoneId} should have a theory exam bench`).toBeDefined();
      expect(theoryBench?.theoryType).toBeDefined();
    }
  });

  it('should verify wilderness zones have wild Harmonipets and inspiration vistas to explore', () => {
    const state = engine.getState();
    const wildernessZones = ['woodwind_woods', 'brass_citadel', 'percussion_peaks'];

    for (const zoneId of wildernessZones) {
      // Must have wild Harmonipets
      const wildPets = state.npcs.filter(n => n.zone === zoneId && n.actionType === 'wild_harmonipet');
      expect(wildPets.length, `Zone ${zoneId} should have at least 2 wild pets`).toBeGreaterThanOrEqual(2);

      // Must have inspiration vistas
      const vistas = state.vistas.filter(v => v.zone === zoneId);
      expect(vistas.length, `Zone ${zoneId} should have at least 2 inspiration vistas`).toBeGreaterThanOrEqual(2);
    }
  });

  it('should ramp up busker difficulty across tiers requiring improved ensembles', () => {
    expect(RIVAL_ENSEMBLES.length).toBe(5);

    // Tier 1: Cavatina (Solo)
    expect(RIVAL_ENSEMBLES[0].tier).toBe('solo');
    expect(RIVAL_ENSEMBLES[0].reputationRequired).toBe(0);
    const power0 = RIVAL_ENSEMBLES[0].members.reduce((acc, m) => acc + (m.stats.technique + m.stats.toneQuality), 0);

    // Tier 2: Woodwinds (Trio)
    expect(RIVAL_ENSEMBLES[1].tier).toBe('trio');
    expect(RIVAL_ENSEMBLES[1].reputationRequired).toBe(1);
    const power1 = RIVAL_ENSEMBLES[1].members.reduce((acc, m) => acc + (m.stats.technique + m.stats.toneQuality), 0);
    expect(power1).toBeGreaterThan(power0);

    // Tier 3: Citadel (Quartet)
    expect(RIVAL_ENSEMBLES[2].tier).toBe('quartet');
    expect(RIVAL_ENSEMBLES[2].reputationRequired).toBe(3);
    const power2 = RIVAL_ENSEMBLES[2].members.reduce((acc, m) => acc + (m.stats.technique + m.stats.toneQuality), 0);
    expect(power2).toBeGreaterThan(power1);

    // Tier 4: Peaks (Chamber)
    expect(RIVAL_ENSEMBLES[3].tier).toBe('chamber');
    expect(RIVAL_ENSEMBLES[3].reputationRequired).toBe(5);
    const power3 = RIVAL_ENSEMBLES[3].members.reduce((acc, m) => acc + (m.stats.technique + m.stats.toneQuality), 0);
    expect(power3).toBeGreaterThan(power2);

    // Tier 5: Grand Hall (Orchestra)
    expect(RIVAL_ENSEMBLES[4].tier).toBe('orchestra');
    expect(RIVAL_ENSEMBLES[4].reputationRequired).toBe(7);
    const power4 = RIVAL_ENSEMBLES[4].members.reduce((acc, m) => acc + (m.stats.technique + m.stats.toneQuality), 0);
    expect(power4).toBeGreaterThan(power3);
  });

  it('should interact with zone-specific buskers and theory exam triggers', () => {
    const state = engine.getState();
    
    // Find Woodwinds Busker
    const sylvanNpc = state.npcs.find(n => n.id === 'npc_sylvan_grove')!;
    expect(sylvanNpc).toBeDefined();
    state.currentZone = sylvanNpc.zone;
    state.player.x = sylvanNpc.x;
    state.player.y = sylvanNpc.y;
    engine.updateProximity();
    engine.interactWithNearby();

    expect(state.mode).toBe('competition');
    expect(state.competition?.rival.id).toBe('rival_woodwind_trio');

    // Return to exploration
    state.mode = 'exploration';

    // Find Citadel Theory Exam
    const citadelExam = state.npcs.find(n => n.id === 'npc_theory_citadel')!;
    expect(citadelExam).toBeDefined();
    state.currentZone = citadelExam.zone;
    state.player.x = citadelExam.x;
    state.player.y = citadelExam.y;
    engine.updateProximity();
    engine.interactWithNearby();

    expect(state.mode).toBe('theory_challenge');
    expect(state.theoryChallenge?.type).toBe('triads_chords');
  });
});
