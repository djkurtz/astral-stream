import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';

describe('Harmonia: Economy, Artifacts, and Quest Systems', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Aria');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should initialize player wallet with starting Notes and Inspiration Sparks', () => {
    const state = engine.getState();
    expect(state.wallet.gold).toBe(150);
    expect(state.wallet.inspirationSparks).toBe(10);
    expect(state.wallet.reputationStars).toBe(0);
    expect(state.quests.length).toBeGreaterThanOrEqual(4);
  });

  it('should attune to an Inspiration Vista to gain permanent stat boost and sparks', () => {
    const state = engine.getState();
    const vistaNpc = state.npcs.find(n => n.id === 'npc_vista_cavatina')!;
    const player = state.ensemble.members[0];
    const initialTec = player.stats.technique;
    const initialSparks = state.wallet.inspirationSparks;

    state.player.x = vistaNpc.x;
    state.player.y = vistaNpc.y;
    engine.updateProximity();
    engine.interactWithNearby();

    expect(player.stats.technique).toBe(initialTec + 5);
    expect(state.wallet.inspirationSparks).toBe(initialSparks + 10);
    expect(state.dialogue?.speaker).toContain('Canyon of Thirds');
  });

  it('should forge an instrument artifact at Master Luthier Marco when having sufficient currency', () => {
    const state = engine.getState();
    const luthierNpc = state.npcs.find(n => n.id === 'npc_luthier_marco')!;
    const player = state.ensemble.members[0];
    
    // Give player enough currency to forge Bow Rosin of the Swan (300♪, 15✨)
    state.wallet.gold = 500;
    state.wallet.inspirationSparks = 30;
    const initialTec = player.stats.technique;

    state.player.x = luthierNpc.x;
    state.player.y = luthierNpc.y;
    engine.updateProximity();
    engine.interactWithNearby();

    expect(state.wallet.gold).toBe(200); // 500 - 300
    expect(state.wallet.inspirationSparks).toBe(15); // 30 - 15
    expect(player.stats.technique).toBe(initialTec + 15);
    expect(state.dialogue?.speaker).toBe('Master Luthier Marco');
    expect(state.dialogue?.text[0]).toContain('Bow Rosin of the Swan');
  });
});
