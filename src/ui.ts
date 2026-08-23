import { AstralGameEngine } from './game';

export class AstralUIManager {
  private engine: AstralGameEngine;

  constructor(engine: AstralGameEngine) {
    this.engine = engine;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Dialogue advance
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
        } else if (state.mode === 'audio_match_scan') {
          this.engine.pulseRadarScan();
          this.updateUI();
        }
      }
    });

    // Modern Audio Match Radar Pulse Button
    document.getElementById('radar-scan-btn')?.addEventListener('click', () => {
      this.engine.pulseRadarScan();
      this.updateUI();
    });

    // Battle Playlist Blend Button
    document.getElementById('battle-blend-btn')?.addEventListener('click', () => {
      this.engine.triggerPlaylistBlend();
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

    // 2. Audio Match Radar Panel
    const scanPanel = document.getElementById('audio-scan-panel');
    if (scanPanel) {
      if (state.mode === 'audio_match_scan' && state.audioMatch) {
        scanPanel.classList.remove('hidden');
        const m = state.audioMatch;
        document.getElementById('scan-sync-display')!.textContent = `${m.currentSync}%`;
        document.getElementById('scan-target-display')!.textContent = `${m.spiritToUnlock.name} (${m.spiritToUnlock.vibeTag})`;
      } else {
        scanPanel.classList.add('hidden');
      }
    }

    // 3. Battle Launchpad Panel
    const battlePanel = document.getElementById('battle-panel');
    if (battlePanel) {
      if (state.mode === 'battle' && state.battle) {
        battlePanel.classList.remove('hidden');
        const b = state.battle;

        // Player HP
        const pPct = Math.max(0, (b.playerSpirit.hp / b.playerSpirit.maxHp) * 100);
        document.getElementById('player-name')!.textContent = `${b.playerSpirit.name} [${b.playerSpirit.vibeTag}]`;
        document.getElementById('player-hp-bar')!.style.width = `${pPct}%`;
        document.getElementById('player-hp-text')!.textContent = `${b.playerSpirit.hp}/${b.playerSpirit.maxHp} HP`;

        // Enemy HP
        let eName = '';
        let eHp = 0;
        let eMaxHp = 1;
        if (b.type === 'rival' && b.enemySpirit) {
          eName = `${b.enemySpirit.name} [${b.enemySpirit.vibeTag}]`;
          eHp = b.enemySpirit.hp;
          eMaxHp = b.enemySpirit.maxHp;
        } else if (b.type === 'boss' && b.enemyBoss) {
          eName = `${b.enemyBoss.name} [GLITCH STREAM]`;
          eHp = b.enemyBoss.hp;
          eMaxHp = b.enemyBoss.maxHp;
        }
        const ePct = Math.max(0, (eHp / eMaxHp) * 100);
        document.getElementById('enemy-name')!.textContent = eName;
        document.getElementById('enemy-hp-bar')!.style.width = `${ePct}%`;
        document.getElementById('enemy-hp-text')!.textContent = `${eHp}/${eMaxHp} HP`;

        // Stem Pad Buttons
        const movesContainer = document.getElementById('battle-moves');
        if (movesContainer) {
          movesContainer.innerHTML = b.playerSpirit.moves.map((m, idx) => `
            <button class="stem-pad-btn" data-idx="${idx}" ${b.turn !== 'player' ? 'disabled' : ''}>
              <div class="pad-light"></div>
              <div class="pad-content">
                <div style="font-weight: 700; font-size: 0.95rem;">${m.name}</div>
                <div style="font-size: 0.75rem; opacity: 0.8;">${m.type.toUpperCase()} STEM • PWR: ${m.power}</div>
              </div>
            </button>
          `).join('');

          movesContainer.querySelectorAll('.stem-pad-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
              const idx = parseInt((e.currentTarget as HTMLElement).dataset.idx || '0', 10);
              this.engine.executePlayerMove(idx);
              this.updateUI();
            });
          });
        }

        // Blend Button
        const blendBtn = document.getElementById('battle-blend-btn');
        if (blendBtn) {
          if (b.canBlend && !b.blendActive) {
            blendBtn.classList.remove('hidden');
          } else {
            blendBtn.classList.add('hidden');
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
          <span style="font-size: 0.8rem; font-weight: 700;">${s.name} <span style="opacity: 0.7; font-size: 0.7rem;">${s.vibeTag}</span></span>
        </div>
      `).join('');
    }
  }
}
