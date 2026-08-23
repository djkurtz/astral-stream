import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { soundEngine } from '../src/audio';
import { INITIAL_WORLD_NPCS } from '../src/data';

describe('Harmonipet Audio & Button Tune Alignment', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Maestro');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should ensure wild creatures have explicit instrumentId defined matching their instrumentName', () => {
    const wildNpcs = INITIAL_WORLD_NPCS.filter(n => n.actionType === 'wild_harmonipet');
    expect(wildNpcs.length).toBeGreaterThan(0);

    for (const npc of wildNpcs) {
      const data = npc.wildPetData;
      expect(data).toBeDefined();
      expect(data?.instrumentId, `Wild pet ${data?.name} (${data?.species}) missing instrumentId`).toBeDefined();
    }
  });

  it('should ensure button note playback uses the exact same instrument timbre as the tune given', () => {
    const playInstrumentSpy = vi.spyOn(soundEngine, 'playInstrumentNote');

    // Test a melodic pet encounter (e.g. Cantabile Swan with violin)
    const swanNpc = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_wild_swan_cavatina')!;
    expect(swanNpc).toBeDefined();

    engine.startHarmonizeEncounter(swanNpc);
    const enc = engine.getState().harmonizeEncounter!;
    expect(enc).toBeDefined();
    expect(enc.instrumentId).toBe('violin');

    // Clear playing melody flag to allow player interaction in test
    enc.isPlayingMelody = false;
    playInstrumentSpy.mockClear();

    // Clicking a button (noteIndex 0) should play the exact same instrument (violin) at C4 (261.63Hz)
    engine.playHarmonizeNote(0);

    expect(playInstrumentSpy).toHaveBeenCalledWith(
      'violin',
      261.63,
      expect.any(Number),
      expect.any(Number)
    );
  });

  it('should ensure non-traditional percussion pets (typewriter & cannon) play authentic multi-timbre sounds on buttons', () => {
    const playPercussionSpy = vi.spyOn(soundEngine, 'playHarmonizePercussion');

    // 1. Typewriter Woodpecker
    const typewriterNpc = INITIAL_WORLD_NPCS.find(n => n.wildPetData?.instrumentId === 'typewriter')!;
    expect(typewriterNpc).toBeDefined();

    engine.startHarmonizeEncounter(typewriterNpc);
    let enc = engine.getState().harmonizeEncounter!;
    expect(enc.pet.instrumentId).toBe('typewriter');
    enc.isPlayingMelody = false;

    playPercussionSpy.mockClear();
    engine.playHarmonizeNote(0); // Key Clack
    expect(playPercussionSpy).toHaveBeenCalledWith(0, expect.any(Number), 'typewriter');

    engine.playHarmonizeNote(3); // Margin Bell
    expect(playPercussionSpy).toHaveBeenCalledWith(3, expect.any(Number), 'typewriter');

    // 2. Bombardier Beetle Cannon
    const cannonNpc = INITIAL_WORLD_NPCS.find(n => n.wildPetData?.instrumentId === 'cannon')!;
    expect(cannonNpc).toBeDefined();

    engine.startHarmonizeEncounter(cannonNpc);
    enc = engine.getState().harmonizeEncounter!;
    expect(enc.pet.instrumentId).toBe('cannon');
    enc.isPlayingMelody = false;

    playPercussionSpy.mockClear();
    engine.playHarmonizeNote(0); // Fuse Spark
    expect(playPercussionSpy).toHaveBeenCalledWith(0, expect.any(Number), 'cannon');

    engine.playHarmonizeNote(3); // Artillery Cannon
    expect(playPercussionSpy).toHaveBeenCalledWith(3, expect.any(Number), 'cannon');
  });

  it('should ensure melodic pets with different sections (flute, saxophone, guitar) maintain pitch-accurate button responses', () => {
    const playInstrumentSpy = vi.spyOn(soundEngine, 'playInstrumentNote');

    // Saxophone Fox
    const saxNpc = INITIAL_WORLD_NPCS.find(n => n.wildPetData?.instrumentId === 'saxophone')!;
    expect(saxNpc).toBeDefined();

    engine.startHarmonizeEncounter(saxNpc);
    let enc = engine.getState().harmonizeEncounter!;
    expect(enc.instrumentId).toBe('saxophone');
    enc.isPlayingMelody = false;

    playInstrumentSpy.mockClear();
    engine.playHarmonizeNote(1); // E4
    expect(playInstrumentSpy).toHaveBeenCalledWith('saxophone', 329.63, expect.any(Number), expect.any(Number));

    // Harpsichord Chameleon
    const harpsichordNpc = INITIAL_WORLD_NPCS.find(n => n.wildPetData?.instrumentId === 'harpsichord')!;
    expect(harpsichordNpc).toBeDefined();

    engine.startHarmonizeEncounter(harpsichordNpc);
    enc = engine.getState().harmonizeEncounter!;
    expect(enc.instrumentId).toBe('harpsichord');
    enc.isPlayingMelody = false;

    playInstrumentSpy.mockClear();
    engine.playHarmonizeNote(2); // G4
    expect(playInstrumentSpy).toHaveBeenCalledWith('harpsichord', 392.00, expect.any(Number), expect.any(Number));
  });
});
