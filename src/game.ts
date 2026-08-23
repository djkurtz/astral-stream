import { soundEngine } from './audio';
import { BOSS_SIGNAL_OVERLORD, FUSED_CHIMERA, JAX_SPIRIT, RIVAL_JAX, STARTER_SPIRIT, TOWN_NPCS, TOWN_SOUND_RIPPLES } from './data';
import { GameState, Move, NPCEntity, SoundRipple } from './types';

export class AstralGameEngine {
  private state: GameState;
  private lastTick: number = 0;
  private keysDown: Set<string> = new Set();

  constructor() {
    this.state = this.createInitialState();
    this.setupInputHandlers();
  }

  public getState(): GameState {
    return this.state;
  }

  private createInitialState(): GameState {
    return {
      mode: 'intro',
      zoneClean: true,
      player: {
        x: 400,
        y: 460,
        dir: 'up',
        isMoving: false
      },
      npcs: JSON.parse(JSON.stringify(TOWN_NPCS)),
      soundRipples: JSON.parse(JSON.stringify(TOWN_SOUND_RIPPLES)),
      activeCompanion: null,
      streamQueue: [JSON.parse(JSON.stringify(STARTER_SPIRIT))],
      activeSpiritIndex: 0,
      nearbyInteractable: null,
      audioMatch: null,
      battle: null,
      dialogue: {
        speaker: 'Aria & Chime-Cat',
        avatar: '☕',
        text: [
          "Welcome to Cadence Plaza! 🎶 Music streams through every corner of our town.",
          "Use [W, A, S, D] or Arrow Keys to walk around and explore the plaza.",
          "Talk to locals, scan mysterious sound ripples, and visit the Glitch Gate when you're ready to duel!"
        ],
        index: 0
      },
      time: 0,
      glitchActive: false,
      cleansingProgress: 0
    };
  }

