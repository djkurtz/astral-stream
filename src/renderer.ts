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
    } else if (state.mode === 'tuning_tutorial' && state.tuning) {
      this.renderTuningOscilloscope(state, w, h);
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

  private renderTuningOscilloscope(state: GameState, w: number, h: number): void {
    const ctx = this.ctx;
    const t = state.time;
    const tuning = state.tuning!;

    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, w, h);

    // Grid Lines
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Oscilloscope Frame
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, w - 60, h - 60);

    const centerY = h * 0.45;
    const diff = Math.abs(tuning.currentFrequency - tuning.targetFrequency);
    const isSynced = diff < tuning.tolerance;

    // Target Waveform (Cyan)
    ctx.strokeStyle = isSynced ? '#10b981' : 'rgba(56, 189, 248, 0.5)';
    ctx.lineWidth = isSynced ? 4 : 2;
    ctx.beginPath();
    for (let x = 40; x < w - 40; x += 4) {
      const y = centerY + Math.sin(x * 0.05 + t * 4) * 45;
      if (x === 40) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Player Tuner Waveform (Magenta / Green)
    ctx.strokeStyle = isSynced ? '#10b981' : '#f43f5e';
    ctx.lineWidth = isSynced ? 4 : 3;
    ctx.beginPath();
    const playerFreqScale = 0.02 + (tuning.currentFrequency / 100) * 0.04;
    for (let x = 40; x < w - 40; x += 4) {
      const y = centerY + Math.sin(x * playerFreqScale + t * 5) * 50;
      if (x === 40) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Resonance Pulse on Sync
    if (isSynced) {
      const pulseSize = (t * 100) % 120;
      ctx.strokeStyle = `rgba(16, 185, 129, ${1 - pulseSize / 120})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(w / 2, centerY, pulseSize, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.font = '700 24px Rajdhani';
      ctx.textAlign = 'center';
      ctx.fillText('✨ FREQUENCY LOCKED! DOWNLOADING SPIRIT... ✨', w / 2, centerY - 80);
    }

    // Creature Preview
    const spirit = tuning.spiritToUnlock;
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 20px Rajdhani';
    ctx.textAlign = 'center';
    ctx.fillText(`Target: ${spirit.name} (${tuning.targetFrequency.toFixed(1)} FM)`, w / 2, h * 0.78);

    ctx.font = '40px sans-serif';
    ctx.fillText(spirit.avatar, w / 2, h * 0.88);
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

    // Platform
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
      // Glitch Jitter
      const jx = ex + (Math.random() - 0.5) * (boss.glitchIntensity * 12);
      const jy = ey + (Math.random() - 0.5) * (boss.glitchIntensity * 8);
      this.drawSpiritSprite(ctx, jx, jy, boss.avatar, boss.name, '#ef4444', 2.0);
    } else if (battle.enemySpirit) {
      const eSpirit = battle.enemySpirit;
      this.drawSpiritSprite(ctx, ex, ey + Math.sin(t * 3.5 + 1) * 5, eSpirit.avatar, eSpirit.name, eSpirit.color, 1.4);
    }

    // Floating Battle Log
    if (battle.log) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
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
    const progress = state.cleansingProgress; // 0 to 1
    const radius = progress * Math.hypot(w, h);

    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, radius);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
    grad.addColorStop(0.4, 'rgba(6, 182, 212, 0.7)');
    grad.addColorStop(0.8, 'rgba(236, 72, 153, 0.5)');
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

    // Glow aura
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
    ctx.fillRect(-10, -32, 20, 22); // Jacket

    ctx.fillStyle = '#fcd34d';
    ctx.fillRect(-8, -46, 16, 14); // Head/Face

    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-12, -48, 24, 6); // Headphones

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-8, -10, 7, 12); // Legs
    ctx.fillRect(1, -10, 7, 12);

    // Glowing Astral Tuner in hand
    const bounce = Math.sin(t * 4) * 2;
    ctx.fillStyle = '#06b6d4';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 8;
    ctx.fillRect(12, -24 + bounce, 8, 12);
    ctx.shadowBlur = 0;

    ctx.restore();
  }

  private drawPixelRival(ctx: CanvasRenderingContext2D, x: number, y: number, t: number): void {
    ctx.save();
    const headBop = Math.sin(t * 4) * 2;
    ctx.translate(x, y + headBop);

    // Jax Sprite
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-10, -34, 20, 24); // Spiked Jacket

    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(-8, -48, 16, 14); // Face

    ctx.fillStyle = '#a855f7';
    ctx.fillRect(-10, -52, 20, 6); // Purple hair

    // Spiked Electric Bass
    const strum = Math.sin(t * 8) * 1.5;
    ctx.fillStyle = '#ec4899';
    ctx.fillRect(-16, -26 + strum, 6, 20); // Bass body
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-14, -40 + strum, 2, 14); // Bass neck

    ctx.restore();
  }

  private drawPixelPalm(ctx: CanvasRenderingContext2D, x: number, y: number, isClean: boolean): void {
    ctx.save();
    ctx.translate(x, y);

    // Trunk
    ctx.fillStyle = isClean ? '#b45309' : '#475569';
    ctx.fillRect(-4, -60, 8, 60);

    // Fronds
    ctx.fillStyle = isClean ? '#10b981' : '#64748b';
    ctx.beginPath();
    ctx.arc(0, -60, 28, 0, Math.PI, true);
    ctx.fill();

    if (isClean) {
      ctx.fillStyle = '#ec4899'; // Neon coconuts/flowers
      ctx.fillRect(-8, -58, 4, 4);
      ctx.fillRect(4, -58, 4, 4);
    }

    ctx.restore();
  }
}
