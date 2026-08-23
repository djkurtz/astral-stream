// Harmonia: Opus of the Ensemble - UI & Modals Controller

import { HarmoniaGameEngine } from './game';
import { ZoneId } from './types';
import { soundEngine } from './audio';
import { REPERTOIRE_DATABASE, ALL_INSTRUMENTS_INFO, calculateEffectiveSkill } from './data';

export class HarmoniaUI {
  private engine: HarmoniaGameEngine;

  constructor(engine: HarmoniaGameEngine) {
    this.engine = engine;
    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Repertoire Modal Toggle Button
    const btnRepertoire = document.getElementById('btn-repertoire');
    const modalRepertoire = document.getElementById('modal-repertoire');
    const btnCloseRepertoire = document.getElementById('btn-close-repertoire');

    if (btnRepertoire && modalRepertoire) {
      btnRepertoire.addEventListener('click', () => {
        this.renderRepertoireList();
        modalRepertoire.classList.remove('hidden');
      });
    }

    if (btnCloseRepertoire && modalRepertoire) {
      btnCloseRepertoire.addEventListener('click', () => {
        modalRepertoire.classList.add('hidden');
      });
    }

    // Ensemble Roster Modal Toggle Button
    const btnEnsemble = document.getElementById('btn-ensemble');
    const modalEnsemble = document.getElementById('modal-ensemble');
    const btnCloseEnsemble = document.getElementById('btn-close-ensemble');

    if (btnEnsemble && modalEnsemble) {
      btnEnsemble.addEventListener('click', () => {
        this.renderEnsembleRoster();
        modalEnsemble.classList.remove('hidden');
      });
    }

    if (btnCloseEnsemble && modalEnsemble) {
      btnCloseEnsemble.addEventListener('click', () => {
        modalEnsemble.classList.add('hidden');
      });
    }

    // Quests Journal Modal Toggle Button
    const btnQuests = document.getElementById('btn-quests');
    const modalQuests = document.getElementById('modal-quests');
    const btnCloseQuests = document.getElementById('btn-close-quests');

    if (btnQuests && modalQuests) {
      btnQuests.addEventListener('click', () => {
        this.renderQuestsList();
        modalQuests.classList.remove('hidden');
      });
    }

    if (btnCloseQuests && modalQuests) {
      btnCloseQuests.addEventListener('click', () => {
        modalQuests.classList.add('hidden');
      });
    }

    // HarmoniDex Modal Toggle Button
    const btnDex = document.getElementById('btn-dex');
    const modalDex = document.getElementById('modal-dex');
    const btnCloseDex = document.getElementById('btn-close-dex');

    if (btnDex && modalDex) {
      btnDex.addEventListener('click', () => {
        this.renderHarmoniDex();
        modalDex.classList.remove('hidden');
      });
    }

    if (btnCloseDex && modalDex) {
      btnCloseDex.addEventListener('click', () => {
        modalDex.classList.add('hidden');
      });
    }

    // Clef Badges Modal Toggle Button
    const btnBadges = document.getElementById('btn-badges');
    const modalBadges = document.getElementById('modal-badges');
    const btnCloseBadges = document.getElementById('btn-close-badges');

    if (btnBadges && modalBadges) {
      btnBadges.addEventListener('click', () => {
        this.renderBadgesList();
        modalBadges.classList.remove('hidden');
      });
    }

    if (btnCloseBadges && modalBadges) {
      btnCloseBadges.addEventListener('click', () => {
        modalBadges.classList.add('hidden');
      });
    }

    // Customization / Styling Mirror Modal Toggle Button
    const btnCustomization = document.getElementById('btn-customization');
    const modalCustomization = document.getElementById('modal-customization');
    const btnCloseCustomization = document.getElementById('btn-close-customization');

    if (btnCustomization && modalCustomization) {
      btnCustomization.addEventListener('click', () => {
        this.renderCustomizationModal();
        modalCustomization.classList.remove('hidden');
      });
    }

    if (btnCloseCustomization && modalCustomization) {
      btnCloseCustomization.addEventListener('click', () => {
        modalCustomization.classList.add('hidden');
      });
    }

    // World Map Modal Toggle Button
    const btnMap = document.getElementById('btn-map');
    const modalMap = document.getElementById('modal-map');
    const btnCloseMap = document.getElementById('btn-close-map');

    if (btnMap && modalMap) {
      btnMap.addEventListener('click', () => {
        this.renderWorldMapModal();
        modalMap.classList.remove('hidden');
      });
    }

    if (btnCloseMap && modalMap) {
      btnCloseMap.addEventListener('click', () => {
        modalMap.classList.add('hidden');
      });
    }

    // System Menu & Settings Modal Toggle Button
    const btnSystem = document.getElementById('btn-system');
    const modalSystem = document.getElementById('modal-system');
    const btnCloseSystem = document.getElementById('btn-close-system');

    if (btnSystem && modalSystem) {
      btnSystem.addEventListener('click', () => {
        this.renderSystemMenuModal();
        modalSystem.classList.remove('hidden');
      });
    }

    if (btnCloseSystem && modalSystem) {
      btnCloseSystem.addEventListener('click', () => {
        modalSystem.classList.add('hidden');
      });
    }

    window.addEventListener('open-customization-modal', () => {
      if (modalCustomization) {
        this.renderCustomizationModal();
        modalCustomization.classList.remove('hidden');
      }
    });

    // Master Luthier Forge Modal
    const modalLuthier = document.getElementById('modal-luthier');
    const btnCloseLuthier = document.getElementById('btn-close-luthier');

    window.addEventListener('open-luthier-shop', () => {
      this.renderLuthierForge();
      modalLuthier?.classList.remove('hidden');
    });

    if (btnCloseLuthier && modalLuthier) {
      btnCloseLuthier.addEventListener('click', () => {
        modalLuthier.classList.add('hidden');
      });
    }

    // Practice Shed Launcher Button
    const btnPractice = document.getElementById('btn-practice');
    if (btnPractice) {
      btnPractice.addEventListener('click', () => {
        this.engine.startPracticeSession('metronome');
      });
    }

    // Click backdrop outside modal content to close
    [modalRepertoire, modalEnsemble, modalQuests, modalDex, modalBadges, modalCustomization, modalMap, modalSystem].forEach((modal) => {
      if (modal) {
        modal.addEventListener('click', (e) => {
          if (e.target === modal) {
            modal.classList.add('hidden');
          }
        });
      }
    });

    // Keyboard Shortcuts for Modals & Escape to Close
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Escape') {
        const allModals = [modalRepertoire, modalEnsemble, modalQuests, modalDex, modalBadges, modalCustomization, modalMap, modalSystem];
        const anyOpen = allModals.some(m => m && !m.classList.contains('hidden'));
        if (anyOpen) {
          allModals.forEach(m => m?.classList.add('hidden'));
        } else {
          // Toggle system menu on ESC when no other modal is open
          if (modalSystem) {
            this.renderSystemMenuModal();
            modalSystem.classList.remove('hidden');
          }
        }
        return;
      }

