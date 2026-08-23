import { GameState, StreamSpirit, MusicalShrine, NPCEntity } from './types';

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
    for (let i = 0; i < 100; i++) {
      this.particles.push({
        x: Math.random() * 1280,
        y: Math.random() * 720,
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

    const worldW = 3200;
    const worldH = 2400;
    const camX = state.camera.x;
    const camY = state.camera.y;

    ctx.save();
    ctx.translate(-camX, -camY);

    // 1. Lush Green Grass Foundation
    ctx.fillStyle = '#166534';
    ctx.fillRect(0, 0, worldW, worldH);

    // Natural Contoured Boundaries & 3D Topography
    this.drawWesternSeaCliffs(ctx, worldH, t);
    this.drawNorthernMountains(ctx, worldW, t);
    this.drawEasternPalisades(ctx, worldW, worldH, t);
    this.draw3DTerrainContours(ctx, worldW, worldH, t);
    this.drawCobblestonePathNetwork(ctx, t);
    this.drawMusicalFloraAndLandmarks(ctx, t);

    // Decorative grass patches
    ctx.fillStyle = '#15803d';
    for (let x = 160; x < worldW - 140; x += 80) {
      for (let y = 140; y < 2000; y += 80) {
        if ((x + y) % 60 === 0) {
          ctx.fillRect(x, y, 8, 4);
          ctx.fillRect(x + 4, y - 4, 4, 8);
        }
      }
    }

    // 2. South Beach Dunes & Multi-Tier Undulating Ocean Surf
    this.drawSandDunes(ctx, worldW, t);
    this.drawOceanSurf(ctx, worldW, worldH, t);

    // 3. 3D Palm Trees on South Dunes (Matching WORLD_OBSTACLES)
    this.drawPalmTree(ctx, 280, 2050, t, 0);
    this.drawPalmTree(ctx, 480, 2080, t, 1);
    this.drawPalmTree(ctx, 780, 2040, t, 2);
    this.drawPalmTree(ctx, 1020, 2070, t, 3);
    this.drawPalmTree(ctx, 1300, 2060, t, 4);

    // 4. West Pier & Boardwalk with 3D Dock Posts & Sea Reflections
    this.drawWestPier(ctx, t);

    // 5. East Pier Boardwalk & Extensions
    this.drawEastPier(ctx, t);

    // 6. Central Cobblestone Plaza (Cadence Plaza)
    const plazaX = 1180;
    const plazaY = 1120;
    const plazaW = 900;
    const plazaH = 640;

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

    // Decorative Plaza Border Curbs with 3D Bevel
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 6;
    ctx.strokeRect(plazaX, plazaY, plazaW, plazaH);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.strokeRect(plazaX + 3, plazaY + 3, plazaW - 6, plazaH - 6);

    // Connecting Stone Walkway to East Grove
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(plazaX + plazaW, 1400, 150, 80);
    ctx.strokeStyle = '#94a3b8';
    ctx.strokeRect(plazaX + plazaW, 1400, 150, 80);

    // Connecting Stone Walkway to South Dunes / Port Resonata
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(1560, plazaY + plazaH, 80, 300);
    ctx.strokeStyle = '#94a3b8';
    ctx.strokeRect(1560, plazaY + plazaH, 80, 300);

    // 7. East Taiko Bamboo Grove with 3D Stone Lanterns
    this.drawBambooGrove(ctx, t);

    // 8. North Ancient Sound Ruins with Floating 3D Monolith Blocks
    this.drawAncientRuins(ctx, t);

    // 9. Sonic Vines blocking North Passage to Desolation Ridge
    this.drawSonicVines(ctx, t, state.questStage);

    // 10. Desolation Ridge Terrain & Glitch Gate (Northwest)
    this.drawGlitchGate(ctx, 520, 270, 160, 60, state.glitchActive, t);
    this.drawRuinColumn(ctx, 400, 400, 65);
    this.drawRuinColumn(ctx, 800, 400, 65);

    // 11. Plaza Perimeter Scenery: Trees & Streetlamps
    this.drawTree(ctx, 1140, 1200);
    this.drawTree(ctx, 1140, 1400);
    this.drawTree(ctx, 1140, 1600);
    this.drawTree(ctx, 2120, 1200);
    this.drawTree(ctx, 2120, 1600);

    this.drawStreetLamp(ctx, 1280, 1380, t);
    this.drawStreetLamp(ctx, 1920, 1380, t);
    this.drawStreetLamp(ctx, 1280, 1620, t);
    this.drawStreetLamp(ctx, 1920, 1620, t);
    this.drawStreetLamp(ctx, 1600, 1260, t);
    this.drawStreetLamp(ctx, 1600, 1640, t);

    // 12. Center Plaza Buildings
    // Neon Cafe (Top Left)
    this.drawNeonCafe(ctx, 1230, 1180, 260, 160, t);
    // Vinyl Record Den (Top Right of Plaza)
    this.drawVinylDen(ctx, 1780, 1180, 260, 160, t);

    // 13. Musical Centerpiece Fountain (Harmony Fountain)
    this.drawMusicalFountain(ctx, 1600, 1450, t);

    // 14. Ancient Musical Tradition Shrines (Cultural Biome Sanctuaries)
    for (const shrine of state.soundRipples) {
      this.drawMusicalShrine(ctx, shrine, t);
    }

    // 15. Floating Collectible Items
    if (state.items) {
      for (const item of state.items) {
        if (!item.collected) {
          this.drawCollectibleItem(ctx, item.x, item.y, item.icon, item.name, t);
        }
      }
    }

    // 16. Wild Static Glitches & Roaming Monsters
    for (const g of state.wildGlitches) {
      if (!g.defeated) {
        this.drawWildGlitch(ctx, g.x, g.y, g.spirit, t, !!g.isAlerted);
      }
    }

    // 17. NPCs & Musical Pets (Active in prologue & restored in victory)
    for (const npc of state.npcs) {
      this.drawPixelNPC(ctx, npc, t, state.questStage);
    }

    // 18. Player Character
    this.drawDetailedPlayer(ctx, state.player.x, state.player.y, state.player.dir, state.player.isMoving, t);

    // Follower Companions (Lead Active Spirit + Bass-Hound following in player's footsteps)
    const getFollowerCoords = (orderIdx: number) => {
      const trail = state.followerTrail || [];
      const trailSampleIdx = Math.min(trail.length - 1, (orderIdx + 1) * 7);
      
      let fx = state.player.x;
      let fy = state.player.y;
      
      if (trail.length > trailSampleIdx && trailSampleIdx >= 0) {
        fx = trail[trailSampleIdx].x;
        fy = trail[trailSampleIdx].y;
      } else {
        // Fallback when standing still: trail behind facing direction
        const offset = 22 * (orderIdx + 1);
        if (state.player.dir === 'up') fy += offset;
        else if (state.player.dir === 'down') fy -= offset;
        else if (state.player.dir === 'left') fx += offset;
        else if (state.player.dir === 'right') fx -= offset;
      }

      // Party Boundary Safety: Never let the cat or any companion step into ocean water or off docks
      const onWP = (fx >= 142 && fx <= 298 && fy >= 2040 && fy <= 2198);
      const onEPMain = (fx >= 802 && fx <= 1398 && fy >= 2120 && fy <= 2178);
      const onEPJetty = (fx >= 898 && fx <= 942 && fy <= 2218) ||
                        (fx >= 1098 && fx <= 1142 && fy <= 2218) ||
                        (fx >= 1298 && fx <= 1342 && fy <= 2218);
      const onPier = onWP || onEPMain || onEPJetty;

      // If follower coordinates would touch water or cliffs, snap safely to player
      if (fy > 2198 && !onPier) { fx = state.player.x; fy = state.player.y; }
      if (fx < 140 && fy > 1980 && !onWP) { fx = state.player.x; fy = state.player.y; }
      if (fx > 298 && fx < 800 && fy > 2040) { fx = state.player.x; fy = state.player.y; }

      return { x: fx, y: fy + Math.sin(t * 6 + orderIdx * 1.2) * 2.5 };
    };

    const drawCompanionSprite = (spiritId: string, cx: number, cy: number) => {
      if (spiritId === 'spirit_chime_cat') this.drawDetailedCat(ctx, cx, cy, t);
      else if (spiritId === 'spirit_bass_hound') this.drawDetailedHound(ctx, cx, cy, t);
      else if (spiritId === 'spirit_allegro_owl') this.drawDetailedOwl(ctx, cx, cy, t);
      else if (spiritId === 'spirit_sitar_swan') this.drawDetailedSwan(ctx, cx, cy, t);
      else if (spiritId === 'spirit_taiko_tanuki') this.drawDetailedTanuki(ctx, cx, cy, t);
      else {
        const spirit = state.streamQueue.find(s => s.id === spiritId);
        if (spirit) this.drawGenericCompanion(ctx, cx, cy, spirit, t);
      }
    };

    // Overworld Follower: Only the single active sampled song is manifested at a time
    if (state.streamQueue.length > 0) {
      const active = state.streamQueue[state.activeSpiritIndex] || state.streamQueue[0];
      const pos0 = getFollowerCoords(0);
      drawCompanionSprite(active.id, pos0.x, pos0.y);
    }

    // 19. Unified Proximity Identity & Interaction Card
    if (state.nearbyInteractable) {
      const target = state.nearbyInteractable;
      const tx = target.x;
      const ty = target.y - 50;

      let promptText = '';
      let subText = '';
      let accentColor = '#06b6d4';

      if ('spirit' in target && 'defeated' in target) {
        promptText = `⚔️ [SPACE] Battle ${(target as any).name}`;
        subText = `Wild Static Glitch • Lvl ${(target as any).spirit.level || 1}`;
        accentColor = '#ef4444';
      } else if ('collected' in target) {
        promptText = `✨ [SPACE] Collect ${(target as any).name}`;
        subText = (target as any).effect || 'Valuable Audio Artifact';
        accentColor = '#fbbf24';
      } else if ('tradition' in target) {
        const s = target as any;
        const icon = s.challengeType === 'waveform_slider' ? '🎻' : (s.challengeType === 'call_response' ? '🪕' : '🥁');
        promptText = `${icon} [SPACE] Attune at ${s.name}`;
        subText = `${s.tradition} • ${s.biome}`;
        accentColor = '#f59e0b';
      } else if ('name' in target) {
        if (target.id === 'npc_gate') {
          promptText = state.activeCompanion === 'jax' ? '⚠️ [SPACE] Breach Glitch Gate' : '⚠️ [SPACE] Inspect Gate';
          subText = 'Threshold to Dead Channel 000';
          accentColor = '#a855f7';
        } else if (target.actionType === 'battle_jax') {
          promptText = state.activeCompanion === 'jax' ? '💬 [SPACE] Talk to Jax' : '⚔️ [SPACE] Duel Jax';
          subText = 'Underground Bassist & Rebel Leader';
          accentColor = '#c084fc';
        } else {
          promptText = `💬 [SPACE] Talk to ${target.name}`;
          subText = (target as any).title || 'Cadence Plaza Resident';
          accentColor = '#38bdf8';
        }
      }

      ctx.font = '700 13px Fredoka, sans-serif';
      const mainW = ctx.measureText(promptText).width;
      ctx.font = '500 11px Fredoka, sans-serif';
      const subW = ctx.measureText(subText).width;
      const pillW = Math.max(190, Math.max(mainW, subW) + 36);
      const pillH = 38;

      // Card Background & Neon Border
      ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(tx - pillW / 2, ty - pillH / 2, pillW, pillH, 8);
      ctx.fill();
      ctx.stroke();

      // Top Line: Action Prompt
      ctx.fillStyle = '#ffffff';
      ctx.font = '700 13px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(promptText, tx, ty - 4);

      // Bottom Line: Identity & Lore
      ctx.fillStyle = accentColor;
      ctx.font = '600 11px Fredoka, sans-serif';
      ctx.fillText(subText, tx, ty + 12);
    }

    ctx.restore();

    // Celebration particles if clean
    if (state.zoneClean && state.mode === 'victory') {
      this.renderCelebrationParticles(ctx, w, h);
    }
  }

  /* ---------------- DETAILED SCENERY & 3D DIORAMA ---------------- */
  private drawWesternSeaCliffs(ctx: CanvasRenderingContext2D, worldH: number, t: number): void {
    // 1. Deep Oceanic Abyss on the far west
    ctx.fillStyle = '#0369a1';
    ctx.fillRect(0, 0, 100, worldH);

    // 2. Multi-tier Craggy Rocky Cliff Faces
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(80, 0, 40, worldH);

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(90, 0);
    for (let y = 0; y <= worldH; y += 40) {
      const jx = 100 + Math.sin(y * 0.02) * 14 + Math.cos(y * 0.05) * 8;
      ctx.lineTo(jx, y);
    }
    ctx.lineTo(130, worldH);
    ctx.lineTo(90, worldH);
    ctx.closePath();
    ctx.fill();

    // 3. Cliff Top Edge / Contour Bevel
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.moveTo(110, 0);
    for (let y = 0; y <= worldH; y += 30) {
      const cx = 120 + Math.sin(y * 0.025 + 1) * 10;
      ctx.lineTo(cx, y);
    }
    ctx.lineTo(135, worldH);
    ctx.lineTo(110, worldH);
    ctx.closePath();
    ctx.fill();

    // 4. Crashing Ocean Surf & Foam at Cliff Base
    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    for (let y = 30; y < worldH - 100; y += 50) {
      const wave = Math.sin(t * 4 + y * 0.1) * 6;
      ctx.beginPath();
      ctx.ellipse(85 + wave, y, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  private drawNorthernMountains(ctx: CanvasRenderingContext2D, _worldW: number, _t: number): void {
    // Majestic Jagged Mountain Peaks forming the natural Northern Barrier
    const peaks = [
      { x: 100, w: 220, h: 90 }, { x: 300, w: 260, h: 105 }, { x: 540, w: 240, h: 95 },
      { x: 760, w: 280, h: 110 }, { x: 1020, w: 250, h: 100 }, { x: 1250, w: 270, h: 115 },
      { x: 1500, w: 300, h: 120 }, { x: 1780, w: 260, h: 105 }, { x: 2020, w: 280, h: 110 },
      { x: 2280, w: 250, h: 100 }, { x: 2510, w: 270, h: 115 }, { x: 2760, w: 260, h: 105 },
      { x: 3000, w: 220, h: 95 }
    ];

    // Mountain Shadows (Back)
    ctx.fillStyle = '#0f172a';
    for (const p of peaks) {
      ctx.beginPath();
      ctx.moveTo(p.x - p.w / 2, 100);
      ctx.lineTo(p.x, 100 - p.h);
      ctx.lineTo(p.x + p.w / 2, 100);
      ctx.closePath();
      ctx.fill();
    }

    // Mountain Slopes (Lit side)
    ctx.fillStyle = '#334155';
    for (const p of peaks) {
      ctx.beginPath();
      ctx.moveTo(p.x - p.w / 2, 100);
      ctx.lineTo(p.x, 100 - p.h);
      ctx.lineTo(p.x, 100);
      ctx.closePath();
      ctx.fill();
    }

    // Snowcaps / Resonant Crystal Tips
    ctx.fillStyle = '#cbd5e1';
    for (const p of peaks) {
      ctx.beginPath();
      ctx.moveTo(p.x - 20, 100 - p.h * 0.75);
      ctx.lineTo(p.x, 100 - p.h);
      ctx.lineTo(p.x + 20, 100 - p.h * 0.75);
      ctx.lineTo(p.x + 8, 100 - p.h * 0.7);
      ctx.lineTo(p.x - 6, 100 - p.h * 0.72);
      ctx.closePath();
      ctx.fill();
    }
  }

  private drawEasternPalisades(ctx: CanvasRenderingContext2D, _worldW: number, worldH: number, _t: number): void {
    // Impassable Rocky Sea Bluffs & Bamboo Palisade (x: 3080 to 3200)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(3080, 0, 120, worldH);

    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(3100, 0);
    for (let y = 0; y <= worldH; y += 40) {
      const px = 3090 + Math.sin(y * 0.03) * 12;
      ctx.lineTo(px, y);
    }
    ctx.lineTo(3120, worldH);
    ctx.lineTo(3100, worldH);
    ctx.closePath();
    ctx.fill();

    // Natural Palisade Shading
    ctx.fillStyle = '#065f46';
    for (let y = 20; y < worldH - 40; y += 30) {
      ctx.fillRect(3095, y, 16, 24);
    }
  }

  private draw3DTerrainContours(ctx: CanvasRenderingContext2D, _worldW: number, _worldH: number, _t: number): void {
    // 3D Stepped Plateau: Ancient Sound Ruins (x: 2240 to 2960, y: 240 to 880)
    // Drop shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.beginPath();
    ctx.roundRect(2230, 250, 740, 650, 24);
    ctx.fill();
    // Shaded cliff wall
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(2240, 246, 720, 640, 20);
    ctx.fill();
    // Elevated top tier
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(2240, 236, 720, 640, 20);
    ctx.fill();

    // 3D Stepped Terrace: Desolation Ridge (x: 280 to 1040, y: 260 to 860)
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.roundRect(270, 270, 780, 610, 24);
    ctx.fill();
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(280, 266, 760, 600, 20);
    ctx.fill();
    ctx.fillStyle = '#27272a';
    ctx.beginPath();
    ctx.roundRect(280, 256, 760, 600, 20);
    ctx.fill();

    // Enclosing Rock Bluffs around Desolation Ridge (Matching WORLD_OBSTACLES)
    // 1. Southwest Bluff (x: 120 to 580, y: 840 to 920)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(120, 840, 460, 80);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(120, 830, 460, 20);
    ctx.fillStyle = '#334155';
    ctx.fillRect(120, 820, 460, 15);

    // 2. Southeast Bluff (x: 820 to 1040, y: 840 to 920)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(820, 840, 260, 80);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(820, 830, 260, 20);
    ctx.fillStyle = '#334155';
    ctx.fillRect(820, 820, 260, 15);

    // 3. Eastern Escarpment (x: 1040 to 1120, y: 100 to 840)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(1040, 100, 80, 740);
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(1030, 100, 20, 740);

    // Rolling Grassland Elevation Ridges
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.arc(1600, 800, 450, Math.PI * 0.2, Math.PI * 0.8);
    ctx.stroke();
    ctx.strokeStyle = '#14532d';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(1600, 808, 450, Math.PI * 0.2, Math.PI * 0.8);
    ctx.stroke();
  }

  private drawCobblestonePathNetwork(ctx: CanvasRenderingContext2D, t: number): void {
    // Winding Cobblestone Road Segments connecting all biomes to Cadence Plaza
    const paths = [
      // South Beach to Plaza
      { fromX: 550, fromY: 2020, toX: 1300, toY: 1760, cpX: 850, cpY: 1950 },
      // Plaza East to Whispering Bamboo Grove
      { fromX: 2080, fromY: 1440, toX: 2320, toY: 1440, cpX: 2200, cpY: 1440 },
      // Plaza NE to Ancient Sound Ruins
      { fromX: 1950, fromY: 1120, toX: 2400, toY: 880, cpX: 2250, cpY: 1020 },
      // Plaza NW to Desolation Ridge
      { fromX: 1300, fromY: 1120, toX: 850, toY: 860, cpX: 1050, cpY: 1000 }
    ];

    ctx.save();
    for (const p of paths) {
      // Path Shadow / Base Border
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 44;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(p.fromX, p.fromY);
      ctx.quadraticCurveTo(p.cpX, p.cpY, p.toX, p.toY);
      ctx.stroke();

      // Paved Stone Surface
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 38;
      ctx.stroke();

      // Musical Gold Center Inlay
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 3;
      ctx.setLineDash([8, 12]);
      ctx.lineDashOffset = -t * 15;
      ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.restore();
  }

  private drawMusicalFloraAndLandmarks(ctx: CanvasRenderingContext2D, t: number): void {
    // Interactive Musical Flora scattered across open grass
    const flora = [
      // Singing Bass Mushrooms
      { x: 1050, y: 1550, type: 'mushroom', color: '#ec4899', note: '♫' },
      { x: 920, y: 1380, type: 'mushroom', color: '#a855f7', note: '♪' },
      { x: 1850, y: 1850, type: 'mushroom', color: '#06b6d4', note: '♫' },
      { x: 2150, y: 1680, type: 'mushroom', color: '#ec4899', note: '♪' },
      // Resonant Quartz Geodes
      { x: 2180, y: 780, type: 'crystal', color: '#38bdf8' },
      { x: 2600, y: 200, type: 'crystal', color: '#fbbf24' },
      { x: 1120, y: 880, type: 'crystal', color: '#a855f7' },
      { x: 620, y: 1100, type: 'crystal', color: '#f43f5e' },
      // Treble Reeds
      { x: 1450, y: 1920, type: 'reed' },
      { x: 1520, y: 1960, type: 'reed' },
      { x: 1720, y: 1940, type: 'reed' }
    ];

    for (const f of flora) {
      if (f.type === 'mushroom') {
        const bob = Math.sin(t * 6 + f.x) * 3;
        // Stalk
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(f.x - 3, f.y - 8, 6, 8);
        // Cap
        ctx.fillStyle = f.color || '#ec4899';
        ctx.beginPath();
        ctx.arc(f.x, f.y - 8 + bob, 10, Math.PI, 0);
        ctx.fill();
        // Musical note particle
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px sans-serif';
        ctx.fillText(f.note || '♪', f.x - 3, f.y - 14 + bob);
      } else if (f.type === 'crystal') {
        const glow = Math.sin(t * 4 + f.y) * 0.3 + 0.7;
        ctx.save();
        ctx.translate(f.x, f.y);
        ctx.fillStyle = f.color || '#38bdf8';
        ctx.shadowColor = f.color || '#38bdf8';
        ctx.shadowBlur = 10 * glow;
        ctx.beginPath();
        ctx.moveTo(0, -16);
        ctx.lineTo(8, -6);
        ctx.lineTo(5, 4);
        ctx.lineTo(-5, 4);
        ctx.lineTo(-8, -6);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      } else if (f.type === 'reed') {
        const sway = Math.sin(t * 3 + f.x) * 4;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(f.x, f.y);
        ctx.quadraticCurveTo(f.x + sway, f.y - 12, f.x + sway * 1.5, f.y - 24);
        ctx.stroke();
        // Reed head
        ctx.fillStyle = '#78350f';
        ctx.fillRect(f.x + sway * 1.5 - 2, f.y - 24, 4, 8);
      }
    }
  }

  private drawSandDunes(ctx: CanvasRenderingContext2D, worldW: number, _t: number): void {
    // Warm Golden Sand Base
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(0, 2000, worldW, 200);

    // 3D Tiered Dune Shading
    ctx.fillStyle = '#fde68a';
    ctx.beginPath();
    ctx.moveTo(0, 2080);
    for (let x = 0; x <= worldW; x += 40) {
      const dy = 2080 + Math.sin(x * 0.012) * 12 + Math.cos(x * 0.03) * 6;
      ctx.lineTo(x, dy);
    }
    ctx.lineTo(worldW, 2200);
    ctx.lineTo(0, 2200);
    ctx.closePath();
    ctx.fill();

    // Darker Wet Shore Sand Edge
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, 2190, worldW, 10);

    // Decorative Beach Details (Shells, Starfish, Tufts)
    const beachItems = [
      { x: 170, y: 2060, type: 'shell' },
      { x: 390, y: 2090, type: 'star' },
      { x: 510, y: 2040, type: 'grass' },
      { x: 680, y: 2110, type: 'shell' },
      { x: 820, y: 2050, type: 'grass' },
      { x: 950, y: 2100, type: 'star' },
      { x: 1120, y: 2060, type: 'shell' },
      { x: 1280, y: 2080, type: 'grass' },
      { x: 1500, y: 2050, type: 'shell' },
      { x: 1750, y: 2090, type: 'star' }
    ];

    for (const item of beachItems) {
      if (item.type === 'shell') {
        ctx.fillStyle = '#fed7aa';
        ctx.beginPath();
        ctx.arc(item.x, item.y, 4, 0, Math.PI, true);
        ctx.fill();
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else if (item.type === 'star') {
        ctx.fillStyle = '#f43f5e';
        ctx.fillRect(item.x - 2, item.y - 2, 5, 5);
        ctx.fillRect(item.x - 4, item.y, 9, 1);
        ctx.fillRect(item.x, item.y - 4, 1, 9);
      } else {
        ctx.fillStyle = '#15803d';
        ctx.fillRect(item.x, item.y - 5, 2, 6);
        ctx.fillRect(item.x - 3, item.y - 3, 2, 4);
        ctx.fillRect(item.x + 3, item.y - 4, 2, 5);
      }
    }
  }

  private drawOceanSurf(ctx: CanvasRenderingContext2D, worldW: number, worldH: number, t: number): void {
    // 1. Deep Ocean Gradient Base (South Ocean: y > 2200)
    const oceanGrad = ctx.createLinearGradient(0, 2200, 0, worldH);
    oceanGrad.addColorStop(0, '#0ea5e9'); // Turquoise shallows
    oceanGrad.addColorStop(0.25, '#0284c7'); // Azure mid
    oceanGrad.addColorStop(0.65, '#0369a1'); // Deep sea blue
    oceanGrad.addColorStop(1, '#0c4a6e'); // Abyssal navy
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(0, 2200, worldW, worldH - 2200);

    // West Ocean (x < 120)
    const westGrad = ctx.createLinearGradient(0, 0, 120, 0);
    westGrad.addColorStop(0, '#0c4a6e');
    westGrad.addColorStop(0.7, '#0284c7');
    westGrad.addColorStop(1, '#0ea5e9');
    ctx.fillStyle = westGrad;
    ctx.fillRect(0, 0, 120, worldH);

    // 2. Multi-tier Undulating Wave Layers (South)
    const waveLayers = [
      { y: 2210, amp: 5, freq: 0.03, speed: 3.5, color: '#ffffff', width: 3.5 },
      { y: 2240, amp: 6, freq: 0.025, speed: 2.5, color: 'rgba(165, 243, 252, 0.7)', width: 2.5 },
      { y: 2280, amp: 7, freq: 0.02, speed: 2.0, color: 'rgba(56, 189, 248, 0.5)', width: 2.0 },
      { y: 2330, amp: 8, freq: 0.015, speed: 1.5, color: 'rgba(14, 165, 233, 0.45)', width: 2.0 },
      { y: 2370, amp: 9, freq: 0.012, speed: 1.2, color: 'rgba(2, 132, 199, 0.4)', width: 2.0 }
    ];

    for (const wave of waveLayers) {
      ctx.strokeStyle = wave.color;
      ctx.lineWidth = wave.width;
      ctx.beginPath();
      for (let x = 0; x <= worldW; x += 16) {
        const wy = wave.y + Math.sin(x * wave.freq + t * wave.speed) * wave.amp + Math.cos(x * wave.freq * 0.5 + t * (wave.speed * 0.8)) * (wave.amp * 0.4);
        if (x === 0) ctx.moveTo(x, wy);
        else ctx.lineTo(x, wy);
      }
      ctx.stroke();
    }

    // 3. Sparkling Sun Glints / Specular Pixel Stars
    ctx.fillStyle = '#ffffff';
    for (let i = 0; i < 32; i++) {
      const sx = ((i * 107 + t * 35) % worldW);
      const sy = 2220 + ((i * 47) % (worldH - 2230));
      const sparkle = (Math.sin(t * 6 + i * 2) + 1) / 2;
      if (sparkle > 0.4) {
        ctx.globalAlpha = sparkle * 0.85;
        ctx.fillRect(sx, sy, 3, 2);
        ctx.fillRect(sx - 1, sy + 1, 5, 1);
      }
    }
    ctx.globalAlpha = 1.0;
  }

  private drawPalmTree(ctx: CanvasRenderingContext2D, x: number, y: number, t: number, seed: number): void {
    ctx.save();
    ctx.translate(x, y);

    // 1. Drop Shadow on Sand
    ctx.fillStyle = 'rgba(120, 53, 15, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 5, 22, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Segmented Curved Trunk with 3D Shading
    const sway = Math.sin(t * 1.5 + seed) * 3;
    const trunkSegments = 7;
    const segH = 8;
    let curX = 0;
    let curY = 0;

    for (let i = 0; i < trunkSegments; i++) {
      const nextX = curX + (i * 1.2) + (i > 3 ? sway * (i / trunkSegments) : 0);
      const nextY = curY - segH;

      // Outer trunk shadow
      ctx.fillStyle = '#78350f';
      ctx.fillRect(curX - 6 + (i * 0.3), nextY, 12 - (i * 0.6), segH + 1);

      // Core midtone
      ctx.fillStyle = '#92400e';
      ctx.fillRect(curX - 4 + (i * 0.3), nextY + 1, 8 - (i * 0.6), segH - 1);

      // Highlight stripe
      ctx.fillStyle = '#b45309';
      ctx.fillRect(curX - 1 + (i * 0.3), nextY + 1, 3, segH - 1);

      // Segment ring divider
      ctx.fillStyle = '#451a03';
      ctx.fillRect(curX - 6 + (i * 0.3), curY - 1, 12 - (i * 0.6), 2);

      curX = nextX;
      curY = nextY;
    }

    // 3. Coconuts at Crown
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(curX - 4, curY + 2, 4, 0, Math.PI * 2);
    ctx.arc(curX + 3, curY + 3, 4, 0, Math.PI * 2);
    ctx.arc(curX, curY + 5, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // 4. Lush Multi-Tier Palm Fronds
    const frondAngles = [-140, -100, -60, -20, 20, 60, 100, 140];
    const frondSway = Math.sin(t * 2 + seed) * 0.08;

    for (let i = 0; i < frondAngles.length; i++) {
      const rad = (frondAngles[i] * Math.PI) / 180 + frondSway;
      const len = 32 + (i % 2) * 6;

      ctx.save();
      ctx.translate(curX, curY);
      ctx.rotate(rad);

      // Main frond spine
      ctx.strokeStyle = '#14532d';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(len * 0.5, 6, len, 14);
      ctx.stroke();

      // Frond leaves (fan out)
      ctx.fillStyle = i % 2 === 0 ? '#16a34a' : '#22c55e';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.quadraticCurveTo(len * 0.5, -4, len, 14);
      ctx.quadraticCurveTo(len * 0.6, 12, 0, 0);
      ctx.fill();

      // Bright edge highlight
      ctx.strokeStyle = '#86efac';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(len * 0.2, 0);
      ctx.lineTo(len * 0.8, 10);
      ctx.stroke();

      ctx.restore();
    }

    ctx.restore();
  }

  private drawSonicVines(ctx: CanvasRenderingContext2D, t: number, questStage: string): void {
    if (questStage === 'ridge_breach' || questStage === 'gate_ready' || questStage === 'cleansed') {
      return; // Vines dissolved!
    }
    // Draw pulsing purple/red glitch vines tightly sealing the mountain pass gorge (x: 580 to 820, y: 830 to 890)
    ctx.save();

    // Canyon Gateway Archway Pillars flanking the pass
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(560, 810, 30, 80);
    ctx.fillRect(810, 810, 30, 80);
    ctx.fillStyle = '#334155';
    ctx.fillRect(565, 800, 20, 20);
    ctx.fillRect(815, 800, 20, 20);

    // Dense Pulsing Glitch Vine Strands
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 6;
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(580, 830 + i * 16);
      for (let x = 580; x <= 820; x += 15) {
        const vy = 830 + i * 16 + Math.sin(x * 0.06 + t * 5 + i) * 8;
        ctx.lineTo(x, vy);
      }
      ctx.stroke();
    }

    // Static Thorns / Glowing Crimson Spikes
    ctx.fillStyle = '#ef4444';
    for (let x = 600; x <= 800; x += 30) {
      const pulse = Math.sin(t * 8 + x) * 3 + 6;
      ctx.beginPath();
      ctx.arc(x, 855 + Math.sin(x * 0.06 + t * 5) * 6, pulse, 0, Math.PI * 2);
      ctx.fill();
    }

    // Barrier Warning Hologram Sign
    ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(620, 790, 160, 26, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#fca5a5';
    ctx.font = '700 12px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ SONIC VINES BARRIER', 700, 808);

    ctx.restore();
  }

  private drawWestPier(ctx: CanvasRenderingContext2D, t: number): void {
    // West Pier Boardwalk extending into the sea at Port Resonata (x: 140 to 300, y: 2040 to 2200)
    const pierX = 140;
    const pierY = 2040;
    const pierW = 160;
    const pierH = 160;

    // 1. 3D Dock Posts with Sea Reflections Beneath
    const posts = [
      { x: pierX + 15, y: pierY + 60, h: 45 },
      { x: pierX + pierW - 15, y: pierY + 60, h: 45 },
      { x: pierX + 15, y: pierY + 115, h: 50 },
      { x: pierX + pierW - 15, y: pierY + 115, h: 50 },
      { x: pierX + 15, y: pierY + 155, h: 55 },
      { x: pierX + pierW / 2, y: pierY + 155, h: 55 },
      { x: pierX + pierW - 15, y: pierY + 155, h: 55 }
    ];

    for (const p of posts) {
      this.drawDockPostWithReflection(ctx, p.x, p.y, 14, p.h, t);
    }

    // 2. 3D Wooden Pier Deck
    ctx.fillStyle = '#451a03';
    ctx.fillRect(pierX - 4, pierY + pierH, pierW + 8, 8);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(pierX + pierW, pierY, 6, pierH);

    // Main Deck Base
    ctx.fillStyle = '#b45309';
    ctx.fillRect(pierX, pierY, pierW, pierH);

    // Individual Wood Planks
    const plankH = 14;
    for (let y = pierY; y < pierY + pierH; y += plankH) {
      ctx.fillStyle = ((y / plankH) % 2 === 0) ? '#d97706' : '#b45309';
      ctx.fillRect(pierX + 2, y + 1, pierW - 4, plankH - 2);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(pierX, y + plankH - 1, pierW, 1);
      ctx.fillStyle = '#334155';
      ctx.fillRect(pierX + 8, y + 5, 2, 2);
      ctx.fillRect(pierX + pierW - 10, y + 5, 2, 2);
    }

    // 3. Wooden Safety Railings
    ctx.fillStyle = '#78350f';
    ctx.fillRect(pierX - 2, pierY, 6, pierH);
    ctx.fillRect(pierX + pierW - 4, pierY, 6, pierH);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(pierX - 2, pierY + 12, 6, pierH - 12);
    ctx.fillRect(pierX + pierW - 4, pierY + 12, 6, pierH - 12);

    for (let py = pierY; py <= pierY + pierH; py += 40) {
      ctx.fillStyle = '#451a03';
      ctx.fillRect(pierX - 4, py - 12, 8, 16);
      ctx.fillRect(pierX + pierW - 4, py - 12, 8, 16);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(pierX - 3, py - 11, 6, 14);
      ctx.fillRect(pierX + pierW - 3, py - 11, 6, 14);
    }

    // Lifebuoy ring at the pier end
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(pierX + 30, pierY + pierH - 15, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(pierX + 30, pierY + pierH - 15, 9, 0, Math.PI * 0.5);
    ctx.arc(pierX + 30, pierY + pierH - 15, 9, Math.PI, Math.PI * 1.5);
    ctx.fill();
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(pierX + 30, pierY + pierH - 15, 4, 0, Math.PI * 2);
    ctx.fill();

    // Pier Lamp with warm beacon glow
    this.drawStreetLamp(ctx, pierX + pierW - 20, pierY + pierH - 20, t);
  }

  private drawEastPier(ctx: CanvasRenderingContext2D, t: number): void {
    // East Shoreline Pier Boardwalk (x: 800 to 1400, y: 2120 to 2180)
    const pierX = 800;
    const pierY = 2120;
    const pierW = 600;
    const pierH = 60;

    const extPosts = [
      { x: 900, y: 2180, w: 40, h: 40 },
      { x: 1100, y: 2180, w: 40, h: 40 },
      { x: 1300, y: 2180, w: 40, h: 40 }
    ];

    for (const ext of extPosts) {
      this.drawDockPostWithReflection(ctx, ext.x + 8, ext.y + ext.h - 10, 12, 35, t);
      this.drawDockPostWithReflection(ctx, ext.x + ext.w - 12, ext.y + ext.h - 10, 12, 35, t);
    }

    ctx.fillStyle = '#451a03';
    ctx.fillRect(pierX, pierY + pierH, pierW, 6);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(pierX, pierY, pierW, pierH);

    for (let x = pierX; x < pierX + pierW; x += 16) {
      ctx.fillStyle = ((x / 16) % 2 === 0) ? '#d97706' : '#b45309';
      ctx.fillRect(x + 1, pierY + 2, 14, pierH - 4);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x + 15, pierY, 1, pierH);
    }

    for (const ext of extPosts) {
      ctx.fillStyle = '#451a03';
      ctx.fillRect(ext.x, ext.y + ext.h, ext.w, 6);
      ctx.fillStyle = '#b45309';
      ctx.fillRect(ext.x, ext.y, ext.w, ext.h);

      for (let y = ext.y; y < ext.y + ext.h; y += 14) {
        ctx.fillStyle = ((y / 14) % 2 === 0) ? '#d97706' : '#b45309';
        ctx.fillRect(ext.x + 2, y + 1, ext.w - 4, 12);
        ctx.fillStyle = '#78350f';
        ctx.fillRect(ext.x, y + 13, ext.w, 1);
      }
    }
  }

  private drawDockPostWithReflection(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, t: number): void {
    // 1. Undulating Sea Reflection below water line
    const refY = y + h;
    const refH = 28;
    for (let r = 0; r < refH; r += 3) {
      const waveShift = Math.sin(r * 0.2 + t * 4) * 3;
      const refAlpha = 0.4 * (1 - r / refH);
      ctx.fillStyle = `rgba(69, 26, 3, ${refAlpha})`;
      ctx.fillRect(x - w / 2 + waveShift, refY + r, w, 2.5);
    }

    // 2. 3D Cylindrical Wooden Piling
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x - w / 2, y, w, h);
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x - w / 2 + 2, y, w - 4, h);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(x - w / 2 + 3, y, 3, h);

    ctx.fillStyle = '#065f46';
    ctx.fillRect(x - w / 2, y + h - 10, w, 8);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(x - w / 2 + 2, y + h - 8, w - 4, 4);

    ctx.fillStyle = '#92400e';
    ctx.beginPath();
    ctx.ellipse(x, y, w / 2, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  private drawBambooGrove(ctx: CanvasRenderingContext2D, t: number): void {
    // East Taiko Bamboo Grove area: x: 2200 to 3050, y: 950 to 1850
    ctx.fillStyle = '#14532d';
    ctx.beginPath();
    ctx.roundRect(2200, 950, 850, 900, 20);
    ctx.fill();

    const stalks = [
      { x: 2260, y: 1060, h: 90 }, { x: 2290, y: 1020, h: 80 }, { x: 2320, y: 1080, h: 95 },
      { x: 2350, y: 1000, h: 85 }, { x: 2400, y: 1050, h: 100 }, { x: 2430, y: 990, h: 75 },
      { x: 2470, y: 1070, h: 90 }, { x: 2510, y: 1020, h: 85 }, { x: 2550, y: 1080, h: 105 },
      { x: 2590, y: 1010, h: 80 }, { x: 2620, y: 1060, h: 95 }, { x: 2650, y: 1030, h: 85 },
      { x: 2700, y: 1200, h: 90 }, { x: 2750, y: 1250, h: 85 }, { x: 2800, y: 1200, h: 95 },
      { x: 2850, y: 1280, h: 90 }, { x: 2900, y: 1220, h: 100 }, { x: 2950, y: 1260, h: 85 },
      { x: 2300, y: 1350, h: 90 }, { x: 2350, y: 1400, h: 85 }, { x: 2500, y: 1450, h: 95 },
      { x: 2550, y: 1400, h: 90 }, { x: 2700, y: 1500, h: 100 }, { x: 2750, y: 1450, h: 85 },
      { x: 2350, y: 1650, h: 95 }, { x: 2400, y: 1700, h: 85 }, { x: 2600, y: 1680, h: 100 },
      { x: 2650, y: 1720, h: 90 }, { x: 2800, y: 1650, h: 95 }, { x: 2850, y: 1700, h: 85 }
    ];

    for (const s of stalks) {
      this.drawBambooStalk(ctx, s.x, s.y, s.h, t);
    }

    // 3D Stone Lanterns (Tōrō) with warm light (matching WORLD_OBSTACLES)
    this.drawStoneLantern(ctx, 2380, 1280, t);
    this.drawStoneLantern(ctx, 2680, 1280, t);
    this.drawStoneLantern(ctx, 2450, 1600, t);
    this.drawStoneLantern(ctx, 2750, 1600, t);

    // Decorative Taiko Matsuri Drums
    this.drawTaikoDrum(ctx, 2550, 1380, t);
    this.drawTaikoDrum(ctx, 2650, 1420, t);
  }

  private drawBambooStalk(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, t: number): void {
    ctx.save();
    ctx.translate(x, y);

    const sway = Math.sin(t * 2 + x * 0.02) * 2.5;

    // Stalk Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 4, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Segmented Green Bamboo Cane
    const segCount = Math.floor(h / 16);
    let curY = 0;
    for (let i = 0; i < segCount; i++) {
      const segW = 6;
      const segH = 15;
      const offX = (i / segCount) * sway;

      // Dark edge
      ctx.fillStyle = '#14532d';
      ctx.fillRect(offX - segW / 2, curY - segH, segW, segH);

      // Bright bamboo green
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(offX - segW / 2 + 1, curY - segH, segW - 2, segH);

      // Bamboo node ring
      ctx.fillStyle = '#166534';
      ctx.fillRect(offX - segW / 2 - 1, curY - 2, segW + 2, 3);
      ctx.fillStyle = '#86efac';
      ctx.fillRect(offX - segW / 2, curY - 1, segW, 1);

      // Leaves sprouting at node
      if (i % 2 === 1) {
        const leafDir = (i % 4 === 1) ? 1 : -1;
        ctx.fillStyle = '#4ade80';
        ctx.beginPath();
        ctx.moveTo(offX, curY - 2);
        ctx.quadraticCurveTo(offX + leafDir * 12, curY - 8, offX + leafDir * 18, curY - 2);
        ctx.quadraticCurveTo(offX + leafDir * 10, curY + 2, offX, curY - 2);
        ctx.fill();
      }

      curY -= segH;
    }

    ctx.restore();
  }

  private drawStoneLantern(ctx: CanvasRenderingContext2D, x: number, y: number, t: number): void {
    ctx.save();
    ctx.translate(x, y);

    // Warm Firefly Light Glow on Ground
    const glow = ctx.createRadialGradient(0, 5, 0, 0, 5, 45);
    const pulse = Math.sin(t * 3 + x) * 0.08 + 0.92;
    glow.addColorStop(0, `rgba(251, 191, 36, ${0.35 * pulse})`);
    glow.addColorStop(0.5, `rgba(245, 158, 11, ${0.15 * pulse})`);
    glow.addColorStop(1, 'rgba(251, 191, 36, 0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 5, 45, 0, Math.PI * 2);
    ctx.fill();

    // 1. Base Pedestal (3D Stepped Stone)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-14, 2, 28, 6);
    ctx.fillStyle = '#475569';
    ctx.fillRect(-12, -4, 24, 6);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-12, -4, 24, 2);

    // 2. Pillar Column
    ctx.fillStyle = '#334155';
    ctx.fillRect(-5, -20, 10, 16);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-3, -20, 6, 16);

    // 3. Middle Shelf (Chudai)
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-13, -24, 26, 4);
    ctx.fillStyle = '#475569';
    ctx.fillRect(-11, -26, 22, 2);

    // 4. Glowing Light Chamber (Hibukuro)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-9, -40, 18, 14);
    // Warm Glowing Apertures
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-6, -37, 12, 8);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(-4, -35, 8, 4);

    // 5. Pagoda Roof (Kasa) with 3D Flared Corners
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(-16, -40);
    ctx.lineTo(16, -40);
    ctx.lineTo(12, -48);
    ctx.lineTo(-12, -48);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.moveTo(-15, -42);
    ctx.lineTo(15, -42);
    ctx.lineTo(11, -48);
    ctx.lineTo(-11, -48);
    ctx.closePath();
    ctx.fill();

    // 6. Top Jewel Finial (Hoju)
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.arc(0, -51, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawTaikoDrum(ctx: CanvasRenderingContext2D, x: number, y: number, _t: number): void {
    ctx.save();
    ctx.translate(x, y);

    // Wooden X-Stand
    ctx.strokeStyle = '#451a03';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-10, 8);
    ctx.lineTo(10, -10);
    ctx.moveTo(10, 8);
    ctx.lineTo(-10, -10);
    ctx.stroke();

    // 3D Taiko Drum Body (Red Wine / Wood Barrel)
    ctx.fillStyle = '#881337';
    ctx.beginPath();
    ctx.ellipse(0, -12, 16, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#4c0519';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Drum Skin Face (Warm Cream)
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.ellipse(0, -14, 14, 9, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Mitsu-domoe Emblem in Center
    ctx.fillStyle = '#991b1b';
    ctx.beginPath();
    ctx.arc(0, -14, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Black Iron Studs around Rim
    ctx.fillStyle = '#0f172a';
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      const sx = Math.cos(a) * 15;
      const sy = -12 + Math.sin(a) * 10;
      ctx.fillRect(sx - 1, sy - 1, 2, 2);
    }

    ctx.restore();
  }

  private drawAncientRuins(ctx: CanvasRenderingContext2D, t: number): void {
    // North Ancient Sound Ruins (x: 2200 to 2950, y: 250 to 750)
    ctx.fillStyle = '#334155';
    ctx.fillRect(2200, 250, 750, 500);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 3;
    ctx.strokeRect(2200, 250, 750, 500);

    // Cracked Floor Tile Grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 2200; x <= 2950; x += 50) {
      ctx.beginPath();
      ctx.moveTo(x, 250);
      ctx.lineTo(x, 750);
      ctx.stroke();
    }
    for (let y = 250; y <= 750; y += 50) {
      ctx.beginPath();
      ctx.moveTo(2200, y);
      ctx.lineTo(2950, y);
      ctx.stroke();
    }

    // Ancient Sound Ruins Pillars (3D Fluted Columns matching WORLD_OBSTACLES)
    const columns = [
      { x: 2300, y: 400, h: 65 },
      { x: 2520, y: 360, h: 70 },
      { x: 2740, y: 420, h: 60 },
      { x: 2420, y: 600, h: 65 },
      { x: 2620, y: 640, h: 75 },
      { x: 2820, y: 580, h: 60 }
    ];

    for (const col of columns) {
      this.drawRuinColumn(ctx, col.x, col.y, col.h);
    }

    // Floating 3D Monolith Blocks with Glowing Glyphs
    const monoliths = [
      { x: 2360, y: 320, w: 32, h: 48, glyph: 'sine', seed: 0 },
      { x: 2650, y: 300, w: 34, h: 52, glyph: 'freq', seed: 1.5 },
      { x: 2860, y: 340, w: 30, h: 44, glyph: 'rune', seed: 3.0 },
      { x: 2520, y: 520, w: 36, h: 56, glyph: 'sine', seed: 4.2 }
    ];

    for (const m of monoliths) {
      this.drawFloatingMonolith(ctx, m.x, m.y, m.w, m.h, m.glyph, t, m.seed);
    }
  }

  private drawRuinColumn(ctx: CanvasRenderingContext2D, x: number, y: number, h: number): void {
    // 3D Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x + 10, y + 8, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Base
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 4, y - 4, 28, 8);
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 2, y - 8, 24, 4);

    // Column Shaft with Fluting
    ctx.fillStyle = '#334155';
    ctx.fillRect(x, y - h, 20, h - 8);
    ctx.fillStyle = '#64748b';
    ctx.fillRect(x + 3, y - h, 4, h - 8);
    ctx.fillRect(x + 11, y - h, 4, h - 8);
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x + 5, y - h, 2, h - 8);

    // Weathered Capital Head
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 5, y - h - 6, 30, 8);
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(x - 3, y - h - 8, 26, 3);

    // Ancient Moss Creepers
    ctx.fillStyle = '#10b981';
    ctx.fillRect(x + 1, y - h * 0.4, 4, 3);
    ctx.fillRect(x + 3, y - h * 0.35, 3, 5);
  }

  private drawFloatingMonolith(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, glyph: string, t: number, seed: number): void {
    const floatY = y + Math.sin(t * 2.5 + seed) * 8;
    const shadowScale = 1 - Math.sin(t * 2.5 + seed) * 0.15;

    // 1. Dynamic Ground Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + 35, (w * 0.8) * shadowScale, (h * 0.22) * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.translate(x, floatY);

    // 2. 3D Isometric Extrusion
    const depth = 10;

    // Right Dark Side Face
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.moveTo(w, 0);
    ctx.lineTo(w + depth, -depth * 0.6);
    ctx.lineTo(w + depth, h - depth * 0.6);
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fill();

    // Top Highlight Face
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(depth, -depth * 0.6);
    ctx.lineTo(w + depth, -depth * 0.6);
    ctx.lineTo(w, 0);
    ctx.closePath();
    ctx.fill();

    // Front Face (Megalith Stone)
    ctx.fillStyle = '#334155';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, w, h);

    // 3. Glowing Carved Neon Audio Glyphs
    ctx.shadowBlur = 10;
    if (glyph === 'sine') {
      ctx.strokeStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      for (let gy = 8; gy <= h - 8; gy += 2) {
        const gx = w / 2 + Math.sin(gy * 0.3 + t * 4) * (w * 0.3);
        if (gy === 8) ctx.moveTo(gx, gy);
        else ctx.lineTo(gx, gy);
      }
      ctx.stroke();
    } else if (glyph === 'freq') {
      ctx.fillStyle = '#ec4899';
      ctx.shadowColor = '#ec4899';
      const bars = 4;
      const barW = (w - 10) / bars;
      for (let b = 0; b < bars; b++) {
        const barH = 10 + Math.sin(t * 5 + b * 1.5) * 8 + 8;
        ctx.fillRect(5 + b * barW, h - 8 - barH, barW - 2, barH);
      }
    } else {
      ctx.strokeStyle = '#fbbf24';
      ctx.shadowColor = '#fbbf24';
      ctx.lineWidth = 2;
      ctx.strokeRect(5, 8, w - 10, h - 16);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(w / 2 - 3, h / 2 - 3, 6, 6);
    }
    ctx.shadowBlur = 0;

    ctx.restore();
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
    // 3D Wooden Patio Deck with Support Pillars
    ctx.fillStyle = '#b45309';
    ctx.fillRect(x - 10, y + h + 22, w + 20, 6); // 3D Deck Edge Drop
    ctx.fillStyle = '#fed7aa';
    ctx.fillRect(x - 10, y + h - 15, w + 20, 38);
    ctx.strokeStyle = '#ca8a04';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 10, y + h - 15, w + 20, 38);

    // Deck Railing & Posts
    ctx.fillStyle = '#78350f';
    ctx.fillRect(x - 10, y + h - 15, 6, 20);
    ctx.fillRect(x + w + 4, y + h - 15, 6, 20);

    // Cafe Tables with Coffee Mugs
    ctx.fillStyle = '#78350f';
    ctx.beginPath();
    ctx.ellipse(x + 22, y + h + 8, 12, 8, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w - 22, y + h + 8, 12, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    // Steaming mugs
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + 20, y + h + 4, 4, 4);
    ctx.fillRect(x + w - 24, y + h + 4, 4, 4);

    // Main Cafe Building (Extruded 3D Wall)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + w, y + 10, 8, h - 10); // 3D Side extrusion
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
    // 3D Side Wall Extrusion
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x + w, y + 10, 8, h - 10);
    // Main Building Face
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(x, y, w, h);

    // Giant 3D Tilted Rotating Golden Vinyl Record on Roof
    ctx.save();
    ctx.translate(x + w / 2, y - 10);
    // 3D Rim Drop
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.ellipse(0, 4, 28, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    // Top Face
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(0, 0, 28, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // Golden Grooves
    ctx.save();
    ctx.rotate(t * 2);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 10, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Center Gold Label
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.ellipse(0, 0, 9, 4.5, 0, 0, Math.PI * 2);
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
    // Stepped 3D Stone Stairs Leading Up
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 12, y + h, w + 24, 7);
    ctx.fillStyle = '#334155';
    ctx.fillRect(x - 6, y + h + 7, w + 12, 7);

    // 3D Floating Portal Void
    const gateGrad = ctx.createLinearGradient(x, y, x, y + h);
    gateGrad.addColorStop(0, isGlitch ? 'rgba(239, 68, 68, 0.85)' : 'rgba(6, 182, 212, 0.85)');
    gateGrad.addColorStop(1, isGlitch ? 'rgba(168, 85, 247, 0.95)' : 'rgba(59, 130, 246, 0.95)');
    ctx.fillStyle = gateGrad;
    ctx.fillRect(x + 12, y, w - 24, h);

    // Swirling CRT Static Scanlines
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let i = 0; i < h; i += 6) {
      const scanY = (i + t * 40) % h;
      ctx.fillRect(x + 12, y + scanY, w - 24, 2);
    }

    // Border Frame
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

    // Portal Label
    ctx.fillStyle = isGlitch ? '#ef4444' : '#06b6d4';
    ctx.font = '800 13px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(isGlitch ? '⚠️ GLITCH GATE' : '✨ SOUND PORTAL', x + w / 2, y + 30 + Math.sin(t * 6) * 2);
  }

  private drawMusicalFountain(ctx: CanvasRenderingContext2D, x: number, y: number, t: number): void {
    // 3D Stepped Basin Shadow
    ctx.fillStyle = 'rgba(15, 23, 42, 0.35)';
    ctx.beginPath();
    ctx.ellipse(x, y + 20, 48, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Outer Stone Wall with 3D Depth
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.ellipse(x, y + 8, 44, 22, 0, 0, Math.PI * 2);
    ctx.fill();

    // Top Water Basin (Translucent Cyan)
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.ellipse(x, y, 42, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Floating 3D Music Particles Rising
    const notes = ['♪', '♫', '♬'];
    for (let i = 0; i < 4; i++) {
      const noteProgress = ((t * 0.8 + i * 0.25) % 1.0);
      const noteY = y - noteProgress * 45;
      const noteX = x + Math.sin(t * 3 + i * 1.5) * (15 + noteProgress * 15);
      const alpha = Math.sin(noteProgress * Math.PI);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.font = '800 16px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(notes[i % 3], noteX, noteY);
    }
  }

  private drawMusicalShrine(ctx: CanvasRenderingContext2D, shrine: MusicalShrine, t: number): void {
    const x = shrine.x;
    const y = shrine.y;
    const isDiscovered = shrine.discovered;
    const bob = Math.sin(t * 4) * 4;
    const glow = Math.sin(t * 5) * 0.3 + 0.7;

    ctx.save();
    ctx.translate(x, y);

    // 1. Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(0, 16, 32, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    if (shrine.id === 'shrine_sitar') {
      // --- SACRED SITAR & RAGA SHRINE (Port Resonata Beach Sandbar) ---
      // Tiered Sandstone Lotus Base
      ctx.fillStyle = '#b45309';
      ctx.fillRect(-28, 4, 56, 12);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-22, -2, 44, 8);
      // Terracotta Lotus Petals
      ctx.fillStyle = '#d97706';
      for (let p = -3; p <= 3; p++) {
        ctx.beginPath();
        ctx.ellipse(p * 7, 0, 6, 10, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // Glowing Turquoise Beacon Brazier
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = isDiscovered ? 20 : 12 * glow;
      ctx.fillRect(-10, -14, 20, 14);

      // Holographic Floating Sitar Rune
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isDiscovered ? '✨🪕✨' : '🪕', 0, -32 + bob);

    } else if (shrine.id === 'shrine_taiko') {
      // --- MATSURI TAIKO DRUM SHRINE (Whispering Bamboo Grove) ---
      // Vermilion Japanese Torii Pillars
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(-26, -30, 8, 44);
      ctx.fillRect(18, -30, 8, 44);
      // Torii Roof Arch
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(-34, -36, 68, 8);
      ctx.fillRect(-30, -28, 60, 6);
      // Gold Shimenawa Sacred Rope
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-24, -22, 48, 4);

      // Sacred Taiko Drum Pedestal
      ctx.fillStyle = '#78350f';
      ctx.fillRect(-16, -6, 32, 20);
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.ellipse(0, -6, 16, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Floating Taiko Spirit Rune
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = isDiscovered ? 25 : 15 * glow;
      ctx.font = '28px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isDiscovered ? '✨🥁✨' : '🥁', 0, -18 + bob);

    } else {
      // --- SYMPHONIC VIOLIN SHRINE (Ancient Sound Ruins) ---
      // Classical Fluted Marble Columns
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(-28, -24, 8, 38);
      ctx.fillRect(20, -24, 8, 38);
      // Marble Pedestal & Arch
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(-34, -30, 68, 8);
      ctx.fillRect(-22, 8, 44, 10);

      // Sapphire Harmonic Crystal
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = isDiscovered ? 25 : 15 * glow;
      ctx.beginPath();
      ctx.moveTo(0, -20 + bob);
      ctx.lineTo(12, -4 + bob);
      ctx.lineTo(0, 10 + bob);
      ctx.lineTo(-12, -4 + bob);
      ctx.closePath();
      ctx.fill();

      // Floating Violin Rune
      ctx.font = '26px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isDiscovered ? '✨🎻✨' : '🎻', 0, -28 + bob);
    }

    // Floating Tradition Pulsing Rings if undiscovered
    if (!isDiscovered) {
      const pulse = (t * 30) % 36;
      ctx.strokeStyle = `rgba(251, 191, 36, ${1 - pulse / 36})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 12, pulse + 18, (pulse + 18) * 0.45, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.restore();
  }

  /* ---------------- DETAILED PIXEL SPRITES ---------------- */
  private drawDetailedPlayer(ctx: CanvasRenderingContext2D, x: number, y: number, dir: string, isMoving: boolean, t: number): void {
    ctx.save();
    ctx.translate(x, y);

    // Natural forward stride when moving left
    if (dir === 'left') {
      ctx.scale(-1, 1);
    }

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

    // Direction-aware facial features
    if (dir === 'up') {
      // Facing up: back of head hair
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(-6, -34 + bob, 12, 6);
    } else if (dir === 'left' || dir === 'right') {
      // Profile eyes looking forward
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(2, -30 + bob, 3, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(3, -30 + bob, 1, 2);
    } else {
      // Down: both eyes forward
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-4, -30 + bob, 3, 4);
      ctx.fillRect(1, -30 + bob, 3, 4);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-4, -30 + bob, 1, 2);
      ctx.fillRect(1, -30 + bob, 1, 2);
    }

    // Cyan Headphones
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(-9, -36 + bob, 18, 5);
    ctx.fillRect(-10, -32 + bob, 3, 8);
    ctx.fillRect(7, -32 + bob, 3, 8);

    // Glowing Vibe-Phone in hand
    if (dir !== 'up') {
      ctx.fillStyle = '#06b6d4';
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 8;
      ctx.fillRect(8, -16 + bob, 6, 10);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(9, -15 + bob, 4, 7);
      ctx.shadowBlur = 0;
    }

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

    // Glowing Neon LED Whiskers
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-8, -13, 3, 1);
    ctx.fillRect(5, -13, 3, 1);

    // Piano Keys along spine
    for (let k = -5; k <= 3; k += 2) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(k, -11, 2, 2);
    }

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

  private drawDetailedHound(ctx: CanvasRenderingContext2D, x: number, y: number, t: number): void {
    ctx.save();
    ctx.translate(x, y);

    // Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 6, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body (Purple Punk Basset)
    ctx.fillStyle = '#c084fc';
    ctx.fillRect(-9, -10, 18, 12);

    // Head
    ctx.fillRect(-7, -18, 14, 10);

    // Droopy Guitar-Strap Ears
    const earWag = Math.sin(t * 6) * 3;
    ctx.fillStyle = '#7e22ce';
    ctx.fillRect(-10, -17, 3, 12 + earWag);
    ctx.fillRect(7, -17, 3, 12 - earWag);

    // 808 Sub-Woofer Chest Cone
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(0, -4, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ec4899';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -4, 3 + Math.sin(t * 12) * 1.5, 0, Math.PI * 2);
    ctx.stroke();

    // Snout and Eyes
    ctx.fillStyle = '#581c87';
    ctx.fillRect(-3, -13, 6, 4);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4, -16, 2, 2);
    ctx.fillRect(2, -16, 2, 2);

    // Spiked Collar
    ctx.fillStyle = '#e2e8f0';
    for (let sp = -6; sp <= 4; sp += 3) {
      ctx.fillRect(sp, -9, 2, 2);
    }

    ctx.restore();
  }

  private drawDetailedOwl(ctx: CanvasRenderingContext2D, x: number, y: number, t: number): void {
    ctx.save();
    ctx.translate(x, y);

    // Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 6, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    const flap = Math.sin(t * 8) * 3;

    // Body (Mahogany Stradivarius Violin Wood)
    ctx.fillStyle = '#78350f';
    ctx.fillRect(-8, -16 + flap * 0.5, 16, 16);
    ctx.fillStyle = '#92400e';
    ctx.fillRect(-6, -14 + flap * 0.5, 12, 12);

    // Horsehair Bow Wings
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-12, -14 + flap, 4, 10);
    ctx.fillRect(8, -14 - flap, 4, 10);

    // Violin F-Holes on Chest
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-4, -10 + flap * 0.5, 2, 4);
    ctx.fillRect(2, -10 + flap * 0.5, 2, 4);

    // Big Amber Owl Eyes
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(-3, -13 + flap * 0.5, 3.5, 0, Math.PI * 2);
    ctx.arc(3, -13 + flap * 0.5, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4, -14 + flap * 0.5, 2, 2);
    ctx.fillRect(2, -14 + flap * 0.5, 2, 2);

    // Golden Beak
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(0, -11 + flap * 0.5);
    ctx.lineTo(-2, -9 + flap * 0.5);
    ctx.lineTo(2, -9 + flap * 0.5);
    ctx.fill();

    ctx.restore();
  }

  private drawDetailedSwan(ctx: CanvasRenderingContext2D, x: number, y: number, t: number): void {
    ctx.save();
    ctx.translate(x, y);

    // Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 6, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    const glide = Math.sin(t * 5) * 2;

    // Resonant Gourd Body (Warm Amber Base)
    ctx.fillStyle = '#d97706';
    ctx.fillRect(-9, -10 + glide, 18, 12);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-7, -8 + glide, 14, 8);

    // Fretted Sitar Neck (Curving Upward)
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(2, -22 + glide, 4, 14);
    // Silver Frets along neck
    ctx.fillStyle = '#f1f5f9';
    for (let f = -20; f <= -10; f += 3) {
      ctx.fillRect(1, f + glide, 6, 1);
    }

    // Elegant Swan Head
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(2, -26 + glide, 6, 6);
    // Black Mask & Eye
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(5, -25 + glide, 2, 2);
    // Slender Golden Beak
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(8, -24 + glide, 4, 2);

    // Sitar Tuning Pegs on Crown
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(0, -26 + glide, 2, 2);
    ctx.fillRect(0, -23 + glide, 2, 2);

    ctx.restore();
  }

  private drawDetailedTanuki(ctx: CanvasRenderingContext2D, x: number, y: number, t: number): void {
    ctx.save();
    ctx.translate(x, y);

    // Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 6, 13, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    const hop = Math.sin(t * 7) * 2.5;

    // Tanuki Body (Warm Fur)
    ctx.fillStyle = '#854d0e';
    ctx.fillRect(-8, -14 + hop, 16, 14);

    // Taiko Drum Belly (Red Wood Hoop)
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(0, -6 + hop, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(0, -6 + hop, 4, 0, Math.PI * 2);
    ctx.fill();

    // Mask & Eyes
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-6, -13 + hop, 4, 3);
    ctx.fillRect(2, -13 + hop, 4, 3);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-4, -12 + hop, 1.5, 1.5);
    ctx.fillRect(3, -12 + hop, 1.5, 1.5);

    // Fluffy Striped Tail (Holding Bachi Sticks)
    const tailWag = Math.sin(t * 10) * 3;
    ctx.fillStyle = '#854d0e';
    ctx.fillRect(-13, -10 + hop + tailWag, 5, 8);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(-13, -8 + hop + tailWag, 5, 2);

    // Wooden Bachi Drumsticks
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(5, -9 + hop, 6, 2);

    ctx.restore();
  }

  private drawGenericCompanion(ctx: CanvasRenderingContext2D, x: number, y: number, spirit: StreamSpirit, t: number): void {
    ctx.save();
    ctx.translate(x, y);

    // Drop Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 6, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Floating bobbing sprite
    const bob = Math.sin(t * 6) * 3;
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(spirit.avatar || '✨', 0, -12 + bob);

    // Instrument Sparkle
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(8, -20 + bob, 3, 3);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-10, -8 + bob, 2, 2);

    ctx.restore();
  }

  private drawWildGlitch(ctx: CanvasRenderingContext2D, x: number, y: number, spirit: StreamSpirit, t: number, isAlerted: boolean = false): void {
    ctx.save();
    ctx.translate(x, y);

    // Drop Shadow & Danger Ring if Alerted
    const shadowColor = spirit.type === 'static' ? 'rgba(239, 68, 68, 0.35)' : 'rgba(16, 185, 129, 0.35)';
    ctx.fillStyle = shadowColor;
    ctx.beginPath();
    ctx.ellipse(0, 8, 16, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    if (isAlerted) {
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.6 + Math.sin(t * 10) * 0.3})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 8, 22 + Math.sin(t * 8) * 3, 9, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Alert Exclamation Badge
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, -32 + Math.sin(t * 12) * 2, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 11px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('!', 0, -32 + Math.sin(t * 12) * 2);
    }

    // Jitter & Levitation
    const jitterX = spirit.type === 'static' ? (Math.random() - 0.5) * 3 : 0;
    const jitterY = Math.sin(t * 6 + x) * 4;

    ctx.save();
    ctx.translate(jitterX, jitterY);

    if (spirit.id === 'spirit_bit_bug') {
      // 3D Pixel Bit-Bug
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-8, -12, 16, 12);
      ctx.fillStyle = '#b91c1c';
      ctx.fillRect(-6, -10, 12, 8);
      // Glowing Cyan Eyes
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-6, -8, 3, 3);
      ctx.fillRect(3, -8, 3, 3);
      // Twitching Antennae
      const antTwitch = Math.sin(t * 15) * 3;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-4, -12); ctx.lineTo(-8 + antTwitch, -18);
      ctx.moveTo(4, -12); ctx.lineTo(8 - antTwitch, -18);
      ctx.stroke();
    } else if (spirit.id === 'spirit_noise_mote') {
      // Floating CRT TV Orb with Static
      ctx.fillStyle = '#334155';
      ctx.fillRect(-12, -16, 24, 18);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-10, -14, 20, 14);
      // Analog Snow
      ctx.fillStyle = '#ffffff';
      for (let sy = -12; sy < -2; sy += 3) {
        ctx.fillRect(-8 + Math.random() * 12, sy, 4, 1.5);
      }
      // Glowing Antenna
      ctx.strokeStyle = '#fb7185';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-4, -16); ctx.lineTo(-8, -22);
      ctx.moveTo(4, -16); ctx.lineTo(8, -22);
      ctx.stroke();
    } else if (spirit.id === 'spirit_steel_panda') {
      // Steel-Panda with Steelpan Drum
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-8, -14, 16, 14);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-10, -18, 5, 5); // Ears
      ctx.fillRect(5, -18, 5, 5);
      ctx.fillRect(-6, -12, 4, 4); // Eye patches
      ctx.fillRect(2, -12, 4, 4);
      // Tuned Steelpan Bowl
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.ellipse(0, 0, 14, 6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#047857';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    } else if (spirit.id === 'spirit_kora_gazelle') {
      // Kora-Gazelle with 21 Harp Horns
      ctx.fillStyle = '#f97316';
      ctx.fillRect(-6, -14, 12, 14);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(-4, -20, 8, 8);
      // Harpa Gazella Horns with Strings
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-4, -20); ctx.quadraticCurveTo(-12, -30, -8, -36);
      ctx.moveTo(4, -20); ctx.quadraticCurveTo(12, -30, 8, -36);
      ctx.stroke();
      // Strings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1;
      for (let st = -2; st <= 2; st += 2) {
        ctx.beginPath();
        ctx.moveTo(st, -18); ctx.lineTo(st * 2.5, -34);
        ctx.stroke();
      }
    } else if (spirit.id === 'spirit_glitch_golem') {
      // Glitch-Golem (Megalith Colossus)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-14, -26, 28, 26);
      ctx.fillStyle = '#475569';
      ctx.fillRect(-11, -23, 22, 20);
      // Glowing Core Runes
      ctx.fillStyle = '#ef4444';
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
      ctx.fillRect(-6, -14, 12, 4);
      ctx.fillRect(-2, -18, 4, 12);
      ctx.shadowBlur = 0;
    } else {
      ctx.font = '24px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(spirit.avatar, 0, -8);
    }

    ctx.restore();

    // High-Legibility Badge
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = spirit.type === 'static' ? '#ef4444' : '#10b981';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(-55, -38, 110, 18, 5);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = spirit.type === 'static' ? '#fca5a5' : '#86efac';
    ctx.font = '700 11px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Lv.${spirit.level} ${spirit.name}`, 0, -25);

    ctx.restore();
  }

  private drawPixelNPC(ctx: CanvasRenderingContext2D, npc: NPCEntity, t: number, questStage: string): void {
    const x = npc.x;
    const y = npc.y;
    const sprite = npc.sprite;

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
    } else if (sprite === 'maestro_owl') {
      ctx.fillStyle = '#6b21a8';
      ctx.fillRect(-9, -22 + bob, 18, 17);
      ctx.fillStyle = '#e9d5ff';
      ctx.fillRect(-7, -34 + bob, 14, 13);
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(-10, -36 + bob, 20, 5);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-2, -28 + bob, 4, 3);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-5, -31 + bob, 3, 3);
      ctx.fillRect(2, -31 + bob, 3, 3);
    } else if (sprite === 'pelican') {
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-8, -20 + bob, 16, 16);
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(-6, -32 + bob, 12, 13);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-4, -26 + bob, 14, 6);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-3, -29 + bob, 2, 2);
    } else if (sprite === 'spark') {
      ctx.fillStyle = '#334155';
      ctx.fillRect(-8, -22 + bob, 16, 18);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-6, -34 + bob, 12, 13);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-9, -33 + bob, 3, 7);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-4, -30 + bob, 2, 2);
      ctx.fillRect(2, -30 + bob, 2, 2);
    } else if (sprite === 'lyra') {
      // Sage Lyra: Scholar Robes (Ethereal Teal & Amber)
      ctx.fillStyle = '#0f766e';
      ctx.fillRect(-8, -22 + bob, 16, 18);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(-6, -34 + bob, 12, 13);
      // Mystic Cyan Circlet
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-8, -37 + bob, 16, 4);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-4, -30 + bob, 2, 2);
      ctx.fillRect(2, -30 + bob, 2, 2);
      // Ancient Acoustic Tuning Staff
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(8, -32 + bob, 3, 28);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(6, -36 + bob, 7, 4);
    }

    ctx.restore();

    // Render NPC Musical Pet (Active in Prologue & Restored in Cleansing Victory)
    if (npc.pet && (questStage === 'intro' || questStage === 'cleansed')) {
      this.drawPixelNPCPet(ctx, x + 24, y + 2, npc.pet, t);
    }
  }

  private drawPixelNPCPet(ctx: CanvasRenderingContext2D, px: number, py: number, pet: { name: string; species: string; sprite: 'bird' | 'pup' | 'fawn' | 'gull'; instrument: string }, t: number): void {
    ctx.save();
    ctx.translate(px, py);
    const bob = Math.sin(t * 6 + px) * 2;

    // Pet Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(0, 4, 8, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    if (pet.sprite === 'bird') {
      // Aria's Latte-Chirp (Melody Songbird)
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(0, -6 + bob, 6, 0, Math.PI * 2);
      ctx.fill();
      // Golden Flute Beak
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(4, -7 + bob, 4, 2);
      // Wing
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(-4, -5 + bob, 4, 4);
      // Musical Note
      ctx.fillStyle = '#fbbf24';
      ctx.font = '10px sans-serif';
      ctx.fillText('♪', 2, -14 + bob);

    } else if (pet.sprite === 'pup') {
      // DJ Otter's Vinyl-Pup (Groove Terrier)
      ctx.fillStyle = '#d97706';
      ctx.fillRect(-6, -8 + bob, 12, 8);
      // Head
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(2, -14 + bob, 8, 8);
      // Mini Headphones
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(4, -16 + bob, 4, 2);
      ctx.fillRect(2, -14 + bob, 2, 4);
      ctx.fillRect(8, -14 + bob, 2, 4);
      // Tail
      ctx.fillStyle = '#92400e';
      ctx.fillRect(-8, -10 + bob + Math.sin(t * 12) * 2, 3, 3);

    } else if (pet.sprite === 'fawn') {
      // Maestro Owl's Cello-Fawn (Sonata Fawn)
      ctx.fillStyle = '#c084fc';
      ctx.fillRect(-6, -10 + bob, 12, 10);
      // Dainty Legs
      ctx.fillStyle = '#7e22ce';
      ctx.fillRect(-5, 0, 2, 4);
      ctx.fillRect(3, 0, 2, 4);
      // Head & Cello Antlers
      ctx.fillStyle = '#e9d5ff';
      ctx.fillRect(2, -16 + bob, 6, 7);
      ctx.fillStyle = '#78350f';
      ctx.fillRect(4, -20 + bob, 2, 5); // Cello Scroll

    } else if (pet.sprite === 'gull') {
      // Barnaby's Accordion-Gull
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(-6, -8 + bob, 12, 7);
      // Accordion Pleat Wings
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-3, -7 + bob, 2, 5);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-1, -7 + bob, 2, 5);
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(1, -7 + bob, 2, 5);
      // Orange Beak
      ctx.fillStyle = '#ea580c';
      ctx.fillRect(6, -8 + bob, 4, 2);
    }

    ctx.restore();
  }

  private drawCollectibleItem(ctx: CanvasRenderingContext2D, x: number, y: number, icon: string, _name: string, t: number): void {
    ctx.save();
    ctx.translate(x, y);

    const bob = Math.sin(t * 4) * 6;
    const glow = Math.sin(t * 6) * 0.3 + 0.7;

    // 1. Dynamic Drop Shadow on Ground
    const shadowScale = 1 - Math.sin(t * 4) * 0.2;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(0, 10, 14 * shadowScale, 6 * shadowScale, 0, 0, Math.PI * 2);
    ctx.fill();

    // 2. Glowing Multi-Stop Radial Aura
    const aura = ctx.createRadialGradient(0, -10 + bob, 2, 0, -10 + bob, 28);
    aura.addColorStop(0, `rgba(251, 191, 36, ${0.7 * glow})`);
    aura.addColorStop(0.5, `rgba(236, 72, 153, ${0.35 * glow})`);
    aura.addColorStop(1, 'rgba(6, 182, 212, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(0, -10 + bob, 28, 0, Math.PI * 2);
    ctx.fill();

    // 3. Orbiting Sparkle Stars in 3D Perspective
    for (let s = 0; s < 3; s++) {
      const angle = t * 3 + (s * Math.PI * 2) / 3;
      const ox = Math.cos(angle) * 18;
      const oy = -10 + bob + Math.sin(angle) * 8;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(ox - 1.5, oy - 1.5, 3, 3);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(ox - 0.5, oy - 3.5, 1, 7);
      ctx.fillRect(ox - 3.5, oy - 0.5, 7, 1);
    }

    // 4. Item Icon with 3D Pop (Identity shown via Proximity Card)
    ctx.font = '26px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 12;
    ctx.fillText(icon, 0, -10 + bob);
    ctx.shadowBlur = 0;

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

    // 1. Player Spirit(s) (Left)
    const pSpirit = battle.playerSpirit;
    const px = w * 0.25;
    const py = h * 0.55;

    if (battle.type === 'boss' && !battle.blendActive) {
      // TAG TEAM DUO: Chime-Cat AND Bass-Hound fighting together!
      ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.beginPath();
      ctx.ellipse(px - 36, py + 25, 45, 15, 0, 0, Math.PI * 2);
      ctx.ellipse(px + 36, py + 25, 45, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Chime-Cat
      this.drawSpiritBattleSprite(ctx, px - 36, py + Math.sin(t * 4) * 5, pSpirit, 1.2);
      // Bass-Hound (Jax's companion)
      const bassHound = state.streamQueue.find(s => s.id === 'spirit_bass_hound') || pSpirit;
      this.drawSpiritBattleSprite(ctx, px + 36, py + Math.sin(t * 4 + 1.5) * 5, bassHound, 1.2);
      
      // Jax standing behind the squad
      this.drawPixelNPC(ctx, { id: 'npc_jax', name: 'Jax', title: 'The Underground Punk', x: px - 75, y: py - 20, sprite: 'jax', color: '#c084fc', dialogue: [] }, t, state.questStage);
    } else {
      ctx.fillStyle = 'rgba(6, 182, 212, 0.3)';
      ctx.beginPath();
      ctx.ellipse(px, py + 25, 70, 20, 0, 0, Math.PI * 2);
      ctx.fill();

      this.drawSpiritBattleSprite(ctx, px, py + Math.sin(t * 4) * 5, pSpirit, battle.blendActive ? 1.7 : 1.4);
    }

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
      ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
      ctx.fillRect(w * 0.08, 12, w * 0.84, 40);
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.strokeRect(w * 0.08, 12, w * 0.84, 40);

      ctx.fillStyle = '#ffffff';
      ctx.font = '700 15px Fredoka, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(battle.log, w / 2, 38);
    }
  }

  private renderRhythmBar(ctx: CanvasRenderingContext2D, w: number, _h: number, battle: any): void {
    const barW = Math.min(480, w * 0.82);
    const barH = 34;
    const barX = (w - barW) / 2;
    const barY = 95; // Placed at top-center, completely unobstructed by the bottom HUD!

    // High-Contrast Dark Container Frame
    ctx.fillStyle = 'rgba(15, 23, 42, 0.96)';
    ctx.fillRect(barX - 16, barY - 30, barW + 32, barH + 68);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(barX - 16, barY - 30, barW + 32, barH + 68);

    // Target Helper Label (Top of Bar)
    ctx.fillStyle = '#4ade80';
    ctx.font = '800 13px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    const winX = barX + battle.targetWindowStart * barW;
    const winW = (battle.targetWindowEnd - battle.targetWindowStart) * barW;
    ctx.fillText('▼ HIT HERE! ▼', winX + winW / 2, barY - 10);

    // Track Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 2;
    ctx.strokeRect(barX, barY, barW, barH);

    // Target Window (Glowing Green Zone)
    ctx.fillStyle = '#10b981';
    ctx.shadowColor = '#10b981';
    ctx.shadowBlur = 12;
    ctx.fillRect(winX, barY + 2, winW, barH - 4);
    ctx.shadowBlur = 0;

    // Beat Cursor (Bright White with Cyan Glow)
    const curX = barX + battle.rhythmCursor * barW;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#06b6d4';
    ctx.shadowBlur = 15;
    ctx.fillRect(curX - 4, barY - 4, 8, barH + 8);
    ctx.shadowBlur = 0;

    // High-Contrast White Instruction Banner
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 14px Fredoka, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('⚡ PRESS [SPACE] OR CLICK WHEN CURSOR IS IN GREEN! ⚡', w / 2, barY + barH + 24);

    // Rhythm Result Feedback
    if (battle.rhythmResult) {
      ctx.font = '800 22px Fredoka, sans-serif';
      ctx.fillStyle = battle.rhythmResult === 'PERFECT' ? '#34d399' : (battle.rhythmResult === 'GREAT' ? '#38bdf8' : '#f87171');
      ctx.fillText(`✨ ${battle.rhythmResult}! ✨`, w / 2, barY + barH + 24);
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
    ctx.fillText(`${spirit.name} [${spirit.type.toUpperCase()}]`, 0, 32 * scale);

    ctx.fillStyle = spirit.color || '#38bdf8';
    ctx.font = '700 12px Fredoka, sans-serif';
    ctx.fillText(spirit.title, 0, 48 * scale);
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
      const diff = Math.abs(match.playerFreq - match.targetFreq);
      const isAligned = diff < 6;
      
      const speed = t * 4;
      const amp = 42;
      const targetScale = 0.015 + (match.targetFreq / 100) * 0.05;
      const playerScale = 0.015 + (match.playerFreq / 100) * 0.05;

      // 1. Target Waveform (Glowing Cyan Guide)
      ctx.strokeStyle = isAligned ? '#10b981' : '#06b6d4';
      ctx.lineWidth = isAligned ? 5 : 3;
      ctx.shadowColor = isAligned ? '#10b981' : '#06b6d4';
      ctx.shadowBlur = isAligned ? 15 : 6;
      ctx.beginPath();
      for (let x = 60; x < w - 60; x += 4) {
        const y = centerY + Math.sin(x * targetScale + speed) * amp;
        if (x === 60) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // 2. Player Waveform (Magenta) - Merges into the green wave when aligned
      if (!isAligned) {
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#ec4899';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        for (let x = 60; x < w - 60; x += 4) {
          const y = centerY + Math.sin(x * playerScale + speed) * amp;
          if (x === 60) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // Hold Progress Meter
      if (isAligned) {
        const holdPct = Math.min(1.0, match.holdTime / 1.2);
        ctx.fillStyle = '#10b981';
        ctx.font = '800 16px Fredoka, sans-serif';
        ctx.fillText(`✨ HARMONIC RESONANCE LOCKED! (${Math.floor(holdPct * 100)}%) ✨`, centerX, centerY - 80);
        
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(centerX - 100, centerY - 65, 200, 10);
        ctx.fillStyle = '#10b981';
        ctx.fillRect(centerX - 100, centerY - 65, 200 * holdPct, 10);
      } else {
        ctx.fillStyle = '#e2e8f0';
        ctx.font = '700 15px Fredoka, sans-serif';
        ctx.fillText('👉 Use [A / D] or [◀ / ▶] keys (or drag slider) to merge waves into GREEN!', centerX, centerY - 80);
      }

    } else if (match.challengeType === 'call_response') {
      // ---------------- CALL & RESPONSE ----------------
      ctx.fillStyle = match.isListeningToPlayer ? '#38bdf8' : '#fbbf24';
      ctx.font = '800 17px Fredoka, sans-serif';
      ctx.fillText(match.isListeningToPlayer ? `🎵 YOUR TURN: Press [1, 2, 3] or [J, K, L] on tempo! (${match.playerSequence.length}/4)` : '👂 LISTEN CAREFULLY TO THE CREATURE...', centerX, centerY - 90);

      // Render 3 Visual Launchpads
      const padColors = ['#f43f5e', '#fbbf24', '#38bdf8'];
      const padLabels = ['🔴 LOW [1/J]', '🟡 MID [2/K]', '🔵 HIGH [3/L]'];
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
