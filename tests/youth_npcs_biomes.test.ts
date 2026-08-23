import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { RECRUITABLE_MUSICIANS, RIVAL_ENSEMBLES, WORLD_ZONES } from '../src/data';
import { soundEngine } from '../src/audio';

describe('Youth Aspiring Musicians & Wilderness Biome Soundscapes', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
    engine.chooseStarter('violin', 'Maestro');
    while (engine.getState().dialogue) {
      engine.advanceDialogue();
    }
  });

  it('should portray aspiring musicians as energetic kids, preteens, teenagers, and young adults', () => {
    expect(RECRUITABLE_MUSICIANS.length).toBeGreaterThanOrEqual(10);

    // Verify youthful ages and archetypes in titles
    const clara = RECRUITABLE_MUSICIANS.find(m => m.name === 'Clara');
    expect(clara?.title).toContain('Age 15');

    const oliver = RECRUITABLE_MUSICIANS.find(m => m.name === 'Oliver');
    expect(oliver?.title).toContain('Age 13');

    const jax = RECRUITABLE_MUSICIANS.find(m => m.name.includes('Jax'));
    expect(jax?.title).toContain('Age 17');

    const toby = RECRUITABLE_MUSICIANS.find(m => m.name === 'Toby');
    expect(toby?.title).toContain('Age 11');

    const maya = RECRUITABLE_MUSICIANS.find(m => m.name === 'Maya');
    expect(maya?.title).toContain('Age 15');

    const chloe = RECRUITABLE_MUSICIANS.find(m => m.name === 'Chloe');
    expect(chloe?.title).toContain('Age 12');

    const devon = RECRUITABLE_MUSICIANS.find(m => m.name === 'Devon');
    expect(devon?.title).toContain('Age 19');

    const sam = RECRUITABLE_MUSICIANS.find(m => m.name === 'Sam');
    expect(sam?.title).toContain('Age 16');

    const ren = RECRUITABLE_MUSICIANS.find(m => m.name === 'Ren');
    expect(ren?.title).toContain('Age 12');

    const nico = RECRUITABLE_MUSICIANS.find(m => m.name === 'Nico');
    expect(nico?.title).toContain('Age 20');
  });

  it('should feature youthful conductors and vibrant ensembles across rival stages', () => {
    expect(RIVAL_ENSEMBLES[0].conductorName).toContain('Timmy (Age 12)');
    expect(RIVAL_ENSEMBLES[1].conductorName).toContain('Leo (Age 14)');
    expect(RIVAL_ENSEMBLES[2].conductorName).toContain('Baroness Vesta (Age 17)');
    expect(RIVAL_ENSEMBLES[3].conductorName).toContain('Ronin (Age 18)');
    expect(RIVAL_ENSEMBLES[4].conductorName).toContain('Aurelius (Age 21)');
  });

  it('should verify all 4 wilderness regions have wild Harmonipets and vistas', () => {
    const state = engine.getState();
    const wildernessZones = ['west_wilderness', 'east_wilderness', 'north_wilderness', 'south_wilderness'];

    for (const zoneId of wildernessZones) {
      const zoneNpcs = state.npcs.filter(n => n.zone === zoneId);
      
      // Wild pet present
      const wildPet = zoneNpcs.find(n => n.actionType === 'wild_harmonipet');
      expect(wildPet, `Wilderness zone ${zoneId} should have a wild Harmonipet`).toBeDefined();
      expect(wildPet?.wildPetData).toBeDefined();

      // Inspiration vista present
      const vista = zoneNpcs.find(n => n.actionType === 'inspiration_vista');
      expect(vista, `Wilderness zone ${zoneId} should have an inspiration vista`).toBeDefined();
      expect(vista?.vistaId).toBeDefined();

      // Young aspiring musician or traveler on the road
      const youthMusician = zoneNpcs.find(n => n.actionType === 'audition_battle');
      expect(youthMusician, `Wilderness zone ${zoneId} should have an auditionable musician`).toBeDefined();
    }
  });

  it('should initialize dynamic soundscapes and play wildlife calls', () => {
    expect(soundEngine.playWildlifeCall).toBeDefined();
    expect(soundEngine.playBiomeNatureAmbience).toBeDefined();

    // Verify calling wildlife audio does not throw
    expect(() => soundEngine.playWildlifeCall('hare')).not.toThrow();
    expect(() => soundEngine.playWildlifeCall('swan')).not.toThrow();
    expect(() => soundEngine.playWildlifeCall('frog')).not.toThrow();
    expect(() => soundEngine.playWildlifeCall('finch')).not.toThrow();
    expect(() => soundEngine.playWildlifeCall('badger')).not.toThrow();
    expect(() => soundEngine.playWildlifeCall('terrier')).not.toThrow();
    expect(() => soundEngine.playWildlifeCall('armadillo')).not.toThrow();
    expect(() => soundEngine.playWildlifeCall('tortoise')).not.toThrow();
  });
});
