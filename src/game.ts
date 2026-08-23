import { soundEngine } from './audio';
import { BOSS_SIGNAL_OVERLORD, FUSED_CHIMERA, JAX_SPIRIT, RIVAL_JAX, STARTER_SPIRIT, TOWN_ITEMS, TOWN_NPCS, TOWN_SOUND_RIPPLES, TOWN_WILD_GLITCHES, WILD_SPAWN_ZONES, WORLD_OBSTACLES } from './data';
import { CollectibleItem, GameState, Move, NPCEntity, SoundRipple, WildGlitchEntity } from './types';

export class AstralGameEngine {
  private state: GameState;
  private lastTick: number = 0;
  private keysDown: Set<string> = new Set();
  private emergencyTriggered: boolean = false;

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
      questStage: 'intro',
      camera: {
        x: 860,
        y: 1040
      },
      zoneClean: true,
      player: {
        x: 1500,
        y: 1400,
        dir: 'up',
        isMoving: false
      },
      npcs: JSON.parse(JSON.stringify(TOWN_NPCS)),
      soundRipples: JSON.parse(JSON.stringify(TOWN_SOUND_RIPPLES)),
      wildGlitches: JSON.parse(JSON.stringify(TOWN_WILD_GLITCHES)),
      items: JSON.parse(JSON.stringify(TOWN_ITEMS)),
      inventory: [],
      activeCompanion: null,
      streamQueue: [JSON.parse(JSON.stringify(STARTER_SPIRIT))],
      activeSpiritIndex: 0,
      nearbyInteractable: null,
      audioMatch: null,
      battle: null,
      dialogue: {
        speaker: 'Aria ☕',
        avatar: '☕',
        text: [
          "Good morning, Streamer! Welcome to Cadence Plaza for the annual Soundwave Festival!",
          "I see you brought your partner, Chime-Cat! 🐱 You two must be excited to broadcast live and tune into the realm's legendary acoustic traditions.",
          "Here's your fresh roast latte on the house ☕. Take a stroll around the plaza using [W, A, S, D] to test your audio feed, check out the Harmony Fountain, and visit the Vinyl Den!",
          "Come check back with me once you've stretched your legs."
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
        } else if (this.state.mode === 'audio_match_scan' && this.state.audioMatch?.challengeType === 'rhythm_pulse') {
          this.hitRhythmPulse();
        } else if (this.state.mode === 'exploration' && this.state.nearbyInteractable) {
          this.interactWithNearby();
        }
      }

      // Battle Move Shortcuts (1, 2) & Blend (B)
      if (this.state.mode === 'battle' && this.state.battle?.turn === 'player') {
        if (e.code === 'Digit1' || e.code === 'Numpad1') this.initiatePlayerMove(0);
        if (e.code === 'Digit2' || e.code === 'Numpad2') this.initiatePlayerMove(1);
        if (e.code === 'KeyB') this.triggerPlaylistBlend();
      }

      // Melody Jam Tone Matcher Shortcuts (1/J, 2/K, 3/L)
      if (this.state.mode === 'audio_match_scan' && this.state.audioMatch?.challengeType === 'call_response') {
        if (e.code === 'Digit1' || e.code === 'KeyJ') this.inputMelodyPad(0);
        if (e.code === 'Digit2' || e.code === 'KeyK') this.inputMelodyPad(1);
        if (e.code === 'Digit3' || e.code === 'KeyL') this.inputMelodyPad(2);
      }

