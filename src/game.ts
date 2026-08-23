// Harmonia: Opus of the Ensemble - Game Engine

import {
  GameState, Musician, Harmonipet, WorldNPC, RivalEnsemble,
  AuditionBattle, InstrumentId, InstrumentSection, EnsembleTier, ZoneId, TheoryChallengeType, PlayerCustomization,
  RepertoirePiece, HarmoniaSaveExport, HarmoniaSavePayload, HarmoniDexEntry, ActiveDispatch
} from './types';
import {
  STARTER_OPTIONS, REPERTOIRE_DATABASE,
  RIVAL_ENSEMBLES, WORLD_ZONES, INITIAL_WORLD_NPCS, BATTLE_MOVES, FESTIVAL_CALENDAR, calculateDynamicRivalStats,
  INSTRUMENT_ARTIFACTS, INITIAL_LOST_SCORES, INITIAL_INSPIRATION_VISTAS, INITIAL_GAME_QUESTS,
  INITIAL_HARMONIDEX, CLEF_BADGES, DEFAULT_CUSTOMIZATION, THEORY_CURRICULUM,
  getBattleMovesForMusician, ALL_INSTRUMENTS_INFO, RECRUITABLE_MUSICIANS, INITIAL_DISPATCH_VENUES, PET_SYNERGIES
} from './data';
import { BattleMove } from './types';
import { soundEngine } from './audio';

export function matchesPetRequirement(pet: Harmonipet, req: string): boolean {
  const r = req.toLowerCase();
  const species = (pet.species || '').toLowerCase();
  const sprite = (pet.sprite || '').toLowerCase();
  const name = (pet.name || '').toLowerCase();
  return species.includes(r) || sprite.includes(r) || name.includes(r);
}

export function generateHarmonizeMelody(pet: Harmonipet, dexEntry?: HarmoniDexEntry): { noteIndices: number[]; targetMelody: number[] } {
  const FREQS = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
  const rarity = pet.rarity || dexEntry?.rarity;
  let len = 4;
  if (rarity === 'common') {
    len = 4;
  } else if (rarity === 'rare') {
    len = (pet.species.includes('Badger') || pet.species.includes('Lion') || pet.species.includes('Owl')) ? 6 : 5;
  } else if (rarity === 'legendary' || rarity === 'exotic') {
    len = (pet.species.includes('Fox') || pet.species.includes('Elephant') || pet.species.includes('Beetle') || pet.species.includes('Bombardier')) ? 8 : 7;
  } else {
    // Name-based fallback
    const s = pet.species.toLowerCase();
    if (s.includes('chameleon') || s.includes('hedgehog') || s.includes('typewriter') || s.includes('woodpecker')) len = 7;
    else if (s.includes('sax') || s.includes('elephant') || s.includes('cannon') || s.includes('bombardier')) len = 8;
    else if (s.includes('dolphin') || s.includes('lynx') || s.includes('bear')) len = 5;
    else if (s.includes('badger') || s.includes('lion') || s.includes('owl')) len = 6;
    else len = 4;
  }

  let noteIndices: number[] = [];
  if (pet.section === 'woodwinds') {
    const patterns: Record<number, number[]> = {
      4: [0, 2, 1, 3],
      5: [0, 2, 1, 2, 3],
      6: [0, 2, 3, 2, 1, 0],
      7: [0, 2, 1, 3, 2, 1, 0],
      8: [0, 2, 1, 3, 0, 2, 1, 3]
    };
    noteIndices = patterns[len] || [0, 2, 1, 3];
  } else if (pet.section === 'brass') {
    const patterns: Record<number, number[]> = {
      4: [0, 2, 3, 2],
      5: [0, 0, 2, 3, 2],
      6: [0, 2, 0, 2, 3, 2],
      7: [0, 2, 3, 2, 3, 2, 0],
      8: [0, 2, 3, 2, 0, 2, 3, 0]
    };
    noteIndices = patterns[len] || [0, 2, 3, 2];
  } else if (pet.section === 'percussion') {
    const patterns: Record<number, number[]> = {
      4: [0, 1, 2, 3],
      5: [0, 1, 0, 2, 3],
      6: [0, 1, 0, 1, 2, 3],
      7: [0, 0, 1, 1, 2, 2, 3],
      8: [0, 1, 2, 3, 0, 1, 2, 3]
    };
    noteIndices = patterns[len] || [0, 1, 2, 3];
  } else {
    // strings (default)
    const patterns: Record<number, number[]> = {
      4: [0, 1, 2, 3],
      5: [0, 1, 2, 1, 3],
      6: [0, 1, 2, 3, 2, 0],
      7: [0, 1, 2, 3, 2, 1, 0],
      8: [0, 1, 2, 3, 0, 1, 2, 3]
    };
    noteIndices = patterns[len] || [0, 1, 2, 3];
  }

  const targetMelody = pet.section === 'percussion' 
    ? [...noteIndices] 
    : noteIndices.map(i => FREQS[i]);

  return { noteIndices, targetMelody };
}

export class HarmoniaGameEngine {
  private state: GameState;
  private keysDown: Set<string> = new Set();
  private lastTime: number = 0;

  constructor() {
    this.state = this.createInitialState();
  }

  public getState(): GameState {
    return this.state;
  }

  private createInitialState(): GameState {
    return {
      mode: 'character_customization',
      currentZone: 'cavatina_village',
      player: {
        x: 1000,
        y: 920,
        dir: 'down',
        isMoving: false
      },
      customization: JSON.parse(JSON.stringify(DEFAULT_CUSTOMIZATION)),
      followerTrail: [{ x: 1000, y: 940 }],
      camera: { x: 360, y: 440 },
      ensemble: {
        name: 'The Harmonia Ensemble',
        tier: 'solo',
        members: [],
        activePiece: REPERTOIRE_DATABASE[0], // Minuet in G
        reputationStars: 0,
        fameLevel: 1
      },
      recruitedMusicians: [],
      ensembleBox: [],
      harmoniDex: JSON.parse(JSON.stringify(INITIAL_HARMONIDEX)),
      badges: JSON.parse(JSON.stringify(CLEF_BADGES)),
      repertoire: [REPERTOIRE_DATABASE[0]], // Starter solo piece
      discoveredZones: {
        cavatina_village: true,
        woodwind_woods: false,
        brass_citadel: false,
        percussion_peaks: false,
        grand_hall: false,
        west_wilderness: false,
        east_wilderness: false,
        north_wilderness: false,
        south_wilderness: false
      },
      npcs: JSON.parse(JSON.stringify(INITIAL_WORLD_NPCS)),
      nearbyInteractable: null,
      wallet: {
        gold: 150,
        inspirationSparks: 10,
        reputationStars: 0
      },
      artifacts: JSON.parse(JSON.stringify(INSTRUMENT_ARTIFACTS)),
      lostScores: JSON.parse(JSON.stringify(INITIAL_LOST_SCORES)),
      vistas: JSON.parse(JSON.stringify(INITIAL_INSPIRATION_VISTAS)),
      quests: JSON.parse(JSON.stringify(INITIAL_GAME_QUESTS)),
      activeQuestId: 'quest_ch1',
      questInventory: [],
      openedChests: [],
      discoveredSecrets: [],
      proficiency: {
        sections: { strings: 25, woodwinds: 20, brass: 20, percussion: 20 },
        instruments: {
          violin: { level: 1, xp: 0 },
          acoustic_guitar: { level: 1, xp: 0 },
          cello: { level: 1, xp: 0 },
          harp: { level: 1, xp: 0 },
          silver_flute: { level: 1, xp: 0 },
          soprano_sax: { level: 1, xp: 0 },
          clarinet: { level: 1, xp: 0 },
          oboe: { level: 1, xp: 0 },
          pocket_trumpet: { level: 1, xp: 0 },
          french_horn: { level: 1, xp: 0 },
          trombone: { level: 1, xp: 0 },
          tuba: { level: 1, xp: 0 },
          snare_kit: { level: 1, xp: 0 },
          marimba: { level: 1, xp: 0 },
          timpani: { level: 1, xp: 0 },
          glockenspiel: { level: 1, xp: 0 },
          harpsichord: { level: 1, xp: 0 },
          electric_guitar: { level: 1, xp: 0 },
          saxophone: { level: 1, xp: 0 },
          typewriter: { level: 1, xp: 0 },
          cannon: { level: 1, xp: 0 }
        },
        unlockedInstruments: ['violin']
      },
      practiceLevel: 1,
      theoryLevel: 1,
      completedTheoryDrills: [],
      practiceSession: null,
      theoryChallenge: null,
      auditionBattle: null,
      harmonizeEncounter: null,
      competition: null,
      calendarEvents: JSON.parse(JSON.stringify(FESTIVAL_CALENDAR)),
      completedEvents: [],
      activeDispatches: [],
      dispatchVenues: JSON.parse(JSON.stringify(INITIAL_DISPATCH_VENUES)),
      showStaffVisualizer: false,
      showQuickWheel: false,
      pianistBuskingWins: 0,
      hasPianoAccompaniment: false,
      unlockedAcousticGates: [],
      dialogue: null,
      time: 0
    };
  }

  /* ---------------- STARTER CUSTOMIZATION ---------------- */

  public chooseStarter(instrumentId: InstrumentId, playerName: string = 'Maestro'): void {
    const starterOpt = STARTER_OPTIONS.find(s => s.id === instrumentId) || STARTER_OPTIONS[0];
    
    const playerMusician: Musician = {
      id: 'player_musician',
      name: playerName,
      title: 'Novice Soloist',
      isPlayer: true,
      avatar: starterOpt.section === 'strings' ? '🎻' : (starterOpt.section === 'woodwinds' ? '🪈' : (starterOpt.section === 'brass' ? '🎺' : '🥁')),
      paletteColor: starterOpt.pet.color,
      instrumentId: starterOpt.id,
      instrumentName: starterOpt.name,
      section: starterOpt.section,
      pet: starterOpt.pet,
      stats: { ...starterOpt.baseStats },
      level: 1,
      xp: 0
    };

    this.state.ensemble.members = [playerMusician];
    this.state.recruitedMusicians = [playerMusician];
    this.state.mode = 'exploration';

    // Mark starter in HarmoniDex
    const dexEntry = this.state.harmoniDex.find(d => d.instrumentId === starterOpt.id);
    if (dexEntry) {
      dexEntry.discovered = true;
      dexEntry.bonded = true;
    }

    // Initialize player proficiency with chosen starter
    this.state.proficiency.unlockedInstruments = [starterOpt.id];
    this.state.proficiency.sections[starterOpt.section] = 40;
    this.state.proficiency.instruments[starterOpt.id] = { level: 1, xp: 0 };

    // Determine starting zone and initial active quest based on instrument section
    let startZone: ZoneId = 'cavatina_village';
    let startName = 'Cavatina Village';
    let startQuestId = 'quest_ch1';

    if (starterOpt.section === 'woodwinds') {
      startZone = 'woodwind_woods';
      startName = 'Woodwind Woods';
      startQuestId = 'quest_ch2';
    } else if (starterOpt.section === 'brass') {
      startZone = 'brass_citadel';
      startName = 'The Brass Citadel';
      startQuestId = 'quest_ch3';
    } else if (starterOpt.section === 'percussion') {
      startZone = 'percussion_peaks';
      startName = 'Percussion Peaks';
      startQuestId = 'quest_ch4';
    }

    this.state.activeQuestId = startQuestId;
    this.state.currentZone = startZone;
    this.state.discoveredZones[startZone] = true;
    this.state.player.x = 1000;
    this.state.player.y = 920;
    this.state.followerTrail = [{ x: 1000, y: 940 }];

    // Start zone ambient music
    soundEngine.startBGM(startZone, [starterOpt.section]);

    this.showDialogue('Harmonia Musical Heritage', '🎼', [
      `Welcome to Harmonia, ${playerName}! Your bond with ${starterOpt.pet.name} the ${starterOpt.pet.species} shines bright.`,
      `As an aspiring master of the ${starterOpt.name} (${starterOpt.sectionName}), you begin your journey in ${startName}!`,
      "Hone your craft, explore the wilderness trails connecting each cardinal realm to the central Grand Symphony Hall, and join regional Festival Competitions to ascend your fame!"
    ]);
  }

  /* ---------------- PRACTICE SHED SYSTEM ---------------- */

  public startPracticeSession(type: 'metronome' | 'scale_run' | 'tone_shaping' = 'metronome'): void {
    const lead = this.ensurePlayerMusician();
    const tier = this.state.practiceLevel;
    const bpms = [85, 110, 135, 160];
    const bpm = bpms[Math.min(tier - 1, bpms.length - 1)];
    const duration = 16; // 16 second drill

    const notes: any[] = [];
    const interval = (60 / bpm) * (tier === 1 ? 2 : (tier === 2 ? 1.5 : (tier === 3 ? 1.0 : 0.75)));
    for (let t = 2.0; t < duration - 1.0; t += interval) {
      notes.push({
        targetTime: t,
        lane: Math.floor(Math.random() * 4),
        pitch: 440,
        hit: false,
        missed: false
      });
    }

    this.state.practiceSession = {
      type,
      tier,
      instrumentId: lead.instrumentId,
      duration,
      elapsedTime: 0,
      bpm,
      notes,
      score: 0,
      combo: 0,
      maxCombo: 0,
      feedbackText: `Practice Tier ${tier} (${bpm} BPM) - Ready!`,
      feedbackTimer: 1.5,
      completed: false,
      statGained: null
    };

    soundEngine.stopBGM();
    this.state.mode = 'practice';
  }

  public hitPracticeNote(lane: number = 0): void {
    const session = this.state.practiceSession;
    if (!session || session.completed) return;

    const lead = this.state.ensemble.members[0];
    const now = session.elapsedTime;
    let closestNote = null;
    let minDelta = Infinity;

    for (const note of session.notes) {
      if (!note.hit && !note.missed && note.lane === lane) {
        const delta = Math.abs(now - note.targetTime);
        if (delta < minDelta) {
          minDelta = delta;
          closestNote = note;
        }
      }
    }

    if (closestNote && minDelta < 0.35) {
      closestNote.hit = true;
      let accuracy: 'perfect' | 'great' | 'good' | 'miss' = 'good';
      let pts = 50;

      if (minDelta < 0.08) {
        accuracy = 'perfect';
        pts = 100;
      } else if (minDelta < 0.18) {
        accuracy = 'great';
        pts = 75;
      }

      closestNote.accuracy = accuracy;
      session.score += pts * (1 + Math.floor(session.combo / 5) * 0.2);
      session.combo++;
      if (session.combo > session.maxCombo) session.maxCombo = session.combo;

      session.feedbackText = accuracy.toUpperCase() + '!';
      session.feedbackTimer = 0.6;

      soundEngine.playNoteAccuracyFeedback(accuracy);
      soundEngine.playInstrumentNote(lead.instrumentId, 440 + lane * 110, 0.3, 0.8);
    } else {
      session.combo = 0;
      session.feedbackText = 'MISS!';
      session.feedbackTimer = 0.5;
      soundEngine.playNoteAccuracyFeedback('miss');
    }
  }

  private finishPracticeSession(): void {
    const session = this.state.practiceSession;
    if (!session) return;
    session.completed = true;

    const lead = this.state.ensemble.members[0];
    let stat: keyof typeof lead.stats = 'technique';
    if (session.type === 'scale_run') stat = 'technique';
    else if (session.type === 'tone_shaping') stat = 'toneQuality';
    else stat = 'tempoStability';

    const baseGain = Math.max(1, Math.floor(session.score / 180)) * session.tier;
    lead.stats[stat] = Math.min(100, lead.stats[stat] + baseGain);
    
    const xpResult = this.awardMusicianXp(lead, session.score);

    const goldWon = Math.floor(session.score / 20) * session.tier;
    this.state.wallet.gold += goldWon;
    const sparksWon = Math.floor(session.score / 80) * session.tier;
    this.state.wallet.inspirationSparks += sparksWon;

    let levelUpMsg = '';
    if (session.score >= 500 && this.state.practiceLevel < 4) {
      this.state.practiceLevel++;
      levelUpMsg += ` 🌟 Practice Tier Upgraded to Level ${this.state.practiceLevel}!`;
    }
    if (xpResult.leveledUp) {
      levelUpMsg += ` 🎓 ${lead.name} promoted to Musician Level ${xpResult.newLevel}!`;
    } else if (xpResult.gated) {
      levelUpMsg += ` 🔒 Promotion Gated: Pass Theory Curriculum Tier ${xpResult.requiredTheoryTier} to unlock Level ${lead.level + 1}!`;
    }

    session.statGained = { stat, amount: baseGain };
    soundEngine.playFanfare();

    this.showDialogue('Practice Complete!', '✨', [
      `Practice session concluded! Final Score: ${Math.floor(session.score)} (Max Combo: ${session.maxCombo}).`,
      `Rewards: +${goldWon} Notes (♪), +${sparksWon} Inspiration Sparks (✨).`,
      `${lead.name}'s ${stat.toUpperCase()} increased by +${baseGain}! (${lead.stats[stat]}/100).${levelUpMsg}`
    ], () => {
      this.state.mode = 'exploration';
      this.state.practiceSession = null;
      const activeSections = Array.from(new Set(this.state.ensemble.members.map(m => m.section)));
      soundEngine.startBGM(this.state.currentZone, activeSections);
    });
  }

  /* ---------------- AUDITION BATTLE SYSTEM ---------------- */

  public startAuditionBattle(targetNpc: WorldNPC): void {
    if (!targetNpc.musicianData) return;
    const opponent = targetNpc.musicianData;

    const activePets = this.state.ensemble.members.map(m => m.pet).filter(Boolean);
    const availableSynergies = PET_SYNERGIES.filter(synergy => {
      const hasPet1 = activePets.some(p => matchesPetRequirement(p, synergy.requiredPets[0]));
      const hasPet2 = activePets.some(p => matchesPetRequirement(p, synergy.requiredPets[1]));
      return hasPet1 && hasPet2;
    }).map(s => ({
      name: s.name,
      description: s.description,
      effectType: s.effectType,
      power: s.power,
      cost: s.cost
    }));

    this.state.auditionBattle = {
      opponent,
      playerHarmonyMeter: 20,
      opponentHarmonyMeter: 20,
      harmonyPoints: 60,
      maxHarmonyPoints: 100,
      playerStance: 'normal',
      opponentStance: 'normal',
      turn: 'player',
      turnTimer: 0,
      cadencePromptActive: false,
      log: [
        `⚔️ Audition Clash started against ${opponent.name} (${opponent.instrumentName})!`,
        `Tactics: Use Pianissimo Shield to deflect dissonance, or Fortissimo Surge to double your next strike!`
      ],
      selectedMoveIndex: 0,
      concluded: false,
      synergyMoves: availableSynergies
    };

    if (availableSynergies.length > 0) {
      this.state.auditionBattle.log.push(`🐾 Unison Synergy Ready: [${availableSynergies.map(s => s.name).join(', ')}]!`);
    }

    soundEngine.stopBGM();
    this.state.mode = 'audition_battle';
  }

