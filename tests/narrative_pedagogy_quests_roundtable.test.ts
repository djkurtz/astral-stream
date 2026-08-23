import { describe, it, expect, beforeEach, vi } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { INITIAL_GAME_QUESTS, INITIAL_WORLD_NPCS, RECRUITABLE_MUSICIANS } from '../src/data';
import { soundEngine } from '../src/audio';

describe('Harmonia: Narrative Quests, Composer Roundtable, Puzzle Gates & Pedagogy', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    localStorage.clear();
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Aria');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  /* ---------------- 1. NARRATIVE QUESTS PRESENCE & SCHEMA ---------------- */

  it('should include all 5 new narrative quests in INITIAL_GAME_QUESTS with valid schemas', () => {
    const requiredQuestIds = [
      'quest_brass_bow_debate',
      'quest_bass_underground',
      'quest_mrs_chen_score',
      'quest_blind_conductor',
      'quest_maestro_roundtable'
    ];

    for (const qId of requiredQuestIds) {
      const q = INITIAL_GAME_QUESTS.find(quest => quest.id === qId);
      expect(q).toBeDefined();
      expect(q?.title.length).toBeGreaterThan(5);
      expect(q?.description.length).toBeGreaterThan(15);
      expect(q?.objective.length).toBeGreaterThan(10);
      expect(q?.rewardGold).toBeGreaterThan(0);
      expect(q?.rewardSparks).toBeGreaterThan(0);
      expect(q?.rewardStars).toBeGreaterThanOrEqual(1);
      expect(q?.completed).toBe(false);
    }
  });

  /* ---------------- 2. THE BRASS & BOW DEBATE (CLARA & JAX) ---------------- */

  it('should complete quest_brass_bow_debate when both Clara and Jax are recruited', () => {
    const state = engine.getState();
    const q = state.quests.find(quest => quest.id === 'quest_brass_bow_debate');
    expect(q).toBeDefined();
    expect(q?.completed).toBe(false);

    const initialGold = state.wallet.gold;
    const initialSparks = state.wallet.inspirationSparks;

    // Recruit Clara
    const clara = JSON.parse(JSON.stringify(RECRUITABLE_MUSICIANS.find(m => m.name.includes('Clara'))!));
    state.recruitedMusicians.push(clara);
    engine.checkNarrativeQuestCompletions();
    expect(q?.completed).toBe(false);

    // Recruit Jax
    const jax = JSON.parse(JSON.stringify(RECRUITABLE_MUSICIANS.find(m => m.name.includes('Jax'))!));
    state.recruitedMusicians.push(jax);
    engine.checkNarrativeQuestCompletions();

    expect(q?.completed).toBe(true);
    expect(state.wallet.gold).toBe(initialGold + (q?.rewardGold || 0));
    expect(state.wallet.inspirationSparks).toBe(initialSparks + (q?.rewardSparks || 0));

    // Test banter dialogue
    const claraNpc = INITIAL_WORLD_NPCS.find(n => n.name.includes('Clara'))!;
    state.nearbyInteractable = JSON.parse(JSON.stringify(claraNpc));
    engine.interactWithNearby();
    expect(state.dialogue).toBeDefined();
    expect(state.dialogue?.text[0]).toContain('Brass & Bow duet');
  });

  /* ---------------- 3. SUBTERRANEAN GROOVE (MAYA & RITA) ---------------- */

  it('should complete quest_bass_underground when both Maya and Rita are recruited', () => {
    const state = engine.getState();
    const q = state.quests.find(quest => quest.id === 'quest_bass_underground');
    expect(q).toBeDefined();
    expect(q?.completed).toBe(false);

    const initialGold = state.wallet.gold;

    // Recruit Maya
    const maya = JSON.parse(JSON.stringify(RECRUITABLE_MUSICIANS.find(m => m.name.includes('Maya'))!));
    state.recruitedMusicians.push(maya);
    engine.checkNarrativeQuestCompletions();
    expect(q?.completed).toBe(false);

    // Recruit Rita
    const rita = JSON.parse(JSON.stringify(RECRUITABLE_MUSICIANS.find(m => m.name.includes('Rita'))!));
    state.recruitedMusicians.push(rita);
    engine.checkNarrativeQuestCompletions();

    expect(q?.completed).toBe(true);
    expect(state.wallet.gold).toBe(initialGold + (q?.rewardGold || 0));

    // Test groove dialogue
    const mayaNpc = INITIAL_WORLD_NPCS.find(n => n.name.includes('Maya'))!;
    state.nearbyInteractable = JSON.parse(JSON.stringify(mayaNpc));
    engine.interactWithNearby();
    expect(state.dialogue).toBeDefined();
    expect(state.dialogue?.text[0]).toContain('underground groove');
  });

  /* ---------------- 4. MRS. CHEN\'S SECRET LULLABY SCORE ---------------- */

  it('should complete quest_mrs_chen_score when speaking with Mrs. Chen after meeting requirements', () => {
    const state = engine.getState();
    const q = state.quests.find(quest => quest.id === 'quest_mrs_chen_score');
    expect(q).toBeDefined();
    expect(q?.completed).toBe(false);

    const mrsChenNpc = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_parent_clara')!;
    expect(mrsChenNpc).toBeDefined();

    // With Clara recruited or Theory Tier 1 passed
    state.theoryLevel = 2;
    state.nearbyInteractable = JSON.parse(JSON.stringify(mrsChenNpc));
    engine.interactWithNearby();

    expect(q?.completed).toBe(true);
    expect(state.dialogue).toBeDefined();
    expect(state.dialogue?.text.some(t => t.includes('Cavatina Lullaby'))).toBe(true);

    // Subsequent interaction shows fond reflection
    while (state.dialogue) engine.advanceDialogue();
    engine.interactWithNearby();
    expect(state.dialogue?.text[0]).toContain('lyrical warmth');
  });

  /* ---------------- 5. THE BLIND CONDUCTOR TIMBRE CLINIC ---------------- */

  it('should complete quest_blind_conductor and buff ensemble stats when consulting Maestro Tiresias', () => {
    const state = engine.getState();
    const q = state.quests.find(quest => quest.id === 'quest_blind_conductor');
    expect(q).toBeDefined();
    expect(q?.completed).toBe(false);

    const conductorNpc = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_blind_conductor')!;
    expect(conductorNpc).toBeDefined();

    const initialTone = state.ensemble.members[0].stats.toneQuality;
    const initialSight = state.ensemble.members[0].stats.sightReading;

    state.nearbyInteractable = JSON.parse(JSON.stringify(conductorNpc));
    engine.interactWithNearby();

    expect(q?.completed).toBe(true);
    expect(state.ensemble.members[0].stats.toneQuality).toBe(initialTone + 5);
    expect(state.ensemble.members[0].stats.sightReading).toBe(initialSight + 5);
    expect(state.dialogue?.text.some(t => t.includes('Timbre clinic complete'))).toBe(true);
  });

  /* ---------------- 6. THE MAESTRO\'S ROUNDTABLE TITAN JAM ---------------- */

  it('should trigger post-game jam session and complete quest_maestro_roundtable after Chapter 5', () => {
    const state = engine.getState();
    const q = state.quests.find(quest => quest.id === 'quest_maestro_roundtable');
    expect(q).toBeDefined();
    expect(q?.completed).toBe(false);

    const tableNpc = INITIAL_WORLD_NPCS.find(n => n.id === 'npc_maestro_roundtable')!;
    expect(tableNpc).toBeDefined();

    // If Chapter 5 not complete, interaction warns player
    state.nearbyInteractable = JSON.parse(JSON.stringify(tableNpc));
    engine.interactWithNearby();
    expect(q?.completed).toBe(false);
    expect(state.dialogue?.text[0]).toContain('reserved for the Solstice Symphony Champion');

    while (state.dialogue) engine.advanceDialogue();

    // Mark Chapter 5 as completed
    const q5 = state.quests.find(quest => quest.id === 'quest_ch5')!;
    q5.completed = true;

    const spyJam = vi.spyOn(soundEngine, 'playMaestroRoundtableJam');
    engine.interactWithNearby();

    expect(q?.completed).toBe(true);
    expect(spyJam).toHaveBeenCalled();
    expect(state.dialogue?.text[0]).toContain("THE MAESTRO'S ROUNDTABLE POST-GAME JAM");
    expect(state.dialogue?.text.some(t => t.includes('Mozart'))).toBe(true);
    expect(state.dialogue?.text.some(t => t.includes('Beethoven'))).toBe(true);
    expect(state.dialogue?.text.some(t => t.includes('Bach'))).toBe(true);
    expect(state.dialogue?.text.some(t => t.includes('Paganini'))).toBe(true);
    expect(state.dialogue?.text.some(t => t.includes('Satie'))).toBe(true);
  });

  /* ---------------- 7. CIRCLE OF FIFTHS ACOUSTIC PUZZLE GATES ---------------- */

  it('should unlock mountain pass monoliths by modulating through ascending fifths', () => {
    const gates = INITIAL_WORLD_NPCS.filter(n => n.actionType === 'circle_of_fifths_puzzle');
    expect(gates.length).toBeGreaterThanOrEqual(3);

    const northGate = gates.find(g => g.id === 'npc_puzzle_gate_north')!;
    expect(northGate).toBeDefined();

    const state = engine.getState();
    expect(state.unlockedAcousticGates).toEqual([]);

    state.nearbyInteractable = JSON.parse(JSON.stringify(northGate));
    engine.interactWithNearby();

    expect(state.unlockedAcousticGates).toContain('npc_puzzle_gate_north');
    expect(state.dialogue?.text.some(t => t.includes('Modulation Sequence Aligned: C Major ➔ G Major'))).toBe(true);
    expect(state.dialogue?.text.some(t => t.includes('Mountain passage unlocked'))).toBe(true);

    while (state.dialogue) engine.advanceDialogue();

    // Second interaction recognizes permanent unlock
    engine.interactWithNearby();
    expect(state.dialogue?.text[0]).toContain('permanently unlocked');
  });

  /* ---------------- 8. GRAND STAFF VISUALIZER & SOLFÈGE IN PRACTICE SHED ---------------- */

  it('should toggle Grand Staff visualizer with key V and toggleStaffVisualizer', () => {
    const state = engine.getState();
    expect(state.showStaffVisualizer).toBe(false);

    engine.toggleStaffVisualizer();
    expect(state.showStaffVisualizer).toBe(true);

    engine.toggleStaffVisualizer(false);
    expect(state.showStaffVisualizer).toBe(false);

    // Test KeyV handler in practice mode
    engine.startPracticeSession('scale_run');
    expect(state.mode).toBe('practice');

    engine.handleKeyDown('KeyV');
    expect(state.showStaffVisualizer).toBe(true);

    engine.handleKeyDown('KeyV');
    expect(state.showStaffVisualizer).toBe(false);
  });

  /* ---------------- 9. PHYSICAL MODELING & AUDIO NUANCES ---------------- */

  it('should synthesize Karplus-Strong strings and FM bell sidebands without errors', () => {
    expect(() => {
      // Harp & Guitar (Karplus-Strong physical modeling)
      soundEngine.playInstrumentNote('harp', 440, 0.4);
      soundEngine.playInstrumentNote('acoustic_guitar', 220, 0.4);

      // Glockenspiel & Oboe (FM bell & double-reed sidebands)
      soundEngine.playInstrumentNote('glockenspiel', 880, 0.5);
      soundEngine.playInstrumentNote('oboe', 440, 0.4);

      // Celebratory Roundtable Jam
      soundEngine.playMaestroRoundtableJam();
    }).not.toThrow();
  });

  /* ---------------- 10. PERSISTENCE OF PEDAGOGY & NARRATIVE SYSTEMS ---------------- */

  it('should persist unlockedAcousticGates and showStaffVisualizer across save and load', () => {
    const state = engine.getState();
    state.showStaffVisualizer = true;
    state.unlockedAcousticGates = ['npc_puzzle_gate_north', 'npc_puzzle_gate_south'];

    expect(engine.saveGame()).toBe(true);

    const newEngine = new HarmoniaGameEngine();
    expect(newEngine.loadGame()).toBe(true);

    const loadedState = newEngine.getState();
    expect(loadedState.showStaffVisualizer).toBe(true);
    expect(loadedState.unlockedAcousticGates).toEqual(['npc_puzzle_gate_north', 'npc_puzzle_gate_south']);

    // Test Save Export & Import JSON validation
    const exportJson = engine.exportSaveFile();
    expect(exportJson).toContain('unlockedAcousticGates');
    expect(exportJson).toContain('showStaffVisualizer');

    const freshEngine = new HarmoniaGameEngine();
    const result = freshEngine.importSaveFile(exportJson);
    expect(result.success).toBe(true);
    expect(freshEngine.getState().showStaffVisualizer).toBe(true);
    expect(freshEngine.getState().unlockedAcousticGates).toEqual(['npc_puzzle_gate_north', 'npc_puzzle_gate_south']);
  });
});
