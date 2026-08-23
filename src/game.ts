import { soundEngine } from './audio';
import { BOSS_SIGNAL_OVERLORD, FUSED_CHIMERA, JAX_SPIRIT, RIVAL_JAX, STARTER_SPIRIT } from './data';
import { GameState, Move } from './types';

export class AstralGameEngine {
  private state: GameState;
  private lastTick: number = 0;

  constructor() {
    this.state = this.createInitialState();
  }

  public getState(): GameState {
    return this.state;
  }

  private createInitialState(): GameState {
    return {
      mode: 'intro',
      zoneClean: false,
      activeCompanion: null,
      streamQueue: [],
      activeSpiritIndex: 0,
      audioMatch: null,
      battle: null,
      dialogue: {
        speaker: 'Vibe-Phone OS',
        avatar: '📱',
        text: [
          "Beep-boop! ✨ Vibe-Phone network connected. Welcome to Frequency Beach!",
          "This shoreline is vibrating with uncataloged cosmic music streams.",
          "Let's launch the Sonic Radar to scan and Audio-Match your starter companion!"
        ],
        index: 0
      },
      time: 0,
      glitchActive: false,
      cleansingProgress: 0
    };
  }

  public update(now: number): void {
    if (this.lastTick === 0) {
      this.lastTick = now;
      return;
    }
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    this.state.time += dt;

    // Cleansing Cinematic Progress
    if (this.state.mode === 'cleansing_cinematic') {
      this.state.cleansingProgress += dt * 0.5;
      if (this.state.cleansingProgress >= 1.0) {
        this.state.mode = 'victory';
        this.state.zoneClean = true;
        this.state.glitchActive = false;
        soundEngine.setWarped(false);
        soundEngine.playCleansingBloom();
        this.showDialogue('Jax & Chime-Cat', '🎉', [
          "WE DID IT! Look at the sky... all the colors and high-definition beats are back!",
          "That Collaborative Playlist Blend was legendary. We completely crushed the Dead Channel!",
          "Thank you for playtesting the modern Astral Stream demo!"
        ]);
      }
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
        this.startAudioMatchScan();
      }
    }
  }

  public showDialogue(speaker: string, avatar: string, text: string[], onComplete?: () => void): void {
    this.state.dialogue = { speaker, avatar, text, index: 0, onComplete };
  }

  /* ---------------- AUDIO MATCH / SHAZAM MINIGAME ---------------- */
  public startAudioMatchScan(): void {
    this.state.mode = 'audio_match_scan';
    this.state.audioMatch = {
      targetWaveformSync: 100,
      currentSync: 15,
      scanPulses: 0,
      isMatched: false,
      spiritToUnlock: JSON.parse(JSON.stringify(STARTER_SPIRIT))
    };
    soundEngine.startBGM();
  }

  public pulseRadarScan(): void {
    const match = this.state.audioMatch;
    if (!match || match.isMatched) return;

    match.scanPulses++;
    match.currentSync = Math.min(100, match.currentSync + 25 + Math.floor(Math.random() * 10));
    soundEngine.playTuningClick();
    soundEngine.playTone(400 + match.currentSync * 4, 'triangle', 0.12, 0.1);

    if (match.currentSync >= 100) {
      this.completeAudioMatch();
    }
  }

  public completeAudioMatch(): void {
    const match = this.state.audioMatch;
    if (!match || match.isMatched) return;

    match.isMatched = true;
    match.currentSync = 100;
    soundEngine.playLockChime();

    setTimeout(() => {
      const unlocked = match.spiritToUnlock;
      this.state.streamQueue.push(unlocked);
      this.state.audioMatch = null;
      this.state.mode = 'exploration';

      this.showDialogue('Chime-Cat', '🐱', [
        "Mew-chime! ✨ (Audio Match Verified: Chime-Cat has streamed into your library!)",
        "Suddenly, a pirate static signal hacks the sky! Colors fade and scanlines buzz..."
      ], () => {
        this.triggerStaticIncursion();
      });
    }, 1200);
  }

  /* ---------------- STATIC INCURSION & RIVAL BATTLE ---------------- */
  public triggerStaticIncursion(): void {
    this.state.glitchActive = true;
    soundEngine.setWarped(true);
    soundEngine.playStaticHiss(0.6, 0.25);

    this.showDialogue(RIVAL_JAX.name, RIVAL_JAX.avatar, RIVAL_JAX.dialogueGreet, () => {
      this.startBattle('rival');
    });
  }

  public startBattle(type: 'rival' | 'boss'): void {
    this.state.mode = 'battle';
    const playerSpirit = JSON.parse(JSON.stringify(this.state.streamQueue[0] || STARTER_SPIRIT));

    if (type === 'rival') {
      this.state.battle = {
        type: 'rival',
        playerSpirit,
        enemySpirit: JSON.parse(JSON.stringify(RIVAL_JAX.spirit)),
        turn: 'player',
        selectedMoveIndex: 0,
        log: `${RIVAL_JAX.name} dropped into battle with ${RIVAL_JAX.spirit.name}! Resonance battle start!`,
        canBlend: false,
        blendActive: false
      };
    } else {
      this.state.battle = {
        type: 'boss',
        playerSpirit,
        enemyBoss: JSON.parse(JSON.stringify(BOSS_SIGNAL_OVERLORD)),
        turn: 'player',
        selectedMoveIndex: 0,
        log: `DEAD CHANNEL 000 hijacked the feed! The audio stream is violently muffled!`,
        canBlend: !!this.state.activeCompanion,
        blendActive: false
      };
    }
  }

  public executePlayerMove(moveIndex: number): void {
    const b = this.state.battle;
    if (!b || b.turn !== 'player') return;

    const move = b.playerSpirit.moves[moveIndex];
    if (!move) return;

    soundEngine.playMoveSound(move.soundType);
    b.turn = 'animating';

    const dmg = Math.max(8, Math.floor(move.power + (b.playerSpirit.attack * 0.4)));

    if (b.type === 'rival' && b.enemySpirit) {
      b.enemySpirit.hp = Math.max(0, b.enemySpirit.hp - dmg);
      b.log = `${b.playerSpirit.name} used ${move.name}! Dealt ${dmg} Harmonic damage!`;

      if (b.enemySpirit.hp <= 0) {
        setTimeout(() => this.handleBattleVictory(), 1000);
        return;
      }
    } else if (b.type === 'boss' && b.enemyBoss) {
      b.enemyBoss.hp = Math.max(0, b.enemyBoss.hp - dmg);
      b.log = `${b.playerSpirit.name} used ${move.name}! Struck the Static Core for ${dmg} damage!`;

      if (b.enemyBoss.hp <= 0) {
        setTimeout(() => this.handleBattleVictory(), 1000);
        return;
      }
    }

    setTimeout(() => {
      this.executeEnemyTurn();
    }, 1200);
  }

  public triggerPlaylistBlend(): void {
    const b = this.state.battle;
    if (!b || !b.canBlend || b.blendActive) return;

    soundEngine.playCleansingBloom();
    b.blendActive = true;
    b.playerSpirit = JSON.parse(JSON.stringify(FUSED_CHIMERA));
    b.log = `🌟 COLLABORATIVE PLAYLIST BLEND! Chime-Cat & Bass-Hound mashed up into Cyber-Fuzz Chimera!`;
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
    const dmg = Math.max(5, Math.floor(move.power * 0.7));
    b.playerSpirit.hp = Math.max(1, b.playerSpirit.hp - dmg);

    b.log = `${enemyName} dropped ${move.name}! Dealt ${dmg} damage.`;
    b.turn = 'player';
  }

  private handleBattleVictory(): void {
    const b = this.state.battle!;
    if (b.type === 'rival') {
      soundEngine.playLockChime();
      this.state.activeCompanion = RIVAL_JAX;
      this.state.streamQueue.push(JSON.parse(JSON.stringify(JAX_SPIRIT)));
      this.state.mode = 'exploration';
      this.state.battle = null;

      this.showDialogue(RIVAL_JAX.name, RIVAL_JAX.avatar, RIVAL_JAX.dialogueDefeat, () => {
        this.showDialogue('Narrator', '📺', [
          "The pirate broadcast reaches peak distortion! Dead Channel 000 has materialized.",
          "Link your playlists and activate the Collaborative Blend to cleanse the stream!"
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