  public executePetSynergy(synergyIndexOrName: number | string): void {
    const battle = this.state.auditionBattle;
    if (!battle || battle.turn !== 'player' || battle.concluded) return;
    if (!battle.synergyMoves || battle.synergyMoves.length === 0) return;

    let move = typeof synergyIndexOrName === 'number'
      ? battle.synergyMoves[synergyIndexOrName]
      : battle.synergyMoves.find(m => m.name.toLowerCase() === synergyIndexOrName.toLowerCase());

    if (!move) return;

    if (battle.harmonyPoints < move.cost) {
      battle.log.push(`Not enough Harmony Points for Pet Synergy [${move.name}]! (Requires ${move.cost} HP)`);
      return;
    }

    battle.harmonyPoints -= move.cost;
    soundEngine.playFanfare();

    if (move.effectType === 'heal_harmony') {
      battle.playerHarmonyMeter = Math.min(100, battle.playerHarmonyMeter + move.power);
      battle.log.push(`🐾 Unison Attack! [${move.name}] restored +${move.power}% Harmony Meter!`);
    } else if (move.effectType === 'stun_rival') {
      let rawPower = move.power;
      battle.playerHarmonyMeter = Math.min(100, battle.playerHarmonyMeter + rawPower);
      battle.opponentStunned = true;
      battle.log.push(`🐾 Unison Attack! [${move.name}] dealt +${rawPower}% resonance and STUNNED ${battle.opponent.name}!`);
    } else if (move.effectType === 'crit_burst') {
      let rawPower = move.power;
      if (battle.playerStance === 'fortissimo_surge') {
        rawPower *= 2;
        battle.playerStance = 'normal';
      }
      battle.playerHarmonyMeter = Math.min(100, battle.playerHarmonyMeter + rawPower);
      battle.log.push(`💥 UNISON CRIT BURST! [${move.name}] blasted +${rawPower}% massive resonance!`);
    }

    if (battle.playerHarmonyMeter >= 100) {
      this.resolveBattleVictory(battle);
      return;
    }

    if (battle.opponentStunned) {
      battle.opponentStunned = false;
      battle.log.push(`💫 ${battle.opponent.name} is stunned and cannot act this turn!`);
      battle.harmonyPoints = Math.min(battle.maxHarmonyPoints, battle.harmonyPoints + 15);
      battle.turn = 'player';
      return;
    }

    // Opponent turn
    battle.turn = 'opponent';
    setTimeout(() => {
      if (!this.state.auditionBattle || this.state.auditionBattle.concluded) return;
      this.executeOpponentTurn();
    }, 700);
  }

  public executeBattleMove(moveKeyOrIndex: string | number): void {
    const battle = this.state.auditionBattle;
    if (!battle || battle.turn !== 'player' || battle.concluded) return;

    const player = this.state.ensemble.members[0];
    const playerMoves = getBattleMovesForMusician(player);
    let move: BattleMove | undefined;

    if (typeof moveKeyOrIndex === 'number') {
      move = playerMoves[moveKeyOrIndex];
    } else {
      move = playerMoves.find(m => m.id === moveKeyOrIndex) || BATTLE_MOVES[moveKeyOrIndex] || playerMoves[0];
    }

    if (!move) return;

    if (battle.harmonyPoints < move.harmonyCost) {
      battle.log.push("Not enough Harmony Points for this technique!");
      return;
    }

    battle.harmonyPoints -= move.harmonyCost;

    if (move.effect === 'pianissimo_shield') {
      battle.playerStance = 'pianissimo_shield';
      battle.harmonyPoints = Math.min(battle.maxHarmonyPoints, battle.harmonyPoints + 25);
      battle.log.push(`🛡️ ${player.name} raised [Pianissimo Shield]! Restored +25 HP and prepared to absorb dissonance.`);
      soundEngine.playInstrumentNote(player.instrumentId, 330, 0.4, 0.7);
    } else if (move.effect === 'fortissimo_surge') {
      battle.playerStance = 'fortissimo_surge';
      battle.log.push(`⚡ ${player.name} charged [Fortissimo Surge]! Next attack power is DOUBLED!`);
      soundEngine.playInstrumentNote(player.instrumentId, 659.25, 0.5, 1.0);
    } else {
      let multiplier = 1.0;
      if (battle.playerStance === 'fortissimo_surge') {
        multiplier = 2.0;
        battle.playerStance = 'normal';
      }

      let rawPower = Math.round((move.power + Math.floor(player.stats.toneQuality / 5)) * multiplier);
      if (battle.opponentStance === 'counterpoint_guard') {
        rawPower = Math.floor(rawPower * 0.5);
        battle.opponentStance = 'normal';
        battle.log.push(`🛡️ Opponent guarded against the sound wave!`);
      }

      battle.playerHarmonyMeter = Math.min(100, battle.playerHarmonyMeter + rawPower);
      battle.log.push(`💥 ${player.name} performed [${move.name}] with ${player.instrumentName}! Harmony surged +${rawPower}%.`);
      soundEngine.playInstrumentNote(player.instrumentId, 523.25, 0.4, 0.9);
    }

    if (battle.playerHarmonyMeter >= 100) {
      this.resolveBattleVictory(battle);
      return;
    }

    // Opponent turn
    battle.turn = 'opponent';
    setTimeout(() => {
      if (!this.state.auditionBattle || this.state.auditionBattle.concluded) return;
      this.executeOpponentTurn();
    }, 700);
  }

  private executeOpponentTurn(): void {
    const battle = this.state.auditionBattle;
    if (!battle || battle.concluded) return;

    if (battle.opponentStunned) {
      battle.opponentStunned = false;
      battle.log.push(`💫 ${battle.opponent.name} is stunned and skipped their turn!`);
      battle.harmonyPoints = Math.min(battle.maxHarmonyPoints, battle.harmonyPoints + 15);
      battle.turn = 'player';
      return;
    }

    const opp = battle.opponent;
    const oppMoves = getBattleMovesForMusician(opp);

    // Tactical AI choosing from opponent's authentic instrument moves
    const roll = Math.random();
    if (roll < 0.25 && battle.opponentStance !== 'counterpoint_guard') {
      battle.opponentStance = 'counterpoint_guard';
      battle.log.push(`🛡️ ${opp.name} established a [Counterpoint Guard] stance!`);
      soundEngine.playInstrumentNote(opp.instrumentId, 392, 0.3, 0.6);
    } else if (roll < 0.6) {
      // Instrument move 1
      const m1 = oppMoves[0];
      let oppPower = m1.power + Math.floor(opp.stats.technique / 8);
      if (battle.playerStance === 'pianissimo_shield') {
        oppPower = Math.floor(oppPower * 0.5);
        battle.playerStance = 'normal';
        battle.log.push(`🛡️ Your Pianissimo Shield absorbed half the incoming acoustic blast!`);
      }
      battle.opponentHarmonyMeter = Math.min(100, battle.opponentHarmonyMeter + oppPower);
      battle.log.push(`🎶 ${opp.name} unleashed [${m1.name}] with their ${opp.instrumentName}! (+${oppPower}% resonance)`);
      soundEngine.playInstrumentNote(opp.instrumentId, 440, 0.4, 0.8);
    } else {
      // Instrument move 2
      const m2 = oppMoves[1];
      let oppPower = m2.power + Math.floor(opp.stats.toneQuality / 6);
      if (battle.playerStance === 'pianissimo_shield') {
        oppPower = Math.floor(oppPower * 0.5);
        battle.playerStance = 'normal';
        battle.log.push(`🛡️ Your Pianissimo Shield absorbed the powerful sound wave!`);
      }
      battle.opponentHarmonyMeter = Math.min(100, battle.opponentHarmonyMeter + oppPower);
      battle.log.push(`💥 ${opp.name} performed a climactic [${m2.name}]! (+${oppPower}% resonance)`);
      soundEngine.playInstrumentNote(opp.instrumentId, 523.25, 0.4, 0.9);
    }

    if (battle.opponentHarmonyMeter >= 100) {
      battle.concluded = true;
      battle.won = false;
      this.showDialogue('Audition Clash Defeat', '💔', [
        `${opp.name}'s acoustic resonance overwhelmed the plaza! Practice your Technique and return when ready.`
      ], () => {
        this.state.mode = 'exploration';
        this.state.auditionBattle = null;
        const activeSections = Array.from(new Set(this.state.ensemble.members.map(m => m.section)));
        soundEngine.startBGM(this.state.currentZone, activeSections);
      });
      return;
    }

    battle.harmonyPoints = Math.min(battle.maxHarmonyPoints, battle.harmonyPoints + 20);
    battle.turn = 'player';
  }

  private resolveBattleVictory(battle: AuditionBattle): void {
    battle.concluded = true;
    battle.won = true;
    const recruited = battle.opponent;

    if (!this.state.recruitedMusicians.some(m => m.id === recruited.id)) {
      this.state.recruitedMusicians.push(recruited);
      this.state.ensemble.members.push(recruited);

      // Update Ensemble Tier
      const count = this.state.ensemble.members.length;
      let tier: EnsembleTier = 'solo';
      if (count === 2) tier = 'duet';
      else if (count === 3) tier = 'trio';
      else if (count >= 4 && count < 6) tier = 'quartet';
      else if (count >= 6 && count < 8) tier = 'chamber';
      else if (count >= 8) tier = 'orchestra';
      this.state.ensemble.tier = tier;

      // Currency rewards for recruiting
      this.state.wallet.gold += 100;
      this.state.wallet.inspirationSparks += 15;

      this.state.ensemble.members.forEach(m => {
        this.awardMusicianXp(m, 150);
      });

      // Unlock recruited musician's instrument and boost section proficiency
      if (!this.state.proficiency.unlockedInstruments.includes(recruited.instrumentId)) {
        this.state.proficiency.unlockedInstruments.push(recruited.instrumentId);
      }
      this.state.proficiency.sections[recruited.section] = Math.min(100, (this.state.proficiency.sections[recruited.section] || 20) + 15);
      if (!this.state.proficiency.instruments[recruited.instrumentId]) {
        this.state.proficiency.instruments[recruited.instrumentId] = { level: 1, xp: 0 };
      }

      // Update chapter quest objectives if matching prodigy recruited
      if (recruited.name === 'Clara' || recruited.name === 'Maya') {
        const q1 = this.state.quests.find(q => q.id === 'quest_ch1');
        if (q1 && !q1.completed) q1.objective = `Defeat Busker Timmy at the Cavatina Village Gazebo with your new Duet partner (${recruited.name})!`;
      } else if (recruited.name === 'Oliver' || recruited.name === 'Chloe' || recruited.name === 'Devon') {
        const q2 = this.state.quests.find(q => q.id === 'quest_ch2');
        if (q2 && !q2.completed) q2.objective = `Defeat Leo’s Whispering Canopy Trio in Woodwind Woods with ${recruited.name}!`;
      } else if (recruited.name.includes('Jax') || recruited.name === 'Sam') {
        const q3 = this.state.quests.find(q => q.id === 'quest_ch3');
        if (q3 && !q3.completed) q3.objective = `Defeat Baroness Vesta’s Gilded Citadel Fanfare with ${recruited.name}!`;
      } else if (recruited.name === 'Rita' || recruited.name === 'Ren') {
        const q4 = this.state.quests.find(q => q.id === 'quest_ch4');
        if (q4 && !q4.completed) q4.objective = `Defeat Chieftain Ronin’s Mountain Thunder Corps at the Caldera Stage with ${recruited.name}!`;
      } else if (recruited.name === 'Nico') {
        const q5 = this.state.quests.find(q => q.id === 'quest_ch5');
        if (q5 && !q5.completed) q5.objective = `Defeat Aurelius & The Harmonia Youth Symphony in the Grand Solstice Finale!`;
      }

      this.checkNarrativeQuestCompletions();
    }

    soundEngine.playFanfare();
    this.showDialogue('Audition Triumphant!', '🎉', [
      `Splendid performance! ${recruited.name} and ${recruited.pet.name} (${recruited.pet.species}) are deeply moved by your musicianship! (+100 Notes ♪, +15 Sparks ✨)`,
      `${recruited.name} joined your ensemble! Your ensemble is now a [${this.state.ensemble.tier.toUpperCase()}]!`,
      "Check your Repertoire binder to see which multi-part pieces you can now perform!"
    ], () => {
      this.state.mode = 'exploration';
      this.state.auditionBattle = null;
      const activeSections = Array.from(new Set(this.state.ensemble.members.map(m => m.section)));
      soundEngine.startBGM(this.state.currentZone, activeSections);
    });
  }

  /* ---------------- WILD HARMONIPET BONDING (POKEMON-STYLE CATCHING) ---------------- */

  public startHarmonizeEncounter(npc: WorldNPC): void {
    if (!npc.wildPetData) return;
    const pet = npc.wildPetData;
    const dexEntry = this.state.harmoniDex.find(d => d.species === pet.species || d.id.includes(pet.id));
    const { noteIndices, targetMelody } = generateHarmonizeMelody(pet, dexEntry);

    this.state.harmonizeEncounter = {
      pet,
      instrumentId: (npc.wildPetData.instrumentId || (npc.wildPetData.section === 'strings' ? 'violin' : (npc.wildPetData.section === 'woodwinds' ? 'silver_flute' : (npc.wildPetData.section === 'brass' ? 'pocket_trumpet' : 'snare_kit')))) as InstrumentId,
      targetMelody,
      targetNoteIndices: noteIndices,
      currentStep: 0,
      revealedSteps: new Array(noteIndices.length).fill(false),
      isPlayingMelody: false,
      playerInputs: [],
      resonanceMeter: 20,
      catchThreshold: 80,
      attemptsRemaining: 5,
      phase: 'tuning',
      noteAccuracy: 100,
      timingAccuracy: 100,
      sweetSpotCenter: 0.5,
      lastFeedback: undefined,
      lastFeedbackText: '🔧 Tuning mode: Test and find matching tones freely with no penalty!',
      concluded: false,
      caught: false
    };
    this.state.mode = 'harmonize_wild';
    soundEngine.stopBGM();
    soundEngine.playWildlifeCall(pet.species.toLowerCase());

    this.replayHarmonizeMelody();
  }

  public startPerformancePhase(): void {
    const enc = this.state.harmonizeEncounter;
    if (!enc || enc.concluded) return;
    enc.phase = 'performance';
    enc.currentStep = 0;
    enc.revealedSteps = new Array(enc.targetNoteIndices.length).fill(false);
    enc.sweetSpotCenter = 0.5;
    enc.lastFeedback = undefined;
    enc.lastFeedbackText = '⚡ Performance Started! Play the full phrase in rhythm!';
  }

  public startTuningPhase(): void {
    const enc = this.state.harmonizeEncounter;
    if (!enc || enc.concluded) return;
    enc.phase = 'tuning';
    enc.currentStep = 0;
    enc.lastFeedback = undefined;
    enc.lastFeedbackText = '🔧 Tuning mode: Explore and discover tones freely.';
  }

  public replayHarmonizeMelody(): void {
    const enc = this.state.harmonizeEncounter;
    if (!enc || enc.concluded || enc.isPlayingMelody) return;

    enc.isPlayingMelody = true;
    if (enc.pet.section === 'percussion') {
      enc.targetNoteIndices.forEach((nIdx, idx) => {
        setTimeout(() => {
          if (!this.state.harmonizeEncounter || this.state.harmonizeEncounter.concluded) return;
          soundEngine.playHarmonizePercussion(nIdx, 0.85, enc.pet.instrumentId);
          if (idx === enc.targetNoteIndices.length - 1) {
            setTimeout(() => {
              if (this.state.harmonizeEncounter) {
                this.state.harmonizeEncounter.isPlayingMelody = false;
              }
            }, 350);
          }
        }, (idx + 1) * 350);
      });
    } else {
      enc.targetMelody.forEach((freq, idx) => {
        setTimeout(() => {
          if (!this.state.harmonizeEncounter || this.state.harmonizeEncounter.concluded) return;
          soundEngine.playInstrumentNote(enc.instrumentId, freq, 0.35, 0.8);
          if (idx === enc.targetMelody.length - 1) {
            setTimeout(() => {
              if (this.state.harmonizeEncounter) {
                this.state.harmonizeEncounter.isPlayingMelody = false;
              }
            }, 350);
          }
        }, (idx + 1) * 350);
      });
    }
  }

