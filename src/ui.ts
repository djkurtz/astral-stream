import { BUILDING_DEFS, SHIP_DEFS } from './data';
import { GameEngine } from './game';
import { calculateBuildingCost, canAfford, saveGame } from './state';
import { BuildingType, GameState, ShipType } from './types';

export class UIManager {
  private state: GameState;
  private engine: GameEngine;
  private activeTab: string = 'sector';

  constructor(state: GameState, engine: GameEngine) {
    this.state = state;
    this.engine = engine;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Tab Switching
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const tab = target.dataset.tab;
        if (tab) {
          this.activeTab = tab;
          document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
          target.classList.add('active');
          this.renderTabContent();
        }
      });
    });

    // Speed / Pause / Save
    const speedBtn = document.getElementById('speed-btn');
    if (speedBtn) {
      speedBtn.addEventListener('click', () => {
        if (this.state.speed === 1) this.state.speed = 2;
        else if (this.state.speed === 2) this.state.speed = 4;
        else this.state.speed = 1;
        speedBtn.innerText = `Speed: ${this.state.speed}x`;
      });
    }

    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        this.state.paused = !this.state.paused;
        pauseBtn.innerText = this.state.paused ? '▶ Resume' : '⏸ Pause';
        pauseBtn.style.color = this.state.paused ? '#f59e0b' : '';
      });
    }

    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
        saveGame(this.state);
      });
    }
  }

  public updateUI(): void {
    this.renderTopResources();
    this.renderEventLog();
    this.renderTabContent();
  }

  private renderTopResources(): void {
    const container = document.getElementById('resources');
    if (!container) return;

    const res = this.state.resources;
    const rates = this.state.resourceRates;

    const items = [
      { id: 'energy', label: 'Energy', icon: '⚡', val: Math.floor(res.energy), rate: rates.energy },
      { id: 'minerals', label: 'Minerals', icon: '⛏️', val: Math.floor(res.minerals), rate: rates.minerals },
      { id: 'alloys', label: 'Alloys', icon: '⚙️', val: Math.floor(res.alloys), rate: rates.alloys },
      { id: 'science', label: 'Science', icon: '🔬', val: Math.floor(res.science), rate: rates.science }
    ];

    container.innerHTML = items.map(item => `
      <div class="resource-item">
        <div class="res-header">
          <span>${item.icon}</span>
          <span>${item.label}</span>
        </div>
        <div class="res-val">${item.val.toLocaleString()}</div>
        <div class="res-rate ${item.rate < 0 ? 'negative' : ''}">
          ${item.rate >= 0 ? '+' : ''}${item.rate.toFixed(1)}/s
        </div>
      </div>
    `).join('');
  }

  private renderEventLog(): void {
    const logElem = document.getElementById('event-log');
    if (!logElem) return;

    // Only re-render if count or content changed to avoid scrolling jumps
    const html = this.state.logs.map(log => `
      <div class="log-entry ${log.type}">
        <span class="log-time">[${log.time}]</span>
        <span class="log-text">${log.text}</span>
      </div>
    `).join('');

    if (logElem.innerHTML !== html) {
      logElem.innerHTML = html;
    }
  }

  public renderTabContent(): void {
    const container = document.getElementById('tab-content');
    if (!container) return;

    const selectedBody = this.state.bodies.find(b => b.id === this.state.selectedBodyId) || this.state.bodies[1];

    if (this.activeTab === 'sector') {
      this.renderSectorOverview(container, selectedBody);
    } else if (this.activeTab === 'base') {
      this.renderBaseColony(container, selectedBody);
    } else if (this.activeTab === 'shipyard') {
      this.renderShipyard(container, selectedBody);
    } else if (this.activeTab === 'fleet') {
      this.renderFleets(container);
    }
  }

  private renderSectorOverview(container: HTMLElement, body: any): void {
    const totalBuildings = body.buildings ? Object.values(body.buildings as Record<string, number>).reduce((a, b) => a + b, 0) : 0;
    const shipsHere = this.state.ships.filter(s => s.locationId === body.id);

    let colonizeSection = '';
    if (!body.colonized && body.canColonize) {
      const canAffordColony = canAfford(this.state.resources, { alloys: 50, energy: 30, minerals: 100 });
      colonizeSection = `
        <div class="card" style="border-color: #f59e0b;">
          <div class="card-header">
            <span class="card-title">Establish Colony</span>
          </div>
          <div class="card-desc">Deploy modular colony base to unlock harvesting and local industry.</div>
          <div class="cost-row">Cost: 100 Minerals, 50 Alloys, 30 Energy</div>
          <button id="colonize-btn" class="action-btn" ${canAffordColony ? '' : 'disabled'}>
            🚀 Establish Colony Base
          </button>
        </div>
      `;
    }

    container.innerHTML = `
      <div class="section-title">
        <span>${body.name}</span>
        <span style="font-size: 0.8rem; color: #94a3b8;">${body.type.toUpperCase()}</span>
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Status</span>
          <span style="color: ${body.colonized ? 'var(--accent-green)' : '#94a3b8'};">
            ${body.colonized ? '● Colonized' : '○ Uninhabited'}
          </span>
        </div>
        <div class="card-desc">
          ${body.colonized 
            ? `Infrastructure: ${totalBuildings} / ${body.maxBuildings} slots utilized.` 
            : (body.canColonize ? 'Rich in untapped surface minerals. Colony deployment ready.' : 'Extreme atmospheric conditions. Unsuitable for terrestrial base.')}
        </div>
        ${body.pirateThreat ? `<div style="color: #ef4444; font-size: 0.85rem; font-weight: 600;">⚠️ Pirate Threat Level: ${body.pirateThreat}%</div>` : ''}
      </div>

      ${colonizeSection}

      <div class="section-title">Stationed Fleets (${shipsHere.length})</div>
      ${shipsHere.length === 0 ? '<div style="color: #64748b; font-size: 0.85rem;">No vessels in local orbit.</div>' : ''}
      ${shipsHere.map(s => `
        <div class="card" style="margin-bottom: 0.5rem; padding: 0.6rem;">
          <div style="display: flex; justify-content: space-between; font-weight: 600;">
            <span>${s.name}</span>
            <span style="color: var(--accent-cyan); font-size: 0.85rem;">${s.state.toUpperCase()}</span>
          </div>
        </div>
      `).join('')}
    `;

    const colBtn = document.getElementById('colonize-btn');
    if (colBtn) {
      colBtn.addEventListener('click', () => {
        this.engine.colonizeBody(body.id);
        this.renderTabContent();
      });
    }
  }

  private renderBaseColony(container: HTMLElement, body: any): void {
    if (!body.colonized) {
      container.innerHTML = `
        <div class="section-title">${body.name}</div>
        <div class="card">
          <div class="card-desc">This sector is not yet colonized. Go to the <strong>Overview</strong> tab to establish a base first.</div>
        </div>
      `;
      return;
    }

    const totalBuildings = Object.values(body.buildings as Record<string, number>).reduce((a, b) => a + b, 0);

    let buildQueueHtml = '';
    const pending = this.state.buildQueue.filter(t => t.targetId === body.id && t.kind === 'building');
    if (pending.length > 0) {
      buildQueueHtml = `
        <div class="section-title">Construction Queue</div>
        ${pending.map(p => `
          <div class="card" style="border-color: var(--accent-cyan);">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600;">
              <span>${p.name}</span>
              <span>${Math.floor((p.progress / p.totalTime) * 100)}%</span>
            </div>
            <div style="width: 100%; height: 4px; background: #1e293b; border-radius: 2px; margin-top: 6px; overflow: hidden;">
              <div style="width: ${(p.progress / p.totalTime) * 100}%; height: 100%; background: var(--accent-cyan);"></div>
            </div>
          </div>
        `).join('')}
      `;
    }

    const buildingCards = Object.entries(BUILDING_DEFS).map(([key, def]) => {
      const currentLevel = body.buildings[key as BuildingType] || 0;
      const cost = calculateBuildingCost(key as BuildingType, currentLevel);
      const affordable = canAfford(this.state.resources, cost) && totalBuildings < body.maxBuildings;

      const costParts: string[] = [];
      if (cost.minerals) costParts.push(`${cost.minerals} Min`);
      if (cost.alloys) costParts.push(`${cost.alloys} Alloy`);
      if (cost.energy) costParts.push(`${cost.energy} Nrg`);

      return `
        <div class="card">
          <div class="card-header">
            <span class="card-title">${def.name}</span>
            <span style="color: var(--accent-cyan); font-weight: 700; font-family: var(--font-display);">Lvl ${currentLevel}</span>
          </div>
          <div class="card-desc">${def.description}</div>
          <div class="cost-row">Cost: ${costParts.join(' • ')}</div>
          <button class="action-btn build-btn" data-type="${key}" ${affordable ? '' : 'disabled'}>
            🔨 Construct (Upgrade to Lvl ${currentLevel + 1})
          </button>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="section-title">
        <span>Colony Infrastructure</span>
        <span style="font-size: 0.85rem;">Slots: ${totalBuildings}/${body.maxBuildings}</span>
      </div>
      ${buildQueueHtml}
      ${buildingCards}
    `;

    container.querySelectorAll('.build-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = (e.currentTarget as HTMLElement).dataset.type as BuildingType;
        const currentLevel = body.buildings[type] || 0;
        const cost = calculateBuildingCost(type, currentLevel);
        this.engine.queueBuilding(body.id, type, cost);
        this.renderTabContent();
      });
    });
  }

  private renderShipyard(container: HTMLElement, body: any): void {
    const hasShipyard = body.colonized && (body.buildings.orbital_shipyard || 0) > 0;

    if (!hasShipyard) {
      container.innerHTML = `
        <div class="section-title">Orbital Shipyard</div>
        <div class="card">
          <div class="card-desc">An <strong>Orbital Shipyard</strong> has not been constructed at ${body.name}. Build one in the Base tab to begin starship assembly.</div>
        </div>
      `;
      return;
    }

    const shipQueue = this.state.buildQueue.filter(t => t.targetId === body.id && t.kind === 'ship');
    let queueHtml = '';
    if (shipQueue.length > 0) {
      queueHtml = `
        <div class="section-title">Gantry Construction Queue</div>
        ${shipQueue.map(p => `
          <div class="card" style="border-color: #a855f7;">
            <div style="display: flex; justify-content: space-between; font-size: 0.85rem; font-weight: 600;">
              <span>${p.name}</span>
              <span>${Math.floor((p.progress / p.totalTime) * 100)}%</span>
            </div>
            <div style="width: 100%; height: 4px; background: #1e293b; border-radius: 2px; margin-top: 6px; overflow: hidden;">
              <div style="width: ${(p.progress / p.totalTime) * 100}%; height: 100%; background: #a855f7;"></div>
            </div>
          </div>
        `).join('')}
      `;
    }

    const shipCards = Object.entries(SHIP_DEFS).map(([key, def]) => {
      const affordable = canAfford(this.state.resources, def.cost);
      const costParts: string[] = [];
      if (def.cost.minerals) costParts.push(`${def.cost.minerals} Min`);
      if (def.cost.alloys) costParts.push(`${def.cost.alloys} Alloy`);
      if (def.cost.energy) costParts.push(`${def.cost.energy} Nrg`);

      return `
        <div class="card">
          <div class="card-header">
            <span class="card-title">${def.name}</span>
            <span style="font-size: 0.8rem; color: #94a3b8;">${def.buildTime}s Build</span>
          </div>
          <div class="card-desc">${def.description}</div>
          <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.4rem;">
            Hull: ${def.hull} • Attack: ${def.attack} • Speed: ${def.speed}
          </div>
          <div class="cost-row">Cost: ${costParts.join(' • ')}</div>
          <button class="action-btn build-ship-btn" data-type="${key}" ${affordable ? '' : 'disabled'}>
            🚀 Commission Ship
          </button>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="section-title">Orbital Shipyard</div>
      ${queueHtml}
      ${shipCards}
    `;

    container.querySelectorAll('.build-ship-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const sType = (e.currentTarget as HTMLElement).dataset.type as ShipType;
        this.engine.queueShip(body.id, sType);
        this.renderTabContent();
      });
    });
  }

  private renderFleets(container: HTMLElement): void {
    if (this.state.ships.length === 0) {
      container.innerHTML = `
        <div class="section-title">Imperial Fleet Command</div>
        <div class="card">
          <div class="card-desc">No active starships in service. Commission vessels at the Orbital Shipyard.</div>
        </div>
      `;
      return;
    }

    const shipItems = this.state.ships.map(ship => {
      const loc = this.state.bodies.find(b => b.id === ship.locationId);
      const dest = ship.destinationId ? this.state.bodies.find(b => b.id === ship.destinationId) : null;

      // Targets to travel to
      const targetOptions = this.state.bodies
        .filter(b => b.id !== ship.locationId && b.type !== 'star')
        .map(b => `<option value="${b.id}">${b.name}</option>`)
        .join('');

      return `
        <div class="card">
          <div class="card-header">
            <span class="card-title">${ship.name}</span>
            <span style="color: var(--accent-cyan); font-size: 0.85rem; font-weight: 700;">${ship.state.toUpperCase()}</span>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 0.4rem;">
            Location: <strong style="color: #e2e8f0;">${ship.state === 'traveling' ? `En route to ${dest?.name}` : loc?.name}</strong>
          </div>
          <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.6rem;">
            Hull: ${ship.hull}/${ship.maxHull} • Combat Power: ${ship.attack}
          </div>
          ${ship.state !== 'traveling' ? `
            <div style="display: flex; gap: 0.5rem; margin-top: 0.5rem;">
              <select class="ctrl-btn ship-dest-select" style="flex: 1; padding: 0.3rem;" data-ship="${ship.id}">
                ${targetOptions}
              </select>
              <button class="action-btn send-ship-btn" style="width: auto; padding: 0.3rem 0.8rem;" data-ship="${ship.id}">
                Dispatch
              </button>
            </div>
          ` : `
            <div style="width: 100%; height: 4px; background: #1e293b; border-radius: 2px; overflow: hidden; margin-top: 0.5rem;">
              <div style="width: ${ship.travelProgress * 100}%; height: 100%; background: #38bdf8;"></div>
            </div>
          `}
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <div class="section-title">
        <span>Imperial Fleets (${this.state.ships.length})</span>
      </div>
      ${shipItems}
    `;

    container.querySelectorAll('.send-ship-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const shipId = (e.currentTarget as HTMLElement).dataset.ship!;
        const select = container.querySelector(`.ship-dest-select[data-ship="${shipId}"]`) as HTMLSelectElement;
        if (select) {
          this.engine.sendShip(shipId, select.value);
          this.renderTabContent();
        }
      });
    });
  }
}
