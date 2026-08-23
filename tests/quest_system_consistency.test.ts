import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { INITIAL_GAME_QUESTS, INITIAL_QUESTS } from '../src/data';

describe('Harmonia: Quest System Consistency & Narrative Progression', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Aria');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should export INITIAL_GAME_QUESTS and alias INITIAL_QUESTS with 11 complete quests', () => {
    expect(INITIAL_QUESTS).toBe(INITIAL_GAME_QUESTS);
    expect(INITIAL_GAME_QUESTS.length).toBe(11);

    // Verify all quest definitions have valid fields
    for (const q of INITIAL_GAME_QUESTS) {
      expect(q.id).toBeDefined();
      expect(q.title).toBeDefined();
      expect(q.chapter).toBeGreaterThanOrEqual(1);
      expect(q.chapter).toBeLessThanOrEqual(5);
      expect(q.description.length).toBeGreaterThan(10);
      expect(q.objective.length).toBeGreaterThan(10);
      expect(q.rewardGold).toBeGreaterThanOrEqual(0);
      expect(q.rewardSparks).toBeGreaterThanOrEqual(0);
      expect(q.completed).toBe(false);
    }
  });

  it('should structure all 5 Main Story chapters across the 4 cardinal villages and Central City', () => {
    const mainQuests = INITIAL_GAME_QUESTS.filter(q => q.type === 'main');
    expect(mainQuests.length).toBe(5);

    const [ch1, ch2, ch3, ch4, ch5] = mainQuests;

    // Ch 1: West (Cavatina Village - Strings)
    expect(ch1.id).toBe('quest_ch1');
    expect(ch1.chapter).toBe(1);
    expect(ch1.title).toContain('Western Strings');
    expect(ch1.description).toContain('Cavatina Village');
    expect(ch1.objective).toContain('Clara or Maya');
    expect(ch1.objective).toContain('Timmy');

    // Ch 2: East (Woodwind Woods - Woodwinds)
    expect(ch2.id).toBe('quest_ch2');
    expect(ch2.chapter).toBe(2);
    expect(ch2.title).toContain('Sylvan Woodwind');
    expect(ch2.description).toContain('Woodwind Woods');
    expect(ch2.objective).toContain('Oliver or Chloe');
    expect(ch2.objective).toContain('Leo');

    // Ch 3: North (Brass Citadel - Brass)
    expect(ch3.id).toBe('quest_ch3');
    expect(ch3.chapter).toBe(3);
    expect(ch3.title).toContain('Gilded Citadel');
    expect(ch3.description).toContain('The Brass Citadel');
    expect(ch3.objective).toContain('Jax or Sam');
    expect(ch3.objective).toContain('Baroness Vesta');

    // Ch 4: South (Percussion Peaks - Percussion)
    expect(ch4.id).toBe('quest_ch4');
    expect(ch4.chapter).toBe(4);
    expect(ch4.title).toContain('Mountain Thunder');
    expect(ch4.description).toContain('Percussion Peaks');
    expect(ch4.objective).toContain('Rita or Ren');
    expect(ch4.objective).toContain('Chieftain Ronin');

    // Ch 5: Center (Central City - The Grand Symphony Finale)
    expect(ch5.id).toBe('quest_ch5');
    expect(ch5.chapter).toBe(5);
    expect(ch5.title).toContain('Solstice Symphony');
    expect(ch5.description).toContain('The Central City');
    expect(ch5.objective).toContain('Nico');
    expect(ch5.objective).toContain('Aurelius');
  });

  it('should include immersive side quests covering key gameplay systems', () => {
    const state = engine.getState();

    // 1. Antique music box restoration
    const musicBox = state.quests.find(q => q.id === 'quest_side_musicbox');
    expect(musicBox).toBeDefined();
    expect(musicBox?.type).toBe('restoration');

    // 2. Wild Harmonipet bonding / rescue
    const familiarRescue = state.quests.find(q => q.id === 'quest_rescue_harmonidex');
    expect(familiarRescue).toBeDefined();
    expect(familiarRescue?.type).toBe('rescue');

    // 3. Theory curriculum favor
    const theoryScholar = state.quests.find(q => q.id === 'quest_side_theory_scholar');
    expect(theoryScholar).toBeDefined();
    expect(theoryScholar?.type).toBe('side');

    // 4. Luthier artisan commission
    const luthierCraft = state.quests.find(q => q.id === 'quest_side_luthier_artisan');
    expect(luthierCraft).toBeDefined();
    expect(luthierCraft?.type).toBe('side');

    // 5. Inspiration vistas restoration
    const vistasRestoration = state.quests.find(q => q.id === 'quest_restoration_vistas');
    expect(vistasRestoration).toBeDefined();
    expect(vistasRestoration?.type).toBe('restoration');

    // 6. Seasonal festival circuit gig
    const festivalGig = state.quests.find(q => q.id === 'quest_gig_festival_circuit');
    expect(festivalGig).toBeDefined();
    expect(festivalGig?.type).toBe('gig');
  });

  it('should advance activeQuestId sequentially as player wins concert competitions', () => {
    const state = engine.getState();
    expect(state.activeQuestId).toBe('quest_ch1');

    // Give player master ensemble to win each round
    state.ensemble.members = [
      { id: 'm1', name: 'Lead', stats: { technique: 100, toneQuality: 100, tempoStability: 100, sightReading: 100 }, instrumentId: 'violin', instrumentName: 'Violin', section: 'strings', level: 10, xp: 1000, avatar: '🎻', paletteColor: '#fff', pet: {} as any },
      { id: 'm2', name: 'Wind', stats: { technique: 100, toneQuality: 100, tempoStability: 100, sightReading: 100 }, instrumentId: 'silver_flute', instrumentName: 'Flute', section: 'woodwinds', level: 10, xp: 1000, avatar: '🪈', paletteColor: '#fff', pet: {} as any },
      { id: 'm3', name: 'Brass', stats: { technique: 100, toneQuality: 100, tempoStability: 100, sightReading: 100 }, instrumentId: 'pocket_trumpet', instrumentName: 'Trumpet', section: 'brass', level: 10, xp: 1000, avatar: '🎺', paletteColor: '#fff', pet: {} as any },
      { id: 'm4', name: 'Drums', stats: { technique: 100, toneQuality: 100, tempoStability: 100, sightReading: 100 }, instrumentId: 'snare_kit', instrumentName: 'Drums', section: 'percussion', level: 10, xp: 1000, avatar: '🥁', paletteColor: '#fff', pet: {} as any }
    ];
    state.ensemble.tier = 'orchestra';

    // Win Chapter 1 competition (Timmy)
    engine.startConcertCompetition('rival_novice_buskers');
    while (state.competition && !state.competition.concluded) {
      engine.advanceConcertPerformance();
    }
    const q1 = state.quests.find(q => q.id === 'quest_ch1');
    expect(q1?.completed).toBe(true);
    expect(state.activeQuestId).toBe('quest_ch2');

    // Win Chapter 2 competition (Leo)
    engine.startConcertCompetition('rival_woodwind_trio');
    while (state.competition && !state.competition.concluded) {
      engine.advanceConcertPerformance();
    }
    const q2 = state.quests.find(q => q.id === 'quest_ch2');
    expect(q2?.completed).toBe(true);
    expect(state.activeQuestId).toBe('quest_ch3');

    // Win Chapter 3 competition (Vesta)
    engine.startConcertCompetition('rival_brass_quartet');
    while (state.competition && !state.competition.concluded) {
      engine.advanceConcertPerformance();
    }
    const q3 = state.quests.find(q => q.id === 'quest_ch3');
    expect(q3?.completed).toBe(true);
    expect(state.activeQuestId).toBe('quest_ch4');

    // Win Chapter 4 competition (Ronin)
    engine.startConcertCompetition('rival_thunder_chamber');
    while (state.competition && !state.competition.concluded) {
      engine.advanceConcertPerformance();
    }
    const q4 = state.quests.find(q => q.id === 'quest_ch4');
    expect(q4?.completed).toBe(true);
    expect(state.activeQuestId).toBe('quest_ch5');

    // Win Chapter 5 finale (Aurelius)
    engine.startConcertCompetition('rival_grand_orchestra');
    while (state.competition && !state.competition.concluded) {
      engine.advanceConcertPerformance();
    }
    const q5 = state.quests.find(q => q.id === 'quest_ch5');
    expect(q5?.completed).toBe(true);
  });

  it('should complete side quests when performing associated actions (bonding, forging)', () => {
    const state = engine.getState();

    // 1. Forge an artifact -> complete quest_side_luthier_artisan
    state.wallet.gold = 1000;
    state.wallet.inspirationSparks = 100;
    const forgeOk = engine.forgeArtifact('artifact_rosin_swan');
    expect(forgeOk).toBe(true);
    const qLuthier = state.quests.find(q => q.id === 'quest_side_luthier_artisan');
    expect(qLuthier?.completed).toBe(true);
  });
});