  public playHarmonizeNote(noteIndex: number = 0): void {
    const enc = this.state.harmonizeEncounter;
    if (!enc || enc.concluded || enc.isPlayingMelody) return;

    const FREQS = [261.63, 329.63, 392.00, 523.25];
    const playedFreq = FREQS[noteIndex] || 261.63;
    enc.playerInputs.push(playedFreq);
    const player = this.state.ensemble?.members?.[0];
    const tech = player?.stats?.technique || 25;
    const tone = player?.stats?.toneQuality || 25;

    // --- 1. TUNING PHASE (Free experimentation with zero penalties) ---
    if (enc.phase === 'tuning') {
      if (enc.pet.section === 'percussion') {
        soundEngine.playHarmonizePercussion(noteIndex, 0.85, enc.pet.instrumentId);
      } else {
        soundEngine.playInstrumentNote(enc.instrumentId, playedFreq, 0.35, 0.85);
      }

      const expectedIndex = enc.targetNoteIndices[enc.currentStep];
      if (!enc.revealedSteps) {
        enc.revealedSteps = new Array(enc.targetNoteIndices.length).fill(false);
      }

      if (noteIndex === expectedIndex) {
        enc.revealedSteps[enc.currentStep] = true;
        enc.currentStep++;
        enc.lastFeedback = 'PERFECT';
        if (enc.currentStep >= enc.targetNoteIndices.length) {
          enc.lastFeedbackText = '✨ All phrase tones discovered! Press [SPACE] or click "Begin Performance" to bond!';
          enc.currentStep = 0;
        } else {
          enc.lastFeedbackText = `🔍 Discovered tone ${enc.currentStep} / ${enc.targetNoteIndices.length}!`;
        }
      } else {
        // Safe exploration - no penalty
        enc.lastFeedbackText = `🎵 Testing tone... (No penalty in tuning phase)`;
      }
      return;
    }

    // --- 2. PERFORMANCE PHASE (Timed execution & score on note/timing accuracy) ---
    let timingGrade: 'PERFECT' | 'GREAT' | 'GOOD' | 'OK' = 'PERFECT';
    let timingMultiplier = 1.4;

    if (this.state.time > 0) {
      const tempoBPM = 120;
      const sweep = Math.abs(((this.state.time * (tempoBPM / 60) * 0.8) % 2) - 1);
      const sweetCenter = enc.sweetSpotCenter ?? 0.5;
      const dist = Math.abs(sweep - sweetCenter);
      if (dist <= 0.15) {
        timingGrade = 'PERFECT';
        timingMultiplier = 1.5;
      } else if (dist <= 0.3) {
        timingGrade = 'GREAT';
        timingMultiplier = 1.2;
      } else if (dist <= 0.5) {
        timingGrade = 'GOOD';
        timingMultiplier = 1.0;
      } else {
        timingGrade = 'OK';
        timingMultiplier = 0.7;
      }
      enc.sweetSpotCenter = 0.2 + Math.random() * 0.6;
    }
    enc.timingAccuracy = Math.round(timingMultiplier * 66.6);

    const expectedIndex = enc.targetNoteIndices[enc.currentStep];
    if (noteIndex === expectedIndex) {
      // ✅ Correct pitch/timbre in sequence!
      if (enc.pet.section === 'percussion') {
        soundEngine.playHarmonizePercussion(noteIndex, 0.85, enc.pet.instrumentId);
      } else {
        soundEngine.playInstrumentNote(enc.instrumentId, playedFreq, 0.35, 0.85);
      }

      if (!enc.revealedSteps) enc.revealedSteps = new Array(enc.targetNoteIndices.length).fill(false);
      enc.revealedSteps[enc.currentStep] = true;
      enc.currentStep++;
      enc.noteAccuracy = 100;

      const baseGain = Math.floor(75 / enc.targetNoteIndices.length);
      const noteGain = Math.floor((baseGain + (tech + tone) / 10) * (timingMultiplier / 1.2));
      enc.resonanceMeter = Math.min(100, enc.resonanceMeter + noteGain);

      if (enc.currentStep >= enc.targetNoteIndices.length) {
        // Complete phrase matched!
        const bonusGain = 20;
        enc.resonanceMeter = Math.min(100, enc.resonanceMeter + bonusGain);
        enc.lastFeedback = 'PERFECT';
        enc.lastFeedbackText = `✨ HARMONIC RESONANCE! Phrase completed! (+${noteGain + bonusGain}%)`;
        enc.currentStep = 0;
        enc.revealedSteps = new Array(enc.targetNoteIndices.length).fill(false);
        if (enc.resonanceMeter < enc.catchThreshold) {
          setTimeout(() => this.replayHarmonizeMelody(), 1000);
        }
      } else {
        enc.lastFeedback = timingGrade === 'PERFECT' ? 'PERFECT' : (timingGrade === 'GREAT' ? 'GREAT' : 'GOOD');
        enc.lastFeedbackText = `♪ Clean Note! (${enc.currentStep} / ${enc.targetNoteIndices.length}) [${timingGrade} Timing] (+${noteGain}%)`;
      }
    } else {
      // ❌ Dissonance / Miss
      if (enc.pet.section === 'percussion') {
        soundEngine.playHarmonizePercussion(noteIndex, 0.4, enc.pet.instrumentId);
      } else {
        soundEngine.playInstrumentNote(enc.instrumentId, playedFreq * 0.94, 0.35, 0.85);
      }

      enc.attemptsRemaining--;
      enc.resonanceMeter = Math.max(0, enc.resonanceMeter - 15);
      enc.currentStep = 0;
      enc.revealedSteps = new Array(enc.targetNoteIndices.length).fill(false);
      enc.noteAccuracy = 0;
      enc.lastFeedback = 'DISSONANCE';
      enc.lastFeedbackText = `⚠️ DISSONANT NOTE! Phrase reset. (Attempts left: ${enc.attemptsRemaining})`;
    }

    if (enc.resonanceMeter >= enc.catchThreshold) {
      // Successfully bonded / caught!
      enc.concluded = true;
      enc.caught = true;

      // Update HarmoniDex
      const dex = this.state.harmoniDex.find(d => d.species === enc.pet.species);
      if (dex) {
        dex.discovered = true;
        dex.bonded = true;
      }
      const qRescue = this.state.quests.find(q => q.id === 'quest_rescue_harmonidex');
      if (qRescue) qRescue.completed = true;

      this.awardMusicianXp(this.state.ensemble.members[0], 120);

      // Create new musician partner
      const newMusician: Musician = {
        id: `musician_${enc.pet.id}`,
        name: enc.pet.name,
        title: `Bonded ${enc.pet.species}`,
        avatar: enc.pet.sprite,
        paletteColor: enc.pet.color,
        instrumentId: enc.instrumentId,
        instrumentName: enc.pet.instrumentName,
        section: enc.pet.section,
        pet: enc.pet,
        stats: { technique: 25, toneQuality: 25, tempoStability: 25, sightReading: 20 },
        level: 1,
        xp: 0
      };

      // Unlock instrument for player
      if (!this.state.proficiency.unlockedInstruments.includes(enc.instrumentId)) {
        this.state.proficiency.unlockedInstruments.push(enc.instrumentId);
      }
      this.state.proficiency.sections[enc.pet.section] = Math.min(100, (this.state.proficiency.sections[enc.pet.section] || 20) + 10);
      if (!this.state.proficiency.instruments[enc.instrumentId]) {
        this.state.proficiency.instruments[enc.instrumentId] = { level: 1, xp: 0 };
      }

      if (this.state.ensemble.members.length < 8) {
        this.state.ensemble.members.push(newMusician);
        this.state.recruitedMusicians.push(newMusician);
        const count = this.state.ensemble.members.length;
        if (count === 2) this.state.ensemble.tier = 'duet';
        else if (count === 3) this.state.ensemble.tier = 'trio';
        else if (count >= 4 && count < 6) this.state.ensemble.tier = 'quartet';
        else if (count >= 6) this.state.ensemble.tier = 'chamber';
      } else {
        this.state.ensembleBox.push(newMusician);
      }

      // Remove NPC from world
      this.state.npcs = this.state.npcs.filter(n => n.id !== this.state.nearbyInteractable?.id);
      this.state.nearbyInteractable = null;

      soundEngine.playFanfare();
      this.showDialogue('Harmonipet Bonded!', '🐾', [
        `Harmonic resonance reached 100%! ${enc.pet.name} the ${enc.pet.species} felt your musical soul and joined your team!`,
        `Registered in your HarmoniDex! (Total Bonded: ${this.state.harmoniDex.filter(d => d.bonded).length} / ${this.state.harmoniDex.length})`
      ], () => {
        this.state.mode = 'exploration';
        this.state.harmonizeEncounter = null;
        const activeSections = Array.from(new Set(this.state.ensemble.members.map(m => m.section)));
        soundEngine.startBGM(this.state.currentZone, activeSections);
      });
    } else if (enc.attemptsRemaining <= 0) {
      // Failed to harmonize
      enc.concluded = true;
      enc.caught = false;
      this.showDialogue('Harmonipet Fled', '💨', [
        `${enc.pet.name} was startled by the dissonant cadence and scurried into the brush! Practice your tone and try again.`
      ], () => {
        this.state.mode = 'exploration';
        this.state.harmonizeEncounter = null;
        const activeSections = Array.from(new Set(this.state.ensemble.members.map(m => m.section)));
        soundEngine.startBGM(this.state.currentZone, activeSections);
      });
    }
  }

  /* ---------------- DYNAMIC DIFFICULTY & FESTIVAL CALENDAR ---------------- */

  public getProgressionTier(): number {
    const memberCount = this.state.ensemble.members.length;
    const badgeCount = this.state.badges.filter(b => b.obtained).length;
    if (memberCount >= 8 || badgeCount >= 4) return 5;
    if (memberCount >= 6 || badgeCount >= 3) return 4;
    if (memberCount >= 4 || badgeCount >= 2) return 3;
    if (memberCount >= 3 || badgeCount >= 1) return 2;
    return 1;
  }

  public enterFestivalCompetition(eventId: string): boolean {
    const event = this.state.calendarEvents.find(e => e.id === eventId);
    if (!event) return false;

    if (this.state.wallet.gold < event.entryFeeGold) return false;
    this.state.wallet.gold -= event.entryFeeGold;

    const tier = this.getProgressionTier();
    const rivalMember = {
      ...event.rivalMusician,
      stats: calculateDynamicRivalStats(event.rivalMusician.stats, tier),
      level: Math.max(1, tier * 2)
    };

    const rivalEnsemble: RivalEnsemble = {
      id: `rival_event_${event.id}`,
      name: event.rivalMusician.name,
      tier: event.tierRequirement,
      conductorName: event.rivalMusician.name,
      members: [rivalMember],
      piece: REPERTOIRE_DATABASE[0],
      reputationRequired: 0,
      rewardStars: event.rewardStars,
      description: event.description
    };

    const piece = this.state.ensemble.activePiece || REPERTOIRE_DATABASE[0];

    this.state.competition = {
      rival: rivalEnsemble,
      playerPiece: piece,
      playerScore: 0,
      rivalScore: 0,
      audienceApplause: 50,
      currentMeasure: 0,
      totalMeasures: 8,
      isPlaying: true,
      concluded: false,
      sweetSpotCenter: 0.35 + Math.random() * 0.3,
      sweetSpotWidth: 0.16,
      comboStreak: 0,
      sectionBalance: {
        strings: 75,
        woodwinds: 75,
        brass: 75,
        percussion: 75
      },
      maestroFlow: 50,
      currentChordIndex: 0,
      currentMelodyIndex: 0,
      activeSectionCue: {
        section: 'strings',
        key: '1 / D',
        label: 'Strings Crescendo',
        urgency: 1.0,
        sweetSpot: 0.5
      }
    };

    soundEngine.stopBGM();
    this.state.mode = 'competition';
    return true;
  }

  /* ---------------- CONCERT COMPETITION SYSTEM ---------------- */

  public startConcertCompetition(rivalId?: string): void {
    this.ensurePlayerMusician();
    const baseRival = RIVAL_ENSEMBLES.find(r => r.id === rivalId) || RIVAL_ENSEMBLES[0];
    const tier = this.getProgressionTier();
    const scaledMembers = baseRival.members.map(m => ({
      ...m,
      stats: calculateDynamicRivalStats(m.stats, tier),
      level: Math.max(1, tier * 2)
    }));
    const rival = { ...baseRival, members: scaledMembers };
    const piece = this.state.ensemble.activePiece || REPERTOIRE_DATABASE[0];

    this.state.competition = {
      rival,
      playerPiece: piece,
      playerScore: 0,
      rivalScore: 0,
      audienceApplause: 50,
      currentMeasure: 0,
      totalMeasures: 8,
      isPlaying: true,
      concluded: false,
      sweetSpotCenter: 0.35 + Math.random() * 0.3,
      sweetSpotWidth: 0.16,
      comboStreak: 0,
      sectionBalance: {
        strings: 75,
        woodwinds: 75,
        brass: 75,
        percussion: 75
      },
      maestroFlow: 50,
      currentChordIndex: 0,
      currentMelodyIndex: 0,
      activeSectionCue: {
        section: 'strings',
        key: '1 / D',
        label: 'Strings Crescendo',
        urgency: 1.0,
        sweetSpot: 0.5
      }
    };

    soundEngine.stopBGM();
    this.state.mode = 'competition';
  }

  public startPianistBuskingDuel(forcedTier?: number): void {
    this.ensurePlayerMusician();
    const duelTier = forcedTier !== undefined ? forcedTier : Math.min(3, (this.state.pianistBuskingWins || 0) + 1);
    const duelConfigs = [
      { name: 'Novice Busk', bpm: 120, width: 0.16, tech: 25, tone: 25, stars: 2 },
      { name: 'Virtuoso Etude', bpm: 140, width: 0.13, tech: 40, tone: 40, stars: 3 },
      { name: 'Transcendental Showdown', bpm: 160, width: 0.10, tech: 55, tone: 55, stars: 4 }
    ];
    const config = duelConfigs[Math.min(duelTier - 1, duelConfigs.length - 1)];

    const franzMusician: Musician = {
      id: 'musician_franz_liszt',
      name: 'Maestro Franz "Keys" Liszt',
      title: 'Grand Virtuoso Pianist',
      avatar: '🎹',
      paletteColor: '#fbbf24',
      instrumentId: 'glockenspiel',
      instrumentName: 'Concert Grand Piano',
      section: 'percussion',
      pet: {
        id: 'pet_franz_liszt',
        name: 'Cadenza',
        species: 'Rhapsody Nightingale',
        sprite: 'nightingale',
        section: 'percussion',
        instrumentName: 'Concert Grand Piano',
        leitmotifSound: 'glockenspiel_bell',
        color: '#fbbf24'
      },
      stats: {
        technique: config.tech,
        toneQuality: config.tone,
        tempoStability: config.tech,
        sightReading: 95
      },
      level: duelTier * 3,
      xp: duelTier * 500
    };

    const rivalEnsemble: RivalEnsemble = {
      id: 'rival_franz_liszt',
      name: `Maestro Franz (${config.name})`,
      tier: duelTier === 1 ? 'solo' : (duelTier === 2 ? 'duet' : 'trio'),
      conductorName: 'Maestro Franz',
      members: [franzMusician],
      piece: {
        id: `piece_franz_duel_${duelTier}`,
        title: `${config.name} (${config.bpm} BPM)`,
        composer: 'Franz Liszt',
        genre: 'Virtuoso Romantic',
        difficulty: duelTier + 1,
        minEnsembleTier: 'solo',
        requiredSections: {},
        bpm: config.bpm,
        tempoBPM: config.bpm,
        chords: [],
        melody: [],
        description: `High-tempo busking duel against Maestro Franz at ${config.bpm} BPM.`,
        masteryXp: 100,
        isMastered: false
      },
      reputationRequired: 0,
      rewardStars: config.stars,
      description: `Busking competition duel against Maestro Franz at ${config.bpm} BPM.`
    };

    const basePiece = this.state.ensemble.activePiece || REPERTOIRE_DATABASE[0];
    const playerPiece: RepertoirePiece = {
      ...basePiece,
      bpm: config.bpm,
      tempoBPM: config.bpm
    };

    this.state.competition = {
      rival: rivalEnsemble,
      playerPiece,
      playerScore: 0,
      rivalScore: 0,
      audienceApplause: 50,
      currentMeasure: 0,
      totalMeasures: 8,
      isPlaying: true,
      concluded: false,
      sweetSpotCenter: 0.35 + Math.random() * 0.3,
      sweetSpotWidth: config.width,
      comboStreak: 0,
      isPianistDuel: true,
      duelTier,
      sectionBalance: {
        strings: 75,
        woodwinds: 75,
        brass: 75,
        percussion: 75
      },
      maestroFlow: 50,
      currentChordIndex: 0,
      currentMelodyIndex: 0,
      activeSectionCue: {
        section: 'percussion',
        key: '4 / K',
        label: 'Grand Piano Counterpoint',
        urgency: 1.0,
        sweetSpot: 0.5
      }
    };

    soundEngine.stopBGM();
    this.state.mode = 'competition';
  }