  private setupInputHandlers(): void {
    window.addEventListener('keydown', (e) => {
      this.keysDown.add(e.code);

      // Interaction Key (Space or E or Enter)
      if (e.code === 'Space' || e.code === 'KeyE' || e.code === 'Enter') {
        if (this.state.dialogue) {
          this.advanceDialogue();
        } else if (this.state.mode === 'battle' && this.state.battle?.turn === 'rhythm_timing') {
          this.resolveRhythmHit();
        } else if (this.state.mode === 'exploration' && this.state.nearbyInteractable) {
          this.interactWithNearby();
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keysDown.delete(e.code);
    });
  }

  public update(now: number): void {
    if (this.lastTick === 0) {
      this.lastTick = now;
      return;
    }
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    this.state.time += dt;

    // Exploration Movement & Proximity
    if (this.state.mode === 'exploration') {
      this.updatePlayerMovement(dt);
      this.updateProximity();
    }

    // Rhythm Timing Bar Animation
    if (this.state.mode === 'battle' && this.state.battle?.turn === 'rhythm_timing') {
      const b = this.state.battle;
      b.rhythmCursor += b.rhythmSpeed * dt;
      if (b.rhythmCursor > 1.0) {
        b.rhythmCursor = 0; // Loop cursor
      }
    }

    // 3-Stage Audio Match Update
    if (this.state.mode === 'audio_match_scan' && this.state.audioMatch) {
      const match = this.state.audioMatch;
      if (match.stage === 1) {
        if (Math.abs(match.playerFreq - match.targetFreq) < 7) {
          match.holdTime += dt;
          if (match.holdTime >= 1.2) {
            soundEngine.playSuccessDing();
            match.stage = 2;
            match.holdTime = 0;
            this.playMelodyDemo();
          }
        } else {
          match.holdTime = Math.max(0, match.holdTime - dt * 2);
        }
      } else if (match.stage === 3 && !match.isComplete) {
        match.pulseRadius += dt * 140;
        if (match.pulseRadius > 150) {
          match.pulseRadius = 0;
        }
      }
    }

    // Cleansing Cinematic Progress
    if (this.state.mode === 'cleansing_cinematic') {
      this.state.cleansingProgress += dt * 0.5;
      if (this.state.cleansingProgress >= 1.0) {
        this.state.mode = 'victory';
        this.state.zoneClean = true;
        this.state.glitchActive = false;
        soundEngine.setWarped(false);
        soundEngine.switchTrack('town');
        soundEngine.playCleansingBloom();
        this.showDialogue('Jax & Aria', '🎉', [
          "WE DID IT! Look at Cadence Plaza... the entire static rift has dissolved!",
          "High-definition stereo melodies and vibrant colors have completely restored the shoreline!",
          "Thank you for exploring and rocking the Astral Stream demo!"
        ]);
      }
    }
  }

  /* ---------------- EXPLORATION & MOVEMENT ---------------- */
  private updatePlayerMovement(dt: number): void {
    const speed = 160 * dt;
    let dx = 0;
    let dy = 0;

    if (this.keysDown.has('KeyW') || this.keysDown.has('ArrowUp')) { dy -= speed; this.state.player.dir = 'up'; }
    if (this.keysDown.has('KeyS') || this.keysDown.has('ArrowDown')) { dy += speed; this.state.player.dir = 'down'; }
    if (this.keysDown.has('KeyA') || this.keysDown.has('ArrowLeft')) { dx -= speed; this.state.player.dir = 'left'; }
    if (this.keysDown.has('KeyD') || this.keysDown.has('ArrowRight')) { dx += speed; this.state.player.dir = 'right'; }

    this.state.player.isMoving = (dx !== 0 || dy !== 0);

    // Bounding Box (Canvas area clamp)
    const newX = Math.max(110, Math.min(690, this.state.player.x + dx));
    const newY = Math.max(90, Math.min(520, this.state.player.y + dy));

    // Collision with Buildings & Fountain
    if (!this.checkBuildingCollision(newX, newY)) {
      this.state.player.x = newX;
      this.state.player.y = newY;
    }
  }

  private checkBuildingCollision(x: number, y: number): boolean {
    // Cafe (110, 90, 160, 110)
    if (x > 90 && x < 280 && y > 70 && y < 210) return true;
    // Vinyl Den (530, 90, 160, 110)
    if (x > 510 && x < 700 && y > 70 && y < 210) return true;
    // Fountain (400, 330, radius 38)
    const distToFountain = Math.hypot(x - 400, y - 330);
    if (distToFountain < 42) return true;

    return false;
  }

  private updateProximity(): void {
    const px = this.state.player.x;
    const py = this.state.player.y;
    let closest: NPCEntity | SoundRipple | null = null;
    let minDist = 65;

    // Check NPCs
    for (const npc of this.state.npcs) {
      const d = Math.hypot(px - npc.x, py - npc.y);
      if (d < minDist) {
        minDist = d;
        closest = npc;
      }
    }

    // Check Sound Ripples
    for (const rip of this.state.soundRipples) {
      if (!rip.discovered) {
        const d = Math.hypot(px - rip.x, py - rip.y);
        if (d < minDist) {
          minDist = d;
          closest = rip;
        }
      }
    }

    this.state.nearbyInteractable = closest;
  }

  public interactWithNearby(): void {
    const target = this.state.nearbyInteractable;
    if (!target) return;

    if ('dialogue' in target) {
      // NPC
      const npc = target as NPCEntity;
      if (npc.actionType === 'battle_jax') {
        this.showDialogue(npc.name, '🎸', npc.dialogue, () => {
          this.startBattle('rival');
        });
      } else {
        this.showDialogue(npc.name, npc.sprite === 'aria' ? '☕' : '💽', npc.dialogue);
      }
    } else {
      // Sound Ripple
      const rip = target as SoundRipple;
      this.startAudioMatchScan(rip);
    }
  }

  /* ---------------- DIALOGUE SYSTEM ---------------- */
  public advanceDialogue(): void {
    if (!this.state.dialogue) return;
    soundEngine.playTone(520, 'sine', 0.05, 0.05);

    if (this.state.dialogue.index < this.state.dialogue.text.length - 1) {
      this.state.dialogue.index++;
    } else {
      const onComplete = this.state.dialogue.onComplete;
      this.state.dialogue = null;
      if (onComplete) {
        onComplete();
      } else if (this.state.mode === 'intro') {
        this.state.mode = 'exploration';
        soundEngine.switchTrack('town');
      }
    }
  }

  public showDialogue(speaker: string, avatar: string, text: string[], onComplete?: () => void): void {
    this.state.dialogue = { speaker, avatar, text, index: 0, onComplete };
  }

  /* ---------------- 3-STAGE AUDIO MATCH SCANNER ---------------- */
  public startAudioMatchScan(ripple: SoundRipple): void {
    this.state.mode = 'audio_match_scan';
    this.state.audioMatch = {
      stage: 1,
      spiritToUnlock: JSON.parse(JSON.stringify(ripple.spirit)),
      isComplete: false,
      targetFreq: 65,
      playerFreq: 15,
      holdTime: 0,
      melodySequence: [0, 2, 1, 2], // Low, High, Mid, High
      playerSequence: [],
      activeDemoNote: null,
      isListeningToPlayer: false,
      pulseRadius: 0,
      targetRadius: 110,
      combo: 0,
      feedback: null
    };
  }

  public setPlayerFrequency(val: number): void {
    const match = this.state.audioMatch;
    if (!match || match.stage !== 1) return;
    match.playerFreq = val;
    soundEngine.playTone(200 + val * 5, 'sine', 0.04, 0.04);
  }

  public playMelodyDemo(): void {
    const match = this.state.audioMatch;
    if (!match || match.stage !== 2) return;

    match.playerSequence = [];
    match.isListeningToPlayer = false;

    match.melodySequence.forEach((note, idx) => {
      setTimeout(() => {
        if (this.state.audioMatch?.stage === 2) {
          this.state.audioMatch.activeDemoNote = note;
          soundEngine.playPadTone(note);
          setTimeout(() => {
            if (this.state.audioMatch) this.state.audioMatch.activeDemoNote = null;
          }, 250);
        }
      }, idx * 500 + 400);
    });

    setTimeout(() => {
      if (this.state.audioMatch?.stage === 2) {
        this.state.audioMatch.isListeningToPlayer = true;
      }
    }, match.melodySequence.length * 500 + 600);
  }

  public inputMelodyPad(padIndex: number): void {
    const match = this.state.audioMatch;
    if (!match || match.stage !== 2 || !match.isListeningToPlayer) return;

    soundEngine.playPadTone(padIndex);
    match.playerSequence.push(padIndex);

    const curStep = match.playerSequence.length - 1;
    if (match.playerSequence[curStep] !== match.melodySequence[curStep]) {
      soundEngine.playTone(120, 'sawtooth', 0.3, 0.15);
      match.playerSequence = [];
      setTimeout(() => this.playMelodyDemo(), 600);
      return;
    }

    if (match.playerSequence.length === match.melodySequence.length) {
      soundEngine.playSuccessDing();
      match.stage = 3;
      match.combo = 0;
      match.pulseRadius = 0;
      match.feedback = "Stage 2 Cleared! Hit on the beat!";
    }
  }

  public hitRhythmPulse(): void {
    const match = this.state.audioMatch;
    if (!match || match.stage !== 3 || match.isComplete) return;

    const diff = Math.abs(match.pulseRadius - match.targetRadius);
    if (diff < 18) {
      match.combo++;
      match.feedback = `✨ ON BEAT! (${match.combo}/3) ✨`;
      soundEngine.playRhythmHit('PERFECT');

      if (match.combo >= 3) {
        this.completeAudioMatch();
      }
    } else {
      match.combo = Math.max(0, match.combo - 1);
      match.feedback = '❌ OFF BEAT! Try again';
      soundEngine.playRhythmHit('MISS');
    }
  }

  public completeAudioMatch(): void {
    const match = this.state.audioMatch;
    if (!match || match.isComplete) return;

    match.isComplete = true;
    soundEngine.playLockChime();

    setTimeout(() => {
      const unlocked = match.spiritToUnlock;
      this.state.streamQueue.push(unlocked);
      const rip = this.state.soundRipples.find(r => r.spirit.id === unlocked.id);
      if (rip) rip.discovered = true;

      this.state.audioMatch = null;
      this.state.mode = 'exploration';
      this.showDialogue(unlocked.name, '🎷', [
        `🎉 100% AUDIO MATCH VERIFIED! Streamed: ${unlocked.name} [${unlocked.vibeTag}]!`,
        "Its golden saxophone riffs have joined your active playlist!"
      ]);
    }, 1200);
  }

  /* ---------------- BATTLE & RHYTHM TIMING SYSTEM ---------------- */
  public startBattle(type: 'rival' | 'boss'): void {
    this.state.mode = 'battle';
    soundEngine.switchTrack('battle');
    const playerSpirit = JSON.parse(JSON.stringify(this.state.streamQueue[0] || STARTER_SPIRIT));

    if (type === 'rival') {
      this.state.battle = {
        type: 'rival',
        playerSpirit,
        enemySpirit: JSON.parse(JSON.stringify(JAX_SPIRIT)),
        turn: 'player',
        pendingMoveIndex: null,
        rhythmCursor: 0,
        rhythmSpeed: 1.4,
        targetWindowStart: 0.40,
        targetWindowEnd: 0.65,
        rhythmResult: null,
        log: `${RIVAL_JAX.name} dropped into battle with Bass-Hound! Pick a move!`,
        canBlend: false,
        blendActive: false
      };
    } else {
      this.state.battle = {
        type: 'boss',
        playerSpirit,
        enemyBoss: JSON.parse(JSON.stringify(BOSS_SIGNAL_OVERLORD)),
        turn: 'player',
        pendingMoveIndex: null,
        rhythmCursor: 0,
        rhythmSpeed: 1.6,
        targetWindowStart: 0.38,
        targetWindowEnd: 0.62,
        rhythmResult: null,
        log: `DEAD CHANNEL 000 hijacked the feed! Time your hits to pierce the static!`,
        canBlend: !!this.state.activeCompanion,
        blendActive: false
      };
    }
  }

  public initiatePlayerMove(moveIndex: number): void {
    const b = this.state.battle;
    if (!b || b.turn !== 'player') return;

    b.pendingMoveIndex = moveIndex;
    b.turn = 'rhythm_timing';
    b.rhythmCursor = 0;
    b.rhythmResult = null;
    b.log = `Sync your attack! Hit [SPACE] or Click in the green target zone!`;
  }

  public resolveRhythmHit(): void {
    const b = this.state.battle;
    if (!b || b.turn !== 'rhythm_timing' || b.pendingMoveIndex === null) return;

    const cur = b.rhythmCursor;
    let grade: 'PERFECT' | 'GREAT' | 'MISS' = 'MISS';
    let multiplier = 0.5;

    if (cur >= b.targetWindowStart && cur <= b.targetWindowEnd) {
      // Target Center is (start + end)/2
      const center = (b.targetWindowStart + b.targetWindowEnd) / 2;
      if (Math.abs(cur - center) < 0.06) {
        grade = 'PERFECT';
        multiplier = 1.5;
        b.playerSpirit.energy = Math.min(100, b.playerSpirit.energy + 10);
      } else {
        grade = 'GREAT';
        multiplier = 1.0;
      }
    }

    b.rhythmResult = grade;
    soundEngine.playRhythmHit(grade);

    const move = b.playerSpirit.moves[b.pendingMoveIndex];
    b.turn = 'animating';

    // Genre Affinity Multiplier
    let genreMult = 1.0;
    const eType = b.type === 'rival' ? b.enemySpirit?.type : b.enemyBoss?.type;
    if (move.type === 'synth' && eType === 'bass') genreMult = 1.4;
    if (move.type === 'brass' && eType === 'synth') genreMult = 1.4;
    if (move.type === 'bass' && eType === 'brass') genreMult = 1.4;
    if (move.type === 'cosmic' && eType === 'static') genreMult = 1.6;

    const totalDmg = Math.max(8, Math.floor((move.power + b.playerSpirit.attack * 0.4) * multiplier * genreMult));

    soundEngine.playMoveSound(move.soundType);

    setTimeout(() => {
      if (b.type === 'rival' && b.enemySpirit) {
        b.enemySpirit.hp = Math.max(0, b.enemySpirit.hp - totalDmg);
        b.log = `[${grade} SYNC!] ${b.playerSpirit.name} landed ${move.name} for ${totalDmg} damage!`;
        if (b.enemySpirit.hp <= 0) {
          setTimeout(() => this.handleBattleVictory(), 1000);
          return;
        }
      } else if (b.type === 'boss' && b.enemyBoss) {
        b.enemyBoss.hp = Math.max(0, b.enemyBoss.hp - totalDmg);
        b.log = `[${grade} SYNC!] ${b.playerSpirit.name} smashed the Core for ${totalDmg} damage!`;
        if (b.enemyBoss.hp <= 0) {
          setTimeout(() => this.handleBattleVictory(), 1000);
          return;
        }
      }

      setTimeout(() => this.executeEnemyTurn(), 1200);
    }, 600);
  }

  public triggerPlaylistBlend(): void {
    const b = this.state.battle;
    if (!b || !b.canBlend || b.blendActive) return;

    soundEngine.playCleansingBloom();
    b.blendActive = true;
    b.playerSpirit = JSON.parse(JSON.stringify(FUSED_CHIMERA));
    b.log = `🌟 COLLABORATIVE PLAYLIST BLEND! Fused into Cyber-Fuzz Chimera!`;
  }

  private executeEnemyTurn(): void {
    const b = this.state.battle;
    if (!b) return;

    let enemyName = '';
    let move: Move;

    if (b.type === 'rival' && b.enemySpirit) {
      enemyName = b.enemySpirit.name;
      move = b.enemySpirit.moves[Math.floor(Math.random() * b.enemySpirit.moves.length)];
    } else if (b.type === 'boss' && b.enemyBoss) {
      enemyName = b.enemyBoss.name;
      move = b.enemyBoss.moves[Math.floor(Math.random() * b.enemyBoss.moves.length)];
    } else {
      return;
    }

    soundEngine.playMoveSound(move.soundType);
    const dmg = Math.max(6, Math.floor(move.power * 0.7));
    b.playerSpirit.hp = Math.max(1, b.playerSpirit.hp - dmg);

    b.log = `${enemyName} unleashed ${move.name}! Dealt ${dmg} damage.`;
    b.turn = 'player';
  }

  private handleBattleVictory(): void {
    const b = this.state.battle!;
    if (b.type === 'rival') {
      soundEngine.playLockChime();
      this.state.activeCompanion = 'jax';
      this.state.streamQueue.push(JSON.parse(JSON.stringify(JAX_SPIRIT)));
      this.state.mode = 'exploration';
      this.state.battle = null;
      soundEngine.switchTrack('town');

      this.showDialogue(RIVAL_JAX.name, '🎸', RIVAL_JAX.dialogueDefeat, () => {
        this.showDialogue('Aria', '☕', [
          "Incredible battle! Jax has officially linked his playlist with yours!",
          "Now you two are ready. Step through the Glitch Gate to face Dead Channel 000!"
        ], () => {
          this.startBattle('boss');
        });
      });
    } else if (b.type === 'boss') {
      this.state.mode = 'cleansing_cinematic';
      this.state.battle = null;
      this.state.cleansingProgress = 0;
      soundEngine.playCleansingBloom();
    }
  }
}
