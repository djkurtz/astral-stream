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

  /* ---------------- COMPELLING TOP-DOWN WORLD MAP ---------------- */
  private renderWorldMap(state: GameState, w: number, h: number): void {
    const ctx = this.ctx;
    const t = state.time;

    // 1. Lush Green Grass Foundation
    ctx.fillStyle = '#166534';
    ctx.fillRect(0, 0, w, h);

    // Decorative grass patches
    ctx.fillStyle = '#15803d';
    for (let x = 20; x < w; x += 60) {
      for (let y = 20; y < h - 80; y += 60) {
        if ((x + y) % 40 === 0) {
          ctx.fillRect(x, y, 8, 4);
          ctx.fillRect(x + 4, y - 4, 4, 8);
        }
      }
    }

    // 2. Sandy Beach & Ocean Shoreline (Bottom)
    // Sand
    ctx.fillStyle = '#fde68a';
    ctx.fillRect(0, 520, w, 25);
    // Ocean
    const oceanGrad = ctx.createLinearGradient(0, 545, 0, h);
    oceanGrad.addColorStop(0, '#0284c7');
    oceanGrad.addColorStop(1, '#0369a1');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 545, w, h - 545);

    // Animated Ocean Foam Waves
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 10) {
      const wy = 545 + Math.sin(x * 0.05 + t * 4) * 4;
      if (x === 0) ctx.moveTo(x, wy);
      else ctx.lineTo(x, wy);
    }
    ctx.stroke();

    // 3. Central Cobblestone Plaza
    const plazaX = 80;
    const plazaY = 70;
    const plazaW = w - 160;
    const plazaH = 440;

    // Cobblestone Base
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(plazaX, plazaY, plazaW, plazaH);

    // Paved Stone Grid Pattern
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1;
    for (let x = plazaX; x <= plazaX + plazaW; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, plazaY);
      ctx.lineTo(x, plazaY + plazaH);
      ctx.stroke();
    }
    for (let y = plazaY; y <= plazaY + plazaH; y += 32) {
      ctx.beginPath();
      ctx.moveTo(plazaX, y);
      ctx.lineTo(plazaX + plazaW, y);
      ctx.stroke();
    }

    // Decorative Plaza Border Curbs
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 6;
    ctx.strokeRect(plazaX, plazaY, plazaW, plazaH);

    // 4. Scenery: Lush Pixel Trees & Streetlamps
    this.drawTree(ctx, 40, 140);
    this.drawTree(ctx, 40, 280);
    this.drawTree(ctx, 40, 420);
    this.drawTree(ctx, w - 40, 140);
    this.drawTree(ctx, w - 40, 280);
    this.drawTree(ctx, w - 40, 420);

    this.drawStreetLamp(ctx, 100, 240, t);
    this.drawStreetLamp(ctx, w - 100, 240, t);
    this.drawStreetLamp(ctx, 100, 460, t);
    this.drawStreetLamp(ctx, w - 100, 460, t);

    // 5. Buildings with Crystal-Clear Signs
    // Neon Cafe (Top Left)
    this.drawNeonCafe(ctx, 90, 80, 170, 110, t);
    // Vinyl Record Den (Top Right)
    this.drawVinylDen(ctx, w - 260, 80, 170, 110, t);
    // Glitch Gate (Top Center)
    this.drawGlitchGate(ctx, w / 2 - 70, 30, 140, 50, state.glitchActive, t);

    // 6. Musical Centerpiece Fountain
    this.drawMusicalFountain(ctx, w / 2, 290, t);

    // 7. Sound Ripples (The 3 Discovery Stations)
    for (const rip of state.soundRipples) {
      if (!rip.discovered) {
        this.drawSoundRipple(ctx, rip.x, rip.y, rip.challengeType, t);
      }
    }

    // 8. NPCs
    for (const npc of state.npcs) {
      this.drawPixelNPC(ctx, npc.x, npc.y, npc.sprite, t, npc.name);
    }

    // 9. Player Character
    this.drawDetailedPlayer(ctx, state.player.x, state.player.y, state.player.dir, state.player.isMoving, t);

    // Follower Companions (Chime-Cat + others in queue)
    if (state.streamQueue.length > 0) {
      const companionX = state.player.x - 28;
      const companionY = state.player.y + 4 + Math.sin(t * 5) * 3;
      this.drawDetailedCat(ctx, companionX, companionY, t);
    }

    // 10. High-Legibility Interaction HUD Prompt
    if (state.nearbyInteractable) {
      const target = state.nearbyInteractable;
      const tx = 'name' in target ? target.x : target.x;
      const ty = 'name' in target ? target.y - 48 : target.y - 38;

      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(tx - 85, ty - 18, 170, 28, 8);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 13px Fredoka, sans-serif';
      ctx.textAlign = 'center';

      let promptText = '';
      if ('name' in target) {
        promptText = target.actionType === 'battle_jax' ? '⚔️ [SPACE] Duel Jax' : `💬 [SPACE] Talk to ${target.name}`;
      } else {
        const cType = (target as any).challengeType;
        if (cType === 'waveform_slider') promptText = '🎛️ [SPACE] Tune Waveform';
        else if (cType === 'call_response') promptText = '🎹 [SPACE] Jam Melody';
        else promptText = '🥁 [SPACE] Beat Sync';
      }
      ctx.fillText(promptText, tx, ty + 2);
    }

    // Celebration particles if clean
    if (state.zoneClean && state.mode === 'victory') {
      this.renderCelebrationParticles(ctx, w, h);
    }
  }

  /* ---------------- DETAILED SCENERY ---------------- */
  private drawTree(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(x, y + 10, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Trunk
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x - 5, y - 10, 10, 20);

    // Foliage (Layered Lush Circles)
    ctx.fillStyle = '#15803d';
    ctx.beginPath();
    ctx.arc(x, y - 24, 22, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(x - 5, y - 30, 14, 0, Math.PI * 2);
    ctx.arc(x + 6, y - 26, 12, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawStreetLamp(ctx: CanvasRenderingContext2D, x: number, y: number, _t: number): void {
    // Warm Light Glow on Ground
    const glow = ctx.createRadialGradient(x, y + 10, 0, x, y + 10, 35);
    glow.addColorStop(0, 'rgba(253, 224, 71, 0.25)');
    glow.addColorStop(1, 'rgba(253, 224, 71, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(x, y + 10, 35, 0, Math.PI * 2);
    ctx.fill();

    // Pole
    ctx.fillStyle = '#334155';
    ctx.fillRect(x - 2, y - 30, 4, 35);

    // Lantern Head
    ctx.fillStyle = '#fde047';
    ctx.fillRect(x - 5, y - 35, 10, 8);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 6, y - 38, 12, 3);
  }

  private drawNeonCafe(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, _t: number): void {
    // Wooden Patio Deck
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 10, y + h - 15, w + 20, 40);
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 10, y + h - 15, w + 20, 40);

    // Cafe Tables with Coffee Mugs
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.arc(x + 18, y + h + 8, 10, 0, Math.PI * 2);
    ctx.arc(x + w - 18, y + h + 8, 10, 0, Math.PI * 2);
    ctx.fill();
    // Steaming mugs
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 16, y + h + 5, 4, 4);
    ctx.fillRect(x + w - 20, y + h + 5, 4, 4);

    // Main Cafe Building
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x, y, w, h);

    // Striped Awning (Pink & White)
    const stripes = 6;
    const stripeW = w / stripes;
    for (let i = 0; i < stripes; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#ec4899' : '#ffffff';
      ctx.fillRect(x + i * stripeW, y + 25, stripeW, 16);
    }

    // High-Legibility Signboard
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 10, y + 2, w - 20, 24);
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 10, y + 2, w - 20, 24);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 14px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('☕ NEON CAFE', x + w / 2, y + 19);

    // Windows with Warm Glow
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(x + 15, y + 50, 40, 35);
    ctx.fillRect(x + w - 55, y + 50, 40, 35);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 33, y + 50, 4, 35);
    ctx.fillRect(x + w - 37, y + 50, 4, 35);
  }

  private drawVinylDen(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, t: number): void {
    // Main Building
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(x, y, w, h);

    // Giant Rotating Vinyl Record on Roof
    ctx.save();
    ctx.translate(x + w / 2, y - 8);
    ctx.rotate(t * 2);
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.stroke();
    // Center label
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Striped Awning (Gold & Black)
    const stripes = 6;
    const stripeW = w / stripes;
    for (let i = 0; i < stripes; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#fbbf24' : '#0f172a';
      ctx.fillRect(x + i * stripeW, y + 25, stripeW, 16);
    }

    // High-Legibility Signboard
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + 10, y + 2, w - 20, 24);
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 10, y + 2, w - 20, 24);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 14px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💽 VINYL DEN', x + w / 2, y + 19);

    // Neon Glass Display Window
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(x + 15, y + 50, w - 30, 35);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px sans-serif';
    ctx.fillText('🎵  LP  📻', x + w / 2, y + 73);
  }

  private drawGlitchGate(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, isGlitch: boolean, t: number): void {
    ctx.fillStyle = isGlitch ? 'rgba(239, 68, 68, 0.25)' : 'rgba(6, 182, 212, 0.25)';
    ctx.fillRect(x, y, w, h);

    ctx.strokeStyle = isGlitch ? '#ef4444' : '#06b6d4';
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, w, h);

    // Hazard Stripes on Pillars
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(x, y, 12, h);
    ctx.fillRect(x + w - 12, y, 12, h);
    ctx.fillStyle = '#0f172a';
    for (let i = 0; i < h; i += 12) {
      ctx.fillRect(x, y + i, 12, 6);
      ctx.fillRect(x + w - 12, y + i, 12, 6);
    }

    ctx.fillStyle = isGlitch ? '#ef4444' : '#06b6d4';
    ctx.font = '800 13px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isGlitch ? '⚠️ GLITCH GATE' : '✨ SOUND PORTAL', x + w / 2, y + 30 + Math.sin(t * 6) * 2);
  }

  private drawMusicalFountain(ctx: CanvasRenderingContext2D, x: number, y: number, t: number): void {
    // Outer Stone Basin
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(x, y, 40, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 5;
    ctx.stroke();

    // Center Pedestal
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(x, y, 16, 0, Math.PI * 2);
    ctx.fill();

    // Spouting Water and Notes
    const notes = ['♪', '♫', '♬'];
    for (let i = 0; i < 3; i++) {
      const angle = (t * 2 + (i * Math.PI * 2) / 3);
      const nx = x + Math.cos(angle) * 24;
      const ny = y - 10 + Math.sin(angle) * 12 - (t * 15 % 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(notes[i], nx, ny);
    }
  }

  private drawSoundRipple(ctx: CanvasRenderingContext2D, x: number, y: number, challengeType: string, t: number): void {
    const pulse = (t * 40) % 32;
    ctx.strokeStyle = `rgba(251, 191, 36, ${1 - pulse / 32})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(x, y, pulse + 12, 0, Math.PI * 2);
    ctx.stroke();

    // Ripple Icon
    let icon = '🎷';
    let label = 'Melody Jam';
    if (challengeType === 'waveform_slider') { icon = '🎛️'; label = 'Equalizer'; }
    else if (challengeType === 'rhythm_pulse') { icon = '🥁'; label = 'Beat Sync'; }

    ctx.font = '22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(icon, x, y + 7);

    // Crisp Label Above
    ctx.fillStyle = '#fbbf24';
    ctx.font = '700 12px Fredoka, sans-serif';
    ctx.fillText(label, x, y - 22);
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

    // Eyes
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4, -30 + bob, 3, 4);
    ctx.fillRect(1, -30 + bob, 3, 4);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-4, -30 + bob, 1, 2);
    ctx.fillRect(1, -30 + bob, 1, 2);

    // Cyan Headphones
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(-9, -36 + bob, 18, 5);
    ctx.fillRect(-10, -32 + bob, 3, 8);
    ctx.fillRect(7, -32 + bob, 3, 8);

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
    ctx.fillStyle = '#ec4899';
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

    // Golden Audio Jack
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
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-7, -22 + bob, 14, 18);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(-6, -34 + bob, 12, 13);
      ctx.fillStyle = '#818cf8';
      ctx.fillRect(-8, -37 + bob, 16, 6);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-4, -30 + bob, 2, 3);
      ctx.fillRect(2, -30 + bob, 2, 3);
    } else if (sprite === 'dj_otter') {
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-9, -20 + bob, 18, 16);
      ctx.fillStyle = '#fed7aa';
      ctx.fillRect(-6, -30 + bob, 12, 11);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-4, -27 + bob, 2, 2);
      ctx.fillRect(2, -27 + bob, 2, 2);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-6, -14 + bob, 12, 4);
    } else if (sprite === 'jax') {
      ctx.fillStyle = '#1e1b4b';
      ctx.fillRect(-8, -24 + bob, 16, 19);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-6, -35 + bob, 12, 12);
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(-8, -40 + bob, 16, 7);
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(8, -22 + bob, 6, 18);
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(10, -32 + bob, 2, 10);
    }

    // High-Legibility Name Label
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 13px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(name, 0, -42 + bob);

    ctx.restore();
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
    ctx.strokeStyle = state.zoneClean ? 'rgba(236, 72, 153, 0.25)' : 'rgba(239, 68, 68, 0.25)';
    ctx.lineWidth = 1.5;
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

    // Floating Battle Log with High-Legibility Font
    if (battle.log) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.fillRect(w * 0.12, h * 0.04, w * 0.76, 44);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(w * 0.12, h * 0.04, w * 0.76, 44);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 15px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(battle.log, w / 2, h * 0.04 + 28);
    }
  }

  private renderRhythmBar(ctx: CanvasRenderingContext2D, w: number, h: number, battle: any): void {
    const barW = Math.min(500, w * 0.8);
    const barH = 36;
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
    ctx.fillStyle = 'rgba(16, 185, 129, 0.65)';
    ctx.fillRect(winX, barY + 2, winW, barH - 4);

    // Beat Cursor
    const curX = barX + battle.rhythmCursor * barW;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ffffff';
    ctx.shadowBlur = 12;
    ctx.fillRect(curX - 4, barY - 4, 8, barH + 8);
    ctx.shadowBlur = 0;

    // Instruction Banner
    ctx.fillStyle = '#fbbf24';
    ctx.font = '800 16px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ HIT [SPACE] OR CLICK WHEN CURSOR IS IN THE GREEN ZONE! ⚡', w / 2, barY - 12);

    // Rhythm Result Popup
    if (battle.rhythmResult) {
      ctx.font = '800 24px Fredoka, sans-serif';
      ctx.fillStyle = battle.rhythmResult === 'PERFECT' ? '#10b981' : (battle.rhythmResult === 'GREAT' ? '#38bdf8' : '#ef4444');
      ctx.fillText(`✨ ${battle.rhythmResult}! ✨`, w / 2, barY + barH + 28);
    }
  }

  private drawSpiritBattleSprite(ctx: CanvasRenderingContext2D, x: number, y: number, spirit: StreamSpirit, scale: number): void {
    ctx.save();
    ctx.translate(x, y);

    ctx.shadowColor = spirit.color;
    ctx.shadowBlur = 16;
    ctx.font = `${Math.floor(42 * scale)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(spirit.avatar || '🐱', 0, 0);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 15px Fredoka, sans-serif';
    ctx.fillText(`${spirit.name} [${spirit.type.toUpperCase()}]`, 0, 34 * scale);
    ctx.restore();
  }

  private drawBossSprite(ctx: CanvasRenderingContext2D, x: number, y: number, avatar: string, name: string, scale: number): void {
    ctx.save();
    ctx.translate(x, y);

    ctx.shadowColor = '#ef4444';
    ctx.shadowBlur = 20;
    ctx.font = `${Math.floor(44 * scale)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(avatar, 0, 0);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ef4444';
    ctx.font = '800 16px Fredoka, sans-serif';
    ctx.fillText(name, 0, 36 * scale);
    ctx.restore();
  }

  /* ---------------- INDIVIDUAL AUDIO MATCH RADARS ---------------- */
  private renderAudioMatchRadar(state: GameState, w: number, h: number): void {
    const ctx = this.ctx;
    const t = state.time;
    const match = state.audioMatch!;
    const centerX = w / 2;
    const centerY = h * 0.40;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    // Title Header
    let challengeTitle = '🎛️ WAVEFORM EQUALIZER CHALLENGE';
    if (match.challengeType === 'call_response') challengeTitle = '🎹 CALL & RESPONSE MELODY JAM';
    else if (match.challengeType === 'rhythm_pulse') challengeTitle = '🥁 RHYTHM PULSE BEAT SYNC';

    ctx.fillStyle = '#fde047';
    ctx.font = '800 18px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(challengeTitle, centerX, 45);

    if (match.challengeType === 'waveform_slider') {
      // ---------------- WAVEFORM ALIGNMENT ----------------
      const isAligned = Math.abs(match.playerFreq - match.targetFreq) < 7;
      
      // Target Waveform (Cyan / Green)
      ctx.strokeStyle = isAligned ? '#10b981' : 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = isAligned ? 5 : 2;
      ctx.beginPath();
      for (let x = 60; x < w - 60; x += 4) {
        const y = centerY + Math.sin(x * 0.04 + t * 5) * 45;
        if (x === 60) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      // Player Waveform (Magenta / Green)
      ctx.strokeStyle = isAligned ? '#10b981' : '#ec4899';
      ctx.lineWidth = isAligned ? 5 : 3;
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
        ctx.font = '800 16px Fredoka, sans-serif';
        ctx.fillText(`✨ HOLDING FREQUENCY... (${Math.floor(holdPct * 100)}%) ✨`, centerX, centerY - 80);
        
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(centerX - 100, centerY - 65, 200, 10);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(centerX - 100, centerY - 65, 200 * holdPct, 10);
      } else {
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 15px Fredoka, sans-serif';
        ctx.fillText('👉 Drag the slider below until the waveforms overlap and turn GREEN!', centerX, centerY - 80);
      }

    } else if (match.challengeType === 'call_response') {
      // ---------------- CALL & RESPONSE ----------------
      ctx.fillStyle = match.isListeningToPlayer ? '#38bdf8' : '#fbbf24';
      ctx.font = '800 17px Fredoka, sans-serif';
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
        ctx.font = '800 14px Fredoka, sans-serif';
        ctx.fillText(padLabels[i], px + padW / 2, py + padH / 2 + 5);
      }

    } else if (match.challengeType === 'rhythm_pulse') {
      // ---------------- RHYTHM PULSE RING ----------------
      ctx.strokeStyle = '#06b6d4';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(centerX, centerY, match.targetRadius, 0, Math.PI * 2);
      ctx.stroke();

      const diff = Math.abs(match.pulseRadius - match.targetRadius);
      ctx.strokeStyle = diff < 18 ? '#10b981' : 'rgba(236, 72, 153, 0.7)';
      ctx.lineWidth = diff < 18 ? 6 : 3;
      ctx.beginPath();
      ctx.arc(centerX, centerY, match.pulseRadius, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#fbbf24';
      ctx.font = '800 22px Fredoka, sans-serif';
      ctx.fillText(`🔥 COMBO: ${match.combo} / 3 🔥`, centerX, centerY - 130);

      if (match.feedback) {
        ctx.fillStyle = match.feedback.includes('ON BEAT') ? '#10b981' : '#ef4444';
        ctx.font = '800 17px Fredoka, sans-serif';
        ctx.fillText(match.feedback, centerX, centerY + match.targetRadius + 30);
      }
    }

    // Creature Badge (Bottom)
    const spirit = match.spiritToUnlock;
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 20px Fredoka, sans-serif';
    ctx.fillText(`${spirit.name} • ${spirit.vibeTag}`, centerX, h * 0.86);

    ctx.font = '42px sans-serif';
    ctx.fillText(spirit.avatar || '🎷', centerX, centerY + (match.challengeType === 'call_response' ? 80 : 0));
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
