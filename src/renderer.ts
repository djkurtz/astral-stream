import { GameState } from './types';

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
      this.renderWorldScene(state, w, h);
    }

    // Static / Glitch Overlay if active
    if (state.glitchActive && !state.zoneClean) {
      this.renderGlitchOverlay(w, h);
    }

    // Cleansing Cinematic Shockwave
    if (state.mode === 'cleansing_cinematic') {
      this.renderCleansingWave(state, w, h);
    }
  }

  private renderWorldScene(state: GameState, w: number, h: number): void {
    const ctx = this.ctx;
    const t = state.time;

    // 1. Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    if (state.zoneClean) {
      skyGrad.addColorStop(0, '#1e1b4b');
      skyGrad.addColorStop(0.5, '#4c1d95');
      skyGrad.addColorStop(1, '#ec4899');
    } else {
      skyGrad.addColorStop(0, '#0f172a');
      skyGrad.addColorStop(0.6, '#334155');
      skyGrad.addColorStop(1, '#64748b');
    }
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h);

    // Stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 40; i++) {
      const sx = (i * 73 + t * 5) % w;
      const sy = (i * 37) % (h * 0.5);
      const twinkle = Math.sin(t * 3 + i) * 0.5 + 0.5;
      ctx.globalAlpha = twinkle * 0.8;
      ctx.fillRect(sx, sy, 2, 2);
    }
    ctx.globalAlpha = 1.0;

    // 2. Ocean Waves
    const seaY = h * 0.58;
    ctx.fillStyle = state.zoneClean ? '#0284c7' : '#1e293b';
    ctx.fillRect(0, seaY, w, h - seaY);

    for (let i = 0; i < 4; i++) {
      ctx.fillStyle = state.zoneClean ? `rgba(6, 182, 212, ${0.4 - i * 0.08})` : `rgba(51, 65, 85, ${0.4 - i * 0.08})`;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 20) {
        const wy = seaY + i * 15 + Math.sin(x * 0.02 + t * 2 + i) * 8;
        ctx.lineTo(x, wy);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fill();
    }

    // 3. Pastel Beach Shoreline
    const sandY = h * 0.72;
    ctx.fillStyle = state.zoneClean ? '#fbcfe8' : '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 30) {
      const sy = sandY + Math.sin(x * 0.015 + 1) * 12;
      ctx.lineTo(x, sy);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // 4. Pixel Palm Trees
    this.drawPixelPalm(ctx, w * 0.12, sandY - 20, state.zoneClean);
    this.drawPixelPalm(ctx, w * 0.88, sandY - 10, state.zoneClean);

    // 5. Render Characters & Animal Companions
    const playerX = w * 0.42;
    const playerY = sandY + 25;
    this.drawPixelPlayer(ctx, playerX, playerY, t);

    // Active Starter Spirit (Chime-Cat)
    if (state.streamQueue.length > 0) {
      const cat = state.streamQueue[0];
      const catX = playerX - 55;
      const catY = playerY + Math.sin(t * 4) * 4;
      this.drawSpiritSprite(ctx, catX, catY, cat.avatar, cat.name, cat.color);
    }

    // Recruited Rival Jax & Bass-Hound
    if (state.activeCompanion) {
      const jaxX = playerX + 70;
      const jaxY = playerY + 5;
      this.drawPixelRival(ctx, jaxX, jaxY, t);

      const dogX = jaxX + 50;
      const dogY = jaxY + Math.sin(t * 3.5) * 4;
      this.drawSpiritSprite(ctx, dogX, dogY, state.activeCompanion.spirit.avatar, state.activeCompanion.spirit.name, state.activeCompanion.spirit.color);
    }

    // Floating Cleansing Petals if clean
    if (state.zoneClean) {
      this.renderCelebrationParticles(ctx, w, h);
    }
  }

  private renderAudioMatchRadar(state: GameState, w: number, h: number): void {
    const ctx = this.ctx;
    const t = state.time;
    const match = state.audioMatch!;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    const centerX = w / 2;
    const centerY = h * 0.42;

    // Glowing Concentric Radar Rings (Shazam Style)
    for (let r = 40; r <= 180; r += 35) {
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Rotating Radar Sweep Beam
    const sweepAngle = t * 3;
    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(sweepAngle);
    const beamGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 180);
    beamGrad.addColorStop(0, 'rgba(6, 182, 212, 0.4)');
    beamGrad.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, 180, 0, Math.PI * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Sound Spectrum Equalizer Bars (Bottom of Radar)
    const barCount = 24;
    const barW = (w * 0.7) / barCount;
    const startX = w * 0.15;
    const baseBarY = h * 0.75;

    for (let i = 0; i < barCount; i++) {
      const freqHeight = Math.abs(Math.sin(t * 6 + i * 0.4)) * 45 + 10;
      const syncMultiplier = match.currentSync / 100;
      const barH = freqHeight * (0.4 + syncMultiplier * 0.8);

      ctx.fillStyle = match.isMatched 
        ? '#10b981' 
        : (i % 2 === 0 ? '#06b6d4' : '#ec4899');
      ctx.fillRect(startX + i * barW + 2, baseBarY - barH, barW - 4, barH);
    }

    // Audio Match Sync Indicator
    if (match.isMatched) {
      ctx.fillStyle = '#10b981';
      ctx.font = '700 24px Rajdhani';
      ctx.textAlign = 'center';
      ctx.fillText('✨ AUDIO MATCH 100%! DOWNLOADING STREAM... ✨', centerX, centerY - 110);
    } else {
      ctx.fillStyle = '#06b6d4';
      ctx.font = '700 20px Rajdhani';
      ctx.textAlign = 'center';
      ctx.fillText(`SONIC RADAR: LISTENING TO AMBIENT VIBE... (${match.currentSync}%)`, centerX, centerY - 110);
    }

    // Target Creature Card
    const spirit = match.spiritToUnlock;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 20px Rajdhani';
    ctx.textAlign = 'center';
    ctx.fillText(`${spirit.name} • ${spirit.vibeTag}`, centerX, h * 0.84);

    ctx.font = '46px sans-serif';
    ctx.fillText(spirit.avatar, centerX, centerY);
  }

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
      ctx.moveTo(x, h * 0.4);
      ctx.lineTo((x - w / 2) * 2 + w / 2, h);
      ctx.stroke();
    }

    // 1. Player Spirit (Left)
    const pSpirit = battle.playerSpirit;
    const px = w * 0.25;
    const py = h * 0.65;

    ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
    ctx.beginPath();
    ctx.ellipse(px, py + 25, 70, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    this.drawSpiritSprite(ctx, px, py + Math.sin(t * 4) * 5, pSpirit.avatar, pSpirit.name, pSpirit.color, 1.4);

    // 2. Enemy (Right)
    const ex = w * 0.75;
    const ey = h * 0.45;

    ctx.fillStyle = battle.type === 'boss' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(168, 85, 247, 0.3)';
    ctx.beginPath();
    ctx.ellipse(ex, ey + 25, 80, 24, 0, 0, Math.PI * 2);
    ctx.fill();

    if (battle.type === 'boss' && battle.enemyBoss) {
      const boss = battle.enemyBoss;
      const jx = ex + (Math.random() - 0.5) * (boss.glitchIntensity * 12);
      const jy = ey + (Math.random() - 0.5) * (boss.glitchIntensity * 8);
      this.drawSpiritSprite(ctx, jx, jy, boss.avatar, boss.name, '#ef4444', 2.0);
    } else if (battle.enemySpirit) {
      const eSpirit = battle.enemySpirit;
      this.drawSpiritSprite(ctx, ex, ey + Math.sin(t * 3.5 + 1) * 5, eSpirit.avatar, eSpirit.name, eSpirit.color, 1.4);
    }

    // Floating Battle Log
    if (battle.log) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(w * 0.15, h * 0.05, w * 0.7, 45);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(w * 0.15, h * 0.05, w * 0.7, 45);

      ctx.fillStyle = '#f8fafc';
      ctx.font = '600 16px Rajdhani';
      ctx.textAlign = 'center';
      ctx.fillText(battle.log, w / 2, h * 0.05 + 28);
    }
  }

  private renderGlitchOverlay(w: number, h: number): void {
    const ctx = this.ctx;

    // Scanlines
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 2);
    }

    // Static Noise Lines
    if (Math.random() < 0.4) {
      const stripY = Math.random() * h;
      const stripH = Math.random() * 25 + 5;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fillRect(0, stripY, w, stripH);
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

  private drawSpiritSprite(ctx: CanvasRenderingContext2D, x: number, y: number, avatar: string, name: string, color: string, scale: number = 1.0): void {
    ctx.save();
    ctx.translate(x, y);

    ctx.shadowColor = color;
    ctx.shadowBlur = 15;

    ctx.font = `${Math.floor(36 * scale)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(avatar, 0, 0);

    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 13px Rajdhani';
    ctx.fillText(name, 0, 28 * scale);
    ctx.restore();
  }

  private drawPixelPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, t: number): void {
    ctx.save();
    ctx.translate(x, y);

    // Player Sprite
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(-10, -32, 20, 22);

    ctx.fillStyle = '#fcd34d';
    ctx.fillRect(-8, -46, 16, 14);

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-12, -48, 24, 6);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-8, -10, 7, 12);
    ctx.fillRect(1, -10, 7, 12);

    // Glowing Vibe-Phone in hand
    const bounce = Math.sin(t * 4) * 2;
    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 10;
    ctx.fillRect(12, -24 + bounce, 7, 13);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(13, -22 + bounce, 5, 9);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  private drawPixelRival(ctx: CanvasRenderingContext2D, x: number, y: number, t: number): void {
    ctx.save();
    const headBop = Math.sin(t * 4) * 2;
    ctx.translate(x, y + headBop);

    // Jax Sprite
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-10, -34, 20, 24);

    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-8, -48, 16, 14);

    ctx.fillStyle = '#a855f7';
    ctx.fillRect(-10, -52, 20, 6);

    // Spiked Electric Bass
    const strum = Math.sin(t * 8) * 1.5;
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(-16, -26 + strum, 6, 20);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-14, -40 + strum, 2, 14);

    ctx.restore();
  }

  private drawPixelPalm(ctx: CanvasRenderingContext2D, x: number, y: number, isClean: boolean): void {
    ctx.save();
    ctx.translate(x, y);

    ctx.fillStyle = isClean ? '#b45309' : '#475569';
    ctx.fillRect(-4, -60, 8, 60);

    ctx.fillStyle = isClean ? '#10b981' : '#64748b';
    ctx.beginPath();
    ctx.arc(0, -60, 28, 0, Math.PI, true);
    ctx.fill();

    if (isClean) {
      ctx.fillStyle = '#ec4899';
      ctx.fillRect(-8, -58, 4, 4);
      ctx.fillRect(4, -58, 4, 4);
    }

    ctx.restore();
  }
}
