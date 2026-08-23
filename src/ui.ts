import { AstralGameEngine } from './game';
import { soundEngine } from './audio';

export class AstralUIManager {
  private engine: AstralGameEngine;
  private renderedSpiritIdForMoves: string = '';
  private renderedQueueKey: string = '';
  private lastDialogueIndex: number = -1;
  private lastDialogueSpeaker: string = '';
  private hasPlayedInitialAlertBuzz: boolean = false;

  constructor(engine: AstralGameEngine) {
    this.engine = engine;
    this.setupEventListeners();

    // Trigger initial alert buzz on very first user interaction
    const triggerInitialBuzz = () => {
      if (!this.hasPlayedInitialAlertBuzz) {
        this.hasPlayedInitialAlertBuzz = true;
        soundEngine.playEmergencyAlertBuzz();
      }
      window.removeEventListener('click', triggerInitialBuzz);
      window.removeEventListener('keydown', triggerInitialBuzz);
      window.removeEventListener('touchstart', triggerInitialBuzz);
    };

    window.addEventListener('click', triggerInitialBuzz);
    window.addEventListener('keydown', triggerInitialBuzz);
    window.addEventListener('touchstart', triggerInitialBuzz);
  }

  private setupEventListeners(): void {
    // Stream Queue Click (Event Delegation)
    const queueContainer = document.getElementById('stream-queue');
    queueContainer?.addEventListener('click', (e) => {
      const badge = (e.target as HTMLElement).closest('.stream-badge') as HTMLElement;
      if (badge && badge.dataset.idx !== undefined) {
        const idx = parseInt(badge.dataset.idx, 10);
        this.engine.switchActiveSpirit(idx);
        this.updateUI();
      }
    });

    // Dialogue advance on click
    const dialogueBox = document.getElementById('dialogue-box');
    dialogueBox?.addEventListener('click', () => {
      this.engine.advanceDialogue();
      this.updateUI();
    });

    // Canvas click: interact or rhythm hit
    const canvas = document.getElementById('game-canvas');
    canvas?.addEventListener('click', () => {
      const state = this.engine.getState();
      if (state.mode === 'battle' && state.battle?.turn === 'rhythm_timing') {
        this.engine.resolveRhythmHit();
        this.updateUI();
      } else if (state.mode === 'audio_match_scan' && state.audioMatch?.challengeType === 'rhythm_pulse') {
        this.engine.hitRhythmPulse();
        this.updateUI();
      } else if (state.mode === 'exploration' && state.nearbyInteractable) {
        this.engine.interactWithNearby();
        this.updateUI();
      }
    });

    // Stage 1: Frequency Slider
    const slider = document.getElementById('freq-slider') as HTMLInputElement;
    slider?.addEventListener('input', (e) => {
      const val = parseFloat((e.target as HTMLInputElement).value);
      this.engine.setPlayerFrequency(val);
      this.updateUI();
    });

    // Stage 2: Melody Buttons
    document.querySelectorAll('.melody-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const pad = parseInt((e.currentTarget as HTMLElement).dataset.pad || '0', 10);
        this.engine.inputMelodyPad(pad);
        this.updateUI();
      });
    });

    // Stage 3: Rhythm Pulse Hit Button
    document.getElementById('rhythm-hit-btn')?.addEventListener('click', () => {
      this.engine.hitRhythmPulse();
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

        // Toggle phone buzz emergency alert visuals
        if (d.speaker.includes('EMERGENCY') || d.speaker.includes('BROADCAST')) {
          dialogueBox.classList.add('emergency-alert');
        } else {
          dialogueBox.classList.remove('emergency-alert');
        }

        if (this.lastDialogueSpeaker !== d.speaker || this.lastDialogueIndex !== d.index) {
          document.getElementById('dialogue-speaker')!.textContent = d.speaker;
          document.getElementById('dialogue-avatar')!.textContent = d.avatar;
          document.getElementById('dialogue-text')!.textContent = d.text[d.index] || '';
          this.lastDialogueSpeaker = d.speaker;
          this.lastDialogueIndex = d.index;
        }
      } else {
        dialogueBox.classList.add('hidden');
        dialogueBox.classList.remove('emergency-alert');
        this.lastDialogueIndex = -1;
      }
    }

    // 2. Audio Match Radar Panel (Discrete Challenges)
    const scanPanel = document.getElementById('audio-scan-panel');
    if (scanPanel) {
      if (state.mode === 'audio_match_scan' && state.audioMatch) {
        scanPanel.classList.remove('hidden');
        const m = state.audioMatch;
        let title = '🎻 BAROQUE VIOLIN EQUALIZER';
        if (m.challengeType === 'call_response') title = '🪕 INDIAN SITAR RAGA JAM';
        else if (m.challengeType === 'rhythm_pulse') title = '🥁 JAPANESE TAIKO BEAT SYNC';
        
        document.getElementById('scan-stage-title')!.textContent = title;

        // Toggle Challenge Controls
        const s1 = document.getElementById('stage-1-controls');
        const s2 = document.getElementById('stage-2-controls');
        const s3 = document.getElementById('stage-3-controls');
        
        if (m.challengeType === 'waveform_slider') {
          s1?.classList.remove('hidden');
          s2?.classList.add('hidden');
          s3?.classList.add('hidden');
          const sliderEl = document.getElementById('freq-slider') as HTMLInputElement;
          if (sliderEl && document.activeElement !== sliderEl) {
            sliderEl.value = m.playerFreq.toFixed(0);
          }
        } else if (m.challengeType === 'call_response') {
          s1?.classList.add('hidden');
          s2?.classList.remove('hidden');
          s3?.classList.add('hidden');
        } else if (m.challengeType === 'rhythm_pulse') {
          s1?.classList.add('hidden');
          s2?.classList.add('hidden');
          s3?.classList.remove('hidden');
        }
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
        document.getElementById('player-name')!.textContent = `Lv.${b.playerSpirit.level} ${b.playerSpirit.name} [${b.playerSpirit.vibeTag}]`;
        document.getElementById('player-hp-bar')!.style.width = `${pPct}%`;
        document.getElementById('player-hp-text')!.textContent = `${b.playerSpirit.hp}/${b.playerSpirit.maxHp} HP (XP: ${b.playerSpirit.xp}/${b.playerSpirit.maxXp})`;

        // Enemy HP
        let eName = '';
        let eHp = 0;
        let eMaxHp = 1;
        if ((b.type === 'rival' || b.type === 'wild') && b.enemySpirit) {
          eName = `Lv.${b.enemySpirit.level} ${b.enemySpirit.name} [${b.enemySpirit.vibeTag}]`;
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

        // Only rebuild move buttons if spirit moves changed
        const movesContainer = document.getElementById('battle-moves');
        if (movesContainer) {
          const currentSpiritKey = `${b.playerSpirit.id}_${b.playerSpirit.moves.length}`;
          if (this.renderedSpiritIdForMoves !== currentSpiritKey) {
            movesContainer.innerHTML = b.playerSpirit.moves.map((m, idx) => `
              <button class="stem-pad-btn" data-idx="${idx}">
                <div class="pad-light"></div>
                <div class="pad-content">
                  <div style="font-weight: 700; font-size: 0.95rem;">[${idx + 1}] ${m.name}</div>
                  <div style="font-size: 0.8rem; color: #38bdf8; font-weight: 700;">${m.effectiveness || `${m.type.toUpperCase()} STEM`}</div>
                  <div style="font-size: 0.74rem; opacity: 0.85;">Power: ${m.power}</div>
                </div>
              </button>
            `).join('');

            movesContainer.querySelectorAll<HTMLButtonElement>('.stem-pad-btn').forEach(btn => {
              btn.addEventListener('click', (e) => {
                const idx = parseInt((e.currentTarget as HTMLElement).dataset.idx || '0', 10);
                this.engine.initiatePlayerMove(idx);
                this.updateUI();
              });
            });

            this.renderedSpiritIdForMoves = currentSpiritKey;
          }

          // Toggle disabled state during rhythm timing or enemy turn
          const isPlayerTurn = b.turn === 'player';
          movesContainer.querySelectorAll<HTMLButtonElement>('.stem-pad-btn').forEach(btn => {
            btn.disabled = !isPlayerTurn;
          });
        }

        // Blend Button
        const blendBtn = document.getElementById('battle-blend-btn');
        if (blendBtn) {
          if (b.canBlend && !b.blendActive && b.turn === 'player') {
            blendBtn.classList.remove('hidden');
          } else {
            blendBtn.classList.add('hidden');
          }
        }
      } else {
        battlePanel.classList.add('hidden');
        this.renderedSpiritIdForMoves = '';
      }
    }

    // 4. Stream Queue Top Bar
    const queueContainer = document.getElementById('stream-queue');
    if (queueContainer) {
      const currentQueueKey = `${state.activeSpiritIndex}_${state.streamQueue.map(s => `${s.id}_${s.level}`).join(',')}`;
      if (this.renderedQueueKey !== currentQueueKey) {
        queueContainer.innerHTML = state.streamQueue.map((s, idx) => `
          <div class="stream-badge ${idx === state.activeSpiritIndex ? 'active' : ''}" data-idx="${idx}" style="cursor: pointer; user-select: none;" title="Click or press [Q] to switch active Harmonimal">
            <span style="font-size: 1.1rem; pointer-events: none;">${s.avatar || '🐱'}</span>
            <span style="font-size: 0.8rem; font-weight: 700; pointer-events: none;">Lv.${s.level} ${s.name} <span style="opacity: 0.7; font-size: 0.7rem; pointer-events: none;">${s.vibeTag}</span></span>
          </div>
        `).join('');
        this.renderedQueueKey = currentQueueKey;
      }
    }
  }
}
