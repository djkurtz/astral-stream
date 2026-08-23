import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { INITIAL_HARMONIDEX, INITIAL_WORLD_NPCS, ALL_INSTRUMENTS_INFO, INSTRUMENT_BATTLE_MOVES } from '../src/data';
import { soundEngine } from '../src/audio';
import { InstrumentId } from '../src/types';

describe('Non-Traditional Instruments & Wild Harmonipet Encounters', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Maestro');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should verify all 5 non-traditional instruments are registered in InstrumentId and metadata', () => {
    const expectedInstruments: InstrumentId[] = [
      'harpsichord',
      'electric_guitar',
      'saxophone',
      'typewriter',
      'cannon'
    ];

    expectedInstruments.forEach(inst => {
      expect(ALL_INSTRUMENTS_INFO[inst], `Metadata missing for ${inst}`).toBeDefined();
      expect(ALL_INSTRUMENTS_INFO[inst].name.length).toBeGreaterThan(0);
      expect(ALL_INSTRUMENTS_INFO[inst].description.length).toBeGreaterThan(0);
      expect(INSTRUMENT_BATTLE_MOVES[inst], `Battle moves missing for ${inst}`).toBeDefined();
      expect(INSTRUMENT_BATTLE_MOVES[inst].move1.power).toBeGreaterThan(0);
      expect(INSTRUMENT_BATTLE_MOVES[inst].move2.power).toBeGreaterThan(0);
    });

    // Also verify soprano_sax is maintained alongside saxophone
    expect(ALL_INSTRUMENTS_INFO['soprano_sax']).toBeDefined();
  });

  it('should verify the 5 new wild animals exist in INITIAL_HARMONIDEX with correct attributes', () => {
    const expectedCreatures = [
      { id: 'dex_chameleon', species: 'Clavichord Chameleon', inst: 'harpsichord', section: 'strings' },
      { id: 'dex_rock_hedgehog', species: 'Rockabilly Hedgehog', inst: 'electric_guitar', section: 'strings' },
      { id: 'dex_sax_fox', species: 'Bebop Fox', inst: 'saxophone', section: 'woodwinds' },
      { id: 'dex_typewriter_bird', species: 'Typist Woodpecker', inst: 'typewriter', section: 'percussion' },
      { id: 'dex_cannon_beetle', species: 'Bombardier Beetle', inst: 'cannon', section: 'percussion' },
    ];

    expectedCreatures.forEach(c => {
      const entry = INITIAL_HARMONIDEX.find(d => d.id === c.id);
      expect(entry, `HarmoniDex entry missing for ${c.id}`).toBeDefined();
      expect(entry?.species).toBe(c.species);
      expect(entry?.instrumentId).toBe(c.inst);
      expect(entry?.section).toBe(c.section);
      expect(entry?.sprite.length).toBeGreaterThan(0);
    });
  });

  it('should verify wild encounter NPCs are placed across the 4 wilderness biomes', () => {
    const wildNPCs = [
      { id: 'npc_wild_chameleon_west', zone: 'west_wilderness', species: 'Clavichord Chameleon', inst: 'harpsichord' },
      { id: 'npc_wild_hedgehog_west', zone: 'west_wilderness', species: 'Rockabilly Hedgehog', inst: 'electric_guitar' },
      { id: 'npc_wild_sax_fox_east', zone: 'east_wilderness', species: 'Bebop Fox', inst: 'saxophone' },
      { id: 'npc_wild_cannon_beetle_north', zone: 'north_wilderness', species: 'Bombardier Beetle', inst: 'cannon' },
      { id: 'npc_wild_typewriter_bird_south', zone: 'south_wilderness', species: 'Typist Woodpecker', inst: 'typewriter' }
    ];

    wildNPCs.forEach(w => {
      const npc = INITIAL_WORLD_NPCS.find(n => n.id === w.id);
      expect(npc, `NPC ${w.id} not found in INITIAL_WORLD_NPCS`).toBeDefined();
      expect(npc?.zone).toBe(w.zone);
      expect(npc?.actionType).toBe('wild_harmonipet');
      expect(npc?.wildPetData?.species).toBe(w.species);
      expect(npc?.wildPetData?.instrumentId).toBe(w.inst);
      expect(npc?.dialogue[0].length).toBeGreaterThan(15);
    });
  });

  it('should support audio synthesis calls for all 5 non-traditional instruments and wildlife calls without crashing', () => {
    expect(() => {
      soundEngine.playInstrumentNote('harpsichord', 440, 0.3, 0.8);
      soundEngine.playInstrumentNote('electric_guitar', 220, 0.4, 0.85);
      soundEngine.playInstrumentNote('saxophone', 330, 0.35, 0.8);
      soundEngine.playInstrumentNote('soprano_sax', 330, 0.35, 0.8);
      soundEngine.playInstrumentNote('typewriter', 440, 0.2, 0.8);
      soundEngine.playInstrumentNote('cannon', 65.4, 0.8, 1.0);
    }).not.toThrow();

    expect(() => {
      soundEngine.playWildlifeCall('clavichord chameleon');
      soundEngine.playWildlifeCall('rockabilly hedgehog');
      soundEngine.playWildlifeCall('bebop fox');
      soundEngine.playWildlifeCall('typist woodpecker');
      soundEngine.playWildlifeCall('bombardier beetle');
    }).not.toThrow();
  });

  it('should engage in a wild harmonize encounter with the Bombardier Beetle and unlock the Cannon', () => {
    const state = engine.getState();
    const cannonNpc = state.npcs.find(n => n.id === 'npc_wild_cannon_beetle_north')!;
    expect(cannonNpc).toBeDefined();

    engine.startHarmonizeEncounter(cannonNpc);
    expect(state.mode).toBe('harmonize_wild');
    expect(state.harmonizeEncounter).not.toBeNull();
    expect(state.harmonizeEncounter?.instrumentId).toBe('cannon');
    expect(state.harmonizeEncounter?.pet.species).toBe('Bombardier Beetle');

    // Complete cadence in performance phase to bond with the pet
    engine.startPerformancePhase();
    state.harmonizeEncounter!.isPlayingMelody = false;
    const targetSteps = state.harmonizeEncounter!.targetNoteIndices;
    expect(targetSteps.length).toBe(8); // Legendary/Exotic has 8 notes
    targetSteps.forEach(noteIdx => {
      engine.playHarmonizeNote(noteIdx);
    });

    expect(state.harmonizeEncounter?.concluded).toBe(true);
    expect(state.harmonizeEncounter?.caught).toBe(true);

    const beetleDex = state.harmoniDex.find(d => d.id === 'dex_cannon_beetle')!;
    expect(beetleDex.discovered).toBe(true);
    expect(beetleDex.bonded).toBe(true);
    expect(state.proficiency.unlockedInstruments).toContain('cannon');
  });
});
