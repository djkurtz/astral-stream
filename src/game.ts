// Harmonia: Opus of the Ensemble - Game Engine

import {
  GameState, Musician, WorldNPC,
  AuditionBattle, InstrumentId, EnsembleTier, ZoneId
} from './types';
import {
  STARTER_OPTIONS, REPERTOIRE_DATABASE,
  RIVAL_ENSEMBLES, WORLD_ZONES, INITIAL_WORLD_NPCS, BATTLE_MOVES,
  INSTRUMENT_ARTIFACTS, INITIAL_LOST_SCORES, INITIAL_INSPIRATION_VISTAS, INITIAL_GAME_QUESTS,
  INITIAL_HARMONIDEX, CLEF_BADGES
} from './data';
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
      practiceSession: null,
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
    const bpm = 100;
    const duration = 15; // 15 second drill

    const notes: any[] = [];
    // Generate rhythmic target notes every 2 beats
    for (let t = 2.0; t < duration - 1.0; t += (60 / bpm) * 2) {
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
      instrumentId: lead.instrumentId,
      duration,
      elapsedTime: 0,
      bpm,
      notes,
      score: 0,
      combo: 0,
      maxCombo: 0,
      feedbackText: 'Get Ready to Play!',
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

    const gain = Math.max(1, Math.floor(session.score / 200));
    lead.stats[stat] = Math.min(100, lead.stats[stat] + gain);
    lead.xp += session.score;

    session.statGained = { stat, amount: gain };
    soundEngine.playFanfare();

    this.showDialogue('Practice Complete!', '✨', [
      `Practice session concluded! Final Score: ${Math.floor(session.score)} (Max Combo: ${session.maxCombo}).`,
      `${lead.name}'s ${stat.toUpperCase()} increased by +${gain}! (${lead.stats[stat]}/100). Keep practicing to master your repertoire!`
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
      harmonyPoints: 50,
      maxHarmonyPoints: 100,
      turn: 'player',
      turnTimer: 0,
      log: [
        `Audition Duel started against ${opponent.name} (${opponent.instrumentName})!`,
        `Fill the Harmony Meter to 100% to convince ${opponent.name} to join your ensemble!`
      ],
      selectedMoveIndex: 0,
      concluded: false
    };

    this.state.mode = 'audition_battle';
  }

  public executeBattleMove(moveKey: string): void {
    const battle = this.state.auditionBattle;
    if (!battle || battle.turn !== 'player' || battle.concluded) return;

    const move = BATTLE_MOVES[moveKey] || Object.values(BATTLE_MOVES)[0];
    const player = this.state.ensemble.members[0];

    if (battle.harmonyPoints < move.harmonyCost) {
      battle.log.push("Not enough Harmony Points for this technique!");
      return;
    }

    battle.harmonyPoints -= move.harmonyCost;
    const power = move.power + Math.floor(player.stats.toneQuality / 5);
    battle.playerHarmonyMeter = Math.min(100, battle.playerHarmonyMeter + power);
    battle.log.push(`${player.name} performed [${move.name}]! Harmony surged +${power}%.`);

    soundEngine.playInstrumentNote(player.instrumentId, 523.25, 0.4, 0.9);

    if (battle.playerHarmonyMeter >= 100) {
      this.resolveBattleVictory(battle);
      return;
    }

    // Opponent turn
    battle.turn = 'opponent';
    setTimeout(() => {
      if (!this.state.auditionBattle || this.state.auditionBattle.concluded) return;
      this.executeOpponentTurn();
    }, 800);
  }

  private executeOpponentTurn(): void {
    const battle = this.state.auditionBattle;
    if (!battle || battle.concluded) return;

    const opp = battle.opponent;
    const oppPower = 15 + Math.floor(opp.stats.toneQuality / 8);
    battle.opponentHarmonyMeter = Math.min(100, battle.opponentHarmonyMeter + oppPower);
    battle.log.push(`${opp.name} countered with an acoustic flourish (+${oppPower}% opponent resonance)!`);

    soundEngine.playInstrumentNote(opp.instrumentId, 440, 0.4, 0.8);
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

      // Update dynamic BGM section layering
      const activeSections = Array.from(new Set(this.state.ensemble.members.map(m => m.section)));
      soundEngine.startBGM(this.state.currentZone, activeSections);
    }

    soundEngine.playFanfare();
    this.showDialogue('Audition Triumphant!', '🎉', [
      `Splendid performance! ${recruited.name} and ${recruited.pet.name} (${recruited.pet.species}) are deeply moved by your musicianship! (+100 Notes ♪, +15 Sparks ✨)`,
      `${recruited.name} joined your ensemble! Your ensemble is now a [${this.state.ensemble.tier.toUpperCase()}]!`,
      "Check your Repertoire binder to see which multi-part pieces you can now perform!"
    ], () => {
      this.state.mode = 'exploration';
      this.state.auditionBattle = null;
    });
  }

  /* ---------------- WILD HARMONIPET BONDING (POKEMON-STYLE CATCHING) ---------------- */

  public startHarmonizeEncounter(npc: WorldNPC): void {
    if (!npc.wildPetData) return;
    const pet = npc.wildPetData;
    const targetMelody = [261.63, 329.63, 392.00, 523.25]; // C E G C
    this.state.harmonizeEncounter = {
      pet,
      instrumentId: (npc.wildPetData.section === 'strings' ? 'acoustic_guitar' : (npc.wildPetData.section === 'woodwinds' ? 'oboe' : (npc.wildPetData.section === 'brass' ? 'french_horn' : 'marimba'))) as InstrumentId,
      targetMelody,
      playerInputs: [],
      resonanceMeter: 20,
      catchThreshold: 80,
      attemptsRemaining: 4,
      concluded: false,
      caught: false
    };
    this.state.mode = 'harmonize_wild';
    soundEngine.playInstrumentNote(this.state.ensemble.members[0].instrumentId, 440, 0.4, 0.8);
  }

  public playHarmonizeNote(noteIndex: number = 0): void {
    const enc = this.state.harmonizeEncounter;
    if (!enc || enc.concluded) return;

    enc.attemptsRemaining--;
    const player = this.state.ensemble.members[0];
    const targetFreq = enc.targetMelody[noteIndex % enc.targetMelody.length];
    enc.playerInputs.push(targetFreq);

    // Play feedback tone
    soundEngine.playInstrumentNote(player.instrumentId, targetFreq, 0.3, 0.8);

    // Evaluate accuracy & boost resonance
    const resonanceGain = Math.floor(25 + (player.stats.technique + player.stats.toneQuality) / 8);
    enc.resonanceMeter = Math.min(100, enc.resonanceMeter + resonanceGain);

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
      concluded: false
    };

    this.state.mode = 'competition';
  }

  public advanceConcertPerformance(): void {
    const comp = this.state.competition;
    if (!comp || comp.concluded) return;

    comp.currentMeasure++;
    const ensemblePower = this.state.ensemble.members.reduce((acc, m) => acc + (m.stats.technique + m.stats.toneQuality), 0);
    const rivalPower = comp.rival.members.reduce((acc, m) => acc + (m.stats.technique + m.stats.toneQuality), 0);
    const measureScore = Math.floor(ensemblePower / 2 + 10);
    const rivalMeasureScore = Math.floor(rivalPower / 2 + 5);
    comp.playerScore += measureScore;
    comp.rivalScore += rivalMeasureScore;

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

    // Bounds check
    if (x < 60 || x > zone.width - 60 || y < 60 || y > zone.height - 60) return true;

    for (const obs of zone.obstacles) {
      if (obs.type === 'box' && obs.w && obs.h) {
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
      this.startConcertCompetition();
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

    if (target.actionType === 'luthier_shop') {
      const lead = this.state.ensemble.members[0];
      const availArtifact = this.state.artifacts.find(a => a.section === lead.section && !a.equipped);
      if (availArtifact && this.state.wallet.gold >= availArtifact.costGold && this.state.wallet.inspirationSparks >= availArtifact.costSparks) {
        this.state.wallet.gold -= availArtifact.costGold;
        this.state.wallet.inspirationSparks -= availArtifact.costSparks;
        availArtifact.equipped = true;
        lead.stats.technique = Math.min(100, lead.stats.technique + availArtifact.bonusTechnique);
        lead.stats.toneQuality = Math.min(100, lead.stats.toneQuality + availArtifact.bonusTone);
        lead.stats.tempoStability = Math.min(100, lead.stats.tempoStability + availArtifact.bonusTempo);
        soundEngine.playFanfare();
        this.showDialogue('Master Luthier Marco', '🔨', [
          `Splendid! I have forged the [${availArtifact.name}] for your ${lead.instrumentName}!`,
          `Bonus: +${availArtifact.bonusTechnique} TEC, +${availArtifact.bonusTone} TON, +${availArtifact.bonusTempo} TEM!`,
          `Special Trait Awakened: [${availArtifact.traitName}] - ${availArtifact.traitDescription}`
        ]);
        return;
      }
      this.showDialogue('Master Luthier Marco', '🔨', [
        "Welcome to the Forge! Bring me Notes (♪) and Inspiration Sparks (✨) to craft signature instrument artifacts and ascend your tone!"
      ]);
      return;
    }

    if (target.actionType === 'wild_harmonipet') {
      this.startHarmonizeEncounter(target);
      return;
    }

    this.showDialogue(target.name, '💬', target.dialogue);
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
}

export const GameEngine = HarmoniaGameEngine;
