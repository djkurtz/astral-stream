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
      tuning: null,
      battle: null,
      dialogue: {
        speaker: 'Astral Tuner (AI)',
        avatar: '📻',
        text: [
          "Bzzzt... Signal link established! Welcome to Frequency Beach on Cadence Island.",
          "This island vibrates with cosmic musical energy streaming from the stars.",
          "Let's tune your receiver to summon your first Harmonimal companion!"
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
          "WE DID IT! Look at the sky... all the colors and melodies are back!",
          "That Dual-Stream Fusion was incredible. We completely destroyed the Dead Channel!",
          "Thank you for playing the Astral Stream Playable Demo Level!"
        ]);
      }
    }
  }

  /* ---------------- DIALOGUE SYSTEM ---------------- */
  public advanceDialogue(): void {
    if (!this.state.dialogue) return;
    soundEngine.playTone(440, 'sine', 0.05, 0.05);

    if (this.state.dialogue.index < this.state.dialogue.text.length - 1) {
      this.state.dialogue.index++;
    } else {
      const onComplete = this.state.dialogue.onComplete;
      this.state.dialogue = null;
      if (onComplete) {
        onComplete();
      } else if (this.state.mode === 'intro') {
        this.startTuningTutorial();
      }
    }
  }

  public showDialogue(speaker: string, avatar: string, text: string[], onComplete?: () => void): void {
    this.state.dialogue = { speaker, avatar, text, index: 0, onComplete };
  }

  /* ---------------- TUNING / STREAMING MINIGAME ---------------- */
  public startTuningTutorial(): void {
    this.state.mode = 'tuning_tutorial';
    this.state.tuning = {
      targetFrequency: 98.0,
      currentFrequency: 85.0,
      tolerance: 1.5,
      isLocked: false,
      spiritToUnlock: JSON.parse(JSON.stringify(STARTER_SPIRIT))
    };
    soundEngine.startBGM();
  }

  public adjustFrequency(delta: number): void {
    if (!this.state.tuning || this.state.tuning.isLocked) return;
    this.state.tuning.currentFrequency = Math.max(70, Math.min(115, this.state.tuning.currentFrequency + delta));
    soundEngine.playTuningClick();

    const diff = Math.abs(this.state.tuning.currentFrequency - this.state.tuning.targetFrequency);
    if (diff < this.state.tuning.tolerance) {
      this.lockFrequency();
    }
  }

  public lockFrequency(): void {
    if (!this.state.tuning || this.state.tuning.isLocked) return;
    this.state.tuning.isLocked = true;
    soundEngine.playLockChime();

    setTimeout(() => {
      const unlocked = this.state.tuning!.spiritToUnlock;
      this.state.streamQueue.push(unlocked);
      this.state.tuning = null;
      this.state.mode = 'exploration';

      this.showDialogue('Chime-Cat', '🐱', [
        "Mew-chime! ✨ (Chime-Cat streamed directly from the cosmos into your playlist!)",
        "Suddenly, the sky turns dark and television static rips through the air..."
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
        log: `${RIVAL_JAX.name} sent out ${RIVAL_JAX.spirit.name}! Resonance battle start!`,
        canFuse: false,
        fusionActive: false
      };
    } else {
      this.state.battle = {
        type: 'boss',
        playerSpirit,
        enemyBoss: JSON.parse(JSON.stringify(BOSS_SIGNAL_OVERLORD)),
        turn: 'player',
        selectedMoveIndex: 0,
        log: `DEAD CHANNEL 000 appeared! The audio stream is violently warped!`,
        canFuse: !!this.state.activeCompanion,
        fusionActive: false
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

    // Calculate Damage
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

    // Enemy Turn
    setTimeout(() => {
      this.executeEnemyTurn();
    }, 1200);
  }

  public triggerFusion(): void {
    const b = this.state.battle;
    if (!b || !b.canFuse || b.fusionActive) return;

    soundEngine.playCleansingBloom();
    b.fusionActive = true;
    b.playerSpirit = JSON.parse(JSON.stringify(FUSED_CHIMERA));
    b.log = `🌟 DUAL-STREAM FUSION ACTIVATED! Chime-Cat and Bass-Hound merged into Cyber-Fuzz Chimera!`;
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
    b.playerSpirit.hp = Math.max(1, b.playerSpirit.hp - dmg); // Keep player alive for demo fun!

    b.log = `${enemyName} attacked with ${move.name}! Dealt ${dmg} damage.`;
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
          "The static frequency intensifies! The epicenter of Dead Channel 000 is directly ahead.",
          "Prepare your Dual-Stream Fusion and cleanse the signal!"
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
