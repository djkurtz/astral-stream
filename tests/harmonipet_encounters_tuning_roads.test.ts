import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine, generateHarmonizeMelody } from '../src/game';
import { WORLD_ZONES, INITIAL_WORLD_NPCS, INITIAL_HARMONIDEX } from '../src/data';
import { soundEngine } from '../src/audio';
import { Harmonipet } from '../src/types';

describe('Harmonipet Encounters Overhaul & Cavatina Village Spatial Alignment', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Maestro');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  /* =========================================================================
     1. HARMONIPET ENCOUNTERS: TUNING VS PERFORMANCE PHASES
     ========================================================================= */

  describe('Harmonipet Encounter Phases', () => {
    it('should start harmonize encounter in tuning phase with zero penalties for exploration', () => {
      const wildPetNPC = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_wild_hare')!;
      expect(wildPetNPC).toBeDefined();

      engine.startHarmonizeEncounter(wildPetNPC);
      const enc = engine.getState().harmonizeEncounter;
      expect(enc).not.toBeNull();
      expect(enc?.phase).toBe('tuning');
      expect(enc?.attemptsRemaining).toBe(5);
      expect(enc?.resonanceMeter).toBe(20);

      // Play an incorrect note in tuning phase
      const correctFirst = enc!.targetNoteIndices[0];
      const incorrectNote = (correctFirst + 1) % 4;

      enc!.isPlayingMelody = false;
      engine.playHarmonizeNote(incorrectNote);

      // Verify no penalties were applied
      expect(enc?.attemptsRemaining).toBe(5);
      expect(enc?.resonanceMeter).toBe(20);
      expect(enc?.concluded).toBe(false);
      expect(enc?.lastFeedbackText).toContain('No penalty in tuning phase');
    });

    it('should reveal matching tones and advance sequence when testing correct notes in tuning phase', () => {
      const wildPetNPC = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_wild_hare')!;
      engine.startHarmonizeEncounter(wildPetNPC);
      const enc = engine.getState().harmonizeEncounter!;
      enc.isPlayingMelody = false;

      const firstNote = enc.targetNoteIndices[0];
      engine.playHarmonizeNote(firstNote);

      expect(enc.revealedSteps?.[0]).toBe(true);
      expect(enc.currentStep).toBe(1);
      expect(enc.lastFeedback).toBe('PERFECT');
    });

    it('should allow switching between tuning and performance phases', () => {
      const wildPetNPC = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_wild_hare')!;
      engine.startHarmonizeEncounter(wildPetNPC);
      const enc = engine.getState().harmonizeEncounter!;

      expect(enc.phase).toBe('tuning');
      engine.startPerformancePhase();
      expect(enc.phase).toBe('performance');
      expect(enc.currentStep).toBe(0);

      engine.startTuningPhase();
      expect(enc.phase).toBe('tuning');
    });

    it('should score note and timing accuracy in performance phase and bond with the pet upon completion', () => {
      const wildPetNPC = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_wild_hare')!;
      engine.startHarmonizeEncounter(wildPetNPC);
      const enc = engine.getState().harmonizeEncounter!;

      engine.startPerformancePhase();
      expect(enc.phase).toBe('performance');
      enc.isPlayingMelody = false;

      // Play all target notes in sequence
      const targetNotes = [...enc.targetNoteIndices];
      targetNotes.forEach(n => {
        engine.playHarmonizeNote(n);
      });

      expect(enc.noteAccuracy).toBe(100);
      expect(enc.timingAccuracy).toBeGreaterThan(0);
      expect(enc.resonanceMeter).toBeGreaterThanOrEqual(enc.catchThreshold);
      expect(enc.concluded).toBe(true);
      expect(enc.caught).toBe(true);

      // Verify dex registration
      const dex = engine.getState().harmoniDex.find(d => d.species === enc.pet.species)!;
      expect(dex.bonded).toBe(true);
      expect(dex.discovered).toBe(true);
    });

    it('should penalize resonance and decrement attempts on dissonant notes in performance phase', () => {
      const wildPetNPC = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_wild_hare')!;
      engine.startHarmonizeEncounter(wildPetNPC);
      const enc = engine.getState().harmonizeEncounter!;

      engine.startPerformancePhase();
      enc.isPlayingMelody = false;

      const initialResonance = enc.resonanceMeter;
      const wrongNote = (enc.targetNoteIndices[0] + 2) % 4;

      engine.playHarmonizeNote(wrongNote);
      expect(enc.attemptsRemaining).toBe(4);
      expect(enc.resonanceMeter).toBe(Math.max(0, initialResonance - 15));
      expect(enc.lastFeedback).toBe('DISSONANCE');
      expect(enc.currentStep).toBe(0);
    });
  });

  /* =========================================================================
     2. VARIABLE NOTE COUNTS (COMMON: 4, RARE: 5-6, LEGENDARY/EXOTIC: 7-8)
     ========================================================================= */

  describe('Variable Note Counts by Rarity Tier', () => {
    it('should generate exactly 4 notes for common pets across all sections', () => {
      const commonSpecies = [
        'Allegro Swan', 'Vivace Hare', 'Andante Fox',
        'Piccolo Finch', 'Cantabile Otter',
        'Fanfare Terrier', 'Alpine Ram',
        'Beat Raccoon', 'Marimba Squirrel'
      ];

      commonSpecies.forEach(species => {
        const dex = INITIAL_HARMONIDEX.find(d => d.species === species)!;
        expect(dex, `Species ${species} not in HarmoniDex`).toBeDefined();
        expect(dex.rarity).toBe('common');

        const pet: Harmonipet = {
          id: `pet_${dex.id}`,
          name: dex.name,
          species: dex.species,
          sprite: dex.sprite,
          section: dex.section,
          instrumentName: dex.instrumentName,
          instrumentId: dex.instrumentId,
          leitmotifSound: dex.instrumentId,
          color: '#ffffff',
          rarity: dex.rarity
        };

        const { noteIndices, targetMelody } = generateHarmonizeMelody(pet, dex);
        expect(noteIndices.length, `${species} should have 4 notes`).toBe(4);
        expect(targetMelody.length).toBe(4);
      });
    });

    it('should generate 5 or 6 notes for rare pets across all sections', () => {
      const rareSpecies = [
        { species: 'Glissando Dolphin', expectedNotes: 5 },
        { species: 'Clarinet Lynx', expectedNotes: 5 },
        { species: 'Thunder Bear', expectedNotes: 5 },
        { species: 'Bassoon Badger', expectedNotes: 6 },
        { species: 'Regal Lion', expectedNotes: 6 },
        { species: 'Chime Owl', expectedNotes: 6 }
      ];

      rareSpecies.forEach(({ species, expectedNotes }) => {
        const dex = INITIAL_HARMONIDEX.find(d => d.species === species)!;
        expect(dex, `Species ${species} not in HarmoniDex`).toBeDefined();
        expect(dex.rarity).toBe('rare');

        const pet: Harmonipet = {
          id: `pet_${dex.id}`,
          name: dex.name,
          species: dex.species,
          sprite: dex.sprite,
          section: dex.section,
          instrumentName: dex.instrumentName,
          instrumentId: dex.instrumentId,
          leitmotifSound: dex.instrumentId,
          color: '#ffffff',
          rarity: dex.rarity
        };

        const { noteIndices, targetMelody } = generateHarmonizeMelody(pet, dex);
        expect(noteIndices.length, `${species} should have ${expectedNotes} notes`).toBe(expectedNotes);
        expect(targetMelody.length).toBe(expectedNotes);
      });
    });

    it('should generate 7 or 8 notes for legendary and exotic pets across all sections', () => {
      const legendaryExoticSpecies = [
        { species: 'Clavichord Chameleon', expectedNotes: 7, rarity: 'exotic' },
        { species: 'Rockabilly Hedgehog', expectedNotes: 7, rarity: 'exotic' },
        { species: 'Typist Woodpecker', expectedNotes: 7, rarity: 'exotic' },
        { species: 'Bebop Fox', expectedNotes: 8, rarity: 'exotic' },
        { species: 'Tuba Elephant', expectedNotes: 8, rarity: 'legendary' },
        { species: 'Bombardier Beetle', expectedNotes: 8, rarity: 'legendary' }
      ];

      legendaryExoticSpecies.forEach(({ species, expectedNotes, rarity }) => {
        const dex = INITIAL_HARMONIDEX.find(d => d.species === species)!;
        expect(dex, `Species ${species} not in HarmoniDex`).toBeDefined();
        expect(dex.rarity).toBe(rarity);

        const pet: Harmonipet = {
          id: `pet_${dex.id}`,
          name: dex.name,
          species: dex.species,
          sprite: dex.sprite,
          section: dex.section,
          instrumentName: dex.instrumentName,
          instrumentId: dex.instrumentId,
          leitmotifSound: dex.instrumentId,
          color: '#ffffff',
          rarity: dex.rarity
        };

        const { noteIndices, targetMelody } = generateHarmonizeMelody(pet, dex);
        expect(noteIndices.length, `${species} should have ${expectedNotes} notes`).toBe(expectedNotes);
        expect(targetMelody.length).toBe(expectedNotes);
      });
    });
  });

  /* =========================================================================
     3. PERCUSSION ENCOUNTERS (4 DISTINCT TIMBRES, NO PITCH FREQUENCIES)
     ========================================================================= */

  describe('Percussion Encounters & Audio Timbres', () => {
    it('should not use pitch frequencies in percussion melodies and should support all 4 percussion timbres', () => {
      const dex = INITIAL_HARMONIDEX.find(d => d.id === 'dex_raccoon')!;
      const pet: Harmonipet = {
        id: 'pet_raccoon_test',
        name: 'Tempo',
        species: dex.species,
        sprite: dex.sprite,
        section: 'percussion',
        instrumentName: dex.instrumentName,
        instrumentId: 'snare_kit',
        leitmotifSound: 'snare_kit',
        color: '#8b5cf6',
        rarity: 'common'
      };

      const { noteIndices, targetMelody } = generateHarmonizeMelody(pet, dex);
      // For percussion, targetMelody stores timbre indices rather than Hz frequencies (261.63, etc.)
      expect(targetMelody).toEqual(noteIndices);
      expect(targetMelody.every(val => val >= 0 && val <= 3)).toBe(true);

      // Verify soundEngine synthesis of the 4 timbres does not throw
      expect(() => {
        soundEngine.playHarmonizePercussion(0); // Snare Tap
        soundEngine.playHarmonizePercussion(1); // Bass Drum Thud
        soundEngine.playHarmonizePercussion(2); // Marimba Strike
        soundEngine.playHarmonizePercussion(3); // Crash / Bell
        soundEngine.playHarmonizePercussion(3, 1.0, 'cannon'); // Cannon blast
      }).not.toThrow();
    });
  });

  /* =========================================================================
     4. CAVATINA VILLAGE ROADS & FOUNTAIN ALIGNMENT
     ========================================================================= */

  describe('Cavatina Village Spatial Geometry Alignment', () => {
    it('should center Clef Fountain precisely at (1000, 800)', () => {
      const zone = WORLD_ZONES.cavatina_village;
      const fountain = zone.obstacles.find(o => o.name === 'Clef Fountain');
      expect(fountain).toBeDefined();
      expect(fountain?.x).toBe(1000);
      expect(fountain?.y).toBe(800);
      expect(fountain?.radius).toBe(64);
    });

    it('should align the East Gate at y: 720..880 (center y=800) and match transition bounds', () => {
      const zone = WORLD_ZONES.cavatina_village;
      const gate = zone.obstacles.find(o => o.type === 'gate');
      expect(gate).toBeDefined();
      expect(gate?.x).toBe(1940);
      expect(gate?.y).toBe(720);
      expect(gate?.h).toBe(160); // 720 to 880

      const topWall = zone.obstacles.find(o => o.name === 'East Boundary Woods Top');
      expect(topWall).toBeDefined();
      expect(topWall?.y).toBe(0);
      expect(topWall?.h).toBe(720);

      const bottomWall = zone.obstacles.find(o => o.name === 'East Boundary Woods Bottom');
      expect(bottomWall).toBeDefined();
      expect(bottomWall?.y).toBe(880);
      expect(bottomWall?.h).toBe(720); // 880 + 720 = 1600 (full height)

      const transition = zone.transitions.find(tr => tr.targetZone === 'west_wilderness');
      expect(transition).toBeDefined();
      expect(transition?.bounds).toEqual({ x: 1920, y: 720, w: 80, h: 160 });
    });

    it('should ensure East Promenade road conduit (x: 1070..1940, y: 740..860) is completely clear of obstacles', () => {
      const zone = WORLD_ZONES.cavatina_village;
      const roadConduit = { minX: 1070, maxX: 1940, minY: 740, maxY: 860 };

      const internalObstacles = zone.obstacles.filter(o => o.buildingType !== 'wall' && o.type !== 'gate');
      for (const obs of internalObstacles) {
        let obsBox: { minX: number; maxX: number; minY: number; maxY: number };
        if (obs.type === 'circle' && obs.radius) {
          obsBox = {
            minX: obs.x - obs.radius,
            maxX: obs.x + obs.radius,
            minY: obs.y - obs.radius,
            maxY: obs.y + obs.radius
          };
        } else {
          obsBox = {
            minX: obs.x,
            maxX: obs.x + (obs.w || 0),
            minY: obs.y,
            maxY: obs.y + (obs.h || 0)
          };
        }

        const intersects = !(
          roadConduit.maxX < obsBox.minX ||
          roadConduit.minX > obsBox.maxX ||
          roadConduit.maxY < obsBox.minY ||
          roadConduit.minY > obsBox.maxY
        );

        expect(intersects, `Obstacle "${obs.name}" blocks East Promenade road conduit`).toBe(false);
      }
    });

    it('should ensure all 5 landmark buildings stand safely outside the Clef Plaza radius (160px from (1000, 800))', () => {
      const zone = WORLD_ZONES.cavatina_village;
      const buildings = zone.obstacles.filter(o => o.type === 'building' && o.buildingType !== 'wall');
      expect(buildings.length).toBe(5); // Academy, Forge, Library, Tavern, Clocktower

      buildings.forEach(b => {
        const centerX = b.x + (b.w || 0) / 2;
        const centerY = b.y + (b.h || 0) / 2;
        const dist = Math.hypot(centerX - 1000, centerY - 800);
        expect(dist, `Building "${b.name}" encroaches into Central Plaza`).toBeGreaterThan(160);
      });
    });
  });
});
