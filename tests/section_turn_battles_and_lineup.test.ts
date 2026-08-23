import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { SECTION_ACTIONS } from '../src/data';

// Mock Web Audio API
class AudioContextMock {
  createOscillator() {
    return {
      type: 'sine',
      frequency: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn()
    };
  }
  createGain() {
    return {
      gain: { setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn()
    };
  }
  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn()
      },
      Q: { setValueAtTime: vi.fn() },
      connect: vi.fn()
    };
  }
  createBufferSource() {
    return {
      buffer: null,
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn()
    };
  }
  createBuffer() {
    return {
      getChannelData: () => new Float32Array(100)
    };
  }
  destination = {};
  currentTime = 0;
  state = 'running';
  resume = vi.fn().mockResolvedValue(undefined);
}
(global as any).AudioContext = AudioContextMock;
(global as any).webkitAudioContext = AudioContextMock;

describe('Harmonia: Lineup Selection, Section Pet Bonding & Section Turn Battles', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Ash');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  describe('1. Pre-Battle Lineup Selection & Strategic Recommendations', () => {
    it('should open pre-battle lineup screen with recommendations for wild harmonipet encounters', () => {
      const state = engine.getState();
      const wildPet = state.npcs.find(n => n.actionType === 'wild_harmonipet')!;
      expect(wildPet).toBeDefined();

      state.player.x = wildPet.x;
      state.player.y = wildPet.y;
      engine.updateProximity();
      engine.interactWithNearby();

      expect(state.mode).toBe('battle_lineup');
      expect(state.preBattle).not.toBeNull();
      expect(state.preBattle?.battleType).toBe('wild_harmonipet');
      expect(state.preBattle?.recommendations.length).toBeGreaterThan(0);
      expect(state.preBattle?.recommendations.some(r => r.includes('SECTION') || r.includes('Section'))).toBe(true);

      // Cancel retreats to exploration
      engine.cancelPreBattle();
      expect(state.mode).toBe('exploration');
      expect(state.preBattle).toBeNull();
    });

    it('should allow toggling musicians into and out of the active lineup up to max capacity', () => {
      const state = engine.getState();
      const playerMusician = state.ensemble.members[0];

      // Add reserve musicians to box
      const clara = {
        id: 'musician_clara',
        name: 'Clara',
        title: 'Violin Virtuoso',
        avatar: '🎻',
        paletteColor: '#ec4899',
        instrumentId: 'violin' as const,
        instrumentName: 'Violin',
        section: 'strings' as const,
        stats: { technique: 30, toneQuality: 30, tempoStability: 30, sightReading: 30 },
        level: 1
      };
      state.ensembleBox.push(clara);
      state.recruitedMusicians.push(clara);

      // Player cannot be removed
      engine.toggleLineupMusician(playerMusician.id);
      expect(state.ensemble.members[0].id).toBe(playerMusician.id);

      // Deploy Clara from box to lineup (solo tier has capacity 1, but toggle swaps or upgrades)
      state.ensemble.tier = 'duet';
      engine.toggleLineupMusician('musician_clara');
      expect(state.ensemble.members.some(m => m.id === 'musician_clara')).toBe(true);

      // Bench Clara back to box
      engine.toggleLineupMusician('musician_clara');
      expect(state.ensemble.members.some(m => m.id === 'musician_clara')).toBe(false);
      expect(state.ensembleBox.some(m => m.id === 'musician_clara')).toBe(true);
    });
  });

  describe('2. Section Requirement for Pet Capture', () => {
    it('should fail capturing a creature if player lacks a musician in that section', () => {
      const state = engine.getState();
      // Player is strings starter (violin)
      const wildWoodwindPet = state.npcs.find(n => n.id === 'npc_wild_finch')!; // Woodwinds section
      expect(wildWoodwindPet).toBeDefined();
      expect(wildWoodwindPet.wildPetData?.section).toBe('woodwinds');

      engine.startHarmonizeEncounter(wildWoodwindPet);
      expect(state.mode).toBe('harmonize_wild');

      // Check feedback indicates missing woodwinds section
      expect(state.harmonizeEncounter?.lastFeedbackText).toContain('NO WOODWINDS MUSICIAN IN LINEUP');

      // Reach catch threshold in performance phase
      engine.startPerformancePhase();
      state.harmonizeEncounter!.isPlayingMelody = false;
      state.harmonizeEncounter!.resonanceMeter = 90; // Over threshold
      
      // Play a note to trigger capture check
      engine.playHarmonizeNote(0);

      // Capture should fail due to missing acoustic resonance
      expect(state.harmonizeEncounter?.concluded).toBe(true);
      expect(state.harmonizeEncounter?.caught).toBe(false);
      expect(state.dialogue?.text[1]).toContain('To capture wild creatures of the WOODWINDS section');
    });

    it('should successfully capture the creature when active ensemble has a matching section musician', () => {
      const state = engine.getState();
      const wildWoodwindPet = state.npcs.find(n => n.id === 'npc_wild_finch')!;
      expect(wildWoodwindPet).toBeDefined();

      // Add a woodwind musician (Oliver) to active lineup
      state.ensemble.members.push({
        id: 'musician_oliver',
        name: 'Oliver',
        title: 'Woodland Flutist',
        avatar: '🪈',
        paletteColor: '#06b6d4',
        instrumentId: 'silver_flute',
        instrumentName: 'Silver Flute',
        section: 'woodwinds',
        stats: { technique: 30, toneQuality: 30, tempoStability: 30, sightReading: 30 },
        level: 1
      });

      engine.startHarmonizeEncounter(wildWoodwindPet);
      expect(state.harmonizeEncounter?.lastFeedbackText).not.toContain('NO WOODWINDS MUSICIAN');

      engine.startPerformancePhase();
      state.harmonizeEncounter!.isPlayingMelody = false;
      state.harmonizeEncounter!.targetNoteIndices.forEach(idx => engine.playHarmonizeNote(idx));

      expect(state.harmonizeEncounter?.concluded).toBe(true);
      expect(state.harmonizeEncounter?.caught).toBe(true);
      expect(state.ensemble.members.some(m => m.name === 'Chirpy')).toBe(true);
    });
  });

  describe('3. Section-Based Turn Combat in Ensemble Battles', () => {
    it('should group ensemble into sections and let each section execute specialized actions', () => {
      const state = engine.getState();
      // Build a multi-section ensemble: Strings, Woodwinds, Brass
      state.ensemble.members = [
        {
          id: 'player',
          name: 'Maestro',
          title: 'Violinist',
          avatar: '🎻',
          paletteColor: '#ec4899',
          instrumentId: 'violin',
          instrumentName: 'Violin',
          section: 'strings',
          stats: { technique: 40, toneQuality: 40, tempoStability: 40, sightReading: 40 },
          level: 3
        },
        {
          id: 'musician_oliver',
          name: 'Oliver',
          title: 'Flutist',
          avatar: '🪈',
          paletteColor: '#06b6d4',
          instrumentId: 'silver_flute',
          instrumentName: 'Flute',
          section: 'woodwinds',
          stats: { technique: 35, toneQuality: 35, tempoStability: 35, sightReading: 35 },
          level: 2
        },
        {
          id: 'musician_jax',
          name: 'Jax',
          title: 'Trumpeter',
          avatar: '🎺',
          paletteColor: '#f59e0b',
          instrumentId: 'pocket_trumpet',
          instrumentName: 'Trumpet',
          section: 'brass',
          stats: { technique: 30, toneQuality: 30, tempoStability: 30, sightReading: 30 },
          level: 2
        }
      ];

      engine.startConcertCompetition('rival_woodwind_trio');
      const comp = state.competition!;
      expect(comp).not.toBeNull();
      expect(comp.playerSections).toEqual(['strings', 'woodwinds', 'brass']);
      expect(comp.activeAttackingSection).toBe('strings');
      expect(comp.currentSectionIndex).toBe(0);

      const initialPlayerScore = comp.playerScore;

      // Turn 1: Strings attack with Cantabile Legato (action index 0)
      const stringsAction = SECTION_ACTIONS.strings[0];
      engine.executeSectionAction(0);
      expect(comp.playerScore).toBeGreaterThan(initialPlayerScore);
      expect(comp.combatLog?.some(l => l.includes(stringsAction.name))).toBe(true);
      expect(comp.activeAttackingSection).toBe('woodwinds');
      expect(comp.currentSectionIndex).toBe(1);

      // Turn 2: Woodwinds attack with Dolce Serenade (action index 1: heal/flow)
      const woodwindsAction = SECTION_ACTIONS.woodwinds[1];
      engine.executeSectionAction(1);
      expect(comp.combatLog?.some(l => l.includes(woodwindsAction.name))).toBe(true);
      expect(comp.activeAttackingSection).toBe('brass');
      expect(comp.currentSectionIndex).toBe(2);

      // Turn 3: Brass attack with Fortissimo Blare (action index 0)
      const initialRivalScore = comp.rivalScore;
      engine.executeSectionAction(0);
      
      // All player sections have attacked; rival should have counter-attacked
      expect(comp.rivalScore).toBeGreaterThan(initialRivalScore);
      expect(comp.currentSectionIndex).toBe(0);
      expect(comp.activeAttackingSection).toBe('strings');
      expect(comp.currentMeasure).toBe(1);
    });

    it('should support tactical effects like shield and boost_next in combat', () => {
      const state = engine.getState();
      engine.startConcertCompetition('rival_novice_buskers');
      const comp = state.competition!;

      // Strings Harmonic Overtones has effect: 'shield' (action index 3)
      engine.executeSectionAction(3);
      expect(comp.playerShieldActive).toBe(false); // Used and consumed during rival counter
      expect(comp.combatLog?.some(l => l.includes('Harmonic Shield absorbed'))).toBe(true);
    });
  });
});
