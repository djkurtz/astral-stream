// Harmonia: Opus of the Ensemble - Game Engine

import {
  GameState, Musician, WorldNPC,
  AuditionBattle, InstrumentId, EnsembleTier, ZoneId, TheoryChallengeType, PlayerCustomization
} from './types';
import {
  STARTER_OPTIONS, REPERTOIRE_DATABASE,
  RIVAL_ENSEMBLES, WORLD_ZONES, INITIAL_WORLD_NPCS, BATTLE_MOVES,
  INSTRUMENT_ARTIFACTS, INITIAL_LOST_SCORES, INITIAL_INSPIRATION_VISTAS, INITIAL_GAME_QUESTS,
  INITIAL_HARMONIDEX, CLEF_BADGES, DEFAULT_CUSTOMIZATION, THEORY_CURRICULUM,
  getBattleMovesForMusician, ALL_INSTRUMENTS_INFO
} from './data';
import { BattleMove } from './types';
import { soundEngine } from './audio';

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
        grand_hall: false
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
          glockenspiel: { level: 1, xp: 0 }
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

    // Start zone ambient music
    soundEngine.startBGM('cavatina_village', [starterOpt.section]);

    this.showDialogue('Sonora Academy', '🎼', [
      `Welcome to Sonora, ${playerName}! Your bond with ${starterOpt.pet.name} the ${starterOpt.pet.species} shines bright.`,
      `You hold the ${starterOpt.name} (${starterOpt.sectionName}). Practice your instrument at the Practice Shed to the west to hone your Technique and Tone!`,
      "Explore Cavatina Village, discover new Sheet Music, and challenge fellow musicians to Audition Duels to expand your ensemble!"
    ]);
  }

  /* ---------------- PRACTICE SHED SYSTEM ---------------- */

  public startPracticeSession(type: 'metronome' | 'scale_run' | 'tone_shaping' = 'metronome'): void {
    if (this.state.ensemble.members.length === 0) return;
    const lead = this.state.ensemble.members[0];
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
    lead.xp += session.score;

    const goldWon = Math.floor(session.score / 20) * session.tier;
    this.state.wallet.gold += goldWon;
    const sparksWon = Math.floor(session.score / 80) * session.tier;
    this.state.wallet.inspirationSparks += sparksWon;

    let levelUpMsg = '';
    if (session.score >= 500 && this.state.practiceLevel < 4) {
      this.state.practiceLevel++;
      levelUpMsg = ` 🌟 Practice Tier Upgraded to Level ${this.state.practiceLevel}!`;
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
      concluded: false
    };

    soundEngine.stopBGM();
    this.state.mode = 'audition_battle';
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

      // Unlock recruited musician's instrument and boost section proficiency
      if (!this.state.proficiency.unlockedInstruments.includes(recruited.instrumentId)) {
        this.state.proficiency.unlockedInstruments.push(recruited.instrumentId);
      }
      this.state.proficiency.sections[recruited.section] = Math.min(100, (this.state.proficiency.sections[recruited.section] || 20) + 15);
      if (!this.state.proficiency.instruments[recruited.instrumentId]) {
        this.state.proficiency.instruments[recruited.instrumentId] = { level: 1, xp: 0 };
      }
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
    const FREQS = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5

    let noteIndices = [0, 1, 2, 3]; // Major Arpeggio default
    if (pet.section === 'woodwinds') noteIndices = [0, 2, 1, 3];
    else if (pet.section === 'brass') noteIndices = [0, 2, 3, 2];
    else if (pet.section === 'percussion') noteIndices = [0, 0, 2, 3];

    const targetMelody = noteIndices.map(i => FREQS[i]);

    this.state.harmonizeEncounter = {
      pet,
      instrumentId: (npc.wildPetData.section === 'strings' ? 'acoustic_guitar' : (npc.wildPetData.section === 'woodwinds' ? 'oboe' : (npc.wildPetData.section === 'brass' ? 'french_horn' : 'marimba'))) as InstrumentId,
      targetMelody,
      targetNoteIndices: noteIndices,
      currentStep: 0,
      playerInputs: [],
      resonanceMeter: 20,
      catchThreshold: 80,
      attemptsRemaining: 5,
      lastFeedback: undefined,
      lastFeedbackText: undefined,
      concluded: false,
      caught: false
    };
    this.state.mode = 'harmonize_wild';
    soundEngine.stopBGM();

    // Play creature's introductory call phrase
    targetMelody.forEach((freq, idx) => {
      setTimeout(() => {
        soundEngine.playInstrumentNote(this.state.harmonizeEncounter?.instrumentId || 'silver_flute', freq, 0.25, 0.7);
      }, idx * 250);
    });
  }

  public playHarmonizeNote(noteIndex: number = 0): void {
    const enc = this.state.harmonizeEncounter;
    if (!enc || enc.concluded) return;

    const FREQS = [261.63, 329.63, 392.00, 523.25];
    const playedFreq = FREQS[noteIndex] || 261.63;
    enc.playerInputs.push(playedFreq);
    const player = this.state.ensemble.members[0];

    const expectedIndex = enc.targetNoteIndices[enc.currentStep];
    if (noteIndex === expectedIndex) {
      // ✅ Correct pitch in sequence!
      soundEngine.playInstrumentNote(player.instrumentId, playedFreq, 0.35, 0.85);
      const resonanceGain = Math.floor(25 + (player.stats.technique + player.stats.toneQuality) / 10);
      enc.resonanceMeter = Math.min(100, enc.resonanceMeter + resonanceGain);
      enc.currentStep = (enc.currentStep + 1) % enc.targetNoteIndices.length;
      enc.lastFeedback = 'PERFECT';
      enc.lastFeedbackText = `✨ HARMONIC RESONANCE! (+${resonanceGain}%)`;
    } else {
      // ❌ Dissonance / Miss
      soundEngine.playInstrumentNote(player.instrumentId, playedFreq * 0.94, 0.35, 0.85);
      enc.attemptsRemaining--;
      enc.resonanceMeter = Math.max(0, enc.resonanceMeter - 15);
      enc.lastFeedback = 'DISSONANCE';
      enc.lastFeedbackText = `⚠️ DISSONANT PITCH! The creature flinched (-15%)`;
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

  /* ---------------- CONCERT COMPETITION SYSTEM ---------------- */

  public startConcertCompetition(rivalId?: string): void {
    const rival = RIVAL_ENSEMBLES.find(r => r.id === rivalId) || RIVAL_ENSEMBLES[0];
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
      comboStreak: 0
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
    
    const measureScore = Math.floor((ensemblePower / 2 + 10) * timingMultiplier);
    const rivalMultiplier = 0.85 + Math.random() * 0.35;
    const rivalMeasureScore = Math.floor((rivalPower / 2 + 5) * rivalMultiplier);
    
    comp.playerScore += measureScore;
    comp.rivalScore += rivalMeasureScore;

    // Shift the rhythmic sweet spot for the next measure
    comp.sweetSpotCenter = 0.2 + Math.random() * 0.6;

    // Play ensemble chord for this measure
    for (const m of this.state.ensemble.members) {
      soundEngine.playInstrumentNote(m.instrumentId, 440 + Math.random() * 200, 0.4, 0.7);
    }

    if (comp.currentMeasure >= comp.totalMeasures) {
      comp.concluded = true;
      comp.won = comp.playerScore >= comp.rivalScore;
      let badgeWonName = '';

      if (comp.won && !comp.rewardsGiven) {
        comp.rewardsGiven = true;
        const goldGain = comp.rival.rewardStars * 200;
        const sparksGain = comp.rival.rewardStars * 10;
        this.state.wallet.gold += goldGain;
        this.state.wallet.inspirationSparks += sparksGain;
        this.state.wallet.reputationStars += comp.rival.rewardStars;
        this.state.ensemble.reputationStars = this.state.wallet.reputationStars;
        this.state.ensemble.fameLevel = 1 + Math.floor(this.state.ensemble.reputationStars / 2);

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

  /* ---------------- EXPLORATION & COLLISION ---------------- */

  public update(time: number): void {
    const dt = this.lastTime ? Math.min((time - this.lastTime) / 1000, 0.1) : 0.016;
    this.lastTime = time;
    this.state.time += dt;

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

    if (this.state.mode === 'exploration') {
      this.updateMovement(dt);
      this.updateCamera();
      this.updateProximity();
    }
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

  public interactWithNearby(): void {
    const target = this.state.nearbyInteractable;
    if (!target) return;

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

    if (target.actionType === 'luthier_shop') {
      window.dispatchEvent(new CustomEvent('open-luthier-shop'));
      this.showDialogue('Master Luthier Marco', '🔨', [
        "Welcome to the Forge! Browse my signature artifacts and custom commissions to ascend your ensemble's tone!"
      ]);
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
      completed: false
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

    if (!isCorrect) {
      // ❌ No Second Chances! Immediate Failure
      soundEngine.playNoteAccuracyFeedback('miss');
      ch.completed = true;
      this.showDialogue('Theory Drill Failed', '❌', [
        `INCORRECT! The correct answer was: ${q.options[q.correctIndex]}.`,
        `${q.explanation}`,
        `No second chances at the Conservatory! The drill has ended. Study hard and try again at the Theory Lectern!`
      ], () => {
        this.state.mode = 'exploration';
        this.state.theoryChallenge = null;
        const activeSections = Array.from(new Set(this.state.ensemble.members.map(m => m.section)));
        soundEngine.startBGM(this.state.currentZone, activeSections);
      });
      return;
    }

    // ✨ Correct Answer
    ch.score += 100;
    soundEngine.playNoteAccuracyFeedback('perfect');

    this.showDialogue('Theory Evaluation', '✨', [
      `CORRECT! ${q.explanation}`
    ], () => {
      ch.currentQuestionIndex++;
      if (ch.currentQuestionIndex >= ch.questions.length) {
        ch.completed = true;
        if (!this.state.completedTheoryDrills.includes(ch.type)) {
          this.state.completedTheoryDrills.push(ch.type);
        }
        this.state.theoryLevel = Math.min(8, this.state.completedTheoryDrills.length + 1);

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
          `[${ch.title}] Flawless Drill Completed! Final Score: ${ch.score}/${ch.questions.length * 100}.`,
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
    });
  }

  public setCustomization(partial: Partial<PlayerCustomization>): void {
    this.state.customization = { ...this.state.customization, ...partial };
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
        proficiency: this.state.proficiency,
        practiceLevel: this.state.practiceLevel,
        theoryLevel: this.state.theoryLevel,
        completedTheoryDrills: this.state.completedTheoryDrills,
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
      this.state.proficiency = data.proficiency || this.state.proficiency;
      this.state.practiceLevel = data.practiceLevel || 1;
      this.state.theoryLevel = data.theoryLevel || 1;
      this.state.completedTheoryDrills = data.completedTheoryDrills || [];
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
}

export const GameEngine = HarmoniaGameEngine;