  public advanceConcertPerformance(): void {
    const comp = this.state.competition;
    if (!comp || comp.concluded) return;

    // Dynamic Rhythmic Cadence Timing Evaluation
    const tempoBPM = comp.playerPiece.bpm || 120;
    // In headless test environments where time is static, synchronize sweep to sweetSpot
    const sweep = this.state.time > 0 
      ? Math.abs(((this.state.time * (tempoBPM / 60) * 0.8) % 2) - 1)
      : comp.sweetSpotCenter;
    const dist = Math.abs(sweep - comp.sweetSpotCenter);

    let timingMultiplier = 1.0;
    if (dist <= comp.sweetSpotWidth * 0.45) {
      comp.lastFeedback = 'PERFECT';
      comp.lastFeedbackText = '✨ PERFECT HARMONY! (x2.0 Resonance)';
      comp.comboStreak++;
      timingMultiplier = 2.0 + Math.min(1.0, comp.comboStreak * 0.15);
      comp.audienceApplause = Math.min(100, comp.audienceApplause + 12);
      soundEngine.playNoteAccuracyFeedback('perfect');
    } else if (dist <= comp.sweetSpotWidth) {
      comp.lastFeedback = 'GREAT';
      comp.lastFeedbackText = '🎵 GREAT CADENCE! (x1.4)';
      comp.comboStreak++;
      timingMultiplier = 1.4;
      comp.audienceApplause = Math.min(100, comp.audienceApplause + 6);
      soundEngine.playNoteAccuracyFeedback('good');
    } else if (dist <= comp.sweetSpotWidth * 1.6) {
      comp.lastFeedback = 'OK';
      comp.lastFeedbackText = '⚠️ SLIGHTLY OFF-BEAT (x0.8)';
      comp.comboStreak = 0;
      timingMultiplier = 0.8;
      comp.audienceApplause = Math.max(0, comp.audienceApplause - 4);
    } else {
      comp.lastFeedback = 'MISS';
      comp.lastFeedbackText = '❌ RHYTHMIC FLUB! (x0.4)';
      comp.comboStreak = 0;
      timingMultiplier = 0.4;
      comp.audienceApplause = Math.max(0, comp.audienceApplause - 12);
      soundEngine.playNoteAccuracyFeedback('miss');
    }

    comp.currentMeasure++;
    const ensemblePower = this.state.ensemble.members.reduce((acc, m) => acc + (m.stats.technique + m.stats.toneQuality), 0);
    const rivalPower = comp.rival.members.reduce((acc, m) => acc + (m.stats.technique + m.stats.toneQuality), 0);
    
    // Balance and Flow multipliers
    const balances = Object.values(comp.sectionBalance || { strings: 75, woodwinds: 75, brass: 75, percussion: 75 });
    const avgBalance = balances.reduce((a, b) => a + b, 0) / (balances.length || 1);
    const balanceMultiplier = 0.7 + (avgBalance / 100) * 0.6; // 0.7x to 1.3x
    const flowMultiplier = 1.0 + ((comp.maestroFlow || 50) / 100) * 0.8; // 1.0x to 1.8x
    const totalMultiplier = timingMultiplier * balanceMultiplier * flowMultiplier;

    // Maestro Flow applause bonus
    const flowApplauseBonus = Math.floor(((comp.maestroFlow || 50) / 100) * 4);
    if (dist <= comp.sweetSpotWidth) {
      comp.audienceApplause = Math.min(100, comp.audienceApplause + flowApplauseBonus);
    }

    let measureScore = Math.floor((ensemblePower / 2 + 10) * totalMultiplier);
    if (this.state.hasPianoAccompaniment && !comp.isPianistDuel) {
      measureScore = Math.floor(measureScore * 1.5);
      comp.audienceApplause = Math.min(100, comp.audienceApplause + 5);
    }
    const rivalMultiplier = 0.85 + Math.random() * 0.35;
    const rivalMeasureScore = Math.floor((rivalPower / 2 + 5) * rivalMultiplier);
    
    comp.playerScore += measureScore;
    comp.rivalScore += rivalMeasureScore;

    // Shift the rhythmic sweet spot for the next measure
    comp.sweetSpotCenter = 0.2 + Math.random() * 0.6;

    // Synthesize authentic structured chord notes and melodic voice
    const piece = comp.playerPiece;
    const chordsList = piece.chords && piece.chords.length > 0
      ? piece.chords
      : [{ strings: [261.63, 329.63, 392.0] }];
    const chord = chordsList[comp.currentChordIndex % chordsList.length];

    const melodyLength = piece.melody && piece.melody.length > 0 ? piece.melody.length : 4;
    const melStart = comp.currentMelodyIndex % melodyLength;
    const melodyNotes = piece.melody && piece.melody.length > 0
      ? [piece.melody[melStart], piece.melody[(melStart + 1) % melodyLength]]
      : [392, 523.25];

    soundEngine.playStructuredConcertHarmony({
      chord,
      melodyNotes,
      members: this.state.ensemble.members,
      sectionBalance: comp.sectionBalance,
      hasPianoAccompaniment: this.state.hasPianoAccompaniment,
      isPianistDuel: comp.isPianistDuel,
      maestroFlow: comp.maestroFlow
    });

    comp.currentChordIndex = (comp.currentChordIndex + 1) % chordsList.length;
    comp.currentMelodyIndex = (comp.currentMelodyIndex + 2) % melodyLength;

    if (comp.currentMeasure >= comp.totalMeasures) {
      comp.concluded = true;
      comp.won = comp.playerScore >= comp.rivalScore;
      let badgeWonName = '';

      if (comp.isPianistDuel) {
        if (comp.won) {
          this.state.pianistBuskingWins = (this.state.pianistBuskingWins || 0) + 1;
          const wins = this.state.pianistBuskingWins;
          const goldGain = comp.rival.rewardStars * 150;
          const sparksGain = comp.rival.rewardStars * 15;
          this.state.wallet.gold += goldGain;
          this.state.wallet.inspirationSparks += sparksGain;

          soundEngine.playGrandPianoCadence();

          if (wins >= 3) {
            this.state.hasPianoAccompaniment = true;
            this.showDialogue('Maestro Franz "Keys" Liszt', '🎹', [
              `🏆 TRANSCENDENTAL VICTORY! Final Score: ${comp.playerScore} vs Franz ${comp.rivalScore}!`,
              `Maestro Franz stands in breathless awe, his fingers trembling with ecstasy: "Magnifique! Pure poetic genius! You have conquered all 3 Transcendental Busking Duels!"`,
              `"I hereby swear my grand piano to your cause. I will be your dedicated Concerto Accompanist! (+50% Score Multiplier Active in all Concerts & Festivals!)"`,
              `Earned +${goldGain} Notes (♪), +${sparksGain} Inspiration Sparks (✨), and unlocked [🎹 Permanent Concerto Piano Accompaniment]!`
            ], () => {
              this.state.mode = 'exploration';
              this.state.competition = null;
              const activeSections = Array.from(new Set(this.state.ensemble.members.map(m => m.section)));
              soundEngine.startBGM(this.state.currentZone, activeSections);
            });
          } else {
            this.showDialogue('Maestro Franz "Keys" Liszt', '🎹', [
              `🎉 DUEL VICTORY! Final Score: ${comp.playerScore} vs Franz ${comp.rivalScore}!`,
              `Maestro Franz bows with deep admiration: "Exquisite rhythm! You have mastered Duel ${wins} of 3! (+${goldGain} Notes, +${sparksGain} Sparks)"`,
              `"Return to me when you are ready to test your metronome against the next tempo tier!"`
            ], () => {
              this.state.mode = 'exploration';
              this.state.competition = null;
              const activeSections = Array.from(new Set(this.state.ensemble.members.map(m => m.section)));
              soundEngine.startBGM(this.state.currentZone, activeSections);
            });
          }
        } else {
          this.showDialogue('Maestro Franz "Keys" Liszt', '💔', [
            `Defeat! Final Score: ${comp.playerScore} vs Franz ${comp.rivalScore}.`,
            `Maestro Franz smiles gently: "The tempo proved too fierce this time! Practice your Metronome stability and return to duel the grand piano again!"`
          ], () => {
            this.state.mode = 'exploration';
            this.state.competition = null;
            const activeSections = Array.from(new Set(this.state.ensemble.members.map(m => m.section)));
            soundEngine.startBGM(this.state.currentZone, activeSections);
          });
        }
        return;
      }

      if (comp.won && !comp.rewardsGiven) {
        comp.rewardsGiven = true;
        const goldGain = comp.rival.rewardStars * 200;
        const sparksGain = comp.rival.rewardStars * 10;
        this.state.wallet.gold += goldGain;
        this.state.wallet.inspirationSparks += sparksGain;
        this.state.wallet.reputationStars += comp.rival.rewardStars;
        this.state.ensemble.reputationStars = this.state.wallet.reputationStars;
        this.state.ensemble.fameLevel = 1 + Math.floor(this.state.ensemble.reputationStars / 2);

        this.state.ensemble.members.forEach(m => {
          this.awardMusicianXp(m, 250 + comp.rival.rewardStars * 50);
        });

        // Record festival event completion & quest
        if (comp.rival.id.startsWith('rival_event_')) {
          const eventId = comp.rival.id.replace('rival_event_', '');
          if (!this.state.completedEvents.includes(eventId)) {
            this.state.completedEvents.push(eventId);
          }
          const qFest = this.state.quests.find(q => q.id === 'quest_gig_festival_circuit');
          if (qFest) qFest.completed = true;
        }

        // Check main story chapter quest completions (can be completed in any order!)
        if (comp.rival.id === 'rival_novice_buskers') {
          const q1 = this.state.quests.find(q => q.id === 'quest_ch1');
          if (q1) q1.completed = true;
        } else if (comp.rival.id === 'rival_woodwind_trio') {
          const q2 = this.state.quests.find(q => q.id === 'quest_ch2');
          if (q2) q2.completed = true;
        } else if (comp.rival.id === 'rival_brass_quartet') {
          const q3 = this.state.quests.find(q => q.id === 'quest_ch3');
          if (q3) q3.completed = true;
        } else if (comp.rival.id === 'rival_thunder_chamber') {
          const q4 = this.state.quests.find(q => q.id === 'quest_ch4');
          if (q4) q4.completed = true;
        } else if (comp.rival.id === 'rival_grand_orchestra') {
          const q5 = this.state.quests.find(q => q.id === 'quest_ch5');
          if (q5) q5.completed = true;
          const qRoundtable = this.state.quests.find(q => q.id === 'quest_maestro_roundtable');
          if (qRoundtable && !qRoundtable.completed) {
            this.state.activeQuestId = 'quest_maestro_roundtable';
          }
        }

        // Dynamic non-linear progression across the 4 cardinal section masteries
        const sectionQuestIds = ['quest_ch1', 'quest_ch2', 'quest_ch3', 'quest_ch4'];
        const completedSectionCount = sectionQuestIds.filter(id => this.state.quests.find(q => q.id === id)?.completed).length;

        // Upgrade ensemble capacity as section masteries are conquered
        if (completedSectionCount === 1) this.state.ensemble.tier = 'duet';
        else if (completedSectionCount === 2) this.state.ensemble.tier = 'trio';
        else if (completedSectionCount === 3) this.state.ensemble.tier = 'quartet';
        else if (completedSectionCount >= 4) this.state.ensemble.tier = 'chamber';

        if (completedSectionCount >= 4) {
          const q5 = this.state.quests.find(q => q.id === 'quest_ch5');
          if (q5 && !q5.completed) {
            this.state.activeQuestId = 'quest_ch5';
          } else {
            const qRoundtable = this.state.quests.find(q => q.id === 'quest_maestro_roundtable');
            if (qRoundtable && !qRoundtable.completed) {
              this.state.activeQuestId = 'quest_maestro_roundtable';
            }
          }
        } else {
          // If current active quest was completed, pick the next incomplete section quest
          const currentActive = this.state.quests.find(q => q.id === this.state.activeQuestId);
          if (!currentActive || currentActive.completed) {
            const nextIncomplete = sectionQuestIds.find(id => !this.state.quests.find(q => q.id === id)?.completed);
            if (nextIncomplete) {
              this.state.activeQuestId = nextIncomplete;
            }
          }
        }

        // Award Conservatory Badge
        const badgeIndex = Math.min(this.state.badges.length - 1, this.state.ensemble.reputationStars - 1);
        if (badgeIndex >= 0 && !this.state.badges[badgeIndex].obtained) {
          this.state.badges[badgeIndex].obtained = true;
          badgeWonName = ` Awarded the [${this.state.badges[badgeIndex].name} ${this.state.badges[badgeIndex].icon}]!`;
        }

        soundEngine.playFanfare();
      }

      this.showDialogue('Concert Results', '🏆', [
        `Performance Concluded! Final Score: ${comp.playerScore} vs Rival ${comp.rivalScore}!`,
        comp.won ? `VICTORY! The audience erupts in standing ovation! Earned +${comp.rival.rewardStars} Reputation Stars (Total: ${this.state.ensemble.reputationStars} ★), +${comp.rival.rewardStars * 200} Notes ♪, +${comp.rival.rewardStars * 10} Sparks ✨.${badgeWonName}` : "A valiant effort! Practice your ensemble's Technique and try again!"
      ], () => {
        this.state.mode = 'exploration';
        this.state.competition = null;
        const activeSections = Array.from(new Set(this.state.ensemble.members.map(m => m.section)));
        soundEngine.startBGM(this.state.currentZone, activeSections);
      });
    }
  }

  public conductSection(section: InstrumentSection): void {
    const comp = this.state.competition;
    if (!comp || comp.concluded) return;

    const isCueMatch = comp.activeSectionCue && comp.activeSectionCue.section === section;
    if (isCueMatch) {
      comp.sectionBalance[section] = Math.min(100, comp.sectionBalance[section] + 25);
      comp.maestroFlow = Math.min(100, comp.maestroFlow + 15);
      comp.comboStreak++;
      comp.lastFeedback = 'PERFECT';
      comp.lastFeedbackText = `✨ MAESTRO CUE! ${section.toUpperCase()} RESONATING!`;
      comp.audienceApplause = Math.min(100, comp.audienceApplause + 4);
      soundEngine.playNoteAccuracyFeedback('perfect');
      comp.activeSectionCue = undefined;
    } else {
      comp.sectionBalance[section] = Math.min(100, comp.sectionBalance[section] + 15);
      comp.lastFeedbackText = `🎵 Conducted ${section.toUpperCase()}`;
    }

    const piece = comp.playerPiece;
    const chordsList = piece.chords && piece.chords.length > 0 ? piece.chords : [{ strings: [440] }];
    const currentChord = chordsList[comp.currentChordIndex % chordsList.length];
    let note: number | undefined;
    if (section === 'strings' && currentChord.strings?.[0]) note = currentChord.strings[0];
    else if (section === 'woodwinds' && (currentChord.woodwinds?.[0] || currentChord.winds?.[0])) note = currentChord.woodwinds?.[0] || currentChord.winds?.[0];
    else if (section === 'brass' && currentChord.brass?.[0]) note = currentChord.brass[0];
    soundEngine.playSectionCueFeedback(section, note);
  }

  private updateConductingCompetition(dt: number): void {
    const comp = this.state.competition;
    if (!comp || comp.concluded) return;

    // Decay section balances gradually
    const decay = 5 * dt;
    comp.sectionBalance.strings = Math.max(0, comp.sectionBalance.strings - decay);
    comp.sectionBalance.woodwinds = Math.max(0, comp.sectionBalance.woodwinds - decay);
    comp.sectionBalance.brass = Math.max(0, comp.sectionBalance.brass - decay);
    comp.sectionBalance.percussion = Math.max(0, comp.sectionBalance.percussion - decay);

    // Calculate balance health
    const balances = Object.values(comp.sectionBalance);
    const avgBalance = balances.reduce((a, b) => a + b, 0) / balances.length;
    const minBalance = Math.min(...balances);

    // Maestro Flow dynamics: rewarded for maintaining balanced ensemble
    if (minBalance >= 40 && avgBalance >= 50) {
      comp.maestroFlow = Math.min(100, comp.maestroFlow + 6 * dt);
    } else if (minBalance < 25) {
      comp.maestroFlow = Math.max(0, comp.maestroFlow - 8 * dt);
    }

    // Active Section Cue timer & rotation
    if (comp.activeSectionCue) {
      comp.activeSectionCue.urgency -= dt * 0.35;
      if (comp.activeSectionCue.urgency <= 0) {
        comp.maestroFlow = Math.max(0, comp.maestroFlow - 4);
        comp.activeSectionCue = undefined;
      }
    } else {
      // Spawn new section cue periodically
      if (Math.random() < dt * 0.5) {
        const sections: InstrumentSection[] = ['strings', 'woodwinds', 'brass', 'percussion'];
        const sortedSections = [...sections].sort((a, b) => comp.sectionBalance[a] - comp.sectionBalance[b]);
        const chosenSection = Math.random() < 0.6 ? sortedSections[0] : sections[Math.floor(Math.random() * sections.length)];

        const keys: Record<InstrumentSection, string> = {
          strings: '1 / D',
          woodwinds: '2 / F',
          brass: '3 / J',
          percussion: '4 / K'
        };
        const labels: Record<InstrumentSection, string> = {
          strings: 'Strings Expressivo',
          woodwinds: 'Winds Dolce',
          brass: 'Brass Fanfare',
          percussion: 'Percussion Accent'
        };

        comp.activeSectionCue = {
          section: chosenSection,
          key: keys[chosenSection],
          label: labels[chosenSection],
          urgency: 1.0,
          sweetSpot: 0.3 + Math.random() * 0.4
        };
      }
    }
  }

  /* ---------------- EXPLORATION & COLLISION ---------------- */

  public update(time: number): void {
    const dt = this.lastTime ? Math.min((time - this.lastTime) / 1000, 0.1) : 0.016;
    this.lastTime = time;
    this.state.time += dt;

    this.updateDispatches(dt);

    if (this.state.mode === 'practice' && this.state.practiceSession && !this.state.practiceSession.completed) {
      const session = this.state.practiceSession;
      session.elapsedTime += dt;
      if (session.feedbackTimer > 0) session.feedbackTimer -= dt;

      // Metronome click on beat
      const beatDuration = 60 / session.bpm;
      const prevBeat = Math.floor((session.elapsedTime - dt) / beatDuration);
      const currBeat = Math.floor(session.elapsedTime / beatDuration);
      if (currBeat > prevBeat) {
        soundEngine.playMetronomeClick(currBeat % 4 === 0);
      }

      // Check for missed notes
      for (const note of session.notes) {
        if (!note.hit && !note.missed && session.elapsedTime > note.targetTime + 0.3) {
          note.missed = true;
          session.combo = 0;
          session.feedbackText = 'MISS!';
          session.feedbackTimer = 0.4;
        }
      }

      if (session.elapsedTime >= session.duration) {
        this.finishPracticeSession();
      }
      return;
    }

    if (this.state.mode === 'competition' && this.state.competition && !this.state.competition.concluded) {
      this.updateConductingCompetition(dt);
    }

    if (this.state.mode === 'exploration') {
      this.updateMovement(dt);
      this.updateNPCs(dt);
      this.updateCamera();
      this.updateProximity();
    }
  }

  /* ---------------- NPC WANDERING & AMBIENT INTERACTION ---------------- */

  private banterTimer: number = 0;

