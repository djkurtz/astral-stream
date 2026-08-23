import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { soundEngine } from '../src/audio';
import { HarmoniaRenderer } from '../src/renderer';
import { INITIAL_WORLD_NPCS } from '../src/data';

describe('Classical Music Celebrity Easter Eggs QA Test Suite', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Aria');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should verify all 5 classical music celebrity easter eggs are configured in INITIAL_WORLD_NPCS', () => {
    const secretNPCs = INITIAL_WORLD_NPCS.filter(npc => npc.isSecret && npc.actionType === 'celebrity_secret');
    expect(secretNPCs.length).toBe(5);

    const celebrityIds = secretNPCs.map(npc => npc.id);
    expect(celebrityIds).toContain('npc_secret_mozart');
    expect(celebrityIds).toContain('npc_secret_beethoven');
    expect(celebrityIds).toContain('npc_secret_bach');
    expect(celebrityIds).toContain('npc_secret_paganini');
    expect(celebrityIds).toContain('npc_secret_satie');
  });

  it('should verify Mozart has correct zone, pet starling, potty humor dialogue, and motif', () => {
    const mozart = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_secret_mozart')!;
    expect(mozart).toBeDefined();
    expect(mozart.zone).toBe('cavatina_village');
    expect(mozart.celebrityMotif).toBe('mozart');
    expect(mozart.musicianData?.pet?.species).toContain('Starling');
    expect(mozart.musicianData?.pet?.name).toBe('Vogel');
    expect(mozart.celebrityReward?.notes).toBeGreaterThan(0);
    expect(mozart.celebrityReward?.sparks).toBeGreaterThan(0);

    const dialogText = mozart.dialogue.join(' ');
    expect(dialogText.toLowerCase()).toContain('tavern');
    expect(dialogText.toLowerCase()).toContain('starling');
    expect(dialogText.toLowerCase()).toContain('eine kleine nachtmusik');
  });

  it('should verify Beethoven has ear trumpet, shouts fortissimo at thunderstorms, and has fate motif', () => {
    const beethoven = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_secret_beethoven')!;
    expect(beethoven).toBeDefined();
    expect(beethoven.zone).toBe('north_wilderness');
    expect(beethoven.celebrityMotif).toBe('beethoven');
    expect(beethoven.musicianData?.instrumentName).toContain('Ear Trumpet');
    expect(beethoven.celebrityReward?.notes).toBeGreaterThan(0);
    expect(beethoven.celebrityReward?.sparks).toBeGreaterThan(0);

    const dialogText = beethoven.dialogue.join(' ');
    expect(dialogText).toContain('EAR TRUMPET');
    expect(dialogText).toContain('DA-DA-DA-DUM');
    expect(dialogText).toContain('THUNDERSTORM');
  });

  it('should verify Bach is in the Great Tree hollow with musical children and counterpoint wisdom', () => {
    const bach = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_secret_bach')!;
    expect(bach).toBeDefined();
    expect(bach.zone).toBe('woodwind_woods');
    expect(bach.celebrityMotif).toBe('bach');
    expect(bach.celebrityReward?.notes).toBeGreaterThan(0);
    expect(bach.celebrityReward?.sparks).toBeGreaterThan(0);

    const dialogText = bach.dialogue.join(' ');
    expect(dialogText.toLowerCase()).toContain('tree hollow');
    expect(dialogText.toLowerCase()).toContain('children');
    expect(dialogText.toLowerCase()).toContain('counterpoint');
    expect(dialogText.toLowerCase()).toContain('fugue');
  });

  it('should verify Paganini is in volcanic crevice, shreds Caprice 24, and denies selling his soul', () => {
    const paganini = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_secret_paganini')!;
    expect(paganini).toBeDefined();
    expect(paganini.zone).toBe('south_wilderness');
    expect(paganini.celebrityMotif).toBe('paganini');
    expect(paganini.musicianData?.instrumentName).toContain('Demonic Violin');
    expect(paganini.celebrityReward?.notes).toBeGreaterThan(0);
    expect(paganini.celebrityReward?.sparks).toBeGreaterThan(0);

    const dialogText = paganini.dialogue.join(' ');
    expect(dialogText.toLowerCase()).toContain('caprice no. 24');
    expect(dialogText.toLowerCase()).toContain('soul');
    expect(dialogText.toLowerCase()).toContain('volcanic');
  });

  it('should verify Erik Satie has green umbrella, eats white foods, and plays Gymnopédie No. 1', () => {
    const satie = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_secret_satie')!;
    expect(satie).toBeDefined();
    expect(satie.zone).toBe('east_wilderness');
    expect(satie.celebrityMotif).toBe('satie');
    expect(satie.celebrityReward?.notes).toBeGreaterThan(0);
    expect(satie.celebrityReward?.sparks).toBeGreaterThan(0);

    const dialogText = satie.dialogue.join(' ');
    expect(dialogText.toLowerCase()).toContain('gymnopédie no. 1');
    expect(dialogText.toLowerCase()).toContain('umbrella');
    expect(dialogText.toLowerCase()).toContain('white foods');
  });

  it('should execute soundEngine.playCelebrityMotif without audio context throwing errors', () => {
    const spyPlay = vi.spyOn(soundEngine, 'playCelebrityMotif');
    soundEngine.playCelebrityMotif('mozart');
    soundEngine.playCelebrityMotif('beethoven');
    soundEngine.playCelebrityMotif('bach');
    soundEngine.playCelebrityMotif('paganini');
    soundEngine.playCelebrityMotif('satie');
    expect(spyPlay).toHaveBeenCalledTimes(5);
  });

  it('should award notes and sparks on first discovery and prevent duplicate payouts on repeat visits', () => {
    const state = engine.getState();
    const initialGold = state.wallet.gold;
    const initialSparks = state.wallet.inspirationSparks;

    const mozart = state.npcs.find(n => n.id === 'npc_secret_mozart')!;
    state.nearbyInteractable = mozart;

    const playSpy = vi.spyOn(soundEngine, 'playCelebrityMotif');

    // First interaction: Discovery!
    engine.interactWithNearby();

    expect(playSpy).toHaveBeenCalledWith('mozart');
    expect(state.discoveredSecrets).toContain('npc_secret_mozart');
    expect(state.wallet.gold).toBe(initialGold + 350);
    expect(state.wallet.inspirationSparks).toBe(initialSparks + 25);
    expect(state.dialogue?.text[0]).toContain('SECRET CELEBRITY DISCOVERED');

    // Dismiss dialogue
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }

    // Second interaction: Repeat visit!
    const goldAfterFirst = state.wallet.gold;
    const sparksAfterFirst = state.wallet.inspirationSparks;

    engine.interactWithNearby();
    expect(state.wallet.gold).toBe(goldAfterFirst);
    expect(state.wallet.inspirationSparks).toBe(sparksAfterFirst);
    expect(state.dialogue?.text[0]).not.toContain('SECRET CELEBRITY DISCOVERED');
  });

  it('should verify renderer draws mystery silhouette when far and full character when approached', () => {
    const state = engine.getState();
    state.currentZone = 'cavatina_village';
    state.player = { x: 1000, y: 920, dir: 'down', isMoving: false };

    const mozart = state.npcs.find(n => n.id === 'npc_secret_mozart')!;
    mozart.x = 240;
    mozart.y = 1100;

    const drawnTexts: string[] = [];
    const mockCtx: any = {
      canvas: { width: 1280, height: 720 },
      clearRect: () => {},
      save: () => {},
      restore: () => {},
      beginPath: () => {},
      closePath: () => {},
      moveTo: () => {},
      lineTo: () => {},
      arc: () => {},
      ellipse: () => {},
      fill: () => {},
      stroke: () => {},
      translate: () => {},
      scale: () => {},
      fillRect: () => {},
      strokeRect: () => {},
      roundRect: () => {},
      setLineDash: () => {},
      drawImage: () => {},
      measureText: () => ({ width: 60 }),
      createLinearGradient: () => ({ addColorStop: () => {} }),
      createRadialGradient: () => ({ addColorStop: () => {} }),
      fillText: (text: string) => { drawnTexts.push(text); }
    };

    const renderer = new HarmoniaRenderer(mockCtx);
    renderer.render(state);

    expect(drawnTexts).toContain('✨ ??? ✨');
    expect(drawnTexts).toContain('?');

    state.player.x = 250;
    state.player.y = 1100;
    drawnTexts.length = 0;

    renderer.render(state);

    expect(drawnTexts.some(t => t.includes('Wolfgang Amadeus Mozart'))).toBe(true);
    expect(drawnTexts).not.toContain('✨ ??? ✨');
  });
});
