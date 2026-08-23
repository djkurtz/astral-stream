import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { STARTER_OPTIONS } from '../src/data';

describe('Harmonia: Starter Selection & Customization', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
  });

  it('should initialize in character customization mode with 4 distinct section starters', () => {
    const state = engine.getState();
    expect(state.mode).toBe('character_customization');
    expect(STARTER_OPTIONS.length).toBe(4);

    const sections = STARTER_OPTIONS.map(s => s.section);
    expect(sections).toContain('strings');
    expect(sections).toContain('woodwinds');
    expect(sections).toContain('brass');
    expect(sections).toContain('percussion');
  });

  it('should select Violin starter and bond with Allegro Swan', () => {
    engine.chooseStarter('violin', 'Aria');
    const state = engine.getState();

    expect(state.mode).toBe('exploration');
    expect(state.ensemble.members.length).toBe(1);

    const player = state.ensemble.members[0];
    expect(player.name).toBe('Aria');
    expect(player.instrumentId).toBe('violin');
    expect(player.section).toBe('strings');
    expect(player.pet.name).toBe('Allegro');
    expect(player.pet.species).toBe('Allegro Swan');
    expect(player.stats.technique).toBe(25);
  });

  it('should select Snare starter and bond with Beat Raccoon', () => {
    engine.chooseStarter('snare_kit', 'Rhythm');
    const state = engine.getState();

    const player = state.ensemble.members[0];
    expect(player.name).toBe('Rhythm');
    expect(player.instrumentId).toBe('snare_kit');
    expect(player.section).toBe('percussion');
    expect(player.pet.name).toBe('Tempo');
    expect(player.pet.species).toBe('Beat Raccoon');
    expect(player.stats.tempoStability).toBe(30);
  });
});
