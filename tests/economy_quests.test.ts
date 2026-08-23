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
    expect(state.dialogue?.speaker).toBe('Master Luthier Marco');

    const success = engine.forgeArtifact('artifact_rosin_swan');
    expect(success).toBe(true);
    expect(state.wallet.gold).toBe(200); // 500 - 300
    expect(state.wallet.inspirationSparks).toBe(15); // 30 - 15
    expect(player.stats.technique).toBe(initialTec + 15);
  });

  it('should craft brass cylinder pins at Luthier Marco and complete Elder Timothy music box quest', () => {
    const state = engine.getState();
    const timothyNpc = state.npcs.find(n => n.id === 'npc_side_musicbox')!;
    const quest = state.quests.find(q => q.id === 'quest_side_musicbox')!;
    expect(quest.completed).toBe(false);

    // Initial talk with Timothy
    state.player.x = timothyNpc.x;
    state.player.y = timothyNpc.y;
    engine.updateProximity();
    engine.interactWithNearby();
    expect(state.dialogue?.speaker).toBe('Elder Timothy');
    expect(state.questInventory.includes('brass_music_box_pins')).toBe(false);

    // Craft pins (costs 30♪)
    state.wallet.gold = 100;
    const craftOk = engine.craftQuestPins();
    expect(craftOk).toBe(true);
    expect(state.wallet.gold).toBe(70);
    expect(state.questInventory.includes('brass_music_box_pins')).toBe(true);

    // Deliver pins to Timothy
    const initialGold = state.wallet.gold;
    const initialSparks = state.wallet.inspirationSparks;
    engine.interactWithNearby();

    expect(quest.completed).toBe(true);
    expect(state.questInventory.includes('brass_music_box_pins')).toBe(false);
    expect(state.wallet.gold).toBe(initialGold + 150);
    expect(state.wallet.inspirationSparks).toBe(initialSparks + 10);
    expect(state.dialogue?.text[0]).toContain('By the Great Clef');
  });
});
