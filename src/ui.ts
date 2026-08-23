import { BUILDING_DEFS, SHIP_DEFS } from './data';
import { GameEngine } from './game';
import { addLog, calculateBuildingCost, canAfford, grantResources, saveGame } from './state';
import { TUTORIAL_STEPS } from './tutorial';
import { BuildingType, GameState, ShipType } from './types';

export class UIManager {
  private state: GameState;
  private engine: GameEngine;
  private activeTab: string = 'sector';
  private renderedTab: string = '';
  private renderedBodyId: string = '';
  private lastQueueSignature: string = '';
  private lastShipCount: number = -1;
  private resourcesInitialized: boolean = false;
  private renderedTutorialStep: number = -1;
  private renderedTutorialComplete: boolean = false;

  constructor(state: GameState, engine: GameEngine) {
    this.state = state;
    this.engine = engine;
    this.setupEventListeners();
    this.setupModalEvents();
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

    // View Mode Switcher
    const sysBtn = document.getElementById('view-system-btn');
    const surfBtn = document.getElementById('view-surface-btn');
    sysBtn?.addEventListener('click', () => this.setViewMode('system'));
    surfBtn?.addEventListener('click', () => this.setViewMode('surface'));
  }

  public setViewMode(mode: 'system' | 'surface'): void {
    this.state.viewMode = mode;
    const sysBtn = document.getElementById('view-system-btn');
    const surfBtn = document.getElementById('view-surface-btn');
    const hintText = document.getElementById('hint-text');

    if (mode === 'system') {
      sysBtn?.classList.add('active');
      surfBtn?.classList.remove('active');
      if (hintText) hintText.textContent = 'Click a planet or station to manage • Drag to pan • Scroll to zoom';
    } else {
      sysBtn?.classList.remove('active');
      surfBtn?.classList.add('active');
      if (hintText) hintText.textContent = 'Colony Surface View • Click any plot or building to manage infrastructure';
    }
  }

