import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { HarmoniaUI } from '../src/ui';
import { THEORY_CURRICULUM } from '../src/data';

describe('Harmonia: Music Theory Requirements for Progression & Pet Evolution', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    // Setup clean DOM environment for UI tests
    document.body.innerHTML = `
      <div id="game-container">
        <canvas id="game-canvas"></canvas>
        <div id="dex-list"></div>
        <div id="ensemble-roster-list"></div>
        <div id="quests-list"></div>
        <div id="modal-dex" class="modal-overlay hidden">
          <button id="btn-close-dex"></button>
        </div>
        <div id="modal-evolution" class="modal-overlay hidden">
          <button id="btn-close-evolution"></button>
          <div id="evolution-body"></div>
        </div>
        <div id="modal-sandbox" class="modal-overlay hidden">
          <button id="btn-close-sandbox"></button>
          <div id="sandbox-body"></div>
        </div>
      </div>
    `;

    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Lyra');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  describe('1. Musician Leveling & Theory Curriculum Gating', () => {
    it('should gate promotion from Lv.3 to Lv.4 until passing Theory Tier 1', () => {
      const state = engine.getState();
      const player = state.ensemble.members[0];
      expect(player.level).toBe(1);

      // Award enough XP to reach Lv.3 (needs 250 XP)
      const res1 = engine.awardMusicianXp(player, 260);
      expect(player.level).toBe(3);
      expect(res1.gated).toBe(false);

      // Try to award enough XP to reach Lv.4 (needs 450 XP) without theory certification
      const res2 = engine.awardMusicianXp(player, 300); // total xp = 560
      expect(player.level).toBe(3); // Gated at Lv.3!
      expect(res2.gated).toBe(true);
      expect(res2.requiredTheoryTier).toBe(1);

      // Pass Tier 1 Theory Curriculum Exam
      engine.startTheoryChallenge('pitch_recognition_1');
      while (state.theoryChallenge && !state.theoryChallenge.completed) {
        const q = state.theoryChallenge.questions[state.theoryChallenge.currentQuestionIndex];
        engine.answerTheoryQuestion(q.correctIndex);
        while (state.dialogue) engine.advanceDialogue();
      }

      // Check that gate was unlocked and musician leveled up
      expect(state.completedTheoryDrills.includes('pitch_recognition_1')).toBe(true);
      expect(player.level).toBe(4);
    });

    it('should gate promotion across Lv.6 -> Lv.7 (Tier 2) and Lv.9 -> Lv.10 (Tier 3)', () => {
      const state = engine.getState();
      const player = state.ensemble.members[0];

      // Pass Tier 1
      state.completedTheoryDrills.push('pitch_recognition_1');
      state.theoryLevel = 2;

      // Award XP to reach Lv.6 (1000 XP)
      engine.awardMusicianXp(player, 1100);
      expect(player.level).toBe(6);

      // Try to reach Lv.7 (1350 XP)
      const resLv7 = engine.awardMusicianXp(player, 400);
      expect(player.level).toBe(6);
      expect(resLv7.gated).toBe(true);
      expect(resLv7.requiredTheoryTier).toBe(2);

      // Pass Tier 2 Exam
      state.completedTheoryDrills.push('key_signatures_1');
      state.theoryLevel = 3;
      engine.checkLevelUps();
      expect(player.level).toBe(7);

      // Award XP to reach Lv.9 (2200 XP)
      engine.awardMusicianXp(player, 1000);
      expect(player.level).toBe(9);

      // Try to reach Lv.10 (2700 XP)
      const resLv10 = engine.awardMusicianXp(player, 600);
      expect(player.level).toBe(9);
      expect(resLv10.gated).toBe(true);
      expect(resLv10.requiredTheoryTier).toBe(3);

      // Pass Tier 3 Exam
      state.completedTheoryDrills.push('rhythm_meter_1');
      state.theoryLevel = 4;
      engine.checkLevelUps();
      expect(player.level).toBe(10);
    });
  });

  describe('2. Bonded Harmonipet Evolutions & Theory Exam Prerequisite', () => {
    it('should enforce level and Conservatory Theory Exam requirements for pet evolution', () => {
      const state = engine.getState();
      const swanDex = state.harmoniDex.find(d => d.id === 'dex_swan')!;
      expect(swanDex.bonded).toBe(true);
      expect(swanDex.evolutionStage).toBe(1);
      expect(swanDex.sprite).toBe('🐣');
      expect(swanDex.evolvesTo).toBe('Symphonic Swan');

      // 1. Gated by Level (player is Lv.1, requires Lv.3)
      const checkLv1 = engine.canEvolvePet('dex_swan');
      expect(checkLv1.canEvolve).toBe(false);
      expect(checkLv1.reason).toContain('must reach Level 3');

      // Level up player to Lv.3 without passing theory exam
      state.ensemble.members[0].level = 3;
      state.completedTheoryDrills = [];
      state.theoryLevel = 1;

      // 2. Gated by Conservatory Theory Exam
      const checkTheory = engine.canEvolvePet('dex_swan');
      expect(checkTheory.canEvolve).toBe(false);
      expect(checkTheory.requiresTheory).toBe(true);
      expect(checkTheory.reason).toContain('Conservatory Theory Exam');

      // 3. Pass Conservatory Theory Exam
      state.completedTheoryDrills.push('pitch_recognition_1');
      state.theoryLevel = 2;

      const checkReady = engine.canEvolvePet('dex_swan');
      expect(checkReady.canEvolve).toBe(true);

      // 4. Trigger Evolution!
      const evolved = engine.evolvePet('dex_swan');
      expect(evolved).toBe(true);

      expect(swanDex.evolutionStage).toBe(2);
      expect(swanDex.species).toBe('Symphonic Swan');
      expect(swanDex.sprite).toBe('🦢');
      expect(swanDex.description).toContain('Symphonic Swan');

      // Verify active musician pet updated
      expect(state.ensemble.members[0].pet.species).toBe('Symphonic Swan');
      expect(state.ensemble.members[0].pet.sprite).toBe('🦢');

      // Verify lastEvolvedPet state payload
      expect(state.lastEvolvedPet).not.toBeNull();
      expect(state.lastEvolvedPet?.prevSpecies).toBe('Allegro Swan');
      expect(state.lastEvolvedPet?.prevSprite).toBe('🐣');
      expect(state.lastEvolvedPet?.newSpecies).toBe('Symphonic Swan');
      expect(state.lastEvolvedPet?.newSprite).toBe('🦢');
    });

    it('should support cute before-and-after evolutions for iconic familiars (Fox & Hedgehog)', () => {
      const state = engine.getState();
      state.completedTheoryDrills.push('pitch_recognition_1');
      state.theoryLevel = 2;
      state.ensemble.members[0].level = 5;

      // Test Bebop Fox: 🦊 -> 🦊🎷
      const foxDex = state.harmoniDex.find(d => d.id === 'dex_sax_fox')!;
      foxDex.bonded = true;
      expect(foxDex.sprite).toBe('🦊');
      expect(foxDex.evolvesTo).toBe('Virtuoso Bebop Fox');
      expect(foxDex.evolvedSprite).toBe('🦊🎷');

      expect(engine.evolvePet('dex_sax_fox')).toBe(true);
      expect(foxDex.species).toBe('Virtuoso Bebop Fox');
      expect(foxDex.sprite).toBe('🦊🎷');

      // Test Rockabilly Hedgehog: 🦔 -> 🦔🎸
      const hedgehogDex = state.harmoniDex.find(d => d.id === 'dex_rock_hedgehog')!;
      hedgehogDex.bonded = true;
      expect(hedgehogDex.sprite).toBe('🦔');
      expect(hedgehogDex.evolvesTo).toBe('Heavy Metal Porcupine');
      expect(hedgehogDex.evolvedSprite).toBe('🦔🎸');

      expect(engine.evolvePet('dex_rock_hedgehog')).toBe(true);
      expect(hedgehogDex.species).toBe('Heavy Metal Porcupine');
      expect(hedgehogDex.sprite).toBe('🦔🎸');
    });
  });

  describe('3. Main and Side Quests Reflecting Music Theory Prerequisites', () => {
    it('should assign explicit theory tier requirements to all 5 main chapters and side quests', () => {
      const state = engine.getState();
      const ch1 = state.quests.find(q => q.id === 'quest_ch1')!;
      const ch2 = state.quests.find(q => q.id === 'quest_ch2')!;
      const ch3 = state.quests.find(q => q.id === 'quest_ch3')!;
      const ch4 = state.quests.find(q => q.id === 'quest_ch4')!;
      const ch5 = state.quests.find(q => q.id === 'quest_ch5')!;

      expect(ch1.requiredTheoryTier).toBe(1);
      expect(ch1.objective).toContain('Theory Tier 1');

      expect(ch2.requiredTheoryTier).toBe(2);
      expect(ch2.objective).toContain('Theory Tier 2');

      expect(ch3.requiredTheoryTier).toBe(3);
      expect(ch3.objective).toContain('Theory Tier 3');

      expect(ch4.requiredTheoryTier).toBe(4);
      expect(ch4.objective).toContain('Theory Tier 4');

      expect(ch5.requiredTheoryTier).toBe(5);
      expect(ch5.objective).toContain('Theory Tier 5');

      // Side quests
      const qScholar = state.quests.find(q => q.id === 'quest_side_theory_scholar')!;
      expect(qScholar.requiredTheoryTier).toBe(1);

      const qLuthier = state.quests.find(q => q.id === 'quest_side_luthier_artisan')!;
      expect(qLuthier.requiredTheoryTier).toBe(2);
    });

    it('should correctly evaluate checkQuestTheoryPrerequisites', () => {
      const state = engine.getState();
      state.completedTheoryDrills = [];

      expect(engine.checkQuestTheoryPrerequisites('quest_ch1')).toBe(false);
      expect(engine.checkQuestTheoryPrerequisites('quest_ch2')).toBe(false);

      state.completedTheoryDrills.push('pitch_recognition_1');
      expect(engine.checkQuestTheoryPrerequisites('quest_ch1')).toBe(true);
      expect(engine.checkQuestTheoryPrerequisites('quest_ch2')).toBe(false);

      state.completedTheoryDrills.push('key_signatures_1');
      expect(engine.checkQuestTheoryPrerequisites('quest_ch2')).toBe(true);
    });
  });

  describe('4. Cute Pet Evolution Modal & UI Integration', () => {
    it('should render sparkling celebration modal with before/after sprites and lore', () => {
      const ui = new HarmoniaUI(engine);
      const state = engine.getState();
      state.completedTheoryDrills.push('pitch_recognition_1');
      state.theoryLevel = 2;
      state.ensemble.members[0].level = 5;

      const success = ui.triggerPetEvolution('dex_swan');
      expect(success).toBe(true);

      const modal = document.getElementById('modal-evolution');
      expect(modal?.classList.contains('hidden')).toBe(false);

      const body = document.getElementById('evolution-body');
      expect(body?.innerHTML).toContain('Harmonipet Ascended');
      expect(body?.innerHTML).toContain('🐣');
      expect(body?.innerHTML).toContain('🦢');
      expect(body?.innerHTML).toContain('Symphonic Swan');
      expect(body?.innerHTML).toContain('sparkle-particle');
      expect(body?.innerHTML).toContain('Harmonious Lore &amp; New Abilities');
    });

    it('should render evolution buttons in HarmoniDex and Developer Sandbox', () => {
      const ui = new HarmoniaUI(engine);
      const state = engine.getState();

      // Render HarmoniDex
      ui.renderHarmoniDex();
      const dexList = document.getElementById('dex-list')!;
      expect(dexList.innerHTML).toContain('Evolution Pathway');
      expect(dexList.innerHTML).toContain('btn-evolve-action');

      // Test sandbox cheat evolution
      const cheatSuccess = engine.cheatEvolveActivePet();
      expect(cheatSuccess).toBe(true);
      expect(state.harmoniDex.find(d => d.id === 'dex_swan')?.evolutionStage).toBe(2);
    });
  });
});