      const mode = this.engine.getState().mode;
      if (mode !== 'exploration') return;

      if (e.code === 'KeyM') {
        modalMap?.classList.toggle('hidden');
        if (modalMap && !modalMap.classList.contains('hidden')) {
          this.renderWorldMapModal();
        }
      }
      if (e.code === 'KeyC') {
        modalCustomization?.classList.toggle('hidden');
        if (modalCustomization && !modalCustomization.classList.contains('hidden')) {
          this.renderCustomizationModal();
        }
      }
      if (e.code === 'KeyR') {
        modalRepertoire?.classList.toggle('hidden');
        if (modalRepertoire && !modalRepertoire.classList.contains('hidden')) {
          this.renderRepertoireList();
        }
      }
      if (e.code === 'KeyE') {
        modalEnsemble?.classList.toggle('hidden');
        if (modalEnsemble && !modalEnsemble.classList.contains('hidden')) {
          this.renderEnsembleRoster();
        }
      }
      if (e.code === 'KeyQ') {
        modalQuests?.classList.toggle('hidden');
        if (modalQuests && !modalQuests.classList.contains('hidden')) {
          this.renderQuestsList();
        }
      }
      if (e.code === 'KeyH') {
        modalDex?.classList.toggle('hidden');
        if (modalDex && !modalDex.classList.contains('hidden')) {
          this.renderHarmoniDex();
        }
      }
      if (e.code === 'KeyB') {
        modalBadges?.classList.toggle('hidden');
        if (modalBadges && !modalBadges.classList.contains('hidden')) {
          this.renderBadgesList();
        }
      }
      if (e.code === 'KeyP') {
        this.engine.startPracticeSession('metronome');
      }
    });
  }

  public renderRepertoireList(): void {
    const listContainer = document.getElementById('repertoire-list');
    if (!listContainer) return;

    const state = this.engine.getState();
    listContainer.innerHTML = '';

    // Calculate current ensemble composition
    const ensembleSections: Record<string, number> = { strings: 0, woodwinds: 0, brass: 0, percussion: 0 };
    state.ensemble.members.forEach((m) => {
      ensembleSections[m.section] = (ensembleSections[m.section] || 0) + 1;
    });

    // Compute ensemble average skill level across all four core disciplines
    let avgSkill = 0;
    if (state.ensemble.members.length > 0) {
      const totalSkill = state.ensemble.members.reduce(
        (acc, m) => acc + (m.stats.technique + m.stats.toneQuality + m.stats.tempoStability + m.stats.sightReading) / 4,
        0
      );
      avgSkill = totalSkill / state.ensemble.members.length;
    }

    // Display all pieces in the repertoire catalog
    REPERTOIRE_DATABASE.forEach((piece) => {
      const card = document.createElement('div');
      card.className = 'repertoire-card';

      const isOwned = state.repertoire.some((p) => p.id === piece.id);
      const isActive = state.ensemble.activePiece?.id === piece.id;

      // 1. Playability Check & Missing Parts
      const required = piece.requiredSections || {};
      const missingParts: string[] = [];
      let canPlay = true;

      for (const [sec, neededCount] of Object.entries(required)) {
        if (neededCount && neededCount > 0) {
          const currentCount = ensembleSections[sec] || 0;
          if (currentCount < neededCount) {
            canPlay = false;
            const diff = neededCount - currentCount;
            const secName = sec.charAt(0).toUpperCase() + sec.slice(1);
            const examples =
              sec === 'strings'
                ? 'Violin / Cello / Guitar'
                : sec === 'woodwinds'
                ? 'Flute / Saxophone / Clarinet'
                : sec === 'brass'
                ? 'Trumpet / French Horn / Trombone'
                : 'Concert Drums / Marimba / Timpani';
            missingParts.push(`${diff}x ${secName} (${examples})`);
          }
        }
      }

      // 2. Ensemble Mastery & Execution Quality Indicator
      const targetSkill = piece.difficulty * 18; // Difficulty 1..5 -> target 18..90
      const skillRatio = Math.min(1.25, Math.max(0.2, avgSkill / Math.max(1, targetSkill)));
      const masteryPct = Math.round(skillRatio * 100);

      let masteryDesc = '';
      let masteryColor = '';
      if (masteryPct >= 105) {
        masteryDesc = `✨ Virtuoso Execution (${masteryPct}%) - Pristine phrasing & supreme acoustic power`;
        masteryColor = '#10b981';
      } else if (masteryPct >= 85) {
        masteryDesc = `🎶 High Proficiency (${masteryPct}%) - Tight rhythmic stability & rich harmonic resonance`;
        masteryColor = '#38bdf8';
      } else if (masteryPct >= 60) {
        masteryDesc = `🎼 Capable Performance (${masteryPct}%) - Playable, occasional dynamic unevenness`;
        masteryColor = '#fbbf24';
      } else {
        masteryDesc = `⚠️ Strained Execution (${masteryPct}%) - Severe technique deficit, high risk of recital flubs`;
        masteryColor = '#f43f5e';
      }

      // 3. Numeric Impressiveness Score & Win Likelihood
      // Base score reflects the intrinsic complexity and acoustic magnitude of the piece
      const numSections = Object.keys(required).filter((k) => (required as any)[k] > 0).length || 1;
      const baseImpressiveness = piece.difficulty * 250 + numSections * 150 + piece.melody.length * 15;
      const projectedImpressiveness = Math.round(baseImpressiveness * (canPlay ? skillRatio : 0.35));

      // Win Likelihood in battles and conservatory auditions
      const winLikelihood = Math.min(99, Math.max(12, Math.round((projectedImpressiveness / (piece.difficulty * 440)) * 88)));
      let winBadge = '';
      let winColor = '';
      if (winLikelihood >= 85) {
        winBadge = 'Dominant / Guaranteed Win';
        winColor = '#10b981';
      } else if (winLikelihood >= 65) {
        winBadge = 'Favorable Advantage';
        winColor = '#38bdf8';
      } else if (winLikelihood >= 45) {
        winBadge = 'Contested (Requires Inspired Play)';
        winColor = '#fbbf24';
      } else {
        winBadge = 'High Defeat Risk';
        winColor = '#f43f5e';
      }

      // Format required parts summary
      const reqEntries = Object.entries(required).filter(([_, count]) => count && count > 0);
      const reqText =
        reqEntries.length > 0
          ? reqEntries.map(([s, c]) => `${c}x ${s.charAt(0).toUpperCase() + s.slice(1)}`).join(', ')
          : 'Any Solo Instrument';

      card.innerHTML = `
        <div class="piece-header">
          <div class="piece-title-row">
            <div class="piece-title">
              ${piece.title} 
              <span style="font-size: 11px; padding: 2px 8px; border-radius: 4px; background: ${isOwned ? 'rgba(56, 189, 248, 0.2)' : 'rgba(100, 116, 139, 0.2)'}; color: ${isOwned ? '#38bdf8' : '#94a3b8'}; border: 1px solid ${isOwned ? '#38bdf8' : '#64748b'};">
                ${isOwned ? '📜 Score Acquired' : '🔒 Lost Score'}
              </span>
            </div>
            <div class="piece-composer">Composer: ${piece.composer} • Genre: ${piece.genre}</div>
          </div>
          <div class="piece-score-badge">
            <span class="piece-score-val">${projectedImpressiveness} <span style="font-size: 11px; color: #94a3b8; font-weight: normal;">/ ${baseImpressiveness}</span></span>
            <span class="piece-score-label">Impressiveness Potential</span>
          </div>
        </div>

        <div class="piece-desc">${piece.description}</div>

        <!-- Evaluation & Metrics Grid -->
        <div class="piece-metrics-grid">
          <div class="metric-block">
            <div class="metric-title">🏆 Competition Win Likelihood</div>
            <div class="metric-val" style="color: ${winColor};">
              ${canPlay ? `${winLikelihood}% — ${winBadge}` : '0% — Cannot perform incomplete score'}
            </div>
            <div style="font-size: 11px; color: #94a3b8;">
              ${canPlay ? `Score based on ${masteryPct}% ensemble skill + inspired execution.` : 'Recruit missing sections to unlock recital viability.'}
            </div>
          </div>

          <div class="metric-block">
            <div class="metric-title">🎻 Ensemble Execution Quality</div>
            <div class="metric-val" style="color: ${masteryColor};">
              ${masteryDesc}
            </div>
            <div class="mastery-bar-track">
              <div class="mastery-bar-fill" style="width: ${Math.min(100, masteryPct)}%; background: ${masteryColor};"></div>
            </div>
          </div>
        </div>

        <!-- Missing Instrumentation Alert -->
        ${
          !canPlay
            ? `
          <div class="missing-parts-banner">
            <div><strong>⚠️ Missing Ensemble Parts:</strong> ${missingParts.join(', ')}</div>
            <div style="font-size: 11px; color: #fecdd3; opacity: 0.9;">Visit regional conservatories or wild groves to audition and recruit musicians of these instrument families.</div>
          </div>
        `
            : `
          <div style="font-size: 12px; color: #10b981; font-weight: 600; display: flex; align-items: center; gap: 6px;">
            <span>✓</span> All required instrumental voices present in current ensemble.
          </div>
        `
        }

        <div class="piece-footer">
          <div class="piece-reqs">
            <strong>Required Parts:</strong> ${reqText} | <strong>BPM:</strong> ${piece.bpm} | <strong>Tier:</strong> ${piece.minEnsembleTier.toUpperCase()}
          </div>
          <div>
            ${
              !isOwned
                ? `<button class="btn-select-piece" disabled style="opacity: 0.5; border-color: #64748b; color: #94a3b8; cursor: not-allowed;">Undiscovered Score</button>`
                : !canPlay
                ? `<button class="btn-select-piece" disabled style="opacity: 0.5; border-color: #f43f5e; color: #fca5a5; cursor: not-allowed;">Missing Parts</button>`
                : `<button class="btn-select-piece ${isActive ? 'active' : ''}">${isActive ? 'Active Ensemble Piece ✓' : 'Set as Active Piece'}</button>`
            }
          </div>
        </div>
      `;

      if (isOwned && canPlay) {
        const btnSelect = card.querySelector('.btn-select-piece');
        btnSelect?.addEventListener('click', () => {
          state.ensemble.activePiece = piece;
          this.showToast(`🎵 "${piece.title}" selected as your active ensemble centerpiece!`);
          this.renderRepertoireList();
        });
      }

      listContainer.appendChild(card);
    });
  }

  public renderEnsembleRoster(): void {
    const rosterContainer = document.getElementById('ensemble-roster-list');
    if (!rosterContainer) return;

    const state = this.engine.getState();
    rosterContainer.innerHTML = '';

    const player = state.ensemble.members[0];
    if (player) {
      const loadoutPanel = document.createElement('div');
      loadoutPanel.className = 'loadout-panel';

      const currentSkill = calculateEffectiveSkill(player, state.proficiency, player.instrumentId);
      const general = Math.round((player.stats.technique + player.stats.toneQuality + player.stats.tempoStability + player.stats.sightReading) / 4);
      const sectionScore = state.proficiency.sections[player.section] || 20;
      const mastery = state.proficiency.instruments[player.instrumentId] || { level: 1, xp: 0 };

      loadoutPanel.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #38bdf8; padding-bottom:8px; margin-bottom:12px;">
          <div>
            <span style="font-size:16px; font-weight:bold; color:#f8fafc;">🎼 Maestro's Active Musical Loadout</span>
            <div style="font-size:12px; color:#94a3b8;">Switch instruments & Harmonipet companions to adapt your ensemble!</div>
          </div>
          <div style="text-align:right;">
            <span style="font-size:11px; color:#94a3b8; text-transform:uppercase;">Effective Skill</span>
            <div style="font-size:22px; font-weight:bold; color:#fbbf24; font-family:'Cinzel', serif;">${currentSkill} / 100</div>
          </div>
        </div>

        <div style="background:rgba(15,23,42,0.6); padding:8px 12px; border-radius:6px; font-size:12px; color:#cbd5e1; margin-bottom:12px;">
          📊 <strong>Skill Formula:</strong> General Musicianship (${general} × 50%) + Section Proficiency (${sectionScore} × 30%) + Instrument Mastery (Lv.${mastery.level} × 20%) = <strong>${currentSkill}</strong>
        </div>

        <div style="margin-bottom:12px;">
          <div style="font-size:13px; font-weight:bold; color:#38bdf8; margin-bottom:6px;">🎺 Mastered Instruments (Click to Play):</div>
          <div class="loadout-options-grid" id="instrument-loadout-grid"></div>
        </div>

        <div>
          <div style="font-size:13px; font-weight:bold; color:#ec4899; margin-bottom:6px;">🐾 Bonded Harmonipets (Click to Equip Familiar):</div>
          <div class="loadout-options-grid" id="pet-loadout-grid"></div>
        </div>
      `;

      rosterContainer.appendChild(loadoutPanel);

      // Populate Instruments
      const instGrid = loadoutPanel.querySelector('#instrument-loadout-grid');
      if (instGrid) {
        state.proficiency.unlockedInstruments.forEach(instId => {
          const info = ALL_INSTRUMENTS_INFO[instId];
          if (!info) return;
          const isCurrent = player.instrumentId === instId;
          const instSkill = calculateEffectiveSkill(player, state.proficiency, instId);
          const btn = document.createElement('button');
          btn.className = `loadout-btn ${isCurrent ? 'active' : ''}`;
          btn.innerHTML = `<span>${info.avatar}</span> <span>${info.name}</span> <span style="margin-left:auto; color:#fbbf24; font-size:11px;">★${instSkill}</span>`;
          btn.addEventListener('click', () => {
            this.engine.switchPlayerInstrument(instId);
            this.renderEnsembleRoster();
          });
          instGrid.appendChild(btn);
        });
      }

      // Populate Pets
      const petGrid = loadoutPanel.querySelector('#pet-loadout-grid');
      if (petGrid) {
        const bondedPets = state.harmoniDex.filter(d => d.bonded);
        bondedPets.forEach(p => {
          const isCurrent = player.pet.name === p.name || player.pet.species === p.species;
          const btn = document.createElement('button');
          btn.className = `loadout-btn ${isCurrent ? 'active' : ''}`;
          btn.innerHTML = `<span>${p.sprite}</span> <span>${p.name} (${p.species})</span>`;
          btn.addEventListener('click', () => {
            this.engine.switchPlayerPet(p.id);
            this.renderEnsembleRoster();
          });
          petGrid.appendChild(btn);
        });
      }
    }

    const sectionTitle = document.createElement('div');
    sectionTitle.style.color = '#38bdf8';
    sectionTitle.style.fontWeight = 'bold';
    sectionTitle.style.margin = '14px 0 10px 0';
    sectionTitle.innerText = `👥 Active Ensemble Members (${state.ensemble.members.length} Musicians • ${state.ensemble.tier.toUpperCase()} Tier):`;
    rosterContainer.appendChild(sectionTitle);

    state.ensemble.members.forEach((musician) => {
      const card = document.createElement('div');
      card.className = 'musician-card';
      card.style.borderColor = musician.paletteColor;

      card.innerHTML = `
        <div class="musician-header">
          <span class="musician-avatar">${musician.avatar}</span>
          <div>
            <div class="musician-name">${musician.name} ${musician.isPlayer ? '(Leader)' : ''}</div>
            <div class="musician-inst">${musician.instrumentName} (${musician.section.toUpperCase()})</div>
          </div>
        </div>
        <div class="pet-info">🐾 Familiar: <strong>${musician.pet.name}</strong> (${musician.pet.species})</div>
        <div class="stats-grid">
          <div>TEC: ${musician.stats.technique}</div>
          <div>TON: ${musician.stats.toneQuality}</div>
          <div>TEM: ${musician.stats.tempoStability}</div>
          <div>RDG: ${musician.stats.sightReading}</div>
        </div>
      `;

      rosterContainer.appendChild(card);
    });
  }

  public renderLuthierForge(): void {
    const luthierBody = document.getElementById('luthier-body');
    if (!luthierBody) return;

    const state = this.engine.getState();
    luthierBody.innerHTML = '';

    // Header bar with currencies
    const header = document.createElement('div');
    header.className = 'luthier-header-bar';
    header.innerHTML = `
      <div style="font-weight:bold; color:#f8fafc; font-size:16px;">🔨 Master Luthier Marco's Workbench</div>
      <div style="display:flex; gap:16px; font-weight:bold; font-size:14px;">
        <span style="color:#fbbf24;">💰 Notes: ${state.wallet.gold} ♪</span>
        <span style="color:#38bdf8;">✨ Sparks: ${state.wallet.inspirationSparks} ✨</span>
      </div>
    `;
    luthierBody.appendChild(header);

    // Quest Commission: Elder Timothy's Music Box
    const musicQuest = state.quests.find(q => q.id === 'quest_side_musicbox');
    const hasPins = state.questInventory.includes('brass_music_box_pins');

    const questSection = document.createElement('div');
    questSection.className = 'artifact-card';
    questSection.style.borderColor = hasPins || (musicQuest && musicQuest.completed) ? '#10b981' : '#f59e0b';
    questSection.style.background = 'rgba(30, 41, 59, 0.9)';

    if (musicQuest && musicQuest.completed) {
      questSection.innerHTML = `
        <div style="font-weight:bold; color:#10b981; font-size:15px;">✓ Commission Complete: Elder Timothy's Music Box Pins</div>
        <div style="font-size:13px; color:#cbd5e1;">The custom brass cylinder pins have been delivered. Timothy's heirloom plays beautifully!</div>
      `;
    } else if (hasPins) {
      questSection.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="font-weight:bold; color:#10b981; font-size:15px;">⚙️ Brass Cylinder Pins (Ready in Inventory)</div>
          <span style="font-size:12px; font-weight:bold; color:#10b981; background:rgba(16,185,129,0.2); padding:4px 8px; border-radius:4px;">MACHINED ✓</span>
        </div>
        <div style="font-size:13px; color:#cbd5e1;">Return to Elder Timothy in Cavatina Village plaza to repair his antique music box and claim your reward!</div>
      `;
    } else {
      questSection.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="font-weight:bold; color:#f8fafc; font-size:15px;">⚙️ Special Commission: Brass Cylinder Pins (For Elder Timothy)</div>
          <span style="color:#fbbf24; font-weight:bold; font-size:14px;">30 Notes (♪)</span>
        </div>
        <div style="font-size:13px; color:#94a3b8;">Precision-turned brass pins designed to replace the worn cylinders of vintage music boxes.</div>
        <div style="display:flex; justify-content:flex-end; margin-top:6px;">
          <button id="btn-craft-pins" class="btn-forge" ${state.wallet.gold < 30 ? 'disabled' : ''}>
            🔨 Machine Brass Pins (30 ♪)
          </button>
        </div>
      `;
    }
    luthierBody.appendChild(questSection);

    const btnCraft = questSection.querySelector('#btn-craft-pins');
    if (btnCraft) {
      btnCraft.addEventListener('click', () => {
        if (this.engine.craftQuestPins()) {
          this.renderLuthierForge();
        }
      });
    }

    // Artifacts Catalog Header
    const catalogHeader = document.createElement('div');
    catalogHeader.style.color = '#38bdf8';
    catalogHeader.style.fontWeight = 'bold';
    catalogHeader.style.margin = '16px 0 8px 0';
    catalogHeader.innerText = '🛡️ Signature Instrument Artifacts (Permanent Ensemble Stat & Trait Ascensions):';
    luthierBody.appendChild(catalogHeader);

    // Artifacts List
    state.artifacts.forEach(artifact => {
      const card = document.createElement('div');
      card.className = `artifact-card ${artifact.equipped ? 'equipped' : ''}`;
      
      const canAfford = state.wallet.gold >= artifact.costGold && state.wallet.inspirationSparks >= artifact.costSparks;
      const sectionIcons: Record<string, string> = { strings: '🎻 Strings', woodwinds: '🪈 Woodwinds', brass: '🎺 Brass', percussion: '🥁 Percussion' };

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <span style="font-weight:bold; color:#f8fafc; font-size:15px;">${artifact.name}</span>
            <span style="font-size:12px; color:#38bdf8; margin-left:8px;">[${sectionIcons[artifact.section] || artifact.section}]</span>
          </div>
          <div>
            ${artifact.equipped 
              ? '<span style="color:#10b981; font-weight:bold; font-size:13px;">EQUIPPED ✓</span>' 
              : `<span style="color:#fbbf24; font-weight:bold; font-size:13px;">${artifact.costGold} ♪  +  ${artifact.costSparks} ✨</span>`}
          </div>
        </div>

        <div style="display:flex; gap:16px; font-size:12px; color:#10b981; font-weight:600;">
          <span>+${artifact.bonusTechnique} Technique (TEC)</span>
          <span>+${artifact.bonusTone} Tone Quality (TON)</span>
          <span>+${artifact.bonusTempo} Tempo Stability (TEM)</span>
        </div>

        <div style="font-size:13px; color:#94a3b8; background:rgba(15,23,42,0.5); padding:8px 10px; border-radius:6px; border-left:3px solid #f59e0b;">
          ✨ <strong>Trait: [${artifact.traitName}]</strong> - ${artifact.traitDescription}
        </div>

        ${!artifact.equipped ? `
          <div style="display:flex; justify-content:flex-end; margin-top:4px;">
            <button class="btn-forge btn-forge-art" data-id="${artifact.id}" ${!canAfford ? 'disabled' : ''}>
              🔨 Forge & Equip Artifact
            </button>
          </div>
        ` : ''}
      `;

      luthierBody.appendChild(card);
    });

    luthierBody.querySelectorAll('.btn-forge-art').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = (e.target as HTMLElement).getAttribute('data-id');
        if (id && this.engine.forgeArtifact(id)) {
          this.renderLuthierForge();
        }
      });
    });
  }

  public renderQuestsList(): void {
    const questsContainer = document.getElementById('quests-list');
    if (!questsContainer) return;

    const state = this.engine.getState();
    questsContainer.innerHTML = '';

    const header = document.createElement('div');
    header.style.color = '#38bdf8';
    header.style.fontWeight = 'bold';
    header.style.marginBottom = '12px';
    header.innerText = `Active Commissions & Lost Scores | Track your path to musical renown`;
    questsContainer.appendChild(header);

    // Active Quests
    state.quests.forEach((q) => {
      const card = document.createElement('div');
      card.className = 'repertoire-card';
      card.style.borderColor = q.completed ? '#10b981' : '#38bdf8';

      let typeBadge = '📖 Main Story';
      if (q.type === 'side') typeBadge = '🤝 Local Favor';
      if (q.type === 'gig') typeBadge = '🎭 Festival Gig';
      if (q.type === 'rescue') typeBadge = '🐾 Familiar Rescue';
      if (q.type === 'restoration') typeBadge = '✨ Shrine Restoration';

      card.innerHTML = `
        <div class="piece-header">
          <span class="piece-title">${q.title} <span style="font-size:12px; color:#94a3b8;">[${typeBadge} - Ch.${q.chapter}]</span></span>
          <span style="font-size:13px; font-weight:bold; color:${q.completed ? '#10b981' : '#fbbf24'};">${q.completed ? 'COMPLETED ✓' : 'ACTIVE'}</span>
        </div>
        <div class="piece-desc">${q.description}</div>
        <div class="piece-reqs">Objective: <strong>${q.objective}</strong> | Rewards: +${q.rewardGold} ♪, +${q.rewardSparks} ✨, +${q.rewardStars} ★</div>
      `;
      questsContainer.appendChild(card);
    });

    // Key Items Satchel
    if (state.questInventory.length > 0) {
      const invHeader = document.createElement('div');
      invHeader.style.color = '#fbbf24';
      invHeader.style.fontWeight = 'bold';
      invHeader.style.margin = '14px 0 8px 0';
      invHeader.innerText = '🎒 Quest Satchel Key Items:';
      questsContainer.appendChild(invHeader);

      state.questInventory.forEach(item => {
        const itemCard = document.createElement('div');
        itemCard.className = 'repertoire-card';
        itemCard.style.borderColor = '#fbbf24';
        itemCard.style.padding = '10px 14px';
        itemCard.innerHTML = `
          <div style="font-weight:bold; color:#fbbf24; font-size:14px;">⚙️ ${item === 'brass_music_box_pins' ? 'Brass Cylinder Pins (Machined by Master Marco)' : item}</div>
          <div style="font-size:12px; color:#cbd5e1; margin-top:2px;">Deliver this key item to Elder Timothy in Cavatina Village to complete his restoration commission.</div>
        `;
        questsContainer.appendChild(itemCard);
      });
    }

    // Lost Scores Section
    const scoreHeader = document.createElement('div');
    scoreHeader.style.color = '#fbbf24';
    scoreHeader.style.fontWeight = 'bold';
    scoreHeader.style.margin = '18px 0 10px 0';
    scoreHeader.innerText = `📜 Ancient Lost Scores & Fragment Collection:`;
    questsContainer.appendChild(scoreHeader);

    state.lostScores.forEach((s) => {
      const card = document.createElement('div');
      card.className = 'repertoire-card';
      card.style.opacity = s.unlocked ? '1.0' : '0.6';

      card.innerHTML = `
        <div class="piece-header">
          <span class="piece-title">🎼 ${s.title}</span>
          <span style="font-size:13px; font-weight:bold; color:${s.unlocked ? '#10b981' : '#fbbf24'};">${s.unlocked ? 'UNLOCKED ✓' : 'FRAGMENTS: ' + s.fragmentsFound + '/' + s.totalFragments}</span>
        </div>
        <div class="piece-composer">Composer: ${s.composer}</div>
        <div class="piece-desc">Collect all manuscript fragments scattered across Sonora's shrines and vistas to reconstruct this masterwork.</div>
      `;
      questsContainer.appendChild(card);
    });
  }

  public renderHarmoniDex(): void {
    const dexContainer = document.getElementById('dex-list');
    if (!dexContainer) return;

    const state = this.engine.getState();
    dexContainer.innerHTML = '';

    const bondedCount = state.harmoniDex.filter(d => d.bonded).length;
    const header = document.createElement('div');
    header.style.color = '#38bdf8';
    header.style.fontWeight = 'bold';
    header.style.marginBottom = '12px';
    header.innerText = `Species Bonded: ${bondedCount} / ${state.harmoniDex.length} | Section Master Progress: ${Math.round((bondedCount / state.harmoniDex.length) * 100)}%`;
    dexContainer.appendChild(header);

    state.harmoniDex.forEach((entry) => {
      const card = document.createElement('div');
      card.className = 'musician-card';
      card.style.opacity = entry.discovered ? '1.0' : '0.4';

      if (!entry.discovered) {
        card.innerHTML = `
          <div class="musician-header">
            <span class="musician-avatar">❓</span>
            <div>
              <div class="musician-name">??? (Undiscovered)</div>
              <div class="musician-inst">Section: ${entry.section.toUpperCase()}</div>
            </div>
          </div>
          <div class="piece-desc">Explore the outerworld to encounter and bond with this Harmonipet familiar.</div>
        `;
      } else {
        card.innerHTML = `
          <div class="musician-header">
            <span class="musician-avatar">${entry.sprite}</span>
            <div>
              <div class="musician-name">${entry.species} ${entry.bonded ? '<span style="color:#10b981; font-size:13px;">[BONDED ✓]</span>' : '<span style="color:#fbbf24; font-size:13px;">[SEEN]</span>'}</div>
              <div class="musician-inst">${entry.instrumentName} (${entry.section.toUpperCase()})</div>
            </div>
          </div>
          <div class="piece-desc">${entry.description}</div>
          ${entry.evolvesTo ? `<div style="font-size:12px; color:#a78bfa; margin-top:4px;">✨ Evolution: Evolves to <strong>${entry.evolvesTo}</strong> at Lv.${entry.evolutionLevel}</div>` : ''}
        `;
      }

      dexContainer.appendChild(card);
    });
  }

  public renderBadgesList(): void {
    const badgesContainer = document.getElementById('badges-list');
    if (!badgesContainer) return;

    const state = this.engine.getState();
    badgesContainer.innerHTML = '';

    const earnedCount = state.badges.filter(b => b.obtained).length;
    const header = document.createElement('div');
    header.style.color = '#fbbf24';
    header.style.fontWeight = 'bold';
    header.style.marginBottom = '12px';
    header.innerText = `Conservatory Clef Badges: ${earnedCount} / ${state.badges.length} | Pathway to Grand Maestro`;
    badgesContainer.appendChild(header);

    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
    grid.style.gap = '12px';

    state.badges.forEach((b) => {
      const card = document.createElement('div');
      card.className = 'repertoire-card';
      card.style.opacity = b.obtained ? '1.0' : '0.4';
      card.style.borderColor = b.obtained ? '#fbbf24' : '#334155';

      card.innerHTML = `
        <div class="piece-header">
          <span class="piece-title" style="color:${b.obtained ? '#fbbf24' : '#94a3b8'};">${b.icon} ${b.name}</span>
          <span style="font-size:13px; font-weight:bold; color:${b.obtained ? '#10b981' : '#64748b'};">${b.obtained ? 'OBTAINED ✓' : 'LOCKED'}</span>
        </div>
        <div class="piece-composer">Conservatory: ${b.conservatory}</div>
        <div class="piece-desc">Maestro: <strong>${b.maestroName}</strong> (${b.section.toUpperCase()})</div>
      `;
      grid.appendChild(card);
    });

    badgesContainer.appendChild(grid);
  }

  public renderCustomizationModal(): void {
    const container = document.getElementById('customization-body');
    if (!container) return;

    const state = this.engine.getState();
    const lead = state.ensemble.members[0] || { name: 'Maestro' };
    const cust = state.customization;

    container.innerHTML = `
      <div style="display:flex; flex-direction:column; gap:16px;">
        <!-- Name Input -->
        <div style="background:rgba(15,23,42,0.6); padding:14px; border-radius:10px; border:1px solid #334155;">
          <label style="display:block; color:#38bdf8; font-weight:bold; font-size:14px; margin-bottom:6px;">
            ✏️ Maestro / Character Name:
          </label>
          <input 
            type="text" 
            id="input-maestro-name" 
            value="${lead.name}" 
            maxlength="16" 
            placeholder="Enter Maestro Name..."
            style="width:100%; box-sizing:border-box; padding:10px 14px; background:#1e293b; border:2px solid #38bdf8; border-radius:8px; color:#f8fafc; font-size:16px; font-weight:bold; outline:none;"
          />
        </div>

        <!-- Outfit Color Selection -->
        <div style="background:rgba(15,23,42,0.6); padding:14px; border-radius:10px; border:1px solid #334155;">
          <div style="color:#fbbf24; font-weight:bold; font-size:14px; margin-bottom:8px;">
            👕 Tunic / Outfit Color Palette:
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            ${['#2563eb', '#dc2626', '#059669', '#7c3aed', '#d97706', '#db2777', '#0891b2', '#0f172a'].map(c => `
              <button 
                class="btn-swatch-outfit" 
                data-color="${c}"
                style="width:36px; height:36px; border-radius:50%; background:${c}; border:3px solid ${cust.outfitColor === c ? '#ffffff' : 'transparent'}; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.4);"
              ></button>
            `).join('')}
          </div>
        </div>

        <!-- Hair Color Selection -->
        <div style="background:rgba(15,23,42,0.6); padding:14px; border-radius:10px; border:1px solid #334155;">
          <div style="color:#fbbf24; font-weight:bold; font-size:14px; margin-bottom:8px;">
            💇 Hair Styling Color:
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            ${['#1e293b', '#78350f', '#b45309', '#eab308', '#f8fafc', '#9333ea', '#0284c7', '#be123c'].map(c => `
              <button 
                class="btn-swatch-hair" 
                data-color="${c}"
                style="width:36px; height:36px; border-radius:50%; background:${c}; border:3px solid ${cust.hairColor === c ? '#ffffff' : 'transparent'}; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.4);"
              ></button>
            `).join('')}
          </div>
        </div>

        <!-- Hat Style Selection -->
        <div style="background:rgba(15,23,42,0.6); padding:14px; border-radius:10px; border:1px solid #334155;">
          <div style="color:#fbbf24; font-weight:bold; font-size:14px; margin-bottom:8px;">
            🎩 Headwear & Hat Style:
          </div>
          <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:8px;">
            ${[
              { id: 'beret', label: 'Beret 🎨' },
              { id: 'feather_cap', label: 'Feather Cap 🪶' },
              { id: 'maestro', label: 'Maestro Hat 🎩' },
              { id: 'headband', label: 'Headband 🎗️' },
              { id: 'none', label: 'No Hat ❌' }
            ].map(h => `
              <button 
                class="btn-chip-hat" 
                data-hat="${h.id}"
                style="padding:8px 12px; background:${cust.hatStyle === h.id ? '#2563eb' : '#1e293b'}; border:1px solid ${cust.hatStyle === h.id ? '#38bdf8' : '#475569'}; border-radius:6px; color:#f8fafc; font-size:13px; font-weight:bold; cursor:pointer;"
              >${h.label}</button>
            `).join('')}
          </div>
        </div>

        <!-- Instrument Finish -->
        <div style="background:rgba(15,23,42,0.6); padding:14px; border-radius:10px; border:1px solid #334155;">
          <div style="color:#fbbf24; font-weight:bold; font-size:14px; margin-bottom:8px;">
            🎻 Handheld Instrument Finish:
          </div>
          <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:8px;">
            ${[
              { id: 'classic_amber', label: 'Classic Amber 🎻' },
              { id: 'gilded_gold', label: 'Gilded Gold ✨' },
              { id: 'midnight_obsidian', label: 'Midnight Obsidian 🌌' },
              { id: 'rosewood', label: 'Polished Rosewood 🌹' }
            ].map(f => `
              <button 
                class="btn-chip-finish" 
                data-finish="${f.id}"
                style="padding:8px 12px; background:${cust.instrumentFinish === f.id ? '#2563eb' : '#1e293b'}; border:1px solid ${cust.instrumentFinish === f.id ? '#38bdf8' : '#475569'}; border-radius:6px; color:#f8fafc; font-size:13px; font-weight:bold; cursor:pointer;"
              >${f.label}</button>
            `).join('')}
          </div>
        </div>

        <!-- Harmonipet Tint -->
        <div style="background:rgba(15,23,42,0.6); padding:14px; border-radius:10px; border:1px solid #334155;">
          <div style="color:#fbbf24; font-weight:bold; font-size:14px; margin-bottom:8px;">
            🐾 Harmonipet Familiar Tint:
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            ${['#f59e0b', '#38bdf8', '#eab308', '#c084fc', '#ec4899', '#10b981', '#ffffff'].map(c => `
              <button 
                class="btn-swatch-pet" 
                data-color="${c}"
                style="width:36px; height:36px; border-radius:50%; background:${c}; border:3px solid ${cust.petTint === c ? '#ffffff' : 'transparent'}; cursor:pointer; box-shadow:0 2px 6px rgba(0,0,0,0.4);"
              ></button>
            `).join('')}
          </div>
        </div>

        <!-- Save Button -->
        <button 
          id="btn-save-customization"
          style="padding:14px; background:linear-gradient(135deg, #0284c7, #2563eb); border:none; border-radius:10px; color:#ffffff; font-size:16px; font-weight:bold; cursor:pointer; box-shadow:0 4px 12px rgba(37,99,235,0.4);"
        >
          ✨ Save Character & Apply Style
        </button>
      </div>
    `;

    // Attach listeners
    const nameInput = document.getElementById('input-maestro-name') as HTMLInputElement;

    container.querySelectorAll('.btn-swatch-outfit').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const color = (e.currentTarget as HTMLElement).dataset.color;
        if (color) {
          this.engine.setCustomization({ outfitColor: color });
          this.renderCustomizationModal();
        }
      });
    });

    container.querySelectorAll('.btn-swatch-hair').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const color = (e.currentTarget as HTMLElement).dataset.color;
        if (color) {
          this.engine.setCustomization({ hairColor: color });
          this.renderCustomizationModal();
        }
      });
    });

    container.querySelectorAll('.btn-chip-hat').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const hat = (e.currentTarget as HTMLElement).dataset.hat as any;
        if (hat) {
          this.engine.setCustomization({ hatStyle: hat });
          this.renderCustomizationModal();
        }
      });
    });

    container.querySelectorAll('.btn-chip-finish').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const finish = (e.currentTarget as HTMLElement).dataset.finish as any;
        if (finish) {
          this.engine.setCustomization({ instrumentFinish: finish });
          this.renderCustomizationModal();
        }
      });
    });

    container.querySelectorAll('.btn-swatch-pet').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const color = (e.currentTarget as HTMLElement).dataset.color;
        if (color) {
          this.engine.setCustomization({ petTint: color });
          this.renderCustomizationModal();
        }
      });
    });

    const btnSave = document.getElementById('btn-save-customization');
    if (btnSave) {
      btnSave.addEventListener('click', () => {
        const newName = nameInput?.value?.trim();
        if (newName && state.ensemble.members.length > 0) {
          state.ensemble.members[0].name = newName;
        }
        document.getElementById('modal-customization')?.classList.add('hidden');
        this.showToast('✨ Maestro styling updated!');
      });
    }
  }

  /* ---------------- SONORA OVERWORLD ATLAS ---------------- */

  public renderWorldMapModal(): void {
    const container = document.getElementById('map-body');
    if (!container) return;
    const state = this.engine.getState();

    const regions: { id: ZoneId; name: string; icon: string; section: string; desc: string }[] = [
      { id: 'cavatina_village', name: 'Cavatina Village', icon: '🎻', section: 'Strings Section', desc: 'Central melody hub, Academy conservatory, and Luthier workshop.' },
      { id: 'woodwind_woods', name: 'Woodwind Woods', icon: '🪈', section: 'Woodwinds Section', desc: 'Whispering canopies, reed marshes, and elusive piccolo songbirds.' },
      { id: 'brass_citadel', name: 'The Brass Citadel', icon: '🎺', section: 'Brass Section', desc: 'Gilded ramparts, fanfare bastions, and the Echo Amphitheater.' },
      { id: 'percussion_peaks', name: 'Percussion Peaks', icon: '🥁', section: 'Percussion Section', desc: 'Stepped mountain ghats, resonant stone bells, and taiko calderas.' },
      { id: 'grand_hall', name: 'Grand Symphony Hall', icon: '🏛️', section: 'Eternal Stage', desc: 'The pinnacle of acoustic mastery where four sections unite.' }
    ];

    let cardsHtml = '';
    regions.forEach(r => {
      const isCurrent = state.currentZone === r.id;
      const isDiscovered = state.discoveredZones[r.id];
      cardsHtml += `
        <div class="atlas-region-card ${isCurrent ? 'active' : ''}">
          <div class="atlas-region-header">
            <span>${r.icon} ${r.name}</span>
            <span style="font-size: 11px; color: ${isCurrent ? '#fbbf24' : (isDiscovered ? '#38bdf8' : '#64748b')};">
              ${isCurrent ? '📍 YOU ARE HERE' : (isDiscovered ? '✓ Discovered' : '🔒 Unexplored')}
            </span>
          </div>
          <div style="font-size: 12px; font-weight: 600; color: #cbd5e1;">${r.section}</div>
          <div class="atlas-region-desc">${r.desc}</div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="atlas-container">
        <!-- Interactive Cartography Canvas -->
        <div class="atlas-map-canvas">
          <svg viewBox="0 0 800 360" style="width: 100%; height: 100%; filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));">
            <defs>
              <linearGradient id="roadGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8" />
                <stop offset="100%" stop-color="#fbbf24" stop-opacity="0.8" />
              </linearGradient>
            </defs>

            <!-- Ocean / Archipelago Background -->
            <rect width="800" height="360" fill="#0b1329" />
            <circle cx="400" cy="180" r="140" fill="rgba(56, 189, 248, 0.04)" />

            <!-- Connecting Musical Roads -->
            <!-- North Road to Citadel -->
            <line x1="400" y1="180" x2="400" y2="60" stroke="url(#roadGlow)" stroke-width="4" stroke-dasharray="6,6" />
            <!-- East Road to Woods -->
            <line x1="400" y1="180" x2="650" y2="180" stroke="url(#roadGlow)" stroke-width="4" stroke-dasharray="6,6" />
            <!-- South Road to Peaks -->
            <line x1="400" y1="180" x2="400" y2="300" stroke="url(#roadGlow)" stroke-width="4" stroke-dasharray="6,6" />
            <!-- West Road to Grand Hall -->
            <line x1="400" y1="180" x2="150" y2="180" stroke="url(#roadGlow)" stroke-width="4" stroke-dasharray="6,6" />

            <!-- Nodes / Realm Landmarks -->
            <!-- Brass Citadel (North) -->
            <g transform="translate(400, 60)" cursor="pointer">
              <circle r="36" fill="#78350f" stroke="#eab308" stroke-width="3" />
              <text text-anchor="middle" y="6" font-size="22">🎺</text>
              <text text-anchor="middle" y="48" fill="#f8fafc" font-size="12" font-weight="700" font-family="Inter">Brass Citadel</text>
            </g>

            <!-- Woodwind Woods (East) -->
            <g transform="translate(650, 180)" cursor="pointer">
              <circle r="36" fill="#064e3b" stroke="#10b981" stroke-width="3" />
              <text text-anchor="middle" y="6" font-size="22">🪈</text>
              <text text-anchor="middle" y="48" fill="#f8fafc" font-size="12" font-weight="700" font-family="Inter">Woodwind Woods</text>
            </g>

            <!-- Percussion Peaks (South) -->
            <g transform="translate(400, 300)" cursor="pointer">
              <circle r="36" fill="#3b0764" stroke="#8b5cf6" stroke-width="3" />
              <text text-anchor="middle" y="6" font-size="22">🥁</text>
              <text text-anchor="middle" y="48" fill="#f8fafc" font-size="12" font-weight="700" font-family="Inter">Percussion Peaks</text>
            </g>

            <!-- Grand Symphony Hall (West) -->
            <g transform="translate(150, 180)" cursor="pointer">
              <circle r="36" fill="#831843" stroke="#ec4899" stroke-width="3" />
              <text text-anchor="middle" y="6" font-size="22">🏛️</text>
              <text text-anchor="middle" y="48" fill="#f8fafc" font-size="12" font-weight="700" font-family="Inter">Grand Hall</text>
            </g>

            <!-- Cavatina Village (Center) -->
            <g transform="translate(400, 180)" cursor="pointer">
              <circle r="44" fill="#0c4a6e" stroke="#38bdf8" stroke-width="4" />
              <text text-anchor="middle" y="8" font-size="26">🎻</text>
              <text text-anchor="middle" y="58" fill="#f8fafc" font-size="13" font-weight="800" font-family="Inter">Cavatina Village</text>
            </g>

            <!-- Pulsing Current Location Pin -->
            ${state.currentZone === 'cavatina_village' ? '<circle cx="400" cy="140" r="8" fill="#fbbf24"><animate attributeName="r" values="6;12;6" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/></circle><text x="400" y="130" fill="#fbbf24" font-size="12" font-weight="800" text-anchor="middle">YOU</text>' : ''}
            ${state.currentZone === 'woodwind_woods' ? '<circle cx="650" cy="140" r="8" fill="#fbbf24"><animate attributeName="r" values="6;12;6" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/></circle><text x="650" y="130" fill="#fbbf24" font-size="12" font-weight="800" text-anchor="middle">YOU</text>' : ''}
            ${state.currentZone === 'brass_citadel' ? '<circle cx="400" cy="20" r="8" fill="#fbbf24"><animate attributeName="r" values="6;12;6" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/></circle><text x="400" y="10" fill="#fbbf24" font-size="12" font-weight="800" text-anchor="middle">YOU</text>' : ''}
            ${state.currentZone === 'percussion_peaks' ? '<circle cx="400" cy="260" r="8" fill="#fbbf24"><animate attributeName="r" values="6;12;6" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/></circle><text x="400" y="250" fill="#fbbf24" font-size="12" font-weight="800" text-anchor="middle">YOU</text>' : ''}
            ${state.currentZone === 'grand_hall' ? '<circle cx="150" cy="140" r="8" fill="#fbbf24"><animate attributeName="r" values="6;12;6" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite"/></circle><text x="150" y="130" fill="#fbbf24" font-size="12" font-weight="800" text-anchor="middle">YOU</text>' : ''}
          </svg>
        </div>

        <!-- Regional Guide List -->
        <div class="atlas-region-grid">
          ${cardsHtml}
        </div>
      </div>
    `;
  }

  /* ---------------- SYSTEM MENU & SETTINGS ---------------- */

  public renderSystemMenuModal(): void {
    const container = document.getElementById('system-body');
    if (!container) return;

    const hasSave = !!localStorage.getItem('harmonia_saved_game');

    container.innerHTML = `
      <div class="system-grid">
        <!-- Persistence -->
        <div class="system-section">
          <div class="system-section-title">💾 Adventure Save & Load</div>
          <div class="system-btn-row">
            <button id="btn-action-save" class="btn-system-action">💾 Save Progress</button>
            <button id="btn-action-load" class="btn-system-action" ${!hasSave ? 'style="opacity: 0.5; pointer-events: none;"' : ''}>📂 Load Save</button>
            <button id="btn-action-restart" class="btn-system-action btn-system-danger">🔄 Restart Game</button>
          </div>
          <div style="font-size: 12px; color: #94a3b8;">
            Progress is preserved in your browser local storage. Auto-saved on major milestones.
          </div>
        </div>

        <!-- Audio Settings -->
        <div class="system-section">
          <div class="system-section-title">🔊 Audio & Harmonics</div>
          <div class="setting-row">
            <span>Background Music (BGM)</span>
            <input type="range" id="slider-bgm" class="slider-input" min="0" max="100" value="80">
          </div>
          <div class="setting-row">
            <span>Sound Effects & Leitmotifs</span>
            <input type="range" id="slider-sfx" class="slider-input" min="0" max="100" value="85">
          </div>
        </div>

        <!-- Maestro Controls Quick Guide -->
        <div class="system-section">
          <div class="system-section-title">📖 Maestro Controls Quick-Reference</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 13px; color: #cbd5e1;">
            <div><strong style="color: #38bdf8;">[W A S D] / [Arrows]</strong> : Move Maestro</div>
            <div><strong style="color: #38bdf8;">[SPACE]</strong> : Interact / Audition</div>
            <div><strong style="color: #38bdf8;">[M]</strong> : Sonora Overworld Atlas</div>
            <div><strong style="color: #38bdf8;">[P]</strong> : Metronome Practice Shed</div>
            <div><strong style="color: #38bdf8;">[R]</strong> : Sheet Music Repertoire</div>
            <div><strong style="color: #38bdf8;">[E]</strong> : Ensemble Roster & Pets</div>
            <div><strong style="color: #38bdf8;">[C]</strong> : Styling Studio & Finishes</div>
            <div><strong style="color: #38bdf8;">[ESC]</strong> : Close Modals / System Menu</div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-action-save')?.addEventListener('click', () => {
      const ok = this.engine.saveGame();
      if (ok) {
        this.showToast('💾 Adventure progress saved successfully!');
        this.renderSystemMenuModal();
      } else {
        this.showToast('⚠️ Could not save progress.');
      }
    });

    document.getElementById('btn-action-load')?.addEventListener('click', () => {
      const ok = this.engine.loadGame();
      if (ok) {
        this.showToast('📂 Saved game loaded successfully!');
        document.getElementById('modal-system')?.classList.add('hidden');
      } else {
        this.showToast('⚠️ No save game found.');
      }
    });

    document.getElementById('btn-action-restart')?.addEventListener('click', () => {
      if (confirm('Are you sure you want to restart your journey? All progress will be reset.')) {
        this.engine.restartGame();
        document.getElementById('modal-system')?.classList.add('hidden');
        this.showToast('🔄 Adventure reset to beginning.');
      }
    });

    const sliderBgm = document.getElementById('slider-bgm') as HTMLInputElement;
    if (sliderBgm) {
      sliderBgm.addEventListener('input', (e) => {
        const val = parseFloat((e.target as HTMLInputElement).value) / 100;
        soundEngine.setMasterVolume(val * 0.4);
      });
    }
  }

  public showToast(message: string): void {
    let toast = document.querySelector('.harmonia-toast') as HTMLElement;
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'harmonia-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }
}
