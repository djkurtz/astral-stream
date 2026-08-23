import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { calculateEffectiveSkill } from '../src/data';

describe('Multi-Instrument Mastery, Harmonipet Switching & Skill Formulas', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Maestro');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should initialize player proficiency with starter instrument', () => {
    const state = engine.getState();
    const player = state.ensemble.members[0];

    expect(state.proficiency.unlockedInstruments).toContain('violin');
    expect(state.proficiency.sections.strings).toBe(40);
    expect(state.proficiency.instruments.violin.level).toBe(1);

    const skill = calculateEffectiveSkill(player, state.proficiency, 'violin');
    expect(skill).toBeGreaterThan(0);
    expect(typeof skill).toBe('number');
  });

  it('should calculate effective skill combining general musicianship, section proficiency, and instrument mastery', () => {
    const state = engine.getState();
    const player = state.ensemble.members[0];

    // Set controlled test stats
    player.stats.technique = 60;
    player.stats.toneQuality = 60;
    player.stats.tempoStability = 60;
    player.stats.sightReading = 60;
    // General Musicianship = (60+60+60+60)/4 = 60 (Weight 50% = 30)

    state.proficiency.sections.strings = 50; // Weight 30% = 15
    state.proficiency.instruments.violin = { level: 4, xp: 0 }; // Level 4 * 10 = 40 (Weight 20% = 8)

    const effectiveSkill = calculateEffectiveSkill(player, state.proficiency, 'violin');
    expect(effectiveSkill).toBe(30 + 15 + 8); // 53
  });

  it('should allow switching between unlocked instruments and updating avatar/section', () => {
    const state = engine.getState();
    const player = state.ensemble.members[0];

    // Unlock silver flute
    state.proficiency.unlockedInstruments.push('silver_flute');
    state.proficiency.sections.woodwinds = 35;
    state.proficiency.instruments.silver_flute = { level: 2, xp: 0 };

    engine.switchPlayerInstrument('silver_flute');

    expect(player.instrumentId).toBe('silver_flute');
    expect(player.instrumentName).toBe('Silver Concert Flute');
    expect(player.section).toBe('woodwinds');
    expect(player.avatar).toBe('🪈');
  });

  it('should allow switching companion Harmonipet from bonded collection', () => {
    const state = engine.getState();
    const player = state.ensemble.members[0];

    // Bond another pet in Dex
    const hareDex = state.harmoniDex.find(d => d.id === 'dex_hare')!;
    hareDex.discovered = true;
    hareDex.bonded = true;

    engine.switchPlayerPet('dex_hare');

    expect(player.pet.species).toBe('Vivace Hare');
    expect(player.pet.name).toBe('Vivace');
  });
});
