import { describe, it, expect, beforeEach } from 'vitest';
import { GameEngine } from '../src/game';
import { ZONE_CONFIGS, PLAYER_PALETTES, CHIME_CAT_PALETTES } from '../src/data';
import { soundEngine } from '../src/audio';

describe('Zone Transitions & Customization Studio', () => {
  let engine: GameEngine;

  beforeEach(() => {
    engine = new GameEngine();
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  describe('Zone Configuration & Transitions', () => {
    it('should configure all 8 dedicated zone maps with valid properties', () => {
      const zoneIds = ['plaza', 'beach', 'sangeet', 'bamboo', 'ruins', 'ridge', 'cafe', 'vinyl_den'] as const;
      for (const zid of zoneIds) {
        const cfg = ZONE_CONFIGS[zid];
        expect(cfg).toBeDefined();
        expect(cfg.name).toBeTruthy();
        expect(cfg.width).toBeGreaterThan(0);
        expect(cfg.height).toBeGreaterThan(0);
        expect(cfg.defaultSpawn).toBeDefined();
      }
    });

    it('should start a zone transition and warp player to new zone', () => {
      const state = engine.getState();
      expect(state.currentZone).toBe('cafe');

      // Start transition to Sangeet Lotus Sanctuary
      engine.startZoneTransition('sangeet', { x: 120, y: 280, dir: 'right' });
      expect(state.transition).toBeDefined();
      expect(state.transition?.toZone).toBe('sangeet');
      expect(state.transition?.phase).toBe('fade_out');

      // Update engine with elapsed timestamps (0.5s duration -> 300ms is past 0.25s midpoint)
      engine.update(1000);
      engine.update(1300);

      // Should have warped to sangeet
      expect(state.currentZone).toBe('sangeet');
      expect(state.player.x).toBe(120);
      expect(state.player.y).toBe(280);
      expect(state.player.dir).toBe('right');
      expect(state.discoveredZones['sangeet']).toBe(true);
    });

    it('should complete transition and return to normal exploration', () => {
      const state = engine.getState();
      engine.startZoneTransition('beach', { x: 1000, y: 2100 });
      
      // Update by full duration (500ms+)
      engine.update(1000);
      engine.update(1600);

      expect(state.transition).toBeNull();
      expect(state.currentZone).toBe('beach');
    });
  });

  describe('Streamer & Chime-Cat Customization Studio', () => {
    it('should toggle customization studio modal state', () => {
      const state = engine.getState();
      expect(state.isCustomizing).toBe(false);

      engine.toggleCustomizationModal();
      expect(state.isCustomizing).toBe(true);

      engine.closeCustomizationModal();
      expect(state.isCustomizing).toBe(false);
    });

    it('should update player customization palette and call-sign title', () => {
      const state = engine.getState();
      
      engine.setPlayerPalette('cyber_magenta');
      expect(state.playerCustomization.paletteId).toBe('cyber_magenta');
      expect(state.playerCustomization.jacketColor).toBe(PLAYER_PALETTES.cyber_magenta.jacketColor);
      expect(state.playerCustomization.headphoneColor).toBe(PLAYER_PALETTES.cyber_magenta.headphoneColor);

      engine.setPlayerTitle('Cosmic Sound Sovereign');
      expect(state.playerCustomization.title).toBe('Cosmic Sound Sovereign');
    });

    it('should update Chime-Cat palette and synthesizer timbre preset', () => {
      const state = engine.getState();

      engine.setChimeCatPalette('synthwave_magenta');
      expect(state.chimeCatCustomization.paletteId).toBe('synthwave_magenta');
      expect(state.chimeCatCustomization.bodyColor).toBe(CHIME_CAT_PALETTES.synthwave_magenta.bodyColor);
      expect(state.chimeCatCustomization.earColor).toBe(CHIME_CAT_PALETTES.synthwave_magenta.earColor);

      engine.setChimeCatTimbre('warm_saw');
      expect(state.chimeCatCustomization.timbrePreset).toBe('warm_saw');
      expect(soundEngine.getChimeCatTimbre()).toBe('warm_saw');

      engine.setChimeCatTimbre('fm_rhodes');
      expect(state.chimeCatCustomization.timbrePreset).toBe('fm_rhodes');
      expect(soundEngine.getChimeCatTimbre()).toBe('fm_rhodes');
    });
  });

  describe('Biome Linear and Side Challenges', () => {
    it('should handle interaction with linear and side challenge props', () => {
      const state = engine.getState();
      
      // Simulate interacting with coastal raga shells challenge
      const shellChallenge = state.npcs.find(n => n.id === 'challenge_tide_shells');
      expect(shellChallenge).toBeDefined();

      if (shellChallenge) {
        state.nearbyInteractable = shellChallenge;
        engine.interactWithNearby();

        expect(state.zoneChallenges['challenge_tide_shells']).toBe(true);
        expect(state.dialogue?.speaker).toBe(shellChallenge.name);
      }
    });
  });
});
