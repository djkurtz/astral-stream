import { CelestialBody, GameState } from './types';

export class SpaceRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private camera = { x: 0, y: 0, zoom: 1 };
  private isDragging = false;
  private dragStart = { x: 0, y: 0 };
  private stars: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];

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

    window.addEventListener('mousemove', (e) => {
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

      // Zoom towards mouse
      const mouseX = e.clientX - this.canvas.getBoundingClientRect().left;
      const mouseY = e.clientY - this.canvas.getBoundingClientRect().top;
      
      this.camera.x = mouseX - (mouseX - this.camera.x) * (newZoom / this.camera.zoom);
      this.camera.y = mouseY - (mouseY - this.camera.y) * (newZoom / this.camera.zoom);
      this.camera.zoom = newZoom;
    });
  }

  public getBodyAtScreenPos(screenX: number, screenY: number, state: GameState): CelestialBody | null {
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
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.translate(this.camera.x, this.camera.y);
    ctx.scale(this.camera.zoom, this.camera.zoom);

    // 1. Draw Starfield
    for (const star of this.stars) {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    }

    // 2. Draw Orbit lines
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

    // 3. Draw Celestial Bodies
    for (const body of state.bodies) {
      const pos = this.getBodyPosition(body, state);

      // Star Glow
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

      // Planet / Station Body
      ctx.save();
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, body.radius, 0, Math.PI * 2);
      ctx.fillStyle = body.color;
      ctx.fill();

      // Atmospheric Rim or detail
      if (body.detailsColor) {
        ctx.beginPath();
        ctx.arc(pos.x - body.radius * 0.2, pos.y - body.radius * 0.2, body.radius * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = body.detailsColor;
        ctx.fill();
      }

      // Rings (e.g. Zeus)
      if (body.hasRings) {
        ctx.beginPath();
        ctx.ellipse(pos.x, pos.y, body.radius * 2.2, body.radius * 0.7, -0.3, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(253, 186, 116, 0.6)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }

      // Station specific shape
      if (body.type === 'station') {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.strokeRect(pos.x - body.radius, pos.y - body.radius, body.radius * 2, body.radius * 2);
      }

      // Pirate Threat Warning Ring
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
        // 4 corners of target reticle
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

      // Name Label
      ctx.fillStyle = body.colonized ? '#67e8f9' : '#94a3b8';
      ctx.font = `600 ${Math.max(10, 12 / this.camera.zoom)}px Rajdhani`;
      ctx.textAlign = 'center';
      ctx.fillText(body.name, pos.x, pos.y + body.radius + 14);
    }

    // 4. Draw Ships
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

          // Trajectory trail
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
          // Orbit slightly outside planet
          const orbitOffset = (state.time * 0.8 + parseInt(ship.id, 36) || 0) % (Math.PI * 2);
          shipX = lPos.x + Math.cos(orbitOffset) * (loc.radius + 10);
          shipY = lPos.y + Math.sin(orbitOffset) * (loc.radius + 10);
        }
      }

      // Draw Ship Triangle
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
}
