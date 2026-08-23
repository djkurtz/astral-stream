import { BUILDING_DEFS } from './data';
import { BuildingType, CelestialBody, GameState } from './types';

export interface SurfacePlot {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  buildingType?: BuildingType;
  level: number;
  isBuilding: boolean;
  buildProgress: number;
}

export class SpaceRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private camera = { x: 0, y: 0, zoom: 1 };
  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private stars: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];
  public mousePos = { x: 0, y: 0 };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.initStars();
    this.setupEvents();
    this.resize();
  }

  public resize(): void {
    const rect = this.canvas.parentElement?.getBoundingClientRect();
    if (rect) {
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
      if (this.camera.x === 0 && this.camera.y === 0) {
        this.camera.x = rect.width / 2;
        this.camera.y = rect.height / 2;
      }
    }
  }

  private initStars(): void {
    this.stars = [];
    for (let i = 0; i < 200; i++) {
      this.stars.push({
        x: (Math.random() - 0.5) * 3000,
        y: (Math.random() - 0.5) * 3000,
        size: Math.random() * 1.8 + 0.5,
        alpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.02 + 0.005
      });
    }
  }

  private setupEvents(): void {
    window.addEventListener('resize', () => this.resize());

    this.canvas.addEventListener('mousedown', (e) => {
      if (e.button === 0) {
        this.isDragging = true;
        this.dragStart = { x: e.clientX - this.camera.x, y: e.clientY - this.camera.y };
      }
    });

    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mousePos = { x: e.clientX - rect.left, y: e.clientY - rect.top };

      if (this.isDragging) {
        this.camera.x = e.clientX - this.dragStart.x;
        this.camera.y = e.clientY - this.dragStart.y;
      }
    });

    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });

    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      const newZoom = Math.max(0.4, Math.min(2.5, this.camera.zoom * zoomFactor));

      const mouseX = e.clientX - this.canvas.getBoundingClientRect().left;
      const mouseY = e.clientY - this.canvas.getBoundingClientRect().top;
      
      this.camera.x = mouseX - (mouseX - this.camera.x) * (newZoom / this.camera.zoom);
      this.camera.y = mouseY - (mouseY - this.camera.y) * (newZoom / this.camera.zoom);
      this.camera.zoom = newZoom;
    });
  }

  public getBodyAtScreenPos(screenX: number, screenY: number, state: GameState): CelestialBody | null {
    if (state.viewMode === 'surface') return null;

    const rect = this.canvas.getBoundingClientRect();
    const x = (screenX - rect.left - this.camera.x) / this.camera.zoom;
    const y = (screenY - rect.top - this.camera.y) / this.camera.zoom;

    for (const body of state.bodies) {
      const pos = this.getBodyPosition(body, state);
      const dist = Math.hypot(pos.x - x, pos.y - y);
      if (dist <= Math.max(body.radius + 6, 16)) {
        return body;
      }
    }
    return null;
  }

  public getSurfacePlotAtScreenPos(screenX: number, screenY: number, state: GameState): SurfacePlot | null {
    if (state.viewMode !== 'surface') return null;

    const rect = this.canvas.getBoundingClientRect();
    const x = screenX - rect.left;
    const y = screenY - rect.top;

    const body = state.bodies.find(b => b.id === state.selectedBodyId) || state.bodies[1];
    const plots = this.calculateSurfacePlots(body, state, this.canvas.width, this.canvas.height);

    for (const plot of plots) {
      if (
        x >= plot.x - plot.width / 2 &&
        x <= plot.x + plot.width / 2 &&
        y >= plot.y - plot.height &&
        y <= plot.y + 20
      ) {
        return plot;
      }
    }
    return null;
  }

  public getBodyPosition(body: CelestialBody, state: GameState): { x: number; y: number } {
    if (body.parentId) {
      const parent = state.bodies.find(b => b.id === body.parentId);
      if (parent) {
        const parentPos = this.getBodyPosition(parent, state);
        return {
          x: parentPos.x + Math.cos(body.orbitAngle) * body.orbitRadius,
          y: parentPos.y + Math.sin(body.orbitAngle) * body.orbitRadius
        };
      }
    }
    return {
      x: Math.cos(body.orbitAngle) * body.orbitRadius,
      y: Math.sin(body.orbitAngle) * body.orbitRadius
    };
  }

  public render(state: GameState): void {
    if (state.viewMode === 'surface') {
      this.renderSurfaceView(state);
    } else {
      this.renderSystemView(state);
    }
  }

  /* ------------------------------------------------------------- */
  /*                  SYSTEM VIEW RENDERING                        */
  /* ------------------------------------------------------------- */
  private renderSystemView(state: GameState): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.translate(this.camera.x, this.camera.y);
    ctx.scale(this.camera.zoom, this.camera.zoom);

    // 1. Starfield
    for (const star of this.stars) {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }

    // 2. Orbits
    ctx.lineWidth = 1 / this.camera.zoom;
    for (const body of state.bodies) {
      if (body.orbitRadius > 0) {
        ctx.beginPath();
        ctx.strokeStyle = body.type === 'pirate_outpost' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(59, 130, 246, 0.15)';
        if (body.parentId) {
          const parent = state.bodies.find(b => b.id === body.parentId);
          if (parent) {
            const pPos = this.getBodyPosition(parent, state);
            ctx.arc(pPos.x, pPos.y, body.orbitRadius, 0, Math.PI * 2);
          }
        } else {
          ctx.arc(0, 0, body.orbitRadius, 0, Math.PI * 2);
        }
        ctx.stroke();
      }
    }

    // 3. Bodies
    for (const body of state.bodies) {
      const pos = this.getBodyPosition(body, state);

      if (body.type === 'star') {
        const glow = ctx.createRadialGradient(pos.x, pos.y, body.radius * 0.2, pos.x, pos.y, body.radius * 2.8);
        glow.addColorStop(0, 'rgba(251, 191, 36, 1)');
        glow.addColorStop(0.4, 'rgba(245, 158, 11, 0.4)');
        glow.addColorStop(1, 'rgba(245, 158, 11, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, body.radius * 2.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.save();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, body.radius, 0, Math.PI * 2);
      ctx.fillStyle = body.color;
      ctx.fill();

      if (body.detailsColor) {
        ctx.beginPath();
        ctx.arc(pos.x - body.radius * 0.2, pos.y - body.radius * 0.2, body.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = body.detailsColor;
        ctx.fill();
      }

      if (body.hasRings) {
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y, body.radius * 2.2, body.radius * 0.7, -0.3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(253, 186, 116, 0.6)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      if (body.type === 'station') {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(pos.x - body.radius, pos.y - body.radius, body.radius * 2, body.radius * 2);
      }

      if (body.pirateThreat && body.pirateThreat > 0) {
        const pulse = (Math.sin(state.time * 4) + 1) * 0.5;
        ctx.strokeStyle = `rgba(239, 68, 68, ${0.3 + pulse * 0.5})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, body.radius + 6 + pulse * 4, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.restore();

      // Selection Reticle
      if (body.id === state.selectedBodyId) {
        ctx.save();
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2 / this.camera.zoom;
        const boxSize = body.radius + 8;
        ctx.beginPath();
        ctx.moveTo(pos.x - boxSize, pos.y - boxSize + 6);
        ctx.lineTo(pos.x - boxSize, pos.y - boxSize);
        ctx.lineTo(pos.x - boxSize + 6, pos.y - boxSize);

        ctx.moveTo(pos.x + boxSize - 6, pos.y - boxSize);
        ctx.lineTo(pos.x + boxSize, pos.y - boxSize);
        ctx.lineTo(pos.x + boxSize, pos.y - boxSize + 6);

        ctx.moveTo(pos.x + boxSize, pos.y + boxSize - 6);
        ctx.lineTo(pos.x + boxSize, pos.y + boxSize);
        ctx.lineTo(pos.x + boxSize - 6, pos.y + boxSize);

        ctx.moveTo(pos.x - boxSize + 6, pos.y + boxSize);
        ctx.lineTo(pos.x - boxSize, pos.y + boxSize);
        ctx.lineTo(pos.x - boxSize, pos.y + boxSize - 6);
        ctx.stroke();
        ctx.restore();
      }

      ctx.fillStyle = body.colonized ? '#67e8f9' : '#94a3b8';
      ctx.font = `600 ${Math.max(10, 12 / this.camera.zoom)}px Rajdhani`;
      ctx.textAlign = 'center';
      ctx.fillText(body.name, pos.x, pos.y + body.radius + 14);
    }

    // 4. Ships
    for (const ship of state.ships) {
      let shipX = 0;
      let shipY = 0;

      if (ship.state === 'traveling' && ship.destinationId) {
        const fromBody = state.bodies.find(b => b.id === ship.locationId);
        const toBody = state.bodies.find(b => b.id === ship.destinationId);
        if (fromBody && toBody) {
          const p1 = this.getBodyPosition(fromBody, state);
          const p2 = this.getBodyPosition(toBody, state);
          shipX = p1.x + (p2.x - p1.x) * ship.travelProgress;
          shipY = p1.y + (p2.y - p1.y) * ship.travelProgress;

          ctx.beginPath();
          ctx.setLineDash([4, 4]);
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      } else {
        const loc = state.bodies.find(b => b.id === ship.locationId);
        if (loc) {
          const lPos = this.getBodyPosition(loc, state);
          const orbitOffset = (state.time * 0.8 + (parseInt(ship.id, 36) || 0)) % (Math.PI * 2);
          shipX = lPos.x + Math.cos(orbitOffset) * (loc.radius + 10);
          shipY = lPos.y + Math.sin(orbitOffset) * (loc.radius + 10);
        }
      }

      ctx.save();
      ctx.translate(shipX, shipY);
      ctx.fillStyle = ship.type === 'mining_drone' ? '#facc15' : (ship.type === 'frigate' ? '#a855f7' : '#38bdf8');
      ctx.beginPath();
      ctx.moveTo(0, -5);
      ctx.lineTo(4, 5);
      ctx.lineTo(-4, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  /* ------------------------------------------------------------- */
  /*                 PLANET SURFACE VIEW RENDERING                 */
  /* ------------------------------------------------------------- */
  private calculateSurfacePlots(body: CelestialBody, state: GameState, width: number, height: number): SurfacePlot[] {
    const plots: SurfacePlot[] = [];
    const maxPlots = body.maxBuildings || 6;
    const groundY = height * 0.72;
    const spacing = Math.min(95, (width - 120) / Math.max(1, maxPlots));
    const startX = (width - (maxPlots - 1) * spacing) / 2;

    // Convert building quantities into flattened array of active buildings
    const buildingList: { type: BuildingType; level: number }[] = [];
    for (const [bType, count] of Object.entries(body.buildings)) {
      for (let i = 0; i < count; i++) {
        buildingList.push({ type: bType as BuildingType, level: count });
      }
    }

    const pendingOnBody = state.buildQueue.filter(q => q.targetId === body.id && q.kind === 'building');

    for (let i = 0; i < maxPlots; i++) {
      const x = startX + i * spacing;
      // Slight planetary curvature arch
      const arch = Math.sin((i / (maxPlots - 1 || 1)) * Math.PI) * 24;
      const y = groundY - arch;

      if (i < buildingList.length) {
        plots.push({
          index: i,
          x,
          y,
          width: 70,
          height: 80,
          buildingType: buildingList[i].type,
          level: buildingList[i].level,
          isBuilding: false,
          buildProgress: 1
        });
      } else if (i < buildingList.length + pendingOnBody.length) {
        const pIndex = i - buildingList.length;
        const task = pendingOnBody[pIndex];
        plots.push({
          index: i,
          x,
          y,
          width: 70,
          height: 80,
          buildingType: task.typeId as BuildingType,
          level: 1,
          isBuilding: true,
          buildProgress: task.progress / task.totalTime
        });
      } else {
        plots.push({
          index: i,
          x,
          y,
          width: 70,
          height: 80,
          level: 0,
          isBuilding: false,
          buildProgress: 0
        });
      }
    }

    return plots;
  }

  private renderSurfaceView(state: GameState): void {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const body = state.bodies.find(b => b.id === state.selectedBodyId) || state.bodies[1];

    ctx.clearRect(0, 0, w, h);

    // 1. Sky Gradient based on Planet Biome
    const sky = ctx.createLinearGradient(0, 0, 0, h * 0.75);
    if (body.id === 'terra') {
      sky.addColorStop(0, '#040b19');
      sky.addColorStop(0.6, '#0f294a');
      sky.addColorStop(1, '#1e4b7a');
    } else if (body.id === 'ares') {
      sky.addColorStop(0, '#150608');
      sky.addColorStop(0.6, '#451016');
      sky.addColorStop(1, '#832822');
    } else if (body.type === 'station') {
      sky.addColorStop(0, '#020617');
      sky.addColorStop(0.8, '#0b1329');
      sky.addColorStop(1, '#1e293b');
    } else {
      sky.addColorStop(0, '#070913');
      sky.addColorStop(0.7, '#151d38');
      sky.addColorStop(1, '#24325a');
    }
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    // 2. Stars & Cosmic Dust in upper atmosphere
    for (let i = 0; i < 60; i++) {
      const star = this.stars[i];
      const starX = (star.x + 1500) % w;
      const starY = (star.y + 1500) % (h * 0.6);
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * 0.8})`;
      ctx.fillRect(starX, starY, star.size, star.size);
    }

    // 3. Distant Helios Prime Sun / Orbital Moon in sky
    if (body.type !== 'star') {
      ctx.save();
      const sunX = w * 0.8;
      const sunY = h * 0.22;
      const sunGlow = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 120);
      sunGlow.addColorStop(0, 'rgba(254, 240, 138, 0.9)');
      sunGlow.addColorStop(0.2, 'rgba(245, 158, 11, 0.4)');
      sunGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 120, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // 4. Mountainous Horizon Silhouettes
    ctx.save();
    ctx.fillStyle = body.id === 'ares' ? '#2c0b0e' : (body.type === 'station' ? '#0f172a' : '#081c30');
    ctx.beginPath();
    ctx.moveTo(0, h * 0.72);
    for (let x = 0; x <= w; x += 40) {
      const mountainY = h * 0.68 + Math.sin(x * 0.015) * 18 + Math.cos(x * 0.03) * 10;
      ctx.lineTo(x, mountainY);
    }
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();
    ctx.restore();

    // 5. Planetary Surface Crust (Ground)
    ctx.save();
    const ground = ctx.createLinearGradient(0, h * 0.7, 0, h);
    if (body.id === 'terra') {
      ground.addColorStop(0, '#15803d');
      ground.addColorStop(0.15, '#1e293b');
      ground.addColorStop(1, '#0f172a');
    } else if (body.id === 'ares') {
      ground.addColorStop(0, '#b91c1c');
      ground.addColorStop(0.2, '#7f1d1d');
      ground.addColorStop(1, '#450a0a');
    } else if (body.type === 'station') {
      ground.addColorStop(0, '#334155');
      ground.addColorStop(0.2, '#1e293b');
      ground.addColorStop(1, '#020617');
    } else {
      ground.addColorStop(0, '#475569');
      ground.addColorStop(0.2, '#334155');
      ground.addColorStop(1, '#0f172a');
    }

    ctx.fillStyle = ground;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.72);
    ctx.quadraticCurveTo(w / 2, h * 0.66, w, h * 0.72);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.fill();

    // Surface Grid line
    ctx.strokeStyle = body.type === 'station' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.72);
    ctx.quadraticCurveTo(w / 2, h * 0.66, w, h * 0.72);
    ctx.stroke();
    ctx.restore();

    // 6. Overhead Stationed Ships (Patrols)
    const shipsHere = state.ships.filter(s => s.locationId === body.id && s.state !== 'traveling');
    for (let i = 0; i < shipsHere.length; i++) {
      const ship = shipsHere[i];
      const shipX = ((state.time * (ship.speed * 0.3) + i * 180) % (w + 100)) - 50;
      const shipY = h * 0.35 + (i * 35) + Math.sin(state.time * 2 + i) * 8;

      ctx.save();
      ctx.translate(shipX, shipY);
      // Engine Glow trail
      const trail = ctx.createLinearGradient(-30, 0, 0, 0);
      trail.addColorStop(0, 'rgba(56, 189, 248, 0)');
      trail.addColorStop(1, 'rgba(56, 189, 248, 0.8)');
      ctx.fillStyle = trail;
      ctx.fillRect(-25, -2, 25, 4);

      // Ship Sprite
      ctx.fillStyle = ship.type === 'mining_drone' ? '#facc15' : (ship.type === 'frigate' ? '#c084fc' : '#38bdf8');
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(-8, -6);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-8, 6);
      ctx.closePath();
      ctx.fill();

      // Ship Label
      ctx.fillStyle = 'rgba(226, 232, 240, 0.7)';
      ctx.font = '11px Rajdhani';
      ctx.textAlign = 'center';
      ctx.fillText(ship.name, 0, -10);
      ctx.restore();
    }

    // 7. Render Colony Building Plots
    const plots = this.calculateSurfacePlots(body, state, w, h);
    const time = state.time;

    for (const plot of plots) {
      const isHovered = Math.hypot(this.mousePos.x - plot.x, this.mousePos.y - (plot.y - 30)) < 45;

      ctx.save();
      ctx.translate(plot.x, plot.y);

      // Plot Foundation Pad
      ctx.fillStyle = isHovered ? '#38bdf8' : '#1e293b';
      ctx.fillRect(-32, -4, 64, 8);
      ctx.strokeStyle = isHovered ? '#67e8f9' : '#475569';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-32, -4, 64, 8);

      if (plot.isBuilding) {
        this.drawUnderConstruction(ctx, plot.buildProgress, time);
      } else if (plot.buildingType) {
        switch (plot.buildingType) {
          case 'solar_array':
            this.drawSolarArray(ctx, time);
            break;
          case 'mineral_mine':
            this.drawMineralMine(ctx, time);
            break;
          case 'alloy_foundry':
            this.drawAlloyFoundry(ctx, time);
            break;
          case 'research_lab':
            this.drawResearchLab(ctx, time);
            break;
          case 'orbital_shipyard':
            this.drawOrbitalShipyard(ctx, time);
            break;
          case 'defense_turret':
            this.drawDefenseTurret(ctx, time);
            break;
        }

        // Building Label & Level Badge
        const def = BUILDING_DEFS[plot.buildingType];
        ctx.fillStyle = '#f8fafc';
        ctx.font = '600 12px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText(def.name.split(' ')[0], 0, 22);

        ctx.fillStyle = 'var(--accent-cyan)';
        ctx.font = '700 11px Rajdhani';
        ctx.fillText(`LVL ${plot.level}`, 0, 35);
      } else {
        this.drawEmptyPlot(ctx, plot.index + 1, isHovered);
      }

      ctx.restore();
    }

    // 8. Top Surface View Banner
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.strokeStyle = 'var(--border-color)';
    ctx.lineWidth = 1;
    ctx.fillRect(w / 2 - 160, 16, 320, 42);
    ctx.strokeRect(w / 2 - 160, 16, 320, 42);

    ctx.fillStyle = '#38bdf8';
    ctx.font = '700 15px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText(`${body.name.toUpperCase()} SURFACE`, w / 2, 34);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 12px Rajdhani';
    const totalBuilt = plots.filter(p => p.buildingType && !p.isBuilding).length;
    ctx.fillText(`Colony Infrastructure: ${totalBuilt} / ${body.maxBuildings || 6} Sectors Active`, w / 2, 49);
    ctx.restore();
  }

  /* ---------------- Procedural Structure Sprites ---------------- */
  private drawSolarArray(ctx: CanvasRenderingContext2D, time: number): void {
    // Twin solar wing panels
    const glow = (Math.sin(time * 3) + 1) * 0.5;
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = `rgba(56, 189, 248, ${0.6 + glow * 0.4})`;
    ctx.lineWidth = 1.5;

    // Left Panel
    ctx.beginPath();
    ctx.moveTo(-28, -8);
    ctx.lineTo(-6, -24);
    ctx.lineTo(-6, -8);
    ctx.lineTo(-28, 8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Right Panel
    ctx.beginPath();
    ctx.moveTo(6, -24);
    ctx.lineTo(28, -8);
    ctx.lineTo(28, 8);
    ctx.lineTo(6, -8);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Central Pillar
    ctx.fillStyle = '#64748b';
    ctx.fillRect(-3, -28, 6, 24);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(0, -28, 4, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawMineralMine(ctx: CanvasRenderingContext2D, time: number): void {
    // Derrick Tower
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-16, -4);
    ctx.lineTo(-6, -38);
    ctx.lineTo(6, -38);
    ctx.lineTo(16, -4);
    ctx.stroke();

    // Cross beams
    ctx.beginPath();
    ctx.moveTo(-12, -18);
    ctx.lineTo(12, -18);
    ctx.moveTo(-6, -38);
    ctx.lineTo(6, -4);
    ctx.moveTo(6, -38);
    ctx.lineTo(-6, -4);
    ctx.stroke();

    // Laser drill pulse into the crust
    const pulse = (Math.sin(time * 12) + 1) * 0.5;
    ctx.fillStyle = `rgba(239, 68, 68, ${0.4 + pulse * 0.6})`;
    ctx.fillRect(-2, -36, 4, 40);

    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, -4, 5 + pulse * 3, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawAlloyFoundry(ctx: CanvasRenderingContext2D, time: number): void {
    // Heavy Industrial Facility
    ctx.fillStyle = '#334155';
    ctx.fillRect(-22, -26, 44, 22);
    ctx.strokeStyle = '#64748b';
    ctx.strokeRect(-22, -26, 44, 22);

    // Glowing smelter furnace window
    ctx.fillStyle = '#f97316';
    ctx.fillRect(-10, -18, 20, 10);

    // Smokestacks
    ctx.fillStyle = '#475569';
    ctx.fillRect(-18, -42, 8, 16);
    ctx.fillRect(10, -42, 8, 16);

    // Plasma steam puffs
    const puffY = (time * 25) % 30;
    ctx.fillStyle = 'rgba(249, 115, 22, 0.4)';
    ctx.beginPath();
    ctx.arc(-14, -42 - puffY, 4 + puffY * 0.2, 0, Math.PI * 2);
    ctx.arc(14, -42 - (puffY + 12) % 30, 4 + puffY * 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  private drawResearchLab(ctx: CanvasRenderingContext2D, time: number): void {
    // Holographic Geodesic Dome
    ctx.fillStyle = 'rgba(168, 85, 247, 0.25)';
    ctx.beginPath();
    ctx.arc(0, -12, 24, Math.PI, 0);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Internal pulsing quantum core
    const corePulse = (Math.sin(time * 5) + 1) * 0.5;
    ctx.fillStyle = `rgba(192, 132, 252, ${0.5 + corePulse * 0.5})`;
    ctx.beginPath();
    ctx.arc(0, -12, 7 + corePulse * 3, 0, Math.PI * 2);
    ctx.fill();

    // Beacon dish
    ctx.strokeStyle = '#a855f7';
    ctx.beginPath();
    ctx.moveTo(0, -36);
    ctx.lineTo(0, -48);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, -48, 6, Math.PI * 0.8, Math.PI * 2.2);
    ctx.stroke();
  }

  private drawOrbitalShipyard(ctx: CanvasRenderingContext2D, time: number): void {
    // Launch Gantry Tower
    ctx.strokeStyle = '#06b6d4';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-12, -4);
    ctx.lineTo(-12, -64);
    ctx.lineTo(-4, -64);
    ctx.lineTo(-4, -4);
    ctx.stroke();

    // Crane Arm extending right
    ctx.beginPath();
    ctx.moveTo(-12, -58);
    ctx.lineTo(24, -58);
    ctx.lineTo(16, -46);
    ctx.stroke();

    // Suspended Starship Construction Frame
    ctx.fillStyle = 'rgba(56, 189, 248, 0.7)';
    ctx.beginPath();
    ctx.moveTo(10, -40);
    ctx.lineTo(18, -48);
    ctx.lineTo(2, -48);
    ctx.closePath();
    ctx.fill();

    // Construction Laser spark
    const spark = (Math.sin(time * 15) + 1) * 0.5;
    ctx.strokeStyle = `rgba(250, 204, 21, ${spark})`;
    ctx.beginPath();
    ctx.moveTo(16, -46);
    ctx.lineTo(10, -44);
    ctx.stroke();
  }

  private drawDefenseTurret(ctx: CanvasRenderingContext2D, time: number): void {
    // Armored bunker base
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.moveTo(-18, -4);
    ctx.lineTo(-12, -18);
    ctx.lineTo(12, -18);
    ctx.lineTo(18, -4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.stroke();

    // Rotating Turret Head
    const angle = Math.sin(time * 1.2) * 0.4 - 0.7; // Aiming upwards
    ctx.save();
    ctx.translate(0, -18);
    ctx.rotate(angle);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-8, -8, 16, 12);

    // Twin Railgun Barrels
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-6, -26, 4, 18);
    ctx.fillRect(2, -26, 4, 18);

    // Target laser dot
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, -26);
    ctx.lineTo(0, -70);
    ctx.stroke();

    ctx.restore();
  }

  private drawUnderConstruction(ctx: CanvasRenderingContext2D, progress: number, time: number): void {
    // Scaffolding holo-grid
    ctx.strokeStyle = 'rgba(6, 182, 212, 0.6)';
    ctx.lineWidth = 1;
    ctx.strokeRect(-24, -48, 48, 44);

    ctx.beginPath();
    ctx.moveTo(-24, -48);
    ctx.lineTo(24, -4);
    ctx.moveTo(24, -48);
    ctx.lineTo(-24, -4);
    ctx.stroke();

    // Construction progress bar & ring
    ctx.fillStyle = '#06b6d4';
    ctx.fillRect(-24, -54, 48 * progress, 4);

    const scanY = -4 + Math.sin(time * 6) * 44;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-24, scanY);
    ctx.lineTo(24, scanY);
    ctx.stroke();

    ctx.fillStyle = '#67e8f9';
    ctx.font = '700 11px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText(`${Math.floor(progress * 100)}%`, 0, -20);
  }

  private drawEmptyPlot(ctx: CanvasRenderingContext2D, plotNum: number, isHovered: boolean): void {
    ctx.strokeStyle = isHovered ? 'rgba(56, 189, 248, 0.8)' : 'rgba(148, 163, 184, 0.3)';
    ctx.setLineDash([4, 4]);
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-24, -40, 48, 36);
    ctx.setLineDash([]);

    ctx.fillStyle = isHovered ? '#38bdf8' : '#64748b';
    ctx.font = '700 16px Orbitron';
    ctx.textAlign = 'center';
    ctx.fillText('+', 0, -20);

    ctx.font = '600 11px Rajdhani';
    ctx.fillText(`SECTOR ${plotNum}`, 0, 16);
  }
}
