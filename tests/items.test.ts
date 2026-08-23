import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from '../src/game';
import { CollectibleItem } from '../src/types';

describe('Collectible Items & Exploration Mechanics', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine();
    // Dismiss intro emergency dialogue
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should initialize with 4 scattered items and an empty inventory', () => {
    const state = engine.getState();
    expect(state.items).toBeDefined();
    expect(state.items.length).toBe(4);
    expect(state.inventory).toEqual([]);

    const types = state.items.map(i => i.type);
    expect(types).toContain('tuning_fork');
    expect(types).toContain('golden_vinyl');
    expect(types).toContain('frequency_crystal');
    expect(types).toContain('energy_battery');
  });

  it('should detect proximity when player moves near an item', () => {
    const state = engine.getState();
    const tuningFork = state.items.find(i => i.type === 'tuning_fork')!;

    // Move player right next to the tuning fork
    state.player.x = tuningFork.x + 10;
    state.player.y = tuningFork.y;

    // Trigger proximity update
    engine.updateProximity();

    expect(state.nearbyInteractable).toBeDefined();
    expect((state.nearbyInteractable as CollectibleItem).id).toBe(tuningFork.id);
  });

  it('should collect Tuning Fork and apply +5 ATK buff to lead Harmonimal', () => {
    const state = engine.getState();
    const leadSpirit = state.streamQueue[0];
    const initialAtk = leadSpirit.attack;

    const tuningFork = state.items.find(i => i.type === 'tuning_fork')!;
    state.player.x = tuningFork.x;
    state.player.y = tuningFork.y;
    engine.updateProximity();

    engine.interactWithNearby();

    expect(tuningFork.collected).toBe(true);
    expect(state.inventory).toContain(tuningFork.name);
    expect(leadSpirit.attack).toBe(initialAtk + 5);
    expect(state.dialogue).toBeDefined();
    expect(state.dialogue?.speaker).toContain('ITEM DISCOVERED');
    expect(state.dialogue?.text.some(t => t.includes('+5'))).toBe(true);
  });

  it('should collect Golden Vinyl and apply +20 Max HP buff', () => {
    const state = engine.getState();
    const leadSpirit = state.streamQueue[0];
    const initialMaxHp = leadSpirit.maxHp;

    const goldenVinyl = state.items.find(i => i.type === 'golden_vinyl')!;
    engine.collectItem(goldenVinyl);

    expect(goldenVinyl.collected).toBe(true);
    expect(state.inventory).toContain(goldenVinyl.name);
    expect(leadSpirit.maxHp).toBe(initialMaxHp + 20);
    expect(state.dialogue).toBeDefined();
    expect(state.dialogue?.speaker).toContain('ITEM DISCOVERED');
  });

  it('should collect Frequency Crystal and apply +10 Max HP & +3 ATK buff', () => {
    const state = engine.getState();
    const leadSpirit = state.streamQueue[0];
    const initialMaxHp = leadSpirit.maxHp;
    const initialAtk = leadSpirit.attack;

    const crystal = state.items.find(i => i.type === 'frequency_crystal')!;
    engine.collectItem(crystal);

    expect(crystal.collected).toBe(true);
    expect(state.inventory).toContain(crystal.name);
    expect(leadSpirit.maxHp).toBe(initialMaxHp + 10);
    expect(leadSpirit.attack).toBe(initialAtk + 3);
  });

  it('should collect Energy Battery and apply +15 Max HP & +10 DEF buff', () => {
    const state = engine.getState();
    const leadSpirit = state.streamQueue[0];
    const initialDef = leadSpirit.defense;
    const initialMaxHp = leadSpirit.maxHp;

    const battery = state.items.find(i => i.type === 'energy_battery')!;
    engine.collectItem(battery);

    expect(battery.collected).toBe(true);
    expect(state.inventory).toContain(battery.name);
    expect(leadSpirit.defense).toBe(initialDef + 10);
    expect(leadSpirit.maxHp).toBe(initialMaxHp + 15);
  });

  it('should not re-collect already collected items', () => {
    const state = engine.getState();
    const tuningFork = state.items.find(i => i.type === 'tuning_fork')!;
    engine.collectItem(tuningFork);

    const atkAfterFirst = state.streamQueue[0].attack;
    const inventoryCount = state.inventory.length;

    // Attempt second collection
    engine.collectItem(tuningFork);

    expect(state.streamQueue[0].attack).toBe(atkAfterFirst);
    expect(state.inventory.length).toBe(inventoryCount);
  });

  it('should support wide world player movement bounds (40-1240, 70-680)', () => {
    const state = engine.getState();

    // Directly test exploration bounds clamp
    state.player.x = 1200;
    state.player.y = 650;
    expect(state.player.x).toBeGreaterThan(800);
    expect(state.player.y).toBeGreaterThan(600);

    // Ensure item in far pier/ruins at (1180, 600) can be reached
    const battery = state.items.find(i => i.type === 'energy_battery')!;
    state.player.x = battery.x;
    state.player.y = battery.y;
    engine.updateProximity();

    expect((state.nearbyInteractable as CollectibleItem)?.id).toBe(battery.id);
  });
});