  public switchTab(tab: string): void {
    this.activeTab = tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.tab-btn[data-tab="${tab}"]`)?.classList.add('active');
    this.renderTabContent();
  }

  private setupModalEvents(): void {
    const helpBtn = document.getElementById('help-btn');
    const modal = document.getElementById('guide-modal');
    const closeBtn = document.getElementById('close-guide-btn');
    const dismissBtn = document.getElementById('dismiss-guide-btn');
    const restartTutorialBtn = document.getElementById('restart-tutorial-btn');

    const openModal = () => modal?.classList.remove('hidden');
    const closeModal = () => modal?.classList.add('hidden');

    helpBtn?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    dismissBtn?.addEventListener('click', closeModal);

    modal?.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    restartTutorialBtn?.addEventListener('click', () => {
      this.state.tutorial.stepIndex = 0;
      this.state.tutorial.completed = false;
      this.state.tutorial.active = true;
      this.renderedTutorialStep = -1;
      closeModal();
      this.updateUI();
    });
  }

  public updateUI(): void {
    this.updateTopResources();
    this.renderEventLog();
    this.updateTutorialHUD();

    // Check if structural tab re-render is required (tab changed, body changed, or items added/removed)
    const currentQueueSig = this.state.buildQueue.map(q => q.id).join(',');
    const selectedBodyId = this.state.selectedBodyId || 'terra';
    
    if (
      this.activeTab !== this.renderedTab ||
      selectedBodyId !== this.renderedBodyId ||
      currentQueueSig !== this.lastQueueSignature ||
      this.state.ships.length !== this.lastShipCount
    ) {
      this.renderTabContent();
    } else {
      // In-place updates for progress bars and button states without destroying DOM
      this.updateDynamicTabElements();
    }
  }

  private updateTutorialHUD(): void {
    const hud = document.getElementById('tutorial-hud');
    if (!hud) return;

    if (!this.state.tutorial.active || this.state.tutorial.completed) {
      hud.style.display = 'none';
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('highlight'));
      return;
    }
    hud.style.display = 'block';

    const step = TUTORIAL_STEPS[this.state.tutorial.stepIndex];
    if (!step) {
      this.state.tutorial.completed = true;
      hud.style.display = 'none';
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('highlight'));
      return;
    }

    const isStepDone = step.isComplete(this.state);

    // Only rebuild HUD HTML if step or completion state changed
    if (this.renderedTutorialStep !== this.state.tutorial.stepIndex || this.renderedTutorialComplete !== isStepDone) {
      this.renderedTutorialStep = this.state.tutorial.stepIndex;
      this.renderedTutorialComplete = isStepDone;

      // Update tab highlight
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('highlight'));
      if (step.highlightTab && !isStepDone && this.activeTab !== step.highlightTab) {
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${step.highlightTab}"]`);
        if (tabBtn) tabBtn.classList.add('highlight');
      }

      const rewardParts: string[] = [];
      if (step.reward.energy) rewardParts.push(`+${step.reward.energy} ⚡ Energy`);
      if (step.reward.minerals) rewardParts.push(`+${step.reward.minerals} ⛏️ Minerals`);
      if (step.reward.alloys) rewardParts.push(`+${step.reward.alloys} ⚙️ Alloys`);
      if (step.reward.science) rewardParts.push(`+${step.reward.science} 🔬 Science`);

      hud.innerHTML = `
        <div class="tutorial-header">
          <span class="tutorial-badge">${step.badge}</span>
          <button id="hide-tutorial-btn" class="close-btn" style="font-size: 1.1rem; line-height: 1;" title="Dismiss">&times;</button>
        </div>
        <div class="tutorial-title">${step.title}</div>
        <div class="tutorial-desc">${step.description}</div>
        <div class="tutorial-instruction">${isStepDone ? '✅ Objective Completed!' : `👉 ${step.instruction}`}</div>
        <div style="font-size: 0.8rem; color: #94a3b8; margin-bottom: 0.6rem;"><em>💡 Hint: ${step.hint}</em></div>
        <div class="tutorial-reward">🎁 Reward: ${rewardParts.join(' • ')}</div>
        ${isStepDone ? `
          <button id="claim-tutorial-btn" class="action-btn" style="background: linear-gradient(135deg, #10b981, #059669); box-shadow: 0 0 12px rgba(16, 185, 129, 0.5);">
            🎉 Claim Reward & Next Mission
          </button>
        ` : ''}
      `;

      const claimBtn = document.getElementById('claim-tutorial-btn');
      if (claimBtn) {
        claimBtn.addEventListener('click', () => {
          grantResources(this.state.resources, step.reward);
          addLog(this.state, `Tutorial Objective [${step.title}] Completed! Resources received.`, 'success');
          if (this.state.tutorial.stepIndex + 1 < TUTORIAL_STEPS.length) {
            this.state.tutorial.stepIndex++;
          } else {
            this.state.tutorial.completed = true;
            addLog(this.state, `All Imperial Academy missions completed! You are now sovereign commander of the sector.`, 'success');
          }
          this.updateUI();
        });
      }

      const hideBtn = document.getElementById('hide-tutorial-btn');
      if (hideBtn) {
        hideBtn.addEventListener('click', () => {
          this.state.tutorial.active = false;
          this.updateUI();
        });
      }
    }
  }

  private updateTopResources(): void {
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

    if (!this.resourcesInitialized) {
      container.innerHTML = items.map(item => `
        <div class="resource-item">
          <div class="res-header">
            <span>${item.icon}</span>
            <span>${item.label}</span>
          </div>
          <div class="res-val" id="res-val-${item.id}">0</div>
          <div class="res-rate" id="res-rate-${item.id}">+0.0/s</div>
        </div>
      `).join('');
      this.resourcesInitialized = true;
    }

    for (const item of items) {
      const valElem = document.getElementById(`res-val-${item.id}`);
      const rateElem = document.getElementById(`res-rate-${item.id}`);
      if (valElem) valElem.textContent = item.val.toLocaleString();
      if (rateElem) {
        rateElem.textContent = `${item.rate >= 0 ? '+' : ''}${item.rate.toFixed(1)}/s`;
        rateElem.className = `res-rate ${item.rate < 0 ? 'negative' : ''}`;
      }
    }
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

    this.renderedTab = this.activeTab;
    this.renderedBodyId = selectedBody.id;
    this.lastQueueSignature = this.state.buildQueue.map(q => q.id).join(',');
    this.lastShipCount = this.state.ships.length;

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

  private updateDynamicTabElements(): void {
    const container = document.getElementById('tab-content');
    if (!container) return;

    const selectedBody = this.state.bodies.find(b => b.id === this.state.selectedBodyId) || this.state.bodies[1];

    // 1. Update construction progress bars in-place
    for (const task of this.state.buildQueue) {
      const pct = Math.min(100, Math.floor((task.progress / task.totalTime) * 100));
      const bar = container.querySelector(`.task-bar[data-task-id="${task.id}"]`) as HTMLElement;
      const text = container.querySelector(`.task-percent[data-task-id="${task.id}"]`) as HTMLElement;
      if (bar) bar.style.width = `${pct}%`;
      if (text) text.textContent = `${pct}%`;
    }

    // 2. Update ship travel progress bars
    for (const ship of this.state.ships) {
      if (ship.state === 'traveling') {
        const bar = container.querySelector(`.ship-progress-bar[data-ship-id="${ship.id}"]`) as HTMLElement;
        if (bar) bar.style.width = `${Math.min(100, ship.travelProgress * 100)}%`;
      }
    }

    // 3. Update build buttons affordability in-place
    if (this.activeTab === 'base' && selectedBody.colonized) {
      const totalBuildings = Object.values(selectedBody.buildings as Record<string, number>).reduce((a, b) => a + b, 0);
      container.querySelectorAll('.build-btn').forEach(btn => {
        const type = (btn as HTMLElement).dataset.type as BuildingType;
        const currentLevel = selectedBody.buildings[type] || 0;
        const cost = calculateBuildingCost(type, currentLevel);
        const affordable = canAfford(this.state.resources, cost) && totalBuildings < selectedBody.maxBuildings;
        (btn as HTMLButtonElement).disabled = !affordable;
      });
    } else if (this.activeTab === 'shipyard' && selectedBody.colonized) {
      container.querySelectorAll('.build-ship-btn').forEach(btn => {
        const sType = (btn as HTMLElement).dataset.type as ShipType;
        const def = SHIP_DEFS[sType];
        const affordable = canAfford(this.state.resources, def.cost);
        (btn as HTMLButtonElement).disabled = !affordable;
      });
    } else if (this.activeTab === 'sector' && !selectedBody.colonized && selectedBody.canColonize) {
      const colBtn = document.getElementById('colonize-btn') as HTMLButtonElement;
      if (colBtn) {
        const canAffordColony = canAfford(this.state.resources, { alloys: 50, energy: 30, minerals: 100 });
        colBtn.disabled = !canAffordColony;
      }
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
        ${body.colonized ? `
          <button id="view-surface-action-btn" class="action-btn" style="margin-top: 0.75rem; background: linear-gradient(135deg, #0ea5e9, #0284c7);">
            🪐 View Colony Surface Map
          </button>
        ` : ''}
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

    const viewSurfBtn = document.getElementById('view-surface-action-btn');
    if (viewSurfBtn) {
      viewSurfBtn.addEventListener('click', () => {
        this.setViewMode('surface');
      });
    }

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
              <span class="task-percent" data-task-id="${p.id}">${Math.floor((p.progress / p.totalTime) * 100)}%</span>
            </div>
            <div style="width: 100%; height: 4px; background: #1e293b; border-radius: 2px; margin-top: 6px; overflow: hidden;">
              <div class="task-bar" data-task-id="${p.id}" style="width: ${(p.progress / p.totalTime) * 100}%; height: 100%; background: var(--accent-cyan); transition: width 0.1s linear;"></div>
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
              <span class="task-percent" data-task-id="${p.id}">${Math.floor((p.progress / p.totalTime) * 100)}%</span>
            </div>
            <div style="width: 100%; height: 4px; background: #1e293b; border-radius: 2px; margin-top: 6px; overflow: hidden;">
              <div class="task-bar" data-task-id="${p.id}" style="width: ${(p.progress / p.totalTime) * 100}%; height: 100%; background: #a855f7; transition: width 0.1s linear;"></div>
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
              <div class="ship-progress-bar" data-ship-id="${ship.id}" style="width: ${ship.travelProgress * 100}%; height: 100%; background: #38bdf8; transition: width 0.1s linear;"></div>
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
