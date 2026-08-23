import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { PRONOUN_PRESETS, FUNNY_NAME_PRESETS } from '../src/data';

describe('Character Identity, Pronouns, and Dialogue Systems', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
  });

  describe('1. Name, Pronouns, and Appearance Customization', () => {
    it('should initialize with default name Maestro and they/them pronouns', () => {
      const state = engine.getState();
      expect(state.customization.name).toBe('Maestro');
      expect(state.customization.pronouns).toBe('they/them');
    });

    it('should preserve customized name, pronouns, and appearance on chooseStarter', () => {
      engine.chooseStarter('violin', 'Seraphina', 'she/her');
      const state = engine.getState();
      expect(state.customization.name).toBe('Seraphina');
      expect(state.customization.pronouns).toBe('she/her');
      expect(state.ensemble.members[0].name).toBe('Seraphina');
      expect(state.ensemble.members[0].pronouns).toBe('she/her');
    });

    it('should update player musician when customization changes at runtime (e.g. via mirror)', () => {
      engine.chooseStarter('violin', 'Maestro');
      engine.setCustomization({
        name: 'Cadence',
        pronouns: 'forte/fortissimo',
        outfitColor: '#dc2626',
        hairColor: '#eab308',
        hatStyle: 'beret'
      });

      const state = engine.getState();
      expect(state.customization.name).toBe('Cadence');
      expect(state.customization.pronouns).toBe('forte/fortissimo');
      expect(state.ensemble.members[0].name).toBe('Cadence');
      expect(state.ensemble.members[0].pronouns).toBe('forte/fortissimo');
      expect(state.ensemble.members[0].outfitColor).toBe('#dc2626');
      expect(state.ensemble.members[0].hairColor).toBe('#eab308');
      expect(state.ensemble.members[0].hatStyle).toBe('beret');
    });

    it('should randomize customization presets and synchronize with player member', () => {
      engine.chooseStarter('silver_flute');
      engine.randomizeCustomization();
      const state = engine.getState();
      expect(FUNNY_NAME_PRESETS).toContain(state.customization.name);
      expect(state.ensemble.members[0].name).toBe(state.customization.name);
      expect(state.ensemble.members[0].pronouns).toBe(state.customization.pronouns);
    });
  });

  describe('2. Pronoun and Dialogue Token Replacement', () => {
    it('should replace standard pronouns tokens correctly with proper capitalization', () => {
      engine.setCustomization({ name: 'Rowan', pronouns: 'they/them' });
      const text = '{Player} tuned {their} instrument {themself}. {They} told {them} the tempo.';
      const formatted = engine.formatDialogueText(text);
      expect(formatted).toBe('Rowan tuned their instrument themself. They told them the tempo.');
    });

    it('should replace she/her and he/him pronouns correctly', () => {
      engine.setCustomization({ name: 'Clara', pronouns: 'she/her' });
      const textShe = '{Player} is ready. {They} took {their} violin with {them}.';
      expect(engine.formatDialogueText(textShe)).toBe('Clara is ready. She took her violin with her.');

      engine.setCustomization({ name: 'Jax', pronouns: 'he/him' });
      const textHe = '{Player} plays loud. {They} plays {their} trumpet {themself}.';
      expect(engine.formatDialogueText(textHe)).toBe('Jax plays loud. He plays his trumpet himself.');
    });

    it('should replace funny musical pronouns correctly', () => {
      engine.setCustomization({ name: 'Brio', pronouns: 'maestro/maestri' });
      const text = '{Player} enters the hall. Pass {them} {their} score!';
      expect(engine.formatDialogueText(text)).toBe("Brio enters the hall. Pass maestro maestro's score!");

      engine.setCustomization({ name: 'Forte', pronouns: 'forte/fortissimo' });
      const text2 = 'Give it to {them}! {They} is louder than anyone!';
      expect(engine.formatDialogueText(text2)).toBe('Give it to fortissimo! Forte is louder than anyone!');
    });

    it('should replace custom neopronouns correctly', () => {
      engine.setCustomization({
        name: 'Zephyr',
        pronouns: 'custom',
        customSubject: 'ze',
        customObject: 'zir',
        customPossessive: 'zir'
      });
      const text = '{Player} adjusted {their} reed. {They} played a solo for {themself}.';
      expect(engine.formatDialogueText(text)).toBe('Zephyr adjusted zir reed. Ze played a solo for zirself.');
    });

    it('should replace speaker NPC name and pronouns tokens', () => {
      engine.setCustomization({ name: 'Aria' });
      const text = '{npc_name} smiled at {player}. {Npc_sub} nodded {npc_pos} head.';
      const formatted = engine.formatDialogueText(text, 'Mama Aria (Your Stage Mom)');
      expect(formatted).toBe('Mama Aria (Your Stage Mom) smiled at Aria. She nodded her head.');
    });

    it('should format text when showDialogue is invoked', () => {
      engine.setCustomization({ name: 'Talia', pronouns: 'she/her' });
      engine.showDialogue('Professor Lyra', '🎓', ['Welcome {player}! {They} will do great!']);
      const state = engine.getState();
      expect(state.dialogue).not.toBeNull();
      expect(state.dialogue?.text[0]).toBe('Welcome Talia! She will do great!');
    });
  });

  describe('3. NPC Pronoun Assignment', () => {
    it('should have explicit pronouns for major story NPCs', () => {
      const npcs = engine.getState().npcs;
      const lyra = npcs.find(n => n.id === 'npc_theory_professor');
      expect(lyra?.pronouns).toBe('they/them');

      const marco = npcs.find(n => n.id === 'npc_luthier_marco');
      expect(marco?.pronouns).toBe('he/him');

      const barnaby = npcs.find(n => n.id === 'npc_barkeep_barnaby');
      expect(barnaby?.pronouns).toBe('he/him');

      const aria = npcs.find(n => n.id === 'npc_player_parent');
      expect(aria?.pronouns).toBe('she/her');

      const chen = npcs.find(n => n.id === 'npc_parent_clara');
      expect(chen?.pronouns).toBe('she/her');

      const timothy = npcs.find(n => n.id === 'npc_side_musicbox');
      expect(timothy?.pronouns).toBe('he/him');

      const oliver = npcs.find(n => n.id === 'npc_oliver_world');
      expect(oliver?.pronouns).toBe('he/him');

      const rita = npcs.find(n => n.id === 'npc_rita_world');
      expect(rita?.pronouns).toBe('she/her');
    });

    it('should automatically assign valid pronouns to all non-prop NPCs in the world', () => {
      const npcs = engine.getState().npcs;
      const validLabels = PRONOUN_PRESETS.map(p => p.label);
      for (const npc of npcs) {
        if (!npc.isProp) {
          expect(npc.pronouns).toBeDefined();
          expect(validLabels).toContain(npc.pronouns);
        }
      }
    });
  });

  describe('4. Ambient Chat Bubbles and Backwards Mapping Fix', () => {
    it('should map banter lines to exact speaking NPCs without name prefixes', () => {
      const npcs = engine.getState().npcs;
      const clara = npcs.find(n => n.name.includes('Clara') && !n.isNonMusician)!;
      const chen = npcs.find(n => n.name.includes('Chen'))!;

      const banter1 = (engine as any).getBanterForNPCs(clara, chen);
      expect(banter1[clara.name]).toBe("Mom, I'm jamming!");
      expect(banter1[chen.name]).toBe("Practice 40 hrs!");
      expect(banter1[clara.name]).not.toContain('Clara:');
      expect(banter1[chen.name]).not.toContain('Mrs. Chen:');

      // Test order invariance (passing in reverse)
      const banter2 = (engine as any).getBanterForNPCs(chen, clara);
      expect(banter2[clara.name]).toBe("Mom, I'm jamming!");
      expect(banter2[chen.name]).toBe("Practice 40 hrs!");
    });

    it('should correctly map father/son dialogue for Jax and Officer Briggs', () => {
      const npcs = engine.getState().npcs;
      const jax = npcs.find(n => n.name.includes('Jax'))!;
      const briggs = npcs.find(n => n.name.includes('Briggs'))!;

      const banter = (engine as any).getBanterForNPCs(jax, briggs);
      expect(banter[jax.name]).toBe('High C forever!');
      expect(banter[briggs.name]).toBe('Keep it down!');
    });

    it('should correctly map mother/daughter dialogue for Rita and Mama Kroll', () => {
      const npcs = engine.getState().npcs;
      const rita = npcs.find(n => n.name.includes('Rita'))!;
      const kroll = npcs.find(n => n.name.includes('Kroll'))!;

      const banter = (engine as any).getBanterForNPCs(rita, kroll);
      expect(banter[rita.name]).toBe('Best snare surface!');
      expect(banter[kroll.name]).toBe('Not on the table!');
    });
  });

  describe('5. NPC Multiple Dialogue Cycling', () => {
    it('should cycle through dialogue sets for Mama Aria', () => {
      const aria = engine.getState().npcs.find(n => n.id === 'npc_player_parent')!;
      expect(aria.dialogueSets).toBeDefined();
      expect(aria.dialogueSets!.length).toBe(4);

      const d1 = engine.getNPCDialogue(aria);
      const d2 = engine.getNPCDialogue(aria);
      const d3 = engine.getNPCDialogue(aria);
      const d4 = engine.getNPCDialogue(aria);
      const d5 = engine.getNPCDialogue(aria);

      expect(d1).toEqual(aria.dialogueSets![0]);
      expect(d2).toEqual(aria.dialogueSets![1]);
      expect(d3).toEqual(aria.dialogueSets![2]);
      expect(d4).toEqual(aria.dialogueSets![3]);
      expect(d5).toEqual(aria.dialogueSets![0]); // Wrapped around
    });

    it('should cycle through dialogue sets for Elder Timothy', () => {
      const timothy = engine.getState().npcs.find(n => n.id === 'npc_side_musicbox')!;
      expect(timothy.dialogueSets).toBeDefined();
      expect(timothy.dialogueSets!.length).toBe(3);

      const d1 = engine.getNPCDialogue(timothy);
      const d2 = engine.getNPCDialogue(timothy);
      const d3 = engine.getNPCDialogue(timothy);
      const d4 = engine.getNPCDialogue(timothy);

      expect(d1).toEqual(timothy.dialogueSets![0]);
      expect(d2).toEqual(timothy.dialogueSets![1]);
      expect(d3).toEqual(timothy.dialogueSets![2]);
      expect(d4).toEqual(timothy.dialogueSets![0]);
    });

    it('should ensure all character NPCs have multiple dialogue sets', () => {
      const npcs = engine.getState().npcs;
      for (const npc of npcs) {
        if (!npc.isProp) {
          expect(npc.dialogueSets).toBeDefined();
          expect(npc.dialogueSets!.length).toBeGreaterThanOrEqual(2);
        }
      }
    });
  });
});