      // Switch Active Harmonimal (Q or Tab)
      if (this.state.mode === 'exploration' && !this.state.dialogue) {
        if (e.code === 'KeyQ' || e.code === 'Tab') {
          e.preventDefault();
          this.cycleActiveSpirit();
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

    // Exploration Movement, AI & Proximity
    if (this.state.mode === 'exploration') {
      this.updatePlayerMovement(dt);
      this.updateWildMonsters(dt);
      this.updateProximity();
      soundEngine.updatePlayerPosition(this.state.player.x, this.state.player.y);

      // Trigger Emergency Broadcast after basic exploration (reaching the Harmony Fountain or after 8s)
      if (this.state.questStage === 'intro' && !this.emergencyTriggered) {
        const distToFountain = Math.hypot(this.state.player.x - 1600, this.state.player.y - 1450);
        if (distToFountain < 120 || this.state.time > 8) {
          this.triggerEmergencyBroadcast();
        }
      }
    }

    // In update(now), calculate smooth camera centering:
    this.state.camera.x = Math.max(0, Math.min(3200 - 1280, this.state.player.x - 640));
    this.state.camera.y = Math.max(0, Math.min(2400 - 720, this.state.player.y - 360));

    // Rhythm Timing Bar Animation in Battle
    if (this.state.mode === 'battle' && this.state.battle?.turn === 'rhythm_timing') {
      const b = this.state.battle;
      b.rhythmCursor += b.rhythmSpeed * dt;
      if (b.rhythmCursor > 1.0) {
        b.rhythmCursor = 0; // Loop cursor
      }
    }

    // Individual Audio Match Updates
    if (this.state.mode === 'audio_match_scan' && this.state.audioMatch) {
      const match = this.state.audioMatch;
      if (match.challengeType === 'waveform_slider') {
        // Keyboard controls for slider: Left / A to decrease, Right / D to increase
        let slideDir = 0;
        if (this.keysDown.has('KeyA') || this.keysDown.has('ArrowLeft')) slideDir -= 1;
        if (this.keysDown.has('KeyD') || this.keysDown.has('ArrowRight')) slideDir += 1;
        if (slideDir !== 0) {
          const newFreq = Math.max(0, Math.min(100, match.playerFreq + slideDir * 45 * dt));
          this.setPlayerFrequency(newFreq);
        }

        if (Math.abs(match.playerFreq - match.targetFreq) < 6) {
          match.holdTime += dt;
          if (match.holdTime >= 1.2 && !match.isComplete) {
            this.completeAudioMatch();
          }
        } else {
          match.holdTime = Math.max(0, match.holdTime - dt * 2);
        }
      } else if (match.challengeType === 'rhythm_pulse' && !match.isComplete) {
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
        this.state.questStage = 'cleansed';
        this.state.zoneClean = true;
        this.state.glitchActive = false;
        soundEngine.setWarped(false);
        soundEngine.switchTrack('town');
        soundEngine.playCleansingBloom();
        this.showDialogue('Jax & Aria', '🎉', [
          "WE DID IT! Look at Cadence Plaza... the entire static rift has dissolved!",
          "High-definition stereo melodies and vibrant neon colors have completely restored the shoreline!",
          "Thank you for rocking the Astral Stream demo!"
        ]);
      }
    }
  }

  /* ---------------- EXPLORATION & MOVEMENT ---------------- */
  private updatePlayerMovement(dt: number): void {
    if (this.state.dialogue !== null || this.state.mode !== 'exploration') {
      this.state.player.isMoving = false;
      return;
    }

    const speed = 170 * dt;
    let dx = 0;
    let dy = 0;

    if (this.keysDown.has('KeyW') || this.keysDown.has('ArrowUp')) { dy -= speed; this.state.player.dir = 'up'; }
    if (this.keysDown.has('KeyS') || this.keysDown.has('ArrowDown')) { dy += speed; this.state.player.dir = 'down'; }
    if (this.keysDown.has('KeyA') || this.keysDown.has('ArrowLeft')) { dx -= speed; this.state.player.dir = 'left'; }
    if (this.keysDown.has('KeyD') || this.keysDown.has('ArrowRight')) { dx += speed; this.state.player.dir = 'right'; }

    this.state.player.isMoving = (dx !== 0 || dy !== 0);

    // Natural physical world limits (replaces artificial clamps)
    const nextX = Math.max(40, Math.min(3160, this.state.player.x + dx));
    const nextY = Math.max(40, Math.min(2360, this.state.player.y + dy));

    // Axis-independent collision checking for smooth wall sliding
    const canMoveX = !this.checkObstacleCollision(nextX, this.state.player.y);
    const canMoveY = !this.checkObstacleCollision(this.state.player.x, nextY);

    if (canMoveX) {
      this.state.player.x = nextX;
    }
    if (canMoveY) {
      this.state.player.y = nextY;
    }
  }

  public checkObstacleCollision(x: number, y: number): boolean {
    // Walkable Pier Jetties Exclusion (West Pier and East Boardwalk surface)
    const onWestPier = (x >= 140 && x <= 320 && y >= 2040 && y <= 2260);
    const onEastPier = (x >= 800 && x <= 1400 && y >= 2120 && y <= 2220);

    // Sonic Vines Barrier (Blocks the mountain pass gorge x: 580..820 at y: 820..900 until dissolved)
    const vinesActive = this.state.questStage !== 'ridge_breach' && 
                        this.state.questStage !== 'gate_ready' && 
                        this.state.questStage !== 'cleansed';
    if (vinesActive && x >= 560 && x <= 840 && y >= 820 && y <= 900) {
      return true;
    }

    for (const obs of WORLD_OBSTACLES) {
      if (obs.type === 'water') {
        if (obs.direction === 'south') {
          if ((onWestPier || onEastPier) && y <= 2260) {
            continue; // Walkable wooden pier deck over the ocean
          }
          if (y > obs.value) return true;
        }
        if (obs.direction === 'west' && x < obs.value) return true;
      } else if (obs.type === 'box') {
        if (x >= obs.x && x <= obs.x + obs.w && y >= obs.y && y <= obs.y + obs.h) {
          return true;
        }
      } else if (obs.type === 'circle') {
        const dist = Math.hypot(x - obs.x, y - obs.y);
        if (dist <= obs.radius) {
          return true;
        }
      }
    }
    return false;
  }

  public checkBuildingCollision(x: number, y: number): boolean {
    return this.checkObstacleCollision(x, y);
  }

  private updateWildMonsters(dt: number): void {
    const px = this.state.player.x;
    const py = this.state.player.y;

    for (const g of this.state.wildGlitches) {
      if (g.defeated) {
        g.respawnTimer = (g.respawnTimer || 0) + dt;
        if (g.respawnTimer > 20) {
          g.defeated = false;
          g.respawnTimer = 0;
          if (g.spawnOrigin) {
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.random() * g.spawnOrigin.radius * 0.8;
            g.x = g.spawnOrigin.x + Math.cos(angle) * dist;
            g.y = g.spawnOrigin.y + Math.sin(angle) * dist;
          } else {
            const zone = WILD_SPAWN_ZONES.find(z => z.possibleSpirits.some(s => s.id === g.spirit.id)) || WILD_SPAWN_ZONES[0];
            g.x = zone.minX + Math.random() * (zone.maxX - zone.minX);
            g.y = zone.minY + Math.random() * (zone.maxY - zone.minY);
          }
        }
        continue;
      }

      const dist = Math.hypot(px - g.x, py - g.y);

      // Active Pursuit AI when player is within 220px
      if (dist < 220 && !this.state.dialogue) {
        g.isAlerted = true;
        const dx = (px - g.x) / dist;
        const dy = (py - g.y) / dist;
        const speed = g.spirit.id === 'spirit_glitch_golem' ? 55 : (g.spirit.id === 'spirit_steel_panda' ? 65 : 85);

        const nextX = g.x + dx * speed * dt;
        const nextY = g.y + dy * speed * dt;

        if (!this.checkObstacleCollision(nextX, nextY)) {
          g.x = nextX;
          g.y = nextY;
        }

        // Direct Touch Battle Encounter
        if (dist < 34 && this.state.mode === 'exploration' && !this.state.dialogue) {
          this.startWildBattle(g);
          return;
        }
      } else {
        g.isAlerted = false;
        // Wandering / Patrol around spawn origin
        g.wanderTimer = (g.wanderTimer || 0) - dt;
        if (g.wanderTimer <= 0) {
          g.wanderTimer = 3 + Math.random() * 3;
          const originX = g.spawnOrigin ? g.spawnOrigin.x : g.x;
          const originY = g.spawnOrigin ? g.spawnOrigin.y : g.y;
          const maxR = g.spawnOrigin ? g.spawnOrigin.radius * 0.7 : 100;
          const angle = Math.random() * Math.PI * 2;
          const r = Math.random() * maxR;
          g.wanderTarget = { x: originX + Math.cos(angle) * r, y: originY + Math.sin(angle) * r };
        }

        if (g.wanderTarget) {
          const tDist = Math.hypot(g.wanderTarget.x - g.x, g.wanderTarget.y - g.y);
          if (tDist > 5) {
            const wdx = (g.wanderTarget.x - g.x) / tDist;
            const wdy = (g.wanderTarget.y - g.y) / tDist;
            const wSpeed = 25;
            const nextX = g.x + wdx * wSpeed * dt;
            const nextY = g.y + wdy * wSpeed * dt;
            if (!this.checkObstacleCollision(nextX, nextY)) {
              g.x = nextX;
              g.y = nextY;
            }
          }
        }
      }
    }
  }

  public updateProximity(): void {
    const px = this.state.player.x;
    const py = this.state.player.y;
    let closest: NPCEntity | SoundRipple | WildGlitchEntity | CollectibleItem | null = null;
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

    // Check Wild Glitches
    for (const g of this.state.wildGlitches) {
      if (!g.defeated) {
        const d = Math.hypot(px - g.x, py - g.y);
        if (d < minDist) {
          minDist = d;
          closest = g;
        }
      }
    }

    // Check Collectible Items
    for (const item of this.state.items) {
      if (!item.collected) {
        const d = Math.hypot(px - item.x, py - item.y);
        if (d < minDist) {
          minDist = d;
          closest = item;
        }
      }
    }

    this.state.nearbyInteractable = closest;
  }

  public interactWithNearby(): void {
    const target = this.state.nearbyInteractable;
    if (!target) return;

    if ('collected' in target) {
      // Collectible Item Encounter
      this.collectItem(target as CollectibleItem);
      return;
    }

    if ('spirit' in target && 'defeated' in target) {
      // Wild Glitch Encounter
      this.startWildBattle(target as WildGlitchEntity);
      return;
    }

    if ('dialogue' in target) {
      // NPC
      const npc = target as NPCEntity;
      if (npc.id === 'npc_gate') {
        if (!this.state.activeCompanion) {
          this.showDialogue('Glitch Gate', '⚠️👾', [
            "⚠️ The Glitch Gate is sealed by dense static interference!",
            "You need to duel and ally with Jax to synchronize your frequencies before attempting to breach."
          ]);
        } else {
          this.showDialogue('Glitch Gate', '⚠️👾', [
            "The static storm is howling on the other side... Dead Channel 000 awaits!",
            "Your tag-team squad (Chime-Cat & Bass-Hound) is synced and ready.",
            "Step through to breach the rift and initiate the Boss Battle!"
          ], () => {
            this.startBattle('boss');
          });
        }
        return;
      }

      if (npc.actionType === 'battle_jax') {
        if (this.state.activeCompanion === 'jax') {
          this.showDialogue('Jax & Bass-Hound', '🐶🎸', [
            "We're linked and ready for the boss! 🐶🎸",
            "Make sure you explore Cadence Plaza and tune into the 3 cultural sound ripples if you want to expand your squad.",
            "When you're ready, step right up to the Glitch Gate behind me to breach the static storm!"
          ]);
        } else {
          this.showDialogue(npc.name, '🎸', npc.dialogue, () => {
            this.startBattle('rival');
          });
        }
        return;
      }

      let avatar = '💬';
      if (npc.sprite === 'aria') {
        avatar = '☕';
        if (this.state.questStage === 'intro') {
          this.showDialogue(npc.name, '☕', [
            "Enjoying your morning coffee? ☕",
            "Try walking over to the Harmony Fountain in the center of the plaza to test Chime-Cat's acoustic sensors!",
            "Use [W, A, S, D] to navigate around the cobblestone streets."
          ]);
          return;
        }
      }
      else if (npc.sprite === 'dj_otter') avatar = '💽';
      else if (npc.sprite === 'maestro_owl') avatar = '🦉';
      else if (npc.sprite === 'pelican') avatar = '🦢';
      else if (npc.sprite === 'spark') avatar = '⚡';
      else if (npc.sprite === 'jax') avatar = '🎸';
      else if (npc.sprite === 'lyra') avatar = '🔮';
      this.showDialogue(npc.name, avatar, npc.dialogue);
    } else {
      // Sound Ripple
      const rip = target as SoundRipple;
      this.startAudioMatchScan(rip);
    }
  }

  public collectItem(item: CollectibleItem): void {
    if (item.collected) return;
    item.collected = true;
    this.state.inventory.push(item.name);
    soundEngine.playDiscoveryFanfare();

    const targetSpirit = this.state.streamQueue[0];
    let buffSummary = '';

    if (targetSpirit) {
      switch (item.type) {
        case 'tuning_fork':
          targetSpirit.attack += 5;
          buffSummary = `${targetSpirit.name}'s Attack increased by +5! (Now ${targetSpirit.attack})`;
          break;
        case 'golden_vinyl':
          targetSpirit.maxHp += 20;
          targetSpirit.hp = Math.min(targetSpirit.maxHp, targetSpirit.hp + 20);
          buffSummary = `${targetSpirit.name}'s Max HP increased by +20! (Now ${targetSpirit.maxHp} HP)`;
          break;
        case 'frequency_crystal':
          targetSpirit.maxHp += 10;
          targetSpirit.hp = Math.min(targetSpirit.maxHp, targetSpirit.hp + 10);
          targetSpirit.attack += 3;
          buffSummary = `${targetSpirit.name}'s Max HP increased by +10 and Attack by +3!`;
          break;
        case 'energy_battery':
          targetSpirit.maxHp += 15;
          targetSpirit.hp = Math.min(targetSpirit.maxHp, targetSpirit.hp + 15);
          targetSpirit.defense += 10;
          buffSummary = `${targetSpirit.name}'s Defense increased by +10 and Max HP by +15!`;
          break;
      }
    }

    this.showDialogue(
      '✨ ITEM DISCOVERED! ✨',
      item.icon,
      [
        `You found the ${item.name}!`,
        item.description,
        `Effect: ${item.effect}`,
        buffSummary ? `⚡ ${buffSummary}` : ''
      ].filter(Boolean)
    );

    this.updateProximity();
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

  public triggerEmergencyBroadcast(): void {
    if (this.emergencyTriggered) return;
    this.emergencyTriggered = true;
    this.showDialogue('⚠️ EMERGENCY BROADCAST ⚠️', '📳', [
      "[CRACKLE... BZZZT...] ATTENTION ALL STREAMERS & CITIZENS IN CADENCE REALM!",
      "A catastrophic rogue anomaly known as DEAD CHANNEL 000 has hijacked the northern broadcast tower!",
      "Dense analog static is leaking through the Glitch Gate on Desolation Ridge, threatening to corrupt world harmonies and mute all Harmonimals!",
      "[Aria ☕] Streamer! Your live stream transmitter is the only signal cutting through the static storm!",
      "With Chime-Cat's unique resonance, you can tune into the realm's acoustic traditions to fight back.",
      "Beware: dense Sonic Vines block the mountain pass to Desolation Ridge. Seek out traditions and harmonic gear across Port Resonata, the Bamboo Grove, and Sound Ruins.",
      "First, gather squad members across the realm, then confront Jax at Desolation Ridge to breach the Glitch Gate!"
    ], () => {
      this.state.questStage = 'seek_traditions';
    });
  }

  public showDialogue(speaker: string, avatar: string, text: string[], onComplete?: () => void): void {
    this.state.dialogue = { speaker, avatar, text, index: 0, onComplete };
  }

  /* ---------------- DISTINCT AUDIO MATCH CHALLENGES ---------------- */
  public startAudioMatchScan(ripple: SoundRipple): void {
    this.state.mode = 'audio_match_scan';
    this.state.audioMatch = {
      challengeType: ripple.challengeType,
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

    if (ripple.challengeType === 'call_response') {
      setTimeout(() => this.playMelodyDemo(), 400);
    }
  }

  public setPlayerFrequency(val: number): void {
    const match = this.state.audioMatch;
    if (!match || match.challengeType !== 'waveform_slider') return;
    match.playerFreq = val;
    soundEngine.playTone(200 + val * 5, 'sine', 0.04, 0.04);
  }

  public playMelodyDemo(): void {
    const match = this.state.audioMatch;
    if (!match || match.challengeType !== 'call_response') return;

    match.playerSequence = [];
    match.isListeningToPlayer = false;

    match.melodySequence.forEach((note, idx) => {
      setTimeout(() => {
        if (this.state.audioMatch?.challengeType === 'call_response') {
          this.state.audioMatch.activeDemoNote = note;
          soundEngine.playPadTone(note);
          setTimeout(() => {
            if (this.state.audioMatch) this.state.audioMatch.activeDemoNote = null;
          }, 250);
        }
      }, idx * 500 + 400);
    });

    setTimeout(() => {
      if (this.state.audioMatch?.challengeType === 'call_response') {
        this.state.audioMatch.isListeningToPlayer = true;
      }
    }, match.melodySequence.length * 500 + 600);
  }

  public inputMelodyPad(padIndex: number): void {
    const match = this.state.audioMatch;
    if (!match || match.challengeType !== 'call_response' || !match.isListeningToPlayer) return;

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
      this.completeAudioMatch();
    }
  }

  public hitRhythmPulse(): void {
    const match = this.state.audioMatch;
    if (!match || match.challengeType !== 'rhythm_pulse' || match.isComplete) return;

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
    soundEngine.playSuccessDing();
    soundEngine.playCreatureMotif(match.spiritToUnlock.id);

    setTimeout(() => {
      const unlocked = match.spiritToUnlock;
      this.state.streamQueue.push(unlocked);
      const rip = this.state.soundRipples.find(r => r.spirit.id === unlocked.id);
      if (rip) rip.discovered = true;

      if (this.state.questStage === 'seek_traditions' && this.state.streamQueue.length >= 3) {
        this.state.questStage = 'ruins_clearing';
      }

      this.state.audioMatch = null;
      this.state.mode = 'exploration';
      this.showDialogue(unlocked.name, unlocked.avatar, [
        `🎉 AUDIO MATCH VERIFIED! Streamed: ${unlocked.name} [${unlocked.vibeTag}]!`,
        `Biological Instrument: ${unlocked.instrument}!`,
        `Origin Tradition: ${unlocked.originTradition}. Added to your living playlist queue!`,
        `💡 Tip: Click its badge at the top (or press [Q]) to switch your active lead Harmonimal!`
      ]);
    }, 1000);
  }

  public switchActiveSpirit(index: number): void {
    if (index >= 0 && index < this.state.streamQueue.length) {
      this.state.activeSpiritIndex = index;
      const active = this.state.streamQueue[index];
      soundEngine.playCreatureMotif(active.id);
    }
  }

  public cycleActiveSpirit(): void {
    if (this.state.streamQueue.length <= 1) return;
    const nextIdx = (this.state.activeSpiritIndex + 1) % this.state.streamQueue.length;
    this.switchActiveSpirit(nextIdx);
  }

  /* ---------------- BATTLE & RHYTHM TIMING SYSTEM ---------------- */
  public startWildBattle(glitch: WildGlitchEntity): void {
    this.state.mode = 'battle';
    soundEngine.switchTrack('battle');
    const playerSpirit = JSON.parse(JSON.stringify(this.state.streamQueue[this.state.activeSpiritIndex] || this.state.streamQueue[0] || STARTER_SPIRIT));

    this.state.battle = {
      type: 'wild',
      playerSpirit,
      enemySpirit: JSON.parse(JSON.stringify(glitch.spirit)),
      turn: 'player',
      pendingMoveIndex: null,
      rhythmCursor: 0,
      rhythmSpeed: 1.2,
      targetWindowStart: 0.40,
      targetWindowEnd: 0.65,
      rhythmResult: null,
      log: `A wild ${glitch.name} emerged from the static sands! Pick a move!`,
      canBlend: !!this.state.activeCompanion,
      blendActive: false
    };
  }

  public startBattle(type: 'rival' | 'boss'): void {
    this.state.mode = 'battle';
    soundEngine.switchTrack('battle');
    const playerSpirit = JSON.parse(JSON.stringify(this.state.streamQueue[this.state.activeSpiritIndex] || this.state.streamQueue[0] || STARTER_SPIRIT));

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
      this.state.glitchActive = true;
      soundEngine.setWarped(true);
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
        log: `DEAD CHANNEL 000 hijacked the feed! Press [B] to FUSE with Bass-Hound!`,
        canBlend: true,
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

    const inWindow = b.rhythmCursor >= b.targetWindowStart && b.rhythmCursor <= b.targetWindowEnd;
    const center = (b.targetWindowStart + b.targetWindowEnd) / 2;
    const dist = Math.abs(b.rhythmCursor - center);

    let grade: 'PERFECT' | 'GREAT' | 'MISS' = 'MISS';
    let multiplier = 0.5;

    if (inWindow) {
      if (dist < 0.05) {
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

    // Global Genre Affinity Multipliers:
    // 🎻 Symphonic > 🎹 Synth > 🪕 Global > 🎷 Jazz > 🎻 Symphonic
    let genreMult = 1.0;
    const eType = (b.type === 'rival' || b.type === 'wild') ? b.enemySpirit?.type : b.enemyBoss?.type;
    if (move.type === 'symphonic' && eType === 'synth') genreMult = 1.5;
    if (move.type === 'synth' && eType === 'global') genreMult = 1.5;
    if (move.type === 'global' && eType === 'jazz') genreMult = 1.5;
    if (move.type === 'jazz' && eType === 'symphonic') genreMult = 1.5;
    if (move.type === 'bass' && (eType === 'jazz' || eType === 'synth')) genreMult = 1.3;
    if (move.type === 'cosmic' && eType === 'static') genreMult = 1.8;

    const totalDmg = Math.max(8, Math.floor((move.power + b.playerSpirit.attack * 0.4) * multiplier * genreMult));

    soundEngine.playMoveSound(move.soundType);

    setTimeout(() => {
      if ((b.type === 'rival' || b.type === 'wild') && b.enemySpirit) {
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

    if ((b.type === 'rival' || b.type === 'wild') && b.enemySpirit) {
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
    if (b.type === 'wild') {
      soundEngine.playSuccessDing();
      soundEngine.playLockChime();
      this.state.mode = 'exploration';
      this.state.battle = null;
      soundEngine.switchTrack('town');

      // Find and mark defeated
      const activeGlitch = this.state.wildGlitches.find(g => !g.defeated && g.spirit.id === b.enemySpirit?.id);
      if (activeGlitch) activeGlitch.defeated = true;
      if (b.enemySpirit?.id === 'spirit_glitch_golem') {
        this.state.questStage = 'ridge_breach';
      }

      // Frequency Resonance XP & Level Up
      const activeSpirit = this.state.streamQueue[this.state.activeSpiritIndex] || this.state.streamQueue[0];
      activeSpirit.xp += 50;
      let levelUpMsg = '';
      if (activeSpirit.xp >= activeSpirit.maxXp) {
        activeSpirit.level++;
        activeSpirit.xp -= activeSpirit.maxXp;
        activeSpirit.maxXp = Math.floor(activeSpirit.maxXp * 1.5);
        activeSpirit.maxHp += 15;
        activeSpirit.hp = activeSpirit.maxHp;
        activeSpirit.attack += 4;
        levelUpMsg = ` 🌟 LEVEL UP! ${activeSpirit.name} reached Lv. ${activeSpirit.level}! (Max HP +15, ATK +4)`;
      }

      this.showDialogue('Battle Victory', '✨🎉', [
        `✨ You cleansed the ${b.enemySpirit?.name || 'Wild Glitch'}!`,
        `${activeSpirit.name} gained +50 Frequency Resonance (XP)!${levelUpMsg}`,
        `Keep exploring Cadence Plaza to strengthen your team before facing Dead Channel 000!`
      ]);
    } else if (b.type === 'rival') {
      soundEngine.playLockChime();
      this.state.activeCompanion = 'jax';
      this.state.questStage = 'gate_ready';
      if (!this.state.streamQueue.find(s => s.id === JAX_SPIRIT.id)) {
        this.state.streamQueue.push(JSON.parse(JSON.stringify(JAX_SPIRIT)));
      }
      this.state.mode = 'exploration';
      this.state.battle = null;
      soundEngine.switchTrack('town');

      this.showDialogue('Jax & Bass-Hound', '🐶🎸', [
        "Whoa... okay, your timing is clean and your rhythm is sharp. I respect that!",
        "My Sub-Woofer Bass-Hound and I are officially joining your active squad! 🐶🎸",
        "We're linked and ready, but Dead Channel 000 is a massive anomaly. Take time to explore Cadence Plaza!",
        "Battle wild static glitches on the beach to level up your squad, and discover the 3 cultural sound stations in town.",
        "Whenever you're ready for the final battle, step up to the Glitch Gate to breach the static storm together!"
      ]);
    } else if (b.type === 'boss') {
      this.state.mode = 'cleansing_cinematic';
      this.state.battle = null;
      this.state.cleansingProgress = 0;
      soundEngine.playCleansingBloom();
    }
  }
}

export { AstralGameEngine as GameEngine };
