import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import {
  WORLD_ZONES, ALL_INSTRUMENTS_INFO, INITIAL_HARMONIDEX, THEORY_CURRICULUM,
  REPERTOIRE_DATABASE, RECRUITABLE_MUSICIANS, RIVAL_ENSEMBLES, CLEF_BADGES
} from '../src/data';
import { soundEngine } from '../src/audio';
import { InstrumentId } from '../src/types';

describe('Developer Sandbox & Interactive Diagnostics QA Suite', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
  });

  describe('1. Mechanics Sandbox Quick-Launch Triggers', () => {
    it('should launch isolated Audition Battle against any recruit or celebrity secret', () => {
      // Test starting with recruit
      engine.startSandboxAuditionBattle('npc_clara');
      expect(engine.getState().mode).toBe('audition_battle');
      expect(engine.getState().auditionBattle).not.toBeNull();
      expect(engine.getState().auditionBattle?.opponent.name).toBe('Clara');

      // Test starting with celebrity secret (Mozart)
      engine.startSandboxAuditionBattle('mozart');
      expect(engine.getState().mode).toBe('audition_battle');
      expect(engine.getState().auditionBattle?.opponent.id).toBe('mozart');
      expect(engine.getState().auditionBattle?.opponent.name).toBe('Wolfgang Amadeus Mozart');
    });

    it('should launch isolated Concert Competition against any Rival Ensemble', () => {
      engine.startConcertCompetition('rival_woodwind_trio');
      expect(engine.getState().mode).toBe('competition');
      expect(engine.getState().competition).not.toBeNull();
      expect(engine.getState().competition?.rival.id).toBe('rival_woodwind_trio');
      expect(engine.getState().competition?.rival.name).toBe('The Whispering Canopy Trio');
    });

    it('should launch isolated Harmonize Wild Encounter with any creature', () => {
      engine.startSandboxHarmonizeEncounter('chameleon');
      expect(engine.getState().mode).toBe('harmonize_wild');
      expect(engine.getState().harmonizeEncounter).not.toBeNull();
      expect(engine.getState().harmonizeEncounter?.pet.species.toLowerCase()).toContain('chameleon');
      expect(engine.getState().harmonizeEncounter?.attemptsRemaining).toBe(5);
    });

    it('should launch isolated Music Theory Challenge on specific curriculum topics', () => {
      engine.startTheoryChallenge('advanced_keys_circle');
      expect(engine.getState().mode).toBe('theory_challenge');
      expect(engine.getState().theoryChallenge).not.toBeNull();
      expect(engine.getState().theoryChallenge?.type).toBe('advanced_keys_circle');
      expect(engine.getState().theoryChallenge?.questions.length).toBe(3);
    });

    it('should launch isolated Practice Shed drills and Pianist Busking Duels', () => {
      engine.startPracticeSession('scale_run');
      expect(engine.getState().mode).toBe('practice');
      expect(engine.getState().practiceSession).not.toBeNull();
      expect(engine.getState().practiceSession?.type).toBe('scale_run');

      engine.startPianistBuskingDuel(3);
      expect(engine.getState().mode).toBe('competition');
      expect(engine.getState().competition?.isPianistDuel).toBe(true);
      expect(engine.getState().competition?.duelTier).toBe(3);
    });
  });

  describe('2. World Teleporter Instant Warp & Geometry', () => {
    it('should instant warp to all 9 world zones with valid coordinates and state update', () => {
      const allZones = Object.keys(WORLD_ZONES) as (keyof typeof WORLD_ZONES)[];
      expect(allZones.length).toBe(9);

      allZones.forEach(zoneId => {
        engine.teleportTo(zoneId, 500, 600);
        expect(engine.getState().currentZone).toBe(zoneId);
        expect(engine.getState().player.x).toBe(500);
        expect(engine.getState().player.y).toBe(600);
        expect(engine.getState().mode).toBe('exploration');
        expect(engine.getState().discoveredZones[zoneId]).toBe(true);
      });
    });

    it('should teleport to landmark buildings and secret easter egg spots', () => {
      // Grand Stage
      engine.teleportTo('grand_hall', 1000, 700);
      expect(engine.getState().currentZone).toBe('grand_hall');
      expect(engine.getState().player.x).toBe(1000);

      // Beethoven Thunder Peak
      engine.teleportTo('north_wilderness', 1560, 320);
      expect(engine.getState().currentZone).toBe('north_wilderness');
      expect(engine.getState().player.x).toBe(1560);
      expect(engine.getState().player.y).toBe(320);
    });
  });

  describe('3. State & Economy Injector / Cheats', () => {
    it('should grant Notes, Sparks, and Reputation Stars accurately', () => {
      const initialGold = engine.getState().wallet.gold;
      const initialSparks = engine.getState().wallet.inspirationSparks;
      const initialStars = engine.getState().wallet.reputationStars;

      engine.cheatAddCurrency(5000, 500, 50);

      expect(engine.getState().wallet.gold).toBe(initialGold + 5000);
      expect(engine.getState().wallet.inspirationSparks).toBe(initialSparks + 500);
      expect(engine.getState().wallet.reputationStars).toBe(initialStars + 50);
    });

    it('should unlock all 21 instruments at Mastery Level 10 and max section proficiencies', () => {
      engine.cheatUnlockAllInstruments();
      const allInstIds = Object.keys(ALL_INSTRUMENTS_INFO) as InstrumentId[];
      expect(engine.getState().proficiency.unlockedInstruments.length).toBe(allInstIds.length);
      allInstIds.forEach(id => {
        expect(engine.getState().proficiency.unlockedInstruments).toContain(id);
        expect(engine.getState().proficiency.instruments[id].level).toBe(10);
      });
      expect(engine.getState().proficiency.sections.strings).toBe(100);
      expect(engine.getState().proficiency.sections.woodwinds).toBe(100);
      expect(engine.getState().proficiency.sections.brass).toBe(100);
      expect(engine.getState().proficiency.sections.percussion).toBe(100);
    });

    it('should set Master stats (100) across all disciplines for the ensemble', () => {
      engine.cheatSetMasterStats();
      const member = engine.getState().ensemble.members[0];
      expect(member).toBeDefined();
      expect(member.stats.technique).toBe(100);
      expect(member.stats.toneQuality).toBe(100);
      expect(member.stats.tempoStability).toBe(100);
      expect(member.stats.sightReading).toBe(100);
      expect(member.level).toBe(20);
    });

    it('should toggle Piano Accompaniment state', () => {
      expect(engine.getState().hasPianoAccompaniment).toBe(false);
      const res1 = engine.cheatTogglePianoAccompaniment();
      expect(res1).toBe(true);
      expect(engine.getState().hasPianoAccompaniment).toBe(true);
      const res2 = engine.cheatTogglePianoAccompaniment();
      expect(res2).toBe(false);
      expect(engine.getState().hasPianoAccompaniment).toBe(false);
    });

    it('should unlock all sheet music pieces and conservatory badges', () => {
      engine.cheatUnlockAllRepertoire();
      expect(engine.getState().repertoire.length).toBe(REPERTOIRE_DATABASE.length);
      expect(engine.getState().repertoire.every(p => p.isMastered)).toBe(true);

      engine.cheatUnlockAllBadges();
      expect(engine.getState().badges.length).toBe(8);
      expect(engine.getState().badges.every(b => b.obtained)).toBe(true);

      engine.cheatCompleteAllQuests();
      expect(engine.getState().quests.every(q => q.completed)).toBe(true);
    });
  });

  describe('4. Audio Soundboard & Synthesis Support', () => {
    it('should verify all 21 instruments can be synthesized without throwing errors', () => {
      const allInstIds = Object.keys(ALL_INSTRUMENTS_INFO) as InstrumentId[];
      expect(allInstIds.length).toBe(21);

      allInstIds.forEach(id => {
        expect(() => {
          soundEngine.playInstrumentNote(id, 440, 0.2);
        }).not.toThrow();
      });
    });

    it('should verify celebrity motifs and wildlife calls execute cleanly', () => {
      ['mozart', 'beethoven', 'bach', 'paganini', 'satie'].forEach(celeb => {
        expect(() => {
          soundEngine.playCelebrityMotif(celeb);
        }).not.toThrow();
      });

      ['swan', 'finch', 'terrier', 'raccoon', 'hare', 'chameleon', 'hedgehog', 'fox', 'typist', 'cannon', 'bear', 'frog', 'badger'].forEach(species => {
        expect(() => {
          soundEngine.playWildlifeCall(species);
        }).not.toThrow();
      });

      expect(() => {
        soundEngine.playGrandPianoNote(440);
        soundEngine.playGrandPianoCadence();
        soundEngine.playFanfare();
      }).not.toThrow();
    });
  });

  describe('5. Diagnostic Assertions Integrity', () => {
    it('should verify all 9 world zones have valid transitions and obstacles', () => {
      const zoneKeys = Object.keys(WORLD_ZONES);
      expect(zoneKeys.length).toBe(9);
      zoneKeys.forEach(k => {
        const z = WORLD_ZONES[k];
        expect(z.transitions.length).toBeGreaterThanOrEqual(1);
        expect(z.obstacles.length).toBeGreaterThan(0);
        expect(z.width).toBeGreaterThanOrEqual(800);
        expect(z.height).toBeGreaterThanOrEqual(800);
      });
    });

    it('should verify all 21 HarmoniDex entries have valid species and instruments', () => {
      expect(INITIAL_HARMONIDEX.length).toBe(21);
      INITIAL_HARMONIDEX.forEach(entry => {
        expect(entry.id).toBeDefined();
        expect(entry.species).toBeDefined();
        expect(entry.instrumentId).toBeDefined();
        expect(ALL_INSTRUMENTS_INFO[entry.instrumentId]).toBeDefined();
      });
    });

    it('should verify the 8 Music Theory curriculum tiers contain 10 questions each (80 questions total)', () => {
      expect(THEORY_CURRICULUM.length).toBe(8);
      let totalQuestions = 0;
      THEORY_CURRICULUM.forEach(tier => {
        expect(tier.questions.length).toBe(10);
        totalQuestions += tier.questions.length;
        tier.questions.forEach(q => {
          expect(q.prompt).toBeDefined();
          expect(q.options.length).toBe(4);
          expect(q.correctIndex).toBeGreaterThanOrEqual(0);
          expect(q.correctIndex).toBeLessThan(4);
          expect(q.explanation).toBeDefined();
        });
      });
      expect(totalQuestions).toBe(80);
    });

    it('should verify all 5 Rival Ensembles and 8 Clef Badges are intact', () => {
      expect(RIVAL_ENSEMBLES.length).toBe(5);
      RIVAL_ENSEMBLES.forEach(r => {
        expect(r.conductorName).toBeDefined();
        expect(r.members.length).toBeGreaterThan(0);
        expect(r.piece).toBeDefined();
      });

      expect(CLEF_BADGES.length).toBe(8);
      CLEF_BADGES.forEach(b => {
        expect(b.name).toBeDefined();
        expect(b.conservatory).toBeDefined();
      });
    });
  });
});
