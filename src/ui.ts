import { AstralGameEngine } from './game';

export class AstralUIManager {
  private engine: AstralGameEngine;

  constructor(engine: AstralGameEngine) {
    this.engine = engine;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Dialogue advance on click anywhere on dialogue box or pressing Space/Enter
    const dialogueBox = document.getElementById('dialogue-box');
    dialogueBox?.addEventListener('click', () => {
      this.engine.advanceDialogue();
      this.updateUI();
    });

    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space' || e.code === 'Enter') {
        const state = this.engine.getState();
        if (state.dialogue) {
          this.engine.advanceDialogue();
          this.updateUI();
        }
      }
    });

    // Tuning Controls
    document.getElementById('tune-down-btn')?.addEventListener('click', () => {
      this.engine.adjustFrequency(-2.0);
      this.updateUI();
    });

    document.getElementById('tune-up-btn')?.addEventListener('click', () => {
      this.engine.adjustFrequency(2.0);
      this.updateUI();
    });

    document.getElementById('tune-fine-down-btn')?.addEventListener('click', () => {
      this.engine.adjustFrequency(-0.5);
      this.updateUI();
    });

    document.getElementById('tune-fine-up-btn')?.addEventListener('click', () => {
      this.engine.adjustFrequency(0.5);
      this.updateUI();
    });

    // Battle Fusion Button
    document.getElementById('battle-fuse-btn')?.addEventListener('click', () => {
      this.engine.triggerFusion();
      this.updateUI();
    });
  }

  public updateUI(): void {
    const state = this.engine.getState();

    // 1. Dialogue Box
    const dialogueBox = document.getElementById('dialogue-box');
    if (dialogueBox) {
      if (state.dialogue) {
        dialogueBox.classList.remove('hidden');
        const d = state.dialogue;
        document.getElementById('dialogue-speaker')!.textContent = d.speaker;
        document.getElementById('dialogue-avatar')!.textContent = d.avatar;
        document.getElementById('dialogue-text')!.textContent = d.text[d.index] || '';
      } else {
        dialogueBox.classList.add('hidden');
      }
    }

    // 2. Tuning Panel
    const tuningPanel = document.getElementById('tuning-panel');
    if (tuningPanel) {
      if (state.mode === 'tuning_tutorial' && state.tuning) {
        tuningPanel.classList.remove('hidden');
        document.getElementById('current-freq-display')!.textContent = `${state.tuning.currentFrequency.toFixed(1)} FM`;
        document.getElementById('target-freq-display')!.textContent = `${state.tuning.targetFrequency.toFixed(1)} FM`;
      } else {
        tuningPanel.classList.add('hidden');
      }
    }

    // 3. Battle Control Panel
    const battlePanel = document.getElementById('battle-panel');
    if (battlePanel) {
      if (state.mode === 'battle' && state.battle) {
        battlePanel.classList.remove('hidden');
        const b = state.battle;

        // Player HP
        const pPct = Math.max(0, (b.playerSpirit.hp / b.playerSpirit.maxHp) * 100);
        document.getElementById('player-name')!.textContent = b.playerSpirit.name;
        document.getElementById('player-hp-bar')!.style.width = `${pPct}%`;
        document.getElementById('player-hp-text')!.textContent = `${b.playerSpirit.hp}/${b.playerSpirit.maxHp} HP`;

        // Enemy HP
        let eName = '';
        let eHp = 0;
        let eMaxHp = 1;
        if (b.type === 'rival' && b.enemySpirit) {
          eName = b.enemySpirit.name;
          eHp = b.enemySpirit.hp;
          eMaxHp = b.enemySpirit.maxHp;
        } else if (b.type === 'boss' && b.enemyBoss) {
          eName = b.enemyBoss.name;
          eHp = b.enemyBoss.hp;
          eMaxHp = b.enemyBoss.maxHp;
        }
        const ePct = Math.max(0, (eHp / eMaxHp) * 100);
        document.getElementById('enemy-name')!.textContent = eName;
        document.getElementById('enemy-hp-bar')!.style.width = `${ePct}%`;
        document.getElementById('enemy-hp-text')!.textContent = `${eHp}/${eMaxHp} HP`;

        // Move Buttons
        const movesContainer = document.getElementById('battle-moves');
        if (movesContainer) {
          movesContainer.innerHTML = b.playerSpirit.moves.map((m, idx) => `
            <button class="move-btn" data-idx="${idx}" ${b.turn !== 'player' ? 'disabled' : ''}>
              <div style="font-weight: 700;">${m.name}</div>
              <div style="font-size: 0.75rem; opacity: 0.8;">Power: ${m.power} • ${m.type.toUpperCase()}</div>
            </button>
          `).join('');

          movesContainer.querySelectorAll('.move-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const idx = parseInt((e.currentTarget as HTMLElement).dataset.idx || '0', 10);
              this.engine.executePlayerMove(idx);
              this.updateUI();
            });
          });
        }

        // Fusion Button Display
        const fuseBtn = document.getElementById('battle-fuse-btn');
        if (fuseBtn) {
          if (b.canFuse && !b.fusionActive) {
            fuseBtn.classList.remove('hidden');
          } else {
            fuseBtn.classList.add('hidden');
          }
        }
      } else {
        battlePanel.classList.add('hidden');
      }
    }

    // 4. Stream Queue Top Bar
    const queueContainer = document.getElementById('stream-queue');
    if (queueContainer) {
      queueContainer.innerHTML = state.streamQueue.map((s, idx) => `
        <div class="stream-badge ${idx === state.activeSpiritIndex ? 'active' : ''}">
          <span>${s.avatar}</span>
          <span style="font-size: 0.8rem; font-weight: 700;">${s.name} (${s.frequency.toFixed(1)} FM)</span>
        </div>
      `).join('');
    }
  }
}
