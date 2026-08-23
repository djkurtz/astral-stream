import { describe, it, expect, beforeEach } from 'vitest';
import { HarmoniaGameEngine } from '../src/game';
import { WORLD_ZONES, calculateDynamicRivalStats } from '../src/data';

describe('Harmonia: Radial World, Starting Villages & Festival Calendar', () => {
  let engine: HarmoniaGameEngine;

  beforeEach(() => {
    engine = new HarmoniaGameEngine();
  });

  it('should start player in the village associated with their chosen instrument section', () => {
    // 1. Strings -> Cavatina Village
    engine.chooseStarter('violin', 'StringsHero');
    expect(engine.getState().currentZone).toBe('cavatina_village');
    expect(engine.getState().discoveredZones.cavatina_village).toBe(true);

    // 2. Woodwinds -> Woodwind Woods
    const engineWoodwinds = new HarmoniaGameEngine();
    engineWoodwinds.chooseStarter('silver_flute', 'WindHero');
    expect(engineWoodwinds.getState().currentZone).toBe('woodwind_woods');
    expect(engineWoodwinds.getState().discoveredZones.woodwind_woods).toBe(true);

    // 3. Brass -> Brass Citadel
    const engineBrass = new HarmoniaGameEngine();
    engineBrass.chooseStarter('pocket_trumpet', 'BrassHero');
    expect(engineBrass.getState().currentZone).toBe('brass_citadel');
    expect(engineBrass.getState().discoveredZones.brass_citadel).toBe(true);

    // 4. Percussion -> Percussion Peaks
    const enginePerc = new HarmoniaGameEngine();
    enginePerc.chooseStarter('snare_kit', 'DrumHero');
    expect(enginePerc.getState().currentZone).toBe('percussion_peaks');
    expect(enginePerc.getState().discoveredZones.percussion_peaks).toBe(true);
  });

  it('should verify radial hub-and-spoke connectivity through wilderness zones to Grand Hall', () => {
    // Cavatina (West) -> West Wilds -> Grand Hall (Center)
    const cavatina = WORLD_ZONES.cavatina_village;
    const toWestWilds = cavatina.transitions.find(t => t.targetZone === 'west_wilderness');
    expect(toWestWilds).toBeDefined();

    const westWilds = WORLD_ZONES.west_wilderness;
    const toGrandHallFromWest = westWilds.transitions.find(t => t.targetZone === 'grand_hall');
    expect(toGrandHallFromWest).toBeDefined();

    const grandHall = WORLD_ZONES.grand_hall;
    expect(grandHall.transitions.length).toBe(4); // North, East, South, West
    expect(grandHall.transitions.some(t => t.targetZone === 'west_wilderness')).toBe(true);
    expect(grandHall.transitions.some(t => t.targetZone === 'east_wilderness')).toBe(true);
    expect(grandHall.transitions.some(t => t.targetZone === 'north_wilderness')).toBe(true);
    expect(grandHall.transitions.some(t => t.targetZone === 'south_wilderness')).toBe(true);
  });

  it('should scale rival stats dynamically based on player progression tier', () => {
    const baseStats = { technique: 30, toneQuality: 30, tempoStability: 30, sightReading: 30 };
    
    const tier1 = calculateDynamicRivalStats(baseStats, 1);
    expect(tier1.technique).toBe(30);

    const tier3 = calculateDynamicRivalStats(baseStats, 3);
    expect(tier3.technique).toBeGreaterThan(tier1.technique);
    expect(tier3.technique).toBe(Math.round(30 * (1 + 2 * 0.35))); // 30 * 1.7 = 51

    const tier5 = calculateDynamicRivalStats(baseStats, 5);
    expect(tier5.technique).toBeGreaterThan(tier3.technique);
    expect(tier5.technique).toBe(Math.round(30 * (1 + 4 * 0.35))); // 30 * 2.4 = 72
  });

  it('should manage festival calendar competitions and validate entry requirements', () => {
    engine.chooseStarter('violin', 'Aria');
    const state = engine.getState();
    expect(state.calendarEvents.length).toBeGreaterThanOrEqual(4);

    const springEvent = state.calendarEvents.find(e => e.id === 'event_spring_cavatina')!;
    expect(springEvent).toBeDefined();
    expect(springEvent.entryFeeGold).toBe(20);

    // Initial player is Solo tier (needs Duet tier)
    state.wallet.gold = 50;
    
    // Add a second musician to achieve Duet tier
    state.ensemble.members.push({
      id: 'companion_clara',
      name: 'Clara',
      title: 'Cellist',
      avatar: '🎻',
      paletteColor: '#ec4899',
      instrumentId: 'cello',
      instrumentName: 'Cello',
      section: 'strings',
      pet: state.ensemble.members[0].pet,
      stats: { technique: 30, toneQuality: 30, tempoStability: 30, sightReading: 30 },
      level: 2,
      xp: 100
    });
    state.ensemble.tier = 'duet';

    const enterSuccess = engine.enterFestivalCompetition('event_spring_cavatina');
    expect(enterSuccess).toBe(true);
    expect(state.mode).toBe('competition');
    expect(state.wallet.gold).toBe(30); // 50 - 20 fee
    expect(state.competition?.rival.name).toBe('Duet Master Clara');
  });
});
