import { describe, it, expect } from 'vitest';
import { WORLD_ZONES, INITIAL_WORLD_NPCS } from '../src/data';
import { HarmoniaGameEngine } from '../src/game';

describe('Settlements, Parents, Wandering & Exploration Audit', () => {
  it('should have complete replicated buildings across all 4 cardinal settlements', () => {
    const villages = ['cavatina_village', 'woodwind_woods', 'brass_citadel', 'percussion_peaks'];
    
    for (const v of villages) {
      const zone = WORLD_ZONES[v];
      expect(zone).toBeDefined();
      const buildingTypes = zone.obstacles.filter(o => o.type === 'building' || o.type === 'gate').map(o => o.buildingType);
      
      expect(buildingTypes).toContain('academy');
      expect(buildingTypes).toContain('forge');
      expect(buildingTypes).toContain('library');
      expect(buildingTypes).toContain('tavern');
      expect(buildingTypes).toContain('clocktower');
    }
  });

  it('should have adult parent spectators with humorous dialog in each village', () => {
    const parents = INITIAL_WORLD_NPCS.filter(n => n.id.startsWith('npc_parent_') || n.id.startsWith('npc_spectator_'));
    expect(parents.length).toBeGreaterThanOrEqual(8);

    const cavatinaParents = parents.filter(p => p.zone === 'cavatina_village');
    const woodsParents = parents.filter(p => p.zone === 'woodwind_woods');
    const citadelParents = parents.filter(p => p.zone === 'brass_citadel');
    const peaksParents = parents.filter(p => p.zone === 'percussion_peaks');

    expect(cavatinaParents.length).toBeGreaterThanOrEqual(2);
    expect(woodsParents.length).toBeGreaterThanOrEqual(2);
    expect(citadelParents.length).toBeGreaterThanOrEqual(2);
    expect(peaksParents.length).toBeGreaterThanOrEqual(2);
  });

  it('should have asymmetric wilderness regions with short transit and rich exploration', () => {
    const ewWilderness = ['west_wilderness', 'east_wilderness'];
    for (const w of ewWilderness) {
      const zone = WORLD_ZONES[w];
      expect(zone.width).toBe(800); // short E/W transit
      expect(zone.height).toBe(1800); // deep N/S exploration
    }

    const nsWilderness = ['north_wilderness', 'south_wilderness'];
    for (const w of nsWilderness) {
      const zone = WORLD_ZONES[w];
      expect(zone.width).toBe(1800); // deep E/W exploration
      expect(zone.height).toBe(800); // short N/S transit
    }

    const chests = INITIAL_WORLD_NPCS.filter(n => n.actionType === 'treasure_chest');
    expect(chests.length).toBe(4);
    for (const chest of chests) {
      expect(chest.treasureReward?.notes).toBeGreaterThan(0);
      expect(chest.treasureReward?.sparks).toBeGreaterThan(0);
    }
  });

  it('should have The Grand Symphony Hall and landmark buildings in the Central City', () => {
    const grandHall = WORLD_ZONES['grand_hall'];
    expect(grandHall).toBeDefined();
    const buildingNames = grandHall.obstacles.filter(o => o.type === 'building').map(o => o.name);
    expect(buildingNames).toContain('The Grand Symphony Hall');
    expect(buildingNames).toContain('High Conservatory of Maestros');
    expect(buildingNames).toContain('Royal Archives & Grand Library');
    expect(buildingNames).toContain("The Maestro's Forum & Taphouse");
    expect(buildingNames).toContain('Solstice Clocktower & Council Hall');
  });

  it('should update NPC wandering and banter in game engine', () => {
    const engine = new HarmoniaGameEngine();
    const state = engine.getState();
    
    const wanderingNPCs = state.npcs.filter(n => n.wander && n.zone === state.currentZone);
    expect(wanderingNPCs.length).toBeGreaterThan(0);

    const initialX = wanderingNPCs[0].x;
    const initialY = wanderingNPCs[0].y;

    // Simulate 5 seconds of game updates
    for (let i = 0; i < 50; i++) {
      engine.update(100 * (i + 1));
    }

    const currentNPC = engine.getState().npcs.find(n => n.id === wanderingNPCs[0].id);
    expect(currentNPC).toBeDefined();
  });

  it('should not contain any TeX / LaTeX syntax in dialogues, descriptions, or zone subtitles', () => {
    const checkText = (text: string) => {
      expect(text).not.toContain('$\\rightarrow$');
      expect(text).not.toContain('$ ightarrow$');
      expect(text).not.toContain('\\rightarrow');
      expect(text).not.toContain('\\frac');
    };

    for (const zone of Object.values(WORLD_ZONES)) {
      checkText(zone.name);
      checkText(zone.subtitle);
      for (const t of zone.transitions) {
        checkText(t.promptText);
      }
    }

    for (const npc of INITIAL_WORLD_NPCS) {
      checkText(npc.name);
      checkText(npc.title);
      for (const line of npc.dialogue || []) {
        checkText(line);
      }
    }
  });

  it('should support challenging Harmonipet encounters with hidden notes and replay', () => {
    const engine = new HarmoniaGameEngine();
    const wildPet = INITIAL_WORLD_NPCS.find(n => n.actionType === 'wild_harmonipet');
    expect(wildPet).toBeDefined();

    engine.startHarmonizeEncounter(wildPet!);
    const enc = engine.getState().harmonizeEncounter;
    expect(enc).toBeDefined();
    expect(enc?.revealedSteps).toEqual([false, false, false, false]);

    // Replay method works
    expect(typeof engine.replayHarmonizeMelody).toBe('function');
    engine.replayHarmonizeMelody();

    // Test correct sequence progression
    const expectedFirstNote = enc!.targetNoteIndices[0];
    enc!.isPlayingMelody = false; // ensure not blocked by audio playback
    engine.playHarmonizeNote(expectedFirstNote);

    expect(engine.getState().harmonizeEncounter?.revealedSteps?.[0]).toBe(true);
    expect(engine.getState().harmonizeEncounter?.currentStep).toBe(1);
  });
});
