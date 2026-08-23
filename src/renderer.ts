import { GameState, StreamSpirit } from './types';

export class AstralRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Array<{ x: number; y: number; vx: number; vy: number; color: string; size: number; alpha: number }> = [];

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.initParticlePool();
  }

  private initParticlePool(): void {
    this.particles = [];
    for (let i = 0; i < 80; i++) {
      this.particles.push({
        x: Math.random() * 800,
        y: Math.random() * 600,
        vx: (Math.random() - 0.5) * 1.5,
        vy: -Math.random() * 2 - 0.5,
        color: ['#f43f5e', '#ec4899', '#a855f7', '#06b6d4', '#10b981', '#fbbf24'][Math.floor(Math.random() * 6)],
        size: Math.random() * 4 + 2,
        alpha: Math.random()
      });
    }
  }

  public render(state: GameState): void {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    if (state.mode === 'battle') {
      this.renderBattleArena(state, w, h);
    } else if (state.mode === 'audio_match_scan' && state.audioMatch) {
      this.renderAudioMatchRadar(state, w, h);
    } else {
      this.renderWorldMap(state, w, h);
    }

    // Static Glitch Overlay if active
    if (state.glitchActive && !state.zoneClean) {
      this.renderGlitchOverlay(w, h);
    }

    // Cleansing Cinematic
    if (state.mode === 'cleansing_cinematic') {
      this.renderCleansingWave(state, w, h);
    }
  }

  /* ---------------- TOP-DOWN WORLD MAP ---------------- */
  private renderWorldMap(state: GameState, w: number, h: number): void {
    const ctx = this.ctx;
    const t = state.time;

    // 1. Base Grass & Cobblestone Plaza
    ctx.fillStyle = state.zoneClean ? '#15803d' : '#334155';
    ctx.fillRect(0, 0, w, h);

    // Cobblestone Town Square (Center)
    ctx.fillStyle = state.zoneClean ? '#e2e8f0' : '#475569';
    ctx.fillRect(100, 80, w - 200, h - 160);

    // Decorative Plaza Border
    ctx.strokeStyle = state.zoneClean ? '#06b6d4' : '#64748b';
    ctx.lineWidth = 4;
    ctx.strokeRect(100, 80, w - 200, h - 160);

    // 2. Buildings & Stalls
    // Neon Cafe (Top Left)
    this.drawBuilding(ctx, 110, 90, 160, 110, '☕ NEON CAFE', '#ec4899', state.zoneClean);
    // Vinyl Record Den (Top Right)
    this.drawBuilding(ctx, w - 270, 90, 160, 110, '💽 VINYL DEN', '#fbbf24', state.zoneClean);

    // Glitch Gate (Top Center - Leads to Boss)
    this.drawGlitchGate(ctx, w / 2 - 60, 40, 120, 50, state.glitchActive, t);

    // Musical Fountain (Center Plaza)
    this.drawFountain(ctx, w / 2, h / 2 + 30, t, state.zoneClean);

    // 3. Sound Ripples (Wild Encounters)
    for (const rip of state.soundRipples) {
      if (!rip.discovered) {
        this.drawSoundRipple(ctx, rip.x, rip.y, t);
      }
    }

    // 4. NPCs
    for (const npc of state.npcs) {
      this.drawPixelNPC(ctx, npc.x, npc.y, npc.sprite, t, npc.name);
    }

    // 5. Player Character
    this.drawDetailedPlayer(ctx, state.player.x, state.player.y, state.player.dir, state.player.isMoving, t);

    // Companion Following (Chime-Cat)
    if (state.streamQueue.length > 0) {
      const companionX = state.player.x - 28;
      const companionY = state.player.y + 4 + Math.sin(t * 5) * 3;
      this.drawDetailedCat(ctx, companionX, companionY, t);
    }

    // 6. Interaction Prompt HUD
    if (state.nearbyInteractable) {
      const target = state.nearbyInteractable;
      const tx = 'name' in target ? target.x : target.x;
      const ty = 'name' in target ? target.y - 45 : target.y - 30;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(tx - 65, ty - 18, 130, 26, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = '700 12px Rajdhani';
      ctx.textAlign = 'center';
      const promptText = 'name' in target 
        ? (target.actionType === 'battle_jax' ? '⚔️ [SPACE] Duel Jax' : `💬 [SPACE] Talk to ${target.name}`)
        : '🔍 [SPACE] Audio-Match';
      ctx.fillText(promptText, tx, ty);
    }

    // Celebration particles if clean
    if (state.zoneClean) {
      this.renderCelebrationParticles(ctx, w, h);
    }
  }

  /* ---------------- DETAILED PIXEL SPRITES ---------------- */
  private drawDetailedPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, _dir: string, isMoving: boolean, t: number): void {
    ctx.save();
    ctx.translate(x, y);

    const bob = isMoving ? Math.sin(t * 12) * 2 : 0;
    const legSwing = isMoving ? Math.sin(t * 12) * 4 : 0;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 6, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-6 + legSwing, -6, 5, 10);
    ctx.fillRect(1 - legSwing, -6, 5, 10);

    // Shoes
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-6 + legSwing, 2, 6, 4);
    ctx.fillRect(1 - legSwing, 2, 6, 4);

    // Jacket (Neon Coral)
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-8, -22 + bob, 16, 17);

    // Head / Face
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-6, -34 + bob, 12, 13);

    // Anime Eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4, -30 + bob, 3, 4);
    ctx.fillRect(1, -30 + bob, 3, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-4, -30 + bob, 1, 2);
    ctx.fillRect(1, -30 + bob, 1, 2);

    // Cyan Headphones
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(-9, -36 + bob, 18, 5); // Headband
    ctx.fillRect(-10, -32 + bob, 3, 8); // Ear cup L
    ctx.fillRect(7, -32 + bob, 3, 8);  // Ear cup R

    // Glowing Vibe-Phone in hand
    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 8;
    ctx.fillRect(8, -16 + bob, 6, 10);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(9, -15 + bob, 4, 7);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  private drawDetailedCat(ctx: CanvasRenderingContext2D, x: number, y: number, t: number): void {
    ctx.save();
    ctx.translate(x, y);

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 5, 9, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (Pastel Cyan)
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-7, -10, 14, 12);

    // Head
    ctx.fillRect(-6, -18, 12, 10);

    // Ears
    ctx.fillStyle = '#ec4899'; // Pink inner ear
    ctx.beginPath();
    ctx.moveTo(-6, -18);
    ctx.lineTo(-4, -24);
    ctx.lineTo(-1, -18);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(1, -18);
    ctx.lineTo(4, -24);
    ctx.lineTo(6, -18);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4, -15, 2, 3);
    ctx.fillRect(2, -15, 2, 3);

    // Tail (Wagging audio cord)
    const tailWag = Math.sin(t * 8) * 4;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-7, -4);
    ctx.quadraticCurveTo(-14, -10 + tailWag, -12, -16);
    ctx.stroke();

    // Audio Jack at tip of tail
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-14, -18, 4, 4);

    ctx.restore();
  }

  private drawPixelNPC(ctx: CanvasRenderingContext2D, x: number, y: number, sprite: string, t: number, name: string): void {
    ctx.save();
    ctx.translate(x, y);

    const bob = Math.sin(t * 3) * 1.5;

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 6, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    if (sprite === 'aria') {
      // Aria (Barista)
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-7, -22 + bob, 14, 18); // Apron
      ctx.fillStyle = '#fde047';
      ctx.fillRect(-6, -34 + bob, 12, 13); // Face
      ctx.fillStyle = '#818cf8';
      ctx.fillRect(-8, -37 + bob, 16, 6); // Purple hair
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-4, -30 + bob, 2, 3);
      ctx.fillRect(2, -30 + bob, 2, 3);

    } else if (sprite === 'dj_otter') {
      // DJ Otter
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-9, -20 + bob, 18, 16); // Brown fur
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(-6, -30 + bob, 12, 11); // Muzzle
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-4, -27 + bob, 2, 2);
      ctx.fillRect(2, -27 + bob, 2, 2);
      // Giant gold chain
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-6, -14 + bob, 12, 4);

    } else if (sprite === 'jax') {
      // Jax (Punk)
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-8, -24 + bob, 16, 19); // Leather jacket
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-6, -35 + bob, 12, 12); // Face
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(-8, -40 + bob, 16, 7); // Spiked hair
      // Spiked bass guitar
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(8, -22 + bob, 6, 18);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(10, -32 + bob, 2, 10);
    }

    // Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 11px Rajdhani';
    ctx.textAlign = 'center';
    ctx.fillText(name, 0, -42 + bob);

    ctx.restore();
  }

  private drawBuilding(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, title: string, color: string, isClean: boolean): void {
    // Body
    ctx.fillStyle = isClean ? '#1e293b' : '#334155';
    ctx.fillRect(x, y, w, h);

    // Striped Awning
    const stripeW = w / 6;
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i % 2 === 0 ? color : '#ffffff';
      ctx.fillRect(x + i * stripeW, y - 10, stripeW, 14);
    }

    // Sign
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(x + 10, y + 10, w - 20, 26);
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 10, y + 10, w - 20, 26);

    ctx.fillStyle = isClean ? '#ffffff' : '#94a3b8';
    ctx.font = '700 12px Rajdhani';
    ctx.textAlign = 'center';
    ctx.fillText(title, x + w / 2, y + 27);
  }

  private drawGlitchGate(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, isGlitch: boolean, t: number): void {
    ctx.fillStyle = isGlitch ? 'rgba(239, 68, 68, 0.2)' : 'rgba(6, 182, 212, 0.2)';
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = isGlitch ? '#ef4444' : '#06b6d4';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    if (isGlitch) {
      // Jittery Static Portal in Gate
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      for (let i = 0; i < 5; i++) {
        ctx.fillRect(x + Math.random() * w, y + Math.random() * h, Math.random() * 20, 2);
      }
      ctx.fillStyle = '#ef4444';
      ctx.font = '700 11px Rajdhani';
      ctx.textAlign = 'center';
      ctx.fillText('⚠️ DEAD CHANNEL RIFT', x + w / 2, y + 30 + Math.sin(t * 6) * 2);
    }
  }

  private drawFountain(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, isClean: boolean): void {
    // Basin
    ctx.fillStyle = isClean ? '#0284c7' : '#475569';
    ctx.beginPath();
    ctx.arc(x, y, 36, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = isClean ? '#38bdf8' : '#64748b';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Spouting Water Notes
    if (isClean) {
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      const noteY = Math.sin(t * 4) * 8;
      ctx.fillText('♪', x, y - 8 + noteY);
    }
  }

  private drawSoundRipple(ctx: CanvasRenderingContext2D, x: number, y: number, t: number): void {
    const pulse = (t * 40) % 30;
    ctx.strokeStyle = `rgba(251, 191, 36, ${1 - pulse / 30})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x, y, pulse + 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#fbbf24';
    ctx.font = '18px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🎷', x, y + 6);
  }

  /* ---------------- BATTLE ARENA & RHYTHM BAR ---------------- */
  private renderBattleArena(state: GameState, w: number, h: number): void {
    const ctx = this.ctx;
    const t = state.time;
    const battle = state.battle!;

    // Arena Backdrop
    ctx.fillStyle = state.zoneClean ? '#1e1b4b' : '#090d16';
    ctx.fillRect(0, 0, w, h);

    // Neon Battle Grid
    ctx.strokeStyle = state.zoneClean ? 'rgba(236, 72, 153, 0.2)' : 'rgba(239, 68, 68, 0.2)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, h * 0.35);
      ctx.lineTo((x - w / 2) * 2 + w / 2, h);
      ctx.stroke();
    }

    // 1. Player Spirit (Left)
    const pSpirit = battle.playerSpirit;
    const px = w * 0.25;
    const py = h * 0.55;

    ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
    ctx.beginPath();
    ctx.ellipse(px, py + 25, 70, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    this.drawSpiritBattleSprite(ctx, px, py + Math.sin(t * 4) * 5, pSpirit, 1.4);

    // 2. Enemy (Right)
    const ex = w * 0.75;
    const ey = h * 0.42;

    ctx.fillStyle = battle.type === 'boss' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(168, 85, 247, 0.3)';
    ctx.beginPath();
    ctx.ellipse(ex, ey + 25, 80, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    if (battle.type === 'boss' && battle.enemyBoss) {
      const boss = battle.enemyBoss;
      const jx = ex + (Math.random() - 0.5) * (boss.glitchIntensity * 12);
      const jy = ey + (Math.random() - 0.5) * (boss.glitchIntensity * 8);
      this.drawBossSprite(ctx, jx, jy, boss.avatar, boss.name, 2.0);
    } else if (battle.enemySpirit) {
      const eSpirit = battle.enemySpirit;
      this.drawSpiritBattleSprite(ctx, ex, ey + Math.sin(t * 3.5 + 1) * 5, eSpirit, 1.4);
    }

    // 3. Rhythm Timing Bar (Active during rhythm_timing turn)
    if (battle.turn === 'rhythm_timing') {
      this.renderRhythmBar(ctx, w, h, battle);
    }

    // Floating Battle Log
    if (battle.log) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.fillRect(w * 0.15, h * 0.04, w * 0.7, 42);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(w * 0.15, h * 0.04, w * 0.7, 42);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 15px Rajdhani';
      ctx.textAlign = 'center';
      ctx.fillText(battle.log, w / 2, h * 0.04 + 26);
    }
  }

  private renderRhythmBar(ctx: CanvasRenderingContext2D, w: number, h: number, battle: any): void {
    const barW = Math.min(500, w * 0.8);
    const barH = 34;
    const barX = (w - barW) / 2;
    const barY = h * 0.78;

    // Track Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 3;
    ctx.strokeRect(barX, barY, barW, barH);

    // Target Window (Green / Cyan Perfect Zone)
    const winX = barX + battle.targetWindowStart * barW;
    const winW = (battle.targetWindowEnd - battle.targetWindowStart) * barW;
    ctx.fillStyle = 'rgba(16, 185, 129, 0.6)';
    ctx.fillRect(winX, barY + 2, winW, barH - 4);

    // Beat Cursor
    const curX = barX + battle.rhythmCursor * barW;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 10;
    ctx.fillRect(curX - 4, barY - 4, 8, barH + 8);
    ctx.shadowBlur = 0;

    // Instruction Banner
    ctx.fillStyle = '#fbbf24';
    ctx.font = '700 15px Rajdhani';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ HIT [SPACE] OR CLICK WHEN CURSOR IS IN THE GREEN ZONE! ⚡', w / 2, barY - 12);

    // Rhythm Result Popup
    if (battle.rhythmResult) {
      ctx.font = '800 24px Rajdhani';
      ctx.fillStyle = battle.rhythmResult === 'PERFECT' ? '#10b981' : (battle.rhythmResult === 'GREAT' ? '#38bdf8' : '#ef4444');
      ctx.fillText(`✨ ${battle.rhythmResult}! ✨`, w / 2, barY + barH + 28);
    }
  }

  private drawSpiritBattleSprite(ctx: CanvasRenderingContext2D, x: number, y: number, spirit: StreamSpirit, scale: number): void {
    ctx.save();
    ctx.translate(x, y);

    ctx.shadowColor = spirit.color;
    ctx.shadowBlur = 16;
    ctx.font = `${Math.floor(40 * scale)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(spirit.avatar || (spirit.type === 'synth' ? '🐱' : (spirit.type === 'bass' ? '🐶' : '🎷')), 0, 0);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 13px Rajdhani';
    ctx.fillText(`${spirit.name} [${spirit.type.toUpperCase()}]`, 0, 32 * scale);
    ctx.restore();
  }

  private drawBossSprite(ctx: CanvasRenderingContext2D, x: number, y: number, avatar: string, name: string, scale: number): void {
    ctx.save();
    ctx.translate(x, y);

    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 20;
    ctx.font = `${Math.floor(42 * scale)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(avatar, 0, 0);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ef4444';
    ctx.font = '800 14px Rajdhani';
    ctx.fillText(name, 0, 34 * scale);
    ctx.restore();
  }

  /* ---------------- 3-STAGE AUDIO MATCH RADAR ---------------- */
  private renderAudioMatchRadar(state: GameState, w: number, h: number): void {
    const ctx = this.ctx;
    const t = state.time;
    const match = state.audioMatch!;
    const centerX = w / 2;
    const centerY = h * 0.40;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    // Header Badge
    ctx.fillStyle = '#fde047';
    ctx.font = '800 16px Rajdhani';
    ctx.textAlign = 'center';
    ctx.fillText(`STAGE ${match.stage} OF 3: ${match.stage === 1 ? '🎛️ WAVEFORM ALIGNMENT' : (match.stage === 2 ? '🎹 CALL & RESPONSE JAM' : '🎯 RHYTHM PULSE LOCK')}`, centerX, 45);

    if (match.stage === 1) {
      // ---------------- STAGE 1: WAVEFORM ALIGN ----------------
      const isAligned = Math.abs(match.playerFreq - match.targetFreq) < 7;
      
      // Target Waveform (Cyan / Green)
      ctx.strokeStyle = isAligned ? '#10b981' : 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = isAligned ? 4 : 2;
      ctx.beginPath();
      for (let x = 60; x < w - 60; x += 4) {
        const y = centerY + Math.sin(x * 0.04 + t * 5) * 45;
        if (x === 60) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Player Waveform (Magenta / Green)
      ctx.strokeStyle = isAligned ? '#10b981' : '#ec4899';
      ctx.lineWidth = isAligned ? 4 : 3;
      ctx.beginPath();
      const pScale = 0.015 + (match.playerFreq / 100) * 0.05;
      for (let x = 60; x < w - 60; x += 4) {
        const y = centerY + Math.sin(x * pScale + t * 6) * 50;
        if (x === 60) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Hold Progress Meter
      if (isAligned) {
        const holdPct = Math.min(1.0, match.holdTime / 1.2);
        ctx.fillStyle = '#10b981';
        ctx.font = '700 16px Rajdhani';
        ctx.fillText(`✨ HOLDING FREQUENCY... (${Math.floor(holdPct * 100)}%) ✨`, centerX, centerY - 80);
        
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(centerX - 100, centerY - 65, 200, 10);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(centerX - 100, centerY - 65, 200 * holdPct, 10);
      } else {
        ctx.fillStyle = '#94a3b8';
        ctx.font = '600 14px Rajdhani';
        ctx.fillText('👉 Drag the slider below until the waveforms overlap and turn GREEN!', centerX, centerY - 80);
      }

    } else if (match.stage === 2) {
      // ---------------- STAGE 2: CALL & RESPONSE ----------------
      ctx.fillStyle = match.isListeningToPlayer ? '#38bdf8' : '#fbbf24';
      ctx.font = '700 16px Rajdhani';
      ctx.fillText(match.isListeningToPlayer ? `🎵 YOUR TURN: Repeat the tune on the pads! (${match.playerSequence.length}/4)` : '👂 LISTEN CAREFULLY TO THE CREATURE...', centerX, centerY - 90);

      // Render 3 Visual Launchpads
      const padColors = ['#f43f5e', '#fbbf24', '#38bdf8'];
      const padLabels = ['🔴 LOW (C)', '🟡 MID (E)', '🔵 HIGH (G)'];
      const padW = 110;
      const padH = 70;
      const startX = centerX - (3 * padW + 2 * 20) / 2;

      for (let i = 0; i < 3; i++) {
        const px = startX + i * (padW + 20);
        const py = centerY - 30;
        const isActive = match.activeDemoNote === i || (match.playerSequence[match.playerSequence.length - 1] === i && match.isListeningToPlayer);

        ctx.fillStyle = isActive ? '#ffffff' : 'rgba(30, 41, 59, 0.9)';
        ctx.strokeStyle = padColors[i];
        ctx.lineWidth = isActive ? 5 : 3;
        ctx.shadowColor = isActive ? padColors[i] : 'transparent';
        ctx.shadowBlur = isActive ? 20 : 0;
        
        ctx.beginPath();
        ctx.roundRect(px, py, padW, padH, 10);
        ctx.fill();
        ctx.stroke();
        ctx.shadowBlur = 0;

        ctx.fillStyle = isActive ? '#0f172a' : '#ffffff';
        ctx.font = '700 13px Rajdhani';
        ctx.fillText(padLabels[i], px + padW / 2, py + padH / 2 + 5);
      }

    } else if (match.stage === 3) {
      // ---------------- STAGE 3: RHYTHM PULSE RING ----------------
      // Target Ring (Cyan / Green)
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, match.targetRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Expanding Pulse Ring
      const diff = Math.abs(match.pulseRadius - match.targetRadius);
      ctx.strokeStyle = diff < 18 ? '#10b981' : 'rgba(236, 72, 153, 0.7)';
      ctx.lineWidth = diff < 18 ? 6 : 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, match.pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Combo & Feedback
      ctx.fillStyle = '#fbbf24';
      ctx.font = '800 22px Rajdhani';
      ctx.fillText(`🔥 COMBO: ${match.combo} / 3 🔥`, centerX, centerY - 130);

      if (match.feedback) {
        ctx.fillStyle = match.feedback.includes('ON BEAT') ? '#10b981' : '#ef4444';
        ctx.font = '700 16px Rajdhani';
        ctx.fillText(match.feedback, centerX, centerY + match.targetRadius + 30);
      }
    }

    // Creature Badge (Bottom)
    const spirit = match.spiritToUnlock;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 18px Rajdhani';
    ctx.fillText(`${spirit.name} • ${spirit.vibeTag}`, centerX, h * 0.86);

    ctx.font = '40px sans-serif';
    ctx.fillText(spirit.avatar || '🎷', centerX, centerY + (match.stage === 2 ? 80 : 0));
  }

  private renderGlitchOverlay(w: number, h: number): void {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 2);
    }
    if (Math.random() < 0.4) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fillRect(0, Math.random() * h, w, Math.random() * 25 + 5);
    }
  }

  private renderCleansingWave(state: GameState, w: number, h: number): void {
    const ctx = this.ctx;
    const progress = state.cleansingProgress;
    const radius = progress * Math.hypot(w, h);

    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, radius);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
    grad.addColorStop(0.4, 'rgba(6, 182, 212, 0.75)');
    grad.addColorStop(0.8, 'rgba(236, 72, 153, 0.55)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  private renderCelebrationParticles(ctx: CanvasRenderingContext2D, w: number, h: number): void {
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.y < 0) {
        p.y = h;
        p.x = Math.random() * w;
      }
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha * 0.7;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;
  }
}
