import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { INITIAL_DISPATCH_VENUES, PET_SYNERGIES, ALL_INSTRUMENTS_INFO } from '../src/data';
import { Musician } from '../src/types';

describe('Harmonia: Theory Lifelines, Quick-Wheel, Dispatches & Pet Synergies', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Maestro');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  describe('1. 3-Heart Theory Exam Lifelines & Practice Preview', () => {
    it('should grant 3 lifelines upon starting a theory challenge', () => {
      engine.startTheoryChallenge('pitch_recognition_1');
      const state = engine.getState();
      expect(state.mode).toBe('theory_challenge');
      expect(state.theoryChallenge).not.toBeNull();
      expect(state.theoryChallenge?.lifelinesRemaining).toBe(3);
      expect(state.theoryChallenge?.maxLifelines).toBe(3);
      expect(state.theoryChallenge?.isPracticePreview).toBe(false);
    });

    it('should decrement lifeline and provide remediation without failing on incorrect answer', () => {
      engine.startTheoryChallenge('pitch_recognition_1');
      const state = engine.getState();
      const ch = state.theoryChallenge!;
      const q0 = ch.questions[0];

      // Choose incorrect index
      const wrongIndex = (q0.correctIndex + 1) % q0.options.length;
      engine.answerTheoryQuestion(wrongIndex);

      expect(ch.lifelinesRemaining).toBe(2);
      expect(ch.completed).toBe(false);
      expect(state.dialogue).not.toBeNull();
      expect(state.dialogue?.speaker).toBe('Theory Remediation');

      // Advancing dialogue should proceed to the next question
      while (state.dialogue) engine.advanceDialogue();
      expect(ch.currentQuestionIndex).toBe(1);
      expect(state.mode).toBe('theory_challenge');
    });

    it('should fail the exam when all 3 lifelines are exhausted', () => {
      engine.startTheoryChallenge('pitch_recognition_1');
      const state = engine.getState();
      const ch = state.theoryChallenge!;

      // Miss 1st question
      const q0 = ch.questions[0];
      engine.answerTheoryQuestion((q0.correctIndex + 1) % q0.options.length);
      expect(ch.lifelinesRemaining).toBe(2);
      while (state.dialogue) engine.advanceDialogue();

      // Miss 2nd question
      const q1 = ch.questions[1];
      engine.answerTheoryQuestion((q1.correctIndex + 1) % q1.options.length);
      expect(ch.lifelinesRemaining).toBe(1);
      while (state.dialogue) engine.advanceDialogue();

      // Miss 3rd question -> All 3 lost!
      const q2 = ch.questions[2];
      engine.answerTheoryQuestion((q2.correctIndex + 1) % q2.options.length);
      expect(ch.lifelinesRemaining).toBe(0);
      expect(ch.completed).toBe(true);
      expect(state.dialogue?.speaker).toBe('Theory Drill Failed');

      // Dismiss dialogue returns to exploration
      while (state.dialogue) engine.advanceDialogue();
      expect(state.mode).toBe('exploration');
      expect(state.theoryChallenge).toBeNull();
      expect(state.completedTheoryDrills).not.toContain('pitch_recognition_1');
    });

    it('should support practice preview study mode without curriculum gating or rewards', () => {
      engine.startTheoryPracticePreview('pitch_recognition_1');
      const state = engine.getState();
      const ch = state.theoryChallenge!;
      expect(ch.isPracticePreview).toBe(true);
      expect(ch.rewardSparks).toBe(0);
      expect(ch.rewardSightReading).toBe(0);
      expect(ch.lifelinesRemaining).toBe(3);

      const initialSparks = state.wallet.inspirationSparks;

      // Answer all 3 questions
      while (state.theoryChallenge && !state.theoryChallenge.completed) {
        const q = state.theoryChallenge.questions[state.theoryChallenge.currentQuestionIndex];
        engine.answerTheoryQuestion(q.correctIndex);
        while (state.dialogue) engine.advanceDialogue();
      }

      expect(state.mode).toBe('exploration');
      expect(state.theoryChallenge).toBeNull();
      expect(state.wallet.inspirationSparks).toBe(initialSparks);
      expect(state.completedTheoryDrills).not.toContain('pitch_recognition_1');
    });
  });

  describe('2. In-world Instrument Quick-Wheel', () => {
    it('should toggle quick-wheel state in exploration mode', () => {
      const state = engine.getState();
      expect(state.showQuickWheel).toBe(false);

      engine.toggleQuickWheel();
      expect(state.showQuickWheel).toBe(true);

      engine.toggleQuickWheel();
      expect(state.showQuickWheel).toBe(false);

      engine.toggleQuickWheel(true);
      expect(state.showQuickWheel).toBe(true);

      engine.toggleQuickWheel(false);
      expect(state.showQuickWheel).toBe(false);
    });

    it('should fast-switch unlocked instruments and close quick-wheel', () => {
      const state = engine.getState();
      // Unlock silver_flute
      state.proficiency.unlockedInstruments.push('silver_flute');
      engine.toggleQuickWheel(true);
      expect(state.showQuickWheel).toBe(true);

      engine.selectQuickWheelInstrument('silver_flute');
      expect(state.showQuickWheel).toBe(false);
      expect(state.ensemble.members[0].instrumentId).toBe('silver_flute');
      expect(state.ensemble.members[0].instrumentName).toBe('Silver Concert Flute');
      expect(state.ensemble.members[0].section).toBe('woodwinds');
    });
  });

  describe('3. Conservatory Dispatch Gigs', () => {
    it('should define the 5 initial dispatch venues in data', () => {
      expect(INITIAL_DISPATCH_VENUES.length).toBe(5);
      const names = INITIAL_DISPATCH_VENUES.map(v => v.name);
      expect(names).toContain('Cavatina Gazebo');
      expect(names).toContain('Whispering Lounge');
      expect(names).toContain('Golden Canteen');
      expect(names).toContain('Boulder Saloon');
      expect(names).toContain('Grand Rotunda');
    });

    it('should start a dispatch for benched musicians in ensembleBox', () => {
      const state = engine.getState();
      const testMusician: Musician = {
        id: 'bench_musician_1',
        name: 'Rowan',
        title: 'Apprentice Flutist',
        avatar: '🪈',
        paletteColor: '#10b981',
        instrumentId: 'silver_flute',
        instrumentName: 'Silver Flute',
        section: 'woodwinds',
        pet: {
          id: 'pet_rowan',
          name: 'Zephyr',
          species: 'Piccolo Finch',
          sprite: 'finch',
          section: 'woodwinds',
          instrumentName: 'Silver Flute',
          leitmotifSound: 'flute_chirp',
          color: '#10b981'
        },
        stats: { technique: 30, toneQuality: 30, tempoStability: 30, sightReading: 30 },
        level: 2,
        xp: 100
      };
      state.ensembleBox.push(testMusician);

      const ok = engine.startDispatch('dispatch_cavatina_gazebo', [testMusician.id]);
      expect(ok).toBe(true);
      expect(state.activeDispatches.length).toBe(1);
      expect(state.activeDispatches[0].venueId).toBe('dispatch_cavatina_gazebo');
      expect(state.activeDispatches[0].completed).toBe(false);
      expect(state.activeDispatches[0].claimed).toBe(false);
    });

    it('should prevent duplicate dispatch of the same musician or to a running venue', () => {
      const state = engine.getState();
      const m1: Musician = {
        id: 'bench_m1',
        name: 'M1',
        title: 'Musician',
        avatar: '🎻',
        paletteColor: '#38bdf8',
        instrumentId: 'violin',
        instrumentName: 'Violin',
        section: 'strings',
        pet: { id: 'p1', name: 'P1', species: 'Swan', sprite: 'swan', section: 'strings', instrumentName: 'Violin', leitmotifSound: 'v', color: '#fff' },
        stats: { technique: 20, toneQuality: 20, tempoStability: 20, sightReading: 20 },
        level: 1,
        xp: 0
      };
      state.ensembleBox.push(m1);

      expect(engine.startDispatch('dispatch_cavatina_gazebo', [m1.id])).toBe(true);
      // Duplicate to same venue
      expect(engine.startDispatch('dispatch_cavatina_gazebo', [m1.id])).toBe(false);

      // Attempt to dispatch locked venue
      expect(engine.startDispatch('dispatch_whispering_lounge', [m1.id])).toBe(false);
    });

    it('should update dispatches with dt and allow claiming rewards upon completion', () => {
      const state = engine.getState();
      const m1: Musician = {
        id: 'bench_m2',
        name: 'M2',
        title: 'Musician',
        avatar: '🎻',
        paletteColor: '#38bdf8',
        instrumentId: 'violin',
        instrumentName: 'Violin',
        section: 'strings',
        pet: { id: 'p2', name: 'P2', species: 'Swan', sprite: 'swan', section: 'strings', instrumentName: 'Violin', leitmotifSound: 'v', color: '#fff' },
        stats: { technique: 20, toneQuality: 20, tempoStability: 20, sightReading: 20 },
        level: 1,
        xp: 0
      };
      state.ensembleBox.push(m1);

      engine.startDispatch('dispatch_cavatina_gazebo', [m1.id]);
      const initialGold = state.wallet.gold;
      const initialSparks = state.wallet.inspirationSparks;
      // Advance time by 35 seconds (duration is 30s)
      state.time += 35;
      engine.updateDispatches(0);
      expect(state.activeDispatches[0].completed).toBe(true);

      const claimResult = engine.claimDispatch('dispatch_cavatina_gazebo');
      expect(typeof claimResult).toBe('object');
      if (typeof claimResult === 'object') {
        expect(claimResult.success).toBe(true);
        expect(claimResult.rewardNotes).toBe(100);
        expect(claimResult.rewardSparks).toBe(5);
      }

      expect(state.wallet.gold).toBe(initialGold + 100);
      expect(state.wallet.inspirationSparks).toBe(initialSparks + 5);
      expect(m1.xp).toBeGreaterThan(0);
      expect(state.activeDispatches[0].claimed).toBe(true);
    });
  });

  describe('4. Pet Synergy Unison Attacks', () => {
    it('should define PET_SYNERGIES in data', () => {
      expect(PET_SYNERGIES.length).toBe(4);
      const names = PET_SYNERGIES.map(s => s.name);
      expect(names).toContain('Avian Cantabile');
      expect(names).toContain('Syncopated Fanfare');
      expect(names).toContain('Bebop Staccato');
      expect(names).toContain('Thunder Quake');
    });

    it('should enable Avian Cantabile when Swan + Finch are in active ensemble', () => {
      const state = engine.getState();
      // Player starter is violin (Allegro Swan)
      expect(state.ensemble.members[0].pet.species).toContain('Swan');

      // Add a finch musician to ensemble
      const finchMusician: Musician = {
        id: 'finch_member',
        name: 'Pip Piper',
        title: 'Flutist',
        avatar: '🪈',
        paletteColor: '#10b981',
        instrumentId: 'silver_flute',
        instrumentName: 'Silver Flute',
        section: 'woodwinds',
        pet: {
          id: 'pet_finch_duo',
          name: 'Pip',
          species: 'Piccolo Finch',
          sprite: 'finch',
          section: 'woodwinds',
          instrumentName: 'Silver Flute',
          leitmotifSound: 'flute_chirp',
          color: '#10b981'
        },
        stats: { technique: 30, toneQuality: 30, tempoStability: 30, sightReading: 30 },
        level: 2,
        xp: 100
      };
      state.ensemble.members.push(finchMusician);

      const claraNpc = state.npcs.find(n => n.id === 'npc_clara_world')!;
      engine.startAuditionBattle(claraNpc);

      const battle = state.auditionBattle!;
      expect(battle.synergyMoves).toBeDefined();
      expect(battle.synergyMoves?.length).toBeGreaterThan(0);
      const avian = battle.synergyMoves?.find(m => m.name === 'Avian Cantabile');
      expect(avian).toBeDefined();
      expect(avian?.effectType).toBe('heal_harmony');
    });

    it('should execute Pet Synergy attack, cost HP, and apply effects', () => {
      const state = engine.getState();
      // Add Terrier and Raccoon to ensemble
      state.ensemble.members[0].pet = {
        id: 'pet_terrier',
        name: 'Buster',
        species: 'Fanfare Terrier',
        sprite: 'terrier',
        section: 'brass',
        instrumentName: 'Trumpet',
        leitmotifSound: 'trumpet_blare',
        color: '#eab308'
      };

      const raccoonMusician: Musician = {
        id: 'raccoon_member',
        name: 'Rocky',
        title: 'Drummer',
        avatar: '🥁',
        paletteColor: '#64748b',
        instrumentId: 'snare_kit',
        instrumentName: 'Snare Kit',
        section: 'percussion',
        pet: {
          id: 'pet_raccoon_duo',
          name: 'Tempo',
          species: 'Beat Raccoon',
          sprite: 'raccoon',
          section: 'percussion',
          instrumentName: 'Snare Kit',
          leitmotifSound: 'drum_roll',
          color: '#64748b'
        },
        stats: { technique: 30, toneQuality: 30, tempoStability: 30, sightReading: 30 },
        level: 2,
        xp: 100
      };
      state.ensemble.members.push(raccoonMusician);

      const claraNpc = state.npcs.find(n => n.id === 'npc_clara_world')!;
      engine.startAuditionBattle(claraNpc);

      const battle = state.auditionBattle!;
      expect(battle.synergyMoves?.some(m => m.name === 'Syncopated Fanfare')).toBe(true);

      const initialHP = battle.harmonyPoints;
      const initialHarmony = battle.playerHarmonyMeter;

      engine.executePetSynergy('Syncopated Fanfare');

      expect(battle.harmonyPoints).toBe(initialHP - 40 + 15);
      expect(battle.playerHarmonyMeter).toBe(initialHarmony + 25);
      // Since it stuns, the opponent turn should be skipped and turn remains player
      expect(battle.turn).toBe('player');
    });
  });
});
