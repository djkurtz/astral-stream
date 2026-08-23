import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { soundEngine } from '../src/audio';
import { REPERTOIRE_DATABASE, RIVAL_ENSEMBLES } from '../src/data';
import { InstrumentSection, Musician } from '../src/types';

describe('Harmonia: Concert Competitions & Conducting Minigame with Orchestral Harmony', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'MaestroAria');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  describe('1. Authentic Structured Orchestral Harmony & Audio Voicing', () => {
    it('should safely synthesize structured chord notes across ensemble sections without cacophony', () => {
      const piece = REPERTOIRE_DATABASE.find(p => p.id === 'piece_ode_to_harmony')!;
      expect(piece).toBeDefined();
      expect(piece.chords.length).toBeGreaterThan(0);
      expect(piece.melody.length).toBeGreaterThan(0);

      const mockMembers: Musician[] = [
        {
          id: 'm1',
          name: 'Violinist',
          title: 'Concertmaster',
          avatar: '🎻',
          paletteColor: '#ec4899',
          instrumentId: 'violin',
          instrumentName: 'Violin',
          section: 'strings',
          pet: { id: 'p1', name: 'Swan', species: 'Swan', sprite: 'swan', section: 'strings', instrumentName: 'Violin', leitmotifSound: 'violin_pure', color: '#fff' },
          stats: { technique: 80, toneQuality: 85, tempoStability: 80, sightReading: 80 },
          level: 5,
          xp: 1000
        },
        {
          id: 'm2',
          name: 'Flutist',
          title: 'Principal Wind',
          avatar: '🪈',
          paletteColor: '#06b6d4',
          instrumentId: 'silver_flute',
          instrumentName: 'Silver Flute',
          section: 'woodwinds',
          pet: { id: 'p2', name: 'Breeze', species: 'Nightingale', sprite: 'nightingale', section: 'woodwinds', instrumentName: 'Flute', leitmotifSound: 'flute_pure', color: '#fff' },
          stats: { technique: 75, toneQuality: 80, tempoStability: 75, sightReading: 75 },
          level: 5,
          xp: 1000
        },
        {
          id: 'm3',
          name: 'Hornist',
          title: 'Principal Brass',
          avatar: '🎺',
          paletteColor: '#f59e0b',
          instrumentId: 'french_horn',
          instrumentName: 'French Horn',
          section: 'brass',
          pet: { id: 'p3', name: 'Goldie', species: 'Fox', sprite: 'fox', section: 'brass', instrumentName: 'Horn', leitmotifSound: 'horn_pure', color: '#fff' },
          stats: { technique: 70, toneQuality: 75, tempoStability: 70, sightReading: 70 },
          level: 5,
          xp: 1000
        },
        {
          id: 'm4',
          name: 'Timpanist',
          title: 'Principal Percussion',
          avatar: '🥁',
          paletteColor: '#a855f7',
          instrumentId: 'timpani',
          instrumentName: 'Timpani',
          section: 'percussion',
          pet: { id: 'p4', name: 'Staccato', species: 'Armadillo', sprite: 'armadillo', section: 'percussion', instrumentName: 'Timpani', leitmotifSound: 'drum_beat', color: '#fff' },
          stats: { technique: 85, toneQuality: 80, tempoStability: 90, sightReading: 80 },
          level: 5,
          xp: 1000
        }
      ];

      // Test structured concert harmony playback with full sections
      expect(() => {
        soundEngine.playStructuredConcertHarmony({
          chord: piece.chords[0],
          melodyNotes: piece.melody.slice(0, 4),
          members: mockMembers,
          sectionBalance: { strings: 80, woodwinds: 75, brass: 70, percussion: 85 },
          hasPianoAccompaniment: false,
          isPianistDuel: false,
          maestroFlow: 75
        });
      }).not.toThrow();

      // Test with piano accompaniment flourish active
      expect(() => {
        soundEngine.playStructuredConcertHarmony({
          chord: piece.chords[1],
          melodyNotes: piece.melody.slice(4, 8),
          members: mockMembers,
          sectionBalance: { strings: 80, woodwinds: 75, brass: 70, percussion: 85 },
          hasPianoAccompaniment: true,
          isPianistDuel: false,
          maestroFlow: 90
        });
      }).not.toThrow();

      // Test with pianist duel counterpoint flourish
      expect(() => {
        soundEngine.playStructuredConcertHarmony({
          chord: piece.chords[2],
          melodyNotes: piece.melody.slice(0, 2),
          members: mockMembers,
          sectionBalance: { strings: 70, woodwinds: 70, brass: 70, percussion: 70 },
          hasPianoAccompaniment: false,
          isPianistDuel: true,
          maestroFlow: 50
        });
      }).not.toThrow();
    });

    it('should provide responsive audio feedback for all 4 conducting section cues', () => {
      const sections: InstrumentSection[] = ['strings', 'woodwinds', 'brass', 'percussion'];
      sections.forEach(sec => {
        expect(() => {
          soundEngine.playSectionCueFeedback(sec, 440);
        }).not.toThrow();
      });
    });
  });

  describe('2. Conducting Minigame State Initialization', () => {
    it('should initialize section balance, maestro flow, and active cue when starting concert competition', () => {
      engine.startConcertCompetition('rival_novice_buskers');
      const state = engine.getState();

      expect(state.mode).toBe('competition');
      expect(state.competition).not.toBeNull();
      const comp = state.competition!;

      expect(comp.sectionBalance).toBeDefined();
      expect(comp.sectionBalance.strings).toBe(75);
      expect(comp.sectionBalance.woodwinds).toBe(75);
      expect(comp.sectionBalance.brass).toBe(75);
      expect(comp.sectionBalance.percussion).toBe(75);

      expect(comp.maestroFlow).toBe(50);
      expect(comp.currentChordIndex).toBe(0);
      expect(comp.currentMelodyIndex).toBe(0);
      expect(comp.activeSectionCue).toBeDefined();
      expect(comp.activeSectionCue?.section).toBe('strings');
    });

    it('should initialize conducting state when starting festival competition', () => {
      const state = engine.getState();
      const festEvent = state.calendarEvents[0];
      const entered = engine.enterFestivalCompetition(festEvent.id);
      expect(entered).toBe(true);

      expect(state.mode).toBe('competition');
      const comp = state.competition!;
      expect(comp.sectionBalance.strings).toBe(75);
      expect(comp.maestroFlow).toBe(50);
      expect(comp.activeSectionCue).toBeDefined();
    });

    it('should initialize conducting state when starting pianist busking duel', () => {
      engine.startPianistBuskingDuel(1);
      const state = engine.getState();

      expect(state.mode).toBe('competition');
      const comp = state.competition!;
      expect(comp.isPianistDuel).toBe(true);
      expect(comp.sectionBalance.percussion).toBe(75);
      expect(comp.maestroFlow).toBe(50);
      expect(comp.activeSectionCue?.section).toBe('percussion');
    });
  });

  describe('3. Conducting Minigame Section Cues & Keyboard Input Handling', () => {
    beforeEach(() => {
      engine.startConcertCompetition('rival_novice_buskers');
    });

    it('should execute a perfect cue when conducting the prompted section', () => {
      const state = engine.getState();
      const comp = state.competition!;
      comp.activeSectionCue = {
        section: 'woodwinds',
        key: '2 / F',
        label: 'Winds Dolce',
        urgency: 1.0,
        sweetSpot: 0.5
      };

      const prevBal = comp.sectionBalance.woodwinds;
      const prevFlow = comp.maestroFlow;
      const prevApplause = comp.audienceApplause;

      engine.conductSection('woodwinds');

      expect(comp.sectionBalance.woodwinds).toBe(Math.min(100, prevBal + 25));
      expect(comp.maestroFlow).toBe(Math.min(100, prevFlow + 15));
      expect(comp.audienceApplause).toBe(Math.min(100, prevApplause + 4));
      expect(comp.lastFeedback).toBe('PERFECT');
      expect(comp.lastFeedbackText).toContain('MAESTRO CUE! WOODWINDS RESONATING!');
      expect(comp.activeSectionCue).toBeUndefined(); // Cleared after success
    });

    it('should boost section balance when conducting a non-prompted section', () => {
      const state = engine.getState();
      const comp = state.competition!;
      comp.activeSectionCue = {
        section: 'strings',
        key: '1 / D',
        label: 'Strings Swell',
        urgency: 1.0,
        sweetSpot: 0.5
      };

      const prevBal = comp.sectionBalance.brass;
      engine.conductSection('brass');

      expect(comp.sectionBalance.brass).toBe(Math.min(100, prevBal + 15));
      expect(comp.lastFeedbackText).toContain('Conducted BRASS');
      // Prompt remains active since a different section was conducted
      expect(comp.activeSectionCue?.section).toBe('strings');
    });

    it('should respond to keyboard shortcuts [1/D], [2/F], [3/J], [4/K]', () => {
      const state = engine.getState();
      const comp = state.competition!;
      comp.activeSectionCue = undefined;
      comp.sectionBalance = { strings: 50, woodwinds: 50, brass: 50, percussion: 50 };

      // [1] Strings
      engine.handleKeyDown('Digit1');
      expect(comp.sectionBalance.strings).toBe(65);

      // [D] Strings
      engine.handleKeyDown('KeyD');
      expect(comp.sectionBalance.strings).toBe(80);

      // [2] Woodwinds
      engine.handleKeyDown('Digit2');
      expect(comp.sectionBalance.woodwinds).toBe(65);

      // [F] Woodwinds
      engine.handleKeyDown('KeyF');
      expect(comp.sectionBalance.woodwinds).toBe(80);

      // [3] Brass
      engine.handleKeyDown('Digit3');
      expect(comp.sectionBalance.brass).toBe(65);

      // [J] Brass
      engine.handleKeyDown('KeyJ');
      expect(comp.sectionBalance.brass).toBe(80);

      // [4] Percussion
      engine.handleKeyDown('Digit4');
      expect(comp.sectionBalance.percussion).toBe(65);

      // [K] Percussion
      engine.handleKeyDown('KeyK');
      expect(comp.sectionBalance.percussion).toBe(80);
    });
  });

  describe('4. Ensemble Balance Dynamics & Maestro Flow Simulation', () => {
    it('should simulate section balance decay and award Maestro Flow when balanced', () => {
      engine.startConcertCompetition('rival_novice_buskers');
      const state = engine.getState();
      const comp = state.competition!;

      comp.sectionBalance = { strings: 70, woodwinds: 70, brass: 70, percussion: 70 };
      comp.maestroFlow = 50;

      // Update 1.0 second
      engine.update(1000);

      // Balance should decay
      expect(comp.sectionBalance.strings).toBeLessThan(70);
      expect(comp.sectionBalance.woodwinds).toBeLessThan(70);

      // Since all sections remained above 40%, Maestro Flow should increase
      expect(comp.maestroFlow).toBeGreaterThan(50);
    });

    it('should decrease Maestro Flow when a section is severely neglected (<25%)', () => {
      engine.startConcertCompetition('rival_novice_buskers');
      const state = engine.getState();
      const comp = state.competition!;

      comp.sectionBalance = { strings: 15, woodwinds: 70, brass: 70, percussion: 70 };
      comp.maestroFlow = 60;

      engine.update(1000);

      expect(comp.maestroFlow).toBeLessThan(60);
    });
  });

  describe('5. Master Downbeat Cadence & Measure Progression with Flow Multipliers', () => {
    it('should advance measures, cycle chords/melodies, and apply flow multipliers to score', () => {
      engine.startConcertCompetition('rival_novice_buskers');
      const state = engine.getState();
      const comp = state.competition!;

      const initialMeasure = comp.currentMeasure;
      const initialChordIdx = comp.currentChordIndex;
      const initialMelodyIdx = comp.currentMelodyIndex;

      // Master downbeat via Spacebar
      engine.handleKeyDown('Space');

      expect(comp.currentMeasure).toBe(initialMeasure + 1);
      expect(comp.playerScore).toBeGreaterThan(0);
      expect(comp.currentChordIndex).not.toBe(initialChordIdx);
      expect(comp.currentMelodyIndex).not.toBe(initialMelodyIdx);
    });

    it('should complete concert competition through all measures and award victory', () => {
      engine.startConcertCompetition('rival_novice_buskers');
      const state = engine.getState();

      while (state.competition && !state.competition.concluded) {
        engine.advanceConcertPerformance();
      }

      expect(state.competition?.concluded).toBe(true);
      expect(state.competition?.won).toBe(true);
      expect(state.ensemble.reputationStars).toBeGreaterThanOrEqual(1);
    });
  });
});