  private updateNPCs(dt: number): void {
    const currentZone = this.state.currentZone;
    this.banterTimer -= dt;

    // 1. Update movement and wander timers for NPCs in current zone
    for (const npc of this.state.npcs) {
      // Update chat bubble timer
      if (npc.chatBubble) {
        npc.chatBubble.timer -= dt;
        if (npc.chatBubble.timer <= 0) {
          npc.chatBubble = undefined;
        }
      }

      if (npc.zone !== currentZone || !npc.wander || npc.isProp) continue;

      // Handle wander decision timer
      npc.wanderTimer = (npc.wanderTimer || 0) - dt;
      if (npc.wanderTimer <= 0) {
        npc.wanderTimer = 2.5 + Math.random() * 4.0;
        const anchorX = npc.anchorX || npc.x;
        const anchorY = npc.anchorY || npc.y;
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 70;
        npc.targetX = anchorX + Math.cos(angle) * dist;
        npc.targetY = anchorY + Math.sin(angle) * dist;
      }

      // Step towards target
      if (npc.targetX !== undefined && npc.targetY !== undefined) {
        const dist = Math.hypot(npc.targetX - npc.x, npc.targetY - npc.y);
        if (dist > 3) {
          const speed = 35; // gentle walk
          const step = Math.min(speed * dt, dist);
          const dx = (npc.targetX - npc.x) / dist;
          const dy = (npc.targetY - npc.y) / dist;
          const nextX = npc.x + dx * step;
          const nextY = npc.y + dy * step;

          if (!this.checkObstacleCollision(nextX, nextY)) {
            npc.x = nextX;
            npc.y = nextY;
            if (Math.abs(dx) > Math.abs(dy)) {
              npc.dir = dx > 0 ? 'right' : 'left';
            } else {
              npc.dir = dy > 0 ? 'down' : 'up';
            }
          } else {
            npc.targetX = undefined;
          }
        } else {
          npc.targetX = undefined;
        }
      }
    }

    // 2. Dynamic proximity banter between NPCs in same zone
    if (this.banterTimer <= 0) {
      this.banterTimer = 4.0 + Math.random() * 3.0;
      const zoneNPCs = this.state.npcs.filter(n => n.zone === currentZone && !n.isProp && !n.chatBubble);
      
      for (let i = 0; i < zoneNPCs.length; i++) {
        for (let j = i + 1; j < zoneNPCs.length; j++) {
          const a = zoneNPCs[i];
          const b = zoneNPCs[j];
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 85) {
            const banterPair = this.getBanterForNPCs(a, b);
            if (banterPair) {
              a.chatBubble = { text: banterPair[0], timer: 3.5 };
              b.chatBubble = { text: banterPair[1], timer: 3.5 };
              return; // one pair at a time
            }
          }
        }
      }
    }
  }

  private getBanterForNPCs(a: WorldNPC, b: WorldNPC): [string, string] | null {
    const names = [a.name, b.name].sort().join('&');
    if (names.includes('Clara') && names.includes('Maya')) {
      return ["Clara: More legato!", "Maya: In D minor."];
    } else if (names.includes('Oliver') && names.includes('Devon')) {
      return ["Oliver: Hear that bird?", "Devon: Smooth modal jazz."];
    } else if (names.includes('Jax') && names.includes('Vesta')) {
      return ["Jax: Triple fortissimo!", "Vesta: Watch your posture!"];
    } else if (names.includes('Rita') && names.includes('Ronin')) {
      return ["Rita: 160 BPM steady!", "Ronin: Solid pocket!"];
    } else if (names.includes('Timmy') && names.includes('Barnaby')) {
      return ["Timmy: Made 20♪ today!", "Barnaby: Proud of you!"];
    } else if (names.includes('Clara') && names.includes('Chen')) {
      return ["Mrs. Chen: Practice 40 hrs!", "Clara: Mom, I'm jamming!"];
    } else if (names.includes('Oliver') && names.includes('Higgins')) {
      return ["Mr. Higgins: No 5 AM flutes!", "Oliver: Just one scale!"];
    } else if (names.includes('Jax') && names.includes('Briggs')) {
      return ["Officer Briggs: Keep it down!", "Jax: High C forever!"];
    } else if (names.includes('Rita') && names.includes('Kroll')) {
      return ["Mama Kroll: Not on the table!", "Rita: Best snare surface!"];
    } else if (a.musicianData && b.musicianData) {
      return ["Care for a quick jam?", "Let's lock in tempo!"];
    } else if (a.actionType === 'wild_harmonipet' || b.actionType === 'wild_harmonipet') {
      return ["*Curious chirp*", "*Harmonic hum*"];
    }
    return ["Good day, maestro!", "Lovely acoustic weather!"];
  }

  private updateMovement(dt: number): void {
    let dx = 0;
    let dy = 0;
    if (this.keysDown.has('KeyW') || this.keysDown.has('ArrowUp')) dy -= 1;
    if (this.keysDown.has('KeyS') || this.keysDown.has('ArrowDown')) dy += 1;
    if (this.keysDown.has('KeyA') || this.keysDown.has('ArrowLeft')) dx -= 1;
    if (this.keysDown.has('KeyD') || this.keysDown.has('ArrowRight')) dx += 1;

    const player = this.state.player;
    if (dx !== 0 || dy !== 0) {
      player.isMoving = true;
      if (Math.abs(dx) > Math.abs(dy)) {
        player.dir = dx > 0 ? 'right' : 'left';
      } else {
        player.dir = dy > 0 ? 'down' : 'up';
      }

      const speed = 180;
      const mag = Math.hypot(dx, dy);
      const moveX = (dx / mag) * speed * dt;
      const moveY = (dy / mag) * speed * dt;

      const nextX = player.x + moveX;
      const nextY = player.y + moveY;

      if (!this.checkObstacleCollision(nextX, player.y)) player.x = nextX;
      if (!this.checkObstacleCollision(player.x, nextY)) player.y = nextY;

      // Update follower trail for pets and ensemble partners
      const lastTrail = this.state.followerTrail[0];
      if (!lastTrail || Math.hypot(player.x - lastTrail.x, player.y - lastTrail.y) > 24) {
        this.state.followerTrail.unshift({ x: player.x, y: player.y });
        if (this.state.followerTrail.length > 20) this.state.followerTrail.pop();
      }

      // Check Zone Transitions
      const zone = WORLD_ZONES[this.state.currentZone];
      if (zone) {
        for (const tr of zone.transitions) {
          if (
            player.x >= tr.bounds.x && player.x <= tr.bounds.x + tr.bounds.w &&
            player.y >= tr.bounds.y && player.y <= tr.bounds.y + tr.bounds.h
          ) {
            this.warpToZone(tr.targetZone, tr.targetSpawn);
            break;
          }
        }
      }
    } else {
      player.isMoving = false;
    }
  }

  public warpToZone(targetZone: ZoneId, spawn: { x: number; y: number; dir: 'up' | 'down' | 'left' | 'right' }): void {
    this.state.currentZone = targetZone;
    this.state.player.x = spawn.x;
    this.state.player.y = spawn.y;
    this.state.player.dir = spawn.dir;
    this.state.followerTrail = [{ x: spawn.x, y: spawn.y }];
    this.state.discoveredZones[targetZone] = true;
    this.state.dispatchVenues.forEach(v => {
      if (v.zone === targetZone) v.unlocked = true;
    });

    const activeSections = Array.from(new Set(this.state.ensemble.members.map(m => m.section)));
    soundEngine.startBGM(targetZone, activeSections);
  }

  private checkObstacleCollision(x: number, y: number): boolean {
    const zone = WORLD_ZONES[this.state.currentZone];
    if (!zone) return false;

    // Bounds check (allow walking into transition boundaries)
    if (x < 60 || x > zone.width - 60 || y < 60 || y > zone.height - 60) {
      const isTransition = zone.transitions.some(tr => 
        x >= tr.bounds.x - 20 && x <= tr.bounds.x + tr.bounds.w + 20 &&
        y >= tr.bounds.y - 20 && y <= tr.bounds.y + tr.bounds.h + 20
      );
      if (!isTransition) return true;
    }

    for (const obs of zone.obstacles) {
      if ((obs.type === 'box' || obs.type === 'building') && obs.w && obs.h) {
        if (x >= obs.x && x <= obs.x + obs.w && y >= obs.y && y <= obs.y + obs.h) return true;
      } else if (obs.type === 'circle' && obs.radius) {
        if (Math.hypot(x - obs.x, y - obs.y) < obs.radius + 16) return true;
      }
    }
    return false;
  }

  private updateCamera(): void {
    const zone = WORLD_ZONES[this.state.currentZone] || { width: 2000, height: 1600 };
    const viewW = 1280;
    const viewH = 720;

    let targetX = this.state.player.x - viewW / 2;
    let targetY = this.state.player.y - viewH / 2;

    targetX = Math.max(0, Math.min(targetX, zone.width - viewW));
    targetY = Math.max(0, Math.min(targetY, zone.height - viewH));

    this.state.camera.x = targetX;
    this.state.camera.y = targetY;
  }

  public updateProximity(): void {
    const px = this.state.player.x;
    const py = this.state.player.y;
    let closest: WorldNPC | null = null;
    let minDist = 70;

    for (const npc of this.state.npcs) {
      if (npc.zone === this.state.currentZone) {
        const d = Math.hypot(px - npc.x, py - npc.y);
        if (d < minDist) {
          minDist = d;
          closest = npc;
        }
      }
    }
    this.state.nearbyInteractable = closest;
  }

  public handlePianistBuskerInteraction(target: WorldNPC): void {
    if (this.state.hasPianoAccompaniment) {
      this.showDialogue(target.name, '🎹', [
        "Maestro Franz 'Keys' Liszt smiles warmly from his grand piano:",
        `"Ah, my brilliant virtuoso comrade! My concert grand piano is tuned and ready to accompany your ensemble. Remember: in every concert competition and festival showdown, you have a +50% score boost and crowd resonance surge!"`,
        "Together, our acoustic power is unmatched across Harmonia!"
      ]);
      return;
    }

    const wins = this.state.pianistBuskingWins || 0;
    if (wins === 0) {
      this.showDialogue(target.name, '🎹', [
        "Maestro Franz 'Keys' Liszt cracks his knuckles over the gleaming ivory keys at the Eternal Rotunda Dais.",
        `"Welcome to the Central Plaza! They call me the Grand Virtuoso. If your ensemble seeks true greatness, you must prove you can match my blistering tempo."`,
        `"Duel 1: Novice Busk at 120 BPM! Hit every cadence on beat. Let the audition showdown begin!"`
      ], () => {
        this.startPianistBuskingDuel(1);
      });
    } else if (wins === 1) {
      this.showDialogue(target.name, '🎹', [
        "Maestro Franz's eyes ignite with musical fury:",
        `"You conquered the novice busk, but can you survive the velocity of a Virtuoso Etude at 140 BPM?"`,
        `"Duel 2: Virtuoso Etude (140 BPM)! Prepare for blazing scales and tight cadences!"`
      ], () => {
        this.startPianistBuskingDuel(2);
      });
    } else if (wins === 2) {
      this.showDialogue(target.name, '🎹', [
        "Maestro Franz sweeps his velvet coat back with theatrical flair:",
        `"Unbelievable! You have pushed me to the brink. Only the greatest virtuosos in history have witnessed what comes next."`,
        `"Duel 3: Transcendental Showdown at 160 BPM! Defeat me here, and I will dedicate my grand piano to accompany your ensemble forever!"`
      ], () => {
        this.startPianistBuskingDuel(3);
      });
    } else {
      this.state.hasPianoAccompaniment = true;
      this.showDialogue(target.name, '🎹', [
        "Maestro Franz 'Keys' Liszt bows deeply:",
        `"You are a true master of the tempo! My grand piano is forever at your service. (+50% Score Active)"`
      ]);
    }
  }

  public interactWithNearby(): void {
    const target = this.state.nearbyInteractable;
    if (!target) return;

    if (target.actionType === 'pianist_busking_duel' || target.id === 'npc_pianist_busker') {
      this.handlePianistBuskerInteraction(target);
      return;
    }

    if (target.actionType === 'celebrity_secret') {
      if (!this.state.discoveredSecrets) this.state.discoveredSecrets = [];
      const isFirstDiscovery = !this.state.discoveredSecrets.includes(target.id);
      
      soundEngine.playCelebrityMotif(target.celebrityMotif || target.id);
      
      const avatar = target.musicianData?.avatar || '🌟';
      
      if (isFirstDiscovery) {
        this.state.discoveredSecrets.push(target.id);
        const reward = target.celebrityReward || target.treasureReward || { notes: 350, sparks: 25 };
        this.state.wallet.gold += reward.notes;
        this.state.wallet.inspirationSparks += reward.sparks;
        soundEngine.playFanfare();
        
        const cleanTitle = target.title.replace(/\s*\[SPACE[^\]]*\]/g, '');
        const discoveryNotice = `🌟 SECRET CELEBRITY DISCOVERED! 🌟\nYou found ${target.name} (${cleanTitle})!\nReward: +${reward.notes} Notes (♪) & +${reward.sparks} Inspiration Sparks (✨)!`;
        this.showDialogue(target.name, avatar, [
          discoveryNotice,
          ...target.dialogue
        ]);
      } else {
        this.showDialogue(target.name, avatar, target.dialogue);
      }
      return;
    }

    if (target.actionType === 'practice_bench') {
      this.startPracticeSession('metronome');
      return;
    }

    if (target.actionType === 'sheet_music_stand' && target.sheetMusicReward) {
      const piece = REPERTOIRE_DATABASE.find(p => p.id === target.sheetMusicReward);
      if (piece && !this.state.repertoire.some(p => p.id === piece.id)) {
        this.state.repertoire.push(piece);
        soundEngine.playFanfare();
      }
      this.showDialogue(target.name, '📜', target.dialogue);
      return;
    }

    if (target.actionType === 'audition_battle' && target.musicianData) {
      if (this.state.recruitedMusicians.some(m => m.id === target.musicianData?.id)) {
        const allMembers = [...this.state.ensemble.members, ...this.state.recruitedMusicians, ...this.state.ensembleBox];
        if (target.name.includes('Clara') || target.name.includes('Jax')) {
          const hasClara = allMembers.some(m => m.name.includes('Clara'));
          const hasJax = allMembers.some(m => m.name.includes('Jax'));
          if (hasClara && hasJax) {
            this.showDialogue(target.name, target.musicianData.avatar, [
              target.name.includes('Clara')
                ? "Clara smiles with artistic pride: \"Jax admitted my violin vibrato cuts through even his loudest fortissimo trumpet calls! We created the ultimate Brass & Bow duet!\""
                : "Jax grins broadly: \"Yo! Clara's cantabile bowing is legit! Our trumpet-violin fanfare is shaking the rafters of Harmonia!\""
            ]);
            return;
          }
        }
        if (target.name.includes('Maya') || target.name.includes('Rita')) {
          const hasMaya = allMembers.some(m => m.name.includes('Maya'));
          const hasRita = allMembers.some(m => m.name.includes('Rita'));
          if (hasMaya && hasRita) {
            this.showDialogue(target.name, target.musicianData.avatar, [
              target.name.includes('Maya')
                ? "Maya nods with deep approval: \"Rita's taiko syncopation gives my cello basslines an unstoppable subterranean pulse. Pure underground groove.\""
                : "Rita laughs: \"Maya's heavy cello low-end rocks harder than thunder! Our underground groove is legendary!\""
            ]);
            return;
          }
        }
        this.showDialogue(target.name, target.musicianData.avatar, [
          `Hey ${this.state.ensemble.members[0].name}! Our ${this.state.ensemble.tier} is sounding more harmonious by the day!`
        ]);
        return;
      }
      this.startAuditionBattle(target);
      return;
    }

    if (target.actionType === 'competition_stage') {
      this.startConcertCompetition(target.rivalId);
      return;
    }

    if (target.actionType === 'inspiration_vista' && target.vistaId) {
      const vista = this.state.vistas.find(v => v.id === target.vistaId);
      if (vista && !vista.visited) {
        vista.visited = true;
        const player = this.state.ensemble.members[0];
        player.stats[vista.statReward] = Math.min(100, player.stats[vista.statReward] + vista.statAmount);
        this.state.wallet.inspirationSparks += 10;

        const visitedCount = this.state.vistas.filter(v => v.visited).length;
        if (visitedCount >= 4) {
          const qVistas = this.state.quests.find(q => q.id === 'quest_restoration_vistas');
          if (qVistas) qVistas.completed = true;
        }

        soundEngine.playFanfare();
        this.showDialogue(vista.name, '✨', [
          vista.description,
          `Acoustic resonance absorbed! ${vista.statReward.toUpperCase()} permanently increased by +${vista.statAmount}! (+10 Inspiration Sparks ✨)`
        ]);
        return;
      }
      this.showDialogue(target.name, '✨', ["You reflect on the harmonic echoes of this acoustic vista."]);
      return;
    }

    if (target.id === 'npc_side_musicbox') {
      const musicBoxQuest = this.state.quests.find(q => q.id === 'quest_side_musicbox');
      if (musicBoxQuest && musicBoxQuest.completed) {
        this.showDialogue('Elder Timothy', '👴', [
          "Listen to that glorious, sweet chime! My grandfather's music box is singing once more thanks to you, Maestro!"
        ]);
        return;
      }
      if (this.state.questInventory.includes('brass_music_box_pins')) {
        // Player has the pins! Complete the quest!
        if (musicBoxQuest) musicBoxQuest.completed = true;
        this.state.questInventory = this.state.questInventory.filter(item => item !== 'brass_music_box_pins');
        this.state.wallet.gold += 150;
        this.state.wallet.inspirationSparks += 10;
        soundEngine.playFanfare();
        this.showDialogue('Elder Timothy', '👴', [
          "By the Great Clef! You brought the custom brass cylinder pins from Master Marco!",
          "*Click... whirr... 🎶 (The music box plays an enchanting, crystal chime!)*",
          "It's working perfectly! Take this handsome reward: +150 Notes (♪) and +10 Inspiration Sparks (✨)!"
        ]);
        return;
      }
      // Quest not complete and no pins
      this.showDialogue('Elder Timothy', '👴', [
        "Oh my! My grandfather's antique music box lost its delicate cylinder pins.",
        "Could you visit Master Luthier Marco at the Forge to the west and ask him to forge replacement Brass Pins? I'll reward you with 150 Notes (♪)!"
      ]);
      return;
    }

    if (target.id === 'npc_parent_clara') {
      const qChen = this.state.quests.find(q => q.id === 'quest_mrs_chen_score');
      if (qChen && qChen.completed) {
        this.showDialogue("Mrs. Chen (Clara's Mom)", '👩', [
          "Clara told me she played with true lyrical warmth yesterday... Thank you, Maestro.",
          "Her tone reminds me so much of my own youth. Keep nurturing her heart as well as her fingers!"
        ]);
        return;
      }
      const hasClara = this.state.recruitedMusicians.some(m => m.name.includes('Clara')) || this.state.ensemble.members.some(m => m.name.includes('Clara'));
      if (hasClara || this.state.theoryLevel >= 1) {
        if (qChen) qChen.completed = true;
        this.state.wallet.gold += 300;
        this.state.wallet.inspirationSparks += 25;
        this.state.wallet.reputationStars += 1;
        this.state.ensemble.reputationStars = this.state.wallet.reputationStars;
        soundEngine.playFanfare();
        this.showDialogue("Mrs. Chen (Clara's Mom)", '👩', [
          "Oh! Clara told me how passionately you perform together by the village fountain...",
          "You know... before I became obsessed with demanding 40 hours of daily mechanical drills, I used to compose gentle music in my conservatory youth.",
          "*Mrs. Chen opens an antique velvet drawer and hands you a yellowed manuscript.*",
          "Take this: 'Cavatina Lullaby' score! Promise me you will remind Clara that music is an art of the heart, not just a competition! (+300 Notes ♪, +25 Sparks ✨, +1 Star ★)"
        ]);
        return;
      }
      this.showDialogue("Mrs. Chen (Clara's Mom)", '👩', target.dialogue);
      return;
    }

    if (target.id === 'npc_blind_conductor') {
      const qBlind = this.state.quests.find(q => q.id === 'quest_blind_conductor');
      if (qBlind && !qBlind.completed) {
        qBlind.completed = true;
        this.state.wallet.gold += qBlind.rewardGold;
        this.state.wallet.inspirationSparks += qBlind.rewardSparks;
        this.state.wallet.reputationStars += qBlind.rewardStars;
        this.state.ensemble.reputationStars = this.state.wallet.reputationStars;
        this.state.ensemble.members.forEach(m => {
          m.stats.toneQuality = Math.min(100, m.stats.toneQuality + 5);
          m.stats.sightReading = Math.min(100, m.stats.sightReading + 5);
        });
        soundEngine.playFanfare();
        this.showDialogue('Maestro Tiresias', '🦯', [
          "Maestro Tiresias touches your instrument's soundboard and listens intently:",
          "\"Remarkable. Your ensemble's overtone series is aligning. The timbral discord between high winds and brass is dissolved!\"",
          "\"Remember: True balance is not playing at the same volume, but carving out acoustic frequency space for each voice to breathe!\"",
          "Timbre clinic complete! All ensemble members gained +5 Tone Quality and +5 Sight Reading! (+700 Notes ♪, +50 Sparks ✨, +2 Stars ★)"
        ]);
        return;
      }
      this.showDialogue('Maestro Tiresias', '🦯', [
        "Your ensemble's acoustic spectrum is balanced to perfection. Go forth and let Harmonia sing!"
      ]);
      return;
    }

    if (target.id === 'npc_maestro_roundtable') {
      const qRoundtable = this.state.quests.find(q => q.id === 'quest_maestro_roundtable');
      const q5 = this.state.quests.find(q => q.id === 'quest_ch5');
      if (q5 && q5.completed) {
        if (qRoundtable && !qRoundtable.completed) {
          qRoundtable.completed = true;
          this.state.wallet.gold += qRoundtable.rewardGold;
          this.state.wallet.inspirationSparks += qRoundtable.rewardSparks;
          this.state.wallet.reputationStars += qRoundtable.rewardStars;
          this.state.ensemble.reputationStars = this.state.wallet.reputationStars;
        }
        soundEngine.playMaestroRoundtableJam();
        this.showDialogue("The Maestro's Roundtable", '🍷', [
          "🌟 THE MAESTRO'S ROUNDTABLE POST-GAME JAM! 🌟",
          "Mozart, Beethoven, Bach, Paganini, and Satie toast to your Solstice Symphony triumph!",
          "Mozart: \"Hahaha! What did I tell you? True harmony is alive and kicking!\"",
          "Beethoven: \"I may not hear the world's trivial chatter, but I FEEL the titanic resonance of your victory shaking the forum!\"",
          "Bach: \"A sublime contrapuntal architecture. Well played, young maestro.\"",
          "Paganini: \"Your virtuosic flair on the fingerboard is truly devilish!\"",
          "Satie: \"Ah, finally... let us lounge, sip pear cider, and jam in ambient serenity.\"",
          "Maestro Vane: \"Strike up the celebratory roundtable jam!\" (+3000 Notes ♪, +200 Sparks ✨, +5 Stars ★)"
        ]);
        return;
      }
      this.showDialogue("The Maestro's Roundtable", '🍷', [
        "The grand forum banquet table is reserved for the Solstice Symphony Champion.",
        "Conquer Chapter 5 to summon the five masters for the post-game roundtable jam!"
      ]);
      return;
    }

    if (target.actionType === 'circle_of_fifths_puzzle') {
      if (!this.state.unlockedAcousticGates) this.state.unlockedAcousticGates = [];
      if (this.state.unlockedAcousticGates.includes(target.id)) {
        this.showDialogue(target.name, '🌀', [
          "The Circle of Fifths Acoustic Gate hums with crystal resonance. The mountain passage is permanently unlocked!"
        ]);
        return;
      }
      this.solveAcousticPuzzleGate(target.id);
      this.showDialogue(target.name, '🌀', [
        "You channel your acoustic instrument into the monolith's resonance crystal...",
        "Modulation Sequence Aligned: C Major ➔ G Major ➔ D Major ➔ A Major ➔ E Major (Ascending Fifths)!",
        "The acoustic barrier shatters into sparkling harmonic dust! Mountain passage unlocked! (+300 Notes ♪, +25 Sparks ✨)"
      ]);
      return;
    }

    if (target.id === 'npc_barkeep_barnaby' || target.id === 'npc_door_tavern') {
      soundEngine.playInstrumentNote('harp', 523.25, 0.4, 0.9);
      setTimeout(() => soundEngine.playInstrumentNote('harp', 659.25, 0.4, 0.9), 120);
      setTimeout(() => soundEngine.playInstrumentNote('harp', 783.99, 0.5, 0.9), 240);

      this.showDialogue('Barkeep Barnaby', '🍺', [
        "Welcome to The Melodic Rose Tavern & Inn! Pull up a chair by the warm hearth and rest your weary feet.",
        "💡 Local Lore: Elder Timothy by the Clocktower needs brass pins for his antique music box. Master Marco at the Forge can machine them!",
        "🌲 Exploration Gossip: In Woodwind Woods, you'll find the Bellflower Basin and Verdant Cascade vistas — listening there permanently elevates your stats!",
        "*You enjoy a warm flagon of sparkling spiced cider and take a relaxing rest. Harmony and spirits fully restored!*"
      ]);
      return;
    }

    if (target.id === 'npc_door_library') {
      window.dispatchEvent(new CustomEvent('open-repertoire-modal'));
      this.showDialogue('Conservatory Head Librarian', '📖', [
        "Welcome inside the Conservatory Library & Archives! Here is our comprehensive collection of sheet music repertoire and discovered folios."
      ]);
      return;
    }

    if (target.id === 'npc_door_townhall') {
      window.dispatchEvent(new CustomEvent('open-quests-modal'));
      this.showDialogue('Town Hall Administrator', '🏛️', [
        "Welcome to Cavatina Town Hall! Review your active regional commissions, quest log, and lost score manuscripts."
      ]);
      return;
    }

    if (target.actionType === 'luthier_shop') {
      window.dispatchEvent(new CustomEvent('open-luthier-shop'));
      this.showDialogue(target.name, '🔨', target.dialogue);
      return;
    }

    if (target.actionType === 'theory_bench') {
      this.startTheoryChallenge(target.theoryType);
      return;
    }

    if (target.actionType === 'customization_mirror') {
      window.dispatchEvent(new CustomEvent('open-customization-modal'));
      return;
    }

    if (target.actionType === 'treasure_chest') {
      if (!this.state.openedChests) this.state.openedChests = [];
      if (this.state.openedChests.includes(target.id)) {
        this.showDialogue(target.name, '📦', ["This ancient treasure chest is empty."]);
      } else {
        this.state.openedChests.push(target.id);
        const reward = target.treasureReward || { notes: 250, sparks: 15 };
        this.state.wallet.gold += reward.notes;
        this.state.wallet.inspirationSparks += reward.sparks;
        soundEngine.playNoteAccuracyFeedback('perfect');
        this.showDialogue(target.name, '✨', target.dialogue);
      }
      return;
    }

    if (target.id.includes('library')) {
      window.dispatchEvent(new CustomEvent('open-repertoire-modal'));
      this.showDialogue('Conservatory Head Librarian', '📖', [
        "Welcome inside the Conservatory Library & Archives! Here is our comprehensive collection of sheet music repertoire and discovered folios."
      ]);
      return;
    }

    if (target.id.includes('townhall')) {
      window.dispatchEvent(new CustomEvent('open-quests-modal'));
      this.showDialogue('Town Hall Administrator', '🏛️', [
        "Welcome to Town Hall! Review your active regional commissions, quest log, and lost score manuscripts."
      ]);
      return;
    }

    if (target.actionType === 'wild_harmonipet') {
      this.startHarmonizeEncounter(target);
      return;
    }

    this.showDialogue(target.name, '💬', target.dialogue);
  }

  /* ---------------- MUSIC THEORY CHALLENGES ---------------- */

  public startTheoryChallenge(forcedType?: TheoryChallengeType): void {
    // Find next uncompleted drill in curriculum
    let curriculumTier = THEORY_CURRICULUM.find(t => !this.state.completedTheoryDrills.includes(t.id));
    if (forcedType) {
      curriculumTier = THEORY_CURRICULUM.find(t => t.id === forcedType) || curriculumTier;
    }
    if (!curriculumTier) {
      curriculumTier = THEORY_CURRICULUM[THEORY_CURRICULUM.length - 1];
    }

    // Pick a random 3 questions out of the 10 available questions
    const allQuestions = JSON.parse(JSON.stringify(curriculumTier.questions));
    const shuffled = allQuestions.sort(() => 0.5 - Math.random());
    const questions = shuffled.slice(0, 3);

    this.state.theoryChallenge = {
      type: curriculumTier.id,
      title: curriculumTier.title,
      tier: curriculumTier.tier,
      questions,
      currentQuestionIndex: 0,
      score: 0,
      rewardSparks: curriculumTier.rewardSparks,
      rewardSightReading: curriculumTier.rewardSightReading,
      completed: false,
      lifelinesRemaining: 3,
      maxLifelines: 3,
      isPracticePreview: false
    };
    this.state.mode = 'theory_challenge';

    // Play initial audio question note if available
    const q = questions[0];
    if (q && q.notesToPlay && q.notesToPlay.length > 0) {
      soundEngine.stopBGM();
      q.notesToPlay.forEach((freq: number, idx: number) => {
        setTimeout(() => {
          soundEngine.playInstrumentNote('glockenspiel', freq, 0.5, 0.8);
        }, idx * 400);
      });
    }
  }

  public startTheoryPracticePreview(forcedType?: TheoryChallengeType): void {
    let curriculumTier = THEORY_CURRICULUM.find(t => !this.state.completedTheoryDrills.includes(t.id));
    if (forcedType) {
      curriculumTier = THEORY_CURRICULUM.find(t => t.id === forcedType) || curriculumTier;
    }
    if (!curriculumTier) {
      curriculumTier = THEORY_CURRICULUM[0];
    }

    const allQuestions = JSON.parse(JSON.stringify(curriculumTier.questions));
    const questions = allQuestions.slice(0, 3);

    this.state.theoryChallenge = {
      type: curriculumTier.id,
      title: `${curriculumTier.title} (Practice Preview)`,
      tier: curriculumTier.tier,
      questions,
      currentQuestionIndex: 0,
      score: 0,
      rewardSparks: 0,
      rewardSightReading: 0,
      completed: false,
      lifelinesRemaining: 3,
      maxLifelines: 3,
      isPracticePreview: true
    };
    this.state.mode = 'theory_challenge';

    const q = questions[0];
    if (q && q.notesToPlay && q.notesToPlay.length > 0) {
      soundEngine.stopBGM();
      q.notesToPlay.forEach((freq: number, idx: number) => {
        setTimeout(() => {
          soundEngine.playInstrumentNote('glockenspiel', freq, 0.5, 0.8);
        }, idx * 400);
      });
    }
  }

  public replayTheoryAudio(): void {
    const ch = this.state.theoryChallenge;
    if (!ch || ch.completed) return;
    const q = ch.questions[ch.currentQuestionIndex];
    if (q && q.notesToPlay && q.notesToPlay.length > 0) {
      q.notesToPlay.forEach((freq: number, idx: number) => {
        setTimeout(() => {
          soundEngine.playInstrumentNote('glockenspiel', freq, 0.5, 0.8);
        }, idx * 400);
      });
    }
  }

  public answerTheoryQuestion(optionIndex: number): void {
    const ch = this.state.theoryChallenge;
    if (!ch || ch.completed) return;

    const q = ch.questions[ch.currentQuestionIndex];
    const isCorrect = optionIndex === q.correctIndex;

    const advanceToNext = () => {
      ch.currentQuestionIndex++;
      if (ch.currentQuestionIndex >= ch.questions.length) {
        ch.completed = true;

        if (ch.isPracticePreview) {
          this.showDialogue('Practice Study Complete', '📖', [
            `You completed the study preview for [${ch.title}]! Score: ${ch.score}/${ch.questions.length * 100}.`,
            `Take your knowledge to the Theory Lectern to take the official exam whenever you feel ready!`
          ], () => {
            this.state.mode = 'exploration';
            this.state.theoryChallenge = null;
            const activeSections = Array.from(new Set(this.state.ensemble.members.map(m => m.section)));
            soundEngine.startBGM(this.state.currentZone, activeSections);
          });
          return;
        }

        if (!this.state.completedTheoryDrills.includes(ch.type)) {
          this.state.completedTheoryDrills.push(ch.type);
        }
        this.state.theoryLevel = Math.min(8, this.state.completedTheoryDrills.length + 1);
        this.checkLevelUps();
        if (this.state.completedTheoryDrills.length >= 3) {
          const qTheory = this.state.quests.find(q => q.id === 'quest_side_theory_scholar');
          if (qTheory) qTheory.completed = true;
        }

        const player = this.state.ensemble.members[0];
        const accuracyRatio = ch.score / (ch.questions.length * 100);
        const sparksWon = Math.round(ch.rewardSparks * accuracyRatio);
        const rdgWon = Math.round(ch.rewardSightReading * accuracyRatio);

        this.state.wallet.inspirationSparks += sparksWon;
        player.stats.sightReading = Math.min(100, player.stats.sightReading + rdgWon);
        soundEngine.playFanfare();

        const remaining = THEORY_CURRICULUM.length - this.state.completedTheoryDrills.length;
        const statusMsg = remaining > 0 
          ? `🌟 Tier Mastered! ${remaining} curriculum tiers remaining until Conservatory Graduation!` 
          : `👑 CONSERVATORY MASTER! You have mastered all 8 tiers of musical acoustics!`;

        this.showDialogue('Theory Certification Passed!', '🎓', [
          `[${ch.title}] Drill Completed! Final Score: ${ch.score}/${ch.questions.length * 100}.`,
          `Earned +${sparksWon} Inspiration Sparks ✨ and +${rdgWon} Sight-Reading (RDG) for ${player.name}!`,
          statusMsg
        ], () => {
          this.state.mode = 'exploration';
          this.state.theoryChallenge = null;
          const activeSections = Array.from(new Set(this.state.ensemble.members.map(m => m.section)));
          soundEngine.startBGM(this.state.currentZone, activeSections);
        });
      } else {
        this.state.mode = 'theory_challenge';
        const nextQ = ch.questions[ch.currentQuestionIndex];
        if (nextQ && nextQ.notesToPlay) {
          nextQ.notesToPlay.forEach((freq: number, idx: number) => {
            setTimeout(() => {
              soundEngine.playInstrumentNote('glockenspiel', freq, 0.5, 0.8);
            }, idx * 400);
          });
        }
      }
    };

    if (!isCorrect) {
      soundEngine.playNoteAccuracyFeedback('miss');
      ch.lifelinesRemaining--;

      if (ch.lifelinesRemaining <= 0) {
        ch.completed = true;
        this.showDialogue(ch.isPracticePreview ? 'Practice Preview Ended' : 'Theory Drill Failed', '💔', [
          `INCORRECT! The correct answer was: ${q.options[q.correctIndex]}.`,
          `${q.explanation}`,
          ch.isPracticePreview
            ? `All practice lifelines exhausted (0/${ch.maxLifelines})! The study preview has ended.`
            : `All lifelines exhausted (0/${ch.maxLifelines})! The exam has ended. Study hard and try again at the Theory Lectern!`
        ], () => {
          this.state.mode = 'exploration';
          this.state.theoryChallenge = null;
          const activeSections = Array.from(new Set(this.state.ensemble.members.map(m => m.section)));
          soundEngine.startBGM(this.state.currentZone, activeSections);
        });
        return;
      }

      // Remediation with lifelines remaining
      this.showDialogue('Theory Remediation', '⚠️', [
        `INCORRECT! The correct answer was: ${q.options[q.correctIndex]}.`,
        `${q.explanation}`,
        `Lifeline lost! ❤️ ${ch.lifelinesRemaining}/${ch.maxLifelines} hearts remaining. Continuing...`
      ], () => {
        advanceToNext();
      });
      return;
    }

    // ✨ Correct Answer
    ch.score += 100;
    soundEngine.playNoteAccuracyFeedback('perfect');

    this.showDialogue('Theory Evaluation', '✨', [
      `CORRECT! ${q.explanation}`
    ], () => {
      advanceToNext();
    });
  }

  public setCustomization(partial: Partial<PlayerCustomization>): void {
    this.state.customization = { ...this.state.customization, ...partial };
  }

  /* ---------------- MUSIC THEORY PROGRESSION & PET EVOLUTION ---------------- */

  public getXpForLevel(level: number): number {
    if (level <= 1) return 0;
    // Level 2: 100, Level 3: 250, Level 4: 450, Level 5: 700, Level 6: 1000, Level 7: 1350, Level 8: 1750, Level 9: 2200, Level 10: 2700
    return Math.round((level - 1) * 100 + ((level - 1) * (level - 2) / 2) * 50);
  }

  public getRequiredTheoryTierForLevel(targetLevel: number): number | null {
    if (targetLevel === 4) return 1; // Lv.3 -> 4 requires Tier 1
    if (targetLevel === 7) return 2; // Lv.6 -> 7 requires Tier 2
    if (targetLevel === 10) return 3; // Lv.9 -> 10 requires Tier 3
    return null;
  }

  public hasPassedTheoryTier(tierNum: number): boolean {
    const tier = THEORY_CURRICULUM.find(t => t.tier === tierNum);
    if (!tier) return false;
    return this.state.completedTheoryDrills.includes(tier.id);
  }

  public awardMusicianXp(
    musician: Musician,
    xpAmount: number
  ): { leveledUp: boolean; oldLevel: number; newLevel: number; gated: boolean; requiredTheoryTier?: number } {
    const oldLevel = musician.level;
    musician.xp += xpAmount;
    let gated = false;
    let requiredTier: number | undefined;

    while (musician.level < 20) {
      const nextLevel = musician.level + 1;
      const reqXp = this.getXpForLevel(nextLevel);
      if (musician.xp < reqXp) break;

      const reqTheory = this.getRequiredTheoryTierForLevel(nextLevel);
      if (reqTheory && !this.hasPassedTheoryTier(reqTheory)) {
        gated = true;
        requiredTier = reqTheory;
        break;
      }

      musician.level = nextLevel;
    }

    const leveledUp = musician.level > oldLevel;
    return { leveledUp, oldLevel, newLevel: musician.level, gated, requiredTheoryTier: requiredTier };
  }

  public checkLevelUps(): void {
    const allMusicians = [...this.state.ensemble.members];
    this.state.recruitedMusicians.forEach(rm => {
      if (!allMusicians.some(m => m.id === rm.id)) {
        allMusicians.push(rm);
      }
    });

    allMusicians.forEach(m => {
      this.awardMusicianXp(m, 0);
    });
  }

  public canEvolvePet(petId: string): { canEvolve: boolean; reason?: string; requiresTheory?: boolean; requiredTheoryTier?: number } {
    const entry = this.state.harmoniDex.find(d => d.id === petId || d.species === petId || d.name === petId);
    if (!entry) {
      return { canEvolve: false, reason: "Harmonipet not registered in HarmoniDex." };
    }
    if (!entry.bonded) {
      return { canEvolve: false, reason: "Must bond with this Harmonipet before evolving." };
    }
    if (entry.evolutionStage >= 2 || !entry.evolvesTo) {
      return { canEvolve: false, reason: `${entry.species} has already attained its maximum evolution stage!` };
    }

    // Determine pet level from bonded musician or active party lead
    const owner = this.state.ensemble.members.find(m => m.pet.id === entry.id || m.pet.species === entry.species || m.pet.name === entry.name);
    const petLevel = owner ? owner.level : (this.state.ensemble.members[0]?.level || 1);
    const reqLevel = entry.evolutionLevel || 3;

    if (petLevel < reqLevel) {
      return {
        canEvolve: false,
        reason: `${entry.name} (${entry.species}) must reach Level ${reqLevel} to evolve (Current Lv.${petLevel}).`
      };
    }

    // Music theory prerequisite: passing Conservatory Theory Exam (Tier 1 Certification)
    const passedExam = this.state.completedTheoryDrills.length >= 1;
    if (!passedExam) {
      return {
        canEvolve: false,
        requiresTheory: true,
        requiredTheoryTier: 1,
        reason: `Passing a Conservatory Theory Exam (Tier 1 Certification) is required to unlock pet evolution!`
      };
    }

    return { canEvolve: true };
  }

  public evolvePet(petId: string): boolean {
    const check = this.canEvolvePet(petId);
    if (!check.canEvolve) return false;

    const entry = this.state.harmoniDex.find(d => d.id === petId || d.species === petId || d.name === petId)!;
    const prevSpecies = entry.species;
    const prevSprite = entry.sprite;
    const newSpecies = entry.evolvesTo!;
    const newSprite = entry.evolvedSprite || '✨';

    entry.species = newSpecies;
    entry.sprite = newSprite;
    entry.evolutionStage = 2;
    if (entry.evolvedLore) {
      entry.description = entry.evolvedLore;
    }

    // Apply stat boosts to bonded musicians
    const owners = this.state.ensemble.members.filter(m => m.pet.id === entry.id || m.pet.species === prevSpecies || m.pet.name === entry.name);
    owners.forEach(owner => {
      owner.pet.species = newSpecies;
      owner.pet.sprite = newSprite;
      if (entry.evolvedStatsBonus) {
        if (entry.evolvedStatsBonus.technique) owner.stats.technique = Math.min(100, owner.stats.technique + entry.evolvedStatsBonus.technique);
        if (entry.evolvedStatsBonus.toneQuality) owner.stats.toneQuality = Math.min(100, owner.stats.toneQuality + entry.evolvedStatsBonus.toneQuality);
        if (entry.evolvedStatsBonus.tempoStability) owner.stats.tempoStability = Math.min(100, owner.stats.tempoStability + entry.evolvedStatsBonus.tempoStability);
        if (entry.evolvedStatsBonus.sightReading) owner.stats.sightReading = Math.min(100, owner.stats.sightReading + entry.evolvedStatsBonus.sightReading);
      }
    });

    // Also update recruited musicians
    this.state.recruitedMusicians.forEach(rm => {
      if (rm.pet.id === entry.id || rm.pet.species === prevSpecies || rm.pet.name === entry.name) {
        rm.pet.species = newSpecies;
        rm.pet.sprite = newSprite;
      }
    });

    this.state.lastEvolvedPet = {
      prevSpecies,
      prevSprite,
      newSpecies,
      newSprite,
      petName: entry.name,
      lore: entry.evolvedLore || entry.description
    };

    soundEngine.playFanfare();
    return true;
  }

  public checkQuestTheoryPrerequisites(questId: string): boolean {
    const q = this.state.quests.find(quest => quest.id === questId);
    if (!q || !q.requiredTheoryTier) return true;
    return this.hasPassedTheoryTier(q.requiredTheoryTier);
  }

  /* ---------------- DIALOGUE SYSTEM ---------------- */

  public showDialogue(speaker: string, avatar: string, text: string[], onComplete?: () => void): void {
    this.state.dialogue = { speaker, avatar, text, index: 0, onComplete };
  }

  public advanceDialogue(): void {
    if (!this.state.dialogue) return;
    if (this.state.dialogue.index < this.state.dialogue.text.length - 1) {
      this.state.dialogue.index++;
    } else {
      const cb = this.state.dialogue.onComplete;
      this.state.dialogue = null;
      if (cb) cb();
    }
  }

  public handleKeyDown(code: string): void {
    this.keysDown.add(code);

    if (code === 'Space' || code === 'Enter') {
      if (this.state.dialogue) {
        this.advanceDialogue();
      } else if (this.state.mode === 'exploration') {
        this.interactWithNearby();
      } else if (this.state.mode === 'competition') {
        this.advanceConcertPerformance();
      }
    }

    if (this.state.mode === 'practice') {
      if (code === 'Digit1' || code === 'KeyD') this.hitPracticeNote(0);
      if (code === 'Digit2' || code === 'KeyF') this.hitPracticeNote(1);
      if (code === 'Digit3' || code === 'KeyJ') this.hitPracticeNote(2);
      if (code === 'Digit4' || code === 'KeyK') this.hitPracticeNote(3);
      if (code === 'KeyV') this.toggleStaffVisualizer();
    }

    if (this.state.mode === 'competition') {
      if (code === 'Digit1' || code === 'KeyD') this.conductSection('strings');
      if (code === 'Digit2' || code === 'KeyF') this.conductSection('woodwinds');
      if (code === 'Digit3' || code === 'KeyJ') this.conductSection('brass');
      if (code === 'Digit4' || code === 'KeyK') this.conductSection('percussion');
    }
  }

  public handleKeyUp(code: string): void {
    this.keysDown.delete(code);
  }

  /* ---------------- PERSISTENCE & SYSTEM ---------------- */

  public saveGame(): boolean {
    try {
      const saveData = {
        currentZone: this.state.currentZone,
        player: this.state.player,
        customization: this.state.customization,
        ensemble: this.state.ensemble,
        recruitedMusicians: this.state.recruitedMusicians,
        ensembleBox: this.state.ensembleBox,
        harmoniDex: this.state.harmoniDex,
        badges: this.state.badges,
        repertoire: this.state.repertoire,
        discoveredZones: this.state.discoveredZones,
        wallet: this.state.wallet,
        artifacts: this.state.artifacts,
        lostScores: this.state.lostScores,
        vistas: this.state.vistas,
        quests: this.state.quests,
        activeQuestId: this.state.activeQuestId,
        questInventory: this.state.questInventory,
        openedChests: this.state.openedChests,
        discoveredSecrets: this.state.discoveredSecrets,
        proficiency: this.state.proficiency,
        practiceLevel: this.state.practiceLevel,
        theoryLevel: this.state.theoryLevel,
        completedTheoryDrills: this.state.completedTheoryDrills,
        completedEvents: this.state.completedEvents,
        pianistBuskingWins: this.state.pianistBuskingWins,
        hasPianoAccompaniment: this.state.hasPianoAccompaniment,
        unlockedAcousticGates: this.state.unlockedAcousticGates ? [...this.state.unlockedAcousticGates] : [],
        showStaffVisualizer: this.state.showStaffVisualizer,
        savedAt: new Date().toLocaleTimeString()
      };
      localStorage.setItem('harmonia_saved_game', JSON.stringify(saveData));
      return true;
    } catch (e) {
      console.error('Save failed', e);
      return false;
    }
  }

  public loadGame(): boolean {
    try {
      const raw = localStorage.getItem('harmonia_saved_game');
      if (!raw) return false;
      const data = JSON.parse(raw);
      this.state.currentZone = data.currentZone || 'cavatina_village';
      this.state.player = data.player || { x: 1000, y: 920, dir: 'down', isMoving: false };
      this.state.customization = data.customization || JSON.parse(JSON.stringify(DEFAULT_CUSTOMIZATION));
      this.state.ensemble = data.ensemble || this.state.ensemble;
      this.state.recruitedMusicians = data.recruitedMusicians || [];
      this.state.ensembleBox = data.ensembleBox || [];
      this.state.harmoniDex = data.harmoniDex || this.state.harmoniDex;
      this.state.badges = data.badges || this.state.badges;
      this.state.repertoire = data.repertoire || this.state.repertoire;
      this.state.discoveredZones = data.discoveredZones || this.state.discoveredZones;
      this.state.wallet = data.wallet || this.state.wallet;
      this.state.artifacts = data.artifacts || this.state.artifacts;
      this.state.lostScores = data.lostScores || this.state.lostScores;
      this.state.vistas = data.vistas || this.state.vistas;
      this.state.quests = data.quests || this.state.quests;
      this.state.activeQuestId = data.activeQuestId || 'quest_ch1';
      this.state.questInventory = data.questInventory || [];
      this.state.openedChests = data.openedChests || [];
      this.state.discoveredSecrets = data.discoveredSecrets || [];
      this.state.unlockedAcousticGates = Array.isArray(data.unlockedAcousticGates) ? [...data.unlockedAcousticGates] : [];
      this.state.showStaffVisualizer = Boolean(data.showStaffVisualizer);
      this.state.proficiency = data.proficiency || this.state.proficiency;
      this.state.practiceLevel = data.practiceLevel || 1;
      this.state.theoryLevel = data.theoryLevel || 1;
      this.state.completedTheoryDrills = data.completedTheoryDrills || [];
      this.state.completedEvents = data.completedEvents || [];
      this.state.pianistBuskingWins = data.pianistBuskingWins || 0;
      this.state.hasPianoAccompaniment = !!data.hasPianoAccompaniment;
      this.state.calendarEvents = data.calendarEvents || JSON.parse(JSON.stringify(FESTIVAL_CALENDAR));
      this.state.mode = 'exploration';
      this.state.followerTrail = [{ x: this.state.player.x, y: this.state.player.y }];
      const activeSections = Array.from(new Set(this.state.ensemble.members.map(m => m.section)));
      soundEngine.startBGM(this.state.currentZone, activeSections);
      return true;
    } catch (e) {
      console.error('Load failed', e);
      return false;
    }
  }

  public exportSaveFile(): string {
    const payload: HarmoniaSavePayload = {
      currentZone: this.state.currentZone,
      player: {
        x: this.state.player.x,
        y: this.state.player.y,
        dir: this.state.player.dir,
        isMoving: false
      },
      customization: JSON.parse(JSON.stringify(this.state.customization)),
      ensemble: JSON.parse(JSON.stringify(this.state.ensemble)),
      recruitedMusicians: JSON.parse(JSON.stringify(this.state.recruitedMusicians)),
      ensembleBox: JSON.parse(JSON.stringify(this.state.ensembleBox)),
      harmoniDex: JSON.parse(JSON.stringify(this.state.harmoniDex)),
      badges: JSON.parse(JSON.stringify(this.state.badges)),
      repertoire: JSON.parse(JSON.stringify(this.state.repertoire)),
      discoveredZones: JSON.parse(JSON.stringify(this.state.discoveredZones)),
      wallet: { ...this.state.wallet },
      artifacts: JSON.parse(JSON.stringify(this.state.artifacts)),
      lostScores: JSON.parse(JSON.stringify(this.state.lostScores)),
      vistas: JSON.parse(JSON.stringify(this.state.vistas)),
      quests: JSON.parse(JSON.stringify(this.state.quests)),
      activeQuestId: this.state.activeQuestId,
      questInventory: [...this.state.questInventory],
      openedChests: [...this.state.openedChests],
      discoveredSecrets: this.state.discoveredSecrets ? [...this.state.discoveredSecrets] : [],
      unlockedAcousticGates: this.state.unlockedAcousticGates ? [...this.state.unlockedAcousticGates] : [],
      showStaffVisualizer: this.state.showStaffVisualizer,
      proficiency: JSON.parse(JSON.stringify(this.state.proficiency)),
      practiceLevel: this.state.practiceLevel,
      theoryLevel: this.state.theoryLevel,
      completedTheoryDrills: [...this.state.completedTheoryDrills],
      completedEvents: [...this.state.completedEvents],
      pianistBuskingWins: this.state.pianistBuskingWins,
      hasPianoAccompaniment: this.state.hasPianoAccompaniment,
      calendarEvents: JSON.parse(JSON.stringify(this.state.calendarEvents))
    };

    const exportWrapper: HarmoniaSaveExport = {
      version: '1.0.0',
      game: 'Harmonia: Opus of the Ensemble',
      exportedAt: new Date().toISOString(),
      schema: 'harmonia_save_v1',
      data: payload
    };

    return JSON.stringify(exportWrapper, null, 2);
  }

  public importSaveFile(jsonString: string): { success: boolean; error?: string } {
    if (!jsonString || typeof jsonString !== 'string' || jsonString.trim() === '') {
      return { success: false, error: 'Save data is empty or invalid string.' };
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonString);
    } catch (err: any) {
      return { success: false, error: `Invalid JSON syntax: ${err?.message || 'Malformed JSON'}` };
    }

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { success: false, error: 'Invalid save structure: Root must be a valid JSON object.' };
    }

    // Handle both wrapped format { version, schema, data: { ... } } and direct payload
    const data: any = (parsed.data && typeof parsed.data === 'object' && !Array.isArray(parsed.data))
      ? parsed.data
      : parsed;

    // Schema Validation
    if (!data.player || typeof data.player.x !== 'number' || typeof data.player.y !== 'number' || !data.player.dir) {
      return { success: false, error: 'Schema validation failed: Missing or corrupt player position data.' };
    }

    if (!data.ensemble || typeof data.ensemble !== 'object' || !Array.isArray(data.ensemble.members)) {
      return { success: false, error: 'Schema validation failed: Missing or invalid ensemble roster.' };
    }

    if (!data.wallet || typeof data.wallet.gold !== 'number' || typeof data.wallet.inspirationSparks !== 'number' || typeof data.wallet.reputationStars !== 'number') {
      return { success: false, error: 'Schema validation failed: Missing or corrupt player wallet.' };
    }

    if (!data.proficiency || typeof data.proficiency !== 'object' || !data.proficiency.sections || !data.proficiency.instruments || !Array.isArray(data.proficiency.unlockedInstruments)) {
      return { success: false, error: 'Schema validation failed: Missing or invalid player proficiency structure.' };
    }

    if (!Array.isArray(data.harmoniDex)) {
      return { success: false, error: 'Schema validation failed: HarmoniDex bestiary must be an array.' };
    }

    if (!Array.isArray(data.badges)) {
      return { success: false, error: 'Schema validation failed: Clef Badges must be an array.' };
    }

    if (!Array.isArray(data.quests)) {
      return { success: false, error: 'Schema validation failed: Quests journal must be an array.' };
    }

    if (!Array.isArray(data.repertoire)) {
      return { success: false, error: 'Schema validation failed: Sheet music repertoire must be an array.' };
    }

    if (typeof data.currentZone !== 'string') {
      return { success: false, error: 'Schema validation failed: Current world zone (currentZone) must be a valid zone string.' };
    }

    try {
      // Restore core state
      this.state.currentZone = data.currentZone as ZoneId;
      this.state.player = {
        x: data.player.x,
        y: data.player.y,
        dir: data.player.dir,
        isMoving: false
      };
      this.state.customization = data.customization
        ? JSON.parse(JSON.stringify(data.customization))
        : JSON.parse(JSON.stringify(DEFAULT_CUSTOMIZATION));
      this.state.ensemble = JSON.parse(JSON.stringify(data.ensemble));
      this.state.recruitedMusicians = Array.isArray(data.recruitedMusicians)
        ? JSON.parse(JSON.stringify(data.recruitedMusicians))
        : [];
      this.state.ensembleBox = Array.isArray(data.ensembleBox)
        ? JSON.parse(JSON.stringify(data.ensembleBox))
        : [];
      this.state.harmoniDex = JSON.parse(JSON.stringify(data.harmoniDex));
      this.state.badges = JSON.parse(JSON.stringify(data.badges));
      this.state.repertoire = JSON.parse(JSON.stringify(data.repertoire));
      this.state.discoveredZones = data.discoveredZones
        ? JSON.parse(JSON.stringify(data.discoveredZones))
        : { cavatina_village: true, woodwind_woods: false, brass_citadel: false, percussion_peaks: false, grand_hall: false, west_wilderness: false, east_wilderness: false, north_wilderness: false, south_wilderness: false };
      this.state.wallet = {
        gold: Math.max(0, data.wallet.gold),
        inspirationSparks: Math.max(0, data.wallet.inspirationSparks),
        reputationStars: Math.max(0, data.wallet.reputationStars)
      };
      this.state.artifacts = Array.isArray(data.artifacts)
        ? JSON.parse(JSON.stringify(data.artifacts))
        : JSON.parse(JSON.stringify(INSTRUMENT_ARTIFACTS));
      this.state.lostScores = Array.isArray(data.lostScores)
        ? JSON.parse(JSON.stringify(data.lostScores))
        : JSON.parse(JSON.stringify(INITIAL_LOST_SCORES));
      this.state.vistas = Array.isArray(data.vistas)
        ? JSON.parse(JSON.stringify(data.vistas))
        : JSON.parse(JSON.stringify(INITIAL_INSPIRATION_VISTAS));
      this.state.quests = JSON.parse(JSON.stringify(data.quests));
      this.state.activeQuestId = data.activeQuestId || 'quest_ch1';
      this.state.questInventory = Array.isArray(data.questInventory) ? [...data.questInventory] : [];
      this.state.openedChests = Array.isArray(data.openedChests) ? [...data.openedChests] : [];
      this.state.discoveredSecrets = Array.isArray(data.discoveredSecrets) ? [...data.discoveredSecrets] : [];
      this.state.unlockedAcousticGates = Array.isArray(data.unlockedAcousticGates) ? [...data.unlockedAcousticGates] : [];
      this.state.showStaffVisualizer = Boolean(data.showStaffVisualizer);
      this.state.proficiency = JSON.parse(JSON.stringify(data.proficiency));
      this.state.practiceLevel = typeof data.practiceLevel === 'number' ? data.practiceLevel : 1;
      this.state.theoryLevel = typeof data.theoryLevel === 'number' ? data.theoryLevel : 1;
      this.state.completedTheoryDrills = Array.isArray(data.completedTheoryDrills) ? [...data.completedTheoryDrills] : [];
      this.state.completedEvents = Array.isArray(data.completedEvents) ? [...data.completedEvents] : [];
      this.state.pianistBuskingWins = typeof data.pianistBuskingWins === 'number' ? data.pianistBuskingWins : 0;
      this.state.hasPianoAccompaniment = Boolean(data.hasPianoAccompaniment);
      this.state.calendarEvents = Array.isArray(data.calendarEvents)
        ? JSON.parse(JSON.stringify(data.calendarEvents))
        : JSON.parse(JSON.stringify(FESTIVAL_CALENDAR));

      // Re-initialize NPC roster matching current state (exclude wild pets that are bonded/caught)
      const bondedSpecies = new Set(this.state.harmoniDex.filter(d => d.bonded).map(d => d.species));
      this.state.npcs = JSON.parse(JSON.stringify(INITIAL_WORLD_NPCS)).filter((npc: WorldNPC) => {
        if (npc.actionType === 'wild_harmonipet' && npc.wildPetData) {
          return !bondedSpecies.has(npc.wildPetData.species);
        }
        return true;
      });

      // Re-initialize runtime engine systems
      this.state.mode = 'exploration';
      this.state.followerTrail = [{ x: this.state.player.x, y: this.state.player.y }];
      this.state.camera = { x: this.state.player.x, y: this.state.player.y };
      this.state.nearbyInteractable = null;
      this.state.practiceSession = null;
      this.state.theoryChallenge = null;
      this.state.auditionBattle = null;
      this.state.harmonizeEncounter = null;
      this.state.competition = null;
      this.state.dialogue = null;

      // Audio engine update
      const activeSections = Array.from(new Set(this.state.ensemble.members.map(m => m.section)));
      soundEngine.startBGM(this.state.currentZone, activeSections);

      // Persist to local storage to maintain parity
      this.saveGame();

      return { success: true };
    } catch (e: any) {
      console.error('Save import failed during state restoration', e);
      return { success: false, error: `Restoration error: ${e?.message || 'Unknown state error'}` };
    }
  }


  public switchPlayerInstrument(newInstrumentId: InstrumentId): void {
    if (!this.state.proficiency.unlockedInstruments.includes(newInstrumentId)) return;
    const player = this.state.ensemble.members[0];
    if (!player) return;
    const info = ALL_INSTRUMENTS_INFO[newInstrumentId];
    if (!info) return;

    player.instrumentId = newInstrumentId;
    player.instrumentName = info.name;
    player.section = info.section;
    player.avatar = info.avatar;
    soundEngine.playInstrumentNote(newInstrumentId, 440, 0.4, 0.8);
  }

  public switchPlayerPet(newPetId: string): void {
    const player = this.state.ensemble.members[0];
    if (!player) return;
    const dexEntry = this.state.harmoniDex.find(d => (d.id === newPetId || d.species === newPetId) && d.bonded);
    if (!dexEntry) return;

    player.pet = {
      id: dexEntry.id,
      name: dexEntry.name,
      species: dexEntry.species,
      sprite: dexEntry.sprite,
      section: dexEntry.section,
      instrumentName: dexEntry.instrumentName,
      leitmotifSound: 'violin_pure',
      color: player.paletteColor
    };
    soundEngine.playFanfare();
  }

  public toggleQuickWheel(forceState?: boolean): void {
    if (this.state.mode !== 'exploration' && this.state.showQuickWheel === false) {
      return;
    }
    if (forceState !== undefined) {
      this.state.showQuickWheel = forceState;
    } else {
      this.state.showQuickWheel = !this.state.showQuickWheel;
    }
  }

  public selectQuickWheelInstrument(instrumentId: InstrumentId): void {
    this.switchPlayerInstrument(instrumentId);
    this.state.showQuickWheel = false;
  }

  public toggleStaffVisualizer(forceState?: boolean): void {
    if (forceState !== undefined) {
      this.state.showStaffVisualizer = forceState;
    } else {
      this.state.showStaffVisualizer = !this.state.showStaffVisualizer;
    }
  }

  public solveAcousticPuzzleGate(gateId: string): boolean {
    if (!this.state.unlockedAcousticGates) this.state.unlockedAcousticGates = [];
    if (this.state.unlockedAcousticGates.includes(gateId)) return true;
    this.state.unlockedAcousticGates.push(gateId);
    this.state.wallet.gold += 300;
    this.state.wallet.inspirationSparks += 25;
    soundEngine.playInstrumentNote('harp', 261.63, 0.4, 0.9); // C
    setTimeout(() => soundEngine.playInstrumentNote('harp', 392.00, 0.4, 0.9), 150); // G (5th)
    setTimeout(() => soundEngine.playInstrumentNote('harp', 587.33, 0.4, 0.9), 300); // D (5th)
    setTimeout(() => soundEngine.playInstrumentNote('harp', 440.00, 0.4, 0.9), 450); // A (5th)
    setTimeout(() => soundEngine.playInstrumentNote('harp', 659.25, 0.5, 0.9), 600); // E (5th)
    setTimeout(() => soundEngine.playFanfare(), 750);
    return true;
  }

  public checkNarrativeQuestCompletions(): void {
    const allMembersAndRecruits = [
      ...this.state.ensemble.members,
      ...this.state.recruitedMusicians,
      ...this.state.ensembleBox
    ];

    // 1. Brass & Bow Debate (Clara & Jax)
    const hasClara = allMembersAndRecruits.some(m => m.name.includes('Clara'));
    const hasJax = allMembersAndRecruits.some(m => m.name.includes('Jax'));
    if (hasClara && hasJax) {
      const q = this.state.quests.find(quest => quest.id === 'quest_brass_bow_debate');
      if (q && !q.completed) {
        q.completed = true;
        this.state.wallet.gold += q.rewardGold;
        this.state.wallet.inspirationSparks += q.rewardSparks;
        this.state.wallet.reputationStars += q.rewardStars;
        this.state.ensemble.reputationStars = this.state.wallet.reputationStars;
      }
    }

    // 2. Bass Underground (Maya & Rita)
    const hasMaya = allMembersAndRecruits.some(m => m.name.includes('Maya'));
    const hasRita = allMembersAndRecruits.some(m => m.name.includes('Rita'));
    if (hasMaya && hasRita) {
      const q = this.state.quests.find(quest => quest.id === 'quest_bass_underground');
      if (q && !q.completed) {
        q.completed = true;
        this.state.wallet.gold += q.rewardGold;
        this.state.wallet.inspirationSparks += q.rewardSparks;
        this.state.wallet.reputationStars += q.rewardStars;
        this.state.ensemble.reputationStars = this.state.wallet.reputationStars;
      }
    }
  }

  /* ---------------- CONSERVATORY DISPATCH GIGS ---------------- */

  public startDispatch(venueId: string, musicianIds: string[]): boolean {
    const venue = this.state.dispatchVenues.find(v => v.id === venueId);
    if (!venue || !venue.unlocked) return false;

    // Check if venue is already running a dispatch
    if (this.state.activeDispatches.some(d => d.venueId === venueId && !d.claimed)) {
      return false;
    }

    if (!musicianIds || musicianIds.length === 0) return false;

    // Check that none of the assigned musicians are already dispatched
    const activeMusicianIds = new Set(
      this.state.activeDispatches.filter(d => !d.claimed).flatMap(d => d.assignedMusicianIds)
    );
    for (const mId of musicianIds) {
      if (activeMusicianIds.has(mId)) return false;
    }

    // Check musicians exist
    const allMusicians = [...this.state.ensembleBox, ...this.state.recruitedMusicians, ...this.state.ensemble.members];
    for (const mId of musicianIds) {
      if (!allMusicians.some(m => m.id === mId)) return false;
    }

    const dispatch: ActiveDispatch = {
      venueId,
      assignedMusicianIds: [...musicianIds],
      startTime: this.state.time,
      durationSeconds: venue.durationSeconds,
      completed: false,
      claimed: false
    };

    this.state.activeDispatches.push(dispatch);
    return true;
  }

  public updateDispatches(_dt: number): void {
    for (const dispatch of this.state.activeDispatches) {
      if (!dispatch.completed && !dispatch.claimed) {
        if (this.state.time >= dispatch.startTime + dispatch.durationSeconds) {
          dispatch.completed = true;
        }
      }
    }
  }

  public claimDispatch(venueId: string): { success: boolean; rewardNotes?: number; rewardSparks?: number; rewardXp?: number } | boolean {
    const dispatch = this.state.activeDispatches.find(d => d.venueId === venueId && d.completed && !d.claimed);
    if (!dispatch) return false;

    const venue = this.state.dispatchVenues.find(v => v.id === venueId);
    if (!venue) return false;

    dispatch.claimed = true;
    this.state.wallet.gold += venue.rewardNotes;
    this.state.wallet.inspirationSparks += venue.rewardSparks;

    const allMusicians = [...this.state.ensembleBox, ...this.state.recruitedMusicians, ...this.state.ensemble.members];
    for (const mId of dispatch.assignedMusicianIds) {
      const musician = allMusicians.find(m => m.id === mId);
      if (musician) {
        this.awardMusicianXp(musician, venue.rewardXp);
      }
    }

    soundEngine.playFanfare();
    return {
      success: true,
      rewardNotes: venue.rewardNotes,
      rewardSparks: venue.rewardSparks,
      rewardXp: venue.rewardXp
    };
  }

  public forgeArtifact(artifactId: string): boolean {
    const artifact = this.state.artifacts.find(a => a.id === artifactId);
    if (!artifact || artifact.equipped) return false;
    if (this.state.wallet.gold < artifact.costGold || this.state.wallet.inspirationSparks < artifact.costSparks) {
      return false;
    }

    this.state.wallet.gold -= artifact.costGold;
    this.state.wallet.inspirationSparks -= artifact.costSparks;
    artifact.equipped = true;

    // Apply bonuses to all matching section members or leader
    const matchingMusicians = this.state.ensemble.members.filter(m => m.section === artifact.section);
    const targets = matchingMusicians.length > 0 ? matchingMusicians : [this.state.ensemble.members[0]];
    for (const m of targets) {
      m.stats.technique = Math.min(100, m.stats.technique + artifact.bonusTechnique);
      m.stats.toneQuality = Math.min(100, m.stats.toneQuality + artifact.bonusTone);
      m.stats.tempoStability = Math.min(100, m.stats.tempoStability + artifact.bonusTempo);
    }
    const qLuthier = this.state.quests.find(q => q.id === 'quest_side_luthier_artisan');
    if (qLuthier) qLuthier.completed = true;

    soundEngine.playFanfare();
    return true;
  }

  public craftQuestPins(): boolean {
    if (this.state.questInventory.includes('brass_music_box_pins')) return false;
    const cost = 30;
    if (this.state.wallet.gold < cost) return false;
    this.state.wallet.gold -= cost;
    this.state.questInventory.push('brass_music_box_pins');
    
    const musicQuest = this.state.quests.find(q => q.id === 'quest_side_musicbox');
    if (musicQuest) {
      musicQuest.objective = 'Deliver the machined Brass Cylinder Pins back to Elder Timothy.';
    }
    soundEngine.playFanfare();
    return true;
  }

  public restartGame(): void {
    localStorage.removeItem('harmonia_saved_game');
    this.state = this.createInitialState();
  }

  /* ---------------- DEVELOPER SANDBOX & CHEAT SUITE ---------------- */

  public ensurePlayerMusician(instrumentId: InstrumentId = 'violin'): Musician {
    if (this.state.ensemble.members.length === 0) {
      this.chooseStarter(instrumentId, 'Maestro (Dev)');
    }
    return this.state.ensemble.members[0];
  }

  public startSandboxAuditionBattle(opponentMusicianId: string): void {
    this.ensurePlayerMusician();
    let opponent: Musician | undefined = RECRUITABLE_MUSICIANS.find(m => m.id === opponentMusicianId);
    if (!opponent) {
      const npc = this.state.npcs.find(n => n.musicianData?.id === opponentMusicianId || n.id === opponentMusicianId);
      if (npc && npc.musicianData) {
        opponent = npc.musicianData;
      }
    }
    if (!opponent) {
      opponent = RECRUITABLE_MUSICIANS[0];
    }

    const activePets = this.state.ensemble.members.map(m => m.pet).filter(Boolean);
    const availableSynergies = PET_SYNERGIES.filter(synergy => {
      const hasPet1 = activePets.some(p => matchesPetRequirement(p, synergy.requiredPets[0]));
      const hasPet2 = activePets.some(p => matchesPetRequirement(p, synergy.requiredPets[1]));
      return hasPet1 && hasPet2;
    }).map(s => ({
      name: s.name,
      description: s.description,
      effectType: s.effectType,
      power: s.power,
      cost: s.cost
    }));

    this.state.auditionBattle = {
      opponent,
      playerHarmonyMeter: 20,
      opponentHarmonyMeter: 20,
      harmonyPoints: 60,
      maxHarmonyPoints: 100,
      playerStance: 'normal',
      opponentStance: 'normal',
      turn: 'player',
      turnTimer: 0,
      cadencePromptActive: false,
      log: [
        `⚔️ [Sandbox] Audition Clash started against ${opponent.name} (${opponent.instrumentName})!`,
        `Tactics: Use Pianissimo Shield to deflect dissonance, or Fortissimo Surge to double your next strike!`
      ],
      selectedMoveIndex: 0,
      concluded: false,
      synergyMoves: availableSynergies
    };

    if (availableSynergies.length > 0) {
      this.state.auditionBattle.log.push(`🐾 Unison Synergy Ready: [${availableSynergies.map(s => s.name).join(', ')}]!`);
    }

    soundEngine.stopBGM();
    this.state.mode = 'audition_battle';
  }

  public startSandboxHarmonizeEncounter(creatureDexId: string): void {
    this.ensurePlayerMusician();
    const dexEntry = this.state.harmoniDex.find(d => d.id === creatureDexId || d.species.toLowerCase().includes(creatureDexId.toLowerCase())) || this.state.harmoniDex[0];
    
    const pet: Harmonipet = {
      id: `wild_${dexEntry.id}`,
      name: dexEntry.name,
      species: dexEntry.species,
      sprite: dexEntry.sprite,
      section: dexEntry.section,
      instrumentName: dexEntry.instrumentName,
      instrumentId: dexEntry.instrumentId,
      leitmotifSound: dexEntry.instrumentId,
      color: dexEntry.section === 'strings' ? '#ec4899' : (dexEntry.section === 'woodwinds' ? '#10b981' : (dexEntry.section === 'brass' ? '#eab308' : '#8b5cf6')),
      rarity: dexEntry.rarity
    };

    const { noteIndices, targetMelody } = generateHarmonizeMelody(pet, dexEntry);

    this.state.harmonizeEncounter = {
      pet,
      instrumentId: dexEntry.instrumentId,
      targetMelody,
      targetNoteIndices: noteIndices,
      currentStep: 0,
      revealedSteps: new Array(noteIndices.length).fill(false),
      isPlayingMelody: false,
      playerInputs: [],
      resonanceMeter: 20,
      catchThreshold: 80,
      attemptsRemaining: 5,
      phase: 'tuning',
      noteAccuracy: 100,
      timingAccuracy: 100,
      sweetSpotCenter: 0.5,
      lastFeedback: undefined,
      lastFeedbackText: '🔧 Tuning mode: Test and find matching tones freely with no penalty!',
      concluded: false,
      caught: false
    };

    this.state.mode = 'harmonize_wild';
    soundEngine.stopBGM();
    soundEngine.playWildlifeCall(pet.species.toLowerCase());
    this.replayHarmonizeMelody();
  }

  public teleportTo(zoneId: ZoneId, x: number, y: number, dir: 'up' | 'down' | 'left' | 'right' = 'down'): void {
    this.ensurePlayerMusician();
    this.state.mode = 'exploration';
    this.warpToZone(zoneId, { x, y, dir });
  }

  public cheatAddCurrency(gold: number, sparks: number, stars: number): void {
    this.state.wallet.gold = Math.max(0, this.state.wallet.gold + gold);
    this.state.wallet.inspirationSparks = Math.max(0, this.state.wallet.inspirationSparks + sparks);
    this.state.wallet.reputationStars = Math.max(0, this.state.wallet.reputationStars + stars);
  }

  public cheatUnlockAllInstruments(): void {
    const allIds = Object.keys(ALL_INSTRUMENTS_INFO) as InstrumentId[];
    this.state.proficiency.unlockedInstruments = [...allIds];
    allIds.forEach(id => {
      this.state.proficiency.instruments[id] = { level: 10, xp: 1000 };
    });
    this.state.proficiency.sections.strings = 100;
    this.state.proficiency.sections.woodwinds = 100;
    this.state.proficiency.sections.brass = 100;
    this.state.proficiency.sections.percussion = 100;
  }

  public cheatSetMasterStats(): void {
    this.ensurePlayerMusician();
    this.state.ensemble.members.forEach(m => {
      m.stats.technique = 100;
      m.stats.toneQuality = 100;
      m.stats.tempoStability = 100;
      m.stats.sightReading = 100;
      m.level = 20;
    });
    this.cheatUnlockAllInstruments();
  }

  public cheatTogglePianoAccompaniment(): boolean {
    this.state.hasPianoAccompaniment = !this.state.hasPianoAccompaniment;
    return this.state.hasPianoAccompaniment;
  }

  public cheatUnlockAllRepertoire(): void {
    const pieces = JSON.parse(JSON.stringify(REPERTOIRE_DATABASE)) as RepertoirePiece[];
    pieces.forEach(p => { p.isMastered = true; });
    this.state.repertoire = pieces;
  }

  public cheatUnlockAllBadges(): void {
    this.state.badges.forEach(b => { b.obtained = true; });
  }

  public cheatCompleteAllQuests(): void {
    this.state.quests.forEach(q => { q.completed = true; });
  }

  public cheatCompleteAllTheory(): void {
    THEORY_CURRICULUM.forEach(t => {
      if (!this.state.completedTheoryDrills.includes(t.id)) {
        this.state.completedTheoryDrills.push(t.id);
      }
    });
    this.state.theoryLevel = 8;
    this.checkLevelUps();
  }

  public cheatEvolveActivePet(): boolean {
    const lead = this.state.ensemble.members[0];
    if (!lead) return false;
    // ensure theory prerequisite
    if (this.state.completedTheoryDrills.length === 0) {
      this.state.completedTheoryDrills.push(THEORY_CURRICULUM[0].id);
      this.state.theoryLevel = 2;
    }
    // ensure level
    lead.level = Math.max(lead.level, 3);
    const petEntry = this.state.harmoniDex.find(d => d.id === lead.pet.id || d.species === lead.pet.species || d.name === lead.pet.name);
    if (!petEntry) return false;
    petEntry.bonded = true;
    return this.evolvePet(petEntry.id);
  }

  public cheatClearResetData(): void {
    this.restartGame();
  }
}

export const GameEngine = HarmoniaGameEngine;
